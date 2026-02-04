import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { WebVitals } from "./web-vitals";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://desa-bonto-marannu.vercel.app'),
  title: {
    default: "Desa Bonto Marannu - Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025",
    template: "%s | Desa Bonto Marannu"
  },
  description: "Website resmi Desa Bonto Marannu, Kec. Uluere, Kab. Bantaeng. Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025. Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang dengan Bukit Kebahagiaan sebagai destinasi unggulan.",
  keywords: [
    "Desa Bonto Marannu",
    "Bonto Marannu",
    "Uluere",
    "Bantaeng",
    "Sulawesi Selatan",
    "Desa Mandiri",
    "Bukit Kebahagiaan",
    "Pegunungan Lompobattang",
    "agrowisata Bantaeng",
    "wisata Bantaeng",
    "desa terbaik Sulsel",
    "kearifan lokal",
    "wisata alam Sulawesi Selatan"
  ],
  authors: [{ name: "Pemerintah Desa Bonto Marannu" }],
  creator: "Pemerintah Desa Bonto Marannu",
  publisher: "Pemerintah Desa Bonto Marannu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Desa Bonto Marannu",
    title: "Desa Bonto Marannu - Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025",
    description: "Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang. Mari jelajahi keindahan alam di Bukit Kebahagiaan, Desa Bonto Marannu, Kec. Uluere, Kab. Bantaeng.",
    images: [
      {
        url: "/logo-desa.png",
        width: 1200,
        height: 630,
        alt: "Logo Desa Bonto Marannu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Bonto Marannu - Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025",
    description: "Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang, Bantaeng",
    images: ["/logo-desa.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
 icons: {
    icon: [
      { url: "/logo-desa.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo-desa.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <WebVitals />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
