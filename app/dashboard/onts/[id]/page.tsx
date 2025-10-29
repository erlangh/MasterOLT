import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Signal } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ONTDetailPage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = await params
  const ont = await prisma.oNT.findUnique({
    where: { id: id! },
    include: { olt: { select: { name: true } } },
  })

  if (!ont) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">ONT Not Found</h1>
        <Link href="/dashboard/onts">
          <Button>Back to ONTs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{ont.serialNumber}</h1>
          <p className="text-gray-500">OLT: {ont.olt.name} • Port {ont.port}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/onts/${ont.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Link href="/dashboard/onts">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <Badge>{ont.status}</Badge>
            </div>
            <div>
              <div className="text-sm text-gray-500">Signal Strength</div>
              {ont.signalStrength ? (
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4" />
                  <span className="text-sm">{ont.signalStrength} dBm</span>
                </div>
              ) : (
                <span className="text-sm">N/A</span>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-500">Customer</div>
              <div className="text-sm">{ont.customerName ?? 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Package</div>
              <div className="text-sm">{ont.servicePackage ?? 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}