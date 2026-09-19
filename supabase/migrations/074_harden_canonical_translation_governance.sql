-- Migration 074: canonical-translation structural fail-closed hardening.
-- No seeds, backfill, identity-sensitive grants, or runtime activation.

create schema if not exists extensions;

do $$
declare v_schema text;
begin
  select n.nspname into v_schema
  from pg_catalog.pg_extension e
  join pg_catalog.pg_namespace n on n.oid = e.extnamespace
  where e.extname = 'btree_gist';
  if v_schema is not null and v_schema <> 'extensions' then
    raise exception 'TP074_BTREE_GIST_WRONG_SCHEMA';
  end if;
end;
$$;

create extension if not exists btree_gist with schema extensions;

create table if not exists public.knowledge_governed_principals (
  id uuid primary key default gen_random_uuid(),
  identity_issuer text not null,
  external_subject text not null,
  principal_kind text not null check (principal_kind in ('human','governed_machine')),
  status text not null default 'active' check (status in ('active','disabled')),
  created_at timestamptz not null default statement_timestamp(),
  disabled_at timestamptz,
  disabled_reason_code text,
  constraint knowledge_governed_principals_identity_unique unique(identity_issuer, external_subject),
  constraint knowledge_governed_principals_id_kind_unique unique(id, principal_kind),
  constraint knowledge_governed_principals_identity_lengths check (
    octet_length(btrim(identity_issuer)) between 1 and 255
    and octet_length(btrim(external_subject)) between 1 and 255
  ),
  constraint knowledge_governed_principals_disable_coupling check (
    (status='active' and disabled_at is null and disabled_reason_code is null)
    or (status='disabled' and disabled_at is not null and disabled_reason_code is not null)
  )
);

create table if not exists public.knowledge_governed_principal_role_assignments (
  id uuid primary key default gen_random_uuid(),
  principal_id uuid not null references public.knowledge_governed_principals(id) on delete restrict,
  role_code text not null check (role_code in (
    'translation_creator_machine','translation_creator_human','translation_reviewer',
    'translation_publication_administrator','translation_emergency_authority',
    'translation_authority_provisioner'
  )),
  authorization_period tstzrange not null,
  granted_by_principal_id uuid not null references public.knowledge_governed_principals(id) on delete restrict,
  grant_operation_id uuid not null unique,
  revoked_at timestamptz,
  revoked_by_principal_id uuid references public.knowledge_governed_principals(id) on delete restrict,
  revocation_reason_code text,
  created_at timestamptz not null default statement_timestamp(),
  constraint knowledge_governed_role_period check (
    not isempty(authorization_period)
    and lower_inc(authorization_period)
    and not upper_inc(authorization_period)
  ),
  constraint knowledge_governed_role_revocation check (
    (revoked_at is null and revoked_by_principal_id is null and revocation_reason_code is null)
    or (revoked_at is not null and revoked_by_principal_id is not null and revocation_reason_code is not null)
  ),
  constraint knowledge_governed_role_no_overlap exclude using gist (
    principal_id extensions.gist_uuid_ops with =,
    role_code extensions.gist_text_ops with =,
    authorization_period with &&
  )
);

create table if not exists public.knowledge_governed_authorization_audit (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('principal_disabled','role_granted','role_revoked')),
  principal_id uuid not null references public.knowledge_governed_principals(id) on delete restrict,
  role_assignment_id uuid references public.knowledge_governed_principal_role_assignments(id) on delete restrict,
  actor_principal_id uuid not null references public.knowledge_governed_principals(id) on delete restrict,
  operation_id uuid not null unique,
  reason_code text not null,
  occurred_at timestamptz not null default statement_timestamp()
);

create table if not exists public.knowledge_canonical_translation_operations (
  operation_id uuid primary key,
  operation_kind text not null check (operation_kind in (
    'translation_candidate_machine_v1','translation_candidate_human_v1',
    'translation_review_record_v1','translation_submit_review_v1',
    'translation_content_approve_v1','translation_content_reject_v1',
    'translation_publication_review_prepare_v1','translation_publication_approve_v1',
    'translation_publication_eligible_v1','translation_publish_v1',
    'translation_suspend_routine_v1','translation_suspend_emergency_v1',
    'translation_emergency_clearance_v1','translation_reinstate_v1',
    'translation_withdraw_v1','translation_handover_v1'
  )),
  request_digest text not null check (request_digest ~ '^[0-9a-f]{64}$'),
  operation_status text not null default 'pending' check (operation_status in ('pending','committed')),
  primary_translation_id uuid constraint kcto_primary_translation_fk
    references public.knowledge_canonical_unit_translations(id) on delete restrict deferrable initially deferred,
  replacement_translation_id uuid constraint kcto_replacement_translation_fk
    references public.knowledge_canonical_unit_translations(id) on delete restrict deferrable initially deferred,
  actor_principal_id uuid not null references public.knowledge_governed_principals(id) on delete restrict,
  reason_digest text check (reason_digest is null or reason_digest ~ '^[0-9a-f]{64}$'),
  content_review_record_id uuid references public.knowledge_review_records(id) on delete restrict,
  publication_review_record_id uuid references public.knowledge_review_records(id) on delete restrict,
  expected_primary_translation_version integer check (expected_primary_translation_version is null or expected_primary_translation_version > 0),
  expected_replacement_translation_version integer check (expected_replacement_translation_version is null or expected_replacement_translation_version > 0),
  expected_primary_state_version integer check (expected_primary_state_version is null or expected_primary_state_version > 0),
  expected_replacement_state_version integer check (expected_replacement_state_version is null or expected_replacement_state_version > 0),
  resulting_primary_translation_version integer check (resulting_primary_translation_version is null or resulting_primary_translation_version > 0),
  resulting_replacement_translation_version integer check (resulting_replacement_translation_version is null or resulting_replacement_translation_version > 0),
  resulting_primary_translation_status text,
  resulting_replacement_translation_status text,
  resulting_primary_state_version integer check (resulting_primary_state_version is null or resulting_primary_state_version > 0),
  resulting_replacement_state_version integer check (resulting_replacement_state_version is null or resulting_replacement_state_version > 0),
  resulting_primary_state text,
  resulting_replacement_state text,
  resulting_publication_state_id uuid references public.knowledge_publication_states(id) on delete restrict,
  resulting_review_record_id uuid references public.knowledge_review_records(id) on delete restrict,
  resulting_primary_transition_id uuid references public.knowledge_publication_state_transitions(id) on delete restrict,
  resulting_replacement_approval_transition_id uuid references public.knowledge_publication_state_transitions(id) on delete restrict,
  resulting_replacement_eligibility_transition_id uuid references public.knowledge_publication_state_transitions(id) on delete restrict,
  resulting_replacement_publication_transition_id uuid references public.knowledge_publication_state_transitions(id) on delete restrict,
  resulting_canonical_fingerprint text check (resulting_canonical_fingerprint is null or resulting_canonical_fingerprint ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default statement_timestamp(),
  committed_at timestamptz,
  constraint knowledge_canonical_translation_operations_distinct_ids check (
    replacement_translation_id is null or replacement_translation_id <> primary_translation_id
  ),
  constraint knowledge_canonical_translation_operations_time check (
    committed_at is null or committed_at >= created_at
  )
);

alter table public.knowledge_review_records
  add column if not exists reviewer_principal_id uuid,
  add column if not exists review_purpose text,
  add column if not exists review_decision text,
  add column if not exists canonical_translation_operation_id uuid;

alter table public.knowledge_review_records
  drop constraint if exists knowledge_review_records_entity_type_check;
alter table public.knowledge_review_records
  add constraint knowledge_review_records_entity_type_check check (entity_type in (
    'source','source_version','source_passage','publisher','jurisdiction','territorial_scope',
    'authority','authority_competence','claim','claim_evidence_link','process','process_step',
    'process_claim_link','form','form_requirement','evidence_requirement','deadline_rule','fee_rule',
    'eligibility_rule','regional_override','citation','terminology_entry','localized_terminology',
    'trust_domain','cross_border_connector','cross_border_process','responsible_actor_rule',
    'canonical_translation'
  ));
alter table public.knowledge_review_records
  drop constraint if exists knowledge_review_records_reviewer_principal_fk,
  drop constraint if exists knowledge_review_records_operation_fk,
  drop constraint if exists knowledge_review_records_no_self_supersede,
  drop constraint if exists knowledge_review_records_canonical_shape;
alter table public.knowledge_review_records
  add constraint knowledge_review_records_reviewer_principal_fk
    foreign key (reviewer_principal_id, reviewer_type)
    references public.knowledge_governed_principals(id, principal_kind) on delete restrict,
  add constraint knowledge_review_records_operation_fk
    foreign key (canonical_translation_operation_id)
    references public.knowledge_canonical_translation_operations(operation_id) on delete restrict,
  add constraint knowledge_review_records_no_self_supersede
    check (supersedes_review_record_id is null or supersedes_review_record_id <> id),
  add constraint knowledge_review_records_canonical_shape check (
    (entity_type='canonical_translation'
      and reviewer_principal_id is not null
      and reviewer_type='human'
      and review_purpose in ('translation_content','translation_publication')
      and review_decision in ('approved','rejected','returned')
      and canonical_translation_operation_id is not null
      and review_level = case review_purpose
        when 'translation_content' then 'translation_content_v1'
        else 'translation_publication_v1' end
      and review_status = case review_decision
        when 'returned' then 'review_required'
        else 'human_reviewed' end)
    or
    (entity_type<>'canonical_translation'
      and reviewer_principal_id is null and review_purpose is null
      and review_decision is null and canonical_translation_operation_id is null)
  );

alter table public.knowledge_canonical_unit_translations
  add column if not exists created_by_principal_id uuid
    references public.knowledge_governed_principals(id) on delete restrict,
  add column if not exists reviewed_by_principal_id uuid
    references public.knowledge_governed_principals(id) on delete restrict;

alter table public.knowledge_publication_state_transitions
  add column if not exists actor_principal_id uuid
    references public.knowledge_governed_principals(id) on delete restrict,
  add column if not exists canonical_translation_operation_id uuid
    references public.knowledge_canonical_translation_operations(operation_id) on delete restrict;

do $$
begin
  if exists (
    select 1 from public.knowledge_canonical_unit_translations
    where review_record_id is not null group by review_record_id having count(*) > 1
  ) then raise exception 'TP074_PREFLIGHT_DUPLICATE_TRANSLATION_REVIEW_USAGE'; end if;
  if exists (
    select 1 from public.knowledge_publication_state_transitions
    where entity_type='canonical_translation' and review_record_id is not null
    group by review_record_id having count(*) > 1
  ) then raise exception 'TP074_PREFLIGHT_DUPLICATE_PUBLICATION_REVIEW_USAGE'; end if;
end;
$$;

create index if not exists ix_kcto_primary_translation
  on public.knowledge_canonical_translation_operations(primary_translation_id, created_at)
  where primary_translation_id is not null;
create index if not exists ix_kcto_replacement_translation
  on public.knowledge_canonical_translation_operations(replacement_translation_id, created_at)
  where replacement_translation_id is not null;
create index if not exists ix_kcto_actor_created
  on public.knowledge_canonical_translation_operations(actor_principal_id, created_at);
create index if not exists ix_kcto_committed_at
  on public.knowledge_canonical_translation_operations(committed_at)
  where operation_status='committed';
create unique index if not exists ux_review_records_canonical_operation_once
  on public.knowledge_review_records(canonical_translation_operation_id)
  where entity_type='canonical_translation';
create unique index if not exists ux_review_records_canonical_supersedes_once
  on public.knowledge_review_records(supersedes_review_record_id)
  where entity_type='canonical_translation' and supersedes_review_record_id is not null;
create unique index if not exists ux_translations_content_review_record_once
  on public.knowledge_canonical_unit_translations(review_record_id)
  where review_record_id is not null;
create unique index if not exists ux_transitions_publication_review_record_once
  on public.knowledge_publication_state_transitions(review_record_id)
  where entity_type='canonical_translation' and review_record_id is not null;

create or replace function public.fn_compute_canonical_translation_operation_digest(
  p_operation_kind text, p_actor_principal_id uuid, p_primary_translation_id uuid,
  p_replacement_translation_id uuid, p_entity_type text, p_entity_id uuid,
  p_field_key text, p_output_locale text, p_expected_fingerprint text,
  p_translated_text text, p_machine_generated boolean, p_machine_provider text,
  p_machine_model text, p_review_purpose text, p_review_decision text,
  p_supersedes_review_record_id uuid, p_reason_digest text, p_notes_digest text,
  p_content_review_record_id uuid, p_publication_review_record_id uuid,
  p_expected_primary_translation_version integer,
  p_expected_replacement_translation_version integer,
  p_expected_primary_state_version integer,
  p_expected_replacement_state_version integer, p_reason_code text
) returns text
language plpgsql security definer set search_path=pg_catalog,pg_temp
as $$
declare
  v bytea[]; payload bytea := ''::bytea; x bytea; i integer := 0;
  n_kind text;
begin
  if p_operation_kind is null or p_operation_kind not in (
    'translation_candidate_machine_v1','translation_candidate_human_v1',
    'translation_review_record_v1','translation_submit_review_v1',
    'translation_content_approve_v1','translation_content_reject_v1',
    'translation_publication_review_prepare_v1','translation_publication_approve_v1',
    'translation_publication_eligible_v1','translation_publish_v1',
    'translation_suspend_routine_v1','translation_suspend_emergency_v1',
    'translation_emergency_clearance_v1','translation_reinstate_v1',
    'translation_withdraw_v1','translation_handover_v1'
  ) then raise exception 'TP_OPERATION_KIND_INVALID'; end if;
  if p_actor_principal_id is null then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  if p_reason_digest is not null and p_reason_digest !~ '^[0-9a-f]{64}$'
     or p_notes_digest is not null and p_notes_digest !~ '^[0-9a-f]{64}$'
  then raise exception 'TP_OPERATION_DIGEST_INPUT_INVALID'; end if;
  if p_expected_primary_translation_version is not null and p_expected_primary_translation_version <= 0
     or p_expected_replacement_translation_version is not null and p_expected_replacement_translation_version <= 0
     or p_expected_primary_state_version is not null and p_expected_primary_state_version <= 0
     or p_expected_replacement_state_version is not null and p_expected_replacement_state_version <= 0
  then raise exception 'TP_OPERATION_DIGEST_INPUT_INVALID'; end if;
  n_kind := btrim(normalize(replace(p_operation_kind,E'\r\n',E'\n'),NFC));
  case p_operation_kind
    when 'translation_candidate_machine_v1' then
      if p_entity_type is null or p_entity_id is null or p_field_key is null
         or p_output_locale is null or p_translated_text is null
         or p_machine_generated is distinct from true
         or p_machine_provider is null or p_machine_model is null
         or p_primary_translation_id is not null or p_replacement_translation_id is not null
         or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_reason_digest is not null
         or p_notes_digest is not null or p_content_review_record_id is not null
         or p_publication_review_record_id is not null
         or p_expected_primary_translation_version is not null
         or p_expected_replacement_translation_version is not null
         or p_expected_primary_state_version is not null
         or p_expected_replacement_state_version is not null or p_reason_code is not null
         or p_output_locale not in ('en','sk','cs','pl','hu')
         or (p_expected_fingerprint is not null and p_expected_fingerprint !~ '^[0-9a-f]{64}$')
         or not (
           (p_entity_type='claim' and p_field_key='claim_text_canonical')
           or (p_entity_type='process' and p_field_key in ('title','trigger_description','safe_first_step'))
           or (p_entity_type='process_step' and p_field_key in ('title','description_canonical'))
           or (p_entity_type='evidence_requirement' and p_field_key='description_canonical')
           or (p_entity_type='authority_competence' and p_field_key='subject_matter'))
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_candidate_human_v1' then
      if p_entity_type is null or p_entity_id is null or p_field_key is null
         or p_output_locale is null or p_translated_text is null
         or p_machine_generated is distinct from false
         or p_machine_provider is not null or p_machine_model is not null
         or p_primary_translation_id is not null or p_replacement_translation_id is not null
         or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_reason_digest is not null
         or p_notes_digest is not null or p_content_review_record_id is not null
         or p_publication_review_record_id is not null
         or p_expected_primary_translation_version is not null
         or p_expected_replacement_translation_version is not null
         or p_expected_primary_state_version is not null
         or p_expected_replacement_state_version is not null or p_reason_code is not null
         or p_output_locale not in ('en','sk','cs','pl','hu')
         or (p_expected_fingerprint is not null and p_expected_fingerprint !~ '^[0-9a-f]{64}$')
         or not (
           (p_entity_type='claim' and p_field_key='claim_text_canonical')
           or (p_entity_type='process' and p_field_key in ('title','trigger_description','safe_first_step'))
           or (p_entity_type='process_step' and p_field_key in ('title','description_canonical'))
           or (p_entity_type='evidence_requirement' and p_field_key='description_canonical')
           or (p_entity_type='authority_competence' and p_field_key='subject_matter'))
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_review_record_v1' then
      if p_primary_translation_id is null or p_review_purpose is null or p_review_decision is null
         or p_review_purpose not in ('translation_content','translation_publication')
         or p_review_decision not in ('approved','rejected','returned')
         or p_replacement_translation_id is not null or p_entity_type is not null
         or p_entity_id is not null or p_field_key is not null or p_output_locale is not null
         or p_expected_fingerprint is not null or p_translated_text is not null
         or p_machine_generated is not null or p_machine_provider is not null or p_machine_model is not null
         or p_content_review_record_id is not null or p_publication_review_record_id is not null
         or p_expected_primary_translation_version is not null
         or p_expected_replacement_translation_version is not null
         or p_expected_primary_state_version is not null
         or p_expected_replacement_state_version is not null or p_reason_code is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_submit_review_v1' then
      if p_primary_translation_id is null or p_expected_primary_translation_version is null
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_reason_digest is not null or p_notes_digest is not null
         or p_content_review_record_id is not null or p_publication_review_record_id is not null
         or p_expected_replacement_translation_version is not null or p_expected_primary_state_version is not null
         or p_expected_replacement_state_version is not null or p_reason_code is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_content_approve_v1' then
      if p_primary_translation_id is null or p_content_review_record_id is null
         or p_expected_primary_translation_version is null
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_reason_digest is not null or p_notes_digest is not null
         or p_publication_review_record_id is not null or p_expected_replacement_translation_version is not null
         or p_expected_primary_state_version is not null or p_expected_replacement_state_version is not null
         or p_reason_code is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_content_reject_v1' then
      if p_primary_translation_id is null or p_content_review_record_id is null
         or p_expected_primary_translation_version is null or p_reason_digest is null
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_notes_digest is not null
         or p_publication_review_record_id is not null or p_expected_replacement_translation_version is not null
         or p_expected_primary_state_version is not null or p_expected_replacement_state_version is not null
         or p_reason_code is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_publication_review_prepare_v1',
         'translation_publication_eligible_v1','translation_publish_v1' then
      if p_primary_translation_id is null or p_expected_primary_state_version is null
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_reason_digest is not null or p_notes_digest is not null
         or p_content_review_record_id is not null or p_publication_review_record_id is not null
         or p_expected_primary_translation_version is not null or p_expected_replacement_translation_version is not null
         or p_expected_replacement_state_version is not null or p_reason_code is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_publication_approve_v1' then
      if p_primary_translation_id is null or p_publication_review_record_id is null
         or p_expected_primary_state_version is null
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_reason_digest is not null or p_notes_digest is not null
         or p_content_review_record_id is not null or p_expected_primary_translation_version is not null
         or p_expected_replacement_translation_version is not null or p_expected_replacement_state_version is not null
         or p_reason_code is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_suspend_routine_v1' then
      if p_primary_translation_id is null or p_expected_primary_state_version is null or p_reason_digest is null
         or p_reason_code is null
         or p_reason_code not in ('stale_source_suspension','conflict_suspension',
           'authority_error_suspension','translation_defect_suspension')
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_notes_digest is not null
         or p_content_review_record_id is not null or p_publication_review_record_id is not null
         or p_expected_primary_translation_version is not null or p_expected_replacement_translation_version is not null
         or p_expected_replacement_state_version is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_suspend_emergency_v1','translation_emergency_clearance_v1',
         'translation_reinstate_v1' then
      if p_primary_translation_id is null or p_expected_primary_state_version is null or p_reason_digest is null
         or (p_operation_kind='translation_suspend_emergency_v1' and p_reason_code is distinct from 'emergency_governance_suspension')
         or (p_operation_kind='translation_emergency_clearance_v1' and p_reason_code is distinct from 'manual_correction')
         or (p_operation_kind='translation_reinstate_v1' and p_reason_code is distinct from 'reinstated_after_suspension')
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_notes_digest is not null
         or p_content_review_record_id is not null or p_publication_review_record_id is not null
         or p_expected_primary_translation_version is not null or p_expected_replacement_translation_version is not null
         or p_expected_replacement_state_version is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_withdraw_v1' then
      if p_primary_translation_id is null or p_expected_primary_translation_version is null
         or p_expected_primary_state_version is null or p_reason_digest is null
         or p_reason_code is distinct from 'withdrawn_reason_required'
         or p_replacement_translation_id is not null or p_entity_type is not null or p_entity_id is not null
         or p_field_key is not null or p_output_locale is not null or p_expected_fingerprint is not null
         or p_translated_text is not null or p_machine_generated is not null or p_machine_provider is not null
         or p_machine_model is not null or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_notes_digest is not null
         or p_content_review_record_id is not null or p_publication_review_record_id is not null
         or p_expected_replacement_translation_version is not null or p_expected_replacement_state_version is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    when 'translation_handover_v1' then
      if p_primary_translation_id is null or p_replacement_translation_id is null
         or p_primary_translation_id=p_replacement_translation_id
         or p_content_review_record_id is null or p_publication_review_record_id is null
         or p_expected_primary_translation_version is null or p_expected_replacement_translation_version is null
         or p_expected_primary_state_version is null or p_expected_replacement_state_version is null
         or p_reason_digest is null or p_reason_code is distinct from 'superseded_by_new_version'
         or p_entity_type is not null or p_entity_id is not null or p_field_key is not null
         or p_output_locale is not null or p_expected_fingerprint is not null or p_translated_text is not null
         or p_machine_generated is not null or p_machine_provider is not null or p_machine_model is not null
         or p_review_purpose is not null or p_review_decision is not null
         or p_supersedes_review_record_id is not null or p_notes_digest is not null
      then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  end case;

  -- Signature order is the fixed schema. Unused fields have already been rejected.
  v := array[
    convert_to(n_kind,'UTF8'), uuid_send(p_actor_principal_id),
    case when p_primary_translation_id is null then null else uuid_send(p_primary_translation_id) end,
    case when p_replacement_translation_id is null then null else uuid_send(p_replacement_translation_id) end,
    case when p_entity_type is null then null else convert_to(btrim(normalize(replace(p_entity_type,E'\r\n',E'\n'),NFC)),'UTF8') end,
    case when p_entity_id is null then null else uuid_send(p_entity_id) end,
    case when p_field_key is null then null else convert_to(btrim(normalize(replace(p_field_key,E'\r\n',E'\n'),NFC)),'UTF8') end,
    case when p_output_locale is null then null else convert_to(btrim(normalize(replace(p_output_locale,E'\r\n',E'\n'),NFC)),'UTF8') end,
    case when p_expected_fingerprint is null then null else convert_to(btrim(normalize(replace(p_expected_fingerprint,E'\r\n',E'\n'),NFC)),'UTF8') end,
    case when p_translated_text is null then null else public.digest(convert_to(btrim(normalize(replace(p_translated_text,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256') end,
    case when p_machine_generated is null then null when p_machine_generated then decode('01','hex') else decode('00','hex') end,
    case when p_machine_provider is null then null else public.digest(convert_to(btrim(normalize(replace(p_machine_provider,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256') end,
    case when p_machine_model is null then null else public.digest(convert_to(btrim(normalize(replace(p_machine_model,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256') end,
    case when p_review_purpose is null then null else convert_to(btrim(normalize(replace(p_review_purpose,E'\r\n',E'\n'),NFC)),'UTF8') end,
    case when p_review_decision is null then null else convert_to(btrim(normalize(replace(p_review_decision,E'\r\n',E'\n'),NFC)),'UTF8') end,
    case when p_supersedes_review_record_id is null then null else uuid_send(p_supersedes_review_record_id) end,
    case when p_reason_digest is null then null else decode(p_reason_digest,'hex') end,
    case when p_notes_digest is null then null else decode(p_notes_digest,'hex') end,
    case when p_content_review_record_id is null then null else uuid_send(p_content_review_record_id) end,
    case when p_publication_review_record_id is null then null else uuid_send(p_publication_review_record_id) end,
    case when p_expected_primary_translation_version is null then null else int8send(p_expected_primary_translation_version::bigint) end,
    case when p_expected_replacement_translation_version is null then null else int8send(p_expected_replacement_translation_version::bigint) end,
    case when p_expected_primary_state_version is null then null else int8send(p_expected_primary_state_version::bigint) end,
    case when p_expected_replacement_state_version is null then null else int8send(p_expected_replacement_state_version::bigint) end,
    case when p_reason_code is null then null else convert_to(btrim(normalize(replace(p_reason_code,E'\r\n',E'\n'),NFC)),'UTF8') end
  ];
  foreach x in array v loop
    i := i + 1;
    payload := payload || int2send(i::smallint);
    if x is null then payload := payload || decode('00','hex');
    else payload := payload || decode('01','hex') || int4send(octet_length(x)) || x;
    end if;
  end loop;
  return encode(public.digest(payload,'sha256'),'hex');
exception when character_not_in_repertoire or untranslatable_character or data_exception then
  raise exception 'TP_OPERATION_TEXT_ENCODING_INVALID';
end;
$$;

create or replace function public.fn_governed_principals_validate_write()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if tg_op='UPDATE' then
    if new.id<>old.id or new.identity_issuer<>old.identity_issuer
       or new.external_subject<>old.external_subject or new.principal_kind<>old.principal_kind
       or new.created_at<>old.created_at or old.status='disabled'
    then raise exception 'TP_PRINCIPAL_IMMUTABLE'; end if;
    if old.status='active' and new.status not in ('active','disabled')
    then raise exception 'TP_PRINCIPAL_STATE_INVALID'; end if;
  end if;
  return new;
end $$;

create or replace function public.fn_governed_role_assignments_validate_write()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if tg_op='UPDATE' and (
    new.id<>old.id or new.principal_id<>old.principal_id or new.role_code<>old.role_code
    or lower(new.authorization_period)<>lower(old.authorization_period)
    or new.granted_by_principal_id<>old.granted_by_principal_id
    or new.grant_operation_id<>old.grant_operation_id or new.created_at<>old.created_at
    or old.revoked_at is not null
  ) then raise exception 'TP_ROLE_ASSIGNMENT_IMMUTABLE'; end if;
  return new;
end $$;

create or replace function public.fn_governed_authorization_audit_append_only()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin raise exception 'TP_AUTH_AUDIT_IMMUTABLE'; end $$;

create or replace function public.fn_canonical_translation_operations_guard()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare candidate boolean; request_ok boolean:=false; result_ok boolean:=false;
begin
  if tg_op='DELETE' then raise exception 'TP_OPERATION_IMMUTABLE'; end if;
  candidate := coalesce(new.operation_kind in ('translation_candidate_machine_v1','translation_candidate_human_v1'),false);
  if tg_op='INSERT' then
    if new.operation_status<>'pending' or new.committed_at is not null
       or new.resulting_primary_translation_version is not null
       or new.resulting_replacement_translation_version is not null
       or new.resulting_primary_translation_status is not null
       or new.resulting_replacement_translation_status is not null
       or new.resulting_primary_state_version is not null
       or new.resulting_replacement_state_version is not null
       or new.resulting_primary_state is not null
       or new.resulting_replacement_state is not null
       or new.resulting_publication_state_id is not null
       or new.resulting_review_record_id is not null
       or new.resulting_primary_transition_id is not null
       or new.resulting_replacement_approval_transition_id is not null
       or new.resulting_replacement_eligibility_transition_id is not null
       or new.resulting_replacement_publication_transition_id is not null
       or new.resulting_canonical_fingerprint is not null
    then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    request_ok := case new.operation_kind
      when 'translation_candidate_machine_v1' then
        new.primary_translation_id is null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is null and new.expected_replacement_state_version is null
      when 'translation_candidate_human_v1' then
        new.primary_translation_id is null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is null and new.expected_replacement_state_version is null
      when 'translation_review_record_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.content_review_record_id is null and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is null and new.expected_replacement_state_version is null
      when 'translation_submit_review_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is not null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is null and new.expected_replacement_state_version is null
      when 'translation_content_approve_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is not null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is not null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is null and new.expected_replacement_state_version is null
      when 'translation_content_reject_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is not null and new.content_review_record_id is not null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is not null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is null and new.expected_replacement_state_version is null
      when 'translation_publication_review_prepare_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_publication_approve_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is not null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_publication_eligible_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_publish_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_suspend_routine_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is not null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_suspend_emergency_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is not null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_emergency_clearance_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is not null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_reinstate_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is not null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_withdraw_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is null
        and new.reason_digest is not null and new.content_review_record_id is null
        and new.publication_review_record_id is null
        and new.expected_primary_translation_version is not null
        and new.expected_replacement_translation_version is null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is null
      when 'translation_handover_v1' then
        new.primary_translation_id is not null and new.replacement_translation_id is not null
        and new.reason_digest is not null and new.content_review_record_id is not null
        and new.publication_review_record_id is not null
        and new.expected_primary_translation_version is not null
        and new.expected_replacement_translation_version is not null
        and new.expected_primary_state_version is not null and new.expected_replacement_state_version is not null
      else false end;
    if not coalesce(request_ok,false) then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
    return new;
  end if;
  if old.operation_status<>'pending' or new.operation_status<>'committed'
     or new.operation_id<>old.operation_id or new.operation_kind<>old.operation_kind
     or new.request_digest<>old.request_digest or new.actor_principal_id<>old.actor_principal_id
     or new.replacement_translation_id is distinct from old.replacement_translation_id
     or new.reason_digest is distinct from old.reason_digest
     or new.content_review_record_id is distinct from old.content_review_record_id
     or new.publication_review_record_id is distinct from old.publication_review_record_id
     or new.expected_primary_translation_version is distinct from old.expected_primary_translation_version
     or new.expected_replacement_translation_version is distinct from old.expected_replacement_translation_version
     or new.expected_primary_state_version is distinct from old.expected_primary_state_version
     or new.expected_replacement_state_version is distinct from old.expected_replacement_state_version
     or new.created_at<>old.created_at or new.committed_at is null
     or (not candidate and new.primary_translation_id is distinct from old.primary_translation_id)
     or (candidate and (old.primary_translation_id is not null or new.primary_translation_id is null))
  then raise exception 'TP_OPERATION_IMMUTABLE'; end if;
  result_ok := case new.operation_kind
    when 'translation_candidate_machine_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_primary_translation_status='machine_generated_pending_review'
      and new.resulting_publication_state_id is not null
      and new.resulting_primary_state_version=1 and new.resulting_primary_state='draft'
      and new.resulting_primary_transition_id is not null and new.resulting_canonical_fingerprint is not null
      and new.resulting_review_record_id is null
      and new.resulting_replacement_translation_version is null
      and new.resulting_replacement_translation_status is null
      and new.resulting_replacement_state_version is null and new.resulting_replacement_state is null
      and new.resulting_replacement_approval_transition_id is null
      and new.resulting_replacement_eligibility_transition_id is null
      and new.resulting_replacement_publication_transition_id is null
    when 'translation_candidate_human_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_primary_translation_status='human_review_pending'
      and new.resulting_publication_state_id is not null
      and new.resulting_primary_state_version=1 and new.resulting_primary_state='draft'
      and new.resulting_primary_transition_id is not null and new.resulting_canonical_fingerprint is not null
      and new.resulting_review_record_id is null
      and new.resulting_replacement_translation_version is null
      and new.resulting_replacement_translation_status is null
      and new.resulting_replacement_state_version is null and new.resulting_replacement_state is null
      and new.resulting_replacement_approval_transition_id is null
      and new.resulting_replacement_eligibility_transition_id is null
      and new.resulting_replacement_publication_transition_id is null
    when 'translation_review_record_v1' then
      new.resulting_review_record_id is not null
      and new.resulting_primary_translation_version is null
      and new.resulting_primary_translation_status is null
      and new.resulting_primary_state_version is null and new.resulting_primary_state is null
      and new.resulting_publication_state_id is null and new.resulting_primary_transition_id is null
      and new.resulting_replacement_translation_version is null
      and new.resulting_replacement_translation_status is null
      and new.resulting_replacement_state_version is null and new.resulting_replacement_state is null
      and new.resulting_replacement_approval_transition_id is null
      and new.resulting_replacement_eligibility_transition_id is null
      and new.resulting_replacement_publication_transition_id is null
      and new.resulting_canonical_fingerprint is null
    when 'translation_submit_review_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_primary_translation_status='human_review_pending'
      and new.resulting_review_record_id is null and new.resulting_primary_state_version is null
      and new.resulting_primary_state is null and new.resulting_primary_transition_id is null
    when 'translation_content_approve_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_primary_translation_status='approved'
      and new.resulting_review_record_id is null and new.resulting_primary_state_version is null
      and new.resulting_primary_state is null and new.resulting_primary_transition_id is null
    when 'translation_content_reject_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_primary_translation_status='rejected'
      and new.resulting_review_record_id is null and new.resulting_primary_state_version is null
      and new.resulting_primary_state is null and new.resulting_primary_transition_id is null
    when 'translation_publication_review_prepare_v1' then
      new.resulting_primary_state='review_required' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_publication_approve_v1' then
      new.resulting_primary_state='approved' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_publication_eligible_v1' then
      new.resulting_primary_state='publication_eligible' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_publish_v1' then
      new.resulting_primary_state='published' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_suspend_routine_v1' then
      new.resulting_primary_state='suspended' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_suspend_emergency_v1' then
      new.resulting_primary_state='suspended' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_emergency_clearance_v1' then
      new.resulting_primary_state='review_required' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_reinstate_v1' then
      new.resulting_primary_state='published' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_withdraw_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_primary_translation_status='withdrawn'
      and new.resulting_primary_state='withdrawn' and new.resulting_primary_state_version is not null
      and new.resulting_primary_transition_id is not null
    when 'translation_handover_v1' then
      new.resulting_primary_translation_version is not null
      and new.resulting_replacement_translation_version is not null
      and new.resulting_primary_translation_status='superseded'
      and new.resulting_replacement_translation_status='approved'
      and new.resulting_primary_state='superseded' and new.resulting_replacement_state='published'
      and new.resulting_primary_state_version is not null and new.resulting_replacement_state_version=5
      and new.resulting_primary_transition_id is not null
      and new.resulting_replacement_approval_transition_id is not null
      and new.resulting_replacement_eligibility_transition_id is not null
      and new.resulting_replacement_publication_transition_id is not null
    else false end;
  if not coalesce(result_ok,false) then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  if (new.operation_kind not in ('translation_candidate_machine_v1','translation_candidate_human_v1')
      and (new.resulting_publication_state_id is not null or new.resulting_canonical_fingerprint is not null))
     or (new.operation_kind<>'translation_review_record_v1' and new.resulting_review_record_id is not null)
     or (new.operation_kind<>'translation_handover_v1' and (
       new.resulting_replacement_translation_version is not null
       or new.resulting_replacement_translation_status is not null
       or new.resulting_replacement_state_version is not null
       or new.resulting_replacement_state is not null
       or new.resulting_replacement_approval_transition_id is not null
       or new.resulting_replacement_eligibility_transition_id is not null
       or new.resulting_replacement_publication_transition_id is not null))
     or (new.operation_kind not in (
       'translation_candidate_machine_v1','translation_candidate_human_v1',
       'translation_submit_review_v1','translation_content_approve_v1',
       'translation_content_reject_v1','translation_withdraw_v1','translation_handover_v1')
       and (new.resulting_primary_translation_version is not null
         or new.resulting_primary_translation_status is not null))
     or (new.operation_kind not in (
       'translation_candidate_machine_v1','translation_candidate_human_v1',
       'translation_publication_review_prepare_v1','translation_publication_approve_v1',
       'translation_publication_eligible_v1','translation_publish_v1',
       'translation_suspend_routine_v1','translation_suspend_emergency_v1',
       'translation_emergency_clearance_v1','translation_reinstate_v1',
       'translation_withdraw_v1','translation_handover_v1')
       and (new.resulting_primary_state_version is not null
         or new.resulting_primary_state is not null or new.resulting_primary_transition_id is not null))
  then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  if new.operation_kind='translation_review_record_v1' and not exists(
    select 1 from public.knowledge_review_records rr
    where rr.id=new.resulting_review_record_id
      and rr.canonical_translation_operation_id=new.operation_id
      and rr.reviewer_principal_id=new.actor_principal_id
      and rr.entity_id=new.primary_translation_id)
  then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  if new.operation_kind in (
      'translation_candidate_machine_v1','translation_candidate_human_v1',
      'translation_publication_review_prepare_v1','translation_publication_approve_v1',
      'translation_publication_eligible_v1','translation_publish_v1',
      'translation_suspend_routine_v1','translation_suspend_emergency_v1',
      'translation_emergency_clearance_v1','translation_reinstate_v1','translation_withdraw_v1')
     and not exists(
       select 1 from public.knowledge_publication_state_transitions pt
       where pt.id=new.resulting_primary_transition_id
         and pt.canonical_translation_operation_id=new.operation_id
         and pt.actor_principal_id=new.actor_principal_id
         and pt.entity_id=new.primary_translation_id
         and pt.to_state=new.resulting_primary_state
         and pt.resulting_state_version=new.resulting_primary_state_version)
  then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  if new.operation_kind='translation_handover_v1' and (
    not exists(select 1 from public.knowledge_publication_state_transitions pt
      where pt.id=new.resulting_primary_transition_id
        and pt.canonical_translation_operation_id=new.operation_id
        and pt.actor_principal_id=new.actor_principal_id and pt.entity_id=new.primary_translation_id
        and pt.from_state='published' and pt.to_state='superseded'
        and pt.resulting_state_version=new.resulting_primary_state_version)
    or not exists(select 1 from public.knowledge_publication_state_transitions pt
      where pt.id=new.resulting_replacement_approval_transition_id
        and pt.canonical_translation_operation_id=new.operation_id
        and pt.actor_principal_id=new.actor_principal_id and pt.entity_id=new.replacement_translation_id
        and pt.from_state='review_required' and pt.to_state='approved'
        and pt.resulting_state_version=3)
    or not exists(select 1 from public.knowledge_publication_state_transitions pt
      where pt.id=new.resulting_replacement_eligibility_transition_id
        and pt.canonical_translation_operation_id=new.operation_id
        and pt.actor_principal_id=new.actor_principal_id and pt.entity_id=new.replacement_translation_id
        and pt.from_state='approved' and pt.to_state='publication_eligible'
        and pt.resulting_state_version=4)
    or not exists(select 1 from public.knowledge_publication_state_transitions pt
      where pt.id=new.resulting_replacement_publication_transition_id
        and pt.canonical_translation_operation_id=new.operation_id
        and pt.actor_principal_id=new.actor_principal_id and pt.entity_id=new.replacement_translation_id
        and pt.from_state='publication_eligible' and pt.to_state='published'
        and pt.resulting_state_version=new.resulting_replacement_state_version))
  then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  return new;
end $$;

create or replace function public.fn_canonical_translation_operations_require_committed()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if not exists(select 1 from public.knowledge_canonical_translation_operations
    where operation_id=new.operation_id and operation_status='committed')
  then raise exception 'TP_OPERATION_PENDING_INVARIANT'; end if;
  return null;
end $$;

create or replace function public.fn_require_new_translation_publication_graph()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if exists(select 1 from public.knowledge_canonical_unit_translations where id=new.id)
     and not exists(
       select 1 from public.knowledge_publication_states s
       join public.knowledge_publication_state_transitions t on t.id=s.current_transition_id
       where s.entity_type='canonical_translation' and s.entity_id=new.id
         and s.current_state='draft' and s.state_version=1 and not s.emergency_disabled
         and t.entity_type='canonical_translation' and t.entity_id=new.id
         and t.from_state is null and t.to_state='draft'
         and t.from_state_version=0 and t.resulting_state_version=1
     )
  then raise exception 'TP_PUBLICATION_GRAPH_REQUIRED'; end if;
  return null;
end $$;

create or replace function public.fn_canonical_translation_review_records_validate()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare o record; prior record;
  dg text;
begin
  if new.entity_type<>'canonical_translation' then return new; end if;
  select * into o from public.knowledge_canonical_translation_operations
    where operation_id=new.canonical_translation_operation_id;
  dg:=public.fn_compute_canonical_translation_operation_digest(
    'translation_review_record_v1',new.reviewer_principal_id,new.entity_id,null,
    null,null,null,null,null,null,null,null,null,new.review_purpose,new.review_decision,
    new.supersedes_review_record_id,new.reason,new.notes,null,null,null,null,null,null,null);
  if o.operation_status<>'pending' or o.operation_kind<>'translation_review_record_v1'
     or o.actor_principal_id<>new.reviewer_principal_id
     or o.primary_translation_id<>new.entity_id
     or o.request_digest<>dg
  then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  if new.supersedes_review_record_id is not null then
    select * into prior from public.knowledge_review_records where id=new.supersedes_review_record_id for update;
    if prior.entity_type<>'canonical_translation' or prior.entity_id<>new.entity_id
       or prior.review_purpose<>new.review_purpose
    then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  end if;
  return new;
end $$;

create or replace function public.fn_canonical_translation_review_records_append_only()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if old.entity_type='canonical_translation' then raise exception 'TP_REVIEW_RECORD_IMMUTABLE'; end if;
  return case when tg_op='DELETE' then old else new end;
end $$;

create or replace function public.fn_canonical_translation_review_operation_binding_require_committed()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if new.entity_type='canonical_translation' and not exists(
    select 1 from public.knowledge_canonical_translation_operations o
    where o.operation_id=new.canonical_translation_operation_id and o.operation_status='committed'
      and o.operation_kind='translation_review_record_v1'
      and o.actor_principal_id=new.reviewer_principal_id
      and o.primary_translation_id=new.entity_id and o.resulting_review_record_id=new.id
  ) then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  return null;
end $$;

create or replace function public.fn_translation_content_review_binding_validate()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if new.review_record_id is not null and not exists(
    select 1 from public.knowledge_review_records r
    where r.id=new.review_record_id and r.entity_type='canonical_translation'
      and r.entity_id=new.id and r.review_purpose='translation_content'
      and r.review_decision='approved'
      and not exists(select 1 from public.knowledge_review_records x where x.supersedes_review_record_id=r.id)
  ) then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  return new;
end $$;

create or replace function public.fn_translation_publication_review_binding_validate()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare o record; valid boolean:=false;
begin
  if new.entity_type<>'canonical_translation' then return new; end if;
  select * into o from public.knowledge_canonical_translation_operations
    where operation_id=new.canonical_translation_operation_id;
  if o.operation_status<>'pending' or o.actor_principal_id<>new.actor_principal_id
  then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  valid := case o.operation_kind
    when 'translation_candidate_machine_v1' then
      o.primary_translation_id is null and new.from_state is null and new.to_state='draft'
    when 'translation_candidate_human_v1' then
      o.primary_translation_id is null and new.from_state is null and new.to_state='draft'
    when 'translation_publication_review_prepare_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='draft' and new.to_state='review_required'
    when 'translation_publication_approve_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='review_required' and new.to_state='approved'
    when 'translation_publication_eligible_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='approved' and new.to_state='publication_eligible'
    when 'translation_publish_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='publication_eligible' and new.to_state='published'
    when 'translation_suspend_routine_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='published' and new.to_state='suspended'
    when 'translation_suspend_emergency_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='published' and new.to_state='suspended'
    when 'translation_emergency_clearance_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='suspended' and new.to_state='review_required'
    when 'translation_reinstate_v1' then
      new.entity_id=o.primary_translation_id and new.from_state='suspended' and new.to_state='published'
    when 'translation_withdraw_v1' then
      new.entity_id=o.primary_translation_id and new.to_state='withdrawn'
    when 'translation_handover_v1' then
      (new.entity_id=o.replacement_translation_id and
        ((new.from_state='review_required' and new.to_state='approved')
         or (new.from_state='approved' and new.to_state='publication_eligible')
         or (new.from_state='publication_eligible' and new.to_state='published')))
      or (new.entity_id=o.primary_translation_id and new.from_state='published'
          and new.to_state='superseded'
          and new.replacement_entity_id is not distinct from o.replacement_translation_id)
    else false end;
  if not coalesce(valid,false) then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  if new.review_record_id is not null and not exists(
    select 1 from public.knowledge_review_records r
    where r.id=new.review_record_id and r.entity_type='canonical_translation'
      and r.entity_id=new.entity_id and r.review_purpose='translation_publication'
      and r.review_decision='approved'
      and not exists(select 1 from public.knowledge_review_records x where x.supersedes_review_record_id=r.id)
  ) then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  return new;
end $$;

create or replace function public.fn_canonical_translation_transition_operation_binding_require_committed()
returns trigger language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if new.entity_type='canonical_translation' and not exists(
    select 1 from public.knowledge_canonical_translation_operations o
    where o.operation_id=new.canonical_translation_operation_id and o.operation_status='committed'
      and o.actor_principal_id=new.actor_principal_id
      and (
        (o.operation_kind in (
          'translation_candidate_machine_v1','translation_candidate_human_v1',
          'translation_publication_review_prepare_v1','translation_publication_approve_v1',
          'translation_publication_eligible_v1','translation_publish_v1',
          'translation_suspend_routine_v1','translation_suspend_emergency_v1',
          'translation_emergency_clearance_v1','translation_reinstate_v1','translation_withdraw_v1')
         and new.entity_id=o.primary_translation_id
         and new.id=o.resulting_primary_transition_id
         and new.to_state=o.resulting_primary_state
         and new.resulting_state_version=o.resulting_primary_state_version)
        or
        (o.operation_kind='translation_handover_v1' and (
          (new.entity_id=o.primary_translation_id
           and new.from_state='published' and new.to_state='superseded'
           and new.id=o.resulting_primary_transition_id
           and new.resulting_state_version=o.resulting_primary_state_version)
          or (new.entity_id=o.replacement_translation_id
           and new.from_state='review_required' and new.to_state='approved'
           and new.id=o.resulting_replacement_approval_transition_id
           and new.resulting_state_version=3)
          or (new.entity_id=o.replacement_translation_id
           and new.from_state='approved' and new.to_state='publication_eligible'
           and new.id=o.resulting_replacement_eligibility_transition_id
           and new.resulting_state_version=4)
          or (new.entity_id=o.replacement_translation_id
           and new.from_state='publication_eligible' and new.to_state='published'
           and new.id=o.resulting_replacement_publication_transition_id
           and new.resulting_state_version=o.resulting_replacement_state_version)
        ))
      )
  ) then raise exception 'TP_OPERATION_SHAPE_INVALID'; end if;
  return null;
end $$;

create or replace function public.fn_lock_translation_target_and_get_content(
  p_entity_type text,p_entity_id uuid,p_field_key text
) returns table(target_exists boolean,canonical_content text)
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if p_entity_type='claim' and p_field_key='claim_text_canonical' then
    return query select true,c.claim_text_canonical from public.knowledge_claims c where c.id=p_entity_id for update;
  elsif p_entity_type='process' and p_field_key='title' then
    return query select true,p.title from public.knowledge_processes p where p.id=p_entity_id for update;
  elsif p_entity_type='process' and p_field_key='trigger_description' then
    return query select true,p.trigger_description from public.knowledge_processes p where p.id=p_entity_id for update;
  elsif p_entity_type='process' and p_field_key='safe_first_step' then
    return query select true,p.safe_first_step from public.knowledge_processes p where p.id=p_entity_id for update;
  elsif p_entity_type='process_step' and p_field_key='title' then
    return query select true,p.title from public.knowledge_process_steps p where p.id=p_entity_id for update;
  elsif p_entity_type='process_step' and p_field_key='description_canonical' then
    return query select true,p.description_canonical from public.knowledge_process_steps p where p.id=p_entity_id for update;
  elsif p_entity_type='evidence_requirement' and p_field_key='description_canonical' then
    return query select true,e.description_canonical from public.knowledge_evidence_requirements e where e.id=p_entity_id for update;
  elsif p_entity_type='authority_competence' and p_field_key='subject_matter' then
    return query select true,a.subject_matter from public.knowledge_authority_competences a where a.id=p_entity_id for update;
  else raise exception 'TP_CANONICAL_FIELD_NOT_ALLOWED';
  end if;
  if not found then raise exception 'TP_CANONICAL_TARGET_NOT_FOUND'; end if;
end $$;

create or replace function public.fn_require_governed_principal_role(
  p_principal_id uuid,p_role_code text,p_operation_at timestamptz
) returns void language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare k text;
begin
  select principal_kind into k from public.knowledge_governed_principals
    where id=p_principal_id and status='active';
  if k is null then raise exception 'TP_AUTH_PRINCIPAL_DISABLED'; end if;
  if (p_role_code='translation_creator_machine' and k<>'governed_machine')
     or (p_role_code<>'translation_creator_machine' and k<>'human')
  then raise exception 'TP_AUTH_PRINCIPAL_KIND_MISMATCH'; end if;
  if not exists(select 1 from public.knowledge_governed_principal_role_assignments
    where principal_id=p_principal_id and role_code=p_role_code
      and authorization_period @> p_operation_at
      and (revoked_at is null or revoked_at>p_operation_at))
  then raise exception 'TP_AUTH_ROLE_REQUIRED'; end if;
end $$;

create or replace function public.fn_require_canonical_translation_review(
  p_review_record_id uuid,p_translation_id uuid,p_purpose text,p_decision text,p_operation_at timestamptz
) returns void language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare r record;
begin
  select * into r from public.knowledge_review_records
    where id=p_review_record_id for update;
  if not found
     or r.entity_type<>'canonical_translation'
     or r.entity_id<>p_translation_id
     or r.review_purpose<>p_purpose
     or r.review_decision<>p_decision
     or r.reviewed_at>p_operation_at
     or r.reviewer_type<>'human'
     or r.review_level<>(case p_purpose when 'translation_content' then 'translation_content_v1'
       else 'translation_publication_v1' end)
     or r.review_status<>(case p_decision when 'returned' then 'review_required'
       else 'human_reviewed' end)
  then raise exception 'TP_REVIEW_RECORD_MISMATCH'; end if;
  if exists(select 1 from public.knowledge_review_records x
    where x.supersedes_review_record_id=p_review_record_id)
  then raise exception 'TP_REVIEW_RECORD_SUPERSEDED'; end if;
end $$;

create or replace function public.fn_require_translation_separation(
  p_creator_principal_id uuid,p_content_reviewer_principal_id uuid,
  p_publication_reviewer_principal_id uuid,p_administrator_principal_id uuid
) returns void language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin
  if (p_creator_principal_id is not null and (
        p_creator_principal_id is not distinct from p_content_reviewer_principal_id
        or p_creator_principal_id is not distinct from p_publication_reviewer_principal_id
        or p_creator_principal_id is not distinct from p_administrator_principal_id))
     or (p_administrator_principal_id is not null and (
        p_administrator_principal_id is not distinct from p_content_reviewer_principal_id
        or p_administrator_principal_id is not distinct from p_publication_reviewer_principal_id))
  then raise exception 'TP_SEPARATION_OF_DUTIES'; end if;
end $$;

create or replace function public.fn_transition_canonical_translation_internal(
  p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_to_state text,
  p_expected_state_version integer,p_reason_code text,p_reason_digest text,
  p_review_record_id uuid,p_replacement_translation_id uuid,p_emergency boolean
) returns table(transition_id uuid,current_state text,state_version integer)
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare s record; tid uuid; allowed boolean:=false;
begin
  select * into s from public.knowledge_publication_states
    where entity_type='canonical_translation' and entity_id=p_translation_id for update;
  if not found then raise exception 'TP_LEGACY_PUBLICATION_GRAPH_MISSING'; end if;
  if s.state_version<>p_expected_state_version then raise exception 'TP_PUBLICATION_STATE_VERSION_CONFLICT'; end if;
  allowed := (s.current_state='draft' and p_to_state='review_required')
    or (s.current_state='review_required' and p_to_state in ('approved','withdrawn'))
    or (s.current_state='approved' and p_to_state in ('publication_eligible','withdrawn'))
    or (s.current_state='publication_eligible' and p_to_state in ('published','withdrawn'))
    or (s.current_state='published' and p_to_state in ('suspended','superseded','withdrawn'))
    or (s.current_state='suspended' and p_to_state in ('published','review_required','withdrawn'));
  if not allowed then raise exception 'TP_PUBLICATION_TRANSITION_INVALID'; end if;
  if s.emergency_disabled and s.current_state='suspended' and p_to_state='published'
  then raise exception 'TP_PUBLICATION_EMERGENCY_DISABLED'; end if;
  tid:=gen_random_uuid();
  insert into public.knowledge_publication_state_transitions(
    id,entity_type,entity_id,from_state,to_state,from_state_version,resulting_state_version,
    transition_reason_code,transition_reason,actor_class,actor_identifier,review_record_id,
    expected_state_version,replacement_entity_type,replacement_entity_id,emergency_flag,idempotency_key,
    actor_principal_id,canonical_translation_operation_id
  ) values(
    tid,'canonical_translation',p_translation_id,s.current_state,p_to_state,s.state_version,s.state_version+1,
    coalesce(p_reason_code,'manual_correction'),p_reason_digest,
    case when p_emergency then 'emergency_suspension_authority'
         when p_to_state='approved' then 'authorized_reviewer'
         when p_to_state='review_required' then 'authorized_reviewer'
         else 'publication_administrator' end,
    p_actor_principal_id::text,p_review_record_id,s.state_version,
    case when p_to_state='superseded' then 'canonical_translation' end,
    p_replacement_translation_id,coalesce(p_emergency,false),p_operation_id::text,
    p_actor_principal_id,p_operation_id
  );
  update public.knowledge_publication_states
  set current_state=p_to_state,current_transition_id=tid,state_version=s.state_version+1,
      reason_code=p_reason_code,emergency_disabled=case
        when p_to_state='suspended' then coalesce(p_emergency,false)
        when p_to_state in ('published','review_required') then false
        else emergency_disabled end
  where id=s.id;
  return query select tid,p_to_state,s.state_version+1;
end $$;

-- Candidate core and wrappers.
create or replace function public.fn_create_translation_candidate_with_publication_internal(
  p_operation_id uuid,p_actor_principal_id uuid,p_entity_type text,p_entity_id uuid,
  p_field_key text,p_output_locale text,p_translated_text text,p_machine_provider text,
  p_machine_model text,p_expected_fingerprint text,p_machine_generated boolean
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare kind text; dg text; existing public.knowledge_canonical_translation_operations%rowtype;
  content text; fp text; ver integer; trid uuid:=gen_random_uuid(); tid uuid:=gen_random_uuid(); sid uuid:=gen_random_uuid();
  role text; result public.knowledge_canonical_translation_operations%rowtype;
begin
  kind:=case when p_machine_generated then 'translation_candidate_machine_v1' else 'translation_candidate_human_v1' end;
  dg:=public.fn_compute_canonical_translation_operation_digest(kind,p_actor_principal_id,null,null,
    p_entity_type,p_entity_id,p_field_key,p_output_locale,p_expected_fingerprint,p_translated_text,
    p_machine_generated,p_machine_provider,p_machine_model,null,null,null,null,null,null,null,null,null,null,null,null);
  begin
    insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,actor_principal_id)
    values(p_operation_id,kind,dg,p_actor_principal_id);
  exception when unique_violation then
    select * into existing from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;
    if existing.operation_status='committed' and existing.operation_kind=kind
       and existing.actor_principal_id=p_actor_principal_id and existing.request_digest=dg then return existing; end if;
    raise exception 'TP_IDEMPOTENCY_CONFLICT';
  end;
  role:=case when p_machine_generated then 'translation_creator_machine' else 'translation_creator_human' end;
  perform public.fn_require_governed_principal_role(p_actor_principal_id,role,statement_timestamp());
  select canonical_content into content from public.fn_lock_translation_target_and_get_content(p_entity_type,p_entity_id,p_field_key);
  if content is null then raise exception 'TP_CANONICAL_CONTENT_NULL'; end if;
  fp:=encode(public.digest(convert_to(btrim(normalize(replace(content,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256'),'hex');
  if p_expected_fingerprint is not null and p_expected_fingerprint<>fp then raise exception 'TP_CANONICAL_FINGERPRINT_STALE'; end if;
  select coalesce(max(translation_version),0)+1 into ver from public.knowledge_canonical_unit_translations
    where entity_type=p_entity_type and entity_id=p_entity_id and field_key=p_field_key and output_locale=p_output_locale;
  insert into public.knowledge_canonical_unit_translations(
    id,entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translated_text,
    translation_version,translation_status,machine_generated,machine_provider,machine_model,
    created_by_actor_type,created_by_identifier,created_by_principal_id
  ) values(tid,p_entity_type,p_entity_id,p_field_key,fp,p_output_locale,p_translated_text,ver,
    case when p_machine_generated then 'machine_generated_pending_review' else 'human_review_pending' end,
    p_machine_generated,p_machine_provider,p_machine_model,
    case when p_machine_generated then 'automated_ingestion_system' else 'authorized_reviewer' end,
    p_actor_principal_id::text,p_actor_principal_id);
  insert into public.knowledge_publication_state_transitions(
    id,entity_type,entity_id,from_state,to_state,from_state_version,resulting_state_version,
    transition_reason_code,actor_class,actor_identifier,expected_state_version,idempotency_key,
    actor_principal_id,canonical_translation_operation_id
  ) values(trid,'canonical_translation',tid,null,'draft',0,1,'initial_draft',
    'migration_bootstrap_system_actor',p_actor_principal_id::text,0,p_operation_id::text,
    p_actor_principal_id,p_operation_id);
  insert into public.knowledge_publication_states(
    id,entity_type,entity_id,current_state,current_transition_id,state_version
  ) values(sid,'canonical_translation',tid,'draft',trid,1);
  update public.knowledge_canonical_translation_operations set operation_status='committed',
    primary_translation_id=tid,resulting_primary_translation_version=ver,
    resulting_primary_translation_status=case when p_machine_generated then 'machine_generated_pending_review' else 'human_review_pending' end,
    resulting_primary_state_version=1,resulting_primary_state='draft',
    resulting_publication_state_id=sid,resulting_primary_transition_id=trid,
    resulting_canonical_fingerprint=fp,committed_at=statement_timestamp()
  where operation_id=p_operation_id returning * into result;
  return result;
end $$;

create or replace function public.knowledge_create_machine_translation_candidate_v2(
  p_operation_id uuid,p_actor_principal_id uuid,p_entity_type text,p_entity_id uuid,
  p_field_key text,p_output_locale text,p_translated_text text,p_machine_provider text,
  p_machine_model text,p_expected_fingerprint text
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin return public.fn_create_translation_candidate_with_publication_internal(
  p_operation_id,p_actor_principal_id,p_entity_type,p_entity_id,p_field_key,p_output_locale,
  p_translated_text,p_machine_provider,p_machine_model,p_expected_fingerprint,true); end $$;

create or replace function public.knowledge_create_human_translation_candidate_v2(
  p_operation_id uuid,p_actor_principal_id uuid,p_entity_type text,p_entity_id uuid,
  p_field_key text,p_output_locale text,p_translated_text text,p_expected_fingerprint text
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin return public.fn_create_translation_candidate_with_publication_internal(
  p_operation_id,p_actor_principal_id,p_entity_type,p_entity_id,p_field_key,p_output_locale,
  p_translated_text,null,null,p_expected_fingerprint,false); end $$;

-- Review creation.
create or replace function public.knowledge_create_canonical_translation_review(
  p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_review_purpose text,
  p_review_decision text,p_reason_digest text,p_notes_digest text,p_supersedes_review_record_id uuid
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text; existing public.knowledge_canonical_translation_operations%rowtype;
  rid uuid:=gen_random_uuid(); result public.knowledge_canonical_translation_operations%rowtype;
  creator uuid;
begin
  dg:=public.fn_compute_canonical_translation_operation_digest('translation_review_record_v1',
    p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,
    p_review_purpose,p_review_decision,p_supersedes_review_record_id,p_reason_digest,p_notes_digest,
    null,null,null,null,null,null,null);
  begin insert into public.knowledge_canonical_translation_operations(
    operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest)
    values(p_operation_id,'translation_review_record_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest);
  exception when unique_violation then
    select * into existing from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;
    if existing.operation_status='committed' and existing.operation_kind='translation_review_record_v1'
       and existing.actor_principal_id=p_actor_principal_id and existing.request_digest=dg then return existing; end if;
    raise exception 'TP_IDEMPOTENCY_CONFLICT';
  end;
  perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_reviewer',statement_timestamp());
  select created_by_principal_id into creator from public.knowledge_canonical_unit_translations
    where id=p_translation_id for key share;
  if not found then raise exception 'TP_TRANSLATION_NOT_FOUND'; end if;
  perform public.fn_require_translation_separation(creator,p_actor_principal_id,null,null);
  insert into public.knowledge_review_records(
    id,entity_type,entity_id,review_status,review_level,reviewer_type,reviewer_principal_id,
    review_purpose,review_decision,supersedes_review_record_id,canonical_translation_operation_id,
    reason,notes
  ) values(rid,'canonical_translation',p_translation_id,
    case when p_review_decision='returned' then 'review_required' else 'human_reviewed' end,
    case when p_review_purpose='translation_content' then 'translation_content_v1' else 'translation_publication_v1' end,
    'human',p_actor_principal_id,p_review_purpose,p_review_decision,p_supersedes_review_record_id,
    p_operation_id,p_reason_digest,p_notes_digest);
  update public.knowledge_canonical_translation_operations set operation_status='committed',
    resulting_review_record_id=rid,committed_at=statement_timestamp()
    where operation_id=p_operation_id returning * into result;
  return result;
end $$;

-- Shared concise operation pattern implemented separately to retain exact signatures.
create or replace function public.knowledge_submit_canonical_translation_for_review(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_translation_version integer
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;t record;k text;
begin
 dg:=public.fn_compute_canonical_translation_operation_digest('translation_submit_review_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,p_expected_translation_version,null,null,null,null);
 begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,expected_primary_translation_version)
 values(p_operation_id,'translation_submit_review_v1',dg,p_translation_id,p_actor_principal_id,p_expected_translation_version);
 exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;
 if e.operation_status='committed' and e.operation_kind='translation_submit_review_v1'
    and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e; end if;
 raise exception 'TP_IDEMPOTENCY_CONFLICT'; end;
 select principal_kind into k from public.knowledge_governed_principals
  where id=p_actor_principal_id and status='active';
 if k is null then raise exception 'TP_AUTH_PRINCIPAL_DISABLED'; end if;
 if not exists(select 1 from public.knowledge_governed_principal_role_assignments a
   where a.principal_id=p_actor_principal_id
     and a.role_code in ('translation_creator_machine','translation_creator_human','translation_reviewer')
     and a.authorization_period @> statement_timestamp()
     and (a.revoked_at is null or a.revoked_at>statement_timestamp())
     and ((k='governed_machine' and a.role_code='translation_creator_machine')
       or (k='human' and a.role_code in ('translation_creator_human','translation_reviewer'))))
 then raise exception 'TP_AUTH_ROLE_REQUIRED'; end if;
 select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;
 if not found then raise exception 'TP_TRANSLATION_NOT_FOUND'; end if;
 if t.translation_version<>p_expected_translation_version or t.translation_status not in ('draft','machine_generated_pending_review','invalidated_pending_review','human_review_pending') then raise exception 'TP_TRANSLATION_STATUS_INVALID'; end if;
 if t.translation_status<>'human_review_pending' then update public.knowledge_canonical_unit_translations set translation_status='human_review_pending' where id=p_translation_id; end if;
 update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_translation_version=t.translation_version,resulting_primary_translation_status='human_review_pending',committed_at=statement_timestamp() where operation_id=p_operation_id returning * into r;return r;
end $$;

create or replace function public.knowledge_approve_canonical_translation_content(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_translation_version integer,p_content_review_record_id uuid
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;t record; reviewer uuid;
begin
 dg:=public.fn_compute_canonical_translation_operation_digest('translation_content_approve_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,p_content_review_record_id,null,p_expected_translation_version,null,null,null,null);
 begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,content_review_record_id,expected_primary_translation_version)
 values(p_operation_id,'translation_content_approve_v1',dg,p_translation_id,p_actor_principal_id,p_content_review_record_id,p_expected_translation_version);
 exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed' and e.operation_kind='translation_content_approve_v1' and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
 perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_reviewer',statement_timestamp());
 perform public.fn_require_canonical_translation_review(p_content_review_record_id,p_translation_id,'translation_content','approved',statement_timestamp());
 select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;
 select reviewer_principal_id into reviewer from public.knowledge_review_records where id=p_content_review_record_id;
 if t.translation_version<>p_expected_translation_version or t.translation_status<>'human_review_pending' then raise exception 'TP_TRANSLATION_STATUS_INVALID';end if;
 if reviewer is distinct from p_actor_principal_id then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
 perform public.fn_require_translation_separation(t.created_by_principal_id,reviewer,null,null);
 update public.knowledge_canonical_unit_translations set translation_status='approved',human_reviewed=true,
 uncertainty_preserved=true,warnings_preserved=true,numeric_and_deadline_values_preserved=true,
 reviewed_by_actor_type='authorized_reviewer',reviewed_by_identifier=p_actor_principal_id::text,
 reviewed_by_principal_id=reviewer,review_record_id=p_content_review_record_id,verified_at=statement_timestamp()
 where id=p_translation_id;
 update public.knowledge_canonical_translation_operations set operation_status='committed',
 resulting_primary_translation_version=t.translation_version,resulting_primary_translation_status='approved',
 committed_at=statement_timestamp() where operation_id=p_operation_id returning * into r;return r;
end $$;

create or replace function public.knowledge_reject_canonical_translation_content(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_translation_version integer,p_content_review_record_id uuid,p_reason_digest text
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;t record;reviewer uuid;
begin
 dg:=public.fn_compute_canonical_translation_operation_digest('translation_content_reject_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,p_content_review_record_id,null,p_expected_translation_version,null,null,null,null);
 begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest,content_review_record_id,expected_primary_translation_version)
 values(p_operation_id,'translation_content_reject_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest,p_content_review_record_id,p_expected_translation_version);
 exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed' and e.operation_kind='translation_content_reject_v1' and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
 perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_reviewer',statement_timestamp());
 perform public.fn_require_canonical_translation_review(p_content_review_record_id,p_translation_id,'translation_content','rejected',statement_timestamp());
 select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;
 select reviewer_principal_id into reviewer from public.knowledge_review_records where id=p_content_review_record_id;
 if reviewer is distinct from p_actor_principal_id then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
 perform public.fn_require_translation_separation(t.created_by_principal_id,reviewer,null,null);
 if t.translation_version<>p_expected_translation_version or t.translation_status<>'human_review_pending' then raise exception 'TP_TRANSLATION_STATUS_INVALID';end if;
 update public.knowledge_canonical_unit_translations set translation_status='rejected',rejection_reason=p_reason_digest,reviewed_by_principal_id=p_actor_principal_id where id=p_translation_id;
 update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_translation_version=t.translation_version,resulting_primary_translation_status='rejected',committed_at=statement_timestamp() where operation_id=p_operation_id returning * into r;return r;
end $$;

-- State-only operation helper is intentionally inlined through exact wrappers.
create or replace function public.knowledge_prepare_canonical_translation_publication_review(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;
begin
 dg:=public.fn_compute_canonical_translation_operation_digest('translation_publication_review_prepare_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,p_expected_state_version,null,null);
 begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,expected_primary_state_version) values(p_operation_id,'translation_publication_review_prepare_v1',dg,p_translation_id,p_actor_principal_id,p_expected_state_version);
 exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed' and e.operation_kind='translation_publication_review_prepare_v1' and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
 perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_creator_machine',statement_timestamp());
 select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'review_required',p_expected_state_version,null,null,null,null,false);
 update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='review_required',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp() where operation_id=p_operation_id returning * into r;return r;
end $$;

create or replace function public.knowledge_approve_canonical_translation_publication(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer,p_publication_review_record_id uuid
) returns public.knowledge_canonical_translation_operations
language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;t record;reviewer uuid;content_reviewer uuid;canonical_text text;current_fp text;
begin
 dg:=public.fn_compute_canonical_translation_operation_digest('translation_publication_approve_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,p_publication_review_record_id,null,null,p_expected_state_version,null,null);
 begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,publication_review_record_id,expected_primary_state_version) values(p_operation_id,'translation_publication_approve_v1',dg,p_translation_id,p_actor_principal_id,p_publication_review_record_id,p_expected_state_version);
 exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed' and e.operation_kind='translation_publication_approve_v1' and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
 perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_reviewer',statement_timestamp());
 perform public.fn_require_canonical_translation_review(p_publication_review_record_id,p_translation_id,'translation_publication','approved',statement_timestamp());
 select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id;
 if not found then raise exception 'TP_TRANSLATION_NOT_FOUND'; end if;
 select canonical_content into canonical_text from public.fn_lock_translation_target_and_get_content(t.entity_type,t.entity_id,t.field_key);
 select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for key share;
 current_fp:=encode(public.digest(convert_to(btrim(normalize(replace(canonical_text,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256'),'hex');
 if t.translation_status<>'approved' or t.invalidated_at is not null
    or t.canonical_content_fingerprint<>current_fp
 then raise exception 'TP_TRANSLATION_STATUS_INVALID'; end if;
 perform public.fn_require_canonical_translation_review(t.review_record_id,p_translation_id,'translation_content','approved',statement_timestamp());
 select reviewer_principal_id into content_reviewer from public.knowledge_review_records where id=t.review_record_id;
 select reviewer_principal_id into reviewer from public.knowledge_review_records where id=p_publication_review_record_id;
 if reviewer is distinct from p_actor_principal_id then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
 perform public.fn_require_translation_separation(t.created_by_principal_id,content_reviewer,reviewer,null);
 select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'approved',p_expected_state_version,null,null,p_publication_review_record_id,null,false);
 update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='approved',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp() where operation_id=p_operation_id returning * into r;return r;
end $$;

-- Generic state wrapper factory cannot be dynamic; each exact wrapper remains explicit.
create or replace function public.knowledge_mark_canonical_translation_publication_eligible(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;t record;s record;approval record;content_reviewer uuid;publication_reviewer uuid;canonical_text text;current_fp text;
begin dg:=public.fn_compute_canonical_translation_operation_digest('translation_publication_eligible_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,p_expected_state_version,null,null);
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,expected_primary_state_version)values(p_operation_id,'translation_publication_eligible_v1',dg,p_translation_id,p_actor_principal_id,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed' and e.operation_kind='translation_publication_eligible_v1' and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_publication_administrator',statement_timestamp());
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id;
if not found then raise exception 'TP_TRANSLATION_NOT_FOUND';end if;
select canonical_content into canonical_text from public.fn_lock_translation_target_and_get_content(t.entity_type,t.entity_id,t.field_key);
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;
current_fp:=encode(public.digest(convert_to(btrim(normalize(replace(canonical_text,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256'),'hex');
if t.translation_status<>'approved' or t.invalidated_at is not null or t.canonical_content_fingerprint<>current_fp
then raise exception 'TP_TRANSLATION_STATUS_INVALID';end if;
select * into s from public.knowledge_publication_states
where entity_type='canonical_translation' and entity_id=p_translation_id for update;
if not found then raise exception 'TP_LEGACY_PUBLICATION_GRAPH_MISSING';end if;
if s.state_version<>p_expected_state_version then raise exception 'TP_PUBLICATION_STATE_VERSION_CONFLICT';end if;
if s.current_state<>'approved' then raise exception 'TP_PUBLICATION_TRANSITION_INVALID';end if;
select * into approval from public.knowledge_publication_state_transitions
where id=s.current_transition_id and entity_type='canonical_translation'
  and entity_id=p_translation_id and from_state='review_required' and to_state='approved'
  and resulting_state_version=s.state_version and review_record_id is not null;
if not found then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
perform public.fn_require_canonical_translation_review(
  t.review_record_id,p_translation_id,'translation_content','approved',statement_timestamp());
perform public.fn_require_canonical_translation_review(
  approval.review_record_id,p_translation_id,'translation_publication','approved',statement_timestamp());
select reviewer_principal_id into content_reviewer from public.knowledge_review_records where id=t.review_record_id;
select reviewer_principal_id into publication_reviewer from public.knowledge_review_records
where id=approval.review_record_id;
perform public.fn_require_translation_separation(t.created_by_principal_id,content_reviewer,publication_reviewer,p_actor_principal_id);
select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'publication_eligible',p_expected_state_version,null,null,null,null,false);
update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='publication_eligible',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.knowledge_publish_canonical_translation(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;t record;s record;eligibility record;approval record;content_reviewer uuid;publication_reviewer uuid;canonical_text text;current_fp text;
begin dg:=public.fn_compute_canonical_translation_operation_digest('translation_publish_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,p_expected_state_version,null,null);
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,expected_primary_state_version)values(p_operation_id,'translation_publish_v1',dg,p_translation_id,p_actor_principal_id,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed' and e.operation_kind='translation_publish_v1' and e.request_digest=dg and e.actor_principal_id=p_actor_principal_id then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_publication_administrator',statement_timestamp());
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id;
if not found then raise exception 'TP_TRANSLATION_NOT_FOUND';end if;
select canonical_content into canonical_text from public.fn_lock_translation_target_and_get_content(t.entity_type,t.entity_id,t.field_key);
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;
current_fp:=encode(public.digest(convert_to(btrim(normalize(replace(canonical_text,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256'),'hex');
if t.translation_status<>'approved' or t.invalidated_at is not null or t.canonical_content_fingerprint<>current_fp then raise exception 'TP_TRANSLATION_STATUS_INVALID';end if;
select * into s from public.knowledge_publication_states
where entity_type='canonical_translation' and entity_id=p_translation_id for update;
if not found then raise exception 'TP_LEGACY_PUBLICATION_GRAPH_MISSING';end if;
if s.state_version<>p_expected_state_version then raise exception 'TP_PUBLICATION_STATE_VERSION_CONFLICT';end if;
if s.current_state<>'publication_eligible' then raise exception 'TP_PUBLICATION_TRANSITION_INVALID';end if;
select * into eligibility from public.knowledge_publication_state_transitions
where id=s.current_transition_id and entity_type='canonical_translation'
  and entity_id=p_translation_id and from_state='approved' and to_state='publication_eligible'
  and resulting_state_version=s.state_version;
if not found then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
select * into approval from public.knowledge_publication_state_transitions
where entity_type='canonical_translation' and entity_id=p_translation_id
  and from_state='review_required' and to_state='approved'
  and resulting_state_version=eligibility.from_state_version and review_record_id is not null;
if not found then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
perform public.fn_require_canonical_translation_review(
  t.review_record_id,p_translation_id,'translation_content','approved',statement_timestamp());
perform public.fn_require_canonical_translation_review(
  approval.review_record_id,p_translation_id,'translation_publication','approved',statement_timestamp());
select reviewer_principal_id into content_reviewer from public.knowledge_review_records where id=t.review_record_id;
select reviewer_principal_id into publication_reviewer from public.knowledge_review_records
where id=approval.review_record_id;
perform public.fn_require_translation_separation(t.created_by_principal_id,content_reviewer,publication_reviewer,p_actor_principal_id);
select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'published',p_expected_state_version,null,null,null,null,false);update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='published',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.knowledge_suspend_canonical_translation_for_detected_issue(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer,p_reason_code text,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;
begin if p_reason_code not in('stale_source_suspension','conflict_suspension','authority_error_suspension','translation_defect_suspension')then raise exception 'TP_OPERATION_SHAPE_INVALID';end if;
dg:=public.fn_compute_canonical_translation_operation_digest('translation_suspend_routine_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,null,null,null,null,p_expected_state_version,null,p_reason_code);
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest,expected_primary_state_version)values(p_operation_id,'translation_suspend_routine_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed'and e.operation_kind='translation_suspend_routine_v1' and e.actor_principal_id=p_actor_principal_id and e.request_digest=dg then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_creator_machine',statement_timestamp());
select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'suspended',p_expected_state_version,p_reason_code,p_reason_digest,null,null,false);update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='suspended',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.knowledge_emergency_suspend_canonical_translation(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;
begin dg:=public.fn_compute_canonical_translation_operation_digest('translation_suspend_emergency_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,null,null,null,null,p_expected_state_version,null,'emergency_governance_suspension');
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest,expected_primary_state_version)values(p_operation_id,'translation_suspend_emergency_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed'and e.operation_kind='translation_suspend_emergency_v1' and e.actor_principal_id=p_actor_principal_id and e.request_digest=dg then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_emergency_authority',statement_timestamp());select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'suspended',p_expected_state_version,'emergency_governance_suspension',p_reason_digest,null,null,true);update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='suspended',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.knowledge_clear_canonical_translation_emergency(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;
begin dg:=public.fn_compute_canonical_translation_operation_digest('translation_emergency_clearance_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,null,null,null,null,p_expected_state_version,null,'manual_correction');
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest,expected_primary_state_version)values(p_operation_id,'translation_emergency_clearance_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed'and e.operation_kind='translation_emergency_clearance_v1' and e.actor_principal_id=p_actor_principal_id and e.request_digest=dg then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_emergency_authority',statement_timestamp());
select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'review_required',p_expected_state_version,'manual_correction',p_reason_digest,null,null,false);update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='review_required',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.knowledge_reinstate_canonical_translation(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_state_version integer,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;t record;s record;suspension record;cycle_suspension record;lineage_transition record;publication record;eligibility record;approval record;publication_operation record;eligibility_operation record;approval_operation record;handover_operation record;content_reviewer uuid;publication_reviewer uuid;canonical_text text;current_fp text;lineage_version integer;lineage_steps integer:=0;lineage_count bigint;
begin dg:=public.fn_compute_canonical_translation_operation_digest('translation_reinstate_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,null,null,null,null,p_expected_state_version,null,'reinstated_after_suspension');
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest,expected_primary_state_version)values(p_operation_id,'translation_reinstate_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed'and e.operation_kind='translation_reinstate_v1' and e.actor_principal_id=p_actor_principal_id and e.request_digest=dg then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_publication_administrator',statement_timestamp());
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id;
if not found then raise exception 'TP_TRANSLATION_NOT_FOUND';end if;
select canonical_content into canonical_text
from public.fn_lock_translation_target_and_get_content(t.entity_type,t.entity_id,t.field_key);
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;
current_fp:=encode(public.digest(convert_to(
  btrim(normalize(replace(canonical_text,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256'),'hex');
select * into s from public.knowledge_publication_states
where entity_type='canonical_translation' and entity_id=p_translation_id for update;
if not found then raise exception 'TP_LEGACY_PUBLICATION_GRAPH_MISSING';end if;
if s.state_version<>p_expected_state_version then raise exception 'TP_PUBLICATION_STATE_VERSION_CONFLICT';end if;
if s.current_state<>'suspended' then raise exception 'TP_PUBLICATION_TRANSITION_INVALID';end if;
if s.emergency_disabled then raise exception 'TP_PUBLICATION_EMERGENCY_DISABLED';end if;
if t.translation_status<>'approved' or t.invalidated_at is not null
   or t.canonical_content_fingerprint<>current_fp
then raise exception 'TP_TRANSLATION_STATUS_INVALID';end if;
select pt.*,o.operation_kind,o.operation_status into suspension
from public.knowledge_publication_state_transitions pt
left join public.knowledge_canonical_translation_operations o
  on o.operation_id=pt.canonical_translation_operation_id
where pt.id=s.current_transition_id and pt.entity_type='canonical_translation'
  and pt.entity_id=p_translation_id and pt.from_state='published' and pt.to_state='suspended'
  and pt.from_state_version=s.state_version-1 and pt.resulting_state_version=s.state_version
  and not pt.emergency_flag and o.operation_kind='translation_suspend_routine_v1'
  and o.operation_status='committed';
if not found then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
lineage_version:=suspension.from_state_version;
-- The explicit bound is the locked current state version. Every accepted
-- predecessor is contiguous and strictly decreases by one, so all representable
-- ordinary cycles are permitted while malformed history terminates finitely.
loop
  if lineage_steps>=s.state_version or lineage_version<=0
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  lineage_steps:=lineage_steps+1;
  select count(*) into lineage_count
  from public.knowledge_publication_state_transitions pt
  where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
    and pt.resulting_state_version=lineage_version;
  if lineage_count<>1 then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  select pt.*,o.operation_kind,o.operation_status into lineage_transition
  from public.knowledge_publication_state_transitions pt
  left join public.knowledge_canonical_translation_operations o
    on o.operation_id=pt.canonical_translation_operation_id
  where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
    and pt.resulting_state_version=lineage_version;
  if lineage_transition.from_state_version<>lineage_version-1
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  if lineage_transition.from_state='publication_eligible'
     and lineage_transition.to_state='published'
     and not lineage_transition.emergency_flag
     and lineage_transition.operation_status='committed'
  then publication:=lineage_transition;exit;
  end if;
  if lineage_transition.from_state is distinct from 'suspended'
     or lineage_transition.to_state is distinct from 'published'
     or lineage_transition.emergency_flag
     or lineage_transition.operation_kind is distinct from 'translation_reinstate_v1'
     or lineage_transition.operation_status is distinct from 'committed'
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  lineage_version:=lineage_transition.from_state_version;
  if lineage_steps>=s.state_version or lineage_version<=0
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  lineage_steps:=lineage_steps+1;
  select count(*) into lineage_count
  from public.knowledge_publication_state_transitions pt
  where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
    and pt.resulting_state_version=lineage_version;
  if lineage_count<>1 then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  select pt.*,o.operation_kind,o.operation_status into cycle_suspension
  from public.knowledge_publication_state_transitions pt
  left join public.knowledge_canonical_translation_operations o
    on o.operation_id=pt.canonical_translation_operation_id
  where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
    and pt.resulting_state_version=lineage_version;
  if cycle_suspension.from_state is distinct from 'published'
     or cycle_suspension.to_state is distinct from 'suspended'
     or cycle_suspension.from_state_version<>lineage_version-1
     or cycle_suspension.emergency_flag
     or cycle_suspension.operation_kind is distinct from 'translation_suspend_routine_v1'
     or cycle_suspension.operation_status is distinct from 'committed'
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
  lineage_version:=cycle_suspension.from_state_version;
end loop;
select count(*) into lineage_count
from public.knowledge_publication_state_transitions pt
where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
  and pt.resulting_state_version=publication.from_state_version;
if lineage_count<>1 then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
select pt.*,o.operation_kind,o.operation_status into eligibility
from public.knowledge_publication_state_transitions pt
left join public.knowledge_canonical_translation_operations o
  on o.operation_id=pt.canonical_translation_operation_id
where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
  and pt.resulting_state_version=publication.from_state_version;
if eligibility.from_state is distinct from 'approved'
   or eligibility.to_state is distinct from 'publication_eligible'
   or eligibility.from_state_version<>publication.from_state_version-1
then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
select count(*) into lineage_count
from public.knowledge_publication_state_transitions pt
where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
  and pt.resulting_state_version=eligibility.from_state_version;
if lineage_count<>1 then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
select pt.*,o.operation_kind,o.operation_status into approval
from public.knowledge_publication_state_transitions pt
left join public.knowledge_canonical_translation_operations o
  on o.operation_id=pt.canonical_translation_operation_id
where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id
  and pt.resulting_state_version=eligibility.from_state_version;
if approval.from_state is distinct from 'review_required'
   or approval.to_state is distinct from 'approved'
   or approval.from_state_version<>eligibility.from_state_version-1
   or approval.review_record_id is null
then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
if publication.operation_kind='translation_publish_v1' then
  select * into publication_operation
  from public.knowledge_canonical_translation_operations
  where operation_id=publication.canonical_translation_operation_id;
  select * into eligibility_operation
  from public.knowledge_canonical_translation_operations
  where operation_id=eligibility.canonical_translation_operation_id;
  select * into approval_operation
  from public.knowledge_canonical_translation_operations
  where operation_id=approval.canonical_translation_operation_id;
  if publication_operation.operation_kind is distinct from 'translation_publish_v1'
     or publication_operation.operation_status is distinct from 'committed'
     or publication_operation.primary_translation_id is distinct from p_translation_id
     or publication_operation.resulting_primary_transition_id is distinct from publication.id
     or publication_operation.resulting_primary_state is distinct from 'published'
     or publication_operation.resulting_primary_state_version is distinct from publication.resulting_state_version
     or eligibility_operation.operation_kind is distinct from 'translation_publication_eligible_v1'
     or eligibility_operation.operation_status is distinct from 'committed'
     or eligibility_operation.primary_translation_id is distinct from p_translation_id
     or eligibility_operation.resulting_primary_transition_id is distinct from eligibility.id
     or eligibility_operation.resulting_primary_state is distinct from 'publication_eligible'
     or eligibility_operation.resulting_primary_state_version is distinct from eligibility.resulting_state_version
     or approval_operation.operation_kind is distinct from 'translation_publication_approve_v1'
     or approval_operation.operation_status is distinct from 'committed'
     or approval_operation.primary_translation_id is distinct from p_translation_id
     or approval_operation.resulting_primary_transition_id is distinct from approval.id
     or approval_operation.resulting_primary_state is distinct from 'approved'
     or approval_operation.resulting_primary_state_version is distinct from approval.resulting_state_version
     or approval_operation.publication_review_record_id is distinct from approval.review_record_id
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
elsif publication.operation_kind='translation_handover_v1' then
  select * into handover_operation
  from public.knowledge_canonical_translation_operations
  where operation_id=publication.canonical_translation_operation_id;
  if handover_operation.operation_kind is distinct from 'translation_handover_v1'
     or handover_operation.operation_status is distinct from 'committed'
     or handover_operation.replacement_translation_id is distinct from p_translation_id
     or approval.canonical_translation_operation_id is distinct from handover_operation.operation_id
     or eligibility.canonical_translation_operation_id is distinct from handover_operation.operation_id
     or publication.canonical_translation_operation_id is distinct from handover_operation.operation_id
     or approval.operation_kind is distinct from 'translation_handover_v1'
     or eligibility.operation_kind is distinct from 'translation_handover_v1'
     or approval.operation_status is distinct from 'committed'
     or eligibility.operation_status is distinct from 'committed'
     or handover_operation.resulting_replacement_approval_transition_id is distinct from approval.id
     or handover_operation.resulting_replacement_eligibility_transition_id is distinct from eligibility.id
     or handover_operation.resulting_replacement_publication_transition_id is distinct from publication.id
     or handover_operation.resulting_primary_transition_id in (approval.id,eligibility.id,publication.id)
     or handover_operation.resulting_replacement_state is distinct from 'published'
     or handover_operation.resulting_replacement_state_version is distinct from publication.resulting_state_version
     or handover_operation.publication_review_record_id is distinct from approval.review_record_id
     or handover_operation.content_review_record_id is distinct from t.review_record_id
  then raise exception 'TP_REVIEW_RECORD_MISMATCH';end if;
else
  raise exception 'TP_REVIEW_RECORD_MISMATCH';
end if;
perform public.fn_require_canonical_translation_review(
  t.review_record_id,p_translation_id,'translation_content','approved',statement_timestamp());
perform public.fn_require_canonical_translation_review(
  approval.review_record_id,p_translation_id,'translation_publication','approved',statement_timestamp());
select reviewer_principal_id into content_reviewer from public.knowledge_review_records where id=t.review_record_id;
select reviewer_principal_id into publication_reviewer from public.knowledge_review_records
where id=approval.review_record_id;
perform public.fn_require_translation_separation(t.created_by_principal_id,content_reviewer,publication_reviewer,p_actor_principal_id);
select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'published',p_expected_state_version,'reinstated_after_suspension',p_reason_digest,null,null,false);update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_state='published',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.knowledge_withdraw_canonical_translation(
 p_operation_id uuid,p_actor_principal_id uuid,p_translation_id uuid,p_expected_translation_version integer,p_expected_state_version integer,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;x record;t record;content_reviewer uuid;publication_reviewer uuid;
begin dg:=public.fn_compute_canonical_translation_operation_digest('translation_withdraw_v1',p_actor_principal_id,p_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,null,null,p_expected_translation_version,null,p_expected_state_version,null,'withdrawn_reason_required');
begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id,reason_digest,expected_primary_translation_version,expected_primary_state_version)values(p_operation_id,'translation_withdraw_v1',dg,p_translation_id,p_actor_principal_id,p_reason_digest,p_expected_translation_version,p_expected_state_version);exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed'and e.operation_kind='translation_withdraw_v1' and e.actor_principal_id=p_actor_principal_id and e.request_digest=dg then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_publication_administrator',statement_timestamp());
select * into t from public.knowledge_canonical_unit_translations where id=p_translation_id for update;if t.translation_version<>p_expected_translation_version then raise exception 'TP_TRANSLATION_STATUS_INVALID';end if;
select reviewer_principal_id into content_reviewer from public.knowledge_review_records where id=t.review_record_id;
select rr.reviewer_principal_id into publication_reviewer from public.knowledge_publication_state_transitions pt
join public.knowledge_review_records rr on rr.id=pt.review_record_id
where pt.entity_type='canonical_translation' and pt.entity_id=p_translation_id and pt.to_state='approved'
order by pt.resulting_state_version desc limit 1;
perform public.fn_require_translation_separation(t.created_by_principal_id,content_reviewer,publication_reviewer,p_actor_principal_id);
update public.knowledge_canonical_unit_translations set translation_status='withdrawn',withdrawn_at=statement_timestamp()where id=p_translation_id;
select * into x from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_translation_id,'withdrawn',p_expected_state_version,'withdrawn_reason_required',p_reason_digest,null,null,false);
update public.knowledge_canonical_translation_operations set operation_status='committed',resulting_primary_translation_version=t.translation_version,resulting_primary_translation_status='withdrawn',resulting_primary_state='withdrawn',resulting_primary_state_version=x.state_version,resulting_primary_transition_id=x.transition_id,committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;end $$;

create or replace function public.fn_handover_canonical_translation_internal(
 p_operation_id uuid,p_actor_principal_id uuid,p_old_translation_id uuid,p_replacement_translation_id uuid,
 p_expected_old_translation_version integer,p_expected_replacement_translation_version integer,
 p_expected_old_state_version integer,p_expected_replacement_state_version integer,
 p_content_review_record_id uuid,p_publication_review_record_id uuid,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
declare dg text;e public.knowledge_canonical_translation_operations%rowtype;r public.knowledge_canonical_translation_operations%rowtype;o record;n record;os record;ns record;x1 record;x2 record;x3 record;x4 record;
  target_content text; current_fp text; content_reviewer uuid; publication_reviewer uuid;
begin
 dg:=public.fn_compute_canonical_translation_operation_digest('translation_handover_v1',p_actor_principal_id,p_old_translation_id,p_replacement_translation_id,null,null,null,null,null,null,null,null,null,null,null,null,p_reason_digest,null,p_content_review_record_id,p_publication_review_record_id,p_expected_old_translation_version,p_expected_replacement_translation_version,p_expected_old_state_version,p_expected_replacement_state_version,'superseded_by_new_version');
 begin insert into public.knowledge_canonical_translation_operations(operation_id,operation_kind,request_digest,primary_translation_id,replacement_translation_id,actor_principal_id,reason_digest,content_review_record_id,publication_review_record_id,expected_primary_translation_version,expected_replacement_translation_version,expected_primary_state_version,expected_replacement_state_version)
 values(p_operation_id,'translation_handover_v1',dg,p_old_translation_id,p_replacement_translation_id,p_actor_principal_id,p_reason_digest,p_content_review_record_id,p_publication_review_record_id,p_expected_old_translation_version,p_expected_replacement_translation_version,p_expected_old_state_version,p_expected_replacement_state_version);
 exception when unique_violation then select * into e from public.knowledge_canonical_translation_operations where operation_id=p_operation_id;if e.operation_status='committed'and e.operation_kind='translation_handover_v1' and e.actor_principal_id=p_actor_principal_id and e.request_digest=dg then return e;end if;raise exception 'TP_IDEMPOTENCY_CONFLICT';end;
 perform public.fn_require_governed_principal_role(p_actor_principal_id,'translation_publication_administrator',statement_timestamp());
 select * into o from public.knowledge_canonical_unit_translations where id=p_old_translation_id;
 if not found then raise exception 'TP_TRANSLATION_NOT_FOUND'; end if;
 select canonical_content into target_content
   from public.fn_lock_translation_target_and_get_content(o.entity_type,o.entity_id,o.field_key);
 perform 1 from public.knowledge_canonical_unit_translations
   where id in (p_old_translation_id,p_replacement_translation_id) order by id for update;
 select * into o from public.knowledge_canonical_unit_translations where id=p_old_translation_id;
 select * into n from public.knowledge_canonical_unit_translations where id=p_replacement_translation_id;
 if n.id is null then raise exception 'TP_TRANSLATION_NOT_FOUND'; end if;
 perform 1 from public.knowledge_publication_states
   where entity_type='canonical_translation'
     and entity_id in (p_old_translation_id,p_replacement_translation_id)
   order by entity_id for update;
 select * into os from public.knowledge_publication_states
   where entity_type='canonical_translation' and entity_id=p_old_translation_id;
 select * into ns from public.knowledge_publication_states
   where entity_type='canonical_translation' and entity_id=p_replacement_translation_id;
 current_fp:=encode(public.digest(convert_to(
   btrim(normalize(replace(target_content,E'\r\n',E'\n'),NFC)),'UTF8'),'sha256'),'hex');
 if o.translation_version<>p_expected_old_translation_version or n.translation_version<>p_expected_replacement_translation_version
 or o.translation_status<>'approved' or n.translation_status<>'human_review_pending'
 or o.entity_type<>n.entity_type or o.entity_id<>n.entity_id or o.field_key<>n.field_key or o.output_locale<>n.output_locale
 or n.translation_version<>o.translation_version+1
 or o.canonical_content_fingerprint<>n.canonical_content_fingerprint
 or o.canonical_content_fingerprint<>current_fp
 or o.invalidated_at is not null or n.invalidated_at is not null
 or os.current_state<>'published' or os.state_version<>p_expected_old_state_version or os.emergency_disabled
 or ns.current_state<>'review_required' or ns.state_version<>p_expected_replacement_state_version
 or p_expected_replacement_state_version<>2 or ns.emergency_disabled
 then raise exception 'TP_HANDOVER_REPLACEMENT_INCOMPATIBLE';end if;
 perform public.fn_require_canonical_translation_review(p_content_review_record_id,p_replacement_translation_id,'translation_content','approved',statement_timestamp());
 perform public.fn_require_canonical_translation_review(p_publication_review_record_id,p_replacement_translation_id,'translation_publication','approved',statement_timestamp());
 select reviewer_principal_id into content_reviewer from public.knowledge_review_records where id=p_content_review_record_id;
 select reviewer_principal_id into publication_reviewer from public.knowledge_review_records where id=p_publication_review_record_id;
 perform public.fn_require_translation_separation(n.created_by_principal_id,content_reviewer,publication_reviewer,p_actor_principal_id);
 update public.knowledge_canonical_unit_translations set translation_status='superseded',superseded_at=statement_timestamp()where id=p_old_translation_id;
 update public.knowledge_canonical_unit_translations set translation_status='approved',human_reviewed=true,
 uncertainty_preserved=true,warnings_preserved=true,numeric_and_deadline_values_preserved=true,
 review_record_id=p_content_review_record_id,reviewed_by_principal_id=(select reviewer_principal_id from public.knowledge_review_records where id=p_content_review_record_id),verified_at=statement_timestamp()
 where id=p_replacement_translation_id;
 select * into x1 from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_replacement_translation_id,'approved',p_expected_replacement_state_version,null,null,p_publication_review_record_id,null,false);
 select * into x2 from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_replacement_translation_id,'publication_eligible',x1.state_version,null,null,null,null,false);
 select * into x3 from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_replacement_translation_id,'published',x2.state_version,null,null,null,null,false);
 select * into x4 from public.fn_transition_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_old_translation_id,'superseded',p_expected_old_state_version,'superseded_by_new_version',p_reason_digest,null,p_replacement_translation_id,false);
 update public.knowledge_canonical_translation_operations set operation_status='committed',
 resulting_primary_translation_version=o.translation_version,resulting_replacement_translation_version=n.translation_version,
 resulting_primary_translation_status='superseded',resulting_replacement_translation_status='approved',
 resulting_primary_state_version=x4.state_version,resulting_replacement_state_version=x3.state_version,
 resulting_primary_state='superseded',resulting_replacement_state='published',
 resulting_primary_transition_id=x4.transition_id,resulting_replacement_approval_transition_id=x1.transition_id,
 resulting_replacement_eligibility_transition_id=x2.transition_id,resulting_replacement_publication_transition_id=x3.transition_id,
 committed_at=statement_timestamp()where operation_id=p_operation_id returning * into r;return r;
end $$;

create or replace function public.knowledge_handover_canonical_translation(
 p_operation_id uuid,p_actor_principal_id uuid,p_old_translation_id uuid,p_replacement_translation_id uuid,
 p_expected_old_translation_version integer,p_expected_replacement_translation_version integer,
 p_expected_old_state_version integer,p_expected_replacement_state_version integer,
 p_content_review_record_id uuid,p_publication_review_record_id uuid,p_reason_digest text
) returns public.knowledge_canonical_translation_operations language plpgsql security definer set search_path=pg_catalog,pg_temp as $$
begin return public.fn_handover_canonical_translation_internal(p_operation_id,p_actor_principal_id,p_old_translation_id,p_replacement_translation_id,p_expected_old_translation_version,p_expected_replacement_translation_version,p_expected_old_state_version,p_expected_replacement_state_version,p_content_review_record_id,p_publication_review_record_id,p_reason_digest);end $$;

-- Generic wrappers retain their signatures and nontranslation semantics, with one early rejection.
create or replace function public.knowledge_advance_publication_evidence_status(
 p_entity_type text,p_entity_id uuid,p_to_state text,p_expected_state_version integer,
 p_reason_text text,p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if p_to_state not in('evidence_incomplete','review_required') then
raise exception 'operation_scope_violation: knowledge_advance_publication_evidence_status may only target evidence_incomplete or review_required';end if;
if s is null or not ((s='draft' and p_to_state in('evidence_incomplete','review_required')) or (s='evidence_incomplete' and p_to_state='review_required'))
then raise exception 'operation_scope_violation: % -> % is outside the evidence-workflow operation scope',s,p_to_state;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,p_to_state,p_expected_state_version,null,p_reason_text,'automated_ingestion_system',p_actor_audit_identifier,null,null,null,false,p_idempotency_key);end $$;
create or replace function public.knowledge_record_publication_review_decision(
 p_entity_type text,p_entity_id uuid,p_to_state text,p_expected_state_version integer,
 p_review_record_id uuid,p_reason_text text,p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if p_to_state not in('approved','evidence_incomplete') then
raise exception 'operation_scope_violation: knowledge_record_publication_review_decision may only target approved or evidence_incomplete';end if;
if s is distinct from 'review_required' then raise exception 'operation_scope_violation: % -> % is outside the review-decision operation scope',s,p_to_state;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,p_to_state,p_expected_state_version,null,p_reason_text,'authorized_reviewer',p_actor_audit_identifier,p_review_record_id,null,null,false,p_idempotency_key);end $$;
create or replace function public.knowledge_recall_publication_to_review(
 p_entity_type text,p_entity_id uuid,p_expected_state_version integer,p_reason_text text,
 p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if s not in('approved','publication_eligible','suspended') then raise exception 'operation_scope_violation: % -> review_required is outside the recall-to-review operation scope',s;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,'review_required',p_expected_state_version,null,p_reason_text,'authorized_reviewer',p_actor_audit_identifier,null,null,null,false,p_idempotency_key);end $$;
create or replace function public.knowledge_advance_publication_lifecycle(
 p_entity_type text,p_entity_id uuid,p_decision text,p_expected_state_version integer,
 p_reason_text text,p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare st text;s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if p_decision='mark_eligible' then st:='publication_eligible';
if s is distinct from 'approved' then raise exception 'operation_scope_violation: % -> publication_eligible is outside the mark_eligible operation scope',s;end if;
elsif p_decision='publish' then st:='published';
if s is distinct from 'publication_eligible' then raise exception 'operation_scope_violation: % -> published is outside the publish operation scope',s;end if;
elsif p_decision='reinstate' then st:='published';
if s is distinct from 'suspended' then raise exception 'operation_scope_violation: % -> published is outside the reinstate operation scope',s;end if;
else raise exception 'operation_scope_violation: unrecognized decision % for knowledge_advance_publication_lifecycle',p_decision;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,st,p_expected_state_version,null,p_reason_text,'publication_administrator',p_actor_audit_identifier,null,null,null,false,p_idempotency_key);end $$;
create or replace function public.knowledge_supersede_publication_subject(
 p_entity_type text,p_entity_id uuid,p_expected_state_version integer,p_reason_text text,
 p_replacement_entity_type text,p_replacement_entity_id uuid,p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if s is distinct from 'published' then raise exception 'operation_scope_violation: % -> superseded is outside the supersession operation scope',s;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,'superseded',p_expected_state_version,'superseded_by_new_version',p_reason_text,'publication_administrator',p_actor_audit_identifier,null,p_replacement_entity_type,p_replacement_entity_id,false,p_idempotency_key);end $$;
create or replace function public.knowledge_withdraw_publication_subject(
 p_entity_type text,p_entity_id uuid,p_expected_state_version integer,p_reason_text text,
 p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if s not in('draft','evidence_incomplete','review_required','approved','publication_eligible','published') then raise exception 'operation_scope_violation: % -> withdrawn is outside the withdrawal operation scope',s;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,'withdrawn',p_expected_state_version,'withdrawn_reason_required',p_reason_text,'publication_administrator',p_actor_audit_identifier,null,null,null,false,p_idempotency_key);end $$;
create or replace function public.knowledge_suspend_publication_for_detected_issue(
 p_entity_type text,p_entity_id uuid,p_expected_state_version integer,p_reason_code text,
 p_reason_text text,p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
if p_reason_code not in('stale_source_suspension','conflict_suspension','authority_error_suspension','translation_defect_suspension') then raise exception 'operation_scope_violation: % is not a routine detected-issue suspension reason',p_reason_code;end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if s is distinct from 'published' then raise exception 'operation_scope_violation: % -> suspended is outside the detected-issue suspension operation scope',s;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,'suspended',p_expected_state_version,p_reason_code,p_reason_text,'automated_ingestion_system',p_actor_audit_identifier,null,null,null,false,p_idempotency_key);end $$;
create or replace function public.knowledge_emergency_suspend_publication_subject(
 p_entity_type text,p_entity_id uuid,p_expected_state_version integer,p_reason_text text,
 p_actor_audit_identifier text,p_idempotency_key text)
returns table(transition_id uuid,current_state text,state_version integer) language plpgsql security definer set search_path=pg_catalog,public as $$
declare s text;begin if p_entity_type='canonical_translation' then raise exception 'TP_CANONICAL_WRAPPER_REQUIRED';end if;
if p_reason_text is null or length(p_reason_text)=0 then raise exception 'missing_reason: emergency suspension requires a reason';end if;
select ps.current_state into s from public.knowledge_publication_states ps where ps.entity_type=p_entity_type and ps.entity_id=p_entity_id;
if s is distinct from 'published' then raise exception 'operation_scope_violation: % -> suspended is outside the emergency suspension operation scope',s;end if;
return query select * from public.knowledge_transition_publication_state(p_entity_type,p_entity_id,'suspended',p_expected_state_version,'emergency_governance_suspension',p_reason_text,'emergency_suspension_authority',p_actor_audit_identifier,null,null,null,true,p_idempotency_key);end $$;

-- Triggers (twelve).
drop trigger if exists trg_governed_principals_validate_write on public.knowledge_governed_principals;
create trigger trg_governed_principals_validate_write before update on public.knowledge_governed_principals
for each row execute function public.fn_governed_principals_validate_write();
drop trigger if exists trg_governed_role_assignments_validate_write on public.knowledge_governed_principal_role_assignments;
create trigger trg_governed_role_assignments_validate_write before update on public.knowledge_governed_principal_role_assignments
for each row execute function public.fn_governed_role_assignments_validate_write();
drop trigger if exists trg_governed_authorization_audit_append_only on public.knowledge_governed_authorization_audit;
create trigger trg_governed_authorization_audit_append_only before update or delete on public.knowledge_governed_authorization_audit
for each row execute function public.fn_governed_authorization_audit_append_only();
drop trigger if exists trg_10_canonical_translation_operations_guard on public.knowledge_canonical_translation_operations;
create trigger trg_10_canonical_translation_operations_guard before insert or update or delete on public.knowledge_canonical_translation_operations
for each row execute function public.fn_canonical_translation_operations_guard();
drop trigger if exists trg_90_canonical_translation_operations_require_committed on public.knowledge_canonical_translation_operations;
create constraint trigger trg_90_canonical_translation_operations_require_committed after insert or update on public.knowledge_canonical_translation_operations
deferrable initially deferred for each row execute function public.fn_canonical_translation_operations_require_committed();
drop trigger if exists trg_require_new_translation_publication_graph on public.knowledge_canonical_unit_translations;
create constraint trigger trg_require_new_translation_publication_graph after insert on public.knowledge_canonical_unit_translations
deferrable initially deferred for each row execute function public.fn_require_new_translation_publication_graph();
drop trigger if exists trg_canonical_translation_review_records_validate on public.knowledge_review_records;
create trigger trg_canonical_translation_review_records_validate before insert on public.knowledge_review_records
for each row execute function public.fn_canonical_translation_review_records_validate();
drop trigger if exists trg_canonical_translation_review_records_append_only on public.knowledge_review_records;
create trigger trg_canonical_translation_review_records_append_only before update or delete on public.knowledge_review_records
for each row execute function public.fn_canonical_translation_review_records_append_only();
drop trigger if exists trg_canonical_translation_review_operation_binding_require_committed on public.knowledge_review_records;
create constraint trigger trg_canonical_translation_review_operation_binding_require_committed after insert on public.knowledge_review_records
deferrable initially deferred for each row execute function public.fn_canonical_translation_review_operation_binding_require_committed();
drop trigger if exists trg_translation_content_review_binding_validate on public.knowledge_canonical_unit_translations;
create trigger trg_translation_content_review_binding_validate before insert or update on public.knowledge_canonical_unit_translations
for each row execute function public.fn_translation_content_review_binding_validate();
drop trigger if exists trg_translation_publication_review_binding_validate on public.knowledge_publication_state_transitions;
create trigger trg_translation_publication_review_binding_validate before insert on public.knowledge_publication_state_transitions
for each row execute function public.fn_translation_publication_review_binding_validate();
drop trigger if exists trg_canonical_translation_transition_operation_binding_require_committed on public.knowledge_publication_state_transitions;
create constraint trigger trg_canonical_translation_transition_operation_binding_require_committed after insert on public.knowledge_publication_state_transitions
deferrable initially deferred for each row execute function public.fn_canonical_translation_transition_operation_binding_require_committed();

alter table public.knowledge_governed_principals enable row level security;
alter table public.knowledge_governed_principal_role_assignments enable row level security;
alter table public.knowledge_governed_authorization_audit enable row level security;
alter table public.knowledge_canonical_translation_operations enable row level security;

revoke all on table public.knowledge_canonical_unit_translations,public.knowledge_publication_states,
  public.knowledge_publication_state_transitions,public.knowledge_review_records,
  public.knowledge_governed_principals,public.knowledge_governed_principal_role_assignments,
  public.knowledge_governed_authorization_audit,public.knowledge_canonical_translation_operations
from public,anon,authenticated,service_role;

revoke all on all functions in schema public from public,anon,authenticated;

revoke all on function
 public.knowledge_bootstrap_publication_subject(text,uuid,text,text),
 public.knowledge_create_machine_translation_candidate(text,uuid,text,text,text,text,text,text,text),
 public.knowledge_create_human_translation_candidate(text,uuid,text,text,text,text,text),
 public.knowledge_submit_translation_for_review(uuid,text),
 public.knowledge_approve_translation(uuid,text,uuid),
 public.knowledge_reject_translation(uuid,text,text),
 public.knowledge_withdraw_translation(uuid,text,text)
from service_role;

revoke all on function
 public.knowledge_transition_publication_state(text,uuid,text,integer,text,text,text,text,uuid,text,uuid,boolean,text),
 public.fn_create_translation_candidate_core(text,uuid,text,text,text,boolean,text,text,text,text,text),
 public.knowledge_invalidate_translation_for_canonical_change(uuid)
from service_role;

revoke all on function
 public.knowledge_advance_publication_evidence_status(text,uuid,text,integer,text,text,text),
 public.knowledge_record_publication_review_decision(text,uuid,text,integer,uuid,text,text,text),
 public.knowledge_recall_publication_to_review(text,uuid,integer,text,text,text),
 public.knowledge_advance_publication_lifecycle(text,uuid,text,integer,text,text,text),
 public.knowledge_supersede_publication_subject(text,uuid,integer,text,text,uuid,text,text),
 public.knowledge_withdraw_publication_subject(text,uuid,integer,text,text,text),
 public.knowledge_suspend_publication_for_detected_issue(text,uuid,integer,text,text,text,text),
 public.knowledge_emergency_suspend_publication_subject(text,uuid,integer,text,text,text)
from public,anon,authenticated;

grant execute on function
 public.knowledge_advance_publication_evidence_status(text,uuid,text,integer,text,text,text),
 public.knowledge_record_publication_review_decision(text,uuid,text,integer,uuid,text,text,text),
 public.knowledge_recall_publication_to_review(text,uuid,integer,text,text,text),
 public.knowledge_advance_publication_lifecycle(text,uuid,text,integer,text,text,text),
 public.knowledge_supersede_publication_subject(text,uuid,integer,text,text,uuid,text,text),
 public.knowledge_withdraw_publication_subject(text,uuid,integer,text,text,text),
 public.knowledge_suspend_publication_for_detected_issue(text,uuid,integer,text,text,text,text),
 public.knowledge_emergency_suspend_publication_subject(text,uuid,integer,text,text,text)
to service_role;
