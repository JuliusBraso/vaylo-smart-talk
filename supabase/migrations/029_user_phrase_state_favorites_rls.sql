-- Phase 6.54A: Persist favorites on public.user_phrase_state with per-user RLS.
-- lib/vaylo/favorites.ts upserts SRS columns alongside is_favorite (same table).

create table if not exists public.user_phrase_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  phrase_id text not null,
  is_favorite boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  repetitions integer not null default 0,
  interval_days integer not null default 1,
  ease_factor double precision not null default 2.5,
  due_at timestamptz not null default now(),
  constraint user_phrase_state_user_phrase_unique unique (user_id, phrase_id)
);

do $$
begin
  if exists (
    select 1
    from pg_proc
    where proname = 'update_updated_at_column'
      and pg_function_is_visible(oid)
  ) then
    if not exists (
      select 1 from pg_trigger where tgname = 'update_user_phrase_state_updated_at'
    ) then
      create trigger update_user_phrase_state_updated_at
        before update on public.user_phrase_state
        for each row
        execute function update_updated_at_column();
    end if;
  end if;
end $$;

alter table public.user_phrase_state enable row level security;

drop policy if exists "user_phrase_state_select_own" on public.user_phrase_state;
create policy "user_phrase_state_select_own"
  on public.user_phrase_state
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_phrase_state_insert_own" on public.user_phrase_state;
create policy "user_phrase_state_insert_own"
  on public.user_phrase_state
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user_phrase_state_update_own" on public.user_phrase_state;
create policy "user_phrase_state_update_own"
  on public.user_phrase_state
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_phrase_state_delete_own" on public.user_phrase_state;
create policy "user_phrase_state_delete_own"
  on public.user_phrase_state
  for delete
  to authenticated
  using (auth.uid() = user_id);
