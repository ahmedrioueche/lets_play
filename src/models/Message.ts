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
  getConversationStats(
    userId1: string,
    userId2: string
  ): Promise<{
    totalMessages: number;
    unreadCount: number;
    lastMessageAt?: Date;
  }>;
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
      maxlength: 4000, // Increased for encrypted content
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
    // Encryption fields
    isEncrypted: {
      type: Boolean,
      default: true, // Default to encrypted
    },
    encryptionKey: {
      type: String,
      required: false, // Will be generated per conversation
    },
    // Message status tracking
    deliveredAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
    // Metadata for better performance - temporarily removed to fix validation
    // conversationId: {
    //   type: String,
    //   required: false, // Will be set in pre-save middleware
    //   index: true,
    // },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });
// conversationId indexes temporarily removed
// MessageSchema.index({ conversationId: 1, createdAt: -1 });
// MessageSchema.index({ conversationId: 1, isRead: 1 });

// Pre-save middleware to set editedAt when message is edited
MessageSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }

  // conversationId generation temporarily removed
  // if (!this.conversationId) {
  //   const sortedIds = [this.senderId, this.receiverId].sort();
  //   this.conversationId = sortedIds.join(':');
  // }

  next();
});

// Instance method to mark message as read
MessageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to mark message as delivered
MessageSchema.methods.markAsDelivered = function () {
  this.deliveredAt = new Date();
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

  // Use senderId and receiverId instead of conversationId
  return this.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  })
    .sort({ createdAt: -1 }) // Newest first (most recent at the beginning)
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
      $or: [
        { senderId: friendId, receiverId: userId },
        { senderId: userId, receiverId: friendId },
      ],
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

// Static method to get conversation statistics
MessageSchema.statics.getConversationStats = function (userId1: string, userId2: string) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
    },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiverId', userId1] }, { $eq: ['$isRead', false] }] },
              1,
              0,
            ],
          },
        },
        lastMessageAt: { $max: '$createdAt' },
      },
    },
  ]).then((result) => {
    if (result.length === 0) {
      return { totalMessages: 0, unreadCount: 0 };
    }
    return {
      totalMessages: result[0].totalMessages,
      unreadCount: result[0].unreadCount,
      lastMessageAt: result[0].lastMessageAt,
    };
  });
};

const MessageModel: IMessageModel = (mongoose.models.Message ||
  mongoose.model<IMessage, IMessageModel>('Message', MessageSchema)) as unknown as IMessageModel;

export default MessageModel;
