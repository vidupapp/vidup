import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchChannelData } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { channel_url, content_category, target_audience, upload_frequency } =
      await req.json() as {
        channel_url: string;
        content_category: string;
        target_audience: string;
        upload_frequency: string;
      };

    if (!channel_url?.trim() || !content_category || !target_audience || !upload_frequency) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check existing channel count
    const { data: existing } = await db
      .from("channels")
      .select("channel_id")
      .eq("user_id", user.id) as { data: { channel_id: string }[] | null; error: unknown };

    if ((existing?.length ?? 0) >= 2) {
      return NextResponse.json(
        { error: "You can only add up to 2 channels." },
        { status: 400 }
      );
    }

    // Check for duplicate channel URL
    const { data: duplicate } = await db
      .from("channels")
      .select("channel_id")
      .eq("user_id", user.id)
      .eq("channel_url", channel_url.trim()) as { data: { channel_id: string }[] | null; error: unknown };

    if ((duplicate?.length ?? 0) > 0) {
      return NextResponse.json(
        { error: "You have already added this channel." },
        { status: 400 }
      );
    }

    // Fetch channel data from YouTube
    let channelData;
    try {
      channelData = await fetchChannelData(channel_url.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch channel data.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Save to DB
    const { data: saved, error: saveError } = await db
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
        upload_frequency,
        content_category,
        target_audience,
        primary_language: channelData.primaryLanguage,
      })
      .select("channel_id")
      .single() as { data: { channel_id: string } | null; error: unknown };

    if (saveError || !saved) {
      // Extract readable message from Supabase error object
      const errObj = saveError as { message?: string; code?: string; details?: string } | null;
      const errMsg = errObj?.message ?? "Unknown error";
      console.error("Channel save error:", errMsg, errObj);

      // Common diagnoses
      if (errMsg.includes("relation") && errMsg.includes("exist")) {
        return NextResponse.json(
          { error: "Database table not found. Please run supabase/schema_channels.sql in your Supabase SQL Editor first." },
          { status: 500 }
        );
      }
      if (errMsg.includes("Maximum 2 channels")) {
        return NextResponse.json({ error: "You can only add up to 2 channels." }, { status: 400 });
      }

      return NextResponse.json(
        { error: `Failed to save channel: ${errMsg}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      channel_id: saved.channel_id,
      channel_name: channelData.channelName,
    });
  } catch (err) {
    console.error("Add channel error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
