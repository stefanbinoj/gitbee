import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";

export interface IssueCheckResult {
  isValid: boolean;
  reason?: string;
  confidence: number;
}

const IssueStateAnnotation = Annotation.Root({
  authorAssociation: Annotation<string>,
  installationId: Annotation<number>,
  issueTitle: Annotation<string>,
  issueBody: Annotation<string>,
  senderLogin: Annotation<string>,
  owner: Annotation<string>,
  repo: Annotation<string>,
  issueNumber: Annotation<number>,
  octokit: Annotation<Octokit>,

  similarIssues: Annotation<string[] | undefined>,

  qualityResult: Annotation<IssueCheckResult | undefined>,
  duplicateResult: Annotation<IssueCheckResult | undefined>,

  finalDecision: Annotation<
    | {
        shouldFlag: boolean;
        reason: string;
        action: "none" | "warn" | "label" | "close";
      }
    | undefined
  >,
});

type IssueState = typeof IssueStateAnnotation.State;

async function checkIssueQuality(
  state: IssueState,
): Promise<Partial<IssueState>> {
  const qualityResult: IssueCheckResult = {
    isValid: true,
    confidence: 0.8,
    reason: "Issue is well-formed",
  };

  return { qualityResult };
}

async function checkDuplicates(
  state: IssueState,
): Promise<Partial<IssueState>> {
  const duplicateResult: IssueCheckResult = {
    isValid: true,
    confidence: 0.8,
    reason: "No duplicates found",
  };

  return { similarIssues: [], duplicateResult };
}

async function makeFinalDecision(
  state: IssueState,
): Promise<Partial<IssueState>> {
  const { qualityResult, duplicateResult, senderLogin } = state;

  const quality = qualityResult ?? { isValid: true, confidence: 0.5 };
  const duplicate = duplicateResult ?? { isValid: true, confidence: 0.5 };

  const shouldFlag = !quality.isValid || !duplicate.isValid;

  let action: "none" | "warn" | "label" | "close" = "none";
  let reason = "Issue passed all checks";

  if (!duplicate.isValid) {
    action = duplicate.confidence > 0.9 ? "close" : "label";
    reason = duplicate.reason ?? "Possible duplicate issue";
  } else if (!quality.isValid) {
    action = "warn";
    reason = quality.reason ?? "Issue quality could be improved";
  }

  const finalDecision = { shouldFlag, reason, action };
  console.log(
    `[IssueGraph] Final decision for @${senderLogin}:`,
    finalDecision,
  );

  return { finalDecision };
}

export const issueGraph = new StateGraph(IssueStateAnnotation)
  .addNode("checkQuality", checkIssueQuality)
  .addNode("checkDuplicates", checkDuplicates)
  .addNode("finalDecision", makeFinalDecision)
  .addEdge(START, "checkQuality")
  .addEdge(START, "checkDuplicates")
  .addEdge("checkQuality", "finalDecision")
  .addEdge("checkDuplicates", "finalDecision")
  .addEdge("finalDecision", END);

export type { IssueState };
