import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Desa Bonto Marannu - Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025',
    short_name: 'Bonto Marannu',
    description: 'Website resmi Desa Bonto Marannu. Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang, Kec. Uluere, Kab. Bantaeng.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#047857',
    icons: [
      {
        src: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/logo-desa.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
