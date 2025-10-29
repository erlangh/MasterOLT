'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewCableRoutePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startPoint: '',
    endPoint: '',
    coordinates: '',
    status: 'active',
    cableType: 'fiber'
  })
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      // Parse coordinates from string to array
      let coordinatesArray = []
      try {
        coordinatesArray = JSON.parse(formData.coordinates)
        if (!Array.isArray(coordinatesArray)) {
          throw new Error('Coordinates must be an array')
        }
      } catch (error) {
        alert('Invalid coordinates format. Please use JSON array format: [[lat1,lng1],[lat2,lng2],...]')
        setLoading(false)
        return
      }

      const response = await fetch('/api/cable-routes', {
        method: 'POST',
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
        alert('Cable Route created successfully!')
        router.push('/dashboard/cable-routes')
      } else {
        const error = await response.json()
        alert(`Failed to create Cable Route: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating cable route:', error)
      setErrors({ submit: 'Failed to create cable route. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Cable Route</h1>
        <p className="text-muted-foreground">Create a new cable route</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Cable Route Details</CardTitle>
          <CardDescription>
            Enter the cable route information below
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
                  className={errors.name ? 'border-red-500' : ''}
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                  className={errors.startPoint ? 'border-red-500' : ''}
                  required
                />
                {errors.startPoint && <p className="text-sm text-red-500">{errors.startPoint}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endPoint">End Point *</Label>
                <Input
                  id="endPoint"
                  value={formData.endPoint}
                  onChange={(e) => handleInputChange('endPoint', e.target.value)}
                  placeholder="Enter end point"
                  className={errors.endPoint ? 'border-red-500' : ''}
                  required
                />
                {errors.endPoint && <p className="text-sm text-red-500">{errors.endPoint}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates *</Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder='[{"lat": -6.2088, "lng": 106.8456}, {"lat": -6.2100, "lng": 106.8470}]'
                className={errors.coordinates ? 'border-red-500' : ''}
                required
              />
              {errors.coordinates && <p className="text-sm text-red-500">{errors.coordinates}</p>}
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

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Cable Route'}
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