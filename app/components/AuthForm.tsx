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
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for a confirmation link!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-5">
      <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder-zinc-400 text-sm focus:outline-none focus:border-[#E8192C]/50 focus:bg-white transition-all"
        />
        <input
          type="password"
          required
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder-zinc-400 text-sm focus:outline-none focus:border-[#E8192C]/50 focus:bg-white transition-all"
        />

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        {message && (
          <p className="text-[#E8192C] text-sm bg-[#E8192C]/5 border border-[#E8192C]/20 rounded-xl px-4 py-3">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#E8192C] text-white font-semibold py-3.5 rounded-full hover:bg-[#c9151f] transition-colors disabled:opacity-60 text-sm mt-1"
        >
          {loading
            ? mode === "signup"
              ? "Creating account..."
              : "Signing in..."
            : mode === "signup"
            ? "Create account"
            : "Sign in"}
        </button>
      </form>

      <p className="text-center text-zinc-500 text-sm">
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
            <Link href="/signup" className="text-[#E8192C] hover:underline font-medium">
              Sign up free
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
