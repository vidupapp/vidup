"use client";

import { useState } from "react";
import { UserPlus, Trash2, RefreshCw, X, Users2 } from "lucide-react";

interface Member {
  admin_id: string;
  email: string;
  name: string;
  role: string;
  last_login: string | null;
  invited_by: string | null;
  created_at: string;
}

interface Invite {
  invite_id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
  invited_by: string | null;
}

interface Props {
  members: Member[];
  invites: Invite[];
  currentAdminId: string;
  inviterNames: Record<string, string>;
}

function relativeDate(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return `< 1h`;
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function isExpiringSoon(iso: string) {
  return new Date(iso).getTime() - Date.now() < 6 * 3600000;
}

const ROLE_STYLES: Record<string, string> = {
  owner: "bg-[#FFF0F0] text-[#E8192C]",
  manager: "bg-[#EFF6FF] text-[#3B82F6]",
  viewer: "bg-[#F5F5F5] text-[#888888]",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${ROLE_STYLES[role] ?? ROLE_STYLES.viewer}`}>
      {role}
    </span>
  );
}

export default function TeamClient({ members, invites, currentAdminId, inviterNames }: Props) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [toast, setToast] = useState("");
  const [localMembers, setLocalMembers] = useState(members);
  const [localInvites, setLocalInvites] = useState(invites);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleRemove(member: Member) {
    const res = await fetch("/api/admin/team/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: member.admin_id }),
    });
    if (res.ok) {
      setLocalMembers(m => m.filter(x => x.admin_id !== member.admin_id));
      showToast(`${member.name} removed from team`);
    }
    setRemoveTarget(null);
  }

  async function handleCancelInvite(inviteId: string) {
    const res = await fetch("/api/admin/team/invite", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite_id: inviteId }),
    });
    if (res.ok) setLocalInvites(i => i.filter(x => x.invite_id !== inviteId));
  }

  async function handleResendInvite(inviteId: string) {
    await fetch("/api/admin/team/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite_id: inviteId }),
    });
    showToast("Invitation resent");
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div /> {/* title in topbar */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-[#E8192C] text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl hover:bg-[#C41523] transition-all"
        >
          <UserPlus size={16} strokeWidth={2.5} />
          Invite member
        </button>
      </div>

      {/* Members table */}
      <div
        className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden mb-6"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="px-6 py-4 border-b border-[#F0F0F0]">
          <p className="text-[16px] font-semibold text-[#111111]">Team members</p>
        </div>

        {localMembers.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Users2 size={40} strokeWidth={1.5} className="text-[#CCCCCC]" />
            <p className="text-[15px] font-medium text-[#888888]">No team members yet</p>
            <p className="text-[13px] text-[#9B9B9B]">Invite someone to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F7F7F7" }}>
                <th className="text-left px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Member</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Role</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Last login</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Invited by</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {localMembers.map((m) => {
                const isSelf = m.admin_id === currentAdminId;
                const isOwner = m.role === "owner";
                const canRemove = !isSelf && !isOwner;
                return (
                  <tr key={m.admin_id} className="border-t border-[#F0F0F0] hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                          style={{ background: "#E8192C" }}
                        >
                          {m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#111111]">{m.name}</p>
                          <p className="text-[12px] text-[#9B9B9B]">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><RoleBadge role={m.role} /></td>
                    <td className="px-4 py-3.5 text-[13px] text-[#9B9B9B]">{relativeDate(m.last_login)}</td>
                    <td className="px-4 py-3.5 text-[13px] text-[#9B9B9B]">
                      {m.invited_by ? (inviterNames[m.invited_by] ?? "Unknown") : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {canRemove && (
                        <button
                          onClick={() => setRemoveTarget(m)}
                          className="text-[#CCCCCC] hover:text-[#E8192C] transition-colors"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pending invitations */}
      {localInvites.length > 0 && (
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div className="px-6 py-4 border-b border-[#F0F0F0]">
            <p className="text-[16px] font-semibold text-[#111111]">Pending invitations</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F7F7F7" }}>
                <th className="text-left px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Email</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Role</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Sent</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Expires</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {localInvites.map((inv) => (
                <tr key={inv.invite_id} className="border-t border-[#F0F0F0] hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-6 py-3.5 text-[14px] text-[#111111]">{inv.email}</td>
                  <td className="px-4 py-3.5"><RoleBadge role={inv.role} /></td>
                  <td className="px-4 py-3.5 text-[13px] text-[#9B9B9B]">{relativeDate(inv.created_at)}</td>
                  <td className="px-4 py-3.5 text-[13px]" style={{ color: isExpiringSoon(inv.expires_at) ? "#E8192C" : "#9B9B9B" }}>
                    {timeUntil(inv.expires_at)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResendInvite(inv.invite_id)}
                        className="text-[#CCCCCC] hover:text-[#111111] transition-colors"
                        title="Resend"
                      >
                        <RefreshCw size={15} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleCancelInvite(inv.invite_id)}
                        className="text-[#CCCCCC] hover:text-[#E8192C] transition-colors"
                        title="Cancel"
                      >
                        <X size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={(email, role) => {
            showToast(`Invitation sent to ${email}`);
            setShowInviteModal(false);
          }}
        />
      )}

      {/* Remove confirm */}
      {removeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl p-7 max-w-md w-full" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <h3 className="text-[17px] font-semibold text-[#111111] mb-2">Remove {removeTarget.name}?</h3>
            <p className="text-[14px] text-[#3D3D3D] mb-6 leading-relaxed">
              They will lose all admin access immediately and will be signed out.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveTarget(null)} className="flex-1 text-[14px] font-medium text-[#888888] border border-[#E8E8E8] px-4 py-2.5 rounded-xl hover:border-[#111111] hover:text-[#111111] transition-all">
                Cancel
              </button>
              <button onClick={() => handleRemove(removeTarget)} className="flex-1 bg-[#E8192C] text-white font-semibold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#C41523] transition-all">
                Remove
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

function InviteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (email: string, role: string) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send invite."); return; }
      onSuccess(email, role);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[20px] p-8 w-full max-w-[480px]" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
        <h2 className="text-[18px] font-semibold text-[#111111] mb-1">Invite team member</h2>
        <p className="text-[14px] text-[#888888] mb-6">They will receive an email to set up their account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#111111]"
              placeholder="colleague@vidup.in" required autoFocus
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-[#111111] mb-1.5">Role</label>
            <select
              value={role} onChange={e => setRole(e.target.value)}
              className="w-full rounded-[10px] border border-[#E8E8E8] px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
            >
              <option value="manager">Manager — can edit users and prompts</option>
              <option value="viewer">Viewer — read only access</option>
            </select>
          </div>

          {error && <p className="text-[13px] text-[#E8192C]">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#E8192C] text-white font-semibold text-[15px] py-3.5 rounded-full hover:bg-[#C41523] transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
          <button type="button" onClick={onClose} className="w-full text-[14px] font-medium text-[#888888] py-2.5 hover:text-[#111111] transition-colors">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
