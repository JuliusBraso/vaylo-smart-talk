-- DB-SEC-01: close direct client execution inherited from PostgreSQL/Supabase
-- function default privileges.
--
-- Privilege-only and idempotent. This migration changes no function body,
-- table, row, RLS state, policy, trigger, corridor, or runtime activation.
-- It is also safe to replay after an independently authorized live-043 hotfix.

-- PostgreSQL's built-in PUBLIC EXECUTE default is global for the creator role;
-- a schema-scoped revoke cannot subtract it. Remove that global default first.
alter default privileges for role postgres
  revoke execute on functions from public;

-- This project's postgres role also has Supabase-managed schema defaults for
-- anon, authenticated, and service_role. Keep the backend default while
-- requiring an explicit later GRANT for every client-callable RPC.
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;

alter default privileges for role postgres in schema knowledge_factory_internal
  revoke execute on functions from anon, authenticated;

-- Exact live-exposed identities confirmed at schema level 043, plus the three
-- migration-042 internal functions whose PUBLIC-only revokes did not
-- explicitly deny Supabase client roles. All signatures remain through 070.
revoke execute on function
  public.claim_next_document_intelligence_job(integer),
  public.confirm_document_step_proof(uuid, text),
  public.enqueue_document_intelligence_job(uuid, uuid),
  public.fn_canonical_content_changed_invalidate_translations(),
  public.fn_canonical_unit_translations_protect_verified(),
  public.fn_create_translation_candidate_core(
    text, uuid, text, text, text, boolean, text, text, text, text, text
  ),
  public.fn_normalize_and_fingerprint_text(text),
  public.fn_publication_state_transitions_append_only(),
  public.fn_publication_states_validate_write(),
  public.fn_publication_subject_exists(text, uuid),
  public.fn_translation_target_exists(text, uuid, text),
  public.i18n_insert_translations_if_missing(text, jsonb),
  public.knowledge_advance_publication_evidence_status(
    text, uuid, text, integer, text, text, text
  ),
  public.knowledge_advance_publication_lifecycle(
    text, uuid, text, integer, text, text, text
  ),
  public.knowledge_approve_translation(uuid, text, uuid),
  public.knowledge_bootstrap_publication_subject(text, uuid, text, text),
  public.knowledge_create_human_translation_candidate(
    text, uuid, text, text, text, text, text
  ),
  public.knowledge_create_machine_translation_candidate(
    text, uuid, text, text, text, text, text, text, text
  ),
  public.knowledge_emergency_suspend_publication_subject(
    text, uuid, integer, text, text, text
  ),
  public.knowledge_invalidate_translation_for_canonical_change(uuid),
  public.knowledge_recall_publication_to_review(
    text, uuid, integer, text, text, text
  ),
  public.knowledge_record_publication_review_decision(
    text, uuid, text, integer, uuid, text, text, text
  ),
  public.knowledge_reject_translation(uuid, text, text),
  public.knowledge_submit_translation_for_review(uuid, text),
  public.knowledge_supersede_publication_subject(
    text, uuid, integer, text, text, uuid, text, text
  ),
  public.knowledge_suspend_publication_for_detected_issue(
    text, uuid, integer, text, text, text, text
  ),
  public.knowledge_transition_publication_state(
    text, uuid, text, integer, text, text, text, text, uuid, text, uuid,
    boolean, text
  ),
  public.knowledge_withdraw_publication_subject(
    text, uuid, integer, text, text, text
  ),
  public.knowledge_withdraw_translation(uuid, text, text),
  public.reject_document_step_proof(uuid, text),
  public.set_updated_at(),
  public.update_updated_at_column(),
  knowledge_factory_internal.knowledge_factory_resolve_041_payload(
    jsonb, boolean
  ),
  knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb),
  knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(
    jsonb
  )
from public, anon, authenticated;

-- Internal engines and trigger/helper functions have no direct backend caller.
-- Removing service_role here restores the explicit migration-033/034 contract;
-- trigger execution does not depend on caller EXECUTE privilege.
revoke execute on function
  public.fn_canonical_content_changed_invalidate_translations(),
  public.fn_canonical_unit_translations_protect_verified(),
  public.fn_create_translation_candidate_core(
    text, uuid, text, text, text, boolean, text, text, text, text, text
  ),
  public.fn_normalize_and_fingerprint_text(text),
  public.fn_publication_state_transitions_append_only(),
  public.fn_publication_states_validate_write(),
  public.fn_publication_subject_exists(text, uuid),
  public.fn_translation_target_exists(text, uuid, text),
  public.knowledge_invalidate_translation_for_canonical_change(uuid),
  public.knowledge_transition_publication_state(
    text, uuid, text, integer, text, text, text, text, uuid, text, uuid,
    boolean, text
  ),
  public.set_updated_at(),
  public.update_updated_at_column(),
  knowledge_factory_internal.knowledge_factory_resolve_041_payload(
    jsonb, boolean
  ),
  knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb),
  knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(
    jsonb
  )
from service_role;

-- The only authenticated application RPCs. Their existing auth.uid() and
-- ownership checks are unchanged.
grant execute on function
  public.confirm_document_step_proof(uuid, text),
  public.reject_document_step_proof(uuid, text)
to authenticated;
