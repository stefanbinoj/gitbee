import { app } from "@gitbee/octokit";
import { issueGraph } from "@/langgraph/issueGraph";
import { shouldSkipEvent } from "@/botActions/utils";

function extractIssueContext(payload: any, octokit: any) {
  return {
    authorAssociation: payload.issue.author_association,
    installationId: payload.installation?.id ?? 0,
    issueTitle: payload.issue.title,
    issueBody: payload.issue.body ?? "",
    senderLogin: payload.sender?.login ?? "unknown",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issueNumber: payload.issue.number,
    octokit,
  };
}

async function handleIssue(payload: any, octokit: any, action: string) {
  console.log(`[Issue] ${action}: ${payload.issue.title}`);

  if (shouldSkipEvent(payload.issue)) {
    console.log("[Issue] Skipping - bot or privileged user");
    return;
  }

  const context = extractIssueContext(payload, octokit);
  const compiledGraph = issueGraph.compile();

  try {
    const result = await compiledGraph.invoke(context);
    console.log("[Issue] Graph result:", result);
  } catch (error) {
    console.error("[Issue] Graph execution failed:", error);
  }
}

app.webhooks.on("issues.opened", async ({ payload, octokit }) => {
  await handleIssue(payload, octokit, "Opened");
});

app.webhooks.on("issues.edited", async ({ payload, octokit }) => {
  await handleIssue(payload, octokit, "Edited");
});

app.webhooks.on("issues.reopened", async ({ payload, octokit }) => {
  await handleIssue(payload, octokit, "Reopened");
});
