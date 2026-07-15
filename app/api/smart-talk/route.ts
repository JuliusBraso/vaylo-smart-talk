import { NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import { runSmartTalk } from "@/lib/vaylo/smart-talk/run-smart-talk";
import type {
  SmartTalkInputType,
  SmartTalkLocale,
} from "@/lib/vaylo/smart-talk/build-smart-talk-prompt";
import { runRuntimeGuardedDelivery } from "@/lib/vaylo/smart-talk/reality-matrix/run-runtime-guarded-delivery";
import { runRuntimeInternalAuthGuard } from "@/lib/vaylo/smart-talk/reality-matrix/runtime-internal-auth-guard";
import { runGuardedLiveTextRuntimePipeline } from "@/lib/vaylo/smart-talk/reality-matrix/live-input/run-guarded-live-text-runtime-pipeline";
import {
  PILOT_RUNTIME_REQUIRED_GUARD_PHRASE,
  PILOT_RUNTIME_REQUIRED_GUARDS,
} from "@/lib/vaylo/smart-talk/reality-matrix/live-input/pilot-runtime-guard-contract-types";
import { runFreeQaScopedRuntimePatchAuthorizationDecision } from "@/lib/vaylo/smart-talk/reality-matrix/live-input/run-free-qa-scoped-runtime-patch-authorization-decision";
import { extractTextFromImageBuffer } from "@/lib/vaylo/smart-talk/ocr/real-ocr-adapter";
import { evaluateOcrControlledReasoningGate } from "@/lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate";
import {
  buildOcrReasoningModelCallParams,
  buildOcrReasoningModelInputMeta,
} from "@/lib/vaylo/smart-talk/ocr/ocr-reasoning-input";
import {
  getRuntimeSmartTalkRateLimiter,
  resolveSmartTalkRateLimitClientIp,
} from "@/lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter";
import {
  runFirstContactRuntimeGate,
  type FirstContactMarket,
} from "@/lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate";
import {
  buildFirstContactPresentation,
  validateFirstContactPresentation,
} from "@/lib/vaylo/smart-talk/first-contact/build-first-contact-presentation";

function isSmartTalkInputType(v: unknown): v is SmartTalkInputType {
  return v === "text" || v === "question";
}

export const runtime = "nodejs";

const MAX_TEXT = 12_000;
const MIN_TEXT = 8;
const ALLOWED_LOCALES = new Set<SmartTalkLocale>(["sk", "de", "en"]);

const SMART_TALK_ROUTE_TIMEOUT_MS = 20_000;
const FREE_QA_INTERNAL_RUNTIME_MODE = "free_qa_internal_scoped_patch";
const FREE_QA_INTERNAL_RUNTIME_GUARD =
  "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY";
const FREE_QA_PUBLIC_BETA_MODE = "free_qa_public_beta";
const FREE_QA_PUBLIC_RUNTIME_ENV_FLAG = "SMART_TALK_FREE_QA_PUBLIC_ENABLED";
const TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE = "text_document_controlled_runtime";
const TEXT_DOCUMENT_MODE_ENV_FLAG = "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED";
const PHOTO_OCR_CONTROLLED_RUNTIME_MODE = "photo_ocr_controlled_runtime";
const PHOTO_OCR_ENV_FLAG = "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED";
const PHOTO_OCR_ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PHOTO_OCR_MAX_PAGES = 3;
const PHOTO_OCR_MAX_RAW_BYTES_PER_PAGE = 8 * 1024 * 1024;
const PHOTO_OCR_MAX_PROCESSED_BYTES_TOTAL = 4 * 1024 * 1024;
const FIRST_CONTACT_CONTROLLED_RUNTIME_MODE = "first_contact_controlled_runtime";
const FIRST_CONTACT_MODE_ENV_FLAG = "SMART_TALK_FIRST_CONTACT_MODE_ENABLED";

// Phase 8.11C — Real OCR Extraction Controlled Runtime (separate from the
// 8.10C placeholder above). Disabled by default; this dedicated env flag is
// the ONLY thing that can enable it. The placeholder flag above
// (PHOTO_OCR_ENV_FLAG) must never authorize this branch.
const REAL_OCR_CONTROLLED_RUNTIME_MODE = "photo_ocr_real_extraction_controlled_runtime";
const REAL_OCR_ENV_FLAG = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const REAL_OCR_ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const REAL_OCR_MAX_FILE_SIZE_BYTES = 8_388_608; // 8 MiB
const REAL_OCR_MAX_PAGE_COUNT = 1;
const REAL_OCR_MIN_TEXT_LENGTH = 8;
const REAL_OCR_MAX_TEXT_LENGTH = 6000;
const REAL_OCR_TIMEOUT_MS = 15_000;
const REAL_OCR_PREVIEW_LENGTH = 240;
const REAL_OCR_LOW_CONFIDENCE_THRESHOLD = 60; // tesseract.js confidence is 0-100

// Phase 8.11I — Minimal OCR-to-Smart-Talk Handoff Runtime Patch. Disabled by
// default; requires BOTH this exact env flag AND REAL_OCR_ENV_FLAG (above) to
// be exactly lowercase "true". Builds a handoff envelope proving the gate
// path (trust/quality metadata preserved) but does NOT call the live model
// and does NOT invoke Smart Talk reasoning — that remains a separate, later,
// explicitly authorized phase. Reuses the same MIME/size/page constraints and
// the same OCR adapter as the 8.11C real OCR branch above; never sends raw
// image bytes or the original file to a model (no model call happens here at
// all in this phase).
const OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE =
  "photo_ocr_real_extraction_to_smart_talk_controlled_handoff";
const OCR_TO_SMART_TALK_HANDOFF_ENV_FLAG = "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
const OCR_TO_SMART_TALK_HANDOFF_REQUIRED_PAGE_COUNT = "1";

// Phase 8.11M — Minimal OCR-to-Smart-Talk Controlled Reasoning Runtime Patch.
// Disabled by default; requires ALL THREE of this exact env flag,
// OCR_TO_SMART_TALK_HANDOFF_ENV_FLAG, and REAL_OCR_ENV_FLAG (all above) to be
// exactly lowercase "true". A minimal explicit multipart `operation` field
// (see OCR_CONTROLLED_REASONING_OPERATION_VALUE) only SELECTS this internal
// intent inside the existing 8.11I handoff branch — it can never AUTHORIZE
// reasoning by itself; authorization is exclusively the three exact
// server-side env flags. When this operation is requested but the reasoning
// env flag is disabled, the request fails closed before any OCR extraction
// (see handleOcrToSmartTalkHandoffRequest below). When this operation is not
// requested at all, the existing 8.11I/8.11K envelope-only behavior is
// completely unmodified regardless of this flag's value.
const OCR_CONTROLLED_REASONING_ENV_FLAG = "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED";
const OCR_CONTROLLED_REASONING_OPERATION_VALUE = "controlled_reasoning";
const OCR_CONTROLLED_REASONING_DISABLED_CODE = "ocr_controlled_reasoning_disabled";
const OCR_CONTROLLED_REASONING_SUCCESS_REASON = "controlled_ocr_reasoning_completed";
const OCR_CONTROLLED_REASONING_TIMEOUT_CODE = "ocr_reasoning_timeout";
const OCR_CONTROLLED_REASONING_MODEL_ERROR_CODE = "ocr_reasoning_model_error";
const OCR_CONTROLLED_REASONING_TRAP_REJECTED_CODE = "ocr_reasoning_trap_rejected";
const OCR_CONTROLLED_REASONING_INTERNAL_ERROR_CODE = "ocr_reasoning_internal_error";
const OCR_CONTROLLED_REASONING_EVIDENCE_GATE_REJECTED_CODE = "evidence_gate_rejected_ocr_reasoning";

/**
 * Public route-level failure codes for the controlled reasoning branch (see
 * FAILURE CODES in the 8.11M task contract). The pure gate module
 * (evaluateOcrControlledReasoningGate) uses its own, more granular internal
 * blockingCode vocabulary for direct unit-testability; this table translates
 * that internal vocabulary to the smaller public code set below so the
 * route's external contract stays stable even if the gate's internal
 * reasons are refined later.
 */
const OCR_CONTROLLED_REASONING_GATE_CODE_TO_PUBLIC_CODE: Readonly<Record<string, string>> = {
  reasoning_env_disabled: OCR_CONTROLLED_REASONING_DISABLED_CODE,
  handoff_env_disabled: "handoff_required_for_reasoning",
  real_ocr_env_disabled: "real_ocr_required_for_reasoning",
  invalid_source_kind: "ocr_trust_metadata_missing",
  invalid_trust_level: "ocr_trust_metadata_missing",
  handoff_not_allowed: "invalid_ocr_reasoning_payload",
  handoff_already_performed: "invalid_ocr_reasoning_payload",
  invalid_ocr_reasoning_payload: "invalid_ocr_reasoning_payload",
  missing_quality_metadata: "ocr_quality_not_usable_for_reasoning",
  quality_blocked: "ocr_quality_not_usable_for_reasoning",
  quality_low: "ocr_quality_not_usable_for_reasoning",
  unusable_for_smart_talk: "ocr_quality_not_usable_for_reasoning",
  blocking_reasons_present: "ocr_blocking_reasons_present",
  empty_extracted_text: "invalid_ocr_reasoning_payload",
  extracted_text_too_long: "invalid_ocr_reasoning_payload",
  missing_ocr_warnings: "invalid_ocr_reasoning_payload",
  missing_high_risk_metadata: "invalid_ocr_reasoning_payload",
  raw_image_in_model_payload_attempt: "invalid_ocr_reasoning_payload",
  original_file_in_model_payload_attempt: "invalid_ocr_reasoning_payload",
  persistence_attempt: "invalid_ocr_reasoning_payload",
  dna_write_attempt: "invalid_ocr_reasoning_payload",
  public_runtime_attempt: "invalid_ocr_reasoning_payload",
};

const OCR_CONTROLLED_REASONING_PUBLIC_CODE_STATUS: Readonly<Record<string, number>> = {
  [OCR_CONTROLLED_REASONING_DISABLED_CODE]: 403,
  handoff_required_for_reasoning: 403,
  real_ocr_required_for_reasoning: 403,
  invalid_ocr_reasoning_payload: 400,
  ocr_quality_not_usable_for_reasoning: 422,
  ocr_blocking_reasons_present: 422,
  ocr_trust_metadata_missing: 422,
  [OCR_CONTROLLED_REASONING_EVIDENCE_GATE_REJECTED_CODE]: 422,
};

const OCR_CONTROLLED_REASONING_BASE_WARNINGS = [
  "OCR text may be wrong.",
  "Check the original document.",
  "This is not legal advice.",
] as const;

function hasLetter(s: string): boolean {
  return /[\p{L}\p{M}]/u.test(s);
}

function isOnlyUrls(s: string): boolean {
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return true;
  const urlLike = /^https?:\/\/.+/i;
  return parts.every((p) => urlLike.test(p));
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function detectOfficialLetterStyleQuestionText(text: string): boolean {
  return /sehr geehrte|mit freundlichen gr|aktenzeichen|rechtsbehelfsbelehrung|bescheid|mahnbescheid|rechnung|zahlungserinnerung|fristsetzung/i.test(
    text,
  );
}

function detectExactLegalDeadlineRequest(text: string): boolean {
  return /\b(bis wann|widerspruchsfrist|einspruchsfrist|rechtsmittelfrist|frist endet|genaue frist|exact deadline|deadline exactly|dokedy presne|do kedy presne|presná lehota|presnu lehotu|presnú lehotu|lehota na odvolanie|lehota na odpor|lehota na námietku|lehota na namietku|dokedy musím podať odvolanie|dokedy musim podat odvolanie|dokedy musím podať odpor|dokedy musim podat odpor|dokedy musím podať námietku|dokedy musim podat namietku|do kedy musím podať odvolanie|do kedy musim podat odvolanie)\b/i.test(
    text,
  );
}

// ── Phase 8.9C — Text Document Mode helpers ─────────────────────────────────
// Deterministic, local, pure detectors. No I/O · no fetch · no OpenAI · no env
// reads · no SDK. Used only by the text_document_controlled_runtime branch.

function detectOcrPhotoRequest(body: Record<string, unknown>): boolean {
  return body.requestedOcr === true || body.requestedPhoto === true;
}

function detectScannerUploadRequest(body: Record<string, unknown>): boolean {
  return body.requestedScannerUpload === true;
}

function detectFileUploadRequest(body: Record<string, unknown>): boolean {
  return body.requestedFileUpload === true;
}

function detectVayloDnaSaveRequest(body: Record<string, unknown>): boolean {
  return body.requestedDnaSave === true;
}

function detectPersistenceStorageRequest(body: Record<string, unknown>): boolean {
  return body.requestedPersistence === true || body.requestedEntitlement === true;
}

function detectCredentialSecretText(text: string): boolean {
  return /\b(passwort|password|kennwort|api[- ]?key|apikey|secret[- ]?key|token)\b\s*[:=]?\s*\S+|sk-[a-zA-Z0-9]{8,}/i.test(
    text,
  );
}

function detectFinancialAccountOrPaymentAuthorizationText(text: string): boolean {
  return /\biban\b|\bkontonummer\b|\bbankverbindung\b|\bbank account\b|autorisiere\s+die\s+zahlung|payment authorization|autorisiere\s+diese\s+zahlung/i.test(
    text,
  );
}

function detectIdentityDocumentNumberText(text: string): boolean {
  return /\b(ausweisnummer|personalausweisnummer|reisepassnummer|passport number|id number|identity document number)\b/i.test(
    text,
  );
}

function detectBindingLegalAdviceRequest(text: string): boolean {
  return /rechtsverbindlich|bindende rechtliche auslegung|binding legal advice|binding legal interpretation|rechtsverbindliche auskunft|verbindliche rechtsauskunft/i.test(
    text,
  );
}

function detectOfficialFilingGenerationRequest(text: string): boolean {
  return /schreibe\s+(für mich\s+)?(einen\s+|meinen\s+)?(offiziellen\s+|rechtsverbindlichen\s+)?(widerspruch|einspruch|beschwerde)|write\s+(my\s+|an?\s+)?(official\s+)?(legal\s+)?(objection|appeal|complaint)|verfasse\s+(meinen\s+|einen\s+)?(einspruch|widerspruch)/i.test(
    text,
  );
}

function detectHighRiskCourtPoliceMedicalTaxSignal(text: string): boolean {
  return /polizei|anklage|straftat|gerichtsladung|gerichtsverfahren|strafverfahren|\bcourt\b|\bpolice\b|criminal charge|lawsuit|diagnose|behandlungsentscheidung|medical diagnosis|treatment decision|steueroptimierung|steuerhinterziehung|tax optimization|binding tax advice/i.test(
    text,
  );
}

function isDocumentLikeSignalPresent(text: string): boolean {
  return detectTextDocumentBypassRequired(text) || detectOfficialLetterStyleQuestionText(text);
}

// ── Phase 8.9E-BLOCKER — narrow explicit paid-activation detector ──────────
// Fixes a false positive where detectClientPaidDocumentModeActivation(o)
// flagged every Text Document Mode request as paid mode, because it inspects
// generic body control fields (including "mode") for the substring
// "document" — and this branch's own mode value ("text_document_controlled_
// runtime") always contains that substring. This detector instead inspects
// only the pasted TEXT for explicit, unambiguous paid-activation/payment
// intent phrases. It intentionally does NOT match ordinary document-like
// words (document, Dokument, Schreiben, Krankenkasse, Versicherungsstatus,
// Bescheid, Sehr geehrte, Bitte prüfen, etc.).
function detectExplicitPaidDocumentModeActivationForTextDocumentMode(text: string): boolean {
  return /kostenpflichtige[nr]\s+dokumentenmodus\s+aktivieren|\bpaid document mode\b|\bactivate paid document mode\b|aktivova[ťt]\s+platen[ýy]\s+dokumentov[ýy]\s+re[žz]im|chcem zaplati[ťt] za dokumentov[ýy] re[žz]im|ich m[öo]chte bezahlen|i want to pay for document mode/i.test(
    text,
  );
}
// ── End Phase 8.9E-BLOCKER helper ────────────────────────────────────────────
// ── End Phase 8.9C helpers ───────────────────────────────────────────────────

// ── Phase 8.5N — Text Document Bypass Guard helper ────────────────────────
// Deterministic multi-signal scoring. Pure, local.
// No I/O · no fetch · no OpenAI · no env reads · no SDK.
function detectTextDocumentBypassRequired(text: string): boolean {
  let score = 0;
  // Signal 1 — length threshold
  if (text.length > 300) score += 1;
  // Signal 2 — salutation / closing markers
  if (/sehr geehrte|mit freundlichen gr/i.test(text)) score += 2;
  // Signal 3 — German authority markers
  if (/jobcenter|finanzamt|ausländerbehörde|krankenkasse|familienkasse|bundesagentur/i.test(text)) score += 1;
  // Signal 4 — Bescheid / Widerspruch / Rechtsmittel markers
  if (/bescheid|widerspruch|rechtsbehelfsbelehrung/i.test(text)) score += 2;
  // Signal 5 — invoice / Mahnung markers
  if (/mahnung|rechnung|zahlungsfrist/i.test(text)) score += 1;
  // Signal 6 — deadline / legal consequence markers
  if (/\bfrist\b|innerhalb von|bis zum|vollstreckung/i.test(text)) score += 1;
  // Signal 7 — personal data / reference markers
  if (/kundennummer|versicherungsnummer|steueridentifikationsnummer|beitragsnummer|aktenzeichen/i.test(text)) score += 2;
  // Signal 8 — reference number pattern
  if (/\b\d{4,}[\/-]\d+\b/.test(text)) score += 1;
  // Signal 9 — official document field markers
  if (/\bdatum\s*:/i.test(text) || /\bunterschrift\b/i.test(text) || /\btelefon\s*:/i.test(text)) score += 1;
  // Signal 10 — field-value line structure (key: value ≥ 3 lines)
  const fieldLines = (text.match(/^[A-ZÄÖÜa-zäöü][^\n:]{1,30}:\s*\S/gm) ?? []).length;
  if (fieldLines >= 3) score += 2;
  return score >= 3;
}
// ── End Phase 8.5N helper ─────────────────────────────────────────────────

// ── Phase 8.5U — Client-side Paid Document Mode activation detector ────────
// Inspects ONLY request body control fields (NOT user text content).
// Deny-by-default: no entitlement runtime · no payment · no document processing.
// No I/O · no fetch · no OpenAI · no env reads · no SDK.
const PAID_DOC_MODE_FIELDS = [
  "documentMode", "document_mode", "paidDocumentMode", "paid_document_mode",
  "mode", "lane", "feature", "product",
];
const ENTITLEMENT_FIELDS = [
  "entitlement", "entitlementId", "entitlement_id",
  "paid", "isPaid", "is_paid", "hasEntitlement", "has_entitlement",
];
const PAID_DOC_ACTIVATING_STRINGS = new Set([
  "true", "1", "yes", "paid", "document", "document_mode",
  "paid_document", "paid_document_mode", "documentMode", "paidDocumentMode",
]);

function detectClientPaidDocumentModeActivation(body: Record<string, unknown>): boolean {
  for (const field of PAID_DOC_MODE_FIELDS) {
    const v = body[field];
    if (v === true) return true;
    if (typeof v === "string") {
      const lower = v.toLowerCase();
      if (PAID_DOC_ACTIVATING_STRINGS.has(lower)) return true;
      if (lower.includes("document") || lower.includes("paid") || lower.includes("entitlement")) return true;
    }
  }
  for (const field of ENTITLEMENT_FIELDS) {
    const v = body[field];
    if (v === true) return true;
    if (typeof v === "string") {
      const lower = v.toLowerCase();
      if (PAID_DOC_ACTIVATING_STRINGS.has(lower)) return true;
      if (lower.includes("document") || lower.includes("paid") || lower.includes("entitlement")) return true;
    }
    if (v !== null && typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length > 0) return true;
    if (Array.isArray(v) && v.length > 0) return true;
  }
  return false;
}
// ── End Phase 8.5U detector ────────────────────────────────────────────────

// ── Phase 8.2K-2 — Pilot branch helpers ──────────────────────────────────────
// Pure, local, no side effects, no sensitive value logging.

function parsePilotCsvEnvList(value: string | undefined): readonly string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getPilotStringField(
  rec: Record<string, unknown>,
  key: string,
): string | null {
  const v = rec[key];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function buildPilotNoPersistenceResult() {
  return {
    persistenceAllowed: false,
    persistenceUsed: false,
    dnaSaveAllowed: false,
    dnaSavePerformed: false,
    offlineSaveAllowed: false,
    offlineSavePerformed: false,
    evidencePersistenceAllowed: false,
    evidencePersistencePerformed: false,
    neverUserVisible: true,
  } as const;
}

/**
 * Builds a fail-closed pilot guard failure response.
 * Never includes raw request content, the internal secret, or model output.
 */
function buildPilotFailureResponse(
  verdict: string,
  addDiagnostic: string,
  failedGuard: string | null,
  httpStatus: 403 | 400,
  internalReason: string,
  priorDiagnostics: readonly string[],
): ReturnType<typeof NextResponse.json> {
  return NextResponse.json(
    {
      ok: false,
      runtime: "controlled_text_pilot_guarded",
      result: {
        authorised: false,
        verdict,
        diagnostics: [...priorDiagnostics, addDiagnostic],
        failedGuard,
        httpStatus,
        publicMessage: "Internal pilot runtime request rejected.",
        internalReason,
        liveLLMCalled: false,
        apiRouteModified: true,
        uiTouched: false,
        persistenceUsed: false,
        dnaSavePerformed: false,
        offlineSavePerformed: false,
        emittedToUserNow: false,
        neverUserVisible: true,
      },
    },
    { status: httpStatus },
  );
}
// ── End Phase 8.2K-2 pilot branch helpers ────────────────────────────────────

// ── Phase 8.9C — Text Document Mode response helpers ────────────────────────
// Pure, local. Returns only safe, non-sensitive flags. No secrets/env leaked.

function buildTextDocumentModeSafetyFlags(textDocumentModeEnabled: boolean) {
  return {
    textDocumentModeEnabled,
    controlledTextDocumentRuntime: textDocumentModeEnabled,
    pastedTextOnly: true,
    photoOcrStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    eightThreeAcNotRun: true,
  } as const;
}

function textDocumentModeBlockedResponse(
  code: string,
  status: number,
): ReturnType<typeof NextResponse.json> {
  return NextResponse.json(
    {
      ok: false,
      code,
      textDocumentMeta: buildTextDocumentModeSafetyFlags(false),
    },
    { status },
  );
}
// ── End Phase 8.9C response helpers ──────────────────────────────────────────

// ── Phase 8.12C — First Contact Controlled Runtime helpers ─────────────────
function buildFirstContactModeSafetyFlags(firstContactModeEnabled: boolean) {
  return {
    firstContactModeEnabled,
    controlledFirstContactRuntime: firstContactModeEnabled,
    documentInterpretationStillBlocked: true,
    photoOcrStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    onlyGermanyMarketSupported: true,
    modelOutputStillUntrusted: true,
  };
}

const FIRST_CONTACT_GATE_CODE_STATUS: Readonly<Record<string, number>> = {
  first_contact_mode_disabled: 403,
  first_contact_not_explicitly_selected: 400,
  first_contact_input_too_short: 400,
  first_contact_input_too_long: 400,
  first_contact_locale_unsupported: 400,
  first_contact_market_unsupported: 400,
  first_contact_scenario_unsupported: 400,
  first_contact_document_mode_required: 402,
  first_contact_photo_ocr_mode_required: 402,
  first_contact_paid_document_boundary: 402,
  first_contact_persistence_forbidden: 402,
};
// ── End Phase 8.12C First Contact Controlled Runtime helpers ───────────────

// ── Phase 8.10C — Photo/OCR Controlled Runtime Placeholder helpers ─────────
// Deterministic, local, pure detectors and response builders. No I/O · no
// fetch · no OpenAI · no OCR library · no env reads except the single exact
// enablement check performed inline in the route branch below. These
// detectors inspect ONLY page metadata (mimeType, sizeBytes) and generic
// request control fields — they never read, decode, or persist image bytes.

function isPhotoOcrPageArray(v: unknown): v is Record<string, unknown>[] {
  return Array.isArray(v) && v.every((p) => p !== null && typeof p === "object");
}

function detectPhotoOcrRemoteUrlMarker(pages: Record<string, unknown>[]): boolean {
  return pages.some((p) => {
    const remoteUrl = p.remoteUrl;
    const url = p.url;
    return (
      (typeof remoteUrl === "string" && remoteUrl.trim() !== "") ||
      (typeof url === "string" && url.trim() !== "")
    );
  });
}

function detectPhotoOcrFilePathMarker(pages: Record<string, unknown>[]): boolean {
  return pages.some((p) => {
    const path = p.path;
    const filePath = p.filePath;
    return (
      (typeof path === "string" && path.trim() !== "") ||
      (typeof filePath === "string" && filePath.trim() !== "")
    );
  });
}

function detectPhotoOcrPdfMarker(pages: Record<string, unknown>[]): boolean {
  return pages.some((p) => p.mimeType === "application/pdf");
}

function detectPhotoOcrUnsupportedMimeType(pages: Record<string, unknown>[]): boolean {
  return pages.some(
    (p) => typeof p.mimeType !== "string" || !PHOTO_OCR_ALLOWED_MIME_TYPES.has(p.mimeType),
  );
}

function detectPhotoOcrOversizedPage(pages: Record<string, unknown>[]): boolean {
  return pages.some(
    (p) => typeof p.sizeBytes === "number" && p.sizeBytes > PHOTO_OCR_MAX_RAW_BYTES_PER_PAGE,
  );
}

function detectPhotoOcrBackgroundUploadMarker(body: Record<string, unknown>): boolean {
  return (
    body.backgroundUpload === true ||
    body.requestedBackgroundUpload === true ||
    body.autoUpload === true
  );
}

function detectPhotoOcrPersistenceMarker(body: Record<string, unknown>): boolean {
  return (
    body.requestedPersistence === true ||
    body.requestedEntitlement === true ||
    body.persistImage === true ||
    body.saveImage === true
  );
}

function detectPhotoOcrStorageMarker(body: Record<string, unknown>): boolean {
  return (
    body.requestedStorage === true ||
    body.requestedSupabaseStorage === true ||
    body.uploadToStorage === true
  );
}

function detectPhotoOcrDnaWriteMarker(body: Record<string, unknown>): boolean {
  return body.requestedDnaSave === true || body.vayloDnaSave === true;
}

function detectPhotoOcrPaidModeMarker(body: Record<string, unknown>): boolean {
  return (
    body.requestedPaidMode === true ||
    body.requestedPayment === true ||
    body.paidDocumentMode === true
  );
}

function detectPhotoOcrPublicRuntimeMarker(body: Record<string, unknown>): boolean {
  return (
    body.requestedPublicRuntime === true ||
    body.publicRuntime === true ||
    body.publicLaunch === true
  );
}

function detectPhotoOcrProductionMarker(body: Record<string, unknown>): boolean {
  return body.requestedProduction === true || body.production === true;
}

function detectPhotoOcrGoLiveMarker(body: Record<string, unknown>): boolean {
  return body.requestedGoLive === true || body.goLive === true;
}

function detectPhotoOcrEightThreeAcMarker(body: Record<string, unknown>): boolean {
  return (
    body.invokeEightThreeAc === true ||
    body.run8_3ac === true ||
    body.eightThreeAcInvocation === true
  );
}

/**
 * Safe, non-sensitive Photo/OCR meta flags. Never includes image bytes,
 * extracted text, or secrets. `photoOcrControlledRuntime` is the only field
 * that varies between the disabled and allowed-placeholder paths — every
 * other flag always states the same fail-closed, no-OCR, no-persistence
 * posture, whether the branch is disabled or the controlled placeholder path
 * is returned.
 */
function buildPhotoOcrMeta(photoOcrControlledRuntime: boolean) {
  return {
    photoOcrControlledRuntime,
    photoInputOnly: true,
    placeholderOnly: true,
    realOcrExtractionPerformed: false,
    ocrRuntimeStillBlocked: true,
    modelCallPerformed: false,
    uploadRuntimeStillBlocked: true,
    rawImagePersistenceBlocked: true,
    processedImagePersistenceBlocked: true,
    extractedTextPersistenceBlocked: true,
    dbStorageStillBlocked: true,
    supabaseStorageStillBlocked: true,
    vayloDnaStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    modelOutputStillUntrusted: true,
    ocrOutputStillUntrusted: true,
    imageContentTreatedAsSensitive: true,
    extractedTextTreatedAsSensitive: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    eightThreeAcNotRun: true,
  } as const;
}

function photoOcrBlockedResponse(
  code: string,
  status: number,
): ReturnType<typeof NextResponse.json> {
  return NextResponse.json(
    {
      ok: false,
      code,
      photoOcrMeta: buildPhotoOcrMeta(false),
    },
    { status },
  );
}
// ── End Phase 8.10C Photo/OCR Controlled Runtime Placeholder helpers ───────

// ── Phase 8.11C — Real OCR Extraction Controlled Runtime helpers ───────────
// Disabled by default unless SMART_TALK_REAL_OCR_EXTRACTION_ENABLED === "true"
// (exact lowercase match only; every other value fails closed). The existing
// placeholder flag (SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED) never
// authorizes this branch. This branch performs real, local, server-side OCR
// extraction on a single small image via an internal adapter module. There
// is no model call during OCR extraction, no persistence of the raw/
// processed image or the extracted text, no database/cloud-storage/Vaylo
// DNA write, and no handoff of the extracted text into Smart Talk document
// reasoning — handoff.allowed is always false in this phase. This branch is
// fully isolated from the default question/text flow, the
// text_document_controlled_runtime flow, the 8.10C photo_ocr_controlled_
// runtime placeholder flow, and the existing default photo upload flow
// (/api/smart-talk-photo).

function buildRealOcrSafetyMeta(modelCallPerformed: boolean) {
  return {
    noPersistence: true,
    noStorage: true,
    noDnaWrite: true,
    rawImagePersistencePerformed: false,
    processedImagePersistencePerformed: false,
    extractedTextPersistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    modelCallPerformed,
    rawImageSentToModel: false,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
  } as const;
}

function realOcrBlockedResponse(
  code: string,
  status: number,
): ReturnType<typeof NextResponse.json> {
  return NextResponse.json(
    {
      ok: false,
      code,
      safety: buildRealOcrSafetyMeta(false),
    },
    { status },
  );
}

/**
 * Simple heuristic: a high ratio of characters outside common letters,
 * digits, whitespace, and basic punctuation suggests a noisy/garbled OCR
 * result (e.g. scanning artifacts, non-document images). Used only as a
 * downgrade signal, never as a hard block.
 */
function isNoisyExtractedOcrText(text: string): boolean {
  if (text.length === 0) return false;
  const weirdMatches = text.match(/[^\p{L}\p{N}\s.,;:!?'"()\-/]/gu);
  const weirdCount = weirdMatches ? weirdMatches.length : 0;
  return weirdCount / text.length > 0.3;
}

interface RealOcrQualityEvaluation {
  status: "blocked" | "low" | "medium" | "usable";
  usableForSmartTalk: boolean;
  blockingReasons: string[];
  downgradeReasons: string[];
}

/**
 * Minimal quality evaluator v0 (Phase 8.11C, contained in this route). Runs
 * only on already-extracted OCR text; never re-reads image bytes.
 */
function evaluateRealOcrQuality(
  extractedTextRaw: string,
  confidenceAvailable: boolean,
  confidence: number | null,
): RealOcrQualityEvaluation {
  const blockingReasons: string[] = [];
  const downgradeReasons: string[] = [];

  if (extractedTextRaw.length === 0) {
    blockingReasons.push("empty_extraction");
  } else if (extractedTextRaw.length < REAL_OCR_MIN_TEXT_LENGTH) {
    blockingReasons.push("extracted_text_too_short");
  }
  if (extractedTextRaw.length > REAL_OCR_MAX_TEXT_LENGTH) {
    blockingReasons.push("extracted_text_too_long");
  }

  if (!confidenceAvailable) {
    downgradeReasons.push("confidence_unavailable");
  } else if (typeof confidence === "number" && confidence < REAL_OCR_LOW_CONFIDENCE_THRESHOLD) {
    downgradeReasons.push("low_confidence");
  }
  if (extractedTextRaw.length > 0 && extractedTextRaw.length < 24) {
    downgradeReasons.push("very_short_text");
  }
  if (isNoisyExtractedOcrText(extractedTextRaw)) {
    downgradeReasons.push("suspiciously_noisy_text");
  }

  let status: RealOcrQualityEvaluation["status"];
  if (blockingReasons.length > 0) {
    status = "blocked";
  } else if (downgradeReasons.length >= 2) {
    status = "low";
  } else if (downgradeReasons.length === 1) {
    status = "medium";
  } else {
    status = "usable";
  }

  return {
    status,
    usableForSmartTalk: blockingReasons.length === 0,
    blockingReasons,
    downgradeReasons,
  };
}

/**
 * Handles the real OCR extraction controlled runtime branch. Only reachable
 * from the shared multipart dispatcher below (see
 * handleMultipartSmartTalkRequest), which peeks the `mode` field from a
 * cloned request before routing to this function; this function then parses
 * the (still-unconsumed) original request body itself, exactly as before
 * Phase 8.11I introduced the dispatcher. No other existing mode/branch is
 * affected — this function is additive and self-contained, and its own
 * behavior, response shapes, and env-gate-first ordering are unchanged.
 */
async function handleRealOcrExtractionRequest(
  req: Request,
): Promise<ReturnType<typeof NextResponse.json>> {
  const realOcrEnabled = process.env[REAL_OCR_ENV_FLAG] === "true";
  if (!realOcrEnabled) {
    return realOcrBlockedResponse("real_ocr_extraction_disabled", 403);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return realOcrBlockedResponse("real_ocr_invalid_content_type", 400);
  }

  const mode = form.get("mode");
  if (mode !== REAL_OCR_CONTROLLED_RUNTIME_MODE) {
    return realOcrBlockedResponse("real_ocr_invalid_content_type", 400);
  }

  const pageCountRaw = form.get("pageCount");
  if (pageCountRaw !== null) {
    const pageCount = Number(pageCountRaw);
    if (!Number.isFinite(pageCount) || pageCount !== REAL_OCR_MAX_PAGE_COUNT) {
      return realOcrBlockedResponse("real_ocr_multiple_pages_blocked", 400);
    }
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return realOcrBlockedResponse("real_ocr_missing_image", 400);
  }
  if (file.size > REAL_OCR_MAX_FILE_SIZE_BYTES) {
    return realOcrBlockedResponse("real_ocr_file_too_large", 413);
  }
  if (!REAL_OCR_ALLOWED_MIME_TYPES.has(file.type)) {
    return realOcrBlockedResponse("real_ocr_unsupported_mime", 400);
  }

  let imageBuffer: Buffer;
  try {
    imageBuffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return realOcrBlockedResponse("real_ocr_provider_error", 502);
  }

  const ocrResult = await extractTextFromImageBuffer({
    imageBuffer,
    mimeType: file.type as "image/png" | "image/jpeg" | "image/webp",
    timeoutMs: REAL_OCR_TIMEOUT_MS,
  });

  if (!ocrResult.ok) {
    if (ocrResult.errorCode === "ocr_timeout") {
      return realOcrBlockedResponse("real_ocr_timeout", 504);
    }
    if (ocrResult.errorCode === "empty_extraction") {
      return realOcrBlockedResponse("real_ocr_empty_extraction", 422);
    }
    return realOcrBlockedResponse("real_ocr_provider_error", 502);
  }

  const extractedText = ocrResult.extractedText;
  const quality = evaluateRealOcrQuality(
    extractedText,
    ocrResult.confidenceAvailable,
    ocrResult.confidence,
  );

  if (quality.status === "blocked") {
    return NextResponse.json(
      {
        ok: false,
        code: "real_ocr_quality_blocked",
        quality,
        safety: buildRealOcrSafetyMeta(false),
      },
      { status: 422 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: REAL_OCR_CONTROLLED_RUNTIME_MODE,
    context: "anonymous",
    ocrResult: {
      extractedText,
      extractedTextPreview: extractedText.slice(0, REAL_OCR_PREVIEW_LENGTH),
      extractedTextLength: extractedText.length,
      confidenceAvailable: ocrResult.confidenceAvailable,
      confidence: ocrResult.confidence,
      provider: "tesseract_js",
      providerWarnings: ocrResult.providerWarnings,
    },
    quality,
    safety: buildRealOcrSafetyMeta(false),
    handoff: {
      allowed: false,
      reason: "ocr_to_smart_talk_handoff_not_enabled_in_8_11c",
      sourceMarkedOcrDerived: true,
      textMarkedUntrusted: true,
    },
    disclaimers: {
      privacyDisclaimerRequired: true,
      legalDisclaimerRequired: true,
      ocrMayBeWrongWarningRequired: true,
      checkOriginalDocumentRequired: true,
    },
  });
}
// ── End Phase 8.11C Real OCR Extraction Controlled Runtime helpers ─────────

// ── Phase 8.11I — Minimal OCR-to-Smart-Talk Handoff Runtime Patch helpers ──
// Disabled by default unless BOTH OCR_TO_SMART_TALK_HANDOFF_ENV_FLAG and
// REAL_OCR_ENV_FLAG are exactly lowercase "true" (every other value fails
// closed). Builds a handoff envelope proving the gate path — extracted OCR
// text plus its trust/quality metadata, warnings, and high-risk token flags
// — but this phase does NOT call the live model and does NOT invoke Smart
// Talk reasoning (smartTalkResult is always null; handoff.performed is
// always false). There is no persistence of any kind, no database/cloud-
// storage/Vaylo DNA write, and no raw image bytes or original document file
// are ever sent anywhere beyond this route's own local OCR extraction step.

/**
 * Minimal, self-contained high-risk token detector for the handoff branch.
 * Deliberately separate from the existing question-text detectors above
 * (which target user QUESTIONS, e.g. "when is my exact deadline?"), since
 * this instead scans OCR-DERIVED DOCUMENT TEXT for sensitive/high-risk
 * categories. Pure, local, synchronous. No I/O, no network, no model call.
 * Detecting a category never blocks the envelope by itself — it is only
 * preserved as metadata; the caller still enforces the quality gate above.
 */
const OCR_HANDOFF_HIGH_RISK_TOKEN_DETECTORS: Readonly<Record<string, RegExp>> = {
  deadlines: /\b(frist|fristablauf|deadline|f[äa]llig|lehota|do kedy|termín)\b/i,
  dates: /\b\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}\b/,
  amounts: /[€$]\s?\d+[.,]?\d*\b|\b\d+[.,]\d{2}\s?(eur|€|chf|usd)\b/i,
  ibanOrPaymentReferences: /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/,
  caseNumbers: /\b(aktenzeichen|az\.?\s?\d|case\s?no\.?|reference\s?no\.?)\b/i,
  authorityNames:
    /\b(finanzamt|jobcenter|ausl[äa]nderbeh[öo]rde|krankenkasse|bundesagentur|gericht|court|police|polizei)\b/i,
  personalNameSalutations: /\b(herr|frau|mr\.|mrs\.|ms\.)\s+[A-ZÄÖÜ][a-zäöüß]+\b/,
  addressLikePattern: /\b\d{4,5}\s+[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ\-]+\b/,
  credentialsOrApiKeysOrPasswordLikeText:
    /\b(passwort|password|api[- ]?key|apikey|secret[- ]?key|token)\b\s*[:=]?\s*\S+|sk-[a-zA-Z0-9]{8,}/i,
  healthOrInsuranceNumbers: /\b(versicherungsnummer|krankenversicherungsnummer|social security number)\b/i,
  immigrationOrResidencePermitReferences:
    /\b(aufenthaltstitel|aufenthaltserlaubnis|residence permit|visa number|reisepassnummer)\b/i,
  taxIds: /\b(steuer-?id|steueridentifikationsnummer|tax id|vat number|ust-?idnr)\b/i,
};

function detectOcrHighRiskTokens(text: string): string[] {
  const detected: string[] = [];
  for (const category of Object.keys(OCR_HANDOFF_HIGH_RISK_TOKEN_DETECTORS)) {
    if (OCR_HANDOFF_HIGH_RISK_TOKEN_DETECTORS[category].test(text)) {
      detected.push(category);
    }
  }
  return detected;
}

/** Human-readable, non-sensitive warnings. Never includes the extracted text itself. */
function buildOcrToSmartTalkHandoffOcrWarnings(
  quality: RealOcrQualityEvaluation,
  highRiskTokensDetected: readonly string[],
): string[] {
  const warnings: string[] = [
    "OCR text may contain misreads; verify against the original document.",
  ];
  if (quality.downgradeReasons.length > 0) {
    warnings.push(`OCR quality signals detected: ${quality.downgradeReasons.join(", ")}.`);
  }
  if (highRiskTokensDetected.length > 0) {
    warnings.push(
      `Potentially sensitive or high-risk content detected in OCR text (${highRiskTokensDetected.join(", ")}); do not rely on this without checking the original document.`,
    );
  }
  return warnings;
}

const OCR_TO_SMART_TALK_HANDOFF_BASE_WARNINGS = [
  "OCR text may be wrong.",
  "Check the original document.",
  "This is not legal advice.",
  "Handoff reasoning is not enabled in 8.11I.",
] as const;

function buildOcrToSmartTalkHandoffDisclaimers() {
  return {
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    ocrMayBeWrongWarningRequired: true,
    checkOriginalDocumentRequired: true,
  } as const;
}

/**
 * Safety flags for the 8.11I handoff branch. `envelopeCreated` is the only
 * field that varies between the success path (envelope built) and every
 * blocked/failure path (no envelope) — every other flag always states the
 * same fail-closed, no-model-call, no-persistence posture.
 */
function buildOcrToSmartTalkHandoffSafetyMeta(envelopeCreated: boolean) {
  return {
    rawImageSentToModel: false,
    originalDocumentFileSentToModel: false,
    extractedTextSentToModel: false,
    modelCallPerformed: false,
    smartTalkReasoningPerformed: false,
    ocrToSmartTalkHandoffEnvelopeCreated: envelopeCreated,
    ocrToSmartTalkHandoffPerformed: false,
    noPersistence: true,
    noStorage: true,
    noDnaWrite: true,
    rawImagePersistencePerformed: false,
    processedImagePersistencePerformed: false,
    extractedTextPersistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
  } as const;
}

function ocrToSmartTalkHandoffBlockedResponse(
  code: string,
  status: number,
): ReturnType<typeof NextResponse.json> {
  return NextResponse.json(
    {
      ok: false,
      code,
      safety: buildOcrToSmartTalkHandoffSafetyMeta(false),
    },
    { status },
  );
}

/**
 * Handles the minimal OCR-to-Smart-Talk handoff envelope branch. Only
 * reachable from the shared multipart dispatcher below
 * (handleMultipartSmartTalkRequest), which peeks the `mode` field from a
 * cloned request before routing to this function; this function then parses
 * the (still-unconsumed) original request body itself. Fully additive and
 * self-contained; does not alter handleRealOcrExtractionRequest's own
 * behavior or response shape.
 */
async function handleOcrToSmartTalkHandoffRequest(
  req: Request,
): Promise<ReturnType<typeof NextResponse.json>> {
  const handoffEnabled = process.env[OCR_TO_SMART_TALK_HANDOFF_ENV_FLAG] === "true";
  if (!handoffEnabled) {
    return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_disabled", 403);
  }

  const realOcrEnabled = process.env[REAL_OCR_ENV_FLAG] === "true";
  if (!realOcrEnabled) {
    return ocrToSmartTalkHandoffBlockedResponse("real_ocr_extraction_required_for_handoff", 403);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return ocrToSmartTalkHandoffBlockedResponse(
      "ocr_to_smart_talk_handoff_invalid_content_type",
      400,
    );
  }

  const pageCountRaw = form.get("pageCount");
  if (pageCountRaw !== OCR_TO_SMART_TALK_HANDOFF_REQUIRED_PAGE_COUNT) {
    return ocrToSmartTalkHandoffBlockedResponse(
      "ocr_to_smart_talk_handoff_page_count_required",
      400,
    );
  }

  // ── Phase 8.11M — controlled-reasoning operation selector ────────────────
  // A minimal explicit multipart field distinguishes internal intent only;
  // it never itself authorizes reasoning — authorization is exclusively the
  // three exact server-side env flags. Checked here, BEFORE image validation
  // and OCR extraction, so a disabled-reasoning request always fails closed
  // before any OCR runs. Requests that omit this field (or send any other
  // value) are completely unaffected and keep the existing 8.11I/8.11K
  // envelope-only behavior below, regardless of the reasoning flag's value.
  const operationRaw = form.get("operation");
  const controlledReasoningRequested = operationRaw === OCR_CONTROLLED_REASONING_OPERATION_VALUE;
  if (controlledReasoningRequested) {
    const reasoningEnabled = process.env[OCR_CONTROLLED_REASONING_ENV_FLAG] === "true";
    if (!reasoningEnabled) {
      return ocrToSmartTalkHandoffBlockedResponse(OCR_CONTROLLED_REASONING_DISABLED_CODE, 403);
    }
  }
  // ── End Phase 8.11M operation selector ────────────────────────────────────

  if (form.getAll("image").length !== 1) {
    return ocrToSmartTalkHandoffBlockedResponse(
      "ocr_to_smart_talk_handoff_single_image_required",
      400,
    );
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_missing_image", 400);
  }
  if (file.size > REAL_OCR_MAX_FILE_SIZE_BYTES) {
    return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_file_too_large", 413);
  }
  if (!REAL_OCR_ALLOWED_MIME_TYPES.has(file.type)) {
    return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_unsupported_mime", 400);
  }

  let imageBuffer: Buffer;
  try {
    imageBuffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_provider_error", 502);
  }

  const ocrResult = await extractTextFromImageBuffer({
    imageBuffer,
    mimeType: file.type as "image/png" | "image/jpeg" | "image/webp",
    timeoutMs: REAL_OCR_TIMEOUT_MS,
  });

  if (!ocrResult.ok) {
    if (ocrResult.errorCode === "ocr_timeout") {
      return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_timeout", 504);
    }
    if (ocrResult.errorCode === "empty_extraction") {
      return ocrToSmartTalkHandoffBlockedResponse(
        "ocr_to_smart_talk_handoff_empty_extraction",
        422,
      );
    }
    return ocrToSmartTalkHandoffBlockedResponse("ocr_to_smart_talk_handoff_provider_error", 502);
  }

  const extractedText = ocrResult.extractedText;
  const quality = evaluateRealOcrQuality(
    extractedText,
    ocrResult.confidenceAvailable,
    ocrResult.confidence,
  );

  // Usable quality does not mean verified truth — high-risk claims (legal
  // deadlines, filings, binding advice, DNA writes) remain blocked
  // regardless of quality status; see handoff.* flags in the response below.
  if (!quality.usableForSmartTalk) {
    return NextResponse.json(
      {
        ok: false,
        code: "ocr_quality_not_usable_for_handoff",
        quality,
        safety: buildOcrToSmartTalkHandoffSafetyMeta(false),
      },
      { status: 422 },
    );
  }

  const highRiskTokensDetected = detectOcrHighRiskTokens(extractedText);
  const ocrWarnings = buildOcrToSmartTalkHandoffOcrWarnings(quality, highRiskTokensDetected);
  const trace = [
    "real_ocr_extraction_enabled_confirmed",
    "ocr_to_smart_talk_handoff_env_confirmed",
    "ocr_extraction_performed",
    `ocr_quality_status:${quality.status}`,
    highRiskTokensDetected.length > 0
      ? "high_risk_tokens_detected"
      : "no_high_risk_tokens_detected",
    "handoff_envelope_created",
    "envelope_ready_for_future_reasoning",
    "smart_talk_reasoning_not_invoked_in_8_11i",
    "model_call_not_invoked_in_8_11i",
  ];

  // ── Phase 8.11M — controlled-reasoning dispatch ───────────────────────────
  // Only reachable when the caller explicitly requested operation ===
  // "controlled_reasoning" AND the reasoning env flag was already confirmed
  // exact "true" above (before OCR ran). The envelope-only response below
  // (unchanged since 8.11I/8.11K) is returned for every other request.
  if (controlledReasoningRequested) {
    return handleOcrControlledReasoningRequest({
      extractedText,
      confidenceAvailable: ocrResult.confidenceAvailable,
      confidence: ocrResult.confidence,
      providerWarnings: ocrResult.providerWarnings,
      quality,
      highRiskTokensDetected,
      ocrWarnings,
      trace,
    });
  }
  // ── End Phase 8.11M controlled-reasoning dispatch ─────────────────────────

  return NextResponse.json({
    ok: true,
    mode: OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE,
    context: "anonymous",
    ocrResult: {
      extractedText,
      extractedTextPreview: extractedText.slice(0, REAL_OCR_PREVIEW_LENGTH),
      extractedTextLength: extractedText.length,
      confidenceAvailable: ocrResult.confidenceAvailable,
      confidence: ocrResult.confidence,
      provider: "tesseract_js",
      providerWarnings: ocrResult.providerWarnings,
      quality,
    },
    smartTalkResult: null,
    handoff: {
      allowed: true,
      performed: false,
      reason: "minimal_handoff_envelope_created_but_smart_talk_reasoning_not_enabled_in_8_11i",
      sourceKind: "ocr_derived_text",
      sourceMode: REAL_OCR_CONTROLLED_RUNTIME_MODE,
      trustLevel: "untrusted_derived",
      sensitivityLevel: "sensitive_user_content",
      qualityStatus: quality.status,
      usableForSmartTalk: quality.usableForSmartTalk,
      blockingReasons: quality.blockingReasons,
      downgradeReasons: quality.downgradeReasons,
      ocrWarnings,
      highRiskTokensDetected,
      extractedTextLength: extractedText.length,
      provider: "tesseract_js",
      confidenceAvailable: ocrResult.confidenceAvailable,
      confidence: ocrResult.confidence,
      exactLegalDeadlineStillBlocked: true,
      bindingLegalAdviceStillBlocked: true,
      officialFilingStillBlocked: true,
      dnaWriteBlocked: true,
      persistenceBlocked: true,
      publicRuntimeStillBlocked: true,
      productionAuthorizedNow: false,
      goLiveAuthorizedNow: false,
      trace,
    },
    safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
    disclaimers: buildOcrToSmartTalkHandoffDisclaimers(),
    warnings: [...OCR_TO_SMART_TALK_HANDOFF_BASE_WARNINGS, ...ocrWarnings],
  });
}

// ── Phase 8.11M — Minimal OCR-to-Smart-Talk Controlled Reasoning Runtime
// Patch helpers ──────────────────────────────────────────────────────────
// Reachable ONLY from handleOcrToSmartTalkHandoffRequest above, and only
// after: (a) both pre-existing 8.11I env gates passed, (b) the caller
// explicitly requested operation === "controlled_reasoning", (c) the new
// reasoning env gate was already confirmed exact "true", and (d) OCR ran
// and produced usable-quality text (otherwise the existing 8.11I quality
// check above already returned ocr_quality_not_usable_for_handoff). This
// branch performs at most ONE call into the existing, already-approved
// runSmartTalk() model path (lib/vaylo/smart-talk/run-smart-talk.ts) — the
// same function used by Free Q&A and Text Document Mode. No second OpenAI
// client is created and no new provider/model is introduced.

/**
 * Safety flags for a completed controlled-reasoning success response. Unlike
 * buildOcrToSmartTalkHandoffSafetyMeta (envelope-only; always
 * modelCallPerformed:false), this dedicated builder is only ever used for
 * the one success shape below, so it takes no parameters. Kept fully
 * separate from buildOcrToSmartTalkHandoffSafetyMeta so 8.11I/8.11J/8.11K's
 * existing envelope-only/disabled behavior and response shape are never
 * touched by this phase.
 */
function buildOcrControlledReasoningSuccessSafetyMeta() {
  return {
    rawImageSentToModel: false,
    originalDocumentFileSentToModel: false,
    extractedTextSentToModel: true,
    modelCallPerformed: true,
    smartTalkReasoningPerformed: true,
    ocrToSmartTalkHandoffEnvelopeCreated: true,
    ocrToSmartTalkHandoffPerformed: true,
    noPersistence: true,
    noStorage: true,
    noDnaWrite: true,
    rawImagePersistencePerformed: false,
    processedImagePersistencePerformed: false,
    extractedTextPersistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
  } as const;
}

/** Builds a fail-closed response for a pure-gate rejection, translating the
 * gate's internal blockingCode to the phase's public failure-code contract. */
function ocrControlledReasoningRejectedResponse(
  gate: ReturnType<typeof evaluateOcrControlledReasoningGate>,
): ReturnType<typeof NextResponse.json> {
  const publicCode =
    (gate.blockingCode && OCR_CONTROLLED_REASONING_GATE_CODE_TO_PUBLIC_CODE[gate.blockingCode]) ||
    OCR_CONTROLLED_REASONING_EVIDENCE_GATE_REJECTED_CODE;
  const status = OCR_CONTROLLED_REASONING_PUBLIC_CODE_STATUS[publicCode] ?? 422;
  return NextResponse.json(
    {
      ok: false,
      code: publicCode,
      reasoning: {
        allowed: false,
        performed: false,
        evidenceGateDecision: gate,
      },
      safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
    },
    { status },
  );
}

interface OcrControlledReasoningRequestContext {
  extractedText: string;
  confidenceAvailable: boolean;
  confidence: number | null;
  providerWarnings: readonly string[];
  quality: RealOcrQualityEvaluation;
  highRiskTokensDetected: readonly string[];
  ocrWarnings: readonly string[];
  trace: readonly string[];
}

/**
 * Handles the controlled-reasoning operation. Runs the pure pre-model
 * Evidence Gate, then (if allowed) builds a minimized model input and makes
 * exactly one call into the existing runSmartTalk() model path, then runs a
 * post-model safety step before returning smartTalkResult. Fails closed on
 * every error path; never persists anything; never sends raw image bytes or
 * the original file anywhere (they are not even in scope here — only
 * already-extracted text and metadata are available to this function).
 */
async function handleOcrControlledReasoningRequest(
  ctx: OcrControlledReasoningRequestContext,
): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const gate = evaluateOcrControlledReasoningGate({
      reasoningEnvEnabled: process.env[OCR_CONTROLLED_REASONING_ENV_FLAG] === "true",
      handoffEnvEnabled: process.env[OCR_TO_SMART_TALK_HANDOFF_ENV_FLAG] === "true",
      realOcrEnvEnabled: process.env[REAL_OCR_ENV_FLAG] === "true",
      sourceKind: "ocr_derived_text",
      sourceMode: REAL_OCR_CONTROLLED_RUNTIME_MODE,
      trustLevel: "untrusted_derived",
      sensitivityLevel: "sensitive_user_content",
      extractedTextLength: ctx.extractedText.length,
      qualityStatus: ctx.quality.status,
      usableForSmartTalk: ctx.quality.usableForSmartTalk,
      blockingReasons: ctx.quality.blockingReasons,
      downgradeReasons: ctx.quality.downgradeReasons,
      ocrWarnings: ctx.ocrWarnings,
      highRiskTokensDetected: ctx.highRiskTokensDetected,
      handoffAllowed: true,
      handoffPerformed: false,
      smartTalkResultIsNull: true,
      rawImageIncludedInModelPayload: false,
      originalFileIncludedInModelPayload: false,
      persistenceAuthorized: false,
      dnaWriteAuthorized: false,
      publicRuntimeAuthorized: false,
    });

    if (!gate.allowed) {
      return ocrControlledReasoningRejectedResponse(gate);
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          code: OCR_CONTROLLED_REASONING_MODEL_ERROR_CODE,
          reasoning: { allowed: true, performed: false, evidenceGateDecision: gate },
          safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
        },
        { status: 503 },
      );
    }

    const reasoningInputSource = {
      extractedText: ctx.extractedText,
      sourceKind: "ocr_derived_text",
      sourceMode: REAL_OCR_CONTROLLED_RUNTIME_MODE,
      trustLevel: "untrusted_derived",
      sensitivityLevel: "sensitive_user_content",
      provider: "tesseract_js",
      confidenceAvailable: ctx.confidenceAvailable,
      confidence: ctx.confidence,
      qualityStatus: ctx.quality.status,
      blockingReasons: ctx.quality.blockingReasons,
      downgradeReasons: ctx.quality.downgradeReasons,
      ocrWarnings: ctx.ocrWarnings,
      highRiskTokensDetected: ctx.highRiskTokensDetected,
      locale: "sk" as const,
    };
    const modelCallParams = buildOcrReasoningModelCallParams(reasoningInputSource);
    const modelInputMeta = buildOcrReasoningModelInputMeta(reasoningInputSource);

    let out: Awaited<ReturnType<typeof runSmartTalk>>;
    try {
      out = await Promise.race([
        runSmartTalk(modelCallParams),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
        }),
      ]);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          code: OCR_CONTROLLED_REASONING_TIMEOUT_CODE,
          reasoning: { allowed: true, performed: false, evidenceGateDecision: gate },
          safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
        },
        { status: 504 },
      );
    }

    if (!out.ok) {
      const requestId = createRequestId();
      logRouteError("[smart-talk] ocr controlled reasoning openai failed", requestId, {
        kind: out.error.kind,
        status: out.error.kind === "openai_http" ? out.error.status : undefined,
      });
      return NextResponse.json(
        {
          ok: false,
          code: OCR_CONTROLLED_REASONING_MODEL_ERROR_CODE,
          requestId,
          reasoning: { allowed: true, performed: false, evidenceGateDecision: gate },
          safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
        },
        { status: 502 },
      );
    }

    // Post-model safety step. The model output was already grounded/
    // sanitized against ctx.extractedText inside runSmartTalk()'s existing
    // strict_document protocol (see build-smart-talk-prompt.ts /
    // run-smart-talk.ts normalizeParsedObject + sanitizeUserVisibleProcedural
    // Prose + filterArrayByProceduralCalendarGrounding) — that reused
    // existing mechanism IS this phase's post-model hallucination trap; it
    // is not duplicated here. This step only records the trap decision trace
    // and reconfirms the static safety boundary. Wrapped in try/catch so any
    // unexpected error here fails closed instead of returning an
    // unsanitized/partial response.
    let trapDecision: Record<string, boolean>;
    try {
      trapDecision = {
        ran: true,
        modelOutputTreatedAsUntrusted: true,
        groundingSanitizersReused: true,
        exactLegalDeadlineStillBlocked: true,
        bindingLegalAdviceStillBlocked: true,
        officialFilingStillBlocked: true,
        paymentInstructionStillBlocked: true,
        authoritySubmissionStillBlocked: true,
        verifiedFactsStillBlocked: true,
        dnaWriteStillBlocked: true,
        persistenceStillBlocked: true,
        ocrMayBeWrongWarningPreserved: true,
        checkOriginalDocumentWarningPreserved: true,
        legalDisclaimerPreserved: true,
      };
    } catch {
      return NextResponse.json(
        {
          ok: false,
          code: OCR_CONTROLLED_REASONING_TRAP_REJECTED_CODE,
          reasoning: { allowed: true, performed: false, evidenceGateDecision: gate },
          safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE,
      context: "anonymous",
      ocrResult: {
        extractedText: ctx.extractedText,
        extractedTextPreview: ctx.extractedText.slice(0, REAL_OCR_PREVIEW_LENGTH),
        extractedTextLength: ctx.extractedText.length,
        confidenceAvailable: ctx.confidenceAvailable,
        confidence: ctx.confidence,
        provider: "tesseract_js",
        providerWarnings: ctx.providerWarnings,
        quality: ctx.quality,
      },
      handoff: {
        allowed: true,
        performed: true,
        reason: OCR_CONTROLLED_REASONING_SUCCESS_REASON,
        sourceKind: "ocr_derived_text",
        sourceMode: REAL_OCR_CONTROLLED_RUNTIME_MODE,
        trustLevel: "untrusted_derived",
        sensitivityLevel: "sensitive_user_content",
        qualityStatus: ctx.quality.status,
        usableForSmartTalk: ctx.quality.usableForSmartTalk,
        blockingReasons: ctx.quality.blockingReasons,
        downgradeReasons: ctx.quality.downgradeReasons,
        ocrWarnings: ctx.ocrWarnings,
        highRiskTokensDetected: ctx.highRiskTokensDetected,
        extractedTextLength: ctx.extractedText.length,
        provider: "tesseract_js",
        confidenceAvailable: ctx.confidenceAvailable,
        confidence: ctx.confidence,
        exactLegalDeadlineStillBlocked: true,
        bindingLegalAdviceStillBlocked: true,
        officialFilingStillBlocked: true,
        dnaWriteBlocked: true,
        persistenceBlocked: true,
        publicRuntimeStillBlocked: true,
        productionAuthorizedNow: false,
        goLiveAuthorizedNow: false,
        trace: ctx.trace,
      },
      reasoning: {
        allowed: true,
        performed: true,
        reason: OCR_CONTROLLED_REASONING_SUCCESS_REASON,
        sourceKind: "ocr_derived_text",
        trustLevel: "untrusted_derived",
        qualityStatus: ctx.quality.status,
        highRiskTokensDetected: ctx.highRiskTokensDetected,
        modelOutputUntrusted: true,
        evidenceGateDecision: gate,
        modelInvocation: {
          performed: true,
          modelCallCount: 1,
          provider: "openai",
          timedOut: false,
        },
        trapDecision,
        modelInputMeta,
      },
      smartTalkResult: out.result,
      safety: buildOcrControlledReasoningSuccessSafetyMeta(),
      disclaimers: buildOcrToSmartTalkHandoffDisclaimers(),
      warnings: [...OCR_CONTROLLED_REASONING_BASE_WARNINGS, ...ctx.ocrWarnings],
      publicRuntimeStillBlocked: true,
      productionAuthorizedNow: false,
      goLiveAuthorizedNow: false,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: OCR_CONTROLLED_REASONING_INTERNAL_ERROR_CODE,
        safety: buildOcrToSmartTalkHandoffSafetyMeta(true),
      },
      { status: 500 },
    );
  }
}
// ── End Phase 8.11M Minimal OCR-to-Smart-Talk Controlled Reasoning Runtime
// Patch helpers ──────────────────────────────────────────────────────────

/**
 * Shared multipart/form-data entry point (Phase 8.11I). Peeks the `mode`
 * form field from a *cloned* request (leaving the original request body
 * unconsumed) to decide which branch should handle the request, then
 * dispatches to either the new OCR-to-Smart-Talk handoff branch or the
 * existing (unmodified) 8.11C real OCR extraction branch — each of which
 * independently parses the original, still-unconsumed request body itself,
 * exactly as before this dispatcher existed. This replaces the previous
 * direct call from POST to handleRealOcrExtractionRequest(req) — that
 * function's own behavior, response shapes, and env-gate-first ordering are
 * otherwise completely unchanged.
 */
async function handleMultipartSmartTalkRequest(
  req: Request,
): Promise<ReturnType<typeof NextResponse.json>> {
  let peekedMode: unknown = null;
  try {
    const peekForm = await req.clone().formData();
    peekedMode = peekForm.get("mode");
  } catch {
    // Malformed multipart body — fall through to the real OCR branch below,
    // whose own req.formData() call on the (still-unconsumed) original
    // request will surface the same real_ocr_invalid_content_type failure
    // mode as before this dispatcher existed.
  }

  if (peekedMode === OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE) {
    return handleOcrToSmartTalkHandoffRequest(req);
  }

  return handleRealOcrExtractionRequest(req);
}
// ── End Phase 8.11I Minimal OCR-to-Smart-Talk Handoff Runtime Patch helpers ─

export async function POST(req: Request) {
  const ip = resolveSmartTalkRateLimitClientIp(req);
  if (!getRuntimeSmartTalkRateLimiter().check(ip).allowed) {
    return NextResponse.json({ ok: false, error: "smart_talk_rate_limited" }, { status: 429 });
  }

  // ── Phase 8.11C — Real OCR Extraction Controlled Runtime dispatch ──────────
  // This is the only branch that accepts multipart/form-data; every other
  // existing mode (question/text, Free Q&A, Text Document Mode, Photo/OCR
  // placeholder) continues to send/receive JSON exactly as before and is
  // completely unaffected by this dispatch check.
  const requestContentType = req.headers.get("content-type") || "";
  if (requestContentType.toLowerCase().startsWith("multipart/form-data")) {
    return handleMultipartSmartTalkRequest(req);
  }
  // ── End Phase 8.11C dispatch ────────────────────────────────────────────────

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("invalid_json");
  }

  if (!body || typeof body !== "object") {
    return badRequest("invalid_body");
  }

  const o = body as Record<string, unknown>;

  // ── Phase 8.11C — Real OCR mode requested via non-multipart JSON body ─────
  // The real OCR extraction branch requires multipart/form-data (handled
  // above, before JSON parsing). If a caller sends this mode as a JSON body
  // instead, fail closed here — before it would otherwise reach the 8.10C
  // placeholder branch below, whose `o.mode.startsWith("photo_ocr")` check
  // would intercept this mode string too.
  if (o.mode === REAL_OCR_CONTROLLED_RUNTIME_MODE) {
    return realOcrBlockedResponse("real_ocr_invalid_content_type", 415);
  }
  // ── End Phase 8.11C JSON-body guard ─────────────────────────────────────────

  // ── Phase 8.11I — OCR-to-Smart-Talk handoff mode requested via non-multipart
  // JSON body ─────────────────────────────────────────────────────────────
  // The handoff branch requires multipart/form-data (handled above, before
  // JSON parsing). If a caller sends this mode as a JSON body instead, fail
  // closed here — before it would otherwise reach the 8.10C placeholder
  // branch below, whose `o.mode.startsWith("photo_ocr")` check would
  // intercept this mode string too (it also starts with "photo_ocr").
  if (o.mode === OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE) {
    return ocrToSmartTalkHandoffBlockedResponse(
      "ocr_to_smart_talk_handoff_invalid_content_type",
      415,
    );
  }
  // ── End Phase 8.11I JSON-body guard ─────────────────────────────────────────

  // ── Phase 8.8T — Public Free Q&A beta branch behind exact env flag ─────────
  // Disabled by default unless SMART_TALK_FREE_QA_PUBLIC_ENABLED === "true".
  // Fail-closed: no model call when disabled.
  if (o.mode === FREE_QA_PUBLIC_BETA_MODE) {
    const publicFreeQaEnabled = process.env[FREE_QA_PUBLIC_RUNTIME_ENV_FLAG] === "true";
    if (!publicFreeQaEnabled) {
      return NextResponse.json(
        {
          ok: false,
          code: "free_qa_public_beta_disabled",
          publicFreeQaBetaEnabled: false,
          publicRuntimeBehindEnvFlag: true,
          publicRuntimeStillBlocked: true,
          documentsStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          legalDisclaimerRequired: true,
          privacyDisclaimerRequired: true,
          eightThreeAcNotRun: true,
        },
        { status: 403 },
      );
    }

    if (o.context !== "anonymous") {
      return badRequest("invalid_context");
    }
    if (o.inputType !== "question") {
      return badRequest("free_qa_question_only");
    }
    if (typeof o.text !== "string") {
      return badRequest("invalid_text");
    }
    const text = o.text.trim();
    if (text.length < MIN_TEXT) {
      return badRequest("text_too_short");
    }
    if (text.length > MAX_TEXT) {
      return badRequest("text_too_long");
    }
    if (!hasLetter(text) || isOnlyUrls(text)) {
      return badRequest("invalid_text");
    }
    if (
      o.requestedOcr === true ||
      o.requestedFileUpload === true ||
      o.requestedScannerUpload === true ||
      o.requestedPhoto === true
    ) {
      return badRequest("ocr_scanner_upload_not_allowed");
    }
    if (
      o.requestedPayment === true ||
      o.requestedEntitlement === true ||
      o.requestedPersistence === true ||
      o.requestedDnaSave === true ||
      o.requestedPaidMode === true
    ) {
      return badRequest("paid_dna_persistence_not_allowed");
    }

    if (
      detectTextDocumentBypassRequired(text) ||
      detectOfficialLetterStyleQuestionText(text) ||
      detectClientPaidDocumentModeActivation(o)
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "document_mode_required",
          message:
            "This looks like a letter, invoice, authority notice, or document-style request. Public Free Q&A beta accepts non-document questions only.",
          nextStep:
            "Use a short anonymous non-document question only. Do not include OCR/photo/scanner/upload content.",
          publicFreeQaBetaEnabled: true,
          anonymousNonDocumentQuestionOnly: true,
          documentLikeTextBlocked: true,
          publicRuntimeBehindEnvFlag: true,
          documentsStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          legalDisclaimerRequired: true,
          privacyDisclaimerRequired: true,
          eightThreeAcNotRun: true,
        },
        { status: 402 },
      );
    }

    if (detectExactLegalDeadlineRequest(text)) {
      return NextResponse.json(
        {
          ok: false,
          code: "exact_legal_deadline_calculation_blocked",
          message:
            "Public Free Q&A beta cannot calculate exact legal deadlines. Use verified legal support for exact statutory timelines.",
          publicFreeQaBetaEnabled: true,
          anonymousNonDocumentQuestionOnly: true,
          documentLikeTextBlocked: true,
          publicRuntimeBehindEnvFlag: true,
          documentsStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          legalDisclaimerRequired: true,
          privacyDisclaimerRequired: true,
          eightThreeAcNotRun: true,
        },
        { status: 402 },
      );
    }

    let locale: SmartTalkLocale = "sk";
    if (o.locale !== undefined && o.locale !== null) {
      if (typeof o.locale !== "string" || !ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)) {
        return badRequest("invalid_locale");
      }
      locale = o.locale as SmartTalkLocale;
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "smart_talk_unavailable" }, { status: 503 });
    }

    let out: Awaited<ReturnType<typeof runSmartTalk>>;
    try {
      out = await Promise.race([
        runSmartTalk({ text, locale, inputType: "question" }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
        }),
      ]);
    } catch {
      return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
    }

    if (!out.ok) {
      const requestId = createRequestId();
      logRouteError("[smart-talk] free-qa public beta openai failed", requestId, {
        kind: out.error.kind,
        status: out.error.kind === "openai_http" ? out.error.status : undefined,
      });
      return internalErrorResponse({ requestId, status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mode: FREE_QA_PUBLIC_BETA_MODE,
      context: "anonymous",
      result: out.result,
      publicMeta: {
        publicFreeQaBetaEnabled: true,
        anonymousNonDocumentQuestionOnly: true,
        documentLikeTextBlocked: true,
        publicRuntimeBehindEnvFlag: true,
        documentsStillBlocked: true,
        photoOcrScannerUploadStillBlocked: true,
        paidDnaStillBlocked: true,
        persistenceStillBlocked: true,
        exactLegalDeadlineStillBlocked: true,
        modelOutputStillUntrusted: true,
        legalDisclaimerRequired: true,
        privacyDisclaimerRequired: true,
        legalDisclaimer:
          "Information is general guidance only and is not legal advice; exact legal deadlines and outcomes require verified legal review.",
        privacyDisclaimer:
          "Do not share personal identifiers, account numbers, or full official documents in public Free Q&A beta.",
        eightThreeAcNotRun: true,
      },
    });
  }
  // ── End Phase 8.8T public Free Q&A beta branch ─────────────────────────────

  // ── Phase 8.9C — Text Document Mode controlled runtime branch ──────────────
  // Disabled by default unless SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED === "true".
  // Pasted document text only — no OCR/photo/scanner/upload/paid/DNA/persistence.
  // Fail-closed: no model call when disabled or when any blocker triggers.
  if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) {
    const textDocumentModeEnabled = process.env[TEXT_DOCUMENT_MODE_ENV_FLAG] === "true";
    if (!textDocumentModeEnabled) {
      return textDocumentModeBlockedResponse("text_document_mode_disabled", 403);
    }

    if (o.context !== "anonymous" && o.context !== "controlled_test") {
      return badRequest("invalid_context");
    }
    if (o.inputType !== "text") {
      return badRequest("text_document_mode_text_input_only");
    }
    if (typeof o.text !== "string") {
      return badRequest("invalid_text");
    }
    const text = o.text.trim();
    if (text.length < MIN_TEXT) {
      return badRequest("text_too_short");
    }
    if (text.length > MAX_TEXT) {
      return badRequest("text_too_long");
    }
    if (!hasLetter(text) || isOnlyUrls(text)) {
      return badRequest("invalid_text");
    }

    if (detectOcrPhotoRequest(o)) {
      return textDocumentModeBlockedResponse("photo_ocr_blocked", 402);
    }
    if (detectScannerUploadRequest(o)) {
      return textDocumentModeBlockedResponse("scanner_upload_blocked", 402);
    }
    if (detectFileUploadRequest(o)) {
      return textDocumentModeBlockedResponse("file_upload_blocked", 402);
    }
    // Phase 8.9E-BLOCKER: use the narrow explicit-activation text detector
    // here (not detectClientPaidDocumentModeActivation(o)), since the body's
    // own "mode" field always contains the substring "document" in this
    // branch and would otherwise always false-positive.
    if (detectExplicitPaidDocumentModeActivationForTextDocumentMode(text)) {
      return textDocumentModeBlockedResponse("paid_document_mode_blocked", 402);
    }
    if (detectVayloDnaSaveRequest(o)) {
      return textDocumentModeBlockedResponse("vaylo_dna_blocked", 402);
    }
    if (detectPersistenceStorageRequest(o)) {
      return textDocumentModeBlockedResponse("persistence_storage_blocked", 402);
    }
    if (detectCredentialSecretText(text)) {
      return textDocumentModeBlockedResponse("sensitive_credential_data_blocked", 402);
    }
    if (detectFinancialAccountOrPaymentAuthorizationText(text)) {
      return textDocumentModeBlockedResponse("sensitive_financial_data_blocked", 402);
    }
    if (detectIdentityDocumentNumberText(text)) {
      return textDocumentModeBlockedResponse("sensitive_identity_data_blocked", 402);
    }
    if (detectExactLegalDeadlineRequest(text)) {
      return textDocumentModeBlockedResponse("exact_legal_deadline_calculation_blocked", 402);
    }
    if (detectBindingLegalAdviceRequest(text)) {
      return textDocumentModeBlockedResponse("binding_legal_advice_blocked", 402);
    }
    if (detectOfficialFilingGenerationRequest(text)) {
      return textDocumentModeBlockedResponse("official_filing_generation_blocked", 402);
    }
    if (detectHighRiskCourtPoliceMedicalTaxSignal(text)) {
      return textDocumentModeBlockedResponse("high_risk_signal_escalation_blocked", 402);
    }
    if (!isDocumentLikeSignalPresent(text)) {
      return textDocumentModeBlockedResponse("no_document_signal_blocked", 400);
    }

    let locale: SmartTalkLocale = "sk";
    if (o.locale !== undefined && o.locale !== null) {
      if (typeof o.locale !== "string" || !ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)) {
        return badRequest("invalid_locale");
      }
      locale = o.locale as SmartTalkLocale;
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "smart_talk_unavailable" }, { status: 503 });
    }

    let out: Awaited<ReturnType<typeof runSmartTalk>>;
    try {
      out = await Promise.race([
        runSmartTalk({ text, locale, inputType: "text" }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
        }),
      ]);
    } catch {
      return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
    }

    if (!out.ok) {
      const requestId = createRequestId();
      logRouteError("[smart-talk] text document controlled runtime openai failed", requestId, {
        kind: out.error.kind,
        status: out.error.kind === "openai_http" ? out.error.status : undefined,
      });
      return internalErrorResponse({ requestId, status: 500 });
    }

    const context = o.context as "anonymous" | "controlled_test";
    return NextResponse.json({
      ok: true,
      mode: TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE,
      context,
      result: out.result,
      textDocumentMeta: buildTextDocumentModeSafetyFlags(true),
    });
  }
  // ── End Phase 8.9C Text Document Mode controlled runtime branch ────────────

  // ── Phase 8.12C — First Contact Controlled Runtime branch ──────────────────
  // Disabled by default unless SMART_TALK_FIRST_CONTACT_MODE_ENABLED === "true"
  // (exact match only — no truthy coercion, no client/header/query/body
  // bypass, no automatic enablement). General first-time bureaucratic/life
  // situation orientation only for the Germany (DE) market — no document,
  // photo, or OCR interpretation, no paid-document-mode bypass, no
  // persistence/DNA. Reuses the existing runSmartTalk() question path with
  // source "first_contact" (maximum one model call). Fail-closed: the pure
  // first-contact-runtime-gate module decides allow/deny before any model
  // call, and the deterministic presentation mapper + final validator decide
  // whether a First Contact presentation may be returned at all.
  if (o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE) {
    const firstContactModeEnabled = process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true";

    const rawText = typeof o.text === "string" ? o.text : "";
    const rawLocale = typeof o.locale === "string" ? o.locale : "";
    const rawMarket = typeof o.market === "string" ? o.market : "";
    const rawScenario =
      o.scenario === undefined || o.scenario === null
        ? null
        : typeof o.scenario === "string"
          ? o.scenario
          : "__invalid_scenario__";

    const gate = runFirstContactRuntimeGate({
      enabled: firstContactModeEnabled,
      explicitlySelected: true,
      text: rawText,
      locale: rawLocale,
      allowedLocales: [...ALLOWED_LOCALES],
      minTextLength: MIN_TEXT,
      maxTextLength: MAX_TEXT,
      market: rawMarket,
      scenario: rawScenario,
      documentInterpretationRequested: isDocumentLikeSignalPresent(rawText),
      photoOrFilePresent:
        detectOcrPhotoRequest(o) || detectScannerUploadRequest(o) || detectFileUploadRequest(o),
      paidDocumentBoundaryTriggered: detectClientPaidDocumentModeActivation(o),
      persistenceRequested: detectVayloDnaSaveRequest(o) || detectPersistenceStorageRequest(o),
    });

    if (!gate.allowed) {
      const status = FIRST_CONTACT_GATE_CODE_STATUS[gate.code] ?? 400;
      return NextResponse.json(
        {
          ok: false,
          code: gate.code,
          reason: gate.reason,
          recommendedMode: gate.recommendedMode,
          firstContactMeta: buildFirstContactModeSafetyFlags(firstContactModeEnabled),
        },
        { status },
      );
    }

    const normalizedText = gate.normalizedText ?? "";
    if (!hasLetter(normalizedText) || isOnlyUrls(normalizedText)) {
      return badRequest("invalid_text");
    }

    const locale = gate.normalizedLocale as SmartTalkLocale;
    const market = gate.normalizedMarket as FirstContactMarket;

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "smart_talk_unavailable" }, { status: 503 });
    }

    let out: Awaited<ReturnType<typeof runSmartTalk>>;
    try {
      out = await Promise.race([
        runSmartTalk({ text: normalizedText, locale, inputType: "question", source: "first_contact" }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
        }),
      ]);
    } catch {
      return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
    }

    if (!out.ok) {
      const requestId = createRequestId();
      logRouteError("[smart-talk] first contact controlled runtime openai failed", requestId, {
        kind: out.error.kind,
        status: out.error.kind === "openai_http" ? out.error.status : undefined,
      });
      return internalErrorResponse({ requestId, status: 500 });
    }

    const presentation = buildFirstContactPresentation(out.result, { market });
    if (!presentation) {
      return NextResponse.json(
        {
          ok: false,
          code: "first_contact_presentation_invalid",
          firstContactMeta: buildFirstContactModeSafetyFlags(true),
        },
        { status: 500 },
      );
    }

    const validation = validateFirstContactPresentation(out.result, presentation);
    if (!validation.valid) {
      const requestId = createRequestId();
      logRouteError("[smart-talk] first contact presentation failed final validation", requestId, {
        violations: validation.violations,
      });
      return NextResponse.json(
        {
          ok: false,
          code: "first_contact_presentation_invalid",
          firstContactMeta: buildFirstContactModeSafetyFlags(true),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: FIRST_CONTACT_CONTROLLED_RUNTIME_MODE,
      context: {
        locale,
        market,
        jurisdictionStatus: "server_bounded" as const,
        scenario: gate.normalizedScenario,
      },
      result: out.result,
      firstContactMeta: presentation,
      disclaimers: {
        legalDisclaimerRequired: true,
        privacyDisclaimerRequired: true,
        legalDisclaimer:
          "Information is general first-time orientation only and is not legal advice; verify specifics with the relevant office.",
        privacyDisclaimer:
          "Do not share personal identifiers, account numbers, or full official documents in First Contact mode.",
        modelOutputStillUntrusted: true,
        persistenceStillBlocked: true,
        dnaStillBlocked: true,
      },
    });
  }
  // ── End Phase 8.12C First Contact Controlled Runtime branch ────────────────

  // ── Phase 8.10C — Photo/OCR Controlled Runtime Placeholder branch ──────────
  // Disabled by default unless SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED
  // === "true" (exact lowercase match only; every other value fails closed).
  // Controlled internal placeholder ONLY — no OCR engine, no OCR dependency,
  // no model call, no image bytes read (only page metadata: mimeType +
  // sizeBytes is inspected), no persistence, no DB/storage/DNA write. This
  // branch is fully isolated from the default question/text flow, the
  // text_document_controlled_runtime flow, and the existing photo/default
  // upload flow (/api/smart-talk-photo). Real OCR extraction remains blocked
  // and deferred to a later, separate, explicitly authorized phase.
  if (typeof o.mode === "string" && o.mode.startsWith("photo_ocr")) {
    if (o.mode !== PHOTO_OCR_CONTROLLED_RUNTIME_MODE) {
      return photoOcrBlockedResponse("photo_ocr_invalid_mode_blocked", 400);
    }

    const photoOcrEnabled = process.env[PHOTO_OCR_ENV_FLAG] === "true";
    if (!photoOcrEnabled) {
      return photoOcrBlockedResponse("photo_ocr_controlled_runtime_disabled", 403);
    }

    if (o.context !== "anonymous") {
      return photoOcrBlockedResponse("photo_ocr_invalid_context_blocked", 400);
    }
    if (o.inputType !== "photo") {
      return photoOcrBlockedResponse("photo_ocr_invalid_input_type_blocked", 400);
    }
    if (typeof o.text === "string" && o.text.trim().length > 0) {
      return photoOcrBlockedResponse("photo_ocr_text_payload_mismatch_blocked", 400);
    }

    const pages = o.photoPages;
    if (!isPhotoOcrPageArray(pages) || pages.length === 0) {
      return photoOcrBlockedResponse("photo_ocr_photo_payload_required", 400);
    }
    if (pages.length > PHOTO_OCR_MAX_PAGES) {
      return photoOcrBlockedResponse("photo_ocr_page_count_blocked", 400);
    }
    if (detectPhotoOcrPdfMarker(pages)) {
      return photoOcrBlockedResponse("photo_ocr_pdf_upload_blocked", 400);
    }
    if (detectPhotoOcrUnsupportedMimeType(pages)) {
      return photoOcrBlockedResponse("photo_ocr_unsupported_mime_type_blocked", 400);
    }
    if (detectPhotoOcrRemoteUrlMarker(pages)) {
      return photoOcrBlockedResponse("photo_ocr_remote_url_blocked", 400);
    }
    if (detectPhotoOcrFilePathMarker(pages)) {
      return photoOcrBlockedResponse("photo_ocr_file_path_blocked", 400);
    }
    if (detectPhotoOcrOversizedPage(pages)) {
      return photoOcrBlockedResponse("photo_ocr_image_size_blocked", 400);
    }
    if (
      typeof o.processedPayloadSizeBytes === "number" &&
      o.processedPayloadSizeBytes > PHOTO_OCR_MAX_PROCESSED_BYTES_TOTAL
    ) {
      return photoOcrBlockedResponse("photo_ocr_processed_payload_size_blocked", 400);
    }
    if (detectPhotoOcrBackgroundUploadMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_background_upload_blocked", 402);
    }
    if (detectPhotoOcrPersistenceMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_persistence_blocked", 402);
    }
    if (detectPhotoOcrStorageMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_storage_blocked", 402);
    }
    if (detectPhotoOcrDnaWriteMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_dna_write_blocked", 402);
    }
    if (detectPhotoOcrPaidModeMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_paid_mode_blocked", 402);
    }
    if (detectPhotoOcrPublicRuntimeMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_public_runtime_blocked", 402);
    }
    if (detectPhotoOcrProductionMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_production_blocked", 402);
    }
    if (detectPhotoOcrGoLiveMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_go_live_blocked", 402);
    }
    if (detectPhotoOcrEightThreeAcMarker(o)) {
      return photoOcrBlockedResponse("photo_ocr_8_3ac_invocation_blocked", 402);
    }

    const note = typeof o.note === "string" ? o.note : "";
    if (note) {
      if (detectExactLegalDeadlineRequest(note)) {
        return photoOcrBlockedResponse("photo_ocr_exact_legal_deadline_blocked", 402);
      }
      if (detectBindingLegalAdviceRequest(note)) {
        return photoOcrBlockedResponse("photo_ocr_binding_legal_advice_blocked", 402);
      }
      if (detectOfficialFilingGenerationRequest(note)) {
        return photoOcrBlockedResponse("photo_ocr_official_filing_generation_blocked", 402);
      }
      if (detectCredentialSecretText(note)) {
        return photoOcrBlockedResponse("photo_ocr_sensitive_credential_data_blocked", 402);
      }
      if (detectFinancialAccountOrPaymentAuthorizationText(note)) {
        return photoOcrBlockedResponse("photo_ocr_sensitive_financial_data_blocked", 402);
      }
    }

    if (o.locale !== undefined && o.locale !== null) {
      if (typeof o.locale !== "string" || !ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)) {
        return badRequest("invalid_locale");
      }
    }

    // Controlled placeholder path only. No OCR engine, no OCR dependency, no
    // model call, no image bytes read (only mimeType/sizeBytes metadata was
    // inspected above), no persistence. Real OCR extraction is deferred to a
    // later, separate, explicitly authorized phase (see 8.10B plan).
    return NextResponse.json({
      ok: true,
      mode: PHOTO_OCR_CONTROLLED_RUNTIME_MODE,
      context: "anonymous",
      result: {
        summary:
          "Obrázok bol prijatý len na kontrolovanú internú validáciu Photo/OCR placeholder cesty.",
        meaning:
          "Toto je iba technický test rozhrania. Skutočné rozpoznávanie textu (OCR) z obrázka v tejto fáze ešte nie je aktívne.",
        urgency: "unknown",
        nextSteps: [],
        warnings: [
          "OCR extrakcia textu z fotografie zatiaľ nie je vykonávaná.",
          "Toto je interný kontrolovaný placeholder, nie verejná funkcia.",
        ],
        confidenceLevel: "low",
        documentQuality: "unknown",
        documentKind: "unknown",
        domain: "unknown",
        deadlines: [],
        rights: [],
        obligations: [],
        consequences: [],
      },
      photoOcrMeta: buildPhotoOcrMeta(true),
    });
  }
  // ── End Phase 8.10C Photo/OCR Controlled Runtime Placeholder branch ────────

  // ── Phase 8.8M — Actual minimal scoped runtime patch (internal-only Free Q&A) ──
  // Strictly fail-closed. Disabled by default for public requests.
  const freeQaModeRequested =
    o.internalRuntimeMode === FREE_QA_INTERNAL_RUNTIME_MODE ||
    o.internalRuntimeGuard === FREE_QA_INTERNAL_RUNTIME_GUARD ||
    o.internalFreeQaTestEnabled !== undefined;
  if (freeQaModeRequested) {
    const l = runFreeQaScopedRuntimePatchAuthorizationDecision();
    const eightEightLAuthorizationConfirmed =
      l.checkId === "8.8L" &&
      l.allPassed === true &&
      l.authorizationDecisionStatus ===
        "authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only" &&
      l.scopedRuntimePatchAuthorizedForNextPhase === true &&
      l.authorizedNextPhase === "8.8M_actual_minimal_scoped_runtime_patch" &&
      l.readyForActualMinimalScopedRuntimePatch === true;

    if (!eightEightLAuthorizationConfirmed) {
      return NextResponse.json(
        {
          ok: false,
          code: "free_qa_patch_authorization_failed",
          actualMinimalScopedRuntimePatchImplemented: false,
          internalFreeQaOnly: true,
          anonymousNonDocumentQuestionOnly: true,
          documentLikeTextBlocked: true,
          publicRuntimeStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          eightEightLAuthorizationConfirmed: false,
          eightThreeAcNotRun: true,
        },
        { status: 403 },
      );
    }

    const internalAuth = runRuntimeInternalAuthGuard({
      providedSecret: req.headers.get("x-vaylo-internal-runtime-secret"),
      expectedSecret: process.env.VAYLO_INTERNAL_RUNTIME_SECRET,
    });
    if (!internalAuth.authorised) {
      return NextResponse.json(
        {
          ok: false,
          code: "free_qa_patch_internal_auth_failed",
          actualMinimalScopedRuntimePatchImplemented: false,
          internalFreeQaOnly: true,
          anonymousNonDocumentQuestionOnly: true,
          documentLikeTextBlocked: true,
          publicRuntimeStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          eightEightLAuthorizationConfirmed: true,
          eightThreeAcNotRun: true,
        },
        { status: 403 },
      );
    }

    if (
      o.internalRuntimeMode !== FREE_QA_INTERNAL_RUNTIME_MODE ||
      o.internalRuntimeGuard !== FREE_QA_INTERNAL_RUNTIME_GUARD ||
      o.internalFreeQaTestEnabled !== true
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "free_qa_patch_guard_not_satisfied",
          actualMinimalScopedRuntimePatchImplemented: false,
          internalFreeQaOnly: true,
          anonymousNonDocumentQuestionOnly: true,
          documentLikeTextBlocked: true,
          publicRuntimeStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          eightEightLAuthorizationConfirmed: true,
          eightThreeAcNotRun: true,
        },
        { status: 403 },
      );
    }

    if (o.context !== "anonymous") {
      return badRequest("invalid_context");
    }
    if (o.inputType !== "question") {
      return badRequest("free_qa_question_only");
    }
    if (typeof o.text !== "string") {
      return badRequest("invalid_text");
    }
    const text = o.text.trim();
    if (text.length < MIN_TEXT) {
      return badRequest("text_too_short");
    }
    if (text.length > MAX_TEXT) {
      return badRequest("text_too_long");
    }
    if (!hasLetter(text) || isOnlyUrls(text)) {
      return badRequest("invalid_text");
    }
    if (
      o.requestedOcr === true ||
      o.requestedFileUpload === true ||
      o.requestedScannerUpload === true ||
      o.requestedPhoto === true
    ) {
      return badRequest("ocr_scanner_upload_not_allowed");
    }
    if (
      o.requestedPayment === true ||
      o.requestedEntitlement === true ||
      o.requestedPersistence === true ||
      o.requestedDnaSave === true ||
      o.requestedPaidMode === true
    ) {
      return badRequest("paid_dna_persistence_not_allowed");
    }

    if (
      detectTextDocumentBypassRequired(text) ||
      detectOfficialLetterStyleQuestionText(text) ||
      detectClientPaidDocumentModeActivation(o)
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "document_mode_required",
          message:
            "This looks like a letter, invoice, authority notice, or document-style request. Free Q&A internal patch accepts non-document questions only.",
          nextStep:
            "Use a short anonymous non-document question only. Do not include OCR/photo/scanner/upload content.",
          actualMinimalScopedRuntimePatchImplemented: true,
          internalFreeQaOnly: true,
          anonymousNonDocumentQuestionOnly: true,
          documentLikeTextBlocked: true,
          publicRuntimeStillBlocked: true,
          photoOcrScannerUploadStillBlocked: true,
          paidDnaStillBlocked: true,
          persistenceStillBlocked: true,
          exactLegalDeadlineStillBlocked: true,
          modelOutputStillUntrusted: true,
          eightEightLAuthorizationConfirmed: true,
          eightThreeAcNotRun: true,
        },
        { status: 402 },
      );
    }

    let locale: SmartTalkLocale = "sk";
    if (o.locale !== undefined && o.locale !== null) {
      if (typeof o.locale !== "string" || !ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)) {
        return badRequest("invalid_locale");
      }
      locale = o.locale as SmartTalkLocale;
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "smart_talk_unavailable" }, { status: 503 });
    }

    let out: Awaited<ReturnType<typeof runSmartTalk>>;
    try {
      out = await Promise.race([
        runSmartTalk({ text, locale, inputType: "question" }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
        }),
      ]);
    } catch {
      return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
    }

    if (!out.ok) {
      const requestId = createRequestId();
      logRouteError("[smart-talk] free-qa internal scoped patch openai failed", requestId, {
        kind: out.error.kind,
        status: out.error.kind === "openai_http" ? out.error.status : undefined,
      });
      return internalErrorResponse({ requestId, status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mode: "free_qa_internal_scoped_patch",
      context: "anonymous",
      result: out.result,
      patchMeta: {
        actualMinimalScopedRuntimePatchImplemented: true,
        internalFreeQaOnly: true,
        anonymousNonDocumentQuestionOnly: true,
        documentLikeTextBlocked: true,
        publicRuntimeStillBlocked: true,
        photoOcrScannerUploadStillBlocked: true,
        paidDnaStillBlocked: true,
        persistenceStillBlocked: true,
        exactLegalDeadlineStillBlocked: true,
        modelOutputStillUntrusted: true,
        eightEightLAuthorizationConfirmed: true,
        eightThreeAcNotRun: true,
      },
    });
  }
  // ── End Phase 8.8M minimal scoped runtime patch ─────────────────────────────

  // ── Phase 8.2K-2 — Guarded internal controlled text pilot branch ──────────
  // Activates ONLY when internalRuntimeMode === "controlled_text_pilot_guarded".
  // Fail-closed: any guard failure returns an opaque rejection with no raw content.
  // Does not call live LLM, does not persist, does not emit user-visible output.
  // Governance chain connection comes in 8.2K-3.
  if (o.internalRuntimeMode === "controlled_text_pilot_guarded") {
    const d: string[] = ["pilot_runtime_contract_started"];

    // Guard 1 — feature_flag_enabled
    if (process.env.VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME !== "true") {
      return buildPilotFailureResponse(
        "rejected_feature_flag_disabled",
        "pilot_runtime_rejected_feature_flag_disabled",
        "feature_flag_enabled",
        403,
        "Feature flag disabled.",
        d,
      );
    }
    d.push("pilot_runtime_feature_flag_confirmed");

    // Guard 2 — controlled_text_pilot_flag_enabled
    if (process.env.VAYLO_ENABLE_CONTROLLED_TEXT_PILOT !== "true") {
      return buildPilotFailureResponse(
        "rejected_controlled_text_pilot_flag_disabled",
        "pilot_runtime_rejected_controlled_text_pilot_flag_disabled",
        "controlled_text_pilot_flag_enabled",
        403,
        "Controlled text pilot flag disabled.",
        d,
      );
    }
    d.push("pilot_runtime_controlled_text_pilot_flag_confirmed");

    // Guard 3 — kill_switch_disabled
    if (process.env.VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH === "true") {
      return buildPilotFailureResponse(
        "rejected_kill_switch_enabled",
        "pilot_runtime_rejected_kill_switch_enabled",
        "kill_switch_disabled",
        403,
        "Kill switch active.",
        d,
      );
    }
    d.push("pilot_runtime_kill_switch_confirmed_disabled");

    // Guard 4 — internal_runtime_secret_valid
    const configuredSecret = process.env.VAYLO_INTERNAL_RUNTIME_SECRET;
    const providedSecret = req.headers.get("x-vaylo-internal-runtime-secret");
    if (!configuredSecret || !providedSecret) {
      return buildPilotFailureResponse(
        "rejected_missing_internal_secret",
        "pilot_runtime_rejected_missing_internal_secret",
        "internal_runtime_secret_valid",
        403,
        "Internal runtime secret not configured or not provided.",
        d,
      );
    }
    if (providedSecret !== configuredSecret) {
      return buildPilotFailureResponse(
        "rejected_invalid_internal_secret",
        "pilot_runtime_rejected_invalid_internal_secret",
        "internal_runtime_secret_valid",
        403,
        "Internal runtime secret invalid.",
        d,
      );
    }
    d.push("pilot_runtime_internal_secret_present");
    d.push("pilot_runtime_internal_secret_valid");

    // Guard 5 — internal_guard_phrase_valid
    if (
      o.internalRuntimeGuard === undefined ||
      o.internalRuntimeGuard === null
    ) {
      return buildPilotFailureResponse(
        "rejected_missing_guard_phrase",
        "pilot_runtime_rejected_missing_guard_phrase",
        "internal_guard_phrase_valid",
        403,
        "Guard phrase missing.",
        d,
      );
    }
    if (o.internalRuntimeGuard !== PILOT_RUNTIME_REQUIRED_GUARD_PHRASE) {
      return buildPilotFailureResponse(
        "rejected_invalid_guard_phrase",
        "pilot_runtime_rejected_invalid_guard_phrase",
        "internal_guard_phrase_valid",
        403,
        "Guard phrase invalid.",
        d,
      );
    }
    d.push("pilot_runtime_guard_phrase_present");
    d.push("pilot_runtime_guard_phrase_valid");

    // Guard 6 — internal_account_allowlisted
    const pilotReviewerId = getPilotStringField(o, "pilotReviewerId");
    const allowedReviewerIds = parsePilotCsvEnvList(
      process.env.VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST,
    );
    if (
      !pilotReviewerId ||
      allowedReviewerIds.length === 0 ||
      !allowedReviewerIds.includes(pilotReviewerId)
    ) {
      return buildPilotFailureResponse(
        "rejected_not_allowlisted",
        "pilot_runtime_rejected_not_allowlisted",
        "internal_account_allowlisted",
        403,
        "Requester not allowlisted.",
        d,
      );
    }
    d.push("pilot_runtime_account_allowlisted");

    // Guard 7 — pilot_scenario_allowed
    const pilotScenarioId = getPilotStringField(o, "pilotScenarioId");
    const allowedScenarioIds = parsePilotCsvEnvList(
      process.env.VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST,
    );
    if (
      !pilotScenarioId ||
      allowedScenarioIds.length === 0 ||
      !allowedScenarioIds.includes(pilotScenarioId)
    ) {
      return buildPilotFailureResponse(
        "rejected_unknown_pilot_scenario",
        "pilot_runtime_rejected_unknown_pilot_scenario",
        "pilot_scenario_allowed",
        403,
        "Pilot scenario not in allowlist.",
        d,
      );
    }
    d.push("pilot_runtime_scenario_allowed");

    // Guard 8 — pilot_input_mode_supported
    const rawInputMode = o.pilotInputMode;
    if (
      rawInputMode !== "real_text_guarded" &&
      rawInputMode !== "real_question_guarded"
    ) {
      return buildPilotFailureResponse(
        "rejected_unsupported_input_mode",
        "pilot_runtime_rejected_unsupported_input_mode",
        "pilot_input_mode_supported",
        400,
        "Unsupported pilot input mode.",
        d,
      );
    }
    const pilotInputMode = rawInputMode as
      | "real_text_guarded"
      | "real_question_guarded";
    d.push("pilot_runtime_input_mode_supported");

    // Guard 9 — no_ocr_or_upload_requested
    if (o.requestedOcr !== false || o.requestedFileUpload !== false) {
      return buildPilotFailureResponse(
        "rejected_ocr_or_upload_attempt",
        "pilot_runtime_rejected_ocr_or_upload_attempt",
        "no_ocr_or_upload_requested",
        400,
        "OCR or file upload not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_ocr_or_upload_confirmed");

    // Guard 10 — no_payment_requested
    if (o.requestedPayment !== false) {
      return buildPilotFailureResponse(
        "rejected_payment_attempt",
        "pilot_runtime_rejected_payment_attempt",
        "no_payment_requested",
        400,
        "Payment not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_payment_confirmed");

    // Guard 11 — no_persistence_requested
    if (o.requestedPersistence !== false) {
      return buildPilotFailureResponse(
        "rejected_persistence_attempt",
        "pilot_runtime_rejected_persistence_attempt",
        "no_persistence_requested",
        400,
        "Persistence not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_persistence_confirmed");

    // Guard 12 — no_dna_save_requested
    if (o.requestedDnaSave !== false) {
      return buildPilotFailureResponse(
        "rejected_dna_save_attempt",
        "pilot_runtime_rejected_dna_save_attempt",
        "no_dna_save_requested",
        400,
        "DNA save not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_dna_save_confirmed");

    // Guard 13 — no_offline_save_requested
    if (o.requestedOfflineSave !== false) {
      return buildPilotFailureResponse(
        "rejected_offline_save_attempt",
        "pilot_runtime_rejected_offline_save_attempt",
        "no_offline_save_requested",
        400,
        "Offline save not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_offline_save_confirmed");

    // Guard 14 — public_runtime_not_requested
    if (o.requestedPublicRuntime !== false) {
      return buildPilotFailureResponse(
        "rejected_public_runtime_attempt",
        "pilot_runtime_rejected_public_runtime_attempt",
        "public_runtime_not_requested",
        400,
        "Public runtime not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_public_runtime_confirmed");

    // Guard 15 — live_llm_not_allowed
    if (o.requestedLiveLLM !== false) {
      return buildPilotFailureResponse(
        "rejected_live_llm_not_allowed",
        "pilot_runtime_rejected_live_llm_not_allowed",
        "live_llm_not_allowed",
        400,
        "Live LLM not permitted.",
        d,
      );
    }
    d.push("pilot_runtime_no_live_llm_confirmed");

    // Guard 16 — manual_review_required_for_warning_or_high_risk
    // 8.2K-2: satisfied by confirming neverUserVisible === true on request.
    if (o.neverUserVisible !== true) {
      return buildPilotFailureResponse(
        "rejected_manual_review_required",
        "pilot_runtime_rejected_manual_review_required",
        "manual_review_required_for_warning_or_high_risk",
        403,
        "neverUserVisible must be true.",
        d,
      );
    }
    d.push("pilot_runtime_manual_review_boundary_confirmed");

    // Basic contract shape — pilotRunId and text must be present
    const pilotRunId = getPilotStringField(o, "pilotRunId");
    if (!pilotRunId) {
      return buildPilotFailureResponse(
        "rejected_contract_violation",
        "pilot_runtime_rejected_contract_violation",
        null,
        400,
        "pilotRunId missing or invalid.",
        d,
      );
    }
    if (typeof o.text !== "string" || (o.text as string).trim().length === 0) {
      return buildPilotFailureResponse(
        "rejected_contract_violation",
        "pilot_runtime_rejected_contract_violation",
        null,
        400,
        "text field missing or empty.",
        d,
      );
    }

    d.push("pilot_runtime_all_guards_passed");

    // All 16 guards passed.
    // Governance chain will be connected in 8.2K-3.
    // Response contains no input text, no redacted text, no model output.
    return NextResponse.json(
      {
        ok: true,
        runtime: "controlled_text_pilot_guarded",
        result: {
          mode: "controlled_text_pilot_guarded",
          pilotRunId,
          pilotScenarioId,
          pilotInputMode,
          responseKind: "authorised_internal_packet",

          emittedToUserNow: false,
          userVisibleOutputAllowed: false,
          publicRuntimeEnabled: false,
          readyForPublicLaunch: false,

          noPersistence: buildPilotNoPersistenceResult(),

          guardSummary: {
            guardsPassed: [...PILOT_RUNTIME_REQUIRED_GUARDS],
            diagnostics: d,
          },

          liveLLMCalled: false,
          apiRouteModified: true,
          uiTouched: false,
          persistenceUsed: false,
          dnaSavePerformed: false,
          offlineSavePerformed: false,
          neverUserVisible: true,
        },
      },
      { status: 200 },
    );
  }
  // ── End Phase 8.2K-2 guarded internal controlled text pilot branch ────────

  // ── Guarded internal delivery branch (Phase 8.2G-9 / 8.2G-10) ──────────
  // Activates ONLY when internalRuntimeMode or internalRuntimeGuard are
  // present. Normal Smart Talk requests never include these fields.
  if (
    o.internalRuntimeMode !== undefined ||
    o.internalRuntimeGuard !== undefined
  ) {
    // Phase 8.2G-10 — server-side secret header guard (must pass before delivery)
    const internalAuth = runRuntimeInternalAuthGuard({
      providedSecret: req.headers.get("x-vaylo-internal-runtime-secret"),
      expectedSecret: process.env.VAYLO_INTERNAL_RUNTIME_SECRET,
    });

    if (!internalAuth.authorised) {
      return NextResponse.json(
        {
          error: "Internal guarded runtime unauthorised",
          code: internalAuth.verdict,
        },
        { status: 403 },
      );
    }

    // ── Phase 8.2H-5 — controlled live text guarded branch ────────────────
    // Activates ONLY when mode + guard phrase match exactly. Uses only the
    // safe_real_text synthetic fixture; no real user text is forwarded.
    if (
      o.internalRuntimeMode === "controlled_live_text_guarded" &&
      o.internalRuntimeGuard === "I_UNDERSTAND_THIS_IS_CONTROLLED_LIVE_TEXT_INTERNAL_ONLY"
    ) {
      const pipelineResult = runGuardedLiveTextRuntimePipeline({
        pipelineRunId: `smart-talk-controlled-live-text-${Date.now().toString()}`,
        fixtureMode: "safe_real_text",
        neverUserVisible: true,
      });
      return NextResponse.json(
        {
          mode: "controlled_live_text_guarded",
          verdict: pipelineResult.verdict,
          diagnostics: pipelineResult.diagnostics,
          packetCreated: pipelineResult.packetCreated,
          acceptedForUserVisibleAssembly: pipelineResult.acceptedForUserVisibleAssembly,
          userVisibleOutputAllowedForFuture: pipelineResult.userVisibleOutputAllowedForFuture,
        },
        { status: pipelineResult.verdict === "completed_authorised_internal_packet" ? 200 : 403 },
      );
    }
    // ── End Phase 8.2H-5 controlled live text guarded branch ──────────────

    const deliveryResult = runRuntimeGuardedDelivery({
      internalRuntimeMode: o.internalRuntimeMode,
      internalRuntimeGuard: o.internalRuntimeGuard,
      fixtureMode: o.fixtureMode,
      featureFlagEnabled:
        process.env.VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME === "true",
      deliveryRunId: `smart-talk-guarded-${Date.now().toString()}`,
      neverUserVisible: true,
    });

    if (deliveryResult.verdict !== "delivered_guarded_synthetic_response") {
      return NextResponse.json(
        {
          error: "Internal guarded runtime disabled or rejected",
          code: deliveryResult.verdict,
          diagnostics: deliveryResult.diagnostics,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        mode: "synthetic_e2e_guarded",
        result: deliveryResult.responsePayload,
      },
      { status: 200 },
    );
  }
  // ── End guarded internal delivery branch ─────────────────────────────────

  if (o.context !== "anonymous") {
    return badRequest("invalid_context");
  }
  if (!isSmartTalkInputType(o.inputType)) {
    return badRequest("invalid_input_type");
  }
  const inputType = o.inputType;
  if (typeof o.text !== "string") {
    return badRequest("invalid_text");
  }

  const text = o.text.trim();
  if (text.length < MIN_TEXT) {
    return badRequest("text_too_short");
  }
  if (text.length > MAX_TEXT) {
    return badRequest("text_too_long");
  }
  if (!hasLetter(text) || isOnlyUrls(text)) {
    return badRequest("invalid_text");
  }

  // ── Phase 8.5N — Text Document Bypass Guard ─────────────────────────────
  // After JSON parse · before runSmartTalk · before prompt build · before model call.
  if (detectTextDocumentBypassRequired(text)) {
    return NextResponse.json(
      {
        ok: false,
        code: "document_mode_required",
        message:
          "This looks like a letter, email, invoice, authority notice, or other document. Please use Document Mode for document explanations.",
        nextStep:
          "You can ask a general question here, but do not paste personal documents into Free Q&A.",
      },
      { status: 402 },
    );
  }
  // ── End Phase 8.5N ───────────────────────────────────────────────────────

  // ── Phase 8.5U — Paid Document Mode boundary: deny-by-default ────────────
  // Rejects client-side paid/document/entitlement activation signals.
  // After JSON parse · after text validation · after 8.5N bypass guard.
  // Before runSmartTalk · before prompt build · before model call.
  // No entitlement runtime · no payment runtime · no document processing.
  if (detectClientPaidDocumentModeActivation(o)) {
    return NextResponse.json(
      {
        ok: false,
        code: "document_mode_required",
        reason:
          "Document Mode requires server-side entitlement verification and is not available in this request.",
        urgency: "unknown",
        summary: "",
        meaning: "",
        nextSteps: [],
        warnings: [
          "Document Mode is not enabled by client-side flags.",
          "Server-side entitlement verification is required before document processing.",
        ],
      },
      { status: 402 },
    );
  }
  // ── End Phase 8.5U ───────────────────────────────────────────────────────

  let locale: SmartTalkLocale = "sk";
  if (o.locale !== undefined && o.locale !== null) {
    if (typeof o.locale !== "string" || !ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)) {
      return badRequest("invalid_locale");
    }
    locale = o.locale as SmartTalkLocale;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "smart_talk_unavailable" },
      { status: 503 },
    );
  }

  let out: Awaited<ReturnType<typeof runSmartTalk>>;
  try {
    out = await Promise.race([
      runSmartTalk({ text, locale, inputType }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
  }

  if (!out.ok) {
    const requestId = createRequestId();
    logRouteError("[smart-talk] openai failed", requestId, {
      kind: out.error.kind,
      status: out.error.kind === "openai_http" ? out.error.status : undefined,
    });
    return internalErrorResponse({ requestId, status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: "smart_talk",
    context: "anonymous",
    result: out.result,
  });
}
