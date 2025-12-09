CREATE TYPE "account_type" AS ENUM ('User', 'Organization', 'Bot');--> statement-breakpoint
CREATE TYPE "repository_selection" AS ENUM ('all', 'selected');--> statement-breakpoint
CREATE TYPE "repository_visibility" AS ENUM ('private', 'public');--> statement-breakpoint
CREATE TABLE "installation_repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"installation_id" integer NOT NULL,
	"repository_id" integer NOT NULL,
	"repository_full_name" text NOT NULL,
	"repository_visibility" "repository_visibility" NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"removed_at" timestamp,
	"is_removed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "installation_repositories_repository_id_unique" UNIQUE("repository_id")
);
--> statement-breakpoint
CREATE TABLE "installations" (
	"id" serial PRIMARY KEY NOT NULL,
	"installation_id" integer NOT NULL,
	"target_type" "account_type" NOT NULL,
	"target_login" text NOT NULL,
	"target_id" integer NOT NULL,
	"repository_selection" "repository_selection" NOT NULL,
	"sender_login" text,
	"sender_id" integer,
	"sender_type" "account_type",
	"is_removed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"removed_at" timestamp,
	CONSTRAINT "installations_installation_id_unique" UNIQUE("installation_id")
);
--> statement-breakpoint
ALTER TABLE "installation_repositories" ADD CONSTRAINT "installation_repositories_installation_id_installations_installation_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."installations"("installation_id") ON DELETE no action ON UPDATE no action;