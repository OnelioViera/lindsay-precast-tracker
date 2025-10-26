'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { Download, Eye, Factory } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';

export default function ProductionPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductionProjects();
  }, []);

  const fetchProductionProjects = async () => {
    try {
      const res = await fetch('/api/projects?status=production');
      const data = await res.json();

      if (data.success) {
        setProjects(data.data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch production projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (project: Project) => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Production Job Report', 20, yPosition);
      yPosition += 15;

      // Project Header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Project Information', 20, yPosition);
      yPosition += 8;

      // Project details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Project Number: ${project.projectNumber}`, 20, yPosition);
      yPosition += 5;
      if (project.projectName) {
        doc.text(`Project Name: ${project.projectName}`, 20, yPosition);
        yPosition += 5;
      }
      doc.text(`Customer: ${project.customerName}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Product Type: ${project.productType}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Status: ${project.status}`, 20, yPosition);
      yPosition += 8;

      // Structures Section
      if (project.structures && project.structures.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Structures:', 20, yPosition);
        yPosition += 5;
        doc.setFont('helvetica', 'normal');
        project.structures.forEach((structure) => {
          doc.text(`• ${structure.customName || structure.type}`, 25, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      // Specifications Section
      doc.setFont('helvetica', 'bold');
      doc.text('Specifications:', 20, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`Length: ${project.specifications.length} ft`, 25, yPosition);
      yPosition += 4;
      doc.text(`Width: ${project.specifications.width} ft`, 25, yPosition);
      yPosition += 4;
      doc.text(`Height: ${project.specifications.height} ft`, 25, yPosition);
      yPosition += 4;
      if (project.specifications.wallThickness) {
        doc.text(`Wall Thickness: ${project.specifications.wallThickness} in`, 25, yPosition);
        yPosition += 4;
      }
      yPosition += 3;

      // Custom Notes
      if (project.specifications.customNotes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 20, yPosition);
        yPosition += 4;
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(project.specifications.customNotes, 170);
        doc.text(noteLines, 25, yPosition);
        yPosition += noteLines.length * 4 + 3;
      }

      // Time Tracking
      if (project.timeTracking.totalHours > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Time Tracking:', 20, yPosition);
        yPosition += 4;
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Hours: ${project.timeTracking.totalHours.toFixed(2)} hrs`, 25, yPosition);
        yPosition += 5;
      }

      // Production Handoff Checklist
      doc.setFont('helvetica', 'bold');
      doc.text('Production Handoff Checklist:', 20, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      
      const checklistItems = [
        { key: 'drawingsFinalized', label: 'Drawings Finalized' },
        { key: 'specificationsVerified', label: 'Specifications Verified' },
        { key: 'customerApprovalReceived', label: 'Customer Approval Received' },
        { key: 'materialListConfirmed', label: 'Material List Confirmed' },
        { key: 'productionNotesAdded', label: 'Production Notes Added' },
      ];

      checklistItems.forEach((item) => {
        const checked = (project.productionHandoff.checklist as any)[item.key] ? '✓' : '✗';
        doc.text(`${checked} ${item.label}`, 25, yPosition);
        yPosition += 4;
      });

      yPosition += 3;
      doc.setFont('helvetica', 'bold');
      if (project.productionHandoff.sentToProduction) {
        doc.text(`Sent to Production: Yes`, 20, yPosition);
        if (project.productionHandoff.handoffDate) {
          yPosition += 4;
          doc.text(`Handoff Date: ${new Date(project.productionHandoff.handoffDate).toLocaleDateString()}`, 20, yPosition);
        }
      } else {
        doc.text(`Sent to Production: No`, 20, yPosition);
      }

      // Save
      doc.save(`Production_${project.projectNumber}.pdf`);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading production projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Production</h1>
        <p className="text-gray-600 mt-1">Projects sent to production ({projects.length})</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Factory className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No projects in production yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Projects will appear here once they are sent to production
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">{project.projectNumber}</h3>
                      {project.projectName && (
                        <span className="text-sm text-gray-600">- {project.projectName}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Customer: {project.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent to Production: {project.productionHandoff.handoffDate ? formatDate(project.productionHandoff.handoffDate) : 'N/A'}
                    </p>
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
                      onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


