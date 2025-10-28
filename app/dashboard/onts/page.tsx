import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import ONTTable from "@/components/onts/ont-table"

export const dynamic = 'force-dynamic'

async function getONTs() {
  const onts = await prisma.oNT.findMany({
    include: {
      olt: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return onts
}

export default async function ONTsPage() {
  const onts = await getONTs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ONT Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage optical network terminals
          </p>
        </div>
        <Link href="/dashboard/onts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add ONT
          </Button>
        </Link>
      </div>

      <ONTTable onts={onts} />
    </div>
  )
}
