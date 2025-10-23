export interface User {
  id: string;
  name: string;
  email: string;
  role: 'designer' | 'engineer' | 'manager' | 'production';
  phone?: string;
  avatar?: string;
  preferences: {
    emailNotifications: boolean;
    productionNotifications: boolean;
    weeklyReports: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Customer {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
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
    id: string;
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
      id: string;
      userId: string;
      startTime: Date;
      endTime: Date;
      duration: number;
      notes?: string;
    }[];
  };
  revisions: {
    id: string;
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
      id: string;
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

export interface LibraryTemplate {
  id: string;
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
  autocadTemplate: {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
  isRunning: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
