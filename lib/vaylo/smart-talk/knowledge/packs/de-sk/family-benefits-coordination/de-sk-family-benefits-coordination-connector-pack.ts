/**
 * CB-0H DE↔SK family-benefits coordination connector (Kindergeld / Elterngeld /
 * prídavok / rodičovský príspevok). Links EU family core, German family routing
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
  EU_SHARED_F3_CLAIM_KEY,
} from "../../eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import {
  DE_FAMILY_PRIMARY_PROCESS_KEY,
  DE_FAMILY_UNITS,
} from "../../de/family-benefits-coordination-routing/de-family-benefits-coordination-routing-pack";
import {
  SK_FAMILY_PRIMARY_PROCESS_KEY,
  SK_FAMILY_UNITS,
} from "../../sk/family-benefits/sk-family-benefits-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type CuratedCrossBorderConnectorPack,
  type FamilyBenefitBasket,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
  validateCuratedCrossBorderConnectorPack,
} from "../../../source-registry/cross-border-connector-contracts";

export type { FamilyBenefitBasket };

export const DE_SK_FAMILY_CONNECTOR_PACK_ID = "de_sk_family_benefits_coordination" as const;
export const DE_SK_FAMILY_CONNECTOR_STATUS = "prepared" as const;

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

export const DE_SK_FB_REUSED_KINDERGELD_KEYS = Object.freeze([
  "amount-259-from-2026",
  "anlage-ausland-signals-foreign-facts",
  "foreign-comparable-benefit-exclusion",
  "cross-border-competence-not-from-residence",
  "paying-state-not-inferred",
]);

export const DE_SK_FB_REUSED_ELTERNGELD_KEYS = Object.freeze([
  "eu-not-automatic-primary",
  "german-residence-not-always-primary",
  "foreign-benefit-not-auto-exclusion",
  "two-states-not-double-full",
  "cross-border-fail-closed",
  "kindergeld-not-elterngeld",
  "local-authority-fetch-live",
]);

export const DE_SK_FB_EU_CLAIM_KEYS = Object.freeze([
  EU_SHARED_ART1Z_CLAIM_KEY,
  EU_SHARED_ART67_CLAIM_KEY,
  EU_SHARED_ART68_CLAIM_KEY,
  EU_SHARED_ART682_CLAIM_KEY,
  EU_SHARED_ART69_CLAIM_KEY,
  EU_SHARED_ART60_CLAIM_KEY,
  EU_SHARED_F3_CLAIM_KEY,
  "fb-activity-before-pension-before-residence",
  "fb-de-activity-vs-sk-residence",
  "fb-sk-activity-vs-de-residence",
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
]);

export const DE_SK_FB_DE_CLAIM_KEYS = Object.freeze([
  ...DE_FAMILY_UNITS.map((unit) => unit.key),
  ...DE_SK_FB_REUSED_KINDERGELD_KEYS,
  ...DE_SK_FB_REUSED_ELTERNGELD_KEYS,
]);
export const DE_SK_FB_SK_CLAIM_KEYS = Object.freeze(SK_FAMILY_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly (StableKnowledgeReference | ForeignNationalStableReference)[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`DE_SK_FAMILY_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length),
  });
}

export const DE_SK_FAMILY_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("de-sk-fb-case-classify", "DE-SK Familienleistungsweg einordnen", "Wohnsitz oder Erwerbstätigkeit berührt Deutschland und die Slowakei bei Kindergeld, Elterngeld oder slowakischen Familienleistungen", "Staatsangehörigkeit und Locale nicht als Korridor wählen; nationale Rechte zuerst sammeln.", [euRef("fb-nationality-not-priority"), euRef("fb-user-locale-not-priority"), euRef("fb-applicable-legislation-not-automatic-primary"), euRef(EU_SHARED_ART68_CLAIM_KEY), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-kindergeld-national-not-in-eu-core"), euRef("fb-elterngeld-national-not-in-eu-core"), deRef("de-fb-familienkasse-not-elterngeldstelle"), skRef("sk-fb-not-socialna-poistovna"), euRef("fb-national-rights-required-for-overlap"), deRef("kindergeld-not-elterngeld")]),
  binding("de-sk-fb-whole-family-facts", "Gesamte Familie als Sachverhalt führen", "Nur der erwerbstätige Elternteil wird als Fall angeboten", "Eltern A, Eltern B und Kind verlangen; zweite Tätigkeit nicht als nicht vorhanden setzen.", [euRef(EU_SHARED_ART60_CLAIM_KEY), euRef("moser-whole-family-secondary"), euRef("fb-moser-calculation-not-universal"), deRef("cross-border-fail-closed"), skRef("sk-child-change-8-days"), euRef("fb-multiple-children-not-one-child-state"), deRef("de-fb-kg-foreign-evidence"), skRef("sk-fb-channel-fetch-live"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("trapkowski-applicant-not-beneficiary")]),
  binding("de-sk-fb-child-by-child", "Kinder einzeln führen", "Mehrere Kinder oder unterschiedliche Kindwohnsitze werden zu einem Staat zusammengezogen", "Jedes Kind gesondert nach Wohnsitz und Zeitraum führen.", [euRef("fb-multiple-children-not-one-child-state"), euRef("fb-f3-family-member-not-global-family"), euRef(EU_SHARED_ART60_CLAIM_KEY), skRef("sk-child-one-payment-per-child"), deRef("de-fb-kg-change-reporting"), euRef("fb-child-residence-not-always-primary"), deRef("de-fb-channel-fetch-live"), skRef("sk-child-calendar-month"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-kindergeld-merits"), euRef("fb-f3-not-one-benefit-pair")]),
  binding("de-sk-fb-national-candidates", "Nationale Kandidatenleistungen sammeln", "Kindergeld, Elterngeld, prídavok oder rodičovský príspevok ohne nationale Prüfung", "Nationale Packs nicht duplizieren; mögliche Rechte listen, nicht erfinden.", [euRef("fb-national-rights-required-for-overlap"), euRef("fb-kindergeld-national-not-in-eu-core"), euRef("fb-elterngeld-national-not-in-eu-core"), skRef("sk-child-is-family-benefit"), skRef("sk-parental-is-family-benefit"), deRef("de-fb-does-not-copy-kindergeld-merits"), deRef("de-fb-does-not-copy-elterngeld-merits"), deRef("de-fb-kg-employment-not-automatic-entitlement"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-fb-name-not-classifier")]),
  binding("de-sk-fb-entitlement-gate", "Nationale Ansprüche voraussetzen", "Vorrang soll bestimmt werden, nationale Rechte sind unverifiziert", "Ohne verifizierte oder mögliche nationale Rechte fail-closed bleiben.", [euRef("fb-national-rights-required-for-overlap"), deRef("paying-state-not-inferred"), deRef("de-fb-kg-employment-not-automatic-entitlement"), skRef("sk-child-not-from-child-residence-alone"), skRef("sk-fb-application-not-approval"), deRef("de-fb-application-not-approval"), euRef(EU_SHARED_ART67_CLAIM_KEY), deRef("cross-border-competence-not-from-residence"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-secondary-not-no-entitlement")]),
  binding("de-sk-fb-eu-classification-gate", "EU-Familienleistungsklassifikation prüfen", "Eine Zahlung mit Kind, Geburt oder Elternbezug soll koordiniert werden", "Artikel 1 Buchstabe z verlangen; Namen nicht als Klassifikator nutzen.", [euRef(EU_SHARED_ART1Z_CLAIM_KEY), euRef("fb-class-requires-authority"), skRef("sk-fb-name-not-classifier"), skRef("sk-child-is-family-benefit"), skRef("sk-parental-is-family-benefit"), skRef("sk-parental-not-materske"), deRef("de-fb-kindergeld-not-elterngeld-route"), euRef("fb-class-excluded-annex-i"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-priplatok-family-benefit-current")]),
  binding("de-sk-fb-annex-i-gate", "Anhang-I-Ausschluss DE-SK prüfen", "Geburtsbeihilfe, Geburtszuschlag oder náhradné výživné wird als Familienleistung angeboten", "EXCLUDED_ANNEX_I setzen; nicht in den F3-Korb nehmen.", [euRef("fb-class-excluded-annex-i"), skRef("sk-birth-allowance-excluded-annex-i"), skRef("sk-birth-supplement-excluded-annex-i"), skRef("sk-substitute-maintenance-excluded"), euRef(EU_SHARED_ART1Z_CLAIM_KEY), skRef("sk-fb-name-not-classifier"), deRef("de-fb-channel-fetch-live"), skRef("sk-fb-channel-fetch-live"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-class-requires-authority")]),
  binding("de-sk-fb-basis-classify", "Anspruchsgrundlage ACTIVITY PENSION RESIDENCE einordnen", "Grundlage unklar, Arbeitslosigkeit oder Elternzeit wird als Wohnsitz angeboten", "Arbeitslosigkeit nicht universell als Grundlage setzen; Tätigkeit vor Rente vor Wohnsitz.", [euRef("fb-activity-before-pension-before-residence"), euRef("fb-unemployed-basis-not-universal"), euRef(EU_SHARED_ART68_CLAIM_KEY), deRef("de-fb-elg-cross-border-priority"), skRef("sk-parental-residence-or-eu"), euRef("fb-applicable-legislation-not-automatic-primary"), deRef("paying-state-not-inferred"), deRef("cross-border-fail-closed"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-child-residence-not-always-primary")]),
  binding("de-sk-fb-de-activity-sk-residence", "DE Erwerbstätigkeit gegen SK Wohnsitz", "Elternteil A arbeitet DE, B nicht erwerbstätig, Kind SK, nationale Rechte vorhanden", "Erwerbstätigkeitsbasiertes deutsches Recht vorrangig, slowakisches Wohnsitzrecht nachrangig, sofern Rechte bestehen.", [euRef("fb-de-activity-vs-sk-residence"), euRef("fb-activity-before-pension-before-residence"), euRef(EU_SHARED_ART67_CLAIM_KEY), euRef(EU_SHARED_ART682_CLAIM_KEY), deRef("de-fb-kg-cross-border-application"), skRef("sk-child-application"), deRef("de-fb-kg-employment-not-automatic-entitlement"), skRef("sk-child-not-from-child-residence-alone"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-national-rights-required-for-overlap")]),
  binding("de-sk-fb-sk-activity-de-residence", "SK Erwerbstätigkeit gegen DE Wohnsitz", "Elternteil A arbeitet SK, B nicht erwerbstätig, Kind DE, nationale Rechte vorhanden", "Slowakisches erwerbstätigkeitsbasiertes Recht vorrangig, deutsches Wohnsitzrecht nachrangig, sofern Rechte bestehen.", [euRef("fb-sk-activity-vs-de-residence"), euRef("fb-activity-before-pension-before-residence"), euRef(EU_SHARED_ART67_CLAIM_KEY), euRef(EU_SHARED_ART682_CLAIM_KEY), skRef("sk-child-application"), deRef("de-fb-kg-cross-border-application"), skRef("sk-child-eu-coord-not-sk-residence-only"), deRef("german-residence-not-always-primary"), skRef("sk-fb-upsvar-role"), deRef("de-fb-familienkasse-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-national-rights-required-for-overlap")]),
  binding("de-sk-fb-both-activity-child-sk", "Beide erwerbstätig, Kind SK", "A arbeitet DE, B arbeitet SK, Kind wohnt SK", "Gleicher Grundlage Erwerbstätigkeit: Wohnmitgliedstaat der Kinder hat Vorrang, sofern dort Tätigkeit besteht.", [euRef("fb-same-basis-activity-child-residence"), euRef(EU_SHARED_ART68_CLAIM_KEY), skRef("sk-child-is-family-benefit"), deRef("de-fb-kg-difference-route"), euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-higher-amount-not-automatic-primary"), deRef("de-fb-kg-amount-live-gate"), skRef("sk-child-amount-60-2026"), skRef("sk-fb-upsvar-role"), deRef("de-fb-familienkasse-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal")]),
  binding("de-sk-fb-both-activity-child-de", "Beide erwerbstätig, Kind DE", "A arbeitet DE, B arbeitet SK, Kind wohnt DE", "Gleicher Grundlage Erwerbstätigkeit: Wohnmitgliedstaat der Kinder DE hat Vorrang, sofern dort Tätigkeit besteht.", [euRef("fb-same-basis-activity-child-residence"), euRef(EU_SHARED_ART68_CLAIM_KEY), deRef("de-fb-kg-cross-border-application"), skRef("sk-child-application"), euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-higher-amount-not-automatic-primary"), deRef("amount-259-from-2026"), skRef("sk-child-amount-60-2026"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal")]),
  binding("de-sk-fb-child-third-state-art-58", "Kind in Drittstaat, Artikel 58", "A arbeitet DE, B arbeitet SK, Kind wohnt HU oder CZ", "Artikel 58 als Trägerkostenteilung führen; keinen DE-CZ- oder DE-HU-Familienkonnektor aktivieren.", [euRef("fb-unresolved-same-basis-activity"), euRef("fb-art-58-cost-sharing"), euRef(EU_SHARED_ART68_CLAIM_KEY), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), euRef("fb-child-residence-not-always-primary"), deRef("cross-border-fail-closed"), deRef("de-fb-channel-fetch-live"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), euRef("fb-exact-amount-fail-closed"), euRef("fb-no-naive-amount-calculator")]),
  binding("de-sk-fb-de-primary-sk-secondary", "DE vorrangig, SK nachrangig", "Verifizierter Vorrang DE, möglicher slowakischer Anspruch", "Deutschen Weg führen; Nachrang bedeutet nicht fehlenden slowakischen Anspruch.", [euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal"), deRef("de-fb-kg-cross-border-application"), skRef("sk-child-application"), deRef("de-fb-kg-difference-route"), euRef(EU_SHARED_F3_CLAIM_KEY), skRef("sk-child-is-family-benefit"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-f3-not-two-full-benefits")]),
  binding("de-sk-fb-sk-primary-de-secondary", "SK vorrangig, DE nachrangig", "Verifizierter Vorrang SK, möglicher deutscher Anspruch", "Slowakischen Weg führen; deutschen Unterschiedsbetrag nicht als volles zweites Kindergeld setzen.", [euRef(EU_SHARED_ART682_CLAIM_KEY), euRef("fb-secondary-not-no-entitlement"), euRef("fb-two-full-benefits-not-normal"), skRef("sk-child-application"), deRef("de-fb-kg-difference-route"), deRef("foreign-comparable-benefit-exclusion"), euRef(EU_SHARED_F3_CLAIM_KEY), skRef("sk-parental-is-family-benefit"), skRef("sk-fb-upsvar-role"), deRef("de-fb-familienkasse-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-f3-not-two-full-benefits")]),
  binding("de-sk-fb-f3-basket", "Beschluss-F3-Korb DE-SK", "Unterschiedsbetrag soll aus Kindergeld minus prídavok oder Elterngeld minus rodičovský príspevok gerechnet werden", "Pro Familienmitglied Körbe vergleichen; príplatok nur bei verifiziertem Anspruch; unvollständigen Korb fail-closed lassen.", [euRef(EU_SHARED_F3_CLAIM_KEY), euRef("fb-f3-secondary-compares-baskets"), euRef("fb-f3-not-one-benefit-pair"), euRef("fb-f3-not-two-full-benefits"), euRef("fb-f3-family-member-not-global-family"), skRef("sk-priplatok-family-benefit-current"), deRef("de-fb-kg-difference-route"), euRef("fb-exact-amount-fail-closed"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-parental-not-materske")]),
  binding("de-sk-fb-differential-input-gate", "Differenzeingaben prüfen", "Naive Paarung, unvollständiger F3-Korb oder unverglichene Perioden", "Keine Einzelleistungspaare; Perioden und Währungen verlangen.", [euRef("fb-no-naive-amount-calculator"), euRef("fb-f3-not-one-benefit-pair"), euRef("fb-currency-period-fail-closed"), deRef("de-fb-period-alignment-fail-closed"), deRef("de-fb-lebensmonat-not-calendar-month"), skRef("sk-child-calendar-month"), skRef("sk-parental-calendar-month"), euRef("fb-exact-amount-fail-closed"), deRef("de-fb-elterngeldstelle-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-kg-difference-route"), euRef("fb-f3-secondary-compares-baskets")]),
  binding("de-sk-fb-exact-amount-fail-closed", "Genaues Euro-Differenzverbot", "Nutzer verlangt 259 minus 60 oder Elterngeld minus 364,80", "Ohne verifizierte Ansprüche, Körbe, Perioden und aktuelle Sätze fail-closed bleiben.", [euRef("fb-exact-amount-fail-closed"), euRef("fb-no-naive-amount-calculator"), deRef("de-fb-kg-difference-route"), deRef("de-fb-kg-amount-live-gate"), skRef("sk-child-amount-60-2026"), skRef("sk-fb-amount-not-timeless"), deRef("amount-259-from-2026"), euRef("fb-currency-period-fail-closed"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-period-alignment-fail-closed"), euRef("fb-f3-not-one-benefit-pair")]),
  binding("de-sk-fb-kindergeld-differential-route", "Kindergeld-Unterschiedsbetrag zur Familienkasse", "Nachrangiges deutsches Kindergeld oder Differenzkindergeld", "An die Familienkasse verweisen; nicht 259 minus slowakischen Betrag versprechen.", [deRef("de-fb-kg-difference-route"), deRef("de-fb-familienkasse-role"), deRef("foreign-comparable-benefit-exclusion"), deRef("anlage-ausland-signals-foreign-facts"), deRef("de-fb-kg-cross-border-application"), euRef(EU_SHARED_ART682_CLAIM_KEY), deRef("amount-259-from-2026"), deRef("de-fb-kg-amount-live-gate"), deRef("de-fb-familienkasse-instance-fetch-live"), skRef("sk-child-amount-60-2026"), deRef("de-fb-does-not-copy-kindergeld-merits"), euRef("fb-exact-amount-fail-closed")]),
  binding("de-sk-fb-elterngeld-differential-route", "Elterngeld-Unterschiedsbetrag zur Elterngeldstelle", "Nachrangiges Elterngeld oder ausländischer Elternbeitrag", "An die Elterngeldstelle verweisen, nicht an die Familienkasse; Lebensmonat nicht mit Kalendermonat gleichsetzen.", [deRef("de-fb-elg-differential-to-elterngeldstelle"), deRef("de-fb-elterngeldstelle-role"), deRef("de-fb-elg-foreign-parental-interaction"), deRef("de-fb-lebensmonat-not-calendar-month"), skRef("sk-parental-calendar-month"), deRef("foreign-benefit-not-auto-exclusion"), euRef("moser-whole-family-secondary"), euRef("fb-moser-calculation-not-universal"), deRef("de-fb-elterngeldstelle-land-fetch-live"), skRef("sk-parental-is-family-benefit"), deRef("de-fb-familienkasse-not-elterngeldstelle"), deRef("de-fb-period-alignment-fail-closed")]),
  binding("de-sk-fb-sk-child-route", "Slowakischen Kinderzuschlag routen", "Prídavok na dieťa im DE-SK-Fall", "An ÚPSVaR verweisen, nicht an Sociálna poisťovňa; Kindwohnsitz nicht als automatischen Anspruch setzen.", [skRef("sk-child-application"), skRef("sk-child-is-family-benefit"), skRef("sk-fb-upsvar-role"), skRef("sk-fb-not-socialna-poistovna"), skRef("sk-child-not-from-child-residence-alone"), skRef("sk-child-amount-60-2026"), skRef("sk-child-first-grader-eu-requires-application"), skRef("sk-fb-application-not-approval"), skRef("sk-fb-upsvar-instance-fetch-live"), deRef("de-fb-kg-foreign-evidence"), skRef("sk-fb-does-not-copy-eu-law"), skRef("sk-fb-ustredie-not-universal-payer")]),
  binding("de-sk-fb-sk-parental-route", "Slowakischen Elternbeitrag routen", "Rodičovský príspevok im DE-SK-Fall", "Materské trennen; Betragsklasse 364,80 oder 500,10 nicht zeitlos setzen; Mutterschaft nicht automatisch ausschließen.", [skRef("sk-parental-application"), skRef("sk-parental-is-family-benefit"), skRef("sk-parental-not-materske"), skRef("sk-parental-amount-364-80-2026"), skRef("sk-parental-amount-500-10-2026"), skRef("sk-parental-maternity-amount-gate"), skRef("sk-parental-maternity-not-automatic-exclusion"), skRef("sk-parental-not-elterngeld-copy"), skRef("sk-fb-upsvar-role"), deRef("de-fb-elg-foreign-parental-interaction"), skRef("sk-fb-does-not-copy-eu-law"), skRef("sk-fb-not-socialna-poistovna")]),
  binding("de-sk-fb-application-forwarding", "Antragsweg und Weiterleitung", "Antrag bei Familienkasse, Elterngeldstelle oder ÚPSVaR, möglicherweise nicht vorrangig", "Falsch eingereicht nicht als verloren behandeln; Antragsdatum erhalten.", [euRef("fb-art-68-3-forwarding"), euRef("fb-filing-date-preserved"), euRef("fb-filed-secondary-not-lost"), deRef("de-fb-misfiled-not-lost"), deRef("de-fb-application-not-approval"), skRef("sk-fb-application-not-approval"), deRef("de-fb-eessi-institution-exchange"), deRef("anlage-ausland-signals-foreign-facts"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-elterngeldstelle-role"), euRef(EU_SHARED_ART60_CLAIM_KEY)]),
  binding("de-sk-fb-two-month-procedure", "Zweimonatsverfahren der Träger", "Nutzer erwartet Zahlung binnen zwei Monaten oder Trägerantwort", "Zweimonatsfrist ist Trägerantwort, kein Zahlungsversprechen.", [euRef("fb-two-month-institution-response"), euRef("fb-two-month-not-user-payment-guarantee"), euRef("fb-disagreement-routes-to-art-6"), deRef("de-fb-eessi-institution-exchange"), deRef("de-fb-application-not-approval"), skRef("sk-fb-application-not-approval"), euRef(EU_SHARED_ART60_CLAIM_KEY), deRef("de-fb-channel-fetch-live"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-filed-secondary-not-lost")]),
  binding("de-sk-fb-applicant-vs-payee", "Antragsteller und Zahlungsempfänger trennen", "Anderer Elternteil stellt den Antrag und hält sich für den Empfänger", "Antragsbefugnis ist nicht Empfangsberechtigung.", [euRef("trapkowski-applicant-not-beneficiary"), euRef("fb-other-parent-not-automatic-payee"), euRef(EU_SHARED_ART60_CLAIM_KEY), deRef("de-fb-kg-cross-border-application"), skRef("sk-child-application"), deRef("de-fb-application-not-approval"), skRef("sk-parental-one-family-entitlement"), deRef("de-fb-channel-fetch-live"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("moser-whole-family-secondary")]),
  binding("de-sk-fb-employment-leave-change", "Beschäftigungs- oder Elternzeitwechsel", "Elternzeit, Arbeitslosigkeit oder Beschäftigungsstaat wechselt", "Elternzeit nicht automatisch als Wohnsitzgrundlage; Arbeitslosigkeit nicht universell; erneut klassifizieren.", [euRef("fb-unemployed-basis-not-universal"), euRef("fb-activity-before-pension-before-residence"), deRef("de-fb-elg-cross-border-priority"), skRef("sk-child-change-8-days"), skRef("sk-parental-change-reporting"), deRef("de-fb-kg-change-reporting"), euRef("fb-art-59-month-end-continuation"), euRef("fb-mid-month-not-day-split"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-elterngeldstelle-role"), euRef("fb-applicable-legislation-not-automatic-primary")]),
  binding("de-sk-fb-child-residence-change", "Kindwohnsitzwechsel DE nach SK oder umgekehrt", "Kind zieht um, Vorrang soll fortgeschrieben werden", "Kindwohnsitz kann den Vorrang ändern; nicht automatisch den neuen Wohnstaat als vorrangig setzen.", [euRef("fb-child-residence-not-always-primary"), euRef("fb-same-basis-activity-child-residence"), skRef("sk-child-change-8-days"), deRef("de-fb-kg-change-reporting"), skRef("sk-child-not-from-child-residence-alone"), euRef(EU_SHARED_ART67_CLAIM_KEY), euRef("fb-art-59-month-end-continuation"), deRef("de-fb-channel-fetch-live"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-multiple-children-not-one-child-state")]),
  binding("de-sk-fb-mid-month-competence", "Kompetenzwechsel im Kalendermonat", "Beschäftigung oder Vorrang wechselt mitten im Monat", "Kein automatischer tagesweiser Schnitt; bisheriger Träger bis Monatsende.", [euRef("fb-art-59-month-end-continuation"), euRef("fb-mid-month-not-day-split"), skRef("sk-child-calendar-month"), skRef("sk-child-payment"), deRef("de-fb-lebensmonat-not-calendar-month"), deRef("de-fb-period-alignment-fail-closed"), deRef("de-fb-kg-change-reporting"), skRef("sk-parental-change-reporting"), deRef("de-fb-familienkasse-role"), skRef("sk-fb-upsvar-role"), deRef("de-fb-does-not-copy-eu-law"), euRef("fb-currency-period-fail-closed")]),
  binding("de-sk-fb-proposed-law-gate", "Vorgeschlagenes Recht 2016/0397 sperren", "Nutzer behandelt 2016/0397 oder Kindererziehungs-Sonderregeln als geltendes Recht", "Als nicht geltende Revision führen; nicht als aktuelles Elterngeld- oder Familienleistungsrecht speichern.", [euRef("pending-cod-2016-0397-family-not-current"), euRef("proposed-child-raising-category-not-current"), euRef(EU_SHARED_ART68_CLAIM_KEY), deRef("de-fb-does-not-copy-elterngeld-merits"), deRef("de-fb-does-not-copy-eu-law"), skRef("sk-fb-does-not-copy-eu-law"), deRef("de-fb-elg-cross-border-priority"), skRef("sk-parental-not-elterngeld-copy"), deRef("de-fb-elterngeldstelle-role"), skRef("sk-fb-upsvar-role"), euRef("fb-elterngeld-national-not-in-eu-core"), deRef("two-states-not-double-full")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const DE_SK_FAMILY_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "parent-a-works-de-b-inactive-child-sk", label: "Elternteil A arbeitet DE, B nicht erwerbstätig, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-de-activity-vs-sk-residence", "fb-national-rights-required-for-overlap"], requiredProcessKeys: ["de-sk-fb-de-activity-sk-residence"] },
  { id: "parent-a-works-sk-b-inactive-child-de", label: "Elternteil A arbeitet SK, B nicht erwerbstätig, Kind DE", coverage: "COVERED", requiredClaimKeys: ["fb-sk-activity-vs-de-residence"], requiredProcessKeys: ["de-sk-fb-sk-activity-de-residence"] },
  { id: "both-work-child-sk", label: "Beide erwerbstätig, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence"], requiredProcessKeys: ["de-sk-fb-both-activity-child-sk"] },
  { id: "both-work-child-de", label: "Beide erwerbstätig, Kind DE", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence"], requiredProcessKeys: ["de-sk-fb-both-activity-child-de"] },
  { id: "child-lives-hu-art-58", label: "Kind wohnt HU, Artikel 58, kein DE-HU-Konnektor", coverage: "COVERED", requiredClaimKeys: ["fb-unresolved-same-basis-activity", "fb-art-58-cost-sharing"], requiredProcessKeys: ["de-sk-fb-child-third-state-art-58"] },
  { id: "both-work-de-child-sk", label: "Beide arbeiten DE, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-de-activity-vs-sk-residence"], requiredProcessKeys: ["de-sk-fb-de-activity-sk-residence"] },
  { id: "both-work-sk-child-de", label: "Beide arbeiten SK, Kind DE", coverage: "COVERED", requiredClaimKeys: ["fb-sk-activity-vs-de-residence"], requiredProcessKeys: ["de-sk-fb-sk-activity-de-residence"] },
  { id: "parental-leave-not-automatic-residence", label: "Elternzeit nicht automatisch Wohnsitzgrundlage", coverage: "COVERED", requiredClaimKeys: ["fb-unemployed-basis-not-universal", "de-fb-elg-cross-border-priority"], requiredProcessKeys: ["de-sk-fb-employment-leave-change"] },
  { id: "unemployment-not-auto-basis", label: "Arbeitslosigkeit nicht automatische Anspruchsgrundlage", coverage: "COVERED", requiredClaimKeys: ["fb-unemployed-basis-not-universal"], requiredProcessKeys: ["de-sk-fb-basis-classify"] },
  { id: "nationality-independent", label: "Staatsangehörigkeit bestimmt den Vorrang nicht", coverage: "COVERED", requiredClaimKeys: ["fb-nationality-not-priority"], requiredProcessKeys: ["de-sk-fb-case-classify"] },
  { id: "locale-independent", label: "Locale bestimmt den Vorrang nicht", coverage: "COVERED", requiredClaimKeys: ["fb-user-locale-not-priority"], requiredProcessKeys: ["de-sk-fb-case-classify"] },
  { id: "kindergeld-259-live-gate", label: "Kindergeld 259 Euro Stand 2026-09-01", coverage: "COVERED", requiredClaimKeys: ["amount-259-from-2026", "de-fb-kg-amount-live-gate"], requiredProcessKeys: ["de-sk-fb-kindergeld-differential-route"] },
  { id: "sk-child-60-2026", label: "Slowakischer Kinderzuschlag 60 Euro 2026", coverage: "COVERED", requiredClaimKeys: ["sk-child-amount-60-2026", "sk-fb-amount-not-timeless"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "first-grader-sept-2026", label: "Erstklässlerzuschlag September 2026", coverage: "COVERED", requiredClaimKeys: ["sk-child-first-grader-110", "sk-child-first-grader-domestic-automatic"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "eu-first-grader-application", label: "Erstklässlerzuschlag bei EU-Kinderzuschlag nur auf Antrag", coverage: "COVERED", requiredClaimKeys: ["sk-child-first-grader-eu-requires-application"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "parental-364-80", label: "Elternbeitrag 364,80 Euro ohne vorheriges materské", coverage: "COVERED", requiredClaimKeys: ["sk-parental-amount-364-80-2026"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "parental-500-10", label: "Elternbeitrag 500,10 Euro nach materské", coverage: "COVERED", requiredClaimKeys: ["sk-parental-amount-500-10-2026"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "maternity-amount-gate", label: "Mutterschaftsgeld-Betragssperre des Elternbeitrags", coverage: "COVERED", requiredClaimKeys: ["sk-parental-maternity-amount-gate", "sk-parental-maternity-not-automatic-exclusion"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "naive-pairing-rejected", label: "Naive Paarung Kindergeld minus prídavok abgelehnt", coverage: "COVERED", requiredClaimKeys: ["fb-f3-not-one-benefit-pair", "fb-no-naive-amount-calculator"], requiredProcessKeys: ["de-sk-fb-f3-basket"] },
  { id: "f3-incomplete-fail-closed", label: "Unvollständiger F3-Korb fail-closed", coverage: "COVERED", requiredClaimKeys: ["fb-exact-amount-fail-closed", "fb-f3-secondary-compares-baskets"], requiredProcessKeys: ["de-sk-fb-f3-basket"] },
  { id: "lebensmonat-vs-calendar", label: "Lebensmonat gegen Kalendermonat", coverage: "COVERED", requiredClaimKeys: ["de-fb-lebensmonat-not-calendar-month", "sk-parental-calendar-month"], requiredProcessKeys: ["de-sk-fb-differential-input-gate"] },
  { id: "multiple-children", label: "Mehrere Kinder nicht ein Kinderstaat", coverage: "COVERED", requiredClaimKeys: ["fb-multiple-children-not-one-child-state"], requiredProcessKeys: ["de-sk-fb-child-by-child"] },
  { id: "misfiled-forwarding", label: "Falsch eingereichter Antrag weiterleiten", coverage: "COVERED", requiredClaimKeys: ["fb-art-68-3-forwarding", "de-fb-misfiled-not-lost"], requiredProcessKeys: ["de-sk-fb-application-forwarding"] },
  { id: "two-month-procedure", label: "Zweimonatsfrist der Träger", coverage: "COVERED", requiredClaimKeys: ["fb-two-month-institution-response", "fb-two-month-not-user-payment-guarantee"], requiredProcessKeys: ["de-sk-fb-two-month-procedure"] },
  { id: "trapkowski-applicant-vs-payee", label: "Trapkowski Antragsteller nicht Empfänger", coverage: "COVERED", requiredClaimKeys: ["trapkowski-applicant-not-beneficiary", "fb-other-parent-not-automatic-payee"], requiredProcessKeys: ["de-sk-fb-applicant-vs-payee"] },
  { id: "birth-allowance-excluded", label: "Geburtsbeihilfe Anhang I ausgeschlossen", coverage: "COVERED", requiredClaimKeys: ["sk-birth-allowance-excluded-annex-i", "fb-class-excluded-annex-i"], requiredProcessKeys: ["de-sk-fb-annex-i-gate"] },
  { id: "substitute-excluded", label: "Náhradné výživné Anhang I ausgeschlossen", coverage: "COVERED", requiredClaimKeys: ["sk-substitute-maintenance-excluded"], requiredProcessKeys: ["de-sk-fb-annex-i-gate"] },
  { id: "priplatok-classification", label: "Príplatok FAMILY_BENEFIT_CURRENT bei verifiziertem Anspruch", coverage: "COVERED", requiredClaimKeys: ["sk-priplatok-family-benefit-current", "sk-priplatok-amount-30-2026"], requiredProcessKeys: ["de-sk-fb-f3-basket"] },
  { id: "childcare-classification", label: "Kinderbetreuungsbeitrag CLASSIFICATION_REQUIRES_AUTHORITY", coverage: "COVERED", requiredClaimKeys: ["sk-childcare-classification-requires-authority", "fb-class-requires-authority"], requiredProcessKeys: ["de-sk-fb-eu-classification-gate"] },
  { id: "familienkasse-vs-elterngeldstelle", label: "Familienkasse gegen Elterngeldstelle", coverage: "COVERED", requiredClaimKeys: ["de-fb-familienkasse-not-elterngeldstelle", "kindergeld-not-elterngeld"], requiredProcessKeys: ["de-sk-fb-case-classify"] },
  { id: "familienkasse-vs-upsvar", label: "Familienkasse gegen ÚPSVaR", coverage: "COVERED", requiredClaimKeys: ["de-fb-familienkasse-role", "sk-fb-upsvar-role"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "upsvar-vs-socialna-poistovna", label: "ÚPSVaR gegen Sociálna poisťovňa", coverage: "COVERED", requiredClaimKeys: ["sk-fb-not-socialna-poistovna"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "proposed-2016-0397-blocked", label: "Vorschlag 2016/0397 nicht geltendes Recht", coverage: "COVERED", requiredClaimKeys: ["pending-cod-2016-0397-family-not-current", "proposed-child-raising-category-not-current"], requiredProcessKeys: ["de-sk-fb-proposed-law-gate"] },
  { id: "de-primary-sk-secondary-kindergeld", label: "DE vorrangig, SK nachrangig, Kindergeld-Differenz", coverage: "COVERED", requiredClaimKeys: ["fb-secondary-not-no-entitlement", "de-fb-kg-difference-route"], requiredProcessKeys: ["de-sk-fb-de-primary-sk-secondary"] },
  { id: "sk-primary-de-secondary-elterngeld", label: "SK vorrangig, DE nachrangig, Elterngeld-Differenz", coverage: "COVERED", requiredClaimKeys: ["de-fb-elg-differential-to-elterngeldstelle"], requiredProcessKeys: ["de-sk-fb-elterngeld-differential-route"] },
  { id: "kg-employment-not-automatic", label: "Deutsche Beschäftigung nicht automatischer Kindergeldanspruch", coverage: "COVERED", requiredClaimKeys: ["de-fb-kg-employment-not-automatic-entitlement"], requiredProcessKeys: ["de-sk-fb-entitlement-gate"] },
  { id: "elg-work-country-not-always-first", label: "Beschäftigungsstaat zahlt Elterngeld nicht immer zuerst", coverage: "COVERED", requiredClaimKeys: ["de-fb-elg-cross-border-priority", "eu-not-automatic-primary"], requiredProcessKeys: ["de-sk-fb-elterngeld-differential-route"] },
  { id: "period-alignment-fail-closed", label: "Periodenabgleich fail-closed", coverage: "COVERED", requiredClaimKeys: ["de-fb-period-alignment-fail-closed", "fb-currency-period-fail-closed"], requiredProcessKeys: ["de-sk-fb-differential-input-gate"] },
  { id: "first-grader-domestic-not-eu-automatic", label: "Inländische Erstklässlerautomatik nicht grenzüberschreitend", coverage: "COVERED", requiredClaimKeys: ["sk-child-first-grader-domestic-automatic", "sk-child-first-grader-eu-requires-application"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "materske-not-family-basket", label: "Materské nicht im Familienleistungskorb", coverage: "COVERED", requiredClaimKeys: ["sk-parental-not-materske"], requiredProcessKeys: ["de-sk-fb-eu-classification-gate"] },
  { id: "child-residence-sk-not-automatic-sk-entitlement", label: "Kindwohnsitz SK nicht automatischer SK-Anspruch", coverage: "COVERED", requiredClaimKeys: ["sk-child-not-from-child-residence-alone"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "name-not-classifier", label: "Leistungsname nicht Klassifikator", coverage: "COVERED", requiredClaimKeys: ["sk-fb-name-not-classifier", "art-1z-family-benefit"], requiredProcessKeys: ["de-sk-fb-eu-classification-gate"] },
  { id: "annex-i-gate", label: "Anhang-I-Tor", coverage: "COVERED", requiredClaimKeys: ["fb-class-excluded-annex-i", "sk-birth-supplement-excluded-annex-i"], requiredProcessKeys: ["de-sk-fb-annex-i-gate"] },
  { id: "national-entitlement-not-verified", label: "Nationale Ansprüche unverifiziert", coverage: "COVERED", requiredClaimKeys: ["fb-national-rights-required-for-overlap", "fb-kindergeld-national-not-in-eu-core"], requiredProcessKeys: ["de-sk-fb-national-candidates"] },
  { id: "f3-basket-comparison", label: "F3-Korbvergleich je Familienmitglied", coverage: "COVERED", requiredClaimKeys: ["decision-f3-per-family-member-comparison", "fb-f3-secondary-compares-baskets"], requiredProcessKeys: ["de-sk-fb-f3-basket"] },
  { id: "art-59-mid-month", label: "Artikel 59 Kompetenzwechsel im Monat", coverage: "COVERED", requiredClaimKeys: ["fb-art-59-month-end-continuation", "fb-mid-month-not-day-split"], requiredProcessKeys: ["de-sk-fb-mid-month-competence"] },
  { id: "child-residence-change", label: "Kind zieht DE nach SK", coverage: "COVERED", requiredClaimKeys: ["fb-child-residence-not-always-primary", "sk-child-change-8-days"], requiredProcessKeys: ["de-sk-fb-child-residence-change"] },
  { id: "employment-leave-change", label: "Beschäftigung oder Elternzeit wechselt", coverage: "COVERED", requiredClaimKeys: ["de-fb-kg-change-reporting", "sk-parental-change-reporting"], requiredProcessKeys: ["de-sk-fb-employment-leave-change"] },
  { id: "eessi-not-user-recreation", label: "EESSI ohne Nutzer-Neuerzeugung jedes Dokuments", coverage: "COVERED", requiredClaimKeys: ["de-fb-eessi-institution-exchange"], requiredProcessKeys: ["de-sk-fb-application-forwarding"] },
  { id: "application-not-approval", label: "Antrag nicht Genehmigung", coverage: "COVERED", requiredClaimKeys: ["de-fb-application-not-approval", "sk-fb-application-not-approval"], requiredProcessKeys: ["de-sk-fb-application-forwarding"] },
  { id: "amounts-not-timeless", label: "Beträge nicht zeitlos", coverage: "COVERED", requiredClaimKeys: ["sk-fb-amount-not-timeless", "de-fb-kg-amount-live-gate"], requiredProcessKeys: ["de-sk-fb-exact-amount-fail-closed"] },
  { id: "ustredie-not-universal-payer", label: "Ústredie nicht universeller Zahler", coverage: "COVERED", requiredClaimKeys: ["sk-fb-ustredie-not-universal-payer"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "not-health-insurer", label: "Krankenversicherung nicht Familienleistungsträger", coverage: "COVERED", requiredClaimKeys: ["sk-fb-not-health-insurer"], requiredProcessKeys: ["de-sk-fb-case-classify"] },
  { id: "moser-not-universal", label: "Moser-Berechnung nicht universell", coverage: "COVERED", requiredClaimKeys: ["moser-whole-family-secondary", "fb-moser-calculation-not-universal"], requiredProcessKeys: ["de-sk-fb-whole-family-facts"] },
  { id: "other-parent-not-payee", label: "Anderer Elternteil nicht automatischer Empfänger", coverage: "COVERED", requiredClaimKeys: ["fb-other-parent-not-automatic-payee"], requiredProcessKeys: ["de-sk-fb-applicant-vs-payee"] },
  { id: "two-full-benefits-rejected", label: "Zwei volle Leistungen abgelehnt", coverage: "COVERED", requiredClaimKeys: ["fb-two-full-benefits-not-normal", "fb-f3-not-two-full-benefits"], requiredProcessKeys: ["de-sk-fb-de-primary-sk-secondary"] },
  { id: "secondary-not-no-entitlement", label: "Nachrang nicht fehlender Anspruch", coverage: "COVERED", requiredClaimKeys: ["fb-secondary-not-no-entitlement"], requiredProcessKeys: ["de-sk-fb-sk-primary-de-secondary"] },
  { id: "currency-period-fail-closed", label: "Währung und Periode fail-closed", coverage: "COVERED", requiredClaimKeys: ["fb-currency-period-fail-closed"], requiredProcessKeys: ["de-sk-fb-exact-amount-fail-closed"] },
  { id: "sk-child-route", label: "Slowakischer Kinderzuschlagsweg", coverage: "COVERED", requiredClaimKeys: ["sk-child-application", "sk-fb-upsvar-role"], requiredProcessKeys: ["de-sk-fb-sk-child-route"] },
  { id: "sk-parental-route", label: "Slowakischer Elternbeitragsweg", coverage: "COVERED", requiredClaimKeys: ["sk-parental-application", "sk-parental-not-elterngeld-copy"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "de-elg-to-elterngeldstelle-not-fk", label: "Elterngeld-Differenz nicht an die Familienkasse", coverage: "COVERED", requiredClaimKeys: ["de-fb-elg-differential-to-elterngeldstelle", "de-fb-familienkasse-not-elterngeldstelle"], requiredProcessKeys: ["de-sk-fb-elterngeld-differential-route"] },
  { id: "parental-not-elterngeld-copy", label: "Rodičovský príspevok kopiert nicht BEEG", coverage: "COVERED", requiredClaimKeys: ["sk-parental-not-elterngeld-copy"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "sk-child-calendar-month", label: "Kinderzuschlag nach Kalendermonat", coverage: "COVERED", requiredClaimKeys: ["sk-child-calendar-month"], requiredProcessKeys: ["de-sk-fb-differential-input-gate"] },
  { id: "multiple-birth-increase", label: "Mehrlingszuschlag 25 Prozent", coverage: "COVERED", requiredClaimKeys: ["sk-parental-multiple-birth-increase"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "school-attendance-reduction", label: "Schulpflichtminderung 50 Prozent", coverage: "COVERED", requiredClaimKeys: ["sk-parental-school-attendance-reduction"], requiredProcessKeys: ["de-sk-fb-sk-parental-route"] },
  { id: "filing-date-preserved", label: "Antragsdatum bleibt erhalten", coverage: "COVERED", requiredClaimKeys: ["fb-filing-date-preserved", "fb-filed-secondary-not-lost"], requiredProcessKeys: ["de-sk-fb-application-forwarding"] },
  { id: "birth-supplement-excluded", label: "Geburtszuschlag Anhang I ausgeschlossen", coverage: "COVERED", requiredClaimKeys: ["sk-birth-supplement-excluded-annex-i"], requiredProcessKeys: ["de-sk-fb-annex-i-gate"] },
  { id: "uk-family-out-of-scope", label: "UK-Familienleistungsfall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-uk-family-out-of-scope"], requiredProcessKeys: ["de-sk-fb-case-classify"] },
  { id: "non-eu-bilateral-out-of-scope", label: "Nicht-EU-bilateraler Familienleistungsfall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["de-sk-fb-case-classify"] },
]);

export function evaluateDeSkFamilyProcessCompleteness() {
  const processKeys = new Set(DE_SK_FAMILY_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...DE_SK_FB_EU_CLAIM_KEYS,
    ...DE_SK_FB_DE_CLAIM_KEYS,
    ...DE_SK_FB_SK_CLAIM_KEYS,
  ]);
  const incomplete = DE_SK_FAMILY_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = DE_SK_FAMILY_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = DE_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = DE_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = DE_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
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
    processCount: DE_SK_FAMILY_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: DE_SK_FAMILY_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
    outOfScopeMissing,
  });
}

export function buildDeSkFamilyBenefitsCoordinationConnectorPack(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: DE_SK_FAMILY_CONNECTOR_PACK_ID,
    originMarket: "DE",
    connectedCountry: "SK",
    status: DE_SK_FAMILY_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "family-benefits-kindergeld-elterngeld",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: DE_FAMILY_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "DE" as const,
      trustDomain: "de" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: DE_SK_FB_DE_CLAIM_KEYS.map(deRef),
    euClaimRefs: DE_SK_FB_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: DE_SK_FB_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_FAMILY_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "DE_SK_FAMILY_BENEFITS_COORDINATION",
      userMustAct: true,
      germanAuthorityMustAct: true,
      foreignAuthorityMustAct: true,
      institutionExchangeExpected: true,
    }),
    requiredCaseRoles: Object.freeze(["PARENT_A", "PARENT_B", "CHILD"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: DE_SK_FAMILY_PROCESSES,
  });
}

export function deSkFamilyConnectorSummary(
  pack: CuratedCrossBorderConnectorPack = buildDeSkFamilyBenefitsCoordinationConnectorPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    status: pack.status,
    euRefCount: pack.euClaimRefs.length,
    deRefCount: pack.germanClaimRefs.length,
    skRefCount: pack.foreignClaimRefs.length,
    processCount: pack.corridorProcesses?.length ?? 0,
    completeness: evaluateDeSkFamilyProcessCompleteness(),
    validation: validateCuratedCrossBorderConnectorPack(pack),
  });
}
