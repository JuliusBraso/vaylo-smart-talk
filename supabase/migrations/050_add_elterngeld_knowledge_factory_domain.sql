-- Minimum Knowledge Factory taxonomy extension for the federal
-- Elterngeld lifecycle. Additive only: extends the process-group
-- check and the saved 041 domain whitelist.
-- Does not change runtime grants, retrieval, or production data.

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
    'elterngeld'
  ));

do $elg_domain$
declare
  v_definition text;
begin
  if pg_catalog.to_regprocedure(
    'knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)'
  ) is null then
    return;
  end if;
  v_definition := pg_catalog.pg_get_functiondef(
    'knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)'::regprocedure
  );
  if v_definition not like '%elterngeld%' then
    v_definition := replace(
      v_definition,
      $lit$'verkehrsordnungswidrigkeiten_bussgeldverfahren'$lit$,
      $lit$'verkehrsordnungswidrigkeiten_bussgeldverfahren','elterngeld'$lit$
    );
    execute v_definition;
  end if;
end;
$elg_domain$;
