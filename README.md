# Lindsay Precast Design Management System

A comprehensive web application for managing precast concrete design projects, built with Next.js 14, MongoDB, and modern UI components.

## 🚀 Features

- **User Authentication** - Secure login with role-based access control
- **Project Management** - Create, track, and manage design projects
- **Time Tracking** - Built-in timer system for tracking project hours
- **Customer Management** - Maintain customer relationships and project history
- **Product Library** - Browse and manage design templates
- **Production Handoff** - Streamlined workflow from design to production
- **Real-time Updates** - Dynamic project status management
- **PDF Export** - Generate project reports

## 🎨 Design

The interface features the same beautiful gradient design from the Job Tracker template you provided:
- Purple-to-indigo gradient backgrounds
- Modern card-based UI with smooth animations
- Responsive design for all screen sizes
- Clean, professional aesthetic

## 📋 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **PDF Generation**: jsPDF
- **Form Handling**: React Hook Form with Zod validation

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lindsay-precast-design-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lindsay_precast_db

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Optional: AWS S3 for file uploads
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=lindsay-precast-files
```

#### Getting a MongoDB URI:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `lindsay_precast_db`

#### Generating NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Your First User

1. Navigate to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - Role (Designer, Engineer, Manager, or Production)
3. Click "Create Account"
4. Login with your credentials

## 📱 Application Structure

```
lindsay-precast-design-management/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── projects/             # Project CRUD operations
│   │   ├── customers/            # Customer management
│   │   └── library/              # Template library
│   ├── dashboard/                # Main application pages
│   │   ├── projects/             # Projects list & detail
│   │   ├── customers/            # Customer management
│   │   ├── library/              # Product library
│   │   └── production/           # Production module
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Base UI components (shadcn)
│   ├── projects/                 # Project-specific components
│   └── layout/                   # Layout components
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # MongoDB connection
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod schemas
├── models/                       # MongoDB models
│   ├── User.ts
│   ├── Project.ts
│   ├── Customer.ts
│   └── Library.ts
└── types/                        # TypeScript types
    └── index.ts
```

## 👥 User Roles & Permissions

### CAD Designer
- View own projects
- Create projects
- Track time
- Access library

### Engineer
- View all projects
- Approve projects
- Edit library
- Production handoff

### Project Manager
- Full access to all features
- Delete projects
- Manage customers
- View reports

### Production Specialist
- View production projects
- Submit RFIs
- Access drawings

## 🎯 Key Features Walkthrough

### Creating a Project

1. Click "New Project" from dashboard or projects page
2. Select a customer (create one first if needed)
3. Choose product type (Storm, Sanitary, Electrical, Meter)
4. Enter specifications (length, width, height)
5. Add custom notes
6. Click "Create Project"

### Time Tracking

1. Open a project detail page
2. Navigate to "Time Tracking" section
3. Click "Start" to begin timer
4. Work on your project
5. Click "Stop" when done
6. Total hours automatically calculated

### Managing Project Status

Projects flow through these statuses:
1. **Requested** - Initial project submission
2. **In Progress** - Design work underway
3. **Review** - Engineering review
4. **Approved** - Ready for production
5. **Production** - Handed off to production team

### Production Handoff

Before sending to production, complete the checklist:
- ✓ Drawings Finalized
- ✓ Specifications Verified
- ✓ Customer Approval Received
- ✓ Material List Confirmed
- ✓ Production Notes Added

## 🔧 Customization

### Changing Colors

Edit `app/globals.css` to customize the gradient:

```css
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding New Product Types

Update `types/index.ts`:

```typescript
productType: 'storm' | 'sanitary' | 'electrical' | 'meter' | 'your-new-type';
```

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Authentication Not Working

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

## 📝 API Documentation

### Authentication

**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "designer"
}
```

### Projects

**GET** `/api/projects` - List all projects
**POST** `/api/projects` - Create project
**GET** `/api/projects/[id]` - Get project details
**PATCH** `/api/projects/[id]` - Update project
**DELETE** `/api/projects/[id]` - Delete project
**POST** `/api/projects/[id]/time` - Start/stop timer

### Customers

**GET** `/api/customers` - List all customers
**POST** `/api/customers` - Create customer
**GET** `/api/customers/[id]` - Get customer details
**PATCH** `/api/customers/[id]` - Update customer
**DELETE** `/api/customers/[id]` - Delete customer

### Library

**GET** `/api/library` - List templates
**POST** `/api/library` - Create template
**GET** `/api/library/[id]` - Get template
**PATCH** `/api/library/[id]` - Update template
**DELETE** `/api/library/[id]` - Deactivate template

## 🤝 Contributing

This is a custom application for Lindsay Precast. For feature requests or bug reports, please contact the development team.

## 📄 License

Proprietary - Lindsay Precast Internal Use Only

## 🎉 Credits

Built with ❤️ using:
- Next.js
- React
- MongoDB
- Tailwind CSS
- shadcn/ui

Design inspired by the Job Tracker template provided.

---

**Version**: 1.0.0  
**Last Updated**: October 2025

