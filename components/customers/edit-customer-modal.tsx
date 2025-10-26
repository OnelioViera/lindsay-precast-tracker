'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Customer } from '@/types';

interface EditCustomerModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCustomerModal({ isOpen, customer, onClose, onSuccess }: EditCustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.contactInfo.email,
        phone: customer.contactInfo.phone,
        address: customer.contactInfo.address?.street || '',
        city: customer.contactInfo.address?.city || '',
        state: customer.contactInfo.address?.state || '',
        zipCode: customer.contactInfo.address?.zipCode || '',
      });
      setError('');
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format phone number to (xxx) xxx-xxxx
    const formatPhoneNumber = (phone: string) => {
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 10) {
        setError('Phone number must be 10 digits');
        setLoading(false);
        return null;
      }
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!formattedPhone) return;

    try {
      const res = await fetch(`/api/customers/${customer?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contactInfo: {
            email: formData.email,
            phone: formattedPhone,
            address: {
              street: formData.address || undefined,
              city: formData.city || undefined,
              state: formData.state ? formData.state.toUpperCase().slice(0, 2) : undefined,
              zipCode: formData.zipCode || undefined,
            },
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to update customer');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Customer</h2>
            <p className="text-sm text-gray-600 mt-1">Update customer information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter company name"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      disabled
                      className="mt-2 bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    required
                    className="mt-2"
                  />
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter street address"
                    className="mt-2"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="Zip code"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Customer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

