/**
 * V2-F controlled question-mode evidence wiring.
 * Runs deterministic prompt-contract checks and reuses disposable PG17 V2-E
 * proof; it never connects to a hosted database or invokes a live model.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { Client } from "pg";
import { buildSmartTalkMessages } from "../../../../build-smart-talk-prompt";
import {
  prepareControlledQuestionKnowledge,
  type ControlledKnowledgeDiagnostics,
} from "./controlled-runtime-retrieval";
import { buildWeiltingenLocalityPilotPayload } from "./bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { stablePackEntityId } from "./identity";

const ROOT = process.cwd();
const HOURS_SECRET = "MOCK_STORED_HOURS_08_00_TO_12_00";
const STALE_SECRET = "MOCK_STALE_CONTACT_VALUE";
const LOCAL_ENV: NodeJS.ProcessEnv = {
  NODE_ENV: "test",
  SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED: "true",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL: "postgresql://birello_knowledge_reader:local@127.0.0.1/v2f",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_NAME: "v2f",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_READER: "birello_knowledge_reader",
};
const UNITS = ["anmeldung-duty", "anmeldung-deadline-two-weeks", "landlord-confirmation"];

function runAudit(file: string): boolean {
  const windows = process.platform === "win32";
  const result = spawnSync(
    windows ? "powershell.exe" : "npx",
    windows
      ? ["-NoProfile", "-NonInteractive", "-Command", `npx -y tsx@4.19.2 "${file}"`]
      : ["-y", "tsx@4.19.2", file],
    {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    timeout: 180_000,
    },
  );
  return result.status === 0 && /"phaseResult": "PASS"|"result": "PASS"/.test(result.stdout);
}

function context(municipalityCode: string | null, stale = false) {
  const local = municipalityCode === "09571218";
  return {
    packId: "anmeldung_ummeldung_abmeldung",
    family: "residence_registration_lifecycle",
    countryCode: "DE",
    federalEvidence: UNITS.map((id) => ({
      claimId: stablePackEntityId(`claim:${id}`),
      canonicalProposition: id === "anmeldung-deadline-two-weeks"
        ? "Die Anmeldung erfolgt innerhalb von zwei Wochen nach dem Einzug."
        : id === "landlord-confirmation"
          ? "Der Wohnungsgeber bestätigt den Einzug."
          : "Nach dem Bezug einer Wohnung ist eine Anmeldung erforderlich.",
      canonicalLanguage: "de",
      jurisdictionCode: "DE",
      territorialScope: null,
      handlingMode: "STORE_CANONICALLY",
      canonicalValueUsable: true,
      staleBehavior: "REVALIDATE_BEFORE_USE",
      sourceId: "s", sourceVersionId: "v", sourcePassageId: "p",
      legalLocator: "BMG", citationReference: "BMG",
    })),
    localContext: local ? {
      locality: {
        municipalityCode: "09571218", municipalityName: "Markt Weiltingen",
        jurisdictionId: "j", landCode: "09", landName: "Freistaat Bayern",
        districtCode: "09571", districtName: "Landkreis Ansbach", territorialScopeId: "scope",
      },
      authority: { id: "a", name: "Verwaltungsgemeinschaft Wilburgstetten – Bürgerbüro", type: "verwaltungsgemeinschaft", officialPortalUrl: "https://official.example/authority" },
      competence: { id: "c", subjectMatter: "residence_registration_lifecycle", family: "residence_registration_lifecycle", territorialScopeId: "scope", receivesApplication: true, decidesApplication: true, effectiveFrom: null, effectiveUntil: null, sourceVersionId: "v", passageId: "p", locator: "competence", canonicalUrl: "https://official.example/competence" },
      process: { id: "process", title: "Local Anmeldung process", regionalVariationExpected: true },
      evidence: [
        { informationClass: "AUTHORITY_COMPETENCE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", canonicalValueUsable: true, requiresLiveFetch: false, requiresRevalidation: false, answerReady: true, usabilityState: "CACHE_AND_REVALIDATE", sourceId: "s1", sourceVersionId: "v1", sourcePassageId: "p1", publisherId: "pub", publisherName: "Markt Weiltingen", issuingAuthorityId: "a", canonicalUrl: "https://official.example/competence", locator: "competence", passageText: "Anmeldung in Markt Weiltingen at VG Wilburgstetten Bürgerbüro, Alte Schulstr. 8.", jurisdictionId: "j", territorialScopeId: "scope" },
        { informationClass: "LOCAL_PROCESS_VARIANT", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", canonicalValueUsable: true, requiresLiveFetch: false, requiresRevalidation: false, answerReady: true, usabilityState: "CACHE_AND_REVALIDATE", sourceId: "s2", sourceVersionId: "v2", sourcePassageId: "p2", publisherId: "pub", publisherName: "Gemeinde Wilburgstetten", issuingAuthorityId: "a", canonicalUrl: "https://official.example/appointment", locator: "appointment", passageText: "Booking is available, booked customers are prioritized, and walk-ins remain possible; booking is not mandatory.", jurisdictionId: "j", territorialScopeId: "scope" },
        { informationClass: "ONLINE_SERVICE_URL", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", canonicalValueUsable: true, requiresLiveFetch: false, requiresRevalidation: false, answerReady: true, usabilityState: "CACHE_AND_REVALIDATE", sourceId: "s3", sourceVersionId: "v3", sourcePassageId: "p3", publisherId: "pub", publisherName: "Markt Weiltingen", issuingAuthorityId: "a", canonicalUrl: "https://official.example/online", locator: "online", passageText: "Electronic Anmeldung availability is an official local online-service fact.", jurisdictionId: "j", territorialScopeId: "scope" },
        { informationClass: "FORM_URL", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", canonicalValueUsable: true, requiresLiveFetch: false, requiresRevalidation: false, answerReady: true, usabilityState: "CACHE_AND_REVALIDATE", sourceId: "s4", sourceVersionId: "v4", sourcePassageId: "p4", publisherId: "pub", publisherName: "Markt Weiltingen", issuingAuthorityId: "a", canonicalUrl: "https://official.example/form", locator: "form", passageText: "Official Wohnungsgeberbestätigung form evidence is available.", jurisdictionId: "j", territorialScopeId: "scope" },
        { informationClass: "OPENING_HOURS", handlingMode: "FETCH_LIVE", freshnessClass: "DAILY", staleBehavior: "REVALIDATE_BEFORE_USE", canonicalValueUsable: false, requiresLiveFetch: true, requiresRevalidation: false, answerReady: false, usabilityState: "REQUIRES_LIVE_FETCH", sourceId: "s5", sourceVersionId: "v5", sourcePassageId: "p5", publisherId: "pub", publisherName: "VG Wilburgstetten", issuingAuthorityId: "a", canonicalUrl: "https://official.example/hours", locator: "hours", passageText: HOURS_SECRET, jurisdictionId: "j", territorialScopeId: "scope" },
        ...(stale ? [{ informationClass: "CONTACT_DETAILS", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", canonicalValueUsable: false, requiresLiveFetch: false, requiresRevalidation: true, answerReady: false, usabilityState: "REVALIDATE_BEFORE_USE", sourceId: "s6", sourceVersionId: "v6", sourcePassageId: "p6", publisherId: "pub", publisherName: "VG Wilburgstetten", issuingAuthorityId: "a", canonicalUrl: "https://official.example/contact", locator: "contact", passageText: STALE_SECRET, jurisdictionId: "j", territorialScopeId: "scope" }] : []),
      ],
    } : null,
  };
}

async function prepared(localityKey: unknown, options: { stale?: boolean; fail?: boolean; units?: unknown } = {}) {
  const reports: ControlledKnowledgeDiagnostics[] = [];
  const result = await prepareControlledQuestionKnowledge(
    { text: "Prisťahoval som sa do Weiltingenu. Kde sa mám prihlásiť?", locale: "sk", environment: LOCAL_ENV },
    {
      selectUnitIds: async () => options.units ?? UNITS,
      selectLocalityKey: async () => localityKey,
      retrieveRows: async () => { throw new Error("038 must not run in local context mode"); },
      retrieveAnmeldungContext: async (_ids, municipalityCode) => options.fail
        ? { ok: false as const, result: null, connectionSucceeded: true, rpcInvoked: true, rpcSucceeded: false as const, failureStage: "rpc" as const }
        : { ok: true as const, result: context(municipalityCode, options.stale), connectionSucceeded: true as const, rpcInvoked: true as const, rpcSucceeded: true as const },
      report: (report) => reports.push(report),
    },
  );
  return { result, reports };
}

async function realAdapterClosure(): Promise<Record<string, boolean>> {
  const container = `moja-v2f-real-${process.pid}-${randomUUID().slice(0, 8)}`;
  const database = "v2f_real";
  const password = `v2f-${randomUUID()}`;
  const readerPassword = `reader-${randomUUID()}`;
  const run = (args: string[], timeout = 120_000) => spawnSync("docker", args, {
    cwd: ROOT, encoding: "utf8", shell: false, windowsHide: true, timeout,
  });
  const sql = (text: string) => run([
    "exec", "-i", container, "psql", "-X", "-U", "postgres", "-d", database,
    "-v", "ON_ERROR_STOP=1", "-A", "-t", "-c", text,
  ]);
  let admin: Client | undefined;
  try {
    if (run(["run", "--name", container, "-e", `POSTGRES_PASSWORD=${password}`, "-e", `POSTGRES_DB=${database}`, "-p", "127.0.0.1::5432", "-d", "postgres:17"]).status !== 0) {
      return { A1: false, A2: false, A3: false, A4: false, A5: false, A6: false, A7: false, A8: false, A9: false, A10: false };
    }
    let port = "";
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (sql("select 1").status === 0) {
        port = run(["port", container, "5432/tcp"]).stdout.trim().split(":").at(-1) ?? "";
        if (port) break;
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (!port) throw new Error("local PG17 unavailable");
    if (sql("create role anon nologin nosuperuser nobypassrls; create role authenticated nologin nosuperuser nobypassrls; create role service_role nologin nosuperuser nobypassrls;").status !== 0) {
      throw new Error("role bootstrap");
    }
    const migrations = [
      "032_create_minimal_knowledge_schema.sql", "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql", "035_add_official_source_registry_and_handling_mode_contract.sql",
      "037_add_curated_knowledge_pack_ingestion_rpc.sql", "038_add_curated_knowledge_retrieval_rpc.sql",
      "039_add_curated_locality_pack_ingestion_rpc.sql", "040_add_anmeldung_context_retrieval_rpc.sql",
    ];
    for (const name of migrations) {
      const local = `supabase/migrations/${name}`;
      const remote = `/tmp/${name}`;
      if (run(["cp", local, `${container}:${remote}`]).status !== 0 || run(["exec", container, "psql", "-X", "-U", "postgres", "-d", database, "-v", "ON_ERROR_STOP=1", "-f", remote]).status !== 0) throw new Error(`migration ${name}`);
    }
    const escaped = readerPassword.replaceAll("'", "''");
    if (sql(`create role birello_knowledge_ingestor login password 'ingestor'; create role birello_knowledge_reader login nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls password '${escaped}'; grant connect on database ${database} to birello_knowledge_ingestor,birello_knowledge_reader; grant usage on schema public to birello_knowledge_ingestor,birello_knowledge_reader; grant execute on function public.knowledge_ingest_curated_pack(jsonb),public.knowledge_ingest_curated_locality_pack(jsonb) to birello_knowledge_ingestor; grant execute on function public.knowledge_retrieve_anmeldung_context(uuid[],text),public.knowledge_retrieve_evidence_packets(uuid[],text[]) to birello_knowledge_reader;`).status !== 0) throw new Error("roles");
    admin = new Client({ connectionString: `postgres://postgres:${encodeURIComponent(password)}@127.0.0.1:${port}/${database}` });
    await admin.connect();
    await admin.query("select public.knowledge_ingest_curated_pack($1::jsonb)", [buildCuratedIngestionPayload()]);
    await admin.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb)", [buildWeiltingenLocalityPilotPayload()]);
    const before = JSON.stringify((await admin.query("select count(*) from public.knowledge_sources")).rows);
    const env = { ...LOCAL_ENV, BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL: `postgresql://birello_knowledge_reader:${encodeURIComponent(readerPassword)}@127.0.0.1:${port}/${database}`, BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_NAME: database };
    const reports: ControlledKnowledgeDiagnostics[] = [];
    const real = await prepareControlledQuestionKnowledge({ text: "Weiltingen Anmeldung", locale: "sk", environment: env }, {
      selectUnitIds: async () => UNITS,
      selectLocalityKey: async () => "markt-weiltingen",
      retrieveRows: async () => { throw new Error("038"); },
      report: (report) => reports.push(report),
    });
    const after = JSON.stringify((await admin.query("select count(*) from public.knowledge_sources")).rows);
    const realPrompt = buildSmartTalkMessages({ text: "Weiltingen Anmeldung", locale: "sk", inputType: "question", knowledgeEvidence: real.evidence, localContext: real.localContext });
    const reader = new Client({ connectionString: env.BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL });
    await reader.connect();
    const privilege = (await reader.query(`select has_function_privilege(current_user,'public.knowledge_retrieve_anmeldung_context(uuid[],text)','EXECUTE') as r040,has_function_privilege(current_user,'public.knowledge_retrieve_evidence_packets(uuid[],text[])','EXECUTE') as r038,has_function_privilege(current_user,'public.knowledge_ingest_curated_pack(jsonb)','EXECUTE') as i037,has_function_privilege(current_user,'public.knowledge_ingest_curated_locality_pack(jsonb)','EXECUTE') as i039,has_schema_privilege(current_user,'public','CREATE') as c`)).rows[0];
    await reader.end();
    const appointment = real.localContext?.evidence.find((item) => item.informationClass === "LOCAL_PROCESS_VARIANT")?.passageText ?? "";
    return {
      A1: real.diagnostics.localContextRpcSucceeded && real.localContext?.municipalityCode === "09571218" && real.localContext.authorityName?.includes("Wilburgstetten") === true && real.evidence.length > 0,
      A2: privilege.r040 === true && privilege.r038 === true && privilege.i037 === false && privilege.i039 === false && privilege.c === false,
      A3: before === after,
      A4: (await prepared("unknown")).result.localContext === null,
      A5: (await prepared("markt-weiltingen", { fail: true })).result.diagnostics.localContextFailureStage === "rpc",
      A6: real.localContext?.evidence.some((item) => item.informationClass === "OPENING_HOURS" && item.passageText === undefined && item.requiresLiveFetch) === true && realPrompt.system.includes("currentValueRequiresLiveVerification"),
      A7: appointment.includes("Ohne Voranmeldung werden Anliegen weiterhin bearbeitet")
        && appointment.includes("vorrangig behandelt")
        && appointment.includes("keine Pflicht zur Terminbuchung"),
      A8: realPrompt.system.includes("innerhalb von zwei Wochen") && realPrompt.system.includes("Wilburgstetten"),
      A9: reports.at(-1)?.localContextRpcSucceeded === true,
      A10: env.BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL?.includes("127.0.0.1") === true && !realPrompt.system.includes(readerPassword),
    };
  } finally {
    await admin?.end().catch(() => undefined);
    run(["rm", "-f", container], 30_000);
  }
}

async function main(): Promise<void> {
  const realAdapter = await realAdapterClosure();
  const local = await prepared("markt-weiltingen");
  const prompt = buildSmartTalkMessages({ text: "Prisťahoval som sa do Weiltingenu. Kde sa mám prihlásiť?", locale: "sk", inputType: "question", knowledgeEvidence: local.result.evidence, localContext: local.result.localContext });
  const noLocal = await prepared(null);
  const invented = await prepared("09571218");
  const wrong = await prepared("wilburgstetten");
  const stale = await prepared("markt-weiltingen", { stale: true });
  const failed = await prepared("markt-weiltingen", { fail: true });
  const unrelated = await prepared("markt-weiltingen", { units: [] });
  const de = await prepared("markt-weiltingen");
  const en = await prepared("markt-weiltingen");
  const documentPrompt = buildSmartTalkMessages({ text: "Dokument", locale: "sk", inputType: "text" });
  const documentBaseline = buildSmartTalkMessages({ text: "Dokument", locale: "sk", inputType: "text", localContext: null });
  const source = prompt.system;
  const cases = {
    F1: noLocal.result.evidence.some((item) => item.canonicalUnitId === "anmeldung-deadline-two-weeks") && noLocal.result.localContext === null,
    F2: local.result.diagnostics.municipalityCode === "09571218" && local.result.diagnostics.localContextRpcSucceeded && source.includes("Verwaltungsgemeinschaft Wilburgstetten"),
    F3: local.result.diagnostics.jurisdiction === "DE" && prompt.user.includes("in Slovak") && !source.includes('"jurisdiction":"SK"'),
    F4: wrong.result.localContext === null && wrong.result.diagnostics.municipalityCode === null,
    F5: noLocal.result.localContext === null && noLocal.result.evidence.length > 0,
    F6: invented.result.localContext === null && invented.result.diagnostics.municipalityCode === null,
    F7: unrelated.result.localContext === null && unrelated.result.diagnostics.localContextAttempted === false,
    F8: [local, de, en].every((entry) => entry.result.diagnostics.municipalityCode === "09571218"),
    F9: source.includes("currentValueRequiresLiveVerification") && !source.includes(HOURS_SECRET),
    F10: source.includes("booking is not mandatory") && source.includes("walk-ins remain possible"),
    F11: source.includes("ONLINE_SERVICE_URL") && source.includes("FORM_URL") && source.includes("LOCAL_PROCESS_VARIANT"),
    F12: source.includes("innerhalb von zwei Wochen"),
    F13: failed.result.localContext === null && failed.result.diagnostics.localContextRpcInvoked && !failed.result.diagnostics.localContextRpcSucceeded,
    F14: !source.includes(HOURS_SECRET),
    F15: !buildSmartTalkMessages({ text: "test", locale: "sk", inputType: "question", knowledgeEvidence: stale.result.evidence, localContext: stale.result.localContext }).system.includes(STALE_SECRET),
    F16: source.includes("Alte Schulstr. 8") && source.includes("Booking is available"),
    F17: local.result.localContext?.evidence.length === 5 && source.length < 30_000,
    F18: JSON.stringify(documentPrompt) === JSON.stringify(documentBaseline),
    F19: runAudit("lib/vaylo/smart-talk/knowledge/de/run-smart-talk-controlled-knowledge-integration-local-audit.ts"),
    F20: runAudit("lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/run-v2-e-anmeldung-context-retrieval-audit.ts"),
  };
  const allPassed = Object.values(cases).every(Boolean) && Object.values(realAdapter).every(Boolean);
  process.stdout.write(`${JSON.stringify({ phaseResult: allPassed ? "PASS" : "FAILED", cases, realAdapter, allPassed, productionConnectionAttempted: false, productionRetrievalAttempted: false, productionIngestionAttempted: false, publicRuntimeAuthorized: false }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "V2-F audit failed"}\n`);
  process.exitCode = 1;
});
