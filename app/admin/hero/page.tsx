'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/src/lib/supabase/client'
import { HeroSection } from '@/src/types/hero'
import Button from '@/src/components/shared/Button'
import Modal from '@/src/components/shared/Modal'
import { formatDate } from '@/src/lib/utils/format'
import { toast } from 'sonner'
import HeroForm from '@/src/components/admin/forms/HeroForm'

export default function HeroPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchHeroes()
  }, [])

  async function fetchHeroes() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('hero_sections')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setHeroes(data || [])
    } catch (error) {
      console.error('Error fetching heroes:', error)
      toast.error('Failed to load hero sections')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleActive(hero: HeroSection) {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error } = await supabase
        .from('hero_sections')
        // @ts-ignore
        .update({
          is_active: !hero.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', hero.id)

      if (error) throw error

      toast.success(`Hero section ${!hero.is_active ? 'activated' : 'deactivated'}`)
      fetchHeroes()
    } catch (error) {
      console.error('Error toggling hero status:', error)
      toast.error('Failed to update hero status')
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id)
      const { error } = await supabase
        .from('hero_sections')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Hero section deleted successfully')
      fetchHeroes()
    } catch (error) {
      console.error('Error deleting hero:', error)
      toast.error('Failed to delete hero section')
    } finally {
      setDeletingId(null)
    }
  }

  function handleCreate() {
    setEditingHero(null)
    setIsFormOpen(true)
  }

  function handleEdit(hero: HeroSection) {
    setEditingHero(hero)
    setIsFormOpen(true)
  }

  function handleFormSuccess() {
    setIsFormOpen(false)
    setEditingHero(null)
    fetchHeroes()
  }

  function handleFormCancel() {
    setIsFormOpen(false)
    setEditingHero(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
          <p className="mt-2 text-gray-600">Manage hero sections for the homepage</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
          <p className="mt-2 text-gray-600">Manage hero sections for the homepage</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Hero Section
        </Button>
      </div>

      {heroes.length === 0 ? (
        <div className="rounded-lg bg-white p-12 shadow text-center">
          <p className="text-gray-500 mb-4">No hero sections found</p>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Hero Section
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className="rounded-lg bg-white shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={hero.image_url}
                  alt={hero.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(hero)}
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      hero.is_active
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                    title={hero.is_active ? 'Active' : 'Inactive'}
                  >
                    {hero.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {hero.title}
                </h3>
                {hero.subtitle && (
                  <p className="text-sm text-gray-600 mb-3">{hero.subtitle}</p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className={`px-2 py-1 rounded-full ${
                    hero.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {hero.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span>Order: {hero.display_order}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>CTA: {hero.cta_text}</span>
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  Updated: {formatDate(hero.updated_at, 'dd MMM yyyy')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(hero)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(hero.id)}
                    isLoading={deletingId === hero.id}
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingHero ? 'Edit Hero Section' : 'Create Hero Section'}
        size="lg"
      >
        <HeroForm
          hero={editingHero}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  )
}
