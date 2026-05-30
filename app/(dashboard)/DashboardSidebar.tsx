"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Tv2,
  Zap,
  Gift,
  ArrowLeftRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",           label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/dashboard/new",       label: "New Pack",    Icon: Sparkles },
  { href: "/dashboard/channels",  label: "Channels",    Icon: Tv2 },
  { href: "/dashboard/credits",   label: "Buy Credits", Icon: Zap },
  { href: "/dashboard/referral",  label: "Refer & Earn", Icon: Gift },
];

interface Props {
  selectedChannel: { channel_id: string; channel_name: string } | null;
}

export default function DashboardSidebar({ selectedChannel }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex flex-col w-[240px] shrink-0 min-h-screen border-r border-[#F0F0F0] bg-white px-4 py-6">

      {/* Logo */}
      <div className="px-2 mb-8">
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

    </aside>
  );
}
