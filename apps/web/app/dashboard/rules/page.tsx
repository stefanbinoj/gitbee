"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Plus, FileCode, FolderGit2, Brain } from "lucide-react";

type Rule = {
  id: string;
  name: string;
  description: string;
  content: string;
  scope: {
    repository: string;
    filePattern: string;
  };
};

export default function RulesPage() {
  const [activeRuleId, setActiveRuleId] = useState<string | null>(null);
  const [rules] = useState<Rule[]>([
    {
      id: "rule_1",
      name: "Use logging over print",
      description: "Enforce structured logging instead of print statements",
      content: `What: Use logging instead of print to log messages

Why: We can filter logs by severity (error, info, etc.)

Good: logging.error("Error message.")

Bad: print("Error message.")`,
      scope: {
        repository: "all",
        filePattern: "src/**/*.py",
      },
    },
  ]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
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

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - List of Rules */}
          <div className="w-64 border-r border-neutral-800 flex flex-col bg-neutral-900">
            <div className="p-4 border-b border-neutral-800">
              <Button
                variant="ghost"
                className="w-full justify-start border border-dashed border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600"
                onClick={() => setActiveRuleId(null)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                    activeRuleId === rule.id
                      ? "bg-yellow-500/10 text-yellow-500 font-medium"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="truncate">{rule.name}</span>
                </button>
              ))}
              <div
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                  activeRuleId === null
                    ? "bg-yellow-500/10 text-yellow-500 font-medium"
                    : "text-neutral-400"
                }`}
              >
                <span className="truncate italic">New rule...</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-black">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Rule Definition */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
                    Rule Definition
                  </Label>
                  <Info className="w-3 h-3 text-neutral-600" />
                </div>

                <div className="space-y-2">
                  <textarea
                    className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-md p-4 text-sm font-mono text-neutral-300 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 resize-none placeholder-neutral-600"
                    placeholder={`What: Use logging instead of print to log messages\n\nWhy: We can filter logs by severity (error, info, etc.)\n\nGood: logging.error("Error message.")\n\nBad: print("Error message.")`}
                    defaultValue={
                      activeRuleId
                        ? rules.find((r) => r.id === activeRuleId)?.content
                        : ""
                    }
                  />
                  <p className="text-xs text-neutral-500 text-right">
                    Markdown supported
                  </p>
                </div>
              </div>

              {/* Scope Definition */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
                      Scope
                    </Label>
                    <Info className="w-3 h-3 text-neutral-600" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Scope
                  </Button>
                </div>

                <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-neutral-400 flex items-center gap-2">
                      <FolderGit2 className="w-3 h-3" />
                      REPOSITORY
                    </Label>
                    <div className="relative">
                      <Input
                        defaultValue={
                          activeRuleId
                            ? rules.find((r) => r.id === activeRuleId)?.scope
                                .repository
                            : "all"
                        }
                        className="bg-neutral-800 border-neutral-700 text-white font-mono text-sm h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-neutral-400 flex items-center gap-2">
                      <FileCode className="w-3 h-3" />
                      FILE PATTERN
                    </Label>
                    <div className="relative">
                      <Input
                        defaultValue={
                          activeRuleId
                            ? rules.find((r) => r.id === activeRuleId)?.scope
                                .filePattern
                            : "all e.g. src/**/*.tsx"
                        }
                        className="bg-neutral-800 border-neutral-700 text-white font-mono text-sm h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex justify-between items-center">
              <Button
                variant="ghost"
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Skip
                </Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold min-w-[140px]">
                  Save and Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
