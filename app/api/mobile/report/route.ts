import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('MOBILE REPORT POST BODY:', body);
  const client = await clientPromise;
  const db = client.db();
  const reports = db.collection('mobile_reports');

  const newReport = {
    latitude: body.latitude,
    longitude: body.longitude,
    dateTime: body.dateTime,
    image: body.image,
    comment: body.comment,
    deviceInfo: body.deviceInfo,
    userId: body.userId,
  };
  console.log('MOBILE REPORT INSERTED:', newReport);
  const result = await reports.insertOne(newReport);
  return NextResponse.json({ success: true, report: { ...newReport, _id: result.insertedId } });
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const reports = db.collection('mobile_reports');
  const allReports = await reports.find().sort({ dateTime: -1 }).toArray();
  console.log('MOBILE REPORTS GET:', allReports);
  return NextResponse.json({ reports: allReports });
} 