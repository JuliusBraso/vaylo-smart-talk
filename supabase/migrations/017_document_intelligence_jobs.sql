-- Durable async job queue for document intelligence (Phase 3.7).
-- Separate from user-facing `user_documents.classification_status`.

create table if not exists public.document_intelligence_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.user_documents (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'queued',
  attempt_count integer not null default 0,
  lease_token uuid null,
  lease_expires_at timestamptz null,
  last_error text null,
  last_error_at timestamptz null,
  scheduled_at timestamptz not null default now(),
  started_at timestamptz null,
  finished_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_intelligence_jobs_status_check check (
    status in ('queued', 'running', 'completed', 'failed')
  ),
  constraint document_intelligence_jobs_attempt_count_check check (attempt_count >= 0),
  constraint document_intelligence_jobs_lease_check check (
    (status <> 'running' and lease_token is null and lease_expires_at is null)
    or
    (status = 'running' and lease_token is not null and lease_expires_at is not null)
  ),
  constraint document_intelligence_jobs_one_per_document unique (document_id)
);

create index if not exists document_intelligence_jobs_status_scheduled_idx
  on public.document_intelligence_jobs (status, scheduled_at asc);

create index if not exists document_intelligence_jobs_lease_expiry_idx
  on public.document_intelligence_jobs (status, lease_expires_at asc)
  where status = 'running';

create index if not exists document_intelligence_jobs_user_created_idx
  on public.document_intelligence_jobs (user_id, created_at desc);

-- Updated-at timestamp maintenance.
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

-- No client writes; allow authenticated users to read their own job status (optional observability).
drop policy if exists "document_intelligence_jobs_select_own" on public.document_intelligence_jobs;
create policy "document_intelligence_jobs_select_own"
  on public.document_intelligence_jobs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "document_intelligence_jobs_deny_mutations" on public.document_intelligence_jobs;
create policy "document_intelligence_jobs_deny_mutations"
  on public.document_intelligence_jobs for insert, update, delete
  to authenticated, anon
  using (false)
  with check (false);

-- Enqueue job for a document (idempotent per-document row).
create or replace function public.enqueue_document_intelligence_job(
  p_document_id uuid,
  p_user_id uuid
) returns public.document_intelligence_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  j public.document_intelligence_jobs;
begin
  insert into public.document_intelligence_jobs (document_id, user_id, status, scheduled_at)
  values (p_document_id, p_user_id, 'queued', now())
  on conflict (document_id) do update
    set
      user_id = excluded.user_id,
      -- Do not disrupt an active lease; otherwise re-queue.
      status = case
        when public.document_intelligence_jobs.status = 'running'
          and public.document_intelligence_jobs.lease_expires_at is not null
          and public.document_intelligence_jobs.lease_expires_at > now()
          then public.document_intelligence_jobs.status
        else 'queued'
      end,
      scheduled_at = case
        when public.document_intelligence_jobs.status = 'running'
          and public.document_intelligence_jobs.lease_expires_at is not null
          and public.document_intelligence_jobs.lease_expires_at > now()
          then public.document_intelligence_jobs.scheduled_at
        else now()
      end,
      finished_at = null,
      last_error = null,
      last_error_at = null,
      -- Clear lease when re-queued.
      lease_token = case
        when public.document_intelligence_jobs.status = 'running'
          and public.document_intelligence_jobs.lease_expires_at is not null
          and public.document_intelligence_jobs.lease_expires_at > now()
          then public.document_intelligence_jobs.lease_token
        else null
      end,
      lease_expires_at = case
        when public.document_intelligence_jobs.status = 'running'
          and public.document_intelligence_jobs.lease_expires_at is not null
          and public.document_intelligence_jobs.lease_expires_at > now()
          then public.document_intelligence_jobs.lease_expires_at
        else null
      end
  returning * into j;

  return j;
end;
$$;

revoke all on function public.enqueue_document_intelligence_job(uuid, uuid) from public;
grant execute on function public.enqueue_document_intelligence_job(uuid, uuid) to service_role;

-- Claim the next job with an expiring lease (single-winner under concurrency).
create or replace function public.claim_next_document_intelligence_job(
  p_lease_seconds integer default 120
) returns public.document_intelligence_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  j public.document_intelligence_jobs;
begin
  with candidate as (
    select id
    from public.document_intelligence_jobs
    where
      (
        status = 'queued'
        and scheduled_at <= now()
      )
      or (
        status = 'running'
        and lease_expires_at is not null
        and lease_expires_at <= now()
      )
      or (
        status = 'failed'
        and scheduled_at <= now()
      )
    order by scheduled_at asc
    for update skip locked
    limit 1
  )
  update public.document_intelligence_jobs as jobs
  set
    status = 'running',
    attempt_count = jobs.attempt_count + 1,
    lease_token = gen_random_uuid(),
    lease_expires_at = now() + make_interval(secs => greatest(10, p_lease_seconds)),
    started_at = coalesce(jobs.started_at, now()),
    finished_at = null
  where jobs.id in (select id from candidate)
  returning * into j;

  return j;
end;
$$;

revoke all on function public.claim_next_document_intelligence_job(integer) from public;
grant execute on function public.claim_next_document_intelligence_job(integer) to service_role;

