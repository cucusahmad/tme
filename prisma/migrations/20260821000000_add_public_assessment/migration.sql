ALTER TABLE "biodata"
ADD COLUMN "assessment_share_token" VARCHAR(64);

CREATE UNIQUE INDEX "biodata_assessment_share_token_key"
ON "biodata"("assessment_share_token");

ALTER TABLE "assessment"
ADD COLUMN "assessment_type" VARCHAR(20) NOT NULL DEFAULT 'SELF',
ADD COLUMN "evaluator_name" VARCHAR(120),
ADD COLUMN "evaluator_relationship" VARCHAR(80),
ADD COLUMN "public_session_token" VARCHAR(64);

CREATE UNIQUE INDEX "assessment_public_session_token_key"
ON "assessment"("public_session_token");
