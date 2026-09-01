/**
 * CB-0J DE↔SK unemployment coordination connector.
 * Links CB-0I EU unemployment core, German unemployment routing and the Slovak adapter.
 * Does not copy Articles 61–65a or national ALG / dávka merits.
 */
import {
  PROCESS_COMPLETE_DIMENSIONS,
  type ScenarioCoverage,
} from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_SHARED_ART1F_CLAIM_KEY,
  EU_SHARED_ART61_CLAIM_KEY,
  EU_SHARED_ART64_CLAIM_KEY,
  EU_SHARED_ART65_CLAIM_KEY,
  EU_SHARED_ART65A_CLAIM_KEY,
  EU_SHARED_DECISION_U3_CLAIM_KEY,
  EU_SHARED_JELTES_CLAIM_KEY,
  EU_SHARED_PD_U1_CLAIM_KEY,
  EU_SHARED_PD_U2_CLAIM_KEY,
  EU_SHARED_PD_U3_CLAIM_KEY,
  EU_UNEMP_UNITS,
} from "../../eu/unemployment-coordination/eu-unemployment-coordination-core-pack";
import {
  DE_UE_ART9_DECLARATION_VERSION,
  DE_UE_ART9_PUBLICATION_DATE,
  DE_UE_PRIMARY_PROCESS_KEY,
  DE_UE_UNITS,
} from "../../de/unemployment-coordination-routing/de-unemployment-coordination-routing-pack";
import {
  SK_UE_ART9_DECLARATION_VERSION,
  SK_UE_ART9_PUBLICATION_DATE,
  SK_UE_PRIMARY_PROCESS_KEY,
  SK_UE_UNITS,
} from "../../sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES,
  type CorridorProcessBinding,
  type CuratedCrossBorderConnectorPack,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
  validateCuratedCrossBorderConnectorPack,
} from "../../../source-registry/cross-border-connector-contracts";

export const DE_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID = "de_sk_unemployment_coordination" as const;
export const DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS = "prepared" as const;
export const ARTICLE_65A_ACTIVE_FOR_DE_SK = false as const;
export const DE_SK_UE_ART9_DE_VERSION = DE_UE_ART9_DECLARATION_VERSION;
export const DE_SK_UE_ART9_SK_VERSION = SK_UE_ART9_DECLARATION_VERSION;
export const DE_SK_UE_ART9_DE_PUBLICATION_DATE = DE_UE_ART9_PUBLICATION_DATE;
export const DE_SK_UE_ART9_SK_PUBLICATION_DATE = SK_UE_ART9_PUBLICATION_DATE;
export const DE_SK_UE_COPIED_EU_CLAIM_COUNT = 0 as const;

function euRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "EU" as const,
    trustDomain: "eu" as const, temporalClass: "CURRENT" as const,
  });
}
function deRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "DE" as const,
    trustDomain: "de" as const, temporalClass: "CURRENT" as const,
  });
}
function skRef(key: string): ForeignNationalStableReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "SK" as const,
    trustDomain: "sk" as const, temporalClass: "CURRENT" as const,
  });
}

export const DE_SK_UE_REUSED_ALG_KEYS = Object.freeze([
  "under-15-hours-not-destroy",
  "multiple-jobs-aggregated",
  "anwartschaft-12-in-30",
  "pd-u1-insurance-periods",
  "pd-u2-export-job-search",
  "u2-three-months-extend-six",
  "apply-u2-before-leaving",
  "u1-not-u2",
  "agentur-not-jobcenter",
  "no-hardcoded-local-agentur",
  "find-agentur-via-dienststellensuche",
  "nationality-not-automatic",
  "nebenjob-165-euro-freibetrag",
  "self-employed-30-percent-expenses",
]);

export const DE_SK_UE_EU_CLAIM_KEYS = Object.freeze(EU_UNEMP_UNITS.map((unit) => unit.key));
export const DE_SK_UE_DE_CLAIM_KEYS = Object.freeze([
  ...DE_UE_UNITS.map((unit) => unit.key),
  ...DE_SK_UE_REUSED_ALG_KEYS,
]);
export const DE_SK_UE_SK_CLAIM_KEYS = Object.freeze(SK_UE_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly (StableKnowledgeReference | ForeignNationalStableReference)[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`DE_SK_UE_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length),
  });
}

export const DE_SK_UE_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("de-sk-ue-case-classify", "DE-SK Arbeitslosenweg einordnen", "Arbeitslosigkeit berührt Deutschland und die Slowakei", "Staatsangehörigkeit und Locale nicht als Leistungsstaat setzen; EMPLOYED und SELF_EMPLOYED getrennt führen.", [euRef("ue-nationality-not-payer"), euRef("ue-locale-not-payer"), euRef("ue-title-ii-not-unemp-state"), deRef("de-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), deRef("de-ue-agentur-role"), skRef("sk-ue-socpoist-role"), skRef("sk-ue-upsvr-role"), euRef(EU_SHARED_ART65_CLAIM_KEY), deRef("de-ue-does-not-determine-art-11"), euRef("ue-document-classifier"), deRef("nationality-not-automatic")]),
  binding("de-sk-ue-states-not-collapsed", "Zuständige Staaten nicht zusammenziehen", "anwendbare Rechtsvorschriften, Leistungsstaat, Wohnsitz und letzte Tätigkeit werden vermengt", "competentState, benefitState, residenceState und lastActivityState getrennt führen.", [euRef("ue-title-ii-not-unemp-state"), euRef("ue-contributions-not-auto-payer"), euRef("ue-last-work-not-always-pays"), euRef("ue-residence-not-always-pays"), euRef("ue-work-de-not-auto-payer"), euRef("ue-work-other-not-auto-payer"), deRef("de-ue-does-not-determine-art-11"), skRef("sk-ue-socpoist-not-upsvr"), euRef(EU_SHARED_ART65_CLAIM_KEY), deRef("de-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-a1-not-unemp-award")]),
  binding("de-sk-ue-frontier-employee-de-to-sk", "Grenzgänger Arbeitnehmer DE nach SK", "Wohnsitz SK, letzte abhängige Tätigkeit DE, tägliche oder wöchentliche Rückkehr, vollarbeitslos", "Nicht automatisch deutsches ALG; UoZ beim ÚPSVaR und Anspruch bei Sociálna poisťovňa; deutsche Zeiten über U1.", [euRef(EU_SHARED_ART1F_CLAIM_KEY), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-return-frequency-required"), euRef("ue-nationality-not-frontier"), euRef("ue-last-work-not-payer-frontier"), skRef("sk-ue-upsvr-role"), skRef("sk-ue-socpoist-role"), deRef("de-ue-u1-employee"), euRef(EU_SHARED_PD_U1_CLAIM_KEY), euRef(EU_SHARED_JELTES_CLAIM_KEY), deRef("de-ue-agentur-role"), skRef("sk-ue-u1-not-award")]),
  binding("de-sk-ue-frontier-employee-sk-to-de", "Grenzgänger Arbeitnehmer SK nach DE", "Wohnsitz DE, letzte abhängige Tätigkeit SK, Grenzgänger, vollarbeitslos", "Nicht automatisch slowakische Leistung; deutsche Agentur und slowakische Zeiten über U1.", [euRef(EU_SHARED_ART1F_CLAIM_KEY), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-return-frequency-required"), euRef("ue-contributions-not-auto-payer"), deRef("de-ue-agentur-role"), skRef("sk-ue-u1-employee"), euRef(EU_SHARED_PD_U1_CLAIM_KEY), deRef("anwartschaft-12-in-30"), euRef(EU_SHARED_JELTES_CLAIM_KEY), deRef("de-ue-u1-not-award"), skRef("sk-ue-socpoist-role"), euRef("ue-nationality-not-payer")]),
  binding("de-sk-ue-partial-vs-whole", "Teil- und Vollarbeitslosigkeit trennen", "Teilarbeitslosigkeit soll dem Wohnsitzstaat folgen oder mit Vollarbeitslosigkeit vermengt werden", "Artikel 65 Absatz 1 beim zuständigen Staat belassen; nicht den Wohnsitzweg der Vollarbeitslosigkeit anwenden.", [euRef("ue-art-65-1-partial-intermittent"), euRef("ue-partial-not-residence-route"), euRef("ue-whole-not-partial"), euRef("ue-type-gate-mandatory"), euRef(EU_SHARED_DECISION_U3_CLAIM_KEY), euRef("ue-partial-not-u2"), euRef("ue-zero-hours-not-whole"), deRef("de-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-contract-exists-gate"), euRef("ue-short-time-not-whole"), deRef("de-ue-agentur-role")]),
  binding("de-sk-ue-non-frontier-return", "Nicht-Grenzgänger kehrt in den Wohnstaat zurück", "Vollarbeitslose Person ohne Grenzgängerstatus hat den Wohnsitz im anderen Staat gehalten und kehrt dorthin zurück", "Nicht als Grenzgänger umdeuten; Wohnsitzmittelpunkt verlangen.", [euRef("ue-non-frontier-return-residence"), euRef("ue-non-frontier-not-auto-frontier"), euRef("ue-residence-centre-of-interests"), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef(EU_SHARED_JELTES_CLAIM_KEY), euRef("ue-decision-u2-non-frontier-scope"), deRef("de-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-residence-not-anmeldung"), euRef("ue-registered-address-not-residence"), deRef("de-ue-agentur-role"), skRef("sk-ue-upsvr-role")]),
  binding("de-sk-ue-non-frontier-no-return", "Nicht-Grenzgänger kehrt nicht zurück", "Vollarbeitslose Person ohne Grenzgängerstatus bleibt im letzten Tätigkeitsstaat", "Letzten Rechtsvorschriftenstaat nicht in Wohnsitzwahl umdeuten.", [euRef("ue-non-frontier-remain-last-state"), euRef("ue-residence-not-always-pays"), euRef("ue-last-work-not-always-pays"), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-whole-routing-not-collapsed"), deRef("de-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-jeltes-no-choice"), euRef("ue-do-not-choose-better-benefit"), deRef("de-ue-agentur-role"), skRef("sk-ue-socpoist-role"), euRef("ue-title-ii-not-unemp-state")]),
  binding("de-sk-ue-article-65a-suppressed", "Artikel 65a DE-SK aktuell sperren", "Selbständiger Grenzgänger soll automatisch Artikel 65a oder deutsche Leistung nach 65a erhalten", "Zuerst Artikel 65; aktuelle Erklärungen 2025 revalidieren; DE↔SK derzeit nicht 65a-aktiv.", [euRef("ue-self-employed-not-auto-65a"), euRef(EU_SHARED_ART65A_CLAIM_KEY), euRef("ue-art-65a-requires-notification"), euRef("ue-art-65a-notification-lookup"), deRef("de-ue-art9-2025-se-coverage-possible"), skRef("sk-ue-art9-2025-se-coverage-possible"), deRef("de-ue-art9-not-eternal-false"), skRef("sk-ue-art9-not-eternal-false"), deRef("de-ue-system-coverage-not-person-insured"), skRef("sk-ue-system-coverage-not-person-insured"), euRef(EU_SHARED_ART65_CLAIM_KEY), deRef("de-ue-28a-not-automatic")]),
  binding("de-sk-ue-u1-routing", "PD U1 DE-SK führen", "U1 fehlt, gilt als Bewilligung oder wird mit U2 verwechselt", "U1 als Zeitennachweis; Papier nicht stets zwingend; Arbeitnehmer- und Selbständigenzeiten einschließen.", [euRef(EU_SHARED_PD_U1_CLAIM_KEY), euRef("ue-u1-not-award"), euRef("ue-u1-absence-not-impossible"), euRef("ue-institutional-period-exchange"), deRef("de-ue-u1-employee"), deRef("de-ue-u1-self-employed"), skRef("sk-ue-u1-employee"), skRef("sk-ue-u1-self-employed"), skRef("sk-ue-u1-paper-not-mandatory"), deRef("de-ue-finanzamt-not-u1"), euRef("ue-u2-not-u1"), deRef("u1-not-u2")]),
  binding("de-sk-ue-u2-de-to-sk", "Deutsches ALG mit U2 in die Slowakei ausführen", "ALG-Beziehende Person sucht Arbeit in der Slowakei", "Vor Abreise U2; vier Wochen Regel, mögliche Verkürzung; drei Monate aktuell; ÚPSVaR als Zielvermittlung.", [euRef(EU_SHARED_ART64_CLAIM_KEY), euRef(EU_SHARED_PD_U2_CLAIM_KEY), deRef("de-ue-u2-before-departure"), deRef("apply-u2-before-leaving"), deRef("de-ue-u2-four-weeks"), deRef("de-ue-u2-authorized-shortening"), euRef("ue-art-64-three-month-standard"), euRef("ue-art-64-extend-max-six"), euRef("ue-six-not-automatic"), skRef("sk-ue-incoming-de-u2"), deRef("pd-u2-export-job-search"), euRef("ue-u2-not-destination-benefit")]),
  binding("de-sk-ue-u2-sk-to-de", "Slowakische Leistung mit U2 nach Deutschland ausführen", "Beziehende Person sucht Arbeit in Deutschland", "Nicht in deutsches ALG umdeuten; Sociálna poisťovňa stellt U2 nach ÚPSVaR-Verfahren aus.", [euRef(EU_SHARED_ART64_CLAIM_KEY), skRef("sk-ue-u2-to-de"), skRef("sk-ue-u2-four-weeks"), skRef("sk-ue-u2-seven-day-registration"), skRef("sk-ue-u2-not-german-alg"), deRef("de-ue-incoming-sk-u2"), euRef("ue-art-64-three-month-standard"), euRef("ue-payer-remains-competent"), euRef("ue-destination-not-payer"), euRef("ue-art-64-seven-day-registration"), deRef("de-ue-agentur-role"), skRef("sk-ue-socpoist-role")]),
  binding("de-sk-ue-u3-interinstitutional", "U3 als Trägerhinweis führen", "Nutzer will U3 als Leistungsantrag oder Selbständigkeit beginnt während der Ausfuhr", "U3 ist trägerseitige Mitteilung, kein Nutzerantrag; Aufnahme von Beschäftigung oder Selbständigkeit löst Prüfung aus.", [euRef(EU_SHARED_PD_U3_CLAIM_KEY), euRef("ue-u3-not-auto-cancellation"), euRef("ue-decision-u3-not-portable-u3"), euRef("ue-job-during-export-recheck"), euRef("ue-destination-controls-art-55"), euRef("ue-document-classifier"), euRef("ue-u2-not-u1"), deRef("de-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), euRef("ue-physical-u2-not-still-valid"), skRef("sk-ue-active-szco-uoz-blocked"), deRef("de-ue-does-not-copy-eu-law")]),
  binding("de-sk-ue-mixed-delegate-al", "Gemischte Tätigkeit an Titel II verweisen", "Gleichzeitige Beschäftigung und Selbständigkeit in DE und SK oder unklare anwendbare Rechtsvorschriften", "Artikel 11 bis 13 nicht neu entscheiden; parallele Arbeitslosenversicherungssysteme nicht erfinden.", [deRef("de-ue-does-not-determine-art-11"), euRef("ue-title-ii-not-unemp-state"), euRef("ue-a1-not-unemp-award"), euRef("ue-posted-not-infer-payer"), deRef("de-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), deRef("de-ue-director-status-unclear"), skRef("sk-ue-director-status-unclear"), euRef("ue-foreign-not-auto-insurance"), euRef(EU_SHARED_ART61_CLAIM_KEY), deRef("de-ue-28a-not-automatic"), skRef("sk-ue-szco-not-automatic")]),
  binding("de-sk-ue-authority-split", "Träger DE-SK trennen", "Finanzamt, Krankenkasse, Jobcenter, Sociálna poisťovňa und ÚPSVaR werden vertauscht", "Agentur für Arbeit, Sociálna poisťovňa und ÚPSVaR getrennt; genaue Stelle live.", [deRef("de-ue-agentur-role"), deRef("agentur-not-jobcenter"), deRef("de-ue-finanzamt-not-u1"), deRef("de-ue-krankenkasse-not-u1"), deRef("de-ue-drv-not-u1"), skRef("sk-ue-socpoist-role"), skRef("sk-ue-upsvr-role"), skRef("sk-ue-socpoist-not-upsvr"), skRef("sk-ue-upsvr-not-cash-decision"), deRef("de-ue-agentur-instance-fetch-live"), skRef("sk-ue-socpoist-instance-fetch-live"), skRef("sk-ue-upsvr-instance-fetch-live")]),
  binding("de-sk-ue-proposed-law-gate", "Vorgeschlagenes Arbeitslosenrecht sperren", "Sechsmonatige Regelausfuhr, 22-Wochen-Regel oder 2016/0397 wird als geltendes Recht behandelt", "Als nicht geltende Revision führen; drei Monate bleiben aktuell.", [euRef("ue-proposed-six-month-not-current"), euRef("ue-proposed-22-week-not-current"), euRef("ue-pending-cod-not-current"), euRef("ue-six-not-current-standard"), euRef("ue-art-64-three-month-standard"), euRef(EU_SHARED_ART64_CLAIM_KEY), euRef("ue-current-65-frontier-residence-model"), deRef("u2-three-months-extend-six"), deRef("de-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-ep-first-reading-not-law"), euRef("ue-provisional-agreement-not-law")]),
  binding("de-sk-ue-frontier-self-employed", "Selbständige Grenzgänger DE-SK", "Letzte Selbständigkeit DE oder SK, Wohnsitz im anderen Staat, Grenzgängerfakten, vollarbeitslos", "Artikel 65 zuerst; 65a nicht automatisch; individuelle Versicherung getrennt von Systemmöglichkeit.", [euRef(EU_SHARED_ART1F_CLAIM_KEY), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-self-employed-not-auto-65a"), deRef("de-ue-28a-coverage-evidence"), skRef("sk-ue-voluntary-evidence"), deRef("de-ue-system-coverage-not-person-insured"), skRef("sk-ue-system-coverage-not-person-insured"), deRef("de-ue-art9-2025-se-coverage-possible"), skRef("sk-ue-art9-2025-se-coverage-possible"), skRef("sk-ue-szco-not-automatic"), deRef("de-ue-28a-not-automatic"), euRef("ue-art-65a-notification-lookup")]),
  binding("de-sk-ue-activity-change", "Tätigkeitswechsel und gemischte Geschichte", "Wechsel Arbeitnehmer/Selbständigkeit, ruhendes Gewerbe, živnosť oder Geschäftsaufgabe", "Perioden einzeln klassifizieren; Schließung nicht als Automatikanspruch; deutsche 15-Stunden-Regel nicht auf UoZ übertragen.", [deRef("de-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), deRef("de-ue-dormant-gewerbe-not-activity"), skRef("sk-ue-dormant-zivnost-not-activity"), deRef("de-ue-business-failure-not-alg"), skRef("sk-ue-business-closure-not-benefit"), deRef("de-ue-15h-national-not-sk"), skRef("sk-ue-de-15h-not-sk-uoz"), skRef("sk-ue-active-szco-uoz-blocked"), euRef("ue-foreign-not-auto-insurance"), euRef(EU_SHARED_ART61_CLAIM_KEY), deRef("de-ue-gewerbe-not-28a")]),
  binding("de-sk-ue-residence-evidence", "Wohnsitznachweis Artikel 65", "Wohnsitz wird aus Anmeldung, trvalý pobyt, Staatsangehörigkeit oder Steueransässigkeit abgeleitet", "Mittelpunkt der Interessen verlangen; Meldeadresse reicht nicht.", [euRef("ue-residence-centre-of-interests"), euRef("ue-residence-not-anmeldung"), euRef("ue-registered-address-not-residence"), euRef("ue-nationality-not-payer"), euRef("ue-residence-unclear-fail-closed"), euRef("ue-address-not-auto-frontier"), deRef("nationality-not-automatic"), skRef("sk-ue-does-not-copy-eu-law"), deRef("de-ue-does-not-copy-eu-law"), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-cross-border-not-auto-frontier"), euRef("ue-locale-not-payer")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

function sc(
  id: string,
  label: string,
  coverage: ScenarioCoverage,
  requiredClaimKeys: readonly string[],
  requiredProcessKeys: readonly string[],
): ScenarioSpec {
  return Object.freeze({ id, label, coverage, requiredClaimKeys, requiredProcessKeys });
}

export const DE_SK_UE_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  sc("s01-employee-de-residence-de", "Arbeitnehmer DE, Wohnsitz DE, arbeitslos", "COVERED", ["anwartschaft-12-in-30", "de-ue-agentur-role"], ["de-sk-ue-case-classify"]),
  sc("s02-employee-sk-residence-sk", "Arbeitnehmer SK, Wohnsitz SK, arbeitslos", "COVERED", ["sk-ue-employee-compulsory", "sk-ue-730-day-gate"], ["de-sk-ue-case-classify"]),
  sc("s03-frontier-employee-de-res-sk-whole", "Grenzgänger Arbeitnehmer DE, Wohnsitz SK, vollarbeitslos", "COVERED", ["ue-art-65-frontier-residence", "sk-ue-upsvr-role"], ["de-sk-ue-frontier-employee-de-to-sk"]),
  sc("s04-frontier-employee-sk-res-de-whole", "Grenzgänger Arbeitnehmer SK, Wohnsitz DE, vollarbeitslos", "COVERED", ["ue-art-65-frontier-residence", "de-ue-agentur-role"], ["de-sk-ue-frontier-employee-sk-to-de"]),
  sc("s05-frontier-employee-de-res-sk-partial", "Grenzgänger Arbeitnehmer DE, Wohnsitz SK, teilarbeitslos", "COVERED", ["ue-art-65-1-partial-intermittent", "ue-partial-not-residence-route"], ["de-sk-ue-partial-vs-whole"]),
  sc("s06-frontier-employee-sk-res-de-partial", "Grenzgänger Arbeitnehmer SK, Wohnsitz DE, teilarbeitslos", "COVERED", ["ue-whole-not-partial", "ue-partial-not-u2"], ["de-sk-ue-partial-vs-whole"]),
  sc("s07-non-frontier-de-returns-sk", "Nicht-Grenzgänger DE-Tätigkeit, Wohnsitz SK, kehrt zurück", "COVERED", ["ue-non-frontier-return-residence", "ue-non-frontier-not-auto-frontier"], ["de-sk-ue-non-frontier-return"]),
  sc("s08-non-frontier-de-does-not-return", "Nicht-Grenzgänger DE-Tätigkeit, kehrt nicht zurück", "COVERED", ["ue-non-frontier-remain-last-state"], ["de-sk-ue-non-frontier-no-return"]),
  sc("s09-non-frontier-sk-returns-de", "Nicht-Grenzgänger SK-Tätigkeit, Wohnsitz DE, kehrt zurück", "COVERED", ["ue-non-frontier-return-residence", "ue-residence-centre-of-interests"], ["de-sk-ue-non-frontier-return"]),
  sc("s10-german-periods-sk-claim-u1", "Deutsche Zeiten in SK-Anspruch über U1", "COVERED", ["sk-ue-foreign-periods-aggregation", "ue-pd-u1-period-evidence"], ["de-sk-ue-u1-routing"]),
  sc("s11-slovak-periods-de-claim-u1", "Slowakische Zeiten in DE-Anspruch über U1", "COVERED", ["pd-u1-insurance-periods", "sk-ue-u1-employee"], ["de-sk-ue-u1-routing"]),
  sc("s12-no-paper-u1-institution-requests", "Kein Papier-U1, Träger kann Daten einholen", "COVERED", ["ue-u1-absence-not-impossible", "sk-ue-u1-paper-not-mandatory"], ["de-sk-ue-u1-routing"]),
  sc("s13-u1-treated-as-benefit-decision", "U1 fälschlich als Leistungsentscheidung", "COVERED", ["ue-u1-not-award", "de-ue-u1-not-award"], ["de-sk-ue-u1-routing"]),
  sc("s14-german-u1-employee", "Deutsches U1 Arbeitnehmerzeit", "COVERED", ["de-ue-u1-employee"], ["de-sk-ue-u1-routing"]),
  sc("s15-german-u1-28a", "Deutsches U1 §-28a-Zeit", "COVERED", ["de-ue-u1-self-employed", "de-ue-28a-coverage-evidence"], ["de-sk-ue-u1-routing"]),
  sc("s16-slovak-u1-employee", "Slowakisches U1 Arbeitnehmerzeit", "COVERED", ["sk-ue-u1-employee"], ["de-sk-ue-u1-routing"]),
  sc("s17-slovak-u1-voluntary-szco", "Slowakisches U1 freiwillige SZČO-Zeit", "COVERED", ["sk-ue-u1-self-employed"], ["de-sk-ue-u1-routing"]),
  sc("s18-de-szco-never-28a", "DE-Selbständige nie nach § 28a eingeschrieben", "COVERED", ["de-ue-28a-not-automatic", "de-ue-gewerbe-not-28a"], ["de-sk-ue-frontier-self-employed"]),
  sc("s19-de-szco-valid-28a", "DE-Selbständige mit verifizierter §-28a-Deckung", "COVERED", ["de-ue-28a-coverage-evidence", "de-ue-28a-legal-term"], ["de-sk-ue-frontier-self-employed"]),
  sc("s20-de-28a-after-3-month-deadline", "§-28a-Antrag nach Drei-Monats-Frist", "COVERED", ["de-ue-28a-3-month-deadline"], ["de-sk-ue-activity-change"]),
  sc("s21-de-28a-under-15h-from-start", "§ 28a, Selbständigkeit von Beginn unter 15 Stunden", "COVERED", ["de-ue-28a-15h-entry"], ["de-sk-ue-activity-change"]),
  sc("s22-de-28a-historical-business-ended", "Historische §-28a-Deckung, Betrieb später beendet", "COVERED", ["de-ue-28a-termination-review", "de-ue-28a-periods-can-count"], ["de-sk-ue-activity-change"]),
  sc("s23-alg-self-employment-under-15h", "ALG-Beziehende mit Selbständigkeit unter 15 Stunden", "COVERED", ["under-15-hours-not-destroy", "de-ue-15h-national-not-sk"], ["de-sk-ue-activity-change"]),
  sc("s24-alg-self-employment-at-least-15h", "ALG-Beziehende mit Selbständigkeit ab 15 Stunden", "COVERED", ["under-15-hours-not-destroy", "de-ue-15h-national-not-sk"], ["de-sk-ue-activity-change"]),
  sc("s25-two-german-side-activities-15h", "Zwei deutsche Nebentätigkeiten zusammen ab 15 Stunden", "COVERED", ["multiple-jobs-aggregated"], ["de-sk-ue-activity-change"]),
  sc("s26-business-profit-as-alg-salary", "Betriebsertrag fälschlich als ALG-Gehalt", "COVERED", ["de-ue-profit-not-bemessungsentgelt"], ["de-sk-ue-activity-change"]),
  sc("s27-former-de-szco-fiktive-bemessung", "Ehemalige DE-Selbständige, fiktive Bemessung", "COVERED", ["de-ue-fiktive-bemessung"], ["de-sk-ue-activity-change"]),
  sc("s28-sk-szco-without-voluntary", "SK-SZČO ohne freiwillige Arbeitslosenversicherung", "COVERED", ["sk-ue-szco-not-automatic"], ["de-sk-ue-frontier-self-employed"]),
  sc("s29-sk-szco-verified-voluntary", "SK-SZČO mit verifizierter freiwilliger Versicherung", "COVERED", ["sk-ue-voluntary-evidence", "sk-ue-voluntary-section-19"], ["de-sk-ue-frontier-self-employed"]),
  sc("s30-sk-sickness-pension-mistaken", "Pflichtkranken- und Pensionsversicherung als Arbeitslosenversicherung", "COVERED", ["sk-ue-sickness-pension-not-unemployment"], ["de-sk-ue-frontier-self-employed"]),
  sc("s31-zivnost-mistaken-for-insurance", "Živnosť als Arbeitslosenversicherung", "COVERED", ["sk-ue-zivnost-not-insurance"], ["de-sk-ue-activity-change"]),
  sc("s32-active-sk-szco-enters-uoz", "Aktive SK-SZČO will UoZ", "COVERED", ["sk-ue-active-szco-uoz-blocked"], ["de-sk-ue-activity-change"]),
  sc("s33-sk-szco-ends-then-uoz", "SK-SZČO beendet Tätigkeit, dann UoZ", "COVERED", ["sk-ue-former-szco-after-end"], ["de-sk-ue-activity-change"]),
  sc("s34-sk-730-days-met", "SK 730 Tage erfüllt", "COVERED", ["sk-ue-730-day-gate"], ["de-sk-ue-case-classify"]),
  sc("s35-sk-730-days-not-met", "SK 730 Tage nicht erfüllt", "COVERED", ["sk-ue-730-day-gate", "sk-ue-application-not-approval"], ["de-sk-ue-case-classify"]),
  sc("s36-foreign-eu-periods-for-730", "Ausländische EU-Zeiten für 730 Tage", "COVERED", ["sk-ue-foreign-periods-aggregation", "ue-art-61-aggregation"], ["de-sk-ue-u1-routing"]),
  sc("s37-sk-voluntary-payment-incomplete", "SK freiwillige Versicherung, Zahlung unvollständig", "COVERED", ["sk-ue-payment-gate"], ["de-sk-ue-frontier-self-employed"]),
  sc("s38-sk-2025-entitlement-paid-2026", "SK-Anspruch 2025, Zahlung 2026", "COVERED", ["sk-ue-pre-2026-flat-50"], ["de-sk-ue-case-classify"]),
  sc("s39-sk-new-entitlement-from-2026", "Neuer SK-Anspruch ab 2026-01-01", "COVERED", ["sk-ue-2026-taper"], ["de-sk-ue-case-classify"]),
  sc("s40-sk-50-50-50-40-30-20", "SK 50/50/50/40/30/20-Staffel", "COVERED", ["sk-ue-2026-taper", "sk-ue-max-six-months"], ["de-sk-ue-case-classify"]),
  sc("s41-de-alg-export-to-sk", "DE-ALG-Export in die Slowakei", "COVERED", ["de-ue-u2-before-departure", "ue-pd-u2-export-authorization"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s42-de-u2-after-departure", "DE-U2 nach Abreise verlangt", "COVERED", ["apply-u2-before-leaving", "de-ue-u2-before-departure"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s43-de-u2-four-week-wait", "DE-U2 Vier-Wochen-Frist", "COVERED", ["de-ue-u2-four-weeks", "ue-art-64-four-week-default"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s44-de-u2-authorized-early", "DE-U2 zugelassene frühe Abreise", "COVERED", ["de-ue-u2-authorized-shortening", "ue-four-week-not-absolute"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s45-de-u2-three-months", "DE-U2 drei Monate aktuell", "COVERED", ["ue-art-64-three-month-standard", "u2-three-months-extend-six"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s46-de-u2-extension-to-six", "DE-U2 Verlängerung bis sechs Monate", "COVERED", ["ue-art-64-extend-max-six", "ue-extension-requires-authorization"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s47-de-u2-treated-as-auto-six", "DE-U2 als automatische sechs Monate", "COVERED", ["ue-u2-not-auto-six-months", "ue-six-not-automatic"], ["de-sk-ue-proposed-law-gate"]),
  sc("s48-sk-benefit-export-to-de", "SK-Leistungsexport nach Deutschland", "COVERED", ["sk-ue-u2-to-de", "sk-ue-u2-not-german-alg"], ["de-sk-ue-u2-sk-to-de"]),
  sc("s49-sk-u2-registration-deadline", "SK-U2 Zielanmeldung innerhalb der Frist", "COVERED", ["sk-ue-u2-seven-day-registration", "ue-art-64-seven-day-registration"], ["de-sk-ue-u2-sk-to-de"]),
  sc("s50-incoming-de-u2-upsvr", "Eingehendes DE-U2 beim ÚPSVaR", "COVERED", ["sk-ue-incoming-de-u2"], ["de-sk-ue-u2-de-to-sk"]),
  sc("s51-incoming-sk-u2-agentur", "Eingehendes SK-U2 bei der Agentur", "COVERED", ["de-ue-incoming-sk-u2"], ["de-sk-ue-u2-sk-to-de"]),
  sc("s52-employment-during-u2-export", "Beschäftigung beginnt während U2-Export", "COVERED", ["ue-job-during-export-recheck"], ["de-sk-ue-u3-interinstitutional"]),
  sc("s53-self-employment-during-u2-export", "Selbständigkeit beginnt während U2-Export", "COVERED", ["ue-job-during-export-recheck", "sk-ue-active-szco-uoz-blocked"], ["de-sk-ue-u3-interinstitutional"]),
  sc("s54-u3-notification", "U3-Mitteilungsszenario", "COVERED", ["ue-pd-u3-export-warning", "ue-u3-not-auto-cancellation"], ["de-sk-ue-u3-interinstitutional"]),
  sc("s55-u3-mistaken-user-application", "U3 als Nutzerantrag verwechselt", "COVERED", ["ue-decision-u3-not-portable-u3", "ue-document-classifier"], ["de-sk-ue-u3-interinstitutional"]),
  sc("s56-de-self-employed-frontier-res-sk", "DE-selbständiger Grenzgänger, Wohnsitz SK", "COVERED", ["de-ue-28a-coverage-evidence", "ue-self-employed-not-auto-65a"], ["de-sk-ue-frontier-self-employed"]),
  sc("s57-sk-self-employed-frontier-res-de", "SK-selbständiger Grenzgänger, Wohnsitz DE", "COVERED", ["sk-ue-voluntary-evidence", "ue-self-employed-not-auto-65a"], ["de-sk-ue-frontier-self-employed"]),
  sc("s58-65a-wrongly-from-self-employed", "Artikel 65a allein wegen Selbständigkeit", "COVERED", ["ue-self-employed-not-auto-65a"], ["de-sk-ue-article-65a-suppressed"]),
  sc("s59-65a-wrongly-for-sk-residence", "Artikel 65a bei SK-Wohnsitz trotz Deckungsmöglichkeit", "COVERED", ["sk-ue-art9-2025-se-coverage-possible", "ue-art-65a-requires-notification"], ["de-sk-ue-article-65a-suppressed"]),
  sc("s60-65a-wrongly-for-de-residence", "Artikel 65a bei DE-Wohnsitz trotz Deckungsmöglichkeit", "COVERED", ["de-ue-art9-2025-se-coverage-possible"], ["de-sk-ue-article-65a-suppressed"]),
  sc("s61-de-article9-declaration-changes", "Deutsche Artikel-9-Erklärung ändert sich", "COVERED", ["de-ue-art9-not-eternal-false", "ue-art-65a-notification-lookup"], ["de-sk-ue-article-65a-suppressed"]),
  sc("s62-sk-article9-declaration-changes", "Slowakische Artikel-9-Erklärung ändert sich", "COVERED", ["sk-ue-art9-not-eternal-false"], ["de-sk-ue-article-65a-suppressed"]),
  sc("s63-system-coverage-person-not-insured", "System ermöglicht Deckung, Person nicht versichert", "COVERED", ["de-ue-system-coverage-not-person-insured", "sk-ue-system-coverage-not-person-insured"], ["de-sk-ue-article-65a-suppressed"]),
  sc("s64-employee-de-then-szco-sk", "Arbeitnehmer DE, dann SZČO SK", "COVERED", ["de-ue-activity-change-reeval", "sk-ue-activity-change-reeval"], ["de-sk-ue-activity-change"]),
  sc("s65-employee-sk-then-self-employed-de", "Arbeitnehmer SK, dann selbständig DE", "COVERED", ["de-ue-28a-3-month-deadline", "sk-ue-activity-change-reeval"], ["de-sk-ue-activity-change"]),
  sc("s66-simultaneous-employed-de-szco-sk", "Gleichzeitig beschäftigt DE und SZČO SK", "COVERED", ["de-ue-does-not-determine-art-11", "ue-title-ii-not-unemp-state"], ["de-sk-ue-mixed-delegate-al"]),
  sc("s67-simultaneous-employed-sk-self-employed-de", "Gleichzeitig beschäftigt SK und selbständig DE", "COVERED", ["de-ue-does-not-determine-art-11"], ["de-sk-ue-mixed-delegate-al"]),
  sc("s68-applicable-legislation-unresolved", "Anwendbare Rechtsvorschriften ungelöst", "COVERED", ["de-ue-does-not-determine-art-11", "ue-a1-not-unemp-award"], ["de-sk-ue-mixed-delegate-al"]),
  sc("s69-dormant-gewerbe", "Ruhendes Gewerbe", "COVERED", ["de-ue-dormant-gewerbe-not-activity"], ["de-sk-ue-activity-change"]),
  sc("s70-dormant-zivnost", "Ruhende živnosť", "COVERED", ["sk-ue-dormant-zivnost-not-activity"], ["de-sk-ue-activity-change"]),
  sc("s71-business-closure-assumed-benefit", "Geschäftsaufgabe als Automatikanspruch", "COVERED", ["de-ue-business-failure-not-alg", "sk-ue-business-closure-not-benefit"], ["de-sk-ue-activity-change"]),
  sc("s72-company-director-unclear", "Geschäftsführer- oder konateľ-Status unklar", "COVERED", ["de-ue-director-status-unclear", "sk-ue-director-status-unclear"], ["de-sk-ue-mixed-delegate-al"]),
  sc("s73-residence-from-anmeldung-only", "Wohnsitz nur aus Anmeldung", "COVERED", ["ue-residence-not-anmeldung"], ["de-sk-ue-residence-evidence"]),
  sc("s74-residence-from-trvaly-pobyt-only", "Wohnsitz nur aus trvalý pobyt", "COVERED", ["ue-residence-centre-of-interests", "ue-registered-address-not-residence"], ["de-sk-ue-residence-evidence"]),
  sc("s75-slovak-nationality-as-sk-benefit-state", "Slowakische Staatsangehörigkeit als SK-Leistungsstaat", "COVERED", ["ue-nationality-not-payer", "nationality-not-automatic"], ["de-sk-ue-case-classify"]),
  sc("s76-german-nationality-as-de-benefit-state", "Deutsche Staatsangehörigkeit als DE-Leistungsstaat", "COVERED", ["ue-nationality-not-payer"], ["de-sk-ue-case-classify"]),
  sc("s77-proposed-six-month-as-current", "Vorgeschlagene sechsmonatige Ausfuhr als geltendes Recht", "COVERED", ["ue-proposed-six-month-not-current", "ue-six-not-current-standard"], ["de-sk-ue-proposed-law-gate"]),
  sc("s78-proposed-22-week-as-current", "Vorgeschlagene 22-Wochen-Regel als geltendes Recht", "COVERED", ["ue-proposed-22-week-not-current", "ue-pending-cod-not-current"], ["de-sk-ue-proposed-law-gate"]),
  sc("s79-uk-case", "UK-Fall", "EXPLICITLY_OUT_OF_SCOPE", ["ue-uk-out-of-scope"], ["de-sk-ue-case-classify"]),
  sc("s80-non-eu-bilateral", "Nicht-EU-bilateraler Fall", "EXPLICITLY_OUT_OF_SCOPE", ["ue-non-eu-bilateral-out-of-scope"], ["de-sk-ue-case-classify"]),
]);

export const DE_SK_UE_NEGATIVE_CONTROLS = Object.freeze([
  "de-ue-28a-not-automatic",
  "de-ue-gewerbe-not-28a",
  "sk-ue-szco-not-automatic",
  "sk-ue-sickness-pension-not-unemployment",
  "sk-ue-zivnost-not-insurance",
  "ue-u1-not-award",
  "ue-u2-not-u1",
  "ue-document-classifier",
  "ue-u2-not-auto-six-months",
  "ue-u2-not-destination-benefit",
  "ue-nationality-not-frontier",
  "ue-address-not-auto-frontier",
  "ue-whole-not-partial",
  "ue-contributions-not-auto-payer",
  "ue-title-ii-not-unemp-state",
  "ue-residence-not-anmeldung",
  "de-ue-15h-national-not-sk",
  "sk-ue-active-szco-uoz-blocked",
  "de-ue-business-failure-not-alg",
  "sk-ue-business-closure-not-benefit",
  "ue-self-employed-not-auto-65a",
  "de-ue-system-coverage-not-person-insured",
  "de-ue-profit-not-bemessungsentgelt",
  "ue-foreign-not-auto-insurance",
  "ue-art-61-aggregation",
  "sk-ue-socpoist-not-upsvr",
  "sk-ue-upsvr-not-cash-decision",
  "de-ue-finanzamt-not-u1",
  "de-ue-krankenkasse-not-u1",
  "ue-proposed-six-month-not-current",
  "ue-pending-cod-not-current",
  "sk-ue-de-15h-not-sk-uoz",
  "de-ue-drv-not-u1",
  "ue-six-not-automatic",
  "sk-ue-u1-not-award",
  "de-ue-u1-not-award",
]);

export function evaluateDeSkUnemploymentProcessCompleteness() {
  const processKeys = new Set(DE_SK_UE_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...DE_SK_UE_EU_CLAIM_KEYS,
    ...DE_SK_UE_DE_CLAIM_KEYS,
    ...DE_SK_UE_SK_CLAIM_KEYS,
  ]);
  const incomplete = DE_SK_UE_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = DE_SK_UE_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = DE_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = DE_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = DE_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const outOfScopeMissing = outOfScope.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && missingClaims.length === 0
    && uncoveredRequired.length === 0 && outOfScopeMissing.length === 0 && blocked.length === 0;
  return Object.freeze({
    processCount: DE_SK_UE_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: DE_SK_UE_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
    outOfScopeMissing,
    copiedEuClaimCount: DE_SK_UE_COPIED_EU_CLAIM_COUNT,
  });
}

export function evaluateDeSkUnemploymentArticle65a() {
  const claimKeys = new Set([
    ...DE_SK_UE_EU_CLAIM_KEYS,
    ...DE_SK_UE_DE_CLAIM_KEYS,
    ...DE_SK_UE_SK_CLAIM_KEYS,
  ]);
  const processKeys = new Set(DE_SK_UE_PROCESSES.map((process) => process.key));
  const coveredIds = new Set(
    DE_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").map((scenario) => scenario.id),
  );
  return Object.freeze({
    article65aActiveForDeSk: ARTICLE_65A_ACTIVE_FOR_DE_SK,
    article65aActiveForDeResidence: false,
    article65aActiveForSkResidence: false,
    deSystemCoveragePossible: claimKeys.has("de-ue-art9-2025-se-coverage-possible"),
    skSystemCoveragePossible: claimKeys.has("sk-ue-art9-2025-se-coverage-possible"),
    sharedCapabilityPreserved: claimKeys.has(EU_SHARED_ART65A_CLAIM_KEY)
      && processKeys.has("de-sk-ue-article-65a-suppressed"),
    staleDeclarationRejected: claimKeys.has("de-ue-art9-not-eternal-false")
      && claimKeys.has("sk-ue-art9-not-eternal-false")
      && claimKeys.has("ue-art-65a-notification-lookup"),
    tamperSelfEmployedAutoRejected: coveredIds.has("s58-65a-wrongly-from-self-employed")
      && claimKeys.has("ue-self-employed-not-auto-65a"),
    tamperSkResidenceRejected: coveredIds.has("s59-65a-wrongly-for-sk-residence"),
    tamperDeResidenceRejected: coveredIds.has("s60-65a-wrongly-for-de-residence"),
    declarationChangeCovered: coveredIds.has("s61-de-article9-declaration-changes")
      && coveredIds.has("s62-sk-article9-declaration-changes"),
    systemVsPersonSeparated: claimKeys.has("de-ue-system-coverage-not-person-insured")
      && claimKeys.has("sk-ue-system-coverage-not-person-insured")
      && coveredIds.has("s63-system-coverage-person-not-insured"),
    hypotheticalFutureRepresentable: claimKeys.has(EU_SHARED_ART65A_CLAIM_KEY)
      && ARTICLE_65A_ACTIVE_FOR_DE_SK === false,
    currentDeclarationsVerified: DE_SK_UE_ART9_DE_VERSION === "2025"
      && DE_SK_UE_ART9_SK_VERSION === "2025"
      && DE_SK_UE_ART9_DE_PUBLICATION_DATE === "2026-08-06"
      && DE_SK_UE_ART9_SK_PUBLICATION_DATE === "2026-08-06",
  });
}

export function evaluateDeSkUnemploymentSelfEmployedHardening() {
  const claimKeys = new Set([
    ...DE_SK_UE_EU_CLAIM_KEYS,
    ...DE_SK_UE_DE_CLAIM_KEYS,
    ...DE_SK_UE_SK_CLAIM_KEYS,
  ]);
  const processKeys = new Set(DE_SK_UE_PROCESSES.map((process) => process.key));
  const coveredIds = new Set(
    DE_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").map((scenario) => scenario.id),
  );
  return Object.freeze({
    activityTypes: CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES,
    selfEmployedExplicit: CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("SELF_EMPLOYED")
      && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("MIXED_EMPLOYED_SELF_EMPLOYED")
      && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("FORMER_SELF_EMPLOYED"),
    de28aNotAutomatic: claimKeys.has("de-ue-28a-not-automatic") && coveredIds.has("s18-de-szco-never-28a"),
    skNotAutomatic: claimKeys.has("sk-ue-szco-not-automatic") && coveredIds.has("s28-sk-szco-without-voluntary"),
    mixedDelegatesToApplicableLegislation: processKeys.has("de-sk-ue-mixed-delegate-al")
      && coveredIds.has("s66-simultaneous-employed-de-szco-sk")
      && coveredIds.has("s68-applicable-legislation-unresolved"),
    activityChangeCovered: coveredIds.has("s64-employee-de-then-szco-sk")
      && coveredIds.has("s65-employee-sk-then-self-employed-de"),
    de15hNotTransferred: claimKeys.has("de-ue-15h-national-not-sk") && claimKeys.has("sk-ue-de-15h-not-sk-uoz"),
    uozBlocked: coveredIds.has("s32-active-sk-szco-enters-uoz"),
    negativeControlsPresent: DE_SK_UE_NEGATIVE_CONTROLS.every((key) => claimKeys.has(key)),
    negativeControlCount: DE_SK_UE_NEGATIVE_CONTROLS.length,
  });
}

export function evaluateDeSkUnemploymentTemporal() {
  const claimKeys = new Set([
    ...DE_SK_UE_EU_CLAIM_KEYS,
    ...DE_SK_UE_DE_CLAIM_KEYS,
    ...DE_SK_UE_SK_CLAIM_KEYS,
  ]);
  const coveredIds = new Set(
    DE_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").map((scenario) => scenario.id),
  );
  return Object.freeze({
    sk2025Vs2026Split: coveredIds.has("s38-sk-2025-entitlement-paid-2026")
      && coveredIds.has("s39-sk-new-entitlement-from-2026")
      && claimKeys.has("sk-ue-pre-2026-flat-50")
      && claimKeys.has("sk-ue-2026-taper"),
    currentThreeMonthVsProposedSix: coveredIds.has("s45-de-u2-three-months")
      && coveredIds.has("s77-proposed-six-month-as-current")
      && claimKeys.has("ue-art-64-three-month-standard")
      && claimKeys.has("ue-proposed-six-month-not-current"),
    currentArt65VsProposal: coveredIds.has("s78-proposed-22-week-as-current")
      && claimKeys.has("ue-current-65-frontier-residence-model")
      && claimKeys.has("ue-proposed-22-week-not-current"),
  });
}

export function buildDeSkUnemploymentCoordinationConnectorPack(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: DE_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID,
    originMarket: "DE",
    connectedCountry: "SK",
    status: DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "unemployment-coordination-alg-davka",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: DE_UE_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "DE" as const,
      trustDomain: "de" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: DE_SK_UE_DE_CLAIM_KEYS.map(deRef),
    euClaimRefs: DE_SK_UE_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: DE_SK_UE_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_UE_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "DE_SK_UNEMPLOYMENT_COORDINATION",
      userMustAct: true,
      germanAuthorityMustAct: true,
      foreignAuthorityMustAct: true,
      institutionExchangeExpected: true,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: DE_SK_UE_PROCESSES,
  });
}

export function deSkUnemploymentConnectorSummary(
  pack: CuratedCrossBorderConnectorPack = buildDeSkUnemploymentCoordinationConnectorPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    status: pack.status,
    euRefCount: pack.euClaimRefs.length,
    deRefCount: pack.germanClaimRefs.length,
    skRefCount: pack.foreignClaimRefs.length,
    processCount: pack.corridorProcesses?.length ?? 0,
    completeness: evaluateDeSkUnemploymentProcessCompleteness(),
    article65a: evaluateDeSkUnemploymentArticle65a(),
    selfEmployedHardening: evaluateDeSkUnemploymentSelfEmployedHardening(),
    temporal: evaluateDeSkUnemploymentTemporal(),
    validation: validateCuratedCrossBorderConnectorPack(pack),
  });
}
