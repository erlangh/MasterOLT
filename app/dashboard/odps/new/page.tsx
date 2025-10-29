"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OLT {
  id: string
  name: string
}

export default function NewOdpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    oltId: '',
    capacity: '8',
    status: 'ACTIVE'
  })
  const [loading, setLoading] = useState(false)
  const [olts, setOlts] = useState<OLT[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.latitude || isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Valid latitude is required'
    } else {
      const lat = Number(formData.latitude)
      if (lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90'
      }
    }

    if (!formData.longitude || isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Valid longitude is required'
    } else {
      const lng = Number(formData.longitude)
      if (lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180'
      }
    }

    if (formData.capacity && isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetchOLTs()
  }, [])

  const fetchOLTs = async () => {
    try {
      const response = await fetch('/api/olts')
      if (response.ok) {
        const data = await response.json()
        setOlts(data)
      }
    } catch (error) {
      console.error('Error fetching OLTs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/odps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          capacity: parseInt(formData.capacity)
        }),
      })

      if (response.ok) {
        router.push('/dashboard/odps')
      } else {
        alert('Error creating ODP')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating ODP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New ODP</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create a new Optical Distribution Point
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ODP Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ODP - Jakarta Pusat"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Jl. Sudirman No. 123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="-6.2088"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="106.8456"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Select value={formData.capacity} onValueChange={(value) => setFormData(prev => ({ ...prev, capacity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 Ports</SelectItem>
                    <SelectItem value="8">8 Ports</SelectItem>
                    <SelectItem value="16">16 Ports</SelectItem>
                    <SelectItem value="32">32 Ports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="oltId">OLT *</Label>
                <Select value={formData.oltId} onValueChange={(value) => setFormData(prev => ({ ...prev, oltId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OLT" />
                  </SelectTrigger>
                  <SelectContent>
                    {olts.map((olt) => (
                      <SelectItem key={olt.id} value={olt.id}>
                        {olt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create ODP'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}