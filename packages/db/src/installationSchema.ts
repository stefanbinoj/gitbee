import { pgTable, text, timestamp, boolean, integer, pgEnum, serial, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const accountTypeEnum = pgEnum("account_type", ["User", "Organization", "Bot"]);
const repositorySelectionEnum = pgEnum("repository_selection", ["all", "selected"]);
const repositoryVisibilityEnum = pgEnum("repository_visibility", ["private", "public"]);

export const installationSchema = pgTable("installations", {
  id: serial("id").primaryKey(),
  installationId: integer("installation_id").notNull().unique(),

  targetType: accountTypeEnum("target_type").notNull(),
  targetLogin: text("target_login").notNull(),
  targetId: integer("target_id").notNull(),

  repositorySelection: repositorySelectionEnum("repository_selection").notNull(),

  senderLogin: text("sender_login"),
  senderId: integer("sender_id"),
  senderType: accountTypeEnum("sender_type"),

  isRemoved: boolean("is_removed").notNull().default(false),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
  removedAt: timestamp("removed_at"),
});

export const installationRelations = relations(installationSchema, ({ many }) => ({
  repositories: many(installationRepositoriesSchema),
}));

export const installationRepositoriesSchema = pgTable("installation_repositories", {
  id: serial("id").primaryKey(),

  installationId: integer("installation_id")
    .notNull()
    .references(() => installationSchema.installationId),

  repositoryId: integer("repository_id")
    .notNull()
    .unique(),
  repositoryFullName: text("repository_full_name")
    .notNull(),
  repositoryVisibility: repositoryVisibilityEnum("repository_visibility")
    .notNull(),

  addedAt: timestamp("added_at")
    .notNull()
    .defaultNow(),
  removedAt: timestamp("removed_at"),
  isRemoved: boolean("is_removed").notNull().default(false),
});

export const installationRepositoriesRelations = relations(installationRepositoriesSchema, ({ one }) => ({
  installation: one(installationSchema, {
    fields: [installationRepositoriesSchema.installationId],
    references: [installationSchema.installationId],
  }),
}));
