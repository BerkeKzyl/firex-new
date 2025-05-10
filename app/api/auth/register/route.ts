import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, firstName, lastName } = body;

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: 'Email, password, firstName, and lastName required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  // Kullanıcı zaten var mı kontrol et
  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  // Şifreyi hashlemeden kaydediyoruz (güvenlik için bcrypt önerilir)
  const result = await users.insertOne({ email, password, firstName, lastName });

  // Gerçek JWT üret
  const token = jwt.sign(
    { userId: result.insertedId.toString(), email, firstName, lastName },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return NextResponse.json({
    token,
    user: { id: result.insertedId, email, firstName, lastName }
  }, { status: 201 });
} 