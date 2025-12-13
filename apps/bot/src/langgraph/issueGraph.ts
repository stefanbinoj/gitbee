import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";
import { aiClient } from "@gitbee/ai";
import { ProfessionalitySystemPrompt } from "./systemPrompt/professionalism";
import { IssueQualitySystemPrompt } from "./systemPrompt/issueQuality";
import { IssueStitcherSystemPrompt } from "./systemPrompt/issueStitcher";
import { type finalDecisionResult, MODELS } from "./constants";

interface issueCheckResult {
  is_valid: boolean;
  comment?: string;
}

interface duplicateCheckResult {
  is_duplicate: boolean;
  similar_issues?: string[];
}

interface profanityResult {
  comment_needed: boolean;
  comment?: string;
}

const IssueStateAnnotation = Annotation.Root({
  // Input context
  authorAssociation: Annotation<string>,
  issueTitle: Annotation<string>,
  issueBody: Annotation<string>,
  issueNumber: Annotation<number>,
  owner: Annotation<string>,
  repo: Annotation<string>,
  senderLogin: Annotation<string>,
  octokit: Annotation<Octokit>,

  // Check results
  profanityResult: Annotation<profanityResult | undefined>,
  qualityResult: Annotation<issueCheckResult | undefined>,
  duplicateResult: Annotation<duplicateCheckResult | undefined>,

  // Final decision
  finalDecision: Annotation<finalDecisionResult | undefined>,
});

type IssueState = typeof IssueStateAnnotation.State;

async function checkProfanity(state: IssueState): Promise<Partial<IssueState>> {
  const { issueTitle, issueBody } = state;

  const prompt = `Issue Title: """${issueTitle}"""
Issue Body: """${issueBody}"""`;

  try {
    const response = await aiClient(
      MODELS.CHEAP,
      prompt,
      ProfessionalitySystemPrompt
    );
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return { profanityResult: { comment_needed: false, comment: undefined } };
    }

    const result = JSON.parse(jsonMatch[0]) as profanityResult;
    console.log("Issue profanity result:", result);
    return { profanityResult: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return { profanityResult: { comment_needed: false, comment: undefined } };
  }
}

async function checkIssueQuality(
  state: IssueState
): Promise<Partial<IssueState>> {
  const { issueTitle, issueBody } = state;

  const prompt = `Issue Title: """${issueTitle}"""
Issue Body: """${issueBody}"""`;

  try {
    const response = await aiClient(
      MODELS.CHEAP,
      prompt,
      IssueQualitySystemPrompt
    );
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return { qualityResult: { is_valid: true, comment: undefined } };
    }

    const result = JSON.parse(jsonMatch[0]) as issueCheckResult;
    console.log("Issue quality result:", result);
    return { qualityResult: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return { qualityResult: { is_valid: true, comment: undefined } };
  }
}

async function checkDuplicates(
  _state: IssueState
): Promise<Partial<IssueState>> {
  // TODO : ingest issue and check for duplicates
  return {
    duplicateResult: { is_duplicate: false },
  };
}

async function makeFinalDecision(
  state: IssueState
): Promise<Partial<IssueState>> {
  const {
    qualityResult,
    profanityResult,
    duplicateResult,
    issueTitle,
    issueBody,
    senderLogin,
  } = state;

  const prompt = `Issue Title: """${issueTitle}"""
Issue Body: """${issueBody}"""

Professionalism Check Result: ${JSON.stringify(profanityResult)}
Quality Check Result: ${JSON.stringify(qualityResult)}
Duplicate Check Result: ${JSON.stringify(duplicateResult)}
`;

  try {
    const response = await aiClient(
      MODELS.STANDARD,
      prompt,
      IssueStitcherSystemPrompt
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
    console.log("Issue Final Decision:", result);
    result.final_comment = result.final_comment.replace(
      /@username/g,
      "@" + senderLogin
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
export const issueGraph = new StateGraph(IssueStateAnnotation)
  .addNode("checkQuality", checkIssueQuality)
  .addNode("checkDuplicates", checkDuplicates)
  .addNode("checkProfanity", checkProfanity)
  .addNode("decide", makeFinalDecision)
  .addEdge(START, "checkQuality")
  .addEdge(START, "checkDuplicates")
  .addEdge(START, "checkProfanity")
  .addEdge("checkQuality", "decide")
  .addEdge("checkDuplicates", "decide")
  .addEdge("checkProfanity", "decide")
  .addEdge("decide", END);

// Export types for use in handlers
export type { IssueState };
