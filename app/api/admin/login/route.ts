import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminDb } from "@/lib/admin/db";
import { createSession, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/admin/session";

// In-memory rate limiter: email → { count, resetAt }
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30 * 60 * 1000;

function checkRateLimit(email: string): { locked: boolean; minutesLeft?: number } {
  const now = Date.now();
  const entry = attempts.get(email);
  if (!entry) return { locked: false };
  if (now > entry.resetAt) {
    attempts.delete(email);
    return { locked: false };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { locked: true, minutesLeft: Math.ceil((entry.resetAt - now) / 60000) };
  }
  return { locked: false };
}

function recordFailure(email: string) {
  const now = Date.now();
  const entry = attempts.get(email);
  if (!entry || now > entry.resetAt) {
    attempts.set(email, { count: 1, resetAt: now + LOCK_MS });
  } else {
    entry.count += 1;
  }
}

function clearAttempts(email: string) {
  attempts.delete(email);
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const normalised = email.toLowerCase().trim();

  const rateCheck = checkRateLimit(normalised);
  if (rateCheck.locked) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rateCheck.minutesLeft} minutes.` },
      { status: 429 }
    );
  }

  const db = adminDb();
  const { data: admin } = await db
    .from("admins")
    .select("admin_id, password_hash, name, role")
    .eq("email", normalised)
    .single();

  if (!admin) {
    recordFailure(normalised);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    recordFailure(normalised);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  clearAttempts(normalised);
  const token = await createSession(admin.admin_id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
  return res;
}
