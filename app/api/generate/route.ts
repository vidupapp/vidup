import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { extractVideoId, fetchVideoMetadata } from "@/lib/youtube";
import {
  buildAnalysisPrompt,
  buildGenerationPrompt,
  extractJSON,
  type AnalysisResult,
  type PackResult,
} from "@/lib/prompts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-haiku-4-5-20251001";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse body
    const body = await req.json();
    const { topic, style, language, links } = body as {
      topic: string;
      style: string;
      language: string;
      links: string[];
    };

    if (!topic?.trim() || !style || !language || !Array.isArray(links) || links.length !== 3) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Credit check
    const { data: profile } = await db
      .from("users")
      .select("credits_balance")
      .eq("user_id", user.id)
      .single() as { data: { credits_balance: number } | null; error: unknown };

    if (!profile || profile.credits_balance < 1) {
      return NextResponse.json({ error: "No credits remaining." }, { status: 402 });
    }

    // Extract YouTube video IDs
    const videoIds = links.map(extractVideoId).filter((id): id is string => !!id);
    if (videoIds.length !== 3) {
      return NextResponse.json(
        { error: "Could not parse one or more YouTube links. Check the URLs." },
        { status: 400 }
      );
    }

    // ── Step 1: YouTube metadata ──────────────────────────────
    let videos;
    try {
      videos = await fetchVideoMetadata(videoIds);
    } catch (err) {
      console.error("YouTube API error:", err);
      return NextResponse.json(
        { error: "Could not fetch YouTube video data. Check the links and try again." },
        { status: 400 }
      );
    }

    if (videos.length === 0) {
      return NextResponse.json(
        { error: "No video data returned. Make sure the videos are public." },
        { status: 400 }
      );
    }

    // ── Step 2: Claude Call 1 — Competitor Analysis ───────────
    let analysis: AnalysisResult;
    try {
      const analysisMsg = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: buildAnalysisPrompt(JSON.stringify(videos, null, 2)) }],
      });

      const raw = analysisMsg.content[0].type === "text" ? analysisMsg.content[0].text : "";
      analysis = JSON.parse(extractJSON(raw));
    } catch (err) {
      console.error("Analysis step failed:", err);
      return NextResponse.json(
        { error: "Competitor analysis failed. Please try again." },
        { status: 500 }
      );
    }

    // ── Step 3: Claude Call 2 — Pack Generation ───────────────
    let pack: PackResult;
    try {
      const generationMsg = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: buildGenerationPrompt(topic, style, language, analysis),
          },
        ],
      });

      const raw = generationMsg.content[0].type === "text" ? generationMsg.content[0].text : "";
      pack = JSON.parse(extractJSON(raw));
      // Enforce exactly 3 of each regardless of what Claude returned
      pack.titles = pack.titles.slice(0, 3);
      pack.thumbnails = pack.thumbnails.slice(0, 3);
    } catch (err) {
      console.error("Generation step failed:", err);
      return NextResponse.json(
        { error: "Pack generation failed. Please try again." },
        { status: 500 }
      );
    }

    // ── Step 4: Save pack to Supabase ─────────────────────────
    const { data: savedPack, error: saveError } = await db
      .from("packs")
      .insert({
        user_id: user.id,
        topic: topic.trim(),
        style,
        language,
        links,
        titles: pack.titles,
        hook: pack.hook,
        thumbnails: pack.thumbnails,
      })
      .select("pack_id")
      .single() as { data: { pack_id: string } | null; error: unknown };

    if (saveError || !savedPack) {
      console.error("Pack save error:", saveError);
      return NextResponse.json({ error: "Failed to save pack. Please try again." }, { status: 500 });
    }

    // ── Step 5: Deduct credit ─────────────────────────────────
    await db
      .from("users")
      .update({ credits_balance: profile.credits_balance - 1 })
      .eq("user_id", user.id);

    return NextResponse.json({ pack_id: savedPack.pack_id });
  } catch (err) {
    console.error("Unexpected generation error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
