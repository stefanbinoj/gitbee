import type { Octokit } from "octokit";

/** Supported documentation file types */
export type DocKey = "readme" | "contributing" | "code_of_conduct" | "security";

/** Result of fetching a documentation file */
export interface DocResult {
  path: string | null;
  content: string | null;
}

/** Options for fetching repository documentation */
export interface FetchDocsOptions {
  owner: string;
  repo: string;
  octokit: Octokit;
  concurrency?: number;
}

/** A section of aggregated document content */
export interface DocumentSection {
  docType: string;
  content: string;
}

export interface ContentChunk {
  text: string;
  chunkIndex: number;
  docType: string;
  tokenCount: number;
}
