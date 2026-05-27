import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/8">
        <span className="text-xl font-bold tracking-tight">
          vid<span className="text-[#F5C842]">up</span>
        </span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500 hidden sm:block">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button
              formAction="/auth/signout"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">Your packs</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Each pack = 3 titles + 1 hook script + 3 thumbnail ideas
            </p>
          </div>
          <button className="bg-[#F5C842] text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-[#f0bc2e] transition-colors flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            New Pack
          </button>
        </div>

        {/* Credits banner */}
        <div className="bg-white/5 border border-white/8 rounded-2xl px-6 py-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F5C842]/15 rounded-full flex items-center justify-center">
              <span className="text-[#F5C842] font-bold text-sm">2</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">2 credits remaining</p>
              <p className="text-zinc-500 text-xs">Free tier · Resets on your signup anniversary</p>
            </div>
          </div>
          <button className="text-[#F5C842] text-sm font-semibold hover:underline">
            Buy credits →
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 gap-5 border border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl">🎬</div>
          <div className="text-center">
            <h2 className="text-white font-semibold text-lg mb-2">No packs yet</h2>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Generate your first pack — paste your video topic and 3 competitor
              links, and VidUp does the rest.
            </p>
          </div>
          <button className="bg-[#F5C842] text-black font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#f0bc2e] transition-colors mt-2">
            Generate your first pack
          </button>
        </div>
      </main>
    </div>
  );
}
