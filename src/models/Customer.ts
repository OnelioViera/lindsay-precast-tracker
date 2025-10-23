// Temporarily disabled for CodeSandbox - replace with actual mongoose in production
// import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer {
  _id: string;
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

// Mock Customer model for CodeSandbox
const Customer = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  findOne: () => Promise.resolve(null),
  countDocuments: () => Promise.resolve(0),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default Customer;
