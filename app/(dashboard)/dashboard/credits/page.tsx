import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import BuyButton from "./BuyButton";
import CashfreeScript from "./CashfreeScript";

export const metadata = { title: "Buy Credits — VidUp" };

const packs = [
  {
    type: "Starter",
    price: "₹79",
    credits: 25,
    perCredit: "₹3.16",
    highlight: false,
  },
  {
    type: "Creator",
    price: "₹149",
    credits: 55,
    perCredit: "₹2.71",
    highlight: true,
  },
  {
    type: "Pro",
    price: "₹299",
    credits: 120,
    perCredit: "₹2.49",
    highlight: false,
  },
] as const;

export default async function CreditsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single() as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 0;

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <CashfreeScript />

      <div className="mb-8">
        <h1
          className="text-[24px] font-semibold text-[#111111]"
          style={{ letterSpacing: "-0.5px" }}
        >
          Buy Credits
        </h1>
        <p className="text-[14px] text-[#888888] mt-0.5">
          You currently have{" "}
          <span className="text-[#E8192C] font-semibold">{credits} credit{credits !== 1 ? "s" : ""}</span>.
          Credits never expire and stack when you buy more.
        </p>
      </div>

      {/* Pack cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl items-center">
        {packs.map((pack) => (
          <div
            key={pack.type}
            className={`relative flex flex-col gap-5 rounded-2xl p-7 transition-all duration-[250ms] ${
              pack.highlight
                ? "border-2 border-[#E8192C] bg-white"
                : "border border-[#E8E8E8] bg-white"
            }`}
            style={
              pack.highlight
                ? {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 40px rgba(232,25,44,0.15)",
                  }
                : { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
            }
          >
            {pack.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E8192C] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                Best Value
              </span>
            )}

            {/* Pack name + price */}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#888888] mb-2">
                {pack.type}
              </p>
              <p
                className="text-[40px] font-extrabold text-[#111111] leading-none"
                style={{ letterSpacing: "-1px" }}
              >
                {pack.price}
              </p>
            </div>

            {/* Credits */}
            <div>
              <p className="text-[20px] font-bold text-[#111111]">
                {pack.credits} credits
              </p>
              <p className="text-[13px] text-[#888888] mt-0.5">
                {pack.perCredit} per credit
              </p>
            </div>

            {/* What's included */}
            <ul className="flex flex-col gap-2">
              {[
                "Full AI-powered output",
                "Competitor link analysis",
                "All 10 languages",
                "Credits never expire",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-[#3D3D3D]">
                  <Check size={13} strokeWidth={2.5} className="text-[#E8192C] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <BuyButton
              packType={pack.type}
              label={`Buy ${pack.type}`}
              highlight={pack.highlight}
            />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-[13px] text-[#888888] mt-8 max-w-xl leading-relaxed">
        One-time purchase — no subscription, no auto-renewal.
        Credits stack on top of any balance you already have.
        Payments processed securely via Cashfree.
      </p>
    </div>
  );
}
