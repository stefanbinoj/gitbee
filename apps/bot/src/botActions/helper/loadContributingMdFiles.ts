import { altPaths, maxDepth } from "../constant";

export async function loadContributingMdFileData(
  octokit: any,
  owner: string,
  repo: string,
  depth: number = 0,
  visitedUrls: Set<string> = new Set(),
) {
  if (depth >= maxDepth) {
    console.log("DEBUG", `Maximum recursion depth reached for ${owner}/${repo}`);
    return null;
  }

  let mainContent = "";
  let foundPath = "";

  // First, get the main contributing guidelines
  for (const path of altPaths) {
    try {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: owner,
          repo: repo,
          path: path,
        },
      );

      console.log(`Fetching ${path} from ${owner}/${repo} res: `, response);

      if (response.data.content) {
        mainContent = Buffer.from(response.data.content, "base64").toString(
          "utf-8",
        );
        foundPath = path;
        console.log(
          "INFO",
          `Contributing guidelines found at ${path} for ${owner}/${repo}`,
        );
        break;
      }
    } catch (error: any) {
      console.log(
        "DEBUG",
        `Failed to load contributing guidelines from ${path}`,
        {
          error: error.message,
        },
      );
    }
  }

  if (!mainContent) {
    console.log(
      "WARN",
      `No contributing guidelines found for ${owner}/${repo}`,
    );
    return null;
  }

  let aggregatedContent = mainContent;

  if (depth < maxDepth - 1) {
    const links = extractMarkdownLinks(mainContent);
    console.log(
      "DEBUG",
      `Found ${links.length} markdown links in ${foundPath}`,
      {
        links: links.map((l) => l.url),
      },
    );

    for (const link of links) {
      const resolvedUrl = resolveGitHubUrl(link.url, owner, repo);
      if (!resolvedUrl || visitedUrls.has(resolvedUrl)) {
        continue;
      }

      visitedUrls.add(resolvedUrl);
      console.log("DEBUG", `Following link: ${link.text} -> ${resolvedUrl}`);

      const linkedContent = await fetchUrlContent(resolvedUrl);
      if (linkedContent) {
        const processedLinkedContent = await processLinkedContent(
          linkedContent,
          owner,
          repo,
          depth + 1,
          visitedUrls,
        );

        aggregatedContent += `\n\n--- Content from ${link.text} (${link.url}) ---\n${processedLinkedContent}`;
        console.log(
          "INFO",
          `Successfully aggregated content from ${resolvedUrl}`,
        );
      }
    }
  }

  return aggregatedContent;
}

// Helper function to extract markdown links from content
function extractMarkdownLinks(
  content: string,
): Array<{ text: string; url: string }> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: Array<{ text: string; url: string }> = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1] || "",
      url: match[2] || "",
    });
  }

  return links;
}

// Helper function to resolve relative URLs to raw GitHub URLs
function resolveGitHubUrl(
  url: string,
  owner: string,
  repo: string,
): string | null {
  if (url.startsWith("http")) {
    if (
      url.includes("github.com") &&
      url.includes(owner) &&
      url.includes(repo)
    ) {
      return url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/")
        .replace("/tree/", "/");
    }
    return null; // Skip non-GitHub URLs
  }

  // Handle relative URLs - convert to raw GitHub URL
  const cleanUrl = url.startsWith("./") ? url.substring(2) : url;
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${cleanUrl}`;
}

// Helper function to fetch content from URL
async function fetchUrlContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
  } catch (error: any) {
    console.log("DEBUG", `Failed to fetch URL content: ${url}`, {
      error: error.message,
    });
  }
  return null;
}

// Helper function to process linked content for additional links
async function processLinkedContent(
  content: string,
  owner: string,
  repo: string,
  depth: number,
  visitedUrls: Set<string>,
): Promise<string> {
  if (depth >= 3) return content;

  const links = extractMarkdownLinks(content);
  let processedContent = content;

  for (const link of links) {
    const resolvedUrl = resolveGitHubUrl(link.url, owner, repo);
    if (!resolvedUrl || visitedUrls.has(resolvedUrl)) {
      continue;
    }

    visitedUrls.add(resolvedUrl);
    const linkedContent = await fetchUrlContent(resolvedUrl);
    if (linkedContent) {
      const nestedContent = await processLinkedContent(
        linkedContent,
        owner,
        repo,
        depth + 1,
        visitedUrls,
      );
      processedContent += `\n\n--- Content from ${link.text} (${link.url}) ---\n${nestedContent}`;
    }
  }

  return processedContent;
}
