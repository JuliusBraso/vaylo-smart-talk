import type { SmartTalkLocale } from "../build-smart-talk-prompt";

/**
 * Phase 8.11M — OCR-to-Smart-Talk minimized model-input builder (pure
 * module). Builds ONLY the parameters the existing, already-approved
 * `runSmartTalk()` model path (lib/vaylo/smart-talk/run-smart-talk.ts)
 * accepts, plus a non-sensitive metadata summary for the route's own
 * response transparency. This module does NOT:
 *  - read image bytes
 *  - accept a Blob/File
 *  - read the original filename
 *  - read EXIF, client IP, or any persistence identifier
 *  - call OCR or a model itself
 *  - persist anything
 *
 * `runSmartTalk({ ..., source: "photo_ocr" })` already selects the
 * "strict_document" reasoning protocol (see build-smart-talk-prompt.ts),
 * which already instructs the model that the text was OCR-extracted and may
 * be wrong, forbids inventing unsupported calendar dates/amounts, and — after
 * the model responds — grounds/sanitizes summary, meaning, and every string
 * array field against the original extracted text before returning a result.
 * That existing grounding/sanitization is the reused post-model safety
 * mechanism for this phase; this builder does not duplicate it.
 */

export interface OcrReasoningInputSource {
  extractedText: string;
  sourceKind: string;
  sourceMode: string;
  trustLevel: string;
  sensitivityLevel: string;
  provider: string;
  confidenceAvailable: boolean;
  confidence: number | null;
  qualityStatus: string;
  blockingReasons: readonly string[];
  downgradeReasons: readonly string[];
  ocrWarnings: readonly string[];
  highRiskTokensDetected: readonly string[];
  locale: SmartTalkLocale;
}

export interface OcrReasoningModelCallParams {
  text: string;
  locale: SmartTalkLocale;
  inputType: "text";
  source: "photo_ocr";
}

export interface OcrReasoningModelInputMeta {
  inputKind: "controlled_ocr_reasoning_input";
  sourceKind: string;
  sourceMode: string;
  trustLevel: string;
  sensitivityLevel: string;
  provider: string;
  confidenceAvailable: boolean;
  confidence: number | null;
  qualityStatus: string;
  blockingReasons: readonly string[];
  downgradeReasons: readonly string[];
  ocrWarnings: readonly string[];
  highRiskTokensDetected: readonly string[];
  extractedTextLength: number;
  rawImageIncluded: false;
  originalFileIncluded: false;
  safetyInstructions: readonly string[];
}

/**
 * Mandatory model instructions (informational summary only — the actual
 * enforceable instructions already live in build-smart-talk-prompt.ts's
 * PHOTO_OCR_EPISTEMIC / strict_document system prompt, which is reused as-is
 * and not duplicated here).
 */
const MANDATORY_SAFETY_INSTRUCTIONS: readonly string[] = [
  "OCR text may be wrong.",
  "Do not silently repair uncertain OCR readings.",
  "Clearly flag material uncertainty.",
  "Ask the user to verify the original document.",
  "Do not create an exact legal deadline.",
  "Do not give binding legal advice.",
  "Do not generate an official filing.",
  "Do not authorize a payment instruction.",
  "Do not create verified facts.",
  "Do not write DNA/profile facts.",
  "Treat output as untrusted.",
  "Preserve legal/privacy/OCR warnings.",
];

/** Builds the minimized params passed straight into the existing runSmartTalk(). */
export function buildOcrReasoningModelCallParams(
  source: OcrReasoningInputSource,
): OcrReasoningModelCallParams {
  return {
    text: source.extractedText,
    locale: source.locale,
    inputType: "text",
    source: "photo_ocr",
  };
}

/** Builds a non-sensitive metadata summary for response transparency only. */
export function buildOcrReasoningModelInputMeta(
  source: OcrReasoningInputSource,
): OcrReasoningModelInputMeta {
  return {
    inputKind: "controlled_ocr_reasoning_input",
    sourceKind: source.sourceKind,
    sourceMode: source.sourceMode,
    trustLevel: source.trustLevel,
    sensitivityLevel: source.sensitivityLevel,
    provider: source.provider,
    confidenceAvailable: source.confidenceAvailable,
    confidence: source.confidence,
    qualityStatus: source.qualityStatus,
    blockingReasons: source.blockingReasons,
    downgradeReasons: source.downgradeReasons,
    ocrWarnings: source.ocrWarnings,
    highRiskTokensDetected: source.highRiskTokensDetected,
    extractedTextLength: source.extractedText.length,
    rawImageIncluded: false,
    originalFileIncluded: false,
    safetyInstructions: MANDATORY_SAFETY_INSTRUCTIONS,
  };
}
