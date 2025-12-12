import { SKIPPED_ASSOCIATIONS } from "@/botActions/constants";

export interface SkippablePayload {
  author_association?: string;
  performed_via_github_app?: unknown;
  user?: { type?: string } | null;
}

export function shouldSkipEvent(payload: SkippablePayload): boolean {
  console.log("user association:", payload.author_association);
  if (payload.performed_via_github_app) {
    return true;
  }
  if (payload.user?.type === "Bot") {
    return true;
  }
  if (
    payload.author_association &&
    SKIPPED_ASSOCIATIONS.includes(payload.author_association)
  ) {
    return true;
  }
  return false;
}
