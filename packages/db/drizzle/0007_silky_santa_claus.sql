ALTER TABLE "warnings" ADD COLUMN "warning_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "target_id";--> statement-breakpoint
ALTER TABLE "warnings" DROP COLUMN "target_id";