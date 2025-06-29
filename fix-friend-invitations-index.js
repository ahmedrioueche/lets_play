const mongoose = require('mongoose');

async function fixFriendInvitationsIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop the old unique index
    try {
      await db.collection('friendinvitations').dropIndex('fromUserId_1_toUserId_1');
      console.log('Dropped old unique index');
    } catch (error) {
      console.log('Old index not found or already dropped');
    }

    // Create the new partial unique index
    await db.collection('friendinvitations').createIndex(
      { fromUserId: 1, toUserId: 1, status: 1 },
      {
        unique: true,
        partialFilterExpression: { status: 'pending' },
        name: 'fromUserId_1_toUserId_1_status_1_unique_pending',
      }
    );
    console.log('Created new partial unique index');

    // Clean up old accepted/declined invitations that might cause issues
    const result = await db.collection('friendinvitations').deleteMany({
      status: { $in: ['accepted', 'declined'] },
    });
    console.log(`Cleaned up ${result.deletedCount} old invitations`);

    console.log('Database fix completed successfully');
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixFriendInvitationsIndex();
