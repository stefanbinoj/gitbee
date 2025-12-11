import { commentGraph } from "@/langgraph/commentGraph";
import { app, type Octokit } from "@gitbee/octokit";
import { shouldSkipEvent } from "@/botActions/utils";

function extractCommentContext(payload: any, octokit: any) {
  return {
    authorAssociation: payload.comment.author_association,
    installationId: payload.installation?.id ?? 0,
    commentBody: payload.comment.body ?? "",
    senderLogin: payload.comment.user?.login ?? "unknown",
    issueTitle: payload.issue.title,
    issueBody: payload.issue.body ?? "",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issueNumber: payload.issue.number,
    octokit,
  };
}

async function handleComment(payload: any, octokit: Octokit, action: string) {
  console.log(`[IssueComment] ${action} by ${payload.comment.user?.login}`);

  if (shouldSkipEvent(payload.comment)) {
    console.log("[IssueComment] Skipping - bot or privileged user");
    return;
  }

  const context = extractCommentContext(payload, octokit);
  const compiledGraph = commentGraph.compile();

  try {
    const result = await compiledGraph.invoke(context);
    console.log("[IssueComment] Graph result:", result);
  } catch (error) {
    console.error("[IssueComment] Graph execution failed:", error);
  }
}

app.webhooks.on("issue_comment.created", async ({ payload, octokit }) => {
  await handleComment(payload, octokit, "Created");
});

app.webhooks.on("issue_comment.edited", async ({ payload, octokit }) => {
  await handleComment(payload, octokit, "Edited");
});
