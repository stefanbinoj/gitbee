ALTER TABLE "rules" ADD COLUMN "rule_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rules" DROP COLUMN "target_id";