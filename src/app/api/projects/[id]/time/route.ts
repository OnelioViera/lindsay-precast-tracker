import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import TimeEntry from '@/models/TimeEntry';
import { timeTrackingActionSchema } from '@/lib/validations';

export async function POST(
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
    const validatedData = timeTrackingActionSchema.parse(body);

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    if (session.user.role === 'designer' && 
        project.createdBy.toString() !== session.user.id &&
        project.assignedTo?.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    if (validatedData.action === 'start') {
      // Check if user already has a running timer
      const runningEntry = await TimeEntry.findOne({
        userId: session.user.id,
        isRunning: true
      });

      if (runningEntry) {
        return NextResponse.json(
          { success: false, error: 'You already have a running timer' },
          { status: 400 }
        );
      }

      // Create new time entry
      const timeEntry: any = await TimeEntry.create({
        projectId: params.id,
        userId: session.user.id,
        startTime: new Date(),
        endTime: new Date(), // Will be updated when stopped
        duration: 0,
        notes: validatedData.notes,
        isRunning: true,
      });

      return NextResponse.json({
        success: true,
        data: {
          timeEntryId: timeEntry._id,
          isRunning: true,
          startTime: timeEntry.startTime
        }
      });
    } else if (validatedData.action === 'stop') {
      // Find the running timer for this user
      const runningEntry: any = await TimeEntry.findOne({
        userId: session.user.id,
        isRunning: true
      });

      if (!runningEntry) {
        return NextResponse.json(
          { success: false, error: 'No running timer found' },
          { status: 400 }
        );
      }

      // Stop the timer
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - runningEntry.startTime.getTime()) / 60000); // minutes

      runningEntry.endTime = endTime;
      runningEntry.duration = duration;
      runningEntry.isRunning = false;
      if (validatedData.notes) {
        runningEntry.notes = validatedData.notes;
      }
      await runningEntry.save();

      // Update project total hours
      project.timeTracking.totalHours += duration / 60; // Convert to hours
      project.timeTracking.entries.push({
        userId: session.user.id,
        startTime: runningEntry.startTime,
        endTime: endTime,
        duration: duration,
        notes: runningEntry.notes,
      });
      await project.save();

      return NextResponse.json({
        success: true,
        data: {
          timeEntryId: runningEntry._id,
          isRunning: false,
          duration: duration,
          totalHours: project.timeTracking.totalHours
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Time tracking error:', error);
    
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
