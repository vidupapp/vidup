import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Zap, Sparkles } from "lucide-react";
import SuccessRefresh from "./SuccessRefresh";

export const metadata = { title: "Payment — VidUp" };

const CASHFREE_BASE =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export default async function CreditsSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!order_id) {
    return <ErrorView message="No order ID found. Please contact support." />;
  }

  // Verify order with Cashfree
  let orderData: {
    order_status: string;
    order_note: string;
  };

  try {
    const cfRes = await fetch(`${CASHFREE_BASE}/orders/${order_id}`, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
      },
      cache: "no-store",
    });

    if (!cfRes.ok) throw new Error(`Cashfree verify: ${cfRes.status}`);
    orderData = await cfRes.json();
  } catch (err) {
    console.error("Cashfree verify error:", err);
    return (
      <ErrorView message="Could not verify your payment. Please contact support with your order ID." />
    );
  }

  if (orderData.order_status !== "PAID") {
    return (
      <ErrorView message="Payment was not completed. No credits have been added. Please try again." />
    );
  }

  const transactionId = orderData.order_note;

  // Look up the pending transaction
  const { data: txn } = await admin
    .from("transactions")
    .select("transaction_id, status, credits_added, pack_type, amount")
    .eq("transaction_id", transactionId)
    .single() as { data: { transaction_id: string; status: string; credits_added: number; pack_type: string; amount: number } | null; error: unknown };

  let creditsAdded = 0;
  let newBalance = 0;
  let referralBonusAdded = false;

  if (txn && txn.status !== "success") {
    creditsAdded = txn.credits_added;

    const { data: profile } = await admin
      .from("users")
      .select("free_credits, purchased_credits, referral_credits, referred_by")
      .eq("user_id", user.id)
      .single() as {
        data: {
          free_credits: number;
          purchased_credits: number;
          referral_credits: number;
          referred_by: string | null;
        } | null;
        error: unknown;
      };

    const currentPurchased = profile?.purchased_credits ?? 0;

    // Mark transaction success
    await admin
      .from("transactions")
      .update({ status: "success" })
      .eq("transaction_id", transactionId);

    // Add purchased credits
    await admin
      .from("users")
      .update({ purchased_credits: currentPurchased + creditsAdded })
      .eq("user_id", user.id);

    // Referral bonus — only on first purchase
    if (profile?.referred_by) {
      const { count: successCount } = await admin
        .from("transactions")
        .select("transaction_id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "success") as { count: number | null; data: null; error: unknown };

      if (successCount === 1) {
        // Buyer gets 5 to purchased_credits (per spec)
        await admin
          .from("users")
          .update({ purchased_credits: currentPurchased + creditsAdded + 5 })
          .eq("user_id", user.id);
        newBalance += 5;

        // Referrer gets 5 to referral_credits
        const { data: referrer } = await admin
          .from("users")
          .select("user_id, referral_credits")
          .eq("referral_code", profile.referred_by)
          .single() as { data: { user_id: string; referral_credits: number } | null; error: unknown };

        if (referrer) {
          await admin
            .from("users")
            .update({ referral_credits: (referrer.referral_credits ?? 0) + 5 })
            .eq("user_id", referrer.user_id);

          // Record referral reward for referrer
          await admin.from("credit_transactions").insert({
            user_id: referrer.user_id,
            type: "referral",
            credits: 5,
            amount_paid: 0,
            description: "Friend purchased a pack",
          });
        }

        // Record buyer bonus
        await admin.from("credit_transactions").insert({
          user_id: user.id,
          type: "bonus",
          credits: 5,
          amount_paid: 0,
          description: "Welcome credits",
        });

        referralBonusAdded = true;
      }
    }

    // Record purchase transaction (amount_paid in rupees, not paise)
    const { error: txInsertError } = await admin.from("credit_transactions").insert({
      user_id: user.id,
      type: "purchase",
      credits: creditsAdded + (referralBonusAdded ? 5 : 0),
      amount_paid: Math.round((txn.amount ?? 0) / 100),
      description: txn.pack_type ?? null,
    });
    if (txInsertError) console.error("credit_transactions insert failed:", txInsertError);

    // Re-fetch fresh balance after all writes for accurate display
    const { data: freshProfile } = await admin
      .from("users")
      .select("free_credits, purchased_credits, referral_credits")
      .eq("user_id", user.id)
      .single() as {
        data: { free_credits: number; purchased_credits: number; referral_credits: number } | null;
        error: unknown;
      };

    newBalance = (freshProfile?.free_credits ?? 0)
              + (freshProfile?.purchased_credits ?? 0)
              + (freshProfile?.referral_credits ?? 0);

  } else if (txn?.status === "success") {
    // Already processed — safe to show (idempotent)
    creditsAdded = txn.credits_added;

    const { data: profile } = await admin
      .from("users")
      .select("free_credits, purchased_credits, referral_credits")
      .eq("user_id", user.id)
      .single() as {
        data: { free_credits: number; purchased_credits: number; referral_credits: number } | null;
        error: unknown;
      };

    newBalance = (profile?.free_credits ?? 2) + (profile?.purchased_credits ?? 0) + (profile?.referral_credits ?? 0);
  }

  return (
    <div className="p-6 sm:p-8 flex items-start">
      {/* Triggers a client-side router.refresh() so the sidebar balance updates */}
      <SuccessRefresh />

      <div
        className="bg-white rounded-2xl p-10 border border-[#F0F0F0] flex flex-col items-center text-center gap-6 max-w-md w-full"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#F0FFF4" }}>
          <CheckCircle2 size={32} strokeWidth={1.5} className="text-[#16A34A]" />
        </div>

        <div>
          <h1
            className="text-[22px] font-bold text-[#111111] mb-2"
            style={{ letterSpacing: "-0.5px" }}
          >
            Credits added!
          </h1>
          <p className="text-[14px] text-[#888888] leading-relaxed">
            {creditsAdded > 0
              ? `${creditsAdded} credits have been added to your account.`
              : "Your credits are ready to use."}
          </p>
          {referralBonusAdded && (
            <p className="text-[14px] text-[#16A34A] font-semibold mt-2">
              + 5 referral bonus credits added 🎉
            </p>
          )}
        </div>

        {/* New balance */}
        <div
          className="w-full rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: "#FAFAF8", border: "1px solid #F0F0F0" }}
        >
          <span className="text-[14px] text-[#888888]">New balance</span>
          <span className="inline-flex items-center gap-1.5 bg-[#FFF0F0] text-[#E8192C] text-[14px] font-bold px-3 py-1.5 rounded-full">
            <Zap size={13} strokeWidth={2.5} />
            {newBalance} credits
          </span>
        </div>

        <Link
          href="/dashboard/new"
          className="w-full py-[13px] bg-[#E8192C] text-white text-[15px] font-semibold rounded-lg text-center hover:bg-[#C41523] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} strokeWidth={2} />
          Generate a Pack
        </Link>

        <Link
          href="/dashboard"
          className="text-[13px] text-[#888888] hover:text-[#111111] transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="p-6 sm:p-8 flex items-start">
      <div
        className="bg-white rounded-2xl p-10 border border-[#F0F0F0] flex flex-col items-center text-center gap-5 max-w-md w-full"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#FFF0F0" }}>
          <XCircle size={32} strokeWidth={1.5} className="text-[#E8192C]" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#111111] mb-2">Payment issue</h1>
          <p className="text-[14px] text-[#888888] leading-relaxed max-w-xs">{message}</p>
        </div>
        <Link
          href="/dashboard/credits"
          className="w-full py-[13px] bg-[#E8192C] text-white text-[15px] font-semibold rounded-lg text-center hover:bg-[#C41523] transition-all"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
