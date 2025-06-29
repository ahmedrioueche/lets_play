import { User } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

// Define IUser as an intersection type to avoid interface extension conflicts
export type IUser = User & Document & { password?: string };

const LocationSchema: Schema = new Schema(
  {
    cords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    address: { type: String },
  },
  { _id: false }
);

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    avatar: { type: String },
    bio: { type: String },
    age: { type: Schema.Types.Mixed },
    location: { type: LocationSchema },
    isVerified: { type: Boolean, default: false },
    hasCompletedOnboarding: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    password: { type: String, required: false }, // Not in type, but needed for auth
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const UserModel = (mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;

export default UserModel;
