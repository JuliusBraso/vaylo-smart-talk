-- CB-TAX-0C: SK national income-tax residence writer and bilateral process_key.
-- Additive only. Does not modify 060. Does not loosen RLS or grants.
-- Does not activate public runtime, corridors, or a tax calculator.

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
    'sk_income_tax_residence'
  ));

alter table public.knowledge_bilateral_tax_processes
  add column if not exists process_key text;

update public.knowledge_bilateral_tax_processes
   set process_key = process_group_id
 where process_key is null or process_key = '';

alter table public.knowledge_bilateral_tax_processes
  alter column process_key set not null;

alter table public.knowledge_bilateral_tax_processes
  drop constraint if exists knowledge_bilateral_tax_processes_unique;

alter table public.knowledge_bilateral_tax_processes
  add constraint knowledge_bilateral_tax_processes_unique
    unique (treaty_id, treaty_version_id, process_key);

alter table public.knowledge_bilateral_tax_processes
  drop constraint if exists knowledge_bilateral_tax_processes_process_key_check;

alter table public.knowledge_bilateral_tax_processes
  add constraint knowledge_bilateral_tax_processes_process_key_check
    check (process_key ~ '^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,80}$');

create or replace function public.knowledge_ingest_curated_sk_income_tax_residence_pack(
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
  if v_pack_id is distinct from 'sk_income_tax_residence' then
    raise exception 'SK_TAX_PACK_IDENTITY_INVALID';
  end if;
  if p_payload->>'countryCode' is distinct from 'SK' then
    raise exception 'SK_TAX_COUNTRY_NOT_AUTHORIZED';
  end if;
  if exists (
    select 1 from jsonb_array_elements(coalesce(p_payload->'jurisdictions', '[]'::jsonb)) j
    where j->>'countryCode' in ('CZ','PL','HU','DE','EU')
       or j->>'code' in ('CZ','PL','HU','de_sk')
       or j->>'level' is distinct from 'foreign_national'
       or j->>'countryCode' is distinct from 'SK'
  ) then
    raise exception 'SK_TAX_JURISDICTION_INVALID';
  end if;
  if p_payload#>>'{trustDomain,code}' is distinct from 'sk' then
    raise exception 'SK_TAX_TRUST_DOMAIN_INVALID';
  end if;
  if p_payload ? 'userLocale' or p_payload ? 'locale' or p_payload ? 'outputLocale'
     or p_payload ? 'uiLanguage' then
    raise exception 'SK_TAX_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  return knowledge_factory_internal.ingest_curated_layer_pack(
    p_payload,
    v_pack_id,
    'sk',
    'foreign_national',
    'SK',
    'sk_income_tax_residence',
    'SPECIFIC_AUTHORITY',
    'sk'
  );
end;
$$;

revoke all on function public.knowledge_ingest_curated_sk_income_tax_residence_pack(jsonb)
  from public, anon, authenticated, service_role;

create or replace function public.knowledge_ingest_curated_bilateral_tax_treaty_pack(
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
    'schemaVersion','packId','treatyKey','countryA','countryB','canonicalLanguage',
    'topicFamily','lifecycleState','sourceRefs','claimUnits','processGroups',
    'effectiveFrom','effectiveTo','temporalVersion','active','publicRuntimeAllowed',
    'trustDomain','jurisdiction','territorialScope','publisher','authority',
    'claims','versions','processes'
  ];
  v_uuid_re constant text :=
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  v_row jsonb;
  v_ref jsonb;
  v_process jsonb;
  v_created integer;
  v_total_created integer := 0;
  v_trust uuid;
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
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'TAX_INVALID_ROOT';
  end if;
  if p_payload ? 'userLocale' or p_payload ? 'locale' or p_payload ? 'outputLocale'
     or p_payload ? 'uiLanguage' then
    raise exception 'TAX_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  if p_payload ? 'euCoordinationClaimIds' or p_payload ? 'eu_coordination_claim_ids' then
    raise exception 'TAX_SOCIAL_SECURITY_FIELD_FORBIDDEN';
  end if;
  if exists (
    select 1 from unnest(v_keys) k(key) where not (p_payload ? k.key)
  ) then
    raise exception 'TAX_PARTIAL_PAYLOAD';
  end if;
  if p_payload->>'schemaVersion' <> '1'
     or p_payload->>'packId' !~ '^[a-z0-9_]{3,80}$'
     or p_payload->>'canonicalLanguage' <> 'de' then
    raise exception 'TAX_IDENTITY_INVALID';
  end if;
  if p_payload->>'treatyKey' is distinct from 'DE-SK'
     or p_payload->>'countryA' is distinct from 'DE'
     or p_payload->>'countryB' is distinct from 'SK' then
    raise exception 'TAX_PAIR_NOT_AUTHORIZED';
  end if;
  if p_payload->>'topicFamily' is distinct from 'TAX_TREATY' then
    raise exception 'TAX_TOPIC_FAMILY_INVALID';
  end if;
  if coalesce((p_payload->>'active')::boolean, true) then
    raise exception 'TAX_ACTIVE_FORBIDDEN';
  end if;
  if coalesce((p_payload->>'publicRuntimeAllowed')::boolean, true) then
    raise exception 'TAX_PUBLIC_RUNTIME_FORBIDDEN';
  end if;
  if p_payload->>'lifecycleState' is distinct from 'draft'
     and p_payload->>'lifecycleState' is distinct from 'review' then
    raise exception 'TAX_PUBLICATION_FORBIDDEN_IN_FOUNDATION';
  end if;
  if p_payload#>>'{trustDomain,code}' is distinct from 'bilateral_tax_treaty' then
    raise exception 'TAX_EU_TRUST_REJECTED_FOR_BILATERAL_TREATY';
  end if;
  if p_payload#>>'{jurisdiction,level}' is distinct from 'cross_border_multi_jurisdiction'
     or p_payload#>>'{jurisdiction,level}' = 'eu'
     or p_payload#>>'{jurisdiction,countryCode}' = 'EU' then
    raise exception 'TAX_EU_JURISDICTION_REJECTED_FOR_BILATERAL_TREATY';
  end if;
  if p_payload#>>'{trustDomain,id}' !~ v_uuid_re
     or (p_payload#>>'{trustDomain,id}')::uuid is distinct from
        knowledge_factory_internal.stable_knowledge_factory_id(
          'trustDomain', p_payload#>>'{trustDomain,key}'
        ) then
    raise exception 'TAX_HARDCODED_DB_UUID_REJECTED';
  end if;
  if jsonb_typeof(p_payload->'claimUnits') is distinct from 'array'
     or jsonb_array_length(p_payload->'claimUnits') < 1 then
    raise exception 'TAX_ZERO_REF_REJECTED';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'claimUnits') as cu where cu ? 'id'
  ) then
    raise exception 'TAX_HARDCODED_DB_UUID_REJECTED';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_payload->'claimUnits') as cu
    group by cu->>'entityClass', cu->>'key'
    having count(*) > 1
  ) then
    raise exception 'TAX_AMBIGUOUS_REF_REJECTED';
  end if;
  if jsonb_typeof(p_payload->'versions') is distinct from 'array'
     or jsonb_array_length(p_payload->'versions') < 1 then
    raise exception 'TAX_TREATY_VERSION_REQUIRED';
  end if;

  insert into public.knowledge_trust_domains(id, code, name, review_status)
  values (
    (p_payload#>>'{trustDomain,id}')::uuid,
    'bilateral_tax_treaty',
    p_payload#>>'{trustDomain,name}',
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_trust_domains t
    where t.id = (p_payload#>>'{trustDomain,id}')::uuid
      and t.code = 'bilateral_tax_treaty'
  ) then
    raise exception 'TAX_WRONG_TRUST_CLASS';
  end if;
  v_trust := (p_payload#>>'{trustDomain,id}')::uuid;

  insert into public.knowledge_jurisdictions(
    id, jurisdiction_level, jurisdiction_code, country_code, name, status
  ) values (
    (p_payload#>>'{jurisdiction,id}')::uuid,
    'cross_border_multi_jurisdiction',
    'DE-SK',
    null,
    'DE-SK bilateral tax treaty',
    'active'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_jurisdictions j
    where j.id = (p_payload#>>'{jurisdiction,id}')::uuid
      and j.jurisdiction_level = 'cross_border_multi_jurisdiction'
      and j.country_code is distinct from 'EU'
  ) then
    raise exception 'TAX_WRONG_JURISDICTION';
  end if;
  v_jurisdiction := (p_payload#>>'{jurisdiction,id}')::uuid;

  insert into public.knowledge_territorial_scopes(
    id, scope_type, jurisdiction_ids, cross_border_countries, scope_verified, review_status
  ) values (
    (p_payload#>>'{territorialScope,id}')::uuid,
    'bilateral_tax_treaty',
    array[(p_payload#>>'{jurisdiction,id}')::uuid],
    array['DE','SK'],
    true,
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  v_scope := (p_payload#>>'{territorialScope,id}')::uuid;

  insert into public.knowledge_publishers(
    id, publisher_name, publisher_type, official_status,
    territorial_competence_id, trust_domain_id, review_status
  ) values (
    (p_payload#>>'{publisher,id}')::uuid,
    p_payload#>>'{publisher,name}',
    p_payload#>>'{publisher,type}',
    true,
    v_scope,
    v_trust,
    'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  v_publisher := (p_payload#>>'{publisher,id}')::uuid;

  insert into public.knowledge_authorities(
    id, publisher_id, authority_name, authority_type, jurisdiction_id,
    territorial_scope_id, status, review_status
  ) values (
    (p_payload#>>'{authority,id}')::uuid,
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
  v_authority := (p_payload#>>'{authority,id}')::uuid;

  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
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

  v_treaty := knowledge_factory_internal.stable_knowledge_factory_id('treaties', 'DE-SK');
  insert into public.knowledge_bilateral_tax_treaties(
    id, treaty_key, country_a, country_b, canonical_language, topic_family,
    lifecycle_state, active, public_runtime_allowed, trust_domain_id,
    jurisdiction_id, review_status
  ) values (
    v_treaty, 'DE-SK', 'DE', 'SK', 'de', 'TAX_TREATY',
    p_payload->>'lifecycleState', false, false, v_trust, v_jurisdiction, 'unverified'
  ) on conflict (treaty_key) do nothing;
  get diagnostics v_created = row_count;
  v_total_created := v_total_created + v_created;
  select id into v_treaty from public.knowledge_bilateral_tax_treaties where treaty_key = 'DE-SK';

  for v_row in select value from jsonb_array_elements(p_payload->'versions') loop
    v_version := knowledge_factory_internal.stable_knowledge_factory_id(
      'treaty_versions', 'DE-SK:' || (v_row->>'temporalVersion')
    );
    insert into public.knowledge_bilateral_tax_treaty_versions(
      id, treaty_id, temporal_version, effective_from, effective_to, base_treaty_date,
      mli_modified, mli_effective_from, mli_adoption_date, de_mli_signature_date,
      sk_mli_signature_date, de_mli_entry_into_force, sk_mli_entry_into_force,
      german_article35_completion_date, tax_type, source_kind, source_version,
      active, public_runtime_allowed, review_status
    ) values (
      v_version, v_treaty, v_row->>'temporalVersion',
      (v_row->>'effectiveFrom')::date,
      nullif(v_row->>'effectiveTo', '')::date,
      (v_row->>'baseTreatyDate')::date,
      coalesce((v_row->>'mliModified')::boolean, false),
      nullif(v_row->>'mliEffectiveFrom', '')::date,
      nullif(v_row->>'mliAdoptionDate', '')::date,
      nullif(v_row->>'deMliSignatureDate', '')::date,
      nullif(v_row->>'skMliSignatureDate', '')::date,
      nullif(v_row->>'deMliEntryIntoForce', '')::date,
      nullif(v_row->>'skMliEntryIntoForce', '')::date,
      nullif(v_row->>'germanArticle35CompletionDate', '')::date,
      v_row->>'taxType', v_row->>'sourceKind', v_row->>'sourceVersion',
      false, false, 'unverified'
    ) on conflict (treaty_id, temporal_version) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;
  end loop;

  for v_process in select value from jsonb_array_elements(p_payload->'processes') loop
    select id into v_version
    from public.knowledge_bilateral_tax_treaty_versions
    where treaty_id = v_treaty
      and temporal_version = v_process->>'temporalVersion';
    if v_version is null then
      raise exception 'TAX_UNVERIFIED_TEMPORAL_VERSION';
    end if;
    v_process_key := coalesce(nullif(v_process->>'processKey', ''), v_process->>'processGroupId');
    if v_process_key is null or v_process_key = '' then
      raise exception 'TAX_PROCESS_KEY_REQUIRED';
    end if;
    v_process_id := knowledge_factory_internal.stable_knowledge_factory_id(
      'processes',
      'DE-SK:' || (v_process->>'temporalVersion') || ':' || v_process_key
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
    'treatyKey', 'DE-SK',
    'treatyId', v_treaty,
    'active', false,
    'publicRuntimeAllowed', false,
    'publicRuntimeAuthorized', false,
    'topicFamily', 'TAX_TREATY'
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'TAX_VALIDATION_FAILED';
end;
$$;

revoke all on function public.knowledge_ingest_curated_bilateral_tax_treaty_pack(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_sk_income_tax_residence_pack(jsonb) is
  'CB-TAX-0C Slovak national income-tax residence writer. Trust sk. No production role grant.';
comment on function public.knowledge_ingest_curated_bilateral_tax_treaty_pack(jsonb) is
  'CB-TAX-0C bilateral tax writer with process_key. TAX_TREATY + DE-SK only. No public runtime.';
