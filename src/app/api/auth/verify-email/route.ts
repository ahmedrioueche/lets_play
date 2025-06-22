import OtpModel from '@/models/Otp';
import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { otp } = await req.json();
    if (!otp || otp.length !== 6) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
    }
    // Get user from JWT in cookie (same as /api/auth/me)
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const user = await UserModel.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const userIdStr = String(user._id);
    const otpDoc = await OtpModel.findOne({ userId: userIdStr, code: otp });
    if (!otpDoc || otpDoc.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired code' }, { status: 400 });
    }
    user.isVerified = true;
    await user.save();
    await OtpModel.deleteOne({ _id: otpDoc._id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
