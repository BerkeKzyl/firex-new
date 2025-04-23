'use client';

import Image from 'next/image';

const infos = [
  {
    title: "Fire Detection",
    description: "Our sensors can detect smoke and abnormal heat changes in real-time.",
    image: "/images/firefighter.png",
  },
  {
    title: "Device Tracking",
    description: "Each device is tracked with GPS and sends continuous data to the server.",
    image: "/images/devicebot.png",
  },
  {
    title: "Report System",
    description: "Users can report fires with image, location, and comment easily.",
    image: "/images/system.png",
  },
];

export default function InfoPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-orange-50 to-orange-100 text-gray-900">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-12 drop-shadow-sm">
        🔎 Informations
      </h1>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {infos.map((info, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 border border-orange-100"
          >
            <div className="relative w-full h-52">
              <Image
                src={info.image}
                alt={info.title}
                fill
                objectFit="contain" // ✅ tam görseli gösterir
                className="bg-white" // istersen arka plan boşluklar beyaz kalsın
              />
            </div>
            <div className="p-6 flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-orange-600">{info.title}</h2>
              <p className="text-sm text-gray-700">{info.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
