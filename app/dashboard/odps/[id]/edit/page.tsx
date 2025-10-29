'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ODP {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  status: string
  oltId: string
  olt?: {
    id: string
    name: string
  }
}

interface OLT {
  id: string
  name: string
}

export default function EditODPPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [olts, setOlts] = useState<OLT[]>([])
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    capacity: '',
    status: 'active',
    oltId: ''
  })

  useEffect(() => {
    fetchODP()
    fetchOLTs()
  }, [])

  const fetchODP = async () => {
    try {
      const response = await fetch(`/api/odps/${params.id}`)
      if (response.ok) {
        const odp: ODP = await response.json()
        setFormData({
          name: odp.name,
          location: odp.location,
          latitude: odp.latitude.toString(),
          longitude: odp.longitude.toString(),
          capacity: odp.capacity.toString(),
          status: odp.status,
          oltId: odp.oltId
        })
      } else {
        alert('Failed to fetch ODP data')
      }
    } catch (error) {
      console.error('Error fetching ODP:', error)
      alert('Error fetching ODP data')
    } finally {
      setFetchLoading(false)
    }
  }

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
      const response = await fetch(`/api/odps/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          capacity: parseInt(formData.capacity),
          status: formData.status,
          oltId: formData.oltId
        }),
      })

      if (response.ok) {
        alert('ODP updated successfully!')
        router.push('/dashboard/odps')
      } else {
        const error = await response.json()
        alert(`Failed to update ODP: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating ODP:', error)
      alert('Error updating ODP')
    } finally {
      setLoading(false)
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
          <div className="text-lg">Loading ODP data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit ODP</h1>
        <p className="text-muted-foreground">Update ODP information</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>ODP Details</CardTitle>
          <CardDescription>
            Update the ODP information below
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
                  placeholder="Enter ODP name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="Enter latitude"
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
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="Enter longitude"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Enter capacity"
                />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="olt">OLT *</Label>
              <Select value={formData.oltId} onValueChange={(value) => handleInputChange('oltId', value)}>
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update ODP'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/odps')}
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