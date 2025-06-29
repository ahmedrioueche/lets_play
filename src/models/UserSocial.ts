import { UserSocial } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IUserSocial = UserSocial & Document;

const UserSocialSchema: Schema = new Schema({
  friendsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  pendingInvitations: [{ type: Schema.Types.ObjectId, ref: 'FriendInvitation' }], // IDs of pending friend invitations sent by this user
  receivedInvitations: [{ type: Schema.Types.ObjectId, ref: 'FriendInvitation' }], // IDs of pending friend invitations received by this user
});

const UserSocialModel = (mongoose.models.UserSocial ||
  mongoose.model<IUserSocial>('UserSocial', UserSocialSchema)) as mongoose.Model<IUserSocial>;

export default UserSocialModel;
