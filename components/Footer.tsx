import React from "react";
import { FOOTER_ITEMS, SocialMediaData } from "../constants";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 mb-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <footer className="relative py-8 px-6 md:px-8 bg-gray-800/95 backdrop-blur-sm text-white rounded-[3rem] overflow-hidden pb-20 shadow-xl border-t border-orange-100">
        {/* YILDIZ EFEKTLERİ */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-10 z-0"
          style={{
            backgroundImage: "url('/images/footer-bg.png')",
          }}
        />

        {/* Asıl İçerik */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Logo & Açıklama */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl md:text-3xl font-bold text-red-500">FIREX</h1>
              <p className="mt-4 text-sm text-gray-300">
                Smart solutions to detect and prevent forest fires. Join us in protecting nature!
              </p>
            </div>

            {/* Link Grupları */}
            {FOOTER_ITEMS.map((item, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {item.items.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} className="hover:text-red-400 transition">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Sosyal Medya */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-semibold mb-2">Follow Us</h3>
              <div className="flex gap-4">
                {SocialMediaData.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-white hover:text-red-500 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} FIREX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
