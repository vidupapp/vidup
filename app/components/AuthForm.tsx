"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setMessage("Check your email for a confirmation link!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  };

  const inputBase =
    "w-full bg-white border-[1.5px] border-[#E8E8E8] rounded-[10px] px-4 text-[15px] text-[#111111] placeholder-[#AAAAAA] h-[46px] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-all";

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputBase}
        />
        <input
          type="password"
          required
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputBase}
        />

        {error && (
          <p
            className="text-[#E8192C] text-[14px] bg-[#FFF0F0] border border-[#E8192C]/20 rounded-[10px] px-4 py-3"
            style={{ boxShadow: "0 0 0 3px rgba(232,25,44,0.06)" }}
          >
            {error}
          </p>
        )}
        {message && (
          <p className="text-[#16A34A] text-[14px] bg-[#F0FFF4] border border-[#16A34A]/20 rounded-[10px] px-4 py-3">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E8192C] text-white text-[15px] font-semibold py-[14px] rounded-[10px] hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-1"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {mode === "signup" ? "Creating account..." : "Signing in..."}
            </>
          ) : mode === "signup" ? (
            "Create account"
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-center text-[14px] text-[#888888]">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-[#E8192C] hover:underline font-medium">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/login" className="text-[#E8192C] hover:underline font-medium">
              Sign up free
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
