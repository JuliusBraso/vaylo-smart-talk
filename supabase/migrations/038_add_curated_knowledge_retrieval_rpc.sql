-- Fixed, evidence-backed read boundary for server-side knowledge retrieval.
-- It exposes no arbitrary SQL, table, schema, or output-column selection.

create or replace function public.knowledge_retrieve_evidence_packets(
  p_claim_ids uuid[],
  p_jurisdiction_codes text[]
)
returns table (
  claim_id uuid,
  canonical_proposition text,
  canonical_language text,
  jurisdiction_code text,
  territorial_scope text,
  handling_mode public.knowledge_handling_mode,
  canonical_value_usable boolean,
  stale_behavior public.knowledge_stale_behavior,
  required_context_keys public.knowledge_required_context_key[],
  revalidation_due_at timestamptz,
  source_id uuid,
  source_version_id uuid,
  source_passage_id uuid,
  legal_locator text,
  citation_reference text,
  full_text_indexed boolean,
  vector_indexed boolean,
  indexed_at timestamptz,
  effective_date_filter_required boolean,
  stale_policy_filter_required boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
begin
  if cardinality(p_claim_ids) is null
     or cardinality(p_claim_ids) not between 1 and 50
     or cardinality(p_jurisdiction_codes) is null
     or cardinality(p_jurisdiction_codes) not between 1 and 10
     or exists (
       select 1
       from unnest(p_jurisdiction_codes) as requested_jurisdiction(code)
       where requested_jurisdiction.code !~ '^[A-Z]{2}(?:-[A-Z0-9_]{1,32})?$'
     ) then
    raise exception 'CURATED_RETRIEVAL_INVALID_REQUEST';
  end if;

  return query
  select
    c.id,
    c.claim_text_canonical,
    c.claim_language,
    j.jurisdiction_code,
    ts.scope_type,
    hp.handling_mode,
    hp.handling_mode = 'STORE_CANONICALLY'
      or (
        hp.handling_mode = 'CACHE_AND_REVALIDATE'
        and (hp.revalidation_due_at is null or hp.revalidation_due_at > statement_timestamp())
      ),
    hp.stale_behavior,
    hp.required_context_keys,
    hp.revalidation_due_at,
    s.id,
    sv.id,
    sp.id,
    sp.section_identifier,
    cit.internal_audit_label,
    rm.full_text_indexed,
    rm.vector_indexed,
    rm.indexed_at,
    rm.effective_date_filter_required,
    rm.stale_policy_filter_required
  from public.knowledge_claims c
  join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
  left join public.knowledge_territorial_scopes ts on ts.id = c.territorial_scope_id
  join public.knowledge_claim_evidence_links e on e.claim_id = c.id
    and e.review_accepted
    and e.support_status = 'direct_support'
    and e.conflict_status = 'none'
    and e.jurisdiction_match
    and e.territorial_scope_match
    and e.effective_date_match
  join public.knowledge_source_passages sp on sp.id = e.passage_id
    and sp.language = 'de'
    and sp.citation_ready
    and sp.review_status = 'expert_reviewed'
  join public.knowledge_source_versions sv on sv.id = e.source_version_id
    and sv.review_status = 'expert_reviewed'
    and sv.freshness_status = 'fresh'
    and sv.change_status = 'unchanged'
    and sv.current_use_allowed
    and sv.superseded_by_version_id is null
    and (sv.effective_from is null or sv.effective_from <= statement_timestamp())
    and (sv.effective_until is null or sv.effective_until >= statement_timestamp())
    and (sv.applicable_from is null or sv.applicable_from <= statement_timestamp())
    and (sv.applicable_until is null or sv.applicable_until >= statement_timestamp())
  join public.knowledge_sources s on s.id = sv.source_id
  join public.knowledge_citations cit on cit.claim_id = c.id
    and cit.passage_id = sp.id
  join public.knowledge_source_handling_policies hp on hp.source_id = s.id
    and hp.process_scope = 'anmeldung_ummeldung_abmeldung'
    and hp.information_class = case
      when c.claim_type = 'deadline' then 'DEADLINE'::public.knowledge_information_class
      when c.claim_type = 'sanction' then 'SANCTION'::public.knowledge_information_class
      when c.claim_type = 'procedure' then 'REQUIRED_EVIDENCE'::public.knowledge_information_class
      else 'LEGAL_BASELINE'::public.knowledge_information_class
    end
  join public.knowledge_retrieval_metadata rm on rm.entity_type = 'claim'
    and rm.entity_id = c.id
  where not exists (
    select 1
    from public.knowledge_conflicts conflict
    where c.id = any(conflict.entity_ids)
      and conflict.status in ('open', 'blocked')
      and conflict.blocks_high_risk_use
  )
    and not exists (
      select 1
      from public.knowledge_publication_states publication
      where publication.entity_type = 'claim'
        and publication.entity_id = c.id
        and (
          publication.current_state <> 'published'
          or publication.emergency_disabled
          or (publication.effective_from is not null and publication.effective_from > statement_timestamp())
          or (publication.effective_until is not null and publication.effective_until < statement_timestamp())
        )
    )
    and c.id = any(p_claim_ids)
    and j.jurisdiction_code = any(p_jurisdiction_codes)
    and c.claim_language = 'de'
    and c.status = 'active'
    and c.review_status = 'expert_reviewed'
    and c.freshness_status = 'fresh'
    and (c.effective_from is null or c.effective_from <= statement_timestamp())
    and (c.effective_until is null or c.effective_until >= statement_timestamp())
    and s.authorization_state = 'AUTHORIZED'
    and s.active_status = 'ACTIVE'
    and s.trust_status = 'VERIFIED'
    and s.evidence_eligibility = 'PUBLICATION_EVIDENCE_ELIGIBLE'
    and s.terms_or_license_review_status = 'ALLOWED'
    and s.robots_review_status = 'ALLOWED'
    and (s.revalidation_due_at is null or s.revalidation_due_at > statement_timestamp())
    and (
      hp.stale_behavior = 'ALLOW_WITH_STALE_WARNING'
      or hp.revalidation_due_at is null
      or hp.revalidation_due_at > statement_timestamp()
    );
end;
$$;

revoke all on function public.knowledge_retrieve_evidence_packets(uuid[], text[])
  from public, anon, authenticated, service_role;

comment on function public.knowledge_retrieve_evidence_packets(uuid[], text[]) is
  'Server-side curated evidence retrieval boundary; EXECUTE is granted only to the dedicated knowledge reader bootstrap role.';
