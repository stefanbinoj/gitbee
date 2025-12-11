import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";

export interface CommentCheckResult {
  isValid: boolean;
  reason?: string;
  confidence: number;
}

const CommentStateAnnotation = Annotation.Root({
  // Input context
  authorAssociation: Annotation<string>,
  installationId: Annotation<number>,
  commentBody: Annotation<string>,
  senderLogin: Annotation<string>,
  issueTitle: Annotation<string>,
  issueBody: Annotation<string>,
  owner: Annotation<string>,
  repo: Annotation<string>,
  issueNumber: Annotation<number>,
  octokit: Annotation<Octokit>,

  // Computed state
  history: Annotation<string | undefined>,

  // Check results
  validityResult: Annotation<CommentCheckResult | undefined>,
  profanityResult: Annotation<CommentCheckResult | undefined>,

  // Final decision
  finalDecision: Annotation<
    | {
        shouldFlag: boolean;
        reason: string;
        action: "none" | "warn" | "hide" | "report";
      }
    | undefined
  >,
});

type CommentState = typeof CommentStateAnnotation.State;

async function checkCommentValidity(
  state: CommentState,
): Promise<Partial<CommentState>> {
  const {
    owner,
    repo,
    issueNumber,
    octokit,
    commentBody,
    issueTitle,
    issueBody,
  } = state;

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 20,
      sort: "created",
      direction: "asc",
    },
  );

  let history: string | undefined;

  if (response.data.length > 0) {
    const commentThread = response.data
      .map((comment: any, index: number) => {
        const author = comment.user?.login ?? "unknown";
        const createdAt = new Date(comment.created_at).toLocaleString();
        const body = comment.body ?? "";
        return `Comment ${index + 1} by @${author} (${createdAt}):\n${body}`;
      })
      .join("\n\n---\n\n");

    history = `Previous comments in this thread:\n\n${commentThread}`;
  }

  // TODO: Add RAG search for repository context
  // TODO: Call LLM to validate comment relevance
  // For now, return a placeholder result
  const validityResult: CommentCheckResult = {
    isValid: true,
    confidence: 0.8,
    reason: "Comment appears relevant to the issue",
  };

  return { history, validityResult };
}

/**
 * Checks for profanity, spam, and low-quality content
 */
async function checkProfanityAndSpamming(
  state: CommentState,
): Promise<Partial<CommentState>> {
  const { commentBody, senderLogin } = state;

  // TODO: Implement profanity detection
  // TODO: Check for spam patterns (repeated content, excessive links, etc.)
  // TODO: Detect self-assignment requests
  // TODO: Call LLM for nuanced detection

  const profanityResult: CommentCheckResult = {
    isValid: true,
    confidence: 0.9,
    reason: "No profanity or spam detected",
  };

  return { profanityResult };
}

async function makeFinalDecision(
  state: CommentState,
): Promise<Partial<CommentState>> {
  const { validityResult, profanityResult, commentBody, senderLogin } = state;

  // Default to safe values if checks didn't run
  const validity = validityResult ?? { isValid: true, confidence: 0.5 };
  const profanity = profanityResult ?? { isValid: true, confidence: 0.5 };

  // Determine if comment should be flagged
  const shouldFlag = !validity.isValid || !profanity.isValid;

  // Determine appropriate action
  let action: "none" | "warn" | "hide" | "report" = "none";
  let reason = "Comment passed all checks";

  if (!profanity.isValid) {
    action = profanity.confidence > 0.9 ? "hide" : "warn";
    reason = profanity.reason ?? "Profanity or spam detected";
  } else if (!validity.isValid) {
    action = "warn";
    reason = validity.reason ?? "Comment may not be relevant";
  }

  // TODO: Call LLM to make nuanced final decision
  // combining both check results with full context

  const finalDecision = {
    shouldFlag,
    reason,
    action,
  };

  console.log(
    `[CommentGraph] Final decision for @${senderLogin}:`,
    finalDecision,
  );

  return { finalDecision };
}

// --- Graph Definition ---
export const commentGraph = new StateGraph(CommentStateAnnotation)
  .addNode("checkValidity", checkCommentValidity)
  .addNode("checkProfanity", checkProfanityAndSpamming)
  .addNode("decide", makeFinalDecision)
  .addEdge(START, "checkValidity")
  .addEdge(START, "checkProfanity")
  .addEdge("checkValidity", "decide")
  .addEdge("checkProfanity", "decide")
  .addEdge("decide", END);

// Export types for use in handlers
export type { CommentState };
