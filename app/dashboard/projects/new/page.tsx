'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface Structure {
  id: string;
  type: 'SSMH' | 'SDMH' | 'Inlets' | 'Vaults' | 'Meter Pits' | 'Air Vacuum Pits';
  customName?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    projectName: '',
    projectNumber: '',
    startDate: '',
    notes: '',
  });
  const [newStructure, setNewStructure] = useState({
    type: 'SSMH' as Structure['type'],
    customName: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data.customers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleAddStructure = () => {
    if (!newStructure.type) {
      alert('Please select a structure type');
      return;
    }

    const structure: Structure = {
      id: Date.now().toString(),
      type: newStructure.type,
      customName: newStructure.customName.trim() ? newStructure.customName.trim() : undefined,
    };

    setStructures([...structures, structure]);
    setNewStructure({
      type: 'SSMH',
      customName: '',
    });
  };

  const handleRemoveStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.projectName || !formData.projectNumber) {
      alert('Please fill in all required fields');
      return;
    }

    if (structures.length === 0) {
      alert('Please add at least one structure');
      return;
    }

    setLoading(true);

    try {
      // Find the customer name
      const selectedCustomer = customers.find(c => c._id === formData.customerId);
      const customerName = selectedCustomer?.name || '';

      const projectData = {
        customerId: formData.customerId,
        projectNumber: formData.projectNumber,
        projectName: formData.projectName,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        productType: 'storm', // Default type
        specifications: {
          length: 1, // Default to 1 ft to pass validation
          width: 1,
          height: 1,
          customNotes: formData.notes,
        },
        structures: structures.map(s => ({
          type: s.type,
          customName: s.customName || s.type,
        })),
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/projects');
      } else {
        // Handle duplicate project number error
        if (data.existingProject) {
          addToast({
            title: 'Project Number Already Exists',
            message: `Job #${data.existingProject.projectNumber} is already taken by "${data.existingProject.projectName || data.existingProject.customerName}"`,
            type: 'error',
          });
        } else {
          addToast({
            title: 'Error',
            message: data.message || 'Failed to create project',
            type: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      addToast({
        title: 'Error',
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const structureTypes: Structure['type'][] = ['SSMH', 'SDMH', 'Inlets', 'Vaults', 'Meter Pits', 'Air Vacuum Pits'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          variant="default"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
        <p className="text-gray-600 mt-1">Fill in the project details below</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="customer">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id!}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Enter project name"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="projectNumber">Project Number *</Label>
                <Input
                  id="projectNumber"
                  value={formData.projectNumber}
                  onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                  placeholder="Enter project number"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
            </div>

            {/* Structures Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Structures</h3>
              
              {/* Add New Structure */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="structureType">Structure Type *</Label>
                    <Select
                      value={newStructure.type}
                      onValueChange={(value: any) => setNewStructure({ ...newStructure, type: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {structureTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customName">Custom Structure Name</Label>
                    <Input
                      id="customName"
                      value={newStructure.customName}
                      onChange={(e) => setNewStructure({ ...newStructure, customName: e.target.value })}
                      placeholder="e.g., Inlet A, North Vault"
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAddStructure}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Structure
                </Button>
              </div>

              {/* Structures List */}
              {structures.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-700">Added Structures ({structures.length})</h4>
                  {structures.map((structure) => {
                    return (
                      <div
                        key={structure.id}
                        className="flex items-center justify-between p-4 bg-white border-2 border-indigo-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {structure.customName || structure.type}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleRemoveStructure(structure.id)}
                          className="ml-4 px-3 py-1 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {structures.length === 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm mb-6">
                  ℹ️ No structures added yet. Add at least one structure to continue.
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="border-t pt-6">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes or special requirements..."
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || structures.length === 0}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


