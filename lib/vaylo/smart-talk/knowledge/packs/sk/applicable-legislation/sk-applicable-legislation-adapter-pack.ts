/**
 * CB-0D Slovak national adapter for applicable-legislation / PD A1 routing.
 * EU Articles 11–16 remain in eu_applicable_legislation. This pack stores
 * Sociálna poisťovňa / MPSVR process routing only. Canonical claim language de
 * does not make Slovak law German law.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  SK_ADAPTER_PACK_ID,
  SK_ADAPTER_PROCESS_GROUP,
  SK_EMPLOYER_EFILING_EFFECTIVE,
  classifySkEmployerEfiling,
  validateForeignNationalAdapterPack,
  type CuratedForeignNationalAdapterPack,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(SK_ADAPTER_PACK_ID, entityClass, key),
    ...values,
  });
}

export const SK_AL_PACK_ID = SK_ADAPTER_PACK_ID;
export const SK_AL_PROCESS_GROUP = SK_ADAPTER_PROCESS_GROUP;
export const SK_AL_CANONICAL_LANGUAGE = "de" as const;
export const SK_AL_PRIMARY_PROCESS_KEY = "sk-residence-multi-state-employee" as const;

export const SK_AL_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "sk-sp-ako-a1",
    publisherKey: "sp" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/zivotne-situacie/praca-v-zahranici/ako-poziadat-o-prenosny-dokument-a1-praca-v-eu-ehp-svajciarsku",
    title: "Sociálna poisťovňa: Ako požiadať o PD A1",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [
      {
        key: "sk-sp-ako-a1-text",
        locator: "Životná situácia PD A1",
        text: "Sociálna poisťovňa určuje uplatniteľnú legislatívu v prípade osôb s bydliskom na území Slovenskej republiky. Pre zamestnanca, SZČO a zmiešanú činnosť existujú osobitné žiadosti o určenie uplatniteľnej legislatívy. Ak bydlisko nie je na Slovensku, ústredie postúpi vec inštitúcii štátu bydliska, okrem prípadu, že je už priložené určenie slovenskej legislatívy. Vyslanie zamestnanca vybavuje príslušná pobočka; lehota 45 dní, 7 pracovných dní alebo 60 dní závisí od typu žiadosti a nie je univerzálna. Zamestnávatelia so sídlom mimo SR bez prístupu k elektronickým službám sú od elektronickej povinnosti oslobodení podľa aktuálneho oficiálneho textu. Štátna príslušnosť nerozhoduje o prvej inštitúcii.",
      },
    ],
  },
  {
    key: "sk-sp-vyslanie",
    publisherKey: "sp" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/kto-som/zamestnavatel/prihlasenie-odhlasenie/vyslat-zamestnanca-na-pracu-v-zahranici",
    title: "Sociálna poisťovňa: Vyslať zamestnanca na prácu v zahraničí",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ELIGIBILITY",
    passages: [
      {
        key: "sk-sp-vyslanie-text",
        locator: "Vyslanie zamestnanca",
        text: "Prenosný dokument A1 vystavuje inštitúcia štátu, ktorého právne predpisy sa uplatňujú. Sociálna poisťovňa vystaví PD A1 len ak sú splnené podmienky uplatňovania slovenských predpisov. Podanie žiadosti nie je automatickým nárokom na A1.",
      },
    ],
  },
  {
    key: "sk-sp-eformulare",
    publisherKey: "sp" as const,
    officialDomain: "eformulare.socpoist.sk",
    url: "https://eformulare.socpoist.sk/sk/sluzby/pda1",
    title: "Sociálna poisťovňa: e-formuláre PD A1",
    sourceType: "official_online_service",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "CONTACT_DETAILS",
    passages: [
      {
        key: "sk-sp-eformulare-text",
        locator: "eFormuláre PD A1",
        text: "Elektronický formulár slúži na žiadosť o PD A1 pri vyslaní alebo na určenie uplatniteľnej legislatívy pri súbežnej činnosti. Sociálna poisťovňa je príslušná na určenie výlučne pre osoby s bydliskom na Slovensku. Presná URL formulára a pobočka sú live overiteľné. Pred účinnosťou výlučnej elektronickej povinnosti zamestnávateľov ostáva podľa tohto kanála možné aj poštové alebo osobné podanie.",
      },
    ],
  },
  {
    key: "sk-sp-24h",
    publisherKey: "sp" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/news/podavajte-ziadost-o-pd-a1-spravnym-formularom-ziskajte-odpoved-do-24-hodin",
    title: "Sociálna poisťovňa: vybrané e-žiadosti môžu byť vybavené do 24 hodín",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "DEADLINE",
    passages: [
      {
        key: "sk-sp-24h-text",
        locator: "24 hodín",
        text: "Pri podaní cez určený elektronický formulár je možné, že vybrané typy žiadostí o PD A1 budú vybavené do 24 hodín. To neplatí pre všeobecné podanie a nie je to záruka pre všetkých žiadateľov.",
      },
    ],
  },
  {
    key: "sk-sp-oznamy",
    publisherKey: "sp" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/taxonomy/term/222",
    title: "Sociálna poisťovňa: dôležité oznamy odvádzateľov poistného",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "LEGAL_BASELINE",
    passages: [
      {
        key: "sk-sp-oznamy-text",
        locator: "Oznamy 1. júl a 1. august 2026",
        text: "Oficiálne oznamy Sociálnej poisťovne obsahovali najprv dátum 1. júla 2026 a potom 1. augusta 2026 pre výlučné elektronické podávanie žiadostí PD A1 zamestnávateľmi. Tieto oznámené dátumy nie sú aktuálnym operatívnym začiatkom. Aktuálne účinný dátum výlučnej elektronickej povinnosti zamestnávateľov je 1. september 2026.",
      },
    ],
  },
  {
    key: "sk-mpsvr-telework",
    publisherKey: "mpsvr" as const,
    officialDomain: "www.employment.gov.sk",
    url: "https://www.employment.gov.sk/sk/ministerstvo/europska-unia-medzinarodne-vztahy/koordinacia-systemov-socialneho-zabezpecenia/urcovanie-prislusnej-legislativy/ramcova-dohoda-telepraca-vynimky.html",
    title: "MPSVR SR: Rámcová dohoda o cezhraničnej telepráci",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [
      {
        key: "sk-mpsvr-telework-text",
        locator: "Rámcová dohoda",
        text: "Mnohostranná Rámcová dohoda platí od 1. júla 2023 vo vzťahu k signatárskym štátom. Žiadosť o uplatňovanie slovenskej legislatívy pri telepráci z bydliska v druhom signatárskom štáte sa podáva na MPSVR SR. Po udelení výnimky požiada zamestnanec Sociálnu poisťovňu o PD A1. Dohoda sa nevzťahuje na SZČO, ďalšiu závislú činnosť v inom štáte ani na pravidelnú činnosť v treťom štáte. 50 percent a viac telepráce nie je touto cestou. Obdobie až 3 roky, spravidla najviac 3 mesiace spätne. Bilaterálna dohoda SK-AT nie je touto mnohostrannou cestou.",
      },
    ],
  },
  {
    key: "sk-slovlex-461",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2003/461/",
    title: "Slov-Lex: zákon č. 461/2003 Z. z. o sociálnom poistení",
    sourceType: "legislation",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [
      {
        key: "sk-slovlex-461-text",
        locator: "Zákon 461/2003 Z. z.",
        text: "Zákon o sociálnom poistení je slovenský národný právny rámec Sociálnej poisťovne. Neopakuje články 11 až 16 nariadenia 883/2004. Zdrojová jurisdikcia SK nie je nemecké právo.",
      },
    ],
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

export const SK_AL_UNITS: readonly Unit[] = Object.freeze([
  { key: "sk-source-not-german-law", category: "principle", type: "definition", text: "Quellenjurisdiktion SK und kanonische Erklärsprache Deutsch machen slowakisches Recht nicht zu deutschem Recht.", sourceKey: "sk-slovlex-461", passageKey: "sk-slovlex-461-text", riskLevel: "high" },
  { key: "sk-locale-not-jurisdiction", category: "principle", type: "exception", text: "Die Ausgabesprache Slowakisch wählt weder den DE-SK-Korridor noch die zuständige Slowakei-Stelle.", sourceKey: "sk-slovlex-461", passageKey: "sk-slovlex-461-text", riskLevel: "high" },
  { key: "sk-sp-posting-from-slovakia", category: "posting", type: "procedure", text: "Bei Entsendung aus der Slowakei ist die Sociálna poisťovňa die nationale Stelle des slowakischen PD-A1-Verfahrens, nicht automatisch jede beliebige Krankenkasse.", sourceKey: "sk-sp-vyslanie", passageKey: "sk-sp-vyslanie-text", riskLevel: "high" },
  { key: "sk-application-not-entitlement", category: "posting", type: "exception", text: "Die Existenz eines PD-A1-Antrags begründet nicht automatisch die Ausstellung. Sociálna poisťovňa stellt A1 nur aus, wenn die Voraussetzungen der anwendbaren slowakischen Vorschriften erfüllt sind.", sourceKey: "sk-sp-vyslanie", passageKey: "sk-sp-vyslanie-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-ordinary-sk-activity-may-need-a1", category: "posting", type: "procedure", text: "Auch bei gewöhnlicher Tätigkeit nach slowakischen Vorschriften kann A1 als Nachweis verlangt werden. Das ist nicht dasselbe wie Mehrstaatenarbeit.", sourceKey: "sk-sp-vyslanie", passageKey: "sk-sp-vyslanie-text", riskLevel: "medium" },
  { key: "sk-residence-makes-sp-residence-institution", category: "multi-state", type: "procedure", text: "Bei gewöhnlicher Tätigkeit in zwei oder mehr Mitgliedstaaten und Wohnsitz in der Slowakei ist Sociálna poisťovňa die von der Slowakei bezeichnete Wohnstaatstelle des Bestimmungsverfahrens.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-citizenship-not-first-institution", category: "multi-state", type: "exception", text: "Slowakische Staatsangehörigkeit macht Sociálna poisťovňa nicht automatisch zur ersten Bestimmungsstelle.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-employer-not-automatic-sk-law", category: "multi-state", type: "exception", text: "Ein slowakischer Arbeitgeber bedeutet nicht automatisch, dass die Slowakei die anwendbaren Rechtsvorschriften nach Artikel 13 bestimmt.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-non-residence-not-first-institution", category: "multi-state", type: "exception", text: "Liegt der Wohnsitz in einem anderen Mitgliedstaat, ist Sociálna poisťovňa nicht die erste Stelle der Wohnstaatbestimmung. Die Zentrale leitet die Sache an die Wohnstaatstelle weiter, sofern nicht bereits eine Bestimmung slowakischer Rechtsvorschriften durch jene Stelle vorliegt.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-employee-multi-state-application", category: "multi-state", type: "procedure", text: "Für gewöhnlich beschäftigte Personen in zwei oder mehr Mitgliedstaaten mit Wohnsitz SK gibt es die slowakische Antragstype zur Bestimmung der anwendbaren Rechtsvorschriften als Arbeitnehmer.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-szco-multi-state-application", category: "multi-state", type: "procedure", text: "Für gewöhnlich selbständig tätige Personen in zwei oder mehr Mitgliedstaaten mit Wohnsitz SK gibt es die gesonderte SZČO-Antragstype.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-mixed-multi-state-application", category: "multi-state", type: "procedure", text: "Für gleichzeitige Beschäftigung und Selbständigkeit in verschiedenen Mitgliedstaaten mit Wohnsitz SK gibt es die gemischte Antragstype. Sie ist nicht dieselbe wie reine Arbeitnehmer- oder reine SZČO-Mehrstaatenarbeit.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-branch-contact-fetch-live", category: "multi-state", type: "procedure", text: "Die genaue zuständige Filiale oder Anschrift der Sociálna poisťovňa ist live zu ermitteln und nicht als unveränderliche kanonische Adresse gespeichert.", sourceKey: "sk-sp-eformulare", passageKey: "sk-sp-eformulare-text", riskLevel: "medium" },
  { key: "sk-employer-efiling-effective-2026-09-01", category: "filing", type: "procedure", text: `Ab dem ${SK_EMPLOYER_EFILING_EFFECTIVE} gilt für Arbeitgeber die ausschließliche elektronische Einreichung der einschlägigen PD-A1- und Bestimmungsanträge über den bestimmten e-Formularweg der Sociálna poisťovňa.`, sourceKey: "sk-sp-oznamy", passageKey: "sk-sp-oznamy-text", riskLevel: "high" },
  { key: "sk-july-2026-announcement-superseded", category: "filing", type: "exception", text: "Die amtliche Ankündigung eines Starts am 1. Juli 2026 ist nicht das geltende operative Startdatum der ausschließlichen elektronischen Pflicht der Arbeitgeber.", sourceKey: "sk-sp-oznamy", passageKey: "sk-sp-oznamy-text", riskLevel: "high" },
  { key: "sk-august-2026-announcement-superseded", category: "filing", type: "exception", text: "Die amtliche Ankündigung eines Starts am 1. August 2026 ist nicht das geltende operative Startdatum der ausschließlichen elektronischen Pflicht der Arbeitgeber.", sourceKey: "sk-sp-oznamy", passageKey: "sk-sp-oznamy-text", riskLevel: "high" },
  { key: "sk-efiling-employers-not-all-persons", category: "filing", type: "exception", text: "Die ausschließliche e-Formularpflicht ab dem genannten Datum gilt für die Arbeitgeberkategorie der aktuellen amtlichen Regel, nicht pauschal für alle A1-Anträge in der Slowakei.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-szco-individual-other-channels", category: "filing", type: "procedure", text: "SZČO und natürliche Personen behalten nach aktueller amtlicher Führung weitere Einreichungswege, einschließlich persönlich oder per Post, soweit die aktuelle Regel dies vorsieht.", sourceKey: "sk-sp-eformulare", passageKey: "sk-sp-eformulare-text", riskLevel: "high" },
  { key: "sk-foreign-employer-without-e-access", category: "filing", type: "exception", text: "Ausländische Arbeitgeber ohne Zugang zu den slowakischen elektronischen Diensten sind nach aktuellem amtlichem Text von der ausschließlichen elektronischen Pflicht befreit. Der genaue aktuelle Umfang ist vor Gebrauch zu revalidieren.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-24h-not-guarantee", category: "timing", type: "exception", text: "Mögliche automatisierte Ausstellung ausgewählter e-Anträge innerhalb von 24 Stunden ist keine Garantie für jeden Antragsteller und keinen Antragstyp.", sourceKey: "sk-sp-24h", passageKey: "sk-sp-24h-text", riskLevel: "high" },
  { key: "sk-45-day-posting-not-universal", category: "timing", type: "exception", text: "Die Frist von 45 Tagen für bestimmte Entsendungsanträge der Filiale ist keine universelle A1-Frist aller Antragstypen.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-7-day-not-universal", category: "timing", type: "exception", text: "Die Frist von sieben Arbeitstagen für bestimmte Staatsbedienstetenwege ist keine universelle A1-Frist.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "medium" },
  { key: "sk-60-day-hq-not-universal", category: "timing", type: "exception", text: "Die Frist von 60 Tagen ab Eingang bei der Zentrale für bestimmte Mehrstaatenbestimmungen ist keine universelle A1-Frist und keine 24-Stunden-Garantie.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
  { key: "sk-mpsvr-framework-exception-authority", category: "telework", type: "procedure", text: "Wird slowakische Gesetzgebung über die multilaterale Telearbeits-Rahmenvereinbarung beantragt, ist das Ministerium für Arbeit, Soziales und Familie der Slowakischen Republik die Ausnahme- und Vereinbarungsstelle.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "high" },
  { key: "sk-sp-issues-a1-after-exception", category: "telework", type: "procedure", text: "Nach erteilter Rahmenvereinbarungsausnahme beantragt die Person bei der Sociálna poisťovňa das PD A1. Die Poisťovňa ist damit Aussteller, nicht notwendig die Stelle, die die Ausnahme selbst gewährt.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "high" },
  { key: "sk-mpsvr-not-sp", category: "telework", type: "exception", text: "MPSVR SR ist nicht Sociálna poisťovňa. Die Ausnahmekompetenz der Rahmenvereinbarung ist nicht automatisch die A1-Ausstellung.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "high" },
  { key: "sk-framework-max-three-years", category: "telework", type: "definition", text: "Nach aktueller slowakischer Amtsdarstellung kann die Rahmenvereinbarung für höchstens drei Jahre beantragt werden, mit möglichem erneuten Antrag.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "medium" },
  { key: "sk-framework-retro-three-months", category: "telework", type: "definition", text: "Rückwirkung im Rahmen der multilateralen Vereinbarung ist nach aktueller Darstellung grundsätzlich auf drei Monate begrenzt, sofern Beiträge oder sonstiger Schutz im Arbeitgeberstaat vorliegen.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "medium" },
  { key: "sk-at-bilateral-not-this-corridor", category: "telework", type: "exception", text: "Die historische bilaterale Telearbeitsvereinbarung Slowakei-Österreich ist nicht die DE-SK-Route. Dieser Korridor nutzt die multilaterale Rahmenvereinbarung.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "high" },
  { key: "sk-framework-not-self-employed", category: "telework", type: "exception", text: "Die Rahmenvereinbarung gilt nach slowakischer Amtsdarstellung nicht für selbständig tätige Personen.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "high" },
  { key: "sk-framework-not-third-state", category: "telework", type: "exception", text: "Regelmäßige Tätigkeit in einem dritten Staat schließt die Rahmenvereinbarungsroute nach slowakischer Amtsdarstellung aus.", sourceKey: "sk-mpsvr-telework", passageKey: "sk-mpsvr-telework-text", riskLevel: "high" },
  { key: "sk-change-reporting", category: "after", type: "procedure", text: "Änderungen während der Entsendung oder Mehrstaatentätigkeit sind der zuständigen Filiale nach aktuellem Verfahren zu melden. Eine ausgestellte A1-Bescheinigung friert den Sachverhalt nicht ein.", sourceKey: "sk-sp-ako-a1", passageKey: "sk-sp-ako-a1-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

const SHARED_FRESHNESS = "sk-employer-efiling-effective-2026-09-01";
const SHARED_NEG = "sk-citizenship-not-first-institution";

export const SK_AL_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "sk-posting-from-sk-employee-a1", title: "Slowakische Arbeitnehmerentsendung PD A1 2026 führen", trigger: "Slowakischer Arbeitgeber entsendet Beschäftigte vorübergehend, einschließlich nach Deutschland", safeFirstStep: "Sociálna poisťovňa als nationale Ausstellungsstelle führen und EU-Artikel-12-Bedingungen nicht neu bewerten.", riskLevel: "high", dimensions: { what: "sk-sp-posting-from-slovakia", whoWhen: "sk-application-not-entitlement", documents: "sk-ordinary-sk-activity-may-need-a1", how: "sk-branch-contact-fetch-live", next: "sk-application-not-entitlement", deadlines: "sk-45-day-posting-not-universal", problems: "sk-24h-not-guarantee", dutiesAfter: "sk-change-reporting", institution: "sk-sp-posting-from-slovakia", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: "sk-application-not-entitlement" } },
  { key: "sk-posting-from-sk-szco-a1", title: "Slowakische SZČO-Entsendung PD A1 2026 führen", trigger: "SZČO mit gewöhnlicher Tätigkeit in der Slowakei übt vorübergehend ähnliche Tätigkeit in Deutschland aus", safeFirstStep: "Den SZČO-Weg von der Arbeitgeberentsendung trennen und keine universelle elektronische Pflicht unterstellen.", riskLevel: "high", dimensions: { what: "sk-sp-posting-from-slovakia", whoWhen: "sk-szco-individual-other-channels", documents: "sk-application-not-entitlement", how: "sk-szco-individual-other-channels", next: "sk-application-not-entitlement", deadlines: "sk-45-day-posting-not-universal", problems: "sk-efiling-employers-not-all-persons", dutiesAfter: "sk-change-reporting", institution: "sk-sp-posting-from-slovakia", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: "sk-szco-individual-other-channels" } },
  { key: SK_AL_PRIMARY_PROCESS_KEY, title: "Wohnsitz Slowakei Mehrstaatenbestimmung Arbeitnehmer 2026", trigger: "Wohnsitz SK und gewöhnliche Beschäftigung in DE und SK", safeFirstStep: "Sociálna poisťovňa als Wohnstaatstelle führen; Staatsangehörigkeit nicht als Anknüpfung nutzen.", riskLevel: "high", dimensions: { what: "sk-residence-makes-sp-residence-institution", whoWhen: "sk-employee-multi-state-application", documents: "sk-employee-multi-state-application", how: "sk-branch-contact-fetch-live", next: "sk-60-day-hq-not-universal", deadlines: "sk-60-day-hq-not-universal", problems: "sk-citizenship-not-first-institution", dutiesAfter: "sk-change-reporting", institution: "sk-residence-makes-sp-residence-institution", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "sk-residence-multi-state-szco", title: "Wohnsitz Slowakei Mehrstaatenbestimmung SZČO 2026", trigger: "Wohnsitz SK und gewöhnliche Selbständigkeit in mehreren Mitgliedstaaten", safeFirstStep: "Die SZČO-Antragstype wählen und nicht den Arbeitnehmerweg.", riskLevel: "high", dimensions: { what: "sk-szco-multi-state-application", whoWhen: "sk-residence-makes-sp-residence-institution", documents: "sk-szco-multi-state-application", how: "sk-szco-individual-other-channels", next: "sk-60-day-hq-not-universal", deadlines: "sk-60-day-hq-not-universal", problems: "sk-citizenship-not-first-institution", dutiesAfter: "sk-change-reporting", institution: "sk-residence-makes-sp-residence-institution", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "sk-residence-mixed-employed-self-employed", title: "Wohnsitz Slowakei gemischte Mehrstaatenbestimmung 2026", trigger: "Wohnsitz SK, Beschäftigung in einem und Selbständigkeit in einem anderen Mitgliedstaat", safeFirstStep: "Die gemischte Antragstype wählen und nicht beide Reinformen vermengen.", riskLevel: "high", dimensions: { what: "sk-mixed-multi-state-application", whoWhen: "sk-residence-makes-sp-residence-institution", documents: "sk-mixed-multi-state-application", how: "sk-branch-contact-fetch-live", next: "sk-60-day-hq-not-universal", deadlines: "sk-60-day-hq-not-universal", problems: "sk-employer-not-automatic-sk-law", dutiesAfter: "sk-change-reporting", institution: "sk-residence-makes-sp-residence-institution", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: "sk-employer-not-automatic-sk-law" } },
  { key: "sk-non-residence-forward-to-residence-state", title: "Kein slowakischer Wohnsitz: Weiterleitung 2026", trigger: "Slowakischer Arbeitgeber oder Versicherungshistorie, Wohnsitz aber nicht SK", safeFirstStep: "Sociálna poisťovňa nicht als erste Wohnstaatstelle behandeln.", riskLevel: "high", dimensions: { what: "sk-non-residence-not-first-institution", whoWhen: "sk-non-residence-not-first-institution", documents: "sk-branch-contact-fetch-live", how: "sk-non-residence-not-first-institution", next: "sk-non-residence-not-first-institution", deadlines: "sk-60-day-hq-not-universal", problems: "sk-employer-not-automatic-sk-law", dutiesAfter: "sk-change-reporting", institution: "sk-non-residence-not-first-institution", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: "sk-employer-not-automatic-sk-law" } },
  { key: "sk-employer-efiling-temporal-gate", title: "Elektronische Arbeitgeberpflicht ab 1. September 2026", trigger: "Arbeitgeber will PD A1 oder Bestimmungsantrag in der Slowakei einreichen", safeFirstStep: "Das absolute Datum 2026-09-01 anwenden und 1. Juli sowie 1. August 2026 nicht als operative Starts nutzen.", riskLevel: "high", dimensions: { what: "sk-employer-efiling-effective-2026-09-01", whoWhen: "sk-efiling-employers-not-all-persons", documents: "sk-foreign-employer-without-e-access", how: "sk-employer-efiling-effective-2026-09-01", next: "sk-application-not-entitlement", deadlines: SHARED_FRESHNESS, problems: "sk-july-2026-announcement-superseded", dutiesAfter: "sk-change-reporting", institution: "sk-sp-posting-from-slovakia", boundaries: "sk-august-2026-announcement-superseded", freshness: SHARED_FRESHNESS, negatives: "sk-efiling-employers-not-all-persons" } },
  { key: "sk-processing-time-not-universal", title: "Bearbeitungszeiten nicht universell garantieren", trigger: "Antragsteller erwartet 24-Stunden-A1 oder eine einzige gesetzliche Frist", safeFirstStep: "Antragstyp, Kanal und Automatisierung trennen; keine universelle Garantie geben.", riskLevel: "high", dimensions: { what: "sk-24h-not-guarantee", whoWhen: "sk-45-day-posting-not-universal", documents: "sk-60-day-hq-not-universal", how: "sk-24h-not-guarantee", next: "sk-application-not-entitlement", deadlines: "sk-7-day-not-universal", problems: "sk-24h-not-guarantee", dutiesAfter: "sk-change-reporting", institution: "sk-branch-contact-fetch-live", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: "sk-24h-not-guarantee" } },
  { key: "sk-mpsvr-framework-exception", title: "MPSVR-Ausnahme der Telearbeitsrahmenvereinbarung 2026", trigger: "DE-Wohnsitz, SK-Arbeitgeber, Telearbeit im Wohnstaat im Band 25 bis unter 50 Prozent", safeFirstStep: "Antrag im Arbeitgeberstaat Slowakei an MPSVR SR führen, nicht an Sociálna poisťovňa als Ausnahmebehörde.", riskLevel: "high", dimensions: { what: "sk-mpsvr-framework-exception-authority", whoWhen: "sk-framework-max-three-years", documents: "sk-framework-retro-three-months", how: "sk-mpsvr-framework-exception-authority", next: "sk-sp-issues-a1-after-exception", deadlines: "sk-framework-retro-three-months", problems: "sk-framework-not-self-employed", dutiesAfter: "sk-change-reporting", institution: "sk-mpsvr-not-sp", boundaries: "sk-at-bilateral-not-this-corridor", freshness: SHARED_FRESHNESS, negatives: "sk-mpsvr-not-sp" } },
  { key: "sk-sp-a1-after-framework-exception", title: "PD A1 nach MPSVR-Ausnahme bei Sociálna poisťovňa 2026", trigger: "Rahmenvereinbarungsausnahme zugunsten slowakischer Rechtsvorschriften wurde mitgeteilt", safeFirstStep: "Erst nach der Ausnahme das PD A1 bei Sociálna poisťovňa beantragen.", riskLevel: "high", dimensions: { what: "sk-sp-issues-a1-after-exception", whoWhen: "sk-application-not-entitlement", documents: "sk-sp-issues-a1-after-exception", how: "sk-branch-contact-fetch-live", next: "sk-application-not-entitlement", deadlines: "sk-45-day-posting-not-universal", problems: "sk-mpsvr-not-sp", dutiesAfter: "sk-change-reporting", institution: "sk-sp-issues-a1-after-exception", boundaries: "sk-framework-not-third-state", freshness: SHARED_FRESHNESS, negatives: "sk-application-not-entitlement" } },
  { key: "sk-change-and-reexam-route", title: "Änderungs- und Überprüfungsweg Sociálna poisťovňa 2026", trigger: "Sachverhalt ändert sich nach Antrag oder Ausstellung", safeFirstStep: "Zurück zur zuständigen Filiale; A1 nicht als eingefroren behandeln.", riskLevel: "high", dimensions: { what: "sk-change-reporting", whoWhen: "sk-change-reporting", documents: "sk-change-reporting", how: "sk-branch-contact-fetch-live", next: "sk-change-reporting", deadlines: "sk-change-reporting", problems: "sk-application-not-entitlement", dutiesAfter: "sk-change-reporting", institution: "sk-sp-posting-from-slovakia", boundaries: "sk-source-not-german-law", freshness: SHARED_FRESHNESS, negatives: "sk-application-not-entitlement" } },
  { key: "sk-authority-current-process", title: "Aktuellen slowakischen Kanal und Filiale live prüfen", trigger: "Nutzer verlangt genaue Filiale, Formular-URL oder heutige Einreichungspflicht", safeFirstStep: "Kontakt und Formular live holen; überholte Juli- und August-Ankündigungen nicht anwenden.", riskLevel: "high", dimensions: { what: "sk-branch-contact-fetch-live", whoWhen: "sk-july-2026-announcement-superseded", documents: "sk-foreign-employer-without-e-access", how: "sk-branch-contact-fetch-live", next: "sk-szco-individual-other-channels", deadlines: SHARED_FRESHNESS, problems: "sk-august-2026-announcement-superseded", dutiesAfter: "sk-change-reporting", institution: "sk-branch-contact-fetch-live", boundaries: "sk-locale-not-jurisdiction", freshness: SHARED_FRESHNESS, negatives: "sk-locale-not-jurisdiction" } },
]);

export const SK_AL_NEGATIVE_CONTROLS = Object.freeze([
  "sk-citizenship-not-first-institution",
  "sk-locale-not-jurisdiction",
  "sk-employer-not-automatic-sk-law",
  "sk-non-residence-not-first-institution",
  "sk-application-not-entitlement",
  "sk-mpsvr-not-sp",
  "sk-efiling-employers-not-all-persons",
  "sk-july-2026-announcement-superseded",
  "sk-august-2026-announcement-superseded",
  "sk-24h-not-guarantee",
  "sk-framework-not-self-employed",
  "sk-framework-not-third-state",
  "sk-at-bilateral-not-this-corridor",
  "sk-source-not-german-law",
]);

export function buildSkApplicableLegislationAdapterPack(): CuratedForeignNationalAdapterPack {
  const trustDomain = item("trustDomain", "sk", {
    code: "sk" as const, name: "Slowakische Republik",
  });
  const jurisdiction = item("jurisdictions", "sk", {
    level: "foreign_national" as const, code: "SK" as const, countryCode: "SK" as const,
    name: "Slowakische Republik",
  });
  const scope = item("territorialScopes", "sk", {
    type: "foreign_national",
    jurisdictionIds: [jurisdiction.id],
    landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    sp: item("publishers", "socialna-poistovna", {
      name: "Sociálna poisťovňa", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    mpsvr: item("publishers", "mpsvr-sr", {
      name: "Ministerstvo práce, sociálnych vecí a rodiny SR", type: "foreign_national_ministry",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    slovlex: item("publishers", "slov-lex", {
      name: "Slov-Lex", type: "foreign_national_publication",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    sp: item("authorities", "socialna-poistovna-authority", {
      publisherId: publishers.sp.id, name: "Sociálna poisťovňa", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.socpoist.sk",
    }),
    mpsvr: item("authorities", "mpsvr-sr-authority", {
      publisherId: publishers.mpsvr.id, name: "MPSVR SR", type: "foreign_national_ministry",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.employment.gov.sk",
    }),
    slovlex: item("authorities", "slov-lex-authority", {
      publisherId: publishers.slovlex.id, name: "Slov-Lex", type: "foreign_national_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.slov-lex.sk",
    }),
  };
  const publisherOf = { sp: publishers.sp, mpsvr: publishers.mpsvr, slovlex: publishers.slovlex };
  const authorityOf = { sp: authorities.sp, mpsvr: authorities.mpsvr, slovlex: authorities.slovlex };

  const sources = SK_AL_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publisherOf[spec.publisherKey];
    const authority = authorityOf[spec.publisherKey];
    const origin = `https://${spec.officialDomain}`;
    const source = item("sources", spec.key, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: spec.sourceType, purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: origin,
      sourceClass: spec.sourceClass, authorityLevel: "SPECIFIC_AUTHORITY",
      retrievalMethod: spec.retrievalMethod, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false, publicationIdentifier: spec.title,
      sourceLanguage: "sk",
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id, versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text),
      language: "sk",
    }));
    const riskClass = spec.handlingMode === "FETCH_LIVE" ? "MEDIUM" : spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? "HIGH" : "MEDIUM";
    const staleBehavior = spec.handlingMode === "FETCH_LIVE" ? "REVALIDATE_BEFORE_USE" : spec.staleBehavior;
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior,
      requiredContextKeys: spec.handlingMode === "FETCH_LIVE" ? ["COUNTRY", "RESIDENCE_STATE"] : ["RESIDENCE_STATE", "WORK_STATE"],
      riskClass,
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));

  const claims = SK_AL_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`SK_AL_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type, text: unit.text, jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id, authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel, requiresEffectiveDate: unit.key.includes("2026-09-01"),
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
      originalLanguage: "sk",
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim", entityId: claim.id, status: "fresh",
      effectiveDateKnown: unit.key.includes("2026-09-01"),
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });

  const processes = SK_AL_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: SK_AL_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  const addLink = (processKey: string, claimKey: string, role: string) => {
    const token = `${processKey}:${claimKey}:${role}`;
    if (seen.has(token)) return;
    const stored = processByKey.get(processKey);
    const claim = claimByKey.get(claimKey);
    if (!stored || !claim) throw new Error(`SK_AL_PROCESS_CLAIM_MISSING:${processKey}:${claimKey}`);
    seen.add(token);
    processClaimLinks.push(item("processClaimLinks", token, {
      processId: stored.id, claimId: claim.id, role, required: true,
      sequenceContext: role, qualificationRequired: false,
    }));
  };
  for (const process of SK_AL_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      addLink(process.key, process.dimensions[dimension], dimension);
    }
  }

  return Object.freeze({
    schemaVersion: 1,
    packId: SK_AL_PACK_ID,
    countryCode: "SK" as const,
    canonicalLanguage: SK_AL_CANONICAL_LANGUAGE,
    trustDomain: trustDomain as CuratedForeignNationalAdapterPack["trustDomain"],
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.sp, publishers.mpsvr, publishers.slovlex],
    authorities: [authorities.sp, authorities.mpsvr, authorities.slovlex],
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

export function skAlPackSummary(pack: CuratedForeignNationalAdapterPack = buildSkApplicableLegislationAdapterPack()) {
  return Object.freeze({
    packId: pack.packId,
    claimCount: pack.claims.length,
    processCount: pack.processes.length,
    linkCount: pack.processClaimLinks.length,
    eFilingClassification: classifySkEmployerEfiling(),
    eFilingEffective: SK_EMPLOYER_EFILING_EFFECTIVE,
    validation: validateForeignNationalAdapterPack(pack),
  });
}
