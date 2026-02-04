import { getUser } from '@/src/lib/supabase/auth'
import { createClient } from '@/src/lib/supabase/server'
import { DashboardStats } from '@/src/components/admin/DashboardStats'
import { QuickActions } from '@/src/components/admin/QuickActions'
import { RecentActivities } from '@/src/components/admin/RecentActivities'

async function getDashboardData() {
  const supabase = await createClient()

  // Fetch demographics data
  const { data: demographics } = await supabase
    .from('village_demographics')
    .select('total_population')
    .single()

  // Fetch total news articles count
  const { count: newsCount } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })

  // Fetch total destinations count
  const { count: destinationsCount } = await supabase
    .from('tourist_destinations')
    .select('*', { count: 'exact', head: true })

  // Fetch recent news for activities
  const { data: recentNews } = await supabase
    .from('news')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    populationCount: (demographics as any)?.total_population || 0,
    newsCount: newsCount || 0,
    destinationsCount: destinationsCount || 0,
    recentNews: recentNews || [],
  }
}

export default async function DashboardPage() {
  const user = await getUser()
  const dashboardData = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.email}
        </p>
      </div>

      {/* Statistics Cards */}
      <DashboardStats
        populationCount={dashboardData.populationCount}
        newsCount={dashboardData.newsCount}
        destinationsCount={dashboardData.destinationsCount}
      />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Recent Activities */}
        <RecentActivities recentNews={dashboardData.recentNews} />
      </div>
    </div>
  )
}

