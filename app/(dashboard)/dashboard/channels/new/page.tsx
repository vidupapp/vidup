import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddChannelForm from "./AddChannelForm";

export const metadata = { title: "Add Channel — VidUp" };

export default async function AddChannelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: channels } = await supabase
    .from("channels")
    .select("channel_id")
    .eq("user_id", user.id) as { data: { channel_id: string }[] | null; error: unknown };

  const channelCount = channels?.length ?? 0;

  return (
    <div className="p-6 sm:p-8">
      <Link
        href="/dashboard/channels"
        className="inline-flex items-center gap-2 text-[14px] text-[#888888] hover:text-[#111111] transition-colors mb-8"
      >
        ← Back
      </Link>

      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
          Add Channel
        </h1>
        <p className="text-[14px] text-[#888888] mt-0.5">
          VidUp will fetch your channel data from YouTube automatically.
        </p>
      </div>

      <div
        className="bg-white rounded-2xl p-8 border border-[#F0F0F0] max-w-[600px]"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
      >
        <AddChannelForm channelCount={channelCount} />
      </div>
    </div>
  );
}
