import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { pack_id, video_url } = await req.json() as { pack_id: string; video_url: string };

    if (!pack_id) return NextResponse.json({ error: "pack_id required" }, { status: 400 });
    if (!video_url || !isValidYouTubeVideo(video_url)) {
      return NextResponse.json(
        { error: "Please enter a valid YouTube video URL." },
        { status: 400 }
      );
    }

    // Verify ownership + current status
    const { data: pack } = await supabase
      .from("packs")
      .select("pack_id, status")
      .eq("pack_id", pack_id)
      .eq("user_id", user.id)
      .single() as { data: { pack_id: string; status: string } | null; error: unknown };

    if (!pack) return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    if (pack.status !== "Generated") {
      return NextResponse.json({ error: "Pack already marked." }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("packs")
      .update({
        video_url: video_url.trim(),
        video_submitted_at: new Date().toISOString(),
        status: "Video Live",
      })
      .eq("pack_id", pack_id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update pack." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("mark-used error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
