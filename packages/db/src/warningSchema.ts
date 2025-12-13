import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { installationSchema } from "./installationSchema";

const warningType = pgEnum("warning_type", ["warning", "block"]);

export const warningSchema = pgTable("warnings", {
  id: serial("id").primaryKey(),

  installationId: integer("installation_id")
    .notNull()
    .references(() => installationSchema.installationId),

  repositoryId: integer("repository_id").notNull(),
  repositoryFullName: text("repository_full_name").notNull(),

  userLogin: text("user_login").notNull(),
  userId: integer("user_id").notNull(),

  type: warningType("type").notNull(),
  reason: text("reason").notNull(),

  url: text("url"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
