import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  projectNumber: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  productType: 'storm' | 'sanitary' | 'electrical' | 'meter';
  status: 'requested' | 'inprogress' | 'review' | 'approved' | 'production';
  specifications: {
    length: number;
    width: number;
    height: number;
    wallThickness?: number;
    customNotes?: string;
  };
  drawings: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    version: number;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    mimeType: string;
  }[];
  timeTracking: {
    totalHours: number;
    entries: {
      userId: mongoose.Types.ObjectId;
      startTime: Date;
      endTime: Date;
      duration: number;
      notes?: string;
    }[];
  };
  revisions: {
    revisionNumber: number;
    date: Date;
    description: string;
    requestedBy: string;
    completedBy?: mongoose.Types.ObjectId;
  }[];
  productionHandoff: {
    sentToProduction: boolean;
    handoffDate?: Date;
    checklist: {
      drawingsFinalized: boolean;
      specificationsVerified: boolean;
      customerApprovalReceived: boolean;
      materialListConfirmed: boolean;
      productionNotesAdded: boolean;
    };
    rfis: {
      question: string;
      askedBy: mongoose.Types.ObjectId;
      askedAt: Date;
      answer?: string;
      answeredBy?: mongoose.Types.ObjectId;
      answeredAt?: Date;
      status: 'open' | 'answered';
    }[];
  };
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ['storm', 'sanitary', 'electrical', 'meter'],
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'inprogress', 'review', 'approved', 'production'],
      default: 'requested',
    },
    specifications: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      wallThickness: Number,
      customNotes: String,
    },
    drawings: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      version: Number,
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: Date,
      mimeType: String,
    }],
    timeTracking: {
      totalHours: { type: Number, default: 0 },
      entries: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        startTime: Date,
        endTime: Date,
        duration: Number,
        notes: String,
      }],
    },
    revisions: [{
      revisionNumber: Number,
      date: Date,
      description: String,
      requestedBy: String,
      completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    productionHandoff: {
      sentToProduction: { type: Boolean, default: false },
      handoffDate: Date,
      checklist: {
        drawingsFinalized: { type: Boolean, default: false },
        specificationsVerified: { type: Boolean, default: false },
        customerApprovalReceived: { type: Boolean, default: false },
        materialListConfirmed: { type: Boolean, default: false },
        productionNotesAdded: { type: Boolean, default: false },
      },
      rfis: [{
        question: String,
        askedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        askedAt: Date,
        answer: String,
        answeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
        answeredAt: Date,
        status: { type: String, enum: ['open', 'answered'], default: 'open' },
      }],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
