import { app } from "@gitbee/octokit";

// Register event handlers
app.webhooks.on("push", async ({ octokit, payload }) => {
  console.log("Push event received:", payload.repository.full_name);
  // Add your bot logic here, e.g., comment on PR, run CI, etc.
});

app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
  console.log("Issue opened:", payload.issue.title);
  // Example: Add a comment
  await octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: "Thanks for opening this issue! A maintainer will review it soon.",
  });
});
