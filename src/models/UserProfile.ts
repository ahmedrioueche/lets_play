import { UserProfile } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IUserProfile = UserProfile & Document;

const UserProfileSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    favoriteSports: [{ type: String }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    stats: { type: Schema.Types.ObjectId, ref: 'UserStats' },
    social: { type: Schema.Types.ObjectId, ref: 'UserSocial' },
    history: { type: Schema.Types.ObjectId, ref: 'UserGameHistory' },
    analytics: { type: Schema.Types.ObjectId, ref: 'UserAnalytics' },
    achievements: { type: Schema.Types.ObjectId, ref: 'UserAchievements' },
    // Online status fields
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const UserProfileModel = (mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)) as mongoose.Model<IUserProfile>;

export default UserProfileModel;
