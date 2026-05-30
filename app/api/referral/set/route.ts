import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const redirectTo = req.nextUrl.searchParams.get("redirect") ?? "/login";

  const res = NextResponse.redirect(new URL(redirectTo, req.url));

  if (code) {
    res.cookies.set("vidup_referral", code, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return res;
}
