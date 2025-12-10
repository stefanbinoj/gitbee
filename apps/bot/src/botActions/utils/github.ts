import type { Octokit } from "@gitbee/octokit";
import type { DocKey, DocResult } from "@/botActions/types";
import { COMMON_DIRS, DEFAULT_TARGETS } from "@/botActions/constants";

function normalizeFileKey(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  return base
    .replace(/\.(md|markdown|txt|mdown)$/i, "")
    .replace(/\W+/g, "_")
    .toLowerCase();
}

function canonicalFromKey(key: DocKey): string {
  switch (key) {
    case "readme":
      return "readme";
    case "contributing":
      return "contributing";
    case "code_of_conduct":
      return "code_of_conduct";
    case "security":
      return "security";
  }
}

function createLimiter(concurrency: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        active++;
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--;
            if (queue.length > 0) {
              const next = queue.shift()!;
              next();
            }
          });
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
  };
}

export async function fetchDocumentation(
  octokit: Octokit,
  owner: string,
  repo: string,
  concurrency = 5
): Promise<Record<DocKey, DocResult>> {
  const results: Record<DocKey, DocResult> = {
    readme: { path: null, content: null },
    contributing: { path: null, content: null },
    code_of_conduct: { path: null, content: null },
    security: { path: null, content: null },
  };

  const needed = new Set<DocKey>(DEFAULT_TARGETS);

  // Search for documentation files in common directories
  for (const dir of COMMON_DIRS) {
    if (needed.size === 0) break;

    try {
      const res = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          repo,
          path: dir === "" ? "" : dir,
        }
      );

      if (!Array.isArray(res.data)) {
        continue;
      }

      for (const entry of res.data) {
        if (entry.type !== "file") continue;
        const normalized = normalizeFileKey(entry.name);

        for (const target of Array.from(needed)) {
          const canon = canonicalFromKey(target);
          if (normalized === canon) {
            results[target].path = entry.path ?? null;
            needed.delete(target);
          }
        }
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        err.status === 404
      ) {
        continue;
      }
      throw err;
    }
  }

  // Fetch content for discovered paths
  const limiter = createLimiter(concurrency);
  const tasks: Promise<void>[] = [];

  for (const t of DEFAULT_TARGETS) {
    const entry = results[t];
    if (!entry.path) {
      entry.content = null;
      continue;
    }

    const task = limiter(async () => {
      try {
        const fileRes = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner,
            repo,
            path: entry.path!,
          }
        );

        if ("content" in fileRes.data && fileRes.data.content) {
          entry.content = Buffer.from(fileRes.data.content, "base64").toString(
            "utf-8"
          );
        } else {
          entry.content = null;
        }
      } catch {
        entry.content = null;
      }
    });

    tasks.push(task);
  }

  await Promise.all(tasks);
  return results;
}

export function resolveGitHubUrl(
  url: string,
  owner: string,
  repo: string,
  defaultBranch: string
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
    return null;
  }

  const cleanUrl = url.startsWith("./") ? url.substring(2) : url;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanUrl}`;
}

export async function fetchUrlContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
  } catch {
    console.log(`[GitHub] Failed to fetch URL: ${url}`);
  }
  return null;
}
