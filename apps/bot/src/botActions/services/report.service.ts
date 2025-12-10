import { db, reportSchema } from "@gitbee/db";
import { eq } from "drizzle-orm";
import type { ReportStatus, ReportType } from "@/botActions/types";

interface CreateReportData {
  installationId: number;
  repositoryId: number;
  targetId: number;
  reportType: ReportType;
}

export async function createReport(data: CreateReportData) {
  const result = await db
    .insert(reportSchema)
    .values({
      installationId: data.installationId,
      repositoryId: data.repositoryId,
      targetId: data.targetId,
      reportType: data.reportType,
      status: "in_progress",
    })
    .returning({ id: reportSchema.id });

  return result[0];
}

export async function updateReportStatus(
  reportId: number,
  status: ReportStatus
) {
  return db
    .update(reportSchema)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(reportSchema.id, reportId));
}
