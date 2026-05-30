import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin/db";
import { getSessionAdmin } from "@/lib/admin/session";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vidup.in";

export async function POST(req: NextRequest) {
  const admin = await getSessionAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email?.trim() || !["manager", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const normalised = email.toLowerCase().trim();
  const db = adminDb();

  // Check not already an admin
  const { data: existing } = await db.from("admins").select("admin_id").eq("email", normalised).single();
  if (existing) {
    return NextResponse.json({ error: "This email already has admin access." }, { status: 400 });
  }

  // Check no pending invite
  const { data: pendingInvite } = await db
    .from("admin_invites")
    .select("invite_id")
    .eq("email", normalised)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (pendingInvite) {
    return NextResponse.json({ error: "An invitation is already pending for this email." }, { status: 400 });
  }

  const { data: invite, error } = await db
    .from("admin_invites")
    .insert({ email: normalised, role, invited_by: admin.admin_id })
    .select("token")
    .single();

  if (error || !invite) {
    return NextResponse.json({ error: "Failed to create invitation." }, { status: 500 });
  }

  const inviteUrl = `${BASE_URL}/admin/invite/${invite.token}`;

  await resend.emails.send({
    from: "VidUp Admin <connect@vidup.in>",
    to: normalised,
    subject: "You have been invited to VidUp Admin",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111111;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 18px; font-weight: 700;">vid<span style="color: #E8192C;">up</span></span>
        </div>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 8px;">Hi,</p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          <strong>${admin.name}</strong> has invited you to join VidUp as a <strong>${role}</strong>.
        </p>
        <a href="${inviteUrl}" style="display: inline-block; background: #E8192C; color: white; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 100px; text-decoration: none; margin-bottom: 24px;">
          Accept Invitation →
        </a>
        <p style="font-size: 13px; color: #888888; line-height: 1.6;">
          This link expires in 48 hours.<br/>
          If you did not expect this invitation, you can safely ignore this email.
        </p>
        <p style="font-size: 13px; color: #888888; margin-top: 32px;">— VidUp Team<br/>vidup.in</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await getSessionAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { invite_id } = await req.json();
  await adminDb().from("admin_invites").delete().eq("invite_id", invite_id);
  return NextResponse.json({ ok: true });
}
