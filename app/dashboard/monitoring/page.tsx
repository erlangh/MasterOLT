import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, Signal } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getMonitoringData() {
  const [olts, onts, recentAlarms] = await Promise.all([
    prisma.oLT.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        ipAddress: true,
        _count: { select: { onts: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.oNT.findMany({
      select: {
        id: true,
        serialNumber: true,
        status: true,
        signalStrength: true,
        olt: { select: { name: true } },
      },
      where: { status: "ONLINE" },
      orderBy: { signalStrength: "desc" },
    }),
    prisma.alarm.findMany({
      where: { status: "ACTIVE" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        olt: { select: { name: true } },
        ont: { select: { serialNumber: true } },
      },
    }),
  ])

  return { olts, onts, recentAlarms }
}

export default async function MonitoringPage() {
  const data = await getMonitoringData()

  const getStatusColor = (status: string) => {
    return status === "ONLINE" ? "bg-green-500" : "bg-red-500"
  }

  const getSignalColor = (signal: number) => {
    if (signal > -20) return "text-green-500"
    if (signal > -25) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Network Monitoring</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Real-time network status and performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OLTs Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              OLT Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.olts.map((olt: any) => (
                <div
                  key={olt.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(olt.status)}`} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {olt.name}
                      </div>
                      <div className="text-xs text-gray-500">{olt.ipAddress}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{olt._count.onts} ONTs</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ONTs Signal Strength */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Signal className="w-5 h-5" />
              ONT Signal Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.onts.slice(0, 10).map((ont: any) => (
                <div
                  key={ont.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <Wifi className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {ont.serialNumber}
                      </div>
                      <div className="text-xs text-gray-500">{ont.olt.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getSignalColor(ont.signalStrength)}`}>
                      {ont.signalStrength} dBm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alarms */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alarms ({data.recentAlarms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAlarms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active alarms. Network is healthy!
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentAlarms.map((alarm: any) => (
                <div
                  key={alarm.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-red-500">{alarm.severity}</Badge>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {alarm.olt?.name || alarm.ont?.serialNumber}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {alarm.message}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alarm.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
