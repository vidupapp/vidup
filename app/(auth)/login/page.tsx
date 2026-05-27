import AuthForm from "@/app/components/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Sign in — VidUp",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Link href="/login" className="text-2xl font-bold text-[#0A0A0A] mb-12 tracking-tight">
        vid<span className="text-[#E8192C]">up</span>
      </Link>

      <div className="w-full max-w-[360px]">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-[#0A0A0A] mb-1">Welcome back</h1>
          <p className="text-zinc-500 text-sm">Sign in to your account</p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}
