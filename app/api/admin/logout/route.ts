import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin/db";
import { SESSION_COOKIE } from "@/lib/admin/session";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await adminDb().from("admin_sessions").delete().eq("token", token);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
