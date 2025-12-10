import "dotenv/config";
import { type ModelMessage, generateText, embedMany } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export async function aiClient(
  prompt: string,
  systemPrompt: string,
  outputSchema: any,
  messages: ModelMessage[] = [],
) {
  const response = await generateText({
    model: openrouter.chat("openai/gpt-5.1-chat"),
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
      { role: "user", content: prompt },
    ],
    output: outputSchema,
  });

  return response;
}

/**
 * Generate embeddings for multiple text chunks using text-embedding-3-small
 * Returns an array of embedding vectors (1536 dimensions each)
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const { embeddings } = await embedMany({
    model: openrouter.textEmbeddingModel("openai/text-embedding-3-small"),
    values: texts,
  });

  return embeddings;
}

/** Embedding dimensions for text-embedding-3-small */
export const EMBEDDING_DIMENSIONS = 1536;
