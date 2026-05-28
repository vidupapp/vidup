import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — VidUp",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-[24px] font-semibold text-[#111111]"
          style={{ letterSpacing: "-0.5px" }}
        >
          Dashboard
        </h1>
        <p className="text-[14px] text-[#888888] mt-1">
          Your generated packs will appear here.
        </p>
      </div>

      {/* Empty state */}
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
            Generate your first pack to get titles, a hook script, and thumbnail ideas for your next video.
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
    </div>
  );
}
