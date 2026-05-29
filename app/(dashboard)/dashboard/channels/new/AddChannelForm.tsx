"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const AUDIENCES = [
  "Students (School) — 10-16 years",
  "Students (College) — 17-22 years",
  "Young Professionals — 22-30 years",
  "Working Professionals — 30-45 years",
  "Entrepreneurs — any age",
  "Parents — 28-45 years",
  "Homemakers — 25-50 years",
  "Senior Professionals — 45+",
  "General Audience — all ages",
  "Kids — under 12",
];

function validateYouTubeUrl(url: string): "empty" | "valid" | "invalid" {
  if (!url.trim()) return "empty";
  try {
    const u = new URL(url.trim());
    const isYT = u.hostname.includes("youtube.com") || u.hostname === "youtu.be";
    if (!isYT) return "invalid";
    const path = u.pathname;
    const valid =
      path.startsWith("/@") ||
      path.startsWith("/channel/") ||
      path.startsWith("/c/") ||
      path.startsWith("/user/") ||
      u.hostname === "youtu.be";
    return valid ? "valid" : "invalid";
  } catch {
    return url.trim().length > 3 ? "invalid" : "empty";
  }
}

export default function AddChannelForm({ channelCount }: { channelCount: number }) {
  const router = useRouter();
  const [channelUrl, setChannelUrl] = useState("");
  const [audiences, setAudiences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const urlState = validateYouTubeUrl(channelUrl);

  function toggleAudience(a: string) {
    setAudiences((prev) => {
      if (prev.includes(a)) return prev.filter((x) => x !== a);
      if (prev.length >= 3) return prev;
      return [...prev, a];
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (urlState !== "valid") {
      setError("Please enter a valid YouTube channel URL.");
      return;
    }
    if (audiences.length === 0) {
      setError("Please select at least one audience.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/channels/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_url: channelUrl.trim(),
          target_audience: audiences,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.error ?? "Something went wrong. Please try again.";
        setError(
          msg.includes("not found") ? "Channel not found. Check the URL and try again." :
          msg.includes("Invalid") ? "Invalid URL. Use youtube.com/@handle or /channel/UC…" :
          msg
        );
        return;
      }

      router.push("/dashboard/channels");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (channelCount >= 2) {
    return (
      <div
        className="bg-white rounded-2xl p-8 border border-[#F0F0F0] text-center"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <p className="text-[16px] font-semibold text-[#111111] mb-2">Channel limit reached</p>
        <p className="text-[14px] text-[#888888] leading-relaxed">
          You can add a maximum of 2 channels. Remove one to add another.
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full bg-white border-[1.5px] rounded-[10px] px-4 pr-11 text-[15px] text-[#111111] placeholder-[#AAAAAA] h-[46px] focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Channel URL */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#111111]">
          YouTube Channel URL <span className="text-[#E8192C]">*</span>
        </label>
        <p className="text-[13px] text-[#888888] -mt-1">
          youtube.com/@handle · youtube.com/channel/UC… · youtube.com/c/name
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="https://www.youtube.com/@yourchannel"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
            disabled={loading}
            className={`${inputBase} ${
              urlState === "valid"
                ? "border-[#16A34A] focus:border-[#16A34A] focus:shadow-[0_0_0_3px_rgba(22,163,74,0.10)]"
                : urlState === "invalid"
                ? "border-[#E8192C] focus:border-[#E8192C] focus:shadow-[0_0_0_3px_rgba(232,25,44,0.10)]"
                : "border-[#E8E8E8] focus:border-[#111111]"
            } disabled:opacity-50`}
          />
          {urlState === "valid" && (
            <CheckCircle2
              size={18}
              strokeWidth={2}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#16A34A] pointer-events-none"
            />
          )}
          {urlState === "invalid" && (
            <AlertCircle
              size={18}
              strokeWidth={2}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#E8192C] pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Target Audience — multi-select pills, max 3 */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-[14px] font-medium text-[#111111]">
            Target Audience <span className="text-[#E8192C]">*</span>
          </label>
          <p className="text-[13px] text-[#888888] mt-0.5">Select up to 3</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => {
            const selected = audiences.includes(a);
            const dimmed = !selected && audiences.length >= 3;
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAudience(a)}
                disabled={dimmed || loading}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-all ${
                  selected
                    ? "bg-[#E8192C] text-white border-transparent"
                    : dimmed
                    ? "bg-[#F5F5F5] text-[#AAAAAA] border border-[#E8E8E8] opacity-50 cursor-not-allowed"
                    : "bg-[#F5F5F5] text-[#3D3D3D] border border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
        {/* Counter */}
        <p className={`text-[13px] ${audiences.length === 3 ? "text-[#E8192C]" : "text-[#9B9B9B]"}`}>
          {audiences.length} of 3 selected
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 text-[#E8192C] text-[14px] bg-[#FFF0F0] border border-[#E8192C]/20 rounded-[10px] px-4 py-3">
          <AlertCircle size={16} strokeWidth={2} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="border-t border-[#F0F0F0]" />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E8192C] text-white text-[15px] font-semibold py-[14px] rounded-lg hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Fetching channel data…
          </>
        ) : (
          "Add Channel"
        )}
      </button>

    </form>
  );
}
