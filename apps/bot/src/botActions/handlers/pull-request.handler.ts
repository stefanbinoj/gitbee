import { app } from "@gitbee/octokit";
import { pullRequestGraph } from "@/langgraph/pullRequestGraph";
import { shouldSkipEvent } from "@/botActions/utils";
import { createReport, updateReportStatus } from "../services/report.service";
import { createWarning } from "../services/warning.service";
import { type Octokit } from "@gitbee/octokit";

function extractPRContext(payload: any, octokit: Octokit) {
  return {
    authorAssociation: payload.pull_request.author_association,
    installationId: payload.installation?.id ?? 0,
    prTitle: payload.pull_request.title,
    prBody: payload.pull_request.body ?? "",
    senderLogin: payload.sender?.login ?? "unknown",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    prNumber: payload.pull_request.number,
    octokit,
    // TODO: Fetch these from GitHub API if needed
    changedFiles: undefined,
    linkedIssues: undefined,
  };
}

async function handlePR(payload: any, octokit: Octokit, action: string) {
  console.log(`[PullRequest] ${action}: ${payload.pull_request.title}`);

  if (shouldSkipEvent(payload.pull_request)) {
    console.log("[PullRequest] Skipping - bot or privileged user");
    return;
  }

  const { id: reportId } = await createReport({
    installationId: payload.installation.id,
    repositoryId: payload.repository.id,
    repositoryFullName: payload.repository.full_name,
    reportType: "pr_analysis",
    url: payload.pull_request.html_url,
  });

  // Keep existing README check
  if (payload.pull_request.title.toLowerCase().includes("readme")) {
    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body: `Hey @${payload.sender?.login}, thanks for your contribution! However, this PR doesn't seem to have any meaningful changes.

Please review our contribution guidelines [here](${payload.repository.html_url}/blob/main/CONTRIBUTING.md) and consider working on other relevant issues [here](${payload.repository.html_url}/issues).`,
    });

    await octokit.rest.pulls.update({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.pull_request.number,
      state: "closed",
    });
    console.log("[PullRequest] Closed PR modifying only README");
    updateReportStatus(reportId, "completed");
    return;
  }

  const context = extractPRContext(payload, octokit);
  const compiledGraph = pullRequestGraph.compile();

  try {
    const result = await compiledGraph.invoke(context);
    const finalDecision = result.finalDecision;
    console.log("[PullRequest] Graph result:", finalDecision);

    if (finalDecision?.final_action === "comment") {
      let body = finalDecision.final_comment;

      if (finalDecision.should_flag === 2) {
        // Severe violation - block user and close PR
        await createWarning({
          installationId: payload.installation.id,
          repositoryId: payload.repository.id,
          repositoryFullName: payload.repository.full_name,
          userLogin: payload.sender.login,
          userId: payload.sender.id,
          type: "block",
          reason:
            finalDecision.reason ?? "Severe policy violation detected in PR.",
          url: payload.pull_request.html_url,
        });

        body += `\n\n⛔ **Your account has been blocked due to severe violations of our communication standards.**`;

        // Post comment and close PR
        await octokit.rest.issues.createComment({
          owner: context.owner,
          repo: context.repo,
          issue_number: context.prNumber,
          body: body,
        });

        await octokit.rest.pulls.update({
          owner: context.owner,
          repo: context.repo,
          pull_number: context.prNumber,
          state: "closed",
        });

        console.log(
          "[PullRequest] PR closed and user blocked due to severe violation",
        );
      } else if (finalDecision.should_flag === 1) {
        // Mild violation - add warning and comment (keep PR open)
        const warningCount = await createWarning({
          installationId: payload.installation.id,
          repositoryId: payload.repository.id,
          repositoryFullName: payload.repository.full_name,
          userLogin: payload.sender.login,
          userId: payload.sender.id,
          type: "warning",
          reason: finalDecision.reason ?? "Policy violation detected in PR.",
          url: payload.pull_request.html_url,
        });

        body += `\n\n⚠️ **This PR has been flagged by the moderation system. Current warning count: ${warningCount + 1}.** Please review the feedback above and update your PR if needed.`;

        await octokit.rest.issues.createComment({
          owner: context.owner,
          repo: context.repo,
          issue_number: context.prNumber,
          body: body,
        });

        console.log("[PullRequest] Warning added for mild violation");
      }
    } else if (finalDecision?.final_action === "approve") {
      console.log("[PullRequest] PR approved, no action taken.");
    }

    updateReportStatus(reportId, "completed");
  } catch (error) {
    updateReportStatus(reportId, "failed");
    console.error("[PullRequest] Graph execution failed:", error);
    if (error instanceof Error && "cause" in error) {
      console.error("[PullRequest] Error cause:", (error as any).cause);
    }
  }
}

app.webhooks.on("pull_request.opened", async ({ payload, octokit }) => {
  await handlePR(payload, octokit, "Opened");
});

app.webhooks.on("pull_request.edited", async ({ payload, octokit }) => {
  await handlePR(payload, octokit, "Edited");
});

app.webhooks.on("pull_request.reopened", async ({ payload, octokit }) => {
  await handlePR(payload, octokit, "Reopened");
});
