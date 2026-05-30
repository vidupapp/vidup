"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Zap, LogOut, Settings } from "lucide-react";
import { type CreditBalance, formatResetDate } from "@/lib/credits";
import BuyCreditsModal from "./BuyCreditsModal";
import CashfreeScript from "./dashboard/credits/CashfreeScript";

interface Props {
  credits: number;
  balance: CreditBalance;
  email: string;
}

export default function TopBar({ credits, balance, email }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoverOpen, setHoverOpen]     = useState(false);
  const [buyOpen, setBuyOpen]         = useState(false);

  const profileRef   = useRef<HTMLDivElement>(null);
  const hideTimer    = useRef<ReturnType<typeof setTimeout>>();

  const initial = email.charAt(0).toUpperCase();
  const low     = credits <= 2;

  /* ── Profile dropdown: close on outside click ─── */
  function handleProfileBlur(e: React.FocusEvent) {
    if (!profileRef.current?.contains(e.relatedTarget as Node)) {
      setProfileOpen(false);
    }
  }

  /* ── Credits hover card ──────────────────────── */
  function enterPill() {
    clearTimeout(hideTimer.current);
    setHoverOpen(true);
  }
  function leaveArea() {
    hideTimer.current = setTimeout(() => setHoverOpen(false), 120);
  }
  function enterCard() {
    clearTimeout(hideTimer.current);
  }

  return (
    <>
      <CashfreeScript />

      <header className="print:hidden sticky top-0 z-30 bg-white border-b border-[#F0F0F0] h-[60px] flex items-center justify-end px-6 gap-3">

        {/* ── Credits pill + hover popover ─────────────── */}
        <div className="relative">
          <button
            onMouseEnter={enterPill}
            onMouseLeave={leaveArea}
            className="inline-flex items-center gap-1.5 bg-[#FFF0F0] text-[#E8192C] text-[13px] font-bold px-3 py-1.5 rounded-full hover:bg-[#ffe4e7] transition-colors select-none"
          >
            <Zap size={13} strokeWidth={2.5} />
            {credits} credits
            {low && <span className="w-1.5 h-1.5 rounded-full bg-[#E8192C] animate-pulse ml-0.5" />}
          </button>

          {hoverOpen && (
            <div
              className="absolute top-[calc(100%+10px)] right-0 bg-white rounded-xl border border-[#F0F0F0] w-[220px]"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 40 }}
              onMouseEnter={enterCard}
              onMouseLeave={leaveArea}
            >
              {/* Breakdown rows */}
              <div className="px-4 pt-4 pb-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Free</p>
                    {balance.free_credits_reset_date && (
                      <p className="text-[11px] text-[#AAAAAA] mt-0.5">
                        resets {formatResetDate(balance.free_credits_reset_date)}
                      </p>
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-[#111111]">{balance.free_credits}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Purchased</p>
                    <p className="text-[11px] text-[#AAAAAA] mt-0.5">never expires</p>
                  </div>
                  <span className="text-[14px] font-bold text-[#111111]">{balance.purchased_credits}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Referral</p>
                    <p className="text-[11px] text-[#AAAAAA] mt-0.5">never expires</p>
                  </div>
                  <span className="text-[14px] font-bold text-[#111111]">{balance.referral_credits}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-2.5 mt-0.5">
                  <p className="text-[13px] font-semibold text-[#3D3D3D]">Total</p>
                  <span className="text-[14px] font-bold text-[#111111]">{credits}</span>
                </div>
              </div>

              {/* Buy button */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => { setHoverOpen(false); setBuyOpen(true); }}
                  className="w-full py-2.5 rounded-lg bg-[#E8192C] text-white text-[13px] font-semibold hover:bg-[#C41523] transition-colors"
                >
                  Buy Credits
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile button + dropdown ─────────────────── */}
        <div className="relative" ref={profileRef} onBlur={handleProfileBlur}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EEEEEE] flex items-center justify-center text-[13px] font-bold text-[#111111] transition-colors border border-[#E8E8E8]"
            title="Profile"
          >
            {initial}
          </button>

          {profileOpen && (
            <div
              className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl border border-[#F0F0F0] py-1.5 min-w-[200px]"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
            >
              {/* Email */}
              <div className="px-4 py-3 border-b border-[#F5F5F5]">
                <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Signed in as</p>
                <p className="text-[13px] font-medium text-[#111111] truncate">{email}</p>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#3D3D3D] hover:bg-[#F5F5F5] transition-colors"
              >
                <Settings size={15} strokeWidth={2} />
                Profile &amp; settings
              </Link>

              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#E8192C] hover:bg-[#FFF0F0] transition-colors"
                >
                  <LogOut size={15} strokeWidth={2} />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {buyOpen && <BuyCreditsModal onClose={() => setBuyOpen(false)} />}
    </>
  );
}
