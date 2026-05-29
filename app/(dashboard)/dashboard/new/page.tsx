import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tv2, PlusCircle, ArrowLeftRight, Zap } from "lucide-react";
import NewPackForm from "./NewPackForm";

export const metadata = { title: "New Pack — VidUp" };

export default async function NewPackPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const cookieStore = await cookies();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single() as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 0;

  const selectedChannelId = cookieStore.get("vidup_channel")?.value ?? null;
  let selectedChannel: {
    channel_id: string;
    channel_name: string;
    content_category: string;
    target_audience: string;
  } | null = null;

  if (selectedChannelId) {
    const { data: ch } = await admin
      .from("channels")
      .select("channel_id, channel_name, content_category, target_audience")
      .eq("channel_id", selectedChannelId)
      .eq("user_id", user.id)
      .single() as {
        data: {
          channel_id: string;
          channel_name: string;
          content_category: string;
          target_audience: string;
        } | null;
        error: unknown;
      };
    selectedChannel = ch;
  }

  const { data: channels } = await admin
    .from("channels")
    .select("channel_id")
    .eq("user_id", user.id) as { data: { channel_id: string }[] | null; error: unknown };

  const hasChannels = (channels?.length ?? 0) > 0;

  return (
    <div className="p-6 sm:p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[14px] text-[#888888] hover:text-[#111111] transition-colors mb-8"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#111111]" style={{ letterSpacing: "-0.5px" }}>
          New Pack
        </h1>
        <p className="text-[14px] text-[#888888] mt-0.5">
          1 credit will be used when you generate.
        </p>
      </div>

      <div className="max-w-[680px]">
        {/* No channels at all */}
        {!hasChannels && (
          <div
            className="bg-white rounded-2xl p-10 border border-[#F0F0F0] flex flex-col items-center text-center gap-5"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] flex items-center justify-center">
              <Tv2 size={26} className="text-[#E8192C]" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#111111] mb-1">Add a channel first</h2>
              <p className="text-[14px] text-[#888888] max-w-xs leading-relaxed">
                Add your YouTube channel so VidUp can tailor the output to your audience and style.
              </p>
            </div>
            <Link
              href="/dashboard/channels/new"
              className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[15px] font-semibold px-7 py-3 rounded-lg hover:bg-[#C41523] transition-all"
            >
              <PlusCircle size={16} strokeWidth={2.5} />
              Add Channel
            </Link>
          </div>
        )}

        {/* Has channels but none selected */}
        {hasChannels && !selectedChannel && (
          <div
            className="bg-white rounded-2xl p-10 border border-[#F0F0F0] flex flex-col items-center text-center gap-5"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] flex items-center justify-center">
              <Tv2 size={26} className="text-[#E8192C]" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#111111] mb-1">Select a channel first</h2>
              <p className="text-[14px] text-[#888888] max-w-xs leading-relaxed">
                Choose which channel this pack is for before generating.
              </p>
            </div>
            <Link
              href="/dashboard/channels"
              className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[15px] font-semibold px-7 py-3 rounded-lg hover:bg-[#C41523] transition-all"
            >
              <Tv2 size={16} strokeWidth={2.5} />
              Select Channel
            </Link>
          </div>
        )}

        {/* No credits */}
        {selectedChannel && credits < 1 && (
          <div
            className="bg-white rounded-2xl p-12 border border-[#F0F0F0] flex flex-col items-center text-center gap-5"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center">
              <Zap size={22} className="text-[#E8192C]" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#111111] mb-1">No credits left</h2>
              <p className="text-[14px] text-[#888888] max-w-xs leading-relaxed">
                You&apos;ve used all your credits. Top up to keep generating packs.
              </p>
            </div>
            <Link
              href="/dashboard/credits"
              className="inline-flex items-center gap-2 bg-[#E8192C] text-white text-[15px] font-semibold px-6 py-3 rounded-lg hover:bg-[#C41523] transition-all"
            >
              <Zap size={16} strokeWidth={2.5} />
              Buy Credits
            </Link>
          </div>
        )}

        {/* All good — show form */}
        {selectedChannel && credits >= 1 && (
          <>
            {/* Active channel banner */}
            <div
              className="flex items-center gap-3 bg-white border border-[#F0F0F0] rounded-xl px-4 py-3 mb-5"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <Tv2 size={18} className="text-[#888888] shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#888888]">Generating for</p>
                <p className="text-[14px] font-semibold text-[#111111] truncate">
                  {selectedChannel.channel_name}
                </p>
              </div>
              {selectedChannel.content_category && (
                <span className="text-[12px] bg-[#FFF0F0] text-[#E8192C] font-semibold px-2.5 py-1 rounded-full shrink-0">
                  {selectedChannel.content_category}
                </span>
              )}
              <Link
                href="/dashboard/channels"
                className="inline-flex items-center gap-1 text-[12px] text-[#888888] hover:text-[#E8192C] transition-colors font-medium shrink-0"
              >
                <ArrowLeftRight size={13} strokeWidth={2} />
                Switch
              </Link>
            </div>

            <div
              className="bg-white rounded-2xl p-8 border border-[#F0F0F0]"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}
            >
              <NewPackForm credits={credits} channelId={selectedChannel.channel_id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
