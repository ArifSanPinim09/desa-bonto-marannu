'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/src/components/shared/Card'
import Button from '@/src/components/shared/Button'
import { formatDate } from '@/src/lib/utils/format'
import type { News } from '@/src/types/news'

// Strip HTML tags and decode entities from Quill editor content
function stripHtmlAndDecode(html: string): string {
  // Always use the same method for both server and client to avoid hydration mismatch
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

interface NewsSectionProps {
  news: News[]
}

export default function NewsSection({ news }: NewsSectionProps) {
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

  if (news.length === 0) {
    return null
  }

  return (
    <section 
      ref={sectionRef}
      id="berita" 
      className={`py-20 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Berita Desa
          </h2>
          <div className="w-24 h-1.5 bg-green-900 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan dan pengumuman desa
          </p>
          <div className="mt-6">
            <Link href="/berita">
              <Button variant="outline" className="border-green-900 text-green-900 hover:bg-green-900 hover:text-white">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface NewsCardProps {
  article: News
}

function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/berita/${article.slug}`}>
      <Card className="cursor-pointer group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            quality={75}
          />
          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-green-900 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {article.category}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
            <Calendar className="h-4 w-4 text-green-900" />
            <time dateTime={article.published_at || article.created_at}>
              {formatDate(article.published_at || article.created_at)}
            </time>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 overflow-hidden text-ellipsis">
            {stripHtmlAndDecode(article.excerpt)}
          </p>

          {/* Read More Link */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-green-900 font-medium text-sm inline-flex items-center gap-2">
              Baca Selengkapnya
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
