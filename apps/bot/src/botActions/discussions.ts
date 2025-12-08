import { app } from "@gitbee/octokit";

// Discussion events
app.webhooks.on("discussion.created", ({ octokit, payload }) => {
  console.log("Discussion created:", payload);
});

app.webhooks.on("discussion.edited", ({ octokit, payload }) => {
  console.log("Discussion edited:", payload);
});

app.webhooks.on("discussion.reopened", ({ octokit, payload }) => {
  console.log("Discussion reopened:", payload);
});

// Discussion comment events
app.webhooks.on("discussion_comment.created", ({ octokit, payload }) => {
  console.log("Discussion comment created:", payload);
});

app.webhooks.on("discussion_comment.edited", ({ octokit, payload }) => {
  console.log("Discussion comment edited:", payload);
});
