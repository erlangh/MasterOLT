import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/cable-routes - Get all cable routes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cableRoutes = await prisma.cableRoute.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(cableRoutes)
  } catch (error) {
    console.error('Error fetching cable routes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/cable-routes - Create new cable route
export async function POST(request: NextRequest) {
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

    // Create cable route
    const cableRoute = await prisma.cableRoute.create({
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

    return NextResponse.json(cableRoute, { status: 201 })
  } catch (error) {
    console.error('Error creating cable route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}