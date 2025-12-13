import { db, warningSchema, and, eq } from "@gitbee/db";

import type { WarningType } from "@/botActions/types";

interface CreateWarningData {
  installationId: number;

  repositoryId: number;
  repositoryFullName: string;

  userLogin: string;
  userId: number;

  type: WarningType;
  reason: string;
  url?: string;
}

export async function createWarning(data: CreateWarningData): Promise<number> {
  const existingWarning = await db
    .select()
    .from(warningSchema)
    .where(and(eq(warningSchema.userId, data.userId), eq(warningSchema.type, "warning")));
  await db.insert(warningSchema).values({
    installationId: data.installationId,
    repositoryId: data.repositoryId,
    repositoryFullName: data.repositoryFullName,
    userLogin: data.userLogin,
    userId: data.userId,
    type: data.type,
    reason: data.reason,
    url: data.url,
    createdAt: new Date(),
  });
  return existingWarning.length;
}
