"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Brain,
  Shield,
  MessageSquare,
  UserPlus,
  Ban,
  XCircle,
  Scale,
  Settings,
  Users,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient, type Session } from "@/lib/authClient";

type Strictness = "low" | "medium" | "high";
type ResponseTone = "professional" | "friendly";

interface SettingsData {
  autoAssign: boolean;
  blockUser: boolean;
  autoCloseIrrelevantIssues: boolean;
  autoCloseIrrelevantPRs: boolean;
  reviewCommentsForPRs: boolean;
  strictness: Strictness;
  responseTone: ResponseTone;
  moderateMembers: boolean;
  warningCount: number;
}

const defaultSettings: SettingsData = {
  autoAssign: false,
  blockUser: true,
  autoCloseIrrelevantIssues: true,
  autoCloseIrrelevantPRs: true,
  reviewCommentsForPRs: false,
  strictness: "medium",
  responseTone: "friendly",
  moderateMembers: false,
  warningCount: 0,
};

export default function SettingsPage() {
  const { data: session } = authClient.useSession() as {
    data: Session | null;
  };
  const queryClient = useQueryClient();
  const [localWarningCount, setLocalWarningCount] = useState<number | null>(
    null
  );

  const githubAccountId = session?.session?.githubAccountId;

  const {
    data: settings = defaultSettings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["settings", githubAccountId],
    queryFn: async () => {
      if (!githubAccountId) return defaultSettings;

      const response = await api.api.users
        .settings({
          githubAccountId: String(githubAccountId),
        })
        .get();

      return response.data?.settings ?? defaultSettings;
    },
    enabled: !!githubAccountId,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<SettingsData>) => {
      if (!githubAccountId) throw new Error("No GitHub account ID");

      await api.api.users
        .settings({
          githubAccountId: String(githubAccountId),
        })
        .put(updates);
    },
    onError: () => {
      toast.error("Failed to update setting");
    },
    onSuccess: () => {
      toast.success("Setting updated");
      queryClient.invalidateQueries({
        queryKey: ["settings", githubAccountId],
      });
    },
  });

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load settings</p>
      </div>
    );
  }

  const isSaving = updateSettingsMutation.isPending;
  const savingKey = updateSettingsMutation.variables
    ? Object.keys(updateSettingsMutation.variables)[0]
    : null;

  return (
    <div className="space-y-6">
      {/* General Section */}
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
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="slack-notifs"
              className="flex items-start gap-3 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white">Slack Notifications</span>
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10 text-[10px] h-5 px-1.5"
                  >
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-sm text-neutral-400">
                  Get weekly digests and important alerts via Slack
                </p>
              </div>
            </Label>
            <Switch
              id="slack-notifs"
              disabled
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="auto-assign"
              className="flex items-start gap-3 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Auto Assign</span>
                <p className="text-sm text-neutral-400">
                  Assign to new contributors if they ask
                </p>
              </div>
            </Label>
            <Switch
              id="auto-assign"
              checked={settings.autoAssign}
              onCheckedChange={(checked) =>
                updateSetting("autoAssign", checked)
              }
              disabled={isSaving && savingKey === "autoAssign"}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="block-user"
              className="flex items-start gap-3 cursor-pointer"
            >
              <Ban className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Block User</span>
                <p className="text-sm text-neutral-400">
                  Permission to block toxic users
                </p>
              </div>
            </Label>
            <Switch
              id="block-user"
              checked={settings.blockUser}
              onCheckedChange={(checked) => updateSetting("blockUser", checked)}
              disabled={isSaving && savingKey === "blockUser"}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="slack-block-confirm"
              className="flex items-start gap-3 cursor-pointer "
            >
              <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white">Slack Confirmation</span>
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10 text-[10px] h-5 px-1.5"
                  >
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-sm text-neutral-400">
                  Confirm blocking users via Slack
                </p>
              </div>
            </Label>
            <Switch
              id="slack-block-confirm"
              disabled
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="auto-close-issue"
              className="flex items-start gap-3 cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Auto Close Irrelevant Issue</span>
                <p className="text-sm text-neutral-400">
                  Automatically close issues deemed irrelevant
                </p>
              </div>
            </Label>
            <Switch
              id="auto-close-issue"
              checked={settings.autoCloseIrrelevantIssues}
              onCheckedChange={(checked) =>
                updateSetting("autoCloseIrrelevantIssues", checked)
              }
              disabled={isSaving && savingKey === "autoCloseIrrelevantIssues"}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="auto-close-pr"
              className="flex items-start gap-3 cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Auto Close Irrelevant PR</span>
                <p className="text-sm text-neutral-400">
                  Automatically close PRs deemed irrelevant
                </p>
              </div>
            </Label>
            <Switch
              id="auto-close-pr"
              checked={settings.autoCloseIrrelevantPRs}
              onCheckedChange={(checked) =>
                updateSetting("autoCloseIrrelevantPRs", checked)
              }
              disabled={isSaving && savingKey === "autoCloseIrrelevantPRs"}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
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
                  Check for proffesionality and guidelines adherence in PRs
                </p>
              </div>
            </Label>
            <Switch
              id="pr-reviews"
              checked={settings.reviewCommentsForPRs}
              onCheckedChange={(checked) =>
                updateSetting("reviewCommentsForPRs", checked)
              }
              disabled={isSaving && savingKey === "reviewCommentsForPRs"}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="space-y-3">
            <Label className="flex items-start gap-3">
              <Scale className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white">Strictness to Follow Rules</span>
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10 text-[10px] h-5 px-1.5"
                  >
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-sm text-neutral-400">
                  Set how strictly the AI should adhere to guidelines
                </p>
              </div>
            </Label>
            <div className="flex flex-wrap gap-2 ml-0 sm:ml-7">
              {(["high", "medium", "low"] as const).map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  disabled
                  onClick={() => updateSetting("strictness", level)}
                  className={`border-neutral-700 hover:bg-neutral-800 hover:text-white bg-transparent ${
                    settings.strictness === level
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                      : "text-neutral-400"
                  }`}
                >
                  {level === "high"
                    ? "Highly"
                    : level === "medium"
                      ? "Moderate"
                      : "Loose"}
                </Button>
              ))}
            </div>
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
            <div className="flex flex-wrap gap-2 ml-0 sm:ml-7">
              {(["professional", "friendly"] as const).map((tone) => (
                <Button
                  key={tone}
                  variant="outline"
                  onClick={() => updateSetting("responseTone", tone)}
                  disabled={isSaving && savingKey === "responseTone"}
                  className={`border-neutral-700 hover:bg-neutral-800 hover:text-white bg-transparent capitalize ${
                    settings.responseTone === tone
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                      : "text-neutral-400"
                  }`}
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Advanced Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                ADVANCED
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="mod-members"
              className="flex items-start gap-3 cursor-pointer"
            >
              <Users className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">
                  Moderate Organization Members
                </span>
                <p className="text-sm text-neutral-400">
                  Enable moderation features for organization members
                </p>
              </div>
            </Label>
            <Switch
              id="mod-members"
              checked={settings.moderateMembers}
              onCheckedChange={(checked) =>
                updateSetting("moderateMembers", checked)
              }
              disabled={isSaving && savingKey === "moderateMembers"}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-neutral-600"
            />
          </div>
          <div className="h-px bg-neutral-800" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="warnings"
              className="flex items-start gap-3 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white">Number of Warnings</span>
                <p className="text-sm text-neutral-400">
                  Set the warning threshold (0-5) before taking action
                </p>
              </div>
            </Label>
            <div className="w-[180px]">
              <Input
                id="warnings"
                type="number"
                min={0}
                max={5}
                value={localWarningCount ?? settings.warningCount}
                onChange={(e) => {
                  const value = Math.min(
                    5,
                    Math.max(0, parseInt(e.target.value) || 0)
                  );
                  setLocalWarningCount(value);
                }}
                onBlur={() => {
                  if (localWarningCount !== null) {
                    updateSetting("warningCount", localWarningCount);
                    setLocalWarningCount(null);
                  }
                }}
                disabled={isSaving && savingKey === "warningCount"}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-yellow-500 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
