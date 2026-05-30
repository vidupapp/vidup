"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function claimReferralAction() {
  const cookieStore = await cookies();
  const refCode = cookieStore.get("vidup_referral")?.value;
  if (!refCode) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;

  const { data: profile } = await admin
    .from("users")
    .select("referred_by, referral_code")
    .eq("user_id", user.id)
    .single() as { data: { referred_by: string | null; referral_code: string } | null; error: unknown };

  if (!profile) return;
  if (profile.referred_by) { cookieStore.delete("vidup_referral"); return; } // already claimed
  if (profile.referral_code === refCode) { cookieStore.delete("vidup_referral"); return; } // can't self-refer

  // Verify the referral code exists
  const { data: referrer } = await admin
    .from("users")
    .select("user_id")
    .eq("referral_code", refCode)
    .single() as { data: { user_id: string } | null; error: unknown };

  if (!referrer) { cookieStore.delete("vidup_referral"); return; }

  await admin
    .from("users")
    .update({ referred_by: refCode })
    .eq("user_id", user.id);

  cookieStore.delete("vidup_referral");
}
