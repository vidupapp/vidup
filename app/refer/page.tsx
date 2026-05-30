import Link from "next/link";
import { Sparkles, Check, Zap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Refer & Earn — VidUp",
  description: "Share VidUp with YouTube creators you know. Earn 5 credits for every friend who buys their first pack — no cap.",
};

const tiers = [
  { referrals: 1,  credits: 5,  label: "1 friend",    packs: 5 },
  { referrals: 5,  credits: 25, label: "5 friends",   packs: 25 },
  { referrals: 10, credits: 50, label: "10 friends",  packs: 50 },
];

export default function ReferralProgramPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D" }}>

      {/* Background blobs */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 20% 25%, rgba(232,25,44,0.11) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 80% 70%, rgba(232,25,44,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 h-[64px] border-b border-white/6">
        <Link href="/" className="text-[18px] font-bold text-white tracking-tight">
          vid<span className="text-[#E8192C]">up</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/login"
            className="text-[14px] font-semibold bg-white text-[#111111] px-5 py-2 rounded-full hover:bg-[#F0F0F0] transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-20 sm:pt-28">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-[#E8192C]/15 border border-[#E8192C]/25 text-[#FF6B7A] text-[13px] font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-wider">
          <Zap size={13} strokeWidth={2.5} />
          Refer & Earn
        </div>

        <h1
          className="text-[42px] sm:text-[64px] font-extrabold text-white max-w-3xl leading-[1.05] mb-6"
          style={{ letterSpacing: "-2.5px" }}
        >
          Refer creators.{" "}
          <span className="text-[#E8192C]">Earn credits.</span>{" "}
          Keep creating.
        </h1>

        <p className="text-[18px] sm:text-[20px] text-[#666666] max-w-xl leading-relaxed mb-10">
          Share VidUp with YouTube creators you know. Earn 5 credits every time a friend buys their first pack — they get 5 bonus credits too.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[17px] font-bold px-10 py-4 rounded-full hover:bg-[#C41523] transition-all mb-4"
          style={{ boxShadow: "0 4px 32px rgba(232,25,44,0.35)" }}
        >
          <Sparkles size={18} strokeWidth={2.5} />
          Start referring for free
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
        <p className="text-[13px] text-[#444444]">Free account · No credit card · Referral link ready instantly</p>
      </div>

      {/* Earning potential */}
      <div className="relative z-10 border-t border-white/6 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[12px] font-bold uppercase tracking-[2.5px] text-[#555555] mb-4">
            HOW MUCH YOU EARN
          </p>
          <p className="text-center text-[16px] text-[#555555] mb-12">
            5 credits per referral · no cap · credits never expire
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiers.map((tier, i) => (
              <div
                key={tier.referrals}
                className={`rounded-2xl p-6 text-center ${
                  i === 1
                    ? "bg-[#E8192C] border border-[#E8192C]"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {i === 1 && (
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mb-3">Most common</p>
                )}
                <p className={`text-[40px] font-extrabold mb-1 ${i === 1 ? "text-white" : "text-white"}`}
                  style={{ letterSpacing: "-1.5px" }}>
                  {tier.credits}
                </p>
                <p className={`text-[13px] font-semibold mb-1 ${i === 1 ? "text-white/80" : "text-[#666666]"}`}>
                  credits from {tier.label}
                </p>
                <p className={`text-[12px] ${i === 1 ? "text-white/60" : "text-[#444444]"}`}>
                  = {tier.packs} free packs
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-[13px] text-[#444444] mt-6">
            1 credit = 1 complete pack (3 titles + hook script + 3 thumbnail ideas)
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 border-t border-white/6 py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-[12px] font-bold uppercase tracking-[2.5px] text-[#555555] mb-12">
            HOW IT WORKS
          </p>

          <div className="flex flex-col gap-8">
            {[
              {
                n: "01",
                title: "Create your free account",
                desc: "Sign up in 30 seconds. Your personal referral link is generated instantly — no setup needed.",
              },
              {
                n: "02",
                title: "Share it with YouTube creators",
                desc: "Send your link on WhatsApp, Twitter, or wherever creators you know hang out. They get a special invite page explaining what VidUp does.",
              },
              {
                n: "03",
                title: "Both of you earn when they buy",
                desc: "When your friend buys their first credit pack, you both get 5 bonus credits instantly added to your accounts. No forms, no waiting.",
              },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-6">
                <span
                  className="text-[13px] font-black text-[#E8192C] w-8 shrink-0 mt-0.5"
                >
                  {step.n}
                </span>
                <div>
                  <p className="text-[17px] font-bold text-white mb-2">{step.title}</p>
                  <p className="text-[15px] text-[#666666] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why tell your friends */}
      <div className="relative z-10 border-t border-white/6 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[12px] font-bold uppercase tracking-[2.5px] text-[#555555] mb-12">
            WHY YOUR FRIENDS WILL THANK YOU
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Saves hours every video", desc: "No more guessing titles or bribing yourself to write an opener. One click, full pack." },
              { title: "Built for Indian creators", desc: "Hindi, Marathi, Tamil, Telugu and 6 more languages — with natural code-switching, not textbook language." },
              { title: "Competitor analysis built in", desc: "Paste 3 competitor links and VidUp studies what's working in your niche before generating." },
              { title: "They get 5 bonus credits", desc: "Your friend gets 5 extra credits when they buy — on top of their 2 free monthly credits." },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/8 rounded-2xl p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8192C]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} strokeWidth={3} className="text-[#E8192C]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-[14px] text-[#666666] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative z-10 border-t border-white/6 py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-[12px] font-bold uppercase tracking-[2.5px] text-[#555555] mb-12">
            COMMON QUESTIONS
          </p>

          <div className="flex flex-col gap-6">
            {[
              {
                q: "When do I get the credits?",
                a: "The moment your friend completes their first purchase — credits appear in your balance instantly.",
              },
              {
                q: "Is there a cap on referrals?",
                a: "No cap. Refer 100 creators, earn 500 credits. Your link stays active forever.",
              },
              {
                q: "Do the credits expire?",
                a: "Never. Referral credits stack on top of your balance and last forever.",
              },
              {
                q: "What counts as a referral?",
                a: "Your friend must sign up through your link AND complete their first paid purchase. Just signing up isn't enough.",
              },
              {
                q: "Can I refer myself?",
                a: "No — we check for this automatically. Self-referrals are disqualified.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-white/6 pb-6">
                <p className="text-[15px] font-semibold text-white mb-2">{faq.q}</p>
                <p className="text-[14px] text-[#666666] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="relative z-10 border-t border-white/6 py-24 px-6 text-center"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(232,25,44,0.10) 0%, transparent 70%)",
        }}
      >
        <h2
          className="text-[36px] sm:text-[48px] font-extrabold text-white mb-4"
          style={{ letterSpacing: "-1.5px" }}
        >
          Ready to start earning?
        </h2>
        <p className="text-[17px] text-[#666666] mb-10 max-w-md mx-auto leading-relaxed">
          Create your free account, get your referral link, and start sharing with creators you know.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[17px] font-bold px-12 py-4 rounded-full hover:bg-[#C41523] transition-all"
          style={{ boxShadow: "0 4px 32px rgba(232,25,44,0.35)" }}
        >
          <Sparkles size={18} strokeWidth={2.5} />
          Create free account
        </Link>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/6 py-8 px-6 text-center">
        <p className="text-[13px] text-[#333333]">
          © 2026 VidUp ·{" "}
          <Link href="/" className="hover:text-[#888888] transition-colors">Home</Link>
          {" · "}
          <Link href="/login" className="hover:text-[#888888] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
