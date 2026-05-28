import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Describe your video",
    desc: "Tell us your topic, style, and paste 3 competitor YouTube links from your niche.",
  },
  {
    number: "02",
    title: "We analyze what's working",
    desc: "VidUp reads your competitors' patterns — titles that perform, hooks that hold attention, thumbnails that get clicked.",
  },
  {
    number: "03",
    title: "Get your full pre-production pack",
    desc: "3 scroll-stopping titles, 1 hook script (30–45 sec, paste-ready), and 3 thumbnail ideas. In seconds.",
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
      "Why it works — 1 line",
    ],
    note: "Each title analysed against competitor patterns",
  },
  {
    icon: "🎙️",
    title: "1 Hook Script",
    items: [
      "Opening line (scroll stopper)",
      "Tension builder (3–4 sentences)",
      "Payoff promise",
      "Full 30–45 sec script",
      "Psychological trigger used",
    ],
    note: "Paste-ready — no editing needed",
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

const freeFeatures = [
  { text: "2 credits/month", included: true },
  { text: "Resets monthly", included: true },
  { text: "Basic output only", included: true },
  { text: "Competitor analysis", included: false },
  { text: "Performance insights", included: false },
  { text: "Credits carry forward", included: false },
];

const paidFeatures = [
  "Full AI-powered output",
  "Competitor link analysis",
  "All 10 languages",
  "Performance insights",
  "History dashboard",
  "Credits never expire",
  "Stack multiple packs",
];

const creditPacks = [
  { name: "Starter", price: "₹79",  credits: 25,  perCredit: "₹3.16", bestValue: false },
  { name: "Creator", price: "₹149", credits: 55,  perCredit: "₹2.71", bestValue: true  },
  { name: "Pro",     price: "₹299", credits: 120, perCredit: "₹2.49", bestValue: false },
];

const languages = [
  "Hindi", "English", "Tamil", "Telugu", "Marathi",
  "Kannada", "Bengali", "Gujarati", "Malayalam", "Punjabi",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans">

      {/* ── HEADER ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-10 h-16">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#0A0A0A]">
            vid<span className="text-[#E8192C]">up</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-7 text-sm text-zinc-500">
            <a href="#how-it-works" className="hover:text-[#0A0A0A] transition-colors">How it works</a>
            <a href="#pricing"      className="hover:text-[#0A0A0A] transition-colors">Pricing</a>
            <Link href="/login"     className="hover:text-[#0A0A0A] transition-colors">Sign in</Link>
          </nav>

          <Link
            href="/login"
            className="bg-[#E8192C] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#c9151f] transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="bg-[#0A0A0A] text-white px-6 py-28 sm:py-36 flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 border border-white/15 text-zinc-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-[#E8192C] rounded-full" />
          Built for YouTube Creators
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.04] max-w-3xl">
          One click.<br />
          <span className="text-[#E8192C]">Viral ready.</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed">
          VidUp analyzes your competitors and generates 3 titles, 1 hook script,
          and 3 thumbnail ideas in seconds.
        </p>

        <Link
          href="/login"
          className="bg-[#E8192C] text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-[#c9151f] transition-colors"
        >
          Get Started Free →
        </Link>

        <p className="text-zinc-600 text-sm">2 free credits/month · No card required</p>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section id="how-it-works" className="bg-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#E8192C] text-xs font-bold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold">From idea to ready-to-film in 3 steps</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative bg-[#F5F5F5] border border-zinc-200 rounded-2xl p-7 shadow-sm hover:border-[#E8192C]/25 transition-colors group"
              >
                <span className="absolute top-5 right-6 text-5xl font-black text-black/[0.04] group-hover:text-[#E8192C]/[0.06] transition-colors select-none">
                  {step.number}
                </span>
                <p className="text-[#E8192C] font-black text-xl mb-4">{step.number}</p>
                <h3 className="text-[#0A0A0A] font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ───────────────────────────── */}
      <section className="bg-white px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#E8192C] text-xs font-bold uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-3xl sm:text-4xl font-bold">One pack. Everything you need.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {outputCards.map((card) => (
              <div key={card.title} className="bg-[#F5F5F5] border border-zinc-200 rounded-2xl p-7 shadow-sm flex flex-col">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-[#0A0A0A] font-bold text-xl mb-4">{card.title}</h3>
                <ul className="space-y-2.5 flex-1">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-500">
                      <span className="text-[#E8192C] mt-px font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-400 border-t border-zinc-200 pt-4 mt-5">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ──────────────────────────────── */}
      <section className="bg-[#F5F5F5] px-6 py-20 border-y border-zinc-200">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#E8192C] text-xs font-bold uppercase tracking-widest mb-3">Languages</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Your language. Your audience.</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-white border border-zinc-200 text-zinc-600 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:border-[#E8192C]/30 transition-colors"
              >
                {lang}
              </span>
            ))}
          </div>
          <p className="text-zinc-400 text-sm mt-6">
            Natural code-switching — the way creators actually speak, not textbook language
          </p>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────── */}
      <section id="pricing" className="bg-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#E8192C] text-xs font-bold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, one-time pricing</h2>
            <p className="text-zinc-500 mt-3 text-sm">No subscriptions. Credits never expire. Pay once, use anytime.</p>
          </div>

          {/* Part 1 — Free vs Paid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {/* Free */}
            <div className="bg-[#F5F5F5] border border-zinc-200 rounded-2xl p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Free</p>
              <p className="text-4xl font-black text-[#0A0A0A]">₹0</p>
              <p className="text-zinc-400 text-sm mt-1 mb-7">2 credits/month · Resets monthly</p>
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    <span className={`font-bold text-base leading-none ${f.included ? "text-[#E8192C]" : "text-zinc-300"}`}>
                      {f.included ? "✓" : "✕"}
                    </span>
                    <span className={f.included ? "text-zinc-700" : "text-zinc-300"}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paid */}
            <div className="bg-[#0A0A0A] border border-[#0A0A0A] rounded-2xl p-7 text-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Any paid pack</p>
              <p className="text-4xl font-black text-white">Full access</p>
              <p className="text-zinc-500 text-sm mt-1 mb-7">Unlock everything with any credit pack</p>
              <ul className="space-y-3">
                {paidFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="text-[#E8192C] font-bold text-base leading-none">✓</span>
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Part 2 — Credit packs */}
          <h3 className="text-center text-base font-bold text-[#0A0A0A] mb-6">Pick your credit pack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {creditPacks.map((pack) => (
              <div
                key={pack.name}
                className={`relative rounded-2xl p-6 flex flex-col gap-4 border transition-all ${
                  pack.bestValue
                    ? "bg-[#E8192C] border-[#E8192C] shadow-lg shadow-[#E8192C]/20"
                    : "bg-[#F5F5F5] border-zinc-200 shadow-sm hover:border-zinc-300"
                }`}
              >
                {pack.bestValue && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                    Best Value
                  </span>
                )}

                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${pack.bestValue ? "text-white/60" : "text-zinc-400"}`}>
                    {pack.name}
                  </p>
                  <p className={`text-4xl font-black ${pack.bestValue ? "text-white" : "text-[#0A0A0A]"}`}>
                    {pack.price}
                  </p>
                </div>

                <div>
                  <p className={`text-xl font-bold ${pack.bestValue ? "text-white" : "text-[#0A0A0A]"}`}>
                    {pack.credits} credits
                  </p>
                  <p className={`text-sm mt-0.5 ${pack.bestValue ? "text-white/65" : "text-zinc-400"}`}>
                    {pack.perCredit} per credit
                  </p>
                </div>

                <Link
                  href="/login"
                  className={`w-full py-3 rounded-full font-semibold text-sm text-center transition-colors mt-auto ${
                    pack.bestValue
                      ? "bg-white text-[#E8192C] hover:bg-zinc-100"
                      : "bg-[#0A0A0A] text-white hover:bg-zinc-800"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          {/* Clarification */}
          <p className="text-center text-zinc-400 text-sm mt-8 leading-relaxed">
            All packs unlock full features. Credits never expire and stack when you buy more.<br />
            Top up anytime with any pack.
          </p>
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────── */}
      <section className="bg-[#0A0A0A] text-white px-6 py-24 flex flex-col items-center text-center gap-7">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Stop guessing.<br />
          <span className="text-[#E8192C]">Start growing.</span>
        </h2>
        <p className="text-zinc-400 text-base max-w-sm">
          Join thousands of creators who plan smarter with VidUp.
        </p>
        <Link
          href="/login"
          className="bg-[#E8192C] text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-[#c9151f] transition-colors"
        >
          Get Started Free →
        </Link>
        <p className="text-zinc-600 text-sm">2 free credits/month · No card required</p>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="bg-white border-t border-zinc-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-400">
          <span className="font-bold text-[#0A0A0A] text-base">
            vid<span className="text-[#E8192C]">up</span>
          </span>
          <span>Built for YouTube Creators</span>
          <span>© 2025 VidUp</span>
        </div>
      </footer>

    </div>
  );
}
