import dbConnect from '@/config/db';
import UserProfileModel from '@/models/UserProfile';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    let userId, isOnline;
    try {
      ({ userId, isOnline } = await request.json());
    } catch (err) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Update user's online status
    const updateData: any = {
      isOnline: Boolean(isOnline),
    };

    if (isOnline) {
      // When going online, set the lastSeen to now
      updateData.lastSeen = new Date();
    } else {
      // When going offline, set lastSeen to now (this is when they were last seen)
      updateData.lastSeen = new Date();
    }

    const userProfile = await UserProfileModel.findOneAndUpdate({ userId }, updateData, {
      new: true,
      upsert: true,
    });

    console.log(`User ${userId} ${isOnline ? 'online' : 'offline'} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      isOnline: userProfile.isOnline,
      lastSeen: userProfile.lastSeen,
    });
  } catch (error) {
    console.error('Error updating online status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to check if a user is online (with 5-minute timeout)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const userProfile = await UserProfileModel.findOne({ userId });

    if (!userProfile) {
      return NextResponse.json({ isOnline: false, lastSeen: null });
    }

    // Check if user is online based on 5-minute timeout
    const now = new Date();
    const lastSeen = userProfile.lastSeen ? new Date(userProfile.lastSeen) : null;
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // User is considered online if:
    // 1. isOnline flag is true AND
    // 2. lastSeen is within the last 5 minutes
    const isActuallyOnline = userProfile.isOnline && lastSeen && lastSeen > fiveMinutesAgo;

    // If user should be offline but flag is still true, update it
    if (userProfile.isOnline && !isActuallyOnline) {
      await UserProfileModel.findOneAndUpdate({ userId }, { isOnline: false });
      console.log(`User ${userId} auto-offlined due to 5-minute timeout`);
    }

    return NextResponse.json({
      isOnline: isActuallyOnline,
      lastSeen: userProfile.lastSeen,
      lastSeenRelative: lastSeen ? Math.floor((now.getTime() - lastSeen.getTime()) / 1000) : null,
    });
  } catch (error) {
    console.error('Error checking online status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
