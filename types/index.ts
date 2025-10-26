export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'designer' | 'engineer' | 'manager' | 'production';
  phone?: string;
  avatar?: string;
  preferences: {
    emailNotifications: boolean;
    productionNotifications: boolean;
    weeklyReports: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface Project {
  _id?: string;
  projectNumber: string;
  projectName?: string;
  customerId: string;
  customerName: string;
  startDate?: Date | string;
  structures?: Array<{
    type: 'SSMH' | 'SDMH' | 'Inlets' | 'Vaults' | 'Meter Pits' | 'Air Vacuum Pits';
    customName?: string;
  }>;
  productType: 'storm' | 'sanitary' | 'electrical' | 'meter';
  status: 'requested' | 'inprogress' | 'review' | 'approved' | 'production';
  specifications: {
    length: number;
    width: number;
    height: number;
    wallThickness?: number;
    customNotes?: string;
  };
  drawings: Drawing[];
  timeTracking: {
    totalHours: number;
    entries: TimeEntry[];
  };
  revisions: Revision[];
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
    rfis: RFI[];
  };
  createdBy: string;
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

export interface Drawing {
  _id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  version: number;
  uploadedBy: string;
  uploadedAt: Date;
  mimeType: string;
}

export interface TimeEntry {
  _id?: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  notes?: string;
  isRunning?: boolean;
}

export interface Revision {
  _id?: string;
  revisionNumber: number;
  date: Date;
  description: string;
  requestedBy: string;
  completedBy?: string;
}

export interface RFI {
  _id?: string;
  question: string;
  askedBy: string;
  askedAt: Date;
  answer?: string;
  answeredBy?: string;
  answeredAt?: Date;
  status: 'open' | 'answered';
}

export interface Customer {
  _id?: string;
  name: string;
  contactInfo: {
    email: string;
    phone: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  preferences: {
    customSpecs: string[];
    notes: string;
    preferredProducts: string[];
    requiresStampedDrawings: boolean;
    expeditedTurnaround: boolean;
  };
  projectHistory: {
    totalProjects: number;
    activeProjects: number;
    completedThisYear: number;
    recentProjectIds: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LibraryTemplate {
  _id?: string;
  templateName: string;
  productCategory: 'storm' | 'sanitary' | 'electrical' | 'meter' | 'rebar' | 'cad';
  dimensions: {
    length: number;
    width: number;
    height: number;
    wallThickness?: number;
  };
  loadRequirements: {
    designLoad: string;
    soilCover: string;
    waterTable: string;
  };
  rebarSchedule: string;
  autocadTemplate?: {
    fileName: string;
    filePath: string;
    version: number;
  };
  images: {
    url: string;
    caption?: string;
  }[];
  notes: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

