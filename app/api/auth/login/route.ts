import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  const user = await users.findOne({ email, password }); // Güvenlik için hash karşılaştırması önerilir
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Gerçek JWT üret
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return NextResponse.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImage: user.profileImage || ''
    }
  }, { status: 200 });
} 