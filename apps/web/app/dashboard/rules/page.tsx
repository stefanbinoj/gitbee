"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient, type Session } from "@/lib/authClient";
import { type RuleType } from "@gitbee/db";

type Rule = {
  id: number;
  ruleType: RuleType;
  ruleName: string;
  ruleText: string;
  installationId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const ruleTypeLabels: Record<RuleType, string> = {
  comment: "Comment",
  issue: "Issue",
  pr: "Pull Request",
};

export default function RulesPage() {
  const { data: session } = authClient.useSession() as {
    data: Session | null;
  };
  const queryClient = useQueryClient();

  const githubAccountId = session?.session?.githubAccountId;

  // Form state for new/edit rule
  const [activeRuleId, setActiveRuleId] = useState<number | null>(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleText, setRuleText] = useState("");
  const [ruleType, setRuleType] = useState<RuleType>("issue");

  // Fetch rules
  const {
    data: rulesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rules", githubAccountId],
    queryFn: async () => {
      if (!githubAccountId) return { rules: [] };

      const response = await api.api.users
        .rules({
          githubAccountId: String(githubAccountId),
        })
        .get();

      return response.data ?? { rules: [] };
    },
    enabled: !!githubAccountId,
  });

  const rules = (rulesData?.rules ?? []) as Rule[];

  // Create rule mutation
  const createRuleMutation = useMutation({
    mutationFn: async (data: {
      ruleName: string;
      ruleText: string;
      ruleType: RuleType;
    }) => {
      if (!githubAccountId) throw new Error("No GitHub account ID");

      const response = await api.api.users
        .rules({
          githubAccountId: String(githubAccountId),
        })
        .post(data);

      return response.data;
    },
    onError: () => {
      toast.error("Failed to create rule");
    },
    onSuccess: () => {
      toast.success("Rule created");
      queryClient.invalidateQueries({ queryKey: ["rules", githubAccountId] });
      resetForm();
    },
  });

  // Update rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: async (data: {
      ruleId: number;
      ruleName?: string;
      ruleText?: string;
      ruleType?: RuleType;
    }) => {
      if (!githubAccountId) throw new Error("No GitHub account ID");

      const { ruleId, ...updateData } = data;

      const response = await api.api.users
        .rules({ githubAccountId: String(githubAccountId) })({
          ruleId: String(ruleId),
        })
        .put(updateData);

      return response.data;
    },
    onError: () => {
      toast.error("Failed to update rule");
    },
    onSuccess: () => {
      toast.success("Rule updated");
      queryClient.invalidateQueries({ queryKey: ["rules", githubAccountId] });
    },
  });

  // Delete rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: number) => {
      if (!githubAccountId) throw new Error("No GitHub account ID");

      const response = await api.api.users
        .rules({ githubAccountId: String(githubAccountId) })({
          ruleId: String(ruleId),
        })
        .delete();

      return response.data;
    },
    onError: () => {
      toast.error("Failed to delete rule");
    },
    onSuccess: () => {
      toast.success("Rule deleted");
      queryClient.invalidateQueries({ queryKey: ["rules", githubAccountId] });
      resetForm();
    },
  });

  const resetForm = () => {
    setActiveRuleId(null);
    setRuleName("");
    setRuleText("");
    setRuleType("issue");
  };

  const handleSelectRule = (rule: Rule) => {
    setActiveRuleId(rule.id);
    setRuleName(rule.ruleName);
    setRuleText(rule.ruleText);
    setRuleType(rule.ruleType);
  };

  const handleNewRule = () => {
    resetForm();
  };

  const handleSave = () => {
    if (!ruleName.trim() || !ruleText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (activeRuleId) {
      // Update existing rule
      updateRuleMutation.mutate({
        ruleId: activeRuleId,
        ruleName,
        ruleText,
        ruleType,
      });
    } else {
      // Create new rule
      createRuleMutation.mutate({
        ruleName,
        ruleText,
        ruleType,
      });
    }
  };

  const handleDelete = () => {
    if (activeRuleId) {
      deleteRuleMutation.mutate(activeRuleId);
    }
  };

  const isSaving = createRuleMutation.isPending || updateRuleMutation.isPending;
  const isDeleting = deleteRuleMutation.isPending;

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
        <p className="text-red-500">Failed to load rules</p>
      </div>
    );
  }

  return (
    <div className="h-full md:h-[calc(100vh-8rem)] flex flex-col gap-6">
      <Card className="flex-1 bg-neutral-900 border-neutral-700 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-neutral-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Brain className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                  Custom Rules
                </CardTitle>
                <p className="text-sm text-neutral-400 mt-1">
                  Define custom rules for GitBee to apply across your codebase
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar - List of Rules */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col bg-neutral-900">
            <div className="p-4 border-b border-neutral-800">
              <Button
                variant="ghost"
                className="w-full justify-start border border-dashed border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600"
                onClick={handleNewRule}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-40 md:max-h-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* New rule option */}
              <button
                onClick={handleNewRule}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                  activeRuleId === null
                    ? "bg-yellow-500/10 text-yellow-500 font-medium"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span className="truncate italic">New rule...</span>
              </button>

              {/* Existing rules */}
              {rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleSelectRule(rule)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                    activeRuleId === rule.id
                      ? "bg-yellow-500/10 text-yellow-500 font-medium"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="truncate">{rule.ruleName}</span>
                  <span className="text-xs text-neutral-500">
                    {ruleTypeLabels[rule.ruleType]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-black">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Rule Name */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
                  Rule Name
                </Label>
                <Input
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g., Use logging instead of print"
                  className="bg-neutral-900 border-neutral-800 text-neutral-300 focus:ring-1 focus:ring-yellow-500/50 placeholder-neutral-600"
                />
              </div>

              {/* Rule Type */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
                  Apply To
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(["issue", "pr", "comment"] as const).map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      onClick={() => setRuleType(type)}
                      className={`border-neutral-700 hover:bg-neutral-800 hover:text-white bg-transparent ${
                        ruleType === type
                          ? "border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                          : "text-neutral-400"
                      }`}
                    >
                      {ruleTypeLabels[type]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rule Definition */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
                  Rule Definition
                </Label>
                <textarea
                  value={ruleText}
                  onChange={(e) => setRuleText(e.target.value)}
                  className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-md p-4 text-sm font-mono text-neutral-300 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 resize-none placeholder-neutral-600"
                  placeholder={`What: Use logging instead of print to log messages\n\nWhy: We can filter logs by severity (error, info, etc.)\n\nGood: logging.error("Error message.")\n\nBad: print("Error message.")`}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                {activeRuleId && (
                  <Button
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold sm:min-w-[140px]"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {activeRuleId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
