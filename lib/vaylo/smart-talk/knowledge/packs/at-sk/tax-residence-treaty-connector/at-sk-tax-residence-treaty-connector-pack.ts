/**
 * AT-SK-0K process-complete AT↔SK tax residence / treaty connector pack.
 * Orchestrates AT-SK-0I + SK national tax + AT-SK-0J without duplicating substantive truth.
 */
import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { AT_TAX_UNITS } from "../../at/personal-income-tax-residence/at-personal-income-tax-residence-pack";
import { SK_TAX_UNITS } from "../../sk/income-tax-residence/sk-income-tax-residence-pack";
import { AT_SK_TREATY_KEY, AT_SK_TREATY_UNITS } from "../bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
  AT_SK_TAX_CONNECTOR_PACK_ID,
  AT_SK_TAX_CONNECTOR_PUBLIC_RUNTIME_ALLOWED,
  AT_SK_TAX_CONNECTOR_STATUS,
  BILATERAL_TAX_JURISDICTION_LEVEL,
  BILATERAL_TAX_TRUST_DOMAIN,
  type BilateralTaxProcessDraft,
  type BilateralTaxStableRef,
  type CuratedBilateralTaxConnectorPack,
} from "../../../source-registry/bilateral-tax-treaty-contracts";
import {
  AT_SK_CONN_NEGATIVE_CONTROLS,
  AT_SK_CONN_SCENARIOS,
} from "../../../source-registry/at-sk-tax-residence-treaty-connector-core";

function item<T extends Readonly<Record<string, unknown>>>(entityClass: string, key: string, values: T) {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(AT_SK_TAX_CONNECTOR_PACK_ID, entityClass, key),
    ...values,
  });
}

function atRef(key: string): BilateralTaxStableRef {
  return Object.freeze({
    entityClass: "claims",
    key,
    sourceJurisdiction: "AT",
    trustDomain: "at",
    temporalClass: "CURRENT",
    claimRole: "austrian_domestic_tax",
  });
}

function skRef(key: string): BilateralTaxStableRef {
  return Object.freeze({
    entityClass: "claims",
    key,
    sourceJurisdiction: "SK",
    trustDomain: "sk",
    temporalClass: "CURRENT",
    claimRole: "slovak_domestic_tax",
  });
}

function treatyRef(key: string, role: "bilateral_treaty" | "mli" = "bilateral_treaty"): BilateralTaxStableRef {
  return Object.freeze({
    entityClass: "claims",
    key,
    sourceJurisdiction: role === "mli" ? "MULTILATERAL" : "BILATERAL",
    trustDomain: BILATERAL_TAX_TRUST_DOMAIN,
    temporalClass: "CURRENT",
    claimRole: role,
  });
}

type ConnUnit = Readonly<{
  key: string;
  type: "definition" | "exception" | "procedure" | "boundary";
  text: string;
}>;

export const AT_SK_CONN_UNITS: readonly ConnUnit[] = Object.freeze([
  { key: "atskconn-identity", type: "definition", text: "AT-SK-0K verbindet österreichische inländische Steuerwahrheit (0I), slowakische nationale Steuerwahrheit und AT-SK-Abkommenswahrheit (0J). Der Connector orchestriert, dupliziert keine Rechtsnormen." },
  { key: "atskconn-prepared-not-public", type: "boundary", text: "Status prepared, active false, activeCorridors 0, publicRuntimeAllowed false, localeActivationAllowed false, deployment none. Interne semantische Validierung erlaubt, keine öffentliche Laufzeit." },
  { key: "atskconn-domestic-to-treaty", type: "procedure", text: "Ablauf: inländische Fakten → inländische Steuerpflicht-/Ansässigkeitskandidatur → Doppelansässigkeitserkennung → nur bei Doppelkandidatur Artikel 4 (0J-Kern) → Einkunftsart → Vertragsartikel → Besteuerungsrechtskandidat → Entlastungskandidat → sicherer nächster Schritt." },
  { key: "atskconn-no-duplicate-truth", type: "boundary", text: "Keine Kopie von 0I-, SK- oder 0J-Claims in den Connector. Nur Referenzen und Orchestrator-Grenzen." },
  { key: "atskconn-art4-only-dual", type: "procedure", text: "Artikel-4-Tie-Breaker nur bei nachgewiesener Doppelkandidatur beider inländischer Ansässigkeiten. Ein Staat allein: kein Artikel-4-Lauf." },
  { key: "atskconn-evidence-fail-closed", type: "procedure", text: "Fehlende Wohnstätten-, Mittelpunkt-, Aufenthalts- oder Einkunftsnachweise: EVIDENCE_REQUIRED, kein erfundenes Ergebnis." },
  { key: "atskconn-relief-after-taxing-right", type: "procedure", text: "Entlastungsmethode erst nach Vertragsansässigkeit, Einkunftsart und Besteuerungsrechtskandidat. Abkommensansässigkeit allein bestimmt nicht die Methode." },
  { key: "atskconn-mli-version-layer", type: "procedure", text: "MLI-/Vertragsschicht aus 0J nach Steuerjahr, Ereignisart und Richtung wählen. Kein globales MLI=true ab 2019." },
  { key: "atskconn-ppt-propagation", type: "procedure", text: "PPT_REVIEW_REQUIRED und ANTI_ABUSE_REVIEW_REQUIRED aus 0J unverändert weitergeben. Keine automatische Merits-Entscheidung." },
  { key: "atskconn-tax-amount-oos", type: "boundary", text: "TAX_AMOUNT_NOT_AUTHORIZED / EXPLICITLY_OUT_OF_SCOPE für Steuerbeträge, Buchhaltung, Lohnsteuerrechner." },
  { key: "atskconn-treaty-expansion-oos", type: "boundary", text: "Dividenden, Zinsen, Renten, Kapitalgewinne und nicht in 0J V1 abgeschlossene Artikel: TREATY_EXPANSION_REQUIRED / EXPLICITLY_OUT_OF_SCOPE." },
  { key: "atskconn-de-sk-isolation", type: "boundary", text: "Keine DE-SK-Vertragssubstanz, keine DE_SK_*-Schlüsse, keine deutschen Steuerfakten als AT-SK-Wahrheit." },
]);

const AT_DOMESTIC_KEYS = Object.freeze([
  "at-tax-domestic-not-treaty-residence",
  "at-tax-domestic-not-final-treaty-right",
  "at-tax-six-months-not-183-treaty",
  "at-tax-wohnsitz-bao-26-1",
  "at-tax-unlimited-section-1-2",
  "at-tax-limited-section-1-3",
  "at-tax-a1-not-tax-certificate",
  "at-tax-dla-not-tax-registration",
  "at-tax-meldezettel-not-automatic-wohnsitz",
  "at-tax-nationality-not-residence",
]);

const SK_DOMESTIC_KEYS = Object.freeze([
  "sk-tax-domestic-candidate-or",
  "sk-tax-section-1-treaty-precedence",
  "sk-tax-trvaly-not-treaty-residence",
  "sk-tax-domestic-183-not-art15",
  "sk-tax-not-social-security",
  "sk-tax-relief-handoff",
]);

const TREATY_KEYS = Object.freeze([
  "atsk-dual-domestic-candidate",
  "atsk-domestic-not-treaty",
  "atsk-art4-sequence",
  "atsk-art4-nationality-first-rejected",
  "atsk-art4-map-terminal",
  "atsk-art15-three-conditions",
  "atsk-art15-calendar-year",
  "atsk-fixed-base-not-pe",
  "atsk-art14-base",
  "atsk-art5-construction-threshold",
  "atsk-art23-sk-mli-option-c",
  "atsk-art23-at-exemption-mli-a",
  "atsk-select-treaty-version",
  "atsk-mli-art7-ppt",
  "atsk-no-calculator",
]);

function dim(overrides: Partial<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>) {
  const base = {
    what: "atskconn-identity",
    whoWhen: "atskconn-domestic-to-treaty",
    documents: "atskconn-evidence-fail-closed",
    how: "atskconn-domestic-to-treaty",
    next: "atskconn-relief-after-taxing-right",
    deadlines: "atskconn-mli-version-layer",
    problems: "atskconn-evidence-fail-closed",
    dutiesAfter: "atskconn-domestic-to-treaty",
    institution: "atskconn-identity",
    boundaries: "atskconn-no-duplicate-truth",
    freshness: "atskconn-mli-version-layer",
    negatives: "atskconn-prepared-not-public",
  };
  return Object.freeze({ ...base, ...overrides });
}

type ProcessSpec = Readonly<{
  processKey: string;
  processGroupId: "TAX_RESIDENCE" | "EMPLOYMENT_INCOME" | "INDEPENDENT_WORK" | "DOUBLE_TAX_RELIEF";
  title: string;
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
  extraRefs?: readonly BilateralTaxStableRef[];
}>;

export const AT_SK_CONN_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { processKey: "atskconn-case-classify", processGroupId: "TAX_RESIDENCE", title: "AT-SK-Steuerfall einordnen", dimensions: dim({ what: "atskconn-identity", how: "atskconn-domestic-to-treaty" }), extraRefs: [atRef("at-tax-domestic-not-treaty-residence"), skRef("sk-tax-section-1-treaty-precedence"), treatyRef("atsk-domestic-not-treaty")] },
  { processKey: "atskconn-at-domestic-only", processGroupId: "TAX_RESIDENCE", title: "Nur AT inländisch", dimensions: dim({ what: "at-tax-unlimited-section-1-2", boundaries: "at-tax-domestic-not-treaty-residence" }), extraRefs: [atRef("at-tax-unlimited-section-1-2"), atRef("at-tax-domestic-not-treaty-residence"), treatyRef("atsk-art4-sequence")] },
  { processKey: "atskconn-sk-domestic-employment-at", processGroupId: "EMPLOYMENT_INCOME", title: "SK inländisch, Arbeit in AT", dimensions: dim({ what: "sk-tax-domestic-candidate-or", how: "atsk-art15-base", negatives: "atsk-art15-calendar-year" }), extraRefs: [skRef("sk-tax-domestic-candidate-or"), treatyRef("atsk-art15-base"), treatyRef("atsk-art15-calendar-year")] },
  { processKey: "atskconn-dual-domestic-detect", processGroupId: "TAX_RESIDENCE", title: "Doppelte inländische Kandidatur", dimensions: dim({ what: "atsk-dual-domestic-candidate", how: "atskconn-art4-only-dual" }), extraRefs: [atRef("at-tax-domestic-not-treaty-residence"), skRef("sk-tax-domestic-candidate-or"), treatyRef("atsk-dual-domestic-candidate")] },
  { processKey: "atskconn-art4-permanent-home", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 ständige Wohnstätte", dimensions: dim({ what: "atsk-art4-permanent-home", how: "atsk-art4-sequence", negatives: "atsk-art4-permanent-home" }), extraRefs: [atRef("at-tax-meldezettel-not-automatic-wohnsitz"), treatyRef("atsk-art4-permanent-home")] },
  { processKey: "atskconn-art4-centre-vital", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 Mittelpunkt", dimensions: dim({ what: "atsk-art4-centre-vital", how: "atsk-art4-centre-vital" }), extraRefs: [treatyRef("atsk-art4-centre-vital"), atRef("at-tax-domestic-not-treaty-residence")] },
  { processKey: "atskconn-art4-habitual-nationality-map", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 Aufenthalt, Staatsangehörigkeit, MAP", dimensions: dim({ what: "atsk-art4-habitual-abode", problems: "atsk-art4-map-terminal", negatives: "atsk-art4-nationality-first-rejected" }), extraRefs: [treatyRef("atsk-art4-habitual-abode"), treatyRef("atsk-art4-nationality"), treatyRef("atsk-art4-map-terminal")] },
  { processKey: "atskconn-art4-nationality-first-reject", processGroupId: "TAX_RESIDENCE", title: "Staatsangehörigkeit zu früh abgelehnt", dimensions: dim({ negatives: "atsk-art4-nationality-first-rejected" }), extraRefs: [treatyRef("atsk-art4-nationality-first-rejected"), atRef("at-tax-nationality-not-residence")] },
  { processKey: "atskconn-art15-route", processGroupId: "EMPLOYMENT_INCOME", title: "Artikel 15 Routing", dimensions: dim({ what: "atsk-art15-base", how: "atsk-art15-three-conditions" }), extraRefs: [treatyRef("atsk-art15-base"), treatyRef("atsk-art15-three-conditions"), atRef("at-tax-six-months-not-183-treaty"), skRef("sk-tax-domestic-183-not-art15")] },
  { processKey: "atskconn-art15-reject-contamination", processGroupId: "EMPLOYMENT_INCOME", title: "Art.15 Verunreinigungen ablehnen", dimensions: dim({ negatives: "atsk-art15-calendar-year", problems: "atsk-art15-three-conditions" }), extraRefs: [atRef("at-tax-six-months-not-183-treaty"), atRef("at-tax-a1-not-tax-certificate"), treatyRef("atsk-art15-calendar-year")] },
  { processKey: "atskconn-art14-route", processGroupId: "INDEPENDENT_WORK", title: "Artikel 14 Routing", dimensions: dim({ what: "atsk-art14-base", how: "atsk-art14-attribution", negatives: "atsk-fixed-base-not-pe" }), extraRefs: [treatyRef("atsk-art14-base"), treatyRef("atsk-fixed-base-not-pe"), atRef("at-tax-dla-not-tax-registration")] },
  { processKey: "atskconn-art14-fixed-base-reject-dla", processGroupId: "INDEPENDENT_WORK", title: "DLA/A1 nicht feste Einrichtung", dimensions: dim({ negatives: "atsk-fixed-base-not-pe" }), extraRefs: [atRef("at-tax-dla-not-tax-registration"), atRef("at-tax-a1-not-tax-certificate"), treatyRef("atsk-fixed-base-not-pe")] },
  { processKey: "atskconn-art5-bounded-pe", processGroupId: "INDEPENDENT_WORK", title: "Begrenztes Art.5/7 PE-Routing", dimensions: dim({ what: "atsk-art5-construction-threshold", boundaries: "atsk-art5-not-gewerbe" }), extraRefs: [treatyRef("atsk-art5-construction-threshold"), treatyRef("atsk-art5-not-gewerbe")] },
  { processKey: "atskconn-relief-sk-direction", processGroupId: "DOUBLE_TAX_RELIEF", title: "Entlastung SK-Abkommensansässiger", dimensions: dim({ what: "atsk-art23-sk-mli-option-c", how: "atsk-art23-directional" }), extraRefs: [treatyRef("atsk-art23-sk-mli-option-c", "mli"), skRef("sk-tax-relief-handoff")] },
  { processKey: "atskconn-relief-at-direction", processGroupId: "DOUBLE_TAX_RELIEF", title: "Entlastung AT-Abkommensansässiger", dimensions: dim({ what: "atsk-art23-at-exemption-mli-a", how: "atsk-art23-directional" }), extraRefs: [treatyRef("atsk-art23-at-exemption-mli-a", "mli"), atRef("at-tax-domestic-not-final-treaty-right")] },
  { processKey: "atskconn-mli-version-select", processGroupId: "DOUBLE_TAX_RELIEF", title: "MLI-/Vertragsschicht wählen", dimensions: dim({ what: "atsk-select-treaty-version", how: "atskconn-mli-version-layer" }), extraRefs: [treatyRef("atsk-select-treaty-version"), treatyRef("atsk-mli-withholding-dates", "mli")] },
  { processKey: "atskconn-ppt-anti-abuse", processGroupId: "DOUBLE_TAX_RELIEF", title: "PPT / Anti-Abuse weitergeben", dimensions: dim({ what: "atsk-mli-art7-ppt", how: "atskconn-ppt-propagation" }), extraRefs: [treatyRef("atsk-mli-art7-ppt", "mli")] },
  { processKey: "atskconn-evidence-required", processGroupId: "TAX_RESIDENCE", title: "Nachweise fehlen fail-closed", dimensions: dim({ problems: "atskconn-evidence-fail-closed", next: "atskconn-evidence-fail-closed" }) },
  { processKey: "atskconn-out-of-scope", processGroupId: "DOUBLE_TAX_RELIEF", title: "Außerhalb 0K/0J V1", dimensions: dim({ boundaries: "atskconn-treaty-expansion-oos", negatives: "atskconn-tax-amount-oos" }), extraRefs: [treatyRef("atsk-no-calculator")] },
  { processKey: "atskconn-negative-controls", processGroupId: "TAX_RESIDENCE", title: "Cross-domain negative controls", dimensions: dim({ negatives: "atskconn-de-sk-isolation", boundaries: "atskconn-no-duplicate-truth" }), extraRefs: [skRef("sk-tax-not-social-security"), skRef("sk-tax-trvaly-not-treaty-residence")] },
]);

function dimensionKeyKnown(key: string): boolean {
  return AT_SK_CONN_UNITS.some((unit) => unit.key === key)
    || AT_TAX_UNITS.some((unit) => unit.key === key)
    || SK_TAX_UNITS.some((unit) => unit.key === key)
    || AT_SK_TREATY_UNITS.some((unit) => unit.key === key);
}

export function evaluateAtSkTaxConnectorProcessCompleteness() {
  const incomplete = AT_SK_CONN_PROCESSES.filter((process) =>
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !dimensionKeyKnown(process.dimensions[dimension])));
  const blocked = AT_SK_CONN_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_SK_CONN_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_SK_CONN_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const processComplete = incomplete.length === 0 && blocked.length === 0;
  return Object.freeze({
    processCount: AT_SK_CONN_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: AT_SK_CONN_SCENARIOS.length,
    negativeControlCount: AT_SK_CONN_NEGATIVE_CONTROLS.length,
    incompleteProcessKeys: incomplete.map((process) => process.processKey),
  });
}

export function buildAtSkTaxResidenceTreatyConnectorPack(): CuratedBilateralTaxConnectorPack {
  const trust = item("trustDomain", "bilateral_tax_treaty", {
    code: BILATERAL_TAX_TRUST_DOMAIN,
    name: "Bilateral tax treaty provenance",
  });
  const jurisdiction = item("jurisdictions", "at-sk-connector", {
    level: BILATERAL_TAX_JURISDICTION_LEVEL,
    code: AT_SK_TREATY_KEY,
    treatyCountries: ["AT", "SK"] as const,
    countryCode: null,
    authorityCountry: "MULTILATERAL" as const,
  });
  const scope = item("territorialScopes", "at-sk-connector", {
    type: "bilateral_tax_connector",
    jurisdictionIds: [jurisdiction.id],
    treatyCountries: ["AT", "SK"] as const,
  });
  const publisher = item("publishers", "at-sk-tax-connector", {
    name: "AT-SK tax residence treaty connector",
    type: "bilateral_tax_connector",
    territorialScopeId: scope.id,
    trustDomainId: trust.id,
  });
  const authority = item("authorities", "at-sk-tax-connector-authority", {
    publisherId: publisher.id,
    name: "AT-SK tax residence / treaty connector orchestration",
    type: "bilateral_tax_connector",
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityCountry: "MULTILATERAL" as const,
  });
  const claims = AT_SK_CONN_UNITS.map((unit) => item("claims", unit.key, {
    type: unit.type,
    text: unit.text,
    riskLevel: "high" as const,
    temporalClass: "CURRENT" as const,
    claimRole: "bilateral_treaty" as const,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityId: authority.id,
  }));
  const claimUnits: BilateralTaxStableRef[] = [
    ...AT_SK_CONN_UNITS.map((unit) => treatyRef(unit.key)),
    ...AT_DOMESTIC_KEYS.map(atRef),
    ...SK_DOMESTIC_KEYS.map(skRef),
    ...TREATY_KEYS.map((key) => treatyRef(key)),
  ];
  const versions = [
    {
      temporalVersion: "base_treaty_1978",
      effectiveFrom: "1979-02-12",
      effectiveTo: "2018-12-31",
      baseTreatyDate: "1978-03-07",
      mliModified: false,
      mliEffectiveFrom: null,
      taxType: "OTHER",
      sourceKind: "AUTHENTIC_BILATERAL_TREATY" as const,
      sourceVersion: "base-1978",
    },
    {
      temporalVersion: "mli_sk_other_from_2019_07",
      effectiveFrom: "2019-07-01",
      effectiveTo: null,
      baseTreatyDate: "1978-03-07",
      mliModified: true,
      mliEffectiveFrom: "2019-07-01",
      deMliSignatureDate: "2017-09-22",
      skMliSignatureDate: "2018-09-20",
      deMliEntryIntoForce: "2018-07-01",
      skMliEntryIntoForce: "2019-01-01",
      taxType: "OTHER_TAX_SK_TAXABLE_PERIODS",
      sourceKind: "MLI_MATCHING_POSITION" as const,
      sourceVersion: "mli-sk-other-2019-07",
    },
  ] as const;
  const roleByKey = new Map(AT_SK_TREATY_UNITS.map((unit) => [unit.key, unit.role]));
  const processes: BilateralTaxProcessDraft[] = versions.flatMap((version) =>
    AT_SK_CONN_PROCESSES.map((spec) => {
      const dimensionRefs = PROCESS_COMPLETE_DIMENSIONS.map((dimension) => {
        const key = spec.dimensions[dimension];
        if (key.startsWith("at-tax-")) return atRef(key);
        if (key.startsWith("sk-tax-")) return skRef(key);
        if (key.startsWith("atskconn-")) return treatyRef(key);
        return treatyRef(key, roleByKey.get(key) ?? "bilateral_treaty");
      });
      const unique = new Map<string, BilateralTaxStableRef>();
      for (const ref of [...dimensionRefs, ...(spec.extraRefs ?? [])]) {
        unique.set(`${ref.claimRole}:${ref.key}`, ref);
      }
      return Object.freeze({
        processGroupId: spec.processGroupId,
        processKey: spec.processKey,
        temporalVersion: version.temporalVersion,
        claimRefs: [...unique.values()],
        dimensions: spec.dimensions,
      });
    }));
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_SK_TAX_CONNECTOR_PACK_ID,
    treatyKey: AT_SK_TREATY_KEY,
    countryA: "AT",
    countryB: "SK",
    canonicalLanguage: "de",
    topicFamily: "TAX_TREATY",
    lifecycleState: "draft",
    connectorStatus: AT_SK_TAX_CONNECTOR_STATUS,
    localeActivationAllowed: AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
    deployment: "none",
    sourceRefs: [treatyRef("atskconn-identity"), treatyRef("atskconn-prepared-not-public")],
    claimUnits,
    processGroups: ["TAX_RESIDENCE", "EMPLOYMENT_INCOME", "INDEPENDENT_WORK", "DOUBLE_TAX_RELIEF"] as const,
    effectiveFrom: "1979-02-12",
    effectiveTo: null,
    temporalVersion: "mli_sk_other_from_2019_07",
    active: false,
    publicRuntimeAllowed: AT_SK_TAX_CONNECTOR_PUBLIC_RUNTIME_ALLOWED,
    trustDomain: trust,
    jurisdiction,
    territorialScope: scope,
    publisher,
    authority,
    claims,
    versions: [...versions],
    processes,
  });
}

export {
  AT_SK_TAX_CONNECTOR_PACK_ID,
  AT_SK_TAX_CONNECTOR_STATUS,
  AT_SK_CONN_NEGATIVE_CONTROLS,
  AT_SK_CONN_SCENARIOS,
};
