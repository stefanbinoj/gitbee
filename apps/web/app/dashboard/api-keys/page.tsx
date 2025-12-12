"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiKeysPage() {
  const [open, setOpen] = useState(false);

  const apiKeys = [
    {
      name: "Placeholder",
      key: "sk-or-v1-843...3fd",
      usage: "< $0.001",
      limit: "$2",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Key className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                  API Keys
                </CardTitle>
                <p className="text-sm text-neutral-400 mt-1">
                  Manage your API keys for programmatic access
                </p>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
                  Add API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add API Key</DialogTitle>
                  <DialogDescription className="text-neutral-400">
                    Add your OpenRouter API key to access all models.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="key" className="text-white">
                      API Key
                    </Label>
                    <Input
                      id="key"
                      placeholder="e.g. Development Key"
                      className="bg-neutral-800 border-neutral-600 text-white focus-visible:ring-yellow-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled
                    className="bg-yellow-500 text-neutral-900 hover:bg-yellow-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Coming Soon
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-6">
            <Info className="w-4 h-4" />
            <span>
              Manage your API keys to access all models from OpenRouter
            </span>
          </div>

          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-black">
            {/* Desktop Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-sm text-neutral-400 border-b border-neutral-800">
              <div className="col-span-6">Key</div>
              <div className="col-span-3 text-right">Usage</div>
              <div className="col-span-3 text-right pr-8">Limit</div>
            </div>

            {apiKeys.map((item, index) => (
              <div
                key={index}
                className="p-4 text-sm border-b last:border-0 border-neutral-800 hover:bg-neutral-900/50 transition-colors"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white mb-1">
                        {item.name}
                      </div>
                      <div className="text-neutral-500 font-mono text-xs">
                        {item.key}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 cursor-pointer p-1 hover:bg-neutral-800 rounded">
                      <div className="w-0.5 h-0.5 bg-neutral-500 rounded-full" />
                      <div className="w-0.5 h-0.5 bg-neutral-500 rounded-full" />
                      <div className="w-0.5 h-0.5 bg-neutral-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">Usage:</span>
                      <span className="text-neutral-300 font-mono">
                        {item.usage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-300 font-mono">
                        {item.limit}
                      </span>
                      <span className="text-[10px] border border-neutral-700 rounded px-1 py-0.5 text-neutral-400 uppercase tracking-wide">
                        Total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <div className="font-medium text-white mb-1">
                      {item.name}
                    </div>
                    <div className="text-neutral-500 font-mono text-xs">
                      {item.key}
                    </div>
                  </div>
                  <div className="col-span-3 text-right text-neutral-300 font-mono">
                    {item.usage}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2 w-full justify-end">
                      <span className="text-neutral-300 font-mono">
                        {item.limit}
                      </span>
                      <span className="text-[10px] border border-neutral-700 rounded px-1 py-0.5 text-neutral-400 uppercase tracking-wide">
                        Total
                      </span>
                    </div>
                    <div className="w-8 flex justify-center">
                      <div className="flex flex-col gap-0.5 cursor-pointer p-1 hover:bg-neutral-800 rounded">
                        <div className="w-0.5 h-0.5 bg-neutral-500 rounded-full" />
                        <div className="w-0.5 h-0.5 bg-neutral-500 rounded-full" />
                        <div className="w-0.5 h-0.5 bg-neutral-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
