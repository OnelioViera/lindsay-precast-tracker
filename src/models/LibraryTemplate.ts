// Temporarily disabled for CodeSandbox - replace with actual mongoose in production
// import mongoose, { Document, Schema } from 'mongoose';

export interface ILibraryTemplate {
  _id: string;
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

// Mock LibraryTemplate model for CodeSandbox
const LibraryTemplate = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  findOne: () => Promise.resolve(null),
  countDocuments: () => Promise.resolve(0),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default LibraryTemplate;
