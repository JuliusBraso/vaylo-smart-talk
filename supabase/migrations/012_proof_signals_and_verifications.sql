-- Phase 2: user-confirmed proof signals (audit + transactional confirm/reject).
-- Does not auto-confirm; explicit RPC only after user action.

-- ---------------------------------------------------------------------------
-- profiles: address registration flag (Anmeldung proof)
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists has_address_registration boolean;

-- ---------------------------------------------------------------------------
-- knowledge_steps: optional profile column to set on confirmed proof
-- ---------------------------------------------------------------------------
alter table public.knowledge_steps
  add column if not exists profile_flag_key text;

update public.knowledge_steps
set profile_flag_key = 'has_address_registration'
where id = 'residency_anmeldung';

update public.knowledge_steps
set profile_flag_key = 'has_steuer_id'
where id = 'residency_receive_tax_id';

update public.knowledge_steps
set profile_flag_key = 'has_health_insurance'
where id = 'health_receive_membership_confirmation';

-- ---------------------------------------------------------------------------
-- user_documents: audit JSON for classifier / proof hints
-- ---------------------------------------------------------------------------
alter table public.user_documents
  add column if not exists classification_notes jsonb;

-- ---------------------------------------------------------------------------
-- user_document_step_verifications
-- ---------------------------------------------------------------------------
create table if not exists public.user_document_step_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null references public.user_documents (id) on delete cascade,
  step_id text not null references public.knowledge_steps (id) on delete restrict,
  status text not null,
  created_at timestamptz not null default now(),
  constraint user_document_step_verifications_status_check check (
    status in ('confirmed', 'rejected')
  ),
  constraint user_document_step_verifications_user_doc_step_key unique (user_id, document_id, step_id)
);

create index if not exists user_document_step_verifications_user_doc_idx
  on public.user_document_step_verifications (user_id, document_id);

alter table public.user_document_step_verifications enable row level security;

create policy "user_document_step_verifications_select_own"
  on public.user_document_step_verifications for select
  to authenticated
  using (auth.uid() = user_id);

-- Inserts/updates happen via SECURITY DEFINER RPCs below (no direct client insert policy).

-- ---------------------------------------------------------------------------
-- RPC: reject proof suggestion (audit only; no progress/profile writes)
-- ---------------------------------------------------------------------------
create or replace function public.reject_document_step_proof(
  p_document_id uuid,
  p_step_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if not exists (
    select 1
    from public.user_documents d
    where d.id = p_document_id
      and d.user_id = v_uid
  ) then
    return jsonb_build_object('ok', false, 'error', 'document_not_found');
  end if;

  if exists (
    select 1
    from public.user_document_step_verifications v
    where v.user_id = v_uid
      and v.document_id = p_document_id
      and v.step_id = p_step_id
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_responded');
  end if;

  if not exists (
    select 1
    from public.user_documents d
    join public.document_type_step_links l
      on l.document_type_id = d.document_type_id
    where d.id = p_document_id
      and d.user_id = v_uid
      and l.step_id = p_step_id
      and l.link_type = 'proof'
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_a_proof_step_for_document');
  end if;

  insert into public.user_document_step_verifications (user_id, document_id, step_id, status)
  values (v_uid, p_document_id, p_step_id, 'rejected');

  return jsonb_build_object('ok', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: confirm proof → verification row + user_progress + profile flag
-- ---------------------------------------------------------------------------
create or replace function public.confirm_document_step_proof(
  p_document_id uuid,
  p_step_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_doc record;
  v_action_id text;
  v_profile_key text;
  v_now timestamptz := now();
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select
    d.id,
    d.user_id,
    d.document_type_id,
    d.classification_status,
    d.classification_confidence
  into v_doc
  from public.user_documents d
  where d.id = p_document_id
    and d.user_id = v_uid
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'document_not_found');
  end if;

  if v_doc.classification_status is distinct from 'completed'
     or v_doc.document_type_id is null
     or coalesce(v_doc.classification_confidence, 0) < 0.65 then
    return jsonb_build_object('ok', false, 'error', 'classification_not_eligible');
  end if;

  if not exists (
    select 1
    from public.document_type_step_links l
    join public.knowledge_steps s on s.id = l.step_id
    join public.knowledge_topics t on t.id = s.topic_id
    where l.document_type_id = v_doc.document_type_id
      and l.step_id = p_step_id
      and l.link_type = 'proof'
      and s.is_active = true
      and t.is_active = true
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_a_proof_step_for_document');
  end if;

  if exists (
    select 1
    from public.user_document_step_verifications v
    where v.user_id = v_uid
      and v.document_id = p_document_id
      and v.step_id = p_step_id
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_responded');
  end if;

  select s.action_id, s.profile_flag_key
  into v_action_id, v_profile_key
  from public.knowledge_steps s
  where s.id = p_step_id
    and s.is_active = true;

  insert into public.user_document_step_verifications (user_id, document_id, step_id, status)
  values (v_uid, p_document_id, p_step_id, 'confirmed');

  if v_action_id is not null and length(trim(v_action_id)) > 0 then
    insert into public.user_progress (user_id, action_id, status, completed_at)
    values (v_uid, v_action_id, 'completed', v_now)
    on conflict (user_id, action_id) do update
      set status = 'completed',
          completed_at = excluded.completed_at;
  end if;

  if v_profile_key = 'has_steuer_id' then
    update public.profiles set has_steuer_id = true where id = v_uid;
  elsif v_profile_key = 'has_health_insurance' then
    update public.profiles set has_health_insurance = true where id = v_uid;
  elsif v_profile_key = 'has_address_registration' then
    update public.profiles set has_address_registration = true where id = v_uid;
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.reject_document_step_proof(uuid, text) from public;
revoke all on function public.confirm_document_step_proof(uuid, text) from public;

grant execute on function public.reject_document_step_proof(uuid, text) to authenticated;
grant execute on function public.confirm_document_step_proof(uuid, text) to authenticated;
