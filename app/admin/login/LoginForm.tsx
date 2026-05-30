"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setupSuccess = params.get("setup") === "1";
  const inviteSuccess = params.get("invited") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed."); return; }
      router.push("/admin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {setupSuccess && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3">
          <p className="text-[13px] text-[#15803D] font-medium">
            Admin account created. Please sign in.
          </p>
        </div>
      )}
      {inviteSuccess && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3">
          <p className="text-[13px] text-[#15803D] font-medium">
            Account created successfully. Please sign in.
          </p>
        </div>
      )}

      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="you@vidup.in" required autoFocus
        />
      </div>
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Your password" required
        />
      </div>

      {error && <p className="text-[13px] text-[#E8192C]">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-[#E8192C] text-white font-semibold text-[15px] py-3.5 rounded-full hover:bg-[#C41523] transition-all disabled:opacity-50 mt-1"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
