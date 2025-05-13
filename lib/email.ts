import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendNotificationEmail(to: string, reportData: any) {
  let image = reportData.image;
  if (image && !image.startsWith('data:image')) {
    image = `data:image/jpeg;base64,${image}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Yeni Yangın Raporu Bildirimi',
    html: `
      <h2>Yeni Bir Yangın Raporu Alındı</h2>
      <p><strong>Tarih:</strong> ${reportData.dateTime}</p>
      <p><strong>Konum:</strong> ${reportData.latitude}, ${reportData.longitude}</p>
      <p><strong>Açıklama:</strong> ${reportData.comment || 'Açıklama yok'}</p>
      ${image ? `<p><strong>Görsel:</strong> <img src="${image}" alt="Yangın Görseli" style="max-width: 300px;"></p>` : ''}
      <p>Raporu görüntülemek için admin paneline giriş yapın.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Bildirim e-postası gönderildi: ${to}`);
  } catch (error) {
    console.error('E-posta gönderimi başarısız:', error);
  }
} 