# Lindsay Precast Design Management System

A comprehensive web application designed to streamline the precast design workflow for CAD designers, engineers, and production teams.

## Features

- **Project Management**: Complete lifecycle from request to production handoff
- **Time Tracking**: Real-time time tracking for design work
- **Customer Management**: Customer relationship management with preferences
- **Library System**: Product templates and specifications
- **Production Handoff**: Workflow for production team collaboration
- **Role-Based Access**: Different permissions for designers, engineers, managers, and production staff

## Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **File Storage**: AWS S3
- **UI Components**: shadcn/ui (Radix UI primitives)

## Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB Atlas account
- AWS S3 bucket (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lindsay-precast-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lindsay_precast_db?retryWrites=true&w=majority
   
   # NextAuth.js
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # AWS S3 (for file uploads)
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=lindsay-precast-files
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── projects/         # Project-related components
│   ├── customers/        # Customer-related components
│   ├── library/          # Library components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── models/               # Mongoose models
├── services/             # Business logic services
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## User Roles

- **CAD Designer**: Create and manage projects, track time, access library
- **Engineer**: Review designs, approve specifications, manage library
- **Project Manager**: Oversee all projects, manage customers, generate reports
- **Production Specialist**: Receive handoffs, submit RFIs, access approved drawings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (handled by NextAuth.js)

### Projects
- `GET /api/projects` - Get all projects with filtering
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/time` - Start/stop time tracking

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/[id]` - Get customer details
- `PATCH /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Library
- `GET /api/library` - Get all templates
- `POST /api/library` - Create new template
- `GET /api/library/[id]` - Get template details
- `PATCH /api/library/[id]` - Update template
- `DELETE /api/library/[id]` - Delete template

## Database Schema

The application uses MongoDB with the following main collections:

- **users**: User accounts and preferences
- **projects**: Project data and specifications
- **customers**: Customer information and history
- **library_templates**: Product templates and specifications
- **time_entries**: Detailed time tracking records

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deployment

The application is designed to be deployed on Vercel with the following services:

- **Hosting**: Vercel
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3
- **CDN**: Vercel Edge Network

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for Lindsay Precast.

## Support

For support and questions, please contact the development team.
