import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/admin/session";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F7F7" }}>
      <AdminSidebar role={admin.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar name={admin.name} />
        <main className="flex-1 p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
