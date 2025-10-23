# Setup Guide for Lindsay Precast Design Management System

## Prerequisites

Before setting up the application, ensure you have the following installed:

1. **Node.js 20+** - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB Atlas Account** - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **AWS Account** (for S3 file storage) - Sign up at [aws.amazon.com](https://aws.amazon.com/)

## Step-by-Step Setup

### 1. Install Node.js and npm

Download and install Node.js 20+ from the official website. This will also install npm.

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies

Navigate to the project directory and install all dependencies:

```bash
npm install
```

### 3. Set Up MongoDB Atlas

1. Create a new cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get your connection string

### 4. Set Up AWS S3 (Optional for Development)

1. Create an S3 bucket for file storage
2. Create an IAM user with S3 permissions
3. Get your access key and secret key

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lindsay_precast_db?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000

# AWS S3 (optional for development)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=lindsay-precast-files

# Email Service (optional)
SENDGRID_API_KEY=your-sendgrid-key

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

### 6. Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 7. Create Your First User

1. Navigate to [http://localhost:3000/register](http://localhost:3000/register)
2. Create an account with the role "Project Manager" for full access
3. Log in and start using the system

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

## Project Structure Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── projects/      # Project management
│   │   ├── customers/     # Customer management
│   │   ├── library/       # Template library
│   │   └── production/    # Production handoff
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── projects/      # Project CRUD operations
│       ├── customers/     # Customer CRUD operations
│       └── library/       # Library template operations
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── dashboard/        # Dashboard-specific components
│   ├── projects/         # Project-related components
│   ├── customers/        # Customer-related components
│   ├── library/          # Library components
│   └── layout/           # Layout components (sidebar, header)
├── lib/                  # Utility functions and configurations
│   ├── auth.ts          # NextAuth.js configuration
│   ├── db.ts            # MongoDB connection
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod validation schemas
├── models/               # Mongoose database models
│   ├── User.ts          # User model
│   ├── Project.ts       # Project model
│   ├── Customer.ts      # Customer model
│   ├── LibraryTemplate.ts # Template model
│   └── TimeEntry.ts     # Time tracking model
├── services/             # Business logic services
│   └── projectService.ts # Project management logic
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── __tests__/            # Test files
```

## User Roles and Permissions

### CAD Designer
- Create and manage their own projects
- Track time on designs
- Access product library
- Update project status
- Upload drawings and files

### Engineer
- Review designs
- Approve specifications
- Access and manage technical library
- Provide engineering approval
- Access all projects

### Project Manager
- Oversee all projects
- Generate reports
- Manage customers
- Monitor team productivity
- Full system access

### Production Specialist
- Receive production handoffs
- Submit RFIs (Request for Information)
- Access approved drawings
- Update production status

## Key Features

### Project Management
- Complete project lifecycle from request to production
- Real-time time tracking
- File upload and management
- Revision tracking
- Status management

### Customer Management
- Customer profiles with contact information
- Project history tracking
- Preferences and notes
- Address management

### Library System
- Product templates and specifications
- AutoCAD template management
- Usage tracking
- Category organization

### Production Handoff
- Checklist-based handoff process
- RFI (Request for Information) system
- Production team notifications
- Status tracking

### Time Tracking
- Start/stop timer functionality
- Project-based time tracking
- Time entry notes
- Duration calculations

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI is correct
   - Check if your IP is whitelisted
   - Ensure the database user has proper permissions

2. **NextAuth.js Issues**
   - Make sure NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors with `npm run lint`

4. **File Upload Issues**
   - Verify AWS credentials are correct
   - Check S3 bucket permissions
   - Ensure bucket exists and is accessible

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB Atlas connection
5. Review the API routes for proper error handling

## Next Steps

After successful setup:

1. Create user accounts for your team members
2. Add customer information
3. Create project templates in the library
4. Start creating projects
5. Set up production workflows

## Production Deployment

For production deployment:

1. Set up a production MongoDB cluster
2. Configure production AWS S3 bucket
3. Set up proper environment variables
4. Deploy to Vercel or your preferred hosting platform
5. Set up monitoring and logging
6. Configure email notifications

The application is designed to be deployed on Vercel with MongoDB Atlas and AWS S3 for optimal performance and scalability.
