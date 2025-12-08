import { app } from "@gitbee/octokit";

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

// Pull request events
app.webhooks.on("pull_request.opened", ({ octokit, payload }) => {
  console.log("Pull request opened:", payload.pull_request.title);
  console.log("Pull request opened:");
});

app.webhooks.on("pull_request.edited", ({ octokit, payload }) => {
  console.log("Pull request edited:", payload.pull_request.title);
  console.log("Pull request edited:");
});

app.webhooks.on("pull_request.reopened", ({ octokit, payload }) => {
  console.log("Pull request reopened:", payload.pull_request.title);
  console.log("Pull request reopened:");
});

// Issue events
app.webhooks.on("issues.opened", ({ octokit, payload }) => {
  console.log("Issue opened:", payload.issue.title);
  console.log("Issue opened:");
});

app.webhooks.on("issues.edited", ({ octokit, payload }) => {
  console.log("Issue edited:", payload.issue.title);
  console.log("Issue edited:");
});

app.webhooks.on("issues.reopened", ({ octokit, payload }) => {
  console.log("Issue reopened:", payload.issue.title);
  console.log("Issue reopened:");
});

// Issue comment events
app.webhooks.on("issue_comment.created", ({ octokit, payload }) => {
  console.log("Issue comment created:", payload.comment.body);
  console.log("Issue comment created:");
});

app.webhooks.on("issue_comment.edited", ({ octokit, payload }) => {
  console.log("Issue comment edited:", payload.comment.body);
  console.log("Issue comment edited:");
});

// Discussion events
app.webhooks.on("discussion.created", ({ octokit, payload }) => {
  console.log("Discussion created:", payload);
  console.log("Discussion created:");
});

app.webhooks.on("discussion.edited", ({ octokit, payload }) => {
  console.log("Discussion comment created:", payload);
  console.log("Discussion comment created:");
});

app.webhooks.on("discussion.reopened", ({ octokit, payload }) => {
  console.log("Discussion comment created:", payload);
  console.log("Discussion comment created:");
});

// Discussion comment events
app.webhooks.on("discussion_comment.created", ({ octokit, payload }) => {
  console.log("Discussion comment created:", payload);
  console.log("Discussion comment created:");
});
app.webhooks.on("discussion_comment.edited", ({ octokit, payload }) => {
  console.log("Discussion comment created:", payload);
  console.log("Discussion comment created:");
});
