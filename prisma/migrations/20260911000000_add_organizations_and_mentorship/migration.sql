BEGIN;

CREATE TYPE "organization_role" AS ENUM ('MEMBER', 'SUPERVISOR');

CREATE TABLE "organization" (
    "organization_id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_pkey" PRIMARY KEY ("organization_id")
);

-- Existing users remain unassigned until their actual organization is known.
ALTER TABLE "users"
    ADD COLUMN "organization_id" BIGINT,
    ADD COLUMN "organization_role" "organization_role" NOT NULL DEFAULT 'MEMBER',
    ADD COLUMN "mentor_id" BIGINT;

CREATE INDEX "idx_users_organization_role" ON "users"("organization_id", "organization_role");
CREATE INDEX "idx_users_mentor" ON "users"("mentor_id");

ALTER TABLE "users"
    ADD CONSTRAINT "fk_users_organization" FOREIGN KEY ("organization_id")
        REFERENCES "organization"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "fk_users_mentor" FOREIGN KEY ("mentor_id")
        REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT "chk_users_not_own_mentor" CHECK ("mentor_id" IS NULL OR "mentor_id" <> "user_id"),
    ADD CONSTRAINT "chk_users_supervisor_organization" CHECK ("organization_role" <> 'SUPERVISOR' OR "organization_id" IS NOT NULL);

COMMIT;
