import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import TopBar from "./TopBar";
import ReferralClaim from "./ReferralClaim";
import { type CreditBalance, EMPTY_BALANCE, getTotal } from "@/lib/credits";

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
    .select("free_credits, purchased_credits, referral_credits, free_credits_reset_date")
    .eq("user_id", user.id)
    .single() as { data: Partial<CreditBalance> | null; error: unknown };

  const balance: CreditBalance = {
    free_credits: profile?.free_credits ?? EMPTY_BALANCE.free_credits,
    purchased_credits: profile?.purchased_credits ?? 0,
    referral_credits: profile?.referral_credits ?? 0,
    free_credits_reset_date: profile?.free_credits_reset_date ?? null,
  };
  const credits = getTotal(balance);
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
        <TopBar credits={credits} balance={balance} email={email} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <ReferralClaim />
    </div>
  );
}
