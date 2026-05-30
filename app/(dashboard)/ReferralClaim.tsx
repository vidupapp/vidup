"use client";

import { useEffect } from "react";
import { claimReferralAction } from "@/app/actions/referral";

export default function ReferralClaim() {
  useEffect(() => {
    void claimReferralAction();
  }, []);
  return null;
}
