import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/olts - Get all OLTs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const olts = await prisma.oLT.findMany({
      select: {
        id: true,
        name: true,
        ipAddress: true,
        location: true,
        status: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(olts)
  } catch (error) {
    console.error('Error fetching OLTs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}