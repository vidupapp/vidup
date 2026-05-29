import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";
import { fetchChannelData } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
    // Auth via Supabase cookie client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
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

    const sql = getDb();

    // Check existing channel count (direct SQL — no schema cache issue)
    const [{ count }] = await sql<[{ count: number }]>`
      SELECT COUNT(*)::int AS count
      FROM public.channels
      WHERE user_id = ${user.id}
    `;

    if (count >= 2) {
      return NextResponse.json({ error: "You can only add up to 2 channels." }, { status: 400 });
    }

    // Check for duplicate channel URL
    const [{ dup_count }] = await sql<[{ dup_count: number }]>`
      SELECT COUNT(*)::int AS dup_count
      FROM public.channels
      WHERE user_id = ${user.id} AND channel_url = ${channel_url.trim()}
    `;

    if (dup_count > 0) {
      return NextResponse.json({ error: "You have already added this channel." }, { status: 400 });
    }

    // Fetch channel data from YouTube
    let channelData;
    try {
      channelData = await fetchChannelData(channel_url.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch channel data.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Insert directly — no PostgREST, no schema cache
    const [saved] = await sql<[{ channel_id: string }]>`
      INSERT INTO public.channels (
        user_id, channel_url, youtube_channel_id, channel_name,
        subscriber_count, total_videos, avg_views, recent_video_titles,
        upload_frequency, content_category, target_audience, primary_language
      ) VALUES (
        ${user.id},
        ${channel_url.trim()},
        ${channelData.youtubeChannelId},
        ${channelData.channelName},
        ${channelData.subscriberCount},
        ${channelData.totalVideos},
        ${channelData.avgViews},
        ${JSON.stringify(channelData.recentVideoTitles)},
        ${upload_frequency},
        ${content_category},
        ${target_audience},
        ${channelData.primaryLanguage ?? null}
      )
      RETURNING channel_id
    `;

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
