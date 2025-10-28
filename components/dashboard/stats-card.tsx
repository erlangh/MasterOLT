import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  variant?: "default" | "success" | "warning" | "danger"
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  trendValue,
  variant = "default",
}: StatsCardProps) {
  const variantColors = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  }

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {value}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {description}
            </p>
            {trendValue && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColors[trend]}`}>
                <TrendIcon className="w-3 h-3" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${variantColors[variant]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
