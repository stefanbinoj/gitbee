"use client";

import { authClient, type Session } from "@/lib/authClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = authClient.useSession() as { data: Session | null };

  if (!session?.user) {
    return null;
  }

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <User className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                Basic Details
              </CardTitle>
              <p className="text-sm text-neutral-400 mt-1">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 rounded-sm border border-neutral-800 bg-neutral-800/50">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback className="bg-neutral-800 text-neutral-200 text-3xl font-medium rounded-sm">
                  {session.user.name ? (
                    getInitials(session.user.name)
                  ) : (
                    <User />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Email
                </label>
                <div className="text-sm text-neutral-200 font-medium">
                  {session.user.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </label>
                <div className="text-sm text-neutral-200 font-medium uppercase">
                  Owner
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Organization
                </label>
                <div className="text-sm text-neutral-200 font-medium">
                  GitBee Inc.
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Name
                </label>
                <div className="text-sm text-neutral-200 font-medium">
                  {session.user.name || "Not set"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
