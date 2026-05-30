"use server";

import { createClient } from "@/lib/supabase/server";

export async function dismissOnboardingAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("users")
    .update({ onboarding_dismissed: true })
    .eq("user_id", user.id);
}
