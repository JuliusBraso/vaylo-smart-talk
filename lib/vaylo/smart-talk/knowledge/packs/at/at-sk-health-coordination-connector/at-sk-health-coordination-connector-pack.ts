/**
 * AT-SK-0E AT↔SK health-coordination connector (S1 / EHIC / PEB / S2).
 * Links Shared EU health core, Austrian health routing and the existing SK adapter.
 * Does not copy Articles 17–20 and does not re-determine applicable legislation.
 */
import {
  PROCESS_COMPLETE_DIMENSIONS,
  type ScenarioCoverage,
} from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_SHARED_ART17_CLAIM_KEY,
  EU_SHARED_EHIC_CLAIM_KEY,
  EU_SHARED_S1_CLAIM_KEY,
  EU_SHARED_S2_CLAIM_KEY,
} from "../../eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import {
  AT_HEALTH_PRIMARY_PROCESS_KEY,
  AT_HEALTH_UNITS,
} from "../health-coordination-routing/at-health-coordination-routing-pack";
import {
  SK_HEALTH_PRIMARY_PROCESS_KEY,
  SK_HEALTH_UNITS,
} from "../../sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
} from "../../../source-registry/cross-border-connector-contracts";

export const AT_SK_HEALTH_CONNECTOR_PACK_ID = "at_sk_health_coordination" as const;
export const AT_SK_HEALTH_CONNECTOR_PROCESS_GROUP = "at_sk_health_coordination_connector" as const;
export const AT_SK_HEALTH_CONNECTOR_STATUS = "prepared" as const;

export type AtOriginHealthStableReference = Readonly<{
  entityClass: "claims" | "processes";
  key: string;
  sourceJurisdiction: "AT";
  trustDomain: "at";
  temporalClass: "CURRENT";
}>;

function euRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "EU" as const,
    trustDomain: "eu" as const, temporalClass: "CURRENT" as const,
  });
}
function atRef(key: string): AtOriginHealthStableReference {
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

export const AT_SK_HEALTH_EU_CLAIM_KEYS = Object.freeze([
  EU_SHARED_ART17_CLAIM_KEY,
  EU_SHARED_S1_CLAIM_KEY,
  EU_SHARED_EHIC_CLAIM_KEY,
  EU_SHARED_S2_CLAIM_KEY,
  "health-requires-applicable-legislation-result",
  "work-state-not-automatic-health-competence",
  "nationality-not-health-competent-state",
  "user-locale-not-health-competence",
  "eu-residence-is-centre-of-interests",
  "residence-unclear-fail-closed",
  "s1-not-a1",
  "s1-not-ehic",
  "s1-not-s2",
  "s1-not-work-permit",
  "s1-not-tax-certificate",
  "a1-issued-not-automatic-s1",
  "s1-issued-not-residence-registration-complete",
  "s1-requires-residence-not-stay",
  "temporary-stay-not-automatic-s1",
  "posting-not-automatic-s1",
  "posted-stay-uses-ehic-principles",
  "posted-self-employed-stay-uses-ehic-principles",
  "self-employed-not-automatic-s1-ehic-s2",
  "art-17-insured-person-includes-self-employed",
  "ehic-not-emergency-only",
  "ehic-not-planned-treatment",
  "ehic-not-s2",
  "ehic-not-private-healthcare-guarantee",
  "ehic-not-everything-free",
  "ehic-not-travel-insurance",
  "ehic-issuer-is-competent-institution",
  "prc-same-entitlement-as-ehic",
  "art-20-planned-treatment-needs-authorisation",
  "purpose-of-travel-for-treatment-not-art-19",
  "medical-justification-case-specific",
  "non-resident-s2-residence-forwards-competent-decides",
  "s2-not-yet-granted-not-entitlement",
  "s2-not-automatic-private-clinic",
  "directive-2011-24-not-regulation-s2",
  "directive-engine-not-implemented",
  "socialna-poistovna-not-slovak-health-insurer",
  "competent-institution-not-residence-institution",
  "two-health-cards-not-two-applicable-systems",
  "healthcare-in-two-states-not-dual-legislation",
  "s1-change-requires-reexamination",
  "old-s1-not-entitlement-forever",
  "family-dependency-unclear-fail-closed",
  "private-provider-not-automatic",
  "cash-sickness-not-benefits-in-kind",
]);

export const AT_SK_HEALTH_AT_CLAIM_KEYS = Object.freeze(AT_HEALTH_UNITS.map((unit) => unit.key));
export const AT_SK_HEALTH_SK_CLAIM_KEYS = Object.freeze(SK_HEALTH_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;
type AnyRef = StableKnowledgeReference | ForeignNationalStableReference | AtOriginHealthStableReference;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly AnyRef[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`AT_SK_HEALTH_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length) as CorridorProcessBinding["claimRefs"],
  });
}

export const AT_SK_HEALTH_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("at-sk-health-al-context-gate", "Zuständigen Krankenstaat aus 0D voraussetzen", "Wohnen oder Arbeiten AT-SK ohne verifizierte anwendbare Rechtsvorschriften", "Nicht Artikel 11 neu bewerten; APPLICABLE_LEGISLATION_CONTEXT_REQUIRED zurückgeben.", [euRef("health-requires-applicable-legislation-result"), atRef("at-health-requires-al-result"), atRef("at-health-does-not-redetermine-al"), euRef("work-state-not-automatic-health-competence"), euRef("nationality-not-health-competent-state"), euRef("user-locale-not-health-competence"), atRef("at-health-activity-not-insurer"), euRef("s1-change-requires-reexamination"), atRef("at-health-unknown-carrier-unresolved"), euRef("s1-not-a1"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-membership-not-competence")]),
  binding("at-sk-health-residence-vs-stay", "Wohnort und vorübergehenden Aufenthalt AT-SK trennen", "Meldezettel, trvalý pobyt oder Projekttage werden als Wohnort angeboten", "Mittelpunkt der Interessen prüfen; S1 und EHIC nicht aus dem Zielland wählen.", [euRef("eu-residence-is-centre-of-interests"), euRef("residence-unclear-fail-closed"), euRef("s1-requires-residence-not-stay"), euRef("temporary-stay-not-automatic-s1"), skRef("sk-health-trvaly-pobyt-not-bydlisko"), euRef(EU_SHARED_S1_CLAIM_KEY), euRef("posting-not-automatic-s1"), euRef("s1-change-requires-reexamination"), atRef("at-health-s1-issuer-not-registration"), euRef("posted-stay-uses-ehic-principles"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-s1-not-automatic-for-stay")]),
  binding("at-sk-health-at-competent-sk-residence-s1", "AT zuständig, Wohnort SK, S1", "Verifizierter zuständiger Staat AT und tatsächlicher Wohnort SK", "Österreichischen Träger auflösen; slowakische Krankenversicherung trägt ein.", [euRef(EU_SHARED_ART17_CLAIM_KEY), atRef("at-health-requires-al-result"), atRef("at-health-oegk-s1-wohnsitzbescheinigung"), skRef("sk-health-incoming-s1-choose-insurer"), euRef("s1-issued-not-residence-registration-complete"), atRef("at-health-employee-not-always-oegk"), skRef("sk-health-incoming-not-second-insurance"), euRef("s1-change-requires-reexamination"), atRef("at-health-s1-issuer-not-registration"), skRef("sk-health-eu-card-after-registration"), atRef("at-health-does-not-copy-eu-law"), skRef("sk-health-incoming-not-contribution")]),
  binding("at-sk-health-sk-competent-at-residence-s1", "SK zuständig, Wohnort AT, S1", "Verifizierter zuständiger Staat SK und tatsächlicher Wohnort AT", "Slowakische Krankenversicherung stellt S1 aus; österreichischen Eintragungsträger nicht raten.", [euRef(EU_SHARED_ART17_CLAIM_KEY), atRef("at-health-requires-al-result"), skRef("sk-health-outgoing-s1-from-insurer"), atRef("at-health-incoming-s1-fail-closed"), euRef("s1-issued-not-residence-registration-complete"), skRef("sk-health-insurer-unknown-fail-closed"), atRef("at-health-unknown-carrier-unresolved"), euRef("s1-change-requires-reexamination"), skRef("sk-health-outgoing-s1-from-insurer"), atRef("at-health-s1-issuer-not-registration"), skRef("sk-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-s1-issuer")]),
  binding("at-sk-health-sk-competent-temp-at-ehic", "SK zuständig, vorübergehender Aufenthalt AT, EHIC", "Verifizierte SK-Gesetzgebung, Wohnort bleibt SK, vorübergehende Arbeit AT", "Nicht automatisch S1; slowakische EPZP für medizinisch notwendige Behandlung.", [euRef("posted-stay-uses-ehic-principles"), euRef("posting-not-automatic-s1"), skRef("sk-health-ehic-from-competent-insurer"), euRef(EU_SHARED_EHIC_CLAIM_KEY), euRef("ehic-not-emergency-only"), euRef("ehic-not-planned-treatment"), euRef("a1-issued-not-automatic-s1"), euRef("s1-change-requires-reexamination"), skRef("sk-health-ehic-from-competent-insurer"), euRef("s1-not-a1"), atRef("at-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-ehic-issuer")]),
  binding("at-sk-health-at-competent-temp-sk-ehic", "AT zuständig, vorübergehender Aufenthalt SK, EKVK", "Verifizierte AT-Gesetzgebung, Wohnort bleibt AT, vorübergehende Arbeit SK", "Österreichische EKVK; S1 nicht automatisch.", [euRef("posted-stay-uses-ehic-principles"), atRef("at-health-s1-not-automatic-for-stay"), atRef("at-health-ekvk-on-ecard"), euRef(EU_SHARED_EHIC_CLAIM_KEY), euRef("ehic-not-emergency-only"), euRef("ehic-not-planned-treatment"), atRef("at-health-ehic-from-competent-carrier"), euRef("s1-change-requires-reexamination"), atRef("at-health-ehic-from-competent-carrier"), euRef("s1-not-a1"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-ehic-not-private-or-free")]),
  binding("at-sk-health-prc-replacement", "Verlorene oder ungültige EHIC, Ersatzbescheinigung", "EKVK oder EPZP fehlt, ist abgelaufen oder mit Sternchen", "PEB oder náhradný certifikát beim zuständigen Krankenversicherungsträger.", [euRef("prc-same-entitlement-as-ehic"), atRef("at-health-peb-replacement"), skRef("sk-health-prc-vszp-operational"), euRef(EU_SHARED_EHIC_CLAIM_KEY), atRef("at-health-ehic-from-competent-carrier"), skRef("sk-health-ehic-from-competent-insurer"), euRef("ehic-not-s2"), euRef("s1-change-requires-reexamination"), atRef("at-health-peb-replacement"), skRef("sk-health-eu-card-not-ehic"), atRef("at-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-ehic-issuer")]),
  binding("at-sk-health-at-to-sk-s2", "Geplante Behandlung SK bei zuständigem Staat AT", "AT zuständig, Reisezweck geplante Behandlung in der Slowakei", "Vorabbewilligung beim zuständigen österreichischen Träger; ÖGK-Formular nicht universell.", [euRef("art-20-planned-treatment-needs-authorisation"), atRef("at-health-oegk-s2-prior-approval"), atRef("at-health-svs-s2-art20"), euRef(EU_SHARED_S2_CLAIM_KEY), atRef("at-health-s2-not-treat-first"), euRef("medical-justification-case-specific"), euRef("s2-not-automatic-private-clinic"), euRef("s1-change-requires-reexamination"), atRef("at-health-unknown-carrier-unresolved"), euRef("private-provider-not-automatic"), atRef("at-health-directive-handoff"), atRef("at-health-s2-not-oegk-universal")]),
  binding("at-sk-health-sk-to-at-s2", "Geplante Behandlung AT bei zuständigem Staat SK", "SK zuständig, Reisezweck geplante Behandlung in Österreich", "Antrag an die zuständige slowakische Krankenversicherung nach § 9f, nicht an Sociálna poisťovňa.", [euRef("art-20-planned-treatment-needs-authorisation"), skRef("sk-health-s2-9f-apply-to-insurer"), skRef("sk-health-s2-9b"), euRef(EU_SHARED_S2_CLAIM_KEY), skRef("sk-health-s2-15-working-days"), skRef("sk-health-s2-not-vszp-universal-deadline"), euRef("s2-not-automatic-private-clinic"), euRef("s1-change-requires-reexamination"), skRef("sk-health-s2-9f-apply-to-insurer"), euRef("private-provider-not-automatic"), skRef("sk-health-directive-9d-not-s2"), skRef("sk-health-sp-not-s2-institution")]),
  binding("at-sk-health-s1-register-sk", "S1-Eintragung in der Slowakei", "AT zuständig, S1 ausgestellt oder anzufordern, Wohnort SK", "Gewählte slowakische Krankenversicherung nach § 9c; nicht Sociálna poisťovňa.", [skRef("sk-health-incoming-s1-choose-insurer"), euRef("s1-issued-not-residence-registration-complete"), euRef(EU_SHARED_S1_CLAIM_KEY), skRef("sk-health-channel-fetch-live"), skRef("sk-health-application-not-approval"), skRef("sk-health-eu-card-after-registration"), skRef("sk-health-eu-card-not-ehic"), euRef("s1-change-requires-reexamination"), skRef("sk-health-incoming-s1-choose-insurer"), skRef("sk-health-incoming-not-second-insurance"), atRef("at-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-s1-issuer")]),
  binding("at-sk-health-s1-register-at", "S1-Eintragung in Österreich", "SK zuständig, S1 ausgestellt, Wohnort AT", "Österreichischen Eintragungsträger nicht ohne Kategorie setzen.", [atRef("at-health-incoming-s1-fail-closed"), euRef("s1-issued-not-residence-registration-complete"), euRef(EU_SHARED_S1_CLAIM_KEY), atRef("at-health-office-fetch-live"), atRef("at-health-s1-not-boolean"), atRef("at-health-unknown-carrier-unresolved"), euRef("s1-not-ehic"), euRef("s1-change-requires-reexamination"), atRef("at-health-s1-issuer-not-registration"), euRef("competent-institution-not-residence-institution"), skRef("sk-health-does-not-copy-eu-law"), atRef("at-health-activity-not-insurer")]),
  binding("at-sk-health-employee-residence-split", "Arbeitnehmer AT↔SK Wohnsitzspaltung", "Verifizierte Beschäftigung, Wohnort und zuständiger Staat verschieden", "Ein verifiziertes Ergebnis verbrauchen; ÖGK nicht universell.", [euRef(EU_SHARED_ART17_CLAIM_KEY), atRef("at-health-ordinary-employee-oegk-candidate"), atRef("at-health-employee-not-always-oegk"), euRef("health-requires-applicable-legislation-result"), atRef("at-health-bvaeb-special-route"), euRef("s1-requires-residence-not-stay"), euRef("posting-not-automatic-s1"), euRef("s1-change-requires-reexamination"), atRef("at-health-unknown-carrier-unresolved"), euRef("s1-not-a1"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-employee-not-always-oegk")]),
  binding("at-sk-health-szco-residence-split", "SZČO AT↔SK Wohnsitzspaltung", "Verifizierte Selbständigkeit, Wohnort und zuständiger Staat verschieden", "SVS nur nach verifizierter AT-Kategorie; SK-Krankenversicherung nicht Sociálna poisťovňa.", [euRef("art-17-insured-person-includes-self-employed"), atRef("at-health-svs-self-employed-route"), atRef("at-health-svs-not-automatic-from-status"), skRef("sk-health-employee-or-szco-may-request-s1"), euRef("posted-self-employed-stay-uses-ehic-principles"), skRef("sk-health-szco-or-zivnost-not-insurer-identity"), euRef("self-employed-not-automatic-s1-ehic-s2"), euRef("s1-change-requires-reexamination"), atRef("at-health-svs-auslandsbetreuungsschein"), euRef("s1-not-a1"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-membership-not-competence")]),
  binding("at-sk-health-mixed-after-al", "Gemischte Tätigkeit nach verifiziertem Zustand", "Gleichzeitige Beschäftigung und Selbständigkeit, ein verifiziertes 0D-Ergebnis", "Nicht zwei gesetzliche Krankenversicherungssysteme erfinden.", [euRef("health-requires-applicable-legislation-result"), euRef("healthcare-in-two-states-not-dual-legislation"), euRef("two-health-cards-not-two-applicable-systems"), atRef("at-health-does-not-redetermine-al"), euRef(EU_SHARED_ART17_CLAIM_KEY), euRef("a1-issued-not-automatic-s1"), atRef("at-health-activity-not-insurer"), euRef("s1-change-requires-reexamination"), atRef("at-health-unknown-carrier-unresolved"), euRef("s1-not-a1"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-membership-not-competence")]),
  binding("at-sk-health-family-s1-handoff", "Familienangehörigen-S1 nach EU-Kern", "Angehörige verlangen abgeleiteten S1-Anspruch AT-SK", "EU-Familienprinzip und nationale Klassifikation; Beziehungslabel nicht automatisch setzen.", [euRef("family-dependency-unclear-fail-closed"), skRef("sk-health-family-3-2-d"), skRef("sk-health-spouse-not-automatic"), skRef("sk-health-child-not-automatic"), skRef("sk-health-own-activity-overrides"), euRef(EU_SHARED_S1_CLAIM_KEY), atRef("at-health-not-family-benefit"), euRef("s1-change-requires-reexamination"), skRef("sk-health-incoming-s1-choose-insurer"), euRef("s1-not-tax-certificate"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-not-family-benefit")]),
  binding("at-sk-health-material-change", "Gesundheits-Neuwertung nach Zuständigkeitswechsel", "AT Jan–Jul dann DE Aug–Dec oder sonstiger zuständiger Staatswechsel", "Altes österreichisches S1 nicht fortschreiben; Historie erhalten.", [euRef("s1-change-requires-reexamination"), atRef("at-health-material-change-reassessment"), atRef("at-health-old-s1-not-eternal"), euRef("old-s1-not-entitlement-forever"), euRef("health-requires-applicable-legislation-result"), skRef("sk-health-change-cancellation"), skRef("sk-health-physical-not-eternal"), euRef("s1-change-requires-reexamination"), atRef("at-health-unknown-carrier-unresolved"), atRef("at-health-not-tax"), atRef("at-health-does-not-redetermine-al"), atRef("at-health-old-s1-not-eternal")]),
  binding("at-sk-health-sk-at-de-s1-ehic", "SK+AT+DE S1 und EHIC gemeinsam", "Zuständig AT, Wohnort SK, vorübergehender Aufenthalt DE", "S1 für Wohnstaat SK und österreichische EKVK für Aufenthalt DE sind nicht einander ausschließend.", [euRef(EU_SHARED_ART17_CLAIM_KEY), euRef("ehic-issuer-is-competent-institution"), atRef("at-health-ekvk-on-ecard"), skRef("sk-health-incoming-s1-choose-insurer"), euRef(EU_SHARED_EHIC_CLAIM_KEY), euRef("two-health-cards-not-two-applicable-systems"), euRef("healthcare-in-two-states-not-dual-legislation"), euRef("s1-change-requires-reexamination"), atRef("at-health-ehic-from-competent-carrier"), skRef("sk-health-eu-card-not-ehic"), atRef("at-health-does-not-copy-eu-law"), euRef("s1-not-ehic")]),
  binding("at-sk-health-a1-handoff", "A1 an Gesundheit übergeben ohne Vermengen", "A1 oder verifiziertes 0D-Ergebnis liegt vor, Wohnort oder Aufenthalt offen", "A1 ist nicht S1 und nicht EHIC; ohne Wohnort/Aufenthalt fail-closed.", [euRef("a1-issued-not-automatic-s1"), atRef("at-health-a1-not-s1-or-ehic"), euRef("s1-not-a1"), euRef("residence-unclear-fail-closed"), euRef("health-requires-applicable-legislation-result"), euRef("posting-not-automatic-s1"), euRef("s1-not-ehic"), euRef("s1-change-requires-reexamination"), atRef("at-health-s1-issuer-not-registration"), euRef("s1-not-s2"), atRef("at-health-does-not-copy-eu-law"), atRef("at-health-not-gewerbe")]),
  binding("at-sk-health-s2-vs-directive", "S2 und Richtlinie 2011/24 trennen", "Nutzer verlangt Richtlinien-Erstattung oder private Auslandsbehandlung ohne S2", "Nicht als S2 beantworten; CROSS_BORDER_HEALTHCARE_DIRECTIVE_REVIEW_REQUIRED.", [euRef("directive-2011-24-not-regulation-s2"), euRef("directive-engine-not-implemented"), atRef("at-health-directive-handoff"), skRef("sk-health-directive-9d-not-s2"), euRef("purpose-of-travel-for-treatment-not-art-19"), euRef("ehic-not-planned-treatment"), euRef("s2-not-yet-granted-not-entitlement"), euRef("s1-change-requires-reexamination"), atRef("at-health-oegk-s2-prior-approval"), euRef("private-provider-not-automatic"), atRef("at-health-does-not-copy-eu-law"), euRef("s1-not-s2")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const AT_SK_HEALTH_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "at-oegk-res-sk", label: "AT zuständig, Wohnort SK, ordentlicher Arbeitnehmer", coverage: "COVERED", requiredClaimKeys: ["at-health-ordinary-employee-oegk-candidate", "sk-health-incoming-s1-choose-insurer"], requiredProcessKeys: ["at-sk-health-at-competent-sk-residence-s1"] },
  { id: "at-svs-res-sk", label: "AT zuständig, Wohnort SK, SVS-Selbständige", coverage: "COVERED", requiredClaimKeys: ["at-health-svs-self-employed-route", "at-health-svs-auslandsbetreuungsschein"], requiredProcessKeys: ["at-sk-health-szco-residence-split"] },
  { id: "at-bvaeb-res-sk", label: "AT zuständig, Wohnort SK, BVAEB", coverage: "COVERED", requiredClaimKeys: ["at-health-bvaeb-special-route"], requiredProcessKeys: ["at-sk-health-employee-residence-split"] },
  { id: "at-unknown-carrier-fail-closed", label: "AT zuständig, Wohnort SK, Träger unbekannt", coverage: "COVERED", requiredClaimKeys: ["at-health-unknown-carrier-unresolved"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "sk-competent-res-at", label: "SK zuständig, Wohnort AT", coverage: "COVERED", requiredClaimKeys: ["sk-health-outgoing-s1-from-insurer", "at-health-incoming-s1-fail-closed"], requiredProcessKeys: ["at-sk-health-sk-competent-at-residence-s1"] },
  { id: "sk-competent-res-sk-no-auto-s1", label: "SK zuständig und Wohnort SK, S1 nicht automatisch", coverage: "COVERED", requiredClaimKeys: ["s1-requires-residence-not-stay"], requiredProcessKeys: ["at-sk-health-residence-vs-stay"] },
  { id: "at-competent-temp-sk-no-auto-s1", label: "AT zuständig, nur vorübergehender Aufenthalt SK", coverage: "COVERED", requiredClaimKeys: ["at-health-s1-not-automatic-for-stay", "posting-not-automatic-s1"], requiredProcessKeys: ["at-sk-health-at-competent-temp-sk-ehic"] },
  { id: "sk-competent-temp-at-no-auto-s1", label: "SK zuständig, nur vorübergehender Aufenthalt AT", coverage: "COVERED", requiredClaimKeys: ["posting-not-automatic-s1", "posted-stay-uses-ehic-principles"], requiredProcessKeys: ["at-sk-health-sk-competent-temp-at-ehic"] },
  { id: "registered-address-not-residence", label: "Meldeadresse weicht vom unionsrechtlichen Wohnort ab", coverage: "COVERED", requiredClaimKeys: ["eu-residence-is-centre-of-interests", "sk-health-trvaly-pobyt-not-bydlisko"], requiredProcessKeys: ["at-sk-health-residence-vs-stay"] },
  { id: "s1-not-double-insurance", label: "S1 als Doppelversicherung abgelehnt", coverage: "COVERED", requiredClaimKeys: ["sk-health-incoming-not-second-insurance", "two-health-cards-not-two-applicable-systems"], requiredProcessKeys: ["at-sk-health-s1-register-sk"] },
  { id: "s1-registration-not-competent-change", label: "S1-Eintragung ändert den zuständigen Staat nicht", coverage: "COVERED", requiredClaimKeys: ["at-health-does-not-redetermine-al", "competent-institution-not-residence-institution"], requiredProcessKeys: ["at-sk-health-at-competent-sk-residence-s1"] },
  { id: "old-s1-after-competent-change", label: "Altes S1 nach Zuständigkeitswechsel", coverage: "COVERED", requiredClaimKeys: ["at-health-old-s1-not-eternal", "s1-change-requires-reexamination"], requiredProcessKeys: ["at-sk-health-material-change"] },
  { id: "sk-insured-temp-at-ehic", label: "SK versichert, vorübergehende Arbeit AT, EHIC", coverage: "COVERED", requiredClaimKeys: ["sk-health-ehic-from-competent-insurer", "posted-stay-uses-ehic-principles"], requiredProcessKeys: ["at-sk-health-sk-competent-temp-at-ehic"] },
  { id: "at-insured-temp-sk-ekvk", label: "AT versichert, vorübergehende Arbeit SK, EKVK", coverage: "COVERED", requiredClaimKeys: ["at-health-ekvk-on-ecard", "posted-stay-uses-ehic-principles"], requiredProcessKeys: ["at-sk-health-at-competent-temp-sk-ehic"] },
  { id: "medically-necessary-during-stay", label: "Medizinisch notwendige Behandlung während des Aufenthalts", coverage: "COVERED", requiredClaimKeys: ["ehic-not-emergency-only"], requiredProcessKeys: ["at-sk-health-at-competent-temp-sk-ehic"] },
  { id: "non-emergency-necessary", label: "Nicht Notfall, aber medizinisch notwendig", coverage: "COVERED", requiredClaimKeys: ["ehic-not-emergency-only"], requiredProcessKeys: ["at-sk-health-sk-competent-temp-at-ehic"] },
  { id: "planned-trip-ehic-reject", label: "Geplante Behandlungsreise mit EHIC abgelehnt", coverage: "COVERED", requiredClaimKeys: ["ehic-not-planned-treatment", "purpose-of-travel-for-treatment-not-art-19"], requiredProcessKeys: ["at-sk-health-s2-vs-directive"] },
  { id: "private-provider-ehic-reject", label: "Privater Anbieter als EHIC-Garantie abgelehnt", coverage: "COVERED", requiredClaimKeys: ["ehic-not-private-healthcare-guarantee", "at-health-ehic-not-private-or-free"], requiredProcessKeys: ["at-sk-health-at-competent-temp-sk-ehic"] },
  { id: "zero-copay-reject", label: "EHIC als Nullkosten-Garantie abgelehnt", coverage: "COVERED", requiredClaimKeys: ["ehic-not-everything-free"], requiredProcessKeys: ["at-sk-health-at-competent-temp-sk-ehic"] },
  { id: "repatriation-reject", label: "EHIC als Rückholversicherung abgelehnt", coverage: "COVERED", requiredClaimKeys: ["ehic-not-travel-insurance"], requiredProcessKeys: ["at-sk-health-sk-competent-temp-at-ehic"] },
  { id: "lost-ehic-prc", label: "Verlorene EHIC → Ersatzbescheinigung", coverage: "COVERED", requiredClaimKeys: ["at-health-peb-replacement", "prc-same-entitlement-as-ehic"], requiredProcessKeys: ["at-sk-health-prc-replacement"] },
  { id: "expired-ehic-prc", label: "Abgelaufene EHIC → Ersatz / Träger", coverage: "COVERED", requiredClaimKeys: ["sk-health-prc-vszp-operational", "at-health-peb-replacement"], requiredProcessKeys: ["at-sk-health-prc-replacement"] },
  { id: "s1-holder-temp-de-uses-competent-ehic", label: "S1-Inhaber, Aufenthalt DE, EHIC vom zuständigen Staat", coverage: "COVERED", requiredClaimKeys: ["ehic-issuer-is-competent-institution", "at-health-ekvk-on-ecard"], requiredProcessKeys: ["at-sk-health-sk-at-de-s1-ehic"] },
  { id: "residence-not-ehic-issuer", label: "Wohnstaat unrichtig als EHIC-Aussteller", coverage: "COVERED", requiredClaimKeys: ["ehic-issuer-is-competent-institution"], requiredProcessKeys: ["at-sk-health-sk-at-de-s1-ehic"] },
  { id: "at-competent-planned-sk", label: "AT zuständig, geplante Behandlung SK", coverage: "COVERED", requiredClaimKeys: ["at-health-oegk-s2-prior-approval", "art-20-planned-treatment-needs-authorisation"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "sk-competent-planned-at", label: "SK zuständig, geplante Behandlung AT", coverage: "COVERED", requiredClaimKeys: ["sk-health-s2-9f-apply-to-insurer"], requiredProcessKeys: ["at-sk-health-sk-to-at-s2"] },
  { id: "planned-without-authorization", label: "Geplante Behandlung ohne Vorabgenehmigung", coverage: "COVERED", requiredClaimKeys: ["at-health-s2-not-treat-first", "s2-not-yet-granted-not-entitlement"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "s2-pending", label: "S2-Genehmigung ausstehend", coverage: "COVERED", requiredClaimKeys: ["s2-not-yet-granted-not-entitlement"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "s2-medical-assessment", label: "S2 medizinische Beurteilung erforderlich", coverage: "COVERED", requiredClaimKeys: ["medical-justification-case-specific", "at-health-medical-assessment-required"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "s2-art26-residence-forwards", label: "Wohnort ≠ zuständig, Artikel 26", coverage: "COVERED", requiredClaimKeys: ["non-resident-s2-residence-forwards-competent-decides"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "s2-as-ehic-reject", label: "S2 als EHIC abgelehnt", coverage: "COVERED", requiredClaimKeys: ["s1-not-s2", "ehic-not-planned-treatment"], requiredProcessKeys: ["at-sk-health-s2-vs-directive"] },
  { id: "ehic-as-s2-reject", label: "EHIC für geplante Behandlung abgelehnt", coverage: "COVERED", requiredClaimKeys: ["ehic-not-planned-treatment"], requiredProcessKeys: ["at-sk-health-s2-vs-directive"] },
  { id: "s2-private-provider-reject", label: "S2 als beliebige Privatklinik abgelehnt", coverage: "COVERED", requiredClaimKeys: ["s2-not-automatic-private-clinic"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "s2-not-al-change", label: "S2 ändert anwendbare Rechtsvorschriften nicht", coverage: "COVERED", requiredClaimKeys: ["at-health-does-not-redetermine-al"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
  { id: "s2-not-directive", label: "S2 mit Richtlinie 2011/24 vermengt", coverage: "COVERED", requiredClaimKeys: ["directive-2011-24-not-regulation-s2", "at-health-directive-handoff"], requiredProcessKeys: ["at-sk-health-s2-vs-directive"] },
  { id: "directive-requested-handoff", label: "Richtlinienweg verlangt → Handoff", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["directive-engine-not-implemented", "at-health-directive-handoff"], requiredProcessKeys: ["at-sk-health-s2-vs-directive"] },
  { id: "employee-at-res-sk", label: "AT-Arbeitnehmer, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["at-health-ordinary-employee-oegk-candidate"], requiredProcessKeys: ["at-sk-health-employee-residence-split"] },
  { id: "employee-sk-res-at", label: "SK-Arbeitnehmer, Wohnort AT", coverage: "COVERED", requiredClaimKeys: ["sk-health-outgoing-s1-from-insurer"], requiredProcessKeys: ["at-sk-health-employee-residence-split"] },
  { id: "szco-at-law-res-sk", label: "AT-Gesetzgebung, SVS-SZČO, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["at-health-svs-self-employed-route"], requiredProcessKeys: ["at-sk-health-szco-residence-split"] },
  { id: "szco-sk-law-res-at", label: "SK-Gesetzgebung, SZČO, Wohnort AT", coverage: "COVERED", requiredClaimKeys: ["sk-health-employee-or-szco-may-request-s1"], requiredProcessKeys: ["at-sk-health-szco-residence-split"] },
  { id: "mixed-at-verified", label: "Gemischt, AT verifiziert zuständig", coverage: "COVERED", requiredClaimKeys: ["healthcare-in-two-states-not-dual-legislation"], requiredProcessKeys: ["at-sk-health-mixed-after-al"] },
  { id: "mixed-sk-verified", label: "Gemischt, SK verifiziert zuständig", coverage: "COVERED", requiredClaimKeys: ["at-health-does-not-redetermine-al"], requiredProcessKeys: ["at-sk-health-mixed-after-al"] },
  { id: "mixed-two-systems-reject", label: "Gemischt als zwei Krankenversicherungssysteme", coverage: "COVERED", requiredClaimKeys: ["two-health-cards-not-two-applicable-systems"], requiredProcessKeys: ["at-sk-health-mixed-after-al"] },
  { id: "activity-country-as-insurer-reject", label: "Tätigkeitsstaat als Krankenstaat", coverage: "COVERED", requiredClaimKeys: ["work-state-not-automatic-health-competence", "at-health-activity-not-insurer"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "a1-at-res-sk-evaluates-s1", label: "A1 sagt AT, Wohnort SK → S1 prüfen", coverage: "COVERED", requiredClaimKeys: ["a1-issued-not-automatic-s1", "at-health-a1-not-s1-or-ehic"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "a1-sk-temp-at-ehic", label: "A1 sagt SK, vorübergehendes AT-Projekt → EHIC", coverage: "COVERED", requiredClaimKeys: ["posted-stay-uses-ehic-principles", "a1-issued-not-automatic-s1"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "a1-without-residence-facts", label: "A1 vorhanden, Wohnort/Aufenthalt fehlt", coverage: "COVERED", requiredClaimKeys: ["residence-unclear-fail-closed"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "verified-al-without-physical-a1", label: "Verifizierte Bestimmung ohne körperliche A1", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "at-health-requires-al-result"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "a1-as-ehic-reject", label: "A1 als EHIC abgelehnt", coverage: "COVERED", requiredClaimKeys: ["at-health-a1-not-s1-or-ehic"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "a1-as-s1-reject", label: "A1 als S1 abgelehnt", coverage: "COVERED", requiredClaimKeys: ["s1-not-a1", "at-health-a1-not-s1-or-ehic"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "three-state-at-sk-de", label: "Zuständig AT, Wohnort SK, Aufenthalt DE", coverage: "COVERED", requiredClaimKeys: ["ehic-issuer-is-competent-institution", "art-17-residence-benefits-in-kind"], requiredProcessKeys: ["at-sk-health-sk-at-de-s1-ehic"] },
  { id: "s1-and-ehic-coexist", label: "S1 SK und österreichische EKVK für DE gemeinsam", coverage: "COVERED", requiredClaimKeys: ["s1-not-ehic", "two-health-cards-not-two-applicable-systems"], requiredProcessKeys: ["at-sk-health-sk-at-de-s1-ehic"] },
  { id: "szco-at-then-de-al-unchanged", label: "SK SZČO AT dann DE, zuständiger Staat unverändert", coverage: "COVERED", requiredClaimKeys: ["at-health-material-change-reassessment"], requiredProcessKeys: ["at-sk-health-material-change"] },
  { id: "szco-at-then-de-al-changes", label: "dieselbe Folge, zuständiger Staat ändert sich", coverage: "COVERED", requiredClaimKeys: ["at-health-old-s1-not-eternal", "s1-change-requires-reexamination"], requiredProcessKeys: ["at-sk-health-material-change"] },
  { id: "old-at-carrier-after-change-reject", label: "Alter österreichischer Träger nach Rechtswechsel", coverage: "COVERED", requiredClaimKeys: ["at-health-old-s1-not-eternal"], requiredProcessKeys: ["at-sk-health-material-change"] },
  { id: "selector-switch-preserves-health-history", label: "AT→DE-Selektor erhält Gesundheitsgeschichte", coverage: "COVERED", requiredClaimKeys: ["at-health-material-change-reassessment"], requiredProcessKeys: ["at-sk-health-material-change"] },
  { id: "three-states-not-three-insurances", label: "Drei Staaten nicht drei Krankenversicherungen", coverage: "COVERED", requiredClaimKeys: ["healthcare-in-two-states-not-dual-legislation"], requiredProcessKeys: ["at-sk-health-sk-at-de-s1-ehic"] },
  { id: "family-s1-shared-core", label: "Familienangehörigen-S1 über EU-Kern", coverage: "COVERED", requiredClaimKeys: ["family-dependency-unclear-fail-closed", "sk-health-family-3-2-d"], requiredProcessKeys: ["at-sk-health-family-s1-handoff"] },
  { id: "family-unresolved-fail-closed", label: "Familienverhältnis ungeklärt", coverage: "COVERED", requiredClaimKeys: ["family-dependency-unclear-fail-closed", "sk-health-spouse-not-automatic"], requiredProcessKeys: ["at-sk-health-family-s1-handoff"] },
  { id: "family-s1-not-art68", label: "S1-Familie nicht Artikel 68", coverage: "COVERED", requiredClaimKeys: ["at-health-not-family-benefit"], requiredProcessKeys: ["at-sk-health-family-s1-handoff"] },
  { id: "health-not-unemployment", label: "Gesundheitsstaat nicht Arbeitslosenstaat", coverage: "COVERED", requiredClaimKeys: ["at-health-not-unemployment"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "health-not-tax-residence", label: "Gesundheitsstaat nicht Steueransässigkeit", coverage: "COVERED", requiredClaimKeys: ["at-health-not-tax", "s1-not-tax-certificate"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "health-not-gewerbe", label: "S1/EHIC/S2 nicht Gewerbe", coverage: "COVERED", requiredClaimKeys: ["at-health-not-gewerbe"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "family-benefit-merits-oos", label: "Artikel-68-Familienleistungsmerits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-not-family-benefit"], requiredProcessKeys: ["at-sk-health-family-s1-handoff"] },
  { id: "unemployment-u-docs-oos", label: "U1/U2/U3 und Artikel 65", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-not-unemployment"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "tax-treaty-oos", label: "AT-SK-Steueransässigkeit und DBA", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-not-tax"], requiredProcessKeys: ["at-sk-health-al-context-gate"] },
  { id: "gewerbe-merits-oos", label: "Vollständige Gewerbe-/Dienstleistungsanzeige", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-not-gewerbe"], requiredProcessKeys: ["at-sk-health-a1-handoff"] },
  { id: "clinical-decision-oos", label: "Klinische Entscheidung und Diagnose", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-medical-assessment-required", "medical-justification-case-specific"], requiredProcessKeys: ["at-sk-health-at-to-sk-s2"] },
]);

export const AT_SK_HEALTH_NEGATIVE_CONTROLS = Object.freeze([
  "s1-not-a1",
  "s1-not-ehic",
  "s1-not-s2",
  "at-health-a1-not-s1-or-ehic",
  "sk-health-incoming-not-second-insurance",
  "s1-not-tax-certificate",
  "at-health-does-not-redetermine-al",
  "ehic-not-emergency-only",
  "ehic-not-planned-treatment",
  "ehic-not-private-healthcare-guarantee",
  "ehic-not-everything-free",
  "ehic-not-travel-insurance",
  "at-health-s2-not-treat-first",
  "directive-2011-24-not-regulation-s2",
  "at-health-employee-not-always-oegk",
  "at-health-svs-not-automatic-from-status",
  "sk-health-sp-not-s1-issuer",
  "sk-health-sp-not-ehic-issuer",
  "sk-health-sp-not-s2-institution",
  "posting-not-automatic-s1",
  "at-health-activity-not-insurer",
  "at-health-not-gewerbe",
  "at-health-old-s1-not-eternal",
  "two-health-cards-not-two-applicable-systems",
]);

export function evaluateAtSkHealthProcessCompleteness() {
  const processKeys = new Set(AT_SK_HEALTH_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...AT_SK_HEALTH_EU_CLAIM_KEYS,
    ...AT_SK_HEALTH_AT_CLAIM_KEYS,
    ...AT_SK_HEALTH_SK_CLAIM_KEYS,
  ]);
  const incomplete = AT_SK_HEALTH_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = AT_SK_HEALTH_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = AT_SK_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_SK_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_SK_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && missingClaims.length === 0 && uncoveredRequired.length === 0;
  return Object.freeze({
    processCount: AT_SK_HEALTH_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: AT_SK_HEALTH_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
  });
}

export type AtSkHealthCoordinationConnectorPack = Readonly<{
  schemaVersion: typeof CROSS_BORDER_CONNECTOR_SCHEMA_VERSION;
  packId: typeof AT_SK_HEALTH_CONNECTOR_PACK_ID;
  originMarket: "AT";
  connectedCountry: "SK";
  status: typeof AT_SK_HEALTH_CONNECTOR_STATUS;
  activationFromLocaleAllowed: false;
  activationRequiresVerifiedCaseContext: true;
  topicKey: "health-insurance-coordination-s1-ehic-s2";
  topicFamily: "SOCIAL_SECURITY_COORDINATION";
  germanProcessRef: AtOriginHealthStableReference;
  germanClaimRefs: readonly AtOriginHealthStableReference[];
  euClaimRefs: readonly StableKnowledgeReference[];
  foreignClaimRefs: readonly ForeignNationalStableReference[];
  foreignProcessReference: typeof SK_HEALTH_PRIMARY_PROCESS_KEY;
  actorRule: Readonly<{
    actorState: "AT_SK_HEALTH_COORDINATION";
    userMustAct: true;
    germanAuthorityMustAct: true;
    foreignAuthorityMustAct: true;
    institutionExchangeExpected: true;
  }>;
  requiredCaseRoles: readonly ["WORKER"];
  requiredCaseStates: readonly ["residenceState", "competentHealthState", "stayOrTreatmentState"];
  handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "EVENT_DRIVEN";
  corridorProcesses: readonly CorridorProcessBinding[];
}>;

export function validateAtSkHealthCoordinationConnectorPack(
  pack: AtSkHealthCoordinationConnectorPack,
): Readonly<{ valid: boolean; issues: readonly string[]; productionEligible: false }> {
  const issues: string[] = [];
  if (pack.packId !== AT_SK_HEALTH_CONNECTOR_PACK_ID) issues.push("AT_SK_HEALTH_PACK_ID_INVALID");
  if (pack.originMarket !== "AT" || pack.connectedCountry !== "SK") issues.push("AT_SK_CORRIDOR_INVALID");
  if (pack.status !== "prepared") issues.push("AT_SK_HEALTH_CONNECTOR_NOT_PREPARED");
  if ((pack.status as string) === "active") issues.push("CONNECTOR_ACTIVE_FORBIDDEN");
  if (pack.activationFromLocaleAllowed !== false) issues.push("LOCALE_ACTIVATION_FORBIDDEN");
  if (pack.activationRequiresVerifiedCaseContext !== true) issues.push("VERIFIED_CASE_CONTEXT_REQUIRED");
  if (pack.topicFamily !== "SOCIAL_SECURITY_COORDINATION") issues.push("UNSUPPORTED_TOPIC_FAMILY");
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
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}

export function buildAtSkHealthCoordinationConnectorPack(): AtSkHealthCoordinationConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: AT_SK_HEALTH_CONNECTOR_PACK_ID,
    originMarket: "AT",
    connectedCountry: "SK",
    status: AT_SK_HEALTH_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "health-insurance-coordination-s1-ehic-s2",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: AT_HEALTH_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "AT" as const,
      trustDomain: "at" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: AT_SK_HEALTH_AT_CLAIM_KEYS.map(atRef),
    euClaimRefs: AT_SK_HEALTH_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: AT_SK_HEALTH_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_HEALTH_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "AT_SK_HEALTH_COORDINATION" as const,
      userMustAct: true as const,
      germanAuthorityMustAct: true as const,
      foreignAuthorityMustAct: true as const,
      institutionExchangeExpected: true as const,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "competentHealthState", "stayOrTreatmentState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: AT_SK_HEALTH_PROCESSES,
  });
}
