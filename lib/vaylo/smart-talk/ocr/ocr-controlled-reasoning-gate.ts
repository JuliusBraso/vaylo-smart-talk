/**
 * Phase 8.11M — OCR-to-Smart-Talk Controlled Reasoning Gate (pure module).
 *
 * Deterministic, synchronous, side-effect-free authorization gate for the
 * controlled OCR-derived reasoning path designed in Phase 8.11L. This module
 * does NOT:
 *  - read image bytes
 *  - call OCR
 *  - call a model
 *  - mutate process.env
 *  - persist anything
 *  - access a DB, storage, or Vaylo DNA
 *
 * The route (app/api/smart-talk/route.ts) is the only caller. It passes in
 * already-computed booleans/metadata (including the three exact-lowercase
 * "true" env-gate results) and receives back a fail-closed decision plus a
 * human-readable trace. All real authorization remains server-side: this
 * function has no knowledge of HTTP, request bodies, or client-supplied
 * fields, so a client can never influence the outcome except through the
 * legitimate OCR/quality/metadata values the route itself derived.
 */

export interface OcrControlledReasoningGateInput {
  reasoningEnvEnabled: boolean;
  handoffEnvEnabled: boolean;
  realOcrEnvEnabled: boolean;
  sourceKind: string;
  sourceMode: string;
  trustLevel: string;
  sensitivityLevel: string;
  extractedTextLength: number;
  qualityStatus: string;
  usableForSmartTalk: boolean;
  blockingReasons: readonly string[];
  downgradeReasons: readonly string[];
  ocrWarnings: readonly string[] | null | undefined;
  highRiskTokensDetected: readonly string[] | null | undefined;
  handoffAllowed: boolean;
  handoffPerformed: boolean;
  smartTalkResultIsNull: boolean;
  rawImageIncludedInModelPayload: boolean;
  originalFileIncludedInModelPayload: boolean;
  persistenceAuthorized: boolean;
  dnaWriteAuthorized: boolean;
  publicRuntimeAuthorized: boolean;
}

export interface OcrControlledReasoningGateResult {
  allowed: boolean;
  reason: string;
  blockingCode: string | null;
  modelCallAllowed: boolean;
  noPersistence: true;
  sourceRemainsUntrusted: true;
  highRiskClaimsRemainBlocked: true;
  trace: readonly string[];
}

/** Mirrors REAL_OCR_MAX_TEXT_LENGTH in route.ts (8.11C/8.11I). Kept as an
 * independent local constant so this module has zero imports from route.ts. */
const MAX_EXTRACTED_TEXT_LENGTH = 6000;
const MIN_EXTRACTED_TEXT_LENGTH = 1;

const REQUIRED_SOURCE_KIND = "ocr_derived_text";
const REQUIRED_TRUST_LEVEL = "untrusted_derived";

function deny(
  trace: string[],
  blockingCode: string,
  reason: string,
): OcrControlledReasoningGateResult {
  return {
    allowed: false,
    reason,
    blockingCode,
    modelCallAllowed: false,
    noPersistence: true,
    sourceRemainsUntrusted: true,
    highRiskClaimsRemainBlocked: true,
    trace: [...trace, `denied:${blockingCode}`],
  };
}

/**
 * Evaluates whether a controlled OCR-derived reasoning attempt may proceed
 * to a (future) model call. Fails closed on any missing/invalid input. Pure
 * and total: never throws for well-typed input.
 */
export function evaluateOcrControlledReasoningGate(
  input: OcrControlledReasoningGateInput,
): OcrControlledReasoningGateResult {
  const trace: string[] = ["gate_evaluation_started"];

  if (!input.reasoningEnvEnabled) {
    return deny(trace, "reasoning_env_disabled", "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED is not exact lowercase true");
  }
  trace.push("reasoning_env_confirmed");

  if (!input.handoffEnvEnabled) {
    return deny(trace, "handoff_env_disabled", "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED is not exact lowercase true");
  }
  trace.push("handoff_env_confirmed");

  if (!input.realOcrEnvEnabled) {
    return deny(trace, "real_ocr_env_disabled", "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED is not exact lowercase true");
  }
  trace.push("real_ocr_env_confirmed");

  if (input.sourceKind !== REQUIRED_SOURCE_KIND) {
    return deny(trace, "invalid_source_kind", "sourceKind must be ocr_derived_text");
  }
  trace.push("source_kind_confirmed");

  if (input.trustLevel !== REQUIRED_TRUST_LEVEL) {
    return deny(trace, "invalid_trust_level", "trustLevel must be untrusted_derived");
  }
  trace.push("trust_level_confirmed");

  if (!input.handoffAllowed) {
    return deny(trace, "handoff_not_allowed", "handoff.allowed must be true before reasoning");
  }
  trace.push("handoff_allowed_confirmed");

  if (input.handoffPerformed) {
    return deny(trace, "handoff_already_performed", "handoff.performed must still be false before reasoning");
  }
  trace.push("handoff_not_yet_performed_confirmed");

  if (!input.smartTalkResultIsNull) {
    return deny(trace, "invalid_ocr_reasoning_payload", "smartTalkResult must be null before reasoning");
  }
  trace.push("smart_talk_result_null_confirmed");

  if (!input.qualityStatus) {
    return deny(trace, "missing_quality_metadata", "qualityStatus is required");
  }
  trace.push("quality_metadata_present");

  if (input.qualityStatus === "blocked") {
    return deny(trace, "quality_blocked", "OCR quality status is blocked");
  }
  if (input.qualityStatus === "low") {
    return deny(trace, "quality_low", "OCR quality status is low");
  }
  trace.push("quality_status_acceptable");

  if (!input.usableForSmartTalk) {
    return deny(trace, "unusable_for_smart_talk", "usableForSmartTalk is false");
  }
  trace.push("usable_for_smart_talk_confirmed");

  if (input.blockingReasons.length > 0) {
    return deny(trace, "blocking_reasons_present", "blockingReasons must be empty before reasoning");
  }
  trace.push("blocking_reasons_empty_confirmed");

  if (!Array.isArray(input.ocrWarnings)) {
    return deny(trace, "missing_ocr_warnings", "ocrWarnings metadata is required");
  }
  trace.push("ocr_warnings_metadata_present");

  if (!Array.isArray(input.highRiskTokensDetected)) {
    return deny(trace, "missing_high_risk_metadata", "highRiskTokensDetected metadata is required");
  }
  trace.push("high_risk_metadata_present");

  if (
    !Number.isFinite(input.extractedTextLength) ||
    input.extractedTextLength < MIN_EXTRACTED_TEXT_LENGTH
  ) {
    return deny(trace, "empty_extracted_text", "extracted text must be non-empty");
  }
  if (input.extractedTextLength > MAX_EXTRACTED_TEXT_LENGTH) {
    return deny(trace, "extracted_text_too_long", "extracted text exceeds maximum length");
  }
  trace.push("extracted_text_length_confirmed");

  if (input.rawImageIncludedInModelPayload) {
    return deny(trace, "raw_image_in_model_payload_attempt", "raw image bytes must never reach the model");
  }
  trace.push("no_raw_image_in_model_payload_confirmed");

  if (input.originalFileIncludedInModelPayload) {
    return deny(trace, "original_file_in_model_payload_attempt", "original file must never reach the model");
  }
  trace.push("no_original_file_in_model_payload_confirmed");

  if (input.persistenceAuthorized) {
    return deny(trace, "persistence_attempt", "persistence must never be authorized in this path");
  }
  trace.push("no_persistence_authorization_confirmed");

  if (input.dnaWriteAuthorized) {
    return deny(trace, "dna_write_attempt", "DNA write must never be authorized in this path");
  }
  trace.push("no_dna_write_authorization_confirmed");

  if (input.publicRuntimeAuthorized) {
    return deny(trace, "public_runtime_attempt", "public runtime must never be authorized in this path");
  }
  trace.push("no_public_runtime_authorization_confirmed");

  trace.push("evidence_gate_accepted_reasoning_attempt");
  return {
    allowed: true,
    reason: "controlled_ocr_reasoning_authorized",
    blockingCode: null,
    modelCallAllowed: true,
    noPersistence: true,
    sourceRemainsUntrusted: true,
    highRiskClaimsRemainBlocked: true,
    trace: [...trace, "allowed"],
  };
}
