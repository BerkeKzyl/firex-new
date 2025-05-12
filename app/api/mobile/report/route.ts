import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

function getUserIdFromRequest(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = getUserIdFromRequest(req);
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
    userId: userId,
  };
  console.log('MOBILE REPORT INSERTED:', newReport);
  const result = await reports.insertOne(newReport);

  // Sadece FireReport objesi dön
  return NextResponse.json({
    _id: result.insertedId,
    user_id: userId,
    latitude: newReport.latitude,
    longitude: newReport.longitude,
    image_url: newReport.image || null,
    comment: newReport.comment,
    timestamp: newReport.dateTime
  });
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('firex');
    const reports = await db.collection('mobile_reports').find({ hidden: { $ne: true } }).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Veri çekilemedi', details: error }, { status: 500 });
  }
} 