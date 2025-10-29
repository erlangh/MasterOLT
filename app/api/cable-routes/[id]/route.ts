import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/cable-routes/[id] - Get single cable route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cableRoute = await prisma.cableRoute.findUnique({
      where: { id: params.id }
    })

    if (!cableRoute) {
      return NextResponse.json({ error: 'Cable route not found' }, { status: 404 })
    }

    return NextResponse.json(cableRoute)
  } catch (error) {
    console.error('Error fetching cable route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/cable-routes/[id] - Update cable route
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
    const { name, description, startPoint, endPoint, coordinates, status, cableType } = body

    // Validate required fields
    if (!name || !startPoint || !endPoint || !coordinates) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, startPoint, endPoint, coordinates' 
      }, { status: 400 })
    }

    // Validate coordinates format
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return NextResponse.json({ 
        error: 'Coordinates must be an array with at least 2 points' 
      }, { status: 400 })
    }

    // Check if cable route exists
    const existingCableRoute = await prisma.cableRoute.findUnique({
      where: { id: params.id }
    })

    if (!existingCableRoute) {
      return NextResponse.json({ error: 'Cable route not found' }, { status: 404 })
    }

    // Update cable route
    const updatedCableRoute = await prisma.cableRoute.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
        startPoint,
        endPoint,
        coordinates,
        status: status || 'active',
        cableType: cableType || 'fiber'
      }
    })

    return NextResponse.json(updatedCableRoute)
  } catch (error) {
    console.error('Error updating cable route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/cable-routes/[id] - Delete cable route
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if cable route exists
    const existingCableRoute = await prisma.cableRoute.findUnique({
      where: { id: params.id }
    })

    if (!existingCableRoute) {
      return NextResponse.json({ error: 'Cable route not found' }, { status: 404 })
    }

    // Delete cable route
    await prisma.cableRoute.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Cable route deleted successfully' })
  } catch (error) {
    console.error('Error deleting cable route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}