import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import { customerSchema, searchFiltersSchema } from '@/lib/validations';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Validate filters
    const validatedFilters = searchFiltersSchema.parse(filters);

    // Build query
    const query: any = {};
    
    if (validatedFilters.search) {
      query.$or = [
        { name: new RegExp(validatedFilters.search, 'i') },
        { 'contactInfo.email': new RegExp(validatedFilters.search, 'i') },
      ];
    }

    const skip = (validatedFilters.page - 1) * validatedFilters.limit;

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(validatedFilters.limit)
        .lean(),
      Customer.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          total,
          page: validatedFilters.page,
          limit: validatedFilters.limit,
          pages: Math.ceil(total / validatedFilters.limit)
        }
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only managers can create customers
    if (session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = customerSchema.parse(body);

    await connectDB();
    
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ 
      'contactInfo.email': validatedData.contactInfo.email.toLowerCase() 
    });
    
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    // Create customer
    const customer = await Customer.create({
      ...validatedData,
      contactInfo: {
        ...validatedData.contactInfo,
        email: validatedData.contactInfo.email.toLowerCase(),
      },
      projectHistory: {
        totalProjects: 0,
        activeProjects: 0,
        completedThisYear: 0,
        recentProjectIds: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      data: {
        id: customer._id,
        name: customer.name
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create customer error:', error);
    
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
