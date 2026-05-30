"use client";

import { useState } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  "Hindi", "English", "Tamil", "Telugu", "Marathi",
  "Kannada", "Bengali", "Gujarati", "Malayalam", "Punjabi",
];

const STYLES = ["Educational", "Story", "Opinion", "Entertainment"];

const LOADING_STAGES = [
  "Fetching competitor data…",
  "Analyzing what's working…",
  "Generating your pack…",
];

interface Props {
  credits: number;
  channelId: string;
}

export default function NewPackForm({ credits, channelId }: Props) {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("");
  const [language, setLanguage] = useState("");
  const [links, setLinks] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
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
    setLoadingStage(0);

    const t1 = setTimeout(() => setLoadingStage(1), 3000);
    const t2 = setTimeout(() => setLoadingStage(2), 7000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style, language, links, channel_id: channelId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(`/dashboard/pack/${data.pack_id}`);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
    }
  };

  const inputBase =
    "w-full bg-white border-[1.5px] border-[#E8E8E8] rounded-[10px] px-4 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-all";

  const langFontClass: Record<string, string> = {
    Hindi: "lang-hindi",
    Marathi: "lang-marathi",
    Punjabi: "lang-punjabi",
    Bengali: "lang-bengali",
    Gujarati: "lang-gujarati",
    Tamil: "lang-tamil",
    Telugu: "lang-telugu",
    Kannada: "lang-kannada",
    Malayalam: "lang-malayalam",
  };
  const topicFontClass = langFontClass[language] ?? "";

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-5">
            <span className="text-[24px] font-bold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
              vid<span className="text-[#E8192C]">up</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-[#E8E8E8] border-t-[#E8192C] rounded-full animate-spin" />
              <span className="text-[15px] font-medium text-[#3D3D3D]">
                {LOADING_STAGES[loadingStage]}
              </span>
            </div>
            <p className="text-[13px] text-[#888888]">This takes about 15-30 seconds</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Topic */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Video Topic <span className="text-[#E8192C]">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what your video is about in 1-2 lines. E.g. How I saved ₹1 lakh in 6 months on a ₹30k salary"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`${inputBase} resize-y min-h-[96px] py-3 leading-relaxed ${topicFontClass}`}
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
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} strokeWidth={2} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" />
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
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown size={15} strokeWidth={2} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" />
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
          <div className="flex items-start gap-2.5 text-[#E8192C] text-[14px] bg-[#FFF0F0] border border-[#E8192C]/20 rounded-[10px] px-4 py-3">
            <AlertCircle size={16} strokeWidth={2} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="border-t border-[#F0F0F0]" />

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8192C] text-white text-[15px] font-semibold py-[14px] rounded-lg hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            Generate Pack · 1 credit
          </button>
          <p className="text-center text-[13px] text-[#888888]">
            You have {credits} credit{credits !== 1 ? "s" : ""} remaining
          </p>
        </div>

      </form>
    </>
  );
}
