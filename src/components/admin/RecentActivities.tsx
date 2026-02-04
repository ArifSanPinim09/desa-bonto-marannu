import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/shared/Card'

interface RecentActivity {
  id: string
  title: string
  status: string
  created_at: string
}

interface RecentActivitiesProps {
  recentNews: RecentActivity[]
}

export function RecentActivities({ recentNews }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {recentNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-900 font-medium">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNews.map((news) => (
              <Link
                key={news.id}
                href={`/admin/berita`}
                className="group flex items-start gap-3 rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                <div className="rounded-full bg-blue-50 p-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-green-700 truncate">
                    {news.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-700 font-medium">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        news.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {news.status}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(news.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
