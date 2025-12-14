import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";
import { aiClient } from "@gitbee/ai";
import { ProfessionalitySystemPrompt } from "./systemPrompt/professionalism";
import { PRQualitySystemPrompt } from "./systemPrompt/prQuality";
import { PRStitcherSystemPrompt } from "./systemPrompt/prStitcher";
import { type finalDecisionResult, MODELS } from "./constants";

export interface PRCheckResult {
  is_valid: boolean;
  comment?: string;
}

interface profanityResult {
  comment_needed: boolean;
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

  // Optional: can be passed from handler if fetched
  changedFiles: Annotation<string[] | undefined>,
  linkedIssues: Annotation<string[] | undefined>,

  // Check results
  qualityResult: Annotation<PRCheckResult | undefined>,
  profanityResult: Annotation<profanityResult | undefined>,

  // Final decision
  finalDecision: Annotation<finalDecisionResult | undefined>,
});

type PullRequestState = typeof PullRequestStateAnnotation.State;

async function checkProfanity(
  state: PullRequestState,
): Promise<Partial<PullRequestState>> {
  const { prTitle, prBody } = state;

  const prompt = `PR Title: """${prTitle}"""
PR Body: """${prBody}"""`;

  try {
    const response = await aiClient(
      MODELS.CHEAP,
      prompt,
      ProfessionalitySystemPrompt,
    );
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return { profanityResult: { comment_needed: false, comment: undefined } };
    }

    const result = JSON.parse(jsonMatch[0]) as profanityResult;
    console.log("PR profanity result:", result);
    return { profanityResult: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return { profanityResult: { comment_needed: false, comment: undefined } };
  }
}

async function checkPRQuality(
  state: PullRequestState,
): Promise<Partial<PullRequestState>> {
  const { prTitle, prBody, changedFiles, linkedIssues } = state;

  const prompt = `PR Title: """${prTitle}"""
PR Body: """${prBody}"""
${linkedIssues && linkedIssues.length > 0 ? `Linked Issues: """${linkedIssues.join(", ")}"""` : "Linked Issues: None provided"}
${changedFiles && changedFiles.length > 0 ? `Changed Files: """${changedFiles.join(", ")}"""` : "Changed Files: Not available"}`;

  try {
    const response = await aiClient(
      MODELS.CHEAP,
      prompt,
      PRQualitySystemPrompt,
    );
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return { qualityResult: { is_valid: true, comment: undefined } };
    }

    const result = JSON.parse(jsonMatch[0]) as PRCheckResult;
    console.log("PR quality result:", result);
    return { qualityResult: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return { qualityResult: { is_valid: true, comment: undefined } };
  }
}

async function makeFinalDecision(
  state: PullRequestState,
): Promise<Partial<PullRequestState>> {
  const { qualityResult, profanityResult, prTitle, prBody, senderLogin } =
    state;

  const prompt = `PR Title: """${prTitle}"""
PR Body: """${prBody}"""

Professionalism Check Result: ${JSON.stringify(profanityResult)}
Quality Check Result: ${JSON.stringify(qualityResult)}
`;

  try {
    const response = await aiClient(
      MODELS.STANDARD,
      prompt,
      PRStitcherSystemPrompt,
    );
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return {
        finalDecision: {
          final_action: "approve",
          final_comment: "",
          should_flag: 0,
        },
      };
    }

    const result = JSON.parse(jsonMatch[0]) as finalDecisionResult;
    console.log("PR Final Decision:", result);
    result.final_comment = result.final_comment.replace(
      /@username/g,
      "@" + senderLogin,
    );
    return { finalDecision: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return {
      finalDecision: {
        final_action: "approve",
        final_comment: "",
        should_flag: 0,
      },
    };
  }
}

// --- Graph Definition ---
export const pullRequestGraph = new StateGraph(PullRequestStateAnnotation)
  .addNode("checkProfanity", checkProfanity)
  .addNode("checkQuality", checkPRQuality)
  .addNode("decide", makeFinalDecision)
  .addEdge(START, "checkProfanity")
  .addEdge(START, "checkQuality")
  .addEdge("checkProfanity", "decide")
  .addEdge("checkQuality", "decide")
  .addEdge("decide", END);

// Export types for use in handlers
export type { PullRequestState };
