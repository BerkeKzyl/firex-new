import mongoose from 'mongoose';

// MongoDB Atlas public connection string
const MONGODB_URI = "mongodb+srv://firex:firex123@cluster0.mongodb.net/firex?retryWrites=true&w=majority";

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  (global as any).mongoose = cached;
  return cached.conn;
}

// Report model
const ReportSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  dateTime: String,
  image: String,
  comment: {
    type: String,
    maxlength: 120,
  },
});

export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema); 