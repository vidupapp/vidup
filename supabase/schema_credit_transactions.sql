-- ============================================================
-- VidUp — Credit Transactions Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  type         TEXT        NOT NULL, -- 'purchase' | 'free_reset' | 'referral' | 'bonus' | 'generation'
  credits      INTEGER     NOT NULL, -- positive = added, negative = used
  amount_paid  INTEGER     NOT NULL DEFAULT 0, -- rupees paid (0 for non-purchases)
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id
  ON public.credit_transactions (user_id, created_at DESC);
