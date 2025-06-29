const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lets_play');

// Define schemas (simplified versions for the script)
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    avatar: String,
    bio: String,
    age: mongoose.Schema.Types.Mixed,
    location: {
      cords: {
        lat: Number,
        lng: Number,
      },
      address: String,
    },
    isVerified: { type: Boolean, default: false },
    hasCompletedOnboarding: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    password: String,
  },
  { timestamps: true }
);

const UserStatsSchema = new mongoose.Schema({
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  rank: { type: String, default: 'Beginner' },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  favoriteSport: { type: String, default: '' },
  credibility: { type: Number, default: 0 },
  participation: { type: Number, default: 0 },
  gamesCreated: { type: Number, default: 0 },
});

const UserSocialSchema = new mongoose.Schema({
  friendsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  blockedUsers: [String],
});

const UserGameHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  registeredGames: [String],
  playedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  upcomingGames: [String],
});

const UserAchievementsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  achievements: [
    {
      title: String,
      description: String,
      icon: String,
      unlockedAt: String,
    },
  ],
});

const UserAnalyticsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  activityLog: [
    {
      date: String,
      action: String,
      details: mongoose.Schema.Types.Mixed,
    },
  ],
  performanceMetrics: mongoose.Schema.Types.Mixed,
});

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  favoriteSports: [String],
  stats: { type: mongoose.Schema.Types.ObjectId, ref: 'UserStats' },
  social: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSocial' },
  history: { type: mongoose.Schema.Types.ObjectId, ref: 'UserGameHistory' },
  analytics: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAnalytics' },
  achievements: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAchievements' },
});

const User = mongoose.model('User', UserSchema);
const UserStats = mongoose.model('UserStats', UserStatsSchema);
const UserSocial = mongoose.model('UserSocial', UserSocialSchema);
const UserGameHistory = mongoose.model('UserGameHistory', UserGameHistorySchema);
const UserAchievements = mongoose.model('UserAchievements', UserAchievementsSchema);
const UserAnalytics = mongoose.model('UserAnalytics', UserAnalyticsSchema);
const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

async function fixUserProfiles() {
  try {
    console.log('Connected to database');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let createdCount = 0;
    let existingCount = 0;

    for (const user of users) {
      const userId = user._id.toString();

      // Check if user profile exists
      const existingProfile = await UserProfile.findOne({ userId });

      if (!existingProfile) {
        console.log(`Creating UserProfile for user: ${user.name} (${userId})`);

        try {
          // Create all required subdocuments
          const stats = await UserStats.create({});
          const social = await UserSocial.create({});
          const history = await UserGameHistory.create({
            userId: userId,
            registeredGames: [],
          });
          const achievements = await UserAchievements.create({
            userId: userId,
            achievements: [],
          });
          const analytics = await UserAnalytics.create({
            userId: userId,
            activityLog: [],
          });

          // Create new user profile
          const userProfile = await UserProfile.create({
            userId: userId,
            favoriteSports: [],
            stats: stats._id,
            social: social._id,
            history: history._id,
            achievements: achievements._id,
            analytics: analytics._id,
          });

          console.log(`✅ Created UserProfile: ${userProfile._id}`);
          createdCount++;
        } catch (error) {
          console.error(`❌ Failed to create UserProfile for user ${userId}:`, error);
        }
      } else {
        console.log(`✅ UserProfile already exists for user: ${user.name}`);
        existingCount++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total users: ${users.length}`);
    console.log(`Existing profiles: ${existingCount}`);
    console.log(`Created profiles: ${createdCount}`);
    console.log('Script completed successfully!');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run the script
fixUserProfiles();
