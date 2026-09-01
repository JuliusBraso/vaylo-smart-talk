/**
 * CB-0H German operational routing for family-benefits coordination.
 * Does not restate Regulation 883/2004 Articles 67–69. EU family core owns legal merits.
 * Does not restate Kindergeld or Elterngeld national merits.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  DE_FAMILY_ROUTING_PACK_ID,
  DE_FAMILY_ROUTING_PROCESS_GROUP,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(DE_FAMILY_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const DE_FAMILY_PACK_ID = DE_FAMILY_ROUTING_PACK_ID;
export const DE_FAMILY_PROCESS_GROUP = DE_FAMILY_ROUTING_PROCESS_GROUP;
export const DE_FAMILY_PRIMARY_PROCESS_KEY = "de-kg-cross-border-application" as const;
export const DE_FAMILIENKASSE_ROLE = "DE_FAMILIENKASSE" as const;
export const DE_ELTERNGELDSTELLE_ROLE = "DE_ELTERNGELDSTELLE" as const;

export const DE_FAMILY_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "de-fb-kg-ausland",
    publisherKey: "ba" as const,
    officialDomain: "www.arbeitsagentur.de",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/kindergeld-kinderzuschlag-ausland",
    title: "Bundesagentur für Arbeit: Kindergeld und Kinderzuschlag mit Auslandsbezug",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-fb-kg-ausland-text",
      locator: "Kindergeld Ausland",
      text: "Bei Auslandsbezug führt der Kindergeldweg über KG1, Anlage Kind und Anlage Ausland KG 51. Formularfassungen sind live zu prüfen und nicht ohne Frische festzuschreiben. Deutsche Beschäftigung begründet nicht automatisch den Kindergeldanspruch. Ausländische Familienleistungsnachweise gehören zum Verfahren. Unterschiedsbetrag oder Differenzkindergeld richtet sich an die Familienkasse; 259 Euro minus einem slowakischen Betrag darf nicht als feste Differenz versprochen werden. Der aktuelle Kindergeldsatz der Bundesagentur beträgt mit Stand 1. September 2026 259 Euro und ist nicht zeitlos. Änderungen sind zu melden. Die Familienkasse ist nicht die Elterngeldstelle. Kindergeld ist nicht Elterngeld. Antrag ist nicht Genehmigung. Falsch eingereichte Anträge sind routingseitig nicht verloren; die unionsrechtliche Weiterleitung bleibt dem EU-Kern vorbehalten. Institutioneller Austausch über EESSI muss nicht durch die Person jedes Trägerdokument neu erzeugt werden.",
    }],
  },
  {
    key: "de-fb-familienkasse-locator",
    publisherKey: "ba" as const,
    officialDomain: "www.arbeitsagentur.de",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/familienkasse-finden",
    title: "Bundesagentur für Arbeit: Familienkasse finden",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "de-fb-familienkasse-locator-text",
      locator: "Familienkasse finden",
      text: "Die Kategorie ist DE_FAMILIENKASSE. Die genaue Amtsinstanz der Familienkasse ist live zu bestimmen. Aktuelle Formulare, Portale und Kontakte sind live zu prüfen. Die Familienkasse entscheidet nicht über Elterngeld.",
    }],
  },
  {
    key: "de-fb-elterngeldstelle-locator",
    publisherKey: "bmfsfj" as const,
    officialDomain: "www.familienportal.de",
    url: "https://www.familienportal.de/familienportal/meta/egr",
    title: "Familienportal: Elterngeldstellenfinder",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "de-fb-elterngeldstelle-locator-text",
      locator: "Elterngeldstellenfinder",
      text: "Die Kategorie ist DE_ELTERNGELDSTELLE. Die genaue Landes- oder örtliche Elterngeldstelle ist live zu bestimmen. Die Elterngeldstelle ist nicht die Familienkasse. Elterngeld-Unterschiedsbeträge gehen an die Elterngeldstelle, nicht an die Familienkasse.",
    }],
  },
  {
    key: "de-fb-elg-faq",
    publisherKey: "bmfsfj" as const,
    officialDomain: "www.familienportal.de",
    url: "https://www.familienportal.de/familienportal/familienleistungen/elterngeld/faq",
    title: "Familienportal: Elterngeld FAQ einschließlich Auslandsbezug",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-fb-elg-faq-text",
      locator: "Elterngeld FAQ Ausland",
      text: "Unionsrechtlicher Vorrang kann für Elterngeld gelten; der Beschäftigungsstaat zahlt nicht immer zuerst. Ausländischer Elternbeitrag schließt deutsches Elterngeld nicht automatisch aus und begründet keinen doppelten Vollanspruch. Elterngeld wird nach Lebensmonat des Kindes gezahlt, nicht nach Kalendermonat des slowakischen Elternbeitrags. Ohne Periodenabgleich bleibt die genaue Differenz unbeantwortet. Diese Routing-Sätze wiederholen nicht die nationalen Elterngeld- oder Kindergeldmerits und nicht die Artikel 67 bis 69.",
    }],
  },
]);

type Unit = Readonly<{
  key: string;
  category: string;
  type: "definition" | "exception" | "procedure" | "boundary";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "medium" | "high";
  requiresAuthorityResolution?: true;
}>;

export const DE_FAMILY_UNITS: readonly Unit[] = Object.freeze([
  { key: "de-fb-familienkasse-role", category: "institution", type: "definition", text: "Für Kindergeld mit Auslandsbezug ist die zuständige deutsche Stelle die Familienkasse der Kategorie DE_FAMILIENKASSE.", sourceKey: "de-fb-familienkasse-locator", passageKey: "de-fb-familienkasse-locator-text", riskLevel: "high" },
  { key: "de-fb-familienkasse-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue Amtsinstanz der Familienkasse ist live zu bestimmen und nicht ohne Frische festzuschreiben.", sourceKey: "de-fb-familienkasse-locator", passageKey: "de-fb-familienkasse-locator-text", riskLevel: "medium" },
  { key: "de-fb-elterngeldstelle-role", category: "institution", type: "definition", text: "Für Elterngeld mit Auslandsbezug ist die zuständige deutsche Stelle die Elterngeldstelle der Kategorie DE_ELTERNGELDSTELLE.", sourceKey: "de-fb-elterngeldstelle-locator", passageKey: "de-fb-elterngeldstelle-locator-text", riskLevel: "high" },
  { key: "de-fb-elterngeldstelle-land-fetch-live", category: "institution", type: "procedure", text: "Die genaue Landes- oder örtliche Elterngeldstelle ist live zu bestimmen und nicht ohne Frische festzuschreiben.", sourceKey: "de-fb-elterngeldstelle-locator", passageKey: "de-fb-elterngeldstelle-locator-text", riskLevel: "medium" },
  { key: "de-fb-familienkasse-not-elterngeldstelle", category: "institution", type: "exception", text: "Die Familienkasse ist nicht die Elterngeldstelle.", sourceKey: "de-fb-familienkasse-locator", passageKey: "de-fb-familienkasse-locator-text", riskLevel: "high" },
  { key: "de-fb-kindergeld-not-elterngeld-route", category: "institution", type: "exception", text: "Kindergeld ist nicht Elterngeld; der Kindergeldweg führt nicht zur Elterngeldstelle.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-does-not-copy-kindergeld-merits", category: "boundary", type: "boundary", text: "Diese Routing-Sätze wiederholen nicht die nationalen Kindergeldvoraussetzungen, Kindesdefinitionen oder Betragsmerits des Kindergeldkerns.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-does-not-copy-elterngeld-merits", category: "boundary", type: "boundary", text: "Diese Routing-Sätze wiederholen nicht die nationalen Elterngeldmerits nach dem BEEG.", sourceKey: "de-fb-elg-faq", passageKey: "de-fb-elg-faq-text", riskLevel: "high" },
  { key: "de-fb-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese deutschen Routing-Sätze wiederholen nicht die materiellen Artikel 67 bis 69. Die rechtliche Einordnung bleibt im geteilten EU-Familienkern.", sourceKey: "de-fb-elg-faq", passageKey: "de-fb-elg-faq-text", riskLevel: "high" },
  { key: "de-fb-kg-cross-border-application", category: "procedure", type: "procedure", text: "Der grenzüberschreitende Kindergeldantrag führt über KG1, Anlage Kind und Anlage Ausland KG 51; Formularfassungen sind live zu prüfen und nicht ohne Frische festzuschreiben.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-kg-employment-not-automatic-entitlement", category: "eligibility", type: "exception", text: "Deutsche Beschäftigung begründet nicht automatisch den Kindergeldanspruch.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-kg-foreign-evidence", category: "procedure", type: "procedure", text: "Ausländische Familienleistungsnachweise gehören zum Kindergeldverfahren mit Auslandsbezug.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-kg-difference-route", category: "procedure", type: "procedure", text: "Unterschiedsbetrag oder Differenzkindergeld richtet sich an die Familienkasse; 259 Euro minus einem slowakischen Betrag darf nicht als feste Differenz versprochen werden.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-fb-kg-change-reporting", category: "change", type: "procedure", text: "Änderungen des Wohnsitzes, der Beschäftigung, der Familie oder ausländischer Leistungen sind der Familienkasse zu melden.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-elg-cross-border-priority", category: "priority", type: "exception", text: "Unionsrechtlicher Vorrang kann für Elterngeld gelten; der Beschäftigungsstaat zahlt nicht immer zuerst.", sourceKey: "de-fb-elg-faq", passageKey: "de-fb-elg-faq-text", riskLevel: "high" },
  { key: "de-fb-elg-differential-to-elterngeldstelle", category: "procedure", type: "procedure", text: "Ein Elterngeld-Unterschiedsbetrag geht an die Elterngeldstelle, nicht an die Familienkasse.", sourceKey: "de-fb-elterngeldstelle-locator", passageKey: "de-fb-elterngeldstelle-locator-text", riskLevel: "high" },
  { key: "de-fb-elg-foreign-parental-interaction", category: "procedure", type: "exception", text: "Ausländischer Elternbeitrag schließt deutsches Elterngeld nicht automatisch aus und begründet keinen doppelten Vollanspruch.", sourceKey: "de-fb-elg-faq", passageKey: "de-fb-elg-faq-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-fb-kg-amount-live-gate", category: "amount", type: "definition", text: "Der aktuelle Kindergeldsatz der Bundesagentur beträgt mit Stand 1. September 2026 259 Euro; vor einer konkreten Auskunft ist CACHE_AND_REVALIDATE oder FETCH_LIVE erforderlich, der Betrag ist nicht zeitlos.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle Formulare, Portale und Kontakte der Familienkasse und der Elterngeldstelle sind live zu prüfen.", sourceKey: "de-fb-familienkasse-locator", passageKey: "de-fb-familienkasse-locator-text", riskLevel: "medium" },
  { key: "de-fb-application-not-approval", category: "deadline", type: "exception", text: "Antrag oder Vorlage von KG1 oder Elterngeldformularen ist nicht bereits genehmigter Anspruch.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-misfiled-not-lost", category: "procedure", type: "exception", text: "Ein beim nicht vorrangigen Träger gestellter Antrag ist routingseitig nicht verloren; die unionsrechtliche Weiterleitung bleibt dem EU-Kern vorbehalten.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "high" },
  { key: "de-fb-eessi-institution-exchange", category: "procedure", type: "definition", text: "Institutioneller Austausch über EESSI muss nicht durch die Person jedes Trägerdokument neu erzeugt werden.", sourceKey: "de-fb-kg-ausland", passageKey: "de-fb-kg-ausland-text", riskLevel: "medium" },
  { key: "de-fb-lebensmonat-not-calendar-month", category: "period", type: "exception", text: "Elterngeld wird nach Lebensmonat des Kindes gezahlt, nicht nach Kalendermonat des slowakischen Elternbeitrags.", sourceKey: "de-fb-elg-faq", passageKey: "de-fb-elg-faq-text", riskLevel: "high" },
  { key: "de-fb-period-alignment-fail-closed", category: "period", type: "procedure", text: "Ohne Abgleich von Lebensmonat und Kalendermonat bleibt die genaue Differenz unbeantwortet und darf nicht als Euro-Betrag genannt werden.", sourceKey: "de-fb-elg-faq", passageKey: "de-fb-elg-faq-text", riskLevel: "high", requiresAuthorityResolution: true },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const DE_FAMILY_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "de-fb-route-classify", title: "Deutschen Familienleistungsweg 2026 einordnen", trigger: "Kindergeld oder Elterngeld mit Auslandsbezug, Träger unbekannt", safeFirstStep: "Familienkasse und Elterngeldstelle trennen; nationale Merits nicht kopieren.", riskLevel: "high", dimensions: { what: "de-fb-familienkasse-role", whoWhen: "de-fb-elterngeldstelle-role", documents: "de-fb-channel-fetch-live", how: "de-fb-kindergeld-not-elterngeld-route", next: "de-fb-familienkasse-not-elterngeldstelle", deadlines: "de-fb-application-not-approval", problems: "de-fb-familienkasse-not-elterngeldstelle", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-eu-law", freshness: "de-fb-channel-fetch-live", negatives: "de-fb-kindergeld-not-elterngeld-route" } },
  { key: DE_FAMILY_PRIMARY_PROCESS_KEY, title: "Grenzüberschreitenden Kindergeldantrag 2026 führen", trigger: "Kindergeld mit Wohnsitz, Beschäftigung oder Kind im Ausland", safeFirstStep: "KG1, Anlage Kind und Anlage Ausland KG 51; Formulare live prüfen.", riskLevel: "high", dimensions: { what: "de-fb-kg-cross-border-application", whoWhen: "de-fb-familienkasse-role", documents: "de-fb-channel-fetch-live", how: "de-fb-kg-cross-border-application", next: "de-fb-application-not-approval", deadlines: "de-fb-application-not-approval", problems: "de-fb-kg-employment-not-automatic-entitlement", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-kindergeld-merits", freshness: "de-fb-familienkasse-instance-fetch-live", negatives: "de-fb-kg-employment-not-automatic-entitlement" } },
  { key: "de-familienkasse-authority", title: "Familienkasse 2026 live bestimmen", trigger: "Nutzer verlangt die zuständige Familienkasse", safeFirstStep: "Instanz live holen; nicht die Elterngeldstelle nennen.", riskLevel: "high", dimensions: { what: "de-fb-familienkasse-role", whoWhen: "de-fb-familienkasse-instance-fetch-live", documents: "de-fb-channel-fetch-live", how: "de-fb-familienkasse-instance-fetch-live", next: "de-fb-channel-fetch-live", deadlines: "de-fb-application-not-approval", problems: "de-fb-familienkasse-not-elterngeldstelle", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-eu-law", freshness: "de-fb-familienkasse-instance-fetch-live", negatives: "de-fb-familienkasse-not-elterngeldstelle" } },
  { key: "de-kg-foreign-evidence", title: "Ausländische Kindergeldnachweise 2026", trigger: "Ausländische Familienleistung oder Auslandsfakten zum Kindergeld", safeFirstStep: "Nachweise verlangen; Beschäftigung nicht als automatischen Anspruch setzen.", riskLevel: "high", dimensions: { what: "de-fb-kg-foreign-evidence", whoWhen: "de-fb-kg-employment-not-automatic-entitlement", documents: "de-fb-channel-fetch-live", how: "de-fb-kg-foreign-evidence", next: "de-fb-eessi-institution-exchange", deadlines: "de-fb-application-not-approval", problems: "de-fb-application-not-approval", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-kindergeld-merits", freshness: "de-fb-channel-fetch-live", negatives: "de-fb-kg-employment-not-automatic-entitlement" } },
  { key: "de-kg-difference-route", title: "Differenzkindergeld an die Familienkasse 2026", trigger: "Unterschiedsbetrag Kindergeld nachrangig oder Differenzkindergeld", safeFirstStep: "An die Familienkasse verweisen; 259 minus slowakischen Betrag nicht versprechen.", riskLevel: "high", dimensions: { what: "de-fb-kg-difference-route", whoWhen: "de-fb-familienkasse-role", documents: "de-fb-channel-fetch-live", how: "de-fb-kg-amount-live-gate", next: "de-fb-period-alignment-fail-closed", deadlines: "de-fb-kg-amount-live-gate", problems: "de-fb-kg-difference-route", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-kindergeld-merits", freshness: "de-fb-kg-amount-live-gate", negatives: "de-fb-kg-difference-route" } },
  { key: "de-kg-change-reporting", title: "Kindergeld Änderungen 2026 melden", trigger: "Wohnsitz, Beschäftigung, Familie oder ausländische Leistung ändert sich", safeFirstStep: "Änderungen der Familienkasse melden; alten Anspruch nicht fortschreiben.", riskLevel: "high", dimensions: { what: "de-fb-kg-change-reporting", whoWhen: "de-fb-kg-change-reporting", documents: "de-fb-channel-fetch-live", how: "de-fb-kg-change-reporting", next: "de-fb-kg-change-reporting", deadlines: "de-fb-application-not-approval", problems: "de-fb-application-not-approval", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-eu-law", freshness: "de-fb-channel-fetch-live", negatives: "de-fb-misfiled-not-lost" } },
  { key: "de-elg-cross-border-route", title: "Grenzüberschreitendes Elterngeld 2026 routen", trigger: "Elterngeld mit Wohnsitz oder Beschäftigung in zwei Staaten", safeFirstStep: "Nicht sagen, der Beschäftigungsstaat zahle immer zuerst; Elterngeldstelle live bestimmen.", riskLevel: "high", dimensions: { what: "de-fb-elg-cross-border-priority", whoWhen: "de-fb-elterngeldstelle-role", documents: "de-fb-channel-fetch-live", how: "de-fb-elg-foreign-parental-interaction", next: "de-fb-application-not-approval", deadlines: "de-fb-application-not-approval", problems: "de-fb-elg-cross-border-priority", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-elterngeldstelle-role", boundaries: "de-fb-does-not-copy-elterngeld-merits", freshness: "de-fb-elterngeldstelle-land-fetch-live", negatives: "de-fb-elg-cross-border-priority" } },
  { key: "de-elterngeldstelle-route", title: "Elterngeldstelle 2026 live bestimmen", trigger: "Nutzer verlangt die zuständige Elterngeldstelle oder sendet Elterngeld an die Familienkasse", safeFirstStep: "Landes- oder örtliche Stelle live holen; nicht die Familienkasse als Elterngeldträger führen.", riskLevel: "high", dimensions: { what: "de-fb-elterngeldstelle-role", whoWhen: "de-fb-elterngeldstelle-land-fetch-live", documents: "de-fb-channel-fetch-live", how: "de-fb-elg-differential-to-elterngeldstelle", next: "de-fb-channel-fetch-live", deadlines: "de-fb-application-not-approval", problems: "de-fb-familienkasse-not-elterngeldstelle", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-elterngeldstelle-role", boundaries: "de-fb-does-not-copy-elterngeld-merits", freshness: "de-fb-elterngeldstelle-land-fetch-live", negatives: "de-fb-familienkasse-not-elterngeldstelle" } },
  { key: "de-elg-foreign-parental-interaction", title: "Elterngeld und ausländischer Elternbeitrag 2026", trigger: "Rodičovský príspevok oder andere ausländische Elternleistung neben Elterngeld", safeFirstStep: "Nicht automatisch ausschließen; Lebensmonat und Kalendermonat nicht gleichsetzen.", riskLevel: "high", dimensions: { what: "de-fb-elg-foreign-parental-interaction", whoWhen: "de-fb-elg-differential-to-elterngeldstelle", documents: "de-fb-channel-fetch-live", how: "de-fb-lebensmonat-not-calendar-month", next: "de-fb-period-alignment-fail-closed", deadlines: "de-fb-period-alignment-fail-closed", problems: "de-fb-period-alignment-fail-closed", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-elterngeldstelle-role", boundaries: "de-fb-does-not-copy-elterngeld-merits", freshness: "de-fb-channel-fetch-live", negatives: "de-fb-lebensmonat-not-calendar-month" } },
  { key: "de-kg-current-value-gate", title: "Aktuellen Kindergeldsatz 2026 revalidieren", trigger: "Nutzer verlangt 259 Euro oder eine zeitlose Kindergeldhöhe", safeFirstStep: "Stand 1. September 2026 führen; Betrag nicht als zeitlos speichern.", riskLevel: "high", dimensions: { what: "de-fb-kg-amount-live-gate", whoWhen: "de-fb-kg-amount-live-gate", documents: "de-fb-channel-fetch-live", how: "de-fb-kg-amount-live-gate", next: "de-fb-period-alignment-fail-closed", deadlines: "de-fb-kg-amount-live-gate", problems: "de-fb-kg-difference-route", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-kindergeld-merits", freshness: "de-fb-kg-amount-live-gate", negatives: "de-fb-kg-difference-route" } },
  { key: "de-kg-vs-elg-authority-separation", title: "Familienkasse und Elterngeldstelle 2026 trennen", trigger: "Kindergeld- und Elterngeldweg werden vermengt oder falsch adressiert", safeFirstStep: "Träger trennen; falsch eingereicht nicht als verloren behandeln.", riskLevel: "high", dimensions: { what: "de-fb-familienkasse-not-elterngeldstelle", whoWhen: "de-fb-kindergeld-not-elterngeld-route", documents: "de-fb-channel-fetch-live", how: "de-fb-misfiled-not-lost", next: "de-fb-eessi-institution-exchange", deadlines: "de-fb-application-not-approval", problems: "de-fb-familienkasse-not-elterngeldstelle", dutiesAfter: "de-fb-kg-change-reporting", institution: "de-fb-familienkasse-role", boundaries: "de-fb-does-not-copy-eu-law", freshness: "de-fb-channel-fetch-live", negatives: "de-fb-kindergeld-not-elterngeld-route" } },
]);

export const DE_FAMILY_NEGATIVE_CONTROLS = Object.freeze([
  "de-fb-familienkasse-not-elterngeldstelle",
  "de-fb-kindergeld-not-elterngeld-route",
  "de-fb-kg-employment-not-automatic-entitlement",
  "de-fb-elg-cross-border-priority",
  "de-fb-does-not-copy-kindergeld-merits",
  "de-fb-does-not-copy-elterngeld-merits",
  "de-fb-does-not-copy-eu-law",
  "de-fb-lebensmonat-not-calendar-month",
]);

export function buildDeFamilyBenefitsCoordinationRoutingPack() {
  const trustDomain = item("trustDomain", "de", { code: "de" as const, name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal" as const, code: "DE" as const, countryCode: "DE" as const, name: "Bundesrepublik Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "federal", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    ba: item("publishers", "ba-familienkasse-routing", {
      name: "Familienkasse der Bundesagentur für Arbeit", type: "federal_agency",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    bmfsfj: item("publishers", "bmfsfj-elterngeld-routing", {
      name: "Bundesministerium für Familie, Senioren, Frauen und Jugend", type: "federal_agency",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    ba: item("authorities", "ba-familienkasse-routing-authority", {
      publisherId: publishers.ba.id, name: "Familienkasse der Bundesagentur für Arbeit", type: "federal_agency",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de/familie-und-kinder",
    }),
    bmfsfj: item("authorities", "bmfsfj-elterngeld-routing-authority", {
      publisherId: publishers.bmfsfj.id, name: "Familienportal des Bundes", type: "federal_agency",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.familienportal.de",
    }),
  };
  const publisherOf = { ba: publishers.ba, bmfsfj: publishers.bmfsfj };
  const authorityOf = { ba: authorities.ba, bmfsfj: authorities.bmfsfj };
  const sources = DE_FAMILY_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publisherOf[spec.publisherKey];
    const authority = authorityOf[spec.publisherKey];
    const origin = `https://${spec.officialDomain}`;
    const source = item("sources", spec.key, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: "official_guidance", purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: origin,
      sourceClass: spec.sourceClass, authorityLevel: "FEDERAL",
      retrievalMethod: spec.retrievalMethod, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false, publicationIdentifier: spec.title,
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id, versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "FETCH_LIVE" ? ["COUNTRY"] : ["PROCESS_VARIANT"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = DE_FAMILY_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`DE_FAMILY_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type, text: unit.text, jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id, authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel, requiresEffectiveDate: false,
      requiresAuthorityResolution: unit.requiresAuthorityResolution === true,
      temporalClass: "CURRENT" as const, category: unit.category,
    });
    const evidence = item("evidenceLinks", `${unit.key}:evidence`, {
      claimId: claim.id, sourceVersionId: source.version.id, passageId: passage.id,
      role: "official_guidance", primary: true,
    });
    const citation = item("citations", `${unit.key}:citation`, {
      claimId: claim.id, sourceId: source.source.id, sourceVersionId: source.version.id,
      passageId: passage.id, publisherId: source.source.publisherId,
      jurisdictionId: jurisdiction.id, label: source.spec.title, canonicalUrl: source.spec.url,
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim", entityId: claim.id, status: "fresh", effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });
  const processes = DE_FAMILY_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: DE_FAMILY_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of DE_FAMILY_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`DE_FAMILY_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: DE_FAMILY_PACK_ID,
    canonicalLanguage: "de" as const,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.ba, publishers.bmfsfj],
    authorities: [authorities.ba, authorities.bmfsfj],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    processes,
    processClaimLinks,
    handlingPolicies: sources.map(({ policy }) => policy),
    freshnessRecords: [
      ...sources.map(({ freshness }) => freshness),
      ...claims.map(({ claimFreshness }) => claimFreshness),
    ],
  });
}
