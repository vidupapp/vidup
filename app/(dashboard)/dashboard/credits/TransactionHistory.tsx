"use client";

import { useState } from "react";
import {
  ShoppingCart, RefreshCw, Users, Gift, Sparkles,
  Receipt, Clock, ChevronLeft, ChevronRight,
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
  purchase:   { icon: <ShoppingCart size={16} strokeWidth={2} />, label: "Credits purchased",     color: "#16A34A", bgColor: "#F0FFF4" },
  free_reset: { icon: <RefreshCw    size={16} strokeWidth={2} />, label: "Monthly credits",       color: "#378ADD", bgColor: "#EFF6FF" },
  referral:   { icon: <Users        size={16} strokeWidth={2} />, label: "Referral reward",       color: "#7F77DD", bgColor: "#F5F3FF" },
  bonus:      { icon: <Gift         size={16} strokeWidth={2} />, label: "Signup bonus",          color: "#E8192C", bgColor: "#FFF0F0" },
  generation: { icon: <Sparkles     size={16} strokeWidth={2} />, label: "Pack generated",        color: "#888888", bgColor: "#F5F5F5" },
  expired:    { icon: <Clock        size={16} strokeWidth={2} />, label: "Free credits expired",  color: "#888888", bgColor: "#F5F5F5" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function getDescription(tx: Transaction): string {
  if (tx.type === "purchase" && tx.amount_paid > 0)
    return `${tx.description ?? ""} · ₹${tx.amount_paid}`.trim().replace(/^·\s*/, "");
  if (tx.description) return tx.description;
  if (tx.type === "free_reset") return "Free monthly credits added";
  if (tx.type === "referral")   return "Friend purchased a pack";
  if (tx.type === "bonus")      return "Welcome credits";
  if (tx.type === "expired")    return "Unused free credits lapsed";
  return "";
}

type Filter = "all" | "added" | "used" | "purchases" | "referrals";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "added",     label: "Added"     },
  { value: "used",      label: "Used"      },
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

const PAGE_SIZE = 10;

interface Props {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [page,   setPage]   = useState(1);

  const filtered   = applyFilter(transactions, filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * PAGE_SIZE;
  const visible    = filtered.slice(start, start + PAGE_SIZE);

  function changeFilter(f: Filter) {
    setFilter(f);
    setPage(1);
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => changeFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                active
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#888888] border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-3">
          <Receipt size={36} strokeWidth={1.5} className="text-[#D0D0D0]" />
          <div className="text-center">
            <p className="text-[14px] font-medium text-[#888888]">Nothing here</p>
            <p className="text-[13px] text-[#BBBBBB] mt-0.5">No transactions match this filter.</p>
          </div>
        </div>
      )}

      {/* Rows */}
      {visible.length > 0 && (
        <div className="flex flex-col divide-y divide-[#F5F5F5]">
          {visible.map((tx) => {
            const cfg      = TYPE_CONFIG[tx.type];
            const positive = tx.credits > 0;
            const desc     = getDescription(tx);

            return (
              <div key={tx.id} className="flex items-center justify-between py-3 gap-4">
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: cfg.bgColor, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#111111] leading-tight">{cfg.label}</p>
                    {desc && (
                      <p className="text-[12px] text-[#AAAAAA] mt-0.5 truncate max-w-[220px]">{desc}</p>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p
                    className="text-[14px] font-semibold tabular-nums"
                    style={{ color: positive ? cfg.color : "#E8192C" }}
                  >
                    {positive ? "+" : ""}{tx.credits}
                  </p>
                  <p className="text-[11px] text-[#BBBBBB] mt-0.5">{formatDate(tx.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#F5F5F5]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#3D3D3D] border border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} strokeWidth={2} />
            Prev
          </button>

          <p className="text-[12px] text-[#AAAAAA] tabular-nums">
            {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#3D3D3D] border border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
