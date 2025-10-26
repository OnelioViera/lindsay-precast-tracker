import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { userSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = userSchema.parse(body);
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: validatedData.email.toLowerCase() 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      role: validatedData.role,
      phone: validatedData.phone,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}


