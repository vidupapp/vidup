"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-[#F5C842]/10 border border-[#F5C842]/30 rounded-full px-6 py-4">
        <span className="text-[#F5C842] text-xl">✓</span>
        <span className="text-[#F5C842] font-semibold">You're on the list! We'll be in touch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white/5 border border-white/15 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#F5C842]/60 focus:bg-white/8 transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#F5C842] text-black font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#f0bc2e] transition-colors disabled:opacity-70 whitespace-nowrap"
      >
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
}
