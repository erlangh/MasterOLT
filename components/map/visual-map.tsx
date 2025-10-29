"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type LatLng = { lat: number; lng: number; label?: string }

interface VisualMapProps {
  center?: LatLng
  zoom?: number
  markers?: LatLng[]
  routes?: { points: LatLng[]; color?: string }[]
  height?: number
}

export default function VisualMap({
  center = { lat: -6.2088, lng: 106.8456 },
  zoom = 11,
  markers = [],
  routes = [],
  height = 480,
}: VisualMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    if (!instanceRef.current) {
      instanceRef.current = L.map(mapRef.current).setView([center.lat, center.lng], zoom)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(instanceRef.current)
    }

    const map = instanceRef.current
    if (!map) return

    const layerGroup = L.layerGroup().addTo(map)

    // Add markers
    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng])
      if (m.label) marker.bindPopup(m.label)
      marker.addTo(layerGroup)
    })

    // Add routes (polylines)
    routes.forEach((r) => {
      const latlngs = r.points.map((p) => [p.lat, p.lng]) as [number, number][]
      L.polyline(latlngs, { color: r.color || "#2563eb", weight: 4 }).addTo(layerGroup)
    })

    return () => {
      map.removeLayer(layerGroup)
    }
  }, [center.lat, center.lng, zoom, markers, routes])

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
    />
  )
}