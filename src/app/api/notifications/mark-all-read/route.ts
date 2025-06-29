import dbConnect from '@/config/db';
import NotificationModel from '@/models/Notification';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Mark all notifications as read for the user
    await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
