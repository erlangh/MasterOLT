"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings as SettingsIcon, Bell, Shield, Database, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState({
    company_name: '',
    timezone: 'Asia/Jakarta',
    language: 'English',
    snmp_community: '',
    snmp_version: 'v2c',
    snmp_polling_interval: '300',
    smtp_server: '',
    smtp_port: '587',
    smtp_email: '',
    smtp_password: '',
    session_timeout: '30',
    password_policy: 'Minimum 8 characters'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert(`${section} settings saved successfully!`)
      } else {
        alert('Error saving settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure system preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Basic system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="SmartOLT Management"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input 
                id="timezone" 
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input 
                id="language" 
                value={settings.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleSave('General')}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive alerts via email</div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Critical Alarms Only</div>
                <div className="text-sm text-gray-500">Only notify for critical issues</div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Daily Summary</div>
                <div className="text-sm text-gray-500">Daily network status report</div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Access and security configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout</Label>
              <Input defaultValue="30 minutes" />
            </div>
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <Input defaultValue="Minimum 8 characters" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">Add extra security layer</div>
              </div>
              <Button variant="outline" size="sm">
                Setup
              </Button>
            </div>
            <Button className="w-full">Update Security</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <CardTitle>Database</CardTitle>
            </div>
            <CardDescription>Database maintenance and backup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">Database Status</div>
                <div className="text-sm text-gray-500">PostgreSQL 16</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Backup Database
              </Button>
              <Button variant="outline" className="w-full">
                Optimize Database
              </Button>
              <Button variant="outline" className="w-full text-red-600">
                Reset Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SNMP Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              <CardTitle>SNMP Configuration</CardTitle>
            </div>
            <CardDescription>SNMP monitoring settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Community String</Label>
              <Input 
                type="password" 
                value={settings.snmp_community}
                onChange={(e) => handleInputChange('snmp_community', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>SNMP Version</Label>
              <Input 
                value={settings.snmp_version}
                onChange={(e) => handleInputChange('snmp_version', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Polling Interval (seconds)</Label>
              <Input 
                type="number" 
                value={settings.snmp_polling_interval}
                onChange={(e) => handleInputChange('snmp_polling_interval', e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => handleSave('SNMP')}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save SNMP Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <CardTitle>Email Configuration</CardTitle>
            </div>
            <CardDescription>SMTP server settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Server</Label>
              <Input 
                placeholder="smtp.gmail.com"
                value={settings.smtp_server}
                onChange={(e) => handleInputChange('smtp_server', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input 
                type="number" 
                value={settings.smtp_port}
                onChange={(e) => handleInputChange('smtp_port', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="alerts@smartolt.com"
                value={settings.smtp_email}
                onChange={(e) => handleInputChange('smtp_email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password"
                value={settings.smtp_password}
                onChange={(e) => handleInputChange('smtp_password', e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => handleSave('Email')}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Test & Save'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
