import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import { projectSchema, searchFiltersSchema } from '@/lib/validations';

// Generate project number
async function generateProjectNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const lastProject = await Project.findOne({
    projectNumber: new RegExp(`^PRJ-${year}-`)
  }).sort({ projectNumber: -1 });
  
  let sequence = 1;
  if (lastProject) {
    const lastSequence = parseInt(
      lastProject.projectNumber.split('-')[2]
    );
    sequence = lastSequence + 1;
  }
  
  return `PRJ-${year}-${sequence.toString().padStart(3, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      customerId: searchParams.get('customerId') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };

    // Validate filters
    const validatedFilters = searchFiltersSchema.parse(filters);

    // Build query
    const query: any = {};
    
    if (validatedFilters.status) {
      query.status = validatedFilters.status;
    }
    
    if (validatedFilters.type) {
      query.productType = validatedFilters.type;
    }
    
    if (validatedFilters.customerId) {
      query.customerId = validatedFilters.customerId;
    }
    
    if (validatedFilters.search) {
      query.$or = [
        { projectNumber: new RegExp(validatedFilters.search, 'i') },
        { customerName: new RegExp(validatedFilters.search, 'i') },
      ];
    }

    // Role-based filtering
    if (session.user.role === 'designer') {
      query.$or = [
        { createdBy: session.user.id },
        { assignedTo: session.user.id }
      ];
    }

    const skip = (validatedFilters.page - 1) * validatedFilters.limit;
    const sort: any = {};
    sort[validatedFilters.sortBy] = validatedFilters.sortOrder === 'asc' ? 1 : -1;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('customerId', 'name contactInfo.email')
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(validatedFilters.limit)
        .lean(),
      Project.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          page: validatedFilters.page,
          limit: validatedFilters.limit,
          pages: Math.ceil(total / validatedFilters.limit)
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    await connectDB();

    // Get customer info
    const customer = await Customer.findById(validatedData.customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Generate project number
    const projectNumber = await generateProjectNumber();

    // Create project
    const project = await Project.create({
      ...validatedData,
      projectNumber,
      customerName: customer.name,
      createdBy: session.user.id,
    });

    // Update customer project history
    customer.projectHistory.totalProjects += 1;
    customer.projectHistory.activeProjects += 1;
    customer.projectHistory.recentProjectIds.unshift(project._id);
    if (customer.projectHistory.recentProjectIds.length > 5) {
      customer.projectHistory.recentProjectIds = customer.projectHistory.recentProjectIds.slice(0, 5);
    }
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: {
        id: project._id,
        projectNumber: project.projectNumber,
        status: project.status,
        createdAt: project.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
