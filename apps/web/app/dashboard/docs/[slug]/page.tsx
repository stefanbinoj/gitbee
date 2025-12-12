import { docs } from "@/lib/docs-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/docs">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Link
            href="/dashboard/docs"
            className="hover:text-neutral-200 transition-colors"
          >
            Documentation
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200">{doc.category}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {doc.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-neutral-400 border-b border-neutral-800 pb-8">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-yellow-500/80" />
            <span>{doc.readTime} read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-yellow-500/80" />
            <span>{doc.category}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-yellow max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-neutral-800 prose-h2:pb-2 prose-h2:mt-10 prose-h3:text-xl prose-p:text-neutral-300 prose-p:leading-relaxed prose-strong:text-white prose-code:text-yellow-500 prose-code:bg-yellow-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:text-neutral-200 prose-a:text-yellow-500 prose-a:no-underline hover:prose-a:underline prose-li:text-neutral-300 prose-blockquote:border-l-yellow-500 prose-blockquote:bg-neutral-900/50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:not-italic">
        <ReactMarkdown
          components={{
            // Override pre/code blocks for better styling
            pre: ({ node, ...props }) => (
              <pre
                {...props}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 overflow-x-auto my-6"
              />
            ),
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !match && !className;

              if (isInline) {
                return (
                  <code
                    {...props}
                    className="bg-neutral-800/50 text-yellow-200 px-1.5 py-0.5 rounded text-sm font-mono border border-neutral-700/50"
                  >
                    {children}
                  </code>
                );
              }

              return (
                <code
                  {...props}
                  className={cn(
                    "text-sm font-mono text-neutral-200",
                    className,
                  )}
                >
                  {children}
                </code>
              );
            },
            // Custom styling for blockquotes to look like callouts
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded-r my-6 text-neutral-300 not-italic"
              />
            ),
            // Style tables
            table: ({ node, ...props }) => (
              <div className="my-6 w-full overflow-y-auto rounded-lg border border-neutral-800">
                <table {...props} className="w-full" />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                {...props}
                className="bg-neutral-900 px-4 py-3 text-left font-semibold text-white border-b border-neutral-800"
              />
            ),
            td: ({ node, ...props }) => (
              <td
                {...props}
                className="px-4 py-3 text-neutral-300 border-b border-neutral-800 last:border-0"
              />
            ),
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
