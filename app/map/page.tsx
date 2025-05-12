'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔧 Custom icons
const deviceIcon = new L.Icon({
  iconUrl: '/custom-icons/mapIcon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const reportIcon = new L.Icon({
  iconUrl: '/custom-icons/Fire-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

type Report = {
  _id: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  comment?: string;
};

export default function MapPage() {
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/report");
        const data = await res.json();
        console.log("📡 Raw API Response:", data);
        setRecentReports((data || []).map(r => ({
          ...r,
          dateTime: r.timestamp
        })));
      } catch (err) {
        console.error("❌ Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, []);

  // Debug için raporları render ederken de kontrol edelim
  console.log("🎯 Rendering Reports:", recentReports);

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center gap-12 bg-gradient-to-br from-orange-50 to-orange-100">
      <h1 className="text-3xl font-bold text-orange-600 text-center">
        🗺️ FireX Maps
      </h1>

      {/* MAP 1 - Device Locations */}
      <section className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-black">🛰️ Device Locations</h2>
        <div className="rounded-xl overflow-hidden">
          <MapContainer
            center={[41.015137, 28.979530]} // İstanbul
            zoom={6}
            style={{ height: '400px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[41.015137, 28.979530]} icon={deviceIcon}>
              <Popup>Example Device Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>

      {/* MAP 2 - User Reports */}
      <section className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-black">�� User Reports</h2>
        <div className="rounded-xl overflow-hidden">
          <MapContainer
            center={[39.0, 35.0]} // Türkiye merkezi
            zoom={6}
            style={{ height: '400px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {recentReports.map((report) => {
              console.log("📍 Rendering Marker for Report:", report._id, "at position:", [report.latitude, report.longitude]);
              return (
                <Marker
                  key={report._id}
                  position={[report.latitude, report.longitude]}
                  icon={reportIcon}
                >
                  <Popup className="text-sm">
                    <p><strong>🕒 Date:</strong><br /> {new Date(report.dateTime).toLocaleString()}</p>
                    {report.comment && (
                      <p className="mt-2"><strong>📝 Comment:</strong><br /> {report.comment}</p>
                    )}
                    <p className="mt-2"><strong>📍 Location:</strong><br /> Lat: {report.latitude}, Lng: {report.longitude}</p>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </section>
    </main>
  );
}
