/**
 * CB-0H Slovak national adapter for family benefits (prídavok / rodičovský príspevok).
 * EU Articles 67–68 remain in eu_family_benefits_coordination. This pack stores
 * Slovak family-benefit truth and ÚPSVaR routing only. Sociálna poisťovňa is not
 * the family-benefit institution.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  SK_FAMILY_ADAPTER_PACK_ID,
  SK_FAMILY_ADAPTER_PROCESS_GROUP,
  validateForeignNationalAdapterPack,
  type CuratedForeignNationalAdapterPack,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(SK_FAMILY_ADAPTER_PACK_ID, entityClass, key),
    ...values,
  });
}

export const SK_FAMILY_PACK_ID = SK_FAMILY_ADAPTER_PACK_ID;
export const SK_FAMILY_PROCESS_GROUP = SK_FAMILY_ADAPTER_PROCESS_GROUP;
export const SK_FAMILY_CANONICAL_LANGUAGE = "de" as const;
export const SK_FAMILY_PRIMARY_PROCESS_KEY = "sk-child-application" as const;
export const SK_FAMILY_AUTHORITY_ROLE = "SK_UPSVAR_FAMILY_BENEFITS" as const;

export const SK_FAMILY_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "sk-fb-act-600-2003",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2003/600/",
    title: "Slov-Lex: Gesetz 600/2003 Z. z. über den Kinderzuschlag (prídavok na dieťa)",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-fb-act-600-2003-text",
      locator: "Gesetz 600/2003 Z. z.",
      text: "Der prídavok na dieťa nach dem Gesetz 600/2003 ist die maßgebliche slowakische Familienleistung für die unionsrechtliche Koordinierung; der bloße Name klassifiziert die Leistung nicht. Anspruchsberechtigt sind Eltern, Personen mit Pflege und unter den gesetzlichen Voraussetzungen ein erwachsenes abhängiges Kind. Nezaopatrené dieťa folgt den gesetzlichen Bedingungen und nicht automatisch bis zum 25. Lebensjahr. Die Pflege des Kindes ist Voraussetzung. Die unionsrechtliche Koordinierung kann den slowakischen Wohnsitz ersetzen; der Wohnsitz des Kindes in der Slowakei begründet keinen automatischen Anspruch. Selbständige Tätigkeit oder živnosť begründet den Kinderzuschlag nicht automatisch. Es wird nur eine Zahlung je Kind je Kalendermonat geleistet. Der schriftliche oder elektronische Antrag (ZEP) geht an den Úrad práce, sociálnych vecí a rodiny nach Wohnsitz. Die Leistung wird für den ganzen Kalendermonat gezahlt, auch wenn die Voraussetzungen nur einen Teil des Monats vorliegen; Rückstände folgen im nächsten Monat. Änderungen einschließlich des Beschäftigungsstaats des anderen Elternteils sind binnen acht Tagen zu melden. Ústredie ist Koordinierungs- und Kontaktstelle, nicht der universelle Auszahler in Bratislava. Sociálna poisťovňa und Krankenversicherungen sind nicht der Familienleistungsträger. Diese Sätze wiederholen nicht die materiellen Artikel 67 und 68.",
    }],
  },
  {
    key: "sk-fb-mpsvr-child",
    publisherKey: "mpsvr" as const,
    officialDomain: "www.employment.gov.sk",
    url: "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/pridavok-dieta/",
    title: "MPSVR: Prídavok na dieťa",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-fb-mpsvr-child-text",
      locator: "Prídavok na dieťa MPSVR",
      text: "Das Ministerium erläutert den prídavok na dieťa als Geldleistung für die Erziehung eines abhängigen Kindes. Der inländische Zuschlag für die erste Klasse der Grundschule wird häufig automatisch aus Schul- und Ministeriumsdaten gezahlt, regelmäßig im Oktober für den September. Das ist kein automatischer grenzüberschreitender Zuschlag. Aktuelle Formulare und Kanäle sind live zu prüfen. Antrag ist nicht bereits genehmigter Anspruch.",
    }],
  },
  {
    key: "sk-fb-mpsvr-child-amount",
    publisherKey: "mpsvr" as const,
    officialDomain: "www.employment.gov.sk",
    url: "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/pridavok-dieta/vyska-pridavku.html",
    title: "MPSVR: Höhe des prídavok na dieťa",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-fb-mpsvr-child-amount-text",
      locator: "Výška prídavku",
      text: "Der prídavok na dieťa beträgt mit Stand 1. September 2026 60 Euro je berechtigtes Kind und Kalendermonat; dieser Betrag ist nicht zeitlos. Im Kalendermonat des ersten Eintritts in die erste Klasse der Grundschule erhöht sich die Leistung um 110 Euro auf 170 Euro in diesem Monat. Beträge sind vor einer konkreten Auskunft zu revalidieren und nicht als ewige Sätze zu speichern. Der Kalendermonat ist die Zahlungsperiode des Kinderzuschlags, nicht ein Lebensmonat.",
    }],
  },
  {
    key: "sk-fb-upsvr-forms",
    publisherKey: "upsvr" as const,
    officialDomain: "www.upsvr.gov.sk",
    url: "https://www.upsvr.gov.sk/vzory-ziadosti/vzory-ziadosti-pre-oblast-socialnych-veci-a-rodiny/pridavok-na-dieta-a-priplatok-k-pridavku-na-dieta.html?page_id=712069",
    title: "ÚPSVaR: Antragsmuster prídavok na dieťa und príplatok",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "sk-fb-upsvr-forms-text",
      locator: "Vzory žiadostí ÚPSVaR",
      text: "Die Kategorie SK_UPSVAR_FAMILY_BENEFITS ist der Úrad práce, sociálnych vecí a rodiny. Die genaue Amtsinstanz, Formulare und Kanäle sind live zu prüfen. Erhält die berechtigte Person den Kinderzuschlag in einem anderen Mitgliedstaat, ist der Zuschlag für die erste Klasse nicht automatisch; es ist der ÚPSVaR-Antrag für unionsrechtliche Empfänger zu stellen. Antrag oder Formularvorlage ist nicht Genehmigung. Nachweise ausländischer Familienleistungen gehören zum Verfahren.",
    }],
  },
  {
    key: "sk-fb-upsvr-eu-instruction",
    publisherKey: "upsvr" as const,
    officialDomain: "www.upsvr.gov.sk",
    url: "https://www.upsvr.gov.sk/buxus/docs/SSVaR/statne_soc.davky/Poucenie_o_rodinnych_davkach_EU.pdf",
    title: "ÚPSVaR: Poučenie o rodinných dávkach v rámci EÚ",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-fb-upsvr-eu-instruction-text",
      locator: "Poučenie ÚPSVaR EU",
      text: "Für die Koordinierung der Familienleistungen gilt als beschäftigte oder selbständig tätige Person, wer eine solche Tätigkeit oder eine gleichgestellte Lage nach dem Sozialversicherungsrecht des Tätigkeitsstaats ausübt. Vereinfacht können Steuern und Sozialversicherungsbeiträge als Hinweis dienen. Bei SZČO ohne Beitragspflicht ist die tatsächliche Ausübung der Tätigkeit nachzuweisen, etwa durch Steuererklärung oder Rechnungen. Die bloße Registrierung einer živnosť ersetzt den Tätigkeitsnachweis nicht. Gesellschaftsstellung als konateľ ohne Beschäftigung ist nicht automatisch selbständige Tätigkeit.",
    }],
  },
  {
    key: "sk-fb-act-571-2009",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2009/571/",
    title: "Slov-Lex: Gesetz 571/2009 Z. z. über den Elternbeitrag (rodičovský príspevok)",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-fb-act-571-2009-text",
      locator: "Gesetz 571/2009 Z. z.",
      text: "Der rodičovský príspevok nach dem Gesetz 571/2009 ist die maßgebliche slowakische Eltern-Familienleistung für die unionsrechtliche Koordinierung. Materské ist Krankengeld/Mutterschaftsgeld und nicht die Familienleistungskategorie des Artikels 68. Anspruchsberechtigt ist die gesetzlich bestimmte Person mit regelmäßiger Pflege. Die Altersgrenze beträgt regelmäßig drei Jahre, sechs Jahre bei langfristig ungünstigem Gesundheitszustand oder in den Grenzen der Ersatzpflege. Wohnsitz in der Slowakei oder unionsrechtliche Koordinierung kann die Anknüpfung tragen. Selbständige Tätigkeit schließt den Elternbeitrag nicht automatisch aus und begründet ihn nicht automatisch. Es besteht ein Anspruch je Familie. Kein Anspruch besteht, wenn mindestens eine berechtigte Person materské oder ein vergleichbares Mutterschaftsgeld eines Mitgliedstaats bezieht, dessen voller Kalendermonatsbetrag den Elternbeitrag übersteigt; Ausnahme: Vater innerhalb von sechs Wochen nach der Geburt oder verlängerter Krankenhausaufenthalt. Ausländisches Mutterschaftsgeld schließt nicht automatisch aus; Betrag und Ausnahmetatsachen sind erforderlich. Änderungen sind zu melden. Der Elternbeitrag kopiert nicht das BEEG. Der Kalendermonat ist die Periode dieser Leistung.",
    }],
  },
  {
    key: "sk-fb-mpsvr-parental",
    publisherKey: "mpsvr" as const,
    officialDomain: "www.employment.gov.sk",
    url: "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/rodicovsky-prispevok/",
    title: "MPSVR: Rodičovský príspevok",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-fb-mpsvr-parental-text",
      locator: "Rodičovský príspevok MPSVR",
      text: "Der rodičovský príspevok beträgt ab 1. Januar 2026 und mit Stand 1. September 2026 364,80 Euro, wenn für dasselbe Kind kein vorheriges materské oder vergleichbares Mutterschaftsgeld eines Mitgliedstaats bezogen wurde; 500,10 Euro, wenn solches Mutterschaftsgeld voranging. Diese Beträge sind nicht zeitlos. Bei Mehrlingsgeburt steigt der Betrag um 25 Prozent je weiteres Kind derselben Geburt. Versäumt ein anderes Kind die Schulpflicht, kann der Satz unter den gesetzlichen Voraussetzungen um 50 Prozent sinken. Der Antrag geht an ÚPSVaR. Der Kalendermonat ist nicht der deutsche Lebensmonat.",
    }],
  },
  {
    key: "sk-fb-mpsvr-priplatok",
    publisherKey: "mpsvr" as const,
    officialDomain: "www.mpsvr.sk",
    url: "https://www.mpsvr.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/priplatok-k-pridavku-dieta/",
    title: "MPSVR: Príplatok k prídavku na dieťa",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-fb-mpsvr-priplatok-text",
      locator: "Príplatok k prídavku",
      text: "Der príplatok k prídavku na dieťa nach dem Gesetz 600/2003 ist ein laufender Geldzuschlag von 30 Euro mit Stand 2026 für Erziehung und Ernährung eines abhängigen Kindes, wenn der Steuerbonus nicht in Anspruch genommen werden kann. Selbständige oder sonstige Erwerbstätigkeit begründet den príplatok nicht automatisch; der nationale Anspruch bleibt an den nicht in Anspruch genommenen Steuerbonus und die übrigen gesetzlichen Voraussetzungen gebunden. Er ist FAMILY_BENEFIT_CURRENT und in den F3-Korb aufzunehmen, sobald der nationale Anspruch verifiziert ist. Ist der Anspruch unbekannt, bleibt MANUAL_REVIEW; ein stilles Weglassen aus der genauen Differenz ist nicht zulässig. Der Betrag ist nicht zeitlos.",
    }],
  },
  {
    key: "sk-fb-act-201-2008",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2008/201/",
    title: "Slov-Lex: Gesetz 201/2008 Z. z. náhradné výživné",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-fb-act-201-2008-text",
      locator: "Gesetz 201/2008 Z. z.",
      text: "Náhradné výživné nach dem Gesetz 201/2008 ist Unterhaltsvorschuss. Historisch Anhang I Teil I zum früheren 452/2004, bleibt die Leistung EXCLUDED_ANNEX_I und nicht Familienleistung nach Artikel 1 Buchstabe z. Sie gehört nicht in den koordinierten Familienleistungskorb.",
    }],
  },
  {
    key: "sk-fb-act-383-2013",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2013/383/",
    title: "Slov-Lex: Gesetz 383/2013 Z. z. príspevok pri narodení dieťaťa",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-fb-act-383-2013-text",
      locator: "Gesetz 383/2013 Z. z.",
      text: "Der príspevok pri narodení dieťaťa nach dem Gesetz 383/2013 ist eine besondere Geburtsbeihilfe und EXCLUDED_ANNEX_I. Der Geburtszuschlag für gleichzeitig geborene Kinder ist ebenfalls EXCLUDED_ANNEX_I. Keine dieser Zahlungen ist eine nach den Familienleistungsregeln zu koordinierende Leistung.",
    }],
  },
  {
    key: "sk-fb-act-561-2008",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2008/561/",
    title: "Slov-Lex: Gesetz 561/2008 Z. z. príspevok na starostlivosť o dieťa",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-fb-act-561-2008-text",
      locator: "Gesetz 561/2008 Z. z.",
      text: "Der príspevok na starostlivosť o dieťa nach dem Gesetz 561/2008 trägt den Namen einer Kinderbetreuungsleistung, ist aber nicht automatisch Artikel 1 Buchstabe z. Die Einordnung erfordert CLASSIFICATION_REQUIRES_AUTHORITY. Der Name ist kein Klassifikator und kein vollständiger nationaler Teilkern.",
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

export const SK_FAMILY_UNITS: readonly Unit[] = Object.freeze([
  { key: "sk-child-is-family-benefit", category: "classification", type: "definition", text: "Der prídavok na dieťa nach dem Gesetz 600/2003 ist die maßgebliche slowakische Familienleistung für die unionsrechtliche Koordinierung; der bloße Name entscheidet nicht.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-eligible-person", category: "eligibility", type: "definition", text: "Anspruchsberechtigt für den Kinderzuschlag sind Eltern, Personen mit Pflege und unter den gesetzlichen Voraussetzungen ein erwachsenes abhängiges Kind.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-dependent-child", category: "eligibility", type: "exception", text: "Nezaopatrené dieťa folgt den gesetzlichen Bedingungen und gilt nicht automatisch bis zum 25. Lebensjahr.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-care-condition", category: "eligibility", type: "definition", text: "Die Pflege des Kindes ist Voraussetzung des slowakischen Kinderzuschlags.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-eu-coord-not-sk-residence-only", category: "eligibility", type: "exception", text: "Die unionsrechtliche Koordinierung kann den slowakischen Wohnsitz ersetzen; der Wohnsitz des Kindes in der Slowakei begründet keinen automatischen Anspruch.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-one-payment-per-child", category: "payment", type: "definition", text: "Für denselben Kalendermonat wird nur eine Zahlung des Kinderzuschlags je Kind geleistet.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "medium" },
  { key: "sk-child-application", category: "procedure", type: "procedure", text: "Der schriftliche oder elektronische Antrag (ZEP) auf den Kinderzuschlag geht an den Úrad práce, sociálnych vecí a rodiny nach Wohnsitz.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-payment", category: "payment", type: "procedure", text: "Der Kinderzuschlag wird für den ganzen Kalendermonat gezahlt, auch wenn die Voraussetzungen nur einen Teil des Monats vorliegen; Rückstände folgen im nächsten Monat.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "medium" },
  { key: "sk-child-change-8-days", category: "change", type: "procedure", text: "Änderungen einschließlich des Beschäftigungsstaats des anderen Elternteils sind binnen acht Tagen zu melden.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-amount-60-2026", category: "amount", type: "definition", text: "Der prídavok na dieťa beträgt mit Stand 1. September 2026 60 Euro je berechtigtes Kind und Kalendermonat; dieser Betrag ist nicht zeitlos.", sourceKey: "sk-fb-mpsvr-child-amount", passageKey: "sk-fb-mpsvr-child-amount-text", riskLevel: "high" },
  { key: "sk-child-first-grader-110", category: "amount", type: "definition", text: "Im Kalendermonat des ersten Eintritts in die erste Klasse der Grundschule erhöht sich der Kinderzuschlag um 110 Euro auf 170 Euro in diesem Monat; das ist nicht zeitlos.", sourceKey: "sk-fb-mpsvr-child-amount", passageKey: "sk-fb-mpsvr-child-amount-text", riskLevel: "high" },
  { key: "sk-child-first-grader-domestic-automatic", category: "procedure", type: "procedure", text: "Die inländische Zahlung des Erstklässlerzuschlags erfolgt häufig automatisch aus Schul- und Ministeriumsdaten, regelmäßig im Oktober für den September.", sourceKey: "sk-fb-mpsvr-child", passageKey: "sk-fb-mpsvr-child-text", riskLevel: "medium" },
  { key: "sk-child-first-grader-eu-requires-application", category: "procedure", type: "exception", text: "Erhält die berechtigte Person den Kinderzuschlag in einem anderen Mitgliedstaat, ist der Erstklässlerzuschlag nicht automatisch; der ÚPSVaR-Antrag für unionsrechtliche Empfänger ist erforderlich.", sourceKey: "sk-fb-upsvr-forms", passageKey: "sk-fb-upsvr-forms-text", riskLevel: "high" },
  { key: "sk-child-not-from-child-residence-alone", category: "eligibility", type: "exception", text: "Allein der Wohnsitz des Kindes in der Slowakei begründet keinen slowakischen Kinderzuschlagsanspruch.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-child-szco-not-automatic-entitlement", category: "eligibility", type: "exception", text: "Selbständige Tätigkeit oder živnosť begründet den slowakischen Kinderzuschlag nicht automatisch.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-fb-upsvar-role", category: "institution", type: "definition", text: "SK_UPSVAR_FAMILY_BENEFITS ist der Úrad práce, sociálnych vecí a rodiny als slowakischer Familienleistungsträger.", sourceKey: "sk-fb-upsvr-forms", passageKey: "sk-fb-upsvr-forms-text", riskLevel: "high" },
  { key: "sk-fb-upsvar-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue ÚPSVaR-Amtsinstanz, Anschrift und Formulare sind live zu prüfen und nicht ohne Frische festzuschreiben.", sourceKey: "sk-fb-upsvr-forms", passageKey: "sk-fb-upsvr-forms-text", riskLevel: "medium" },
  { key: "sk-fb-ustredie-not-universal-payer", category: "institution", type: "exception", text: "Ústredie práce, sociálnych vecí a rodiny ist Koordinierungs- und Kontaktstelle, nicht der universelle Auszahler in Bratislava.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-fb-not-socialna-poistovna", category: "institution", type: "exception", text: "Sociálna poisťovňa ist nicht der slowakische Träger von Kinderzuschlag oder Elternbeitrag.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-fb-not-health-insurer", category: "institution", type: "exception", text: "Eine öffentliche Krankenversicherung ist nicht der slowakische Familienleistungsträger.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-fb-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese slowakischen Familiensätze wiederholen nicht die materiellen Artikel 67 bis 69. Die rechtliche Einordnung bleibt im geteilten EU-Familienkern.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-fb-name-not-classifier", category: "classification", type: "exception", text: "Der Leistungsname mit Kind oder Familie klassifiziert die slowakische Zahlung nicht automatisch als koordinierte Familienleistung.", sourceKey: "sk-fb-act-600-2003", passageKey: "sk-fb-act-600-2003-text", riskLevel: "high" },
  { key: "sk-parental-is-family-benefit", category: "classification", type: "definition", text: "Der rodičovský príspevok nach dem Gesetz 571/2009 ist die maßgebliche slowakische Eltern-Familienleistung für die unionsrechtliche Koordinierung.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-not-materske", category: "classification", type: "exception", text: "Materské ist Krankengeld oder Mutterschaftsgeld und nicht die Familienleistungskategorie des Artikels 68.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-eligible-person", category: "eligibility", type: "definition", text: "Anspruchsberechtigt für den Elternbeitrag ist die gesetzlich bestimmte Person, nicht jede Person mit Kind automatisch.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-regular-care", category: "eligibility", type: "definition", text: "Regelmäßige Pflege des Kindes ist Voraussetzung des rodičovský príspevok.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-child-age", category: "eligibility", type: "definition", text: "Der Elternbeitrag reicht regelmäßig bis drei Jahre, bis sechs Jahre bei langfristig ungünstigem Gesundheitszustand oder in den Grenzen der Ersatzpflege.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-residence-or-eu", category: "eligibility", type: "definition", text: "Wohnsitz in der Slowakei oder unionsrechtliche Koordinierung kann die Anknüpfung des Elternbeitrags tragen; Wohnsitz allein genügt nicht stillschweigend.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-one-family-entitlement", category: "eligibility", type: "exception", text: "Für denselben Zeitraum besteht nur ein Elternbeitragsanspruch je Familie, nicht zwei volle Ansprüche.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-amount-364-80-2026", category: "amount", type: "definition", text: "Der rodičovský príspevok beträgt ab 1. Januar 2026 und mit Stand 1. September 2026 364,80 Euro, wenn für dasselbe Kind kein vorheriges materské oder vergleichbares Mutterschaftsgeld eines Mitgliedstaats bezogen wurde; der Betrag ist nicht zeitlos.", sourceKey: "sk-fb-mpsvr-parental", passageKey: "sk-fb-mpsvr-parental-text", riskLevel: "high" },
  { key: "sk-parental-amount-500-10-2026", category: "amount", type: "definition", text: "Der rodičovský príspevok beträgt mit Stand 1. September 2026 500,10 Euro, wenn für dasselbe Kind zuvor materské oder ein vergleichbares Mutterschaftsgeld eines Mitgliedstaats bezogen wurde; der Betrag ist nicht zeitlos.", sourceKey: "sk-fb-mpsvr-parental", passageKey: "sk-fb-mpsvr-parental-text", riskLevel: "high" },
  { key: "sk-parental-multiple-birth-increase", category: "amount", type: "definition", text: "Bei Mehrlingsgeburt steigt der Elternbeitrag um 25 Prozent je weiteres Kind derselben Geburt.", sourceKey: "sk-fb-mpsvr-parental", passageKey: "sk-fb-mpsvr-parental-text", riskLevel: "medium" },
  { key: "sk-parental-school-attendance-reduction", category: "amount", type: "exception", text: "Versäumt ein anderes Kind die Schulpflicht, kann der Elternbeitrag unter den gesetzlichen Voraussetzungen um 50 Prozent sinken.", sourceKey: "sk-fb-mpsvr-parental", passageKey: "sk-fb-mpsvr-parental-text", riskLevel: "high" },
  { key: "sk-parental-application", category: "procedure", type: "procedure", text: "Der Antrag auf rodičovský príspevok geht an den Úrad práce, sociálnych vecí a rodiny; aktuelle Formulare sind live zu prüfen.", sourceKey: "sk-fb-mpsvr-parental", passageKey: "sk-fb-mpsvr-parental-text", riskLevel: "high" },
  { key: "sk-parental-change-reporting", category: "change", type: "procedure", text: "Änderungen der Pflege, des Wohnsitzes, des Mutterschaftsgeldes oder der Familiensituation sind für den Elternbeitrag zu melden.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-maternity-amount-gate", category: "eligibility", type: "exception", text: "Kein Anspruch auf den Elternbeitrag besteht, wenn mindestens eine berechtigte Person materské oder vergleichbares Mutterschaftsgeld eines Mitgliedstaats bezieht, dessen voller Kalendermonatsbetrag den Elternbeitrag übersteigt; Ausnahme: Vater innerhalb von sechs Wochen nach der Geburt oder verlängerter Krankenhausaufenthalt.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-parental-maternity-not-automatic-exclusion", category: "eligibility", type: "exception", text: "Ausländisches Mutterschaftsgeld schließt den Elternbeitrag nicht automatisch aus; Betrag und Ausnahmetatsachen sind erforderlich.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-parental-not-elterngeld-copy", category: "boundary", type: "boundary", text: "Der slowakische Elternbeitrag kopiert nicht das deutsche Elterngeld nach dem BEEG und ist kein Lebensmonatsmodell.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-szco-not-automatic-exclusion", category: "eligibility", type: "exception", text: "Selbständige Tätigkeit schließt den rodičovský príspevok nicht automatisch aus.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-parental-szco-not-automatic-entitlement", category: "eligibility", type: "exception", text: "Selbständige Tätigkeit begründet den rodičovský príspevok nicht automatisch.", sourceKey: "sk-fb-act-571-2009", passageKey: "sk-fb-act-571-2009-text", riskLevel: "high" },
  { key: "sk-fb-employee-or-szco-activity-facts", category: "eligibility", type: "definition", text: "Für slowakische Koordinierungsfakten zählen Beschäftigung oder selbständige Tätigkeit, nicht nur ein Arbeitsvertrag.", sourceKey: "sk-fb-upsvr-eu-instruction", passageKey: "sk-fb-upsvr-eu-instruction-text", riskLevel: "high" },
  { key: "sk-fb-szco-real-activity-evidence", category: "procedure", type: "procedure", text: "Bei SZČO ohne Beitragspflicht ist die tatsächliche Ausübung der Tätigkeit nachzuweisen, etwa durch Steuererklärung oder Rechnungen; die Registrierung einer živnosť reicht nicht.", sourceKey: "sk-fb-upsvr-eu-instruction", passageKey: "sk-fb-upsvr-eu-instruction-text", riskLevel: "high" },
  { key: "sk-fb-company-owner-not-automatic-szco", category: "eligibility", type: "exception", text: "Gesellschaftsstellung als konateľ ohne Beschäftigung ist nicht automatisch selbständige Tätigkeit für Familienleistungskoordinierung.", sourceKey: "sk-fb-upsvr-eu-instruction", passageKey: "sk-fb-upsvr-eu-instruction-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-priplatok-family-benefit-current", category: "classification", type: "definition", text: "Der príplatok k prídavku nach dem Gesetz 600/2003 ist FAMILY_BENEFIT_CURRENT als Geldzuschlag für Erziehung und Ernährung eines abhängigen Kindes, wenn der Steuerbonus nicht in Anspruch genommen werden kann; er gehört in den F3-Korb, sobald der nationale Anspruch verifiziert ist, sonst MANUAL_REVIEW, nicht stilles Weglassen.", sourceKey: "sk-fb-mpsvr-priplatok", passageKey: "sk-fb-mpsvr-priplatok-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-priplatok-amount-30-2026", category: "amount", type: "definition", text: "Der príplatok k prídavku beträgt mit Stand 2026 30 Euro je berechtigtes Kind und Kalendermonat; der Betrag ist nicht zeitlos.", sourceKey: "sk-fb-mpsvr-priplatok", passageKey: "sk-fb-mpsvr-priplatok-text", riskLevel: "high" },
  { key: "sk-priplatok-not-automatic-from-gainful-activity", category: "eligibility", type: "exception", text: "Selbständige oder sonstige Erwerbstätigkeit begründet den príplatok nicht automatisch; der nationale Anspruch bleibt an den nicht in Anspruch genommenen Steuerbonus gebunden.", sourceKey: "sk-fb-mpsvr-priplatok", passageKey: "sk-fb-mpsvr-priplatok-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-childcare-classification-requires-authority", category: "classification", type: "procedure", text: "Der príspevok na starostlivosť o dieťa nach dem Gesetz 561/2008 erfordert CLASSIFICATION_REQUIRES_AUTHORITY; der Name ist nicht Artikel 1 Buchstabe z und kein vollständiger nationaler Teilkern.", sourceKey: "sk-fb-act-561-2008", passageKey: "sk-fb-act-561-2008-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-birth-allowance-excluded-annex-i", category: "classification", type: "exception", text: "Der príspevok pri narodení dieťaťa ist EXCLUDED_ANNEX_I und keine nach den Familienleistungsregeln zu koordinierende Leistung.", sourceKey: "sk-fb-act-383-2013", passageKey: "sk-fb-act-383-2013-text", riskLevel: "high" },
  { key: "sk-birth-supplement-excluded-annex-i", category: "classification", type: "exception", text: "Der Geburtszuschlag für gleichzeitig geborene Kinder ist EXCLUDED_ANNEX_I und gehört nicht in den koordinierten Familienleistungskorb.", sourceKey: "sk-fb-act-383-2013", passageKey: "sk-fb-act-383-2013-text", riskLevel: "high" },
  { key: "sk-substitute-maintenance-excluded", category: "classification", type: "exception", text: "Náhradné výživné nach dem Gesetz 201/2008 ist EXCLUDED_ANNEX_I und nicht Familienleistung nach Artikel 1 Buchstabe z.", sourceKey: "sk-fb-act-201-2008", passageKey: "sk-fb-act-201-2008-text", riskLevel: "high" },
  { key: "sk-fb-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle Formulare, Amtsinstanzen und Portale des ÚPSVaR sind live zu prüfen.", sourceKey: "sk-fb-upsvr-forms", passageKey: "sk-fb-upsvr-forms-text", riskLevel: "medium" },
  { key: "sk-fb-application-not-approval", category: "deadline", type: "exception", text: "Antrag oder Vorlage eines Formulars ist nicht bereits genehmigter Anspruch auf den Kinderzuschlag oder Elternbeitrag.", sourceKey: "sk-fb-upsvr-forms", passageKey: "sk-fb-upsvr-forms-text", riskLevel: "high" },
  { key: "sk-fb-amount-not-timeless", category: "amount", type: "exception", text: "Slowakische Familienleistungsbeträge sind nicht zeitlos; vor einer konkreten Auskunft ist der aktuelle amtliche Satz zu revalidieren.", sourceKey: "sk-fb-mpsvr-child-amount", passageKey: "sk-fb-mpsvr-child-amount-text", riskLevel: "high" },
  { key: "sk-child-calendar-month", category: "period", type: "definition", text: "Der slowakische Kinderzuschlag wird nach Kalendermonat gezahlt, nicht nach deutschem Lebensmonat.", sourceKey: "sk-fb-mpsvr-child-amount", passageKey: "sk-fb-mpsvr-child-amount-text", riskLevel: "high" },
  { key: "sk-parental-calendar-month", category: "period", type: "definition", text: "Der rodičovský príspevok wird nach Kalendermonat bemessen, nicht nach Elterngeld-Lebensmonat.", sourceKey: "sk-fb-mpsvr-parental", passageKey: "sk-fb-mpsvr-parental-text", riskLevel: "high" },
]);

export const SK_FAMILY_NEGATIVE_CONTROLS = Object.freeze([
  "sk-fb-not-socialna-poistovna",
  "sk-fb-not-health-insurer",
  "sk-parental-not-materske",
  "sk-birth-allowance-excluded-annex-i",
  "sk-substitute-maintenance-excluded",
  "sk-fb-name-not-classifier",
  "sk-child-not-from-child-residence-alone",
  "sk-child-first-grader-eu-requires-application",
  "sk-fb-amount-not-timeless",
  "sk-parental-maternity-not-automatic-exclusion",
  "sk-child-szco-not-automatic-entitlement",
  "sk-parental-szco-not-automatic-exclusion",
  "sk-parental-szco-not-automatic-entitlement",
  "sk-priplatok-not-automatic-from-gainful-activity",
  "sk-fb-company-owner-not-automatic-szco",
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const SK_FAMILY_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "sk-fb-classify", title: "Slowakische Familienleistung 2026 einordnen", trigger: "Eine slowakische Zahlung mit Kind, Geburt, Pflege oder Elternbezug soll koordiniert werden", safeFirstStep: "Zweck und gesetzliche Grundlage verlangen; Namen nicht als Klassifikator nutzen.", riskLevel: "high", dimensions: { what: "sk-child-is-family-benefit", whoWhen: "sk-fb-name-not-classifier", documents: "sk-fb-channel-fetch-live", how: "sk-parental-is-family-benefit", next: "sk-priplatok-family-benefit-current", deadlines: "sk-fb-amount-not-timeless", problems: "sk-fb-name-not-classifier", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-channel-fetch-live", negatives: "sk-parental-not-materske" } },
  { key: "sk-child-eligibility", title: "Slowakischen Kinderzuschlag 2026 prüfen", trigger: "Prídavok na dieťa wird als Anspruch angeboten", safeFirstStep: "Berechtigte Person, abhängiges Kind und Pflege prüfen; Kindwohnsitz nicht automatisch setzen.", riskLevel: "high", dimensions: { what: "sk-child-is-family-benefit", whoWhen: "sk-child-eligible-person", documents: "sk-fb-channel-fetch-live", how: "sk-child-dependent-child", next: "sk-child-care-condition", deadlines: "sk-child-change-8-days", problems: "sk-child-not-from-child-residence-alone", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-child-eu-coord-not-sk-residence-only", freshness: "sk-fb-channel-fetch-live", negatives: "sk-child-not-from-child-residence-alone" } },
  { key: SK_FAMILY_PRIMARY_PROCESS_KEY, title: "Slowakischen Kinderzuschlag 2026 beantragen", trigger: "Antrag auf prídavok na dieťa bei ÚPSVaR", safeFirstStep: "An das örtliche ÚPSVaR nach Wohnsitz verweisen, nicht an Sociálna poisťovňa.", riskLevel: "high", dimensions: { what: "sk-child-application", whoWhen: "sk-child-eligible-person", documents: "sk-fb-channel-fetch-live", how: "sk-child-application", next: "sk-fb-application-not-approval", deadlines: "sk-child-change-8-days", problems: "sk-fb-application-not-approval", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-upsvar-instance-fetch-live", negatives: "sk-fb-not-socialna-poistovna" } },
  { key: "sk-child-payment-change", title: "Kinderzuschlag Zahlung und Änderung 2026", trigger: "Auszahlung, Rückstand oder Änderung des Kinderzuschlags", safeFirstStep: "Kalendermonat und Meldepflicht von acht Tagen führen; Beträge nicht zeitlos setzen.", riskLevel: "high", dimensions: { what: "sk-child-payment", whoWhen: "sk-child-one-payment-per-child", documents: "sk-fb-channel-fetch-live", how: "sk-child-calendar-month", next: "sk-child-change-8-days", deadlines: "sk-child-change-8-days", problems: "sk-fb-amount-not-timeless", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-ustredie-not-universal-payer", freshness: "sk-fb-amount-not-timeless", negatives: "sk-fb-amount-not-timeless" } },
  { key: "sk-child-first-grader", title: "Erstklässlerzuschlag 2026 trennen", trigger: "Zuschlag von 110 Euro zur ersten Klasse oder September/Oktober-Zahlung", safeFirstStep: "Inländische Automatik von unionsrechtlichem Antrag trennen.", riskLevel: "high", dimensions: { what: "sk-child-first-grader-110", whoWhen: "sk-child-first-grader-domestic-automatic", documents: "sk-fb-channel-fetch-live", how: "sk-child-first-grader-eu-requires-application", next: "sk-fb-application-not-approval", deadlines: "sk-fb-amount-not-timeless", problems: "sk-child-first-grader-eu-requires-application", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-channel-fetch-live", negatives: "sk-child-first-grader-eu-requires-application" } },
  { key: "sk-parental-eligibility", title: "Slowakischen Elternbeitrag 2026 prüfen", trigger: "Rodičovský príspevok wird als Anspruch angeboten", safeFirstStep: "Materské trennen; Pflege, Alter und ein Anspruch je Familie prüfen.", riskLevel: "high", dimensions: { what: "sk-parental-is-family-benefit", whoWhen: "sk-parental-eligible-person", documents: "sk-fb-channel-fetch-live", how: "sk-parental-regular-care", next: "sk-parental-child-age", deadlines: "sk-parental-change-reporting", problems: "sk-parental-not-materske", dutiesAfter: "sk-parental-change-reporting", institution: "sk-fb-upsvar-role", boundaries: "sk-parental-residence-or-eu", freshness: "sk-fb-channel-fetch-live", negatives: "sk-parental-one-family-entitlement" } },
  { key: "sk-parental-amount-class", title: "Elternbeitragsbetrag 2026 einordnen", trigger: "364,80 oder 500,10 Euro oder Mehrlings-/Schulpflichtvariante", safeFirstStep: "Vorheriges Mutterschaftsgeld für dasselbe Kind klären; Beträge nicht zeitlos setzen.", riskLevel: "high", dimensions: { what: "sk-parental-amount-364-80-2026", whoWhen: "sk-parental-amount-500-10-2026", documents: "sk-fb-channel-fetch-live", how: "sk-parental-multiple-birth-increase", next: "sk-parental-school-attendance-reduction", deadlines: "sk-fb-amount-not-timeless", problems: "sk-fb-amount-not-timeless", dutiesAfter: "sk-parental-change-reporting", institution: "sk-fb-upsvar-role", boundaries: "sk-parental-not-elterngeld-copy", freshness: "sk-fb-amount-not-timeless", negatives: "sk-parental-not-elterngeld-copy" } },
  { key: "sk-parental-application", title: "Elternbeitrag 2026 beantragen", trigger: "Antrag auf rodičovský príspevok", safeFirstStep: "An ÚPSVaR verweisen; Antrag nicht als Bewilligung behandeln.", riskLevel: "high", dimensions: { what: "sk-parental-application", whoWhen: "sk-parental-eligible-person", documents: "sk-fb-channel-fetch-live", how: "sk-parental-application", next: "sk-fb-application-not-approval", deadlines: "sk-parental-change-reporting", problems: "sk-fb-application-not-approval", dutiesAfter: "sk-parental-change-reporting", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-upsvar-instance-fetch-live", negatives: "sk-fb-not-socialna-poistovna" } },
  { key: "sk-parental-maternity-interaction", title: "Elternbeitrag und Mutterschaftsgeld 2026", trigger: "Materské oder ausländisches Mutterschaftsgeld neben rodičovský príspevok", safeFirstStep: "Vollen Kalendermonatsbetrag und Ausnahmen verlangen; nicht automatisch ausschließen.", riskLevel: "high", dimensions: { what: "sk-parental-maternity-amount-gate", whoWhen: "sk-parental-maternity-not-automatic-exclusion", documents: "sk-fb-channel-fetch-live", how: "sk-parental-not-materske", next: "sk-parental-calendar-month", deadlines: "sk-fb-amount-not-timeless", problems: "sk-parental-maternity-amount-gate", dutiesAfter: "sk-parental-change-reporting", institution: "sk-fb-upsvar-role", boundaries: "sk-parental-not-elterngeld-copy", freshness: "sk-fb-channel-fetch-live", negatives: "sk-parental-maternity-not-automatic-exclusion" } },
  { key: "sk-parental-change", title: "Elternbeitrag Änderung 2026", trigger: "Pflege, Wohnsitz, Mutterschaft oder Familie ändert sich", safeFirstStep: "Meldepflicht führen; alten Betrag nicht fortschreiben.", riskLevel: "high", dimensions: { what: "sk-parental-change-reporting", whoWhen: "sk-parental-change-reporting", documents: "sk-fb-channel-fetch-live", how: "sk-parental-calendar-month", next: "sk-parental-change-reporting", deadlines: "sk-parental-change-reporting", problems: "sk-fb-amount-not-timeless", dutiesAfter: "sk-parental-change-reporting", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-channel-fetch-live", negatives: "sk-fb-application-not-approval" } },
  { key: "sk-fb-annex-i-exclusion", title: "Slowakische Anhang-I-Ausschlüsse 2026", trigger: "Geburtsbeihilfe, Geburtszuschlag oder náhradné výživné wird als Familienleistung angeboten", safeFirstStep: "EXCLUDED_ANNEX_I setzen; nicht in den F3-Korb nehmen.", riskLevel: "high", dimensions: { what: "sk-birth-allowance-excluded-annex-i", whoWhen: "sk-birth-supplement-excluded-annex-i", documents: "sk-fb-channel-fetch-live", how: "sk-substitute-maintenance-excluded", next: "sk-fb-name-not-classifier", deadlines: "sk-fb-amount-not-timeless", problems: "sk-fb-name-not-classifier", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-channel-fetch-live", negatives: "sk-substitute-maintenance-excluded" } },
  { key: "sk-fb-upsvar-office", title: "ÚPSVaR-Stelle 2026 live bestimmen", trigger: "Nutzer verlangt Amtsadresse, Formular oder Bratislava-Zentrale als Zahler", safeFirstStep: "Instanz live holen; Ústredie nicht als universellen Zahler führen; Sociálna poisťovňa nicht nennen.", riskLevel: "medium", dimensions: { what: "sk-fb-upsvar-role", whoWhen: "sk-fb-upsvar-instance-fetch-live", documents: "sk-fb-channel-fetch-live", how: "sk-fb-channel-fetch-live", next: "sk-fb-channel-fetch-live", deadlines: "sk-fb-amount-not-timeless", problems: "sk-fb-ustredie-not-universal-payer", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-upsvar-instance-fetch-live", negatives: "sk-fb-not-health-insurer" } },
  { key: "sk-fb-foreign-benefit-evidence", title: "Ausländische Familienleistungsnachweise 2026", trigger: "Kindergeld, Elterngeld oder andere EU-Zahlung berührt den slowakischen Antrag", safeFirstStep: "Nachweise und Beschäftigungsstaat des anderen Elternteils verlangen; acht Tage Meldepflicht.", riskLevel: "high", dimensions: { what: "sk-child-change-8-days", whoWhen: "sk-child-eu-coord-not-sk-residence-only", documents: "sk-fb-channel-fetch-live", how: "sk-child-first-grader-eu-requires-application", next: "sk-fb-application-not-approval", deadlines: "sk-child-change-8-days", problems: "sk-fb-application-not-approval", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-does-not-copy-eu-law", freshness: "sk-fb-channel-fetch-live", negatives: "sk-fb-not-socialna-poistovna" } },
  { key: "sk-fb-other-payment-classification", title: "Weitere slowakische Familienzahlungen 2026 einordnen", trigger: "Príplatok, Kinderbetreuungsbeitrag oder unklare Familienzahlung", safeFirstStep: "Príplatok nur bei verifiziertem Anspruch in den Korb; Kinderbetreuung authority-gated; Geburten und Unterhalt ausschließen.", riskLevel: "high", dimensions: { what: "sk-priplatok-family-benefit-current", whoWhen: "sk-childcare-classification-requires-authority", documents: "sk-fb-channel-fetch-live", how: "sk-priplatok-amount-30-2026", next: "sk-birth-allowance-excluded-annex-i", deadlines: "sk-fb-amount-not-timeless", problems: "sk-childcare-classification-requires-authority", dutiesAfter: "sk-child-change-8-days", institution: "sk-fb-upsvar-role", boundaries: "sk-fb-name-not-classifier", freshness: "sk-fb-channel-fetch-live", negatives: "sk-birth-allowance-excluded-annex-i" } },
]);

export function buildSkFamilyBenefitsAdapterPack(): CuratedForeignNationalAdapterPack {
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
    slovlex: item("publishers", "slov-lex", {
      name: "Slov-Lex", type: "foreign_national_publication",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    mpsvr: item("publishers", "mpsvr-family", {
      name: "Ministerstvo práce, sociálnych vecí a rodiny SR", type: "foreign_national_ministry",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    upsvr: item("publishers", "upsvr-family", {
      name: "Ústredie práce, sociálnych vecí a rodiny", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    slovlex: item("authorities", "slov-lex-authority", {
      publisherId: publishers.slovlex.id, name: "Slov-Lex", type: "foreign_national_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.slov-lex.sk",
    }),
    mpsvr: item("authorities", "mpsvr-family-authority", {
      publisherId: publishers.mpsvr.id, name: "MPSVR SR", type: "foreign_national_ministry",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.employment.gov.sk",
    }),
    upsvr: item("authorities", "upsvr-family-authority", {
      publisherId: publishers.upsvr.id, name: "Úrad práce, sociálnych vecí a rodiny", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.upsvr.gov.sk",
    }),
  };
  const publisherOf = { slovlex: publishers.slovlex, mpsvr: publishers.mpsvr, upsvr: publishers.upsvr };
  const authorityOf = { slovlex: authorities.slovlex, mpsvr: authorities.mpsvr, upsvr: authorities.upsvr };
  const sources = SK_FAMILY_OFFICIAL_SOURCES.map((spec) => {
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
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text), language: "sk",
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "STORE_CANONICALLY"
        ? []
        : spec.handlingMode === "FETCH_LIVE"
          ? ["COUNTRY"]
          : ["PROCESS_VARIANT"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = SK_FAMILY_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`SK_FAMILY_UNIT_SOURCE_MISSING:${unit.key}`);
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
      originalLanguage: "sk",
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim", entityId: claim.id, status: "fresh", effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });
  const processes = SK_FAMILY_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: SK_FAMILY_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of SK_FAMILY_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`SK_FAMILY_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: SK_FAMILY_PACK_ID,
    countryCode: "SK" as const,
    canonicalLanguage: SK_FAMILY_CANONICAL_LANGUAGE,
    trustDomain: trustDomain as CuratedForeignNationalAdapterPack["trustDomain"],
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.slovlex, publishers.mpsvr, publishers.upsvr],
    authorities: [authorities.slovlex, authorities.mpsvr, authorities.upsvr],
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

export function skFamilyPackSummary(
  pack: CuratedForeignNationalAdapterPack = buildSkFamilyBenefitsAdapterPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    claimCount: pack.claims.length,
    processCount: pack.processes.length,
    authorityRole: SK_FAMILY_AUTHORITY_ROLE,
    primaryProcessKey: SK_FAMILY_PRIMARY_PROCESS_KEY,
    validation: validateForeignNationalAdapterPack(pack),
  });
}
