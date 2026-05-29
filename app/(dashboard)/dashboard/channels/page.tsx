import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { selectChannelAction } from "@/app/actions/channel";
import type { Database } from "@/lib/supabase/types";

export const metadata = { title: "Your Channels — VidUp" };

type Channel = Database["public"]["Tables"]["channels"]["Row"];

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

export default async function ChannelsPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: channels } = await admin
    .from("channels")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true }) as {
      data: Channel[] | null;
      error: unknown;
    };

  const list = channels ?? [];

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
          className={`text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 ${
            list.length >= 2
              ? "bg-[#F5F5F5] text-[#AAAAAA] cursor-not-allowed pointer-events-none"
              : "bg-[#E8192C] text-white hover:bg-[#C41523]"
          }`}
        >
          <span className="text-[16px] leading-none font-bold">+</span>
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
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] flex items-center justify-center text-2xl">
            📺
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
            <span className="text-[16px] font-bold leading-none">+</span>
            Add Your Channel
          </Link>
        </div>
      )}

      {/* Channel cards */}
      {list.length > 0 && (
        <div className="flex flex-col gap-5 max-w-2xl">
          {list.map((channel) => (
            <div
              key={channel.channel_id}
              className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
              style={{
                borderLeft: "3px solid #E8192C",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",
              }}
            >
              <div className="p-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-[17px] font-semibold text-[#111111] mb-1">
                      {channel.channel_name}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold px-3 py-1 rounded-full">
                        {channel.content_category}
                      </span>
                      <span className="text-[13px] text-[#888888]">
                        · {channel.target_audience}
                      </span>
                    </div>
                  </div>

                  {/* Select button — server action via form */}
                  <form action={selectChannelAction.bind(null, channel.channel_id)}>
                    <button
                      type="submit"
                      className="bg-[#E8192C] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C41523] transition-all whitespace-nowrap"
                    >
                      Select →
                    </button>
                  </form>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Subscribers</p>
                    <p className="text-[16px] font-bold text-[#111111]">
                      {formatCount(channel.subscriber_count)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Avg Views</p>
                    <p className="text-[16px] font-bold text-[#111111]">
                      {formatCount(channel.avg_views)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Videos</p>
                    <p className="text-[16px] font-bold text-[#111111]">
                      {channel.total_videos.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-0.5">Uploads</p>
                    <p className="text-[16px] font-bold text-[#111111]">
                      {channel.upload_frequency}
                    </p>
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
          ))}
        </div>
      )}
    </div>
  );
}
