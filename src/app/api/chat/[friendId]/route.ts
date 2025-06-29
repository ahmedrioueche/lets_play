import dbConnect from '@/config/db';
import MessageModel from '@/models/Message';
import UserProfileModel from '@/models/UserProfile';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { friendId: string } }) {
  try {
    await dbConnect();

    // Get current user ID from query params
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');
    const friendId = params.friendId;

    if (!currentUserId || !ObjectId.isValid(currentUserId) || !ObjectId.isValid(friendId)) {
      return NextResponse.json({ message: 'Invalid user or friend ID' }, { status: 400 });
    }

    // Check if they are friends
    const userProfile = await UserProfileModel.findOne({ userId: currentUserId });
    if (!userProfile || !userProfile.friends.includes(friendId)) {
      return NextResponse.json({ message: 'Not friends' }, { status: 403 });
    }

    // Get messages between the two users
    const messages = await MessageModel.findConversation(currentUserId, friendId, 1, 100);

    // Mark messages as read
    await MessageModel.markConversationAsRead(currentUserId, friendId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { friendId: string } }) {
  try {
    await dbConnect();

    const friendId = params.friendId;
    const { content, senderId } = await request.json();

    if (!content || !senderId || !ObjectId.isValid(senderId) || !ObjectId.isValid(friendId)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Check if they are friends
    const userProfile = await UserProfileModel.findOne({ userId: senderId });
    if (!userProfile || !userProfile.friends.includes(friendId)) {
      return NextResponse.json({ message: 'Not friends' }, { status: 403 });
    }

    // Create new message
    const message = new MessageModel({
      senderId,
      receiverId: friendId,
      content,
      messageType: 'text',
      isRead: false,
      isEdited: false,
    });

    await message.save();

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
