import { NextResponse } from 'next/server';
import { getMongooseConnection } from '../../../../lib/mongodb';
import AdminUser from '../../../../models/AdminUser';
import { Model, Document } from 'mongoose';

interface IAdminUser extends Document {
  username: string;
  password: string;
}

const AdminUserModel = AdminUser as Model<IAdminUser>;

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 });
  }

  await getMongooseConnection();
  const user = await AdminUserModel.findOne({ username, password });
  if (!user) {
    return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
  }

  // Giriş başarılı, kullanıcıyı döndür
  return NextResponse.json({
    user: {
      id: user._id.toString(),
      username: user.username
    }
  }, { status: 200 });
} 