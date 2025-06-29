import { UserAchievements } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IUserAchievements = UserAchievements & Document;

const AchievementSchema: Schema = new Schema({
  _id: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockedAt: { type: String, required: true },
});

const UserAchievementsSchema: Schema = new Schema({
  userId: { type: String, required: true },
  achievements: [AchievementSchema],
});

const UserAchievementsModel = (mongoose.models.UserAchievements ||
  mongoose.model<IUserAchievements>(
    'UserAchievements',
    UserAchievementsSchema
  )) as mongoose.Model<IUserAchievements>;

export default UserAchievementsModel;
