-- KNOWLEDGE-FACTORY-COEXISTENCE-01 / Package 1.
--
-- Keep the existing public G3/G4 objects and their ACLs, but resolve every payload ID
-- to an existing semantic identity before the validated 041 writers run.
-- Migration 040, runtime retrieval, and retrieval metadata are intentionally
-- outside this migration.

create schema if not exists knowledge_factory_internal;
revoke all on schema knowledge_factory_internal from public;

do $$
declare
  v_definition text;
begin
  -- Copy the validated 041 bodies to inaccessible helpers. The public objects
  -- are never renamed/dropped and are replaced in place below. On a safe
  -- repeat, never copy the wrapper back over an already-saved 041 body.
  if pg_catalog.to_regprocedure(
    'knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)'
  ) is null then
    v_definition := pg_catalog.pg_get_functiondef(
      'public.knowledge_ingest_curated_domain_pack(jsonb)'::regprocedure
    );
    v_definition := pg_catalog.regexp_replace(
      v_definition,
      'FUNCTION public\.knowledge_ingest_curated_domain_pack\(',
      'FUNCTION knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(',
      'i'
    );
    execute v_definition;
  end if;
  if pg_catalog.to_regprocedure(
    'knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(jsonb)'
  ) is null then
    v_definition := pg_catalog.pg_get_functiondef(
      'public.knowledge_ingest_curated_service_area_pack(jsonb)'::regprocedure
    );
    v_definition := pg_catalog.regexp_replace(
      v_definition,
      'FUNCTION public\.knowledge_ingest_curated_service_area_pack\(',
      'FUNCTION knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(',
      'i'
    );
    execute v_definition;
  end if;
end;
$$;

revoke all on function
  knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)
  from public;
revoke all on function
  knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(jsonb)
  from public;

create or replace function knowledge_factory_internal.knowledge_factory_resolve_041_payload(
  p_payload jsonb,
  p_service_area boolean
)
returns jsonb
language plpgsql
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_payload jsonb := p_payload;
  v_map jsonb := '{}'::jsonb;
  v_rows jsonb;
  v_row jsonb;
  v_out jsonb;
  v_old text;
  v_actual uuid;
  v_parent uuid;
  v_scope uuid;
  v_trust uuid;
  v_publisher uuid;
  v_authority uuid;
  v_source uuid;
  v_version uuid;
  v_passage uuid;
  v_claim uuid;
  v_process uuid;
  v_domain text := p_payload->>'domain';
  v_jurisdiction_ids uuid[];
  v_land_codes text[];
  v_kreis_codes text[];
  v_municipality_codes text[];
begin
  -- Trust domains are globally identified by code. A different display name is
  -- deliberately left for the 041 exact-value guard to reject.
  v_old := p_payload#>>'{trustDomain,id}';
  v_actual := (
    select t.id from public.knowledge_trust_domains t
    where t.code = p_payload#>>'{trustDomain,code}'
  );
  v_actual := coalesce(v_actual, v_old::uuid);
  v_map := v_map || jsonb_build_object(v_old, v_actual);
  v_payload := jsonb_set(v_payload, '{trustDomain,id}', to_jsonb(v_actual::text));
  v_payload := jsonb_set(
    v_payload,
    '{trustDomain,name}',
    to_jsonb(coalesce(
      (select t.name from public.knowledge_trust_domains t where t.id=v_actual),
      p_payload#>>'{trustDomain,name}'
    ))
  );

  -- Resolve jurisdiction parents first, independent of payload array order.
  with recursive hierarchy as (
    select j.value, 0 as depth
    from jsonb_array_elements(p_payload->'jurisdictions') j(value)
    where nullif(j.value->>'parentJurisdictionId','') is null
    union all
    select child.value, parent.depth + 1
    from hierarchy parent
    join lateral jsonb_array_elements(p_payload->'jurisdictions') child(value)
      on child.value->>'parentJurisdictionId' = parent.value->>'id'
  )
  select coalesce(jsonb_agg(value order by depth, value->>'id'), '[]'::jsonb)
  into v_rows from hierarchy;
  if jsonb_array_length(v_rows) <> jsonb_array_length(p_payload->'jurisdictions') then
    raise exception 'KNOWLEDGE_FACTORY_042_JURISDICTION_GRAPH_INVALID';
  end if;
  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(v_rows) loop
    v_old := v_row->>'id';
    v_parent := case
      when nullif(v_row->>'parentJurisdictionId','') is null then null
      else coalesce((v_map->>(v_row->>'parentJurisdictionId'))::uuid,
                    (v_row->>'parentJurisdictionId')::uuid)
    end;
    v_actual := (
      select j.id from public.knowledge_jurisdictions j
      where j.country_code = v_row->>'countryCode'
        and j.jurisdiction_level = v_row->>'level'
        and j.jurisdiction_code = v_row->>'code'
        and j.parent_jurisdiction_id is not distinct from v_parent
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(
      v_row,
      '{name}',
      to_jsonb(coalesce(
        (select j.name from public.knowledge_jurisdictions j where j.id=v_actual),
        v_row->>'name'
      ))
    );
    if v_parent is not null then
      v_row := jsonb_set(v_row, '{parentJurisdictionId}', to_jsonb(v_parent::text));
    end if;
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{jurisdictions}', v_out);

  -- Scope identity is all defining geography, compared as sets.
  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'territorialScopes') loop
    v_old := v_row->>'id';
    select coalesce(array_agg(coalesce((v_map->>x.id)::uuid, x.id::uuid) order by
      coalesce((v_map->>x.id)::uuid, x.id::uuid)), '{}'::uuid[])
      into v_jurisdiction_ids
      from jsonb_array_elements_text(v_row->'jurisdictionIds') x(id);
    select coalesce(array_agg(x order by x), '{}'::text[]) into v_land_codes
      from jsonb_array_elements_text(coalesce(v_row->'landCodes','[]'::jsonb)) x;
    select coalesce(array_agg(x order by x), '{}'::text[]) into v_kreis_codes
      from jsonb_array_elements_text(coalesce(v_row->'kreisCodes','[]'::jsonb)) x;
    select coalesce(array_agg(x order by x), '{}'::text[]) into v_municipality_codes
      from jsonb_array_elements_text(coalesce(v_row->'municipalityCodes','[]'::jsonb)) x;
    v_actual := (
      select s.id from public.knowledge_territorial_scopes s
      where s.scope_type = v_row->>'type'
        and (select coalesce(array_agg(x order by x), '{}'::uuid[]) from unnest(s.jurisdiction_ids) x)
          = v_jurisdiction_ids
        and (select coalesce(array_agg(x order by x), '{}'::text[]) from unnest(coalesce(s.land_codes,'{}')) x)
          = v_land_codes
        and (select coalesce(array_agg(x order by x), '{}'::text[]) from unnest(coalesce(s.kreis_codes,'{}')) x)
          = v_kreis_codes
        and (select coalesce(array_agg(x order by x), '{}'::text[]) from unnest(coalesce(s.municipality_codes,'{}')) x)
          = v_municipality_codes
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{jurisdictionIds}', to_jsonb(v_jurisdiction_ids));
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{territorialScopes}', v_out);

  -- Publishers are not name-only: type, official status, exact subject,
  -- territorial competence, and trust domain are stable identity fields.
  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'publishers') loop
    v_old := v_row->>'id';
    v_scope := coalesce((v_map->>(v_row->>'territorialScopeId'))::uuid,
                        (v_row->>'territorialScopeId')::uuid);
    v_trust := coalesce((v_map->>(v_row->>'trustDomainId'))::uuid,
                        (v_row->>'trustDomainId')::uuid);
    v_actual := (
      select p.id from public.knowledge_publishers p
      where p.publisher_name = v_row->>'name'
        and p.publisher_type = v_row->>'type'
        and p.official_status
        and p.subject_matter_competence = array[v_domain]
        and p.territorial_competence_id = v_scope
        and p.trust_domain_id = v_trust
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text));
    v_row := jsonb_set(v_row, '{trustDomainId}', to_jsonb(v_trust::text));
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{publishers}', v_out);

  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'authorities') loop
    v_old := v_row->>'id';
    v_publisher := coalesce((v_map->>(v_row->>'publisherId'))::uuid,
                            (v_row->>'publisherId')::uuid);
    v_parent := coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,
                         (v_row->>'jurisdictionId')::uuid);
    v_scope := coalesce((v_map->>(v_row->>'territorialScopeId'))::uuid,
                        (v_row->>'territorialScopeId')::uuid);
    v_actual := (
      select a.id from public.knowledge_authorities a
      where a.publisher_id = v_publisher
        and a.authority_name = v_row->>'name'
        and a.authority_type = v_row->>'type'
        and a.jurisdiction_id = v_parent
        and a.territorial_scope_id = v_scope
        and a.official_portal_url is not distinct from v_row->>'officialPortalUrl'
        and a.status = 'active'
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{publisherId}', to_jsonb(v_publisher::text));
    v_row := jsonb_set(v_row, '{jurisdictionId}', to_jsonb(v_parent::text));
    v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text));
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{authorities}', v_out);

  -- Source identity is exactly the schema's partial unique key. Migration 041
  -- stores payload canonicalUrl into normalized_canonical_url.
  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'sources') loop
    v_old := v_row->>'id';
    v_publisher := coalesce((v_map->>(v_row->>'publisherId'))::uuid,
                            (v_row->>'publisherId')::uuid);
    v_authority := coalesce((v_map->>(v_row->>'authorityId'))::uuid,
                            (v_row->>'authorityId')::uuid);
    v_parent := coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,
                         (v_row->>'jurisdictionId')::uuid);
    v_scope := coalesce((v_map->>(v_row->>'territorialScopeId'))::uuid,
                        (v_row->>'territorialScopeId')::uuid);
    v_actual := (
      select s.id from public.knowledge_sources s
      where s.normalized_canonical_url = v_row->>'canonicalUrl'
    );
    if v_actual is not null and not exists (
      select 1 from public.knowledge_sources s
      where s.id=v_actual
        and s.publisher_id=v_publisher
        and s.source_type=v_row->>'sourceType'
        and s.source_purpose=v_row->>'purpose'
        and s.official_domain=lower(v_row->>'officialDomain')
        and s.jurisdiction_id=v_parent
        and s.territorial_scope_id=v_scope
        and s.issuing_authority_id=v_authority
        and s.source_class=(v_row->>'sourceClass')::public.knowledge_source_class
        and s.authority_level=(v_row->>'authorityLevel')::public.knowledge_authority_level
        and s.retrieval_method=(v_row->>'retrievalMethod')::public.knowledge_retrieval_method
        and s.default_handling_mode=(v_row->>'handlingMode')::public.knowledge_handling_mode
        and s.freshness_class=(v_row->>'freshnessClass')::public.knowledge_freshness_class
        and s.stale_behavior=(v_row->>'staleBehavior')::public.knowledge_stale_behavior
    ) then
      raise exception 'KNOWLEDGE_FACTORY_042_SOURCE_METADATA_CONFLICT';
    end if;
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{publisherId}', to_jsonb(v_publisher::text));
    v_row := jsonb_set(v_row, '{authorityId}', to_jsonb(v_authority::text));
    v_row := jsonb_set(v_row, '{jurisdictionId}', to_jsonb(v_parent::text));
    v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text));
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{sources}', v_out);

  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'sourceVersions') loop
    v_old := v_row->>'id';
    v_source := coalesce((v_map->>(v_row->>'sourceId'))::uuid,
                         (v_row->>'sourceId')::uuid);
    v_actual := (
      select v.id from public.knowledge_source_versions v
      where v.source_id = v_source
        and v.version_sequence = (v_row->>'versionSequence')::integer
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{sourceId}', to_jsonb(v_source::text));
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{sourceVersions}', v_out);

  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'passages') loop
    v_old := v_row->>'id';
    v_version := coalesce((v_map->>(v_row->>'sourceVersionId'))::uuid,
                          (v_row->>'sourceVersionId')::uuid);
    v_actual := (
      select p.id from public.knowledge_source_passages p
      where p.source_version_id = v_version
        and p.passage_order = (v_row->>'order')::integer
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{sourceVersionId}', to_jsonb(v_version::text));
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload, '{passages}', v_out);

  if p_service_area then
    -- The database's declared competence identity is authoritative.
    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'competences') loop
      v_old := v_row->>'id';
      v_authority := coalesce((v_map->>(v_row->>'authorityId'))::uuid,
                              (v_row->>'authorityId')::uuid);
      v_scope := coalesce((v_map->>(v_row->>'territorialScopeId'))::uuid,
                          (v_row->>'territorialScopeId')::uuid);
      v_version := coalesce((v_map->>(v_row->>'sourceVersionId'))::uuid,
                            (v_row->>'sourceVersionId')::uuid);
      v_passage := coalesce((v_map->>(v_row->>'passageId'))::uuid,
                            (v_row->>'passageId')::uuid);
      v_actual := (
        select c.id from public.knowledge_authority_competences c
        where c.authority_id = v_authority
          and c.subject_matter = v_row->>'subjectMatter'
          and c.territorial_scope_id = v_scope
          and c.effective_from is not distinct from nullif(v_row->>'effectiveFrom','')::timestamptz
      );
      v_actual := coalesce(v_actual, v_old::uuid);
      v_map := v_map || jsonb_build_object(v_old, v_actual);
      v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
      v_row := jsonb_set(v_row, '{authorityId}', to_jsonb(v_authority::text));
      v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text));
      v_row := jsonb_set(v_row, '{sourceVersionId}', to_jsonb(v_version::text));
      v_row := jsonb_set(v_row, '{passageId}', to_jsonb(v_passage::text));
      v_out := v_out || jsonb_build_array(v_row);
    end loop;
    v_payload := jsonb_set(v_payload, '{competences}', v_out);
  else
    -- G3 remaining classes use exact conservative keys. Any non-key mismatch is
    -- still rejected by the unchanged 041 writer after ID propagation.
    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'actorRules') loop
      v_old := v_row->>'id';
      v_parent := coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,
                           (v_row->>'jurisdictionId')::uuid);
      v_scope := nullif(coalesce(v_map->>(v_row->>'territorialScopeId'),
                                 v_row->>'territorialScopeId'),'')::uuid;
      v_actual := (
        select r.id from public.knowledge_responsible_actor_rules r
        where r.actor_state = v_row->>'actorState'
          and r.user_must_act = coalesce((v_row->>'userMustAct')::boolean,false)
          and r.german_authority_must_act = coalesce((v_row->>'authorityMustAct')::boolean,false)
          and r.jurisdiction_id is not distinct from v_parent
          and r.territorial_scope_id is not distinct from v_scope
      );
      v_actual := coalesce(v_actual, v_old::uuid);
      v_map := v_map || jsonb_build_object(v_old, v_actual);
      v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
      v_row := jsonb_set(v_row, '{jurisdictionId}', to_jsonb(v_parent::text));
      if v_scope is not null then v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text)); end if;
      v_out := v_out || jsonb_build_array(v_row);
    end loop;
    v_payload := jsonb_set(v_payload, '{actorRules}', v_out);

    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'claims') loop
      v_old := v_row->>'id';
      v_parent := coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,
                           (v_row->>'jurisdictionId')::uuid);
      v_scope := nullif(coalesce(v_map->>(v_row->>'territorialScopeId'),
                                 v_row->>'territorialScopeId'),'')::uuid;
      v_authority := nullif(coalesce(v_map->>(v_row->>'authorityId'),
                                     v_row->>'authorityId'),'')::uuid;
      v_actual := (
        select c.id from public.knowledge_claims c
        where c.claim_type = v_row->>'type'
          and c.claim_text_canonical = v_row->>'text'
          and c.claim_language = 'de' and c.market = 'DE'
          and c.jurisdiction_id = v_parent
          and c.territorial_scope_id is not distinct from v_scope
          and c.authority_id is not distinct from v_authority
          and c.risk_level = v_row->>'riskLevel'
          and c.requires_effective_date = coalesce((v_row->>'requiresEffectiveDate')::boolean,false)
          and c.requires_authority_resolution = coalesce((v_row->>'requiresAuthorityResolution')::boolean,false)
      );
      v_actual := coalesce(v_actual, v_old::uuid);
      v_map := v_map || jsonb_build_object(v_old, v_actual);
      v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
      v_row := jsonb_set(v_row, '{jurisdictionId}', to_jsonb(v_parent::text));
      if v_scope is not null then v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text)); end if;
      if v_authority is not null then v_row := jsonb_set(v_row, '{authorityId}', to_jsonb(v_authority::text)); end if;
      v_out := v_out || jsonb_build_array(v_row);
    end loop;
    v_payload := jsonb_set(v_payload, '{claims}', v_out);
  end if;

  -- Processes are strict across all fields written by 041.
  v_out := '[]'::jsonb;
  v_rows := case when p_service_area then p_payload->'processBindings' else p_payload->'processes' end;
  for v_row in select value from jsonb_array_elements(v_rows) loop
    v_old := v_row->>'id';
    v_parent := coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,
                         (v_row->>'jurisdictionId')::uuid);
    v_scope := nullif(coalesce(v_map->>(v_row->>'territorialScopeId'),
                               v_row->>'territorialScopeId'),'')::uuid;
    v_actual := (
      select p.id from public.knowledge_processes p
      where p.process_group_id = v_domain
        and p.title = v_row->>'title'
        and p.jurisdiction_id = v_parent
        and p.territorial_scope_id is not distinct from v_scope
        and p.risk_level = v_row->>'riskLevel'
        and p.trigger_description is not distinct from v_row->>'trigger'
        and p.safe_first_step is not distinct from v_row->>'safeFirstStep'
        and p.regional_variation_expected =
          case when p_service_area then true
               else coalesce((v_row->>'regionalVariationExpected')::boolean,false) end
    );
    v_actual := coalesce(v_actual, v_old::uuid);
    v_map := v_map || jsonb_build_object(v_old, v_actual);
    v_row := jsonb_set(v_row, '{id}', to_jsonb(v_actual::text));
    v_row := jsonb_set(v_row, '{jurisdictionId}', to_jsonb(v_parent::text));
    if v_scope is not null then v_row := jsonb_set(v_row, '{territorialScopeId}', to_jsonb(v_scope::text)); end if;
    v_out := v_out || jsonb_build_array(v_row);
  end loop;
  v_payload := jsonb_set(v_payload,
    (case when p_service_area then '{processBindings}' else '{processes}' end)::text[],
    v_out);

  if not p_service_area then
    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'evidenceLinks') loop
      v_old := v_row->>'id';
      v_claim := coalesce((v_map->>(v_row->>'claimId'))::uuid,(v_row->>'claimId')::uuid);
      v_version := coalesce((v_map->>(v_row->>'sourceVersionId'))::uuid,(v_row->>'sourceVersionId')::uuid);
      v_passage := coalesce((v_map->>(v_row->>'passageId'))::uuid,(v_row->>'passageId')::uuid);
      v_actual := (select e.id from public.knowledge_claim_evidence_links e
        where e.claim_id=v_claim and e.passage_id=v_passage and e.evidence_role=v_row->>'role'
          and e.source_version_id=v_version
          and e.is_primary_evidence=coalesce((v_row->>'primary')::boolean,true)
          and e.support_status='direct_support' and e.review_accepted);
      v_actual := coalesce(v_actual,v_old::uuid); v_map:=v_map||jsonb_build_object(v_old,v_actual);
      v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_actual::text));
      v_row:=jsonb_set(v_row,'{claimId}',to_jsonb(v_claim::text));
      v_row:=jsonb_set(v_row,'{sourceVersionId}',to_jsonb(v_version::text));
      v_row:=jsonb_set(v_row,'{passageId}',to_jsonb(v_passage::text));
      v_out:=v_out||jsonb_build_array(v_row);
    end loop;
    v_payload:=jsonb_set(v_payload,'{evidenceLinks}',v_out);

    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'citations') loop
      v_old:=v_row->>'id';
      v_claim:=coalesce((v_map->>(v_row->>'claimId'))::uuid,(v_row->>'claimId')::uuid);
      v_source:=coalesce((v_map->>(v_row->>'sourceId'))::uuid,(v_row->>'sourceId')::uuid);
      v_version:=coalesce((v_map->>(v_row->>'sourceVersionId'))::uuid,(v_row->>'sourceVersionId')::uuid);
      v_passage:=coalesce((v_map->>(v_row->>'passageId'))::uuid,(v_row->>'passageId')::uuid);
      v_publisher:=coalesce((v_map->>(v_row->>'publisherId'))::uuid,(v_row->>'publisherId')::uuid);
      v_parent:=coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,(v_row->>'jurisdictionId')::uuid);
      v_actual:=(select c.id from public.knowledge_citations c where c.claim_id=v_claim
        and c.source_id=v_source and c.source_version_id=v_version and c.passage_id=v_passage
        and c.publisher_id=v_publisher and c.jurisdiction_id=v_parent
        and c.user_facing_label=v_row->>'label' and c.canonical_url is not distinct from v_row->>'canonicalUrl');
      v_actual:=coalesce(v_actual,v_old::uuid); v_map:=v_map||jsonb_build_object(v_old,v_actual);
      v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_actual::text));
      v_row:=jsonb_set(v_row,'{claimId}',to_jsonb(v_claim::text));
      v_row:=jsonb_set(v_row,'{sourceId}',to_jsonb(v_source::text));
      v_row:=jsonb_set(v_row,'{sourceVersionId}',to_jsonb(v_version::text));
      v_row:=jsonb_set(v_row,'{passageId}',to_jsonb(v_passage::text));
      v_row:=jsonb_set(v_row,'{publisherId}',to_jsonb(v_publisher::text));
      v_row:=jsonb_set(v_row,'{jurisdictionId}',to_jsonb(v_parent::text));
      v_out:=v_out||jsonb_build_array(v_row);
    end loop;
    v_payload:=jsonb_set(v_payload,'{citations}',v_out);

    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'processClaimLinks') loop
      v_old:=v_row->>'id';
      v_process:=coalesce((v_map->>(v_row->>'processId'))::uuid,(v_row->>'processId')::uuid);
      v_claim:=coalesce((v_map->>(v_row->>'claimId'))::uuid,(v_row->>'claimId')::uuid);
      v_actual:=(select l.id from public.knowledge_process_claim_links l
        where l.process_id=v_process and l.process_step_id is null and l.claim_id=v_claim
          and l.claim_role=v_row->>'role'
          and l.required=coalesce((v_row->>'required')::boolean,false)
          and l.sequence_context is not distinct from v_row->>'sequenceContext'
          and l.qualification_required=coalesce((v_row->>'qualificationRequired')::boolean,false));
      v_actual:=coalesce(v_actual,v_old::uuid); v_map:=v_map||jsonb_build_object(v_old,v_actual);
      v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_actual::text));
      v_row:=jsonb_set(v_row,'{processId}',to_jsonb(v_process::text));
      v_row:=jsonb_set(v_row,'{claimId}',to_jsonb(v_claim::text));
      v_out:=v_out||jsonb_build_array(v_row);
    end loop;
    v_payload:=jsonb_set(v_payload,'{processClaimLinks}',v_out);

    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'forms') loop
      v_old:=v_row->>'id';
      v_authority:=coalesce((v_map->>(v_row->>'authorityId'))::uuid,(v_row->>'authorityId')::uuid);
      v_parent:=coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,(v_row->>'jurisdictionId')::uuid);
      v_scope:=nullif(coalesce(v_map->>(v_row->>'territorialScopeId'),v_row->>'territorialScopeId'),'')::uuid;
      v_version:=coalesce((v_map->>(v_row->>'sourceVersionId'))::uuid,(v_row->>'sourceVersionId')::uuid);
      v_passage:=nullif(coalesce(v_map->>(v_row->>'passageId'),v_row->>'passageId'),'')::uuid;
      v_actual:=(select f.id from public.knowledge_forms f where f.form_name=v_row->>'name'
        and f.form_identifier is not distinct from v_row->>'identifier' and f.authority_id=v_authority
        and f.jurisdiction_id=v_parent and f.territorial_scope_id is not distinct from v_scope
        and f.source_version_id=v_version and f.instructions_passage_id is not distinct from v_passage
        and f.purpose=v_row->>'purpose'
        and (select coalesce(array_agg(x order by x),'{}'::text[]) from unnest(f.submission_channels) x)
          = (select coalesce(array_agg(x order by x),'{}'::text[])
             from jsonb_array_elements_text(coalesce(v_row->'submissionChannels','[]'::jsonb)) x));
      v_actual:=coalesce(v_actual,v_old::uuid); v_map:=v_map||jsonb_build_object(v_old,v_actual);
      v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_actual::text));
      v_row:=jsonb_set(v_row,'{authorityId}',to_jsonb(v_authority::text));
      v_row:=jsonb_set(v_row,'{jurisdictionId}',to_jsonb(v_parent::text));
      v_row:=jsonb_set(v_row,'{sourceVersionId}',to_jsonb(v_version::text));
      if v_scope is not null then v_row:=jsonb_set(v_row,'{territorialScopeId}',to_jsonb(v_scope::text)); end if;
      if v_passage is not null then v_row:=jsonb_set(v_row,'{passageId}',to_jsonb(v_passage::text)); end if;
      v_out:=v_out||jsonb_build_array(v_row);
    end loop;
    v_payload:=jsonb_set(v_payload,'{forms}',v_out);

    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'fees') loop
      v_old:=v_row->>'id';
      v_parent:=coalesce((v_map->>(v_row->>'jurisdictionId'))::uuid,(v_row->>'jurisdictionId')::uuid);
      v_scope:=nullif(coalesce(v_map->>(v_row->>'territorialScopeId'),v_row->>'territorialScopeId'),'')::uuid;
      v_authority:=nullif(coalesce(v_map->>(v_row->>'authorityId'),v_row->>'authorityId'),'')::uuid;
      v_version:=coalesce((v_map->>(v_row->>'sourceVersionId'))::uuid,(v_row->>'sourceVersionId')::uuid);
      v_passage:=coalesce((v_map->>(v_row->>'passageId'))::uuid,(v_row->>'passageId')::uuid);
      v_actual:=(select f.id from public.knowledge_fee_rules f where f.fee_status=v_row->>'status'
        and f.amount is not distinct from nullif(v_row->>'amount','')::numeric
        and f.currency is not distinct from v_row->>'currency'
        and f.amount_type is not distinct from v_row->>'amountType'
        and f.condition is not distinct from v_row->>'condition'
        and f.jurisdiction_id=v_parent and f.territorial_scope_id is not distinct from v_scope
        and f.authority_id is not distinct from v_authority
        and f.source_version_id=v_version and f.passage_id=v_passage);
      v_actual:=coalesce(v_actual,v_old::uuid); v_map:=v_map||jsonb_build_object(v_old,v_actual);
      v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_actual::text));
      v_row:=jsonb_set(v_row,'{jurisdictionId}',to_jsonb(v_parent::text));
      v_row:=jsonb_set(v_row,'{sourceVersionId}',to_jsonb(v_version::text));
      v_row:=jsonb_set(v_row,'{passageId}',to_jsonb(v_passage::text));
      if v_scope is not null then v_row:=jsonb_set(v_row,'{territorialScopeId}',to_jsonb(v_scope::text)); end if;
      if v_authority is not null then v_row:=jsonb_set(v_row,'{authorityId}',to_jsonb(v_authority::text)); end if;
      v_out:=v_out||jsonb_build_array(v_row);
    end loop;
    v_payload:=jsonb_set(v_payload,'{fees}',v_out);
  end if;

  -- The schema unique key is the policy identity.
  v_out := '[]'::jsonb;
  for v_row in select value from jsonb_array_elements(p_payload->'handlingPolicies') loop
    v_old:=v_row->>'id';
    v_source:=coalesce((v_map->>(v_row->>'sourceId'))::uuid,(v_row->>'sourceId')::uuid);
    v_actual:=(select h.id from public.knowledge_source_handling_policies h
      where h.source_id=v_source
        and h.information_class=(v_row->>'informationClass')::public.knowledge_information_class
        and h.process_scope=v_domain);
    v_actual:=coalesce(v_actual,v_old::uuid); v_map:=v_map||jsonb_build_object(v_old,v_actual);
    v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_actual::text));
    v_row:=jsonb_set(v_row,'{sourceId}',to_jsonb(v_source::text));
    v_out:=v_out||jsonb_build_array(v_row);
  end loop;
  v_payload:=jsonb_set(v_payload,'{handlingPolicies}',v_out);

  if not p_service_area then
    v_out := '[]'::jsonb;
    for v_row in select value from jsonb_array_elements(p_payload->'freshnessRecords') loop
      v_old:=v_row->>'id';
      v_actual:=coalesce((v_map->>(v_row->>'entityId'))::uuid,(v_row->>'entityId')::uuid);
      v_row:=jsonb_set(v_row,'{entityId}',to_jsonb(v_actual::text));
      -- Append-oriented governance has no schema unique key; exact entity/status
      -- identity avoids manufacturing repeated records on pack replay.
      v_source:=(select f.id from public.knowledge_freshness_records f
        where f.entity_type=v_row->>'entityType' and f.entity_id=v_actual
          and f.freshness_status=v_row->>'status'
          and f.effective_date_known=coalesce((v_row->>'effectiveDateKnown')::boolean,false));
      v_source:=coalesce(v_source,v_old::uuid);
      v_map:=v_map||jsonb_build_object(v_old,v_source);
      v_row:=jsonb_set(v_row,'{id}',to_jsonb(v_source::text));
      v_out:=v_out||jsonb_build_array(v_row);
    end loop;
    v_payload:=jsonb_set(v_payload,'{freshnessRecords}',v_out);
  end if;

  return v_payload;
exception
  when cardinality_violation then
    raise exception 'KNOWLEDGE_FACTORY_042_AMBIGUOUS_SEMANTIC_IDENTITY';
end;
$$;

create or replace function public.knowledge_ingest_curated_domain_pack(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(
    knowledge_factory_internal.knowledge_factory_resolve_041_payload(p_payload, false)
  );
end;
$$;

create or replace function public.knowledge_ingest_curated_service_area_pack(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(
    knowledge_factory_internal.knowledge_factory_resolve_041_payload(p_payload, true)
  );
end;
$$;

revoke all on function
  knowledge_factory_internal.knowledge_factory_resolve_041_payload(jsonb,boolean)
  from public;

comment on function public.knowledge_ingest_curated_domain_pack(jsonb) is
  'Bounded reviewed Knowledge Factory domain-pack writer with semantic coexistence and actual-ID propagation. Existing grants preserved.';
comment on function public.knowledge_ingest_curated_service_area_pack(jsonb) is
  'Bounded reviewed service-area writer with semantic coexistence and actual-ID propagation. Existing grants preserved.';
