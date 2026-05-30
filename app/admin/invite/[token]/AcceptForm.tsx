"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props { token: string; email: string; role: string }

export default function AcceptForm({ token, email, role }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ name?: string; password?: string; confirm?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    if (password !== confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name: name.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ general: data.error ?? "Something went wrong." }); return; }
      router.push("/admin/login?invited=1");
    } catch {
      setErrors({ general: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Your full name</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Full name" required autoFocus
        />
        {errors.name && <p className="text-[12px] text-[#E8192C] mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Min 8 characters" required
        />
        {errors.password && <p className="text-[12px] text-[#E8192C] mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Confirm password</label>
        <input
          type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
          placeholder="Same as above" required
        />
        {errors.confirm && <p className="text-[12px] text-[#E8192C] mt-1">{errors.confirm}</p>}
      </div>

      {errors.general && <p className="text-[13px] text-[#E8192C]">{errors.general}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-[#E8192C] text-white font-semibold text-[15px] py-3.5 rounded-full hover:bg-[#C41523] transition-all disabled:opacity-50 mt-1"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
