# Cloudinary Setup for Avatar Uploads

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Getting Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env.local` file

## Features

- Avatar upload via camera button on profile page
- Automatic image optimization (400x400, auto quality)
- File validation (image files only, max 5MB)
- Secure URL storage in database
- Loading state during upload

## API Endpoint

- `POST /api/users/[id]/avatar` - Upload avatar for user
- Accepts multipart form data with 'avatar' field
- Returns `{ success: true, avatarUrl: string }`

## Usage

1. Navigate to your profile page
2. Click the camera icon on your profile picture
3. Select an image file
4. The avatar will be uploaded and updated automatically
