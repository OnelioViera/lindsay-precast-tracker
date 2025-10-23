'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderOpen, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Active Projects',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FolderOpen,
    },
    {
      title: 'Total Customers',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Hours This Week',
      value: '342',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Clock,
    },
    {
      title: 'Completed Projects',
      value: '18',
      change: '+5%',
      changeType: 'positive' as const,
      icon: CheckCircle,
    },
  ]

  const recentProjects = [
    {
      id: '1',
      projectNumber: 'PRJ-2025-034',
      customerName: 'City Water Works',
      productType: 'storm',
      status: 'inprogress',
      createdAt: '2025-10-20T08:00:00Z',
    },
    {
      id: '2',
      projectNumber: 'PRJ-2025-033',
      customerName: 'Metro Construction',
      productType: 'sanitary',
      status: 'review',
      createdAt: '2025-10-19T14:30:00Z',
    },
    {
      id: '3',
      projectNumber: 'PRJ-2025-032',
      customerName: 'Downtown Development',
      productType: 'electrical',
      status: 'approved',
      createdAt: '2025-10-18T10:15:00Z',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { variant: 'outline' as const, label: 'Requested' },
      inprogress: { variant: 'default' as const, label: 'In Progress' },
      review: { variant: 'secondary' as const, label: 'Under Review' },
      approved: { variant: 'default' as const, label: 'Approved' },
      production: { variant: 'secondary' as const, label: 'In Production' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.requested
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
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
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest project updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/projects/${project.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {project.projectNumber}
                      </Link>
                      {getStatusBadge(project.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.customerName} • {project.productType}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
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
