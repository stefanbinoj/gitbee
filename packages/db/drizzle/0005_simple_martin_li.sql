ALTER TABLE "settings" ADD COLUMN "moderate_members" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "warning_count" integer DEFAULT 0 NOT NULL;