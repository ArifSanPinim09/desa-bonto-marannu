'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/src/lib/supabase/client'
import { VillageProfile } from '@/src/types/profile'
import { profileSchema, ProfileFormData } from '@/src/lib/utils/validation-schemas'
import Button from '@/src/components/shared/Button'
import Input from '@/src/components/shared/Input'
import ImageUpload from '@/src/components/shared/ImageUpload'
import RichTextEditor from '@/src/components/shared/RichTextEditor'
import { toast } from 'sonner'

interface ProfileFormProps {
  profile?: VillageProfile | null
  onSuccess: () => void
}

export default function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      village_name: profile?.village_name || '',
      sub_district: profile?.sub_district || '',
      district: profile?.district || '',
      province: profile?.province || '',
      postal_code: profile?.postal_code || '',
      area_size: profile?.area_size.toString() || '',
      history: profile?.history || '',
      logo_url: profile?.logo_url || '',
    },
  })

  const formValues = watch()
  const logoUrl = watch('logo_url')
  const history = watch('history')

  function handleImageUpload(urls: string[]) {
    if (urls.length > 0) {
      setValue('logo_url', urls[0])
      toast.success('Logo uploaded successfully')
    }
  }

  function handleImageRemove() {
    setValue('logo_url', '')
  }

  function handleHistoryChange(value: string) {
    // Update value without triggering validation on every keystroke
    setValue('history', value, { shouldValidate: false })
  }

  function handleHistoryBlur() {
    // Validate only when user leaves the field
    const currentHistory = watch('history')
    if (currentHistory) {
      setValue('history', currentHistory, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      const dataToSave = {
        village_name: data.village_name.trim(),
        sub_district: data.sub_district.trim(),
        district: data.district.trim(),
        province: data.province.trim(),
        postal_code: data.postal_code.trim(),
        area_size: parseFloat(data.area_size),
        history: data.history.trim(),
        logo_url: data.logo_url || null,
        updated_at: new Date().toISOString(),
      }

      if (profile) {
        // Update existing profile
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('village_profile')
          // @ts-ignore
          .update(dataToSave)
          .eq('id', profile.id)

        if (error) throw error
        toast.success('Village profile updated successfully')
      } else {
        // Create new profile
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('village_profile')
          // @ts-ignore
          .insert([dataToSave])

        if (error) throw error
        toast.success('Village profile created successfully')
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save village profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Preview Toggle */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Edit Mode' : 'Preview Mode'}
        </Button>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Village Profile Preview</h2>
            {logoUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={logoUrl}
                  alt="Village Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Village Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Village Name</p>
                <p className="text-base font-medium text-gray-900 break-words">{formValues.village_name || '-'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Sub-District</p>
                <p className="text-base font-medium text-gray-900 break-words">{formValues.sub_district || '-'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">District</p>
                <p className="text-base font-medium text-gray-900 break-words">{formValues.district || '-'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Province</p>
                <p className="text-base font-medium text-gray-900 break-words">{formValues.province || '-'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Postal Code</p>
                <p className="text-base font-medium text-gray-900 break-words">{formValues.postal_code || '-'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Area Size</p>
                <p className="text-base font-medium text-gray-900 break-words">
                  {formValues.area_size ? `${formValues.area_size} km²` : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Village History</h3>
            <div
              className="prose prose-sm max-w-none 
                prose-headings:text-gray-900 
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-a:text-green-900 prose-a:underline
                [&_*]:max-w-full
                [&_.ql-align-center]:text-center
                [&_.ql-align-right]:text-right
                [&_.ql-align-left]:text-left
                [&_.ql-align-justify]:text-justify
                [&_.ql-size-small]:text-sm
                [&_.ql-size-large]:text-lg [&_.ql-size-large]:font-semibold
                [&_.ql-size-huge]:text-2xl [&_.ql-size-huge]:font-bold"
              dangerouslySetInnerHTML={{ __html: history ? history.replace(/&nbsp;/g, ' ') : '<p>No history provided yet...</p>' }}
            />
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <>
          {/* Village Identity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Village Identity
            </h3>

            <Input
              label="Village Name"
              {...register('village_name')}
              error={errors.village_name?.message}
              placeholder="Enter village name"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sub-District"
                {...register('sub_district')}
                error={errors.sub_district?.message}
                placeholder="Enter sub-district"
                required
              />

              <Input
                label="District"
                {...register('district')}
                error={errors.district?.message}
                placeholder="Enter district"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Province"
                {...register('province')}
                error={errors.province?.message}
                placeholder="Enter province"
                required
              />

              <Input
                label="Postal Code"
                {...register('postal_code')}
                error={errors.postal_code?.message}
                placeholder="e.g., 12345"
                required
                maxLength={5}
              />
            </div>

            <Input
              label="Area Size (km²)"
              type="number"
              step="0.01"
              {...register('area_size')}
              error={errors.area_size?.message}
              placeholder="Enter area size in square kilometers"
              required
            />
          </div>

          {/* Village Logo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Village Logo
            </h3>

            <ImageUpload
              bucket="profile-images"
              maxSizeMB={2}
              onUploadComplete={handleImageUpload}
              existingImages={logoUrl ? [logoUrl] : []}
              onRemoveExisting={handleImageRemove}
            />
            <p className="text-sm text-gray-500">
              Upload a logo or photo representing your village (optional)
            </p>
          </div>

          {/* Village History Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Village History
            </h3>

            <RichTextEditor
              label="History"
              value={history}
              onChange={handleHistoryChange}
              onBlur={handleHistoryBlur}
              error={errors.history?.message}
              placeholder="Write the village history here..."
              required
              showPreview={false}
              minHeight="300px"
            />
            <p className="text-sm text-gray-500">
              Minimum 100 characters required
            </p>
          </div>
        </>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={showPreview}
        >
          {profile ? 'Update' : 'Create'} Profile
        </Button>
      </div>
    </form>
  )
}
