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
    status: body.status || 'Active',
  };

  const result = await reports.insertOne(newReport);
  return NextResponse.json({ success: true, report: { ...newReport, _id: result.insertedId } });
}

export async function GET(request) {
  try {
    const url = request?.url ? new URL(request.url) : null;
    const all = url?.searchParams.get('all') === 'true';
    const client = await clientPromise;
    const db = client.db('firex');
    const query = all ? { hidden: { $ne: true } } : { hidden: { $ne: true }, status: 'Active' };
    const reports = await db.collection('reports').find(query).sort({ dateTime: -1 }).toArray();
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Veri çekilemedi', details: error }, { status: 500 });
  }
}
