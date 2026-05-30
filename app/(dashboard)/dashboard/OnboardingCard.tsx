"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, X } from "lucide-react";
import { dismissOnboardingAction } from "@/app/actions/onboarding";

export default function OnboardingCard() {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = async () => {
    setDismissed(true);
    await dismissOnboardingAction();
  };

  if (dismissed) return null;

  return (
    <div
      className="relative mb-6 rounded-xl px-6 py-5"
      style={{
        background: "#FFF0F0",
        borderLeft: "3px solid #E8192C",
        boxShadow: "0 2px 8px rgba(232,25,44,0.06)",
      }}
    >
      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-[#BBBBBB] hover:text-[#888888] transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} strokeWidth={2} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <Sparkles size={20} strokeWidth={2} className="text-[#E8192C] shrink-0" />
        <h2 className="text-[18px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.3px" }}>
          Welcome to VidUp
        </h2>
      </div>

      {/* Bullets */}
      <div className="flex flex-col gap-2 mb-5">
        {[
          "You have 2 free credits this month — enough to generate 2 complete packs.",
          "Credits never expire once purchased. Buy more anytime, use them at your pace.",
          "Refer a creator friend — you both get 5 bonus credits when they buy their first pack.",
        ].map((text) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#E8192C] shrink-0 mt-0.5" />
            <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleDismiss}
        className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[14px] font-semibold px-6 py-2.5 rounded-full hover:bg-[#C41523] transition-all"
      >
        Got it, let&apos;s go
      </button>
    </div>
  );
}
