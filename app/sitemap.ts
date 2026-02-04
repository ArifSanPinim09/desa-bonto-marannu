import { MetadataRoute } from 'next'
import { createClient } from '@/src/lib/supabase/server'

type NewsArticle = {
  slug: string
  updated_at: string
  published_at: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ||
      'https://desa-bonto-marannu.vercel.app').replace(/\/$/, '')

  const supabase = await createClient()

  const { data: news, error } = await supabase
    .from('news')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Supabase sitemap error:', error)
  }

  const newsUrls = (news as NewsArticle[] | null)?.map((article) => ({
    url: `${baseUrl}/berita/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...newsUrls,
  ]
}
