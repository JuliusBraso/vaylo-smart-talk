-- CB-0B: make existing 032 connector tables ingestible.
-- Reuses knowledge_cross_border_connectors / processes / trust_domain_links
-- and responsible-actor rules. Does not redesign those tables.
-- Does not broaden CuratedDomainPack. Does not add country domains.
-- Does not insert substantive 883/987 or SK/CZ/PL/HU national law.
-- No RLS weakening. No anon/authenticated/service_role grants.

create or replace function knowledge_factory_internal.stable_knowledge_factory_id(
  p_entity_class text,
  p_entity_key text
)
returns uuid
language plpgsql
immutable
set search_path = pg_catalog, public
as $$
declare
  v_hex text;
begin
  if nullif(p_entity_class, '') is null or nullif(p_entity_key, '') is null then
    raise exception 'CONNECTOR_STABLE_ID_INVALID';
  end if;
  v_hex := encode(digest(convert_to(
    'knowledge-factory:' || p_entity_class || ':' || p_entity_key,
    'UTF8'
  ), 'sha256'), 'hex');
  return (
    substr(v_hex, 1, 8) || '-' ||
    substr(v_hex, 9, 4) || '-4' ||
    substr(v_hex, 14, 3) || '-8' ||
    substr(v_hex, 18, 3) || '-' ||
    substr(v_hex, 21, 12)
  )::uuid;
end;
$$;

create or replace function knowledge_factory_internal.resolve_connector_claim_ref(
  p_ref jsonb
)
returns uuid
language plpgsql
stable
set search_path = pg_catalog, public
as $$
declare
  v_factory_id uuid;
  v_id uuid;
  v_level text;
  v_country text;
  v_trust text;
  v_status text;
  v_matches integer;
begin
  if p_ref is null or jsonb_typeof(p_ref) <> 'object' then
    raise exception 'CONNECTOR_REFERENCE_INVALID';
  end if;
  if p_ref ? 'id' then
    raise exception 'CONNECTOR_REFERENCE_AMBIGUOUS';
  end if;
  if p_ref->>'temporalClass' = 'PROPOSED_NOT_CURRENT' then
    raise exception 'CONNECTOR_PROPOSED_NOT_CURRENT';
  end if;
  if p_ref->>'temporalClass' is distinct from 'CURRENT' then
    raise exception 'CONNECTOR_NON_CURRENT_REFERENCE';
  end if;
  if p_ref->>'entityClass' is distinct from 'claims'
     or nullif(p_ref->>'key', '') is null then
    raise exception 'CONNECTOR_REFERENCE_INVALID';
  end if;

  v_factory_id := knowledge_factory_internal.stable_knowledge_factory_id(
    'claims', p_ref->>'key'
  );

  select count(*) into v_matches
  from public.knowledge_claims c
  join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
  join public.knowledge_authorities a on a.id = c.authority_id
  join public.knowledge_publishers p on p.id = a.publisher_id
  join public.knowledge_trust_domains t on t.id = p.trust_domain_id
  where c.id = v_factory_id;
  if v_matches = 0 then
    raise exception 'CONNECTOR_REFERENCE_UNRESOLVED';
  end if;
  if v_matches > 1 then
    raise exception 'CONNECTOR_REFERENCE_AMBIGUOUS';
  end if;

  select c.id, j.jurisdiction_level, j.country_code, t.code, c.status
    into v_id, v_level, v_country, v_trust, v_status
  from public.knowledge_claims c
  join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
  join public.knowledge_authorities a on a.id = c.authority_id
  join public.knowledge_publishers p on p.id = a.publisher_id
  join public.knowledge_trust_domains t on t.id = p.trust_domain_id
  where c.id = v_factory_id;

  if p_ref->>'sourceJurisdiction' = 'DE' then
    if v_level is distinct from 'de_federal' or v_country is distinct from 'DE' then
      raise exception 'CONNECTOR_WRONG_JURISDICTION';
    end if;
    if v_trust is distinct from 'de' or p_ref->>'trustDomain' is distinct from 'de' then
      raise exception 'CONNECTOR_WRONG_TRUST_DOMAIN';
    end if;
  elsif p_ref->>'sourceJurisdiction' = 'EU' then
    if v_level is distinct from 'eu' or v_country is distinct from 'EU' then
      raise exception 'CONNECTOR_WRONG_JURISDICTION';
    end if;
    if v_trust is distinct from 'eu' or p_ref->>'trustDomain' is distinct from 'eu' then
      raise exception 'CONNECTOR_WRONG_TRUST_DOMAIN';
    end if;
  else
    raise exception 'CONNECTOR_UNSUPPORTED_SOURCE_JURISDICTION';
  end if;
  if v_status is distinct from 'active' then
    raise exception 'CONNECTOR_WRONG_LIFECYCLE';
  end if;
  return v_id;
end;
$$;

create or replace function knowledge_factory_internal.resolve_connector_process_ref(
  p_ref jsonb
)
returns uuid
language plpgsql
stable
set search_path = pg_catalog, public
as $$
declare
  v_factory_id uuid;
  v_id uuid;
  v_level text;
  v_country text;
  v_status text;
  v_matches integer;
begin
  if p_ref is null or jsonb_typeof(p_ref) <> 'object' then
    raise exception 'CONNECTOR_REFERENCE_INVALID';
  end if;
  if p_ref ? 'id' then
    raise exception 'CONNECTOR_REFERENCE_AMBIGUOUS';
  end if;
  if p_ref->>'temporalClass' = 'PROPOSED_NOT_CURRENT' then
    raise exception 'CONNECTOR_PROPOSED_NOT_CURRENT';
  end if;
  if p_ref->>'temporalClass' is distinct from 'CURRENT'
     or p_ref->>'entityClass' is distinct from 'processes'
     or nullif(p_ref->>'key', '') is null then
    raise exception 'CONNECTOR_REFERENCE_INVALID';
  end if;
  if p_ref->>'sourceJurisdiction' is distinct from 'DE'
     or p_ref->>'trustDomain' is distinct from 'de' then
    raise exception 'CONNECTOR_WRONG_JURISDICTION';
  end if;

  v_factory_id := knowledge_factory_internal.stable_knowledge_factory_id(
    'processes', p_ref->>'key'
  );
  select count(*) into v_matches
  from public.knowledge_processes p
  join public.knowledge_jurisdictions j on j.id = p.jurisdiction_id
  where p.id = v_factory_id;
  if v_matches = 0 then
    raise exception 'CONNECTOR_REFERENCE_UNRESOLVED';
  end if;
  if v_matches > 1 then
    raise exception 'CONNECTOR_REFERENCE_AMBIGUOUS';
  end if;

  select p.id, j.jurisdiction_level, j.country_code, p.status
    into v_id, v_level, v_country, v_status
  from public.knowledge_processes p
  join public.knowledge_jurisdictions j on j.id = p.jurisdiction_id
  where p.id = v_factory_id;
  if v_level is distinct from 'de_federal' or v_country is distinct from 'DE' then
    raise exception 'CONNECTOR_WRONG_JURISDICTION';
  end if;
  if v_status is distinct from 'active' then
    raise exception 'CONNECTOR_WRONG_LIFECYCLE';
  end if;
  return v_id;
end;
$$;

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
  v_uuid_re constant text :=
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  v_keys constant text[] := array[
    'schemaVersion','packId','canonicalLanguage','trustDomain','jurisdictions',
    'territorialScopes','publishers','authorities','sources','sourceVersions',
    'passages','claims','evidenceLinks','citations'
  ];
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'EU_ANCHOR_INVALID_ROOT';
  end if;
  if exists (
    select 1 from jsonb_object_keys(p_payload) k(key)
    where not (k.key = any(v_keys))
  ) or exists (
    select 1 from unnest(v_keys) k(key) where not (p_payload ? k.key)
  ) then
    raise exception 'EU_ANCHOR_INVALID_STRUCTURE';
  end if;
  if p_payload->>'schemaVersion' <> '1'
     or p_payload->>'packId' <> 'eu_jurisdiction_anchor'
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
     or jsonb_array_length(p_payload->'claims') < 1
     or jsonb_array_length(p_payload->'claims') > 20 then
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
      array['eu_jurisdiction_anchor'],
      (v_row->>'retrievalMethod')::public.knowledge_retrieval_method,
      'ALLOWED', 'ALLOWED', now(), now(), 'ACTIVE', 'VERIFIED', 'AUTHORIZED',
      'STORE_CANONICALLY'::public.knowledge_handling_mode,
      'LEGAL_CHANGE_MONITORED'::public.knowledge_freshness_class,
      'DO_NOT_USE_STALE'::public.knowledge_stale_behavior
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

  return jsonb_build_object(
    'semanticCreated', v_total_created,
    'sourceJurisdiction', 'EU',
    'canonicalLanguage', 'de',
    'publicRuntimeAuthorized', false
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'EU_ANCHOR_VALIDATION_FAILED';
end;
$$;

create or replace function public.knowledge_ingest_curated_cross_border_connector_pack(
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_keys constant text[] := array[
    'schemaVersion','packId','originMarket','connectedCountry','status',
    'activationFromLocaleAllowed','activationRequiresVerifiedCaseContext',
    'topicKey','topicFamily','germanProcessRef','germanClaimRefs','euClaimRefs',
    'foreignClaimRefs','foreignProcessReference','actorRule','requiredCaseRoles',
    'requiredCaseStates','handlingMode','freshnessClass'
  ];
  v_countries constant text[] := array['SK','CZ','PL','HU'];
  v_german_process uuid;
  v_german_claim uuid;
  v_eu_claim uuid;
  v_german_ids uuid[] := '{}';
  v_eu_ids uuid[] := '{}';
  v_seen text[] := '{}';
  v_token text;
  v_ref jsonb;
  v_de_trust uuid;
  v_eu_trust uuid;
  v_actor uuid;
  v_connector uuid;
  v_process uuid;
  v_created integer;
  v_total_created integer := 0;
  v_jurisdiction uuid;
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'CONNECTOR_INVALID_ROOT';
  end if;
  if p_payload ? 'userLocale' or p_payload ? 'locale' or p_payload ? 'outputLocale'
     or p_payload ? 'uiLanguage' then
    raise exception 'CONNECTOR_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  if exists (
    select 1 from unnest(v_keys) k(key) where not (p_payload ? k.key)
  ) then
    raise exception 'CONNECTOR_PARTIAL_PAYLOAD';
  end if;
  if p_payload->>'schemaVersion' <> '1'
     or p_payload->>'originMarket' <> 'DE'
     or p_payload->>'packId' !~ '^[a-z0-9_]{3,80}$' then
    raise exception 'CONNECTOR_IDENTITY_INVALID';
  end if;
  if p_payload->>'connectedCountry' is null
     or not (p_payload->>'connectedCountry' = any (v_countries)) then
    raise exception 'CONNECTOR_UNKNOWN_CORRIDOR';
  end if;
  if p_payload->>'status' is distinct from 'planned' then
    raise exception 'CONNECTOR_NOT_PLANNED';
  end if;
  if coalesce((p_payload->>'activationFromLocaleAllowed')::boolean, true) then
    raise exception 'CONNECTOR_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  if coalesce((p_payload->>'activationRequiresVerifiedCaseContext')::boolean, false)
     is distinct from true then
    raise exception 'CONNECTOR_VERIFIED_CONTEXT_REQUIRED';
  end if;
  if p_payload->>'topicFamily' = 'TAX_TREATY' then
    raise exception 'CONNECTOR_TAX_TREATY_ENGINE_NOT_AUTHORIZED';
  end if;
  if p_payload->>'topicFamily' is distinct from 'SOCIAL_SECURITY_COORDINATION' then
    raise exception 'CONNECTOR_TOPIC_FAMILY_INVALID';
  end if;
  if jsonb_typeof(p_payload->'foreignClaimRefs') is distinct from 'array'
     or jsonb_array_length(p_payload->'foreignClaimRefs') > 0 then
    raise exception 'CONNECTOR_FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED';
  end if;
  if jsonb_typeof(p_payload->'germanClaimRefs') is distinct from 'array'
     or jsonb_array_length(p_payload->'germanClaimRefs') < 1 then
    raise exception 'CONNECTOR_MISSING_GERMAN_REFERENCE';
  end if;
  if jsonb_typeof(p_payload->'euClaimRefs') is distinct from 'array'
     or jsonb_array_length(p_payload->'euClaimRefs') < 1 then
    raise exception 'CONNECTOR_MISSING_EU_REFERENCE';
  end if;

  v_german_process := knowledge_factory_internal.resolve_connector_process_ref(
    p_payload->'germanProcessRef'
  );
  for v_ref in select value from jsonb_array_elements(p_payload->'germanClaimRefs') loop
    v_token := coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '');
    if v_token = any (v_seen) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_seen := array_append(v_seen, v_token);
    v_german_claim := knowledge_factory_internal.resolve_connector_claim_ref(v_ref);
    if v_german_claim = any (v_german_ids) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_german_ids := array_append(v_german_ids, v_german_claim);
  end loop;
  for v_ref in select value from jsonb_array_elements(p_payload->'euClaimRefs') loop
    v_token := coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '');
    if v_token = any (v_seen) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_seen := array_append(v_seen, v_token);
    v_eu_claim := knowledge_factory_internal.resolve_connector_claim_ref(v_ref);
    if v_eu_claim = any (v_eu_ids) or v_eu_claim = any (v_german_ids) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_eu_ids := array_append(v_eu_ids, v_eu_claim);
  end loop;

  select id into v_de_trust from public.knowledge_trust_domains where code = 'de';
  select id into v_eu_trust from public.knowledge_trust_domains where code = 'eu';
  if v_de_trust is null then
    raise exception 'CONNECTOR_WRONG_TRUST_DOMAIN';
  end if;
  if v_eu_trust is null then
    raise exception 'CONNECTOR_WRONG_TRUST_DOMAIN';
  end if;
  select jurisdiction_id into v_jurisdiction
  from public.knowledge_processes
  where id = v_german_process;

  v_actor := knowledge_factory_internal.stable_knowledge_factory_id(
    'responsible_actor_rules',
    (p_payload->>'originMarket') || ':' || (p_payload->>'connectedCountry') || ':' || (p_payload->>'topicKey')
  );
  insert into public.knowledge_responsible_actor_rules(
    id, actor_state, user_must_act, german_authority_must_act,
    foreign_authority_must_act, institution_exchange_expected,
    jurisdiction_id, review_status, concrete_instruction_allowed
  ) values (
    v_actor,
    p_payload#>>'{actorRule,actorState}',
    coalesce((p_payload#>>'{actorRule,userMustAct}')::boolean, false),
    coalesce((p_payload#>>'{actorRule,germanAuthorityMustAct}')::boolean, false),
    coalesce((p_payload#>>'{actorRule,foreignAuthorityMustAct}')::boolean, false),
    coalesce((p_payload#>>'{actorRule,institutionExchangeExpected}')::boolean, false),
    v_jurisdiction, 'expert_reviewed', false
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  v_connector := knowledge_factory_internal.stable_knowledge_factory_id(
    'cross_border_connectors',
    (p_payload->>'originMarket') || ':' || (p_payload->>'connectedCountry')
  );
  insert into public.knowledge_cross_border_connectors(
    id, origin_market, connected_country, trust_domain_ids, status,
    activation_requires_verified_case_context, activation_from_locale_allowed,
    review_status
  ) values (
    v_connector, 'DE', p_payload->>'connectedCountry',
    array[v_de_trust, v_eu_trust], 'planned',
    true, false, 'unverified'
  ) on conflict (origin_market, connected_country) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  select id into v_connector
  from public.knowledge_cross_border_connectors
  where origin_market = 'DE' and connected_country = p_payload->>'connectedCountry';
  if v_connector is null or exists (
    select 1 from public.knowledge_cross_border_connectors c
    where c.id = v_connector and (c.status <> 'planned' or c.activation_from_locale_allowed)
  ) then
    raise exception 'CONNECTOR_NOT_PLANNED';
  end if;

  v_process := knowledge_factory_internal.stable_knowledge_factory_id(
    'cross_border_processes',
    (p_payload->>'originMarket') || ':' || (p_payload->>'connectedCountry') || ':' ||
    (p_payload#>>'{germanProcessRef,key}')
  );
  insert into public.knowledge_cross_border_processes(
    id, cross_border_connector_id, german_process_id, foreign_process_reference,
    eu_coordination_claim_ids, german_claim_ids, foreign_claim_ids,
    responsible_actor_rule_id, authority_resolution_status,
    evidence_completeness_status, temporal_alignment_status, review_status
  ) values (
    v_process, v_connector, v_german_process,
    coalesce(nullif(p_payload->>'foreignProcessReference', ''),
      'FOREIGN_ADAPTER_NOT_YET_AUTHORIZED'),
    v_eu_ids, v_german_ids, '{}', v_actor,
    'unresolved', 'incomplete', 'unresolved', 'unverified'
  ) on conflict (cross_border_connector_id, german_process_id, foreign_process_reference)
    do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_trust_domain_links(
    entity_type, entity_id, trust_domain_id, required
  ) values
    ('cross_border_connector', v_connector, v_de_trust, true),
    ('cross_border_connector', v_connector, v_eu_trust, true),
    ('cross_border_process', v_process, v_de_trust, true),
    ('cross_border_process', v_process, v_eu_trust, true)
  on conflict (entity_type, entity_id, trust_domain_id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  return jsonb_build_object(
    'semanticCreated', v_total_created,
    'connectorId', v_connector,
    'connectedCountry', p_payload->>'connectedCountry',
    'status', 'planned',
    'resolvedGermanProcessId', v_german_process,
    'resolvedGermanClaimIds', to_jsonb(v_german_ids),
    'resolvedEuClaimIds', to_jsonb(v_eu_ids),
    'activationFromLocaleAllowed', false,
    'publicRuntimeAuthorized', false
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'CONNECTOR_VALIDATION_FAILED';
end;
$$;

revoke all on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public.knowledge_ingest_curated_cross_border_connector_pack(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function knowledge_factory_internal.stable_knowledge_factory_id(text, text)
  from public, anon, authenticated, service_role;
revoke all on function knowledge_factory_internal.resolve_connector_claim_ref(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function knowledge_factory_internal.resolve_connector_process_ref(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb) is
  'CB-0B narrow EU source-jurisdiction writer. Rejects SK/CZ/PL/HU national ingestion. No production role grant.';
comment on function public.knowledge_ingest_curated_cross_border_connector_pack(jsonb) is
  'CB-0B connector writer for existing 032 tables. Resolves factory keys to DB UUIDs. Locale cannot activate. No production role grant.';
