import { db, reportSchema, eq } from "@gitbee/db";

import type { ReportStatus, ReportType } from "@/botActions/types";

interface CreateReportData {
  installationId: number;
  repositoryId: number;
  repositoryFullName: string;
  reportType: ReportType;
  url?: string;
}

export async function createReport(data: CreateReportData) {
  const result = await db
    .insert(reportSchema)
    .values({
      installationId: data.installationId,
      repositoryId: data.repositoryId,
      repositoryFullName: data.repositoryFullName,
      reportType: data.reportType,
      status: "in_progress",
      url: data.url,
    })
    .returning({ id: reportSchema.id });

  return result[0];
}

export async function updateReportStatus(reportId: number, status: ReportStatus) {
  return db
    .update(reportSchema)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(reportSchema.id, reportId));
}
