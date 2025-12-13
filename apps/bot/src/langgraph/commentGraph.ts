import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";
import { searchSimilar } from "@gitbee/vector-db";
import { aiClient, embedTexts } from "@gitbee/ai";
import { ProfessionalitySystemPrompt } from "./systemPrompt/professionalism";
import { ValiditySystemPrompt } from "./systemPrompt/validity";
import { type finalDecisionResult, MODELS } from "./constants";
import { StitchingModelSystemPrompt } from "./systemPrompt/sticher";

export interface CommentCheckResult {
  is_valid: boolean; // handle false
  comment?: string;
}

interface profinaityResult {
  comment_needed: boolean; // handle true
  comment?: string;
}

const CommentStateAnnotation = Annotation.Root({
  // Input context
  commentBody: Annotation<string>,
  issueTitle: Annotation<string>,
  issueBody: Annotation<string>,
  owner: Annotation<string>,
  repo: Annotation<string>,
  issueNumber: Annotation<number>,
  octokit: Annotation<Octokit>,
  senderLogin: Annotation<string>,

  // Computed state
  history: Annotation<string | undefined>,

  // Check results
  //profanityResult
  profanityResult: Annotation<profinaityResult | undefined>,
  validityResult: Annotation<CommentCheckResult | undefined>,

  // Final decision
  finalDecision: Annotation<finalDecisionResult | undefined>,
});

type CommentState = typeof CommentStateAnnotation.State;

async function checkProfanityAndSpamming(state: CommentState): Promise<Partial<CommentState>> {
  const { commentBody } = state;

  const prompt = `User comment: """${commentBody}"""`;

  try {
    const response = await aiClient(MODELS.CHEAP, prompt, ProfessionalitySystemPrompt);
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return { profanityResult: { comment_needed: false, comment: undefined } };
    }

    const result = JSON.parse(jsonMatch[0]) as profinaityResult;
    console.log("Professionality result", result);
    return { profanityResult: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return { profanityResult: { comment_needed: false, comment: undefined } };
  }
}

async function checkCommentValidity(state: CommentState): Promise<Partial<CommentState>> {
  const { owner, repo, issueNumber, octokit, commentBody, issueTitle, issueBody } = state;

  const response = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 20,
    sort: "created",
    direction: "asc",
  });

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

  const queryVector = await embedTexts([commentBody]);

  const vectorSearch = await searchSimilar(queryVector[0], owner, repo, 2);

  const prompt = `Issue Title: """${issueTitle}"""
Issue Body: """${issueBody}"""
User Comment: """${commentBody}"""
Relevant Context from Repository: """${vectorSearch.map((chunk) => chunk.text).join("\n\n---\n\n")}"""
${history ? `Comment History: """${history}"""` : ""} `;

  try {
    const llmResponse = await aiClient(MODELS.CHEAP, prompt, ValiditySystemPrompt);
    const text = llmResponse.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🚨 No JSON found in LLM response:", text);
      return {
        history,
        validityResult: { is_valid: true, comment: undefined },
      };
    }

    const result = JSON.parse(jsonMatch[0]) as CommentCheckResult;
    console.log("validity result", result);
    return { history, validityResult: result };
  } catch (error) {
    console.error("🚨 Failed to parse LLM response:", error);
    return { history, validityResult: { is_valid: true, comment: undefined } };
  }
}

async function makeFinalDecision(state: CommentState): Promise<Partial<CommentState>> {
  const { validityResult, profanityResult, commentBody, senderLogin } = state;

  const prompt = `User comment: """${commentBody}"""
Validity Check Result: ${JSON.stringify(validityResult)}
Profanity/Spamming Check Result: ${JSON.stringify(profanityResult)}

`;

  try {
    const response = await aiClient(MODELS.STANDARD, prompt, StitchingModelSystemPrompt);
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
    console.log("Final Decision", result);
    result.final_comment = result.final_comment.replace(/@username/g, '@'+senderLogin);
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
