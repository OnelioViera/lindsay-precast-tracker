import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !(session.user as any).id) {
      console.error('No session or user ID found');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { name, role } = await req.json();

    if (!name || !role) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Convert to ObjectId if needed
    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const user = await User.findByIdAndUpdate(
      objectId,
      { name, role },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

