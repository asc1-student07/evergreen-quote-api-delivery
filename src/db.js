// src/db.js - the MongoDB connection (provided).
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/evergreen";

export async function connectDB() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("Connected to MongoDB:", MONGODB_URI);
}
