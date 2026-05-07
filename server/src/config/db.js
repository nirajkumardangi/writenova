import mongoose from "mongoose";
import env from "./env.js";

async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.log("MongoDB Connection Failed ❌", error);
    process.exit(1);
  }
}

export default connectDB;
