import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminDb } from "@/lib/admin/db";

export async function POST(req: NextRequest) {
  const { token, name, password } = await req.json();

  if (!token || !name?.trim() || !password) {
    return NextResponse.json({ error: "All fields required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const db = adminDb();
  const { data: invite } = await db
    .from("admin_invites")
    .select("invite_id, email, role, invited_by, expires_at, accepted_at")
    .eq("token", token)
    .single();

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired invitation." }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { error: insertError } = await db.from("admins").insert({
    email: invite.email,
    name: name.trim(),
    password_hash,
    role: invite.role,
    invited_by: invite.invited_by,
  });

  if (insertError) {
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }

  await db
    .from("admin_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("invite_id", invite.invite_id);

  return NextResponse.json({ ok: true });
}
