import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    profileImage: user.profileImage || '',
  });
}

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { email, firstName, lastName, password, profileImage } = body;

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  const update: any = { email, firstName, lastName };
  if (password) update.password = password;
  if (profileImage) update.profileImage = profileImage;

  await users.updateOne({ _id: new ObjectId(userId) }, { $set: update });

  const updatedUser = await users.findOne({ _id: new ObjectId(userId) });

  if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    id: updatedUser._id.toString(),
    email: updatedUser.email,
    firstName: updatedUser.firstName || '',
    lastName: updatedUser.lastName || '',
    profileImage: updatedUser.profileImage || '',
  });
} 