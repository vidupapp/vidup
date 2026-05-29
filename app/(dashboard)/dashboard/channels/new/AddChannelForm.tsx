"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Education", "Entertainment", "Finance", "Tech",
  "Lifestyle", "Gaming", "Food", "Other",
];

const AUDIENCES = [
  "Students", "Working professionals", "Parents", "General", "Kids",
];

const FREQUENCIES = [
  "Daily", "2-3x week", "Weekly", "Bi-weekly", "Monthly",
];

export default function AddChannelForm({ channelCount }: { channelCount: number }) {
  const router = useRouter();
  const [channelUrl, setChannelUrl] = useState("");
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState("");
  const [frequency, setFrequency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputBase =
    "w-full bg-white border-[1.5px] border-[#E8E8E8] rounded-[10px] px-4 text-[15px] text-[#111111] placeholder-[#AAAAAA] h-[46px] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!channelUrl.trim().includes("youtube.com") && !channelUrl.includes("youtu.be")) {
      setError("Please enter a valid YouTube channel URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/channels/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_url: channelUrl.trim(),
          content_category: category,
          target_audience: audience,
          upload_frequency: frequency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Channel URL */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#111111]">
          YouTube Channel URL <span className="text-[#E8192C]">*</span>
        </label>
        <p className="text-[13px] text-[#888888] -mt-1">
          e.g. youtube.com/@yourhandle or youtube.com/channel/UCxxxxx
        </p>
        <input
          type="url"
          required
          placeholder="https://www.youtube.com/@yourchannel"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          className={inputBase}
        />
      </div>

      {/* Category + Audience */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Content Category <span className="text-[#E8192C]">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputBase + " appearance-none cursor-pointer pr-9"}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none text-[12px]">▾</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Target Audience <span className="text-[#E8192C]">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={inputBase + " appearance-none cursor-pointer pr-9"}
            >
              <option value="" disabled>Select audience</option>
              {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none text-[12px]">▾</span>
          </div>
        </div>
      </div>

      {/* Upload frequency */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#111111]">
          Upload Frequency <span className="text-[#E8192C]">*</span>
        </label>
        <div className="relative">
          <select
            required
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={inputBase + " appearance-none cursor-pointer pr-9"}
          >
            <option value="" disabled>Select frequency</option>
            {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none text-[12px]">▾</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p
          className="text-[#E8192C] text-[14px] bg-[#FFF0F0] border border-[#E8192C]/20 rounded-[10px] px-4 py-3"
          style={{ boxShadow: "0 0 0 3px rgba(232,25,44,0.06)" }}
        >
          {error}
        </p>
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
