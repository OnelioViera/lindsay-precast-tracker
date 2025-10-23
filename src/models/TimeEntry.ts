// Temporarily disabled for CodeSandbox - replace with actual mongoose in production
// import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeEntry {
  _id: string;
  projectId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
  isRunning: boolean;
  createdAt: Date;
}

// Mock TimeEntry model for CodeSandbox
const TimeEntry = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  findOne: () => Promise.resolve(null),
  countDocuments: () => Promise.resolve(0),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default TimeEntry;
