"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your dashboard preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Review how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal text-muted-foreground">Receive daily summaries via email.</span>
            </Label>
            <Switch id="email-notifs" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="font-normal text-muted-foreground">Receive updates about new features.</span>
            </Label>
            <Switch id="marketing-emails" />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the interface.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="font-normal text-muted-foreground">Force dark mode throughout the app.</span>
            </Label>
            <Switch id="dark-mode" defaultChecked />
          </div>
           <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="animations" className="flex flex-col space-y-1">
              <span>Reduce Motion</span>
              <span className="font-normal text-muted-foreground">Disable smooth transitions.</span>
            </Label>
            <Switch id="animations" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
