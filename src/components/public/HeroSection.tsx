'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/src/lib/utils/cn'
import Button from '@/src/components/shared/Button'
import { Award, Leaf } from 'lucide-react'
import type { HeroSection as HeroSectionType } from '@/src/types/hero'

interface HeroSectionProps {
  hero: HeroSectionType
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[80vh] lg:min-h-[92vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={hero.image_url}
          alt={hero.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 min-h-[92vh] lg:min-h-[80vh] flex items-center">

        <div className="max-w-3xl py-20 lg:py-32">
          {/* Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-full mb-8 border border-green-200 transition-all duration-1000 ease-out',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">
              Desa Mandiri Terbaik Peringkat I se-Sulawesi Selatan 2025
            </span>
          </div>

          {/* Main Heading */}
          <div
            className={cn(
              'transition-all duration-1000 ease-out delay-100',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
              Selamat Datang di
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-green-900 mb-6 leading-tight">
              Desa {hero.title}
            </h1>
          </div>

          {/* Subtitle */}
          {hero.subtitle && (
            <p
              className={cn(
                'text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl transition-all duration-1000 ease-out delay-200',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {hero.subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div
            className={cn(
              'flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out delay-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <Link href="#profil">
              <Button
                size="lg"
                className="bg-green-900 text-white hover:bg-green-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-6 text-base w-full sm:w-auto"
              >
                <Leaf className="w-5 h-5 mr-2" />
                {hero.cta_text}
              </Button>
            </Link>
            <Link href="#destinasi">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-lg font-semibold px-8 py-6 text-base w-full sm:w-auto"
              >
                Jelajahi Destinasi →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-900/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-900/30 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}
