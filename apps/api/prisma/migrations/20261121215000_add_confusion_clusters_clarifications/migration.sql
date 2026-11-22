CREATE TYPE "ConfusionClusterStatus" AS ENUM ('ACTIVE', 'RESOLVED');

CREATE TYPE "ClarificationStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED');

CREATE TABLE "ConfusionCluster" (
    "id" UUID NOT NULL,
    "communiqueId" UUID,
    "title" VARCHAR(240) NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "ConfusionClusterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ConfusionCluster_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Question" ADD COLUMN "clusterId" UUID;

CREATE TABLE "Clarification" (
    "id" UUID NOT NULL,
    "communiqueId" UUID,
    "clusterId" UUID,
    "title" VARCHAR(240) NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ClarificationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Clarification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Question_clusterId_idx" ON "Question"("clusterId");

CREATE INDEX "ConfusionCluster_communiqueId_status_idx" ON "ConfusionCluster"("communiqueId", "status");

CREATE INDEX "ConfusionCluster_status_updatedAt_idx" ON "ConfusionCluster"("status", "updatedAt");

CREATE INDEX "Clarification_communiqueId_status_idx" ON "Clarification"("communiqueId", "status");

CREATE INDEX "Clarification_clusterId_idx" ON "Clarification"("clusterId");

CREATE INDEX "Clarification_status_updatedAt_idx" ON "Clarification"("status", "updatedAt");

ALTER TABLE "Question" ADD CONSTRAINT "Question_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "ConfusionCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConfusionCluster" ADD CONSTRAINT "ConfusionCluster_communiqueId_fkey" FOREIGN KEY ("communiqueId") REFERENCES "Communique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Clarification" ADD CONSTRAINT "Clarification_communiqueId_fkey" FOREIGN KEY ("communiqueId") REFERENCES "Communique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Clarification" ADD CONSTRAINT "Clarification_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "ConfusionCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
