import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { userSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    console.log('Register: Starting registration process');
    const body = await request.json();
    console.log('Register: Body received:', { ...body, password: '[REDACTED]' });
    
    // Validate input
    console.log('Register: Validating data');
    const validatedData = userSchema.parse(body);
    console.log('Register: Data validated successfully');
    
    await connectDB();
    console.log('Register: Connected to DB');
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: validatedData.email.toLowerCase() 
    });
    console.log('Register: Checked existing user:', existingUser ? 'Found' : 'Not found');
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    console.log('Register: Hashing password');
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    console.log('Register: Password hashed successfully');
    
    // Create user
    console.log('Register: Creating user');
    const user: any = await User.create({
      ...validatedData,
      password: hashedPassword,
      email: validatedData.email.toLowerCase(),
    });
    console.log('Register: User created:', user._id);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    console.log('Register: Returning user data');
    
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown');
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
