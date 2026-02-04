'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/shared/Card'
import type { VillageProfile } from '@/src/types/profile'

interface ProfileSectionProps {
  profile: VillageProfile
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
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

  // Replace &nbsp; with regular spaces for better text wrapping
  const cleanHistory = profile.history.replace(/&nbsp;/g, ' ')

  return (
    <section 
      ref={sectionRef}
      id="profil" 
      className={`py-20 bg-gradient-to-b from-white to-gray-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Profil Desa
          </h2>
          <div className="w-24 h-1.5 bg-green-900 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Mengenal lebih dekat identitas dan sejarah desa kami
          </p>
        </div>

        {/* Village History */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow mb-12">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-2xl text-gray-900">Sejarah Desa</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 sm:px-8 lg:px-12">
            <div
              className="prose prose-base sm:prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-8 first:prose-headings:mt-0
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-green-900 prose-a:underline hover:prose-a:text-green-700
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:my-6 prose-ul:text-gray-700
                prose-ol:my-6 prose-ol:text-gray-700
                prose-li:text-gray-700 prose-li:my-2 prose-li:leading-relaxed
                [&_*]:max-w-full
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6
                [&_.ql-align-center]:text-center
                [&_.ql-align-right]:text-right
                [&_.ql-align-left]:text-left
                [&_.ql-align-justify]:text-justify
                [&_.ql-size-small]:text-sm
                [&_.ql-size-large]:text-xl [&_.ql-size-large]:font-semibold
                [&_.ql-size-huge]:text-3xl [&_.ql-size-huge]:font-bold"
              dangerouslySetInnerHTML={{ __html: cleanHistory }}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
          {/* Village Identity Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <CardTitle className="text-2xl text-gray-900">Identitas Desa</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div className="group">
                  <p className="text-sm font-medium text-gray-500 mb-2">Nama Desa</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{profile.village_name}</p>
                </div>
                <div className="group">
                  <p className="text-sm font-medium text-gray-500 mb-2">Kecamatan</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{profile.sub_district}</p>
                </div>
                <div className="group">
                  <p className="text-sm font-medium text-gray-500 mb-2">Kabupaten</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{profile.district}</p>
                </div>
                <div className="group">
                  <p className="text-sm font-medium text-gray-500 mb-2">Provinsi</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{profile.province}</p>
                </div>
                <div className="group">
                  <p className="text-sm font-medium text-gray-500 mb-2">Kode Pos</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{profile.postal_code}</p>
                </div>
                <div className="group">
                  <p className="text-sm font-medium text-gray-500 mb-2">Luas Wilayah</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{profile.area_size} km²</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
