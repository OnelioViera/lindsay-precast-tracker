import mongoose, { Schema, model, models } from 'mongoose';

const LibrarySchema = new Schema({
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
    wallThickness: { type: Number },
  },
  loadRequirements: {
    designLoad: { type: String },
    soilCover: { type: String },
    waterTable: { type: String },
  },
  rebarSchedule: {
    type: String,
  },
  autocadTemplate: {
    fileName: { type: String },
    filePath: { type: String },
    version: { type: Number, default: 1 },
  },
  images: [{
    url: { type: String },
    caption: { type: String },
  }],
  notes: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  lastUsed: {
    type: Date,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
LibrarySchema.index({ productCategory: 1 });
LibrarySchema.index({ isActive: 1 });
LibrarySchema.index({ productCategory: 1, isActive: 1 });
LibrarySchema.index({ usageCount: -1 });

const Library = models.Library || model('Library', LibrarySchema);

export default Library;

