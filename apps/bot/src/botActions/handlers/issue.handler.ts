import { app } from "@gitbee/octokit";

// Handle new issues
app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
  console.log(`[Issue] Opened: ${payload.issue.title}`);

  // Add a welcome comment
  await octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: "Thanks for opening this issue! A maintainer will review it soon.",
  });
});

// Handle issue edits
app.webhooks.on("issues.edited", async ({ payload }) => {
  console.log(`[Issue] Edited: ${payload.issue.title}`);
});

// Handle reopened issues
app.webhooks.on("issues.reopened", async ({ payload }) => {
  console.log(`[Issue] Reopened: ${payload.issue.title}`);
});
