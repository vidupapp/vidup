"use client";

import { Download } from "lucide-react";

export default function DownloadButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 text-[14px] font-medium text-[#888888] hover:text-[#111111] px-3 py-2 rounded-lg hover:bg-[#F5F5F5] transition-all"
    >
      <Download size={16} strokeWidth={2} />
      Download PDF
    </button>
  );
}
