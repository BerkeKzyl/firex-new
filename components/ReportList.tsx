import { useEffect, useState } from 'react';

interface Report {
  _id: string;
  type?: string;
  description?: string;
  status: string;
  timestamp: string;
  showOnMap?: boolean;
  [key: string]: any;
}

export default function ReportList() {
  const [activeTab, setActiveTab] = useState<'web' | 'mobile'>('web');
  const [webReports, setWebReports] = useState<Report[]>([]);
  const [mobileReports, setMobileReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const [webRes, mobileRes] = await Promise.all([
        fetch('/api/report'),
        fetch('/api/mobile/report'),
      ]);
      let webData = await webRes.json();
      let mobileData = await mobileRes.json();
      if (!Array.isArray(webData)) webData = [];
      if (!Array.isArray(mobileData)) mobileData = [];
      // status ve timestamp default ata
      webData = webData.map(r => ({ ...r, status: r.status || 'Unknown', timestamp: r.timestamp || r.dateTime || '' }));
      mobileData = mobileData.map(r => ({ ...r, status: r.status || 'Unknown', timestamp: r.timestamp || r.dateTime || '' }));
      setWebReports(webData);
      setMobileReports(mobileData);
      setLoading(false);
    };
    fetchReports();
  }, []);

  const reports = activeTab === 'web' ? webReports : mobileReports;

  const handleHide = async (id: string) => {
    const endpoint = activeTab === 'web' ? '/api/report/' : '/api/mobile/report/';
    const res = await fetch(endpoint + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: true }),
    });
    if (res.ok) {
      if (activeTab === 'web') setWebReports(webReports.filter((r) => r._id !== id));
      else setMobileReports(mobileReports.filter((r) => r._id !== id));
    } else {
      alert('Gizleme işlemi başarısız!');
    }
  };

  const handleResolve = async (id: string) => {
    const endpoint = activeTab === 'web' ? '/api/report/' : '/api/mobile/report/';
    const res = await fetch(endpoint + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Çözüldü' }),
    });
    if (res.ok) {
      if (activeTab === 'web') setWebReports(webReports.map((r) => r._id === id ? { ...r, status: 'Çözüldü' } : r));
      else setMobileReports(mobileReports.map((r) => r._id === id ? { ...r, status: 'Çözüldü' } : r));
    } else {
      alert('Güncelleme başarısız!');
    }
  };

  const handleShowOnMapToggle = async (id: string, value: boolean) => {
    const endpoint = activeTab === 'web' ? '/api/report/' : '/api/mobile/report/';
    const res = await fetch(endpoint + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showOnMap: value }),
    });
    if (res.ok) {
      if (activeTab === 'web') setWebReports(webReports.map((r) => r._id === id ? { ...r, showOnMap: value } : r));
      else setMobileReports(mobileReports.map((r) => r._id === id ? { ...r, showOnMap: value } : r));
    } else {
      alert('Show on Map update failed!');
    }
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'web' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('web')}
        >
          Web Raporlar
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'mobile' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('mobile')}
        >
          Mobil Raporlar
        </button>
      </div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Show on Map</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.description || report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Çözüldü' ? 'bg-green-100 text-green-800' :
                      report.status === 'İnceleniyor' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(report.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="checkbox"
                      checked={!!report.showOnMap}
                      onChange={e => handleShowOnMapToggle(report._id, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-red-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-500 hover:underline mr-2">Detay</button>
                    <button className="text-green-500 hover:underline mr-2" onClick={() => handleResolve(report._id)}>Çöz</button>
                    <button className="text-gray-500 hover:underline" onClick={() => handleHide(report._id)}>Gizle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Detay ve modal componentleri daha sonra eklenecek */}
    </div>
  );
} 