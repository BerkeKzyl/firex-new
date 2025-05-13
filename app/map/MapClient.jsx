"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const istanbulCenter = {
  lat: 41.015137,
  lng: 28.97953,
};

const turkeyCenter = {
  lat: 39.0,
  lng: 35.0,
};

const libraries = ["places"];

export default function MapClient() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  useEffect(() => {
    // Cihazlar
    fetch('/api/devices')
      .then(res => res.json())
      .then((data) => {
        // Her cihaz için son 5 veriyi grupla
        const grouped = {};
        data.forEach((item) => {
          const id = item.device_id || 'unknown';
          if (!grouped[id]) grouped[id] = { device_id: id, location: item.location, sensors: [] };
          if (item.location && item.location.coordinates) grouped[id].location = item.location;
          grouped[id].sensors.push(item);
        });
        // Son 5 veriyi al
        const deviceArr = Object.values(grouped).map((d) => ({
          ...d,
          sensors: d.sensors.slice(0, 5),
        }));
        setDevices(deviceArr);
      })
      .catch(() => setDevices([]));
    // Raporlar
    const fetchAllReports = async () => {
      try {
        const [webRes, mobileRes] = await Promise.all([
          fetch("/api/report"),
          fetch("/api/mobile/report")
        ]);
        const webData = await webRes.json();
        const mobileData = await mobileRes.json();
        const webReports = Array.isArray(webData) ? webData : [];
        const mobileReports = Array.isArray(mobileData) ? mobileData : [];
        const allReports = [...webReports, ...mobileReports].map((r) => ({
          ...r,
          dateTime: r.timestamp || r.dateTime,
        }));
        setReports(allReports);
      } catch (err) {
        setReports([]);
        console.error("❌ Failed to fetch reports:", err);
      }
    };
    fetchAllReports();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Sadece aktif ve haritada gösterilecek raporları filtrele
  const visibleReports = reports.filter(r => {
    // status: 'Active' (mobilde de olabilir), showOnMap !== false (webde olabilir)
    const status = (r.status || 'Active').toLowerCase();
    const showOnMap = r.showOnMap;
    const lat = Number(r.latitude);
    const lng = Number(r.longitude);
    return status === 'active' && (showOnMap === undefined || showOnMap === true) && !isNaN(lat) && !isNaN(lng);
  });

  return (
    <>
      {/* MAP 1 - Device Locations */}
      <section className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-black">🛰️ Device Locations</h2>
        <div className="rounded-xl overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={istanbulCenter}
            zoom={6}
          >
            {devices.map((device) => {
              if (!device.location || !device.location.coordinates) return null;
              const [lng, lat] = device.location.coordinates;
              return (
                <Marker
                  key={device.device_id || device._id}
                  position={{ lat, lng }}
                  onClick={() => setSelectedDevice(device)}
                  icon={{
                    url: "/custom-icons/mapIcon.png",
                    scaledSize:
                      typeof window !== "undefined"
                        ? new window.google.maps.Size(40, 40)
                        : undefined,
                  }}
                />
              );
            })}
            {selectedDevice && selectedDevice.location && selectedDevice.location.coordinates && (
              <InfoWindow
                position={{
                  lat: selectedDevice.location.coordinates[1],
                  lng: selectedDevice.location.coordinates[0],
                }}
                onCloseClick={() => setSelectedDevice(null)}
              >
                <div className="p-4 min-w-[260px] max-w-xs flex flex-col gap-2">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 font-semibold">Device ID</span>
                    <div className="text-lg font-bold text-orange-700">{selectedDevice.device_id}</div>
                  </div>
                  {selectedDevice.sensors && selectedDevice.sensors.length > 0 ? (
                    <>
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 font-semibold">Zaman</span>
                        <div className="text-base font-medium text-gray-800">{selectedDevice.sensors[0].timestamp ? (new Date(selectedDevice.sensors[0].timestamp).toLocaleString()) : '-'}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500 font-semibold">Sıcaklık</span>
                          <span className="text-2xl font-bold text-red-600">{selectedDevice.sensors[0].temperature_C ?? selectedDevice.sensors[0].temperature ?? '-'}</span>
                          <span className="text-xs text-gray-500">°C</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500 font-semibold">Nem</span>
                          <span className="text-2xl font-bold text-blue-600">{selectedDevice.sensors[0].humidity_percent ?? selectedDevice.sensors[0].humidity ?? '-'}</span>
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500 font-semibold">Gaz</span>
                          <span className={`text-2xl font-bold ${selectedDevice.sensors[0].gas_detected ? 'text-red-700' : 'text-green-700'}`}>{selectedDevice.sensors[0].gas_detected ? 'Var' : 'Yok'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">Veri yok</div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </section>

      {/* MAP 2 - User Reports */}
      <section className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-black">🔥 User Reports</h2>
        <div className="rounded-xl overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={turkeyCenter}
            zoom={6}
          >
            {visibleReports.length === 0 && (
              <div className="p-4 text-center text-gray-500">No reports found.</div>
            )}
            {visibleReports.map((report) => {
              const lat = Number(report.latitude);
              const lng = Number(report.longitude);
              return (
                <Marker
                  key={report._id || `${lat},${lng}`}
                  position={{ lat, lng }}
                  onClick={() => setSelectedReport(report)}
                  icon={{
                    url: "/custom-icons/Fire-icon.png",
                    scaledSize:
                      typeof window !== "undefined"
                        ? new window.google.maps.Size(40, 40)
                        : undefined,
                  }}
                />
              );
            })}
            {selectedReport && (
              <InfoWindow
                position={{
                  lat: Number(selectedReport.latitude),
                  lng: Number(selectedReport.longitude),
                }}
                onCloseClick={() => setSelectedReport(null)}
              >
                <div className="p-2 max-w-xs">
                  <p>
                    <strong>🕒 Date:</strong>
                    <br /> {new Date(selectedReport.dateTime).toLocaleString()}
                  </p>
                  {selectedReport.comment && (
                    <p className="mt-2">
                      <strong>📝 Comment:</strong>
                      <br /> {selectedReport.comment}
                    </p>
                  )}
                  {selectedReport.image && (
                    <div className="mt-2">
                      <strong>🖼️ Image:</strong>
                      <br />
                      <img
                        src={selectedReport.image || selectedReport.image_url}
                        alt="Report"
                        className="mt-1 max-w-full h-auto max-h-40 rounded-lg object-contain bg-gray-50"
                        onError={e => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}
                  <p className="mt-2">
                    <strong>📍 Location:</strong>
                    <br /> Lat: {selectedReport.latitude}, Lng: {selectedReport.longitude}
                  </p>
                  {selectedReport.deviceInfo && (
                    <p className="mt-2 text-xs text-gray-500">
                      <strong>Device:</strong> {JSON.stringify(selectedReport.deviceInfo)}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </section>
    </>
  );
} 