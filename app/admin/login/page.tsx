import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login | VidUp" };

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#111111" }}
    >
      <div
        className="w-full bg-white rounded-[20px] p-8"
        style={{ maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#E8192C] shrink-0" />
          <span className="text-[18px] font-bold text-[#111111] tracking-tight">
            vid<span className="text-[#E8192C]">up</span>
          </span>
          <span className="bg-[#E8192C] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ml-1">
            Admin
          </span>
        </div>

        <h1 className="text-[22px] font-bold text-[#111111] mb-1" style={{ letterSpacing: "-0.5px" }}>
          Sign in
        </h1>
        <p className="text-[14px] text-[#888888] mb-7">Access by invitation only.</p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
