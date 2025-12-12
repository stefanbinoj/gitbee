import type { Octokit } from "@gitbee/octokit";
import { fetchDocumentation } from "@/botActions/utils/github";
import { aggregateDocumentation } from "@/botActions/utils/markdown";
import { chunkContent } from "@/botActions/utils/chunking";
import { insertChunks, repoHasChunks, type ChunkData } from "@gitbee/vector-db";
import { embedTexts } from "@gitbee/ai";
import * as reportService from "./report.service";
import type { ContentChunk } from "@/botActions/types";

interface IngestionResult {
  status: "completed" | "skipped" | "failed" | "no_content";
  message: string;
  chunksCreated?: number;
}

export async function ingestRepository(
  octokit: Octokit,
  owner: string,
  repo: string,
  reportId?: number
): Promise<IngestionResult> {
  try {
    // Check if already ingested
    const hasExisting = await repoHasChunks(owner, repo);
    if (hasExisting) {
      console.log(
        `[Ingestion] Repo ${owner}/${repo} already ingested, skipping`
      );
      if (reportId) {
        await reportService.updateReportStatus(reportId, "completed");
      }
      return { status: "skipped", message: "Already ingested" };
    }

    // Fetch documentation
    console.log(`[Ingestion] Fetching documentation for ${owner}/${repo}`);
    const docs = await fetchDocumentation(octokit, owner, repo);

    // Get default branch for link resolution
    const { data: repository } = await octokit.request(
      "GET /repos/{owner}/{repo}",
      { owner, repo }
    );
    const defaultBranch = repository.default_branch;

    // Aggregate documentation content
    const aggregatedContent = await aggregateDocumentation(
      docs,
      owner,
      repo,
      defaultBranch
    );

    if (!aggregatedContent || aggregatedContent.trim().length === 0) {
      console.log(`[Ingestion] No content found for ${owner}/${repo}`);
      if (reportId) {
        await reportService.updateReportStatus(reportId, "completed");
      }
      return {
        status: "no_content",
        message: "No documentation content found",
      };
    }

    // Chunk the content
    console.log(`[Ingestion] Chunking content for ${owner}/${repo}`);
    const chunks = chunkContent(aggregatedContent);

    if (chunks.length === 0) {
      console.log(`[Ingestion] No chunks created for ${owner}/${repo}`);
      if (reportId) {
        await reportService.updateReportStatus(reportId, "completed");
      }
      return { status: "no_content", message: "No chunks created" };
    }

    // Generate embeddings
    console.log(
      `[Ingestion] Generating embeddings for ${chunks.length} chunks`
    );
    const texts = chunks.map((c: ContentChunk) => c.text);
    const embeddings = await embedTexts(texts);

    // Prepare chunk data for insertion
    const chunkData: ChunkData[] = chunks.map(
      (chunk: ContentChunk, index: number) => ({
        id: `${owner}/${repo}/chunk-${chunk.chunkIndex}-${Date.now()}`,
        text: chunk.text,
        vector: embeddings[index],
        owner,
        repo,
        chunk_index: chunk.chunkIndex,
        doc_type: chunk.docType,
        token_count: chunk.tokenCount,
      })
    );

    // Insert into vector database
    await insertChunks(chunkData);

    if (reportId) {
      await reportService.updateReportStatus(reportId, "completed");
    }

    return {
      status: "completed",
      message: `Ingested ${chunks.length} chunks`,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    console.error(`[Ingestion] Failed for ${owner}/${repo}:`, error);
    if (reportId) {
      await reportService.updateReportStatus(reportId, "failed");
    }
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function ingestRepositoryWithReport(
  octokit: Octokit,
  installationId: number,
  targetId: number,
  repositoryId: number,
  owner: string,
  repo: string
): Promise<IngestionResult> {
  const report = await reportService.createReport({
    installationId,
    repositoryId,
    repositoryFullName: `${owner}/${repo}`,
    targetId,
    reportType: "ingestion",
  });

  return ingestRepository(octokit, owner, repo, report.id);
}
