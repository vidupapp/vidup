import { notFound } from "next/navigation";
import { getSessionAdmin } from "@/lib/admin/session";
import { adminDb } from "@/lib/admin/db";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const currentAdmin = await getSessionAdmin();
  if (!currentAdmin || currentAdmin.role !== "owner") notFound();

  const db = adminDb();
  const [{ data: members }, { data: invites }] = await Promise.all([
    db.from("admins")
      .select("admin_id, email, name, role, last_login, invited_by, created_at")
      .order("created_at"),
    db.from("admin_invites")
      .select("invite_id, email, role, expires_at, created_at, invited_by")
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false }),
  ]);

  // Resolve inviter names
  const allIds = [...new Set([
    ...(members ?? []).map((m: { invited_by: string | null }) => m.invited_by).filter(Boolean),
    ...(invites ?? []).map((i: { invited_by: string | null }) => i.invited_by).filter(Boolean),
  ])];

  let inviterNames: Record<string, string> = {};
  if (allIds.length > 0) {
    const { data: inviters } = await db
      .from("admins")
      .select("admin_id, name")
      .in("admin_id", allIds);
    inviterNames = Object.fromEntries((inviters ?? []).map((a: { admin_id: string; name: string }) => [a.admin_id, a.name]));
  }

  return (
    <TeamClient
      members={members ?? []}
      invites={invites ?? []}
      currentAdminId={currentAdmin.admin_id}
      inviterNames={inviterNames}
    />
  );
}
