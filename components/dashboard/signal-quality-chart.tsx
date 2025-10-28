"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function SignalQualityChart() {
  // Sample data - in real app, this would come from API
  const data = [
    { time: "00:00", signal: -18.5 },
    { time: "04:00", signal: -19.2 },
    { time: "08:00", signal: -18.8 },
    { time: "12:00", signal: -19.5 },
    { time: "16:00", signal: -18.3 },
    { time: "20:00", signal: -19.1 },
    { time: "24:00", signal: -18.7 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Signal Strength (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[-25, -15]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="signal"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Signal (dBm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
