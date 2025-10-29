import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export const dynamic = 'force-dynamic'

// Define server action at module scope to avoid client boundary closures
async function updateOLT(formData: FormData) {
  'use server'
  const id = String(formData.get('id') || '')
  if (!id) {
    redirect('/dashboard/olts')
  }

  const name = String(formData.get('name') || '')
  const ipAddress = String(formData.get('ipAddress') || '')
  const model = String(formData.get('model') || '')
  const vendor = String(formData.get('vendor') || '')
  const location = String(formData.get('location') || '')
  const status = String(formData.get('status') || '') as any
  const firmwareVersion = String(formData.get('firmwareVersion') || '')
  const totalPortsRaw = formData.get('totalPorts')
  const totalPorts = totalPortsRaw ? Number(totalPortsRaw) : undefined
  const description = String(formData.get('description') || '')

  await prisma.oLT.update({
    where: { id },
    data: {
      name,
      ipAddress,
      model,
      vendor,
      location,
      status,
      firmwareVersion: firmwareVersion || null,
      ...(typeof totalPorts === 'number' ? { totalPorts } : {}),
      description: description || null,
    },
  })

  redirect(`/dashboard/olts/${id}`)
}

export default async function OLTEditPage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const olt = await prisma.oLT.findUnique({ where: { id } })

  if (!olt) {
    redirect('/dashboard/olts')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit OLT</h1>
        <Link href={`/dashboard/olts/${id}`}>
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateOLT} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="hidden" name="id" value={id!} />
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={olt!.name} required />
            </div>
            <div>
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input id="ipAddress" name="ipAddress" defaultValue={olt!.ipAddress} required />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" defaultValue={olt!.model} required />
            </div>
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input id="vendor" name="vendor" defaultValue={olt!.vendor} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={olt!.location} required />
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" defaultValue={olt!.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONLINE">ONLINE</SelectItem>
                  <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                  <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="firmwareVersion">Firmware Version</Label>
              <Input id="firmwareVersion" name="firmwareVersion" defaultValue={olt!.firmwareVersion ?? ''} />
            </div>
            <div>
              <Label htmlFor="totalPorts">Total Ports</Label>
              <Input id="totalPorts" name="totalPorts" type="number" min={1} defaultValue={olt!.totalPorts} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={olt!.description ?? ''} />
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