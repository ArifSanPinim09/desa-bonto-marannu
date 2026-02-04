'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/src/components/shared/Button'
import { Card, CardContent } from '@/src/components/shared/Card'
import Modal from '@/src/components/shared/Modal'
import NewsForm from '@/src/components/admin/forms/NewsForm'
import { createClient } from '@/src/lib/supabase/client'
import { formatDate } from '@/src/lib/utils/format'
import type { Database } from '@/src/types/database'
import type { News, NewsStatus } from '@/src/types/news'

export default function BeritaPage() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [filteredNews, setFilteredNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<NewsStatus | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    filterNews()
  }, [news, searchQuery, statusFilter])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setNews(data as News[])
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Failed to load news articles')
    } finally {
      setLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = [...news]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query)
      )
    }

    setFilteredNews(filtered)
  }

  const handleDelete = async () => {
    if (!selectedNews) return

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', selectedNews.id)

      if (error) throw error

      toast.success('News article deleted successfully')
      setShowDeleteModal(false)
      setSelectedNews(null)
      fetchNews()
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error('Failed to delete news article')
    }
  }

  const handleStatusToggle = async (newsItem: News) => {
    try {
      const newStatus: NewsStatus = newsItem.status === 'published' ? 'draft' : 'published'
      
      // Set published_at when publishing
      const published_at = newStatus === 'published' && !newsItem.published_at 
        ? new Date().toISOString() 
        : newsItem.published_at

      const { error } = await supabase
        .from('news')
        // @ts-ignore - Supabase type inference issue
        .update({
          status: newStatus,
          published_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', newsItem.id)

      if (error) throw error

      toast.success(`Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
      fetchNews()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update article status')
    }
  }

  const openEditModal = (newsItem: News) => {
    setSelectedNews(newsItem)
    setShowEditModal(true)
  }

  const openDeleteModal = (newsItem: News) => {
    setSelectedNews(newsItem)
    setShowDeleteModal(true)
  }

  const handleModalClose = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedNews(null)
    fetchNews()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="mt-2 text-gray-600">
            Create and manage news articles
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Article
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as NewsStatus | 'all')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span>Total: {news.length}</span>
            <span>Published: {news.filter(n => n.status === 'published').length}</span>
            <span>Draft: {news.filter(n => n.status === 'draft').length}</span>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      {filteredNews.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'No articles found matching your filters'
                  : 'No articles yet. Create your first article!'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredNews.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              news={newsItem}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create News Article"
        size="xl"
      >
        <NewsForm mode="create" />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleModalClose}
        title="Edit News Article"
        size="xl"
      >
        {selectedNews && <NewsForm mode="edit" news={selectedNews} />}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete News Article"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedNews?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

interface NewsCardProps {
  news: News
  onEdit: (news: News) => void
  onDelete: (news: News) => void
  onStatusToggle: (news: News) => void
}

function NewsCard({ news, onEdit, onDelete, onStatusToggle }: NewsCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Thumbnail */}
          {news.thumbnail_url && (
            <div className="w-full lg:w-48 h-48 lg:h-32 flex-shrink-0">
              <img
                src={news.thumbnail_url}
                alt={news.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                    {news.category}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      news.status === 'published'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {news.status}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                  {news.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3 break-words overflow-hidden">
                  {news.excerpt}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="break-all">Created: {formatDate(news.created_at)}</span>
                  {news.published_at && (
                    <span className="break-all">Published: {formatDate(news.published_at)}</span>
                  )}
                  <span className="break-all">Slug: {news.slug}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col flex-row gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusToggle(news)}
                  title={news.status === 'published' ? 'Unpublish' : 'Publish'}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="w-4 h-4" />
                  <span className="ml-2 sm:hidden">{news.status === 'published' ? 'Unpublish' : 'Publish'}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(news)}
                  title="Edit"
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="w-4 h-4" />
                  <span className="ml-2 sm:hidden">Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(news)}
                  title="Delete"
                  className="flex-1 sm:flex-none"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="ml-2 sm:hidden">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
