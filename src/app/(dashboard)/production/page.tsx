'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'

interface ProductionProject {
  id: string
  projectNumber: string
  customerName: string
  productType: string
  status: 'approved' | 'production'
  productionHandoff: {
    sentToProduction: boolean
    handoffDate?: string
    checklist: {
      drawingsFinalized: boolean
      specificationsVerified: boolean
      customerApprovalReceived: boolean
      materialListConfirmed: boolean
      productionNotesAdded: boolean
    }
    rfis: {
      id: string
      question: string
      status: 'open' | 'answered'
      askedAt: string
    }[]
  }
}

export default function ProductionPage() {
  const [projects, setProjects] = useState<ProductionProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductionProjects()
  }, [])

  const fetchProductionProjects = async () => {
    try {
      const response = await fetch('/api/projects?status=approved,production')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data.projects)
      }
    } catch (error) {
      console.error('Error fetching production projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { variant: 'default' as const, label: 'Ready for Production' },
      production: { variant: 'secondary' as const, label: 'In Production' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.approved
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getChecklistProgress = (checklist: any) => {
    const total = Object.keys(checklist).length
    const completed = Object.values(checklist).filter(Boolean).length
    return { completed, total, percentage: (completed / total) * 100 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Production</h1>
        <p className="text-gray-600">Manage production handoffs and RFIs</p>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Production</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects awaiting handoff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Production</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === 'production').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open RFIs</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((acc, p) => acc + p.productionHandoff.rfis.filter(rfi => rfi.status === 'open').length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Questions pending answers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Handoffs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.productionHandoff.sentToProduction).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully handed off
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Production Projects */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => {
          const checklistProgress = getChecklistProgress(project.productionHandoff.checklist)
          const openRFIs = project.productionHandoff.rfis.filter(rfi => rfi.status === 'open').length

          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <Link 
                        href={`/projects/${project.id}`}
                        className="hover:text-primary"
                      >
                        {project.projectNumber}
                      </Link>
                    </CardTitle>
                    <CardDescription>{project.customerName} • {project.productType}</CardDescription>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Checklist Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Handoff Checklist</span>
                      <span className="text-gray-600">
                        {checklistProgress.completed}/{checklistProgress.total} complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${checklistProgress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {checklistProgress.percentage === 100 
                        ? 'Ready for production handoff'
                        : `${Math.round(checklistProgress.percentage)}% complete`
                      }
                    </div>
                  </div>

                  {/* RFIs */}
                  {openRFIs > 0 && (
                    <div className="flex items-center text-sm text-orange-600">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {openRFIs} open RFI{openRFIs !== 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/projects/${project.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                    {project.status === 'approved' && checklistProgress.percentage === 100 && (
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Send to Production
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No production projects</h3>
            <p className="text-gray-600 text-center mb-4">
              Projects will appear here once they are approved and ready for production.
            </p>
            <Button asChild>
              <Link href="/projects">
                <Clock className="mr-2 h-4 w-4" />
                View All Projects
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
