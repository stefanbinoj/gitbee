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

  const title = payload.issue.title;
  const body = payload.issue.body;
  const issueId = payload.issue.id;

  const issueCreatedBy = (payload.issue.user as any).login;

  const repositoryName = payload.repository.name;
  const repositoryId = payload.repository.id;

  const organization = payload.organization?.login;

  const sender = payload.sender?.login;
  const installationId = payload.installation?.id;
});

app.webhooks.on("issues.edited", ({ octokit, payload }) => {
  console.log("Issue edited:", payload.issue.title);
});

app.webhooks.on("issues.reopened", ({ octokit, payload }) => {
  console.log("Issue reopened:", payload.issue.title);
});
