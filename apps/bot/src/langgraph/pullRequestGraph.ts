import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";
import { finalDecisionResult } from "./constants";

interface guidelinesResult {
  is_valid: boolean;
  comment?: string;
}

interface profinaityResult {
  comment_needed: boolean; // handle true
  comment?: string;
}

const PullRequestStateAnnotation = Annotation.Root({
  authorAssociation: Annotation<string>,

  prTitle: Annotation<string>,
  prBody: Annotation<string>,
  prNumber: Annotation<number>,

  senderLogin: Annotation<string>,

  owner: Annotation<string>,
  repo: Annotation<string>,
  octokit: Annotation<Octokit>,

  changedFiles: Annotation<string[] | undefined>,
  linkedIssues: Annotation<string[] | undefined>,

  guidelinesResult: Annotation<guidelinesResult | undefined>,
  profanityResult: Annotation<profinaityResult | undefined>,

  finalDecision: Annotation<finalDecisionResult | undefined>,
});

type PullRequestState = typeof PullRequestStateAnnotation.State;

async function checkGuidelines(_state: PullRequestState): Promise<Partial<PullRequestState>> {
  return {};
}

async function checkProfanity(_state: PullRequestState): Promise<Partial<PullRequestState>> {
  const { owner, repo, prNumber, octokit } = _state;

  const filesResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", { owner, repo, pull_number: prNumber, per_page: 100 });

  const changedFiles = filesResponse.data.map((f: any) => f.filename);

  return { changedFiles };
}

async function makeFinalDecision(_state: PullRequestState): Promise<Partial<PullRequestState>> {
  return {};
}

export const pullRequestGraph = new StateGraph(PullRequestStateAnnotation)
  .addNode("checkProfanity", checkProfanity)
  .addNode("checkGuidelines", checkGuidelines)
  .addNode("decide", makeFinalDecision)
  .addEdge(START, "checkProfanity")
  .addEdge(START, "checkGuidelines")
  .addEdge("checkProfanity", "decide")
  .addEdge("checkGuidelines", "decide")
  .addEdge("decide", END);

export type { PullRequestState };
