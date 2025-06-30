import { ChatService } from '@/lib/services/chatService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const { friendId } = await params;

    // Get current user ID from query params
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!currentUserId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const messages = await ChatService.getConversation(currentUserId, friendId, page, limit);
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);

    if (error.message === 'Invalid user ID') {
      return NextResponse.json({ message: 'Invalid user or friend ID' }, { status: 400 });
    }

    if (error.message === 'Users are not friends') {
      return NextResponse.json({ message: 'Not friends' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const { friendId } = await params;
    const { content, senderId, messageType, replyTo } = await request.json();

    if (!content || !senderId) {
      return NextResponse.json({ message: 'Content and sender ID are required' }, { status: 400 });
    }

    const message = await ChatService.sendMessage({
      senderId,
      receiverId: friendId,
      content,
      messageType,
      replyTo,
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error('Error sending message:', error);

    if (error.message === 'Invalid user ID') {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    if (error.message === 'Users are not friends') {
      return NextResponse.json({ message: 'Not friends' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
