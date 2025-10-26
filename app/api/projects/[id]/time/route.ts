import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';

// POST /api/projects/[id]/time - Start/stop time tracking
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, notes } = body;
    const userId = (session.user as any).id;

    await connectDB();
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    if (action === 'start') {
      // Check if there's already a running timer for this user
      const runningEntry = project.timeTracking.entries.find(
        (entry: any) => entry.userId.toString() === userId && entry.isRunning
      );

      if (runningEntry) {
        return NextResponse.json(
          { success: false, message: 'Timer already running' },
          { status: 400 }
        );
      }

      // Create new time entry
      const newEntry = {
        userId,
        startTime: new Date(),
        duration: 0,
        notes: notes || '',
        isRunning: true,
      };

      project.timeTracking.entries.push(newEntry);
      await project.save();

      const addedEntry = project.timeTracking.entries[project.timeTracking.entries.length - 1];

      return NextResponse.json({
        success: true,
        data: {
          timeEntryId: addedEntry._id.toString(),
          isRunning: true,
          startTime: addedEntry.startTime,
        },
      });
    } else if (action === 'stop') {
      // Find running timer for this user
      const runningEntry = project.timeTracking.entries.find(
        (entry: any) => entry.userId.toString() === userId && entry.isRunning
      );

      if (!runningEntry) {
        return NextResponse.json(
          { success: false, message: 'No running timer found' },
          { status: 400 }
        );
      }

      // Calculate duration
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - runningEntry.startTime.getTime()) / 60000); // minutes

      runningEntry.endTime = endTime;
      runningEntry.duration = duration;
      runningEntry.isRunning = false;

      // Update total hours
      const totalMinutes = project.timeTracking.entries.reduce(
        (sum: number, entry: any) => sum + (entry.duration || 0),
        0
      );
      project.timeTracking.totalHours = Number((totalMinutes / 60).toFixed(2));

      await project.save();

      return NextResponse.json({
        success: true,
        data: {
          timeEntryId: runningEntry._id.toString(),
          isRunning: false,
          endTime: runningEntry.endTime,
          duration: runningEntry.duration,
          totalHours: project.timeTracking.totalHours,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Time tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

