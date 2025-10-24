import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
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

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['designer', 'engineer', 'manager', 'production'],
      default: 'designer',
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      productionNotifications: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: false,
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
