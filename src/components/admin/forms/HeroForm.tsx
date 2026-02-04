'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/src/lib/supabase/client'
import { HeroSection } from '@/src/types/hero'
import { heroSchema, HeroFormData } from '@/src/lib/utils/validation-schemas'
import Button from '@/src/components/shared/Button'
import Input from '@/src/components/shared/Input'
import ImageUpload from '@/src/components/shared/ImageUpload'
import { toast } from 'sonner'

interface HeroFormProps {
  hero?: HeroSection | null
  onSuccess: () => void
  onCancel: () => void
}

export default function HeroForm({ hero, onSuccess, onCancel }: HeroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: hero?.title || '',
      subtitle: hero?.subtitle || '',
      cta_text: hero?.cta_text || '',
      cta_link: hero?.cta_link || '',
      image_url: hero?.image_url || '',
      is_active: hero?.is_active || false,
      display_order: hero?.display_order || 0,
    },
  })

  const imageUrl = watch('image_url')

  function handleImageUpload(urls: string[]) {
    if (urls.length > 0) {
      setValue('image_url', urls[0])
      toast.success('Image uploaded successfully')
    }
  }

  function handleImageRemove() {
    setValue('image_url', '')
  }

  const onSubmit = async (data: HeroFormData) => {
    try {
      setIsSubmitting(true)

      const dataToSave = {
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || null,
        cta_text: data.cta_text.trim(),
        cta_link: data.cta_link.trim(),
        image_url: data.image_url,
        is_active: data.is_active,
        display_order: data.display_order,
        updated_at: new Date().toISOString(),
      }

      if (hero) {
        // Update existing hero
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('hero_sections')
          // @ts-ignore
          .update(dataToSave)
          .eq('id', hero.id)

        if (error) throw error
        toast.success('Hero section updated successfully')
      } else {
        // Create new hero
        // @ts-ignore - Supabase type inference issue
        const { error} = await supabase
          .from('hero_sections')
          // @ts-ignore
          .insert([dataToSave])

        if (error) throw error
        toast.success('Hero section created successfully')
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving hero:', error)
      toast.error('Failed to save hero section')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter hero title"
        required
        maxLength={200}
      />

      {/* Subtitle */}
      <Input
        label="Subtitle"
        {...register('subtitle')}
        placeholder="Enter hero subtitle (optional)"
      />

      {/* CTA Text */}
      <Input
        label="CTA Button Text"
        {...register('cta_text')}
        error={errors.cta_text?.message}
        placeholder="e.g., Learn More"
        required
        maxLength={50}
      />

      {/* CTA Link */}
      <Input
        label="CTA Button Link"
        {...register('cta_link')}
        error={errors.cta_link?.message}
        placeholder="e.g., /about or https://example.com"
        required
      />

      {/* Display Order */}
      <Input
        label="Display Order"
        type="number"
        {...register('display_order', { valueAsNumber: true })}
        error={errors.display_order?.message}
        helperText="Lower numbers appear first"
        min={0}
      />

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-700"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Active (visible on homepage)
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Image <span className="text-red-600">*</span>
        </label>
        <ImageUpload
          bucket="hero-images"
          maxSizeMB={5}
          onUploadComplete={handleImageUpload}
          existingImages={imageUrl ? [imageUrl] : []}
          onRemoveExisting={handleImageRemove}
        />
        {errors.image_url && (
          <p className="mt-1.5 text-sm text-red-600">{errors.image_url.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {hero ? 'Update' : 'Create'} Hero Section
        </Button>
      </div>
    </form>
  )
}
