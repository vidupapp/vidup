import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchChannelData } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;

    const { channel_url, target_audience } =
      await req.json() as {
        channel_url: string;
        target_audience: string[];
      };

    if (!channel_url?.trim()) {
      return NextResponse.json({ error: "Channel URL is required." }, { status: 400 });
    }
    if (!target_audience?.length) {
      return NextResponse.json({ error: "Select at least one target audience." }, { status: 400 });
    }

    // Check existing channel count
    const { data: existing } = await admin
      .from("channels")
      .select("channel_id")
      .eq("user_id", user.id) as { data: { channel_id: string }[] | null; error: unknown };

    if ((existing?.length ?? 0) >= 2) {
      return NextResponse.json({ error: "You can only add up to 2 channels." }, { status: 400 });
    }

    // Check for duplicate
    const { data: duplicate } = await admin
      .from("channels")
      .select("channel_id")
      .eq("user_id", user.id)
      .eq("channel_url", channel_url.trim()) as { data: { channel_id: string }[] | null; error: unknown };

    if ((duplicate?.length ?? 0) > 0) {
      return NextResponse.json({ error: "You have already added this channel." }, { status: 400 });
    }

    // Fetch from YouTube
    let channelData;
    try {
      channelData = await fetchChannelData(channel_url.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch channel data.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Save to DB
    const { data: saved, error: saveError } = await admin
      .from("channels")
      .insert({
        user_id: user.id,
        channel_url: channel_url.trim(),
        youtube_channel_id: channelData.youtubeChannelId,
        channel_name: channelData.channelName,
        subscriber_count: channelData.subscriberCount,
        total_videos: channelData.totalVideos,
        avg_views: channelData.avgViews,
        recent_video_titles: channelData.recentVideoTitles,
        upload_frequency: channelData.uploadFrequency,
        content_category: channelData.contentCategory,
        target_audience,
        primary_language: channelData.primaryLanguage ?? null,
        avatar_url: channelData.avatarUrl ?? null,
      })
      .select("channel_id")
      .single() as { data: { channel_id: string } | null; error: unknown };

    if (saveError || !saved) {
      const errObj = saveError as { message?: string } | null;
      const errMsg = errObj?.message ?? "Unknown error";
      console.error("Channel save error:", errMsg);
      return NextResponse.json({ error: `Failed to save channel: ${errMsg}` }, { status: 500 });
    }

    return NextResponse.json({
      channel_id: saved.channel_id,
      channel_name: channelData.channelName,
    });
  } catch (err) {
    console.error("Add channel error:", err);
    const msg = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
