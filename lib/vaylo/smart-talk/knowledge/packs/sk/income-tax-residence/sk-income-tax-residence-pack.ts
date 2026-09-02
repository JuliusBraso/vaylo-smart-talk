/**
 * CB-TAX-0C Slovak national income-tax residence pack.
 * Trust sk. Jurisdiction SK national. Not bilateral treaty law. Not EU law.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

export const SK_TAX_PACK_ID = "sk_income_tax_residence" as const;
export const SK_TAX_PROCESS_GROUP = "sk_income_tax_residence" as const;
export const SK_TAX_CANONICAL_LANGUAGE = "de" as const;
export const SK_TAX_STATUTE_EFFECTIVE_FROM = "2026-01-01" as const;
export const SK_TAX_STATUTE_EFFECTIVE_TO = "2026-12-30" as const;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(SK_TAX_PACK_ID, entityClass, key),
    ...values,
  });
}

export const SK_TAX_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "sk-tax-act-595-2003",
    publisherKey: "slovlex" as const,
    officialDomain: "static.slov-lex.sk",
    url: "https://static.slov-lex.sk/pdf/SK/ZZ/2003/595/ZZ_2003_595_20260101.pdf",
    title: "Slov-Lex: Gesetz 595/2003 Z. z. o dani z príjmov, verbindliche Fassung 2026-01-01 bis 2026-12-30",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-tax-act-595-text",
      locator: "§ 1, § 2, § 45 Gesetz 595/2003, Fassung 2026-01-01",
      text: "Nach § 1 Absatz 2 des Gesetzes 595/2003 hat ein anwendbarer internationaler Steuervertrag Vorrang vor dem inländischen Gesetz, soweit er reicht. Nach § 2 Buchstabe d Ziffer 1 ist Steuerpflichtiger mit unbeschränkter Steuerpflicht (daňovník s neobmedzenou daňovou povinnosťou) eine natürliche Person mit trvalý pobyt in der Slowakei oder mit bydlisko in der Slowakei oder mit obvyklý pobyt, der eine Anwesenheit von mindestens 183 Tagen im betreffenden Kalenderjahr umfasst, zusammenhängend oder in mehreren Zeiträumen; jeder begonnene Tag zählt. Bydlisko verlangt eine nicht nur gelegentliche Unterkunft und die Gesamtheit der persönlichen und wirtschaftlichen Bindungen sowie die erkennbare Absicht, dort dauernd zu bleiben. Eigentum, Elternhaus, Hotel oder vorübergehende Unterkunft sind nicht automatisch bydlisko. Nach § 2 Buchstabe e Ziffer 1 gehört zur beschränkten Steuerpflicht (daňovník s obmedzenou daňovou povinnosťou) auch, wer die inländischen Merkmale des § 2 Buchstabe d Ziffer 1 erfüllen würde, aber aufgrund eines anwendbaren internationalen Vertrags in einem anderen Vertragsstaat als unbeschränkt steuerpflichtig gilt. Eine Person, die sich in der Slowakei nur zum Studium oder zur medizinischen Behandlung aufhält, fällt unter die gesetzliche inländische Ausnahme des § 2 Buchstabe e in der geltenden Fassung. Die aktuelle verbindliche Fassung enthält keine tägliche Pendlerausnahme mehr. Nach § 45 Absatz 1 ist die Anrechnung ausländischer Steuer (zápočet dane) begrenzt: anrechenbar ist nur Steuer, die sich auf in die slowakische Bemessungsgrundlage einbezogene Einkünfte bezieht, innerhalb gesetzlicher und vertraglicher Grenzen. Nach § 45 Absatz 3 Buchstabe c kann für ausländische Einkünfte aus abhängiger Arbeit aus einem Vertragsstaat, die nachweislich im Ausland besteuert wurden, die Freistellung (vyňatie príjmov) angewendet werden, wenn dies für den Steuerpflichtigen vorteilhafter ist. § 45 Absatz 3 Buchstabe c gilt nicht für selbständige Arbeit.",
    }],
  },
  {
    key: "sk-tax-mfsr-treaties",
    publisherKey: "mfsr" as const,
    officialDomain: "www.mfsr.sk",
    url: "https://www.mfsr.sk/sk/dane-cla-uctovnictvo/priame-dane/dane-z-prijmu/zmluvy-zamedzeni-dvojiteho-zdanenia/zmluvy-zamedzeni-dvojiteho-zdanenia/zoznam-platnych-ucinnych-zmluv-zamedzeni-dvojiteho-zdanenia/",
    title: "Ministerstvo financií SR: Verzeichnis geltender Doppelbesteuerungsabkommen",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-tax-mfsr-treaties-text",
      locator: "Zoznam platných zmlúv",
      text: "Das Finanzministerium der Slowakischen Republik veröffentlicht das Verzeichnis geltender Abkommen zur Vermeidung der Doppelbesteuerung. Das Verzeichnis bestätigt das Bestehen des Abkommens; es ersetzt nicht den authentischen Vertragstext und nicht die innerstaatliche Umsetzung nach Gesetz 595/2003.",
    }],
  },
  {
    key: "sk-tax-fs-office",
    publisherKey: "fs" as const,
    officialDomain: "www.financnasprava.sk",
    url: "https://www.financnasprava.sk/",
    title: "Finančná správa: Portal und zuständiger daňový úrad",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "sk-tax-fs-office-text",
      locator: "Daňový úrad / Finančná správa",
      text: "Für die slowakische Einkommensteuer natürlicher Personen ist die Finančná správa zuständig; die genaue Amtsinstanz des daňový úrad ist live zu bestimmen und nicht festzuschreiben. Formulare und Abgabekanäle sind FETCH_LIVE.",
    }],
  },
  {
    key: "sk-tax-fs-cudzinci-stale",
    publisherKey: "fs" as const,
    officialDomain: "www.financnasprava.sk",
    url: "https://www.financnasprava.sk/sk/obcania/dane/dan-z-prijmov/cudzinci-v-sr",
    title: "Finančná správa: Cudzinci v SR (Erklärseite; auf Übereinstimmung mit geltendem Gesetz zu prüfen)",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-tax-fs-cudzinci-stale-text",
      locator: "Cudzinci v SR / ältere Pendlerhinweise",
      text: "STALE_OFFICIAL_GUIDANCE. Die Erklärseite Cudzinci v SR kann noch eine tägliche oder intervallbezogene Pendlerausnahme für Arbeitnehmer erwähnen. Die aktuell verbindliche Slov-Lex-Fassung des § 2 Buchstabe e enthält diese Ausnahme nicht mehr. Slov-Lex geht vor. Die Abweichung ist MANUAL_REVIEW_REQUIRED und darf nicht stillschweigend als geltendes Gesetz gespeichert werden.",
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

export const SK_TAX_UNITS: readonly Unit[] = Object.freeze([
  { key: "sk-tax-section-1-treaty-precedence", category: "statute", type: "definition", text: "Nach § 1 Absatz 2 des Gesetzes 595/2003 hat ein anwendbarer internationaler Steuervertrag Vorrang vor dem inländischen Gesetz, soweit er reicht. Ein inländischer Ansässigkeitskandidat ist deshalb nicht automatisch die endgültige grenzüberschreitende Ansässigkeit.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-domestic-candidate-or", category: "residence", type: "definition", text: "SK_DOMESTIC_RESIDENCE_CANDIDATE nach § 2 Buchstabe d Ziffer 1: natürliche Person mit trvalý pobyt oder bydlisko oder obvyklý pobyt / Anwesenheit von mindestens 183 Tagen im Kalenderjahr. Die drei Grundlagen sind alternativ, nicht kumulativ.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-trvaly-pobyt", category: "residence", type: "definition", text: "Trvalý pobyt in der Slowakei ist eine selbständige inländische Grundlage der unbeschränkten Steuerpflicht. Trvalý pobyt ist nicht bydlisko und nicht automatisch die abkommensrechtliche Ansässigkeit.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-bydlisko", category: "residence", type: "definition", text: "Bydlisko verlangt eine nicht nur gelegentliche verfügbare Unterkunft, die Gesamtheit der persönlichen und wirtschaftlichen Bindungen und die erkennbare Absicht, dort dauernd zu bleiben.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-bydlisko-not-trvaly", category: "residence", type: "exception", text: "Bydlisko ist nicht trvalý pobyt. Die Begriffe sind gesetzlich getrennt.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-bydlisko-not-hotel", category: "residence", type: "exception", text: "Hotel, Elternhaus, Eigentum oder vorübergehende Unterkunft sind nicht automatisch bydlisko.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-domestic-183", category: "residence", type: "definition", text: "SK_DOMESTIC_183: mindestens 183 Tage im betreffenden Kalenderjahr, zusammenhängend oder in mehreren Zeiträumen. Jeder begonnene Tag zählt. 182 Tage erfüllen den inländischen Tagestest nicht; 183 und 184 erfüllen ihn.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-domestic-183-not-art15", category: "boundary", type: "exception", text: "SK_DOMESTIC_183 ist nicht ARTICLE15_183. Getrennte Zähler, getrennte Rechtsfolgen.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-study-treatment-exception", category: "residence", type: "exception", text: "Eine Person, die sich in der Slowakei nur zum Studium oder zur medizinischen Behandlung aufhält, fällt unter die geltende gesetzliche Ausnahme des § 2 Buchstabe e. Die Ausnahme ist nicht zu verallgemeinern.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-section-2e-override", category: "residence", type: "definition", text: "Nach § 2 Buchstabe e Ziffer 1 gehört zur beschränkten Steuerpflicht, wer die Merkmale des § 2 Buchstabe d Ziffer 1 erfüllen würde, aber aufgrund eines anwendbaren Vertrags in einem anderen Vertragsstaat als unbeschränkt steuerpflichtig gilt. SK_DOMESTIC_RESIDENCE_CANDIDATE und SK_FINAL_TAX_STATUS_AFTER_TREATY bleiben getrennt. Die inländischen Tatsachen werden nicht gelöscht.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-stale-commuter-guidance", category: "guidance", type: "boundary", text: "STALE_OFFICIAL_GUIDANCE. Die Finančná-správa-Seite Cudzinci v SR kann eine obsolete Pendlerausnahme nennen. Die verbindliche Slov-Lex-Fassung 2026 enthält sie nicht. MANUAL_REVIEW_REQUIRED. Nicht als geltendes Gesetz speichern.", sourceKey: "sk-tax-fs-cudzinci-stale", passageKey: "sk-tax-fs-cudzinci-stale-text", riskLevel: "high" },
  { key: "sk-tax-no-obsolete-commuter-statute", category: "guidance", type: "exception", text: "Die aktuelle gesetzliche Fassung des § 2 Buchstabe e speichert keine tägliche oder intervallbezogene Arbeitnehmer-Pendlerausnahme als geltendes Recht.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-trvaly-not-treaty-residence", category: "boundary", type: "exception", text: "Trvalý pobyt ist nicht automatisch endgültige Abkommensansässigkeit.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-period-reeval", category: "procedure", type: "procedure", text: "Steueransässigkeit kann wechseln. Perioden mit effectiveFrom und effectiveTo sind neu zu bewerten, etwa bei einem Umzug während des Steuerjahres.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-45-1-credit-limit", category: "relief", type: "definition", text: "Wo der Vertrag Anrechnung verlangt, begrenzt § 45 Absatz 1 die ausländische Steueranrechnung. CREDIT_CALCULATION_REQUIRED, wenn der genaue Betrag gefragt ist. Kein Steuerrechner in diesem Kern.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-45-3-c-employment", category: "relief", type: "procedure", text: "§ 45 Absatz 3 Buchstabe c: für ausländische Einkünfte aus abhängiger Arbeit aus einem Vertragsstaat, die nachweislich im Ausland besteuert wurden, kann vyňatie príjmov angewendet werden, wenn dies vorteilhafter ist. Bei 2025+ MLI-Anrechnungsbasis ist das nicht automatisch die endgültige Methode.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-45-3-c-not-self-employed", category: "relief", type: "exception", text: "§ 45 Absatz 3 Buchstabe c gilt nicht für selbständige Arbeit, Unternehmensgewinne, Dividenden, Zinsen oder sämtliche Auslandseinkünfte.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-45-3-c-comparison-fail-closed", category: "relief", type: "procedure", text: "Fehlen Beträge für den Vorteilhaftigkeitsvergleich, ist METHOD_COMPARISON_REQUIRED / SK_45_3_C_COMPARISON_REQUIRED. Keine geratene Methode. comparisonRequired bleibt wahr.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-credit-not-refund", category: "relief", type: "exception", text: "Anrechnung (zápočet dane) ist keine volle Erstattung.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-exemption-not-no-filing", category: "relief", type: "exception", text: "Freistellung (vyňatie príjmov) bedeutet nicht, dass keine Erklärung oder Meldung erforderlich ist.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-taxing-right-not-amount", category: "boundary", type: "exception", text: "STATE_MAY_TAX ist nicht TAX_AMOUNT_DUE. Kein Steuerbetrag in diesem Kern.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-residence-not-only-filing-state", category: "boundary", type: "exception", text: "Die Abkommensansässigkeit ist nicht automatisch der einzige Staat, in dem eine Erklärung abzugeben ist.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-authority-fs", category: "institution", type: "definition", text: "Zuständige Kategorie ist die Finančná správa / daňový úrad. Die genaue Amtsinstanz ist FETCH_LIVE.", sourceKey: "sk-tax-fs-office", passageKey: "sk-tax-fs-office-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "sk-tax-office-fetch-live", category: "institution", type: "procedure", text: "Das genaue Finanzamt und aktuelle Formulare sind live zu bestimmen.", sourceKey: "sk-tax-fs-office", passageKey: "sk-tax-fs-office-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "sk-tax-not-eu-law", category: "boundary", type: "boundary", text: "Slowakisches inländisches Steuerrecht ist nicht EU-Recht und nicht bilaterales Abkommensrecht.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-not-social-security", category: "boundary", type: "boundary", text: "A1, zuständiger Sozialversicherungsstaat oder PD ersetzen nicht Steueransässigkeit, Artikel 14, Artikel 15 oder Entlastung.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-evidence-days", category: "evidence", type: "procedure", text: "Für den 183-Tage-Test können Kalender, Reisen, Arbeitsnachweise und andere maßgebliche Unterlagen dienen. Kein einzelnes Beweismittel ist universell zwingend.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "medium" },
  { key: "sk-tax-foreign-tax-proof", category: "evidence", type: "procedure", text: "Für § 45 Absatz 3 Buchstabe c ist nachweisliche ausländische Besteuerung der abhängigen Arbeit erforderlich. Fehlt der Nachweis, ist die inländische Freistellungsoption nicht feststellbar.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-relief-handoff", category: "procedure", type: "procedure", text: "Ausländische Einkünfte werden nach Feststellung der inländischen Kandidatur und der Vertragsansässigkeit an die Entlastungsprüfung übergeben. Die Reihenfolge ist Ansässigkeit, Besteuerungsrecht, Vertragsmethode, dann § 45.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-no-calculator", category: "boundary", type: "exception", text: "Dieser Kern berechnet keine Euro-Beträge, keine Anrechnungshöhe und keine Vorteilhaftigkeitsdifferenz.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "high" },
  { key: "sk-tax-statute-period-2026", category: "freshness", type: "definition", text: "Die gespeicherte gesetzliche Fassung gilt vom 2026-01-01 bis 2026-12-30. Künftige Reformen sind FUTURE_WATCH und nicht ingestierbar.", sourceKey: "sk-tax-act-595-2003", passageKey: "sk-tax-act-595-text", riskLevel: "medium" },
  { key: "sk-tax-mfsr-directory-not-treaty-text", category: "freshness", type: "exception", text: "Das MF-SR-Vertragsverzeichnis ersetzt nicht den authentischen Vertragstext.", sourceKey: "sk-tax-mfsr-treaties", passageKey: "sk-tax-mfsr-treaties-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const SK_TAX_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "sk-tax-domestic-candidate", title: "Slowakischen inländischen Ansässigkeitskandidaten bestimmen 2026", trigger: "Unbeschränkte oder beschränkte slowakische Steuerpflicht, trvalý pobyt, bydlisko oder 183 Tage", safeFirstStep: "Die drei alternativen Grundlagen des § 2 Buchstabe d Ziffer 1 getrennt prüfen; nicht alle drei verlangen.", riskLevel: "high", dimensions: { what: "sk-tax-domestic-candidate-or", whoWhen: "sk-tax-section-1-treaty-precedence", documents: "sk-tax-evidence-days", how: "sk-tax-trvaly-pobyt", next: "sk-tax-section-2e-override", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-bydlisko-not-hotel", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-trvaly-not-treaty-residence" } },
  { key: "sk-tax-trvaly-pobyt", title: "Trvalý-pobyt-Weg 2026", trigger: "Daueraufenthalt in der Slowakei als Steueransässigkeit", safeFirstStep: "Trvalý pobyt als eigene Grundlage führen; nicht mit bydlisko oder Abkommensansässigkeit gleichsetzen.", riskLevel: "high", dimensions: { what: "sk-tax-trvaly-pobyt", whoWhen: "sk-tax-domestic-candidate-or", documents: "sk-tax-evidence-days", how: "sk-tax-trvaly-pobyt", next: "sk-tax-section-2e-override", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-trvaly-not-treaty-residence", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-bydlisko-not-trvaly" } },
  { key: "sk-tax-bydlisko", title: "Bydlisko-Weg 2026", trigger: "Wohnung, Haus oder Unterkunft in der Slowakei als Steuerwohnsitz", safeFirstStep: "Verfügbarkeit, Bindungen und Dauerabsicht prüfen; Hotel und Eigentum nicht automatisch als bydlisko setzen.", riskLevel: "high", dimensions: { what: "sk-tax-bydlisko", whoWhen: "sk-tax-domestic-candidate-or", documents: "sk-tax-evidence-days", how: "sk-tax-bydlisko", next: "sk-tax-section-2e-override", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-bydlisko-not-hotel", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-bydlisko-not-trvaly" } },
  { key: "sk-tax-183-day", title: "Slowakischen 183-Tage-Kalenderjahrestest 2026", trigger: "Anwesenheitstage in der Slowakei, 182/183/184 oder mehrere Aufenthalte", safeFirstStep: "Kalenderjahr, begonnene Tage und 183-Grenze prüfen; nicht mit Artikel 15 vermengen.", riskLevel: "high", dimensions: { what: "sk-tax-domestic-183", whoWhen: "sk-tax-domestic-candidate-or", documents: "sk-tax-evidence-days", how: "sk-tax-domestic-183", next: "sk-tax-section-2e-override", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-domestic-183-not-art15", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-domestic-183-not-art15" } },
  { key: "sk-tax-study-treatment", title: "Studien- oder Behandlungsausnahme 2026", trigger: "Aufenthalt in der Slowakei nur zum Studium oder zur Behandlung", safeFirstStep: "Nur die geltende gesetzliche Ausnahme anwenden; nicht verallgemeinern.", riskLevel: "high", dimensions: { what: "sk-tax-study-treatment-exception", whoWhen: "sk-tax-study-treatment-exception", documents: "sk-tax-evidence-days", how: "sk-tax-study-treatment-exception", next: "sk-tax-domestic-candidate-or", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-study-treatment-exception", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-study-treatment-exception" } },
  { key: "sk-tax-treaty-override-2e", title: "Vertragsvorrang nach § 2 Buchstabe e 2026", trigger: "Inländischer Kandidat, der nach DBA in einem anderen Staat ansässig ist", safeFirstStep: "Inländische Tatsachen behalten; endgültigen Status nach Vertrag getrennt führen.", riskLevel: "high", dimensions: { what: "sk-tax-section-2e-override", whoWhen: "sk-tax-section-1-treaty-precedence", documents: "sk-tax-evidence-days", how: "sk-tax-section-2e-override", next: "sk-tax-relief-handoff", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-trvaly-not-treaty-residence", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-mfsr-directory-not-treaty-text", negatives: "sk-tax-trvaly-not-treaty-residence" } },
  { key: "sk-tax-residence-period-change", title: "Ansässigkeitswechsel und Perioden 2026", trigger: "Umzug SK→DE oder DE→SK im Steuerjahr", safeFirstStep: "effectiveFrom und effectiveTo verlangen; keine ewige einzige Ansässigkeit speichern.", riskLevel: "high", dimensions: { what: "sk-tax-period-reeval", whoWhen: "sk-tax-period-reeval", documents: "sk-tax-evidence-days", how: "sk-tax-period-reeval", next: "sk-tax-relief-handoff", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-residence-not-only-filing-state", dutiesAfter: "sk-tax-period-reeval", institution: "sk-tax-authority-fs", boundaries: "sk-tax-not-eu-law", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-residence-not-only-filing-state" } },
  { key: "sk-tax-foreign-income-relief-handoff", title: "Ausländische Einkünfte an Entlastung übergeben 2026", trigger: "Ausländische Einkünfte, Anrechnung oder Freistellung", safeFirstStep: "Ansässigkeit und Besteuerungsrecht vor § 45 prüfen; keinen Betrag erfinden.", riskLevel: "high", dimensions: { what: "sk-tax-relief-handoff", whoWhen: "sk-tax-45-1-credit-limit", documents: "sk-tax-foreign-tax-proof", how: "sk-tax-relief-handoff", next: "sk-tax-45-3-c-employment", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-taxing-right-not-amount", dutiesAfter: "sk-tax-exemption-not-no-filing", institution: "sk-tax-authority-fs", boundaries: "sk-tax-no-calculator", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-credit-not-refund" } },
  { key: "sk-tax-45-3-c-employment-comparison", title: "§ 45 Absatz 3 Buchstabe c Vorteilhaftigkeitsgrenze 2026", trigger: "Ausländischer Arbeitslohn, MLI-Anrechnung oder Freistellung vorteilhafter", safeFirstStep: "Nur abhängige Arbeit; ausländische Besteuerung nachweisen; ohne Beträge fail-closed vergleichen.", riskLevel: "high", dimensions: { what: "sk-tax-45-3-c-employment", whoWhen: "sk-tax-45-3-c-not-self-employed", documents: "sk-tax-foreign-tax-proof", how: "sk-tax-45-3-c-comparison-fail-closed", next: "sk-tax-45-1-credit-limit", deadlines: "sk-tax-statute-period-2026", problems: "sk-tax-45-3-c-comparison-fail-closed", dutiesAfter: "sk-tax-exemption-not-no-filing", institution: "sk-tax-authority-fs", boundaries: "sk-tax-no-calculator", freshness: "sk-tax-office-fetch-live", negatives: "sk-tax-45-3-c-not-self-employed" } },
]);

export function evaluateSkTaxProcessCompleteness() {
  const claimKeys = new Set(SK_TAX_UNITS.map((unit) => unit.key));
  const incomplete = SK_TAX_PROCESSES.filter((process) =>
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !claimKeys.has(process.dimensions[dimension])));
  return Object.freeze({
    processCount: SK_TAX_PROCESSES.length,
    processCompletenessPercent: incomplete.length === 0 ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.key),
  });
}

export function buildSkIncomeTaxResidencePack() {
  const trustDomain = item("trustDomain", "sk", { code: "sk" as const, name: "Slowakische Republik" });
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
    slovlex: item("publishers", "slov-lex-income-tax", {
      name: "Slov-Lex", type: "foreign_national_publication",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    mfsr: item("publishers", "mfsr-income-tax", {
      name: "Ministerstvo financií Slovenskej republiky", type: "foreign_national_ministry",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    fs: item("publishers", "fs-income-tax", {
      name: "Finančná správa Slovenskej republiky", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    slovlex: item("authorities", "slov-lex-income-tax-authority", {
      publisherId: publishers.slovlex.id, name: "Slov-Lex", type: "foreign_national_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.slov-lex.sk",
    }),
    mfsr: item("authorities", "mfsr-income-tax-authority", {
      publisherId: publishers.mfsr.id, name: "Ministerstvo financií SR", type: "foreign_national_ministry",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.mfsr.sk",
    }),
    fs: item("authorities", "fs-income-tax-authority", {
      publisherId: publishers.fs.id, name: "Finančná správa", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.financnasprava.sk",
    }),
  };
  const publisherOf = { slovlex: publishers.slovlex, mfsr: publishers.mfsr, fs: publishers.fs };
  const authorityOf = { slovlex: authorities.slovlex, mfsr: authorities.mfsr, fs: authorities.fs };
  const sources = SK_TAX_OFFICIAL_SOURCES.map((spec) => {
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
  const claims = SK_TAX_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`SK_TAX_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = SK_TAX_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: SK_TAX_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of SK_TAX_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`SK_TAX_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1 as const,
    packId: SK_TAX_PACK_ID,
    countryCode: "SK" as const,
    canonicalLanguage: SK_TAX_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.slovlex, publishers.mfsr, publishers.fs],
    authorities: [authorities.slovlex, authorities.mfsr, authorities.fs],
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
