import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
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
    recentProjectIds: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    contactInfo: {
      email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Phone is required'],
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    },
    preferences: {
      customSpecs: [String],
      notes: String,
      preferredProducts: [String],
      requiresStampedDrawings: {
        type: Boolean,
        default: false,
      },
      expeditedTurnaround: {
        type: Boolean,
        default: false,
      },
    },
    projectHistory: {
      totalProjects: {
        type: Number,
        default: 0,
      },
      activeProjects: {
        type: Number,
        default: 0,
      },
      completedThisYear: {
        type: Number,
        default: 0,
      },
      recentProjectIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
      }],
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
