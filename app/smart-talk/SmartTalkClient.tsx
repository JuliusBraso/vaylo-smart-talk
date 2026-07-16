"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import type {
  SmartTalkResult,
  SmartTalkConfidenceLevel,
  SmartTalkConsequencePhase,
  SmartTalkDocumentQuality,
} from "@/lib/vaylo/smart-talk/run-smart-talk";
import {
  compressVideoFrameToSmartTalkPhotoFile,
  prepareDocumentPhotoForUpload,
  PrepareDocumentPhotoError,
  SMART_TALK_MAX_GALLERY_PHOTO_BYTES,
} from "@/lib/vaylo/smart-talk/prepare-document-photo-for-upload";

const MAX_TEXT_LENGTH = 12000;
const RECOMMENDED_TEXT_LENGTH = 4000;

/** Smart Talk photo MVP: multi-page scan cap (matches `/api/smart-talk-photo`). */
const SMART_TALK_MAX_PHOTO_PAGES = 3;
const SMART_TALK_MAX_PHOTO_UPLOAD_TOTAL_BYTES = 4 * 1024 * 1024;

type SmartTalkPhotoPage = {
  id: string;
  file: File;
  label: string;
};

function sumPhotoPageBytes(pages: SmartTalkPhotoPage[]): number {
  return pages.reduce((sum, p) => sum + p.file.size, 0);
}

// Phase 8.12E: "first_contact" is a UI-only mode value. It is never sent to
// the API as-is — onFirstContactSubmit below maps it exactly to the route's
// "first_contact_controlled_runtime" mode literal.
type SmartTalkUiMode = "question" | "text" | "photo" | "first_contact";

const PLACEHOLDER: Record<SmartTalkUiMode, string> = {
  question: "Opýtajte sa napríklad: Ako požiadam o Kindergeld v Nemecku?",
  text: "Sem vložte text z listu, úradu alebo formulára…",
  photo: "",
  first_contact:
    "Napíš napríklad: Prvýkrát som sa presťahoval do Nemecka a neviem, čo mám vybaviť ako prvé.",
};

// Phase 8.12E: first_contact intentionally has no value here — its heading
// and supporting text are rendered as a dedicated block (see
// FIRST_CONTACT_ENTRY_SUPPORTING_TEXT below) instead of reusing this shared
// guidance paragraph, so the required heading always appears first.
const GUIDANCE_PRIMARY: Record<SmartTalkUiMode, string> = {
  question:
    "Pýtajte sa na dane, Kindergeld, Anmeldung, zdravotnú poisťovňu, úrady alebo iné nemecké byrokratické kroky.",
  text: "Najlepšie funguje, keď vložíte najdôležitejšiu časť listu alebo formulára.",
  photo:
    "Pridajte až 3 strany dokumentu (poradie zachováme): kamerou alebo viac obrázkov z galérie (JPG/PNG/WebP; max. 8 MB pred úpravou na súbor). Spolu max. 4 MB po úprave. Dobré svetlo zlepší OCR.",
  first_contact: "",
};

const SUBMIT_LABEL: Record<SmartTalkUiMode, string> = {
  question: "Opýtať sa Vayla",
  text: "Vysvetliť text",
  photo: "Analyzovať dokument",
  first_contact: "Zistiť prvý krok",
};

const CONFIDENCE = new Set(["low", "medium", "high"]);
const CONSEQUENCE = new Set(["none", "possible", "conditional", "active"]);
const DOC_QUALITY = new Set(["clear", "noisy", "ocr_damaged", "unknown"]);
const URGENCY = new Set(["low", "medium", "high", "unknown"]);

const DOCUMENT_KIND = new Set([
  "payment_notice",
  "direct_debit_notice",
  "reminder_dunning",
  "official_decision",
  "hearing_procedural",
  "approval_grant",
  "rejection_refusal",
  "informational_status",
  "contribution_or_tax_assessment",
  "demand_repayment",
  "termination",
  "generic_request",
  "unknown",
]);

const DOMAIN = new Set([
  "insurance",
  "health_insurance",
  "tax",
  "social_benefits",
  "residence",
  "municipal",
  "debt_collection",
  "family_benefits",
  "employment",
  "unknown",
]);

const PAYMENT_CHANNEL = new Set([
  "sepa_direct_debit",
  "manual_transfer",
  "unclear",
  "not_applicable",
]);

const PROCEDURAL_STATE = new Set([
  "informational",
  "action_required",
  "response_possible",
  "decision_issued",
  "payment_required",
  "deadline_active",
  "unknown",
]);

const LEGAL_SEVERITY = new Set(["none", "low", "medium", "high", "critical"]);

function parseStabilizersClient(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().slice(0, 400);
    if (s) out.push(s);
    if (out.length >= 2) break;
  }
  return out;
}

function parseStringListClient(raw: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().slice(0, maxLen);
    if (s) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

type SmartTalkOkResponse = {
  ok: true;
  mode: string;
  context: string;
  result: SmartTalkResult;
  /** Present when `/api/smart-talk-photo` substituted OCR placeholders for one or more pages. */
  partialOcr?: boolean;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object";
}

/**
 * Phase 8.11C: safe display-only shape for the internal Real OCR extraction
 * test button. Deliberately does NOT carry the full extracted text — only
 * a capped preview and length, matching what the operator is allowed to see
 * (see SmartTalkClient result panel below). Never persisted client-side.
 */
type RealOcrUiResult = {
  ok: boolean;
  code?: string;
  extractedTextLength?: number;
  extractedTextPreview?: string;
  qualityStatus?: "blocked" | "low" | "medium" | "usable";
  blockingReasons?: string[];
  downgradeReasons?: string[];
};

const REAL_OCR_QUALITY_STATUSES = new Set(["blocked", "low", "medium", "usable"]);

function parseRealOcrResponse(data: unknown): RealOcrUiResult | null {
  if (!isRecord(data)) return null;

  if (data.ok === true) {
    const ocrResult = isRecord(data.ocrResult) ? data.ocrResult : null;
    const quality = isRecord(data.quality) ? data.quality : null;
    if (!ocrResult || !quality) return null;

    const blockingReasons = Array.isArray(quality.blockingReasons)
      ? quality.blockingReasons.filter((x): x is string => typeof x === "string")
      : [];
    const downgradeReasons = Array.isArray(quality.downgradeReasons)
      ? quality.downgradeReasons.filter((x): x is string => typeof x === "string")
      : [];
    const qualityStatusRaw = typeof quality.status === "string" ? quality.status : "blocked";
    const qualityStatus = (
      REAL_OCR_QUALITY_STATUSES.has(qualityStatusRaw) ? qualityStatusRaw : "blocked"
    ) as RealOcrUiResult["qualityStatus"];

    return {
      ok: true,
      extractedTextLength:
        typeof ocrResult.extractedTextLength === "number" ? ocrResult.extractedTextLength : 0,
      extractedTextPreview:
        typeof ocrResult.extractedTextPreview === "string" ? ocrResult.extractedTextPreview : "",
      qualityStatus,
      blockingReasons,
      downgradeReasons,
    };
  }

  if (data.ok === false) {
    const code = typeof data.code === "string" ? data.code : "real_ocr_extraction_failed";
    const quality = isRecord(data.quality) ? data.quality : null;
    const blockingReasons =
      quality && Array.isArray(quality.blockingReasons)
        ? quality.blockingReasons.filter((x): x is string => typeof x === "string")
        : [];
    return { ok: false, code, blockingReasons };
  }

  return null;
}

/** Slovak UX for the internal Phase 8.11C Real OCR extraction test button. */
function messageForRealOcrCode(code: string | undefined): string {
  switch (code) {
    case "real_ocr_extraction_disabled":
      return "Reálna OCR extrakcia je momentálne vypnutá (interný kontrolovaný test).";
    case "real_ocr_unsupported_mime":
      return "Nepodporovaný typ súboru. Použite JPG, PNG alebo WebP.";
    case "real_ocr_missing_image":
      return "Vyberte platný obrázok na test.";
    case "real_ocr_file_too_large":
      return "Súbor je príliš veľký. Maximálna veľkosť je 8 MB.";
    case "real_ocr_multiple_pages_blocked":
      return "Tento interný test podporuje iba jednu stranu.";
    case "real_ocr_invalid_content_type":
      return "Neplatný formát požiadavky pre interný test.";
    case "real_ocr_timeout":
      return "Rozpoznávanie textu trvalo príliš dlho. Skúste to znova.";
    case "real_ocr_provider_error":
      return "OCR modul zlyhal pri spracovaní obrázka.";
    case "real_ocr_empty_extraction":
      return "Z obrázka sa nepodarilo rozpoznať žiadny text.";
    case "real_ocr_quality_blocked":
      return "Rozpoznaný text nemá dostatočnú kvalitu na ďalšie spracovanie.";
    default:
      return "Interný test Real OCR extraction zlyhal. Skúste to znova.";
  }
}

/**
 * Minimal, non-sensitive parsed shape for the Phase 8.11I internal
 * "OCR → Smart Talk" handoff envelope test button. Deliberately does NOT
 * carry the full extracted text — only a capped preview and length, and
 * never the raw image. Never persisted client-side. Smart Talk reasoning is
 * never invoked by this branch in 8.11I (smartTalkResult is always null on
 * the server), so there is no result to route into the main explanation
 * flow here.
 */
type OcrHandoffUiResult = {
  ok: boolean;
  code?: string;
  qualityStatus?: "blocked" | "low" | "medium" | "usable";
  handoffAllowed?: boolean;
  handoffPerformed?: boolean;
  handoffReason?: string;
  extractedTextLength?: number;
  extractedTextPreview?: string;
  ocrWarnings?: string[];
  warnings?: string[];
  highRiskTokensDetected?: string[];
  blockingReasons?: string[];
  downgradeReasons?: string[];
  /**
   * Phase 8.11P: present only when the request explicitly selected the
   * internal controlled-reasoning operation (see
   * handleOcrToSmartTalkHandoffSubmit below) AND the server performed
   * reasoning. Never inferred client-side — mirrors exactly what the
   * committed route reports in `reasoning.performed`/`reasoning.reason`/
   * `reasoning.modelInvocation.modelCallCount`.
   */
  reasoningPerformed?: boolean;
  reasoningReason?: string;
  modelCallCount?: number;
  /** Only non-null when reasoningPerformed is true. */
  smartTalkResult?: SmartTalkResult | null;
};

function parseOcrHandoffResponse(data: unknown): OcrHandoffUiResult | null {
  if (!isRecord(data)) return null;

  if (data.ok === true) {
    const ocrResult = isRecord(data.ocrResult) ? data.ocrResult : null;
    const handoff = isRecord(data.handoff) ? data.handoff : null;
    if (!ocrResult || !handoff) return null;

    const qualityStatusRaw = typeof handoff.qualityStatus === "string" ? handoff.qualityStatus : "blocked";
    const qualityStatus = (
      REAL_OCR_QUALITY_STATUSES.has(qualityStatusRaw) ? qualityStatusRaw : "blocked"
    ) as OcrHandoffUiResult["qualityStatus"];

    const ocrWarnings = Array.isArray(handoff.ocrWarnings)
      ? handoff.ocrWarnings.filter((x): x is string => typeof x === "string")
      : [];
    const warnings = Array.isArray(data.warnings)
      ? data.warnings.filter((x): x is string => typeof x === "string")
      : [];
    const highRiskTokensDetected = Array.isArray(handoff.highRiskTokensDetected)
      ? handoff.highRiskTokensDetected.filter((x): x is string => typeof x === "string")
      : [];
    const blockingReasons = Array.isArray(handoff.blockingReasons)
      ? handoff.blockingReasons.filter((x): x is string => typeof x === "string")
      : [];
    const downgradeReasons = Array.isArray(handoff.downgradeReasons)
      ? handoff.downgradeReasons.filter((x): x is string => typeof x === "string")
      : [];

    // Phase 8.11P: only present when the caller requested the controlled
    // reasoning operation and the route actually ran it — completely absent
    // (undefined) for the unmodified 8.11I/8.11K envelope-only response.
    const reasoning = isRecord(data.reasoning) ? data.reasoning : null;
    const reasoningPerformed = reasoning?.performed === true;
    const reasoningReason =
      reasoning && typeof reasoning.reason === "string" ? reasoning.reason : undefined;
    const modelInvocation =
      reasoning && isRecord(reasoning.modelInvocation) ? reasoning.modelInvocation : null;
    const modelCallCount =
      modelInvocation && typeof modelInvocation.modelCallCount === "number"
        ? modelInvocation.modelCallCount
        : undefined;
    const smartTalkResult = reasoningPerformed
      ? parseSmartTalkResultObject(data.smartTalkResult)
      : null;

    return {
      ok: true,
      qualityStatus,
      handoffAllowed: handoff.allowed === true,
      handoffPerformed: handoff.performed === true,
      handoffReason: typeof handoff.reason === "string" ? handoff.reason : "",
      extractedTextLength:
        typeof ocrResult.extractedTextLength === "number" ? ocrResult.extractedTextLength : 0,
      extractedTextPreview:
        typeof ocrResult.extractedTextPreview === "string" ? ocrResult.extractedTextPreview : "",
      ocrWarnings,
      warnings,
      highRiskTokensDetected,
      blockingReasons,
      downgradeReasons,
      reasoningPerformed,
      reasoningReason,
      modelCallCount,
      smartTalkResult,
    };
  }

  if (data.ok === false) {
    const code = typeof data.code === "string" ? data.code : "ocr_to_smart_talk_handoff_failed";
    const quality = isRecord(data.quality) ? data.quality : null;
    const blockingReasons =
      quality && Array.isArray(quality.blockingReasons)
        ? quality.blockingReasons.filter((x): x is string => typeof x === "string")
        : [];
    return { ok: false, code, blockingReasons };
  }

  return null;
}

/** Slovak UX for the internal Phase 8.11I OCR → Smart Talk handoff test button. */
function messageForOcrHandoffCode(code: string | undefined): string {
  switch (code) {
    case "ocr_to_smart_talk_handoff_disabled":
      return "Odovzdanie OCR textu do Smart Talk je momentálne vypnuté (interný kontrolovaný test).";
    case "real_ocr_extraction_required_for_handoff":
      return "Reálna OCR extrakcia musí byť povolená, aby bolo možné odovzdanie textu.";
    case "ocr_quality_not_usable_for_handoff":
      return "Rozpoznaný text nemá dostatočnú kvalitu na odovzdanie do Smart Talk.";
    case "ocr_to_smart_talk_handoff_missing_image":
      return "Vyberte platný obrázok na test.";
    case "ocr_to_smart_talk_handoff_unsupported_mime":
      return "Nepodporovaný typ súboru. Použite JPG, PNG alebo WebP.";
    case "ocr_to_smart_talk_handoff_file_too_large":
      return "Súbor je príliš veľký. Maximálna veľkosť je 8 MB.";
    case "ocr_to_smart_talk_handoff_page_count_required":
    case "ocr_to_smart_talk_handoff_single_image_required":
      return "Tento interný test podporuje iba jednu stranu.";
    case "ocr_to_smart_talk_handoff_invalid_content_type":
      return "Neplatný formát požiadavky pre interný test.";
    case "ocr_to_smart_talk_handoff_timeout":
      return "Rozpoznávanie textu trvalo príliš dlho. Skúste to znova.";
    case "ocr_to_smart_talk_handoff_provider_error":
      return "OCR modul zlyhal pri spracovaní obrázka.";
    case "ocr_to_smart_talk_handoff_empty_extraction":
      return "Z obrázka sa nepodarilo rozpoznať žiadny text.";
    // Phase 8.11P — internal controlled-reasoning operation failure codes.
    case "ocr_controlled_reasoning_disabled":
      return "Interné riadené vysvetlenie (OCR → Smart Talk) je momentálne vypnuté (kontrolovaný test).";
    case "handoff_required_for_reasoning":
    case "real_ocr_required_for_reasoning":
      return "Predpoklady pre riadené vysvetlenie nie sú momentálne splnené (kontrolovaný test).";
    case "ocr_quality_not_usable_for_reasoning":
    case "ocr_blocking_reasons_present":
    case "ocr_trust_metadata_missing":
    case "evidence_gate_rejected_ocr_reasoning":
      return "Rozpoznaný text nespĺňa podmienky na riadené vysvetlenie (kontrolovaný test).";
    case "ocr_reasoning_timeout":
      return "Riadené vysvetlenie trvalo príliš dlho. Skúste to znova.";
    case "ocr_reasoning_model_error":
    case "ocr_reasoning_internal_error":
    case "ocr_reasoning_trap_rejected":
      return "Riadené vysvetlenie zlyhalo (kontrolovaný test). Skúste to znova.";
    default:
      return "Interný test OCR → Smart Talk zlyhal. Skúste to znova.";
  }
}

/**
 * Phase 8.11P: extracted from parseSmartTalkResponse's inline result-parsing
 * so the internal controlled-reasoning test button (see below) can reuse the
 * exact same validated `SmartTalkResult` shape — and, in the JSX, the exact
 * same result-rendering sections — as the main envelope-only/text/question
 * flows below, without duplicating either the parsing or the rendering.
 */
function parseSmartTalkResultObject(result: unknown): SmartTalkResult | null {
  if (!isRecord(result)) return null;

  const summary = typeof result.summary === "string" ? result.summary : "";
  const meaning = typeof result.meaning === "string" ? result.meaning : "";
  const urgencyRaw = typeof result.urgency === "string" ? result.urgency : "unknown";
  const urgency = URGENCY.has(urgencyRaw) ? urgencyRaw : "unknown";

  const nextSteps: string[] = [];
  if (Array.isArray(result.nextSteps)) {
    for (const item of result.nextSteps) {
      if (typeof item === "string" && item.trim()) nextSteps.push(item);
    }
  }

  const warnings: string[] = [];
  if (Array.isArray(result.warnings)) {
    for (const item of result.warnings) {
      if (typeof item === "string" && item.trim()) warnings.push(item);
    }
  }

  const stabilizers = parseStabilizersClient(result.stabilizers);

  const confidenceRaw =
    typeof result.confidenceLevel === "string" ? result.confidenceLevel : "medium";
  const confidenceLevel: SmartTalkConfidenceLevel = CONFIDENCE.has(confidenceRaw)
    ? (confidenceRaw as SmartTalkConfidenceLevel)
    : "medium";

  const consequenceRaw =
    typeof result.consequencePhase === "string" ? result.consequencePhase : "possible";
  const consequencePhase: SmartTalkConsequencePhase = CONSEQUENCE.has(consequenceRaw)
    ? (consequenceRaw as SmartTalkConsequencePhase)
    : "possible";

  const docQualityRaw =
    typeof result.documentQuality === "string" ? result.documentQuality : "unknown";
  const documentQuality: SmartTalkDocumentQuality = DOC_QUALITY.has(docQualityRaw)
    ? (docQualityRaw as SmartTalkDocumentQuality)
    : "unknown";

  const documentKindRaw =
    typeof result.documentKind === "string" ? result.documentKind : "unknown";
  const documentKind: SmartTalkResult["documentKind"] = DOCUMENT_KIND.has(documentKindRaw)
    ? (documentKindRaw as SmartTalkResult["documentKind"])
    : "unknown";

  const domainRaw = typeof result.domain === "string" ? result.domain : "unknown";
  const domain: SmartTalkResult["domain"] = DOMAIN.has(domainRaw)
    ? (domainRaw as SmartTalkResult["domain"])
    : "unknown";

  const documentTypeLabel =
    typeof result.documentTypeLabel === "string"
      ? result.documentTypeLabel.trim().slice(0, 200)
      : "";

  const paymentChannelRaw =
    typeof result.paymentChannel === "string" ? result.paymentChannel : "not_applicable";
  const paymentChannel: SmartTalkResult["paymentChannel"] = PAYMENT_CHANNEL.has(
    paymentChannelRaw,
  )
    ? (paymentChannelRaw as SmartTalkResult["paymentChannel"])
    : "not_applicable";

  const proceduralRaw =
    typeof result.proceduralState === "string" ? result.proceduralState : "unknown";
  const proceduralState: SmartTalkResult["proceduralState"] =
    PROCEDURAL_STATE.has(proceduralRaw)
      ? (proceduralRaw as SmartTalkResult["proceduralState"])
      : "unknown";

  const severityRaw =
    typeof result.legalSeverity === "string" ? result.legalSeverity : "none";
  const legalSeverity: SmartTalkResult["legalSeverity"] = LEGAL_SEVERITY.has(
    severityRaw,
  )
    ? (severityRaw as SmartTalkResult["legalSeverity"])
    : "none";

  const deadlines = parseStringListClient(result.deadlines, 12, 400);
  const rights = parseStringListClient(result.rights, 10, 400);
  const obligations = parseStringListClient(result.obligations, 10, 400);
  const consequences = parseStringListClient(result.consequences, 10, 400);

  return {
    summary,
    meaning,
    urgency: urgency as SmartTalkResult["urgency"],
    nextSteps,
    warnings,
    stabilizers,
    confidenceLevel,
    consequencePhase,
    documentQuality,
    documentKind,
    domain,
    documentTypeLabel,
    paymentChannel,
    proceduralState,
    legalSeverity,
    deadlines,
    rights,
    obligations,
    consequences,
  };
}

function parseSmartTalkResponse(data: unknown): SmartTalkOkResponse | null {
  if (!isRecord(data) || data.ok !== true) return null;
  if (typeof data.mode !== "string" || typeof data.context !== "string") return null;
  const parsedResult = parseSmartTalkResultObject(data.result);
  if (!parsedResult) return null;

  return {
    ok: true,
    mode: data.mode,
    context: data.context,
    result: parsedResult,
    partialOcr: data.partialOcr === true,
  };
}

// ── Phase 8.12E — First Contact ("Prvý kontakt") minimal UI types ──────────
// Deliberately NOT imported from lib/vaylo/smart-talk/first-contact/* — the
// scenario allowlist and presentation shape are duplicated here as small,
// bounded, defensively-parsed literals so this client component stays fully
// decoupled from those server-side modules (mirrors the existing pattern of
// only ever importing `SmartTalkResult`'s *type* from run-smart-talk.ts).
// These identifiers/labels must stay in sync with
// lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts
// (FIRST_CONTACT_SCENARIOS) — never renamed or translated when sent to the
// server.
type FirstContactScenarioId =
  | "first_job"
  | "first_housing"
  | "first_official_letter"
  | "health_insurance"
  | "taxes_or_tax_id"
  | "education_or_training"
  | "moving_or_registration"
  | "family_administration"
  | "residence_or_work"
  | "other";

const FIRST_CONTACT_SCENARIO_OPTIONS: ReadonlyArray<{
  id: FirstContactScenarioId;
  label: string;
}> = [
  { id: "first_job", label: "Prvá práca alebo brigáda" },
  { id: "first_housing", label: "Prvé bývanie alebo nájom" },
  { id: "first_official_letter", label: "Prvý list od úradu" },
  { id: "health_insurance", label: "Zdravotné poistenie" },
  { id: "taxes_or_tax_id", label: "Dane alebo Steuer-ID" },
  { id: "education_or_training", label: "Škola, Ausbildung alebo BAföG" },
  { id: "moving_or_registration", label: "Sťahovanie alebo Anmeldung" },
  { id: "family_administration", label: "Rodina alebo deti" },
  { id: "residence_or_work", label: "Pobyt alebo práca" },
  { id: "other", label: "Iná situácia" },
];

const FIRST_CONTACT_ENTRY_HEADING = "Čo riešiš prvýkrát?";
const FIRST_CONTACT_ENTRY_SUPPORTING_TEXT =
  "Opíš situáciu vlastnými slovami. Nemusíš poznať názov úradu ani formulára.";

/** Bounded, defensively-parsed mirror of `FirstContactPresentation` (server-owned shape). */
type FirstContactPresentationUi = {
  presentationVersion: string;
  situationSummary: string;
  firstStep: { action: string; boundary: string };
  preparationItems: { label: string; requirementLevel: string }[];
  canWait: string[] | null;
  helpBoundary: { level: string; reason: string | null };
  evidenceLimitations: string[];
  trustLevel: string;
};

type FirstContactRecommendedModeUi =
  | "text_document_controlled_runtime"
  | "photo_ocr_controlled_runtime"
  | null;

function isFirstContactRecommendedMode(v: unknown): v is FirstContactRecommendedModeUi {
  return (
    v === "text_document_controlled_runtime" || v === "photo_ocr_controlled_runtime" || v === null
  );
}

function parseFirstContactPresentation(data: unknown): FirstContactPresentationUi | null {
  if (!isRecord(data)) return null;
  if (typeof data.situationSummary !== "string" || !data.situationSummary.trim()) return null;

  const firstStepRaw = isRecord(data.firstStep) ? data.firstStep : null;
  if (!firstStepRaw || typeof firstStepRaw.action !== "string" || !firstStepRaw.action.trim()) {
    return null;
  }

  const helpBoundaryRaw = isRecord(data.helpBoundary) ? data.helpBoundary : null;
  if (!helpBoundaryRaw || typeof helpBoundaryRaw.level !== "string") return null;

  const preparationItems = Array.isArray(data.preparationItems)
    ? data.preparationItems
        .filter(isRecord)
        .filter((item) => typeof item.label === "string" && item.label.trim().length > 0)
        .slice(0, 6)
        .map((item) => ({
          label: (item.label as string).trim(),
          requirementLevel:
            typeof item.requirementLevel === "string" ? item.requirementLevel : "requires_verification",
        }))
    : [];

  const canWaitRaw = Array.isArray(data.canWait)
    ? data.canWait.filter((x): x is string => typeof x === "string" && x.trim().length > 0).slice(0, 4)
    : null;

  const evidenceLimitations = Array.isArray(data.evidenceLimitations)
    ? data.evidenceLimitations
        .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        .slice(0, 6)
    : [];

  return {
    presentationVersion: typeof data.presentationVersion === "string" ? data.presentationVersion : "v1",
    situationSummary: data.situationSummary.trim(),
    firstStep: {
      action: firstStepRaw.action.trim(),
      boundary: typeof firstStepRaw.boundary === "string" ? firstStepRaw.boundary : "orientation",
    },
    preparationItems,
    canWait: canWaitRaw && canWaitRaw.length > 0 ? canWaitRaw : null,
    helpBoundary: {
      level: helpBoundaryRaw.level,
      reason:
        typeof helpBoundaryRaw.reason === "string" && helpBoundaryRaw.reason.trim().length > 0
          ? helpBoundaryRaw.reason.trim()
          : null,
    },
    evidenceLimitations,
    trustLevel: typeof data.trustLevel === "string" ? data.trustLevel : "untrusted",
  };
}

type FirstContactOkResponse = {
  ok: true;
  mode: string;
  context: { locale: string; market: string; scenario: string | null };
  result: SmartTalkResult;
  firstContactMeta: FirstContactPresentationUi;
};

function parseFirstContactResponse(data: unknown): FirstContactOkResponse | null {
  if (!isRecord(data) || data.ok !== true) return null;
  if (typeof data.mode !== "string") return null;
  const parsedResult = parseSmartTalkResultObject(data.result);
  if (!parsedResult) return null;
  const meta = parseFirstContactPresentation(data.firstContactMeta);
  if (!meta) return null;

  const contextRaw = isRecord(data.context) ? data.context : {};
  return {
    ok: true,
    mode: data.mode,
    context: {
      locale: typeof contextRaw.locale === "string" ? contextRaw.locale : "sk",
      market: typeof contextRaw.market === "string" ? contextRaw.market : "DE",
      scenario: typeof contextRaw.scenario === "string" ? contextRaw.scenario : null,
    },
    result: parsedResult,
    firstContactMeta: meta,
  };
}

function readFirstContactErrorInfo(data: unknown): {
  code: string | null;
  recommendedMode: FirstContactRecommendedModeUi;
} {
  if (!isRecord(data) || data.ok !== false) return { code: null, recommendedMode: null };
  const code =
    typeof data.code === "string" ? data.code : typeof data.error === "string" ? data.error : null;
  const recommendedMode = isFirstContactRecommendedMode(data.recommendedMode)
    ? data.recommendedMode
    : null;
  return { code, recommendedMode };
}

/** Slovak UX for First Contact error codes. Never exposes env flag names,
 * stack traces, filesystem paths, or provider details. */
function messageForFirstContactCode(code: string | null, status: number): string {
  switch (code) {
    case "first_contact_mode_disabled":
      return "Režim Prvý kontakt momentálne nie je dostupný.";
    case "first_contact_input_too_short":
      return "Text je príliš krátky. Opíš situáciu aspoň v jednej krátkej vete.";
    case "first_contact_input_too_long":
      return "Text je príliš dlhý. Skráť ho na maximálne 12 000 znakov.";
    case "first_contact_locale_unsupported":
      return "Tento jazyk momentálne Prvý kontakt nepodporuje.";
    case "first_contact_market_unsupported":
      return "Prvý kontakt momentálne podporuje iba Nemecko.";
    case "first_contact_scenario_unsupported":
      return "Vybraná kategória situácie momentálne nie je podporovaná.";
    case "first_contact_document_mode_required":
      return "Táto požiadavka sa týka konkrétneho textu dokumentu. Použi režim Vysvetliť text.";
    case "first_contact_photo_ocr_mode_required":
      return "Na vysvetlenie fotografie dokumentu použi režim Odfotiť dokument.";
    case "first_contact_paid_document_boundary":
      return "Táto požiadavka sa týka konkrétneho dokumentu a nie je súčasťou režimu Prvý kontakt.";
    case "first_contact_persistence_forbidden":
      return "Prvý kontakt neukladá dáta. Skús to znova bez požiadavky na uloženie.";
    case "first_contact_presentation_invalid":
      return "Odpoveď sa nepodarilo bezpečne pripraviť. Skús to znova.";
    case "invalid_text":
      return MSG.badInput;
    case "smart_talk_rate_limited":
      return MSG.rateLimited;
    case "smart_talk_unavailable":
      return MSG.unavailable;
    case "smart_talk_timeout":
      return MSG.timeout;
    default:
      return messageForStatus(status);
  }
}

function firstContactPreparationLabel(level: string): string {
  switch (level) {
    case "likely_helpful":
      return "Pravdepodobne užitočné";
    case "may_be_required":
      return "Môže byť potrebné";
    case "requires_verification":
    default:
      return "Treba overiť";
  }
}

function firstContactFirstStepBoundaryLabel(boundary: string): string {
  switch (boundary) {
    case "verification":
      return "Najskôr over";
    case "official_contact":
      return "Kontaktuj oficiálne miesto";
    case "professional_help":
      return "Vyhľadaj odbornú pomoc";
    case "emergency_help":
      return "Vyhľadaj okamžitú pomoc";
    case "orientation":
    default:
      return "Prvý orientačný krok";
  }
}

function firstContactHelpBoundaryLabel(level: string): string {
  switch (level) {
    case "official":
      return "Over na úrade alebo oficiálnom mieste";
    case "professional":
      return "Vyhľadaj odbornú pomoc";
    case "emergency":
      return "Vyhľadaj okamžitú pomoc";
    case "none":
    default:
      return "Bez špecifickej potreby pomoci";
  }
}

function firstContactBoundaryIsProminent(boundary: string): boolean {
  return boundary === "professional_help" || boundary === "emergency_help";
}

function firstContactHelpLevelIsProminent(level: string): boolean {
  return level === "professional" || level === "emergency";
}

const PROMINENT_CARD_STYLE: CSSProperties = {
  border: "1px solid rgba(251, 191, 36, 0.95)",
  background: "rgba(255, 247, 237, 1)",
};

/**
 * Phase 8.12E: First-Contact-only additive presentation cards. Deliberately
 * does NOT re-render `result.warnings` (already shown by
 * `renderSmartTalkResultCards` above it) — only the bounded
 * `FirstContactPresentation` fields not already covered by the shared
 * SmartTalkResult cards. `canWait` is never rendered when null; empty
 * arrays never produce empty cards; the help-boundary card is omitted
 * entirely when its level is "none" (nothing to show).
 */
function renderFirstContactPresentationCards(meta: FirstContactPresentationUi, result: SmartTalkResult) {
  const highOrUnknownRisk = result.urgency === "high" || result.urgency === "unknown";
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {highOrUnknownRisk ? (
        <section style={{ ...RESULT_CARD, ...PROMINENT_CARD_STYLE }}>
          <h2 style={sectionTitleStyle()}>Dôležité upozornenie</h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.6,
              fontWeight: 700,
              color: "rgba(124, 45, 18, 0.94)",
            }}
          >
            {result.warnings.find((w) => w.trim().length > 0) ??
              meta.helpBoundary.reason ??
              "Táto situácia môže byť naliehavá alebo neistá. Over ju čo najskôr na oficiálnom mieste."}
          </p>
        </section>
      ) : null}

      <section style={RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Čo to pre teba znamená</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>
          {meta.situationSummary}
        </p>
      </section>

      <section style={firstContactBoundaryIsProminent(meta.firstStep.boundary) ? { ...RESULT_CARD, ...PROMINENT_CARD_STYLE } : RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Čo urob ako prvé</h2>
        <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 800, color: "var(--muted2)" }}>
          {firstContactFirstStepBoundaryLabel(meta.firstStep.boundary)}
        </p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>
          {meta.firstStep.action}
        </p>
      </section>

      {meta.preparationItems.length > 0 ? (
        <section style={RESULT_CARD}>
          <h2 style={sectionTitleStyle()}>Čo si priprav</h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 0,
              listStyle: "none",
              display: "grid",
              gap: 10,
            }}
          >
            {meta.preparationItems.map((item, i) => (
              <li key={i} style={{ display: "grid", gap: 4 }}>
                <span
                  style={{
                    ...BADGE_BASE,
                    width: "fit-content",
                    fontSize: 11,
                    border: "1px solid var(--border)",
                    background: "rgba(248, 250, 252, 1)",
                    color: "var(--muted2)",
                  }}
                >
                  {firstContactPreparationLabel(item.requirementLevel)}
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text)" }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {meta.canWait !== null ? (
        <section style={RESULT_CARD}>
          <h2 style={sectionTitleStyle()}>Čo môže počkať</h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 22,
              fontSize: 14,
              lineHeight: 1.65,
              color: "var(--text)",
              display: "grid",
              gap: 8,
              listStyleType: "disc",
            }}
          >
            {meta.canWait.map((item, i) => (
              <li key={i} style={{ paddingLeft: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {meta.helpBoundary.level !== "none" ? (
        <section
          style={
            firstContactHelpLevelIsProminent(meta.helpBoundary.level)
              ? { ...RESULT_CARD, ...PROMINENT_CARD_STYLE }
              : RESULT_CARD
          }
        >
          <h2 style={sectionTitleStyle()}>Kde potrebuješ pomoc</h2>
          <p style={{ margin: meta.helpBoundary.reason ? "0 0 6px" : 0, fontSize: 14, fontWeight: 800, color: "var(--text)" }}>
            {firstContactHelpBoundaryLabel(meta.helpBoundary.level)}
          </p>
          {meta.helpBoundary.reason ? (
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--muted)" }}>
              {meta.helpBoundary.reason}
            </p>
          ) : null}
        </section>
      ) : null}

      {meta.evidenceLimitations.length > 0 ? (
        <section style={RESULT_CARD}>
          <h2 style={sectionTitleStyle()}>Obmedzenia vysvetlenia</h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 22,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--muted)",
              display: "grid",
              gap: 6,
              listStyleType: "disc",
            }}
          >
            {meta.evidenceLimitations.map((item, i) => (
              <li key={i} style={{ paddingLeft: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section style={{ ...RESULT_CARD, background: "rgba(248, 250, 252, 1)" }}>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: "var(--muted2)" }}>
          Toto je len orientačná informácia, nie je to právne poradenstvo a nebolo to overené
          úradom. Text sa v tomto režime neukladá — vždy si over podrobnosti na oficiálnom mieste
          alebo skontroluj originálny dokument.
        </p>
      </section>
    </div>
  );
}
// ── End Phase 8.12E First Contact minimal UI types ──────────────────────────

const MSG = {
  badInput:
    "Text je príliš krátky alebo neplatný. Skúste vložiť časť listu alebo formulára.",
  rateLimited: "Príliš veľa pokusov. Skúste to znova neskôr.",
  unavailable: "Služba Smart Talk momentálne nie je dostupná.",
  timeout: "Vysvetlenie trvalo príliš dlho. Skúste kratší text alebo to skúste znova.",
  fallback: "Nepodarilo sa vysvetliť text. Skúste to znova.",
  photoPrepareTimeout:
    "Príprava fotografie trvala príliš dlho. Skúste menší súbor alebo to znova neskôr.",
  photoFetchTimeout:
    "Odoslanie alebo spracovanie fotografie trvalo príliš dlho. Skúste to znova neskôr.",
  photoPrepareFailed:
    "Nepodarilo sa pripraviť fotografiu na odoslanie. Skúste iný súbor alebo znížte rozlíšenie.",
  photoGalleryTooLarge:
    "Súbor z galérie je príliš veľký (nad 8 MB). Vyberte menší obrázok.",
  photoOutputTooLarge:
    "Aj po zmenšení je súbor príliš veľký. Skúste inú fotografiu s nižším rozlíšením.",
  cameraOpening: "Otváram kameru…",
  cameraDenied:
    "Kamera nebola povolená. Môžete vybrať obrázok z galérie.",
  cameraUnavailable:
    "Kamera nie je v tomto prehliadači dostupná. Skúste vybrať obrázok z galérie.",
  cameraFailed: "Nepodarilo sa otvoriť kameru.",
  cameraVideoPreparing: "Kamera sa ešte pripravuje…",
  photoHeicNotSupported:
    "Fotky vo formáte HEIC/HEIF zatiaľ nie sú podporované. Prosím použite kameru vo Vaylo alebo vyberte JPG/PNG obrázok.",
  photoReadyForAnalysis: "Fotografia pripravená na analýzu.",
  photoProcessingDoc: "Spracovávam dokument…",
  photoTotalTooLarge:
    "Súčet veľkosti strán po úprave presahuje 4 MB. Odstráňte stranu alebo použite menšie obrázky.",
  photoPartialOcrNotice:
    "OCR jednej strany sa nepodarilo úplne spracovať — výsledok môže byť neúplný.",
} as const;

const PHOTO_PREPARE_TIMEOUT_MS = 55_000;
const PHOTO_FETCH_TIMEOUT_MS = 115_000;

function messageForPreparePhotoError(err: unknown): string {
  if (err instanceof PrepareDocumentPhotoError) {
    if (err.code === "input_too_large") return MSG.photoGalleryTooLarge;
    if (err.code === "output_too_large") return MSG.photoOutputTooLarge;
    if (err.code === "video_not_ready") return MSG.photoPrepareFailed;
    return MSG.photoPrepareFailed;
  }
  if (err instanceof Error && err.message === "smart_talk_prepare_timeout") {
    return MSG.photoPrepareTimeout;
  }
  return MSG.photoPrepareFailed;
}

function readApiErrorCode(data: unknown): string | null {
  if (!isRecord(data) || data.ok !== false) return null;
  const e = data.error;
  return typeof e === "string" ? e : null;
}

/** Slovak UX for /api/smart-talk-photo (and shared OpenAI errors). */
function messageForPhotoError(errorCode: string | null, httpStatus: number): string {
  if (errorCode === "invalid_file_type") {
    return "Nepodporovaný typ súboru. Použite JPG, PNG alebo WebP.";
  }
  if (errorCode === "file_too_large") {
    return "Súbor je príliš veľký. Maximálna veľkosť je 4 MB.";
  }
  if (errorCode === "smart_talk_photo_extraction_failed") {
    return "Nepodarilo sa rozpoznať text na fotografii. Skúste lepšie osvetlenie alebo ostrejšiu snímku.";
  }
  if (
    errorCode === "missing_file" ||
    errorCode === "missing_files" ||
    errorCode === "invalid_form_data"
  ) {
    return "Vyberte platnú fotografiu dokumentu.";
  }
  if (errorCode === "too_many_files") {
    return "Maximálne 3 strany naraz. Odstráňte prebytočné strany.";
  }
  if (errorCode === "total_upload_too_large") {
    return MSG.photoTotalTooLarge;
  }
  if (errorCode === "smart_talk_photo_rate_limited") {
    return "Príliš veľa fotografií v krátkom čase. Skúste to znova neskôr.";
  }
  if (errorCode === "smart_talk_unavailable") {
    return MSG.unavailable;
  }
  if (
    errorCode === "smart_talk_photo_timeout" ||
    errorCode === "smart_talk_timeout" ||
    httpStatus === 504
  ) {
    return "Spracovanie fotografie trvalo príliš dlho. Skúste menší súbor alebo to znova neskôr.";
  }
  if (httpStatus === 500) {
    return "Chyba servera pri spracovaní fotografie. Skúste to znova neskôr.";
  }
  if (httpStatus === 400) {
    return "Neplatná požiadavka. Skontrolujte fotografiu.";
  }
  return MSG.fallback;
}

function messageForStatus(status: number): string {
  if (status === 400) return MSG.badInput;
  if (status === 429) return MSG.rateLimited;
  if (status === 503) return MSG.unavailable;
  if (status === 504) return MSG.timeout;
  return MSG.fallback;
}

const BADGE_BASE: CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: "var(--r999)",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const URGENCY_BADGE_STYLE: Record<string, CSSProperties> = {
  low: {
    border: "1px solid rgba(167, 243, 208, 1)",
    background: "rgba(236, 253, 245, 1)",
    color: "rgba(6, 95, 70, 0.92)",
  },
  medium: {
    border: "1px solid rgba(253, 224, 71, 0.95)",
    background: "rgba(254, 252, 232, 1)",
    color: "rgba(113, 63, 18, 0.94)",
  },
  high: {
    border: "1px solid rgba(251, 191, 36, 0.95)",
    background: "rgba(255, 247, 237, 1)",
    color: "rgba(124, 45, 18, 0.94)",
  },
  unknown: {
    border: "1px solid var(--border)",
    background: "rgba(248, 250, 252, 1)",
    color: "var(--muted2)",
  },
};

const URGENCY_BADGE_LABEL: Record<string, string> = {
  low: "Nízka",
  medium: "Stredná",
  high: "Vysoká",
  unknown: "Neznáma",
};

function urgencyBadgeFor(raw: string): { label: string; pillStyle: CSSProperties } {
  const tier =
    raw === "low" || raw === "medium" || raw === "high" || raw === "unknown" ? raw : "unknown";
  const label = URGENCY_BADGE_LABEL[raw] ?? raw;
  return {
    label,
    pillStyle: { ...BADGE_BASE, ...URGENCY_BADGE_STYLE[tier] },
  };
}

const RESULT_CARD: CSSProperties = {
  padding: "14px 16px",
  borderRadius: "var(--r16)",
  border: "1px solid var(--border)",
  background: "var(--card)",
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
};

/** Dev-only display string; avoids crashes if API/client parsing omits fields. */
function devMetaString(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value;
  return "—";
}

function formatBytesSk(n: number): string {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) {
    const s = kb >= 100 ? kb.toFixed(0) : kb >= 10 ? kb.toFixed(1) : kb.toFixed(2);
    return `${s.replace(".", ",")} kB`;
  }
  const mb = kb / 1024;
  const s = mb >= 10 ? mb.toFixed(1) : mb.toFixed(2);
  return `${s.replace(".", ",")} MB`;
}

function isHeicOrHeifFile(file: File): boolean {
  const t = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  if (t === "image/heic" || t === "image/heif") return true;
  const n = file.name.toLowerCase();
  return n.endsWith(".heic") || n.endsWith(".heif");
}

function sectionTitleStyle(): CSSProperties {
  return {
    margin: "0 0 10px",
    fontSize: 12,
    fontWeight: 800,
    color: "var(--muted2)",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };
}

/**
 * Phase 8.11P: the existing Smart Talk structured-result rendering (Summary/
 * Meaning/Urgency/Next steps/Warnings), extracted so the internal OCR →
 * controlled reasoning test button below can reuse it verbatim instead of
 * duplicating this JSX. Used both by the main envelope-only/text/question
 * result panel and by the internal controlled-reasoning test result panel.
 */
function renderSmartTalkResultCards(result: SmartTalkResult) {
  const urgencyUi = urgencyBadgeFor(result.urgency);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Zhrnutie</h2>
        <p
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--text)",
          }}
        >
          {result.summary}
        </p>
      </section>

      <section style={RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Čo to znamená</h2>
        <p
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--text)",
          }}
        >
          {result.meaning}
        </p>
      </section>

      <section style={RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Naliehavosť</h2>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={urgencyUi.pillStyle}>{urgencyUi.label}</span>
        </div>
      </section>

      <section style={RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Čo urobiť ďalej</h2>
        {result.nextSteps.length === 0 ? (
          <p style={{ margin: 0, fontStyle: "italic", fontSize: 14, color: "var(--muted)" }}>
            Žiadne konkrétne kroky.
          </p>
        ) : (
          <ol
            style={{
              margin: 0,
              paddingLeft: 22,
              fontSize: 14,
              lineHeight: 1.65,
              color: "var(--text)",
              display: "grid",
              gap: 10,
            }}
          >
            {result.nextSteps.map((step, i) => (
              <li key={i} style={{ paddingLeft: 4 }}>
                {step}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section style={RESULT_CARD}>
        <h2 style={sectionTitleStyle()}>Na čo si dať pozor</h2>
        {result.warnings.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--muted)" }}>
            Žiadne upozornenia.
          </p>
        ) : (
          <ul
            style={{
              margin: 0,
              paddingLeft: 22,
              fontSize: 14,
              lineHeight: 1.65,
              color: "var(--text)",
              display: "grid",
              gap: 10,
              listStyleType: "disc",
            }}
          >
            {result.warnings.map((w, i) => (
              <li key={i} style={{ paddingLeft: 4, color: "var(--muted)" }}>
                {w}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function SmartTalkClient() {
  const [mode, setMode] = useState<SmartTalkUiMode>("question");
  const [text, setText] = useState("");
  const [photoPages, setPhotoPages] = useState<SmartTalkPhotoPage[]>([]);
  const [photoPreparing, setPhotoPreparing] = useState(false);
  const [photoPrepareStatus, setPhotoPrepareStatus] = useState<string | null>(null);
  const [partialOcrNotice, setPartialOcrNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmartTalkResult | null>(null);
  const busyRef = useRef(false);
  const generationRef = useRef(0);
  const photoPickSeqRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraVideoReady, setCameraVideoReady] = useState(false);
  const [photoInfoLine, setPhotoInfoLine] = useState<string | null>(null);
  // Phase 8.11C: fully separate state for the internal Real OCR extraction
  // test button. Never shared with the main `result`/`error`/`loading`
  // state above, since the real OCR response shape is not a SmartTalkResult
  // and must never be routed into Smart Talk reasoning/explanation display.
  const [realOcrLoading, setRealOcrLoading] = useState(false);
  const [realOcrError, setRealOcrError] = useState<string | null>(null);
  const [realOcrResult, setRealOcrResult] = useState<RealOcrUiResult | null>(null);
  // Phase 8.11I: fully separate state for the internal OCR → Smart Talk
  // handoff envelope test button. Never shared with the main
  // `result`/`error`/`loading` state above or with the 8.11C real OCR test
  // state above — Smart Talk reasoning is never invoked by this branch in
  // 8.11I, so there is no SmartTalkResult to route anywhere.
  const [ocrHandoffLoading, setOcrHandoffLoading] = useState(false);
  const [ocrHandoffError, setOcrHandoffError] = useState<string | null>(null);
  const [ocrHandoffResult, setOcrHandoffResult] = useState<OcrHandoffUiResult | null>(null);
  // Phase 8.12E: minimal First Contact UI state — selected scenario (optional
  // presentation hint only, never sufficient on its own), the bounded
  // presentation returned alongside the shared SmartTalkResult (`result`
  // above), and the recommended-mode hint for boundary responses (document/
  // photo required). No localStorage/sessionStorage — transient React state
  // only, cleared whenever the user leaves this mode (see the mode-change
  // effect below).
  const [firstContactScenario, setFirstContactScenario] = useState<FirstContactScenarioId | null>(
    null,
  );
  const [firstContactMeta, setFirstContactMeta] = useState<FirstContactPresentationUi | null>(null);
  const [firstContactRecommendedMode, setFirstContactRecommendedMode] =
    useState<FirstContactRecommendedModeUi>(null);

  const releaseCameraHardware = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.srcObject = null;
    }
    const stream = cameraStreamRef.current;
    if (stream) {
      for (const t of stream.getTracks()) {
        t.stop();
      }
      cameraStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    generationRef.current += 1;
    setError(null);
    setResult(null);
    setLoading(false);
    setPhotoPreparing(false);
    setPhotoPrepareStatus(null);
    busyRef.current = false;

    if (mode !== "photo") {
      photoPickSeqRef.current += 1;
      releaseCameraHardware();
      setCameraActive(false);
      setCameraStarting(false);
      setCameraVideoReady(false);
      setPhotoInfoLine(null);
      setPhotoPages([]);
      setPartialOcrNotice(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    // Phase 8.12E: leaving First Contact clears its scenario selection and
    // any stale response/recommendation so nothing leaks into another mode.
    if (mode !== "first_contact") {
      setFirstContactScenario(null);
      setFirstContactMeta(null);
      setFirstContactRecommendedMode(null);
    }
  }, [mode, releaseCameraHardware]);

  useEffect(() => {
    if (!cameraActive) {
      setCameraVideoReady(false);
      return;
    }
    const v = videoRef.current;
    if (!v) {
      setCameraVideoReady(false);
      return;
    }

    const syncReady = () => {
      const ok =
        v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        v.videoWidth > 0 &&
        v.videoHeight > 0;
      setCameraVideoReady(ok);
    };

    const onLoadedMeta = () => syncReady();
    const onCanPlay = () => syncReady();
    const onPlaying = () => syncReady();

    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("playing", onPlaying);
    syncReady();

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("playing", onPlaying);
    };
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      releaseCameraHardware();
    };
  }, [releaseCameraHardware]);

  const openCamera = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setError(MSG.cameraUnavailable);
      return;
    }
    if (loading || photoPreparing || busyRef.current || cameraStarting || cameraActive) return;
    if (photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES) return;
    setError(null);
    setPhotoInfoLine(null);
    setCameraVideoReady(false);
    releaseCameraHardware();
    setCameraActive(false);
    setCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 1280 },
        },
        audio: false,
      });
      cameraStreamRef.current = stream;
      const el = videoRef.current;
      if (!el) {
        releaseCameraHardware();
        setError(MSG.cameraFailed);
        return;
      }
      setCameraVideoReady(false);
      el.srcObject = stream;
      try {
        await el.play();
      } catch {
        /* Playback may be deferred on iOS; dimensions arrive via loadedmetadata. */
      }
      setCameraActive(true);
    } catch (e) {
      releaseCameraHardware();
      setCameraVideoReady(false);
      const denied =
        e instanceof DOMException &&
        (e.name === "NotAllowedError" || e.name === "PermissionDeniedError");
      setError(denied ? MSG.cameraDenied : MSG.cameraFailed);
    } finally {
      setCameraStarting(false);
    }
  }, [loading, photoPreparing, cameraStarting, cameraActive, releaseCameraHardware, photoPages.length]);

  const cancelCamera = useCallback(() => {
    releaseCameraHardware();
    setCameraActive(false);
    setCameraStarting(false);
    setCameraVideoReady(false);
  }, [releaseCameraHardware]);

  const captureFromCamera = useCallback(async () => {
    const el = videoRef.current;
    if (
      !el ||
      !cameraStreamRef.current ||
      !cameraVideoReady ||
      busyRef.current ||
      photoPreparing
    )
      return;
    if (photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES) return;
    try {
      const file = await compressVideoFrameToSmartTalkPhotoFile(el);
      const addedTotal = sumPhotoPageBytes(photoPages) + file.size;
      if (addedTotal > SMART_TALK_MAX_PHOTO_UPLOAD_TOTAL_BYTES) {
        setError(MSG.photoTotalTooLarge);
        return;
      }
      const nextIndex = photoPages.length + 1;
      const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const nextPages: SmartTalkPhotoPage[] = [
        ...photoPages,
        {
          id,
          file,
          label: `Snímka z kamery · strana ${nextIndex}`,
        },
      ];
      setPhotoPages(nextPages);
      photoPickSeqRef.current += 1;
      setPhotoInfoLine(MSG.photoReadyForAnalysis);
      setError(null);
      if (nextPages.length >= SMART_TALK_MAX_PHOTO_PAGES) {
        releaseCameraHardware();
        setCameraActive(false);
        setCameraVideoReady(false);
      }
    } catch (err) {
      setError(messageForPreparePhotoError(err));
    }
  }, [releaseCameraHardware, photoPreparing, cameraVideoReady, photoPages]);

  const removePhotoPage = useCallback((pageId: string) => {
    setPhotoPages((prev) => prev.filter((p) => p.id !== pageId));
    setPartialOcrNotice(false);
    setPhotoInfoLine(null);
  }, []);

  const onPhotoFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rawFiles = e.target.files ? Array.from(e.target.files) : [];

      if (rawFiles.length === 0) {
        photoPickSeqRef.current += 1;
        setPhotoPreparing(false);
        setPhotoPrepareStatus(null);
        setPhotoInfoLine(null);
        setError(null);
        return;
      }

      releaseCameraHardware();
      setCameraActive(false);
      setCameraStarting(false);
      setCameraVideoReady(false);

      const pickSeq = ++photoPickSeqRef.current;
      const startGen = generationRef.current;

      const slotsLeft = SMART_TALK_MAX_PHOTO_PAGES - photoPages.length;
      if (slotsLeft <= 0) {
        setError("Maximálne 3 strany. Pred pridaním odstráňte stranu.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const toProcess = rawFiles.slice(0, slotsLeft);

      setPhotoPreparing(true);
      setPhotoPrepareStatus(null);
      setError(null);
      setPhotoInfoLine(null);

      void (async () => {
        let cumulativePages = [...photoPages];

        for (let i = 0; i < toProcess.length; i++) {
          const raw = toProcess[i]!;
          const slotNum = cumulativePages.length + 1;

          if (pickSeq !== photoPickSeqRef.current || startGen !== generationRef.current) {
            return;
          }

          if (isHeicOrHeifFile(raw)) {
            setPhotoPreparing(false);
            setPhotoPrepareStatus(null);
            setError(MSG.photoHeicNotSupported);
            if (pickSeq === photoPickSeqRef.current && fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }

          if (raw.size > SMART_TALK_MAX_GALLERY_PHOTO_BYTES) {
            setPhotoPreparing(false);
            setPhotoPrepareStatus(null);
            setError(MSG.photoGalleryTooLarge);
            if (pickSeq === photoPickSeqRef.current && fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }

          setPhotoPrepareStatus(`Pripravujem stranu ${slotNum}…`);

          try {
            const preparedPromise = prepareDocumentPhotoForUpload(raw);
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => {
                reject(new Error("smart_talk_prepare_timeout"));
              }, PHOTO_PREPARE_TIMEOUT_MS);
            });
            const prepared = await Promise.race([preparedPromise, timeoutPromise]);

            if (pickSeq !== photoPickSeqRef.current || startGen !== generationRef.current) {
              return;
            }

            const nextTotal = sumPhotoPageBytes(cumulativePages) + prepared.size;
            if (nextTotal > SMART_TALK_MAX_PHOTO_UPLOAD_TOTAL_BYTES) {
              setPhotoPreparing(false);
              setPhotoPrepareStatus(null);
              setError(MSG.photoTotalTooLarge);
              if (pickSeq === photoPickSeqRef.current && fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              return;
            }

            const id =
              typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const label = raw.name?.trim()
              ? `${raw.name.trim()} · strana ${slotNum}`
              : `Strana ${slotNum}`;

            cumulativePages = [...cumulativePages, { id, file: prepared, label }];
            setPhotoPages(cumulativePages);
            setPhotoInfoLine(MSG.photoReadyForAnalysis);
          } catch (err) {
            if (pickSeq !== photoPickSeqRef.current || startGen !== generationRef.current) {
              return;
            }
            setPhotoPrepareStatus(null);
            setPhotoPreparing(false);
            setError(messageForPreparePhotoError(err));
            if (pickSeq === photoPickSeqRef.current && fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }
        }

        if (pickSeq !== photoPickSeqRef.current || startGen !== generationRef.current) {
          return;
        }
        setPhotoPreparing(false);
        setPhotoPrepareStatus(null);
        if (pickSeq === photoPickSeqRef.current && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      })();
    },
    [photoPages, releaseCameraHardware],
  );

  const trimmedLen = text.trim().length;
  const lengthGuardActive = mode === "question" || mode === "text" || mode === "first_contact";
  const overMaxLength = lengthGuardActive && trimmedLen > MAX_TEXT_LENGTH;
  const showLengthRecommendation =
    lengthGuardActive &&
    trimmedLen > RECOMMENDED_TEXT_LENGTH &&
    trimmedLen <= MAX_TEXT_LENGTH;
  const photoBytesTotal =
    mode === "photo" ? sumPhotoPageBytes(photoPages) : 0;
  const photoOverUploadBudget =
    mode === "photo" &&
    photoBytesTotal > SMART_TALK_MAX_PHOTO_UPLOAD_TOTAL_BYTES;

  const submitDisabled =
    loading ||
    photoPreparing ||
    cameraStarting ||
    (mode === "photo"
      ? photoPages.length === 0 || photoOverUploadBudget
      : trimmedLen < 8 || trimmedLen > MAX_TEXT_LENGTH);

  // Phase 8.9K: guarded to mode === "text" only — the control is not even
  // rendered otherwise (see JSX below), so this is a defense-in-depth guard.
  const controlledTextDocumentModeDisabled =
    mode !== "text" ||
    loading ||
    photoPreparing ||
    cameraStarting ||
    trimmedLen < 8 ||
    trimmedLen > MAX_TEXT_LENGTH;

  const photoReady =
    mode === "photo" &&
    photoPages.length > 0 &&
    !photoOverUploadBudget &&
    !photoPreparing;

  const photoPickDisabled =
    loading ||
    photoPreparing ||
    cameraStarting ||
    photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES;
  const photoLabelStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "var(--r12)",
    border: "1px solid var(--accentBorder)",
    background: "rgba(238, 242, 255, 1)",
    color: "var(--text)",
    fontWeight: 700,
    fontSize: 14,
    cursor: photoPickDisabled ? "not-allowed" : "pointer",
    opacity: photoPickDisabled ? 0.55 : 1,
  };
  const photoSecondaryBtnStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "var(--r12)",
    border: "1px solid var(--border)",
    background: "rgba(255, 255, 255, 0.96)",
    color: "var(--text)",
    fontWeight: 700,
    fontSize: 14,
    minHeight: 44,
    cursor: "pointer",
  };

  const onSubmit = useCallback(async () => {
    if (mode === "photo") return;
    const trimmed = text.trim();
    if (trimmed.length < 8 || trimmed.length > MAX_TEXT_LENGTH || busyRef.current) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    const inputType = mode === "question" ? "question" : "text";

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "anonymous",
          inputType,
          locale: "sk",
          text: trimmed,
        }),
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForStatus(res.status));
    } catch {
      if (genAtStart !== generationRef.current) return;
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [text, mode]);

  // Phase 8.12E: First Contact ("Prvý kontakt") submit handler. Only ever
  // called when mode === "first_contact" (explicit user selection — never
  // auto-selected). Maps the UI-only "first_contact" mode value to the
  // exact route contract "first_contact_controlled_runtime". Sends JSON
  // only (never multipart/files/images), the server-bounded market "DE",
  // the shared locale, and the optional scenario id verbatim (never
  // translated/renamed). Exactly one request per intentional submit, no
  // automatic retry, no fallback to another mode on failure — boundary
  // responses (document/photo required) only surface a recommendation via
  // firstContactRecommendedMode; the user must manually pick that mode.
  const onFirstContactSubmit = useCallback(async () => {
    if (mode !== "first_contact") return;
    const trimmed = text.trim();
    if (trimmed.length < 8 || trimmed.length > MAX_TEXT_LENGTH || busyRef.current) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);
    setFirstContactMeta(null);
    setFirstContactRecommendedMode(null);

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "first_contact_controlled_runtime",
          text: trimmed,
          locale: "sk",
          market: "DE",
          ...(firstContactScenario ? { scenario: firstContactScenario } : {}),
        }),
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseFirstContactResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        setFirstContactMeta(okParsed.firstContactMeta);
        return;
      }

      const info = readFirstContactErrorInfo(data);
      setFirstContactRecommendedMode(info.recommendedMode);
      setError(messageForFirstContactCode(info.code, res.status));
    } catch {
      if (genAtStart !== generationRef.current) return;
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [text, mode, firstContactScenario]);

  // Phase 8.9K: controlled/internal-only Text Document Mode test action.
  // Fully additive — does not alter onSubmit/onPhotoSubmit or their branching.
  // Only operates on pasted text (mode === "text"); never wired to photo/file/
  // image/OCR/upload. No client-side storage, analytics, or console logging
  // of the document text. Behind a clearly-labeled, non-default, internal
  // control only (see JSX below) — internal/local test surface only.
  const handleControlledTextDocumentModeSubmit = useCallback(async () => {
    if (mode !== "text") return;
    const trimmed = text.trim();
    if (trimmed.length < 8 || trimmed.length > MAX_TEXT_LENGTH || busyRef.current) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "text_document_controlled_runtime",
          context: "anonymous",
          inputType: "text",
          locale: "sk",
          text: trimmed,
        }),
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForStatus(res.status));
    } catch {
      if (genAtStart !== generationRef.current) return;
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [text, mode]);

  // Phase 8.10C: controlled/internal-only Photo/OCR placeholder test action.
  // Fully additive — does not alter onPhotoSubmit or its FormData/upload
  // flow. Sends ONLY page metadata (mimeType + sizeBytes) to the server;
  // never sends the actual file bytes, never persists anything client-side,
  // and never claims OCR is active or that the document was read. The
  // server-side route branch is the sole authority for enabling this path —
  // no client-side env flag is used or implied. Internal/local test surface
  // only.
  const handleControlledPhotoOcrPlaceholderSubmit = useCallback(async () => {
    if (mode !== "photo" || photoPages.length === 0 || busyRef.current || photoPreparing) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "photo_ocr_controlled_runtime",
          context: "anonymous",
          inputType: "photo",
          locale: "sk",
          photoPages: photoPages.map((p) => ({
            mimeType: p.file.type,
            sizeBytes: p.file.size,
          })),
        }),
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForStatus(res.status));
    } catch {
      if (genAtStart !== generationRef.current) return;
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [mode, photoPages, photoPreparing]);

  // Phase 8.10C: defense-in-depth guard — the control is only rendered when
  // mode === "photo" (see JSX below), but this mirrors the 8.9K pattern of
  // also gating the handler/disabled-state on the exact mode.
  const controlledPhotoOcrPlaceholderDisabled =
    mode !== "photo" ||
    loading ||
    photoPreparing ||
    cameraStarting ||
    photoPages.length === 0;

  // Phase 8.11C: controlled/internal-only Real OCR extraction test action.
  // Fully additive — separate from the 8.10C Photo/OCR placeholder test
  // above and from onPhotoSubmit's own upload flow. Performs REAL, local,
  // server-side OCR extraction (behind its own dedicated server-side env
  // flag) on a single selected image via a dedicated multipart request. The
  // returned extracted text is never auto-filled into text mode, never
  // passed into the existing explanation flow, and never persisted
  // client-side (no localStorage/sessionStorage, no console logging of the
  // extracted text). No client-side env flag is used or implied — the
  // server-side route branch is the sole authority for enabling real OCR.
  // Internal/local test surface only; selecting the photo tab or choosing an
  // image never runs OCR by itself — this requires an explicit click.
  const handleRealOcrExtractionSubmit = useCallback(async () => {
    if (
      mode !== "photo" ||
      photoPages.length !== 1 ||
      realOcrLoading ||
      photoPreparing ||
      busyRef.current
    )
      return;

    setRealOcrLoading(true);
    setRealOcrError(null);
    setRealOcrResult(null);

    try {
      const fd = new FormData();
      fd.append("mode", "photo_ocr_real_extraction_controlled_runtime");
      fd.append("image", photoPages[0].file);
      fd.append("pageCount", "1");

      const res = await fetch("/api/smart-talk", {
        method: "POST",
        body: fd,
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      const parsed = parseRealOcrResponse(data);
      if (parsed) {
        setRealOcrResult(parsed);
        if (!parsed.ok) {
          setRealOcrError(messageForRealOcrCode(parsed.code));
        }
        return;
      }

      setRealOcrError(MSG.fallback);
    } catch {
      setRealOcrError(MSG.fallback);
    } finally {
      setRealOcrLoading(false);
    }
  }, [mode, photoPages, realOcrLoading, photoPreparing]);

  // Defense-in-depth guard mirroring controlledPhotoOcrPlaceholderDisabled:
  // requires exactly one selected image/page and is only ever rendered when
  // mode === "photo" (see JSX below).
  const realOcrExtractionDisabled =
    mode !== "photo" ||
    realOcrLoading ||
    photoPreparing ||
    cameraStarting ||
    photoPages.length !== 1;

  // Phase 8.11I: controlled/internal-only OCR → Smart Talk handoff envelope
  // test action. Fully additive — separate from the 8.11C Real OCR
  // extraction test above and from onPhotoSubmit's own upload flow. Calls
  // the new mode "photo_ocr_real_extraction_to_smart_talk_controlled_
  // handoff" via a dedicated multipart request. The returned extracted text
  // is never auto-filled into text mode, never passed into the existing
  // explanation flow (except via the explicit, server-authorized
  // `smartTalkResult` path added in 8.11P below), and never persisted
  // client-side (no localStorage/sessionStorage, no console logging of the
  // extracted text). No client-side env flag is used or implied — the
  // server-side route branch is the sole authority for enabling this
  // handoff envelope and, separately, for enabling reasoning. Internal/
  // local test surface only; selecting the photo tab or choosing an image
  // never triggers this by itself — this requires an explicit click.
  //
  // Phase 8.11P: this one handler now takes an explicit `operation`
  // argument instead of being duplicated. `"envelope_only"` sends exactly
  // the same request as 8.11I/8.11K (no `operation` field at all — the
  // existing internal test button below is unchanged). `"controlled_
  // reasoning"` additionally sends `operation="controlled_reasoning"`,
  // which only SELECTS this internal intent server-side — it can never
  // authorize reasoning by itself (see route.ts's own 8.11M contract);
  // authorization remains exclusively the three exact server-side env
  // flags. Both operations share the same loading/error/result state, so
  // the pending state disables both buttons at once (see ocrHandoffDisabled
  // below) and a second click cannot fire while a request is in flight.
  const handleOcrToSmartTalkHandoffSubmit = useCallback(
    async (operation: "envelope_only" | "controlled_reasoning") => {
      if (
        mode !== "photo" ||
        photoPages.length !== 1 ||
        ocrHandoffLoading ||
        photoPreparing ||
        busyRef.current
      )
        return;

      setOcrHandoffLoading(true);
      setOcrHandoffError(null);
      setOcrHandoffResult(null);

      try {
        const fd = new FormData();
        fd.append("mode", "photo_ocr_real_extraction_to_smart_talk_controlled_handoff");
        fd.append("image", photoPages[0].file);
        fd.append("pageCount", "1");
        if (operation === "controlled_reasoning") {
          fd.append("operation", "controlled_reasoning");
        }

        const res = await fetch("/api/smart-talk", {
          method: "POST",
          body: fd,
        });

        let data: unknown = null;
        try {
          data = (await res.json()) as unknown;
        } catch {
          data = null;
        }

        const parsed = parseOcrHandoffResponse(data);
        if (parsed) {
          setOcrHandoffResult(parsed);
          if (!parsed.ok) {
            setOcrHandoffError(messageForOcrHandoffCode(parsed.code));
          }
          return;
        }

        setOcrHandoffError(MSG.fallback);
      } catch {
        setOcrHandoffError(MSG.fallback);
      } finally {
        setOcrHandoffLoading(false);
      }
    },
    [mode, photoPages, ocrHandoffLoading, photoPreparing],
  );

  // Defense-in-depth guard mirroring realOcrExtractionDisabled: requires
  // exactly one selected image/page and is only ever rendered when
  // mode === "photo" (see JSX below).
  const ocrHandoffDisabled =
    mode !== "photo" ||
    ocrHandoffLoading ||
    photoPreparing ||
    cameraStarting ||
    photoPages.length !== 1;

  const onPhotoSubmit = useCallback(async () => {
    if (
      photoPages.length === 0 ||
      busyRef.current ||
      photoPreparing ||
      sumPhotoPageBytes(photoPages) > SMART_TALK_MAX_PHOTO_UPLOAD_TOTAL_BYTES
    )
      return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);
    setPartialOcrNotice(false);
    setPhotoInfoLine(null);

    const ac = new AbortController();
    const fetchTimeoutId = setTimeout(() => ac.abort(), PHOTO_FETCH_TIMEOUT_MS);

    try {
      const fd = new FormData();
      for (const p of photoPages) {
        fd.append("files", p.file);
      }
      fd.append("context", "anonymous");
      fd.append("locale", "sk");

      const res = await fetch("/api/smart-talk-photo", {
        method: "POST",
        body: fd,
        signal: ac.signal,
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        setPartialOcrNotice(okParsed.partialOcr === true);
        return;
      }

      setError(messageForPhotoError(readApiErrorCode(data), res.status));
    } catch (err) {
      if (genAtStart !== generationRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(MSG.photoFetchTimeout);
        return;
      }
      setError(MSG.fallback);
    } finally {
      clearTimeout(fetchTimeoutId);
      busyRef.current = false;
      setLoading(false);
    }
  }, [photoPages, photoPreparing]);

  const modeChip = (m: SmartTalkUiMode, label: string) => {
    const selected = mode === m;
    return (
      <button
        key={m}
        type="button"
        role="tab"
        aria-selected={selected}
        onClick={() => setMode(m)}
        style={{
          flex: "1 1 104px",
          minHeight: 44,
          padding: "10px 12px",
          borderRadius: "var(--r12)",
          border:
            m === "photo" && !selected
              ? "1px dashed rgba(203, 213, 225, 1)"
              : selected
                ? "1px solid var(--accentBorder)"
                : "1px solid var(--border)",
          background: selected ? "rgba(238, 242, 255, 1)" : "rgba(255, 255, 255, 0.96)",
          color: "var(--text)",
          fontWeight: 800,
          fontSize: 13,
          lineHeight: 1.25,
          cursor: "pointer",
          boxShadow: selected ? "0 0 0 3px rgba(199, 210, 254, 0.35)" : "none",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        role="tablist"
        aria-label="Spôsob vstupu"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {modeChip("question", "Opýtať sa")}
        {modeChip("first_contact", "Prvý kontakt")}
        {modeChip("text", "Vysvetliť text")}
        {modeChip("photo", "Odfotiť dokument")}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {GUIDANCE_PRIMARY[mode] ? (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
            {GUIDANCE_PRIMARY[mode]}
          </p>
        ) : null}
        {lengthGuardActive ? (
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--muted2)" }}>
            Limit: maximálne 12 000 znakov.
          </p>
        ) : null}
      </div>

        {mode === "photo" ? (
          <>
            <span id="smart-talk-photo-label" className="sr-only">
              Vstup fotografie: kamera alebo galéria
            </span>
            <input
              ref={fileInputRef}
              id="smart-talk-gallery-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              aria-labelledby="smart-talk-photo-label"
              disabled={photoPickDisabled}
              onChange={onPhotoFileChange}
              className="sr-only"
            />
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              controls={false}
              style={{
                display: cameraActive ? "block" : "none",
                width: "100%",
                maxHeight: 260,
                objectFit: "contain",
                borderRadius: "var(--r12)",
                border: "1px solid var(--border)",
                background: "rgba(15, 23, 42, 0.9)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => void openCamera()}
                disabled={
                  loading ||
                  photoPreparing ||
                  cameraStarting ||
                  cameraActive ||
                  photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES
                }
                style={{
                  ...photoLabelStyle,
                  border: "1px solid var(--accentBorder)",
                  cursor:
                    loading ||
                    photoPreparing ||
                    cameraStarting ||
                    cameraActive ||
                    photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    loading ||
                    photoPreparing ||
                    cameraStarting ||
                    cameraActive ||
                    photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES
                      ? 0.55
                      : 1,
                }}
              >
                Otvoriť kameru
              </button>
              <label htmlFor="smart-talk-gallery-input" style={photoLabelStyle}>
                {photoPages.length === 0
                  ? "Vybrať z galérie"
                  : "Pridať ďalšiu stranu z galérie"}
              </label>
            </div>
            {photoPages.length > 0 ? (
              <div style={{ marginTop: 4 }}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--muted)" }}>
                  Strany: {photoPages.length} / {SMART_TALK_MAX_PHOTO_PAGES} · spolu{" "}
                  {formatBytesSk(photoBytesTotal)}
                  {photoOverUploadBudget ? (
                    <span style={{ color: "rgba(127, 29, 29, 0.88)" }}>
                      {" "}
                      — presahuje limit 4 MB
                    </span>
                  ) : null}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--text)",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {photoPages.map((p, idx) => (
                    <li key={p.id} style={{ paddingLeft: 4 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                        <span style={{ fontWeight: 700 }}>
                          Strana {idx + 1}
                        </span>
                        <span style={{ color: "var(--muted)", wordBreak: "break-word" }}>
                          {p.label} · {formatBytesSk(p.file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePhotoPage(p.id)}
                          disabled={loading || photoPreparing || cameraStarting}
                          style={{
                            ...photoSecondaryBtnStyle,
                            padding: "6px 12px",
                            minHeight: 36,
                            fontSize: 13,
                            opacity: loading || photoPreparing || cameraStarting ? 0.55 : 1,
                            cursor:
                              loading || photoPreparing || cameraStarting
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Odstrániť
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted2)" }}>
                Zatiaľ žiadna strana — použite kameru alebo galériu.
              </p>
            )}
            {cameraActive ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={cancelCamera}
                  disabled={loading || photoPreparing}
                  style={{
                    ...photoSecondaryBtnStyle,
                    opacity: loading || photoPreparing ? 0.55 : 1,
                    cursor: loading || photoPreparing ? "not-allowed" : "pointer",
                  }}
                >
                  Zrušiť
                </button>
                <button
                  type="button"
                  onClick={() => void captureFromCamera()}
                  disabled={
                    loading ||
                    photoPreparing ||
                    !cameraVideoReady ||
                    photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES
                  }
                  style={{
                    ...photoLabelStyle,
                    opacity:
                      loading ||
                      photoPreparing ||
                      !cameraVideoReady ||
                      photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES
                        ? 0.55
                        : 1,
                    cursor:
                      loading ||
                      photoPreparing ||
                      !cameraVideoReady ||
                      photoPages.length >= SMART_TALK_MAX_PHOTO_PAGES
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Odfotiť
                </button>
              </div>
            ) : null}
            {cameraActive && !cameraVideoReady ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "var(--muted2)",
                }}
              >
                {MSG.cameraVideoPreparing}
              </p>
            ) : null}
          </>
        ) : (
          <>
            {mode === "first_contact" ? (
              <div style={{ display: "grid", gap: 10 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--text)",
                    lineHeight: 1.3,
                  }}
                >
                  {FIRST_CONTACT_ENTRY_HEADING}
                </h2>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
                  {FIRST_CONTACT_ENTRY_SUPPORTING_TEXT}
                </p>
                <div
                  role="group"
                  aria-label="Kategória situácie (nepovinné)"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 8,
                  }}
                >
                  {FIRST_CONTACT_SCENARIO_OPTIONS.map((opt) => {
                    const selected = firstContactScenario === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setFirstContactScenario(selected ? null : opt.id)}
                        disabled={loading}
                        style={{
                          minHeight: 44,
                          padding: "10px 12px",
                          borderRadius: "var(--r12)",
                          border: selected
                            ? "1px solid var(--accentBorder)"
                            : "1px solid var(--border)",
                          background: selected
                            ? "rgba(238, 242, 255, 1)"
                            : "rgba(255, 255, 255, 0.96)",
                          color: "var(--text)",
                          fontWeight: selected ? 800 : 600,
                          fontSize: 13,
                          lineHeight: 1.3,
                          textAlign: "left",
                          cursor: loading ? "not-allowed" : "pointer",
                          boxShadow: selected ? "0 0 0 3px rgba(199, 210, 254, 0.35)" : "none",
                          opacity: loading ? 0.7 : 1,
                        }}
                      >
                        {selected ? "✓ " : ""}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "var(--muted2)" }}>
                  Kategória je len pomôcka na zobrazenie, nie dôkaz. Výber je nepovinný.
                </p>
              </div>
            ) : null}
            <label htmlFor="smart-talk-input" className="sr-only">
              {mode === "question"
                ? "Otázka pre Vayla"
                : mode === "first_contact"
                  ? "Popis tvojej situácie"
                  : "Text dokumentu"}
            </label>
            <textarea
              id="smart-talk-input"
              name="smart-talk-text"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER[mode]}
              className="w-full resize-y rounded-[var(--r12)] border border-[var(--border)] bg-[var(--bg0)] px-3 py-3 text-[15px] leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--muted2)] focus:border-[color:rgba(199,210,254,1)] focus:shadow-[0_0_0_3px_rgba(199,210,254,0.45)] min-h-[168px]"
              disabled={loading}
            />
          </>
        )}

      {lengthGuardActive ? (
        <>
          <div
            style={{
              marginTop: -6,
              textAlign: "right",
              fontSize: 12,
              lineHeight: 1.4,
              color: "var(--muted2)",
              letterSpacing: "0.02em",
            }}
          >
            {`${trimmedLen.toLocaleString("sk-SK")} / 12 000`}
          </div>

          {overMaxLength ? (
            <p style={{ margin: "-4px 0 0", fontSize: 13, lineHeight: 1.5, color: "rgba(127, 29, 29, 0.88)" }}>
              Text je príliš dlhý. Skráťte ho na maximálne 12 000 znakov.
            </p>
          ) : showLengthRecommendation ? (
            <p style={{ margin: "-4px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--muted2)" }}>
              {mode === "question"
                ? "Pre najlepší výsledok skúste otázku formulovať stručne a konkrétne."
                : "Pre najlepší výsledok odporúčame vložiť iba najdôležitejšiu časť listu alebo formulára."}
            </p>
          ) : null}
        </>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (mode === "photo") void onPhotoSubmit();
          else if (mode === "first_contact") void onFirstContactSubmit();
          else void onSubmit();
        }}
        disabled={submitDisabled}
        aria-busy={loading || photoPreparing || cameraStarting}
        style={{
          width: "100%",
          height: 44,
          borderRadius: "var(--r999)",
          border: !photoReady && mode === "photo" ? "1px solid rgba(203, 213, 225, 1)" : "1px solid var(--accentBorder)",
          background:
            !photoReady && mode === "photo" ? "rgba(241, 245, 249, 1)" : "var(--accent)",
          color:
            !photoReady && mode === "photo" ? "var(--muted2)" : "rgba(255,255,255,0.98)",
          fontWeight: 800,
          fontSize: 15,
          cursor: submitDisabled ? "not-allowed" : "pointer",
          opacity: submitDisabled ? 0.55 : 1,
        }}
      >
        {SUBMIT_LABEL[mode]}
      </button>

      {mode === "text" ? (
        <div style={{ display: "grid", gap: 6, marginTop: -4 }}>
          <button
            type="button"
            onClick={() => void handleControlledTextDocumentModeSubmit()}
            disabled={controlledTextDocumentModeDisabled}
            aria-busy={loading}
            style={{
              width: "100%",
              height: 40,
              borderRadius: "var(--r999)",
              border: "1px dashed rgba(148, 163, 184, 0.6)",
              background: "rgba(248, 250, 252, 1)",
              color: "var(--muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: controlledTextDocumentModeDisabled ? "not-allowed" : "pointer",
              opacity: controlledTextDocumentModeDisabled ? 0.55 : 1,
            }}
          >
            Interný test: Text Document Mode
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--muted2)",
              textAlign: "center",
            }}
          >
            Len interný test — kontrolovaný lokálne, nie verejná funkcia.
          </p>
        </div>
      ) : null}

      {mode === "photo" ? (
        <div style={{ display: "grid", gap: 6, marginTop: -4 }}>
          <button
            type="button"
            onClick={() => void handleControlledPhotoOcrPlaceholderSubmit()}
            disabled={controlledPhotoOcrPlaceholderDisabled}
            aria-busy={loading}
            style={{
              width: "100%",
              height: 40,
              borderRadius: "var(--r999)",
              border: "1px dashed rgba(148, 163, 184, 0.6)",
              background: "rgba(248, 250, 252, 1)",
              color: "var(--muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: controlledPhotoOcrPlaceholderDisabled ? "not-allowed" : "pointer",
              opacity: controlledPhotoOcrPlaceholderDisabled ? 0.55 : 1,
            }}
          >
            Interný test: Photo/OCR placeholder
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--muted2)",
              textAlign: "center",
            }}
          >
            Len interný test — OCR zatiaľ nie je aktívne.
          </p>

          <button
            type="button"
            onClick={() => void handleRealOcrExtractionSubmit()}
            disabled={realOcrExtractionDisabled}
            aria-busy={realOcrLoading}
            style={{
              width: "100%",
              height: 40,
              borderRadius: "var(--r999)",
              border: "1px dashed rgba(148, 163, 184, 0.6)",
              background: "rgba(248, 250, 252, 1)",
              color: "var(--muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: realOcrExtractionDisabled ? "not-allowed" : "pointer",
              opacity: realOcrExtractionDisabled ? 0.55 : 1,
            }}
          >
            Interný test: Real OCR extraction
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--muted2)",
              textAlign: "center",
            }}
          >
            Len interný test — vyžaduje presne jednu vybranú stranu. Obrázok ani text sa
            neukladajú. Nie je to právne poradenstvo.
          </p>

          {realOcrLoading || realOcrError || realOcrResult ? (
            <div
              aria-live="polite"
              style={{
                marginTop: 4,
                padding: "12px 14px",
                borderRadius: "var(--r12)",
                border: realOcrError
                  ? "1px solid rgba(248, 113, 113, 0.45)"
                  : "1px solid rgba(226, 232, 240, 1)",
                background: realOcrError ? "rgba(254, 242, 242, 1)" : "rgba(248, 250, 252, 1)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--muted)",
                display: "grid",
                gap: 6,
              }}
            >
              {realOcrLoading ? (
                <p style={{ margin: 0 }}>Prebieha interný test rozpoznávania textu (real OCR)…</p>
              ) : realOcrError ? (
                <p style={{ margin: 0, color: "rgba(127, 29, 29, 0.92)" }}>{realOcrError}</p>
              ) : realOcrResult && realOcrResult.ok ? (
                <>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
                    Real OCR extrakcia dokončená (interný test).
                  </p>
                  <p style={{ margin: 0 }}>
                    Dĺžka rozpoznaného textu: {realOcrResult.extractedTextLength ?? 0} znakov.
                  </p>
                  {realOcrResult.extractedTextPreview ? (
                    <p style={{ margin: 0, fontStyle: "italic" }}>
                      Náhľad: „{realOcrResult.extractedTextPreview}“
                    </p>
                  ) : null}
                  <p style={{ margin: 0 }}>Kvalita: {realOcrResult.qualityStatus ?? "unknown"}</p>
                  {realOcrResult.downgradeReasons && realOcrResult.downgradeReasons.length > 0 ? (
                    <p style={{ margin: 0 }}>
                      Upozornenia kvality: {realOcrResult.downgradeReasons.join(", ")}
                    </p>
                  ) : null}
                  <p style={{ margin: 0 }}>
                    OCR môže obsahovať chyby a nejde o právne poradenstvo. Vždy skontrolujte
                    originálny dokument. Obrázok ani text sa štandardne neukladajú.
                  </p>
                </>
              ) : realOcrResult ? (
                <>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
                    Real OCR extrakcia zlyhala (interný test).
                  </p>
                  {realOcrResult.blockingReasons && realOcrResult.blockingReasons.length > 0 ? (
                    <p style={{ margin: 0 }}>
                      Dôvody: {realOcrResult.blockingReasons.join(", ")}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleOcrToSmartTalkHandoffSubmit("envelope_only")}
            disabled={ocrHandoffDisabled}
            aria-busy={ocrHandoffLoading}
            style={{
              width: "100%",
              height: 40,
              borderRadius: "var(--r999)",
              border: "1px dashed rgba(148, 163, 184, 0.6)",
              background: "rgba(248, 250, 252, 1)",
              color: "var(--muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: ocrHandoffDisabled ? "not-allowed" : "pointer",
              opacity: ocrHandoffDisabled ? 0.55 : 1,
            }}
          >
            Interný test: OCR → Smart Talk
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--muted2)",
              textAlign: "center",
            }}
          >
            Len interný test — vyžaduje presne jednu vybranú stranu. Smart Talk odpoveď sa v
            tejto fáze ešte nevytvára, iba sa pripraví odovzdanie textu.
          </p>

          {/* Phase 8.11P: separate internal-only button that explicitly
              requests controlled reasoning (operation="controlled_reasoning").
              Shares handleOcrToSmartTalkHandoffSubmit and ocrHandoffDisabled/
              ocrHandoffLoading with the envelope-only button above, so a
              pending request disables both and a second click cannot fire.
              Server-side env gates remain the sole authority — this button
              only selects intent and never authorizes reasoning itself. */}
          <button
            type="button"
            onClick={() => void handleOcrToSmartTalkHandoffSubmit("controlled_reasoning")}
            disabled={ocrHandoffDisabled}
            aria-busy={ocrHandoffLoading}
            style={{
              width: "100%",
              height: 40,
              borderRadius: "var(--r999)",
              border: "1px dashed rgba(148, 163, 184, 0.6)",
              background: "rgba(248, 250, 252, 1)",
              color: "var(--muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: ocrHandoffDisabled ? "not-allowed" : "pointer",
              opacity: ocrHandoffDisabled ? 0.55 : 1,
            }}
          >
            Interný test: OCR → Smart Talk vysvetlenie
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--muted2)",
              textAlign: "center",
            }}
          >
            Len interný test riadeného vysvetlenia — vyžaduje presne jednu vybranú stranu.
            Vyžaduje explicitné kliknutie a server-side povolenie; bez neho vráti chybu.
          </p>

          {ocrHandoffLoading || ocrHandoffError || ocrHandoffResult ? (
            <div
              aria-live="polite"
              style={{
                marginTop: 4,
                padding: "12px 14px",
                borderRadius: "var(--r12)",
                border: ocrHandoffError
                  ? "1px solid rgba(248, 113, 113, 0.45)"
                  : "1px solid rgba(226, 232, 240, 1)",
                background: ocrHandoffError ? "rgba(254, 242, 242, 1)" : "rgba(248, 250, 252, 1)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--muted)",
                display: "grid",
                gap: 6,
              }}
            >
              {ocrHandoffLoading ? (
                <p style={{ margin: 0 }}>Prebieha interný test odovzdania OCR textu do Smart Talk…</p>
              ) : ocrHandoffError ? (
                <p style={{ margin: 0, color: "rgba(127, 29, 29, 0.92)" }}>{ocrHandoffError}</p>
              ) : ocrHandoffResult && ocrHandoffResult.ok ? (
                <>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
                    Odovzdanie OCR textu pripravené (interný test).
                  </p>
                  <p style={{ margin: 0 }}>
                    Stav odovzdania: {ocrHandoffResult.handoffAllowed ? "pripravené" : "zablokované"}
                    {" · "}
                    Smart Talk odpoveď vytvorená: {ocrHandoffResult.handoffPerformed ? "áno" : "nie"}.
                  </p>
                  {ocrHandoffResult.handoffReason ? (
                    <p style={{ margin: 0 }}>Dôvod: {ocrHandoffResult.handoffReason}</p>
                  ) : null}
                  <p style={{ margin: 0 }}>Kvalita: {ocrHandoffResult.qualityStatus ?? "unknown"}</p>
                  <p style={{ margin: 0 }}>
                    Dĺžka rozpoznaného textu: {ocrHandoffResult.extractedTextLength ?? 0} znakov.
                  </p>
                  {ocrHandoffResult.extractedTextPreview ? (
                    <p style={{ margin: 0, fontStyle: "italic" }}>
                      Náhľad: „{ocrHandoffResult.extractedTextPreview}“
                    </p>
                  ) : null}
                  {ocrHandoffResult.highRiskTokensDetected &&
                  ocrHandoffResult.highRiskTokensDetected.length > 0 ? (
                    <p style={{ margin: 0 }}>
                      Citlivý/rizikový obsah zistený: {ocrHandoffResult.highRiskTokensDetected.join(", ")}
                    </p>
                  ) : null}
                  {ocrHandoffResult.warnings && ocrHandoffResult.warnings.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {ocrHandoffResult.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  ) : null}

                  {ocrHandoffResult.smartTalkResult ? (
                    <div style={{ marginTop: 6, display: "grid", gap: 10 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
                        Smart Talk vysvetlenie (interný test riadeného vysvetlenia):
                      </p>
                      {renderSmartTalkResultCards(ocrHandoffResult.smartTalkResult)}
                      <p style={{ margin: "4px 0 0" }}>
                        OCR text môže obsahovať chyby — vždy skontrolujte originálny dokument.
                        Toto nie je právne poradenstvo. Toto je interný kontrolovaný test, nie
                        produkčná funkcia. Obrázok ani text sa neukladajú.
                      </p>
                    </div>
                  ) : (
                    <p style={{ margin: 0 }}>
                      OCR môže obsahovať chyby a nejde o právne poradenstvo. Vždy skontrolujte
                      originálny dokument. Smart Talk odpoveď sa v tejto fáze (8.11I) ešte
                      nevytvára. Obrázok ani text sa štandardne neukladajú.
                    </p>
                  )}
                </>
              ) : ocrHandoffResult ? (
                <>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
                    Odovzdanie OCR textu zlyhalo (interný test).
                  </p>
                  {ocrHandoffResult.blockingReasons && ocrHandoffResult.blockingReasons.length > 0 ? (
                    <p style={{ margin: 0 }}>
                      Dôvody: {ocrHandoffResult.blockingReasons.join(", ")}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        aria-live="polite"
        style={{
          marginTop: 4,
          padding: "14px 16px",
          borderRadius: "var(--r16)",
          border: error
            ? "1px solid rgba(248, 113, 113, 0.45)"
            : result ||
                loading ||
                photoPreparing ||
                cameraStarting ||
                photoInfoLine ||
                photoPrepareStatus
              ? "1px solid rgba(226, 232, 240, 1)"
              : "1px dashed rgba(203, 213, 225, 1)",
          background: error ? "rgba(254, 242, 242, 1)" : "rgba(248, 250, 252, 1)",
          minHeight: 88,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--muted)",
        }}
      >
        {loading || photoPreparing || cameraStarting ? (
          <p style={{ margin: 0 }}>
            {cameraStarting
              ? MSG.cameraOpening
              : photoPreparing
                ? photoPrepareStatus ?? MSG.photoProcessingDoc
              : mode === "photo"
                ? photoPages.length > 1
                  ? `Analyzujem dokument (${photoPages.length} strán)…`
                  : "Spracovávam fotografiu a analyzujem text…"
                : mode === "question"
                  ? "Vaylo odpovedá na vašu otázku…"
                  : mode === "first_contact"
                    ? "Vaylo hľadá prvý krok…"
                    : "Vaylo vysvetľuje text…"}
          </p>
        ) : error ? (
          <div style={{ display: "grid", gap: 10 }} role="alert">
            <p style={{ margin: 0, color: "rgba(127, 29, 29, 0.92)" }}>{error}</p>
            {mode === "first_contact" && firstContactRecommendedMode ? (
              <button
                type="button"
                onClick={() =>
                  setMode(
                    firstContactRecommendedMode === "text_document_controlled_runtime"
                      ? "text"
                      : "photo",
                  )
                }
                style={{
                  width: "fit-content",
                  height: 40,
                  padding: "0 16px",
                  borderRadius: "var(--r999)",
                  border: "1px solid var(--accentBorder)",
                  background: "rgba(238, 242, 255, 1)",
                  color: "var(--text)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {firstContactRecommendedMode === "text_document_controlled_runtime"
                  ? "Prepnúť na Vysvetliť text"
                  : "Prepnúť na Odfotiť dokument"}
              </button>
            ) : null}
          </div>
        ) : photoInfoLine && mode === "photo" ? (
          <p style={{ margin: 0 }}>{photoInfoLine}</p>
        ) : result ? (
          <div style={{ display: "grid", gap: 14 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              Tu je vaša analýza. Takto situáciu vyhodnotilo Vaylo:
            </p>
            {partialOcrNotice ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "var(--muted)",
                }}
              >
                {MSG.photoPartialOcrNotice}
              </p>
            ) : null}

            {renderSmartTalkResultCards(result)}

            {mode === "first_contact" && firstContactMeta
              ? renderFirstContactPresentationCards(firstContactMeta, result)
              : null}

            {process.env.NODE_ENV === "development" ? (
              <details
                style={{
                  marginTop: 2,
                  border: "1px dashed rgba(100, 116, 139, 0.55)",
                  borderRadius: "var(--r12)",
                  padding: "10px 12px",
                  background: "rgba(241, 245, 249, 0.65)",
                  fontSize: 11,
                  lineHeight: 1.45,
                  color: "rgba(71, 85, 105, 0.95)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    userSelect: "none",
                  }}
                >
                  DEV: Smart Talk reasoning metadata
                </summary>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gap: 8,
                    paddingTop: 4,
                    borderTop: "1px dashed rgba(148, 163, 184, 0.45)",
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.85 }}>confidenceLevel: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).confidenceLevel,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>consequencePhase: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).consequencePhase,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentQuality: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).documentQuality,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentKind: </span>
                    {devMetaString(result.documentKind)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>domain: </span>
                    {devMetaString(result.domain)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentTypeLabel: </span>
                    {devMetaString(result.documentTypeLabel)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>paymentChannel: </span>
                    {devMetaString(result.paymentChannel)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>proceduralState: </span>
                    {devMetaString(result.proceduralState)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>legalSeverity: </span>
                    {devMetaString(result.legalSeverity)}
                  </div>
                  <div style={{ wordBreak: "break-word", opacity: 0.92 }}>
                    <span style={{ opacity: 0.85 }}>deadlines: </span>
                    {JSON.stringify(result.deadlines)}
                  </div>
                  <div style={{ wordBreak: "break-word", opacity: 0.92 }}>
                    <span style={{ opacity: 0.85 }}>rights: </span>
                    {JSON.stringify(result.rights)}
                  </div>
                  <div style={{ wordBreak: "break-word", opacity: 0.92 }}>
                    <span style={{ opacity: 0.85 }}>obligations: </span>
                    {JSON.stringify(result.obligations)}
                  </div>
                  <div style={{ wordBreak: "break-word", opacity: 0.92 }}>
                    <span style={{ opacity: 0.85 }}>consequences: </span>
                    {JSON.stringify(result.consequences)}
                  </div>
                  <div>
                    <div style={{ opacity: 0.85, marginBottom: 4 }}>stabilizers:</div>
                    {(() => {
                      const raw = (result as unknown as Record<string, unknown>).stabilizers;
                      const list = Array.isArray(raw)
                        ? raw.filter((x): x is string => typeof x === "string" && x.trim() !== "")
                        : [];
                      if (list.length === 0) {
                        return (
                          <span style={{ fontStyle: "italic", opacity: 0.9 }}>
                            Žiadne stabilizujúce informácie neboli extrahované.
                          </span>
                        );
                      }
                      return (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 18,
                            display: "grid",
                            gap: 4,
                          }}
                        >
                          {list.map((s, i) => (
                            <li key={i} style={{ paddingLeft: 2 }}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                </div>
              </details>
            ) : null}
          </div>
        ) : (
          <p style={{ margin: 0 }}>Výsledok vysvetlenia sa zobrazí tu.</p>
        )}
      </div>
    </div>
  );
}
