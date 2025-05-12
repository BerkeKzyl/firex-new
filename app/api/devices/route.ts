import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('SensorDB');
    const readings = await db.collection('Readings').find({}).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(readings);
  } catch (error) {
    return NextResponse.json({ error: 'Veri çekilemedi', details: error }, { status: 500 });
  }
} 