-- CreateEnum
CREATE TYPE "plugin_status" AS ENUM ('pending', 'installed', 'broken', 'disabled');

-- CreateTable
CREATE TABLE "plugins" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "repoUrl" TEXT,
    "branch" TEXT NOT NULL DEFAULT 'main',
    "status" "plugin_status" NOT NULL DEFAULT 'pending',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "installedCommit" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "errorStage" TEXT,
    "errorMessage" TEXT,
    "config" JSONB,
    "installedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plugins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plugins_slug_key" ON "plugins"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "plugins_repoUrl_key" ON "plugins"("repoUrl");
