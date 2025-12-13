import { pgTable, text, timestamp, integer, pgEnum, serial } from "drizzle-orm/pg-core";
import { installationSchema } from "./installationSchema";

const ruleTypeEnum = pgEnum("rule_type", ["comment", "issue", "pr"]);

export const rulesSchema = pgTable("rules", {
  id: serial("id").primaryKey(),

  installationId: integer("installation_id")
    .notNull()
    .references(() => installationSchema.installationId),

  targetId: integer("target_id").notNull(),

  ruleType: ruleTypeEnum("rule_type").notNull(),
  ruleText: text("rule_text").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
