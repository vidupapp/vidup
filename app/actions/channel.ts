"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function selectChannelAction(channelId: string) {
  const cookieStore = await cookies();
  cookieStore.set("vidup_channel", channelId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    sameSite: "lax",
  });
  redirect("/dashboard");
}
