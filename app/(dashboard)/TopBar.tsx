"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, LogOut, Settings } from "lucide-react";
import { type CreditBalance, formatResetDate } from "@/lib/credits";

interface Props {
  credits: number;
  balance: CreditBalance;
  email: string;
}

export default function TopBar({ credits, balance, email }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = email.charAt(0).toUpperCase();
  const low = credits <= 2;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#F0F0F0] h-[60px] flex items-center justify-end px-6 gap-3">

      {/* Credits pill */}
      <Link
        href="/dashboard/credits"
        className="inline-flex items-center gap-1.5 bg-[#FFF0F0] text-[#E8192C] text-[13px] font-bold px-3 py-1.5 rounded-full hover:bg-[#ffe4e7] transition-colors"
      >
        <Zap size={13} strokeWidth={2.5} />
        {credits} credits
        {low && <span className="w-1.5 h-1.5 rounded-full bg-[#E8192C] animate-pulse ml-0.5" />}
      </Link>

      {/* Profile button + dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EEEEEE] flex items-center justify-center text-[13px] font-bold text-[#111111] transition-colors border border-[#E8E8E8]"
          title="Profile"
        >
          {initial}
        </button>

        {open && (
          <div
            className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl border border-[#F0F0F0] py-1.5 min-w-[240px]"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
          >
            {/* Email */}
            <div className="px-4 py-3 border-b border-[#F5F5F5]">
              <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Signed in as</p>
              <p className="text-[13px] font-medium text-[#111111] truncate">{email}</p>
            </div>

            {/* Credit breakdown */}
            <div className="px-4 py-3 border-b border-[#F5F5F5]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">Credits</p>
                <span className="text-[13px] font-bold text-[#E8192C]">{credits} total</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#888888]">
                    Free
                    {balance.free_credits_reset_date && (
                      <span className="text-[#AAAAAA]"> · resets {formatResetDate(balance.free_credits_reset_date)}</span>
                    )}
                  </span>
                  <span className="text-[12px] font-semibold text-[#111111]">{balance.free_credits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#888888]">Purchased <span className="text-[#AAAAAA]">· never expires</span></span>
                  <span className="text-[12px] font-semibold text-[#111111]">{balance.purchased_credits}</span>
                </div>
                {balance.referral_credits > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#888888]">Referral <span className="text-[#AAAAAA]">· never expires</span></span>
                    <span className="text-[12px] font-semibold text-[#111111]">{balance.referral_credits}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-1.5 mt-0.5">
                  <span className="text-[12px] font-semibold text-[#3D3D3D]">Total</span>
                  <span className="text-[12px] font-bold text-[#111111]">{credits}</span>
                </div>
              </div>
            </div>

            {/* Profile link */}
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#3D3D3D] hover:bg-[#F5F5F5] transition-colors"
            >
              <Settings size={15} strokeWidth={2} />
              Profile & settings
            </Link>

            {/* Sign out */}
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
  );
}
