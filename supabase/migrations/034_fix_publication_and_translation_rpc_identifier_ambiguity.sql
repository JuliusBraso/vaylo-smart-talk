-- PHASE 9N-PATCH: Publication and Canonical Translation Schema Runtime Defect Fix.
--
-- Forward-only repair of a PL/pgSQL name-resolution defect introduced by
-- migration 033. Migration 033 itself is immutable and is NOT edited: every
-- statement below is a `create or replace function` that keeps the existing
-- name, argument list, return type, language, security mode, volatility and
-- hardened `search_path` byte-for-byte identical to 033 and changes only how
-- identifiers inside the function bodies are resolved.
--
-- ---------------------------------------------------------------------------
-- CONFIRMED DEFECT (PHASE 9N, isolated PostgreSQL 17.10)
-- ---------------------------------------------------------------------------
-- A PL/pgSQL function declared with `returns table(...)` implicitly declares
-- each output column as a variable in the function's top-level scope. Where a
-- 033 body then referenced a *table column* of the same name without
-- qualification, PostgreSQL could not decide between the column and the
-- implicit output variable and raised, on first execution:
--
--   SQLSTATE 42702  column reference "<name>" is ambiguous
--
-- PL/pgSQL bodies are not name-resolved at `create function` time, so 033
-- applied cleanly and only failed when a function was first called. Static SQL
-- inspection could not detect it; PHASE 9N found it at runtime.
--
-- Observed failures on a clean 032 -> 033 chain (16 ambiguous references
-- spread over the 14 functions replaced below):
--
--   knowledge_transition_publication_state              state_version
--   knowledge_advance_publication_evidence_status       current_state
--   knowledge_record_publication_review_decision        current_state
--   knowledge_recall_publication_to_review              current_state
--   knowledge_advance_publication_lifecycle             current_state
--   knowledge_supersede_publication_subject             current_state
--   knowledge_withdraw_publication_subject              current_state
--   knowledge_suspend_publication_for_detected_issue    current_state
--   knowledge_emergency_suspend_publication_subject     current_state
--   fn_create_translation_candidate_core                translation_version
--   knowledge_submit_translation_for_review             translation_status
--   knowledge_approve_translation                       translation_status, verified_at (x2)
--   knowledge_reject_translation                        translation_status
--   knowledge_withdraw_translation                      translation_status
--
-- knowledge_create_machine_translation_candidate and
-- knowledge_create_human_translation_candidate also failed at runtime, but
-- their own bodies contain no unqualified column reference: they failed purely
-- because they delegate to fn_create_translation_candidate_core. Repairing the
-- core repairs both, so neither wrapper is replaced here.
--
-- Left untouched because runtime testing proved them free of ambiguity:
-- knowledge_bootstrap_publication_subject (already fully alias-qualified),
-- knowledge_invalidate_translation_for_canonical_change, fn_translation_target_exists,
-- fn_normalize_and_fingerprint_text, fn_publication_subject_exists, and all
-- trigger functions.
--
-- ---------------------------------------------------------------------------
-- REPAIR STRATEGY
-- ---------------------------------------------------------------------------
--   1. Every table referenced inside a replaced body carries an explicit alias
--      (`kps`, `kpst`, `kcut`, `tgt`), and every column reference in a select
--      list, where clause or returning clause is qualified with that alias.
--   2. Local variables keep the `v_` prefix and parameters keep the `p_`
--      prefix, so a local can never collide with a column name.
--   3. `plpgsql.variable_conflict` is deliberately LEFT AT ITS DEFAULT
--      (`error`). This patch does NOT add `#variable_conflict use_column`, does
--      NOT set the GUC, and does NOT rename any output column. The safety guard
--      that surfaced this defect stays armed so future ambiguity fails closed
--      at first execution instead of silently resolving to the wrong operand.
--   4. `update ... set <col> = ...` targets stay unqualified: an UPDATE SET
--      target is always resolved as a column and can never be ambiguous.
--
-- NOT CHANGED BY THIS MIGRATION: every function signature and argument name,
-- every `returns table(...)` column name/type/order, every state-machine edge
-- and its guards, every actor-class literal and where it is assigned, the
-- optimistic-concurrency and row-locking semantics, fingerprint derivation,
-- translation lifecycle rules, RLS, triggers, table definitions, indexes and
-- constraints. No table is created, altered or dropped. No row is inserted.
--
-- AUTHORIZATION BOUNDARY (PHASE 9M-PATCH) IS PRESERVED VERBATIM: no grantable
-- wrapper gains an actor-class parameter; `p_actor_class` remains a parameter
-- of the ungrantable internal engine only and every wrapper still passes its
-- own hardcoded literal; caller-supplied `..._audit_identifier` values remain
-- non-authoritative audit metadata. The revoke/grant block at the end of this
-- file restates 033's privilege model exactly â€” `create or replace function`
-- preserves existing ACLs, so these statements are a no-op assertion of intent
-- rather than a privilege change, and neither internal engine is granted.
--
-- TRANSACTION MODEL: this file contains no explicit `begin`/`commit`, matching
-- all 34 preceding migrations in this repository. It is applied atomically by
-- the migration runner (`psql --single-transaction -v ON_ERROR_STOP=1`, or the
-- Supabase CLI's per-file transaction), so a failure in any statement below
-- rolls back every replacement and leaves all 033 definitions in place.

-- =============================================================================
-- STEP 1 â€” INTERNAL AUTHORITATIVE TRANSITION ENGINE
-- =============================================================================

-- Ambiguity repaired: the final `update ... where ... state_version = ...`
-- compared the *output variable* `state_version` instead of the column. Now
-- aliased as `kps` and qualified. Still INTERNAL-ONLY: no grant is issued for
-- this function anywhere in this migration.
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

  select kps.id, kps.current_state, kps.current_transition_id, kps.state_version
    into v_state_id, v_current_state, v_current_transition_id, v_state_version
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id
    for update;

  if v_state_id is null then
    raise exception 'publication_subject_not_bootstrapped: % / % has no current-state projection row', p_entity_type, p_entity_id;
  end if;

  if v_state_version <> p_expected_state_version then
    select kpst.id, kpst.to_state, kpst.resulting_state_version
      into v_replay_transition_id, v_replay_state, v_replay_version
      from public.knowledge_publication_state_transitions as kpst
      where kpst.entity_type = p_entity_type and kpst.entity_id = p_entity_id
        and kpst.idempotency_key = p_idempotency_key
        and kpst.resulting_state_version = v_state_version;

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

  update public.knowledge_publication_states as kps
    set current_state = p_to_state,
        current_transition_id = v_new_transition_id,
        state_version = v_state_version + 1,
        reason_code = p_reason_code,
        emergency_disabled = coalesce(p_emergency, false)
    where kps.id = v_state_id and kps.state_version = p_expected_state_version;

  if not found then
    raise exception 'publication_state_version_conflict: concurrent update detected during commit';
  end if;

  return query select v_new_transition_id, p_to_state, v_state_version + 1;
end;
$$;

-- =============================================================================
-- STEP 2 â€” NARROW, OPERATION-SCOPED PUBLICATION WRAPPERS
--
-- All 8 wrappers below failed identically: their pre-check
--   `select current_state into v_precheck_current_state from public.knowledge_publication_states ...`
-- resolved `current_state` against the implicit output variable. Each is now
-- aliased as `kps` and fully qualified. Every wrapper keeps its own hardcoded
-- actor-class literal and its own operation-scope guard unchanged.
-- =============================================================================

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
  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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
  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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
  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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
  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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
  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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
  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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

  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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

  select kps.current_state into v_precheck_current_state
    from public.knowledge_publication_states as kps
    where kps.entity_type = p_entity_type and kps.entity_id = p_entity_id;

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

-- =============================================================================
-- STEP 3 â€” INTERNAL TRANSLATION-CANDIDATE CORE
--
-- Ambiguity repaired: `coalesce(max(translation_version), 0) + 1` resolved
-- `translation_version` against the implicit output variable. Now aliased as
-- `kcut` and qualified; the set-returning helper call is aliased as `tgt`.
-- Still INTERNAL-ONLY: no grant is issued for this function.
-- =============================================================================

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

  select tgt.target_exists, tgt.canonical_content
    into v_target_exists, v_canonical_content
    from public.fn_translation_target_exists(p_entity_type, p_entity_id, p_field_key) as tgt;

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


  select coalesce(max(kcut.translation_version), 0) + 1 into v_next_version
    from public.knowledge_canonical_unit_translations as kcut
    where kcut.entity_type = p_entity_type and kcut.entity_id = p_entity_id
      and kcut.field_key = p_field_key and kcut.output_locale = p_output_locale;

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

-- =============================================================================
-- STEP 4 â€” TRANSLATION LIFECYCLE WRAPPERS
--
-- Each read `translation_status` (and, in knowledge_approve_translation, also
-- `verified_at` in a select list and in an update ... returning clause) against
-- the implicit output variables. All are now aliased as `kcut` / `tgt` and
-- qualified. knowledge_create_machine_translation_candidate and
-- knowledge_create_human_translation_candidate are deliberately NOT replaced:
-- their bodies contain no unqualified column reference and are repaired
-- transitively by the fn_create_translation_candidate_core replacement above.
-- =============================================================================

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
  select kcut.translation_status into v_status
    from public.knowledge_canonical_unit_translations as kcut
    where kcut.id = p_translation_id
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

  update public.knowledge_canonical_unit_translations as kcut
    set translation_status = 'human_review_pending'
    where kcut.id = p_translation_id;

  return query select p_translation_id, 'human_review_pending'::text;
end;
$$;

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

  select kcut.translation_status, kcut.created_by_identifier, kcut.entity_type, kcut.entity_id,
         kcut.field_key, kcut.canonical_content_fingerprint
    into v_status, v_created_by_identifier, v_entity_type, v_entity_id, v_field_key, v_stored_fingerprint
    from public.knowledge_canonical_unit_translations as kcut
    where kcut.id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status = 'approved' then
    select kcut.verified_at into v_verified_at
      from public.knowledge_canonical_unit_translations as kcut
      where kcut.id = p_translation_id;
    return query select p_translation_id, v_status, v_verified_at;
    return;
  end if;

  if v_status <> 'human_review_pending' then
    raise exception 'translation_not_in_reviewable_status: current status is %', v_status;
  end if;

  if v_created_by_identifier is not null and v_created_by_identifier = p_reviewer_audit_identifier then
    raise exception 'self_approval_blocked: reviewer cannot approve their own translation candidate';
  end if;

  select tgt.target_exists, tgt.canonical_content
    into v_target_exists, v_current_content
    from public.fn_translation_target_exists(v_entity_type, v_entity_id, v_field_key) as tgt;

  if not v_target_exists then
    raise exception 'unknown_entity_type_field_key_combination';
  end if;

  v_current_fingerprint := public.fn_normalize_and_fingerprint_text(v_current_content);

  if v_current_fingerprint is distinct from v_stored_fingerprint then
    raise exception 'canonical_fingerprint_stale_reapprove_rejected: canonical content has changed since this candidate was created';
  end if;

  update public.knowledge_canonical_unit_translations as kcut
    set translation_status = 'approved',
        human_reviewed = true,
        uncertainty_preserved = true,
        warnings_preserved = true,
        numeric_and_deadline_values_preserved = true,
        reviewed_by_actor_type = v_reviewer_actor_class,
        reviewed_by_identifier = p_reviewer_audit_identifier,
        review_record_id = p_review_record_id,
        verified_at = now()
    where kcut.id = p_translation_id
    returning kcut.verified_at into v_verified_at;

  return query select p_translation_id, 'approved'::text, v_verified_at;
end;
$$;

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

  select kcut.translation_status into v_status
    from public.knowledge_canonical_unit_translations as kcut
    where kcut.id = p_translation_id
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

  update public.knowledge_canonical_unit_translations as kcut
    set translation_status = 'rejected',
        reviewed_by_actor_type = v_reviewer_actor_class,
        reviewed_by_identifier = p_reviewer_audit_identifier,
        rejection_reason = p_rejection_reason
    where kcut.id = p_translation_id;

  return query select p_translation_id, 'rejected'::text;
end;
$$;

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

  select kcut.translation_status into v_status
    from public.knowledge_canonical_unit_translations as kcut
    where kcut.id = p_translation_id
    for update;

  if v_status is null then
    raise exception 'translation_not_found: %', p_translation_id;
  end if;

  if v_status = 'withdrawn' then
    return query select p_translation_id, v_status;
    return;
  end if;

  update public.knowledge_canonical_unit_translations as kcut
    set translation_status = 'withdrawn',
        withdrawn_at = now()
    where kcut.id = p_translation_id;

  return query select p_translation_id, 'withdrawn'::text;
end;
$$;

-- =============================================================================
-- STEP 5 â€” PRIVILEGE MODEL RESTATEMENT (assertion, not a change)
--
-- `create or replace function` preserves the existing ACL, so the statements
-- below re-assert exactly what migration 033 already established. They are
-- listed explicitly so this file is self-describing and so a future reader can
-- see, in one place, which replaced functions are grantable and which are not.
--
-- The two internal engines replaced above (knowledge_transition_publication_state
-- and fn_create_translation_candidate_core) appear ONLY in revoke statements.
-- They receive no grant here and must remain non-executable by service_role,
-- anon, authenticated and PUBLIC.
-- =============================================================================

revoke all on function public.knowledge_transition_publication_state(text, uuid, text, integer, text, text, text, text, uuid, text, uuid, boolean, text) from public;
revoke all on function public.fn_create_translation_candidate_core(text, uuid, text, text, text, boolean, text, text, text, text, text) from public;

revoke all on function public.knowledge_advance_publication_evidence_status(text, uuid, text, integer, text, text, text) from public;
grant execute on function public.knowledge_advance_publication_evidence_status(text, uuid, text, integer, text, text, text) to service_role;

revoke all on function public.knowledge_record_publication_review_decision(text, uuid, text, integer, uuid, text, text, text) from public;
grant execute on function public.knowledge_record_publication_review_decision(text, uuid, text, integer, uuid, text, text, text) to service_role;

revoke all on function public.knowledge_recall_publication_to_review(text, uuid, integer, text, text, text) from public;
grant execute on function public.knowledge_recall_publication_to_review(text, uuid, integer, text, text, text) to service_role;

revoke all on function public.knowledge_advance_publication_lifecycle(text, uuid, text, integer, text, text, text) from public;
grant execute on function public.knowledge_advance_publication_lifecycle(text, uuid, text, integer, text, text, text) to service_role;

revoke all on function public.knowledge_supersede_publication_subject(text, uuid, integer, text, text, uuid, text, text) from public;
grant execute on function public.knowledge_supersede_publication_subject(text, uuid, integer, text, text, uuid, text, text) to service_role;

revoke all on function public.knowledge_withdraw_publication_subject(text, uuid, integer, text, text, text) from public;
grant execute on function public.knowledge_withdraw_publication_subject(text, uuid, integer, text, text, text) to service_role;

revoke all on function public.knowledge_suspend_publication_for_detected_issue(text, uuid, integer, text, text, text, text) from public;
grant execute on function public.knowledge_suspend_publication_for_detected_issue(text, uuid, integer, text, text, text, text) to service_role;

revoke all on function public.knowledge_emergency_suspend_publication_subject(text, uuid, integer, text, text, text) from public;
grant execute on function public.knowledge_emergency_suspend_publication_subject(text, uuid, integer, text, text, text) to service_role;

revoke all on function public.knowledge_submit_translation_for_review(uuid, text) from public;
grant execute on function public.knowledge_submit_translation_for_review(uuid, text) to service_role;

revoke all on function public.knowledge_approve_translation(uuid, text, uuid) from public;
grant execute on function public.knowledge_approve_translation(uuid, text, uuid) to service_role;

revoke all on function public.knowledge_reject_translation(uuid, text, text) from public;
grant execute on function public.knowledge_reject_translation(uuid, text, text) to service_role;

revoke all on function public.knowledge_withdraw_translation(uuid, text, text) from public;
grant execute on function public.knowledge_withdraw_translation(uuid, text, text) to service_role;

-- =============================================================================
-- STEP 6 â€” NO SCHEMA OR DATA CHANGE
-- Zero create/alter/drop table, zero index change, zero trigger change, zero
-- RLS change and zero INSERT statements appear in this migration.
-- =============================================================================
