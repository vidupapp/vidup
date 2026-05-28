import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  const admin = createAdminClient();

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
    order_note: string; // our transaction_id
    order_tags: { pack_type: string; credits: string };
  };

  try {
    const cfRes = await fetch(`${CASHFREE_BASE}/orders/${order_id}`, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
      },
      next: { revalidate: 0 },
    });

    if (!cfRes.ok) throw new Error(`Cashfree verify failed: ${cfRes.status}`);
    orderData = await cfRes.json();
  } catch (err) {
    console.error("Cashfree verify error:", err);
    return <ErrorView message="Could not verify your payment. Please contact support with your order ID." />;
  }

  if (orderData.order_status !== "PAID") {
    return (
      <ErrorView message="Payment was not completed. No credits have been added. Please try again." />
    );
  }

  // Idempotency: check if this transaction was already processed
  const transactionId = orderData.order_note;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: txn } = await (admin as any)
    .from("transactions")
    .select("transaction_id, status, credits_added")
    .eq("transaction_id", transactionId)
    .single() as { data: { transaction_id: string; status: string; credits_added: number } | null; error: unknown };

  let creditsAdded = 0;

  if (txn && txn.status !== "success") {
    creditsAdded = txn.credits_added;

    // Mark transaction as success
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from("transactions")
      .update({ status: "success" })
      .eq("transaction_id", transactionId);

    // Add credits to user balance
    const { data: profile } = await supabase
      .from("users")
      .select("credits_balance")
      .eq("user_id", user.id)
      .single() as { data: { credits_balance: number } | null; error: unknown };

    const currentBalance = profile?.credits_balance ?? 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from("users")
      .update({ credits_balance: currentBalance + creditsAdded })
      .eq("user_id", user.id);
  } else if (txn?.status === "success") {
    // Already processed — just show success
    creditsAdded = txn.credits_added;
  }

  // Fetch updated balance to show
  const { data: updatedProfile } = await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single() as { data: { credits_balance: number } | null; error: unknown };

  const newBalance = updatedProfile?.credits_balance ?? 0;

  return (
    <div className="p-6 sm:p-8 flex items-start">
      <div
        className="bg-white rounded-2xl p-10 border border-[#F0F0F0] flex flex-col items-center text-center gap-6 max-w-md w-full"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center text-3xl">
          ✓
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
        </div>

        {/* New balance */}
        <div
          className="w-full rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: "#FAFAF8", border: "1px solid #F0F0F0" }}
        >
          <span className="text-[14px] text-[#888888]">New balance</span>
          <span className="inline-flex items-center gap-1.5 bg-[#FFF0F0] text-[#E8192C] text-[14px] font-bold px-3 py-1.5 rounded-full">
            ⚡ {newBalance} credits
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard/new"
          className="w-full py-[13px] bg-[#E8192C] text-white text-[15px] font-semibold rounded-lg text-center hover:bg-[#C41523] transition-all"
        >
          Generate a Pack →
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
        <div className="w-16 h-16 rounded-full bg-[#FFF0F0] flex items-center justify-center text-2xl">
          ✕
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
