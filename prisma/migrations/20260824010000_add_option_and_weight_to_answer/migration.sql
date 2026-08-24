ALTER TABLE "answer"
ADD COLUMN "question_option_id" INTEGER,
ADD COLUMN "weight" DECIMAL(5, 2);

CREATE INDEX "idx_answer_question_option"
ON "answer"("question_option_id");

ALTER TABLE "answer"
ADD CONSTRAINT "fk_answer_question_option"
FOREIGN KEY ("question_option_id") REFERENCES "question_option"("option_id")
ON DELETE SET NULL ON UPDATE NO ACTION;
