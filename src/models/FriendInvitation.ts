import { FriendInvitation } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type IFriendInvitation = FriendInvitation & Document;

const FriendInvitationSchema: Schema = new Schema(
  {
    fromUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    toUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate pending invitations only
FriendInvitationSchema.index(
  { fromUserId: 1, toUserId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

const FriendInvitationModel = (mongoose.models.FriendInvitation ||
  mongoose.model<IFriendInvitation>(
    'FriendInvitation',
    FriendInvitationSchema
  )) as mongoose.Model<IFriendInvitation>;

export default FriendInvitationModel;
