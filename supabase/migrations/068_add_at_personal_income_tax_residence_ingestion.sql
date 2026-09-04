-- AT-SK-0I: additive AT personal income tax / domestic tax-residence process group
-- and server-only ingest wrapper.
-- Does not activate AT-SK, public runtime, or other domain connectors.
-- Does not modify 067. Does not drop origin_market or resolver functions.
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
    'at_sk_health_coordination_connector',
    'at_family_benefits_coordination_routing',
    'at_sk_family_benefits_coordination_connector',
    'at_unemployment_coordination_routing',
    'at_sk_unemployment_coordination_connector',
    'at_cross_border_gewerbe_service_routing',
    'at_sk_cross_border_gewerbe_service_connector',
    'at_personal_income_tax_residence'
  ));

create or replace function public.knowledge_ingest_curated_at_personal_income_tax_residence_pack(
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
  if v_pack_id is distinct from 'at_personal_income_tax_residence' then
    raise exception 'AT_TAX_RESIDENCE_PACK_IDENTITY_INVALID';
  end if;
  if p_payload->>'countryCode' is distinct from 'AT' then
    raise exception 'AT_TAX_RESIDENCE_COUNTRY_NOT_AUTHORIZED';
  end if;
  if p_payload#>>'{trustDomain,code}' is distinct from 'at' then
    raise exception 'AT_TAX_RESIDENCE_TRUST_DOMAIN_INVALID';
  end if;
  if exists (
    select 1 from jsonb_array_elements(coalesce(p_payload->'jurisdictions', '[]'::jsonb)) j
    where j->>'countryCode' in ('DE', 'SK', 'CZ', 'PL', 'HU', 'EU')
       or j->>'code' in ('DE', 'SK', 'CZ', 'PL', 'HU', 'EU', 'de_sk')
       or j->>'level' is distinct from 'at_national'
       or j->>'countryCode' is distinct from 'AT'
  ) then
    raise exception 'AT_TAX_RESIDENCE_JURISDICTION_INVALID';
  end if;
  if p_payload ? 'userLocale' or p_payload ? 'locale' or p_payload ? 'outputLocale'
     or p_payload ? 'uiLanguage' then
    raise exception 'AT_TAX_RESIDENCE_LOCALE_ACTIVATION_FORBIDDEN';
  end if;
  return knowledge_factory_internal.ingest_curated_layer_pack(
    p_payload,
    v_pack_id,
    'at',
    'at_national',
    'AT',
    'at_personal_income_tax_residence',
    'SPECIFIC_AUTHORITY',
    'de'
  );
end;
$$;

revoke all on function public.knowledge_ingest_curated_at_personal_income_tax_residence_pack(jsonb)
  from public, anon, authenticated, service_role;

comment on function public.knowledge_ingest_curated_at_personal_income_tax_residence_pack(jsonb) is
  'AT-SK-0I server-only Austrian personal income tax / domestic tax-residence ingest. Revoke-by-default. Not deployed.';
