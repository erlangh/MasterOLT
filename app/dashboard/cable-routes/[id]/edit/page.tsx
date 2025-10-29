'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

export default function EditCableRoutePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startPoint: '',
    endPoint: '',
    coordinates: '',
    status: 'active',
    cableType: 'fiber'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.startPoint.trim()) {
      newErrors.startPoint = 'Start point is required'
    }

    if (!formData.endPoint.trim()) {
      newErrors.endPoint = 'End point is required'
    }

    if (!formData.coordinates.trim()) {
      newErrors.coordinates = 'Coordinates are required'
    } else {
      try {
        const coordinatesArray = JSON.parse(formData.coordinates)
        if (!Array.isArray(coordinatesArray)) {
          newErrors.coordinates = 'Coordinates must be a valid JSON array'
        } else if (coordinatesArray.length === 0) {
          newErrors.coordinates = 'At least one coordinate is required'
        } else {
          // Validate each coordinate has lat and lng
          for (let i = 0; i < coordinatesArray.length; i++) {
            const coord = coordinatesArray[i]
            if (!coord.lat || !coord.lng) {
              newErrors.coordinates = `Coordinate ${i + 1} must have lat and lng properties`
              break
            }
            if (typeof coord.lat !== 'number' || typeof coord.lng !== 'number') {
              newErrors.coordinates = `Coordinate ${i + 1} lat and lng must be numbers`
              break
            }
          }
        }
      } catch (error) {
        newErrors.coordinates = 'Coordinates must be valid JSON format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetchCableRoute()
  }, [])

  const fetchCableRoute = async () => {
    try {
      const response = await fetch(`/api/cable-routes/${params.id}`)
      if (response.ok) {
        const cableRoute: CableRoute = await response.json()
        setFormData({
          name: cableRoute.name,
          description: cableRoute.description || '',
          startPoint: cableRoute.startPoint,
          endPoint: cableRoute.endPoint,
          coordinates: JSON.stringify(cableRoute.coordinates),
          status: cableRoute.status,
          cableType: cableRoute.cableType
        })
      } else {
        alert('Failed to fetch cable route data')
      }
    } catch (error) {
      console.error('Error fetching cable route:', error)
      alert('Error fetching cable route data')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)

    try {
      // Parse coordinates from string to array
      const coordinatesArray = JSON.parse(formData.coordinates)

      const response = await fetch(`/api/cable-routes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          startPoint: formData.startPoint,
          endPoint: formData.endPoint,
          coordinates: coordinatesArray,
          status: formData.status,
          cableType: formData.cableType
        }),
      })

      if (response.ok) {
        router.push('/dashboard/cable-routes')
      } else {
        const error = await response.json()
        setErrors({ submit: `Failed to update cable route: ${error.message}` })
      }
    } catch (error) {
      console.error('Error updating cable route:', error)
      setErrors({ submit: 'Failed to update cable route. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading cable route data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Cable Route</h1>
        <p className="text-muted-foreground">Update cable route information</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Cable Route Details</CardTitle>
          <CardDescription>
            Update the cable route information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter cable route name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cableType">Cable Type</Label>
                <Select value={formData.cableType} onValueChange={(value) => handleInputChange('cableType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cable type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiber">Fiber Optic</SelectItem>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="coaxial">Coaxial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startPoint">Start Point *</Label>
                <Input
                  id="startPoint"
                  value={formData.startPoint}
                  onChange={(e) => handleInputChange('startPoint', e.target.value)}
                  placeholder="Enter start point"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endPoint">End Point *</Label>
                <Input
                  id="endPoint"
                  value={formData.endPoint}
                  onChange={(e) => handleInputChange('endPoint', e.target.value)}
                  placeholder="Enter end point"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates *</Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder='[[-6.2088, 106.8456], [-6.2100, 106.8470]]'
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter coordinates as JSON array: [[lat1,lng1],[lat2,lng2],...]
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Cable Route'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/cable-routes')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}