-- CB-0I: add eu_unemployment_coordination to the EU process-group
-- allowlist and to the EU jurisdiction writer. Additive only.
-- Does not modify 052–057. Does not add SK/CZ/PL/HU national unemployment.
-- Does not create a DE↔SK unemployment connector. No production role grants.

alter table public.knowledge_processes
  drop constraint if exists knowledge_processes_process_group_id_check;

alter table public.knowledge_processes
  add constraint knowledge_processes_process_group_id_check check (process_group_id in (
    'anmeldung_ummeldung_abmeldung',
    'steuer_id_and_basic_finanzamt_letters',
    'health_insurance_orientation',
    'jobcenter_buergergeld',
    'familienkasse_kindergeld',
    'rechnung_mahnung',
    'kuendigung_orientation',
    'auslaenderbehoerde_limited_orientation',
    'vehicle_registration_and_driving_licence',
    'housing_orientation',
    'arbeitslosengeld',
    'einkommensteuer_steuererklaerung',
    'wohngeld',
    'versicherungsvertraege_versicherungsschreiben',
    'banking_zahlungsverkehr',
    'verkehrsordnungswidrigkeiten_bussgeldverfahren',
    'elterngeld',
    'eu_applicable_legislation',
    'sk_applicable_legislation_adapter',
    'de_applicable_legislation_routing',
    'de_sk_applicable_legislation_connector',
    'eu_health_insurance_coordination',
    'sk_health_insurance_coordination_adapter',
    'de_health_insurance_coordination_routing',
    'de_sk_health_insurance_coordination_connector',
    'eu_family_benefits_coordination',
    'sk_family_benefits_adapter',
    'de_family_benefits_coordination_routing',
    'de_sk_family_benefits_coordination_connector',
    'eu_unemployment_coordination'
  ));

create or replace function public.knowledge_ingest_curated_eu_jurisdiction_anchor(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_row jsonb;
  v_created integer;
  v_total_created integer := 0;
  v_pack_id text;
  v_process_group text;
  v_claim_id uuid;
  v_digest text;
  v_metadata_id uuid;
  v_processes jsonb;
  v_links jsonb;
  v_policies jsonb;
  v_freshness jsonb;
  v_uuid_re constant text :=
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  v_required constant text[] := array[
    'schemaVersion','packId','canonicalLanguage','trustDomain','jurisdictions',
    'territorialScopes','publishers','authorities','sources','sourceVersions',
    'passages','claims','evidenceLinks','citations'
  ];
  v_optional constant text[] := array[
    'processes','processClaimLinks','handlingPolicies','freshnessRecords'
  ];
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'EU_ANCHOR_INVALID_ROOT';
  end if;
  v_pack_id := p_payload->>'packId';
  if v_pack_id is distinct from 'eu_jurisdiction_anchor'
     and v_pack_id is distinct from 'eu_applicable_legislation'
     and v_pack_id is distinct from 'eu_health_insurance_coordination'
     and v_pack_id is distinct from 'eu_family_benefits_coordination'
     and v_pack_id is distinct from 'eu_unemployment_coordination' then
    raise exception 'EU_ANCHOR_IDENTITY_INVALID';
  end if;
  v_process_group := case v_pack_id
    when 'eu_unemployment_coordination' then 'eu_unemployment_coordination'
    when 'eu_family_benefits_coordination' then 'eu_family_benefits_coordination'
    when 'eu_health_insurance_coordination' then 'eu_health_insurance_coordination'
    when 'eu_applicable_legislation' then 'eu_applicable_legislation'
    else null
  end;
  if v_pack_id = 'eu_jurisdiction_anchor' then
    if exists (
      select 1 from jsonb_object_keys(p_payload) k(key)
      where not (k.key = any(v_required))
    ) or exists (
      select 1 from unnest(v_required) k(key) where not (p_payload ? k.key)
    ) then
      raise exception 'EU_ANCHOR_INVALID_STRUCTURE';
    end if;
  else
    if exists (
      select 1 from jsonb_object_keys(p_payload) k(key)
      where not (k.key = any(v_required) or k.key = any(v_optional))
    ) or exists (
      select 1 from unnest(v_required) k(key) where not (p_payload ? k.key)
    ) then
      raise exception 'EU_ANCHOR_INVALID_STRUCTURE';
    end if;
  end if;
  if p_payload->>'schemaVersion' <> '1'
     or p_payload->>'canonicalLanguage' <> 'de'
     or p_payload#>>'{trustDomain,code}' <> 'eu' then
    raise exception 'EU_ANCHOR_IDENTITY_INVALID';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
    where j->>'countryCode' in ('SK','CZ','PL','HU','DE')
       or j->>'code' in ('SK','CZ','PL','HU')
       or j->>'level' is distinct from 'eu'
       or j->>'countryCode' is distinct from 'EU'
       or j->>'code' is distinct from 'EU'
  ) then
    raise exception 'EU_ANCHOR_FOREIGN_NATIONAL_FORBIDDEN';
  end if;
  if jsonb_array_length(p_payload->'jurisdictions') <> 1
     or jsonb_array_length(p_payload->'claims') < 1 then
    raise exception 'EU_ANCHOR_CARDINALITY_INVALID';
  end if;
  if v_pack_id = 'eu_jurisdiction_anchor'
     and jsonb_array_length(p_payload->'claims') > 20 then
    raise exception 'EU_ANCHOR_CARDINALITY_INVALID';
  end if;
  if v_pack_id in (
        'eu_applicable_legislation',
        'eu_health_insurance_coordination',
        'eu_family_benefits_coordination',
        'eu_unemployment_coordination'
      )
     and jsonb_array_length(p_payload->'claims') > 500 then
    raise exception 'EU_ANCHOR_CARDINALITY_INVALID';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'claims') c
    where c->>'temporalClass' is distinct from 'CURRENT'
  ) then
    raise exception 'EU_ANCHOR_NON_CURRENT';
  end if;
  if p_payload#>>'{trustDomain,id}' !~ v_uuid_re then
    raise exception 'EU_ANCHOR_ID_INVALID';
  end if;

  insert into public.knowledge_trust_domains(id, code, name, review_status)
  values (
    (p_payload#>>'{trustDomain,id}')::uuid,
    'eu',
    p_payload#>>'{trustDomain,name}',
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_trust_domains t
    where t.id = (p_payload#>>'{trustDomain,id}')::uuid and t.code = 'eu'
  ) then
    raise exception 'EU_ANCHOR_CONFLICT:trust_domain';
  end if;

  for v_row in select value from jsonb_array_elements(p_payload->'jurisdictions') loop
    insert into public.knowledge_jurisdictions(
      id, jurisdiction_level, jurisdiction_code, country_code,
      parent_jurisdiction_id, name, status
    ) values (
      (v_row->>'id')::uuid, 'eu', 'EU', 'EU',
      null, v_row->>'name', 'active'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
    if not exists (
      select 1 from public.knowledge_jurisdictions j
      where j.id = (v_row->>'id')::uuid
        and j.jurisdiction_level = 'eu'
        and j.country_code = 'EU'
    ) then
      raise exception 'EU_ANCHOR_CONFLICT:jurisdiction';
    end if;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'territorialScopes') loop
    insert into public.knowledge_territorial_scopes(
      id, scope_type, jurisdiction_ids, cross_border_countries,
      scope_verified, review_status
    ) values (
      (v_row->>'id')::uuid, v_row->>'type',
      array(select jsonb_array_elements_text(v_row->'jurisdictionIds'))::uuid[],
      array['EU'], true, 'expert_reviewed'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'publishers') loop
    insert into public.knowledge_publishers(
      id, publisher_name, publisher_type, official_status,
      territorial_competence_id, trust_domain_id, review_status
    ) values (
      (v_row->>'id')::uuid, v_row->>'name', v_row->>'type', true,
      (v_row->>'territorialScopeId')::uuid, (v_row->>'trustDomainId')::uuid,
      'expert_reviewed'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'authorities') loop
    insert into public.knowledge_authorities(
      id, publisher_id, authority_name, authority_type, jurisdiction_id,
      territorial_scope_id, official_portal_url, status, review_status
    ) values (
      (v_row->>'id')::uuid, (v_row->>'publisherId')::uuid, v_row->>'name',
      v_row->>'type', (v_row->>'jurisdictionId')::uuid,
      (v_row->>'territorialScopeId')::uuid, v_row->>'officialPortalUrl',
      'active', 'expert_reviewed'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'sources') loop
    insert into public.knowledge_sources(
      id, publisher_id, source_type, source_purpose, canonical_url, official_domain,
      official_domain_verification_status, jurisdiction_id, territorial_scope_id,
      source_language, publication_identifier, supports_claim_types, high_risk_use_allowed,
      normalized_canonical_url, normalized_origin, source_class, evidence_eligibility,
      issuing_authority_id, authority_level, process_scope, retrieval_method,
      terms_or_license_review_status, robots_review_status, first_verified_at, last_verified_at,
      active_status, trust_status, authorization_state, default_handling_mode,
      freshness_class, stale_behavior
    ) values (
      (v_row->>'id')::uuid, (v_row->>'publisherId')::uuid, v_row->>'sourceType',
      v_row->>'purpose', v_row->>'canonicalUrl', lower(v_row->>'officialDomain'),
      'verified', (v_row->>'jurisdictionId')::uuid, (v_row->>'territorialScopeId')::uuid,
      'de', v_row->>'publicationIdentifier',
      array(select jsonb_array_elements_text(coalesce(v_row->'supportsClaimTypes', '[]'::jsonb))),
      false, v_row->>'canonicalUrl', lower(v_row->>'normalizedOrigin'),
      (v_row->>'sourceClass')::public.knowledge_source_class,
      'PUBLICATION_EVIDENCE_ELIGIBLE', (v_row->>'authorityId')::uuid,
      'EU'::public.knowledge_authority_level,
      array[v_pack_id],
      (v_row->>'retrievalMethod')::public.knowledge_retrieval_method,
      'ALLOWED', 'ALLOWED', now(), now(), 'ACTIVE', 'VERIFIED', 'AUTHORIZED',
      coalesce(v_row->>'handlingMode', 'STORE_CANONICALLY')::public.knowledge_handling_mode,
      coalesce(v_row->>'freshnessClass', 'LEGAL_CHANGE_MONITORED')::public.knowledge_freshness_class,
      coalesce(v_row->>'staleBehavior', 'DO_NOT_USE_STALE')::public.knowledge_stale_behavior
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'sourceVersions') loop
    insert into public.knowledge_source_versions(
      id, source_id, version_sequence, content_hash, normalized_content_hash,
      review_status, freshness_status, change_status, immutable, historical_use_allowed,
      current_use_allowed
    ) values (
      (v_row->>'id')::uuid, (v_row->>'sourceId')::uuid,
      (v_row->>'versionSequence')::integer, v_row->>'contentHash',
      v_row->>'contentHash', 'expert_reviewed', 'fresh', 'unchanged', true, true, true
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'passages') loop
    insert into public.knowledge_source_passages(
      id, source_version_id, passage_order, heading_path, section_identifier, text,
      text_hash, language, citation_ready, review_status
    ) values (
      (v_row->>'id')::uuid, (v_row->>'sourceVersionId')::uuid,
      (v_row->>'order')::integer,
      array(select jsonb_array_elements_text(coalesce(v_row->'headingPath', '[]'::jsonb))),
      v_row->>'locator', v_row->>'text', v_row->>'textHash', 'de', true, 'expert_reviewed'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
    insert into public.knowledge_claims(
      id, claim_type, claim_text_canonical, claim_language, market, jurisdiction_id,
      territorial_scope_id, authority_id, risk_level, allowed_output_uses,
      requires_direct_support, requires_effective_date, requires_authority_resolution,
      review_status, freshness_status, status
    ) values (
      (v_row->>'id')::uuid, v_row->>'type', v_row->>'text', 'de', 'DE',
      (v_row->>'jurisdictionId')::uuid, nullif(v_row->>'territorialScopeId', '')::uuid,
      nullif(v_row->>'authorityId', '')::uuid, v_row->>'riskLevel',
      array['orientation'], true, false, true,
      'expert_reviewed', 'fresh', 'active'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;

    v_claim_id := (v_row->>'id')::uuid;
    v_digest := pg_catalog.md5(
      'knowledge_retrieval_metadata:claim:' || v_claim_id::text
    );
    v_metadata_id := (
      pg_catalog.substr(v_digest, 1, 8) || '-' ||
      pg_catalog.substr(v_digest, 9, 4) || '-3' ||
      pg_catalog.substr(v_digest, 14, 3) || '-8' ||
      pg_catalog.substr(v_digest, 18, 3) || '-' ||
      pg_catalog.substr(v_digest, 21, 12)
    )::uuid;
    insert into public.knowledge_retrieval_metadata (
      id, entity_type, entity_id, full_text_indexed, vector_indexed,
      jurisdiction_filter_required, effective_date_filter_required,
      review_status_filter_required, trust_domain_filter_required,
      authoritative_by_vector_similarity, source_authorization_filter_required,
      handling_policy_filter_required, stale_policy_filter_required
    ) values (
      v_metadata_id, 'claim', v_claim_id, true, false,
      true, true, true, true, false, true, true, true
    )
    on conflict (entity_type, entity_id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'evidenceLinks') loop
    insert into public.knowledge_claim_evidence_links(
      id, claim_id, source_version_id, passage_id, support_status, evidence_role,
      is_primary_evidence, jurisdiction_match, territorial_scope_match,
      authority_competence_match, effective_date_match, review_accepted, authorized_use
    ) values (
      (v_row->>'id')::uuid, (v_row->>'claimId')::uuid,
      (v_row->>'sourceVersionId')::uuid, (v_row->>'passageId')::uuid,
      'direct_support', v_row->>'role',
      coalesce((v_row->>'primary')::boolean, true), true, true, true, true, true,
      array['orientation']
    ) on conflict (claim_id, passage_id, evidence_role) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(p_payload->'citations') loop
    insert into public.knowledge_citations(
      id, claim_id, source_id, source_version_id, passage_id, publisher_id,
      jurisdiction_id, last_verified_at, user_facing_label, internal_audit_label,
      original_language, canonical_url
    ) values (
      (v_row->>'id')::uuid, (v_row->>'claimId')::uuid, (v_row->>'sourceId')::uuid,
      (v_row->>'sourceVersionId')::uuid, (v_row->>'passageId')::uuid,
      (v_row->>'publisherId')::uuid, (v_row->>'jurisdictionId')::uuid, now(),
      v_row->>'label', v_row->>'label', 'de', v_row->>'canonicalUrl'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  v_processes := coalesce(p_payload->'processes', '[]'::jsonb);
  v_links := coalesce(p_payload->'processClaimLinks', '[]'::jsonb);
  v_policies := coalesce(p_payload->'handlingPolicies', '[]'::jsonb);
  v_freshness := coalesce(p_payload->'freshnessRecords', '[]'::jsonb);
  if jsonb_typeof(v_processes) is distinct from 'array'
     or jsonb_typeof(v_links) is distinct from 'array'
     or jsonb_typeof(v_policies) is distinct from 'array'
     or jsonb_typeof(v_freshness) is distinct from 'array' then
    raise exception 'EU_ANCHOR_INVALID_STRUCTURE';
  end if;

  for v_row in select value from jsonb_array_elements(v_processes) loop
    insert into public.knowledge_processes(
      id, process_group_id, title, jurisdiction_id, territorial_scope_id, risk_level,
      orientation_only, trigger_description, safe_first_step,
      regional_variation_expected, cross_border_preparation_relevant,
      full_legal_advice_excluded, review_status
    ) values (
      (v_row->>'id')::uuid, v_process_group, v_row->>'title',
      (v_row->>'jurisdictionId')::uuid, nullif(v_row->>'territorialScopeId', '')::uuid,
      v_row->>'riskLevel', true, v_row->>'trigger', v_row->>'safeFirstStep',
      coalesce((v_row->>'regionalVariationExpected')::boolean, false),
      true, true, 'expert_reviewed'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(v_links) loop
    insert into public.knowledge_process_claim_links(
      id, process_id, claim_id, claim_role, required, sequence_context,
      qualification_required
    ) values (
      (v_row->>'id')::uuid, (v_row->>'processId')::uuid,
      (v_row->>'claimId')::uuid, v_row->>'role',
      coalesce((v_row->>'required')::boolean, true),
      v_row->>'sequenceContext',
      coalesce((v_row->>'qualificationRequired')::boolean, false)
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(v_policies) loop
    insert into public.knowledge_source_handling_policies(
      id, source_id, information_class, process_scope, handling_mode, freshness_class,
      stale_behavior, required_context_keys, risk_class, state_version, revalidation_due_at
    ) values (
      (v_row->>'id')::uuid, (v_row->>'sourceId')::uuid,
      (v_row->>'informationClass')::public.knowledge_information_class, v_pack_id,
      (v_row->>'handlingMode')::public.knowledge_handling_mode,
      (v_row->>'freshnessClass')::public.knowledge_freshness_class,
      (v_row->>'staleBehavior')::public.knowledge_stale_behavior,
      array(select jsonb_array_elements_text(coalesce(v_row->'requiredContextKeys', '[]'::jsonb)))::public.knowledge_required_context_key[],
      v_row->>'riskClass', 1, nullif(v_row->>'revalidationDueAt', '')::timestamptz
    ) on conflict (source_id, information_class, process_scope) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_row in select value from jsonb_array_elements(v_freshness) loop
    insert into public.knowledge_freshness_records(
      id, entity_type, entity_id, freshness_status, source_available,
      content_hash_matches, change_status, effective_date_known, review_required
    ) values (
      (v_row->>'id')::uuid, v_row->>'entityType', (v_row->>'entityId')::uuid,
      v_row->>'status', true, true, 'unchanged',
      coalesce((v_row->>'effectiveDateKnown')::boolean, false), false
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  return jsonb_build_object(
    'semanticCreated', v_total_created,
    'sourceJurisdiction', 'EU',
    'canonicalLanguage', 'de',
    'packId', v_pack_id,
    'publicRuntimeAuthorized', false
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'EU_ANCHOR_VALIDATION_FAILED';
end;
$$;

revoke all on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb) is
  'CB-0B/0C/0E/0G/0I EU source-jurisdiction writer. Accepts eu_jurisdiction_anchor, eu_applicable_legislation, eu_health_insurance_coordination, eu_family_benefits_coordination and eu_unemployment_coordination. Rejects SK/CZ/PL/HU national ingestion. No production role grant.';
