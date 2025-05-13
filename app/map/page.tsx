'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient.jsx'), { ssr: false });

export default function MapPage() {
  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center gap-12 bg-gradient-to-br from-orange-50 to-orange-100">
      <h1 className="text-3xl font-bold text-orange-600 text-center">
        FireX Maps
      </h1>
      <MapClient />
    </main>
  );
}
