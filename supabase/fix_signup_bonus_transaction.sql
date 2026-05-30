-- ============================================================
-- Fix: record signup bonus in credit_transactions
-- 1. Update trigger so future signups get a transaction row
-- 2. Backfill existing users who have no transactions yet
-- Run once in Supabase SQL Editor
-- ============================================================

-- 1. Update trigger to also insert the bonus transaction
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (user_id, email)
  VALUES (new.id, new.email);

  INSERT INTO public.credit_transactions (user_id, type, credits, description)
  VALUES (new.id, 'bonus', 2, 'Welcome credits');

  RETURN new;
END;
$$;

-- 2. Backfill: add bonus row for any user with no transactions at all
INSERT INTO public.credit_transactions (user_id, type, credits, description, created_at)
SELECT
  u.user_id,
  'bonus',
  2,
  'Welcome credits',
  u.created_at
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.credit_transactions ct WHERE ct.user_id = u.user_id
);
