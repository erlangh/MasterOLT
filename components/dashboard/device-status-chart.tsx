"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DeviceStatusChartProps {
  oltOnline: number
  oltOffline: number
  ontOnline: number
  ontOffline: number
}

export default function DeviceStatusChart({
  oltOnline,
  oltOffline,
  ontOnline,
  ontOffline,
}: DeviceStatusChartProps) {
  const data = [
    {
      name: "OLT",
      Online: oltOnline,
      Offline: oltOffline,
    },
    {
      name: "ONT",
      Online: ontOnline,
      Offline: ontOffline,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Online" fill="#22c55e" />
            <Bar dataKey="Offline" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
