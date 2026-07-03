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

function isSmartTalkInputType(v: unknown): v is SmartTalkInputType {
  return v === "text" || v === "question";
}

export const runtime = "nodejs";

const MAX_TEXT = 12_000;
const MIN_TEXT = 8;
const ALLOWED_LOCALES = new Set<SmartTalkLocale>(["sk", "de", "en"]);

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const SMART_TALK_ROUTE_TIMEOUT_MS = 20_000;
const FREE_QA_INTERNAL_RUNTIME_MODE = "free_qa_internal_scoped_patch";
const FREE_QA_INTERNAL_RUNTIME_GUARD =
  "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY";

/** In-memory sliding window: IP → request timestamps (no persistence). */
const ipHits = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

function takeRateSlot(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  let hits = ipHits.get(ip) ?? [];
  hits = hits.filter((t) => t > cutoff);
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

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

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!takeRateSlot(ip)) {
    return NextResponse.json({ ok: false, error: "smart_talk_rate_limited" }, { status: 429 });
  }

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
