"use client";

import { useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cashfree: (config: { mode: string }) => any;
  }
}

interface Props {
  packType: string;
  label: string;
  highlight: boolean;
}

export default function BuyButton({ packType, label, highlight }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    setLoading(true);
    setError("");

    try {
      // Create order on our server
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_type: packType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // SDK is loaded at page level — check it exists before calling
      if (!window.Cashfree) {
        setError("Payment system not loaded. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const mode =
        process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
          ? "production"
          : "sandbox";

      const cashfree = window.Cashfree({ mode });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
      // Page will redirect — no need to setLoading(false)
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-[#E8192C] text-[13px] text-center leading-snug">{error}</p>
      )}
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`w-full py-[13px] rounded-full font-semibold text-[15px] transition-all disabled:opacity-40 ${
          highlight
            ? "bg-[#E8192C] text-white hover:bg-[#C41523] hover:shadow-[0_4px_16px_rgba(232,25,44,0.30)]"
            : "bg-[#111111] text-white hover:bg-zinc-800"
        }`}
        style={{ paddingTop: "14px", paddingBottom: "14px" }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing…
          </span>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
