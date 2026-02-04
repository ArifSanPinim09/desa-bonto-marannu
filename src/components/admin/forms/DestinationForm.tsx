'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/src/lib/supabase/client'
import { TouristDestination, DestinationImage, DestinationUMKM } from '@/src/types/destination'
import { destinationSchema, DestinationFormData } from '@/src/lib/utils/validation-schemas'
import Button from '@/src/components/shared/Button'
import Input from '@/src/components/shared/Input'
import ImageUpload from '@/src/components/shared/ImageUpload'
import { toast } from 'sonner'
import { X, GripVertical, Plus } from 'lucide-react'

interface DestinationFormProps {
  destination?: TouristDestination | null
  onSuccess: () => void
  onCancel: () => void
}

export default function DestinationForm({ destination, onSuccess, onCancel }: DestinationFormProps) {
  const [facilityInput, setFacilityInput] = useState('')
  const [umkmNameInput, setUmkmNameInput] = useState('')
  const [umkmMapsInput, setUmkmMapsInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: destination?.name || '',
      description: destination?.description || '',
      location: destination?.location || '',
      category: destination?.category || '',
      facilities: destination?.facilities || [],
      maps_url: destination?.maps_url || '',
      umkm: destination?.umkm?.map(u => ({
        ...u,
        maps_url: u.maps_url || '',
      })) || [],
      images: destination?.images || [],
    },
  })

  const facilities = watch('facilities')
  const umkm = watch('umkm') || []
  const images = watch('images')
  const description = watch('description')

  function handleAddFacility() {
    if (facilityInput.trim()) {
      setValue('facilities', [...facilities, facilityInput.trim()])
      setFacilityInput('')
    }
  }

  function handleRemoveFacility(index: number) {
    setValue('facilities', facilities.filter((_, i) => i !== index))
  }

  function handleAddUMKM() {
    if (umkmNameInput.trim()) {
      const newUMKM: DestinationUMKM = {
        id: `temp-${Date.now()}`,
        destination_id: destination?.id || '',
        name: umkmNameInput.trim(),
        maps_url: umkmMapsInput.trim() || null,
        display_order: umkm.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setValue('umkm', [...umkm, newUMKM])
      setUmkmNameInput('')
      setUmkmMapsInput('')
    }
  }

  function handleRemoveUMKM(index: number) {
    setValue('umkm', umkm.filter((_, i) => i !== index))
  }

  function handleImageUpload(urls: string[]) {
    const newImages: DestinationImage[] = urls.map((url, index) => ({
      id: `temp-${Date.now()}-${index}`,
      destination_id: destination?.id || '',
      image_url: url,
      display_order: images.length + index,
      created_at: new Date().toISOString(),
    }))
    
    setValue('images', [...images, ...newImages])
    toast.success(`${urls.length} image(s) uploaded successfully`)
  }

  function handleRemoveImage(index: number) {
    setValue('images', images.filter((_, i) => i !== index))
  }

  // Image reordering handlers
  function handleImageDragStart(index: number) {
    setDraggedImageIndex(index)
  }

  function handleImageDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    
    if (draggedImageIndex === null || draggedImageIndex === index) return

    const newImages = [...images]
    const draggedItem = newImages[draggedImageIndex]
    
    // Remove from old position
    newImages.splice(draggedImageIndex, 1)
    // Insert at new position
    newImages.splice(index, 0, draggedItem)
    
    // Update display_order
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
    }))
    
    setValue('images', reorderedImages)
    setDraggedImageIndex(index)
  }

  function handleImageDragEnd() {
    setDraggedImageIndex(null)
  }

  const onSubmit = async (data: DestinationFormData) => {
    try {
      setIsSubmitting(true)

      const destinationData = {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        category: data.category.trim(),
        facilities: data.facilities,
        maps_url: data.maps_url?.trim() || null,
        updated_at: new Date().toISOString(),
      }

      let destinationId: string

      if (destination) {
        // Update existing destination
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('tourist_destinations')
          // @ts-ignore
          .update(destinationData)
          .eq('id', destination.id)

        if (error) throw error
        destinationId = destination.id

        // Delete old images that are not in the new list
        const existingImageIds = destination.images?.map(img => img.id) || []
        const newImageIds = data.images.filter(img => !img.id.startsWith('temp-')).map(img => img.id)
        const imagesToDelete = existingImageIds.filter(id => !newImageIds.includes(id))

        if (imagesToDelete.length > 0) {
          // @ts-ignore
          const { error: deleteError } = await supabase
            .from('destination_images')
            .delete()
            .in('id', imagesToDelete)

          if (deleteError) throw deleteError
        }
      } else {
        // Create new destination
        // @ts-ignore - Supabase type inference issue
        const { data: newDest, error } = await supabase
          .from('tourist_destinations')
          // @ts-ignore
          .insert([destinationData])
          .select()
          .single()

        if (error) throw error
        destinationId = (newDest as any).id
      }

      // Insert or update images
      const imageRecords = data.images.map((img, index) => ({
        destination_id: destinationId,
        image_url: img.image_url,
        display_order: index,
      }))

      // Delete all existing images for this destination and insert new ones
      if (destination) {
        // @ts-ignore
        const { error: deleteError } = await supabase
          .from('destination_images')
          .delete()
          .eq('destination_id', destinationId)

        if (deleteError) throw deleteError
      }

      // @ts-ignore
      const { error: imagesError } = await supabase
        .from('destination_images')
        // @ts-ignore
        .insert(imageRecords)

      if (imagesError) throw imagesError

      // Handle UMKM
      if (data.umkm && data.umkm.length > 0) {
        // Delete existing UMKM for this destination
        if (destination) {
          // @ts-ignore
          const { error: deleteUMKMError } = await supabase
            .from('destination_umkm')
            .delete()
            .eq('destination_id', destinationId)

          if (deleteUMKMError) throw deleteUMKMError
        }

        // Insert new UMKM
        const umkmRecords = data.umkm.map((item, index) => ({
          destination_id: destinationId,
          name: item.name,
          maps_url: item.maps_url || null,
          display_order: index,
        }))

        // @ts-ignore
        const { error: umkmError } = await supabase
          .from('destination_umkm')
          // @ts-ignore
          .insert(umkmRecords)

        if (umkmError) throw umkmError
      } else if (destination) {
        // If no UMKM in form but destination exists, delete all existing UMKM
        // @ts-ignore
        await supabase
          .from('destination_umkm')
          .delete()
          .eq('destination_id', destinationId)
      }

      toast.success(destination ? 'Destination updated successfully' : 'Destination created successfully')
      onSuccess()
    } catch (error) {
      console.error('Error saving destination:', error)
      toast.error('Failed to save destination')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        label="Destination Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter destination name"
        required
        maxLength={200}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description')}
          placeholder="Enter detailed description (minimum 50 characters)"
          rows={5}
          className={`
            w-full px-3 py-2 border rounded-md text-gray-900 placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>
        )}
        <p className="mt-1.5 text-sm text-gray-700">
          {description.length} / 50 minimum characters
        </p>
      </div>

      {/* Location */}
      <Input
        label="Location"
        {...register('location')}
        error={errors.location?.message}
        placeholder="e.g., North Village Area"
        required
      />

      {/* Google Maps Link */}
      <Input
        label="Google Maps Link"
        {...register('maps_url')}
        error={errors.maps_url?.message}
        placeholder="https://maps.google.com/..."
        helperText="Paste the Google Maps link for this destination"
      />

      {/* Category */}
      <Input
        label="Category"
        {...register('category')}
        error={errors.category?.message}
        placeholder="e.g., Nature, Culture, Adventure"
        required
      />

      {/* Facilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facilities
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={facilityInput}
            onChange={(e) => setFacilityInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddFacility()
              }
            }}
            placeholder="Add a facility (e.g., Parking, Restroom)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <Button
            type="button"
            onClick={handleAddFacility}
            variant="outline"
          >
            Add
          </Button>
        </div>
        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {facility}
                <button
                  type="button"
                  onClick={() => handleRemoveFacility(index)}
                  className="hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-1.5 text-sm text-gray-500">
          Optional: Add facilities available at this destination
        </p>
      </div>

      {/* UMKM Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          UMKM (Sentra Usaha)
        </label>
        <div className="space-y-3 mb-3">
          <Input
            value={umkmNameInput}
            onChange={(e) => setUmkmNameInput(e.target.value)}
            placeholder="UMKM Name (e.g., Toko Oleh-oleh Bonto)"
          />
          <Input
            value={umkmMapsInput}
            onChange={(e) => setUmkmMapsInput(e.target.value)}
            placeholder="Google Maps URL (optional)"
          />
          <Button
            type="button"
            onClick={handleAddUMKM}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add UMKM
          </Button>
        </div>
        
        {umkm.length > 0 && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {umkm.length} UMKM added:
            </p>
            {umkm.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-3 bg-white rounded-md border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 break-words">{item.name}</p>
                  {item.maps_url && (
                    <a
                      href={item.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:text-green-800 break-all"
                    >
                      {item.maps_url}
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveUMKM(index)}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-1.5 text-sm text-gray-500">
          Optional: Add UMKM businesses located at or near this destination
        </p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination Images <span className="text-red-500">*</span>
        </label>
        
        {/* Existing Images with Reordering */}
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Drag images to reorder them. The first image will be the main photo.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleImageDragStart(index)}
                  onDragOver={(e) => handleImageDragOver(e, index)}
                  onDragEnd={handleImageDragEnd}
                  className={`
                    relative group cursor-move
                    ${draggedImageIndex === index ? 'opacity-50' : ''}
                  `}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img
                      src={image.image_url}
                      alt={`Destination ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Order Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                  
                  {/* Drag Handle */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute bottom-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        {images.length < 10 && (
          <ImageUpload
            bucket="destination-images"
            maxSizeMB={5}
            multiple={true}
            onUploadComplete={handleImageUpload}
          />
        )}
        
        {errors.images && (
          <p className="mt-1.5 text-sm text-red-600">{errors.images.message}</p>
        )}
        <p className="mt-1.5 text-sm text-gray-500">
          {images.length} / 10 images • At least 1 required
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
          {destination ? 'Update' : 'Create'} Destination
        </Button>
      </div>
    </form>
  )
}
