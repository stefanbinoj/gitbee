import { app } from "@gitbee/octokit";
import { issueGraph } from "@/langgraph/issueGraph";
import { shouldSkipEvent } from "@/botActions/utils";
import { createReport, updateReportStatus } from "../services/report.service";
import { createWarning } from "../services/warning.service";

function extractIssueContext(payload: any, octokit: any) {
  return {
    authorAssociation: payload.issue.author_association,
    installationId: payload.installation?.id ?? 0,
    issueTitle: payload.issue.title,
    issueBody: payload.issue.body ?? "",
    senderLogin: payload.sender?.login ?? "unknown",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issueNumber: payload.issue.number,
    octokit,
  };
}

async function handleIssue(payload: any, octokit: any, action: string) {
  console.log(
    `[Issue] ${action} by ${payload.issue.user.login} - #${payload.issue.number}: ${payload.issue.title}`
  );

  if (shouldSkipEvent(payload.issue)) {
    console.log("[Issue] Skipping - bot or privileged user");
    return;
  }

  const context = extractIssueContext(payload, octokit);
  const compiledGraph = issueGraph.compile();

  let reportId: number | undefined;
  try {
    const report = await createReport({
      installationId: context.installationId,
      repositoryId: payload.repository.id,
      repositoryFullName: payload.repository.full_name,
      reportType: "issue_analysis",
      url: payload.comment.html_url,
    });
    reportId = report.id;

    const result = await compiledGraph.invoke(context);
    const finalDecision = result.finalDecision;
    if (finalDecision?.final_action === "comment") {
      let body = finalDecision.final_comment;
      const reason = "";
      if (finalDecision.should_flag === 1) {
        body +=
          "\n \n⚠️ **This comment has been flagged for review by the moderation system.**";
        createWarning({
          installationId: context.installationId,
          repositoryId: payload.repository.id,
          repositoryFullName: payload.repository.full_name,

          userLogin: payload.sender.login,
          userId: payload.sender.id,
          reason: reason,
          type: "warning",
        });
      } else if (finalDecision.should_flag === 2) {
        body +=
          "\n \n🚨 **This comment has been automatically flagged and will be reviewed by the moderation team.**";
        createWarning({
          installationId: context.installationId,
          repositoryId: payload.repository.id,
          repositoryFullName: payload.repository.full_name,

          userLogin: payload.sender.login,
          userId: payload.sender.id,
          reason: reason,
          type: "block",
        });
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
    console.error("[Issue] Graph execution failed:", error);
    if (reportId !== undefined) {
      updateReportStatus(reportId, "failed");
    }
  }
}

app.webhooks.on("issues.opened", async ({ payload, octokit }) => {
  await handleIssue(payload, octokit, "Opened");
});

app.webhooks.on("issues.edited", async ({ payload, octokit }) => {
  await handleIssue(payload, octokit, "Edited");
});

app.webhooks.on("issues.reopened", async ({ payload, octokit }) => {
  await handleIssue(payload, octokit, "Reopened");
});
