-- AT-SK-0K: additive AT↔SK tax residence / treaty connector ingestion.
-- Extends bilateral tax claim roles for austrian_domestic_tax.
-- Requires existing AT-SK treaty from 069. Does not activate public runtime.
-- Do not deploy.

alter table public.knowledge_bilateral_tax_process_claim_links
  drop constraint if exists knowledge_bilateral_tax_process_claim_links_claim_role_check;

alter table public.knowledge_bilateral_tax_process_claim_links
  add constraint knowledge_bilateral_tax_process_claim_links_claim_role_check
  check (claim_role in (
    'german_domestic_tax',
    'austrian_domestic_tax',
    'slovak_domestic_tax',
    'bilateral_treaty',
    'mli'
  ));

create or replace function knowledge_factory_internal.resolve_bilateral_tax_claim_ref(
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
  v_role text;
begin
  if p_ref is null or jsonb_typeof(p_ref) <> 'object' then
    raise exception 'TAX_REFERENCE_INVALID';
  end if;
  if p_ref ? 'id' then
    raise exception 'TAX_HARDCODED_DB_UUID_REJECTED';
  end if;
  if p_ref->>'temporalClass' = 'PROPOSED_NOT_CURRENT' then
    raise exception 'TAX_UNVERIFIED_TEMPORAL_VERSION';
  end if;
  if p_ref->>'temporalClass' is distinct from 'CURRENT' then
    raise exception 'TAX_UNVERIFIED_TEMPORAL_VERSION';
  end if;
  if p_ref->>'entityClass' is distinct from 'claims'
     or nullif(p_ref->>'key', '') is null then
    raise exception 'TAX_ZERO_REF_REJECTED';
  end if;
  if p_ref->>'trustDomain' = 'eu' or p_ref->>'sourceJurisdiction' = 'EU' then
    raise exception 'TAX_EU_TRUST_REJECTED_FOR_BILATERAL_TREATY';
  end if;

  v_role := p_ref->>'claimRole';
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
    raise exception 'TAX_ZERO_REF_REJECTED';
  end if;
  if v_matches > 1 then
    raise exception 'TAX_AMBIGUOUS_REF_REJECTED';
  end if;

  select c.id, j.jurisdiction_level, j.country_code, t.code, c.status
    into v_id, v_level, v_country, v_trust, v_status
  from public.knowledge_claims c
  join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
  join public.knowledge_authorities a on a.id = c.authority_id
  join public.knowledge_publishers p on p.id = a.publisher_id
  join public.knowledge_trust_domains t on t.id = p.trust_domain_id
  where c.id = v_factory_id;

  if v_role in ('bilateral_treaty', 'mli') then
    if v_trust is distinct from 'bilateral_tax_treaty'
       or p_ref->>'trustDomain' is distinct from 'bilateral_tax_treaty' then
      raise exception 'TAX_WRONG_TRUST_CLASS';
    end if;
    if v_level is distinct from 'cross_border_multi_jurisdiction' then
      raise exception 'TAX_WRONG_JURISDICTION';
    end if;
    if v_level = 'eu' or v_country = 'EU' then
      raise exception 'TAX_EU_JURISDICTION_REJECTED_FOR_BILATERAL_TREATY';
    end if;
  elsif v_role = 'german_domestic_tax' then
    if v_level is distinct from 'de_federal' or v_country is distinct from 'DE' then
      raise exception 'TAX_WRONG_JURISDICTION';
    end if;
    if v_trust is distinct from 'de' or p_ref->>'trustDomain' is distinct from 'de' then
      raise exception 'TAX_WRONG_TRUST_CLASS';
    end if;
  elsif v_role = 'austrian_domestic_tax' then
    if v_level is distinct from 'at_national' or v_country is distinct from 'AT' then
      raise exception 'TAX_WRONG_JURISDICTION';
    end if;
    if v_trust is distinct from 'at' or p_ref->>'trustDomain' is distinct from 'at' then
      raise exception 'TAX_WRONG_TRUST_CLASS';
    end if;
  elsif v_role = 'slovak_domestic_tax' then
    if v_level is distinct from 'foreign_national' or v_country is distinct from 'SK' then
      raise exception 'TAX_WRONG_JURISDICTION';
    end if;
    if v_trust is distinct from 'sk' or p_ref->>'trustDomain' is distinct from 'sk' then
      raise exception 'TAX_WRONG_TRUST_CLASS';
    end if;
  else
    raise exception 'TAX_UNKNOWN_CLAIM_ROLE';
  end if;
  if v_status is distinct from 'active' then
    raise exception 'TAX_WRONG_LIFECYCLE';
  end if;
  return v_id;
end;
$$;

create or replace function public.knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack(
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_row jsonb;
  v_ref jsonb;
  v_process jsonb;
  v_created integer;
  v_total_created integer := 0;
  v_jurisdiction uuid;
  v_scope uuid;
  v_publisher uuid;
  v_authority uuid;
  v_treaty uuid;
  v_version uuid;
  v_process_id uuid;
  v_claim uuid;
  v_seen text[] := '{}';
  v_token text;
  v_process_key text;
  v_treaty_key constant text := 'AT-SK';
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'TAX_INVALID_ROOT';
  end if;
  if p_payload ? 'userLocale' or p_payload ? 'locale' or p_payload ? 'outputLocale'
     or p_payload ? 'uiLanguage' then
    raise exception 'TAX_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  if p_payload->>'schemaVersion' <> '1'
     or p_payload->>'packId' is distinct from 'at_sk_tax_residence_treaty'
     or p_payload->>'canonicalLanguage' <> 'de' then
    raise exception 'TAX_CONNECTOR_IDENTITY_INVALID';
  end if;
  if p_payload->>'treatyKey' is distinct from v_treaty_key
     or p_payload->>'countryA' is distinct from 'AT'
     or p_payload->>'countryB' is distinct from 'SK' then
    raise exception 'TAX_PAIR_NOT_AUTHORIZED';
  end if;
  if coalesce((p_payload->>'active')::boolean, true) then
    raise exception 'TAX_ACTIVE_FORBIDDEN';
  end if;
  if coalesce((p_payload->>'publicRuntimeAllowed')::boolean, true) then
    raise exception 'TAX_PUBLIC_RUNTIME_FORBIDDEN';
  end if;
  if p_payload->>'connectorStatus' is distinct from 'prepared' then
    raise exception 'TAX_CONNECTOR_NOT_PREPARED';
  end if;
  if coalesce((p_payload->>'localeActivationAllowed')::boolean, true) then
    raise exception 'TAX_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  if p_payload->>'deployment' is distinct from 'none' then
    raise exception 'TAX_DEPLOYMENT_FORBIDDEN';
  end if;

  select id into v_treaty
    from public.knowledge_bilateral_tax_treaties
   where treaty_key = v_treaty_key;
  if v_treaty is null then
    raise exception 'TAX_AT_SK_TREATY_PREREQUISITE_MISSING';
  end if;

  v_jurisdiction := (p_payload#>>'{jurisdiction,id}')::uuid;
  v_scope := (p_payload#>>'{territorialScope,id}')::uuid;
  v_publisher := (p_payload#>>'{publisher,id}')::uuid;
  v_authority := (p_payload#>>'{authority,id}')::uuid;

  insert into public.knowledge_trust_domains(id, code, name, review_status)
  values (
    (p_payload#>>'{trustDomain,id}')::uuid,
    'bilateral_tax_treaty',
    p_payload#>>'{trustDomain,name}',
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_jurisdictions(
    id, jurisdiction_level, jurisdiction_code, country_code, name, status
  ) values (
    v_jurisdiction,
    'cross_border_multi_jurisdiction',
    v_treaty_key,
    null,
    'AT-SK tax residence treaty connector',
    'active'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_territorial_scopes(
    id, scope_type, jurisdiction_ids, cross_border_countries, scope_verified, review_status
  ) values (
    v_scope,
    'bilateral_tax_connector',
    array[v_jurisdiction],
    array['AT','SK'],
    true,
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_publishers(
    id, publisher_name, publisher_type, official_status,
    territorial_competence_id, trust_domain_id, review_status
  ) values (
    v_publisher,
    p_payload#>>'{publisher,name}',
    p_payload#>>'{publisher,type}',
    true,
    v_scope,
    (p_payload#>>'{trustDomain,id}')::uuid,
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_authorities(
    id, publisher_id, authority_name, authority_type, jurisdiction_id,
    territorial_scope_id, status, review_status
  ) values (
    v_authority,
    v_publisher,
    p_payload#>>'{authority,name}',
    p_payload#>>'{authority,type}',
    v_jurisdiction,
    v_scope,
    'active',
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;

  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
    if (v_row->>'key') !~ '^atskconn-' then
      raise exception 'TAX_CONNECTOR_CLAIM_SCOPE_VIOLATION';
    end if;
    if (v_row->>'id')::uuid is distinct from
       knowledge_factory_internal.stable_knowledge_factory_id('claims', v_row->>'key') then
      raise exception 'TAX_HARDCODED_DB_UUID_REJECTED';
    end if;
    insert into public.knowledge_claims(
      id, claim_type, claim_text_canonical, claim_language, market, jurisdiction_id,
      territorial_scope_id, authority_id, risk_level, allowed_output_uses,
      requires_direct_support, requires_effective_date, requires_authority_resolution,
      review_status, freshness_status, status
    ) values (
      (v_row->>'id')::uuid, v_row->>'type', v_row->>'text', 'de', 'DE',
      v_jurisdiction, v_scope, v_authority, v_row->>'riskLevel',
      array['orientation'], true, false, true,
      'expert_reviewed', 'fresh', 'active'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_process in select value from jsonb_array_elements(p_payload->'processes') loop
    v_process_key := coalesce(nullif(v_process->>'processKey', ''), v_process->>'processGroupId');
    if v_process_key is null or v_process_key = '' or v_process_key !~ '^atskconn-' then
      raise exception 'TAX_CONNECTOR_PROCESS_KEY_INVALID';
    end if;
    select id into v_version
    from public.knowledge_bilateral_tax_treaty_versions
    where treaty_id = v_treaty
      and temporal_version = v_process->>'temporalVersion';
    if v_version is null then
      raise exception 'TAX_UNVERIFIED_TEMPORAL_VERSION';
    end if;
    v_process_id := knowledge_factory_internal.stable_knowledge_factory_id(
      'processes',
      v_treaty_key || ':connector:' || (v_process->>'temporalVersion') || ':' || v_process_key
    );
    insert into public.knowledge_bilateral_tax_processes(
      id, treaty_id, treaty_version_id, process_group_id, process_key, lifecycle_state,
      active, public_runtime_allowed, review_status
    ) values (
      v_process_id, v_treaty, v_version, v_process->>'processGroupId', v_process_key,
      'draft', false, false, 'unverified'
    ) on conflict (treaty_id, treaty_version_id, process_key) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;

    for v_ref in select value from jsonb_array_elements(coalesce(v_process->'claimRefs', '[]'::jsonb)) loop
      v_token := v_process_key || ':' || coalesce(v_process->>'temporalVersion', '')
        || ':' || coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '')
        || ':' || coalesce(v_ref->>'claimRole', 'bilateral_treaty');
      if v_token = any (v_seen) then
        raise exception 'TAX_AMBIGUOUS_REF_REJECTED';
      end if;
      v_seen := array_append(v_seen, v_token);
      v_claim := knowledge_factory_internal.resolve_bilateral_tax_claim_ref(v_ref);
      insert into public.knowledge_bilateral_tax_process_claim_links(
        process_id, claim_id, claim_role
      ) values (
        v_process_id, v_claim, coalesce(v_ref->>'claimRole', 'bilateral_treaty')
      ) on conflict (process_id, claim_id, claim_role) do nothing;
      get diagnostics v_created = row_count;
      v_total_created := v_total_created + v_created;
    end loop;
  end loop;

  return jsonb_build_object(
    'semanticCreated', v_total_created,
    'treatyKey', v_treaty_key,
    'treatyId', v_treaty,
    'packId', 'at_sk_tax_residence_treaty',
    'connectorStatus', 'prepared',
    'active', false,
    'publicRuntimeAllowed', false,
    'publicRuntimeAuthorized', false,
    'activeCorridors', 0,
    'topicFamily', 'TAX_TREATY'
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'TAX_VALIDATION_FAILED';
end;
$$;

revoke all on function public.knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack(jsonb)
  from public, anon, authenticated, service_role;

revoke all on function knowledge_factory_internal.resolve_bilateral_tax_claim_ref(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack(jsonb) is
  'AT-SK-0K server-only tax residence/treaty connector ingest. Revoke-by-default. Not deployed.';
