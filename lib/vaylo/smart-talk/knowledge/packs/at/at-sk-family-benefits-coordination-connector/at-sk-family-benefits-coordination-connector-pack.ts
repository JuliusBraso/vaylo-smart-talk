/**
 * AT-SK-0F AT↔SK family-benefits coordination connector (Familienbeihilfe /
 * prídavok / rodičovský príspevok). Links EU family core, Austrian family routing
 * and Slovak family adapter. Does not copy EU Articles 67–69 or national merits.
 */
import {
  PROCESS_COMPLETE_DIMENSIONS,
  type ScenarioCoverage,
} from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_SHARED_ART1Z_CLAIM_KEY,
  EU_SHARED_ART60_CLAIM_KEY,
  EU_SHARED_ART67_CLAIM_KEY,
  EU_SHARED_ART68_CLAIM_KEY,
  EU_SHARED_ART682_CLAIM_KEY,
  EU_SHARED_ART69_CLAIM_KEY,
  EU_SHARED_C36_23_CLAIM_KEY,
  EU_SHARED_F3_CLAIM_KEY,
  evaluateC3623InterinstitutionalRoute,
  evaluateC3623PersonRecovery,
} from "../../eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import {
  AT_FB_PRIMARY_PROCESS_KEY,
  AT_FB_UNITS,
} from "../family-benefits-coordination-routing/at-family-benefits-coordination-routing-pack";
import {
  SK_FAMILY_PRIMARY_PROCESS_KEY,
  SK_FAMILY_UNITS,
} from "../../sk/family-benefits/sk-family-benefits-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
} from "../../../source-registry/cross-border-connector-contracts";

export type { FamilyBenefitBasket } from "../../../source-registry/cross-border-connector-contracts";

export const AT_SK_FAMILY_CONNECTOR_PACK_ID = "at_sk_family_benefits_coordination" as const;
export const AT_SK_FAMILY_CONNECTOR_PROCESS_GROUP = "at_sk_family_benefits_coordination_connector" as const;
export const AT_SK_FAMILY_CONNECTOR_STATUS = "prepared" as const;

export type AtOriginFamilyStableReference = Readonly<{
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
function atRef(key: string): AtOriginFamilyStableReference {
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

/** Bounded Shared EU C-36/23 refs linked by the AT-SK connector (reuse only, no AT/SK copies). */
export const AT_SK_FB_EU_C36_23_CLAIM_KEYS = Object.freeze([
  EU_SHARED_C36_23_CLAIM_KEY,
  "c36-23-theoretical-primary-not-fixed",
  "c36-23-theoretical-primary-not-paid",
  "c36-23-interinstitutional-reimbursement-route",
  "c36-23-potential-amount-not-actual-payment",
  "c36-23-primary-secondary-joint-processing",
  "c36-23-unknown-status-fail-closed",
  "c36-23-primary-inaction-not-claimant-debt",
  "c36-23-person-recovery-not-institutional",
  "c36-23-fixed-and-paid-not-automatic-prohibition",
  "c36-23-paid-narrow-condition-not-mechanical",
  "c36-23-not-universal-no-recovery",
  "c36-23-not-priority-rule",
  "c36-23-not-f3",
  "c36-23-not-article-60-fiction",
] as const);

export const AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY =
  "at-sk-fb-secondary-payment-recovery-coordination" as const;

export const AT_SK_FB_EU_CLAIM_KEYS = Object.freeze([
  EU_SHARED_ART1Z_CLAIM_KEY,
  EU_SHARED_ART67_CLAIM_KEY,
  EU_SHARED_ART68_CLAIM_KEY,
  EU_SHARED_ART682_CLAIM_KEY,
  EU_SHARED_ART69_CLAIM_KEY,
  EU_SHARED_ART60_CLAIM_KEY,
  EU_SHARED_F3_CLAIM_KEY,
  "fb-activity-before-pension-before-residence",
  "fb-child-residence-not-override-different-bases",
  "fb-same-basis-activity-child-residence",
  "fb-art-58-cost-sharing",
  "fb-unresolved-same-basis-activity",
  "fb-exact-amount-fail-closed",
  "fb-no-naive-amount-calculator",
  "fb-currency-period-fail-closed",
  "fb-art-68-3-forwarding",
  "fb-filing-date-preserved",
  "fb-filed-secondary-not-lost",
  "fb-two-month-institution-response",
  "fb-two-month-not-user-payment-guarantee",
  "fb-disagreement-routes-to-art-6",
  "trapkowski-applicant-not-beneficiary",
  "fb-other-parent-not-automatic-payee",
  "moser-whole-family-secondary",
  "fb-moser-calculation-not-universal",
  "pending-cod-2016-0397-family-not-current",
  "proposed-child-raising-category-not-current",
  "fb-nationality-not-priority",
  "fb-user-locale-not-priority",
  "fb-applicable-legislation-not-automatic-primary",
  "fb-child-residence-not-always-primary",
  "fb-higher-amount-not-automatic-primary",
  "fb-two-full-benefits-not-normal",
  "fb-secondary-not-no-entitlement",
  "fb-f3-not-one-benefit-pair",
  "fb-f3-not-two-full-benefits",
  "fb-f3-secondary-compares-baskets",
  "fb-f3-family-member-not-global-family",
  "fb-class-excluded-annex-i",
  "fb-class-requires-authority",
  "fb-unemployed-basis-not-universal",
  "fb-art-59-month-end-continuation",
  "fb-mid-month-not-day-split",
  "fb-uk-family-out-of-scope",
  "fb-non-eu-bilateral-out-of-scope",
  "fb-kindergeld-national-not-in-eu-core",
  "fb-elterngeld-national-not-in-eu-core",
  "fb-multiple-children-not-one-child-state",
  "fb-national-rights-required-for-overlap",
  "fb-basis-activity",
  "fb-employed-and-self-employed-same-activity-tier",
  "fb-self-employed-not-automatic-residence",
  "fb-self-employment-not-automatic-national-right",
  "fb-single-person-mixed-not-two-activity-rights",
  "fb-zero-income-not-activity-ceased",
  "fb-dormant-registration-not-current-activity",
  "fb-company-owner-not-automatic-self-employed",
  "fb-mixed-income-not-two-article-68-states",
  "fb-business-registration-not-priority",
  "fb-tax-residence-not-priority",
  "fb-business-closure-not-automatic-benefit-end",
  "fb-second-parent-activity-unclear-fail-closed",
  "fb-second-parent-activity-can-change-priority",
  "fb-working-parent-only-insufficient",
  "fb-two-working-parents-not-automatic-overlap",
  "fb-applicable-legislation-not-automatic-activity-right",
  "fb-eu-coordination-not-national-entitlement",
  "fb-fact-change-requires-reclassification",
  "fb-working-parent-not-automatic-payee",
  ...AT_SK_FB_EU_C36_23_CLAIM_KEYS,
]);

export const AT_SK_FB_AT_CLAIM_KEYS = Object.freeze(AT_FB_UNITS.map((unit) => unit.key));
export const AT_SK_FB_SK_CLAIM_KEYS = Object.freeze(SK_FAMILY_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;
type AnyRef = StableKnowledgeReference | ForeignNationalStableReference | AtOriginFamilyStableReference;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly AnyRef[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`AT_SK_FAMILY_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length) as CorridorProcessBinding["claimRefs"],
  });
}

export const AT_SK_FAMILY_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("at-sk-fb-case-classify", "AT-SK Familienleistungsweg einordnen", "Wohnsitz oder Erwerbstätigkeit berührt Österreich und die Slowakei bei Familienbeihilfe oder slowakischen Familienleistungen", "Staatsangehörigkeit und Locale nicht als Korridor wählen; nationale Rechte zuerst sammeln.", [euRef("fb-nationality-not-priority"), euRef("fb-user-locale-not-priority"), euRef("fb-applicable-legislation-not-automatic-primary"), euRef(EU_SHARED_ART68_CLAIM_KEY), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-kindergeld-national-not-in-eu-core"), euRef("fb-elterngeld-national-not-in-eu-core"), atRef("at-fb-not-kinderbetreuungsgeld"), skRef("sk-fb-not-socialna-poistovna"), euRef("fb-national-rights-required-for-overlap"), atRef("at-fb-familienbeihilfe-scope-only")]),
  binding("at-sk-fb-whole-family-facts", "Gesamte Familie als Sachverhalt führen", "Nur der erwerbstätige Elternteil wird als Fall angeboten", "Eltern A, Eltern B und Kind verlangen; zweite Tätigkeit nicht als nicht vorhanden setzen.", [euRef(EU_SHARED_ART60_CLAIM_KEY), euRef("moser-whole-family-secondary"), euRef("fb-moser-calculation-not-universal"), atRef("at-fb-eu-coordination-not-national-entitlement"), skRef("sk-child-change-8-days"), euRef("fb-multiple-children-not-one-child-state"), atRef("at-fb-bmf-guidance-role"), skRef("sk-fb-channel-fetch-live"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("trapkowski-applicant-not-beneficiary")]),
  binding("at-sk-fb-child-by-child", "Kinder einzeln führen", "Mehrere Kinder oder unterschiedliche Kindwohnsitze werden zu einem Staat zusammengezogen", "Jedes Kind gesondert nach Wohnsitz und Zeitraum führen.", [euRef("fb-multiple-children-not-one-child-state"), euRef("fb-f3-family-member-not-global-family"), euRef(EU_SHARED_ART60_CLAIM_KEY), skRef("sk-child-one-payment-per-child"), atRef("at-fb-change-reporting"), euRef("fb-child-residence-not-always-primary"), atRef("at-fb-channel-fetch-live"), skRef("sk-child-calendar-month"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-familienbeihilfe-merits"), euRef("fb-f3-not-one-benefit-pair")]),
  binding("at-sk-fb-national-candidates", "Nationale Kandidatenleistungen sammeln", "Familienbeihilfe, prídavok oder rodičovský príspevok ohne nationale Prüfung", "Nationale Packs nicht duplizieren; mögliche Rechte listen, nicht erfinden.", [euRef("fb-national-rights-required-for-overlap"), euRef("fb-kindergeld-national-not-in-eu-core"), euRef("fb-elterngeld-national-not-in-eu-core"), skRef("sk-child-is-family-benefit"), skRef("sk-parental-is-family-benefit"), atRef("at-fb-does-not-copy-familienbeihilfe-merits"), atRef("at-fb-not-kinderbetreuungsgeld"), atRef("at-fb-no-national-entitlement"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-name-not-classifier")]),
  binding("at-sk-fb-entitlement-gate", "Nationale Ansprüche voraussetzen", "Vorrang soll bestimmt werden, nationale Rechte sind unverifiziert", "Ohne verifizierte oder mögliche nationale Rechte fail-closed bleiben.", [euRef("fb-national-rights-required-for-overlap"), atRef("at-fb-finanzamt-not-priority"), atRef("at-fb-no-national-entitlement"), skRef("sk-child-not-from-child-residence-alone"), skRef("sk-fb-application-not-approval"), atRef("at-fb-application-not-approval"), euRef(EU_SHARED_ART67_CLAIM_KEY), atRef("at-fb-finanzamt-not-priority"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-secondary-not-no-entitlement")]),
  binding("at-sk-fb-eu-classification-gate", "EU-Familienleistungsklassifikation prüfen", "Eine Zahlung mit Kind, Geburt oder Elternbezug soll koordiniert werden", "Artikel 1 Buchstabe z verlangen; Namen nicht als Klassifikator nutzen.", [euRef(EU_SHARED_ART1Z_CLAIM_KEY), euRef("fb-class-requires-authority"), skRef("sk-fb-name-not-classifier"), skRef("sk-child-is-family-benefit"), skRef("sk-parental-is-family-benefit"), skRef("sk-parental-not-materske"), atRef("at-fb-not-kinderbetreuungsgeld"), euRef("fb-class-excluded-annex-i"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-priplatok-family-benefit-current")]),
  binding("at-sk-fb-annex-i-gate", "Anhang-I-Ausschluss AT-SK prüfen", "Geburtsbeihilfe, Geburtszuschlag oder náhradné výživné wird als Familienleistung angeboten", "EXCLUDED_ANNEX_I setzen; nicht in den F3-Korb nehmen.", [euRef("fb-class-excluded-annex-i"), skRef("sk-birth-allowance-excluded-annex-i"), skRef("sk-birth-supplement-excluded-annex-i"), skRef("sk-substitute-maintenance-excluded"), euRef(EU_SHARED_ART1Z_CLAIM_KEY), skRef("sk-fb-name-not-classifier"), atRef("at-fb-channel-fetch-live"), skRef("sk-fb-channel-fetch-live"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-class-requires-authority")]),
  binding("at-sk-fb-basis-classify", "Anspruchsgrundlage ACTIVITY PENSION RESIDENCE einordnen", "Grundlage unklar, Arbeitslosigkeit oder Elternzeit wird als Wohnsitz angeboten", "Arbeitslosigkeit nicht universell als Grundlage setzen; Tätigkeit vor Rente vor Wohnsitz.", [euRef("fb-activity-before-pension-before-residence"), euRef("fb-unemployed-basis-not-universal"), euRef(EU_SHARED_ART68_CLAIM_KEY), atRef("at-fb-not-a1-priority"), skRef("sk-parental-residence-or-eu"), euRef("fb-applicable-legislation-not-automatic-primary"), atRef("at-fb-finanzamt-not-priority"), atRef("at-fb-eu-coordination-not-national-entitlement"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-child-residence-not-always-primary")]),
  binding("at-sk-fb-at-activity-sk-residence", "AT Erwerbstätigkeit gegen SK Wohnsitz", "Elternteil A arbeitet AT, B nicht erwerbstätig, Kind SK, nationale Rechte vorhanden", "Erwerbstätigkeitsbasiertes österreichisches Recht vorrangig, slowakisches Wohnsitzrecht nachrangig, sofern Rechte bestehen.", [euRef("fb-activity-before-pension-before-residence"), euRef("fb-child-residence-not-always-primary"), euRef(EU_SHARED_ART67_CLAIM_KEY), euRef(EU_SHARED_ART682_CLAIM_KEY), atRef("at-fb-beih100-operational-route"), skRef("sk-child-application"), atRef("at-fb-no-national-entitlement"), skRef("sk-child-not-from-child-residence-alone"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-national-rights-required-for-overlap")]),
  binding("at-sk-fb-sk-activity-at-residence", "SK Erwerbstätigkeit gegen AT Wohnsitz", "Elternteil A arbeitet SK, B nicht erwerbstätig, Kind AT, nationale Rechte vorhanden", "Slowakisches erwerbstätigkeitsbasiertes Recht vorrangig, österreichisches Wohnsitzrecht nachrangig, sofern Rechte bestehen.", [euRef("fb-child-residence-not-override-different-bases"), euRef("fb-activity-before-pension-before-residence"), euRef(EU_SHARED_ART67_CLAIM_KEY), euRef(EU_SHARED_ART682_CLAIM_KEY), skRef("sk-child-application"), atRef("at-fb-beih100-operational-route"), skRef("sk-child-eu-coord-not-sk-residence-only"), atRef("at-fb-child-abroad-not-automatic-denial"), skRef("sk-fb-upsvar-role"), atRef("at-fb-finanzamt-oesterreich-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-national-rights-required-for-overlap")]),
  binding("at-sk-fb-both-activity-child-sk", "Beide erwerbstätig, Kind SK", "A arbeitet AT, B arbeitet SK, Kind wohnt SK", "Gleicher Grundlage Erwerbstätigkeit: Wohnmitgliedstaat der Kinder hat Vorrang, sofern dort Tätigkeit besteht.", [euRef("fb-same-basis-activity-child-residence"), euRef(EU_SHARED_ART68_CLAIM_KEY), skRef("sk-child-is-family-benefit"), atRef("at-fb-beih38-differential-route"), euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-higher-amount-not-automatic-primary"), atRef("at-fb-amount-live-gate"), skRef("sk-child-amount-60-2026"), skRef("sk-fb-upsvar-role"), atRef("at-fb-finanzamt-oesterreich-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal")]),
  binding("at-sk-fb-both-activity-child-at", "Beide erwerbstätig, Kind AT", "A arbeitet AT, B arbeitet SK, Kind wohnt AT", "Gleicher Grundlage Erwerbstätigkeit: Wohnmitgliedstaat der Kinder AT hat Vorrang, sofern dort Tätigkeit besteht.", [euRef("fb-same-basis-activity-child-residence"), euRef(EU_SHARED_ART68_CLAIM_KEY), atRef("at-fb-beih100-operational-route"), skRef("sk-child-application"), euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-higher-amount-not-automatic-primary"), atRef("at-fb-amount-live-gate"), skRef("sk-child-amount-60-2026"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal")]),
  binding("at-sk-fb-child-third-state-art-58", "Kind in Drittstaat, Artikel 58", "A arbeitet AT, B arbeitet SK, Kind wohnt HU oder CZ", "Artikel 58 als Trägerkostenteilung führen; keinen AT-CZ- oder AT-HU-Familienkonnektor aktivieren.", [euRef("fb-unresolved-same-basis-activity"), euRef("fb-art-58-cost-sharing"), euRef(EU_SHARED_ART68_CLAIM_KEY), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-child-residence-not-always-primary"), atRef("at-fb-eu-coordination-not-national-entitlement"), atRef("at-fb-channel-fetch-live"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), euRef("fb-exact-amount-fail-closed"), euRef("fb-no-naive-amount-calculator")]),
  binding("at-sk-fb-at-primary-sk-secondary", "AT vorrangig, SK nachrangig", "Verifizierter Vorrang AT, möglicher slowakischer Anspruch", "Österreichischen Weg führen; Nachrang bedeutet nicht fehlenden slowakischen Anspruch.", [euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal"), atRef("at-fb-beih100-operational-route"), skRef("sk-child-application"), atRef("at-fb-beih38-differential-route"), euRef(EU_SHARED_F3_CLAIM_KEY), skRef("sk-child-is-family-benefit"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-f3-not-two-full-benefits")]),
  binding("at-sk-fb-sk-primary-at-secondary", "SK vorrangig, AT nachrangig", "Verifizierter Vorrang SK, möglicher österreichischer Anspruch", "Slowakischen Weg führen; österreichische Differenz nicht als volle Familienbeihilfe setzen.", [euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal"), skRef("sk-child-application"), atRef("at-fb-beih38-differential-route"), atRef("at-fb-beih38-not-secondary-proof"), euRef(EU_SHARED_F3_CLAIM_KEY), skRef("sk-parental-is-family-benefit"), skRef("sk-fb-upsvar-role"), atRef("at-fb-finanzamt-oesterreich-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-f3-not-two-full-benefits")]),
  binding("at-sk-fb-f3-basket", "Beschluss-F3-Korb AT-SK", "Unterschiedsbetrag soll aus Familienbeihilfe minus prídavok oder Elternbeitrag gerechnet werden", "Pro Familienmitglied Körbe vergleichen; príplatok nur bei verifiziertem Anspruch; unvollständigen Korb fail-closed lassen.", [euRef(EU_SHARED_F3_CLAIM_KEY), euRef("fb-f3-secondary-compares-baskets"), euRef("fb-f3-not-one-benefit-pair"), euRef("fb-f3-not-two-full-benefits"), euRef("fb-f3-family-member-not-global-family"), skRef("sk-priplatok-family-benefit-current"), atRef("at-fb-beih38-differential-route"), euRef("fb-exact-amount-fail-closed"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-parental-not-materske")]),
  binding("at-sk-fb-differential-input-gate", "Differenzeingaben prüfen", "Naive Paarung, unvollständiger F3-Korb oder unverglichene Perioden", "Keine Einzelleistungspaare; Perioden und Währungen verlangen.", [euRef("fb-no-naive-amount-calculator"), euRef("fb-f3-not-one-benefit-pair"), euRef("fb-currency-period-fail-closed"), atRef("at-fb-amount-live-gate"), skRef("sk-parental-calendar-month"), skRef("sk-child-calendar-month"), skRef("sk-parental-calendar-month"), euRef("fb-exact-amount-fail-closed"), atRef("at-fb-not-kinderbetreuungsgeld"), skRef("sk-fb-upsvar-role"), atRef("at-fb-beih38-differential-route"), euRef("fb-f3-secondary-compares-baskets")]),
  binding("at-sk-fb-exact-amount-fail-closed", "Genaues Euro-Differenzverbot", "Nutzer verlangt konkrete Familienbeihilfe minus prídavok ohne verifizierte Körbe", "Ohne verifizierte Ansprüche, Körbe, Perioden und aktuelle Sätze fail-closed bleiben.", [euRef("fb-exact-amount-fail-closed"), euRef("fb-no-naive-amount-calculator"), atRef("at-fb-beih38-differential-route"), atRef("at-fb-amount-live-gate"), skRef("sk-child-amount-60-2026"), skRef("sk-fb-amount-not-timeless"), atRef("at-fb-amount-live-gate"), euRef("fb-currency-period-fail-closed"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-amount-live-gate"), euRef("fb-f3-not-one-benefit-pair")]),
  binding("at-sk-fb-familienbeihilfe-differential-route", "Familienbeihilfe-Differenz Beih38 zum Finanzamt", "Nachrangige österreichische Familienbeihilfe oder Differenzbeihilfe", "An das Finanzamt Österreich mit Beih38 verweisen; nicht konkrete Beträge versprechen.", [atRef("at-fb-beih38-differential-route"), atRef("at-fb-finanzamt-oesterreich-role"), atRef("at-fb-beih38-not-secondary-proof"), atRef("at-fb-bmf-guidance-role"), atRef("at-fb-beih100-operational-route"), euRef(EU_SHARED_ART682_CLAIM_KEY), atRef("at-fb-amount-live-gate"), atRef("at-fb-finanzamt-instance-fetch-live"), skRef("sk-child-amount-60-2026"), atRef("at-fb-does-not-copy-familienbeihilfe-merits"), euRef("fb-exact-amount-fail-closed"), atRef("at-fb-secondary-differential-review")]),
  binding("at-sk-fb-sk-child-route", "Slowakischen Kinderzuschlag routen", "Prídavok na dieťa im AT-SK-Fall", "An ÚPSVaR verweisen, nicht an Sociálna poisťovňa; Kindwohnsitz nicht als automatischen Anspruch setzen.", [skRef("sk-child-application"), skRef("sk-child-is-family-benefit"), skRef("sk-fb-upsvar-role"), skRef("sk-fb-not-socialna-poistovna"), skRef("sk-child-not-from-child-residence-alone"), skRef("sk-child-amount-60-2026"), skRef("sk-child-first-grader-eu-requires-application"), skRef("sk-fb-application-not-approval"), skRef("sk-fb-upsvar-instance-fetch-live"), atRef("at-fb-bmf-guidance-role"), skRef("sk-fb-does-not-copy-eu-law"), skRef("sk-fb-ustredie-not-universal-payer")]),
  binding("at-sk-fb-sk-parental-route", "Slowakischen Elternbeitrag routen", "Rodičovský príspevok im AT-SK-Fall", "Materské trennen; Betragsklasse 364,80 oder 500,10 nicht zeitlos setzen; Mutterschaft nicht automatisch ausschließen.", [skRef("sk-parental-application"), skRef("sk-parental-is-family-benefit"), skRef("sk-parental-not-materske"), skRef("sk-parental-amount-364-80-2026"), skRef("sk-parental-amount-500-10-2026"), skRef("sk-parental-maternity-amount-gate"), skRef("sk-parental-maternity-not-automatic-exclusion"), skRef("sk-parental-not-elterngeld-copy"), skRef("sk-fb-upsvar-role"), atRef("at-fb-not-kinderbetreuungsgeld"), skRef("sk-fb-does-not-copy-eu-law"), skRef("sk-fb-not-socialna-poistovna")]),
  binding("at-sk-fb-application-forwarding", "Antragsweg und Weiterleitung", "Antrag beim Finanzamt Österreich oder ÚPSVaR, möglicherweise nicht vorrangig", "Falsch eingereicht nicht als verloren behandeln; Antragsdatum erhalten.", [euRef("fb-art-68-3-forwarding"), euRef("fb-filing-date-preserved"), euRef("fb-filed-secondary-not-lost"), atRef("at-fb-misfiled-not-lost"), atRef("at-fb-application-not-approval"), skRef("sk-fb-application-not-approval"), atRef("at-fb-forwarding-handoff"), atRef("at-fb-bmf-guidance-role"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-not-kinderbetreuungsgeld"), euRef(EU_SHARED_ART60_CLAIM_KEY)]),
  binding("at-sk-fb-two-month-procedure", "Zweimonatsverfahren der Träger", "Nutzer erwartet Zahlung binnen zwei Monaten oder Trägerantwort", "Zweimonatsfrist ist Trägerantwort, kein Zahlungsversprechen.", [euRef("fb-two-month-institution-response"), euRef("fb-two-month-not-user-payment-guarantee"), euRef("fb-disagreement-routes-to-art-6"), atRef("at-fb-forwarding-handoff"), atRef("at-fb-application-not-approval"), skRef("sk-fb-application-not-approval"), euRef(EU_SHARED_ART60_CLAIM_KEY), atRef("at-fb-channel-fetch-live"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-filed-secondary-not-lost")]),
  binding("at-sk-fb-applicant-vs-payee", "Antragsteller und Zahlungsempfänger trennen", "Anderer Elternteil stellt den Antrag und hält sich für den Empfänger", "Antragsbefugnis ist nicht Empfangsberechtigung.", [euRef("trapkowski-applicant-not-beneficiary"), euRef("fb-other-parent-not-automatic-payee"), euRef(EU_SHARED_ART60_CLAIM_KEY), atRef("at-fb-beih100-operational-route"), skRef("sk-child-application"), atRef("at-fb-application-not-approval"), skRef("sk-parental-one-family-entitlement"), atRef("at-fb-channel-fetch-live"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("moser-whole-family-secondary")]),
  binding("at-sk-fb-employment-leave-change", "Beschäftigungs- oder Elternzeitwechsel", "Elternzeit, Arbeitslosigkeit oder Beschäftigungsstaat wechselt", "Elternzeit nicht automatisch als Wohnsitzgrundlage; Arbeitslosigkeit nicht universell; erneut klassifizieren.", [euRef("fb-unemployed-basis-not-universal"), euRef("fb-activity-before-pension-before-residence"), atRef("at-fb-not-a1-priority"), skRef("sk-child-change-8-days"), skRef("sk-parental-change-reporting"), atRef("at-fb-change-reporting"), euRef("fb-art-59-month-end-continuation"), euRef("fb-mid-month-not-day-split"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-not-kinderbetreuungsgeld"), euRef("fb-applicable-legislation-not-automatic-primary")]),
  binding("at-sk-fb-child-residence-change", "Kindwohnsitzwechsel AT nach SK oder umgekehrt", "Kind zieht um, Vorrang soll fortgeschrieben werden", "Kindwohnsitz kann den Vorrang ändern; nicht automatisch den neuen Wohnstaat als vorrangig setzen.", [euRef("fb-child-residence-not-always-primary"), euRef("fb-same-basis-activity-child-residence"), skRef("sk-child-change-8-days"), atRef("at-fb-change-reporting"), skRef("sk-child-not-from-child-residence-alone"), euRef(EU_SHARED_ART67_CLAIM_KEY), euRef("fb-art-59-month-end-continuation"), atRef("at-fb-channel-fetch-live"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-multiple-children-not-one-child-state")]),
  binding("at-sk-fb-mid-month-competence", "Kompetenzwechsel im Kalendermonat", "Beschäftigung oder Vorrang wechselt mitten im Monat", "Kein automatischer tagesweiser Schnitt; bisheriger Träger bis Monatsende.", [euRef("fb-art-59-month-end-continuation"), euRef("fb-mid-month-not-day-split"), skRef("sk-child-calendar-month"), skRef("sk-child-payment"), skRef("sk-parental-calendar-month"), atRef("at-fb-amount-live-gate"), atRef("at-fb-change-reporting"), skRef("sk-parental-change-reporting"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-currency-period-fail-closed")]),
  binding("at-sk-fb-proposed-law-gate", "Vorgeschlagenes Recht 2016/0397 sperren", "Nutzer behandelt 2016/0397 oder Kindererziehungs-Sonderregeln als geltendes Recht", "Als nicht geltende Revision führen; nicht als aktuelles Familienleistungsrecht speichern.", [euRef("pending-cod-2016-0397-family-not-current"), euRef("proposed-child-raising-category-not-current"), euRef(EU_SHARED_ART68_CLAIM_KEY), atRef("at-fb-not-kinderbetreuungsgeld"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), atRef("at-fb-not-a1-priority"), skRef("sk-parental-not-elterngeld-copy"), atRef("at-fb-not-kinderbetreuungsgeld"), skRef("sk-fb-upsvar-role"), euRef("fb-elterngeld-national-not-in-eu-core"), atRef("at-fb-familienbeihilfe-scope-only")]),
  binding("at-sk-fb-self-employed-activity-gate", "Selbständigkeit als ACTIVITY führen", "Selbständige Person oder SZČO wird als Wohnsitzfall oder nachrangig zur Beschäftigung angeboten", "Selbständigkeit als ACTIVITY derselben Stufe wie Beschäftigung führen; nicht automatisch Wohnsitz und nicht automatisch nationales Recht.", [euRef("fb-basis-activity"), euRef("fb-employed-and-self-employed-same-activity-tier"), euRef("fb-self-employed-not-automatic-residence"), euRef("fb-self-employment-not-automatic-national-right"), euRef("fb-national-rights-required-for-overlap"), skRef("sk-fb-employee-or-szco-activity-facts"), atRef("at-fb-no-national-entitlement"), skRef("sk-child-szco-not-automatic-entitlement"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-tax-residence-not-priority")]),
  binding("at-sk-fb-single-person-mixed-delegate", "Gemischte Tätigkeit einer Person an Titel II verweisen", "Eine Person ist beschäftigt und selbständig in AT und SK und soll zwei ACTIVITY-Rechte erhalten", "Artikel 13 nicht im Familienkorridor neu entscheiden; zwei ACTIVITY-Rechte nicht aus einer Person erfinden.", [euRef("fb-single-person-mixed-not-two-activity-rights"), euRef("fb-applicable-legislation-not-automatic-activity-right"), euRef("fb-eu-coordination-not-national-entitlement"), euRef("fb-national-rights-required-for-overlap"), euRef("fb-two-working-parents-not-automatic-overlap"), atRef("at-fb-eu-coordination-not-national-entitlement"), atRef("at-fb-finanzamt-not-priority"), atRef("at-fb-does-not-copy-eu-law"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-business-registration-not-priority")]),
  binding("at-sk-fb-at-szco-evidence", "Familienbeihilfe-Nachweise Selbständigkeit", "Selbständige Person legt Gewerbe oder Steuerbescheid als Familienbeihilfeanspruch oder Vorrang vor", "Nachweise als Verfahrensbelege führen; Gewerbe nicht als Anspruch und Steuerbescheid nicht als Artikel-68-Vorrang setzen.", [atRef("at-fb-national-eligibility-gate"), atRef("at-fb-finanzonline-not-entitlement"), atRef("at-fb-bmf-not-priority-decision"), atRef("at-fb-no-national-entitlement"), atRef("at-fb-beih100-operational-route"), atRef("at-fb-bmf-guidance-role"), euRef("fb-self-employment-not-automatic-national-right"), euRef("fb-business-registration-not-priority"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-familienbeihilfe-merits"), euRef("fb-tax-residence-not-priority")]),
  binding("at-sk-fb-se-activity-status-change", "Wechsel Beschäftigung Selbständigkeit neu prüfen", "Selbständigkeit beginnt, endet, wechselt den Staat oder die Betriebsform während des Leistungszeitraums", "Vorrang und Grundlage erneut klassifizieren; ruhende Registrierung, Nullumsatz und Schließung nicht still fortschreiben.", [euRef("fb-fact-change-requires-reclassification"), euRef("fb-zero-income-not-activity-ceased"), euRef("fb-dormant-registration-not-current-activity"), euRef("fb-business-closure-not-automatic-benefit-end"), euRef("fb-art-59-month-end-continuation"), atRef("at-fb-change-reporting"), skRef("sk-child-change-8-days"), skRef("sk-parental-change-reporting"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-not-kinderbetreuungsgeld"), euRef("fb-mid-month-not-day-split")]),
  binding("at-sk-fb-priplatok-gainful-activity-gate", "Príplatok nicht aus Selbständigkeit setzen", "Selbständige Person verlangt 30 Euro príplatok automatisch im F3-Korb", "Príplatok nur bei verifiziertem nationalem Anspruch; Erwerbstätigkeit nicht als automatischen Zuschlag setzen.", [skRef("sk-priplatok-not-automatic-from-gainful-activity"), skRef("sk-priplatok-family-benefit-current"), skRef("sk-priplatok-amount-30-2026"), euRef("fb-f3-not-one-benefit-pair"), euRef("fb-exact-amount-fail-closed"), euRef(EU_SHARED_F3_CLAIM_KEY), atRef("at-fb-beih38-differential-route"), skRef("sk-fb-application-not-approval"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-no-naive-amount-calculator")]),
  binding("at-sk-fb-a1-handoff", "A1 an Familienleistungen übergeben ohne Vermengen", "A1 oder verifiziertes 0D-Ergebnis liegt vor, Familienleistungsvorrang offen", "A1 bestimmt nicht automatisch den Familienleistungsvorrang; ohne Sachverhalt fail-closed.", [atRef("at-fb-not-a1-priority"), atRef("at-fb-not-s1-family"), euRef("fb-applicable-legislation-not-automatic-primary"), euRef("fb-applicable-legislation-not-automatic-activity-right"), atRef("at-fb-does-not-copy-eu-law"), euRef("fb-national-rights-required-for-overlap"), atRef("at-fb-finanzamt-not-priority"), euRef("fb-eu-coordination-not-national-entitlement"), atRef("at-fb-not-health-insurer"), skRef("sk-fb-does-not-copy-eu-law"), atRef("at-fb-national-eligibility-gate"), euRef("fb-fact-change-requires-reclassification")]),
  binding("at-sk-fb-health-separation", "Gesundheits- und Familienleistungsdomäne trennen", "S1, EHIC oder Krankenversicherung werden als Familienbeihilfe oder Vorrang angeboten", "Gesundheitskoordination nicht im Familienkorridor neu entscheiden; S1 nicht Artikel 68.", [atRef("at-fb-not-health-insurer"), atRef("at-fb-not-s1-family"), skRef("sk-fb-not-health-insurer"), euRef("fb-eu-coordination-not-national-entitlement"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-not-socialna-poistovna"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), euRef("fb-national-rights-required-for-overlap"), atRef("at-fb-familienbeihilfe-scope-only"), euRef("fb-class-requires-authority"), atRef("at-fb-not-kinderbetreuungsgeld")]),
  binding("at-sk-fb-three-state-sk-at-de", "SK+AT+DE Familienleistungen gemeinsam", "Vorrang AT oder SK, Wohnsitz SK oder AT, vorübergehender Aufenthalt DE", "Drei Staaten erfinden keinen zweiten Vorrang; Artikel 58 und Weiterleitung getrennt führen.", [euRef("fb-unresolved-same-basis-activity"), euRef("fb-art-58-cost-sharing"), euRef(EU_SHARED_ART68_CLAIM_KEY), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-child-residence-not-always-primary"), atRef("at-fb-not-a1-priority"), atRef("at-fb-forwarding-handoff"), skRef("sk-child-eu-coord-not-sk-residence-only"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), euRef("fb-exact-amount-fail-closed")]),
  binding("at-sk-fb-at-de-szco-sequential", "SZČO AT dann DE ohne Autovorrang", "Wohnsitz SK, Selbständigkeit AT Januar–Juli, danach DE August–Dezember", "Weder Artikel 12 noch Artikel 13 automatisch; Timeline und Neuwertung erhalten.", [euRef("fb-fact-change-requires-reclassification"), euRef("fb-applicable-legislation-not-automatic-activity-right"), euRef("fb-single-person-mixed-not-two-activity-rights"), euRef("fb-business-registration-not-priority"), atRef("at-fb-change-reporting"), skRef("sk-child-change-8-days"), atRef("at-fb-not-a1-priority"), euRef("fb-art-59-month-end-continuation"), atRef("at-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role")]),
  binding("at-sk-fb-indexation-rejection", "Wohnsitzpreis-Indexierung ablehnen", "Familienbeihilfe soll wegen Kindwohnsitz SK gekürzt werden", "C-328/20 und § 55 FLAG führen; früheres § 8a nicht anwenden.", [atRef("at-fb-c328-20-indexation-rejected"), atRef("at-fb-historical-indexation-not-current"), atRef("at-fb-flag-55-former-8a-superseded"), atRef("at-fb-child-abroad-not-automatic-denial"), euRef("fb-higher-amount-not-automatic-primary"), atRef("at-fb-does-not-copy-eu-law"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), atRef("at-fb-amount-live-gate"), euRef("fb-exact-amount-fail-closed"), euRef("fb-no-naive-amount-calculator"), atRef("at-fb-change-reporting")]),
  binding(AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY, "AT-SK Nachzahlung und C-36/23-Rückforderung koordinieren", "Nachrangträger hat gezahlt und verlangt Teilrückzahlung, Vorrang AT oder SK bereits bestimmt", "Festsetzungs- und Zahlungsstatus der vorrangigen Leistung prüfen; theoretisches Recht nicht als Zahlung setzen; Vorrang nicht neu bestimmen.", [euRef(EU_SHARED_C36_23_CLAIM_KEY), euRef("c36-23-primary-secondary-joint-processing"), euRef("c36-23-unknown-status-fail-closed"), euRef("c36-23-theoretical-primary-not-fixed"), euRef("c36-23-interinstitutional-reimbursement-route"), euRef("fb-filing-date-preserved"), euRef("c36-23-primary-inaction-not-claimant-debt"), euRef("fb-art-68-3-forwarding"), atRef("at-fb-finanzamt-oesterreich-role"), skRef("sk-fb-upsvar-role"), euRef("c36-23-not-universal-no-recovery"), euRef("c36-23-not-priority-rule")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const AT_SK_FAMILY_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "parent-a-works-de-b-inactive-child-sk", label: "Elternteil A arbeitet DE, B nicht erwerbstätig, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-activity-before-pension-before-residence", "fb-national-rights-required-for-overlap"], requiredProcessKeys: ["at-sk-fb-at-activity-sk-residence"] },
  { id: "parent-a-works-sk-b-inactive-child-de", label: "Elternteil A arbeitet SK, B nicht erwerbstätig, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-child-residence-not-override-different-bases"], requiredProcessKeys: ["at-sk-fb-sk-activity-at-residence"] },
  { id: "both-work-child-sk", label: "Beide erwerbstätig, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-both-activity-child-sk"] },
  { id: "both-work-child-de", label: "Beide erwerbstätig, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-both-activity-child-at"] },
  { id: "child-lives-hu-art-58", label: "Kind wohnt HU, Artikel 58, kein DE-HU-Konnektor", coverage: "COVERED", requiredClaimKeys: ["fb-unresolved-same-basis-activity", "fb-art-58-cost-sharing"], requiredProcessKeys: ["at-sk-fb-child-third-state-art-58"] },
  { id: "both-work-de-child-sk", label: "Beide arbeiten DE, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-activity-before-pension-before-residence"], requiredProcessKeys: ["at-sk-fb-at-activity-sk-residence"] },
  { id: "both-work-sk-child-de", label: "Beide arbeiten SK, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-child-residence-not-override-different-bases"], requiredProcessKeys: ["at-sk-fb-sk-activity-at-residence"] },
  { id: "parental-leave-not-automatic-residence", label: "Elternzeit nicht automatisch Wohnsitzgrundlage", coverage: "COVERED", requiredClaimKeys: ["fb-unemployed-basis-not-universal", "at-fb-not-a1-priority"], requiredProcessKeys: ["at-sk-fb-employment-leave-change"] },
  { id: "unemployment-not-auto-basis", label: "Arbeitslosigkeit nicht automatische Anspruchsgrundlage", coverage: "COVERED", requiredClaimKeys: ["fb-unemployed-basis-not-universal"], requiredProcessKeys: ["at-sk-fb-basis-classify"] },
  { id: "nationality-independent", label: "Staatsangehörigkeit bestimmt den Vorrang nicht", coverage: "COVERED", requiredClaimKeys: ["fb-nationality-not-priority"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "locale-independent", label: "Locale bestimmt den Vorrang nicht", coverage: "COVERED", requiredClaimKeys: ["fb-user-locale-not-priority"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "kindergeld-259-live-gate", label: "Kindergeld 259 Euro Stand 2026-09-01", coverage: "COVERED", requiredClaimKeys: ["at-fb-amount-live-gate", "at-fb-amount-live-gate"], requiredProcessKeys: ["at-sk-fb-familienbeihilfe-differential-route"] },
  { id: "sk-child-60-2026", label: "Slowakischer Kinderzuschlag 60 Euro 2026", coverage: "COVERED", requiredClaimKeys: ["sk-child-amount-60-2026", "sk-fb-amount-not-timeless"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "first-grader-sept-2026", label: "Erstklässlerzuschlag September 2026", coverage: "COVERED", requiredClaimKeys: ["sk-child-first-grader-110", "sk-child-first-grader-domestic-automatic"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "eu-first-grader-application", label: "Erstklässlerzuschlag bei EU-Kinderzuschlag nur auf Antrag", coverage: "COVERED", requiredClaimKeys: ["sk-child-first-grader-eu-requires-application"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "parental-364-80", label: "Elternbeitrag 364,80 Euro ohne vorheriges materské", coverage: "COVERED", requiredClaimKeys: ["sk-parental-amount-364-80-2026"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "parental-500-10", label: "Elternbeitrag 500,10 Euro nach materské", coverage: "COVERED", requiredClaimKeys: ["sk-parental-amount-500-10-2026"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "maternity-amount-gate", label: "Mutterschaftsgeld-Betragssperre des Elternbeitrags", coverage: "COVERED", requiredClaimKeys: ["sk-parental-maternity-amount-gate", "sk-parental-maternity-not-automatic-exclusion"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "naive-pairing-rejected", label: "Naive Paarung Kindergeld minus prídavok abgelehnt", coverage: "COVERED", requiredClaimKeys: ["fb-f3-not-one-benefit-pair", "fb-no-naive-amount-calculator"], requiredProcessKeys: ["at-sk-fb-f3-basket"] },
  { id: "f3-incomplete-fail-closed", label: "Unvollständiger F3-Korb fail-closed", coverage: "COVERED", requiredClaimKeys: ["fb-exact-amount-fail-closed", "fb-f3-secondary-compares-baskets"], requiredProcessKeys: ["at-sk-fb-f3-basket"] },
  { id: "lebensmonat-vs-calendar", label: "Lebensmonat gegen Kalendermonat", coverage: "COVERED", requiredClaimKeys: ["sk-parental-calendar-month", "sk-parental-calendar-month"], requiredProcessKeys: ["at-sk-fb-differential-input-gate"] },
  { id: "multiple-children", label: "Mehrere Kinder nicht ein Kinderstaat", coverage: "COVERED", requiredClaimKeys: ["fb-multiple-children-not-one-child-state"], requiredProcessKeys: ["at-sk-fb-child-by-child"] },
  { id: "misfiled-forwarding", label: "Falsch eingereichter Antrag weiterleiten", coverage: "COVERED", requiredClaimKeys: ["fb-art-68-3-forwarding", "at-fb-misfiled-not-lost"], requiredProcessKeys: ["at-sk-fb-application-forwarding"] },
  { id: "two-month-procedure", label: "Zweimonatsfrist der Träger", coverage: "COVERED", requiredClaimKeys: ["fb-two-month-institution-response", "fb-two-month-not-user-payment-guarantee"], requiredProcessKeys: ["at-sk-fb-two-month-procedure"] },
  { id: "trapkowski-applicant-vs-payee", label: "Trapkowski Antragsteller nicht Empfänger", coverage: "COVERED", requiredClaimKeys: ["trapkowski-applicant-not-beneficiary", "fb-other-parent-not-automatic-payee"], requiredProcessKeys: ["at-sk-fb-applicant-vs-payee"] },
  { id: "birth-allowance-excluded", label: "Geburtsbeihilfe Anhang I ausgeschlossen", coverage: "COVERED", requiredClaimKeys: ["sk-birth-allowance-excluded-annex-i", "fb-class-excluded-annex-i"], requiredProcessKeys: ["at-sk-fb-annex-i-gate"] },
  { id: "substitute-excluded", label: "Náhradné výživné Anhang I ausgeschlossen", coverage: "COVERED", requiredClaimKeys: ["sk-substitute-maintenance-excluded"], requiredProcessKeys: ["at-sk-fb-annex-i-gate"] },
  { id: "priplatok-classification", label: "Príplatok FAMILY_BENEFIT_CURRENT bei verifiziertem Anspruch", coverage: "COVERED", requiredClaimKeys: ["sk-priplatok-family-benefit-current", "sk-priplatok-amount-30-2026"], requiredProcessKeys: ["at-sk-fb-f3-basket"] },
  { id: "childcare-classification", label: "Kinderbetreuungsbeitrag CLASSIFICATION_REQUIRES_AUTHORITY", coverage: "COVERED", requiredClaimKeys: ["sk-childcare-classification-requires-authority", "fb-class-requires-authority"], requiredProcessKeys: ["at-sk-fb-eu-classification-gate"] },
  { id: "familienkasse-vs-elterngeldstelle", label: "Finanzamt Österreich gegen Elterngeldstelle", coverage: "COVERED", requiredClaimKeys: ["at-fb-not-kinderbetreuungsgeld", "at-fb-not-kinderbetreuungsgeld"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "familienkasse-vs-upsvar", label: "Finanzamt Österreich gegen ÚPSVaR", coverage: "COVERED", requiredClaimKeys: ["at-fb-finanzamt-oesterreich-role", "sk-fb-upsvar-role"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "upsvar-vs-socialna-poistovna", label: "ÚPSVaR gegen Sociálna poisťovňa", coverage: "COVERED", requiredClaimKeys: ["sk-fb-not-socialna-poistovna"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "proposed-2016-0397-blocked", label: "Vorschlag 2016/0397 nicht geltendes Recht", coverage: "COVERED", requiredClaimKeys: ["pending-cod-2016-0397-family-not-current", "proposed-child-raising-category-not-current"], requiredProcessKeys: ["at-sk-fb-proposed-law-gate"] },
  { id: "de-primary-sk-secondary-kindergeld", label: "AT vorrangig, SK nachrangig, Kindergeld-Differenz", coverage: "COVERED", requiredClaimKeys: ["fb-secondary-not-no-entitlement", "at-fb-beih38-differential-route"], requiredProcessKeys: ["at-sk-fb-at-primary-sk-secondary"] },
  { id: "sk-primary-at-secondary-elterngeld", label: "SK vorrangig, AT nachrangig, Familienbeihilfe-Differenz", coverage: "COVERED", requiredClaimKeys: ["at-fb-beih38-differential-route"], requiredProcessKeys: ["at-sk-fb-sk-primary-at-secondary"] },
  { id: "kg-employment-not-automatic", label: "Österreichische Beschäftigung nicht automatischer Kindergeldanspruch", coverage: "COVERED", requiredClaimKeys: ["at-fb-no-national-entitlement"], requiredProcessKeys: ["at-sk-fb-entitlement-gate"] },
  { id: "elg-work-country-not-always-first", label: "Beschäftigungsstaat zahlt Familienbeihilfe nicht immer zuerst", coverage: "COVERED", requiredClaimKeys: ["at-fb-not-a1-priority", "at-fb-finanzamt-not-priority"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "period-alignment-fail-closed", label: "Periodenabgleich fail-closed", coverage: "COVERED", requiredClaimKeys: ["at-fb-amount-live-gate", "fb-currency-period-fail-closed"], requiredProcessKeys: ["at-sk-fb-differential-input-gate"] },
  { id: "first-grader-domestic-not-eu-automatic", label: "Inländische Erstklässlerautomatik nicht grenzüberschreitend", coverage: "COVERED", requiredClaimKeys: ["sk-child-first-grader-domestic-automatic", "sk-child-first-grader-eu-requires-application"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "materske-not-family-basket", label: "Materské nicht im Familienleistungskorb", coverage: "COVERED", requiredClaimKeys: ["sk-parental-not-materske"], requiredProcessKeys: ["at-sk-fb-eu-classification-gate"] },
  { id: "child-residence-sk-not-automatic-sk-entitlement", label: "Kindwohnsitz SK nicht automatischer SK-Anspruch", coverage: "COVERED", requiredClaimKeys: ["sk-child-not-from-child-residence-alone"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "name-not-classifier", label: "Leistungsname nicht Klassifikator", coverage: "COVERED", requiredClaimKeys: ["sk-fb-name-not-classifier", "art-1z-family-benefit"], requiredProcessKeys: ["at-sk-fb-eu-classification-gate"] },
  { id: "annex-i-gate", label: "Anhang-I-Tor", coverage: "COVERED", requiredClaimKeys: ["fb-class-excluded-annex-i", "sk-birth-supplement-excluded-annex-i"], requiredProcessKeys: ["at-sk-fb-annex-i-gate"] },
  { id: "national-entitlement-not-verified", label: "Nationale Ansprüche unverifiziert", coverage: "COVERED", requiredClaimKeys: ["fb-national-rights-required-for-overlap", "fb-kindergeld-national-not-in-eu-core"], requiredProcessKeys: ["at-sk-fb-national-candidates"] },
  { id: "f3-basket-comparison", label: "F3-Korbvergleich je Familienmitglied", coverage: "COVERED", requiredClaimKeys: ["decision-f3-per-family-member-comparison", "fb-f3-secondary-compares-baskets"], requiredProcessKeys: ["at-sk-fb-f3-basket"] },
  { id: "art-59-mid-month", label: "Artikel 59 Kompetenzwechsel im Monat", coverage: "COVERED", requiredClaimKeys: ["fb-art-59-month-end-continuation", "fb-mid-month-not-day-split"], requiredProcessKeys: ["at-sk-fb-mid-month-competence"] },
  { id: "child-residence-change", label: "Kind zieht DE nach SK", coverage: "COVERED", requiredClaimKeys: ["fb-child-residence-not-always-primary", "sk-child-change-8-days"], requiredProcessKeys: ["at-sk-fb-child-residence-change"] },
  { id: "employment-leave-change", label: "Beschäftigung oder Elternzeit wechselt", coverage: "COVERED", requiredClaimKeys: ["at-fb-change-reporting", "sk-parental-change-reporting"], requiredProcessKeys: ["at-sk-fb-employment-leave-change"] },
  { id: "eessi-not-user-recreation", label: "EESSI ohne Nutzer-Neuerzeugung jedes Dokuments", coverage: "COVERED", requiredClaimKeys: ["at-fb-forwarding-handoff"], requiredProcessKeys: ["at-sk-fb-application-forwarding"] },
  { id: "application-not-approval", label: "Antrag nicht Genehmigung", coverage: "COVERED", requiredClaimKeys: ["at-fb-application-not-approval", "sk-fb-application-not-approval"], requiredProcessKeys: ["at-sk-fb-application-forwarding"] },
  { id: "amounts-not-timeless", label: "Beträge nicht zeitlos", coverage: "COVERED", requiredClaimKeys: ["sk-fb-amount-not-timeless", "at-fb-amount-live-gate"], requiredProcessKeys: ["at-sk-fb-exact-amount-fail-closed"] },
  { id: "ustredie-not-universal-payer", label: "Ústredie nicht universeller Zahler", coverage: "COVERED", requiredClaimKeys: ["sk-fb-ustredie-not-universal-payer"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "not-health-insurer", label: "Krankenversicherung nicht Familienleistungsträger", coverage: "COVERED", requiredClaimKeys: ["sk-fb-not-health-insurer"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "moser-not-universal", label: "Moser-Berechnung nicht universell", coverage: "COVERED", requiredClaimKeys: ["moser-whole-family-secondary", "fb-moser-calculation-not-universal"], requiredProcessKeys: ["at-sk-fb-whole-family-facts"] },
  { id: "other-parent-not-payee", label: "Anderer Elternteil nicht automatischer Empfänger", coverage: "COVERED", requiredClaimKeys: ["fb-other-parent-not-automatic-payee"], requiredProcessKeys: ["at-sk-fb-applicant-vs-payee"] },
  { id: "two-full-benefits-rejected", label: "Zwei volle Leistungen abgelehnt", coverage: "COVERED", requiredClaimKeys: ["fb-two-full-benefits-not-normal", "fb-f3-not-two-full-benefits"], requiredProcessKeys: ["at-sk-fb-at-primary-sk-secondary"] },
  { id: "secondary-not-no-entitlement", label: "Nachrang nicht fehlender Anspruch", coverage: "COVERED", requiredClaimKeys: ["fb-secondary-not-no-entitlement"], requiredProcessKeys: ["at-sk-fb-sk-primary-at-secondary"] },
  { id: "currency-period-fail-closed", label: "Währung und Periode fail-closed", coverage: "COVERED", requiredClaimKeys: ["fb-currency-period-fail-closed"], requiredProcessKeys: ["at-sk-fb-exact-amount-fail-closed"] },
  { id: "sk-child-route", label: "Slowakischer Kinderzuschlagsweg", coverage: "COVERED", requiredClaimKeys: ["sk-child-application", "sk-fb-upsvar-role"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "sk-parental-route", label: "Slowakischer Elternbeitragsweg", coverage: "COVERED", requiredClaimKeys: ["sk-parental-application", "sk-parental-not-elterngeld-copy"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "de-elg-to-elterngeldstelle-not-fk", label: "Elterngeld-Differenz nicht an die Finanzamt Österreich", coverage: "COVERED", requiredClaimKeys: ["at-fb-beih38-differential-route", "at-fb-not-kinderbetreuungsgeld"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "parental-not-elterngeld-copy", label: "Rodičovský príspevok kopiert nicht BEEG", coverage: "COVERED", requiredClaimKeys: ["sk-parental-not-elterngeld-copy"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "sk-child-calendar-month", label: "Kinderzuschlag nach Kalendermonat", coverage: "COVERED", requiredClaimKeys: ["sk-child-calendar-month"], requiredProcessKeys: ["at-sk-fb-differential-input-gate"] },
  { id: "multiple-birth-increase", label: "Mehrlingszuschlag 25 Prozent", coverage: "COVERED", requiredClaimKeys: ["sk-parental-multiple-birth-increase"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "school-attendance-reduction", label: "Schulpflichtminderung 50 Prozent", coverage: "COVERED", requiredClaimKeys: ["sk-parental-school-attendance-reduction"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "filing-date-preserved", label: "Antragsdatum bleibt erhalten", coverage: "COVERED", requiredClaimKeys: ["fb-filing-date-preserved", "fb-filed-secondary-not-lost"], requiredProcessKeys: ["at-sk-fb-application-forwarding"] },
  { id: "birth-supplement-excluded", label: "Geburtszuschlag Anhang I ausgeschlossen", coverage: "COVERED", requiredClaimKeys: ["sk-birth-supplement-excluded-annex-i"], requiredProcessKeys: ["at-sk-fb-annex-i-gate"] },
  { id: "uk-family-out-of-scope", label: "UK-Familienleistungsfall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-uk-family-out-of-scope"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "non-eu-bilateral-out-of-scope", label: "Nicht-EU-bilateraler Familienleistungsfall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "se-a-de-b-inactive-child-sk", label: "Elternteil A selbständig DE, B inaktiv SK, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-basis-activity", "fb-activity-before-pension-before-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-at-activity-sk-residence"] },
  { id: "se-a-sk-b-inactive-child-de", label: "Elternteil A selbständig SK, B inaktiv DE, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-basis-activity", "fb-child-residence-not-override-different-bases"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-sk-activity-at-residence"] },
  { id: "se-a-de-employee-b-sk-child-sk", label: "A selbständig DE, B beschäftigt SK, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-employed-and-self-employed-same-activity-tier", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-both-activity-child-sk"] },
  { id: "se-a-de-employee-b-sk-child-de", label: "A selbständig DE, B beschäftigt SK, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-employed-and-self-employed-same-activity-tier", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-both-activity-child-at"] },
  { id: "employee-a-de-se-b-sk-child-sk", label: "A beschäftigt DE, B selbständig SK, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-employed-and-self-employed-same-activity-tier", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-both-activity-child-sk"] },
  { id: "employee-a-de-se-b-sk-child-de", label: "A beschäftigt DE, B selbständig SK, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-employed-and-self-employed-same-activity-tier", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-both-activity-child-at"] },
  { id: "se-a-de-se-b-sk-child-sk", label: "Beide selbständig, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-basis-activity", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-both-activity-child-sk"] },
  { id: "se-a-de-se-b-sk-child-de", label: "Beide selbständig, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-basis-activity", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate", "at-sk-fb-both-activity-child-at"] },
  { id: "se-a-de-se-b-sk-child-hu", label: "Beide selbständig, Kind HU, Artikel 58", coverage: "COVERED", requiredClaimKeys: ["fb-unresolved-same-basis-activity", "fb-art-58-cost-sharing"], requiredProcessKeys: ["at-sk-fb-child-third-state-art-58"] },
  { id: "both-se-de-child-sk", label: "Beide selbständig DE, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-activity-before-pension-before-residence", "fb-basis-activity"], requiredProcessKeys: ["at-sk-fb-at-activity-sk-residence"] },
  { id: "both-se-sk-child-de", label: "Beide selbständig SK, Kind AT", coverage: "COVERED", requiredClaimKeys: ["fb-child-residence-not-override-different-bases", "fb-basis-activity"], requiredProcessKeys: ["at-sk-fb-sk-activity-at-residence"] },
  { id: "mixed-one-person-employed-de-se-sk-other-inactive", label: "Eine Person beschäftigt DE und selbständig SK, anderer inaktiv", coverage: "COVERED", requiredClaimKeys: ["fb-single-person-mixed-not-two-activity-rights"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "mixed-one-person-employed-sk-se-de-other-inactive", label: "Eine Person beschäftigt SK und selbständig DE, anderer inaktiv", coverage: "COVERED", requiredClaimKeys: ["fb-single-person-mixed-not-two-activity-rights"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "mixed-one-person-fabricates-two-rights", label: "Gemischte Tätigkeit einer Person erfindet zwei ACTIVITY-Rechte", coverage: "COVERED", requiredClaimKeys: ["fb-single-person-mixed-not-two-activity-rights", "fb-national-rights-required-for-overlap"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "different-parents-employee-szco-two-potential-rights", label: "Unterschiedliche Eltern beschäftigt und SZČO, zwei mögliche Rechte", coverage: "COVERED", requiredClaimKeys: ["fb-two-working-parents-not-automatic-overlap", "fb-employed-and-self-employed-same-activity-tier"], requiredProcessKeys: ["at-sk-fb-both-activity-child-sk"] },
  { id: "multi-state-se-al-unresolved", label: "Mehrstaatliche Selbständigkeit, anwendbare Rechtsvorschriften unklar", coverage: "COVERED", requiredClaimKeys: ["fb-applicable-legislation-not-automatic-activity-right", "fb-single-person-mixed-not-two-activity-rights"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "multi-state-se-al-verified-de", label: "Mehrstaatliche Selbständigkeit, DE-Rechtsvorschriften verifiziert", coverage: "COVERED", requiredClaimKeys: ["fb-applicable-legislation-not-automatic-activity-right", "fb-self-employment-not-automatic-national-right"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "multi-state-se-al-verified-sk", label: "Mehrstaatliche Selbständigkeit, SK-Rechtsvorschriften verifiziert", coverage: "COVERED", requiredClaimKeys: ["fb-applicable-legislation-not-automatic-activity-right", "fb-self-employment-not-automatic-national-right"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "se-kg-gewerbe-evidence", label: "DE-Selbständige mit Gewerbeanmeldung als Kindergeldnachweis", coverage: "COVERED", requiredClaimKeys: ["at-fb-national-eligibility-gate", "at-fb-finanzonline-not-entitlement"], requiredProcessKeys: ["at-sk-fb-at-szco-evidence"] },
  { id: "se-gewerbe-assumed-kindergeld", label: "Gewerbe als Kindergeldanspruch angenommen", coverage: "COVERED", requiredClaimKeys: ["at-fb-finanzonline-not-entitlement", "at-fb-no-national-entitlement"], requiredProcessKeys: ["at-sk-fb-at-szco-evidence"] },
  { id: "se-de-secondary-kindergeld", label: "DE selbständig, mögliches nachrangiges Kindergeld", coverage: "COVERED", requiredClaimKeys: ["fb-secondary-not-no-entitlement", "at-fb-beih38-differential-route"], requiredProcessKeys: ["at-sk-fb-familienbeihilfe-differential-route"] },
  { id: "se-259-minus-60-rejected", label: "259 minus 60 als Selbständigen-Differenz verlangt", coverage: "COVERED", requiredClaimKeys: ["fb-no-naive-amount-calculator", "fb-exact-amount-fail-closed"], requiredProcessKeys: ["at-sk-fb-exact-amount-fail-closed"] },
  { id: "se-elterngeld-candidate", label: "Elterngeldkandidat selbständig", coverage: "COVERED", requiredClaimKeys: ["at-fb-national-eligibility-gate", "fb-elterngeld-national-not-in-eu-core"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "se-elterngeld-mixed-income", label: "Elterngeldkandidat mit Mischeinkünften", coverage: "COVERED", requiredClaimKeys: ["fb-applicable-legislation-not-automatic-activity-right", "fb-mixed-income-not-two-article-68-states"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "mixed-elterngeld-income-as-two-art-68-states", label: "Elterngeld-Mischeinkünfte als zwei Artikel-68-Staaten", coverage: "COVERED", requiredClaimKeys: ["fb-mixed-income-not-two-article-68-states", "fb-applicable-legislation-not-automatic-activity-right"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "sk-se-child-benefit-candidate", label: "SK selbständig, Kinderzuschlagskandidat", coverage: "COVERED", requiredClaimKeys: ["sk-child-szco-not-automatic-entitlement", "sk-fb-employee-or-szco-activity-facts"], requiredProcessKeys: ["at-sk-fb-sk-child-route"] },
  { id: "sk-se-parental-allowance-candidate", label: "SK selbständig, Elternbeitragskandidat", coverage: "COVERED", requiredClaimKeys: ["sk-parental-szco-not-automatic-exclusion", "sk-parental-szco-not-automatic-entitlement"], requiredProcessKeys: ["at-sk-fb-sk-parental-route"] },
  { id: "sk-se-priplatok-automatic", label: "SK selbständig, príplatok automatisch verlangt", coverage: "COVERED", requiredClaimKeys: ["sk-priplatok-not-automatic-from-gainful-activity"], requiredProcessKeys: ["at-sk-fb-priplatok-gainful-activity-gate"] },
  { id: "sk-priplatok-gainful-activity-fails", label: "Príplatok scheitert an Erwerbstätigkeitsvoraussetzungen", coverage: "COVERED", requiredClaimKeys: ["sk-priplatok-not-automatic-from-gainful-activity", "sk-priplatok-family-benefit-current"], requiredProcessKeys: ["at-sk-fb-priplatok-gainful-activity-gate"] },
  { id: "se-starts-during-benefit", label: "Selbständigkeit beginnt im Leistungszeitraum", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-second-parent-activity-can-change-priority"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "se-ends-during-benefit", label: "Selbständigkeit endet im Leistungszeitraum", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-business-closure-not-automatic-benefit-end"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "employee-to-se-same-state", label: "Beschäftigung wechselt zu Selbständigkeit im selben Staat", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-employed-and-self-employed-same-activity-tier"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "se-to-employee-same-state", label: "Selbständigkeit wechselt zu Beschäftigung im selben Staat", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-employed-and-self-employed-same-activity-tier"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "se-moves-de-to-sk", label: "Selbständigkeit wechselt DE nach SK", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-business-registration-not-priority"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "se-moves-sk-to-de", label: "Selbständigkeit wechselt SK nach DE", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-business-registration-not-priority"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "business-closed-old-priority-held", label: "Betrieb geschlossen, alter Vorrang festgehalten", coverage: "COVERED", requiredClaimKeys: ["fb-business-closure-not-automatic-benefit-end", "fb-fact-change-requires-reclassification"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "zero-income-activity-continues", label: "Nullumsatz, rechtliche Tätigkeit besteht fort", coverage: "COVERED", requiredClaimKeys: ["fb-zero-income-not-activity-ceased"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "dormant-gewerbe-as-current-activity", label: "Ruhendes Gewerbe als aktuelle Tätigkeit ohne Nachweis", coverage: "COVERED", requiredClaimKeys: ["fb-dormant-registration-not-current-activity", "sk-fb-szco-real-activity-evidence"], requiredProcessKeys: ["at-sk-fb-se-activity-status-change"] },
  { id: "multiple-businesses-as-multiple-rights", label: "Mehrere Betriebe als mehrere Artikel-68-Rechte", coverage: "COVERED", requiredClaimKeys: ["fb-single-person-mixed-not-two-activity-rights", "fb-business-registration-not-priority"], requiredProcessKeys: ["at-sk-fb-single-person-mixed-delegate"] },
  { id: "company-owner-status-unclear", label: "Inhaber- oder Geschäftsführerstatus unklar", coverage: "COVERED", requiredClaimKeys: ["fb-company-owner-not-automatic-self-employed", "sk-fb-company-owner-not-automatic-szco"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate"] },
  { id: "child-moves-sk-to-de-both-activity", label: "Kind zieht SK nach DE, beide activity-basiert", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence", "fb-child-residence-not-always-primary"], requiredProcessKeys: ["at-sk-fb-child-residence-change"] },
  { id: "other-parent-se-omitted", label: "Selbständigkeit des anderen Elternteils ausgelassen", coverage: "COVERED", requiredClaimKeys: ["fb-second-parent-activity-can-change-priority", "fb-working-parent-only-insufficient"], requiredProcessKeys: ["at-sk-fb-whole-family-facts"] },
  { id: "claimant-se-other-parent-unknown", label: "Antragsteller selbständig, andere Tätigkeit unbekannt", coverage: "COVERED", requiredClaimKeys: ["fb-second-parent-activity-unclear-fail-closed", "trapkowski-applicant-not-beneficiary"], requiredProcessKeys: ["at-sk-fb-whole-family-facts"] },
  { id: "se-f3-basket-incomplete", label: "Unvollständiger F3-Korb bei Selbständigkeit", coverage: "COVERED", requiredClaimKeys: ["fb-exact-amount-fail-closed", "fb-f3-secondary-compares-baskets"], requiredProcessKeys: ["at-sk-fb-f3-basket"] },
  { id: "se-lebensmonat-vs-calendar", label: "Elterngeld-Lebensmonat und SK-Kalendermonat, selbständig", coverage: "COVERED", requiredClaimKeys: ["sk-parental-calendar-month", "sk-parental-calendar-month"], requiredProcessKeys: ["at-sk-fb-differential-input-gate"] },
  { id: "locale-sk-factual-de-cz-se", label: "Locale SK bei faktischer DE-CZ-Familie, selbständig", coverage: "COVERED", requiredClaimKeys: ["fb-user-locale-not-priority"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "nationality-sk-se-de", label: "Staatsangehörigkeit SK, selbständig DE", coverage: "COVERED", requiredClaimKeys: ["fb-nationality-not-priority", "fb-basis-activity"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate"] },
  { id: "nationality-de-se-sk", label: "Staatsangehörigkeit DE, selbständig SK", coverage: "COVERED", requiredClaimKeys: ["fb-nationality-not-priority", "sk-fb-employee-or-szco-activity-facts"], requiredProcessKeys: ["at-sk-fb-self-employed-activity-gate"] },
  { id: "proposed-2016-0397-se-parent", label: "Vorschlag 2016/0397 auf selbständigen Elternteil", coverage: "COVERED", requiredClaimKeys: ["pending-cod-2016-0397-family-not-current", "proposed-child-raising-category-not-current"], requiredProcessKeys: ["at-sk-fb-proposed-law-gate"] },
  { id: "se-uk-family-out-of-scope", label: "UK-Familienleistungsfall mit Selbständigkeit", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-uk-family-out-of-scope"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "se-non-eu-bilateral-out-of-scope", label: "Nicht-EU-bilateraler Familienleistungsfall mit Selbständigkeit", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "at-secondary-sk-primary-c36-23-not-fixed-paid", label: "AT nachrangig, SK vorrangig, Vorrang weder festgesetzt noch gezahlt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_C36_23_CLAIM_KEY, "c36-23-theoretical-primary-not-fixed", "c36-23-theoretical-primary-not-paid"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "sk-secondary-at-primary-c36-23-not-fixed-paid", label: "SK nachrangig, AT vorrangig, Vorrang weder festgesetzt noch gezahlt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_C36_23_CLAIM_KEY, "c36-23-primary-secondary-joint-processing"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-theoretical-entitlement-not-fixed", label: "Theoretisches Vorrangrecht ohne Festsetzung", coverage: "COVERED", requiredClaimKeys: ["c36-23-theoretical-primary-not-fixed", EU_SHARED_C36_23_CLAIM_KEY], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-potential-amount-not-actual-payment", label: "Möglicher Vorrangbetrag nicht als tatsächliche Zahlung", coverage: "COVERED", requiredClaimKeys: ["c36-23-potential-amount-not-actual-payment", EU_SHARED_C36_23_CLAIM_KEY], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-person-recovery-rejected", label: "Personenrückforderung unter C-36/23-Bedingungen abgelehnt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_C36_23_CLAIM_KEY, "c36-23-person-recovery-not-institutional"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-interinstitutional-reimbursement-de-sk", label: "Trägerausgleich vom Vorrangträger", coverage: "COVERED", requiredClaimKeys: ["c36-23-interinstitutional-reimbursement-route", "c36-23-person-recovery-not-institutional"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-primary-benefit-fixed", label: "Vorrang festgesetzt, enge C-36/23-Bedingung nicht automatisch", coverage: "COVERED", requiredClaimKeys: ["c36-23-fixed-and-paid-not-automatic-prohibition"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-primary-benefit-paid", label: "Vorrang ausgezahlt, keine mechanische Schutzklausel", coverage: "COVERED", requiredClaimKeys: ["c36-23-paid-narrow-condition-not-mechanical"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-unknown-status-fail-closed", label: "Festsetzungs- oder Zahlungsstatus unbekannt", coverage: "COVERED", requiredClaimKeys: ["c36-23-unknown-status-fail-closed"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-used-as-priority-rule", label: "C-36/23 als Vorrangbestimmung abgelehnt", coverage: "COVERED", requiredClaimKeys: ["c36-23-not-priority-rule", EU_SHARED_ART68_CLAIM_KEY], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-used-as-f3", label: "C-36/23 als F3-Rechenweg abgelehnt", coverage: "COVERED", requiredClaimKeys: ["c36-23-not-f3", EU_SHARED_F3_CLAIM_KEY], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-used-as-article-60", label: "C-36/23 als Artikel-60-Fiktion abgelehnt", coverage: "COVERED", requiredClaimKeys: ["c36-23-not-article-60-fiction", EU_SHARED_ART60_CLAIM_KEY], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-universal-no-recovery-rejected", label: "Allgemeine Rückforderungsfreistellung abgelehnt", coverage: "COVERED", requiredClaimKeys: ["c36-23-not-universal-no-recovery"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "c36-23-forwarding-preserved", label: "Weiterleitung bei Rückforderungsfall erhalten", coverage: "COVERED", requiredClaimKeys: ["fb-art-68-3-forwarding", "fb-filed-secondary-not-lost"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY, "at-sk-fb-application-forwarding"] },
  { id: "c36-23-filing-date-preserved", label: "Antragsdatum bei Rückforderungsfall erhalten", coverage: "COVERED", requiredClaimKeys: ["fb-filing-date-preserved"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY, "at-sk-fb-application-forwarding"] },
  { id: "c36-23-synthetic-200-120-not-person-debt", label: "Synthetisch Nachrang 200, theoretischer Vorrang 120, weder festgesetzt noch gezahlt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_C36_23_CLAIM_KEY, "c36-23-potential-amount-not-actual-payment", "c36-23-interinstitutional-reimbursement-route"], requiredProcessKeys: [AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY] },
  { id: "indexation-c328-20-rejected", label: "Wohnsitzpreis-Indexierung wegen Kindwohnsitz SK abgelehnt", coverage: "COVERED", requiredClaimKeys: ["at-fb-c328-20-indexation-rejected", "at-fb-historical-indexation-not-current"], requiredProcessKeys: ["at-sk-fb-indexation-rejection"] },
  { id: "health-not-family-carrier", label: "Krankenversicherung nicht Familienbeihilfeträger", coverage: "COVERED", requiredClaimKeys: ["at-fb-not-health-insurer", "sk-fb-not-health-insurer"], requiredProcessKeys: ["at-sk-fb-health-separation"] },
  { id: "s1-not-family-priority", label: "S1 nicht Artikel-68-Familienpriorität", coverage: "COVERED", requiredClaimKeys: ["at-fb-not-s1-family"], requiredProcessKeys: ["at-sk-fb-health-separation"] },
  { id: "three-state-sk-at-de-family", label: "SK Wohnsitz, AT Vorrang, vorübergehend DE", coverage: "COVERED", requiredClaimKeys: ["fb-unresolved-same-basis-activity", "at-fb-not-a1-priority"], requiredProcessKeys: ["at-sk-fb-three-state-sk-at-de"] },
  { id: "szco-at-then-de-sequential", label: "SZČO AT Jan–Jul dann DE Aug–Dec", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "at-fb-not-a1-priority"], requiredProcessKeys: ["at-sk-fb-at-de-szco-sequential"] },
  { id: "a1-not-family-priority", label: "A1 bestimmt Familienleistungsvorrang nicht", coverage: "COVERED", requiredClaimKeys: ["at-fb-not-a1-priority"], requiredProcessKeys: ["at-sk-fb-a1-handoff"] },
  { id: "kinderbetreuungsgeld-oos", label: "Kinderbetreuungsgeld außerhalb Familienbeihilfe-Pack", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-fb-not-kinderbetreuungsgeld"], requiredProcessKeys: ["at-sk-fb-case-classify"] },
  { id: "familienbonus-plus-oos", label: "Familienbonus Plus außerhalb des Korridors", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-fb-not-familienbonus-plus"], requiredProcessKeys: ["at-sk-fb-case-classify"] }
]);

export const AT_SK_FAMILY_NEGATIVE_CONTROLS = Object.freeze([
  "fb-basis-activity",
  "fb-employed-and-self-employed-same-activity-tier",
  "fb-self-employed-not-automatic-residence",
  "fb-self-employment-not-automatic-national-right",
  "fb-single-person-mixed-not-two-activity-rights",
  "fb-zero-income-not-activity-ceased",
  "fb-dormant-registration-not-current-activity",
  "fb-company-owner-not-automatic-self-employed",
  "fb-mixed-income-not-two-article-68-states",
  "fb-business-registration-not-priority",
  "fb-tax-residence-not-priority",
  "fb-business-closure-not-automatic-benefit-end",
  "fb-second-parent-activity-unclear-fail-closed",
  "fb-working-parent-only-insufficient",
  "fb-two-working-parents-not-automatic-overlap",
  "fb-national-rights-required-for-overlap",
  "trapkowski-applicant-not-beneficiary",
  "fb-f3-not-one-benefit-pair",
  "fb-no-naive-amount-calculator",
  "fb-nationality-not-priority",
  "pending-cod-2016-0397-family-not-current",
  "at-fb-finanzonline-not-entitlement",
  "at-fb-bmf-not-priority-decision",
  "at-fb-not-a1-priority",
  "at-fb-not-health-insurer",
  "at-fb-not-s1-family",
  "at-fb-c328-20-indexation-rejected",
  "at-fb-historical-indexation-not-current",
  "sk-child-szco-not-automatic-entitlement",
  "sk-parental-szco-not-automatic-exclusion",
  "sk-parental-szco-not-automatic-entitlement",
  "sk-priplatok-not-automatic-from-gainful-activity",
  "sk-fb-company-owner-not-automatic-szco",
  "at-fb-not-kinderbetreuungsgeld",
  "at-fb-not-familienbonus-plus",
]);

export function evaluateAtSkFamilyProcessCompleteness() {
  const processKeys = new Set(AT_SK_FAMILY_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...AT_SK_FB_EU_CLAIM_KEYS,
    ...AT_SK_FB_AT_CLAIM_KEYS,
    ...AT_SK_FB_SK_CLAIM_KEYS,
  ]);
  const incomplete = AT_SK_FAMILY_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = AT_SK_FAMILY_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = AT_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
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
    processCount: AT_SK_FAMILY_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: AT_SK_FAMILY_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
    outOfScopeMissing,
  });
}

function atSkFamilyEuReachableKeys(): ReadonlySet<string> {
  const keys = new Set<string>(AT_SK_FB_EU_CLAIM_KEYS);
  for (const process of AT_SK_FAMILY_PROCESSES) {
    for (const ref of process.claimRefs) {
      if (ref.sourceJurisdiction === "EU") keys.add(ref.key);
    }
  }
  return keys;
}

export function evaluateAtSkFamilyC3623Linkage() {
  const reachable = atSkFamilyEuReachableKeys();
  const processKeys = new Set(AT_SK_FAMILY_PROCESSES.map((process) => process.key));
  const recoveryProcess = AT_SK_FAMILY_PROCESSES.find(
    (process) => process.key === AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY,
  );
  const euClaimSet = new Set<string>(AT_SK_FB_EU_CLAIM_KEYS);
  const requiredPresent = AT_SK_FB_EU_C36_23_CLAIM_KEYS.every((key) => euClaimSet.has(key));
  const noDuplicateRefs = euClaimSet.size === AT_SK_FB_EU_CLAIM_KEYS.length;
  const processRefsC3623 = (recoveryProcess?.claimRefs ?? []).filter(
    (ref) => ref.sourceJurisdiction === "EU" && ref.key.includes("c36-23"),
  );
  const linkageGap = !requiredPresent
    || !processKeys.has(AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY)
    || processRefsC3623.length === 0;
  const notFixedNotPaidFacts = {
    personRecoveryRequested: true as const,
    primaryBenefitFixed: false as const,
    primaryBenefitPaid: false as const,
    secondaryBenefitPaid: true as const,
    primaryBenefitEntitlementStatus: "EXISTS" as const,
  };
  return Object.freeze({
    sharedEuC3623Present: true,
    requiredRefsPresent: requiredPresent,
    processBindingPresent: processKeys.has(AT_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY),
    c36_23ReachableFromAtSkFamilyConnector: !linkageGap
      && AT_SK_FB_EU_C36_23_CLAIM_KEYS.every((key) => reachable.has(key)),
    connectorLinkageGap: linkageGap,
    atSkCopiedC3623Claims: 0,
    duplicateRefs: !noDuplicateRefs,
    processComplete: (recoveryProcess?.claimRefs.length ?? 0) === DIM.length,
    atSecondaryRoute: AT_SK_FAMILY_SCENARIOS.some(
      (scenario) => scenario.id === "at-secondary-sk-primary-c36-23-not-fixed-paid"
        && scenario.coverage === "COVERED",
    ),
    skSecondaryRoute: AT_SK_FAMILY_SCENARIOS.some(
      (scenario) => scenario.id === "sk-secondary-at-primary-c36-23-not-fixed-paid"
        && scenario.coverage === "COVERED",
    ),
    syntheticPersonRecoveryRejected: evaluateC3623PersonRecovery(notFixedNotPaidFacts)
      === "PERSON_RECOVERY_REJECTED_UNDER_C36_23_CONDITIONS",
    institutionalRouteAvailable: evaluateC3623InterinstitutionalRoute({
      secondaryBenefitPaid: true,
      primaryBenefitFixed: false,
      primaryBenefitPaid: false,
    }) === "INTER_INSTITUTIONAL_REIMBURSEMENT_AVAILABLE",
    unknownStatusFailClosed: evaluateC3623PersonRecovery({ personRecoveryRequested: true })
      === "PRIMARY_BENEFIT_STATUS_REQUIRED",
    paidDoesNotAutoProhibit: evaluateC3623PersonRecovery({
      personRecoveryRequested: true,
      primaryBenefitFixed: true,
      primaryBenefitPaid: true,
      secondaryBenefitPaid: true,
    }) === "C36_23_NO_PERSON_RECOVERY_CONDITION_NOT_AUTOMATICALLY_SATISFIED",
    notPriorityRule: euClaimSet.has("c36-23-not-priority-rule"),
    notF3: euClaimSet.has("c36-23-not-f3"),
    notArticle60: euClaimSet.has("c36-23-not-article-60-fiction"),
    universalNoRecoveryRejected: euClaimSet.has("c36-23-not-universal-no-recovery"),
    forwardingPreserved: euClaimSet.has("fb-art-68-3-forwarding"),
    filingDatePreserved: euClaimSet.has("fb-filing-date-preserved"),
  });
}

export type AtSkFamilyBenefitsCoordinationConnectorPack = Readonly<{
  schemaVersion: typeof CROSS_BORDER_CONNECTOR_SCHEMA_VERSION;
  packId: typeof AT_SK_FAMILY_CONNECTOR_PACK_ID;
  originMarket: "AT";
  connectedCountry: "SK";
  status: typeof AT_SK_FAMILY_CONNECTOR_STATUS;
  activationFromLocaleAllowed: false;
  activationRequiresVerifiedCaseContext: true;
  topicKey: "family-benefits-familienbeihilfe";
  topicFamily: "SOCIAL_SECURITY_COORDINATION";
  germanProcessRef: AtOriginFamilyStableReference;
  germanClaimRefs: readonly AtOriginFamilyStableReference[];
  euClaimRefs: readonly StableKnowledgeReference[];
  foreignClaimRefs: readonly ForeignNationalStableReference[];
  foreignProcessReference: typeof SK_FAMILY_PRIMARY_PROCESS_KEY;
  actorRule: Readonly<{
    actorState: "AT_SK_FAMILY_BENEFITS_COORDINATION";
    userMustAct: true;
    germanAuthorityMustAct: true;
    foreignAuthorityMustAct: true;
    institutionExchangeExpected: true;
  }>;
  requiredCaseRoles: readonly ["PARENT_A", "PARENT_B", "CHILD"];
  requiredCaseStates: readonly ["residenceState", "activityState"];
  handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "EVENT_DRIVEN";
  corridorProcesses: readonly CorridorProcessBinding[];
}>;

export function validateAtSkFamilyBenefitsCoordinationConnectorPack(
  pack: AtSkFamilyBenefitsCoordinationConnectorPack,
): Readonly<{ valid: boolean; issues: readonly string[]; productionEligible: false }> {
  const issues: string[] = [];
  if (pack.packId !== AT_SK_FAMILY_CONNECTOR_PACK_ID) issues.push("AT_SK_FAMILY_PACK_ID_INVALID");
  if (pack.originMarket !== "AT" || pack.connectedCountry !== "SK") issues.push("AT_SK_CORRIDOR_INVALID");
  if (pack.status !== "prepared") issues.push("AT_SK_FAMILY_CONNECTOR_NOT_PREPARED");
  if ((pack.status as string) === "active") issues.push("CONNECTOR_ACTIVE_FORBIDDEN");
  if (pack.activationFromLocaleAllowed !== false) issues.push("LOCALE_ACTIVATION_FORBIDDEN");
  if (pack.activationRequiresVerifiedCaseContext !== true) issues.push("VERIFIED_CASE_CONTEXT_REQUIRED");
  if (pack.topicFamily !== "SOCIAL_SECURITY_COORDINATION") issues.push("UNSUPPORTED_TOPIC_FAMILY");
  if (pack.topicKey !== "family-benefits-familienbeihilfe") issues.push("AT_SK_FAMILY_TOPIC_INVALID");
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

export function buildAtSkFamilyBenefitsCoordinationConnectorPack(): AtSkFamilyBenefitsCoordinationConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: AT_SK_FAMILY_CONNECTOR_PACK_ID,
    originMarket: "AT",
    connectedCountry: "SK",
    status: AT_SK_FAMILY_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "family-benefits-familienbeihilfe",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: AT_FB_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "AT" as const,
      trustDomain: "at" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: AT_SK_FB_AT_CLAIM_KEYS.map(atRef),
    euClaimRefs: AT_SK_FB_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: AT_SK_FB_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_FAMILY_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "AT_SK_FAMILY_BENEFITS_COORDINATION" as const,
      userMustAct: true as const,
      germanAuthorityMustAct: true as const,
      foreignAuthorityMustAct: true as const,
      institutionExchangeExpected: true as const,
    }),
    requiredCaseRoles: Object.freeze(["PARENT_A", "PARENT_B", "CHILD"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: AT_SK_FAMILY_PROCESSES,
  });
}

