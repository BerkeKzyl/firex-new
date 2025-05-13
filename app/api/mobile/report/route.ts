import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

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
    status: body.status || 'Active',
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

export async function GET(request) {
  try {
    const url = request?.url ? new URL(request.url) : null;
    const all = url?.searchParams.get('all') === 'true';
    const client = await clientPromise;
    const db = client.db('firex');
    const query = all ? { hidden: { $ne: true } } : { hidden: { $ne: true }, status: 'Active' };
    const reports = await db.collection('mobile_reports').find(query).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Veri çekilemedi', details: error }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
  const body = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db('firex');
    const updateFields: any = {};
    if (body.status) updateFields.status = body.status;
    if (typeof body.showOnMap === 'boolean') updateFields.showOnMap = body.showOnMap;
    const result = await db.collection('mobile_reports').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Rapor bulunamadı.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız', details: error }, { status: 500 });
  }
} 