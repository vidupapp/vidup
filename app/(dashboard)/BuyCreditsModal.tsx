"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, CheckCircle2, Users } from "lucide-react";
import BuyButton from "./dashboard/credits/BuyButton";

const PACKS = [
  { type: "Starter" as const, price: "₹79",  credits: 25,  perCredit: "₹3.16", highlight: false },
  { type: "Creator" as const, price: "₹149", credits: 55,  perCredit: "₹2.71", highlight: true  },
  { type: "Pro"     as const, price: "₹299", credits: 120, perCredit: "₹2.49", highlight: false },
];

interface Props {
  onClose: () => void;
}

export default function BuyCreditsModal({ onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full bg-white rounded-t-2xl sm:rounded-2xl sm:max-w-2xl flex flex-col"
        style={{ maxHeight: "90vh", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0] shrink-0">
          <h2 className="text-[17px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.3px" }}>
            Buy Credits
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888888] hover:bg-[#F5F5F5] hover:text-[#111111] transition-all"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6">
          {/* How credits work */}
          <div className="flex flex-col gap-2.5 mb-7">
            {[
              "1 credit = 1 complete pack (3 titles + 1 hook script + 3 thumbnail ideas)",
              "Free credits reset monthly on your signup date. Purchased credits never expire.",
              "Refer a friend. You both earn 5 credits when they make their first purchase.",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2.5">
                <CheckCircle2 size={15} strokeWidth={2.5} className="text-[#E8192C] shrink-0 mt-0.5" />
                <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Pack cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {PACKS.map((pack) => (
              <div
                key={pack.type}
                className={`relative flex flex-col rounded-2xl bg-white ${
                  pack.highlight
                    ? "border-2 border-[#E8192C]"
                    : "border border-[#F0F0F0]"
                }`}
                style={{
                  padding: "28px",
                  ...(pack.highlight
                    ? { transform: "scale(1.03)", boxShadow: "0 8px 40px rgba(232,25,44,0.15)" }
                    : { boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }),
                }}
              >
                {pack.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E8192C] text-white text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                    BEST VALUE
                  </span>
                )}

                {/* Credits number */}
                <p style={{ fontSize: "56px", fontWeight: 800, color: "#111111", lineHeight: 1 }}>
                  {pack.credits}
                </p>
                {/* credits label */}
                <p style={{ fontSize: "14px", fontWeight: 400, color: "#9B9B9B", marginTop: "4px" }}>
                  credits
                </p>
                {/* per credit price */}
                <p style={{ fontSize: "13px", fontWeight: 400, color: "#9B9B9B", marginTop: "16px" }}>
                  {pack.perCredit} per credit
                </p>
                {/* buy button */}
                <div style={{ marginTop: "24px" }}>
                  <BuyButton packType={pack.type} label={`Buy for ${pack.price}`} highlight={pack.highlight} />
                </div>
              </div>
            ))}
          </div>

          {/* Below-cards note */}
          <p style={{ fontSize: "13px", color: "#9B9B9B", textAlign: "center", marginTop: "16px", marginBottom: "24px" }}>
            Credits never expire · Stack across purchases
          </p>

          {/* Referral nudge */}
          <div
            className="flex items-start gap-3 rounded-xl px-5 py-4"
            style={{ background: "#F7F7F7", border: "1px solid #F0F0F0" }}
          >
            <Users size={18} strokeWidth={2} className="text-[#E8192C] shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] text-[#3D3D3D] leading-relaxed mb-2.5">
                Know a creator? Refer them and you both get 5 credits when they buy their first pack.
              </p>
              <Link
                href="/dashboard/referral"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#3D3D3D] border border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111] px-3.5 py-1.5 rounded-lg transition-all bg-white"
              >
                Share your referral link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
