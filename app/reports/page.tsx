'use client';

import { useEffect, useState } from 'react';

interface Report {
  _id: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  image: string;
  comment: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/report');
        const data = await response.json();
        setReports(data.reports);
      } catch (err) {
        setError('Raporlar yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="p-4">Yükleniyor...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-orange-50 to-orange-100">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">🔥 Yangın Raporları</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div key={report._id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md">
            <img 
              src={report.image} 
              alt="Yangın görüntüsü" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-2">{report.comment}</p>
            <p className="text-sm text-gray-500">
              {new Date(report.dateTime).toLocaleString('tr-TR')}
            </p>
            <p className="text-sm text-gray-500">
              Konum: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
} 