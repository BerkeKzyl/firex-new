import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const reports = db.collection('reports');

  const newReport = {
    latitude: body.latitude,
    longitude: body.longitude,
    dateTime: body.dateTime,
    image: body.image,
    comment: body.comment,
    showOnMap: typeof body.showOnMap === 'boolean' ? body.showOnMap : true,
  };

  const result = await reports.insertOne(newReport);
  return NextResponse.json({ success: true, report: { ...newReport, _id: result.insertedId } });
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('firex');
    const reports = await db.collection('reports').find({ hidden: { $ne: true } }).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Veri çekilemedi', details: error }, { status: 500 });
  }
}
