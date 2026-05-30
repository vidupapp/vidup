import { adminDb } from "@/lib/admin/db";
import { Users, Sparkles, IndianRupee, Zap } from "lucide-react";

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AdminOverviewPage() {
  const db = adminDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [
    { count: totalUsers },
    { count: totalPacks },
    { count: usersThisWeek },
    { data: revData },
    { count: packsThisMonth },
    { data: recentUsers },
    { data: recentTx },
    { count: todayPacks },
  ] = await Promise.all([
    db.from("users").select("*", { count: "exact", head: true }),
    db.from("packs").select("*", { count: "exact", head: true }),
    db.from("users").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    db.from("credit_transactions")
      .select("amount_paid")
      .eq("type", "purchase")
      .gte("created_at", monthStart),
    db.from("packs").select("*", { count: "exact", head: true }).gte("created_at", monthStart),
    db.from("users")
      .select("email, created_at, free_credits, purchased_credits, referral_credits")
      .order("created_at", { ascending: false })
      .limit(10),
    db.from("credit_transactions")
      .select("user_id, type, credits, amount_paid, description, created_at")
      .eq("type", "purchase")
      .order("created_at", { ascending: false })
      .limit(10),
    db.from("packs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date().toISOString().slice(0, 10)),
  ]);

  const revenue = (revData ?? []).reduce((s: number, r: { amount_paid: number }) => s + (r.amount_paid ?? 0), 0);
  const apiCost = Math.round((packsThisMonth ?? 0) * 0.83);

  const metrics = [
    {
      Icon: Users,
      label: "Total Users",
      value: (totalUsers ?? 0).toLocaleString("en-IN"),
      sub: `+${usersThisWeek ?? 0} this week`,
      subColor: "#16A34A",
    },
    {
      Icon: Sparkles,
      label: "Packs Generated",
      value: (totalPacks ?? 0).toLocaleString("en-IN"),
      sub: `Today: ${todayPacks ?? 0}`,
      subColor: "#9B9B9B",
    },
    {
      Icon: IndianRupee,
      label: "Revenue This Month",
      value: fmt(revenue),
      sub: `${(revData ?? []).length} transactions`,
      subColor: "#9B9B9B",
    },
    {
      Icon: Zap,
      label: "Est. API Cost",
      value: `₹${apiCost}`,
      sub: "Based on ₹0.83/pack",
      subColor: "#9B9B9B",
    },
  ];

  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map(({ Icon, label, value, sub, subColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-6 border border-[#F0F0F0]"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-[10px] bg-[#FFF0F0] flex items-center justify-center">
                <Icon size={17} strokeWidth={2.5} className="text-[#E8192C]" />
              </div>
              <span className="text-[13px] font-medium text-[#888888]">{label}</span>
            </div>
            <p className="text-[32px] font-extrabold text-[#111111] leading-none mb-1.5" style={{ letterSpacing: "-1px" }}>
              {value}
            </p>
            <p className="text-[13px]" style={{ color: subColor }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Two-column tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent signups */}
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div className="px-6 py-4 border-b border-[#F0F0F0]">
            <p className="text-[16px] font-semibold text-[#111111]">Recent signups</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F7F7F7" }}>
                <th className="text-left px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Email</th>
                <th className="text-right px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Credits</th>
                <th className="text-right px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">When</th>
              </tr>
            </thead>
            <tbody>
              {(recentUsers ?? []).map((u: {
                email: string;
                created_at: string;
                free_credits: number;
                purchased_credits: number;
                referral_credits: number;
              }) => (
                <tr key={u.email} className="border-t border-[#F0F0F0] hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-6 py-3 text-[14px] text-[#3D3D3D] max-w-[160px] truncate">{u.email}</td>
                  <td className="px-4 py-3 text-right text-[14px] text-[#3D3D3D]">
                    {(u.free_credits ?? 0) + (u.purchased_credits ?? 0) + (u.referral_credits ?? 0)}
                  </td>
                  <td className="px-6 py-3 text-right text-[13px] text-[#9B9B9B]">{relativeDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent transactions */}
        <div
          className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div className="px-6 py-4 border-b border-[#F0F0F0]">
            <p className="text-[16px] font-semibold text-[#111111]">Recent transactions</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F7F7F7" }}>
                <th className="text-left px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Description</th>
                <th className="text-right px-4 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">Amount</th>
                <th className="text-right px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#9B9B9B]">When</th>
              </tr>
            </thead>
            <tbody>
              {(recentTx ?? []).map((tx: {
                description: string;
                amount_paid: number;
                credits: number;
                created_at: string;
              }, i: number) => (
                <tr key={i} className="border-t border-[#F0F0F0] hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-6 py-3 text-[14px] text-[#3D3D3D] max-w-[160px] truncate">
                    {tx.description || "Purchase"}
                  </td>
                  <td className="px-4 py-3 text-right text-[14px] font-medium text-[#111111]">
                    ₹{tx.amount_paid}
                  </td>
                  <td className="px-6 py-3 text-right text-[13px] text-[#9B9B9B]">{relativeDate(tx.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
