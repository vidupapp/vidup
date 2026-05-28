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

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("");
  const [language, setLanguage] = useState("");
  const [links, setLinks] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateLink = (i: number, val: string) => {
    const updated = [...links];
    updated[i] = val;
    setLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
    // AI generation wired in Month 2
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push("/dashboard");
  };

  const inputBase =
    "w-full bg-white border-[1.5px] border-[#E8E8E8] rounded-[10px] px-4 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Topic */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#111111]">
          Video Topic <span className="text-[#E8192C]">*</span>
        </label>
        <textarea
          required
          rows={3}
          placeholder="Describe what your video is about in 1–2 lines. E.g. How I saved ₹1 lakh in 6 months on a ₹30k salary"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={inputBase + " resize-y min-h-[96px] py-3 leading-relaxed"}
        />
      </div>

      {/* Style + Language */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Video Style <span className="text-[#E8192C]">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={inputBase + " h-[46px] appearance-none cursor-pointer pr-9"}
            >
              <option value="" disabled>Select style</option>
              {STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none text-[12px]">
              ▾
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Language <span className="text-[#E8192C]">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputBase + " h-[46px] appearance-none cursor-pointer pr-9"}
            >
              <option value="" disabled>Select language</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none text-[12px]">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* YouTube links */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#111111]">
          Competitor YouTube Links <span className="text-[#E8192C]">*</span>
        </label>
        <p className="text-[13px] text-[#888888] -mt-1">
          Paste 3 videos from your niche that are performing well
        </p>
        <div className="flex flex-col gap-3 mt-1">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-[#CCCCCC] w-4 shrink-0 text-center">{i + 1}</span>
              <input
                type="url"
                required
                placeholder="https://youtube.com/watch?v=..."
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                className={inputBase + " h-[46px]"}
              />
            </div>
          ))}
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

      {/* Submit */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E8192C] text-white text-[15px] font-semibold py-[14px] rounded-lg hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Pack · 1 credit"
          )}
        </button>
        <p className="text-center text-[13px] text-[#888888]">
          You have {credits} credit{credits !== 1 ? "s" : ""} remaining
        </p>
      </div>

    </form>
  );
}
