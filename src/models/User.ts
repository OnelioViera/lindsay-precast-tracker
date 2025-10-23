// Temporarily disabled for CodeSandbox - replace with actual mongoose in production
// import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
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

// Mock User model for CodeSandbox
const User = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  findOne: () => Promise.resolve(null),
  countDocuments: () => Promise.resolve(0),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default User;
