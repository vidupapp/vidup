export interface CreditBalance {
  free_credits: number;
  purchased_credits: number;
  referral_credits: number;
  free_credits_reset_date: string | null;
}

export const EMPTY_BALANCE: CreditBalance = {
  free_credits: 2,
  purchased_credits: 0,
  referral_credits: 0,
  free_credits_reset_date: null,
};

export function getTotal(b: CreditBalance): number {
  return (b.free_credits ?? 0) + (b.purchased_credits ?? 0) + (b.referral_credits ?? 0);
}

/** Returns the update payload to deduct 1 credit in order: free → purchased → referral */
export function computeDeduction(
  b: CreditBalance
): { free_credits: number } | { purchased_credits: number } | { referral_credits: number } | null {
  if ((b.free_credits ?? 0) > 0) return { free_credits: b.free_credits - 1 };
  if ((b.purchased_credits ?? 0) > 0) return { purchased_credits: b.purchased_credits - 1 };
  if ((b.referral_credits ?? 0) > 0) return { referral_credits: b.referral_credits - 1 };
  return null;
}

export function formatResetDate(iso: string | null): string {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
