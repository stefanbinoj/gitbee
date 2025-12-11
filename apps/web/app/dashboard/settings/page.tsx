"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Brain, Shield, Mail, MessageSquare, Zap } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                General
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="email-notifs"
              className="flex items-start gap-3 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Email Notifications</span>
                <p className="text-sm text-neutral-400">
                  Receive daily digests and important alerts via email
                </p>
              </div>
            </Label>
            <Switch
              id="email-notifs"
              defaultChecked
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="slack-notifs"
              className="flex items-start gap-3 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Slack Notifications</span>
                <p className="text-sm text-neutral-400">
                  Get real-time alerts in your Slack workspace
                </p>
              </div>
            </Label>
            <Switch
              id="slack-notifs"
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
          <div className="h-px bg-neutral-800" />
        </CardContent>
      </Card>

      {/* AI Behavior Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                AI BEHAVIOR
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Configure how GitBee responds to issues and PRs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="auto-respond"
              className="flex items-start gap-3 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Auto-Respond to Issues</span>
                <p className="text-sm text-neutral-400">
                  Automatically respond to new issues within minutes
                </p>
              </div>
            </Label>
            <Switch
              id="auto-respond"
              defaultChecked
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="pr-reviews"
              className="flex items-start gap-3 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">PR Review Comments</span>
                <p className="text-sm text-neutral-400">
                  Provide code review suggestions on pull requests
                </p>
              </div>
            </Label>
            <Switch
              id="pr-reviews"
              defaultChecked
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="space-y-3">
            <Label className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Response Tone</span>
                <p className="text-sm text-neutral-400">
                  Choose the tone for AI-generated responses
                </p>
              </div>
            </Label>
            <div className="flex gap-2 ml-7">
              <Button
                variant="outline"
                className="border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
              >
                Professional
              </Button>
              <Button
                variant="outline"
                className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent"
              >
                Friendly
              </Button>
              <Button
                variant="outline"
                className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent"
              >
                Concise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
