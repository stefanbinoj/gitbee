import { app } from "@gitbee/octokit";
import type { Octokit } from "@gitbee/octokit";
import {
  installationService,
  repositoryService,
  ingestionService,
} from "@/botActions/services";
import type {
  InstallationData,
  RepositoryData,
  TargetType,
  SenderType,
  RepositorySelection,
  WebhookRepository,
} from "@/botActions/types";

function toRepositoryData(
  repo: WebhookRepository,
  targetId: number
): RepositoryData {
  return {
    targetId,
    repositoryId: repo.id,
    repositoryFullName: repo.full_name,
    repositoryVisibility: repo.private ? "private" : "public",
  };
}

async function processRepository(
  octokit: Octokit,
  repo: WebhookRepository,
  installationId: number,
  targetId: number,
  isNew: boolean
): Promise<void> {
  const [owner, repoName] = repo.full_name.split("/");
  const repoData = toRepositoryData(repo, targetId);

  if (isNew) {
    await repositoryService.createRepository(repoData);
  } else {
    await repositoryService.reactivateRepository(repo.id, repoData);
  }

  if (isNew) {
    console.log(`[Installation] Starting ingestion for ${repo.full_name}`);
    await ingestionService.ingestRepositoryWithReport(
      octokit,
      installationId,
      targetId,
      repo.id,
      owner,
      repoName
    );
  }
}

async function handleInstallationCreated(
  octokit: Octokit,
  installationData: InstallationData,
  repositories: WebhookRepository[]
): Promise<void> {
  console.log(
    `[Installation] New installation for: ${installationData.targetLogin}`
  );

  const existing = await installationService.findInstallationByTargetId(
    installationData.targetId
  );

  if (existing) {
    // Reactivate existing installation
    await installationService.reactivateInstallation(
      installationData.targetId,
      installationData
    );

    // Process each repository
    for (const repo of repositories) {
      const existingRepo = await repositoryService.findRepositoryById(repo.id);
      await processRepository(
        octokit,
        repo,
        installationData.installationId,
        installationData.targetId,
        !existingRepo
      );
    }
  } else {
    // Create new installation
    await installationService.createInstallation(installationData);

    // Insert all repositories
    for (const repo of repositories) {
      await processRepository(
        octokit,
        repo,
        installationData.installationId,
        installationData.targetId,
        true
      );
    }
  }
}

async function handleInstallationDeleted(targetId: number): Promise<void> {
  console.log(`[Installation] Installation deleted for target: ${targetId}`);
  await installationService.markInstallationRemoved(targetId);
  await repositoryService.markAllRepositoriesRemoved(targetId);
}

// Register webhook handlers
app.webhooks.on("installation", async ({ octokit, payload }) => {
  const account = payload.installation.account;
  if (!account) {
    console.error("[Installation] No account in payload");
    return;
  }

  // Get login - handle both user and organization accounts
  const login = "login" in account ? account.login : account.name;

  const installationData: InstallationData = {
    installationId: payload.installation.id,
    targetType: payload.installation.target_type as TargetType,
    targetId: account.id,
    targetLogin: login,
    repositorySelection: payload.installation
      .repository_selection as RepositorySelection,
    senderLogin: payload.sender?.login,
    senderId: payload.sender?.id,
    senderType: payload.sender?.type as SenderType | undefined,
  };

  const repositories = (payload.repositories || []) as WebhookRepository[];

  if (payload.action === "created") {
    await handleInstallationCreated(
      octokit as Octokit,
      installationData,
      repositories
    );
  } else if (payload.action === "deleted") {
    await handleInstallationDeleted(installationData.targetId);
  }
});

app.webhooks.on(
  "installation_repositories.added",
  async ({ octokit, payload }) => {
    const account = payload.installation.account;
    if (!account) {
      console.error("[Installation] No account in payload");
      return;
    }

    const targetId = account.id;
    const installationId = payload.installation.id;
    const repositoriesAdded = (payload.repositories_added ||
      []) as WebhookRepository[];

    console.log(
      `[Installation] Repositories added: ${repositoriesAdded.length}`
    );

    for (const repo of repositoriesAdded) {
      const existingRepo = await repositoryService.findRepositoryById(repo.id);
      await processRepository(
        octokit as Octokit,
        repo,
        installationId,
        targetId,
        !existingRepo
      );
    }
  }
);

app.webhooks.on("installation_repositories.removed", async ({ payload }) => {
  const repositoriesRemoved = (payload.repositories_removed ||
    []) as WebhookRepository[];

  console.log(
    `[Installation] Repositories removed: ${repositoriesRemoved.length}`
  );

  for (const repo of repositoriesRemoved) {
    await repositoryService.markRepositoryRemoved(repo.id);
  }
});
