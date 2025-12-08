import { app } from "@gitbee/octokit";

app.webhooks.on("pull_request.opened", ({ octokit, payload }) => {
  console.log("Pull request opened:", payload.pull_request.title);
});

app.webhooks.on("pull_request.edited", ({ octokit, payload }) => {
  console.log("Pull request edited:", payload.pull_request.title);
});

app.webhooks.on("pull_request.reopened", ({ octokit, payload }) => {
  console.log("Pull request reopened:", payload.pull_request.title);
});
