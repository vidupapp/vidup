"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/admin":          "Overview",
  "/admin/users":    "Users",
  "/admin/prompts":  "Prompts",
  "/admin/revenue":  "Revenue",
  "/admin/packs":    "Packs",
  "/admin/team":     "Team",
  "/admin/system":   "System",
};

function getTitle(pathname: string): string {
  if (pathname.startsWith("/admin/prompts/") && pathname.endsWith("/edit")) return "Edit Prompt";
  for (const [key, val] of Object.entries(TITLES)) {
    if (pathname === key || (key !== "/admin" && pathname.startsWith(key))) return val;
  }
  return "Admin";
}

interface Props { name: string }

export default function AdminTopBar({ name }: Props) {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header
      className="h-[60px] flex items-center justify-between px-8 shrink-0"
      style={{ background: "#1A1A1A", borderBottom: "1px solid #2A2A2A" }}
    >
      <span className="text-[18px] font-semibold text-white" style={{ letterSpacing: "-0.3px" }}>
        {title}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-[14px] text-[#9B9B9B]">{name}</span>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ background: "#E8192C" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
