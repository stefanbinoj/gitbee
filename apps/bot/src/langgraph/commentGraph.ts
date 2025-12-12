import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { type Octokit } from "@gitbee/octokit";
import { searchSimilar } from "@gitbee/vector-db";
import { aiClient, embedTexts } from "@gitbee/ai";
import { ProfessionalitySystemPrompt } from "./systemPrompt/professionalism";
import { ValiditySystemPrompt } from "./systemPrompt/validity";
import { type finalDecisionResult, MODELS } from "./constants";

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
  console.log(`[CommentGraph] Retrieved ${vectorSearch.length} similar chunks for validity check`);

  const prompt = `Issue Title: """${issueTitle}"""
Issue Body: """${issueBody}"""
User Comment: """${commentBody}"""
Relevant Context from Repository: """${vectorSearch.map((chunk) => chunk.text).join("\n\n---\n\n")}"""
${history ? `Comment History: """${history}"""` : ""}

Based on the above information, is the user comment relevant and appropriate for the issue? Provide a detailed analysis.`;

  try {
    const llmResponse = await aiClient(MODELS.CHEAP, prompt, ValiditySystemPrompt);
    const text = llmResponse.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[checkCommentValidity] No JSON found in LLM response:", text);
      return {
        history,
        validityResult: { is_valid: true, comment: undefined },
      };
    }

    const result = JSON.parse(jsonMatch[0]) as CommentCheckResult;
    console.log("validity result", result);
    return { history, validityResult: result };
  } catch (error) {
    console.error("[checkCommentValidity] Failed to parse LLM response:", error);
    return { history, validityResult: { is_valid: true, comment: undefined } };
  }
}

async function checkProfanityAndSpamming(state: CommentState): Promise<Partial<CommentState>> {
  const { commentBody } = state;

  const prompt = `User comment: """${commentBody}"""`;

  try {
    const response = await aiClient(MODELS.CHEAP, prompt, ProfessionalitySystemPrompt);
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[checkProfanityAndSpamming] No JSON found in LLM response:", text);
      return { profanityResult: { comment_needed: false, comment: undefined } };
    }

    const result = JSON.parse(jsonMatch[0]) as profinaityResult;
    console.log("Professionality result", result);
    return { profanityResult: result };
  } catch (error) {
    console.error("[checkProfanityAndSpamming] Failed to parse LLM response:", error);
    return { profanityResult: { comment_needed: false, comment: undefined } };
  }
}

async function makeFinalDecision(state: CommentState): Promise<Partial<CommentState>> {
  const { validityResult, profanityResult, commentBody } = state;

  const prompt = `User comment: """${commentBody}"""
Validity Check Result: ${JSON.stringify(validityResult)}
Profanity/Spamming Check Result: ${JSON.stringify(profanityResult)}

Based on the above results, determine the final action to take regarding the user comment. Follow these rules:

1. If neither check flags an issue, set final_action to "approve", final_comment to an empty string, and shouldFlag to 0.
2. If one or both checks flag issues, set final_action to "comment", and construct final_comment using the explanations from the flagged checks. If both checks flag issues, merge the messages concisely (1-3 sentences) without redundancy.
3. Set shouldFlag based on severity:
   - 0 = No issues found
   - 1 = Mild issue (e.g., slight unprofessional tone OR mildly invalid comment)
   - 2 = Extreme issue (e.g., both checks flag major problems, or severe incoherence, harassment, toxicity, or clearly unusable content)
Provide the final decision in the following JSON format:
{
  "final_action": "approve" | "comment",
  "final_comment": string,
  "shouldFlag": 0 | 1 | 2
}
`;

  try {
    const response = await aiClient(MODELS.STANDARD, prompt, ValiditySystemPrompt);
    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[makeFinalDecision] No JSON found in LLM response:", text);
      return {
        finalDecision: {
          final_action: "approve",
          final_comment: "",
          shouldFlag: 0,
        },
      };
    }

    const result = JSON.parse(jsonMatch[0]) as finalDecisionResult;
    console.log("Final Decision", result);
    return { finalDecision: result };
  } catch (error) {
    console.error("[makeFinalDecision] Failed to parse LLM response:", error);
    return {
      finalDecision: {
        final_action: "approve",
        final_comment: "",
        shouldFlag: 0,
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
