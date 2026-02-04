import type { Metadata } from 'next'
import { createClient } from '@/src/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/src/components/shared/Card'
import Button from '@/src/components/shared/Button'
import { formatDate } from '@/src/lib/utils/format'
import type { News } from '@/src/types/news'

export const metadata: Metadata = {
  title: "Berita Desa Bonto Marannu",
  description: "Informasi terkini seputar kegiatan dan pengumuman Desa Bonto Marannu, Kec. Uluere, Kab. Bantaeng. Baca berita dan artikel terbaru dari pemerintah desa tentang agrowisata, kearifan lokal, dan pembangunan desa.",
  openGraph: {
    title: "Berita Desa - Desa Bonto Marannu",
    description: "Informasi terkini seputar kegiatan dan pengumuman Desa Bonto Marannu. Berita agrowisata, kearifan lokal, dan pembangunan desa.",
    type: "website",
  },
};

const ITEMS_PER_PAGE = 9

// Enable ISR with 60 second revalidation
export const revalidate = 60

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>
}

async function getPublishedNews(page: number = 1): Promise<{ news: News[], total: number }> {
  const supabase = await createClient()
  
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Get total count
  const { count } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Get paginated news
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error || !data) {
    return { news: [], total: 0 }
  }

  return { news: data as News[], total: count || 0 }
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const { news, total } = await getPublishedNews(currentPage)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Berita Desa
          </h1>
          <p className="text-lg text-gray-600">
            Informasi terkini seputar kegiatan dan pengumuman desa
          </p>
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Belum ada berita yang dipublikasikan.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface NewsCardProps {
  article: News
}

function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/berita/${article.slug}`}>
      <Card
        variant="elevated"
        className="cursor-pointer group overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full"
      >
        {/* Thumbnail */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
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
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {article.category}
          </div>
        </div>

        {/* Content */}
        <CardContent className="space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.published_at || article.created_at}>
              {formatDate(article.published_at || article.created_at)}
            </time>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3">
            {article.excerpt}
          </p>

          {/* Read More Link */}
          <div className="pt-2">
            <span className="text-green-600 font-medium text-sm group-hover:text-green-700 inline-flex items-center gap-1">
              Baca Selengkapnya
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-center items-center gap-2">
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? `/berita?page=${currentPage - 1}` : '#'}
        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <Link href="/berita?page=1">
            <Button variant="outline" size="sm">
              1
            </Button>
          </Link>
          {startPage > 2 && (
            <span className="text-gray-500 px-2">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Link key={page} href={`/berita?page=${page}`}>
          <Button
            variant={page === currentPage ? 'primary' : 'outline'}
            size="sm"
          >
            {page}
          </Button>
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-500 px-2">...</span>
          )}
          <Link href={`/berita?page=${totalPages}`}>
            <Button variant="outline" size="sm">
              {totalPages}
            </Button>
          </Link>
        </>
      )}

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? `/berita?page=${currentPage + 1}` : '#'}
        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
