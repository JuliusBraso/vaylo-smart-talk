/**
 * CB-TAX-0C DE↔SK tax residence and treaty knowledge pack.
 * Trust bilateral_tax_treaty. Not EU law. Not a calculator. Inactive.
 */
import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  BILATERAL_TAX_CANONICAL_TREATY_KEY,
  BILATERAL_TAX_JURISDICTION_LEVEL,
  BILATERAL_TAX_TRUST_DOMAIN,
  type BilateralTaxProcessDraft,
  type BilateralTaxStableRef,
  type CuratedBilateralTaxTreatyPack,
} from "../../../source-registry/bilateral-tax-treaty-contracts";
import { GERMAN_ADDED_CLAIM_KEYS, GERMAN_REUSED_CLAIM_KEYS } from "../../../source-registry/de-sk-tax-residence-treaty-core";

export const DESK_TAX_PACK_ID = "de_sk_tax_residence_treaty" as const;

function item<T extends Readonly<Record<string, unknown>>>(entityClass: string, key: string, values: T) {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(DESK_TAX_PACK_ID, entityClass, key),
    ...values,
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

function deRef(key: string): BilateralTaxStableRef {
  return Object.freeze({
    entityClass: "claims",
    key,
    sourceJurisdiction: "DE",
    trustDomain: "de",
    temporalClass: "CURRENT",
    claimRole: "german_domestic_tax",
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

type TreatyUnit = Readonly<{
  key: string;
  role: "bilateral_treaty" | "mli";
  type: "definition" | "exception" | "procedure" | "boundary";
  text: string;
}>;

export const DESK_TREATY_UNITS: readonly TreatyUnit[] = Object.freeze([
  { key: "desk-treaty-identity", role: "bilateral_treaty", type: "definition", text: "Das DBA Deutschland-Slowakei vom 19. Dezember 1980, in Kraft seit 17. November 1983, fortgeführt für die Slowakische Republik, bleibt der authentische bilaterale Vertrag. Synthetisierte BMF-Texte sind kein neuer Vertrag." },
  { key: "desk-select-treaty-version", role: "bilateral_treaty", type: "procedure", text: "Die maßgebliche Vertragsfassung folgt dem Steuerjahr. PRE_2025 und FROM_2025 koexistieren. Ein Fall 2024 darf nicht mit der MLI-Entlastung 2025 beantwortet werden." },
  { key: "desk-dual-domestic-candidate", role: "bilateral_treaty", type: "definition", text: "Erfüllen nachgewiesene Tatsachen deutsche inländische Ansässigkeit und den slowakischen inländischen Kandidaten, ist der Zwischenstatus DUAL_DOMESTIC_RESIDENCE_CANDIDATE. Das ist nicht TREATY_RESIDENT_DE und nicht TREATY_RESIDENT_SK, solange Artikel 4 nicht durchgeführt ist." },
  { key: "desk-art4-sequence", role: "bilateral_treaty", type: "definition", text: "Artikel 4 natürliche Personen: 1. ständige Wohnstätte (permanent home), 2. bei Wohnstätte in beiden Staaten Mittelpunkt der Lebensinteressen, 3. sonst gewöhnlicher Aufenthalt. Danach STOP." },
  { key: "desk-art4-nationality-rejected", role: "bilateral_treaty", type: "exception", text: "Die Staatsangehörigkeit ist kein Artikel-4-Tiebreaker des DE-SK-Vertrags. NATIONALITY_AS_ARTICLE4_TIEBREAKER und GENERIC_OECD_NATIONALITY_STEP sind abzulehnen." },
  { key: "desk-art4-map-rejected", role: "bilateral_treaty", type: "exception", text: "Artikel 25 Verständigungsverfahren ist kein automatischer vierter Artikel-4-Schritt. GENERIC_OECD_MAP_STEP ist abzulehnen." },
  { key: "desk-art4-permanent-home", role: "bilateral_treaty", type: "procedure", text: "Ständige Wohnstätte verlangt Verfügbarkeit, Kontinuität und tatsächlichen Zugang. Eigentum, Meldeadresse, Hotel oder Arbeitgeberunterkunft sind nicht automatisch permanent home." },
  { key: "desk-art4-centre-vital", role: "bilateral_treaty", type: "procedure", text: "Mittelpunkt der Lebensinteressen ist eine Mehrfaktorenprüfung: Familie, persönliche Bindungen, Beschäftigung, Selbständigkeit, wirtschaftliche und finanzielle Beziehungen, Lebensführung. Kein gewichteter Rechner. Ein Faktor gewinnt nicht automatisch. Unklar: DO_NOT_ANSWER_WITHOUT_CONTEXT." },
  { key: "desk-art4-habitual-abode", role: "bilateral_treaty", type: "procedure", text: "Der abkommensrechtliche gewöhnliche Aufenthalt ist nicht § 9 AO. Ein eigenes Feld. Das deutsche Sechs-Monats-Ergebnis ist nicht die Vertragsfolgerung." },
  { key: "desk-art4-unresolved", role: "bilateral_treaty", type: "procedure", text: "Lösen Wohnstätte, Mittelpunkt und gewöhnlicher Aufenthalt nicht, gilt TREATY_RESIDENCE_UNRESOLVED. Fail closed. Keine Staatsangehörigkeit. Keine Wahrscheinlichkeitswahl. Route: zuständige Behörde / fachliche Prüfung." },
  { key: "desk-art4-temporal", role: "bilateral_treaty", type: "procedure", text: "Abkommensansässigkeit kann wechseln. effectiveFrom und effectiveTo sind zu führen, etwa bei Umzug SK→DE im Steuerjahr." },
  { key: "desk-art15-base", role: "bilateral_treaty", type: "definition", text: "Artikel 15: Arbeitslohn einer ansässigen Person ist grundsätzlich nur im Ansässigkeitsstaat steuerpflichtig, es sei denn, die Arbeit wird im anderen Vertragsstaat physisch ausgeübt. Dann darf dieser Staat den darauf entfallenden Lohn besteuern. EMPLOYER_STATE ist nicht PHYSICAL_WORK_STATE." },
  { key: "desk-art15-allocation", role: "bilateral_treaty", type: "procedure", text: "Beschäftigungseinkünfte sind je CrossBorderTaxIncomeItem und Arbeitszeitraum zuzuordnen: DE-Tage, SK-Tage, Homeoffice, sonstige Zeiträume. Die gesamte Vergütung folgt nicht allein der Arbeitgeberadresse." },
  { key: "desk-art15-home-office", role: "bilateral_treaty", type: "procedure", text: "Homeoffice ist ein materieller Artikel-15-Ort. Beispiel: SK-Abkommensansässige, deutscher Arbeitgeber, Arbeit teils DE, teils Homeoffice SK, und umgekehrt. Keine Lohnsteuerabzugsberechnung." },
  { key: "desk-art15-calendar-year", role: "bilateral_treaty", type: "definition", text: "Artikel 15 Absatz 2 misst Anwesenheit im Kalenderjahr, nicht in einem rollierenden Zwölfmonatszeitraum." },
  { key: "desk-art15-exact-183", role: "bilateral_treaty", type: "definition", text: "Bedingung A: Anwesenheit im Tätigkeitsstaat nicht mehr als 183 Tage. 182 PASS, genau 183 PASS, 184 FAIL." },
  { key: "desk-art15-three-conditions", role: "bilateral_treaty", type: "definition", text: "Ansässigkeitsbesteuerung nach Artikel 15 Absatz 2 verlangt A und B und C. UNDER_183_ONLY und EXACT_183_ONLY sind nicht ARTICLE15_2_PASS." },
  { key: "desk-art15-condition-b", role: "bilateral_treaty", type: "definition", text: "Bedingung B: die Vergütung wird von einer Person gezahlt oder gewährt, die nicht im Tätigkeitsstaat ansässig ist, oder für sie." },
  { key: "desk-art15-condition-c", role: "bilateral_treaty", type: "procedure", text: "Bedingung C: die Vergütung wird nicht von einer Betriebsstätte jener Person im Tätigkeitsstaat getragen. PE_VERIFIED_YES, PE_VERIFIED_NO oder PE_UNRESOLVED. Ungeklärt: Artikel 15 Absatz 2 nicht abschließen. Keine volle Artikel-5-Maschine." },
  { key: "desk-art15-evidence", role: "bilateral_treaty", type: "procedure", text: "Mögliche Nachweise: Arbeitskalender, Arbeitgeberunterlagen, Remote-Nachweise, Stundenzettel, Lohnzuordnung, Fahrausweise. Kein einzelnes Mittel ist universell zwingend." },
  { key: "desk-art14-standalone", role: "bilateral_treaty", type: "definition", text: "Artikel 14 Selbständige Arbeit / independent personal services steht im DE-SK-Vertrag selbständig. Modernes OECD-Modell mit gestrichenem Artikel 14 ist nicht zu importieren. SELF_EMPLOYED ist first-class." },
  { key: "desk-art14-base", role: "bilateral_treaty", type: "definition", text: "Einkünfte einer ansässigen Person aus freiem Beruf oder ähnlicher selbständiger Tätigkeit sind nur im Ansässigkeitsstaat steuerpflichtig, es sei denn, sie hat im anderen Staat regelmäßig eine feste Einrichtung (fixed base). Dann darf der andere Staat nur die dieser Einrichtung zurechenbaren Einkünfte besteuern." },
  { key: "desk-art14-examples-not-allowlist", role: "bilateral_treaty", type: "exception", text: "Vertragsbeispiele (wissenschaftlich, schriftstellerisch, künstlerisch, erzieherisch, ärztlich, rechtsberatend, ingenieurmäßig, architektonisch, zahnärztlich) sind Beispiele, keine abschließende Berufsliste." },
  { key: "desk-art14-vs-art7", role: "bilateral_treaty", type: "procedure", text: "Klassifikator: INDEPENDENT_PERSONAL_SERVICES, BUSINESS_PROFITS oder UNRESOLVED. SZČO, živnostník, Freiberufler und Gewerbe bestimmen nicht automatisch Artikel 14 oder Artikel 7. Ohne ausreichende Tätigkeitsfacts: TREATY_INCOME_ARTICLE_UNRESOLVED." },
  { key: "desk-fixed-base-not-pe", role: "bilateral_treaty", type: "exception", text: "fixedBaseState und permanentEstablishmentState bleiben getrennt. Fixed base ist nicht PE. Unklar: fail closed." },
  { key: "desk-art14-attribution", role: "bilateral_treaty", type: "procedure", text: "Bei nachgewiesener fester Einrichtung darf der andere Staat nur zurechenbare Einkünfte besteuern. ALLOCATION_REQUIRED. Genaue Arithmetik ist nicht autorisiert." },
  { key: "desk-a1-not-tax", role: "bilateral_treaty", type: "exception", text: "A1-Staat entscheidet nicht Artikel 14, Artikel 15, Abkommensansässigkeit oder Besteuerungsrechte. socialSecurityCompetentState ist nicht taxingRightState." },
  { key: "desk-invoice-not-taxing-right", role: "bilateral_treaty", type: "exception", text: "Rechnungs- oder Kundenstaat ist nicht automatisch Quellen- oder Besteuerungsstaat." },
  { key: "desk-art23-directional", role: "bilateral_treaty", type: "definition", text: "Artikel 23 ist richtungsabhängig: treatyResidenceState, incomeArticle, taxingRightState, taxYear, innerstaatliche Überlagerung. Es gibt keine globale DE_SK_RELIEF_METHOD." },
  { key: "desk-art23-de-exemption-progression", role: "bilateral_treaty", type: "definition", text: "Für in Deutschland ansässige Personen verwendet Artikel 23 Absatz 1 grundsätzlich die Freistellung mit Progressionsvorbehalt für Einkünfte, die die Slowakei besteuern darf, vorbehaltlich enumerierter Anrechnungskategorien. Artikel 14 und gewöhnlicher Artikel 15 gehören zunächst zu EXEMPTION_WITH_PROGRESSION_CANDIDATE, nicht ohne innerstaatliche Tore." },
  { key: "desk-art23-sk-pre-2025", role: "bilateral_treaty", type: "definition", text: "Vor der maßgeblichen MLI-Wirkung 2025 bleibt Artikel 23 Absatz 2: grundsätzlich Freistellung mit Progression und enumerierten Anrechnungskategorien. Die spätere allgemeine Anrechnung ist nicht rückwirkend." },
  { key: "desk-mli-art5-credit", role: "mli", type: "definition", text: "Ab der DE-SK-MLI-Wirkung 2025-01-01 ersetzt MLI Artikel 5 Absatz 6 den ursprünglichen Artikel 23 Absatz 2 Buchstaben a und b. Wo Deutschland die betreffenden Einkünfte besteuern darf, gewährt die Slowakei vertraglich grundsätzlich CREDIT_METHOD_TREATY_BASE, begrenzt nach MLI/Vertrag. Keine genaue Arithmetik." },
  { key: "desk-mli-not-eu", role: "mli", type: "exception", text: "Das BEPS-MLI ist nicht EU-Recht. Trust bleibt bilateral_tax_treaty." },
  { key: "desk-mli-not-2024", role: "mli", type: "exception", text: "Die MLI-Entlastung 2025 ist nicht auf Steuerjahre vor der Wirkung anzuwenden." },
  { key: "desk-taxing-right-not-amount", role: "bilateral_treaty", type: "exception", text: "STATE_MAY_TAX ist nicht TAX_AMOUNT_DUE. Kein Steuerrechner." },
  { key: "desk-residence-not-only-filing", role: "bilateral_treaty", type: "exception", text: "TREATY_RESIDENT_STATE ist nicht der einzige mögliche Erklärungsstaat." },
  { key: "desk-one-person-not-one-article", role: "bilateral_treaty", type: "exception", text: "Eine Person hat nicht automatisch einen Vertragsartikel für alle Einkünfte. Beschäftigung und Selbständigkeit sind getrennt zu klassifizieren." },
  { key: "desk-activity-change", role: "bilateral_treaty", type: "procedure", text: "Wechsel Arbeitnehmer/Selbständig oder Ansässigkeitswechsel erzwingen Neuwertung je Zeitraum und Einkunftsposten." },
  { key: "desk-filing-handoff", role: "bilateral_treaty", type: "procedure", text: "Ansässigkeits- und Vertragsklassifikation haben keine eigene Abgabefrist. Handoff an bestehende Erklärungsprozesse. Zuständige Stellen: Finanzamt und daňový úrad, Instanz FETCH_LIVE. MAP-Route FETCH_LIVE." },
  { key: "desk-no-calculator", role: "bilateral_treaty", type: "boundary", text: "Dieser Kern autorisiert keine Steuerbeträge, keine Buchhaltung, keine Umsatzsteuer und keine öffentliche Laufzeit." },
]);

function dim(overrides: Partial<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>) {
  const base = {
    what: "desk-treaty-identity",
    whoWhen: "desk-select-treaty-version",
    documents: "desk-art15-evidence",
    how: "desk-art4-sequence",
    next: "desk-filing-handoff",
    deadlines: "desk-select-treaty-version",
    problems: "desk-art4-unresolved",
    dutiesAfter: "desk-activity-change",
    institution: "desk-filing-handoff",
    boundaries: "desk-no-calculator",
    freshness: "desk-select-treaty-version",
    negatives: "desk-taxing-right-not-amount",
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

export const DESK_TREATY_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { processKey: "desk-select-treaty-version", processGroupId: "TAX_RESIDENCE", title: "Vertragsfassung wählen", dimensions: dim({ what: "desk-select-treaty-version", negatives: "desk-mli-not-2024" }), extraRefs: [treatyRef("desk-mli-not-2024", "mli")] },
  { processKey: "desk-dual-domestic-detect", processGroupId: "TAX_RESIDENCE", title: "Doppelte inländische Kandidatur erkennen", dimensions: dim({ what: "desk-dual-domestic-candidate", how: "desk-dual-domestic-candidate", negatives: "desk-dual-domestic-candidate" }), extraRefs: [...GERMAN_REUSED_CLAIM_KEYS.map(deRef), ...GERMAN_ADDED_CLAIM_KEYS.map(deRef), skRef("sk-tax-domestic-candidate-or")] },
  { processKey: "desk-art4-permanent-home", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 ständige Wohnstätte", dimensions: dim({ what: "desk-art4-permanent-home", how: "desk-art4-sequence", negatives: "desk-art4-permanent-home" }) },
  { processKey: "desk-art4-centre-vital", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 Mittelpunkt der Lebensinteressen", dimensions: dim({ what: "desk-art4-centre-vital", how: "desk-art4-centre-vital" }) },
  { processKey: "desk-art4-habitual-abode", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 gewöhnlicher Aufenthalt", dimensions: dim({ what: "desk-art4-habitual-abode", negatives: "desk-art4-habitual-abode" }), extraRefs: [deRef("ao-9-not-article15-183")] },
  { processKey: "desk-art4-unresolved", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 ungelöst fail-closed", dimensions: dim({ what: "desk-art4-unresolved", negatives: "desk-art4-nationality-rejected", problems: "desk-art4-map-rejected" }) },
  { processKey: "desk-art15-base", processGroupId: "EMPLOYMENT_INCOME", title: "Artikel 15 Grundregel", dimensions: dim({ what: "desk-art15-base", how: "desk-art15-base", negatives: "desk-art15-base" }) },
  { processKey: "desk-art15-physical-work", processGroupId: "EMPLOYMENT_INCOME", title: "Artikel 15 physische Arbeitszuordnung", dimensions: dim({ what: "desk-art15-allocation", how: "desk-art15-allocation" }) },
  { processKey: "desk-art15-three-condition", processGroupId: "EMPLOYMENT_INCOME", title: "Artikel 15 Dreiertest", dimensions: dim({ what: "desk-art15-three-conditions", how: "desk-art15-exact-183", problems: "desk-art15-condition-c", negatives: "desk-art15-three-conditions" }) },
  { processKey: "desk-art15-home-office", processGroupId: "EMPLOYMENT_INCOME", title: "Homeoffice / Mehrstaatenarbeit", dimensions: dim({ what: "desk-art15-home-office", how: "desk-art15-home-office" }) },
  { processKey: "desk-art14-classifier", processGroupId: "INDEPENDENT_WORK", title: "Artikel 14 Klassifikator", dimensions: dim({ what: "desk-art14-standalone", how: "desk-art14-vs-art7", negatives: "desk-art14-vs-art7" }) },
  { processKey: "desk-art14-fixed-base", processGroupId: "INDEPENDENT_WORK", title: "Artikel 14 feste Einrichtung", dimensions: dim({ what: "desk-art14-base", how: "desk-art14-attribution", negatives: "desk-fixed-base-not-pe" }) },
  { processKey: "desk-art14-vs-art7", processGroupId: "INDEPENDENT_WORK", title: "Artikel 14 gegen Artikel 7 ungeklärt", dimensions: dim({ what: "desk-art14-vs-art7", problems: "desk-art14-vs-art7", negatives: "desk-invoice-not-taxing-right" }) },
  { processKey: "desk-relief-de-resident", processGroupId: "DOUBLE_TAX_RELIEF", title: "Deutsche Abkommensansässigkeit Entlastung", dimensions: dim({ what: "desk-art23-de-exemption-progression", how: "desk-art23-directional" }), extraRefs: [deRef("progression-replacement-income")] },
  { processKey: "desk-relief-sk-pre-2025", processGroupId: "DOUBLE_TAX_RELIEF", title: "Slowakische Entlastung vor 2025", dimensions: dim({ what: "desk-art23-sk-pre-2025", negatives: "desk-mli-not-2024" }) },
  { processKey: "desk-relief-sk-2025-mli", processGroupId: "DOUBLE_TAX_RELIEF", title: "Slowakische MLI-Anrechnung ab 2025", dimensions: dim({ what: "desk-mli-art5-credit", how: "desk-mli-art5-credit", negatives: "desk-mli-not-eu" }), extraRefs: [treatyRef("desk-mli-art5-credit", "mli"), treatyRef("desk-mli-not-eu", "mli"), skRef("sk-tax-45-1-credit-limit")] },
  { processKey: "desk-relief-de-50d", processGroupId: "DOUBLE_TAX_RELIEF", title: "Deutsche § 50d Absatz 8 und 9 Tore", dimensions: dim({ what: "desk-art23-de-exemption-progression", documents: "desk-art15-evidence" }), extraRefs: [deRef("estg-50d-8-employment-exemption-proof"), deRef("estg-50d-8-not-taxing-right"), deRef("estg-50d-9-switchover-gate")] },
  { processKey: "desk-relief-sk-45-3-c", processGroupId: "DOUBLE_TAX_RELIEF", title: "Slowakisches § 45 Absatz 3 Buchstabe c Tor", dimensions: dim({ what: "desk-mli-art5-credit", how: "desk-art23-directional" }), extraRefs: [skRef("sk-tax-45-3-c-employment"), skRef("sk-tax-45-3-c-not-self-employed"), skRef("sk-tax-45-3-c-comparison-fail-closed")] },
  { processKey: "desk-activity-residence-change", processGroupId: "TAX_RESIDENCE", title: "Tätigkeits- und Ansässigkeitswechsel", dimensions: dim({ what: "desk-activity-change", how: "desk-art4-temporal", next: "desk-one-person-not-one-article" }) },
  { processKey: "desk-filing-authority-handoff", processGroupId: "DOUBLE_TAX_RELIEF", title: "Erklärung und Behörden-Handoff", dimensions: dim({ what: "desk-filing-handoff", negatives: "desk-residence-not-only-filing" }) },
]);

export function evaluateDeskTreatyProcessCompleteness() {
  const claimKeys = new Set(DESK_TREATY_UNITS.map((unit) => unit.key));
  const incomplete = DESK_TREATY_PROCESSES.filter((process) =>
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !claimKeys.has(process.dimensions[dimension])));
  return Object.freeze({
    processCount: DESK_TREATY_PROCESSES.length,
    processCompletenessPercent: incomplete.length === 0 ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.processKey),
  });
}

export function buildDeSkTaxResidenceTreatyPack(): CuratedBilateralTaxTreatyPack {
  const trust = item("trustDomain", "bilateral_tax_treaty", {
    code: BILATERAL_TAX_TRUST_DOMAIN,
    name: "Bilateral tax treaty provenance",
  });
  const jurisdiction = item("jurisdictions", "de-sk", {
    level: BILATERAL_TAX_JURISDICTION_LEVEL,
    code: BILATERAL_TAX_CANONICAL_TREATY_KEY,
    treatyCountries: ["DE", "SK"] as const,
    countryCode: null,
    authorityCountry: "MULTILATERAL" as const,
  });
  const scope = item("territorialScopes", "de-sk", {
    type: "bilateral_tax_treaty",
    jurisdictionIds: [jurisdiction.id],
    treatyCountries: ["DE", "SK"] as const,
  });
  const publisher = item("publishers", "bmf-desk-tax-treaty", {
    name: "Bundesministerium der Finanzen",
    type: "treaty_depositary",
    territorialScopeId: scope.id,
    trustDomainId: trust.id,
  });
  const authority = item("authorities", "bmf-desk-tax-treaty-authority", {
    publisherId: publisher.id,
    name: "BMF / authentic DE-SK tax treaty and MLI working text",
    type: "bilateral_treaty",
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityCountry: "MULTILATERAL" as const,
  });
  const claims = DESK_TREATY_UNITS.map((unit) => item("claims", unit.key, {
    type: unit.type,
    text: unit.text,
    riskLevel: "high" as const,
    temporalClass: "CURRENT" as const,
    claimRole: unit.role,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityId: authority.id,
  }));
  const claimUnits = DESK_TREATY_UNITS.map((unit) => treatyRef(unit.key, unit.role));
  const versions = [
    {
      temporalVersion: "pre_2025",
      effectiveFrom: "1983-11-17",
      effectiveTo: "2024-12-31",
      baseTreatyDate: "1980-12-19",
      mliModified: false,
      mliEffectiveFrom: null,
      mliAdoptionDate: "2016-11-24",
      deMliSignatureDate: "2017-06-07",
      skMliSignatureDate: "2017-06-07",
      deMliEntryIntoForce: "2021-04-01",
      skMliEntryIntoForce: "2019-01-01",
      germanArticle35CompletionDate: "2024-10-02",
      taxType: "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES",
      sourceKind: "AUTHENTIC_BILATERAL_TREATY" as const,
      sourceVersion: "authentic-pre-2025",
    },
    {
      temporalVersion: "from_2025",
      effectiveFrom: "2025-01-01",
      effectiveTo: null,
      baseTreatyDate: "1980-12-19",
      mliModified: true,
      mliEffectiveFrom: "2025-01-01",
      mliAdoptionDate: "2016-11-24",
      deMliSignatureDate: "2017-06-07",
      skMliSignatureDate: "2017-06-07",
      deMliEntryIntoForce: "2021-04-01",
      skMliEntryIntoForce: "2019-01-01",
      germanArticle35CompletionDate: "2024-10-02",
      taxType: "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES",
      sourceKind: "AUTHENTIC_BEPS_MLI" as const,
      sourceVersion: "mli-from-2025",
    },
  ] as const;
  const processes: BilateralTaxProcessDraft[] = versions.flatMap((version) =>
    DESK_TREATY_PROCESSES.map((spec) => {
      const dimensionRefs = PROCESS_COMPLETE_DIMENSIONS.map((dimension) =>
        treatyRef(spec.dimensions[dimension], spec.dimensions[dimension].startsWith("desk-mli") ? "mli" : "bilateral_treaty"));
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
    packId: DESK_TAX_PACK_ID,
    treatyKey: BILATERAL_TAX_CANONICAL_TREATY_KEY,
    countryA: "DE",
    countryB: "SK",
    canonicalLanguage: "de",
    topicFamily: "TAX_TREATY",
    lifecycleState: "draft",
    sourceRefs: [treatyRef("desk-treaty-identity"), treatyRef("desk-mli-art5-credit", "mli")],
    claimUnits,
    processGroups: ["TAX_RESIDENCE", "EMPLOYMENT_INCOME", "INDEPENDENT_WORK", "DOUBLE_TAX_RELIEF"] as const,
    effectiveFrom: "1983-11-17",
    effectiveTo: null,
    temporalVersion: "from_2025",
    active: false,
    publicRuntimeAllowed: false,
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
