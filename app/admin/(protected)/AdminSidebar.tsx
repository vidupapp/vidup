"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, CreditCard,
  Package, Users2, Activity, LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin",          label: "Overview",  Icon: LayoutDashboard },
  { href: "/admin/users",    label: "Users",     Icon: Users },
  { href: "/admin/prompts",  label: "Prompts",   Icon: FileText },
  { href: "/admin/revenue",  label: "Revenue",   Icon: CreditCard },
  { href: "/admin/packs",    label: "Packs",     Icon: Package },
  { href: "/admin/system",   label: "System",    Icon: Activity },
];

const OWNER_NAV = { href: "/admin/team", label: "Team", Icon: Users2 };

interface Props { role: string }

export default function AdminSidebar({ role }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const items = role === "owner" ? [...NAV.slice(0, 5), OWNER_NAV, NAV[5]] : NAV;

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="w-[240px] shrink-0 min-h-screen flex flex-col"
      style={{ background: "#111111" }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#E8192C] shrink-0" />
          <span className="text-[18px] font-bold text-white tracking-tight">
            vid<span className="text-[#E8192C]">up</span>
          </span>
        </div>
        <span className="bg-[#E8192C] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          Admin
        </span>
      </div>

      <div className="h-px mx-6 mb-4" style={{ background: "#2A2A2A" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {items.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                active
                  ? "text-white"
                  : "text-[#9B9B9B] hover:text-white"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={2}
                className={active ? "text-[#E8192C]" : ""}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6">
        <div className="h-px mb-4" style={{ background: "#2A2A2A" }} />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#9B9B9B] hover:text-[#E8192C] transition-all w-full"
        >
          <LogOut size={17} strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
