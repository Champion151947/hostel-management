import mongoose from "mongoose";

const ATLAS_URI =
  process.env.MONGODB_URI ||
  "mongodb://test:test@ac-pfxvflh-shard-00-00.lvfydzf.mongodb.net:27017,ac-pfxvflh-shard-00-01.lvfydzf.mongodb.net:27017,ac-pfxvflh-shard-00-02.lvfydzf.mongodb.net:27017/hostel_management?ssl=true&replicaSet=atlas-99mceb-shard-0&authSource=admin&appName=Cluster0";

const LOCAL_URI = "mongodb://localhost:27017/hostel_management";

const connectDB = async () => {
  // Try Atlas first
  try {
    await mongoose.connect(ATLAS_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Connected to MongoDB Atlas - hostel_management");
    return;
  } catch (atlasErr) {
    console.warn(
      "⚠️  Atlas connection failed (IP may not be whitelisted). Trying local MongoDB..."
    );
  }

  // Fallback to local MongoDB
  try {
    await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("✅ Connected to local MongoDB - hostel_management");
    console.log(
      "ℹ️  To use Atlas, whitelist your IP (223.181.12.98) at https://cloud.mongodb.com → Network Access"
    );
  } catch (localErr) {
    console.error("❌ Both Atlas and local MongoDB connections failed.");
    console.error(
      "\n--- HOW TO FIX ---\n" +
        "Option 1 (Recommended): Whitelist your IP on MongoDB Atlas:\n" +
        "  1. Go to https://cloud.mongodb.com\n" +
        "  2. Click 'Network Access' → 'Add IP Address'\n" +
        "  3. Add your IP: 223.181.12.98  (or click 'Allow Access From Anywhere' for dev)\n\n" +
        "Option 2: Install MongoDB locally:\n" +
        "  Run: winget install MongoDB.Server\n" +
        "  Then restart the backend.\n"
    );
    process.exit(1);
  }
};

connectDB();

export default mongoose;
