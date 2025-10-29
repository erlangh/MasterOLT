import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const odps = await prisma.oDP.findMany({
      include: {
        olt: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(odps)
  } catch (error) {
    console.error('Error fetching ODPs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, latitude, longitude, oltId, capacity, status } = body

    // Validation
    if (!name || !location || !latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const odp = await prisma.oDP.create({
      data: {
        name,
        location,
        latitude,
        longitude,
        oltId: oltId || null,
        capacity: capacity || 8,
        status: status || 'ACTIVE',
      },
      include: {
        olt: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(odp, { status: 201 })
  } catch (error) {
    console.error('Error creating ODP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}