-- Narrow curated locality/authority-competence ingestion boundary for the
-- Anmeldung first pack. Adjacent to migration 037; does not replace it.
-- No new tables. Pilot municipality names are data, not contract constants.

create or replace function public.knowledge_ingest_curated_locality_pack(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_created integer := 0;
  v_total_created integer := 0;
  v_counts jsonb := '{}'::jsonb;
  v_row jsonb;
  v_has_district boolean;
  v_country_id uuid;
  v_land_id uuid;
  v_district_id uuid;
  v_locality_id uuid;
  v_scope_id uuid;
  v_publisher_id uuid;
  v_authority_id uuid;
  v_source_id uuid;
  v_version_id uuid;
  v_passage_id uuid;
  v_competence_id uuid;
  v_process_id uuid;
  v_municipality_code text;
  v_land_code text;
  v_district_code text;
  v_canonical_url text;
  v_official_domain text;
  v_normalized_origin text;
  v_host text;
  v_handling_mode public.knowledge_handling_mode;
  v_freshness_class public.knowledge_freshness_class;
  v_stale_behavior public.knowledge_stale_behavior;
  v_source_class public.knowledge_source_class;
  v_authority_level public.knowledge_authority_level;
  v_info_class public.knowledge_information_class;
  v_subject text;
  v_allowed_keys constant text[] := array[
    'packId','family','countryCode','trustDomain','countryJurisdiction',
    'landJurisdiction','districtJurisdiction','locality','territorialScope',
    'publisher','authority','source','sourceVersion','passage','competence',
    'processBinding','handlingPolicies'
  ];
  v_allowed_subjects constant text[] := array[
    'residence_registration_lifecycle','anmeldung','ummeldung','abmeldung','meldewesen'
  ];
  v_allowed_authority_types constant text[] := array[
    'meldebehoerde','buergeramt','gemeindeverwaltung','verwaltungsgemeinschaft',
    'other_local_registration_authority'
  ];
  v_allowed_source_classes constant public.knowledge_source_class[] := array[
    'AUTHORITY_PORTAL','MUNICIPALITY_SERVICE_PORTAL','LAND_SERVICE_PORTAL',
    'OFFICIAL_FORM','OFFICIAL_ONLINE_SERVICE','OFFICIAL_DATASET'
  ]::public.knowledge_source_class[];
  v_uuid_re constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  v_code_re constant text := '^[A-Z0-9-]{2,32}$';
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'CURATED_LOCALITY_INVALID_ROOT';
  end if;
  if exists (
    select 1 from jsonb_object_keys(p_payload) as k(key)
    where not (k.key = any(v_allowed_keys))
  ) or exists (
    select 1 from unnest(v_allowed_keys) as k(key)
    where not (p_payload ? k.key)
  ) then
    raise exception 'CURATED_LOCALITY_INVALID_STRUCTURE';
  end if;
  if p_payload->>'packId' <> 'anmeldung_ummeldung_abmeldung'
     or p_payload->>'family' <> 'residence_registration_lifecycle'
     or p_payload->>'countryCode' <> 'DE'
     or p_payload#>>'{trustDomain,code}' <> 'de'
     or p_payload#>>'{countryJurisdiction,code}' <> 'DE'
     or p_payload#>>'{countryJurisdiction,countryCode}' <> 'DE'
     or p_payload#>>'{countryJurisdiction,level}' <> 'de_federal'
     or p_payload#>>'{landJurisdiction,countryCode}' <> 'DE'
     or p_payload#>>'{landJurisdiction,level}' <> 'de_land'
     or p_payload#>>'{locality,countryCode}' <> 'DE'
     or p_payload#>>'{locality,level}' <> 'de_gemeinde' then
    raise exception 'CURATED_LOCALITY_IDENTITY_INVALID';
  end if;

  v_has_district := jsonb_typeof(p_payload->'districtJurisdiction') = 'object';
  if jsonb_typeof(p_payload->'districtJurisdiction') not in ('object','null') then
    raise exception 'CURATED_LOCALITY_IDENTITY_INVALID';
  end if;
  if v_has_district and (
    p_payload#>>'{districtJurisdiction,countryCode}' <> 'DE'
    or p_payload#>>'{districtJurisdiction,level}' <> 'de_kreis'
  ) then
    raise exception 'CURATED_LOCALITY_IDENTITY_INVALID';
  end if;

  v_municipality_code := nullif(p_payload#>>'{locality,municipalityCode}','');
  v_land_code := nullif(p_payload#>>'{landJurisdiction,code}','');
  v_district_code := case
    when v_has_district then nullif(p_payload#>>'{districtJurisdiction,code}','')
    else nullif(p_payload#>>'{locality,districtCode}','')
  end;
  if v_land_code is null or v_land_code !~ v_code_re
     or nullif(p_payload#>>'{locality,name}','') is null then
    raise exception 'CURATED_LOCALITY_AMBIGUOUS_IDENTITY';
  end if;
  if v_municipality_code is null then
    if v_district_code is null or v_district_code !~ v_code_re then
      raise exception 'CURATED_LOCALITY_AMBIGUOUS_IDENTITY';
    end if;
  elsif v_municipality_code !~ v_code_re then
    raise exception 'CURATED_LOCALITY_AMBIGUOUS_IDENTITY';
  end if;

  if p_payload#>>'{countryJurisdiction,id}' !~ v_uuid_re
     or p_payload#>>'{landJurisdiction,id}' !~ v_uuid_re
     or p_payload#>>'{locality,id}' !~ v_uuid_re
     or p_payload#>>'{territorialScope,id}' !~ v_uuid_re
     or p_payload#>>'{publisher,id}' !~ v_uuid_re
     or p_payload#>>'{authority,id}' !~ v_uuid_re
     or p_payload#>>'{source,id}' !~ v_uuid_re
     or p_payload#>>'{sourceVersion,id}' !~ v_uuid_re
     or p_payload#>>'{passage,id}' !~ v_uuid_re
     or p_payload#>>'{competence,id}' !~ v_uuid_re
     or p_payload#>>'{processBinding,id}' !~ v_uuid_re
     or p_payload#>>'{trustDomain,id}' !~ v_uuid_re
     or (v_has_district and p_payload#>>'{districtJurisdiction,id}' !~ v_uuid_re) then
    raise exception 'CURATED_LOCALITY_IDENTITY_INVALID';
  end if;

  v_country_id := (p_payload#>>'{countryJurisdiction,id}')::uuid;
  v_land_id := (p_payload#>>'{landJurisdiction,id}')::uuid;
  v_district_id := case
    when v_has_district then (p_payload#>>'{districtJurisdiction,id}')::uuid
    else null
  end;
  v_locality_id := (p_payload#>>'{locality,id}')::uuid;
  v_scope_id := (p_payload#>>'{territorialScope,id}')::uuid;
  v_publisher_id := (p_payload#>>'{publisher,id}')::uuid;
  v_authority_id := (p_payload#>>'{authority,id}')::uuid;
  v_source_id := (p_payload#>>'{source,id}')::uuid;
  v_version_id := (p_payload#>>'{sourceVersion,id}')::uuid;
  v_passage_id := (p_payload#>>'{passage,id}')::uuid;
  v_competence_id := (p_payload#>>'{competence,id}')::uuid;
  v_process_id := (p_payload#>>'{processBinding,id}')::uuid;

  if v_country_id in (v_land_id, v_locality_id, v_scope_id, v_publisher_id, v_authority_id, v_source_id, v_version_id, v_passage_id, v_competence_id, v_process_id)
     or v_land_id in (v_locality_id, v_scope_id, v_authority_id)
     or (v_district_id is not null and v_district_id in (v_country_id, v_land_id, v_locality_id, v_scope_id, v_authority_id))
     or p_payload#>>'{landJurisdiction,parentJurisdictionId}' <> p_payload#>>'{countryJurisdiction,id}'
     or p_payload#>>'{locality,parentJurisdictionId}' <> coalesce(p_payload#>>'{districtJurisdiction,id}', p_payload#>>'{landJurisdiction,id}')
     or (v_has_district and p_payload#>>'{districtJurisdiction,parentJurisdictionId}' <> p_payload#>>'{landJurisdiction,id}') then
    raise exception 'CURATED_LOCALITY_IDENTITY_INVALID';
  end if;

  if p_payload#>>'{authority,type}' is null
     or not (p_payload#>>'{authority,type}' = any(v_allowed_authority_types))
     or nullif(p_payload#>>'{authority,name}','') is null
     or p_payload#>>'{authority,jurisdictionId}' <> p_payload#>>'{locality,id}'
     or p_payload#>>'{authority,territorialScopeId}' <> p_payload#>>'{territorialScope,id}'
     or p_payload#>>'{authority,publisherId}' <> p_payload#>>'{publisher,id}' then
    raise exception 'CURATED_LOCALITY_AUTHORITY_INVALID';
  end if;

  v_subject := p_payload#>>'{competence,subjectMatter}';
  if v_subject is null or not (v_subject = any(v_allowed_subjects)) then
    raise exception 'CURATED_LOCALITY_UNKNOWN_COMPETENCE';
  end if;
  if p_payload#>>'{competence,authorityId}' <> p_payload#>>'{authority,id}'
     or p_payload#>>'{competence,territorialScopeId}' <> p_payload#>>'{territorialScope,id}'
     or p_payload#>>'{competence,sourceVersionId}' <> p_payload#>>'{sourceVersion,id}'
     or p_payload#>>'{competence,passageId}' <> p_payload#>>'{passage,id}'
     or p_payload#>>'{competence,family}' <> 'residence_registration_lifecycle'
     or nullif(p_payload#>>'{competence,effectiveFrom}','') is null then
    raise exception 'CURATED_LOCALITY_COMPETENCE_INVALID';
  end if;
  if p_payload#>>'{competence,effectiveUntil}' is not null
     and (p_payload#>>'{competence,effectiveUntil}')::timestamptz
       < (p_payload#>>'{competence,effectiveFrom}')::timestamptz then
    raise exception 'CURATED_LOCALITY_COMPETENCE_INVALID';
  end if;

  v_canonical_url := p_payload#>>'{source,canonicalUrl}';
  v_official_domain := lower(p_payload#>>'{source,officialDomain}');
  v_normalized_origin := lower(p_payload#>>'{source,normalizedOrigin}');
  if v_canonical_url is null or v_official_domain is null or v_normalized_origin is null
     or v_canonical_url !~ '^https://[^[:space:]/@#]+(/[^[:space:]#]*)?$'
     or v_official_domain !~ '^[a-z0-9.-]+\.[a-z]{2,24}$'
     or v_normalized_origin <> ('https://' || v_official_domain)
     or p_payload#>>'{source,publisherId}' <> p_payload#>>'{publisher,id}'
     or p_payload#>>'{source,authorityId}' <> p_payload#>>'{authority,id}'
     or p_payload#>>'{source,jurisdictionId}' <> p_payload#>>'{locality,id}'
     or p_payload#>>'{source,territorialScopeId}' <> p_payload#>>'{territorialScope,id}'
     or p_payload#>>'{sourceVersion,sourceId}' <> p_payload#>>'{source,id}'
     or nullif(p_payload#>>'{sourceVersion,contentHash}','') is null
     or nullif(p_payload#>>'{passage,text}','') is null
     or nullif(p_payload#>>'{passage,textHash}','') is null then
    raise exception 'CURATED_LOCALITY_SOURCE_REQUIRED';
  end if;
  v_host := lower(substring(v_canonical_url from '^https://([^/:]+)'));
  if v_host is distinct from v_official_domain then
    raise exception 'CURATED_LOCALITY_SOURCE_REQUIRED';
  end if;

  begin
    v_source_class := (p_payload#>>'{source,sourceClass}')::public.knowledge_source_class;
    v_authority_level := (p_payload#>>'{source,authorityLevel}')::public.knowledge_authority_level;
    v_handling_mode := (p_payload#>>'{source,handlingMode}')::public.knowledge_handling_mode;
    v_freshness_class := (p_payload#>>'{source,freshnessClass}')::public.knowledge_freshness_class;
    v_stale_behavior := (p_payload#>>'{source,staleBehavior}')::public.knowledge_stale_behavior;
  exception
    when invalid_text_representation then
      raise exception 'CURATED_LOCALITY_HANDLING_INVALID';
  end;
  if v_source_class is null or not (v_source_class = any(v_allowed_source_classes))
     or v_authority_level not in ('MUNICIPALITY','SPECIFIC_AUTHORITY','LAND')
     or v_handling_mode is null or v_freshness_class is null or v_stale_behavior is null then
    raise exception 'CURATED_LOCALITY_HANDLING_INVALID';
  end if;
  if jsonb_typeof(p_payload->'handlingPolicies') <> 'array'
     or jsonb_array_length(p_payload->'handlingPolicies') not between 1 and 20 then
    raise exception 'CURATED_LOCALITY_HANDLING_INVALID';
  end if;
  if p_payload#>>'{processBinding,jurisdictionId}' <> p_payload#>>'{locality,id}'
     or p_payload#>>'{processBinding,territorialScopeId}' <> p_payload#>>'{territorialScope,id}'
     or nullif(p_payload#>>'{processBinding,title}','') is null then
    raise exception 'CURATED_LOCALITY_PROCESS_INVALID';
  end if;
  if p_payload#>>'{territorialScope,type}' <> 'municipality'
     or p_payload#>>'{publisher,territorialScopeId}' <> p_payload#>>'{territorialScope,id}'
     or p_payload#>>'{publisher,trustDomainId}' <> p_payload#>>'{trustDomain,id}' then
    raise exception 'CURATED_LOCALITY_IDENTITY_INVALID';
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
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:trust_domain'; end if;

  insert into public.knowledge_jurisdictions
    (id, jurisdiction_level, jurisdiction_code, country_code, name, status)
  values (
    v_country_id, 'de_federal', 'DE', 'DE',
    p_payload#>>'{countryJurisdiction,name}', 'active'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('countryJurisdictions', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_jurisdictions j
    where j.id=v_country_id and j.jurisdiction_level='de_federal'
      and j.jurisdiction_code='DE' and j.country_code='DE'
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:country'; end if;

  insert into public.knowledge_jurisdictions
    (id, jurisdiction_level, jurisdiction_code, country_code, parent_jurisdiction_id, name, status)
  values (
    v_land_id, 'de_land', v_land_code, 'DE', v_country_id,
    p_payload#>>'{landJurisdiction,name}', 'active'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('landJurisdictions', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_jurisdictions j
    where j.id=v_land_id and j.jurisdiction_level='de_land'
      and j.jurisdiction_code=v_land_code and j.country_code='DE'
      and j.parent_jurisdiction_id=v_country_id
      and j.name=p_payload#>>'{landJurisdiction,name}'
  ) or exists (
    select 1 from public.knowledge_jurisdictions j
    where j.jurisdiction_code=v_land_code and j.id<>v_land_id
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:land'; end if;

  v_created := 0;
  if v_has_district then
    insert into public.knowledge_jurisdictions
      (id, jurisdiction_level, jurisdiction_code, country_code, parent_jurisdiction_id, name, status)
    values (
      v_district_id, 'de_kreis', v_district_code, 'DE', v_land_id,
      p_payload#>>'{districtJurisdiction,name}', 'active'
    ) on conflict (id) do nothing;
    get diagnostics v_created = row_count;
    if not exists (
      select 1 from public.knowledge_jurisdictions j
      where j.id=v_district_id and j.jurisdiction_level='de_kreis'
        and j.jurisdiction_code=v_district_code and j.country_code='DE'
        and j.parent_jurisdiction_id=v_land_id
        and j.name=p_payload#>>'{districtJurisdiction,name}'
    ) or exists (
      select 1 from public.knowledge_jurisdictions j
      where j.jurisdiction_code=v_district_code and j.id<>v_district_id
    ) then raise exception 'CURATED_LOCALITY_CONFLICT:district'; end if;
  end if;
  v_counts := v_counts || jsonb_build_object('districtJurisdictions', v_created);
  v_total_created := v_total_created + v_created;

  insert into public.knowledge_jurisdictions
    (id, jurisdiction_level, jurisdiction_code, country_code, parent_jurisdiction_id, name, status)
  values (
    v_locality_id, 'de_gemeinde', coalesce(v_municipality_code, v_land_code || ':' || v_district_code),
    'DE', coalesce(v_district_id, v_land_id),
    p_payload#>>'{locality,name}', 'active'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('localities', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_jurisdictions j
    where j.id=v_locality_id and j.jurisdiction_level='de_gemeinde'
      and j.country_code='DE'
      and j.parent_jurisdiction_id=coalesce(v_district_id, v_land_id)
      and j.name=p_payload#>>'{locality,name}'
      and j.jurisdiction_code=coalesce(v_municipality_code, v_land_code || ':' || v_district_code)
  ) or exists (
    select 1 from public.knowledge_jurisdictions j
    where j.jurisdiction_code=coalesce(v_municipality_code, v_land_code || ':' || v_district_code)
      and j.id<>v_locality_id
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:locality'; end if;

  insert into public.knowledge_territorial_scopes
    (id, scope_type, jurisdiction_ids, land_codes, kreis_codes, municipality_codes,
     scope_verified, review_status)
  values (
    v_scope_id, 'municipality',
    array_remove(array[v_country_id, v_land_id, v_district_id, v_locality_id], null),
    array[v_land_code],
    case when v_district_code is null then '{}'::text[] else array[v_district_code] end,
    array[coalesce(v_municipality_code, v_land_code || ':' || v_district_code)],
    true, 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('territorialScopes', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_territorial_scopes s
    where s.id=v_scope_id and s.scope_type='municipality'
      and s.municipality_codes=array[coalesce(v_municipality_code, v_land_code || ':' || v_district_code)]
      and s.land_codes=array[v_land_code]
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:territorial_scope'; end if;

  insert into public.knowledge_publishers
    (id, publisher_name, publisher_type, official_status, subject_matter_competence,
     territorial_competence_id, trust_domain_id, review_status)
  values (
    v_publisher_id, p_payload#>>'{publisher,name}', 'municipal_authority', true,
    array['Melderecht'], v_scope_id,
    (p_payload#>>'{trustDomain,id}')::uuid, 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('publishers', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_publishers p
    where p.id=v_publisher_id and p.publisher_name=p_payload#>>'{publisher,name}'
      and p.territorial_competence_id=v_scope_id
      and p.trust_domain_id=(p_payload#>>'{trustDomain,id}')::uuid
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:publisher'; end if;

  insert into public.knowledge_authorities
    (id, publisher_id, authority_name, authority_type, jurisdiction_id,
     territorial_scope_id, official_portal_url, status, review_status)
  values (
    v_authority_id, v_publisher_id, p_payload#>>'{authority,name}',
    p_payload#>>'{authority,type}', v_locality_id, v_scope_id,
    v_canonical_url, 'active', 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('authorities', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_authorities a
    where a.id=v_authority_id and a.publisher_id=v_publisher_id
      and a.authority_name=p_payload#>>'{authority,name}'
      and a.authority_type=p_payload#>>'{authority,type}'
      and a.jurisdiction_id=v_locality_id
      and a.territorial_scope_id=v_scope_id
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:authority'; end if;

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
    v_source_id, v_publisher_id, 'authority_portal', 'local_registration_competence',
    v_canonical_url, v_official_domain, 'verified', v_locality_id, v_scope_id, 'de',
    coalesce(v_municipality_code, v_land_code || ':' || v_district_code),
    array['authority_competence'], false, v_canonical_url, v_normalized_origin,
    v_source_class, 'PUBLICATION_EVIDENCE_ELIGIBLE', v_authority_id, v_authority_level,
    array['anmeldung_ummeldung_abmeldung'], 'HTML_DOCUMENT', 'ALLOWED', 'ALLOWED',
    now(), now(), 'ACTIVE', 'VERIFIED', 'AUTHORIZED', v_handling_mode,
    v_freshness_class, v_stale_behavior
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('sources', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_sources s
    where s.id=v_source_id and s.publisher_id=v_publisher_id
      and s.canonical_url=v_canonical_url and s.jurisdiction_id=v_locality_id
      and s.issuing_authority_id=v_authority_id
      and s.authorization_state='AUTHORIZED'
      and s.default_handling_mode=v_handling_mode
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:source'; end if;

  insert into public.knowledge_source_versions (
    id, source_id, version_sequence, content_hash, review_status,
    freshness_status, change_status, immutable, historical_use_allowed,
    current_use_allowed
  ) values (
    v_version_id, v_source_id, 1, p_payload#>>'{sourceVersion,contentHash}',
    'expert_reviewed', 'fresh', 'unchanged', true, true, true
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('sourceVersions', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_source_versions v
    where v.id=v_version_id and v.source_id=v_source_id and v.version_sequence=1
      and v.content_hash=p_payload#>>'{sourceVersion,contentHash}'
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:source_version'; end if;

  insert into public.knowledge_source_passages (
    id, source_version_id, passage_order, heading_path, section_identifier,
    text, text_hash, language, citation_ready, review_status
  ) values (
    v_passage_id, v_version_id, 0, array['local-competence'],
    p_payload#>>'{passage,locator}', p_payload#>>'{passage,text}',
    p_payload#>>'{passage,textHash}', 'de', true, 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('sourcePassages', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_source_passages p
    where p.id=v_passage_id and p.source_version_id=v_version_id
      and p.text=p_payload#>>'{passage,text}'
      and p.text_hash=p_payload#>>'{passage,textHash}'
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:passage'; end if;

  insert into public.knowledge_authority_competences (
    id, authority_id, subject_matter, territorial_scope_id, personal_scope,
    receives_application, decides_application, provides_information_only,
    competence_source_version_id, competence_passage_id, effective_from,
    effective_until, review_status, conflict_status
  ) values (
    v_competence_id, v_authority_id, v_subject, v_scope_id,
    'residence_registration_lifecycle',
    coalesce((p_payload#>>'{competence,receivesApplication}')::boolean, true),
    coalesce((p_payload#>>'{competence,decidesApplication}')::boolean, true),
    false, v_version_id, v_passage_id,
    (p_payload#>>'{competence,effectiveFrom}')::timestamptz,
    nullif(p_payload#>>'{competence,effectiveUntil}','')::timestamptz,
    'expert_reviewed', 'none'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('competences', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_authority_competences c
    where c.id=v_competence_id and c.authority_id=v_authority_id
      and c.subject_matter=v_subject and c.territorial_scope_id=v_scope_id
      and c.personal_scope='residence_registration_lifecycle'
      and c.competence_source_version_id=v_version_id
      and c.competence_passage_id=v_passage_id
      and c.effective_from=(p_payload#>>'{competence,effectiveFrom}')::timestamptz
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:competence'; end if;

  insert into public.knowledge_processes (
    id, process_group_id, title, jurisdiction_id, territorial_scope_id,
    risk_level, orientation_only, trigger_description, safe_first_step,
    regional_variation_expected, full_legal_advice_excluded, review_status
  ) values (
    v_process_id, 'anmeldung_ummeldung_abmeldung',
    p_payload#>>'{processBinding,title}', v_locality_id, v_scope_id,
    'medium', true, 'local_operational_delivery',
    'Follow the federal Anmeldung process at the competent local Meldebehörde.',
    true, true, 'expert_reviewed'
  ) on conflict (id) do nothing;
  get diagnostics v_created = row_count;
  v_counts := v_counts || jsonb_build_object('processBindings', v_created);
  v_total_created := v_total_created + v_created;
  if not exists (
    select 1 from public.knowledge_processes p
    where p.id=v_process_id and p.process_group_id='anmeldung_ummeldung_abmeldung'
      and p.title=p_payload#>>'{processBinding,title}'
      and p.jurisdiction_id=v_locality_id and p.territorial_scope_id=v_scope_id
  ) then raise exception 'CURATED_LOCALITY_CONFLICT:process'; end if;

  v_created := 0;
  for v_row in select value from jsonb_array_elements(p_payload->'handlingPolicies') loop
    begin
      v_info_class := (v_row->>'informationClass')::public.knowledge_information_class;
      v_handling_mode := (v_row->>'handlingMode')::public.knowledge_handling_mode;
      v_freshness_class := (v_row->>'freshnessClass')::public.knowledge_freshness_class;
      v_stale_behavior := (v_row->>'staleBehavior')::public.knowledge_stale_behavior;
    exception
      when invalid_text_representation then
        raise exception 'CURATED_LOCALITY_HANDLING_INVALID';
    end;
    if v_row->>'id' !~ v_uuid_re
       or v_info_class is null or v_handling_mode is null
       or v_freshness_class is null or v_stale_behavior is null
       or v_row->>'riskClass' not in ('LOW','MEDIUM','HIGH','CRITICAL') then
      raise exception 'CURATED_LOCALITY_HANDLING_INVALID';
    end if;
    insert into public.knowledge_source_handling_policies (
      id, source_id, information_class, process_scope, handling_mode,
      freshness_class, stale_behavior, required_context_keys, risk_class, state_version
    ) values (
      (v_row->>'id')::uuid, v_source_id, v_info_class,
      'anmeldung_ummeldung_abmeldung', v_handling_mode, v_freshness_class,
      v_stale_behavior, '{}', v_row->>'riskClass', 1
    ) on conflict (source_id, information_class, process_scope) do nothing;
    if found then v_created := v_created + 1; end if;
    if not exists (
      select 1 from public.knowledge_source_handling_policies h
      where h.id=(v_row->>'id')::uuid and h.source_id=v_source_id
        and h.information_class=v_info_class
        and h.handling_mode=v_handling_mode
        and h.freshness_class=v_freshness_class
        and h.stale_behavior=v_stale_behavior
    ) then raise exception 'CURATED_LOCALITY_CONFLICT:handling_policy:%', v_row->>'id'; end if;
  end loop;
  v_counts := v_counts || jsonb_build_object('handlingPolicies', v_created);
  v_total_created := v_total_created + v_created;

  return jsonb_build_object(
    'packId', p_payload->>'packId',
    'family', p_payload->>'family',
    'countryCode', 'DE',
    'localityId', v_locality_id,
    'authorityId', v_authority_id,
    'competenceId', v_competence_id,
    'semanticCreated', v_total_created,
    'created', v_counts
  );
end;
$$;

revoke all on function public.knowledge_ingest_curated_locality_pack(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_locality_pack(jsonb) is
  'Maintenance-only fixed curated locality/authority-competence ingestion boundary for anmeldung_ummeldung_abmeldung. Caller receives EXECUTE only through operator bootstrap.';
