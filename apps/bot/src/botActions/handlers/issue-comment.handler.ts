import { app } from "@gitbee/octokit";

// Handle new comments
app.webhooks.on("issue_comment.created", async ({ payload }) => {
  console.log(`[IssueComment] Created by ${payload.comment.user?.login}`);

  // Skip bot comments
  if (payload.comment.performed_via_github_app) {
    console.log("[IssueComment] Skipping bot comment");
    return;
  }

  // TODO: Process comment for analysis
});

// Handle comment edits
app.webhooks.on("issue_comment.edited", async ({ payload }) => {
  console.log(`[IssueComment] Edited by ${payload.comment.user?.login}`);
});
