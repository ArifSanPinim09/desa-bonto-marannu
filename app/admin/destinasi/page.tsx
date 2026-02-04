'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { TouristDestination } from '@/src/types/destination'
import Button from '@/src/components/shared/Button'
import Modal from '@/src/components/shared/Modal'
import DestinationForm from '@/src/components/admin/forms/DestinationForm'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, MapPin, Image as ImageIcon, ExternalLink } from 'lucide-react'

export default function DestinasiPage() {
  const [destinations, setDestinations] = useState<TouristDestination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<TouristDestination | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [destinationToDelete, setDestinationToDelete] = useState<TouristDestination | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchDestinations()
  }, [])

  async function fetchDestinations() {
    try {
      setIsLoading(true)
      // @ts-ignore - Supabase type inference issue
      const { data: destinationsData, error: destError } = await supabase
        .from('tourist_destinations')
        .select('*')
        .order('created_at', { ascending: false })

      if (destError) throw destError

      // Fetch images and UMKM for each destination
      const destinationsWithDetails = await Promise.all(
        (destinationsData || []).map(async (dest: any) => {
          // Fetch images
          // @ts-ignore
          const { data: images, error: imgError } = await supabase
            .from('destination_images')
            .select('*')
            .eq('destination_id', dest.id)
            .order('display_order', { ascending: true })

          if (imgError) {
            console.error('Error fetching images for destination:', dest.id, imgError)
          }

          // Fetch UMKM (with error handling for table not existing yet)
          let umkm: any[] = []
          try {
            // @ts-ignore
            const { data: umkmData, error: umkmError } = await supabase
              .from('destination_umkm')
              .select('*')
              .eq('destination_id', dest.id)
              .order('display_order', { ascending: true })

            if (!umkmError && umkmData) {
              umkm = umkmData
            }
          } catch (error) {
            // Table might not exist yet, silently ignore
            console.log('UMKM table not available yet')
          }

          return { ...dest, images: images || [], umkm: umkm || [] }
        })
      )

      setDestinations(destinationsWithDetails as TouristDestination[])
    } catch (error) {
      console.error('Error fetching destinations:', error)
      toast.error('Failed to load destinations')
    } finally {
      setIsLoading(false)
    }
  }

  function handleAdd() {
    setSelectedDestination(null)
    setIsModalOpen(true)
  }

  function handleEdit(destination: TouristDestination) {
    setSelectedDestination(destination)
    setIsModalOpen(true)
  }

  function handleDeleteClick(destination: TouristDestination) {
    setDestinationToDelete(destination)
    setIsDeleteModalOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!destinationToDelete) return

    try {
      // Delete destination (images will be cascade deleted)
      // @ts-ignore - Supabase type inference issue
      const { error } = await supabase
        .from('tourist_destinations')
        .delete()
        .eq('id', destinationToDelete.id)

      if (error) throw error
      
      toast.success('Destination deleted successfully')
      setIsDeleteModalOpen(false)
      setDestinationToDelete(null)
      fetchDestinations()
    } catch (error) {
      console.error('Error deleting destination:', error)
      toast.error('Failed to delete destination')
    }
  }

  function handleFormSuccess() {
    setIsModalOpen(false)
    setSelectedDestination(null)
    fetchDestinations()
  }

  function handleFormCancel() {
    setIsModalOpen(false)
    setSelectedDestination(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tourist Destinations Management</h1>
          <p className="mt-2 text-gray-600">
            Manage tourist destinations and attractions
          </p>
        </div>
        <div className="rounded-lg bg-white p-12 shadow text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tourist Destinations Management</h1>
          <p className="mt-2 text-gray-600">
            Manage tourist destinations and attractions
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      {/* Destinations Grid */}
      <div className="rounded-lg bg-white shadow">
        {destinations.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first tourist destination
            </p>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Destination
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Main Image */}
                <div className="relative h-48 bg-gray-200">
                  {destination.images && destination.images.length > 0 ? (
                    <img
                      src={destination.images[0].image_url}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Image Count Badge */}
                  {destination.images && destination.images.length > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {destination.images.length}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {destination.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{destination.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {destination.category}
                    </span>
                    {destination.maps_url && (
                      <a
                        href={destination.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-700 hover:text-green-800 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Maps
                      </a>
                    )}
                  </div>

                  {/* Facilities */}
                  {destination.facilities && destination.facilities.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Facilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {destination.facilities.slice(0, 3).map((facility, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
                          >
                            {facility}
                          </span>
                        ))}
                        {destination.facilities.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                            +{destination.facilities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(destination)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(destination)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={selectedDestination ? 'Edit Destination' : 'Add New Destination'}
        size="xl"
      >
        <DestinationForm
          destination={selectedDestination}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Destination"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{destinationToDelete?.name}</strong>? 
            This will also delete all associated images. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
