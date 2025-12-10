import { app } from "@gitbee/octokit";

// Handle new discussions
app.webhooks.on("discussion.created", async ({ payload }) => {
  console.log(`[Discussion] Created: ${payload.discussion.title}`);
});

// Handle discussion edits
app.webhooks.on("discussion.edited", async ({ payload }) => {
  console.log(`[Discussion] Edited: ${payload.discussion.title}`);
});

// Handle reopened discussions
app.webhooks.on("discussion.reopened", async ({ payload }) => {
  console.log(`[Discussion] Reopened: ${payload.discussion.title}`);
});

// Handle new discussion comments
app.webhooks.on("discussion_comment.created", async ({ payload }) => {
  console.log(`[DiscussionComment] Created on: ${payload.discussion.title}`);
});

// Handle discussion comment edits
app.webhooks.on("discussion_comment.edited", async ({ payload }) => {
  console.log(`[DiscussionComment] Edited on: ${payload.discussion.title}`);
});
