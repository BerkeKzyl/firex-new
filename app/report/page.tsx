'use client';

import { useEffect, useState } from 'react';

export default function ReportPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location.');
      return;
    }

    // Önce eski konumu temizleyelim
    setLocation(null);
    setError(null);
    setLocationAccuracy(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    console.log('🔄 Requesting location with options:', options);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('📍 Raw position data:', pos);
        console.log('📍 Coordinates:', pos.coords);
        console.log('📍 Accuracy:', pos.coords.accuracy, 'meters');
        
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        console.log('📍 New location:', newLocation);
        
        // Eğer önceki konum varsa ve yeni konumla aynıysa uyarı verelim
        if (location && 
            location.lat === newLocation.lat && 
            location.lng === newLocation.lng) {
          console.warn('⚠️ Warning: New location is identical to previous location');
        }

        setLocation(newLocation);
        setLocationAccuracy(pos.coords.accuracy);
        setError(null);
      },
      (err) => {
        console.error('❌ Geolocation error:', err);
        let errorMessage = 'Location access denied or error occurred.';
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        setError(errorMessage);
      },
      options
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!location || !imageBase64 || comment.trim().length === 0) {
      alert('Please complete all fields.');
      return;
    }

    const payload = {
      latitude: location.lat,
      longitude: location.lng,
      image: imageBase64,
      comment: comment.slice(0, 120),
      dateTime: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert('Report submitted successfully! 🚀');
        setComment('');
        setImageBase64(null);
        setLocation(null);
      } else {
        alert('An error occurred.');
        console.error(result.error);
      }
    } catch (err) {
      alert('Failed to connect to the server.');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-orange-50 to-orange-100">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">🔥 Fire Report</h1>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md max-w-xl mx-auto flex flex-col gap-6">
        {/* LOCATION */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-black">📍 Location</h2>
          {location ? (
            <div className="text-green-700">
              <p>
                Latitude: {location.lat.toFixed(6)} — Longitude: {location.lng.toFixed(6)}
              </p>
              {locationAccuracy && (
                <p className="text-sm text-gray-600">
                  Accuracy: ±{locationAccuracy.toFixed(1)} meters
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-700">Location not retrieved yet.</p>
          )}
          {error && <p className="text-red-600 mt-1">{error}</p>}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleLocation}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Get Location
            </button>
            {location && (
              <button
                onClick={handleLocation}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Refresh Location
              </button>
            )}
          </div>
        </div>

        {/* COMMENT */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-black">📝 Comment</h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 120))}
            placeholder="Write a short comment about the fire (max 120 characters)"
            className="w-full h-24 p-3 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none shadow-sm text-sm"
          />
          <p className="text-right text-xs text-gray-500">{comment.length}/120 characters</p>
        </div>

        {/* IMAGE */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-black">📷 Upload Image</h2>
          <label className="inline-block bg-orange-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-600 transition">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Uploaded"
              className="mt-4 w-full h-auto rounded-lg border"
            />
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          🚨 Submit Report
        </button>
      </div>
    </main>
  );
}
