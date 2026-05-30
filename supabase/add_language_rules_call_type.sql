-- Step 1: allow 'language_rules' as a valid call_type
ALTER TABLE prompts
  DROP CONSTRAINT IF EXISTS prompts_call_type_check;

ALTER TABLE prompts
  ADD CONSTRAINT prompts_call_type_check
  CHECK (call_type IN ('analysis', 'generation', 'language_rules'));
