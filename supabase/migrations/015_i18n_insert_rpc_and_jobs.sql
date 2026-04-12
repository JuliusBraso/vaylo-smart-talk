-- Idempotent batch insert for auto-translations (race-safe under concurrent workers).

create or replace function public.i18n_insert_translations_if_missing(
  p_locale text,
  p_items jsonb
) returns bigint
language sql
security definer
set search_path = public
as $$
  with ins as (
    insert into public.i18n_translations (locale, key, value, source)
    select
      p_locale,
      e->>'key',
      e->>'value',
      coalesce(nullif(trim(e->>'source'), ''), 'llm')
    from jsonb_array_elements(p_items) as e
    where (e->>'key') is not null
      and length(trim(e->>'key')) > 0
      and (e->>'value') is not null
      and length(trim(e->>'value')) > 0
    on conflict (locale, key) do nothing
    returning 1
  )
  select coalesce((select count(*)::bigint from ins), 0::bigint);
$$;

revoke all on function public.i18n_insert_translations_if_missing(text, jsonb) from public;
grant execute on function public.i18n_insert_translations_if_missing(text, jsonb) to service_role;

-- Optional durable queue for future workers (not wired in app yet).
create table if not exists public.i18n_jobs (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint i18n_jobs_status_check check (
    status in ('pending', 'running', 'completed', 'failed', 'cancelled')
  )
);

create index if not exists i18n_jobs_locale_created_idx
  on public.i18n_jobs (locale, created_at desc);

alter table public.i18n_jobs enable row level security;

-- No client access by default; service role bypasses RLS for future workers.
create policy "i18n_jobs_deny_all"
  on public.i18n_jobs for all
  to authenticated, anon
  using (false)
  with check (false);
