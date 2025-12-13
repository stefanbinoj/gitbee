export const MODELS = {
  /*
   *     z-ai/glm-4.5-air:free
   *     moonshotai/kimi-k2:free
   *     openai/gpt-oss-120b:free
   */
  CHEAP: "z-ai/glm-4.5-air:free",
  STANDARD: "moonshotai/kimi-k2-thinking",
} as const;

export interface finalDecisionResult {
  final_action: "approve" | "comment";
  final_comment: string;
  should_flag: 0 | 1 | 2;
  reason? : string;
}

export type ModelName = (typeof MODELS)[keyof typeof MODELS];
