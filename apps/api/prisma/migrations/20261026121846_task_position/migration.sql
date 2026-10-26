-- DropIndex
DROP INDEX "tasks_workspace_id_status_idx";

-- AlterTable
-- Existing tasks keep today's order: newest first within each column.
ALTER TABLE "tasks" ADD COLUMN "position" DOUBLE PRECISION;

UPDATE "tasks" AS t
SET "position" = ranked.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (
    PARTITION BY "workspace_id", "status" ORDER BY "created_at" DESC
  ) AS rn
  FROM "tasks"
) AS ranked
WHERE t."id" = ranked."id";

ALTER TABLE "tasks" ALTER COLUMN "position" SET NOT NULL;

-- CreateIndex
CREATE INDEX "tasks_workspace_id_status_position_idx" ON "tasks"("workspace_id", "status", "position");
