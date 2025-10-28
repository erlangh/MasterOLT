import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import OLTTable from "@/components/olts/olt-table"

export const dynamic = 'force-dynamic'

async function getOLTs() {
  const olts = await prisma.oLT.findMany({
    include: {
      _count: {
        select: { onts: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return olts
}

export default async function OLTsPage() {
  const olts = await getOLTs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">OLT Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage optical line terminals
          </p>
        </div>
        <Link href="/dashboard/olts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add OLT
          </Button>
        </Link>
      </div>

      <OLTTable olts={olts} />
    </div>
  )
}
