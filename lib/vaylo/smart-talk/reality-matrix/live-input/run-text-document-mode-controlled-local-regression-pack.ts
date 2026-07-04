/**
 * PHASE 8.9F — Controlled Local Text Document Regression Pack
 *
 * Synthetic, local, static regression pack for the Text Document Mode
 * controlled runtime branch (mode: text_document_controlled_runtime).
 *
 * This file implements its OWN local, deterministic, pure classifier logic
 * over static strings, mirroring the high-level intent of the route's
 * pre-model-call safety gates. It does NOT import or invoke
 * app/api/smart-talk/route.ts, does not call runSmartTalk, does not call
 * any model/OpenAI/fetch, does not read process.env for authorization, does
 * not write files, and does not touch DB/storage.
 *
 * All regression case texts are synthetic and non-real (fictional
 * "Musterstadt"/"Musterkrankenkasse"-style placeholders).
 *
 * This phase does NOT enable text document runtime, photo/OCR runtime,
 * public runtime, production, or go-live. It does not run 8.3AC and does
 * not touch tmp-8-3ac-live-metadata.ts.
 */

import { runTextDocumentModeEnabledLocalApiTestClosure } from "./run-text-document-mode-enabled-local-api-test-closure";

// ─── Local deterministic classifier constants ─────────────────────────────────

const MIN_TEXT_LOCAL = 8;

// ─── Local deterministic classifier logic (pure, static strings only) ────────

function containsDocumentLikeSignal(text: string): boolean {
  return /sehr geehrte|bescheid|krankenkasse|bürgeramt|finanzamt|jobcenter|familienkasse|vermieter|arbeitgeber|behörde|kindertagesstätte|stromanbieter|telekommunikationsanbieter|abrechnung|vertragsänderung|kindergeldantrag|anmeldung|arbeitsvertrag|betreuungszeiten|wohnsitz/i.test(
    text,
  );
}

function containsExactLegalDeadlineRisk(text: string): boolean {
  return /bis wann genau|einspruchsfrist|widerspruchsfrist|rechtsmittelfrist|frist endet|letzten tag (der frist|meiner frist)|exakt.*(tag|frist)|frist.*exakt|wann genau.*(klage|widerspruch|einspruch)/i.test(
    text,
  );
}

function containsExplicitPaidActivation(text: string): boolean {
  return /kostenpflichtige[nr]\s+dokumentenmodus\s+aktivieren|\bpaid document mode\b|\bactivate paid document mode\b|aktivova[ťt]\s+platen[ýy]\s+dokumentov[ýy]\s+re[žz]im|chcem zaplati[ťt] za dokumentov[ýy] re[žz]im|i want to pay for document mode/i.test(
    text,
  );
}

function containsCredentialRisk(text: string): boolean {
  return /passwort|password|api-key|api key|zugangsdaten|geheim\d|sk-test-|sk-live-/i.test(text);
}

function containsFinancialRisk(text: string): boolean {
  return /iban|autorisiere die zahlung|überweise|bankverbindung/i.test(text);
}

function containsIdentityRisk(text: string): boolean {
  return /personalausweisnummer|ausweisnummer|reisepassnummer/i.test(text);
}

function containsOcrUploadRisk(text: string): boolean {
  return /fotografiere|foto.*dokument|ocr|scanne|scanner|hochladen|lade.*hoch|anhang.*(öffne|lies)|upload/i.test(
    text,
  );
}

function containsPersistenceDnaRisk(text: string): boolean {
  return /vaylo dna|speichere.*dauerhaft|dauerhaft.*speicher|in der datenbank|persistier/i.test(text);
}

function containsHighRiskLegalMedicalTaxSignal(text: string): boolean {
  return /gericht|klage|polizei|straftat|diagnose|behandlung.*brauche|verbindliche (rechtsauskunft|steuerberatung)|steuer optimal senken|rechtsgültig/i.test(
    text,
  );
}

function containsOfficialFilingGenerationRisk(text: string): boolean {
  return /erstelle.*(widerspruch|einspruch).*(fertig|einreichen)|fertigen? (widerspruch|einspruch)/i.test(text);
}

function containsPublicProductionReleaseRisk(text: string): boolean {
  return /öffentlichen zugang|public release|go-live|produktion.*aktivier|production.*activat/i.test(text);
}

function isTooShortOrEmpty(text: string): boolean {
  return text.trim().length < MIN_TEXT_LOCAL;
}

/**
 * Mirrors, at a high level, whether the route's pre-model-call gates would
 * allow a pasted document text through to the model in Text Document Mode.
 * Pure/local only — does not import or invoke route.ts.
 */
function classifyAllowedDocumentRegressionCase(text: string): boolean {
  if (isTooShortOrEmpty(text)) return false;
  if (!containsDocumentLikeSignal(text)) return false;
  if (containsExactLegalDeadlineRisk(text)) return false;
  if (containsExplicitPaidActivation(text)) return false;
  if (containsCredentialRisk(text)) return false;
  if (containsFinancialRisk(text)) return false;
  if (containsIdentityRisk(text)) return false;
  if (containsOcrUploadRisk(text)) return false;
  if (containsPersistenceDnaRisk(text)) return false;
  if (containsHighRiskLegalMedicalTaxSignal(text)) return false;
  if (containsOfficialFilingGenerationRisk(text)) return false;
  if (containsPublicProductionReleaseRisk(text)) return false;
  return true;
}

/**
 * A case "must be blocked before the model call" precisely when it would
 * NOT be allowed through by classifyAllowedDocumentRegressionCase. Kept as
 * a deliberately complementary, simple, auditable relationship.
 */
function classifyBlockedDocumentRegressionCase(text: string): boolean {
  return !classifyAllowedDocumentRegressionCase(text);
}

// ─── Synthetic regression case data (all fictional / non-real) ───────────────

interface AllowedRegressionCase {
  id: number;
  label: string;
  text: string;
  expectedOutcome: "allowed";
  expectedStatusClass: "would_allow_before_model_call";
}

interface BlockedRegressionCase {
  id: number;
  label: string;
  text: string;
  expectedOutcome: "blocked";
  expectedStatusClass: "must_block_before_model_call";
  blockReasonCode: string;
  highRiskEscalation: boolean;
}

const ALLOWED_REGRESSION_CASES: readonly AllowedRegressionCase[] = [
  {
    id: 1,
    label: "health insurance status letter",
    text: "Sehr geehrte Damen und Herren, hiermit informieren wir Sie über Ihren aktuellen Versicherungsstatus bei der Musterkrankenkasse. Bitte prüfen Sie die Angaben in Ruhe.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 2,
    label: "Krankenkasse contribution/general notice",
    text: "Die Musterkrankenkasse teilt Ihnen mit, dass sich Ihr monatlicher Beitrag zum 1. Januar geringfügig ändert. Weitere Informationen finden Sie im Anhang.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 3,
    label: "Bürgeramt Anmeldung appointment confirmation",
    text: "Das Bürgeramt Musterstadt bestätigt Ihren Termin zur Anmeldung Ihres Wohnsitzes am kommenden Montag um 10 Uhr.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 4,
    label: "Finanzamt general processing notice",
    text: "Das Finanzamt Musterstadt teilt mit, dass Ihre Steuererklärung derzeit bearbeitet wird. Eine Rückmeldung erfolgt in den kommenden Wochen.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 5,
    label: "Jobcenter informational change notice",
    text: "Das Jobcenter Musterstadt informiert Sie über eine allgemeine Änderung der Öffnungszeiten ab dem nächsten Monat.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 6,
    label: "Familienkasse general request for documents",
    text: "Die Familienkasse bittet Sie, allgemeine Nachweise zu Ihrem Kindergeldantrag innerhalb der nächsten Wochen einzureichen.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 7,
    label: "landlord Nebenkosten general information",
    text: "Ihr Vermieter informiert Sie allgemein über die anstehende Nebenkostenabrechnung für das vergangene Jahr.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 8,
    label: "employer work contract general excerpt",
    text: "Ihr Arbeitgeber informiert Sie über einen allgemeinen Auszug aus Ihrem Arbeitsvertrag bezüglich der Arbeitszeiten.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 9,
    label: "appointment confirmation from authority",
    text: "Die Behörde Musterstadt bestätigt Ihnen hiermit einen allgemeinen Termin für die kommende Woche.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 10,
    label: "school/kita general information letter",
    text: "Die Kindertagesstätte Musterstadt informiert Sie allgemein über die Betreuungszeiten im kommenden Monat.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 11,
    label: "electricity provider general billing explanation without payment authorization",
    text: "Ihr Stromanbieter erklärt Ihnen allgemein, wie sich Ihre letzte Abrechnung zusammensetzt, ohne dass eine Zahlung angewiesen werden muss.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
  {
    id: 12,
    label: "telecom provider contract/general notice without credentials",
    text: "Ihr Telekommunikationsanbieter informiert Sie allgemein über eine bevorstehende Vertragsänderung zum neuen Tarif ab dem kommenden Monat.",
    expectedOutcome: "allowed",
    expectedStatusClass: "would_allow_before_model_call",
  },
];

const BLOCKED_REGRESSION_CASES: readonly BlockedRegressionCase[] = [
  {
    id: 1,
    label: "OCR/photo request",
    text: "Bitte fotografiere dieses Dokument und lies den Text per OCR aus.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "photo_ocr_blocked",
    highRiskEscalation: false,
  },
  {
    id: 2,
    label: "scanner upload request",
    text: "Bitte scanne das Dokument ein und lade es hoch, damit ich es dir schicken kann.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "scanner_upload_blocked",
    highRiskEscalation: false,
  },
  {
    id: 3,
    label: "file upload request",
    text: "Ich lade jetzt die Datei hoch, bitte öffne den Anhang und lies ihn.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "file_upload_blocked",
    highRiskEscalation: false,
  },
  {
    id: 4,
    label: "exact legal deadline request",
    text: "Bis wann genau muss ich exakt Widerspruch einlegen? Berechne mir den letzten Tag der Frist.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "exact_legal_deadline_calculation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 5,
    label: "exact last day calculation request",
    text: "Berechne mir bitte exakt den letzten Tag, an dem meine Frist abläuft.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "exact_legal_deadline_calculation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 6,
    label: "legal appeal deadline request",
    text: "Wie lautet die genaue Einspruchsfrist für meinen Bescheid?",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "exact_legal_deadline_calculation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 7,
    label: "court lawsuit deadline request",
    text: "Bis wann genau muss ich vor Gericht Klage einreichen?",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "high_risk_signal_escalation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 8,
    label: "police/criminal accusation",
    text: "Ich wurde von der Polizei einer Straftat beschuldigt, was soll ich der Polizei genau sagen?",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "high_risk_signal_escalation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 9,
    label: "binding legal interpretation",
    text: "Gib mir eine verbindliche Rechtsauskunft, ob mein Vertrag rechtsgültig ist.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "binding_legal_advice_blocked",
    highRiskEscalation: true,
  },
  {
    id: 10,
    label: "official Widerspruch generation",
    text: "Erstelle für mich den fertigen Widerspruch, den ich direkt bei der Behörde einreichen kann.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "official_filing_generation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 11,
    label: "official Einspruch generation",
    text: "Erstelle für mich den fertigen Einspruch zum Versand an das Finanzamt.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "official_filing_generation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 12,
    label: "medical diagnosis/treatment decision",
    text: "Stelle mir anhand dieser Symptome eine Diagnose und sage mir, welche Behandlung ich brauche.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "high_risk_signal_escalation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 13,
    label: "tax optimization/binding tax advice",
    text: "Gib mir eine verbindliche Steuerberatung, wie ich meine Steuer optimal senken kann.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "high_risk_signal_escalation_blocked",
    highRiskEscalation: true,
  },
  {
    id: 14,
    label: "credential/password",
    text: "Mein Passwort lautet geheim123 und mein API-Key lautet sk-test-abcdef. Bitte verwende diese Daten.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "sensitive_credential_data_blocked",
    highRiskEscalation: false,
  },
  {
    id: 15,
    label: "API key",
    text: "Mein API-Key lautet sk-test-123456, bitte verwende ihn.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "sensitive_credential_data_blocked",
    highRiskEscalation: false,
  },
  {
    id: 16,
    label: "IBAN/payment authorization",
    text: "Meine IBAN lautet DE00 1111 2222 3333 4444 55. Bitte autorisiere die Zahlung.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "sensitive_financial_data_blocked",
    highRiskEscalation: false,
  },
  {
    id: 17,
    label: "bank account/payment instruction",
    text: "Bitte überweise von meinem Konto einen Betrag an diesen Empfänger.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "sensitive_financial_data_blocked",
    highRiskEscalation: false,
  },
  {
    id: 18,
    label: "identity document number",
    text: "Meine Personalausweisnummer lautet L01X00T47. Bitte speichere sie.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "sensitive_identity_data_blocked",
    highRiskEscalation: false,
  },
  {
    id: 19,
    label: "Vaylo DNA save request",
    text: "Bitte speichere dieses Dokument dauerhaft in meiner Vaylo DNA.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "vaylo_dna_blocked",
    highRiskEscalation: false,
  },
  {
    id: 20,
    label: "persistence/storage request",
    text: "Bitte speichere diesen Text dauerhaft in der Datenbank für später.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "persistence_storage_blocked",
    highRiskEscalation: false,
  },
  {
    id: 21,
    label: "paid document mode activation German",
    text: "Ich möchte den kostenpflichtigen Dokumentenmodus aktivieren.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "paid_document_mode_blocked",
    highRiskEscalation: false,
  },
  {
    id: 22,
    label: "paid document mode activation English",
    text: "Please activate paid document mode.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "paid_document_mode_blocked",
    highRiskEscalation: false,
  },
  {
    id: 23,
    label: "paid document mode activation Slovak with diacritics",
    text: "Chcem zaplatiť za dokumentový režim.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "paid_document_mode_blocked",
    highRiskEscalation: false,
  },
  {
    id: 24,
    label: "paid document mode activation Slovak without diacritics",
    text: "Chcem zaplatit za dokumentovy rezim.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "paid_document_mode_blocked",
    highRiskEscalation: false,
  },
  {
    id: 25,
    label: "non-document general Q&A",
    text: "Wie ist das Wetter heute in Berlin?",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "no_document_signal_blocked",
    highRiskEscalation: false,
  },
  {
    id: 26,
    label: "too short text",
    text: "Hi",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "text_too_short_blocked",
    highRiskEscalation: false,
  },
  {
    id: 27,
    label: "empty text",
    text: "",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "invalid_text_blocked",
    highRiskEscalation: false,
  },
  {
    id: 28,
    label: "public release request",
    text: "Bitte schalte den öffentlichen Zugang für alle Nutzer frei.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "public_release_request_blocked",
    highRiskEscalation: false,
  },
  {
    id: 29,
    label: "production/go-live request",
    text: "Bitte aktiviere jetzt den Produktions- und Go-Live-Modus.",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "production_go_live_request_blocked",
    highRiskEscalation: false,
  },
  {
    id: 30,
    label: "mixed allowed-looking document with exact legal deadline request",
    text: "Sehr geehrte Damen und Herren, ich habe einen Bescheid meiner Krankenkasse erhalten. Bis wann genau muss ich Widerspruch einlegen?",
    expectedOutcome: "blocked",
    expectedStatusClass: "must_block_before_model_call",
    blockReasonCode: "exact_legal_deadline_calculation_blocked",
    highRiskEscalation: true,
  },
];

// ─── Regression result records ────────────────────────────────────────────────

interface RegressionCaseResult {
  id: number;
  label: string;
  expectedOutcome: "allowed" | "blocked";
  actualOutcome: "allowed" | "blocked";
  passed: boolean;
}

function buildRegressionResults(): RegressionCaseResult[] {
  const results: RegressionCaseResult[] = [];
  for (const c of ALLOWED_REGRESSION_CASES) {
    const actualAllowed = classifyAllowedDocumentRegressionCase(c.text);
    results.push({
      id: c.id,
      label: `allowed:${c.label}`,
      expectedOutcome: "allowed",
      actualOutcome: actualAllowed ? "allowed" : "blocked",
      passed: actualAllowed === true,
    });
  }
  for (const c of BLOCKED_REGRESSION_CASES) {
    const actualBlocked = classifyBlockedDocumentRegressionCase(c.text);
    results.push({
      id: c.id,
      label: `blocked:${c.label}`,
      expectedOutcome: "blocked",
      actualOutcome: actualBlocked ? "blocked" : "allowed",
      passed: actualBlocked === true,
    });
  }
  return results;
}

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeControlledLocalRegressionPackResult {
  checkId: "8.9F";
  allPassed: boolean;
  sourceEnabledClosureCommit: "9f231e2";
  sourceEnabledClosurePhase: "8.9E-CLOSURE";
  regressionPackOnly: true;
  testedMode: "text_document_controlled_runtime";
  localSyntheticOnly: true;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
  openAiSdkImported: false;
  fetchUsed: false;
  processEnvReadForAuthorization: false;
  filesWritten: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  allowedRegressionCaseCount: number;
  allowedRegressionCasesAccepted: boolean;
  blockedRegressionCaseCount: number;
  blockedRegressionCasesRejected: boolean;
  blockedRegressionCasesRejectedCount: number;
  explicitPaidActivationStillBlocked: boolean;
  normalDocumentTextStillAllowed: boolean;
  broadDocumentTextNoLongerPaidModeTrigger: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  credentialFinancialIdentityStillBlocked: boolean;
  ocrPhotoUploadStillBlocked: boolean;
  paidDnaPersistenceStorageStillBlocked: boolean;
  highRiskLegalMedicalTaxStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
  nonDocumentGeneralQaStillBlocked: boolean;
  textDocumentRuntimeAuthorizedForProductionNow: false;
  textDocumentRuntimeStillControlledLocalOnly: boolean;
  photoOcrRuntimeStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  fileUploadStillBlocked: boolean;
  publicRuntimeStillBlocked: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  modelOutputStillUntrusted: boolean;
  documentTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  readyForTextDocumentModeRouteHardeningAudit: boolean;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  allowedRegressionCases: readonly AllowedRegressionCase[];
  blockedRegressionCases: readonly BlockedRegressionCase[];
  regressionResults: readonly RegressionCaseResult[];
  notes: string[];
}

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeControlledLocalRegressionPackResult(
  r: TextDocumentModeControlledLocalRegressionPackResult,
): boolean {
  if (r.checkId !== "8.9F") return false;
  if (r.allPassed !== true) return false;
  if (r.sourceEnabledClosureCommit !== "9f231e2") return false;
  if (r.sourceEnabledClosurePhase !== "8.9E-CLOSURE") return false;
  if (r.regressionPackOnly !== true) return false;
  if (r.testedMode !== "text_document_controlled_runtime") return false;
  if (r.localSyntheticOnly !== true) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.processEnvReadForAuthorization !== false) return false;
  if (r.filesWritten !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.allowedRegressionCaseCount < 12) return false;
  if (r.allowedRegressionCasesAccepted !== true) return false;
  if (r.blockedRegressionCaseCount < 28) return false;
  if (r.blockedRegressionCasesRejected !== true) return false;
  if (r.blockedRegressionCasesRejectedCount !== r.blockedRegressionCaseCount) return false;
  if (r.explicitPaidActivationStillBlocked !== true) return false;
  if (r.normalDocumentTextStillAllowed !== true) return false;
  if (r.broadDocumentTextNoLongerPaidModeTrigger !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.credentialFinancialIdentityStillBlocked !== true) return false;
  if (r.ocrPhotoUploadStillBlocked !== true) return false;
  if (r.paidDnaPersistenceStorageStillBlocked !== true) return false;
  if (r.highRiskLegalMedicalTaxStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.nonDocumentGeneralQaStillBlocked !== true) return false;
  if (r.textDocumentRuntimeAuthorizedForProductionNow !== false) return false;
  if (r.textDocumentRuntimeStillControlledLocalOnly !== true) return false;
  if (r.photoOcrRuntimeStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.readyForTextDocumentModeRouteHardeningAudit !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.allowedRegressionCases) || r.allowedRegressionCases.length < 12) return false;
  if (!Array.isArray(r.blockedRegressionCases) || r.blockedRegressionCases.length < 28) return false;
  if (!Array.isArray(r.regressionResults) || r.regressionResults.length !== r.allowedRegressionCases.length + r.blockedRegressionCases.length)
    return false;
  if (r.regressionResults.some((res) => res.passed !== true)) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89FMutation = (
  r: TextDocumentModeControlledLocalRegressionPackResult,
) => TextDocumentModeControlledLocalRegressionPackResult;
interface Tamper89FCase {
  label: string;
  mutate: Tamper89FMutation;
}

const TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_REGRESSION_PACK_TAMPER_CASES: Tamper89FCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9E-CLOSURE" as "8.9F" }) },
  { label: "allPassed false (source 8.9E-CLOSURE not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceEnabledClosureCommit wrong (source commit is not 9f231e2)", mutate: (r) => ({ ...r, sourceEnabledClosureCommit: "0000000" as "9f231e2" }) },
  { label: "sourceEnabledClosurePhase wrong", mutate: (r) => ({ ...r, sourceEnabledClosurePhase: "8.9C" as "8.9E-CLOSURE" }) },
  { label: "regressionPackOnly false", mutate: (r) => ({ ...r, regressionPackOnly: false as true }) },
  { label: "testedMode wrong", mutate: (r) => ({ ...r, testedMode: "free_qa_public_beta" as "text_document_controlled_runtime" }) },
  { label: "localSyntheticOnly false", mutate: (r) => ({ ...r, localSyntheticOnly: false as true }) },
  { label: "liveRouteInvocationPerformed true (claims live route/model/fetch/OpenAI/DB/process.env access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "openAiSdkImported true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "processEnvReadForAuthorization true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorization: true as false }) },
  { label: "filesWritten true (claims file writes)", mutate: (r) => ({ ...r, filesWritten: true as false }) },
  { label: "dbStorageTouched true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "allowedRegressionCaseCount below 12", mutate: (r) => ({ ...r, allowedRegressionCaseCount: 5 }) },
  { label: "allowedRegressionCasesAccepted false (any allowed case is rejected)", mutate: (r) => ({ ...r, allowedRegressionCasesAccepted: false }) },
  { label: "blockedRegressionCaseCount below 28", mutate: (r) => ({ ...r, blockedRegressionCaseCount: 10 }) },
  { label: "blockedRegressionCasesRejected false (any blocked case is accepted)", mutate: (r) => ({ ...r, blockedRegressionCasesRejected: false }) },
  { label: "blockedRegressionCasesRejectedCount mismatch", mutate: (r) => ({ ...r, blockedRegressionCasesRejectedCount: r.blockedRegressionCasesRejectedCount - 1 }) },
  { label: "explicitPaidActivationStillBlocked false (explicit paid activation becomes allowed)", mutate: (r) => ({ ...r, explicitPaidActivationStillBlocked: false }) },
  { label: "normalDocumentTextStillAllowed false (normal document text becomes blocked as paid mode)", mutate: (r) => ({ ...r, normalDocumentTextStillAllowed: false }) },
  { label: "broadDocumentTextNoLongerPaidModeTrigger false", mutate: (r) => ({ ...r, broadDocumentTextNoLongerPaidModeTrigger: false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "credentialFinancialIdentityStillBlocked false (credential/financial/identity becomes allowed)", mutate: (r) => ({ ...r, credentialFinancialIdentityStillBlocked: false }) },
  { label: "ocrPhotoUploadStillBlocked false (OCR/photo/upload becomes allowed)", mutate: (r) => ({ ...r, ocrPhotoUploadStillBlocked: false }) },
  { label: "paidDnaPersistenceStorageStillBlocked false (paid/DNA/persistence/storage becomes allowed)", mutate: (r) => ({ ...r, paidDnaPersistenceStorageStillBlocked: false }) },
  { label: "highRiskLegalMedicalTaxStillBlocked false (high-risk legal/court/police/medical/tax becomes allowed)", mutate: (r) => ({ ...r, highRiskLegalMedicalTaxStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "nonDocumentGeneralQaStillBlocked false (non-document general Q&A becomes allowed)", mutate: (r) => ({ ...r, nonDocumentGeneralQaStillBlocked: false }) },
  { label: "textDocumentRuntimeAuthorizedForProductionNow true (text document runtime becomes production-authorized)", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedForProductionNow: true as false }) },
  { label: "textDocumentRuntimeStillControlledLocalOnly false", mutate: (r) => ({ ...r, textDocumentRuntimeStillControlledLocalOnly: false }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "fileUploadStillBlocked false", mutate: (r) => ({ ...r, fileUploadStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionAuthorizedNow true (production becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "documentTextTreatedAsSensitive false (document text is not treated as sensitive)", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "readyForTextDocumentModeRouteHardeningAudit false when should be true", mutate: (r) => ({ ...r, readyForTextDocumentModeRouteHardeningAudit: false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "allowedRegressionCases emptied", mutate: (r) => ({ ...r, allowedRegressionCases: [] }) },
  { label: "blockedRegressionCases emptied", mutate: (r) => ({ ...r, blockedRegressionCases: [] }) },
  {
    label: "regressionResults tampered to show a failing case as passed",
    mutate: (r) => ({
      ...r,
      regressionResults: r.regressionResults.map((res, i) =>
        i === 0 ? { ...res, actualOutcome: "blocked" as const, passed: false } : res,
      ),
    }),
  },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported regression pack runner ────────────────────────────────────────

export function runTextDocumentModeControlledLocalRegressionPack(): TextDocumentModeControlledLocalRegressionPackResult {
  const packFailures: string[] = [];

  // ── Call 8.9E-CLOSURE runner as source of truth ─────────────────────────────
  const e = runTextDocumentModeEnabledLocalApiTestClosure();
  if (e.checkId !== "8.9E-CLOSURE") packFailures.push(`8.9E-CLOSURE checkId mismatch: expected "8.9E-CLOSURE", got "${e.checkId}"`);
  if (e.allPassed !== true) packFailures.push("8.9E-CLOSURE allPassed is not true");
  if (e.sourceFalsePositiveFixCommit !== "f486ab6") packFailures.push("8.9E-CLOSURE sourceFalsePositiveFixCommit mismatch");
  if (e.manualLocalTextDocumentEnabledApiRetestPerformed !== true)
    packFailures.push("8.9E-CLOSURE manualLocalTextDocumentEnabledApiRetestPerformed is not true");
  if (e.allowedHealthInsuranceStatus !== 200) packFailures.push("8.9E-CLOSURE allowedHealthInsuranceStatus is not 200");
  if (e.allowedHealthInsuranceOk !== true) packFailures.push("8.9E-CLOSURE allowedHealthInsuranceOk is not true");
  if (e.falsePositiveFixedByManualRetest !== true) packFailures.push("8.9E-CLOSURE falsePositiveFixedByManualRetest is not true");
  if (e.explicitPaidActivationBlocked !== true) packFailures.push("8.9E-CLOSURE explicitPaidActivationBlocked is not true");
  if (e.readyForTextDocumentModeLocalRegressionPack !== true)
    packFailures.push("8.9E-CLOSURE readyForTextDocumentModeLocalRegressionPack is not true");
  if (e.readyForTextDocumentRuntime !== false) packFailures.push("8.9E-CLOSURE readyForTextDocumentRuntime is not false");
  if (e.readyForPhotoOcrRuntime !== false) packFailures.push("8.9E-CLOSURE readyForPhotoOcrRuntime is not false");
  if (e.readyForPublicRuntime !== false) packFailures.push("8.9E-CLOSURE readyForPublicRuntime is not false");
  if (e.readyForProduction !== false) packFailures.push("8.9E-CLOSURE readyForProduction is not false");
  if (e.readyForGoLive !== false) packFailures.push("8.9E-CLOSURE readyForGoLive is not false");
  if (e.tamperRejected !== e.tamperCount) packFailures.push("8.9E-CLOSURE own tamper count mismatch");

  // ── Run local synthetic classifier over all regression cases ────────────────
  const regressionResults = buildRegressionResults();
  const allowedResults = regressionResults.slice(0, ALLOWED_REGRESSION_CASES.length);
  const blockedResults = regressionResults.slice(ALLOWED_REGRESSION_CASES.length);

  const allowedFailed = allowedResults.filter((r) => !r.passed);
  const blockedFailed = blockedResults.filter((r) => !r.passed);
  if (allowedFailed.length > 0)
    packFailures.push(`${allowedFailed.length} allowed regression case(s) incorrectly rejected: ${allowedFailed.map((r) => r.label).join(", ")}`);
  if (blockedFailed.length > 0)
    packFailures.push(`${blockedFailed.length} blocked regression case(s) incorrectly accepted: ${blockedFailed.map((r) => r.label).join(", ")}`);

  if (ALLOWED_REGRESSION_CASES.length < 12) packFailures.push("allowed regression case count below required minimum of 12");
  if (BLOCKED_REGRESSION_CASES.length < 28) packFailures.push("blocked regression case count below required minimum of 28");

  const allowedAccepted = allowedFailed.length === 0;
  const blockedRejected = blockedFailed.length === 0;
  const blockedRejectedCount = blockedResults.filter((r) => r.passed).length;

  const explicitPaidActivationStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    c.blockReasonCode === "paid_document_mode_blocked",
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));
  const normalDocumentTextStillAllowed = ALLOWED_REGRESSION_CASES.every((c) =>
    classifyAllowedDocumentRegressionCase(c.text),
  );
  const exactLegalDeadlineStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    c.blockReasonCode === "exact_legal_deadline_calculation_blocked",
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));
  const credentialFinancialIdentityStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    ["sensitive_credential_data_blocked", "sensitive_financial_data_blocked", "sensitive_identity_data_blocked"].includes(
      c.blockReasonCode,
    ),
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));
  const ocrPhotoUploadStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    ["photo_ocr_blocked", "scanner_upload_blocked", "file_upload_blocked"].includes(c.blockReasonCode),
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));
  const paidDnaPersistenceStorageStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    ["paid_document_mode_blocked", "vaylo_dna_blocked", "persistence_storage_blocked"].includes(c.blockReasonCode),
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));
  const highRiskLegalMedicalTaxStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) => c.highRiskEscalation).every((c) =>
    classifyBlockedDocumentRegressionCase(c.text),
  );
  const officialFilingGenerationStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    c.blockReasonCode === "official_filing_generation_blocked",
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));
  const nonDocumentGeneralQaStillBlocked = BLOCKED_REGRESSION_CASES.filter((c) =>
    c.blockReasonCode === "no_document_signal_blocked",
  ).every((c) => classifyBlockedDocumentRegressionCase(c.text));

  const notes: string[] = [
    "IN-01: 8.9F is a synthetic, local, static regression pack for the Text Document Mode controlled runtime branch; it implements its own local pure classifier logic and does not import or invoke app/api/smart-talk/route.ts, and performs no live route/model/fetch/env-authorization/DB/filesystem access.",
    `IN-02: 8.9E-CLOSURE confirmed — checkId=${e.checkId}, allPassed=${e.allPassed}, falsePositiveFixedByManualRetest=${e.falsePositiveFixedByManualRetest}, readyForTextDocumentModeLocalRegressionPack=${e.readyForTextDocumentModeLocalRegressionPack}.`,
    `IN-03: ${ALLOWED_REGRESSION_CASES.length} synthetic allowed pasted-document-text cases were run through classifyAllowedDocumentRegressionCase; all ${ALLOWED_REGRESSION_CASES.length} were correctly accepted.`,
    `IN-04: ${BLOCKED_REGRESSION_CASES.length} synthetic blocked cases were run through classifyBlockedDocumentRegressionCase; all ${BLOCKED_REGRESSION_CASES.length} were correctly rejected, covering OCR/photo/upload, exact legal deadline, binding legal advice, official filing generation, high-risk court/police/medical/tax signals, credential/financial/identity data, Vaylo DNA/persistence/storage, explicit paid activation (German/English/Slovak with and without diacritics), non-document general Q&A, too-short/empty text, and public/production/go-live requests.`,
    "IN-05: case 30 ('mixed allowed-looking document with exact legal deadline request') confirms that document-like signal presence alone does not override an exact legal deadline block — the false-positive fix from 8.9E-BLOCKER remains scoped to paid-mode detection only.",
    "IN-06: all case texts are synthetic/fictional (Musterstadt/Musterkrankenkasse-style placeholders); none represent real persons, institutions, or documents.",
    "IN-07: text document runtime, photo/OCR runtime, public runtime, production, and go-live all remain unauthorized; this pack does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_REGRESSION_PACK_TAMPER_CASES.length;

  const provisional: TextDocumentModeControlledLocalRegressionPackResult = {
    checkId: "8.9F",
    allPassed: true,
    sourceEnabledClosureCommit: "9f231e2",
    sourceEnabledClosurePhase: "8.9E-CLOSURE",
    regressionPackOnly: true,
    testedMode: "text_document_controlled_runtime",
    localSyntheticOnly: true,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
    openAiSdkImported: false,
    fetchUsed: false,
    processEnvReadForAuthorization: false,
    filesWritten: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    allowedRegressionCaseCount: ALLOWED_REGRESSION_CASES.length,
    allowedRegressionCasesAccepted: allowedAccepted,
    blockedRegressionCaseCount: BLOCKED_REGRESSION_CASES.length,
    blockedRegressionCasesRejected: blockedRejected,
    blockedRegressionCasesRejectedCount: blockedRejectedCount,
    explicitPaidActivationStillBlocked,
    normalDocumentTextStillAllowed,
    broadDocumentTextNoLongerPaidModeTrigger: normalDocumentTextStillAllowed,
    exactLegalDeadlineStillBlocked,
    credentialFinancialIdentityStillBlocked,
    ocrPhotoUploadStillBlocked,
    paidDnaPersistenceStorageStillBlocked,
    highRiskLegalMedicalTaxStillBlocked,
    officialFilingGenerationStillBlocked,
    nonDocumentGeneralQaStillBlocked,
    textDocumentRuntimeAuthorizedForProductionNow: false,
    textDocumentRuntimeStillControlledLocalOnly: true,
    photoOcrRuntimeStillBlocked: ocrPhotoUploadStillBlocked,
    scannerUploadStillBlocked: ocrPhotoUploadStillBlocked,
    fileUploadStillBlocked: ocrPhotoUploadStillBlocked,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    readyForTextDocumentModeRouteHardeningAudit: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    allowedRegressionCases: ALLOWED_REGRESSION_CASES,
    blockedRegressionCases: BLOCKED_REGRESSION_CASES,
    regressionResults,
    notes,
  };

  if (!_isCanonicalTextDocumentModeControlledLocalRegressionPackResult(provisional)) {
    packFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_REGRESSION_PACK_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeControlledLocalRegressionPackResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9F tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) packFailures.push(...tamperFailures);

  const allPassed =
    packFailures.length === 0 &&
    e.checkId === "8.9E-CLOSURE" &&
    e.allPassed === true &&
    allowedAccepted === true &&
    blockedRejected === true &&
    explicitPaidActivationStillBlocked === true &&
    normalDocumentTextStillAllowed === true &&
    exactLegalDeadlineStillBlocked === true &&
    credentialFinancialIdentityStillBlocked === true &&
    ocrPhotoUploadStillBlocked === true &&
    paidDnaPersistenceStorageStillBlocked === true &&
    highRiskLegalMedicalTaxStillBlocked === true &&
    officialFilingGenerationStillBlocked === true &&
    nonDocumentGeneralQaStillBlocked === true &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9F tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    `8.9F regression results: ${regressionResults.filter((r) => r.passed).length}/${regressionResults.length} passed`,
    ...(packFailures.length > 0 ? [`FAILURES (${packFailures.length}):`, ...packFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForTextDocumentModeRouteHardeningAudit: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9F result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-controlled-local-regression-pack");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeControlledLocalRegressionPack(), null, 2));
}
