'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  _id: string
  name: string
  contactInfo: {
    email: string
  }
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    customerId: '',
    productType: 'storm' as 'storm' | 'sanitary' | 'electrical' | 'meter',
    specifications: {
      length: '',
      width: '',
      height: '',
      wallThickness: '',
      customNotes: '',
    },
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      if (data.success) {
        setCustomers(data.data.customers)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: formData.customerId,
          productType: formData.productType,
          specifications: {
            length: parseFloat(formData.specifications.length),
            width: parseFloat(formData.specifications.width),
            height: parseFloat(formData.specifications.height),
            wallThickness: formData.specifications.wallThickness 
              ? parseFloat(formData.specifications.wallThickness) 
              : undefined,
            customNotes: formData.specifications.customNotes || undefined,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/projects')
      } else {
        setError(data.error || 'Failed to create project')
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
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600">Add a new precast design project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Basic information about the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <select
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No customers found. <Link href="/customers/new" className="text-primary hover:underline">Create one first</Link>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <select
                  id="productType"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="storm">Storm</option>
                  <option value="sanitary">Sanitary</option>
                  <option value="electrical">Electrical</option>
                  <option value="meter">Meter</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>Project dimensions and details</CardDescription>
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
                    value={formData.specifications.length}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, length: e.target.value }
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
                    value={formData.specifications.width}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, width: e.target.value }
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
                    value={formData.specifications.height}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, height: e.target.value }
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
                  value={formData.specifications.wallThickness}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, wallThickness: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customNotes">Custom Notes</Label>
                <textarea
                  id="customNotes"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Any special requirements or notes..."
                  value={formData.specifications.customNotes}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, customNotes: e.target.value }
                  })}
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
              <Link href="/projects">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

