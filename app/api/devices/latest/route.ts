import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('SensorDB');
    
    // Get latest reading for each device using MongoDB aggregation
    const latestReadings = await db.collection('Readings').aggregate([
      // Sort by timestamp in descending order
      { $sort: { timestamp: -1 } },
      // Group by device_id and take the first (latest) reading
      { $group: {
        _id: "$device_id",
        deviceId: { $first: "$device_id" },
        temperature: { $first: "$temperature_C" },
        humidity: { $first: "$humidity_percent" },
        location: { $first: "$location" },
        timestamp: { $first: "$timestamp" }
      }},
      // Project to match the expected format
      { $project: {
        _id: 0,
        deviceId: 1,
        temperature: 1,
        humidity: 1,
        location: 1,
        timestamp: 1
      }}
    ]).toArray();

    return NextResponse.json(latestReadings);
  } catch (error) {
    return NextResponse.json({ error: 'Veri çekilemedi', details: error }, { status: 500 });
  }
} 