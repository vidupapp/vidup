import WaitlistForm from "./components/WaitlistForm";
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
    desc: "VidUp reads your competitors' patterns — what titles perform, what hooks hold attention, what thumbnails get clicked.",
  },
  {
    number: "03",
    title: "Get your full pre-production pack",
    desc: "3 scroll-stopping titles, 1 hook script (30–45 sec, paste-ready), and 3 thumbnail ideas. In seconds.",
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    credits: "2 credits/month",
    note: "Resets monthly",
    features: ["2 generations/month", "All output formats", "All 10 languages", "History dashboard"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Starter",
    price: "₹79",
    credits: "25 credits",
    note: "Never expires",
    features: ["25 generations", "All output formats", "All 10 languages", "History dashboard"],
    cta: "Get Starter",
    highlight: false,
  },
  {
    name: "Creator",
    price: "₹149",
    credits: "55 credits",
    note: "Never expires",
    features: ["55 generations", "All output formats", "All 10 languages", "History dashboard", "Performance insights"],
    cta: "Get Creator",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹299",
    credits: "120 credits",
    note: "Never expires",
    features: ["120 generations", "All output formats", "All 10 languages", "History dashboard", "Performance insights", "Learning engine access"],
    cta: "Get Pro",
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/8 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <span className="text-xl font-bold tracking-tight">
          vid<span className="text-[#F5C842]">up</span>
        </span>
        <div className="flex items-center gap-5 text-sm">
          <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">How it works</a>
          <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">Pricing</a>
          <Link href="/login" className="text-zinc-400 hover:text-white transition-colors text-sm hidden sm:block">Sign in</Link>
          <Link
            href="/signup"
            className="bg-[#F5C842] text-black font-semibold px-5 py-2 rounded-full hover:bg-[#f0bc2e] transition-colors text-sm"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="waitlist" className="flex flex-col items-center text-center px-6 pt-24 pb-28 gap-7 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#F5C842]/10 border border-[#F5C842]/25 text-[#F5C842] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-[#F5C842] rounded-full animate-pulse" />
          Coming Soon — Join the Waitlist
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
          One click.<br />
          <span className="text-[#F5C842]">Viral ready.</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
          VidUp analyzes your competitors and generates your complete pre-production pack —
          3 titles, 1 hook script, and 3 thumbnail ideas — in seconds.
          Built for YouTube creators who are serious about growth.
        </p>

        <WaitlistForm />

        <p className="text-zinc-600 text-sm">No credit card required · 2 free generations/month forever</p>

        {/* Social proof placeholder */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex -space-x-2">
            {["🎬", "🎥", "📹", "🎞️"].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs">
                {e}
              </div>
            ))}
          </div>
          <span className="text-zinc-500 text-sm">Join <span className="text-zinc-300 font-medium">200+ creators</span> on the waitlist</span>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#F5C842] text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold">From idea to ready-to-film in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative bg-black border border-white/8 rounded-2xl p-7 hover:border-[#F5C842]/30 transition-colors group">
                <span className="text-5xl font-black text-white/5 group-hover:text-[#F5C842]/10 transition-colors absolute top-5 right-6 select-none">
                  {step.number}
                </span>
                <div className="text-[#F5C842] font-black text-2xl mb-4">{step.number}</div>
                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#F5C842] text-sm font-semibold uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-3xl sm:text-4xl font-bold">One generation. Everything you need.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🏷️",
                title: "3 Titles",
                items: ["Curiosity Gap title", "Emotional Trigger title", "SEO Optimised title"],
                extra: "Each with click score + why it works",
              },
              {
                icon: "🎙️",
                title: "1 Hook Script",
                items: ["Opening line (scroll stopper)", "Tension builder", "Payoff promise", "Full 30–45 sec script"],
                extra: "Paste-ready, no editing needed",
              },
              {
                icon: "🖼️",
                title: "3 Thumbnail Ideas",
                items: ["Visual layout description", "Emotion + color mood", "Text overlay (max 3 words)"],
                extra: "Specific enough to build on Canva",
              },
            ].map((card) => (
              <div key={card.title} className="bg-zinc-950 border border-white/8 rounded-2xl p-7">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-white font-bold text-xl mb-4">{card.title}</h3>
                <ul className="space-y-2 mb-4">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className="text-[#F5C842] mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-600 border-t border-white/5 pt-4">{card.extra}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="px-6 py-16 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#F5C842] text-sm font-semibold uppercase tracking-widest mb-3">Languages</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Your language. Your audience.</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Hindi", "English", "Tamil", "Telugu", "Marathi", "Kannada", "Bengali", "Gujarati", "Malayalam", "Punjabi"].map((lang) => (
              <span key={lang} className="bg-black border border-white/10 text-zinc-300 text-sm px-4 py-2 rounded-full hover:border-[#F5C842]/40 transition-colors">
                {lang}
              </span>
            ))}
          </div>
          <p className="text-zinc-600 text-sm mt-6">Natural code-switching — the way creators actually speak, not textbook language</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#F5C842] text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, one-time pricing</h2>
            <p className="text-zinc-400 mt-3">No subscriptions. Credits never expire. Pay once, use anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col gap-5 border transition-all ${
                  plan.highlight
                    ? "bg-[#F5C842] text-black border-[#F5C842]"
                    : "bg-zinc-950 text-white border-white/8 hover:border-white/20"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-[#F5C842] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#F5C842]/30">
                    Most Popular
                  </span>
                )}
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${plan.highlight ? "text-black/60" : "text-zinc-500"}`}>
                    {plan.name}
                  </p>
                  <p className="text-3xl font-black">{plan.price}</p>
                  <p className={`text-sm mt-1 font-medium ${plan.highlight ? "text-black/70" : "text-zinc-400"}`}>
                    {plan.credits} · {plan.note}
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-black/80" : "text-zinc-400"}`}>
                      <span className={plan.highlight ? "text-black" : "text-[#F5C842]"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-black text-[#F5C842] hover:bg-zinc-900"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-600 text-sm mt-8">
            All paid credits stack and never expire. Referral bonus: 5 free credits when a friend buys any pack.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 bg-zinc-950">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Stop guessing.<br />
            <span className="text-[#F5C842]">Start growing.</span>
          </h2>
          <p className="text-zinc-400">Join the waitlist and be first when VidUp launches.</p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <span>
            vid<span className="text-[#F5C842]">up</span> · One click. Viral ready.
          </span>
          <span>© {new Date().getFullYear()} VidUp. Built for creators.</span>
        </div>
      </footer>
    </div>
  );
}
