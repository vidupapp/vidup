import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Describe your video",
    desc: "Tell us your topic, style, and paste 3 competitor YouTube links from your niche.",
  },
  {
    number: "02",
    title: "We analyze what's working",
    desc: "VidUp reads your competitors' patterns: titles, hooks, and thumbnails that actually perform.",
  },
  {
    number: "03",
    title: "Get your full pack",
    desc: "3 scroll-stopping titles, 1 hook script, and 3 thumbnail ideas. In seconds.",
  },
];

const outputCards = [
  {
    icon: "🏷️",
    title: "3 Titles",
    items: [
      "Curiosity Gap title",
      "Emotional Trigger title",
      "SEO Optimised title",
      "Click score out of 10",
      "Why it works: 1 line",
    ],
    note: "Each title scored against competitor patterns",
  },
  {
    icon: "🎙️",
    title: "1 Hook Script",
    items: [
      "Opening line (scroll stopper)",
      "Tension builder (3-4 sentences)",
      "Payoff promise",
      "Full 30-45 sec script",
      "Psychological trigger used",
    ],
    note: "Paste-ready. No editing needed.",
  },
  {
    icon: "🖼️",
    title: "3 Thumbnail Ideas",
    items: [
      "Visual layout description",
      "Emotion on face (if shown)",
      "Text overlay (max 3 words)",
      "Color mood + reasoning",
      "Why it works",
    ],
    note: "Specific enough to execute on Canva",
  },
];

const stats = [
  { number: "10+", label: "Languages supported" },
  { number: "3", label: "Outputs per generation" },
  { number: "30s", label: "Average generation time" },
  { number: "₹0", label: "To get started" },
];

const creditPacks = [
  { type: "Starter", price: "₹79",  credits: 25,  perCredit: "₹3.16", best: false },
  { type: "Creator", price: "₹149", credits: 55,  perCredit: "₹2.71", best: true  },
  { type: "Pro",     price: "₹299", credits: 120, perCredit: "₹2.49", best: false },
];

const languages = [
  "Hindi", "English", "Tamil", "Telugu", "Marathi",
  "Kannada", "Bengali", "Gujarati", "Malayalam", "Punjabi",
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8", fontFamily: "var(--font-inter), -apple-system, sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-12 h-16">
          <Link href="/" className="flex items-center gap-1.5 text-[18px] font-bold text-[#111111] tracking-tight">
            <span className="w-2 h-2 rounded-full bg-[#E8192C] shrink-0" />
            vid<span className="text-[#E8192C]">up</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-8 text-[14px] font-medium text-[#3D3D3D]">
            <a href="#how-it-works" className="hover:text-[#111111] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#111111] transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-[#111111] transition-colors">Sign in</Link>
          </nav>

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#E8192C] text-white text-[15px] font-semibold px-7 py-[11px] rounded-full hover:bg-[#C41523] transition-all"
          >
            Get Started Free
          </Link>

          <Link href="/login" className="sm:hidden bg-[#E8192C] text-white text-[14px] font-semibold px-5 py-2 rounded-full hover:bg-[#C41523] transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-32 sm:py-36 min-h-[90vh]"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(232,25,44,0.10) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 40% at 70% 60%, rgba(232,25,44,0.06) 0%, transparent 70%)",
            "#0D0D0D",
          ].join(", "),
        }}
      >
        <div className="inline-flex items-center bg-[#E8192C] text-white text-[11px] font-bold uppercase tracking-[0.8px] px-4 py-1.5 rounded-full mb-8">
          YouTube Creators
        </div>

        <h1
          className="text-white mb-6 max-w-3xl"
          style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1.04 }}
        >
          One click.<br />
          <span style={{ color: "#E8192C" }}>Viral ready.</span>
        </h1>

        <p className="text-[#888888] text-[18px] leading-relaxed max-w-[520px] mb-10">
          VidUp analyzes your competitors and generates 3 titles, 1 hook script, and 3 thumbnail ideas. In seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
          <Link
            href="/login"
            className="bg-[#E8192C] text-white text-[15px] font-semibold px-8 py-4 rounded-full hover:bg-[#C41523] transition-all hover:shadow-[0_4px_16px_rgba(232,25,44,0.35)]"
          >
            Get Started Free
          </Link>
          <a
            href="#how-it-works"
            className="text-[#888888] text-[15px] font-medium px-8 py-4 rounded-full border border-white/15 hover:border-white/35 hover:text-white transition-all"
          >
            See how it works
          </a>
        </div>

        <p className="text-[#555555] text-[12px] mb-16">No credit card required · 2 free credits/month</p>

        {/* Floating mockup cards */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full items-stretch">
          <div
            className="flex-1 rounded-2xl p-5 text-left"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#E8192C] mb-4">Title Options</p>
            <div className="flex flex-col gap-3">
              {[
                "Maine ₹1 lakh kaise bachaye 6 months mein",
                "Ye 5 money mistakes mat karna kabhi",
                "Budget se zyada income: real strategy",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-[#E8192C] font-bold text-[11px] mt-0.5 shrink-0">{i + 1}</span>
                  <span className="text-white/75 text-[13px] leading-snug">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex-1 rounded-2xl p-5 text-left"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#E8192C] mb-4">Hook Script</p>
            <p className="text-white/75 text-[13px] leading-relaxed mb-4">
              &quot;Ye video dekh ke tumhara next video 2x better perform karega, guaranteed. Main tumhe woh 3 cheezein dikhaunga jo top creators karte hain...&quot;
            </p>
            <span className="inline-flex items-center bg-[#E8192C]/15 text-[#E8192C] text-[11px] font-semibold px-3 py-1 rounded-full">
              Trigger: Curiosity Gap
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────── */}
      <section className="bg-white border-b border-[#F0F0F0]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-0 sm:divide-x sm:divide-[#E8E8E8]">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center gap-1 sm:px-8">
                <span className="text-[48px] font-extrabold text-[#111111] leading-none">{s.number}</span>
                <span className="text-[14px] text-[#888888]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section id="how-it-works" className="py-24 sm:py-32" style={{ background: "#FAFAF8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold uppercase tracking-[0.5px] px-[14px] py-[6px] rounded-full">
              How It Works
            </span>
          </div>

          <h2
            className="text-center text-[#111111] font-bold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 36px)", letterSpacing: "-1px", lineHeight: 1.3 }}
          >
            Three steps to your best video yet
          </h2>
          <p className="text-center text-[#888888] text-[18px] max-w-[520px] mx-auto mb-16 leading-relaxed">
            No guessing. No copying. Just data-driven output ready to film.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-8 border border-[#F0F0F0]"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
              >
                <p className="text-[#E8192C] text-[13px] font-bold mb-4">{step.number}</p>
                <h3 className="text-[20px] font-semibold text-[#111111] mb-2" style={{ letterSpacing: "-0.3px" }}>
                  {step.title}
                </h3>
                <p className="text-[#3D3D3D] text-[15px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold uppercase tracking-[0.5px] px-[14px] py-[6px] rounded-full">
              What You Get
            </span>
          </div>

          <h2
            className="text-center text-[#111111] font-bold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 36px)", letterSpacing: "-1px", lineHeight: 1.3 }}
          >
            One click.{" "}
            <span className="text-[#888888]">Three weapons.</span>
          </h2>
          <p className="text-center text-[#888888] text-[18px] max-w-[520px] mx-auto mb-16 leading-relaxed">
            Every generation gives you everything you need before you hit record.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {outputCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-8 border border-[#F0F0F0] transition-all duration-[250ms] hover:-translate-y-[3px] hover:border-[#E8192C]/20"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
              >
                <div className="w-11 h-11 rounded-[10px] bg-[#FFF0F0] flex items-center justify-center text-xl mb-5">
                  {card.icon}
                </div>
                <h3 className="text-[20px] font-semibold text-[#111111] mb-4" style={{ letterSpacing: "-0.3px" }}>
                  {card.title}
                </h3>
                <ul className="flex flex-col gap-2.5 mb-5">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[14px] text-[#3D3D3D]">
                      <span className="text-[#E8192C] font-bold text-[12px] shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[12px] text-[#888888] pt-4 border-t border-[#F0F0F0]">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ───────────────────────────────── */}
      <section className="py-24 sm:py-32" style={{ background: "#FAFAF8" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold uppercase tracking-[0.5px] px-[14px] py-[6px] rounded-full">
              Languages
            </span>
          </div>

          <h2
            className="text-[#111111] font-bold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 36px)", letterSpacing: "-1px", lineHeight: 1.3 }}
          >
            Your language.{" "}
            <span className="text-[#888888]">Your audience.</span>
          </h2>
          <p className="text-[#888888] text-[18px] max-w-[480px] mx-auto mb-12 leading-relaxed">
            Output in 10 languages, with natural code-switching. The way creators actually speak.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-white text-[#3D3D3D] text-[13px] font-medium px-4 py-2 rounded-full border border-[#E8E8E8] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all cursor-default"
              >
                {lang}
              </span>
            ))}
          </div>

          <p className="text-[#888888] text-[14px]">
            Not formal. Not bookish. Think Hinglish, how creators speak on WhatsApp.
          </p>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────── */}
      <section id="pricing" className="bg-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold uppercase tracking-[0.5px] px-[14px] py-[6px] rounded-full">
              Pricing
            </span>
          </div>

          <h2
            className="text-center text-[#111111] font-bold mb-3"
            style={{ fontSize: "clamp(28px, 4vw, 36px)", letterSpacing: "-1px" }}
          >
            Simple, one-time pricing
          </h2>
          <p className="text-center text-[#888888] text-[18px] mb-16">
            No subscriptions. Credits never expire.
          </p>

          {/* How credits work */}
          <div className="flex flex-col gap-3 mb-14 max-w-xl mx-auto w-full">
            {[
              "1 credit = 1 complete pack (3 titles + 1 hook script + 3 thumbnail ideas)",
              "Free credits reset monthly on your signup date. Purchased credits never expire.",
              "Refer a friend. You both earn 5 credits when they make their first purchase.",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#E8192C] shrink-0 mt-0.5" />
                <p className="text-[15px] text-[#3D3D3D] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Credit packs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">

            {/* Free card */}
            <div
              className="relative flex flex-col rounded-2xl border-2 border-[#86EFAC]"
              style={{ padding: "28px", background: "#F0FDF4", boxShadow: "0 2px 8px rgba(22,163,74,0.08), 0 8px 32px rgba(22,163,74,0.06)" }}
            >
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                ALWAYS FREE
              </span>
              <p style={{ fontSize: "56px", fontWeight: 800, color: "#111111", lineHeight: 1 }}>2</p>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "#9B9B9B", marginTop: "4px" }}>credits / month</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#16A34A", marginTop: "6px" }}>every month, forever</p>
              <p style={{ fontSize: "13px", fontWeight: 400, color: "#9B9B9B", marginTop: "12px" }}>Resets on signup date</p>
              <Link
                href="/login"
                className="w-full text-white font-semibold text-[15px] text-center rounded-full transition-all hover:opacity-90"
                style={{ marginTop: "24px", paddingTop: "14px", paddingBottom: "14px", display: "block", background: "#16A34A" }}
              >
                Get Started Free
              </Link>
            </div>

            {creditPacks.map((pack) => (
              <div
                key={pack.type}
                className={`relative flex flex-col bg-white rounded-2xl ${
                  pack.best
                    ? "border-2 border-[#E8192C]"
                    : "border border-[#F0F0F0]"
                }`}
                style={{
                  padding: "28px",
                  ...(pack.best
                    ? { transform: "scale(1.03)", boxShadow: "0 8px 40px rgba(232,25,44,0.15)" }
                    : { boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }),
                }}
              >
                {pack.best && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E8192C] text-white text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                    BEST VALUE
                  </span>
                )}
                <p style={{ fontSize: "56px", fontWeight: 800, color: "#111111", lineHeight: 1 }}>
                  {pack.credits}
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400, color: "#9B9B9B", marginTop: "4px" }}>
                  credits
                </p>
                <p style={{ fontSize: "13px", fontWeight: 400, color: "#9B9B9B", marginTop: "16px" }}>
                  {pack.perCredit} per credit
                </p>
                <Link
                  href="/login"
                  className={`w-full text-white font-semibold text-[15px] text-center rounded-full transition-all ${
                    pack.best
                      ? "bg-[#E8192C] hover:bg-[#C41523]"
                      : "bg-[#111111] hover:bg-zinc-800"
                  }`}
                  style={{ marginTop: "24px", paddingTop: "14px", paddingBottom: "14px", display: "block" }}
                >
                  Buy for {pack.price}
                </Link>
              </div>
            ))}
          </div>

          {/* Stacking callout */}
          <div
            className="mt-6 flex items-start gap-3 rounded-2xl px-5 py-4 max-w-2xl mx-auto w-full"
            style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <span className="w-5 h-5 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0 mt-0.5 text-white text-[11px] font-bold">+</span>
            <p style={{ fontSize: "14px", color: "#3D3D3D", lineHeight: "1.6" }}>
              <span style={{ fontWeight: 600, color: "#15803D" }}>Free credits never go away.</span>{" "}
              Even after buying a pack, you still get 2 fresh credits every month on top of your balance.
            </p>
          </div>

          <p className="text-center text-[13px] mt-3" style={{ color: "#9B9B9B" }}>
            Purchased credits never expire · Stack across purchases
          </p>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────── */}
      <section
        className="py-24 sm:py-32 flex flex-col items-center text-center px-6"
        style={{
          background: [
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,25,44,0.12) 0%, transparent 70%)",
            "#0D0D0D",
          ].join(", "),
        }}
      >
        <h2
          className="text-white font-bold mb-4"
          style={{ fontSize: "clamp(30px, 5vw, 48px)", letterSpacing: "-2px", lineHeight: 1.15 }}
        >
          Stop guessing.<br />
          <span className="text-[#888888]">Start growing.</span>
        </h2>
        <p className="text-[#888888] text-[18px] max-w-sm mb-10 leading-relaxed">
          Join creators who plan smarter with VidUp.
        </p>
        <Link
          href="/login"
          className="bg-[#E8192C] text-white text-[15px] font-semibold px-8 py-4 rounded-full hover:bg-[#C41523] hover:shadow-[0_4px_16px_rgba(232,25,44,0.35)] transition-all"
        >
          Get Started Free
        </Link>
        <p className="text-[#555555] text-[12px] mt-5">2 free credits/month · No card required</p>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="relative overflow-hidden py-16 px-6" style={{ background: "#0D0D0D" }}>
        <span
          className="absolute bottom-0 right-0 select-none pointer-events-none text-white font-black leading-none"
          style={{ fontSize: "clamp(80px, 15vw, 180px)", opacity: 0.04, letterSpacing: "-4px", transform: "translateY(25%)" }}
        >
          VidUp
        </span>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <span className="text-white text-[18px] font-bold tracking-tight">
                vid<span className="text-[#E8192C]">up</span>
              </span>
              <p className="text-[#555555] text-[14px] mt-1">Built for YouTube Creators</p>
            </div>

            <div className="flex items-center gap-8 text-[14px] text-[#555555]">
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
            </div>
          </div>

          <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#555555]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span>© 2025 VidUp. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
