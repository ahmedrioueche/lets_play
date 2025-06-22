import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: email, // Use email as ID for now, can be changed to UUID later
      name,
      email,
      phone: '', // Required field, user can update later
      password: hashedPassword,
      avatar: '',
      bio: '',
      isPremium: false,
      location: {
        lat: null,
        lng: null,
      },
      registeredGames: [],
    };

    const user = await UserModel.create(newUser);

    // Create JWT token
    const token = jwt.sign({ userId: user._id?.toString() || '', email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Create response
    const response = NextResponse.json(
      {
        id: user._id?.toString() || '',
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
