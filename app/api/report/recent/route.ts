import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Report } from '@/models/Report';

export async function GET() {
  await dbConnect();

  const now = new Date();
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000); // son 5 saat

  const recentReports = await Report.find({
    dateTime: { $gte: fiveHoursAgo.toISOString() },
  });

  return NextResponse.json({ reports: recentReports });
}
