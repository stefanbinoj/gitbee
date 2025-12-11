import type { ContentChunk, DocumentSection } from "@/botActions/types";
import { MAX_CHUNK_TOKENS, CHUNK_OVERLAP_TOKENS } from "@/botActions/constants";
import { countTokens, encodeText, decodeTokens } from "./tokenizer";
import { splitByDocumentType } from "./markdown";

function findSentenceBoundary(
  text: string,
  searchStart: number,
  searchEnd: number
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
    return searchStart + lastMatch + 2;
  }

  // Fall back to paragraph boundary
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
  overlapTokens: number
): string[] {
  const totalTokens = countTokens(text);

  if (totalTokens <= maxTokens) {
    return [text];
  }

  const tokens = encodeText(text);
  const chunks: string[] = [];
  let start = 0;

  while (start < tokens.length) {
    const end = Math.min(start + maxTokens, tokens.length);
    let chunkText = decodeTokens(tokens.slice(start, end));

    // Try to find a good boundary
    if (end < tokens.length) {
      const searchStart = Math.floor(chunkText.length * 0.8);
      const boundaryIndex = findSentenceBoundary(
        chunkText,
        searchStart,
        chunkText.length
      );

      if (boundaryIndex !== -1 && boundaryIndex > searchStart) {
        chunkText = chunkText.slice(0, boundaryIndex).trim();
      }
    }

    chunks.push(chunkText.trim());

    const actualTokensUsed = countTokens(chunkText);
    const advance = Math.max(actualTokensUsed - overlapTokens, 1);
    start += advance;
  }

  return chunks;
}

function createChunksFromSections(sections: DocumentSection[]): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  let globalChunkIndex = 0;

  for (const section of sections) {
    const tokenCount = countTokens(section.content);

    if (tokenCount <= MAX_CHUNK_TOKENS) {
      chunks.push({
        text: `${section.docType}: \n${section.content}`,
        chunkIndex: globalChunkIndex++,
        docType: section.docType,
        tokenCount: countTokens(`${section.docType}: \n${section.content}`),
      });
    } else {
      const textChunks = splitTextByTokens(
        section.content,
        MAX_CHUNK_TOKENS,
        CHUNK_OVERLAP_TOKENS
      );

      for (let i = 0; i < textChunks.length; i++) {
        const chunkText = textChunks[i];
        const enrichedText = `${section.docType} (Part ${i + 1}/${textChunks.length}) :\n${chunkText}`;

        chunks.push({
          text: enrichedText,
          chunkIndex: globalChunkIndex++,
          docType: section.docType,
          tokenCount: countTokens(enrichedText),
        });
      }
    }
  }

  return chunks;
}

export function chunkContent(aggregatedContent: string): ContentChunk[] {
  const documentSections = splitByDocumentType(aggregatedContent);

  if (documentSections.length === 0) {
    return [];
  }

  const allChunks: ContentChunk[] = [];

  for (const docSection of documentSections) {
    if (!docSection.content.trim()) {
      continue;
    }

    const chunks = createChunksFromSections([docSection]);
    allChunks.push(...chunks);
  }

  return allChunks;
}
