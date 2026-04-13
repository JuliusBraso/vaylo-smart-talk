-- Phase 3.1: per-user per-knowledge-step state (foundation for task graph engine).
-- Canonical process unit: `knowledge_steps.id`.

-- ---------------------------------------------------------------------------
-- user_step_state
-- ---------------------------------------------------------------------------
create table if not exists public.user_step_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  step_id text not null references public.knowledge_steps (id) on delete cascade,
  status text not null,
  source text not null default 'system',
  -- Optional bridge: which legacy action_id contributed to this state (presentation only).
  action_id text,
  -- Optional evidence: which user document was confirmed as proof (audit only).
  document_id uuid references public.user_documents (id) on delete set null,
  notes jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_step_state_user_step_unique unique (user_id, step_id),
  constraint user_step_state_status_check check (
    status in ('blocked', 'eligible', 'in_progress', 'completed', 'verified')
  ),
  constraint user_step_state_source_check check (
    source in ('system', 'manual', 'proof', 'legacy_progress')
  )
);

create index if not exists user_step_state_user_idx
  on public.user_step_state (user_id, updated_at desc);

-- Keep updated_at fresh (reuse existing helper from 001_create_phrases_tables.sql).
do $$
begin
  if exists (
    select 1
    from pg_proc
    where proname = 'update_updated_at_column'
      and pg_function_is_visible(oid)
  ) then
    create trigger update_user_step_state_updated_at
      before update on public.user_step_state
      for each row
      execute function update_updated_at_column();
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- RLS: read own only; no direct client writes in this phase.
-- Server-side jobs may bypass via service role.
-- ---------------------------------------------------------------------------
alter table public.user_step_state enable row level security;

create policy "user_step_state_select_own"
  on public.user_step_state for select
  to authenticated
  using (auth.uid() = user_id);

