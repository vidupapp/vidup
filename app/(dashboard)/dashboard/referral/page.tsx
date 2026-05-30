import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Check, Gift, Users } from "lucide-react";
import CopyReferralLink from "./CopyReferralLink";

export const metadata = { title: "Refer & Earn — VidUp" };

export default async function ReferralPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("users")
    .select("referral_code")
    .eq("user_id", user.id)
    .single() as { data: { referral_code: string } | null; error: unknown };

  const referralCode = profile?.referral_code ?? "";
  const referralUrl = `https://vidup.in/refer/${referralCode}`;

  // Count friends who joined via this referral code
  const { count: friendsJoined } = await admin
    .from("users")
    .select("user_id", { count: "exact", head: true })
    .eq("referred_by", referralCode) as { count: number | null; data: null; error: unknown };

  // Count how many of those made a purchase (credits earned estimate)
  const { data: referredUsers } = await admin
    .from("users")
    .select("user_id")
    .eq("referred_by", referralCode) as { data: { user_id: string }[] | null; error: unknown };

  let creditsEarned = 0;
  if (referredUsers?.length) {
    const ids = referredUsers.map((u) => u.user_id);
    const { count: purchasers } = await admin
      .from("transactions")
      .select("user_id", { count: "exact", head: true })
      .in("user_id", ids)
      .eq("status", "success") as { count: number | null; data: null; error: unknown };
    creditsEarned = (purchasers ?? 0) * 5;
  }

  const whatsappText = encodeURIComponent(
    `I use VidUp to generate YouTube titles, hooks and thumbnails in one click — it's insane. Sign up free here and get 5 bonus credits: ${referralUrl}`
  );

  return (
    <div className="p-6 sm:p-8 max-w-[680px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
          Refer & Earn
        </h1>
        <p className="text-[14px] text-[#888888] mt-0.5">
          Share VidUp with creators you know — both of you earn 5 credits when they buy their first pack.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] p-5"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Users size={15} strokeWidth={2} className="text-[#888888]" />
            <p className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">Friends joined</p>
          </div>
          <p className="text-[28px] font-extrabold text-[#111111]" style={{ letterSpacing: "-1px" }}>
            {friendsJoined ?? 0}
          </p>
        </div>
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] p-5"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Gift size={15} strokeWidth={2} className="text-[#888888]" />
            <p className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">Credits earned</p>
          </div>
          <p className="text-[28px] font-extrabold text-[#E8192C]" style={{ letterSpacing: "-1px" }}>
            {creditsEarned}
          </p>
        </div>
      </div>

      {/* Referral link */}
      <div
        className="bg-white rounded-2xl border border-[#F0F0F0] p-6 mb-6"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <p className="text-[13px] font-semibold text-[#111111] mb-3">Your referral link</p>
        <CopyReferralLink url={referralUrl} whatsappText={whatsappText} />
      </div>

      {/* How it works */}
      <div
        className="bg-white rounded-2xl border border-[#F0F0F0] p-6 mb-6"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <p className="text-[13px] font-semibold text-[#111111] mb-5">How it works</p>
        <div className="flex flex-col gap-4">
          {[
            { n: "1", text: "Share your unique link with a YouTube creator you know." },
            { n: "2", text: "They sign up and try VidUp free — no credit card needed." },
            { n: "3", text: "When they buy their first credit pack, you both get 5 bonus credits instantly." },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FFF0F0] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[12px] font-bold text-[#E8192C]">{step.n}</span>
              </div>
              <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-[#FAFAF8] rounded-xl border border-[#F0F0F0] px-5 py-4">
        <p className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider mb-2">Terms</p>
        <div className="flex flex-col gap-1.5">
          {[
            "Bonus credits are added when your friend makes their first purchase only",
            "You earn 5 credits per referral — no cap on how many friends you can refer",
            "Credits never expire and stack on top of your balance",
            "Self-referrals are not allowed",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2">
              <Check size={13} strokeWidth={2.5} className="text-[#E8192C] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#888888] leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
