-- Run this in Supabase: SQL Editor -> New query -> Run.
-- This table stores anonymous evaluation and learner evidence only.
-- learner_data deliberately excludes the learner's name.

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
  before_understanding numeric,
  after_understanding numeric,
  before_self_observation numeric,
  after_self_observation numeric,
  before_strategy_experimentation numeric,
  after_strategy_experimentation numeric,
  before_reflection numeric,
  after_reflection numeric,
  learner_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pilot_evidence add column if not exists before_understanding numeric;
alter table public.pilot_evidence add column if not exists after_understanding numeric;
alter table public.pilot_evidence add column if not exists before_self_observation numeric;
alter table public.pilot_evidence add column if not exists after_self_observation numeric;
alter table public.pilot_evidence add column if not exists before_strategy_experimentation numeric;
alter table public.pilot_evidence add column if not exists after_strategy_experimentation numeric;
alter table public.pilot_evidence add column if not exists before_reflection numeric;
alter table public.pilot_evidence add column if not exists after_reflection numeric;
alter table public.pilot_evidence add column if not exists learner_data jsonb not null default '{}'::jsonb;

alter table public.pilot_evidence enable row level security;

-- The browser may add anonymous snapshots. Do not add a public SELECT policy:
-- pupils should not be able to browse other rows.
create policy "anonymous evidence inserts"
on public.pilot_evidence for insert to anon
with check (true);

-- Researcher summary. Run this in the Supabase SQL Editor while signed in.
-- It returns anonymous aggregate values for charts and does not expose names.
create or replace view public.pilot_evidence_summary as
select
  count(*)::integer as participants,
  round(avg(before_understanding), 2) as before_understanding,
  round(avg(after_understanding), 2) as after_understanding,
  round(avg(before_self_observation), 2) as before_self_observation,
  round(avg(after_self_observation), 2) as after_self_observation,
  round(avg(before_strategy_experimentation), 2) as before_strategy_experimentation,
  round(avg(after_strategy_experimentation), 2) as after_strategy_experimentation,
  round(avg(before_reflection), 2) as before_reflection,
  round(avg(after_reflection), 2) as after_reflection,
  round(avg(before_checkin), 2) as before_confidence,
  round(avg(after_checkin), 2) as after_confidence,
  round(avg(experiments_count), 2) as average_experiments,
  round(avg(reflections_count), 2) as average_reflections
from public.pilot_evidence;

-- Only signed-in project users can read research rows. Keep the Supabase
-- project account restricted to the researcher.
drop policy if exists "researcher reads evidence" on public.pilot_evidence;
create policy "researcher reads evidence"
on public.pilot_evidence for select to authenticated
using (true);

grant select on public.pilot_evidence_summary to authenticated;
