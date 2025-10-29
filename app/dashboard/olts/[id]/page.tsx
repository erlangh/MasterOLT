import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function OLTDetailPage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const olt = await prisma.oLT.findUnique({
    where: { id: id! },
    include: {
      _count: { select: { onts: true } },
    },
  })

  if (!olt) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">OLT Not Found</h1>
        <Link href="/dashboard/olts">
          <Button>Back to OLTs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{olt.name}</h1>
          <p className="text-gray-500">IP: {olt.ipAddress} • Model: {olt.model} • Vendor: {olt.vendor}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/olts/${olt.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Link href="/dashboard/olts">
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
              <div className="text-sm text-gray-500">Location</div>
              <div className="text-sm">{olt.location}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div>
                <Badge>{olt.status}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Firmware</div>
              <div className="text-sm">{olt.firmwareVersion ?? 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ports</div>
              <div className="text-sm">{olt._count.onts} / {olt.totalPorts}</div>
            </div>
            {olt.description && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Description</div>
                <div className="text-sm">{olt.description}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}