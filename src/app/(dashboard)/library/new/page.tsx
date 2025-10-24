'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewLibraryTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    templateName: '',
    productCategory: 'storm' as 'storm' | 'sanitary' | 'electrical' | 'meter' | 'rebar' | 'cad',
    dimensions: {
      length: '',
      width: '',
      height: '',
      wallThickness: '',
    },
    loadRequirements: {
      designLoad: '',
      soilCover: '',
      waterTable: '',
    },
    rebarSchedule: '',
    autocadTemplate: {
      fileName: '',
      filePath: '',
      version: '1',
    },
    notes: '',
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dimensions: {
            length: parseFloat(formData.dimensions.length),
            width: parseFloat(formData.dimensions.width),
            height: parseFloat(formData.dimensions.height),
            wallThickness: formData.dimensions.wallThickness 
              ? parseFloat(formData.dimensions.wallThickness) 
              : undefined,
          },
          autocadTemplate: {
            ...formData.autocadTemplate,
            version: parseInt(formData.autocadTemplate.version),
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/library')
      } else {
        setError(data.error || 'Failed to create template')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/library">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Library Template</h1>
          <p className="text-gray-600">Add a new reusable design template</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
              <CardDescription>Basic details about the template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name *</Label>
                <Input
                  id="templateName"
                  placeholder="e.g., Standard Storm Drain 48x48"
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategory">Product Category *</Label>
                <select
                  id="productCategory"
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="storm">Storm</option>
                  <option value="sanitary">Sanitary</option>
                  <option value="electrical">Electrical</option>
                  <option value="meter">Meter</option>
                  <option value="rebar">Rebar</option>
                  <option value="cad">CAD Template</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimensions</CardTitle>
              <CardDescription>Standard dimensions for this template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (ft) *</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.dimensions.length}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, length: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width (ft) *</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, width: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (ft) *</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, height: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallThickness">Wall Thickness (in)</Label>
                <Input
                  id="wallThickness"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={formData.dimensions.wallThickness}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, wallThickness: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Load Requirements</CardTitle>
              <CardDescription>Engineering specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="designLoad">Design Load *</Label>
                <Input
                  id="designLoad"
                  placeholder="e.g., H-20, HS-25"
                  value={formData.loadRequirements.designLoad}
                  onChange={(e) => setFormData({
                    ...formData,
                    loadRequirements: { ...formData.loadRequirements, designLoad: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilCover">Soil Cover *</Label>
                <Input
                  id="soilCover"
                  placeholder="e.g., 2-6 feet"
                  value={formData.loadRequirements.soilCover}
                  onChange={(e) => setFormData({
                    ...formData,
                    loadRequirements: { ...formData.loadRequirements, soilCover: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterTable">Water Table *</Label>
                <Input
                  id="waterTable"
                  placeholder="e.g., Below invert, At invert"
                  value={formData.loadRequirements.waterTable}
                  onChange={(e) => setFormData({
                    ...formData,
                    loadRequirements: { ...formData.loadRequirements, waterTable: e.target.value }
                  })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>Rebar and AutoCAD information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rebarSchedule">Rebar Schedule *</Label>
                <textarea
                  id="rebarSchedule"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter rebar specifications..."
                  value={formData.rebarSchedule}
                  onChange={(e) => setFormData({ ...formData, rebarSchedule: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileName">AutoCAD File Name *</Label>
                <Input
                  id="fileName"
                  placeholder="template-storm-48x48.dwg"
                  value={formData.autocadTemplate.fileName}
                  onChange={(e) => setFormData({
                    ...formData,
                    autocadTemplate: { ...formData.autocadTemplate, fileName: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filePath">File Path *</Label>
                <Input
                  id="filePath"
                  placeholder="/templates/storm/"
                  value={formData.autocadTemplate.filePath}
                  onChange={(e) => setFormData({
                    ...formData,
                    autocadTemplate: { ...formData.autocadTemplate, filePath: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Additional notes or comments..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/library">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

