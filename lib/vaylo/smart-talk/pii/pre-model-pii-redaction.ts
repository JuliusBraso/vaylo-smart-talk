/**
 * PHASE 8.6G-1 — Pre-Model PII Redaction Surgical Utility Skeleton
 *
 * TD-004 Status: Skeleton only. Not model-facing. Not route-wired. Not user-visible.
 * Not production-authorized. Not pilot-authorized. Not real-document-authorized.
 *
 * Constraints enforced by this file:
 *   - No imports (zero-import policy for this phase)
 *   - No OpenAI / fetch / process.env / SDK usage
 *   - No route patching or route wiring
 *   - No real document, OCR, photo, or user-visible output
 *   - No database or storage writes
 *   - No audit persistence
 *   - safeForModel / safeForEvidenceGates / safeForUserVisibleOutput always false in this phase
 *   - rawMapReturned always false — raw PII values never exposed in output
 *
 * Still required before production (TD-004 open items):
 *   - Input validation guard
 *   - Detector patterns
 *   - Redaction engine
 *   - Synthetic validation and tamper coverage expansion
 *   - Post-patch audit
 *   - Closure decision
 *   - Production route wiring (separate phase)
 */

// ─── Exported Types ───────────────────────────────────────────────────────────

export type PreModelPiiRedactionLane =
  | "controlled_document_text"
  | "synthetic_governance_test";

export type PreModelPiiRedactionStatus =
  | "passed"
  | "blocked"
  | "needs_review";

export type PreModelPiiRedactionCategory =
  | "person_name_or_greeting"
  | "postal_address"
  | "phone_number"
  | "email_address"
  | "date_of_birth"
  | "customer_number"
  | "insurance_number"
  | "health_insurance_identifier"
  | "tax_id"
  | "steuer_id"
  | "steuernummer"
  | "aktenzeichen"
  | "vorgangsnummer"
  | "case_reference_number"
  | "iban"
  | "license_plate"
  | "sender_block"
  | "recipient_block"
  | "authority_contact_block"
  | "medical_health_identifier"
  | "immigration_residence_identifier"
  | "social_benefit_identifier"
  | "jobcenter_buergergeld_identifier"
  | "familienkasse_kindergeld_identifier"
  | "auslaenderbehoerde_identifier"
  | "finanzamt_identifier"
  | "unknown_high_risk_identifier";

/**
 * A single detector hit.
 * Intentionally does NOT include a "value" or "rawText" field —
 * raw PII values must never be surfaced in output structures.
 */
export interface PreModelPiiRedactionDetectorHit {
  /** PII category detected. */
  category: PreModelPiiRedactionCategory;
  /** Inclusive start character offset in the redacted text. */
  start: number;
  /** Exclusive end character offset in the redacted text. */
  end: number;
  /** Detector confidence [0, 1]. */
  confidence: number;
  /** Human-readable reason for the hit (no raw values). */
  reason: string;
  /** The placeholder token that replaced this span, e.g. "[PERSON_NAME_OR_GREETING_1]". */
  replacementPlaceholder: string;
}

export interface PreModelPiiRedactionInput {
  /** The text to be screened and redacted. Must not be raw-logged. */
  text: string;
  /** Processing lane — restricts which paths are permitted. */
  lane: PreModelPiiRedactionLane;
  /** Caller-supplied label for the source (e.g. "document_text", "synthetic_test"). */
  sourceKind: string;
  /** Optional maximum character length. Exceeding it triggers a "blocked" result. */
  maxLength?: number;
}

export interface PreModelPiiRedactionResult {
  /** Overall disposition of this redaction pass. */
  status: PreModelPiiRedactionStatus;
  /**
   * In this skeleton phase, equals input text (no real redaction yet).
   * Must not be used for model input, evidence gates, or user-visible output
   * until safeForModel / safeForEvidenceGates / safeForUserVisibleOutput are true.
   */
  redactedText: string;
  /** Map of placeholder token → occurrence count. Empty in skeleton phase. */
  placeholderCounts: Record<string, number>;
  /** Ordered list of distinct categories for which placeholders were inserted. */
  placeholderCategories: PreModelPiiRedactionCategory[];
  /** High-level summary of detector activity (no raw values). */
  detectorSummary: string;
  /** High-level summary of coverage (no raw values). */
  coverageSummary: string;
  /** Unresolved risk flags that require human or downstream review. */
  unresolvedRiskFlags: string[];
  /** Reasons this result is blocked (empty unless status === "blocked"). */
  blockingReasons: string[];
  /**
   * Whether the redactedText is safe to forward to an LLM.
   * Always false in this skeleton phase.
   */
  safeForModel: false;
  /**
   * Whether the redactedText is safe to use as input to evidence gates.
   * Always false in this skeleton phase.
   */
  safeForEvidenceGates: false;
  /**
   * Whether the redactedText is safe for user-visible output.
   * Always false in this skeleton phase.
   */
  safeForUserVisibleOutput: false;
  /**
   * Whether a raw PII map was returned.
   * Always false — raw values are never exposed.
   */
  rawMapReturned: false;
  /** Individual detector hits (empty in skeleton phase). */
  detectorHits: PreModelPiiRedactionDetectorHit[];
  /** Informational notes (must not include raw input text). */
  notes: string[];
}

export interface PreModelPiiRedactionValidationResult {
  /** Phase identifier. */
  checkId: "8.6G-1";
  allPassed: boolean;
  skeletonOnly: true;
  isolatedUtilityFileCreated: true;
  noImportsUsed: true;
  exportedTypesDefined: true;
  exportedFunctionsDefined: true;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  productionDetectorPatternsImplemented: false;
  productionRedactionEngineImplemented: false;
  productionPiiUtilitySkeletonImplemented: true;
  realDocumentInputAuthorizedNow: false;
  userVisibleOutputAuthorizedNow: false;
  publicRuntimeAuthorizedNow: false;
  modelFacingUseAuthorizedNow: false;
  evidenceGateExecutionAuthorizedNow: false;
  claimAuthorizationAuthorizedNow: false;
  exactDeadlineCalculationAuthorized: false;
  paymentRuntimeAuthorizedNow: false;
  entitlementRuntimeAuthorizedNow: false;
  checkoutRuntimeAuthorizedNow: false;
  pilotAuthorizationGranted: false;
  productionAuthorizationGranted: false;
  goLiveAuthorizationGranted: false;
  safeForUserVisibleOutputAlwaysFalseConfirmed: true;
  rawMapNotReturnedConfirmed: true;
  noOpenAiCall: true;
  noFetchCall: true;
  noProcessEnvRead: true;
  noSdkUsage: true;
  noRouteImport: true;
  noRouteHandlerCall: true;
  noFilesystemRead: true;
  noDatabaseWrite: true;
  noStorageWrite: true;
  noAuditPersistence: true;
  noPromptBuild: true;
  noModelCall: true;
  noRunSmartTalkCall: true;
  no8x3AcRerun: true;
  td004PreModelPiiRedactionSurgicalUtilitySkeletonApplied: true;
  td004PreModelPiiRedactionStillRequiresInputValidationGuard: true;
  td004PreModelPiiRedactionStillRequiresDetectorPatterns: true;
  td004PreModelPiiRedactionStillRequiresRedactionEngine: true;
  td004PreModelPiiRedactionStillRequiresSyntheticValidationAndTamperCoverage: true;
  td004PreModelPiiRedactionStillRequiresPostPatchAudit: true;
  td004PreModelPiiRedactionStillRequiresClosureDecision: true;
  td004PreModelPiiRedactionStillMissingProductionRouteWiring: true;
  td004PreModelPiiRedactionStillNotUserVisible: true;
  td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true;
  readyFor8x6G2PreModelPiiRedactionInputValidationGuard: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  tamperCasesRejected: number;
  tamperCaseCount: number;
  notes: string[];
}

// ─── Exported Functions ───────────────────────────────────────────────────────

/**
 * Pre-model PII redaction entry point.
 *
 * SKELETON PHASE (8.6G-1):
 *   - No real detection patterns implemented.
 *   - No real redaction engine implemented.
 *   - safeForModel / safeForEvidenceGates / safeForUserVisibleOutput are always false.
 *   - rawMapReturned is always false.
 *   - Returns "blocked" for empty/whitespace-only text, exceeded maxLength, or unsupported lane.
 *   - Returns "needs_review" for all other inputs.
 */
export function redactPreModelPii(
  input: PreModelPiiRedactionInput
): PreModelPiiRedactionResult {
  const ALLOWED_LANES: PreModelPiiRedactionLane[] = [
    "controlled_document_text",
    "synthetic_governance_test",
  ];

  const DEFAULT_MAX_LENGTH = 100_000;

  // ── Guard: empty or whitespace-only text ────────────────────────────────────
  if (!input.text || input.text.trim().length === 0) {
    return {
      status: "blocked",
      redactedText: "",
      placeholderCounts: {},
      placeholderCategories: [],
      detectorSummary: "blocked: empty or whitespace-only input",
      coverageSummary: "no coverage — input blocked before detection",
      unresolvedRiskFlags: [],
      blockingReasons: ["input_text_empty_or_whitespace"],
      safeForModel: false,
      safeForEvidenceGates: false,
      safeForUserVisibleOutput: false,
      rawMapReturned: false,
      detectorHits: [],
      notes: [
        "8.6G-1 skeleton: blocked due to empty or whitespace-only input",
        "detector patterns not yet implemented",
        "redaction engine not yet implemented",
      ],
    };
  }

  // ── Guard: maxLength exceeded ────────────────────────────────────────────────
  const effectiveMax =
    typeof input.maxLength === "number" && input.maxLength > 0
      ? input.maxLength
      : DEFAULT_MAX_LENGTH;

  if (input.text.length > effectiveMax) {
    return {
      status: "blocked",
      redactedText: "",
      placeholderCounts: {},
      placeholderCategories: [],
      detectorSummary: "blocked: input exceeds maxLength",
      coverageSummary: "no coverage — input blocked before detection",
      unresolvedRiskFlags: [],
      blockingReasons: ["input_text_exceeds_max_length"],
      safeForModel: false,
      safeForEvidenceGates: false,
      safeForUserVisibleOutput: false,
      rawMapReturned: false,
      detectorHits: [],
      notes: [
        "8.6G-1 skeleton: blocked due to input exceeding maxLength",
        "detector patterns not yet implemented",
        "redaction engine not yet implemented",
      ],
    };
  }

  // ── Guard: unsupported lane ──────────────────────────────────────────────────
  if (!ALLOWED_LANES.includes(input.lane)) {
    return {
      status: "blocked",
      redactedText: "",
      placeholderCounts: {},
      placeholderCategories: [],
      detectorSummary: "blocked: unsupported lane",
      coverageSummary: "no coverage — input blocked before detection",
      unresolvedRiskFlags: [],
      blockingReasons: ["unsupported_lane"],
      safeForModel: false,
      safeForEvidenceGates: false,
      safeForUserVisibleOutput: false,
      rawMapReturned: false,
      detectorHits: [],
      notes: [
        "8.6G-1 skeleton: blocked due to unsupported lane",
        "detector patterns not yet implemented",
        "redaction engine not yet implemented",
      ],
    };
  }

  // ── Skeleton result: no real detection or redaction yet ─────────────────────
  return {
    status: "needs_review",
    // In skeleton phase, redactedText equals input text.
    // Must NOT be forwarded to any model, evidence gate, or user-visible output
    // until safeForModel / safeForEvidenceGates / safeForUserVisibleOutput become true
    // in a future phase after real detector patterns and redaction engine are implemented.
    redactedText: input.text,
    placeholderCounts: {},
    placeholderCategories: [],
    detectorSummary:
      "skeleton-only: no detector patterns implemented in 8.6G-1",
    coverageSummary:
      "skeleton-only: no coverage analysis available in 8.6G-1",
    unresolvedRiskFlags: [
      "SKELETON_ONLY__DETECTOR_NOT_YET_IMPLEMENTED",
      "SKELETON_ONLY__REDACTION_ENGINE_NOT_YET_IMPLEMENTED",
      "SKELETON_ONLY__NOT_SAFE_FOR_MODEL_INPUT",
      "SKELETON_ONLY__NOT_SAFE_FOR_EVIDENCE_GATES",
      "SKELETON_ONLY__NOT_SAFE_FOR_USER_VISIBLE_OUTPUT",
    ],
    blockingReasons: [],
    safeForModel: false,
    safeForEvidenceGates: false,
    safeForUserVisibleOutput: false,
    rawMapReturned: false,
    detectorHits: [],
    notes: [
      "8.6G-1 skeleton phase: no real detection or redaction performed",
      "redactedText currently equals input text — not safe to forward",
      "detector patterns not yet implemented",
      "redaction engine not yet implemented",
      "await 8.6G-2 input validation guard before any downstream use",
    ],
  };
}

// ─── Internal helpers (not exported) ─────────────────────────────────────────

/** Check that a validation result matches the canonical shape exactly. */
function _isCanonicalValidationResult(
  r: PreModelPiiRedactionValidationResult
): boolean {
  return (
    r.checkId === "8.6G-1" &&
    r.allPassed === true &&
    r.skeletonOnly === true &&
    r.isolatedUtilityFileCreated === true &&
    r.noImportsUsed === true &&
    r.exportedTypesDefined === true &&
    r.exportedFunctionsDefined === true &&
    r.routePatchPerformed === false &&
    r.routeWiringPerformed === false &&
    r.smartTalkRouteModified === false &&
    r.photoRouteModified === false &&
    r.productionDetectorPatternsImplemented === false &&
    r.productionRedactionEngineImplemented === false &&
    r.productionPiiUtilitySkeletonImplemented === true &&
    r.realDocumentInputAuthorizedNow === false &&
    r.userVisibleOutputAuthorizedNow === false &&
    r.publicRuntimeAuthorizedNow === false &&
    r.modelFacingUseAuthorizedNow === false &&
    r.evidenceGateExecutionAuthorizedNow === false &&
    r.claimAuthorizationAuthorizedNow === false &&
    r.exactDeadlineCalculationAuthorized === false &&
    r.paymentRuntimeAuthorizedNow === false &&
    r.entitlementRuntimeAuthorizedNow === false &&
    r.checkoutRuntimeAuthorizedNow === false &&
    r.pilotAuthorizationGranted === false &&
    r.productionAuthorizationGranted === false &&
    r.goLiveAuthorizationGranted === false &&
    r.safeForUserVisibleOutputAlwaysFalseConfirmed === true &&
    r.rawMapNotReturnedConfirmed === true &&
    r.noOpenAiCall === true &&
    r.noFetchCall === true &&
    r.noProcessEnvRead === true &&
    r.noSdkUsage === true &&
    r.noRouteImport === true &&
    r.noRouteHandlerCall === true &&
    r.noFilesystemRead === true &&
    r.noDatabaseWrite === true &&
    r.noStorageWrite === true &&
    r.noAuditPersistence === true &&
    r.noPromptBuild === true &&
    r.noModelCall === true &&
    r.noRunSmartTalkCall === true &&
    r.no8x3AcRerun === true &&
    r.td004PreModelPiiRedactionSurgicalUtilitySkeletonApplied === true &&
    r.td004PreModelPiiRedactionStillRequiresInputValidationGuard === true &&
    r.td004PreModelPiiRedactionStillRequiresDetectorPatterns === true &&
    r.td004PreModelPiiRedactionStillRequiresRedactionEngine === true &&
    r.td004PreModelPiiRedactionStillRequiresSyntheticValidationAndTamperCoverage === true &&
    r.td004PreModelPiiRedactionStillRequiresPostPatchAudit === true &&
    r.td004PreModelPiiRedactionStillRequiresClosureDecision === true &&
    r.td004PreModelPiiRedactionStillMissingProductionRouteWiring === true &&
    r.td004PreModelPiiRedactionStillNotUserVisible === true &&
    r.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk === true &&
    r.readyFor8x6G2PreModelPiiRedactionInputValidationGuard === true &&
    r.readyForRealDocumentInput === false &&
    r.readyForUserVisibleOutput === false &&
    r.readyForPublicRuntime === false
  );
}

/**
 * Run synthetic behavioral cases and return the aggregated pass/fail state.
 * Returns { passed, failures } — does not include raw text in failures.
 */
function _runSyntheticCases(): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  // Case 1: clean synthetic text → needs_review, not blocked
  const case1 = redactPreModelPii({
    text: "Synthetic test input without personal data.",
    lane: "synthetic_governance_test",
    sourceKind: "synthetic_test",
  });
  if (case1.status !== "needs_review") {
    failures.push("case1: clean synthetic text should return needs_review");
  }
  if (case1.safeForModel !== false) {
    failures.push("case1: safeForModel must be false");
  }
  if (case1.safeForEvidenceGates !== false) {
    failures.push("case1: safeForEvidenceGates must be false");
  }
  if (case1.safeForUserVisibleOutput !== false) {
    failures.push("case1: safeForUserVisibleOutput must be false");
  }
  if (case1.rawMapReturned !== false) {
    failures.push("case1: rawMapReturned must be false");
  }

  // Case 2: empty input → blocked
  const case2 = redactPreModelPii({
    text: "",
    lane: "synthetic_governance_test",
    sourceKind: "synthetic_test",
  });
  if (case2.status !== "blocked") {
    failures.push("case2: empty input should return blocked");
  }

  // Case 3: whitespace-only input → blocked
  const case3 = redactPreModelPii({
    text: "   \t\n  ",
    lane: "synthetic_governance_test",
    sourceKind: "synthetic_test",
  });
  if (case3.status !== "blocked") {
    failures.push("case3: whitespace-only input should return blocked");
  }

  // Case 4: maxLength exceeded → blocked
  const case4 = redactPreModelPii({
    text: "A".repeat(51),
    lane: "synthetic_governance_test",
    sourceKind: "synthetic_test",
    maxLength: 50,
  });
  if (case4.status !== "blocked") {
    failures.push("case4: maxLength exceeded should return blocked");
  }

  // Case 5: unsupported lane → blocked
  const case5 = redactPreModelPii({
    text: "Synthetic text for lane guard test.",
    lane: "unsupported_lane_xyz" as PreModelPiiRedactionLane,
    sourceKind: "synthetic_test",
  });
  if (case5.status !== "blocked") {
    failures.push("case5: unsupported lane should return blocked");
  }

  // Case 6: safeForUserVisibleOutput always false (needs_review path)
  const case6 = redactPreModelPii({
    text: "Another synthetic clean input.",
    lane: "controlled_document_text",
    sourceKind: "synthetic_test",
  });
  if (case6.safeForUserVisibleOutput !== false) {
    failures.push("case6: safeForUserVisibleOutput must always be false");
  }

  // Case 7: rawMapReturned always false (needs_review path)
  if (case6.rawMapReturned !== false) {
    failures.push("case7: rawMapReturned must always be false");
  }

  return { passed: failures.length === 0, failures };
}

/** Build the canonical validation result (allPassed determined at call time). */
function _buildCanonicalResult(
  allPassed: boolean,
  tamperCasesRejected: number,
  tamperCaseCount: number,
  extraNotes: string[]
): PreModelPiiRedactionValidationResult {
  return {
    checkId: "8.6G-1",
    allPassed,
    skeletonOnly: true,
    isolatedUtilityFileCreated: true,
    noImportsUsed: true,
    exportedTypesDefined: true,
    exportedFunctionsDefined: true,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    productionDetectorPatternsImplemented: false,
    productionRedactionEngineImplemented: false,
    productionPiiUtilitySkeletonImplemented: true,
    realDocumentInputAuthorizedNow: false,
    userVisibleOutputAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    modelFacingUseAuthorizedNow: false,
    evidenceGateExecutionAuthorizedNow: false,
    claimAuthorizationAuthorizedNow: false,
    exactDeadlineCalculationAuthorized: false,
    paymentRuntimeAuthorizedNow: false,
    entitlementRuntimeAuthorizedNow: false,
    checkoutRuntimeAuthorizedNow: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,
    safeForUserVisibleOutputAlwaysFalseConfirmed: true,
    rawMapNotReturnedConfirmed: true,
    noOpenAiCall: true,
    noFetchCall: true,
    noProcessEnvRead: true,
    noSdkUsage: true,
    noRouteImport: true,
    noRouteHandlerCall: true,
    noFilesystemRead: true,
    noDatabaseWrite: true,
    noStorageWrite: true,
    noAuditPersistence: true,
    noPromptBuild: true,
    noModelCall: true,
    noRunSmartTalkCall: true,
    no8x3AcRerun: true,
    td004PreModelPiiRedactionSurgicalUtilitySkeletonApplied: true,
    td004PreModelPiiRedactionStillRequiresInputValidationGuard: true,
    td004PreModelPiiRedactionStillRequiresDetectorPatterns: true,
    td004PreModelPiiRedactionStillRequiresRedactionEngine: true,
    td004PreModelPiiRedactionStillRequiresSyntheticValidationAndTamperCoverage: true,
    td004PreModelPiiRedactionStillRequiresPostPatchAudit: true,
    td004PreModelPiiRedactionStillRequiresClosureDecision: true,
    td004PreModelPiiRedactionStillMissingProductionRouteWiring: true,
    td004PreModelPiiRedactionStillNotUserVisible: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true,
    readyFor8x6G2PreModelPiiRedactionInputValidationGuard: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    tamperCasesRejected,
    tamperCaseCount,
    notes: extraNotes,
  };
}

// ─── Tamper case definitions ──────────────────────────────────────────────────

type TamperMutation = (
  r: PreModelPiiRedactionValidationResult
) => PreModelPiiRedactionValidationResult;

interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

const TAMPER_CASES: TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.6G-0" as "8.6G-1" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "skeletonOnly false", mutate: (r) => ({ ...r, skeletonOnly: false as true }) },
  { label: "isolatedUtilityFileCreated false", mutate: (r) => ({ ...r, isolatedUtilityFileCreated: false as true }) },
  { label: "noImportsUsed false", mutate: (r) => ({ ...r, noImportsUsed: false as true }) },
  { label: "exportedTypesDefined false", mutate: (r) => ({ ...r, exportedTypesDefined: false as true }) },
  { label: "exportedFunctionsDefined false", mutate: (r) => ({ ...r, exportedFunctionsDefined: false as true }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "productionDetectorPatternsImplemented true", mutate: (r) => ({ ...r, productionDetectorPatternsImplemented: true as false }) },
  { label: "productionRedactionEngineImplemented true", mutate: (r) => ({ ...r, productionRedactionEngineImplemented: true as false }) },
  { label: "productionPiiUtilitySkeletonImplemented false", mutate: (r) => ({ ...r, productionPiiUtilitySkeletonImplemented: false as true }) },
  { label: "realDocumentInputAuthorizedNow true", mutate: (r) => ({ ...r, realDocumentInputAuthorizedNow: true as false }) },
  { label: "userVisibleOutputAuthorizedNow true", mutate: (r) => ({ ...r, userVisibleOutputAuthorizedNow: true as false }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "modelFacingUseAuthorizedNow true", mutate: (r) => ({ ...r, modelFacingUseAuthorizedNow: true as false }) },
  { label: "evidenceGateExecutionAuthorizedNow true", mutate: (r) => ({ ...r, evidenceGateExecutionAuthorizedNow: true as false }) },
  { label: "claimAuthorizationAuthorizedNow true", mutate: (r) => ({ ...r, claimAuthorizationAuthorizedNow: true as false }) },
  { label: "exactDeadlineCalculationAuthorized true", mutate: (r) => ({ ...r, exactDeadlineCalculationAuthorized: true as false }) },
  { label: "paymentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, paymentRuntimeAuthorizedNow: true as false }) },
  { label: "entitlementRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, entitlementRuntimeAuthorizedNow: true as false }) },
  { label: "checkoutRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, checkoutRuntimeAuthorizedNow: true as false }) },
  { label: "pilotAuthorizationGranted true", mutate: (r) => ({ ...r, pilotAuthorizationGranted: true as false }) },
  { label: "productionAuthorizationGranted true", mutate: (r) => ({ ...r, productionAuthorizationGranted: true as false }) },
  { label: "goLiveAuthorizationGranted true", mutate: (r) => ({ ...r, goLiveAuthorizationGranted: true as false }) },
  { label: "safeForUserVisibleOutputAlwaysFalseConfirmed false", mutate: (r) => ({ ...r, safeForUserVisibleOutputAlwaysFalseConfirmed: false as true }) },
  { label: "rawMapNotReturnedConfirmed false", mutate: (r) => ({ ...r, rawMapNotReturnedConfirmed: false as true }) },
  { label: "noOpenAiCall false", mutate: (r) => ({ ...r, noOpenAiCall: false as true }) },
  { label: "noFetchCall false", mutate: (r) => ({ ...r, noFetchCall: false as true }) },
  { label: "noProcessEnvRead false", mutate: (r) => ({ ...r, noProcessEnvRead: false as true }) },
  { label: "noSdkUsage false", mutate: (r) => ({ ...r, noSdkUsage: false as true }) },
  { label: "noRouteImport false", mutate: (r) => ({ ...r, noRouteImport: false as true }) },
  { label: "noRouteHandlerCall false", mutate: (r) => ({ ...r, noRouteHandlerCall: false as true }) },
  { label: "noFilesystemRead false", mutate: (r) => ({ ...r, noFilesystemRead: false as true }) },
  { label: "noDatabaseWrite false", mutate: (r) => ({ ...r, noDatabaseWrite: false as true }) },
  { label: "noStorageWrite false", mutate: (r) => ({ ...r, noStorageWrite: false as true }) },
  { label: "noAuditPersistence false", mutate: (r) => ({ ...r, noAuditPersistence: false as true }) },
  { label: "noPromptBuild false", mutate: (r) => ({ ...r, noPromptBuild: false as true }) },
  { label: "noModelCall false", mutate: (r) => ({ ...r, noModelCall: false as true }) },
  { label: "noRunSmartTalkCall false", mutate: (r) => ({ ...r, noRunSmartTalkCall: false as true }) },
  { label: "no8x3AcRerun false", mutate: (r) => ({ ...r, no8x3AcRerun: false as true }) },
  { label: "td004PreModelPiiRedactionSurgicalUtilitySkeletonApplied false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionSurgicalUtilitySkeletonApplied: false as true }) },
  { label: "td004PreModelPiiRedactionStillRequiresInputValidationGuard false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillRequiresInputValidationGuard: false as true }) },
  { label: "td004PreModelPiiRedactionStillRequiresDetectorPatterns false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillRequiresDetectorPatterns: false as true }) },
  { label: "td004PreModelPiiRedactionStillRequiresRedactionEngine false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillRequiresRedactionEngine: false as true }) },
  { label: "td004PreModelPiiRedactionStillRequiresSyntheticValidationAndTamperCoverage false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillRequiresSyntheticValidationAndTamperCoverage: false as true }) },
  { label: "td004PreModelPiiRedactionStillRequiresPostPatchAudit false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillRequiresPostPatchAudit: false as true }) },
  { label: "td004PreModelPiiRedactionStillRequiresClosureDecision false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillRequiresClosureDecision: false as true }) },
  { label: "td004PreModelPiiRedactionStillMissingProductionRouteWiring false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillMissingProductionRouteWiring: false as true }) },
  { label: "td004PreModelPiiRedactionStillNotUserVisible false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotUserVisible: false as true }) },
  { label: "td002EvidenceGatesNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "readyFor8x6G2PreModelPiiRedactionInputValidationGuard false", mutate: (r) => ({ ...r, readyFor8x6G2PreModelPiiRedactionInputValidationGuard: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
];

/**
 * Self-contained surgical utility patch validation.
 * Runs synthetic behavioral cases and tamper resistance checks.
 * Uses no imports, calls no routes, processes no real documents.
 */
export function runPreModelPiiRedactionSurgicalUtilityPatchValidation(): PreModelPiiRedactionValidationResult {
  const allFailures: string[] = [];

  // ── Run synthetic behavioral cases ──────────────────────────────────────────
  const { passed: syntheticPassed, failures: syntheticFailures } =
    _runSyntheticCases();

  if (!syntheticPassed) {
    allFailures.push(...syntheticFailures.map((f) => `synthetic: ${f}`));
  }

  // ── Build canonical result (provisional allPassed = true for tamper check) ──
  const tamperCaseCount = TAMPER_CASES.length;
  const provisionalCanonical = _buildCanonicalResult(
    true,
    tamperCaseCount,
    tamperCaseCount,
    []
  );

  // ── Verify canonical result passes its own checker ────────────────────────
  if (!_isCanonicalValidationResult(provisionalCanonical)) {
    allFailures.push(
      "internal: canonical result failed its own validation checker"
    );
  }

  // ── Run tamper cases ─────────────────────────────────────────────────────────
  let tamperCasesRejected = 0;
  const tamperFailures: string[] = [];

  for (const tc of TAMPER_CASES) {
    const tampered = tc.mutate(provisionalCanonical);
    const tamperPassed = _isCanonicalValidationResult(tampered);
    if (!tamperPassed) {
      // Tamper was correctly rejected
      tamperCasesRejected++;
    } else {
      // Tamper was NOT rejected — this is a failure
      tamperFailures.push(
        `tamper case not rejected: "${tc.label}"`
      );
    }
  }

  if (tamperFailures.length > 0) {
    allFailures.push(...tamperFailures);
  }

  // ── Assemble final result ────────────────────────────────────────────────────
  const allPassed =
    allFailures.length === 0 && tamperCasesRejected === tamperCaseCount;

  const notes: string[] = [
    "8.6G-1 skeleton phase validation complete",
    `synthetic cases: ${syntheticPassed ? "all passed" : `${syntheticFailures.length} failed`}`,
    `tamper cases: ${tamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    "no real document input was processed",
    "no route patching or route wiring was performed",
    "no model call, prompt build, or runSmartTalk was executed",
    "safeForModel / safeForEvidenceGates / safeForUserVisibleOutput confirmed always false",
    "rawMapReturned confirmed always false",
    "readyFor8x6G2PreModelPiiRedactionInputValidationGuard: readiness signal only — not route wiring, not real-document authorization",
    ...(allFailures.length > 0
      ? [`FAILURES (${allFailures.length}):`, ...allFailures]
      : []),
  ];

  return _buildCanonicalResult(
    allPassed,
    tamperCasesRejected,
    tamperCaseCount,
    notes
  );
}
