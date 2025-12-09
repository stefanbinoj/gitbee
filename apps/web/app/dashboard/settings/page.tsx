"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Bell, 
  Brain, 
  Palette, 
  Shield, 
  User, 
  Mail, 
  MessageSquare,
  Zap,
  Globe,
  AlertTriangle,
  Trash2,
  RotateCcw
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-base font-semibold text-white">Profile</CardTitle>
              <CardDescription className="text-neutral-400">Manage your account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-300">Display Name</Label>
              <Input 
                id="name" 
                defaultValue="Stefan Binoj" 
                className="bg-neutral-800 border-neutral-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input 
                id="email" 
                defaultValue="stefan@example.com" 
                className="bg-neutral-800 border-neutral-600 text-white"
              />
            </div>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-base font-semibold text-white">Notifications</CardTitle>
              <CardDescription className="text-neutral-400">Choose how you want to be notified</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifs" className="flex items-start gap-3 cursor-pointer">
              <Mail className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Email Notifications</span>
                <p className="text-sm text-neutral-400">Receive daily digests and important alerts via email</p>
              </div>
            </Label>
            <Switch id="email-notifs" defaultChecked className="data-[state=checked]:bg-yellow-500" />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label htmlFor="slack-notifs" className="flex items-start gap-3 cursor-pointer">
              <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Slack Notifications</span>
                <p className="text-sm text-neutral-400">Get real-time alerts in your Slack workspace</p>
              </div>
            </Label>
            <Switch id="slack-notifs" className="data-[state=checked]:bg-yellow-500" />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label htmlFor="error-alerts" className="flex items-start gap-3 cursor-pointer">
              <AlertTriangle className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Error Alerts</span>
                <p className="text-sm text-neutral-400">Immediately notify when GitBee encounters errors</p>
              </div>
            </Label>
            <Switch id="error-alerts" defaultChecked className="data-[state=checked]:bg-yellow-500" />
          </div>
        </CardContent>
      </Card>

      {/* AI Behavior Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-base font-semibold text-white">AI Behavior</CardTitle>
              <CardDescription className="text-neutral-400">Configure how GitBee responds to issues and PRs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-respond" className="flex items-start gap-3 cursor-pointer">
              <Zap className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Auto-Respond to Issues</span>
                <p className="text-sm text-neutral-400">Automatically respond to new issues within minutes</p>
              </div>
            </Label>
            <Switch id="auto-respond" defaultChecked className="data-[state=checked]:bg-yellow-500" />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label htmlFor="pr-reviews" className="flex items-start gap-3 cursor-pointer">
              <Shield className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">PR Review Comments</span>
                <p className="text-sm text-neutral-400">Provide code review suggestions on pull requests</p>
              </div>
            </Label>
            <Switch id="pr-reviews" defaultChecked className="data-[state=checked]:bg-yellow-500" />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label htmlFor="code-suggestions" className="flex items-start gap-3 cursor-pointer">
              <Brain className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Include Code Suggestions</span>
                <p className="text-sm text-neutral-400">Generate code snippets in responses when helpful</p>
              </div>
            </Label>
            <Switch id="code-suggestions" defaultChecked className="data-[state=checked]:bg-yellow-500" />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="space-y-3">
            <Label className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Response Tone</span>
                <p className="text-sm text-neutral-400">Choose the tone for AI-generated responses</p>
              </div>
            </Label>
            <div className="flex gap-2 ml-7">
              <Button variant="outline" className="border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                Professional
              </Button>
              <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent">
                Friendly
              </Button>
              <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent">
                Concise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository Settings */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-base font-semibold text-white">Repository Settings</CardTitle>
              <CardDescription className="text-neutral-400">Default settings for connected repositories</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-neutral-300">Default Response Language</Label>
            <Input 
              id="language" 
              defaultValue="English" 
              className="bg-neutral-800 border-neutral-600 text-white max-w-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exclude" className="text-neutral-300">Exclude File Patterns</Label>
            <Input 
              id="exclude" 
              defaultValue="*.test.js, *.spec.ts, node_modules/**" 
              placeholder="e.g., *.test.js, node_modules/**"
              className="bg-neutral-800 border-neutral-600 text-white"
            />
            <p className="text-xs text-neutral-500">Comma-separated patterns to exclude from AI analysis</p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-base font-semibold text-white">Appearance</CardTitle>
              <CardDescription className="text-neutral-400">Customize the dashboard interface</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex items-start gap-3 cursor-pointer">
              <div className="space-y-1">
                <span className="text-white">Dark Mode</span>
                <p className="text-sm text-neutral-400">Always use dark theme (recommended)</p>
              </div>
            </Label>
            <Switch id="dark-mode" defaultChecked disabled className="data-[state=checked]:bg-yellow-500 opacity-50" />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-motion" className="flex items-start gap-3 cursor-pointer">
              <div className="space-y-1">
                <span className="text-white">Reduce Motion</span>
                <p className="text-sm text-neutral-400">Disable animations and transitions</p>
              </div>
            </Label>
            <Switch id="reduce-motion" className="data-[state=checked]:bg-yellow-500" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-neutral-900 border-red-500/30 border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <CardTitle className="text-base font-semibold text-red-500">Danger Zone</CardTitle>
              <CardDescription className="text-neutral-400">Irreversible actions - proceed with caution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Reset AI Memory</p>
              <p className="text-xs text-neutral-400">Clear all learned context and start fresh</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Disconnect All Repositories</p>
              <p className="text-xs text-neutral-400">Remove GitBee from all connected repositories</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-transparent">
              <Trash2 className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
