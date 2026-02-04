import Link from 'next/link'
import { Plus, FileText, MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/shared/Card'

export function QuickActions() {
  const actions = [
    {
      title: 'Add News Article',
      href: '/admin/berita',
      icon: FileText,
      description: 'Create a new news article',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Add Destination',
      href: '/admin/destinasi',
      icon: MapPin,
      description: 'Add a new tourist destination',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Manage Hero',
      href: '/admin/hero',
      icon: Plus,
      description: 'Update hero section',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className={`rounded-full p-3 ${action.bgColor} ${action.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-bold text-gray-900 group-hover:text-green-700">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-gray-700 font-medium">
                  {action.description}
                </p>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
