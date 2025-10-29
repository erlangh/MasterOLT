'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import VisualMap from "@/components/map/visual-map"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface CableRoute {
  id: string
  name: string
  description: string
  startPoint: string
  endPoint: string
  coordinates: number[][]
  status: string
  cableType: string
}

export default function CableRoutesPage() {
  const [cableRoutes, setCableRoutes] = useState<CableRoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCableRoutes()
  }, [])

  const fetchCableRoutes = async () => {
    try {
      const response = await fetch('/api/cable-routes')
      if (response.ok) {
        const data = await response.json()
        setCableRoutes(data)
      }
    } catch (error) {
      console.error('Error fetching cable routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete cable route "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/cable-routes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Cable route deleted successfully!')
        fetchCableRoutes() // Refresh the list
      } else {
        const error = await response.json()
        alert(`Failed to delete cable route: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting cable route:', error)
      alert('Error deleting cable route')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading cable routes...</div>
        </div>
      </div>
    )
  }

  const routes = cableRoutes.map((r) => ({
    points: r.coordinates.map(coord => ({ lat: coord[0], lng: coord[1] })),
    color: r.status === 'active' ? '#22c55e' : r.status === 'maintenance' ? '#f59e0b' : '#ef4444',
  }))

  const markers = routes.flatMap((rc) => rc.points)

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getCableTypeBadge = (cableType: string) => {
    const variants = {
      fiber: 'bg-blue-100 text-blue-800',
      copper: 'bg-orange-100 text-orange-800',
      coaxial: 'bg-purple-100 text-purple-800'
    }
    return variants[cableType as keyof typeof variants] || variants.fiber
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cable Routes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visualisasi rute kabel (fiber) sebagai polyline untuk membantu perencanaan dan troubleshooting.
          </p>
        </div>
        <Link href="/dashboard/cable-routes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Cable Route
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peta Cable Routes</CardTitle>
          <CardDescription>Rute fiber digambarkan sebagai garis dan titik</CardDescription>
        </CardHeader>
        <CardContent>
          <VisualMap center={{ lat: -6.2088, lng: 106.8456 }} zoom={10} markers={markers} routes={routes} height={520} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cable Routes List</CardTitle>
          <CardDescription>Manage your cable routes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Point</TableHead>
                <TableHead>End Point</TableHead>
                <TableHead>Cable Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cableRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.startPoint}</TableCell>
                  <TableCell>{route.endPoint}</TableCell>
                  <TableCell>
                    <Badge className={getCableTypeBadge(route.cableType)}>
                      {route.cableType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(route.status)}>
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{route.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/cable-routes/${route.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDelete(route.id, route.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {cableRoutes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No cable routes found. <Link href="/dashboard/cable-routes/new" className="text-primary hover:underline">Add your first cable route</Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}