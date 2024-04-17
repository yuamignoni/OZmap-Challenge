import mongoose from "mongoose";

const MONGODB_URI = "mongodb://mongo:27017/ozmapdb";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
