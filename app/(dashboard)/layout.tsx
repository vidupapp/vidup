import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import TopBar from "./TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  const supabase = await createClient();
  const cookieStore = await cookies();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Credits + email
  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single() as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 2;
  const email = user.email ?? "";

  // Selected channel
  const selectedChannelId = cookieStore.get("vidup_channel")?.value ?? null;
  let selectedChannel: { channel_id: string; channel_name: string } | null = null;

  if (selectedChannelId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;
    const { data: ch } = await admin
      .from("channels")
      .select("channel_id, channel_name")
      .eq("channel_id", selectedChannelId)
      .eq("user_id", user.id)
      .single() as { data: { channel_id: string; channel_name: string } | null; error: unknown };

    selectedChannel = ch;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF8" }}>
      <DashboardSidebar selectedChannel={selectedChannel} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar credits={credits} email={email} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
