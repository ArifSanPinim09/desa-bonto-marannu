'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/shared/Card'
import { Users, Mountain, Maximize } from 'lucide-react'
import type { VillageDemographics } from '@/src/types/demographics'

interface DemographicsSectionProps {
  demographics: VillageDemographics
}

export default function DemographicsSection({ demographics }: DemographicsSectionProps) {
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

  const malePercentage = demographics.total_population > 0 
    ? ((demographics.male_population / demographics.total_population) * 100).toFixed(1)
    : '0.0'
  
  const femalePercentage = demographics.total_population > 0
    ? ((demographics.female_population / demographics.total_population) * 100).toFixed(1)
    : '0.0'

  return (
    <section 
      ref={sectionRef}
      id="demografi" 
      className={`py-20 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Demografi & Geografis
          </h2>
          <div className="w-24 h-1.5 bg-green-900 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Informasi statistik penduduk dan kondisi geografis wilayah desa
          </p>
        </div>

        {/* Statistik Penduduk */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Statistik Penduduk
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Penduduk */}
            <Card className="bg-gradient-to-br from-green-800 to-green-900 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="py-6">
                <div className="text-center">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 opacity-90" />
                  <p className="text-xs sm:text-sm font-medium mb-2 opacity-90 uppercase tracking-wide">Total Penduduk</p>
                  <p className="text-3xl sm:text-4xl font-bold mb-1">{demographics.total_population.toLocaleString('id-ID')}</p>
                  <p className="text-xs sm:text-sm opacity-80">Jiwa</p>
                </div>
              </CardContent>
            </Card>

            {/* Laki-laki */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="py-6">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 uppercase tracking-wide font-medium">Laki-laki</p>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                    {demographics.male_population.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold">{malePercentage}%</p>
                </div>
              </CardContent>
            </Card>

            {/* Perempuan */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="py-6">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 uppercase tracking-wide font-medium">Perempuan</p>
                  <p className="text-3xl sm:text-4xl font-bold text-pink-600 mb-1">
                    {demographics.female_population.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold">{femalePercentage}%</p>
                </div>
              </CardContent>
            </Card>

            {/* Kepala Keluarga */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="py-6">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-900" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 uppercase tracking-wide font-medium">Kepala Keluarga</p>
                  <p className="text-3xl sm:text-4xl font-bold text-green-900 mb-1">
                    {demographics.total_families.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold">KK</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kondisi Geografis */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Kondisi Geografis
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Ketinggian */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Mountain className="h-4 w-4 sm:h-5 sm:w-5 text-green-900" />
                  Ketinggian
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {demographics.altitude_mdpl.toLocaleString('id-ID')}+
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Mdpl</p>
              </CardContent>
            </Card>

            {/* Luas Wilayah */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Maximize className="h-4 w-4 sm:h-5 sm:w-5 text-green-900" />
                  Luas Wilayah
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ±{demographics.area_size_km.toLocaleString('id-ID')}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Km²</p>
              </CardContent>
            </Card>

            {/* Topografi */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Mountain className="h-4 w-4 sm:h-5 sm:w-5 text-green-900" />
                  Topografi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                  {demographics.topography}
                </p>
              </CardContent>
            </Card>
          </div>

          {demographics.description && (
            <Card className="mt-6 border-0 shadow-lg">
              <CardContent className="py-5">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">{demographics.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
