import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("users")
    .select("credits_balance")
    .eq("user_id", user.id)
    .single()) as { data: { credits_balance: number } | null; error: unknown };

  const credits = profile?.credits_balance ?? 2;

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF8" }}>
      <DashboardSidebar credits={credits} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
