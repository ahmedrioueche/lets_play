const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define User schema inline for testing
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    avatar: { type: String },
    bio: { type: String },
    age: { type: mongoose.Schema.Types.Mixed },
    location: {
      cords: {
        lat: { type: Number },
        lng: { type: Number },
      },
      address: { type: String },
    },
    isVerified: { type: Boolean, default: false },
    hasCompletedOnboarding: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    password: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testUsers() {
  try {
    console.log('Testing user lookup...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

    const userId1 = '68611a7d8c4a1a9e4337b0ef';
    const userId2 = '68611a8e8c4a1a9e4337b112';

    console.log('Looking for user 1:', userId1);
    const user1 = await User.findById(userId1).lean();
    console.log(
      'User 1 found:',
      user1 ? { _id: user1._id, name: user1.name, email: user1.email } : 'NOT FOUND'
    );

    console.log('Looking for user 2:', userId2);
    const user2 = await User.findById(userId2).lean();
    console.log(
      'User 2 found:',
      user2 ? { _id: user2._id, name: user2.name, email: user2.email } : 'NOT FOUND'
    );

    // Check total users in database
    const totalUsers = await User.countDocuments();
    console.log('Total users in database:', totalUsers);

    // List first 5 users
    const users = await User.find().limit(5).lean();
    console.log(
      'First 5 users:',
      users.map((u) => ({ _id: u._id, name: u.name, email: u.email }))
    );
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testUsers();
