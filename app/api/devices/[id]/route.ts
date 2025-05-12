import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const client = await clientPromise;
    const db = client.db('SensorDB');
    // Önce _id ile silmeyi dene, yoksa device_id ile dene
    const result = await db.collection('Readings').deleteOne({
      $or: [
        { _id: new ObjectId(id) },
        { device_id: id }
      ]
    });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Kayıt bulunamadı veya silinemedi.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme işlemi başarısız', details: error }, { status: 500 });
  }
} 