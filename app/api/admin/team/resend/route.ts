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

  const { invite_id } = await req.json();
  const db = adminDb();

  const newExpiry = new Date(Date.now() + 48 * 3600000).toISOString();
  const { data: invite, error } = await db
    .from("admin_invites")
    .update({ expires_at: newExpiry })
    .eq("invite_id", invite_id)
    .select("email, role, token")
    .single();

  if (error || !invite) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const inviteUrl = `${BASE_URL}/admin/invite/${invite.token}`;

  await resend.emails.send({
    from: "VidUp Admin <connect@vidup.in>",
    to: invite.email,
    subject: "Your VidUp Admin invitation (resent)",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111111;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 18px; font-weight: 700;">vid<span style="color: #E8192C;">up</span></span>
        </div>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Your invitation to join VidUp as a <strong>${invite.role}</strong> has been resent.
        </p>
        <a href="${inviteUrl}" style="display: inline-block; background: #E8192C; color: white; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 100px; text-decoration: none; margin-bottom: 24px;">
          Accept Invitation →
        </a>
        <p style="font-size: 13px; color: #888888;">This link expires in 48 hours.</p>
        <p style="font-size: 13px; color: #888888; margin-top: 32px;">— VidUp Team<br/>vidup.in</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
