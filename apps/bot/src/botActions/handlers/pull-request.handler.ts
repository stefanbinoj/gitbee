import { app } from "@gitbee/octokit";

// Handle new pull requests
app.webhooks.on("pull_request.opened", async ({ payload }) => {
  console.log(`[PullRequest] Opened: ${payload.pull_request.title}`);
});

// Handle pull request edits
app.webhooks.on("pull_request.edited", async ({ payload }) => {
  console.log(`[PullRequest] Edited: ${payload.pull_request.title}`);
});

// Handle reopened pull requests
app.webhooks.on("pull_request.reopened", async ({ payload }) => {
  console.log(`[PullRequest] Reopened: ${payload.pull_request.title}`);
});
