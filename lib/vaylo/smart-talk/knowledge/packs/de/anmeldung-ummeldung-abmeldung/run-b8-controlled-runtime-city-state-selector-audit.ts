/**
 * B8 controlled-runtime city-state selector audit.
 * Deterministic selector + mocked local-context wiring only.
 * No production connection, write, migration, or public runtime change.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import { CITY_STATE_AGS } from "./anmeldung-city-state-service-area-packs";
import {
  ANMELDUNG_KNOWN_LOCALITIES,
  ANMELDUNG_REJECTED_LOCALITY_IDENTITIES,
  isRejectedAnmeldungLocalityProposal,
  validateAnmeldungLocalityProposal,
} from "./anmeldung-locality-selector";
import {
  prepareControlledQuestionKnowledge,
  type ControlledKnowledgeDiagnostics,
} from "./controlled-runtime-retrieval";

const ROOT = process.cwd();
const UNITS = ["anmeldung-duty", "anmeldung-deadline-two-weeks"];
const LOCAL_ENV: NodeJS.ProcessEnv = {
  NODE_ENV: "test",
  SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED: "true",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL: "postgresql://birello_knowledge_reader:local@127.0.0.1/b8",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_NAME: "b8",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_READER: "birello_knowledge_reader",
};
const LOCALITIES = Object.freeze({
  "markt-weiltingen": { municipalityCode: "09571218", municipalityName: "Markt Weiltingen" },
  berlin: { municipalityCode: CITY_STATE_AGS.berlin, municipalityName: "Berlin" },
  bremen: { municipalityCode: CITY_STATE_AGS.bremenCity, municipalityName: "Stadtgemeinde Bremen" },
  hamburg: { municipalityCode: CITY_STATE_AGS.hamburg, municipalityName: "Hamburg" },
});

function source(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

function context(municipalityCode: string | null) {
  const match = Object.values(LOCALITIES).find((locality) => locality.municipalityCode === municipalityCode);
  return {
    packId: "anmeldung_ummeldung_abmeldung",
    family: "residence_registration_lifecycle",
    countryCode: "DE",
    federalEvidence: UNITS.map((id) => ({
      claimId: `claim:${id}`,
      canonicalProposition: id,
      canonicalLanguage: "de",
      jurisdictionCode: "DE",
      territorialScope: null,
      handlingMode: "STORE_CANONICALLY",
      canonicalValueUsable: true,
      staleBehavior: "REVALIDATE_BEFORE_USE",
      sourceId: "s",
      sourceVersionId: "v",
      sourcePassageId: "p",
      legalLocator: "BMG",
      citationReference: "BMG",
    })),
    localContext: match ? {
      locality: {
        municipalityCode: match.municipalityCode,
        municipalityName: match.municipalityName,
        jurisdictionId: "j",
        landCode: "land",
        landName: "Land",
        districtCode: null,
        districtName: null,
        territorialScopeId: "scope",
      },
      authority: {
        id: "a",
        name: "fixture-authority",
        type: "buergeramt",
        officialPortalUrl: "https://official.example/authority",
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
        canonicalUrl: "https://official.example/competence",
      },
      process: { id: "process", title: "Local Anmeldung process", regionalVariationExpected: true },
      evidence: [],
    } : null,
  };
}

async function prepared(
  localityKey: unknown,
  options: { text?: string; locale?: "sk" | "de" | "en"; units?: unknown } = {},
) {
  const reports: ControlledKnowledgeDiagnostics[] = [];
  const result = await prepareControlledQuestionKnowledge(
    {
      text: options.text ?? "Anmeldung locality fixture",
      locale: options.locale ?? "sk",
      environment: LOCAL_ENV,
    },
    {
      selectUnitIds: async () => options.units ?? UNITS,
      selectLocalityKey: async () => localityKey,
      retrieveRows: async () => {
        throw new Error("federal retrieval must not run in B8 local-context mode");
      },
      retrieveAnmeldungContext: async (_ids, municipalityCode) => ({
        ok: true as const,
        result: context(municipalityCode),
        connectionSucceeded: true as const,
        rpcInvoked: true as const,
        rpcSucceeded: true as const,
      }),
      report: (report) => reports.push(report),
    },
  );
  return { result, reports };
}

function locality(key: string) {
  return ANMELDUNG_KNOWN_LOCALITIES.find((item) => item.key === key);
}

async function main(): Promise<void> {
  const selectorSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "anmeldung-ummeldung-abmeldung", "anmeldung-locality-selector.ts",
  );
  const runtimeSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "anmeldung-ummeldung-abmeldung", "controlled-runtime-retrieval.ts",
  );
  const weiltingen = locality("markt-weiltingen");
  const berlin = locality("berlin");
  const bremen = locality("bremen");
  const hamburg = locality("hamburg");
  const rejected = ANMELDUNG_REJECTED_LOCALITY_IDENTITIES[0];
  const locales = ["sk", "de", "en"] as const;
  const localeTexts = [
    "Slovak / slovensky UI",
    "České rozhraní",
    "Polski interfejs",
    "Magyar felület",
    "English UI",
    "Deutsche Oberfläche",
  ];
  const inferred = [
    "de", "sk", "en", "cs", "pl", "hu",
    "DE", "DE-BE", "DE-HB", "DE-HH", "DE-BY",
    "service.berlin.de", "www.service.bremen.de", "www.hamburg.de",
    "Service Berlin", "Serviceportal Bremen", "Freie und Hansestadt Hamburg",
    "Deutschland", "Germany", "11000000", "04011000", "02000000", "09571218",
    "Berlin", "Bremen", "Hamburg", "Weiltingen", "Markt Weiltingen",
    "Freie Hansestadt Bremen", "Land Berlin",
  ];
  const weiltingenRuntime = await prepared("markt-weiltingen", { text: "Prisťahoval som sa do Weiltingenu." });
  const berlinRuntime = await prepared("berlin", { text: "Ich ziehe nach Berlin." });
  const bremenRuntime = await prepared("bremen", { text: "Anmeldung in Bremen." });
  const hamburgRuntime = await prepared("hamburg", { text: "I moved to Hamburg." });
  const bremerhavenRuntime = await prepared("bremen", { text: "Anmeldung in Bremerhaven." });
  const bremerhavenAgsRuntime = await prepared("bremen", { text: "AGS 04012000 registration" });
  const bremerhavenKeyRuntime = await prepared("bremerhaven", { text: "Bremerhaven" });
  const unsupportedRuntime = await prepared("muenchen", { text: "Anmeldung in München." });
  const localeRuntimes = await Promise.all(locales.map((locale) =>
    Promise.all([
      prepared("berlin", { locale, text: "Berlin" }),
      prepared("bremen", { locale, text: "Bremen" }),
      prepared("hamburg", { locale, text: "Hamburg" }),
      prepared("markt-weiltingen", { locale, text: "Weiltingen" }),
    ]),
  ));
  const cases = {
    weiltingenPreserved:
      weiltingen?.key === "markt-weiltingen"
      && weiltingen.municipalityCode === "09571218"
      && weiltingen.municipalityName === "Markt Weiltingen"
      && JSON.stringify(weiltingen.aliases) === JSON.stringify(["Weiltingen", "Markt Weiltingen"])
      && validateAnmeldungLocalityProposal("markt-weiltingen")?.municipalityCode === "09571218"
      && weiltingenRuntime.result.diagnostics.municipalityCode === "09571218"
      && weiltingenRuntime.result.localContext?.municipalityCode === "09571218",
    berlinResolves:
      berlin?.municipalityCode === CITY_STATE_AGS.berlin
      && berlin.landCode === "DE-BE"
      && berlin.municipalityName === "Berlin"
      && validateAnmeldungLocalityProposal("berlin")?.municipalityCode === "11000000"
      && berlinRuntime.result.diagnostics.municipalityCode === "11000000"
      && berlinRuntime.result.localContext?.municipalityCode === "11000000",
    bremenResolves:
      bremen?.municipalityCode === CITY_STATE_AGS.bremenCity
      && bremen.landCode === "DE-HB"
      && bremen.municipalityName === "Stadtgemeinde Bremen"
      && validateAnmeldungLocalityProposal("bremen")?.municipalityCode === "04011000"
      && bremenRuntime.result.diagnostics.municipalityCode === "04011000"
      && bremenRuntime.result.localContext?.municipalityCode === "04011000",
    hamburgResolves:
      hamburg?.municipalityCode === CITY_STATE_AGS.hamburg
      && hamburg.landCode === "DE-HH"
      && hamburg.municipalityName === "Hamburg"
      && validateAnmeldungLocalityProposal("hamburg")?.municipalityCode === "02000000"
      && hamburgRuntime.result.diagnostics.municipalityCode === "02000000"
      && hamburgRuntime.result.localContext?.municipalityCode === "02000000",
    bremerhavenRejected:
      rejected?.municipalityCode === CITY_STATE_AGS.bremerhaven
      && rejected.key === "bremerhaven"
      && isRejectedAnmeldungLocalityProposal("bremerhaven")
      && isRejectedAnmeldungLocalityProposal("04012000")
      && isRejectedAnmeldungLocalityProposal("Bremerhaven")
      && validateAnmeldungLocalityProposal("bremerhaven") === null
      && validateAnmeldungLocalityProposal("04012000") === null
      && validateAnmeldungLocalityProposal("bremen", "Anmeldung in Bremerhaven") === null
      && validateAnmeldungLocalityProposal("bremen", { text: "Moved to AGS 04012000" }) === null
      && validateAnmeldungLocalityProposal("bremen", "Bremen city registration")?.municipalityCode === "04011000"
      && !bremen!.aliases.includes("Bremerhaven")
      && !ANMELDUNG_KNOWN_LOCALITIES.some((item) => item.municipalityCode === "04012000")
      && bremerhavenRuntime.result.localContext === null
      && bremerhavenRuntime.result.diagnostics.municipalityCode === null
      && bremerhavenAgsRuntime.result.diagnostics.municipalityCode === null
      && bremerhavenKeyRuntime.result.diagnostics.municipalityCode === null,
    unsupportedFailClosed:
      validateAnmeldungLocalityProposal("muenchen") === null
      && validateAnmeldungLocalityProposal("frankfurt") === null
      && validateAnmeldungLocalityProposal(null) === null
      && validateAnmeldungLocalityProposal({ key: "berlin" }) === null
      && unsupportedRuntime.result.localContext === null
      && unsupportedRuntime.result.diagnostics.municipalityCode === null,
    noInferenceFromNonLocalityFacts:
      inferred.every((value) => validateAnmeldungLocalityProposal(value) === null)
      && validateAnmeldungLocalityProposal(null, {
        locale: "de",
        hostname: "service.berlin.de",
        publisher: "Service Berlin",
        country: "DE",
        land: "DE-BE",
      }) === null
      && validateAnmeldungLocalityProposal("berlin", {
        locale: "sk",
        hostname: "service.berlin.de",
        publisher: "Service Berlin",
        country: "DE",
        land: "DE-BE",
      })?.municipalityCode === "11000000"
      && validateAnmeldungLocalityProposal("bremen", { land: "DE-HB" })?.municipalityCode === "04011000",
    localeDoesNotSelectJurisdiction:
      localeTexts.every((text) =>
        validateAnmeldungLocalityProposal("berlin", text)?.municipalityCode === "11000000"
        && validateAnmeldungLocalityProposal("bremen", text)?.municipalityCode === "04011000"
        && validateAnmeldungLocalityProposal(null, text) === null
      )
      && localeRuntimes.every((group) =>
        group[0]!.result.diagnostics.municipalityCode === "11000000"
        && group[1]!.result.diagnostics.municipalityCode === "04011000"
        && group[2]!.result.diagnostics.municipalityCode === "02000000"
        && group[3]!.result.diagnostics.municipalityCode === "09571218"
        && group[0]!.result.diagnostics.jurisdiction === "DE"
        && group[0]!.result.diagnostics.canonicalKnowledgeLanguage === "de"
      )
      && !/userLocale|user_locale/.test(selectorSource)
      && !selectorSource.includes("requestedOutputLanguage"),
    existingContractPreserved:
      ANMELDUNG_KNOWN_LOCALITIES.length === 4
      && ANMELDUNG_KNOWN_LOCALITIES.every((item, index, list) =>
        list.findIndex((other) => other.key === item.key || other.municipalityCode === item.municipalityCode) === index
      )
      && runtimeSource.includes("validateAnmeldungLocalityProposal(localityProposal, input.text)")
      && !runtimeSource.includes("publicRuntimeAuthorized = true")
      && !selectorSource.includes("fetch(")
      && !selectorSource.includes("new Client"),
  };
  const allPassed = Object.values(cases).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    cases,
    allPassed,
    weiltingen: weiltingenRuntime.result.diagnostics.municipalityCode,
    berlin: berlinRuntime.result.diagnostics.municipalityCode,
    bremen: bremenRuntime.result.diagnostics.municipalityCode,
    hamburg: hamburgRuntime.result.diagnostics.municipalityCode,
    bremerhavenRejected: bremerhavenRuntime.result.diagnostics.municipalityCode === null,
    publicRuntimeAuthorized: false,
    standaloneFirstContactModeIntroduced: false,
    productionInteractionPerformed: false,
    productionConnectionAttempted: false,
    productionWriteAttempted: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "B8 city-state selector audit failed"}\n`);
  process.exitCode = 1;
});
