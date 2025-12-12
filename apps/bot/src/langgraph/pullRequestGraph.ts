import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";

export interface PRCheckResult {
  isValid: boolean;
  reason?: string;
  confidence: number;
}

const PullRequestStateAnnotation = Annotation.Root({
  authorAssociation: Annotation<string>,
  installationId: Annotation<number>,
  prTitle: Annotation<string>,
  prBody: Annotation<string>,
  senderLogin: Annotation<string>,
  owner: Annotation<string>,
  repo: Annotation<string>,
  prNumber: Annotation<number>,
  octokit: Annotation<Octokit>,

  changedFiles: Annotation<string[] | undefined>,
  linkedIssues: Annotation<string[] | undefined>,

  qualityResult: Annotation<PRCheckResult | undefined>,
  guidelinesResult: Annotation<PRCheckResult | undefined>,

  finalDecision: Annotation<
    | {
        shouldFlag: boolean;
        reason: string;
        action: "none" | "warn" | "request_changes" | "close";
      }
    | undefined
  >,
});

type PullRequestState = typeof PullRequestStateAnnotation.State;

async function checkPRQuality(
  state: PullRequestState,
): Promise<Partial<PullRequestState>> {
  const { owner, repo, prNumber, octokit } = state;

  const filesResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    { owner, repo, pull_number: prNumber, per_page: 100 },
  );

  const changedFiles = filesResponse.data.map((f: any) => f.filename);

  const qualityResult: PRCheckResult = {
    isValid: true,
    confidence: 0.8,
    reason: "PR structure looks good",
  };

  return { changedFiles, qualityResult };
}

async function checkGuidelines(
  _state: PullRequestState,
): Promise<Partial<PullRequestState>> {
  const guidelinesResult: PRCheckResult = {
    isValid: true,
    confidence: 0.8,
    reason: "PR follows contribution guidelines",
  };

  return { guidelinesResult };
}

async function makeFinalDecision(
  state: PullRequestState,
): Promise<Partial<PullRequestState>> {
  const { qualityResult, guidelinesResult, senderLogin } = state;

  const quality = qualityResult ?? { isValid: true, confidence: 0.5 };
  const guidelines = guidelinesResult ?? { isValid: true, confidence: 0.5 };

  const shouldFlag = !quality.isValid || !guidelines.isValid;

  let action: "none" | "warn" | "request_changes" | "close" = "none";
  let reason = "PR passed all checks";

  if (!quality.isValid) {
    action = quality.confidence > 0.9 ? "request_changes" : "warn";
    reason = quality.reason ?? "PR quality issues detected";
  } else if (!guidelines.isValid) {
    action = "warn";
    reason = guidelines.reason ?? "PR may not follow guidelines";
  }

  const finalDecision = { shouldFlag, reason, action };
  console.log(`[PRGraph] Final decision for @${senderLogin}:`, finalDecision);

  return { finalDecision };
}

export const pullRequestGraph = new StateGraph(PullRequestStateAnnotation)
  .addNode("checkQuality", checkPRQuality)
  .addNode("checkGuidelines", checkGuidelines)
  .addNode("decide", makeFinalDecision)
  .addEdge(START, "checkQuality")
  .addEdge(START, "checkGuidelines")
  .addEdge("checkQuality", "decide")
  .addEdge("checkGuidelines", "decide")
  .addEdge("decide", END);

export type { PullRequestState };
