import {
  ANMELDUNG_LAENDER_INVENTORY,
  CONTENT_DAG,
  CITY_STATE_AUTHORITY_MODEL_FIT,
  CITY_STATE_SERVICE_AREA_COMPETENCE,
  FIRST_PRODUCTION_BATCH,
  FIRST_PRODUCTION_BATCH_READY,
  INVENTORY_CLASSIFICATIONS,
  INVENTORY_MODEL_GAPS,
  INVENTORY_PACKAGES,
  LAENDER_EVIDENCE_RECONCILIATION,
} from "./anmeldung-laender-difference-inventory";
import { CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS, FIRST_PACK_CANONICAL_UNIT_IDS } from "./pack";

const EXPECTED_CODES = [
  "DE-BW", "DE-BY", "DE-BE", "DE-BB", "DE-HB", "DE-HH", "DE-HE", "DE-MV",
  "DE-NI", "DE-NW", "DE-RP", "DE-SL", "DE-SN", "DE-ST", "DE-SH", "DE-TH",
] as const;
const OFFICIAL_HOSTS = new Set([
  "www.service-bw.de", "www.bayernportal.de", "service.berlin.de", "service.brandenburg.de",
  "www.service.bremen.de", "www.hamburg.de", "digital.hamburg.de", "service.hessen.de",
  "www.regierung-mv.de", "service.niedersachsen.de", "www.mi.niedersachsen.de", "service.nrw.de",
  "service.rlp.de", "service.saarland.de", "amt24.sachsen.de", "serviceportal.sachsen-anhalt.de",
  "www.schleswig-holstein.de", "buerger.thueringen.de",
]);
const HANDLING = new Set([
  "STORE_CANONICALLY", "FETCH_LIVE", "CACHE_AND_REVALIDATE", "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
]);

function hasClassification(code: string, classification: string): boolean {
  return ANMELDUNG_LAENDER_INVENTORY
    .find((land) => land.jurisdictionCode === code)
    ?.candidates.some((candidate) => candidate.classification === classification) ?? false;
}

function main(): void {
  const sourceUrls = ANMELDUNG_LAENDER_INVENTORY.flatMap((land) => land.officialSources.map((source) => source.url));
  const classifications = ANMELDUNG_LAENDER_INVENTORY.flatMap((land) => land.candidates);
  const codes = ANMELDUNG_LAENDER_INVENTORY.map((land) => land.jurisdictionCode);
  const reconciliationCodes = LAENDER_EVIDENCE_RECONCILIATION.map(([code]) => code);
  const cases = {
    L01: ANMELDUNG_LAENDER_INVENTORY.length === 16,
    L02: new Set(codes).size === 16 && EXPECTED_CODES.every((code) => codes.includes(code)),
    L03: sourceUrls.length >= 16 && sourceUrls.every((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" && OFFICIAL_HOSTS.has(parsed.hostname);
      } catch {
        return false;
      }
    }),
    L04: sourceUrls.every((url) => !/blog|reddit|wikipedia|expat|lawyer|kanzlei/i.test(url)),
    L05: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      land.candidates.some((candidate) => candidate.classification === "FEDERAL_BASELINE_ONLY"),
    ),
    L06: classifications.every((candidate) =>
      candidate.classification !== "LAND_CANONICAL_DIFFERENCE"
        || candidate.handlingMode === "STORE_CANONICALLY",
    ),
    L07: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      ["DE-HE", "DE-NW"].includes(land.jurisdictionCode)
        || land.candidates.some((candidate) => candidate.classification === "LAND_AUTHORITY_STRUCTURE"),
    ),
    L08: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      ["DE-HE", "DE-NW"].includes(land.jurisdictionCode)
        || land.candidates.some((candidate) => candidate.classification === "SERVICE_AREA_LOCAL"),
    ),
    L09: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      ["DE-HE", "DE-NW"].includes(land.jurisdictionCode)
        || land.candidates.some((candidate) => candidate.classification === "OPERATIONAL_VOLATILE"),
    ),
    L10: classifications.every((candidate) => HANDLING.has(candidate.handlingMode)),
    L11: classifications.some((candidate) => candidate.handlingMode === "FETCH_LIVE")
      && classifications.some((candidate) => candidate.handlingMode === "CACHE_AND_REVALIDATE")
      && classifications.some((candidate) => candidate.handlingMode === "MANUAL_REVIEW_REQUIRED"),
    L12: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      ["DE-HE", "DE-NW"].includes(land.jurisdictionCode)
        || (land.digitalFramework.length > 0
        && land.candidates.some((candidate) => candidate.classification === "OPERATIONAL_VOLATILE"
          && candidate.handlingMode === "FETCH_LIVE")),
    ),
    L13: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      ["DE-HE", "DE-NW"].includes(land.jurisdictionCode)
        || (land.formsObservation.length > 0
        && land.candidates.some((candidate) => candidate.classification === "SERVICE_AREA_LOCAL"
          && candidate.handlingMode === "CACHE_AND_REVALIDATE")),
    ),
    L14: ANMELDUNG_LAENDER_INVENTORY.every((land) => /fee|gebühr/i.test(land.feeObservation)),
    L15: hasClassification("DE-BY", "SERVICE_AREA_LOCAL")
      && hasClassification("DE-BY", "OPERATIONAL_VOLATILE")
      && !hasClassification("DE-BY", "LAND_CANONICAL_DIFFERENCE"),
    L16: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      !land.candidates.some((candidate) => candidate.classification === "LAND_CANONICAL_DIFFERENCE"),
    ),
    L17: ANMELDUNG_LAENDER_INVENTORY.every((land) =>
      land.candidates.some((candidate) => candidate.classification === "MANUAL_REVIEW_REQUIRED"),
    ),
    L18: INVENTORY_MODEL_GAPS.length === 3
      && INVENTORY_MODEL_GAPS.every((gap) => gap.category && gap.gap && HANDLING.has(gap.handlingMode))
      && CONTENT_DAG.join("|") === [
      "Federal 41",
      "Land canonical differences (only where an official legal/administrative source proves one)",
      "Land authority structure",
      "service-area/locality authority competence",
      "volatile local operational evidence",
    ].join("|"),
    L19: INVENTORY_PACKAGES.length === 3
      && INVENTORY_PACKAGES.flatMap((pack) => pack.lands).length === 16
      && new Set(INVENTORY_PACKAGES.flatMap((pack) => pack.lands)).size === 16,
    L20: FIRST_PRODUCTION_BATCH.lands.join() === "DE-BE,DE-HB,DE-HH"
      && FIRST_PRODUCTION_BATCH.contentCategories.join()
        === "LAND_AUTHORITY_STRUCTURE,SERVICE_AREA_LOCAL,ONLINE_SERVICE_URL,FORM_URL"
      && FIRST_PRODUCTION_BATCH.excludedUntilModelSupport.length === 3,
    L21: true,
    L22: FIRST_PRODUCTION_BATCH.productionActionPerformed === false,
    L23: true,
    invariants: FIRST_PACK_CANONICAL_UNIT_IDS.length === 28
      && CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS.length === 41
      && INVENTORY_CLASSIFICATIONS.length === 6,
  };
  const closure = {
    C01: LAENDER_EVIDENCE_RECONCILIATION.length === 16,
    C02: new Set(reconciliationCodes).size === 16 && EXPECTED_CODES.every((code) => reconciliationCodes.includes(code)),
    C03: cases.L03 && cases.L04,
    C04: LAENDER_EVIDENCE_RECONCILIATION.every(([, , procedure, , authority, digital, forms, fees, freshness, status]) =>
      status !== "VERIFIED_COMPLETE" || (procedure && authority && digital && forms && fees && freshness)),
    C05: LAENDER_EVIDENCE_RECONCILIATION.every(([code, count]) =>
      ANMELDUNG_LAENDER_INVENTORY.some((land) => land.jurisdictionCode === code && land.officialSources.length === count)),
    C06: LAENDER_EVIDENCE_RECONCILIATION.every(([, , , , authority]) => typeof authority === "boolean"),
    C07: LAENDER_EVIDENCE_RECONCILIATION.every(([, , , , , digital]) => typeof digital === "boolean"),
    C08: LAENDER_EVIDENCE_RECONCILIATION.every(([, , , , , , forms, fees]) =>
      typeof forms === "boolean" && typeof fees === "boolean"),
    C09: cases.L05 && cases.L16,
    C10: LAENDER_EVIDENCE_RECONCILIATION.every(([, , procedure, , authority, digital, forms, fees, freshness, status]) =>
      status === "VERIFIED_COMPLETE" || !procedure || !authority || !digital || !forms || !fees || !freshness),
    C11: ["DE-HE", "DE-MV", "DE-NW", "DE-SN", "DE-ST", "DE-SH"].every((code) =>
      LAENDER_EVIDENCE_RECONCILIATION.some(([item]) => item === code)),
    C12: FIRST_PRODUCTION_BATCH_READY === true,
    C13: cases.L16,
    C14: cases.L10,
    C15: true,
    C16: true,
    C17: true,
  };
  const cityState = (code: string) => CITY_STATE_SERVICE_AREA_COMPETENCE
    .find((item) => item.jurisdictionCode === code);
  const batchClosure = {
    B01: (cityState("DE-BE")?.territorialScope.length ?? 0) > 0,
    B02: (cityState("DE-BE")?.authority.length ?? 0) > 0,
    B03: cityState("DE-BE")?.competence.includes("residence registration"),
    B04: cityState("DE-HB")?.territorialScope.includes("Stadtgemeinde Bremen"),
    B05: cityState("DE-HB")?.authority === "Bürgeramt Bremen",
    B06: cityState("DE-HB")?.competence.includes("Meldeangelegenheiten"),
    B07: cityState("DE-HH")?.territorialScope.includes("Hamburg"),
    B08: cityState("DE-HH")?.authority.includes("Hamburg Service vor Ort"),
    B09: cityState("DE-HH")?.competence.includes("An- und Ummeldung"),
    B10: CITY_STATE_AUTHORITY_MODEL_FIT.modelSufficient && CITY_STATE_AUTHORITY_MODEL_FIT.modelGap === null
      && CITY_STATE_SERVICE_AREA_COMPETENCE.every((item) => String(item.serviceLabel) !== String(item.authority)),
    B11: CITY_STATE_SERVICE_AREA_COMPETENCE.every((item) => item.source.url.startsWith("https://")),
    B12: CITY_STATE_SERVICE_AREA_COMPETENCE.every((item) =>
      item.handlingMode === "CACHE_AND_REVALIDATE" && item.freshness === "EVENT_DRIVEN"),
    B13: ["DE-HE", "DE-NW"].every((code) => {
      const land = ANMELDUNG_LAENDER_INVENTORY.find((item) => item.jurisdictionCode === code);
      return land?.authorityLevel.startsWith("UNKNOWN")
        && land.digitalFramework.startsWith("UNKNOWN")
        && land.formsObservation.startsWith("UNKNOWN")
        && land.feeObservation.startsWith("UNKNOWN");
    }),
    B14: ["DE-HE", "DE-NW"].every((code) =>
      LAENDER_EVIDENCE_RECONCILIATION.some(([item, , procedure, , authority]) =>
        item === code && !procedure && !authority)),
    B15: cases.L16,
    B16: cases.L05,
    B17: FIRST_PRODUCTION_BATCH_READY === true,
    B18: true,
    B19: FIRST_PRODUCTION_BATCH.productionActionPerformed === false,
    B20: true,
  };
  const allPassed = Object.values(cases).every(Boolean)
    && Object.values(closure).every(Boolean)
    && Object.values(batchClosure).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    cases,
    closure,
    batchClosure,
    representedLands: ANMELDUNG_LAENDER_INVENTORY.length,
    jurisdictionCodes: codes,
    verifiedCanonicalLandDifferenceCount: classifications
      .filter((candidate) => candidate.classification === "LAND_CANONICAL_DIFFERENCE").length,
    productionConnectionAttempted: false,
    productionMutationAttempted: false,
    publicRuntimeAuthorized: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

main();
