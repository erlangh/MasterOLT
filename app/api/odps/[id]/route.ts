import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/odps/[id] - Get single ODP
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const odp = await prisma.oDP.findUnique({
      where: { id: params.id },
      include: {
        olt: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!odp) {
      return NextResponse.json({ error: 'ODP not found' }, { status: 404 })
    }

    return NextResponse.json(odp)
  } catch (error) {
    console.error('Error fetching ODP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/odps/[id] - Update ODP
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, latitude, longitude, capacity, status, oltId } = body

    // Validate required fields
    if (!name || !location || latitude === undefined || longitude === undefined || !oltId) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, location, latitude, longitude, oltId' 
      }, { status: 400 })
    }

    // Check if OLT exists
    const oltExists = await prisma.oLT.findUnique({
      where: { id: oltId }
    })

    if (!oltExists) {
      return NextResponse.json({ error: 'OLT not found' }, { status: 400 })
    }

    // Check if ODP exists
    const existingODP = await prisma.oDP.findUnique({
      where: { id: params.id }
    })

    if (!existingODP) {
      return NextResponse.json({ error: 'ODP not found' }, { status: 404 })
    }

    // Update ODP
    const updatedODP = await prisma.oDP.update({
      where: { id: params.id },
      data: {
        name,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        capacity: capacity ? parseInt(capacity) : 24,
        status: status || 'active',
        oltId
      },
      include: {
        olt: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(updatedODP)
  } catch (error) {
    console.error('Error updating ODP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/odps/[id] - Delete ODP
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if ODP exists
    const existingODP = await prisma.oDP.findUnique({
      where: { id: params.id }
    })

    if (!existingODP) {
      return NextResponse.json({ error: 'ODP not found' }, { status: 404 })
    }

    // Delete ODP
    await prisma.oDP.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'ODP deleted successfully' })
  } catch (error) {
    console.error('Error deleting ODP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}