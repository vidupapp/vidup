import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import CopyButton from "./CopyButton";
import type { Database } from "@/lib/supabase/types";
import type { TitleItem, HookItem, ThumbnailItem } from "@/lib/prompts";

type PackRow = Database["public"]["Tables"]["packs"]["Row"];

export const metadata = { title: "Your Pack — VidUp" };

export default async function PackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pack } = await supabase
    .from("packs")
    .select("*")
    .eq("pack_id", id)
    .eq("user_id", user.id)
    .single() as { data: PackRow | null; error: unknown };

  if (!pack) return notFound();

  const titles = pack.titles as unknown as TitleItem[];
  const hook = pack.hook as unknown as HookItem;
  const thumbnails = pack.thumbnails as unknown as ThumbnailItem[];

  return (
    <div className="p-6 sm:p-8 max-w-[760px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="text-[14px] text-[#888888] hover:text-[#111111] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back
        </Link>
        <Link
          href="/dashboard/new"
          className="bg-[#E8192C] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C41523] transition-all flex items-center gap-2"
        >
          <Sparkles size={15} strokeWidth={2} />
          New Pack
        </Link>
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
              style={{
                borderLeft: "3px solid #E8192C",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
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
      <section className="mb-8">
        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">Hook Script</h2>
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
          style={{
            borderLeft: "3px solid #E8192C",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Full script at top */}
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

          {/* Breakdown */}
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
      <section className="mb-8">
        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">Thumbnail Ideas</h2>
        <div className="flex flex-col gap-4">
          {thumbnails.map((thumb, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
              style={{
                borderLeft: "3px solid #E8192C",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-[14px] font-semibold text-[#111111]">Option {i + 1}</p>
                  <CopyButton
                    text={`Layout: ${thumb.layout}\nEmotion: ${thumb.emotion}\nText overlay: ${thumb.text_overlay}\nColor mood: ${thumb.color_mood}\nWhy it works: ${thumb.why}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Layout</p>
                    <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{thumb.layout}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Text Overlay</p>
                    <p className="text-[14px] text-[#3D3D3D] font-semibold">{thumb.text_overlay}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Color Mood</p>
                    <p className="text-[14px] text-[#3D3D3D] leading-relaxed">{thumb.color_mood}</p>
                  </div>
                  {thumb.emotion && (
                    <div>
                      <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Emotion</p>
                      <p className="text-[14px] text-[#3D3D3D]">{thumb.emotion}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#F5F5F5]">
                  <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Why It Works</p>
                  <p className="text-[13px] text-[#888888] leading-relaxed">{thumb.why}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
