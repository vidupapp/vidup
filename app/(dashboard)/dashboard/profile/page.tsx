import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Mail, Calendar } from "lucide-react";

export const metadata = { title: "Profile — VidUp" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance, signup_date, monthly_reset_date")
    .eq("user_id", user.id)
    .single() as {
      data: {
        credits_balance: number;
        signup_date: string;
        monthly_reset_date: string;
      } | null;
      error: unknown;
    };

  const credits = profile?.credits_balance ?? 0;
  const signupDate = profile?.signup_date ?? user.created_at;

  return (
    <div className="p-6 sm:p-8 max-w-[560px]">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[14px] text-[#888888] hover:text-[#111111] transition-colors mb-8"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
          Profile
        </h1>
        <p className="text-[14px] text-[#888888] mt-0.5">Your account details</p>
      </div>

      {/* Account card */}
      <div
        className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden mb-5"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        {/* Avatar + email */}
        <div className="p-6 flex items-center gap-4 border-b border-[#F5F5F5]">
          <div className="w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#E8E8E8] flex items-center justify-center text-[18px] font-bold text-[#111111] shrink-0">
            {(user.email ?? "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#111111] truncate">{user.email}</p>
            <p className="text-[13px] text-[#888888]">VidUp account</p>
          </div>
        </div>

        {/* Details rows */}
        <div className="divide-y divide-[#F5F5F5]">
          <div className="flex items-center gap-3 px-6 py-4">
            <Mail size={16} strokeWidth={2} className="text-[#888888] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#888888] mb-0.5">Email</p>
              <p className="text-[14px] text-[#111111] truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <Zap size={16} strokeWidth={2} className="text-[#E8192C] shrink-0" />
            <div className="flex-1">
              <p className="text-[12px] text-[#888888] mb-0.5">Credits remaining</p>
              <p className="text-[14px] font-semibold text-[#E8192C]">{credits} credits</p>
            </div>
            <Link
              href="/dashboard/credits"
              className="text-[13px] font-semibold text-[#E8192C] hover:underline shrink-0"
            >
              Top up
            </Link>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <Calendar size={16} strokeWidth={2} className="text-[#888888] shrink-0" />
            <div>
              <p className="text-[12px] text-[#888888] mb-0.5">Member since</p>
              <p className="text-[14px] text-[#111111]">{formatDate(signupDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="w-full py-3 rounded-xl text-[14px] font-medium text-[#888888] border border-[#E8E8E8] hover:text-[#E8192C] hover:border-[#E8192C] hover:bg-[#FFF0F0] transition-all"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
