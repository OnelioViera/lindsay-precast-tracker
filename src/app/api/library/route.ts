import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import LibraryTemplate from '@/models/LibraryTemplate';
import { libraryTemplateSchema, searchFiltersSchema } from '@/lib/validations';
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
      category: searchParams.get('category') || undefined,
      active: searchParams.get('active') !== 'false',
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Build query
    const query: any = {};
    
    if (filters.category) {
      query.productCategory = filters.category;
    }
    
    if (filters.active !== undefined) {
      query.isActive = filters.active;
    }
    
    if (filters.search) {
      query.$or = [
        { templateName: new RegExp(filters.search, 'i') },
        { notes: new RegExp(filters.search, 'i') },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;

    const [templates, total] = await Promise.all([
      LibraryTemplate.find(query)
        .populate('createdBy', 'name email')
        .sort({ usageCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(filters.limit)
        .lean(),
      LibraryTemplate.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        templates,
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          pages: Math.ceil(total / filters.limit)
        }
      }
    });
  } catch (error) {
    console.error('Get library templates error:', error);
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

    // Only engineers and managers can create templates
    if (!['engineer', 'manager'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = libraryTemplateSchema.parse(body);

    await connectDB();
    
    // Check if template already exists
    const existingTemplate = await LibraryTemplate.findOne({ 
      templateName: validatedData.templateName,
      productCategory: validatedData.productCategory
    });
    
    if (existingTemplate) {
      return NextResponse.json(
        { success: false, error: 'Template with this name already exists for this category' },
        { status: 400 }
      );
    }

    // Create template
    const template = await LibraryTemplate.create({
      ...validatedData,
      createdBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Template created successfully',
      data: {
        id: template._id,
        templateName: template.templateName
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create template error:', error);
    
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
