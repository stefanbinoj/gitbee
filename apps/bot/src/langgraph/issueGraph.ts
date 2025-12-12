import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";
import { type finalDecisionResult, MODELS } from "./constants";

interface issueCheckResult {
  is_valid: boolean;
  comment?: string;
}

interface duplicateCheckResult {
  is_duplicate: boolean;
  similar_issues?: string[];
}

interface profinaityResult {
  comment_needed: boolean; // handle true
  comment?: string;
}

const IssueStateAnnotation = Annotation.Root({
  authorAssociation: Annotation<string>,

  issueTitle: Annotation<string>,
  issueBody: Annotation<string>,

  issueNumber: Annotation<number>,
  octokit: Annotation<Octokit>,

  similarIssues: Annotation<string[] | undefined>,

  profanityResult: Annotation<profinaityResult | undefined>,
  qualityResult: Annotation<issueCheckResult | undefined>,
  duplicateResult: Annotation<duplicateCheckResult | undefined>,

  finalDecision: Annotation<finalDecisionResult | undefined>,
});

type IssueState = typeof IssueStateAnnotation.State;

async function checkIssueQuality(_state: IssueState): Promise<Partial<IssueState>> {
  return {};
}

async function checkDuplicates(_state: IssueState): Promise<Partial<IssueState>> {

  return {};
}

async function makeFinalDecision(_state: IssueState): Promise<Partial<IssueState>> {
  return {};
}

export const issueGraph = new StateGraph(IssueStateAnnotation)
  .addNode("checkQuality", checkIssueQuality)
  .addNode("checkDuplicates", checkDuplicates)
  .addNode("decide", makeFinalDecision)
  .addEdge(START, "checkQuality")
  .addEdge(START, "checkDuplicates")
  .addEdge("checkQuality", "decide")
  .addEdge("checkDuplicates", "decide")
  .addEdge("decide", END);

export type { IssueState };
