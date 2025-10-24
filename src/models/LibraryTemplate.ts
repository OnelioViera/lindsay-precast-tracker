import mongoose, { Document, Schema } from 'mongoose';

export interface ILibraryTemplate extends Document {
  templateName: string;
  productCategory: 'storm' | 'sanitary' | 'electrical' | 'meter' | 'rebar' | 'cad';
  dimensions: {
    length: number;
    width: number;
    height: number;
    wallThickness?: number;
  };
  loadRequirements: {
    designLoad: string;
    soilCover: string;
    waterTable: string;
  };
  rebarSchedule: string;
  autocadTemplate: {
    fileName: string;
    filePath: string;
    version: number;
  };
  images: {
    url: string;
    caption?: string;
  }[];
  notes: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryTemplateSchema = new Schema<ILibraryTemplate>(
  {
    templateName: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    productCategory: {
      type: String,
      enum: ['storm', 'sanitary', 'electrical', 'meter', 'rebar', 'cad'],
      required: true,
    },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      wallThickness: Number,
    },
    loadRequirements: {
      designLoad: String,
      soilCover: String,
      waterTable: String,
    },
    rebarSchedule: String,
    autocadTemplate: {
      fileName: String,
      filePath: String,
      version: Number,
    },
    images: [{
      url: String,
      caption: String,
    }],
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsed: Date,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LibraryTemplate = mongoose.models.LibraryTemplate || mongoose.model<ILibraryTemplate>('LibraryTemplate', LibraryTemplateSchema);

export default LibraryTemplate;
