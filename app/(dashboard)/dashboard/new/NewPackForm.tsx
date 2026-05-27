"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  "Hindi", "English", "Tamil", "Telugu", "Marathi",
  "Kannada", "Bengali", "Gujarati", "Malayalam", "Punjabi",
];

const STYLES = ["Educational", "Story", "Opinion", "Entertainment"];

export default function NewPackForm({ credits }: { credits: number }) {
  const router = useRouter();

  const [topic, setTopic]       = useState("");
  const [style, setStyle]       = useState("");
  const [language, setLanguage] = useState("");
  const [links, setLinks]       = useState(["", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const updateLink = (i: number, val: string) => {
    const updated = [...links];
    updated[i] = val;
    setLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate YouTube links
    const filledLinks = links.filter((l) => l.trim() !== "");
    if (filledLinks.length < 3) {
      setError("Please paste all 3 competitor YouTube links.");
      return;
    }
    const isYouTube = (url: string) =>
      url.includes("youtube.com/watch") || url.includes("youtu.be/");
    if (!filledLinks.every(isYouTube)) {
      setError("All 3 links must be valid YouTube video URLs.");
      return;
    }

    setLoading(true);
    // AI generation will be wired here in Month 2
    // For now, simulate a short delay and redirect
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Topic */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#0A0A0A]">
          Video Topic <span className="text-[#E8192C]">*</span>
        </label>
        <textarea
          required
          rows={3}
          placeholder="Describe what your video is about in 1–2 lines. E.g. How I saved ₹1 lakh in 6 months on a ₹30k salary"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder-zinc-400 text-sm focus:outline-none focus:border-[#E8192C]/50 focus:bg-white transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Style + Language row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#0A0A0A]">
            Video Style <span className="text-[#E8192C]">*</span>
          </label>
          <select
            required
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#E8192C]/50 focus:bg-white transition-all text-[#0A0A0A] appearance-none cursor-pointer"
          >
            <option value="" disabled>Select style</option>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#0A0A0A]">
            Language <span className="text-[#E8192C]">*</span>
          </label>
          <select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#E8192C]/50 focus:bg-white transition-all text-[#0A0A0A] appearance-none cursor-pointer"
          >
            <option value="" disabled>Select language</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Competitor links */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#0A0A0A]">
          Competitor YouTube Links <span className="text-[#E8192C]">*</span>
        </label>
        <p className="text-xs text-zinc-400 -mt-1">
          Paste 3 videos from your niche that are performing well
        </p>
        <div className="flex flex-col gap-3 mt-1">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-300 w-4 shrink-0">{i + 1}</span>
              <input
                type="url"
                required
                placeholder={`https://youtube.com/watch?v=...`}
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder-zinc-400 text-sm focus:outline-none focus:border-[#E8192C]/50 focus:bg-white transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      {/* Submit */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          1 credit will be deducted · {credits} remaining
        </p>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#E8192C] text-white font-semibold px-7 py-3 rounded-full text-sm hover:bg-[#c9151f] transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Pack →"
          )}
        </button>
      </div>

    </form>
  );
}
