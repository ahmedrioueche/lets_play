import { ChatService } from '@/lib/services/chatService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, friendId, isTyping } = await request.json();

    if (!userId || !friendId) {
      return NextResponse.json({ message: 'User ID and friend ID are required' }, { status: 400 });
    }

    await ChatService.sendTypingStatus(userId, friendId, isTyping);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending typing status:', error);

    if (error.message === 'Invalid user ID') {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
