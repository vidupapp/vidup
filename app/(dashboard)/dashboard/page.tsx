import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

export const metadata = {
  title: "Dashboard — VidUp",
};

type Pack = Database["public"]["Tables"]["packs"]["Row"];

const statusStyles: Record<Pack["status"], { bg: string; text: string }> = {
  Generated:    { bg: "#F5F5F5", text: "#3D3D3D" },
  "Video Live": { bg: "#FFF0F0", text: "#E8192C" },
  "Results In": { bg: "#F0FFF4", text: "#16A34A" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: packs } = await supabase
    .from("packs")
    .select("pack_id, topic, style, language, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) as {
      data: Pick<Pack, "pack_id" | "topic" | "style" | "language" | "status" | "created_at">[] | null;
      error: unknown;
    };

  const list = packs ?? [];

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
            Dashboard
          </h1>
          <p className="text-[14px] text-[#888888] mt-0.5">
            {list.length > 0
              ? `${list.length} pack${list.length !== 1 ? "s" : ""} generated`
              : "Your generated packs will appear here."}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-[#E8192C] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C41523] transition-all flex items-center gap-1.5"
        >
          <span className="text-[16px] leading-none font-bold">+</span>
          New Pack
        </Link>
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div
          className="bg-white rounded-2xl p-12 border border-[#F0F0F0] flex flex-col items-center text-center gap-5 max-w-md"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] flex items-center justify-center text-2xl">
            🎬
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#111111] mb-1">No packs yet</h2>
            <p className="text-[14px] text-[#888888] max-w-xs leading-relaxed">
              Create your first pack.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[15px] font-semibold px-7 py-3 rounded-lg hover:bg-[#C41523] transition-all"
          >
            <span className="text-[16px] font-bold leading-none">+</span>
            New Pack
          </Link>
        </div>
      )}

      {/* Pack history list */}
      {list.length > 0 && (
        <div className="flex flex-col gap-3 max-w-3xl">
          {list.map((pack) => {
            const s = statusStyles[pack.status];
            return (
              <Link
                key={pack.pack_id}
                href={`/dashboard/pack/${pack.pack_id}`}
                className="group bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden flex items-stretch transition-all duration-[250ms] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] cursor-pointer"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  borderLeft: "3px solid #E8192C",
                }}
              >
                {/* Main content */}
                <div className="flex-1 px-5 py-4">
                  <p className="text-[16px] font-semibold text-[#111111] leading-snug mb-2 group-hover:text-[#E8192C] transition-colors">
                    {pack.topic}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] text-[#888888]">{formatDate(pack.created_at)}</span>
                    <span className="text-[#E8E8E8]">·</span>
                    <span className="bg-[#F5F5F5] text-[#3D3D3D] text-[12px] font-medium px-2.5 py-0.5 rounded-full">
                      {pack.language}
                    </span>
                    <span className="bg-[#F5F5F5] text-[#3D3D3D] text-[12px] font-medium px-2.5 py-0.5 rounded-full">
                      {pack.style}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 px-5">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {pack.status}
                  </span>
                  <ChevronRight size={18} strokeWidth={2} className="text-[#CCCCCC] group-hover:text-[#888888] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
