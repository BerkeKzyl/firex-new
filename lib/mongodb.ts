// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI bulunamadı!");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB bağlantısı başarılı!");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB bağlantı hatası:", error);
      throw error;
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

export default dbConnect;
