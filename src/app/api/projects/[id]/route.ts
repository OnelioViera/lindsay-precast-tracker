import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import { projectUpdateSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const project = await Project.findById(params.id)
      .populate('customerId', 'name contactInfo')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('drawings.uploadedBy', 'name email')
      .populate('timeTracking.entries.userId', 'name email')
      .populate('revisions.completedBy', 'name email')
      .populate('productionHandoff.rfis.askedBy', 'name email')
      .populate('productionHandoff.rfis.answeredBy', 'name email')
      .lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Role-based access check
    if (session.user.role === 'designer') {
      const createdById = typeof (project as any).createdBy === 'object' 
        ? (project as any).createdBy?._id?.toString() 
        : (project as any).createdBy?.toString();
      const assignedToId = typeof (project as any).assignedTo === 'object'
        ? (project as any).assignedTo?._id?.toString()
        : (project as any).assignedTo?.toString();
      
      if (createdById !== session.user.id && assignedToId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = projectUpdateSchema.parse(body);

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Role-based access check
    if (session.user.role === 'designer') {
      const createdById = (project as any).createdBy?.toString?.() || (project as any).createdBy;
      const assignedToId = (project as any).assignedTo?.toString?.() || (project as any).assignedTo;
      
      if (createdById !== session.user.id && assignedToId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Update project
    Object.assign(project, validatedData);
    await (project as any).save();

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        id: project._id,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only managers can delete projects
    if (session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    await Project.findByIdAndDelete(params.id);

    // Update customer project history
    const customer = await Customer.findById(project.customerId);
    if (customer) {
      customer.projectHistory.totalProjects -= 1;
      if (project.status !== 'production') {
        customer.projectHistory.activeProjects -= 1;
      }
      await customer.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
