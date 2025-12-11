import "dotenv/config";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import {
  type ModelMessage,
  type LanguageModel,
  generateText,
  embedMany,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

process.on("beforeExit", async () => {
  await sdk.shutdown();
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export async function aiClient(
  model: string,
  prompt: string,
  systemPrompt: string,
  outputSchema: any,
  messages: ModelMessage[] = [],
) {
  const response = await generateText({
    model: openrouter.chat(model) as LanguageModel,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
      { role: "user", content: prompt },
    ],
    output: outputSchema,
    experimental_telemetry: { isEnabled: true },
  });

  return response;
}

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

export const EMBEDDING_DIMENSIONS = 1536;
