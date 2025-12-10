import { type Octokit } from "octokit";
import { COMMON_DIRS, DEFAULT_TARGETS, DocKey } from "@/botActions/constant";

type DocResult = {
  path: string | null;
  content: string | null;
};

type FetchDocsOptions = {
  owner: string;
  repo: string;
  octokit: Octokit;
  concurrency?: number;
};

function normalizeFileKey(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  const normalized = base
    .replace(/\.(md|markdown|txt|mdown)$/i, "")
    .replace(/\W+/g, "_")
    .toLowerCase();

  console.log(`Normalized filename ${filename} to key ${normalized}`);
  return normalized;
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

export async function fetchRepoDocumentationWithOctokit({
  owner,
  repo,
  octokit,
  concurrency = 5,
}: FetchDocsOptions): Promise<Record<DocKey, DocResult>> {
  const results: Record<DocKey, DocResult> = {
    readme: { path: null, content: null },
    contributing: { path: null, content: null },
    code_of_conduct: { path: null, content: null },
    security: { path: null, content: null },
  };

  const needed = new Set<DocKey>(DEFAULT_TARGETS);

  for (const dir of COMMON_DIRS) {
    if (needed.size === 0) break;
    try {
      const res = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: owner,
          repo: repo,
          path: dir === "" ? "" : dir,
        },
      );

      console.log(
        `\nℹ️ The content length got for #${dir}# is:`,
        res.data.length,
      );

      if (!Array.isArray(res.data)) {
        // path is a file (rare when dir is ""), skip
        console.log(`⚠️ Path ${dir} in ${owner}/${repo} is a file, skipping.`);
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
    } catch (err: any) {
      // ignore 404 (directory doesn't exist) and continue
      if (err?.status === 404) {
        console.log(
          `Directory ${dir} not found in ${owner}/${repo}, continuing.`,
        );
        continue;
      }
      throw err;
    }
  }

  // Step 3: fetch contents for discovered paths (concurrency-limited)
  const limiter = createLimiter(concurrency);
  const tasks: Promise<void>[] = [];

  for (const t of DEFAULT_TARGETS) {
    const entry = results[t];
    if (!entry.path) {
      console.log(`Path ${t} in ${owner}/${repo} is null, skipping.`);
      entry.content = null;
      continue;
    }

    const task = limiter(async () => {
      try {
        const fileRes = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: owner,
            repo: repo,
            path: entry.path,
          },
        );

        if (fileRes.data.content) {
          const fileContent = Buffer.from(
            fileRes.data.content,
            "base64",
          ).toString("utf-8");
          entry.content = fileContent;
        } else {
          console.log(`No content found for ${entry.path} in ${owner}/${repo}`);
          entry.content = null;
        }
      } catch (err: any) {
        // if a file was deleted between tree and fetch, or 404, set null
        console.log(
          `Failed to fetch content for ${entry.path} in ${owner}/${repo}:`,
          err.message,
        );
        entry.content = null;
      }
    });

    tasks.push(task);
  }

  await Promise.all(tasks);
  return results;
}
