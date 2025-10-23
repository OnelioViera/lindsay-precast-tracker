// Temporarily disabled for CodeSandbox - replace with actual mongoose in production
// import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  _id: string;
  projectNumber: string;
  customerId: string;
  customerName: string;
  productType: 'storm' | 'sanitary' | 'electrical' | 'meter';
  status: 'requested' | 'inprogress' | 'review' | 'approved' | 'production';
  specifications: {
    length: number;
    width: number;
    height: number;
    wallThickness?: number;
    customNotes?: string;
  };
  drawings: {
    _id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    version: number;
    uploadedBy: string;
    uploadedAt: Date;
    mimeType: string;
  }[];
  timeTracking: {
    totalHours: number;
    entries: {
      _id: string;
      userId: string;
      startTime: Date;
      endTime: Date;
      duration: number;
      notes?: string;
    }[];
  };
  revisions: {
    _id: string;
    revisionNumber: number;
    date: Date;
    description: string;
    requestedBy: string;
    completedBy?: string;
  }[];
  productionHandoff: {
    sentToProduction: boolean;
    handoffDate?: Date;
    checklist: {
      drawingsFinalized: boolean;
      specificationsVerified: boolean;
      customerApprovalReceived: boolean;
      materialListConfirmed: boolean;
      productionNotesAdded: boolean;
    };
    rfis: {
      _id: string;
      question: string;
      askedBy: string;
      askedAt: Date;
      answer?: string;
      answeredBy?: string;
      answeredAt?: Date;
      status: 'open' | 'answered';
    }[];
  };
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Mock Project model for CodeSandbox
const Project = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  findOne: () => Promise.resolve(null),
  countDocuments: () => Promise.resolve(0),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default Project;
