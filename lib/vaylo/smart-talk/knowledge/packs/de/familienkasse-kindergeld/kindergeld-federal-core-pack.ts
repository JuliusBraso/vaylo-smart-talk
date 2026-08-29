/**
 * KNOWLEDGE-EXPANSION-01 / 01B — German federal Kindergeld process-complete pack.
 * Official-source G3 CuratedDomainPack for domain familienkasse_kindergeld.
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

export const KINDERGELD_DOMAIN = "familienkasse_kindergeld" as const;
export const KINDERGELD_PACK_ID = KINDERGELD_DOMAIN;
export const KINDERGELD_CANONICAL_LANGUAGE = "de" as const;

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

export type KindergeldUnitCategory =
  | "entitlement"
  | "child_category"
  | "adult_child"
  | "recipient"
  | "amount_payment"
  | "application_2026"
  | "application_newborn"
  | "application_adult"
  | "forms_documents"
  | "evidence"
  | "post_submission"
  | "change_review"
  | "negative_decision"
  | "overpayment"
  | "identification"
  | "competence"
  | "cross_border";

export type KindergeldContextKey = "EVENT_DATE" | "RESIDENCE_STATE" | "WORK_STATE" | "PROCESS_VARIANT";
export type KindergeldHandlingMode = "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type KindergeldFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type KindergeldStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type KindergeldInformationClass =
  | "LEGAL_BASELINE"
  | "ELIGIBILITY"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL";
export type KindergeldProcessRole =
  | "orientation_basis"
  | "required_information"
  | "identification"
  | "application_route"
  | "form_semantics"
  | "evidence_requirement"
  | "next_state"
  | "deadline_gate"
  | "change_duty"
  | "review_request"
  | "decision"
  | "payment"
  | "legal_remedy_gate"
  | "context_gate"
  | "negative_control";
export type KindergeldScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const KINDERGELD_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type KindergeldTemporalClass = "current_2026";

export type KindergeldFutureChangeWatchItem = Readonly<{
  id: string;
  key: string;
  officialSourceUrl: string;
  officialDomain: string;
  officialSourceTitle: string;
  targetYear: 2027;
  status: "future_change_watch_not_ingestible";
  currentGuidance: false;
  description: string;
}>;

type OfficialSourceSpec = Readonly<{
  key: string;
  publisherKey: "bmj" | "familienkasse";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "OFFICIAL_FORM" | "OFFICIAL_ONLINE_SERVICE";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: KindergeldInformationClass;
  handlingMode: KindergeldHandlingMode;
  freshnessClass: KindergeldFreshnessClass;
  staleBehavior: KindergeldStaleBehavior;
  requiredContextKeys: readonly KindergeldContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: KindergeldUnitCategory;
  temporal: KindergeldTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly KindergeldContextKey[];
}>;

export const KINDERGELD_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "estg-62",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__62.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 62 Anspruchsberechtigte",
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
        key: "estg-62-1",
        locator: "EStG § 62 Abs. 1",
        text: "Für Kinder im Sinne des § 63 hat Anspruch auf Kindergeld nach diesem Gesetz, wer im Inland einen Wohnsitz oder seinen gewöhnlichen Aufenthalt hat oder ohne Wohnsitz oder gewöhnlichen Aufenthalt im Inland nach § 1 Absatz 2 unbeschränkt einkommensteuerpflichtig ist oder nach § 1 Absatz 3 als unbeschränkt einkommensteuerpflichtig behandelt wird. Voraussetzung für den Anspruch nach Satz 1 ist, dass der Berechtigte durch die an ihn vergebene Identifikationsnummer (§ 139b der Abgabenordnung) identifiziert wird. Die nachträgliche Vergabe der Identifikationsnummer wirkt auf Monate zurück, in denen die Voraussetzungen des Satzes 1 vorliegen.",
      },
      {
        key: "estg-62-1a",
        locator: "EStG § 62 Abs. 1a",
        text: "Begründet ein Staatsangehöriger eines anderen Mitgliedstaates der Europäischen Union oder eines Staates, auf den das Abkommen über den Europäischen Wirtschaftsraum Anwendung findet, im Inland einen Wohnsitz oder gewöhnlichen Aufenthalt, so hat er für die ersten drei Monate ab Begründung des Wohnsitzes oder des gewöhnlichen Aufenthalts keinen Anspruch auf Kindergeld. Dies gilt nicht, wenn er nachweist, dass er inländische Einkünfte im Sinne des § 2 Absatz 1 Satz 1 Nummer 1 bis 4 mit Ausnahme von Einkünften nach § 19 Absatz 1 Satz 1 Nummer 2 erzielt.",
      },
      {
        key: "estg-62-2",
        locator: "EStG § 62 Abs. 2",
        text: "Ein nicht freizügigkeitsberechtigter Ausländer erhält Kindergeld nur, wenn er eine der in § 62 Absatz 2 EStG genannten aufenthaltsrechtlichen Voraussetzungen erfüllt.",
      },
    ],
  },
  {
    key: "estg-63",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__63.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 63 Kinder",
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
        key: "estg-63-1",
        locator: "EStG § 63 Abs. 1",
        text: "Als Kinder werden berücksichtigt Kinder im Sinne des § 32 Absatz 1, vom Berechtigten in seinen Haushalt aufgenommene Kinder seines Ehegatten und vom Berechtigten in seinen Haushalt aufgenommene Enkel. § 32 Absatz 3 bis 5 gilt entsprechend. Voraussetzung für die Berücksichtigung ist die Identifizierung des Kindes durch die an dieses Kind vergebene Identifikationsnummer (§ 139b der Abgabenordnung). Ist das Kind nicht nach einem Steuergesetz steuerpflichtig, ist es in anderer geeigneter Weise zu identifizieren. Kinder, die weder einen Wohnsitz noch ihren gewöhnlichen Aufenthalt im Inland, in einem Mitgliedstaat der Europäischen Union oder in einem Staat, auf den das Abkommen über den Europäischen Wirtschaftsraum Anwendung findet, haben, werden nicht berücksichtigt, es sei denn, sie leben im Haushalt eines Berechtigten im Sinne des § 62 Absatz 1 Satz 1 Nummer 2 Buchstabe a.",
      },
    ],
  },
  {
    key: "estg-32",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__32.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 32 Kinder, Freibeträge für Kinder",
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
        key: "estg-32-1",
        locator: "EStG § 32 Abs. 1",
        text: "Kinder sind im ersten Grad mit dem Steuerpflichtigen verwandte Kinder und Pflegekinder, sofern der Steuerpflichtige sie nicht zu Erwerbszwecken in seinen Haushalt aufgenommen hat und das Obhuts- und Pflegeverhältnis zu den Eltern nicht mehr besteht.",
      },
      {
        key: "estg-32-3",
        locator: "EStG § 32 Abs. 3",
        text: "Ein Kind wird in dem Kalendermonat, in dem es lebend geboren wurde, und in jedem folgenden Kalendermonat, zu dessen Beginn es das 18. Lebensjahr noch nicht vollendet hat, berücksichtigt.",
      },
      {
        key: "estg-32-4",
        locator: "EStG § 32 Abs. 4",
        text: "Ein Kind, das das 18. Lebensjahr vollendet hat, wird berücksichtigt, wenn es noch nicht das 21. Lebensjahr vollendet hat, nicht in einem Beschäftigungsverhältnis steht und bei einer Agentur für Arbeit im Inland als Arbeitsuchender gemeldet ist, oder noch nicht das 25. Lebensjahr vollendet hat und für einen Beruf ausgebildet wird, sich in einer Übergangszeit von höchstens vier Monaten befindet, eine Berufsausbildung mangels Ausbildungsplatzes nicht beginnen oder fortsetzen kann oder einen gesetzlich genannten freiwilligen Dienst leistet, oder wegen einer vor Vollendung des 25. Lebensjahres eingetretenen Behinderung außerstande ist, sich selbst zu unterhalten. Nach Abschluss einer erstmaligen Berufsausbildung oder eines Erststudiums wird ein Kind in den Ausbildungsfällen nur berücksichtigt, wenn das Kind keiner Erwerbstätigkeit nachgeht; eine Erwerbstätigkeit mit bis zu 20 Stunden regelmäßiger wöchentlicher Arbeitszeit, ein Ausbildungsdienstverhältnis oder eine geringfügige Beschäftigung sind unschädlich.",
      },
    ],
  },
  {
    key: "estg-64",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__64.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 64 Zusammentreffen mehrerer Ansprüche",
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
        key: "estg-64-all",
        locator: "EStG § 64",
        text: "Für jedes Kind wird nur einem Berechtigten Kindergeld gezahlt. Bei mehreren Berechtigten wird das Kindergeld demjenigen gezahlt, der das Kind in seinen Haushalt aufgenommen hat. Ist ein Kind in den gemeinsamen Haushalt von Eltern, einem Elternteil und dessen Ehegatten, Pflegeeltern oder Großeltern aufgenommen worden, so bestimmen diese untereinander den Berechtigten. Lebt ein Kind im gemeinsamen Haushalt von Eltern und Großeltern, so wird das Kindergeld vorrangig einem Elternteil gezahlt; es wird an einen Großelternteil gezahlt, wenn der Elternteil gegenüber der zuständigen Stelle auf seinen Vorrang schriftlich verzichtet hat. Ist das Kind nicht in den Haushalt eines Berechtigten aufgenommen, so erhält das Kindergeld derjenige, der dem Kind eine Unterhaltsrente zahlt; bei mehreren Zahlenden derjenige mit der höchsten Unterhaltsrente.",
      },
    ],
  },
  {
    key: "estg-66",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__66.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 66 Höhe des Kindergeldes, Zahlungszeitraum",
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
        key: "estg-66-all",
        locator: "EStG § 66",
        text: "Das Kindergeld beträgt monatlich für jedes Kind 259 Euro. Das Kindergeld wird monatlich vom Beginn des Monats an gezahlt, in dem die Anspruchsvoraussetzungen erfüllt sind, bis zum Ende des Monats, in dem die Anspruchsvoraussetzungen wegfallen.",
      },
    ],
  },
  {
    key: "estg-67",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__67.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 67 Antrag",
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
        key: "estg-67-all",
        locator: "EStG § 67",
        text: "Das Kindergeld ist bei der zuständigen Familienkasse elektronisch nach amtlich vorgeschriebenem Datensatz über die amtlich vorgeschriebene Schnittstelle zu beantragen; die Familienkasse kann auf die elektronische Antragstellung verzichten, wenn das Kindergeld schriftlich beantragt und der Antrag vom Berechtigten eigenhändig unterschrieben wird. Den Antrag kann außer dem Berechtigten auch stellen, wer ein berechtigtes Interesse an der Leistung des Kindergeldes hat.",
      },
    ],
  },
  {
    key: "estg-70",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__70.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 70 Festsetzung und Zahlung des Kindergeldes",
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
        key: "estg-70-all",
        locator: "EStG § 70",
        text: "Das Kindergeld nach § 62 wird von den Familienkassen durch Bescheid festgesetzt und ausgezahlt. Die Auszahlung von festgesetztem Kindergeld erfolgt rückwirkend nur für die letzten sechs Monate vor Beginn des Monats, in dem der Antrag auf Kindergeld eingegangen ist. Der Anspruch auf Kindergeld nach § 62 bleibt von dieser Auszahlungsbeschränkung unberührt. Soweit in den Verhältnissen, die für den Anspruch auf Kindergeld erheblich sind, Änderungen eintreten, ist die Festsetzung des Kindergeldes mit Wirkung vom Zeitpunkt der Änderung der Verhältnisse aufzuheben oder zu ändern.",
      },
    ],
  },
  {
    key: "ba-kindergeld",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/infos-rund-um-kindergeld/kindergeld-anspruch-hoehe-dauer",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Kindergeld Anspruch, Höhe, Dauer",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-amount-process",
        locator: "Familienkasse Kindergeld-Übersicht",
        text: "Sie erhalten pro Kind 259 Euro Kindergeld im Monat. Die Zahlung von Kindergeld ist nicht von Ihrem Einkommen abhängig. Kindergeld erhält immer nur eine Person, in der Regel ein Elternteil. Bei mehreren Kindern werden die einzelnen Beträge als eine Summe ausgezahlt. Anträge auf Kindergeld sind immer kostenlos und können direkt bei der Familienkasse gestellt werden. Wenn Sie über eine Bund-ID verfügen, müssen Sie den Online-Antrag nicht mehr ausdrucken, sondern können diesen ohne Unterschrift direkt online an die Familienkasse übermitteln. Die Frist zur rückwirkenden Zahlung von Kindergeld beträgt 6 Monate. Die Familienkasse prüft regelmäßig, ob die Voraussetzungen für die Zahlungen noch vorliegen. Sie haben die Möglichkeit, innerhalb eines Monats Einspruch beziehungsweise Widerspruch gegen den Bescheid einzulegen.",
      },
      {
        key: "ba-processing",
        locator: "Familienkasse FAQ Bearbeitung",
        text: "Sobald Ihr Kindergeld-Antrag bei uns eingegangen ist, prüfen wir, ob Ihre Unterlagen vollständig sind. Wenn Angaben oder Belege fehlen, rufen wir Sie an oder schreiben Ihnen. Es kann auch sein, dass wir noch weitere Angaben von Ihnen, von dritten Personen oder Ämtern benötigen. Haben Sie nach 6 Wochen noch nichts von uns gehört, können Sie sich telefonisch nach dem Stand der Bearbeitung erkundigen. Wenn die Bearbeitung länger dauert, ändert das nichts an der Höhe Ihrer Kindergeldzahlung.",
      },
      {
        key: "ba-review-questionnaire",
        locator: "Familienkasse FAQ Prüfung",
        text: "Die Familienkasse prüft regelmäßig, ob die Voraussetzungen für die Zahlungen noch vorliegen. Sie erhalten dazu einen Fragebogen. Sollte eine Bescheinigung notwendig sein, liegt dem Schreiben der Familienkasse meist ein entsprechender Vordruck bei. Antworten Sie der Familienkasse bitte innerhalb der genannten Frist. Wenn Sie mehr Zeit benötigen, informieren Sie uns bitte.",
      },
      {
        key: "ba-remedy-and-overpayment",
        locator: "Familienkasse FAQ Bescheid und Überzahlung",
        text: "Am Ende eines Kindergeld-Bescheids werden Sie über Ihre Rechte informiert (Rechtsbehelfsbelehrung). Sie haben die Möglichkeit, innerhalb eines Monats Einspruch beziehungsweise Widerspruch gegen den Bescheid einzulegen. Zu viel erhaltenes Geld, eine sogenannte Überzahlung, müssen Sie zurückzahlen. Sie erhalten in einem solchen Fall einen Aufhebungs- und Erstattungsbescheid. Wichtig: Überweisen Sie das Geld nicht einfach zurück! Warten Sie bitte unser Schreiben ab, in dem wir Sie zur Rückzahlung auffordern.",
      },
      {
        key: "ba-child-tax-id-birth",
        locator: "Familienkasse FAQ Steueridentifikationsnummer",
        text: "Die Familienkasse hat vom Bundeszentralamt für Steuern (BZSt) nach der Geburt Ihres Kindes die Steueridentifikationsnummer für Ihr Kind und die entsprechenden Daten automatisch erhalten.",
      },
    ],
  },
  {
    key: "ba-merkblatt",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/datei/kg2-merkblattkindergeld_ba034475.pdf",
    officialDomain: "www.arbeitsagentur.de",
    title: "Merkblatt Kindergeld (KG2)",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "merkblatt-process",
        locator: "Merkblatt Kindergeld KG2",
        text: "Das Kindergeld wird bei der Familienkasse beantragt und auch von dieser ausgezahlt. Das Bundeszentralamt für Steuern (BZSt) beaufsichtigt die Familienkassen. Das Kindergeld beträgt ab 1. Januar 2026 für jedes anspruchsberechtigte Kind monatlich 259 Euro. Der einfachste und schnellste Weg zum Kindergeld ist der Online-Antrag unter www.familienkasse.de. Nach erfolgreicher Identifizierung durch die BundID werden die Daten elektronisch an die Familienkasse übertragen. Ohne elektronische Identifikation muss der Kindergeldantrag ausgedruckt, unterschrieben und per Post übermittelt werden. Ein mündlicher Antrag oder eine Übersendung per E-Mail ist nicht möglich. Ein Kind ist in den Haushalt aufgenommen, wenn es ständig in der gemeinsamen Familienwohnung lebt und dort versorgt und betreut wird; eine bloße Anmeldung bei der Meldebehörde reicht nicht. Der Kindergeldberechtigte hat Änderungen mitzuteilen. Vergleichbare kindbezogene Leistungen aus dem Ausland können den deutschen Kindergeldanspruch ausschließen; für niedrigere Familienleistungen eines anderen EU-/EWR-Staats oder der Schweiz kann Differenzkindergeld in Betracht kommen.",
      },
      {
        key: "merkblatt-application",
        locator: "Merkblatt Kindergeld Punkt 8",
        text: "Das Kindergeld muss immer schriftlich beantragt werden. Hierzu gibt es den Kindergeldantrag. Für jedes Kind, für das Kindergeld beantragt wird, muss eine Anlage Kind ausgefüllt werden. Bei der Online-Beantragung ist die Anlage Kind bereits im Hauptantrag enthalten und muss nicht zusätzlich beigefügt werden. Das BZSt übermittelt bei Vergabe der steuerlichen Identifikationsnummer bei Geburt eines Kindes bereits einige personenbezogene Daten an die Familienkasse. Diese versendet anschließend ein Schreiben an das neugeborene Kind für einen möglichen Kindergeldantrag. Das Schreiben enthält unter anderem persönliche Zugangsdaten für eine schnellere Online-Beantragung. Zuständig ist in erster Linie die Familienkasse, in deren Bezirk Sie wohnen oder Ihren gewöhnlichen Aufenthalt haben. In Deutschland gibt es zwei gesetzliche Grundlagen für den Anspruch auf Kindergeld: das Einkommensteuergesetz (EStG) und das Bundeskindergeldgesetz (BKGG). Voraussetzung für den Anspruch ist, dass der Berechtigte durch die an ihn vergebene steuerliche Identifikationsnummer identifiziert ist. Die Familienkasse fragt sie beim Berechtigten ab oder ermittelt diese Nummer bei Nichtvorliegen gegebenenfalls selbst.",
      },
      {
        key: "merkblatt-competence",
        locator: "Merkblatt Kindergeld Punkt 8 Zuständigkeit",
        text: "Zuständig ist in erster Linie die Familienkasse, in deren Bezirk Sie wohnen oder Ihren gewöhnlichen Aufenthalt haben. Für Sie ist eine bestimmte Familienkasse und nicht unbedingt die Familienkasse in Ihrer Nähe zuständig, wenn Ihr Wohnsitz oder der Wohnsitz des anderen Elternteils nicht in Deutschland, sondern in einem anderen Staat der EU, des EWR oder in der Schweiz ist, Sie oder der andere Elternteil dort eine Beschäftigung ausüben oder Sie von dort Rente beziehen. Diese abweichenden Zuständigkeitsregelungen sind dem Merkblatt über Kindergeld in grenzüberschreitenden Fällen zu entnehmen und ohne die dort genannten Angaben nicht aus dem Wohnsitz allein festzustellen. Daten bestimmter Personengruppen unterliegen einem besonderen Schutz. In diesen Fällen ist in der Regel der Zentrale Kindergeldservice zuständig, so auch, wenn Kindergeld für ein Kind mit Behinderung beantragt oder bezogen wird oder eine Beschäftigung im öffentlichen Dienst im Bereich des Bundes vorliegt.",
      },
      {
        key: "merkblatt-evidence",
        locator: "Merkblatt Kindergeld Punkt 9",
        text: "Beim Antrag auf Kindergeld müssen Sie bestimmte Angaben nachweisen. Für über 18 Jahre alte Kinder sind fallbezogene Nachweise notwendig, zum Beispiel Schul-, Hochschul- oder Ausbildungsbescheinigungen, Nachweise zur Arbeits- oder Ausbildungssuche oder Bescheinigungen über einen Freiwilligendienst. Sollten im Einzelfall weitere Auskünfte oder Nachweise erforderlich sein, wird sich die Familienkasse mit Ihnen in Verbindung setzen. Nachweise können über das Online-Portal der Familienkasse per Upload eingereicht werden. Falls Sie die erforderlichen Nachweise per Post schicken, reichen Sie bitte nach Möglichkeit keine Originale, sondern nur Kopien ein.",
      },
      {
        key: "merkblatt-changes",
        locator: "Merkblatt Kindergeld Punkt 10",
        text: "Wer Kindergeld beantragt oder erhält, muss der zuständigen Familienkasse unverzüglich alle Änderungen in den Verhältnissen mitteilen, die für den Kindergeldanspruch wichtig sind. Es reicht nicht, wenn Sie solche Änderungen anderen Behörden, zum Beispiel der Gemeindeverwaltung, dem Einwohnermeldeamt oder dem Finanzamt, einer anderen Stelle der Bundesagentur für Arbeit oder Ihrem Arbeitgeber mitteilen. Veränderungen sind auch mitzuteilen, wenn über Ihren Antrag noch nicht entschieden wurde. Beispiele sind Änderungen der Anschrift oder Bankverbindung, Trennung, Verlassen des Haushalts durch ein Kind, Aufnahme einer Beschäftigung im Ausland, Bezug einer anderen kindbezogenen Leistung sowie Wechsel, Unterbrechung oder Ende von Schule, Ausbildung, Studium oder Freiwilligendienst bei einem volljährigen Kind. Die Beispiele ersetzen keine Prüfung, ob eine konkrete Veränderung erheblich ist; im Zweifel ist bei der Familienkasse nachzufragen.",
      },
      {
        key: "merkblatt-decision-remedy",
        locator: "Merkblatt Kindergeld Punkte 11 und 12",
        text: "Nachdem Sie Ihren Antrag eingereicht haben, entscheidet Ihre Familienkasse, ob Sie Anspruch auf Kindergeld haben. Die Entscheidung wird Ihnen mit einem schriftlichen Bescheid mitgeteilt. Sollte Ihnen kein Kindergeld zustehen oder sollten Sie bereits ausgezahltes Kindergeld zurückzahlen müssen, erhalten Sie ebenfalls einen schriftlichen Bescheid. Falls Sie mit der Entscheidung nicht einverstanden sind, können Sie Einspruch beim Kindergeld nach dem EStG beziehungsweise Widerspruch beim Kindergeld nach dem BKGG einlegen. Nach Bekanntgabe der Entscheidung muss der Einspruch beziehungsweise Widerspruch innerhalb eines Monats bei der Familienkasse eingehen. Die Rechtsbehelfsbelehrung des konkreten Bescheids ist für den zulässigen Rechtsbehelf und die Frist maßgebend.",
      },
      {
        key: "merkblatt-repayment",
        locator: "Merkblatt Kindergeld Punkt 13",
        text: "Wenn Sie zu Unrecht Kindergeld erhalten haben, müssen Sie dieses zurückzahlen, unabhängig davon, ob Sie dies verschuldet haben. Über die Rückforderung werden Sie schriftlich durch einen Bescheid der Familienkasse informiert. Der Rückforderungsbetrag wird in einer Summe und einen Monat nach Bekanntgabe des Bescheides zur Zahlung fällig. Ein Einspruch gegen den Rückforderungsbescheid schiebt die Verpflichtung zur Rückzahlung zum genannten Termin nicht auf.",
      },
      {
        key: "merkblatt-payment",
        locator: "Merkblatt Kindergeld Punkt 15.1",
        text: "Die Familienkasse zahlt das Kindergeld monatlich. Der Zeitpunkt der Auszahlung richtet sich nach der letzten Ziffer der Kindergeldnummer. Die Kindergeldnummer besteht aus insgesamt 11 Zeichen. Bei Endziffer 0 erfolgt die Zahlung zu Beginn des Monats, bei Endziffer 9 am Ende des Monats. Das Kindergeld wird unbar durch Überweisung gezahlt. Die aktuellen Überweisungstermine finden Sie online unter www.familienkasse.de.",
      },
    ],
  },
  {
    key: "estg-68",
    publisherKey: "bmj",
    url: "https://www.gesetze-im-internet.de/estg/__68.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 68 Besondere Mitwirkungspflichten",
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
        key: "estg-68-1",
        locator: "EStG § 68 Abs. 1",
        text: "Wer Kindergeld beantragt oder erhält, hat Änderungen in den Verhältnissen, die für die Leistung erheblich sind oder über die im Zusammenhang mit der Leistung Erklärungen abgegeben worden sind, unverzüglich der zuständigen Familienkasse mitzuteilen. Ein Kind, das das 18. Lebensjahr vollendet hat, ist auf Verlangen der Familienkasse verpflichtet, an der Aufklärung des für die Kindergeldzahlung maßgebenden Sachverhalts mitzuwirken.",
      },
    ],
  },
  {
    key: "ba-nachweise",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/infos-rund-um-kindergeld/nachweise-einreichen",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Nachweise und Bescheinigungen einreichen",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-nachweise-age-split",
        locator: "Familienkasse Nachweise Übersicht",
        text: "Ist Ihr Kind jünger als 18 Jahre, müssen Sie im Regelfall nur Ihre steuerliche Identifikationsnummer sowie die Ihres Kindes mitteilen. Ist Ihr Kind älter als 18 Jahre, benötigen wir zusätzliche Belege, zum Beispiel eine Praktikumsbestätigung oder Schulbescheinigung. Wenn Sie Kindergeld für ein Kind beantragen, das im Ausland geboren wurde oder dort lebt, legen Sie eine Kopie der ausländischen Geburtsurkunde oder eines anderen amtlichen Dokuments über die Geburt vor. Sie können die Nachweise direkt online an Ihre zuständige Familienkasse übermitteln. Falls wir weitere Nachweise benötigen, benachrichtigen wir Sie und teilen Ihnen mit, bis wann Sie die fehlenden Dokumente vorlegen müssen. Geben Sie die benötigten Unterlagen innerhalb der genannten Frist ab. Ansonsten kann sich Ihr Antrag verzögern oder abgelehnt werden.",
      },
      {
        key: "ba-nachweise-adult-cases",
        locator: "Familienkasse Nachweise ab 18",
        text: "Für eine betriebliche Ausbildung ist ein Nachweis über Art und Dauer der Ausbildung erforderlich, zum Beispiel eine Kopie des Ausbildungsvertrags. Für schulische Ausbildung oder Schule ist eine Schulbescheinigung oder eine Bescheinigung der Schule zu verwenden. Für ein Studium genügt zu Beginn zum Beispiel eine Immatrikulationsbescheinigung; weitere Nachweise sind erst nach schriftlicher Aufforderung vorzulegen. Bei fehlendem Ausbildungs- oder Arbeitsplatz sind fallbezogene Nachweise erforderlich, etwa die Erklärung für ein Kind ohne Ausbildungs- oder Arbeitsplatz und eine Meldung bei der Agentur für Arbeit oder dem Jobcenter beziehungsweise Bewerbungsunterlagen. Für ein Praktikum oder einen Freiwilligendienst ist eine Bescheinigung über Art und Dauer beziehungsweise eine Trägerbescheinigung vorzulegen. Diese Nachweise gelten nicht pauschal für Kinder unter 18 Jahren.",
      },
    ],
  },
  {
    key: "ba-veraenderungen",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/veraenderungen-mitteilen",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Veränderungen mitteilen",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-veraenderungen-direct",
        locator: "Familienkasse Veränderungen direkt mitteilen",
        text: "Bestimmte Änderungen bei Ihnen oder Ihrem Kind können sich darauf auswirken, ob und in welcher Höhe Sie weiterhin Kindergeld erhalten. Auch Änderungen der Bankverbindung oder Wohnadresse sind wichtig. Sie müssen der Familienkasse alle Änderungen direkt mitteilen. Es genügt nicht, eine andere Behörde, zum Beispiel das Einwohnermeldeamt, das Jobcenter oder die Agentur für Arbeit zu informieren. Beispiele bei einem Kind unter 18 Jahren sind dauerhafte Trennung oder Scheidung, Verlassen des Haushalts, eine andere kindbezogene Leistung einschließlich ausländischer Familienbeihilfe, Beschäftigung im öffentlichen Dienst von voraussichtlich mehr als sechs Monaten sowie Wegzug, Vermisstenmeldung oder Tod des Kindes. Bei einem volljährigen Kind sind Wechsel, Unterbrechung, Ende oder Abbruch von Schule, Ausbildung oder Studium sowie die Aufnahme einer Erwerbstätigkeit oder eines Freiwilligendienstes mitzuteilen. Weitere Beispiele enthält das Merkblatt Kindergeld; die Aufzählung ist nicht als geschlossene gesetzliche Liste zu lesen.",
      },
    ],
  },
  {
    key: "ba-ab-18",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/infos-rund-um-kindergeld/kindergeld-ab-18-jahren",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Kindergeld ab 18 Jahren",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-ab-18-route",
        locator: "Familienkasse Kindergeld ab 18",
        text: "Kindergeld wird für junge Erwachsene zwischen dem 18. und vollendeten 25. Lebensjahr unter anderem bei erstmaliger Schul- oder Berufsausbildung oder einem Studium, in einer Übergangszeit von höchstens vier Monaten, bei einem fachlich bezogenen Praktikum, bei einem Freiwilligendienst, bei nachgewiesener Suche nach einem Ausbildungsplatz oder bei Arbeitsuche bis zum 21. Lebensjahr gezahlt. Wenn Sie Kindergeld für Kinder ab 18 Jahren beantragen, müssen Sie die aktuelle Lebenssituation Ihres Kindes belegen. Wenn Ihr Kind die Voraussetzungen erfüllt, können Sie den Kindergeld-Antrag ab 18 Jahren direkt online einreichen. Mit Bund-ID kann der Online-Antrag ohne Unterschrift übermittelt werden; ohne elektronische Identifikation bleibt der schriftliche Weg möglich. Auch Änderungen bei Ihrem Kind müssen Sie der Familienkasse mitteilen.",
      },
    ],
  },
  {
    key: "ba-eservices",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/eservices-fuer-familien",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: eServices für Familien",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ONLINE_SERVICE_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-eservices-routes",
        locator: "Familienkasse eServices",
        text: "Mit dem Profil für die Familienkasse im Konto der Bundesagentur für Arbeit können Änderungen und Anträge per eService online an die Familienkasse geschickt werden. Im Gegensatz zu einer E-Mail erfolgt dies über einen geschützten Online-Weg. Für ein neugeborenes Kind kann der Kindergeld-Antrag online gestellt werden; benötigt werden das Konto im BA-Portal, die Steuer-ID der antragstellenden Person und die Steuer-ID des neugeborenen Kindes. Den Antrag für Kindergeld ab 18 können Sie mit Ihrem Konto vollständig online stellen und weitere Unterlagen digital einreichen. Nachweise können als Foto oder PDF hochgeladen oder nachgereicht werden. Adresse und Bankverbindung können im Familienkassen-Profil geändert werden. Bescheide können online empfangen werden.",
      },
    ],
  },
  {
    key: "ba-formulare",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/downloads-familie-und-kinder/formulare-kindergeld",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Merkblätter und Formulare zum Kindergeldantrag",
    sourceClass: "OFFICIAL_FORM",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-formulare-kg1",
        locator: "Familienkasse Formulare Kindergeld",
        text: "Der Kindergeld-Antrag kann online ab Geburt oder ab 18 Jahren gestellt werden. Mit Bund-ID muss der Online-Antrag nicht ausgedruckt und unterschrieben werden. Alternativ können die Antragsformulare als PDF heruntergeladen und ausgefüllt werden. Der Antrag auf Kindergeld (KG1) ist der Hauptantrag. Die Anlage Kind zum Hauptantrag (KG1-AnK) ist die Ergänzung, die für jedes Kind, für das Kindergeld beantragt wird, einzureichen ist. Die Anlage Ausland (KG 51) ist das Formular für Familien, bei denen mindestens ein Elternteil oder Kind im Ausland wohnt; sie begründet für sich keine Feststellung, welcher Staat vorrangig leistet.",
      },
    ],
  },
  {
    key: "ba-formulare-ab-18",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/downloads-familie-und-kinder/formulare-kindergeld-ab-18",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Formulare für den Kindergeldantrag ab 18",
    sourceClass: "OFFICIAL_FORM",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-formulare-ab-18-list",
        locator: "Familienkasse Formulare ab 18",
        text: "Für den Kindergeldantrag ab 18 stehen der Hauptantrag KG1 und die Anlage Kind zur Verfügung. Zusätzliche Vordrucke wie die Schulbescheinigung (KG 5a), die Erklärung zum Ausbildungsverhältnis (KG 5b), die Erklärung zur Hochschulausbildung (KG 7e), die Erklärung zum Praktikum (KG 10) oder die Erklärung für ein Kind ohne Ausbildungs- oder Arbeitsplatz (KG 11a) sind nur bei der jeweils zutreffenden Lebenssituation des volljährigen Kindes zu verwenden und nicht allgemein für Kinder unter 18 Jahren erforderlich.",
      },
    ],
  },
  {
    key: "ba-auszahlung",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/auszahlungstermine",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Auszahlungstermine Kindergeld",
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
        key: "ba-auszahlung-rule",
        locator: "Familienkasse Auszahlung nach Endziffer",
        text: "Die letzte Zahl der Kindergeldnummer, die Endziffer, entscheidet darüber, wann Kindergeld überwiesen wird. Kundinnen oder Kunden mit der Endziffer 0 erhalten die Zahlung am Monatsbeginn, mit der Endziffer 9 am Monatsende. Die konkreten Kalendertage ergeben sich aus der jeweils aktuellen amtlichen Übersicht der Familienkasse und sind kein zeitloser Rechtsanspruch. An Wochenenden und Feiertagen kann sich der Geldeingang verschieben. Es besteht kein Rechtsanspruch darauf, dass die Leistung an einem bestimmten Tag des Monats überwiesen wird. Kindergeld wird überwiesen und kann nicht bar ausgezahlt werden. Bei der Erstauszahlung erhalten Sie den vollen Monatsbetrag, auch wenn der Anspruch nur am letzten Tag des Monats erfüllt ist.",
      },
    ],
  },
  {
    key: "ba-rueckzahlung",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/kindergeld-kinderzuschlag-zurueckzahlen",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Kindergeld zurückzahlen",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-rueckzahlung-bescheid",
        locator: "Familienkasse Überzahlung",
        text: "Bei einer Überzahlung von Kindergeld erhalten Sie von der Familienkasse einen Aufhebungs- und Erstattungsbescheid. Darin erfahren Sie, warum Sie Geld zurückzahlen müssen, wie viel Geld Sie zurückzahlen müssen und bis wann Sie die Forderung begleichen müssen. Prüfen Sie den Bescheid sorgfältig. Warten Sie den Bescheid der Familienkasse ab. Er enthält die genaue Höhe der Überzahlung und den Verwendungszweck für Ihre Überweisung. Eine Überzahlung bedeutet für sich genommen weder Vorsatz noch eine Straftat; Grund, Betrag und Frist ergeben sich aus dem konkreten Bescheid.",
      },
    ],
  },
  {
    key: "kg1-form",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/datei/kg1-antrag-kindergeld_ba036550.pdf",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Antrag auf Kindergeld (KG1)",
    sourceClass: "OFFICIAL_FORM",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "kg1-instructions",
        locator: "KG1 Ausfüllhinweise",
        text: "Bitte fügen Sie für jedes Kind, für das Kindergeld beantragt wird, eine Anlage Kind bei. Beim Antrag aufgrund der Geburt eines in Deutschland geborenen Kindes ist die Geburtsbescheinigung für Kindergeld oder die Geburtsurkunde nur auf Anfrage der Familienkasse vorzulegen. Bei einem im Ausland geborenen Kind ist durch amtliche Dokumente, zum Beispiel eine ausländische Geburtsurkunde, das Kindschaftsverhältnis nachzuweisen. Für über 18 Jahre alte Kinder ist die Anlage nur auszufüllen, wenn sie eine der im Merkblatt genannten besonderen Voraussetzungen erfüllen; entsprechende Nachweise sind beizufügen. Sollten Sie Ihre steuerliche Identifikationsnummer in den genannten Unterlagen nicht finden, können Sie über das Internetportal des Bundeszentralamtes für Steuern um erneute Zusendung bitten.",
      },
    ],
  },
  {
    key: "ba-zkgs",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/zentraler-kindergeldservice",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Zentraler Kindergeldservice",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-zkgs-competence",
        locator: "Familienkasse Zentraler Kindergeldservice",
        text: "Der Zentrale Kindergeldservice ist für Kindergeldanträge zuständig, wenn Kindergeld für Kinder mit Behinderungen bezogen wird oder wenn die Daten besonders geschützt werden müssen, zum Beispiel weil durch die Weitergabe der Daten eine Gefahr für die betroffene Person oder Angehörige entstehen könnte und deshalb eine Auskunftssperre besteht. Der ZKGS ist außerdem verantwortlich für das Kindergeld von Beschäftigten des öffentlichen Dienstes im Bereich des Bundes. Das betrifft alle Fälle, in denen entweder die Kindergeldberechtigten selbst oder Elternteile Beschäftigte der genannten Einrichtung sind.",
      },
    ],
  },
  {
    key: "ba-disability-competence",
    publisherKey: "familienkasse",
    url: "https://www.arbeitsagentur.de/familie-und-kinder/infos-rund-um-kindergeld/kindergeld-fuer-kinder-mit-behinderung",
    officialDomain: "www.arbeitsagentur.de",
    title: "Familienkasse: Kindergeld für Menschen mit Behinderung",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-disability-zkgs",
        locator: "Familienkasse Kindergeld bei Behinderung Zuständigkeit",
        text: "Für das Kindergeld für Menschen mit Behinderung sind aufgrund der besonders schützenswerten Daten nicht die regionalen Familienkassen zuständig, sondern der Zentrale Kindergeldservice. Wenn Sie den Antrag per Post einreichen möchten, senden Sie die ausgefüllten und unterschriebenen Formulare bitte dorthin.",
      },
    ],
  },
]);

export const KINDERGELD_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/kindergeld-ohne-antrag.html",
  officialDomain: "www.bundesfinanzministerium.de",
  title: "BMF: Kindergeld wird künftig ohne Antrag ausgezahlt",
});

export const KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS: readonly KindergeldFutureChangeWatchItem[] = Object.freeze([
  {
    id: "kindergeld-future-watch:antragslos-not-applicable-2026",
    key: "antragslos-not-applicable-2026",
    officialSourceUrl: KINDERGELD_FUTURE_WATCH_SOURCE.url,
    officialDomain: KINDERGELD_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: KINDERGELD_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Das antragslose Kindergeld ist nach amtlicher Darstellung des BMF für 2027 vorgesehen und ist nicht das geltende Antragsverfahren 2026.",
  },
  {
    id: "kindergeld-future-watch:antragslos-two-stage-2027",
    key: "antragslos-two-stage-2027",
    officialSourceUrl: KINDERGELD_FUTURE_WATCH_SOURCE.url,
    officialDomain: KINDERGELD_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: KINDERGELD_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "BMF beschreibt eine zweistufige antragslose Auszahlung im Jahr 2027. Das ist kein im Jahr 2026 geltendes Verfahren.",
  },
  {
    id: "kindergeld-future-watch:antragslos-fallback-letter",
    key: "antragslos-fallback-letter",
    officialSourceUrl: KINDERGELD_FUTURE_WATCH_SOURCE.url,
    officialDomain: KINDERGELD_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: KINDERGELD_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Fehlen 2027 die Voraussetzungen der antraglosen Auszahlung, sollen Eltern laut BMF ein Begrüßungsschreiben erhalten. Das ersetzt das Antragsverfahren 2026 nicht.",
  },
]);

export const KINDERGELD_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "eligible-person-residence-or-unlimited-tax", category: "entitlement", temporal: "current_2026", type: "definition", text: "Anspruch auf Kindergeld nach dem EStG hat, wer für ein Kind im Sinne des § 63 EStG im Inland einen Wohnsitz oder gewöhnlichen Aufenthalt hat oder ohne inländischen Wohnsitz unbeschränkt einkommensteuerpflichtig ist oder als unbeschränkt einkommensteuerpflichtig behandelt wird.", sourceKey: "estg-62", passageKey: "estg-62-1", riskLevel: "medium" },
  { key: "claimant-tax-id-required", category: "identification", temporal: "current_2026", type: "duty", text: "Voraussetzung für den Kindergeldanspruch nach § 62 Absatz 1 EStG ist die Identifizierung des Berechtigten durch die an ihn vergebene Identifikationsnummer nach § 139b AO.", sourceKey: "estg-62", passageKey: "estg-62-1", riskLevel: "medium" },
  { key: "claimant-tax-id-retroactive", category: "identification", temporal: "current_2026", type: "procedure", text: "Die nachträgliche Vergabe der Identifikationsnummer des Berechtigten wirkt auf Monate zurück, in denen die übrigen Anspruchsvoraussetzungen des § 62 Absatz 1 Satz 1 EStG vorlagen.", sourceKey: "estg-62", passageKey: "estg-62-1", riskLevel: "low" },
  { key: "non-free-movement-residence-title", category: "entitlement", temporal: "current_2026", type: "exception", text: "Ein nicht freizügigkeitsberechtigter Ausländer erhält Kindergeld nur, wenn eine der in § 62 Absatz 2 EStG genannten aufenthaltsrechtlichen Voraussetzungen vorliegt.", sourceKey: "estg-62", passageKey: "estg-62-2", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "children-considered-categories", category: "child_category", temporal: "current_2026", type: "definition", text: "Als Kinder werden nach § 63 EStG berücksichtigt: Kinder im Sinne des § 32 Absatz 1 EStG, in den Haushalt aufgenommene Kinder des Ehegatten und in den Haushalt aufgenommene Enkel.", sourceKey: "estg-63", passageKey: "estg-63-1", riskLevel: "medium" },
  { key: "first-degree-and-foster-children", category: "child_category", temporal: "current_2026", type: "definition", text: "Kinder im Sinne des § 32 Absatz 1 EStG sind im ersten Grad verwandte Kinder sowie Pflegekinder, die nicht zu Erwerbszwecken aufgenommen wurden und zu denen das Obhuts- und Pflegeverhältnis der Eltern nicht mehr besteht.", sourceKey: "estg-32", passageKey: "estg-32-1", riskLevel: "medium" },
  { key: "child-tax-id-required", category: "identification", temporal: "current_2026", type: "duty", text: "Ein Kind wird für das Kindergeld nach § 63 EStG nur berücksichtigt, wenn es durch die an das Kind vergebene Identifikationsnummer identifiziert ist oder, falls es nicht steuerpflichtig ist, in anderer geeigneter Weise identifiziert wird.", sourceKey: "estg-63", passageKey: "estg-63-1", riskLevel: "medium" },
  { key: "child-until-18", category: "child_category", temporal: "current_2026", type: "definition", text: "Ein Kind wird in dem Kalendermonat der Lebendgeburt und in jedem folgenden Kalendermonat berücksichtigt, zu dessen Beginn es das 18. Lebensjahr noch nicht vollendet hat.", sourceKey: "estg-32", passageKey: "estg-32-3", riskLevel: "low" },
  { key: "adult-job-seeking-until-21", category: "adult_child", temporal: "current_2026", type: "definition", text: "Ein volljähriges Kind wird bis zur Vollendung des 21. Lebensjahres berücksichtigt, wenn es in keinem Beschäftigungsverhältnis steht und bei einer Agentur für Arbeit im Inland als Arbeitsuchender gemeldet ist.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "medium" },
  { key: "adult-training-until-25", category: "adult_child", temporal: "current_2026", type: "definition", text: "Ein volljähriges Kind wird bis zur Vollendung des 25. Lebensjahres berücksichtigt, wenn es für einen Beruf ausgebildet wird.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "medium" },
  { key: "adult-transition-four-months", category: "adult_child", temporal: "current_2026", type: "definition", text: "Ein volljähriges Kind kann bis zur Vollendung des 25. Lebensjahres in einer Übergangszeit von höchstens vier Monaten zwischen Ausbildungsabschnitten oder zwischen Ausbildung und einem gesetzlich genannten Dienst berücksichtigt werden.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "medium" },
  { key: "adult-seeking-apprenticeship", category: "adult_child", temporal: "current_2026", type: "definition", text: "Ein volljähriges Kind wird bis zur Vollendung des 25. Lebensjahres berücksichtigt, wenn es eine Berufsausbildung mangels Ausbildungsplatzes nicht beginnen oder fortsetzen kann.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "medium" },
  { key: "adult-voluntary-service", category: "adult_child", temporal: "current_2026", type: "definition", text: "Ein volljähriges Kind wird bis zur Vollendung des 25. Lebensjahres berücksichtigt, wenn es einen der in § 32 Absatz 4 Satz 1 Nummer 2 Buchstabe d EStG genannten freiwilligen Dienste leistet.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "medium" },
  { key: "adult-disability-before-25", category: "adult_child", temporal: "current_2026", type: "definition", text: "Ein volljähriges Kind wird ohne Altersgrenze nach § 32 Absatz 4 Satz 1 Nummer 3 EStG berücksichtigt, wenn es wegen einer vor Vollendung des 25. Lebensjahres eingetretenen Behinderung außerstande ist, sich selbst zu unterhalten.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "adult-after-first-training-employment-limit", category: "adult_child", temporal: "current_2026", type: "exception", text: "Nach Abschluss einer erstmaligen Berufsausbildung oder eines Erststudiums wird ein Kind in den Ausbildungsfällen des § 32 Absatz 4 Satz 1 Nummer 2 EStG nur berücksichtigt, wenn es keiner schädlichen Erwerbstätigkeit nachgeht; bis zu 20 Wochenstunden, ein Ausbildungsdienstverhältnis oder eine geringfügige Beschäftigung sind unschädlich.", sourceKey: "estg-32", passageKey: "estg-32-4", riskLevel: "medium" },
  { key: "one-recipient-principle", category: "recipient", temporal: "current_2026", type: "duty", text: "Für jedes Kind wird nur einem Berechtigten Kindergeld gezahlt.", sourceKey: "estg-64", passageKey: "estg-64-all", riskLevel: "low" },
  { key: "household-priority", category: "recipient", temporal: "current_2026", type: "procedure", text: "Bei mehreren Berechtigten wird das Kindergeld demjenigen gezahlt, der das Kind in seinen Haushalt aufgenommen hat.", sourceKey: "estg-64", passageKey: "estg-64-all", riskLevel: "medium" },
  { key: "joint-household-determination", category: "recipient", temporal: "current_2026", type: "procedure", text: "Ist ein Kind in den gemeinsamen Haushalt von Eltern, einem Elternteil und dessen Ehegatten, Pflegeeltern oder Großeltern aufgenommen, bestimmen diese untereinander den Kindergeldberechtigten.", sourceKey: "estg-64", passageKey: "estg-64-all", riskLevel: "medium" },
  { key: "parent-before-grandparent", category: "recipient", temporal: "current_2026", type: "procedure", text: "Lebt ein Kind im gemeinsamen Haushalt von Eltern und Großeltern, wird das Kindergeld vorrangig einem Elternteil gezahlt; ein Großelternteil erhält es nur, wenn der Elternteil gegenüber der zuständigen Stelle schriftlich auf seinen Vorrang verzichtet.", sourceKey: "estg-64", passageKey: "estg-64-all", riskLevel: "medium" },
  { key: "maintenance-payor-if-no-household", category: "recipient", temporal: "current_2026", type: "procedure", text: "Ist das Kind nicht in den Haushalt eines Berechtigten aufgenommen, erhält das Kindergeld, wer dem Kind eine Unterhaltsrente zahlt; bei mehreren Zahlenden derjenige mit der höchsten Unterhaltsrente.", sourceKey: "estg-64", passageKey: "estg-64-all", riskLevel: "medium" },
  { key: "household-means-actual-care", category: "recipient", temporal: "current_2026", type: "definition", text: "Ein Kind ist in den Haushalt aufgenommen, wenn es ständig in der gemeinsamen Familienwohnung lebt und dort versorgt und betreut wird; die bloße melderechtliche Anmeldung reicht nicht.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "medium" },
  { key: "amount-259-from-2026", category: "amount_payment", temporal: "current_2026", type: "definition", text: "Das Kindergeld beträgt ab dem 1. Januar 2026 monatlich 259 Euro für jedes anspruchsberechtigte Kind.", sourceKey: "estg-66", passageKey: "estg-66-all", riskLevel: "low" },
  { key: "payment-month-window", category: "amount_payment", temporal: "current_2026", type: "procedure", text: "Das Kindergeld wird monatlich vom Beginn des Monats an gezahlt, in dem die Anspruchsvoraussetzungen erfüllt sind, bis zum Ende des Monats, in dem sie wegfallen.", sourceKey: "estg-66", passageKey: "estg-66-all", riskLevel: "low" },
  { key: "income-independent", category: "amount_payment", temporal: "current_2026", type: "definition", text: "Die Zahlung von Kindergeld nach den Angaben der Familienkasse ist nicht vom Einkommen des Berechtigten abhängig.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "low" },
  { key: "multiple-children-one-sum", category: "amount_payment", temporal: "current_2026", type: "procedure", text: "Bei mehreren Kindern werden die einzelnen Kindergeldbeträge als eine Summe ausgezahlt.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "low" },
  { key: "application-electronic-or-signed", category: "application_2026", temporal: "current_2026", type: "procedure", text: "Im geltenden Verfahren 2026 ist Kindergeld bei der zuständigen Familienkasse elektronisch über die amtlich vorgeschriebene Schnittstelle zu beantragen; die Familienkasse kann auf die elektronische Antragstellung verzichten, wenn schriftlich und eigenhändig unterschrieben beantragt wird.", sourceKey: "estg-67", passageKey: "estg-67-all", riskLevel: "medium" },
  { key: "application-legitimate-interest", category: "application_2026", temporal: "current_2026", type: "procedure", text: "Den Kindergeldantrag kann außer dem Berechtigten auch stellen, wer ein berechtigtes Interesse an der Leistung hat.", sourceKey: "estg-67", passageKey: "estg-67-all", riskLevel: "low" },
  { key: "application-online-bundid-or-post", category: "application_2026", temporal: "current_2026", type: "procedure", text: "Der aktuelle Antragsweg 2026 ist der Online-Antrag der Familienkasse; mit BundID kann er ohne Unterschrift übermittelt werden, ohne elektronische Identifikation muss er ausgedruckt, unterschrieben und per Post übersandt werden.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "low" },
  { key: "application-free-of-charge", category: "application_2026", temporal: "current_2026", type: "procedure", text: "Anträge auf Kindergeld sind bei der Familienkasse kostenlos zu stellen; gewerbliche Dritte entscheiden nicht über die Leistung.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "low" },
  { key: "no-oral-or-email-application", category: "application_2026", temporal: "current_2026", type: "exception", text: "Ein mündlicher Kindergeldantrag oder eine Antragstellung allein per E-Mail ist nach dem Merkblatt der Familienkasse nicht möglich.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "low" },
  { key: "familienkasse-decides-by-bescheid", category: "application_2026", temporal: "current_2026", type: "procedure", text: "Das Kindergeld nach § 62 EStG wird von den Familienkassen durch Bescheid festgesetzt und ausgezahlt; das Bundeszentralamt für Steuern beaufsichtigt die Familienkassen.", sourceKey: "estg-70", passageKey: "estg-70-all", riskLevel: "low" },
  { key: "retroactive-six-months", category: "application_2026", temporal: "current_2026", type: "deadline", text: "Festgesetztes Kindergeld wird rückwirkend nur für die letzten sechs Monate vor Beginn des Monats ausgezahlt, in dem der Antrag bei der Familienkasse eingegangen ist.", sourceKey: "estg-70", passageKey: "estg-70-all", riskLevel: "medium" },
  { key: "entitlement-survives-payment-limit", category: "application_2026", temporal: "current_2026", type: "definition", text: "Der Anspruch auf Kindergeld nach § 62 EStG bleibt von der sechsmonatigen Auszahlungsbeschränkung des § 70 Absatz 1 Satz 2 EStG unberührt.", sourceKey: "estg-70", passageKey: "estg-70-all", riskLevel: "medium" },
  { key: "changes-amend-from-change-date", category: "change_review", temporal: "current_2026", type: "duty", text: "Ändern sich die für den Kindergeldanspruch erheblichen Verhältnisse, ist die Festsetzung mit Wirkung vom Zeitpunkt der Änderung aufzuheben oder zu ändern.", sourceKey: "estg-70", passageKey: "estg-70-all", riskLevel: "medium" },
  { key: "regular-review-and-notification", category: "change_review", temporal: "current_2026", type: "duty", text: "Die Familienkasse prüft regelmäßig, ob die Voraussetzungen weiter vorliegen; der Berechtigte muss Änderungen mitteilen und Prüfschreiben fristgerecht beantworten.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "medium" },
  { key: "objection-one-month", category: "negative_decision", temporal: "current_2026", type: "procedure", text: "Beim Kindergeld nach dem EStG ist der Rechtsbehelf der Einspruch, beim Kindergeld nach dem BKGG der Widerspruch. Beide Verfahren sind nicht dasselbe. Die Rechtsbehelfsbelehrung des konkreten Bescheids bestimmt den zulässigen Rechtsbehelf und die Frist von einem Monat nach Bekanntgabe.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-decision-remedy", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "incomplete-facts-no-entitlement", category: "entitlement", temporal: "current_2026", type: "exception", text: "Unvollständige Angaben zu Kind, Alter, Verhältnis, antragstellender Person, Wohnsitz oder einem grenzüberschreitenden Sachverhalt erlauben keine abschließende Feststellung, dass Kindergeld zusteht; zunächst sind die anspruchsrelevanten Tatsachen zu klären.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "orientation-needs-material-facts", category: "entitlement", temporal: "current_2026", type: "procedure", text: "Vor der Wahl des Antragswegs sind mindestens Kindidentität, Alter, Verhältnis zum Kind, mögliche Empfangsperson, Wohnsitzkontext, bei Volljährigen der Ausbildungs- oder Statussachverhalt, ein etwaiger Auslandsbezug und ob bereits Kindergeld bezogen wird, festzustellen.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "medium" },
  { key: "kg1-is-main-application", category: "forms_documents", temporal: "current_2026", type: "definition", text: "Der amtliche Hauptantrag auf Kindergeld ist der Vordruck KG1; er dient der erstmaligen oder erneuten Antragstellung bei der Familienkasse im Verfahren 2026.", sourceKey: "ba-formulare", passageKey: "ba-formulare-kg1", riskLevel: "low" },
  { key: "anlage-kind-paper-vs-online", category: "forms_documents", temporal: "current_2026", type: "procedure", text: "Für jedes Kind, für das Kindergeld beantragt wird, ist auf dem Papierweg eine Anlage Kind (KG1-AnK) beizufügen; bei der Online-Beantragung ist die Anlage Kind bereits im Hauptantrag enthalten und muss nicht zusätzlich beigefügt werden.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-application", riskLevel: "low" },
  { key: "bundid-optional-not-exclusive", category: "application_2026", temporal: "current_2026", type: "procedure", text: "Die BundID ermöglicht die unterschriftslose Online-Übermittlung des Kindergeldantrags, ist aber nicht der einzige Antragsweg; ohne elektronische Identifikation bleibt der ausgedruckte, unterschriebene Postweg möglich.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "low" },
  { key: "under-18-regular-tax-ids-suffice", category: "evidence", temporal: "current_2026", type: "procedure", text: "Für ein Kind unter 18 Jahren sind im Regelfall nur die steuerlichen Identifikationsnummern der antragstellenden Person und des Kindes mitzuteilen; weitere Nachweise verlangt die Familienkasse nicht pauschal in jedem Fall.", sourceKey: "ba-nachweise", passageKey: "ba-nachweise-age-split", riskLevel: "medium" },
  { key: "birth-proof-inland-on-request-foreign-copy", category: "evidence", temporal: "current_2026", type: "procedure", text: "Bei Geburt eines in Deutschland geborenen Kindes ist die Geburtsurkunde oder Geburtsbescheinigung für Kindergeld nur auf Anfrage der Familienkasse vorzulegen; bei einem im Ausland geborenen oder dort lebenden Kind ist eine Kopie der ausländischen Geburtsurkunde oder eines anderen amtlichen Geburtsdokuments vorzulegen.", sourceKey: "kg1-form", passageKey: "kg1-instructions", riskLevel: "medium" },
  { key: "competent-familienkasse-is-residence-office", category: "competence", temporal: "current_2026", type: "procedure", text: "Im gewöhnlichen inländischen Fall ohne Sonderzuständigkeit und ohne Auslandsbezug ist in erster Linie die Familienkasse zuständig, in deren Bezirk die antragstellende Person wohnt oder ihren gewöhnlichen Aufenthalt hat. Der Wohnsitz allein macht diese Stelle nicht in jedem Fall zuständig.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-competence", riskLevel: "medium", requiredContextKeys: ["RESIDENCE_STATE", "PROCESS_VARIANT"] },
  { key: "zkgs-federal-public-service", category: "competence", temporal: "current_2026", type: "procedure", text: "Für das Kindergeld von Beschäftigten des öffentlichen Dienstes im Bereich des Bundes ist der Zentrale Kindergeldservice zuständig und nicht die örtliche Familienkasse am Wohnsitz.", sourceKey: "ba-zkgs", passageKey: "ba-zkgs-competence", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "zkgs-covers-berechtigte-or-parent", category: "competence", temporal: "current_2026", type: "definition", text: "Die Sonderzuständigkeit des Zentralen Kindergeldservice für den öffentlichen Dienst im Bereich des Bundes betrifft Fälle, in denen entweder die kindergeldberechtigte Person selbst oder ein Elternteil dort beschäftigt ist.", sourceKey: "ba-zkgs", passageKey: "ba-zkgs-competence", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "zkgs-protected-data-auskunftssperre", category: "competence", temporal: "current_2026", type: "procedure", text: "Müssen Kindergeld-Daten besonders geschützt werden, etwa weil durch ihre Weitergabe eine Gefahr entstehen könnte und deshalb eine Auskunftssperre besteht, ist nach der Familienkasse der Zentrale Kindergeldservice zuständig.", sourceKey: "ba-zkgs", passageKey: "ba-zkgs-competence", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "zkgs-disability-not-regional", category: "competence", temporal: "current_2026", type: "procedure", text: "Für Kindergeld für Menschen mit Behinderung sind aufgrund der besonders schützenswerten Daten nicht die regionalen Familienkassen zuständig, sondern der Zentrale Kindergeldservice.", sourceKey: "ba-disability-competence", passageKey: "ba-disability-zkgs", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "cross-border-competence-not-from-residence", category: "competence", temporal: "current_2026", type: "exception", text: "Liegt der Wohnsitz eines Elternteils in einem anderen EU-/EWR-Staat oder der Schweiz, arbeitet ein Elternteil dort oder wird von dort eine Rente bezogen, gilt nicht automatisch die wohnsitznahe Familienkasse; die abweichende Zuständigkeit bleibt ohne die grenzüberschreitenden Angaben unbeantwortet.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-competence", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "insufficient-facts-no-competent-office", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne Klärung, ob ein gewöhnlicher Inlandsfall, eine Sonderzuständigkeit des Zentralen Kindergeldservice oder ein Auslandsbezug vorliegt, darf keine konkrete Familienkasse als zuständige Stelle benannt werden.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-competence", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "PROCESS_VARIANT"] },
  { key: "special-competence-is-not-eu-coordination", category: "competence", temporal: "current_2026", type: "exception", text: "Die Sonderzuständigkeit des Zentralen Kindergeldservice ersetzt keine EU-Koordinierung und entscheidet nicht, welcher Staat Kindergeld zahlt.", sourceKey: "ba-zkgs", passageKey: "ba-zkgs-competence", riskLevel: "medium", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "newborn-letter-and-online-route", category: "application_newborn", temporal: "current_2026", type: "procedure", text: "Nach der Geburt übermittelt das BZSt Daten an die Familienkasse, die ein Schreiben an das neugeborene Kind mit Zugangsdaten für die Online-Beantragung versendet; der Online-Antrag benötigt das Konto im BA-Portal sowie die Steuer-IDs der antragstellenden Person und des Kindes.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-application", riskLevel: "low" },
  { key: "adult-requires-status-proof", category: "application_adult", temporal: "current_2026", type: "duty", text: "Für Kindergeld ab 18 Jahren muss die aktuelle Lebenssituation des volljährigen Kindes belegt werden; die bloße Minderjährigenregelung reicht nach Vollendung des 18. Lebensjahres nicht mehr.", sourceKey: "ba-ab-18", passageKey: "ba-ab-18-route", riskLevel: "medium" },
  { key: "adult-evidence-is-category-specific", category: "application_adult", temporal: "current_2026", type: "procedure", text: "Welche Nachweise für ein volljähriges Kind erforderlich sind, richtet sich nach der konkreten Kategorie wie Schule, betriebliche Ausbildung, Studium, Übergangszeit, Ausbildungs- oder Arbeitsuche oder Freiwilligendienst und ist nicht als eine universelle Nachweisliste für alle Fälle ab 18 zu behandeln.", sourceKey: "ba-nachweise", passageKey: "ba-nachweise-adult-cases", riskLevel: "medium", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "adult-online-route-available", category: "application_adult", temporal: "current_2026", type: "procedure", text: "Der Kindergeld-Antrag ab 18 Jahren kann im geltenden Verfahren 2026 online bei der Familienkasse eingereicht und mit weiteren Unterlagen digital ergänzt werden; ohne BundID bleibt der unterschriebene Papierweg möglich.", sourceKey: "ba-ab-18", passageKey: "ba-ab-18-route", riskLevel: "low" },
  { key: "adult-status-examples-need-matching-proof", category: "application_adult", temporal: "current_2026", type: "procedure", text: "Für Schule oder Studium ist typischerweise eine Schul- oder Immatrikulationsbescheinigung, für eine betriebliche Ausbildung ein Nachweis über Art und Dauer, für Ausbildungs- oder Arbeitsuche eine fallbezogene Erklärung samt Meldung oder Bewerbungsbelegen und für einen Freiwilligendienst eine Trägerbescheinigung vorgesehen.", sourceKey: "ba-nachweise", passageKey: "ba-nachweise-adult-cases", riskLevel: "medium" },
  { key: "adult-forms-not-for-under-18", category: "forms_documents", temporal: "current_2026", type: "exception", text: "Zusätzliche Vordrucke für volljährige Kinder wie KG 5a, KG 5b, KG 7e, KG 10 oder KG 11a sind nur bei der jeweils zutreffenden Erwachsenensituation zu verwenden und nicht allgemein für Kinder unter 18 Jahren erforderlich.", sourceKey: "ba-formulare-ab-18", passageKey: "ba-formulare-ab-18-list", riskLevel: "low" },
  { key: "further-evidence-may-be-requested", category: "evidence", temporal: "current_2026", type: "procedure", text: "Die Familienkasse kann nach Antragseingang oder im laufenden Bezug weitere Angaben oder Belege anfordern; die konkrete Anforderung ergibt sich aus dem jeweiligen Schreiben und gilt nicht als Ablehnung.", sourceKey: "ba-kindergeld", passageKey: "ba-processing", riskLevel: "medium" },
  { key: "requested-deadline-is-case-specific", category: "evidence", temporal: "current_2026", type: "deadline", text: "Die Frist zur Vorlage angeforderter Nachweise steht in dem konkreten Anforderungsschreiben der Familienkasse; eine allgemeine gesetzliche Einreichungsfrist für beliebige Nachweise darf daraus nicht abgeleitet werden.", sourceKey: "ba-nachweise", passageKey: "ba-nachweise-age-split", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "evidence-digital-or-copies", category: "evidence", temporal: "current_2026", type: "procedure", text: "Nachweise können über die Online-Dienste der Familienkasse als Foto oder PDF übermittelt werden; bei Übersendung per Post sollen nach Möglichkeit nur Kopien und keine Originale eingereicht werden.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-evidence", riskLevel: "low" },
  { key: "late-evidence-may-delay-or-refuse", category: "evidence", temporal: "current_2026", type: "exception", text: "Werden angeforderte Unterlagen nicht innerhalb der im Schreiben genannten Frist vorgelegt, kann sich der Antrag verzögern oder abgelehnt werden.", sourceKey: "ba-nachweise", passageKey: "ba-nachweise-age-split", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE"] },
  { key: "after-submission-completeness-check", category: "post_submission", temporal: "current_2026", type: "procedure", text: "Nach Eingang des Kindergeldantrags prüft die Familienkasse die Vollständigkeit der Unterlagen und kann fehlende Angaben bei der antragstellenden Person, bei Dritten oder bei Ämtern einholen.", sourceKey: "ba-kindergeld", passageKey: "ba-processing", riskLevel: "low" },
  { key: "no-guaranteed-processing-time", category: "post_submission", temporal: "current_2026", type: "exception", text: "Eine verbindliche Bearbeitungsdauer für jeden Kindergeldantrag ist amtlich nicht als festes Versprechen ausgewiesen; nach sechs Wochen ohne Rückmeldung kann der Bearbeitungsstand erfragt werden.", sourceKey: "ba-kindergeld", passageKey: "ba-processing", riskLevel: "low" },
  { key: "longer-processing-does-not-reduce-amount", category: "post_submission", temporal: "current_2026", type: "definition", text: "Eine längere Bearbeitung ändert nach den Angaben der Familienkasse nichts an der Höhe der Kindergeldzahlung.", sourceKey: "ba-kindergeld", passageKey: "ba-processing", riskLevel: "low" },
  { key: "payment-follows-kindergeldnummer-endziffer", category: "amount_payment", temporal: "current_2026", type: "procedure", text: "Der monatliche Auszahlungszeitpunkt richtet sich nach der letzten Ziffer der Kindergeldnummer: Endziffer 0 zu Beginn des Monats, Endziffer 9 am Monatsende; dazwischen gestaffelt.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-payment", riskLevel: "low" },
  { key: "exact-payment-dates-not-canonical", category: "amount_payment", temporal: "current_2026", type: "exception", text: "Die konkreten Kalendertage der Auszahlung sind der jeweils aktuellen amtlichen Übersicht der Familienkasse zu entnehmen und dürfen nicht als zeitloser gesetzlicher Zahlungstag gespeichert oder zugesagt werden.", sourceKey: "ba-auszahlung", passageKey: "ba-auszahlung-rule", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "no-legal-claim-to-specific-payday", category: "amount_payment", temporal: "current_2026", type: "exception", text: "Es besteht kein Rechtsanspruch darauf, dass Kindergeld an einem bestimmten Tag des Monats überwiesen wird; an Wochenenden und Feiertagen kann sich der Geldeingang verschieben.", sourceKey: "ba-auszahlung", passageKey: "ba-auszahlung-rule", riskLevel: "low" },
  { key: "first-payment-full-month-by-transfer", category: "amount_payment", temporal: "current_2026", type: "procedure", text: "Kindergeld wird unbar überwiesen und nicht bar ausgezahlt. Bei der Erstauszahlung wird der volle Monatsbetrag gezahlt, auch wenn die Anspruchsvoraussetzungen nur am letzten Tag des Monats vorlagen.", sourceKey: "ba-auszahlung", passageKey: "ba-auszahlung-rule", riskLevel: "low" },
  { key: "estg-68-direct-immediate-notification", category: "change_review", temporal: "current_2026", type: "duty", text: "Wer Kindergeld beantragt oder erhält, muss der zuständigen Familienkasse unverzüglich Änderungen mitteilen, die für die Leistung erheblich sind oder über die Erklärungen abgegeben wurden.", sourceKey: "estg-68", passageKey: "estg-68-1", riskLevel: "medium" },
  { key: "other-authority-notice-insufficient", category: "change_review", temporal: "current_2026", type: "exception", text: "Die Mitteilung an eine andere Behörde, insbesondere Einwohnermeldeamt, Jobcenter, Agentur für Arbeit, Gemeindeverwaltung, Finanzamt oder Arbeitgeber, ersetzt nicht die unmittelbare Mitteilung an die Familienkasse.", sourceKey: "ba-veraenderungen", passageKey: "ba-veraenderungen-direct", riskLevel: "medium" },
  { key: "notify-also-before-decision", category: "change_review", temporal: "current_2026", type: "duty", text: "Änderungen sind der Familienkasse auch dann mitzuteilen, wenn über den Antrag noch nicht entschieden wurde.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-changes", riskLevel: "medium" },
  { key: "change-examples-not-exhaustive", category: "change_review", temporal: "current_2026", type: "exception", text: "Die in der amtlichen Veränderungsliste genannten Beispiele sind Orientierungshilfen und keine geschlossene gesetzliche Ausschlussliste; im Zweifel ist bei der Familienkasse nachzufragen, ob eine Veränderung erheblich ist.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-changes", riskLevel: "medium" },
  { key: "address-bank-household-must-be-reported", category: "change_review", temporal: "current_2026", type: "duty", text: "Änderungen der Anschrift oder Bankverbindung sowie Haushaltsänderungen, dauerhafte Trennung oder Scheidung und das Verlassen des Haushalts durch ein Kind sind der Familienkasse direkt mitzuteilen.", sourceKey: "ba-veraenderungen", passageKey: "ba-veraenderungen-direct", riskLevel: "medium" },
  { key: "adult-or-cross-border-changes-must-be-reported", category: "change_review", temporal: "current_2026", type: "duty", text: "Bei einem volljährigen Kind sind Wechsel, Unterbrechung, Ende oder Abbruch von Schule, Ausbildung oder Studium sowie die Aufnahme einer Erwerbstätigkeit oder eines Freiwilligendienstes mitzuteilen. Ebenso mitzuteilen sind eine andere kindbezogene Leistung einschließlich ausländischer Familienbeihilfe und ein Wegzug ins Ausland; ein Auslandsbezug löst keine automatische Feststellung des zahlenden Staats aus.", sourceKey: "ba-veraenderungen", passageKey: "ba-veraenderungen-direct", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "review-questionnaire-is-not-rejection", category: "change_review", temporal: "current_2026", type: "procedure", text: "Ein Fragebogen oder eine Anforderung der Familienkasse zur Überprüfung des fortbestehenden Anspruchs ist keine Ablehnung; der Inhalt des konkreten Schreibens bestimmt die erforderliche Handlung und die genannte Frist.", sourceKey: "ba-kindergeld", passageKey: "ba-review-questionnaire", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE"] },
  { key: "rejection-or-change-by-bescheid", category: "negative_decision", temporal: "current_2026", type: "procedure", text: "Lehnt die Familienkasse einen Antrag ab, ändert sie eine Festsetzung oder fordert sie Kindergeld zurück, teilt sie dies durch einen schriftlichen Bescheid mit. Der Bescheid ist vor jeder weiteren Handlung zu prüfen.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-decision-remedy", riskLevel: "medium" },
  { key: "legal-remedy-requires-bescheid-and-basis", category: "negative_decision", temporal: "current_2026", type: "exception", text: "Welcher Rechtsbehelf zulässig ist und bis wann er eingelegt werden müsste, ergibt sich aus der Rechtsbehelfsbelehrung und der Rechtsgrundlage des konkreten Bescheids. Ohne diese Angaben ist keine individuelle Rechtsbehelfsempfehlung zu geben.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-decision-remedy", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "do-not-auto-file-remedy", category: "negative_decision", temporal: "current_2026", type: "exception", text: "Aus der bloßen Existenz eines ablehnenden oder ändernden Kindergeld-Bescheids folgt nicht die Empfehlung, automatisch Einspruch oder Widerspruch einzulegen; zunächst sind Bescheidinhalt und Rechtsbehelfsbelehrung zu prüfen.", sourceKey: "ba-kindergeld", passageKey: "ba-remedy-and-overpayment", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "overpayment-requires-official-bescheid", category: "overpayment", temporal: "current_2026", type: "procedure", text: "Bei einer Überzahlung von Kindergeld erlässt die Familienkasse einen Aufhebungs- und Erstattungsbescheid. Grund, Betrag, Zeitraum und Zahlungsfrist ergeben sich aus diesem Bescheid und nicht aus einer allgemeinen Annahme.", sourceKey: "ba-rueckzahlung", passageKey: "ba-rueckzahlung-bescheid", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "do-not-repay-without-notice", category: "overpayment", temporal: "current_2026", type: "exception", text: "Kindergeld soll nicht einfach ohne amtliche Zahlungsaufforderung zurücküberwiesen werden; abzuwarten ist das Schreiben der Familienkasse mit Betrag und Verwendungszweck.", sourceKey: "ba-kindergeld", passageKey: "ba-remedy-and-overpayment", riskLevel: "medium" },
  { key: "overpayment-not-automatically-fraud", category: "overpayment", temporal: "current_2026", type: "exception", text: "Eine Rückforderung von Kindergeld bedeutet für sich genommen weder Vorsatz noch eine Straftat; auch ohne Verschulden kann zu Unrecht erhaltenes Kindergeld zurückzuzahlen sein.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-repayment", riskLevel: "medium" },
  { key: "objection-does-not-stay-repayment", category: "overpayment", temporal: "current_2026", type: "procedure", text: "Ein Einspruch gegen einen Rückforderungsbescheid schiebt nach dem Merkblatt die Verpflichtung zur Rückzahlung zum genannten Termin nicht automatisch auf; die im Bescheid genannte Frist bleibt maßgeblich, bis die Familienkasse etwas anderes mitteilt.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-repayment", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "tax-id-find-or-request-again", category: "identification", temporal: "current_2026", type: "procedure", text: "Die steuerliche Identifikationsnummer findet sich im Mitteilungsschreiben des BZSt, auf der elektronischen Lohnsteuerbescheinigung oder im Einkommensteuerbescheid. Wird sie dort nicht gefunden, kann über das Internetportal des BZSt die erneute Zusendung beantragt werden; ein inoffizieller Ersatzweg besteht nicht.", sourceKey: "kg1-form", passageKey: "kg1-instructions", riskLevel: "medium" },
  { key: "familienkasse-may-determine-tax-id", category: "identification", temporal: "current_2026", type: "procedure", text: "Die Familienkasse fragt die steuerliche Identifikationsnummer beim Berechtigten ab oder ermittelt sie bei Nichtvorliegen gegebenenfalls selbst. Nach der Geburt eines Kindes erhält sie die Steuer-ID des Kindes automatisch vom BZSt.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-application", riskLevel: "low" },
  { key: "cross-border-facts-require-coordination-context", category: "cross_border", temporal: "current_2026", type: "exception", text: "Tatsachen wie Erwerbstätigkeit in einem anderen Staat, Wohnsitz des Kindes oder des anderen Elternteils in einem anderen Staat, eine ausländische Familienleistung, Wohnsitz in einem EU-/EWR-Staat oder der Schweiz oder die Beteiligung einer ausländischen Stelle machen den Fall koordinierungsbedürftig. Sie erlauben ohne Wohnsitzstaat, Beschäftigungsstaat und Koordinierungsnachweise keine Feststellung, welcher Staat zahlt.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "anlage-ausland-signals-foreign-facts", category: "cross_border", temporal: "current_2026", type: "procedure", text: "Die Anlage Ausland (KG 51) ist das amtliche Formular zum Kindergeldantrag, wenn mindestens ein Elternteil oder das Kind im Ausland wohnt. Ihre Verwendung zeigt einen auslandsbezogenen Sachverhalt an und entscheidet nicht, welcher Staat vorrangig leistet.", sourceKey: "ba-formulare", passageKey: "ba-formulare-kg1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "eu-three-month-waiting-rule", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein EU- oder EWR-Staatsangehöriger, der im Inland Wohnsitz oder gewöhnlichen Aufenthalt begründet, hat nach § 62 Absatz 1a EStG für die ersten drei Monate grundsätzlich keinen Kindergeldanspruch, es sei denn, er weist inländische Einkünfte im Sinne der Vorschrift nach.", sourceKey: "estg-62", passageKey: "estg-62-1a", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "EVENT_DATE"] },
  { key: "child-outside-eu-eea-not-considered", category: "cross_border", temporal: "current_2026", type: "exception", text: "Kinder ohne Wohnsitz oder gewöhnlichen Aufenthalt im Inland, in der EU oder im EWR werden nach § 63 Absatz 1 Satz 6 EStG nicht berücksichtigt, es sei denn, sie leben im Haushalt eines nach § 62 Absatz 1 Satz 1 Nummer 2 Buchstabe a EStG Berechtigten.", sourceKey: "estg-63", passageKey: "estg-63-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "paying-state-not-inferred", category: "cross_border", temporal: "current_2026", type: "exception", text: "Aus Wohnsitz oder Erwerbstätigkeit in Deutschland allein folgt nicht, dass Deutschland in einem grenzüberschreitenden Fall die vorrangig leistende Stelle ist; die individuelle Zuständigkeit bleibt ohne Wohnsitzstaat, Beschäftigungsstaat und EU-Koordinierungsnachweise unbeantwortet.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "foreign-comparable-benefit-exclusion", category: "cross_border", temporal: "current_2026", type: "exception", text: "Vergleichbare kindbezogene Leistungen aus dem Ausland können den deutschen Kindergeldanspruch ausschließen; bei niedrigeren Familienleistungen eines anderen EU-/EWR-Staats oder der Schweiz kann Differenzkindergeld in Betracht kommen und ist ohne Koordinierungsnachweise nicht als feststehende Zahlung zu beantworten.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
]);

export type KindergeldProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

export type KindergeldFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

export type KindergeldBindingSpec = Readonly<{
  processKey: string;
  claimKeys: readonly string[];
  role: KindergeldProcessRole;
  sequenceContext: string;
  required?: boolean;
  qualificationRequired?: boolean;
}>;

export type KindergeldProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: KindergeldScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const KINDERGELD_PROCESSES: readonly KindergeldProcessSpec[] = Object.freeze([
  { key: "orientation-eligibility", title: "Kindergeld: Erstorientierung zur möglichen Anspruchslage 2026", trigger: "Frage, ob Kindergeld in Betracht kommt, ohne dass bereits ein vollständiger Antragssachverhalt feststeht", safeFirstStep: "Die anspruchsrelevanten Tatsachen zu Kind, Alter, Verhältnis, Empfangsperson, Wohnsitz und einem etwaigen Auslandsbezug klären, bevor ein Antragsweg empfohlen wird.", riskLevel: "medium" },
  { key: "kindergeld-antrag-2026", title: "Kindergeldantrag für ein Kind unter 18 Jahren (Verfahren 2026)", trigger: "Kindergeld für ein Kind, das das 18. Lebensjahr noch nicht vollendet hat, soll im Jahr 2026 beantragt werden", safeFirstStep: "Den aktuellen Kindergeldantrag KG1 bei der zuständigen Familienkasse online mit BundID oder schriftlich unterschrieben stellen.", riskLevel: "medium" },
  { key: "application-newborn", title: "Kindergeldantrag nach Geburt 2026", trigger: "Geburt eines Kindes in Deutschland und möglicher Kindergeldantrag ab Geburt", safeFirstStep: "Das Schreiben der Familienkasse mit Zugangsdaten nutzen oder den Online-Antrag mit den Steuer-IDs von Antragsteller und Kind stellen.", riskLevel: "medium" },
  { key: "application-age-18-plus", title: "Kindergeldantrag oder Fortsetzung für ein Kind ab 18 Jahren 2026", trigger: "Kindergeld für ein volljähriges Kind soll beantragt oder fortgesetzt werden", safeFirstStep: "Die aktuelle Lebenssituation des volljährigen Kindes feststellen und den Antragsweg ab 18 mit den dazu passenden Nachweisen nutzen.", riskLevel: "medium" },
  { key: "additional-evidence", title: "Nachweise zur Kindergeldakte nachreichen 2026", trigger: "Die Familienkasse hat weitere Unterlagen angefordert oder Nachweise sollen zum Antrag übermittelt werden", safeFirstStep: "Das konkrete Anforderungsschreiben lesen und die darin genannten Unterlagen auf dem amtlichen Online-Weg oder als Kopie übermitteln.", riskLevel: "medium" },
  { key: "post-submission", title: "Nach dem Kindergeldantrag: Bearbeitung und Entscheidung 2026", trigger: "Der Kindergeldantrag ist bei der Familienkasse eingegangen und es liegt noch keine Entscheidung vor", safeFirstStep: "Auf mögliche Nachforderungen der Familienkasse reagieren und den späteren schriftlichen Bescheid abwarten.", riskLevel: "low" },
  { key: "approved-payment", title: "Bewilligtes Kindergeld und Auszahlung 2026", trigger: "Kindergeld wurde festgesetzt und soll ausgezahlt werden oder wird bereits gezahlt", safeFirstStep: "Die Kindergeldnummer und die aktuelle amtliche Auszahlungsübersicht heranziehen; künftige Änderungen weiter der Familienkasse mitteilen.", riskLevel: "low" },
  { key: "changes-reporting", title: "Änderungen der Familienkasse mitteilen 2026", trigger: "Eine für das Kindergeld möglicherweise erhebliche Veränderung ist eingetreten oder steht bevor", safeFirstStep: "Die Veränderung unmittelbar der Familienkasse mitteilen; die Information an eine andere Behörde reicht nicht.", riskLevel: "medium" },
  { key: "familienkasse-review", title: "Anforderung oder Überprüfung durch die Familienkasse 2026", trigger: "Die Familienkasse übersendet einen Fragebogen oder fordert Angaben oder Nachweise zur Überprüfung", safeFirstStep: "Das konkrete Schreiben als Handlungsaufforderung und nicht als Ablehnung lesen und innerhalb der darin genannten Frist antworten.", riskLevel: "medium" },
  { key: "negative-decision", title: "Ablehnung oder nachteilige Kindergeld-Entscheidung 2026", trigger: "Ein Antrag wurde abgelehnt oder eine Kindergeld-Festsetzung wurde nachteilig geändert", safeFirstStep: "Den schriftlichen Bescheid und die Rechtsbehelfsbelehrung prüfen; ohne Rechtsgrundlage und Bescheid keinen Rechtsbehelf empfehlen.", riskLevel: "high" },
  { key: "overpayment-repayment", title: "Überzahlung und Rückforderung von Kindergeld 2026", trigger: "Die Familienkasse spricht eine Überzahlung an oder fordert Kindergeld zurück", safeFirstStep: "Den Aufhebungs- und Erstattungsbescheid abwarten und prüfen; nicht ohne dieses Schreiben Geld zurücküberweisen.", riskLevel: "high" },
  { key: "missing-identification", title: "Fehlende steuerliche Identifikationsnummer im Kindergeldverfahren 2026", trigger: "Die steuerliche Identifikationsnummer der antragstellenden Person oder des Kindes ist unbekannt oder nicht auffindbar", safeFirstStep: "Die Nummer in den amtlichen Unterlagen suchen oder die erneute Mitteilung beim BZSt beantragen; keinen inoffiziellen Ersatzweg nutzen.", riskLevel: "medium" },
  { key: "cross-border-context", title: "Grenzüberschreitender Kindergeld-Sachverhalt: Kontextkläre 2026", trigger: "Wohnsitz, Erwerbstätigkeit, Kind oder Familienleistung berührt einen anderen Staat", safeFirstStep: "Den Fall als koordinierungsbedürftig behandeln und keine Feststellung treffen, welcher Staat zahlt.", riskLevel: "high" },
  { key: "kindergeld-competent-authority-resolution", title: "Zuständige Familienkasse oder Zentraler Kindergeldservice klären 2026", trigger: "Die zuständige Stelle für einen Kindergeldantrag oder eine Kindergeldakte soll bestimmt werden", safeFirstStep: "Zuerst prüfen, ob ein gewöhnlicher Inlandsfall, eine Sonderzuständigkeit des Zentralen Kindergeldservice oder ein Auslandsbezug vorliegt; ohne diese Tatsachen keine konkrete Stelle benennen.", riskLevel: "high" },
]);

export const KINDERGELD_FORMS: readonly KindergeldFormSpec[] = Object.freeze([
  { key: "kg-antrag-2026", name: "Antrag auf Kindergeld", identifier: "KG1", purpose: "Hauptantrag auf Kindergeld im Verfahren 2026, elektronisch oder schriftlich unterschrieben", submissionChannels: ["electronic_official_interface", "signed_paper_post"], sourceKey: "ba-formulare", passageKey: "ba-formulare-kg1" },
  { key: "anlage-kind", name: "Anlage Kind zum Hauptantrag Kindergeld", identifier: "KG1-AnK", purpose: "Kindbezogene Ergänzung zum Hauptantrag; auf dem Papierweg für jedes beantragte Kind, online im Hauptantrag enthalten", submissionChannels: ["electronic_official_interface", "signed_paper_post"], sourceKey: "ba-formulare", passageKey: "ba-formulare-kg1" },
  { key: "anlage-ausland", name: "Anlage Ausland zum Antrag auf deutsches Kindergeld", identifier: "KG 51", purpose: "Ergänzung, wenn mindestens ein Elternteil oder das Kind im Ausland wohnt; keine Feststellung des zahlenden Staats", submissionChannels: ["electronic_official_interface", "signed_paper_post"], sourceKey: "ba-formulare", passageKey: "ba-formulare-kg1" },
  { key: "schulbescheinigung", name: "Schulbescheinigung für das Kindergeld", identifier: "KG 5a", purpose: "Nachweis der Schule oder schulischen Ausbildung eines volljährigen Kindes; nicht allgemein für Kinder unter 18 Jahren", submissionChannels: ["electronic_official_interface", "copy_by_post"], sourceKey: "ba-formulare-ab-18", passageKey: "ba-formulare-ab-18-list" },
  { key: "erklaerung-ausbildung", name: "Erklärung zum Ausbildungsverhältnis", identifier: "KG 5b", purpose: "Erklärung zur betrieblichen Berufsausbildung eines volljährigen Kindes", submissionChannels: ["electronic_official_interface", "copy_by_post"], sourceKey: "ba-formulare-ab-18", passageKey: "ba-formulare-ab-18-list" },
  { key: "kind-ohne-platz", name: "Erklärung für ein Kind ohne Ausbildungs- oder Arbeitsplatz", identifier: "KG 11a", purpose: "Erklärung bei Ausbildungs- oder Arbeitsuche eines volljährigen Kindes; zusätzlich fallbezogene Nachweise", submissionChannels: ["electronic_official_interface", "copy_by_post"], sourceKey: "ba-formulare-ab-18", passageKey: "ba-formulare-ab-18-list" },
]);

export const KINDERGELD_PROCESS_BINDINGS: readonly KindergeldBindingSpec[] = Object.freeze([
  { processKey: "orientation-eligibility", role: "orientation_basis", sequenceContext: "orientation", claimKeys: ["incomplete-facts-no-entitlement", "orientation-needs-material-facts", "eligible-person-residence-or-unlimited-tax", "children-considered-categories", "child-until-18", "income-independent", "amount-259-from-2026"] },
  { processKey: "orientation-eligibility", role: "context_gate", sequenceContext: "orientation_cross_border", required: false, qualificationRequired: true, claimKeys: ["paying-state-not-inferred", "cross-border-facts-require-coordination-context"] },
  { processKey: "kindergeld-antrag-2026", role: "application_route", sequenceContext: "apply_under_18", claimKeys: ["application-electronic-or-signed", "application-online-bundid-or-post", "bundid-optional-not-exclusive", "application-free-of-charge", "no-oral-or-email-application", "competent-familienkasse-is-residence-office"] },
  { processKey: "kindergeld-antrag-2026", role: "required_information", sequenceContext: "apply_under_18_facts", claimKeys: ["under-18-regular-tax-ids-suffice", "claimant-tax-id-required", "child-tax-id-required", "birth-proof-inland-on-request-foreign-copy"] },
  { processKey: "kindergeld-antrag-2026", role: "form_semantics", sequenceContext: "apply_under_18_forms", claimKeys: ["kg1-is-main-application", "anlage-kind-paper-vs-online"] },
  { processKey: "kindergeld-antrag-2026", role: "next_state", sequenceContext: "apply_under_18_next", claimKeys: ["after-submission-completeness-check", "familienkasse-decides-by-bescheid", "retroactive-six-months"] },
  { processKey: "application-newborn", role: "application_route", sequenceContext: "newborn", claimKeys: ["newborn-letter-and-online-route", "application-online-bundid-or-post", "kg1-is-main-application", "child-until-18", "birth-proof-inland-on-request-foreign-copy"] },
  { processKey: "application-newborn", role: "identification", sequenceContext: "newborn_id", claimKeys: ["familienkasse-may-determine-tax-id", "claimant-tax-id-required", "child-tax-id-required"] },
  { processKey: "application-age-18-plus", role: "application_route", sequenceContext: "apply_adult", claimKeys: ["adult-requires-status-proof", "adult-online-route-available", "adult-evidence-is-category-specific", "adult-status-examples-need-matching-proof", "adult-forms-not-for-under-18"] },
  { processKey: "application-age-18-plus", role: "orientation_basis", sequenceContext: "apply_adult_categories", claimKeys: ["adult-training-until-25", "adult-transition-four-months", "adult-seeking-apprenticeship", "adult-job-seeking-until-21", "adult-voluntary-service", "adult-disability-before-25"] },
  { processKey: "additional-evidence", role: "evidence_requirement", sequenceContext: "evidence", claimKeys: ["further-evidence-may-be-requested", "evidence-digital-or-copies", "late-evidence-may-delay-or-refuse"] },
  { processKey: "additional-evidence", role: "deadline_gate", sequenceContext: "evidence_deadline", qualificationRequired: true, claimKeys: ["requested-deadline-is-case-specific"] },
  { processKey: "additional-evidence", role: "negative_control", sequenceContext: "evidence_not_rejection", claimKeys: ["review-questionnaire-is-not-rejection"] },
  { processKey: "post-submission", role: "next_state", sequenceContext: "waiting", claimKeys: ["after-submission-completeness-check", "further-evidence-may-be-requested", "no-guaranteed-processing-time", "longer-processing-does-not-reduce-amount", "familienkasse-decides-by-bescheid"] },
  { processKey: "approved-payment", role: "payment", sequenceContext: "payment", claimKeys: ["amount-259-from-2026", "one-recipient-principle", "payment-month-window", "payment-follows-kindergeldnummer-endziffer", "exact-payment-dates-not-canonical", "no-legal-claim-to-specific-payday", "first-payment-full-month-by-transfer", "retroactive-six-months"] },
  { processKey: "approved-payment", role: "change_duty", sequenceContext: "payment_then_changes", claimKeys: ["estg-68-direct-immediate-notification"] },
  { processKey: "changes-reporting", role: "change_duty", sequenceContext: "changes", claimKeys: ["estg-68-direct-immediate-notification", "other-authority-notice-insufficient", "notify-also-before-decision", "change-examples-not-exhaustive", "address-bank-household-must-be-reported", "adult-or-cross-border-changes-must-be-reported", "household-means-actual-care"] },
  { processKey: "familienkasse-review", role: "review_request", sequenceContext: "review", claimKeys: ["review-questionnaire-is-not-rejection", "regular-review-and-notification", "further-evidence-may-be-requested"] },
  { processKey: "familienkasse-review", role: "deadline_gate", sequenceContext: "review_deadline", qualificationRequired: true, claimKeys: ["requested-deadline-is-case-specific"] },
  { processKey: "negative-decision", role: "decision", sequenceContext: "negative", claimKeys: ["rejection-or-change-by-bescheid", "familienkasse-decides-by-bescheid"] },
  { processKey: "negative-decision", role: "legal_remedy_gate", sequenceContext: "remedy", qualificationRequired: true, claimKeys: ["objection-one-month", "legal-remedy-requires-bescheid-and-basis", "do-not-auto-file-remedy"] },
  { processKey: "overpayment-repayment", role: "decision", sequenceContext: "overpayment", claimKeys: ["overpayment-requires-official-bescheid", "do-not-repay-without-notice", "overpayment-not-automatically-fraud", "objection-does-not-stay-repayment"] },
  { processKey: "missing-identification", role: "identification", sequenceContext: "missing_id", claimKeys: ["claimant-tax-id-required", "child-tax-id-required", "tax-id-find-or-request-again", "familienkasse-may-determine-tax-id", "claimant-tax-id-retroactive"] },
  { processKey: "cross-border-context", role: "context_gate", sequenceContext: "cross_border", required: false, qualificationRequired: true, claimKeys: ["paying-state-not-inferred", "cross-border-facts-require-coordination-context", "foreign-comparable-benefit-exclusion", "anlage-ausland-signals-foreign-facts", "child-outside-eu-eea-not-considered", "eu-three-month-waiting-rule", "cross-border-competence-not-from-residence"] },
  { processKey: "kindergeld-competent-authority-resolution", role: "orientation_basis", sequenceContext: "competence_ordinary", claimKeys: ["competent-familienkasse-is-residence-office"] },
  { processKey: "kindergeld-competent-authority-resolution", role: "application_route", sequenceContext: "competence_special", claimKeys: ["zkgs-federal-public-service", "zkgs-covers-berechtigte-or-parent", "zkgs-protected-data-auskunftssperre", "zkgs-disability-not-regional"] },
  { processKey: "kindergeld-competent-authority-resolution", role: "context_gate", sequenceContext: "competence_cross_border", required: false, qualificationRequired: true, claimKeys: ["cross-border-competence-not-from-residence", "paying-state-not-inferred"] },
  { processKey: "kindergeld-competent-authority-resolution", role: "negative_control", sequenceContext: "competence_fail_closed", qualificationRequired: true, claimKeys: ["insufficient-facts-no-competent-office", "special-competence-is-not-eu-coordination"] },
]);

export const KINDERGELD_PROCESS_SCENARIOS: readonly KindergeldProcessScenario[] = Object.freeze([
  { id: "initial-eligibility-orientation", label: "Erstorientierung zur möglichen Anspruchslage", coverage: "COVERED", requiredClaimKeys: ["incomplete-facts-no-entitlement", "orientation-needs-material-facts"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "under-18-application", label: "Antragsweg für ein Kind unter 18 Jahren", coverage: "COVERED", requiredClaimKeys: ["application-online-bundid-or-post", "under-18-regular-tax-ids-suffice", "kg1-is-main-application"], requiredProcessKeys: ["kindergeld-antrag-2026"], requiredFormIdentifiers: ["KG1"] },
  { id: "newborn-route", label: "Antragsweg nach Geburt", coverage: "COVERED", requiredClaimKeys: ["newborn-letter-and-online-route", "birth-proof-inland-on-request-foreign-copy"], requiredProcessKeys: ["application-newborn"] },
  { id: "age-18-plus-route", label: "Antragsweg für ein Kind ab 18 Jahren", coverage: "COVERED", requiredClaimKeys: ["adult-requires-status-proof", "adult-evidence-is-category-specific", "adult-online-route-available"], requiredProcessKeys: ["application-age-18-plus"] },
  { id: "required-information", label: "Erforderliche Angaben zum Antrag", coverage: "COVERED", requiredClaimKeys: ["orientation-needs-material-facts", "claimant-tax-id-required", "child-tax-id-required"], requiredProcessKeys: ["kindergeld-antrag-2026"] },
  { id: "identification", label: "Identifikation durch Steuer-ID", coverage: "COVERED", requiredClaimKeys: ["claimant-tax-id-required", "child-tax-id-required", "tax-id-find-or-request-again"], requiredProcessKeys: ["missing-identification"] },
  { id: "online-application", label: "Online-Antrag bei der Familienkasse", coverage: "COVERED", requiredClaimKeys: ["application-online-bundid-or-post", "bundid-optional-not-exclusive"], requiredProcessKeys: ["kindergeld-antrag-2026"] },
  { id: "paper-form-route", label: "Papierweg mit KG1 und Anlage Kind", coverage: "COVERED", requiredClaimKeys: ["anlage-kind-paper-vs-online", "kg1-is-main-application", "no-oral-or-email-application"], requiredProcessKeys: ["kindergeld-antrag-2026"], requiredFormIdentifiers: ["KG1", "KG1-AnK"] },
  { id: "evidence-submission", label: "Nachweise übermitteln", coverage: "COVERED", requiredClaimKeys: ["evidence-digital-or-copies"], requiredProcessKeys: ["additional-evidence"] },
  { id: "requested-additional-evidence", label: "Nachgeforderte weitere Nachweise", coverage: "COVERED", requiredClaimKeys: ["further-evidence-may-be-requested", "review-questionnaire-is-not-rejection"], requiredProcessKeys: ["additional-evidence"] },
  { id: "case-specific-deadline-handling", label: "Frist aus dem konkreten Anforderungsschreiben", coverage: "COVERED", requiredClaimKeys: ["requested-deadline-is-case-specific"], requiredProcessKeys: ["additional-evidence"] },
  { id: "post-submission-state", label: "Zustand nach Antragstellung", coverage: "COVERED", requiredClaimKeys: ["after-submission-completeness-check", "no-guaranteed-processing-time"], requiredProcessKeys: ["post-submission"] },
  { id: "approval-payment", label: "Bewilligung und Auszahlung", coverage: "COVERED", requiredClaimKeys: ["payment-follows-kindergeldnummer-endziffer", "exact-payment-dates-not-canonical", "amount-259-from-2026"], requiredProcessKeys: ["approved-payment"] },
  { id: "reporting-changes", label: "Änderungen der Familienkasse mitteilen", coverage: "COVERED", requiredClaimKeys: ["estg-68-direct-immediate-notification", "other-authority-notice-insufficient"], requiredProcessKeys: ["changes-reporting"] },
  { id: "adult-child-status-changes", label: "Statusänderungen eines volljährigen Kindes", coverage: "COVERED", requiredClaimKeys: ["adult-or-cross-border-changes-must-be-reported"], requiredProcessKeys: ["changes-reporting"] },
  { id: "address-bank-changes", label: "Adresse oder Bankverbindung ändern", coverage: "COVERED", requiredClaimKeys: ["address-bank-household-must-be-reported"], requiredProcessKeys: ["changes-reporting"] },
  { id: "household-changes", label: "Haushaltsänderungen mitteilen", coverage: "COVERED", requiredClaimKeys: ["address-bank-household-must-be-reported", "household-means-actual-care"], requiredProcessKeys: ["changes-reporting"] },
  { id: "foreign-benefit-cross-border-trigger", label: "Ausländische Familienleistung oder Auslandsbezug", coverage: "COVERED", requiredClaimKeys: ["adult-or-cross-border-changes-must-be-reported", "cross-border-facts-require-coordination-context"], requiredProcessKeys: ["cross-border-context"] },
  { id: "review-request-from-familienkasse", label: "Überprüfungs- oder Anforderungsschreiben", coverage: "COVERED", requiredClaimKeys: ["review-questionnaire-is-not-rejection"], requiredProcessKeys: ["familienkasse-review"] },
  { id: "negative-decision", label: "Ablehnung oder nachteilige Entscheidung", coverage: "COVERED", requiredClaimKeys: ["rejection-or-change-by-bescheid"], requiredProcessKeys: ["negative-decision"] },
  { id: "legal-remedy-context-gate", label: "Rechtsbehelf nur mit Bescheid und Rechtsgrundlage", coverage: "COVERED", requiredClaimKeys: ["legal-remedy-requires-bescheid-and-basis", "objection-one-month", "do-not-auto-file-remedy"], requiredProcessKeys: ["negative-decision"] },
  { id: "overpayment-repayment-orientation", label: "Überzahlung und Rückforderung", coverage: "COVERED", requiredClaimKeys: ["overpayment-requires-official-bescheid", "do-not-repay-without-notice", "overpayment-not-automatically-fraud"], requiredProcessKeys: ["overpayment-repayment"] },
  { id: "cross-border-escalation", label: "Grenzüberschreitende Zuständigkeit bleibt kontextabhängig", coverage: "COVERED", requiredClaimKeys: ["paying-state-not-inferred", "cross-border-facts-require-coordination-context"], requiredProcessKeys: ["cross-border-context"] },
  { id: "ordinary-domestic-competence", label: "Gewöhnliche inländische Zuständigkeit der Familienkasse", coverage: "COVERED", requiredClaimKeys: ["competent-familienkasse-is-residence-office"], requiredProcessKeys: ["kindergeld-competent-authority-resolution"] },
  { id: "federal-public-service-special-competence", label: "Sonderzuständigkeit bei öffentlichem Dienst des Bundes", coverage: "COVERED", requiredClaimKeys: ["zkgs-federal-public-service", "zkgs-covers-berechtigte-or-parent"], requiredProcessKeys: ["kindergeld-competent-authority-resolution"] },
  { id: "protected-data-zkgs-competence", label: "Sonderzuständigkeit bei Auskunftssperre oder besonders geschützten Daten", coverage: "COVERED", requiredClaimKeys: ["zkgs-protected-data-auskunftssperre"], requiredProcessKeys: ["kindergeld-competent-authority-resolution"] },
  { id: "disability-related-special-competence", label: "Sonderzuständigkeit bei Kindergeld für Menschen mit Behinderung", coverage: "COVERED", requiredClaimKeys: ["zkgs-disability-not-regional"], requiredProcessKeys: ["kindergeld-competent-authority-resolution"] },
  { id: "cross-border-competence-escalation", label: "Grenzüberschreitende Behördenzuständigkeit nicht aus dem Wohnsitz", coverage: "COVERED", requiredClaimKeys: ["cross-border-competence-not-from-residence"], requiredProcessKeys: ["kindergeld-competent-authority-resolution"] },
  { id: "insufficient-authority-context", label: "Zuständige Stelle ohne ausreichende Tatsachen nicht benennen", coverage: "COVERED", requiredClaimKeys: ["insufficient-facts-no-competent-office"], requiredProcessKeys: ["kindergeld-competent-authority-resolution"] },
  { id: "full-eu-coordination", label: "Vollständige EU-Koordinierung der Familienleistungen", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Eigener Koordinierungsconnector, nicht der deutsche Bundeskern." },
  { id: "de-v4-connector", label: "DE-V4-Antragskonnektor", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Separater grenzüberschreitender Connector, nicht in diesem Pack." },
  { id: "kinderzuschlag", label: "Kinderzuschlag als eigene Leistung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Eigenes Leistungsrecht außerhalb des Kindergeld-Bundeskerns." },
  { id: "individual-tax-residence", label: "Individuelle steuerliche Ansässigkeitsprüfung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Einzelfall-Steueransässigkeit in diesem Pack." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "ba-nachweise", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "ba-merkblatt", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "ba-zkgs", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT", "RESIDENCE_STATE"] as const, riskClass: "HIGH" },
]);

export function evaluateKindergeldProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = KINDERGELD_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = KINDERGELD_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildKindergeldFederalCorePack(): CuratedDomainPack {
  const item = factory(KINDERGELD_PACK_ID);
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
    familienkasse: item("publishers", "familienkasse-ba", {
      name: "Familienkasse der Bundesagentur für Arbeit",
      type: "federal_benefits_authority",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authority = item("authorities", "familienkasse", {
    publisherId: publishers.familienkasse.id,
    name: "Familienkasse der Bundesagentur für Arbeit",
    type: "federal_benefits_authority",
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    officialPortalUrl: "https://www.arbeitsagentur.de/familie-und-kinder",
  });

  const sources = KINDERGELD_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publishers[spec.publisherKey];
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

  const claims = KINDERGELD_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`KINDERGELD_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type,
      text: unit.text,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      authorityId: authority.id,
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
    if (!source) throw new Error(`KINDERGELD_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = KINDERGELD_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: KINDERGELD_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = KINDERGELD_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`KINDERGELD_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`KINDERGELD_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const applyRule = item("actorRules", "applicant-must-apply-2026", {
    actorState: "applicant_must_apply_2026",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const changeRule = item("actorRules", "applicant-must-report-changes", {
    actorState: "applicant_must_report_changes_to_familienkasse",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const requestRule = item("actorRules", "applicant-must-answer-request", {
    actorState: "applicant_must_answer_familienkasse_request",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const inspectBescheidRule = item("actorRules", "inspect-bescheid-before-remedy", {
    actorState: "inspect_bescheid_before_legal_remedy",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const crossBorderRule = item("actorRules", "paying-state-undetermined", {
    actorState: "paying_state_undetermined_without_coordination",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-office-undetermined", {
    actorState: "competent_familienkasse_undetermined_without_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = KINDERGELD_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`KINDERGELD_FORM_SOURCE_MISSING:${spec.key}`);
    return item("forms", spec.key, {
      name: spec.name,
      identifier: spec.identifier,
      authorityId: authority.id,
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
    packId: KINDERGELD_PACK_ID,
    domain: KINDERGELD_DOMAIN,
    canonicalLanguage: KINDERGELD_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.familienkasse],
    authorities: [authority],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [applyRule, changeRule, requestRule, inspectBescheidRule, crossBorderRule, competenceRule],
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

export function kindergeldPackSummary(pack: CuratedDomainPack = buildKindergeldFederalCorePack()) {
  const categories = Object.fromEntries(
    KINDERGELD_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<KindergeldUnitCategory, number>()),
  );
  const completeness = evaluateKindergeldProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: KINDERGELD_UNITS.length,
    futureWatchCount: KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: KINDERGELD_G3_PROCESS_STEP_LIMITATION,
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
