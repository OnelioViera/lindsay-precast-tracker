import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/db'
import Project from '@/models/Project'
import Customer from '@/models/Customer'
import TimeEntry from '@/models/TimeEntry'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Get counts based on user role
    const userId = session.user.id
    const userRole = session.user.role

    let projectFilter: any = {}
    
    // Designers can only see their own projects
    if (userRole === 'designer') {
      projectFilter = {
        $or: [
          { createdBy: userId },
          { assignedTo: userId }
        ]
      }
    }

    // Get statistics
    const [
      activeProjects,
      completedProjects,
      totalCustomers,
      recentProjects,
      weeklyHours
    ] = await Promise.all([
      // Active projects
      Project.countDocuments({
        ...projectFilter,
        status: { $in: ['design', 'engineering', 'production'] }
      }),
      
      // Completed projects
      Project.countDocuments({
        ...projectFilter,
        status: 'completed'
      }),
      
      // Total customers (everyone can see all customers)
      Customer.countDocuments(),
      
      // Recent projects (last 5)
      Project.find(projectFilter)
        .populate('customerId', 'name')
        .populate('assignedTo', 'name')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      
      // Hours this week
      TimeEntry.aggregate([
        {
          $match: {
            userId: userId,
            date: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
          }
        },
        {
          $group: {
            _id: null,
            totalHours: { $sum: '$hoursWorked' }
          }
        }
      ])
    ])

    return NextResponse.json({
      stats: {
        activeProjects,
        completedProjects,
        totalCustomers,
        hoursThisWeek: weeklyHours[0]?.totalHours || 0
      },
      recentProjects
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

