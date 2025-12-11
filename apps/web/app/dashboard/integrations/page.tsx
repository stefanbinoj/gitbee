"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Puzzle } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description:
        "Receive notifications and updates directly in your team's Slack channels",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
      status: "coming_soon",
    },
    {
      id: "jira",
      name: "Jira",
      description:
        "Sync issues and create tickets automatically from GitHub activity",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg",
      status: "coming_soon",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Puzzle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                  Integrations
                </CardTitle>
                <p className="text-sm text-neutral-400 mt-1">
                  Connect GitBee with your favorite tools and services
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {integrations.map((integration, index) => (
            <div key={integration.id}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Logo Area */}
                <div className="h-16 w-16 flex-shrink-0 flex items-center justify-center bg-white rounded-xl p-3 shadow-sm">
                  <img
                    src={integration.logo}
                    alt={`${integration.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content Area */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {integration.name}
                  </h3>
                  <p className="text-neutral-400 text-sm md:text-base">
                    {integration.description}
                  </p>
                </div>

                {/* Action Area */}
                <div className="flex-shrink-0 w-full md:w-auto min-w-[140px]">
                  {integration.status === "connected" ? (
                    <Button
                      variant="outline"
                      className="w-full border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-400 bg-green-500/10 h-11"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Connected
                    </Button>
                  ) : integration.status === "coming_soon" ? (
                    <Button
                      disabled
                      className="w-full bg-yellow-500/10 text-yellow-500 border-yellow-500/20 cursor-not-allowed h-11 border disabled:opacity-100 disabled:text-yellow-500"
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold h-11 transition-colors">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              {index < integrations.length - 1 && (
                <div className="h-px bg-neutral-800 my-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
