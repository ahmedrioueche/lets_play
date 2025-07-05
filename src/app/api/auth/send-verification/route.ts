import { transporter } from '@/lib/nodemailer';
import OtpModel from '@/models/Otp';
import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    // --- Begin user lookup logic from /api/auth/me ---
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
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const userIdStr = String(user._id);
    // --- End user lookup logic ---

    // Rate limit: Only allow sending a new code if last one is older than 1 minute
    const lastOtp = await OtpModel.findOne({ userId: userIdStr }).sort({ expiresAt: -1 });
    if (lastOtp && lastOtp.expiresAt.getTime() - Date.now() > 9 * 60 * 1000) {
      return NextResponse.json(
        { message: 'Please wait before requesting another code.' },
        { status: 429 }
      );
    }

    // Remove any old OTPs for this user
    await OtpModel.deleteMany({ userId: userIdStr });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await OtpModel.create({ userId: userIdStr, code: otp, expiresAt });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your LetsPlay Verification Code',
      text: `Your verification code is ${otp}`,
      html: `
        <div style="font-family:sans-serif;font-size:16px">
          <h2 style="color:#4f46e5">LetsPlay Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0;color:#4f46e5">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
