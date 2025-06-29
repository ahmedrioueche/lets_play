import { UserGameHistory } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IUserGameHistory = UserGameHistory & Document;

const UserGameHistorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  registeredGames: [{ type: String }],
  playedGames: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  upcomingGames: [{ type: String }],
});

const UserGameHistoryModel = (mongoose.models.UserGameHistory ||
  mongoose.model<IUserGameHistory>(
    'UserGameHistory',
    UserGameHistorySchema
  )) as mongoose.Model<IUserGameHistory>;

export default UserGameHistoryModel;
