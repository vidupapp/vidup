import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, Check, Zap } from "lucide-react";

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;

  // Verify the referral code exists
  const { data: referrer } = await admin
    .from("users")
    .select("email")
    .eq("referral_code", code)
    .single() as { data: { email: string } | null; error: unknown };

  if (!referrer) return notFound();

  // Obfuscate email — show only first 2 chars + domain
  const [local, domain] = referrer.email.split("@");
  const displayEmail = `${local.slice(0, 2)}***@${domain}`;

  const claimUrl = `/api/referral/set?code=${code}&redirect=/login`;

  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D" }}>

      {/* Background blobs */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(232,25,44,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 75% 65%, rgba(232,25,44,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 h-[64px]">
        <Link href="/" className="text-[18px] font-bold text-white tracking-tight">
          vid<span className="text-[#E8192C]">up</span>
        </Link>
        <Link
          href="/login"
          className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24 sm:pt-24">

        {/* Invite badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-[#E8E8E8] text-[13px] font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-[#E8192C] animate-pulse" />
          {displayEmail} invited you to VidUp
        </div>

        {/* Headline */}
        <h1
          className="text-[40px] sm:text-[60px] font-extrabold text-white max-w-3xl leading-[1.1] mb-6"
          style={{ letterSpacing: "-2px" }}
        >
          Your next viral video{" "}
          <span className="text-[#E8192C]">starts here.</span>
        </h1>

        <p className="text-[18px] text-[#888888] max-w-lg leading-relaxed mb-10">
          VidUp generates titles, hook scripts, and thumbnail ideas in one click, calibrated to real competitor data. Used by 10K+ YouTube creators.
        </p>

        {/* Offer card */}
        <div
          className="bg-white/5 border border-white/10 rounded-2xl px-8 py-6 mb-10 max-w-sm w-full"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap size={20} className="text-[#E8192C]" strokeWidth={2.5} />
            <span className="text-[22px] font-extrabold text-white" style={{ letterSpacing: "-0.5px" }}>
              5 bonus credits, free
            </span>
          </div>
          <p className="text-[14px] text-[#888888] leading-relaxed">
            Sign up through this invite link and get 5 extra credits on your first purchase, on top of your 2 free monthly credits.
          </p>
        </div>

        {/* CTA */}
        <a
          href={claimUrl}
          className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[17px] font-bold px-10 py-4 rounded-full hover:bg-[#C41523] transition-all mb-4"
          style={{ boxShadow: "0 4px 24px rgba(232,25,44,0.35)" }}
        >
          <Sparkles size={18} strokeWidth={2.5} />
          Claim your free credits
        </a>
        <p className="text-[13px] text-[#555555]">No credit card required · 2 free credits every month</p>
      </div>

      {/* What you get */}
      <div className="relative z-10 border-t border-white/8 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[12px] font-bold uppercase tracking-[2px] text-[#555555] mb-12">
            WHAT YOU GET IN ONE CLICK
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "3 Titles",
                desc: "Each with a click score, psychological trigger explained, and exactly why it gets clicks.",
              },
              {
                title: "Hook Script",
                desc: "A 30-45 second spoken opener. Paste-ready. Built to stop the scroll in the first 3 seconds.",
              },
              {
                title: "3 Thumbnail Ideas",
                desc: "Layout, emotion, text overlay, color mood. Specific enough to build on Canva without guessing.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/8 rounded-2xl p-6"
              >
                <p className="text-[16px] font-bold text-white mb-2">{item.title}</p>
                <p className="text-[14px] text-[#666666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 border-t border-white/8 py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-[12px] font-bold uppercase tracking-[2px] text-[#555555] mb-12">
            HOW IT WORKS
          </p>

          <div className="flex flex-col gap-6">
            {[
              { n: "01", title: "Add your YouTube channel", desc: "VidUp fetches your audience data, category, and recent videos automatically." },
              { n: "02", title: "Paste 3 competitor links", desc: "Pick 3 videos from your niche that are performing well. VidUp analyzes what's working." },
              { n: "03", title: "Get your complete pack", desc: "3 titles, a hook script, and 3 thumbnail ideas, calibrated to your channel and competitors." },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-5">
                <span
                  className="text-[13px] font-black text-[#E8192C] w-8 shrink-0 mt-0.5"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {step.n}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-white mb-1">{step.title}</p>
                  <p className="text-[14px] text-[#666666] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4">
            <a
              href={claimUrl}
              className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[16px] font-bold px-10 py-4 rounded-full hover:bg-[#C41523] transition-all"
              style={{ boxShadow: "0 4px 24px rgba(232,25,44,0.30)" }}
            >
              <Sparkles size={17} strokeWidth={2.5} />
              Get started free
            </a>
            <div className="flex items-center gap-4 text-[13px] text-[#555555]">
              {["5 bonus credits on first purchase", "2 free credits every month", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check size={12} strokeWidth={3} className="text-[#E8192C]" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/8 py-8 px-6 text-center">
        <p className="text-[13px] text-[#444444]">
          © 2026 VidUp · <Link href="/login" className="hover:text-[#888888] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
