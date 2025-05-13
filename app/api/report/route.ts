import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { sendNotificationEmail } from '../../../lib/email';
import AdminNotification from '../../../models/AdminNotification';
import { getMongooseConnection } from '../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: Request) 
{
  try {
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

    // Otomatik mail bildirimi gönder
    try {
      await getMongooseConnection();
      const adminNotifications = await AdminNotification.find({ isActive: true }).exec();
      // E-posta adreslerini benzersizleştir
      const uniqueEmails = [...new Set(adminNotifications.map(admin => admin.email))];
      console.log('Bulunan admin bildirimleri:', uniqueEmails.length);
      
      if (uniqueEmails.length > 0) {
        // Görseli düzelt
        let image = newReport.image;
        if (image && !image.startsWith('data:image')) {
          image = `data:image/jpeg;base64,${image}`;
        }
        const reportWithImage = { ...newReport, image };
        for (const email of uniqueEmails) {
          try {
            await sendNotificationEmail(email, reportWithImage);
            console.log(`Bildirim e-postası gönderildi: ${email}`);
          } catch (err) {
            console.error('Mail gönderilemedi:', email, err);
          }
        }
      } else {
        console.log('Aktif admin bildirimi bulunamadı');
      }
    } catch (error) {
      console.error('Bildirim gönderme hatası:', error);
    }

    return NextResponse.json({ success: true, report: { ...newReport, _id: result.insertedId } });
  } catch (error) {
    console.error('Report oluşturma hatası:', error);
    return NextResponse.json({ error: 'Report oluşturulamadı', details: error }, { status: 500 });
  }
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
