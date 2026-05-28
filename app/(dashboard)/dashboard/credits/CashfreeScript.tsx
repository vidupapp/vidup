"use client";

import Script from "next/script";

// Loaded once at the credits page level so all BuyButton instances share the SDK
export default function CashfreeScript() {
  return (
    <Script
      src="https://sdk.cashfree.com/js/v3/cashfree.js"
      strategy="afterInteractive"
    />
  );
}
