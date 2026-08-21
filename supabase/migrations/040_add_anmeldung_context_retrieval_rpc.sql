-- Adjacent first-pack retrieval boundary. Composes federal evidence packets
-- from knowledge_retrieve_evidence_packets with verified local Anmeldung
-- context. Does not replace or mutate migration 038.

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
    jsonb_agg(to_jsonb(packet) order by packet.claim_id, packet.source_id, packet.source_passage_id),
    '[]'::jsonb
  )
  into v_federal
  from public.knowledge_retrieve_evidence_packets(p_claim_ids, array['DE']::text[]) as packet;

  if p_municipality_code is null then
    return jsonb_build_object(
      'packId', 'anmeldung_ummeldung_abmeldung',
      'family', 'residence_registration_lifecycle',
      'countryCode', 'DE',
      'federalEvidence', v_federal,
      'localContext', null
    );
  end if;

  select count(*)
  into v_locality_count
  from public.knowledge_jurisdictions j
  where j.jurisdiction_level = 'de_gemeinde'
    and j.jurisdiction_code = p_municipality_code
    and j.country_code = 'DE'
    and j.status = 'active';
  if v_locality_count = 0 then
    raise exception 'CURATED_RETRIEVAL_UNKNOWN_LOCALITY';
  end if;
  if v_locality_count > 1 then
    raise exception 'CURATED_RETRIEVAL_AMBIGUOUS_LOCALITY';
  end if;
  select j.id
  into strict v_locality_id
  from public.knowledge_jurisdictions j
  where j.jurisdiction_level = 'de_gemeinde'
    and j.jurisdiction_code = p_municipality_code
    and j.country_code = 'DE'
    and j.status = 'active';

  select ts.id
  into v_scope_id
  from public.knowledge_territorial_scopes ts
  where ts.scope_type = 'municipality'
    and ts.municipality_codes = array[p_municipality_code]
  order by ts.id
  limit 1;
  if v_scope_id is null then
    raise exception 'CURATED_RETRIEVAL_UNKNOWN_LOCALITY';
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
    and a.jurisdiction_id = v_locality_id
    and a.territorial_scope_id = v_scope_id
  order by a.authority_name, c.subject_matter, c.id
  limit 1;

  select p.id
  into v_process_id
  from public.knowledge_processes p
  where p.jurisdiction_id = v_locality_id
    and p.territorial_scope_id = v_scope_id
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
    'authority', case when v_authority_id is null then null else jsonb_build_object(
      'id', auth.id,
      'name', auth.authority_name,
      'type', auth.authority_type,
      'officialPortalUrl', auth.official_portal_url
    ) end,
    'competence', case when v_competence_id is null then null else jsonb_build_object(
      'id', comp.id,
      'subjectMatter', comp.subject_matter,
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
    'process', case when v_process_id is null then null else jsonb_build_object(
      'id', proc.id,
      'title', proc.title,
      'regionalVariationExpected', proc.regional_variation_expected
    ) end,
    -- stale_behavior is the policy once a due date has been reached, not a
    -- current-use flag. 038 treats revalidation_due_at null/future as currently
    -- usable even when stale_behavior is REVALIDATE_BEFORE_USE.
    'evidence', coalesce((
      select jsonb_agg(item order by item->>'informationClass', item->>'canonicalUrl', item->>'sourcePassageId')
      from (
        select jsonb_build_object(
          'informationClass', hp.information_class,
          'handlingMode', hp.handling_mode,
          'freshnessClass', hp.freshness_class,
          'staleBehavior', hp.stale_behavior,
          'canonicalValueUsable', usability.handling_usable and not usability.requires_revalidation,
          'requiresLiveFetch', hp.handling_mode = 'FETCH_LIVE',
          'requiresRevalidation', usability.requires_revalidation,
          'answerReady', usability.handling_usable
            and not usability.requires_revalidation
            and hp.handling_mode not in (
              'FETCH_LIVE','MANUAL_REVIEW_REQUIRED','DO_NOT_ANSWER_WITHOUT_CONTEXT'
            ),
          'usabilityState', case
            when hp.handling_mode = 'FETCH_LIVE' then 'REQUIRES_LIVE_FETCH'
            when hp.handling_mode = 'MANUAL_REVIEW_REQUIRED' then 'MANUAL_REVIEW_REQUIRED'
            when hp.handling_mode = 'DO_NOT_ANSWER_WITHOUT_CONTEXT' then 'DO_NOT_ANSWER_WITHOUT_CONTEXT'
            when usability.requires_revalidation then 'REVALIDATE_BEFORE_USE'
            when hp.handling_mode = 'STORE_CANONICALLY' then 'ANSWER_READY'
            when hp.handling_mode = 'CACHE_AND_REVALIDATE' and usability.handling_usable
              then 'CACHE_AND_REVALIDATE'
            else 'REVALIDATE_BEFORE_USE'
          end,
          'sourceId', s.id,
          'sourceVersionId', sv.id,
          'sourcePassageId', sp.id,
          'publisherId', pub.id,
          'publisherName', pub.publisher_name,
          'issuingAuthorityId', s.issuing_authority_id,
          'canonicalUrl', s.canonical_url,
          'locator', sp.section_identifier,
          'passageText', sp.text,
          'jurisdictionId', s.jurisdiction_id,
          'territorialScopeId', s.territorial_scope_id
        ) as item
        from public.knowledge_source_handling_policies hp
        cross join lateral (
          select
            (
              hp.revalidation_due_at is not null
              and hp.revalidation_due_at <= statement_timestamp()
              and hp.stale_behavior = 'REVALIDATE_BEFORE_USE'
            ) as requires_revalidation,
            (
              hp.handling_mode = 'STORE_CANONICALLY'
              or (
                hp.handling_mode = 'CACHE_AND_REVALIDATE'
                and (
                  hp.revalidation_due_at is null
                  or hp.revalidation_due_at > statement_timestamp()
                )
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
          and s.jurisdiction_id = v_locality_id
          and s.territorial_scope_id = v_scope_id
          and s.authorization_state = 'AUTHORIZED'
          and s.active_status = 'ACTIVE'
          and s.trust_status = 'VERIFIED'
          and s.evidence_eligibility = 'PUBLICATION_EVIDENCE_ELIGIBLE'
          and (v_authority_id is null or s.issuing_authority_id = v_authority_id)
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
  left join public.knowledge_jurisdictions parent on parent.id = loc.parent_jurisdiction_id
  left join public.knowledge_jurisdictions grandparent on grandparent.id = parent.parent_jurisdiction_id
  left join public.knowledge_jurisdictions district on district.id = case
    when parent.jurisdiction_level = 'de_kreis' then parent.id
    else null
  end
  left join public.knowledge_jurisdictions land on land.id = case
    when parent.jurisdiction_level = 'de_land' then parent.id
    when grandparent.jurisdiction_level = 'de_land' then grandparent.id
    else null
  end
  left join public.knowledge_authorities auth on auth.id = v_authority_id
  left join public.knowledge_authority_competences comp on comp.id = v_competence_id
  left join public.knowledge_source_versions cver on cver.id = comp.competence_source_version_id
  left join public.knowledge_sources csrc on csrc.id = cver.source_id
  left join public.knowledge_source_passages cpass on cpass.id = comp.competence_passage_id
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

revoke all on function public.knowledge_retrieve_anmeldung_context(uuid[], text)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_retrieve_anmeldung_context(uuid[], text) is
  'First-pack Anmeldung federal+local evidence retrieval. Municipality code is exact AGS/jurisdiction_code; locale is not an input. EXECUTE is granted only to birello_knowledge_reader.';
