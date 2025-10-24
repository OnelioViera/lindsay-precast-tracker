'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    preferences: {
      customSpecs: [] as string[],
      notes: '',
      preferredProducts: [] as string[],
      requiresStampedDrawings: false,
      expeditedTurnaround: false,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/customers')
      } else {
        setError(data.error || 'Failed to create customer')
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
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600">Create a new customer profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Customer details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>Customer location (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main St"
                  value={formData.contactInfo.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: {
                      ...formData.contactInfo,
                      address: { ...formData.contactInfo.address, street: e.target.value }
                    }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.contactInfo.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        address: { ...formData.contactInfo.address, city: e.target.value }
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    maxLength={2}
                    value={formData.contactInfo.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        address: { ...formData.contactInfo.address, state: e.target.value.toUpperCase() }
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="12345"
                    maxLength={5}
                    value={formData.contactInfo.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        address: { ...formData.contactInfo.address, zipCode: e.target.value }
                      }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customer-specific requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Any special requirements or notes..."
                  value={formData.preferences.notes}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, notes: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresStampedDrawings"
                    checked={formData.preferences.requiresStampedDrawings}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, requiresStampedDrawings: e.target.checked }
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <Label htmlFor="requiresStampedDrawings" className="font-normal">
                    Requires stamped drawings
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="expeditedTurnaround"
                    checked={formData.preferences.expeditedTurnaround}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, expeditedTurnaround: e.target.checked }
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <Label htmlFor="expeditedTurnaround" className="font-normal">
                    Expedited turnaround required
                  </Label>
                </div>
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
              <Link href="/customers">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

