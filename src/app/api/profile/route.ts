import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'

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
    const user = await User.findOne({ email: session.user.email }).select('-password')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, emailNotifications, productionNotifications, weeklyReports } = body

    await connectDB()
    
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if new email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
    }

    // Update user fields
    user.name = name
    user.email = email
    if (phone !== undefined) user.phone = phone
    
    // Update preferences
    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications
    if (productionNotifications !== undefined) user.preferences.productionNotifications = productionNotifications
    if (weeklyReports !== undefined) user.preferences.weeklyReports = weeklyReports

    await user.save()

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password')

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile UPDATE error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

