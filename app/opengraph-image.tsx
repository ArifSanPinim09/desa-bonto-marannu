import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Desa Bonto Marannu - Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
          padding: '40px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 20,
              textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            Desa Bonto Marannu
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: 30,
              fontWeight: '600',
            }}
          >
            Desa Mandiri Terbaik Peringkat I
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 20,
            }}
          >
            se-Sulawesi Selatan 2025
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Pusat Agrowisata & Kearifan Lokal di Lereng Pegunungan Lompobattang
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
