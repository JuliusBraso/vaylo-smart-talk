/**
 * Federal Anmeldung curated pack uses the historical migration 037 ingestion
 * contract: PACK_ENTITY_IDS and stablePackEntityId. Knowledge Factory 041 uses a
 * different deterministic identity namespace and does not write retrieval
 * metadata. Do not mix the two for this pack.
 *
 * LEGACY_ANMELDUNG_037_TO_FACTORY_041_COMPATIBILITY — non-blocking technical
 * debt. A reconciliation bridge is out of scope until there is a concrete
 * reason to migrate this historical pack onto the Factory contract.
 */
import crypto from "node:crypto";

import { PACK_ENTITY_IDS as IDS, stablePackEntityId as stableId } from "./identity";
import {
  BMG_PASSAGES,
  BMG_SOURCE,
  CANONICAL_LANGUAGE,
  CANONICAL_UNITS,
  FEDERAL_JURISDICTION_CODE,
  FIRST_PACK_CANONICAL_UNIT_IDS,
  PACK_ID,
  type CanonicalUnit,
} from "./pack";

const processes = [
  { id: IDS.anmeldungProcess, title: "Anmeldung einer Wohnung", trigger: "Einzug in eine Wohnung", firstStep: "Anmeldung innerhalb der gesetzlichen Frist vorbereiten." },
  { id: IDS.ummeldungProcess, title: "Ummeldung bei Umzug innerhalb Deutschlands", trigger: "Bezug einer neuen Wohnung im Inland", firstStep: "Anmeldung bei der neuen Meldebehörde vorbereiten." },
  { id: IDS.abmeldungProcess, title: "Abmeldung bei Wegzug ohne neue Wohnung im Inland", trigger: "Auszug ohne neue Wohnung im Inland", firstStep: "Abmeldung innerhalb der gesetzlichen Frist vorbereiten." },
] as const;

const stepSpecs = [
  { processId: IDS.anmeldungProcess, type: "anmeldung", title: "Wohnung anmelden" },
  { processId: IDS.ummeldungProcess, type: "ummeldung", title: "Neue Wohnung anmelden" },
  { processId: IDS.abmeldungProcess, type: "abmeldung", title: "Wegzug abmelden" },
] as const;

const FIRST_PACK_UNIT_ID_SET = new Set<string>(FIRST_PACK_CANONICAL_UNIT_IDS);

function firstPackUnits(): readonly CanonicalUnit[] {
  return CANONICAL_UNITS.filter((unit) => FIRST_PACK_UNIT_ID_SET.has(unit.id));
}

function firstPackPassages() {
  const passageIds = new Set(firstPackUnits().map((unit) => unit.passageId));
  return BMG_PASSAGES.filter((passage) => passageIds.has(passage.id));
}

function firstPackVersionContentHash(): string {
  return crypto.createHash("sha256").update(firstPackPassages().map((item) => item.text).join("\n")).digest("hex");
}

export function buildCuratedIngestionPayload(): Readonly<Record<string, unknown>> {
  const versionHash = firstPackVersionContentHash();
  return Object.freeze({
    packId: PACK_ID,
    canonicalLanguage: CANONICAL_LANGUAGE,
    trustDomain: { id: IDS.trustDomain, code: "de", name: "Deutschland" },
    jurisdiction: { id: IDS.jurisdiction, level: "de_federal", code: FEDERAL_JURISDICTION_CODE, countryCode: "DE", name: "Bundesrepublik Deutschland" },
    territorialScope: { id: IDS.territorialScope, type: "national", jurisdictionIds: [IDS.jurisdiction] },
    publisher: { id: IDS.publisher, name: BMG_SOURCE.publisher, territorialScopeId: IDS.territorialScope, trustDomainId: IDS.trustDomain },
    authority: { id: IDS.authority, publisherId: IDS.publisher, name: BMG_SOURCE.publisher, jurisdictionId: IDS.jurisdiction, territorialScopeId: IDS.territorialScope, url: BMG_SOURCE.canonicalUrl },
    source: { id: IDS.source, publisherId: IDS.publisher, canonicalUrl: BMG_SOURCE.canonicalUrl, normalizedOrigin: BMG_SOURCE.normalizedOrigin, jurisdictionId: IDS.jurisdiction, territorialScopeId: IDS.territorialScope, authorityId: IDS.authority },
    sourceVersion: { id: IDS.version, sourceId: IDS.source, contentHash: versionHash },
    passages: BMG_PASSAGES.map((passage, order) => ({ id: stableId(passage.id), order, locator: passage.locator, text: passage.text, textHash: crypto.createHash("sha256").update(passage.text).digest("hex") })),
    claims: CANONICAL_UNITS.map((unit) => {
      const passage = BMG_PASSAGES.find((item) => item.id === unit.passageId);
      if (!passage) throw new Error(`Missing passage ${unit.passageId}`);
      return { id: stableId(`claim:${unit.id}`), unitId: unit.id, type: unit.claimType, text: unit.text, jurisdictionId: IDS.jurisdiction, territorialScopeId: IDS.territorialScope, authorityId: IDS.authority, passageId: stableId(unit.passageId), evidenceId: stableId(`evidence:${unit.id}`), citationId: stableId(`citation:${unit.id}`), citationLabel: passage.locator, citationUrl: passage.url };
    }),
    actorRule: { id: IDS.actorRule, jurisdictionId: IDS.jurisdiction, territorialScopeId: IDS.territorialScope },
    processes,
    deadlines: [
      { id: stableId("deadline:anmeldung"), type: "anmeldung", event: "einzug", source: "einzug", duration: 2, unit: "weeks", passageId: stableId("bmg-17-1") },
      { id: stableId("deadline:abmeldung"), type: "abmeldung", event: "auszug", source: "auszug", duration: 2, unit: "weeks", passageId: stableId("bmg-17-2") },
      { id: stableId("deadline:abmeldung_fruestestens"), type: "abmeldung_fruestestens", event: "auszug", source: "auszug", duration: 1, unit: "week_before", passageId: stableId("bmg-17-2") },
    ],
    steps: stepSpecs.map((step) => ({ id: stableId(`step:${step.type}`), ...step, deadlineId: stableId(`deadline:${step.type === "ummeldung" ? "anmeldung" : step.type}`) })),
    requirements: stepSpecs.map((step) => ({ id: stableId(`requirement:${step.type}`), processId: step.processId, stepId: stableId(`step:${step.type}`), passageId: stableId("bmg-23-1") })),
    handlingPolicies: ["LEGAL_BASELINE", "PROCESS_IDENTITY", "REQUIRED_EVIDENCE", "DEADLINE", "SANCTION"].map((informationClass) => ({ id: stableId(`handling:${informationClass}`), informationClass })),
    freshnessRecords: [["source", IDS.source], ["source_version", IDS.version]].map(([entityType, entityId]) => ({ id: stableId(`freshness:${entityType}:${entityId}`), entityType, entityId })),
    retrievalMetadata: CANONICAL_UNITS.map((unit) => ({ id: stableId(`retrieval:claim:${unit.id}`), claimId: stableId(`claim:${unit.id}`) })),
    terminology: [
      { id: stableId("term:Wohnungsgeberbestätigung"), term: "Wohnungsgeberbestätigung", definition: "Bestätigung des Wohnungsgebers über den Einzug mit den gesetzlich vorgesehenen Angaben.", passageId: stableId("bmg-19-3") },
      { id: stableId("term:Hauptwohnung"), term: "Hauptwohnung", definition: "Bei mehreren Wohnungen im Inland die vorwiegend benutzte Wohnung.", passageId: stableId("bmg-21-1-3") },
      { id: stableId("term:Nebenwohnung"), term: "Nebenwohnung", definition: "Jede weitere Wohnung eines Einwohners im Inland.", passageId: stableId("bmg-21-1-3") },
      { id: stableId("term:Meldebehörde"), term: "Meldebehörde", definition: "Die für die An- und Abmeldung nach dem Bundesmeldegesetz zuständige Behörde.", passageId: stableId("bmg-17-1") },
      { id: stableId("term:Meldebescheinigung"), term: "Meldebescheinigung", definition: "Auf Antrag erteilte schriftliche oder elektronische Bescheinigung der Meldebehörde über gesetzlich bezeichnete Meldeangaben.", passageId: stableId("bmg-18-1") },
      { id: stableId("term:amtliche Meldebestätigung"), term: "amtliche Meldebestätigung", definition: "Unentgeltliche Bestätigung der Meldebehörde über die erfolgte An- oder Abmeldung.", passageId: stableId("bmg-24-2") },
    ],
  });
}

export function curatedPackFingerprint(payload = buildCuratedIngestionPayload()): string {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function buildFirstPackIngestionPayload(): Readonly<Record<string, unknown>> {
  const payload = structuredClone(buildCuratedIngestionPayload()) as Record<string, unknown>;
  const claimRows = (payload.claims as Record<string, unknown>[]).filter((claim) =>
    FIRST_PACK_UNIT_ID_SET.has(String(claim.unitId)));
  const claimIds = new Set(claimRows.map((claim) => String(claim.id)));
  const passageIds = new Set(firstPackPassages().map((passage) => stableId(passage.id)));
  payload.claims = claimRows;
  payload.passages = (payload.passages as Record<string, unknown>[]).filter((passage) =>
    passageIds.has(String(passage.id)));
  payload.retrievalMetadata = (payload.retrievalMetadata as Record<string, unknown>[]).filter((item) =>
    claimIds.has(String(item.claimId)));
  payload.terminology = (payload.terminology as Record<string, unknown>[]).filter((item) =>
    passageIds.has(String(item.passageId)));
  return Object.freeze(payload);
}
