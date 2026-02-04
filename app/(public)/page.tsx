import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/src/lib/supabase/server'
import { HeroSection, ProfileSection, OrganizationSection, DestinationsSection, NewsSection } from '@/src/components/public'
import DemographicsSection from '@/src/components/public/DemographicsSection'
import LoadingSpinner from '@/src/components/shared/LoadingSpinner'
import type { Database } from '@/src/types/database'
import type { HeroSection as HeroSectionType } from '@/src/types/hero'
import type { VillageProfile } from '@/src/types/profile'
import type { Official } from '@/src/types/official'
import type { VillageDemographics } from '@/src/types/demographics'
import type { TouristDestination, DestinationImage, DestinationUMKM } from '@/src/types/destination'
import type { News } from '@/src/types/news'

export const metadata: Metadata = {
  title: "Beranda",
  description: "Selamat datang di Desa Bonto Marannu, Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025. Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang. Jelajahi keindahan alam Bukit Kebahagiaan dan temukan informasi lengkap tentang desa kami.",
  openGraph: {
    title: "Beranda - Desa Bonto Marannu",
    description: "Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025. Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang, Kec. Uluere, Kab. Bantaeng.",
    type: "website",
  },
};

async function getActiveHero(): Promise<HeroSectionType | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as HeroSectionType
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getVillageProfile(): Promise<VillageProfile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('village_profile')
    .select('*')
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as VillageProfile
}

async function getOrganizationStructure(): Promise<Official[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('organization_structure')
    .select('*')
    .order('display_order', { ascending: true })

  if (error || !data) {
    return []
  }

  return data as Official[]
}

async function getVillageDemographics(): Promise<VillageDemographics | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('village_demographics')
    .select('*')
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as VillageDemographics
}

async function getTouristDestinations(): Promise<TouristDestination[]> {
  const supabase = await createClient()
  
  // Fetch destinations
  const { data: destinations, error: destError } = await supabase
    .from('tourist_destinations')
    .select('*')
    .order('created_at', { ascending: false })

  if (destError || !destinations) {
    return []
  }

  // Fetch images for all destinations
  const { data: images } = await supabase
    .from('destination_images')
    .select('*')
    .order('display_order', { ascending: true })

  // Fetch UMKM for all destinations (with error handling)
  let umkm: any[] = []
  try {
    const { data: umkmData } = await supabase
      .from('destination_umkm')
      .select('*')
      .order('display_order', { ascending: true })
    
    umkm = umkmData || []
  } catch (error) {
    // Table might not exist yet, silently ignore
    console.log('UMKM table not available yet')
  }

  type DestRow = Database['public']['Tables']['tourist_destinations']['Row']
  type ImageRow = Database['public']['Tables']['destination_images']['Row']

  const imagesList: ImageRow[] = images || []
  const umkmList: any[] = umkm
  const destList: DestRow[] = destinations

  // Map images and UMKM to their destinations
  const destinationsWithDetails: TouristDestination[] = destList.map(dest => {
    const destImages = imagesList.filter(img => img.destination_id === dest.id)
    const destUMKM = umkmList.filter(u => u.destination_id === dest.id)
    return {
      ...dest,
      images: destImages as DestinationImage[],
      umkm: destUMKM as DestinationUMKM[]
    }
  })

  return destinationsWithDetails
}

async function getLatestNews(): Promise<News[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  if (error || !data) {
    return []
  }

  return data as News[]
}

// Loading component for sections
function SectionLoader() {
  return (
    <div className="py-16 flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export default async function HomePage() {
  const hero = await getActiveHero()
  const profile = await getVillageProfile()
  const officials = await getOrganizationStructure()
  const demographics = await getVillageDemographics()
  const destinations = await getTouristDestinations()
  const news = await getLatestNews()

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Desa Bonto Marannu',
    alternateName: 'Bonto Marannu',
    description: 'Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025. Pusat agrowisata dan kearifan lokal di lereng Pegunungan Lompobattang.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bonto Marannu',
      addressRegion: 'Sulawesi Selatan',
      addressCountry: 'ID',
      streetAddress: 'Kec. Uluere, Kab. Bantaeng',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: profile?.village_name ? undefined : -5.5,
      longitude: profile?.village_name ? undefined : 120.0,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kabupaten Bantaeng, Sulawesi Selatan',
    },
    award: 'Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025',
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="scroll-smooth">
        {/* Hero Section */}
        <Suspense fallback={<SectionLoader />}>
          {hero && <HeroSection hero={hero} />}
        </Suspense>

        {/* Profil Desa Section */}
        <Suspense fallback={<SectionLoader />}>
          {profile && <ProfileSection profile={profile} />}
        </Suspense>

        {/* Struktur Organisasi Section */}
        <Suspense fallback={<SectionLoader />}>
          <OrganizationSection officials={officials} />
        </Suspense>

        {/* Demografi & Geografis Section */}
        <Suspense fallback={<SectionLoader />}>
          {demographics && <DemographicsSection demographics={demographics} />}
        </Suspense>

        {/* Destinasi Wisata Section */}
        <Suspense fallback={<SectionLoader />}>
          <DestinationsSection destinations={destinations} />
        </Suspense>

        {/* Berita Section */}
        <Suspense fallback={<SectionLoader />}>
          <NewsSection news={news} />
        </Suspense>
      </div>
    </>
  );
}
