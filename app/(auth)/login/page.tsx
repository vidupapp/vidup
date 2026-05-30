import AuthForm from "@/app/components/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Sign in | VidUp",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#FAFAF8" }}
    >
      <Link href="/" className="flex items-center gap-1.5 text-[20px] font-bold text-[#111111] mb-12 tracking-tight">
        <span className="w-2 h-2 rounded-full bg-[#E8192C] shrink-0" />
        vid<span className="text-[#E8192C]">up</span>
      </Link>

      <div
        className="w-full max-w-[380px] bg-white rounded-2xl p-8 border border-[#F0F0F0]"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)" }}
      >
        <div className="mb-7">
          <h1 className="text-[22px] font-bold text-[#111111] mb-1" style={{ letterSpacing: "-0.5px" }}>
            Welcome back
          </h1>
          <p className="text-[14px] text-[#888888]">Sign in to your account</p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}
