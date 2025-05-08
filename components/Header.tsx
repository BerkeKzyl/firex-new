"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-6 md:px-16 mt-8 mb-8">
      <header className="relative bg-gray-800/95 backdrop-blur-sm text-white rounded-[3rem] overflow-hidden shadow-xl border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white text-3xl font-bold tracking-tight">
            <Image
              src="/images/FirexLogo2.png"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
            <span style={{ fontFamily: "var(--font-wallpoet)" }}>
              FireX
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-10 font-bold text-white tracking-widest text-sm sm:text-base">
            <Link href="/" className="hover:text-red-500 transition">Welcome</Link>
            <Link href="/Info" className="hover:text-red-500 transition">Infos</Link>
            <Link href="/map" className="hover:text-red-500 transition">Map</Link>
            <Link href="/about" className="hover:text-red-500 transition">About Us</Link>
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-gray-800/95 text-white font-semibold tracking-widest border-t border-orange-100">
            <Link href="/" onClick={() => setIsOpen(false)}>Welcome</Link>
            <Link href="/Info" onClick={() => setIsOpen(false)}>Infos</Link>
            <Link href="/map" onClick={() => setIsOpen(false)}>Map</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          </div>
        )}
      </header>
    </div>
  );
}
