/**
 * KNOWLEDGE-EXPANSION-01 — German federal Kindergeld core pack.
 * Official-source G3 CuratedDomainPack for domain familienkasse_kindergeld.
 * Canonical language is German only. Not a runtime route.
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
  | "change_review"
  | "identification"
  | "cross_border";

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
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: "LEGAL_BASELINE" | "ELIGIBILITY" | "PROCESS_IDENTITY" | "DEADLINE";
  handlingMode: "STORE_CANONICALLY";
  requiredContextKeys: readonly ("EVENT_DATE" | "RESIDENCE_STATE" | "WORK_STATE")[];
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
  requiredContextKeys?: readonly ("EVENT_DATE" | "RESIDENCE_STATE" | "WORK_STATE")[];
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
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-amount-process",
        locator: "Familienkasse Kindergeld-Übersicht",
        text: "Sie erhalten pro Kind 259 Euro Kindergeld im Monat. Die Zahlung von Kindergeld ist nicht von Ihrem Einkommen abhängig. Kindergeld erhält immer nur eine Person, in der Regel ein Elternteil. Bei mehreren Kindern werden die einzelnen Beträge als eine Summe ausgezahlt. Anträge auf Kindergeld sind immer kostenlos und können direkt bei der Familienkasse gestellt werden. Wenn Sie über eine Bund-ID verfügen, müssen Sie den Online-Antrag nicht mehr ausdrucken, sondern können diesen ohne Unterschrift direkt online an die Familienkasse übermitteln. Die Frist zur rückwirkenden Zahlung von Kindergeld beträgt 6 Monate. Die Familienkasse prüft regelmäßig, ob die Voraussetzungen für die Zahlungen noch vorliegen. Sie haben die Möglichkeit, innerhalb eines Monats Einspruch beziehungsweise Widerspruch gegen den Bescheid einzulegen.",
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
    requiredContextKeys: [],
    passages: [
      {
        key: "merkblatt-process",
        locator: "Merkblatt Kindergeld KG2",
        text: "Das Kindergeld wird bei der Familienkasse beantragt und auch von dieser ausgezahlt. Das Bundeszentralamt für Steuern (BZSt) beaufsichtigt die Familienkassen. Das Kindergeld beträgt ab 1. Januar 2026 für jedes anspruchsberechtigte Kind monatlich 259 Euro. Der einfachste und schnellste Weg zum Kindergeld ist der Online-Antrag unter www.familienkasse.de. Nach erfolgreicher Identifizierung durch die BundID werden die Daten elektronisch an die Familienkasse übertragen. Ohne elektronische Identifikation muss der Kindergeldantrag ausgedruckt, unterschrieben und per Post übermittelt werden. Ein mündlicher Antrag oder eine Übersendung per E-Mail ist nicht möglich. Ein Kind ist in den Haushalt aufgenommen, wenn es ständig in der gemeinsamen Familienwohnung lebt und dort versorgt und betreut wird; eine bloße Anmeldung bei der Meldebehörde reicht nicht. Der Kindergeldberechtigte hat Änderungen mitzuteilen. Vergleichbare kindbezogene Leistungen aus dem Ausland können den deutschen Kindergeldanspruch ausschließen; für niedrigere Familienleistungen eines anderen EU-/EWR-Staats oder der Schweiz kann Differenzkindergeld in Betracht kommen.",
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
  { key: "objection-one-month", category: "change_review", temporal: "current_2026", type: "procedure", text: "Gegen einen Kindergeld-Bescheid kann innerhalb eines Monats Einspruch oder Widerspruch eingelegt werden; die Rechtsbehelfsbelehrung des Bescheids ist maßgebend.", sourceKey: "ba-kindergeld", passageKey: "ba-amount-process", riskLevel: "medium" },
  { key: "eu-three-month-waiting-rule", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein EU- oder EWR-Staatsangehöriger, der im Inland Wohnsitz oder gewöhnlichen Aufenthalt begründet, hat nach § 62 Absatz 1a EStG für die ersten drei Monate grundsätzlich keinen Kindergeldanspruch, es sei denn, er weist inländische Einkünfte im Sinne der Vorschrift nach.", sourceKey: "estg-62", passageKey: "estg-62-1a", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "EVENT_DATE"] },
  { key: "child-outside-eu-eea-not-considered", category: "cross_border", temporal: "current_2026", type: "exception", text: "Kinder ohne Wohnsitz oder gewöhnlichen Aufenthalt im Inland, in der EU oder im EWR werden nach § 63 Absatz 1 Satz 6 EStG nicht berücksichtigt, es sei denn, sie leben im Haushalt eines nach § 62 Absatz 1 Satz 1 Nummer 2 Buchstabe a EStG Berechtigten.", sourceKey: "estg-63", passageKey: "estg-63-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE"] },
  { key: "paying-state-not-inferred", category: "cross_border", temporal: "current_2026", type: "exception", text: "Aus Wohnsitz oder Erwerbstätigkeit in Deutschland allein folgt nicht, dass Deutschland in einem grenzüberschreitenden Fall die vorrangig leistende Stelle ist; die individuelle Zuständigkeit bleibt ohne Wohnsitzstaat, Beschäftigungsstaat und EU-Koordinierungsnachweise unbeantwortet.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "foreign-comparable-benefit-exclusion", category: "cross_border", temporal: "current_2026", type: "exception", text: "Vergleichbare kindbezogene Leistungen aus dem Ausland können den deutschen Kindergeldanspruch ausschließen; bei niedrigeren Familienleistungen eines anderen EU-/EWR-Staats oder der Schweiz kann Differenzkindergeld in Betracht kommen und ist ohne Koordinierungsnachweise nicht als feststehende Zahlung zu beantworten.", sourceKey: "ba-merkblatt", passageKey: "merkblatt-process", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
]);

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
      freshnessClass: "LEGAL_CHANGE_MONITORED",
      staleBehavior: "DO_NOT_USE_STALE",
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
      freshnessClass: "LEGAL_CHANGE_MONITORED",
      staleBehavior: "DO_NOT_USE_STALE",
      requiredContextKeys: spec.requiredContextKeys,
      riskClass: "MEDIUM",
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

  const currentProcess = item("processes", "kindergeld-antrag-2026", {
    processGroupId: KINDERGELD_DOMAIN,
    title: "Kindergeldantrag bei der Familienkasse (Verfahren 2026)",
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: "medium",
    trigger: "Geburt eines Kindes oder Eintritt der Anspruchsvoraussetzungen im Jahr 2026",
    safeFirstStep: "Den aktuellen Kindergeldantrag bei der zuständigen Familienkasse elektronisch oder schriftlich unterschrieben stellen.",
    regionalVariationExpected: false,
  });

  const currentLinks = claims.map(({ claim, unit }) => item("processClaimLinks", `${unit.key}:2026-link`, {
    processId: currentProcess.id,
    claimId: claim.id,
    role: unit.category === "cross_border" ? "context_gate" : "orientation_basis",
    required: unit.category !== "cross_border",
    sequenceContext: unit.category,
    qualificationRequired: unit.category === "cross_border",
  }));

  const applyRule = item("actorRules", "applicant-must-apply-2026", {
    actorState: "applicant_must_apply_2026",
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

  const formPassage = passageByKey.get("estg-67-all");
  const formSource = sourceByKey.get("estg-67");
  const form = item("forms", "kg-antrag-2026", {
    name: "Antrag auf Kindergeld",
    identifier: "KG1",
    authorityId: authority.id,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    sourceVersionId: formSource!.version.id,
    passageId: formPassage!.id,
    purpose: "Schriftlicher oder elektronischer Kindergeldantrag im Verfahren 2026",
    submissionChannels: ["electronic_official_interface", "signed_paper_post"],
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
    actorRules: [applyRule, crossBorderRule],
    processes: [currentProcess],
    processClaimLinks: currentLinks,
    forms: [form],
    fees: [],
    handlingPolicies: sources.map(({ policy }) => policy),
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
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    current2026Count: KINDERGELD_UNITS.length,
    futureWatchCount: KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.length,
    categories,
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
