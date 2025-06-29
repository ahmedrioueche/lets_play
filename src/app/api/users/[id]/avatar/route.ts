import dbConnect from '@/config/db';
import cloudinary from '@/lib/cloudinary';
import UserModel from '@/models/User';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const userId = params.id;

    // Try to find user by ObjectId first, then by email (for backward compatibility)
    let user;
    if (ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }

    // If not found by ObjectId, try to find by email (for existing users)
    if (!user) {
      user = await UserModel.findOne({ email: userId });
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'avatars',
            transformation: [{ width: 400, height: 400, crop: 'fill' }, { quality: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const uploadResult = result as any;

    // Update user's avatar URL in database
    user.avatar = uploadResult.secure_url;
    await user.save();

    return NextResponse.json({
      success: true,
      avatarUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
