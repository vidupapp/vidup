import AuthForm from "@/app/components/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Sign up — VidUp",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white mb-10 tracking-tight">
        vid<span className="text-[#F5C842]">up</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-500 text-sm">
            Start with 2 free credits/month · No card required
          </p>
        </div>

        <AuthForm mode="signup" />

        <p className="text-center text-zinc-600 text-xs mt-6 leading-relaxed">
          By signing up you agree to our{" "}
          <span className="text-zinc-400">Terms of Service</span> and{" "}
          <span className="text-zinc-400">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
