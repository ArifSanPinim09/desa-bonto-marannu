'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['profil', 'struktur', 'demografi', 'destinasi', 'berita'];
      const scrollPosition = window.scrollY + 100; // Offset untuk navbar

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }

      // Set beranda jika di atas semua section
      if (scrollPosition < 300) {
        setActiveSection('');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#') && pathname === '/') {
      e.preventDefault();

      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 80;
        const elementPosition =
          element.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth',
        });
      }

      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Beranda', section: '' },
    { href: '#profil', label: 'Profil Desa', section: 'profil' },
    { href: '#struktur', label: 'Struktur Organisasi', section: 'struktur' },
    { href: '#demografi', label: 'Demografi', section: 'demografi' },
    { href: '#destinasi', label: 'Destinasi Wisata', section: 'destinasi' },
    { href: '#berita', label: 'Berita', section: 'berita' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
              {!logoError ? (
                <Image
                  src="/logo-desa.png"
                  alt="Logo Desa"
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-2xl">🏛️</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-gray-900">
                Desa Bonto Marannu
              </span>
              <span className="text-sm text-green-900">
                Kec. Uluere, Kab. Bantaeng
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === link.section
                    ? 'text-white bg-green-900'
                    : 'text-gray-700 hover:text-green-900 hover:bg-green-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  handleSmoothScroll(e, link.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === link.section
                    ? 'text-white bg-green-900'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
