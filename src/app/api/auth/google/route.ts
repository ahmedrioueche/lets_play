import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  (process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback');

export async function GET(request: NextRequest) {
  try {
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${REDIRECT_URI}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline&` +
      `prompt=consent`;

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json({ message: 'Google authentication failed' }, { status: 500 });
  }
}
