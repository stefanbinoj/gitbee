import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { installationSchema } from "./installationSchema";

// Type definitions for type safety (replaces pgEnum)
export type RuleType = "comment" | "issue" | "pr";

export const rulesSchema = pgTable("rules", {
  id: serial("id").primaryKey(),

  installationId: integer("installation_id")
    .notNull()
    .references(() => installationSchema.installationId),

  targetId: integer("target_id").notNull(),

  ruleType: text("rule_type").notNull().$type<RuleType>(),
  ruleText: text("rule_text").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
