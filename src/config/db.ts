import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
  var _mongooseConnection: typeof mongoose | undefined;
}

async function dbConnect() {
  if (global._mongooseConnection) {
    return global._mongooseConnection;
  }

  if (!global._mongoosePromise) {
    const opts = {
      bufferCommands: false,
    };

    global._mongoosePromise = mongoose.connect(MONGODB_URI as string, opts);
  }

  try {
    global._mongooseConnection = await global._mongoosePromise;
  } catch (e) {
    global._mongoosePromise = undefined; // Reset promise on error
    throw e;
  }

  return global._mongooseConnection;
}

// Function to get MongoDB database instance for direct operations
async function connectToDatabase() {
  await dbConnect();
  return { db: mongoose.connection.db };
}

export default dbConnect;
export { connectToDatabase };
