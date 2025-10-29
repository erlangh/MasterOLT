import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

// Server action at module scope
async function createONT(formData: FormData) {
  'use server'
  const serialNumber = String(formData.get('serialNumber') || '')
  const oltId = String(formData.get('oltId') || '')
  const portRaw = formData.get('port')
  const port = portRaw ? Number(portRaw) : 1
  const status = String(formData.get('status') || 'PENDING') as any

  await prisma.oNT.create({
    data: {
      serialNumber,
      oltId,
      port,
      status,
    },
  })

  redirect('/dashboard/onts')
}

export default async function ONTNewPage() {
  const olts = await prisma.oLT.findMany({ select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add ONT</h1>
        <Link href="/dashboard/onts">
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New ONT</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createONT} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" required />
            </div>
            <div>
              <Label>OLT</Label>
              <Select name="oltId">
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
              <Input id="port" name="port" type="number" min={1} defaultValue={1} />
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" defaultValue="PENDING">
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
            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}