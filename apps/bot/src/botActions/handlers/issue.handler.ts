import { app, type Octokit } from "@gitbee/octokit";
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

async function handleIssue(payload: any, octokit: Octokit, action: string) {
  console.log(`[Issue] ${action} by ${payload.issue.user.login} - #${payload.issue.number}: ${payload.issue.title}`);

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
      url: payload.issue.html_url,
    });
    reportId = report.id;

    const result = await compiledGraph.invoke(context);
    const finalDecision = result.finalDecision;
    if (finalDecision?.final_action === "comment") {
      let body = finalDecision.final_comment;

      await octokit.rest.issues.createComment({
        owner: context.owner,
        repo: context.repo,
        issue_number: context.issueNumber,
        body: body,
      });

      if (finalDecision.should_flag === 2) {
        await octokit.rest.issues.update({
          owner: context.owner,
          repo: context.repo,
          issue_number: context.issueNumber,
          state: "closed",
        });
      }
    } else if (finalDecision?.final_action === "approve") {
      console.log("[Issue] Issue approved, no action taken.");
    }
    updateReportStatus(report.id, "completed");
  } catch (error) {
    console.error("[Issue] Graph execution failed:", error);
    if (error instanceof Error && "cause" in error) {
      console.error("[Issue] Error cause:", (error as any).cause);
    }
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
