/**
 * AT-SK-0J AT↔SK bilateral tax treaty knowledge pack.
 * Trust bilateral_tax_treaty. Not EU law. Not a calculator. Inactive.
 */
import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  BILATERAL_TAX_JURISDICTION_LEVEL,
  BILATERAL_TAX_TRUST_DOMAIN,
  type BilateralTaxProcessDraft,
  type BilateralTaxStableRef,
  type CuratedBilateralTaxTreatyPack,
} from "../../../source-registry/bilateral-tax-treaty-contracts";

export const AT_SK_TAX_PACK_ID = "at_sk_bilateral_tax_treaty" as const;
export const AT_SK_TREATY_KEY = "AT-SK" as const;

function item<T extends Readonly<Record<string, unknown>>>(entityClass: string, key: string, values: T) {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(AT_SK_TAX_PACK_ID, entityClass, key),
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

type TreatyUnit = Readonly<{
  key: string;
  role: "bilateral_treaty" | "mli";
  type: "definition" | "exception" | "procedure" | "boundary";
  text: string;
}>;

export const AT_SK_SOURCE_FOUNDATION_UNITS: readonly TreatyUnit[] = Object.freeze([
  { key: "atsk-src-authentic-treaty-1978", role: "bilateral_treaty", type: "definition", text: "AUTHENTIC_BILATERAL_TREATY: Abkommen zwischen der Republik Österreich und der ČSSR zur Vermeidung der Doppelbesteuerung auf dem Gebiete der Steuern vom Einkommen und vom Vermögen, unterzeichnet am 7. März 1978, in Kraft seit 12. Februar 1979 (BGBl. Nr. 34/1979; 48/1979 Zb.). Authentischer Vertragstext hat Vorrang." },
  { key: "atsk-src-succession-sk", role: "bilateral_treaty", type: "definition", text: "TREATY_CONTINUATION_INSTRUMENT: Das Abkommen gilt gegenwärtig zwischen Österreich und der Slowakischen Republik durch Staatsnachfolge / fortgesetzte Anwendbarkeit. Tschechoslowakei ist keine gegenwärtige Vertragspartei." },
  { key: "atsk-src-authentic-mli", role: "mli", type: "definition", text: "AUTHENTIC_BEPS_MLI: Multilaterales Übereinkommen zur Umsetzung steuerabkommensbezogener Maßnahmen (BEPS-MLI). Österreich Hinterlegung 22. September 2017, Inkrafttreten 1. Juli 2018. Slowakei Hinterlegung 20. September 2018, Inkrafttreten 1. Januar 2019." },
  { key: "atsk-src-mli-position-at", role: "mli", type: "definition", text: "MLI_MATCHING_POSITION (Österreich): österreichische MLI-Position / Vorbehalte / Mitteilungen einschließlich BGBl. III Nr. 93/2018." },
  { key: "atsk-src-mli-position-sk", role: "mli", type: "definition", text: "MLI_MATCHING_POSITION (Slowakei): slowakische MLI-Position / Mitteilungen einschließlich 410/2018 Z. z." },
  { key: "atsk-src-bmf-synthesized", role: "bilateral_treaty", type: "boundary", text: "OFFICIAL_SYNTHESIZED_WORKING_TEXT: Österreichisches BMF-Synthesetext AT-SK inkl. MLI-Wirkungen. Operativ nützlich, aber kein neuer Vertrag und nicht über authentische Vertrags- und MLI-Texte." },
  { key: "atsk-src-sk-mof-status", role: "bilateral_treaty", type: "definition", text: "SK_MOF_TREATY_STATUS: Aktuelle slowakische Finanzministerium-Bestätigung der anwendbaren Vertragslage für Österreich." },
]);

export const AT_SK_TREATY_UNITS: readonly TreatyUnit[] = Object.freeze([
  { key: "atsk-treaty-identity", role: "bilateral_treaty", type: "definition", text: "Gegenwärtiges bilaterales Steuerabkommen AT↔SK: historisch Österreich–ČSSR (7.3.1978, IK 12.2.1979), fortgeführt für die Slowakei. Gegenwärtige Anwendung: Österreich ↔ Slowakei. ČSSR ist keine aktuelle Jurisdiktion." },
  { key: "atsk-current-applicability", role: "bilateral_treaty", type: "definition", text: "Österreich wendet das CSSR-Abkommen gegenüber der Slowakei fort, bis ein separates Österreich–Slowakei-Abkommen geschlossen wird. SUCCESSION_CONTINUITY_TO_SK bleibt explizit." },
  { key: "atsk-select-treaty-version", role: "bilateral_treaty", type: "procedure", text: "Vertragsfassung folgt Steuerjahr, Ereignisdatum und Steuerart. BASE_TREATY_1978, MLI_WITHHOLDING_FROM_2019, MLI_AT_OTHER_FROM_2020 und MLI_SK_OTHER_FROM_2019_07 koexistieren. Kein universelles MLI_EFFECTIVE-Flag." },
  { key: "atsk-dual-domestic-candidate", role: "bilateral_treaty", type: "definition", text: "Nachgewiesene österreichische inländische Ansässigkeit und slowakischer inländischer Kandidat ergeben DUAL_DOMESTIC_RESIDENCE_CANDIDATE. Das ist Eingang für Artikel 4, kein Fehler und nicht zwei finale Abkommensansässigkeiten." },
  { key: "atsk-domestic-not-treaty", role: "bilateral_treaty", type: "exception", text: "Österreichischer Wohnsitz/gewöhnlicher Aufenthalt und slowakische inländische Ansässigkeit sind nicht automatisch AT-SK-Abkommensansässigkeit." },
  { key: "atsk-art4-sequence", role: "bilateral_treaty", type: "definition", text: "Artikel 4 natürliche Personen bei Doppelansässigkeit: 1. ständige Wohnstätte, 2. Mittelpunkt der Lebensinteressen, 3. gewöhnlicher Aufenthalt, 4. Staatsangehörigkeit, 5. Verständigung der zuständigen Behörden. Geordnet, nicht als Score." },
  { key: "atsk-art4-permanent-home", role: "bilateral_treaty", type: "procedure", text: "Ständige Wohnstätte nur in einem Staat: dortige Abkommensansässigkeit ohne spätere Tests, sofern eindeutig. Meldezettel, Eigentum, Hotel oder Arbeitgeberunterkunft sind nicht automatisch permanent home." },
  { key: "atsk-art4-centre-vital", role: "bilateral_treaty", type: "procedure", text: "Bei Wohnstätte in beiden Staaten: Mittelpunkt der Lebensinteressen / nähere persönliche und wirtschaftliche Beziehungen. Nicht vor eindeutiger Wohnstätte in nur einem Staat. Mehrfaktorenprüfung, kein Rechner." },
  { key: "atsk-art4-habitual-abode", role: "bilateral_treaty", type: "procedure", text: "Gewöhnlicher Aufenthalt im Abkommenssinne ist nicht BAO §26 oder inländische Sechsmonatsregel. Eigenes Feld." },
  { key: "atsk-art4-nationality", role: "bilateral_treaty", type: "procedure", text: "Staatsangehörigkeit erst nach Wohnstätte, Mittelpunkt und gewöhnlichem Aufenthalt. Nur bei Staatsangehörigkeit eines Vertragsstaats: dortige Ansässigkeit." },
  { key: "atsk-art4-nationality-first-rejected", role: "bilateral_treaty", type: "exception", text: "NATIONALITY_BEFORE_ORDERED_STEPS ist abzulehnen. Staatsangehörigkeit darf nicht vor Wohnstätte/Mittelpunkt/gewöhnlichem Aufenthalt entscheiden." },
  { key: "atsk-art4-map-terminal", role: "bilateral_treaty", type: "procedure", text: "Bei Staatsangehörigkeit beider oder keiner Vertragsparteien: TREATY_RESIDENCE_MAP_REQUIRED. Artikel 25 MAP ist terminaler Artikel-4-Zweig, kein automatischer Score-Schritt und kein Voll-MAP-Prozess in 0J." },
  { key: "atsk-art14-standalone", role: "bilateral_treaty", type: "definition", text: "Artikel 14 Selbständige Arbeit / freie Berufe / andere selbständige Tätigkeit bleibt eigenständig. Nicht pauschal in Artikel 7 zusammenführen." },
  { key: "atsk-art14-base", role: "bilateral_treaty", type: "definition", text: "Einkünfte ansässiger Person aus freiem Beruf oder ähnlicher selbständiger Tätigkeit nur im Ansässigkeitsstaat steuerpflichtig, es sei denn, regelmäßig feste Einrichtung im anderen Staat. Dann nur zurechenbare Einkünfte dort." },
  { key: "atsk-art14-vs-art7", role: "bilateral_treaty", type: "procedure", text: "Klassifikator: INDEPENDENT_PERSONAL_SERVICES, BUSINESS_PROFITS oder UNRESOLVED. SZČO, živnostník, Gewerbe oder Freiberufler-Label ohne Tätigkeitsfacts: UNRESOLVED." },
  { key: "atsk-fixed-base-not-pe", role: "bilateral_treaty", type: "exception", text: "fixedBaseState und permanentEstablishmentState bleiben getrennt. Feste Einrichtung ist nicht Betriebsstätte. Dienstleistungsanzeige, A1 oder Gewerbe-Label begründen keine feste Einrichtung automatisch." },
  { key: "atsk-art14-attribution", role: "bilateral_treaty", type: "procedure", text: "Bei nachgewiesener fester Einrichtung: anderer Staat nur zurechenbare Einkünfte. ALLOCATION_REQUIRED. Keine Arithmetik." },
  { key: "atsk-art15-base", role: "bilateral_treaty", type: "definition", text: "Artikel 15: Arbeitslohn ansässiger Person grundsätzlich nur im Ansässigkeitsstaat, es sei denn, Arbeit wird im anderen Staat physisch ausgeübt. Dann darf dieser Staat besteuern. EMPLOYER_STATE ist nicht PHYSICAL_WORK_STATE." },
  { key: "atsk-art15-calendar-year", role: "bilateral_treaty", type: "definition", text: "Artikel 15 Absatz 2 misst Anwesenheit im relevanten KALENDERJAHR, nicht in einem rollierenden Zwölfmonatszeitraum und nicht BAO-Sechsmonate." },
  { key: "atsk-art15-exact-183", role: "bilateral_treaty", type: "definition", text: "Bedingung A: Anwesenheit im Tätigkeitsstaat nicht mehr als 183 Tage im Kalenderjahr. 182 PASS, genau 183 PASS, 184 FAIL." },
  { key: "atsk-art15-three-conditions", role: "bilateral_treaty", type: "definition", text: "Ansässigkeitsbesteuerung nach Artikel 15 Absatz 2 verlangt A und B und C. Unter-183 allein reicht nicht." },
  { key: "atsk-art15-condition-b", role: "bilateral_treaty", type: "definition", text: "Bedingung B: Vergütung von einem Arbeitgeber, der im Tätigkeitsstaat nicht ansässig ist, oder für einen solchen gezahlt." },
  { key: "atsk-art15-condition-c", role: "bilateral_treaty", type: "procedure", text: "Bedingung C: Vergütung nicht von Betriebsstätte oder fester Einrichtung des Arbeitgebers im Tätigkeitsstaat getragen. PE_UNRESOLVED oder FIXED_BASE_UNRESOLVED: Artikel 15(2) nicht abschließen." },
  { key: "atsk-art5-fixed-place", role: "bilateral_treaty", type: "definition", text: "Artikel 5: feste Betriebsstätte umfasst festen Geschäftssitz, Zweigstelle, Büro, Fabrik, Werkstatt u.a. Kein universeller PE-Merits-Motor in 0J." },
  { key: "atsk-art5-construction-threshold", role: "bilateral_treaty", type: "definition", text: "Bau- oder Montagestätte nur Betriebsstätte, wenn die Dauer zwölf Monate ÜBERSCHREITET. Genau zwölf Monate begründen keine Bau-Betriebsstätte unter dieser Wortlautlogik." },
  { key: "atsk-art5-not-gewerbe", role: "bilateral_treaty", type: "exception", text: "Zwölf-Monats-Bau-Betriebsstätte ist nicht Dienstleistungsanzeige, nicht gelegentliches/temporäres Gewerbe und nicht allgemeiner Dienstleistungsschwellenwert." },
  { key: "atsk-art7-attribution", role: "bilateral_treaty", type: "definition", text: "Artikel 7: Gewerbebetrieb eines Vertragsstaats nur im anderen Staat besteuert, soweit Gewinne einer dortigen Betriebsstätte zurechenbar sind." },
  { key: "atsk-art23-directional", role: "bilateral_treaty", type: "definition", text: "Artikel 23 ist richtungs- und einkunftsartabhängig. Keine globale AT_SK_RELIEF_METHOD." },
  { key: "atsk-art23-sk-mli-option-c", role: "mli", type: "definition", text: "Slowakische Abkommensansässigkeit: MLI Artikel 5 Option C ersetzt relevante ursprüngliche Artikel-23(1)-Entlastung. Wo Österreich besteuern darf, gewährt die Slowakei grundsätzlich CREDIT_METHOD_TREATY_BASE, begrenzt nach Vertrag/MLI." },
  { key: "atsk-art23-at-exemption-mli-a", role: "mli", type: "definition", text: "Österreichische Abkommensansässigkeit: Artikel 23(2) Freistellungsstruktur, modifiziert durch MLI Artikel 5 Option A. Bei anwendbarem Switch-over: CREDIT_METHOD_CANDIDATE statt pauschaler Freistellung." },
  { key: "atsk-universal-exemption-rejected", role: "bilateral_treaty", type: "exception", text: "AT-SK verwendet nicht pauschal EXEMPTION für alle Fälle. UNIVERSAL_EXEMPTION_LABEL ist abzulehnen." },
  { key: "atsk-universal-credit-rejected", role: "bilateral_treaty", type: "exception", text: "AT-SK verwendet nicht pauschal CREDIT für alle Fälle. UNIVERSAL_CREDIT_LABEL ist abzulehnen." },
  { key: "atsk-mli-art6-purpose", role: "mli", type: "definition", text: "MLI Artikel 6: Abkommenszweck / Präambelmodifikation. Kontext für Auslegung und Missbrauchsgrenzen, kein eigenständiger Einkommensverteilungsartikel." },
  { key: "atsk-mli-art7-ppt", role: "mli", type: "definition", text: "MLI Artikel 7 Principal Purpose Test: mechanische Artikelerfüllung begründet nicht automatisch Abkommensvorteil. PPT_REVIEW_REQUIRED wo relevant. Kein automatischer Zweck-Merits-Motor." },
  { key: "atsk-mli-art10-third-jurisdiction-pe", role: "mli", type: "definition", text: "MLI Artikel 10: Drittstaaten-Betriebsstätten-Missbrauchsgrenze. ANTI_ABUSE_REVIEW_REQUIRED statt pauschaler Zulassung." },
  { key: "atsk-mli-art13-option-a", role: "mli", type: "definition", text: "MLI Artikel 13 Option A modifiziert spezifische Tätigkeitsbefreiungen in Artikel 5. Vorbereitende/hilfsweise Charakterbedingung gilt operativ. Ursprünglicher 1978-Text bleibt als Provenienz getrennt." },
  { key: "atsk-mli-withholding-dates", role: "mli", type: "definition", text: "MLI-Quellensteuerwirkung AT und SK: Ereignisse ab 1. Januar 2019. Nicht mit anderen Steuerarten vermischen." },
  { key: "atsk-mli-at-other-dates", role: "mli", type: "definition", text: "MLI-sonstige Steuern Österreich: Veranlagungszeiträume ab 1. Januar 2020." },
  { key: "atsk-mli-sk-other-dates", role: "mli", type: "definition", text: "MLI-sonstige Steuern Slowakei: Veranlagungszeiträume ab 1. Juli 2019." },
  { key: "atsk-a1-not-tax", role: "bilateral_treaty", type: "exception", text: "A1 entscheidet nicht Abkommensansässigkeit, Artikel 14/15 oder Besteuerungsrechte. socialSecurityCompetentState ist nicht taxingRightState." },
  { key: "atsk-ss-not-treaty", role: "bilateral_treaty", type: "exception", text: "Sozialversicherungszuständigkeit ist nicht Abkommensansässigkeit und nicht Entlastungsstaat." },
  { key: "atsk-taxing-right-not-amount", role: "bilateral_treaty", type: "boundary", text: "STATE_MAY_TAX ist nicht TAX_AMOUNT_DUE. Kein Steuerrechner." },
  { key: "atsk-residence-not-all-income", role: "bilateral_treaty", type: "exception", text: "Abkommensansässigkeit begründet nicht automatisch Besteuerungsrecht für jede Einkunftsart. Artikel je Einkunftsposten." },
  { key: "atsk-oos-articles", role: "bilateral_treaty", type: "boundary", text: "Dividenden, Zinsen, Lizenzen, Kapitalgewinne, Renten, Künstler/Sportler, öffentliche Funktionen, Studenten, sonstige Einkünfte außerhalb V1: EXPLICITLY_OUT_OF_SCOPE oder spätere Erweiterung." },
  { key: "atsk-0i-handoff", role: "bilateral_treaty", type: "procedure", text: "Wissen für AT-SK-0I-Handoffs: at-tax-treaty-review-handoff, s13-dual-residence-treaty, s17-treaty-allocation-question. Knowledge available, connector nicht autorisiert." },
  { key: "atsk-no-calculator", role: "bilateral_treaty", type: "boundary", text: "Dieser Pack autorisiert keine Steuerbeträge, keine Buchhaltung, keine USt und keine öffentliche Laufzeit." },
]);

export const AT_SK_ALL_UNITS: readonly TreatyUnit[] = Object.freeze([
  ...AT_SK_SOURCE_FOUNDATION_UNITS,
  ...AT_SK_TREATY_UNITS,
]);

function dim(overrides: Partial<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>) {
  const base = {
    what: "atsk-treaty-identity",
    whoWhen: "atsk-select-treaty-version",
    documents: "atsk-src-authentic-treaty-1978",
    how: "atsk-art4-sequence",
    next: "atsk-0i-handoff",
    deadlines: "atsk-select-treaty-version",
    problems: "atsk-art4-map-terminal",
    dutiesAfter: "atsk-select-treaty-version",
    institution: "atsk-src-bmf-synthesized",
    boundaries: "atsk-no-calculator",
    freshness: "atsk-select-treaty-version",
    negatives: "atsk-taxing-right-not-amount",
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

export const AT_SK_TREATY_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { processKey: "atsk-select-treaty-version", processGroupId: "TAX_RESIDENCE", title: "Vertragsfassung und MLI-Schicht wählen", dimensions: dim({ what: "atsk-select-treaty-version", negatives: "atsk-mli-withholding-dates" }), extraRefs: [treatyRef("atsk-mli-at-other-dates", "mli"), treatyRef("atsk-mli-sk-other-dates", "mli")] },
  { processKey: "atsk-source-hierarchy", processGroupId: "TAX_RESIDENCE", title: "Quellenhierarchie verifizieren", dimensions: dim({ what: "atsk-src-authentic-treaty-1978", how: "atsk-src-bmf-synthesized", negatives: "atsk-src-bmf-synthesized" }), extraRefs: [treatyRef("atsk-src-succession-sk"), treatyRef("atsk-src-authentic-mli", "mli"), treatyRef("atsk-src-mli-position-at", "mli"), treatyRef("atsk-src-mli-position-sk", "mli"), treatyRef("atsk-src-sk-mof-status")] },
  { processKey: "atsk-dual-domestic-detect", processGroupId: "TAX_RESIDENCE", title: "Doppelte inländische Kandidatur", dimensions: dim({ what: "atsk-dual-domestic-candidate", negatives: "atsk-domestic-not-treaty" }) },
  { processKey: "atsk-art4-permanent-home", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 ständige Wohnstätte", dimensions: dim({ what: "atsk-art4-permanent-home", how: "atsk-art4-sequence", negatives: "atsk-art4-permanent-home" }) },
  { processKey: "atsk-art4-centre-vital", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 Mittelpunkt der Lebensinteressen", dimensions: dim({ what: "atsk-art4-centre-vital", how: "atsk-art4-centre-vital", negatives: "atsk-art4-centre-vital" }) },
  { processKey: "atsk-art4-habitual-abode", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 gewöhnlicher Aufenthalt", dimensions: dim({ what: "atsk-art4-habitual-abode", negatives: "atsk-art4-habitual-abode" }) },
  { processKey: "atsk-art4-nationality", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 Staatsangehörigkeit", dimensions: dim({ what: "atsk-art4-nationality", negatives: "atsk-art4-nationality-first-rejected" }) },
  { processKey: "atsk-art4-map-terminal", processGroupId: "TAX_RESIDENCE", title: "Artikel 4 MAP-Zweig", dimensions: dim({ what: "atsk-art4-map-terminal", problems: "atsk-art4-map-terminal" }) },
  { processKey: "atsk-art15-base", processGroupId: "EMPLOYMENT_INCOME", title: "Artikel 15 Grundregel", dimensions: dim({ what: "atsk-art15-base", negatives: "atsk-art15-base" }) },
  { processKey: "atsk-art15-three-condition", processGroupId: "EMPLOYMENT_INCOME", title: "Artikel 15 Dreiertest", dimensions: dim({ what: "atsk-art15-three-conditions", how: "atsk-art15-exact-183", problems: "atsk-art15-condition-c", negatives: "atsk-art15-calendar-year" }) },
  { processKey: "atsk-art14-classifier", processGroupId: "INDEPENDENT_WORK", title: "Artikel 14 Klassifikator", dimensions: dim({ what: "atsk-art14-standalone", how: "atsk-art14-vs-art7", negatives: "atsk-art14-vs-art7" }) },
  { processKey: "atsk-art14-fixed-base", processGroupId: "INDEPENDENT_WORK", title: "Artikel 14 feste Einrichtung", dimensions: dim({ what: "atsk-art14-base", how: "atsk-art14-attribution", negatives: "atsk-fixed-base-not-pe" }) },
  { processKey: "atsk-art5-bounded-pe", processGroupId: "INDEPENDENT_WORK", title: "Artikel 5 begrenzte Betriebsstätte", dimensions: dim({ what: "atsk-art5-fixed-place", how: "atsk-art5-construction-threshold", negatives: "atsk-art5-not-gewerbe" }) },
  { processKey: "atsk-art7-bounded-attribution", processGroupId: "INDEPENDENT_WORK", title: "Artikel 7 Zurechnungsgrenze", dimensions: dim({ what: "atsk-art7-attribution", negatives: "atsk-art5-not-gewerbe" }) },
  { processKey: "atsk-relief-sk-resident", processGroupId: "DOUBLE_TAX_RELIEF", title: "Slowakische Ansässigkeit MLI Option C", dimensions: dim({ what: "atsk-art23-sk-mli-option-c", how: "atsk-art23-directional", negatives: "atsk-universal-exemption-rejected" }), extraRefs: [treatyRef("atsk-art23-sk-mli-option-c", "mli")] },
  { processKey: "atsk-relief-at-resident", processGroupId: "DOUBLE_TAX_RELIEF", title: "Österreichische Ansässigkeit Art.23(2)+MLI A", dimensions: dim({ what: "atsk-art23-at-exemption-mli-a", how: "atsk-art23-directional", negatives: "atsk-universal-credit-rejected" }), extraRefs: [treatyRef("atsk-art23-at-exemption-mli-a", "mli")] },
  { processKey: "atsk-mli-anti-abuse", processGroupId: "DOUBLE_TAX_RELIEF", title: "MLI Anti-Missbrauchsgrenzen", dimensions: dim({ what: "atsk-mli-art7-ppt", how: "atsk-mli-art10-third-jurisdiction-pe", negatives: "atsk-mli-art6-purpose" }), extraRefs: [treatyRef("atsk-mli-art7-ppt", "mli"), treatyRef("atsk-mli-art10-third-jurisdiction-pe", "mli"), treatyRef("atsk-mli-art13-option-a", "mli")] },
  { processKey: "atsk-cross-domain-boundaries", processGroupId: "TAX_RESIDENCE", title: "Grenzüberschreitende Negativkontrollen", dimensions: dim({ what: "atsk-a1-not-tax", boundaries: "atsk-ss-not-treaty", negatives: "atsk-residence-not-all-income" }) },
  { processKey: "atsk-oos-expansion", processGroupId: "DOUBLE_TAX_RELIEF", title: "Außerhalb V1", dimensions: dim({ what: "atsk-oos-articles", boundaries: "atsk-oos-articles" }) },
]);

export type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: "COVERED" | "EXPLICITLY_OUT_OF_SCOPE";
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

function sc(
  id: string,
  label: string,
  coverage: "COVERED" | "EXPLICITLY_OUT_OF_SCOPE",
  claimKeys: readonly string[],
  processKeys: readonly string[],
): ScenarioSpec {
  return Object.freeze({ id, label, coverage, requiredClaimKeys: claimKeys, requiredProcessKeys: processKeys });
}

export const AT_SK_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  sc("s01-dual-domestic-art4", "AT+SK inländisch → Art.4", "COVERED", ["atsk-dual-domestic-candidate", "atsk-art4-sequence"], ["atsk-dual-domestic-detect", "atsk-art4-permanent-home"]),
  sc("s02-home-only-at", "Wohnstätte nur AT", "COVERED", ["atsk-art4-permanent-home"], ["atsk-art4-permanent-home"]),
  sc("s03-centre-sk", "beide Wohnstätten, Mittelpunkt SK", "COVERED", ["atsk-art4-centre-vital"], ["atsk-art4-centre-vital"]),
  sc("s04-habitual-at", "Mittelpunkt unklar, Aufenthalt AT", "COVERED", ["atsk-art4-habitual-abode"], ["atsk-art4-habitual-abode"]),
  sc("s05-nationality-sk", "Aufenthalt beide/neither, Staatsangehörigkeit SK", "COVERED", ["atsk-art4-nationality"], ["atsk-art4-nationality"]),
  sc("s06-map-required", "Staatsangehörigkeit beide/neither → MAP", "COVERED", ["atsk-art4-map-terminal"], ["atsk-art4-map-terminal"]),
  sc("s07-nationality-first-reject", "Staatsangehörigkeit zuerst abgelehnt", "COVERED", ["atsk-art4-nationality-first-rejected"], ["atsk-art4-nationality"]),
  sc("s08-art15-other-state", "Beschäftigung im anderen Staat", "COVERED", ["atsk-art15-base"], ["atsk-art15-base"]),
  sc("s09-art15-abc-pass", "Art.15 A+B+C erfüllt", "COVERED", ["atsk-art15-three-conditions"], ["atsk-art15-three-condition"]),
  sc("s10-art15-b-fail", "183 Tage, Arbeitgeber im Tätigkeitsstaat", "COVERED", ["atsk-art15-condition-b"], ["atsk-art15-three-condition"]),
  sc("s11-art15-c-fail", "183+B ok, PE/FE getragen", "COVERED", ["atsk-art15-condition-c"], ["atsk-art15-three-condition"]),
  sc("s12-rolling-12-reject", "rollierendes Zwölfmonatsjahr abgelehnt", "COVERED", ["atsk-art15-calendar-year"], ["atsk-art15-three-condition"]),
  sc("s13-bao-six-month-reject", "BAO-Sechsmonate abgelehnt", "COVERED", ["atsk-art4-habitual-abode", "atsk-art15-calendar-year"], ["atsk-art4-habitual-abode"]),
  sc("s14-art14-no-fixed-base", "selbständig ohne feste Einrichtung", "COVERED", ["atsk-art14-base"], ["atsk-art14-fixed-base"]),
  sc("s15-art14-with-fixed-base", "selbständig mit fester Einrichtung", "COVERED", ["atsk-art14-attribution"], ["atsk-art14-fixed-base"]),
  sc("s16-pe-not-fixed-base", "PE ≠ feste Einrichtung", "COVERED", ["atsk-fixed-base-not-pe"], ["atsk-art14-fixed-base"]),
  sc("s17-construction-12-months", "Bau genau 12 Monate", "COVERED", ["atsk-art5-construction-threshold"], ["atsk-art5-bounded-pe"]),
  sc("s18-construction-over-12", "Bau über 12 Monate", "COVERED", ["atsk-art5-construction-threshold"], ["atsk-art5-bounded-pe"]),
  sc("s19-dla-not-pe", "DLA ≠ PE", "COVERED", ["atsk-art5-not-gewerbe"], ["atsk-art5-bounded-pe"]),
  sc("s20-sk-resident-relief", "SK-Ansässiger, AT-besteuert", "COVERED", ["atsk-art23-sk-mli-option-c"], ["atsk-relief-sk-resident"]),
  sc("s21-at-resident-relief", "AT-Ansässiger, SK-besteuert", "COVERED", ["atsk-art23-at-exemption-mli-a"], ["atsk-relief-at-resident"]),
  sc("s22-universal-exemption-reject", "pauschale Freistellung abgelehnt", "COVERED", ["atsk-universal-exemption-rejected"], ["atsk-relief-at-resident"]),
  sc("s23-universal-credit-reject", "pauschale Anrechnung abgelehnt", "COVERED", ["atsk-universal-credit-rejected"], ["atsk-relief-sk-resident"]),
  sc("s24-ppt-review", "PPT-Review erforderlich", "COVERED", ["atsk-mli-art7-ppt"], ["atsk-mli-anti-abuse"]),
  sc("s25-mli-version-layer", "MLI-Schicht nach Datum", "COVERED", ["atsk-select-treaty-version", "atsk-mli-withholding-dates"], ["atsk-select-treaty-version"]),
  sc("s26-oos-article", "Artikel außerhalb V1", "EXPLICITLY_OUT_OF_SCOPE", ["atsk-oos-articles"], ["atsk-oos-expansion"]),
  sc("s27-tax-amount-oos", "Steuerbetrag", "EXPLICITLY_OUT_OF_SCOPE", ["atsk-no-calculator"], ["atsk-oos-expansion"]),
]);

export function evaluateAtSkTreatyProcessCompleteness() {
  const claimKeys = new Set(AT_SK_ALL_UNITS.map((unit) => unit.key));
  const incomplete = AT_SK_TREATY_PROCESSES.filter((process) =>
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !claimKeys.has(process.dimensions[dimension])));
  const covered = AT_SK_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").length;
  const outOfScope = AT_SK_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE").length;
  return Object.freeze({
    processCount: AT_SK_TREATY_PROCESSES.length,
    processCompletenessPercent: incomplete.length === 0 ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.processKey),
    coveredScenarioCount: covered,
    outOfScopeScenarioCount: outOfScope,
    blockedScenarioCount: 0,
  });
}

export function buildAtSkBilateralTaxTreatyPack(): CuratedBilateralTaxTreatyPack {
  const trust = item("trustDomain", "bilateral_tax_treaty", {
    code: BILATERAL_TAX_TRUST_DOMAIN,
    name: "Bilateral tax treaty provenance",
  });
  const jurisdiction = item("jurisdictions", "at-sk", {
    level: BILATERAL_TAX_JURISDICTION_LEVEL,
    code: AT_SK_TREATY_KEY,
    treatyCountries: ["AT", "SK"] as const,
    countryCode: null,
    authorityCountry: "MULTILATERAL" as const,
  });
  const scope = item("territorialScopes", "at-sk", {
    type: "bilateral_tax_treaty",
    jurisdictionIds: [jurisdiction.id],
    treatyCountries: ["AT", "SK"] as const,
  });
  const publisher = item("publishers", "bmf-atsk-tax-treaty", {
    name: "Bundesministerium der Finanzen / Finanzministerium SR",
    type: "treaty_depositary",
    territorialScopeId: scope.id,
    trustDomainId: trust.id,
  });
  const authority = item("authorities", "bmf-atsk-tax-treaty-authority", {
    publisherId: publisher.id,
    name: "BMF AT-SK authentic treaty, MLI positions, synthesized working text",
    type: "bilateral_treaty",
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityCountry: "MULTILATERAL" as const,
  });
  const claims = AT_SK_ALL_UNITS.map((unit) => item("claims", unit.key, {
    type: unit.type,
    text: unit.text,
    riskLevel: "high" as const,
    temporalClass: "CURRENT" as const,
    claimRole: unit.role,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityId: authority.id,
  }));
  const claimUnits = AT_SK_ALL_UNITS.map((unit) => treatyRef(unit.key, unit.role));
  const versions = [
    {
      temporalVersion: "base_treaty_1978",
      effectiveFrom: "1979-02-12",
      effectiveTo: "2018-12-31",
      baseTreatyDate: "1978-03-07",
      mliModified: false,
      mliEffectiveFrom: null,
      mliAdoptionDate: "2016-11-24",
      deMliSignatureDate: "2017-09-22",
      skMliSignatureDate: "2018-09-20",
      deMliEntryIntoForce: "2018-07-01",
      skMliEntryIntoForce: "2019-01-01",
      taxType: "BASE_TREATY_UNMODIFIED",
      sourceKind: "AUTHENTIC_BILATERAL_TREATY" as const,
      sourceVersion: "authentic-1978-cssr-at",
    },
    {
      temporalVersion: "mli_withholding_from_2019",
      effectiveFrom: "2019-01-01",
      effectiveTo: null,
      baseTreatyDate: "1978-03-07",
      mliModified: true,
      mliEffectiveFrom: "2019-01-01",
      mliAdoptionDate: "2016-11-24",
      deMliSignatureDate: "2017-09-22",
      skMliSignatureDate: "2018-09-20",
      deMliEntryIntoForce: "2018-07-01",
      skMliEntryIntoForce: "2019-01-01",
      taxType: "WITHHOLDING_TAX_EVENTS",
      sourceKind: "AUTHENTIC_BEPS_MLI" as const,
      sourceVersion: "mli-withholding-2019",
    },
    {
      temporalVersion: "mli_at_other_from_2020",
      effectiveFrom: "2020-01-01",
      effectiveTo: null,
      baseTreatyDate: "1978-03-07",
      mliModified: true,
      mliEffectiveFrom: "2020-01-01",
      mliAdoptionDate: "2016-11-24",
      deMliSignatureDate: "2017-09-22",
      skMliSignatureDate: "2018-09-20",
      deMliEntryIntoForce: "2018-07-01",
      skMliEntryIntoForce: "2019-01-01",
      taxType: "OTHER_TAX_AT_TAXABLE_PERIODS",
      sourceKind: "MLI_MATCHING_POSITION" as const,
      sourceVersion: "mli-at-other-2020",
    },
    {
      temporalVersion: "mli_sk_other_from_2019_07",
      effectiveFrom: "2019-07-01",
      effectiveTo: null,
      baseTreatyDate: "1978-03-07",
      mliModified: true,
      mliEffectiveFrom: "2019-07-01",
      mliAdoptionDate: "2016-11-24",
      deMliSignatureDate: "2017-09-22",
      skMliSignatureDate: "2018-09-20",
      deMliEntryIntoForce: "2018-07-01",
      skMliEntryIntoForce: "2019-01-01",
      taxType: "OTHER_TAX_SK_TAXABLE_PERIODS",
      sourceKind: "MLI_MATCHING_POSITION" as const,
      sourceVersion: "mli-sk-other-2019-07",
    },
  ] as const;
  const roleByKey = new Map(AT_SK_ALL_UNITS.map((unit) => [unit.key, unit.role]));
  const processes: BilateralTaxProcessDraft[] = versions.flatMap((version) =>
    AT_SK_TREATY_PROCESSES.map((spec) => {
      const dimensionRefs = PROCESS_COMPLETE_DIMENSIONS.map((dimension) =>
        treatyRef(
          spec.dimensions[dimension],
          roleByKey.get(spec.dimensions[dimension]) ?? "bilateral_treaty",
        ));
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
    packId: AT_SK_TAX_PACK_ID,
    treatyKey: AT_SK_TREATY_KEY,
    countryA: "AT",
    countryB: "SK",
    canonicalLanguage: "de",
    topicFamily: "TAX_TREATY",
    lifecycleState: "draft",
    sourceRefs: [
      treatyRef("atsk-src-authentic-treaty-1978"),
      treatyRef("atsk-src-succession-sk"),
      treatyRef("atsk-src-authentic-mli", "mli"),
      treatyRef("atsk-src-mli-position-at", "mli"),
      treatyRef("atsk-src-mli-position-sk", "mli"),
      treatyRef("atsk-src-bmf-synthesized"),
      treatyRef("atsk-src-sk-mof-status"),
    ],
    claimUnits,
    processGroups: ["TAX_RESIDENCE", "EMPLOYMENT_INCOME", "INDEPENDENT_WORK", "DOUBLE_TAX_RELIEF"] as const,
    effectiveFrom: "1979-02-12",
    effectiveTo: null,
    temporalVersion: "mli_sk_other_from_2019_07",
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
