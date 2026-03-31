-- AlterTable
ALTER TABLE "plugins" ADD COLUMN     "themeOverrides" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'component';
