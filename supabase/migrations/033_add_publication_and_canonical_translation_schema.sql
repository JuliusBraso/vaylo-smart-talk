-- PHASE 9M: Publication and Canonical Translation Schema Extension.
-- Additive-only migration implementing the PHASE 9L implementation-plan
-- contract (see lib/vaylo/smart-talk/knowledge/de/run-publication-and-
-- canonical-translation-schema-extension-implementation-plan-audit.ts).
-- Creates exactly three new tables:
--   public.knowledge_publication_states
--   public.knowledge_publication_state_transitions
--   public.knowledge_canonical_unit_translations
-- None of the 33 existing knowledge_* tables from migration 032 are
-- dropped, renamed or destructively altered. The only touch to a
-- pre-existing table is the addition of narrowly-allowlisted AFTER UPDATE
-- triggers on 5 existing canonical tables (knowledge_claims,
-- knowledge_processes, knowledge_process_steps,
-- knowledge_evidence_requirements, knowledge_authority_competences), which
-- do not alter their columns, constraints, RLS or grants and never block
-- a legitimate existing write.
-- Zero real or synthetic knowledge rows are inserted by this migration.
-- Fail-closed RLS: all three new tables have RLS enabled and zero
-- anon/authenticated policies, matching every existing knowledge_* table's
-- convention. Every mutation path is a SECURITY DEFINER function with a
-- hardened `set search_path = pg_catalog, public` and REVOKE ALL FROM
-- PUBLIC. GRANT EXECUTE to service_role is applied ONLY to narrow,
-- operation-scoped RPCs (see PATCH 9M-PATCH note below); the generic
-- internal transition engine, the system-only invalidation function, and
-- the trigger-only functions receive no service_role grant at all.
--
-- PATCH 9M-PATCH (trusted actor authorization boundary fix): the original
-- 9M draft accepted a caller-controlled `p_actor_class` /
-- `p_created_by_actor_type` parameter on several grantable RPCs, checked
-- only against a text allowlist. That allowlist check proves a string is
-- syntactically recognized; it does NOT prove the caller possesses that
-- authority, so any `service_role` caller could freely claim
-- `authorized_reviewer`, `publication_administrator`,
-- `emergency_suspension_authority`, or `migration_bootstrap_system_actor`
-- simply by passing the matching string. This migration now enforces:
--   1. no grantable function accepts a privileged actor-class parameter;
--   2. `knowledge_transition_publication_state` (the generic authoritative
--      engine) is no longer granted to service_role at all — it is an
--      INTERNAL-ONLY engine, reachable only via direct SQL function calls
--      from other SECURITY DEFINER functions owned by the same role;
--   3. every privileged operation is exposed only through a narrow,
--      single-purpose wrapper RPC that hardcodes its own actor class as a
--      literal constant before calling the internal engine — the caller
--      never supplies or influences that literal;
--   4. any actor/reviewer identifier a caller may still supply is
--      accepted ONLY as non-authoritative audit/display metadata (named
--      `..._audit_identifier`), never as authorization evidence, and is
--      never compared against anything to grant privilege.
-- HONEST BOUNDARY STATEMENT: this patch provides operation-level
-- containment only — it proves a `service_role` caller cannot *select*
-- which privileged actor class an operation runs as, because each
-- privileged class is now a hardcoded literal owned by a specific,
-- narrowly-scoped wrapper function. It does NOT implement a persistent
-- human-identity/RBAC system, and it does NOT distinguish which specific
-- human or system triggered a call to a given wrapper (any caller holding
-- `service_role` credentials may still invoke any wrapper it is granted).
-- A real reviewer/administrator identity contract (e.g. verified JWT
-- claims mapped through a trusted role table) is out of scope for this
-- patch and is left to a future phase.
--
-- HARD GATE A (bootstrap circularity) resolution: family_b_controlled_rpc.
-- knowledge_publication_state_transitions carries no foreign key back onto
-- knowledge_publication_states; both link through the shared natural key
-- (entity_type, entity_id). knowledge_publication_state_transitions is
-- therefore created FIRST (self-contained), and
-- knowledge_publication_states is created SECOND with its
-- current_transition_id foreign key declared inline. No DEFERRABLE
-- constraint is used anywhere in this migration.
--
-- HARD GATE B (canonical translation composite identity) resolution: the
-- translation attachment identity is the full six-column tuple
-- (entity_type, entity_id, field_key, canonical_content_fingerprint,
-- output_locale, translation_version). The fingerprint is always
-- database-derived via pgcrypto's digest() from the live allowlisted
-- canonical column; a caller-supplied fingerprint is only ever an
-- optional optimistic staleness assertion, never authoritative.

-- =============================================================================
-- STEP 1 — EXTENSION
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- STEP 2 — SUPPORTING FUNCTIONS (no dependency on the new tables)
-- =============================================================================

-- Deterministic canonical fingerprint: Unicode NFC normalization, CRLF->LF
-- line-ending normalization, a single outer whitespace trim (no internal
-- whitespace collapsing, no digit/punctuation/diacritic/case removal, no
-- sentence reordering, no warning/uncertainty-language removal), then
-- SHA-256 over the UTF-8 bytes, lowercase hex-encoded (64 characters).
create or replace function public.fn_normalize_and_fingerprint_text(p_text text)
returns text
language plpgsql
as $$
declare
  v_normalized text;
begin
  if p_text is null then
    return null;
  end if;

  v_normalized := normalize(p_text, NFC);
  v_normalized := replace(v_normalized, E'\r\n', E'\n');
  v_normalized := regexp_replace(v_normalized, '^\s+|\s+$', '', 'g');

  return encode(digest(convert_to(v_normalized, 'UTF8'), 'sha256'), 'hex');
end;
$$;

revoke all on function public.fn_normalize_and_fingerprint_text(text) from public;

-- Closed allowlist dispatch: for exactly the 8 (entity_type, field_key)
-- translatable pairs derived from migration 032, returns whether the
-- combination is allowlisted and the target row exists, plus its current
-- canonical content. Never accepts or interpolates a caller-supplied table
-- or column identifier; every branch is a fixed, schema-qualified SELECT.
create or replace function public.fn_translation_target_exists(
  p_entity_type text,
  p_entity_id uuid,
  p_field_key text
)
returns table(target_exists boolean, canonical_content text)
language plpgsql
as $$
declare
  v_exists boolean := false;
  v_content text := null;
begin
  if p_entity_id is not null and p_field_key is not null then
    if p_entity_type = 'claim' and p_field_key = 'claim_text_canonical' then
      select claim_text_canonical into v_content from public.knowledge_claims where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'process' and p_field_key = 'title' then
      select title into v_content from public.knowledge_processes where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'process' and p_field_key = 'trigger_description' then
      select trigger_description into v_content from public.knowledge_processes where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'process' and p_field_key = 'safe_first_step' then
      select safe_first_step into v_content from public.knowledge_processes where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'process_step' and p_field_key = 'title' then
      select title into v_content from public.knowledge_process_steps where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'process_step' and p_field_key = 'description_canonical' then
      select description_canonical into v_content from public.knowledge_process_steps where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'evidence_requirement' and p_field_key = 'description_canonical' then
      select description_canonical into v_content from public.knowledge_evidence_requirements where id = p_entity_id;
      v_exists := found;
    elsif p_entity_type = 'authority_competence' and p_field_key = 'subject_matter' then
      select subject_matter into v_content from public.knowledge_authority_competences where id = p_entity_id;
      v_exists := found;
    end if;
  end if;

  if not v_exists then
    v_content := null;
  end if;

  return query select v_exists, v_content;
end;
$$;

revoke all on function public.fn_translation_target_exists(text, uuid, text) from public;

-- =============================================================================
-- STEP 3 — NEW TABLES (dependency-safe order; transitions before states,
-- both before the polymorphic subject-existence dispatch function, which
-- itself must exist before the states table's validation trigger)
-- =============================================================================

-- Append-only publication-state transition history. Self-contained: zero
-- foreign key onto knowledge_publication_states. Bootstrap coupling is
-- enforced structurally: from_state is null if and only if to_state is
-- 'draft' and if and only if from_state_version is 0.
create table if not exists public.knowledge_publication_state_transitions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'claim', 'process', 'process_step',
    'document_requirement', 'deadline_rule', 'authority_resolution_unit',
    'warning_unit', 'outcome_unit', 'canonical_translation', 'complete_process_pack_version'
  )),
  entity_id uuid not null,
  from_state text check (from_state is null or from_state in (
    'draft', 'evidence_incomplete', 'review_required', 'approved', 'publication_eligible',
    'published', 'suspended', 'superseded', 'withdrawn'
  )),
  to_state text not null check (to_state in (
    'draft', 'evidence_incomplete', 'review_required', 'approved', 'publication_eligible',
    'published', 'suspended', 'superseded', 'withdrawn'
  )),
  from_state_version integer not null check (from_state_version >= 0),
  resulting_state_version integer not null check (resulting_state_version = from_state_version + 1),
  transition_reason_code text not null check (transition_reason_code in (
    'initial_draft', 'evidence_completed', 'review_passed', 'review_failed_returned_to_evidence',
    'approved', 'eligibility_confirmed', 'published', 'stale_source_suspension', 'conflict_suspension',
    'authority_error_suspension', 'translation_defect_suspension', 'emergency_governance_suspension',
    'reinstated_after_suspension', 'superseded_by_new_version', 'withdrawn_reason_required', 'manual_correction'
  )),
  transition_reason text,
  actor_class text not null check (actor_class in (
    'automated_ingestion_system', 'authorized_reviewer', 'publication_administrator',
    'emergency_suspension_authority', 'migration_bootstrap_system_actor'
  )),
  actor_identifier text,
  review_record_id uuid references public.knowledge_review_records (id) on delete restrict,
  expected_state_version integer not null check (expected_state_version >= 0),
  replacement_entity_type text check (replacement_entity_type is null or replacement_entity_type in (
    'source', 'source_version', 'claim', 'process', 'process_step',
    'document_requirement', 'deadline_rule', 'authority_resolution_unit',
    'warning_unit', 'outcome_unit', 'canonical_translation', 'complete_process_pack_version'
  )),
  replacement_entity_id uuid,
  emergency_flag boolean not null default false,
  idempotency_key text not null check (length(idempotency_key) > 0),
  provenance_note text,
  transitioned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint knowledge_publication_state_transitions_bootstrap_state_coupling
    check ((from_state is null) = (to_state = 'draft')),
  constraint knowledge_publication_state_transitions_bootstrap_version_coupling
    check ((from_state is null) = (from_state_version = 0)),
  constraint knowledge_publication_state_transitions_replacement_id_required
    check (to_state <> 'superseded' or (replacement_entity_id is not null and replacement_entity_id <> entity_id)),
  constraint knowledge_publication_state_transitions_replacement_type_required
    check (to_state <> 'superseded' or replacement_entity_type is not null)
);

-- Current-state projection. current_transition_id is NOT NULL from the
-- first committed row: the referenced transitions row always already
-- exists (with a real id) strictly before this row is inserted, so no
-- temporary nullability or DEFERRABLE constraint is required anywhere.
create table if not exists public.knowledge_publication_states (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'source', 'source_version', 'claim', 'process', 'process_step',
    'document_requirement', 'deadline_rule', 'authority_resolution_unit',
    'warning_unit', 'outcome_unit', 'canonical_translation', 'complete_process_pack_version'
  )),
  entity_id uuid not null,
  current_state text not null default 'draft' check (current_state in (
    'draft', 'evidence_incomplete', 'review_required', 'approved', 'publication_eligible',
    'published', 'suspended', 'superseded', 'withdrawn'
  )),
  current_transition_id uuid not null references public.knowledge_publication_state_transitions (id) on delete restrict,
  state_version integer not null default 1 check (state_version > 0),
  reason_code text,
  emergency_disabled boolean not null default false,
  effective_from timestamptz,
  effective_until timestamptz,
  jurisdiction_id uuid references public.knowledge_jurisdictions (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_publication_states_effective_period
    check (effective_until is null or effective_from is null or effective_until >= effective_from)
);

-- Canonical translation table. Zero foreign key onto the other two new
-- tables. German ('de') is never an accepted output_locale: German
-- canonical text remains exclusively in its canonical source tables.
create table if not exists public.knowledge_canonical_unit_translations (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'claim', 'process', 'process_step', 'evidence_requirement', 'authority_competence'
  )),
  entity_id uuid not null,
  field_key text not null check (field_key in (
    'claim_text_canonical', 'title', 'trigger_description', 'safe_first_step', 'description_canonical', 'subject_matter'
  )),
  canonical_content_fingerprint text not null check (length(canonical_content_fingerprint) = 64),
  fingerprint_algorithm_version text not null default 'sha256_nfc_v1' check (fingerprint_algorithm_version in ('sha256_nfc_v1')),
  output_locale text not null check (output_locale in ('en', 'sk', 'cs', 'pl', 'hu')),
  translated_text text not null,
  translation_version integer not null default 1 check (translation_version > 0),
  translation_status text not null default 'draft' check (translation_status in (
    'draft', 'machine_generated_pending_review', 'human_review_pending', 'approved',
    'rejected', 'invalidated_pending_review', 'superseded', 'withdrawn'
  )),
  machine_generated boolean not null default false,
  machine_provider text,
  machine_model text,
  uncertainty_preserved boolean not null default false,
  warnings_preserved boolean not null default false,
  numeric_and_deadline_values_preserved boolean not null default false,
  jurisdiction_inherited boolean not null default true check (jurisdiction_inherited = true),
  effective_date_inherited boolean not null default true check (effective_date_inherited = true),
  human_reviewed boolean not null default false,
  created_by_actor_type text not null,
  created_by_identifier text,
  reviewed_by_actor_type text,
  reviewed_by_identifier text,
  review_record_id uuid references public.knowledge_review_records (id) on delete restrict,
  rejection_reason text,
  glossary_snapshot_reference text,
  provenance_note text,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  superseded_at timestamptz,
  invalidated_at timestamptz,
  withdrawn_at timestamptz,
  constraint knowledge_canonical_unit_translations_machine_provenance_required
    check (not machine_generated or (machine_provider is not null and machine_model is not null)),
  constraint knowledge_canonical_unit_translations_approval_requires_review
    check (translation_status <> 'approved' or (
      human_reviewed = true and uncertainty_preserved = true and warnings_preserved = true
      and numeric_and_deadline_values_preserved = true and review_record_id is not null and verified_at is not null
    )),
  constraint knowledge_canonical_unit_translations_rejection_requires_reason
    check (translation_status <> 'rejected' or rejection_reason is not null)
);

-- =============================================================================
-- STEP 4 — POLYMORPHIC PUBLICATION SUBJECT DISPATCH (depends on all 3
-- new tables existing: 'canonical_translation' targets the translations
-- table and 'complete_process_pack_version' filters knowledge_processes)
-- =============================================================================

create or replace function public.fn_publication_subject_exists(
  p_entity_type text,
  p_entity_id uuid
) returns boolean
language plpgsql
as $$
begin
  if p_entity_id is null then
    return false;
  end if;

  case p_entity_type
    when 'source' then
      return exists(select 1 from public.knowledge_sources where id = p_entity_id);
    when 'source_version' then
      return exists(select 1 from public.knowledge_source_versions where id = p_entity_id);
    when 'claim' then
      return exists(select 1 from public.knowledge_claims where id = p_entity_id);
    when 'process' then
      return exists(select 1 from public.knowledge_processes where id = p_entity_id);
    when 'process_step' then
      return exists(select 1 from public.knowledge_process_steps where id = p_entity_id);
    when 'document_requirement' then
      return exists(select 1 from public.knowledge_evidence_requirements where id = p_entity_id);
    when 'deadline_rule' then
      return exists(select 1 from public.knowledge_deadline_rules where id = p_entity_id);
    when 'authority_resolution_unit' then
      return exists(select 1 from public.knowledge_authority_competences where id = p_entity_id);
    when 'warning_unit' then
      return exists(select 1 from public.knowledge_terminology where id = p_entity_id);
    when 'outcome_unit' then
      return exists(select 1 from public.knowledge_terminology where id = p_entity_id);
    when 'canonical_translation' then
      return exists(select 1 from public.knowledge_canonical_unit_translations where id = p_entity_id);
    when 'complete_process_pack_version' then
      return exists(
        select 1 from public.knowledge_processes
        where id = p_entity_id and process_group_id = 'anmeldung_ummeldung_abmeldung'
      );
    else
      return false;
  end case;
end;
$$;

revoke all on function public.fn_publication_subject_exists(text, uuid) from public;

-- =============================================================================
-- STEP 5 — UNIQUE CONSTRAINTS AND PARTIAL UNIQUE INDEXES
-- =============================================================================

-- At most one current-state projection row per publication subject.
alter table public.knowledge_publication_states
  add constraint ux_publication_states_subject_unique unique (entity_type, entity_id);

-- At most one null->draft bootstrap transition per publication subject,
-- database-enforced independent of RPC logic.
create unique index if not exists ux_transitions_bootstrap_once
  on public.knowledge_publication_state_transitions (entity_type, entity_id)
  where from_state is null;

-- Full-history version uniqueness for translations.
alter table public.knowledge_canonical_unit_translations
  add constraint ux_translations_full_history_unique
  unique (entity_type, entity_id, field_key, output_locale, translation_version);

-- HARD GATE B enforcement: at most one currently-active approved
-- translation per (entity_type, entity_id, field_key, output_locale).
-- translation_version is deliberately OUTSIDE this key.
create unique index if not exists ux_translations_active_approved_unique
  on public.knowledge_canonical_unit_translations (entity_type, entity_id, field_key, output_locale)
  where translation_status = 'approved'
    and superseded_at is null
    and invalidated_at is null
    and withdrawn_at is null;

-- =============================================================================
-- STEP 6 — ORDINARY QUERY INDEXES (13 indexes; combined with the 4 unique
-- constraints/partial unique indexes above, 17 index-plan objects total,
-- matching PHASE 9L's index plan with zero redundant duplicates)
-- =============================================================================

create index if not exists ix_publication_states_current_state
  on public.knowledge_publication_states (current_state);

create index if not exists ix_publication_states_review_required_partial
  on public.knowledge_publication_states (entity_type, entity_id)
  where current_state = 'review_required';

create index if not exists ix_publication_states_jurisdiction
  on public.knowledge_publication_states (jurisdiction_id);

create index if not exists ix_publication_states_current_transition
  on public.knowledge_publication_states (current_transition_id);

create index if not exists ix_transitions_entity_transitioned_at
  on public.knowledge_publication_state_transitions (entity_type, entity_id, transitioned_at);

create index if not exists ix_transitions_transitioned_at
  on public.knowledge_publication_state_transitions (transitioned_at);

create index if not exists ix_transitions_emergency_partial
  on public.knowledge_publication_state_transitions (entity_type, entity_id, transitioned_at)
  where emergency_flag = true;

create index if not exists ix_transitions_to_state_superseded_partial
  on public.knowledge_publication_state_transitions (entity_type, entity_id)
  where to_state = 'superseded';

create index if not exists ix_transitions_idempotency_key
  on public.knowledge_publication_state_transitions (entity_type, entity_id, idempotency_key);

create index if not exists ix_translations_review_pending_partial
  on public.knowledge_canonical_unit_translations (entity_type, entity_id, field_key)
  where translation_status in ('human_review_pending', 'machine_generated_pending_review');

create index if not exists ix_translations_invalidated_partial
  on public.knowledge_canonical_unit_translations (entity_type, entity_id, field_key)
  where invalidated_at is not null;

create index if not exists ix_translations_machine_pending_partial
  on public.knowledge_canonical_unit_translations (entity_type, entity_id)
  where machine_generated = true and translation_status = 'machine_generated_pending_review';

create index if not exists ix_translations_output_locale
  on public.knowledge_canonical_unit_translations (output_locale);

-- =============================================================================
-- STEP 7 — APPEND-ONLY / IMMUTABILITY TRIGGER FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Transition history is append-only from the first committed row: no
-- UPDATE and no DELETE is ever permitted through any ordinary code path.
create or replace function public.fn_publication_state_transitions_append_only()
returns trigger
language plpgsql
as $$
begin
  raise exception 'knowledge_publication_state_transitions: append-only, % is not permitted (id=%)',
    tg_op, coalesce(old.id, new.id);
end;
$$;

revoke all on function public.fn_publication_state_transitions_append_only() from public;

drop trigger if exists trg_publication_state_transitions_append_only on public.knowledge_publication_state_transitions;
create trigger trg_publication_state_transitions_append_only
  before update or delete on public.knowledge_publication_state_transitions
  for each row
  execute function public.fn_publication_state_transitions_append_only();

-- Defense-in-depth consistency guard: every write to the current-state
-- projection must reference a real, matching transition row for the same
-- (entity_type, entity_id, current_state).
create or replace function public.fn_publication_states_validate_write()
returns trigger
language plpgsql
as $$
declare
  v_transition_entity_type text;
  v_transition_entity_id uuid;
  v_transition_to_state text;
begin
  if not public.fn_publication_subject_exists(new.entity_type, new.entity_id) then
    raise exception 'knowledge_publication_states: unknown or nonexistent publication subject (entity_type=%, entity_id=%)',
      new.entity_type, new.entity_id;
  end if;

  select entity_type, entity_id, to_state
    into v_transition_entity_type, v_transition_entity_id, v_transition_to_state
    from public.knowledge_publication_state_transitions
    where id = new.current_transition_id;

  if v_transition_entity_type is null then
    raise exception 'knowledge_publication_states: current_transition_id % does not reference an existing transition row',
      new.current_transition_id;
  end if;

  if v_transition_entity_type is distinct from new.entity_type
     or v_transition_entity_id is distinct from new.entity_id
     or v_transition_to_state is distinct from new.current_state
  then
    raise exception 'knowledge_publication_states: current_transition_id % is inconsistent with (entity_type=%, entity_id=%, current_state=%)',
      new.current_transition_id, new.entity_type, new.entity_id, new.current_state;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.fn_publication_states_validate_write() from public;

drop trigger if exists trg_publication_states_validate_write on public.knowledge_publication_states;
create trigger trg_publication_states_validate_write
  before insert or update on public.knowledge_publication_states
  for each row
  execute function public.fn_publication_states_validate_write();

-- Approved-translation immutability, mirroring
-- knowledge_source_versions_protect_locked_content (migration 032). Once
-- verified_at is set, identity/content columns can never be mutated in
-- place; a correction must become a new translation_version row.
create or replace function public.fn_canonical_unit_translations_protect_verified()
returns trigger
language plpgsql
as $$
begin
  if old.verified_at is not null then
    if new.entity_type is distinct from old.entity_type
       or new.entity_id is distinct from old.entity_id
       or new.field_key is distinct from old.field_key
       or new.canonical_content_fingerprint is distinct from old.canonical_content_fingerprint
       or new.output_locale is distinct from old.output_locale
       or new.translation_version is distinct from old.translation_version
       or new.translated_text is distinct from old.translated_text
       or new.machine_generated is distinct from old.machine_generated
       or new.machine_provider is distinct from old.machine_provider
       or new.machine_model is distinct from old.machine_model
       or new.created_by_actor_type is distinct from old.created_by_actor_type
       or new.created_by_identifier is distinct from old.created_by_identifier
    then
      raise exception 'knowledge_canonical_unit_translations: verified/approved translation identity and content cannot be mutated (id=%)',
        old.id;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.fn_canonical_unit_translations_protect_verified() from public;

drop trigger if exists trg_canonical_unit_translations_protect_verified on public.knowledge_canonical_unit_translations;
create trigger trg_canonical_unit_translations_protect_verified
  before update on public.knowledge_canonical_unit_translations
  for each row
  execute function public.fn_canonical_unit_translations_protect_verified();

-- =============================================================================
-- STEP 8 — CANONICAL CHANGE INVALIDATION (selected mechanism:
-- canonical_table_triggers). One shared SECURITY DEFINER trigger function,
-- installed once per allowlisted (entity_type, field_key) pair — exactly
-- 8 installations, matching the 8-row translatable field allowlist —
-- fires AFTER UPDATE OF the single canonical column it is bound to.
-- =============================================================================

create or replace function public.fn_canonical_content_changed_invalidate_translations()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_entity_type text := tg_argv[0];
  v_field_key text := tg_argv[1];
  v_old_text text;
  v_new_text text;
  v_old_fingerprint text;
  v_new_fingerprint text;
  v_row record;
begin
  v_old_text := (to_jsonb(old) ->> v_field_key);
  v_new_text := (to_jsonb(new) ->> v_field_key);

  if v_old_text is distinct from v_new_text then
    v_old_fingerprint := public.fn_normalize_and_fingerprint_text(v_old_text);
    v_new_fingerprint := public.fn_normalize_and_fingerprint_text(v_new_text);

    if v_old_fingerprint is not null and v_old_fingerprint is distinct from v_new_fingerprint then
      for v_row in
        select id
          from public.knowledge_canonical_unit_translations
          where entity_type = v_entity_type
            and entity_id = new.id
            and field_key = v_field_key
            and canonical_content_fingerprint = v_old_fingerprint
            and translation_status = 'approved'
            and superseded_at is null
            and invalidated_at is null
            and withdrawn_at is null
      loop
        perform public.knowledge_invalidate_translation_for_canonical_change(v_row.id);
      end loop;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.fn_canonical_content_changed_invalidate_translations() from public;

-- The 8 allowlisted installations. Each is purely additive to an existing
-- migration-032 table: no column, constraint, RLS policy or grant on that
-- table is changed, and a legitimate write to any other column is
-- untouched (the trigger's OF-clause scopes it to exactly one column).

drop trigger if exists trg_claims_claim_text_canonical_invalidate on public.knowledge_claims;
create trigger trg_claims_claim_text_canonical_invalidate
  after update of claim_text_canonical on public.knowledge_claims
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('claim', 'claim_text_canonical');

drop trigger if exists trg_processes_title_invalidate on public.knowledge_processes;
create trigger trg_processes_title_invalidate
  after update of title on public.knowledge_processes
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('process', 'title');

drop trigger if exists trg_processes_trigger_description_invalidate on public.knowledge_processes;
create trigger trg_processes_trigger_description_invalidate
  after update of trigger_description on public.knowledge_processes
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('process', 'trigger_description');

drop trigger if exists trg_processes_safe_first_step_invalidate on public.knowledge_processes;
create trigger trg_processes_safe_first_step_invalidate
  after update of safe_first_step on public.knowledge_processes
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('process', 'safe_first_step');

drop trigger if exists trg_process_steps_title_invalidate on public.knowledge_process_steps;
create trigger trg_process_steps_title_invalidate
  after update of title on public.knowledge_process_steps
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('process_step', 'title');

drop trigger if exists trg_process_steps_description_canonical_invalidate on public.knowledge_process_steps;
create trigger trg_process_steps_description_canonical_invalidate
  after update of description_canonical on public.knowledge_process_steps
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('process_step', 'description_canonical');

drop trigger if exists trg_evidence_requirements_description_canonical_invalidate on public.knowledge_evidence_requirements;
create trigger trg_evidence_requirements_description_canonical_invalidate
  after update of description_canonical on public.knowledge_evidence_requirements
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('evidence_requirement', 'description_canonical');

drop trigger if exists trg_authority_competences_subject_matter_invalidate on public.knowledge_authority_competences;
create trigger trg_authority_competences_subject_matter_invalidate
  after update of subject_matter on public.knowledge_authority_competences
  for each row
  execute function public.fn_canonical_content_changed_invalidate_translations('authority_competence', 'subject_matter');

-- =============================================================================
-- STEP 9 — CONTROLLED WRITE-PATH RPC FUNCTIONS (SECURITY DEFINER, hardened
-- search_path, schema-qualified references throughout, no dynamic SQL)
-- =============================================================================

-- HARD GATE A bootstrap RPC. Inserts the null->draft transition row FIRST
-- (self-contained, needs nothing from the states row), then the states
-- row SECOND referencing the transition's now-real id. Any failure aborts
-- the whole implicit function-call transaction: no partial graph is ever
-- committed.
--
-- PATCH 9M-PATCH: no `p_actor_class` parameter. Bootstrap is a single
-- fixed-authority operation — the actor class 'migration_bootstrap_system_actor'
-- is a hardcoded literal owned by this function, never caller-selectable.
-- `p_actor_audit_identifier` is accepted purely as non-authoritative audit
-- metadata (e.g. a job/run correlation id); it is stored on the transition
-- row for traceability only and never evaluated for authorization.
create or replace function public.knowledge_bootstrap_publication_subject(
  p_entity_type text,
  p_entity_id uuid,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(publication_state_id uuid, transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_bootstrap_actor_class constant text := 'migration_bootstrap_system_actor';
  v_transition_id uuid;
  v_state_id uuid;
  v_existing_transition_id uuid;
  v_existing_idempotency_key text;
  v_existing_state_id uuid;
  v_existing_current_transition_id uuid;
  v_existing_current_state text;
  v_existing_state_version integer;
begin
  if p_entity_type is null or p_entity_type not in (
    'source', 'source_version', 'claim', 'process', 'process_step',
    'document_requirement', 'deadline_rule', 'authority_resolution_unit',
    'warning_unit', 'outcome_unit', 'canonical_translation', 'complete_process_pack_version'
  ) then
    raise exception 'unknown_entity_type: %', p_entity_type;
  end if;

  if p_entity_id is null then
    raise exception 'nonexistent_entity_id: entity_id must not be null';
  end if;

  if not public.fn_publication_subject_exists(p_entity_type, p_entity_id) then
    raise exception 'nonexistent_entity_id: no % row found for id %', p_entity_type, p_entity_id;
  end if;

  if p_idempotency_key is null or length(p_idempotency_key) = 0 then
    raise exception 'idempotency_key_required';
  end if;

  begin
    insert into public.knowledge_publication_state_transitions (
      entity_type, entity_id, from_state, to_state, from_state_version, resulting_state_version,
      transition_reason_code, actor_class, actor_identifier, expected_state_version, idempotency_key
    ) values (
      p_entity_type, p_entity_id, null, 'draft', 0, 1,
      'initial_draft', v_bootstrap_actor_class, p_actor_audit_identifier, 0, p_idempotency_key
    )
    returning id into v_transition_id;

  exception when unique_violation then
    select t.id, t.idempotency_key into v_existing_transition_id, v_existing_idempotency_key
      from public.knowledge_publication_state_transitions t
      where t.entity_type = p_entity_type and t.entity_id = p_entity_id and t.from_state is null;

    if v_existing_idempotency_key is distinct from p_idempotency_key then
      raise exception 'publication_subject_already_bootstrapped: % / % already has a bootstrap transition', p_entity_type, p_entity_id;
    end if;

    select s.id, s.current_transition_id, s.current_state, s.state_version
      into v_existing_state_id, v_existing_current_transition_id, v_existing_current_state, v_existing_state_version
      from public.knowledge_publication_states s
      where s.entity_type = p_entity_type and s.entity_id = p_entity_id;

    return query select v_existing_state_id, v_existing_current_transition_id, v_existing_current_state, v_existing_state_version;
    return;
  end;

  insert into public.knowledge_publication_states (
    entity_type, entity_id, current_state, current_transition_id, state_version
  ) values (
    p_entity_type, p_entity_id, 'draft', v_transition_id, 1
  )
  returning id into v_state_id;

  return query select v_state_id, v_transition_id, 'draft'::text, 1;
end;
$$;

revoke all on function public.knowledge_bootstrap_publication_subject(text, uuid, text, text) from public;
grant execute on function public.knowledge_bootstrap_publication_subject(text, uuid, text, text) to service_role;

-- Authoritative transition engine. Locks the current-state row with
-- SELECT ... FOR UPDATE, compares expected_state_version under that lock,
-- validates the requested edge against the fixed 20-rule state machine
-- (19 non-bootstrap rules; the null->draft bootstrap edge is exclusively
-- handled by the bootstrap RPC above), inserts the immutable transition
-- row, then updates the projection — both in the same implicit
-- function-call transaction.
--
-- PATCH 9M-PATCH: INTERNAL-ONLY ENGINE. This function is deliberately NOT
-- granted EXECUTE to service_role (see the removed grant below this
-- function body) or to any other role. It remains SECURITY DEFINER with a
-- hardened search_path purely so the narrow wrapper RPCs below — which
-- ARE granted to service_role — can invoke it directly via a same-session
-- SQL function call while it still enforces the full state machine, the
-- optimistic-concurrency lock and the per-target-state actor guards below
-- as defense in depth. `p_actor_class` remains a parameter of this
-- internal engine, but it is never reachable from a caller: every wrapper
-- passes it as a hardcoded literal constant, never as a forwarded
-- caller-supplied value. A direct RPC call to this function by anything
-- other than the function owner is refused by Postgres because no role
-- holds EXECUTE on it.
create or replace function public.knowledge_transition_publication_state(
  p_entity_type text,
  p_entity_id uuid,
  p_to_state text,
  p_expected_state_version integer,
  p_reason_code text,
  p_reason_text text,
  p_actor_class text,
  p_actor_identifier text,
  p_review_record_id uuid,
  p_replacement_entity_type text,
  p_replacement_entity_id uuid,
  p_emergency boolean,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_state_id uuid;
  v_current_state text;
  v_current_transition_id uuid;
  v_state_version integer;
  v_new_transition_id uuid;
  v_replay_transition_id uuid;
  v_replay_state text;
  v_replay_version integer;
  v_authorized boolean;
begin
  if p_actor_class is null or p_actor_class not in (
    'automated_ingestion_system', 'authorized_reviewer', 'publication_administrator',
    'emergency_suspension_authority', 'migration_bootstrap_system_actor'
  ) then
    raise exception 'unauthorized_actor_class: % is not a recognized actor class', p_actor_class;
  end if;

  if p_idempotency_key is null or length(p_idempotency_key) = 0 then
    raise exception 'idempotency_key_required';
  end if;

  select s.id, s.current_state, s.current_transition_id, s.state_version
    into v_state_id, v_current_state, v_current_transition_id, v_state_version
    from public.knowledge_publication_states s
    where s.entity_type = p_entity_type and s.entity_id = p_entity_id
    for update;

  if v_state_id is null then
    raise exception 'publication_subject_not_bootstrapped: % / % has no current-state projection row', p_entity_type, p_entity_id;
  end if;

  if v_state_version <> p_expected_state_version then
    select t.id, t.to_state, t.resulting_state_version
      into v_replay_transition_id, v_replay_state, v_replay_version
      from public.knowledge_publication_state_transitions t
      where t.entity_type = p_entity_type and t.entity_id = p_entity_id
        and t.idempotency_key = p_idempotency_key
        and t.resulting_state_version = v_state_version;

    if v_replay_transition_id is not null then
      return query select v_replay_transition_id, v_replay_state, v_replay_version;
      return;
    end if;

    raise exception 'publication_state_version_conflict: expected % but current is %', p_expected_state_version, v_state_version;
  end if;

  v_authorized := false;
  case
    when v_current_state = 'draft' and p_to_state = 'evidence_incomplete' then v_authorized := true;
    when v_current_state = 'draft' and p_to_state = 'review_required' then v_authorized := true;
    when v_current_state = 'evidence_incomplete' and p_to_state = 'review_required' then v_authorized := true;
    when v_current_state = 'review_required' and p_to_state = 'approved' then v_authorized := true;
    when v_current_state = 'review_required' and p_to_state = 'evidence_incomplete' then v_authorized := true;
    when v_current_state = 'approved' and p_to_state = 'publication_eligible' then v_authorized := true;
    when v_current_state = 'approved' and p_to_state = 'review_required' then v_authorized := true;
    when v_current_state = 'publication_eligible' and p_to_state = 'published' then v_authorized := true;
    when v_current_state = 'publication_eligible' and p_to_state = 'review_required' then v_authorized := true;
    when v_current_state = 'published' and p_to_state = 'suspended' then v_authorized := true;
    when v_current_state = 'suspended' and p_to_state = 'published' then v_authorized := true;
    when v_current_state = 'suspended' and p_to_state = 'review_required' then v_authorized := true;
    when v_current_state = 'published' and p_to_state = 'superseded' then v_authorized := true;
    when v_current_state = 'published' and p_to_state = 'withdrawn' then v_authorized := true;
    when v_current_state = 'publication_eligible' and p_to_state = 'withdrawn' then v_authorized := true;
    when v_current_state = 'approved' and p_to_state = 'withdrawn' then v_authorized := true;
    when v_current_state = 'review_required' and p_to_state = 'withdrawn' then v_authorized := true;
    when v_current_state = 'draft' and p_to_state = 'withdrawn' then v_authorized := true;
    when v_current_state = 'evidence_incomplete' and p_to_state = 'withdrawn' then v_authorized := true;
    else v_authorized := false;
  end case;

  if not v_authorized then
    raise exception 'transition_not_allowed: % -> % is not a permitted publication-state edge', v_current_state, p_to_state;
  end if;

  if p_to_state in ('withdrawn', 'suspended', 'superseded') and (p_reason_text is null or length(p_reason_text) = 0) then
    raise exception 'missing_required_reason: % -> % requires a reason', v_current_state, p_to_state;
  end if;

  if v_current_state = 'suspended' and p_to_state = 'published' and (p_reason_text is null or length(p_reason_text) = 0) then
    raise exception 'missing_required_reason: suspended -> published requires a reason';
  end if;

  if v_current_state = 'review_required' and p_to_state = 'evidence_incomplete' and (p_reason_text is null or length(p_reason_text) = 0) then
    raise exception 'missing_required_reason: review_required -> evidence_incomplete requires a reason';
  end if;

  if v_current_state = 'approved' and p_to_state = 'review_required' and (p_reason_text is null or length(p_reason_text) = 0) then
    raise exception 'missing_required_reason: approved -> review_required requires a reason';
  end if;

  if v_current_state = 'publication_eligible' and p_to_state = 'review_required' and (p_reason_text is null or length(p_reason_text) = 0) then
    raise exception 'missing_required_reason: publication_eligible -> review_required requires a reason';
  end if;

  if v_current_state = 'suspended' and p_to_state = 'review_required' and (p_reason_text is null or length(p_reason_text) = 0) then
    raise exception 'missing_required_reason: suspended -> review_required requires a reason';
  end if;

  if p_to_state = 'approved' and p_review_record_id is null then
    raise exception 'missing_required_evidence: review_required -> approved requires a review_record_id';
  end if;

  if p_to_state = 'superseded' then
    if p_replacement_entity_id is null or p_replacement_entity_type is null then
      raise exception 'missing_required_replacement: published -> superseded requires a replacement entity';
    end if;
    if p_replacement_entity_id = p_entity_id then
      raise exception 'invalid_replacement: replacement entity cannot equal the subject being superseded';
    end if;
    if not public.fn_publication_subject_exists(p_replacement_entity_type, p_replacement_entity_id) then
      raise exception 'invalid_replacement: replacement entity does not exist';
    end if;
  end if;

  if p_to_state = 'superseded' and p_actor_class <> 'publication_administrator' then
    raise exception 'unauthorized_actor_class: supersession requires publication_administrator';
  end if;

  if coalesce(p_emergency, false) and p_to_state <> 'suspended' then
    raise exception 'invalid_emergency_transition: emergency transitions may only move to suspended';
  end if;

  if coalesce(p_emergency, false) and p_actor_class <> 'emergency_suspension_authority' then
    raise exception 'unauthorized_actor_class: emergency suspension requires emergency_suspension_authority';
  end if;

  if p_to_state = 'withdrawn' and p_actor_class <> 'publication_administrator' then
    raise exception 'unauthorized_actor_class: withdrawal requires publication_administrator';
  end if;

  if p_to_state = 'published' and p_actor_class <> 'publication_administrator' then
    raise exception 'unauthorized_actor_class: publication requires publication_administrator';
  end if;

  if p_to_state = 'approved' and p_actor_class <> 'authorized_reviewer' then
    raise exception 'unauthorized_actor_class: approval requires authorized_reviewer';
  end if;

  if p_to_state = 'publication_eligible' and p_actor_class <> 'publication_administrator' then
    raise exception 'unauthorized_actor_class: publication_eligible requires publication_administrator';
  end if;

  insert into public.knowledge_publication_state_transitions (
    entity_type, entity_id, from_state, to_state, from_state_version, resulting_state_version,
    transition_reason_code, transition_reason, actor_class, actor_identifier, review_record_id,
    expected_state_version, replacement_entity_type, replacement_entity_id, emergency_flag, idempotency_key
  ) values (
    p_entity_type, p_entity_id, v_current_state, p_to_state, v_state_version, v_state_version + 1,
    coalesce(p_reason_code, 'manual_correction'), p_reason_text, p_actor_class, p_actor_identifier, p_review_record_id,
    p_expected_state_version, p_replacement_entity_type, p_replacement_entity_id, coalesce(p_emergency, false), p_idempotency_key
  )
  returning id into v_new_transition_id;

  update public.knowledge_publication_states
    set current_state = p_to_state,
        current_transition_id = v_new_transition_id,
        state_version = v_state_version + 1,
        reason_code = p_reason_code,
        emergency_disabled = coalesce(p_emergency, false)
    where id = v_state_id and state_version = p_expected_state_version;

  if not found then
    raise exception 'publication_state_version_conflict: concurrent update detected during commit';
  end if;

  return query select v_new_transition_id, p_to_state, v_state_version + 1;
end;
$$;

revoke all on function public.knowledge_transition_publication_state(text, uuid, text, integer, text, text, text, text, uuid, text, uuid, boolean, text) from public;
-- PATCH 9M-PATCH: intentionally NO `grant execute ... to service_role` line
-- for this function. It is the internal engine described above; only the
-- narrow wrappers below are granted.

-- =============================================================================
-- STEP 9A (PATCH 9M-PATCH) — NARROW, OPERATION-SCOPED PUBLICATION WRAPPERS.
-- Each wrapper below is the ONLY grantable entry point for its declared
-- (source-state -> target-state) edge set, hardcodes its own actor class as
-- a literal constant, and performs its own pre-check read of the live
-- current_state to refuse being used outside its declared scope — even
-- though the internal engine's own matrix would independently allow the
-- same (source, target) pair. Together the wrappers below plus the
-- bootstrap RPC above reach every one of the approved 20 transition rules
-- (1 bootstrap edge + 19 non-bootstrap edges) and no others:
--   knowledge_advance_publication_evidence_status:      draft->evidence_incomplete, draft->review_required, evidence_incomplete->review_required   (3 edges, automated_ingestion_system)
--   knowledge_record_publication_review_decision:        review_required->approved, review_required->evidence_incomplete                            (2 edges, authorized_reviewer)
--   knowledge_recall_publication_to_review:              approved->review_required, publication_eligible->review_required, suspended->review_required (3 edges, authorized_reviewer)
--   knowledge_advance_publication_lifecycle:              approved->publication_eligible, publication_eligible->published, suspended->published        (3 edges, publication_administrator)
--   knowledge_supersede_publication_subject:              published->superseded                                                                       (1 edge,  publication_administrator)
--   knowledge_withdraw_publication_subject:               {draft,evidence_incomplete,review_required,approved,publication_eligible,published}->withdrawn (6 edges, publication_administrator)
--   knowledge_suspend_publication_for_detected_issue:     published->suspended (routine/system-detected reasons)                                       (1 edge,  automated_ingestion_system)
--   knowledge_emergency_suspend_publication_subject:      published->suspended (emergency_governance_suspension reason only)                           (shares the same 1 edge, emergency_suspension_authority)
-- 3+2+3+3+1+6+1 = 19 distinct non-bootstrap edges, matching
-- publicationTransitionRuleCount's non-bootstrap component exactly.
-- =============================================================================

-- Automated evidence-workflow progression. Actor class is always
-- 'automated_ingestion_system'; the caller cannot choose or forward a
-- different class. Scope-limited to the 3 evidence-progression edges that
-- do not grant approval, publication, withdrawal or emergency authority.
create or replace function public.knowledge_advance_publication_evidence_status(
  p_entity_type text,
  p_entity_id uuid,
  p_to_state text,
  p_expected_state_version integer,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'automated_ingestion_system';
  v_precheck_current_state text;
begin
  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if p_to_state not in ('evidence_incomplete', 'review_required') then
    raise exception 'operation_scope_violation: knowledge_advance_publication_evidence_status may only target evidence_incomplete or review_required';
  end if;

  if v_precheck_current_state is null
     or not (
       (v_precheck_current_state = 'draft' and p_to_state in ('evidence_incomplete', 'review_required'))
       or (v_precheck_current_state = 'evidence_incomplete' and p_to_state = 'review_required')
     )
  then
    raise exception 'operation_scope_violation: % -> % is outside the evidence-workflow operation scope', v_precheck_current_state, p_to_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, p_to_state, p_expected_state_version,
      null, p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, null, null, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_advance_publication_evidence_status(text, uuid, text, integer, text, text, text) from public;
grant execute on function public.knowledge_advance_publication_evidence_status(text, uuid, text, integer, text, text, text) to service_role;

-- First reviewer decision on an item in review_required: approve it, or
-- return it for more evidence. Actor class is always 'authorized_reviewer'
-- and cannot be supplied or forwarded by the caller. review_record_id is
-- required only for the approve branch (mirrored by the internal engine's
-- own guard); a reason is required only for the return branch.
create or replace function public.knowledge_record_publication_review_decision(
  p_entity_type text,
  p_entity_id uuid,
  p_to_state text,
  p_expected_state_version integer,
  p_review_record_id uuid,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'authorized_reviewer';
  v_precheck_current_state text;
begin
  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if p_to_state not in ('approved', 'evidence_incomplete') then
    raise exception 'operation_scope_violation: knowledge_record_publication_review_decision may only target approved or evidence_incomplete';
  end if;

  if v_precheck_current_state is distinct from 'review_required' then
    raise exception 'operation_scope_violation: % -> % is outside the review-decision operation scope', v_precheck_current_state, p_to_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, p_to_state, p_expected_state_version,
      null, p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      p_review_record_id, null, null, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_record_publication_review_decision(text, uuid, text, integer, uuid, text, text, text) from public;
grant execute on function public.knowledge_record_publication_review_decision(text, uuid, text, integer, uuid, text, text, text) to service_role;

-- Reviewer recall of an already-approved, already-eligible, or suspended
-- subject back into review_required. Actor class is always
-- 'authorized_reviewer'. Fixed target state; source constrained to the 3
-- approved states that may legitimately be pulled back for re-review.
create or replace function public.knowledge_recall_publication_to_review(
  p_entity_type text,
  p_entity_id uuid,
  p_expected_state_version integer,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'authorized_reviewer';
  v_precheck_current_state text;
begin
  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if v_precheck_current_state not in ('approved', 'publication_eligible', 'suspended') then
    raise exception 'operation_scope_violation: % -> review_required is outside the recall-to-review operation scope', v_precheck_current_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, 'review_required', p_expected_state_version,
      null, p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, null, null, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_recall_publication_to_review(text, uuid, integer, text, text, text) from public;
grant execute on function public.knowledge_recall_publication_to_review(text, uuid, integer, text, text, text) to service_role;

-- Publication-administrator forward-lifecycle progression: mark eligible,
-- publish, or reinstate from suspension. Actor class is always
-- 'publication_administrator'. p_decision is a closed, internally-mapped
-- enum — never a raw pass-through target state — so the caller cannot
-- request an unrelated transition through this wrapper.
create or replace function public.knowledge_advance_publication_lifecycle(
  p_entity_type text,
  p_entity_id uuid,
  p_decision text,
  p_expected_state_version integer,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'publication_administrator';
  v_precheck_current_state text;
  v_to_state text;
begin
  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if p_decision = 'mark_eligible' then
    v_to_state := 'publication_eligible';
    if v_precheck_current_state is distinct from 'approved' then
      raise exception 'operation_scope_violation: % -> publication_eligible is outside the mark_eligible operation scope', v_precheck_current_state;
    end if;
  elsif p_decision = 'publish' then
    v_to_state := 'published';
    if v_precheck_current_state is distinct from 'publication_eligible' then
      raise exception 'operation_scope_violation: % -> published is outside the publish operation scope', v_precheck_current_state;
    end if;
  elsif p_decision = 'reinstate' then
    v_to_state := 'published';
    if v_precheck_current_state is distinct from 'suspended' then
      raise exception 'operation_scope_violation: % -> published is outside the reinstate operation scope', v_precheck_current_state;
    end if;
  else
    raise exception 'operation_scope_violation: unrecognized decision % for knowledge_advance_publication_lifecycle', p_decision;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, v_to_state, p_expected_state_version,
      null, p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, null, null, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_advance_publication_lifecycle(text, uuid, text, integer, text, text, text) from public;
grant execute on function public.knowledge_advance_publication_lifecycle(text, uuid, text, integer, text, text, text) to service_role;

-- Supersession by a replacement subject. Actor class is always
-- 'publication_administrator'. Fixed (published -> superseded) edge only;
-- replacement validation is still enforced inside the internal engine.
create or replace function public.knowledge_supersede_publication_subject(
  p_entity_type text,
  p_entity_id uuid,
  p_expected_state_version integer,
  p_reason_text text,
  p_replacement_entity_type text,
  p_replacement_entity_id uuid,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'publication_administrator';
  v_precheck_current_state text;
begin
  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if v_precheck_current_state is distinct from 'published' then
    raise exception 'operation_scope_violation: % -> superseded is outside the supersession operation scope', v_precheck_current_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, 'superseded', p_expected_state_version,
      'superseded_by_new_version', p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, p_replacement_entity_type, p_replacement_entity_id, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_supersede_publication_subject(text, uuid, integer, text, text, uuid, text, text) from public;
grant execute on function public.knowledge_supersede_publication_subject(text, uuid, integer, text, text, uuid, text, text) to service_role;

-- Withdrawal, terminal from any of the 6 allowed non-terminal source
-- states. Actor class is always 'publication_administrator'. Fixed target
-- state; a non-empty reason is mandatory (also re-checked by the engine).
create or replace function public.knowledge_withdraw_publication_subject(
  p_entity_type text,
  p_entity_id uuid,
  p_expected_state_version integer,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'publication_administrator';
  v_precheck_current_state text;
begin
  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if v_precheck_current_state not in (
    'draft', 'evidence_incomplete', 'review_required', 'approved', 'publication_eligible', 'published'
  ) then
    raise exception 'operation_scope_violation: % -> withdrawn is outside the withdrawal operation scope', v_precheck_current_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, 'withdrawn', p_expected_state_version,
      'withdrawn_reason_required', p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, null, null, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_withdraw_publication_subject(text, uuid, integer, text, text, text) from public;
grant execute on function public.knowledge_withdraw_publication_subject(text, uuid, integer, text, text, text) to service_role;

-- Routine, non-emergency suspension for a system-detected issue (stale
-- source, conflicting facts, authority resolution error, or a translation
-- defect). Actor class is always 'automated_ingestion_system'. Reason code
-- is constrained to the 4 detection reasons; the emergency reason/actor
-- pair is exclusively reserved for the emergency wrapper below.
create or replace function public.knowledge_suspend_publication_for_detected_issue(
  p_entity_type text,
  p_entity_id uuid,
  p_expected_state_version integer,
  p_reason_code text,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'automated_ingestion_system';
  v_precheck_current_state text;
begin
  if p_reason_code not in (
    'stale_source_suspension', 'conflict_suspension', 'authority_error_suspension', 'translation_defect_suspension'
  ) then
    raise exception 'operation_scope_violation: % is not a routine detected-issue suspension reason', p_reason_code;
  end if;

  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if v_precheck_current_state is distinct from 'published' then
    raise exception 'operation_scope_violation: % -> suspended is outside the detected-issue suspension operation scope', v_precheck_current_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, 'suspended', p_expected_state_version,
      p_reason_code, p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, null, null, false, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_suspend_publication_for_detected_issue(text, uuid, integer, text, text, text, text) from public;
grant execute on function public.knowledge_suspend_publication_for_detected_issue(text, uuid, integer, text, text, text, text) to service_role;

-- Emergency suspension wrapper: delegates to the same validated internal
-- transition engine above with a hardcoded, non-caller-selectable reason
-- code and actor class, rather than an independent bypass update. Can
-- only ever move the projection from published toward 'suspended'.
-- PATCH 9M-PATCH: parameter renamed to p_actor_audit_identifier to make
-- explicit that it is non-authoritative audit metadata only; the actor
-- class 'emergency_suspension_authority' was already, and remains, a
-- hardcoded literal never accepted from the caller.
create or replace function public.knowledge_emergency_suspend_publication_subject(
  p_entity_type text,
  p_entity_id uuid,
  p_expected_state_version integer,
  p_reason_text text,
  p_actor_audit_identifier text,
  p_idempotency_key text
)
returns table(transition_id uuid, current_state text, state_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_wrapper_actor_class constant text := 'emergency_suspension_authority';
  v_precheck_current_state text;
begin
  if p_reason_text is null or length(p_reason_text) = 0 then
    raise exception 'missing_reason: emergency suspension requires a reason';
  end if;

  select current_state into v_precheck_current_state
    from public.knowledge_publication_states
    where entity_type = p_entity_type and entity_id = p_entity_id;

  if v_precheck_current_state is distinct from 'published' then
    raise exception 'operation_scope_violation: % -> suspended is outside the emergency suspension operation scope', v_precheck_current_state;
  end if;

  return query
    select * from public.knowledge_transition_publication_state(
      p_entity_type, p_entity_id, 'suspended', p_expected_state_version,
      'emergency_governance_suspension', p_reason_text, v_wrapper_actor_class, p_actor_audit_identifier,
      null, null, null, true, p_idempotency_key
    );
end;
$$;

revoke all on function public.knowledge_emergency_suspend_publication_subject(text, uuid, integer, text, text, text) from public;
grant execute on function public.knowledge_emergency_suspend_publication_subject(text, uuid, integer, text, text, text) to service_role;

-- Internal (non-grantable) translation-candidate creation core. The
-- canonical fingerprint is always database-derived from the live
-- allowlisted canonical column; a caller may optionally pass an expected
-- fingerprint purely as an optimistic staleness assertion, which is
-- verified and rejected early on mismatch but never persisted in place of
-- the freshly-derived value.
--
-- PATCH 9M-PATCH: this core no longer accepts a caller-controlled
-- `p_created_by_actor_type`. It is invoked only by the two fixed-actor
-- wrappers below, each of which hardcodes both the creator actor class and
-- the machine_generated/initial-status pairing as literal constants, so a
-- caller can never claim `authorized_reviewer` while machine-generating
-- content, or vice versa.
create or replace function public.fn_create_translation_candidate_core(
  p_entity_type text,
  p_entity_id uuid,
  p_field_key text,
  p_output_locale text,
  p_translated_text text,
  p_machine_generated boolean,
  p_machine_provider text,
  p_machine_model text,
  p_created_by_actor_class text,
  p_created_by_audit_identifier text,
  p_expected_fingerprint text
)
returns table(translation_id uuid, canonical_content_fingerprint text, translation_version integer, translation_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_target_exists boolean;
  v_canonical_content text;
  v_fingerprint text;
  v_next_version integer;
  v_translation_id uuid;
  v_initial_status text;
begin
  if p_output_locale = 'de' then
    raise exception 'german_output_locale_rejected';
  end if;

  if p_output_locale is null or p_output_locale not in ('en', 'sk', 'cs', 'pl', 'hu') then
    raise exception 'inactive_future_locale_rejected: % is not an active launch output locale', p_output_locale;
  end if;

  select target_exists, canonical_content into v_target_exists, v_canonical_content
    from public.fn_translation_target_exists(p_entity_type, p_entity_id, p_field_key);

  if not v_target_exists then
    raise exception 'unknown_entity_type_field_key_combination: % / % is not an allowlisted translatable field, or the id does not exist', p_entity_type, p_field_key;
  end if;

  if v_canonical_content is null then
    raise exception 'canonical_content_null_not_translatable: % / % has no canonical content to translate', p_entity_type, p_field_key;
  end if;

  v_fingerprint := public.fn_normalize_and_fingerprint_text(v_canonical_content);

  if p_expected_fingerprint is not null and p_expected_fingerprint <> v_fingerprint then
    raise exception 'optimistic_fingerprint_assertion_mismatch: canonical content has changed since it was last read';
  end if;

  select coalesce(max(translation_version), 0) + 1 into v_next_version
    from public.knowledge_canonical_unit_translations
    where entity_type = p_entity_type and entity_id = p_entity_id and field_key = p_field_key and output_locale = p_output_locale;

  v_initial_status := case when p_machine_generated then 'machine_generated_pending_review' else 'human_review_pending' end;

  insert into public.knowledge_canonical_unit_translations (
    entity_type, entity_id, field_key, canonical_content_fingerprint, output_locale, translated_text,
    translation_version, translation_status, machine_generated, machine_provider, machine_model,
    created_by_actor_type, created_by_identifier
  ) values (
    p_entity_type, p_entity_id, p_field_key, v_fingerprint, p_output_locale, p_translated_text,
    v_next_version, v_initial_status, p_machine_generated, p_machine_provider, p_machine_model,
    p_created_by_actor_class, p_created_by_audit_identifier
  )
  returning id into v_translation_id;

  return query select v_translation_id, v_fingerprint, v_next_version, v_initial_status;
end;
$$;

revoke all on function public.fn_create_translation_candidate_core(text, uuid, text, text, text, boolean, text, text, text, text, text) from public;
-- PATCH 9M-PATCH: intentionally no service_role grant on the core function;
-- only the two fixed-actor wrappers below are grantable.

-- Machine-generated candidate creation. Actor class is always
-- 'automated_ingestion_system' and machine_generated is always true —
-- both hardcoded, never caller-supplied — so the initial status is always
-- 'machine_generated_pending_review'.
create or replace function public.knowledge_create_machine_translation_candidate(
  p_entity_type text,
  p_entity_id uuid,
  p_field_key text,
  p_output_locale text,
  p_translated_text text,
  p_machine_provider text,
  p_machine_model text,
  p_created_by_audit_identifier text,
  p_expected_fingerprint text
)
returns table(translation_id uuid, canonical_content_fingerprint text, translation_version integer, translation_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return query
    select * from public.fn_create_translation_candidate_core(
      p_entity_type, p_entity_id, p_field_key, p_output_locale, p_translated_text,
      true, p_machine_provider, p_machine_model,
      'automated_ingestion_system', p_created_by_audit_identifier, p_expected_fingerprint
    );
end;
$$;

revoke all on function public.knowledge_create_machine_translation_candidate(text, uuid, text, text, text, text, text, text, text) from public;
grant execute on function public.knowledge_create_machine_translation_candidate(text, uuid, text, text, text, text, text, text, text) to service_role;

-- Human-authored candidate creation. Actor class is always
-- 'authorized_reviewer' and machine_generated is always false — both
-- hardcoded, never caller-supplied — so the initial status is always
-- 'human_review_pending'.
create or replace function public.knowledge_create_human_translation_candidate(
  p_entity_type text,
  p_entity_id uuid,
  p_field_key text,
  p_output_locale text,
  p_translated_text text,
  p_created_by_audit_identifier text,
  p_expected_fingerprint text
)
returns table(translation_id uuid, canonical_content_fingerprint text, translation_version integer, translation_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return query
    select * from public.fn_create_translation_candidate_core(
      p_entity_type, p_entity_id, p_field_key, p_output_locale, p_translated_text,
      false, null, null,
      'authorized_reviewer', p_created_by_audit_identifier, p_expected_fingerprint
    );
end;
$$;

revoke all on function public.knowledge_create_human_translation_candidate(text, uuid, text, text, text, text, text) from public;
grant execute on function public.knowledge_create_human_translation_candidate(text, uuid, text, text, text, text, text) to service_role;

-- Submission does not establish or record reviewer authority; it only
-- moves a candidate into a review-pending status. p_actor_audit_identifier
-- is accepted purely as non-authoritative audit metadata and is not
-- persisted or evaluated for authorization.
create or replace function public.knowledge_submit_translation_for_review(
  p_translation_id uuid,
  p_actor_audit_identifier text
)
returns table(translation_id uuid, translation_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_status text;
begin
  select translation_status into v_status
    from public.knowledge_canonical_unit_translations
    where id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status = 'human_review_pending' then
    return query select p_translation_id, v_status;
    return;
  end if;

  if v_status not in ('draft', 'machine_generated_pending_review', 'invalidated_pending_review') then
    raise exception 'translation_not_in_reviewable_status: current status is %', v_status;
  end if;

  update public.knowledge_canonical_unit_translations
    set translation_status = 'human_review_pending'
    where id = p_translation_id;

  return query select p_translation_id, 'human_review_pending'::text;
end;
$$;

revoke all on function public.knowledge_submit_translation_for_review(uuid, text) from public;
grant execute on function public.knowledge_submit_translation_for_review(uuid, text) to service_role;

-- Approval never trusts caller-provided claims. The reviewer AUTHORITY
-- class ('authorized_reviewer') is a hardcoded literal below — it is
-- never a caller-supplied parameter. p_reviewer_audit_identifier is
-- accepted only as non-authoritative audit metadata; its sole use is a
-- best-effort self-approval heuristic (comparing two audit identifiers for
-- equality does not grant any authority, it only blocks an obvious
-- conflict of interest), and the canonical fingerprint is recalculated
-- fresh and compared before allowing approval to proceed (a stale
-- candidate is rejected outright).
create or replace function public.knowledge_approve_translation(
  p_translation_id uuid,
  p_reviewer_audit_identifier text,
  p_review_record_id uuid
)
returns table(translation_id uuid, translation_status text, verified_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_reviewer_actor_class constant text := 'authorized_reviewer';
  v_status text;
  v_created_by_identifier text;
  v_entity_type text;
  v_entity_id uuid;
  v_field_key text;
  v_stored_fingerprint text;
  v_current_content text;
  v_current_fingerprint text;
  v_target_exists boolean;
  v_verified_at timestamptz;
begin
  if p_reviewer_audit_identifier is null then
    raise exception 'missing_reviewer_audit_identifier: a reviewer audit identifier is required';
  end if;

  if p_review_record_id is null then
    raise exception 'review_record_missing';
  end if;

  select translation_status, created_by_identifier, entity_type, entity_id, field_key, canonical_content_fingerprint
    into v_status, v_created_by_identifier, v_entity_type, v_entity_id, v_field_key, v_stored_fingerprint
    from public.knowledge_canonical_unit_translations
    where id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status = 'approved' then
    select verified_at into v_verified_at from public.knowledge_canonical_unit_translations where id = p_translation_id;
    return query select p_translation_id, v_status, v_verified_at;
    return;
  end if;

  if v_status <> 'human_review_pending' then
    raise exception 'translation_not_in_reviewable_status: current status is %', v_status;
  end if;

  if v_created_by_identifier is not null and v_created_by_identifier = p_reviewer_audit_identifier then
    raise exception 'self_approval_blocked: reviewer cannot approve their own translation candidate';
  end if;

  select target_exists, canonical_content into v_target_exists, v_current_content
    from public.fn_translation_target_exists(v_entity_type, v_entity_id, v_field_key);

  if not v_target_exists then
    raise exception 'unknown_entity_type_field_key_combination';
  end if;

  v_current_fingerprint := public.fn_normalize_and_fingerprint_text(v_current_content);

  if v_current_fingerprint is distinct from v_stored_fingerprint then
    raise exception 'canonical_fingerprint_stale_reapprove_rejected: canonical content has changed since this candidate was created';
  end if;

  update public.knowledge_canonical_unit_translations
    set translation_status = 'approved',
        human_reviewed = true,
        uncertainty_preserved = true,
        warnings_preserved = true,
        numeric_and_deadline_values_preserved = true,
        reviewed_by_actor_type = v_reviewer_actor_class,
        reviewed_by_identifier = p_reviewer_audit_identifier,
        review_record_id = p_review_record_id,
        verified_at = now()
    where id = p_translation_id
    returning verified_at into v_verified_at;

  return query select p_translation_id, 'approved'::text, v_verified_at;
end;
$$;

revoke all on function public.knowledge_approve_translation(uuid, text, uuid) from public;
grant execute on function public.knowledge_approve_translation(uuid, text, uuid) to service_role;

-- Reviewer AUTHORITY class ('authorized_reviewer') is a hardcoded literal
-- below — never a caller-supplied parameter. p_reviewer_audit_identifier
-- is accepted only as non-authoritative audit metadata.
create or replace function public.knowledge_reject_translation(
  p_translation_id uuid,
  p_reviewer_audit_identifier text,
  p_rejection_reason text
)
returns table(translation_id uuid, translation_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_reviewer_actor_class constant text := 'authorized_reviewer';
  v_status text;
begin
  if p_rejection_reason is null or length(p_rejection_reason) = 0 then
    raise exception 'rejection_reason_required';
  end if;

  select translation_status into v_status
    from public.knowledge_canonical_unit_translations
    where id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status = 'rejected' then
    return query select p_translation_id, v_status;
    return;
  end if;

  if v_status <> 'human_review_pending' then
    raise exception 'translation_not_in_reviewable_status: current status is %', v_status;
  end if;

  update public.knowledge_canonical_unit_translations
    set translation_status = 'rejected',
        reviewed_by_actor_type = v_reviewer_actor_class,
        reviewed_by_identifier = p_reviewer_audit_identifier,
        rejection_reason = p_rejection_reason
    where id = p_translation_id;

  return query select p_translation_id, 'rejected'::text;
end;
$$;

revoke all on function public.knowledge_reject_translation(uuid, text, text) from public;
grant execute on function public.knowledge_reject_translation(uuid, text, text) to service_role;

-- System-only invalidation function: never granted to service_role or any
-- other role. Callable exclusively from
-- fn_canonical_content_changed_invalidate_translations (a SECURITY
-- DEFINER trigger function owned by the same role), never from a
-- human-facing endpoint. Its internal system actor class is implicit and
-- fixed by which trigger invokes it — it accepts no actor parameter of
-- any kind, caller-controlled or otherwise, and it remains ungrantable to
-- PUBLIC, anon, authenticated AND service_role.
create or replace function public.knowledge_invalidate_translation_for_canonical_change(
  p_translation_id uuid
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_status text;
begin
  select translation_status into v_status
    from public.knowledge_canonical_unit_translations
    where id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status in ('invalidated_pending_review', 'rejected', 'superseded', 'withdrawn') then
    return;
  end if;

  update public.knowledge_canonical_unit_translations
    set translation_status = 'invalidated_pending_review',
        invalidated_at = now()
    where id = p_translation_id;
end;
$$;

revoke all on function public.knowledge_invalidate_translation_for_canonical_change(uuid) from public;

-- Translation withdrawal uses its own fixed terminal transition and does
-- not persist an actor class today (the translations table has no
-- withdrawn-by column); p_actor_audit_identifier is accepted only as
-- non-authoritative audit metadata and is never evaluated for
-- authorization.
create or replace function public.knowledge_withdraw_translation(
  p_translation_id uuid,
  p_actor_audit_identifier text,
  p_reason_text text
)
returns table(translation_id uuid, translation_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_status text;
begin
  if p_reason_text is null or length(p_reason_text) = 0 then
    raise exception 'reason_required';
  end if;

  select translation_status into v_status
    from public.knowledge_canonical_unit_translations
    where id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status = 'withdrawn' then
    return query select p_translation_id, v_status;
    return;
  end if;

  update public.knowledge_canonical_unit_translations
    set translation_status = 'withdrawn',
        withdrawn_at = now()
    where id = p_translation_id;

  return query select p_translation_id, 'withdrawn'::text;
end;
$$;

revoke all on function public.knowledge_withdraw_translation(uuid, text, text) from public;
grant execute on function public.knowledge_withdraw_translation(uuid, text, text) to service_role;

-- =============================================================================
-- STEP 10 — ROW-LEVEL SECURITY: fail-closed, matching every existing
-- knowledge_* table. All three new tables have RLS enabled and zero
-- policies for anon/authenticated. Service-role bypasses RLS per normal
-- Supabase behavior; no policy grants it anything extra here, and it
-- receives no direct table grant below — only EXECUTE on the RPCs above.
-- =============================================================================

alter table public.knowledge_publication_state_transitions enable row level security;
alter table public.knowledge_publication_states enable row level security;
alter table public.knowledge_canonical_unit_translations enable row level security;

-- =============================================================================
-- STEP 11 — EXPLICIT DEFENSE-IN-DEPTH REVOKES ON THE 3 NEW TABLES ONLY
-- (no unrelated existing table's privileges are touched by this migration)
-- =============================================================================

revoke all on public.knowledge_publication_state_transitions from public, anon, authenticated;
revoke all on public.knowledge_publication_states from public, anon, authenticated;
revoke all on public.knowledge_canonical_unit_translations from public, anon, authenticated;

-- =============================================================================
-- STEP 12 — NO SEED DATA: zero INSERT statements below this line, and none
-- above. The publication and translation lifecycle constants above are
-- structurally represented only via CHECK constraints and function
-- allowlists; no row of any new table is populated by this migration.
-- =============================================================================
