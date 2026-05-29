"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";

const AUDIENCES = [
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

interface Props {
  channelId: string;
  channelUrl: string;
  currentAudiences: string[];
}

export default function EditChannelForm({ channelId, channelUrl, currentAudiences }: Props) {
  const router = useRouter();
  const [audiences, setAudiences] = useState<string[]>(currentAudiences);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAudience(a: string) {
    setAudiences((prev) => {
      if (prev.includes(a)) return prev.filter((x) => x !== a);
      if (prev.length >= 3) return prev;
      return [...prev, a];
    });
  }

  const handleSave = async () => {
    setError("");
    if (audiences.length === 0) {
      setError("Please select at least one audience.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/channels/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: channelId, target_audience: audiences }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
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

  return (
    <div className="flex flex-col gap-6">

      {/* Locked URL */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#111111] flex items-center gap-1.5">
          <Lock size={13} strokeWidth={2.5} className="text-[#AAAAAA]" />
          YouTube Channel URL
        </label>
        <div className="w-full bg-[#F5F5F5] border-[1.5px] border-[#EEEEEE] rounded-[10px] px-4 h-[46px] flex items-center text-[15px] text-[#888888] select-none overflow-hidden">
          <span className="truncate">{channelUrl}</span>
        </div>
        <p className="text-[12px] text-[#AAAAAA] -mt-1">
          Channel URL cannot be changed. Delete and re-add to use a different channel.
        </p>
      </div>

      {/* Target Audience — multi-select pills */}
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

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#E8192C] text-white text-[15px] font-semibold px-8 py-[13px] rounded-lg hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
        <a
          href="/dashboard/channels"
          className="text-[14px] font-medium text-[#888888] hover:text-[#111111] transition-colors px-4 py-[13px]"
        >
          Cancel
        </a>
      </div>

    </div>
  );
}
