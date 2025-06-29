import dbConnect from '@/config/db';
import MessageModel from '@/models/Message';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('No authentication token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Helper function to check if users are friends or if sender is blocked
async function canUsersChat(senderId: string, receiverId: string) {
  const [senderProfile, receiverProfile] = await Promise.all([
    UserProfileModel.findOne({ userId: senderId }),
    UserProfileModel.findOne({ userId: receiverId }),
  ]);

  if (!senderProfile || !receiverProfile) {
    return { canChat: false, reason: 'User profile not found' };
  }

  // Check if they are friends
  const areFriends = senderProfile.friends.some(
    (friendId: any) => friendId.toString() === receiverId
  );

  if (!areFriends) {
    return { canChat: false, reason: 'Users are not friends' };
  }

  // Check if sender is blocked by receiver
  const receiverSocial = await UserSocialModel.findById(receiverProfile.social);
  const isBlocked = receiverSocial?.blockedUsers?.includes(senderId) || false;

  if (isBlocked) {
    return { canChat: false, reason: 'User is blocked' };
  }

  return { canChat: true };
}

// GET - Fetch messages between two users
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get('friendId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!friendId) {
      return NextResponse.json({ message: 'Friend ID is required', messages: [] }, { status: 400 });
    }

    // Check if users can chat
    const chatCheck = await canUsersChat(userId, friendId);
    if (!chatCheck.canChat) {
      return NextResponse.json({ message: chatCheck.reason, messages: [] }, { status: 403 });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch messages between the two users
    const messages = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    })
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'name avatar')
      .populate('receiverId', 'name avatar');

    // Transform messages to match the Message interface
    const transformedMessages = messages.reverse().map((message: any) => ({
      id: message._id.toString(),
      senderId: message.senderId._id.toString(),
      receiverId: message.receiverId._id.toString(),
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      isRead: message.isRead || false,
      messageType: message.messageType || 'text',
    }));

    // Mark messages as read if they were sent to the current user
    await MessageModel.updateMany(
      {
        senderId: friendId,
        receiverId: userId,
        isRead: false,
      },
      { isRead: true }
    );

    return NextResponse.json({
      messages: transformedMessages,
      hasMore: messages.length === limit,
      page,
      totalPages: Math.ceil(
        (await MessageModel.countDocuments({
          $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
          ],
        })) / limit
      ),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch messages', messages: [] },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { receiverId, content, messageType = 'text' } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { message: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ message: 'Message content cannot be empty' }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { message: 'Message content is too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    // Check if users can chat
    const chatCheck = await canUsersChat(userId, receiverId);
    if (!chatCheck.canChat) {
      return NextResponse.json({ message: chatCheck.reason }, { status: 403 });
    }

    // Create the message
    const newMessage = await MessageModel.create({
      senderId: userId,
      receiverId,
      content: content.trim(),
      messageType,
      isRead: false,
    });

    // Populate sender and receiver details
    await newMessage.populate('senderId', 'name avatar');
    await newMessage.populate('receiverId', 'name avatar');

    // Transform message to match the Message interface
    const transformedMessage = {
      id: newMessage._id.toString(),
      senderId: newMessage.senderId.toString(),
      receiverId: newMessage.receiverId.toString(),
      content: newMessage.content,
      timestamp: newMessage.createdAt.toISOString(),
      isRead: newMessage.isRead,
      messageType: newMessage.messageType,
    };

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        data: transformedMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}

// PUT - Mark messages as read
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { friendId, messageIds } = await request.json();

    if (!friendId) {
      return NextResponse.json({ message: 'Friend ID is required' }, { status: 400 });
    }

    let updateQuery: any = {
      senderId: friendId,
      receiverId: userId,
      isRead: false,
    };

    // If specific message IDs are provided, only mark those as read
    if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
      updateQuery._id = { $in: messageIds };
    }

    const result = await MessageModel.updateMany(updateQuery, { isRead: true });

    return NextResponse.json({
      message: 'Messages marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json({ message: 'Failed to mark messages as read' }, { status: 500 });
  }
}

// DELETE - Delete a message
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json({ message: 'Message ID is required' }, { status: 400 });
    }

    // Find the message and verify ownership
    const message = await MessageModel.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    if (message.senderId.toString() !== userId) {
      return NextResponse.json(
        { message: 'You can only delete your own messages' },
        { status: 403 }
      );
    }

    await MessageModel.findByIdAndDelete(messageId);

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ message: 'Failed to delete message' }, { status: 500 });
  }
}
