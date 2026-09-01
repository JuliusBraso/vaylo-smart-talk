/**
 * CB-0F DE↔SK health-insurance coordination connector (S1 / EHIC / S2).
 * Links EU health core, German health routing and Slovak health adapter.
 * Does not copy EU Articles 17–20 or re-decide Articles 11–13.
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
  DE_HEALTH_PRIMARY_PROCESS_KEY,
  DE_HEALTH_UNITS,
} from "../../de/health-insurance-coordination-routing/de-health-insurance-coordination-routing-pack";
import {
  SK_HEALTH_PRIMARY_PROCESS_KEY,
  SK_HEALTH_UNITS,
} from "../../sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type CuratedCrossBorderConnectorPack,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
  validateCuratedCrossBorderConnectorPack,
} from "../../../source-registry/cross-border-connector-contracts";

export const DE_SK_HEALTH_CONNECTOR_PACK_ID = "de_sk_health_insurance_coordination" as const;
export const DE_SK_HEALTH_CONNECTOR_STATUS = "prepared" as const;

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

export const DE_SK_HEALTH_REUSED_GERMAN_HEALTH_KEYS = Object.freeze([
  "gkv-is-statutory-insurance",
  "pkv-gkv-boundary-only",
  "s1-is-entitlement-certificate",
  "s1-not-same-as-a1",
  "self-employed-not-automatically-pkv",
  "individual-contribution-needs-facts",
  "self-employed-krankengeld-needs-election",
]);

export const DE_SK_HEALTH_EU_CLAIM_KEYS = Object.freeze([
  EU_SHARED_ART17_CLAIM_KEY,
  EU_SHARED_S1_CLAIM_KEY,
  EU_SHARED_EHIC_CLAIM_KEY,
  EU_SHARED_S2_CLAIM_KEY,
  "health-requires-applicable-legislation-result",
  "work-state-not-automatic-health-competence",
  "nationality-not-health-competent-state",
  "user-locale-not-health-competence",
  "eu-residence-is-centre-of-interests",
  "trvaly-pobyt-not-automatic-eu-residence",
  "anmeldung-not-automatic-eu-residence",
  "residence-unclear-fail-closed",
  "posting-not-automatic-s1",
  "posted-stay-uses-ehic-principles",
  "posted-residence-transfer-may-need-s1",
  "s1-issued-not-residence-registration-complete",
  "s1-change-requires-reexamination",
  "s1-not-a1",
  "s1-not-ehic",
  "s1-not-s2",
  "a1-issued-not-automatic-s1",
  "s1-issued-not-a1-unnecessary",
  "ehic-issuer-is-competent-institution",
  "de-insured-sk-s1-ehic-from-de",
  "prc-same-entitlement-as-ehic",
  "ehic-not-planned-treatment",
  "ehic-not-s2",
  "art-20-planned-treatment-needs-authorisation",
  "purpose-of-travel-for-treatment-not-art-19",
  "waiting-list-not-automatic-s2",
  "s2-not-yet-granted-not-entitlement",
  "s2-not-automatic-private-clinic",
  "directive-2011-24-not-regulation-s2",
  "directive-engine-not-implemented",
  "socialna-poistovna-not-slovak-health-insurer",
  "gkv-pkv-classified-by-german-pack",
  "a1-germany-not-automatic-gkv-s1",
  "private-german-insurance-not-automatic-statutory-s1",
  "pkv-unclear-fail-closed",
  "two-health-cards-not-two-applicable-systems",
  "s1-residence-care-not-planned-foreign-treatment",
  "healthcare-in-two-states-not-dual-legislation",
  "annex-iii-de-sk-not-listed",
  "annex-iii-must-revalidate",
  "family-dependency-unclear-fail-closed",
  "spouse-not-automatic-dependent",
  "child-not-automatic-derivative",
  "worker-eligible-not-every-relative",
  "competent-institution-not-residence-institution",
  "private-provider-not-automatic",
  "cash-sickness-not-benefits-in-kind",
  "no-cash-benefit-calculation-engine",
  "pflege-out-of-scope",
  "s3-out-of-scope-worker-v1",
  "uk-post-brexit-out-of-scope",
  "non-eu-bilateral-out-of-scope",
  "old-s1-not-entitlement-forever",
  "art-17-insured-person-includes-self-employed",
  "art-23-applicable-scheme-multiple-categories",
  "art-23-not-employment-or-automatic-gkv",
  "self-employed-not-automatic-s1-ehic-s2",
  "posted-self-employed-stay-uses-ehic-principles",
  "posted-self-employed-residence-transfer-may-need-s1",
  "business-establishment-not-eu-residence",
  "self-employed-health-contribution-out-of-scope",
]);

export const DE_SK_HEALTH_DE_CLAIM_KEYS = Object.freeze([
  ...DE_HEALTH_UNITS.map((unit) => unit.key),
  ...DE_SK_HEALTH_REUSED_GERMAN_HEALTH_KEYS,
]);
export const DE_SK_HEALTH_SK_CLAIM_KEYS = Object.freeze(SK_HEALTH_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly (StableKnowledgeReference | ForeignNationalStableReference)[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`DE_SK_HEALTH_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length),
  });
}

export const DE_SK_HEALTH_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("de-sk-health-route-classify", "DE-SK Krankenbehandlungsweg einordnen", "Wohnsitz, Aufenthalt oder Behandlung berührt Deutschland und die Slowakei", "Zuständigen Staat aus dem anwendbaren Recht verlangen; Locale und Staatsangehörigkeit nicht als Korridor wählen.", [euRef("health-requires-applicable-legislation-result"), euRef("nationality-not-health-competent-state"), euRef("user-locale-not-health-competence"), euRef(EU_SHARED_S1_CLAIM_KEY), euRef(EU_SHARED_EHIC_CLAIM_KEY), euRef(EU_SHARED_S2_CLAIM_KEY), euRef("s1-not-ehic"), euRef("s1-change-requires-reexamination"), deRef("de-health-does-not-copy-eu-law"), skRef("sk-health-does-not-copy-eu-law"), euRef("competent-institution-not-residence-institution"), euRef("s1-not-s2")]),
  binding("de-sk-health-competent-state-gate", "Zuständigen Krankenversicherungsstaat voraussetzen", "Nutzer schildert Wohnen und Arbeiten ohne verifizierten zuständigen Staat", "Artikel 11 nicht neu bewerten; ohne verifizierten Staat fail-closed bleiben.", [euRef("health-requires-applicable-legislation-result"), euRef("work-state-not-automatic-health-competence"), euRef("nationality-not-health-competent-state"), deRef("de-health-gkv-unclear-fail-closed"), euRef("a1-germany-not-automatic-gkv-s1"), euRef("pkv-unclear-fail-closed"), euRef("user-locale-not-health-competence"), euRef("s1-change-requires-reexamination"), deRef("de-health-does-not-copy-eu-law"), euRef("cash-sickness-not-benefits-in-kind"), skRef("sk-health-does-not-copy-eu-law"), euRef("s1-not-a1")]),
  binding("de-sk-health-residence-vs-stay", "Wohnort und vorübergehenden Aufenthalt trennen", "trvalý pobyt, Anmeldung oder Entsendungstage werden als Wohnort angeboten", "Mittelpunkt der Interessen prüfen; melderechtliche Anschrift nicht automatisch setzen.", [euRef("eu-residence-is-centre-of-interests"), euRef("trvaly-pobyt-not-automatic-eu-residence"), euRef("anmeldung-not-automatic-eu-residence"), euRef("residence-unclear-fail-closed"), skRef("sk-health-trvaly-pobyt-not-bydlisko"), euRef(EU_SHARED_S1_CLAIM_KEY), euRef("posting-not-automatic-s1"), euRef("s1-change-requires-reexamination"), deRef("de-health-does-not-copy-eu-law"), skRef("sk-health-residence-investigation"), euRef("posted-stay-uses-ehic-principles"), euRef("residence-unclear-fail-closed")]),
  binding("de-sk-health-de-competent-sk-residence", "DE zuständig und Wohnort SK", "Verifizierter zuständiger Staat DE und tatsächlicher Wohnort SK", "Deutschen GKV-S1-Weg und slowakische Eintragung führen, nicht Artikel 11 neu bewerten.", [euRef(EU_SHARED_ART17_CLAIM_KEY), euRef("health-requires-applicable-legislation-result"), deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-incoming-s1-choose-insurer"), euRef("s1-issued-not-residence-registration-complete"), deRef("gkv-is-statutory-insurance"), euRef("pkv-unclear-fail-closed"), euRef("s1-change-requires-reexamination"), deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-incoming-not-second-insurance"), deRef("de-health-does-not-copy-eu-law"), skRef("sk-health-incoming-not-contribution")]),
  binding("de-sk-health-sk-competent-de-residence", "SK zuständig und Wohnort DE", "Verifizierter zuständiger Staat SK und tatsächlicher Wohnort DE", "Slowakische Krankenversicherung stellt S1 aus; deutsche helfende Kasse registriert.", [euRef(EU_SHARED_ART17_CLAIM_KEY), euRef("health-requires-applicable-legislation-result"), skRef("sk-health-outgoing-s1-from-insurer"), deRef("de-health-incoming-s1-assisting-kk"), euRef("s1-issued-not-residence-registration-complete"), skRef("sk-health-insurer-unknown-fail-closed"), deRef("de-health-assisting-kk-not-competent"), euRef("s1-change-requires-reexamination"), skRef("sk-health-outgoing-s1-from-insurer"), deRef("de-health-incoming-s1-not-contribution"), skRef("sk-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-s1-issuer")]),
  binding("de-sk-health-de-to-sk-s1", "DE nach SK S1-Route", "DE GKV zuständig, Wohnort SK, S1 wird benötigt", "Krankenkasse als Ausstellerin, gewählte slowakische Krankenversicherung als Eintragung.", [deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-incoming-s1-choose-insurer"), euRef(EU_SHARED_S1_CLAIM_KEY), deRef("de-health-channel-fetch-live"), euRef("s1-issued-not-residence-registration-complete"), deRef("de-health-processing-not-universal-deadline"), deRef("de-health-application-not-approval"), euRef("s1-change-requires-reexamination"), deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-eu-card-after-registration"), deRef("de-health-dvka-not-ordinary-s1-issuer"), skRef("sk-health-sp-not-s1-issuer")]),
  binding("de-sk-health-sk-to-de-s1", "SK nach DE S1-Route", "SK Krankenversicherung zuständig, Wohnort DE, S1 wird benötigt", "Slowakische Krankenversicherung als Ausstellerin, deutsche helfende Kasse als Eintragung.", [skRef("sk-health-outgoing-s1-from-insurer"), deRef("de-health-incoming-s1-assisting-kk"), euRef(EU_SHARED_S1_CLAIM_KEY), skRef("sk-health-channel-fetch-live"), euRef("s1-issued-not-residence-registration-complete"), skRef("sk-health-s2-not-vszp-universal-deadline"), skRef("sk-health-application-not-approval"), euRef("s1-change-requires-reexamination"), skRef("sk-health-outgoing-s1-from-insurer"), deRef("de-health-egk-after-registration"), deRef("de-health-assisting-kk-not-competent"), skRef("sk-health-sp-not-s1-issuer")]),
  binding("de-sk-health-s1-unregistered", "S1 ausgestellt, Eintragung offen", "S1 liegt vor, Wohnortträger hat noch nicht eingetragen", "Dokumentbesitz nicht mit abgeschlossener Eintragung gleichsetzen.", [euRef("s1-issued-not-residence-registration-complete"), euRef(EU_SHARED_S1_CLAIM_KEY), skRef("sk-health-incoming-s1-choose-insurer"), deRef("de-health-incoming-s1-assisting-kk"), skRef("sk-health-application-not-approval"), deRef("de-health-application-not-approval"), euRef("s1-not-ehic"), euRef("s1-change-requires-reexamination"), euRef("competent-institution-not-residence-institution"), skRef("sk-health-eu-card-not-ehic"), deRef("de-health-does-not-copy-eu-law"), euRef("old-s1-not-entitlement-forever")]),
  binding("de-sk-health-family-sk-residence", "Familienangehörige mit Wohnort SK", "Zuständig versicherte Person DE, Angehörige wohnen in der Slowakei", "EU-Prinzip verknüpfen und slowakische §-3-Klassifikation führen; Ehe nicht automatisch setzen.", [euRef("family-dependency-unclear-fail-closed"), skRef("sk-health-family-3-2-d"), skRef("sk-health-spouse-not-automatic"), skRef("sk-health-child-not-automatic"), skRef("sk-health-own-activity-overrides"), euRef("worker-eligible-not-every-relative"), euRef("annex-iii-de-sk-not-listed"), euRef("annex-iii-must-revalidate"), skRef("sk-health-incoming-s1-choose-insurer"), euRef("spouse-not-automatic-dependent"), deRef("de-health-family-de-residence-not-sk-rules"), euRef("child-not-automatic-derivative")]),
  binding("de-sk-health-family-de-residence", "Familienangehörige mit Wohnort DE", "Zuständig versicherte Person SK, Angehörige wohnen in Deutschland", "Deutsche Wohnortklassifikation führen; slowakische Abhängigkeitsregeln nicht übertragen.", [euRef("family-dependency-unclear-fail-closed"), deRef("de-health-family-de-residence-not-sk-rules"), deRef("de-health-familienversicherung-not-automatic-eu-family"), euRef("worker-eligible-not-every-relative"), deRef("de-health-incoming-s1-assisting-kk"), euRef("annex-iii-de-sk-not-listed"), euRef("annex-iii-must-revalidate"), euRef("s1-change-requires-reexamination"), deRef("de-health-incoming-s1-assisting-kk"), euRef("spouse-not-automatic-dependent"), skRef("sk-health-family-3-2-d"), euRef("child-not-automatic-derivative")]),
  binding("de-sk-health-de-competent-ehic", "EHIC bei zuständigem Staat DE", "DE GKV zuständig, S1 in SK, vorübergehender Aufenthalt in einem dritten Staat", "EHIC von der deutschen zuständigen Kasse, nicht vom slowakischen Wohnortträger.", [euRef("ehic-issuer-is-competent-institution"), euRef("de-insured-sk-s1-ehic-from-de"), deRef("de-health-ehic-from-competent-gkv"), euRef(EU_SHARED_EHIC_CLAIM_KEY), deRef("de-health-peb-replacement-route"), euRef("prc-same-entitlement-as-ehic"), euRef("ehic-not-s2"), euRef("s1-change-requires-reexamination"), deRef("de-health-ehic-from-competent-gkv"), skRef("sk-health-eu-card-not-ehic"), deRef("de-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-ehic-issuer")]),
  binding("de-sk-health-sk-competent-ehic", "EHIC bei zuständigem Staat SK", "SK Krankenversicherung zuständig, S1 in DE, vorübergehender Aufenthalt", "EHIC von der zuständigen slowakischen Krankenversicherung, nicht von der deutschen helfenden Kasse.", [euRef("ehic-issuer-is-competent-institution"), skRef("sk-health-ehic-from-competent-insurer"), deRef("de-health-assisting-kk-not-competent"), euRef(EU_SHARED_EHIC_CLAIM_KEY), skRef("sk-health-prc-vszp-operational"), euRef("prc-same-entitlement-as-ehic"), euRef("ehic-not-s2"), euRef("s1-change-requires-reexamination"), skRef("sk-health-ehic-from-competent-insurer"), deRef("de-health-assisting-kk-not-competent"), skRef("sk-health-does-not-copy-eu-law"), skRef("sk-health-sp-not-ehic-issuer")]),
  binding("de-sk-health-residence-card-vs-ehic", "Wohnstaatkarte und EHIC trennen", "Zwei Karten werden als Doppelversicherung gelesen", "Wohnstaatnachweis und EHIC sind verschiedene Instrumente, nicht zwei Systeme.", [euRef("two-health-cards-not-two-applicable-systems"), skRef("sk-health-eu-card-not-ehic"), euRef("s1-not-ehic"), euRef(EU_SHARED_EHIC_CLAIM_KEY), skRef("sk-health-eu-card-after-registration"), euRef("healthcare-in-two-states-not-dual-legislation"), euRef("s1-residence-care-not-planned-foreign-treatment"), euRef("s1-change-requires-reexamination"), euRef("competent-institution-not-residence-institution"), skRef("sk-health-incoming-not-second-insurance"), deRef("de-health-does-not-copy-eu-law"), euRef("two-health-cards-not-two-applicable-systems")]),
  binding("de-sk-health-posted-temporary-stay", "Entsendung DE nach SK bei bleibendem Wohnort DE", "A1 bleibt DE, tatsächlicher Wohnort bleibt DE, Aufenthalt SK vorübergehend", "Nicht automatisch S1 öffnen; Aufenthaltsweg einschließlich EHIC prüfen.", [euRef("posting-not-automatic-s1"), euRef("posted-stay-uses-ehic-principles"), euRef("a1-issued-not-automatic-s1"), euRef(EU_SHARED_EHIC_CLAIM_KEY), deRef("de-health-ehic-from-competent-gkv"), euRef("anmeldung-not-automatic-eu-residence"), euRef("residence-unclear-fail-closed"), euRef("s1-change-requires-reexamination"), deRef("de-health-ehic-from-competent-gkv"), euRef("s1-not-a1"), deRef("de-health-does-not-copy-eu-law"), euRef("posting-not-automatic-s1")]),
  binding("de-sk-health-posted-residence-transfer", "Entsendung DE nach SK mit Wohnortverlagerung SK", "A1 bleibt DE, Person begründet tatsächlich Wohnort SK", "Verifizierte DE-Gesetzgebung belassen; S1-Wohnstaatweg eröffnen, A1 nicht durch S1 ersetzen.", [euRef("posted-residence-transfer-may-need-s1"), euRef(EU_SHARED_ART17_CLAIM_KEY), deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-incoming-s1-choose-insurer"), euRef("a1-issued-not-automatic-s1"), euRef("s1-issued-not-a1-unnecessary"), euRef("posting-not-automatic-s1"), euRef("s1-change-requires-reexamination"), deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-incoming-not-second-insurance"), deRef("de-health-does-not-copy-eu-law"), euRef("s1-not-a1")]),
  binding("de-sk-health-de-to-sk-s2", "Geplante Behandlung SK bei zuständigem Staat DE", "DE GKV zuständig, geplante Behandlung in der Slowakei", "Genehmigung bei der zuständigen deutschen Krankenkasse; DVKA nicht als Default.", [euRef("art-20-planned-treatment-needs-authorisation"), deRef("de-health-s2-from-competent-gkv"), deRef("de-health-s2-not-dvka-default"), euRef(EU_SHARED_S2_CLAIM_KEY), deRef("de-health-s2-not-approval"), euRef("waiting-list-not-automatic-s2"), euRef("s2-not-automatic-private-clinic"), euRef("s1-change-requires-reexamination"), deRef("de-health-s2-from-competent-gkv"), euRef("private-provider-not-automatic"), deRef("de-health-does-not-copy-eu-law"), euRef("s2-not-yet-granted-not-entitlement")]),
  binding("de-sk-health-sk-to-de-s2", "Geplante Behandlung DE bei zuständigem Staat SK", "SK Krankenversicherung zuständig, geplante Behandlung in Deutschland", "Antrag an die zuständige slowakische Krankenversicherung nach § 9f.", [euRef("art-20-planned-treatment-needs-authorisation"), skRef("sk-health-s2-9f-apply-to-insurer"), skRef("sk-health-s2-9b"), euRef(EU_SHARED_S2_CLAIM_KEY), skRef("sk-health-s2-15-working-days"), skRef("sk-health-s2-not-vszp-universal-deadline"), euRef("s2-not-automatic-private-clinic"), euRef("s1-change-requires-reexamination"), skRef("sk-health-s2-9f-apply-to-insurer"), euRef("private-provider-not-automatic"), skRef("sk-health-directive-9d-not-s2"), skRef("sk-health-sp-not-s2-institution")]),
  binding("de-sk-health-s2-vs-directive", "S2 und Richtlinie 2011/24 trennen", "Nutzer hat privat gezahlt oder verlangt Richtlinien-Erstattung", "Nicht automatisch als S2 klassifizieren; keine Erstattungsmaschine bauen.", [euRef("directive-2011-24-not-regulation-s2"), euRef("directive-engine-not-implemented"), skRef("sk-health-directive-9d-not-s2"), euRef(EU_SHARED_S2_CLAIM_KEY), euRef("purpose-of-travel-for-treatment-not-art-19"), euRef("ehic-not-planned-treatment"), euRef("s2-not-yet-granted-not-entitlement"), euRef("s1-change-requires-reexamination"), deRef("de-health-s2-from-competent-gkv"), euRef("private-provider-not-automatic"), deRef("de-health-does-not-copy-eu-law"), euRef("s1-not-s2")]),
  binding("de-sk-health-provider-system-gate", "Öffentlichen und privaten Leistungserbringer trennen", "Nutzer nennt Privatklinik oder unklaren Anbieter", "Ohne geklärten Systemstatus keine Kostenzusage.", [euRef("private-provider-not-automatic"), euRef("s2-not-automatic-private-clinic"), deRef("de-health-s2-not-approval"), skRef("sk-health-application-not-approval"), euRef(EU_SHARED_S2_CLAIM_KEY), euRef("waiting-list-not-automatic-s2"), euRef("ehic-not-planned-treatment"), euRef("s1-change-requires-reexamination"), deRef("de-health-s2-from-competent-gkv"), euRef("private-provider-not-automatic"), deRef("de-health-does-not-copy-eu-law"), euRef("s2-not-yet-granted-not-entitlement")]),
  binding("de-sk-health-competent-state-change", "Wechsel des zuständigen Staats DE nach SK", "Zuvor DE zuständig mit S1 SK, anwendbares Recht wechselt auf SK", "Altes S1 überprüfen; slowakische nationale Versicherungslage neu feststellen.", [euRef("s1-change-requires-reexamination"), euRef("old-s1-not-entitlement-forever"), deRef("de-health-s1-change-cancellation"), skRef("sk-health-change-cancellation"), euRef("health-requires-applicable-legislation-result"), skRef("sk-health-public-insurer-category"), deRef("de-health-physical-s1-not-eternal"), euRef("s1-change-requires-reexamination"), skRef("sk-health-public-insurer-category"), skRef("sk-health-physical-not-eternal"), deRef("de-health-does-not-copy-eu-law"), euRef("old-s1-not-entitlement-forever")]),
  binding("de-sk-health-residence-change", "Wohnortwechsel SK nach DE", "DE zuständig, S1 SK, tatsächlicher Wohnort wechselt nach DE", "Artikel-17-Eintragungsgrundlage neu prüfen; Anmeldung allein reicht nicht.", [euRef("s1-change-requires-reexamination"), euRef("anmeldung-not-automatic-eu-residence"), euRef("eu-residence-is-centre-of-interests"), deRef("de-health-s1-change-cancellation"), skRef("sk-health-change-cancellation"), euRef("residence-unclear-fail-closed"), deRef("de-health-physical-s1-not-eternal"), euRef("s1-change-requires-reexamination"), deRef("de-health-gkv-krankenkasse-issues-s1"), skRef("sk-health-physical-not-eternal"), deRef("de-health-does-not-copy-eu-law"), euRef("old-s1-not-entitlement-forever")]),
  binding("de-sk-health-document-status-change", "Dokumentstatus und Sachverhaltsänderung", "Altes S1, EHIC oder S2 wird vorgelegt, Versicherung oder Familie hat sich geändert", "Körperliches Dokument nicht als aktuellen Anspruch behandeln; Aussteller live führen.", [euRef("old-s1-not-entitlement-forever"), deRef("de-health-physical-s1-not-eternal"), skRef("sk-health-physical-not-eternal"), euRef("s1-change-requires-reexamination"), deRef("de-health-channel-fetch-live"), skRef("sk-health-channel-fetch-live"), euRef("s1-not-ehic"), euRef("s1-change-requires-reexamination"), euRef("competent-institution-not-residence-institution"), euRef("cash-sickness-not-benefits-in-kind"), deRef("de-health-does-not-copy-eu-law"), euRef("pflege-out-of-scope")]),
  binding("de-sk-health-self-employed-insurance-gate", "Selbständigen-Versicherungssystem vor gesetzlichem S1 prüfen", "Selbständige Person, verifizierter zuständiger Staat DE, GKV oder PKV offen oder privat", "GKV nicht aus Selbständigkeit, A1, Gewerbe oder Adresse ableiten; ohne bestätigte gesetzliche Versicherung fail-closed.", [euRef("art-17-insured-person-includes-self-employed"), deRef("self-employed-not-automatically-pkv"), deRef("de-health-gkv-unclear-fail-closed"), deRef("de-health-does-not-copy-gkv-pkv-merits"), deRef("de-health-pkv-not-automatic-statutory-s1"), euRef("a1-germany-not-automatic-gkv-s1"), euRef("private-german-insurance-not-automatic-statutory-s1"), euRef("s1-change-requires-reexamination"), deRef("de-health-gkv-krankenkasse-issues-s1"), deRef("gkv-is-statutory-insurance"), deRef("de-health-does-not-copy-eu-law"), euRef("pkv-unclear-fail-closed")]),
  binding("de-sk-health-mixed-activity-delegate", "Gemischte Tätigkeit an anwendbares Recht übergeben", "Gleichzeitige Beschäftigung und Selbständigkeit in Deutschland und der Slowakei", "Artikel 13 nicht im Gesundheitskorridor neu entscheiden; verifizierten zuständigen Staat verlangen.", [euRef("health-requires-applicable-legislation-result"), euRef("work-state-not-automatic-health-competence"), euRef("a1-issued-not-automatic-s1"), euRef("healthcare-in-two-states-not-dual-legislation"), euRef(EU_SHARED_ART17_CLAIM_KEY), euRef("pkv-unclear-fail-closed"), euRef("user-locale-not-health-competence"), euRef("s1-change-requires-reexamination"), deRef("de-health-does-not-copy-eu-law"), skRef("sk-health-does-not-copy-eu-law"), euRef("competent-institution-not-residence-institution"), euRef("s1-not-a1")]),
  binding("de-sk-health-posted-sk-to-de-temporary-stay", "Selbständige Entsendung SK nach DE bei bleibendem Wohnort SK", "A1 bleibt SK, tatsächlicher Wohnort bleibt SK, Aufenthalt DE vorübergehend", "Nicht automatisch S1 öffnen; Aufenthaltsweg einschließlich EHIC prüfen.", [euRef("posting-not-automatic-s1"), euRef("posted-self-employed-stay-uses-ehic-principles"), euRef("a1-issued-not-automatic-s1"), euRef(EU_SHARED_EHIC_CLAIM_KEY), skRef("sk-health-ehic-from-competent-insurer"), euRef("anmeldung-not-automatic-eu-residence"), euRef("residence-unclear-fail-closed"), euRef("s1-change-requires-reexamination"), skRef("sk-health-ehic-from-competent-insurer"), euRef("s1-not-a1"), skRef("sk-health-does-not-copy-eu-law"), euRef("posting-not-automatic-s1")]),
  binding("de-sk-health-posted-sk-to-de-residence-transfer", "Selbständige Entsendung SK nach DE mit Wohnortverlagerung DE", "A1 bleibt SK, Person begründet tatsächlich Wohnort DE", "Verifizierte SK-Gesetzgebung belassen; S1-Wohnstaatweg eröffnen, A1 nicht durch S1 ersetzen.", [euRef("posted-self-employed-residence-transfer-may-need-s1"), euRef(EU_SHARED_ART17_CLAIM_KEY), skRef("sk-health-outgoing-s1-from-insurer"), deRef("de-health-incoming-s1-assisting-kk"), euRef("a1-issued-not-automatic-s1"), euRef("s1-issued-not-a1-unnecessary"), euRef("posting-not-automatic-s1"), euRef("s1-change-requires-reexamination"), skRef("sk-health-outgoing-s1-from-insurer"), deRef("de-health-incoming-s1-not-contribution"), skRef("sk-health-does-not-copy-eu-law"), euRef("s1-not-a1")]),
  binding("de-sk-health-activity-status-change", "Wechsel Beschäftigung Selbständigkeit oder Betriebsschließung", "Tätigkeit wechselt oder Gewerbe bzw. živnosť endet, S1 oder EHIC ist aktiv", "Anwendbares Recht und Krankenversicherung neu prüfen; altes S1 nicht als fortgeltend behandeln.", [euRef("s1-change-requires-reexamination"), euRef("health-requires-applicable-legislation-result"), euRef("old-s1-not-entitlement-forever"), deRef("de-health-s1-change-cancellation"), skRef("sk-health-change-cancellation"), deRef("de-health-gkv-unclear-fail-closed"), deRef("de-health-physical-s1-not-eternal"), euRef("s1-change-requires-reexamination"), skRef("sk-health-public-insurer-category"), skRef("sk-health-physical-not-eternal"), deRef("de-health-does-not-copy-eu-law"), euRef("old-s1-not-entitlement-forever")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const DE_SK_HEALTH_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "de-gkv-res-sk", label: "Verifiziert DE zuständig, GKV, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["de-health-gkv-krankenkasse-issues-s1", "sk-health-incoming-s1-choose-insurer"], requiredProcessKeys: ["de-sk-health-de-to-sk-s1"] },
  { id: "sk-public-res-de", label: "Verifiziert SK zuständig, Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["sk-health-outgoing-s1-from-insurer", "de-health-incoming-s1-assisting-kk"], requiredProcessKeys: ["de-sk-health-sk-to-de-s1"] },
  { id: "slovak-nationality-de-competent", label: "Slowakische Staatsangehörigkeit, Wohnort DE, DE zuständig", coverage: "COVERED", requiredClaimKeys: ["nationality-not-health-competent-state"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "german-nationality-sk-competent", label: "Deutsche Staatsangehörigkeit, Wohnort SK, SK zuständig", coverage: "COVERED", requiredClaimKeys: ["nationality-not-health-competent-state"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "locale-sk-factual-de-cz", label: "Locale SK, Sachverhalt DE-CZ", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-health-competence"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "locale-hu-factual-de-sk", label: "Locale HU, echter DE-SK-Fall", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-health-competence"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "de-competent-gkv-pkv-unclear", label: "DE zuständig, GKV/PKV unklar", coverage: "COVERED", requiredClaimKeys: ["de-health-gkv-unclear-fail-closed", "pkv-unclear-fail-closed"], requiredProcessKeys: ["de-sk-health-competent-state-gate"] },
  { id: "de-competent-confirmed-gkv", label: "DE zuständig, GKV bestätigt", coverage: "COVERED", requiredClaimKeys: ["gkv-is-statutory-insurance", "de-health-gkv-krankenkasse-issues-s1"], requiredProcessKeys: ["de-sk-health-de-competent-sk-residence"] },
  { id: "sk-competent-insurer-unknown", label: "SK zuständig, Versicherer unbekannt", coverage: "COVERED", requiredClaimKeys: ["sk-health-insurer-unknown-fail-closed"], requiredProcessKeys: ["de-sk-health-sk-competent-de-residence"] },
  { id: "de-gkv-issues-s1-sk-resident", label: "Deutsche GKV stellt S1 für SK-Wohnort aus", coverage: "COVERED", requiredClaimKeys: ["de-health-gkv-krankenkasse-issues-s1"], requiredProcessKeys: ["de-sk-health-de-to-sk-s1"] },
  { id: "incoming-de-s1-registered-sk-insurer", label: "Deutsches S1 bei gewählter SK-Krankenversicherung eingetragen", coverage: "COVERED", requiredClaimKeys: ["sk-health-incoming-s1-choose-insurer"], requiredProcessKeys: ["de-sk-health-de-to-sk-s1"] },
  { id: "s1-issued-not-registered-sk", label: "S1 ausgestellt, in SK noch nicht eingetragen", coverage: "COVERED", requiredClaimKeys: ["s1-issued-not-residence-registration-complete"], requiredProcessKeys: ["de-sk-health-s1-unregistered"] },
  { id: "sk-insurer-issues-s1-de-resident", label: "SK-Krankenversicherung stellt S1 für DE-Wohnort aus", coverage: "COVERED", requiredClaimKeys: ["sk-health-outgoing-s1-from-insurer"], requiredProcessKeys: ["de-sk-health-sk-to-de-s1"] },
  { id: "incoming-sk-s1-registered-de", label: "SK-S1 in Deutschland eingetragen", coverage: "COVERED", requiredClaimKeys: ["de-health-incoming-s1-assisting-kk"], requiredProcessKeys: ["de-sk-health-sk-to-de-s1"] },
  { id: "assisting-kk-mistaken-competent", label: "Helfende deutsche Kasse für zuständigen Träger gehalten", coverage: "COVERED", requiredClaimKeys: ["de-health-assisting-kk-not-competent"], requiredProcessKeys: ["de-sk-health-sk-to-de-s1"] },
  { id: "sk-residence-insurer-mistaken-competent", label: "Slowakischer Wohnortträger für zuständigen Träger gehalten", coverage: "COVERED", requiredClaimKeys: ["sk-health-incoming-not-second-insurance", "competent-institution-not-residence-institution"], requiredProcessKeys: ["de-sk-health-de-to-sk-s1"] },
  { id: "sp-mistaken-s1", label: "Sociálna poisťovňa fälschlich für S1 genutzt", coverage: "COVERED", requiredClaimKeys: ["sk-health-sp-not-s1-issuer", "socialna-poistovna-not-slovak-health-insurer"], requiredProcessKeys: ["de-sk-health-de-to-sk-s1"] },
  { id: "sp-mistaken-ehic", label: "Sociálna poisťovňa fälschlich für EHIC genutzt", coverage: "COVERED", requiredClaimKeys: ["sk-health-sp-not-ehic-issuer"], requiredProcessKeys: ["de-sk-health-sk-competent-ehic"] },
  { id: "trvaly-pobyt-real-residence-de", label: "Trvalý pobyt SK, tatsächlicher Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["trvaly-pobyt-not-automatic-eu-residence", "sk-health-trvaly-pobyt-not-bydlisko"], requiredProcessKeys: ["de-sk-health-residence-vs-stay"] },
  { id: "anmeldung-real-residence-sk", label: "Anmeldung DE, tatsächlicher Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["anmeldung-not-automatic-eu-residence"], requiredProcessKeys: ["de-sk-health-residence-vs-stay"] },
  { id: "residence-unclear", label: "Wohnort unklar", coverage: "COVERED", requiredClaimKeys: ["residence-unclear-fail-closed"], requiredProcessKeys: ["de-sk-health-residence-vs-stay"] },
  { id: "de-s1-sk-ordinary-doctor", label: "DE zuständig, S1 SK, gewöhnlicher Arzt in SK", coverage: "COVERED", requiredClaimKeys: ["s1-residence-care-not-planned-foreign-treatment"], requiredProcessKeys: ["de-sk-health-de-competent-sk-residence"] },
  { id: "de-s1-sk-treatment-in-de", label: "DE zuständig, S1 SK, Behandlung in DE", coverage: "COVERED", requiredClaimKeys: ["healthcare-in-two-states-not-dual-legislation"], requiredProcessKeys: ["de-sk-health-de-competent-sk-residence"] },
  { id: "sk-s1-de-treatment-in-de", label: "SK zuständig, S1 DE, Behandlung in DE", coverage: "COVERED", requiredClaimKeys: ["de-health-egk-after-registration"], requiredProcessKeys: ["de-sk-health-sk-competent-de-residence"] },
  { id: "two-cards-double-insurance", label: "Zwei Karten als Doppelversicherung gelesen", coverage: "COVERED", requiredClaimKeys: ["two-health-cards-not-two-applicable-systems"], requiredProcessKeys: ["de-sk-health-residence-card-vs-ehic"] },
  { id: "de-s1-sk-holiday-cz", label: "DE zuständig, S1 SK, Urlaub CZ", coverage: "COVERED", requiredClaimKeys: ["de-insured-sk-s1-ehic-from-de", "de-health-ehic-from-competent-gkv"], requiredProcessKeys: ["de-sk-health-de-competent-ehic"] },
  { id: "asks-sk-residence-insurer-for-ehic", label: "Verlangt EHIC vom SK-Wohnortträger obwohl DE zuständig", coverage: "COVERED", requiredClaimKeys: ["ehic-issuer-is-competent-institution"], requiredProcessKeys: ["de-sk-health-de-competent-ehic"] },
  { id: "sk-s1-de-holiday-at", label: "SK zuständig, S1 DE, Urlaub AT", coverage: "COVERED", requiredClaimKeys: ["sk-health-ehic-from-competent-insurer"], requiredProcessKeys: ["de-sk-health-sk-competent-ehic"] },
  { id: "asks-de-residence-insurer-for-ehic", label: "Verlangt EHIC von deutscher Wohnortkasse obwohl SK zuständig", coverage: "COVERED", requiredClaimKeys: ["de-health-assisting-kk-not-competent", "ehic-issuer-is-competent-institution"], requiredProcessKeys: ["de-sk-health-sk-competent-ehic"] },
  { id: "ehic-lost-prc", label: "EHIC verloren, PEB/náhradný certifikát nötig", coverage: "COVERED", requiredClaimKeys: ["prc-same-entitlement-as-ehic", "de-health-peb-replacement-route"], requiredProcessKeys: ["de-sk-health-de-competent-ehic"] },
  { id: "family-lives-sk-worker-de", label: "Familienangehörige wohnen SK, Beschäftigte DE zuständig", coverage: "COVERED", requiredClaimKeys: ["sk-health-family-3-2-d", "family-dependency-unclear-fail-closed"], requiredProcessKeys: ["de-sk-health-family-sk-residence"] },
  { id: "spouse-own-sk-employment", label: "Ehegatte hat eigene SK-Beschäftigung", coverage: "COVERED", requiredClaimKeys: ["sk-health-own-activity-overrides", "spouse-not-automatic-dependent"], requiredProcessKeys: ["de-sk-health-family-sk-residence"] },
  { id: "child-dependency-unclear", label: "Abhängigkeitsstatus des Kindes unklar", coverage: "COVERED", requiredClaimKeys: ["child-not-automatic-derivative", "sk-health-child-not-automatic"], requiredProcessKeys: ["de-sk-health-family-sk-residence"] },
  { id: "family-lives-de-worker-sk", label: "Familienangehörige wohnen DE, Beschäftigte SK zuständig", coverage: "COVERED", requiredClaimKeys: ["de-health-family-de-residence-not-sk-rules"], requiredProcessKeys: ["de-sk-health-family-de-residence"] },
  { id: "posted-de-sk-residence-remains-de", label: "Entsendung DE nach SK, Wohnort bleibt DE", coverage: "COVERED", requiredClaimKeys: ["posting-not-automatic-s1", "posted-stay-uses-ehic-principles"], requiredProcessKeys: ["de-sk-health-posted-temporary-stay"] },
  { id: "posted-de-sk-residence-transferred", label: "Entsendung DE nach SK, Wohnort tatsächlich SK", coverage: "COVERED", requiredClaimKeys: ["posted-residence-transfer-may-need-s1"], requiredProcessKeys: ["de-sk-health-posted-residence-transfer"] },
  { id: "a1-exists-s1-not-issued", label: "A1 vorhanden, S1 nicht ausgestellt", coverage: "COVERED", requiredClaimKeys: ["a1-issued-not-automatic-s1"], requiredProcessKeys: ["de-sk-health-posted-temporary-stay"] },
  { id: "s1-exists-assumes-a1-unnecessary", label: "S1 vorhanden, Nutzer hält A1 für entbehrlich", coverage: "COVERED", requiredClaimKeys: ["s1-issued-not-a1-unnecessary"], requiredProcessKeys: ["de-sk-health-posted-residence-transfer"] },
  { id: "de-insured-planned-sk", label: "DE versichert, geplante Behandlung SK", coverage: "COVERED", requiredClaimKeys: ["de-health-s2-from-competent-gkv", "de-health-s2-not-dvka-default"], requiredProcessKeys: ["de-sk-health-de-to-sk-s2"] },
  { id: "sk-insured-planned-de", label: "SK versichert, geplante Behandlung DE", coverage: "COVERED", requiredClaimKeys: ["sk-health-s2-9f-apply-to-insurer"], requiredProcessKeys: ["de-sk-health-sk-to-de-s2"] },
  { id: "s2-requested-not-approved", label: "S2 beantragt, nicht genehmigt", coverage: "COVERED", requiredClaimKeys: ["s2-not-yet-granted-not-entitlement", "de-health-s2-not-approval"], requiredProcessKeys: ["de-sk-health-de-to-sk-s2"] },
  { id: "travels-for-surgery-ehic-only", label: "Reist eigens zur Operation nur mit EHIC", coverage: "COVERED", requiredClaimKeys: ["ehic-not-planned-treatment", "purpose-of-travel-for-treatment-not-art-19"], requiredProcessKeys: ["de-sk-health-s2-vs-directive"] },
  { id: "uses-s1-as-planned-authorization", label: "Nutzt S1 als Genehmigung geplanter Behandlung", coverage: "COVERED", requiredClaimKeys: ["s1-not-s2", "s1-residence-care-not-planned-foreign-treatment"], requiredProcessKeys: ["de-sk-health-s2-vs-directive"] },
  { id: "private-provider", label: "Privater Leistungserbringer", coverage: "COVERED", requiredClaimKeys: ["private-provider-not-automatic", "s2-not-automatic-private-clinic"], requiredProcessKeys: ["de-sk-health-provider-system-gate"] },
  { id: "expects-s2-all-free", label: "Erwartet, dass S2 alles kostenfrei macht", coverage: "COVERED", requiredClaimKeys: ["s2-not-yet-granted-not-entitlement"], requiredProcessKeys: ["de-sk-health-provider-system-gate"] },
  { id: "asks-directive-reimbursement", label: "Verlangt Erstattung nach Richtlinie 2011/24", coverage: "COVERED", requiredClaimKeys: ["directive-2011-24-not-regulation-s2", "directive-engine-not-implemented"], requiredProcessKeys: ["de-sk-health-s2-vs-directive"] },
  { id: "paid-privately-before-authorization", label: "Privat gezahlt vor Genehmigung", coverage: "COVERED", requiredClaimKeys: ["sk-health-directive-9d-not-s2"], requiredProcessKeys: ["de-sk-health-s2-vs-directive"] },
  { id: "competent-state-changes-de-to-sk", label: "Zuständiger Staat wechselt DE nach SK", coverage: "COVERED", requiredClaimKeys: ["s1-change-requires-reexamination", "old-s1-not-entitlement-forever"], requiredProcessKeys: ["de-sk-health-competent-state-change"] },
  { id: "residence-changes-sk-to-de", label: "Wohnort wechselt SK nach DE", coverage: "COVERED", requiredClaimKeys: ["anmeldung-not-automatic-eu-residence"], requiredProcessKeys: ["de-sk-health-residence-change"] },
  { id: "insurance-terminates-physical-s1-held", label: "Versicherung endet, körperliches S1 noch vorhanden", coverage: "COVERED", requiredClaimKeys: ["old-s1-not-entitlement-forever", "de-health-physical-s1-not-eternal"], requiredProcessKeys: ["de-sk-health-document-status-change"] },
  { id: "family-gains-own-employment", label: "Familienangehörige nimmt eigene Beschäftigung auf", coverage: "COVERED", requiredClaimKeys: ["sk-health-own-activity-overrides"], requiredProcessKeys: ["de-sk-health-family-sk-residence"] },
  { id: "asks-krankengeld-amount", label: "Verlangt Krankengeldbetrag", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["no-cash-benefit-calculation-engine", "cash-sickness-not-benefits-in-kind"], requiredProcessKeys: ["de-sk-health-document-status-change"] },
  { id: "asks-pflegegeld", label: "Verlangt Pflegegeld oder Pflegeleistung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["pflege-out-of-scope"], requiredProcessKeys: ["de-sk-health-document-status-change"] },
  { id: "retired-frontier-s3", label: "Ruhestands-Grenzgänger S3", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["s3-out-of-scope-worker-v1"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "uk-specific", label: "UK-spezifischer Fall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["uk-post-brexit-out-of-scope"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "non-eu-bilateral", label: "Nichtunionsrechtliches bilaterales Abkommen", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "se-de-gkv-res-sk", label: "DE selbständig, DE zuständig, GKV, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["art-17-insured-person-includes-self-employed", "de-health-gkv-krankenkasse-issues-s1", "sk-health-incoming-s1-choose-insurer"], requiredProcessKeys: ["de-sk-health-de-to-sk-s1"] },
  { id: "se-de-pkv-res-sk", label: "DE selbständig, DE zuständig, PKV, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["de-health-pkv-not-automatic-statutory-s1", "private-german-insurance-not-automatic-statutory-s1"], requiredProcessKeys: ["de-sk-health-self-employed-insurance-gate"] },
  { id: "se-de-insurance-unknown-res-sk", label: "DE selbständig, DE zuständig, Versicherung unbekannt, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["de-health-gkv-unclear-fail-closed", "pkv-unclear-fail-closed"], requiredProcessKeys: ["de-sk-health-self-employed-insurance-gate"] },
  { id: "se-sk-szco-public-res-de", label: "SK SZČO, SK zuständig, öffentliche Kasse, Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["sk-health-employee-or-szco-may-request-s1", "sk-health-szco-place-of-activity-vszp-operational", "sk-health-outgoing-s1-from-insurer", "de-health-incoming-s1-assisting-kk"], requiredProcessKeys: ["de-sk-health-sk-to-de-s1"] },
  { id: "se-sk-szco-insurer-unknown-res-de", label: "SK SZČO, Versicherer unbekannt, Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["sk-health-insurer-unknown-fail-closed", "sk-health-szco-or-zivnost-not-insurer-identity"], requiredProcessKeys: ["de-sk-health-sk-competent-de-residence"] },
  { id: "se-sk-szco-sp-mistaken-s1-issuer", label: "SK SZČO, Sociálna poisťovňa fälschlich als S1-Ausstellerin", coverage: "COVERED", requiredClaimKeys: ["sk-health-sp-not-s1-issuer", "sk-health-szco-or-zivnost-not-insurer-identity"], requiredProcessKeys: ["de-sk-health-sk-to-de-s1"] },
  { id: "se-business-registered-de-residence-sk", label: "Betrieb DE registriert, tatsächlicher Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["business-establishment-not-eu-residence", "eu-residence-is-centre-of-interests"], requiredProcessKeys: ["de-sk-health-residence-vs-stay"] },
  { id: "se-zivnost-sk-residence-de", label: "Živnosť SK, tatsächlicher Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["business-establishment-not-eu-residence", "sk-health-szco-or-zivnost-not-insurer-identity"], requiredProcessKeys: ["de-sk-health-residence-vs-stay"] },
  { id: "se-multi-state-unresolved", label: "Selbständig DE und SK, zuständiger Staat ungelöst", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "work-state-not-automatic-health-competence"], requiredProcessKeys: ["de-sk-health-competent-state-gate"] },
  { id: "se-multi-state-verified-de", label: "Selbständig DE und SK, zuständiger Staat DE verifiziert", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "de-health-gkv-krankenkasse-issues-s1"], requiredProcessKeys: ["de-sk-health-de-competent-sk-residence"] },
  { id: "se-multi-state-verified-sk", label: "Selbständig DE und SK, zuständiger Staat SK verifiziert", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "sk-health-outgoing-s1-from-insurer"], requiredProcessKeys: ["de-sk-health-sk-competent-de-residence"] },
  { id: "mixed-employed-de-szco-sk-verified-de", label: "Beschäftigung DE plus SZČO SK, DE zuständig verifiziert", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "de-health-gkv-krankenkasse-issues-s1", "sk-health-incoming-s1-choose-insurer"], requiredProcessKeys: ["de-sk-health-mixed-activity-delegate"] },
  { id: "mixed-employed-sk-se-de-verified-sk", label: "Beschäftigung SK plus Selbständigkeit DE, SK zuständig verifiziert", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "sk-health-outgoing-s1-from-insurer", "de-health-incoming-s1-assisting-kk"], requiredProcessKeys: ["de-sk-health-mixed-activity-delegate"] },
  { id: "mixed-connector-tries-art-13", label: "Gemischte Tätigkeit, Korridor versucht Artikel 13 neu zu entscheiden", coverage: "COVERED", requiredClaimKeys: ["health-requires-applicable-legislation-result", "work-state-not-automatic-health-competence"], requiredProcessKeys: ["de-sk-health-mixed-activity-delegate"] },
  { id: "se-posted-de-sk-residence-de", label: "DE selbständig entsandt SK, Wohnort bleibt DE", coverage: "COVERED", requiredClaimKeys: ["posted-self-employed-stay-uses-ehic-principles", "posting-not-automatic-s1"], requiredProcessKeys: ["de-sk-health-posted-temporary-stay"] },
  { id: "se-posted-de-sk-residence-transferred", label: "DE selbständig entsandt SK, tatsächlicher Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["posted-self-employed-residence-transfer-may-need-s1", "posted-residence-transfer-may-need-s1"], requiredProcessKeys: ["de-sk-health-posted-residence-transfer"] },
  { id: "se-posted-sk-de-residence-sk", label: "SK selbständig vorübergehend DE, Wohnort bleibt SK", coverage: "COVERED", requiredClaimKeys: ["posted-self-employed-stay-uses-ehic-principles", "posting-not-automatic-s1"], requiredProcessKeys: ["de-sk-health-posted-sk-to-de-temporary-stay"] },
  { id: "se-posted-sk-de-residence-transferred", label: "SK selbständig in DE, tatsächlicher Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["posted-self-employed-residence-transfer-may-need-s1"], requiredProcessKeys: ["de-sk-health-posted-sk-to-de-residence-transfer"] },
  { id: "se-de-gkv-s1-sk-ehic-cz", label: "DE GKV selbständig, S1 SK, EHIC für CZ", coverage: "COVERED", requiredClaimKeys: ["de-insured-sk-s1-ehic-from-de", "de-health-ehic-from-competent-gkv"], requiredProcessKeys: ["de-sk-health-de-competent-ehic"] },
  { id: "se-sk-public-s1-de-ehic-at", label: "SK öffentlich versicherte SZČO, S1 DE, EHIC für AT", coverage: "COVERED", requiredClaimKeys: ["sk-health-ehic-from-competent-insurer", "ehic-issuer-is-competent-institution"], requiredProcessKeys: ["de-sk-health-sk-competent-ehic"] },
  { id: "se-de-gkv-planned-sk", label: "DE GKV selbständig, geplante Behandlung SK", coverage: "COVERED", requiredClaimKeys: ["de-health-s2-from-competent-gkv", "art-20-planned-treatment-needs-authorisation"], requiredProcessKeys: ["de-sk-health-de-to-sk-s2"] },
  { id: "se-sk-public-planned-de", label: "SK öffentlich versicherte SZČO, geplante Behandlung DE", coverage: "COVERED", requiredClaimKeys: ["sk-health-s2-9f-apply-to-insurer", "art-20-planned-treatment-needs-authorisation"], requiredProcessKeys: ["de-sk-health-sk-to-de-s2"] },
  { id: "se-a1-assumes-s1", label: "Selbständig hat A1 und hält S1 für automatisch", coverage: "COVERED", requiredClaimKeys: ["a1-issued-not-automatic-s1", "self-employed-not-automatic-s1-ehic-s2"], requiredProcessKeys: ["de-sk-health-posted-temporary-stay"] },
  { id: "se-s1-assumes-a1-unnecessary", label: "Selbständig hat S1 und hält A1 für entbehrlich", coverage: "COVERED", requiredClaimKeys: ["s1-issued-not-a1-unnecessary", "s1-not-a1"], requiredProcessKeys: ["de-sk-health-posted-residence-transfer"] },
  { id: "employee-to-se-s1-active", label: "Beschäftigte wird selbständig, S1 aktiv", coverage: "COVERED", requiredClaimKeys: ["s1-change-requires-reexamination", "old-s1-not-entitlement-forever"], requiredProcessKeys: ["de-sk-health-activity-status-change"] },
  { id: "se-to-employee-s1-active", label: "Selbständige wird beschäftigt, S1 aktiv", coverage: "COVERED", requiredClaimKeys: ["s1-change-requires-reexamination", "health-requires-applicable-legislation-result"], requiredProcessKeys: ["de-sk-health-activity-status-change"] },
  { id: "business-closes-physical-s1-held", label: "Betrieb schließt, körperliches S1 bleibt", coverage: "COVERED", requiredClaimKeys: ["old-s1-not-entitlement-forever", "de-health-physical-s1-not-eternal"], requiredProcessKeys: ["de-sk-health-activity-status-change"] },
  { id: "spouse-own-self-employment-assumed-derivative", label: "Ehegatte selbständig, abgeleiteter Status unterstellt", coverage: "COVERED", requiredClaimKeys: ["sk-health-own-activity-overrides", "spouse-not-automatic-dependent"], requiredProcessKeys: ["de-sk-health-family-sk-residence"] },
  { id: "locale-sk-se-de-cz", label: "Locale SK, DE selbständig, Sachverhalt DE-CZ", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-health-competence"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "nationality-sk-de-competent-se", label: "Staatsangehörigkeit SK, DE zuständig, selbständig", coverage: "COVERED", requiredClaimKeys: ["nationality-not-health-competent-state"], requiredProcessKeys: ["de-sk-health-route-classify"] },
  { id: "asks-self-employed-contribution", label: "Verlangt genauen Selbständigen-Krankenbeitrag", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["self-employed-health-contribution-out-of-scope", "individual-contribution-needs-facts"], requiredProcessKeys: ["de-sk-health-self-employed-insurance-gate"] },
  { id: "asks-self-employed-krankengeld", label: "Verlangt Krankengeld für Selbständige", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["no-cash-benefit-calculation-engine", "self-employed-krankengeld-needs-election"], requiredProcessKeys: ["de-sk-health-document-status-change"] },
]);

export function evaluateDeSkHealthProcessCompleteness() {
  const processKeys = new Set(DE_SK_HEALTH_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...DE_SK_HEALTH_EU_CLAIM_KEYS,
    ...DE_SK_HEALTH_DE_CLAIM_KEYS,
    ...DE_SK_HEALTH_SK_CLAIM_KEYS,
  ]);
  const incomplete = DE_SK_HEALTH_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = DE_SK_HEALTH_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = DE_SK_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = DE_SK_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = DE_SK_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
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
    processCount: DE_SK_HEALTH_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: DE_SK_HEALTH_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
    outOfScopeMissing,
  });
}

export const DE_SK_HEALTH_ACTIVITY_TYPES = Object.freeze([
  "EMPLOYED",
  "SELF_EMPLOYED",
  "MIXED_EMPLOYED_SELF_EMPLOYED",
  "ACTIVITY_TYPE_CHANGED",
  "UNKNOWN",
] as const);

export const DE_SK_HEALTH_SELF_EMPLOYED_SCENARIO_IDS = Object.freeze([
  "se-de-gkv-res-sk",
  "se-de-pkv-res-sk",
  "se-de-insurance-unknown-res-sk",
  "se-sk-szco-public-res-de",
  "se-sk-szco-insurer-unknown-res-de",
  "se-sk-szco-sp-mistaken-s1-issuer",
  "se-business-registered-de-residence-sk",
  "se-zivnost-sk-residence-de",
  "se-multi-state-unresolved",
  "se-multi-state-verified-de",
  "se-multi-state-verified-sk",
  "mixed-employed-de-szco-sk-verified-de",
  "mixed-employed-sk-se-de-verified-sk",
  "mixed-connector-tries-art-13",
  "se-posted-de-sk-residence-de",
  "se-posted-de-sk-residence-transferred",
  "se-posted-sk-de-residence-sk",
  "se-posted-sk-de-residence-transferred",
  "se-de-gkv-s1-sk-ehic-cz",
  "se-sk-public-s1-de-ehic-at",
  "se-de-gkv-planned-sk",
  "se-sk-public-planned-de",
  "se-a1-assumes-s1",
  "se-s1-assumes-a1-unnecessary",
  "employee-to-se-s1-active",
  "se-to-employee-s1-active",
  "business-closes-physical-s1-held",
  "spouse-own-self-employment-assumed-derivative",
  "locale-sk-se-de-cz",
  "nationality-sk-de-competent-se",
  "asks-self-employed-contribution",
  "asks-self-employed-krankengeld",
] as const);

export const DE_SK_HEALTH_SELF_EMPLOYED_SCENARIOS = Object.freeze(
  DE_SK_HEALTH_SELF_EMPLOYED_SCENARIO_IDS.map((id) => {
    const scenario = DE_SK_HEALTH_SCENARIOS.find((item) => item.id === id);
    if (!scenario) throw new Error(`DE_SK_HEALTH_SELF_EMPLOYED_SCENARIO_MISSING:${id}`);
    return scenario;
  }),
);

export const DE_SK_HEALTH_SELF_EMPLOYED_NEGATIVE_CONTROLS = Object.freeze([
  "art-17-insured-person-includes-self-employed",
  "self-employed-not-automatic-s1-ehic-s2",
  "self-employed-not-automatically-pkv",
  "de-health-gkv-unclear-fail-closed",
  "de-health-pkv-not-automatic-statutory-s1",
  "pkv-unclear-fail-closed",
  "a1-germany-not-automatic-gkv-s1",
  "private-german-insurance-not-automatic-statutory-s1",
  "sk-health-szco-or-zivnost-not-insurer-identity",
  "sk-health-sp-not-s1-issuer",
  "sk-health-not-socialna-poistovna",
  "business-establishment-not-eu-residence",
  "health-requires-applicable-legislation-result",
  "work-state-not-automatic-health-competence",
  "posting-not-automatic-s1",
  "a1-issued-not-automatic-s1",
  "s1-not-a1",
  "s1-issued-not-a1-unnecessary",
  "old-s1-not-entitlement-forever",
  "sk-health-own-activity-overrides",
  "self-employed-health-contribution-out-of-scope",
  "self-employed-krankengeld-needs-election",
  "art-23-not-employment-or-automatic-gkv",
  "sk-health-incoming-not-contribution",
  "de-health-incoming-s1-not-contribution",
  "posted-self-employed-stay-uses-ehic-principles",
]);

export function evaluateDeSkHealthSelfEmployedHardening() {
  const processKeys = new Set(DE_SK_HEALTH_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...DE_SK_HEALTH_EU_CLAIM_KEYS,
    ...DE_SK_HEALTH_DE_CLAIM_KEYS,
    ...DE_SK_HEALTH_SK_CLAIM_KEYS,
  ]);
  const scenarios = DE_SK_HEALTH_SELF_EMPLOYED_SCENARIOS;
  const covered = scenarios.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = scenarios.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const blocked = scenarios.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const missing = scenarios.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const inScopeBlocked = covered.length > 0 && blocked.length;
  return Object.freeze({
    activityTypes: DE_SK_HEALTH_ACTIVITY_TYPES,
    selfEmployedCoverageExplicit: claimKeys.has("art-17-insured-person-includes-self-employed")
      && claimKeys.has("sk-health-employee-or-szco-may-request-s1")
      && DE_SK_HEALTH_ACTIVITY_TYPES.includes("SELF_EMPLOYED"),
    mixedActivityCoverageExplicit: processKeys.has("de-sk-health-mixed-activity-delegate")
      && DE_SK_HEALTH_ACTIVITY_TYPES.includes("MIXED_EMPLOYED_SELF_EMPLOYED"),
    deSelfEmployedGkvRouteCovered: covered.some((scenario) => scenario.id === "se-de-gkv-res-sk"),
    deSelfEmployedPkvFailClosed: covered.some((scenario) => scenario.id === "se-de-pkv-res-sk"),
    deSelfEmployedUnknownInsuranceFailClosed: covered.some((scenario) => scenario.id === "se-de-insurance-unknown-res-sk"),
    skSelfEmployedPublicInsuranceRouteCovered: covered.some((scenario) => scenario.id === "se-sk-szco-public-res-de"),
    skSelfEmployedInsurerUnknownFailClosed: covered.some((scenario) => scenario.id === "se-sk-szco-insurer-unknown-res-de"),
    mixedActivityDelegatesToApplicableLegislation: processKeys.has("de-sk-health-mixed-activity-delegate")
      && claimKeys.has("health-requires-applicable-legislation-result"),
    multiStateSelfEmploymentDelegatesToCb0C: covered.some((scenario) => scenario.id === "se-multi-state-unresolved")
      && covered.some((scenario) => scenario.id === "se-multi-state-verified-de"),
    selfEmployedPostingResidenceStaySeparated: processKeys.has("de-sk-health-posted-sk-to-de-temporary-stay")
      && processKeys.has("de-sk-health-posted-sk-to-de-residence-transfer"),
    selfEmployedEhICRouteCovered: covered.some((scenario) => scenario.id === "se-de-gkv-s1-sk-ehic-cz")
      && covered.some((scenario) => scenario.id === "se-sk-public-s1-de-ehic-at"),
    selfEmployedS2RouteCovered: covered.some((scenario) => scenario.id === "se-de-gkv-planned-sk")
      && covered.some((scenario) => scenario.id === "se-sk-public-planned-de"),
    activityChangeReevaluationCovered: processKeys.has("de-sk-health-activity-status-change"),
    selfEmployedContributionCalculationOutOfScope: outOfScope.some((scenario) => scenario.id === "asks-self-employed-contribution"),
    krankengeldSelfEmployedOutOfScope: outOfScope.some((scenario) => scenario.id === "asks-self-employed-krankengeld"),
    total: scenarios.length,
    coveredCount: covered.length,
    outOfScopeCount: outOfScope.length,
    blockedCount: blocked.length,
    inScopeBlockedCount: inScopeBlocked ? blocked.length : 0,
    missing,
    negativeControlCount: DE_SK_HEALTH_SELF_EMPLOYED_NEGATIVE_CONTROLS.length,
    negativeControlsPresent: DE_SK_HEALTH_SELF_EMPLOYED_NEGATIVE_CONTROLS.every((key) => claimKeys.has(key)),
  });
}

export function buildDeSkHealthInsuranceCoordinationConnectorPack(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: DE_SK_HEALTH_CONNECTOR_PACK_ID,
    originMarket: "DE",
    connectedCountry: "SK",
    status: DE_SK_HEALTH_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "health-insurance-s1-ehic-s2",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: DE_HEALTH_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "DE" as const,
      trustDomain: "de" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: DE_SK_HEALTH_DE_CLAIM_KEYS.map(deRef),
    euClaimRefs: DE_SK_HEALTH_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: DE_SK_HEALTH_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_HEALTH_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "DE_SK_HEALTH_INSURANCE_COORDINATION",
      userMustAct: true,
      germanAuthorityMustAct: true,
      foreignAuthorityMustAct: true,
      institutionExchangeExpected: true,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "insuranceState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: DE_SK_HEALTH_PROCESSES,
  });
}

export function deSkHealthConnectorSummary(
  pack: CuratedCrossBorderConnectorPack = buildDeSkHealthInsuranceCoordinationConnectorPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    status: pack.status,
    euRefCount: pack.euClaimRefs.length,
    deRefCount: pack.germanClaimRefs.length,
    skRefCount: pack.foreignClaimRefs.length,
    processCount: pack.corridorProcesses?.length ?? 0,
    completeness: evaluateDeSkHealthProcessCompleteness(),
    selfEmployedHardening: evaluateDeSkHealthSelfEmployedHardening(),
    validation: validateCuratedCrossBorderConnectorPack(pack),
  });
}
