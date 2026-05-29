import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchChannelData } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;

    const { channel_id } = await req.json() as { channel_id: string };
    if (!channel_id) return NextResponse.json({ ok: false }, { status: 400 });

    // Fetch channel URL from DB
    const { data: channel } = await admin
      .from("channels")
      .select("channel_url")
      .eq("channel_id", channel_id)
      .single() as { data: { channel_url: string } | null; error: unknown };

    if (!channel) return NextResponse.json({ ok: false }, { status: 404 });

    // Fetch fresh data from YouTube
    let fresh;
    try {
      fresh = await fetchChannelData(channel.channel_url);
    } catch {
      return NextResponse.json({ ok: false }, { status: 200 }); // silent failure
    }

    await admin
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
      .eq("channel_id", channel_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Channel refresh error:", err);
    return NextResponse.json({ ok: false }, { status: 200 }); // silent failure
  }
}
