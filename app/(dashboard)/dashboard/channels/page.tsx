import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ChannelCard, EmptyChannelSlot } from "./ChannelCard";
import type { Database } from "@/lib/supabase/types";
import { fetchChannelData } from "@/lib/youtube";

export const metadata = { title: "Your Channels — VidUp" };

type Channel = Database["public"]["Tables"]["channels"]["Row"];

/** Fire-and-forget: refresh any channel whose data is older than 7 days */
async function refreshStaleChannels(stale: Channel[], admin: ReturnType<typeof createAdminClient>) {
  for (const ch of stale) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fresh = await fetchChannelData(ch.channel_url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any)
        .from("channels")
        .update({
          subscriber_count: fresh.subscriberCount,
          total_videos: fresh.totalVideos,
          avg_views: fresh.avgViews,
          recent_video_titles: fresh.recentVideoTitles,
          upload_frequency: fresh.uploadFrequency,
          content_category: fresh.contentCategory,
          avatar_url: fresh.avatarUrl,
          last_fetched_at: new Date().toISOString(),
        })
        .eq("channel_id", ch.channel_id);
    } catch {
      // silent — never surface refresh errors to the user
    }
  }
}

export default async function ChannelsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Suppress unused-headers warning — headers() opts page into dynamic rendering
  // so the refresh fires on every real visit, not a cached response
  void headers();

  const { data: channels } = await (admin as any)
    .from("channels")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true }) as {
      data: Channel[] | null;
      error: unknown;
    };

  const list = channels ?? [];

  // Silently refresh channels whose data is older than 7 days (fire and forget)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const stale = list.filter((c) => c.last_fetched_at < sevenDaysAgo);
  if (stale.length > 0) {
    void refreshStaleChannels(stale, admin);
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
            Your Channels
          </h1>
          <p className="text-[14px] text-[#888888] mt-0.5">
            Select a channel to start generating packs for it.
          </p>
        </div>

        <Link
          href="/dashboard/channels/new"
          className={`text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
            list.length >= 2
              ? "bg-[#F5F5F5] text-[#AAAAAA] cursor-not-allowed pointer-events-none"
              : "bg-[#E8192C] text-white hover:bg-[#C41523]"
          }`}
        >
          <PlusCircle size={16} strokeWidth={2.5} />
          Add Channel
          {list.length >= 2 && <span className="text-[11px] ml-1">(max 2)</span>}
        </Link>
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div
          className="bg-white rounded-2xl p-12 border border-[#F0F0F0] flex flex-col items-center text-center gap-5 max-w-md"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] flex items-center justify-center">
            <PlusCircle size={28} className="text-[#E8192C]" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#111111] mb-1">No channels yet</h2>
            <p className="text-[14px] text-[#888888] max-w-xs leading-relaxed">
              Add your YouTube channel so VidUp can tailor every pack to your audience and style.
            </p>
          </div>
          <Link
            href="/dashboard/channels/new"
            className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[15px] font-semibold px-7 py-3 rounded-lg hover:bg-[#C41523] transition-all"
          >
            <PlusCircle size={16} strokeWidth={2.5} />
            Add Your Channel
          </Link>
        </div>
      )}

      {/* Channel cards + empty slot */}
      {list.length > 0 && (
        <div className="flex flex-col gap-5 max-w-2xl">
          {list.map((channel) => (
            <ChannelCard key={channel.channel_id} channel={channel} />
          ))}
          {list.length < 2 && <EmptyChannelSlot />}
        </div>
      )}
    </div>
  );
}
