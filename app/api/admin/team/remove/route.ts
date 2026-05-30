import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin/db";
import { getSessionAdmin } from "@/lib/admin/session";

export async function POST(req: NextRequest) {
  const currentAdmin = await getSessionAdmin();
  if (!currentAdmin || currentAdmin.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { admin_id } = await req.json();
  if (!admin_id) return NextResponse.json({ error: "admin_id required." }, { status: 400 });

  // Cannot remove yourself or other owners
  if (admin_id === currentAdmin.admin_id) {
    return NextResponse.json({ error: "Cannot remove yourself." }, { status: 400 });
  }

  const db = adminDb();
  const { data: target } = await db.from("admins").select("role").eq("admin_id", admin_id).single();
  if (target?.role === "owner") {
    return NextResponse.json({ error: "Cannot remove another owner." }, { status: 400 });
  }

  // Delete sessions first (ON DELETE CASCADE handles this, but explicit is cleaner)
  await db.from("admin_sessions").delete().eq("admin_id", admin_id);
  await db.from("admins").delete().eq("admin_id", admin_id);

  return NextResponse.json({ ok: true });
}
