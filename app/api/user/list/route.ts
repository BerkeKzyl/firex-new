import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('firex');
    const users = await db.collection('users').find({}).toArray();
    const mapped = users.map(u => ({
      _id: u._id.toString(),
      email: u.email,
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      role: u.role || 'Kullanıcı',
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcılar çekilemedi', details: error }, { status: 500 });
  }
} 