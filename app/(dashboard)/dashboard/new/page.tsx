import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
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

  const { data: profile } = (await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single()) as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 0;

  return (
    <div className="p-8">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[14px] text-[#888888] hover:text-[#111111] transition-colors mb-8"
      >
        ← Back
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-[24px] font-semibold text-[#111111]"
          style={{ letterSpacing: "-0.5px" }}
        >
          New Pack
        </h1>
        <p className="text-[14px] text-[#888888] mt-1">
          1 credit will be used when you generate.
        </p>
      </div>

      <div className="max-w-[680px]">
        {credits < 1 ? (
          <div
            className="bg-white rounded-2xl p-12 border border-[#F0F0F0] flex flex-col items-center text-center gap-5"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center text-xl">
              😕
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#111111] mb-1">No credits left</h2>
              <p className="text-[14px] text-[#888888] max-w-xs leading-relaxed">
                You&apos;ve used all your credits. Top up to keep generating packs.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="bg-[#E8192C] text-white text-[15px] font-semibold px-6 py-3 rounded-lg hover:bg-[#C41523] transition-all"
            >
              Buy credits
            </Link>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl p-8 border border-[#F0F0F0]"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
          >
            <NewPackForm credits={credits} />
          </div>
        )}
      </div>
    </div>
  );
}
