import "dotenv/config";
import { type ModelMessage, generateText } from "ai";
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
