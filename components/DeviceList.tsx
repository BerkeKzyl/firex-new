import { useEffect, useState, useMemo } from 'react';

interface DeviceReading {
  _id: string;
  device_id?: string;
  timestamp: string;
  temperature_C: number;
  humidity_percent: number;
  gas_detected: boolean;
}

export default function DeviceList() {
  const [devices, setDevices] = useState<DeviceReading[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<keyof DeviceReading>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      const res = await fetch('/api/devices');
      const data = await res.json();
      setDevices(data);
      setLoading(false);
    };
    fetchDevices();
  }, []);

  const sortedDevices = useMemo(() => {
    let filtered = devices;
    if (filter) {
      filtered = filtered.filter(d =>
        (d.device_id || '').toLowerCase().includes(filter.toLowerCase()) ||
        (d.timestamp || '').toLowerCase().includes(filter.toLowerCase())
      );
    }
    return [...filtered].sort((a, b) => {
      if (a[sortKey]! < b[sortKey]!) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortKey]! > b[sortKey]!) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [devices, sortKey, sortOrder, filter]);

  const handleSort = (key: keyof DeviceReading) => {
    if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu cihaz verisini silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/devices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDevices(devices.filter((d) => d._id !== id && d.device_id !== id));
    } else {
      alert('Silme işlemi başarısız!');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Device Data</h2>
      <input
        type="text"
        placeholder="Filter by Device ID or Timestamp..."
        className="mb-4 p-2 border rounded w-full max-w-xs"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('device_id')}>Device ID {sortKey === 'device_id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('timestamp')}>Timestamp {sortKey === 'timestamp' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('temperature_C')}>Temperature (°C) {sortKey === 'temperature_C' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('humidity_percent')}>Humidity (%) {sortKey === 'humidity_percent' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('gas_detected')}>Gas {sortKey === 'gas_detected' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDevices.map((device) => (
                <tr key={device._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.device_id || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(device.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.temperature_C}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.humidity_percent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {device.gas_detected ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Yes</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setSelectedDevice(device)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal componenti daha sonra eklenecek */}
    </div>
  );
} 