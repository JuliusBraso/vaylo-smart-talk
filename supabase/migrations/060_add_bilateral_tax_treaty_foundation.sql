-- CB-TAX-0B: dedicated bilateral tax-treaty foundation.
-- Additive only. Does not modify 051–059 social-security writers or tables.
-- Does not reuse knowledge_cross_border_connectors.
-- Does not insert substantive Article 4/14/15/23 knowledge.
-- Does not activate a corridor, public runtime, or tax calculator.
-- No production role grants.

-- Smallest safe trust-domain extension. Existing eu/de/sk/cz/pl/hu remain intact.
alter table public.knowledge_trust_domains
  drop constraint if exists knowledge_trust_domains_code_check;

alter table public.knowledge_trust_domains
  add constraint knowledge_trust_domains_code_check
  check (code in ('eu', 'de', 'sk', 'cz', 'pl', 'hu', 'bilateral_tax_treaty'));

create table if not exists public.knowledge_bilateral_tax_treaties (
  id uuid primary key default gen_random_uuid(),
  treaty_key text not null unique,
  country_a text not null check (country_a ~ '^[A-Z]{2}$'),
  country_b text not null check (country_b ~ '^[A-Z]{2}$'),
  canonical_language text not null default 'de' check (canonical_language = 'de'),
  topic_family text not null check (topic_family = 'TAX_TREATY'),
  lifecycle_state text not null default 'draft' check (lifecycle_state in (
    'draft', 'review', 'approved', 'publication_eligible', 'published',
    'suspended', 'superseded', 'withdrawn'
  )),
  active boolean not null default false check (active = false),
  public_runtime_allowed boolean not null default false check (public_runtime_allowed = false),
  trust_domain_id uuid not null references public.knowledge_trust_domains (id) on delete restrict,
  jurisdiction_id uuid not null references public.knowledge_jurisdictions (id) on delete restrict,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_bilateral_tax_treaties_direction_neutral
    check (country_a < country_b),
  constraint knowledge_bilateral_tax_treaties_authorized_pair
    check (treaty_key = 'DE-SK' and country_a = 'DE' and country_b = 'SK'),
  constraint knowledge_bilateral_tax_treaties_pair_unique unique (country_a, country_b)
);

create index if not exists knowledge_bilateral_tax_treaties_trust_idx
  on public.knowledge_bilateral_tax_treaties (trust_domain_id);
create index if not exists knowledge_bilateral_tax_treaties_jurisdiction_idx
  on public.knowledge_bilateral_tax_treaties (jurisdiction_id);

create table if not exists public.knowledge_bilateral_tax_treaty_versions (
  id uuid primary key default gen_random_uuid(),
  treaty_id uuid not null references public.knowledge_bilateral_tax_treaties (id) on delete restrict,
  temporal_version text not null,
  effective_from date not null,
  effective_to date,
  base_treaty_date date not null,
  mli_modified boolean not null default false,
  mli_effective_from date,
  mli_adoption_date date,
  de_mli_signature_date date,
  sk_mli_signature_date date,
  de_mli_entry_into_force date,
  sk_mli_entry_into_force date,
  german_article35_completion_date date,
  tax_type text not null,
  source_kind text not null check (source_kind in (
    'AUTHENTIC_BILATERAL_TREATY',
    'TREATY_CONTINUATION_INSTRUMENT',
    'AUTHENTIC_BEPS_MLI',
    'MLI_MATCHING_POSITION',
    'OFFICIAL_SYNTHESIZED_WORKING_TEXT',
    'SK_MOF_TREATY_STATUS',
    'DE_DOMESTIC_LAW',
    'SK_DOMESTIC_LAW'
  )),
  source_version text not null,
  active boolean not null default false check (active = false),
  public_runtime_allowed boolean not null default false check (public_runtime_allowed = false),
  locked_at timestamptz,
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_bilateral_tax_treaty_versions_period
    check (effective_to is null or effective_to >= effective_from),
  constraint knowledge_bilateral_tax_treaty_versions_unique
    unique (treaty_id, temporal_version)
);

create index if not exists knowledge_bilateral_tax_treaty_versions_treaty_idx
  on public.knowledge_bilateral_tax_treaty_versions (treaty_id);
create index if not exists knowledge_bilateral_tax_treaty_versions_effective_idx
  on public.knowledge_bilateral_tax_treaty_versions (effective_from, effective_to);

create table if not exists public.knowledge_bilateral_tax_processes (
  id uuid primary key default gen_random_uuid(),
  treaty_id uuid not null references public.knowledge_bilateral_tax_treaties (id) on delete restrict,
  treaty_version_id uuid not null
    references public.knowledge_bilateral_tax_treaty_versions (id) on delete restrict,
  process_group_id text not null check (process_group_id in (
    'TAX_RESIDENCE', 'EMPLOYMENT_INCOME', 'INDEPENDENT_WORK', 'DOUBLE_TAX_RELIEF'
  )),
  lifecycle_state text not null default 'draft' check (lifecycle_state in (
    'draft', 'review', 'approved', 'publication_eligible', 'published',
    'suspended', 'superseded', 'withdrawn'
  )),
  active boolean not null default false check (active = false),
  public_runtime_allowed boolean not null default false check (public_runtime_allowed = false),
  review_status text not null default 'unverified'
    check (review_status in ('unverified', 'machine_prechecked', 'human_reviewed', 'expert_reviewed', 'review_required')),
  created_at timestamptz not null default now(),
  constraint knowledge_bilateral_tax_processes_unique
    unique (treaty_id, process_group_id, treaty_version_id)
);

create index if not exists knowledge_bilateral_tax_processes_treaty_idx
  on public.knowledge_bilateral_tax_processes (treaty_id);
create index if not exists knowledge_bilateral_tax_processes_version_idx
  on public.knowledge_bilateral_tax_processes (treaty_version_id);

create table if not exists public.knowledge_bilateral_tax_process_claim_links (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.knowledge_bilateral_tax_processes (id) on delete restrict,
  claim_id uuid not null references public.knowledge_claims (id) on delete restrict,
  claim_role text not null check (claim_role in (
    'german_domestic_tax', 'slovak_domestic_tax', 'bilateral_treaty', 'mli'
  )),
  created_at timestamptz not null default now(),
  constraint knowledge_bilateral_tax_process_claim_links_unique
    unique (process_id, claim_id, claim_role)
);

create index if not exists knowledge_bilateral_tax_process_claim_links_process_idx
  on public.knowledge_bilateral_tax_process_claim_links (process_id);
create index if not exists knowledge_bilateral_tax_process_claim_links_claim_idx
  on public.knowledge_bilateral_tax_process_claim_links (claim_id);

alter table public.knowledge_bilateral_tax_treaties enable row level security;
alter table public.knowledge_bilateral_tax_treaty_versions enable row level security;
alter table public.knowledge_bilateral_tax_processes enable row level security;
alter table public.knowledge_bilateral_tax_process_claim_links enable row level security;

revoke all on public.knowledge_bilateral_tax_treaties from public, anon, authenticated;
revoke all on public.knowledge_bilateral_tax_treaty_versions from public, anon, authenticated;
revoke all on public.knowledge_bilateral_tax_processes from public, anon, authenticated;
revoke all on public.knowledge_bilateral_tax_process_claim_links from public, anon, authenticated;

create or replace function public.knowledge_bilateral_tax_treaty_versions_protect_locked_content()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if old.locked_at is not null then
    if new.treaty_id is distinct from old.treaty_id
       or new.temporal_version is distinct from old.temporal_version
       or new.effective_from is distinct from old.effective_from
       or new.effective_to is distinct from old.effective_to
       or new.base_treaty_date is distinct from old.base_treaty_date
       or new.mli_modified is distinct from old.mli_modified
       or new.mli_effective_from is distinct from old.mli_effective_from
       or new.tax_type is distinct from old.tax_type
       or new.source_kind is distinct from old.source_kind
       or new.source_version is distinct from old.source_version
       or new.locked_at is distinct from old.locked_at
    then
      raise exception
        'knowledge_bilateral_tax_treaty_versions: locked authoritative content cannot be mutated (id=%)',
        old.id
        using errcode = '55000';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists knowledge_bilateral_tax_treaty_versions_protect_locked_content
  on public.knowledge_bilateral_tax_treaty_versions;

create trigger knowledge_bilateral_tax_treaty_versions_protect_locked_content
  before update on public.knowledge_bilateral_tax_treaty_versions
  for each row
  execute function public.knowledge_bilateral_tax_treaty_versions_protect_locked_content();

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
    v_process_id := knowledge_factory_internal.stable_knowledge_factory_id(
      'processes',
      'DE-SK:' || (v_process->>'temporalVersion') || ':' || (v_process->>'processGroupId')
    );
    insert into public.knowledge_bilateral_tax_processes(
      id, treaty_id, treaty_version_id, process_group_id, lifecycle_state,
      active, public_runtime_allowed, review_status
    ) values (
      v_process_id, v_treaty, v_version, v_process->>'processGroupId',
      'draft', false, false, 'unverified'
    ) on conflict (treaty_id, process_group_id, treaty_version_id) do nothing;
    get diagnostics v_created = row_count;
    v_total_created := v_total_created + v_created;

    for v_ref in select value from jsonb_array_elements(coalesce(v_process->'claimRefs', '[]'::jsonb)) loop
      v_token := coalesce(v_ref->>'entityClass', '') || ':' || coalesce(v_ref->>'key', '');
      if v_token = any (v_seen) then
        -- same claim may link to multiple versioned processes; token includes process
        v_token := v_token || ':' || (v_process->>'temporalVersion');
      end if;
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

revoke all on function public.knowledge_bilateral_tax_treaty_versions_protect_locked_content()
  from public, anon, authenticated, service_role;
revoke all on function knowledge_factory_internal.resolve_bilateral_tax_claim_ref(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public.knowledge_ingest_curated_bilateral_tax_treaty_pack(jsonb)
  from public, anon, authenticated, service_role;

comment on table public.knowledge_bilateral_tax_treaties is
  'CB-TAX-0B bilateral tax treaty identity. Direction-neutral DE-SK only. Inactive. Not a tax calculator.';
comment on table public.knowledge_bilateral_tax_treaty_versions is
  'CB-TAX-0B temporal treaty versions. Relief method is not stored on the treaty row.';
comment on table public.knowledge_bilateral_tax_processes is
  'CB-TAX-0B tax process groups. Separate from social-security connector processes.';
comment on table public.knowledge_bilateral_tax_process_claim_links is
  'CB-TAX-0B tax claim links. Not eu_coordination_claim_ids.';
comment on function public.knowledge_ingest_curated_bilateral_tax_treaty_pack(jsonb) is
  'CB-TAX-0B bilateral tax writer. TAX_TREATY + DE-SK only. No production role grant. No public runtime.';
