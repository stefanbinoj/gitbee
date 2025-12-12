export const MODELS = {
  /*
   *     z-ai/glm-4.5-air:free
   *     moonshotai/kimi-k2:free
   *     openai/gpt-oss-120b:free
   */
  CHEAP: "moonshotai/kimi-k2-thinking",
  STANDARD: "moonshotai/kimi-k2-thinking",
} as const;

export type ModelName = (typeof MODELS)[keyof typeof MODELS];
