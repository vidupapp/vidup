"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Setup failed."); return; }
      router.push("/admin/login?setup=1");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Full name</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Suyog Wale" required
        />
      </div>
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="you@vidup.in" required
        />
      </div>
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Min 8 characters" required
        />
      </div>
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Confirm password</label>
        <input
          type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Same as above" required
        />
      </div>

      {error && <p className="text-[13px] text-[#E8192C]">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-[#E8192C] text-white font-semibold text-[15px] py-3.5 rounded-full hover:bg-[#C41523] transition-all disabled:opacity-50 mt-1"
      >
        {loading ? "Creating..." : "Create Admin Account"}
      </button>
    </form>
  );
}
