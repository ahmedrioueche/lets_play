import { decryptMessage, generateConversationKey } from '@/lib/encryption';
import dbConnect from '@/lib/mongodb';
import MessageModel from '@/models/Message';
import UserModel from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get all messages where the user is either sender or receiver
    const messages = await MessageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    // Group messages by conversation (friend ID)
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const friendId = message.senderId === userId ? message.receiverId : message.senderId;

      if (!conversationsMap.has(friendId)) {
        // Decrypt message content if it's encrypted
        let displayMessage = message.content;
        if (message.isEncrypted && message.content) {
          try {
            const conversationKey = generateConversationKey(userId, friendId);
            displayMessage = decryptMessage(message.content, conversationKey);
          } catch (error) {
            console.error('Failed to decrypt message:', error);
            displayMessage = '🔒 Encrypted message';
          }
        }

        conversationsMap.set(friendId, {
          _id: friendId,
          friendId: friendId,
          lastMessage: displayMessage,
          lastMessageTime: message.createdAt,
          unreadCount: 0,
        });
      }

      // Count unread messages (messages sent to user that are not read)
      if (message.receiverId === userId && !message.isRead) {
        conversationsMap.get(friendId).unreadCount++;
      }
    });

    // Get user details for each conversation
    const conversations = [];
    for (const [friendId, conversation] of conversationsMap) {
      try {
        const friend = await UserModel.findById(friendId).select('name avatar').lean();
        if (friend) {
          conversations.push({
            ...conversation,
            friendName: friend.name,
            friendAvatar: friend.avatar,
          });
        }
      } catch (error) {
        console.error(`Error fetching friend ${friendId}:`, error);
      }
    }

    // Sort by last message time (most recent first)
    conversations.sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    return NextResponse.json({
      conversations,
      total: conversations.length,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
