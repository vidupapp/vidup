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

  // Fetch credit balance
  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single() as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 2;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16 border-b border-zinc-100">
        {/* Logo */}
        <span className="text-xl font-bold tracking-tight text-[#0A0A0A]">
          vid<span className="text-[#E8192C]">up</span>
        </span>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Credit balance */}
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8192C]" />
            <span className="text-sm font-semibold text-[#0A0A0A]">{credits}</span>
            <span className="text-sm text-zinc-400">credits</span>
          </div>

          {/* Sign out */}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-zinc-400 hover:text-[#0A0A0A] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Main — centered New Pack */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E8192C]/8 flex items-center justify-center">
            <span className="text-3xl">🎬</span>
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#0A0A0A] mb-1">Ready to create?</h1>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Generate titles, a hook script, and thumbnail ideas from your competitors in one click.
            </p>
          </div>
          <Link href="/dashboard/new" className="bg-[#E8192C] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#c9151f] transition-colors text-sm flex items-center gap-2">
            <span className="text-base font-bold">+</span>
            New Pack
          </Link>
          <p className="text-zinc-400 text-xs">1 credit per pack · {credits} remaining</p>
        </div>
      </main>
    </div>
  );
}
