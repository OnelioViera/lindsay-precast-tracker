'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditProjectModal } from '@/components/projects/edit-project-modal';
import { Project } from '@/types';
import { ArrowLeft, Edit, Save, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Await params and set the ID
    const initializeParams = async () => {
      const { id } = await params;
      setProjectId(id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // Update project state for immediate UI feedback
    if (project) {
      const updates: any = {
        ...project,
        status: newStatus as any,
      };
      
      // If changing away from production status, clear production handoff data
      if (newStatus !== 'production' && project.status === 'production') {
        updates.productionHandoff = {
          ...project.productionHandoff,
          sentToProduction: false,
          handoffDate: undefined,
        };
      }
      
      setProject(updates);
    }
    
    // Track the change in pendingChanges
    const changes: any = {
      ...pendingChanges,
      status: newStatus,
    };
    
    // If changing away from production status, clear production handoff data
    if (newStatus !== 'production' && project?.status === 'production') {
      changes['productionHandoff.sentToProduction'] = false;
      changes['productionHandoff.handoffDate'] = null;
    }
    
    setPendingChanges(changes);
  };

  const handleChecklistToggle = (key: string) => {
    if (!project) return;
    
    const updatedChecklist = {
      ...project.productionHandoff.checklist,
      [key]: !(project.productionHandoff.checklist[key as keyof typeof project.productionHandoff.checklist]),
    };

    // Update the local project state for immediate UI feedback
    setProject({
      ...project,
      productionHandoff: {
        ...project.productionHandoff,
        checklist: updatedChecklist,
      },
    });

    setPendingChanges({
      ...pendingChanges,
      'productionHandoff.checklist': updatedChecklist,
    });
  };

  const handleSendToProduction = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'productionHandoff.sentToProduction': true,
          'productionHandoff.handoffDate': new Date().toISOString(),
          status: 'production',
        }),
      });

      if (res.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error('Failed to send to production:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      addToast({
        title: 'No Changes',
        message: 'There are no changes to save',
        type: 'info',
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingChanges),
      });

      if (res.ok) {
        setPendingChanges({});
        fetchProject();
        addToast({
          title: 'Success',
          message: 'Project updated successfully',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Error',
          message: 'Failed to save changes',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      addToast({
        title: 'Error',
        message: 'An error occurred while saving',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectId || !project) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        addToast({
          title: 'Success',
          message: `Project "${project.projectName || project.projectNumber}" deleted successfully`,
          type: 'success',
        });
        setDeleteConfirmId(null);
        // Redirect to production page if project was in production, otherwise to projects
        const redirectUrl = project.status === 'production' ? '/dashboard/production' : '/dashboard/projects';
        router.push(redirectUrl);
      } else {
        const data = await res.json();
        addToast({
          title: 'Error',
          message: data.message || 'Failed to delete project',
          type: 'error',
        });
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      addToast({
        title: 'Error',
        message: 'Failed to delete project. Please try again.',
        type: 'error',
      });
      setDeleteConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const isChecklistComplete = project ? Object.values(project.productionHandoff.checklist).every(v => v) : false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project not found</p>
        <Button onClick={() => router.push('/dashboard/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const statusOptions = ['requested', 'inprogress', 'review', 'approved', 'production'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Button
          variant="default"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.projectNumber}</h1>
            <p className="text-gray-600 mt-1">{project.customerName}</p>
            {Object.keys(pendingChanges).length > 0 && (
              <p className="text-sm text-orange-600 mt-2 font-semibold">⚠️ You have unsaved changes</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(pendingChanges).length > 0 && (
              <Button
                variant="primary"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            <Button variant="success" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteConfirmId(projectId)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {project.projectName && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Project Name</p>
                    <p className="text-lg">{project.projectName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Project Number</p>
                  <p className="text-lg">{project.projectNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Product Type</p>
                  <p className="text-lg capitalize">{project.productType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Customer</p>
                  <p className="text-lg">{project.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Created</p>
                  <p className="text-lg">{formatDate(project.createdAt!)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {project.structures && project.structures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Structures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.structures.map((structure, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {structure.customName && structure.customName !== structure.type 
                            ? structure.customName 
                            : structure.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {project.specifications.customNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{project.specifications.customNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full p-3 rounded-lg text-left font-medium transition-all ${
                      project.status === status
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('inprogress', 'In Progress')}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Handoff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(project.productionHandoff.checklist).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleChecklistToggle(key)}
                      className="h-5 w-5 accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
              {project.productionHandoff.sentToProduction && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold">
                    ✓ Sent to Production
                  </p>
                  {project.productionHandoff.handoffDate && (
                    <p className="text-xs text-green-600 mt-1">
                      {formatDate(project.productionHandoff.handoffDate)}
                    </p>
                  )}
                </div>
              )}
              {!project.productionHandoff.sentToProduction && (
                <Button
                  variant="success"
                  onClick={handleSendToProduction}
                  disabled={!isChecklistComplete}
                  className="w-full mt-4"
                >
                  Send to Production
                </Button>
              )}
              {project.productionHandoff.sentToProduction && (
                <div className="space-y-2 mt-4">
                  <Button
                    variant="success"
                    onClick={handleSendToProduction}
                    disabled={!isChecklistComplete}
                    className="w-full"
                  >
                    Resubmit to Production
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    You can modify the checklist and resubmit
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProjectModal
        isOpen={showEditModal}
        project={project}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchProject}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Project"
        message={`Are you sure you want to delete this project? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

