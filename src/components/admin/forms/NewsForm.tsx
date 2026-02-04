'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Save, Eye, Loader2 } from 'lucide-react'
import Button from '@/src/components/shared/Button'
import Input from '@/src/components/shared/Input'
import RichTextEditor from '@/src/components/shared/RichTextEditor'
import ImageUpload from '@/src/components/shared/ImageUpload'
import { createClient } from '@/src/lib/supabase/client'
import { newsSchema, NewsFormData } from '@/src/lib/utils/validation-schemas'
import type { Database } from '@/src/types/database'
import type { News } from '@/src/types/news'

interface NewsFormProps {
  news?: News
  mode: 'create' | 'edit'
}

export default function NewsForm({ news, mode }: NewsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(news?.thumbnail_url || '')
  const [content, setContent] = useState<string>(news?.content || '')
  const [showPreview, setShowPreview] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: news?.title || '',
      content: news?.content || '',
      category: news?.category || '',
      status: news?.status || 'draft',
      thumbnail_url: news?.thumbnail_url || '',
    },
  })

  const watchedTitle = watch('title')
  const watchedStatus = watch('status')

  // Update form value when content changes
  useEffect(() => {
    setValue('content', content)
  }, [content, setValue])

  // Update form value when thumbnail changes
  useEffect(() => {
    setValue('thumbnail_url', thumbnailUrl)
  }, [thumbnailUrl, setValue])

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
  }

  // Generate excerpt from content
  const generateExcerpt = (htmlContent: string): string => {
    // Strip HTML tags
    const text = htmlContent.replace(/<[^>]*>/g, '')
    // Get first 200 characters
    const excerpt = text.substring(0, 200).trim()
    // Add ellipsis if truncated
    return excerpt.length < text.length ? `${excerpt}...` : excerpt
  }

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        toast.error('You must be logged in to create/edit news')
        return
      }

      // Generate slug and excerpt
      const slug = generateSlug(data.title)
      const excerpt = generateExcerpt(data.content)

      if (mode === 'create') {
        const insertData: Database['public']['Tables']['news']['Insert'] = {
          title: data.title,
          slug,
          content: data.content,
          excerpt,
          thumbnail_url: data.thumbnail_url,
          category: data.category,
          status: data.status,
          author_id: user.id,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
        }

        const { error } = await supabase
          .from('news')
          // @ts-ignore - Supabase type inference issue
          .insert(insertData)

        if (error) throw error

        toast.success('News article created successfully')
      } else {
        const updateData: Database['public']['Tables']['news']['Update'] = {
          title: data.title,
          slug,
          content: data.content,
          excerpt,
          thumbnail_url: data.thumbnail_url,
          category: data.category,
          status: data.status,
          author_id: user.id,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
          .from('news')
          // @ts-ignore - Supabase type inference issue
          .update(updateData)
          .eq('id', news!.id)

        if (error) throw error

        toast.success('News article updated successfully')
      }

      router.push('/admin/berita')
      router.refresh()
    } catch (error) {
      console.error('Error saving news:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save news article')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThumbnailUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setThumbnailUrl(urls[0])
      toast.success('Thumbnail uploaded successfully')
    }
  }

  const handleThumbnailError = (error: Error) => {
    toast.error(`Upload failed: ${error.message}`)
  }

  const handleRemoveThumbnail = () => {
    setThumbnailUrl('')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter article title"
          error={errors.title?.message}
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <Input
          id="category"
          {...register('category')}
          placeholder="e.g., Pengumuman, Kegiatan, Pembangunan"
          error={errors.category?.message}
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image <span className="text-red-500">*</span>
        </label>
        <ImageUpload
          bucket="news-images"
          folder="thumbnails"
          multiple={false}
          maxSizeMB={2}
          accept="image/jpeg,image/png,image/webp"
          onUploadComplete={handleThumbnailUpload}
          onUploadError={handleThumbnailError}
          existingImages={thumbnailUrl ? [thumbnailUrl] : []}
          onRemoveExisting={handleRemoveThumbnail}
        />
        {errors.thumbnail_url && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbnail_url.message}</p>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write your article content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {watchedStatus === 'draft' 
            ? 'Draft articles are not visible to the public' 
            : 'Published articles will be visible on the public website'}
        </p>
      </div>

      {/* Preview Info */}
      {watchedTitle && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 overflow-hidden">
          <h4 className="text-sm font-medium text-gray-700">Auto-generated fields:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="break-words"><span className="font-medium">Slug:</span> {generateSlug(watchedTitle)}</p>
            <p className="break-words"><span className="font-medium">Excerpt:</span> {generateExcerpt(content).substring(0, 100)}...</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Create Article' : 'Update Article'}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/berita')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="mt-6 p-6 bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          
          {thumbnailUrl && (
            <div className="mb-4">
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {watch('category') || 'Category'}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 break-words">
              {watchedTitle || 'Article Title'}
            </h1>

            <div className="text-sm text-gray-500">
              Status: <span className="font-medium">{watchedStatus}</span>
            </div>

            <div
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-green-900 prose-a:underline hover:prose-a:text-green-700
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:my-4 prose-ul:text-gray-700
                prose-ol:my-4 prose-ol:text-gray-700
                prose-li:text-gray-700 prose-li:my-2
                [&_*]:max-w-full
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4
                [&_.ql-align-center]:text-center
                [&_.ql-align-right]:text-right
                [&_.ql-align-left]:text-left
                [&_.ql-align-justify]:text-justify
                [&_.ql-size-small]:text-sm
                [&_.ql-size-large]:text-xl [&_.ql-size-large]:font-semibold
                [&_.ql-size-huge]:text-2xl [&_.ql-size-huge]:font-bold"
              dangerouslySetInnerHTML={{ __html: content ? content.replace(/&nbsp;/g, ' ') : '<p>Article content will appear here...</p>' }}
            />
          </div>
        </div>
      )}
    </form>
  )
}
