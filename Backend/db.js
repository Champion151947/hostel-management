import mongoose from "mongoose";

const ATLAS_URI =
  process.env.MONGODB_URI ||
  "mongodb://test:test@ac-pfxvflh-shard-00-00.lvfydzf.mongodb.net:27017,ac-pfxvflh-shard-00-01.lvfydzf.mongodb.net:27017,ac-pfxvflh-shard-00-02.lvfydzf.mongodb.net:27017/hostel_management?ssl=true&replicaSet=atlas-99mceb-shard-0&authSource=admin&appName=Cluster0";

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB - hostel_management");
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }

  return cached.conn;
};

connectDB().catch((err) => {
  console.error("Initial MongoDB connection failed:", err.message);
});

export default mongoose;
export { connectDB };
