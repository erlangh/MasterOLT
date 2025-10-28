import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Wifi, Users, AlertTriangle, Activity, TrendingUp } from "lucide-react"
import StatsCard from "@/components/dashboard/stats-card"
import RecentActivity from "@/components/dashboard/recent-activity"
import DeviceStatusChart from "@/components/dashboard/device-status-chart"
import SignalQualityChart from "@/components/dashboard/signal-quality-chart"

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const [
    totalOLTs,
    onlineOLTs,
    totalONTs,
    onlineONTs,
    activeAlarms,
    recentAlarms,
    recentONTs,
  ] = await Promise.all([
    prisma.oLT.count(),
    prisma.oLT.count({ where: { status: "ONLINE" } }),
    prisma.oNT.count(),
    prisma.oNT.count({ where: { status: "ONLINE" } }),
    prisma.alarm.count({ where: { status: "ACTIVE" } }),
    prisma.alarm.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        olt: { select: { name: true } },
        ont: { select: { serialNumber: true } },
      },
    }),
    prisma.oNT.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        olt: { select: { name: true } },
      },
    }),
  ])

  return {
    totalOLTs,
    onlineOLTs,
    offlineOLTs: totalOLTs - onlineOLTs,
    totalONTs,
    onlineONTs,
    offlineONTs: totalONTs - onlineONTs,
    activeAlarms,
    recentAlarms,
    recentONTs,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Network overview and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total OLTs"
          value={data.totalOLTs}
          description={`${data.onlineOLTs} online, ${data.offlineOLTs} offline`}
          icon={Server}
          trend={data.onlineOLTs > 0 ? "up" : "neutral"}
          trendValue={`${Math.round((data.onlineOLTs / data.totalOLTs) * 100)}%`}
        />
        <StatsCard
          title="Total ONTs"
          value={data.totalONTs}
          description={`${data.onlineONTs} online, ${data.offlineONTs} offline`}
          icon={Wifi}
          trend={data.onlineONTs > 0 ? "up" : "neutral"}
          trendValue={`${Math.round((data.onlineONTs / data.totalONTs) * 100)}%`}
        />
        <StatsCard
          title="Active Alarms"
          value={data.activeAlarms}
          description="Requires attention"
          icon={AlertTriangle}
          trend={data.activeAlarms > 0 ? "down" : "neutral"}
          variant="warning"
        />
        <StatsCard
          title="Network Health"
          value={`${Math.round((data.onlineONTs / data.totalONTs) * 100)}%`}
          description="Overall network status"
          icon={Activity}
          trend="up"
          variant="success"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <DeviceStatusChart
          oltOnline={data.onlineOLTs}
          oltOffline={data.offlineOLTs}
          ontOnline={data.onlineONTs}
          ontOffline={data.offlineONTs}
        />
        <SignalQualityChart />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alarms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentAlarms.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent alarms</p>
            ) : (
              <div className="space-y-3">
                {data.recentAlarms.map((alarm: any) => (
                  <div
                    key={alarm.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        alarm.severity === "CRITICAL"
                          ? "bg-red-500"
                          : alarm.severity === "WARNING"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alarm.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {alarm.olt?.name || alarm.ont?.serialNumber} •{" "}
                        {new Date(alarm.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recently Added ONTs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentONTs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent ONTs</p>
            ) : (
              <div className="space-y-3">
                {data.recentONTs.map((ont: any) => (
                  <div
                    key={ont.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        ont.status === "ONLINE" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ont.serialNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {ont.olt.name} Port {ont.port} • {ont.customerName || "No customer"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
