import { app } from "@gitbee/octokit";
import {
  db, installationSchema, installationRepositoriesSchema
} from "@gitbee/db";
import { eq } from "drizzle-orm";
import { loadContributingMdFileData } from "./helper/loadContributingMdFiles";

app.webhooks.on("installation", async ({ octokit, payload }) => {
  const targetType = payload.installation.target_type as "User" | "Organization";

  const installationId = payload.installation.id;
  const targetId = payload.installation.account!.id;
  const targetLogin = (payload.installation.account as any).login as string;

  const repossitorySelection = payload.installation.repository_selection;
  const repositoriesSelected = (payload.installation as any).repositories; // Has id, full_name,


  const sender = payload.sender?.login;
  const senderId = payload.sender?.id;
  const senderType = payload.sender?.type as "User" | "Organization" | "Bot" | undefined;

  if (payload.action === "created") {
    console.log(
      "✅ New installation created for account:",
      (payload.installation.account as any)?.login,
    );
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
          installationId: installationId,
          repositoryId: repo.id,
          repositoryFullName: repo.full_name,
          repositoryVisibility: repo.visibility,
        })
      )
    );




  } else if (payload.action === "deleted") {
    console.log("❌ Installation deleted for account:", targetLogin);

    await db
      .update(installationSchema)
      .set({
        isRemoved: true,
        removedAt: new Date(),
      })
      .where(eq(installationSchema.installationId, installationId));
    await db
      .update(installationRepositoriesSchema)
      .set({
        isRemoved: true,
        removedAt: new Date(),
      })
      .where(eq(installationRepositoriesSchema.installationId, installationId));
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
