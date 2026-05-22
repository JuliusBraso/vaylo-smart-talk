/**
 * Redacted Corpus registry (Phase 8.2F-10).
 *
 * Contains SYNTHETIC REDACTED EXEMPLARS ONLY.
 * - No real user documents.
 * - No real PII.
 * - No real OCR output.
 * - No file system access.
 * - No LLM calls.
 * - No Smart Talk wiring.
 *
 * All personal or identifying information is replaced with standardised
 * placeholder tokens defined in `RedactedPlaceholder`.
 *
 * Admission protocol for future real-world entries is defined in
 * `REDACTED_CORPUS_FOUNDATION.md`.
 */

import type { RedactedDocument } from "./redacted-corpus-types";

export const REDACTED_DOCUMENT_CORPUS_VERSION =
  "8.2f-10-redacted-corpus-v1";

// ── Synthetic exemplar 1 — Finanzamt Bescheid ─────────────────────────────────

const EXEMPLAR_FINANZAMT_BESCHEID: RedactedDocument = {
  documentId: "synthetic-finanzamt-bescheid-001",
  category: "finanzamt_bescheid",
  sourceKind: "synthetic_exemplar",
  redactionLevel: "synthetic_redacted_exemplar",
  simulatedOcrConfidence: 88,
  redactedText:
    "Finanzamt [AUTHORITY]\n" +
    "Steuernummer: [AKTENZEICHEN]\n" +
    "Datum: [DATE]\n\n" +
    "Einkommensteuerbescheid für das Veranlagungsjahr [DATE]\n\n" +
    "Sehr geehrte/r [NAME],\n\n" +
    "gemäß § 155 AO ergeht hiermit der Einkommensteuerbescheid für das Steuerjahr [DATE]. " +
    "Die festgesetzte Einkommensteuer beträgt [AMOUNT] Euro.\n\n" +
    "Zahlungsempfänger: Finanzamt [AUTHORITY]\n" +
    "IBAN: [IBAN]\n" +
    "Bitte überweisen Sie den fälligen Betrag bis zum [DATE].\n\n" +
    "Dieser Bescheid ergeht unter dem Vorbehalt der Nachprüfung gemäß § 164 AO. " +
    "Ein Einspruch ist innerhalb eines Monats nach Bekanntgabe schriftlich einzureichen.\n\n" +
    "Mit freundlichen Grüßen\n" +
    "Finanzamt [AUTHORITY], [CITY]",
  expectedComplexity: "high",
  expectedRiskDomains: ["tax_assessment", "payment_deadline", "appeal_window"],
  expectedOcrDegradation: { lowResolution: false, missingDates: false },
  notes: [
    "Synthetic exemplar only. No real Steuernummer, name, or IBAN.",
    "Represents a standard Einkommensteuerbescheid with payment and appeal information.",
    "High complexity: appeal window, payment deadline, provisional assessment clause.",
  ],
  neverContainsRealPii: true,
};

// ── Synthetic exemplar 2 — Rundfunkbeitrag Mahnung ────────────────────────────

const EXEMPLAR_RUNDFUNKBEITRAG: RedactedDocument = {
  documentId: "synthetic-rundfunkbeitrag-mahnung-001",
  category: "rundfunkbeitrag",
  sourceKind: "synthetic_exemplar",
  redactionLevel: "synthetic_redacted_exemplar",
  simulatedOcrConfidence: 92,
  redactedText:
    "Beitragsservice von ARD, ZDF und Deutschlandradio\n" +
    "Beitragsnummer: [CUSTOMER_ID]\n" +
    "Datum: [DATE]\n\n" +
    "Betreff: Zahlungserinnerung – Rundfunkbeitrag\n\n" +
    "Sehr geehrte/r [NAME],\n\n" +
    "wir weisen Sie darauf hin, dass für den Zeitraum ab [DATE] ein ausstehender " +
    "Rundfunkbeitrag in Höhe von [AMOUNT] Euro noch nicht beglichen wurde.\n\n" +
    "Bitte überweisen Sie den fälligen Betrag unter Angabe Ihrer Beitragsnummer " +
    "[CUSTOMER_ID] auf unser Konto:\n" +
    "IBAN: [IBAN]\n\n" +
    "Sollten Sie bereits eine Befreiung beantragt haben, senden Sie uns bitte " +
    "den entsprechenden Nachweis an [ADDRESS], [CITY].\n\n" +
    "Mit freundlichen Grüßen\n" +
    "Beitragsservice",
  expectedComplexity: "low",
  expectedRiskDomains: ["payment_required", "exemption_possible"],
  expectedOcrDegradation: { missingDates: false },
  notes: [
    "Synthetic exemplar only. No real Beitragsnummer, name, or IBAN.",
    "Represents a standard Rundfunkbeitrag payment reminder.",
    "Low complexity: fixed fee, exemption path available.",
  ],
  neverContainsRealPii: true,
};

// ── Synthetic exemplar 3 — Inkasso Mahnung ────────────────────────────────────

const EXEMPLAR_INKASSO_MAHNUNG: RedactedDocument = {
  documentId: "synthetic-inkasso-mahnung-001",
  category: "inkasso_mahnung",
  sourceKind: "synthetic_exemplar",
  redactionLevel: "synthetic_redacted_exemplar",
  simulatedOcrConfidence: 74,
  redactedText:
    "[AUTHORITY] Inkasso GmbH\n" +
    "[ADDRESS], [CITY]\n" +
    "Datum: [DATE]\n" +
    "Aktenzeichen: [AKTENZEICHEN]\n\n" +
    "Letzte Mahnung vor gerichtlicher Geltendmachung\n\n" +
    "Schuldner/in: [NAME], [ADDRESS]\n\n" +
    "Sehr geehrte/r [NAME],\n\n" +
    "trotz unserer bisherigen Mahnschreiben haben Sie die offene Forderung in Höhe von " +
    "[AMOUNT] Euro bis zum [DATE] nicht beglichen. Wir fordern Sie hiermit letztmalig " +
    "auf, den Betrag [AMOUNT] Euro bis spätestens [DATE] zu überweisen.\n\n" +
    "Bankverbindung:\n" +
    "IBAN: [IBAN]\n\n" +
    "Bei Nichtbeachtung behalten wir uns vor, gerichtliche Schritte einzuleiten, " +
    "was zu zusätzlichen Kosten führen kann. Wir empfehlen rechtliche Beratung.\n\n" +
    "[AUTHORITY] Inkasso GmbH, [CITY]",
  expectedComplexity: "high",
  expectedRiskDomains: [
    "enforcement_risk",
    "payment_deadline",
    "legal_escalation_possible",
  ],
  expectedOcrDegradation: { lowResolution: true },
  notes: [
    "Synthetic exemplar only. No real Aktenzeichen, name, address, or IBAN.",
    "Represents a final Mahnschreiben with escalation warning from an Inkasso company.",
    "High complexity: enforcement threat, tight deadline, legal escalation risk.",
    "Simulated OCR confidence 74 reflecting common scan quality issues with Inkasso letters.",
  ],
  neverContainsRealPii: true,
};

// ── Synthetic exemplar 4 — Krankenkasse Notice ───────────────────────────────

const EXEMPLAR_KRANKENKASSE: RedactedDocument = {
  documentId: "synthetic-krankenkasse-notice-001",
  category: "krankenkasse_notice",
  sourceKind: "synthetic_exemplar",
  redactionLevel: "synthetic_redacted_exemplar",
  simulatedOcrConfidence: 95,
  redactedText:
    "[AUTHORITY] Krankenkasse\n" +
    "[ADDRESS], [CITY]\n" +
    "Mitgliedsnummer: [CUSTOMER_ID]\n" +
    "Datum: [DATE]\n\n" +
    "Betreff: Anpassung Ihres Beitragssatzes ab [DATE]\n\n" +
    "Sehr geehrte/r [NAME],\n\n" +
    "aufgrund der gesetzlichen Beitragsanpassung zum [DATE] wird Ihr monatlicher " +
    "Krankenkassenbeitrag auf [AMOUNT] Euro festgesetzt.\n\n" +
    "Bitte stellen Sie sicher, dass Ihr Bankkonto ausreichend gedeckt ist, damit " +
    "die Lastschrift zum [DATE] problemlos eingezogen werden kann.\n\n" +
    "Ihren aktuellen Beitragsbescheid sowie weitere Informationen finden Sie in " +
    "Ihrem Mitgliederportal. Für Rückfragen steht Ihnen unsere Geschäftsstelle " +
    "unter [ADDRESS], [CITY] zur Verfügung.\n\n" +
    "Mit freundlichen Grüßen\n" +
    "[AUTHORITY] Krankenkasse",
  expectedComplexity: "medium",
  expectedRiskDomains: ["contribution_adjustment", "payment_required"],
  expectedOcrDegradation: { missingDates: false, unreadableAmounts: false },
  notes: [
    "Synthetic exemplar only. No real Mitgliedsnummer, name, or address.",
    "Represents a standard Krankenkasse contribution adjustment notice.",
    "Medium complexity: contribution change, direct debit, member portal reference.",
  ],
  neverContainsRealPii: true,
};

// ── Synthetic exemplar 5 — Ausländerbehörde Letter ───────────────────────────

const EXEMPLAR_AUSLAENDERBEHOERDE: RedactedDocument = {
  documentId: "synthetic-auslaenderbehoerde-letter-001",
  category: "auslaenderbehoerde_letter",
  sourceKind: "synthetic_exemplar",
  redactionLevel: "synthetic_redacted_exemplar",
  simulatedOcrConfidence: 68,
  redactedText:
    "Ausländerbehörde [CITY]\n" +
    "[ADDRESS]\n" +
    "Aktenzeichen: [AKTENZEICHEN]\n" +
    "Datum: [DATE]\n\n" +
    "Betrifft: Antrag auf Verlängerung der Aufenthaltserlaubnis\n\n" +
    "Sehr geehrte/r [NAME],\n\n" +
    "Ihr Antrag auf Verlängerung der Aufenthaltserlaubnis vom [DATE] wird derzeit " +
    "von der Ausländerbehörde [CITY] geprüft. Zur Vervollständigung Ihrer Unterlagen " +
    "werden Sie gebeten, bis zum [DATE] folgende Dokumente persönlich vorzulegen:\n\n" +
    "- Gültiger Reisepass\n" +
    "- Nachweis über aktuelle Wohnanschrift: [ADDRESS]\n" +
    "- Einkommensnachweise oder Beschäftigungsnachweis\n\n" +
    "Bitte erscheinen Sie persönlich bei der Ausländerbehörde [CITY], [ADDRESS].\n\n" +
    "Bei Nichtvorlage der Unterlagen bis [DATE] kann die Verlängerung nicht " +
    "bearbeitet werden.\n\n" +
    "Ausländerbehörde [CITY]",
  expectedComplexity: "high",
  expectedRiskDomains: [
    "residency_status",
    "document_deadline",
    "administrative_escalation",
  ],
  expectedOcrDegradation: { lowResolution: true, partialDocumentOnly: false },
  notes: [
    "Synthetic exemplar only. No real Aktenzeichen, name, or address.",
    "Represents a standard Ausländerbehörde request letter for residence permit extension.",
    "High complexity: strict deadline, multi-document requirement, status implications.",
    "Simulated OCR confidence 68 reflecting quality issues common with Behörde letterhead scans.",
  ],
  neverContainsRealPii: true,
};

// ── Corpus ────────────────────────────────────────────────────────────────────

/**
 * SYNTHETIC REDACTED EXEMPLARS ONLY — no real PII, no real user documents.
 *
 * This corpus is the Phase 8.2F-10 foundation. Future real-world redacted
 * entries may only be admitted after full manual review per the protocol
 * defined in `REDACTED_CORPUS_FOUNDATION.md`.
 */
export const REDACTED_DOCUMENT_CORPUS: readonly RedactedDocument[] = [
  EXEMPLAR_FINANZAMT_BESCHEID,
  EXEMPLAR_RUNDFUNKBEITRAG,
  EXEMPLAR_INKASSO_MAHNUNG,
  EXEMPLAR_KRANKENKASSE,
  EXEMPLAR_AUSLAENDERBEHOERDE,
] as const;
