-- PHASE 6.27 — document intelligence jobs table safety repair.
-- Ensures required table/index/RLS exist in environments that missed older migrations.

create table if not exists public.document_intelligence_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null references public.user_documents (id) on delete cascade,
  status text not null default 'queued',
  result jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.document_intelligence_jobs
  add column if not exists result jsonb null;

alter table public.document_intelligence_jobs
  add column if not exists attempt_count integer not null default 0,
  add column if not exists lease_token uuid null,
  add column if not exists lease_expires_at timestamptz null,
  add column if not exists last_error text null,
  add column if not exists last_error_at timestamptz null,
  add column if not exists scheduled_at timestamptz not null default now(),
  add column if not exists started_at timestamptz null,
  add column if not exists finished_at timestamptz null;

alter table public.document_intelligence_jobs
  alter column updated_at set default now();

alter table public.document_intelligence_jobs
  drop constraint if exists document_intelligence_jobs_status_check;

alter table public.document_intelligence_jobs
  add constraint document_intelligence_jobs_status_check check (
    status in ('pending', 'processing', 'queued', 'running', 'completed', 'failed')
  );

create index if not exists document_intelligence_jobs_user_id_idx
  on public.document_intelligence_jobs (user_id);

create index if not exists document_intelligence_jobs_document_id_idx
  on public.document_intelligence_jobs (document_id);

create index if not exists document_intelligence_jobs_status_idx
  on public.document_intelligence_jobs (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists document_intelligence_jobs_set_updated_at on public.document_intelligence_jobs;
create trigger document_intelligence_jobs_set_updated_at
before update on public.document_intelligence_jobs
for each row execute procedure public.set_updated_at();

alter table public.document_intelligence_jobs enable row level security;

drop policy if exists "document_intelligence_jobs_deny_mutations" on public.document_intelligence_jobs;
drop policy if exists "document_intelligence_jobs_select_own" on public.document_intelligence_jobs;
drop policy if exists "document_intelligence_jobs_insert_own" on public.document_intelligence_jobs;
drop policy if exists "document_intelligence_jobs_update_own" on public.document_intelligence_jobs;
drop policy if exists "document_intelligence_jobs_delete_own" on public.document_intelligence_jobs;

create policy "document_intelligence_jobs_select_own"
  on public.document_intelligence_jobs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "document_intelligence_jobs_insert_own"
  on public.document_intelligence_jobs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "document_intelligence_jobs_update_own"
  on public.document_intelligence_jobs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "document_intelligence_jobs_delete_own"
  on public.document_intelligence_jobs for delete
  to authenticated
  using (auth.uid() = user_id);
