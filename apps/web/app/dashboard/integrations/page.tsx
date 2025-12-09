"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {  Slack, Trello } from "lucide-react" 
// Note: Lucide might not have Jira/Slack specifically in all versions, using generics or specific icons if available. 
// Assuming standard Lucide set. Slack is usually there. Jira might not be, using visual placeholders or text.

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect with your favorite tools.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
             <div className="h-10 w-10 text-white bg-[#4A154B] rounded-md flex items-center justify-center font-bold">Sl</div>
            <div className="grid gap-1">
              <CardTitle>Slack</CardTitle>
              <CardDescription>Connect to Slack workspace</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Receive notifications and updates directly in your team's Slack channels.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Connect Slack</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="h-10 w-10 text-white bg-[#0052CC] rounded-md flex items-center justify-center font-bold">Ji</div>
            <div className="grid gap-1">
              <CardTitle>Jira</CardTitle>
              <CardDescription>Sync with Jira issues</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
              Automatically create and update Jira tickets from your repository activity.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Connect Jira</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
