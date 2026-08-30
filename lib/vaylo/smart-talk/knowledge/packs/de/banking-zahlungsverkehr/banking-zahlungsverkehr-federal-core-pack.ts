/**
 * KNOWLEDGE-EXPANSION — German retail banking and payment-document
 * process-complete core.
 * Official-source G3 CuratedDomainPack for domain banking_zahlungsverkehr.
 * Canonical language is German only. Not a runtime route.
 *
 * This pack is the Zahlungsdienste / Zahlungskonto lifecycle. It does not
 * replace rechnung_mahnung, kuendigung_orientation or the insurance
 * authenticity pack and does not implement credit, securities or AML merits.
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";

export const BNK_DOMAIN = "banking_zahlungsverkehr" as const;
export const BNK_PACK_ID = BNK_DOMAIN;
export const BNK_CANONICAL_LANGUAGE = "de" as const;

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");

type FactoryItem = <T extends Readonly<Record<string, unknown>>>(
  entityClass: string,
  key: string,
  values: T,
) => Readonly<{ key: string; id: string } & T>;

function factory(packId: string): FactoryItem {
  return (entityClass, key, values) => Object.freeze({
    key,
    id: stableKnowledgeFactoryId(packId, entityClass, key),
    ...values,
  });
}

export type BnkUnitCategory =
  | "authorization"
  | "authenticity"
  | "classifier"
  | "security"
  | "unauthorized"
  | "liability"
  | "proof"
  | "notification"
  | "lastschrift"
  | "transfer"
  | "vop"
  | "instant"
  | "card"
  | "account"
  | "basiskonto"
  | "pkonto"
  | "complaint"
  | "deadline"
  | "boundary";

export type BnkContextKey = "EVENT_DATE" | "PROCESS_VARIANT" | "COUNTRY";
export type BnkHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type BnkFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type BnkStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type BnkInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL"
  | "SANCTION";
export type BnkProcessRole =
  | "orientation_basis"
  | "required_information"
  | "identification"
  | "application_route"
  | "evidence_requirement"
  | "next_state"
  | "deadline_gate"
  | "decision"
  | "legal_remedy_gate"
  | "context_gate"
  | "negative_control";
export type BnkScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const BNK_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type BnkTemporalClass = "current_2026";

export type BnkFutureChangeWatchItem = Readonly<{
  id: string;
  key: string;
  officialSourceUrl: string;
  officialDomain: string;
  officialSourceTitle: string;
  targetYear: 2026 | 2027 | 2028;
  status: "future_change_watch_not_ingestible";
  currentGuidance: false;
  description: string;
}>;

type OfficialSourceSpec = Readonly<{
  key: string;
  publisherKey: "bmj" | "bafin" | "bundesbank" | "bankenombud";
  authorityKey: "bmj" | "bafin" | "bundesbank" | "bankenombud";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_REGULATION" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: BnkInformationClass;
  handlingMode: BnkHandlingMode;
  freshnessClass: BnkFreshnessClass;
  staleBehavior: BnkStaleBehavior;
  requiredContextKeys: readonly BnkContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: BnkUnitCategory;
  temporal: BnkTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly BnkContextKey[];
}>;

type BnkProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

type BnkFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

type BnkBindingSpec = Readonly<{
  processKey: string;
  role: BnkProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
}>;

type BnkProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: BnkScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const BNK_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr/veroeffentlichungen/fragen-und-antworten-zu-echtzeitueberweisungen-und-empfaengerueberpruefung",
  officialDomain: "www.bundesbank.de",
  title: "Bundesbank Fragen zu Echtzeitüberweisung und Empfängerüberprüfung",
});

export const BNK_FUTURE_CHANGE_WATCH_ITEMS: readonly BnkFutureChangeWatchItem[] = Object.freeze([
  {
    id: "bnk-future-watch-instant-eu-2027",
    key: "future-instant-eu-2027",
    officialSourceUrl: BNK_FUTURE_WATCH_SOURCE.url,
    officialDomain: BNK_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: BNK_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Die Ausweitung der Echtzeitüberweisungs- und Empfängerüberprüfungspflicht auf die gesamte EU zum 9. Juli 2027 ist nicht als heutiger geografischer Anwendungsbereich ingestierbar.",
  },
  {
    id: "bnk-future-watch-psd3",
    key: "future-psd3-psr",
    officialSourceUrl: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/hilfe-kontakt/beschwerden-streitschlichtung/bei-bafin-beschweren/bei-bafin-beschweren_node.html",
    officialDomain: "www.bafin.de",
    officialSourceTitle: "BaFin Verbraucherbeschwerde",
    targetYear: 2028,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Vorgeschlagene oder politisch vereinbarte PSD3/PSR-Regelungen sind nicht heutiges Zahlungsdiensterecht.",
  },
  {
    id: "bnk-future-watch-pkonto-amounts",
    key: "future-pkonto-freibetrag",
    officialSourceUrl: "https://www.gesetze-im-internet.de/zpo/__850k.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "ZPO § 850k Pfändungsschutzkonto",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Euro-Freibeträge des P-Kontos sind nicht als zeitlose Schutzhöhe ingestierbar.",
  },
  {
    id: "bnk-future-watch-adr-2028",
    key: "future-adr-directive",
    officialSourceUrl: "https://bankenombudsmann.de/schlichtungsverfahren/verfahrensordnung",
    officialDomain: "bankenombudsmann.de",
    officialSourceTitle: "Verfahrensordnung Ombudsmann der privaten Banken",
    targetYear: 2028,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Die ADR-Änderungsrichtlinie 2025/2647 ist umzusetzen und nicht als heutige Schlichtungszuständigkeit ingestierbar.",
  },
]);

export const BNK_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  { key: "bgb-675c", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675c.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675c Zahlungsdienste", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675c-all", locator: "§ 675c", text: "Auf Geschäftsbesorgungsverträge über Zahlungsdienste gelten die besonderen Vorschriften der §§ 675c bis 676c BGB. Begriffsbestimmungen des KWG und ZAG sind anzuwenden. Wertpapier-, Kredit- oder Kryptogeschäfte sind nicht automatisch Zahlungsdienste." }] },
  { key: "bgb-675j", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675j.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675j Autorisierung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675j-all", locator: "§ 675j", text: "Ein Zahlungsvorgang ist gegenüber dem Zahler nur wirksam, wenn er ihm zugestimmt hat (Autorisierung). Art und Weise der Zustimmung sind zu vereinbaren. Geld, das das Konto verlassen hat, ist nicht automatisch unautorisiert." }] },
  { key: "bgb-675k", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675k.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675k Sperrung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675k-all", locator: "§ 675k", text: "Ein Zahlungsinstrument darf bei vereinbarten Sicherheits-, Missbrauchs- oder Kreditrisikogründen gesperrt werden. Der Zahler ist über die Sperrung und soweit zulässig über Gründe zu unterrichten. Kartensperre ist nicht Kontoschließung." }] },
  { key: "bgb-675l", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675l.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675l Nutzerpflichten", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675l-all", locator: "§ 675l", text: "Der Zahlungsdienstnutzer muss personalisierte Sicherheitsmerkmale vor unbefugtem Zugriff schützen und Verlust, Diebstahl oder missbräuchliche Nutzung unverzüglich anzeigen. PIN, TAN oder Passwort dürfen nicht an Dritte oder an BIRELLO weitergegeben werden." }] },
  { key: "bgb-675g", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675g.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675g Vertragsänderung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675g-all", locator: "§ 675g", text: "Änderungen des Zahlungsdiensterahmenvertrags sind mindestens zwei Monate vorher in der gesetzlich vorgesehenen Form anzubieten. Schweigen gilt nur bei vereinbarter Zustimmungswirkung und Hinweis auf Ablehnung und kostenfreie fristlose Kündigung. Das gilt nicht automatisch für jedes Bankprodukt." }] },
  { key: "bgb-675h", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675h.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675h Kündigung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675h-all", locator: "§ 675h", text: "Der Nutzer kann den Zahlungsdiensterahmenvertrag jederzeit kündigen; eine vereinbarte Frist darf einen Monat nicht überschreiten. Der Anbieter darf unbestimmte Verträge nur bei vereinbartem Kündigungsrecht mit mindestens zwei Monaten Frist kündigen. Das Basiskonto folgt besonderen ZKG-Regeln." }] },
  { key: "bgb-675o", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675o.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675o Ablehnung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675o-all", locator: "§ 675o", text: "Lehnt der Zahlungsdienstleister einen Auftrag ab, muss er unverzüglich und innerhalb der Ausführungsfrist unterrichten sowie soweit möglich Gründe und Korrekturmöglichkeiten angeben. Gründe dürfen unterbleiben, soweit anderes Recht die Angabe verbietet. Ablehnung ist nicht Kontokündigung." }] },
  { key: "bgb-675p", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675p.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675p Unwiderruflichkeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675p-all", locator: "§ 675p", text: "Nach Zugang beim Zahlungsdienstleister des Zahlers kann ein Zahlungsauftrag grundsätzlich nicht mehr widerrufen werden. Ausnahmen gelten für Lastschrift und terminierte Aufträge bis zum Ende des Geschäftstags vor dem Fälligkeitstag sowie für später vereinbarten Widerruf. Storno ist keine garantierte Rückholung." }] },
  { key: "bgb-675r", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675r.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675r Kundenkennung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675r-all", locator: "§ 675r", text: "Zahlungsdienstleister dürfen einen Vorgang ausschließlich anhand der angegebenen Kundenkennung, regelmäßig der IBAN, ausführen. Stimmen IBAN und Ausführung überein, gilt der Vorgang gegenüber dem so bezeichneten Empfänger als ordnungsgemäß. Falsche IBAN ist nicht automatisch unautorisiert." }] },
  { key: "bgb-675t", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675t.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675t Wertstellung Sperrung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675t-all", locator: "§ 675t", text: "Bei kartengebundenen Vorgängen darf ein verfügbarer Betrag nur gesperrt werden, wenn der Zahler der genauen Höhe zugestimmt hat. Die Sperre ist unverzüglich aufzuheben, sobald der genaue Betrag oder der Auftrag vorliegt. Reservierung ist nicht die endgültige Belastung." }] },
  { key: "bgb-675u", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675u.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675u nicht autorisierte Zahlung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675u-all", locator: "§ 675u", text: "Bei nicht autorisiertem Zahlungsvorgang hat der Zahlungsdienstleister keinen Erstattungsanspruch gegen den Zahler und muss den Betrag unverzüglich, spätestens bis zum Ende des folgenden Geschäftstags nach Anzeige oder Kenntnis, erstatten und das Konto wiederherstellen. Bei schriftlich mitgeteiltem berechtigten Betrugsverdacht prüft er unverzüglich. Eine Polizeianzeige ist nicht gesetzliche Voraussetzung." }] },
  { key: "bgb-675v", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675v.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675v Haftung des Zahlers", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675v-all", locator: "§ 675v", text: "Bei Missbrauch eines verlorenen, gestohlenen oder sonst missbräuchlich verwendeten Zahlungsinstruments kann der Anbieter bis zu 50 Euro verlangen, mit gesetzlichen Ausnahmen. Volle Haftung droht bei Betrug oder vorsätzlicher oder grob fahrlässiger Pflichtverletzung. Nach Sperranzeige und bei fehlender starker Kundenauthentifizierung entfällt die Haftung, außer bei Betrug des Zahlers. 50 Euro sind kein automatischer Selbstbehalt jedes Falls." }] },
  { key: "bgb-675w", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675w.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675w Nachweis", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675w-all", locator: "§ 675w", text: "Ist die Autorisierung streitig, muss der Zahlungsdienstleister Authentifizierung und ordnungsgemäße Aufzeichnung nachweisen. Die bloße Aufzeichnung von Karten-, PIN-, TAN- oder App-Nutzung reicht allein nicht notwendig aus, um Autorisierung, Betrug, Pflichtverletzung oder grobe Fahrlässigkeit zu beweisen. Dafür sind unterstützende Beweismittel vorzulegen." }] },
  { key: "bgb-675x", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675x.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675x Lastschrifterstattung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675x-all", locator: "§ 675x", text: "Bei autorisierten SEPA-Basislastschriften besteht ohne Angabe von Gründen ein Erstattungsanspruch innerhalb von acht Wochen ab Belastung. Das ist nicht die 13-Monatsfrist unautorisierter Vorgänge. Die Bankerstattung tilgt nicht automatisch die zugrunde liegende Forderung des Zahlungsempfängers." }] },
  { key: "bgb-675y", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__675y.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 675y fehlerhafte Ausführung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-675y-all", locator: "§ 675y", text: "Bei nicht erfolgter oder fehlerhafter Ausführung eines vom Zahler ausgelösten Auftrags kann unverzügliche ungekürzte Erstattung verlangt werden, außer der Auftrag wurde anhand der fehlerhaften Kundenkennung ordnungsgemäß ausgeführt. Dann muss sich der Anbieter im Rahmen seiner Möglichkeiten um Wiedererlangung bemühen und bei Unmöglichkeit auf schriftlichen Antrag verfügbare Informationen mitteilen. Recall ist keine garantierte Rückzahlung." }] },
  { key: "bgb-676b", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__676b.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 676b Anzeigefrist", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-676b-all", locator: "§ 676b", text: "Nicht autorisierte oder fehlerhaft ausgeführte Vorgänge sind unverzüglich nach Feststellung anzuzeigen. Ansprüche sind ausgeschlossen, wenn die Anzeige nicht spätestens 13 Monate nach Belastung erfolgt, sofern die gesetzliche Unterrichtung erteilt wurde. 13 Monate sind keine Empfehlung zu warten und nicht die Achtwochenfrist autorisierter Lastschriften." }] },
  { key: "zkg-31", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/zkg/__31.html", officialDomain: "www.gesetze-im-internet.de", title: "ZKG § 31 Basiskontoanspruch", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "zkg-31-all", locator: "§ 31", text: "Institute, die Verbrauchern Zahlungskonten anbieten, müssen mit Berechtigten einen Basiskontovertrag schließen. Berechtigt ist jeder Verbraucher mit rechtmäßigem Aufenthalt in der EU einschließlich bestimmter Personen ohne festen Wohnsitz. Das Angebot ist unverzüglich, spätestens binnen zehn Geschäftstagen nach Antragseingang zu unterbreiten." }] },
  { key: "zkg-34", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/zkg/__34.html", officialDomain: "www.gesetze-im-internet.de", title: "ZKG § 34 Basiskontoablehnung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "zkg-34-all", locator: "§ 34", text: "Ein Basiskontoantrag darf nur aus den gesetzlich genannten Gründen abgelehnt werden, unverzüglich und spätestens binnen zehn Geschäftstagen, in Textform mit Gründen soweit zulässig sowie Hinweis auf Verwaltungsverfahren und Schlichtung. Die Bank darf nicht aus beliebigem Grund ablehnen." }] },
  { key: "zkg-38", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/zkg/__38.html", officialDomain: "www.gesetze-im-internet.de", title: "ZKG § 38 Basiskontodienste", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "zkg-38-all", locator: "§ 38", text: "Die gesetzlich vorgeschriebenen Basiskontodienste nach § 38 ZKG sind in Euro ohne Kreditgeschäft zu erbringen und umfassen Ein- und Auszahlung, Lastschriften, Überweisungen einschließlich Dauerauftrag sowie Kartenzahlungen. Dieser gesetzliche Mindestumfang ist kein automatisches kostenloses Konto und begründet keinen Dispo- oder Kreditanspruch." }] },
  { key: "zkg-39", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/zkg/__39.html", officialDomain: "www.gesetze-im-internet.de", title: "ZKG § 39 weitere Dienstleistungen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "zkg-39-all", locator: "§ 39", text: "Unbeschadet des § 32 ZKG dürfen Institut und Kontoinhaber zusätzlich Dienstleistungen zum Basiskonto vereinbaren, die nicht von § 38 erfasst sind. Das schließt ausdrücklich eine eingeräumte Überziehungsmöglichkeit nach § 504 BGB und ein Entgelt für eine geduldete Überziehung nach § 505 BGB ein. Ein vereinbarter Dispo ist nicht der gesetzliche Mindestanspruch und kein zwingendes Bankangebot." }] },
  { key: "zkg-42", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/zkg/__42.html", officialDomain: "www.gesetze-im-internet.de", title: "ZKG § 42 Basiskontokündigung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "zkg-42-all", locator: "§ 42", text: "Das Institut darf den Basiskontovertrag nur unter den besonderen Voraussetzungen des § 42 ZKG kündigen. Die allgemeine ordentliche Kündigung nach § 675h BGB reicht dafür allein nicht. Unbequemlichkeit der Beziehung ist kein Kündigungsgrund." }] },
  { key: "zpo-850k", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/zpo/__850k.html", officialDomain: "www.gesetze-im-internet.de", title: "ZPO § 850k Pfändungsschutzkonto", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "zpo-850k-all", locator: "§ 850k", text: "Eine natürliche Person kann jederzeit verlangen, dass ein dort geführtes Zahlungskonto als Pfändungsschutzkonto geführt wird, auch bei negativem Saldo. Das P-Konto selbst wird ausschließlich auf Guthabenbasis geführt. Jede Person darf nur ein P-Konto unterhalten. Bei bestehender Pfändung kann die Umstellung zum Beginn des vierten folgenden Geschäftstages verlangt werden. P-Konto macht Schulden nicht gegenstandslos und schützt nicht jedes Guthaben automatisch." }] },
  { key: "bafin-vop", publisherKey: "bafin", authorityKey: "bafin", url: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/themen-finanzprodukte/konten-zahlungen/zahlungen/ueberweisungen-und-lastschriften/empfaengerueberpruefung/empfaengerueberpruefung_node.html", officialDomain: "www.bafin.de", title: "BaFin Empfängerüberprüfung", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "bafin-vop-all", locator: "VoP", text: "Seit dem 9. Oktober 2025 müssen Institute im Euroraum bei Euro-Eingangs- und Echtzeitüberweisungen zwischen Zahlungskonten eine Empfängerüberprüfung durchführen. Das Ergebnis erscheint vor der Autorisierung in der Bankumgebung. Ein Treffer bedeutet nicht, dass Empfänger oder Rechnung vertrauenswürdig sind. Eine E-Mail oder SMS, die eine VoP verlangt, ist nicht der normale Ablauf." }] },
  { key: "bafin-basiskonto", publisherKey: "bafin", authorityKey: "bafin", url: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/themen-finanzprodukte/konten-zahlungen/konten/basiskonto/basiskonto_node.html", officialDomain: "www.bafin.de", title: "BaFin Basiskonto", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "bafin-basiskonto-all", locator: "Basiskonto", text: "Das Basiskonto hat besonderen Kündigungsschutz und nur angemessene Entgelte. Es kann als P-Konto geführt werden. Bei Ablehnung oder Kündigung stehen Verwaltungsverfahren, Zivilgericht und Verbraucherschlichtung offen. Es ist nicht automatisch kostenlos und begründet keinen automatischen Dispoanspruch." }] },
  { key: "bafin-complaint", publisherKey: "bafin", authorityKey: "bafin", url: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/hilfe-kontakt/beschwerden-streitschlichtung/bei-bafin-beschweren/bei-bafin-beschweren_node.html", officialDomain: "www.bafin.de", title: "BaFin Verbraucherbeschwerde", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "AUTHORITY_COMPETENCE", handlingMode: "FETCH_LIVE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "bafin-complaint-all", locator: "Beschwerde", text: "Die BaFin schützt kollektiv und entscheidet nicht den einzelnen Zivilanspruch. Zuerst soll schriftlich das Institut um Stellungnahme gebeten werden. Während der BaFin-Beschwerde laufen Fristen weiter. Logo oder angezeigte Telefonnummer beweisen nicht die Echtheit einer Bankmail. Ob ein Institut beaufsichtigt wird, ergibt die Unternehmensdatenbank." }] },
  { key: "bundesbank-vop", publisherKey: "bundesbank", authorityKey: "bundesbank", url: "https://www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr/veroeffentlichungen/fragen-und-antworten-zu-echtzeitueberweisungen-und-empfaengerueberpruefung", officialDomain: "www.bundesbank.de", title: "Bundesbank Echtzeitüberweisung und Empfängerüberprüfung", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "bundesbank-vop-all", locator: "FAQ", text: "Ab 9. Oktober 2025 müssen Zahlungsdienstleister im Euroraum Echtzeitüberweisungen senden und empfangen können und Empfängerüberprüfung bei herkömmlichen und Echtzeitüberweisungen durchführen. Die Prüfung findet in der Bankumgebung vor der Freigabe statt, nie per Mail, SMS oder Anruf zur Datenherausgabe. Instant ist nicht frei widerruflich. Gebühren dürfen nicht höher sein als bei der vergleichbaren gewöhnlichen Überweisung. Die EU-weite Ausweitung zum 9. Juli 2027 ist nicht heutiger Anwendungsbereich." }] },
  { key: "bundesbank-schlichtung", publisherKey: "bundesbank", authorityKey: "bundesbank", url: "https://www.bundesbank.de/de/service/schlichtungsstelle/-/schlichtungsverfahren-613580", officialDomain: "www.bundesbank.de", title: "Bundesbank Schlichtungsstelle", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "AUTHORITY_COMPETENCE", handlingMode: "FETCH_LIVE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "bundesbank-schlichtung-all", locator: "Schlichtung", text: "Die Schlichtungsstelle der Deutschen Bundesbank ist Auffangzuständigkeit und nicht zuständig, soweit eine anerkannte private Verbraucherschlichtungsstelle kompetent ist. Sie kann unter anderem Überweisungen, Lastschriften, Kartenzahlungen, Basiskonto und Kontenwechsel betreffen. Sie ist nicht automatisch die erste Stelle für jede Bank." }] },
  { key: "bankenombud-ordnung", publisherKey: "bankenombud", authorityKey: "bankenombud", url: "https://bankenombudsmann.de/schlichtungsverfahren/verfahrensordnung", officialDomain: "bankenombudsmann.de", title: "Ombudsmann der privaten Banken Verfahrensordnung", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "bankenombud-ordnung-all", locator: "Verfahrensordnung 2026", text: "Die Verfahrensordnung des Ombudsmanns der privaten Banken gilt für Anträge ab dem 1. Januar 2026 und nur gegenüber teilnehmenden privaten Banken. Sie gilt nicht automatisch für Sparkassen, Genossenschaftsbanken oder jedes Fintech. Teilnahme ist live zu prüfen." }] },
  { key: "bankenombud-ablauf", publisherKey: "bankenombud", authorityKey: "bankenombud", url: "https://bankenombudsmann.de/schlichtungsverfahren/ablauf-des-verfahrens", officialDomain: "bankenombudsmann.de", title: "Ombudsmann der privaten Banken Ablauf", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "bankenombud-ablauf-all", locator: "Ablauf", text: "Der Schlichtungsantrag ist in Textform mit Sachverhalt, Begehren und Unterlagen zu stellen. Die Bank wird zur Stellungnahme aufgefordert. Ein Schlichtungsvorschlag ist kein Gerichtsurteil. Gerichtlicher Rechtsschutz bleibt erhalten." }] },
]);

export const BNK_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "authorization-required", category: "authorization", temporal: "current_2026", type: "definition", text: "Ein Zahlungsvorgang ist gegenüber dem Zahler nur wirksam, wenn er autorisiert, also zugestimmt, wurde.", sourceKey: "bgb-675j", passageKey: "bgb-675j-all", riskLevel: "high" },
  { key: "money-left-not-unauthorized", category: "authorization", temporal: "current_2026", type: "exception", text: "Dass Geld das Konto verlassen hat, bedeutet nicht automatisch eine unautorisierte Zahlung.", sourceKey: "bgb-675j", passageKey: "bgb-675j-all", riskLevel: "high" },
  { key: "fraud-not-automatically-unauthorized", category: "authorization", temporal: "current_2026", type: "exception", text: "Ein Betrug bedeutet nicht automatisch, dass die Zahlung rechtlich unautorisiert war.", sourceKey: "bgb-675j", passageKey: "bgb-675j-all", riskLevel: "high" },
  { key: "deceived-not-automatically-675u", category: "authorization", temporal: "current_2026", type: "exception", text: "Wer getäuscht wurde und selbst zugestimmt hat, fällt nicht automatisch unter § 675u BGB.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high" },
  { key: "tan-not-automatically-authorized", category: "authorization", temporal: "current_2026", type: "exception", text: "Die Nutzung einer TAN beweist nicht automatisch die Autorisierung durch den Kunden.", sourceKey: "bgb-675w", passageKey: "bgb-675w-all", riskLevel: "high" },
  { key: "auth-record-not-authorization", category: "proof", temporal: "current_2026", type: "exception", text: "Die technische Aufzeichnung einer Authentifizierung beweist nicht automatisch die Autorisierung.", sourceKey: "bgb-675w", passageKey: "bgb-675w-all", riskLevel: "high" },
  { key: "bank-says-authorized-not-final", category: "authorization", temporal: "current_2026", type: "exception", text: "Wenn die Bank autorisiert sagt, ist die Rechtsfrage nicht abschließend entschieden.", sourceKey: "bgb-675w", passageKey: "bgb-675w-all", riskLevel: "high" },
  { key: "unclear-authorization-fail-closed", category: "authorization", temporal: "current_2026", type: "exception", text: "Ist unklar, ob autorisiert, unautorisiert, streitig oder unter Täuschung zugestimmt wurde, darf ohne weitere Tatsachen nicht abschließend geantwortet werden.", sourceKey: "bgb-675j", passageKey: "bgb-675j-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "userlocale-not-jurisdiction", category: "boundary", temporal: "current_2026", type: "exception", text: "Die userLocale bestimmt nicht das anwendbare Zahlungsdiensterecht und nicht die zuständige Schlichtungsstelle.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "high", requiredContextKeys: ["COUNTRY"] },
  { key: "logo-not-authenticity", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein Banklogo beweist nicht die Echtheit einer Bankmail.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "sender-name-not-verified", category: "authenticity", temporal: "current_2026", type: "exception", text: "Der angezeigte Absendername ist nicht die verifizierte Bank.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "phone-display-not-verified", category: "authenticity", temporal: "current_2026", type: "exception", text: "Eine angezeigte Telefonnummer ist nicht der verifizierte Bankanruf.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "knows-account-not-employee", category: "authenticity", temporal: "current_2026", type: "exception", text: "Wer Kontodaten kennt, ist nicht automatisch ein Bankmitarbeiter.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "tan-request-not-safe", category: "authenticity", temporal: "current_2026", type: "exception", text: "Eine TAN-Anfrage ist nicht sicher, nur weil die Nachricht Bank behauptet.", sourceKey: "bgb-675l", passageKey: "bgb-675l-all", riskLevel: "high" },
  { key: "safe-account-not-legitimate", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein Sicherheitskonto ist nicht automatisch ein legitimes Bankverfahren.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "high" },
  { key: "email-vop-not-normal", category: "authenticity", temporal: "current_2026", type: "exception", text: "Eine Empfängerüberprüfung per E-Mail oder SMS ist nicht der normale VoP-Ablauf.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "high" },
  { key: "independent-official-contact", category: "authenticity", temporal: "current_2026", type: "procedure", text: "Bei verdächtiger Bankkommunikation ist unabhängig über einen bekannten offiziellen Bankkanal Kontakt aufzunehmen.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "high" },
  { key: "never-share-pin-tan", category: "authenticity", temporal: "current_2026", type: "duty", text: "PIN, TAN, pushTAN-Freigabe oder Onlinebanking-Passwort dürfen weder an BIRELLO noch an angebliche Helfer weitergegeben werden.", sourceKey: "bgb-675l", passageKey: "bgb-675l-all", riskLevel: "high" },
  { key: "birello-not-login", category: "authenticity", temporal: "current_2026", type: "exception", text: "BIRELLO ist keine Bankanmeldeoberfläche und kein TAN-Prüfdienst.", sourceKey: "bgb-675l", passageKey: "bgb-675l-all", riskLevel: "high" },
  { key: "giro-is-payment-account", category: "classifier", temporal: "current_2026", type: "definition", text: "Ein Girokonto ist ein Zahlungskonto für den laufenden Zahlungsverkehr und nicht automatisch ein Basiskonto oder P-Konto.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "medium" },
  { key: "lastschrift-not-transfer", category: "classifier", temporal: "current_2026", type: "exception", text: "Eine SEPA-Lastschrift ist keine Überweisung.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "firmenlastschrift-not-consumer-same", category: "classifier", temporal: "current_2026", type: "exception", text: "Die SEPA-Firmenlastschrift ist nicht dasselbe Verbraucherregime wie die SEPA-Basislastschrift.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "debit-not-credit-card", category: "classifier", temporal: "current_2026", type: "exception", text: "Eine Debit- oder girocard-Zahlung ist nicht automatisch eine Kreditkartenzahlung.", sourceKey: "bgb-675t", passageKey: "bgb-675t-all", riskLevel: "medium" },
  { key: "notify-loss-without-delay", category: "security", temporal: "current_2026", type: "duty", text: "Verlust, Diebstahl oder missbräuchliche Nutzung eines Zahlungsinstruments sind unverzüglich anzuzeigen.", sourceKey: "bgb-675l", passageKey: "bgb-675l-all", riskLevel: "high" },
  { key: "lost-card-not-automatic-loss", category: "security", temporal: "current_2026", type: "exception", text: "Eine verlorene Karte bedeutet nicht automatisch den Verlust des Geldes.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high" },
  { key: "block-not-cancel-authorized", category: "security", temporal: "current_2026", type: "exception", text: "Die Kartensperre storniert nicht automatisch bereits autorisierte Zahlungen.", sourceKey: "bgb-675k", passageKey: "bgb-675k-all", riskLevel: "high" },
  { key: "post-block-no-liability", category: "liability", temporal: "current_2026", type: "definition", text: "Nach der Sperranzeige haftet der Zahler grundsätzlich nicht mehr für spätere Missbräuche, außer bei eigenem Betrug.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high" },
  { key: "card-block-not-account-closed", category: "security", temporal: "current_2026", type: "exception", text: "Eine gesperrte Karte ist nicht das geschlossene Konto.", sourceKey: "bgb-675k", passageKey: "bgb-675k-all", riskLevel: "high" },
  { key: "online-block-not-forfeiture", category: "security", temporal: "current_2026", type: "exception", text: "Gesperrtes Onlinebanking bedeutet nicht, dass das Guthaben rechtlich verfallen ist.", sourceKey: "bgb-675k", passageKey: "bgb-675k-all", riskLevel: "high" },
  { key: "account-restrict-not-crime", category: "security", temporal: "current_2026", type: "exception", text: "Eine Kontosperre oder Einschränkung ist nicht automatisch ein Schuldvorwurf einer Straftat.", sourceKey: "bgb-675k", passageKey: "bgb-675k-all", riskLevel: "high" },
  { key: "section-675u-refund", category: "unauthorized", temporal: "current_2026", type: "duty", text: "Bei nicht autorisierter Zahlung muss der Anbieter den Betrag unverzüglich, spätestens bis zum Ende des folgenden Geschäftstags nach Anzeige oder Kenntnis, erstatten.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high" },
  { key: "unauthorized-not-indefinite-wait", category: "unauthorized", temporal: "current_2026", type: "exception", text: "Bei unautorisierter Zahlung darf die Bank nicht unbegrenzt zuwarten.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high" },
  { key: "no-merchant-first-default", category: "unauthorized", temporal: "current_2026", type: "exception", text: "Der Kunde muss das Geld nicht zuerst beim Händler holen, bevor § 675u BGB gilt.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high" },
  { key: "police-not-prerequisite", category: "unauthorized", temporal: "current_2026", type: "exception", text: "Eine Polizeianzeige ist nicht die gesetzliche Voraussetzung der Bankerstattung nach § 675u BGB.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "medium" },
  { key: "do-not-promise-if-disputed", category: "unauthorized", temporal: "current_2026", type: "exception", text: "Ist die Autorisierung streitig und unvollständig, darf keine bestimmte Erstattung zugesagt werden.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "fifty-euro-cap", category: "liability", temporal: "current_2026", type: "definition", text: "Vor der Anzeige kann bei bestimmtem Missbrauch eines Zahlungsinstruments eine Haftung bis 50 Euro in Betracht kommen.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "medium" },
  { key: "fifty-not-automatic-deductible", category: "liability", temporal: "current_2026", type: "exception", text: "50 Euro sind kein automatischer Selbstbehalt jeder unautorisierten Zahlung.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high" },
  { key: "victim-not-automatically-fifty", category: "liability", temporal: "current_2026", type: "exception", text: "Ein Betrugsopfer haftet nicht automatisch mit 50 Euro.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high" },
  { key: "phishing-not-automatically-gross", category: "liability", temporal: "current_2026", type: "exception", text: "Phishing ist nicht automatisch grobe Fahrlässigkeit.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high" },
  { key: "tan-not-automatically-gross", category: "liability", temporal: "current_2026", type: "exception", text: "Eine eingegebene TAN ist nicht automatisch grobe Fahrlässigkeit.", sourceKey: "bgb-675w", passageKey: "bgb-675w-all", riskLevel: "high" },
  { key: "lost-card-not-full-liability", category: "liability", temporal: "current_2026", type: "exception", text: "Eine verlorene Karte begründet nicht automatisch volle Haftung.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high" },
  { key: "gross-neg-not-from-outcome", category: "liability", temporal: "current_2026", type: "exception", text: "Grobe Fahrlässigkeit darf nicht allein aus dem Schadensverlauf geschlossen werden.", sourceKey: "bgb-675w", passageKey: "bgb-675w-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "supporting-evidence-required", category: "proof", temporal: "current_2026", type: "duty", text: "Für Betrug, Vorsatz oder grobe Fahrlässigkeit muss der Anbieter unterstützende Beweismittel vorlegen.", sourceKey: "bgb-675w", passageKey: "bgb-675w-all", riskLevel: "high" },
  { key: "notify-without-delay-676b", category: "notification", temporal: "current_2026", type: "duty", text: "Nicht autorisierte oder fehlerhaft ausgeführte Zahlungen sind unverzüglich nach Feststellung anzuzeigen.", sourceKey: "bgb-676b", passageKey: "bgb-676b-all", riskLevel: "high" },
  { key: "thirteen-months-outer", category: "notification", temporal: "current_2026", type: "deadline", text: "Die äußere Anzeigefrist beträgt grundsätzlich 13 Monate nach Belastung, sofern die gesetzliche Unterrichtung erteilt wurde.", sourceKey: "bgb-676b", passageKey: "bgb-676b-all", riskLevel: "high" },
  { key: "thirteen-not-wait-advice", category: "notification", temporal: "current_2026", type: "exception", text: "13 Monate sind keine Empfehlung, 13 Monate zu warten.", sourceKey: "bgb-676b", passageKey: "bgb-676b-all", riskLevel: "high" },
  { key: "thirteen-not-eight-weeks", category: "notification", temporal: "current_2026", type: "exception", text: "13 Monate sind nicht die Achtwochenfrist der autorisierten SEPA-Basislastschrift.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "eight-week-authorized-debit", category: "lastschrift", temporal: "current_2026", type: "deadline", text: "Eine autorisierte SEPA-Basislastschrift kann innerhalb von acht Wochen ab Belastung ohne Angabe von Gründen erstattet verlangt werden.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "medium" },
  { key: "eight-not-unauthorized-outer", category: "lastschrift", temporal: "current_2026", type: "exception", text: "Acht Wochen sind nicht die Außenfrist unautorisierter Zahlungen.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "reversal-not-debt-gone", category: "lastschrift", temporal: "current_2026", type: "exception", text: "Die Rückgabe einer Lastschrift tilgt nicht automatisch die zugrunde liegende Forderung.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "unauthorized-debit-uses-675u", category: "lastschrift", temporal: "current_2026", type: "procedure", text: "Eine Lastschrift ohne wirksame Autorisierung folgt dem Rahmen nicht autorisierter Zahlungen, nicht der Achtwochenregel.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high" },
  { key: "transfer-not-freely-reversible", category: "transfer", temporal: "current_2026", type: "exception", text: "Eine autorisierte Überweisung ist nach Ausführung nicht frei widerruflich.", sourceKey: "bgb-675p", passageKey: "bgb-675p-all", riskLevel: "high" },
  { key: "storno-not-guaranteed", category: "transfer", temporal: "current_2026", type: "exception", text: "Ein Storno oder Recall ist keine garantierte Rückholung.", sourceKey: "bgb-675p", passageKey: "bgb-675p-all", riskLevel: "high" },
  { key: "wrong-iban-not-unauthorized", category: "transfer", temporal: "current_2026", type: "exception", text: "Eine falsch eingegebene IBAN ist nicht automatisch eine unautorisierte Zahlung.", sourceKey: "bgb-675r", passageKey: "bgb-675r-all", riskLevel: "high" },
  { key: "wrong-iban-not-guaranteed-refund", category: "transfer", temporal: "current_2026", type: "exception", text: "Eine falsche IBAN begründet nicht automatisch eine Bankerstattung.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "high" },
  { key: "wrong-iban-recovery-duty", category: "transfer", temporal: "current_2026", type: "procedure", text: "Wurde nach der fehlerhaften Kundenkennung ordnungsgemäß ausgeführt, muss sich der Anbieter um Wiedererlangung bemühen und bei Unmöglichkeit auf schriftlichen Antrag verfügbare Informationen mitteilen.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "high" },
  { key: "scam-transfer-not-automatically-675u", category: "transfer", temporal: "current_2026", type: "exception", text: "Eine selbst autorisierte Betrugsüberweisung ist nicht automatisch ein unautorisierter Vorgang.", sourceKey: "bgb-675j", passageKey: "bgb-675j-all", riskLevel: "high" },
  { key: "scam-contact-bank-immediately", category: "transfer", temporal: "current_2026", type: "procedure", text: "Nach einer Betrugsüberweisung sind weitere Zahlungen zu stoppen, die Bank sofort um Recall zu bitten, Zugang zu sichern und Beweise zu sichern, ohne Erstattung zuzusagen.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "high" },
  { key: "do-not-blame-or-promise-scam", category: "transfer", temporal: "current_2026", type: "exception", text: "Bei einer autorisierten Betrugsüberweisung darf weder Erstattung zugesagt noch grobe Fahrlässigkeit ohne Tatsachen festgestellt werden.", sourceKey: "bgb-675v", passageKey: "bgb-675v-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "vop-since-2025", category: "vop", temporal: "current_2026", type: "definition", text: "Seit dem 9. Oktober 2025 prüfen Institute im Euroraum bei relevanten SEPA- und Echtzeitüberweisungen den Empfängernamen zur IBAN vor der Autorisierung.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "medium", requiresEffectiveDate: true },
  { key: "vop-match-not-trust", category: "vop", temporal: "current_2026", type: "exception", text: "Ein VoP-Treffer bedeutet nicht, dass der Empfänger vertrauenswürdig ist.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "high" },
  { key: "vop-match-not-invoice-legit", category: "vop", temporal: "current_2026", type: "exception", text: "Ein VoP-Treffer bedeutet nicht, dass Rechnung oder Zahlungsaufforderung echt sind.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "high" },
  { key: "vop-warning-not-auto-block", category: "vop", temporal: "current_2026", type: "exception", text: "Eine VoP-Warnung sperrt die Überweisung nicht automatisch in jedem Fall.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "medium" },
  { key: "vop-not-fraud-insurance", category: "vop", temporal: "current_2026", type: "exception", text: "Die Empfängerüberprüfung ist keine Betrugsvollkasko.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "high" },
  { key: "vop-inside-banking", category: "vop", temporal: "current_2026", type: "procedure", text: "Die Empfängerüberprüfung findet in der Bankumgebung vor der Freigabe statt.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "medium" },
  { key: "instant-not-reversible", category: "instant", temporal: "current_2026", type: "exception", text: "Eine Echtzeitüberweisung ist nicht deshalb frei widerruflich, weil sie schnell ist.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "high" },
  { key: "instant-fee-not-higher", category: "instant", temporal: "current_2026", type: "definition", text: "Entgelte für die Echtzeitüberweisung dürfen nicht höher sein als für die vergleichbare gewöhnliche Überweisung.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "medium" },
  { key: "instant-contact-immediately", category: "instant", temporal: "current_2026", type: "procedure", text: "Bei falscher oder betrügerischer Echtzeitüberweisung ist die Bank unverzüglich zu kontaktieren.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "high" },
  { key: "chargeback-not-675u", category: "card", temporal: "current_2026", type: "exception", text: "Ein kartenrechtliches Chargeback ist nicht die gesetzliche Erstattung nach § 675u BGB.", sourceKey: "bgb-675u", passageKey: "bgb-675u-all", riskLevel: "high" },
  { key: "merchant-dispute-not-unauthorized", category: "card", temporal: "current_2026", type: "exception", text: "Ein Händlerstreit über nicht gelieferte Ware ist nicht automatisch eine unautorisierte Kartenzahlung.", sourceKey: "bgb-675j", passageKey: "bgb-675j-all", riskLevel: "high" },
  { key: "scheme-not-statute", category: "card", temporal: "current_2026", type: "exception", text: "Visa- oder Mastercard-Verfahrensregeln sind nicht deutsches Gesetzesrecht.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "high" },
  { key: "card-reversal-not-debt-gone", category: "card", temporal: "current_2026", type: "exception", text: "Eine rückabgewickelte Kartenzahlung tilgt nicht notwendig die Händlerforderung.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "reservation-not-final-debit", category: "card", temporal: "current_2026", type: "exception", text: "Eine Kartensperre oder Reservierung ist nicht die endgültige Belastung.", sourceKey: "bgb-675t", passageKey: "bgb-675t-all", riskLevel: "medium" },
  { key: "reservation-needs-exact-consent", category: "card", temporal: "current_2026", type: "duty", text: "Die Sperrung eines Kartenbetrags setzt die Zustimmung zur genauen Höhe voraus.", sourceKey: "bgb-675t", passageKey: "bgb-675t-all", riskLevel: "medium" },
  { key: "refusal-not-termination", category: "account", temporal: "current_2026", type: "exception", text: "Eine abgelehnte Zahlung ist nicht die Kontokündigung.", sourceKey: "bgb-675o", passageKey: "bgb-675o-all", riskLevel: "high" },
  { key: "refusal-reason-may-be-withheld", category: "account", temporal: "current_2026", type: "exception", text: "Die Bank muss nicht jeden Ablehnungsgrund mitteilen, wenn anderes Recht die Angabe verbietet.", sourceKey: "bgb-675o", passageKey: "bgb-675o-all", riskLevel: "high" },
  { key: "delay-not-lost", category: "transfer", temporal: "current_2026", type: "exception", text: "Eine verspätete Überweisung bedeutet nicht, dass das Geld verloren ist.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "medium" },
  { key: "recipient-missing-not-auto-liability", category: "transfer", temporal: "current_2026", type: "exception", text: "Wenn der Empfänger Geld vermisst, haftet die Zahlerbank nicht automatisch.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "high" },
  { key: "trace-not-refund", category: "transfer", temporal: "current_2026", type: "exception", text: "Eine Nachforschung ist nicht automatisch eine Erstattung.", sourceKey: "bgb-675y", passageKey: "bgb-675y-all", riskLevel: "medium" },
  { key: "two-month-change-notice", category: "account", temporal: "current_2026", type: "deadline", text: "Änderungen des Zahlungsdiensterahmenvertrags sind mindestens zwei Monate vorher anzubieten.", sourceKey: "bgb-675g", passageKey: "bgb-675g-all", riskLevel: "medium" },
  { key: "silence-not-universal-consent", category: "account", temporal: "current_2026", type: "exception", text: "Schweigen ist nicht die universelle Zustimmung zu jeder Bankvertragsänderung.", sourceKey: "bgb-675g", passageKey: "bgb-675g-all", riskLevel: "high" },
  { key: "two-months-not-every-change", category: "account", temporal: "current_2026", type: "exception", text: "Zwei Monate sind nicht die Frist jeder Bankenänderung.", sourceKey: "bgb-675g", passageKey: "bgb-675g-all", riskLevel: "high" },
  { key: "new-terms-not-automatically-valid", category: "account", temporal: "current_2026", type: "exception", text: "Eine Bankmail über neue Bedingungen ist nicht automatisch wirksam.", sourceKey: "bgb-675g", passageKey: "bgb-675g-all", riskLevel: "high" },
  { key: "fee-not-automatically-lawful", category: "account", temporal: "current_2026", type: "exception", text: "Ein berechnetes Entgelt ist nicht automatisch rechtmäßig.", sourceKey: "bgb-675g", passageKey: "bgb-675g-all", riskLevel: "high" },
  { key: "fee-not-automatically-unlawful", category: "account", temporal: "current_2026", type: "exception", text: "Ein missliebiges Entgelt ist nicht automatisch rechtswidrig.", sourceKey: "bgb-675g", passageKey: "bgb-675g-all", riskLevel: "high" },
  { key: "price-list-not-statute", category: "account", temporal: "current_2026", type: "exception", text: "Das Preis- und Leistungsverzeichnis ist kein Gesetz.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "medium" },
  { key: "customer-can-terminate", category: "account", temporal: "current_2026", type: "definition", text: "Der Kunde kann den Zahlungsdiensterahmenvertrag kündigen; eine vereinbarte Frist darf einen Monat nicht überschreiten.", sourceKey: "bgb-675h", passageKey: "bgb-675h-all", riskLevel: "medium" },
  { key: "provider-two-months", category: "account", temporal: "current_2026", type: "deadline", text: "Der Anbieter darf einen unbestimmten Zahlungsdiensterahmenvertrag nur bei vereinbartem Recht mit mindestens zwei Monaten Frist kündigen.", sourceKey: "bgb-675h", passageKey: "bgb-675h-all", riskLevel: "medium" },
  { key: "bank-not-immediate-without-rule", category: "account", temporal: "current_2026", type: "exception", text: "Die Bank darf nicht jedes Zahlungskonto ohne Regel und Grund sofort kündigen.", sourceKey: "bgb-675h", passageKey: "bgb-675h-all", riskLevel: "high" },
  { key: "giro-not-basiskonto-termination", category: "account", temporal: "current_2026", type: "exception", text: "Die ordentliche Girokonto-Kündigung nach § 675h BGB ist nicht das Basiskonto-Kündigungsregime.", sourceKey: "zkg-42", passageKey: "zkg-42-all", riskLevel: "high" },
  { key: "immediate-not-automatically-unlawful", category: "account", temporal: "current_2026", type: "exception", text: "Eine sofortige Schließung ist nicht automatisch rechtswidrig.", sourceKey: "bgb-675h", passageKey: "bgb-675h-all", riskLevel: "high" },
  { key: "no-reason-not-automatically-unlawful", category: "account", temporal: "current_2026", type: "exception", text: "Fehlende volle Begründung ist nicht automatisch rechtswidrig, wo Mitteilung verboten ist.", sourceKey: "bgb-675o", passageKey: "bgb-675o-all", riskLevel: "high" },
  { key: "compliance-not-crime-proof", category: "account", temporal: "current_2026", type: "exception", text: "Der Hinweis auf Compliance-Gründe beweist nicht, dass der Kunde eine Straftat begangen hat.", sourceKey: "bgb-675k", passageKey: "bgb-675k-all", riskLevel: "high" },
  { key: "basiskonto-claim", category: "basiskonto", temporal: "current_2026", type: "definition", text: "Verbraucher mit rechtmäßigem Aufenthalt in der EU können unter den gesetzlichen Voraussetzungen ein Basiskonto verlangen.", sourceKey: "zkg-31", passageKey: "zkg-31-all", riskLevel: "medium" },
  { key: "basiskonto-not-free", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Ein Basiskonto ist nicht automatisch ein kostenloses Konto.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "high" },
  { key: "basiskonto-not-dispo", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Ein Basiskonto begründet keinen automatischen Dispoanspruch.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "high" },
  { key: "basiskonto-section-38-no-credit", category: "basiskonto", temporal: "current_2026", type: "definition", text: "Die gesetzlich vorgeschriebenen Basiskontodienste nach § 38 ZKG enthalten kein Kreditgeschäft und begründen keinen Kredit- oder Dispoanspruch.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "high" },
  { key: "basiskonto-section-39-agreed-overdraft", category: "basiskonto", temporal: "current_2026", type: "definition", text: "Nach § 39 ZKG dürfen Bank und Kontoinhaber zusätzlich eine eingeräumte Überziehung nach § 504 BGB oder ein Entgelt für geduldete Überziehung nach § 505 BGB vereinbaren.", sourceKey: "zkg-39", passageKey: "zkg-39-all", riskLevel: "high" },
  { key: "basiskonto-not-dispo-prohibition", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Ein Basiskonto ist kein gesetzliches Verbot eines vereinbarten Dispos.", sourceKey: "zkg-39", passageKey: "zkg-39-all", riskLevel: "high" },
  { key: "agreed-dispo-not-statutory-basiskonto", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Ein bereits vereinbarter Dispo gehört nicht zum gesetzlichen Mindestumfang des Basiskontos.", sourceKey: "zkg-39", passageKey: "zkg-39-all", riskLevel: "high" },
  { key: "bank-need-not-grant-basiskonto-dispo", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Die Bank muss zum Basiskonto keinen Dispo einräumen.", sourceKey: "zkg-39", passageKey: "zkg-39-all", riskLevel: "high" },
  { key: "basiskonto-not-any-reason-refuse", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Die Bank darf ein Basiskonto nicht aus beliebigem Grund ablehnen.", sourceKey: "zkg-34", passageKey: "zkg-34-all", riskLevel: "high" },
  { key: "basiskonto-special-termination", category: "basiskonto", temporal: "current_2026", type: "definition", text: "Die Basiskontokündigung ist nur unter den besonderen Gründen des § 42 ZKG zulässig.", sourceKey: "zkg-42", passageKey: "zkg-42-all", riskLevel: "high" },
  { key: "basiskonto-not-inconvenient-close", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Ein Basiskonto darf nicht gekündigt werden, nur weil die Beziehung unbequem ist.", sourceKey: "zkg-42", passageKey: "zkg-42-all", riskLevel: "high" },
  { key: "pkonto-one-account", category: "pkonto", temporal: "current_2026", type: "duty", text: "Jede natürliche Person darf nur ein Pfändungsschutzkonto unterhalten.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "high" },
  { key: "pkonto-negative-possible", category: "pkonto", temporal: "current_2026", type: "definition", text: "Die Umstellung auf ein P-Konto kann auch bei negativem Saldo verlangt werden; geführt wird es auf Guthabenbasis.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "medium" },
  { key: "pkonto-fourth-business-day", category: "pkonto", temporal: "current_2026", type: "deadline", text: "Ist das Konto bereits gepfändet, kann die P-Konto-Führung zum Beginn des vierten folgenden Geschäftstages verlangt werden.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "medium" },
  { key: "pkonto-not-all-protected", category: "pkonto", temporal: "current_2026", type: "exception", text: "Ein P-Konto schützt nicht automatisch jedes Guthaben.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "high" },
  { key: "pkonto-not-debt-gone", category: "pkonto", temporal: "current_2026", type: "exception", text: "Ein P-Konto lässt die Schuld nicht entfallen.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "high" },
  { key: "pkonto-amounts-not-timeless", category: "pkonto", temporal: "current_2026", type: "exception", text: "Euro-Freibeträge des P-Kontos dürfen nicht als zeitlose Werte genannt werden.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "do-not-ignore-garnishment", category: "pkonto", temporal: "current_2026", type: "duty", text: "Ein Pfändungs- und Überweisungsbeschluss darf nicht ignoriert werden.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "high" },
  { key: "negative-not-pkonto-impossible", category: "pkonto", temporal: "current_2026", type: "exception", text: "Ein negativer Kontostand macht die P-Konto-Umstellung nicht unmöglich.", sourceKey: "zpo-850k", passageKey: "zpo-850k-all", riskLevel: "high" },
  { key: "dispo-not-owned-balance", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein Dispo ist nicht das dem Kunden gehörende Kontoguthaben.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "medium" },
  { key: "internal-written-complaint", category: "complaint", temporal: "current_2026", type: "procedure", text: "Zuerst ist die Bank schriftlich um eine schriftliche Stellungnahme zu bitten.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "complaint-not-lawsuit", category: "complaint", temporal: "current_2026", type: "exception", text: "Die Bankbeschwerde ist keine Klage.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "complaint-not-deadline-stop", category: "complaint", temporal: "current_2026", type: "exception", text: "Eine Beschwerde hemmt nicht automatisch jede gesetzliche Frist.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "not-one-ombudsman-all-banks", category: "complaint", temporal: "current_2026", type: "exception", text: "Nicht alle Bankbeschwerden gehen an einen einzigen Ombudsmann.", sourceKey: "bundesbank-schlichtung", passageKey: "bundesbank-schlichtung-all", riskLevel: "high" },
  { key: "private-ombud-not-sparkasse", category: "complaint", temporal: "current_2026", type: "exception", text: "Der Ombudsmann der privaten Banken gilt nicht automatisch für Sparkassen oder Genossenschaftsbanken.", sourceKey: "bankenombud-ordnung", passageKey: "bankenombud-ordnung-all", riskLevel: "high" },
  { key: "membership-fetch-live", category: "complaint", temporal: "current_2026", type: "procedure", text: "Teilnahme und Zuständigkeit der Schlichtungsstelle sind live zu prüfen.", sourceKey: "bankenombud-ordnung", passageKey: "bankenombud-ordnung-all", riskLevel: "high" },
  { key: "bundesbank-is-fallback", category: "complaint", temporal: "current_2026", type: "definition", text: "Die Bundesbank-Schlichtungsstelle ist Auffangzuständigkeit und nicht immer die erste Streitstelle.", sourceKey: "bundesbank-schlichtung", passageKey: "bundesbank-schlichtung-all", riskLevel: "high" },
  { key: "bafin-not-refund-order", category: "complaint", temporal: "current_2026", type: "exception", text: "Eine BaFin-Beschwerde ist keine bindende Erstattungsanordnung.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "bafin-not-ombudsman", category: "complaint", temporal: "current_2026", type: "exception", text: "Die BaFin ist kein Bankenombudsmann.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "bafin-deadlines-continue", category: "complaint", temporal: "current_2026", type: "exception", text: "Während einer BaFin-Beschwerde laufen Fristen weiter.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "civil-law-boundary", category: "complaint", temporal: "current_2026", type: "definition", text: "Private Zahlungs- und Kontostreitigkeiten gehören grundsätzlich in zivilrechtliche Wege.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "medium" },
  { key: "no-generic-eight-weeks", category: "deadline", temporal: "current_2026", type: "exception", text: "Es gibt keine generelle Bankfrist von acht Wochen für jedes Zahlungsrecht.", sourceKey: "bgb-675x", passageKey: "bgb-675x-all", riskLevel: "high" },
  { key: "no-generic-thirteen-months", category: "deadline", temporal: "current_2026", type: "exception", text: "Es gibt keine generelle Bankfrist von 13 Monaten für jede Beschwerde.", sourceKey: "bgb-676b", passageKey: "bgb-676b-all", riskLevel: "high" },
  { key: "document-date-not-deadline", category: "deadline", temporal: "current_2026", type: "exception", text: "Das auf dem Bankschreiben gedruckte Datum ist nicht automatisch der Fristbeginn.", sourceKey: "bgb-676b", passageKey: "bgb-676b-all", riskLevel: "high" },
  { key: "individual-deadline-fail-closed", category: "deadline", temporal: "current_2026", type: "exception", text: "Eine individuelle Erstattungs- oder Anzeigefrist darf ohne Vorgangsart, Belastungstag und Unterrichtung nicht berechnet werden.", sourceKey: "bgb-676b", passageKey: "bgb-676b-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "foreign-iban-not-fraud", category: "boundary", temporal: "current_2026", type: "exception", text: "Eine ausländische IBAN ist nicht automatisch Betrug.", sourceKey: "bgb-675r", passageKey: "bgb-675r-all", riskLevel: "high" },
  { key: "non-de-iban-not-invalid-sepa", category: "boundary", temporal: "current_2026", type: "exception", text: "Eine nicht-deutsche IBAN ist nicht automatisch ein ungültiges SEPA-Konto.", sourceKey: "bgb-675r", passageKey: "bgb-675r-all", riskLevel: "high" },
  { key: "sepa-not-only-germany", category: "boundary", temporal: "current_2026", type: "exception", text: "SEPA ist nicht nur Deutschland.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "medium" },
  { key: "securities-out-of-scope", category: "boundary", temporal: "current_2026", type: "exception", text: "Wertpapier-, Depot- und Anlageverluste liegen außerhalb dieses Zahlungskerns, außer der Zahlungs- und Phishing-Sicherheit.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "high" },
  { key: "loan-out-of-scope", category: "boundary", temporal: "current_2026", type: "exception", text: "Verbraucherkredit, Hypothek und Finanzierung liegen außerhalb dieses Kerns, außer Konto-, Dispo- und Zahlungsausführung.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "high" },
  { key: "never-store-secrets", category: "authenticity", temporal: "current_2026", type: "duty", text: "PIN, TAN, Passwort, vollständige Zugangsdaten und CVV dürfen nicht angefordert oder gespeichert werden.", sourceKey: "bgb-675l", passageKey: "bgb-675l-all", riskLevel: "high" },
  { key: "invoice-account-change-independent", category: "authenticity", temporal: "current_2026", type: "procedure", text: "Eine geänderte Empfängerkontonummer in Rechnung oder Mail ist unabhängig über einen bekannten offiziellen Kanal zu prüfen.", sourceKey: "bundesbank-vop", passageKey: "bundesbank-vop-all", riskLevel: "high" },
  { key: "vop-unavailable-not-block", category: "vop", temporal: "current_2026", type: "exception", text: "Nicht verfügbare Empfängerüberprüfung sperrt die Überweisung nicht automatisch.", sourceKey: "bafin-vop", passageKey: "bafin-vop-all", riskLevel: "medium" },
  { key: "overdraft-not-permanent", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein Disporahmen ist kein dauerhafter Anspruch.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "medium" },
  { key: "already-usable-account-affects-basiskonto", category: "basiskonto", temporal: "current_2026", type: "exception", text: "Ein bereits voll nutzbares deutsches Zahlungskonto kann den Basiskontoanspruch beeinflussen.", sourceKey: "zkg-34", passageKey: "zkg-34-all", riskLevel: "medium" },
  { key: "tagesgeld-not-giro", category: "classifier", temporal: "current_2026", type: "exception", text: "Tagesgeld oder Sparkonto ist nicht automatisch das laufende Giro- oder Zahlungskonto.", sourceKey: "zkg-38", passageKey: "zkg-38-all", riskLevel: "medium" },
  { key: "gemeinschaftskonto-needs-facts", category: "classifier", temporal: "current_2026", type: "exception", text: "Ein Gemeinschaftskonto darf ohne Vertrags- und Berechtigungsfacts nicht wie ein Einzelkonto behandelt werden.", sourceKey: "bgb-675c", passageKey: "bgb-675c-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
]);

export const BNK_PROCESSES: readonly BnkProcessSpec[] = Object.freeze([
  { key: "schreiben-einordnen", title: "Bankschreiben oder Bankmail einordnen 2026", trigger: "Ein Schreiben oder eine Nachricht, die wie von der Bank wirkt, liegt vor", safeFirstStep: "Dokumenttyp, Konto- oder Zahlungsart und verdächtige Aufforderungen trennen, bevor Inhalt rechtlich gewürdigt wird.", riskLevel: "high" },
  { key: "authentizitaet-phishing-pruefen", title: "Authentizität und Phishing prüfen 2026", trigger: "Eine Bankmail, SMS oder ein Anruf verlangt Login, TAN, PIN oder neue Kontodaten", safeFirstStep: "Logo und Absender nicht als Echtheit behandeln; unabhängig über bekannten offiziellen Bankkanal kontaktieren; keine Geheimnisse weitergeben.", riskLevel: "high" },
  { key: "konto-zahlungsart-bestimmen", title: "Konto- oder Zahlungsart bestimmen 2026", trigger: "Unklar ist, ob Girokonto, Basiskonto, P-Konto, Lastschrift, Überweisung oder Karte vorliegt", safeFirstStep: "Produkt und Vorgangsart klassifizieren; Lastschrift nicht mit Überweisung und Giro nicht mit Basiskonto gleichsetzen.", riskLevel: "high" },
  { key: "autorisierung-bestimmen", title: "Autorisierung bestimmen 2026", trigger: "Streitig ist, ob eine Zahlung autorisiert, unautorisiert, unklar oder unter Täuschung zugestimmt wurde", safeFirstStep: "Die vier Lagen trennen; Geldabgang nicht als Unautorisiertheit und Täuschung nicht als § 675u BGB behandeln.", riskLevel: "high" },
  { key: "karte-zugang-sperren", title: "Karte oder Zugang sperren 2026", trigger: "Karte, Telefon oder Onlinebanking ist verloren, gestohlen oder missbraucht", safeFirstStep: "Interaktion stoppen, Instrument unverzüglich sperren und anzeigen, Zugang sichern und Vorgänge dokumentieren.", riskLevel: "high" },
  { key: "unautorisierte-zahlung-reklamieren", title: "Nicht autorisierte Zahlung reklamieren 2026", trigger: "Eine Zahlung war nicht autorisiert", safeFirstStep: "Unverzüglich anzeigen und den gesetzlichen Erstattungsrahmen erklären, ohne Erstattung zuzusagen, wenn die Autorisierung streitig bleibt.", riskLevel: "high" },
  { key: "kundenhaftung-einordnen", title: "Kundenhaftung einordnen 2026", trigger: "Die Bank beruft sich auf 50 Euro, grobe Fahrlässigkeit oder volle Haftung", safeFirstStep: "50 Euro nicht als automatischen Selbstbehalt und Phishing nicht als grobe Fahrlässigkeit behandeln; ohne Tatsachen nicht feststellen.", riskLevel: "high" },
  { key: "authentifizierungsnachweis-einordnen", title: "Authentifizierungsnachweis einordnen 2026", trigger: "Die Bank sagt, TAN, PIN oder App-Freigabe beweise die Autorisierung", safeFirstStep: "Technische Aufzeichnung und rechtliche Autorisierung trennen; unterstützende Beweismittel verlangen.", riskLevel: "high" },
  { key: "sepa-basislastschrift-zurueckgeben", title: "SEPA-Basislastschrift zurückgeben 2026", trigger: "Eine autorisierte SEPA-Basislastschrift soll erstattet werden", safeFirstStep: "Achtwochenfrist ohne Begründung nennen und klarstellen, dass die zugrunde liegende Forderung nicht automatisch entfällt.", riskLevel: "medium" },
  { key: "unautorisierte-lastschrift", title: "Unautorisierte Lastschrift behandeln 2026", trigger: "Eine Lastschrift war nicht wirksam autorisiert", safeFirstStep: "Nicht die Achtwochenregel, sondern den Rahmen nicht autorisierter Zahlungen anwenden.", riskLevel: "high" },
  { key: "ueberweisung-verstehen", title: "Überweisung ausführen oder verstehen 2026", trigger: "Eine SEPA-Überweisung soll verstanden oder geprüft werden", safeFirstStep: "Auftrag, IBAN, VoP, Autorisierung, Zugang und Ausführung trennen; Überweisung nicht mit Lastschrift verwechseln.", riskLevel: "medium" },
  { key: "widerruf-recall", title: "Überweisung widerrufen oder Recall versuchen 2026", trigger: "Eine bereits erteilte Überweisung soll gestoppt oder zurückgeholt werden", safeFirstStep: "Nach Zugang grundsätzlich Unwiderruflichkeit erklären; Recall als Versuch ohne Garantie einordnen.", riskLevel: "high" },
  { key: "falsche-iban", title: "Falsche IBAN behandeln 2026", trigger: "Geld ging an eine falsche IBAN oder den falschen Empfänger", safeFirstStep: "Falsche IBAN nicht als unautorisiert behandeln; Wiedererlangungspflicht und fehlende Garantie erklären.", riskLevel: "high" },
  { key: "betrugsueberweisung", title: "Betrugsüberweisung behandeln 2026", trigger: "Der Nutzer hat selbst eine Überweisung an Betrüger autorisiert", safeFirstStep: "Weitere Zahlungen stoppen, Bank sofort um Recall bitten und ohne Erstattung oder Fahrlässigkeitsfeststellung fail-closed bleiben.", riskLevel: "high" },
  { key: "vop-einordnen", title: "Empfängerüberprüfung VoP einordnen 2026", trigger: "Ein VoP-Ergebnis oder eine angebliche VoP-Anfrage liegt vor", safeFirstStep: "Treffer nicht als Vertrauensbeweis und Mail-VoP nicht als normalen Ablauf behandeln.", riskLevel: "high" },
  { key: "echtzeitueberweisung", title: "Echtzeitüberweisung einordnen 2026", trigger: "Eine Instant Payment wurde gesendet, empfangen oder falsch ausgeführt", safeFirstStep: "Schnelligkeit nicht als Widerruflichkeit behandeln und die Bank unverzüglich kontaktieren.", riskLevel: "high" },
  { key: "kartenzahlung-reklamieren", title: "Kartenzahlung reklamieren 2026", trigger: "Eine Karten- oder Geldautomatenzahlung ist streitig", safeFirstStep: "Unautorisierte Zahlung und Händlerstreit trennen; Kartenschema nicht als Gesetz behandeln.", riskLevel: "high" },
  { key: "chargeback-grenze", title: "Chargeback-Grenze bestimmen 2026", trigger: "Ware wurde nicht geliefert, die Kartenzahlung war aber autorisiert", safeFirstStep: "Chargeback nicht als § 675u BGB behandeln und Fristen als karten- und vertragsspezifisch einordnen.", riskLevel: "high" },
  { key: "kartenreservierung", title: "Kartenreservierung einordnen 2026", trigger: "Ein Hotel, eine Tankstelle oder Autovermietung hat einen Betrag reserviert", safeFirstStep: "Reservierung nicht als endgültige Belastung behandeln und Zustimmung zur genauen Höhe prüfen.", riskLevel: "medium" },
  { key: "abgelehnte-zahlung", title: "Abgelehnte Zahlung behandeln 2026", trigger: "Die Bank hat einen Zahlungsauftrag abgelehnt", safeFirstStep: "Ablehnung nicht als Kündigung behandeln; Gründe können rechtlich beschränkt sein.", riskLevel: "medium" },
  { key: "fehlerhafte-zahlung", title: "Fehlerhafte oder verspätete Zahlung behandeln 2026", trigger: "Eine Zahlung fehlt, kam verspätet oder unrichtig an", safeFirstStep: "Verspätung nicht als Verlust und Nachforschung nicht als Erstattung behandeln.", riskLevel: "high" },
  { key: "gebuehren-vertragsaenderung", title: "Gebühren oder Vertragsänderung einordnen 2026", trigger: "Eine Gebühr, Preisliste oder AGB-Änderung liegt vor", safeFirstStep: "Nur den Zahlungsdiensterahmenvertrag und die konkreten Vertragsunterlagen prüfen; Schweigen nicht als universelle Zustimmung behandeln.", riskLevel: "high" },
  { key: "kontokuendigung", title: "Kontokündigung einordnen 2026", trigger: "Die Bank oder der Kunde kündigt das Zahlungskonto", safeFirstStep: "Ordentliche Girokonto-Regeln und Basiskonto trennen; sofortige Schließung nicht automatisch für unwirksam erklären.", riskLevel: "high" },
  { key: "basiskonto-einordnen", title: "Basiskonto einordnen 2026", trigger: "Ein Basiskonto wird gewünscht oder erklärt", safeFirstStep: "Gesetzlichen Mindestumfang ohne Kreditanspruch erklären; kein Gratisanspruch und kein automatischer Dispo, aber kein gesetzliches Dispo-Verbot annehmen.", riskLevel: "medium" },
  { key: "basiskonto-ablehnung-kuendigung", title: "Basiskonto-Ablehnung oder Kündigung behandeln 2026", trigger: "Ein Basiskonto wurde abgelehnt oder gekündigt", safeFirstStep: "Nur gesetzliche Ablehnungs- und Kündigungsgründe prüfen; § 675h BGB reicht allein nicht.", riskLevel: "high" },
  { key: "sperre-einordnen", title: "Konto- oder Zahlungsinstrumentsperre einordnen 2026", trigger: "Karte, Onlinebanking oder das ganze Konto ist gesperrt oder eingeschränkt", safeFirstStep: "Kartensperre, Onlinebanking-Sperre, Zahlungsablehnung, Pfändung und Kündigung nicht gleichsetzen.", riskLevel: "high" },
  { key: "pkonto-einordnen", title: "P-Konto einordnen 2026", trigger: "Ein Pfändungsschutzkonto wird gewünscht oder ist bereits eingerichtet", safeFirstStep: "Nur ein P-Konto je Person, Guthabenbasis und fehlenden Vollschutz erklären; Euro-Beträge nicht als zeitlos nennen.", riskLevel: "high" },
  { key: "kontopfaendung-boundary", title: "Kontopfändung-Grenze erkennen 2026", trigger: "Ein Pfändungs- und Überweisungsbeschluss oder eine Kontopfändung liegt vor", safeFirstStep: "Nicht ignorieren, nicht vollrechnen und in P-Konto- sowie Vollstreckungswege routen.", riskLevel: "high" },
  { key: "interne-bankbeschwerde", title: "Interne Bankbeschwerde 2026", trigger: "Der Nutzer will sich bei der Bank beschweren", safeFirstStep: "Schriftlich Vorgang und Begehren darlegen und Stellungnahme verlangen; Beschwerde nicht mit Klage oder Fristhemmung verwechseln.", riskLevel: "medium" },
  { key: "schlichtungsstelle-bestimmen", title: "Zuständige Schlichtungsstelle bestimmen 2026", trigger: "Außergerichtliche Streitbeilegung gegen ein Institut wird erwogen", safeFirstStep: "Institutsart und Teilnahme live prüfen; nicht alle Banken zum privaten Ombudsmann oder zuerst zur Bundesbank schicken.", riskLevel: "high" },
  { key: "ombudsmann-private-banken", title: "Ombudsmann private Banken route 2026", trigger: "Streit gegen eine teilnehmende private Bank soll geschlichtet werden", safeFirstStep: "Teilnahme live prüfen und Sparkassen sowie Genossenschaftsbanken ausnehmen.", riskLevel: "high" },
  { key: "bundesbank-schlichtung", title: "Bundesbank-Schlichtungsstelle route 2026", trigger: "Eine Auffangschlichtung bei der Deutschen Bundesbank wird erwogen", safeFirstStep: "Nur als Auffangzuständigkeit nutzen, soweit keine anerkannte private Stelle kompetent ist.", riskLevel: "high" },
  { key: "bafin-beschwerde-boundary", title: "BaFin-Beschwerdegrenze 2026", trigger: "Eine Aufsichtsbeschwerde zur Bank oder zum Zahlungsdienstleister wird erwogen", safeFirstStep: "Kollektiven Schutz erklären; keine Erstattungsanordnung und keine Fristhemmung annehmen.", riskLevel: "high" },
  { key: "fristen-einordnen", title: "Fristen sicher bestimmen 2026", trigger: "Eine Erstattungs-, Anzeige- oder Beschwerdefrist soll bestimmt werden", safeFirstStep: "Fristursprung benennen; acht Wochen, 13 Monate und Dokumentdatum nicht vermischen.", riskLevel: "high" },
]);

export const BNK_FORMS: readonly BnkFormSpec[] = Object.freeze([
  { key: "bankbeschwerde", name: "Schriftliche Beschwerde bei der Bank", identifier: "BNK-Bankbeschwerde", purpose: "Schriftliche Stellungnahme der Bank zu Konto oder Zahlung verlangen", submissionChannels: ["written_to_bank"], sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all" },
  { key: "sperre-verlust", name: "Sperre oder Verlustanzeige Zahlungsinstrument", identifier: "BNK-Sperre-Verlustanzeige", purpose: "Verlust, Diebstahl oder Missbrauch unverzüglich anzeigen und sperren", submissionChannels: ["official_bank_channel"], sourceKey: "bgb-675l", passageKey: "bgb-675l-all" },
  { key: "lastschrift-erstattung", name: "Erstattung SEPA-Basislastschrift", identifier: "BNK-Lastschrifterstattung", purpose: "Autorisierte Basislastschrift innerhalb von acht Wochen oder unautorisierte Lastschrift anzeigen", submissionChannels: ["written_to_bank"], sourceKey: "bgb-675x", passageKey: "bgb-675x-all" },
  { key: "ombud-antrag", name: "Schlichtungsantrag Ombudsmann der privaten Banken", identifier: "BNK-Ombudsmann-Private-Banken", purpose: "Verbraucherschlichtung gegen eine teilnehmende private Bank", submissionChannels: ["text_form_to_ombudsman"], sourceKey: "bankenombud-ablauf", passageKey: "bankenombud-ablauf-all" },
  { key: "bundesbank-antrag", name: "Antrag Schlichtungsstelle der Deutschen Bundesbank", identifier: "BNK-Bundesbank-Schlichtung", purpose: "Auffangschlichtung bei fehlender zuständiger privater Stelle", submissionChannels: ["written_to_bundesbank"], sourceKey: "bundesbank-schlichtung", passageKey: "bundesbank-schlichtung-all" },
  { key: "bafin-form", name: "BaFin-Verbraucherbeschwerde", identifier: "BAFIN-Verbraucherbeschwerde", purpose: "Aufsichtliche Verbraucherhinweise zu beaufsichtigten Instituten", submissionChannels: ["online_form"], sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all" },
]);

export const BNK_PROCESS_BINDINGS: readonly BnkBindingSpec[] = Object.freeze([
  { processKey: "schreiben-einordnen", role: "orientation_basis", sequenceContext: "classify-message", claimKeys: ["giro-is-payment-account", "independent-official-contact", "lastschrift-not-transfer", "tagesgeld-not-giro", "gemeinschaftskonto-needs-facts"] },
  { processKey: "authentizitaet-phishing-pruefen", role: "negative_control", sequenceContext: "phishing", claimKeys: ["logo-not-authenticity", "sender-name-not-verified", "phone-display-not-verified", "knows-account-not-employee", "tan-request-not-safe", "safe-account-not-legitimate", "email-vop-not-normal", "independent-official-contact", "never-share-pin-tan", "birello-not-login", "never-store-secrets", "invoice-account-change-independent"] },
  { processKey: "konto-zahlungsart-bestimmen", role: "identification", sequenceContext: "product-class", claimKeys: ["giro-is-payment-account", "lastschrift-not-transfer", "firmenlastschrift-not-consumer-same", "debit-not-credit-card", "tagesgeld-not-giro", "gemeinschaftskonto-needs-facts", "dispo-not-owned-balance", "overdraft-not-permanent", "loan-out-of-scope"] },
  { processKey: "autorisierung-bestimmen", role: "context_gate", sequenceContext: "authorization-gate", claimKeys: ["authorization-required", "money-left-not-unauthorized", "fraud-not-automatically-unauthorized", "deceived-not-automatically-675u", "tan-not-automatically-authorized", "bank-says-authorized-not-final", "unclear-authorization-fail-closed"] },
  { processKey: "karte-zugang-sperren", role: "next_state", sequenceContext: "block-instrument", claimKeys: ["notify-loss-without-delay", "lost-card-not-automatic-loss", "block-not-cancel-authorized", "post-block-no-liability", "never-share-pin-tan"] },
  { processKey: "unautorisierte-zahlung-reklamieren", role: "decision", sequenceContext: "section-675u", claimKeys: ["section-675u-refund", "unauthorized-not-indefinite-wait", "no-merchant-first-default", "police-not-prerequisite", "do-not-promise-if-disputed"] },
  { processKey: "kundenhaftung-einordnen", role: "negative_control", sequenceContext: "section-675v", claimKeys: ["fifty-euro-cap", "fifty-not-automatic-deductible", "victim-not-automatically-fifty", "phishing-not-automatically-gross", "tan-not-automatically-gross", "lost-card-not-full-liability", "gross-neg-not-from-outcome", "post-block-no-liability"] },
  { processKey: "authentifizierungsnachweis-einordnen", role: "evidence_requirement", sequenceContext: "section-675w", claimKeys: ["tan-not-automatically-authorized", "auth-record-not-authorization", "bank-says-authorized-not-final", "supporting-evidence-required"] },
  { processKey: "sepa-basislastschrift-zurueckgeben", role: "deadline_gate", sequenceContext: "section-675x", claimKeys: ["eight-week-authorized-debit", "lastschrift-not-transfer", "reversal-not-debt-gone", "thirteen-not-eight-weeks"] },
  { processKey: "unautorisierte-lastschrift", role: "deadline_gate", sequenceContext: "unauthorized-debit", claimKeys: ["unauthorized-debit-uses-675u", "eight-not-unauthorized-outer", "thirteen-not-eight-weeks", "section-675u-refund"] },
  { processKey: "ueberweisung-verstehen", role: "orientation_basis", sequenceContext: "transfer-lifecycle", claimKeys: ["authorization-required", "lastschrift-not-transfer", "transfer-not-freely-reversible", "vop-inside-banking", "foreign-iban-not-fraud", "sepa-not-only-germany"] },
  { processKey: "widerruf-recall", role: "next_state", sequenceContext: "section-675p", claimKeys: ["transfer-not-freely-reversible", "storno-not-guaranteed"] },
  { processKey: "falsche-iban", role: "next_state", sequenceContext: "section-675r-y", claimKeys: ["wrong-iban-not-unauthorized", "wrong-iban-not-guaranteed-refund", "wrong-iban-recovery-duty", "storno-not-guaranteed"] },
  { processKey: "betrugsueberweisung", role: "context_gate", sequenceContext: "authorized-scam", claimKeys: ["scam-transfer-not-automatically-675u", "deceived-not-automatically-675u", "scam-contact-bank-immediately", "do-not-blame-or-promise-scam"] },
  { processKey: "vop-einordnen", role: "negative_control", sequenceContext: "vop", claimKeys: ["vop-since-2025", "vop-match-not-trust", "vop-match-not-invoice-legit", "vop-warning-not-auto-block", "vop-not-fraud-insurance", "vop-inside-banking", "email-vop-not-normal", "vop-unavailable-not-block"] },
  { processKey: "echtzeitueberweisung", role: "next_state", sequenceContext: "instant", claimKeys: ["instant-not-reversible", "instant-fee-not-higher", "instant-contact-immediately", "vop-since-2025"] },
  { processKey: "kartenzahlung-reklamieren", role: "decision", sequenceContext: "card-unauthorized", claimKeys: ["section-675u-refund", "chargeback-not-675u", "debit-not-credit-card", "do-not-promise-if-disputed"] },
  { processKey: "chargeback-grenze", role: "legal_remedy_gate", sequenceContext: "merchant-dispute", claimKeys: ["merchant-dispute-not-unauthorized", "chargeback-not-675u", "scheme-not-statute", "card-reversal-not-debt-gone"] },
  { processKey: "kartenreservierung", role: "identification", sequenceContext: "section-675t", claimKeys: ["reservation-not-final-debit", "reservation-needs-exact-consent"] },
  { processKey: "abgelehnte-zahlung", role: "decision", sequenceContext: "section-675o", claimKeys: ["refusal-not-termination", "refusal-reason-may-be-withheld"] },
  { processKey: "fehlerhafte-zahlung", role: "next_state", sequenceContext: "section-675y", claimKeys: ["delay-not-lost", "recipient-missing-not-auto-liability", "trace-not-refund", "wrong-iban-recovery-duty"] },
  { processKey: "gebuehren-vertragsaenderung", role: "deadline_gate", sequenceContext: "section-675g", claimKeys: ["two-month-change-notice", "silence-not-universal-consent", "two-months-not-every-change", "new-terms-not-automatically-valid", "fee-not-automatically-lawful", "fee-not-automatically-unlawful", "price-list-not-statute"] },
  { processKey: "kontokuendigung", role: "deadline_gate", sequenceContext: "section-675h", claimKeys: ["customer-can-terminate", "provider-two-months", "bank-not-immediate-without-rule", "giro-not-basiskonto-termination", "immediate-not-automatically-unlawful", "no-reason-not-automatically-unlawful", "compliance-not-crime-proof"] },
  { processKey: "basiskonto-einordnen", role: "orientation_basis", sequenceContext: "zkg-claim", claimKeys: ["basiskonto-claim", "basiskonto-not-free", "basiskonto-not-dispo", "basiskonto-section-38-no-credit", "basiskonto-section-39-agreed-overdraft", "basiskonto-not-dispo-prohibition", "agreed-dispo-not-statutory-basiskonto", "bank-need-not-grant-basiskonto-dispo", "already-usable-account-affects-basiskonto"] },
  { processKey: "basiskonto-ablehnung-kuendigung", role: "legal_remedy_gate", sequenceContext: "zkg-34-42", claimKeys: ["basiskonto-not-any-reason-refuse", "already-usable-account-affects-basiskonto", "basiskonto-special-termination", "giro-not-basiskonto-termination", "basiskonto-not-inconvenient-close"] },
  { processKey: "sperre-einordnen", role: "identification", sequenceContext: "section-675k", claimKeys: ["card-block-not-account-closed", "online-block-not-forfeiture", "account-restrict-not-crime", "block-not-cancel-authorized", "compliance-not-crime-proof", "never-share-pin-tan"] },
  { processKey: "pkonto-einordnen", role: "context_gate", sequenceContext: "zpo-850k", claimKeys: ["pkonto-one-account", "pkonto-negative-possible", "pkonto-fourth-business-day", "pkonto-not-all-protected", "pkonto-not-debt-gone", "pkonto-amounts-not-timeless", "negative-not-pkonto-impossible"] },
  { processKey: "kontopfaendung-boundary", role: "legal_remedy_gate", sequenceContext: "garnishment", claimKeys: ["do-not-ignore-garnishment", "pkonto-not-debt-gone", "pkonto-not-all-protected"] },
  { processKey: "interne-bankbeschwerde", role: "application_route", sequenceContext: "internal-complaint", claimKeys: ["internal-written-complaint", "complaint-not-lawsuit", "complaint-not-deadline-stop"] },
  { processKey: "schlichtungsstelle-bestimmen", role: "legal_remedy_gate", sequenceContext: "adr-router", claimKeys: ["not-one-ombudsman-all-banks", "private-ombud-not-sparkasse", "membership-fetch-live", "bundesbank-is-fallback"] },
  { processKey: "ombudsmann-private-banken", role: "legal_remedy_gate", sequenceContext: "private-ombud", claimKeys: ["private-ombud-not-sparkasse", "membership-fetch-live"] },
  { processKey: "bundesbank-schlichtung", role: "legal_remedy_gate", sequenceContext: "bundesbank-fallback", claimKeys: ["bundesbank-is-fallback", "not-one-ombudsman-all-banks", "membership-fetch-live"] },
  { processKey: "bafin-beschwerde-boundary", role: "legal_remedy_gate", sequenceContext: "bafin", claimKeys: ["bafin-not-refund-order", "bafin-not-ombudsman", "bafin-deadlines-continue", "civil-law-boundary"] },
  { processKey: "fristen-einordnen", role: "deadline_gate", sequenceContext: "deadlines", claimKeys: ["notify-without-delay-676b", "thirteen-months-outer", "thirteen-not-wait-advice", "thirteen-not-eight-weeks", "eight-week-authorized-debit", "no-generic-eight-weeks", "no-generic-thirteen-months", "document-date-not-deadline", "individual-deadline-fail-closed"] },
]);

export const BNK_PROCESS_SCENARIOS: readonly BnkProcessScenario[] = Object.freeze([
  { id: "unclear-bank-email", label: "Unklares Bankschreiben", coverage: "COVERED", requiredClaimKeys: ["giro-is-payment-account", "independent-official-contact"], requiredProcessKeys: ["schreiben-einordnen"] },
  { id: "suspicious-login-link", label: "Verdächtiger Login-Link", coverage: "COVERED", requiredClaimKeys: ["logo-not-authenticity", "tan-request-not-safe"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "fake-bank-sms", label: "Gefälschte Bank-SMS", coverage: "COVERED", requiredClaimKeys: ["sender-name-not-verified", "never-share-pin-tan"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "fake-bank-phone", label: "Gefälschter Bankanruf", coverage: "COVERED", requiredClaimKeys: ["phone-display-not-verified", "knows-account-not-employee"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "safe-account-request", label: "Aufforderung zum Sicherheitskonto", coverage: "COVERED", requiredClaimKeys: ["safe-account-not-legitimate", "independent-official-contact"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "changed-payment-account", label: "Geänderte Empfängerkontonummer", coverage: "COVERED", requiredClaimKeys: ["invoice-account-change-independent", "email-vop-not-normal"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "lost-card", label: "Karte verloren", coverage: "COVERED", requiredClaimKeys: ["notify-loss-without-delay", "lost-card-not-automatic-loss"], requiredProcessKeys: ["karte-zugang-sperren"], requiredFormIdentifiers: ["BNK-Sperre-Verlustanzeige"] },
  { id: "stolen-phone-banking", label: "Gestohlenes Telefon mit Banking-App", coverage: "COVERED", requiredClaimKeys: ["notify-loss-without-delay", "never-share-pin-tan"], requiredProcessKeys: ["karte-zugang-sperren"] },
  { id: "unauthorized-card", label: "Unautorisierte Kartenzahlung", coverage: "COVERED", requiredClaimKeys: ["section-675u-refund", "do-not-promise-if-disputed"], requiredProcessKeys: ["unautorisierte-zahlung-reklamieren"] },
  { id: "unauthorized-atm", label: "Unautorisierte Geldautomatenabhebung", coverage: "COVERED", requiredClaimKeys: ["section-675u-refund", "police-not-prerequisite"], requiredProcessKeys: ["unautorisierte-zahlung-reklamieren"] },
  { id: "unauthorized-online", label: "Unautorisierte Onlinezahlung", coverage: "COVERED", requiredClaimKeys: ["section-675u-refund", "unauthorized-not-indefinite-wait"], requiredProcessKeys: ["unautorisierte-zahlung-reklamieren"] },
  { id: "tan-proves-authorization", label: "Bank sagt TAN beweise Autorisierung", coverage: "COVERED", requiredClaimKeys: ["tan-not-automatically-authorized", "auth-record-not-authorization"], requiredProcessKeys: ["authentifizierungsnachweis-einordnen"] },
  { id: "may-have-been-phished", label: "Nutzer könnte phished worden sein", coverage: "COVERED", requiredClaimKeys: ["phishing-not-automatically-gross", "tan-not-automatically-gross"], requiredProcessKeys: ["kundenhaftung-einordnen"] },
  { id: "authorized-sepa-debit", label: "Autorisierte SEPA-Basislastschrift", coverage: "COVERED", requiredClaimKeys: ["eight-week-authorized-debit", "lastschrift-not-transfer"], requiredProcessKeys: ["sepa-basislastschrift-zurueckgeben"], requiredFormIdentifiers: ["BNK-Lastschrifterstattung"] },
  { id: "unauthorized-direct-debit", label: "Unautorisierte Lastschrift", coverage: "COVERED", requiredClaimKeys: ["unauthorized-debit-uses-675u", "eight-not-unauthorized-outer"], requiredProcessKeys: ["unautorisierte-lastschrift"] },
  { id: "reverse-legitimate-debit", label: "Berechtigte Lastschrift wird zurückgegeben", coverage: "COVERED", requiredClaimKeys: ["reversal-not-debt-gone", "eight-week-authorized-debit"], requiredProcessKeys: ["sepa-basislastschrift-zurueckgeben"] },
  { id: "wrong-iban", label: "Überweisung an falsche IBAN", coverage: "COVERED", requiredClaimKeys: ["wrong-iban-not-unauthorized", "wrong-iban-recovery-duty"], requiredProcessKeys: ["falsche-iban"] },
  { id: "wrong-recipient", label: "Überweisung an falschen Empfänger", coverage: "COVERED", requiredClaimKeys: ["wrong-iban-not-guaranteed-refund", "storno-not-guaranteed"], requiredProcessKeys: ["falsche-iban"] },
  { id: "authorized-scam-transfer", label: "Selbst autorisierte Betrugsüberweisung", coverage: "COVERED", requiredClaimKeys: ["scam-transfer-not-automatically-675u", "do-not-blame-or-promise-scam"], requiredProcessKeys: ["betrugsueberweisung"] },
  { id: "transfer-recall", label: "Recall einer Überweisung", coverage: "COVERED", requiredClaimKeys: ["transfer-not-freely-reversible", "storno-not-guaranteed"], requiredProcessKeys: ["widerruf-recall"] },
  { id: "transfer-delayed", label: "Gewöhnliche Überweisung verspätet", coverage: "COVERED", requiredClaimKeys: ["delay-not-lost", "recipient-missing-not-auto-liability"], requiredProcessKeys: ["fehlerhafte-zahlung"] },
  { id: "transfer-rejected", label: "Überweisung abgelehnt", coverage: "COVERED", requiredClaimKeys: ["refusal-not-termination", "refusal-reason-may-be-withheld"], requiredProcessKeys: ["abgelehnte-zahlung"] },
  { id: "instant-sent-incorrectly", label: "Echtzeitüberweisung falsch gesendet", coverage: "COVERED", requiredClaimKeys: ["instant-not-reversible", "instant-contact-immediately"], requiredProcessKeys: ["echtzeitueberweisung"] },
  { id: "vop-match", label: "VoP-Treffer", coverage: "COVERED", requiredClaimKeys: ["vop-match-not-trust", "vop-not-fraud-insurance"], requiredProcessKeys: ["vop-einordnen"] },
  { id: "vop-warning", label: "VoP-Warnung Nähe oder kein Treffer", coverage: "COVERED", requiredClaimKeys: ["vop-warning-not-auto-block", "vop-match-not-invoice-legit"], requiredProcessKeys: ["vop-einordnen"] },
  { id: "vop-unavailable", label: "VoP nicht verfügbar", coverage: "COVERED", requiredClaimKeys: ["vop-unavailable-not-block", "vop-inside-banking"], requiredProcessKeys: ["vop-einordnen"] },
  { id: "goods-not-delivered", label: "Autorisierte Kartenzahlung Ware nicht geliefert", coverage: "COVERED", requiredClaimKeys: ["merchant-dispute-not-unauthorized", "chargeback-not-675u"], requiredProcessKeys: ["chargeback-grenze"] },
  { id: "card-not-authorized", label: "Kartenzahlung nicht autorisiert", coverage: "COVERED", requiredClaimKeys: ["section-675u-refund", "chargeback-not-675u"], requiredProcessKeys: ["kartenzahlung-reklamieren"] },
  { id: "card-reserved", label: "Kartenbetrag reserviert", coverage: "COVERED", requiredClaimKeys: ["reservation-not-final-debit", "reservation-needs-exact-consent"], requiredProcessKeys: ["kartenreservierung"] },
  { id: "unusual-fee", label: "Ungewöhnliche Gebühr", coverage: "COVERED", requiredClaimKeys: ["fee-not-automatically-lawful", "fee-not-automatically-unlawful"], requiredProcessKeys: ["gebuehren-vertragsaenderung"] },
  { id: "fee-increase", label: "Gebührenerhöhung", coverage: "COVERED", requiredClaimKeys: ["two-month-change-notice", "price-list-not-statute"], requiredProcessKeys: ["gebuehren-vertragsaenderung"] },
  { id: "agb-change", label: "AGB- oder Zahlungsvertragsänderung", coverage: "COVERED", requiredClaimKeys: ["silence-not-universal-consent", "new-terms-not-automatically-valid"], requiredProcessKeys: ["gebuehren-vertragsaenderung"] },
  { id: "bank-terminates-giro", label: "Bank kündigt Girokonto", coverage: "COVERED", requiredClaimKeys: ["provider-two-months", "giro-not-basiskonto-termination"], requiredProcessKeys: ["kontokuendigung"] },
  { id: "immediate-termination", label: "Sofortige Bankkündigung", coverage: "COVERED", requiredClaimKeys: ["immediate-not-automatically-unlawful", "bank-not-immediate-without-rule"], requiredProcessKeys: ["kontokuendigung"] },
  { id: "no-full-reason", label: "Bank nennt keinen vollen Grund", coverage: "COVERED", requiredClaimKeys: ["no-reason-not-automatically-unlawful", "compliance-not-crime-proof"], requiredProcessKeys: ["kontokuendigung"] },
  { id: "basiskonto-wanted", label: "Basiskonto gewünscht", coverage: "COVERED", requiredClaimKeys: ["basiskonto-claim", "basiskonto-not-free", "basiskonto-not-dispo"], requiredProcessKeys: ["basiskonto-einordnen"] },
  { id: "basiskonto-agreed-overdraft", label: "Vereinbarter Dispo auf Basiskonto", coverage: "COVERED", requiredClaimKeys: ["basiskonto-section-39-agreed-overdraft", "basiskonto-not-dispo-prohibition"], requiredProcessKeys: ["basiskonto-einordnen"] },
  { id: "basiskonto-refused", label: "Basiskonto abgelehnt", coverage: "COVERED", requiredClaimKeys: ["basiskonto-not-any-reason-refuse", "already-usable-account-affects-basiskonto"], requiredProcessKeys: ["basiskonto-ablehnung-kuendigung"] },
  { id: "basiskonto-terminated", label: "Basiskonto gekündigt", coverage: "COVERED", requiredClaimKeys: ["basiskonto-special-termination", "giro-not-basiskonto-termination"], requiredProcessKeys: ["basiskonto-ablehnung-kuendigung"] },
  { id: "card-blocked", label: "Karte gesperrt", coverage: "COVERED", requiredClaimKeys: ["card-block-not-account-closed", "block-not-cancel-authorized"], requiredProcessKeys: ["sperre-einordnen"] },
  { id: "online-banking-blocked", label: "Onlinebanking gesperrt", coverage: "COVERED", requiredClaimKeys: ["online-block-not-forfeiture", "never-share-pin-tan"], requiredProcessKeys: ["sperre-einordnen"] },
  { id: "whole-account-restricted", label: "Ganzes Konto eingeschränkt", coverage: "COVERED", requiredClaimKeys: ["account-restrict-not-crime", "compliance-not-crime-proof"], requiredProcessKeys: ["sperre-einordnen"] },
  { id: "account-garnished", label: "Konto gepfändet", coverage: "COVERED", requiredClaimKeys: ["do-not-ignore-garnishment", "pkonto-not-debt-gone"], requiredProcessKeys: ["kontopfaendung-boundary"] },
  { id: "wants-pkonto", label: "Nutzer will P-Konto", coverage: "COVERED", requiredClaimKeys: ["pkonto-one-account", "pkonto-not-all-protected"], requiredProcessKeys: ["pkonto-einordnen"] },
  { id: "pkonto-negative", label: "P-Konto bei negativem Saldo", coverage: "COVERED", requiredClaimKeys: ["pkonto-negative-possible", "negative-not-pkonto-impossible"], requiredProcessKeys: ["pkonto-einordnen"] },
  { id: "already-has-pkonto", label: "Bereits ein anderes P-Konto", coverage: "COVERED", requiredClaimKeys: ["pkonto-one-account", "pkonto-not-debt-gone"], requiredProcessKeys: ["pkonto-einordnen"] },
  { id: "overdraft-problem", label: "Dispo- oder Überziehungsproblem", coverage: "COVERED", requiredClaimKeys: ["dispo-not-owned-balance", "overdraft-not-permanent"], requiredProcessKeys: ["konto-zahlungsart-bestimmen"] },
  { id: "bank-complaint", label: "Interne Bankbeschwerde", coverage: "COVERED", requiredClaimKeys: ["internal-written-complaint", "complaint-not-lawsuit"], requiredProcessKeys: ["interne-bankbeschwerde"], requiredFormIdentifiers: ["BNK-Bankbeschwerde"] },
  { id: "private-bank-ombudsman", label: "Ombudsmann der privaten Banken", coverage: "COVERED", requiredClaimKeys: ["private-ombud-not-sparkasse", "membership-fetch-live"], requiredProcessKeys: ["ombudsmann-private-banken"], requiredFormIdentifiers: ["BNK-Ombudsmann-Private-Banken"] },
  { id: "sparkasse-cooperative-route", label: "Sparkassen- oder Genossenschaftsroute", coverage: "COVERED", requiredClaimKeys: ["not-one-ombudsman-all-banks", "private-ombud-not-sparkasse"], requiredProcessKeys: ["schlichtungsstelle-bestimmen"] },
  { id: "bundesbank-fallback", label: "Bundesbank-Auffangschlichtung", coverage: "COVERED", requiredClaimKeys: ["bundesbank-is-fallback", "not-one-ombudsman-all-banks"], requiredProcessKeys: ["bundesbank-schlichtung"], requiredFormIdentifiers: ["BNK-Bundesbank-Schlichtung"] },
  { id: "bafin-complaint", label: "BaFin-Beschwerde", coverage: "COVERED", requiredClaimKeys: ["bafin-not-refund-order", "bafin-deadlines-continue"], requiredProcessKeys: ["bafin-beschwerde-boundary"], requiredFormIdentifiers: ["BAFIN-Verbraucherbeschwerde"] },
  { id: "exact-refund-deadline-unclear", label: "Genaue Erstattungsfrist unklar", coverage: "COVERED", requiredClaimKeys: ["individual-deadline-fail-closed", "document-date-not-deadline"], requiredProcessKeys: ["fristen-einordnen"] },
  { id: "authorization-unclear", label: "Autorisierung unklar", coverage: "COVERED", requiredClaimKeys: ["unclear-authorization-fail-closed", "money-left-not-unauthorized"], requiredProcessKeys: ["autorisierung-bestimmen"] },
  { id: "phishing-gross-negligence", label: "Nutzer fragt, ob Phishing grobe Fahrlässigkeit war", coverage: "COVERED", requiredClaimKeys: ["phishing-not-automatically-gross", "gross-neg-not-from-outcome"], requiredProcessKeys: ["kundenhaftung-einordnen"] },
  { id: "must-refund-scam", label: "Nutzer fragt, ob Bank Betrugsüberweisung bestimmt erstatten muss", coverage: "COVERED", requiredClaimKeys: ["do-not-blame-or-promise-scam", "scam-transfer-not-automatically-675u"], requiredProcessKeys: ["betrugsueberweisung"] },
  { id: "securities-investment-dispute", label: "Wertpapier- oder Anlagestreit", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Zahlungs- und Phishing-Sicherheit." },
  { id: "consumer-loan-dispute", label: "Verbraucherkreditstreit", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Konto-, Dispo- und Zahlungsausführung." },
  { id: "complete-mortgage-engine", label: "Vollständiges Hypothekenengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kein Immobilienkreditrecht." },
  { id: "complete-dispo-affordability", label: "Vollständiges Dispo-Leistbarkeitsengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Orientierung." },
  { id: "investment-advice", label: "Anlageberatung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Außerhalb des Zahlungskerns." },
  { id: "securities-depot-law", label: "Depot- und Wertpapierrecht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing." },
  { id: "crypto-trading", label: "Kryptohandel", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Phishing- oder Überweisungssicherheit." },
  { id: "aml-litigation", label: "Komplexe Geldwäscheprozessführung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine AML-Merits." },
  { id: "garnishment-calculator", label: "Vollständige Pfändungsberechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Vollstreckungsrechnung." },
  { id: "insolvency", label: "Insolvenzverfahren", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Außerhalb dieses Kerns." },
  { id: "business-banking", label: "Geschäftskundenbanking", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Verbraucherkern." },
  { id: "commercial-b2b-sepa", label: "Kommerzielles SEPA-Firmenlastschriftengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Klassifikation." },
  { id: "card-scheme-rulebooks", label: "Vollständige Kartenschema-Regelwerke", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Schema ist nicht Gesetz." },
  { id: "criminal-fraud-defense", label: "Strafverteidigung bei Betrug", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Sicherheit und Anzeigeorientierung." },
  { id: "civil-litigation-strategy", label: "Zivilprozessstrategie", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Klage- oder Verteidigungsstrategie." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "bgb-675j", informationClass: "SANCTION" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bgb-676b", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bgb-675v", informationClass: "SANCTION" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "zpo-850k", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "bankenombud-ordnung", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bafin-complaint", informationClass: "SANCTION" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bundesbank-schlichtung", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
]);

export function evaluateBnkProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = BNK_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = BNK_PROCESS_SCENARIOS.map((scenario) => {
    if (scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE") {
      return Object.freeze({
        ...scenario,
        derived: "EXPLICITLY_OUT_OF_SCOPE" as const,
        satisfied: scenario.requiredClaimKeys.length === 0 && scenario.requiredProcessKeys.length === 0,
      });
    }
    if (scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE") {
      return Object.freeze({
        ...scenario,
        derived: "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE" as const,
        satisfied: false,
      });
    }
    const claimsPresent = scenario.requiredClaimKeys.every((key) =>
      claimByKey.has(key) && units.some((unit) => unit.key === key));
    const processesPresent = scenario.requiredProcessKeys.every((key) => processByKey.has(key));
    const formsPresent = (scenario.requiredFormIdentifiers ?? []).every((identifier) => formIds.has(identifier));
    const bound = scenario.requiredProcessKeys.every((processKey) => {
      const process = processByKey.get(processKey);
      return scenario.requiredClaimKeys.some((claimKey) => {
        const claim = claimByKey.get(claimKey);
        return Boolean(process && claim && pack.processClaimLinks.some((link) =>
          link.processId === process.id && link.claimId === claim.id));
      });
    });
    const covered = claimsPresent && processesPresent && formsPresent && bound;
    return Object.freeze({
      ...scenario,
      derived: covered ? "COVERED" as const : "GAP" as const,
      satisfied: covered,
    });
  });
  const coveredScenarioCount = rows.filter((row) => row.derived === "COVERED").length;
  const outOfScopeScenarioCount = rows.filter((row) => row.derived === "EXPLICITLY_OUT_OF_SCOPE").length;
  const blockedScenarioCount = rows.filter((row) =>
    row.derived === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE" || row.derived === "GAP").length;
  return Object.freeze({
    rows,
    processScenarioCount: rows.length,
    coveredScenarioCount,
    outOfScopeScenarioCount,
    blockedScenarioCount,
    processCompletenessPercent: rows.length === 0
      ? 0
      : Math.round((coveredScenarioCount / (rows.length - outOfScopeScenarioCount)) * 100),
  });
}

export function buildBnkFederalCorePack(): CuratedDomainPack {
  const item = factory(BNK_PACK_ID);
  const trustDomain = item("trustDomain", "de", { code: "de", name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal",
    code: "DE",
    countryCode: "DE",
    name: "Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "national",
    jurisdictionIds: [jurisdiction.id],
    landCodes: [],
    kreisCodes: [],
    municipalityCodes: [],
  });
  const publishers = {
    bmj: item("publishers", "bmj-bfj", {
      name: "Bundesministerium der Justiz / Bundesamt für Justiz",
      type: "federal_publication",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bafin: item("publishers", "bafin", {
      name: "Bundesanstalt für Finanzdienstleistungsaufsicht",
      type: "federal_supervisor",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bundesbank: item("publishers", "deutsche-bundesbank", {
      name: "Deutsche Bundesbank",
      type: "federal_central_bank",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bankenombud: item("publishers", "bankenombudsmann", {
      name: "Ombudsmann der privaten Banken",
      type: "recognized_adr_body",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bmj: item("authorities", "bundesministerium-justiz", {
      publisherId: publishers.bmj.id,
      name: "Bundesministerium der Justiz / Bundesamt für Justiz",
      type: "federal_publication",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de/bgb/__675c.html",
    }),
    bafin: item("authorities", "bundesanstalt-finanzdienstleistungsaufsicht", {
      publisherId: publishers.bafin.id,
      name: "Bundesanstalt für Finanzdienstleistungsaufsicht",
      type: "federal_supervisor",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/hilfe-kontakt/beschwerden-streitschlichtung/bei-bafin-beschweren/bei-bafin-beschweren_node.html",
    }),
    bundesbank: item("authorities", "deutsche-bundesbank", {
      publisherId: publishers.bundesbank.id,
      name: "Deutsche Bundesbank",
      type: "federal_central_bank",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bundesbank.de/de/service/schlichtungsstelle/-/schlichtungsverfahren-613580",
    }),
    bankenombud: item("authorities", "bankenombudsmann-stelle", {
      publisherId: publishers.bankenombud.id,
      name: "Ombudsmann der privaten Banken",
      type: "recognized_adr_body",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://bankenombudsmann.de/schlichtungsverfahren/verfahrensordnung",
    }),
  };

  const sources = BNK_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publishers[spec.publisherKey];
    const authority = authorities[spec.authorityKey];
    const source = item("sources", spec.key, {
      publisherId: publisher.id,
      authorityId: authority.id,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      sourceType: spec.sourceType,
      purpose: spec.title,
      canonicalUrl: spec.url,
      officialDomain: spec.officialDomain,
      normalizedOrigin: `https://${spec.officialDomain}`,
      sourceClass: spec.sourceClass,
      authorityLevel: "FEDERAL",
      retrievalMethod: spec.retrievalMethod,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "duty", "procedure", "deadline", "exception"],
      highRiskUseAllowed: false,
      publicationIdentifier: spec.title,
    });
    const versionText = spec.passages.map((passage) => passage.text).join("\n");
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id,
      versionSequence: 1,
      contentHash: HASH(versionText),
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id,
      order,
      headingPath: [spec.title],
      locator: passage.locator,
      text: passage.text,
      textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:${spec.informationClass}`, {
      sourceId: source.id,
      informationClass: spec.informationClass,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.requiredContextKeys,
      riskClass: spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? "HIGH" : "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source",
      entityId: source.id,
      status: "fresh",
      effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });

  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));

  const claims = BNK_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`BNK_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type,
      text: unit.text,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel,
      requiresEffectiveDate: unit.requiresEffectiveDate === true,
      requiresAuthorityResolution: unit.requiresAuthorityResolution === true,
      temporalClass: unit.temporal,
      category: unit.category,
    });
    const evidence = item("evidenceLinks", `${unit.key}:evidence`, {
      claimId: claim.id,
      sourceVersionId: source.version.id,
      passageId: passage.id,
      role: "official_guidance",
      primary: true,
    });
    const citation = item("citations", `${unit.key}:citation`, {
      claimId: claim.id,
      sourceId: source.source.id,
      sourceVersionId: source.version.id,
      passageId: passage.id,
      publisherId: source.source.publisherId,
      jurisdictionId: jurisdiction.id,
      label: source.spec.title,
      canonicalUrl: source.spec.url,
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim",
      entityId: claim.id,
      status: "fresh",
      effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });

  const extraPolicies = CONTEXT_GATE_POLICIES.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    if (!source) throw new Error(`BNK_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
    return item("handlingPolicies", `${spec.sourceKey}:${spec.informationClass}:context`, {
      sourceId: source.source.id,
      informationClass: spec.informationClass,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.requiredContextKeys,
      riskClass: spec.riskClass,
    });
  });

  const processes = BNK_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: BNK_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected:
      spec.key === "bafin-beschwerde-boundary"
      || spec.key === "schlichtungsstelle-bestimmen",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = BNK_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`BNK_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`BNK_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
      return item("processClaimLinks", `${binding.processKey}:${claimKey}:${binding.role}`, {
        processId: process.id,
        claimId: claim.id,
        role: binding.role,
        required: true,
        sequenceContext: binding.sequenceContext,
        qualificationRequired: false,
      });
    });
  });

  const inspectMessageRule = item("actorRules", "inspect-message-before-route", {
    actorState: "inspect_bank_message_before_route",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const authorizationRule = item("actorRules", "authorization-undetermined", {
    actorState: "payment_authorization_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individual-deadline-undetermined", {
    actorState: "individual_banking_deadline_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const authenticityRule = item("actorRules", "authenticity-unverified", {
    actorState: "bank_sender_authenticity_unverified",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const membershipRule = item("actorRules", "schlichtung-membership-undetermined", {
    actorState: "schlichtungsstelle_membership_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const secretRule = item("actorRules", "secrets-must-not-be-collected", {
    actorState: "banking_secrets_must_not_be_collected",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = BNK_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`BNK_FORM_SOURCE_MISSING:${spec.key}`);
    return item("forms", spec.key, {
      name: spec.name,
      identifier: spec.identifier,
      authorityId: source.source.authorityId,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      sourceVersionId: source.version.id,
      passageId: passage.id,
      purpose: spec.purpose,
      submissionChannels: spec.submissionChannels,
    });
  });

  return Object.freeze({
    schemaVersion: KNOWLEDGE_FACTORY_SCHEMA_VERSION,
    packId: BNK_PACK_ID,
    domain: BNK_DOMAIN,
    canonicalLanguage: BNK_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bafin, publishers.bundesbank, publishers.bankenombud],
    authorities: [authorities.bmj, authorities.bafin, authorities.bundesbank, authorities.bankenombud],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [
      inspectMessageRule, authorizationRule, deadlineRule, authenticityRule, membershipRule, secretRule,
    ],
    processes,
    processClaimLinks,
    forms,
    fees: [],
    handlingPolicies: [...sources.map(({ policy }) => policy), ...extraPolicies],
    freshnessRecords: [
      ...sources.map(({ freshness }) => freshness),
      ...claims.map(({ claimFreshness }) => claimFreshness),
    ],
  });
}

export function bnkPackSummary(pack: CuratedDomainPack = buildBnkFederalCorePack()) {
  const categories = Object.fromEntries(
    BNK_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<BnkUnitCategory, number>()),
  );
  const completeness = evaluateBnkProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: BNK_UNITS.length,
    futureWatchCount: BNK_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: BNK_G3_PROCESS_STEP_LIMITATION,
    categories,
    processScenarioCount: completeness.processScenarioCount,
    coveredScenarioCount: completeness.coveredScenarioCount,
    outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
    blockedScenarioCount: completeness.blockedScenarioCount,
    processCompletenessPercent: completeness.processCompletenessPercent,
    expectedSemanticCreated:
      1
      + pack.jurisdictions.length
      + pack.territorialScopes.length
      + pack.publishers.length
      + pack.authorities.length
      + pack.sources.length
      + pack.sourceVersions.length
      + pack.passages.length
      + pack.claims.length
      + pack.evidenceLinks.length
      + pack.citations.length
      + pack.actorRules.length
      + pack.processes.length
      + pack.processClaimLinks.length
      + pack.forms.length
      + pack.fees.length
      + pack.handlingPolicies.length
      + pack.freshnessRecords.length,
  });
}
