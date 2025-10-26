
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2 } from 'lucide-react';
import { Project, Customer } from '@/types';

interface Structure {
  id: string;
  type: 'SSMH' | 'SDMH' | 'Inlets' | 'Vaults' | 'Meter Pits' | 'Air Vacuum Pits';
  customName?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProjectModal({ isOpen, project, onClose, onSuccess }: EditProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [newStructure, setNewStructure] = useState({
    type: 'SSMH' as Structure['type'],
    customName: '',
  });
  const [formData, setFormData] = useState({
    customerId: '',
    projectName: '',
    projectNumber: '',
    customerName: '',
    startDate: '',
    customNotes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        customerId: project.customerId,
        projectName: project.projectName || '',
        projectNumber: project.projectNumber,
        customerName: project.customerName,
        startDate: project.startDate 
          ? typeof project.startDate === 'string' 
            ? project.startDate.split('T')[0] 
            : new Date(project.startDate).toISOString().split('T')[0]
          : '',
        customNotes: project.specifications.customNotes || '',
      });
      
      // Initialize structures from project
      if (project.structures && project.structures.length > 0) {
        const structuresWithIds = project.structures.map((s, index) => ({
          id: index.toString(),
          type: s.type,
          customName: s.customName,
        }));
        setStructures(structuresWithIds);
      } else {
        setStructures([]);
      }
      
      setError('');
      setNewStructure({
        type: 'SSMH',
        customName: '',
      });
    }
  }, [project, isOpen]);

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
      setError('Please select a structure type');
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
    setError('');
  };

  const handleRemoveStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/projects/${project?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectNumber: formData.projectNumber,
          projectName: formData.projectName,
          startDate: formData.startDate ? new Date(formData.startDate) : undefined,
          structures: structures.map(s => ({
            type: s.type,
            customName: s.customName || s.type,
          })),
          'specifications.customNotes': formData.customNotes || '',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        console.error('Update error response:', data);
        setError(data.message || 'Failed to update project');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  const structureTypes: Structure['type'][] = ['SSMH', 'SDMH', 'Inlets', 'Vaults', 'Meter Pits', 'Air Vacuum Pits'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
            <p className="text-sm text-gray-600 mt-1">Update project information</p>
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
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="customer">Customer *</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => {
                        const selected = customers.find(c => c._id === value);
                        setFormData({
                          ...formData,
                          customerId: value,
                          customerName: selected?.name || '',
                        });
                      }}
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
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="Enter project name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectNumber">Project Number *</Label>
                    <Input
                      id="projectNumber"
                      value={formData.projectNumber}
                      onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                      placeholder="Enter project number"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  {/* Removed Product Type */}
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
                      {structures.map((structure) => (
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
                      ))}
                    </div>
                  )}

                  {structures.length === 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm mb-6">
                      ℹ️ No structures added yet. Add at least one structure to continue.
                    </div>
                  )}
                </div>

                {/* Custom Notes */}
                <div>
                  <Label htmlFor="customNotes">Custom Notes</Label>
                  <Textarea
                    id="customNotes"
                    value={formData.customNotes}
                    onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                    placeholder="Enter any custom notes for this project"
                    className="mt-2"
                    rows={4}
                  />
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
                    disabled={loading || structures.length === 0}
                  >
                    {loading ? 'Updating...' : 'Update Project'}
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
