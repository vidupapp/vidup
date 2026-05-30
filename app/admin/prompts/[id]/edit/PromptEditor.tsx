"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  promptId: string;
  initialText: string;
  label: string;
  version: number;
}

export default function PromptEditor({ promptId, initialText, label, version }: Props) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function handleSave() {
    setSaving(true);
    setShowConfirm(false);
    try {
      const res = await fetch(`/api/admin/prompts/${promptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt_text: text }),
      });
      const data = await res.json();
      if (!res.ok) { setToast(data.error ?? "Save failed."); return; }
      setToast(`${label} updated (v${data.version})`);
      router.refresh();
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full font-mono text-[13px] text-[#111111] bg-[#F7F7F7] border border-[#E8E8E8] rounded-xl p-4 focus:outline-none focus:border-[#111111] transition-colors resize-y"
        style={{ minHeight: 500, lineHeight: 1.7 }}
        spellCheck={false}
      />

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => router.push("/admin/prompts")}
          className="text-[14px] font-medium text-[#888888] hover:text-[#111111] transition-colors px-4 py-2"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={saving || text === initialText}
          className="bg-[#E8192C] text-white font-semibold text-[14px] px-6 py-2.5 rounded-xl hover:bg-[#C41523] transition-all disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl p-7 max-w-md w-full" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <h3 className="text-[17px] font-semibold text-[#111111] mb-2">Confirm save</h3>
            <p className="text-[14px] text-[#3D3D3D] mb-6 leading-relaxed">
              This will affect all future <strong>{label}</strong> generations immediately. Continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 text-[14px] font-medium text-[#888888] border border-[#E8E8E8] px-4 py-2.5 rounded-xl hover:border-[#111111] hover:text-[#111111] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#E8192C] text-white font-semibold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#C41523] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#16A34A] text-white text-[14px] font-medium px-5 py-3 rounded-xl shadow-xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
