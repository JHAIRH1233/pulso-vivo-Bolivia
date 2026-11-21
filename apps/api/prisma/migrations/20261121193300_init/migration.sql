-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CommuniqueStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentLanguage" AS ENUM ('ES', 'QU');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('PENDING', 'ANSWERED', 'CLOSED');

-- CreateTable
CREATE TABLE "Communique" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "content" TEXT NOT NULL,
    "simplifiedContent" TEXT,
    "language" "ContentLanguage" NOT NULL DEFAULT 'ES',
    "status" "CommuniqueStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Communique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommuniqueTranslation" (
    "id" UUID NOT NULL,
    "communiqueId" UUID NOT NULL,
    "language" "ContentLanguage" NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "content" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CommuniqueTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "communiqueId" UUID,
    "text" TEXT NOT NULL,
    "answer" TEXT,
    "language" "ContentLanguage" NOT NULL DEFAULT 'ES',
    "status" "QuestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Communique_slug_key" ON "Communique"("slug");

-- CreateIndex
CREATE INDEX "Communique_status_publishedAt_idx" ON "Communique"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommuniqueTranslation_communiqueId_language_key" ON "CommuniqueTranslation"("communiqueId", "language");

-- CreateIndex
CREATE INDEX "Question_communiqueId_status_idx" ON "Question"("communiqueId", "status");

-- CreateIndex
CREATE INDEX "Question_status_createdAt_idx" ON "Question"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "CommuniqueTranslation" ADD CONSTRAINT "CommuniqueTranslation_communiqueId_fkey" FOREIGN KEY ("communiqueId") REFERENCES "Communique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_communiqueId_fkey" FOREIGN KEY ("communiqueId") REFERENCES "Communique"("id") ON DELETE SET NULL ON UPDATE CASCADE;
