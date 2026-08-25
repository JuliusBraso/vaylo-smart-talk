/**
 * ANMELDUNG-V2-RUNTIME-01 — controlled production-knowledge visibility 28→41.
 * Source-only: no production connection, ingestion, grant, or public runtime change.
 */
import fs from "node:fs";
import path from "node:path";

import { prepareControlledQuestionKnowledge } from "./controlled-runtime-retrieval";
import { stablePackEntityId } from "./identity";
import {
  CANONICAL_LANGUAGE,
  CANONICAL_UNITS,
  CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS,
  FEDERAL_JURISDICTION_CODE,
  FIRST_PACK_CANONICAL_UNIT_IDS,
  V2A_ADDED_CANONICAL_UNIT_IDS,
} from "./pack";

const ROOT = process.cwd();
const CONTROLLED =
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts";
const PREFLIGHT =
  "lib/vaylo/smart-talk/knowledge/source-registry/birello-production-preflight-executor.ts";
const ENABLED: NodeJS.ProcessEnv = {
  NODE_ENV: "test",
  SMART_TALK_PRODUCTION_KNOWLEDGE_CONTROLLED_ENABLED: "true",
  BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL:
    "postgresql://birello_knowledge_reader:synthetic-never-log@db.invalid/postgres",
  BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_NAME: "postgres",
  BIRELLO_PRODUCTION_KNOWLEDGE_READER: "birello_knowledge_reader",
};

function row(unitId: string, emptyDbContext = false): Record<string, unknown> {
  const unit = CANONICAL_UNITS.find((candidate) => candidate.id === unitId);
  if (!unit) throw new Error(`Unknown fixture unit: ${unitId}`);
  return {
    claim_id: stablePackEntityId(`claim:${unit.id}`),
    canonical_proposition: unit.text,
    canonical_language: CANONICAL_LANGUAGE,
    jurisdiction_code: FEDERAL_JURISDICTION_CODE,
    territorial_scope: null,
    handling_mode: emptyDbContext ? "STORE_CANONICALLY" : unit.handlingMode,
    canonical_value_usable: true,
    stale_behavior: "DO_NOT_USE_STALE",
    required_context_keys: emptyDbContext ? "{}" : `{${(unit.requiredContext ?? []).join(",")}}`,
    revalidation_due_at: null,
    source_id: "11111111-1111-4111-8111-111111111116",
    source_version_id: "11111111-1111-4111-8111-111111111117",
    source_passage_id: stablePackEntityId(unit.passageId),
    legal_locator: "BMG",
    citation_reference: "BMG official federal law",
    full_text_indexed: true,
    vector_indexed: false,
    indexed_at: "2026-08-25T00:00:00.000Z",
    effective_date_filter_required: true,
    stale_policy_filter_required: true,
  };
}

async function retrieve(selected: readonly string[], emptyDbContext = false) {
  const state = { retrievalCalls: 0, jurisdictions: [] as readonly string[] };
  const result = await prepareControlledQuestionKnowledge(
    {
      text: selected.join(" "),
      locale: "de",
      environment: ENABLED,
    },
    {
      selectUnitIds: async () => selected,
      retrieveRows: async (claimIds, jurisdictions) => {
        state.retrievalCalls += 1;
        state.jurisdictions = jurisdictions;
        return {
          ok: true as const,
          connectionSucceeded: true as const,
          rpcInvoked: true as const,
          rpcSucceeded: true as const,
          rows: selected
            .filter((id) => claimIds.includes(stablePackEntityId(`claim:${id}`)))
            .map((id) => row(id, emptyDbContext)),
        };
      },
      report: () => undefined,
    },
  );
  return { result, ...state };
}

async function main(): Promise<void> {
  const controlled = fs.readFileSync(path.join(ROOT, CONTROLLED), "utf8");
  const preflight = fs.readFileSync(path.join(ROOT, PREFLIGHT), "utf8");
  const deployed = new Set<string>(CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS);
  const unknownExposed = CANONICAL_UNITS.filter((unit) => !deployed.has(unit.id)).map((unit) => unit.id);
  const R01 = FIRST_PACK_CANONICAL_UNIT_IDS.length === 28;
  const R02 = CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS.length === 41;
  const R03 = V2A_ADDED_CANONICAL_UNIT_IDS.length === 13
    && CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS.slice(28).join() === V2A_ADDED_CANONICAL_UNIT_IDS.join();
  const R04 = new Set(CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS).size === 41
    && new Set(CANONICAL_UNITS.map((unit) => unit.id)).size === 41;
  const R05 = unknownExposed.length === 0
    && CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS.every((id) => CANONICAL_UNITS.some((unit) => unit.id === id));
  const R06 = controlled.includes("CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS")
    && controlled.includes("PRODUCTION_DEPLOYED_UNIT_IDS")
    && !/PRODUCTION_DEPLOYED_UNIT_IDS = new Set<string>\(FIRST_PACK_CANONICAL_UNIT_IDS\)/.test(controlled)
    && deployed.size === 41;

  const electronic = await retrieve(["electronic-anmeldung-federal-procedure"]);
  const certificate = await retrieve(["meldebescheinigung-on-request"]);
  const abroad = await retrieve(["abmeldung-abroad-written-or-electronic"]);
  const sanction = await retrieve(["fictitious-address-fine-framework"]);
  const diplomatic = await retrieve(["diplomatic-or-treaty-exemption"], true);
  const newborn = await retrieve(["newborn-registration-if-other-dwelling"], true);
  const original = await retrieve([
    "anmeldung-duty",
    "anmeldung-deadline-two-weeks",
    "landlord-confirmation",
    "abmeldung-duty-no-new-domestic-home",
  ]);
  const genericOriginal = await retrieve(["anmeldung-duty", "anmeldung-deadline-two-weeks"]);
  const slovak = await retrieve(["anmeldung-duty", "anmeldung-deadline-two-weeks"]);
  const slovakResult = await prepareControlledQuestionKnowledge(
    {
      text: "Do koľkých dní sa musím po presťahovaní prihlásiť?",
      locale: "sk",
      environment: ENABLED,
    },
    {
      selectUnitIds: async () => ["anmeldung-duty", "anmeldung-deadline-two-weeks"],
      retrieveRows: async (_claimIds, jurisdictions) => {
        if (jurisdictions.join() !== "DE") throw new Error("locale changed jurisdiction");
        return {
          ok: true as const,
          connectionSucceeded: true as const,
          rpcInvoked: true as const,
          rpcSucceeded: true as const,
          rows: ["anmeldung-duty", "anmeldung-deadline-two-weeks"].map((id) => row(id)),
        };
      },
      report: () => undefined,
    },
  );
  const invented = await retrieve(["invented-production-claim" as never]);
  const locality = await prepareControlledQuestionKnowledge(
    {
      text: "Anmeldung in Weiltingen",
      locale: "de",
      environment: {
        ...ENABLED,
        SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED: "true",
        BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL:
          "postgresql://birello_knowledge_reader:synthetic-never-log@127.0.0.1/postgres",
        BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_NAME: "postgres",
        BIRELLO_ANMELDUNG_LOCAL_CONTEXT_READER: "birello_knowledge_reader",
      },
    },
    {
      selectUnitIds: async () => ["anmeldung-duty"],
      selectLocalityKey: async () => "markt-weiltingen",
      retrieveRows: async () => {
        throw new Error("038 must not run in local context mode");
      },
      retrieveAnmeldungContext: async () => ({
        ok: true as const,
        connectionSucceeded: true as const,
        rpcInvoked: true as const,
        rpcSucceeded: true as const,
        result: {
        packId: "anmeldung_ummeldung_abmeldung",
        family: "residence_registration_lifecycle",
        countryCode: "DE",
        federalEvidence: [{
          claimId: stablePackEntityId("claim:anmeldung-duty"),
          canonicalProposition: "Nach dem Bezug einer Wohnung ist eine Anmeldung bei der Meldebehörde erforderlich.",
          canonicalLanguage: "de",
          jurisdictionCode: "DE",
          territorialScope: null,
          handlingMode: "STORE_CANONICALLY",
          canonicalValueUsable: true,
          staleBehavior: "DO_NOT_USE_STALE",
          sourceId: "s",
          sourceVersionId: "v",
          sourcePassageId: "p",
          legalLocator: "BMG § 17 Abs. 1",
          citationReference: "BMG",
        }],
        localContext: {
          locality: {
            municipalityCode: "09571218",
            municipalityName: "Markt Weiltingen",
            jurisdictionId: "j",
            landCode: "09",
            landName: "Freistaat Bayern",
            districtCode: "09571",
            districtName: "Landkreis Ansbach",
            territorialScopeId: "scope",
          },
          authority: {
            id: "a",
            name: "Verwaltungsgemeinschaft Wilburgstetten – Bürgerbüro",
            type: "verwaltungsgemeinschaft",
            officialPortalUrl: "https://www.vg-wilburgstetten.de/",
          },
          competence: {
            id: "c",
            subjectMatter: "residence_registration_lifecycle",
            family: "residence_registration_lifecycle",
            territorialScopeId: "scope",
            receivesApplication: true,
            decidesApplication: true,
            effectiveFrom: null,
            effectiveUntil: null,
            sourceVersionId: "v",
            passageId: "p",
            locator: "competence",
            canonicalUrl: "https://www.vg-wilburgstetten.de/",
          },
          process: { id: "process", title: "Local Anmeldung process", regionalVariationExpected: true },
          evidence: [],
        },
        },
      }),
      report: () => undefined,
    },
  );

  const R07 = electronic.result.evidence.some((item) => item.canonicalUnitId === "electronic-anmeldung-federal-procedure");
  const R08 = certificate.result.evidence.some((item) => item.canonicalUnitId === "meldebescheinigung-on-request");
  const R09 = abroad.result.evidence.some((item) => item.canonicalUnitId === "abmeldung-abroad-written-or-electronic");
  const R10 = sanction.result.evidence.some((item) => item.canonicalUnitId === "fictitious-address-fine-framework");
  const R11 = diplomatic.result.evidence.length === 1
    && diplomatic.result.evidence[0]?.canonicalUnitId === "diplomatic-or-treaty-exemption"
    && diplomatic.result.evidence[0]?.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"
    && diplomatic.result.evidence[0]?.requiredContext.includes("COUNTRY")
    && !genericOriginal.result.evidence.some((item) => item.canonicalUnitId === "diplomatic-or-treaty-exemption");
  const R12 = newborn.result.evidence.length === 1
    && newborn.result.evidence[0]?.canonicalUnitId === "newborn-registration-if-other-dwelling"
    && newborn.result.evidence[0]?.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"
    && newborn.result.evidence[0]?.requiredContext.includes("RESIDENCE_STATE")
    && !genericOriginal.result.evidence.some((item) => item.canonicalUnitId === "newborn-registration-if-other-dwelling");
  const R13 = ["anmeldung-duty", "anmeldung-deadline-two-weeks", "landlord-confirmation", "abmeldung-duty-no-new-domestic-home"]
    .every((id) => original.result.evidence.some((item) => item.canonicalUnitId === id));
  const R14 = [...electronic.result.evidence, ...original.result.evidence, ...slovakResult.evidence]
    .every((item) => item.jurisdiction === "DE")
    && slovak.jurisdictions.join() === "DE"
    && slovakResult.diagnostics.jurisdiction === "DE";
  const R15 = [...electronic.result.evidence, ...original.result.evidence, ...slovakResult.evidence]
    .every((item) => item.canonicalLanguage === "de")
    && slovakResult.diagnostics.canonicalKnowledgeLanguage === "de";
  const R16 = slovakResult.diagnostics.requestedOutputLanguage === "sk"
    && !JSON.stringify(slovakResult).includes('"jurisdiction":"SK"')
    && invented.result.diagnostics.selectedCanonicalUnitCount === 0
    && invented.retrievalCalls === 0
    && invented.result.diagnostics.retrievalRpcInvoked === false;
  const R17 = locality.diagnostics.jurisdiction === "DE"
    && locality.diagnostics.municipalityCode === "09571218"
    && locality.localContext?.municipalityCode === "09571218"
    && locality.evidence.every((item) => item.jurisdiction === "DE")
    && locality.evidence.some((item) => item.canonicalUnitId === "anmeldung-duty");
  const R18 = !controlled.includes("pooler.supabase.com")
    && !controlled.includes("cdztcnfjxheudqhvepbq");
  const R19 = !controlled.includes("SMART_TALK_PUBLIC_RUNTIME")
    && !/NEXT_PUBLIC_BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL/.test(ENABLED.BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL ?? "");
  const R20 = preflight.includes("FIRST_PACK_CANONICAL_UNIT_IDS")
    && !preflight.includes("CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS")
    && FIRST_PACK_CANONICAL_UNIT_IDS.length === 28;

  const cases = {
    R01, R02, R03, R04, R05, R06, R07, R08, R09, R10,
    R11, R12, R13, R14, R15, R16, R17, R18, R19, R20,
  };
  const allPassed = Object.values(cases).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    cases,
    deployedCount: CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS.length,
    historicalFirstPackCount: FIRST_PACK_CANONICAL_UNIT_IDS.length,
    v2aCount: V2A_ADDED_CANONICAL_UNIT_IDS.length,
    unknownUnitsExposed: unknownExposed,
    productionConnectionUsed: false,
    publicRuntimeAuthorized: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    phaseResult: "FAILED",
    message: error instanceof Error ? error.message : "UNKNOWN",
  }, null, 2)}\n`);
  process.exitCode = 1;
});
