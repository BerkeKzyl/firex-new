import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const client = await clientPromise;
    const db = client.db('firex');
    const result = await db.collection('mobile_reports').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Rapor bulunamadı veya silinemedi.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme işlemi başarısız', details: error }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db('firex');
    const result = await db.collection('mobile_reports').updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Rapor bulunamadı.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız', details: error }, { status: 500 });
  }
} 