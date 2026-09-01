/**
 * CB-0J Slovak national adapter for unemployment benefits.
 * EU Articles 61–65a remain in eu_unemployment_coordination. This pack stores
 * Slovak unemployment truth and splits Sociálna poisťovňa from ÚPSVaR.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  SK_UNEMPLOYMENT_ADAPTER_PACK_ID,
  SK_UNEMPLOYMENT_ADAPTER_PROCESS_GROUP,
  validateForeignNationalAdapterPack,
  type CuratedForeignNationalAdapterPack,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(SK_UNEMPLOYMENT_ADAPTER_PACK_ID, entityClass, key),
    ...values,
  });
}

export const SK_UE_PACK_ID = SK_UNEMPLOYMENT_ADAPTER_PACK_ID;
export const SK_UE_PROCESS_GROUP = SK_UNEMPLOYMENT_ADAPTER_PROCESS_GROUP;
export const SK_UE_CANONICAL_LANGUAGE = "de" as const;
export const SK_UE_PRIMARY_PROCESS_KEY = "sk-ue-uoz-registration" as const;
export const SK_SOCPOIST_ROLE = "SK_SOCIALNA_POISTOVNA" as const;
export const SK_UPSVAR_EMPLOYMENT_ROLE = "SK_UPSVAR_EMPLOYMENT_SERVICES" as const;
export const SK_UE_ART9_DECLARATION_VERSION = "2025" as const;
export const SK_UE_ART9_PUBLICATION_DATE = "2026-08-06" as const;
export const SK_UE_ART9_REFERENCE_YEAR_END = "2024-12-31" as const;
export const SK_UE_2026_TAPER_GATE = "2026-01-01" as const;

export const SK_UE_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "sk-ue-act-461-2003",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2003/461/",
    title: "Slov-Lex: Gesetz 461/2003 Z. z. über die Sozialversicherung",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-ue-act-461-2003-text",
      locator: "§ 19, § 104 Gesetz 461/2003",
      text: "Nach § 19 des Gesetzes 461/2003 ist in der Arbeitslosenversicherung pflichtversichert, wer als Arbeitnehmer pflichtkrankversichert ist, soweit das Gesetz nichts anderes bestimmt. SZČO ist nicht automatisch arbeitslosenversichert. Dobrovoľne poistená osoba v nezamestnanosti kann eine SZČO mit dauerndem oder genehmigtem Aufenthalt in der Slowakei sein, die pflichtkrank- und pflichtpensionsversichert ist oder deren Pflichtkranken- und Pflichtpensionsversicherung aus den in § 26 Absatz 4 Buchstaben b bis d genannten Gründen unterbrochen ist. Pflichtkranken- und Pflichtpensionsversicherung der SZČO ist nicht Arbeitslosenversicherung. Der Grundanspruch auf dávka v nezamestnanosti setzt die Eintragung als uchádzač o zamestnanie und in der Regel mindestens 730 Tage Arbeitslosenversicherung in den vorangegangenen vier Jahren voraus, vorbehaltlich Koordinierung und nationaler Bedingungen. Zahlungsvollständigkeit der freiwilligen Versicherung kann den Anspruch berühren. Diese Sätze wiederholen nicht die Artikel 61 bis 65a.",
    }],
  },
  {
    key: "sk-ue-act-5-2004",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2004/5/",
    title: "Slov-Lex: Gesetz 5/2004 Z. z. über Beschäftigungsdienste",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-ue-act-5-2004-text",
      locator: "§ 6 Gesetz 5/2004",
      text: "Nach § 6 des Gesetzes 5/2004 darf eine als uchádzač o zamestnanie geführte Person keine selbständige Tätigkeit betreiben oder ausüben, vorbehaltlich gesetzlicher Ausnahmen, die einzeln zu prüfen sind. Aktive gewöhnliche SZČO und slowakische UoZ-Eintragung sind nicht als vereinbar anzunehmen. Das unterscheidet sich von der deutschen 15-Stunden-Grenze. Živnostenské oprávnenie ist nicht Arbeitslosenversicherung und nicht UoZ-Status.",
    }],
  },
  {
    key: "sk-ue-socpoist-amount",
    publisherKey: "socpoist" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/socialne-poistenie/poistenie-v-nezamestnanosti/davka-v-nezamestnanosti/dalsie-informacie-davka-v",
    title: "Sociálna poisťovňa: Weitere Angaben zur Arbeitslosenleistung",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-ue-socpoist-amount-text",
      locator: "Výška dávky, DVZ, 26 týždňov",
      text: "Bei Eintragung in die UoZ-Evidenz spätestens am 31. Dezember 2025 bleibt die Leistung 50 Prozent des DVZ während des gesamten unterstützten Zeitraums. Bei Eintragung ab 1. Januar 2026 gelten Monate 1 bis 3 mit 50 Prozent, Monat 4 mit 40 Prozent, Monat 5 mit 30 Prozent und Monat 6 mit 20 Prozent des DVZ. Die Höchstdauer beträgt sechs Monate. DVZ folgt den Arbeitslosenversicherungs-Bemessungsgrundlagen der entscheidenden Periode, nicht dem Umsatz oder Rechnungsvolumen. Liegt in der entscheidenden Periode nur Arbeitnehmerversicherung ohne Bemessungsgrundlage und zugleich freiwillige Arbeitslosenversicherung, bestimmt sich die Höhe aus den freiwilligen Bemessungsgrundlagen, wenn mindestens 26 Wochen freiwillige Versicherung vorliegen; bei kürzerer freiwilliger Versicherung und verspäteter oder unvollständiger Zahlung kann die Konstante gelten. Die 26-Wochen-Bedingung ist nicht die 730-Tage-Anwartschaft. Die genaue Summe bleibt geschlossen, wenn Beitragsgeschichte unvollständig ist.",
    }],
  },
  {
    key: "sk-ue-mpsvr-2026",
    publisherKey: "mpsvr" as const,
    officialDomain: "www.employment.gov.sk",
    url: "https://www.employment.gov.sk/sk/socialne-poistenie-dochodkovy-system/socialne-poistenie/najvyznamnejsie-zmeny-socialnom-poisteni/zmeny-od-1-januara-2026.html",
    title: "MPSVR: Änderungen ab 1. Januar 2026 – Arbeitslosenleistung",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-ue-mpsvr-2026-text",
      locator: "Znižovanie sumy dávky v nezamestnanosti",
      text: "Das Arbeitsministerium bestätigt die Staffelung ab 1. Januar 2026. Entsteht der Anspruch noch bis Ende 2025, bleibt die einheitliche 50-Prozent-Summe während des gesamten unterstützten Zeitraums. Die 2026-Staffel ist nicht rückwirkend auf vor dem 1. Januar 2026 entstandene Ansprüche anzuwenden. Die Reform 2026 ändert SZČO-Sozialversicherungskonzepte; vor-2026-Einkommensschwellen dürfen ohne aktuelles Recht nicht verwendet werden.",
    }],
  },
  {
    key: "sk-ue-socpoist-u1",
    publisherKey: "socpoist" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/socialne-poistenie/poistenie-v-nezamestnanosti/davka-v-nezamestnanosti-eu/dalsie-informacie/ziadost",
    title: "Sociálna poisťovňa: Antrag auf Ausstellung des PD U1",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-ue-socpoist-u1-text",
      locator: "PD U1 Sociálna poisťovňa",
      text: "Sociálna poisťovňa stellt das PD U1 für slowakische Arbeitslosenversicherungszeiten aus, einschließlich freiwilliger SZČO-Arbeitslosenversicherung. Zuständig ist die Zweigstelle nach letztem Arbeitgeber, freiwilliger Arbeitslosenversicherung oder Wohnsitz; die genaue Zweigstelle ist live zu bestimmen. Papier-U1 ist nicht stets zwingend; die Sociálna poisťovňa kann Angaben trägerseitig einholen. U1 ist nicht die Leistungsbewilligung. ÚPSVaR stellt das PD U1 nicht aus.",
    }],
  },
  {
    key: "sk-ue-socpoist-u2",
    publisherKey: "socpoist" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/socialne-poistenie/poistenie-v-nezamestnanosti/davka-v-nezamestnanosti-eu/dalsie-informacie-0",
    title: "Sociálna poisťovňa: Export der Arbeitslosenleistung in einen anderen Mitgliedstaat",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-ue-socpoist-u2-text",
      locator: "PD U2 Export",
      text: "Für den Export slowakischer Arbeitslosenleistung stellt die Sociálna poisťovňa das PD U2 aus, nachdem der ÚPSVaR das Ausscheiden aus der Verfügbarkeit wegen Weggangs bestätigt. Ordinär besteht vierwöchige Verfügbarkeit, mit möglicher Verkürzung. Die Anmeldung im Zielstaat folgt der im PD U2 genannten Frist; amtliche Hinweise nennen regelmäßig sieben Tage ab Abreise, soweit keine Ausnahme zugelassen ist. Das PD U2-Datum hat Vorrang vor geratenem Kalender. Ordinäre Ausfuhr beträgt drei Monate, Verlängerung höchstens bis zum Ende des bewilligten Zeitraums und unionsrechtlich höchstens sechs Monate. Der slowakische Träger zahlt weiter. Das ist kein deutsches Arbeitslosengeld. Selbständige Aufnahme im Zielstaat ist zu melden und kann den Anspruch berühren.",
    }],
  },
  {
    key: "sk-ue-art9-2025",
    publisherKey: "socpoist" as const,
    officialDomain: "employment-social-affairs.ec.europa.eu",
    url: "https://employment-social-affairs.ec.europa.eu/document/download/b7003079-8513-4d1c-b80d-7589ec2f4411_en?filename=SK%20Art%209%20%28ex2025%29%20en.pdf",
    title: "European Commission: Slovakia Declaration Article 9 of Regulation (EC) No 883/2004 (2025)",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-ue-art9-2025-text",
      locator: "Article 65a(1) Slovakia 2025",
      text: "Die slowakische Artikel-9-Erklärung 2025, veröffentlicht am 6. August 2026 für das Bezugsjahr bis 31. Dezember 2024, stellt fest, dass slowakisches Recht Selbständigen die Einbeziehung in die Arbeitslosenversicherung durch freiwillige Versicherung nach dem Gesetz 461/2003 ermöglicht. Die Slowakei ist danach kein Wohnmitgliedstaat ohne Selbständigen-Arbeitslosensystem im Sinne von Artikel 65a. Die Feststellung ist jährlich zu revalidieren. Systemische Möglichkeit bedeutet nicht individuelle Versicherung der einzelnen SZČO.",
    }],
  },
  {
    key: "sk-ue-socpoist-locator",
    publisherKey: "socpoist" as const,
    officialDomain: "www.socpoist.sk",
    url: "https://www.socpoist.sk/kontakty",
    title: "Sociálna poisťovňa: Kontakte und Zweigstellen",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "sk-ue-socpoist-locator-text",
      locator: "Pobočky Sociálnej poisťovne",
      text: "Die Kategorie der Geldleistung ist SK_SOCIALNA_POISTOVNA. Die genaue Zweigstelle ist live zu bestimmen. Sociálna poisťovňa ist nicht ÚPSVaR. Der UoZ-Antrag beim ÚPSVaR kann zugleich als Antrag auf dávka v nezamestnanosti an die Sociálna poisťovňa übermittelt werden; doppelte Anträge sind zu vermeiden.",
    }],
  },
  {
    key: "sk-ue-upsvr-locator",
    publisherKey: "upsvr" as const,
    officialDomain: "www.upsvr.gov.sk",
    url: "https://www.upsvr.gov.sk/",
    title: "ÚPSVaR: Portal der Arbeitsämter",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "sk-ue-upsvr-locator-text",
      locator: "Úrad práce",
      text: "Die Kategorie der Arbeitsuchenden-Registrierung und Vermittlung ist SK_UPSVAR_EMPLOYMENT_SERVICES. Die genaue Amtsinstanz ist live zu bestimmen. ÚPSVaR entscheidet nicht über die Geldleistung dávka v nezamestnanosti. Eingehendes deutsches PD U2 wird beim ÚPSVaR registriert.",
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

export const SK_UE_UNITS: readonly Unit[] = Object.freeze([
  { key: "sk-ue-socpoist-role", category: "institution", type: "definition", text: "Für die slowakische Geldleistung dávka v nezamestnanosti und das PD U1 sowie das PD U2 der Ausfuhr ist die Sociálna poisťovňa der Kategorie SK_SOCIALNA_POISTOVNA zuständig.", sourceKey: "sk-ue-socpoist-locator", passageKey: "sk-ue-socpoist-locator-text", riskLevel: "high" },
  { key: "sk-ue-upsvr-role", category: "institution", type: "definition", text: "Für die Eintragung als uchádzač o zamestnanie und die Arbeitsvermittlung ist der Úrad práce, sociálnych vecí a rodiny der Kategorie SK_UPSVAR_EMPLOYMENT_SERVICES zuständig.", sourceKey: "sk-ue-upsvr-locator", passageKey: "sk-ue-upsvr-locator-text", riskLevel: "high" },
  { key: "sk-ue-socpoist-not-upsvr", category: "institution", type: "exception", text: "Sociálna poisťovňa ist nicht ÚPSVaR. Der Geldleistungsträger ist nicht die Beschäftigungsbehörde.", sourceKey: "sk-ue-socpoist-locator", passageKey: "sk-ue-socpoist-locator-text", riskLevel: "high" },
  { key: "sk-ue-upsvr-not-cash-decision", category: "institution", type: "exception", text: "ÚPSVaR entscheidet nicht über die Bewilligung der dávka v nezamestnanosti.", sourceKey: "sk-ue-upsvr-locator", passageKey: "sk-ue-upsvr-locator-text", riskLevel: "high" },
  { key: "sk-ue-socpoist-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue Zweigstelle der Sociálna poisťovňa ist live zu bestimmen und nicht festzuschreiben.", sourceKey: "sk-ue-socpoist-locator", passageKey: "sk-ue-socpoist-locator-text", riskLevel: "medium" },
  { key: "sk-ue-upsvr-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue Amtsinstanz des ÚPSVaR ist live zu bestimmen und nicht festzuschreiben.", sourceKey: "sk-ue-upsvr-locator", passageKey: "sk-ue-upsvr-locator-text", riskLevel: "medium" },
  { key: "sk-ue-channel-fetch-live", category: "institution", type: "procedure", text: "Aktuelle Formulare, Portale und Kontakte sind live zu prüfen und nicht zeitlos festzuschreiben.", sourceKey: "sk-ue-upsvr-locator", passageKey: "sk-ue-upsvr-locator-text", riskLevel: "medium" },
  { key: "sk-ue-no-duplicate-application", category: "procedure", type: "procedure", text: "Der UoZ-Antrag beim ÚPSVaR kann zugleich als Antrag auf dávka v nezamestnanosti an die Sociálna poisťovňa übermittelt werden. Doppelte Anträge sind zu vermeiden.", sourceKey: "sk-ue-socpoist-locator", passageKey: "sk-ue-socpoist-locator-text", riskLevel: "high" },
  { key: "sk-ue-application-not-approval", category: "procedure", type: "exception", text: "Antrag oder UoZ-Eintragung ist nicht bereits bewilligter Leistungsanspruch.", sourceKey: "sk-ue-socpoist-locator", passageKey: "sk-ue-socpoist-locator-text", riskLevel: "high" },
  { key: "sk-ue-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Dieses Adapter-Paket wiederholt nicht die materiellen Artikel 61 bis 65a.", sourceKey: "sk-ue-art9-2025", passageKey: "sk-ue-art9-2025-text", riskLevel: "high" },
  { key: "sk-ue-employee-compulsory", category: "employee", type: "definition", text: "Ein Arbeitnehmer, der pflichtkrankversichert ist, ist in der Regel pflichtarbeitslosenversichert, soweit keine gesetzliche Ausnahme gilt.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-employee-not-automatic-without-status", category: "employee", type: "exception", text: "Nicht jeder Arbeitnehmer ist ohne Prüfung des gesetzlichen Status automatisch arbeitslosenversichert.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-szco-not-automatic", category: "self-employed", type: "exception", text: "Eine SZČO ist nicht automatisch arbeitslosenversichert, nur weil sie SZČO ist.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-voluntary-section-19", category: "self-employed", type: "definition", text: "Nach § 19 Absatz 2 Buchstabe b kann eine qualifizierte SZČO mit der erforderlichen Aufenthaltsverbindung freiwillig arbeitslosenversichert sein, wenn sie pflichtkrank- und pflichtpensionsversichert ist oder diese Pflichtversicherung aus den gesetzlichen Unterbrechungsgründen ruht. Das ist nicht automatisch jede SZČO.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-sickness-pension-not-unemployment", category: "self-employed", type: "exception", text: "Pflichtkranken- und Pflichtpensionsversicherung der SZČO ist nicht Arbeitslosenversicherung.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-zivnost-not-insurance", category: "self-employed", type: "exception", text: "Ein živnostenské oprávnenie ist nicht Arbeitslosenversicherung.", sourceKey: "sk-ue-act-5-2004", passageKey: "sk-ue-act-5-2004-text", riskLevel: "high" },
  { key: "sk-ue-voluntary-evidence", category: "self-employed", type: "procedure", text: "Freiwillige Arbeitslosenversicherung verlangt tatsächlichen Nachweis bei der Sociálna poisťovňa, Zahlungen, PD U1 oder amtliche Bestätigung. Ohne Nachweis bleibt die Person nicht als arbeitslosenversichert zu führen.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-ue-payment-gate", category: "self-employed", type: "procedure", text: "Registrierte freiwillige Versicherung reicht ohne die gesetzliche Zahlungsvollständigkeit und -frist nicht als qualifizierende Zeit.", sourceKey: "sk-ue-socpoist-amount", passageKey: "sk-ue-socpoist-amount-text", riskLevel: "high" },
  { key: "sk-ue-active-szco-uoz-blocked", category: "uoz", type: "exception", text: "Aktive gewöhnliche SZČO und UoZ-Status sind nicht als vereinbar anzunehmen. Gesetzliche Ausnahmen sind einzeln zu prüfen.", sourceKey: "sk-ue-act-5-2004", passageKey: "sk-ue-act-5-2004-text", riskLevel: "high" },
  { key: "sk-ue-de-15h-not-sk-uoz", category: "uoz", type: "boundary", text: "Die deutsche Möglichkeit, Selbständigkeit unter 15 Stunden mit Arbeitslosigkeit zu verbinden, gilt nicht für den slowakischen UoZ-Status.", sourceKey: "sk-ue-act-5-2004", passageKey: "sk-ue-act-5-2004-text", riskLevel: "high" },
  { key: "sk-ue-former-szco-after-end", category: "uoz", type: "procedure", text: "Endet die selbständige Tätigkeit und greift keine disqualifizierende aktive Selbständigkeit, kann die Person den UoZ-Weg und den Leistungsantrag prüfen.", sourceKey: "sk-ue-act-5-2004", passageKey: "sk-ue-act-5-2004-text", riskLevel: "high" },
  { key: "sk-ue-730-day-gate", category: "entitlement", type: "definition", text: "Der Grundanspruch setzt neben der UoZ-Eintragung in der Regel mindestens 730 Tage Arbeitslosenversicherung in den vorangegangenen vier Jahren voraus. Die bloße Eintragung ersetzt diesen Nachweis nicht.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-foreign-periods-aggregation", category: "entitlement", type: "procedure", text: "Ausländische EU-Versicherungs-, Beschäftigungs- oder Selbständigkeitszeiten können nach Artikel 61 zusammengerechnet werden, soweit sie für die Arbeitslosenleistung anerkannt sind. Nicht jede Selbständigkeitszeit zählt.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-2026-taper", category: "amount", type: "definition", text: "Bei UoZ-Eintragung ab 1. Januar 2026 gelten 50, 50, 50, 40, 30 und 20 Prozent des DVZ in den sechs Monaten. Die Staffel gilt nicht rückwirkend für frühere Eintragungen.", sourceKey: "sk-ue-socpoist-amount", passageKey: "sk-ue-socpoist-amount-text", riskLevel: "high" },
  { key: "sk-ue-pre-2026-flat-50", category: "amount", type: "exception", text: "Bei UoZ-Eintragung bis 31. Dezember 2025 bleibt 50 Prozent des DVZ während des gesamten unterstützten Zeitraums. Die 2026-Staffel gilt nicht rückwirkend.", sourceKey: "sk-ue-mpsvr-2026", passageKey: "sk-ue-mpsvr-2026-text", riskLevel: "high" },
  { key: "sk-ue-max-six-months", category: "amount", type: "definition", text: "Das unterstützte Zeitraum der dávka v nezamestnanosti beträgt sechs Monate.", sourceKey: "sk-ue-socpoist-amount", passageKey: "sk-ue-socpoist-amount-text", riskLevel: "medium" },
  { key: "sk-ue-dvz-not-turnover", category: "amount", type: "exception", text: "DVZ folgt den gesetzlichen Arbeitslosenversicherungs-Bemessungsgrundlagen, nicht Umsatz, Rechnungssumme oder steuerlichem Ertrag.", sourceKey: "sk-ue-socpoist-amount", passageKey: "sk-ue-socpoist-amount-text", riskLevel: "high" },
  { key: "sk-ue-26-week-not-730", category: "amount", type: "exception", text: "Die 26-Wochen-Bedingung für die Betragsberechnung bei freiwilliger Versicherung ist nicht die 730-Tage-Anwartschaft.", sourceKey: "sk-ue-socpoist-amount", passageKey: "sk-ue-socpoist-amount-text", riskLevel: "high" },
  { key: "sk-ue-exact-amount-fail-closed", category: "amount", type: "procedure", text: "Die genaue Leistungssumme bleibt geschlossen und darf nicht genannt werden, wenn Beitrags- und Zahlungshistorie unvollständig ist.", sourceKey: "sk-ue-socpoist-amount", passageKey: "sk-ue-socpoist-amount-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-ue-u1-employee", category: "u1", type: "procedure", text: "Sociálna poisťovňa stellt PD U1 für Arbeitnehmer-Arbeitslosenversicherungszeiten aus. ÚPSVaR stellt das PD U1 nicht aus.", sourceKey: "sk-ue-socpoist-u1", passageKey: "sk-ue-socpoist-u1-text", riskLevel: "high" },
  { key: "sk-ue-u1-self-employed", category: "u1", type: "procedure", text: "Sociálna poisťovňa stellt PD U1 auch auf der Grundlage freiwilliger SZČO-Arbeitslosenversicherung aus. U1 ist nicht auf Arbeitnehmerzeiten beschränkt.", sourceKey: "sk-ue-socpoist-u1", passageKey: "sk-ue-socpoist-u1-text", riskLevel: "high" },
  { key: "sk-ue-u1-paper-not-mandatory", category: "u1", type: "exception", text: "Papier-PD U1 ist nicht stets zwingend; die Sociálna poisťovňa kann Angaben trägerseitig einholen.", sourceKey: "sk-ue-socpoist-u1", passageKey: "sk-ue-socpoist-u1-text", riskLevel: "high" },
  { key: "sk-ue-u1-not-award", category: "u1", type: "exception", text: "PD U1 ist nicht die Bewilligung der dávka v nezamestnanosti.", sourceKey: "sk-ue-socpoist-u1", passageKey: "sk-ue-socpoist-u1-text", riskLevel: "high" },
  { key: "sk-ue-u2-to-de", category: "u2", type: "procedure", text: "Sociálna poisťovňa stellt PD U2 für den Export in Deutschland aus, nachdem das erforderliche ÚPSVaR-Verfahren durchgeführt ist.", sourceKey: "sk-ue-socpoist-u2", passageKey: "sk-ue-socpoist-u2-text", riskLevel: "high" },
  { key: "sk-ue-u2-four-weeks", category: "u2", type: "definition", text: "Vor dem Export besteht ordinär mindestens vierwöchige Verfügbarkeit beim ÚPSVaR, mit möglicher zugelassener Verkürzung. Die Frist ist keine absolute Sperre ohne Prüfung.", sourceKey: "sk-ue-socpoist-u2", passageKey: "sk-ue-socpoist-u2-text", riskLevel: "high" },
  { key: "sk-ue-u2-seven-day-registration", category: "u2", type: "procedure", text: "Amtliche Exportführung nennt regelmäßig Anmeldung im Zielstaat binnen sieben Tagen ab Abreise; das im PD U2 genannte Datum hat Vorrang und darf nicht geraten werden.", sourceKey: "sk-ue-socpoist-u2", passageKey: "sk-ue-socpoist-u2-text", riskLevel: "high" },
  { key: "sk-ue-incoming-de-u2", category: "u2", type: "procedure", text: "Eingehendes deutsches PD U2 wird beim ÚPSVaR registriert. Das begründet keine slowakische Geldleistung anstelle der deutschen Ausfuhr.", sourceKey: "sk-ue-upsvr-locator", passageKey: "sk-ue-upsvr-locator-text", riskLevel: "high" },
  { key: "sk-ue-u2-not-german-alg", category: "u2", type: "exception", text: "Der Export slowakischer Leistung nach Deutschland ist nicht deutsches Arbeitslosengeld.", sourceKey: "sk-ue-socpoist-u2", passageKey: "sk-ue-socpoist-u2-text", riskLevel: "high" },
  { key: "sk-ue-art9-2025-se-coverage-possible", category: "article65a", type: "definition", text: "Nach der slowakischen Artikel-9-Erklärung 2025, veröffentlicht am 6. August 2026, ermöglicht slowakisches Recht Selbständigen die Einbeziehung in die Arbeitslosenversicherung. Die Slowakei ist kein Wohnstaat ohne Selbständigen-Arbeitslosensystem.", sourceKey: "sk-ue-art9-2025", passageKey: "sk-ue-art9-2025-text", riskLevel: "high" },
  { key: "sk-ue-art9-not-eternal-false", category: "article65a", type: "procedure", text: "Die Feststellung zur Selbständigen-Deckungsmöglichkeit ist CACHE_AND_REVALIDATE und nicht als zeitloses Nein zu Artikel 65a festzuschreiben.", sourceKey: "sk-ue-art9-2025", passageKey: "sk-ue-art9-2025-text", riskLevel: "high" },
  { key: "sk-ue-system-coverage-not-person-insured", category: "article65a", type: "exception", text: "Die systemische Möglichkeit freiwilliger SZČO-Arbeitslosenversicherung bedeutet nicht, dass die einzelne Person versichert war.", sourceKey: "sk-ue-art9-2025", passageKey: "sk-ue-art9-2025-text", riskLevel: "high" },
  { key: "sk-ue-2026-szco-current-law", category: "self-employed", type: "procedure", text: "Für SZČO-Sozialversicherung 2026 gilt das zum Umsetzungsdatum geltende Recht. Vor-2026-Einkommensschwellen dürfen ohne aktuelle Rechtsgrundlage nicht verwendet werden.", sourceKey: "sk-ue-mpsvr-2026", passageKey: "sk-ue-mpsvr-2026-text", riskLevel: "high" },
  { key: "sk-ue-activity-change-reeval", category: "mixed", type: "procedure", text: "Wechsel Arbeitnehmer zu SZČO oder umgekehrt erfordert neue Prüfung von Versicherung, freiwilliger Anmeldung, UoZ-Kompatibilität und U1-Nachweisen. Arbeitnehmerversicherung läuft nicht stillschweigend fort.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
  { key: "sk-ue-dormant-zivnost-not-activity", category: "mixed", type: "exception", text: "Eine ruhende živnosť belegt weder aktive Selbständigkeit noch deren Ende.", sourceKey: "sk-ue-act-5-2004", passageKey: "sk-ue-act-5-2004-text", riskLevel: "high" },
  { key: "sk-ue-director-status-unclear", category: "mixed", type: "procedure", text: "Konateľ, Gesellschafter oder Unternehmensinhaber sind nicht automatisch Arbeitnehmer oder SZČO. Unklarer Status bleibt unbeantwortet.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-ue-business-closure-not-benefit", category: "mixed", type: "exception", text: "Geschäftsaufgabe ist nicht automatisch dávka v nezamestnanosti.", sourceKey: "sk-ue-act-461-2003", passageKey: "sk-ue-act-461-2003-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const SK_UE_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "sk-ue-route-classify", title: "Slowakischen Arbeitslosenweg 2026 einordnen", trigger: "Arbeitslosigkeit mit Slowakeibezug, Träger unbekannt", safeFirstStep: "Sociálna poisťovňa und ÚPSVaR trennen; EU-Artikel nicht kopieren.", riskLevel: "high", dimensions: { what: "sk-ue-socpoist-role", whoWhen: "sk-ue-upsvr-role", documents: "sk-ue-channel-fetch-live", how: "sk-ue-socpoist-not-upsvr", next: "sk-ue-application-not-approval", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-upsvr-not-cash-decision", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-socpoist-not-upsvr" } },
  { key: "sk-ue-employee-insurance", title: "Slowakische Arbeitnehmer-Arbeitslosenversicherung 2026", trigger: "Arbeitnehmerstatus in der Slowakei und mögliche Arbeitslosenversicherung", safeFirstStep: "Pflichtkrankenversicherung und gesetzliche Ausnahmen prüfen; nicht jeden Arbeitnehmer automatisch versichern.", riskLevel: "high", dimensions: { what: "sk-ue-employee-compulsory", whoWhen: "sk-ue-employee-not-automatic-without-status", documents: "sk-ue-channel-fetch-live", how: "sk-ue-employee-compulsory", next: "sk-ue-730-day-gate", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-employee-not-automatic-without-status", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-employee-not-automatic-without-status" } },
  { key: "sk-ue-szco-voluntary-insurance", title: "Freiwillige SZČO-Arbeitslosenversicherung 2026", trigger: "SZČO verlangt Arbeitslosenversicherung oder Leistung", safeFirstStep: "SZČO nicht als automatisch versichert setzen; § 19 und Zahlungsnachweis verlangen.", riskLevel: "high", dimensions: { what: "sk-ue-voluntary-section-19", whoWhen: "sk-ue-szco-not-automatic", documents: "sk-ue-voluntary-evidence", how: "sk-ue-payment-gate", next: "sk-ue-2026-szco-current-law", deadlines: "sk-ue-payment-gate", problems: "sk-ue-sickness-pension-not-unemployment", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-2026-szco-current-law", negatives: "sk-ue-zivnost-not-insurance" } },
  { key: "sk-ue-former-szco-claim", title: "Frühere SZČO in den Leistungsanspruch 2026", trigger: "Ehemalige SZČO mit möglicher freiwilliger Versicherung verlangt dávka", safeFirstStep: "Tätigkeitsende, UoZ-Kompatibilität und tatsächliche Versicherungszeiten prüfen; Schließung nicht als Automatikanspruch setzen.", riskLevel: "high", dimensions: { what: "sk-ue-former-szco-after-end", whoWhen: "sk-ue-voluntary-evidence", documents: "sk-ue-channel-fetch-live", how: "sk-ue-730-day-gate", next: "sk-ue-application-not-approval", deadlines: "sk-ue-payment-gate", problems: "sk-ue-business-closure-not-benefit", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-business-closure-not-benefit" } },
  { key: SK_UE_PRIMARY_PROCESS_KEY, title: "UoZ-Eintragung 2026 führen", trigger: "Verlust der Tätigkeit und mögliche Eintragung als uchádzač o zamestnanie", safeFirstStep: "Aktive SZČO ausschließen; an das örtliche ÚPSVaR verweisen, nicht als Geldentscheidung der Sociálna poisťovňa darstellen.", riskLevel: "high", dimensions: { what: "sk-ue-upsvr-role", whoWhen: "sk-ue-active-szco-uoz-blocked", documents: "sk-ue-channel-fetch-live", how: "sk-ue-no-duplicate-application", next: "sk-ue-application-not-approval", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-de-15h-not-sk-uoz", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-upsvr-role", boundaries: "sk-ue-upsvr-not-cash-decision", freshness: "sk-ue-upsvr-instance-fetch-live", negatives: "sk-ue-active-szco-uoz-blocked" } },
  { key: "sk-ue-active-szco-exclusion", title: "Aktive SZČO gegen UoZ 2026 sperren", trigger: "Aktive SZČO oder živnosť soll in die UoZ-Evidenz", safeFirstStep: "§ 6 als Sperre führen; deutsche 15-Stunden-Regel nicht übertragen.", riskLevel: "high", dimensions: { what: "sk-ue-active-szco-uoz-blocked", whoWhen: "sk-ue-de-15h-not-sk-uoz", documents: "sk-ue-channel-fetch-live", how: "sk-ue-dormant-zivnost-not-activity", next: "sk-ue-former-szco-after-end", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-zivnost-not-insurance", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-upsvr-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-active-szco-uoz-blocked" } },
  { key: "sk-ue-benefit-entitlement", title: "Slowakischen Leistungsanspruch 2026 prüfen", trigger: "Dávka v nezamestnanosti nach UoZ-Eintragung", safeFirstStep: "730-Tage-Tor und Aggregation erklären; Antrag nicht als Bewilligung setzen.", riskLevel: "high", dimensions: { what: "sk-ue-730-day-gate", whoWhen: "sk-ue-socpoist-role", documents: "sk-ue-channel-fetch-live", how: "sk-ue-foreign-periods-aggregation", next: "sk-ue-application-not-approval", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-730-day-gate", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-socpoist-instance-fetch-live", negatives: "sk-ue-u1-not-award" } },
  { key: "sk-ue-2026-amount-taper", title: "Slowakische Betragsstaffel 2026 zeitlich trennen", trigger: "Höhe der dávka, DVZ oder Staffel 50/40/30/20", safeFirstStep: "Eintragungsdatum 2025-12-31 gegen 2026-01-01 trennen; DVZ nicht aus Umsatz ableiten.", riskLevel: "high", dimensions: { what: "sk-ue-2026-taper", whoWhen: "sk-ue-pre-2026-flat-50", documents: "sk-ue-channel-fetch-live", how: "sk-ue-dvz-not-turnover", next: "sk-ue-max-six-months", deadlines: "sk-ue-26-week-not-730", problems: "sk-ue-exact-amount-fail-closed", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-26-week-not-730", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-dvz-not-turnover" } },
  { key: "sk-ue-u1-issue", title: "Slowakisches PD U1 2026 ausstellen lassen", trigger: "Slowakische Zeiten sollen in einem anderen Staat nachgewiesen werden", safeFirstStep: "An Sociálna poisťovňa verweisen; freiwillige SZČO-Zeiten einschließen; Zweigstelle live bestimmen.", riskLevel: "high", dimensions: { what: "sk-ue-u1-employee", whoWhen: "sk-ue-u1-self-employed", documents: "sk-ue-channel-fetch-live", how: "sk-ue-u1-paper-not-mandatory", next: "sk-ue-application-not-approval", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-u1-not-award", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-socpoist-instance-fetch-live", negatives: "sk-ue-upsvr-not-cash-decision" } },
  { key: "sk-ue-foreign-u1-into-claim", title: "Ausländisches PD U1 in slowakischen Anspruch 2026", trigger: "Ausländische EU-Zeiten sollen die 730 Tage erfüllen", safeFirstStep: "U1 oder trägerseitige Einholung führen; Papier nicht stets zwingend setzen; nicht als Bewilligung behandeln.", riskLevel: "high", dimensions: { what: "sk-ue-u1-paper-not-mandatory", whoWhen: "sk-ue-foreign-periods-aggregation", documents: "sk-ue-channel-fetch-live", how: "sk-ue-u1-not-award", next: "sk-ue-730-day-gate", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-u1-not-award", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-u1-not-award" } },
  { key: "sk-ue-u2-export-de", title: "Slowakische Leistung mit PD U2 nach Deutschland 2026 ausführen", trigger: "Beziehende Person sucht Arbeit in Deutschland", safeFirstStep: "ÚPSVaR-Verfügbarkeit und Sociálna poisťovňa-U2 trennen; nicht in deutsches ALG umdeuten.", riskLevel: "high", dimensions: { what: "sk-ue-u2-to-de", whoWhen: "sk-ue-u2-four-weeks", documents: "sk-ue-channel-fetch-live", how: "sk-ue-u2-seven-day-registration", next: "sk-ue-u2-not-german-alg", deadlines: "sk-ue-u2-seven-day-registration", problems: "sk-ue-u2-not-german-alg", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-socpoist-instance-fetch-live", negatives: "sk-ue-u2-not-german-alg" } },
  { key: "sk-ue-incoming-de-u2", title: "Eingehendes deutsches PD U2 in der Slowakei 2026", trigger: "Person mit deutschem U2 registriert sich beim ÚPSVaR", safeFirstStep: "Als Zielstaatsregistrierung führen, nicht als neue slowakische Geldleistung.", riskLevel: "high", dimensions: { what: "sk-ue-incoming-de-u2", whoWhen: "sk-ue-upsvr-role", documents: "sk-ue-channel-fetch-live", how: "sk-ue-incoming-de-u2", next: "sk-ue-application-not-approval", deadlines: "sk-ue-u2-seven-day-registration", problems: "sk-ue-upsvr-not-cash-decision", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-upsvr-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-upsvr-instance-fetch-live", negatives: "sk-ue-socpoist-not-upsvr" } },
  { key: "sk-ue-frontier-claim", title: "Slowakischen Grenzgänger-Arbeitnehmeranspruch 2026", trigger: "Wohnsitz SK oder DE, letzte abhängige Tätigkeit im anderen Staat, Vollarbeitslosigkeit", safeFirstStep: "Nicht automatisch den Beitragsstaat als Leistungsstaat setzen; UoZ und Sociálna poisťovňa trennen.", riskLevel: "high", dimensions: { what: "sk-ue-upsvr-role", whoWhen: "sk-ue-socpoist-role", documents: "sk-ue-channel-fetch-live", how: "sk-ue-foreign-periods-aggregation", next: "sk-ue-application-not-approval", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-does-not-copy-eu-law", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-u1-not-award" } },
  { key: "sk-ue-self-employed-frontier", title: "Slowakischen selbständigen Grenzgängerweg 2026", trigger: "Letzte selbständige Tätigkeit SK oder DE, Wohnsitz im anderen Staat", safeFirstStep: "Artikel 65 zuerst; aktuelle slowakische Artikel-9-Erklärung 2025 revalidieren; individuelle Versicherung getrennt prüfen.", riskLevel: "high", dimensions: { what: "sk-ue-art9-2025-se-coverage-possible", whoWhen: "sk-ue-system-coverage-not-person-insured", documents: "sk-ue-voluntary-evidence", how: "sk-ue-art9-not-eternal-false", next: "sk-ue-szco-not-automatic", deadlines: "sk-ue-payment-gate", problems: "sk-ue-szco-not-automatic", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-art9-not-eternal-false", negatives: "sk-ue-system-coverage-not-person-insured" } },
  { key: "sk-ue-mixed-history-aggregation", title: "Gemischte Versicherungsgeschichte 2026 zusammenführen", trigger: "Arbeitnehmer- und SZČO-Zeiten in DE und SK sollen aggregiert werden", safeFirstStep: "Perioden einzeln klassifizieren; nicht jede Selbständigkeitszeit als versichert zählen.", riskLevel: "high", dimensions: { what: "sk-ue-foreign-periods-aggregation", whoWhen: "sk-ue-voluntary-evidence", documents: "sk-ue-channel-fetch-live", how: "sk-ue-730-day-gate", next: "sk-ue-u1-paper-not-mandatory", deadlines: "sk-ue-26-week-not-730", problems: "sk-ue-szco-not-automatic", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-szco-not-automatic" } },
  { key: "sk-ue-activity-change", title: "Slowakischen Tätigkeitswechsel 2026 neu bewerten", trigger: "Wechsel Arbeitnehmer/SZČO, ruhende živnosť oder unklarer konateľ", safeFirstStep: "Versicherung und UoZ-Kompatibilität neu prüfen; Status nicht erfinden.", riskLevel: "high", dimensions: { what: "sk-ue-activity-change-reeval", whoWhen: "sk-ue-director-status-unclear", documents: "sk-ue-channel-fetch-live", how: "sk-ue-dormant-zivnost-not-activity", next: "sk-ue-former-szco-after-end", deadlines: "sk-ue-application-not-approval", problems: "sk-ue-director-status-unclear", dutiesAfter: "sk-ue-activity-change-reeval", institution: "sk-ue-socpoist-role", boundaries: "sk-ue-does-not-copy-eu-law", freshness: "sk-ue-channel-fetch-live", negatives: "sk-ue-zivnost-not-insurance" } },
]);

export const SK_UE_NEGATIVE_CONTROLS = Object.freeze([
  "sk-ue-szco-not-automatic",
  "sk-ue-sickness-pension-not-unemployment",
  "sk-ue-zivnost-not-insurance",
  "sk-ue-active-szco-uoz-blocked",
  "sk-ue-socpoist-not-upsvr",
  "sk-ue-upsvr-not-cash-decision",
  "sk-ue-u1-not-award",
  "sk-ue-u2-not-german-alg",
  "sk-ue-dvz-not-turnover",
  "sk-ue-26-week-not-730",
  "sk-ue-system-coverage-not-person-insured",
  "sk-ue-business-closure-not-benefit",
  "sk-ue-de-15h-not-sk-uoz",
]);

export function buildSkUnemploymentCoordinationAdapterPack(): CuratedForeignNationalAdapterPack {
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
    slovlex: item("publishers", "slov-lex-unemployment", {
      name: "Slov-Lex", type: "foreign_national_publication",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    socpoist: item("publishers", "socpoist-unemployment", {
      name: "Sociálna poisťovňa", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    mpsvr: item("publishers", "mpsvr-unemployment", {
      name: "Ministerstvo práce, sociálnych vecí a rodiny SR", type: "foreign_national_ministry",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    upsvr: item("publishers", "upsvr-unemployment", {
      name: "Ústredie práce, sociálnych vecí a rodiny", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    slovlex: item("authorities", "slov-lex-unemployment-authority", {
      publisherId: publishers.slovlex.id, name: "Slov-Lex", type: "foreign_national_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.slov-lex.sk",
    }),
    socpoist: item("authorities", "socpoist-unemployment-authority", {
      publisherId: publishers.socpoist.id, name: "Sociálna poisťovňa", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.socpoist.sk",
    }),
    mpsvr: item("authorities", "mpsvr-unemployment-authority", {
      publisherId: publishers.mpsvr.id, name: "MPSVR SR", type: "foreign_national_ministry",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.employment.gov.sk",
    }),
    upsvr: item("authorities", "upsvr-unemployment-authority", {
      publisherId: publishers.upsvr.id, name: "Úrad práce, sociálnych vecí a rodiny", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.upsvr.gov.sk",
    }),
  };
  const publisherOf = {
    slovlex: publishers.slovlex, socpoist: publishers.socpoist,
    mpsvr: publishers.mpsvr, upsvr: publishers.upsvr,
  };
  const authorityOf = {
    slovlex: authorities.slovlex, socpoist: authorities.socpoist,
    mpsvr: authorities.mpsvr, upsvr: authorities.upsvr,
  };
  const sources = SK_UE_OFFICIAL_SOURCES.map((spec) => {
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
  const claims = SK_UE_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`SK_UE_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = SK_UE_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: SK_UE_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of SK_UE_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`SK_UE_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  const pack = Object.freeze({
    schemaVersion: 1 as const,
    packId: SK_UE_PACK_ID,
    countryCode: "SK" as const,
    canonicalLanguage: SK_UE_CANONICAL_LANGUAGE,
    trustDomain: trustDomain as CuratedForeignNationalAdapterPack["trustDomain"],
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.slovlex, publishers.socpoist, publishers.mpsvr, publishers.upsvr],
    authorities: [authorities.slovlex, authorities.socpoist, authorities.mpsvr, authorities.upsvr],
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
  const validation = validateForeignNationalAdapterPack(pack);
  if (!validation.valid) throw new Error(`SK_UE_ADAPTER_INVALID:${validation.issues.join(",")}`);
  return pack;
}
