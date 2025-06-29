import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();

    const params = await context.params;
    const userId = params.id;

    // Try to find user by ObjectId first, then by email (for backward compatibility)
    let user;
    if (ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }
    if (!user) {
      user = await UserModel.findOne({ email: userId });
    }
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
