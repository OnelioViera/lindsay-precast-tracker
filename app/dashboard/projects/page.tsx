'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditProjectModal } from '@/components/projects/edit-project-modal';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/lib/toast-context';
import { Project } from '@/types';
import { Plus, Search, Edit, Trash2, Download, Eye } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ProjectsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();

      if (data.success) {
        // Filter out production projects from main projects list
        const activeProjects = data.data.projects.filter((p: Project) => p.status !== 'production');
        setProjects(activeProjects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      addToast({
        title: 'Error',
        message: 'Failed to fetch projects',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    const projectToDelete = projects.find(p => p._id === deleteConfirmId);
    const projectName = projectToDelete?.projectName || projectToDelete?.projectNumber || 'this project';

    setIsDeleting(true);

    try {
      console.log('Deleting project:', deleteConfirmId);
      const res = await fetch(`/api/projects/${deleteConfirmId}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', res.status);
      const data = await res.json();
      console.log('Delete response:', data);

      if (res.ok) {
        setProjects(projects.filter(p => p._id !== deleteConfirmId));
        addToast({
          title: 'Success',
          message: `Project "${projectName}" deleted successfully`,
          type: 'success',
        });
        setDeleteConfirmId(null);
      } else {
        addToast({
          title: 'Error',
          message: data.message || 'Failed to delete project',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      addToast({
        title: 'Error',
        message: 'Failed to delete project. Please try again.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = (project: Project) => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Project Report', 20, 20);

      // Project details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Customer: ${project.customerName}`, 20, 35);
      doc.text(`Project Number: ${project.projectNumber}`, 20, 45);
      if (project.projectName) {
        doc.text(`Project Name: ${project.projectName}`, 20, 55);
      }
      doc.text(`Product Type: ${project.productType}`, 20, 65);
      doc.text(`Status: ${project.status}`, 20, 75);

      // Specifications
      doc.setFont('helvetica', 'bold');
      doc.text('Specifications:', 20, 90);
      doc.setFont('helvetica', 'normal');
      doc.text(`Length: ${project.specifications.length} ft`, 20, 100);
      doc.text(`Width: ${project.specifications.width} ft`, 20, 110);
      doc.text(`Height: ${project.specifications.height} ft`, 20, 120);
      if (project.specifications.wallThickness) {
        doc.text(`Wall Thickness: ${project.specifications.wallThickness} in`, 20, 130);
      }

      // Time tracking
      if (project.timeTracking.totalHours > 0) {
        doc.text(`Total Hours: ${project.timeTracking.totalHours.toFixed(2)} hrs`, 20, 140);
      }

      // Save
      doc.save(`Project_${project.projectNumber}.pdf`);
      addToast({
        title: 'Success',
        message: 'PDF downloaded successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to download PDF:', error);
      addToast({
        title: 'Error',
        message: 'Failed to download PDF',
        type: 'error',
      });
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const projectToDelete = projects.find(p => p._id === deleteConfirmId);
  const projectName = projectToDelete?.projectName || projectToDelete?.projectNumber || 'Project';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your design projects</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/dashboard/projects/new')}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> Projects sent to production are displayed in the <a href="/dashboard/production" className="underline hover:text-blue-900 font-semibold">Production section</a>. This shows only active projects.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No projects found. Create your first project!</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => router.push(`/dashboard/projects/${project._id}`)}>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">{project.projectNumber}</h3>
                      {project.projectName && (
                        <span className="text-sm text-gray-600">- {project.projectName}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Customer: {project.customerName}</p>
                    {project.startDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Start Date: {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {/* Structures */}
                    {project.structures && project.structures.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 font-semibold">Structures:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.structures.map((structure, idx) => (
                            <span key={idx} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                              {structure.customName || structure.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Status and Production Handoff */}
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
                          project.status === 'approved' ? 'bg-green-100 text-green-800' :
                          project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('inprogress', 'In Progress')}
                      </button>
                      
                      {/* Production Handoff Status */}
                      {project.productionHandoff?.sentToProduction ? (
                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                          ✓ Sent to Production
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
                          Not Sent
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      className="p-2"
                      onClick={() => handleDownloadPDF(project)}
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      className="p-2"
                      onClick={() => {
                        const projectToEdit = projects.find(p => p._id === project._id);
                        if (projectToEdit) {
                          setSelectedProject(projectToEdit);
                          setShowEditModal(true);
                        }
                      }}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="p-2"
                      onClick={() => handleDeleteClick(project._id!)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EditProjectModal
        isOpen={showEditModal}
        project={selectedProject}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        onSuccess={fetchProjects}
      />

      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}


