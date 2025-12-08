import { app } from "@gitbee/octokit";

app.webhooks.on("issue_comment.created", ({ octokit, payload }) => {
  console.log("Issue comment created:", payload.comment.body);

  //issue
  const title = payload.issue.title;

  const body = payload.issue.body;
  const issueId = payload.issue.id;

  const issueCreatedBy = payload.issue.user.login;
  const issueState = payload.issue.state;
  const totalComments = payload.issue.comments;

  const repositoryName = payload.repository.name;
  const repositoryId = payload.repository.id;
  const repositoryFullName = payload.repository.full_name;

  //comment
  const commentBody = payload.comment.body;
  const commentedBy = (payload.comment.user as any).login;
  const commentByBot = payload.comment.performed_via_github_app?.slug;

  const organization = payload.organization?.login;

  const sender = payload.sender?.login;
  const installationId = payload.installation?.id;
});

app.webhooks.on("issue_comment.edited", ({ octokit, payload }) => {
  console.log("Issue comment edited:", payload.comment.body);
});
