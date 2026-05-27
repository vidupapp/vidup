export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">vidup</span>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-32 gap-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 border border-white/10 px-4 py-1.5 rounded-full">
          Now in Beta
        </span>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none max-w-3xl">
          Video for the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
            modern web
          </span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
          Upload, stream, and share videos at lightning speed. Built for creators
          and developers who need more than the basics.
        </p>
        <div className="flex gap-4 mt-2">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors">
            Start for free
          </button>
          <button className="border border-white/20 px-6 py-3 rounded-full font-semibold hover:bg-white/5 transition-colors">
            Watch demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-12 text-zinc-200">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Fast uploads", desc: "Upload videos in seconds with our optimized pipeline." },
            { icon: "🎬", title: "Adaptive streaming", desc: "HLS streaming that adapts to any connection speed." },
            { icon: "🔒", title: "Private by default", desc: "Full control over who sees your content." },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-zinc-600 text-sm">
        © {new Date().getFullYear()} vidup. All rights reserved.
      </footer>
    </div>
  );
}
