-- Add INSERT policy so authenticated users can record their own credit transactions
-- Run once in Supabase SQL Editor
CREATE POLICY "Users can insert own credit transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
