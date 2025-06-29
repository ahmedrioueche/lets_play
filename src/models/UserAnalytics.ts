import { UserAnalytics } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IUserAnalytics = UserAnalytics & Document;

const PerformanceStatsSchema: Schema = new Schema({
  _id: { type: String },
  gamesPlayed: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
});

const TimeOfDayPerformanceSchema: Schema = new Schema({
  _id: { type: String },
  morning: PerformanceStatsSchema,
  afternoon: PerformanceStatsSchema,
  evening: PerformanceStatsSchema,
  night: PerformanceStatsSchema,
});

const SportPerformanceSchema: Schema = new Schema({
  _id: { type: String },
  gamesPlayed: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  averagePoints: { type: Number, default: 0 },
});

const PerformanceMetricsSchema: Schema = new Schema({
  _id: { type: String },
  bySport: { type: Schema.Types.Mixed, default: {} },
  byTimeOfDay: { type: TimeOfDayPerformanceSchema, required: false },
});

const UserActivitySchema: Schema = new Schema({
  _id: { type: String },
  date: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: Schema.Types.Mixed, default: {} },
});

const UserAnalyticsSchema: Schema = new Schema({
  userId: { type: String, required: true },
  activityLog: [UserActivitySchema],
  performanceMetrics: { type: PerformanceMetricsSchema, required: false },
});

const UserAnalyticsModel = (mongoose.models.UserAnalytics ||
  mongoose.model<IUserAnalytics>(
    'UserAnalytics',
    UserAnalyticsSchema
  )) as mongoose.Model<IUserAnalytics>;

export default UserAnalyticsModel;
