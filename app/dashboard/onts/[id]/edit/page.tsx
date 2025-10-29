import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export const dynamic = 'force-dynamic'

// Server action at module scope; receive id via form
async function updateONT(formData: FormData) {
  'use server'
  const id = String(formData.get('id') || '')
  if (!id) {
    redirect('/dashboard/onts')
  }
  const serialNumber = String(formData.get('serialNumber') || '')
  const oltId = String(formData.get('oltId') || '')
  const portRaw = formData.get('port')
  const port = portRaw ? Number(portRaw) : undefined
  const status = String(formData.get('status') || '') as any
  const customerName = String(formData.get('customerName') || '')
  const servicePackage = String(formData.get('servicePackage') || '')

  await prisma.oNT.update({
    where: { id },
    data: {
      serialNumber,
      oltId,
      ...(typeof port === 'number' ? { port } : {}),
      status,
      customerName: customerName || null,
      servicePackage: servicePackage || null,
    },
  })

  redirect(`/dashboard/onts/${id}`)
}

export default async function ONTEditPage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = await params
  if (!id) {
    redirect('/dashboard/onts')
  }
  const ont = await prisma.oNT.findUnique({ where: { id } })
  const olts = await prisma.oLT.findMany({ select: { id: true, name: true } })

  if (!ont) {
    redirect('/dashboard/onts')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit ONT</h1>
        <Link href={`/dashboard/onts/${id}`}>
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateONT} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="hidden" name="id" value={id!} />
            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" defaultValue={ont!.serialNumber} required />
            </div>
            <div>
              <Label>OLT</Label>
              <Select name="oltId" defaultValue={ont!.oltId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select OLT" />
                </SelectTrigger>
                <SelectContent>
                  {olts.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input id="port" name="port" type="number" min={1} defaultValue={ont!.port} />
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" defaultValue={ont!.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONLINE">ONLINE</SelectItem>
                  <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                  <SelectItem value="LOS">LOS</SelectItem>
                  <SelectItem value="POWER_OFF">POWER_OFF</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" name="customerName" defaultValue={ont!.customerName ?? ''} />
            </div>
            <div>
              <Label htmlFor="servicePackage">Service Package</Label>
              <Input id="servicePackage" name="servicePackage" defaultValue={ont!.servicePackage ?? ''} />
            </div>

            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}