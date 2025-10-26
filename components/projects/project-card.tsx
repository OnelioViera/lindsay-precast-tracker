'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';
import { Edit, FileDown, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownloadPDF?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onDownloadPDF, onClick }: ProjectCardProps) {
  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      requested: 'status-pending',
      inprogress: 'status-inprogress',
      review: 'status-review',
      approved: 'status-completed',
      production: 'status-production',
    };
    return classes[status] || 'status-pending';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      requested: 'Requested',
      inprogress: 'In Progress',
      review: 'Review',
      approved: 'Approved',
      production: 'Production',
    };
    return labels[status] || status;
  };

  return (
    <Card 
      className="bg-gray-50 border-l-4 border-indigo-500 hover:translate-x-1 cursor-pointer"
      onClick={() => onClick?.(project._id!)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {project.customerName} - Job #{project.projectNumber}
            </h3>
            {project.projectName && (
              <p className="text-sm font-semibold text-indigo-600 mb-2">{project.projectName}</p>
            )}
            <div className="text-sm text-gray-600 space-y-1">
              <p>Date: {formatDate(project.createdAt!)}</p>
              <p>Type: {project.productType}</p>
              {project.structures && project.structures.length > 0 && (
                <p>Structures: {project.structures.length} ({project.structures.map(s => s.type).join(', ')})</p>
              )}
              <p>Dimensions: {project.specifications.length}&apos; × {project.specifications.width}&apos; × {project.specifications.height}&apos;</p>
              {project.timeTracking.totalHours > 0 && (
                <p>Total Time: {project.timeTracking.totalHours.toFixed(2)} hrs</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className={getStatusClass(project.status)}>
              {getStatusLabel(project.status)}
            </span>
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(project._id!);
                }}
                className="px-3 py-1 text-sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadPDF?.(project._id!);
                }}
                className="px-3 py-1 text-sm"
              >
                <FileDown className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(project._id!);
                }}
                className="px-3 py-1 text-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {project.specifications.customNotes && (
          <div className="mt-3 p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Notes:</span> {project.specifications.customNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


