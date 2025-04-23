import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Report } from '@/models/Report';

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  console.log("Gelen veri:", body);


  const newReport = new Report({
    latitude: body.latitude,
    longitude: body.longitude,
    dateTime: body.dateTime,
    image: body.image,
    comment: body.comment,
  });

  await newReport.save();
  return NextResponse.json({ success: true, report: newReport });
}

export async function GET() {
  await dbConnect();
  const reports = await Report.find().sort({ dateTime: -1 });
  return NextResponse.json({ reports });
}
