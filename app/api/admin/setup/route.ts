import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminDb } from "@/lib/admin/db";

export async function POST(req: NextRequest) {
  const db = adminDb();

  // Only works if no admins exist
  const { count } = await db.from("admins").select("*", { count: "exact", head: true });
  if (count && count > 0) {
    return NextResponse.json({ error: "Setup already complete." }, { status: 404 });
  }

  const { name, email, password } = await req.json();

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "All fields required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await db.from("admins").insert({
    email: email.toLowerCase().trim(),
    name: name.trim(),
    password_hash,
    role: "owner",
  });

  if (error) {
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
