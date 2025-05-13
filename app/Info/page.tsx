'use client';

import { useState } from 'react';
import Image from 'next/image';

const infos = [
  {
    title: "Fire Detection",
    description: "Our sensors can detect smoke and abnormal heat changes in real-time.",
    image: "/images/firefighter.png",
    details: {
      features: [
        "Real-time smoke detection",
        "Temperature monitoring",
        "Early warning system",
        "Automated alerts"
      ],
      benefits: [
        "Prevents large-scale fires",
        "Reduces response time",
        "Minimizes damage",
        "Saves resources"
      ]
    }
  },
  {
    title: "Device Tracking",
    description: "Each device is tracked with GPS and sends continuous data to the server.",
    image: "/images/devicebot.png",
    details: {
      features: [
        "GPS location tracking",
        "Battery monitoring",
        "Signal strength analysis",
        "Device health status"
      ],
      benefits: [
        "Real-time device location",
        "Efficient maintenance",
        "Optimal coverage",
        "Reliable operation"
      ]
    }
  },
  {
    title: "Report System",
    description: "Users can report fires with image, location, and comment easily.",
    image: "/images/system.png",
    details: {
      features: [
        "Image upload capability",
        "Location tagging",
        "Comment system",
        "Status tracking"
      ],
      benefits: [
        "Quick response",
        "Accurate information",
        "Community involvement",
        "Better coordination"
      ]
    }
  },
];

export default function InfoPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-orange-50 to-orange-100 text-gray-900">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-12 drop-shadow-sm">
        Information
      </h1>

      <div className="flex flex-wrap gap-8 justify-center items-start max-w-7xl mx-auto">
        {infos.map((info, index) => (
          <div
            key={index}
            className={`flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 border border-orange-100 transform hover:-translate-y-1 cursor-pointer ${
              expandedCard === index ? 'ring-2 ring-orange-500' : ''
            }`}
            style={{ alignSelf: 'flex-start' }}
            onClick={() => toggleCard(index)}
          >
            <div className="relative w-full h-52">
              <Image
                src={info.image}
                alt={info.title}
                fill
                objectFit="contain"
                className="bg-white p-4"
              />
            </div>
            <div className="p-6 flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-orange-600">{info.title}</h2>
              <p className="text-sm text-gray-700">{info.description}</p>
              {/* Expanded Content */}
              {expandedCard === index && (
                <div className="mt-4 pt-4 border-t border-orange-100 animate-fadeIn">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-500 mb-2">Key Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {info.details.features.map((feature, idx) => (
                          <li key={idx} className="transition-all duration-300 hover:text-orange-500">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-500 mb-2">Benefits</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {info.details.benefits.map((benefit, idx) => (
                          <li key={idx} className="transition-all duration-300 hover:text-orange-500">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
