import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

async function getAlarms() {
  const alarms = await prisma.alarm.findMany({
    include: {
      olt: { select: { name: true } },
      ont: { select: { serialNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return alarms
}

export default async function AlarmsPage() {
  const alarms = await getAlarms()
  const activeAlarms = alarms.filter(a => a.status === "ACTIVE")
  const resolvedAlarms = alarms.filter(a => a.status === "RESOLVED")

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "bg-red-500 hover:bg-red-600",
      WARNING: "bg-yellow-500 hover:bg-yellow-600",
      INFO: "bg-blue-500 hover:bg-blue-600",
    }
    return (
      <Badge className={colors[severity] || ""}>
        {severity}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alarm Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor and manage system alarms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Alarms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alarms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Active Alarms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{activeAlarms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{resolvedAlarms.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Alarms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alarms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No alarms found. Your network is healthy!
              </div>
            ) : (
              alarms.map((alarm: any) => (
                <div
                  key={alarm.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="mt-1">
                    {alarm.status === "ACTIVE" ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityBadge(alarm.severity)}
                      <Badge variant={alarm.status === "ACTIVE" ? "destructive" : "secondary"}>
                        {alarm.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {alarm.deviceType} • {alarm.olt?.name || alarm.ont?.serialNumber}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {alarm.message}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alarm.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Created: {new Date(alarm.createdAt).toLocaleString()}</span>
                      {alarm.resolvedAt && (
                        <span>Resolved: {new Date(alarm.resolvedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  {alarm.status === "ACTIVE" && (
                    <Button variant="outline" size="sm">
                      Resolve
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
