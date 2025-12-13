import { commentGraph } from "@/langgraph/commentGraph";
import { app, type Octokit } from "@gitbee/octokit";
import { shouldSkipEvent } from "@/botActions/utils";

import { createReport, updateReportStatus } from "../services/report.service";
import { createWarning } from "../services/warning.service";

function extractCommentContext(payload: any, octokit: any) {
  return {
    authorAssociation: payload.comment.author_association,
    installationId: payload.installation?.id ?? 0,
    commentBody: payload.comment.body ?? "",
    senderLogin: payload.comment.user?.login ?? "unknown",
    issueTitle: payload.issue.title,
    issueBody: payload.issue.body ?? "",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issueNumber: payload.issue.number,
    octokit,
  };
}

async function handleComment(payload: any, octokit: Octokit, action: string) {
  console.log(`[IssueComment] ${action} by ${payload.comment.user?.login}`);

  if (shouldSkipEvent(payload.comment)) {
    console.log("[IssueComment] Skipping - bot or privileged user");
    return;
  }

  // TODO : check if assigning comment

  const context = extractCommentContext(payload, octokit);
  const compiledGraph = commentGraph.compile();

  let reportId: number | undefined;
  try {
    const report = await createReport({
      installationId: context.installationId,
      repositoryId: payload.repository.id,
      repositoryFullName: payload.repository.full_name,
      reportType: "comment_analysis",
      url: payload.comment.html_url,
    });
    reportId = report.id;

    const result = await compiledGraph.invoke(context);
    const finalDecision = result.finalDecision;
    if (finalDecision?.final_action === "comment") {
      let body = finalDecision.final_comment;
      if (finalDecision.should_flag === 1) {
        const warningCount = await createWarning({
          installationId: context.installationId,
          repositoryId: payload.repository.id,
          repositoryFullName: payload.repository.full_name,
          userLogin: payload.comment.user?.login ?? "unknown",
          userId: payload.comment.user?.id ?? 0,
          type: "warning",
          reason: finalDecision.reason!,
          url: payload.comment.html_url,
        });
        body += `\n\n⚠️ **This comment has been flagged by the moderation system. Current warning count: ${warningCount + 1}.** Please review the feedback above and update your comment if needed.`;
      } else if (finalDecision.should_flag === 2) {
        await createWarning({
          installationId: context.installationId,
          repositoryId: payload.repository.id,
          repositoryFullName: payload.repository.full_name,
          userLogin: payload.comment.user?.login ?? "unknown",
          userId: payload.comment.user?.id ?? 0,
          type: "block",
          reason: finalDecision.reason!,
          url: payload.comment.html_url,
        });
        body += `\n\n⛔ **Your account has been blocked due to severe violations of our communication standards.**`;
      }
      await octokit.rest.issues.createComment({
        owner: context.owner,
        repo: context.repo,
        issue_number: context.issueNumber,
        body: body,
      });
    } else if (finalDecision?.final_action === "approve") {
      console.log("[IssueComment] Comment approved, no action taken.");
    }
    updateReportStatus(report.id, "completed");
  } catch (error) {
    console.error("[IssueComment] Graph execution failed:", error);
    if (error instanceof Error && "cause" in error) {
      console.error("[IssueComment] Error cause:", (error as any).cause);
    }
    if (reportId !== undefined) {
      updateReportStatus(reportId, "failed");
    }
  }
}

app.webhooks.on("issue_comment.created", async ({ payload, octokit }) => {
  await handleComment(payload, octokit, "Created");
});

app.webhooks.on("issue_comment.edited", async ({ payload, octokit }) => {
  await handleComment(payload, octokit, "Edited");
});
