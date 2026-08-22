-- Generalized bounded Knowledge Factory ingestion contracts.
-- Additive to RPCs 037-040: those compatibility paths remain unchanged.
-- This migration adds no grants to runtime roles and inserts no knowledge data.

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
    'housing_orientation'
  ));

create or replace function public.knowledge_ingest_curated_domain_pack(p_payload jsonb)
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
  v_domain text;
  v_uuid_re constant text :=
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  v_domains constant text[] := array[
    'anmeldung_ummeldung_abmeldung',
    'steuer_id_and_basic_finanzamt_letters',
    'health_insurance_orientation',
    'jobcenter_buergergeld',
    'familienkasse_kindergeld',
    'rechnung_mahnung',
    'kuendigung_orientation',
    'auslaenderbehoerde_limited_orientation',
    'vehicle_registration_and_driving_licence',
    'housing_orientation'
  ];
  v_keys constant text[] := array[
    'schemaVersion','packId','domain','canonicalLanguage','trustDomain',
    'jurisdictions','territorialScopes','publishers','authorities','sources',
    'sourceVersions','passages','claims','evidenceLinks','citations',
    'actorRules','processes','processClaimLinks','forms','fees',
    'handlingPolicies','freshnessRecords'
  ];
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'CURATED_DOMAIN_INVALID_ROOT';
  end if;
  if exists (
    select 1 from jsonb_object_keys(p_payload) k(key)
    where not (k.key = any(v_keys))
  ) or exists (
    select 1 from unnest(v_keys) k(key) where not (p_payload ? k.key)
  ) then
    raise exception 'CURATED_DOMAIN_INVALID_STRUCTURE';
  end if;

  v_domain := p_payload->>'domain';
  if p_payload->>'schemaVersion' <> '1'
     or p_payload->>'canonicalLanguage' <> 'de'
     or p_payload->>'packId' !~ '^[a-z0-9_]{3,80}$'
     or v_domain is null or not (v_domain = any(v_domains)) then
    raise exception 'CURATED_DOMAIN_IDENTITY_INVALID';
  end if;
  if p_payload->>'packId' <> v_domain then
    raise exception 'CURATED_DOMAIN_IDENTITY_INVALID';
  end if;

  if jsonb_typeof(p_payload->'trustDomain') <> 'object'
     or exists (
       select 1 from unnest(array[
         'jurisdictions','territorialScopes','publishers','authorities','sources',
         'sourceVersions','passages','claims','evidenceLinks','citations',
         'actorRules','processes','processClaimLinks','forms','fees',
         'handlingPolicies','freshnessRecords'
       ]) k(key)
       where jsonb_typeof(p_payload->k.key) is distinct from 'array'
     ) then raise exception 'CURATED_DOMAIN_INVALID_STRUCTURE'; end if;

  if jsonb_array_length(p_payload->'jurisdictions') not between 1 and 30
     or jsonb_array_length(p_payload->'territorialScopes') not between 1 and 30
     or jsonb_array_length(p_payload->'publishers') not between 1 and 30
     or jsonb_array_length(p_payload->'authorities') not between 1 and 30
     or jsonb_array_length(p_payload->'sources') not between 1 and 50
     or jsonb_array_length(p_payload->'sourceVersions') not between 1 and 100
     or jsonb_array_length(p_payload->'passages') not between 1 and 250
     or jsonb_array_length(p_payload->'claims') > 500
     or jsonb_array_length(p_payload->'evidenceLinks') > 500
     or jsonb_array_length(p_payload->'citations') > 500
     or jsonb_array_length(p_payload->'actorRules') > 50
     or jsonb_array_length(p_payload->'processes') > 100
     or jsonb_array_length(p_payload->'processClaimLinks') > 500
     or jsonb_array_length(p_payload->'forms') > 100
     or jsonb_array_length(p_payload->'fees') > 100
     or jsonb_array_length(p_payload->'handlingPolicies') > 250
     or jsonb_array_length(p_payload->'freshnessRecords') > 250
     or (
       jsonb_array_length(p_payload->'claims') = 0
       and jsonb_array_length(p_payload->'processes') = 0
     ) then raise exception 'CURATED_DOMAIN_CARDINALITY_INVALID'; end if;

  -- Every semantic identity is a UUIDv4 and may occur in only one payload entity.
  if p_payload#>>'{trustDomain,id}' !~ v_uuid_re or exists (
    with entities as (
      select value from jsonb_array_elements(p_payload->'jurisdictions')
      union all select value from jsonb_array_elements(p_payload->'territorialScopes')
      union all select value from jsonb_array_elements(p_payload->'publishers')
      union all select value from jsonb_array_elements(p_payload->'authorities')
      union all select value from jsonb_array_elements(p_payload->'sources')
      union all select value from jsonb_array_elements(p_payload->'sourceVersions')
      union all select value from jsonb_array_elements(p_payload->'passages')
      union all select value from jsonb_array_elements(p_payload->'claims')
      union all select value from jsonb_array_elements(p_payload->'evidenceLinks')
      union all select value from jsonb_array_elements(p_payload->'citations')
      union all select value from jsonb_array_elements(p_payload->'actorRules')
      union all select value from jsonb_array_elements(p_payload->'processes')
      union all select value from jsonb_array_elements(p_payload->'processClaimLinks')
      union all select value from jsonb_array_elements(p_payload->'forms')
      union all select value from jsonb_array_elements(p_payload->'fees')
      union all select value from jsonb_array_elements(p_payload->'handlingPolicies')
      union all select value from jsonb_array_elements(p_payload->'freshnessRecords')
    )
    select 1 from entities where value->>'id' !~ v_uuid_re
  ) then raise exception 'CURATED_DOMAIN_ID_INVALID'; end if;
  if exists (
    with ids as (
      select p_payload#>>'{trustDomain,id}' id
      union all select value->>'id' from jsonb_array_elements(p_payload->'jurisdictions')
      union all select value->>'id' from jsonb_array_elements(p_payload->'territorialScopes')
      union all select value->>'id' from jsonb_array_elements(p_payload->'publishers')
      union all select value->>'id' from jsonb_array_elements(p_payload->'authorities')
      union all select value->>'id' from jsonb_array_elements(p_payload->'sources')
      union all select value->>'id' from jsonb_array_elements(p_payload->'sourceVersions')
      union all select value->>'id' from jsonb_array_elements(p_payload->'passages')
      union all select value->>'id' from jsonb_array_elements(p_payload->'claims')
      union all select value->>'id' from jsonb_array_elements(p_payload->'evidenceLinks')
      union all select value->>'id' from jsonb_array_elements(p_payload->'citations')
      union all select value->>'id' from jsonb_array_elements(p_payload->'actorRules')
      union all select value->>'id' from jsonb_array_elements(p_payload->'processes')
      union all select value->>'id' from jsonb_array_elements(p_payload->'processClaimLinks')
      union all select value->>'id' from jsonb_array_elements(p_payload->'forms')
      union all select value->>'id' from jsonb_array_elements(p_payload->'fees')
      union all select value->>'id' from jsonb_array_elements(p_payload->'handlingPolicies')
      union all select value->>'id' from jsonb_array_elements(p_payload->'freshnessRecords')
    ) select 1 from ids group by id having count(*) > 1
  ) then raise exception 'CURATED_DOMAIN_DUPLICATE_ID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'claims') c
    group by lower(btrim(c->>'text')), c->>'jurisdictionId',
      coalesce(c->>'territorialScopeId',''), c->>'type'
    having count(*) > 1
  ) then raise exception 'CURATED_DOMAIN_SEMANTIC_COLLISION'; end if;

  -- Validate bounded references against the payload graph.
  if exists (
    select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
    where nullif(j->>'name','') is null
      or nullif(j->>'level','') is null
      or nullif(j->>'code','') is null
      or j->>'countryCode' <> 'DE'
      or (
        nullif(j->>'parentJurisdictionId','') is not null
        and not exists (
          select 1 from jsonb_array_elements(p_payload->'jurisdictions') p
          where p->>'id'=j->>'parentJurisdictionId'
        )
      )
  ) then raise exception 'CURATED_DOMAIN_HIERARCHY_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
    where nullif(s->>'type','') is null
      or jsonb_typeof(s->'jurisdictionIds') <> 'array'
      or jsonb_array_length(s->'jurisdictionIds') not between 1 and 30
      or exists (
        select 1 from jsonb_array_elements_text(s->'jurisdictionIds') x(id)
        where not exists (
          select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
          where j->>'id'=x.id
        )
      )
  ) then raise exception 'CURATED_DOMAIN_SCOPE_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'publishers') p
    where nullif(p->>'name','') is null
      or p->>'trustDomainId' <> p_payload#>>'{trustDomain,id}'
      or not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
        where s->>'id'=p->>'territorialScopeId')
  ) or exists (
    select 1 from jsonb_array_elements(p_payload->'authorities') a
    where nullif(a->>'name','') is null or nullif(a->>'type','') is null
      or not exists (select 1 from jsonb_array_elements(p_payload->'publishers') p
        where p->>'id'=a->>'publisherId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=a->>'jurisdictionId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
        where s->>'id'=a->>'territorialScopeId')
  ) then raise exception 'CURATED_DOMAIN_AUTHORITY_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'sources') s
    where nullif(s->>'canonicalUrl','') is null
      or s->>'canonicalUrl' !~ '^https://[^[:space:]#]+$'
      or lower(s->>'normalizedOrigin') !~ '^https://[^/:[:space:]#]+$'
      or not exists (select 1 from jsonb_array_elements(p_payload->'publishers') p
        where p->>'id'=s->>'publisherId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'authorities') a
        where a->>'id'=s->>'authorityId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=s->>'jurisdictionId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') t
        where t->>'id'=s->>'territorialScopeId')
  ) then raise exception 'CURATED_DOMAIN_SOURCE_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
    where v->>'contentHash' !~ '^[0-9a-f]{64}$'
      or not exists (select 1 from jsonb_array_elements(p_payload->'sources') s
        where s->>'id'=v->>'sourceId')
  ) or exists (
    select 1 from jsonb_array_elements(p_payload->'passages') p
    where nullif(p->>'text','') is null or p->>'textHash' !~ '^[0-9a-f]{64}$'
      or not exists (select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
        where v->>'id'=p->>'sourceVersionId')
  ) then raise exception 'CURATED_DOMAIN_PROVENANCE_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'claims') c
    where nullif(c->>'text','') is null or nullif(c->>'type','') is null
      or not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=c->>'jurisdictionId')
      or (
        nullif(c->>'territorialScopeId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
          where s->>'id'=c->>'territorialScopeId')
      )
      or (
        nullif(c->>'authorityId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'authorities') a
          where a->>'id'=c->>'authorityId')
      )
      or not exists (
        select 1 from jsonb_array_elements(p_payload->'evidenceLinks') e
        where e->>'claimId'=c->>'id'
      )
  ) then raise exception 'CURATED_DOMAIN_CLAIM_EVIDENCE_REQUIRED'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'evidenceLinks') e
    where not exists (select 1 from jsonb_array_elements(p_payload->'claims') c
      where c->>'id'=e->>'claimId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
        where v->>'id'=e->>'sourceVersionId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'passages') p
        where p->>'id'=e->>'passageId' and p->>'sourceVersionId'=e->>'sourceVersionId')
  ) or exists (
    select 1 from jsonb_array_elements(p_payload->'citations') c
    where not exists (select 1 from jsonb_array_elements(p_payload->'claims') x
      where x->>'id'=c->>'claimId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'sources') s
        where s->>'id'=c->>'sourceId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
        where v->>'id'=c->>'sourceVersionId' and v->>'sourceId'=c->>'sourceId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'passages') p
        where p->>'id'=c->>'passageId' and p->>'sourceVersionId'=c->>'sourceVersionId')
  ) then raise exception 'CURATED_DOMAIN_EVIDENCE_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'processes') p
    where p->>'processGroupId' <> v_domain
      or not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=p->>'jurisdictionId')
      or (
        nullif(p->>'territorialScopeId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
          where s->>'id'=p->>'territorialScopeId')
      )
  ) then raise exception 'CURATED_DOMAIN_PROCESS_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'actorRules') r
    where not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=r->>'jurisdictionId')
      or (
        nullif(r->>'territorialScopeId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
          where s->>'id'=r->>'territorialScopeId')
      )
  ) then raise exception 'CURATED_DOMAIN_ACTOR_RULE_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'processClaimLinks') l
    where not exists (select 1 from jsonb_array_elements(p_payload->'processes') p
        where p->>'id'=l->>'processId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'claims') c
        where c->>'id'=l->>'claimId')
  ) or exists (
    select 1 from jsonb_array_elements(p_payload->'processClaimLinks') l
    group by l->>'processId',l->>'claimId',l->>'role'
    having count(*)>1
  ) then raise exception 'CURATED_DOMAIN_PROCESS_CLAIM_LINK_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'forms') f
    where not exists (select 1 from jsonb_array_elements(p_payload->'authorities') a
      where a->>'id'=f->>'authorityId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=f->>'jurisdictionId')
      or (
        nullif(f->>'territorialScopeId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
          where s->>'id'=f->>'territorialScopeId')
      )
      or not exists (select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
        where v->>'id'=f->>'sourceVersionId')
      or (
        nullif(f->>'passageId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'passages') p
          where p->>'id'=f->>'passageId')
      )
  ) or exists (
    select 1 from jsonb_array_elements(p_payload->'fees') f
    where not exists (select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=f->>'jurisdictionId')
      or (
        nullif(f->>'territorialScopeId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
          where s->>'id'=f->>'territorialScopeId')
      )
      or (
        nullif(f->>'authorityId','') is not null
        and not exists (select 1 from jsonb_array_elements(p_payload->'authorities') a
          where a->>'id'=f->>'authorityId')
      )
      or not exists (select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
      where v->>'id'=f->>'sourceVersionId')
      or not exists (select 1 from jsonb_array_elements(p_payload->'passages') p
        where p->>'id'=f->>'passageId')
  ) then raise exception 'CURATED_DOMAIN_RULE_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'handlingPolicies') h
    where not exists (select 1 from jsonb_array_elements(p_payload->'sources') s
      where s->>'id'=h->>'sourceId')
      or (
        h->>'handlingMode'='FETCH_LIVE'
        and h->>'staleBehavior'<>'REVALIDATE_BEFORE_USE'
      )
  ) then raise exception 'CURATED_DOMAIN_HANDLING_INVALID'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_payload->'freshnessRecords') f
    where case f->>'entityType'
      when 'source' then not exists (
        select 1 from jsonb_array_elements(p_payload->'sources') e
        where e->>'id'=f->>'entityId')
      when 'source_version' then not exists (
        select 1 from jsonb_array_elements(p_payload->'sourceVersions') e
        where e->>'id'=f->>'entityId')
      when 'source_passage' then not exists (
        select 1 from jsonb_array_elements(p_payload->'passages') e
        where e->>'id'=f->>'entityId')
      when 'claim' then not exists (
        select 1 from jsonb_array_elements(p_payload->'claims') e
        where e->>'id'=f->>'entityId')
      when 'process' then not exists (
        select 1 from jsonb_array_elements(p_payload->'processes') e
        where e->>'id'=f->>'entityId')
      else true
    end
  ) then raise exception 'CURATED_DOMAIN_FRESHNESS_INVALID'; end if;

  insert into public.knowledge_trust_domains(id,code,name,review_status)
  values (
    (p_payload#>>'{trustDomain,id}')::uuid,
    p_payload#>>'{trustDomain,code}',
    p_payload#>>'{trustDomain,name}',
    'expert_reviewed'
  ) on conflict(id) do nothing;
  get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
  if not exists (select 1 from public.knowledge_trust_domains t
    where t.id=(p_payload#>>'{trustDomain,id}')::uuid
      and t.code=p_payload#>>'{trustDomain,code}'
      and t.name=p_payload#>>'{trustDomain,name}')
  then raise exception 'CURATED_DOMAIN_CONFLICT:trust_domain'; end if;

  for v_row in select value from jsonb_array_elements(p_payload->'jurisdictions') loop
    insert into public.knowledge_jurisdictions(
      id,jurisdiction_level,jurisdiction_code,country_code,parent_jurisdiction_id,
      name,status
    ) values (
      (v_row->>'id')::uuid,v_row->>'level',v_row->>'code','DE',
      nullif(v_row->>'parentJurisdictionId','')::uuid,v_row->>'name','active'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_jurisdictions j
      where j.id=(v_row->>'id')::uuid and j.jurisdiction_level=v_row->>'level'
        and j.jurisdiction_code=v_row->>'code' and j.country_code='DE'
        and j.parent_jurisdiction_id is not distinct from nullif(v_row->>'parentJurisdictionId','')::uuid
        and j.name=v_row->>'name')
    then raise exception 'CURATED_DOMAIN_CONFLICT:jurisdiction:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'territorialScopes') loop
    insert into public.knowledge_territorial_scopes(
      id,scope_type,jurisdiction_ids,land_codes,kreis_codes,municipality_codes,
      scope_verified,review_status
    ) values (
      (v_row->>'id')::uuid,v_row->>'type',
      array(select jsonb_array_elements_text(v_row->'jurisdictionIds'))::uuid[],
      array(select jsonb_array_elements_text(coalesce(v_row->'landCodes','[]'::jsonb))),
      array(select jsonb_array_elements_text(coalesce(v_row->'kreisCodes','[]'::jsonb))),
      array(select jsonb_array_elements_text(coalesce(v_row->'municipalityCodes','[]'::jsonb))),
      true,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_territorial_scopes s
      where s.id=(v_row->>'id')::uuid and s.scope_type=v_row->>'type'
        and s.jurisdiction_ids=array(select jsonb_array_elements_text(v_row->'jurisdictionIds'))::uuid[])
    then raise exception 'CURATED_DOMAIN_CONFLICT:scope:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'publishers') loop
    insert into public.knowledge_publishers(
      id,publisher_name,publisher_type,official_status,subject_matter_competence,
      territorial_competence_id,trust_domain_id,review_status
    ) values (
      (v_row->>'id')::uuid,v_row->>'name',v_row->>'type',true,
      array[v_domain],(v_row->>'territorialScopeId')::uuid,
      (v_row->>'trustDomainId')::uuid,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_publishers p
      where p.id=(v_row->>'id')::uuid and p.publisher_name=v_row->>'name'
        and p.publisher_type=v_row->>'type'
        and p.territorial_competence_id=(v_row->>'territorialScopeId')::uuid
        and p.trust_domain_id=(v_row->>'trustDomainId')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:publisher:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'authorities') loop
    insert into public.knowledge_authorities(
      id,publisher_id,authority_name,authority_type,jurisdiction_id,
      territorial_scope_id,official_portal_url,status,review_status
    ) values (
      (v_row->>'id')::uuid,(v_row->>'publisherId')::uuid,v_row->>'name',
      v_row->>'type',(v_row->>'jurisdictionId')::uuid,
      (v_row->>'territorialScopeId')::uuid,v_row->>'officialPortalUrl',
      'active','expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_authorities a
      where a.id=(v_row->>'id')::uuid
        and a.publisher_id=(v_row->>'publisherId')::uuid
        and a.authority_name=v_row->>'name' and a.authority_type=v_row->>'type'
        and a.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and a.territorial_scope_id=(v_row->>'territorialScopeId')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:authority:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'sources') loop
    insert into public.knowledge_sources(
      id,publisher_id,source_type,source_purpose,canonical_url,official_domain,
      official_domain_verification_status,jurisdiction_id,territorial_scope_id,
      source_language,publication_identifier,supports_claim_types,high_risk_use_allowed,
      normalized_canonical_url,normalized_origin,source_class,evidence_eligibility,
      issuing_authority_id,authority_level,process_scope,retrieval_method,
      terms_or_license_review_status,robots_review_status,first_verified_at,last_verified_at,
      active_status,trust_status,authorization_state,default_handling_mode,
      freshness_class,stale_behavior
    ) values (
      (v_row->>'id')::uuid,(v_row->>'publisherId')::uuid,v_row->>'sourceType',
      v_row->>'purpose',v_row->>'canonicalUrl',lower(v_row->>'officialDomain'),
      'verified',(v_row->>'jurisdictionId')::uuid,(v_row->>'territorialScopeId')::uuid,
      'de',v_row->>'publicationIdentifier',
      array(select jsonb_array_elements_text(coalesce(v_row->'supportsClaimTypes','[]'::jsonb))),
      coalesce((v_row->>'highRiskUseAllowed')::boolean,false),
      v_row->>'canonicalUrl',lower(v_row->>'normalizedOrigin'),
      (v_row->>'sourceClass')::public.knowledge_source_class,
      'PUBLICATION_EVIDENCE_ELIGIBLE',(v_row->>'authorityId')::uuid,
      (v_row->>'authorityLevel')::public.knowledge_authority_level,
      array[v_domain],(v_row->>'retrievalMethod')::public.knowledge_retrieval_method,
      'ALLOWED','ALLOWED',now(),now(),'ACTIVE','VERIFIED','AUTHORIZED',
      (v_row->>'handlingMode')::public.knowledge_handling_mode,
      (v_row->>'freshnessClass')::public.knowledge_freshness_class,
      (v_row->>'staleBehavior')::public.knowledge_stale_behavior
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_sources s
      where s.id=(v_row->>'id')::uuid and s.publisher_id=(v_row->>'publisherId')::uuid
        and s.canonical_url=v_row->>'canonicalUrl'
        and s.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and s.territorial_scope_id=(v_row->>'territorialScopeId')::uuid
        and s.issuing_authority_id=(v_row->>'authorityId')::uuid
        and s.source_class=(v_row->>'sourceClass')::public.knowledge_source_class
        and s.authorization_state='AUTHORIZED')
    then raise exception 'CURATED_DOMAIN_CONFLICT:source:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'sourceVersions') loop
    insert into public.knowledge_source_versions(
      id,source_id,version_sequence,content_hash,normalized_content_hash,
      review_status,freshness_status,change_status,immutable,historical_use_allowed,
      current_use_allowed
    ) values (
      (v_row->>'id')::uuid,(v_row->>'sourceId')::uuid,
      (v_row->>'versionSequence')::integer,v_row->>'contentHash',
      v_row->>'contentHash','expert_reviewed','fresh','unchanged',true,true,true
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_source_versions v
      where v.id=(v_row->>'id')::uuid and v.source_id=(v_row->>'sourceId')::uuid
        and v.version_sequence=(v_row->>'versionSequence')::integer
        and v.content_hash=v_row->>'contentHash')
    then raise exception 'CURATED_DOMAIN_CONFLICT:version:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'passages') loop
    insert into public.knowledge_source_passages(
      id,source_version_id,passage_order,heading_path,section_identifier,text,
      text_hash,language,citation_ready,review_status
    ) values (
      (v_row->>'id')::uuid,(v_row->>'sourceVersionId')::uuid,
      (v_row->>'order')::integer,
      array(select jsonb_array_elements_text(coalesce(v_row->'headingPath','[]'::jsonb))),
      v_row->>'locator',v_row->>'text',v_row->>'textHash','de',true,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_source_passages p
      where p.id=(v_row->>'id')::uuid
        and p.source_version_id=(v_row->>'sourceVersionId')::uuid
        and p.passage_order=(v_row->>'order')::integer
        and p.text=v_row->>'text' and p.text_hash=v_row->>'textHash')
    then raise exception 'CURATED_DOMAIN_CONFLICT:passage:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'actorRules') loop
    insert into public.knowledge_responsible_actor_rules(
      id,actor_state,user_must_act,german_authority_must_act,jurisdiction_id,
      territorial_scope_id,review_status,concrete_instruction_allowed
    ) values (
      (v_row->>'id')::uuid,v_row->>'actorState',
      coalesce((v_row->>'userMustAct')::boolean,false),
      coalesce((v_row->>'authorityMustAct')::boolean,false),
      (v_row->>'jurisdictionId')::uuid,nullif(v_row->>'territorialScopeId','')::uuid,
      'expert_reviewed',false
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_responsible_actor_rules r
      where r.id=(v_row->>'id')::uuid and r.actor_state=v_row->>'actorState'
        and r.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and r.territorial_scope_id is not distinct from nullif(v_row->>'territorialScopeId','')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:actor_rule:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
    insert into public.knowledge_claims(
      id,claim_type,claim_text_canonical,claim_language,market,jurisdiction_id,
      territorial_scope_id,authority_id,risk_level,allowed_output_uses,
      requires_direct_support,requires_effective_date,requires_authority_resolution,
      review_status,freshness_status,status
    ) values (
      (v_row->>'id')::uuid,v_row->>'type',v_row->>'text','de','DE',
      (v_row->>'jurisdictionId')::uuid,nullif(v_row->>'territorialScopeId','')::uuid,
      nullif(v_row->>'authorityId','')::uuid,v_row->>'riskLevel',
      array['orientation'],true,coalesce((v_row->>'requiresEffectiveDate')::boolean,false),
      coalesce((v_row->>'requiresAuthorityResolution')::boolean,false),
      'expert_reviewed','fresh','active'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_claims c
      where c.id=(v_row->>'id')::uuid and c.claim_type=v_row->>'type'
        and c.claim_text_canonical=v_row->>'text'
        and c.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and c.territorial_scope_id is not distinct from nullif(v_row->>'territorialScopeId','')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:claim:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'evidenceLinks') loop
    insert into public.knowledge_claim_evidence_links(
      id,claim_id,source_version_id,passage_id,support_status,evidence_role,
      is_primary_evidence,jurisdiction_match,territorial_scope_match,
      authority_competence_match,effective_date_match,review_accepted,authorized_use
    ) values (
      (v_row->>'id')::uuid,(v_row->>'claimId')::uuid,
      (v_row->>'sourceVersionId')::uuid,(v_row->>'passageId')::uuid,
      'direct_support',v_row->>'role',
      coalesce((v_row->>'primary')::boolean,true),true,true,true,true,true,
      array['orientation']
    ) on conflict(claim_id,passage_id,evidence_role) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_claim_evidence_links e
      where e.id=(v_row->>'id')::uuid and e.claim_id=(v_row->>'claimId')::uuid
        and e.source_version_id=(v_row->>'sourceVersionId')::uuid
        and e.passage_id=(v_row->>'passageId')::uuid
        and e.evidence_role=v_row->>'role')
    then raise exception 'CURATED_DOMAIN_CONFLICT:evidence:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'citations') loop
    insert into public.knowledge_citations(
      id,claim_id,source_id,source_version_id,passage_id,publisher_id,
      jurisdiction_id,last_verified_at,user_facing_label,internal_audit_label,
      original_language,canonical_url
    ) values (
      (v_row->>'id')::uuid,(v_row->>'claimId')::uuid,(v_row->>'sourceId')::uuid,
      (v_row->>'sourceVersionId')::uuid,(v_row->>'passageId')::uuid,
      (v_row->>'publisherId')::uuid,(v_row->>'jurisdictionId')::uuid,now(),
      v_row->>'label',v_row->>'label','de',v_row->>'canonicalUrl'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_citations c
      where c.id=(v_row->>'id')::uuid and c.claim_id=(v_row->>'claimId')::uuid
        and c.passage_id=(v_row->>'passageId')::uuid
        and c.canonical_url=v_row->>'canonicalUrl')
    then raise exception 'CURATED_DOMAIN_CONFLICT:citation:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'processes') loop
    insert into public.knowledge_processes(
      id,process_group_id,title,jurisdiction_id,territorial_scope_id,risk_level,
      orientation_only,trigger_description,safe_first_step,
      regional_variation_expected,full_legal_advice_excluded,review_status
    ) values (
      (v_row->>'id')::uuid,v_domain,v_row->>'title',
      (v_row->>'jurisdictionId')::uuid,nullif(v_row->>'territorialScopeId','')::uuid,
      v_row->>'riskLevel',true,v_row->>'trigger',v_row->>'safeFirstStep',
      coalesce((v_row->>'regionalVariationExpected')::boolean,false),
      true,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_processes p
      where p.id=(v_row->>'id')::uuid and p.process_group_id=v_domain
        and p.title=v_row->>'title' and p.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and p.territorial_scope_id is not distinct from nullif(v_row->>'territorialScopeId','')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:process:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'processClaimLinks') loop
    if exists(select 1 from public.knowledge_process_claim_links l
      where l.process_id=(v_row->>'processId')::uuid
        and l.process_step_id is null
        and l.claim_id=(v_row->>'claimId')::uuid
        and l.claim_role=v_row->>'role'
        and l.id<>(v_row->>'id')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:process_claim_semantic:%',v_row->>'id'; end if;
    insert into public.knowledge_process_claim_links(
      id,process_id,claim_id,claim_role,required,sequence_context,
      qualification_required
    ) values (
      (v_row->>'id')::uuid,(v_row->>'processId')::uuid,
      (v_row->>'claimId')::uuid,v_row->>'role',
      coalesce((v_row->>'required')::boolean,false),
      v_row->>'sequenceContext',
      coalesce((v_row->>'qualificationRequired')::boolean,false)
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_process_claim_links l
      where l.id=(v_row->>'id')::uuid
        and l.process_id=(v_row->>'processId')::uuid
        and l.process_step_id is null
        and l.claim_id=(v_row->>'claimId')::uuid
        and l.claim_role=v_row->>'role')
    then raise exception 'CURATED_DOMAIN_CONFLICT:process_claim_link:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'forms') loop
    insert into public.knowledge_forms(
      id,form_name,form_identifier,authority_id,jurisdiction_id,territorial_scope_id,
      source_version_id,instructions_passage_id,purpose,submission_channels,
      review_status,status
    ) values (
      (v_row->>'id')::uuid,v_row->>'name',v_row->>'identifier',
      (v_row->>'authorityId')::uuid,(v_row->>'jurisdictionId')::uuid,
      nullif(v_row->>'territorialScopeId','')::uuid,
      (v_row->>'sourceVersionId')::uuid,nullif(v_row->>'passageId','')::uuid,
      v_row->>'purpose',
      array(select jsonb_array_elements_text(coalesce(v_row->'submissionChannels','[]'::jsonb))),
      'expert_reviewed','active'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_forms f
      where f.id=(v_row->>'id')::uuid and f.form_name=v_row->>'name'
        and f.authority_id=(v_row->>'authorityId')::uuid
        and f.source_version_id=(v_row->>'sourceVersionId')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:form:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'fees') loop
    insert into public.knowledge_fee_rules(
      id,fee_status,amount,currency,amount_type,condition,jurisdiction_id,
      territorial_scope_id,authority_id,source_version_id,passage_id,
      review_status,conflict_status
    ) values (
      (v_row->>'id')::uuid,v_row->>'status',nullif(v_row->>'amount','')::numeric,
      v_row->>'currency',v_row->>'amountType',v_row->>'condition',
      (v_row->>'jurisdictionId')::uuid,nullif(v_row->>'territorialScopeId','')::uuid,
      nullif(v_row->>'authorityId','')::uuid,(v_row->>'sourceVersionId')::uuid,
      (v_row->>'passageId')::uuid,'expert_reviewed','none'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_fee_rules f
      where f.id=(v_row->>'id')::uuid and f.fee_status=v_row->>'status'
        and f.source_version_id=(v_row->>'sourceVersionId')::uuid
        and f.passage_id=(v_row->>'passageId')::uuid)
    then raise exception 'CURATED_DOMAIN_CONFLICT:fee:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'handlingPolicies') loop
    insert into public.knowledge_source_handling_policies(
      id,source_id,information_class,process_scope,handling_mode,freshness_class,
      stale_behavior,required_context_keys,risk_class,state_version,revalidation_due_at
    ) values (
      (v_row->>'id')::uuid,(v_row->>'sourceId')::uuid,
      (v_row->>'informationClass')::public.knowledge_information_class,v_domain,
      (v_row->>'handlingMode')::public.knowledge_handling_mode,
      (v_row->>'freshnessClass')::public.knowledge_freshness_class,
      (v_row->>'staleBehavior')::public.knowledge_stale_behavior,
      array(select jsonb_array_elements_text(coalesce(v_row->'requiredContextKeys','[]'::jsonb)))::public.knowledge_required_context_key[],
      v_row->>'riskClass',1,nullif(v_row->>'revalidationDueAt','')::timestamptz
    ) on conflict(source_id,information_class,process_scope) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_source_handling_policies h
      where h.id=(v_row->>'id')::uuid and h.source_id=(v_row->>'sourceId')::uuid
        and h.information_class=(v_row->>'informationClass')::public.knowledge_information_class
        and h.process_scope=v_domain
        and h.handling_mode=(v_row->>'handlingMode')::public.knowledge_handling_mode
        and h.freshness_class=(v_row->>'freshnessClass')::public.knowledge_freshness_class
        and h.stale_behavior=(v_row->>'staleBehavior')::public.knowledge_stale_behavior)
    then raise exception 'CURATED_DOMAIN_CONFLICT:handling:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'freshnessRecords') loop
    insert into public.knowledge_freshness_records(
      id,entity_type,entity_id,freshness_status,source_available,
      content_hash_matches,change_status,effective_date_known,review_required
    ) values (
      (v_row->>'id')::uuid,v_row->>'entityType',(v_row->>'entityId')::uuid,
      v_row->>'status',true,true,'unchanged',
      coalesce((v_row->>'effectiveDateKnown')::boolean,false),false
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_freshness_records f
      where f.id=(v_row->>'id')::uuid and f.entity_type=v_row->>'entityType'
        and f.entity_id=(v_row->>'entityId')::uuid and f.freshness_status=v_row->>'status')
    then raise exception 'CURATED_DOMAIN_CONFLICT:freshness:%',v_row->>'id'; end if;
  end loop;

  return jsonb_build_object(
    'schemaVersion',1,'packId',p_payload->>'packId','domain',v_domain,
    'semanticCreated',v_total_created
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'CURATED_DOMAIN_VALIDATION_FAILED';
end;
$$;

create or replace function public.knowledge_ingest_curated_service_area_pack(p_payload jsonb)
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
  v_domain text;
  v_uuid_re constant text :=
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  v_domains constant text[] := array[
    'anmeldung_ummeldung_abmeldung',
    'steuer_id_and_basic_finanzamt_letters',
    'health_insurance_orientation',
    'jobcenter_buergergeld',
    'familienkasse_kindergeld',
    'rechnung_mahnung',
    'kuendigung_orientation',
    'auslaenderbehoerde_limited_orientation',
    'vehicle_registration_and_driving_licence',
    'housing_orientation'
  ];
  v_keys constant text[] := array[
    'schemaVersion','packId','domain','countryCode','trustDomain','jurisdictions',
    'territorialScopes','publishers','authorities','sources','sourceVersions',
    'passages','competences','processBindings','handlingPolicies'
  ];
begin
  if p_payload is null or jsonb_typeof(p_payload)<>'object' then
    raise exception 'CURATED_SERVICE_AREA_INVALID_ROOT';
  end if;
  if exists(select 1 from jsonb_object_keys(p_payload) k(key)
      where not(k.key=any(v_keys)))
     or exists(select 1 from unnest(v_keys) k(key) where not(p_payload?k.key))
  then raise exception 'CURATED_SERVICE_AREA_INVALID_STRUCTURE'; end if;
  v_domain:=p_payload->>'domain';
  if p_payload->>'schemaVersion'<>'1' or p_payload->>'countryCode'<>'DE'
     or p_payload->>'packId' !~ '^[a-z0-9_]{3,80}$'
     or v_domain is null or not(v_domain=any(v_domains))
  then raise exception 'CURATED_SERVICE_AREA_IDENTITY_INVALID'; end if;
  if jsonb_typeof(p_payload->'trustDomain')<>'object' or exists(
    select 1 from unnest(array[
      'jurisdictions','territorialScopes','publishers','authorities','sources',
      'sourceVersions','passages','competences','processBindings','handlingPolicies'
    ]) k(key) where jsonb_typeof(p_payload->k.key) is distinct from 'array'
  ) then raise exception 'CURATED_SERVICE_AREA_INVALID_STRUCTURE'; end if;
  if jsonb_array_length(p_payload->'jurisdictions') not between 3 and 60
     or (select count(*) from jsonb_array_elements(p_payload->'jurisdictions') j
       where j->>'level'='de_gemeinde') not between 1 and 50
     or jsonb_array_length(p_payload->'territorialScopes') not between 1 and 20
     or jsonb_array_length(p_payload->'publishers') not between 1 and 20
     or jsonb_array_length(p_payload->'authorities') not between 1 and 20
     or jsonb_array_length(p_payload->'sources') not between 1 and 100
     or jsonb_array_length(p_payload->'sourceVersions') not between 1 and 100
     or jsonb_array_length(p_payload->'passages') not between 1 and 250
     or jsonb_array_length(p_payload->'competences') not between 1 and 50
     or jsonb_array_length(p_payload->'processBindings') > 50
     or jsonb_array_length(p_payload->'handlingPolicies') not between 1 and 250
  then raise exception 'CURATED_SERVICE_AREA_CARDINALITY_INVALID'; end if;

  if p_payload#>>'{trustDomain,id}' !~ v_uuid_re or exists (
    with entities as (
      select value from jsonb_array_elements(p_payload->'jurisdictions')
      union all select value from jsonb_array_elements(p_payload->'territorialScopes')
      union all select value from jsonb_array_elements(p_payload->'publishers')
      union all select value from jsonb_array_elements(p_payload->'authorities')
      union all select value from jsonb_array_elements(p_payload->'sources')
      union all select value from jsonb_array_elements(p_payload->'sourceVersions')
      union all select value from jsonb_array_elements(p_payload->'passages')
      union all select value from jsonb_array_elements(p_payload->'competences')
      union all select value from jsonb_array_elements(p_payload->'processBindings')
      union all select value from jsonb_array_elements(p_payload->'handlingPolicies')
    ) select 1 from entities where value->>'id' !~ v_uuid_re
  ) then raise exception 'CURATED_SERVICE_AREA_ID_INVALID'; end if;
  if exists (
    with ids as (
      select p_payload#>>'{trustDomain,id}' id
      union all select value->>'id' from jsonb_array_elements(p_payload->'jurisdictions')
      union all select value->>'id' from jsonb_array_elements(p_payload->'territorialScopes')
      union all select value->>'id' from jsonb_array_elements(p_payload->'publishers')
      union all select value->>'id' from jsonb_array_elements(p_payload->'authorities')
      union all select value->>'id' from jsonb_array_elements(p_payload->'sources')
      union all select value->>'id' from jsonb_array_elements(p_payload->'sourceVersions')
      union all select value->>'id' from jsonb_array_elements(p_payload->'passages')
      union all select value->>'id' from jsonb_array_elements(p_payload->'competences')
      union all select value->>'id' from jsonb_array_elements(p_payload->'processBindings')
      union all select value->>'id' from jsonb_array_elements(p_payload->'handlingPolicies')
    ) select 1 from ids group by id having count(*)>1
  ) then raise exception 'CURATED_SERVICE_AREA_DUPLICATE_ID'; end if;

  if exists(
    select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
    where j->>'countryCode'<>'DE' or nullif(j->>'code','') is null
      or nullif(j->>'name','') is null
      or (
        j->>'level'<>'de_federal' and nullif(j->>'parentJurisdictionId','') is null
      )
      or (
        nullif(j->>'parentJurisdictionId','') is not null
        and not exists(select 1 from jsonb_array_elements(p_payload->'jurisdictions') p
          where p->>'id'=j->>'parentJurisdictionId')
      )
  ) or (select count(*) from jsonb_array_elements(p_payload->'jurisdictions') j
    where j->>'level'='de_federal' and j->>'code'='DE')<>1
  then raise exception 'CURATED_SERVICE_AREA_HIERARCHY_INVALID'; end if;
  if exists(
    select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
    where jsonb_typeof(s->'jurisdictionIds')<>'array'
      or jsonb_typeof(s->'municipalityCodes')<>'array'
      or jsonb_array_length(s->'municipalityCodes') not between 1 and 50
      or exists(select 1 from jsonb_array_elements_text(s->'jurisdictionIds') x(id)
        where not exists(select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
          where j->>'id'=x.id))
      or exists(select 1 from jsonb_array_elements_text(s->'municipalityCodes') x(code)
        where not exists(select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
          where j->>'level'='de_gemeinde' and j->>'code'=x.code))
  ) then raise exception 'CURATED_SERVICE_AREA_SCOPE_INVALID'; end if;
  if exists(
    select 1 from jsonb_array_elements(p_payload->'authorities') a
    where not exists(select 1 from jsonb_array_elements(p_payload->'publishers') p
      where p->>'id'=a->>'publisherId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=a->>'jurisdictionId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
        where s->>'id'=a->>'territorialScopeId')
  ) or exists(
    select 1 from jsonb_array_elements(p_payload->'publishers') p
    where p->>'trustDomainId'<>p_payload#>>'{trustDomain,id}'
      or not exists(select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
        where s->>'id'=p->>'territorialScopeId')
  ) or exists(
    select 1 from jsonb_array_elements(p_payload->'competences') c
    where c->>'domain'<>v_domain
      or not exists(select 1 from jsonb_array_elements(p_payload->'authorities') a
        where a->>'id'=c->>'authorityId'
          and a->>'territorialScopeId'=c->>'territorialScopeId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
        where v->>'id'=c->>'sourceVersionId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'passages') p
        where p->>'id'=c->>'passageId' and p->>'sourceVersionId'=c->>'sourceVersionId')
  ) then raise exception 'CURATED_SERVICE_AREA_COMPETENCE_INVALID'; end if;
  if exists(
    select 1 from jsonb_array_elements(p_payload->'sources') s
    where s->>'canonicalUrl' !~ '^https://[^[:space:]#]+$'
      or not exists(select 1 from jsonb_array_elements(p_payload->'publishers') p
        where p->>'id'=s->>'publisherId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'authorities') a
        where a->>'id'=s->>'authorityId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=s->>'jurisdictionId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'territorialScopes') t
        where t->>'id'=s->>'territorialScopeId')
  ) or exists(
    select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
    where v->>'contentHash' !~ '^[0-9a-f]{64}$'
      or not exists(select 1 from jsonb_array_elements(p_payload->'sources') s
        where s->>'id'=v->>'sourceId')
  ) or exists(
    select 1 from jsonb_array_elements(p_payload->'passages') p
    where p->>'textHash' !~ '^[0-9a-f]{64}$' or nullif(p->>'text','') is null
      or not exists(select 1 from jsonb_array_elements(p_payload->'sourceVersions') v
        where v->>'id'=p->>'sourceVersionId')
  ) then raise exception 'CURATED_SERVICE_AREA_SOURCE_INVALID'; end if;
  if exists(
    select 1 from jsonb_array_elements(p_payload->'processBindings') p
    where p->>'processGroupId'<>v_domain
      or not exists(select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
        where s->>'id'=p->>'territorialScopeId')
      or not exists(select 1 from jsonb_array_elements(p_payload->'jurisdictions') j
        where j->>'id'=p->>'jurisdictionId')
  ) then raise exception 'CURATED_SERVICE_AREA_PROCESS_INVALID'; end if;
  if exists(
    select 1 from jsonb_array_elements(p_payload->'handlingPolicies') h
    where not exists(select 1 from jsonb_array_elements(p_payload->'sources') s
      where s->>'id'=h->>'sourceId')
      or (h->>'handlingMode'='FETCH_LIVE'
        and h->>'staleBehavior'<>'REVALIDATE_BEFORE_USE')
  ) then raise exception 'CURATED_SERVICE_AREA_HANDLING_INVALID'; end if;

  insert into public.knowledge_trust_domains(id,code,name,review_status)
  values((p_payload#>>'{trustDomain,id}')::uuid,p_payload#>>'{trustDomain,code}',
    p_payload#>>'{trustDomain,name}','expert_reviewed')
  on conflict(id) do nothing;
  get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
  if not exists(select 1 from public.knowledge_trust_domains t
    where t.id=(p_payload#>>'{trustDomain,id}')::uuid
      and t.code=p_payload#>>'{trustDomain,code}' and t.name=p_payload#>>'{trustDomain,name}')
  then raise exception 'CURATED_SERVICE_AREA_CONFLICT:trust_domain'; end if;

  for v_row in select value from jsonb_array_elements(p_payload->'jurisdictions') loop
    insert into public.knowledge_jurisdictions(
      id,jurisdiction_level,jurisdiction_code,country_code,parent_jurisdiction_id,
      name,status
    ) values(
      (v_row->>'id')::uuid,v_row->>'level',v_row->>'code','DE',
      nullif(v_row->>'parentJurisdictionId','')::uuid,v_row->>'name','active'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_jurisdictions j
      where j.id=(v_row->>'id')::uuid and j.jurisdiction_level=v_row->>'level'
        and j.jurisdiction_code=v_row->>'code'
        and j.parent_jurisdiction_id is not distinct from nullif(v_row->>'parentJurisdictionId','')::uuid
        and j.name=v_row->>'name')
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:jurisdiction:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'territorialScopes') loop
    insert into public.knowledge_territorial_scopes(
      id,scope_type,jurisdiction_ids,land_codes,kreis_codes,municipality_codes,
      scope_verified,review_status
    ) values(
      (v_row->>'id')::uuid,v_row->>'type',
      array(select jsonb_array_elements_text(v_row->'jurisdictionIds'))::uuid[],
      array(select jsonb_array_elements_text(coalesce(v_row->'landCodes','[]'::jsonb))),
      array(select jsonb_array_elements_text(coalesce(v_row->'kreisCodes','[]'::jsonb))),
      array(select jsonb_array_elements_text(v_row->'municipalityCodes')),
      true,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_territorial_scopes s
      where s.id=(v_row->>'id')::uuid and s.scope_type=v_row->>'type'
        and s.jurisdiction_ids=array(select jsonb_array_elements_text(v_row->'jurisdictionIds'))::uuid[]
        and s.municipality_codes=array(select jsonb_array_elements_text(v_row->'municipalityCodes')))
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:scope:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'publishers') loop
    if not exists(select 1 from jsonb_array_elements(p_payload->'territorialScopes') s
      where s->>'id'=v_row->>'territorialScopeId')
    then raise exception 'CURATED_SERVICE_AREA_PUBLISHER_INVALID'; end if;
    insert into public.knowledge_publishers(
      id,publisher_name,publisher_type,official_status,subject_matter_competence,
      territorial_competence_id,trust_domain_id,review_status
    ) values(
      (v_row->>'id')::uuid,v_row->>'name',v_row->>'type',true,array[v_domain],
      (v_row->>'territorialScopeId')::uuid,(v_row->>'trustDomainId')::uuid,
      'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_publishers p
      where p.id=(v_row->>'id')::uuid and p.publisher_name=v_row->>'name'
        and p.territorial_competence_id=(v_row->>'territorialScopeId')::uuid
        and p.trust_domain_id=(v_row->>'trustDomainId')::uuid)
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:publisher:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'authorities') loop
    insert into public.knowledge_authorities(
      id,publisher_id,authority_name,authority_type,jurisdiction_id,
      territorial_scope_id,official_portal_url,status,review_status
    ) values(
      (v_row->>'id')::uuid,(v_row->>'publisherId')::uuid,v_row->>'name',
      v_row->>'type',(v_row->>'jurisdictionId')::uuid,
      (v_row->>'territorialScopeId')::uuid,v_row->>'officialPortalUrl',
      'active','expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_authorities a
      where a.id=(v_row->>'id')::uuid and a.publisher_id=(v_row->>'publisherId')::uuid
        and a.authority_name=v_row->>'name' and a.authority_type=v_row->>'type'
        and a.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and a.territorial_scope_id=(v_row->>'territorialScopeId')::uuid)
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:authority:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'sources') loop
    insert into public.knowledge_sources(
      id,publisher_id,source_type,source_purpose,canonical_url,official_domain,
      official_domain_verification_status,jurisdiction_id,territorial_scope_id,
      source_language,supports_claim_types,high_risk_use_allowed,
      normalized_canonical_url,normalized_origin,source_class,evidence_eligibility,
      issuing_authority_id,authority_level,process_scope,retrieval_method,
      terms_or_license_review_status,robots_review_status,first_verified_at,last_verified_at,
      active_status,trust_status,authorization_state,default_handling_mode,
      freshness_class,stale_behavior
    ) values(
      (v_row->>'id')::uuid,(v_row->>'publisherId')::uuid,v_row->>'sourceType',
      v_row->>'purpose',v_row->>'canonicalUrl',lower(v_row->>'officialDomain'),
      'verified',(v_row->>'jurisdictionId')::uuid,(v_row->>'territorialScopeId')::uuid,
      'de',array[v_domain],false,v_row->>'canonicalUrl',lower(v_row->>'normalizedOrigin'),
      (v_row->>'sourceClass')::public.knowledge_source_class,
      'PUBLICATION_EVIDENCE_ELIGIBLE',(v_row->>'authorityId')::uuid,
      (v_row->>'authorityLevel')::public.knowledge_authority_level,array[v_domain],
      (v_row->>'retrievalMethod')::public.knowledge_retrieval_method,
      'ALLOWED','ALLOWED',now(),now(),'ACTIVE','VERIFIED','AUTHORIZED',
      (v_row->>'handlingMode')::public.knowledge_handling_mode,
      (v_row->>'freshnessClass')::public.knowledge_freshness_class,
      (v_row->>'staleBehavior')::public.knowledge_stale_behavior
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_sources s
      where s.id=(v_row->>'id')::uuid and s.publisher_id=(v_row->>'publisherId')::uuid
        and s.canonical_url=v_row->>'canonicalUrl'
        and s.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and s.territorial_scope_id=(v_row->>'territorialScopeId')::uuid
        and s.issuing_authority_id=(v_row->>'authorityId')::uuid)
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:source:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'sourceVersions') loop
    insert into public.knowledge_source_versions(
      id,source_id,version_sequence,content_hash,normalized_content_hash,
      review_status,freshness_status,change_status,immutable,historical_use_allowed,
      current_use_allowed
    ) values(
      (v_row->>'id')::uuid,(v_row->>'sourceId')::uuid,
      (v_row->>'versionSequence')::integer,v_row->>'contentHash',v_row->>'contentHash',
      'expert_reviewed','fresh','unchanged',true,true,true
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_source_versions v
      where v.id=(v_row->>'id')::uuid and v.source_id=(v_row->>'sourceId')::uuid
        and v.version_sequence=(v_row->>'versionSequence')::integer
        and v.content_hash=v_row->>'contentHash')
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:version:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'passages') loop
    insert into public.knowledge_source_passages(
      id,source_version_id,passage_order,section_identifier,text,text_hash,
      language,citation_ready,review_status
    ) values(
      (v_row->>'id')::uuid,(v_row->>'sourceVersionId')::uuid,
      (v_row->>'order')::integer,v_row->>'locator',v_row->>'text',
      v_row->>'textHash','de',true,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_source_passages p
      where p.id=(v_row->>'id')::uuid
        and p.source_version_id=(v_row->>'sourceVersionId')::uuid
        and p.passage_order=(v_row->>'order')::integer
        and p.text=v_row->>'text' and p.text_hash=v_row->>'textHash')
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:passage:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'competences') loop
    insert into public.knowledge_authority_competences(
      id,authority_id,subject_matter,territorial_scope_id,personal_scope,
      procedural_stage,receives_application,decides_application,
      provides_information_only,competence_source_version_id,
      competence_passage_id,effective_from,effective_until,review_status,conflict_status
    ) values(
      (v_row->>'id')::uuid,(v_row->>'authorityId')::uuid,v_row->>'subjectMatter',
      (v_row->>'territorialScopeId')::uuid,v_domain,v_row->>'proceduralStage',
      coalesce((v_row->>'receivesApplication')::boolean,false),
      coalesce((v_row->>'decidesApplication')::boolean,false),
      coalesce((v_row->>'providesInformationOnly')::boolean,false),
      (v_row->>'sourceVersionId')::uuid,(v_row->>'passageId')::uuid,
      nullif(v_row->>'effectiveFrom','')::timestamptz,
      nullif(v_row->>'effectiveUntil','')::timestamptz,'expert_reviewed','none'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_authority_competences c
      where c.id=(v_row->>'id')::uuid and c.authority_id=(v_row->>'authorityId')::uuid
        and c.subject_matter=v_row->>'subjectMatter'
        and c.territorial_scope_id=(v_row->>'territorialScopeId')::uuid
        and c.personal_scope=v_domain
        and c.competence_source_version_id=(v_row->>'sourceVersionId')::uuid
        and c.competence_passage_id=(v_row->>'passageId')::uuid)
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:competence:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'processBindings') loop
    insert into public.knowledge_processes(
      id,process_group_id,title,jurisdiction_id,territorial_scope_id,risk_level,
      orientation_only,trigger_description,safe_first_step,
      regional_variation_expected,full_legal_advice_excluded,review_status
    ) values(
      (v_row->>'id')::uuid,v_domain,v_row->>'title',
      (v_row->>'jurisdictionId')::uuid,(v_row->>'territorialScopeId')::uuid,
      v_row->>'riskLevel',true,v_row->>'trigger',v_row->>'safeFirstStep',
      true,true,'expert_reviewed'
    ) on conflict(id) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_processes p
      where p.id=(v_row->>'id')::uuid and p.process_group_id=v_domain
        and p.title=v_row->>'title' and p.jurisdiction_id=(v_row->>'jurisdictionId')::uuid
        and p.territorial_scope_id=(v_row->>'territorialScopeId')::uuid)
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:process:%',v_row->>'id'; end if;
  end loop;
  for v_row in select value from jsonb_array_elements(p_payload->'handlingPolicies') loop
    insert into public.knowledge_source_handling_policies(
      id,source_id,information_class,process_scope,handling_mode,freshness_class,
      stale_behavior,required_context_keys,risk_class,state_version,revalidation_due_at
    ) values(
      (v_row->>'id')::uuid,(v_row->>'sourceId')::uuid,
      (v_row->>'informationClass')::public.knowledge_information_class,v_domain,
      (v_row->>'handlingMode')::public.knowledge_handling_mode,
      (v_row->>'freshnessClass')::public.knowledge_freshness_class,
      (v_row->>'staleBehavior')::public.knowledge_stale_behavior,
      array(select jsonb_array_elements_text(coalesce(v_row->'requiredContextKeys','[]'::jsonb)))::public.knowledge_required_context_key[],
      v_row->>'riskClass',1,nullif(v_row->>'revalidationDueAt','')::timestamptz
    ) on conflict(source_id,information_class,process_scope) do nothing;
    get diagnostics v_created=row_count; v_total_created:=v_total_created+v_created;
    if not exists(select 1 from public.knowledge_source_handling_policies h
      where h.id=(v_row->>'id')::uuid and h.source_id=(v_row->>'sourceId')::uuid
        and h.information_class=(v_row->>'informationClass')::public.knowledge_information_class
        and h.process_scope=v_domain
        and h.handling_mode=(v_row->>'handlingMode')::public.knowledge_handling_mode
        and h.freshness_class=(v_row->>'freshnessClass')::public.knowledge_freshness_class
        and h.stale_behavior=(v_row->>'staleBehavior')::public.knowledge_stale_behavior)
    then raise exception 'CURATED_SERVICE_AREA_CONFLICT:handling:%',v_row->>'id'; end if;
  end loop;

  return jsonb_build_object(
    'schemaVersion',1,'packId',p_payload->>'packId','domain',v_domain,
    'municipalityCount',(select count(*) from jsonb_array_elements(p_payload->'jurisdictions') j
      where j->>'level'='de_gemeinde'),
    'authorityCount',jsonb_array_length(p_payload->'authorities'),
    'competenceCount',jsonb_array_length(p_payload->'competences'),
    'semanticCreated',v_total_created
  );
exception
  when invalid_text_representation or check_violation or foreign_key_violation
    or unique_violation or not_null_violation then
    raise exception 'CURATED_SERVICE_AREA_VALIDATION_FAILED';
end;
$$;

revoke all on function public.knowledge_ingest_curated_domain_pack(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public.knowledge_ingest_curated_service_area_pack(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_domain_pack(jsonb) is
  'Bounded reviewed Knowledge Factory domain-pack writer. No production role grant is included.';
comment on function public.knowledge_ingest_curated_service_area_pack(jsonb) is
  'Bounded reviewed multi-municipality service-area writer with shared authority and competence support. No production role grant is included.';
