/**
 * AT-SK-0I Austrian national personal income tax / domestic tax-residence pack.
 * Models EStG §1, BAO §26, §98 and bounded procedural routing only.
 * Does NOT implement AT-SK bilateral treaty residence, treaty allocation, or tax calculation.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS, type ScenarioCoverage } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_NATIONAL_COUNTRY_CODE,
  AT_NATIONAL_JURISDICTION_LEVEL,
  AT_NATIONAL_TRUST_DOMAIN,
} from "../../../source-registry/at-national-foundation-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(AT_TAX_PACK_ID, entityClass, key),
    ...values,
  });
}

export const AT_TAX_PACK_ID = "at_personal_income_tax_residence" as const;
export const AT_TAX_PROCESS_GROUP = "at_personal_income_tax_residence" as const;
export const AT_TAX_PRIMARY_PROCESS_KEY = "at-tax-domestic-liability-classify" as const;
export const AT_TAX_AS_OF = "2026-09-04" as const;
export const AT_TAX_STATUTE_EFFECTIVE_YEAR = 2026 as const;
export const AT_TAX_SECTION_1_4_FOREIGN_INCOME_THRESHOLD_EUR_2026 = 13539 as const;
export const AT_TAX_ZWEITWOHNSITZ_DAY_THRESHOLD = 70 as const;
export const AT_TAX_BAO_SIX_MONTH_RULE_MONTHS = 6 as const;

export const AT_TAX_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "at-tax-estg-ris",
    publisherKey: "ris-tax" as const,
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004570",
    title: "RIS: Einkommensteuergesetz 1988 (EStG)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-estg-ris-text",
      locator: "EStG §1 Abs. 2–4, §98",
      text: "Nach § 1 Abs. 2 EStG unterliegen natürliche Personen mit Wohnsitz oder gewöhnlichem Aufenthalt in Österreich der unbeschränkten Steuerpflicht mit dem Welteinkommen im inländischen Steuerrecht. Das ist eine inländische Rechtsfolge und nicht automatisch die endgültige Abkommensbesteuerung jedes Auslandseinkommens. Nach § 1 Abs. 3 EStG unterliegen natürliche Personen ohne Wohnsitz und ohne gewöhnlichen Aufenthalt in Österreich der beschränkten Steuerpflicht für die in § 98 genannten Einkünfte. Beschränkte Steuerpflicht ist nicht gleichbedeutend mit keiner österreichischen Steuer. Nach § 1 Abs. 4 EStG können EU/EWR-Personen ohne österreichischen Wohnsitz und ohne gewöhnlichen Aufenthalt auf Antrag als unbeschränkt steuerpflichtig behandelt werden, wenn mindestens 90 Prozent des Einkommens der österreichischen Einkommensteuer unterliegen oder das nicht der österreichischen Einkommensteuer unterliegende Einkommen den gesetzlichen Jahresgrenzbetrag nicht übersteigt. Für das Kalenderjahr 2026 beträgt dieser Grenzbetrag 13.539 Euro. Die Behandlung nach § 1 Abs. 4 ist nicht gleichbedeutend mit tatsächlichem Wohnsitz oder Abkommensansässigkeit; nach amtlicher BMF-Führung werden in diesem Fall nur die österreichischen Einkünfte besteuert. § 98 EStG regelt die beschränkte Steuerpflicht für inländische Einkunftsarten, darunter Einkünfte aus Land- und Forstwirtschaft, selbständiger Arbeit und Gewerbebetrieb mit inländischem Anknüpfungspunkt, Einkünfte aus nichtselbständiger Arbeit mit inländischem Bezug, Einkünfte aus Vermietung und Verpachtung inländischer Immobilien sowie private Grundstücksveräußerungen.",
    }],
  },
  {
    key: "at-tax-bao-ris",
    publisherKey: "ris-tax" as const,
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002741",
    title: "RIS: Bundesabgabenordnung (BAO)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-bao-ris-text",
      locator: "BAO §26 Abs. 1–2, §134",
      text: "Nach § 26 Abs. 1 BAO hat eine natürliche Person einen Wohnsitz, wenn sie eine Wohnung innehat unter Umständen, die darauf schließen lassen, dass sie die Wohnung beibehalten und benutzen wird. Meldezettel, Hauptwohnsitz-Bezeichnung oder alleinige Registrierung begründen den steuerlichen Wohnsitz nicht automatisch; fehlender Hauptwohnsitz schließt einen steuerlichen Wohnsitz nicht automatisch aus. Nach § 26 Abs. 2 BAO gilt ein Aufenthalt als gewöhnlich, wenn er nicht nur vorübergehend ist. Dauert ein Aufenthalt in Österreich länger als sechs Monate, so entsteht unbeschränkte Steuerpflicht mit Wirkung vom Beginn des Aufenthalts an, einschließlich der ersten sechs Monate. Eine Anwesenheit unter sechs Monaten beweist nicht automatisch das Fehlen von Wohnsitz oder gewöhnlichem Aufenthalt. Die sechsmonatige BAO-Regel ist nicht die 183-Tage-Regel eines DBA-Arbeitnehmerartikels. Nach § 134 BAO gelten für die ordentliche Einkommensteuererklärung grundsätzlich die gesetzlichen Abgabefristen; verlängerte Fristen und Sonderregeln sind gesondert zu prüfen.",
    }],
  },
  {
    key: "at-tax-zweitwohnsitz-vo",
    publisherKey: "ris-tax" as const,
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20002641",
    title: "RIS: Zweitwohnsitzverordnung BGBl. II Nr. 528/2003",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-zweitwohnsitz-vo-text",
      locator: "Zweitwohnsitzverordnung",
      text: "Die Zweitwohnsitzverordnung regelt eine besondere inländische Zweitwohnsitz-Sonderregel. Voraussetzungen umfassen unter anderem, dass der Mittelpunkt der Lebensinteressen seit mehr als fünf Kalenderjahren im Ausland liegt, die österreichische Wohnung nur bis zur gesetzlichen Jahresgrenze genutzt wird und die erforderlichen Tagesnachweise geführt werden. Die derzeitige gesetzliche Jahresgrenze beträgt 70 Tage. Dies ist keine allgemeine österreichische Steueransässigkeitsschwelle und kein Abkommenswohnsitztest.",
    }],
  },
  {
    key: "at-tax-bmf-personliche-steuerpflicht",
    publisherKey: "bmf-tax" as const,
    officialDomain: "www.bmf.gv.at",
    url: "https://www.bmf.gv.at/themen/steuern/steuerarten/einkommensteuer/persoenliche-steuerpflicht.html",
    title: "BMF: Persönliche Steuerpflicht",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-bmf-personliche-steuerpflicht-text",
      locator: "Persönliche Steuerpflicht / §1 Abs. 4 / 2026",
      text: "Das BMF erläutert die unbeschränkte und beschränkte Steuerpflicht natürlicher Personen. Für die Antragsbehandlung nach § 1 Abs. 4 EStG nennt die aktuelle BMF-Führung für 2026 den Grenzbetrag von 13.539 Euro für nicht der österreichischen Einkommensteuer unterliegendes Einkommen sowie die 90-Prozent-Alternative. Die Behandlung als unbeschränkt steuerpflichtig nach § 1 Abs. 4 bedeutet nicht, dass Österreich sämtliches Welteinkommen endgültig besteuert; vielmehr werden nur die österreichischen Einkünfte besteuert, während bestimmte inländische Vorteile der unbeschränkten Steuerpflicht gewährt werden können. Ausländische Einkommensnachweise und Formular E9 sind für die Nachweisführung relevant.",
    }],
  },
  {
    key: "at-tax-bmf-einkommensteuererklärung",
    publisherKey: "bmf-tax" as const,
    officialDomain: "www.bmf.gv.at",
    url: "https://www.bmf.gv.at/themen/steuern/steuerarten/einkommensteuer/erklaerung-veranlagung/einkommensteuererklaerung.html",
    title: "BMF: Einkommensteuererklärung / Einkommensteuerveranlagung",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-bmf-einkommensteuererklärung-text",
      locator: "Einkommensteuererklärung Fristen",
      text: "Für die ordentliche Einkommensteuererklärung nennt die aktuelle BMF-Führung für den Papierweg den 30. April des Folgejahres und für die elektronische Abgabe über FinanzOnline den 30. Juni des Folgejahres. Eine begründete Fristverlängerung kann möglich sein. Diese allgemeinen Fristen gelten nicht pauschal für jede Arbeitnehmerveranlagung, freiwillige Veranlagung, Sonderveranlagung oder besondere Einbehaltssituation. Formularauswahl und Anlagen, einschließlich grenzüberschreitender Nachweise, sind sachverhaltsabhängig.",
    }],
  },
  {
    key: "at-tax-finanzonline",
    publisherKey: "bmf-tax" as const,
    officialDomain: "finanzonline.bmf.gv.at",
    url: "https://finanzonline.bmf.gv.at/",
    title: "FinanzOnline",
    handlingMode: "FETCH_LIVE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "ONLINE_SERVICE_URL" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-finanzonline-text",
      locator: "FinanzOnline / Finanzamt Österreich",
      text: "FinanzOnline ist der elektronische Abgabekanal der österreichischen Finanzverwaltung. Das Finanzamt Österreich ist die bundesweite Steuerbehördenkategorie; die genaue Amtsstelle, Formulare und aktuelle Verfahren sind FETCH_LIVE. FinanzOnline ist kein Entscheidungsträger und kein Steueransässigkeitsnachweis.",
    }],
  },
  {
    key: "at-tax-oesterreich-gv",
    publisherKey: "oesterreich-gv-tax" as const,
    officialDomain: "www.oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at/de/themen/arbeit_und_pension/steuern_und_finanzen/Seite.450235",
    title: "oesterreich.gv.at: Steuern und Finanzen",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-tax-oesterreich-gv-text",
      locator: "Steuern / FinanzOnline",
      text: "oesterreich.gv.at verweist auf die österreichische Finanzverwaltung und FinanzOnline als allgemeinen Servicekanal. Portaltext ersetzt nicht EStG oder BAO und begründet keine Steueransässigkeit.",
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

export const AT_TAX_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-tax-unlimited-section-1-2", category: "liability", type: "definition", text: "UNBESCHRÄNKTE STEUERPFLICHT nach § 1 Abs. 2 EStG: natürliche Person mit Wohnsitz oder gewöhnlichem Aufenthalt in Österreich. Inländische Rechtsfolge: Welteinkommen im österreichischen Steuerrecht, nicht automatisch endgültige Abkommensbesteuerung jedes Auslandseinkommens.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-limited-section-1-3", category: "liability", type: "definition", text: "BESCHRÄNKTE STEUERPFLICHT nach § 1 Abs. 3 EStG: kein österreichischer Wohnsitz und kein gewöhnlicher Aufenthalt, aber inländische Einkünfte nach § 98. Nicht gleichbedeutend mit keiner österreichischen Steuer.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-section-1-4-option", category: "liability", type: "procedure", text: "§ 1 Abs. 4 EStG: EU/EWR-Personen ohne österreichischen Wohnsitz und ohne gewöhnlichen Aufenthalt können auf Antrag als unbeschränkt steuerpflichtig behandelt werden, wenn 90-Prozent-Kriterium oder Grenzbetrag erfüllt ist.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-section-1-4-not-actual-residence", category: "liability", type: "exception", text: "Behandlung nach § 1 Abs. 4 ist nicht tatsächlicher österreichischer Wohnsitz und nicht Abkommensansässigkeit. Nach BMF-Führung werden nur österreichische Einkünfte besteuert.", sourceKey: "at-tax-bmf-personliche-steuerpflicht", passageKey: "at-tax-bmf-personliche-steuerpflicht-text", riskLevel: "high" },
  { key: "at-tax-section-1-4-90-percent", category: "liability", type: "definition", text: "90-Prozent-Kriterium nach § 1 Abs. 4: mindestens 90 Prozent des Einkommens unterliegen der österreichischen Einkommensteuer. Das ist kein Abkommenswohnsitztest.", sourceKey: "at-tax-bmf-personliche-steuerpflicht", passageKey: "at-tax-bmf-personliche-steuerpflicht-text", riskLevel: "high" },
  { key: "at-tax-section-1-4-threshold-2026", category: "liability", type: "definition", text: "Für 2026 beträgt der Grenzbetrag für nicht der österreichischen Einkommensteuer unterliegendes Einkommen 13.539 Euro. YEAR_VERSIONED_2026; nicht zeitlos.", sourceKey: "at-tax-bmf-personliche-steuerpflicht", passageKey: "at-tax-bmf-personliche-steuerpflicht-text", riskLevel: "high" },
  { key: "at-tax-wohnsitz-bao-26-1", category: "residence", type: "definition", text: "Steuerlicher Wohnsitz nach BAO § 26 Abs. 1: Wohnung unter Umständen, die Beibehaltung und Benutzung nahelegen. Tatsächlicher Rechtsnexus, nicht nur Registrierungslabel.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-meldezettel-not-automatic-wohnsitz", category: "residence", type: "exception", text: "Meldezettel oder Registrierung begründen den steuerlichen Wohnsitz nicht automatisch.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-hauptwohnsitz-not-sole-test", category: "residence", type: "exception", text: "Hauptwohnsitz-Bezeichnung ist nicht der alleinige BAO-Wohnsitztest. Fehlender Hauptwohnsitz schließt steuerlichen Wohnsitz nicht automatisch aus.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-gewoehnlicher-aufenthalt-bao-26-2", category: "residence", type: "definition", text: "Gewöhnlicher Aufenthalt nach BAO § 26 Abs. 2: Aufenthalt, der nicht nur vorübergehend ist.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-six-month-statutory-rule", category: "residence", type: "definition", text: "Dauert ein Aufenthalt in Österreich länger als sechs Monate, entsteht unbeschränkte Steuerpflicht mit Wirkung vom Beginn des Aufenthalts, einschließlich der ersten sechs Monate.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-below-six-months-not-exclusion", category: "residence", type: "exception", text: "Anwesenheit unter sechs Monaten beweist nicht automatisch das Fehlen von Wohnsitz oder gewöhnlichem Aufenthalt.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-six-months-not-183-treaty", category: "boundary", type: "exception", text: "Die sechsmonatige BAO-Regel ist nicht die 183-Tage-Regel eines DBA-Arbeitnehmerartikels. Keine 183-Tage-Regel in inländische §1/BAO-Logik importieren.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-section-98-structure", category: "liability", type: "definition", text: "§ 98 EStG strukturiert beschränkte Steuerpflicht für inländische Einkunftsarten. Ergebnis: inländischer Steuernexus potenziell vorhanden / absent / kategorieabhängig, nicht endgültiges Abkommensbesteuerungsrecht.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-s98-employment-nexus", category: "income", type: "procedure", text: "Nichtselbständige Arbeit mit inländischem Bezug kann § 98-Einkünfte auslösen, auch ohne unbeschränkte Steuerpflicht. Einkunftsart und Sachverhalt prüfen.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-s98-self-employed-nexus", category: "income", type: "procedure", text: "Selbständige Arbeit oder Gewerbebetrieb mit inländischem Anknüpfungspunkt kann § 98-Einkünfte auslösen. Gewerbeautorisierung oder Dienstleistungsanzeige ersetzen keine Steueranalyse.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-s98-rental-nexus", category: "income", type: "procedure", text: "Vermietung und Verpachtung inländischer Immobilien sowie private Grundstücksveräußerungen können § 98-Einkünfte begründen.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-income-item-specific", category: "income", type: "boundary", text: "Steueranalyse ist einkunftsartbezogen. Kein globales Ergebnis wie alles in SK oder alles in AT ohne Kategorieprüfung.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-domestic-not-final-treaty-right", category: "boundary", type: "exception", text: "Inländische Steuerpflicht oder inländischer Steuernexus ist nicht gleichbedeutend mit endgültigem Abkommensbesteuerungsrecht. TREATY_REVIEW_REQUIRED für finale Zuordnung.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-unlimited-not-all-world-taxed-after-treaty", category: "boundary", type: "exception", text: "Unbeschränkte inländische Steuerpflicht bedeutet nicht, dass Österreich nach Abkommen jedes Welteinkommen endgültig besteuert.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-limited-not-no-tax", category: "boundary", type: "exception", text: "Beschränkte Steuerpflicht bedeutet nicht keinerlei österreichische Steuer.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-zweitwohnsitz-special-rule", category: "residence", type: "definition", text: "Zweitwohnsitzverordnung: besondere Sonderregel bei Mittelpunkt der Lebensinteressen seit mehr als fünf Kalenderjahren im Ausland, begrenzter Nutzung der österreichischen Wohnung und Tagesnachweisen.", sourceKey: "at-tax-zweitwohnsitz-vo", passageKey: "at-tax-zweitwohnsitz-vo-text", riskLevel: "high" },
  { key: "at-tax-zweitwohnsitz-70-day-threshold", category: "residence", type: "definition", text: "Aktuelle gesetzliche Jahresgrenze der Zweitwohnsitzverordnung: 70 Tage. YEAR_VERSIONED; nicht allgemeine Ansässigkeitsschwelle.", sourceKey: "at-tax-zweitwohnsitz-vo", passageKey: "at-tax-zweitwohnsitz-vo-text", riskLevel: "high" },
  { key: "at-tax-zweitwohnsitz-five-year-prerequisite", category: "residence", type: "definition", text: "Voraussetzung der Zweitwohnsitzverordnung: Mittelpunkt der Lebensinteressen seit mehr als fünf Kalenderjahren im Ausland.", sourceKey: "at-tax-zweitwohnsitz-vo", passageKey: "at-tax-zweitwohnsitz-vo-text", riskLevel: "high" },
  { key: "at-tax-zweitwohnsitz-day-records", category: "evidence", type: "procedure", text: "Die Zweitwohnsitzverordnung verlangt geführte Tagesnachweise. Fehlende Aufzeichnungen verhindern sichere Anwendung der Sonderregel.", sourceKey: "at-tax-zweitwohnsitz-vo", passageKey: "at-tax-zweitwohnsitz-vo-text", riskLevel: "high" },
  { key: "at-tax-70-days-not-general-residence", category: "boundary", type: "exception", text: "70-Tage-Regel der Zweitwohnsitzverordnung ist keine allgemeine österreichische Steueransässigkeitsschwelle und kein Abkommenswohnsitztest.", sourceKey: "at-tax-zweitwohnsitz-vo", passageKey: "at-tax-zweitwohnsitz-vo-text", riskLevel: "high" },
  { key: "at-tax-e9-foreign-certification", category: "evidence", type: "procedure", text: "Für § 1 Abs. 4 und grenzüberschreitende Nachweise sind ausländische Einkommensbescheinigungen und Formular E9 relevant. Fehlender Nachweis ist Verfahrenslücke, nicht erfundene Eignung.", sourceKey: "at-tax-bmf-personliche-steuerpflicht", passageKey: "at-tax-bmf-personliche-steuerpflicht-text", riskLevel: "high" },
  { key: "at-tax-filing-paper-30-april", category: "procedure", type: "definition", text: "Ordentliche Einkommensteuererklärung Papierweg: aktuelle BMF-Führung 30. April Folgejahr. Nicht universal für jede Veranlagungsart.", sourceKey: "at-tax-bmf-einkommensteuererklärung", passageKey: "at-tax-bmf-einkommensteuererklärung-text", riskLevel: "medium" },
  { key: "at-tax-filing-finanzonline-30-june", category: "procedure", type: "definition", text: "Ordentliche Einkommensteuererklärung elektronisch über FinanzOnline: aktuelle BMF-Führung 30. Juni Folgejahr. Nicht universal für jede Veranlagungsart.", sourceKey: "at-tax-bmf-einkommensteuererklärung", passageKey: "at-tax-bmf-einkommensteuererklärung-text", riskLevel: "medium" },
  { key: "at-tax-filing-deadlines-not-universal", category: "procedure", type: "exception", text: "Allgemeine BAO/BMF-Fristen gelten nicht pauschal für Arbeitnehmerveranlagung, freiwillige Veranlagung oder Sonderveranlagung.", sourceKey: "at-tax-bmf-einkommensteuererklärung", passageKey: "at-tax-bmf-einkommensteuererklärung-text", riskLevel: "high" },
  { key: "at-tax-finanzamt-oesterreich-category", category: "institution", type: "definition", text: "Finanzamt Österreich ist die bundesweite Steuerbehördenkategorie. Genaue Amtsstelle FETCH_LIVE.", sourceKey: "at-tax-finanzonline", passageKey: "at-tax-finanzonline-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "at-tax-finanzonline-channel", category: "institution", type: "procedure", text: "FinanzOnline ist elektronischer Abgabekanal, nicht Entscheidungsträger und kein Ansässigkeitsnachweis.", sourceKey: "at-tax-finanzonline", passageKey: "at-tax-finanzonline-text", riskLevel: "medium" },
  { key: "at-tax-treaty-review-handoff", category: "boundary", type: "procedure", text: "Fragen zur endgültigen Abkommensansässigkeit oder zur finalen Besteuerung eines AT-SK-Einkunftstyps sind TREATY_REVIEW_REQUIRED und gehören in die spätere AT-SK-Abkommensphase.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-domestic-not-treaty-residence", category: "boundary", type: "exception", text: "Österreichischer Wohnsitz oder gewöhnlicher Aufenthalt nach inländischem Recht ist nicht AT-SK-Abkommensansässigkeit.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-nationality-not-residence", category: "boundary", type: "exception", text: "Staatsangehörigkeit ist nicht Steueransässigkeit.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-locale-not-residence", category: "boundary", type: "exception", text: "Ausgabesprache oder userLocale ist nicht Steueransässigkeit.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-market-pack-not-residence", category: "boundary", type: "exception", text: "marketPackCountry ist nicht Steueransässigkeit.", sourceKey: "at-tax-bao-ris", passageKey: "at-tax-bao-ris-text", riskLevel: "high" },
  { key: "at-tax-a1-not-tax-certificate", category: "boundary", type: "exception", text: "A1 oder PD-A1 ist kein Steueransässigkeitsnachweis und kein DBA-Ergebnis.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-a1-competent-not-tax-residence", category: "boundary", type: "exception", text: "Zuständiger Sozialversicherungsstaat oder A1-Aussteller ist nicht Steueransässigkeit.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-health-not-tax-residence", category: "boundary", type: "exception", text: "S1, EHIC oder S2 ersetzen keine Steueransässigkeit.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-family-benefits-not-tax-residence", category: "boundary", type: "exception", text: "Familienleistungs- oder Familienbeihilfe-Kompetenz ist nicht Steueransässigkeit.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-unemployment-not-tax-residence", category: "boundary", type: "exception", text: "Arbeitslosen- oder Leistungskompetenz ist nicht Steueransässigkeit.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-dla-not-tax-registration", category: "boundary", type: "exception", text: "Dienstleistungsanzeige ist keine Steueranmeldung und keine Betriebsstätte.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-gewerbe-not-tax-residence", category: "boundary", type: "exception", text: "Gewerbeautorisierung oder Gewerbeanmeldung ist nicht österreichische Steueransässigkeit.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-no-calculator", category: "boundary", type: "exception", text: "Dieses Paket berechnet keine Steuerbeträge, keine Tarife und keine Anrechnung.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-statute-period-2026", category: "freshness", type: "definition", text: "Gespeicherte Schwellen und Führung gelten für 2026. Künftige Jahreswerte sind FUTURE_WATCH und nicht zeitlos kanonisch.", sourceKey: "at-tax-bmf-personliche-steuerpflicht", passageKey: "at-tax-bmf-personliche-steuerpflicht-text", riskLevel: "medium" },
  { key: "at-tax-bmf-guidance-not-statute", category: "source", type: "boundary", text: "BMF-Erläuterungen und oesterreich.gv.at sind amtliche Führung, kein Gesetzestext.", sourceKey: "at-tax-oesterreich-gv", passageKey: "at-tax-oesterreich-gv-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const AT_TAX_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: AT_TAX_PRIMARY_PROCESS_KEY, title: "Österreichische persönliche Steuerpflicht einordnen", trigger: "Unklare inländische Steuerpflicht oder Ansässigkeit natürlicher Person", safeFirstStep: "§ 1 EStG und BAO § 26 von Abkommen, A1 und Gewerbe trennen; Einkunftsart prüfen.", riskLevel: "high", dimensions: { what: "at-tax-unlimited-section-1-2", whoWhen: "at-tax-wohnsitz-bao-26-1", documents: "at-tax-e9-foreign-certification", how: "at-tax-domestic-liability-classify-route", next: "at-tax-treaty-review-handoff", deadlines: "at-tax-filing-paper-30-april", problems: "at-tax-nationality-not-residence", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-domestic-not-treaty-residence", freshness: "at-tax-statute-period-2026", negatives: "at-tax-a1-not-tax-certificate" } },
  { key: "at-tax-unlimited-wohnsitz", title: "Unbeschränkte Steuerpflicht über Wohnsitz 2026", trigger: "Österreichische Wohnung unter Beibehaltungsumständen", safeFirstStep: "BAO § 26 Abs. 1 anwenden; Meldezettel nicht als alleiniger Beweis.", riskLevel: "high", dimensions: { what: "at-tax-wohnsitz-bao-26-1", whoWhen: "at-tax-unlimited-section-1-2", documents: "at-tax-e9-foreign-certification", how: "at-tax-wohnsitz-bao-26-1", next: "at-tax-domestic-not-final-treaty-right", deadlines: "at-tax-filing-finanzonline-30-june", problems: "at-tax-meldezettel-not-automatic-wohnsitz", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-hauptwohnsitz-not-sole-test", freshness: "at-tax-statute-period-2026", negatives: "at-tax-meldezettel-not-automatic-wohnsitz" } },
  { key: "at-tax-unlimited-gewoehnlicher-aufenthalt", title: "Gewöhnlicher Aufenthalt über sechs Monate 2026", trigger: "Österreichischer Aufenthalt länger als sechs Monate", safeFirstStep: "Statutarische Sechsmonatsfolge mit Rückwirkung auf erste sechs Monate prüfen.", riskLevel: "high", dimensions: { what: "at-tax-six-month-statutory-rule", whoWhen: "at-tax-gewoehnlicher-aufenthalt-bao-26-2", documents: "at-tax-zweitwohnsitz-day-records", how: "at-tax-six-month-statutory-rule", next: "at-tax-domestic-not-final-treaty-right", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-six-months-not-183-treaty", dutiesAfter: "at-tax-treaty-review-handoff", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-six-months-not-183-treaty", freshness: "at-tax-statute-period-2026", negatives: "at-tax-six-months-not-183-treaty" } },
  { key: "at-tax-presence-below-six-months", title: "Aufenthalt unter sechs Monaten nicht ausschließen", trigger: "Kurzer österreichischer Aufenthalt soll Ansässigkeit verneinen", safeFirstStep: "Unter sechs Monaten schließt Wohnsitz oder gewöhnlichen Aufenthalt nicht automatisch aus.", riskLevel: "high", dimensions: { what: "at-tax-below-six-months-not-exclusion", whoWhen: "at-tax-wohnsitz-bao-26-1", documents: "at-tax-zweitwohnsitz-day-records", how: "at-tax-below-six-months-not-exclusion", next: "at-tax-domestic-liability-classify-route", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-six-months-not-183-treaty", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-below-six-months-not-exclusion", freshness: "at-tax-statute-period-2026", negatives: "at-tax-below-six-months-not-exclusion" } },
  { key: "at-tax-limited-section-98-routing", title: "Beschränkte Steuerpflicht § 98 2026", trigger: "Kein Wohnsitz und kein gewöhnlicher Aufenthalt, aber österreichische Einkünfte", safeFirstStep: "Einkunftsart nach § 98 prüfen; nicht pauschal keine Steuer annehmen.", riskLevel: "high", dimensions: { what: "at-tax-limited-section-1-3", whoWhen: "at-tax-section-98-structure", documents: "at-tax-e9-foreign-certification", how: "at-tax-s98-employment-nexus", next: "at-tax-domestic-not-final-treaty-right", deadlines: "at-tax-filing-paper-30-april", problems: "at-tax-limited-not-no-tax", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-limited-not-no-tax", freshness: "at-tax-statute-period-2026", negatives: "at-tax-limited-not-no-tax" } },
  { key: "at-tax-no-domestic-nexus", title: "Kein inländischer Steuernexus", trigger: "Kein österreichischer Wohnsitz, kein gewöhnlicher Aufenthalt, keine §98-Einkünfte", safeFirstStep: "Keine unsupported österreichische Steuerbehauptung ohne Anknüpfung.", riskLevel: "high", dimensions: { what: "at-tax-section-98-structure", whoWhen: "at-tax-limited-section-1-3", documents: "at-tax-e9-foreign-certification", how: "at-tax-no-domestic-nexus-route", next: "at-tax-treaty-review-handoff", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-domestic-not-final-treaty-right", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-domestic-not-treaty-residence", freshness: "at-tax-statute-period-2026", negatives: "at-tax-limited-not-no-tax" } },
  { key: "at-tax-section-1-4-application", title: "Antrag § 1 Abs. 4 EStG 2026", trigger: "EU/EWR ohne Wohnsitz/gewöhnlichen Aufenthalt sucht unbeschränkte Behandlung", safeFirstStep: "90-Prozent- oder 2026-Grenzbetrag prüfen; nicht mit Wohnsitz verwechseln.", riskLevel: "high", dimensions: { what: "at-tax-section-1-4-option", whoWhen: "at-tax-section-1-4-90-percent", documents: "at-tax-e9-foreign-certification", how: "at-tax-section-1-4-threshold-2026", next: "at-tax-section-1-4-not-actual-residence", deadlines: "at-tax-filing-finanzonline-30-june", problems: "at-tax-section-1-4-not-actual-residence", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-section-1-4-not-actual-residence", freshness: "at-tax-statute-period-2026", negatives: "at-tax-section-1-4-not-actual-residence" } },
  { key: "at-tax-foreign-income-evidence", title: "Auslandsnachweis und E9 2026", trigger: "§ 1 Abs. 4 oder grenzüberschreitende Einkommensnachweise fehlen", safeFirstStep: "Ausländische Bescheinigung/E9 verlangen; keine erfundene Eignung.", riskLevel: "high", dimensions: { what: "at-tax-e9-foreign-certification", whoWhen: "at-tax-section-1-4-option", documents: "at-tax-e9-foreign-certification", how: "at-tax-finanzonline-channel", next: "at-tax-section-1-4-option", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-bmf-guidance-not-statute", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-domestic-not-final-treaty-right", freshness: "at-tax-statute-period-2026", negatives: "at-tax-a1-not-tax-certificate" } },
  { key: "at-tax-zweitwohnsitz-evaluation", title: "Zweitwohnsitzverordnung prüfen 2026", trigger: "Österreichische Zweitwohnung bei Auslands-Lebensmittelpunkt", safeFirstStep: "Fünf-Jahres-Voraussetzung, 70-Tage-Grenze und Tagesnachweise prüfen.", riskLevel: "high", dimensions: { what: "at-tax-zweitwohnsitz-special-rule", whoWhen: "at-tax-zweitwohnsitz-five-year-prerequisite", documents: "at-tax-zweitwohnsitz-day-records", how: "at-tax-zweitwohnsitz-70-day-threshold", next: "at-tax-domestic-not-treaty-residence", deadlines: "at-tax-statute-period-2026", problems: "at-tax-70-days-not-general-residence", dutiesAfter: "at-tax-zweitwohnsitz-day-records", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-70-days-not-general-residence", freshness: "at-tax-statute-period-2026", negatives: "at-tax-70-days-not-general-residence" } },
  { key: "at-tax-filing-procedural-route", title: "Einkommensteuererklärung Verfahren 2026", trigger: "Abgabe oder Frist der Einkommensteuererklärung", safeFirstStep: "Veranlagungsart trennen; Papier 30.4. / FinanzOnline 30.6. nur für ordentliche Erklärung.", riskLevel: "medium", dimensions: { what: "at-tax-filing-paper-30-april", whoWhen: "at-tax-filing-finanzonline-30-june", documents: "at-tax-e9-foreign-certification", how: "at-tax-finanzonline-channel", next: "at-tax-filing-deadlines-not-universal", deadlines: "at-tax-filing-finanzonline-30-june", problems: "at-tax-filing-deadlines-not-universal", dutiesAfter: "at-tax-finanzamt-oesterreich-category", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-bmf-guidance-not-statute", freshness: "at-tax-statute-period-2026", negatives: "at-tax-filing-deadlines-not-universal" } },
  { key: "at-tax-employment-foreign-residence", title: "Arbeitnehmer mit Auslandswohnsitz 2026", trigger: "Österreichische Beschäftigung, Wohnsitz im Ausland", safeFirstStep: "Inländische Beschäftigungsnexus und §98 prüfen; Abkommen später.", riskLevel: "high", dimensions: { what: "at-tax-s98-employment-nexus", whoWhen: "at-tax-limited-section-1-3", documents: "at-tax-e9-foreign-certification", how: "at-tax-income-item-specific", next: "at-tax-treaty-review-handoff", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-a1-competent-not-tax-residence", dutiesAfter: "at-tax-domestic-not-final-treaty-right", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-domestic-not-treaty-residence", freshness: "at-tax-statute-period-2026", negatives: "at-tax-a1-not-tax-certificate" } },
  { key: "at-tax-self-employed-gewerbe-boundary", title: "Selbständige/Gewerbe und Steuer trennen 2026", trigger: "Grenzüberschreitende Selbständigkeit oder DLA", safeFirstStep: "§98-Selbständigkeitsnexus getrennt von Dienstleistungsanzeige und A1 prüfen.", riskLevel: "high", dimensions: { what: "at-tax-s98-self-employed-nexus", whoWhen: "at-tax-dla-not-tax-registration", documents: "at-tax-e9-foreign-certification", how: "at-tax-income-item-specific", next: "at-tax-treaty-review-handoff", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-gewerbe-not-tax-residence", dutiesAfter: "at-tax-domestic-not-final-treaty-right", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-dla-not-tax-registration", freshness: "at-tax-statute-period-2026", negatives: "at-tax-gewerbe-not-tax-residence" } },
  { key: "at-tax-rental-section-98", title: "Immobilienvermietung § 98 2026", trigger: "Österreichische Mieteinnahmen ohne inländischen Wohnsitz", safeFirstStep: "§98-Vermietungsnexus prüfen; nicht mit Wohnsitz verwechseln.", riskLevel: "high", dimensions: { what: "at-tax-s98-rental-nexus", whoWhen: "at-tax-limited-section-1-3", documents: "at-tax-e9-foreign-certification", how: "at-tax-section-98-structure", next: "at-tax-domestic-not-final-treaty-right", deadlines: "at-tax-filing-paper-30-april", problems: "at-tax-limited-not-no-tax", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-domestic-not-final-treaty-right", freshness: "at-tax-statute-period-2026", negatives: "at-tax-limited-not-no-tax" } },
  { key: "at-tax-treaty-review-handoff-process", title: "Abkommensprüfung delegieren", trigger: "Finale AT-SK-Besteuerungsfrage oder Doppelansässigkeit", safeFirstStep: "TREATY_REVIEW_REQUIRED; keine Artikel-4- oder 183-Tage-Logik in 0I.", riskLevel: "high", dimensions: { what: "at-tax-treaty-review-handoff", whoWhen: "at-tax-domestic-not-treaty-residence", documents: "at-tax-e9-foreign-certification", how: "at-tax-treaty-review-handoff", next: "at-tax-treaty-review-handoff", deadlines: "at-tax-filing-deadlines-not-universal", problems: "at-tax-domestic-not-final-treaty-right", dutiesAfter: "at-tax-income-item-specific", institution: "at-tax-finanzamt-oesterreich-category", boundaries: "at-tax-treaty-review-handoff", freshness: "at-tax-statute-period-2026", negatives: "at-tax-six-months-not-183-treaty" } },
]);

// Alias claims referenced only in process dimensions
const ROUTE_ALIAS_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-tax-domestic-liability-classify-route", category: "procedure", type: "procedure", text: "Zuerst inländische Steuerpflicht nach § 1 EStG und BAO § 26 einordnen, dann einkunftsartbezogen und erst danach Abkommen.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
  { key: "at-tax-no-domestic-nexus-route", category: "procedure", type: "procedure", text: "Ohne Wohnsitz, ohne gewöhnlichen Aufenthalt und ohne §98-Nexus keine unsupported österreichische Steuerbehauptung.", sourceKey: "at-tax-estg-ris", passageKey: "at-tax-estg-ris-text", riskLevel: "high" },
]);

export const AT_TAX_ALL_UNITS: readonly Unit[] = Object.freeze([...AT_TAX_UNITS, ...ROUTE_ALIAS_UNITS]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

function sc(
  id: string,
  label: string,
  coverage: ScenarioCoverage,
  requiredClaimKeys: readonly string[],
  requiredProcessKeys: readonly string[],
): ScenarioSpec {
  return Object.freeze({ id, label, coverage, requiredClaimKeys, requiredProcessKeys });
}

export const AT_TAX_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  sc("s01-wohnsitz-unlimited", "Österreichischer Wohnsitz", "COVERED", ["at-tax-wohnsitz-bao-26-1", "at-tax-unlimited-section-1-2"], ["at-tax-unlimited-wohnsitz"]),
  sc("s02-six-months-ordinary-stay", "Aufenthalt über sechs Monate", "COVERED", ["at-tax-six-month-statutory-rule"], ["at-tax-unlimited-gewoehnlicher-aufenthalt"]),
  sc("s03-below-six-months", "Unter sechs Monaten kein Auto-Ausschluss", "COVERED", ["at-tax-below-six-months-not-exclusion"], ["at-tax-presence-below-six-months"]),
  sc("s04-section-98-limited", "§98 ohne Wohnsitz", "COVERED", ["at-tax-limited-section-1-3", "at-tax-section-98-structure"], ["at-tax-limited-section-98-routing"]),
  sc("s05-no-domestic-nexus", "Kein inländischer Nexus", "COVERED", ["at-tax-no-domestic-nexus-route"], ["at-tax-no-domestic-nexus"]),
  sc("s06-section-1-4-90-percent", "§1(4) 90-Prozent", "COVERED", ["at-tax-section-1-4-90-percent"], ["at-tax-section-1-4-application"]),
  sc("s07-section-1-4-threshold", "§1(4) 2026 Grenzbetrag", "COVERED", ["at-tax-section-1-4-threshold-2026"], ["at-tax-section-1-4-application"]),
  sc("s08-section-1-4-not-met", "§1(4) nicht erfüllt", "COVERED", ["at-tax-section-1-4-option", "at-tax-limited-section-1-3"], ["at-tax-limited-section-98-routing"]),
  sc("s09-e9-missing", "E9/Auslandsnachweis fehlt", "COVERED", ["at-tax-e9-foreign-certification"], ["at-tax-foreign-income-evidence"]),
  sc("s10-zweitwohnsitz", "Zweitwohnsitzverordnung", "COVERED", ["at-tax-zweitwohnsitz-special-rule", "at-tax-zweitwohnsitz-70-day-threshold"], ["at-tax-zweitwohnsitz-evaluation"]),
  sc("s11-70-day-reject", "70-Tage nicht verallgemeinern", "COVERED", ["at-tax-70-days-not-general-residence"], ["at-tax-zweitwohnsitz-evaluation"]),
  sc("s12-183-day-reject", "183-Tage nicht inländisch", "COVERED", ["at-tax-six-months-not-183-treaty"], ["at-tax-unlimited-gewoehnlicher-aufenthalt"]),
  sc("s13-dual-residence-treaty", "AT+SK Doppelansässigkeit", "EXPLICITLY_OUT_OF_SCOPE", ["at-tax-treaty-review-handoff"], ["at-tax-treaty-review-handoff-process"]),
  sc("s14-employee-foreign-residence", "AT-Arbeit Auslandswohnsitz", "COVERED", ["at-tax-s98-employment-nexus"], ["at-tax-employment-foreign-residence"]),
  sc("s15-self-employed-gewerbe", "Selbständig/Gewerbe getrennt", "COVERED", ["at-tax-s98-self-employed-nexus", "at-tax-dla-not-tax-registration"], ["at-tax-self-employed-gewerbe-boundary"]),
  sc("s16-rental-property", "Immobilienvermietung", "COVERED", ["at-tax-s98-rental-nexus"], ["at-tax-rental-section-98"]),
  sc("s17-treaty-allocation-question", "Finale AT-SK-Besteuerung", "EXPLICITLY_OUT_OF_SCOPE", ["at-tax-treaty-review-handoff"], ["at-tax-treaty-review-handoff-process"]),
]);

export const AT_TAX_NEGATIVE_CONTROLS = Object.freeze([
  "at-tax-nationality-not-residence",
  "at-tax-locale-not-residence",
  "at-tax-market-pack-not-residence",
  "at-tax-meldezettel-not-automatic-wohnsitz",
  "at-tax-hauptwohnsitz-not-sole-test",
  "at-tax-a1-not-tax-certificate",
  "at-tax-a1-competent-not-tax-residence",
  "at-tax-health-not-tax-residence",
  "at-tax-family-benefits-not-tax-residence",
  "at-tax-unemployment-not-tax-residence",
  "at-tax-dla-not-tax-registration",
  "at-tax-gewerbe-not-tax-residence",
  "at-tax-domestic-not-treaty-residence",
  "at-tax-gewoehnlicher-aufenthalt-bao-26-2",
  "at-tax-unlimited-not-all-world-taxed-after-treaty",
  "at-tax-limited-not-no-tax",
  "at-tax-six-months-not-183-treaty",
  "at-tax-70-days-not-general-residence",
  "at-tax-section-1-4-not-actual-residence",
  "at-tax-section-1-4-threshold-2026",
  "at-tax-domestic-not-final-treaty-right",
  "at-tax-filing-deadlines-not-universal",
  "at-tax-bmf-guidance-not-statute",
  "at-tax-no-calculator",
  "at-tax-below-six-months-not-exclusion",
  "at-tax-income-item-specific",
  "at-tax-treaty-review-handoff",
  "at-tax-zweitwohnsitz-five-year-prerequisite",
  "at-tax-zweitwohnsitz-day-records",
  "at-tax-section-1-4-90-percent",
  "at-tax-finanzonline-channel",
  "at-tax-statute-period-2026",
  "at-tax-six-month-statutory-rule",
  "at-tax-wohnsitz-bao-26-1",
  "at-tax-unlimited-section-1-2",
  "at-tax-limited-section-1-3",
]);

export function evaluateAtPersonalIncomeTaxResidenceProcessCompleteness() {
  const processKeys = new Set(AT_TAX_PROCESSES.map((process) => process.key));
  const claimKeys = new Set(AT_TAX_ALL_UNITS.map((unit) => unit.key));
  const incomplete = AT_TAX_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !process.dimensions[dimension])
  ));
  const missingClaims = AT_TAX_PROCESSES.flatMap((process) => (
    PROCESS_COMPLETE_DIMENSIONS
      .map((dimension) => process.dimensions[dimension])
      .filter((key) => !claimKeys.has(key))
      .map((key) => `${process.key}:${key}`)
  ));
  const blocked = AT_TAX_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_TAX_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_TAX_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
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
    processCount: AT_TAX_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    negativeControlCount: AT_TAX_NEGATIVE_CONTROLS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
  });
}

const PUBLISHERS = Object.freeze([
  { key: "ris-tax", name: "Republik Österreich – Rechtsinformationssystem", portal: "https://www.ris.bka.gv.at/", identity: "AT_RIS_TAX" },
  { key: "bmf-tax", name: "Bundesministerium für Finanzen", portal: "https://www.bmf.gv.at/", identity: "AT_BMF_TAX" },
  { key: "oesterreich-gv-tax", name: "oesterreich.gv.at", portal: "https://www.oesterreich.gv.at/", identity: "AT_OESTERREICH_GV_TAX" },
]);

export function buildAtPersonalIncomeTaxResidencePack() {
  const trustDomain = item("trustDomain", "at", { code: AT_NATIONAL_TRUST_DOMAIN, name: "Österreich" });
  const jurisdiction = item("jurisdictions", "at", {
    level: AT_NATIONAL_JURISDICTION_LEVEL,
    code: AT_NATIONAL_COUNTRY_CODE,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    name: "Republik Österreich",
  });
  const scope = item("territorialScopes", "at", {
    type: "at_national", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("publishers", spec.key, {
    name: spec.name, type: "national_ministry",
    territorialScopeId: scope.id, trustDomainId: trustDomain.id,
  })]));
  const authorities = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("authorities", spec.identity + ":" + spec.key, {
    publisherId: publishers[spec.key].id, name: spec.name, type: "national_ministry",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id, officialPortalUrl: spec.portal,
  })]));
  const sources = AT_TAX_OFFICIAL_SOURCES.map((spec) => {
    const source = item("sources", spec.key, {
      publisherId: publishers[spec.publisherKey].id,
      authorityId: authorities[spec.publisherKey].id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: "official_guidance", purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: `https://${spec.officialDomain}`,
      sourceClass: spec.sourceClass, authorityLevel: "SPECIFIC_AUTHORITY",
      retrievalMethod: "HTML_DOCUMENT", handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false, publicationIdentifier: spec.title,
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id, versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
      effectiveDate: AT_TAX_AS_OF,
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
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [String(passage.key), passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = AT_TAX_ALL_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_TAX_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type, text: unit.text, jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id, authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel, requiresEffectiveDate: unit.key.includes("threshold") || unit.key.includes("2026"),
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
      entityType: "claim", entityId: claim.id, status: "fresh", effectiveDateKnown: unit.key.includes("2026"),
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });
  const processes = AT_TAX_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_TAX_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of AT_TAX_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_TAX_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_TAX_PACK_ID,
    canonicalLanguage: "de" as const,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: Object.values(publishers),
    authorities: Object.values(authorities),
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    freshnessRecords: [...sources.map(({ freshness }) => freshness), ...claims.map(({ claimFreshness }) => claimFreshness)],
    handlingPolicies: sources.map(({ policy }) => policy),
    processes,
    processClaimLinks,
  });
}

export function atPersonalIncomeTaxResidenceSummary(
  pack: ReturnType<typeof buildAtPersonalIncomeTaxResidencePack> = buildAtPersonalIncomeTaxResidencePack(),
) {
  return Object.freeze({
    packId: pack.packId,
    processGroup: AT_TAX_PROCESS_GROUP,
    claimCount: pack.claims.length,
    processCount: pack.processes.length,
    completeness: evaluateAtPersonalIncomeTaxResidenceProcessCompleteness(),
    threshold2026: AT_TAX_SECTION_1_4_FOREIGN_INCOME_THRESHOLD_EUR_2026,
  });
}
