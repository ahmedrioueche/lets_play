import { Message } from '@/types/user';
import mongoose, { Document, Model, Schema } from 'mongoose';

export type IMessage = Message & Document;

interface IMessageModel extends Model<IMessage> {
  findConversation(
    userId1: string,
    userId2: string,
    page?: number,
    limit?: number
  ): Promise<IMessage[]>;
  getUnreadCount(userId: string, fromUserId?: string): Promise<number>;
  markConversationAsRead(userId: string, friendId: string): Promise<any>;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'audio'],
      default: 'text',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    replyTo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });

// Pre-save middleware to set editedAt when message is edited
MessageSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Instance method to mark message as read
MessageSchema.methods.markAsRead = function () {
  this.isRead = true;
  return this.save();
};

// Static method to find conversation between two users
MessageSchema.statics.findConversation = function (
  userId1: string,
  userId2: string,
  page: number = 1,
  limit: number = 50
) {
  const skip = (page - 1) * limit;

  return this.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get unread message count for a user
MessageSchema.statics.getUnreadCount = function (userId: string, fromUserId?: string) {
  const query: any = { receiverId: userId, isRead: false };

  if (fromUserId) {
    query.senderId = fromUserId;
  }

  return this.countDocuments(query);
};

// Static method to mark all messages as read between two users
MessageSchema.statics.markConversationAsRead = function (userId: string, friendId: string) {
  return this.updateMany(
    {
      senderId: friendId,
      receiverId: userId,
      isRead: false,
    },
    { isRead: true }
  );
};

const MessageModel: IMessageModel = (mongoose.models.Message ||
  mongoose.model<IMessage, IMessageModel>('Message', MessageSchema)) as unknown as IMessageModel;

export default MessageModel;
