import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractVideoId } from "@/lib/youtube";

// Vercel cron hits GET with Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "YOUTUBE_API_KEY not set" }, { status: 500 });

  // Find packs ready for result collection
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: packs } = await admin
    .from("packs")
    .select("pack_id, user_id, video_url")
    .eq("status", "Video Live")
    .lte("video_submitted_at", sevenDaysAgo)
    .is("results_fetched_at", null) as {
      data: { pack_id: string; user_id: string; video_url: string }[] | null;
      error: unknown;
    };

  if (!packs?.length) {
    return NextResponse.json({ processed: 0, message: "No packs due for results." });
  }

  let processed = 0;
  let failed = 0;

  for (const pack of packs) {
    try {
      const videoId = extractVideoId(pack.video_url);
      if (!videoId) { failed++; continue; }

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${apiKey}`,
        { next: { revalidate: 0 } }
      );
      if (!res.ok) { failed++; continue; }

      const json = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stats = json.items?.[0]?.statistics as any;
      if (!stats) { failed++; continue; }

      const views = parseInt(stats.viewCount ?? "0", 10);
      const likes = parseInt(stats.likeCount ?? "0", 10);
      const comments = parseInt(stats.commentCount ?? "0", 10);
      const now = new Date().toISOString();

      // Save to results table
      await admin.from("results").insert({
        pack_id: pack.pack_id,
        user_id: pack.user_id,
        youtube_link: pack.video_url,
        views_30d: views,
        like_count: likes,
        comment_count: comments,
        submitted_at: now,
      });

      // Update pack
      await admin
        .from("packs")
        .update({ status: "Results In", results_fetched_at: now })
        .eq("pack_id", pack.pack_id);

      processed++;
    } catch (err) {
      console.error(`fetch-results failed for pack ${pack.pack_id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ processed, failed });
}
