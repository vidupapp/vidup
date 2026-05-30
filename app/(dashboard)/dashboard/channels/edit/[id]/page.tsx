import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditChannelForm from "./EditChannelForm";

export const metadata = { title: "Edit Channel | VidUp" };

function parseAudience(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return [raw]; }
  }
  return [];
}

export default async function EditChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: channel } = await admin
    .from("channels")
    .select("channel_id, channel_url, target_audience")
    .eq("channel_id", id)
    .eq("user_id", user.id)
    .single() as {
      data: { channel_id: string; channel_url: string; target_audience: unknown } | null;
      error: unknown;
    };

  if (!channel) notFound();

  const currentAudiences = parseAudience(channel.target_audience);

  return (
    <div className="p-6 sm:p-8">
      <Link
        href="/dashboard/channels"
        className="inline-flex items-center gap-2 text-[14px] text-[#888888] hover:text-[#111111] transition-colors mb-8"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Back to channels
      </Link>

      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
          Edit Channel
        </h1>
        <p className="text-[14px] text-[#888888] mt-0.5">
          Update your target audience. All other data is fetched from YouTube automatically.
        </p>
      </div>

      <div
        className="bg-white rounded-2xl p-8 border border-[#F0F0F0] max-w-[600px]"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
      >
        <EditChannelForm
          channelId={channel.channel_id}
          channelUrl={channel.channel_url}
          currentAudiences={currentAudiences}
        />
      </div>
    </div>
  );
}
