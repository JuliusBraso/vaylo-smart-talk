-- Harden enqueue_document_intelligence_job: reject mismatched p_user_id vs document owner.
-- SECURITY DEFINER can otherwise enqueue cross-tenant jobs if parameters are wrong.

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
  doc_owner uuid;
begin
  select ud.user_id
  into doc_owner
  from public.user_documents ud
  where ud.id = p_document_id;

  if doc_owner is null or doc_owner <> p_user_id then
    raise exception 'document ownership mismatch';
  end if;

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
