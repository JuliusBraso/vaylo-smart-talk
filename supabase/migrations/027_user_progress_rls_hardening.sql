-- Harden RLS contract for user_progress writes.
-- Idempotent: safe to run repeatedly.

do $$
begin
  if to_regclass('public.user_progress') is null then
    return;
  end if;

  alter table public.user_progress enable row level security;

  -- Recreate policies explicitly to avoid relying on implicit UPDATE WITH CHECK behavior.
  drop policy if exists "Users can read own user_progress" on public.user_progress;
  drop policy if exists "Users can insert own user_progress" on public.user_progress;
  drop policy if exists "Users can update own user_progress" on public.user_progress;
  drop policy if exists "Users can delete own user_progress" on public.user_progress;

  create policy "Users can read own user_progress"
    on public.user_progress for select
    using (auth.uid() = user_id);

  create policy "Users can insert own user_progress"
    on public.user_progress for insert
    with check (auth.uid() = user_id);

  create policy "Users can update own user_progress"
    on public.user_progress for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

  -- Intentionally no DELETE policy: progress rows are append/update memory by design.
end
$$;

