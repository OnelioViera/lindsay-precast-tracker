'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Library, Plus, Search, Download, Eye } from 'lucide-react'
import Link from 'next/link'

interface LibraryTemplate {
  id: string
  templateName: string
  productCategory: 'storm' | 'sanitary' | 'electrical' | 'meter' | 'rebar' | 'cad'
  dimensions: {
    length: number
    width: number
    height: number
    wallThickness?: number
  }
  loadRequirements: {
    designLoad: string
    soilCover: string
    waterTable: string
  }
  usageCount: number
  isActive: boolean
  createdAt: string
}

export default function LibraryPage() {
  const [templates, setTemplates] = useState<LibraryTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/library')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      storm: { variant: 'default' as const, label: 'Storm' },
      sanitary: { variant: 'secondary' as const, label: 'Sanitary' },
      electrical: { variant: 'outline' as const, label: 'Electrical' },
      meter: { variant: 'default' as const, label: 'Meter' },
      rebar: { variant: 'secondary' as const, label: 'Rebar' },
      cad: { variant: 'outline' as const, label: 'CAD' },
    }
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.cad
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.templateName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.productCategory === categoryFilter
    return matchesSearch && matchesCategory && template.isActive
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600">Browse and manage product templates and specifications</p>
        </div>
        <Button asChild>
          <Link href="/library/new">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Categories</option>
                <option value="storm">Storm</option>
                <option value="sanitary">Sanitary</option>
                <option value="electrical">Electrical</option>
                <option value="meter">Meter</option>
                <option value="rebar">Rebar</option>
                <option value="cad">CAD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  <Link 
                    href={`/library/${template.id}`}
                    className="hover:text-primary"
                  >
                    {template.templateName}
                  </Link>
                </CardTitle>
                {getCategoryBadge(template.productCategory)}
              </div>
              <CardDescription>
                Used {template.usageCount} times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Dimensions:</span> {template.dimensions.length}' × {template.dimensions.width}' × {template.dimensions.height}'
                </div>
                {template.dimensions.wallThickness && (
                  <div className="text-sm">
                    <span className="font-medium">Wall Thickness:</span> {template.dimensions.wallThickness}"
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium">Design Load:</span> {template.loadRequirements.designLoad}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Soil Cover:</span> {template.loadRequirements.soilCover}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/library/${template.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Library className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first template.'
              }
            </p>
            <Button asChild>
              <Link href="/library/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
