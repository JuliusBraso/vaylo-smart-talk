-- Dashboard action interaction events (click / complete)

create table if not exists public.user_action_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_id text not null,
  event_type text not null check (event_type in ('click', 'complete')),
  created_at timestamptz not null default now()
);

create index if not exists user_action_events_user_id_idx
  on public.user_action_events (user_id);

create index if not exists user_action_events_action_id_idx
  on public.user_action_events (action_id);

alter table public.user_action_events enable row level security;

create policy "Users can read own user_action_events"
  on public.user_action_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own user_action_events"
  on public.user_action_events for insert
  with check (auth.uid() = user_id);

