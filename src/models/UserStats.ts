import { UserStats } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IUserStats = UserStats & Document;

const UserStatsSchema: Schema = new Schema({
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  rank: { type: String, default: 'Beginner' },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  favoriteSport: { type: String, default: '' },
  credibility: { type: Number, default: 0 },
  participation: { type: Number, default: 0 },
  gamesCreated: { type: Number, default: 0 },
});

const UserStatsModel = (mongoose.models.UserStats ||
  mongoose.model<IUserStats>('UserStats', UserStatsSchema)) as mongoose.Model<IUserStats>;

export default UserStatsModel;
