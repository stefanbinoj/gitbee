CREATE TYPE "warning_type" AS ENUM ('block', 'warn');--> statement-breakpoint
ALTER TABLE "blocks" RENAME TO "warnings";--> statement-breakpoint
ALTER TABLE "warnings" DROP CONSTRAINT "blocks_installation_id_installations_installation_id_fk";
--> statement-breakpoint
ALTER TABLE "warnings" ADD COLUMN "type" "warning_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_installation_id_installations_installation_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."installations"("installation_id") ON DELETE no action ON UPDATE no action;