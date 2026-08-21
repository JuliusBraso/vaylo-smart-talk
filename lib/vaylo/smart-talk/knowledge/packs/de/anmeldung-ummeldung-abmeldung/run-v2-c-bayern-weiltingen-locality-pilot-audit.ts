/**
 * V2-C Bayern / Markt Weiltingen verified locality pilot.
 * Disposable PostgreSQL 17 only. No production connection or ingestion.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { buildWeiltingenLocalityPilotPayload, WEILTINGEN_PILOT } from "./bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { buildSyntheticLocalityIngestionPayload } from "./curated-locality-ingestion-payload";
import { CANONICAL_UNITS, FIRST_PACK_CANONICAL_UNIT_IDS } from "./pack";

const IMAGE = "postgres:17";
const DB = "v2c_weiltingen";
const PASSWORD = `v2c-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-v2c-${process.pid}-${randomUUID().slice(0, 8)}`;
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
] as const;
const CONTROLLED =
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts";
const LOCAL_RPC = "select public.knowledge_ingest_curated_locality_pack($1::jsonb) as result";
const FEDERAL_RPC = "select public.knowledge_ingest_curated_pack($1::jsonb) as result";

function run(file: string, args: string[], timeout = 120_000): { code: number; stdout: string; stderr: string } {
  const out = spawnSync(file, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    code: out.status ?? (out.error ? 1 : 0),
    stdout: out.stdout ?? "",
    stderr: `${out.stderr ?? ""}${out.error ? `\n${out.error.message}` : ""}`,
  };
}

function sql(text: string, timeout = 120_000): { code: number; stdout: string; stderr: string } {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
    "-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-A", "-t", "-c", text,
  ], timeout);
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

async function rejected(client: Client, payload: unknown): Promise<boolean> {
  try {
    await client.query(LOCAL_RPC, [payload]);
    return false;
  } catch {
    return true;
  }
}

function staticBoundary(): boolean {
  const controlled = fs.readFileSync(path.join(process.cwd(), CONTROLLED), "utf8");
  const migration038 = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql"),
    "utf8",
  );
  const pilot = fs.readFileSync(
    path.join(process.cwd(), "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot.ts"),
    "utf8",
  );
  return CANONICAL_UNITS.length === 41
    && FIRST_PACK_CANONICAL_UNIT_IDS.length === 28
    && controlled.includes("PRODUCTION_DEPLOYED_UNIT_IDS")
    && migration038.includes("knowledge_retrieve_evidence_packets")
    && !migration038.includes("knowledge_ingest_curated_locality_pack")
    && !pilot.includes(".invalid")
    && !pilot.includes("anmeldung-deadline-two-weeks")
    && WEILTINGEN_PILOT.municipalityCode === "09571218"
    && WEILTINGEN_PILOT.localOneWeekRecommendationPresent === false
    && WEILTINGEN_PILOT.competenceEffectiveFrom === null;
}

async function main(): Promise<void> {
  const cases: Record<string, boolean> = { C12: staticBoundary() };
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.code !== 0) {
    process.stdout.write(`${JSON.stringify({ phaseResult: "BLOCKED", reason: "docker unavailable", cases }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=v2-c",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  try {
    if (created.code !== 0) throw new Error(`container start failed: ${created.stderr}`);
    let ready = false;
    let consecutive = 0;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const probe = sql("select current_database();", 5_000);
      if (probe.code === 0 && probe.stdout.trim() === DB) {
        consecutive += 1;
        if (consecutive >= 3) {
          ready = true;
          break;
        }
      } else consecutive = 0;
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (!ready) throw new Error("postgres not ready");
    if (sql(`
      create role anon nologin nosuperuser nobypassrls;
      create role authenticated nologin nosuperuser nobypassrls;
      create role service_role nologin nosuperuser nobypassrls;
    `).code !== 0) throw new Error("role bootstrap failed");
    for (const [index, file] of MIGRATIONS.entries()) {
      const target = `/tmp/m${index}.sql`;
      const copied = run("docker", ["cp", path.join(process.cwd(), file), `${CONTAINER}:${target}`]);
      if (copied.code !== 0) throw new Error(`copy ${file} failed`);
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
        "-v", "ON_ERROR_STOP=1", "-f", target,
      ], 240_000);
      if (applied.code !== 0) throw new Error(`apply ${file} failed: ${applied.stderr.slice(-2000)}`);
    }
    const escapedPassword = INGESTOR_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls connection limit 2 password '${escapedPassword}';
      grant connect on database ${DB} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb) to birello_knowledge_ingestor;
    `).code !== 0) throw new Error("ingestor grant failed");
    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("missing published port");
    admin = new Client({ connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DB}` });
    ingestor = new Client({
      connectionString: `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DB}`,
    });
    await admin.connect();
    await ingestor.connect();

    const federal = await ingestor.query(FEDERAL_RPC, [buildCuratedIngestionPayload()]);
    const federalRepeat = await ingestor.query(FEDERAL_RPC, [buildCuratedIngestionPayload()]);
    const federalClaims = Number((await admin.query("select count(*)::int as n from public.knowledge_claims")).rows[0]?.n);
    cases.C13 = Number((federal.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) > 0
      && Number((federalRepeat.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) === 0
      && federalClaims === 41;

    const payload = buildWeiltingenLocalityPilotPayload() as Record<string, unknown>;
    const first = await ingestor.query(LOCAL_RPC, [payload]);
    const firstCreated = Number((first.rows[0]?.result as { semanticCreated?: number })?.semanticCreated);
    const identity = await admin.query(
      `select j.name, j.jurisdiction_code, j.jurisdiction_level, p.name as parent_name, p.jurisdiction_code as parent_code,
              gp.name as land_name, gp.jurisdiction_code as land_code
         from public.knowledge_jurisdictions j
         join public.knowledge_jurisdictions p on p.id=j.parent_jurisdiction_id
         join public.knowledge_jurisdictions gp on gp.id=p.parent_jurisdiction_id
        where j.id=$1`,
      [(payload.locality as { id: string }).id],
    );
    const scope = await admin.query(
      "select municipality_codes, kreis_codes, land_codes from public.knowledge_territorial_scopes where id=$1",
      [(payload.territorialScope as { id: string }).id],
    );
    cases.C1 = identity.rows[0]?.name === "Markt Weiltingen"
      && identity.rows[0]?.jurisdiction_code === "09571218"
      && identity.rows[0]?.parent_name === "Landkreis Ansbach"
      && identity.rows[0]?.parent_code === "09571"
      && identity.rows[0]?.land_name === "Freistaat Bayern"
      && identity.rows[0]?.land_code === "09"
      && JSON.stringify(scope.rows[0]?.municipality_codes) === JSON.stringify(["09571218"]);

    const competence = await admin.query(
      `select c.subject_matter, c.personal_scope, c.authority_id, c.territorial_scope_id,
              c.effective_from, a.authority_name, a.authority_type, p.text as passage
         from public.knowledge_authority_competences c
         join public.knowledge_authorities a on a.id=c.authority_id
         join public.knowledge_source_passages p on p.id=c.competence_passage_id
        where c.id=$1`,
      [(payload.competence as { id: string }).id],
    );
    cases.C2 = competence.rows[0]?.authority_name === WEILTINGEN_PILOT.authorityName
      && competence.rows[0]?.authority_type === "verwaltungsgemeinschaft"
      && competence.rows[0]?.subject_matter === "residence_registration_lifecycle"
      && String(competence.rows[0]?.passage ?? "").includes("Verwaltungsgemeinschaft Wilburgstetten - Bürgerbüro");

    const provenance = await admin.query(
      `select
         (select count(*)::int from public.knowledge_sources s
           where s.issuing_authority_id=$1 and s.canonical_url like 'https://%'
             and s.canonical_url not like '%.invalid%') as official_sources,
         (select count(*)::int from public.knowledge_source_passages p
           join public.knowledge_source_versions v on v.id=p.source_version_id
           join public.knowledge_sources s on s.id=v.source_id
          where s.issuing_authority_id=$1 and p.text <> '') as passages`,
      [(payload.authority as { id: string }).id],
    );
    cases.C3 = provenance.rows[0]?.official_sources === 3 && provenance.rows[0]?.passages === 3 && firstCreated > 0;

    const repeat = await ingestor.query(LOCAL_RPC, [payload]);
    const afterRepeat = await admin.query(
      "select count(*)::int as n from public.knowledge_authorities where authority_name=$1",
      [WEILTINGEN_PILOT.authorityName],
    );
    cases.C4 = Number((repeat.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) === 0
      && afterRepeat.rows[0]?.n === 1;

    const conflicting = clone(payload);
    (conflicting.authority as Record<string, unknown>).name = "Conflicting Weiltingen authority";
    cases.C5 = await rejected(ingestor, conflicting)
      && (await admin.query("select authority_name from public.knowledge_authorities where id=$1", [
        (payload.authority as { id: string }).id,
      ])).rows[0]?.authority_name === WEILTINGEN_PILOT.authorityName;

    const otherLocality = await admin.query(
      `select
         municipality_codes @> array['09571999'] as other_ags,
         municipality_codes = array['09571218'] as only_weiltingen
         from public.knowledge_territorial_scopes where id=$1`,
      [(payload.territorialScope as { id: string }).id],
    );
    cases.C6 = otherLocality.rows[0]?.other_ags === false && otherLocality.rows[0]?.only_weiltingen === true;

    const federalDeadline = await admin.query(
      `select count(*)::int as n from public.knowledge_claims
        where claim_text_canonical like '%innerhalb von zwei Wochen nach dem Einzug%'`,
    );
    const localDeadlineConfusion = String(competence.rows[0]?.passage ?? "").includes("ersetzt sie nicht durch eine lokale Rechtsfrist")
      && !String(competence.rows[0]?.passage ?? "").includes("Rechtsfrist von einer Woche");
    cases.C7 = federalDeadline.rows[0]?.n === 1 && localDeadlineConfusion && WEILTINGEN_PILOT.localOneWeekRecommendationPresent === false;

    const appointmentText = JSON.stringify((payload.additionalEvidence as unknown[])[1]);
    cases.C8 = appointmentText.includes("Ohne Voranmeldung werden Anliegen weiterhin bearbeitet")
      && appointmentText.includes("vorrangig behandelt")
      && appointmentText.includes("keine Pflicht zur Terminbuchung");

    const primaryPassage = String((payload.passage as { text: string }).text);
    cases.C9 = primaryPassage.includes("persönlich bei der Meldebehörde")
      && primaryPassage.includes("elektronisch über das Internet")
      && primaryPassage.includes("Elektronische Wohnsitzanmeldung")
      && !primaryPassage.includes("Voranmeldung eines Zuzugs");

    const handling = await admin.query(
      `select h.information_class::text as information_class, h.handling_mode::text as handling_mode
         from public.knowledge_source_handling_policies h
         join public.knowledge_sources s on s.id=h.source_id
        where s.issuing_authority_id=$1`,
      [(payload.authority as { id: string }).id],
    );
    const modes = Object.fromEntries(handling.rows.map((row) => [row.information_class, row.handling_mode]));
    cases.C10 = modes.AUTHORITY_COMPETENCE === "CACHE_AND_REVALIDATE"
      && modes.CONTACT_DETAILS === "CACHE_AND_REVALIDATE"
      && modes.OPENING_HOURS === "FETCH_LIVE";

    const claimsAfter = Number((await admin.query("select count(*)::int as n from public.knowledge_claims")).rows[0]?.n);
    cases.C11 = claimsAfter === 41 && !JSON.stringify(payload).includes("anmeldung-deadline-two-weeks");

    const synthetic = buildSyntheticLocalityIngestionPayload() as Record<string, unknown>;
    const syntheticApply = await ingestor.query(LOCAL_RPC, [synthetic]);
    const ambiguous = clone(synthetic);
    (ambiguous.locality as Record<string, unknown>).municipalityCode = "";
    (ambiguous.locality as Record<string, unknown>).name = "Neustadt";
    (ambiguous.locality as Record<string, unknown>).parentJurisdictionId =
      (ambiguous.landJurisdiction as { id: string }).id;
    ambiguous.districtJurisdiction = null;
    const wrongCountry = clone(synthetic);
    wrongCountry.countryCode = "SK";
    const unknownCompetence = clone(synthetic);
    (unknownCompetence.competence as Record<string, unknown>).subjectMatter = "parking";
    cases.C14 = Number((syntheticApply.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) > 0
      && Array.isArray(synthetic.additionalEvidence)
      && (synthetic.additionalEvidence as unknown[]).length === 0
      && await rejected(ingestor, ambiguous)
      && await rejected(ingestor, wrongCountry)
      && await rejected(ingestor, unknownCompetence);

    const verifiedSources = await admin.query(
      `select s.canonical_url, s.official_domain, pub.publisher_name,
              s.issuing_authority_id::text as issuing_authority_id,
              s.supports_claim_types, s.first_verified_at, s.last_verified_at
         from public.knowledge_sources s
         join public.knowledge_publishers pub on pub.id=s.publisher_id
        where s.canonical_url = any($1::text[])
        order by s.canonical_url`,
      [[
        WEILTINGEN_PILOT.urls.weiltingenAnmeldung,
        WEILTINGEN_PILOT.urls.vgHours,
        WEILTINGEN_PILOT.urls.appointmentPolicy,
      ]],
    );
    const byUrl = Object.fromEntries(
      verifiedSources.rows.map((row) => [row.canonical_url, row]),
    );
    const hoursRow = byUrl[WEILTINGEN_PILOT.urls.vgHours];
    const appointmentRow = byUrl[WEILTINGEN_PILOT.urls.appointmentPolicy];
    const primaryRow = byUrl[WEILTINGEN_PILOT.urls.weiltingenAnmeldung];
    const vgAuthorityId = (payload.authority as { id: string }).id;
    cases.P1 = competence.rows[0]?.effective_from == null
      && WEILTINGEN_PILOT.competenceEffectiveFrom === null
      && WEILTINGEN_PILOT.retrievedAt === "2026-08-21"
      && primaryRow?.first_verified_at != null
      && primaryRow?.last_verified_at != null
      && !JSON.stringify(payload.competence).includes("2026-08-21");
    cases.P2 = primaryRow?.publisher_name === "Markt Weiltingen"
      && hoursRow?.publisher_name === "Verwaltungsgemeinschaft Wilburgstetten"
      && appointmentRow?.publisher_name === "Gemeinde Wilburgstetten";
    cases.P3 = primaryRow?.issuing_authority_id === vgAuthorityId
      && hoursRow?.issuing_authority_id === vgAuthorityId
      && appointmentRow?.issuing_authority_id === vgAuthorityId;
    cases.P4 = primaryRow?.official_domain === "www.weiltingen.de"
      && hoursRow?.official_domain === "www.vg-wilburgstetten.de"
      && appointmentRow?.official_domain === "www.wilburgstetten.de"
      && cases.P2 === true;
    const absentKey = clone(payload);
    delete absentKey.additionalEvidence;
    const nullKey = clone(payload);
    nullKey.additionalEvidence = null;
    cases.P5 = await rejected(ingestor, absentKey) && await rejected(ingestor, nullKey);
    cases.P6 = Array.isArray(synthetic.additionalEvidence)
      && (synthetic.additionalEvidence as unknown[]).length === 0
      && Number((syntheticApply.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) > 0;
    const competenceLabeledHours = clone(payload);
    const hoursEvidence = clone((competenceLabeledHours.additionalEvidence as Record<string, unknown>[])[0]);
    (hoursEvidence.source as Record<string, unknown>).supportsClaimTypes = ["authority_competence"];
    (competenceLabeledHours.additionalEvidence as Record<string, unknown>[])[0] = hoursEvidence;
    cases.P7 = Array.isArray(hoursRow?.supports_claim_types)
      && !(hoursRow.supports_claim_types as string[]).includes("authority_competence")
      && (hoursRow.supports_claim_types as string[]).length === 0
      && await rejected(ingestor, competenceLabeledHours);
    const appointmentHandling = await admin.query(
      `select h.information_class::text as information_class, h.handling_mode::text as handling_mode
         from public.knowledge_source_handling_policies h
        where h.source_id=$1`,
      [((payload.additionalEvidence as { source: { id: string } }[])[1].source.id)],
    );
    cases.P8 = appointmentHandling.rows.some((row) => row.information_class === "LOCAL_PROCESS_VARIANT"
      && row.handling_mode === "CACHE_AND_REVALIDATE");
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const required = [
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "C14",
    "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8",
  ] as const;
  const allPassed = required.every((key) => cases[key] === true);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    allPassed,
    cases,
    productionConnectionAttempted: false,
    productionIngestionAttempted: false,
    productionRetrievalAttempted: false,
    publicRuntimeAuthorized: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  run("docker", ["rm", "-f", CONTAINER], 30_000);
  process.stderr.write(`${JSON.stringify({
    result: "FAILED",
    message: error instanceof Error ? error.message : "V2-C audit failed",
  })}\n`);
  process.exitCode = 1;
});
