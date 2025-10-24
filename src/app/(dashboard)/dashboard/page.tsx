'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    activeProjects: number
    completedProjects: number
    totalCustomers: number
    hoursThisWeek: number
  }
  recentProjects: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data:', err)
        setIsLoading(false)
      })
  }, [])

  const stats = [
    {
      title: 'Active Projects',
      value: isLoading ? '...' : (data?.stats.activeProjects || 0).toString(),
      icon: FolderOpen,
    },
    {
      title: 'Total Customers',
      value: isLoading ? '...' : (data?.stats.totalCustomers || 0).toString(),
      icon: Users,
    },
    {
      title: 'Hours This Week',
      value: isLoading ? '...' : (data?.stats.hoursThisWeek || 0).toFixed(1),
      icon: Clock,
    },
    {
      title: 'Completed Projects',
      value: isLoading ? '...' : (data?.stats.completedProjects || 0).toString(),
      icon: CheckCircle,
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      design: 'bg-blue-100 text-blue-800',
      engineering: 'bg-purple-100 text-purple-800',
      production: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s an overview of your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Loading...' : 'Total count'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest project updates</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : !data?.recentProjects || data.recentProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/projects/new">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Create New Project
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentProjects.map((project: any) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {project.customerId?.name || 'Unknown Customer'}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/projects/new">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Create New Project
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/customers/new">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Customer
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/library">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse Library
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

