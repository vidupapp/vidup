import AuthForm from "@/app/components/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Sign up — VidUp",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-[#0A0A0A] mb-12 tracking-tight">
        vid<span className="text-[#E8192C]">up</span>
      </Link>

      <div className="w-full max-w-[360px]">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-[#0A0A0A] mb-1">Create your account</h1>
          <p className="text-zinc-500 text-sm">2 free credits/month · No card required</p>
        </div>

        <AuthForm mode="signup" />

        <p className="text-zinc-400 text-xs mt-6 text-center leading-relaxed">
          By signing up you agree to our{" "}
          <span className="text-zinc-500 hover:text-[#0A0A0A] cursor-pointer transition-colors">Terms of Service</span>
          {" "}and{" "}
          <span className="text-zinc-500 hover:text-[#0A0A0A] cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
