CREATE TYPE "public"."account_type" AS ENUM('User', 'Organization', 'Bot');--> statement-breakpoint
CREATE TYPE "public"."repository_selection" AS ENUM('all', 'selected');--> statement-breakpoint
CREATE TYPE "public"."repository_visibility" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TYPE "public"."strictness" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."response_tone" AS ENUM('professional', 'friendly');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('ingestion', 'comment_analysis', 'pr_analysis', 'issue_analysis');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('in_progress', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."rule_type" AS ENUM('comment', 'issue', 'pr');--> statement-breakpoint
CREATE TYPE "public"."warning_type" AS ENUM('warning', 'block');--> statement-breakpoint

CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"github_account_id" integer,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installation_repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"target_id" integer NOT NULL,
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
	"updated_at" timestamp,
	"removed_at" timestamp,
	CONSTRAINT "installations_installation_id_unique" UNIQUE("installation_id"),
	CONSTRAINT "installations_target_login_unique" UNIQUE("target_login"),
	CONSTRAINT "installations_target_id_unique" UNIQUE("target_id")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"target_id" integer NOT NULL,
	"auto_assign" boolean DEFAULT false NOT NULL,
	"block_user" boolean DEFAULT true NOT NULL,
	"auto_close_irrelevant_issues" boolean DEFAULT true NOT NULL,
	"auto_close_irrelevant_prs" boolean DEFAULT true NOT NULL,
	"review_comments_for_prs" boolean DEFAULT false NOT NULL,
	"strictness" "strictness" DEFAULT 'medium' NOT NULL,
	"response_tone" "response_tone" DEFAULT 'friendly' NOT NULL,
	"moderate_members" boolean DEFAULT false NOT NULL,
	"warning_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"installation_id" integer NOT NULL,
	"repository_id" integer NOT NULL,
	"repository_full_name" text NOT NULL,
	"report_type" "report_type" NOT NULL,
	"status" "report_status" DEFAULT 'in_progress' NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"installation_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"rule_type" "rule_type" NOT NULL,
	"rule_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warnings" (
	"id" serial PRIMARY KEY NOT NULL,
	"installation_id" integer NOT NULL,
	"repository_id" integer NOT NULL,
	"repository_full_name" text NOT NULL,
	"user_login" text NOT NULL,
	"user_id" integer NOT NULL,
	"type" "warning_type" NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "installation_repositories" ADD CONSTRAINT "installation_repositories_target_id_installations_target_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."installations"("target_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_target_id_installations_target_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."installations"("target_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_installation_id_installations_installation_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."installations"("installation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_installation_id_installations_installation_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."installations"("installation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_installation_id_installations_installation_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."installations"("installation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");