/**
 * V2-E Anmeldung federal+local retrieval expansion.
 * Disposable PostgreSQL 17 only. No production connection, ingestion, or retrieval.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { retrieveAnmeldungContext, type AnmeldungContextResult } from "./anmeldung-context-retrieval";
import { buildWeiltingenLocalityPilotPayload, WEILTINGEN_PILOT } from "./bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { buildSyntheticLocalityIngestionPayload, SYNTHETIC_LOCALITY_INGESTION } from "./curated-locality-ingestion-payload";
import { stablePackEntityId } from "./identity";
import { CANONICAL_UNITS, FIRST_PACK_CANONICAL_UNIT_IDS } from "./pack";

const IMAGE = "postgres:17";
const DB = "v2e_retrieval";
const PASSWORD = `v2e-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const READER_PASSWORD = `reader-${randomUUID()}`;
const CONTAINER = `moja-v2e-${process.pid}-${randomUUID().slice(0, 8)}`;
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
  "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
] as const;
const CONTROLLED =
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts";
const FEDERAL_IDS = [
  stablePackEntityId("claim:anmeldung-duty"),
  stablePackEntityId("claim:anmeldung-deadline-two-weeks"),
  stablePackEntityId("claim:landlord-confirmation"),
];
const LOCAL_INGEST = "select public.knowledge_ingest_curated_locality_pack($1::jsonb) as result";
const FEDERAL_INGEST = "select public.knowledge_ingest_curated_pack($1::jsonb) as result";

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

async function rejectedRetrieve(
  client: Client,
  claimIds: readonly string[],
  municipalityCode: string | null,
): Promise<boolean> {
  try {
    await retrieveAnmeldungContext(client, claimIds, municipalityCode);
    return false;
  } catch {
    return true;
  }
}

async function denied(client: Client, text: string): Promise<boolean> {
  try {
    await client.query(text);
    return false;
  } catch {
    return true;
  }
}

function staticChecks(): boolean {
  const rpcSql = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql"),
    "utf8",
  );
  const migration038 = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql"),
    "utf8",
  );
  const controlled = fs.readFileSync(path.join(process.cwd(), CONTROLLED), "utf8");
  return !/create table/i.test(rpcSql)
    && /security definer/i.test(rpcSql)
    && /set search_path = pg_catalog, public/.test(rpcSql)
    && !/execute\s+(format|pg_catalog\.format)/i.test(rpcSql)
    && !/\binsert into\b/i.test(rpcSql)
    && !/\bdelete from\b/i.test(rpcSql)
    && /revoke all on function public\.knowledge_retrieve_anmeldung_context\(uuid\[\], text\)/.test(rpcSql)
    && rpcSql.includes("'anmeldung_ummeldung_abmeldung'")
    && rpcSql.includes("'residence_registration_lifecycle'")
    && !/weiltingen|ansbach|userlocale|user_locale/i.test(rpcSql)
    && migration038.includes("knowledge_retrieve_evidence_packets")
    && !migration038.includes("knowledge_retrieve_anmeldung_context")
    && controlled.includes('localContextEnabled: "SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED"')
    && controlled.includes('environment[ENV.localContextEnabled] === "true"')
    && CANONICAL_UNITS.length === 41
    && FIRST_PACK_CANONICAL_UNIT_IDS.length === 28;
}

async function fingerprint(client: Client): Promise<string> {
  const result = await client.query(`
    select concat_ws(':',
      (select count(*) from public.knowledge_claims),
      (select count(*) from public.knowledge_authorities),
      (select count(*) from public.knowledge_authority_competences),
      (select count(*) from public.knowledge_sources),
      (select count(*) from public.knowledge_source_handling_policies),
      (select count(*) from public.knowledge_jurisdictions)
    ) as fp
  `);
  return String(result.rows[0]?.fp);
}

function evidenceByClass(result: AnmeldungContextResult, informationClass: string) {
  return result.localContext?.evidence.filter((item) => item.informationClass === informationClass) ?? [];
}

function noAnswerReadyWhileRevalidating(result: AnmeldungContextResult): boolean {
  return result.localContext?.evidence.every((item) =>
    !(item.requiresRevalidation && item.answerReady)
  ) ?? true;
}

function noCanonicalUsableWhileRevalidating(result: AnmeldungContextResult): boolean {
  return result.localContext?.evidence.every((item) =>
    !(item.requiresRevalidation && item.canonicalValueUsable)
  ) ?? true;
}

function cacheRevalidateItems(result: AnmeldungContextResult) {
  return result.localContext?.evidence.filter((item) =>
    item.handlingMode === "CACHE_AND_REVALIDATE" && item.staleBehavior === "REVALIDATE_BEFORE_USE"
  ) ?? [];
}

async function main(): Promise<void> {
  const cases: Record<string, boolean> = {
    E7: staticChecks(),
    packBoundary: CANONICAL_UNITS.length === 41 && FIRST_PACK_CANONICAL_UNIT_IDS.length === 28,
  };
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.code !== 0) {
    process.stdout.write(`${JSON.stringify({ phaseResult: "BLOCKED", reason: "docker unavailable", cases }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=v2-e",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  let reader: Client | undefined;
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
    const ingestorEscaped = INGESTOR_PASSWORD.replaceAll("'", "''");
    const readerEscaped = READER_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls connection limit 2 password '${ingestorEscaped}';
      grant connect on database ${DB} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb) to birello_knowledge_ingestor;
      create role birello_knowledge_reader login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls connection limit 2 password '${readerEscaped}';
      grant connect on database ${DB} to birello_knowledge_reader;
      grant usage on schema public to birello_knowledge_reader;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[], text[]) to birello_knowledge_reader;
      grant execute on function public.knowledge_retrieve_anmeldung_context(uuid[], text) to birello_knowledge_reader;
    `).code !== 0) throw new Error("role grants failed");
    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("missing published port");
    admin = new Client({ connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DB}` });
    ingestor = new Client({
      connectionString: `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DB}`,
    });
    reader = new Client({
      connectionString: `postgres://birello_knowledge_reader:${encodeURIComponent(READER_PASSWORD)}@127.0.0.1:${port}/${DB}`,
    });
    await admin.connect();
    await ingestor.connect();
    await reader.connect();

    const federalIngest = await ingestor.query(FEDERAL_INGEST, [buildCuratedIngestionPayload()]);
    const federalRepeat = await ingestor.query(FEDERAL_INGEST, [buildCuratedIngestionPayload()]);
    await ingestor.query(LOCAL_INGEST, [buildWeiltingenLocalityPilotPayload()]);
    const claimCount = Number((await admin.query("select count(*)::int as n from public.knowledge_claims")).rows[0]?.n);
    cases.E20 = Number((federalIngest.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) > 0
      && Number((federalRepeat.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) === 0
      && claimCount === 41
      && cases.packBoundary === true;

    const before = await fingerprint(admin);
    const federalOnly = await retrieveAnmeldungContext(reader, FEDERAL_IDS, null);
    cases.E1 = federalOnly.localContext === null
      && federalOnly.countryCode === "DE"
      && FEDERAL_IDS.every((id) => federalOnly.federalEvidence.some((item) => item.claimId === id))
      && federalOnly.federalEvidence.every((item) => item.jurisdictionCode === "DE" && item.canonicalLanguage === "de");

    const weiltingen = await retrieveAnmeldungContext(reader, FEDERAL_IDS, "09571218");
    const after = await fingerprint(admin);
    cases.E17 = before === after;
    cases.E2 = weiltingen.localContext?.locality.municipalityCode === "09571218"
      && weiltingen.localContext.locality.municipalityName === "Markt Weiltingen"
      && weiltingen.localContext.locality.landName === "Freistaat Bayern"
      && weiltingen.localContext.locality.districtName === "Landkreis Ansbach";
    cases.E3 = weiltingen.localContext?.authority?.name === WEILTINGEN_PILOT.authorityName
      && weiltingen.localContext?.authority?.type === "verwaltungsgemeinschaft"
      && weiltingen.localContext?.competence?.subjectMatter === "residence_registration_lifecycle"
      && weiltingen.localContext?.competence?.family === "residence_registration_lifecycle";
    cases.E4 = weiltingen.federalEvidence.length === federalOnly.federalEvidence.length
      && weiltingen.localContext != null
      && weiltingen.federalEvidence.every((item) => FEDERAL_IDS.includes(item.claimId));
    cases.E8 = weiltingen.federalEvidence.some((item) =>
      item.claimId === stablePackEntityId("claim:anmeldung-deadline-two-weeks")
      && item.canonicalProposition.includes("zwei Wochen")
    ) && !weiltingen.localContext?.evidence.some((item) => item.informationClass === "DEADLINE");
    const hours = evidenceByClass(weiltingen, "OPENING_HOURS");
    cases.E9 = hours.length === 1
      && hours[0]?.handlingMode === "FETCH_LIVE"
      && hours[0]?.freshnessClass === "DAILY"
      && hours[0]?.staleBehavior === "REVALIDATE_BEFORE_USE"
      && hours[0]?.requiresLiveFetch === true
      && hours[0]?.canonicalValueUsable === false
      && hours[0]?.answerReady === false
      && hours[0]?.usabilityState === "REQUIRES_LIVE_FETCH";
    const appointment = evidenceByClass(weiltingen, "LOCAL_PROCESS_VARIANT");
    cases.E10 = appointment.length === 1
      && appointment[0]?.handlingMode === "CACHE_AND_REVALIDATE"
      && appointment[0]?.passageText.includes("Ohne Voranmeldung werden Anliegen weiterhin bearbeitet")
      && appointment[0]?.passageText.includes("keine Pflicht zur Terminbuchung")
      && !appointment[0]?.passageText.includes("Terminbuchung ist verpflichtend");
    const classes = new Set(weiltingen.localContext?.evidence.map((item) => item.informationClass));
    cases.E11 = classes.has("ONLINE_SERVICE_URL")
      && classes.has("FORM_URL")
      && classes.has("LOCAL_PROCESS_VARIANT")
      && classes.has("AUTHORITY_COMPETENCE")
      && !classes.has("APPOINTMENT_AVAILABILITY");
    cases.E12 = weiltingen.localContext?.competence?.effectiveFrom == null
      && weiltingen.localContext?.competence?.id != null;
    cases.E14 = (weiltingen.localContext?.evidence.length ?? 0) > 0
      && (weiltingen.localContext?.evidence.every((item) =>
        Boolean(item.sourceId && item.sourceVersionId && item.sourcePassageId && item.canonicalUrl
          && item.handlingMode && item.freshnessClass && item.staleBehavior && item.publisherName)
      ) ?? false);

    const cacheItems = cacheRevalidateItems(weiltingen);
    const cacheClasses = new Set(cacheItems.map((item) => item.informationClass));
    cases.R1 = noAnswerReadyWhileRevalidating(weiltingen)
      && noCanonicalUsableWhileRevalidating(weiltingen);
    cases.R2 = hours.length === 1
      && hours[0]?.handlingMode === "FETCH_LIVE"
      && hours[0]?.requiresLiveFetch === true
      && hours[0]?.answerReady === false
      && hours[0]?.canonicalValueUsable === false
      && hours[0]?.usabilityState === "REQUIRES_LIVE_FETCH";
    cases.R3 = cacheItems.length >= 5
      && ["AUTHORITY_COMPETENCE", "CONTACT_DETAILS", "LOCAL_PROCESS_VARIANT", "ONLINE_SERVICE_URL", "FORM_URL"]
        .every((informationClass) => cacheClasses.has(informationClass))
      && cacheItems.every((item) =>
        item.requiresRevalidation === false
        && item.answerReady === true
        && item.canonicalValueUsable === true
        && item.requiresLiveFetch === false
        && item.usabilityState === "CACHE_AND_REVALIDATE"
      );
    const dueRows = await admin.query(
      `select hp.information_class, hp.handling_mode, hp.revalidation_due_at
         from public.knowledge_source_handling_policies hp
         join public.knowledge_sources s on s.id = hp.source_id
         join public.knowledge_jurisdictions j on j.id = s.jurisdiction_id
        where j.jurisdiction_code = '09571218'
          and hp.process_scope = 'anmeldung_ummeldung_abmeldung'
          and hp.handling_mode = 'CACHE_AND_REVALIDATE'`,
    );
    cases.R4 = dueRows.rows.every((row) => row.revalidation_due_at == null)
      && cacheItems.every((item) => item.answerReady === true && item.requiresRevalidation === false);

    const expiredId = randomUUID();
    await admin.query(
      `insert into public.knowledge_authority_competences (
         id, authority_id, subject_matter, territorial_scope_id, personal_scope,
         receives_application, decides_application, competence_source_version_id,
         competence_passage_id, effective_from, effective_until, review_status, conflict_status
       ) values (
         $1, $2, 'residence_registration_lifecycle', $3, 'residence_registration_lifecycle',
         true, true, $4, $5, '2020-01-01T00:00:00Z', '2021-01-01T00:00:00Z',
         'expert_reviewed', 'none'
       )`,
      [
        expiredId,
        weiltingen.localContext?.authority?.id,
        weiltingen.localContext?.locality.territorialScopeId,
        weiltingen.localContext?.competence?.sourceVersionId,
        weiltingen.localContext?.competence?.passageId,
      ],
    );
    const afterExpired = await retrieveAnmeldungContext(reader, FEDERAL_IDS, "09571218");
    cases.E13 = afterExpired.localContext?.competence?.id === weiltingen.localContext?.competence?.id
      && afterExpired.localContext?.competence?.id !== expiredId
      && afterExpired.localContext?.competence?.effectiveUntil == null;

    await ingestor.query(LOCAL_INGEST, [buildSyntheticLocalityIngestionPayload()]);
    const wrong = await retrieveAnmeldungContext(reader, FEDERAL_IDS, SYNTHETIC_LOCALITY_INGESTION.municipalityCode);
    cases.E5 = wrong.localContext?.locality.municipalityCode === SYNTHETIC_LOCALITY_INGESTION.municipalityCode
      && wrong.localContext?.authority?.name !== WEILTINGEN_PILOT.authorityName
      && wrong.localContext?.locality.municipalityName !== "Markt Weiltingen";
    cases.E6 = await rejectedRetrieve(reader, FEDERAL_IDS, "09999999");
    const tooMany = Array.from({ length: 51 }, () => randomUUID());
    cases.E15 = await rejectedRetrieve(reader, tooMany, "09571218")
      && await rejectedRetrieve(reader, FEDERAL_IDS, "Weiltingen")
      && await rejectedRetrieve(reader, [], "09571218");

    const federalRpc = await reader.query(
      "select claim_id::text as claim_id from public.knowledge_retrieve_evidence_packets($1::uuid[], $2::text[]) order by claim_id",
      [FEDERAL_IDS, ["DE"]],
    );
    const composedIds = weiltingen.federalEvidence.map((item) => item.claimId).slice().sort();
    const directIds = federalRpc.rows.map((row) => String(row.claim_id)).sort();
    cases.E18 = JSON.stringify(composedIds) === JSON.stringify(directIds);

    const privileges = await reader.query(
      `select
         has_function_privilege(current_user,'public.knowledge_retrieve_anmeldung_context(uuid[],text)','EXECUTE') as retrieve,
         has_function_privilege(current_user,'public.knowledge_ingest_curated_pack(jsonb)','EXECUTE') as federal_ingest,
         has_function_privilege(current_user,'public.knowledge_ingest_curated_locality_pack(jsonb)','EXECUTE') as local_ingest,
         has_schema_privilege(current_user,'public','CREATE') as schema_create
      `,
    );
    const privilege = privileges.rows[0];
    cases.E16 = privilege?.retrieve === true
      && privilege?.federal_ingest === false
      && privilege?.local_ingest === false
      && privilege?.schema_create === false
      && await denied(reader, "insert into public.knowledge_authorities(id) values('00000000-0000-4000-8000-000000000099')")
      && await denied(reader, "create table public.v2e_forbidden(id integer)");

    const localityStill = await admin.query(
      `select j.name, j.jurisdiction_code, c.effective_from, a.authority_name
         from public.knowledge_jurisdictions j
         join public.knowledge_authority_competences c on c.territorial_scope_id in (
           select id from public.knowledge_territorial_scopes where municipality_codes = array['09571218']
         )
         join public.knowledge_authorities a on a.id = c.authority_id
        where j.jurisdiction_code='09571218' and c.effective_until is null`,
    );
    cases.E19 = localityStill.rows.some((row) =>
      row.name === "Markt Weiltingen"
      && row.authority_name === WEILTINGEN_PILOT.authorityName
      && row.effective_from == null
    ) && claimCount === 41;

    const appointmentSourceId = appointment[0]?.sourceId;
    const hoursSourceId = hours[0]?.sourceId;
    await admin.query(
      `update public.knowledge_source_handling_policies
          set revalidation_due_at = statement_timestamp() - interval '1 second'
        where source_id = $1 and information_class = 'LOCAL_PROCESS_VARIANT'
          and process_scope = 'anmeldung_ummeldung_abmeldung'`,
      [appointmentSourceId],
    );
    const overdue = await retrieveAnmeldungContext(reader, FEDERAL_IDS, "09571218");
    const overdueAppointment = evidenceByClass(overdue, "LOCAL_PROCESS_VARIANT")[0];
    cases.R3 = cases.R3 === true
      && overdueAppointment?.handlingMode === "CACHE_AND_REVALIDATE"
      && overdueAppointment.staleBehavior === "REVALIDATE_BEFORE_USE"
      && overdueAppointment.requiresRevalidation === true
      && overdueAppointment.answerReady === false
      && overdueAppointment.canonicalValueUsable === false
      && overdueAppointment.usabilityState === "REVALIDATE_BEFORE_USE"
      && noAnswerReadyWhileRevalidating(overdue)
      && noCanonicalUsableWhileRevalidating(overdue);
    await admin.query(
      `update public.knowledge_source_handling_policies
          set revalidation_due_at = null
        where source_id = $1 and information_class = 'LOCAL_PROCESS_VARIANT'
          and process_scope = 'anmeldung_ummeldung_abmeldung'`,
      [appointmentSourceId],
    );

    await admin.query(
      `insert into public.knowledge_source_handling_policies (
         source_id, information_class, process_scope, handling_mode, freshness_class,
         stale_behavior, required_context_keys, risk_class, state_version
       ) values
         ($1, 'CONTACT_DETAILS', 'anmeldung_ummeldung_abmeldung', 'MANUAL_REVIEW_REQUIRED',
          'MANUAL_REVIEW_CYCLE', 'REVALIDATE_BEFORE_USE', '{}', 'MEDIUM', 1),
         ($1, 'FORM_URL', 'anmeldung_ummeldung_abmeldung', 'DO_NOT_ANSWER_WITHOUT_CONTEXT',
          'EVENT_DRIVEN', 'REVALIDATE_BEFORE_USE', '{MUNICIPALITY}', 'MEDIUM', 1),
         ($1, 'AUTHORITY_COMPETENCE', 'anmeldung_ummeldung_abmeldung', 'STORE_CANONICALLY',
          'EVENT_DRIVEN', 'REVALIDATE_BEFORE_USE', '{}', 'MEDIUM', 1)`,
      [hoursSourceId],
    );
    const injected = await retrieveAnmeldungContext(reader, FEDERAL_IDS, "09571218");
    const manual = injected.localContext?.evidence.find((item) =>
      item.sourceId === hoursSourceId && item.handlingMode === "MANUAL_REVIEW_REQUIRED"
    );
    const contextRequired = injected.localContext?.evidence.find((item) =>
      item.sourceId === hoursSourceId && item.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"
    );
    const stored = injected.localContext?.evidence.find((item) =>
      item.sourceId === hoursSourceId && item.handlingMode === "STORE_CANONICALLY"
    );
    cases.R5 = manual != null
      && manual.answerReady === false
      && manual.canonicalValueUsable === false
      && manual.usabilityState === "MANUAL_REVIEW_REQUIRED"
      && injected.localContext?.evidence.every((item) =>
        item.handlingMode !== "MANUAL_REVIEW_REQUIRED" || item.answerReady === false
      ) === true;
    cases.R6 = contextRequired != null
      && contextRequired.answerReady === false
      && contextRequired.canonicalValueUsable === false
      && contextRequired.usabilityState === "DO_NOT_ANSWER_WITHOUT_CONTEXT"
      && injected.localContext?.evidence.every((item) =>
        item.handlingMode !== "DO_NOT_ANSWER_WITHOUT_CONTEXT" || item.answerReady === false
      ) === true;
    cases.R7 = stored != null
      && stored.requiresRevalidation === false
      && stored.answerReady === true
      && stored.canonicalValueUsable === true
      && stored.requiresLiveFetch === false
      && stored.usabilityState === "ANSWER_READY";
    cases.R1 = cases.R1 === true
      && noAnswerReadyWhileRevalidating(injected)
      && noCanonicalUsableWhileRevalidating(injected);
  } finally {
    await reader?.end().catch(() => undefined);
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const required = [
    "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10",
    "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E19", "E20",
    "R1", "R2", "R3", "R4", "R5", "R6", "R7",
  ] as const;
  const ePass = required.slice(0, 20).every((key) => cases[key] === true);
  const rPass = ["R1", "R2", "R3", "R4", "R5", "R6", "R7"].every((key) => cases[key] === true);
  cases.R8 = ePass;
  const allPassed = ePass && rPass && cases.R8 === true;
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    allPassed,
    focusedProof: {
      R1: cases.R1 === true,
      R2: cases.R2 === true,
      R3: cases.R3 === true,
      R4: cases.R4 === true,
      R5: cases.R5 === true,
      R6: cases.R6 === true,
      R7: cases.R7 === true,
      R8: cases.R8 === true,
      allPassed: rPass && cases.R8 === true,
    },
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
    message: error instanceof Error ? error.message : "V2-E audit failed",
  })}\n`);
  process.exitCode = 1;
});
