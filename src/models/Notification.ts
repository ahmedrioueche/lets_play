import { Notification } from '@/types/user';
import mongoose, { Document, Schema } from 'mongoose';

export type INotification = Notification & Document;

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, ref: 'User' },
    type: {
      type: String,
      enum: [
        'friend_invitation',
        'friend_accepted',
        'friend_declined',
        'friend_invitation_cancelled',
        'friend_removed',
        'message',
        'system',
        'game_invitation',
        'game_reminder',
        'game_registration',
        'game_cancellation',
        'game_kick',
        'game_join_request',
        'friend_response',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create index for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

// Force schema refresh by deleting existing model if it exists
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

const NotificationModel = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
) as mongoose.Model<INotification>;

export default NotificationModel;
