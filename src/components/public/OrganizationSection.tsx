'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/src/components/shared/Card'
import { cn } from '@/src/lib/utils/cn'
import { User } from 'lucide-react'
import type { Official } from '@/src/types/official'

interface OrganizationSectionProps {
  officials: Official[]
}

export default function OrganizationSection({ officials }: OrganizationSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
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

  if (officials.length === 0) {
    return null
  }

  return (
    <section 
      ref={sectionRef}
      id="struktur" 
      className={`py-20 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Struktur Organisasi
          </h2>
          <div className="w-24 h-1.5 bg-green-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Perangkat desa yang melayani dan mengabdi untuk masyarakat
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {officials.map((official, index) => (
            <Card
              key={official.id}
              className={cn(
                'transition-all duration-300 cursor-pointer border-0 shadow-lg hover:shadow-xl group',
                hoveredId === official.id && 'shadow-xl scale-105',
                'animate-fadeInUp'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredId(official.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-green-700" />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center leading-tight min-h-[3.5rem] flex items-center justify-center">
                  {official.name}
                </h3>

                {/* Position */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-4 py-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 text-center leading-relaxed">
                    {official.position}
                  </p>
                </div>

                {/* Additional Details */}
                {(official.nip || official.start_period) && (
                  <div
                    className={cn(
                      'transition-all duration-300 overflow-hidden border-t border-gray-100',
                      hoveredId === official.id
                        ? 'max-h-32 opacity-100 pt-3'
                        : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="space-y-2">
                      {official.nip && (
                        <div className="text-xs bg-gray-50 rounded px-3 py-2">
                          <span className="text-gray-600 font-medium">NIP:</span>
                          <span className="text-gray-900 ml-2 block mt-1 font-semibold">{official.nip}</span>
                        </div>
                      )}
                      {official.start_period && (
                        <div className="text-xs bg-gray-50 rounded px-3 py-2">
                          <span className="text-gray-600 font-medium">Periode:</span>
                          <span className="text-gray-900 ml-2 block mt-1 font-semibold">
                            {new Date(official.start_period).getFullYear()}
                            {official.end_period && 
                              ` - ${new Date(official.end_period).getFullYear()}`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
