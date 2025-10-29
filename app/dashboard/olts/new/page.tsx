import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

// Server action defined at module scope to avoid client boundary issues
async function createOLT(formData: FormData) {
  'use server'
  
  const name = String(formData.get('name') || '')
  const ipAddress = String(formData.get('ipAddress') || '')
  const model = String(formData.get('model') || '')
  const vendor = String(formData.get('vendor') || '')
  const location = String(formData.get('location') || '')
  const status = String(formData.get('status') || 'OFFLINE') as any
  const totalPorts = Number(formData.get('totalPorts') || 16)

  await prisma.oLT.create({
    data: {
      name,
      ipAddress,
      model,
      vendor,
      location,
      status,
      totalPorts,
    },
  })

  redirect('/dashboard/olts')
}

export default function OLTNewPage() {
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add OLT</h1>
        <Link href="/dashboard/olts" className="text-sm underline">Cancel</Link>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">New OLT</h2>
        </div>
        <div className="p-6">
          <form action={createOLT} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input id="name" name="name" required className="border rounded-md h-9 px-3 bg-background w-full" />
            </div>
            <div>
              <label htmlFor="ipAddress" className="text-sm font-medium">IP Address</label>
              <input id="ipAddress" name="ipAddress" required className="border rounded-md h-9 px-3 bg-background w-full" />
            </div>
            <div>
              <label htmlFor="model" className="text-sm font-medium">Model</label>
              <input id="model" name="model" required className="border rounded-md h-9 px-3 bg-background w-full" />
            </div>
            <div>
              <label htmlFor="vendor" className="text-sm font-medium">Vendor</label>
              <input id="vendor" name="vendor" required className="border rounded-md h-9 px-3 bg-background w-full" />
            </div>
            <div>
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <input id="location" name="location" required className="border rounded-md h-9 px-3 bg-background w-full" />
            </div>
            <div>
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select id="status" name="status" defaultValue="OFFLINE" className="border rounded-md h-9 px-3 bg-background">
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
            <div>
              <label htmlFor="totalPorts" className="text-sm font-medium">Total Ports</label>
              <input id="totalPorts" name="totalPorts" type="number" min={1} defaultValue={16} className="border rounded-md h-9 px-3 bg-background w-full" />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end">
              <button type="submit" className="bg-primary text-primary-foreground rounded-md px-4 h-9">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}