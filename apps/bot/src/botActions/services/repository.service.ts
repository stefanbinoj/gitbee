import { db, installationRepositoriesSchema } from "@gitbee/db";
import { eq } from "drizzle-orm";
import type { RepositoryData } from "@/botActions/types";

export async function findRepositoryById(repositoryId: number) {
  return db.query.installationRepositoriesSchema.findFirst({
    where: eq(installationRepositoriesSchema.repositoryId, repositoryId),
  });
}

export async function createRepository(data: RepositoryData) {
  return db.insert(installationRepositoriesSchema).values({
    targetId: data.targetId,
    repositoryId: data.repositoryId,
    repositoryFullName: data.repositoryFullName,
    repositoryVisibility: data.repositoryVisibility,
  });
}

export async function reactivateRepository(
  repositoryId: number,
  data: RepositoryData
) {
  return db
    .update(installationRepositoriesSchema)
    .set({
      isRemoved: false,
      removedAt: null,
      repositoryFullName: data.repositoryFullName,
      repositoryVisibility: data.repositoryVisibility,
      targetId: data.targetId,
    })
    .where(eq(installationRepositoriesSchema.repositoryId, repositoryId));
}

export async function markRepositoryRemoved(repositoryId: number) {
  return db
    .update(installationRepositoriesSchema)
    .set({
      isRemoved: true,
      removedAt: new Date(),
    })
    .where(eq(installationRepositoriesSchema.repositoryId, repositoryId));
}

export async function markAllRepositoriesRemoved(targetId: number) {
  return db
    .update(installationRepositoriesSchema)
    .set({
      isRemoved: true,
      removedAt: new Date(),
    })
    .where(eq(installationRepositoriesSchema.targetId, targetId));
}
