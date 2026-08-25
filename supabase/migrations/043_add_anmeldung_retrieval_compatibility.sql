-- ANMELDUNG-RETRIEVAL-COMPATIBILITY-01 / Package 2.
--
-- Preserve the existing public RPC objects while closing the bounded
-- Knowledge Factory retrieval and Anmeldung service-area compatibility gaps.

create or replace function public.knowledge_ingest_curated_domain_pack(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_resolved jsonb;
  v_result jsonb;
  v_claim jsonb;
  v_claim_id uuid;
  v_digest text;
  v_metadata_id uuid;
begin
  v_resolved :=
    knowledge_factory_internal.knowledge_factory_resolve_041_payload(p_payload, false);
  v_result :=
    knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(v_resolved);

  -- 041 predates retrieval metadata. Add only missing rows, using the actual
  -- resolved claim identity and a deterministic UUIDv3-shaped identifier.
  -- Existing legacy metadata is deliberately neither updated nor validated.
  for v_claim in
    select value from jsonb_array_elements(v_resolved->'claims')
  loop
    v_claim_id := (v_claim->>'id')::uuid;
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
  end loop;

  return v_result;
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
  v_resolved jsonb;
  v_result jsonb;
  v_competence jsonb;
begin
  v_resolved :=
    knowledge_factory_internal.knowledge_factory_resolve_041_payload(p_payload, true);

  if v_resolved->>'domain' = 'anmeldung_ummeldung_abmeldung' then
    -- The saved 041 implementation requires domain-valued personal_scope on
    -- replay. Normalize matching Anmeldung rows only within this transaction,
    -- run 041, then expose the established family value.
    update public.knowledge_authority_competences c
       set personal_scope = 'anmeldung_ummeldung_abmeldung'
      from jsonb_array_elements(v_resolved->'competences') item(value)
     where c.id = (item.value->>'id')::uuid
       and item.value->>'subjectMatter' =
         'residence_registration_lifecycle'
       and c.personal_scope = 'residence_registration_lifecycle';
  end if;

  v_result :=
    knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(v_resolved);

  if v_resolved->>'domain' = 'anmeldung_ummeldung_abmeldung' then
    for v_competence in
      select value from jsonb_array_elements(v_resolved->'competences')
    loop
      update public.knowledge_authority_competences
         set personal_scope = 'residence_registration_lifecycle'
       where id = (v_competence->>'id')::uuid
         and v_competence->>'subjectMatter' =
           'residence_registration_lifecycle'
         and personal_scope = 'anmeldung_ummeldung_abmeldung';
    end loop;
  end if;

  return v_result;
end;
$$;

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
       select 1 from unnest(p_jurisdiction_codes) requested_jurisdiction(code)
       where requested_jurisdiction.code !~ '^[A-Z]{2}(?:-[A-Z0-9_]{1,32})?$'
     ) then
    raise exception 'CURATED_RETRIEVAL_INVALID_REQUEST';
  end if;

  return query
  select
    c.id, c.claim_text_canonical, c.claim_language, j.jurisdiction_code,
    ts.scope_type, hp.handling_mode,
    hp.handling_mode = 'STORE_CANONICALLY'
      or (
        hp.handling_mode = 'CACHE_AND_REVALIDATE'
        and (hp.revalidation_due_at is null
          or hp.revalidation_due_at > statement_timestamp())
      ),
    hp.stale_behavior, hp.required_context_keys, hp.revalidation_due_at,
    s.id, sv.id, sp.id, sp.section_identifier, cit.internal_audit_label,
    rm.full_text_indexed, rm.vector_indexed, rm.indexed_at,
    rm.effective_date_filter_required, rm.stale_policy_filter_required
  from public.knowledge_claims c
  join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
  left join public.knowledge_territorial_scopes ts
    on ts.id = c.territorial_scope_id
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
  join lateral (
    select candidate.*
    from public.knowledge_source_handling_policies candidate
    where candidate.source_id = s.id
      and (
        (
          candidate.process_scope = 'anmeldung_ummeldung_abmeldung'
          and candidate.information_class = case
            when c.claim_type = 'deadline'
              then 'DEADLINE'::public.knowledge_information_class
            when c.claim_type = 'sanction'
              then 'SANCTION'::public.knowledge_information_class
            when c.claim_type = 'procedure'
              then 'REQUIRED_EVIDENCE'::public.knowledge_information_class
            else 'LEGAL_BASELINE'::public.knowledge_information_class
          end
        )
        or (
          candidate.process_scope = any(coalesce(s.process_scope, '{}'::text[]))
          and (
            select count(*)
            from public.knowledge_source_handling_policies bounded
            where bounded.source_id = s.id
              and bounded.process_scope =
                any(coalesce(s.process_scope, '{}'::text[]))
          ) = 1
        )
      )
    order by (
      candidate.process_scope = 'anmeldung_ummeldung_abmeldung'
      and candidate.information_class = case
        when c.claim_type = 'deadline'
          then 'DEADLINE'::public.knowledge_information_class
        when c.claim_type = 'sanction'
          then 'SANCTION'::public.knowledge_information_class
        when c.claim_type = 'procedure'
          then 'REQUIRED_EVIDENCE'::public.knowledge_information_class
        else 'LEGAL_BASELINE'::public.knowledge_information_class
      end
    ) desc
    limit 1
  ) hp on true
  join public.knowledge_retrieval_metadata rm on rm.entity_type = 'claim'
    and rm.entity_id = c.id
  where not exists (
    select 1 from public.knowledge_conflicts conflict
    where c.id = any(conflict.entity_ids)
      and conflict.status in ('open', 'blocked')
      and conflict.blocks_high_risk_use
  )
    and not exists (
      select 1 from public.knowledge_publication_states publication
      where publication.entity_type = 'claim'
        and publication.entity_id = c.id
        and (
          publication.current_state <> 'published'
          or publication.emergency_disabled
          or (publication.effective_from is not null
            and publication.effective_from > statement_timestamp())
          or (publication.effective_until is not null
            and publication.effective_until < statement_timestamp())
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
    and (s.revalidation_due_at is null
      or s.revalidation_due_at > statement_timestamp())
    and (
      hp.stale_behavior = 'ALLOW_WITH_STALE_WARNING'
      or hp.revalidation_due_at is null
      or hp.revalidation_due_at > statement_timestamp()
    );
end;
$$;

create or replace function public.knowledge_retrieve_anmeldung_context(
  p_claim_ids uuid[],
  p_municipality_code text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
#variable_conflict error
declare
  v_federal jsonb;
  v_locality_id uuid;
  v_locality_count integer;
  v_scope_id uuid;
  v_scope_count integer;
  v_authority_id uuid;
  v_competence_id uuid;
  v_process_id uuid;
  v_local jsonb;
  v_allowed_classes constant public.knowledge_information_class[] := array[
    'AUTHORITY_COMPETENCE','CONTACT_DETAILS','LOCAL_PROCESS_VARIANT',
    'ONLINE_SERVICE_URL','FORM_URL','OPENING_HOURS'
  ]::public.knowledge_information_class[];
begin
  if cardinality(p_claim_ids) is null
     or cardinality(p_claim_ids) not between 1 and 50 then
    raise exception 'CURATED_RETRIEVAL_INVALID_REQUEST';
  end if;
  if p_municipality_code is not null
     and p_municipality_code !~ '^[A-Z0-9-]{2,32}$' then
    raise exception 'CURATED_RETRIEVAL_INVALID_REQUEST';
  end if;

  select coalesce(
    jsonb_agg(to_jsonb(packet)
      order by packet.claim_id, packet.source_id, packet.source_passage_id),
    '[]'::jsonb
  )
  into v_federal
  from public.knowledge_retrieve_evidence_packets(
    p_claim_ids, array['DE']::text[]
  ) packet;

  if p_municipality_code is null then
    return jsonb_build_object(
      'packId', 'anmeldung_ummeldung_abmeldung',
      'family', 'residence_registration_lifecycle',
      'countryCode', 'DE',
      'federalEvidence', v_federal,
      'localContext', null
    );
  end if;

  select count(*), (array_agg(j.id order by j.id))[1]
    into v_locality_count, v_locality_id
    from public.knowledge_jurisdictions j
   where j.jurisdiction_level = 'de_gemeinde'
     and j.jurisdiction_code = p_municipality_code
     and j.country_code = 'DE'
     and j.status = 'active';
  if v_locality_count = 0 then
    raise exception 'CURATED_RETRIEVAL_UNKNOWN_LOCALITY';
  elsif v_locality_count > 1 then
    raise exception 'CURATED_RETRIEVAL_AMBIGUOUS_LOCALITY';
  end if;

  select count(*), (array_agg(ts.id order by ts.id))[1]
    into v_scope_count, v_scope_id
    from public.knowledge_territorial_scopes ts
   where ts.scope_type = 'municipality'
     and ts.municipality_codes = array[p_municipality_code];
  if v_scope_count > 1 then
    raise exception 'CURATED_RETRIEVAL_AMBIGUOUS_LOCALITY';
  elsif v_scope_count = 0 then
    select count(*), (array_agg(ts.id order by ts.id))[1]
      into v_scope_count, v_scope_id
      from public.knowledge_territorial_scopes ts
     where ts.scope_type = 'service_area'
       and p_municipality_code = any(ts.municipality_codes);
    if v_scope_count = 0 then
      raise exception 'CURATED_RETRIEVAL_UNKNOWN_LOCALITY';
    elsif v_scope_count > 1 then
      raise exception 'CURATED_RETRIEVAL_AMBIGUOUS_LOCALITY';
    end if;
  end if;

  select c.id, c.authority_id
    into v_competence_id, v_authority_id
    from public.knowledge_authority_competences c
    join public.knowledge_authorities a on a.id = c.authority_id
   where c.territorial_scope_id = v_scope_id
     and c.personal_scope = 'residence_registration_lifecycle'
     and (c.effective_from is null or c.effective_from <= statement_timestamp())
     and (c.effective_until is null or c.effective_until >= statement_timestamp())
     and a.status = 'active'
     and a.territorial_scope_id = v_scope_id
   order by a.authority_name, c.subject_matter, c.id
   limit 1;

  select p.id
    into v_process_id
    from public.knowledge_processes p
   where p.territorial_scope_id = v_scope_id
     and p.process_group_id = 'anmeldung_ummeldung_abmeldung'
   order by p.id
   limit 1;

  select jsonb_build_object(
    'locality', jsonb_build_object(
      'municipalityCode', loc.jurisdiction_code,
      'municipalityName', loc.name,
      'jurisdictionId', loc.id,
      'landCode', land.jurisdiction_code,
      'landName', land.name,
      'districtCode', district.jurisdiction_code,
      'districtName', district.name,
      'territorialScopeId', v_scope_id
    ),
    'authority', case when v_authority_id is null then null
      else jsonb_build_object(
        'id', auth.id, 'name', auth.authority_name,
        'type', auth.authority_type,
        'officialPortalUrl', auth.official_portal_url
      ) end,
    'competence', case when v_competence_id is null then null
      else jsonb_build_object(
        'id', comp.id, 'subjectMatter', comp.subject_matter,
        'family', comp.personal_scope,
        'territorialScopeId', comp.territorial_scope_id,
        'receivesApplication', comp.receives_application,
        'decidesApplication', comp.decides_application,
        'effectiveFrom', comp.effective_from,
        'effectiveUntil', comp.effective_until,
        'sourceVersionId', comp.competence_source_version_id,
        'passageId', comp.competence_passage_id,
        'locator', cpass.section_identifier,
        'canonicalUrl', csrc.canonical_url
      ) end,
    'process', case when v_process_id is null then null
      else jsonb_build_object(
        'id', proc.id, 'title', proc.title,
        'regionalVariationExpected', proc.regional_variation_expected
      ) end,
    'evidence', coalesce((
      select jsonb_agg(item
        order by item->>'informationClass', item->>'canonicalUrl',
          item->>'sourcePassageId')
      from (
        select jsonb_build_object(
          'informationClass', hp.information_class,
          'handlingMode', hp.handling_mode,
          'freshnessClass', hp.freshness_class,
          'staleBehavior', hp.stale_behavior,
          'canonicalValueUsable',
            usability.handling_usable and not usability.requires_revalidation,
          'requiresLiveFetch', hp.handling_mode = 'FETCH_LIVE',
          'requiresRevalidation', usability.requires_revalidation,
          'answerReady', usability.handling_usable
            and not usability.requires_revalidation
            and hp.handling_mode not in (
              'FETCH_LIVE','MANUAL_REVIEW_REQUIRED','DO_NOT_ANSWER_WITHOUT_CONTEXT'
            ),
          'usabilityState', case
            when hp.handling_mode = 'FETCH_LIVE' then 'REQUIRES_LIVE_FETCH'
            when hp.handling_mode = 'MANUAL_REVIEW_REQUIRED'
              then 'MANUAL_REVIEW_REQUIRED'
            when hp.handling_mode = 'DO_NOT_ANSWER_WITHOUT_CONTEXT'
              then 'DO_NOT_ANSWER_WITHOUT_CONTEXT'
            when usability.requires_revalidation then 'REVALIDATE_BEFORE_USE'
            when hp.handling_mode = 'STORE_CANONICALLY' then 'ANSWER_READY'
            when hp.handling_mode = 'CACHE_AND_REVALIDATE'
              and usability.handling_usable then 'CACHE_AND_REVALIDATE'
            else 'REVALIDATE_BEFORE_USE'
          end,
          'sourceId', s.id, 'sourceVersionId', sv.id,
          'sourcePassageId', sp.id, 'publisherId', pub.id,
          'publisherName', pub.publisher_name,
          'issuingAuthorityId', s.issuing_authority_id,
          'canonicalUrl', s.canonical_url,
          'locator', sp.section_identifier, 'passageText', sp.text,
          'jurisdictionId', s.jurisdiction_id,
          'territorialScopeId', s.territorial_scope_id
        ) item
        from public.knowledge_source_handling_policies hp
        cross join lateral (
          select
            hp.revalidation_due_at is not null
              and hp.revalidation_due_at <= statement_timestamp()
              and hp.stale_behavior = 'REVALIDATE_BEFORE_USE'
              as requires_revalidation,
            hp.handling_mode = 'STORE_CANONICALLY'
              or (
                hp.handling_mode = 'CACHE_AND_REVALIDATE'
                and (
                  hp.revalidation_due_at is null
                  or hp.revalidation_due_at > statement_timestamp()
                )
              ) as handling_usable
        ) usability
        join public.knowledge_sources s on s.id = hp.source_id
        join public.knowledge_publishers pub on pub.id = s.publisher_id
        join public.knowledge_source_versions sv on sv.source_id = s.id
          and sv.current_use_allowed
          and sv.superseded_by_version_id is null
          and sv.review_status = 'expert_reviewed'
        join public.knowledge_source_passages sp on sp.source_version_id = sv.id
          and sp.citation_ready
          and sp.review_status = 'expert_reviewed'
        where hp.process_scope = 'anmeldung_ummeldung_abmeldung'
          and hp.information_class = any(v_allowed_classes)
          and s.territorial_scope_id = v_scope_id
          and s.authorization_state = 'AUTHORIZED'
          and s.active_status = 'ACTIVE'
          and s.trust_status = 'VERIFIED'
          and s.evidence_eligibility = 'PUBLICATION_EVIDENCE_ELIGIBLE'
          and (
            v_authority_id is null
            or s.issuing_authority_id = v_authority_id
          )
          and sp.passage_order = (
            select min(p2.passage_order)
            from public.knowledge_source_passages p2
            where p2.source_version_id = sv.id
              and p2.citation_ready
              and p2.review_status = 'expert_reviewed'
          )
      ) evidence_items
    ), '[]'::jsonb)
  )
  into v_local
  from public.knowledge_jurisdictions loc
  left join public.knowledge_jurisdictions parent
    on parent.id = loc.parent_jurisdiction_id
  left join public.knowledge_jurisdictions grandparent
    on grandparent.id = parent.parent_jurisdiction_id
  left join public.knowledge_jurisdictions district on district.id = case
    when parent.jurisdiction_level = 'de_kreis' then parent.id else null end
  left join public.knowledge_jurisdictions land on land.id = case
    when parent.jurisdiction_level = 'de_land' then parent.id
    when grandparent.jurisdiction_level = 'de_land' then grandparent.id
    else null end
  left join public.knowledge_authorities auth on auth.id = v_authority_id
  left join public.knowledge_authority_competences comp
    on comp.id = v_competence_id
  left join public.knowledge_source_versions cver
    on cver.id = comp.competence_source_version_id
  left join public.knowledge_sources csrc on csrc.id = cver.source_id
  left join public.knowledge_source_passages cpass
    on cpass.id = comp.competence_passage_id
  left join public.knowledge_processes proc on proc.id = v_process_id
  where loc.id = v_locality_id;

  return jsonb_build_object(
    'packId', 'anmeldung_ummeldung_abmeldung',
    'family', 'residence_registration_lifecycle',
    'countryCode', 'DE',
    'federalEvidence', v_federal,
    'localContext', v_local
  );
end;
$$;

comment on function public.knowledge_ingest_curated_domain_pack(jsonb) is
  'Bounded reviewed Knowledge Factory domain-pack writer with semantic coexistence, actual-ID propagation, and safe claim retrieval metadata. Existing grants preserved.';
comment on function public.knowledge_ingest_curated_service_area_pack(jsonb) is
  'Bounded reviewed service-area writer with semantic coexistence, actual-ID propagation, and Anmeldung family compatibility. Existing grants preserved.';
comment on function public.knowledge_retrieve_evidence_packets(uuid[], text[]) is
  'Server-side curated evidence retrieval boundary with preferred legacy policy mapping and bounded unambiguous generalized-policy compatibility.';
comment on function public.knowledge_retrieve_anmeldung_context(uuid[], text) is
  'Anmeldung federal plus exact municipality/service-area context retrieval; municipality code is exact AGS and service-area ambiguity fails closed.';
