import type { DocKey, DocResult, DocumentSection } from "@/botActions/types";
import { MAX_LINK_DEPTH } from "@/botActions/constants";
import { resolveGitHubUrl, fetchUrlContent } from "./github";

export function extractMarkdownLinks(
  content: string
): Array<{ text: string; url: string }> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: Array<{ text: string; url: string }> = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Skip if it's an image (preceded by !)
    if (match.index > 0 && content[match.index - 1] === "!") {
      continue;
    }
    links.push({
      text: match[1] || "",
      url: match[2] || "",
    });
  }

  return links;
}

function parseDocType(header: string): string {
  const headerLower = header.toLowerCase();

  if (headerLower.includes("contributing")) return "contributing";
  if (headerLower.includes("readme")) return "readme";
  if (
    headerLower.includes("code of conduct") ||
    headerLower.includes("code_of_conduct")
  ) {
    return "code_of_conduct";
  }
  if (headerLower.includes("security")) return "security";

  return "unknown";
}

export function splitByDocumentType(
  aggregatedContent: string
): DocumentSection[] {
  const sections = aggregatedContent.split("------").filter((s) => s.trim());
  const documentSections: DocumentSection[] = [];

  for (const section of sections) {
    const trimmedSection = section.trim();
    if (!trimmedSection) continue;

    const headerMatch = trimmedSection.match(/#\s+([^:\n]+)\s*Data:\s*/i);

    if (headerMatch) {
      const docType = parseDocType(headerMatch[1]);
      const headerIndex = trimmedSection.indexOf(headerMatch[0]);
      const content = trimmedSection
        .slice(headerIndex + headerMatch[0].length)
        .trim();

      if (content) {
        documentSections.push({ docType, content });
      }
    }
  }

  return documentSections;
}

async function recursiveFetchContent(
  content: string,
  owner: string,
  repo: string,
  defaultBranch: string,
  depth: number,
  visitedUrls: Set<string>
): Promise<string> {
  if (depth >= MAX_LINK_DEPTH) {
    return content;
  }

  let aggregatedContent = content;
  const links = extractMarkdownLinks(content);

  for (const link of links) {
    const resolvedUrl = resolveGitHubUrl(link.url, owner, repo, defaultBranch);
    if (!resolvedUrl || visitedUrls.has(resolvedUrl)) {
      continue;
    }

    visitedUrls.add(resolvedUrl);
    const linkedContent = await fetchUrlContent(resolvedUrl);

    if (linkedContent) {
      const nestedContent = await recursiveFetchContent(
        linkedContent,
        owner,
        repo,
        defaultBranch,
        depth + 1,
        visitedUrls
      );
      aggregatedContent += `\n\n--- Content from ${link.text} (${link.url}) ---\n${nestedContent}`;
    }
  }

  return aggregatedContent;
}

export async function aggregateDocumentation(
  docs: Record<DocKey, DocResult>,
  owner: string,
  repo: string,
  defaultBranch: string
): Promise<string> {
  let aggregatedContent = "";
  const docTypes: Array<{ key: DocKey; label: string }> = [
    { key: "contributing", label: "Contributing" },
    { key: "readme", label: "Readme" },
    { key: "code_of_conduct", label: "Code of Conduct" },
    { key: "security", label: "Security" },
  ];

  for (const { key, label } of docTypes) {
    const content = docs[key].content;
    if (!content) continue;

    const expandedContent = await recursiveFetchContent(
      content,
      owner,
      repo,
      defaultBranch,
      0,
      new Set()
    );

    aggregatedContent += `# ${label} Data: \n`;
    aggregatedContent += "Main Content: \n";
    aggregatedContent += expandedContent;
    aggregatedContent += "\n------\n";
  }

  return aggregatedContent;
}
