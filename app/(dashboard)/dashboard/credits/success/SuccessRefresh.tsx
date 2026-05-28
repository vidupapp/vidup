"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Forces the layout server components (including sidebar credits) to re-fetch
export default function SuccessRefresh() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);
  return null;
}
