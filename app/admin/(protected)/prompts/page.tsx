import { adminDb } from "@/lib/admin/db";
import Link from "next/link";
import { Pencil } from "lucide-react";

const LANGUAGE_FLAGS: Record<string, string> = {
  Hindi: "🇮🇳", Marathi: "🇮🇳", Tamil: "🇮🇳", Telugu: "🇮🇳",
  Kannada: "🇮🇳", Bengali: "🇧🇩", Gujarati: "🇮🇳",
  Malayalam: "🇮🇳", Punjabi: "🇮🇳", English: "🇬🇧",
};

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function PromptsPage() {
  const db = adminDb();
  const { data: prompts } = await db
    .from("prompts")
    .select("prompt_id, language, call_type, version, updated_at")
    .order("language");

  const langRules = (prompts ?? []).filter((p: { call_type: string }) => p.call_type === "language_rules");
  const sysPrompts = (prompts ?? []).filter((p: { call_type: string }) => p.call_type !== "language_rules");

  return (
    <div className="max-w-4xl">
      {/* Language Rules */}
      <Section title="Language Rules" rows={langRules} getLabel={p => `${LANGUAGE_FLAGS[p.language] ?? ""} ${p.language}`} />

      <div className="mb-8" />

      {/* System Prompts */}
      <Section title="System Prompts" rows={sysPrompts} getLabel={p => p.call_type === "analysis" ? "Analysis Prompt" : "Generation Prompt"} />
    </div>
  );
}

function Section({
  title,
  rows,
  getLabel,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLabel: (row: any) => string;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <div className="px-6 py-4 border-b border-[#F0F0F0]">
        <p className="text-[16px] font-semibold text-[#111111]">{title}</p>
      </div>
      {rows.length === 0 ? (
        <p className="px-6 py-8 text-[14px] text-[#9B9B9B]">No records found. Run the seed script first.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F7F7F7" }}>
              <th className="text-left px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Language / Type</th>
              <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Version</th>
              <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Last updated</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row: { prompt_id: string; version: number; updated_at: string }) => (
              <tr key={row.prompt_id} className="border-t border-[#F0F0F0] hover:bg-[#FAFAF8] transition-colors">
                <td className="px-6 py-3.5 text-[14px] text-[#111111] font-medium">{getLabel(row)}</td>
                <td className="px-4 py-3.5 text-[14px] text-[#9B9B9B]">v{row.version}</td>
                <td className="px-4 py-3.5 text-[13px] text-[#9B9B9B]">{relativeDate(row.updated_at)}</td>
                <td className="px-6 py-3.5 text-right">
                  <Link
                    href={`/admin/prompts/${row.prompt_id}/edit`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3D3D3D] border border-[#E8E8E8] px-3 py-1.5 rounded-lg hover:border-[#111111] hover:text-[#111111] transition-all bg-white"
                  >
                    <Pencil size={13} strokeWidth={2} />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
