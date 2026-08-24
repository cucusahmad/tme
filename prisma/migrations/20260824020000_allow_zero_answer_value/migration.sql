-- Bobot pilihan jawaban yang valid mencakup 0. Constraint lama pada
-- database membatasi answer_value mulai dari 1 sehingga upsert gagal
-- ketika pilihan dengan weight 0.00 dipilih.
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT con.conname
    FROM pg_constraint AS con
    JOIN pg_class AS rel ON rel.oid = con.conrelid
    JOIN pg_namespace AS nsp ON nsp.oid = rel.relnamespace
    WHERE con.contype = 'c'
      AND nsp.nspname = current_schema()
      AND rel.relname = 'answer'
      AND pg_get_constraintdef(con.oid) LIKE '%answer_value%'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', current_schema(), 'answer', constraint_name);
  END LOOP;
END
$$;

ALTER TABLE "answer"
ADD CONSTRAINT "answer_value_range_check"
CHECK ("answer_value" BETWEEN 0 AND 5);
