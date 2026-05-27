import AuthForm from "@/app/components/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Sign in — VidUp",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white mb-10 tracking-tight">
        vid<span className="text-[#F5C842]">up</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-zinc-500 text-sm">Sign in to your VidUp account</p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}
