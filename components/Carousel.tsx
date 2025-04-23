// components/Carousel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CarouselImage = {
  src: string;
  alt: string;
  link: string;
};

const sampleImages: CarouselImage[] = [
  { src: "/images/slide1.jpg", alt: "Görsel 1", link: "/" },
  { src: "/images/slide2.jpg", alt: "Görsel 2", link: "/projects" },
  { src: "/images/slide3.jpg", alt: "Görsel 3", link: "/about" },
];

export default function Carousel({ images = sampleImages }: { images?: CarouselImage[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="w-full max-w-4xl aspect-video mx-auto overflow-hidden rounded-2xl relative">
      {/* SABİT YAZI */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
  {/* ÜST BAŞLIK */}
  <h2 className="text-white text-3xl sm:text-3xl font-extrabold drop-shadow-lg transition-all duration-500">


  Small Spark. It may be a sign of a big fire.
  </h2>

  {/* ALT YAZI */}
  <Link
    href="/report"
    className="mt-4 text-white text-sm sm:text-base bg-orange-500 bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-full shadow-lg transition duration-300"
  >
    Report
  </Link>
</div>

      {/* GÖRSELLER */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Link href={image.link}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-2xl"
              priority={index === 0}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
