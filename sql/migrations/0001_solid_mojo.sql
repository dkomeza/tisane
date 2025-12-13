ALTER TABLE "pages" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "parent_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pages_tags" ALTER COLUMN "page_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pages_tags" ALTER COLUMN "tag_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "pages_tags" ADD CONSTRAINT "pages_tags_page_id_tag_id_pk" PRIMARY KEY("page_id","tag_id");--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN "tags";