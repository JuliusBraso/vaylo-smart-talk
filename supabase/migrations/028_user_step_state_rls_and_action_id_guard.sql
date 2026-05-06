-- Phase 6.49: DB integrity and migration hardening.
-- - Add authenticated INSERT/UPDATE RLS policies for user_step_state.
-- - Add active knowledge_steps(action_id) index guard.
-- - Keep duplicate action_id detection as diagnostics only (no constraint yet).

do $$
begin
  if to_regclass('public.user_step_state') is null then
    return;
  end if;

  alter table public.user_step_state enable row level security;

  -- SELECT policy already exists in 016_user_step_state.sql:
  -- "user_step_state_select_own"

  drop policy if exists "user_step_state_insert_own" on public.user_step_state;
  create policy "user_step_state_insert_own"
    on public.user_step_state
    for insert
    to authenticated
    with check (auth.uid() = user_id);

  drop policy if exists "user_step_state_update_own" on public.user_step_state;
  create policy "user_step_state_update_own"
    on public.user_step_state
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

-- Detect duplicates:
-- select action_id, count(*)
-- from knowledge_steps
-- where is_active = true
-- group by action_id
-- having count(*) > 1;

create index if not exists idx_knowledge_steps_action_id
  on public.knowledge_steps(action_id)
  where is_active = true;
