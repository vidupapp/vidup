"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Brief delay lets the Supabase write propagate before we re-fetch
    const t = setTimeout(() => router.refresh(), 800);
    return () => clearTimeout(t);
  }, [router]);

  return null;
}
