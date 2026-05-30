"use server";

import { notFound, redirect } from "next/navigation";
import { adminDb } from "@/lib/admin/db";
import SetupForm from "./SetupForm";

export default async function AdminSetupPage() {
  const db = adminDb();
  const { count } = await db.from("admins").select("*", { count: "exact", head: true });

  if (count && count > 0) notFound();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#111111" }}
    >
      <div
        className="w-full bg-white rounded-[20px] p-8"
        style={{ maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#E8192C] shrink-0" />
          <span className="text-[18px] font-bold text-[#111111] tracking-tight">
            vid<span className="text-[#E8192C]">up</span>
          </span>
        </div>
        <p className="text-[13px] text-[#888888] mb-8">Admin Setup</p>

        <h1 className="text-[22px] font-bold text-[#111111] mb-1" style={{ letterSpacing: "-0.5px" }}>
          Create admin account
        </h1>
        <p className="text-[14px] text-[#888888] mb-7">
          This page only exists until the first account is created.
        </p>

        <SetupForm />
      </div>
    </div>
  );
}
