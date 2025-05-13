import { useState, useEffect } from 'react';

interface Device {
  _id: string;
  timestamp: string;
  temperature_C: number;
  humidity_percent: number;
  gas_detected: boolean;
  device_id: number | string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

type SortKey = keyof Pick<Device, 'device_id' | 'timestamp' | 'temperature_C' | 'humidity_percent' | 'gas_detected'>;

type SortOrder = 'asc' | 'desc';

export default function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('device_id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/devices');
      if (!response.ok) throw new Error('Failed to fetch devices');
      const data = await response.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedDevices = [...devices].sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];
    if (sortKey === 'timestamp') {
      aValue = new Date(a.timestamp).getTime();
      bValue = new Date(b.timestamp).getTime();
    }
    if (aValue === bValue) return 0;
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return <div className="text-center py-4">Loading devices...</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('device_id')}>
                Device ID {sortKey === 'device_id' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('timestamp')}>
                Timestamp {sortKey === 'timestamp' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('temperature_C')}>
                Temperature (°C) {sortKey === 'temperature_C' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('humidity_percent')}>
                Humidity (%) {sortKey === 'humidity_percent' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('gas_detected')}>
                Gas Detected {sortKey === 'gas_detected' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location (Lat, Lng)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDevices.map((device) => (
              <tr key={device._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.device_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(device.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.temperature_C}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.humidity_percent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.gas_detected ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {device.location && Array.isArray(device.location.coordinates)
                    ? `${device.location.coordinates[1].toFixed(6)}, ${device.location.coordinates[0].toFixed(6)}`
                    : <span className="text-gray-400 italic">No location</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 