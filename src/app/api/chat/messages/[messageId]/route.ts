import { ChatService } from '@/lib/services/chatService';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params;
    const { userId, content } = await request.json();

    if (!userId || !content) {
      return NextResponse.json({ message: 'User ID and content are required' }, { status: 400 });
    }

    const message = await ChatService.editMessage(messageId, userId, content);
    return NextResponse.json(message);
  } catch (error: any) {
    console.error('Error editing message:', error);

    if (error.message === 'Invalid ID') {
      return NextResponse.json({ message: 'Invalid message ID' }, { status: 400 });
    }

    if (error.message === 'Message not found') {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    if (error.message === 'Unauthorized to edit this message') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await ChatService.deleteMessage(messageId, userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting message:', error);

    if (error.message === 'Invalid ID') {
      return NextResponse.json({ message: 'Invalid message ID' }, { status: 400 });
    }

    if (error.message === 'Message not found') {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    if (error.message === 'Unauthorized to delete this message') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
