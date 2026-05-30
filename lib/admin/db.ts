import { createAdminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adminDb(): any {
  return createAdminClient();
}

export interface Admin {
  admin_id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "owner" | "manager" | "viewer";
  invited_by: string | null;
  created_at: string;
  last_login: string | null;
  locked_until: string | null;
  failed_attempts: number;
}

export interface AdminSession {
  session_id: string;
  admin_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface AdminInvite {
  invite_id: string;
  email: string;
  role: "manager" | "viewer";
  token: string;
  invited_by: string | null;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}
