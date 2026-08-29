/**
 * KNOWLEDGE-EXPANSION-02 — German federal Steuer-ID / basic Finanzamt letters
 * process-complete pack.
 * Official-source G3 CuratedDomainPack for domain
 * steuer_id_and_basic_finanzamt_letters.
 * Canonical language is German only. Not a runtime route.
 *
 * G3 limitation: knowledge_process_steps exist in schema 032 but are not part of
 * CuratedDomainPack / knowledge_ingest_curated_domain_pack. Journey structure is
 * therefore represented as named processes + processClaimLinks (role/sequenceContext).
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";

export const STEUER_ID_DOMAIN = "steuer_id_and_basic_finanzamt_letters" as const;
export const STEUER_ID_PACK_ID = STEUER_ID_DOMAIN;
export const STEUER_ID_CANONICAL_LANGUAGE = "de" as const;

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

export type SteuerIdUnitCategory =
  | "identification"
  | "identifier_distinction"
  | "document_semantics"
  | "steuerbescheid"
  | "aufforderung"
  | "evidence"
  | "schaetzung"
  | "filing_delay"
  | "payment"
  | "einspruch"
  | "bekanntgabe"
  | "competence"
  | "communication"
  | "cross_border"
  | "problem_path";

export type SteuerIdContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "RESIDENCE_STATE"
  | "COUNTRY";
export type SteuerIdHandlingMode = "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type SteuerIdFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type SteuerIdStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type SteuerIdInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL";
export type SteuerIdProcessRole =
  | "orientation_basis"
  | "required_information"
  | "identification"
  | "application_route"
  | "form_semantics"
  | "evidence_requirement"
  | "next_state"
  | "deadline_gate"
  | "decision"
  | "payment"
  | "legal_remedy_gate"
  | "context_gate"
  | "negative_control";
export type SteuerIdScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const STEUER_ID_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type SteuerIdTemporalClass = "current_2026";

export type SteuerIdFutureChangeWatchItem = Readonly<{
  id: string;
  key: string;
  officialSourceUrl: string;
  officialDomain: string;
  officialSourceTitle: string;
  targetYear: 2026 | 2027;
  status: "future_change_watch_not_ingestible";
  currentGuidance: false;
  description: string;
}>;

type OfficialSourceSpec = Readonly<{
  key: string;
  publisherKey: "bmj" | "bzst" | "elster";
  authorityKey: "bzst" | "finanzbehoerden";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "OFFICIAL_FORM" | "OFFICIAL_ONLINE_SERVICE";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: SteuerIdInformationClass;
  handlingMode: SteuerIdHandlingMode;
  freshnessClass: SteuerIdFreshnessClass;
  staleBehavior: SteuerIdStaleBehavior;
  requiredContextKeys: readonly SteuerIdContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: SteuerIdUnitCategory;
  temporal: SteuerIdTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly SteuerIdContextKey[];
}>;

export const STEUER_ID_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "ao-6",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__6.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 6 Behörden, Finanzbehörden",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-6-2",
        locator: "AO § 6 Abs. 2",
        text: "Finanzbehörden im Sinne der Abgabenordnung sind die im Finanzverwaltungsgesetz genannten Bundes- und Landesfinanzbehörden, darunter als örtliche Behörden die Finanzämter und die besonderen Landesfinanzbehörden. Ein bundesweit einheitliches Finanzamt als einzige zuständige Stelle gibt es danach nicht.",
      },
    ],
  },
  {
    key: "ao-19",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__19.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 19 Steuern vom Einkommen und Vermögen natürlicher Personen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-19-1",
        locator: "AO § 19 Abs. 1",
        text: "Für die Besteuerung natürlicher Personen nach dem Einkommen und Vermögen ist das Finanzamt örtlich zuständig, in dessen Bezirk der Steuerpflichtige seinen Wohnsitz oder in Ermangelung eines Wohnsitzes seinen gewöhnlichen Aufenthalt hat (Wohnsitzfinanzamt). Bei mehrfachem Wohnsitz gelten besondere Aufenthaltsregeln. Andere Steuerarten, Sonderzuständigkeiten und abweichende gesetzliche Zuweisungen können ein anderes Finanzamt zuständig machen.",
      },
    ],
  },
  {
    key: "ao-93",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__93.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 93 Auskunftspflicht der Beteiligten und anderer Personen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-93-1-2",
        locator: "AO § 93 Abs. 1 und 2",
        text: "Die Beteiligten und andere Personen haben der Finanzbehörde die zur Feststellung eines für die Besteuerung erheblichen Sachverhalts erforderlichen Auskünfte zu erteilen. In dem Auskunftsersuchen ist anzugeben, worüber Auskünfte erteilt werden sollen und ob die Auskunft für die Besteuerung des Auskunftspflichtigen oder für die Besteuerung anderer Personen angefordert wird.",
      },
    ],
  },
  {
    key: "ao-108",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__108.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 108 Fristen und Termine",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["EVENT_DATE"],
    passages: [
      {
        key: "ao-108-2-3",
        locator: "AO § 108 Abs. 2 und 3",
        text: "Der Lauf einer von einer Behörde gesetzten Frist beginnt mit dem Tag, der auf die Bekanntgabe der Frist folgt, außer wenn der betroffenen Person etwas anderes mitgeteilt wird. Fällt das Ende einer Frist auf einen Sonntag, einen gesetzlichen Feiertag oder einen Sonnabend, so endet die Frist mit dem Ablauf des nächstfolgenden Werktags. Welche gesetzlichen Feiertage gelten, hängt vom maßgeblichen Feiertagsrecht ab und ergibt sich nicht aus der deutschen Sprache oder der userLocale.",
      },
    ],
  },
  {
    key: "ao-118",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__118.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 118 Begriff des Verwaltungsakts",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-118-1",
        locator: "AO § 118",
        text: "Verwaltungsakt ist jede Verfügung, Entscheidung oder andere hoheitliche Maßnahme, die eine Behörde zur Regelung eines Einzelfalls auf dem Gebiet des öffentlichen Rechts trifft und die auf unmittelbare Rechtswirkung nach außen gerichtet ist. Die bloße Bezeichnung eines Schreibens als Brief, Erinnerung oder Information macht es nicht automatisch zum Verwaltungsakt.",
      },
    ],
  },
  {
    key: "ao-121",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__121.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 121 Begründung des Verwaltungsakts",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-121-1",
        locator: "AO § 121 Abs. 1",
        text: "Ein schriftlicher, elektronischer sowie ein schriftlich oder elektronisch bestätigter Verwaltungsakt ist mit einer Begründung zu versehen, soweit dies zu seinem Verständnis erforderlich ist.",
      },
    ],
  },
  {
    key: "ao-122",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__122.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 122 Bekanntgabe des Verwaltungsakts",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-122-2",
        locator: "AO § 122 Abs. 2",
        text: "Ein schriftlicher Verwaltungsakt, der durch die Post übermittelt wird, gilt bei einer Übermittlung im Inland am vierten Tage nach der Aufgabe zur Post als bekannt gegeben, bei einer Übermittlung im Ausland einen Monat nach der Aufgabe zur Post, außer wenn er nicht oder zu einem späteren Zeitpunkt zugegangen ist; im Zweifel hat die Behörde den Zugang und den Zeitpunkt des Zugangs nachzuweisen. Das auf dem Schreiben gedruckte Datum ist nicht ohne weiteres der Beginn der Rechtsbehelfsfrist.",
      },
      {
        key: "ao-122-2a",
        locator: "AO § 122 Abs. 2a",
        text: "Ein elektronisch übermittelter Verwaltungsakt gilt am vierten Tage nach der Absendung als bekannt gegeben, außer wenn er nicht oder zu einem späteren Zeitpunkt zugegangen ist; im Zweifel hat die Behörde den Zugang und den Zeitpunkt des Zugangs nachzuweisen.",
      },
    ],
  },
  {
    key: "ao-122a",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__122a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 122a Bekanntgabe durch Bereitstellung zum Datenabruf",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"],
    passages: [
      {
        key: "ao-122a-4",
        locator: "AO § 122a Abs. 4",
        text: "Ein zum Abruf bereitgestellter Verwaltungsakt gilt am vierten Tag nach der Bereitstellung zum Abruf als bekannt gegeben. Im Zweifel hat die Behörde den Zeitpunkt der Bereitstellung zum Abruf nachzuweisen. Die abrufberechtigte Person ist am Tag der Bereitstellung elektronisch über die Abrufmöglichkeit und ihre Rechtswirkungen zu benachrichtigen.",
      },
    ],
  },
  {
    key: "ao-139a",
    publisherKey: "bmj",
    authorityKey: "bzst",
    url: "https://www.gesetze-im-internet.de/ao_1977/__139a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 139a Identifikationsmerkmal",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-139a-1",
        locator: "AO § 139a Abs. 1",
        text: "Das Bundeszentralamt für Steuern teilt jedem Steuerpflichtigen und jeder sonstigen natürlichen Person, die bei einer öffentlichen Stelle ein Verwaltungsverfahren führt, ein einheitliches und dauerhaftes Identifikationsmerkmal zu. Natürliche Personen erhalten eine Identifikationsnummer, wirtschaftlich Tätige eine Wirtschafts-Identifikationsnummer. Die betroffene Person ist über die Zuteilung unverzüglich zu unterrichten.",
      },
    ],
  },
  {
    key: "ao-139b",
    publisherKey: "bmj",
    authorityKey: "bzst",
    url: "https://www.gesetze-im-internet.de/ao_1977/__139b.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 139b Identifikationsnummer",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-139b-1",
        locator: "AO § 139b Abs. 1",
        text: "Eine natürliche Person darf nicht mehr als eine Identifikationsnummer erhalten. Jede Identifikationsnummer darf nur einmal vergeben werden.",
      },
    ],
  },
  {
    key: "ao-139c",
    publisherKey: "bmj",
    authorityKey: "bzst",
    url: "https://www.gesetze-im-internet.de/ao_1977/__139c.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 139c Wirtschafts-Identifikationsnummer",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-139c-1",
        locator: "AO § 139c Abs. 1",
        text: "Die Wirtschafts-Identifikationsnummer wird auf Anforderung der zuständigen Finanzbehörde vergeben. Sie beginnt mit den Buchstaben DE. Jede Wirtschafts-Identifikationsnummer darf nur einmal vergeben werden.",
      },
    ],
  },
  {
    key: "ao-149",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__149.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 149 Abgabe der Steuererklärungen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-149-1",
        locator: "AO § 149 Abs. 1",
        text: "Die Steuergesetze bestimmen, wer zur Abgabe einer Steuererklärung verpflichtet ist. Zur Abgabe einer Steuererklärung ist auch verpflichtet, wer hierzu von der Finanzbehörde aufgefordert wird. Die Verpflichtung zur Abgabe einer Steuererklärung bleibt auch dann bestehen, wenn die Finanzbehörde die Besteuerungsgrundlagen nach § 162 geschätzt hat.",
      },
    ],
  },
  {
    key: "ao-152",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__152.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 152 Verspätungszuschlag",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["PROCESS_VARIANT"],
    passages: [
      {
        key: "ao-152-1-3",
        locator: "AO § 152 Abs. 1 bis 3",
        text: "Gegen denjenigen, der seiner Verpflichtung zur Abgabe einer Steuererklärung nicht oder nicht fristgemäß nachkommt, kann ein Verspätungszuschlag festgesetzt werden. In den Fällen des Absatzes 2 ist abweichend davon ein Verspätungszuschlag festzusetzen, soweit nicht eine der Ausnahmen des Absatzes 3 greift. Die Höhe richtet sich nach den gesetzlichen Bemessungsregeln und dem konkreten Bescheid; ein universeller Betrag für jeden Verspätungsfall ist daraus nicht abzuleiten.",
      },
    ],
  },
  {
    key: "ao-155",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__155.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 155 Steuerfestsetzung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-155-1",
        locator: "AO § 155 Abs. 1",
        text: "Die Steuern werden, soweit nichts anderes vorgeschrieben ist, von der Finanzbehörde durch Steuerbescheid festgesetzt. Steuerbescheid ist der nach § 122 Absatz 1 bekannt gegebene Verwaltungsakt. Dies gilt auch für die volle oder teilweise Freistellung von einer Steuer und für die Ablehnung eines Antrags auf Steuerfestsetzung.",
      },
    ],
  },
  {
    key: "ao-157",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__157.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 157 Form und Inhalt der Steuerbescheide",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-157-1",
        locator: "AO § 157 Abs. 1",
        text: "Steuerbescheide sind schriftlich oder elektronisch zu erteilen, soweit nichts anderes bestimmt ist. Sie müssen die festgesetzte Steuer nach Art und Betrag bezeichnen und angeben, wer die Steuer schuldet. Ihnen ist außerdem eine Belehrung darüber beizufügen, welcher Rechtsbehelf zulässig ist und binnen welcher Frist und bei welcher Behörde er einzulegen ist.",
      },
    ],
  },
  {
    key: "ao-162",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__162.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 162 Schätzung von Besteuerungsgrundlagen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-162-1",
        locator: "AO § 162 Abs. 1",
        text: "Soweit die Finanzbehörde die Besteuerungsgrundlagen nicht ermitteln oder berechnen kann, hat sie sie zu schätzen. Dabei sind alle Umstände zu berücksichtigen, die für die Schätzung von Bedeutung sind.",
      },
    ],
  },
  {
    key: "ao-220",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__220.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 220 Fälligkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["PROCESS_VARIANT"],
    passages: [
      {
        key: "ao-220-all",
        locator: "AO § 220",
        text: "Die Fälligkeit von Ansprüchen aus dem Steuerschuldverhältnis richtet sich nach den Vorschriften der Steuergesetze. Fehlt es an einer besonderen gesetzlichen Regelung, so wird der Anspruch mit seiner Entstehung fällig, es sei denn, dass in einem Leistungsgebot eine Zahlungsfrist eingeräumt worden ist. Ergibt sich der Anspruch aus der Festsetzung, so tritt die Fälligkeit nicht vor Bekanntgabe der Festsetzung ein.",
      },
    ],
  },
  {
    key: "ao-240",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__240.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 240 Säumniszuschläge",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["PROCESS_VARIANT"],
    passages: [
      {
        key: "ao-240-1-3",
        locator: "AO § 240 Abs. 1 bis 3",
        text: "Wird eine Steuer nicht bis zum Ablauf des Fälligkeitstages entrichtet, so ist für jeden angefangenen Monat der Säumnis ein Säumniszuschlag von 1 Prozent des abgerundeten rückständigen Steuerbetrags zu entrichten; abzurunden ist auf den nächsten durch 50 Euro teilbaren Betrag. Die Säumnis tritt nicht ein, bevor die Steuer festgesetzt oder angemeldet worden ist. Ein Säumniszuschlag wird bei einer Säumnis bis zu drei Tagen nicht erhoben, außer bei Zahlung nach § 224 Absatz 2 Nummer 1. Säumniszuschläge entstehen nicht bei steuerlichen Nebenleistungen.",
      },
    ],
  },
  {
    key: "ao-347",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__347.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 347 Statthaftigkeit des Einspruchs",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["PROCESS_VARIANT"],
    passages: [
      {
        key: "ao-347-1",
        locator: "AO § 347 Abs. 1",
        text: "Gegen Verwaltungsakte in Abgabenangelegenheiten, auf die die Abgabenordnung Anwendung findet, ist als Rechtsbehelf der Einspruch statthaft. Der Einspruch ist außerdem statthaft, wenn geltend gemacht wird, dass über einen Antrag auf Erlass eines Verwaltungsakts ohne Mitteilung eines zureichenden Grundes binnen angemessener Frist sachlich nicht entschieden worden ist. Die Vorschriften über den Einspruch finden auf das Straf- und Bußgeldverfahren keine Anwendung.",
      },
    ],
  },
  {
    key: "ao-355",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__355.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 355 Einspruchsfrist",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-355-1",
        locator: "AO § 355 Abs. 1",
        text: "Der Einspruch nach § 347 Absatz 1 Satz 1 ist innerhalb eines Monats nach Bekanntgabe des Verwaltungsakts einzulegen. Ein Einspruch gegen eine Steueranmeldung ist innerhalb eines Monats nach Eingang der Steueranmeldung bei der Finanzbehörde, in den Fällen des § 168 Satz 2 innerhalb eines Monats nach Bekanntwerden der Zustimmung, einzulegen.",
      },
    ],
  },
  {
    key: "ao-356",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__356.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 356 Rechtsbehelfsbelehrung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"],
    passages: [
      {
        key: "ao-356-all",
        locator: "AO § 356",
        text: "Ergeht ein Verwaltungsakt schriftlich oder elektronisch, so beginnt die Frist für die Einlegung des Einspruchs nur, wenn der Beteiligte über den Einspruch und die Finanzbehörde, bei der er einzulegen ist, deren Sitz und die einzuhaltende Frist in der für den Verwaltungsakt verwendeten Form belehrt worden ist. Ist die Belehrung unterblieben oder unrichtig erteilt, so ist die Einlegung des Einspruchs nur binnen eines Jahres seit Bekanntgabe des Verwaltungsakts zulässig, es sei denn, dass die Einlegung vor Ablauf der Jahresfrist infolge höherer Gewalt unmöglich war oder schriftlich oder elektronisch darüber belehrt wurde, dass ein Einspruch nicht gegeben sei.",
      },
    ],
  },
  {
    key: "ao-357",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__357.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 357 Einlegung des Einspruchs",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-357-all",
        locator: "AO § 357",
        text: "Der Einspruch ist schriftlich oder elektronisch einzureichen oder zur Niederschrift zu erklären. Es genügt, wenn aus dem Einspruch hervorgeht, wer ihn eingelegt hat. Unrichtige Bezeichnung des Einspruchs schadet nicht. Der Einspruch ist bei der Behörde anzubringen, deren Verwaltungsakt angefochten wird. Die schriftliche oder elektronische Anbringung bei einer anderen Behörde ist unschädlich, wenn der Einspruch vor Ablauf der Einspruchsfrist einer der zuständigen Behörden übermittelt wird. Bei der Einlegung sollen der Verwaltungsakt, der Umfang der Anfechtung, die Tatsachen und die Beweismittel angegeben werden.",
      },
    ],
  },
  {
    key: "ao-361",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/ao_1977/__361.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 361 Aussetzung der Vollziehung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-361-1-2",
        locator: "AO § 361 Abs. 1 und 2",
        text: "Durch Einlegung des Einspruchs wird die Vollziehung des angefochtenen Verwaltungsakts vorbehaltlich des Absatzes 4 nicht gehemmt, insbesondere die Erhebung einer Abgabe nicht aufgehalten. Die Finanzbehörde, die den angefochtenen Verwaltungsakt erlassen hat, kann die Vollziehung ganz oder teilweise aussetzen. Auf Antrag soll die Aussetzung erfolgen, wenn ernstliche Zweifel an der Rechtmäßigkeit des angefochtenen Verwaltungsakts bestehen oder wenn die Vollziehung eine unbillige, nicht durch überwiegende öffentliche Interessen gebotene Härte zur Folge hätte.",
      },
    ],
  },
  {
    key: "estg-36",
    publisherKey: "bmj",
    authorityKey: "finanzbehoerden",
    url: "https://www.gesetze-im-internet.de/estg/__36.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 36 Entstehung und Tilgung der Einkommensteuer",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["PROCESS_VARIANT"],
    passages: [
      {
        key: "estg-36-4",
        locator: "EStG § 36 Abs. 4",
        text: "Ergibt die Abrechnung der Einkommensteuer einen Überschuss zuungunsten des Steuerpflichtigen, so ist dieser Betrag, soweit er den fällig gewordenen, aber nicht entrichteten Vorauszahlungen entspricht, sofort, im Übrigen innerhalb eines Monats nach Bekanntgabe des Steuerbescheids zu entrichten. Ergibt sich ein Überschuss zugunsten des Steuerpflichtigen, wird dieser nach Bekanntgabe des Steuerbescheids ausgezahlt. Das ist eine einkommensteuerspezifische Fälligkeitsregel und keine universelle Zahlungsfrist für jeden Steuerbescheid.",
      },
    ],
  },
  {
    key: "bzst-idnr",
    publisherKey: "bzst",
    authorityKey: "bzst",
    url: "https://www.bzst.de/DE/Privatpersonen/SteuerlicheIdentifikationsnummer/steuerlicheidentifikationsnummer.html",
    officialDomain: "www.bzst.de",
    title: "BZSt: Die steuerliche Identifikationsnummer",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "bzst-idnr-what",
        locator: "BZSt IdNr Überblick",
        text: "Die Identifikationsnummer (IdNr) ist eine elfstellige Nummer und enthält keine Informationen über die betreffende Person. Sie ist dauerhaft gültig und ändert sich auch nicht durch einen Umzug, eine Namensänderung oder durch die Änderung des Familienstandes.",
      },
      {
        key: "bzst-idnr-find",
        locator: "BZSt IdNr Fundstellen und erneute Mitteilung",
        text: "Die IdNr findet sich in der Regel im Einkommensteuerbescheid oder auf der Lohnsteuerbescheinigung. Wird sie dort nicht gefunden, kann sie über das Eingabeformular des Bundeszentralamts für Steuern oder per Brief erneut angefordert werden. Aus datenschutzrechtlichen Gründen darf die IdNr nur per Brief mitgeteilt werden. Der Versand an eine Anschrift, die nicht der Meldeanschrift entspricht, kann nur mit schriftlicher Vollmacht und einer Kopie des Personaldokuments erfolgen. Telefonisch darf die Identifikationsnummer nicht mitgeteilt werden. Die Einkommensteuererklärung kann auch ohne IdNr beim Finanzamt eingereicht werden; diese ist dem Finanzamt bekannt oder kann ermittelt werden.",
      },
    ],
  },
  {
    key: "bzst-idnr-faq",
    publisherKey: "bzst",
    authorityKey: "bzst",
    url: "https://www.bzst.de/DE/Privatpersonen/SteuerlicheIdentifikationsnummer/FAQ/faq_node.html",
    officialDomain: "www.bzst.de",
    title: "BZSt: Fragen und Antworten zur IdNr",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "bzst-faq-lost",
        locator: "BZSt FAQ erneute Mitteilung",
        text: "Die IdNr wird einer Person dauerhaft zugeteilt. Das Mitteilungsschreiben kann verloren gehen, ohne dass eine neue IdNr entsteht. Auf Anfrage kann das BZSt die zugeordnete IdNr erneut mitteilen. Für die Mitteilung benötigt das BZSt Name, Vorname, Meldeanschrift beziehungsweise Hauptwohnsitz, Geburtsdatum und Geburtsort. Die Daten können über das Eingabeformular im Internetportal des BZSt oder schriftlich an das Bundeszentralamt für Steuern, Referat St II 7, 11055 Berlin, übermittelt werden.",
      },
      {
        key: "bzst-faq-never",
        locator: "BZSt FAQ erstmalige Anmeldung",
        text: "Das BZSt teilt die IdNr zu, sobald die Meldebehörde die benötigten Daten übermittelt hat. Sollte trotz Anmeldung bei der Meldebehörde nach drei Monaten keine IdNr mitgeteilt worden sein, kann dem BZSt eine Kopie des Ausweisdokuments und der Meldebestätigung zugesandt werden. Für eine erfolgreiche Zustellung muss der Nachname am Briefkasten angebracht sein.",
      },
    ],
  },
  {
    key: "bzst-widnr",
    publisherKey: "bzst",
    authorityKey: "bzst",
    url: "https://www.bzst.de/DE/Unternehmen/Identifikationsnummern/Wirtschafts-Identifikationsnummer/wirtschaftsidentifikationsnummer.html",
    officialDomain: "www.bzst.de",
    title: "BZSt: Wirtschafts-Identifikationsnummer",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "bzst-widnr-distinction",
        locator: "BZSt Abgrenzung IdNr, Steuernummer, W-IdNr",
        text: "Natürliche Personen erhalten eine Identifikationsnummer nach § 139b AO, wirtschaftlich Tätige eine Wirtschafts-Identifikationsnummer nach § 139c AO. Die IdNr bleibt das eindeutige Identifikationsmerkmal einer natürlichen Person. Die W-IdNr wird nur im Falle einer wirtschaftlichen Tätigkeit vergeben. Die Steuernummer bleibt bestehen und ist zunächst insbesondere auf den steuerlichen Vordrucken der Landesfinanzbehörden wie bisher zu verwenden. Die Steuererklärungen sind wie gewohnt mit der Steuernummer abzugeben. Die W-IdNr besteht aus den Anfangsbuchstaben DE und einer neunstelligen Ziffernfolge und wird um ein Unterscheidungsmerkmal ergänzt.",
      },
    ],
  },
  {
    key: "elster-privatpersonen",
    publisherKey: "elster",
    authorityKey: "finanzbehoerden",
    url: "https://www.elster.de/elsterweb/infoseite/privatpersonen",
    officialDomain: "www.elster.de",
    title: "ELSTER: Angebote für Privatpersonen",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ONLINE_SERVICE_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-portal-services",
        locator: "ELSTER Privatpersonen Angebote",
        text: "Mein ELSTER ermöglicht es, Formulare, zum Beispiel die Einkommensteuererklärung, einen Einspruch und Nachrichten elektronisch an das Finanzamt zu übermitteln. Belege zur Einkommensteuererklärung sind nur auf Anforderung durch das Finanzamt einzureichen. Einkommensteuerbescheid und andere Dokumente können digital bereitgestellt werden, wenn die Einwilligung zur elektronischen Bekanntgabe erteilt wurde.",
      },
    ],
  },
  {
    key: "elster-forms",
    publisherKey: "elster",
    authorityKey: "finanzbehoerden",
    url: "https://www.elster.de/eportal/formulare-leistungen/alleformulare",
    officialDomain: "www.elster.de",
    title: "ELSTER: Alle Formulare",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-forms-einspruch",
        locator: "ELSTER Formulare Einspruch",
        text: "In Mein ELSTER stehen unter Einspruch die aktuellen Formulare Einspruch einreichen inkl. Aussetzung der Vollziehung, Einspruch ergänzen, erweitern oder einschränken inkl. Aussetzung der Vollziehung sowie Einspruch zurücknehmen zur Verfügung. Unter Anträgen und Nachrichten sind unter anderem die Belegnachreichung zur Steuererklärung, die Sonstige Nachricht an das Finanzamt und die Änderung der Bankverbindung aufgeführt.",
      },
    ],
  },
  {
    key: "elster-einspruch-help",
    publisherKey: "elster",
    authorityKey: "finanzbehoerden",
    url: "https://www.elster.de/eportal/helpGlobal?themaGlobal=help_einsprch",
    officialDomain: "www.elster.de",
    title: "ELSTER: Anleitung zum Formular Einspruch",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-einspruch-aktenzeichen",
        locator: "ELSTER Hilfe Einspruch Aktenzeichen",
        text: "Das Feld Aktenzeichen im ELSTER-Einspruchsformular ist nur im Zusammenhang mit einem Einspruch zur Grundsteuer zu nutzen. Das Aktenzeichen findet sich auf dem letzten Bescheid zur Feststellung des Einheitswerts, der Festsetzung des Grundsteuermessbetrags oder dem Grundsteuerbescheid der Gemeinde. Es ist damit nicht automatisch die steuerliche Identifikationsnummer und nicht automatisch die Steuernummer.",
      },
    ],
  },
  {
    key: "elster-belegnachreichung",
    publisherKey: "elster",
    authorityKey: "finanzbehoerden",
    url: "https://www.elster.de/eportal/formulare-leistungen/alleformulare/belegnachreichung",
    officialDomain: "www.elster.de",
    title: "ELSTER: Belegnachreichung",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-beleg-form",
        locator: "ELSTER Formular Belegnachreichung",
        text: "Mit dem Formular Belegnachreichung können Belege als PDF-Dateien und E-Rechnungen zu Steuererklärungen direkt an das Finanzamt übermittelt werden.",
      },
    ],
  },
  {
    key: "elster-belege-help",
    publisherKey: "elster",
    authorityKey: "finanzbehoerden",
    url: "https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_10_2025",
    officialDomain: "www.elster.de",
    title: "ELSTER: Belegvorhaltepflicht zur Einkommensteuererklärung",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-belege-vorhalt",
        locator: "ELSTER Belegvorhaltepflicht",
        text: "Grundsätzlich brauchen zur Einkommensteuererklärung keine Belege eingereicht zu werden; es genügt, sie für eventuelle Rückfragen aufzubewahren. Belege sind einzureichen, wenn die Formulare oder Ausfüllhilfen ausdrücklich darauf hinweisen oder das Finanzamt dazu auffordert. Sofern das Finanzamt Belege anfordert, sollen sie digital über das Formular Belegnachreichung in Mein ELSTER eingereicht werden. Bei Papierübersendung sollen nur Kopien und keine Originalbelege eingereicht werden.",
      },
    ],
  },
  {
    key: "elster-sonstige-nachricht",
    publisherKey: "elster",
    authorityKey: "finanzbehoerden",
    url: "https://www.elster.de/eportal/formulare-leistungen/alleformulare/eingsonstnachr",
    officialDomain: "www.elster.de",
    title: "ELSTER: Sonstige Nachricht an das Finanzamt",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-sonstige",
        locator: "ELSTER Sonstige Nachricht Hinweis",
        text: "Die Sonstige Nachricht an das Finanzamt soll nicht verwendet werden, wenn für das Anliegen ein passendes Formular besteht.",
      },
    ],
  },
]);

export const STEUER_ID_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.bzst.de/DE/Unternehmen/Identifikationsnummern/Wirtschafts-Identifikationsnummer/wirtschaftsidentifikationsnummer.html",
  officialDomain: "www.bzst.de",
  title: "BZSt: Wirtschafts-Identifikationsnummer, stufenweise Vergabe",
});

export const STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS: readonly SteuerIdFutureChangeWatchItem[] = Object.freeze([
  {
    id: "steuer-id-future-watch:widnr-stage-2-q4-2026",
    key: "widnr-stage-2-q4-2026",
    officialSourceUrl: STEUER_ID_FUTURE_WATCH_SOURCE.url,
    officialDomain: STEUER_ID_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: STEUER_ID_FUTURE_WATCH_SOURCE.title,
    targetYear: 2026,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "BZSt beschreibt die W-IdNr-Vergabe für Körperschaftsteuer- und Feststellungspflichtige ab dem 4. Quartal 2026. Das ist kein bereits abgeschlossenes aktuelles Vergabeverfahren und wird nicht als geltende Nutzeranleitung ingestiert.",
  },
  {
    id: "steuer-id-future-watch:widnr-stage-3-q4-2027",
    key: "widnr-stage-3-q4-2027",
    officialSourceUrl: STEUER_ID_FUTURE_WATCH_SOURCE.url,
    officialDomain: STEUER_ID_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: STEUER_ID_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "BZSt beschreibt weitere W-IdNr-Vergaben und Unterscheidungsmerkmale ab dem 4. Quartal 2027. Das ist künftige Rollout-Information und keine aktuelle persönliche Steuer-ID-Anleitung.",
  },
]);

export const STEUER_ID_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "idnr-is-personal-identifikationsmerkmal", category: "identification", temporal: "current_2026", type: "definition", text: "Die steuerliche Identifikationsnummer ist das einheitliche und dauerhafte Identifikationsmerkmal natürlicher Personen nach §§ 139a und 139b AO. Sie wird vom Bundeszentralamt für Steuern zugeteilt.", sourceKey: "ao-139a", passageKey: "ao-139a-1", riskLevel: "low" },
  { key: "idnr-eleven-digits-no-personal-data", category: "identification", temporal: "current_2026", type: "definition", text: "Die IdNr ist nach dem BZSt eine elfstellige Nummer und enthält keine Informationen über die betreffende Person.", sourceKey: "bzst-idnr", passageKey: "bzst-idnr-what", riskLevel: "low" },
  { key: "idnr-unique-one-per-person", category: "identification", temporal: "current_2026", type: "definition", text: "Eine natürliche Person darf nicht mehr als eine Identifikationsnummer erhalten; jede Identifikationsnummer darf nur einmal vergeben werden.", sourceKey: "ao-139b", passageKey: "ao-139b-1", riskLevel: "low" },
  { key: "idnr-lifelong-unchanged-life-events", category: "identification", temporal: "current_2026", type: "definition", text: "Die IdNr ist dauerhaft gültig und ändert sich nicht durch Umzug, Namensänderung oder Änderung des Familienstandes.", sourceKey: "bzst-idnr", passageKey: "bzst-idnr-what", riskLevel: "low" },
  { key: "idnr-automatic-via-meldebehoerde", category: "identification", temporal: "current_2026", type: "procedure", text: "Das BZSt teilt die IdNr zu, sobald die Meldebehörde die benötigten Daten übermittelt hat. Ein privater Schnellweg zur erstmaligen Zuteilung besteht nicht.", sourceKey: "bzst-idnr-faq", passageKey: "bzst-faq-never", riskLevel: "medium" },
  { key: "idnr-found-on-bescheid-or-lohnsteuer", category: "identification", temporal: "current_2026", type: "procedure", text: "Die IdNr findet sich in der Regel im Einkommensteuerbescheid oder auf der Lohnsteuerbescheinigung.", sourceKey: "bzst-idnr", passageKey: "bzst-idnr-find", riskLevel: "low" },
  { key: "idnr-lost-request-via-bzst", category: "identification", temporal: "current_2026", type: "procedure", text: "Wird die IdNr in den genannten Unterlagen nicht gefunden, kann sie über das Eingabeformular des BZSt oder schriftlich an das Bundeszentralamt für Steuern, Referat St II 7, 11055 Berlin, erneut angefordert werden. Ein inoffizieller Ersatzweg besteht nicht.", sourceKey: "bzst-idnr-faq", passageKey: "bzst-faq-lost", riskLevel: "medium" },
  { key: "idnr-not-by-phone-or-email", category: "identification", temporal: "current_2026", type: "exception", text: "Die IdNr darf aus datenschutzrechtlichen Gründen nicht telefonisch mitgeteilt werden. Das BZSt teilt sie nur per Brief mit.", sourceKey: "bzst-idnr", passageKey: "bzst-idnr-find", riskLevel: "medium" },
  { key: "idnr-never-received-three-months", category: "identification", temporal: "current_2026", type: "procedure", text: "Ist trotz Anmeldung bei der Meldebehörde nach drei Monaten keine IdNr mitgeteilt worden, können dem BZSt eine Kopie des Ausweisdokuments und der Meldebestätigung zugesandt werden. Für die Zustellung muss der Nachname am Briefkasten angebracht sein.", sourceKey: "bzst-idnr-faq", passageKey: "bzst-faq-never", riskLevel: "medium" },
  { key: "idnr-send-only-to-meldeanschrift-or-vollmacht", category: "identification", temporal: "current_2026", type: "procedure", text: "Der Versand der IdNr an eine Anschrift, die nicht der Meldeanschrift entspricht, ist nur mit schriftlicher Vollmacht und einer Kopie des Personaldokuments möglich.", sourceKey: "bzst-idnr", passageKey: "bzst-idnr-find", riskLevel: "medium" },
  { key: "idnr-finanzamt-can-determine", category: "identification", temporal: "current_2026", type: "procedure", text: "Die Einkommensteuererklärung kann auch ohne IdNr beim Finanzamt eingereicht werden; die IdNr ist dem Finanzamt bekannt oder kann ermittelt werden.", sourceKey: "bzst-idnr", passageKey: "bzst-idnr-find", riskLevel: "low" },
  { key: "idnr-not-steuernummer", category: "identifier_distinction", temporal: "current_2026", type: "exception", text: "Die persönliche IdNr nach § 139b AO ist nicht dieselbe Nummer wie die Steuernummer. Die Steuernummer bleibt nach dem BZSt auf den Vordrucken der Landesfinanzbehörden zu verwenden und ist wie bisher in Steuererklärungen anzugeben.", sourceKey: "bzst-widnr", passageKey: "bzst-widnr-distinction", riskLevel: "medium" },
  { key: "idnr-not-widnr", category: "identifier_distinction", temporal: "current_2026", type: "exception", text: "Die persönliche IdNr ist nicht die Wirtschafts-Identifikationsnummer. Die W-IdNr wird nur bei wirtschaftlicher Tätigkeit vergeben, die IdNr jeder natürlichen Person.", sourceKey: "bzst-widnr", passageKey: "bzst-widnr-distinction", riskLevel: "medium" },
  { key: "steuernummer-not-lifelong-personal-id", category: "identifier_distinction", temporal: "current_2026", type: "exception", text: "Die Steuernummer ist kein universelles lebenslanges Personenkennzeichen. Sie bleibt als Ordnungsmerkmal der Landesfinanzbehörden bestehen und ist nicht durch die persönliche IdNr zu ersetzen.", sourceKey: "bzst-widnr", passageKey: "bzst-widnr-distinction", riskLevel: "medium" },
  { key: "widnr-only-for-wirtschaftlich-taetige", category: "identifier_distinction", temporal: "current_2026", type: "definition", text: "Die W-IdNr nach § 139c AO beginnt mit DE und wird wirtschaftlich Tätigen zugeteilt. Sie ist kein stilles Ersatzmerkmal für die persönliche IdNr.", sourceKey: "ao-139c", passageKey: "ao-139c-1", riskLevel: "low" },
  { key: "aktenzeichen-not-automatically-idnr", category: "identifier_distinction", temporal: "current_2026", type: "exception", text: "Ein Aktenzeichen auf einem Finanzamtschreiben ist nicht automatisch die IdNr. Im ELSTER-Einspruch ist das Aktenzeichen nur für bestimmte Grundsteuerfälle vorgesehen.", sourceKey: "elster-einspruch-help", passageKey: "elster-einspruch-aktenzeichen", riskLevel: "medium" },
  { key: "aktenzeichen-not-automatically-steuernummer", category: "identifier_distinction", temporal: "current_2026", type: "exception", text: "Ein Aktenzeichen ist nicht automatisch die Steuernummer. Das ELSTER-Einspruchsformular trennt das Aktenzeichen als grundsteuerbezogenen Bezug vom übrigen Steuerfall.", sourceKey: "elster-einspruch-help", passageKey: "elster-einspruch-aktenzeichen", riskLevel: "medium" },
  { key: "verwaltungsakt-definition", category: "document_semantics", temporal: "current_2026", type: "definition", text: "Ein Verwaltungsakt ist eine hoheitliche Regelung eines Einzelfalls mit unmittelbarer Außenwirkung. Die bloße Bezeichnung eines Schreibens als Brief, Erinnerung oder Information macht es nicht automatisch zum Verwaltungsakt.", sourceKey: "ao-118", passageKey: "ao-118-1", riskLevel: "medium" },
  { key: "steuerbescheid-is-festsetzungs-va", category: "document_semantics", temporal: "current_2026", type: "definition", text: "Ein Steuerbescheid ist der nach § 122 Absatz 1 bekannt gegebene Verwaltungsakt, mit dem die Finanzbehörde die Steuer festsetzt, freistellt oder einen Antrag auf Steuerfestsetzung ablehnt.", sourceKey: "ao-155", passageKey: "ao-155-1", riskLevel: "low" },
  { key: "steuerbescheid-must-name-steuer-and-schuldner", category: "steuerbescheid", temporal: "current_2026", type: "definition", text: "Ein Steuerbescheid muss die festgesetzte Steuer nach Art und Betrag bezeichnen und angeben, wer die Steuer schuldet.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "low" },
  { key: "steuerbescheid-needs-rechtsbehelfsbelehrung", category: "steuerbescheid", temporal: "current_2026", type: "duty", text: "Dem Steuerbescheid ist eine Belehrung beizufügen, welcher Rechtsbehelf zulässig ist und binnen welcher Frist und bei welcher Behörde er einzulegen ist.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "medium" },
  { key: "begruendung-when-required", category: "steuerbescheid", temporal: "current_2026", type: "procedure", text: "Ein schriftlicher oder elektronischer Verwaltungsakt ist mit einer Begründung zu versehen, soweit dies zu seinem Verständnis erforderlich ist. Die im Bescheid enthaltene Begründung ist vor einer Bewertung des Ergebnisses zu prüfen.", sourceKey: "ao-121", passageKey: "ao-121-1", riskLevel: "medium" },
  { key: "document-label-not-legal-effect", category: "document_semantics", temporal: "current_2026", type: "exception", text: "Die auf einem Schreiben gedruckte Bezeichnung ersetzt nicht die Prüfung, ob ein Verwaltungsakt, eine bloße Aufforderung, eine Erinnerung oder eine Information vorliegt. Die Rechtswirkung ergibt sich aus Inhalt, Bekanntgabe und gesetzlicher Grundlage.", sourceKey: "ao-118", passageKey: "ao-118-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "finanzamt-letter-not-automatically-payment", category: "document_semantics", temporal: "current_2026", type: "exception", text: "Nicht jedes Schreiben des Finanzamts begründet eine Zahlungspflicht. Eine Zahlungspflicht setzt die festgesetzte oder sonst fällig werdende Steuer und die maßgebliche Fälligkeitsregel oder das Leistungsgebot voraus.", sourceKey: "ao-220", passageKey: "ao-220-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "aenderungsbescheid-is-still-steuerbescheid", category: "document_semantics", temporal: "current_2026", type: "definition", text: "Ein Änderungsbescheid ist ebenfalls ein Steuerbescheid, also ein bekannt gegebener Verwaltungsakt über die Steuerfestsetzung. Steuerart, Zeitraum, Ergebnis, Begründung und Rechtsbehelfsbelehrung des konkreten Änderungsbescheids sind zu prüfen.", sourceKey: "ao-155", passageKey: "ao-155-1", riskLevel: "medium" },
  { key: "inspect-steuerart-and-period", category: "steuerbescheid", temporal: "current_2026", type: "procedure", text: "Am Steuerbescheid sind zuerst Steuerart und Besteuerungszeitraum sowie der festgesetzte Betrag und die steuerpflichtige Person zu identifizieren. Diese Angaben müssen aus dem konkreten Bescheid kommen.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "distinguish-refund-from-payment", category: "steuerbescheid", temporal: "current_2026", type: "procedure", text: "Bei der Einkommensteuer ist nach der Abrechnung zu unterscheiden, ob ein Überschuss zugunsten oder zuungunsten der steuerpflichtigen Person entsteht. Erstattung und Abschlusszahlung sind nicht dasselbe.", sourceKey: "estg-36", passageKey: "estg-36-4", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "est-abschlusszahlung-not-universal-deadline", category: "payment", temporal: "current_2026", type: "exception", text: "Die Einmonatsfrist der einkommensteuerlichen Abschlusszahlung nach § 36 Absatz 4 EStG gilt nur für diesen Abrechnungssachverhalt. Sie ist keine universelle Zahlungsfrist für jeden Steuerbescheid oder jedes Finanzamtschreiben.", sourceKey: "estg-36", passageKey: "estg-36-4", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "inspect-faelligkeit-from-bescheid", category: "payment", temporal: "current_2026", type: "procedure", text: "Ob und wann ein Betrag zu zahlen ist, ergibt sich aus dem anwendbaren Steuergesetz, der Bekanntgabe der Festsetzung und einem etwaigen Leistungsgebot. Betrag, Verwendungszweck und Kontoangaben müssen aus dem konkreten Schreiben stammen.", sourceKey: "ao-220", passageKey: "ao-220-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "statutory-filing-vs-individual-request", category: "aufforderung", temporal: "current_2026", type: "definition", text: "Wer eine Steuererklärung abgeben muss, bestimmen zunächst die Steuergesetze. Daneben ist auch verpflichtet, wer von der Finanzbehörde zur Abgabe aufgefordert wird. Beides ist nicht dasselbe.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "medium" },
  { key: "finanzamt-can-require-filing", category: "aufforderung", temporal: "current_2026", type: "duty", text: "Die Finanzbehörde kann zur Abgabe einer Steuererklärung auffordern. Aus einem Finanzamtschreiben allein folgt nicht, dass zuvor schon eine gesetzliche Erklärungspflicht bestand.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "filing-deadline-from-notice-and-law", category: "aufforderung", temporal: "current_2026", type: "deadline", text: "Die konkrete Frist zur Abgabe der Steuererklärung ergibt sich aus dem geltenden Recht und aus der im Schreiben gesetzten Frist. Eine individuelle Kalenderfrist darf ohne diese Angaben nicht berechnet werden.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "identify-steuerart-period-on-request", category: "aufforderung", temporal: "current_2026", type: "procedure", text: "In einer Aufforderung zur Abgabe einer Steuererklärung sind Steuerart und Zeitraum des konkreten Schreibens festzustellen, bevor der nächste Schritt bestimmt wird.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "non-filing-may-lead-to-estimate-and-zuschlag", category: "aufforderung", temporal: "current_2026", type: "procedure", text: "Unterbleibt die Abgabe, kann die Finanzbehörde die Besteuerungsgrundlagen schätzen und unter den gesetzlichen Voraussetzungen einen Verspätungszuschlag festsetzen. Das Ignorieren der Aufforderung ist kein sicherer Weg.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "high" },
  { key: "schaetzung-does-not-end-filing-duty", category: "aufforderung", temporal: "current_2026", type: "exception", text: "Die Verpflichtung zur Abgabe einer Steuererklärung bleibt auch dann bestehen, wenn die Finanzbehörde die Besteuerungsgrundlagen nach § 162 geschätzt hat.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "high" },
  { key: "auskunftspflicht-exists", category: "evidence", temporal: "current_2026", type: "duty", text: "Beteiligte haben der Finanzbehörde die zur Feststellung eines steuererheblichen Sachverhalts erforderlichen Auskünfte zu erteilen. Das Auskunftsersuchen muss angeben, worüber Auskunft verlangt wird.", sourceKey: "ao-93", passageKey: "ao-93-1-2", riskLevel: "medium" },
  { key: "identify-requested-items-and-period", category: "evidence", temporal: "current_2026", type: "procedure", text: "Bei einer Anforderung von Unterlagen oder Auskünften sind der genaue Inhalt, der Steuerzeitraum und das Akten- oder Steuerzeichen des konkreten Schreibens festzustellen.", sourceKey: "ao-93", passageKey: "ao-93-1-2", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "evidence-deadline-from-letter", category: "evidence", temporal: "current_2026", type: "deadline", text: "Die Frist zur Vorlage angeforderter Unterlagen steht in dem konkreten Schreiben. Eine allgemeine gesetzliche Einreichungsfrist für beliebige Belege darf daraus nicht abgeleitet werden.", sourceKey: "ao-108", passageKey: "ao-108-2-3", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "elster-belegnachreichung-route", category: "evidence", temporal: "current_2026", type: "procedure", text: "Fordert das Finanzamt Belege zur Steuererklärung an, können sie nach der aktuellen ELSTER-Hilfe digital über das Formular Belegnachreichung übermittelt werden. Bei Papierübersendung sollen nur Kopien und keine Originale eingereicht werden.", sourceKey: "elster-belege-help", passageKey: "elster-belege-vorhalt", riskLevel: "low" },
  { key: "belege-generally-only-on-request", category: "evidence", temporal: "current_2026", type: "procedure", text: "Zur Einkommensteuererklärung brauchen grundsätzlich keine Belege mitgesandt zu werden; sie sind aufzubewahren und auf ausdrücklichen Hinweis oder auf Anforderung des Finanzamts einzureichen.", sourceKey: "elster-belege-help", passageKey: "elster-belege-vorhalt", riskLevel: "low" },
  { key: "further-review-may-follow", category: "evidence", temporal: "current_2026", type: "procedure", text: "Die Übermittlung angeforderter Auskünfte oder Belege kann zu einer weiteren Prüfung oder zu einer erneuten Anforderung führen. Sie ist weder automatisch eine Steuerfestsetzung noch deren Abschluss.", sourceKey: "ao-93", passageKey: "ao-93-1-2", riskLevel: "medium" },
  { key: "evidence-request-not-assessment", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Anforderung von Auskünften oder Unterlagen ist nicht automatisch ein Steuerbescheid.", sourceKey: "ao-155", passageKey: "ao-155-1", riskLevel: "medium" },
  { key: "evidence-request-not-penalty", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Anforderung von Auskünften oder Unterlagen ist nicht automatisch ein Verspätungszuschlag, Säumniszuschlag oder eine andere Sanktion.", sourceKey: "ao-93", passageKey: "ao-93-1-2", riskLevel: "medium" },
  { key: "evidence-request-not-rejection", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Anforderung von Auskünften oder Unterlagen ist keine Ablehnung und kein Vorwurf einer Steuerstraftat.", sourceKey: "ao-93", passageKey: "ao-93-1-2", riskLevel: "medium" },
  { key: "erinnerung-is-not-automatically-bescheid", category: "document_semantics", temporal: "current_2026", type: "exception", text: "Eine Erinnerung oder Mahnung des Finanzamts ist nicht automatisch ein Steuerbescheid. Zuerst ist der Inhalt des konkreten Schreibens darauf zu prüfen, ob ein Verwaltungsakt vorliegt, welche Handlung verlangt wird und ob eine Frist genannt ist. Die Vollstreckung selbst liegt außerhalb dieses Packs.", sourceKey: "ao-118", passageKey: "ao-118-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "schaetzung-when-bases-unknown", category: "schaetzung", temporal: "current_2026", type: "definition", text: "Soweit die Finanzbehörde die Besteuerungsgrundlagen nicht ermitteln oder berechnen kann, hat sie sie zu schätzen.", sourceKey: "ao-162", passageKey: "ao-162-1", riskLevel: "medium" },
  { key: "schaetzung-not-correct-declaration", category: "schaetzung", temporal: "current_2026", type: "exception", text: "Eine Schätzung der Besteuerungsgrundlagen ist nicht dasselbe wie die Abgabe einer zutreffenden Steuererklärung durch die steuerpflichtige Person.", sourceKey: "ao-162", passageKey: "ao-162-1", riskLevel: "medium" },
  { key: "inspect-actual-schaetzungsbescheid", category: "schaetzung", temporal: "current_2026", type: "procedure", text: "Ein auf Schätzung beruhender Steuerbescheid ist als konkreter Verwaltungsakt zu prüfen: Steuerart, Zeitraum, geschätzte Grundlagen, festgesetzter Betrag, Begründung und Rechtsbehelfsbelehrung.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "ignore-schaetzung-is-not-strategy", category: "schaetzung", temporal: "current_2026", type: "exception", text: "Das Ignorieren eines Schätzungsbescheids ist keine Strategie. Der Bescheid bleibt ein bekannt gegebener Verwaltungsakt, und die Erklärungspflicht kann fortbestehen.", sourceKey: "ao-149", passageKey: "ao-149-1", riskLevel: "high" },
  { key: "verspaetung-is-late-filing", category: "filing_delay", temporal: "current_2026", type: "definition", text: "Der Verspätungszuschlag betrifft die nicht oder nicht fristgemäß abgegebene Steuererklärung. Er ist kein Zuschlag für verspätete Zahlung.", sourceKey: "ao-152", passageKey: "ao-152-1-3", riskLevel: "medium" },
  { key: "verspaetung-not-saeumnis", category: "filing_delay", temporal: "current_2026", type: "exception", text: "Verspätungszuschlag nach § 152 AO und Säumniszuschlag nach § 240 AO sind verschiedene Rechtsfolgen. Späte Abgabe ist nicht dasselbe wie späte Zahlung.", sourceKey: "ao-152", passageKey: "ao-152-1-3", riskLevel: "medium" },
  { key: "verspaetung-has-conditions-and-exceptions", category: "filing_delay", temporal: "current_2026", type: "procedure", text: "Ob ein Verspätungszuschlag festgesetzt werden kann oder festzusetzen ist, richtet sich nach den gesetzlichen Voraussetzungen und Ausnahmen. Die individuelle Höhe ergibt sich aus dem konkreten Bescheid und darf nicht als universeller Betrag angegeben werden.", sourceKey: "ao-152", passageKey: "ao-152-1-3", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "late-payment-not-late-filing", category: "payment", temporal: "current_2026", type: "exception", text: "Die verspätete Zahlung einer festgesetzten Steuer ist von der verspäteten Abgabe der Steuererklärung zu trennen. Für die Zahlung gelten Fälligkeit und Säumniszuschlag, nicht der Verspätungszuschlag.", sourceKey: "ao-240", passageKey: "ao-240-1-3", riskLevel: "medium" },
  { key: "saeumnis-one-percent-mechanics", category: "payment", temporal: "current_2026", type: "definition", text: "Wird eine festgesetzte oder angemeldete Steuer nicht bis zum Ablauf des Fälligkeitstages entrichtet, entsteht für jeden angefangenen Monat der Säumnis ein Säumniszuschlag von 1 Prozent des auf den nächsten durch 50 Euro teilbaren Betrag abgerundeten Rückstands.", sourceKey: "ao-240", passageKey: "ao-240-1-3", riskLevel: "medium" },
  { key: "saeumnis-not-before-festsetzung", category: "payment", temporal: "current_2026", type: "exception", text: "Die Säumnis tritt nicht ein, bevor die Steuer festgesetzt oder angemeldet worden ist. Bei einer Säumnis bis zu drei Tagen wird ein Säumniszuschlag grundsätzlich nicht erhoben.", sourceKey: "ao-240", passageKey: "ao-240-1-3", riskLevel: "medium" },
  { key: "payment-details-from-actual-correspondence", category: "payment", temporal: "current_2026", type: "exception", text: "Zahlbetrag, Steuernummer, Kassenzeichen und Kontoverbindung müssen aus dem konkreten Bescheid oder Zahlungsschreiben entnommen werden. Eine erfundene Standardüberweisung darf nicht gespeichert werden.", sourceKey: "ao-220", passageKey: "ao-220-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "einspruch-statthaft-against-va", category: "einspruch", temporal: "current_2026", type: "definition", text: "Gegen Verwaltungsakte in Abgabenangelegenheiten, auf die die Abgabenordnung Anwendung findet, ist der Einspruch statthaft. Ob das konkrete Schreiben ein solcher Verwaltungsakt ist, muss am Dokument geprüft werden.", sourceKey: "ao-347", passageKey: "ao-347-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "einspruch-one-month-after-bekanntgabe", category: "einspruch", temporal: "current_2026", type: "deadline", text: "Der Einspruch gegen einen Verwaltungsakt ist innerhalb eines Monats nach Bekanntgabe einzulegen. Die Frist beginnt nicht automatisch mit dem auf dem Schreiben gedruckten Datum.", sourceKey: "ao-355", passageKey: "ao-355-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "missing-belehrung-one-year", category: "einspruch", temporal: "current_2026", type: "deadline", text: "Fehlt die Rechtsbehelfsbelehrung oder ist sie unrichtig, ist der Einspruch binnen eines Jahres seit Bekanntgabe zulässig, sofern nicht schriftlich oder elektronisch belehrt wurde, dass ein Einspruch nicht gegeben sei.", sourceKey: "ao-356", passageKey: "ao-356-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "einspruch-written-electronic-or-niederschrift", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Der Einspruch ist schriftlich oder elektronisch einzureichen oder zur Niederschrift zu erklären. Es genügt, wenn hervorgeht, wer ihn eingelegt hat. Eine unrichtige Bezeichnung schadet nicht.", sourceKey: "ao-357", passageKey: "ao-357-all", riskLevel: "medium" },
  { key: "einspruch-at-issuing-authority", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Der Einspruch ist bei der Behörde anzubringen, deren Verwaltungsakt angefochten wird. Die Einlegung bei einer anderen Behörde ist unschädlich, wenn der Einspruch vor Fristablauf einer zuständigen Behörde zugeht.", sourceKey: "ao-357", passageKey: "ao-357-all", riskLevel: "high", requiredContextKeys: ["BUNDESLAND"] },
  { key: "elster-einspruch-route", category: "einspruch", temporal: "current_2026", type: "procedure", text: "In Mein ELSTER steht derzeit das Formular Einspruch einreichen einschließlich Aussetzung der Vollziehung zur Verfügung. Die Verfügbarkeit dieses Dienstes ist eine betriebliche Portalangabe und kein zeitloses Gesetz.", sourceKey: "elster-forms", passageKey: "elster-forms-einspruch", riskLevel: "low" },
  { key: "elster-einspruch-supplement", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Ein bereits eingelegter Einspruch kann nach der aktuellen ELSTER-Formularliste ergänzt, erweitert oder eingeschränkt werden. Das ersetzt nicht die fristgerechte Einlegung selbst.", sourceKey: "elster-forms", passageKey: "elster-forms-einspruch", riskLevel: "low" },
  { key: "elster-einspruch-withdraw", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Ein Einspruch kann nach der aktuellen ELSTER-Formularliste zurückgenommen werden. Die Rücknahme ist ein eigener betrieblicher Schritt und keine automatische Folge der Einlegung.", sourceKey: "elster-forms", passageKey: "elster-forms-einspruch", riskLevel: "low" },
  { key: "einspruch-does-not-stay-payment", category: "einspruch", temporal: "current_2026", type: "exception", text: "Durch die Einlegung des Einspruchs wird die Vollziehung des angefochtenen Verwaltungsakts grundsätzlich nicht gehemmt, insbesondere die Erhebung einer Abgabe nicht aufgehalten.", sourceKey: "ao-361", passageKey: "ao-361-1-2", riskLevel: "high" },
  { key: "adv-is-separate", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Eine Aussetzung der Vollziehung ist ein eigener Antrag. Sie soll erfolgen, wenn ernstliche Zweifel an der Rechtmäßigkeit bestehen oder die Vollziehung eine unbillige Härte wäre. Einspruch und Aussetzung der Vollziehung sind nicht dasselbe.", sourceKey: "ao-361", passageKey: "ao-361-1-2", riskLevel: "high" },
  { key: "do-not-auto-recommend-einspruch", category: "einspruch", temporal: "current_2026", type: "exception", text: "Aus der bloßen Existenz eines Steuerbescheids oder eines Einspruchswegs folgt keine Empfehlung, Einspruch einzulegen. Zuerst sind der konkrete Bescheid, die Bekanntgabe und die Rechtsbehelfsbelehrung zu prüfen.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "document-date-not-bekanntgabe", category: "bekanntgabe", temporal: "current_2026", type: "exception", text: "Das auf einem Schreiben gedruckte Datum ist nicht ohne weiteres der Tag der Bekanntgabe und nicht der automatische Beginn der Rechtsbehelfsfrist.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high" },
  { key: "inland-four-days-after-post", category: "bekanntgabe", temporal: "current_2026", type: "deadline", text: "Ein schriftlicher Verwaltungsakt, der im Inland durch die Post übermittelt wird, gilt am vierten Tag nach der Aufgabe zur Post als bekannt gegeben, außer wenn er nicht oder später zugegangen ist.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "abroad-one-month-after-post", category: "bekanntgabe", temporal: "current_2026", type: "deadline", text: "Bei einer Übermittlung im Ausland gilt ein schriftlicher Verwaltungsakt einen Monat nach der Aufgabe zur Post als bekannt gegeben, außer wenn er nicht oder später zugegangen ist. Das ist eine Zustellungsregel und keine Feststellung der steuerlichen Ansässigkeit.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "RESIDENCE_STATE"] },
  { key: "non-receipt-exception", category: "bekanntgabe", temporal: "current_2026", type: "exception", text: "Die gesetzliche Bekanntgabefiktion gilt nicht, wenn der Verwaltungsakt nicht oder erst später zugegangen ist. Im Zweifel hat die Behörde den Zugang und dessen Zeitpunkt nachzuweisen.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "electronic-four-days-after-send", category: "bekanntgabe", temporal: "current_2026", type: "deadline", text: "Ein elektronisch übermittelter Verwaltungsakt gilt am vierten Tag nach der Absendung als bekannt gegeben, außer wenn er nicht oder später zugegangen ist.", sourceKey: "ao-122", passageKey: "ao-122-2a", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "datenabruf-four-days-after-bereitstellung", category: "bekanntgabe", temporal: "current_2026", type: "deadline", text: "Ein zum Datenabruf bereitgestellter Verwaltungsakt gilt am vierten Tag nach der Bereitstellung als bekannt gegeben. Die abrufberechtigte Person ist am Tag der Bereitstellung über die Abrufmöglichkeit zu benachrichtigen.", sourceKey: "ao-122a", passageKey: "ao-122a-4", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "weekend-holiday-extends-frist", category: "bekanntgabe", temporal: "current_2026", type: "deadline", text: "Fällt das Ende einer Frist auf einen Sonntag, gesetzlichen Feiertag oder Sonnabend, endet die Frist mit Ablauf des nächsten Werktags. Welche Feiertage gelten, darf ohne das maßgebliche Feiertagsrecht nicht kalendarisch ausgerechnet werden.", sourceKey: "ao-108", passageKey: "ao-108-2-3", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "individualized-deadline-needs-facts", category: "bekanntgabe", temporal: "current_2026", type: "exception", text: "Ein individueller letzter Tag für Einspruch, Zahlung oder Vorlage darf nicht berechnet werden, solange Bekanntgabeart, Aufgabe- oder Bereitstellungsdatum, Zugang, Rechtsbehelfsbelehrung und eine etwaige ausdrücklich gesetzte Frist fehlen.", sourceKey: "ao-355", passageKey: "ao-355-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "finanzamt-are-land-local-authorities", category: "competence", temporal: "current_2026", type: "definition", text: "Die Finanzämter sind örtliche Landesfinanzbehörden im Sinne der Abgabenordnung. Es gibt kein bundesweit einheitliches Finanzamt als einzige zuständige Stelle.", sourceKey: "ao-6", passageKey: "ao-6-2", riskLevel: "medium" },
  { key: "wohnsitzfinanzamt-default-for-income", category: "competence", temporal: "current_2026", type: "procedure", text: "Für die Besteuerung natürlicher Personen nach dem Einkommen ist im Grundsatz das Wohnsitzfinanzamt örtlich zuständig. Andere Steuerarten, mehrfacher Wohnsitz oder gesetzliche Sonderzuweisungen können ein anderes Finanzamt zuständig machen.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "medium", requiredContextKeys: ["BUNDESLAND"] },
  { key: "competence-not-from-locale-or-language", category: "competence", temporal: "current_2026", type: "exception", text: "Weder die deutsche Sprache eines Schreibens noch die userLocale noch das bloße Wort Finanzamt bestimmen das zuständige Finanzamt.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
  { key: "document-may-identify-office", category: "competence", temporal: "current_2026", type: "procedure", text: "Das konkrete Schreiben kann das zuständige Finanzamt, die Steuernummer und weitere Bezugszeichen nennen. Diese Angaben sind heranzuziehen, ersetzen aber nicht die gesetzliche Zuständigkeitsprüfung, wenn sie fehlen oder widersprüchlich sind.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT", "BUNDESLAND"] },
  { key: "insufficient-facts-no-office", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne Wohnsitz- oder Aufenthaltstatsachen, Steuerart, konkreten Bescheid oder sonstige gesetzliche Zuweisung darf kein bestimmtes Finanzamt als zuständige Stelle benannt werden.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
  { key: "steuernummer-helps-case-not-idnr", category: "competence", temporal: "current_2026", type: "procedure", text: "Die Steuernummer kann den beim Finanzamt geführten Fall kennzeichnen. Sie darf weder mit der persönlichen IdNr verwechselt noch als lebenslanges Personenmerkmal behandelt werden.", sourceKey: "bzst-widnr", passageKey: "bzst-widnr-distinction", riskLevel: "medium" },
  { key: "elster-sonstige-nachricht-route", category: "communication", temporal: "current_2026", type: "procedure", text: "Für formlose Mitteilungen an das Finanzamt steht in Mein ELSTER derzeit die Sonstige Nachricht zur Verfügung. Sie soll nicht verwendet werden, wenn ein passendes Fachformular besteht.", sourceKey: "elster-sonstige-nachricht", passageKey: "elster-sonstige", riskLevel: "low" },
  { key: "elster-services-are-operational", category: "communication", temporal: "current_2026", type: "exception", text: "ELSTER-Formulare für Einspruch, Belegnachreichung, sonstige Nachrichten und Bankverbindungsänderungen sind betriebliche Dienste der Finanzverwaltung. Ihre aktuelle Verfügbarkeit ist vor der Nutzung zu prüfen und nicht als zeitloses Gesetz zu speichern.", sourceKey: "elster-forms", passageKey: "elster-forms-einspruch", riskLevel: "low" },
  { key: "foreign-address-bekanntgabe-abroad-rule", category: "cross_border", temporal: "current_2026", type: "procedure", text: "Eine ausländische Empfangsanschrift kann die Bekanntgabefiktion auf einen Monat nach Aufgabe zur Post verlängern. Das ist eine Verfahrensregel der Zustellung und begründet keine steuerliche Ansässigkeit.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "EVENT_DATE"] },
  { key: "foreign-address-not-tax-residence", category: "cross_border", temporal: "current_2026", type: "exception", text: "Eine ausländische Anschrift, ein Wohnsitz in einem V4-Staat oder ein deutsches Finanzamtschreiben an das Ausland bestimmt nicht die steuerliche Ansässigkeit und nicht das Ergebnis eines Doppelbesteuerungsabkommens.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "unsupported-personalized-tax-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Individuelle Steuerlast, Steuerresidenz, DBA-Ergebnis, Betriebsstätte oder die Zuordnung ausländischer Einkünfte dürfen aus diesem Pack nicht abschließend beantwortet werden.", sourceKey: "ao-155", passageKey: "ao-155-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "PROCESS_VARIANT"] },
  { key: "amount-disagreement-inspect-bescheid", category: "problem_path", temporal: "current_2026", type: "procedure", text: "Erscheint der festgesetzte Betrag falsch, sind zuerst Steuerart, Zeitraum, Abrechnung, Begründung und Rechtsbehelfsbelehrung des konkreten Bescheids festzustellen. Eine individuelle Steuergestaltung folgt daraus nicht.", sourceKey: "ao-157", passageKey: "ao-157-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "late-discovery-still-needs-bekanntgabe", category: "problem_path", temporal: "current_2026", type: "procedure", text: "Wird ein möglicher Fehler erst später bemerkt oder der ursprüngliche Bescheid nicht erhalten, sind Bekanntgabe, Zugang und Rechtsbehelfsbelehrung zu klären. Ohne diese Tatsachen darf keine individuelle Rechtsbehelfsfrist genannt werden.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
]);

export type SteuerIdProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

export type SteuerIdFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

export type SteuerIdBindingSpec = Readonly<{
  processKey: string;
  claimKeys: readonly string[];
  role: SteuerIdProcessRole;
  sequenceContext: string;
  required?: boolean;
  qualificationRequired?: boolean;
}>;

export type SteuerIdProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: SteuerIdScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const STEUER_ID_PROCESSES: readonly SteuerIdProcessSpec[] = Object.freeze([
  { key: "idnr-orientation", title: "Steuerliche Identifikationsnummer verstehen und wiederbeschaffen 2026", trigger: "Die persönliche IdNr ist unbekannt, verloren, noch nicht zugegangen oder soll von einer anderen Nummer unterschieden werden", safeFirstStep: "Die IdNr in Einkommensteuerbescheid oder Lohnsteuerbescheinigung suchen; sonst die erneute Mitteilung nur über das BZSt beantragen, nicht telefonisch oder per E-Mail.", riskLevel: "medium" },
  { key: "steuerbescheid-orientation", title: "Steuerbescheid und Änderungsbescheid sicher lesen 2026", trigger: "Ein Steuerbescheid, Änderungsbescheid oder ein ähnlich bezeichnetes Finanzamtschreiben liegt vor", safeFirstStep: "Steuerart, Zeitraum, Ergebnis, Begründung und Rechtsbehelfsbelehrung des konkreten Bescheids feststellen; daraus keine automatische Zahlungs- oder Einspruchsempfehlung ableiten.", riskLevel: "high" },
  { key: "tax-return-request-response", title: "Aufforderung zur Abgabe einer Steuererklärung 2026", trigger: "Das Finanzamt fordert die Abgabe einer Steuererklärung oder erinnert daran", safeFirstStep: "Steuerart, Zeitraum und die im Schreiben genannte Frist feststellen; gesetzliche Erklärungspflicht und individuelle Aufforderung auseinanderhalten.", riskLevel: "high" },
  { key: "evidence-request-response", title: "Auskunfts- oder Beleganforderung des Finanzamts 2026", trigger: "Das Finanzamt verlangt Angaben, Nachweise oder Belege", safeFirstStep: "Den angeforderten Inhalt, den Steuerzeitraum und die im Schreiben genannte Frist feststellen und die Unterlagen auf dem aktuellen amtlichen Weg übermitteln.", riskLevel: "medium" },
  { key: "estimated-assessment-orientation", title: "Schätzungsbescheid einordnen 2026", trigger: "Die Steuer wurde nach geschätzten Besteuerungsgrundlagen festgesetzt", safeFirstStep: "Den konkreten Bescheid als Verwaltungsakt prüfen und die fortbestehende Erklärungspflicht nicht als erledigt behandeln.", riskLevel: "high" },
  { key: "filing-delay-orientation", title: "Verspätungszuschlag einordnen 2026", trigger: "Ein Verspätungszuschlag ist festgesetzt oder wird befürchtet, weil eine Erklärung fehlt oder verspätet ist", safeFirstStep: "Den Zuschlag als Folge verspäteter oder unterbliebener Abgabe und nicht als Säumniszuschlag lesen; Höhe und Ausnahmen nur aus dem konkreten Bescheid ableiten.", riskLevel: "high" },
  { key: "payment-delay-orientation", title: "Fälligkeit und Säumniszuschlag einordnen 2026", trigger: "Eine Zahlung, Fälligkeit oder ein Säumniszuschlag ist angesprochen", safeFirstStep: "Zuerst prüfen, ob überhaupt eine festgesetzte Steuer und eine Fälligkeit vorliegen; Zahlungsdaten nur dem konkreten Schreiben entnehmen.", riskLevel: "high" },
  { key: "einspruch-foundation", title: "Einspruch gegen einen Finanzamts-Verwaltungsakt 2026", trigger: "Gegen einen Steuerbescheid oder anderen Verwaltungsakt soll geprüft werden, ob und wie ein Einspruch möglich ist", safeFirstStep: "Prüfen, ob ein Verwaltungsakt vorliegt, Bekanntgabe und Rechtsbehelfsbelehrung feststellen; Einspruch nicht automatisch empfehlen und nicht mit Zahlungsaussetzung gleichsetzen.", riskLevel: "high" },
  { key: "deadline-bekanntgabe-resolution", title: "Bekanntgabe und Fristen ohne erfundene Kalenderfrist 2026", trigger: "Ein letzter Tag für Einspruch, Zahlung oder Vorlage soll bestimmt werden", safeFirstStep: "Dokumentdatum, Aufgabe zur Post, elektronische Absendung, Bereitstellung, Zugang und eine ausdrücklich gesetzte Frist unterscheiden; ohne diese Tatsachen keine individuelle Frist nennen.", riskLevel: "high" },
  { key: "competent-finanzamt-resolution", title: "Zuständiges Finanzamt klären ohne Erfindung einer Behörde 2026", trigger: "Das zuständige Finanzamt soll benannt werden", safeFirstStep: "Zuerst das konkrete Schreiben und die gesetzliche Zuständigkeitsart prüfen; ohne ausreichende Orts- und Falltatsachen kein bestimmtes Finanzamt nennen.", riskLevel: "high" },
  { key: "finanzamt-communication", title: "Mitteilung an das Finanzamt über aktuelle ELSTER-Wege 2026", trigger: "Eine Nachricht, Belege, ein Einspruch oder eine Änderung soll an das Finanzamt übermittelt werden", safeFirstStep: "Das passende aktuelle ELSTER-Formular wählen und die Sonstige Nachricht nicht als Ersatz für ein vorhandenes Fachformular nutzen.", riskLevel: "medium" },
]);

export const STEUER_ID_FORMS: readonly SteuerIdFormSpec[] = Object.freeze([
  { key: "elster-einspruch", name: "Einspruch einreichen inkl. Aussetzung der Vollziehung", identifier: "ELSTER-Einspruch", purpose: "Elektronische Einlegung eines Einspruchs; die Aussetzung der Vollziehung ist ein gesondert anzugebendes Begehren", submissionChannels: ["electronic_official_interface"], sourceKey: "elster-forms", passageKey: "elster-forms-einspruch" },
  { key: "elster-einspruch-ergaenzen", name: "Einspruch ergänzen, erweitern oder einschränken", identifier: "ELSTER-Einspruch-ergaenzen", purpose: "Nachträgliche Ergänzung eines bereits eingelegten Einspruchs", submissionChannels: ["electronic_official_interface"], sourceKey: "elster-forms", passageKey: "elster-forms-einspruch" },
  { key: "elster-einspruch-zuruecknehmen", name: "Einspruch zurücknehmen", identifier: "ELSTER-Einspruch-zuruecknehmen", purpose: "Rücknahme eines bereits eingelegten Einspruchs", submissionChannels: ["electronic_official_interface"], sourceKey: "elster-forms", passageKey: "elster-forms-einspruch" },
  { key: "elster-belegnachreichung", name: "Belegnachreichung zur Steuererklärung", identifier: "ELSTER-Belegnachreichung", purpose: "Elektronische Übermittlung von Belegen als PDF oder E-Rechnung an das Finanzamt", submissionChannels: ["electronic_official_interface"], sourceKey: "elster-belegnachreichung", passageKey: "elster-beleg-form" },
  { key: "elster-sonstige-nachricht", name: "Sonstige Nachricht an das Finanzamt", identifier: "ELSTER-Sonstige-Nachricht", purpose: "Formlose Mitteilung, nur wenn kein passendes Fachformular besteht", submissionChannels: ["electronic_official_interface"], sourceKey: "elster-sonstige-nachricht", passageKey: "elster-sonstige" },
  { key: "bzst-idnr-mitteilung", name: "Erneute Mitteilung der Identifikationsnummer", identifier: "BZSt-IdNr-Mitteilung", purpose: "Amtliche erneute Mitteilung der persönlichen IdNr durch das BZSt per Brief", submissionChannels: ["official_web_form", "signed_paper_post"], sourceKey: "bzst-idnr-faq", passageKey: "bzst-faq-lost" },
]);

export const STEUER_ID_PROCESS_BINDINGS: readonly SteuerIdBindingSpec[] = Object.freeze([
  { processKey: "idnr-orientation", role: "orientation_basis", sequenceContext: "idnr_what", claimKeys: ["idnr-is-personal-identifikationsmerkmal", "idnr-eleven-digits-no-personal-data", "idnr-unique-one-per-person", "idnr-lifelong-unchanged-life-events", "idnr-automatic-via-meldebehoerde"] },
  { processKey: "idnr-orientation", role: "identification", sequenceContext: "idnr_find", claimKeys: ["idnr-found-on-bescheid-or-lohnsteuer", "idnr-lost-request-via-bzst", "idnr-never-received-three-months", "idnr-send-only-to-meldeanschrift-or-vollmacht", "idnr-finanzamt-can-determine"] },
  { processKey: "idnr-orientation", role: "negative_control", sequenceContext: "idnr_not", claimKeys: ["idnr-not-by-phone-or-email", "idnr-not-steuernummer", "idnr-not-widnr", "aktenzeichen-not-automatically-idnr"] },
  { processKey: "idnr-orientation", role: "context_gate", sequenceContext: "identifier_distinction", claimKeys: ["idnr-not-steuernummer", "idnr-not-widnr", "steuernummer-not-lifelong-personal-id", "widnr-only-for-wirtschaftlich-taetige", "aktenzeichen-not-automatically-steuernummer"] },
  { processKey: "steuerbescheid-orientation", role: "orientation_basis", sequenceContext: "bescheid_what", claimKeys: ["verwaltungsakt-definition", "steuerbescheid-is-festsetzungs-va", "steuerbescheid-must-name-steuer-and-schuldner", "aenderungsbescheid-is-still-steuerbescheid", "document-label-not-legal-effect"] },
  { processKey: "steuerbescheid-orientation", role: "required_information", sequenceContext: "bescheid_inspect", claimKeys: ["inspect-steuerart-and-period", "distinguish-refund-from-payment", "begruendung-when-required", "steuerbescheid-needs-rechtsbehelfsbelehrung"] },
  { processKey: "steuerbescheid-orientation", role: "negative_control", sequenceContext: "bescheid_not", claimKeys: ["finanzamt-letter-not-automatically-payment", "est-abschlusszahlung-not-universal-deadline", "do-not-auto-recommend-einspruch"] },
  { processKey: "steuerbescheid-orientation", role: "decision", sequenceContext: "bescheid_problem", claimKeys: ["amount-disagreement-inspect-bescheid", "late-discovery-still-needs-bekanntgabe"] },
  { processKey: "tax-return-request-response", role: "orientation_basis", sequenceContext: "aufforderung", claimKeys: ["statutory-filing-vs-individual-request", "finanzamt-can-require-filing", "identify-steuerart-period-on-request"] },
  { processKey: "tax-return-request-response", role: "deadline_gate", sequenceContext: "aufforderung_frist", qualificationRequired: true, claimKeys: ["filing-deadline-from-notice-and-law"] },
  { processKey: "tax-return-request-response", role: "next_state", sequenceContext: "aufforderung_next", claimKeys: ["non-filing-may-lead-to-estimate-and-zuschlag", "schaetzung-does-not-end-filing-duty"] },
  { processKey: "tax-return-request-response", role: "negative_control", sequenceContext: "erinnerung", claimKeys: ["erinnerung-is-not-automatically-bescheid", "document-label-not-legal-effect"] },
  { processKey: "evidence-request-response", role: "evidence_requirement", sequenceContext: "evidence", claimKeys: ["auskunftspflicht-exists", "identify-requested-items-and-period", "belege-generally-only-on-request", "elster-belegnachreichung-route", "further-review-may-follow"] },
  { processKey: "evidence-request-response", role: "deadline_gate", sequenceContext: "evidence_deadline", qualificationRequired: true, claimKeys: ["evidence-deadline-from-letter"] },
  { processKey: "evidence-request-response", role: "negative_control", sequenceContext: "evidence_not", claimKeys: ["evidence-request-not-assessment", "evidence-request-not-penalty", "evidence-request-not-rejection"] },
  { processKey: "estimated-assessment-orientation", role: "orientation_basis", sequenceContext: "schaetzung", claimKeys: ["schaetzung-when-bases-unknown", "schaetzung-not-correct-declaration", "inspect-actual-schaetzungsbescheid", "ignore-schaetzung-is-not-strategy", "schaetzung-does-not-end-filing-duty"] },
  { processKey: "filing-delay-orientation", role: "orientation_basis", sequenceContext: "verspaetung", claimKeys: ["verspaetung-is-late-filing", "verspaetung-not-saeumnis", "verspaetung-has-conditions-and-exceptions", "late-payment-not-late-filing"] },
  { processKey: "payment-delay-orientation", role: "payment", sequenceContext: "zahlung", claimKeys: ["inspect-faelligkeit-from-bescheid", "saeumnis-one-percent-mechanics", "saeumnis-not-before-festsetzung", "payment-details-from-actual-correspondence"] },
  { processKey: "payment-delay-orientation", role: "negative_control", sequenceContext: "zahlung_not", claimKeys: ["finanzamt-letter-not-automatically-payment", "est-abschlusszahlung-not-universal-deadline", "verspaetung-not-saeumnis", "late-payment-not-late-filing"] },
  { processKey: "einspruch-foundation", role: "legal_remedy_gate", sequenceContext: "einspruch_gate", qualificationRequired: true, claimKeys: ["einspruch-statthaft-against-va", "einspruch-one-month-after-bekanntgabe", "missing-belehrung-one-year", "do-not-auto-recommend-einspruch"] },
  { processKey: "einspruch-foundation", role: "application_route", sequenceContext: "einspruch_submit", claimKeys: ["einspruch-written-electronic-or-niederschrift", "einspruch-at-issuing-authority", "elster-einspruch-route", "elster-einspruch-supplement", "elster-einspruch-withdraw"] },
  { processKey: "einspruch-foundation", role: "negative_control", sequenceContext: "einspruch_not_stay", claimKeys: ["einspruch-does-not-stay-payment", "adv-is-separate"] },
  { processKey: "einspruch-foundation", role: "context_gate", sequenceContext: "cross_border_procedural", required: false, qualificationRequired: true, claimKeys: ["foreign-address-bekanntgabe-abroad-rule", "foreign-address-not-tax-residence", "unsupported-personalized-tax-fail-closed"] },
  { processKey: "deadline-bekanntgabe-resolution", role: "deadline_gate", sequenceContext: "bekanntgabe", qualificationRequired: true, claimKeys: ["document-date-not-bekanntgabe", "inland-four-days-after-post", "abroad-one-month-after-post", "non-receipt-exception", "electronic-four-days-after-send", "datenabruf-four-days-after-bereitstellung", "weekend-holiday-extends-frist", "individualized-deadline-needs-facts"] },
  { processKey: "deadline-bekanntgabe-resolution", role: "context_gate", sequenceContext: "cross_border_delivery", required: false, qualificationRequired: true, claimKeys: ["abroad-one-month-after-post", "foreign-address-bekanntgabe-abroad-rule", "foreign-address-not-tax-residence"] },
  { processKey: "competent-finanzamt-resolution", role: "orientation_basis", sequenceContext: "competence", claimKeys: ["finanzamt-are-land-local-authorities", "wohnsitzfinanzamt-default-for-income", "document-may-identify-office", "steuernummer-helps-case-not-idnr"] },
  { processKey: "competent-finanzamt-resolution", role: "negative_control", sequenceContext: "competence_fail_closed", qualificationRequired: true, claimKeys: ["competence-not-from-locale-or-language", "insufficient-facts-no-office"] },
  { processKey: "finanzamt-communication", role: "application_route", sequenceContext: "elster", claimKeys: ["elster-einspruch-route", "elster-belegnachreichung-route", "elster-sonstige-nachricht-route", "elster-services-are-operational"] },
  { processKey: "finanzamt-communication", role: "form_semantics", sequenceContext: "elster_forms", claimKeys: ["elster-einspruch-supplement", "elster-einspruch-withdraw"] },
]);

export const STEUER_ID_PROCESS_SCENARIOS: readonly SteuerIdProcessScenario[] = Object.freeze([
  { id: "understand-idnr", label: "IdNr verstehen", coverage: "COVERED", requiredClaimKeys: ["idnr-is-personal-identifikationsmerkmal", "idnr-eleven-digits-no-personal-data"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "lost-idnr", label: "IdNr verloren", coverage: "COVERED", requiredClaimKeys: ["idnr-lost-request-via-bzst", "idnr-not-by-phone-or-email"], requiredProcessKeys: ["idnr-orientation"], requiredFormIdentifiers: ["BZSt-IdNr-Mitteilung"] },
  { id: "idnr-never-received", label: "IdNr nie erhalten", coverage: "COVERED", requiredClaimKeys: ["idnr-never-received-three-months", "idnr-automatic-via-meldebehoerde"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "idnr-vs-steuernummer", label: "IdNr ist nicht die Steuernummer", coverage: "COVERED", requiredClaimKeys: ["idnr-not-steuernummer", "steuernummer-not-lifelong-personal-id"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "idnr-vs-widnr", label: "IdNr ist nicht die W-IdNr", coverage: "COVERED", requiredClaimKeys: ["idnr-not-widnr", "widnr-only-for-wirtschaftlich-taetige"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "steuerbescheid-recognition", label: "Steuerbescheid erkennen", coverage: "COVERED", requiredClaimKeys: ["steuerbescheid-is-festsetzungs-va", "inspect-steuerart-and-period"], requiredProcessKeys: ["steuerbescheid-orientation"] },
  { id: "refund-result", label: "Erstattungsergebnis", coverage: "COVERED", requiredClaimKeys: ["distinguish-refund-from-payment"], requiredProcessKeys: ["steuerbescheid-orientation"] },
  { id: "payment-result", label: "Nachzahlungsergebnis", coverage: "COVERED", requiredClaimKeys: ["distinguish-refund-from-payment", "inspect-faelligkeit-from-bescheid"], requiredProcessKeys: ["steuerbescheid-orientation", "payment-delay-orientation"] },
  { id: "aenderungsbescheid", label: "Änderungsbescheid", coverage: "COVERED", requiredClaimKeys: ["aenderungsbescheid-is-still-steuerbescheid", "amount-disagreement-inspect-bescheid"], requiredProcessKeys: ["steuerbescheid-orientation"] },
  { id: "aufforderung-to-file", label: "Aufforderung zur Abgabe", coverage: "COVERED", requiredClaimKeys: ["finanzamt-can-require-filing", "statutory-filing-vs-individual-request"], requiredProcessKeys: ["tax-return-request-response"] },
  { id: "specific-filing-deadline-in-notice", label: "Konkrete Abgabefrist im Schreiben", coverage: "COVERED", requiredClaimKeys: ["filing-deadline-from-notice-and-law"], requiredProcessKeys: ["tax-return-request-response"] },
  { id: "evidence-document-request", label: "Anforderung von Unterlagen", coverage: "COVERED", requiredClaimKeys: ["identify-requested-items-and-period", "evidence-request-not-assessment"], requiredProcessKeys: ["evidence-request-response"] },
  { id: "evidence-submission", label: "Unterlagen übermitteln", coverage: "COVERED", requiredClaimKeys: ["elster-belegnachreichung-route", "belege-generally-only-on-request"], requiredProcessKeys: ["evidence-request-response"], requiredFormIdentifiers: ["ELSTER-Belegnachreichung"] },
  { id: "finanzamt-reminder", label: "Erinnerung des Finanzamts", coverage: "COVERED", requiredClaimKeys: ["erinnerung-is-not-automatically-bescheid", "document-label-not-legal-effect"], requiredProcessKeys: ["tax-return-request-response"] },
  { id: "schaetzung", label: "Schätzung", coverage: "COVERED", requiredClaimKeys: ["schaetzung-when-bases-unknown", "schaetzung-does-not-end-filing-duty", "ignore-schaetzung-is-not-strategy"], requiredProcessKeys: ["estimated-assessment-orientation"] },
  { id: "verspaetungszuschlag", label: "Verspätungszuschlag", coverage: "COVERED", requiredClaimKeys: ["verspaetung-is-late-filing", "verspaetung-not-saeumnis"], requiredProcessKeys: ["filing-delay-orientation"] },
  { id: "faelligkeit-payment-orientation", label: "Fälligkeit und Zahlung", coverage: "COVERED", requiredClaimKeys: ["inspect-faelligkeit-from-bescheid", "payment-details-from-actual-correspondence"], requiredProcessKeys: ["payment-delay-orientation"] },
  { id: "saeumniszuschlag", label: "Säumniszuschlag", coverage: "COVERED", requiredClaimKeys: ["saeumnis-one-percent-mechanics", "late-payment-not-late-filing"], requiredProcessKeys: ["payment-delay-orientation"] },
  { id: "einspruch-availability-gate", label: "Einspruch nur bei Verwaltungsakt", coverage: "COVERED", requiredClaimKeys: ["einspruch-statthaft-against-va", "do-not-auto-recommend-einspruch"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "one-month-deadline-foundation", label: "Einmonatsfrist nach Bekanntgabe", coverage: "COVERED", requiredClaimKeys: ["einspruch-one-month-after-bekanntgabe"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "missing-incorrect-rechtsbehelfsbelehrung", label: "Fehlende oder unrichtige Rechtsbehelfsbelehrung", coverage: "COVERED", requiredClaimKeys: ["missing-belehrung-one-year"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "einspruch-submission", label: "Einspruch einlegen", coverage: "COVERED", requiredClaimKeys: ["einspruch-written-electronic-or-niederschrift", "elster-einspruch-route"], requiredProcessKeys: ["einspruch-foundation"], requiredFormIdentifiers: ["ELSTER-Einspruch"] },
  { id: "einspruch-supplementation", label: "Einspruch ergänzen", coverage: "COVERED", requiredClaimKeys: ["elster-einspruch-supplement"], requiredProcessKeys: ["einspruch-foundation"], requiredFormIdentifiers: ["ELSTER-Einspruch-ergaenzen"] },
  { id: "einspruch-withdrawal", label: "Einspruch zurücknehmen", coverage: "COVERED", requiredClaimKeys: ["elster-einspruch-withdraw"], requiredProcessKeys: ["einspruch-foundation"], requiredFormIdentifiers: ["ELSTER-Einspruch-zuruecknehmen"] },
  { id: "aussetzung-distinction", label: "Aussetzung der Vollziehung getrennt vom Einspruch", coverage: "COVERED", requiredClaimKeys: ["einspruch-does-not-stay-payment", "adv-is-separate"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "document-date-negative-control", label: "Dokumentdatum ist nicht die Bekanntgabe", coverage: "COVERED", requiredClaimKeys: ["document-date-not-bekanntgabe"], requiredProcessKeys: ["deadline-bekanntgabe-resolution"] },
  { id: "actual-bekanntgabe-context", label: "Tatsächliche Bekanntgabe klären", coverage: "COVERED", requiredClaimKeys: ["inland-four-days-after-post", "individualized-deadline-needs-facts"], requiredProcessKeys: ["deadline-bekanntgabe-resolution"] },
  { id: "competent-finanzamt-resolution", label: "Zuständiges Finanzamt konzeptionell", coverage: "COVERED", requiredClaimKeys: ["finanzamt-are-land-local-authorities", "wohnsitzfinanzamt-default-for-income"], requiredProcessKeys: ["competent-finanzamt-resolution"] },
  { id: "insufficient-authority-context", label: "Ohne Tatsachen kein konkretes Finanzamt", coverage: "COVERED", requiredClaimKeys: ["insufficient-facts-no-office", "competence-not-from-locale-or-language"], requiredProcessKeys: ["competent-finanzamt-resolution"] },
  { id: "cross-border-procedural-trigger", label: "Auslandsanschrift als Zustellungsregel", coverage: "COVERED", requiredClaimKeys: ["abroad-one-month-after-post", "foreign-address-bekanntgabe-abroad-rule"], requiredProcessKeys: ["deadline-bekanntgabe-resolution"] },
  { id: "cross-border-tax-residence-boundary", label: "Auslandsanschrift ist keine Steuerresidenz", coverage: "COVERED", requiredClaimKeys: ["foreign-address-not-tax-residence"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "unsupported-personalized-tax-conclusion", label: "Individuelle Steuerfolge fail-closed", coverage: "COVERED", requiredClaimKeys: ["unsupported-personalized-tax-fail-closed"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "idnr-not-by-phone", label: "IdNr nicht telefonisch", coverage: "COVERED", requiredClaimKeys: ["idnr-not-by-phone-or-email"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "move-or-marriage-no-new-idnr", label: "Umzug oder Heirat ändert die IdNr nicht", coverage: "COVERED", requiredClaimKeys: ["idnr-lifelong-unchanged-life-events"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "aktenzeichen-distinction", label: "Aktenzeichen ist nicht automatisch IdNr oder Steuernummer", coverage: "COVERED", requiredClaimKeys: ["aktenzeichen-not-automatically-idnr", "aktenzeichen-not-automatically-steuernummer"], requiredProcessKeys: ["idnr-orientation"] },
  { id: "letter-not-payment-obligation", label: "Finanzamtschreiben ist keine Zahlungspflicht", coverage: "COVERED", requiredClaimKeys: ["finanzamt-letter-not-automatically-payment"], requiredProcessKeys: ["steuerbescheid-orientation"] },
  { id: "evidence-not-penalty", label: "Beleganforderung ist keine Sanktion", coverage: "COVERED", requiredClaimKeys: ["evidence-request-not-penalty", "evidence-request-not-rejection"], requiredProcessKeys: ["evidence-request-response"] },
  { id: "schaetzung-filing-duty-remains", label: "Schätzung beendet die Erklärungspflicht nicht", coverage: "COVERED", requiredClaimKeys: ["schaetzung-does-not-end-filing-duty"], requiredProcessKeys: ["estimated-assessment-orientation"] },
  { id: "late-filing-vs-late-payment", label: "Späte Abgabe ist nicht späte Zahlung", coverage: "COVERED", requiredClaimKeys: ["late-payment-not-late-filing", "verspaetung-not-saeumnis"], requiredProcessKeys: ["filing-delay-orientation"] },
  { id: "no-auto-einspruch-recommendation", label: "Kein automatischer Einspruch", coverage: "COVERED", requiredClaimKeys: ["do-not-auto-recommend-einspruch"], requiredProcessKeys: ["einspruch-foundation"] },
  { id: "no-universal-payment-deadline", label: "Keine universelle Zahlungsfrist", coverage: "COVERED", requiredClaimKeys: ["est-abschlusszahlung-not-universal-deadline"], requiredProcessKeys: ["payment-delay-orientation"] },
  { id: "german-language-not-competent-office", label: "Deutsche Sprache bestimmt kein Finanzamt", coverage: "COVERED", requiredClaimKeys: ["competence-not-from-locale-or-language"], requiredProcessKeys: ["competent-finanzamt-resolution"] },
  { id: "weekend-holiday-extension-needs-context", label: "Wochenend- und Feiertagsverlängerung ohne Kalendererfindung", coverage: "COVERED", requiredClaimKeys: ["weekend-holiday-extends-frist", "individualized-deadline-needs-facts"], requiredProcessKeys: ["deadline-bekanntgabe-resolution"] },
  { id: "full-est-calculation", label: "Vollständige Einkommensteuerberechnung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Eigene Steuerberechnungs-Packs, nicht der Grundkern der Finanzamtbriefe." },
  { id: "tax-return-preparation", label: "Erstellung der Steuererklärung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Steuererklärungsvorbereitung in diesem Pack." },
  { id: "tax-residency-determination", label: "Steuerliche Ansässigkeit", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Eigener grenzüberschreitender Steuerpack." },
  { id: "dba-foreign-income", label: "DBA und ausländische Einkünfte", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Doppelbesteuerung und Einkünftezuordnung gehören nicht in diesen Kern." },
  { id: "self-employed-encyclopedia", label: "Selbständigensteuer als Enzyklopädie", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Umsatzsteuer, Gewerbesteuer, EÜR und Fragebogen zur steuerlichen Erfassung sind spätere Packs." },
  { id: "tax-criminal-and-audit", label: "Steuerstrafverfahren und Außenprüfung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Eigene Hochrisiko-Packs." },
  { id: "vollstreckung-deep", label: "Vollstreckung und tiefe Mahnung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Grundunterscheidung Erinnerung/Mahnung versus Bescheid; keine Vollstreckungsnavigation." },
  { id: "full-widnr-implementation", label: "Vollständige W-IdNr-Umsetzung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Abgrenzung zur persönlichen IdNr; kein Betriebsrollout." },
  { id: "tax-advisor-substitution", label: "Ersatz der steuerberatenden Person", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "BIRELLO ersetzt keine Steuerberatung." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "ao-122", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "ao-355", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "ao-19", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND"] as const, riskClass: "HIGH" },
  { sourceKey: "elster-forms", informationClass: "ONLINE_SERVICE_URL" as const, handlingMode: "CACHE_AND_REVALIDATE" as const, freshnessClass: "MONTHLY" as const, staleBehavior: "REVALIDATE_BEFORE_USE" as const, requiredContextKeys: [] as const, riskClass: "MEDIUM" },
]);

export function evaluateSteuerIdProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = STEUER_ID_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = STEUER_ID_PROCESS_SCENARIOS.map((scenario) => {
    if (scenario.coverage === "OUT_OF_SCOPE") {
      return Object.freeze({
        ...scenario,
        derived: "OUT_OF_SCOPE" as const,
        satisfied: scenario.requiredClaimKeys.length === 0 && scenario.requiredProcessKeys.length === 0,
      });
    }
    if (scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE") {
      return Object.freeze({ ...scenario, derived: "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE" as const, satisfied: false });
    }
    const claimsPresent = scenario.requiredClaimKeys.every((key) => claimByKey.has(key) && units.some((unit) => unit.key === key));
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
  const outOfScopeScenarioCount = rows.filter((row) => row.derived === "OUT_OF_SCOPE").length;
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

export function buildSteuerIdFederalCorePack(): CuratedDomainPack {
  const item = factory(STEUER_ID_PACK_ID);
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
    bzst: item("publishers", "bzst", {
      name: "Bundeszentralamt für Steuern",
      type: "federal_tax_authority",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    elster: item("publishers", "elster-finanzverwaltung", {
      name: "ELSTER der deutschen Steuerverwaltung",
      type: "federal_service_portal",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bzst: item("authorities", "bzst", {
      publisherId: publishers.bzst.id,
      name: "Bundeszentralamt für Steuern",
      type: "federal_tax_authority",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bzst.de/DE/Privatpersonen/SteuerlicheIdentifikationsnummer/steuerlicheidentifikationsnummer.html",
    }),
    finanzbehoerden: item("authorities", "finanzbehoerden-ao", {
      publisherId: publishers.elster.id,
      name: "Finanzbehörden im Sinne der Abgabenordnung",
      type: "land_tax_authorities",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.elster.de/elsterweb/infoseite/privatpersonen",
    }),
  };

  const sources = STEUER_ID_OFFICIAL_SOURCES.map((spec) => {
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
      authorityLevel: "FEDERAL" as const,
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
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
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

  const claims = STEUER_ID_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`STEUER_ID_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`STEUER_ID_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = STEUER_ID_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: STEUER_ID_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "competent-finanzamt-resolution",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = STEUER_ID_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`STEUER_ID_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`STEUER_ID_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
      return item("processClaimLinks", `${binding.processKey}:${claimKey}:${binding.role}`, {
        processId: process.id,
        claimId: claim.id,
        role: binding.role,
        required: binding.required !== false,
        sequenceContext: binding.sequenceContext,
        qualificationRequired: binding.qualificationRequired === true,
      });
    });
  });

  const inspectBescheidRule = item("actorRules", "inspect-bescheid-before-einspruch", {
    actorState: "inspect_bescheid_before_einspruch",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-finanzamt-undetermined", {
    actorState: "competent_finanzamt_undetermined_without_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individualized-deadline-undetermined", {
    actorState: "individualized_deadline_undetermined_without_bekanntgabe_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const crossBorderRule = item("actorRules", "cross-border-tax-undetermined", {
    actorState: "cross_border_tax_outcome_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const requestRule = item("actorRules", "answer-finanzamt-request", {
    actorState: "user_must_answer_finanzamt_request",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = STEUER_ID_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`STEUER_ID_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: STEUER_ID_PACK_ID,
    domain: STEUER_ID_DOMAIN,
    canonicalLanguage: STEUER_ID_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bzst, publishers.elster],
    authorities: [authorities.bzst, authorities.finanzbehoerden],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectBescheidRule, competenceRule, deadlineRule, crossBorderRule, requestRule],
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

export function steuerIdPackSummary(pack: CuratedDomainPack = buildSteuerIdFederalCorePack()) {
  const categories = Object.fromEntries(
    STEUER_ID_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<SteuerIdUnitCategory, number>()),
  );
  const completeness = evaluateSteuerIdProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: STEUER_ID_UNITS.length,
    futureWatchCount: STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: STEUER_ID_G3_PROCESS_STEP_LIMITATION,
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
