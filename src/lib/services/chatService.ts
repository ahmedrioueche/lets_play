import dbConnect from '@/config/db';
import { decryptMessage, encryptMessage, generateConversationKey } from '@/lib/encryption';
import {
  ChatMessagePayload,
  generatePrivateChannelName,
  MessageStatusPayload,
  pusherServer,
  sendChatMessage,
  sendMessageStatus,
  sendTypingStatus,
  TypingPayload,
} from '@/lib/pusherServer';
import MessageModel from '@/models/Message';
import UserProfileModel from '@/models/UserProfile';
import { ObjectId } from 'mongodb';

export interface SendMessageData {
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'audio';
  replyTo?: string;
}

export interface ConversationStats {
  totalMessages: number;
  unreadCount: number;
  lastMessageAt?: Date;
}

export class ChatService {
  /**
   * Send a message between two users
   */
  static async sendMessage(data: SendMessageData): Promise<any> {
    await dbConnect();

    const { senderId, receiverId, content, messageType = 'text', replyTo } = data;

    // Validate user IDs
    if (!ObjectId.isValid(senderId) || !ObjectId.isValid(receiverId)) {
      throw new Error('Invalid user ID');
    }

    // Check if users are friends or recipient allows messages from non-friends
    const userProfile = await UserProfileModel.findOne({ userId: senderId });
    const recipientProfile = await UserProfileModel.findOne({ userId: receiverId });
    const areFriends = userProfile && userProfile.friends.includes(receiverId);
    const allowNonFriends =
      recipientProfile && recipientProfile.settings?.allowMessagesFromNonFriends !== false;
    if (!areFriends && !allowNonFriends) {
      throw new Error('User only allows messages from friends');
    }

    // Generate conversation key for encryption
    const conversationKey = generateConversationKey(senderId, receiverId);

    // Encrypt the message content
    const encryptedContent = encryptMessage(content, conversationKey);

    // Create the message
    const message = new MessageModel({
      senderId,
      receiverId,
      content: encryptedContent,
      messageType,
      isEncrypted: true,
      encryptionKey: conversationKey,
      replyTo,
      isRead: false,
      isEdited: false,
      // conversationId temporarily removed to fix validation
    });

    await message.save();

    // Send real-time notification via Pusher
    const channelName = generatePrivateChannelName(senderId, receiverId);
    const payload: ChatMessagePayload = {
      messageId: message._id.toString(),
      senderId,
      receiverId,
      content: encryptedContent, // Send encrypted content
      messageType,
      timestamp: message.createdAt.toISOString(),
      isEncrypted: true,
    };

    console.log('ChatService: Sending Pusher event to channel:', channelName);
    console.log('ChatService: Payload:', payload);

    try {
      // Check if Pusher is configured
      if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
        await sendChatMessage(channelName, payload);
        console.log('ChatService: Pusher event sent successfully');
      } else {
        console.log('ChatService: Pusher not configured, skipping real-time notification');
      }
    } catch (error) {
      console.error('Failed to send real-time message:', error);
      // Don't throw error here as message is already saved
    }

    return {
      ...message.toObject(),
      content, // Return decrypted content for sender
    };
  }

  /**
   * Get conversation messages between two users
   */
  static async getConversation(
    userId1: string,
    userId2: string,
    page: number = 1,
    limit: number = 50
  ): Promise<any[]> {
    await dbConnect();

    if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) {
      throw new Error('Invalid user ID');
    }

    // Check if users are friends or recipient allows messages from non-friends
    const userProfile = await UserProfileModel.findOne({ userId: userId1 });
    const recipientProfile = await UserProfileModel.findOne({ userId: userId2 });
    const areFriends = userProfile && userProfile.friends.includes(userId2);
    const allowNonFriends =
      recipientProfile && recipientProfile.settings?.allowMessagesFromNonFriends !== false;
    if (!areFriends && !allowNonFriends) {
      throw new Error('User only allows messages from friends');
    }

    const messages = await MessageModel.findConversation(userId1, userId2, page, limit);
    const conversationKey = generateConversationKey(userId1, userId2);

    // Decrypt messages for the requesting user
    const decryptedMessages = messages.map((message) => {
      const messageObj = message.toObject();
      if (messageObj.isEncrypted && messageObj.content) {
        try {
          messageObj.content = decryptMessage(messageObj.content, conversationKey);
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          messageObj.content = '[Encrypted message]';
        }
      }
      return messageObj;
    });

    // Mark messages as read
    await MessageModel.markConversationAsRead(userId1, userId2);

    return decryptedMessages;
  }

  /**
   * Get conversation statistics
   */
  static async getConversationStats(userId1: string, userId2: string): Promise<ConversationStats> {
    await dbConnect();

    if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) {
      throw new Error('Invalid user ID');
    }

    return await MessageModel.getConversationStats(userId1, userId2);
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(userId: string, friendId: string): Promise<void> {
    await dbConnect();

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
      throw new Error('Invalid user ID');
    }

    await MessageModel.markConversationAsRead(userId, friendId);

    // Send real-time notification
    const channelName = generatePrivateChannelName(userId, friendId);
    const payload: MessageStatusPayload = {
      messageId: 'bulk',
      status: 'read',
      timestamp: new Date().toISOString(),
    };

    try {
      // Check if Pusher is configured
      if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
        await sendMessageStatus(channelName, payload);
      } else {
        console.log('ChatService: Pusher not configured, skipping read status notification');
      }
    } catch (error) {
      console.error('Failed to send read status:', error);
    }
  }

  /**
   * Send typing status
   */
  static async sendTypingStatus(
    userId: string,
    friendId: string,
    isTyping: boolean
  ): Promise<void> {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
      throw new Error('Invalid user ID');
    }

    const channelName = generatePrivateChannelName(userId, friendId);
    const payload: TypingPayload = {
      userId,
      friendId,
      isTyping,
    };

    try {
      // Check if Pusher is configured
      if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
        await sendTypingStatus(channelName, payload);
      } else {
        console.log('ChatService: Pusher not configured, skipping typing status notification');
      }
    } catch (error) {
      console.error('Failed to send typing status:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Get unread message count for a user
   */
  static async getUnreadCount(userId: string, fromUserId?: string): Promise<number> {
    await dbConnect();

    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    if (fromUserId && !ObjectId.isValid(fromUserId)) {
      throw new Error('Invalid from user ID');
    }

    return await MessageModel.getUnreadCount(userId, fromUserId);
  }

  /**
   * Delete a message (only by sender)
   */
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    await dbConnect();

    if (!ObjectId.isValid(messageId) || !ObjectId.isValid(userId)) {
      throw new Error('Invalid ID');
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    await MessageModel.findByIdAndDelete(messageId);

    // Send real-time notification for message deletion
    const channelName = generatePrivateChannelName(message.senderId, message.receiverId);
    try {
      // Check if Pusher is configured
      if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
        await pusherServer.trigger(channelName, 'message-deleted', {
          messageId,
          deletedBy: userId,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log('ChatService: Pusher not configured, skipping message deletion notification');
      }
    } catch (error) {
      console.error('Failed to send message deletion notification:', error);
    }
  }

  /**
   * Edit a message (only by sender)
   */
  static async editMessage(messageId: string, userId: string, newContent: string): Promise<any> {
    await dbConnect();

    if (!ObjectId.isValid(messageId) || !ObjectId.isValid(userId)) {
      throw new Error('Invalid ID');
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Unauthorized to edit this message');
    }

    // Encrypt the new content
    const conversationKey = generateConversationKey(message.senderId, message.receiverId);
    const encryptedContent = encryptMessage(newContent, conversationKey);

    message.content = encryptedContent;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    // Send real-time notification for message edit
    const channelName = generatePrivateChannelName(message.senderId, message.receiverId);
    try {
      // Check if Pusher is configured
      if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
        await pusherServer.trigger(channelName, 'message-edited', {
          messageId,
          content: encryptedContent,
          isEncrypted: true,
          editedAt: message.editedAt,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log('ChatService: Pusher not configured, skipping message edit notification');
      }
    } catch (error) {
      console.error('Failed to send message edit notification:', error);
    }

    return {
      ...message.toObject(),
      content: newContent, // Return decrypted content for sender
    };
  }

  /**
   * Get recent conversations for a user
   */
  static async getRecentConversations(userId: string, limit: number = 10): Promise<any[]> {
    await dbConnect();

    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    // Get recent conversations with message previews
    const conversations = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Decrypt message content and get user details
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = conv.lastMessage;
        const otherUserId =
          lastMessage.senderId === userId ? lastMessage.receiverId : lastMessage.senderId;

        // Decrypt message content
        let decryptedContent = lastMessage.content;
        if (lastMessage.isEncrypted && lastMessage.content) {
          try {
            const conversationKey = generateConversationKey(
              lastMessage.senderId,
              lastMessage.receiverId
            );
            decryptedContent = decryptMessage(lastMessage.content, conversationKey);
          } catch (error) {
            decryptedContent = '[Encrypted message]';
          }
        }

        // Get user profile
        const userProfile = await UserProfileModel.findOne({ userId: otherUserId }).select(
          'name avatar isOnline'
        );

        return {
          conversationId: conv._id,
          otherUser: userProfile,
          lastMessage: {
            ...lastMessage,
            content: decryptedContent,
          },
          unreadCount: conv.unreadCount,
        };
      })
    );

    return result;
  }
}
