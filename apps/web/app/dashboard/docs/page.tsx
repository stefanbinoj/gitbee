"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  ChevronRight,
  FileText,
  Lightbulb,
  ExternalLink,
  List,
} from "lucide-react";

export default function DocsPage() {
  const [docs] = useState([
    {
      id: 1,
      title: "Getting Started with GitBee",
      category: "Guides",
      readTime: "5 min",
      popular: true,
    },
    {
      id: 2,
      title: "Configuring Auto-Response Rules",
      category: "Configuration",
      readTime: "8 min",
      popular: true,
    },
    {
      id: 3,
      title: "Integrating with Slack",
      category: "Integrations",
      readTime: "4 min",
      popular: false,
    },
    {
      id: 4,
      title: "Understanding PR Analysis Reports",
      category: "Features",
      readTime: "6 min",
      popular: true,
    },
    {
      id: 5,
      title: "Managing User Permissions",
      category: "Administration",
      readTime: "3 min",
      popular: false,
    },
    {
      id: 6,
      title: "API Reference",
      category: "Developer",
      readTime: "15 min",
      popular: false,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg border border-yellow-500/10 pointer-events-none" />
        <div className="relative p-6 md:p-10 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-neutral-900 rounded-full border border-neutral-800 shadow-lg mb-2">
            <BookOpen className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            How can we help you?
          </h1>
          <div className="w-full max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search documentation..."
              className="pl-10 h-11 bg-neutral-900/80 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus-visible:ring-yellow-500/50"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Popular Articles */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-neutral-900 border-neutral-700 h-full">
            <CardHeader className="border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                  Popular Articles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-800">
                {docs
                  .filter((doc) => doc.popular)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center justify-between p-4 hover:bg-neutral-800/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded bg-neutral-800 text-neutral-400 group-hover:text-yellow-500 group-hover:bg-yellow-500/10 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                            {doc.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-neutral-500 bg-neutral-800/50 px-1.5 py-0.5 rounded border border-neutral-800">
                              {doc.category}
                            </span>
                            <span className="text-[10px] text-neutral-600">
                              •
                            </span>
                            <span className="text-xs text-neutral-500">
                              {doc.readTime} read
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Categories & Help */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-yellow-500" />
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                  Categories
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {[
                  "Getting Started",
                  "Configuration",
                  "Integrations",
                  "API Reference",
                  "Troubleshooting",
                ].map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="w-full justify-start text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 h-9"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <ExternalLink className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-medium text-white">Need more help?</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Join our community Discord or contact support directly.
                </p>
              </div>
              <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
