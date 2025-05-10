import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const reports = db.collection('reports');

  const now = new Date();
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000); // son 5 saat

  const recentReports = await reports.find({
    dateTime: { $gte: fiveHoursAgo.toISOString() },
  }).toArray();

  return NextResponse.json({ reports: recentReports });
}
