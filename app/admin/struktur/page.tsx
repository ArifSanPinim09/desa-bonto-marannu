'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { Official } from '@/src/types/official'
import Button from '@/src/components/shared/Button'
import Modal from '@/src/components/shared/Modal'
import OfficialForm from '@/src/components/admin/forms/OfficialForm'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, GripVertical, User } from 'lucide-react'

export default function StrukturPage() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [officialToDelete, setOfficialToDelete] = useState<Official | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchOfficials()
  }, [])

  async function fetchOfficials() {
    try {
      setIsLoading(true)
      // @ts-ignore - Supabase type inference issue
      const { data, error } = await supabase
        .from('organization_structure')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setOfficials(data || [])
    } catch (error) {
      console.error('Error fetching officials:', error)
      toast.error('Failed to load officials')
    } finally {
      setIsLoading(false)
    }
  }

  function handleAdd() {
    setSelectedOfficial(null)
    setIsModalOpen(true)
  }

  function handleEdit(official: Official) {
    setSelectedOfficial(official)
    setIsModalOpen(true)
  }

  function handleDeleteClick(official: Official) {
    setOfficialToDelete(official)
    setIsDeleteModalOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!officialToDelete) return

    try {
      // @ts-ignore - Supabase type inference issue
      const { error } = await supabase
        .from('organization_structure')
        .delete()
        .eq('id', officialToDelete.id)

      if (error) throw error
      
      toast.success('Official deleted successfully')
      setIsDeleteModalOpen(false)
      setOfficialToDelete(null)
      fetchOfficials()
    } catch (error) {
      console.error('Error deleting official:', error)
      toast.error('Failed to delete official')
    }
  }

  function handleFormSuccess() {
    setIsModalOpen(false)
    setSelectedOfficial(null)
    fetchOfficials()
  }

  function handleFormCancel() {
    setIsModalOpen(false)
    setSelectedOfficial(null)
  }

  // Drag and drop handlers
  function handleDragStart(index: number) {
    setIsDragging(true)
    setDraggedIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === index) return

    const newOfficials = [...officials]
    const draggedItem = newOfficials[draggedIndex]
    
    // Remove from old position
    newOfficials.splice(draggedIndex, 1)
    // Insert at new position
    newOfficials.splice(index, 0, draggedItem)
    
    setOfficials(newOfficials)
    setDraggedIndex(index)
  }

  async function handleDragEnd() {
    setIsDragging(false)
    setDraggedIndex(null)

    // Update display_order for all officials
    try {
      const updates = officials.map((official, index) => ({
        id: official.id,
        display_order: index,
      }))

      for (const update of updates) {
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('organization_structure')
          // @ts-ignore
          .update({ display_order: update.display_order })
          .eq('id', update.id)
        
        if (error) throw error
      }

      toast.success('Order updated successfully')
      fetchOfficials()
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
      fetchOfficials() // Reload to reset order
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Structure Management</h1>
          <p className="mt-2 text-gray-600">
            Manage village officials and organization structure
          </p>
        </div>
        <div className="rounded-lg bg-white p-12 shadow text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">Loading officials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Structure Management</h1>
          <p className="mt-2 text-gray-600">
            Manage village officials and organization structure
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Official
        </Button>
      </div>

      {/* Officials List */}
      <div className="rounded-lg bg-white shadow">
        {officials.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No officials yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first village official
            </p>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Official
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {officials.map((official, index) => (
              <div
                key={official.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors
                  ${isDragging && draggedIndex === index ? 'opacity-50' : ''}
                  cursor-move
                `}
              >
                {/* Drag Handle */}
                <div className="flex-shrink-0 text-gray-400 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Photo */}
                <div className="flex-shrink-0">
                  {official.photo_url ? (
                    <img
                      src={official.photo_url}
                      alt={official.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {official.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{official.position}</p>
                  {official.nip && (
                    <p className="text-xs text-gray-500 mt-1">NIP: {official.nip}</p>
                  )}
                  {(official.start_period || official.end_period) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Period: {official.start_period || '—'} to {official.end_period || 'Present'}
                    </p>
                  )}
                </div>

                {/* Display Order Badge */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Order: {official.display_order}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(official)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(official)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drag and Drop Instructions */}
      {officials.length > 0 && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Drag and drop officials to reorder them. The order will be saved automatically.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={selectedOfficial ? 'Edit Official' : 'Add New Official'}
        size="lg"
      >
        <OfficialForm
          official={selectedOfficial}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Official"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{officialToDelete?.name}</strong>? This action cannot be undone.
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
