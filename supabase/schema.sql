-- ============================================================
-- VidUp — Supabase Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
create table if not exists public.users (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  credits_balance   integer not null default 2,
  free_credits_used integer not null default 0,
  signup_date       timestamptz not null default now(),
  monthly_reset_date timestamptz not null default (now() + interval '1 month'),
  referral_code text not null unique default substring(md5(random()::text), 1, 8),
  referred_by   text references public.users(referral_code) on delete set null,
  created_at    timestamptz not null default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.users enable row level security;

create policy "Users can read own record"
  on public.users for select
  using (auth.uid() = user_id);

create policy "Users can update own record"
  on public.users for update
  using (auth.uid() = user_id);

-- ============================================================
-- PACKS
-- ============================================================
create table if not exists public.packs (
  pack_id     uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(user_id) on delete cascade,
  topic       text not null,
  style       text not null check (style in ('Educational','Story','Opinion','Entertainment')),
  language    text not null,
  links       text[] not null,
  titles      jsonb not null default '[]',
  hook        jsonb not null default '{}',
  thumbnails  jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  credit_used integer not null default 1,
  status      text not null default 'Generated'
              check (status in ('Generated','Video Live','Results In'))
);

alter table public.packs enable row level security;

create policy "Users can read own packs"
  on public.packs for select
  using (auth.uid() = user_id);

create policy "Users can insert own packs"
  on public.packs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own packs"
  on public.packs for update
  using (auth.uid() = user_id);

-- ============================================================
-- RESULTS
-- ============================================================
create table if not exists public.results (
  result_id         uuid primary key default gen_random_uuid(),
  pack_id           uuid not null references public.packs(pack_id) on delete cascade,
  user_id           uuid not null references public.users(user_id) on delete cascade,
  youtube_link      text not null,
  views_30d         integer,
  ctr               numeric(5,2),
  avg_view_duration integer,  -- seconds
  like_count        integer,
  comment_count     integer,
  submitted_at      timestamptz not null default now()
);

alter table public.results enable row level security;

create policy "Users can read own results"
  on public.results for select
  using (auth.uid() = user_id);

create policy "Users can insert own results"
  on public.results for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- LEARNING_DATA (anonymous, aggregated)
-- ============================================================
create table if not exists public.learning_data (
  id          uuid primary key default gen_random_uuid(),
  niche       text not null,
  style       text not null,
  language    text not null,
  title_type  text not null,
  avg_ctr     numeric(5,2),
  avg_avd     integer,  -- seconds
  sample_size integer not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.learning_data enable row level security;

-- Read-only for authenticated users (used to improve generation)
create policy "Authenticated users can read learning data"
  on public.learning_data for select
  to authenticated
  using (true);

-- ============================================================
-- PROMPTS
-- ============================================================
create table if not exists public.prompts (
  prompt_id   uuid primary key default gen_random_uuid(),
  language    text not null,
  call_type   text not null check (call_type in ('analysis','generation')),
  prompt_text text not null,
  version     integer not null default 1,
  updated_at  timestamptz not null default now(),
  unique(language, call_type)
);

alter table public.prompts enable row level security;

-- Only service role can modify prompts; authenticated users can read
create policy "Authenticated users can read prompts"
  on public.prompts for select
  to authenticated
  using (true);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
create table if not exists public.transactions (
  transaction_id  uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(user_id) on delete cascade,
  pack_type       text not null check (pack_type in ('Starter','Creator','Pro')),
  amount          integer not null,   -- in paise (₹79 = 7900)
  credits_added   integer not null,
  payment_gateway text not null default 'cashfree',
  status          text not null default 'pending'
                  check (status in ('pending','success','failed')),
  created_at      timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can read own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_packs_user_id on public.packs(user_id);
create index if not exists idx_packs_created_at on public.packs(created_at desc);
create index if not exists idx_results_pack_id on public.results(pack_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
