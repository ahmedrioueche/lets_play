import { User } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

// Define IUser as an intersection type to avoid interface extension conflicts
export type IUser = User &
  Document & {
    password?: string;
    isPremium?: boolean;
  };

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: false }, // Optional for Google OAuth users
    avatar: { type: String, required: false },
    bio: { type: String, required: false },
    age: { type: Schema.Types.Mixed, required: false },
    favoriteSports: [{ type: String, required: false }],
    isVerified: { type: Boolean, default: false },
    hasCompletedOnboarding: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    registeredGames: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const UserModel = (mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;

export default UserModel;
