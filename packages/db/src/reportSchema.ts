import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { installationSchema } from "./installationSchema";

// Type definitions for type safety (replaces pgEnum)
export type ReportType =
  | "ingestion"
  | "comment_analysis"
  | "pr_analysis"
  | "issue_analysis";
export type ReportStatus = "in_progress" | "completed" | "failed";

export const reportSchema = pgTable("reports", {
  id: serial("id").primaryKey(),

  installationId: integer("installation_id")
    .notNull()
    .references(() => installationSchema.installationId),

  repositoryId: integer("repository_id").notNull(),
  repositoryFullName: text("repository_full_name").notNull(),

  reportType: text("report_type").notNull().$type<ReportType>(),
  status: text("status").notNull().default("in_progress").$type<ReportStatus>(),

  url: text("url"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
