import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import { installationSchema } from "./installationSchema";

const reportTypeEnum = pgEnum("report_type", [
  "ingestion",
  "comment_analysis",
  "pr_analysis",
  "issue_analysis",
]);
const reportStatusEnum = pgEnum("report_status", [
  "in_progress",
  "completed",
  "failed",
]);

export const reportSchema = pgTable("reports", {
  id: serial("id").primaryKey(),

  installationId: integer("installation_id")
    .notNull()
    .references(() => installationSchema.installationId),

  repositoryId: integer("repository_id").notNull(),
  repositoryFullName: text("repository_full_name").notNull(),

  reportType: reportTypeEnum("report_type").notNull(),
  status: reportStatusEnum("status").notNull().default("in_progress"),

  url: text("url"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
