"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

function isValidYouTubeVideo(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return (
      (u.hostname.includes("youtube.com") && !!u.searchParams.get("v")) ||
      u.hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

function getContextMsg(
  resultsCount: number,
  channelName: string | null,
  formattedSubscribers: string,
  language: string,
  totalPacks: number,
  isFirstPack: boolean,
): string {
  if (totalPacks >= 50) {
    // Blend personal + system data
    if (resultsCount >= 10) {
      return `Built from ${resultsCount} of your real videos. This pack reflects what your audience actually clicks and watches.`;
    }
    if (resultsCount >= 5) {
      return `${resultsCount} of your videos have trained this pack alongside ${totalPacks} packs across VidUp. VidUp knows what your ${formattedSubscribers} ${language} audience responds to.`;
    }
    if (resultsCount >= 1) {
      return `Generated using ${resultsCount} of your real videos and patterns from ${totalPacks} packs on VidUp. Getting more accurate every time.`;
    }
    if (isFirstPack) {
      return `Your first pack is ready. Generated using patterns from ${totalPacks}+ packs on VidUp. Add your video link after uploading to make yours even more personalised.`;
    }
    return `Pack generated using your ${channelName ?? "channel"} data and patterns from ${totalPacks} packs across VidUp. Add your video link after uploading so VidUp can learn what works specifically for your audience.`;
  }

  // Personal-only states (total_packs < 50)
  if (resultsCount >= 10) {
    return `Built from ${resultsCount} of your real videos. This pack reflects what your audience actually clicks and watches.`;
  }
  if (resultsCount >= 5) {
    return `${resultsCount} of your videos have trained this pack. VidUp is learning what your ${formattedSubscribers} ${language} audience responds to.`;
  }
  if (resultsCount >= 1) {
    return `Generated using your channel data and ${resultsCount} of your real videos. Your packs are getting more accurate every time.`;
  }
  if (isFirstPack) {
    return `Your first pack is ready. Add your video link after uploading and VidUp will make the next one more accurate for you.`;
  }
  return `Pack generated using your ${channelName ?? "channel"} data. Add your video link after uploading so VidUp can learn what works for your audience.`;
}

interface Props {
  packId: string;
  status: "Generated" | "Video Live" | "Results In";
  videoSubmittedAt: string | null;
  channelName: string | null;
  resultsCount: number;
  formattedSubscribers: string;
  language: string;
  totalPacks: number;
  isFirstPack: boolean;
}

export default function MarkAsUsedButton({
  packId,
  status,
  channelName,
  resultsCount,
  formattedSubscribers,
  language,
  totalPacks,
  isFirstPack,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!isValidYouTubeVideo(videoUrl)) {
      setError("Please enter a valid YouTube video URL (youtube.com/watch?v=… or youtu.be/…)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/packs/mark-used", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: packId, video_url: videoUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setShowModal(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const contextMsg = getContextMsg(resultsCount, channelName, formattedSubscribers, language, totalPacks, isFirstPack);
  const submitted = status === "Video Live" || status === "Results In";

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div
            className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 flex flex-col gap-5"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
          >
            <div>
              <h2 className="text-[18px] font-semibold text-[#111111] mb-2">
                Make your next pack smarter
              </h2>
              <p className="text-[14px] text-[#888888] leading-relaxed">
                Add the link of the video where you used this pack.VidUp learns from it
                to generate more accurate results for you next time.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Paste your YouTube video link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={loading}
                autoFocus
                className="w-full bg-white border-[1.5px] border-[#E8E8E8] rounded-[10px] px-4 h-[46px] text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-all disabled:opacity-50"
              />
              {error && (
                <div className="flex items-start gap-2 text-[#E8192C] text-[13px] bg-[#FFF0F0] border border-[#E8192C]/20 rounded-[8px] px-3 py-2.5">
                  <AlertCircle size={14} strokeWidth={2} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => { setShowModal(false); setError(""); setVideoUrl(""); }}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg text-[14px] font-medium text-[#888888] hover:text-[#111111] transition-colors disabled:opacity-40"
              >
                Maybe later
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-[#E8192C] hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom section */}
      <div className="mt-2 pt-8 border-t border-[#F0F0F0]">
        {!submitted && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[13px] text-[#888888] leading-relaxed max-w-sm">
              {contextMsg}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#888888] border border-[#E8E8E8] hover:border-[#3D3D3D] hover:text-[#3D3D3D] px-5 py-2.5 rounded-lg transition-all shrink-0"
            >
              <Sparkles size={15} strokeWidth={2} />
              Help VidUp learn
            </button>
          </div>
        )}

        {submitted && (
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]">
              <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#16A34A]" />
              Thanks.your next pack will be smarter
            </span>
            <p className="text-[13px] text-[#9B9B9B] pl-6">
              VidUp will use this to understand what your audience responds to.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
