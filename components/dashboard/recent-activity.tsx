"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Activity logs will appear here</p>
        </div>
      </CardContent>
    </Card>
  )
}
