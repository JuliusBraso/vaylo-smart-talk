-- PHASE 9R: Official source registry and handling-mode contract.
-- Additive only. No source data, source content, retrieval, extraction or publication occurs here.

-- =============================================================================
-- BOUNDED GOVERNANCE DOMAINS (15)
-- =============================================================================

create type public.knowledge_handling_mode as enum (
  'STORE_CANONICALLY',
  'FETCH_LIVE',
  'CACHE_AND_REVALIDATE',
  'MANUAL_REVIEW_REQUIRED',
  'DO_NOT_ANSWER_WITHOUT_CONTEXT'
);

create type public.knowledge_source_class as enum (
  'FEDERAL_LAW',
  'FEDERAL_REGULATION',
  'FEDERAL_ADMINISTRATIVE_GUIDANCE',
  'EU_LAW',
  'EU_OFFICIAL_GUIDANCE',
  'FEDERAL_SERVICE_PORTAL',
  'LAND_SERVICE_PORTAL',
  'MUNICIPALITY_SERVICE_PORTAL',
  'AUTHORITY_PORTAL',
  'OFFICIAL_FORM',
  'OFFICIAL_ONLINE_SERVICE',
  'OFFICIAL_DATASET',
  'COMMERCIAL_GUIDE',
  'BLOG',
  'FORUM',
  'SEARCH_RESULT_SNIPPET',
  'AI_GENERATED_TEXT'
);

create type public.knowledge_source_evidence_eligibility as enum (
  'PUBLICATION_EVIDENCE_ELIGIBLE',
  'DISCOVERY_ONLY'
);

create type public.knowledge_authority_level as enum (
  'EU',
  'FEDERAL',
  'LAND',
  'MUNICIPALITY',
  'SPECIFIC_AUTHORITY',
  'UNRESOLVED'
);

create type public.knowledge_source_authorization_state as enum (
  'DRAFT',
  'PENDING_TERMS_REVIEW',
  'PENDING_AUTHORITY_VERIFICATION',
  'AUTHORIZED',
  'SUSPENDED',
  'REJECTED',
  'RETIRED'
);

create type public.knowledge_access_review_status as enum (
  'NOT_REVIEWED',
  'ALLOWED',
  'RESTRICTED',
  'PROHIBITED',
  'UNKNOWN'
);

create type public.knowledge_source_active_status as enum (
  'INACTIVE',
  'ACTIVE',
  'SUSPENDED',
  'RETIRED'
);

create type public.knowledge_source_trust_status as enum (
  'UNVERIFIED',
  'VERIFIED',
  'REVIEW_REQUIRED',
  'SUSPENDED'
);

create type public.knowledge_freshness_class as enum (
  'REAL_TIME',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'EVENT_DRIVEN',
  'LEGAL_CHANGE_MONITORED',
  'MANUAL_REVIEW_CYCLE'
);

create type public.knowledge_stale_behavior as enum (
  'ALLOW_WITH_STALE_WARNING',
  'REVALIDATE_BEFORE_USE',
  'DO_NOT_USE_STALE'
);

create type public.knowledge_retrieval_method as enum (
  'HTML_DOCUMENT',
  'PDF_DOCUMENT',
  'API_JSON',
  'MANUAL_BROWSER_INSPECTION'
);

create type public.knowledge_source_change_classification as enum (
  'UNCHANGED',
  'CONTENT_CHANGE',
  'LEGAL_OR_POLICY_CHANGE',
  'URL_CHANGE',
  'SOURCE_CLASS_CHANGE',
  'EVIDENCE_ELIGIBILITY_CHANGE',
  'AUTHORITY_ASSIGNMENT_CHANGE',
  'JURISDICTION_CHANGE',
  'TERMS_REVIEW_CHANGE',
  'ROBOTS_REVIEW_CHANGE',
  'HANDLING_POLICY_CHANGE',
  'TRUST_STATUS_CHANGE',
  'ACTIVE_STATUS_CHANGE',
  'METADATA_CHANGE'
);

create type public.knowledge_acquisition_result as enum (
  'SUCCESS',
  'NOT_MODIFIED',
  'FAILED',
  'DENIED'
);

create type public.knowledge_information_class as enum (
  'LEGAL_BASELINE',
  'PROCESS_IDENTITY',
  'AUTHORITY_COMPETENCE',
  'ELIGIBILITY',
  'REQUIRED_EVIDENCE',
  'DEADLINE',
  'FEE',
  'SANCTION',
  'FORM_URL',
  'ONLINE_SERVICE_URL',
  'OPENING_HOURS',
  'APPOINTMENT_AVAILABILITY',
  'CONTACT_DETAILS',
  'LOCAL_PROCESS_VARIANT'
);

create type public.knowledge_required_context_key as enum (
  'COUNTRY',
  'BUNDESLAND',
  'MUNICIPALITY',
  'PROCESS_VARIANT',
  'EVENT_DATE',
  'RESIDENCE_STATE',
  'WORK_STATE',
  'PROFESSION',
  'BUSINESS_ESTABLISHMENT_STATE',
  'MAIN_OR_SECONDARY_RESIDENCE'
);

-- =============================================================================
-- FORWARD EXTENSIONS OF THE THREE APPROVED 032 TABLES
-- =============================================================================
-- Legacy rows remain DRAFT, INACTIVE, UNVERIFIED and DISCOVERY_ONLY. The
-- migration deliberately does not infer authorization or evidence eligibility.

alter table public.knowledge_sources
  add column normalized_canonical_url text,
  add column normalized_origin text,
  add column source_class public.knowledge_source_class,
  add column evidence_eligibility public.knowledge_source_evidence_eligibility
    not null default 'DISCOVERY_ONLY',
  add column issuing_authority_id uuid,
  add column authority_level public.knowledge_authority_level,
  add column process_scope text[] not null default '{}',
  add column retrieval_method public.knowledge_retrieval_method,
  add column terms_or_license_review_status public.knowledge_access_review_status
    not null default 'NOT_REVIEWED',
  add column robots_review_status public.knowledge_access_review_status
    not null default 'NOT_REVIEWED',
  add column first_verified_at timestamptz,
  add column last_verified_at timestamptz,
  add column active_status public.knowledge_source_active_status
    not null default 'INACTIVE',
  add column trust_status public.knowledge_source_trust_status
    not null default 'UNVERIFIED',
  add column authorization_state public.knowledge_source_authorization_state
    not null default 'DRAFT',
  add column authorization_state_version integer not null default 1,
  add column default_handling_mode public.knowledge_handling_mode
    not null default 'MANUAL_REVIEW_REQUIRED',
  add column freshness_class public.knowledge_freshness_class
    not null default 'MANUAL_REVIEW_CYCLE',
  add column stale_behavior public.knowledge_stale_behavior
    not null default 'REVALIDATE_BEFORE_USE',
  add column registration_idempotency_key text,
  add column revalidation_due_at timestamptz,
  add column updated_at timestamptz not null default now(),
  add constraint sources_authority_fk
    foreign key (issuing_authority_id)
    references public.knowledge_authorities (id) on delete restrict,
  add constraint sources_authorized_fields_complete check (
    (
      normalized_canonical_url is null
      and normalized_origin is null
    )
    or (
      canonical_url is not null
      and length(canonical_url) between 8 and 4096
      and normalized_canonical_url is not null
      and length(normalized_canonical_url) between 8 and 4096
      and normalized_canonical_url ~ '^https?://[^[:space:]#]+$'
      and position('#' in normalized_canonical_url) = 0
      and normalized_origin is not null
      and length(normalized_origin) between 8 and 512
      and normalized_origin ~ '^https?://[^/:[:space:]#]+(:[0-9]{1,5})?$'
      and normalized_origin = lower(normalized_origin)
    )
  )
  not valid,
  add constraint sources_discovery_class_ineligible check (
    source_class is null
    or source_class not in (
      'COMMERCIAL_GUIDE',
      'BLOG',
      'FORUM',
      'SEARCH_RESULT_SNIPPET',
      'AI_GENERATED_TEXT'
    )
    or evidence_eligibility = 'DISCOVERY_ONLY'
  ),
  add constraint sources_municipality_requires_scope check (
    source_class is distinct from 'MUNICIPALITY_SERVICE_PORTAL'
    or (
      authority_level = 'MUNICIPALITY'
      and territorial_scope_id is not null
    )
  ),
  add constraint sources_authorization_version_positive check (
    authorization_state_version > 0
    and (
      authorization_state <> 'AUTHORIZED'
      or (
        normalized_canonical_url is not null
        and normalized_origin is not null
        and source_class is not null
        and authority_level is not null
        and retrieval_method is not null
        and terms_or_license_review_status = 'ALLOWED'
        and robots_review_status = 'ALLOWED'
        and last_verified_at is not null
        and active_status = 'ACTIVE'
        and trust_status = 'VERIFIED'
      )
    )
  );

alter table public.knowledge_source_versions
  add column acquisition_attempt_id uuid,
  add column normalized_content_hash text,
  add column parser_version text,
  add column change_classification public.knowledge_source_change_classification,
  add constraint source_versions_normalized_hash_length check (
    normalized_content_hash is null
    or normalized_content_hash ~ '^[0-9a-f]{64}$'
  );

alter table public.knowledge_retrieval_metadata
  add column source_authorization_filter_required boolean not null default true,
  add column handling_policy_filter_required boolean not null default true,
  add column stale_policy_filter_required boolean not null default true;

-- =============================================================================
-- FOUR FIRST-SLICE TABLES
-- =============================================================================

create table public.knowledge_source_authorization_transitions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null,
  from_state public.knowledge_source_authorization_state,
  to_state public.knowledge_source_authorization_state not null,
  operation text not null,
  operation_actor_class text not null,
  actor_audit_identifier text not null,
  reason text not null,
  previous_state_version integer not null,
  resulting_state_version integer not null,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  constraint authorization_transition_source_fk
    foreign key (source_id)
    references public.knowledge_sources (id) on delete restrict,
  constraint authorization_transition_version_coupling check (
    previous_state_version >= 0
    and resulting_state_version = previous_state_version + 1
  ),
  constraint authorization_transition_state_change check (
    (from_state is null and to_state = 'DRAFT')
    or from_state is distinct from to_state
  ),
  constraint authorization_transition_idempotency_nonempty check (
    length(btrim(idempotency_key)) between 1 and 200
    and length(operation) between 1 and 100
    and length(operation_actor_class) between 1 and 100
    and length(actor_audit_identifier) between 1 and 200
    and length(reason) between 1 and 2000
  )
);

create table public.knowledge_source_registry_history (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null,
  change_classification public.knowledge_source_change_classification not null,
  operation text not null,
  operation_actor_class text not null,
  actor_audit_identifier text not null,
  reason text not null,
  old_value jsonb,
  new_value jsonb,
  idempotency_key text not null,
  resulting_version integer not null,
  created_at timestamptz not null default now(),
  constraint registry_history_source_fk
    foreign key (source_id)
    references public.knowledge_sources (id) on delete restrict,
  constraint registry_history_resulting_version_positive check (
    resulting_version > 0
    and length(operation) between 1 and 100
    and length(operation_actor_class) between 1 and 100
    and length(actor_audit_identifier) between 1 and 200
    and length(reason) between 1 and 2000
    and length(btrim(idempotency_key)) between 1 and 200
  )
);

create table public.knowledge_source_handling_policies (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null,
  information_class public.knowledge_information_class not null,
  process_scope text not null default '',
  handling_mode public.knowledge_handling_mode not null,
  freshness_class public.knowledge_freshness_class not null,
  stale_behavior public.knowledge_stale_behavior not null,
  required_context_keys public.knowledge_required_context_key[] not null default '{}',
  risk_class text not null,
  state_version integer not null default 1,
  revalidation_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint handling_policy_source_fk
    foreign key (source_id)
    references public.knowledge_sources (id) on delete restrict,
  constraint handling_policy_scope_unique
    unique (source_id, information_class, process_scope),
  constraint handling_policy_context_required check (
    handling_mode <> 'DO_NOT_ANSWER_WITHOUT_CONTEXT'
    or cardinality(required_context_keys) > 0
  ),
  constraint handling_policy_high_risk_no_stale check (
    risk_class in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    and state_version > 0
    and (
      risk_class not in ('HIGH', 'CRITICAL')
      or stale_behavior = 'DO_NOT_USE_STALE'
    )
  )
);

create table public.knowledge_source_acquisition_attempts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null,
  attempted_at timestamptz not null default now(),
  retrieval_method public.knowledge_retrieval_method not null,
  retrieval_result public.knowledge_acquisition_result not null,
  http_status integer,
  content_type text,
  content_length bigint,
  etag text,
  last_modified timestamptz,
  content_hash text,
  normalized_content_hash text,
  parser_version text,
  raw_content_retention_policy text not null default 'METADATA_ONLY',
  failure_code text,
  retryable boolean not null default false,
  operation_actor_class text not null,
  actor_audit_identifier text not null,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  constraint acquisition_attempt_source_fk
    foreign key (source_id)
    references public.knowledge_sources (id) on delete restrict,
  constraint acquisition_attempt_content_length_nonnegative check (
    content_length is null or content_length >= 0
  ),
  constraint acquisition_attempt_http_status_range check (
    http_status is null or http_status between 100 and 599
  ),
  constraint acquisition_attempt_success_metadata check (
    raw_content_retention_policy = 'METADATA_ONLY'
    and length(actor_audit_identifier) between 1 and 200
    and length(operation_actor_class) between 1 and 100
    and (content_type is null or length(content_type) between 1 and 255)
    and (etag is null or length(etag) <= 1024)
    and (parser_version is null or length(parser_version) <= 200)
    and (failure_code is null or length(failure_code) <= 200)
    and (content_hash is null or content_hash ~ '^[0-9a-f]{64}$')
    and (normalized_content_hash is null or normalized_content_hash ~ '^[0-9a-f]{64}$')
    and (
      retrieval_result not in ('SUCCESS', 'NOT_MODIFIED')
      or (
        http_status between 200 and 399
        and failure_code is null
      )
    )
    and (
      retrieval_result not in ('FAILED', 'DENIED')
      or failure_code is not null
    )
  ),
  constraint acquisition_attempt_idempotency_nonempty check (
    length(btrim(idempotency_key)) between 1 and 200
  )
);

alter table public.knowledge_source_versions
  add constraint source_versions_acquisition_attempt_fk
    foreign key (acquisition_attempt_id)
    references public.knowledge_source_acquisition_attempts (id) on delete restrict;

-- =============================================================================
-- SIXTEEN PLANNED INDEX INTENTIONS
-- =============================================================================

create unique index ux_sources_normalized_canonical_url
  on public.knowledge_sources (normalized_canonical_url)
  where normalized_canonical_url is not null;
create index ix_sources_normalized_origin
  on public.knowledge_sources (normalized_origin);
create index ix_sources_source_class
  on public.knowledge_sources (source_class);
create index ix_sources_authorization_state
  on public.knowledge_sources (authorization_state);
create index ix_sources_evidence_eligibility
  on public.knowledge_sources (evidence_eligibility);
create index ix_sources_revalidation_due
  on public.knowledge_sources (revalidation_due_at)
  where authorization_state = 'AUTHORIZED';

create unique index ux_source_authorization_transition_version
  on public.knowledge_source_authorization_transitions (source_id, resulting_state_version);
create unique index ux_source_authorization_transition_idempotency
  on public.knowledge_source_authorization_transitions (operation, idempotency_key);
create index ix_source_authorization_transition_source_created
  on public.knowledge_source_authorization_transitions (source_id, created_at desc);

create unique index ix_registry_history_source_created
  on public.knowledge_source_registry_history (operation, idempotency_key);

create unique index ux_handling_policy_scope
  on public.knowledge_source_handling_policies (source_id, information_class, process_scope, state_version);
create index ix_handling_policy_revalidation
  on public.knowledge_source_handling_policies (revalidation_due_at)
  where revalidation_due_at is not null;
create index ix_handling_policy_mode
  on public.knowledge_source_handling_policies (handling_mode);

create unique index ux_acquisition_attempt_idempotency
  on public.knowledge_source_acquisition_attempts (idempotency_key);
create index ix_acquisition_attempt_source_retrieved
  on public.knowledge_source_acquisition_attempts (source_id, attempted_at desc);
create index ix_source_versions_acquisition_attempt
  on public.knowledge_source_versions (acquisition_attempt_id)
  where acquisition_attempt_id is not null;

-- =============================================================================
-- TWO APPEND-ONLY TRIGGERS
-- =============================================================================
-- Migration 033's trigger function is generic in behavior (it always rejects
-- UPDATE/DELETE and reads only OLD/NEW.id). Reusing it preserves the exact 9Q
-- function inventory; its historical function name does not grant an API.

create trigger trg_source_authorization_transitions_append_only
  before update or delete on public.knowledge_source_authorization_transitions
  for each row execute function public.fn_publication_state_transitions_append_only();

create trigger trg_source_registry_history_append_only
  before update or delete on public.knowledge_source_registry_history
  for each row execute function public.fn_publication_state_transitions_append_only();

-- =============================================================================
-- ONE REPLACED FUNCTION: extend locked source-version identity protection
-- =============================================================================

create or replace function public.knowledge_source_versions_protect_locked_content()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if old.locked_at is not null then
    if new.content_hash is distinct from old.content_hash
       or new.source_id is distinct from old.source_id
       or new.version_sequence is distinct from old.version_sequence
       or new.raw_content_location is distinct from old.raw_content_location
       or new.normalized_content_location is distinct from old.normalized_content_location
       or new.acquisition_attempt_id is distinct from old.acquisition_attempt_id
       or new.normalized_content_hash is distinct from old.normalized_content_hash
       or new.parser_version is distinct from old.parser_version
       or new.change_classification is distinct from old.change_classification
       or new.immutable is distinct from old.immutable
       or new.locked_at is distinct from old.locked_at
    then
      raise exception 'knowledge_source_versions: locked authoritative content cannot be mutated (id=%)', old.id
        using errcode = '55000';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.knowledge_source_versions_protect_locked_content() from public, anon, authenticated, service_role;

-- =============================================================================
-- INTERNAL AUTHORIZATION TRANSITION ENGINE (UNGRANTABLE)
-- =============================================================================

create function public.knowledge_transition_source_authorization_internal(
  p_source_id uuid,
  p_expected_version integer,
  p_to_state public.knowledge_source_authorization_state,
  p_operation text,
  p_operation_actor_class text,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer,
  transition_id uuid
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_existing public.knowledge_source_authorization_transitions%rowtype;
  v_transition_id uuid;
  v_allowed boolean;
begin
  if p_source_id is null
     or p_expected_version is null
     or p_to_state is null
     or p_operation is null
     or p_operation_actor_class is null
     or p_actor_audit_identifier is null
     or p_reason is null
     or p_idempotency_key is null
     or length(btrim(p_operation)) not between 1 and 100
     or length(btrim(p_operation_actor_class)) not between 1 and 100
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_reason)) not between 1 and 2000
     or length(btrim(p_idempotency_key)) not between 1 and 200
  then
    raise exception 'invalid source authorization transition input'
      using errcode = '22023';
  end if;

  select ksat.*
    into v_existing
    from public.knowledge_source_authorization_transitions as ksat
   where ksat.operation = p_operation
     and ksat.idempotency_key = p_idempotency_key;

  if found then
    if v_existing.source_id <> p_source_id
       or v_existing.to_state <> p_to_state
       or v_existing.operation_actor_class <> p_operation_actor_class
       or v_existing.actor_audit_identifier <> p_actor_audit_identifier
       or v_existing.reason <> p_reason
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT'
        using errcode = '23505';
    end if;
    return query
      select v_existing.source_id,
             v_existing.to_state,
             v_existing.resulting_state_version,
             v_existing.id;
    return;
  end if;

  select ks.*
    into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id
   for update;

  if not found then
    raise exception 'source not found' using errcode = 'P0002';
  end if;
  if v_source.authorization_state_version <> p_expected_version then
    raise exception 'SOURCE_VERSION_CONFLICT'
      using errcode = '40001';
  end if;

  v_allowed := (v_source.authorization_state, p_to_state) in (
    ('DRAFT', 'PENDING_TERMS_REVIEW'),
    ('DRAFT', 'REJECTED'),
    ('PENDING_TERMS_REVIEW', 'PENDING_AUTHORITY_VERIFICATION'),
    ('PENDING_TERMS_REVIEW', 'REJECTED'),
    ('PENDING_AUTHORITY_VERIFICATION', 'AUTHORIZED'),
    ('PENDING_AUTHORITY_VERIFICATION', 'REJECTED'),
    ('AUTHORIZED', 'SUSPENDED'),
    ('AUTHORIZED', 'RETIRED'),
    ('SUSPENDED', 'AUTHORIZED'),
    ('SUSPENDED', 'RETIRED'),
    ('REJECTED', 'RETIRED')
  );
  if not v_allowed then
    raise exception 'SOURCE_STATE_TRANSITION_INVALID: % -> %',
      v_source.authorization_state, p_to_state
      using errcode = '22023';
  end if;

  if p_to_state = 'AUTHORIZED' then
    if v_source.terms_or_license_review_status <> 'ALLOWED'
       or v_source.robots_review_status <> 'ALLOWED'
       or v_source.last_verified_at is null
       or v_source.authority_level is null
       or v_source.normalized_canonical_url is null
       or v_source.normalized_origin is null
       or v_source.source_class is null
       or v_source.retrieval_method is null
       or (
         v_source.evidence_eligibility = 'PUBLICATION_EVIDENCE_ELIGIBLE'
         and (
           v_source.official_domain_verification_status <> 'verified'
           or not exists (
             select 1
               from public.knowledge_publishers as kp
              where kp.id = v_source.publisher_id
                and kp.official_status = true
           )
         )
       )
    then
      raise exception 'source authorization prerequisites are incomplete'
        using errcode = '23514';
    end if;
  end if;

  v_transition_id := gen_random_uuid();

  update public.knowledge_sources as ks
     set authorization_state = p_to_state,
         authorization_state_version = ks.authorization_state_version + 1,
         active_status = case
           when p_to_state = 'AUTHORIZED' then 'ACTIVE'::public.knowledge_source_active_status
           when p_to_state = 'SUSPENDED' then 'SUSPENDED'::public.knowledge_source_active_status
           when p_to_state = 'RETIRED' then 'RETIRED'::public.knowledge_source_active_status
           else ks.active_status
         end,
         trust_status = case
           when p_to_state = 'AUTHORIZED' then 'VERIFIED'::public.knowledge_source_trust_status
           when p_to_state = 'SUSPENDED' then 'SUSPENDED'::public.knowledge_source_trust_status
           else ks.trust_status
         end,
         updated_at = now()
   where ks.id = p_source_id;

  insert into public.knowledge_source_authorization_transitions (
    id, source_id, from_state, to_state, operation, operation_actor_class,
    actor_audit_identifier, reason, previous_state_version,
    resulting_state_version, idempotency_key
  )
  values (
    v_transition_id, p_source_id, v_source.authorization_state, p_to_state,
    p_operation, p_operation_actor_class, p_actor_audit_identifier, p_reason,
    p_expected_version, p_expected_version + 1, p_idempotency_key
  );

  return query
    select p_source_id, p_to_state, p_expected_version + 1, v_transition_id;
end;
$$;

revoke all on function public.knowledge_transition_source_authorization_internal(
  uuid, integer, public.knowledge_source_authorization_state, text, text, text, text, text
) from public, anon, authenticated, service_role;

-- =============================================================================
-- ELEVEN NARROW, OPERATION-SCOPED RPCS
-- =============================================================================

create function public.knowledge_register_official_source(
  p_publisher_id uuid,
  p_source_type text,
  p_source_purpose text,
  p_canonical_url text,
  p_normalized_canonical_url text,
  p_normalized_origin text,
  p_source_class public.knowledge_source_class,
  p_jurisdiction_id uuid,
  p_territorial_scope_id uuid,
  p_issuing_authority_id uuid,
  p_authority_level public.knowledge_authority_level,
  p_source_language text,
  p_process_scope text[],
  p_retrieval_method public.knowledge_retrieval_method,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source_id uuid;
  v_replayed_source public.knowledge_sources%rowtype;
  v_existing public.knowledge_source_authorization_transitions%rowtype;
  v_evidence_eligibility public.knowledge_source_evidence_eligibility;
begin
  if p_publisher_id is null
     or p_source_type is null
     or p_source_purpose is null
     or p_canonical_url is null
     or p_normalized_canonical_url is null
     or p_normalized_origin is null
     or p_source_class is null
     or p_jurisdiction_id is null
     or p_authority_level is null
     or p_source_language is null
     or p_retrieval_method is null
     or p_actor_audit_identifier is null
     or p_idempotency_key is null
     or length(btrim(p_source_type)) not between 1 and 100
     or length(btrim(p_source_purpose)) not between 1 and 500
     or length(btrim(p_canonical_url)) not between 8 and 4096
     or length(btrim(p_normalized_canonical_url)) not between 8 and 4096
     or p_normalized_canonical_url !~ '^https?://[^[:space:]#]+$'
     or position('#' in p_normalized_canonical_url) > 0
     or length(btrim(p_normalized_origin)) not between 8 and 512
     or p_normalized_origin !~ '^https?://[^/:[:space:]#]+(:[0-9]{1,5})?$'
     or p_normalized_origin <> lower(p_normalized_origin)
     or length(btrim(p_source_language)) not between 2 and 35
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_idempotency_key)) not between 1 and 200
  then
    raise exception 'SOURCE_URL_INVALID or invalid registration input'
      using errcode = '22023';
  end if;

  select ksat.*
    into v_existing
    from public.knowledge_source_authorization_transitions as ksat
   where ksat.operation = 'REGISTER_SOURCE'
     and ksat.idempotency_key = p_idempotency_key;
  if found then
    select ks.*
      into v_replayed_source
      from public.knowledge_sources as ks
     where ks.id = v_existing.source_id;
    if v_replayed_source.publisher_id <> p_publisher_id
       or v_replayed_source.normalized_canonical_url <> p_normalized_canonical_url
       or v_replayed_source.normalized_origin <> p_normalized_origin
       or v_replayed_source.source_class <> p_source_class
       or v_replayed_source.jurisdiction_id <> p_jurisdiction_id
       or v_replayed_source.retrieval_method <> p_retrieval_method
       or v_existing.actor_audit_identifier <> p_actor_audit_identifier
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    return query
      select v_existing.source_id,
             v_existing.to_state,
             v_existing.resulting_state_version;
    return;
  end if;

  if p_source_class in (
    'COMMERCIAL_GUIDE', 'BLOG', 'FORUM', 'SEARCH_RESULT_SNIPPET', 'AI_GENERATED_TEXT'
  ) then
    v_evidence_eligibility := 'DISCOVERY_ONLY';
  else
    v_evidence_eligibility := 'PUBLICATION_EVIDENCE_ELIGIBLE';
  end if;

  if p_source_class = 'MUNICIPALITY_SERVICE_PORTAL'
     and (p_authority_level <> 'MUNICIPALITY' or p_territorial_scope_id is null)
  then
    raise exception 'SOURCE_JURISDICTION_INVALID'
      using errcode = '23514';
  end if;

  v_source_id := gen_random_uuid();
  insert into public.knowledge_sources (
    id, publisher_id, source_type, source_purpose, canonical_url,
    normalized_canonical_url, normalized_origin, source_class,
    evidence_eligibility, issuing_authority_id, authority_level,
    jurisdiction_id, territorial_scope_id, source_language, process_scope,
    retrieval_method, registration_idempotency_key
  )
  values (
    v_source_id, p_publisher_id, p_source_type, p_source_purpose, p_canonical_url,
    p_normalized_canonical_url, p_normalized_origin, p_source_class,
    v_evidence_eligibility, p_issuing_authority_id, p_authority_level,
    p_jurisdiction_id, p_territorial_scope_id, p_source_language,
    coalesce(p_process_scope, '{}'), p_retrieval_method, p_idempotency_key
  );

  insert into public.knowledge_source_authorization_transitions (
    source_id, from_state, to_state, operation, operation_actor_class,
    actor_audit_identifier, reason, previous_state_version,
    resulting_state_version, idempotency_key
  )
  values (
    v_source_id, null, 'DRAFT', 'REGISTER_SOURCE', 'SOURCE_REGISTRAR',
    p_actor_audit_identifier, 'source registered', 0, 1, p_idempotency_key
  );

  insert into public.knowledge_source_registry_history (
    source_id, change_classification, operation, operation_actor_class,
    actor_audit_identifier, reason, old_value, new_value, idempotency_key,
    resulting_version
  )
  values (
    v_source_id, 'METADATA_CHANGE', 'REGISTER_SOURCE', 'SOURCE_REGISTRAR',
    p_actor_audit_identifier, 'source registered', null,
    jsonb_build_object(
      'normalized_canonical_url', p_normalized_canonical_url,
      'normalized_origin', p_normalized_origin,
      'source_class', p_source_class,
      'evidence_eligibility', v_evidence_eligibility
    ),
    'registry:' || p_idempotency_key, 1
  );

  return query select v_source_id, 'DRAFT'::public.knowledge_source_authorization_state, 1;
end;
$$;

create function public.knowledge_update_official_source_metadata(
  p_source_id uuid,
  p_expected_version integer,
  p_canonical_url text,
  p_normalized_canonical_url text,
  p_normalized_origin text,
  p_source_class public.knowledge_source_class,
  p_issuing_authority_id uuid,
  p_authority_level public.knowledge_authority_level,
  p_jurisdiction_id uuid,
  p_territorial_scope_id uuid,
  p_process_scope text[],
  p_retrieval_method public.knowledge_retrieval_method,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_history public.knowledge_source_registry_history%rowtype;
  v_evidence public.knowledge_source_evidence_eligibility;
begin
  if p_source_id is null
     or p_expected_version is null
     or p_canonical_url is null
     or p_normalized_canonical_url is null
     or p_normalized_origin is null
     or p_source_class is null
     or p_authority_level is null
     or p_jurisdiction_id is null
     or p_retrieval_method is null
     or p_actor_audit_identifier is null
     or p_reason is null
     or p_idempotency_key is null
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_reason)) not between 1 and 2000
     or length(btrim(p_idempotency_key)) not between 1 and 200
     or length(btrim(p_canonical_url)) not between 8 and 4096
     or p_normalized_canonical_url !~ '^https?://[^[:space:]#]+$'
     or position('#' in p_normalized_canonical_url) > 0
     or p_normalized_origin !~ '^https?://[^/:[:space:]#]+(:[0-9]{1,5})?$'
     or p_normalized_origin <> lower(p_normalized_origin)
  then
    raise exception 'invalid source metadata input' using errcode = '22023';
  end if;

  select ksrh.*
    into v_history
    from public.knowledge_source_registry_history as ksrh
   where ksrh.operation = 'UPDATE_SOURCE_METADATA'
     and ksrh.idempotency_key = p_idempotency_key;
  if found then
    select ks.*
      into v_source
      from public.knowledge_sources as ks
     where ks.id = v_history.source_id;
    if v_history.source_id <> p_source_id then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    if v_history.new_value ->> 'normalized_canonical_url' <> p_normalized_canonical_url
       or v_history.new_value ->> 'normalized_origin' <> p_normalized_origin
       or v_history.new_value ->> 'source_class' <> p_source_class::text
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    return query
      select v_source.id, v_source.authorization_state, v_source.authorization_state_version;
    return;
  end if;

  select ks.*
    into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id
   for update;
  if not found then raise exception 'source not found' using errcode = 'P0002'; end if;
  if v_source.authorization_state_version <> p_expected_version then
    raise exception 'SOURCE_VERSION_CONFLICT' using errcode = '40001';
  end if;
  if v_source.authorization_state not in ('DRAFT', 'PENDING_TERMS_REVIEW', 'PENDING_AUTHORITY_VERIFICATION', 'SUSPENDED') then
    raise exception 'SOURCE_STATE_TRANSITION_INVALID' using errcode = '22023';
  end if;

  v_evidence := case
    when p_source_class in ('COMMERCIAL_GUIDE', 'BLOG', 'FORUM', 'SEARCH_RESULT_SNIPPET', 'AI_GENERATED_TEXT')
      then 'DISCOVERY_ONLY'::public.knowledge_source_evidence_eligibility
    else 'PUBLICATION_EVIDENCE_ELIGIBLE'::public.knowledge_source_evidence_eligibility
  end;
  if v_source.evidence_eligibility = 'DISCOVERY_ONLY'
     and v_evidence = 'PUBLICATION_EVIDENCE_ELIGIBLE'
  then
    raise exception 'DISCOVERY_SOURCE_EVIDENCE_FORBIDDEN: reviewed reclassification operation required'
      using errcode = '23514';
  end if;
  if p_source_class = 'MUNICIPALITY_SERVICE_PORTAL'
     and (p_authority_level <> 'MUNICIPALITY' or p_territorial_scope_id is null)
  then
    raise exception 'SOURCE_JURISDICTION_INVALID' using errcode = '23514';
  end if;

  update public.knowledge_sources as ks
     set canonical_url = p_canonical_url,
         normalized_canonical_url = p_normalized_canonical_url,
         normalized_origin = p_normalized_origin,
         source_class = p_source_class,
         evidence_eligibility = v_evidence,
         issuing_authority_id = p_issuing_authority_id,
         authority_level = p_authority_level,
         jurisdiction_id = p_jurisdiction_id,
         territorial_scope_id = p_territorial_scope_id,
         process_scope = coalesce(p_process_scope, '{}'),
         retrieval_method = p_retrieval_method,
         authorization_state_version = ks.authorization_state_version + 1,
         updated_at = now()
   where ks.id = p_source_id;

  insert into public.knowledge_source_registry_history (
    source_id, change_classification, operation, operation_actor_class,
    actor_audit_identifier, reason, old_value, new_value, idempotency_key,
    resulting_version
  )
  values (
    p_source_id, 'METADATA_CHANGE', 'UPDATE_SOURCE_METADATA', 'SOURCE_METADATA_EDITOR',
    p_actor_audit_identifier, p_reason,
    jsonb_build_object(
      'canonical_url', v_source.canonical_url,
      'normalized_canonical_url', v_source.normalized_canonical_url,
      'normalized_origin', v_source.normalized_origin,
      'source_class', v_source.source_class,
      'evidence_eligibility', v_source.evidence_eligibility,
      'issuing_authority_id', v_source.issuing_authority_id,
      'authority_level', v_source.authority_level,
      'jurisdiction_id', v_source.jurisdiction_id,
      'territorial_scope_id', v_source.territorial_scope_id
    ),
    jsonb_build_object(
      'canonical_url', p_canonical_url,
      'normalized_canonical_url', p_normalized_canonical_url,
      'normalized_origin', p_normalized_origin,
      'source_class', p_source_class,
      'evidence_eligibility', v_evidence,
      'issuing_authority_id', p_issuing_authority_id,
      'authority_level', p_authority_level,
      'jurisdiction_id', p_jurisdiction_id,
      'territorial_scope_id', p_territorial_scope_id
    ),
    p_idempotency_key, p_expected_version + 1
  );

  return query
    select p_source_id, v_source.authorization_state, p_expected_version + 1;
end;
$$;

create function public.knowledge_record_source_terms_review(
  p_source_id uuid,
  p_expected_version integer,
  p_review_status public.knowledge_access_review_status,
  p_review_record_id uuid,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_history public.knowledge_source_registry_history%rowtype;
begin
  select ksrh.* into v_history
    from public.knowledge_source_registry_history as ksrh
   where ksrh.operation = 'RECORD_TERMS_REVIEW'
     and ksrh.idempotency_key = p_idempotency_key;
  if found then
    if v_history.source_id <> p_source_id then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    if v_history.new_value ->> 'status' <> p_review_status::text
       or v_history.new_value ->> 'review_record_id' <> p_review_record_id::text
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    select ks.* into v_source
      from public.knowledge_sources as ks
     where ks.id = v_history.source_id;
    return query select v_source.id, v_source.authorization_state, v_source.authorization_state_version;
    return;
  end if;

  if p_source_id is null
     or p_expected_version is null
     or p_review_status is null
     or p_review_record_id is null
     or p_actor_audit_identifier is null
     or p_reason is null
     or p_idempotency_key is null
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_reason)) not between 1 and 2000
     or length(btrim(p_idempotency_key)) not between 1 and 200
  then raise exception 'invalid terms review input' using errcode = '22023'; end if;

  select ks.* into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id for update;
  if not found then raise exception 'source not found' using errcode = 'P0002'; end if;
  if v_source.authorization_state_version <> p_expected_version then
    raise exception 'SOURCE_VERSION_CONFLICT' using errcode = '40001';
  end if;
  if v_source.authorization_state not in ('DRAFT', 'PENDING_TERMS_REVIEW') then
    raise exception 'SOURCE_STATE_TRANSITION_INVALID' using errcode = '22023';
  end if;
  if not exists (
    select 1
      from public.knowledge_review_records as krr
     where krr.id = p_review_record_id
       and krr.entity_type = 'source'
       and krr.entity_id = p_source_id
  ) then
    raise exception 'source review record not found' using errcode = '23503';
  end if;

  update public.knowledge_sources as ks
     set terms_or_license_review_status = p_review_status,
         updated_at = now()
   where ks.id = p_source_id;

  insert into public.knowledge_source_registry_history (
    source_id, change_classification, operation, operation_actor_class,
    actor_audit_identifier, reason, old_value, new_value, idempotency_key,
    resulting_version
  ) values (
    p_source_id, 'TERMS_REVIEW_CHANGE', 'RECORD_TERMS_REVIEW', 'SOURCE_TERMS_REVIEWER',
    p_actor_audit_identifier, p_reason,
    jsonb_build_object('status', v_source.terms_or_license_review_status),
    jsonb_build_object('status', p_review_status, 'review_record_id', p_review_record_id),
    p_idempotency_key, p_expected_version + 1
  );

  if v_source.authorization_state = 'DRAFT' then
    return query select t.source_id, t.authorization_state, t.authorization_state_version
      from public.knowledge_transition_source_authorization_internal(
        p_source_id, p_expected_version, 'PENDING_TERMS_REVIEW',
        'TERMS_REVIEW_STARTED', 'SOURCE_TERMS_REVIEWER',
        p_actor_audit_identifier, p_reason, 'transition:' || p_idempotency_key
      ) as t;
  else
    update public.knowledge_sources as ks
       set authorization_state_version = ks.authorization_state_version + 1
     where ks.id = p_source_id;
    return query select p_source_id, v_source.authorization_state, p_expected_version + 1;
  end if;
end;
$$;

create function public.knowledge_record_source_robots_review(
  p_source_id uuid,
  p_expected_version integer,
  p_review_status public.knowledge_access_review_status,
  p_review_record_id uuid,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_history public.knowledge_source_registry_history%rowtype;
begin
  select ksrh.* into v_history
    from public.knowledge_source_registry_history as ksrh
   where ksrh.operation = 'RECORD_ROBOTS_REVIEW'
     and ksrh.idempotency_key = p_idempotency_key;
  if found then
    if v_history.source_id <> p_source_id
       or v_history.new_value ->> 'status' <> p_review_status::text
       or v_history.new_value ->> 'review_record_id' <> p_review_record_id::text
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    select ks.* into v_source from public.knowledge_sources as ks where ks.id = v_history.source_id;
    return query select v_source.id, v_source.authorization_state, v_source.authorization_state_version;
    return;
  end if;
  if p_source_id is null
     or p_expected_version is null
     or p_review_status is null
     or p_review_record_id is null
     or p_actor_audit_identifier is null
     or p_reason is null
     or p_idempotency_key is null
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_reason)) not between 1 and 2000
     or length(btrim(p_idempotency_key)) not between 1 and 200
  then raise exception 'invalid robots review input' using errcode = '22023'; end if;

  select ks.* into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id for update;
  if not found then raise exception 'source not found' using errcode = 'P0002'; end if;
  if v_source.authorization_state_version <> p_expected_version then
    raise exception 'SOURCE_VERSION_CONFLICT' using errcode = '40001';
  end if;
  if v_source.authorization_state not in ('DRAFT', 'PENDING_TERMS_REVIEW') then
    raise exception 'SOURCE_STATE_TRANSITION_INVALID' using errcode = '22023';
  end if;
  if not exists (
    select 1
      from public.knowledge_review_records as krr
     where krr.id = p_review_record_id
       and krr.entity_type = 'source'
       and krr.entity_id = p_source_id
  ) then
    raise exception 'source review record not found' using errcode = '23503';
  end if;

  update public.knowledge_sources as ks
     set robots_review_status = p_review_status,
         authorization_state_version = ks.authorization_state_version + 1,
         updated_at = now()
   where ks.id = p_source_id;
  insert into public.knowledge_source_registry_history (
    source_id, change_classification, operation, operation_actor_class,
    actor_audit_identifier, reason, old_value, new_value, idempotency_key,
    resulting_version
  ) values (
    p_source_id, 'ROBOTS_REVIEW_CHANGE', 'RECORD_ROBOTS_REVIEW', 'SOURCE_ROBOTS_REVIEWER',
    p_actor_audit_identifier, p_reason,
    jsonb_build_object('status', v_source.robots_review_status),
    jsonb_build_object('status', p_review_status, 'review_record_id', p_review_record_id),
    p_idempotency_key, p_expected_version + 1
  );
  return query select p_source_id, v_source.authorization_state, p_expected_version + 1;
end;
$$;

create function public.knowledge_record_source_authority_verification(
  p_source_id uuid,
  p_expected_version integer,
  p_authority_id uuid,
  p_authority_level public.knowledge_authority_level,
  p_review_record_id uuid,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_authority public.knowledge_authorities%rowtype;
  v_history public.knowledge_source_registry_history%rowtype;
begin
  select ksrh.* into v_history
    from public.knowledge_source_registry_history as ksrh
   where ksrh.operation = 'VERIFY_SOURCE_AUTHORITY'
     and ksrh.idempotency_key = p_idempotency_key;
  if found then
    if v_history.source_id <> p_source_id
       or v_history.new_value ->> 'authority_id' <> p_authority_id::text
       or v_history.new_value ->> 'authority_level' <> p_authority_level::text
       or v_history.new_value ->> 'review_record_id' <> p_review_record_id::text
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    select ks.* into v_source
      from public.knowledge_sources as ks
     where ks.id = v_history.source_id;
    return query select v_source.id, v_source.authorization_state, v_source.authorization_state_version;
    return;
  end if;

  if p_source_id is null
     or p_expected_version is null
     or p_authority_id is null
     or p_authority_level is null
     or p_review_record_id is null
     or p_actor_audit_identifier is null
     or p_reason is null
     or p_idempotency_key is null
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_reason)) not between 1 and 2000
     or length(btrim(p_idempotency_key)) not between 1 and 200
  then raise exception 'invalid authority review input' using errcode = '22023'; end if;

  select ks.* into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id for update;
  if not found then raise exception 'source not found' using errcode = 'P0002'; end if;
  if v_source.authorization_state_version <> p_expected_version then
    raise exception 'SOURCE_VERSION_CONFLICT' using errcode = '40001';
  end if;
  if v_source.authorization_state <> 'PENDING_TERMS_REVIEW'
     or v_source.terms_or_license_review_status <> 'ALLOWED'
     or v_source.robots_review_status <> 'ALLOWED'
  then
    raise exception 'SOURCE_TERMS_REVIEW_REQUIRED or SOURCE_ROBOTS_REVIEW_REQUIRED'
      using errcode = '23514';
  end if;

  select ka.* into v_authority
    from public.knowledge_authorities as ka
   where ka.id = p_authority_id;
  if not found
     or v_authority.publisher_id <> v_source.publisher_id
     or v_authority.jurisdiction_id <> v_source.jurisdiction_id
  then
    raise exception 'SOURCE_AUTHORITY_MISMATCH' using errcode = '23514';
  end if;
  if p_authority_level = 'MUNICIPALITY'
     and v_source.territorial_scope_id is distinct from v_authority.territorial_scope_id
  then
    raise exception 'SOURCE_JURISDICTION_INVALID' using errcode = '23514';
  end if;
  if not exists (
    select 1
      from public.knowledge_review_records as krr
     where krr.id = p_review_record_id
       and krr.entity_type = 'source'
       and krr.entity_id = p_source_id
  ) then
    raise exception 'source review record not found' using errcode = '23503';
  end if;
  if v_source.evidence_eligibility = 'PUBLICATION_EVIDENCE_ELIGIBLE'
     and not exists (
       select 1
         from public.knowledge_publishers as kp
        where kp.id = v_source.publisher_id
          and kp.official_status = true
     )
  then
    raise exception 'SOURCE_AUTHORITY_MISMATCH: publisher is not official'
      using errcode = '23514';
  end if;

  update public.knowledge_sources as ks
     set issuing_authority_id = p_authority_id,
         authority_level = p_authority_level,
         official_domain = regexp_replace(ks.normalized_origin, '^https?://', ''),
         official_domain_verification_status = 'verified',
         first_verified_at = coalesce(ks.first_verified_at, now()),
         last_verified_at = now(),
         updated_at = now()
   where ks.id = p_source_id;
  insert into public.knowledge_source_registry_history (
    source_id, change_classification, operation, operation_actor_class,
    actor_audit_identifier, reason, old_value, new_value, idempotency_key,
    resulting_version
  ) values (
    p_source_id, 'AUTHORITY_ASSIGNMENT_CHANGE', 'VERIFY_SOURCE_AUTHORITY', 'SOURCE_AUTHORITY_REVIEWER',
    p_actor_audit_identifier, p_reason,
    jsonb_build_object('authority_id', v_source.issuing_authority_id, 'authority_level', v_source.authority_level),
    jsonb_build_object('authority_id', p_authority_id, 'authority_level', p_authority_level, 'review_record_id', p_review_record_id),
    p_idempotency_key, p_expected_version + 1
  );
  return query select t.source_id, t.authorization_state, t.authorization_state_version
    from public.knowledge_transition_source_authorization_internal(
      p_source_id, p_expected_version, 'PENDING_AUTHORITY_VERIFICATION',
      'VERIFY_SOURCE_AUTHORITY', 'SOURCE_AUTHORITY_REVIEWER',
      p_actor_audit_identifier, p_reason, 'transition:' || p_idempotency_key
    ) as t;
end;
$$;

create function public.knowledge_authorize_official_source(
  p_source_id uuid,
  p_expected_version integer,
  p_review_record_id uuid,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
begin
  if p_review_record_id is null
     or not exists (
       select 1
         from public.knowledge_review_records as krr
        where krr.id = p_review_record_id
          and krr.entity_type = 'source'
          and krr.entity_id = p_source_id
     )
  then
    raise exception 'authority review record required' using errcode = '22023';
  end if;
  return query select t.source_id, t.authorization_state, t.authorization_state_version
    from public.knowledge_transition_source_authorization_internal(
      p_source_id, p_expected_version, 'AUTHORIZED',
      'AUTHORIZE_SOURCE', 'SOURCE_AUTHORIZER',
      p_actor_audit_identifier, p_reason, p_idempotency_key
    ) as t;
end;
$$;

create function public.knowledge_suspend_official_source(
  p_source_id uuid,
  p_expected_version integer,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
begin
  return query select t.source_id, t.authorization_state, t.authorization_state_version
    from public.knowledge_transition_source_authorization_internal(
      p_source_id, p_expected_version, 'SUSPENDED',
      'SUSPEND_SOURCE', 'SOURCE_SUSPENSION_AUTHORITY',
      p_actor_audit_identifier, p_reason, p_idempotency_key
    ) as t;
end;
$$;

create function public.knowledge_reject_official_source(
  p_source_id uuid,
  p_expected_version integer,
  p_review_record_id uuid,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
begin
  if p_review_record_id is null
     or not exists (
       select 1
         from public.knowledge_review_records as krr
        where krr.id = p_review_record_id
          and krr.entity_type = 'source'
          and krr.entity_id = p_source_id
     )
  then
    raise exception 'rejection review record required' using errcode = '22023';
  end if;
  return query select t.source_id, t.authorization_state, t.authorization_state_version
    from public.knowledge_transition_source_authorization_internal(
      p_source_id, p_expected_version, 'REJECTED',
      'REJECT_SOURCE', 'SOURCE_REJECTION_AUTHORITY',
      p_actor_audit_identifier, p_reason, p_idempotency_key
    ) as t;
end;
$$;

create function public.knowledge_retire_official_source(
  p_source_id uuid,
  p_expected_version integer,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  source_id uuid,
  authorization_state public.knowledge_source_authorization_state,
  authorization_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
begin
  return query select t.source_id, t.authorization_state, t.authorization_state_version
    from public.knowledge_transition_source_authorization_internal(
      p_source_id, p_expected_version, 'RETIRED',
      'RETIRE_SOURCE', 'SOURCE_RETIREMENT_AUTHORITY',
      p_actor_audit_identifier, p_reason, p_idempotency_key
    ) as t;
end;
$$;

create function public.knowledge_assign_source_handling_policy(
  p_source_id uuid,
  p_information_class public.knowledge_information_class,
  p_process_scope text,
  p_handling_mode public.knowledge_handling_mode,
  p_freshness_class public.knowledge_freshness_class,
  p_stale_behavior public.knowledge_stale_behavior,
  p_required_context_keys public.knowledge_required_context_key[],
  p_risk_class text,
  p_expected_policy_version integer,
  p_revalidation_due_at timestamptz,
  p_actor_audit_identifier text,
  p_reason text,
  p_idempotency_key text
)
returns table (
  policy_id uuid,
  policy_state_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_policy public.knowledge_source_handling_policies%rowtype;
  v_history public.knowledge_source_registry_history%rowtype;
  v_policy_id uuid;
  v_next_version integer;
  v_scope text := coalesce(btrim(p_process_scope), '');
begin
  select ksrh.* into v_history
    from public.knowledge_source_registry_history as ksrh
   where ksrh.operation = 'ASSIGN_HANDLING_POLICY'
     and ksrh.idempotency_key = p_idempotency_key;
  if found then
    if v_history.source_id <> p_source_id
       or v_history.new_value ->> 'information_class' <> p_information_class::text
       or v_history.new_value ->> 'process_scope' <> v_scope
       or v_history.new_value ->> 'handling_mode' <> p_handling_mode::text
       or v_history.new_value ->> 'freshness_class' <> p_freshness_class::text
       or v_history.new_value ->> 'stale_behavior' <> p_stale_behavior::text
    then
      raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    select kshp.* into v_policy
      from public.knowledge_source_handling_policies as kshp
     where kshp.source_id = p_source_id
       and kshp.information_class = p_information_class
       and kshp.process_scope = v_scope;
    return query select v_policy.id, v_policy.state_version;
    return;
  end if;

  if p_source_id is null
     or p_information_class is null
     or p_handling_mode is null
     or p_freshness_class is null
     or p_stale_behavior is null
     or p_risk_class is null
     or p_expected_policy_version is null
     or p_actor_audit_identifier is null
     or p_reason is null
     or p_idempotency_key is null
     or length(v_scope) > 200
     or length(btrim(p_risk_class)) not between 1 and 20
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_reason)) not between 1 and 2000
     or length(btrim(p_idempotency_key)) not between 1 and 200
  then raise exception 'invalid handling policy input' using errcode = '22023'; end if;

  select ks.* into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id for update;
  if not found then raise exception 'source not found' using errcode = 'P0002'; end if;
  if v_source.authorization_state not in (
    'DRAFT', 'PENDING_TERMS_REVIEW', 'PENDING_AUTHORITY_VERIFICATION', 'AUTHORIZED', 'SUSPENDED'
  ) then raise exception 'SOURCE_STATE_TRANSITION_INVALID' using errcode = '22023'; end if;

  if p_information_class in ('OPENING_HOURS', 'APPOINTMENT_AVAILABILITY')
     and p_handling_mode = 'STORE_CANONICALLY'
  then raise exception 'HANDLING_POLICY_CONFLICT' using errcode = '23514'; end if;
  if p_information_class = 'PROCESS_IDENTITY'
     and p_handling_mode = 'FETCH_LIVE'
  then raise exception 'HANDLING_POLICY_CONFLICT' using errcode = '23514'; end if;
  if upper(p_risk_class) in ('HIGH', 'CRITICAL')
     and p_stale_behavior <> 'DO_NOT_USE_STALE'
  then raise exception 'HANDLING_POLICY_CONFLICT' using errcode = '23514'; end if;
  if p_handling_mode = 'DO_NOT_ANSWER_WITHOUT_CONTEXT'
     and cardinality(coalesce(p_required_context_keys, '{}')) = 0
  then raise exception 'HANDLING_POLICY_CONFLICT' using errcode = '23514'; end if;
  if v_source.source_class in (
    'COMMERCIAL_GUIDE', 'BLOG', 'FORUM', 'SEARCH_RESULT_SNIPPET', 'AI_GENERATED_TEXT'
  ) and p_handling_mode = 'STORE_CANONICALLY'
  then raise exception 'DISCOVERY_SOURCE_EVIDENCE_FORBIDDEN' using errcode = '23514'; end if;
  if v_source.source_class = 'MUNICIPALITY_SERVICE_PORTAL'
     and (v_source.authority_level <> 'MUNICIPALITY' or v_source.territorial_scope_id is null)
  then raise exception 'SOURCE_JURISDICTION_INVALID' using errcode = '23514'; end if;

  select kshp.* into v_policy
    from public.knowledge_source_handling_policies as kshp
   where kshp.source_id = p_source_id
     and kshp.information_class = p_information_class
     and kshp.process_scope = v_scope
   for update;

  if found then
    if v_policy.state_version <> p_expected_policy_version then
      raise exception 'SOURCE_VERSION_CONFLICT' using errcode = '40001';
    end if;
    v_policy_id := v_policy.id;
    v_next_version := v_policy.state_version + 1;
    update public.knowledge_source_handling_policies as kshp
       set handling_mode = p_handling_mode,
           freshness_class = p_freshness_class,
           stale_behavior = p_stale_behavior,
           required_context_keys = coalesce(p_required_context_keys, '{}'),
           risk_class = upper(p_risk_class),
           state_version = v_next_version,
           revalidation_due_at = p_revalidation_due_at,
           updated_at = now()
     where kshp.id = v_policy_id;
  else
    if p_expected_policy_version <> 0 then
      raise exception 'SOURCE_VERSION_CONFLICT' using errcode = '40001';
    end if;
    v_policy_id := gen_random_uuid();
    v_next_version := 1;
    insert into public.knowledge_source_handling_policies (
      id, source_id, information_class, process_scope, handling_mode,
      freshness_class, stale_behavior, required_context_keys, risk_class,
      state_version, revalidation_due_at
    ) values (
      v_policy_id, p_source_id, p_information_class, v_scope, p_handling_mode,
      p_freshness_class, p_stale_behavior, coalesce(p_required_context_keys, '{}'),
      upper(p_risk_class), 1, p_revalidation_due_at
    );
  end if;

  insert into public.knowledge_source_registry_history (
    source_id, change_classification, operation, operation_actor_class,
    actor_audit_identifier, reason, old_value, new_value, idempotency_key,
    resulting_version
  ) values (
    p_source_id, 'HANDLING_POLICY_CHANGE', 'ASSIGN_HANDLING_POLICY', 'HANDLING_POLICY_EDITOR',
    p_actor_audit_identifier, p_reason,
    case when v_policy.id is null then null else jsonb_build_object(
      'policy_id', v_policy.id,
      'handling_mode', v_policy.handling_mode,
      'freshness_class', v_policy.freshness_class,
      'stale_behavior', v_policy.stale_behavior,
      'state_version', v_policy.state_version
    ) end,
    jsonb_build_object(
      'policy_id', v_policy_id,
      'information_class', p_information_class,
      'process_scope', v_scope,
      'handling_mode', p_handling_mode,
      'freshness_class', p_freshness_class,
      'stale_behavior', p_stale_behavior,
      'required_context_keys', p_required_context_keys,
      'risk_class', upper(p_risk_class),
      'state_version', v_next_version
    ),
    p_idempotency_key, v_next_version
  );
  return query select v_policy_id, v_next_version;
end;
$$;

create function public.knowledge_record_source_acquisition_attempt(
  p_source_id uuid,
  p_retrieval_method public.knowledge_retrieval_method,
  p_retrieval_result public.knowledge_acquisition_result,
  p_http_status integer,
  p_content_type text,
  p_content_length bigint,
  p_etag text,
  p_last_modified timestamptz,
  p_content_hash text,
  p_normalized_content_hash text,
  p_parser_version text,
  p_failure_code text,
  p_retryable boolean,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table (
  acquisition_attempt_id uuid,
  retrieval_result public.knowledge_acquisition_result
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_source public.knowledge_sources%rowtype;
  v_attempt public.knowledge_source_acquisition_attempts%rowtype;
  v_attempt_id uuid;
begin
  select ksaa.* into v_attempt
    from public.knowledge_source_acquisition_attempts as ksaa
   where ksaa.idempotency_key = p_idempotency_key;
  if found then
    if v_attempt.source_id <> p_source_id
       or v_attempt.retrieval_method <> p_retrieval_method
       or v_attempt.retrieval_result <> p_retrieval_result
       or v_attempt.http_status is distinct from p_http_status
       or v_attempt.content_type is distinct from p_content_type
       or v_attempt.content_length is distinct from p_content_length
       or v_attempt.etag is distinct from p_etag
       or v_attempt.last_modified is distinct from p_last_modified
       or v_attempt.content_hash is distinct from p_content_hash
       or v_attempt.normalized_content_hash is distinct from p_normalized_content_hash
       or v_attempt.parser_version is distinct from p_parser_version
       or v_attempt.failure_code is distinct from p_failure_code
       or v_attempt.retryable is distinct from coalesce(p_retryable, false)
       or v_attempt.actor_audit_identifier <> p_actor_audit_identifier
    then raise exception 'SOURCE_IDEMPOTENCY_CONFLICT' using errcode = '23505'; end if;
    return query select v_attempt.id, v_attempt.retrieval_result;
    return;
  end if;

  if p_source_id is null
     or p_retrieval_method is null
     or p_retrieval_result is null
     or p_actor_audit_identifier is null
     or p_idempotency_key is null
     or length(btrim(p_actor_audit_identifier)) not between 1 and 200
     or length(btrim(p_idempotency_key)) not between 1 and 200
     or (p_content_type is not null and length(p_content_type) > 255)
     or (p_parser_version is not null and length(p_parser_version) > 200)
  then raise exception 'invalid acquisition attempt metadata' using errcode = '22023'; end if;

  select ks.* into v_source
    from public.knowledge_sources as ks
   where ks.id = p_source_id for share;
  if not found then raise exception 'source not found' using errcode = 'P0002'; end if;
  if v_source.authorization_state <> 'AUTHORIZED'
     or v_source.active_status <> 'ACTIVE'
  then raise exception 'source is not authorized for acquisition' using errcode = '42501'; end if;
  if p_retrieval_method <> v_source.retrieval_method then
    raise exception 'retrieval method does not match source registry' using errcode = '23514';
  end if;

  v_attempt_id := gen_random_uuid();
  insert into public.knowledge_source_acquisition_attempts (
    id, source_id, retrieval_method, retrieval_result, http_status,
    content_type, content_length, etag, last_modified, content_hash,
    normalized_content_hash, parser_version, failure_code, retryable,
    operation_actor_class, actor_audit_identifier, idempotency_key
  ) values (
    v_attempt_id, p_source_id, p_retrieval_method, p_retrieval_result,
    p_http_status, p_content_type, p_content_length, p_etag, p_last_modified,
    p_content_hash, p_normalized_content_hash, p_parser_version, p_failure_code,
    coalesce(p_retryable, false), 'SOURCE_ACQUISITION_RECORDER',
    p_actor_audit_identifier, p_idempotency_key
  );
  return query select v_attempt_id, p_retrieval_result;
end;
$$;

-- =============================================================================
-- FUNCTION EXECUTE BOUNDARY
-- =============================================================================

revoke all on function public.knowledge_register_official_source(
  uuid, text, text, text, text, text, public.knowledge_source_class, uuid, uuid,
  uuid, public.knowledge_authority_level, text, text[], public.knowledge_retrieval_method,
  text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_update_official_source_metadata(
  uuid, integer, text, text, text, public.knowledge_source_class, uuid,
  public.knowledge_authority_level, uuid, uuid, text[],
  public.knowledge_retrieval_method, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_record_source_terms_review(
  uuid, integer, public.knowledge_access_review_status, uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_record_source_robots_review(
  uuid, integer, public.knowledge_access_review_status, uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_record_source_authority_verification(
  uuid, integer, uuid, public.knowledge_authority_level, uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_authorize_official_source(
  uuid, integer, uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_suspend_official_source(
  uuid, integer, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_reject_official_source(
  uuid, integer, uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_retire_official_source(
  uuid, integer, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_assign_source_handling_policy(
  uuid, public.knowledge_information_class, text, public.knowledge_handling_mode,
  public.knowledge_freshness_class, public.knowledge_stale_behavior,
  public.knowledge_required_context_key[], text, integer, timestamptz, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public.knowledge_record_source_acquisition_attempt(
  uuid, public.knowledge_retrieval_method, public.knowledge_acquisition_result,
  integer, text, bigint, text, timestamptz, text, text, text, text, boolean, text, text
) from public, anon, authenticated, service_role;

grant execute on function public.knowledge_register_official_source(
  uuid, text, text, text, text, text, public.knowledge_source_class, uuid, uuid,
  uuid, public.knowledge_authority_level, text, text[], public.knowledge_retrieval_method,
  text, text
) to service_role;
grant execute on function public.knowledge_update_official_source_metadata(
  uuid, integer, text, text, text, public.knowledge_source_class, uuid,
  public.knowledge_authority_level, uuid, uuid, text[],
  public.knowledge_retrieval_method, text, text, text
) to service_role;
grant execute on function public.knowledge_record_source_terms_review(
  uuid, integer, public.knowledge_access_review_status, uuid, text, text, text
) to service_role;
grant execute on function public.knowledge_record_source_robots_review(
  uuid, integer, public.knowledge_access_review_status, uuid, text, text, text
) to service_role;
grant execute on function public.knowledge_record_source_authority_verification(
  uuid, integer, uuid, public.knowledge_authority_level, uuid, text, text, text
) to service_role;
grant execute on function public.knowledge_authorize_official_source(
  uuid, integer, uuid, text, text, text
) to service_role;
grant execute on function public.knowledge_suspend_official_source(
  uuid, integer, text, text, text
) to service_role;
grant execute on function public.knowledge_reject_official_source(
  uuid, integer, uuid, text, text, text
) to service_role;
grant execute on function public.knowledge_retire_official_source(
  uuid, integer, text, text, text
) to service_role;
grant execute on function public.knowledge_assign_source_handling_policy(
  uuid, public.knowledge_information_class, text, public.knowledge_handling_mode,
  public.knowledge_freshness_class, public.knowledge_stale_behavior,
  public.knowledge_required_context_key[], text, integer, timestamptz, text, text, text
) to service_role;
grant execute on function public.knowledge_record_source_acquisition_attempt(
  uuid, public.knowledge_retrieval_method, public.knowledge_acquisition_result,
  integer, text, bigint, text, timestamptz, text, text, text, text, boolean, text, text
) to service_role;

-- =============================================================================
-- FAIL-CLOSED TABLE ACCESS
-- =============================================================================

alter table public.knowledge_source_authorization_transitions enable row level security;
alter table public.knowledge_source_registry_history enable row level security;
alter table public.knowledge_source_handling_policies enable row level security;
alter table public.knowledge_source_acquisition_attempts enable row level security;

revoke all on table public.knowledge_sources from public, anon, authenticated, service_role;
revoke all on table public.knowledge_source_versions from public, anon, authenticated, service_role;
revoke all on table public.knowledge_retrieval_metadata from public, anon, authenticated, service_role;
revoke all on table public.knowledge_source_authorization_transitions from public, anon, authenticated, service_role;
revoke all on table public.knowledge_source_registry_history from public, anon, authenticated, service_role;
revoke all on table public.knowledge_source_handling_policies from public, anon, authenticated, service_role;
revoke all on table public.knowledge_source_acquisition_attempts from public, anon, authenticated, service_role;

-- No policies are created. SECURITY DEFINER wrappers are the only approved
-- service-role write path; owner/superuser bypass remains PostgreSQL's explicit
-- trust boundary and is not represented as application-level immutability.
