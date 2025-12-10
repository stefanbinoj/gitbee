import { type Octokit } from "octokit";
import { maxDepth } from "@/botActions/constant";
import { fetchRepoDocumentationWithOctokit } from "./githubDocsFetcher";

// Helper function to resolve relative URLs to raw GitHub URLs
function resolveGitHubUrl(
  url: string,
  owner: string,
  repo: string,
  defaultBranch: string,
): string | null {
  if (url.startsWith("http")) {
    if (
      url.includes("github.com") &&
      url.includes(owner) &&
      url.includes(repo)
    ) {
      console.log(`This is a github url: ${url}`);
      return url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/")
        .replace("/tree/", "/");
    }
    return null; // Skip non-GitHub URLs
  }

  // Handle relative URLs - convert to raw GitHub URL using default branch
  const cleanUrl = url.startsWith("./") ? url.substring(2) : url;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanUrl}`;
}

// Helper function to extract markdown links from content
function extractMarkdownLinks(
  content: string,
): Array<{ text: string; url: string }> {
  // Matches [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  //const linkRegex = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:[^\s"'<>]*)?/g;
  const links: Array<{ text: string; url: string }> = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Skip if it's an image (preceded by !)
    if (match.index > 0 && content[match.index - 1] === "!") {
      continue;
    }
    links.push({
      text: match[1] || "xxxx",
      url: match[2] || "yyyy",
    });
  }

  return links;
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

export async function loadContributingMdFileData(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<string | null> {
  // Fetch default branch to handle relative links correctly
  const { data: repository } = await octokit.request(
    "GET /repos/{owner}/{repo}",
    { owner, repo },
  );
  const defaultBranch = repository.default_branch;

  const fetchedContents = await fetchRepoDocumentationWithOctokit({
    owner,
    repo,
    octokit,
  });
  const contributingData = fetchedContents["contributing"].content;
  const readmeData = fetchedContents["readme"].content;
  const codeOfConductData = fetchedContents["code_of_conduct"].content;
  const securityData = fetchedContents["security"].content;

  let aggregatedContent = "";

  if (contributingData) {
    const contributingDataAggregated = await recursiveFetchContributingMd(
      contributingData,
      owner,
      repo,
      defaultBranch,
    );
    aggregatedContent += "# Contributing Data: \n";
    aggregatedContent += contributingDataAggregated;
    aggregatedContent += "\n------\n";
  }
  if (readmeData) {
    const readmeDataAggregated = await recursiveFetchContributingMd(
      readmeData,
      owner,
      repo,
      defaultBranch,
    );
    aggregatedContent += "# Readme Data: \n";
    aggregatedContent += readmeDataAggregated;
    aggregatedContent += "\n------\n";
  }
  if (codeOfConductData) {
    const codeOfConductDataAggregated = await recursiveFetchContributingMd(
      codeOfConductData,
      owner,
      repo,
      defaultBranch,
    );
    aggregatedContent += "# Code of Conduct Data: \n";
    aggregatedContent += codeOfConductDataAggregated;
    aggregatedContent += "\n------\n";
  }
  if (securityData) {
    const securityDataAggregated = await recursiveFetchContributingMd(
      securityData,
      owner,
      repo,
      defaultBranch,
    );
    aggregatedContent += "# Security Data: \n";
    aggregatedContent += securityDataAggregated;
    aggregatedContent += "\n------\n";
  }

  return aggregatedContent;
}

const recursiveFetchContributingMd = async (
  mainContent: string,
  owner: string,
  repo: string,
  defaultBranch: string,
  depth: number = 0,
  visitedUrls: Set<string> = new Set(),
): Promise<string> => {
  if (depth >= maxDepth) {
    console.log("❌❌ MAX DEPTH reached, stopping recursion");
    return mainContent;
  }

  let aggregatedContent = "Main Content: \n";
  aggregatedContent += mainContent;

  // Implementation of recursive fetching logic
  if (depth < maxDepth - 1) {
    const links = extractMarkdownLinks(mainContent);
    console.log(
      `ℹ️ Links found for : ${mainContent.trim().substring(0, 30)}... is::`,
      links.map((l) => l.url),
    );

    for (const link of links) {
      const resolvedUrl = resolveGitHubUrl(
        link.url,
        owner,
        repo,
        defaultBranch,
      );
      if (!resolvedUrl || visitedUrls.has(resolvedUrl)) {
        console.log(`😢 This is not a github url: ${link.url}`);
        continue;
      }

      visitedUrls.add(resolvedUrl);
      console.log(`😊Following link: ${link.text} -> ${resolvedUrl}`);

      const linkedContent = await fetchUrlContent(resolvedUrl);
      if (linkedContent) {
        const processedLinkedContent = await processLinkedContent(
          linkedContent,
          owner,
          repo,
          defaultBranch,
          depth + 1,
          visitedUrls,
        );

        aggregatedContent += `\n\n--- Content from ${link.text} (${link.url}) ---\n${processedLinkedContent}`;
        console.log(
          `✅✅ Successfully aggregated content from ${resolvedUrl}, ${linkedContent}`,
        );
      }
    }
  }

  return aggregatedContent;
};

// Helper function to process linked content for additional links
async function processLinkedContent(
  content: string,
  owner: string,
  repo: string,
  defaultBranch: string,
  depth: number,
  visitedUrls: Set<string>,
): Promise<string> {
  if (depth >= maxDepth) return content;

  const links = extractMarkdownLinks(content);
  console.log(
    `ℹ️ Links found for recursive : ${content.trim().substring(0, 30)}... is::`,
    links.map((l) => l.url),
  );
  let processedContent = content;

  for (const link of links) {
    const resolvedUrl = resolveGitHubUrl(link.url, owner, repo, defaultBranch);
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
        defaultBranch,
        depth + 1,
        visitedUrls,
      );
      processedContent += `\n\n--- Content from ${link.text} (${link.url}) ---\n${nestedContent}`;
    }
  }

  return processedContent;
}
