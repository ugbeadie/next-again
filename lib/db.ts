import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in your .env file");
}

// Global cache to prevent multiple connections in dev / serverless
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "restapi",
      bufferCommands: true,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
    return cached.conn;
  } catch (err: any) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", err.message);
    throw new Error("MongoDB connection failed");
  }
};

export default connect;
