"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, PlusCircle, Edit2 } from "lucide-react";
import { selectChannelAction } from "@/app/actions/channel";

interface Channel {
  channel_id: string;
  channel_name: string;
  content_category: string | null;
  target_audience: string[] | string | null;
  subscriber_count: number;
  avg_views: number;
  total_videos: number;
  upload_frequency: string;
  avatar_url: string | null;
  last_fetched_at: string;
  created_at: string;
}

function parseAudience(raw: string[] | string | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return [raw]; }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function ChannelAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const [imgError, setImgError] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  if (avatarUrl && !imgError) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover shrink-0"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center shrink-0">
      <span className="text-[20px] font-bold text-[#E8192C]">{initial}</span>
    </div>
  );
}

function DeleteDialog({
  channelName,
  onConfirm,
  onCancel,
  loading,
}: {
  channelName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col gap-5"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
      >
        <div>
          <h2 className="text-[18px] font-semibold text-[#111111] mb-2">Delete channel?</h2>
          <p className="text-[14px] text-[#3D3D3D] leading-relaxed">
            Are you sure? This will delete{" "}
            <span className="font-semibold text-[#111111]">{channelName}</span> and all
            packs associated with this channel. This cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-[14px] font-medium text-[#3D3D3D] border border-[#E8E8E8] hover:bg-[#F5F5F5] transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-[#E8192C] hover:bg-[#C41523] transition-all disabled:opacity-40 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              "Yes, delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChannelCard({ channel }: { channel: Channel }) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch("/api/channels/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: channel.channel_id }),
      });
      router.refresh();
    } finally {
      setDeleting(false);
      setShowDialog(false);
    }
  };

  const audiences = parseAudience(channel.target_audience);

  return (
    <>
      {showDialog && (
        <DeleteDialog
          channelName={channel.channel_name}
          onConfirm={handleDelete}
          onCancel={() => setShowDialog(false)}
          loading={deleting}
        />
      )}

      <div
        className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
        style={{
          borderLeft: "3px solid #E8192C",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-6">
          {/* Top row: avatar + name/badges + actions */}
          <div className="flex items-start gap-4 mb-4">
            <ChannelAvatar name={channel.channel_name} avatarUrl={channel.avatar_url} />

            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-[#111111] mb-1.5 truncate">
                {channel.channel_name}
              </h2>
              {/* Category + upload frequency badges */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {channel.content_category && (
                  <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold px-3 py-1 rounded-full">
                    {channel.content_category}
                  </span>
                )}
                {channel.upload_frequency && channel.upload_frequency !== "Unknown" && (
                  <span className="inline-flex items-center bg-[#F5F5F5] text-[#3D3D3D] text-[12px] font-medium px-3 py-1 rounded-full border border-[#E8E8E8]">
                    {channel.upload_frequency}
                  </span>
                )}
              </div>
              {/* Audience pills */}
              {audiences.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {audiences.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center bg-[#F5F5F5] text-[#3D3D3D] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#E8E8E8]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Select + Edit + Delete */}
            <div className="flex items-center gap-2 shrink-0">
              <form action={selectChannelAction.bind(null, channel.channel_id)}>
                <button
                  type="submit"
                  className="bg-[#E8192C] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C41523] transition-all whitespace-nowrap"
                >
                  Select
                </button>
              </form>
              <Link
                href={`/dashboard/channels/edit/${channel.channel_id}`}
                className="p-2 rounded-lg text-[#9B9B9B] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all"
                title="Edit channel"
              >
                <Edit2 size={16} strokeWidth={2} />
              </Link>
              <button
                onClick={() => setShowDialog(true)}
                className="p-2 rounded-lg text-[#9B9B9B] hover:text-[#E8192C] hover:bg-[#FFF0F0] transition-all"
                title="Delete channel"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Subscribers</p>
              <p className="text-[16px] font-bold text-[#111111]">{formatCount(channel.subscriber_count)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Avg Views</p>
              <p className="text-[16px] font-bold text-[#111111]">{formatCount(channel.avg_views)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Videos</p>
              <p className="text-[16px] font-bold text-[#111111]">{channel.total_videos.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Uploads</p>
              <p className="text-[16px] font-bold text-[#111111]">{channel.upload_frequency || "N/A"}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-[#F5F5F5] flex items-center justify-between">
            <span className="text-[12px] text-[#888888]">
              Last fetched {formatDate(channel.last_fetched_at)}
            </span>
            <span className="text-[12px] text-[#888888]">
              Added {formatDate(channel.created_at)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function EmptyChannelSlot() {
  return (
    <Link
      href="/dashboard/channels/new"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white transition-all hover:border-[#CCCCCC] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      style={{
        border: "2px dashed #E8E8E8",
        minHeight: "120px",
        boxShadow: "none",
      }}
    >
      <PlusCircle size={40} strokeWidth={1.5} className="text-[#CCCCCC]" />
      <span className="text-[13px] text-[#AAAAAA]">Add second channel</span>
    </Link>
  );
}
