"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="text-[13px] font-medium text-[#888888] hover:text-[#111111] transition-colors flex items-center gap-1.5 shrink-0"
    >
      {copied ? (
        <>
          <span className="text-[#16A34A]">✓</span>
          <span className="text-[#16A34A]">Copied</span>
        </>
      ) : (
        <>
          <span>⎘</span>
          Copy
        </>
      )}
    </button>
  );
}
