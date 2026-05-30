import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import CreditsTabs from "./CreditsTabs";
import { formatResetDate } from "@/lib/credits";
import type { Database } from "@/lib/supabase/types";

type CreditTx = Database["public"]["Tables"]["credit_transactions"]["Row"];

export const metadata = { title: "Credits — VidUp" };

export default async function CreditsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("free_credits, purchased_credits, referral_credits, free_credits_reset_date")
    .eq("user_id", user.id)
    .single() as {
      data: {
        free_credits: number;
        purchased_credits: number;
        referral_credits: number;
        free_credits_reset_date: string | null;
      } | null;
      error: unknown;
    };

  const freeCr  = profile?.free_credits     ?? 2;
  const purchCr = profile?.purchased_credits ?? 0;
  const refCr   = profile?.referral_credits  ?? 0;
  const total   = freeCr + purchCr + refCr;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: txHistory } = await (supabase as any)
    .from("credit_transactions")
    .select("id, type, credits, amount_paid, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100) as { data: CreditTx[] | null; error: unknown };

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <h1 className="text-[24px] font-semibold text-[#111111] mb-6" style={{ letterSpacing: "-0.5px" }}>
        Credits
      </h1>

      {/* Balance card — always visible */}
      <div
        className="bg-white rounded-2xl border border-[#F0F0F0] p-6 mb-8"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Zap size={20} strokeWidth={2.5} className="text-[#E8192C]" />
          <h2 className="text-[24px] font-bold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
            {total} credits total
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-[#F0F0F0]">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[15px] font-medium text-[#111111]">Free this month</p>
              <p className="text-[13px] text-[#9B9B9B] mt-0.5">
                {profile?.free_credits_reset_date
                  ? `Resets ${formatResetDate(profile.free_credits_reset_date)}`
                  : "Resets monthly"}
              </p>
            </div>
            <span className="text-[22px] font-bold text-[#111111]">{freeCr}</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[15px] font-medium text-[#111111]">Purchased</p>
              <p className="text-[13px] text-[#9B9B9B] mt-0.5">Never expires</p>
            </div>
            <span className="text-[22px] font-bold text-[#111111]">{purchCr}</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[15px] font-medium text-[#111111]">Referral earned</p>
              <p className="text-[13px] text-[#9B9B9B] mt-0.5">Never expires</p>
            </div>
            <span className="text-[22px] font-bold text-[#111111]">{refCr}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Buy Credits / Credit History */}
      <CreditsTabs txHistory={txHistory ?? []} />
    </div>
  );
}
