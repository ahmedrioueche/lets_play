import { ChatService } from '@/lib/services/chatService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const { friendId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await ChatService.markMessagesAsRead(userId, friendId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);

    if (error.message === 'Invalid user ID') {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
