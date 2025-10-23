// Temporarily disabled for CodeSandbox - replace with actual mongoose in production
// import mongoose from 'mongoose';

async function connectDB() {
  // Mock database connection for CodeSandbox
  console.log('Mock database connection for CodeSandbox');
  return { isConnected: true };
}

export default connectDB;
