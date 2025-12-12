"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Puzzle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authClient, Session } from "@/lib/authClient";
import { api } from "@/lib/api";

export default function IntegrationsPage() {
  const { data: session } = authClient.useSession() as { data: Session | null };

  const { data: isGitHubConnected = false } = useQuery({
    queryKey: ["github-connection", session?.session?.githubAccountId],
    queryFn: async () => {
      if (!session?.session?.githubAccountId) {
        return false;
      }
      const response = await api.api.users
        .installations({
          githubAccountId: session.session.githubAccountId.toString(),
        })
        .get();

      return response.data?.isInstalled;
    },
    enabled: !!session?.session?.githubAccountId,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-full">
            <Puzzle className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-neutral-300 tracking-wide">
              INTEGRATIONS
            </h2>
            <p className="text-sm text-neutral-400">
              Connect GitBee with your favorite tools and services
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* GitHub Integration */}
        <Card className="bg-neutral-900 border-neutral-700">
          <div className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 flex items-center justify-center bg-white rounded-xl p-3 shadow-sm">
                <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <CardTitle className="text-lg font-semibold text-white">
                GitHub
              </CardTitle>
              <CardDescription className="text-neutral-400 text-sm md:text-base">
                Connect your GitHub repositories to enable automated code
                reviews and issue moderation.
              </CardDescription>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto min-w-[140px]">
              {isGitHubConnected ? (
                <Button
                  variant="outline"
                  className="w-full border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-400 bg-green-500/10 h-11"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Connected
                </Button>
              ) : (
                <Button
                  className="w-full bg-white hover:bg-neutral-200 text-black h-11 transition-colors font-medium cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://github.com/apps/gitbeeai";
                  }}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Slack Integration */}
        <Card className="bg-neutral-900 border-neutral-700">
          <div className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 flex items-center justify-center bg-white rounded-xl p-3 shadow-sm">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg"
                  alt="Slack logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <CardTitle className="text-lg font-semibold text-white">
                Slack
              </CardTitle>
              <CardDescription className="text-neutral-400 text-sm md:text-base">
                Receive notifications and updates directly in your team's Slack
                channels.
              </CardDescription>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto min-w-[140px]">
              <Button
                disabled
                className="w-full bg-yellow-500/10 text-yellow-500 border-yellow-500/20 cursor-not-allowed h-11 border disabled:opacity-100 disabled:text-yellow-500"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </Card>

        {/* Jira Integration */}
        <Card className="bg-neutral-900 border-neutral-700">
          <div className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 flex items-center justify-center bg-white rounded-xl p-3 shadow-sm">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg"
                  alt="Jira logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <CardTitle className="text-lg font-semibold text-white">
                Jira
              </CardTitle>
              <CardDescription className="text-neutral-400 text-sm md:text-base">
                Sync issues and create tickets automatically from GitHub
                activity.
              </CardDescription>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto min-w-[140px]">
              <Button
                disabled
                className="w-full bg-yellow-500/10 text-yellow-500 border-yellow-500/20 cursor-not-allowed h-11 border disabled:opacity-100 disabled:text-yellow-500"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </Card>

        {/* Linear Integration */}
        <Card className="bg-neutral-900 border-neutral-700">
          <div className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 flex items-center justify-center bg-white rounded-xl p-3 shadow-sm">
                <img
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQ0ODg4IDisZFRkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIABwAHAMBIgACEQEDEQH/xAAZAAEAAgMAAAAAAAAAAAAAAAAHBggBAgT/xAArEAABBAAEBQIHAQAAAAAAAAABAgMEEQAFEiEGEzFBkSJxBxQyQlFSgSP/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ADfK4knNMwjwILfNkyF6G0WBZ9z5wtZb8GEGMDmmcrEgjdEZoaUn8Wrc+BiAcAfKl+XzUIlPKQAYVaXVtg2VsOfa6lQSQO9e2GThzirmJYhzpIkl4Ewp4TpEtI6pUPtdTR1J70SO4FBbxx8PMy4WYM1t5M7LgQFPIRpU1fTUnfbtYPjbEHK98Wfny2ZcZ6JKbDjD6C24hXRSSKI8Yq4+jkvuM69fLWUav2o1eA7MhzJqDIUiUFGK9p1qbNLaUm9LiT2Is/wnYiwZ/DmJkakeiYqQOY40wrSJ4TX+zJv0SEbWm96G/wBKiUAnGKG+w364Baznj0QMrcjNSUTpqmx8rKboakm/U4nqhaa3TW5qqshJSDQAHbGl1jBJwH//2Q=="
                  alt="Linear logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <CardTitle className="text-lg font-semibold text-white">
                Linear
              </CardTitle>
              <CardDescription className="text-neutral-400 text-sm md:text-base">
                Streamline your issue tracking and project management with
                two-way sync.
              </CardDescription>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto min-w-[140px]">
              <Button
                disabled
                className="w-full bg-yellow-500/10 text-yellow-500 border-yellow-500/20 cursor-not-allowed h-11 border disabled:opacity-100 disabled:text-yellow-500"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
