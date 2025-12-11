import { app } from "@gitbee/octokit";
import { pullRequestGraph } from "@/langgraph/pullRequestGraph";
import { shouldSkipEvent } from "@/botActions/utils";

function extractPRContext(payload: any, octokit: any) {
  return {
    authorAssociation: payload.pull_request.author_association,
    installationId: payload.installation?.id ?? 0,
    prTitle: payload.pull_request.title,
    prBody: payload.pull_request.body ?? "",
    senderLogin: payload.sender?.login ?? "unknown",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    prNumber: payload.pull_request.number,
    octokit,
  };
}

async function handlePR(payload: any, octokit: any, action: string) {
  console.log(`[PullRequest] ${action}: ${payload.pull_request.title}`);

  if (shouldSkipEvent(payload.pull_request)) {
    console.log("[PullRequest] Skipping - bot or privileged user");
    return;
  }

  const context = extractPRContext(payload, octokit);
  const compiledGraph = pullRequestGraph.compile();

  try {
    const result = await compiledGraph.invoke(context);
    console.log("[PullRequest] Graph result:", result);
  } catch (error) {
    console.error("[PullRequest] Graph execution failed:", error);
  }
}

app.webhooks.on("pull_request.opened", async ({ payload, octokit }) => {
  await handlePR(payload, octokit, "Opened");
});

app.webhooks.on("pull_request.edited", async ({ payload, octokit }) => {
  await handlePR(payload, octokit, "Edited");
});

app.webhooks.on("pull_request.reopened", async ({ payload, octokit }) => {
  await handlePR(payload, octokit, "Reopened");
});
