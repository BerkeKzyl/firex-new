"use client";

import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recentReportsCount, setRecentReportsCount] = useState(0);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        const response = await fetch('/api/report/recent');
        const data = await response.json();
        setRecentReportsCount(data.reports.length);
      } catch (error) {
        console.error('Error fetching recent reports:', error);
      }
    };

    fetchRecentReports();
  }, []);

  // Örnek sensör verileri
  const sensorData = [
    { id: 1, name: 'Sıcaklık Sensörü', location: 'A Blok', lastReading: '25°C', timestamp: '2024-03-20 14:30' },
    { id: 2, name: 'Duman Sensörü', location: 'B Blok', lastReading: 'Normal', timestamp: '2024-03-20 14:30' },
    { id: 3, name: 'Gaz Sensörü', location: 'C Blok', lastReading: 'Normal', timestamp: '2024-03-20 14:30' },
  ];

  // Örnek raporlar
  const reports = [
    { id: 1, type: 'Yangın Alarmı', location: 'A Blok', status: 'Çözüldü', timestamp: '2024-03-19 15:45' },
    { id: 2, type: 'Sensör Arızası', location: 'B Blok', status: 'İnceleniyor', timestamp: '2024-03-20 10:15' },
    { id: 3, type: 'Bakım Raporu', location: 'C Blok', status: 'Tamamlandı', timestamp: '2024-03-18 09:30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-red-500 text-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('sensors')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'sensors'
                    ? 'border-b-2 border-red-500 text-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sensör Verileri
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'border-b-2 border-red-500 text-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Raporlar
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-b-2 border-red-500 text-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-red-500 text-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Toplam Sensör</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">{sensorData.length}</p>
                  </div>
                  <div className="bg-white/50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Aktif Raporlar</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">{recentReportsCount}</p>
                  </div>
                  <div className="bg-white/50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Çözülen Raporlar</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">
                      {reports.filter(r => r.status === 'Çözüldü').length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sensors' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Sensör Verileri</h2>
                <div className="bg-white/50 shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensör Adı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Okuma</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaman</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sensorData.map((sensor) => (
                        <tr key={sensor.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sensor.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.lastReading}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Aktif
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Raporlar</h2>
                <div className="bg-white/50 shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rapor Tipi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaman</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.map((report) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.status === 'Çözüldü' ? 'bg-green-100 text-green-800' :
                              report.status === 'İnceleniyor' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-red-500 hover:text-red-700">Detaylar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="bg-white/50 p-6 rounded-lg shadow">
                  <p className="text-gray-500">No users found.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">System Settings</h2>
                <div className="bg-white/50 p-6 rounded-lg shadow">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Site Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        defaultValue="FireX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                          />
                          <span className="ml-2">Enable email notifications</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 