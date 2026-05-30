-- ============================================================
-- VidUp — Credit System v2 Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add 3 separate credit columns
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS free_credits       INTEGER NOT NULL DEFAULT 2;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS purchased_credits  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_credits   INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS free_credits_reset_date TIMESTAMPTZ;

-- Migrate existing credits_balance into purchased_credits
-- free_credits always resets to 2 for all users
-- purchased = MAX(0, old_balance - 2)
UPDATE public.users
SET
  free_credits          = 2,
  purchased_credits     = GREATEST(0, credits_balance - 2),
  free_credits_reset_date = signup_date::timestamptz + INTERVAL '1 month'
WHERE free_credits_reset_date IS NULL;

-- Index for cron job lookups
CREATE INDEX IF NOT EXISTS idx_users_free_credits_reset
  ON public.users (free_credits_reset_date)
  WHERE free_credits_reset_date IS NOT NULL;
