import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings as SettingsIcon, Bell, Shield, Database, Mail } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
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
                placeholder="SmartOLT Management"
                defaultValue="SmartOLT Management"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Asia/Jakarta" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" defaultValue="English" />
            </div>
            <Button className="w-full">Save Changes</Button>
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
              <Input type="password" defaultValue="public" />
            </div>
            <div className="space-y-2">
              <Label>SNMP Version</Label>
              <Input defaultValue="v2c" />
            </div>
            <div className="space-y-2">
              <Label>Polling Interval (seconds)</Label>
              <Input type="number" defaultValue="300" />
            </div>
            <Button className="w-full">Save SNMP Settings</Button>
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
              <Input placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input type="number" defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="alerts@smartolt.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" />
            </div>
            <Button className="w-full">Test & Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
