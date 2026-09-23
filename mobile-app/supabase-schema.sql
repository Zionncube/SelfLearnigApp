-- Run this in Supabase: SQL Editor -> New query -> Run.
-- This table deliberately stores anonymous evaluation/usage evidence only.
-- It does NOT store learner names, observations, reflections, or journal text.

create table if not exists public.pilot_evidence (
  id uuid primary key default gen_random_uuid(),
  participant_code text not null,
  language text not null,
  observations_count integer not null default 0,
  experiments_count integer not null default 0,
  reflections_count integer not null default 0,
  gratitude_count integer not null default 0,
  before_checkin numeric,
  after_checkin numeric,
  updated_at timestamptz not null default now()
);

alter table public.pilot_evidence enable row level security;

-- The browser may add anonymous snapshots. Do not add a public SELECT policy:
-- pupils should not be able to browse other rows.
create policy "anonymous evidence inserts"
on public.pilot_evidence for insert to anon
with check (true);
