"use client";

import { useState, useEffect } from "react";
import { Zap, Receipt, X } from "lucide-react";
import BuyCreditsModal from "../../BuyCreditsModal";
import TransactionHistory from "./TransactionHistory";
import type { Database } from "@/lib/supabase/types";

type CreditTx = Database["public"]["Tables"]["credit_transactions"]["Row"];

interface Props {
  txHistory: CreditTx[];
}

export default function CreditsTabs({ txHistory }: Props) {
  const [buyOpen,     setBuyOpen]     = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = historyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [historyOpen]);

  return (
    <>
      {/* ── Action buttons ─────────────────────────────── */}
      <div className="flex gap-3">
        <button
          onClick={() => setBuyOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#E8192C] text-white rounded-xl text-[15px] font-semibold transition-all hover:bg-[#C41523] active:scale-[0.97]"
          style={{ boxShadow: "0 4px 14px rgba(232,25,44,0.22)" }}
        >
          <Zap size={16} strokeWidth={2.5} />
          Buy Credits
        </button>

        <button
          onClick={() => setHistoryOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E8E8E8] text-[#111111] rounded-xl text-[15px] font-medium transition-all hover:border-[#111111] active:scale-[0.97]"
        >
          <Receipt size={16} strokeWidth={2} />
          Credit History
        </button>
      </div>

      {/* ── Buy Credits modal (shared component) ────────── */}
      {buyOpen && <BuyCreditsModal onClose={() => setBuyOpen(false)} />}

      {/* ── Credit History modal ───────────────────────── */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setHistoryOpen(false); }}
        >
          <div
            className="relative w-full bg-white rounded-t-2xl sm:rounded-2xl sm:max-w-lg flex flex-col"
            style={{ maxHeight: "90vh", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0] shrink-0">
              <h2 className="text-[17px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.3px" }}>
                Credit History
              </h2>
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888888] hover:bg-[#F5F5F5] hover:text-[#111111] transition-all"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <TransactionHistory transactions={txHistory} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
