// Temporarily disabled for CodeSandbox - replace with actual zod in production
// import { z } from 'zod';

// Mock zod for CodeSandbox
const z = {
  object: (schema: any) => ({ 
    parse: (data: any) => data, 
    optional: () => {},
    partial: () => ({ 
      omit: (...args: any[]) => ({ extend: (...args: any[]) => ({}) }),
      extend: (...args: any[]) => ({})
    })
  }),
  string: () => ({ 
    min: (...args: any[]) => ({ optional: () => {} }),
    email: (...args: any[]) => ({ optional: () => {} }),
    optional: () => {},
    regex: (...args: any[]) => ({ optional: () => {} }),
    length: (...args: any[]) => ({ optional: () => {} }),
    url: (...args: any[]) => ({ optional: () => {} })
  }),
  email: (...args: any[]) => ({}),
  number: () => ({ 
    positive: () => ({ 
      min: (...args: any[]) => ({ optional: () => {} }),
      max: (...args: any[]) => ({ optional: () => {} }),
      optional: () => {}
    }),
    optional: () => {}
  }),
  boolean: () => ({ optional: () => {} }),
  enum: (...args: any[]) => ({ optional: () => {} }),
  array: (...args: any[]) => ({ optional: () => {} }),
  date: () => ({}),
  instanceof: (...args: any[]) => ({}),
  url: (...args: any[]) => ({ optional: () => {} }),
  partial: () => ({ omit: () => ({ extend: () => ({}) }) }),
  infer: (schema: any) => ({} as any)
};

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['designer', 'engineer', 'manager', 'production']),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  preferences: z.object({
    emailNotifications: z.boolean(),
    productionNotifications: z.boolean(),
    weeklyReports: z.boolean(),
  }).optional(),
});

export const userUpdateSchema = userSchema.partial().omit({ password: true });

// Customer validation schemas
export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactInfo: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().length(2).optional(),
      zipCode: z.string().regex(/^\d{5}$/).optional(),
    }).optional(),
  }),
  preferences: z.object({
    customSpecs: z.array(z.string()).optional(),
    notes: z.string().optional(),
    preferredProducts: z.array(z.string()).optional(),
    requiresStampedDrawings: z.boolean().optional(),
    expeditedTurnaround: z.boolean().optional(),
  }).optional(),
});

export const customerUpdateSchema = customerSchema.partial();

// Project validation schemas
export const projectSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  productType: z.enum(['storm', 'sanitary', 'electrical', 'meter']),
  specifications: z.object({
    length: z.number().positive().min(0.1),
    width: z.number().positive().min(0.1),
    height: z.number().positive().min(0.1),
    wallThickness: z.number().positive().optional(),
    customNotes: z.string().optional(),
  }),
  assignedTo: z.string().optional(),
});

export const projectUpdateSchema = projectSchema.partial().extend({
  status: z.enum(['requested', 'inprogress', 'review', 'approved', 'production']).optional(),
});

// Library template validation schemas
export const libraryTemplateSchema = z.object({
  templateName: z.string().min(2, 'Template name must be at least 2 characters'),
  productCategory: z.enum(['storm', 'sanitary', 'electrical', 'meter', 'rebar', 'cad']),
  dimensions: z.object({
    length: z.number().positive().min(0.1),
    width: z.number().positive().min(0.1),
    height: z.number().positive().min(0.1),
    wallThickness: z.number().positive().optional(),
  }),
  loadRequirements: z.object({
    designLoad: z.string().min(1, 'Design load is required'),
    soilCover: z.string().min(1, 'Soil cover is required'),
    waterTable: z.string().min(1, 'Water table is required'),
  }),
  rebarSchedule: z.string().min(1, 'Rebar schedule is required'),
  autocadTemplate: z.object({
    fileName: z.string().min(1, 'File name is required'),
    filePath: z.string().min(1, 'File path is required'),
    version: z.number().positive().optional(),
  }),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    caption: z.string().optional(),
  })).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const libraryTemplateUpdateSchema = libraryTemplateSchema.partial();

// Time entry validation schemas
export const timeEntrySchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  startTime: z.date(),
  endTime: z.date(),
  notes: z.string().optional(),
});

export const timeTrackingActionSchema = z.object({
  action: z.enum(['start', 'stop']),
  notes: z.string().optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  projectId: z.string().optional(),
  fileType: z.enum(['drawing', 'document', 'image']),
});

// Search and filter schemas
export const searchFiltersSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  customerId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Production handoff validation schemas
export const productionHandoffSchema = z.object({
  checklist: z.object({
    drawingsFinalized: z.boolean(),
    specificationsVerified: z.boolean(),
    customerApprovalReceived: z.boolean(),
    materialListConfirmed: z.boolean(),
    productionNotesAdded: z.boolean(),
  }),
});

export const rfiSchema = z.object({
  question: z.string().min(1, 'Question is required'),
});

export const rfiAnswerSchema = z.object({
  answer: z.string().min(1, 'Answer is required'),
});

// Type exports - using any for CodeSandbox compatibility
export type UserInput = any;
export type UserUpdateInput = any;
export type CustomerInput = any;
export type CustomerUpdateInput = any;
export type ProjectInput = any;
export type ProjectUpdateInput = any;
export type LibraryTemplateInput = any;
export type LibraryTemplateUpdateInput = any;
export type TimeEntryInput = any;
export type TimeTrackingActionInput = any;
export type FileUploadInput = any;
export type SearchFiltersInput = any;
export type ProductionHandoffInput = any;
export type RFIInput = any;
export type RFIAnswerInput = any;
