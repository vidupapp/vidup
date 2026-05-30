import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin/db";
import { getSessionAdmin } from "@/lib/admin/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getSessionAdmin();
  if (!admin || admin.role === "viewer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { prompt_text } = await req.json();

  if (!prompt_text?.trim()) {
    return NextResponse.json({ error: "prompt_text is required." }, { status: 400 });
  }

  const db = adminDb();

  // Get current version
  const { data: existing } = await db.from("prompts").select("version").eq("prompt_id", id).single();
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const newVersion = (existing.version ?? 1) + 1;

  const { error } = await db
    .from("prompts")
    .update({ prompt_text, version: newVersion, updated_at: new Date().toISOString() })
    .eq("prompt_id", id);

  if (error) return NextResponse.json({ error: "Update failed." }, { status: 500 });

  return NextResponse.json({ ok: true, version: newVersion });
}
