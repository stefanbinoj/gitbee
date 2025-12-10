import { insertChunks, repoHasChunks, type ChunkData } from "@gitbee/vector-db";
import { embedTexts } from "@gitbee/ai";
import {
  MAX_CHUNK_TOKENS,
  CHUNK_OVERLAP_TOKENS,
  MIN_SECTION_TOKENS,
} from "@/botActions/constant";
import { get_encoding } from "tiktoken";

// Initialize tokenizer (cl100k_base is used by text-embedding-3-small)
const tokenizer = get_encoding("cl100k_base");

interface DocumentSection {
  docType: string;
  content: string;
}

interface MarkdownSection {
  headerPath: string;
  content: string;
  level: number;
  docType: string;
  tokenCount: number;
}

interface Chunk {
  text: string;
  headerPath: string;
  chunkIndex: number;
  docType: string;
  tokenCount: number;
}

function countTokens(text: string): number {
  return tokenizer.encode(text).length;
}

function decodeTokens(tokens: Uint32Array): string {
  return new TextDecoder().decode(tokenizer.decode(tokens));
}

function generateChunkId(
  owner: string,
  repo: string,
  chunkIndex: number,
): string {
  return `${owner}/${repo}/chunk-${chunkIndex}-${Date.now()}`;
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

//

function splitByDocumentType(aggregatedContent: string): DocumentSection[] {
  console.log(
    "[splitByDocumentType] Splitting content by document type separator...",
  );

  const sections = aggregatedContent.split("------").filter((s) => s.trim());
  const documentSections: DocumentSection[] = [];

  for (const section of sections) {
    const trimmedSection = section.trim();
    if (!trimmedSection) continue;

    // Extract the header line (e.g., "# Contributing Data:")
    // Use multiline flag to handle cases where header might not be at absolute start
    const headerMatch = trimmedSection.match(/#\s+([^:\n]+)\s*Data:\s*/i);

    if (headerMatch) {
      const docType = parseDocType(headerMatch[1]);
      // Remove everything up to and including the header line
      const headerIndex = trimmedSection.indexOf(headerMatch[0]);
      const content = trimmedSection
        .slice(headerIndex + headerMatch[0].length)
        .trim();

      if (content) {
        documentSections.push({ docType, content });
        console.log(
          `[splitByDocumentType] Found '${docType}' section (${content.length} chars, ${countTokens(content)} tokens)`,
        );
      } else {
        console.log(
          `[splitByDocumentType] Found '${docType}' header but no content, skipping`,
        );
      }
    } else {
      // If no header found, treat as unknown type
      console.log(
        `[splitByDocumentType] Section without recognized header, skipping (${trimmedSection.substring(0, 50)}...)`,
      );
    }
  }

  const docTypes = documentSections.map((s) => s.docType);
  console.log(
    `[splitByDocumentType] Split into ${documentSections.length} document sections: [${docTypes.join(", ")}]`,
  );

  return documentSections;
}
//tuffest
function parseMarkdownSections(
  content: string,
  docType: string,
): MarkdownSection[] {
  console.log(`[parseMarkdownSections] Parsing markdown for '${docType}'...`);

  const lines = content.split("\n");
  const sections: MarkdownSection[] = [];
  const headerStack: { text: string; level: number }[] = [];

  // Initialize with doc type as root
  const docTypeHeader = `${docType.charAt(0).toUpperCase() + docType.slice(1).replace(/_/g, " ")} Data`;

  let currentContent = "";
  let currentHeaderPath = docTypeHeader;
  let currentLevel = 0;
  let inCodeBlock = false;

  for (const line of lines) {
    // Check for code block fences to avoid parsing headers inside code blocks
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }

    // Check if line is a header (starts with #)
    const headerMatch = !inCodeBlock ? line.match(/^(#{1,6})\s+(.+)$/) : null;

    if (headerMatch) {
      // Save previous section if it has content
      if (currentContent.trim()) {
        const tokenCount = countTokens(currentContent.trim());
        sections.push({
          headerPath: currentHeaderPath,
          content: currentContent.trim(),
          level: currentLevel,
          docType,
          tokenCount,
        });
      }

      const level = headerMatch[1].length;
      const headerText = headerMatch[2].trim();

      // Update header stack - pop headers at same or higher level
      while (
        headerStack.length > 0 &&
        headerStack[headerStack.length - 1].level >= level
      ) {
        headerStack.pop();
      }

      // Push current header
      headerStack.push({ text: headerText, level });

      // Build header path with doc type prefix
      currentHeaderPath =
        docTypeHeader + " > " + headerStack.map((h) => h.text).join(" > ");
      currentLevel = level;
      currentContent = "";
    } else {
      // Add line to current content
      currentContent += line + "\n";
    }
  }

  // Don't forget the last section
  if (currentContent.trim()) {
    const tokenCount = countTokens(currentContent.trim());
    sections.push({
      headerPath: currentHeaderPath,
      content: currentContent.trim(),
      level: currentLevel,
      docType,
      tokenCount,
    });
  }

  // Filter out sections with too few tokens
  const validSections = sections.filter(
    (s) => s.tokenCount >= MIN_SECTION_TOKENS,
  );
  const skippedCount = sections.length - validSections.length;

  if (skippedCount > 0) {
    console.log(
      `[parseMarkdownSections] Skipped ${skippedCount} sections with < ${MIN_SECTION_TOKENS} tokens`,
    );
  }

  console.log(
    `[parseMarkdownSections] Parsed ${validSections.length} valid sections for '${docType}'`,
  );

  return validSections;
}

// Helper
function findSentenceBoundary(
  text: string,
  searchStart: number,
  searchEnd: number,
): number {
  const searchRegion = text.slice(searchStart, searchEnd);

  // Look for sentence endings followed by space and capital letter
  const sentencePattern = /[.!?]\s+[A-Z]/g;
  let lastMatch = -1;
  let match;

  while ((match = sentencePattern.exec(searchRegion)) !== null) {
    lastMatch = match.index;
  }

  if (lastMatch !== -1) {
    // Return position after the punctuation and space
    return searchStart + lastMatch + 2;
  }

  // Fall back to paragraph boundary (double newline)
  const paragraphIndex = searchRegion.lastIndexOf("\n\n");
  if (paragraphIndex !== -1) {
    return searchStart + paragraphIndex + 2;
  }

  // Fall back to any newline
  const newlineIndex = searchRegion.lastIndexOf("\n");
  if (newlineIndex !== -1) {
    return searchStart + newlineIndex + 1;
  }

  return -1;
}

function splitTextByTokens(
  text: string,
  maxTokens: number,
  overlapTokens: number,
): string[] {
  const totalTokens = countTokens(text);

  if (totalTokens <= maxTokens) {
    return [text];
  }

  console.log(
    `[splitTextByTokens] Splitting text of ${totalTokens} tokens (max: ${maxTokens}, overlap: ${overlapTokens})`,
  );

  const tokens = tokenizer.encode(text);
  const chunks: string[] = [];
  let start = 0;

  while (start < tokens.length) {
    let end = Math.min(start + maxTokens, tokens.length);

    // Decode the chunk
    let chunkText = decodeTokens(tokens.slice(start, end));

    // If not at the end, try to find a good boundary
    if (end < tokens.length) {
      // Look for sentence boundary in the last 20% of the chunk
      const searchStart = Math.floor(chunkText.length * 0.8);
      const boundaryIndex = findSentenceBoundary(
        chunkText,
        searchStart,
        chunkText.length,
      );

      if (boundaryIndex !== -1 && boundaryIndex > searchStart) {
        chunkText = chunkText.slice(0, boundaryIndex).trim();
      }
    }

    chunks.push(chunkText.trim());

    // Calculate how many tokens we actually used
    const actualTokensUsed = countTokens(chunkText);

    // Move start forward, accounting for overlap
    const advance = Math.max(actualTokensUsed - overlapTokens, 1);
    start += advance;
  }

  console.log(`[splitTextByTokens] Created ${chunks.length} chunks`);
  return chunks;
}

function createChunksFromSections(sections: MarkdownSection[]): Chunk[] {
  console.log(
    `[createChunksFromSections] Processing ${sections.length} sections...`,
  );

  const chunks: Chunk[] = [];
  let globalChunkIndex = 0;

  for (const section of sections) {
    if (section.tokenCount <= MAX_CHUNK_TOKENS) {
      // Section fits in one chunk
      chunks.push({
        text: section.content,
        headerPath: section.headerPath,
        chunkIndex: globalChunkIndex++,
        docType: section.docType,
        tokenCount: section.tokenCount,
      });
    } else {
      // Section needs to be split
      console.log(
        `[createChunksFromSections] Section "${section.headerPath}" has ${section.tokenCount} tokens, splitting...`,
      );

      const textChunks = splitTextByTokens(
        section.content,
        MAX_CHUNK_TOKENS,
        CHUNK_OVERLAP_TOKENS,
      );

      for (let i = 0; i < textChunks.length; i++) {
        const chunkText = textChunks[i];
        chunks.push({
          text: chunkText,
          headerPath: `${section.headerPath} (Part ${i + 1}/${textChunks.length})`,
          chunkIndex: globalChunkIndex++,
          docType: section.docType,
          tokenCount: countTokens(chunkText),
        });
      }
    }
  }

  console.log(
    `[createChunksFromSections] Created ${chunks.length} total chunks`,
  );
  return chunks;
}

export async function chunkAndIngestData(
  data: string,
  opts: { ownner: string; repo: string },
): Promise<string> {
  const { ownner: owner, repo } = opts; // Note: typo in 'ownner' is kept for compatibility

  console.log(`\n${"=".repeat(70)}`);
  console.log(`[chunkAndIngestData] Starting ingestion for ${owner}/${repo}`);
  console.log(`${"=".repeat(70)}`);

  // Step 0: Check if repo already has chunks (skip re-ingestion)
  console.log(`\n[Step 0] Checking if repo already has chunks...`);
  const hasExistingChunks = await repoHasChunks(owner, repo);

  if (hasExistingChunks) {
    console.log(
      `[chunkAndIngestData] Repo ${owner}/${repo} already has chunks. Skipping ingestion.`,
    );
    console.log(`${"=".repeat(70)}\n`);
    return "skipped - already ingested";
  }

  console.log(
    `[chunkAndIngestData] No existing chunks found. Proceeding with ingestion. with length: ${data.length}`,
  );

  // Step 1: Split by document type (------)
  console.log(`\n[Step 1] Splitting by document type...`);
  const documentSections = splitByDocumentType(data);

  if (documentSections.length === 0) {
    console.log(`[chunkAndIngestData] No document sections found. Aborting.`);
    console.log(`${"=".repeat(70)}\n`);
    return "no content to ingest";
  }

  // Step 2: Process each document section
  console.log(`\n[Step 2] Processing document sections...`);
  const allChunks: Chunk[] = [];
  const processedDocTypes: string[] = [];
  let totalSections = 0;
  let totalTokens = 0;

  for (const docSection of documentSections) {
    console.log(`\n  Processing '${docSection.docType}'...`);

    // Parse markdown sections for this document
    const markdownSections = parseMarkdownSections(
      docSection.content,
      docSection.docType,
    );

    if (markdownSections.length === 0) {
      console.log(
        `  [chunkAndIngestData] No valid sections in '${docSection.docType}', skipping.`,
      );
      continue;
    }

    totalSections += markdownSections.length;
    processedDocTypes.push(docSection.docType);

    // Log each section's token count
    for (const section of markdownSections) {
      totalTokens += section.tokenCount;
      console.log(
        `    - "${section.headerPath}" (${section.tokenCount} tokens)`,
      );
    }

    // Create chunks from sections
    const chunks = createChunksFromSections(markdownSections);
    allChunks.push(...chunks);
  }

  if (allChunks.length === 0) {
    console.log(`\n[chunkAndIngestData] No chunks created. Aborting.`);
    console.log(`${"=".repeat(70)}\n`);
    return "no chunks created";
  }

  // Step 3: Generate embeddings for all chunks
  console.log(
    `\n[Step 3] Generating embeddings for ${allChunks.length} chunks...`,
  );
  const texts = allChunks.map((c) => c.text);

  let embeddings: number[][];
  try {
    embeddings = await embedTexts(texts);
    console.log(
      `[chunkAndIngestData] Successfully generated ${embeddings.length} embeddings`,
    );
  } catch (error) {
    console.error(`[chunkAndIngestData] Error generating embeddings:`, error);
    throw error;
  }

  // Step 4: Prepare chunk data for insertion
  console.log(`\n[Step 4] Preparing chunks for database insertion...`);
  const chunkData: ChunkData[] = allChunks.map((chunk, index) => ({
    id: generateChunkId(owner, repo, chunk.chunkIndex),
    text: chunk.text,
    vector: embeddings[index],
    owner: owner,
    repo: repo,
    chunk_index: chunk.chunkIndex,
    header_path: chunk.headerPath,
    doc_type: chunk.docType,
  }));

  // Step 5: Insert into LanceDB
  console.log(
    `\n[Step 5] Inserting ${chunkData.length} chunks into LanceDB...`,
  );
  try {
    await insertChunks(chunkData);
    console.log(`[chunkAndIngestData] Successfully inserted all chunks`);
  } catch (error) {
    console.error(`[chunkAndIngestData] Error inserting chunks:`, error);
    throw error;
  }

  // Summary
  console.log(`\n${"=".repeat(70)}`);
  console.log(`[chunkAndIngestData] Ingestion complete for ${owner}/${repo}`);
  console.log(`[chunkAndIngestData] Summary:`);
  console.log(
    `  - Document types processed: ${processedDocTypes.length} [${processedDocTypes.join(", ")}]`,
  );
  console.log(`  - Total sections parsed: ${totalSections}`);
  console.log(`  - Total chunks created: ${allChunks.length}`);
  console.log(`  - Total tokens processed: ${totalTokens}`);
  console.log(`  - Embeddings generated: ${embeddings.length}`);
  console.log(`${"=".repeat(70)}\n`);

  return `ingested ${allChunks.length} chunks from ${processedDocTypes.length} doc types`;
}
