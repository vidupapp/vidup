import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewPackForm from "./NewPackForm";

export const metadata = {
  title: "New Pack — VidUp",
};

export default async function NewPackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single() as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16 border-b border-zinc-100">
        <a href="/dashboard" className="text-xl font-bold tracking-tight text-[#0A0A0A]">
          vid<span className="text-[#E8192C]">up</span>
        </a>
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E8192C]" />
          <span className="text-sm font-semibold text-[#0A0A0A]">{credits}</span>
          <span className="text-sm text-zinc-400">credits</span>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-xl">

          {/* Back */}
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-[#0A0A0A] transition-colors mb-8"
          >
            ← Back to dashboard
          </a>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-1">New Pack</h1>
            <p className="text-zinc-500 text-sm">
              Fill in the details below. 1 credit will be used on generation.
            </p>
          </div>

          {/* No credits state */}
          {credits < 1 ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl">😕</div>
              <div>
                <h2 className="text-[#0A0A0A] font-semibold text-lg mb-1">No credits left</h2>
                <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                  You&apos;ve used all your credits. Top up to keep generating packs.
                </p>
              </div>
              <a
                href="/dashboard"
                className="bg-[#E8192C] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#c9151f] transition-colors"
              >
                Buy credits
              </a>
            </div>
          ) : (
            <NewPackForm credits={credits} />
          )}
        </div>
      </main>
    </div>
  );
}
