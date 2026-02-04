import { Users, Newspaper, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/src/components/shared/Card'

interface DashboardStatsProps {
  populationCount: number
  newsCount: number
  destinationsCount: number
}

export function DashboardStats({
  populationCount,
  newsCount,
  destinationsCount,
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Population',
      value: populationCount.toLocaleString(),
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    {
      title: 'News Articles',
      value: newsCount.toLocaleString(),
      icon: Newspaper,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Tourist Destinations',
      value: destinationsCount.toLocaleString(),
      icon: MapPin,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className={stat.bgColor}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {stat.title}
                </p>
                <p className={`mt-2 text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-full p-3 ${stat.iconColor}`}>
                <Icon className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
