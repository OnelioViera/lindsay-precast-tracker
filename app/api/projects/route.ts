import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import { projectSchema } from '@/lib/validations';

// GET /api/projects - Get all projects with filtering
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const customerId = searchParams.get('customerId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (type) query.productType = type;
    if (customerId) query.customerId = customerId;
    if (search) {
      query.$or = [
        { projectNumber: new RegExp(search, 'i') },
        { customerName: new RegExp(search, 'i') },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body = await req.json();
    
    const validatedData = projectSchema.parse(body);
    
    // Convert startDate string to Date object for storage
    if (validatedData.startDate && typeof validatedData.startDate === 'string') {
      (validatedData as any).startDate = new Date(validatedData.startDate);
    }

    await connectDB();

    // Get customer info
    const customer = await Customer.findById(validatedData.customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Use provided project number or auto-generate one
    let projectNumber: string = (validatedData as any).projectNumber || '';
    
    if (!projectNumber) {
      // Auto-generate project number
      const year = new Date().getFullYear();
      const lastProject = await Project.findOne({
        projectNumber: new RegExp(`^PRJ-${year}-`)
      }).sort({ projectNumber: -1 });

      let sequence = 1;
      if (lastProject) {
        const lastSequence = parseInt(lastProject.projectNumber.split('-')[2]);
        sequence = lastSequence + 1;
      }

      projectNumber = `PRJ-${year}-${sequence.toString().padStart(3, '0')}`;
    }

    // Create project
    const project = await Project.create({
      projectNumber,
      projectName: validatedData.projectName,
      customerId: validatedData.customerId,
      customerName: customer.name,
      startDate: (validatedData as any).startDate,
      productType: validatedData.productType,
      structures: validatedData.structures || [],
      specifications: validatedData.specifications,
      status: 'requested',
      timeTracking: {
        totalHours: 0,
        entries: [],
      },
      revisions: [],
      drawings: [],
      productionHandoff: {
        sentToProduction: false,
        checklist: {
          drawingsFinalized: false,
          specificationsVerified: false,
          customerApprovalReceived: false,
          materialListConfirmed: false,
          productionNotesAdded: false,
        },
        rfis: [],
      },
      createdBy: (session.user as any).id,
    });

    // Update customer project history
    await Customer.findByIdAndUpdate(validatedData.customerId, {
      $inc: { 
        'projectHistory.totalProjects': 1,
        'projectHistory.activeProjects': 1,
      },
      $push: {
        'projectHistory.recentProjectIds': {
          $each: [project._id],
          $position: 0,
          $slice: 5,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: {
        id: project._id.toString(),
        projectNumber: project.projectNumber,
        status: project.status,
        createdAt: project.createdAt,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    // Handle duplicate project number
    if (error.code === 11000 && error.keyPattern?.projectNumber) {
      try {
        const existingProject = await Project.findOne({ projectNumber: error.keyValue?.projectNumber }).lean();
        const proj = existingProject as any;
        return NextResponse.json(
          {
            success: false,
            message: `Project number "${error.keyValue?.projectNumber}" is already taken`,
            existingProject: proj ? {
              id: proj._id?.toString(),
              projectNumber: proj.projectNumber,
              projectName: proj.projectName,
              customerName: proj.customerName,
            } : null,
          },
          { status: 400 }
        );
      } catch (lookupError) {
        console.error('Error looking up existing project:', lookupError);
      }
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}


