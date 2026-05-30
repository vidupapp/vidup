import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, CheckCircle2, Users } from "lucide-react";
import BuyButton from "./BuyButton";
import CashfreeScript from "./CashfreeScript";
import TransactionHistory from "./TransactionHistory";
import { formatResetDate } from "@/lib/credits";
import type { Database } from "@/lib/supabase/types";

type CreditTx = Database["public"]["Tables"]["credit_transactions"]["Row"];

export const metadata = { title: "Credits — VidUp" };

const packs = [
  { type: "Starter", price: "₹79",  credits: 25,  perCredit: "₹3.16", highlight: false },
  { type: "Creator", price: "₹149", credits: 55,  perCredit: "₹2.71", highlight: true  },
  { type: "Pro",     price: "₹299", credits: 120, perCredit: "₹2.49", highlight: false },
] as const;

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

  const freeCr  = profile?.free_credits       ?? 2;
  const purchCr = profile?.purchased_credits   ?? 0;
  const refCr   = profile?.referral_credits    ?? 0;
  const total   = freeCr + purchCr + refCr;

  // Fetch credit transaction history
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: txHistory } = await (supabase as any)
    .from("credit_transactions")
    .select("id, type, credits, amount_paid, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100) as { data: CreditTx[] | null; error: unknown };

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <CashfreeScript />

      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
          Credits
        </h1>
      </div>

      {/* ── SECTION 1: Balance breakdown ─────────────── */}
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
          {/* Free */}
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

          {/* Purchased */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[15px] font-medium text-[#111111]">Purchased</p>
              <p className="text-[13px] text-[#9B9B9B] mt-0.5">Never expires</p>
            </div>
            <span className="text-[22px] font-bold text-[#111111]">{purchCr}</span>
          </div>

          {/* Referral */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[15px] font-medium text-[#111111]">Referral earned</p>
              <p className="text-[13px] text-[#9B9B9B] mt-0.5">Never expires</p>
            </div>
            <span className="text-[22px] font-bold text-[#111111]">{refCr}</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: How credits work ──────────────── */}
      <h2 className="text-[16px] font-semibold text-[#111111] mb-4">How credits work</h2>
      <div className="flex flex-col gap-3 mb-8">
        {[
          "1 credit = 1 complete pack (3 titles + 1 hook script + 3 thumbnail ideas)",
          "Free credits reset monthly. Purchased credits never expire.",
          "Refer a friend — you both earn 5 credits when they buy their first pack.",
        ].map((text) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#E8192C] shrink-0 mt-0.5" />
            <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* ── SECTION 3: Buy more credits ──────────────── */}
      <h2 className="text-[16px] font-semibold text-[#111111] mb-5">Buy more credits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 items-start">
        {packs.map((pack) => (
          <div
            key={pack.type}
            className={`relative flex flex-col gap-4 rounded-2xl p-6 ${
              pack.highlight
                ? "border-2 border-[#E8192C] bg-white"
                : "border border-[#E8E8E8] bg-white"
            }`}
            style={
              pack.highlight
                ? { boxShadow: "0 8px 40px rgba(232,25,44,0.15)" }
                : { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
            }
          >
            {pack.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E8192C] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                Best Value
              </span>
            )}
            <p className="text-[16px] font-semibold text-[#111111]">{pack.type}</p>
            <p className="text-[24px] font-bold text-[#E8192C]" style={{ letterSpacing: "-0.5px" }}>
              {pack.price}
            </p>
            <p className="text-[14px] text-[#3D3D3D] -mt-2">{pack.credits} credits</p>
            <BuyButton packType={pack.type} label={`Buy ${pack.type}`} highlight={pack.highlight} />
          </div>
        ))}
      </div>

      {/* ── SECTION 4: Referral nudge ─────────────────── */}
      <div
        className="flex items-start gap-4 rounded-[10px] px-6 py-5"
        style={{ background: "#F7F7F7", border: "1px solid #F0F0F0" }}
      >
        <Users size={20} strokeWidth={2} className="text-[#E8192C] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[14px] text-[#3D3D3D] leading-relaxed mb-3">
            Know a creator? Refer them and you both get 5 credits when they buy their first pack.
          </p>
          <Link
            href="/dashboard/referral"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#3D3D3D] border border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111] px-4 py-2 rounded-lg transition-all bg-white"
          >
            Share your referral link →
          </Link>
        </div>
      </div>

      {/* ── SECTION 5: Transaction history ───────────── */}
      <TransactionHistory transactions={txHistory ?? []} />

    </div>
  );
}
