import dbConnect from '../config/db';
import UserModel from '../models/User';
import UserAchievementsModel from '../models/UserAchievements';
import UserAnalyticsModel from '../models/UserAnalytics';
import UserGameHistoryModel from '../models/UserGameHistory';
import UserProfileModel from '../models/UserProfile';
import UserSocialModel from '../models/UserSocial';
import UserStatsModel from '../models/UserStats';

async function fixUserProfiles() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Get all users
    const users = await UserModel.find({});
    console.log(`Found ${users.length} users`);

    let createdCount = 0;
    let existingCount = 0;

    for (const user of users) {
      const userId = user._id.toString();

      // Check if user profile exists
      const existingProfile = await UserProfileModel.findOne({ userId });

      if (!existingProfile) {
        console.log(`Creating UserProfile for user: ${user.name} (${userId})`);

        try {
          // Create all required subdocuments
          const stats = await UserStatsModel.create({});
          const social = await UserSocialModel.create({});
          const history = await UserGameHistoryModel.create({
            userId: userId,
            registeredGames: [],
          });
          const achievements = await UserAchievementsModel.create({
            userId: userId,
            achievements: [],
          });
          const analytics = await UserAnalyticsModel.create({
            userId: userId,
            activityLog: [],
          });

          // Create new user profile
          const userProfile = await UserProfileModel.create({
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
    process.exit(0);
  }
}

// Run the script
fixUserProfiles();
