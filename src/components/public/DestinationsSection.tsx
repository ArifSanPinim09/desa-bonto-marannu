'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { MapPin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/src/components/shared/Card'
import type { TouristDestination } from '@/src/types/destination'

// Dynamically import Modal to reduce initial bundle size
const Modal = dynamic(() => import('@/src/components/shared/Modal'), {
  ssr: false,
})

interface DestinationsSectionProps {
  destinations: TouristDestination[]
}

export default function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const [selectedDestination, setSelectedDestination] = useState<TouristDestination | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleCardClick = (destination: TouristDestination) => {
    setSelectedDestination(destination)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedDestination(null), 200)
  }

  if (destinations.length === 0) {
    return null
  }

  return (
    <>
      <section 
        ref={sectionRef}
        id="destinasi" 
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Destinasi Desa
            </h2>
            <div className="w-24 h-1.5 bg-green-900 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Jelajahi keindahan dan pesona destinasi di desa kami
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onClick={() => handleCardClick(destination)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedDestination.name}
          size="xl"
        >
          <DestinationDetail destination={selectedDestination} />
        </Modal>
      )}
    </>
  )
}

interface DestinationCardProps {
  destination: TouristDestination
  onClick: () => void
}

function DestinationCard({ destination, onClick }: DestinationCardProps) {
  const mainImage = destination.images && destination.images.length > 0
    ? destination.images[0].image_url
    : '/placeholder-destination.jpg'

  const shortDescription = destination.description.length > 120
    ? destination.description.substring(0, 120) + '...'
    : destination.description

  return (
    <Card
      className="cursor-pointer group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={mainImage}
          alt={destination.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          quality={75}
        />
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-green-900 text-white px-3 py-1 rounded-full text-xs font-medium">
          {destination.category}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {destination.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {shortDescription}
        </p>

        {/* Location */}
        <div className="flex items-start gap-2 text-gray-700 mb-3">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-900" />
          <span className="text-sm line-clamp-1">{destination.location}</span>
        </div>

        {/* Google Maps Link */}
        {destination.maps_url && (
          <div className="pt-3 border-t border-gray-100">
            <a
              href={destination.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-900 font-medium text-sm hover:text-green-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
              Lihat di Google Maps
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DestinationDetailProps {
  destination: TouristDestination
}

function DestinationDetail({ destination }: DestinationDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = destination.images && destination.images.length > 0
    ? destination.images.sort((a, b) => a.display_order - b.display_order)
    : []

  const currentImage = images.length > 0
    ? images[currentImageIndex].image_url
    : '/placeholder-destination.jpg'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Image Gallery */}
      <div className="space-y-3 sm:space-y-4">
        {/* Main Image */}
        <div className="relative h-48 sm:h-64 lg:h-80 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={currentImage}
            alt={`${destination.name} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            quality={80}
            priority
          />
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-16 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? 'border-green-900 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-green-700'
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4">
        {/* Category */}
        <div className="pb-4 border-b border-gray-200">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {destination.category}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-900" />
          <div>
            <p className="font-medium text-gray-900">Lokasi</p>
            <p>{destination.location}</p>
          </div>
        </div>

        {/* Google Maps Link */}
        {destination.maps_url && (
          <div>
            <a
              href={destination.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              <ExternalLink className="h-5 w-5" />
              Buka di Google Maps
            </a>
          </div>
        )}

        {/* UMKM Section - Moved before Description */}
        {destination.umkm && destination.umkm.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border-2 border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏪</span>
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Sentra UMKM</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Kunjungi usaha lokal di sekitar destinasi ini:
            </p>
            <div className="space-y-2">
              {destination.umkm
                .sort((a, b) => a.display_order - b.display_order)
                .map((umkm, index) => (
                  <div
                    key={umkm.id}
                    className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="font-medium text-gray-900 break-words">{umkm.name}</p>
                    </div>
                    {umkm.maps_url && (
                      <a
                        href={umkm.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-green-700 text-white rounded-md hover:bg-green-800 text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Lokasi
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
            {destination.description}
          </p>
        </div>

        {/* Facilities */}
        {destination.facilities && destination.facilities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Fasilitas</h4>
            <div className="flex flex-wrap gap-2">
              {destination.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
