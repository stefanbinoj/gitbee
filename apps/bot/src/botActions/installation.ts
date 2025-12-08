import { app } from "@gitbee/octokit";

app.webhooks.on("installation", async ({ octokit, payload }) => {
  if (payload.action === "created") {
    console.log(
      "✅ New installation created for account:",
      (payload.installation.account as any)?.login ||
      (payload.installation.account as any)?.name,
    );
    const repos = await octokit.rest.apps.listReposAccessibleToInstallation();
    console.log(
      "Repositories accessible to the installation:",
      repos.data.repositories.map((r) => r.full_name),
    );
    const targetType = payload.installation.target_type;

    if (targetType === "Organization") {
      // Do something specific for organizations
    } else if (targetType === "User") {
      // Do something specific for users
    }
    const installationId = payload.installation.id;
    const accountId = payload.installation.account?.id;
    const accountLogin =
      (payload.installation.account as any).login ||
      payload.installation.account?.name;

    const repossitorySelection = payload.installation.repository_selection;
    const repositoriesUrl = (payload.installation as any).repositories; // Has id, full_name,

    const targetIds = payload.installation.target_id;

    const sender = payload.sender?.login;
    const senderId = payload.sender?.id;
    const senderType = payload.sender?.type;
  } else if (payload.action === "deleted") {
    console.log(
      "❌ Installation deleted for account:",
      (payload.installation.account as any)?.login ||
      (payload.installation.account as any)?.name,
    );
  }
});

app.webhooks.on(
  "installation_repositories.added",
  async ({ octokit, payload }) => {
    console.log(
      "Repositories added to installation:",
      payload.repositories_added,
    );
  },
);

app.webhooks.on(
  "installation_repositories.removed",
  async ({ octokit, payload }) => {
    console.log(
      "Repositories removed from installation:",
      payload.repositories_removed,
    );
  },
);
