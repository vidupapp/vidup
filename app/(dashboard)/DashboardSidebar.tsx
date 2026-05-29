"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Tv2,
  Zap,
  LogOut,
  ArrowLeftRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",          label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/dashboard/new",      label: "New Pack",    Icon: Sparkles },
  { href: "/dashboard/channels", label: "Channels",    Icon: Tv2 },
  { href: "/dashboard/credits",  label: "Buy Credits", Icon: Zap },
];

interface Props {
  credits: number;
  selectedChannel: { channel_id: string; channel_name: string } | null;
}

export default function DashboardSidebar({ credits, selectedChannel }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex flex-col w-[240px] shrink-0 min-h-screen border-r border-[#F0F0F0] bg-white px-4 py-6">

      {/* Logo */}
      <div className="px-2 mb-6">
        <Link href="/dashboard" className="text-[18px] font-bold text-[#111111] tracking-tight">
          vid<span className="text-[#E8192C]">up</span>
        </Link>
      </div>

      {/* Selected channel chip */}
      {selectedChannel ? (
        <div className="px-2 mb-6">
          <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1.5">
            Active channel
          </p>
          <div className="flex items-center justify-between gap-2 bg-[#FAFAF8] border border-[#F0F0F0] rounded-xl px-3 py-2.5">
            <span className="text-[13px] font-semibold text-[#111111] truncate">
              {selectedChannel.channel_name}
            </span>
            <Link
              href="/dashboard/channels"
              className="text-[#E8192C] hover:text-[#C41523] transition-colors shrink-0"
              title="Switch channel"
            >
              <ArrowLeftRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-2 mb-6">
          <Link
            href="/dashboard/channels"
            className="flex items-center gap-2 bg-[#FFF0F0] text-[#E8192C] text-[13px] font-semibold px-3 py-2.5 rounded-xl hover:bg-[#ffe0e3] transition-colors"
          >
            <Tv2 size={15} strokeWidth={2} />
            Select a channel
          </Link>
        </div>
      )}

      {/* Credit balance */}
      <div className="px-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F0] text-[#E8192C] text-[13px] font-bold px-3 py-1.5 rounded-full">
            <Zap size={13} strokeWidth={2.5} />
            {credits} credits
          </div>
          {credits <= 2 && (
            <Link
              href="/dashboard/credits"
              className="text-[11px] font-semibold text-[#E8192C] hover:underline"
            >
              Top up →
            </Link>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-[14px] py-[10px] rounded-[10px] text-[14px] transition-all ${
                isActive
                  ? "bg-[#FFF0F0] text-[#E8192C] font-semibold"
                  : "text-[#3D3D3D] font-medium hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="w-full text-left flex items-center gap-3 px-[14px] py-[10px] rounded-[10px] text-[14px] font-medium text-[#888888] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all"
        >
          <LogOut size={18} strokeWidth={2} />
          Sign out
        </button>
      </form>
    </aside>
  );
}
