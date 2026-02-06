import type { Metadata } from 'next'
import { createClient } from '@/src/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft, Clock } from 'lucide-react'
import Button from '@/src/components/shared/Button'
import { Card, CardContent } from '@/src/components/shared/Card'
import { formatDate, formatRelativeDate } from '@/src/lib/utils/format'
import type { News } from '@/src/types/news'

// Clean Quill content by replacing &nbsp; with regular spaces
function cleanQuillContent(html: string): string {
  return html.replace(/&nbsp;/g, ' ')
}

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  return data as News
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug)

  if (!article) {
    return {
      title: "Berita Tidak Ditemukan",
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_at || article.created_at,
      authors: ["Pemerintah Desa Bonto Marannu"],
      images: [
        {
          url: article.thumbnail_url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail_url],
    },
  }
}

async function getRelatedNews(currentId: string, category: string, limit: number = 3): Promise<News[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data as News[]
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedNews = await getRelatedNews(article.id, article.category)

  // Structured data for news article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail_url,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Pemerintah Desa Bonto Marannu',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Desa Bonto Marannu',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://desa-bonto-marannu.vercel.app'}/logo-desa.png`,
      },
    },
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link href="/berita" className="inline-block mb-6">
          <Button variant="outline" size="sm" className="group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Berita
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 sm:h-96 w-full bg-gray-100">
                <Image
                  src={article.thumbnail_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  quality={85}
                  priority
                />
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-8 lg:p-10">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Tag className="h-3.5 w-3.5" />
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.published_at || article.created_at}>
                      {formatDate(article.published_at || article.created_at, 'dd MMMM yyyy')}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatRelativeDate(article.published_at || article.created_at)}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div
                  className="quill-content prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700 prose-strong:text-gray-900 prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: cleanQuillContent(article.content) }}
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <Card>
                  <CardContent className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Berita Terkait
                    </h3>
                    <div className="space-y-4">
                      {relatedNews.map((news) => (
                        <RelatedNewsCard key={news.id} article={news} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call to Action */}
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-bold">
                    Ingin Tahu Lebih Banyak?
                  </h3>
                  <p className="text-green-50">
                    Jelajahi informasi lengkap tentang desa kami
                  </p>
                  <Link href="/">
                    <Button variant="secondary" className="w-full">
                      Kembali ke Beranda
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

interface RelatedNewsCardProps {
  article: News
}

function RelatedNewsCard({ article }: RelatedNewsCardProps) {
  return (
    <Link href={`/berita/${article.slug}`}>
      <div className="group cursor-pointer">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="80px"
              loading="lazy"
              quality={70}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-1">
              {article.title}
            </h4>
            <p className="text-xs text-gray-500">
              {formatDate(article.published_at || article.created_at, 'dd MMM yyyy')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
