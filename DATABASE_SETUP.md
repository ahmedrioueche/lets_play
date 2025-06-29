# Database Setup Guide

## Environment Configuration

This project uses different databases for development and production environments.

### Development Environment

- **Database**: `test` (MongoDB's default test database)
- **Purpose**: Safe testing and development
- **Connection**: `mongodb://localhost:27017/test`

### Production Environment

- **Database**: `lets_play_prod`
- **Purpose**: Live production data
- **Connection**: `mongodb://localhost:27017/lets_play_prod`

## Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in your project root:

```env
# Development (default)
MONGODB_URI=mongodb://localhost:27017/test
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# For production, change to:
# MONGODB_URI=mongodb://localhost:27017/lets_play_prod
# NODE_ENV=production
```

### 2. Automatic Index Fix

The application now automatically:

- ✅ Detects and drops problematic `id` indexes
- ✅ Creates proper `email` unique indexes
- ✅ Works with both development and production databases

### 3. Database Switching

**For Development:**

```bash
# Uses test database
npm run dev
```

**For Production:**

```bash
# Uses lets_play_prod database
NODE_ENV=production npm run dev
```

## Current Issue Fixed

The error `E11000 duplicate key error collection: test.users index: id_1 dup key: { id: null }` was caused by:

- An old unique index on the `id` field
- Multiple users getting `id: null` values
- Violation of the unique constraint

**Solution:**

- ✅ Automatically drops the problematic `id` index
- ✅ Uses only MongoDB's default `_id` field
- ✅ Creates proper indexes for the current schema

## Database Structure

### Users Collection

- **Primary Key**: `_id` (MongoDB default)
- **Unique Index**: `email`
- **No `id` field** (removed to prevent conflicts)

### Environment Detection

The app automatically detects the environment and connects to the appropriate database:

- `NODE_ENV=development` → `test` database
- `NODE_ENV=production` → `lets_play_prod` database

## Testing

You can now safely:

- ✅ Sign up multiple users in development
- ✅ Switch between development and production databases
- ✅ Use different databases for different environments
