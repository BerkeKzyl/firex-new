import { NextResponse } from 'next/server';
import { getMongooseConnection } from '../../../lib/mongodb';
import AdminNotification from '../../../models/AdminNotification';
import { sendNotificationEmail } from '../../../lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Gerekli alanlar: latitude, longitude, dateTime, image, comment, status
    if (!body || !body.latitude || !body.longitude || !body.dateTime) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
    }
    await getMongooseConnection();
    const adminNotifications = await AdminNotification.find({ isActive: true }).exec();
    if (!adminNotifications.length) {
      return NextResponse.json({ error: 'Bildirim alacak admin yok' }, { status: 404 });
    }
    let successCount = 0;
    for (const admin of adminNotifications) {
      try {
        await sendNotificationEmail(admin.email, body);
        successCount++;
      } catch (err) {
        console.error('Mail gönderilemedi:', admin.email, err);
      }
    }
    return NextResponse.json({ success: true, sent: successCount, total: adminNotifications.length });
  } catch (error) {
    console.error('Bildirim endpoint hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası', details: error }, { status: 500 });
  }
} 