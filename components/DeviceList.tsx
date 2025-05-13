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

type SortKey = keyof Pick<Device, 'device_id' | 'timestamp' | 'temperature_C' | 'humidity_percent' | 'gas_detected'> | 'risk_index';

type SortOrder = 'asc' | 'desc';

export default function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('device_id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showTooltipRow, setShowTooltipRow] = useState<string | null>(null);

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
    let aValue: any = a[sortKey as keyof Device];
    let bValue: any = b[sortKey as keyof Device];
    if (sortKey === 'timestamp') {
      aValue = new Date(a.timestamp).getTime();
      bValue = new Date(b.timestamp).getTime();
    }
    if (sortKey === 'risk_index') {
      // Risk index hesapla
      const getRiskIndex = (d: Device) => (typeof d.humidity_percent === 'number' && typeof d.temperature_C === 'number' && (d.temperature_C - 6) !== 0)
        ? d.humidity_percent / (d.temperature_C - 6)
        : -9999;
      aValue = getRiskIndex(a);
      bValue = getRiskIndex(b);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('risk_index')}>
                Yangın Riski {sortKey === 'risk_index' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDevices.map((device) => {
              const H = device.humidity_percent;
              const T = device.temperature_C;
              const gas = device.gas_detected;
              let riskIndex = null;
              let riskLabel = '-';
              let riskColor = 'bg-gray-300 text-gray-800';
              let riskLevel = 0; // 0: -, 1: Düşük, 2: Orta, 3: Yüksek, 4: Aşırı Yüksek
              if (typeof H === 'number' && typeof T === 'number' && (T - 6) !== 0) {
                riskIndex = H / (T - 6);
                if (riskIndex > 4) {
                  riskLabel = 'Düşük';
                  riskColor = 'bg-green-200 text-green-800';
                  riskLevel = 1;
                } else if (riskIndex > 2) {
                  riskLabel = 'Orta';
                  riskColor = 'bg-yellow-200 text-yellow-800';
                  riskLevel = 2;
                } else if (riskIndex > 1) {
                  riskLabel = 'Yüksek';
                  riskColor = 'bg-orange-200 text-orange-800';
                  riskLevel = 3;
                } else if (riskIndex <= 1) {
                  riskLabel = 'Aşırı Yüksek';
                  riskColor = 'bg-red-200 text-red-800';
                  riskLevel = 4;
                }
                // Gaz tespit edildiyse riski bir üst seviyeye çıkar
                if (gas && riskLevel > 0 && riskLevel < 4) {
                  riskLevel += 1;
                  if (riskLevel === 2) {
                    riskLabel = 'Orta';
                    riskColor = 'bg-yellow-200 text-yellow-800';
                  } else if (riskLevel === 3) {
                    riskLabel = 'Yüksek';
                    riskColor = 'bg-orange-200 text-orange-800';
                  } else if (riskLevel === 4) {
                    riskLabel = 'Aşırı Yüksek';
                    riskColor = 'bg-red-200 text-red-800';
                  }
                }
              }
              return (
                <tr key={device._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.device_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(device.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.temperature_C}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.humidity_percent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.gas_detected ? (
                      <span className="inline-block px-2 py-1 rounded-full bg-red-200 text-red-800 font-semibold text-xs">Yes</span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full bg-green-200 text-green-800 font-semibold text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.location && Array.isArray(device.location.coordinates)
                      ? `${device.location.coordinates[1].toFixed(6)}, ${device.location.coordinates[0].toFixed(6)}`
                      : <span className="text-gray-400 italic">No location</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full font-semibold text-xs transition-all duration-200 cursor-pointer ${riskColor} ${showTooltipRow === device._id ? 'scale-125 shadow-lg z-20' : ''}`}
                      onMouseEnter={() => setShowTooltipRow(device._id)}
                      onMouseLeave={() => setShowTooltipRow(null)}
                    >
                      {riskLabel}
                    </span>
                    {showTooltipRow === device._id && (
                      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-72 bg-white border border-gray-300 rounded-xl shadow-xl p-4 z-30 animate-fade-in">
                        <div className="font-bold mb-2 text-gray-800">Yangın Riski Detayı</div>
                        <div className="mb-1 text-sm"><b>Angström Index:</b> {riskIndex !== null ? riskIndex.toFixed(2) : '-'}</div>
                        <div className="mb-1 text-sm"><b>Formül:</b> <span className="font-mono">H / (T - 6)</span></div>
                        <div className="mb-1 text-sm"><b>Bağıl Nem (H):</b> {H ?? '-'}</div>
                        <div className="mb-1 text-sm"><b>Sıcaklık (T):</b> {T ?? '-'}</div>
                        <div className="mb-1 text-sm"><b>Gaz Tespiti:</b> {gas ? <span className="text-red-600 font-semibold">Var</span> : 'Yok'}</div>
                        <div className="mb-2 text-xs text-gray-500">Gaz tespit edilirse risk bir üst seviyeye çıkarılır.</div>
                        <div className="mb-2 text-xs">
                          <b>Risk Aralıkları:</b><br/>
                          <span className="inline-block w-3 h-3 bg-green-200 rounded-full mr-1 align-middle"></span> Düşük: &gt; 4<br/>
                          <span className="inline-block w-3 h-3 bg-yellow-200 rounded-full mr-1 align-middle"></span> Orta: 2 - 4<br/>
                          <span className="inline-block w-3 h-3 bg-orange-200 rounded-full mr-1 align-middle"></span> Yüksek: 1 - 2<br/>
                          <span className="inline-block w-3 h-3 bg-red-200 rounded-full mr-1 align-middle"></span> Aşırı Yüksek: ≤ 1
                        </div>
                        <div className="mt-2 text-base font-bold">Bu cihaz: <span className={`${riskColor} px-2 py-1 rounded`}>{riskLabel}</span></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 