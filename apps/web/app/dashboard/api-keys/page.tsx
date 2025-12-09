"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ApiKeysPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys for external services.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OpenRouter API Key</CardTitle>
          <CardDescription>
            Enter your OpenRouter API key to enable AI features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openrouter-key">API Key</Label>
            <div className="flex gap-2">
                <Input 
                    id="openrouter-key" 
                    placeholder="sk-or-..." 
                    type="password" 
                    className="font-mono"
                />
            </div>
            <p className="text-xs text-muted-foreground">
                Your key is encrypted and stored updates securely.
            </p>
          </div>
          <div className="flex justify-end">
             <Button>Save Key</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
