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
import { Eye, Edit, Trash2, MapPin } from "lucide-react"
import Link from "next/link"

interface OLT {
  id: string
  name: string
  ipAddress: string
  model: string
  vendor: string
  location: string
  status: string
  firmwareVersion: string | null
  totalPorts: number
  _count: {
    onts: number
  }
}

interface OLTTableProps {
  olts: OLT[]
}

export default function OLTTable({ olts }: OLTTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      ONLINE: "default",
      OFFLINE: "destructive",
      MAINTENANCE: "secondary",
      ERROR: "destructive",
    }

    const colors: Record<string, string> = {
      ONLINE: "bg-green-500 hover:bg-green-600",
      OFFLINE: "bg-red-500 hover:bg-red-600",
      MAINTENANCE: "bg-yellow-500 hover:bg-yellow-600",
      ERROR: "bg-red-600 hover:bg-red-700",
    }

    return (
      <Badge className={colors[status] || ""}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All OLTs ({olts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ONTs</TableHead>
                <TableHead>Firmware</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {olts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No OLTs found. Add your first OLT to get started.
                  </TableCell>
                </TableRow>
              ) : (
                olts.map((olt) => (
                  <TableRow key={olt.id}>
                    <TableCell className="font-medium">{olt.name}</TableCell>
                    <TableCell className="font-mono text-sm">{olt.ipAddress}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{olt.model}</div>
                        <div className="text-gray-500 text-xs">{olt.vendor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {olt.location}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(olt.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {olt._count.onts} / {olt.totalPorts}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {olt.firmwareVersion || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/olts/${olt.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/olts/${olt.id}/edit`}>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
