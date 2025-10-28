"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Edit, Trash2, Signal } from "lucide-react"
import Link from "next/link"

interface ONT {
  id: string
  serialNumber: string
  macAddress: string | null
  port: number
  status: string
  signalStrength: number | null
  customerName: string | null
  customerPhone: string | null
  servicePackage: string | null
  olt: {
    name: string
  }
}

interface ONTTableProps {
  onts: ONT[]
}

export default function ONTTable({ onts }: ONTTableProps) {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ONLINE: "bg-green-500 hover:bg-green-600",
      OFFLINE: "bg-gray-500 hover:bg-gray-600",
      LOS: "bg-red-500 hover:bg-red-600",
      POWER_OFF: "bg-orange-500 hover:bg-orange-600",
      PENDING: "bg-yellow-500 hover:bg-yellow-600",
    }

    return (
      <Badge className={colors[status] || ""}>
        {status}
      </Badge>
    )
  }

  const getSignalQuality = (signal: number | null) => {
    if (!signal) return { label: "N/A", color: "text-gray-500" }
    if (signal >= -20) return { label: "Excellent", color: "text-green-600" }
    if (signal >= -25) return { label: "Good", color: "text-blue-600" }
    if (signal >= -28) return { label: "Fair", color: "text-yellow-600" }
    return { label: "Poor", color: "text-red-600" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All ONTs ({onts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial Number</TableHead>
                <TableHead>OLT/Port</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No ONTs found. Add your first ONT to get started.
                  </TableCell>
                </TableRow>
              ) : (
                onts.map((ont) => {
                  const signalQuality = getSignalQuality(ont.signalStrength)
                  return (
                    <TableRow key={ont.id}>
                      <TableCell className="font-medium font-mono text-sm">
                        {ont.serialNumber}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{ont.olt.name}</div>
                          <div className="text-gray-500 text-xs">Port {ont.port}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ont.status)}</TableCell>
                      <TableCell>
                        {ont.signalStrength ? (
                          <div className="flex items-center gap-2">
                            <Signal className="w-4 h-4" />
                            <div className="text-sm">
                              <div className="font-medium">{ont.signalStrength} dBm</div>
                              <div className={`text-xs ${signalQuality.color}`}>
                                {signalQuality.label}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{ont.customerName || "N/A"}</div>
                          {ont.customerPhone && (
                            <div className="text-gray-500 text-xs">{ont.customerPhone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {ont.servicePackage ? (
                          <Badge variant="outline">{ont.servicePackage}</Badge>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/onts/${ont.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/onts/${ont.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
