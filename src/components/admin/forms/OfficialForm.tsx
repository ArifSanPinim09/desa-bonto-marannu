'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/src/lib/supabase/client'
import { Official } from '@/src/types/official'
import { officialSchema, OfficialFormData } from '@/src/lib/utils/validation-schemas'
import Button from '@/src/components/shared/Button'
import Input from '@/src/components/shared/Input'
import ImageUpload from '@/src/components/shared/ImageUpload'
import { toast } from 'sonner'

interface OfficialFormProps {
  official?: Official | null
  onSuccess: () => void
  onCancel: () => void
}

export default function OfficialForm({ official, onSuccess, onCancel }: OfficialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OfficialFormData>({
    resolver: zodResolver(officialSchema),
    defaultValues: {
      name: official?.name || '',
      position: official?.position || '',
      nip: official?.nip || '',
      photo_url: official?.photo_url || '',
      start_period: official?.start_period || '',
      end_period: official?.end_period || '',
      display_order: official?.display_order || 0,
    },
  })

  const photoUrl = watch('photo_url')

  function handleImageUpload(urls: string[]) {
    if (urls.length > 0) {
      setValue('photo_url', urls[0])
      toast.success('Photo uploaded successfully')
    }
  }

  function handleImageRemove() {
    setValue('photo_url', '')
  }

  const onSubmit = async (data: OfficialFormData) => {
    try {
      setIsSubmitting(true)

      const dataToSave = {
        name: data.name.trim(),
        position: data.position.trim(),
        nip: data.nip?.trim() || null,
        photo_url: data.photo_url || null,
        start_period: data.start_period || null,
        end_period: data.end_period || null,
        display_order: data.display_order,
        updated_at: new Date().toISOString(),
      }

      if (official) {
        // Update existing official
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('organization_structure')
          // @ts-ignore
          .update(dataToSave)
          .eq('id', official.id)

        if (error) throw error
        toast.success('Official updated successfully')
      } else {
        // Create new official
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('organization_structure')
          // @ts-ignore
          .insert([dataToSave])

        if (error) throw error
        toast.success('Official added successfully')
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving official:', error)
      toast.error('Failed to save official')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        label="Full Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter official's full name"
        required
        maxLength={100}
      />

      {/* Position */}
      <Input
        label="Position"
        {...register('position')}
        error={errors.position?.message}
        placeholder="e.g., Village Head, Secretary"
        required
        maxLength={100}
      />

      {/* NIP */}
      <Input
        label="NIP (Employee ID)"
        {...register('nip')}
        error={errors.nip?.message}
        placeholder="18-digit employee ID (optional)"
        helperText="Optional: Must be exactly 18 digits if provided"
        maxLength={18}
      />

      {/* Start Period */}
      <Input
        label="Start Period"
        type="date"
        {...register('start_period')}
        helperText="Optional: When the official started this position"
      />

      {/* End Period */}
      <Input
        label="End Period"
        type="date"
        {...register('end_period')}
        helperText="Optional: When the official ended/will end this position"
      />

      {/* Display Order */}
      <Input
        label="Display Order"
        type="number"
        {...register('display_order', { valueAsNumber: true })}
        error={errors.display_order?.message}
        helperText="Lower numbers appear first in the hierarchy"
        min={0}
      />

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Official Photo
        </label>
        <ImageUpload
          bucket="official-photos"
          maxSizeMB={2}
          onUploadComplete={handleImageUpload}
          existingImages={photoUrl ? [photoUrl] : []}
          onRemoveExisting={handleImageRemove}
        />
        <p className="mt-1.5 text-sm text-gray-500">
          Optional: Upload a professional photo of the official
        </p>
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
          {official ? 'Update' : 'Add'} Official
        </Button>
      </div>
    </form>
  )
}
