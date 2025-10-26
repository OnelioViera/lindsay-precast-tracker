// Sample data seeding script
// Run with: node scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lindsay_precast_db';

// Simple schemas for seeding
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  preferences: Object,
});

const customerSchema = new mongoose.Schema({
  name: String,
  contactInfo: Object,
  preferences: Object,
  projectHistory: Object,
}, { timestamps: true });

const librarySchema = new mongoose.Schema({
  templateName: String,
  productCategory: String,
  dimensions: Object,
  loadRequirements: Object,
  rebarSchedule: String,
  notes: String,
  isActive: Boolean,
  usageCount: Number,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
const Library = mongoose.models.Library || mongoose.model('Library', librarySchema);

const sampleUsers = [
  {
    name: 'John Designer',
    email: 'designer@lindsayprecast.com',
    password: 'password123',
    role: 'designer',
    preferences: {
      emailNotifications: true,
      productionNotifications: true,
      weeklyReports: false,
    },
  },
  {
    name: 'Sarah Engineer',
    email: 'engineer@lindsayprecast.com',
    password: 'password123',
    role: 'engineer',
    preferences: {
      emailNotifications: true,
      productionNotifications: true,
      weeklyReports: true,
    },
  },
  {
    name: 'Mike Manager',
    email: 'manager@lindsayprecast.com',
    password: 'password123',
    role: 'manager',
    preferences: {
      emailNotifications: true,
      productionNotifications: true,
      weeklyReports: true,
    },
  },
];

const sampleCustomers = [
  {
    name: 'City Water Works',
    contactInfo: {
      email: 'contact@citywater.gov',
      phone: '(555) 123-4567',
      address: {
        street: '123 Main Street',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
      },
    },
    preferences: {
      customSpecs: [],
      notes: 'Prefers standard specifications',
      preferredProducts: ['storm'],
      requiresStampedDrawings: true,
      expeditedTurnaround: false,
    },
    projectHistory: {
      totalProjects: 0,
      activeProjects: 0,
      completedThisYear: 0,
      recentProjectIds: [],
    },
  },
  {
    name: 'Metro Construction Co',
    contactInfo: {
      email: 'info@metroconstruction.com',
      phone: '(555) 987-6543',
      address: {
        street: '456 Business Blvd',
        city: 'Denver',
        state: 'CO',
        zipCode: '80203',
      },
    },
    preferences: {
      customSpecs: [],
      notes: 'Requires expedited turnaround',
      preferredProducts: ['electrical', 'meter'],
      requiresStampedDrawings: true,
      expeditedTurnaround: true,
    },
    projectHistory: {
      totalProjects: 0,
      activeProjects: 0,
      completedThisYear: 0,
      recentProjectIds: [],
    },
  },
  {
    name: 'ABC Utilities',
    contactInfo: {
      email: 'projects@abcutilities.com',
      phone: '(555) 234-5678',
      address: {
        street: '789 Industrial Way',
        city: 'Boulder',
        state: 'CO',
        zipCode: '80301',
      },
    },
    preferences: {
      customSpecs: [],
      notes: 'Long-term client, bulk orders',
      preferredProducts: ['sanitary', 'storm'],
      requiresStampedDrawings: false,
      expeditedTurnaround: false,
    },
    projectHistory: {
      totalProjects: 0,
      activeProjects: 0,
      completedThisYear: 0,
      recentProjectIds: [],
    },
  },
];

const sampleTemplates = [
  {
    templateName: 'Standard Storm Vault 8x10x12',
    productCategory: 'storm',
    dimensions: {
      length: 8,
      width: 10,
      height: 12,
      wallThickness: 8,
    },
    loadRequirements: {
      designLoad: 'H-20 Rating',
      soilCover: '2-6 feet',
      waterTable: 'Below invert',
    },
    rebarSchedule: '• Walls: #5 @ 12" O.C. each way\n• Roof: #6 @ 12" O.C. each way\n• Base: #5 @ 12" O.C. each way',
    notes: 'Standard specification for storm water management',
    isActive: true,
    usageCount: 45,
  },
  {
    templateName: 'Sanitary Manhole 4x6x8',
    productCategory: 'sanitary',
    dimensions: {
      length: 4,
      width: 6,
      height: 8,
      wallThickness: 6,
    },
    loadRequirements: {
      designLoad: 'H-20 Rating',
      soilCover: '3-8 feet',
      waterTable: 'Below invert',
    },
    rebarSchedule: '• Walls: #4 @ 10" O.C. each way\n• Roof: #5 @ 10" O.C. each way\n• Base: #4 @ 10" O.C. each way',
    notes: 'Standard sanitary sewer manhole',
    isActive: true,
    usageCount: 32,
  },
  {
    templateName: 'Electrical Vault 6x8x10',
    productCategory: 'electrical',
    dimensions: {
      length: 6,
      width: 8,
      height: 10,
      wallThickness: 8,
    },
    loadRequirements: {
      designLoad: 'H-20 Rating',
      soilCover: '2-5 feet',
      waterTable: 'N/A',
    },
    rebarSchedule: '• Walls: #5 @ 12" O.C. each way\n• Roof: #6 @ 12" O.C. each way\n• Base: #5 @ 12" O.C. each way',
    notes: 'Standard electrical equipment vault',
    isActive: true,
    usageCount: 28,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Library.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed users
    console.log('👥 Seeding users...');
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({ ...userData, password: hashedPassword });
      console.log(`   ✓ Created user: ${userData.name} (${userData.email})`);
    }
    console.log();

    // Seed customers
    console.log('🏢 Seeding customers...');
    for (const customer of sampleCustomers) {
      await Customer.create(customer);
      console.log(`   ✓ Created customer: ${customer.name}`);
    }
    console.log();

    // Seed library templates
    console.log('📚 Seeding library templates...');
    const firstUser = await User.findOne();
    for (const template of sampleTemplates) {
      await Library.create({ ...template, createdBy: firstUser._id });
      console.log(`   ✓ Created template: ${template.templateName}`);
    }
    console.log();

    console.log('🎉 Seeding completed successfully!\n');
    console.log('📝 Sample Credentials:');
    console.log('   Email: designer@lindsayprecast.com | Password: password123');
    console.log('   Email: engineer@lindsayprecast.com | Password: password123');
    console.log('   Email: manager@lindsayprecast.com  | Password: password123');
    console.log();

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

