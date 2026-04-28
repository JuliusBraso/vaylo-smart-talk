-- Ensure idempotent completion key on (user_id, action_id)
-- Safe to run multiple times.

do $$
begin
  if to_regclass('public.user_progress') is null then
    return;
  end if;

  -- If duplicates were introduced in environments without constraints,
  -- keep the newest completed row per logical key.
  delete from public.user_progress p
  using (
    select ctid
    from (
      select
        ctid,
        row_number() over (
          partition by user_id, action_id
          order by completed_at desc nulls last
        ) as rn
      from public.user_progress
    ) ranked
    where ranked.rn > 1
  ) dups
  where p.ctid = dups.ctid;

  -- Add a logical unique key only when neither PK nor UNIQUE exists for the same columns.
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'user_progress'
      and c.contype in ('p', 'u')
      and pg_get_constraintdef(c.oid) like '%(user_id, action_id)%'
  ) then
    alter table public.user_progress
      add constraint user_progress_user_id_action_id_key unique (user_id, action_id);
  end if;
end
$$;

