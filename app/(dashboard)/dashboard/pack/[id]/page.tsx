import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import MarkAsUsedButton from "./MarkAsUsedButton";
import type { Database } from "@/lib/supabase/types";
import type { TitleItem, HookItem, ThumbnailItem } from "@/lib/prompts";

type PackRow = Database["public"]["Tables"]["packs"]["Row"];

export const metadata = { title: "Your Pack — VidUp" };

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default async function PackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pack } = await supabase
    .from("packs")
    .select("*")
    .eq("pack_id", id)
    .eq("user_id", user.id)
    .single() as { data: PackRow | null; error: unknown };

  if (!pack) return notFound();

  // Fetch channel context if pack has a channel
  let channelName: string | null = null;
  let subscriberCount = 0;
  if (pack.channel_id) {
    const { data: ch } = await admin
      .from("channels")
      .select("channel_name, subscriber_count")
      .eq("channel_id", pack.channel_id)
      .single() as { data: { channel_name: string; subscriber_count: number } | null; error: unknown };
    channelName = ch?.channel_name ?? null;
    subscriberCount = ch?.subscriber_count ?? 0;
  }

  // Count results submitted, user pack count, platform total (for social proof)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const [r1, r2, r3] = await Promise.all([
    db.from("results").select("result_id", { count: "exact", head: true }).eq("user_id", user.id),
    db.from("packs").select("pack_id", { count: "exact", head: true }).eq("user_id", user.id),
    db.from("packs").select("pack_id", { count: "exact", head: true }),
  ]) as [{ count: number | null }, { count: number | null }, { count: number | null }];
  const resultsCount = r1.count ?? 0;
  const userPackCount = r2.count ?? 0;
  const totalPacks = r3.count ?? 0;

  const titles = pack.titles as unknown as TitleItem[];
  const hook = pack.hook as unknown as HookItem;
  const thumbnails = pack.thumbnails as unknown as ThumbnailItem[];

  const packDate = new Date(pack.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const langClass: Record<string, string> = {
    Hindi: "lang-hindi",
    Marathi: "lang-marathi",
    Punjabi: "lang-punjabi",
    Bengali: "lang-bengali",
    Gujarati: "lang-gujarati",
    Tamil: "lang-tamil",
    Telugu: "lang-telugu",
    Kannada: "lang-kannada",
    Malayalam: "lang-malayalam",
  };
  const fontClass = langClass[pack.language] ?? "";

  return (
    <div className={`p-6 sm:p-8 max-w-[760px] ${fontClass}`}>

      {/* ── PRINT HEADER (hidden on screen) ─────────── */}
      <div className="hidden print:block mb-6 pb-5 border-b border-[#E8E8E8]">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[18px] font-bold text-[#111111]">
            vid<span className="text-[#111111]">up</span>
          </span>
          <span className="text-[13px] font-semibold text-[#3D3D3D]">Pre-Production Pack</span>
        </div>
        <p className="text-[12px] text-[#888888]">
          {channelName ? `${channelName} · ` : ""}{packDate} · {pack.language}
        </p>
      </div>

      {/* Header */}
      <div className="print:hidden flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="text-[14px] text-[#888888] hover:text-[#111111] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <DownloadButton />
          <Link
            href="/dashboard/new"
            className="bg-[#E8192C] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C41523] transition-all flex items-center gap-2"
          >
            <Sparkles size={15} strokeWidth={2} />
            New Pack
          </Link>
        </div>
      </div>

      {/* Topic */}
      <div className="mb-8">
        <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[11px] font-semibold uppercase tracking-[0.5px] px-3 py-1 rounded-full mb-3">
          {pack.style} · {pack.language}
        </span>
        <h1
          className="text-[22px] font-bold text-[#111111]"
          style={{ letterSpacing: "-0.5px", lineHeight: 1.3 }}
        >
          {pack.topic}
        </h1>
      </div>

      {/* ── TITLES ───────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">Titles</h2>
        <div className="flex flex-col gap-4">
          {titles.map((title, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
              style={{ borderLeft: "3px solid #E8192C", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-[16px] font-semibold text-[#111111] leading-snug flex-1">
                    {title.text}
                  </p>
                  <CopyButton text={title.text} />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-[#F5F5F5] text-[#3D3D3D] text-[12px] font-medium px-3 py-1 rounded-full">
                    {title.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#888888] text-[13px]">Click score</span>
                    <span className="text-[#E8192C] font-bold text-[13px]">{title.click_score}/10</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#888888] mt-3 leading-relaxed">{title.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOOK SCRIPT ──────────────────────────────── */}
      <section className="mb-8" style={{ breakBefore: "page" }}>
        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">Hook Script</h2>
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
          style={{ borderLeft: "3px solid #E8192C", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="p-5 border-b border-[#F5F5F5]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#E8192C] uppercase tracking-wider">
                Full Script (30–45 sec)
              </p>
              <CopyButton text={hook.full_script} />
            </div>
            <p className="text-[15px] text-[#111111] leading-relaxed whitespace-pre-wrap">
              {hook.full_script}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="p-5 border-b sm:border-b-0 sm:border-r border-[#F5F5F5]">
              <p className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider mb-2">Opening Line</p>
              <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{hook.opening_line}</p>
            </div>
            <div className="p-5 border-b sm:border-b-0 border-[#F5F5F5]">
              <p className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider mb-2">Payoff Promise</p>
              <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{hook.payoff_promise}</p>
            </div>
            <div className="p-5 sm:col-span-2 border-t border-[#F5F5F5]">
              <p className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider mb-2">Tension Builder</p>
              <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{hook.tension_builder}</p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold px-3 py-1 rounded-full">
              Trigger: {hook.psychological_trigger}
            </span>
          </div>
        </div>
      </section>

      {/* ── THUMBNAIL IDEAS ───────────────────────────── */}
      <section className="mb-8" style={{ breakBefore: "page" }}>
        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">Thumbnail Ideas</h2>
        <div className="flex flex-col gap-4">
          {thumbnails.map((thumb, i) => {
            const faceEmotion = thumb.face_emotion ?? thumb.emotion;
            const whyItWorks = thumb.why_it_works ?? thumb.why;
            const copyText = [
              `Layout: ${thumb.layout}`,
              faceEmotion ? `Emotion: ${faceEmotion}` : null,
              `Text overlay: ${thumb.text_overlay}`,
              `Color mood: ${thumb.color_mood}`,
              whyItWorks ? `Why it works: ${whyItWorks}` : null,
            ].filter(Boolean).join("\n");

            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
                style={{ borderLeft: "3px solid #E8192C", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <p className="text-[13px] font-semibold text-[#888888] uppercase tracking-wider">
                      Option {i + 1}
                    </p>
                    <CopyButton text={copyText} />
                  </div>

                  {/* Text overlay preview */}
                  <div className="bg-[#0D0D0D] rounded-xl px-5 py-4 mb-4 flex items-center justify-center min-h-[64px]">
                    <p className="text-[22px] font-extrabold text-white text-center leading-tight" style={{ letterSpacing: "-0.5px" }}>
                      {thumb.text_overlay}
                    </p>
                  </div>

                  {/* Face emotion badge */}
                  {faceEmotion && (
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {faceEmotion.toLowerCase() !== "no face needed" ? (
                        <span className="inline-flex items-center bg-[#FFF0F0] text-[#E8192C] text-[12px] font-semibold px-3 py-1 rounded-full capitalize">
                          {faceEmotion}
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-[#F5F5F5] text-[#888888] text-[12px] font-medium px-3 py-1 rounded-full">
                          No face needed
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Layout</p>
                      <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{thumb.layout}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Color Mood</p>
                      <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{thumb.color_mood}</p>
                    </div>
                  </div>

                  {whyItWorks && (
                    <div className="pt-4 border-t border-[#F5F5F5] mb-4">
                      <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Why It Works</p>
                      <p className="text-[13px] text-[#888888] leading-relaxed">{whyItWorks}</p>
                    </div>
                  )}

                  {thumb.canva_url && (
                    <>
                      <a
                        href={thumb.canva_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="print:hidden inline-flex items-center gap-2 bg-[#E8192C] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#C41523] transition-all"
                      >
                        <ExternalLink size={14} strokeWidth={2.5} />
                        Open in Canva
                      </a>
                      <p className="hidden print:block text-[12px] text-[#3D3D3D] break-all">
                        <span className="font-semibold">Canva template:</span> {thumb.canva_url}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HELP VIDUP LEARN ─────────────────────────── */}
      <div className="print:hidden">
        <MarkAsUsedButton
          packId={pack.pack_id}
          status={pack.status}
          videoSubmittedAt={pack.video_submitted_at ?? null}
          channelName={channelName}
          resultsCount={resultsCount ?? 0}
          formattedSubscribers={formatCount(subscriberCount)}
          language={pack.language}
          totalPacks={totalPacks ?? 0}
          isFirstPack={(userPackCount ?? 0) <= 1}
        />
      </div>

      {/* ── PRINT FOOTER (hidden on screen, fixed on every printed page) ── */}
      <div className="print-footer hidden print:block">
        Generated by VidUp · vidup.in
      </div>

    </div>
  );
}
