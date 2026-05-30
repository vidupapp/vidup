import { notFound } from "next/navigation";
import { adminDb } from "@/lib/admin/db";
import Link from "next/link";
import PromptEditor from "./PromptEditor";

const LANGUAGE_FLAGS: Record<string, string> = {
  Hindi: "🇮🇳", Marathi: "🇮🇳", Tamil: "🇮🇳", Telugu: "🇮🇳",
  Kannada: "🇮🇳", Bengali: "🇧🇩", Gujarati: "🇮🇳",
  Malayalam: "🇮🇳", Punjabi: "🇮🇳", English: "🇬🇧",
};

function getLabel(language: string, callType: string) {
  if (callType === "language_rules") return `${LANGUAGE_FLAGS[language] ?? ""} ${language} Rules`;
  if (callType === "analysis") return "Analysis Prompt";
  return "Generation Prompt";
}

export default async function PromptEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = adminDb();

  const { data: prompt } = await db
    .from("prompts")
    .select("*")
    .eq("prompt_id", id)
    .single();

  if (!prompt) notFound();

  const label = getLabel(prompt.language, prompt.call_type);

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-[#9B9B9B] mb-6">
        <Link href="/admin/prompts" className="hover:text-white transition-colors">Prompts</Link>
        <span>/</span>
        <span className="text-white">{label}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.3px" }}>
            {label}
          </h1>
          <p className="text-[13px] text-[#9B9B9B] mt-0.5">
            v{prompt.version} · Updated {new Date(prompt.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      <PromptEditor
        promptId={id}
        initialText={prompt.prompt_text}
        label={label}
        version={prompt.version}
      />
    </div>
  );
}
