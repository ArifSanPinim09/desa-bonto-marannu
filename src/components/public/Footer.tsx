'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const [desaLogoError, setDesaLogoError] = useState(false);
  const [kknLogoError, setKknLogoError] = useState(false);

  return (
    <footer className="bg-green-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo Desa & Deskripsi */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white p-2 shadow-lg flex items-center justify-center flex-shrink-0">
                {!desaLogoError ? (
                  <Image
                    src="/logo-desa.png"
                    alt="Logo Desa"
                    width={48}
                    height={48}
                    className="object-contain"
                    onError={() => setDesaLogoError(true)}
                  />
                ) : (
                  <span className="text-3xl">🏛️</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Desa Bonto Marannu</h3>
                <p className="text-green-200 text-sm">Website Resmi</p>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Portal informasi resmi Desa Bonto Marannu. Menyajikan informasi terkini tentang profil desa, 
              berita, dan layanan kepada masyarakat.
            </p>
          </div>

          {/* Link Cepat */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-green-800 pb-2">Link Cepat</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Beranda' },
                { href: '#profil', label: 'Profil Desa' },
                { href: '#struktur', label: 'Struktur Organisasi' },
                { href: '#demografi', label: 'Demografi' },
                { href: '#destinasi', label: 'Destinasi Wisata' },
                { href: '/berita', label: 'Berita' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/90 text-sm hover:text-green-200 hover:translate-x-1 inline-flex items-center transition-all duration-300"
                  >
                    <span className="mr-2">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo KKN */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-green-800 pb-2">Dibuat Oleh</h3>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white p-1.5 shadow-lg flex items-center justify-center flex-shrink-0">
                  {!kknLogoError ? (
                    <Image
                      src="/logo-kkn.png"
                      alt="Logo KKN"
                      width={40}
                      height={40}
                      className="object-contain"
                      onError={() => setKknLogoError(true)}
                    />
                  ) : (
                    <span className="text-2xl">🎓</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white leading-tight mb-1">
                    KKNT - 115 Universitas Hasanuddin
                  </p>
                  <p className="text-green-200 text-xs leading-tight">
                    Program Pengabdian Masyarakat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-white text-sm text-center md:text-left">
              © 2025 Desa Bonto Marannu. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-white hover:text-green-200 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-white hover:text-green-200 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
