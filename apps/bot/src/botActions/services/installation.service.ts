import { db, installationSchema, eq } from "@gitbee/db";

import type { InstallationData } from "@/botActions/types";

export async function findInstallationByTargetId(targetId: number) {
  return db.query.installationSchema.findFirst({
    where: eq(installationSchema.targetId, targetId),
  });
}

export async function createInstallation(data: InstallationData) {
  return db.insert(installationSchema).values({
    installationId: data.installationId,
    targetType: data.targetType,
    targetLogin: data.targetLogin,
    targetId: data.targetId,
    repositorySelection: data.repositorySelection,
    senderLogin: data.senderLogin,
    senderId: data.senderId,
    senderType: data.senderType,
  });
}

export async function reactivateInstallation(
  targetId: number,
  data: InstallationData,
) {
  return db
    .update(installationSchema)
    .set({
      isRemoved: false,
      removedAt: null,
      installationId: data.installationId,
      targetType: data.targetType,
      targetLogin: data.targetLogin,
      repositorySelection: data.repositorySelection,
      senderLogin: data.senderLogin,
      senderId: data.senderId,
      senderType: data.senderType,
      updatedAt: new Date(),
    })
    .where(eq(installationSchema.targetId, targetId));
}

export async function markInstallationRemoved(targetId: number) {
  return db
    .update(installationSchema)
    .set({
      isRemoved: true,
      removedAt: new Date(),
    })
    .where(eq(installationSchema.targetId, targetId));
}
