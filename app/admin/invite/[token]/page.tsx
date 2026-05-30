import { adminDb } from "@/lib/admin/db";
import { XCircle } from "lucide-react";
import AcceptForm from "./AcceptForm";

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = adminDb();

  const { data: invite } = await db
    .from("admin_invites")
    .select("invite_id, email, role, expires_at, accepted_at")
    .eq("token", token)
    .single();

  const isValid =
    invite &&
    !invite.accepted_at &&
    new Date(invite.expires_at) > new Date();

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#111111" }}>
        <div className="bg-white rounded-[20px] p-10 text-center max-w-sm w-full" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
          <XCircle size={48} strokeWidth={1.5} className="text-[#E8192C] mx-auto mb-4" />
          <h1 className="text-[20px] font-bold text-[#111111] mb-2">Invalid or expired invitation</h1>
          <p className="text-[14px] text-[#888888] leading-relaxed">Please ask for a new invitation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#111111" }}>
      <div className="bg-white rounded-[20px] p-8 w-full" style={{ maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#E8192C] shrink-0" />
          <span className="text-[18px] font-bold text-[#111111] tracking-tight">
            vid<span className="text-[#E8192C]">up</span>
          </span>
        </div>
        <p className="text-[13px] text-[#888888] mb-6">Accept Invitation</p>

        <div className="bg-[#FAFAF8] rounded-xl px-4 py-3 mb-6">
          <p className="text-[13px] text-[#888888]">
            You were invited as <span className="font-semibold text-[#111111] capitalize">{invite.role}</span>
          </p>
          <p className="text-[13px] text-[#888888] mt-0.5">
            Setting up account for <span className="font-medium text-[#111111]">{invite.email}</span>
          </p>
        </div>

        <AcceptForm token={token} email={invite.email} role={invite.role} />
      </div>
    </div>
  );
}
