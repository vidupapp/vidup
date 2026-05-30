"use client";

import { useState } from "react";
import {
  ShoppingCart, RefreshCw, Users, Gift, Sparkles,
  Receipt, ChevronDown, Clock,
} from "lucide-react";

type TxType = "purchase" | "free_reset" | "referral" | "bonus" | "generation" | "expired";

interface Transaction {
  id: string;
  type: TxType;
  credits: number;
  amount_paid: number;
  description: string | null;
  created_at: string;
}

const TYPE_CONFIG: Record<TxType, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}> = {
  purchase: {
    icon: <ShoppingCart size={18} strokeWidth={2} />,
    label: "Credits purchased",
    color: "#16A34A",
    bgColor: "#F0FFF4",
  },
  free_reset: {
    icon: <RefreshCw size={18} strokeWidth={2} />,
    label: "Monthly credits",
    color: "#378ADD",
    bgColor: "#EFF6FF",
  },
  referral: {
    icon: <Users size={18} strokeWidth={2} />,
    label: "Referral reward",
    color: "#7F77DD",
    bgColor: "#F5F3FF",
  },
  bonus: {
    icon: <Gift size={18} strokeWidth={2} />,
    label: "Signup bonus",
    color: "#E8192C",
    bgColor: "#FFF0F0",
  },
  generation: {
    icon: <Sparkles size={18} strokeWidth={2} />,
    label: "Pack generated",
    color: "#E8192C",
    bgColor: "#FFF0F0",
  },
  expired: {
    icon: <Clock size={18} strokeWidth={2} />,
    label: "Free credits expired",
    color: "#888888",
    bgColor: "#F5F5F5",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function getDescription(tx: Transaction): string {
  if (tx.description) return tx.description;
  if (tx.type === "free_reset") return "Free monthly credits added";
  if (tx.type === "referral") return "Friend purchased a pack";
  if (tx.type === "bonus") return "Welcome credits";
  if (tx.type === "expired") return "Unused free credits lapsed";
  return "";
}

type Filter = "all" | "added" | "used" | "purchases" | "referrals";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",       label: "All" },
  { value: "added",     label: "Credits added" },
  { value: "used",      label: "Credits used" },
  { value: "purchases", label: "Purchases" },
  { value: "referrals", label: "Referrals" },
];

function applyFilter(txs: Transaction[], filter: Filter): Transaction[] {
  switch (filter) {
    case "added":     return txs.filter((t) => t.credits > 0);
    case "used":      return txs.filter((t) => t.credits < 0);
    case "purchases": return txs.filter((t) => t.type === "purchase");
    case "referrals": return txs.filter((t) => t.type === "referral");
    default:          return txs;
  }
}

interface Props {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = applyFilter(transactions, filter);

  return (
    <div
      className="bg-white rounded-2xl border border-[#F0F0F0] p-6 mt-8"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-semibold text-[#111111]">Transaction history</h2>

        {/* Filter dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="appearance-none bg-white border border-[#E8E8E8] rounded-lg pl-3 pr-8 h-[36px] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#111111] transition-colors cursor-pointer"
          >
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            strokeWidth={2}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-3">
          <Receipt size={40} strokeWidth={1.5} className="text-[#D0D0D0]" />
          <div className="text-center">
            <p className="text-[14px] font-medium text-[#888888]">No transactions yet</p>
            <p className="text-[13px] text-[#BBBBBB] mt-0.5">Your credit history will appear here.</p>
          </div>
        </div>
      )}

      {/* Rows */}
      {filtered.length > 0 && (
        <div className="flex flex-col">
          {filtered.map((tx, i) => {
            const cfg = TYPE_CONFIG[tx.type];
            const isLast = i === filtered.length - 1;
            const positive = tx.credits > 0;

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3.5 gap-4"
                style={{ borderBottom: isLast ? "none" : "1px solid #F0F0F0", minHeight: "52px" }}
              >
                {/* Left: icon + labels */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: cfg.bgColor, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#111111] leading-tight">{cfg.label}</p>
                    {getDescription(tx) && (
                      <p className="text-[13px] text-[#9B9B9B] mt-0.5 truncate max-w-[240px]">
                        {tx.type === "purchase" && tx.amount_paid > 0
                          ? `${tx.description ?? ""} · ₹${tx.amount_paid}`
                          : getDescription(tx)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: amount + date */}
                <div className="text-right shrink-0">
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: positive ? cfg.color : "#E8192C" }}
                  >
                    {positive ? "+" : ""}{tx.credits}
                  </p>
                  <p className="text-[12px] text-[#9B9B9B] mt-0.5">{formatDate(tx.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
