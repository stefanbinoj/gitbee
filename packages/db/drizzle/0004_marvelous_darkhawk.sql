CREATE TYPE "strictness" AS ENUM('low', 'medium', 'high');
CREATE TYPE "response_tone" AS ENUM('professional', 'friendly');
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "installations" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "installations" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_target_id_installations_target_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."installations"("target_id") ON DELETE no action ON UPDATE no action;