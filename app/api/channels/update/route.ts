import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;

    const { channel_id, target_audience } =
      await req.json() as { channel_id: string; target_audience: string[] };

    if (!channel_id) return NextResponse.json({ error: "channel_id required" }, { status: 400 });
    if (!target_audience?.length) {
      return NextResponse.json({ error: "Select at least one target audience." }, { status: 400 });
    }

    // Verify ownership
    const { data: channel } = await admin
      .from("channels")
      .select("channel_id")
      .eq("channel_id", channel_id)
      .eq("user_id", user.id)
      .single() as { data: { channel_id: string } | null; error: unknown };

    if (!channel) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    const { error: updateError } = await admin
      .from("channels")
      .update({ target_audience })
      .eq("channel_id", channel_id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update channel" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update channel error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
