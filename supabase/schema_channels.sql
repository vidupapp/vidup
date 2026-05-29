-- ============================================================
-- VidUp — Channels Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── CHANNELS ─────────────────────────────────────────────────
create table if not exists public.channels (
  channel_id          uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(user_id) on delete cascade,
  channel_url         text not null,
  youtube_channel_id  text not null,
  channel_name        text not null,
  subscriber_count    integer not null default 0,
  total_videos        integer not null default 0,
  avg_views           integer not null default 0,
  recent_video_titles jsonb not null default '[]',
  upload_frequency    text not null,
  content_category    text not null,
  target_audience     text not null,
  primary_language    text,
  last_fetched_at     timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

-- Enforce max 2 channels per user at DB level
create or replace function public.check_channel_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.channels where user_id = NEW.user_id) >= 2 then
    raise exception 'Maximum 2 channels per user';
  end if;
  return NEW;
end;
$$;

drop trigger if exists enforce_channel_limit on public.channels;
create trigger enforce_channel_limit
  before insert on public.channels
  for each row execute function public.check_channel_limit();

-- RLS
alter table public.channels enable row level security;

create policy "Users can read own channels"
  on public.channels for select
  using (auth.uid() = user_id);

create policy "Users can insert own channels"
  on public.channels for insert
  with check (auth.uid() = user_id);

create policy "Users can update own channels"
  on public.channels for update
  using (auth.uid() = user_id);

create policy "Users can delete own channels"
  on public.channels for delete
  using (auth.uid() = user_id);

-- Index
create index if not exists idx_channels_user_id on public.channels(user_id);

-- ── ADD avatar_url TO CHANNELS ───────────────────────────────
alter table public.channels
  add column if not exists avatar_url text;

-- ── CHANNEL SYSTEM v2 MIGRATIONS ─────────────────────────────

-- Add topic_categories (raw YouTube topicCategories URLs)
alter table public.channels
  add column if not exists topic_categories jsonb default '[]';

-- Convert target_audience from TEXT to JSONB array
-- Existing plain-string values (e.g. "General") become ["General"]
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'channels'
      and column_name = 'target_audience'
      and data_type = 'text'
  ) then
    alter table public.channels
      alter column target_audience type jsonb
      using case
        when target_audience is null then '[]'::jsonb
        when target_audience like '[%' then target_audience::jsonb
        else jsonb_build_array(target_audience)
      end;
  end if;
end $$;

-- Make content_category and upload_frequency nullable (now auto-fetched)
alter table public.channels
  alter column content_category drop not null;

alter table public.channels
  alter column upload_frequency drop not null;

-- ── ADD channel_id TO PACKS (scope packs per channel) ────────
alter table public.packs
  add column if not exists channel_id uuid references public.channels(channel_id) on delete set null;

create index if not exists idx_packs_channel_id on public.packs(channel_id);
