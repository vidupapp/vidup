import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const PACK_CONFIG = {
  Starter: { amount: 79,  credits: 25 },
  Creator: { amount: 149, credits: 55 },
  Pro:     { amount: 299, credits: 120 },
} as const;

export type PackType = keyof typeof PACK_CONFIG;

const CASHFREE_BASE =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { pack_type } = (await req.json()) as { pack_type: PackType };
    if (!PACK_CONFIG[pack_type]) {
      return NextResponse.json({ error: "Invalid pack type." }, { status: 400 });
    }

    const config = PACK_CONFIG[pack_type];
    const origin = req.headers.get("origin") || "https://vidup.in";

    // Save a pending transaction record first — its UUID becomes our idempotency key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: txn, error: txnError } = await (admin as any)
      .from("transactions")
      .insert({
        user_id: user.id,
        pack_type,
        amount: config.amount * 100, // store in paise
        credits_added: config.credits,
        payment_gateway: "cashfree",
        status: "pending",
      })
      .select("transaction_id")
      .single() as { data: { transaction_id: string } | null; error: unknown };

    if (txnError || !txn) {
      console.error("Transaction insert failed:", txnError);
      return NextResponse.json({ error: "Could not initiate payment. Please try again." }, { status: 500 });
    }

    // Create order on Cashfree, embedding the transaction_id in order_note for idempotency
    const orderId = `VIDUP_${txn.transaction_id.slice(0, 8)}_${Date.now()}`;

    const cfRes = await fetch(`${CASHFREE_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: config.amount,
        order_currency: "INR",
        order_note: txn.transaction_id, // idempotency key
        customer_details: {
          customer_id: user.id,
          customer_email: user.email ?? "",
          customer_phone: "9999999999", // required by Cashfree; collect in future
        },
        order_meta: {
          return_url: `${origin}/dashboard/credits/success?order_id=${orderId}`,
        },
        order_tags: {
          pack_type,
          user_id: user.id,
          credits: String(config.credits),
        },
      }),
    });

    if (!cfRes.ok) {
      const err = await cfRes.json();
      console.error("Cashfree order creation failed:", err);
      return NextResponse.json({ error: "Payment initiation failed. Please try again." }, { status: 500 });
    }

    const cfData = await cfRes.json();

    return NextResponse.json({
      payment_session_id: cfData.payment_session_id,
      order_id: orderId,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
