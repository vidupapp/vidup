import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const now = new Date().toISOString();

  // Reset users whose reset date has passed
  const { data: due } = await admin
    .from("users")
    .select("user_id, signup_date, free_credits_reset_date, free_credits")
    .lte("free_credits_reset_date", now) as {
      data: { user_id: string; signup_date: string; free_credits_reset_date: string; free_credits: number }[] | null;
      error: unknown;
    };

  // Handle users with NULL reset_date (not migrated yet)
  const { data: noDate } = await admin
    .from("users")
    .select("user_id, signup_date")
    .is("free_credits_reset_date", null) as {
      data: { user_id: string; signup_date: string }[] | null;
      error: unknown;
    };

  let reset = 0;
  let initialised = 0;

  for (const user of due ?? []) {
    const currentReset = new Date(user.free_credits_reset_date);
    const nextReset = new Date(currentReset);
    nextReset.setMonth(nextReset.getMonth() + 1);

    // Record expiry of unused free credits before overwriting
    if (user.free_credits > 0) {
      void admin.from("credit_transactions").insert({
        user_id: user.user_id,
        type: "expired",
        credits: -user.free_credits,
        amount_paid: 0,
        description: "Unused free credits lapsed",
      });
    }

    await admin
      .from("users")
      .update({ free_credits: 2, free_credits_reset_date: nextReset.toISOString() })
      .eq("user_id", user.user_id);

    void admin.from("credit_transactions").insert({
      user_id: user.user_id,
      type: "free_reset",
      credits: 2,
      amount_paid: 0,
      description: "Free monthly credits added",
    });

    reset++;
  }

  for (const user of noDate ?? []) {
    const signupDate = new Date(user.signup_date);
    const nextReset = new Date(signupDate);
    nextReset.setMonth(nextReset.getMonth() + 1);

    await admin
      .from("users")
      .update({ free_credits: 2, free_credits_reset_date: nextReset.toISOString() })
      .eq("user_id", user.user_id);

    void admin.from("credit_transactions").insert({
      user_id: user.user_id,
      type: "free_reset",
      credits: 2,
      amount_paid: 0,
      description: "Free monthly credits added",
    });

    initialised++;
  }

  return NextResponse.json({ reset, initialised });
}
