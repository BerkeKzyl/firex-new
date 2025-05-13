"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

type Report = {
  _id: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  comment?: string;
};

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
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/report");
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentReports(
            data.map((r: any) => ({
              ...r,
              dateTime: r.timestamp || r.dateTime,
            }))
          );
        } else {
          setRecentReports([]);
        }
      } catch (err) {
        setRecentReports([]);
        console.error("❌ Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
            <Marker
              position={istanbulCenter}
              title="Example Device Location"
              icon={{
                url: "/custom-icons/mapIcon.png",
                scaledSize:
                  typeof window !== "undefined"
                    ? new window.google.maps.Size(40, 40)
                    : undefined,
              }}
            />
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
            {recentReports.length === 0 && (
              <div className="p-4 text-center text-gray-500">No reports found.</div>
            )}
            {recentReports.map((report) => (
              <Marker
                key={report._id}
                position={{ lat: report.latitude, lng: report.longitude }}
                onClick={() => setSelectedReport(report)}
                icon={{
                  url: "/custom-icons/Fire-icon.png",
                  scaledSize:
                    typeof window !== "undefined"
                      ? new window.google.maps.Size(40, 40)
                      : undefined,
                }}
              />
            ))}
            {selectedReport && (
              <InfoWindow
                position={{
                  lat: selectedReport.latitude,
                  lng: selectedReport.longitude,
                }}
                onCloseClick={() => setSelectedReport(null)}
              >
                <div className="p-2">
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
                  <p className="mt-2">
                    <strong>📍 Location:</strong>
                    <br /> Lat: {selectedReport.latitude}, Lng: {selectedReport.longitude}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </section>
    </>
  );
} 