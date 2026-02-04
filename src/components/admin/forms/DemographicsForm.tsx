'use client'

import { useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { VillageDemographics, VillageDemographicsUpdate } from '@/src/types/demographics'
import Button from '@/src/components/shared/Button'
import { toast } from 'sonner'

interface DemographicsFormProps {
  demographics: VillageDemographics | null
  onSuccess: () => void
  onCancel: () => void
}

export default function DemographicsForm({
  demographics,
  onSuccess,
  onCancel,
}: DemographicsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<VillageDemographicsUpdate>({
    total_population: demographics?.total_population || 0,
    male_population: demographics?.male_population || 0,
    female_population: demographics?.female_population || 0,
    total_families: demographics?.total_families || 0,
    altitude_mdpl: demographics?.altitude_mdpl || 0,
    area_size_km: demographics?.area_size_km || 0,
    topography: demographics?.topography || 'Dataran',
    description: demographics?.description || '',
  })

  const supabase = createClient()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['total_population', 'male_population', 'female_population', 'total_families', 'altitude_mdpl'].includes(name)
        ? parseInt(value) || 0
        : name === 'area_size_km'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabaseAny = supabase as any
      
      if (demographics) {
        // Update existing
        const { error } = await supabaseAny
          .from('village_demographics')
          .update(formData)
          .eq('id', demographics.id)

        if (error) throw error
        toast.success('Data demografi berhasil diperbarui')
      } else {
        // Create new
        const { error } = await supabaseAny
          .from('village_demographics')
          .insert([formData])

        if (error) throw error
        toast.success('Data demografi berhasil ditambahkan')
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving demographics:', error)
      toast.error('Gagal menyimpan data demografi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Statistik Penduduk */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Penduduk</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="total_population" className="block text-sm font-medium text-gray-700 mb-1">
              Total Penduduk <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="total_population"
              name="total_population"
              value={formData.total_population}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="total_families" className="block text-sm font-medium text-gray-700 mb-1">
              Kepala Keluarga <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="total_families"
              name="total_families"
              value={formData.total_families}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="male_population" className="block text-sm font-medium text-gray-700 mb-1">
              Laki-laki <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="male_population"
              name="male_population"
              value={formData.male_population}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="female_population" className="block text-sm font-medium text-gray-700 mb-1">
              Perempuan <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="female_population"
              name="female_population"
              value={formData.female_population}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Kondisi Geografis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kondisi Geografis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="altitude_mdpl" className="block text-sm font-medium text-gray-700 mb-1">
              Ketinggian (Mdpl) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="altitude_mdpl"
              name="altitude_mdpl"
              value={formData.altitude_mdpl}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="area_size_km" className="block text-sm font-medium text-gray-700 mb-1">
              Luas Wilayah (Km²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="area_size_km"
              name="area_size_km"
              value={formData.area_size_km}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="topography" className="block text-sm font-medium text-gray-700 mb-1">
              Topografi <span className="text-red-500">*</span>
            </label>
            <select
              id="topography"
              name="topography"
              value={formData.topography}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Dataran">Dataran</option>
              <option value="Perbukitan">Perbukitan</option>
              <option value="Pegunungan">Pegunungan</option>
              <option value="Pesisir">Pesisir</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-1">
              Deskripsi Tambahan
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Informasi tambahan tentang demografi dan geografis desa..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {demographics ? 'Perbarui' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
