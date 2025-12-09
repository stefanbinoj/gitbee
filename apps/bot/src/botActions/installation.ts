import { app } from "@gitbee/octokit";
import {
  db,
  installationSchema,
  installationRepositoriesSchema,
} from "@gitbee/db";
import { eq } from "drizzle-orm";
import { loadContributingMdFileData } from "./helper/loadContributingMdFiles";

app.webhooks.on("installation", async ({ octokit, payload }) => {
  const targetType = payload.installation.target_type as
    | "User"
    | "Organization";

  const installationId = payload.installation.id;
  const targetId = payload.installation.account!.id;
  const targetLogin = (payload.installation.account as any).login as string;

  const repossitorySelection = payload.installation.repository_selection;
  const repositoriesSelected = payload.repositories || [];

  const sender = payload.sender?.login;
  const senderId = payload.sender?.id;
  const senderType = payload.sender?.type as
    | "User"
    | "Organization"
    | "Bot"
    | undefined;

  if (payload.action === "created") {
    console.log("✅ New installation created for account:", targetLogin);

    // Check if installation already exists
    const existingInstallation = await db.query.installationSchema.findFirst({
      where: eq(installationSchema.targetId, targetId),
    });
    console.log("Is this a reinstallation?", !!existingInstallation);

    if (existingInstallation) {
      // Reactivate existing installation
      await db
        .update(installationSchema)
        .set({
          isRemoved: false,
          removedAt: null,
          installationId: installationId,
          targetType: targetType,
          targetLogin: targetLogin,
          repositorySelection: repossitorySelection,
          senderLogin: sender,
          senderId: senderId,
          senderType: senderType,
          updatedAt: new Date(),
        })
        .where(eq(installationSchema.targetId, targetId));

      // Upsert repositories - insert or update if exists
      await Promise.all(
        repositoriesSelected.map((repo: any) =>
          db
            .insert(installationRepositoriesSchema)
            .values({
              targetId: targetId,
              repositoryId: repo.id,
              repositoryFullName: repo.full_name,
              repositoryVisibility: repo.private ? "private" : "public",
            })
            .onConflictDoUpdate({
              target: installationRepositoriesSchema.repositoryId,
              set: {
                isRemoved: false,
                removedAt: null,
                repositoryFullName: repo.full_name,
                repositoryVisibility: repo.private ? "private" : "public",
                targetId: targetId,
              },
            }),
        ),
      );
    } else {
      // Insert new installation
      await db.insert(installationSchema).values({
        installationId: installationId,
        targetType: targetType,
        targetLogin: targetLogin,
        targetId: targetId,
        repositorySelection: repossitorySelection,
        senderLogin: sender,
        senderId: senderId,
        senderType: senderType,
      });

      // Insert all repositories in parallel
      await Promise.all(
        repositoriesSelected.map((repo: any) =>
          db.insert(installationRepositoriesSchema).values({
            targetId: targetId,
            repositoryId: repo.id,
            repositoryFullName: repo.full_name,
            repositoryVisibility: repo.private ? "private" : "public",
          }),
        ),
      );
    }

    for (const repo of repositoriesSelected) {
      const [owner, repoName] = repo.full_name.split("/");
      const contributingData = await loadContributingMdFileData(
        octokit,
        owner,
        repoName,
      );
    }

    // await Promise.all(
    //   repositoriesSelected.map(async (repo: any) => {
    //     const contributingData = await loadContributingMdFileData(
    //       octokit,
    //       repo.owner.login,
    //       repo.name,
    //     );
    // )
    // );
  } else if (payload.action === "deleted") {
    console.log("❌ Installation deleted for account:", targetLogin);

    await db
      .update(installationSchema)
      .set({
        isRemoved: true,
        removedAt: new Date(),
      })
      .where(eq(installationSchema.targetId, targetId));
    await db
      .update(installationRepositoriesSchema)
      .set({
        isRemoved: true,
        removedAt: new Date(),
      })
      .where(eq(installationRepositoriesSchema.targetId, targetId));
  }
});

app.webhooks.on(
  "installation_repositories.added",
  async ({ octokit, payload }) => {
    const targetId = payload.installation.account!.id;
    const repositoriesAdded = payload.repositories_added || [];
    await Promise.all(
      repositoriesAdded.map(async (repo: any) => {
        const existingRepository =
          await db.query.installationRepositoriesSchema.findFirst({
            where: eq(installationRepositoriesSchema.repositoryId, repo.id),
          });

        if (existingRepository) {
          // Reactivate existing repository
          await db
            .update(installationRepositoriesSchema)
            .set({
              isRemoved: false,
              removedAt: null,
              repositoryFullName: repo.full_name,
              repositoryVisibility: repo.private ? "private" : "public",
              targetId: targetId,
            })
            .where(eq(installationRepositoriesSchema.repositoryId, repo.id));
        } else {
          // Insert new repository
          await db.insert(installationRepositoriesSchema).values({
            targetId: targetId,
            repositoryId: repo.id,
            repositoryFullName: repo.full_name,
            repositoryVisibility: repo.private ? "private" : "public",
          });
          const [owner, repoName] = repo.full_name.split("/");
          const contributingData = await loadContributingMdFileData(
            octokit,
            owner,
            repoName,
          );
        }
      }),
    );
  },
);

app.webhooks.on("installation_repositories.removed", async ({ payload }) => {
  const repositoriesRemoved = payload.repositories_removed || [];
  await Promise.all(
    repositoriesRemoved.map((repo: any) =>
      db
        .update(installationRepositoriesSchema)
        .set({
          isRemoved: true,
          removedAt: new Date(),
        })
        .where(eq(installationRepositoriesSchema.repositoryId, repo.id)),
    ),
  );
});
