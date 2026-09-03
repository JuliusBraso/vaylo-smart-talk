-- AT-SK-0E: additive AT health-coordination routing process group,
-- AT-SK health connector support, and server-only ingest wrappers.
-- Does not activate AT-SK, public runtime, or other domain connectors.
-- Does not modify 063. Does not drop origin_market or resolver functions.
-- Do not deploy.

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
    'eu_unemployment_coordination',
    'sk_unemployment_coordination_adapter',
    'de_unemployment_coordination_routing',
    'de_sk_unemployment_coordination_connector',
    'sk_income_tax_residence',
    'at_national_foundation',
    'at_applicable_legislation_routing',
    'at_sk_applicable_legislation_connector',
    'at_health_coordination_routing',
    'at_sk_health_coordination_connector'
  ));

create or replace function public.knowledge_ingest_curated_at_health_coordination_routing_pack(
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_pack_id text;
begin
  v_pack_id := p_payload->>'packId';
  if v_pack_id is distinct from 'at_health_coordination_routing' then
    raise exception 'AT_HEALTH_ROUTING_PACK_IDENTITY_INVALID';
  end if;
  if p_payload->>'countryCode' is distinct from 'AT' then
    raise exception 'AT_HEALTH_ROUTING_COUNTRY_NOT_AUTHORIZED';
  end if;
  if p_payload#>>'{trustDomain,code}' is distinct from 'at' then
    raise exception 'AT_HEALTH_ROUTING_TRUST_DOMAIN_INVALID';
  end if;
  if exists (
    select 1 from jsonb_array_elements(coalesce(p_payload->'jurisdictions', '[]'::jsonb)) j
    where j->>'countryCode' in ('DE', 'SK', 'CZ', 'PL', 'HU', 'EU')
       or j->>'code' in ('DE', 'SK', 'CZ', 'PL', 'HU', 'EU', 'de_sk')
       or j->>'level' is distinct from 'at_national'
       or j->>'countryCode' is distinct from 'AT'
  ) then
    raise exception 'AT_HEALTH_ROUTING_JURISDICTION_INVALID';
  end if;
  if p_payload ? 'userLocale' or p_payload ? 'locale' or p_payload ? 'outputLocale'
     or p_payload ? 'uiLanguage' then
    raise exception 'AT_HEALTH_ROUTING_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  return knowledge_factory_internal.ingest_curated_layer_pack(
    p_payload,
    v_pack_id,
    'at',
    'at_national',
    'AT',
    'at_health_coordination_routing',
    'SPECIFIC_AUTHORITY',
    'de'
  );
end;
$$;

create or replace function public.knowledge_ingest_curated_at_sk_health_coordination_connector_pack(
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
  v_at_process uuid;
  v_at_claim uuid;
  v_eu_claim uuid;
  v_sk_claim uuid;
  v_at_ids uuid[] := '{}';
  v_eu_ids uuid[] := '{}';
  v_sk_ids uuid[] := '{}';
  v_seen text[] := '{}';
  v_token text;
  v_ref jsonb;
  v_process_row jsonb;
  v_claim_ref jsonb;
  v_at_trust uuid;
  v_eu_trust uuid;
  v_sk_trust uuid;
  v_actor uuid;
  v_connector uuid;
  v_process uuid;
  v_corridor_process uuid;
  v_created integer;
  v_total_created integer := 0;
  v_jurisdiction uuid;
  v_status text;
  v_foreign_ref text;
  v_corridor jsonb;
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
     or p_payload->>'packId' is distinct from 'at_sk_health_coordination'
     or p_payload->>'originMarket' is distinct from 'AT'
     or p_payload->>'connectedCountry' is distinct from 'SK' then
    raise exception 'CONNECTOR_IDENTITY_INVALID';
  end if;
  v_status := p_payload->>'status';
  if v_status = 'active' then
    raise exception 'CONNECTOR_ACTIVE_FORBIDDEN';
  end if;
  if v_status is distinct from 'planned' and v_status is distinct from 'prepared' then
    raise exception 'CONNECTOR_NOT_PLANNED';
  end if;
  if coalesce((p_payload->>'activationFromLocaleAllowed')::boolean, true) then
    raise exception 'CONNECTOR_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  if coalesce((p_payload->>'activationRequiresVerifiedCaseContext')::boolean, false)
     is distinct from true then
    raise exception 'CONNECTOR_VERIFIED_CONTEXT_REQUIRED';
  end if;
  if p_payload->>'topicFamily' is distinct from 'SOCIAL_SECURITY_COORDINATION' then
    raise exception 'CONNECTOR_TOPIC_FAMILY_INVALID';
  end if;
  if jsonb_typeof(p_payload->'foreignClaimRefs') is distinct from 'array'
     or jsonb_array_length(p_payload->'foreignClaimRefs') < 1
     or exists (
       select 1 from jsonb_array_elements(p_payload->'foreignClaimRefs') r
       where r->>'sourceJurisdiction' is distinct from 'SK'
          or r->>'trustDomain' is distinct from 'sk'
     ) then
    raise exception 'CONNECTOR_FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED';
  end if;
  if jsonb_typeof(p_payload->'germanClaimRefs') is distinct from 'array'
     or jsonb_array_length(p_payload->'germanClaimRefs') < 1
     or exists (
       select 1 from jsonb_array_elements(p_payload->'germanClaimRefs') r
       where r->>'sourceJurisdiction' is distinct from 'AT'
          or r->>'trustDomain' is distinct from 'at'
     ) then
    raise exception 'CONNECTOR_MISSING_AT_REFERENCE';
  end if;
  if jsonb_typeof(p_payload->'euClaimRefs') is distinct from 'array'
     or jsonb_array_length(p_payload->'euClaimRefs') < 1 then
    raise exception 'CONNECTOR_MISSING_EU_REFERENCE';
  end if;

  v_at_process := knowledge_factory_internal.resolve_connector_process_ref(
    p_payload->'germanProcessRef'
  );
  for v_ref in select value from jsonb_array_elements(p_payload->'germanClaimRefs') loop
    v_token := coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '');
    if v_token = any (v_seen) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_seen := array_append(v_seen, v_token);
    v_at_claim := knowledge_factory_internal.resolve_connector_claim_ref(v_ref);
    v_at_ids := array_append(v_at_ids, v_at_claim);
  end loop;
  for v_ref in select value from jsonb_array_elements(p_payload->'euClaimRefs') loop
    v_token := coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '');
    if v_token = any (v_seen) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_seen := array_append(v_seen, v_token);
    v_eu_claim := knowledge_factory_internal.resolve_connector_claim_ref(v_ref);
    v_eu_ids := array_append(v_eu_ids, v_eu_claim);
  end loop;
  for v_ref in select value from jsonb_array_elements(p_payload->'foreignClaimRefs') loop
    v_token := coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '');
    if v_token = any (v_seen) then
      raise exception 'CONNECTOR_DUPLICATE_REFERENCE';
    end if;
    v_seen := array_append(v_seen, v_token);
    v_sk_claim := knowledge_factory_internal.resolve_connector_claim_ref(v_ref);
    v_sk_ids := array_append(v_sk_ids, v_sk_claim);
  end loop;

  select id into v_at_trust from public.knowledge_trust_domains where code = 'at';
  select id into v_eu_trust from public.knowledge_trust_domains where code = 'eu';
  select id into v_sk_trust from public.knowledge_trust_domains where code = 'sk';
  if v_at_trust is null or v_eu_trust is null or v_sk_trust is null then
    raise exception 'CONNECTOR_WRONG_TRUST_DOMAIN';
  end if;
  select jurisdiction_id into v_jurisdiction
    from public.knowledge_processes
   where id = v_at_process;

  v_actor := knowledge_factory_internal.stable_knowledge_factory_id(
    'responsible_actor_rules',
    'AT:SK:health-insurance-coordination-s1-ehic-s2'
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
    'cross_border_connectors', 'AT:SK'
  );
  insert into public.knowledge_cross_border_connectors(
    id, origin_market, connected_country, trust_domain_ids, status,
    activation_requires_verified_case_context, activation_from_locale_allowed,
    review_status
  ) values (
    v_connector, 'AT', 'SK',
    array[v_at_trust, v_eu_trust, v_sk_trust],
    v_status, true, false, 'unverified'
  ) on conflict (origin_market, connected_country) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  select id into v_connector
    from public.knowledge_cross_border_connectors
   where origin_market = 'AT' and connected_country = 'SK';
  if v_connector is null or exists (
    select 1 from public.knowledge_cross_border_connectors c
    where c.id = v_connector
      and (c.status not in ('planned', 'prepared') or c.activation_from_locale_allowed)
  ) then
    raise exception 'CONNECTOR_NOT_PLANNED';
  end if;

  v_foreign_ref := nullif(p_payload->>'foreignProcessReference', '');
  if v_foreign_ref is null then
    raise exception 'CONNECTOR_MISSING_SK_PROCESS';
  end if;

  v_process := knowledge_factory_internal.stable_knowledge_factory_id(
    'cross_border_processes',
    'AT:SK:' || (p_payload#>>'{germanProcessRef,key}')
  );
  insert into public.knowledge_cross_border_processes(
    id, cross_border_connector_id, german_process_id, foreign_process_reference,
    eu_coordination_claim_ids, german_claim_ids, foreign_claim_ids,
    responsible_actor_rule_id, authority_resolution_status,
    evidence_completeness_status, temporal_alignment_status, review_status
  ) values (
    v_process, v_connector, v_at_process, v_foreign_ref,
    v_eu_ids, v_at_ids, v_sk_ids, v_actor,
    'unresolved', 'incomplete', 'unresolved', 'unverified'
  ) on conflict (cross_border_connector_id, german_process_id, foreign_process_reference)
    do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_trust_domain_links(
    entity_type, entity_id, trust_domain_id, required
  ) values
    ('cross_border_connector', v_connector, v_at_trust, true),
    ('cross_border_connector', v_connector, v_eu_trust, true),
    ('cross_border_connector', v_connector, v_sk_trust, true),
    ('cross_border_process', v_process, v_at_trust, true),
    ('cross_border_process', v_process, v_eu_trust, true),
    ('cross_border_process', v_process, v_sk_trust, true)
  on conflict (entity_type, entity_id, trust_domain_id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  v_corridor := coalesce(p_payload->'corridorProcesses', '[]'::jsonb);
  if jsonb_typeof(v_corridor) is distinct from 'array' then
    raise exception 'CONNECTOR_INVALID_ROOT';
  end if;
  for v_process_row in select value from jsonb_array_elements(v_corridor) loop
    v_corridor_process := knowledge_factory_internal.stable_knowledge_factory_id(
      'processes', v_process_row->>'key'
    );
    insert into public.knowledge_processes(
      id, process_group_id, title, jurisdiction_id, territorial_scope_id, risk_level,
      orientation_only, trigger_description, safe_first_step,
      regional_variation_expected, cross_border_preparation_relevant,
      full_legal_advice_excluded, review_status
    ) values (
      v_corridor_process, 'at_sk_health_coordination_connector',
      v_process_row->>'title', v_jurisdiction, null,
      coalesce(v_process_row->>'riskLevel', 'high'), true,
      v_process_row->>'trigger', v_process_row->>'safeFirstStep',
      false, true, true, 'expert_reviewed'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
    for v_claim_ref in select value from jsonb_array_elements(coalesce(v_process_row->'claimRefs', '[]'::jsonb)) loop
      v_sk_claim := knowledge_factory_internal.resolve_connector_claim_ref(v_claim_ref);
      insert into public.knowledge_process_claim_links(
        id, process_id, claim_id, claim_role, required, sequence_context,
        qualification_required
      ) values (
        knowledge_factory_internal.stable_knowledge_factory_id(
          'processClaimLinks',
          (v_process_row->>'key') || ':' || (v_claim_ref->>'key') || ':' || coalesce(v_claim_ref->>'entityClass', 'claims')
        ),
        v_corridor_process, v_sk_claim, 'orientation', true,
        coalesce(v_claim_ref->>'key', 'link'), false
      ) on conflict (id) do nothing;
      get diagnostics v_created = row_count;
      v_total_created := v_total_created + v_created;
    end loop;
  end loop;

  return jsonb_build_object(
    'semanticCreated', v_total_created,
    'connectorId', v_connector,
    'connectedCountry', 'SK',
    'status', v_status,
    'resolvedAtProcessId', v_at_process,
    'resolvedAtClaimIds', to_jsonb(v_at_ids),
    'resolvedEuClaimIds', to_jsonb(v_eu_ids),
    'resolvedForeignClaimIds', to_jsonb(v_sk_ids),
    'activationFromLocaleAllowed', false,
    'publicRuntimeAuthorized', false
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'CONNECTOR_VALIDATION_FAILED';
end;
$$;

revoke all on function public.knowledge_ingest_curated_at_health_coordination_routing_pack(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public.knowledge_ingest_curated_at_sk_health_coordination_connector_pack(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function knowledge_factory_internal.resolve_connector_claim_ref(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function knowledge_factory_internal.resolve_connector_process_ref(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_at_health_coordination_routing_pack(jsonb) is
  'AT-SK-0E server-only Austrian health-coordination routing ingest. Revoke-by-default. Not deployed.';
comment on function public.knowledge_ingest_curated_at_sk_health_coordination_connector_pack(jsonb) is
  'AT-SK-0E server-only AT-SK health-coordination connector ingest. Prepared only. Revoke-by-default. Not deployed.';
