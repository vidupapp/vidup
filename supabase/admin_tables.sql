-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admins (
  admin_id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT DEFAULT 'manager' CHECK (role IN ('owner', 'manager', 'viewer')),
  invited_by    UUID REFERENCES admins(admin_id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  last_login    TIMESTAMPTZ,
  locked_until  TIMESTAMPTZ,
  failed_attempts INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS admin_invites (
  invite_id   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  role        TEXT DEFAULT 'manager' CHECK (role IN ('manager', 'viewer')),
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by  UUID REFERENCES admins(admin_id),
  expires_at  TIMESTAMPTZ DEFAULT now() + INTERVAL '48 hours',
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  session_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id   UUID REFERENCES admins(admin_id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '2 hours',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clean up expired sessions automatically (optional index for performance)
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_invites_token ON admin_invites(token);
