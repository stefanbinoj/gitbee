import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const accountTypeEnum = pgEnum("account_type", ["User", "Organization", "Bot"]);
const repositorySelectionEnum = pgEnum("repository_selection", [
  "all",
  "selected",
]);
const repositoryVisibilityEnum = pgEnum("repository_visibility", [
  "private",
  "public",
]);
const strictnessEnum = pgEnum("strictness", ["low", "medium", "high"]);
const responseToneEnum = pgEnum("response_tone", ["professional", "friendly"]);

export const installationSchema = pgTable("installations", {
  id: serial("id").primaryKey(),
  installationId: integer("installation_id").notNull().unique(),

  targetType: accountTypeEnum("target_type").notNull(),
  targetLogin: text("target_login").notNull().unique(),
  targetId: integer("target_id").notNull().unique(),

  repositorySelection: repositorySelectionEnum(
    "repository_selection"
  ).notNull(),

  senderLogin: text("sender_login"),
  senderId: integer("sender_id"),
  senderType: accountTypeEnum("sender_type"),

  isRemoved: boolean("is_removed").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  removedAt: timestamp("removed_at"),
});

export const installationRelations = relations(
  installationSchema,
  ({ many, one }) => ({
    repositories: many(installationRepositoriesSchema),
    settings: one(settingsSchema),
  })
);

export const installationRepositoriesSchema = pgTable(
  "installation_repositories",
  {
    id: serial("id").primaryKey(),

    targetId: integer("target_id")
      .notNull()
      .references(() => installationSchema.targetId),

    repositoryId: integer("repository_id").notNull().unique(),
    repositoryFullName: text("repository_full_name").notNull(),
    repositoryVisibility: repositoryVisibilityEnum(
      "repository_visibility"
    ).notNull(),

    addedAt: timestamp("added_at").notNull().defaultNow(),
    removedAt: timestamp("removed_at"),
    isRemoved: boolean("is_removed").notNull().default(false),
  }
);

export const installationRepositoriesRelations = relations(
  installationRepositoriesSchema,
  ({ one }) => ({
    installation: one(installationSchema, {
      fields: [installationRepositoriesSchema.targetId],
      references: [installationSchema.targetId],
    }),
  })
);

export const settingsSchema = pgTable("settings", {
  id: serial("id").primaryKey(),
  targetId: integer("target_id")
    .notNull()
    .references(() => installationSchema.targetId),

  autoAssign: boolean("auto_assign").notNull().default(false),
  blockUser: boolean("block_user").notNull().default(true),
  autoCloseIrrelevantIssues: boolean("auto_close_irrelevant_issues")
    .notNull()
    .default(true),
  autoCloseIrrelevantPRs: boolean("auto_close_irrelevant_prs")
    .notNull()
    .default(true),
  reviewCommentsForPRs: boolean("review_comments_for_prs")
    .notNull()
    .default(false),

  strictness: strictnessEnum("strictness").notNull().default("medium"),
  responseTone: responseToneEnum("response_tone").notNull().default("friendly"),

  moderateMembers: boolean("moderate_members").notNull().default(false),
  warningCount: integer("warning_count").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const settingsRelations = relations(settingsSchema, ({ one }) => ({
  installation: one(installationSchema, {
    fields: [settingsSchema.targetId],
    references: [installationSchema.targetId],
  }),
}));
