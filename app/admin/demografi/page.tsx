'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { VillageDemographics } from '@/src/types/demographics'
import Modal from '@/src/components/shared/Modal'
import Button from '@/src/components/shared/Button'
import DemographicsForm from '@/src/components/admin/forms/DemographicsForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/shared/Card'
import { Users, MapPin, Mountain, Maximize, Pencil } from 'lucide-react'
import { toast } from 'sonner'

export default function DemografiPage() {
  const [demographics, setDemographics] = useState<VillageDemographics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchDemographics()
  }, [])

  async function fetchDemographics() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('village_demographics')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setDemographics(data || null)
    } catch (error) {
      console.error('Error fetching demographics:', error)
      toast.error('Gagal memuat data demografi')
    } finally {
      setIsLoading(false)
    }
  }

  function handleFormSuccess() {
    setIsFormOpen(false)
    fetchDemographics()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  const malePercentage = demographics && demographics.total_population > 0
    ? ((demographics.male_population / demographics.total_population) * 100).toFixed(1)
    : '0.0'
  
  const femalePercentage = demographics && demographics.total_population > 0
    ? ((demographics.female_population / demographics.total_population) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demografi & Geografis Desa</h1>
          <p className="mt-2 text-gray-600">
            Kelola data statistik penduduk dan kondisi geografis desa
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          {demographics ? 'Edit Data' : 'Tambah Data'}
        </Button>
      </div>

      {demographics ? (
        <>
          {/* Statistik Penduduk */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Statistik Penduduk
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="py-6">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2 text-green-100">Total Penduduk</p>
                    <p className="text-4xl font-bold">{demographics.total_population.toLocaleString('id-ID')}</p>
                    <p className="text-xs mt-2 text-green-100">Jiwa</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">Laki-laki</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {demographics.male_population.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs mt-2 text-gray-500">{malePercentage}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">Perempuan</p>
                    <p className="text-4xl font-bold text-pink-600">
                      {demographics.female_population.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs mt-2 text-gray-500">{femalePercentage}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">Kepala Keluarga</p>
                    <p className="text-4xl font-bold text-green-600">
                      {demographics.total_families.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs mt-2 text-gray-500">KK</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Kondisi Geografis */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Kondisi Geografis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mountain className="h-5 w-5 text-green-600" />
                    Ketinggian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {demographics.altitude_mdpl.toLocaleString('id-ID')}+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Mdpl</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Maximize className="h-5 w-5 text-green-600" />
                    Luas Wilayah
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    ±{demographics.area_size_km.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Km²</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mountain className="h-5 w-5 text-green-600" />
                    Topografi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {demographics.topography}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Bentang alam</p>
                </CardContent>
              </Card>
            </div>

            {demographics.description && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Deskripsi Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{demographics.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Belum ada data demografi dan geografis</p>
              <Button onClick={() => setIsFormOpen(true)}>
                Tambah Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={demographics ? 'Edit Data Demografi & Geografis' : 'Tambah Data Demografi & Geografis'}
        size="lg"
      >
        <DemographicsForm
          demographics={demographics}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  )
}
