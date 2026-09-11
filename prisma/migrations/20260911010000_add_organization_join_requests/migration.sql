BEGIN;

CREATE TYPE "organization_request_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

CREATE TABLE "organization_join_request" (
    "request_id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL UNIQUE REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    "organization_id" BIGINT NOT NULL REFERENCES "organization"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE,
    "status" "organization_request_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(6),
    "reviewed_by" BIGINT REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "idx_organization_requests_status" ON "organization_join_request"("organization_id", "status");

COMMIT;
