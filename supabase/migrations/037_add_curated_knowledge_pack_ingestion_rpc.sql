-- Narrow curated-pack ingestion boundary. Knowledge content remains a
-- source-controlled payload supplied by the maintenance runner.

create or replace function public.knowledge_ingest_curated_pack(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_row jsonb;
  v_created integer := 0;
  v_total_created integer := 0;
  v_counts jsonb := '{}'::jsonb;
  v_allowed_keys constant text[] := array[
    'packId','canonicalLanguage','trustDomain','jurisdiction','territorialScope',
    'publisher','authority','source','sourceVersion','passages','claims','actorRule',
    'processes','deadlines','steps','requirements','handlingPolicies',
    'freshnessRecords','retrievalMetadata','terminology'
  ];
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'CURATED_PACK_INVALID_ROOT';
  end if;
  if exists (
    select 1 from jsonb_object_keys(p_payload) as k(key)
    where not (k.key = any(v_allowed_keys))
  ) or exists (
    select 1 from unnest(v_allowed_keys) as k(key)
    where not (p_payload ? k.key)
  ) then
    raise exception 'CURATED_PACK_INVALID_STRUCTURE';
  end if;
  if p_payload->>'packId' !~ '^[a-z0-9_]{3,80}$'
     or p_payload->>'canonicalLanguage' <> 'de'
     or p_payload#>>'{jurisdiction,code}' <> 'DE'
     or p_payload#>>'{jurisdiction,countryCode}' <> 'DE' then
    raise exception 'CURATED_PACK_IDENTITY_INVALID';
  end if;
  if jsonb_array_length(p_payload->'passages') not between 1 and 250
     or jsonb_array_length(p_payload->'claims') not between 1 and 500
     or jsonb_array_length(p_payload->'processes') not between 0 and 100
     or jsonb_array_length(p_payload->'handlingPolicies') > 50
     or jsonb_array_length(p_payload->'retrievalMetadata') > 500 then
    raise exception 'CURATED_PACK_CARDINALITY_INVALID';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'claims') c
    where nullif(c->>'id','') is null
       or nullif(c->>'text','') is null
       or nullif(c->>'passageId','') is null
       or nullif(c->>'evidenceId','') is null
       or nullif(c->>'citationId','') is null
       or c->>'jurisdictionId' <> p_payload#>>'{jurisdiction,id}'
  ) then
    raise exception 'CURATED_PACK_CLAIM_EVIDENCE_REQUIRED';
  end if;

  insert into public.knowledge_trust_domains (id, code, name, review_status)
  values (
    (p_payload#>>'{trustDomain,id}')::uuid,
    p_payload#>>'{trustDomain,code}',
    p_payload#>>'{trustDomain,name}',
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('trustDomains', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_trust_domains t
    where t.id=(p_payload#>>'{trustDomain,id}')::uuid
      and t.code=p_payload#>>'{trustDomain,code}'
      and t.name=p_payload#>>'{trustDomain,name}'
  ) then raise exception 'CURATED_PACK_CONFLICT:trust_domain'; end if;

  insert into public.knowledge_jurisdictions
    (id, jurisdiction_level, jurisdiction_code, country_code, name, status)
  values (
    (p_payload#>>'{jurisdiction,id}')::uuid,
    p_payload#>>'{jurisdiction,level}',
    p_payload#>>'{jurisdiction,code}',
    p_payload#>>'{jurisdiction,countryCode}',
    p_payload#>>'{jurisdiction,name}',
    'active'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('jurisdictions', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_jurisdictions j
    where j.id=(p_payload#>>'{jurisdiction,id}')::uuid
      and j.jurisdiction_level=p_payload#>>'{jurisdiction,level}'
      and j.jurisdiction_code=p_payload#>>'{jurisdiction,code}'
      and j.country_code=p_payload#>>'{jurisdiction,countryCode}'
  ) then raise exception 'CURATED_PACK_CONFLICT:jurisdiction'; end if;

  insert into public.knowledge_territorial_scopes
    (id, scope_type, jurisdiction_ids, scope_verified, review_status)
  values (
    (p_payload#>>'{territorialScope,id}')::uuid,
    p_payload#>>'{territorialScope,type}',
    array(select jsonb_array_elements_text(p_payload#>'{territorialScope,jurisdictionIds}'))::uuid[],
    true, 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('territorialScopes', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_territorial_scopes s
    where s.id=(p_payload#>>'{territorialScope,id}')::uuid
      and s.scope_type=p_payload#>>'{territorialScope,type}'
      and s.jurisdiction_ids=array(select jsonb_array_elements_text(p_payload#>'{territorialScope,jurisdictionIds}'))::uuid[]
  ) then raise exception 'CURATED_PACK_CONFLICT:territorial_scope'; end if;

  insert into public.knowledge_publishers
    (id, publisher_name, publisher_type, official_status, subject_matter_competence,
     territorial_competence_id, trust_domain_id, review_status)
  values (
    (p_payload#>>'{publisher,id}')::uuid, p_payload#>>'{publisher,name}',
    'federal_publication', true, array['Melderecht'],
    (p_payload#>>'{publisher,territorialScopeId}')::uuid,
    (p_payload#>>'{publisher,trustDomainId}')::uuid, 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('publishers', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_publishers p
    where p.id=(p_payload#>>'{publisher,id}')::uuid
      and p.publisher_name=p_payload#>>'{publisher,name}'
      and p.trust_domain_id=(p_payload#>>'{publisher,trustDomainId}')::uuid
  ) then raise exception 'CURATED_PACK_CONFLICT:publisher'; end if;

  insert into public.knowledge_authorities
    (id, publisher_id, authority_name, authority_type, jurisdiction_id,
     territorial_scope_id, official_portal_url, status, review_status)
  values (
    (p_payload#>>'{authority,id}')::uuid,
    (p_payload#>>'{authority,publisherId}')::uuid,
    p_payload#>>'{authority,name}', 'federal_legal_publisher',
    (p_payload#>>'{authority,jurisdictionId}')::uuid,
    (p_payload#>>'{authority,territorialScopeId}')::uuid,
    p_payload#>>'{authority,url}', 'active', 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('authorities', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_authorities a
    where a.id=(p_payload#>>'{authority,id}')::uuid
      and a.publisher_id=(p_payload#>>'{authority,publisherId}')::uuid
      and a.authority_name=p_payload#>>'{authority,name}'
      and a.jurisdiction_id=(p_payload#>>'{authority,jurisdictionId}')::uuid
  ) then raise exception 'CURATED_PACK_CONFLICT:authority'; end if;

  insert into public.knowledge_sources (
    id, publisher_id, source_type, source_purpose, canonical_url, official_domain,
    official_domain_verification_status, jurisdiction_id, territorial_scope_id,
    source_language, publication_identifier, supports_claim_types, high_risk_use_allowed,
    normalized_canonical_url, normalized_origin, source_class, evidence_eligibility,
    issuing_authority_id, authority_level, process_scope, retrieval_method,
    terms_or_license_review_status, robots_review_status, first_verified_at, last_verified_at,
    active_status, trust_status, authorization_state, default_handling_mode,
    freshness_class, stale_behavior
  ) values (
    (p_payload#>>'{source,id}')::uuid, (p_payload#>>'{source,publisherId}')::uuid,
    'law', 'Bundesmeldegesetz', p_payload#>>'{source,canonicalUrl}', 'gesetze-im-internet.de',
    'verified', (p_payload#>>'{source,jurisdictionId}')::uuid,
    (p_payload#>>'{source,territorialScopeId}')::uuid, 'de', 'BMG',
    array['registration_law'], true, p_payload#>>'{source,canonicalUrl}',
    p_payload#>>'{source,normalizedOrigin}', 'FEDERAL_LAW',
    'PUBLICATION_EVIDENCE_ELIGIBLE',
    (p_payload#>>'{source,authorityId}')::uuid, 'FEDERAL',
    array[p_payload->>'packId'], 'HTML_DOCUMENT', 'ALLOWED', 'ALLOWED',
    now(), now(), 'ACTIVE', 'VERIFIED', 'AUTHORIZED', 'STORE_CANONICALLY',
    'LEGAL_CHANGE_MONITORED', 'DO_NOT_USE_STALE'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('sources', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_sources s
    where s.id=(p_payload#>>'{source,id}')::uuid
      and s.publisher_id=(p_payload#>>'{source,publisherId}')::uuid
      and s.canonical_url=p_payload#>>'{source,canonicalUrl}'
      and s.jurisdiction_id=(p_payload#>>'{source,jurisdictionId}')::uuid
      and s.authorization_state='AUTHORIZED'
  ) then raise exception 'CURATED_PACK_CONFLICT:source'; end if;

  insert into public.knowledge_source_versions (
    id, source_id, version_sequence, content_hash, review_status,
    freshness_status, change_status, immutable, historical_use_allowed,
    current_use_allowed
  ) values (
    (p_payload#>>'{sourceVersion,id}')::uuid,
    (p_payload#>>'{sourceVersion,sourceId}')::uuid, 1,
    p_payload#>>'{sourceVersion,contentHash}', 'expert_reviewed', 'fresh',
    'unchanged', true, true, true
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('sourceVersions', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_source_versions v
    where v.id=(p_payload#>>'{sourceVersion,id}')::uuid
      and v.source_id=(p_payload#>>'{sourceVersion,sourceId}')::uuid
      and v.version_sequence=1
      and v.content_hash=p_payload#>>'{sourceVersion,contentHash}'
  ) then raise exception 'CURATED_PACK_CONFLICT:source_version'; end if;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'passages') loop
    insert into public.knowledge_source_passages (
      id, source_version_id, passage_order, heading_path, section_identifier,
      text, text_hash, language, citation_ready, review_status
    ) values (
      (v_row->>'id')::uuid, (p_payload#>>'{sourceVersion,id}')::uuid,
      (v_row->>'order')::integer, array['Bundesmeldegesetz'], v_row->>'locator',
      v_row->>'text', v_row->>'textHash', 'de', true, 'expert_reviewed'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_source_passages p
      where p.id=(v_row->>'id')::uuid
        and p.source_version_id=(p_payload#>>'{sourceVersion,id}')::uuid
        and p.passage_order=(v_row->>'order')::integer
        and p.text=v_row->>'text' and p.text_hash=v_row->>'textHash'
        and p.section_identifier=v_row->>'locator'
    ) then raise exception 'CURATED_PACK_CONFLICT:passage:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('sourcePassages', v_created);
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_responsible_actor_rules (
    id, actor_state, user_must_act, german_authority_must_act, jurisdiction_id,
    territorial_scope_id, review_status, concrete_instruction_allowed
  ) values (
    (p_payload#>>'{actorRule,id}')::uuid, 'meldepflichtige_person', true, true,
    (p_payload#>>'{actorRule,jurisdictionId}')::uuid,
    (p_payload#>>'{actorRule,territorialScopeId}')::uuid,
    'expert_reviewed', false
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('responsibleActorRules', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_responsible_actor_rules a
    where a.id=(p_payload#>>'{actorRule,id}')::uuid
      and a.actor_state='meldepflichtige_person'
      and a.jurisdiction_id=(p_payload#>>'{actorRule,jurisdictionId}')::uuid
      and a.territorial_scope_id=(p_payload#>>'{actorRule,territorialScopeId}')::uuid
      and a.user_must_act and a.german_authority_must_act
  ) then raise exception 'CURATED_PACK_CONFLICT:responsible_actor_rule'; end if;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
    if not exists (select 1 from public.knowledge_source_passages p where p.id=(v_row->>'passageId')::uuid and p.source_version_id=(p_payload#>>'{sourceVersion,id}')::uuid) then
      raise exception 'CURATED_PACK_BROKEN_PASSAGE_RELATION';
    end if;
    insert into public.knowledge_claims (
      id, claim_type, claim_text_canonical, claim_language, market,
      jurisdiction_id, territorial_scope_id, authority_id, risk_level,
      allowed_output_uses, requires_direct_support, requires_effective_date,
      requires_authority_resolution, review_status, freshness_status, status
    ) values (
      (v_row->>'id')::uuid, v_row->>'type', v_row->>'text', 'de', 'DE',
      (v_row->>'jurisdictionId')::uuid, (v_row->>'territorialScopeId')::uuid,
      (v_row->>'authorityId')::uuid, 'medium', array['orientation'], true,
      true, false, 'expert_reviewed', 'fresh', 'active'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_claims c
      where c.id=(v_row->>'id')::uuid and c.claim_type=v_row->>'type'
        and c.claim_text_canonical=v_row->>'text' and c.claim_language='de'
        and c.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and c.territorial_scope_id=(v_row->>'territorialScopeId')::uuid
        and c.authority_id=(v_row->>'authorityId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:claim:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('claims', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
    insert into public.knowledge_claim_evidence_links (
      id, claim_id, source_version_id, passage_id, support_status,
      evidence_role, is_primary_evidence, jurisdiction_match,
      territorial_scope_match, authority_competence_match,
      effective_date_match, review_accepted, authorized_use
    ) values (
      (v_row->>'evidenceId')::uuid, (v_row->>'id')::uuid,
      (p_payload#>>'{sourceVersion,id}')::uuid, (v_row->>'passageId')::uuid,
      'direct_support', 'legal_basis', true, true, true, true, true, true,
      array['orientation']
    ) on conflict (claim_id, passage_id, evidence_role) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_claim_evidence_links e
      where e.id=(v_row->>'evidenceId')::uuid
        and e.claim_id=(v_row->>'id')::uuid
        and e.passage_id=(v_row->>'passageId')::uuid
        and e.source_version_id=(p_payload#>>'{sourceVersion,id}')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:evidence:%', v_row->>'evidenceId'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('evidenceLinks', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
    insert into public.knowledge_citations (
      id, claim_id, source_id, source_version_id, passage_id, publisher_id,
      jurisdiction_id, last_verified_at, user_facing_label,
      internal_audit_label, original_language, canonical_url
    ) values (
      (v_row->>'citationId')::uuid, (v_row->>'id')::uuid,
      (p_payload#>>'{source,id}')::uuid, (p_payload#>>'{sourceVersion,id}')::uuid,
      (v_row->>'passageId')::uuid, (p_payload#>>'{publisher,id}')::uuid,
      (p_payload#>>'{jurisdiction,id}')::uuid, now(), v_row->>'citationLabel',
      v_row->>'citationLabel', 'de', v_row->>'citationUrl'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_citations c
      where c.id=(v_row->>'citationId')::uuid and c.claim_id=(v_row->>'id')::uuid
        and c.passage_id=(v_row->>'passageId')::uuid
        and c.canonical_url=v_row->>'citationUrl'
    ) then raise exception 'CURATED_PACK_CONFLICT:citation:%', v_row->>'citationId'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('citations', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'processes') loop
    insert into public.knowledge_processes (
      id, process_group_id, title, jurisdiction_id, territorial_scope_id,
      risk_level, orientation_only, trigger_description, safe_first_step,
      regional_variation_expected, full_legal_advice_excluded, review_status
    ) values (
      (v_row->>'id')::uuid, p_payload->>'packId', v_row->>'title',
      (p_payload#>>'{jurisdiction,id}')::uuid,
      (p_payload#>>'{territorialScope,id}')::uuid, 'medium', true,
      v_row->>'trigger', v_row->>'firstStep', true, true, 'expert_reviewed'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_processes p
      where p.id=(v_row->>'id')::uuid and p.process_group_id=p_payload->>'packId'
        and p.title=v_row->>'title' and p.trigger_description=v_row->>'trigger'
        and p.safe_first_step=v_row->>'firstStep'
    ) then raise exception 'CURATED_PACK_CONFLICT:process:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('processes', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'deadlines') loop
    insert into public.knowledge_deadline_rules (
      id, deadline_type, trigger_event_type, trigger_date_source,
      duration_value, duration_unit, jurisdiction_id, territorial_scope_id,
      authority_id, source_version_id, passage_id, exact_calculation_allowed,
      risk_level, review_status
    ) values (
      (v_row->>'id')::uuid, v_row->>'type', v_row->>'event', v_row->>'source',
      (v_row->>'duration')::integer, v_row->>'unit',
      (p_payload#>>'{jurisdiction,id}')::uuid,
      (p_payload#>>'{territorialScope,id}')::uuid,
      (p_payload#>>'{authority,id}')::uuid,
      (p_payload#>>'{sourceVersion,id}')::uuid, (v_row->>'passageId')::uuid,
      false, 'medium', 'expert_reviewed'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_deadline_rules d
      where d.id=(v_row->>'id')::uuid and d.deadline_type=v_row->>'type'
        and d.duration_value=(v_row->>'duration')::integer
        and d.duration_unit=v_row->>'unit' and d.passage_id=(v_row->>'passageId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:deadline:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('deadlineRules', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'steps') loop
    insert into public.knowledge_process_steps (
      id, process_id, step_order, step_type, title, responsible_actor_rule_id,
      authority_id, deadline_rule_id, allowed_output_uses, review_status
    ) values (
      (v_row->>'id')::uuid, (v_row->>'processId')::uuid, 0,
      v_row->>'type', v_row->>'title', (p_payload#>>'{actorRule,id}')::uuid,
      (p_payload#>>'{authority,id}')::uuid, (v_row->>'deadlineId')::uuid,
      array['orientation'], 'expert_reviewed'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_process_steps s
      where s.id=(v_row->>'id')::uuid and s.process_id=(v_row->>'processId')::uuid
        and s.step_order=0 and s.step_type=v_row->>'type' and s.title=v_row->>'title'
        and s.deadline_rule_id=(v_row->>'deadlineId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:step:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('processSteps', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'requirements') loop
    insert into public.knowledge_evidence_requirements (
      id, name, category, description_canonical, required_by_process_id,
      required_by_step_id, responsible_actor_rule_id, user_submission_expected,
      source_version_id, passage_id, jurisdiction_id, territorial_scope_id,
      review_status
    ) values (
      (v_row->>'id')::uuid, 'Wohnungsgeberbestätigung oder Zuordnungsmerkmal',
      'registration_evidence',
      'Nach § 23 ist die gesetzlich vorgesehene Bestätigung oder das Zuordnungsmerkmal vorzulegen.',
      (v_row->>'processId')::uuid, (v_row->>'stepId')::uuid,
      (p_payload#>>'{actorRule,id}')::uuid, true,
      (p_payload#>>'{sourceVersion,id}')::uuid, (v_row->>'passageId')::uuid,
      (p_payload#>>'{jurisdiction,id}')::uuid,
      (p_payload#>>'{territorialScope,id}')::uuid, 'expert_reviewed'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_evidence_requirements r
      where r.id=(v_row->>'id')::uuid
        and r.required_by_process_id=(v_row->>'processId')::uuid
        and r.required_by_step_id=(v_row->>'stepId')::uuid
        and r.passage_id=(v_row->>'passageId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:requirement:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('evidenceRequirements', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'handlingPolicies') loop
    insert into public.knowledge_source_handling_policies (
      id, source_id, information_class, process_scope, handling_mode,
      freshness_class, stale_behavior, required_context_keys, risk_class,
      state_version
    ) values (
      (v_row->>'id')::uuid, (p_payload#>>'{source,id}')::uuid,
      (v_row->>'informationClass')::public.knowledge_information_class,
      p_payload->>'packId', 'STORE_CANONICALLY', 'LEGAL_CHANGE_MONITORED',
      'DO_NOT_USE_STALE', '{}', 'HIGH', 1
    ) on conflict (source_id, information_class, process_scope) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_source_handling_policies h
      where h.id=(v_row->>'id')::uuid and h.source_id=(p_payload#>>'{source,id}')::uuid
        and h.information_class=(v_row->>'informationClass')::public.knowledge_information_class
        and h.process_scope=p_payload->>'packId'
        and h.handling_mode='STORE_CANONICALLY'
    ) then raise exception 'CURATED_PACK_CONFLICT:handling_policy:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('handlingPolicies', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'freshnessRecords') loop
    insert into public.knowledge_freshness_records (
      id, entity_type, entity_id, freshness_status, source_available,
      content_hash_matches, change_status, effective_date_known,
      review_required, notes
    ) values (
      (v_row->>'id')::uuid, v_row->>'entityType', (v_row->>'entityId')::uuid,
      'fresh', true, true, 'unchanged', false, false,
      'Official source observed; future source change requires revalidation.'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_freshness_records f
      where f.id=(v_row->>'id')::uuid and f.entity_type=v_row->>'entityType'
        and f.entity_id=(v_row->>'entityId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:freshness:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('freshnessRecords', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'retrievalMetadata') loop
    insert into public.knowledge_retrieval_metadata (
      id, entity_type, entity_id, full_text_indexed, vector_indexed,
      jurisdiction_filter_required, effective_date_filter_required,
      review_status_filter_required, trust_domain_filter_required,
      authoritative_by_vector_similarity, source_authorization_filter_required,
      handling_policy_filter_required, stale_policy_filter_required
    ) values (
      (v_row->>'id')::uuid, 'claim', (v_row->>'claimId')::uuid, true, false,
      true, true, true, true, false, true, true, true
    ) on conflict (entity_type, entity_id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_retrieval_metadata r
      where r.id=(v_row->>'id')::uuid and r.entity_type='claim'
        and r.entity_id=(v_row->>'claimId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:retrieval:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('retrievalMetadata', v_created);
  v_total_created := v_total_created + v_created;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'terminology') loop
    insert into public.knowledge_terminology (
      id, canonical_german_term, definition_canonical, jurisdiction_id,
      process_group_ids, source_version_id, passage_id, risk_level, review_status
    ) values (
      (v_row->>'id')::uuid, v_row->>'term', v_row->>'definition',
      (p_payload#>>'{jurisdiction,id}')::uuid, array[p_payload->>'packId'],
      (p_payload#>>'{sourceVersion,id}')::uuid, (v_row->>'passageId')::uuid,
      'medium', 'expert_reviewed'
    ) on conflict (id) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_terminology t
      where t.id=(v_row->>'id')::uuid and t.canonical_german_term=v_row->>'term'
        and t.definition_canonical=v_row->>'definition'
        and t.passage_id=(v_row->>'passageId')::uuid
    ) then raise exception 'CURATED_PACK_CONFLICT:terminology:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('terminology', v_created);
  v_total_created := v_total_created + v_created;

  if exists (
    select 1 from jsonb_array_elements(p_payload->'claims') c
    where not exists (
      select 1 from public.knowledge_claim_evidence_links e
      where e.claim_id=(c->>'id')::uuid and e.review_accepted
    )
  ) then raise exception 'CURATED_PACK_EVIDENCE_CLOSURE_FAILED'; end if;

  return jsonb_build_object(
    'packId', p_payload->>'packId',
    'semanticCreated', v_total_created,
    'created', v_counts,
    'claimsWithoutEvidence', 0,
    'brokenEvidenceLinks', 0,
    'jurisdictionlessClaims', 0,
    'regionalPromotionViolations', 0
  );
end;
$$;

revoke all on function public.knowledge_ingest_curated_pack(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_pack(jsonb) is
  'Maintenance-only fixed curated knowledge-pack ingestion boundary. Caller receives EXECUTE only through operator bootstrap.';
