'use client'

import { useState, useEffect } from 'react'
import VisualMap from "@/components/map/visual-map"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"

interface ODP {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  status: string
  olt: {
    id: string
    name: string
  }
}

export default function OdpsPage() {
  const [odps, setOdps] = useState<ODP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchODPs()
  }, [])

  const fetchODPs = async () => {
    try {
      const response = await fetch('/api/odps')
      if (response.ok) {
        const data = await response.json()
        setOdps(data)
      }
    } catch (error) {
      console.error('Error fetching ODPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ODP "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/odps/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('ODP deleted successfully!')
        fetchODPs() // Refresh the list
      } else {
        const error = await response.json()
        alert(`Failed to delete ODP: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting ODP:', error)
      alert('Error deleting ODP')
    }
  }

   if (loading) {
     return (
       <div className="container mx-auto py-6">
         <div className="flex items-center justify-center h-64">
           <div className="text-lg">Loading ODPs...</div>
         </div>
       </div>
     )
   }

   const markers = odps.map(odp => ({
    lat: odp.latitude,
    lng: odp.longitude,
    label: odp.name,
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500'
      case 'INACTIVE': return 'bg-red-500'
      case 'MAINTENANCE': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ODPS</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visualisasi titik ODP di peta untuk mempermudah monitoring dan perencanaan jaringan.
          </p>
        </div>
        <Link href="/dashboard/odps/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New ODP
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peta ODPS</CardTitle>
          <CardDescription>Marker lokasi ODP ditampilkan pada peta</CardDescription>
        </CardHeader>
        <CardContent>
          <VisualMap center={{ lat: -6.2088, lng: 106.8456 }} zoom={10} markers={markers} height={520} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ODP List</CardTitle>
          <CardDescription>Manage your Optical Distribution Points</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>OLT</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {odps.map((odp) => (
                <TableRow key={odp.id}>
                  <TableCell className="font-medium">{odp.name}</TableCell>
                  <TableCell>{odp.location}</TableCell>
                  <TableCell>{odp.olt?.name || 'Not assigned'}</TableCell>
                  <TableCell>{odp.capacity} ports</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(odp.status)}>
                      {odp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {odp.latitude.toFixed(4)}, {odp.longitude.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/odps/${odp.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDelete(odp.id, odp.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}