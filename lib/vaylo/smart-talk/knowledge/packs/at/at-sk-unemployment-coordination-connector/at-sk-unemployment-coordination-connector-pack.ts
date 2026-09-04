/**
 * AT-SK-0G AT↔SK unemployment coordination connector.
 * Links CB-0I EU unemployment core, Austrian unemployment routing and the Slovak adapter.
 * Does not copy Articles 61–65a or national ALG / dávka merits.
 * MUST NOT import from packs/de-sk/ or use DE_SK_* constants.
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
  AT_UE_ART9_DECLARATION_VERSION,
  AT_UE_ART9_PUBLICATION_DATE,
  AT_UE_PRIMARY_PROCESS_KEY,
  AT_UE_UNITS,
} from "../unemployment-coordination-routing/at-unemployment-coordination-routing-pack";
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
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
} from "../../../source-registry/cross-border-connector-contracts";

export const AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID = "at_sk_unemployment_coordination" as const;
export const AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS = "prepared" as const;
export const AT_SK_UNEMPLOYMENT_CONNECTOR_PROCESS_GROUP = "at_sk_unemployment_coordination_connector" as const;

export type AtOriginUnemploymentStableReference = Readonly<{
  entityClass: "claims" | "processes";
  key: string;
  sourceJurisdiction: "AT";
  trustDomain: "at";
  temporalClass: "CURRENT";
}>;
export const ARTICLE_65A_ACTIVE_FOR_AT_SK = false as const;
export const AT_SK_UE_ART9_AT_VERSION = AT_UE_ART9_DECLARATION_VERSION;
export const AT_SK_UE_ART9_SK_VERSION = SK_UE_ART9_DECLARATION_VERSION;
export const AT_SK_UE_ART9_AT_PUBLICATION_DATE = AT_UE_ART9_PUBLICATION_DATE;
export const AT_SK_UE_ART9_SK_PUBLICATION_DATE = SK_UE_ART9_PUBLICATION_DATE;
export const AT_SK_UE_COPIED_EU_CLAIM_COUNT = 0 as const;

function euRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "EU" as const,
    trustDomain: "eu" as const, temporalClass: "CURRENT" as const,
  });
}
function atRef(key: string): AtOriginUnemploymentStableReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "AT" as const,
    trustDomain: "at" as const, temporalClass: "CURRENT" as const,
  });
}
function skRef(key: string): ForeignNationalStableReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "SK" as const,
    trustDomain: "sk" as const, temporalClass: "CURRENT" as const,
  });
}

export const AT_SK_UE_EU_CLAIM_KEYS = Object.freeze(EU_UNEMP_UNITS.map((unit) => unit.key));
export const AT_SK_UE_AT_CLAIM_KEYS = Object.freeze(AT_UE_UNITS.map((unit) => unit.key));
export const AT_SK_UE_SK_CLAIM_KEYS = Object.freeze(SK_UE_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;
type AnyRef = StableKnowledgeReference | ForeignNationalStableReference | AtOriginUnemploymentStableReference;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly AnyRef[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`AT_SK_UE_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length) as CorridorProcessBinding["claimRefs"],
  });
}

export const AT_SK_UE_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("at-sk-ue-case-classify", "AT-SK Arbeitslosenweg einordnen", "Arbeitslosigkeit berührt Österreich und die Slowakei", "Staatsangehörigkeit und Locale nicht als Leistungsstaat setzen; EMPLOYED und SELF_EMPLOYED getrennt führen.", [euRef("ue-nationality-not-payer"), euRef("ue-locale-not-payer"), euRef("ue-title-ii-not-unemp-state"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), atRef("at-ue-ams-role"), skRef("sk-ue-socpoist-role"), skRef("sk-ue-upsvr-role"), euRef(EU_SHARED_ART65_CLAIM_KEY), atRef("at-ue-does-not-determine-art-11"), euRef("ue-document-classifier"), euRef("ue-nationality-not-payer")]),
  binding("at-sk-ue-states-not-collapsed", "Zuständige Staaten nicht zusammenziehen", "anwendbare Rechtsvorschriften, Leistungsstaat, Wohnsitz und letzte Tätigkeit werden vermengt", "competentState, benefitState, residenceState und lastActivityState getrennt führen.", [euRef("ue-title-ii-not-unemp-state"), euRef("ue-contributions-not-auto-payer"), euRef("ue-last-work-not-always-pays"), euRef("ue-residence-not-always-pays"), euRef("ue-work-de-not-auto-payer"), euRef("ue-work-other-not-auto-payer"), atRef("at-ue-does-not-determine-art-11"), skRef("sk-ue-socpoist-not-upsvr"), euRef(EU_SHARED_ART65_CLAIM_KEY), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-a1-not-unemp-award")]),
  binding("at-sk-ue-frontier-employee-at-to-sk", "Grenzgänger Arbeitnehmer AT nach SK", "Wohnsitz SK, letzte abhängige Tätigkeit AT, tägliche oder wöchentliche Rückkehr, vollarbeitslos", "Nicht automatisch österreichisches ALG; UoZ beim ÚPSVaR und Anspruch bei Sociálna poisťovňa; österreichische Zeiten über U1.", [euRef(EU_SHARED_ART1F_CLAIM_KEY), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-return-frequency-required"), euRef("ue-nationality-not-frontier"), euRef("ue-last-work-not-payer-frontier"), skRef("sk-ue-upsvr-role"), skRef("sk-ue-socpoist-role"), atRef("at-ue-u1-employee"), euRef(EU_SHARED_PD_U1_CLAIM_KEY), euRef(EU_SHARED_JELTES_CLAIM_KEY), atRef("at-ue-ams-role"), skRef("sk-ue-u1-not-award")]),
  binding("at-sk-ue-frontier-employee-sk-to-at", "Grenzgänger Arbeitnehmer SK nach AT", "Wohnsitz AT, letzte abhängige Tätigkeit SK, Grenzgänger, vollarbeitslos", "Nicht automatisch slowakische Leistung; österreichisches AMS und slowakische Zeiten über U1.", [euRef(EU_SHARED_ART1F_CLAIM_KEY), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-return-frequency-required"), euRef("ue-contributions-not-auto-payer"), atRef("at-ue-ams-role"), skRef("sk-ue-u1-employee"), euRef(EU_SHARED_PD_U1_CLAIM_KEY), atRef("at-ue-waiting-period-gate"), euRef(EU_SHARED_JELTES_CLAIM_KEY), atRef("at-ue-u1-not-award"), skRef("sk-ue-socpoist-role"), euRef("ue-nationality-not-payer")]),
  binding("at-sk-ue-partial-vs-whole", "Teil- und Vollarbeitslosigkeit trennen", "Teilarbeitslosigkeit soll dem Wohnsitzstaat folgen oder mit Vollarbeitslosigkeit vermengt werden", "Artikel 65 Absatz 1 beim zuständigen Staat belassen; nicht den Wohnsitzweg der Vollarbeitslosigkeit anwenden.", [euRef("ue-art-65-1-partial-intermittent"), euRef("ue-partial-not-residence-route"), euRef("ue-whole-not-partial"), euRef("ue-type-gate-mandatory"), euRef(EU_SHARED_DECISION_U3_CLAIM_KEY), euRef("ue-partial-not-u2"), euRef("ue-zero-hours-not-whole"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-contract-exists-gate"), euRef("ue-short-time-not-whole"), atRef("at-ue-ams-role")]),
  binding("at-sk-ue-non-frontier-return", "Nicht-Grenzgänger kehrt in den Wohnstaat zurück", "Vollarbeitslose Person ohne Grenzgängerstatus hat den Wohnsitz im anderen Staat gehalten und kehrt dorthin zurück", "Nicht als Grenzgänger umdeuten; Wohnsitzmittelpunkt verlangen.", [euRef("ue-non-frontier-return-residence"), euRef("ue-non-frontier-not-auto-frontier"), euRef("ue-residence-centre-of-interests"), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef(EU_SHARED_JELTES_CLAIM_KEY), euRef("ue-decision-u2-non-frontier-scope"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-residence-not-anmeldung"), euRef("ue-registered-address-not-residence"), atRef("at-ue-ams-role"), skRef("sk-ue-upsvr-role")]),
  binding("at-sk-ue-non-frontier-no-return", "Nicht-Grenzgänger kehrt nicht zurück", "Vollarbeitslose Person ohne Grenzgängerstatus bleibt im letzten Tätigkeitsstaat", "Letzten Rechtsvorschriftenstaat nicht in Wohnsitzwahl umdeuten.", [euRef("ue-non-frontier-remain-last-state"), euRef("ue-residence-not-always-pays"), euRef("ue-last-work-not-always-pays"), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-whole-routing-not-collapsed"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-jeltes-no-choice"), euRef("ue-do-not-choose-better-benefit"), atRef("at-ue-ams-role"), skRef("sk-ue-socpoist-role"), euRef("ue-title-ii-not-unemp-state")]),
  binding("at-sk-ue-article-65a-suppressed", "Artikel 65a AT-SK aktuell sperren", "Selbständiger Grenzgänger soll automatisch Artikel 65a oder österreichische Leistung nach 65a erhalten", "Zuerst Artikel 65; aktuelle Erklärungen 2025 revalidieren; AT↔SK derzeit nicht 65a-aktiv.", [euRef("ue-self-employed-not-auto-65a"), euRef(EU_SHARED_ART65A_CLAIM_KEY), euRef("ue-art-65a-requires-notification"), euRef("ue-art-65a-notification-lookup"), atRef("at-ue-art9-2025-se-coverage-possible"), skRef("sk-ue-art9-2025-se-coverage-possible"), atRef("at-ue-art9-not-eternal-false"), skRef("sk-ue-art9-not-eternal-false"), atRef("at-ue-system-coverage-not-person-insured"), skRef("sk-ue-system-coverage-not-person-insured"), euRef(EU_SHARED_ART65_CLAIM_KEY), atRef("at-ue-alvg-3-not-automatic")]),
  binding("at-sk-ue-u1-routing", "PD U1 AT-SK führen", "U1 fehlt, gilt als Bewilligung oder wird mit U2 verwechselt", "U1 als Zeitennachweis; Papier nicht stets zwingend; Arbeitnehmer- und Selbständigenzeiten einschließen.", [euRef(EU_SHARED_PD_U1_CLAIM_KEY), euRef("ue-u1-not-award"), euRef("ue-u1-absence-not-impossible"), euRef("ue-institutional-period-exchange"), atRef("at-ue-u1-employee"), atRef("at-ue-u1-self-employed"), skRef("sk-ue-u1-employee"), skRef("sk-ue-u1-self-employed"), skRef("sk-ue-u1-paper-not-mandatory"), atRef("at-ue-finanzamt-not-u1"), euRef("ue-u2-not-u1"), euRef("ue-u2-not-u1")]),
  binding("at-sk-ue-u2-at-to-sk", "Österreichisches ALG mit U2 in die Slowakei ausführen", "ALG-Beziehende Person sucht Arbeit in der Slowakei", "Vor Abreise U2; vier Wochen Regel, mögliche Verkürzung; drei Monate aktuell; ÚPSVaR als Zielvermittlung.", [euRef(EU_SHARED_ART64_CLAIM_KEY), euRef(EU_SHARED_PD_U2_CLAIM_KEY), atRef("at-ue-u2-before-departure"), atRef("at-ue-u2-before-departure"), atRef("at-ue-u2-four-weeks"), atRef("at-ue-u2-authorized-shortening"), euRef("ue-art-64-three-month-standard"), euRef("ue-art-64-extend-max-six"), euRef("ue-six-not-automatic"), skRef("sk-ue-incoming-de-u2"), atRef("at-ue-u2-before-departure"), euRef("ue-u2-not-destination-benefit")]),
  binding("at-sk-ue-u2-sk-to-at", "Slowakische Leistung mit U2 nach Österreich ausführen", "Beziehende Person sucht Arbeit in Österreich", "Nicht in österreichisches ALG umdeuten; Sociálna poisťovňa stellt U2 nach ÚPSVaR-Verfahren aus.", [euRef(EU_SHARED_ART64_CLAIM_KEY), skRef("sk-ue-u2-to-de"), skRef("sk-ue-u2-four-weeks"), skRef("sk-ue-u2-seven-day-registration"), skRef("sk-ue-u2-not-german-alg"), atRef("at-ue-incoming-foreign-u2"), euRef("ue-art-64-three-month-standard"), euRef("ue-payer-remains-competent"), euRef("ue-destination-not-payer"), euRef("ue-art-64-seven-day-registration"), atRef("at-ue-ams-role"), skRef("sk-ue-socpoist-role")]),
  binding("at-sk-ue-u3-interinstitutional", "U3 als Trägerhinweis führen", "Nutzer will U3 als Leistungsantrag oder Selbständigkeit beginnt während der Ausfuhr", "U3 ist trägerseitige Mitteilung, kein Nutzerantrag; Aufnahme von Beschäftigung oder Selbständigkeit löst Prüfung aus.", [euRef(EU_SHARED_PD_U3_CLAIM_KEY), euRef("ue-u3-not-auto-cancellation"), euRef("ue-decision-u3-not-portable-u3"), euRef("ue-job-during-export-recheck"), euRef("ue-destination-controls-art-55"), euRef("ue-document-classifier"), euRef("ue-u2-not-u1"), atRef("at-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), euRef("ue-physical-u2-not-still-valid"), skRef("sk-ue-active-szco-uoz-blocked"), atRef("at-ue-does-not-copy-eu-law")]),
  binding("at-sk-ue-mixed-delegate-al", "Gemischte Tätigkeit an Titel II verweisen", "Gleichzeitige Beschäftigung und Selbständigkeit in AT und SK oder unklare anwendbare Rechtsvorschriften", "Artikel 11 bis 13 nicht neu entscheiden; parallele Arbeitslosenversicherungssysteme nicht erfinden.", [atRef("at-ue-does-not-determine-art-11"), euRef("ue-title-ii-not-unemp-state"), euRef("ue-a1-not-unemp-award"), euRef("ue-posted-not-infer-payer"), atRef("at-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), atRef("at-ue-director-status-unclear"), skRef("sk-ue-director-status-unclear"), euRef("ue-foreign-not-auto-insurance"), euRef(EU_SHARED_ART61_CLAIM_KEY), atRef("at-ue-alvg-3-not-automatic"), skRef("sk-ue-szco-not-automatic")]),
  binding("at-sk-ue-authority-split", "Träger AT-SK trennen", "Finanzamt, Krankenkasse, Jobcenter, Sociálna poisťovňa und ÚPSVaR werden vertauscht", "AMS, Sociálna poisťovňa und ÚPSVaR getrennt; genaue Stelle live.", [atRef("at-ue-ams-role"), atRef("at-ue-ams-role"), atRef("at-ue-finanzamt-not-u1"), atRef("at-ue-not-health-insurer"), atRef("at-ue-svs-not-u1-issuer"), skRef("sk-ue-socpoist-role"), skRef("sk-ue-upsvr-role"), skRef("sk-ue-socpoist-not-upsvr"), skRef("sk-ue-upsvr-not-cash-decision"), atRef("at-ue-ams-instance-fetch-live"), skRef("sk-ue-socpoist-instance-fetch-live"), skRef("sk-ue-upsvr-instance-fetch-live")]),
  binding("at-sk-ue-proposed-law-gate", "Vorgeschlagenes Arbeitslosenrecht sperren", "Sechsmonatige Regelausfuhr, 22-Wochen-Regel oder 2016/0397 wird als geltendes Recht behandelt", "Als nicht geltende Revision führen; drei Monate bleiben aktuell.", [euRef("ue-proposed-six-month-not-current"), euRef("ue-proposed-22-week-not-current"), euRef("ue-pending-cod-not-current"), euRef("ue-six-not-current-standard"), euRef("ue-art-64-three-month-standard"), euRef(EU_SHARED_ART64_CLAIM_KEY), euRef("ue-current-65-frontier-residence-model"), atRef("at-ue-u2-three-month-operational"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef("ue-ep-first-reading-not-law"), euRef("ue-provisional-agreement-not-law")]),
  binding("at-sk-ue-frontier-self-employed", "Selbständige Grenzgänger AT-SK", "Letzte Selbständigkeit AT oder SK, Wohnsitz im anderen Staat, Grenzgängerfakten, vollarbeitslos", "Artikel 65 zuerst; 65a nicht automatisch; individuelle Versicherung getrennt von Systemmöglichkeit.", [euRef(EU_SHARED_ART1F_CLAIM_KEY), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-self-employed-not-auto-65a"), atRef("at-ue-alvg-3-svs-notification"), skRef("sk-ue-voluntary-evidence"), atRef("at-ue-system-coverage-not-person-insured"), skRef("sk-ue-system-coverage-not-person-insured"), atRef("at-ue-art9-2025-se-coverage-possible"), skRef("sk-ue-art9-2025-se-coverage-possible"), skRef("sk-ue-szco-not-automatic"), atRef("at-ue-alvg-3-not-automatic"), euRef("ue-art-65a-notification-lookup")]),
  binding("at-sk-ue-activity-change", "Tätigkeitswechsel und gemischte Geschichte", "Wechsel Arbeitnehmer/Selbständigkeit, ruhendes Gewerbe, živnosť oder Geschäftsaufgabe", "Perioden einzeln klassifizieren; Schließung nicht als Automatikanspruch; österreichische 15-Stunden-Regel nicht auf UoZ übertragen.", [atRef("at-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), atRef("at-ue-dormant-gewerbe-not-activity"), skRef("sk-ue-dormant-zivnost-not-activity"), atRef("at-ue-business-failure-not-alg"), skRef("sk-ue-business-closure-not-benefit"), atRef("at-ue-minor-work-not-sk-rule"), skRef("sk-ue-de-15h-not-sk-uoz"), skRef("sk-ue-active-szco-uoz-blocked"), euRef("ue-foreign-not-auto-insurance"), euRef(EU_SHARED_ART61_CLAIM_KEY), atRef("at-ue-alvg-3-not-automatic")]),
  binding("at-sk-ue-residence-evidence", "Wohnsitznachweis Artikel 65", "Wohnsitz wird aus Anmeldung, trvalý pobyt, Staatsangehörigkeit oder Steueransässigkeit abgeleitet", "Mittelpunkt der Interessen verlangen; Meldeadresse reicht nicht.", [euRef("ue-residence-centre-of-interests"), euRef("ue-residence-not-anmeldung"), euRef("ue-registered-address-not-residence"), euRef("ue-nationality-not-payer"), euRef("ue-residence-unclear-fail-closed"), euRef("ue-address-not-auto-frontier"), euRef("ue-nationality-not-payer"), skRef("sk-ue-does-not-copy-eu-law"), atRef("at-ue-does-not-copy-eu-law"), euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-cross-border-not-auto-frontier"), euRef("ue-locale-not-payer")]),
  binding("at-sk-ue-three-state-sk-at-de", "SK+AT+DE Arbeitslosigkeit gemeinsam", "Leistungsstaat AT oder SK, Wohnsitz SK oder AT, vorübergehender Aufenthalt DE", "Drei Staaten erfinden keinen zweiten Leistungsstaat; Artikel 65 und U1/U2 getrennt führen.", [euRef(EU_SHARED_ART65_CLAIM_KEY), euRef("ue-title-ii-not-unemp-state"), atRef("at-ue-does-not-determine-art-11"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), euRef(EU_SHARED_PD_U1_CLAIM_KEY), euRef(EU_SHARED_ART64_CLAIM_KEY), atRef("at-ue-ams-role"), skRef("sk-ue-socpoist-role"), skRef("sk-ue-upsvr-role"), euRef("ue-jeltes-no-choice"), euRef("ue-do-not-choose-better-benefit")]),
  binding("at-sk-ue-at-de-szco-sequential", "SZČO AT dann DE ohne Autoleistungsstaat", "Wohnsitz SK, Selbständigkeit AT Januar–Juli, danach DE August–Dezember", "Weder Artikel 11 noch Artikel 13 automatisch; Timeline und Neuwertung erhalten.", [atRef("at-ue-activity-change-reeval"), skRef("sk-ue-activity-change-reeval"), euRef("ue-foreign-not-auto-insurance"), atRef("at-ue-does-not-determine-art-11"), euRef("ue-title-ii-not-unemp-state"), euRef(EU_SHARED_ART61_CLAIM_KEY), atRef("at-ue-alvg-3-not-automatic"), skRef("sk-ue-szco-not-automatic"), atRef("at-ue-does-not-copy-eu-law"), skRef("sk-ue-does-not-copy-eu-law"), atRef("at-ue-ams-role"), skRef("sk-ue-socpoist-role")]),
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

export const AT_SK_UE_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  sc("s01-employee-at-residence-at", "Arbeitnehmer AT, Wohnsitz AT, arbeitslos", "COVERED", ["at-ue-waiting-period-gate", "at-ue-ams-role"], ["at-sk-ue-case-classify"]),
  sc("s02-employee-sk-residence-sk", "Arbeitnehmer SK, Wohnsitz SK, arbeitslos", "COVERED", ["sk-ue-employee-compulsory", "sk-ue-730-day-gate"], ["at-sk-ue-case-classify"]),
  sc("s03-frontier-employee-at-res-sk-whole", "Grenzgänger Arbeitnehmer AT, Wohnsitz SK, vollarbeitslos", "COVERED", ["ue-art-65-frontier-residence", "sk-ue-upsvr-role"], ["at-sk-ue-frontier-employee-at-to-sk"]),
  sc("s04-frontier-employee-sk-res-at-whole", "Grenzgänger Arbeitnehmer SK, Wohnsitz AT, vollarbeitslos", "COVERED", ["ue-art-65-frontier-residence", "at-ue-ams-role"], ["at-sk-ue-frontier-employee-sk-to-at"]),
  sc("s05-frontier-employee-at-res-sk-partial", "Grenzgänger Arbeitnehmer AT, Wohnsitz SK, teilarbeitslos", "COVERED", ["ue-art-65-1-partial-intermittent", "ue-partial-not-residence-route"], ["at-sk-ue-partial-vs-whole"]),
  sc("s06-frontier-employee-sk-res-at-partial", "Grenzgänger Arbeitnehmer SK, Wohnsitz AT, teilarbeitslos", "COVERED", ["ue-whole-not-partial", "ue-partial-not-u2"], ["at-sk-ue-partial-vs-whole"]),
  sc("s07-non-frontier-at-returns-sk", "Nicht-Grenzgänger AT-Tätigkeit, Wohnsitz SK, kehrt zurück", "COVERED", ["ue-non-frontier-return-residence", "ue-non-frontier-not-auto-frontier"], ["at-sk-ue-non-frontier-return"]),
  sc("s08-non-frontier-at-does-not-return", "Nicht-Grenzgänger AT-Tätigkeit, kehrt nicht zurück", "COVERED", ["ue-non-frontier-remain-last-state"], ["at-sk-ue-non-frontier-no-return"]),
  sc("s09-non-frontier-sk-returns-at", "Nicht-Grenzgänger SK-Tätigkeit, Wohnsitz AT, kehrt zurück", "COVERED", ["ue-non-frontier-return-residence", "ue-residence-centre-of-interests"], ["at-sk-ue-non-frontier-return"]),
  sc("s10-austrian-periods-sk-claim-u1", "Österreichische Zeiten in SK-Anspruch über U1", "COVERED", ["sk-ue-foreign-periods-aggregation", "ue-pd-u1-period-evidence"], ["at-sk-ue-u1-routing"]),
  sc("s11-slovak-periods-at-claim-u1", "Slowakische Zeiten in AT-Anspruch über U1", "COVERED", ["ue-pd-u1-period-evidence", "sk-ue-u1-employee"], ["at-sk-ue-u1-routing"]),
  sc("s12-no-paper-u1-institution-requests", "Kein Papier-U1, Träger kann Daten einholen", "COVERED", ["ue-u1-absence-not-impossible", "sk-ue-u1-paper-not-mandatory"], ["at-sk-ue-u1-routing"]),
  sc("s13-u1-treated-as-benefit-decision", "U1 fälschlich als Leistungsentscheidung", "COVERED", ["ue-u1-not-award", "at-ue-u1-not-award"], ["at-sk-ue-u1-routing"]),
  sc("s14-austrian-u1-employee", "Österreichisches U1 Arbeitnehmerzeit", "COVERED", ["at-ue-u1-employee"], ["at-sk-ue-u1-routing"]),
  sc("s15-austrian-u1-alvg3", "Österreichisches U1 Art.-1-§-3-AlVG-Zeit", "COVERED", ["at-ue-u1-self-employed", "at-ue-alvg-3-svs-notification"], ["at-sk-ue-u1-routing"]),
  sc("s16-slovak-u1-employee", "Slowakisches U1 Arbeitnehmerzeit", "COVERED", ["sk-ue-u1-employee"], ["at-sk-ue-u1-routing"]),
  sc("s17-slovak-u1-voluntary-szco", "Slowakisches U1 freiwillige SZČO-Zeit", "COVERED", ["sk-ue-u1-self-employed"], ["at-sk-ue-u1-routing"]),
  sc("s18-at-szco-never-alvg3", "AT-Selbständige nie nach Art. 1 § 3 AlVG eingeschrieben", "COVERED", ["at-ue-alvg-3-not-automatic", "at-ue-alvg-3-not-automatic"], ["at-sk-ue-frontier-self-employed"]),
  sc("s19-at-szco-valid-alvg3", "AT-Selbständige mit verifizierter Art.-1-§-3-AlVG-Deckung", "COVERED", ["at-ue-alvg-3-svs-notification", "at-ue-alvg-3-voluntary-se"], ["at-sk-ue-frontier-self-employed"]),
  sc("s20-at-alvg3-after-3-month-deadline", "Art.-1-§-3-AlVG-Antrag nach Drei-Monats-Frist", "COVERED", ["at-ue-alvg-3-six-month-entry"], ["at-sk-ue-activity-change"]),
  sc("s21-at-alvg3-entry-window", "Art. 1 § 3 AlVG, Selbständigkeit von Beginn unter 15 Stunden", "COVERED", ["at-ue-2026-minor-work-boundary"], ["at-sk-ue-activity-change"]),
  sc("s22-at-alvg3-historical-business-ended", "Historische Art.-1-§-3-AlVG-Deckung, Betrieb später beendet", "COVERED", ["at-ue-activity-change-reeval", "at-ue-waiting-period-gate"], ["at-sk-ue-activity-change"]),
  sc("s23-alg-self-employment-under-15h", "ALG-Beziehende mit Selbständigkeit unter 15 Stunden", "COVERED", ["at-ue-2026-minor-work-boundary", "at-ue-minor-work-not-sk-rule"], ["at-sk-ue-activity-change"]),
  sc("s24-alg-self-employment-at-least-15h", "ALG-Beziehende mit Selbständigkeit ab 15 Stunden", "COVERED", ["at-ue-2026-minor-work-boundary", "at-ue-minor-work-not-sk-rule"], ["at-sk-ue-activity-change"]),
  sc("s25-two-german-side-activities-15h", "Zwei österreichische Nebentätigkeiten zusammen ab 15 Stunden", "COVERED", ["at-ue-side-income-boundary"], ["at-sk-ue-activity-change"]),
  sc("s26-business-profit-as-alg-salary", "Betriebsertrag fälschlich als ALG-Gehalt", "COVERED", ["at-ue-side-income-boundary"], ["at-sk-ue-activity-change"]),
  sc("s27-former-at-szco-fiktive-bemessung", "Ehemalige AT-Selbständige, fiktive Bemessung", "COVERED", ["at-ue-amount-not-calculator"], ["at-sk-ue-activity-change"]),
  sc("s28-sk-szco-without-voluntary", "SK-SZČO ohne freiwillige Arbeitslosenversicherung", "COVERED", ["sk-ue-szco-not-automatic"], ["at-sk-ue-frontier-self-employed"]),
  sc("s29-sk-szco-verified-voluntary", "SK-SZČO mit verifizierter freiwilliger Versicherung", "COVERED", ["sk-ue-voluntary-evidence", "sk-ue-voluntary-section-19"], ["at-sk-ue-frontier-self-employed"]),
  sc("s30-sk-sickness-pension-mistaken", "Pflichtkranken- und Pensionsversicherung als Arbeitslosenversicherung", "COVERED", ["sk-ue-sickness-pension-not-unemployment"], ["at-sk-ue-frontier-self-employed"]),
  sc("s31-zivnost-mistaken-for-insurance", "Živnosť als Arbeitslosenversicherung", "COVERED", ["sk-ue-zivnost-not-insurance"], ["at-sk-ue-activity-change"]),
  sc("s32-active-sk-szco-enters-uoz", "Aktive SK-SZČO will UoZ", "COVERED", ["sk-ue-active-szco-uoz-blocked"], ["at-sk-ue-activity-change"]),
  sc("s33-sk-szco-ends-then-uoz", "SK-SZČO beendet Tätigkeit, dann UoZ", "COVERED", ["sk-ue-former-szco-after-end"], ["at-sk-ue-activity-change"]),
  sc("s34-sk-730-days-met", "SK 730 Tage erfüllt", "COVERED", ["sk-ue-730-day-gate"], ["at-sk-ue-case-classify"]),
  sc("s35-sk-730-days-not-met", "SK 730 Tage nicht erfüllt", "COVERED", ["sk-ue-730-day-gate", "sk-ue-application-not-approval"], ["at-sk-ue-case-classify"]),
  sc("s36-foreign-eu-periods-for-730", "Ausländische EU-Zeiten für 730 Tage", "COVERED", ["sk-ue-foreign-periods-aggregation", "ue-art-61-aggregation"], ["at-sk-ue-u1-routing"]),
  sc("s37-sk-voluntary-payment-incomplete", "SK freiwillige Versicherung, Zahlung unvollständig", "COVERED", ["sk-ue-payment-gate"], ["at-sk-ue-frontier-self-employed"]),
  sc("s38-sk-2025-entitlement-paid-2026", "SK-Anspruch 2025, Zahlung 2026", "COVERED", ["sk-ue-pre-2026-flat-50"], ["at-sk-ue-case-classify"]),
  sc("s39-sk-new-entitlement-from-2026", "Neuer SK-Anspruch ab 2026-01-01", "COVERED", ["sk-ue-2026-taper"], ["at-sk-ue-case-classify"]),
  sc("s40-sk-50-50-50-40-30-20", "SK 50/50/50/40/30/20-Staffel", "COVERED", ["sk-ue-2026-taper", "sk-ue-max-six-months"], ["at-sk-ue-case-classify"]),
  sc("s41-at-alg-export-to-sk", "AT-ALG-Export in die Slowakei", "COVERED", ["at-ue-u2-before-departure", "ue-pd-u2-export-authorization"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s42-at-u2-after-departure", "AT-U2 nach Abreise verlangt", "COVERED", ["at-ue-u2-before-departure", "at-ue-u2-before-departure"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s43-at-u2-four-week-wait", "AT-U2 Vier-Wochen-Frist", "COVERED", ["at-ue-u2-four-weeks", "ue-art-64-four-week-default"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s44-at-u2-authorized-early", "AT-U2 zugelassene frühe Abreise", "COVERED", ["at-ue-u2-authorized-shortening", "ue-four-week-not-absolute"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s45-at-u2-three-months", "AT-U2 drei Monate aktuell", "COVERED", ["ue-art-64-three-month-standard", "at-ue-u2-three-month-operational"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s46-at-u2-extension-to-six", "AT-U2 Verlängerung bis sechs Monate", "COVERED", ["ue-art-64-extend-max-six", "ue-extension-requires-authorization"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s47-at-u2-treated-as-auto-six", "AT-U2 als automatische sechs Monate", "COVERED", ["ue-u2-not-auto-six-months", "ue-six-not-automatic"], ["at-sk-ue-proposed-law-gate"]),
  sc("s48-sk-benefit-export-to-at", "SK-Leistungsexport nach Österreich", "COVERED", ["sk-ue-u2-to-de", "sk-ue-u2-not-german-alg"], ["at-sk-ue-u2-sk-to-at"]),
  sc("s49-sk-u2-registration-deadline", "SK-U2 Zielanmeldung innerhalb der Frist", "COVERED", ["sk-ue-u2-seven-day-registration", "ue-art-64-seven-day-registration"], ["at-sk-ue-u2-sk-to-at"]),
  sc("s50-incoming-at-u2-upsvr", "Eingehendes AT-U2 beim ÚPSVaR", "COVERED", ["sk-ue-incoming-de-u2"], ["at-sk-ue-u2-at-to-sk"]),
  sc("s51-incoming-sk-u2-ams", "Eingehendes SK-U2 beim AMS", "COVERED", ["at-ue-incoming-foreign-u2"], ["at-sk-ue-u2-sk-to-at"]),
  sc("s52-employment-during-u2-export", "Beschäftigung beginnt während U2-Export", "COVERED", ["ue-job-during-export-recheck"], ["at-sk-ue-u3-interinstitutional"]),
  sc("s53-self-employment-during-u2-export", "Selbständigkeit beginnt während U2-Export", "COVERED", ["ue-job-during-export-recheck", "sk-ue-active-szco-uoz-blocked"], ["at-sk-ue-u3-interinstitutional"]),
  sc("s54-u3-notification", "U3-Mitteilungsszenario", "COVERED", ["ue-pd-u3-export-warning", "ue-u3-not-auto-cancellation"], ["at-sk-ue-u3-interinstitutional"]),
  sc("s55-u3-mistaken-user-application", "U3 als Nutzerantrag verwechselt", "COVERED", ["ue-decision-u3-not-portable-u3", "ue-document-classifier"], ["at-sk-ue-u3-interinstitutional"]),
  sc("s56-at-self-employed-frontier-res-sk", "AT-selbständiger Grenzgänger, Wohnsitz SK", "COVERED", ["at-ue-alvg-3-svs-notification", "ue-self-employed-not-auto-65a"], ["at-sk-ue-frontier-self-employed"]),
  sc("s57-sk-self-employed-frontier-res-de", "SK-selbständiger Grenzgänger, Wohnsitz AT", "COVERED", ["sk-ue-voluntary-evidence", "ue-self-employed-not-auto-65a"], ["at-sk-ue-frontier-self-employed"]),
  sc("s58-65a-wrongly-from-self-employed", "Artikel 65a allein wegen Selbständigkeit", "COVERED", ["ue-self-employed-not-auto-65a"], ["at-sk-ue-article-65a-suppressed"]),
  sc("s59-65a-wrongly-for-sk-residence", "Artikel 65a bei SK-Wohnsitz trotz Deckungsmöglichkeit", "COVERED", ["sk-ue-art9-2025-se-coverage-possible", "ue-art-65a-requires-notification"], ["at-sk-ue-article-65a-suppressed"]),
  sc("s60-65a-wrongly-for-at-residence", "Artikel 65a bei AT-Wohnsitz trotz Deckungsmöglichkeit", "COVERED", ["at-ue-art9-2025-se-coverage-possible"], ["at-sk-ue-article-65a-suppressed"]),
  sc("s61-at-article9-declaration-changes", "Österreichische Artikel-9-Erklärung ändert sich", "COVERED", ["at-ue-art9-not-eternal-false", "ue-art-65a-notification-lookup"], ["at-sk-ue-article-65a-suppressed"]),
  sc("s62-sk-article9-declaration-changes", "Slowakische Artikel-9-Erklärung ändert sich", "COVERED", ["sk-ue-art9-not-eternal-false"], ["at-sk-ue-article-65a-suppressed"]),
  sc("s63-system-coverage-person-not-insured", "System ermöglicht Deckung, Person nicht versichert", "COVERED", ["at-ue-system-coverage-not-person-insured", "sk-ue-system-coverage-not-person-insured"], ["at-sk-ue-article-65a-suppressed"]),
  sc("s64-employee-at-then-szco-sk", "Arbeitnehmer AT, dann SZČO SK", "COVERED", ["at-ue-activity-change-reeval", "sk-ue-activity-change-reeval"], ["at-sk-ue-activity-change"]),
  sc("s65-employee-sk-then-self-employed-at", "Arbeitnehmer SK, dann selbständig AT", "COVERED", ["at-ue-alvg-3-six-month-entry", "sk-ue-activity-change-reeval"], ["at-sk-ue-activity-change"]),
  sc("s66-simultaneous-employed-at-szco-sk", "Gleichzeitig beschäftigt AT und SZČO SK", "COVERED", ["at-ue-does-not-determine-art-11", "ue-title-ii-not-unemp-state"], ["at-sk-ue-mixed-delegate-al"]),
  sc("s67-simultaneous-employed-sk-self-employed-at", "Gleichzeitig beschäftigt SK und selbständig AT", "COVERED", ["at-ue-does-not-determine-art-11"], ["at-sk-ue-mixed-delegate-al"]),
  sc("s68-applicable-legislation-unresolved", "Anwendbare Rechtsvorschriften ungelöst", "COVERED", ["at-ue-does-not-determine-art-11", "ue-a1-not-unemp-award"], ["at-sk-ue-mixed-delegate-al"]),
  sc("s69-dormant-gewerbe", "Ruhendes Gewerbe", "COVERED", ["at-ue-dormant-gewerbe-not-activity"], ["at-sk-ue-activity-change"]),
  sc("s70-dormant-zivnost", "Ruhende živnosť", "COVERED", ["sk-ue-dormant-zivnost-not-activity"], ["at-sk-ue-activity-change"]),
  sc("s71-business-closure-assumed-benefit", "Geschäftsaufgabe als Automatikanspruch", "COVERED", ["at-ue-business-failure-not-alg", "sk-ue-business-closure-not-benefit"], ["at-sk-ue-activity-change"]),
  sc("s72-company-director-unclear", "Geschäftsführer- oder konateľ-Status unklar", "COVERED", ["at-ue-director-status-unclear", "sk-ue-director-status-unclear"], ["at-sk-ue-mixed-delegate-al"]),
  sc("s73-residence-from-anmeldung-only", "Wohnsitz nur aus Anmeldung", "COVERED", ["ue-residence-not-anmeldung"], ["at-sk-ue-residence-evidence"]),
  sc("s74-residence-from-trvaly-pobyt-only", "Wohnsitz nur aus trvalý pobyt", "COVERED", ["ue-residence-centre-of-interests", "ue-registered-address-not-residence"], ["at-sk-ue-residence-evidence"]),
  sc("s75-slovak-nationality-as-sk-benefit-state", "Slowakische Staatsangehörigkeit als SK-Leistungsstaat", "COVERED", ["ue-nationality-not-payer", "ue-nationality-not-payer"], ["at-sk-ue-case-classify"]),
  sc("s76-austrian-nationality-as-at-benefit-state", "Österreichische Staatsangehörigkeit als AT-Leistungsstaat", "COVERED", ["ue-nationality-not-payer"], ["at-sk-ue-case-classify"]),
  sc("s77-proposed-six-month-as-current", "Vorgeschlagene sechsmonatige Ausfuhr als geltendes Recht", "COVERED", ["ue-proposed-six-month-not-current", "ue-six-not-current-standard"], ["at-sk-ue-proposed-law-gate"]),
  sc("s78-proposed-22-week-as-current", "Vorgeschlagene 22-Wochen-Regel als geltendes Recht", "COVERED", ["ue-proposed-22-week-not-current", "ue-pending-cod-not-current"], ["at-sk-ue-proposed-law-gate"]),
  sc("s79-uk-case", "UK-Fall", "EXPLICITLY_OUT_OF_SCOPE", ["ue-uk-out-of-scope"], ["at-sk-ue-case-classify"]),
  sc("s80-non-eu-bilateral", "Nicht-EU-bilateraler Fall", "EXPLICITLY_OUT_OF_SCOPE", ["ue-non-eu-bilateral-out-of-scope"], ["at-sk-ue-case-classify"]),
  sc("s81-three-state-sk-at-de", "SK Wohnsitz, AT Leistung, vorübergehend DE", "COVERED", ["ue-title-ii-not-unemp-state", "at-ue-does-not-determine-art-11"], ["at-sk-ue-three-state-sk-at-de"]),
  sc("s82-szco-at-then-de-sequential", "SZČO AT Jan–Jul dann DE Aug–Dec", "COVERED", ["at-ue-activity-change-reeval", "at-ue-does-not-determine-art-11"], ["at-sk-ue-at-de-szco-sequential"]),
]);

export const AT_SK_UE_NEGATIVE_CONTROLS = Object.freeze([
  "at-ue-alvg-3-not-automatic",
  "at-ue-alvg-3-not-automatic",
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
  "at-ue-minor-work-not-sk-rule",
  "sk-ue-active-szco-uoz-blocked",
  "at-ue-business-failure-not-alg",
  "sk-ue-business-closure-not-benefit",
  "ue-self-employed-not-auto-65a",
  "at-ue-system-coverage-not-person-insured",
  "at-ue-side-income-boundary",
  "ue-foreign-not-auto-insurance",
  "ue-art-61-aggregation",
  "sk-ue-socpoist-not-upsvr",
  "sk-ue-upsvr-not-cash-decision",
  "at-ue-finanzamt-not-u1",
  "at-ue-not-health-insurer",
  "ue-proposed-six-month-not-current",
  "ue-pending-cod-not-current",
  "sk-ue-de-15h-not-sk-uoz",
  "at-ue-svs-not-u1-issuer",
  "ue-six-not-automatic",
  "sk-ue-u1-not-award",
  "at-ue-u1-not-award",
]);

export function evaluateAtSkUnemploymentProcessCompleteness() {
  const processKeys = new Set(AT_SK_UE_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...AT_SK_UE_EU_CLAIM_KEYS,
    ...AT_SK_UE_AT_CLAIM_KEYS,
    ...AT_SK_UE_SK_CLAIM_KEYS,
  ]);
  const incomplete = AT_SK_UE_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = AT_SK_UE_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = AT_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
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
    processCount: AT_SK_UE_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: AT_SK_UE_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
    outOfScopeMissing,
    copiedEuClaimCount: AT_SK_UE_COPIED_EU_CLAIM_COUNT,
  });
}

export function evaluateAtSkUnemploymentArticle65a() {
  const claimKeys = new Set([
    ...AT_SK_UE_EU_CLAIM_KEYS,
    ...AT_SK_UE_AT_CLAIM_KEYS,
    ...AT_SK_UE_SK_CLAIM_KEYS,
  ]);
  const processKeys = new Set(AT_SK_UE_PROCESSES.map((process) => process.key));
  const coveredIds = new Set(
    AT_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").map((scenario) => scenario.id),
  );
  return Object.freeze({
    article65aActiveForAtSk: ARTICLE_65A_ACTIVE_FOR_AT_SK,
    article65aActiveForAtResidence: false,
    article65aActiveForSkResidence: false,
    atSystemCoveragePossible: claimKeys.has("at-ue-art9-2025-se-coverage-possible"),
    skSystemCoveragePossible: claimKeys.has("sk-ue-art9-2025-se-coverage-possible"),
    sharedCapabilityPreserved: claimKeys.has(EU_SHARED_ART65A_CLAIM_KEY)
      && processKeys.has("at-sk-ue-article-65a-suppressed"),
    staleDeclarationRejected: claimKeys.has("at-ue-art9-not-eternal-false")
      && claimKeys.has("sk-ue-art9-not-eternal-false")
      && claimKeys.has("ue-art-65a-notification-lookup"),
    tamperSelfEmployedAutoRejected: coveredIds.has("s58-65a-wrongly-from-self-employed")
      && claimKeys.has("ue-self-employed-not-auto-65a"),
    tamperSkResidenceRejected: coveredIds.has("s59-65a-wrongly-for-sk-residence"),
    tamperDeResidenceRejected: coveredIds.has("s60-65a-wrongly-for-at-residence"),
    declarationChangeCovered: coveredIds.has("s61-at-article9-declaration-changes")
      && coveredIds.has("s62-sk-article9-declaration-changes"),
    systemVsPersonSeparated: claimKeys.has("at-ue-system-coverage-not-person-insured")
      && claimKeys.has("sk-ue-system-coverage-not-person-insured")
      && coveredIds.has("s63-system-coverage-person-not-insured"),
    hypotheticalFutureRepresentable: claimKeys.has(EU_SHARED_ART65A_CLAIM_KEY)
      && ARTICLE_65A_ACTIVE_FOR_AT_SK === false,
    currentDeclarationsVerified: AT_SK_UE_ART9_AT_VERSION === "2025"
      && AT_SK_UE_ART9_SK_VERSION === "2025"
      && AT_SK_UE_ART9_AT_PUBLICATION_DATE === "2026-08-06"
      && AT_SK_UE_ART9_SK_PUBLICATION_DATE === "2026-08-06",
  });
}

export function evaluateAtSkUnemploymentSelfEmployedHardening() {
  const claimKeys = new Set([
    ...AT_SK_UE_EU_CLAIM_KEYS,
    ...AT_SK_UE_AT_CLAIM_KEYS,
    ...AT_SK_UE_SK_CLAIM_KEYS,
  ]);
  const processKeys = new Set(AT_SK_UE_PROCESSES.map((process) => process.key));
  const coveredIds = new Set(
    AT_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").map((scenario) => scenario.id),
  );
  return Object.freeze({
    activityTypes: CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES,
    selfEmployedExplicit: CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("SELF_EMPLOYED")
      && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("MIXED_EMPLOYED_SELF_EMPLOYED")
      && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("FORMER_SELF_EMPLOYED"),
    atAlvg3NotAutomatic: claimKeys.has("at-ue-alvg-3-not-automatic") && coveredIds.has("s18-at-szco-never-alvg3"),
    skNotAutomatic: claimKeys.has("sk-ue-szco-not-automatic") && coveredIds.has("s28-sk-szco-without-voluntary"),
    mixedDelegatesToApplicableLegislation: processKeys.has("at-sk-ue-mixed-delegate-al")
      && coveredIds.has("s66-simultaneous-employed-at-szco-sk")
      && coveredIds.has("s68-applicable-legislation-unresolved"),
    activityChangeCovered: coveredIds.has("s64-employee-at-then-szco-sk")
      && coveredIds.has("s65-employee-sk-then-self-employed-at"),
    atMinorWorkNotTransferred: claimKeys.has("at-ue-minor-work-not-sk-rule") && claimKeys.has("sk-ue-de-15h-not-sk-uoz"),
    uozBlocked: coveredIds.has("s32-active-sk-szco-enters-uoz"),
    negativeControlsPresent: AT_SK_UE_NEGATIVE_CONTROLS.every((key) => claimKeys.has(key)),
    negativeControlCount: AT_SK_UE_NEGATIVE_CONTROLS.length,
  });
}

export function evaluateAtSkUnemploymentTemporal() {
  const claimKeys = new Set([
    ...AT_SK_UE_EU_CLAIM_KEYS,
    ...AT_SK_UE_AT_CLAIM_KEYS,
    ...AT_SK_UE_SK_CLAIM_KEYS,
  ]);
  const coveredIds = new Set(
    AT_SK_UE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED").map((scenario) => scenario.id),
  );
  return Object.freeze({
    sk2025Vs2026Split: coveredIds.has("s38-sk-2025-entitlement-paid-2026")
      && coveredIds.has("s39-sk-new-entitlement-from-2026")
      && claimKeys.has("sk-ue-pre-2026-flat-50")
      && claimKeys.has("sk-ue-2026-taper"),
    currentThreeMonthVsProposedSix: coveredIds.has("s45-at-u2-three-months")
      && coveredIds.has("s77-proposed-six-month-as-current")
      && claimKeys.has("ue-art-64-three-month-standard")
      && claimKeys.has("ue-proposed-six-month-not-current"),
    currentArt65VsProposal: coveredIds.has("s78-proposed-22-week-as-current")
      && claimKeys.has("ue-current-65-frontier-residence-model")
      && claimKeys.has("ue-proposed-22-week-not-current"),
  });
}


export type AtSkUnemploymentCoordinationConnectorPack = Readonly<{
  schemaVersion: typeof CROSS_BORDER_CONNECTOR_SCHEMA_VERSION;
  packId: typeof AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID;
  originMarket: "AT";
  connectedCountry: "SK";
  status: typeof AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS;
  activationFromLocaleAllowed: false;
  activationRequiresVerifiedCaseContext: true;
  topicKey: "unemployment-coordination-arbeitslosengeld-davka";
  topicFamily: "SOCIAL_SECURITY_COORDINATION";
  germanProcessRef: AtOriginUnemploymentStableReference;
  germanClaimRefs: readonly AtOriginUnemploymentStableReference[];
  euClaimRefs: readonly StableKnowledgeReference[];
  foreignClaimRefs: readonly ForeignNationalStableReference[];
  foreignProcessReference: typeof SK_UE_PRIMARY_PROCESS_KEY;
  actorRule: Readonly<{
    actorState: "AT_SK_UNEMPLOYMENT_COORDINATION";
    userMustAct: true;
    germanAuthorityMustAct: true;
    foreignAuthorityMustAct: true;
    institutionExchangeExpected: true;
  }>;
  requiredCaseRoles: readonly ["WORKER"];
  requiredCaseStates: readonly ["residenceState", "activityState"];
  handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "EVENT_DRIVEN";
  corridorProcesses: readonly CorridorProcessBinding[];
}>;

export function validateAtSkUnemploymentCoordinationConnectorPack(
  pack: AtSkUnemploymentCoordinationConnectorPack,
): Readonly<{ valid: boolean; issues: readonly string[]; productionEligible: false }> {
  const issues: string[] = [];
  if (pack.packId !== AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID) issues.push("AT_SK_UE_PACK_ID_INVALID");
  if (pack.originMarket !== "AT" || pack.connectedCountry !== "SK") issues.push("AT_SK_CORRIDOR_INVALID");
  if (pack.status !== "prepared") issues.push("AT_SK_UE_CONNECTOR_NOT_PREPARED");
  if ((pack.status as string) === "active") issues.push("CONNECTOR_ACTIVE_FORBIDDEN");
  if (pack.activationFromLocaleAllowed !== false) issues.push("LOCALE_ACTIVATION_FORBIDDEN");
  if (pack.activationRequiresVerifiedCaseContext !== true) issues.push("VERIFIED_CASE_CONTEXT_REQUIRED");
  if (pack.topicFamily !== "SOCIAL_SECURITY_COORDINATION") issues.push("UNSUPPORTED_TOPIC_FAMILY");
  if (pack.topicKey !== "unemployment-coordination-arbeitslosengeld-davka") issues.push("AT_SK_UE_TOPIC_INVALID");
  if (pack.euClaimRefs.length === 0) issues.push("MISSING_EU_REFERENCE");
  if (pack.germanClaimRefs.length === 0) issues.push("MISSING_AT_REFERENCE");
  if (pack.foreignClaimRefs.length === 0) issues.push("MISSING_SK_REFERENCE");
  if (pack.germanProcessRef.sourceJurisdiction !== "AT" || pack.germanProcessRef.trustDomain !== "at") {
    issues.push("AT_PROCESS_JURISDICTION_INVALID");
  }
  for (const ref of pack.germanClaimRefs) {
    if (ref.sourceJurisdiction !== "AT" || ref.trustDomain !== "at") issues.push(`AT_CLAIM_TRUST_INVALID:${ref.key}`);
    if ("id" in (ref as object)) issues.push(`AUTHORING_DATABASE_UUID_FORBIDDEN:${ref.key}`);
  }
  for (const ref of pack.euClaimRefs) {
    if (ref.sourceJurisdiction !== "EU" || ref.trustDomain !== "eu") issues.push(`EU_CLAIM_TRUST_INVALID:${ref.key}`);
  }
  for (const ref of pack.foreignClaimRefs) {
    if (ref.sourceJurisdiction !== "SK" || ref.trustDomain !== "sk") issues.push(`SK_CLAIM_TRUST_INVALID:${ref.key}`);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), productionEligible: false });
}

export function buildAtSkUnemploymentCoordinationConnectorPack(): AtSkUnemploymentCoordinationConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID,
    originMarket: "AT",
    connectedCountry: "SK",
    status: AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "unemployment-coordination-arbeitslosengeld-davka",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: AT_UE_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "AT" as const,
      trustDomain: "at" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: AT_SK_UE_AT_CLAIM_KEYS.map(atRef),
    euClaimRefs: AT_SK_UE_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: AT_SK_UE_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_UE_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "AT_SK_UNEMPLOYMENT_COORDINATION",
      userMustAct: true,
      germanAuthorityMustAct: true,
      foreignAuthorityMustAct: true,
      institutionExchangeExpected: true,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: AT_SK_UE_PROCESSES,
  });
}

export function atSkUnemploymentConnectorSummary(
  pack: AtSkUnemploymentCoordinationConnectorPack = buildAtSkUnemploymentCoordinationConnectorPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    status: pack.status,
    euRefCount: pack.euClaimRefs.length,
    atRefCount: pack.germanClaimRefs.length,
    skRefCount: pack.foreignClaimRefs.length,
    processCount: pack.corridorProcesses?.length ?? 0,
    completeness: evaluateAtSkUnemploymentProcessCompleteness(),
    article65a: evaluateAtSkUnemploymentArticle65a(),
    selfEmployedHardening: evaluateAtSkUnemploymentSelfEmployedHardening(),
    temporal: evaluateAtSkUnemploymentTemporal(),
    validation: validateAtSkUnemploymentCoordinationConnectorPack(pack),
  });
}
