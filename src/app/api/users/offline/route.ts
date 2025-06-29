import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    let userId: string;
    let isOnline: boolean;

    // Check if request is FormData (from sendBeacon) or JSON
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      // Handle JSON request
      const body = await request.json();
      userId = body.userId;
      isOnline = body.isOnline;
    } else {
      // Handle FormData from sendBeacon
      const formData = await request.formData();
      userId = formData.get('userId') as string;
      isOnline = formData.get('isOnline') === 'true';
    }

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Update user's online status
    await UserModel.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user online status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
