/**
 * KNOWLEDGE-EXPANSION-03 — German federal health-insurance orientation
 * process-complete pack.
 * Official-source G3 CuratedDomainPack for domain
 * health_insurance_orientation.
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

export const HEALTH_INSURANCE_DOMAIN = "health_insurance_orientation" as const;
export const HEALTH_INSURANCE_PACK_ID = HEALTH_INSURANCE_DOMAIN;
export const HEALTH_INSURANCE_CANONICAL_LANGUAGE = "de" as const;

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

export type HealthInsuranceUnitCategory =
  | "status_orientation"
  | "krankenkasse_wahl"
  | "membership_egk"
  | "contribution"
  | "family_insurance"
  | "employer_change"
  | "kassenwechsel"
  | "continuity"
  | "unemployment"
  | "voluntary"
  | "krankengeld"
  | "evidence"
  | "bescheid"
  | "widerspruch"
  | "arrears"
  | "documents"
  | "self_employed"
  | "cross_border"
  | "competence"
  | "address";

export type HealthInsuranceContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "RESIDENCE_STATE"
  | "WORK_STATE"
  | "COUNTRY";
export type HealthInsuranceHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type HealthInsuranceFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type HealthInsuranceStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type HealthInsuranceInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL";
export type HealthInsuranceProcessRole =
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
export type HealthInsuranceScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const HEALTH_INSURANCE_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type HealthInsuranceTemporalClass = "current_2026";

export type HealthInsuranceFutureChangeWatchItem = Readonly<{
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
  publisherKey: "bmj" | "bmg" | "gesund" | "ba" | "gkvsv" | "dvka";
  authorityKey: "krankenkassen" | "gkvsv" | "ba" | "jobcenter" | "dvka" | "bmg";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "OFFICIAL_FORM" | "OFFICIAL_ONLINE_SERVICE" | "OFFICIAL_DATASET";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: HealthInsuranceInformationClass;
  handlingMode: HealthInsuranceHandlingMode;
  freshnessClass: HealthInsuranceFreshnessClass;
  staleBehavior: HealthInsuranceStaleBehavior;
  requiredContextKeys: readonly HealthInsuranceContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: HealthInsuranceUnitCategory;
  temporal: HealthInsuranceTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly HealthInsuranceContextKey[];
}>;

export const HEALTH_INSURANCE_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "sgb5-5",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__5.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 5 Versicherungspflicht",
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
        key: "sgb5-5-1",
        locator: "SGB V § 5 Abs. 1 Nr. 1, 2, 2a, 13 und Abs. 5",
        text: "Versicherungspflichtig sind unter anderem gegen Arbeitsentgelt Beschäftigte sowie Personen, die Arbeitslosengeld nach dem Dritten Buch oder Grundsicherungsgeld nach § 19 Absatz 1 Satz 1 des Zweiten Buches beziehen. Hauptberuflich selbständig Erwerbstätige sind nach Absatz 5 von mehreren Pflichttatbeständen ausgenommen. Eine Beschäftigung allein bestimmt den Versicherungsstatus nicht abschließend.",
      },
    ],
  },
  {
    key: "sgb5-6",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__6.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 6 Versicherungsfreiheit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb5-6-jaeg",
        locator: "SGB V § 6 Abs. 1 Nr. 1, Abs. 4 und 6",
        text: "Arbeiter und Angestellte sind versicherungsfrei, wenn ihr regelmäßiges Jahresarbeitsentgelt die Jahresarbeitsentgeltgrenze übersteigt. Wird die Grenze überschritten, endet die Versicherungspflicht grundsätzlich mit Ablauf des Kalenderjahres. Die Jahresarbeitsentgeltgrenze ändert sich jährlich und wird in der Rechtsverordnung nach § 160 SGB VI festgesetzt. Ein hohes Gehalt begründet für sich allein keine private Krankenversicherung.",
      },
    ],
  },
  {
    key: "sgb5-9",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__9.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 9 Freiwillige Versicherung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb5-9-1",
        locator: "SGB V § 9 Abs. 1 und 2",
        text: "Der gesetzlichen Krankenversicherung können unter gesetzlichen Voraussetzungen Personen beitreten, die aus der Versicherungspflicht ausgeschieden sind oder deren Familienversicherung endet, wenn die Vorversicherungszeit erfüllt ist. Der Beitritt ist der Krankenkasse innerhalb von drei Monaten anzuzeigen. Selbständigkeit allein begründet keine private Krankenversicherung.",
      },
    ],
  },
  {
    key: "sgb5-10",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__10.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 10 Familienversicherung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb5-10-all",
        locator: "SGB V § 10 Abs. 1, 2 und 6",
        text: "Ehegatte, Lebenspartner und Kinder von Mitgliedern sind familienversichert, wenn sie Wohnsitz oder gewöhnlichen Aufenthalt im Inland haben, nicht selbst pflicht- oder freiwillig versichert, nicht versicherungsfrei oder befreit und nicht hauptberuflich selbständig sind und kein regelmäßiges Gesamteinkommen über einem Siebtel der monatlichen Bezugsgröße haben. Kinder unterliegen zusätzlichen Alters- und Ausbildungsgrenzen. Die Ehe oder Kindschaft allein begründet die Familienversicherung nicht. Das Mitglied hat die erforderlichen Angaben und Änderungen der Krankenkasse zu melden.",
      },
    ],
  },
  {
    key: "sgb5-16",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__16.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 16 Ruhen des Anspruchs",
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
        key: "sgb5-16-3a",
        locator: "SGB V § 16 Abs. 3a und 3b",
        text: "Der Leistungsanspruch ruht, wenn Mitglieder mit einem Betrag in Höhe von Beitragsanteilen für zwei Monate im Rückstand sind und trotz Mahnung nicht zahlen. Das Ruhen gilt nicht für Früherkennung sowie für die Behandlung akuter Erkrankungen und Schmerzzustände sowie bei Schwangerschaft und Mutterschaft. Eine wirksame Ratenzahlungsvereinbarung stellt den Leistungsanspruch wieder her, solange die Raten vertragsgemäß entrichtet werden. Das Ruhen tritt nicht ein oder endet bei Hilfebedürftigkeit nach dem Zweiten oder Zwölften Buch. Zwei unbezahlte Monate bedeuten daher nicht automatisch den sofortigen Wegfall jeder Krankenbehandlung.",
      },
    ],
  },
  {
    key: "sgb5-44",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__44.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 44 Krankengeld",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb5-44-all",
        locator: "SGB V § 44 Abs. 1 und 2",
        text: "Versicherte haben Anspruch auf Krankengeld, wenn Krankheit sie arbeitsunfähig macht oder sie auf Kosten der Krankenkasse stationär behandelt werden. Keinen Anspruch haben unter anderem Familienversicherte sowie mehrere in Absatz 2 genannte Pflichtversichertengruppen. Hauptberuflich Selbständige haben Krankengeld nur, wenn sie eine Wahlerklärung abgeben. Nicht jede versicherte Person erhält nach sechs Wochen automatisch Krankengeld.",
      },
    ],
  },
  {
    key: "sgb5-46",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__46.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 46 Entstehen des Anspruchs auf Krankengeld",
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
        key: "sgb5-46-all",
        locator: "SGB V § 46",
        text: "Der Krankengeldanspruch entsteht bei Krankenhaus- oder Reha-Behandlung von deren Beginn an, im Übrigen vom Tag der ärztlichen Feststellung der Arbeitsunfähigkeit. Der Anspruch bleibt bestehen, wenn die weitere Arbeitsunfähigkeit wegen derselben Krankheit spätestens am nächsten Werktag nach dem zuletzt bescheinigten Ende festgestellt wird; Samstage gelten insoweit nicht als Werktage. Für Versicherte mit Wahlerklärung nach § 44 Absatz 2 Satz 1 Nummer 2 entsteht der Anspruch von der siebten Woche der Arbeitsunfähigkeit an.",
      },
    ],
  },
  {
    key: "sgb5-173",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__173.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 173 Allgemeine Wahlrechte",
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
        key: "sgb5-173-all",
        locator: "SGB V § 173 Abs. 1 und 2",
        text: "Versicherungspflichtige und Versicherungsberechtigte sind Mitglied der von ihnen gewählten Krankenkasse. Wählbar sind unter anderem die Ortskrankenkasse des Beschäftigungs- oder Wohnorts, jede Ersatzkasse, geöffnete Betriebs- oder Innungskrankenkassen, die Knappschaft-Bahn-See, die letzte Krankenkasse und die Krankenkasse des Ehegatten oder Lebenspartners. Es gibt keine einzige bundesweite gesetzliche Krankenkasse.",
      },
    ],
  },
  {
    key: "sgb5-175",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__175.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 175 Ausübung des Wahlrechts",
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
        key: "sgb5-175-all",
        locator: "SGB V § 175 Abs. 1, 2, 3 und 4",
        text: "Die Wahl ist gegenüber der gewählten Krankenkasse zu erklären. Diese darf die Mitgliedschaft nicht ablehnen. Versicherungspflichtige haben der zur Meldung verpflichteten Stelle unverzüglich die gewählte Krankenkasse anzugeben; erfolgt das nicht spätestens zwei Wochen nach Eintritt der Versicherungspflicht, wird bei der letzten Krankenkasse oder sonst bei einer wählbaren Krankenkasse angemeldet. Die Bindung beträgt mindestens zwölf Monate, außer bei Ende der Mitgliedschaft kraft Gesetzes. Beim Wechsel ersetzt die Meldung der neuen Krankenkasse die Kündigung. Erhebt oder erhöht die Krankenkasse den Zusatzbeitrag, kann die Kündigung bis zum Ablauf des Monats erklärt werden, für den der höhere Zusatzbeitrag erstmals gilt.",
      },
    ],
  },
  {
    key: "sgb5-186",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__186.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 186 Beginn der Mitgliedschaft Versicherungspflichtiger",
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
        key: "sgb5-186-1-2a",
        locator: "SGB V § 186 Abs. 1 und 2a",
        text: "Die Mitgliedschaft versicherungspflichtig Beschäftigter beginnt mit dem Tag des Eintritts in das Beschäftigungsverhältnis. Die Mitgliedschaft der Bezieher von Grundsicherungsgeld und Arbeitslosengeld beginnt mit dem Tag, von dem an die Leistung bezogen wird. Die Mitgliedschaft hängt nicht vom Besitz der elektronischen Gesundheitskarte ab.",
      },
    ],
  },
  {
    key: "sgb5-188",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__188.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 188 Beginn der freiwilligen Mitgliedschaft",
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
        key: "sgb5-188-4",
        locator: "SGB V § 188 Abs. 4",
        text: "Endet die Versicherungspflicht oder die Familienversicherung, setzt sich die Versicherung als freiwillige Mitgliedschaft fort, es sei denn, das Mitglied erklärt innerhalb von zwei Wochen nach Hinweis der Krankenkasse über die Austrittsmöglichkeiten seinen Austritt. Der Austritt wird nur wirksam, wenn ein anderweitiger Anspruch auf Absicherung im Krankheitsfall nachgewiesen wird. Das gilt nicht, wenn die übrigen Voraussetzungen einer Familienversicherung erfüllt sind. Nicht jede beendete Beschäftigung führt automatisch in die freiwillige Mitgliedschaft.",
      },
    ],
  },
  {
    key: "sgb5-190",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__190.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 190 Ende der Mitgliedschaft Versicherungspflichtiger",
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
        key: "sgb5-190-2-12",
        locator: "SGB V § 190 Abs. 2 und 12",
        text: "Die Mitgliedschaft versicherungspflichtig Beschäftigter endet mit Ablauf des Tages, an dem das Beschäftigungsverhältnis gegen Arbeitsentgelt endet. Die Mitgliedschaft der Bezieher von Grundsicherungsgeld und Arbeitslosengeld endet mit Ablauf des letzten Tages, für den die Leistung bezogen wird. Das Ende der Pflichtmitgliedschaft bedeutet nicht automatisch, dass jeder Krankenversicherungsschutz sofort entfällt.",
      },
    ],
  },
  {
    key: "sgb5-192",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__192.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 192 Fortbestehen der Mitgliedschaft Versicherungspflichtiger",
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
        key: "sgb5-192-1",
        locator: "SGB V § 192 Abs. 1 Nr. 2",
        text: "Die Mitgliedschaft Versicherungspflichtiger bleibt erhalten, solange Anspruch auf Krankengeld oder Mutterschaftsgeld besteht oder eine dieser Leistungen, Elterngeld oder Elternzeit bezogen oder in Anspruch genommen wird.",
      },
    ],
  },
  {
    key: "sgb5-223",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__223.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 223 Beitragspflicht und Beitragsbemessungsgrenze",
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
        key: "sgb5-223-all",
        locator: "SGB V § 223 Abs. 1 bis 4",
        text: "Beiträge sind für jeden Kalendertag der Mitgliedschaft zu zahlen und werden nach den beitragspflichtigen Einnahmen bis zur Beitragsbemessungsgrenze bemessen. Die Bundesregierung setzt die Beitragsbemessungsgrenze in der Rechtsverordnung nach § 160 SGB VI fest. Der Euro-Betrag eines Jahres ist keine zeitlose Rechtsgröße.",
      },
    ],
  },
  {
    key: "sgb5-240",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__240.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 240 Beitragspflichtige Einnahmen freiwilliger Mitglieder",
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
        key: "sgb5-240-1-2",
        locator: "SGB V § 240 Abs. 1 und 2",
        text: "Für freiwillige Mitglieder wird die Beitragsbemessung einheitlich durch den Spitzenverband Bund der Krankenkassen geregelt und hat die gesamte wirtschaftliche Leistungsfähigkeit zu berücksichtigen. Mindestens sind Einnahmen zu berücksichtigen, die bei einem vergleichbaren versicherungspflichtig Beschäftigten der Beitragsbemessung zugrunde lägen. Ohne Nachweise kann die Beitragsbemessungsgrenze zugrunde gelegt werden. Ein individueller Beitragsbetrag darf ohne die tatsächlichen Einnahmen nicht berechnet werden.",
      },
    ],
  },
  {
    key: "sgb5-241",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__241.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 241 Allgemeiner Beitragssatz",
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
        key: "sgb5-241-1",
        locator: "SGB V § 241",
        text: "Der allgemeine Beitragssatz beträgt 14,6 Prozent der beitragspflichtigen Einnahmen der Mitglieder.",
      },
    ],
  },
  {
    key: "sgb5-242",
    publisherKey: "bmj",
    authorityKey: "gkvsv",
    url: "https://www.gesetze-im-internet.de/sgb_5/__242.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 242 Zusatzbeitrag",
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
        key: "sgb5-242-all",
        locator: "SGB V § 242 Abs. 1 und 5",
        text: "Jede Krankenkasse erhebt einen eigenen einkommensabhängigen Zusatzbeitragssatz. Der Spitzenverband Bund der Krankenkassen führt eine laufend aktualisierte Übersicht und veröffentlicht sie im Internet. Der kassenindividuelle Zusatzbeitrag ist nicht für alle Krankenkassen gleich und nicht identisch mit dem durchschnittlichen Zusatzbeitragssatz.",
      },
    ],
  },
  {
    key: "sgb5-249",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_5/__249.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 249 Tragung der Beiträge bei versicherungspflichtiger Beschäftigung",
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
        key: "sgb5-249-1",
        locator: "SGB V § 249 Abs. 1",
        text: "Beschäftigte, die nach § 5 Absatz 1 Nummer 1 oder Nummer 13 versicherungspflichtig sind, und ihre Arbeitgeber tragen die nach dem Arbeitsentgelt zu bemessenden Beiträge jeweils zur Hälfte.",
      },
    ],
  },
  {
    key: "sgb1-60",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_1/__60.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB I § 60 Angabe von Tatsachen",
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
        key: "sgb1-60-1",
        locator: "SGB I § 60 Abs. 1",
        text: "Wer Sozialleistungen beantragt oder erhält, hat alle leistungserheblichen Tatsachen anzugeben, Änderungen unverzüglich mitzuteilen und auf Verlangen Beweisurkunden vorzulegen. Eine Anforderung von Unterlagen ist deshalb weder automatisch eine Ablehnung noch ein Bescheid über den Verlust der Versicherung.",
      },
    ],
  },
  {
    key: "sgb10-31",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_10/__31.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 31 Begriff des Verwaltungsaktes",
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
        key: "sgb10-31-1",
        locator: "SGB X § 31 Satz 1",
        text: "Verwaltungsakt ist jede Verfügung, Entscheidung oder andere hoheitliche Maßnahme, die eine Behörde zur Regelung eines Einzelfalles auf dem Gebiet des öffentlichen Rechts trifft und die auf unmittelbare Rechtswirkung nach außen gerichtet ist. Ein bloßes Schreiben der Krankenkasse ist deshalb nicht automatisch ein Bescheid.",
      },
    ],
  },
  {
    key: "sgb10-35",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_10/__35.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 35 Begründung des Verwaltungsaktes",
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
        key: "sgb10-35-1",
        locator: "SGB X § 35 Abs. 1",
        text: "Ein schriftlicher oder elektronischer Verwaltungsakt ist mit einer Begründung zu versehen. In der Begründung sind die wesentlichen tatsächlichen und rechtlichen Gründe mitzuteilen.",
      },
    ],
  },
  {
    key: "sgb10-36",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_10/__36.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 36 Rechtsbehelfsbelehrung",
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
        key: "sgb10-36-1",
        locator: "SGB X § 36",
        text: "Erlässt die Behörde einen schriftlichen Verwaltungsakt, ist der beschwerte Beteiligte über den Rechtsbehelf, die Stelle, deren Sitz, die Frist und die Form schriftlich zu belehren.",
      },
    ],
  },
  {
    key: "sgb10-37",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgb_10/__37.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 37 Bekanntgabe des Verwaltungsaktes",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb10-37-2",
        locator: "SGB X § 37 Abs. 2",
        text: "Ein schriftlicher Verwaltungsakt, der im Inland durch die Post übermittelt wird, gilt am vierten Tag nach der Aufgabe zur Post als bekannt gegeben. Ein elektronisch übermittelter Verwaltungsakt gilt am vierten Tag nach der Absendung als bekannt gegeben. Das gilt nicht, wenn der Verwaltungsakt nicht oder später zugegangen ist. Das auf dem Schreiben gedruckte Datum ist nicht automatisch der Bekanntgabetag.",
      },
    ],
  },
  {
    key: "sgg-66",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgg/__66.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGG § 66 Rechtsbehelfsbelehrung und Jahresfrist",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgg-66-all",
        locator: "SGG § 66 Abs. 1 und 2",
        text: "Die Frist für einen Rechtsbehelf beginnt nur, wenn über Rechtsbehelf, Stelle, Sitz und Frist schriftlich oder elektronisch belehrt worden ist. Ist die Belehrung unterblieben oder unrichtig, ist die Einlegung nur innerhalb eines Jahres seit Zustellung, Eröffnung oder Verkündung zulässig.",
      },
    ],
  },
  {
    key: "sgg-84",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/sgg/__84.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGG § 84 Widerspruch",
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
        key: "sgg-84-1",
        locator: "SGG § 84 Abs. 1",
        text: "Der Widerspruch ist binnen eines Monats nach Bekanntgabe des Verwaltungsakts schriftlich, in der gesetzlich zugelassenen elektronischen Form oder zur Niederschrift bei der erlassenden Stelle einzureichen. Bei Bekanntgabe im Ausland beträgt die Frist drei Monate. Das Briefdatum allein setzt die Frist nicht in Lauf.",
      },
    ],
  },
  {
    key: "efzg-3",
    publisherKey: "bmj",
    authorityKey: "krankenkassen",
    url: "https://www.gesetze-im-internet.de/entgfg/__3.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EFZG § 3 Anspruch auf Entgeltfortzahlung im Krankheitsfall",
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
        key: "efzg-3-1",
        locator: "EFZG § 3 Abs. 1 und 3",
        text: "Ein Arbeitnehmer hat bei unverschuldeter krankheitsbedingter Arbeitsunfähigkeit Anspruch auf Entgeltfortzahlung durch den Arbeitgeber bis zur Dauer von sechs Wochen. Der Anspruch entsteht nach vierwöchiger ununterbrochener Dauer des Arbeitsverhältnisses. Diese Arbeitgeberfortzahlung ist nicht dasselbe wie Krankengeld der Krankenkasse.",
      },
    ],
  },
  {
    key: "bmg-wahl",
    publisherKey: "bmg",
    authorityKey: "bmg",
    url: "https://www.bundesgesundheitsministerium.de/themen/krankenversicherung/online-ratgeber-krankenversicherung/krankenversicherung/wahl-und-wechsel-der-krankenkasse",
    officialDomain: "www.bundesgesundheitsministerium.de",
    title: "BMG: Wechsel zwischen Krankenkassen",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "bmg-wahl-wechsel",
        locator: "BMG Wahl und Wechsel der Krankenkasse",
        text: "Eine Kündigung bei der bisherigen Krankenkasse ist für den Wechsel innerhalb der GKV seit dem 1. Januar 2021 nicht mehr erforderlich; die neu gewählte Krankenkasse informiert die bisherige. Nur wer die GKV verlassen will, muss kündigen und eine anderweitige Absicherung nachweisen. Keine Krankenkasse darf die Aufnahme wegen Erkrankungen, Alter oder Verdienst verweigern. Der Arbeitgeber ist über jeden Wechsel schnellstmöglich zu informieren. Geöffnete Betriebs- und Innungskrankenkassen bleiben dauerhaft geöffnet.",
      },
    ],
  },
  {
    key: "gesund-egk",
    publisherKey: "gesund",
    authorityKey: "bmg",
    url: "https://gesund.bund.de/die-elektronische-gesundheitskarte",
    officialDomain: "gesund.bund.de",
    title: "gesund.bund.de: Elektronische Gesundheitskarte",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "gesund-egk-what",
        locator: "gesund.bund.de Funktionen der Gesundheitskarte",
        text: "Gesetzlich Krankenversicherte erhalten eine elektronische Gesundheitskarte von ihrer Krankenkasse. Die Karte ist ein Versichertenausweis und Nachweis der Mitgliedschaft, speichert Stammdaten und ermöglicht die Abrechnung. Verlorene oder gestohlene Karten werden rasch gemeldet; ungültige Karten werden erkannt. Adressänderungen erfordern in der Regel keine neue Karte. Die Karte ist höchstens fünf Jahre gültig; danach stellt die Krankenkasse eine neue aus. Der Besitz der Karte ist nicht identisch mit dem Bestehen der Mitgliedschaft.",
      },
    ],
  },
  {
    key: "ba-alg-merkblatt",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/datei/Merkblatt-fuer-Arbeitslose_ba015368.pdf",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Merkblatt 1 für Arbeitslose 2026",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-alg-kv",
        locator: "BA Merkblatt 1 2026 Krankenversicherung und Arbeitsunfähigkeit",
        text: "Während des Bezugs von Arbeitslosengeld besteht in der Regel Krankenversicherungsschutz; die Beiträge für Pflichtversicherte trägt die Agentur für Arbeit. Arbeitsunfähigkeit ist der Agentur unverzüglich mitzuteilen. Bei unverschuldeter Arbeitsunfähigkeit während des rechtmäßigen Bezugs wird Arbeitslosengeld bis zu sechs Wochen weitergezahlt. Dauert die Arbeitsunfähigkeit länger als sechs Wochen, erhalten Pflichtversicherte anschließend in der Regel Krankengeld von der zuständigen Krankenkasse. Nach Krankengeld ist für weiteres Arbeitslosengeld eine erneute Arbeitslosmeldung nötig. Der konkrete Status bleibt vom tatsächlichen Leistungsbescheid abhängig.",
      },
    ],
  },
  {
    key: "ba-grundsicherung-kv",
    publisherKey: "ba",
    authorityKey: "jobcenter",
    url: "https://www.arbeitsagentur.de/grundsicherung/finanziell-absichern/gesundheit-versicherung",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Grundsicherungsgeld Kosten für Gesundheit und Versicherung",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-gsg-kv",
        locator: "BA Grundsicherungsgeld Gesundheit und Versicherung",
        text: "Das Grundsicherungsgeld löst das Bürgergeld ab; die Änderungen gelten ab dem 1. Juli 2026. Wer Grundsicherungsgeld für erwerbsfähige Leistungsberechtigte bekommt, bleibt in der Regel bei der bisherigen gesetzlichen Krankenkasse; das Jobcenter zahlt die Beiträge. Wer zuletzt privat versichert war, bleibt dies in der Regel und erhält einen Zuschuss. Der Versicherungsschutz beginnt mit dem Tag der Antragstellung, wenn der Antrag bewilligt wird. Bürgergeld bleibt nur als Altbezeichnung auf älteren Schreiben verständlich, nicht als aktuelle Leitbezeichnung.",
      },
    ],
  },
  {
    key: "gkv-sv-zusatz",
    publisherKey: "gkvsv",
    authorityKey: "gkvsv",
    url: "https://www.gkv-spitzenverband.de/krankenversicherung/kv_grundprinzipien/finanzierung/zusatzbeitragssatz/zusatzbeitragssatz.jsp",
    officialDomain: "www.gkv-spitzenverband.de",
    title: "GKV-Spitzenverband: Zusatzbeitragssatz",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "gkv-sv-avg",
        locator: "GKV-Spitzenverband Zusatzbeitragssatz",
        text: "Zusätzlich zum allgemeinen Beitragssatz von 14,6 Prozent erheben Krankenkassen einen eigenen Zusatzbeitragssatz. Familienversicherte zahlen keinen Zusatzbeitragssatz. Der durchschnittliche Zusatzbeitragssatz wird vom Bundesministerium für Gesundheit jährlich für das Folgejahr festgesetzt und ist eine statistische Größe, nicht der Satz der einzelnen Krankenkasse. Die konkrete kassenindividuelle Höhe ist laufend zu prüfen.",
      },
    ],
  },
  {
    key: "gkv-sv-kassenliste",
    publisherKey: "gkvsv",
    authorityKey: "gkvsv",
    url: "https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp",
    officialDomain: "www.gkv-spitzenverband.de",
    title: "GKV-Spitzenverband: Krankenkassenliste",
    sourceClass: "OFFICIAL_DATASET",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ONLINE_SERVICE_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "gkv-sv-list",
        locator: "GKV-Spitzenverband Krankenkassenliste",
        text: "Der GKV-Spitzenverband ist verpflichtet, eine laufend aktualisierte Übersicht der Zusatzbeitragssätze im Internet zu veröffentlichen. Die veröffentlichten Sätze sind die tagesaktuell gültigen. Die Liste zeigt auch, in welchen Ländern eine Krankenkasse geöffnet ist. Ein einzelner Satz darf nicht als zeitloser Universalsatz gespeichert werden.",
      },
    ],
  },
  {
    key: "dvka-s1",
    publisherKey: "dvka",
    authorityKey: "dvka",
    url: "https://www.dvka.de/media/dokumente/merkblaetter/merkblatt-fuer-grenzgaenger/grenzgaenger_eu.pdf",
    officialDomain: "www.dvka.de",
    title: "DVKA: Merkblatt für Grenzgängerinnen und Grenzgänger",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"],
    passages: [
      {
        key: "dvka-s1-text",
        locator: "DVKA Merkblatt Grenzgänger PD S1",
        text: "Innerhalb der EU, des EWR oder der Schweiz gilt die Verordnung (EG) 883/2004. Grenzgänger arbeiten in Deutschland, wohnen im EU-Ausland und kehren regelmäßig zurück. Die deutsche Krankenkasse stellt dem Träger im Wohnstaat eine Anspruchsbescheinigung aus oder händigt den Anspruchsnachweis PD S1 aus. Arbeit in Deutschland oder Wohnen im Ausland bestimmt allein nicht den zuständigen Versicherungsstaat. Die EHIC auf der Kartenvorderseite betrifft vorübergehende Aufenthalte und ist nicht dasselbe wie S1.",
      },
    ],
  },
  {
    key: "dvka-a1",
    publisherKey: "dvka",
    authorityKey: "dvka",
    url: "https://www.dvka.de/de/versicherte/faq/fragen-gme/frage-gme-4.html",
    officialDomain: "www.dvka.de",
    title: "DVKA: A1-Bescheinigung bei Erwerbstätigkeit in mehreren Mitgliedstaaten",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"],
    passages: [
      {
        key: "dvka-a1-text",
        locator: "DVKA FAQ A1 mehrere Mitgliedstaaten",
        text: "Bei gewöhnlicher Erwerbstätigkeit in mehreren Mitgliedstaaten stellt die zuständige Stelle des Wohnstaats fest, welches Recht der sozialen Sicherheit gilt, und veranlasst die A1-Bescheinigung. Bei Wohnort in Deutschland ist dafür der GKV-Spitzenverband, DVKA zuständig. Die A1-Bescheinigung weist die anzuwendenden Rechtsvorschriften nach und ist nicht dasselbe Dokument wie die Anspruchsbescheinigung S1.",
      },
    ],
  },
]);

export const HEALTH_INSURANCE_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://gesund.bund.de/gesundheits-id",
  officialDomain: "gesund.bund.de",
  title: "gesund.bund.de: Die Gesundheits-ID als digitale Identität",
});

export const HEALTH_INSURANCE_FUTURE_CHANGE_WATCH_ITEMS: readonly HealthInsuranceFutureChangeWatchItem[] = Object.freeze([
  {
    id: "health-insurance-future-watch:gesundheitsid-praxis-nachweis",
    key: "gesundheitsid-praxis-nachweis-2026",
    officialSourceUrl: HEALTH_INSURANCE_FUTURE_WATCH_SOURCE.url,
    officialDomain: HEALTH_INSURANCE_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: HEALTH_INSURANCE_FUTURE_WATCH_SOURCE.title,
    targetYear: 2026,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "gesund.bund.de beschreibt, dass die Gesundheits-ID ab 2026 als Versicherungsnachweis in Arztpraxen gelten soll. Das ist angekündigte Digitalisierung, nicht die aktuelle Ersetzung der eGK als Mitgliedschaftsnachweis.",
  },
  {
    id: "health-insurance-future-watch:bbg-2027-formula",
    key: "bbg-2027-formula",
    officialSourceUrl: "https://www.gesetze-im-internet.de/sgb_5/__223.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "SGB V § 223 Beitragspflicht und Beitragsbemessungsgrenze",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "§ 223 Abs. 4 SGB V beschreibt die Beitragsbemessungsgrenze für das Jahr 2027. Das ist keine aktuelle 2026-Euroangabe und wird nicht als geltender Zahlenwert ingestiert.",
  },
]);

export const HEALTH_INSURANCE_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "gkv-is-statutory-insurance", category: "status_orientation", temporal: "current_2026", type: "definition", text: "Die gesetzliche Krankenversicherung ist die Pflicht- oder freiwillige Absicherung nach dem Fünften Buch Sozialgesetzbuch bei einer gewählten Krankenkasse.", sourceKey: "sgb5-5", passageKey: "sgb5-5-1", riskLevel: "low" },
  { key: "employment-not-universal-gkv", category: "status_orientation", temporal: "current_2026", type: "exception", text: "Eine Beschäftigung in Deutschland begründet nicht automatisch für jede Person die gesetzliche Krankenversicherung. Maßgeblich sind die gesetzlichen Tatbestände der Versicherungspflicht, Versicherungsfreiheit und etwaiger Befreiung.", sourceKey: "sgb5-5", passageKey: "sgb5-5-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "ordinary-employment-can-trigger-pflicht", category: "status_orientation", temporal: "current_2026", type: "definition", text: "Arbeiter, Angestellte und zu ihrer Berufsausbildung Beschäftigte, die gegen Arbeitsentgelt beschäftigt sind, sind nach § 5 Absatz 1 Nummer 1 SGB V versicherungspflichtig, soweit kein Ausnahmetatbestand eingreift.", sourceKey: "sgb5-5", passageKey: "sgb5-5-1", riskLevel: "medium" },
  { key: "high-salary-not-automatically-pkv", category: "status_orientation", temporal: "current_2026", type: "exception", text: "Ein hohes Gehalt macht nicht automatisch privat krankenversichert. Versicherungsfreiheit wegen Überschreitens der Jahresarbeitsentgeltgrenze entsteht nur unter den Voraussetzungen des § 6 SGB V und endet in der Regel erst mit Ablauf des Kalenderjahres.", sourceKey: "sgb5-6", passageKey: "sgb5-6-jaeg", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "self-employed-not-automatically-pkv", category: "self_employed", temporal: "current_2026", type: "exception", text: "Hauptberufliche Selbständigkeit schließt manchen Pflichtversicherungstatbestand aus, begründet aber nicht automatisch eine private Krankenversicherung. Es kann eine freiwillige gesetzliche Mitgliedschaft oder ein anderer Status bestehen.", sourceKey: "sgb5-9", passageKey: "sgb5-9-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "gkv-not-one-nationwide-kasse", category: "status_orientation", temporal: "current_2026", type: "exception", text: "Die gesetzliche Krankenversicherung ist kein einheitlicher bundesweiter Versicherungsträger. Es gibt mehrere wählbare Krankenkassenarten.", sourceKey: "sgb5-173", passageKey: "sgb5-173-all", riskLevel: "medium" },
  { key: "pkv-gkv-boundary-only", category: "status_orientation", temporal: "current_2026", type: "definition", text: "Gesetzliche und private Krankenversicherung sind verschiedene Absicherungssysteme. Dieses Pack bestimmt nicht, welches System für eine einzelne Person finanziell vorteilhafter ist.", sourceKey: "sgb5-6", passageKey: "sgb5-6-jaeg", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "wahlrecht-for-pflicht-and-freiwillig", category: "krankenkasse_wahl", temporal: "current_2026", type: "definition", text: "Versicherungspflichtige und Versicherungsberechtigte sind Mitglied der von ihnen gewählten Krankenkasse, soweit das Gesetz nichts Abweichendes bestimmt.", sourceKey: "sgb5-173", passageKey: "sgb5-173-all", riskLevel: "low" },
  { key: "eligible-kassenarten", category: "krankenkasse_wahl", temporal: "current_2026", type: "procedure", text: "Wählbar sind insbesondere die Ortskrankenkasse des Beschäftigungs- oder Wohnorts, jede Ersatzkasse, geöffnete Betriebs- oder Innungskrankenkassen, die Knappschaft-Bahn-See, die letzte Krankenkasse und die Krankenkasse des Ehegatten oder Lebenspartners.", sourceKey: "sgb5-173", passageKey: "sgb5-173-all", riskLevel: "medium" },
  { key: "open-status-is-operational", category: "krankenkasse_wahl", temporal: "current_2026", type: "procedure", text: "Ob eine Betriebs- oder Innungskrankenkasse geöffnet ist, ergibt sich aus ihrer Satzung und der aktuellen amtlichen Krankenkassenliste. Bereits geöffnete Kassen bleiben nach dem BMG dauerhaft geöffnet.", sourceKey: "bmg-wahl", passageKey: "bmg-wahl-wechsel", riskLevel: "medium" },
  { key: "kasse-may-not-reject-for-health", category: "krankenkasse_wahl", temporal: "current_2026", type: "duty", text: "Die gewählte Krankenkasse darf die Mitgliedschaft nicht ablehnen. Nach dem BMG darf keine Krankenkasse die Aufnahme wegen Erkrankungen, Alter oder Verdienst verweigern.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium" },
  { key: "do-not-rank-insurers", category: "krankenkasse_wahl", temporal: "current_2026", type: "exception", text: "Zusatzleistungen und Wahltarife dürfen verglichen, aber nicht als gesetzliche Überlegenheit einer bestimmten Krankenkasse gespeichert werden. BIRELLO empfiehlt keine einzelne Krankenkasse.", sourceKey: "bmg-wahl", passageKey: "bmg-wahl-wechsel", riskLevel: "medium" },
  { key: "must-name-kasse-within-two-weeks", category: "krankenkasse_wahl", temporal: "current_2026", type: "duty", text: "Versicherungspflichtige haben der zur Meldung verpflichteten Stelle unverzüglich die gewählte Krankenkasse anzugeben. Spätestens zwei Wochen nach Eintritt der Versicherungspflicht muss die Angabe vorliegen.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "high" },
  { key: "fallback-registration-if-no-choice", category: "krankenkasse_wahl", temporal: "current_2026", type: "procedure", text: "Fehlt die Angabe der Krankenkasse nach zwei Wochen, hat die meldende Stelle bei der zuletzt bestehenden Krankenkasse oder sonst bei einer nach § 173 wählbaren Krankenkasse anzumelden und die Person zu unterrichten. Ein unbefristetes Offenlassen der Wahl ohne Folge gibt es nicht.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "high" },
  { key: "employer-electronic-registration", category: "krankenkasse_wahl", temporal: "current_2026", type: "procedure", text: "Nach Eingang der Anmeldung meldet die Krankenkasse der meldenden Stelle im elektronischen Meldeverfahren das Bestehen oder Nichtbestehen der Mitgliedschaft zurück. Ein internes Personalverfahren des einzelnen Arbeitgebers darf daraus nicht erfunden werden.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium" },
  { key: "membership-starts-with-employment", category: "membership_egk", temporal: "current_2026", type: "definition", text: "Die Mitgliedschaft versicherungspflichtig Beschäftigter beginnt mit dem Tag des Eintritts in das Beschäftigungsverhältnis.", sourceKey: "sgb5-186", passageKey: "sgb5-186-1-2a", riskLevel: "low" },
  { key: "membership-not-same-as-egk", category: "membership_egk", temporal: "current_2026", type: "exception", text: "Das Bestehen der Mitgliedschaft und der Besitz der elektronischen Gesundheitskarte sind nicht dasselbe. Fehlt die Karte, folgt daraus nicht, dass keine Krankenversicherung besteht.", sourceKey: "sgb5-186", passageKey: "sgb5-186-1-2a", riskLevel: "high" },
  { key: "egk-is-versichertenausweis", category: "membership_egk", temporal: "current_2026", type: "definition", text: "Die elektronische Gesundheitskarte ist der Versichertenausweis der gesetzlichen Krankenversicherung. Sie weist die Mitgliedschaft nach, speichert Stammdaten und ermöglicht die Abrechnung.", sourceKey: "gesund-egk", passageKey: "gesund-egk-what", riskLevel: "low" },
  { key: "egk-not-yet-received", category: "membership_egk", temporal: "current_2026", type: "procedure", text: "Ist die elektronische Gesundheitskarte noch nicht zugegangen, bleibt die gesetzliche Mitgliedschaft nach dem Eintritt in die Versicherung bestehen. Für den Nachweis ist die Krankenkasse um eine aktuelle Mitgliedsbescheinigung oder einen sonstigen Versicherungsnachweis zu bitten.", sourceKey: "gesund-egk", passageKey: "gesund-egk-what", riskLevel: "medium" },
  { key: "lost-egk-contact-kasse", category: "membership_egk", temporal: "current_2026", type: "procedure", text: "Verlust oder Diebstahl der elektronischen Gesundheitskarte ist der Krankenkasse zu melden. Die Krankenkasse erkennt ungültige Karten und stellt eine neue Karte aus. Der Verlust beendet die Mitgliedschaft nicht.", sourceKey: "gesund-egk", passageKey: "gesund-egk-what", riskLevel: "medium" },
  { key: "egk-data-change-no-new-identity", category: "membership_egk", temporal: "current_2026", type: "procedure", text: "Adressänderungen führen in der Regel nicht zur Ausgabe einer neuen Karte, weil Stammdaten online abgeglichen werden. Eine neue Karte folgt bei Ablauf der höchstens fünfjährigen Gültigkeit oder bei von der Krankenkasse geforderten Stammdatenänderungen.", sourceKey: "gesund-egk", passageKey: "gesund-egk-what", riskLevel: "low" },
  { key: "egk-digital-functions-orientation-only", category: "membership_egk", temporal: "current_2026", type: "exception", text: "Digitale Funktionen der elektronischen Gesundheitskarte wie E-Rezept oder freiwillige Notfalldaten sind Orientierungshinweise und keine Enzyklopädie der elektronischen Patientenakte. Ihre Verfügbarkeit ist betrieblich und zu revalidieren.", sourceKey: "gesund-egk", passageKey: "gesund-egk-what", riskLevel: "low" },
  { key: "general-contribution-rate-14-6", category: "contribution", temporal: "current_2026", type: "definition", text: "Der allgemeine Beitragssatz der gesetzlichen Krankenversicherung beträgt 14,6 Prozent der beitragspflichtigen Einnahmen.", sourceKey: "sgb5-241", passageKey: "sgb5-241-1", riskLevel: "low" },
  { key: "zusatzbeitrag-is-kasse-specific", category: "contribution", temporal: "current_2026", type: "definition", text: "Zusätzlich zum allgemeinen Beitragssatz erhebt jede Krankenkasse einen eigenen Zusatzbeitragssatz. Dieser Satz ist nicht für alle Krankenkassen gleich.", sourceKey: "sgb5-242", passageKey: "sgb5-242-all", riskLevel: "medium" },
  { key: "average-zusatz-not-individual", category: "contribution", temporal: "current_2026", type: "exception", text: "Der durchschnittliche Zusatzbeitragssatz ist eine jährlich festgesetzte statistische Größe und nicht der Zusatzbeitrag der einzelnen Krankenkasse.", sourceKey: "gkv-sv-zusatz", passageKey: "gkv-sv-avg", riskLevel: "medium" },
  { key: "employee-employer-share-half", category: "contribution", temporal: "current_2026", type: "definition", text: "Bei gewöhnlich versicherungspflichtig Beschäftigten tragen Beschäftigte und Arbeitgeber die nach dem Arbeitsentgelt zu bemessenden Beiträge jeweils zur Hälfte.", sourceKey: "sgb5-249", passageKey: "sgb5-249-1", riskLevel: "low" },
  { key: "bbg-is-annual-not-timeless", category: "contribution", temporal: "current_2026", type: "exception", text: "Beiträge werden nur bis zur Beitragsbemessungsgrenze berücksichtigt. Deren Euro-Betrag setzt die Bundesregierung jährlich in einer Rechtsverordnung fest und ist keine zeitlose Rechtsgröße.", sourceKey: "sgb5-223", passageKey: "sgb5-223-all", riskLevel: "high" },
  { key: "jaeg-is-annual-not-timeless", category: "contribution", temporal: "current_2026", type: "exception", text: "Die Jahresarbeitsentgeltgrenze ändert sich zum 1. Januar eines jeden Jahres und wird in der Sozialversicherungs-Rechengrößenverordnung festgesetzt. Ein Jahreswert von 2026 darf nicht als dauerhafte Grenze gespeichert werden.", sourceKey: "sgb5-6", passageKey: "sgb5-6-jaeg", riskLevel: "high" },
  { key: "individual-contribution-needs-facts", category: "contribution", temporal: "current_2026", type: "exception", text: "Ein individueller Monatsbeitrag darf ohne Status, beitragspflichtige Einnahmen, Krankenkasse und geltenden Zusatzbeitrag nicht berechnet werden.", sourceKey: "sgb5-223", passageKey: "sgb5-223-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "voluntary-contribution-base-differs", category: "contribution", temporal: "current_2026", type: "definition", text: "Für freiwillige Mitglieder richtet sich die Beitragsbemessung nach der gesamten wirtschaftlichen Leistungsfähigkeit und kann weitere Einnahmen einbeziehen. Ohne Nachweise kann die Beitragsbemessungsgrenze zugrunde gelegt werden.", sourceKey: "sgb5-240", passageKey: "sgb5-240-1-2", riskLevel: "high" },
  { key: "family-not-automatic-from-marriage", category: "family_insurance", temporal: "current_2026", type: "exception", text: "Die Ehe oder Lebenspartnerschaft begründet nicht automatisch eine beitragsfreie Familienversicherung. Alle gesetzlichen Voraussetzungen des § 10 SGB V müssen erfüllt sein.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "high" },
  { key: "family-spouse-may-qualify", category: "family_insurance", temporal: "current_2026", type: "definition", text: "Ehegatte oder Lebenspartner eines Mitglieds kann familienversichert sein, wenn Wohnsitz oder gewöhnlicher Aufenthalt im Inland besteht, keine eigene Pflicht- oder freiwillige Versicherung vorliegt, keine Versicherungsfreiheit oder Befreiung greift, keine hauptberufliche Selbständigkeit besteht und die Einkommensgrenze eingehalten wird.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "medium" },
  { key: "family-child-not-automatic", category: "family_insurance", temporal: "current_2026", type: "exception", text: "Ein Kind ist nicht allein wegen der Kindschaft familienversichert. Neben den allgemeinen Voraussetzungen gelten Altersgrenzen, Ausbildungs- oder Nichterwerbstätigkeitsregeln.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "high" },
  { key: "family-income-limit-is-annual-concept", category: "family_insurance", temporal: "current_2026", type: "definition", text: "Das regelmäßige monatliche Gesamteinkommen darf ein Siebtel der monatlichen Bezugsgröße nach § 18 SGB IV nicht überschreiten. Der Euro-Betrag dieser Bezugsgröße ist jahresabhängig und keine zeitlose Zahl.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "high" },
  { key: "family-main-self-employment-excludes", category: "family_insurance", temporal: "current_2026", type: "exception", text: "Wer hauptberuflich selbständig erwerbstätig ist, ist von der Familienversicherung ausgeschlossen.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "high" },
  { key: "family-inland-residence-condition", category: "family_insurance", temporal: "current_2026", type: "definition", text: "Familienversicherte müssen Wohnsitz oder gewöhnlichen Aufenthalt im Inland haben. Ein Wohnsitz im Ausland löst keine automatische deutsche Familienversicherung aus und kann ein EU-Koordinierungsfall sein.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "family-facts-required-before-entitlement", category: "family_insurance", temporal: "current_2026", type: "exception", text: "Ob Familienversicherung besteht, darf ohne Status, Einkommen, Wohnsitz und etwaige eigene Versicherung der Angehörigen nicht abschließend beantwortet werden.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "family-must-be-reported-to-kasse", category: "family_insurance", temporal: "current_2026", type: "duty", text: "Das Mitglied hat die familienversicherten Angehörigen und spätere Änderungen der Krankenkasse zu melden. Der Spitzenverband Bund der Krankenkassen legt dafür einheitliche Meldevordrucke fest.", sourceKey: "sgb5-10", passageKey: "sgb5-10-all", riskLevel: "medium" },
  { key: "employer-change-not-mandatory-kasse-change", category: "employer_change", temporal: "current_2026", type: "exception", text: "Ein Arbeitgeberwechsel bedeutet nicht automatisch, dass eine neue Krankenkasse gewählt werden muss. Die bestehende Krankenkasse kann fortbestehen.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium" },
  { key: "employer-change-may-reopen-wahlrecht", category: "employer_change", temporal: "current_2026", type: "procedure", text: "Eine neue Beschäftigung kann das Wahlrecht neu eröffnen, insbesondere wenn die Mitgliedschaft kraft Gesetzes endet oder innerhalb von zwei Wochen nach Errichtung, Ausdehnung oder betrieblicher Veränderung einer Betriebs- oder Innungskrankenkasse gewählt wird.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "employer-registration-not-kassenwechsel", category: "employer_change", temporal: "current_2026", type: "exception", text: "Die elektronische Anmeldung durch die meldende Stelle ist nicht dasselbe wie ein Krankenkassenwechsel. Die Meldung bestätigt den Versicherungsverlauf, ändert aber nicht von selbst die gewählte Kasse.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium" },
  { key: "ordinary-binding-twelve-months", category: "kassenwechsel", temporal: "current_2026", type: "deadline", text: "Versicherungspflichtige und Versicherungsberechtigte sind an die gewählte Krankenkasse mindestens zwölf Monate gebunden.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium" },
  { key: "binding-not-if-membership-ends-by-law", category: "kassenwechsel", temporal: "current_2026", type: "exception", text: "Die zwölfmonatige Bindung gilt nicht bei Ende der Mitgliedschaft kraft Gesetzes.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium" },
  { key: "change-effective-overnext-month", category: "kassenwechsel", temporal: "current_2026", type: "deadline", text: "Zum oder nach Ablauf der Bindung ist eine Kündigung zum Ablauf des übernächsten Kalendermonats möglich, gerechnet von dem Monat der Kündigungserklärung.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE"] },
  { key: "new-kasse-handles-electronic-switch", category: "kassenwechsel", temporal: "current_2026", type: "procedure", text: "Beim Wechsel innerhalb der gesetzlichen Krankenversicherung ersetzt die Meldung der neuen Krankenkasse die Kündigung. Eine gesonderte Papierkündigung bei der alten Kasse ist dafür nicht erforderlich.", sourceKey: "bmg-wahl", passageKey: "bmg-wahl-wechsel", riskLevel: "low" },
  { key: "zusatz-increase-special-termination", category: "kassenwechsel", temporal: "current_2026", type: "deadline", text: "Erhebt die Krankenkasse erstmals einen Zusatzbeitrag oder erhöht sie ihn, kann die Kündigung bis zum Ablauf des Monats erklärt werden, für den der höhere Zusatzbeitrag erstmals gilt.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "leaving-gkv-needs-other-coverage", category: "kassenwechsel", temporal: "current_2026", type: "duty", text: "Wer keine Mitgliedschaft bei einer Krankenkasse begründen will, muss innerhalb der Kündigungsfrist eine anderweitige Absicherung im Krankheitsfall nachweisen.", sourceKey: "sgb5-175", passageKey: "sgb5-175-all", riskLevel: "high" },
  { key: "tell-employer-about-switch", category: "kassenwechsel", temporal: "current_2026", type: "duty", text: "Über jeden Krankenkassenwechsel ist der Arbeitgeber schnellstmöglich zu informieren.", sourceKey: "bmg-wahl", passageKey: "bmg-wahl-wechsel", riskLevel: "medium" },
  { key: "job-end-not-immediate-uninsured", category: "continuity", temporal: "current_2026", type: "exception", text: "Das Ende eines Beschäftigungsverhältnisses beendet die Pflichtmitgliedschaft mit Ablauf dieses Tages, bedeutet aber nicht, dass jede Krankenversicherung sofort entfällt. Es können Arbeitslosengeld, Grundsicherungsgeld, Familienversicherung, freiwillige Fortsetzung oder ein anderer Schutz folgen.", sourceKey: "sgb5-190", passageKey: "sgb5-190-2-12", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "continuity-needs-status-facts", category: "continuity", temporal: "current_2026", type: "exception", text: "Welcher Versicherungsweg nach dem Ende einer Beschäftigung gilt, darf ohne Leistungsbezug, Familienstatus, Krankenkassenhinweis und anderweitigen Schutz nicht abschließend bestimmt werden.", sourceKey: "sgb5-188", passageKey: "sgb5-188-4", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "alg-generally-pflichtversichert", category: "unemployment", temporal: "current_2026", type: "definition", text: "Personen sind in der Zeit versicherungspflichtig, für die sie Arbeitslosengeld nach dem Dritten Buch beziehen oder es nur wegen Sperrzeit oder Urlaubsabgeltung nicht beziehen.", sourceKey: "sgb5-5", passageKey: "sgb5-5-1", riskLevel: "medium" },
  { key: "alg-ba-pays-contributions", category: "unemployment", temporal: "current_2026", type: "procedure", text: "Während des Bezugs von Arbeitslosengeld trägt die Agentur für Arbeit nach dem aktuellen Merkblatt die Krankenversicherungsbeiträge für Pflichtversicherte.", sourceKey: "ba-alg-merkblatt", passageKey: "ba-alg-kv", riskLevel: "medium" },
  { key: "alg-membership-from-benefit-day", category: "unemployment", temporal: "current_2026", type: "definition", text: "Die Mitgliedschaft der Bezieher von Arbeitslosengeld beginnt mit dem Tag, von dem an die Leistung bezogen wird. Bewilligungszeitpunkt und Leistungsbeginn sind deshalb erheblich.", sourceKey: "sgb5-186", passageKey: "sgb5-186-1-2a", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE"] },
  { key: "alg-sickness-has-separate-path", category: "unemployment", temporal: "current_2026", type: "procedure", text: "Arbeitsunfähigkeit während des Arbeitslosengeldbezugs ist der Agentur für Arbeit unverzüglich mitzuteilen. Pflichtversicherte erhalten nach mehr als sechs Wochen Arbeitsunfähigkeit in der Regel Krankengeld der Krankenkasse; danach ist für weiteres Arbeitslosengeld eine erneute Arbeitslosmeldung nötig.", sourceKey: "ba-alg-merkblatt", passageKey: "ba-alg-kv", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "grundsicherungsgeld-is-current-term", category: "unemployment", temporal: "current_2026", type: "definition", text: "Das Grundsicherungsgeld löst das Bürgergeld ab; die Änderungen gelten ab dem 1. Juli 2026. Bürgergeld bleibt nur als Altbezeichnung älterer Schreiben verständlich.", sourceKey: "ba-grundsicherung-kv", passageKey: "ba-gsg-kv", riskLevel: "medium" },
  { key: "grundsicherung-jobcenter-pays-gkv", category: "unemployment", temporal: "current_2026", type: "procedure", text: "Wer Grundsicherungsgeld für erwerbsfähige Leistungsberechtigte erhält, bleibt in der Regel bei der bisherigen gesetzlichen Krankenkasse; das Jobcenter zahlt die Beiträge. Wer zuletzt privat versichert war, bleibt dies in der Regel und erhält einen Zuschuss.", sourceKey: "ba-grundsicherung-kv", passageKey: "ba-gsg-kv", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "grundsicherung-cover-from-application-if-approved", category: "unemployment", temporal: "current_2026", type: "definition", text: "Nach der Bundesagentur für Arbeit besteht Krankenversicherungsschutz ab dem Tag der Antragstellung auf Grundsicherungsgeld, wenn der Antrag bewilligt wird.", sourceKey: "ba-grundsicherung-kv", passageKey: "ba-gsg-kv", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "automatic-voluntary-continuation", category: "voluntary", temporal: "current_2026", type: "definition", text: "Endet die Versicherungspflicht oder die Familienversicherung, setzt sich die Versicherung als freiwillige Mitgliedschaft fort, sofern kein wirksamer Austritt erklärt wird.", sourceKey: "sgb5-188", passageKey: "sgb5-188-4", riskLevel: "high" },
  { key: "exit-needs-other-coverage-proof", category: "voluntary", temporal: "current_2026", type: "duty", text: "Ein Austritt aus der fortgesetzten freiwilligen Mitgliedschaft wird nur wirksam, wenn das Mitglied einen anderweitigen Anspruch auf Absicherung im Krankheitsfall nachweist.", sourceKey: "sgb5-188", passageKey: "sgb5-188-4", riskLevel: "high" },
  { key: "voluntary-not-automatic-for-everyone", category: "voluntary", temporal: "current_2026", type: "exception", text: "Nicht jede beendete Pflichtversicherung führt in die freiwillige Fortsetzung. Liegen die übrigen Voraussetzungen einer Familienversicherung vor oder fehlt ein ermittelbarer Wohnsitz im Geltungsbereich des Sozialgesetzbuchs, gilt die automatische Fortsetzung nicht.", sourceKey: "sgb5-188", passageKey: "sgb5-188-4", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "krankengeld-not-for-everyone", category: "krankengeld", temporal: "current_2026", type: "exception", text: "Nicht jede versicherte Person hat den regelhaften Krankengeldanspruch. Familienversicherte und mehrere in § 44 Absatz 2 SGB V genannte Gruppen haben ihn nicht; Selbständige nur nach Wahlerklärung.", sourceKey: "sgb5-44", passageKey: "sgb5-44-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "efzg-six-weeks-then-krankengeld", category: "krankengeld", temporal: "current_2026", type: "procedure", text: "Gewöhnliche Arbeitnehmerinnen und Arbeitnehmer erhalten bei unverschuldeter Arbeitsunfähigkeit zuerst bis zu sechs Wochen Entgeltfortzahlung vom Arbeitgeber. Die Entgeltfortzahlung ist nicht dasselbe wie Krankengeld der Krankenkasse und setzt die gesetzliche Anspruchsberechtigung voraus.", sourceKey: "efzg-3", passageKey: "efzg-3-1", riskLevel: "medium" },
  { key: "krankengeld-needs-medical-continuity", category: "krankengeld", temporal: "current_2026", type: "procedure", text: "Der Krankengeldanspruch bleibt bestehen, wenn die weitere Arbeitsunfähigkeit wegen derselben Krankheit spätestens am nächsten Werktag nach dem zuletzt bescheinigten Ende ärztlich festgestellt wird. Samstage gelten insoweit nicht als Werktage.", sourceKey: "sgb5-46", passageKey: "sgb5-46-all", riskLevel: "medium" },
  { key: "membership-continues-during-krankengeld", category: "krankengeld", temporal: "current_2026", type: "definition", text: "Die Mitgliedschaft Versicherungspflichtiger bleibt erhalten, solange Anspruch auf Krankengeld besteht oder Krankengeld bezogen wird.", sourceKey: "sgb5-192", passageKey: "sgb5-192-1", riskLevel: "low" },
  { key: "self-employed-krankengeld-needs-election", category: "krankengeld", temporal: "current_2026", type: "exception", text: "Hauptberuflich Selbständige haben Krankengeld nur, wenn sie gegenüber der Krankenkasse erklären, dass die Mitgliedschaft den Anspruch umfassen soll. Der Anspruch entsteht dann von der siebten Woche der Arbeitsunfähigkeit an.", sourceKey: "sgb5-44", passageKey: "sgb5-44-all", riskLevel: "high" },
  { key: "no-individual-krankengeld-amount", category: "krankengeld", temporal: "current_2026", type: "exception", text: "Die individuelle Höhe des Krankengeldes wird in diesem Pack nicht berechnet. Ob Anspruch besteht, hängt vom Versicherungsstatus und den tatsächlichen Nachweisen ab.", sourceKey: "sgb5-44", passageKey: "sgb5-44-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "evidence-request-is-mitwirkung", category: "evidence", temporal: "current_2026", type: "duty", text: "Wer Leistungen beantragt oder erhält, hat leistungserhebliche Tatsachen anzugeben und auf Verlangen Beweisurkunden vorzulegen. Die Krankenkasse kann deshalb Unterlagen zu Status, Familie, Einkommen oder Anspruch anfordern.", sourceKey: "sgb1-60", passageKey: "sgb1-60-1", riskLevel: "medium" },
  { key: "identify-requested-kk-items", category: "evidence", temporal: "current_2026", type: "procedure", text: "Bei einer Anforderung der Krankenkasse sind der genaue Inhalt, der Zeitraum und das Akten- oder Mitgliedszeichen des konkreten Schreibens festzustellen. Eine universelle Dokumentenliste gibt es nicht.", sourceKey: "sgb1-60", passageKey: "sgb1-60-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "evidence-deadline-from-kk-letter", category: "evidence", temporal: "current_2026", type: "deadline", text: "Die Frist zur Vorlage angeforderter Unterlagen steht in dem konkreten Schreiben der Krankenkasse. Eine allgemeine gesetzliche Einreichungsfrist für beliebige Belege darf daraus nicht abgeleitet werden.", sourceKey: "sgb1-60", passageKey: "sgb1-60-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "evidence-request-not-rejection", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Anforderung von Unterlagen oder Angaben ist nicht automatisch eine Ablehnung, kein Beitragsbescheid und kein Verlust der Krankenversicherung.", sourceKey: "sgb1-60", passageKey: "sgb1-60-1", riskLevel: "medium" },
  { key: "non-response-may-affect-decision", category: "evidence", temporal: "current_2026", type: "procedure", text: "Unterbleiben erforderliche Angaben oder Nachweise, kann die Krankenkasse den Sachverhalt nicht feststellen und eine nachteilige Entscheidung treffen. Das konkrete Schreiben ist deshalb zu prüfen und zu beantworten.", sourceKey: "sgb1-60", passageKey: "sgb1-60-1", riskLevel: "high" },
  { key: "bescheid-is-verwaltungsakt", category: "bescheid", temporal: "current_2026", type: "definition", text: "Ein Bescheid der Krankenkasse ist ein Verwaltungsakt, wenn er einen Einzelfall hoheitlich regelt und unmittelbare Außenwirkung hat. Die Bezeichnung als Brief reicht dafür nicht.", sourceKey: "sgb10-31", passageKey: "sgb10-31-1", riskLevel: "medium" },
  { key: "kk-letter-not-automatically-bescheid", category: "documents", temporal: "current_2026", type: "exception", text: "Ein Schreiben der Krankenkasse ist nicht automatisch ein Verwaltungsakt, keine Forderung und kein Verlust der Versicherung. Zuerst sind Inhalt, Regelungscharakter und Rechtsbehelfsbelehrung zu prüfen.", sourceKey: "sgb10-31", passageKey: "sgb10-31-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "kk-letter-not-automatically-debt", category: "documents", temporal: "current_2026", type: "exception", text: "Nicht jedes Schreiben der Krankenkasse begründet eine Beitragsschuld. Betrag und Fälligkeit müssen aus einem konkreten Beitragsbescheid oder einer anderen Regelung folgen.", sourceKey: "sgb10-31", passageKey: "sgb10-31-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "inspect-kk-bescheid-parts", category: "bescheid", temporal: "current_2026", type: "procedure", text: "Ein Krankenkassenbescheid ist auf Regelung, Begründung, Rechtsbehelfsbelehrung, Bekanntgabe und die im Schreiben genannten Tatsachen zu prüfen.", sourceKey: "sgb10-35", passageKey: "sgb10-35-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "rechtsbehelfsbelehrung-required", category: "bescheid", temporal: "current_2026", type: "duty", text: "Einem schriftlichen Verwaltungsakt ist eine Rechtsbehelfsbelehrung beizufügen, die Rechtsbehelf, Stelle, Sitz, Frist und Form nennt.", sourceKey: "sgb10-36", passageKey: "sgb10-36-1", riskLevel: "medium" },
  { key: "widerspruch-only-against-va", category: "widerspruch", temporal: "current_2026", type: "definition", text: "Der Widerspruch setzt einen Verwaltungsakt voraus. Nicht jedes Schreiben der Krankenkasse eröffnet den Widerspruchsweg.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "widerspruch-one-month-after-bekanntgabe", category: "widerspruch", temporal: "current_2026", type: "deadline", text: "Der Widerspruch ist binnen eines Monats nach Bekanntgabe des Verwaltungsakts einzulegen. Die Frist beginnt nicht automatisch mit dem auf dem Schreiben gedruckten Datum.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "widerspruch-three-months-abroad", category: "widerspruch", temporal: "current_2026", type: "deadline", text: "Bei Bekanntgabe im Ausland beträgt die Widerspruchsfrist drei Monate. Das ist eine Verfahrensregel und keine Feststellung des zuständigen Versicherungsstaats.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "RESIDENCE_STATE"] },
  { key: "missing-belehrung-one-year", category: "widerspruch", temporal: "current_2026", type: "deadline", text: "Fehlt die Rechtsbehelfsbelehrung oder ist sie unrichtig, ist die Einlegung des Rechtsbehelfs nur innerhalb eines Jahres seit Zustellung, Eröffnung oder Verkündung zulässig.", sourceKey: "sgg-66", passageKey: "sgg-66-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "document-date-not-widerspruch-start", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Das auf einem Krankenkassenschreiben gedruckte Datum ist nicht ohne weiteres der Tag der Bekanntgabe und nicht der automatische Beginn der Widerspruchsfrist.", sourceKey: "sgb10-37", passageKey: "sgb10-37-2", riskLevel: "high" },
  { key: "inland-four-days-bekanntgabe", category: "widerspruch", temporal: "current_2026", type: "deadline", text: "Ein schriftlicher Verwaltungsakt, der im Inland durch die Post übermittelt wird, gilt am vierten Tag nach der Aufgabe zur Post als bekannt gegeben, außer wenn er nicht oder später zugegangen ist.", sourceKey: "sgb10-37", passageKey: "sgb10-37-2", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "do-not-auto-recommend-widerspruch", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Aus der bloßen Existenz eines Bescheids oder eines Widerspruchswegs folgt keine Empfehlung, Widerspruch einzulegen. Zuerst sind der konkrete Verwaltungsakt, die Bekanntgabe und die Rechtsbehelfsbelehrung zu prüfen.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "individualized-widerspruch-deadline-needs-facts", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Ein individueller letzter Tag für den Widerspruch darf nicht berechnet werden, solange Bekanntgabeart, Aufgabe- oder Absendedatum, Zugang und Rechtsbehelfsbelehrung fehlen.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "arrears-need-mahnung", category: "arrears", temporal: "current_2026", type: "definition", text: "Ein Ruhen von Leistungsansprüchen wegen Beitragsrückstands setzt voraus, dass Mitglieder mit Beitragsanteilen für zwei Monate im Rückstand sind und trotz Mahnung nicht zahlen. Zwei unbezahlte Monate allein genügen nicht.", sourceKey: "sgb5-16", passageKey: "sgb5-16-3a", riskLevel: "high" },
  { key: "ruhen-not-total-loss-of-care", category: "arrears", temporal: "current_2026", type: "exception", text: "Auch während des Ruhens bleiben Früherkennung sowie die Behandlung akuter Erkrankungen und Schmerzzustände sowie Leistungen bei Schwangerschaft und Mutterschaft erhalten. Verspätete Beiträge bedeuten nicht den sofortigen Wegfall jeder Krankenbehandlung.", sourceKey: "sgb5-16", passageKey: "sgb5-16-3a", riskLevel: "high" },
  { key: "installment-restores-entitlement", category: "arrears", temporal: "current_2026", type: "procedure", text: "Kommt eine wirksame Ratenzahlungsvereinbarung zustande, hat das Mitglied ab diesem Zeitpunkt wieder Anspruch auf Leistungen, solange die Raten vertragsgemäß entrichtet werden.", sourceKey: "sgb5-16", passageKey: "sgb5-16-3a", riskLevel: "medium" },
  { key: "hardship-prevents-or-ends-ruhen", category: "arrears", temporal: "current_2026", type: "exception", text: "Das Ruhen tritt nicht ein oder endet, wenn Versicherte hilfebedürftig im Sinne des Zweiten oder Zwölften Buches sind oder werden. Die Krankenkasse hat auf die Möglichkeit der Beitragsübernahme hinzuweisen.", sourceKey: "sgb5-16", passageKey: "sgb5-16-3a", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "arrears-not-typical-payroll-employee", category: "arrears", temporal: "current_2026", type: "exception", text: "Die Ruhensregelung wegen eigener Beitragsrückstände ist nicht auf jede gewöhnliche Pflichtbeschäftigung mit Arbeitgeberabführung zu verallgemeinern. Der konkrete Mitglieds- und Zahlungsstatus ist zu prüfen.", sourceKey: "sgb5-16", passageKey: "sgb5-16-3a", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "address-change-tell-kasse", category: "address", temporal: "current_2026", type: "duty", text: "Eine Anschriftenänderung ist der Krankenkasse mitzuteilen, weil sie für Stammdaten und Erreichbarkeit erheblich ist. Ein Umzug innerhalb Deutschlands begründet keine neue Versicherungsidentität.", sourceKey: "sgb1-60", passageKey: "sgb1-60-1", riskLevel: "low" },
  { key: "move-abroad-is-cross-border-trigger", category: "address", temporal: "current_2026", type: "procedure", text: "Ein Wegzug ins Ausland kann Wohnsitz, Bekanntgabe und den zuständigen Versicherungsstaat berühren. Er ändert nicht automatisch die Krankenkasse und entscheidet nicht allein über die Versicherungszuständigkeit.", sourceKey: "dvka-s1", passageKey: "dvka-s1-text", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "work-in-germany-not-always-german-insurance", category: "cross_border", temporal: "current_2026", type: "exception", text: "Arbeit in Deutschland bedeutet in grenzüberschreitenden Fällen nicht automatisch, dass Deutschland der zuständige Versicherungsstaat ist. Es bedarf der EU-Koordinierung.", sourceKey: "dvka-s1", passageKey: "dvka-s1-text", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "residence-abroad-not-automatic-foreign-competence", category: "cross_border", temporal: "current_2026", type: "exception", text: "Wohnsitz in der Slowakei, Tschechien, Polen oder Ungarn bedeutet nicht automatisch, dass dieser Staat die Krankenversicherung führt.", sourceKey: "dvka-s1", passageKey: "dvka-s1-text", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "s1-is-entitlement-certificate", category: "cross_border", temporal: "current_2026", type: "definition", text: "Das Portable Dokument S1 ist eine Anspruchsbescheinigung für Sachleistungen im Wohnstaat, wenn die deutsche Krankenkasse zuständig bleibt. Es ist ein Koordinierungsdokument, kein inländischer Mitgliedsersatz.", sourceKey: "dvka-s1", passageKey: "dvka-s1-text", riskLevel: "medium" },
  { key: "a1-is-applicable-law-certificate", category: "cross_border", temporal: "current_2026", type: "definition", text: "Die A1-Bescheinigung weist nach, welche Rechtsvorschriften der sozialen Sicherheit anzuwenden sind. Bei Erwerbstätigkeit in mehreren Mitgliedstaaten stellt der Wohnstaatsträger das anwendbare Recht fest.", sourceKey: "dvka-a1", passageKey: "dvka-a1-text", riskLevel: "medium" },
  { key: "s1-not-same-as-a1", category: "cross_border", temporal: "current_2026", type: "exception", text: "S1 und A1 sind verschiedene Koordinierungsdokumente der Krankenversicherung. S1 betrifft den Sachleistungsanspruch im Wohnstaat, A1 das anzuwendende Sozialversicherungsrecht.", sourceKey: "dvka-a1", passageKey: "dvka-a1-text", riskLevel: "high" },
  { key: "cross-border-needs-eu-coordination", category: "cross_border", temporal: "current_2026", type: "exception", text: "Wohnen, Arbeiten, Entsendung, S1, A1, ausländische Krankenversicherung oder Familie in einem anderen Mitgliedstaat machen den Fall zu einem EU-Koordinierungsfall. Der zuständige Versicherungsstaat darf hier nicht vereinfacht entschieden werden.", sourceKey: "dvka-a1", passageKey: "dvka-a1-text", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "user-locale-not-insurance-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "Weder die userLocale noch die deutsche Sprache eines Krankenkassenschreibens bestimmen den zuständigen Versicherungsträger oder den zuständigen Mitgliedstaat.", sourceKey: "sgb5-173", passageKey: "sgb5-173-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "actual-kasse-is-case-specific", category: "competence", temporal: "current_2026", type: "procedure", text: "Die zuständige Krankenkasse ergibt sich aus Wahl, letzter Mitgliedschaft, Meldung oder dem konkreten Schreiben. Es darf keine erfundene bundesweite Einheitskasse benannt werden.", sourceKey: "sgb5-173", passageKey: "sgb5-173-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "document-may-identify-kasse", category: "competence", temporal: "current_2026", type: "procedure", text: "Das konkrete Schreiben kann Krankenkasse, Mitgliedsnummer und Aktenzeichen nennen. Diese Angaben sind heranzuziehen, ersetzen aber nicht die Statusprüfung, wenn sie fehlen.", sourceKey: "sgb10-31", passageKey: "sgb10-31-1", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "insufficient-facts-no-institution", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne Versicherungsstatus, Leistungsbezug, Wohn- oder Arbeitsstaat und konkretes Schreiben darf weder eine bestimmte Krankenkasse noch ein bestimmter Sozialleistungsträger als zuständige Stelle benannt werden.", sourceKey: "sgb5-173", passageKey: "sgb5-173-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "unsupported-personalized-status-fail-closed", category: "competence", temporal: "current_2026", type: "exception", text: "Ein individueller Versicherungsstatus, ein PKV-GKV-Vergleich, ein EU-Zuständigkeitsergebnis oder ein genauer Beitragsbetrag darf ohne ausreichende Falltatsachen nicht abschließend beantwortet werden.", sourceKey: "sgb5-5", passageKey: "sgb5-5-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "RESIDENCE_STATE"] },
  { key: "proposed-future-law-not-current", category: "status_orientation", temporal: "current_2026", type: "exception", text: "Angekündigte Reformen, Kabinettsentwürfe oder noch nicht geltende Regelungen sind keine aktuelle Nutzeranleitung. Dieses Pack speichert nur jetzt geltendes Recht und aktuelle amtliche Prozesse.", sourceKey: "sgb5-5", passageKey: "sgb5-5-1", riskLevel: "medium" },
  { key: "zusatzbeitrag-list-is-operational", category: "contribution", temporal: "current_2026", type: "procedure", text: "Die tagesaktuellen Zusatzbeitragssätze und die Öffnung nach Ländern sind der veröffentlichten Krankenkassenliste des GKV-Spitzenverbandes zu entnehmen und vor der Nutzung zu revalidieren.", sourceKey: "gkv-sv-kassenliste", passageKey: "gkv-sv-list", riskLevel: "low" },
]);

export type HealthInsuranceProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

export type HealthInsuranceFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

export type HealthInsuranceBindingSpec = Readonly<{
  processKey: string;
  claimKeys: readonly string[];
  role: HealthInsuranceProcessRole;
  sequenceContext: string;
  required?: boolean;
  qualificationRequired?: boolean;
}>;

export type HealthInsuranceProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: HealthInsuranceScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const HEALTH_INSURANCE_PROCESSES: readonly HealthInsuranceProcessSpec[] = Object.freeze([
  { key: "first-employment-health-insurance", title: "Erste Beschäftigung und gesetzliche Krankenversicherung 2026", trigger: "Eine Person nimmt eine gewöhnliche Beschäftigung in Deutschland auf oder fragt, wie die Krankenkasse einzurichten ist", safeFirstStep: "Prüfen, ob ein Pflichtversicherungstatbestand vorliegt, die gewählte Krankenkasse der meldenden Stelle nennen und die Mitgliedschaft nicht mit der Gesundheitskarte verwechseln.", riskLevel: "high" },
  { key: "choose-krankenkasse", title: "Krankenkasse wählen ohne Rangliste 2026", trigger: "Eine wählbare gesetzliche Krankenkasse soll bestimmt oder mitgeteilt werden", safeFirstStep: "Das gesetzliche Wahlrecht und die offenen Kassenarten klären; keine einzelne Krankenkasse empfehlen und die Zwei-Wochen-Angabe nicht offenlassen.", riskLevel: "medium" },
  { key: "membership-proof-and-egk", title: "Mitgliedschaftsnachweis und elektronische Gesundheitskarte 2026", trigger: "Mitgliedschaft, Versicherungsnachweis, fehlende, verlorene oder geänderte Gesundheitskarte sind angesprochen", safeFirstStep: "Mitgliedschaft und Kartenbesitz trennen; bei fehlender oder verlorener Karte die Krankenkasse um Nachweis oder Ersatz bitten.", riskLevel: "medium" },
  { key: "contribution-orientation", title: "Beitragsgrundsätze und jahresabhängige Werte 2026", trigger: "Allgemeiner Beitrag, Zusatzbeitrag, Bemessungsgrenze oder ein individueller Betrag ist gefragt", safeFirstStep: "Den gesetzlichen allgemeinen Beitragssatz und die Halbteilung bei Pflichtbeschäftigten erklären; kassenindividuelle und jährliche Werte nicht als zeitlose Zahlen speichern.", riskLevel: "high" },
  { key: "family-insurance-orientation", title: "Familienversicherung prüfen ohne Automatik 2026", trigger: "Ehegatte, Lebenspartner oder Kind soll über ein Mitglied mitversichert werden", safeFirstStep: "Wohnsitz, eigenen Versicherungsstatus, hauptberufliche Selbständigkeit und Einkommensgrenze prüfen; Ehe oder Kindschaft nicht als automatische Berechtigung behandeln.", riskLevel: "high" },
  { key: "employer-change", title: "Arbeitgeberwechsel und bestehende Krankenkasse 2026", trigger: "Ein neues Beschäftigungsverhältnis beginnt, während bereits eine gesetzliche Krankenversicherung besteht", safeFirstStep: "Die bestehende Krankenkasse nicht automatisch als beendet behandeln; nur die gesetzliche Neuanmeldung und ein etwaiges neues Wahlrecht prüfen.", riskLevel: "medium" },
  { key: "change-krankenkasse", title: "Krankenkasse wechseln nach geltendem Wahlrecht 2026", trigger: "Die gesetzliche Krankenkasse soll gewechselt werden", safeFirstStep: "Bindungsfrist, gesetzliche Ausnahmen und den elektronischen Wechsel über die neue Krankenkasse prüfen; keine überholte Papierkündigung innerhalb der GKV verlangen.", riskLevel: "medium" },
  { key: "employment-end-insurance-continuity", title: "Versicherungsschutz nach Beschäftigungsende 2026", trigger: "Eine Beschäftigung endet oder es wird gefragt, ob der Krankenversicherungsschutz sofort entfällt", safeFirstStep: "Nicht automatisch Unversichertheit annehmen; Arbeitslosengeld, Grundsicherungsgeld, Familienversicherung und freiwillige Fortsetzung als mögliche Wege prüfen.", riskLevel: "high" },
  { key: "unemployment-health-insurance", title: "Krankenversicherung bei Arbeitslosengeld und Grundsicherungsgeld 2026", trigger: "Arbeitslosengeld oder Grundsicherungsgeld und die Krankenversicherung sind angesprochen", safeFirstStep: "Den aktuellen Leistungsstatus feststellen; Beiträge der Agentur für Arbeit oder des Jobcenters nicht mit einer individuellen Statuserfindung verwechseln.", riskLevel: "high" },
  { key: "voluntary-continuation", title: "Automatische freiwillige Fortsetzung nach § 188 SGB V 2026", trigger: "Pflicht- oder Familienversicherung endet oder ein Schreiben zur freiwilligen Versicherung liegt vor", safeFirstStep: "Die gesetzliche Fortsetzung und den Austritt nur mit Nachweis anderweitigen Schutzes erklären; nicht jede Person als freiwilliges Mitglied behandeln.", riskLevel: "high" },
  { key: "krankengeld-orientation", title: "Krankengeld und Entgeltfortzahlung einordnen 2026", trigger: "Längere Krankheit, Entgeltfortzahlung oder Krankengeld ist gefragt", safeFirstStep: "Zuerst den Versicherungsstatus und die sechswöchige Arbeitgeberfortzahlung prüfen; keinen universellen Krankengeldanspruch und keinen individuellen Betrag erfinden.", riskLevel: "high" },
  { key: "evidence-request-response", title: "Unterlagenanforderung der Krankenkasse 2026", trigger: "Die Krankenkasse verlangt Angaben, Einkommensnachweise oder Familienunterlagen", safeFirstStep: "Den angeforderten Inhalt, den Zeitraum und die im Schreiben genannte Frist feststellen; die Anforderung nicht als Ablehnung lesen.", riskLevel: "medium" },
  { key: "krankenkasse-bescheid", title: "Bescheid der Krankenkasse sicher lesen 2026", trigger: "Ein Beitrags-, Ablehnungs-, Status- oder Ruhensbescheid der Krankenkasse liegt vor", safeFirstStep: "Prüfen, ob ein Verwaltungsakt vorliegt, Begründung und Rechtsbehelfsbelehrung lesen und daraus keine automatische Widerspruchsempfehlung ableiten.", riskLevel: "high" },
  { key: "widerspruch-foundation", title: "Widerspruch gegen einen Krankenkassen-Verwaltungsakt 2026", trigger: "Gegen eine Entscheidung der Krankenkasse soll ein Widerspruch geprüft werden", safeFirstStep: "Nur bei Verwaltungsakt, Bekanntgabe und Rechtsbehelfsbelehrung fortfahren; das Briefdatum nicht als Fristbeginn verwenden und Widerspruch nicht automatisch empfehlen.", riskLevel: "high" },
  { key: "contribution-arrears", title: "Beitragsrückstand, Mahnung und Ruhen 2026", trigger: "Offene Beiträge, eine Mahnung oder Ruhen der Leistungen sind angesprochen", safeFirstStep: "Mahnung, Zweimonatsrückstand und gesetzliche Ausnahmen prüfen; nicht jede verspätete Zahlung als sofortigen Wegfall der Krankenbehandlung behandeln.", riskLevel: "high" },
  { key: "cross-border-health-insurance-gate", title: "Grenzüberschreitende Krankenversicherung als EU-Koordinierungsfall 2026", trigger: "Wohnen, Arbeiten, Familie, S1, A1 oder ausländische Krankenversicherung berühren mehr als einen Staat", safeFirstStep: "Den Fall als EU-Koordinierungsfall erkennen; S1 und A1 unterscheiden und den zuständigen Versicherungsstaat nicht vereinfacht festlegen.", riskLevel: "high" },
  { key: "competent-insurance-institution-resolution", title: "Zuständige Krankenkasse oder Sozialbehörde klären 2026", trigger: "Die zuständige Krankenkasse, Agentur für Arbeit oder das Jobcenter soll benannt werden", safeFirstStep: "Zuerst das konkrete Schreiben und den Versicherungsstatus prüfen; ohne ausreichende Tatsachen keine bestimmte Stelle erfinden.", riskLevel: "high" },
]);

export const HEALTH_INSURANCE_FORMS: readonly HealthInsuranceFormSpec[] = Object.freeze([
  { key: "gkv-wahl", name: "Mitgliedschaftserklärung gegenüber der gewählten Krankenkasse", identifier: "GKV-Wahl-Mitgliedschaft", purpose: "Ausübung des gesetzlichen Wahlrechts gegenüber der gewählten Krankenkasse; kein kassenspezifisches Proprietärformular", submissionChannels: ["insurer_declared_channel"], sourceKey: "sgb5-175", passageKey: "sgb5-175-all" },
  { key: "gkv-familie", name: "Meldung zur Familienversicherung", identifier: "GKV-Familienversicherung-Meldung", purpose: "Meldung der Angehörigen und späterer Änderungen nach dem einheitlichen Verfahren des GKV-Spitzenverbandes", submissionChannels: ["insurer_declared_channel"], sourceKey: "sgb5-10", passageKey: "sgb5-10-all" },
  { key: "gkv-egk-ersatz", name: "Anzeige zum Ersatz der elektronischen Gesundheitskarte", identifier: "GKV-eGK-Ersatz", purpose: "Meldung von Verlust, Diebstahl oder Beschädigung und Anforderung einer Ersatzkarte bei der eigenen Krankenkasse", submissionChannels: ["insurer_declared_channel"], sourceKey: "gesund-egk", passageKey: "gesund-egk-what" },
  { key: "sgg-widerspruch", name: "Widerspruch gegen einen Verwaltungsakt der Krankenkasse", identifier: "SGG-Widerspruch", purpose: "Einlegung des Widerspruchs bei der erlassenden Stelle in der gesetzlich zulässigen Form", submissionChannels: ["written_or_electronic_or_niederschrift"], sourceKey: "sgg-84", passageKey: "sgg-84-1" },
]);

export const HEALTH_INSURANCE_PROCESS_BINDINGS: readonly HealthInsuranceBindingSpec[] = Object.freeze([
  { processKey: "first-employment-health-insurance", role: "orientation_basis", sequenceContext: "first_job_what", claimKeys: ["gkv-is-statutory-insurance", "ordinary-employment-can-trigger-pflicht", "employment-not-universal-gkv"] },
  { processKey: "first-employment-health-insurance", role: "application_route", sequenceContext: "first_job_choose", claimKeys: ["wahlrecht-for-pflicht-and-freiwillig", "must-name-kasse-within-two-weeks", "fallback-registration-if-no-choice", "employer-electronic-registration"] },
  { processKey: "first-employment-health-insurance", role: "next_state", sequenceContext: "first_job_next", claimKeys: ["membership-starts-with-employment", "membership-not-same-as-egk", "employee-employer-share-half"] },
  { processKey: "first-employment-health-insurance", role: "negative_control", sequenceContext: "first_job_not", claimKeys: ["pkv-gkv-boundary-only", "high-salary-not-automatically-pkv", "self-employed-not-automatically-pkv"] },
  { processKey: "choose-krankenkasse", role: "orientation_basis", sequenceContext: "wahl", claimKeys: ["wahlrecht-for-pflicht-and-freiwillig", "eligible-kassenarten", "open-status-is-operational", "kasse-may-not-reject-for-health"] },
  { processKey: "choose-krankenkasse", role: "negative_control", sequenceContext: "wahl_not", claimKeys: ["do-not-rank-insurers", "gkv-not-one-nationwide-kasse"] },
  { processKey: "membership-proof-and-egk", role: "identification", sequenceContext: "egk", claimKeys: ["egk-is-versichertenausweis", "membership-not-same-as-egk", "egk-not-yet-received", "lost-egk-contact-kasse", "egk-data-change-no-new-identity", "egk-digital-functions-orientation-only", "address-change-tell-kasse"] },
  { processKey: "contribution-orientation", role: "payment", sequenceContext: "beitrag", claimKeys: ["general-contribution-rate-14-6", "zusatzbeitrag-is-kasse-specific", "average-zusatz-not-individual", "employee-employer-share-half", "zusatzbeitrag-list-is-operational"] },
  { processKey: "contribution-orientation", role: "negative_control", sequenceContext: "beitrag_not", claimKeys: ["bbg-is-annual-not-timeless", "jaeg-is-annual-not-timeless", "individual-contribution-needs-facts", "voluntary-contribution-base-differs"] },
  { processKey: "family-insurance-orientation", role: "orientation_basis", sequenceContext: "familie", claimKeys: ["family-spouse-may-qualify", "family-child-not-automatic", "family-income-limit-is-annual-concept", "family-main-self-employment-excludes", "family-inland-residence-condition"] },
  { processKey: "family-insurance-orientation", role: "application_route", sequenceContext: "familie_melden", claimKeys: ["family-must-be-reported-to-kasse"] },
  { processKey: "family-insurance-orientation", role: "negative_control", sequenceContext: "familie_not", claimKeys: ["family-not-automatic-from-marriage", "family-facts-required-before-entitlement"] },
  { processKey: "employer-change", role: "orientation_basis", sequenceContext: "arbeitgeberwechsel", claimKeys: ["employer-change-not-mandatory-kasse-change", "employer-change-may-reopen-wahlrecht", "employer-registration-not-kassenwechsel"] },
  { processKey: "change-krankenkasse", role: "deadline_gate", sequenceContext: "wechsel_frist", claimKeys: ["ordinary-binding-twelve-months", "binding-not-if-membership-ends-by-law", "change-effective-overnext-month", "zusatz-increase-special-termination"] },
  { processKey: "change-krankenkasse", role: "application_route", sequenceContext: "wechsel_weg", claimKeys: ["new-kasse-handles-electronic-switch", "leaving-gkv-needs-other-coverage", "tell-employer-about-switch"] },
  { processKey: "employment-end-insurance-continuity", role: "orientation_basis", sequenceContext: "jobende", claimKeys: ["job-end-not-immediate-uninsured", "automatic-voluntary-continuation", "alg-generally-pflichtversichert", "grundsicherung-jobcenter-pays-gkv"] },
  { processKey: "employment-end-insurance-continuity", role: "context_gate", sequenceContext: "jobende_gate", qualificationRequired: true, claimKeys: ["continuity-needs-status-facts"] },
  { processKey: "unemployment-health-insurance", role: "orientation_basis", sequenceContext: "alg_gsg", claimKeys: ["alg-generally-pflichtversichert", "alg-ba-pays-contributions", "alg-membership-from-benefit-day", "alg-sickness-has-separate-path", "grundsicherungsgeld-is-current-term", "grundsicherung-jobcenter-pays-gkv", "grundsicherung-cover-from-application-if-approved"] },
  { processKey: "voluntary-continuation", role: "orientation_basis", sequenceContext: "antragslos", claimKeys: ["automatic-voluntary-continuation", "exit-needs-other-coverage-proof", "voluntary-not-automatic-for-everyone"] },
  { processKey: "krankengeld-orientation", role: "orientation_basis", sequenceContext: "krankengeld", claimKeys: ["krankengeld-not-for-everyone", "efzg-six-weeks-then-krankengeld", "krankengeld-needs-medical-continuity", "membership-continues-during-krankengeld", "self-employed-krankengeld-needs-election"] },
  { processKey: "krankengeld-orientation", role: "negative_control", sequenceContext: "krankengeld_not", claimKeys: ["no-individual-krankengeld-amount"] },
  { processKey: "evidence-request-response", role: "evidence_requirement", sequenceContext: "unterlagen", claimKeys: ["evidence-request-is-mitwirkung", "identify-requested-kk-items", "non-response-may-affect-decision"] },
  { processKey: "evidence-request-response", role: "deadline_gate", sequenceContext: "unterlagen_frist", qualificationRequired: true, claimKeys: ["evidence-deadline-from-kk-letter"] },
  { processKey: "evidence-request-response", role: "negative_control", sequenceContext: "unterlagen_not", claimKeys: ["evidence-request-not-rejection"] },
  { processKey: "krankenkasse-bescheid", role: "orientation_basis", sequenceContext: "bescheid", claimKeys: ["bescheid-is-verwaltungsakt", "inspect-kk-bescheid-parts", "rechtsbehelfsbelehrung-required"] },
  { processKey: "krankenkasse-bescheid", role: "negative_control", sequenceContext: "bescheid_not", claimKeys: ["kk-letter-not-automatically-bescheid", "kk-letter-not-automatically-debt", "do-not-auto-recommend-widerspruch"] },
  { processKey: "widerspruch-foundation", role: "legal_remedy_gate", sequenceContext: "widerspruch_gate", qualificationRequired: true, claimKeys: ["widerspruch-only-against-va", "widerspruch-one-month-after-bekanntgabe", "missing-belehrung-one-year", "do-not-auto-recommend-widerspruch"] },
  { processKey: "widerspruch-foundation", role: "application_route", sequenceContext: "widerspruch_submit", claimKeys: ["widerspruch-three-months-abroad", "document-date-not-widerspruch-start", "inland-four-days-bekanntgabe", "individualized-widerspruch-deadline-needs-facts"] },
  { processKey: "contribution-arrears", role: "orientation_basis", sequenceContext: "rueckstand", claimKeys: ["arrears-need-mahnung", "ruhen-not-total-loss-of-care", "installment-restores-entitlement", "hardship-prevents-or-ends-ruhen"] },
  { processKey: "contribution-arrears", role: "negative_control", sequenceContext: "rueckstand_not", claimKeys: ["arrears-not-typical-payroll-employee"] },
  { processKey: "cross-border-health-insurance-gate", role: "context_gate", sequenceContext: "eu_gate", qualificationRequired: true, claimKeys: ["work-in-germany-not-always-german-insurance", "residence-abroad-not-automatic-foreign-competence", "s1-is-entitlement-certificate", "a1-is-applicable-law-certificate", "s1-not-same-as-a1", "cross-border-needs-eu-coordination", "family-inland-residence-condition", "move-abroad-is-cross-border-trigger"] },
  { processKey: "competent-insurance-institution-resolution", role: "orientation_basis", sequenceContext: "zustaendigkeit", claimKeys: ["actual-kasse-is-case-specific", "document-may-identify-kasse", "gkv-not-one-nationwide-kasse"] },
  { processKey: "competent-insurance-institution-resolution", role: "negative_control", sequenceContext: "zustaendigkeit_fail", qualificationRequired: true, claimKeys: ["user-locale-not-insurance-jurisdiction", "insufficient-facts-no-institution", "unsupported-personalized-status-fail-closed", "proposed-future-law-not-current"] },
]);

export const HEALTH_INSURANCE_PROCESS_SCENARIOS: readonly HealthInsuranceProcessScenario[] = Object.freeze([
  { id: "first-german-employment", label: "Erste Beschäftigung in Deutschland", coverage: "COVERED", requiredClaimKeys: ["ordinary-employment-can-trigger-pflicht", "must-name-kasse-within-two-weeks"], requiredProcessKeys: ["first-employment-health-insurance"], requiredFormIdentifiers: ["GKV-Wahl-Mitgliedschaft"] },
  { id: "compulsory-insurance-orientation", label: "Versicherungspflicht einordnen", coverage: "COVERED", requiredClaimKeys: ["gkv-is-statutory-insurance", "employment-not-universal-gkv"], requiredProcessKeys: ["first-employment-health-insurance"] },
  { id: "choosing-krankenkasse", label: "Krankenkasse wählen", coverage: "COVERED", requiredClaimKeys: ["wahlrecht-for-pflicht-and-freiwillig", "eligible-kassenarten"], requiredProcessKeys: ["choose-krankenkasse"] },
  { id: "no-kasse-selection-in-time", label: "Keine Krankenkasse innerhalb der Frist genannt", coverage: "COVERED", requiredClaimKeys: ["fallback-registration-if-no-choice"], requiredProcessKeys: ["first-employment-health-insurance"] },
  { id: "employer-reporting-registration", label: "Elektronische Anmeldung der meldenden Stelle", coverage: "COVERED", requiredClaimKeys: ["employer-electronic-registration"], requiredProcessKeys: ["first-employment-health-insurance"] },
  { id: "membership-proof", label: "Mitgliedschaftsnachweis", coverage: "COVERED", requiredClaimKeys: ["egk-is-versichertenausweis", "membership-not-same-as-egk"], requiredProcessKeys: ["membership-proof-and-egk"] },
  { id: "egk-not-yet-received", label: "Gesundheitskarte noch nicht da", coverage: "COVERED", requiredClaimKeys: ["egk-not-yet-received", "membership-not-same-as-egk"], requiredProcessKeys: ["membership-proof-and-egk"] },
  { id: "lost-damaged-egk", label: "Gesundheitskarte verloren oder beschädigt", coverage: "COVERED", requiredClaimKeys: ["lost-egk-contact-kasse"], requiredProcessKeys: ["membership-proof-and-egk"], requiredFormIdentifiers: ["GKV-eGK-Ersatz"] },
  { id: "contribution-basics", label: "Beitragsgrundsätze", coverage: "COVERED", requiredClaimKeys: ["general-contribution-rate-14-6", "employee-employer-share-half"], requiredProcessKeys: ["contribution-orientation"] },
  { id: "zusatzbeitrag", label: "Kassenindividueller Zusatzbeitrag", coverage: "COVERED", requiredClaimKeys: ["zusatzbeitrag-is-kasse-specific", "average-zusatz-not-individual"], requiredProcessKeys: ["contribution-orientation"] },
  { id: "annual-threshold-freshness", label: "Jahreswerte sind nicht zeitlos", coverage: "COVERED", requiredClaimKeys: ["bbg-is-annual-not-timeless", "jaeg-is-annual-not-timeless"], requiredProcessKeys: ["contribution-orientation"] },
  { id: "family-insurance-spouse", label: "Familienversicherung Ehegatte", coverage: "COVERED", requiredClaimKeys: ["family-spouse-may-qualify", "family-not-automatic-from-marriage"], requiredProcessKeys: ["family-insurance-orientation"], requiredFormIdentifiers: ["GKV-Familienversicherung-Meldung"] },
  { id: "family-insurance-child", label: "Familienversicherung Kind", coverage: "COVERED", requiredClaimKeys: ["family-child-not-automatic"], requiredProcessKeys: ["family-insurance-orientation"] },
  { id: "family-income-status-gate", label: "Einkommens- und Statusgrenze der Familienversicherung", coverage: "COVERED", requiredClaimKeys: ["family-income-limit-is-annual-concept", "family-facts-required-before-entitlement"], requiredProcessKeys: ["family-insurance-orientation"] },
  { id: "main-self-employment-family-exclusion", label: "Hauptberufliche Selbständigkeit schließt Familienversicherung aus", coverage: "COVERED", requiredClaimKeys: ["family-main-self-employment-excludes"], requiredProcessKeys: ["family-insurance-orientation"] },
  { id: "cross-border-family-insurance-trigger", label: "Auslandswohnsitz der Familie als Koordinierungsfall", coverage: "COVERED", requiredClaimKeys: ["family-inland-residence-condition", "cross-border-needs-eu-coordination"], requiredProcessKeys: ["family-insurance-orientation", "cross-border-health-insurance-gate"] },
  { id: "changing-employer", label: "Arbeitgeberwechsel", coverage: "COVERED", requiredClaimKeys: ["employer-change-not-mandatory-kasse-change", "employer-registration-not-kassenwechsel"], requiredProcessKeys: ["employer-change"] },
  { id: "changing-krankenkasse", label: "Krankenkasse wechseln", coverage: "COVERED", requiredClaimKeys: ["new-kasse-handles-electronic-switch", "ordinary-binding-twelve-months"], requiredProcessKeys: ["change-krankenkasse"] },
  { id: "ordinary-binding-period", label: "Zwölfmonatige Bindung", coverage: "COVERED", requiredClaimKeys: ["ordinary-binding-twelve-months"], requiredProcessKeys: ["change-krankenkasse"] },
  { id: "exception-new-wahlrecht", label: "Neues Wahlrecht oder gesetzliches Ende", coverage: "COVERED", requiredClaimKeys: ["binding-not-if-membership-ends-by-law", "employer-change-may-reopen-wahlrecht"], requiredProcessKeys: ["change-krankenkasse", "employer-change"] },
  { id: "job-ends", label: "Beschäftigung endet", coverage: "COVERED", requiredClaimKeys: ["job-end-not-immediate-uninsured"], requiredProcessKeys: ["employment-end-insurance-continuity"] },
  { id: "arbeitslosengeld-transition", label: "Arbeitslosengeld und Krankenversicherung", coverage: "COVERED", requiredClaimKeys: ["alg-generally-pflichtversichert", "alg-ba-pays-contributions"], requiredProcessKeys: ["unemployment-health-insurance"] },
  { id: "grundsicherungsgeld-interface", label: "Grundsicherungsgeld und Krankenversicherung", coverage: "COVERED", requiredClaimKeys: ["grundsicherungsgeld-is-current-term", "grundsicherung-jobcenter-pays-gkv"], requiredProcessKeys: ["unemployment-health-insurance"] },
  { id: "automatic-voluntary-continuation", label: "Automatische freiwillige Fortsetzung", coverage: "COVERED", requiredClaimKeys: ["automatic-voluntary-continuation"], requiredProcessKeys: ["voluntary-continuation"] },
  { id: "alternative-coverage-exit-gate", label: "Austritt nur mit anderweitigem Schutz", coverage: "COVERED", requiredClaimKeys: ["exit-needs-other-coverage-proof"], requiredProcessKeys: ["voluntary-continuation"] },
  { id: "krankengeld-basic-eligibility", label: "Krankengeld nicht für jede Person", coverage: "COVERED", requiredClaimKeys: ["krankengeld-not-for-everyone"], requiredProcessKeys: ["krankengeld-orientation"] },
  { id: "employee-sick-pay-to-krankengeld", label: "Entgeltfortzahlung und Übergang zum Krankengeld", coverage: "COVERED", requiredClaimKeys: ["efzg-six-weeks-then-krankengeld"], requiredProcessKeys: ["krankengeld-orientation"] },
  { id: "self-employed-krankengeld-boundary", label: "Krankengeld Selbständige nur mit Wahlerklärung", coverage: "COVERED", requiredClaimKeys: ["self-employed-krankengeld-needs-election"], requiredProcessKeys: ["krankengeld-orientation"] },
  { id: "krankenkasse-evidence-request", label: "Unterlagenanforderung der Krankenkasse", coverage: "COVERED", requiredClaimKeys: ["identify-requested-kk-items", "evidence-request-not-rejection"], requiredProcessKeys: ["evidence-request-response"] },
  { id: "family-insurance-evidence-request", label: "Nachweise zur Familienversicherung", coverage: "COVERED", requiredClaimKeys: ["family-must-be-reported-to-kasse", "evidence-request-is-mitwirkung"], requiredProcessKeys: ["family-insurance-orientation", "evidence-request-response"] },
  { id: "contribution-income-evidence-request", label: "Einkommensnachweis freiwilliger Mitglieder", coverage: "COVERED", requiredClaimKeys: ["voluntary-contribution-base-differs", "identify-requested-kk-items"], requiredProcessKeys: ["contribution-orientation", "evidence-request-response"] },
  { id: "krankenkasse-bescheid", label: "Bescheid der Krankenkasse", coverage: "COVERED", requiredClaimKeys: ["bescheid-is-verwaltungsakt", "inspect-kk-bescheid-parts"], requiredProcessKeys: ["krankenkasse-bescheid"] },
  { id: "rechtsbehelfsbelehrung", label: "Rechtsbehelfsbelehrung", coverage: "COVERED", requiredClaimKeys: ["rechtsbehelfsbelehrung-required"], requiredProcessKeys: ["krankenkasse-bescheid"] },
  { id: "widerspruch-availability-gate", label: "Widerspruch nur bei Verwaltungsakt", coverage: "COVERED", requiredClaimKeys: ["widerspruch-only-against-va", "do-not-auto-recommend-widerspruch"], requiredProcessKeys: ["widerspruch-foundation"], requiredFormIdentifiers: ["SGG-Widerspruch"] },
  { id: "widerspruch-deadline-context", label: "Widerspruchsfrist braucht Bekanntgabe", coverage: "COVERED", requiredClaimKeys: ["widerspruch-one-month-after-bekanntgabe", "individualized-widerspruch-deadline-needs-facts"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "foreign-bekanntgabe-widerspruch", label: "Bekanntgabe im Ausland", coverage: "COVERED", requiredClaimKeys: ["widerspruch-three-months-abroad"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "contribution-arrears", label: "Beitragsrückstand", coverage: "COVERED", requiredClaimKeys: ["arrears-need-mahnung"], requiredProcessKeys: ["contribution-arrears"] },
  { id: "mahnung-before-ruhen", label: "Mahnung vor Ruhen", coverage: "COVERED", requiredClaimKeys: ["arrears-need-mahnung", "ruhen-not-total-loss-of-care"], requiredProcessKeys: ["contribution-arrears"] },
  { id: "ruhen-exceptions", label: "Ausnahmen vom Ruhen", coverage: "COVERED", requiredClaimKeys: ["ruhen-not-total-loss-of-care"], requiredProcessKeys: ["contribution-arrears"] },
  { id: "installment-agreement-effect", label: "Ratenzahlung stellt Leistungsanspruch wieder her", coverage: "COVERED", requiredClaimKeys: ["installment-restores-entitlement"], requiredProcessKeys: ["contribution-arrears"] },
  { id: "ordinary-letter-not-rejection", label: "Krankenkassenschreiben ist keine Ablehnung", coverage: "COVERED", requiredClaimKeys: ["kk-letter-not-automatically-bescheid", "evidence-request-not-rejection"], requiredProcessKeys: ["krankenkasse-bescheid"] },
  { id: "letter-not-loss-of-insurance", label: "Schreiben bedeutet keinen Versicherungsverlust", coverage: "COVERED", requiredClaimKeys: ["kk-letter-not-automatically-bescheid", "job-end-not-immediate-uninsured"], requiredProcessKeys: ["krankenkasse-bescheid", "employment-end-insurance-continuity"] },
  { id: "address-change", label: "Anschriftenänderung", coverage: "COVERED", requiredClaimKeys: ["address-change-tell-kasse"], requiredProcessKeys: ["membership-proof-and-egk"] },
  { id: "move-abroad-trigger", label: "Wegzug ins Ausland", coverage: "COVERED", requiredClaimKeys: ["move-abroad-is-cross-border-trigger"], requiredProcessKeys: ["cross-border-health-insurance-gate"] },
  { id: "s1-recognized", label: "S1 als Koordinierungsdokument", coverage: "COVERED", requiredClaimKeys: ["s1-is-entitlement-certificate"], requiredProcessKeys: ["cross-border-health-insurance-gate"] },
  { id: "a1-recognized", label: "A1 als anderes Koordinierungsdokument", coverage: "COVERED", requiredClaimKeys: ["a1-is-applicable-law-certificate"], requiredProcessKeys: ["cross-border-health-insurance-gate"] },
  { id: "s1-not-a1", label: "S1 ist nicht A1", coverage: "COVERED", requiredClaimKeys: ["s1-not-same-as-a1"], requiredProcessKeys: ["cross-border-health-insurance-gate"] },
  { id: "work-germany-not-automatic-state", label: "Arbeit in Deutschland bestimmt nicht immer den Versicherungsstaat", coverage: "COVERED", requiredClaimKeys: ["work-in-germany-not-always-german-insurance"], requiredProcessKeys: ["cross-border-health-insurance-gate"] },
  { id: "user-locale-not-jurisdiction", label: "userLocale bestimmt keine Zuständigkeit", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-insurance-jurisdiction"], requiredProcessKeys: ["competent-insurance-institution-resolution"] },
  { id: "document-language-not-jurisdiction", label: "Dokumentsprache bestimmt keine Zuständigkeit", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-insurance-jurisdiction"], requiredProcessKeys: ["competent-insurance-institution-resolution"] },
  { id: "pkv-gkv-boundary", label: "Grenze gesetzlich und privat", coverage: "COVERED", requiredClaimKeys: ["pkv-gkv-boundary-only", "high-salary-not-automatically-pkv"], requiredProcessKeys: ["first-employment-health-insurance"] },
  { id: "individualized-pkv-gkv-recommendation", label: "Individuelle PKV-GKV-Empfehlung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kein Finanzvergleich und keine Empfehlung eines Versicherungssystems." },
  { id: "full-eu-coordination", label: "Vollständige EU-Koordinierung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Gate und Dokumentunterscheidung; Zuständigkeitsentscheidung gehört in die spätere EU-Schicht." },
  { id: "unsupported-personalized-status", label: "Individueller Versicherungsstatus fail-closed", coverage: "COVERED", requiredClaimKeys: ["unsupported-personalized-status-fail-closed"], requiredProcessKeys: ["competent-insurance-institution-resolution"] },
  { id: "full-pkv-lifecycle", label: "Vollständiger PKV-Lebenszyklus", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Abgrenzung zur GKV." },
  { id: "full-krankengeld-calculation", label: "Individuelle Krankengeldberechnung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Anspruchsorientierung." },
  { id: "student-pensioner-deep", label: "Studenten- und KVdR-Vertiefung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Eigene spätere Packs." },
  { id: "pflege-rehab-maternity-deep", label: "Pflege, Reha und Mutterschaftsleistungen", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Außerhalb der GKV-Orientierung." },
  { id: "self-employed-encyclopedia", label: "Selbständigenversicherung als Enzyklopädie", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Grenze, Beitragsbasis und Krankengeld-Wahlerklärung." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "sgg-84", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb10-37", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb5-10", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb5-5", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "dvka-a1", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] as const, riskClass: "HIGH" },
  { sourceKey: "gkv-sv-kassenliste", informationClass: "FORM_URL" as const, handlingMode: "CACHE_AND_REVALIDATE" as const, freshnessClass: "MONTHLY" as const, staleBehavior: "REVALIDATE_BEFORE_USE" as const, requiredContextKeys: [] as const, riskClass: "MEDIUM" },
]);

export function evaluateHealthInsuranceProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = HEALTH_INSURANCE_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = HEALTH_INSURANCE_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildHealthInsuranceFederalCorePack(): CuratedDomainPack {
  const item = factory(HEALTH_INSURANCE_PACK_ID);
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
    bmg: item("publishers", "bmg", {
      name: "Bundesministerium für Gesundheit",
      type: "federal_ministry",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    gesund: item("publishers", "gesund-bund", {
      name: "gesund.bund.de des Bundesministeriums für Gesundheit",
      type: "federal_service_portal",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    ba: item("publishers", "bundesagentur-fuer-arbeit", {
      name: "Bundesagentur für Arbeit",
      type: "federal_employment_agency",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    gkvsv: item("publishers", "gkv-spitzenverband", {
      name: "GKV-Spitzenverband",
      type: "statutory_peak_association",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    dvka: item("publishers", "dvka", {
      name: "Deutsche Verbindungsstelle Krankenversicherung - Ausland",
      type: "eu_liaison_body",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    krankenkassen: item("authorities", "gesetzliche-krankenkassen", {
      publisherId: publishers.gkvsv.id,
      name: "Gesetzliche Krankenkassen",
      type: "statutory_health_insurers",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp",
    }),
    gkvsv: item("authorities", "gkv-spitzenverband", {
      publisherId: publishers.gkvsv.id,
      name: "GKV-Spitzenverband",
      type: "statutory_peak_association",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gkv-spitzenverband.de/krankenversicherung/kv_grundprinzipien/finanzierung/zusatzbeitragssatz/zusatzbeitragssatz.jsp",
    }),
    ba: item("authorities", "bundesagentur-fuer-arbeit", {
      publisherId: publishers.ba.id,
      name: "Bundesagentur für Arbeit",
      type: "federal_employment_agency",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de/datei/Merkblatt-fuer-Arbeitslose_ba015368.pdf",
    }),
    jobcenter: item("authorities", "jobcenter-grundsicherungstraeger", {
      publisherId: publishers.ba.id,
      name: "Jobcenter als Träger des Grundsicherungsgeldes",
      type: "local_jobcenter_class",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de/grundsicherung/finanziell-absichern/gesundheit-versicherung",
    }),
    dvka: item("authorities", "dvka", {
      publisherId: publishers.dvka.id,
      name: "Deutsche Verbindungsstelle Krankenversicherung - Ausland",
      type: "eu_liaison_body",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.dvka.de/de/versicherte/faq/fragen-gme/frage-gme-4.html",
    }),
    bmg: item("authorities", "bundesministerium-fuer-gesundheit", {
      publisherId: publishers.bmg.id,
      name: "Bundesministerium für Gesundheit",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bundesgesundheitsministerium.de/themen/krankenversicherung/online-ratgeber-krankenversicherung/krankenversicherung/wahl-und-wechsel-der-krankenkasse",
    }),
  };

  const sources = HEALTH_INSURANCE_OFFICIAL_SOURCES.map((spec) => {
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
      authorityLevel: spec.authorityKey === "dvka" ? "EU" as const : "FEDERAL" as const,
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

  const claims = HEALTH_INSURANCE_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`HEALTH_INSURANCE_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`HEALTH_INSURANCE_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = HEALTH_INSURANCE_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: HEALTH_INSURANCE_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "competent-insurance-institution-resolution",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = HEALTH_INSURANCE_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`HEALTH_INSURANCE_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`HEALTH_INSURANCE_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectBescheidRule = item("actorRules", "inspect-kk-bescheid-before-widerspruch", {
    actorState: "inspect_krankenkasse_bescheid_before_widerspruch",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-insurance-undetermined", {
    actorState: "competent_insurance_institution_undetermined_without_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individualized-widerspruch-undetermined", {
    actorState: "individualized_widerspruch_deadline_undetermined_without_bekanntgabe_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const crossBorderRule = item("actorRules", "cross-border-insurance-undetermined", {
    actorState: "cross_border_insurance_state_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const familyRule = item("actorRules", "family-insurance-undetermined", {
    actorState: "family_insurance_undetermined_without_status_and_income_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const requestRule = item("actorRules", "answer-krankenkasse-request", {
    actorState: "user_must_answer_krankenkasse_request",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = HEALTH_INSURANCE_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`HEALTH_INSURANCE_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: HEALTH_INSURANCE_PACK_ID,
    domain: HEALTH_INSURANCE_DOMAIN,
    canonicalLanguage: HEALTH_INSURANCE_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bmg, publishers.gesund, publishers.ba, publishers.gkvsv, publishers.dvka],
    authorities: [authorities.krankenkassen, authorities.gkvsv, authorities.ba, authorities.jobcenter, authorities.dvka, authorities.bmg],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectBescheidRule, competenceRule, deadlineRule, crossBorderRule, familyRule, requestRule],
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

export function healthInsurancePackSummary(pack: CuratedDomainPack = buildHealthInsuranceFederalCorePack()) {
  const categories = Object.fromEntries(
    HEALTH_INSURANCE_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<HealthInsuranceUnitCategory, number>()),
  );
  const completeness = evaluateHealthInsuranceProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: HEALTH_INSURANCE_UNITS.length,
    futureWatchCount: HEALTH_INSURANCE_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: HEALTH_INSURANCE_G3_PROCESS_STEP_LIMITATION,
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
