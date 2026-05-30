import { cookies } from "next/headers";
import crypto from "crypto";
import { adminDb, type Admin } from "./db";

const COOKIE = "admin_session";
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(adminId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
  const db = adminDb();

  await db.from("admin_sessions").insert({ admin_id: adminId, token, expires_at: expiresAt });

  // Update last_login
  await db.from("admins").update({ last_login: new Date().toISOString() }).eq("admin_id", adminId);

  return token;
}

export async function getSessionAdmin(): Promise<Admin | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) return null;

    const db = adminDb();
    const { data: session } = await db
      .from("admin_sessions")
      .select("admin_id, expires_at")
      .eq("token", token)
      .single();

    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) {
      await db.from("admin_sessions").delete().eq("token", token);
      return null;
    }

    const { data: admin } = await db
      .from("admins")
      .select("*")
      .eq("admin_id", session.admin_id)
      .single();

    return admin ?? null;
  } catch {
    return null;
  }
}

export async function deleteSession(token: string): Promise<void> {
  await adminDb().from("admin_sessions").delete().eq("token", token);
}

export function setSessionCookie(token: string): void {
  // Called client-side via response header — use in Server Actions with cookies()
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_TTL_SECONDS = TTL_MS / 1000;
