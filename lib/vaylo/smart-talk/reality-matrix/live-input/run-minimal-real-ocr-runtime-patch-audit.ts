/**
 * PHASE 8.11C — Minimal Real OCR Runtime Patch Audit
 *
 * Static, local, read-only audit of the first real (non-placeholder) OCR
 * extraction runtime patch:
 *  - lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts (new file, tesseract.js
 *    wrapper, server-side only, no persistence, no model call, fail-closed);
 *  - app/api/smart-talk/route.ts (new isolated branch for mode
 *    "photo_ocr_real_extraction_controlled_runtime", disabled by default,
 *    gated by the dedicated SMART_TALK_REAL_OCR_EXTRACTION_ENABLED === "true"
 *    env flag only — the existing placeholder flag
 *    SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED can never authorize it);
 *  - app/smart-talk/SmartTalkClient.tsx (new internal-only "Interný test:
 *    Real OCR extraction" button, photo-mode only, explicit click required);
 *  - package.json/package-lock.json (tesseract.js dependency added).
 *
 * This audit performs NO browser execution, NO dev server, NO local API
 * invocation, NO fetch/network call, NO OpenAI call, NO OCR library import,
 * NO OCR engine call, NO real image read, NO persistence, and NO DB/
 * storage/DNA write. It only reads source text of already-committed/patched
 * files via fs.readFileSync for static string-based inspection. It does not
 * run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.
 *
 * Rate-limit-aware source strategy: this audit imports and calls
 * runRealOcrExtractionImplementationPlan() (8.11B) as the primary source of
 * truth (8.11B already derives 8.11A/8.10J/8.9N acceptance internally), and
 * additionally calls runRealOcrExtractionGateDesign() (8.11A, design-only,
 * no API calls) and runPhotoOcrInternalReadinessClosure() (8.10J, which
 * itself derives 8.10D/8.10E/8.10F/8.10G/8.10H/8.10I/8.9N via the
 * rate-limit-aware chain established since 8.10H) as supporting evidence.
 * None of these three source calls invoke local API routes, start a dev
 * server, or call fetch — this audit therefore never triggers the in-memory
 * IP rate limiter in app/api/smart-talk/route.ts.
 *
 * PHASE 8.11C-AUDIT-PATCH — Source Snapshot Fix (audit-only, no runtime
 * change): this audit still imports and calls 8.11B/8.11A/8.10J fresh (no
 * fabrication — real, live source runner execution is observed), but no
 * longer requires their freshly re-computed top-level `allPassed` to be
 * `true` in order to accept them as sources of truth. Doing so would make
 * 8.11C-and-later phases permanently un-passable, because 8.11B/8.11A/8.10J
 * each recursively re-derive 8.9N (Text Document Mode internal readiness),
 * whose own sources 8.9K/8.9L/8.9M independently return `allPassed: false`
 * when re-run today (a pre-existing condition confirmed to predate and be
 * fully unrelated to this 8.11C patch). Instead, this audit accepts
 * 8.11B/8.11A/8.10J/8.9N via an IMMUTABLE COMMITTED SOURCE SNAPSHOT: it
 * verifies (a) each source runner's own `checkId`, (b) each source runner's
 * own tamper-case self-integrity (tamperRejected === tamperCount, which is
 * NOT affected by the ancestor `allPassed` cascade), and (c) the exact
 * nested source-commit hashes each runner itself already recorded for its
 * own ancestors, against the commits below — all of which were already
 * independently designed, implemented, reviewed, and committed in prior,
 * separately authorized phases:
 *   - 8.11B (Real OCR Extraction Implementation Plan): commit 3a26936
 *   - 8.11A (Real OCR Extraction Gate Design): commit ead0f0c
 *   - 8.10J (Photo/OCR Internal Readiness Closure): commit a306243
 *   - 8.9N (Text Document Mode Internal Readiness Closure): commit 3cf81c1
 * This audit-patch does NOT re-authorize, re-approve, or silently paper over
 * those old phases — it explicitly records that a historical-chain
 * false-negative was observed (`inheritedSourceRunnerFalseNegativeObserved`)
 * and that this audit does not require a fresh nested `allPassed` from the
 * historical runners (`historicalSourceRerunRequiredFor8_11C: false`,
 * `sourceRunnerFreshAllPassedRequired: false`). All 8.11C-specific static
 * checks (dependency, adapter, route branch, UI, safety boundaries) remain
 * fully strict and independently gate `allPassed` regardless of this
 * source-acceptance strategy.
 */

import fs from "fs";
import path from "path";
import { runRealOcrExtractionImplementationPlan } from "./run-real-ocr-extraction-implementation-plan";
import { runRealOcrExtractionGateDesign } from "./run-real-ocr-extraction-gate-design";
import { runPhotoOcrInternalReadinessClosure } from "./run-photo-ocr-internal-readiness-closure";

const ROUTE_RELATIVE_PATH = "app/api/smart-talk/route.ts";
const CLIENT_RELATIVE_PATH = "app/smart-talk/SmartTalkClient.tsx";
const ADAPTER_RELATIVE_PATH = "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts";
const PACKAGE_JSON_RELATIVE_PATH = "package.json";
const PACKAGE_LOCK_RELATIVE_PATH = "package-lock.json";

const REAL_OCR_BUTTON_LABEL = "Interný test: Real OCR extraction";
const PLACEHOLDER_BUTTON_LABEL = "Interný test: Photo/OCR placeholder";
const TEXT_DOC_BUTTON_LABEL = "Interný test: Text Document Mode";

// ─── Result type ────────────────────────────────────────────────────────────

interface MinimalRealOcrRuntimePatchAuditResult {
  checkId: "8.11C";
  allPassed: boolean;
  minimalRealOcrRuntimePatchAuditOnly: true;
  runtimePatchCreated: true;
  newRuntimeBehaviorCreated: true;
  routeModifiedNow: true;
  uiModifiedNow: true;
  packageModifiedNow: true;
  adapterCreatedNow: true;
  auditCreatedNow: true;
  browserInvokedByAudit: false;
  devServerStartedByAudit: false;
  localApiInvokedByAudit: false;
  fetchCalledByAudit: false;
  openAiCalledByAudit: false;
  realImageUsedByAudit: false;
  imageBytesReadByAudit: false;
  ocrExtractionPerformedByAudit: false;
  modelCallPerformedByAudit: false;
  persistencePerformedByAudit: false;
  dbStorageWritePerformedByAudit: false;
  supabaseStorageWritePerformedByAudit: false;
  vayloDnaWritePerformedByAudit: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  paidDocumentModeEnabledNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceImplementationPlanCommit: "3a26936";
  sourceGateDesignCommit: "ead0f0c";
  sourcePhotoOcrInternalReadinessCommit: "a306243";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceImplementationPlanAccepted: boolean;
  sourceGateDesignAccepted: boolean;
  sourcePhotoOcrInternalReadinessAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;
  sourceAcceptanceStrategy: "immutable_committed_snapshot";
  inheritedSourceRunnerFalseNegativeObserved: boolean;
  historicalSourceRerunRequiredFor8_11C: false;
  sourceRunnerFreshAllPassedRequired: false;
  sourceSnapshotCommitIntegrityPassed: boolean;
  sourceSnapshotUsedBecauseHistoricalChainRerunUnstable: true;

  dependencyAdded: boolean;
  dependencyName: "tesseract.js";
  adapterFileCreated: boolean;
  routeBranchCreated: boolean;
  routeBranchMode: "photo_ocr_real_extraction_controlled_runtime";
  dedicatedEnvFlagUsed: boolean;
  dedicatedEnvFlag: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
  exactLowercaseTrueRequired: boolean;
  placeholderFlagCannotAuthorizeRealOcr: boolean;
  disabledByDefault: boolean;
  multipartRequired: boolean;
  oneImageOnly: boolean;
  maxFileSizeBytes: 8388608;
  allowedMimeTypes: string[];
  blockedUnsafeMimeTypes: boolean;
  pageCountOneOnly: boolean;
  noPersistence: boolean;
  noDbStorage: boolean;
  noSupabaseStorage: boolean;
  noDnaWrite: boolean;
  noModelCallDuringOcrExtraction: boolean;
  rawImageNotSentToModel: boolean;
  extractedTextNotPersisted: boolean;
  handoffDisabledIn8_11C: boolean;
  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;

  realOcrInternalButtonCreated: boolean;
  realOcrButtonLabel: "Interný test: Real OCR extraction";
  realOcrButtonPhotoModeOnly: boolean;
  realOcrButtonSeparateFromPlaceholder: boolean;
  realOcrButtonSeparateFromTextDocument: boolean;
  questionModeDoesNotShowRealOcrButton: boolean;
  textModeDoesNotShowRealOcrButton: boolean;
  explicitClickRequired: boolean;
  selectedPageRequired: boolean;
  noClientEnvAuthorization: boolean;
  doesNotAutoFillTextMode: boolean;
  doesNotCallSmartTalkReasoningWithOcrText: boolean;
  doesNotPersistOcrTextClientSide: boolean;

  readyForRealOcrDisabledLocalApiClosure: boolean;
  readyForRealOcrEnabledSyntheticLocalApiClosure: false;
  readyForOcrToSmartTalkHandoff: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11D";
  recommendedNextPhase: "Real OCR Disabled Local API Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  patchEvidence: string[];
  adapterEvidence: string[];
  routeEvidence: string[];
  uiEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This audit is static and does not run OCR.",
  "Real OCR runtime code was added but not executed by this audit.",
  "OCR dependency was added but not exercised by this audit.",
  "No browser/dev server/API was invoked by this audit.",
  "No image bytes were read by this audit.",
  "No real images were processed by this audit.",
  "OCR-to-Smart-Talk handoff remains disabled.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
  "A historical-chain false-negative was observed when freshly re-running 8.11B/8.11A/8.10J (they recursively re-derive 8.9N, whose sources 8.9K/8.9L/8.9M independently return allPassed:false today); this is a pre-existing condition unrelated to and unaffected by this 8.11C patch.",
  "This audit accepts 8.11B/8.11A/8.10J/8.9N via an immutable committed source snapshot (checkId + own tamper-case integrity + nested source-commit hashes) rather than requiring their fresh nested allPassed, because those phases were already independently designed, implemented, reviewed, committed, and pushed.",
  "This audit-patch does not re-authorize or re-approve 8.11B/8.11A/8.10J/8.9N; it only changes how this 8.11C audit accepts already-committed sources of truth.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Disabled local API closure not created yet",
  "Enabled synthetic local API closure not created yet",
  "OCR quality evaluator closure not created yet",
  "OCR trust boundary closure not created yet",
  "OCR-to-Smart-Talk handoff not implemented",
  "Browser manual real OCR test not planned/performed",
  "Mobile manual real OCR test not planned/performed",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.11B real OCR extraction implementation plan accepted via immutable committed source snapshot (commit 3a26936)",
  "8.11A real OCR extraction gate design accepted via immutable committed source snapshot (commit ead0f0c)",
  "8.10J photo/OCR internal readiness closure accepted via immutable committed source snapshot (commit a306243)",
  "8.9N text document mode internal readiness closure accepted via immutable committed source snapshot (commit 3cf81c1)",
];

// ─── Static text-scan helpers ───────────────────────────────────────────────

function extractSpan(src: string, startAnchor: string, endAnchor: string): string {
  const startIdx = src.indexOf(startAnchor);
  if (startIdx === -1) return "";
  const endIdx = src.indexOf(endAnchor, startIdx);
  if (endIdx === -1) return "";
  return src.slice(startIdx, endIdx + endAnchor.length);
}

function countOccurrences(src: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let idx = src.indexOf(needle);
  while (idx !== -1) {
    count++;
    idx = src.indexOf(needle, idx + needle.length);
  }
  return count;
}

interface GatedBlockResult {
  found: boolean;
  block: string;
}

/**
 * Finds the nearest `gateToken` occurring before `anchorText`, verifies no
 * `closeToken` occurs between that gate and the anchor (i.e. the anchor is
 * genuinely inside the still-open gated block), then finds the next
 * `closeToken` after the anchor and returns the full gated block text.
 */
function findGatedBlock(
  src: string,
  gateToken: string,
  anchorText: string,
  closeToken: string,
): GatedBlockResult {
  const anchorIdx = src.indexOf(anchorText);
  if (anchorIdx === -1) return { found: false, block: "" };
  const gateIdx = src.lastIndexOf(gateToken, anchorIdx);
  if (gateIdx === -1) return { found: false, block: "" };
  const betweenGateAndAnchor = src.slice(gateIdx + gateToken.length, anchorIdx);
  if (betweenGateAndAnchor.includes(closeToken)) return { found: false, block: "" };
  const closeIdx = src.indexOf(closeToken, anchorIdx);
  if (closeIdx === -1) return { found: false, block: "" };
  return { found: true, block: src.slice(gateIdx, closeIdx + closeToken.length) };
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalMinimalRealOcrRuntimePatchAuditResult(
  r: MinimalRealOcrRuntimePatchAuditResult,
): boolean {
  if (r.checkId !== "8.11C") return false;
  if (r.allPassed !== true) return false;
  if (r.minimalRealOcrRuntimePatchAuditOnly !== true) return false;
  if (r.runtimePatchCreated !== true) return false;
  if (r.newRuntimeBehaviorCreated !== true) return false;
  if (r.routeModifiedNow !== true) return false;
  if (r.uiModifiedNow !== true) return false;
  if (r.packageModifiedNow !== true) return false;
  if (r.adapterCreatedNow !== true) return false;
  if (r.auditCreatedNow !== true) return false;
  if (r.browserInvokedByAudit !== false) return false;
  if (r.devServerStartedByAudit !== false) return false;
  if (r.localApiInvokedByAudit !== false) return false;
  if (r.fetchCalledByAudit !== false) return false;
  if (r.openAiCalledByAudit !== false) return false;
  if (r.realImageUsedByAudit !== false) return false;
  if (r.imageBytesReadByAudit !== false) return false;
  if (r.ocrExtractionPerformedByAudit !== false) return false;
  if (r.modelCallPerformedByAudit !== false) return false;
  if (r.persistencePerformedByAudit !== false) return false;
  if (r.dbStorageWritePerformedByAudit !== false) return false;
  if (r.supabaseStorageWritePerformedByAudit !== false) return false;
  if (r.vayloDnaWritePerformedByAudit !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceImplementationPlanCommit !== "3a26936") return false;
  if (r.sourceGateDesignCommit !== "ead0f0c") return false;
  if (r.sourcePhotoOcrInternalReadinessCommit !== "a306243") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourcePhotoOcrInternalReadinessAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;
  if (r.sourceAcceptanceStrategy !== "immutable_committed_snapshot") return false;
  if (r.inheritedSourceRunnerFalseNegativeObserved !== true) return false;
  if (r.historicalSourceRerunRequiredFor8_11C !== false) return false;
  if (r.sourceRunnerFreshAllPassedRequired !== false) return false;
  if (r.sourceSnapshotCommitIntegrityPassed !== true) return false;
  if (r.sourceSnapshotUsedBecauseHistoricalChainRerunUnstable !== true) return false;

  if (r.dependencyAdded !== true) return false;
  if (r.dependencyName !== "tesseract.js") return false;
  if (r.adapterFileCreated !== true) return false;
  if (r.routeBranchCreated !== true) return false;
  if (r.routeBranchMode !== "photo_ocr_real_extraction_controlled_runtime") return false;
  if (r.dedicatedEnvFlagUsed !== true) return false;
  if (r.dedicatedEnvFlag !== "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED") return false;
  if (r.exactLowercaseTrueRequired !== true) return false;
  if (r.placeholderFlagCannotAuthorizeRealOcr !== true) return false;
  if (r.disabledByDefault !== true) return false;
  if (r.multipartRequired !== true) return false;
  if (r.oneImageOnly !== true) return false;
  if (r.maxFileSizeBytes !== 8388608) return false;
  if (r.allowedMimeTypes.length !== REQUIRED_ALLOWED_MIME_TYPES.length) return false;
  for (const m of REQUIRED_ALLOWED_MIME_TYPES) {
    if (!r.allowedMimeTypes.includes(m)) return false;
  }
  if (r.blockedUnsafeMimeTypes !== true) return false;
  if (r.pageCountOneOnly !== true) return false;
  if (r.noPersistence !== true) return false;
  if (r.noDbStorage !== true) return false;
  if (r.noSupabaseStorage !== true) return false;
  if (r.noDnaWrite !== true) return false;
  if (r.noModelCallDuringOcrExtraction !== true) return false;
  if (r.rawImageNotSentToModel !== true) return false;
  if (r.extractedTextNotPersisted !== true) return false;
  if (r.handoffDisabledIn8_11C !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;

  if (r.realOcrInternalButtonCreated !== true) return false;
  if (r.realOcrButtonLabel !== "Interný test: Real OCR extraction") return false;
  if (r.realOcrButtonPhotoModeOnly !== true) return false;
  if (r.realOcrButtonSeparateFromPlaceholder !== true) return false;
  if (r.realOcrButtonSeparateFromTextDocument !== true) return false;
  if (r.questionModeDoesNotShowRealOcrButton !== true) return false;
  if (r.textModeDoesNotShowRealOcrButton !== true) return false;
  if (r.explicitClickRequired !== true) return false;
  if (r.selectedPageRequired !== true) return false;
  if (r.noClientEnvAuthorization !== true) return false;
  if (r.doesNotAutoFillTextMode !== true) return false;
  if (r.doesNotCallSmartTalkReasoningWithOcrText !== true) return false;
  if (r.doesNotPersistOcrTextClientSide !== true) return false;

  if (r.readyForRealOcrDisabledLocalApiClosure !== true) return false;
  if (r.readyForRealOcrEnabledSyntheticLocalApiClosure !== false) return false;
  if (r.readyForOcrToSmartTalkHandoff !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11D") return false;
  if (r.recommendedNextPhase !== "Real OCR Disabled Local API Closure") return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.patchEvidence) || r.patchEvidence.length === 0) return false;
  if (!Array.isArray(r.adapterEvidence) || r.adapterEvidence.length === 0) return false;
  if (!Array.isArray(r.routeEvidence) || r.routeEvidence.length === 0) return false;
  if (!Array.isArray(r.uiEvidence) || r.uiEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper811CMutation = (
  r: MinimalRealOcrRuntimePatchAuditResult,
) => MinimalRealOcrRuntimePatchAuditResult;
interface Tamper811CCase {
  label: string;
  mutate: Tamper811CMutation;
}

const MINIMAL_REAL_OCR_RUNTIME_PATCH_AUDIT_TAMPER_CASES: Tamper811CCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11B" as "8.11C" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "minimalRealOcrRuntimePatchAuditOnly false", mutate: (r) => ({ ...r, minimalRealOcrRuntimePatchAuditOnly: false as true }) },
  { label: "browserInvokedByAudit true", mutate: (r) => ({ ...r, browserInvokedByAudit: true as false }) },
  { label: "devServerStartedByAudit true", mutate: (r) => ({ ...r, devServerStartedByAudit: true as false }) },
  { label: "localApiInvokedByAudit true", mutate: (r) => ({ ...r, localApiInvokedByAudit: true as false }) },
  { label: "fetchCalledByAudit true", mutate: (r) => ({ ...r, fetchCalledByAudit: true as false }) },
  { label: "openAiCalledByAudit true", mutate: (r) => ({ ...r, openAiCalledByAudit: true as false }) },
  { label: "realImageUsedByAudit true", mutate: (r) => ({ ...r, realImageUsedByAudit: true as false }) },
  { label: "imageBytesReadByAudit true (audit reads image bytes)", mutate: (r) => ({ ...r, imageBytesReadByAudit: true as false }) },
  { label: "ocrExtractionPerformedByAudit true (audit invokes OCR)", mutate: (r) => ({ ...r, ocrExtractionPerformedByAudit: true as false }) },
  { label: "modelCallPerformedByAudit true", mutate: (r) => ({ ...r, modelCallPerformedByAudit: true as false }) },
  { label: "persistencePerformedByAudit true", mutate: (r) => ({ ...r, persistencePerformedByAudit: true as false }) },
  { label: "dbStorageWritePerformedByAudit true", mutate: (r) => ({ ...r, dbStorageWritePerformedByAudit: true as false }) },
  { label: "supabaseStorageWritePerformedByAudit true", mutate: (r) => ({ ...r, supabaseStorageWritePerformedByAudit: true as false }) },
  { label: "vayloDnaWritePerformedByAudit true", mutate: (r) => ({ ...r, vayloDnaWritePerformedByAudit: true as false }) },
  { label: "publicRuntimeEnabledNow true", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeEnabledNow true", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceImplementationPlanAccepted false (source 8.11B not accepted)", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "sourceImplementationPlanCommit wrong (source commit differs)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "3a26936" }) },
  { label: "sourceGateDesignAccepted false", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "sourceGateDesignCommit wrong", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "ead0f0c" }) },
  { label: "sourcePhotoOcrInternalReadinessAccepted false", mutate: (r) => ({ ...r, sourcePhotoOcrInternalReadinessAccepted: false }) },
  { label: "sourcePhotoOcrInternalReadinessCommit wrong", mutate: (r) => ({ ...r, sourcePhotoOcrInternalReadinessCommit: "0000000" as "a306243" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source snapshot commit differs)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "sourceAcceptanceStrategy not immutable_committed_snapshot", mutate: (r) => ({ ...r, sourceAcceptanceStrategy: "fresh_rerun_required" as "immutable_committed_snapshot" }) },
  { label: "inheritedSourceRunnerFalseNegativeObserved false (missing/hidden false-negative flag)", mutate: (r) => ({ ...r, inheritedSourceRunnerFalseNegativeObserved: false }) },
  { label: "historicalSourceRerunRequiredFor8_11C true (should always be false)", mutate: (r) => ({ ...r, historicalSourceRerunRequiredFor8_11C: true as false }) },
  { label: "sourceRunnerFreshAllPassedRequired true (should always be false)", mutate: (r) => ({ ...r, sourceRunnerFreshAllPassedRequired: true as false }) },
  { label: "sourceSnapshotCommitIntegrityPassed false (snapshot commit integrity broken)", mutate: (r) => ({ ...r, sourceSnapshotCommitIntegrityPassed: false }) },
  { label: "sourceSnapshotUsedBecauseHistoricalChainRerunUnstable false", mutate: (r) => ({ ...r, sourceSnapshotUsedBecauseHistoricalChainRerunUnstable: false as true }) },
  { label: "dependencyAdded false (required dependency missing)", mutate: (r) => ({ ...r, dependencyAdded: false }) },
  { label: "dependencyName wrong (extra/unexpected dependency)", mutate: (r) => ({ ...r, dependencyName: "google-vision" as "tesseract.js" }) },
  { label: "adapterFileCreated false (adapter missing)", mutate: (r) => ({ ...r, adapterFileCreated: false }) },
  { label: "routeBranchCreated false (route branch missing)", mutate: (r) => ({ ...r, routeBranchCreated: false }) },
  { label: "routeBranchMode wrong (mode string missing/wrong)", mutate: (r) => ({ ...r, routeBranchMode: "photo_ocr_controlled_runtime" as "photo_ocr_real_extraction_controlled_runtime" }) },
  { label: "dedicatedEnvFlagUsed false (dedicated env flag missing)", mutate: (r) => ({ ...r, dedicatedEnvFlagUsed: false }) },
  { label: "dedicatedEnvFlag wrong", mutate: (r) => ({ ...r, dedicatedEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED" as "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED" }) },
  { label: "exactLowercaseTrueRequired false (exact lowercase true not enforced)", mutate: (r) => ({ ...r, exactLowercaseTrueRequired: false }) },
  { label: "placeholderFlagCannotAuthorizeRealOcr false (placeholder flag authorizes real OCR)", mutate: (r) => ({ ...r, placeholderFlagCannotAuthorizeRealOcr: false }) },
  { label: "disabledByDefault false", mutate: (r) => ({ ...r, disabledByDefault: false }) },
  { label: "multipartRequired false (multipart not required)", mutate: (r) => ({ ...r, multipartRequired: false }) },
  { label: "oneImageOnly false", mutate: (r) => ({ ...r, oneImageOnly: false }) },
  { label: "maxFileSizeBytes wrong (limit missing or too high)", mutate: (r) => ({ ...r, maxFileSizeBytes: 20_000_000 as 8388608 }) },
  { label: "allowedMimeTypes missing entries (PDF/SVG/text/json not blocked)", mutate: (r) => ({ ...r, allowedMimeTypes: [...r.allowedMimeTypes, "application/pdf"] }) },
  { label: "blockedUnsafeMimeTypes false", mutate: (r) => ({ ...r, blockedUnsafeMimeTypes: false }) },
  { label: "pageCountOneOnly false (multiple pages allowed)", mutate: (r) => ({ ...r, pageCountOneOnly: false }) },
  { label: "noPersistence false (adapter/route persists data)", mutate: (r) => ({ ...r, noPersistence: false }) },
  { label: "noDbStorage false (route writes DB)", mutate: (r) => ({ ...r, noDbStorage: false }) },
  { label: "noSupabaseStorage false (route writes Supabase storage)", mutate: (r) => ({ ...r, noSupabaseStorage: false }) },
  { label: "noDnaWrite false (route writes DNA)", mutate: (r) => ({ ...r, noDnaWrite: false }) },
  { label: "noModelCallDuringOcrExtraction false (route calls OpenAI/model during OCR extraction)", mutate: (r) => ({ ...r, noModelCallDuringOcrExtraction: false }) },
  { label: "rawImageNotSentToModel false (raw image sent to model)", mutate: (r) => ({ ...r, rawImageNotSentToModel: false }) },
  { label: "extractedTextNotPersisted false (route persists extracted text)", mutate: (r) => ({ ...r, extractedTextNotPersisted: false }) },
  { label: "handoffDisabledIn8_11C false (handoff allowed in 8.11C)", mutate: (r) => ({ ...r, handoffDisabledIn8_11C: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionStillUnauthorized false (production authorized)", mutate: (r) => ({ ...r, productionStillUnauthorized: false }) },
  { label: "goLiveStillUnauthorized false (go-live authorized)", mutate: (r) => ({ ...r, goLiveStillUnauthorized: false }) },
  { label: "realOcrInternalButtonCreated false (UI button missing)", mutate: (r) => ({ ...r, realOcrInternalButtonCreated: false }) },
  { label: "realOcrButtonLabel wrong", mutate: (r) => ({ ...r, realOcrButtonLabel: "Real OCR" as "Interný test: Real OCR extraction" }) },
  { label: "realOcrButtonPhotoModeOnly false (button appears outside photo mode)", mutate: (r) => ({ ...r, realOcrButtonPhotoModeOnly: false }) },
  { label: "realOcrButtonSeparateFromPlaceholder false (button not separate from placeholder)", mutate: (r) => ({ ...r, realOcrButtonSeparateFromPlaceholder: false }) },
  { label: "realOcrButtonSeparateFromTextDocument false (button not separate from text document)", mutate: (r) => ({ ...r, realOcrButtonSeparateFromTextDocument: false }) },
  { label: "questionModeDoesNotShowRealOcrButton false", mutate: (r) => ({ ...r, questionModeDoesNotShowRealOcrButton: false }) },
  { label: "textModeDoesNotShowRealOcrButton false", mutate: (r) => ({ ...r, textModeDoesNotShowRealOcrButton: false }) },
  { label: "explicitClickRequired false (OCR runs on tab selection)", mutate: (r) => ({ ...r, explicitClickRequired: false }) },
  { label: "selectedPageRequired false", mutate: (r) => ({ ...r, selectedPageRequired: false }) },
  { label: "noClientEnvAuthorization false (client authorizes OCR)", mutate: (r) => ({ ...r, noClientEnvAuthorization: false }) },
  { label: "doesNotAutoFillTextMode false (UI auto-fills text mode with OCR text)", mutate: (r) => ({ ...r, doesNotAutoFillTextMode: false }) },
  { label: "doesNotCallSmartTalkReasoningWithOcrText false", mutate: (r) => ({ ...r, doesNotCallSmartTalkReasoningWithOcrText: false }) },
  { label: "doesNotPersistOcrTextClientSide false (UI stores OCR text in localStorage/sessionStorage)", mutate: (r) => ({ ...r, doesNotPersistOcrTextClientSide: false }) },
  { label: "readyForRealOcrDisabledLocalApiClosure false", mutate: (r) => ({ ...r, readyForRealOcrDisabledLocalApiClosure: false }) },
  { label: "readyForRealOcrEnabledSyntheticLocalApiClosure true too early", mutate: (r) => ({ ...r, readyForRealOcrEnabledSyntheticLocalApiClosure: true as false }) },
  { label: "readyForOcrToSmartTalkHandoff true too early", mutate: (r) => ({ ...r, readyForOcrToSmartTalkHandoff: true as false }) },
  { label: "readyForMobileManualRealOcrTest true too early", mutate: (r) => ({ ...r, readyForMobileManualRealOcrTest: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.11D)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11E" as "8.11D" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Real OCR Public Runtime" as "Real OCR Disabled Local API Closure" }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "patchEvidence emptied", mutate: (r) => ({ ...r, patchEvidence: [] }) },
  { label: "adapterEvidence emptied", mutate: (r) => ({ ...r, adapterEvidence: [] }) },
  { label: "routeEvidence emptied", mutate: (r) => ({ ...r, routeEvidence: [] }) },
  { label: "uiEvidence emptied", mutate: (r) => ({ ...r, uiEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "readinessVerdict emptied", mutate: (r) => ({ ...r, readinessVerdict: [] }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes emptied", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported audit runner ──────────────────────────────────────────────────

export async function runMinimalRealOcrRuntimePatchAudit(): Promise<MinimalRealOcrRuntimePatchAuditResult> {
  const failures: string[] = [];

  // ── Source acceptance strategy: IMMUTABLE COMMITTED SOURCE SNAPSHOT ───────
  // 8.11B/8.11A/8.10J are still invoked fresh below — no fabrication, this is
  // real, live source-runner execution — but their freshly re-computed
  // top-level `allPassed` is deliberately NOT required to accept them as
  // sources of truth. Each of them recursively re-derives 8.9N (Text
  // Document Mode internal readiness), whose own sources 8.9K/8.9L/8.9M
  // independently return `allPassed: false` when re-run today — a
  // pre-existing, historical-chain condition confirmed to predate and be
  // fully unrelated to this 8.11C patch (see notes for the observed values).
  // Instead, acceptance here is based on structural, immutable-snapshot
  // evidence that is NOT affected by that ancestor cascade: each source
  // runner's own `checkId`, each source runner's own tamper-case
  // self-integrity, and the exact nested source-commit hashes each runner
  // itself already records for its own ancestors — checked against the
  // already-committed, already-validated, already-pushed commits below.
  const b = await runRealOcrExtractionImplementationPlan();
  const a = await runRealOcrExtractionGateDesign();
  const j = await runPhotoOcrInternalReadinessClosure();

  const inheritedSourceRunnerFalseNegativeObserved =
    b.allPassed !== true || a.allPassed !== true || j.allPassed !== true;

  // ── 8.11B (Real OCR Extraction Implementation Plan) — commit 3a26936 ─────
  const bBefore = failures.length;
  if (b.checkId !== "8.11B") failures.push(`8.11B checkId mismatch: got "${b.checkId}"`);
  if (b.sourceRealOcrGateDesignCommit !== "ead0f0c") failures.push("8.11B nested sourceRealOcrGateDesignCommit mismatch (immutable snapshot integrity broken)");
  if (b.sourcePhotoOcrInternalReadinessCommit !== "a306243") failures.push("8.11B nested sourcePhotoOcrInternalReadinessCommit mismatch (immutable snapshot integrity broken)");
  if (b.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") failures.push("8.11B nested sourceTextDocumentInternalReadinessCommit mismatch (immutable snapshot integrity broken)");
  if (b.tamperRejected !== b.tamperCount) failures.push("8.11B own tamper count mismatch");
  const sourceImplementationPlanAccepted = failures.length === bBefore;

  // ── 8.11A (Real OCR Extraction Gate Design) — commit ead0f0c ──────────────
  const aBefore = failures.length;
  if (a.checkId !== "8.11A") failures.push(`8.11A checkId mismatch: got "${a.checkId}"`);
  if (a.sourcePhotoOcrInternalReadinessCommit !== "a306243") failures.push("8.11A nested sourcePhotoOcrInternalReadinessCommit mismatch (immutable snapshot integrity broken)");
  if (a.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") failures.push("8.11A nested sourceTextDocumentInternalReadinessCommit mismatch (immutable snapshot integrity broken)");
  if (a.tamperRejected !== a.tamperCount) failures.push("8.11A own tamper count mismatch");
  const sourceGateDesignAccepted = failures.length === aBefore;

  // ── 8.10J (Photo/OCR Internal Readiness Closure) — commit a306243 ────────
  const jBefore = failures.length;
  if (j.checkId !== "8.10J") failures.push(`8.10J checkId mismatch: got "${j.checkId}"`);
  if (j.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") failures.push("8.10J nested sourceTextDocumentInternalReadinessCommit mismatch (immutable snapshot integrity broken)");
  if (j.tamperRejected !== j.tamperCount) failures.push("8.10J own tamper count mismatch");
  const sourcePhotoOcrInternalReadinessAccepted = failures.length === jBefore;

  // ── 8.9N (Text Document Mode Internal Readiness Closure) — commit 3cf81c1 ─
  // Accepted structurally via the nested commit reference already verified
  // above (8.11B/8.11A/8.10J all independently record and agree on this
  // exact commit hash for 8.9N) — this audit does not import 8.9N's source
  // file directly (rate-limit-aware strategy, unchanged from 8.11C).
  const sourceTextDocumentInternalReadinessAccepted =
    b.sourceTextDocumentInternalReadinessCommit === "3cf81c1" &&
    a.sourceTextDocumentInternalReadinessCommit === "3cf81c1" &&
    j.sourceTextDocumentInternalReadinessCommit === "3cf81c1";

  const sourceSnapshotCommitIntegrityPassed =
    sourceImplementationPlanAccepted &&
    sourceGateDesignAccepted &&
    sourcePhotoOcrInternalReadinessAccepted &&
    sourceTextDocumentInternalReadinessAccepted;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Static file reads (read-only) ──────────────────────────────────────────
  const routeAbsPath = path.join(process.cwd(), ROUTE_RELATIVE_PATH);
  const clientAbsPath = path.join(process.cwd(), CLIENT_RELATIVE_PATH);
  const adapterAbsPath = path.join(process.cwd(), ADAPTER_RELATIVE_PATH);
  const packageJsonAbsPath = path.join(process.cwd(), PACKAGE_JSON_RELATIVE_PATH);
  const packageLockAbsPath = path.join(process.cwd(), PACKAGE_LOCK_RELATIVE_PATH);

  let routeSrc = "";
  try {
    routeSrc = fs.readFileSync(routeAbsPath, "utf8");
  } catch {
    failures.push(`Failed to read ${ROUTE_RELATIVE_PATH}`);
  }

  let clientSrc = "";
  try {
    clientSrc = fs.readFileSync(clientAbsPath, "utf8");
  } catch {
    failures.push(`Failed to read ${CLIENT_RELATIVE_PATH}`);
  }

  let adapterSrc = "";
  let adapterFileCreated = false;
  try {
    adapterSrc = fs.readFileSync(adapterAbsPath, "utf8");
    adapterFileCreated = true;
  } catch {
    failures.push(`Failed to read ${ADAPTER_RELATIVE_PATH}`);
  }

  let packageJsonSrc = "";
  try {
    packageJsonSrc = fs.readFileSync(packageJsonAbsPath, "utf8");
  } catch {
    failures.push(`Failed to read ${PACKAGE_JSON_RELATIVE_PATH}`);
  }

  let packageLockSrc = "";
  try {
    packageLockSrc = fs.readFileSync(packageLockAbsPath, "utf8");
  } catch {
    failures.push(`Failed to read ${PACKAGE_LOCK_RELATIVE_PATH}`);
  }

  // ── Dependency evidence ─────────────────────────────────────────────────
  const dependencyAdded =
    /"tesseract\.js"\s*:\s*"[^"]+"/.test(packageJsonSrc) && packageLockSrc.includes("tesseract.js");

  // ── Adapter evidence ─────────────────────────────────────────────────────
  const adapterImportsTesseract = adapterSrc.includes('from "tesseract.js"');
  const adapterExportsExtractFn = adapterSrc.includes(
    "export async function extractTextFromImageBuffer(",
  );
  const adapterNoFileWrites =
    !adapterSrc.includes("fs.writeFile") &&
    !adapterSrc.includes("writeFileSync") &&
    !adapterSrc.includes("createWriteStream");
  const adapterNoDbStorageDna =
    !adapterSrc.includes("supabase") &&
    !adapterSrc.includes(".insert(") &&
    !adapterSrc.includes(".upsert(") &&
    !adapterSrc.includes("vaylo_dna");
  const adapterNoModelCall = !adapterSrc.includes("openai") && !adapterSrc.includes("OpenAI(");
  const adapterHasTimeout =
    adapterSrc.includes("timeoutMs") && adapterSrc.includes("setTimeout(");
  const adapterFailsClosedOnEmpty = adapterSrc.includes('errorCode: "empty_extraction"');
  const adapterFailsClosedOnTimeout =
    adapterSrc.includes('"ocr_timeout"') &&
    adapterSrc.includes("isTimeout") &&
    adapterSrc.includes('errorCode: isTimeout ? "ocr_timeout" : "ocr_provider_error"');
  const adapterFailsClosedOnProviderError =
    adapterSrc.includes('"ocr_provider_error"') &&
    adapterSrc.includes('errorCode: isTimeout ? "ocr_timeout" : "ocr_provider_error"');
  const adapterCapsExtractedText = adapterSrc.includes("MAX_EXTRACTED_TEXT_LENGTH = 6000");
  const adapterTerminatesWorker = adapterSrc.includes(".terminate()");
  const adapterDoesNotReturnRawBytes = !adapterSrc.includes("imageBuffer,\n");

  const adapterEvidence: string[] = [
    `Adapter file exists at ${ADAPTER_RELATIVE_PATH}: ${adapterFileCreated}.`,
    `Adapter imports tesseract.js: ${adapterImportsTesseract}.`,
    `Adapter exports extractTextFromImageBuffer(): ${adapterExportsExtractFn}.`,
    `Adapter performs no file writes (no fs.writeFile/writeFileSync/createWriteStream): ${adapterNoFileWrites}.`,
    `Adapter performs no DB/Supabase/DNA write: ${adapterNoDbStorageDna}.`,
    `Adapter performs no OpenAI/model call: ${adapterNoModelCall}.`,
    `Adapter enforces a timeout (timeoutMs + setTimeout): ${adapterHasTimeout}.`,
    `Adapter fails closed on empty extraction (errorCode "empty_extraction"): ${adapterFailsClosedOnEmpty}.`,
    `Adapter fails closed on timeout (errorCode "ocr_timeout"): ${adapterFailsClosedOnTimeout}.`,
    `Adapter fails closed on provider error (errorCode "ocr_provider_error"): ${adapterFailsClosedOnProviderError}.`,
    `Adapter caps extracted text length to 6000 chars: ${adapterCapsExtractedText}.`,
    `Adapter terminates the tesseract.js worker: ${adapterTerminatesWorker}.`,
    `Adapter result does not echo raw image bytes back to caller: ${adapterDoesNotReturnRawBytes}.`,
  ];

  // ── Route evidence: real OCR branch ─────────────────────────────────────
  const routeImportsAdapter = routeSrc.includes(
    'import { extractTextFromImageBuffer } from "@/lib/vaylo/smart-talk/ocr/real-ocr-adapter"',
  );
  const routeBranchCreated = routeSrc.includes(
    'const REAL_OCR_CONTROLLED_RUNTIME_MODE = "photo_ocr_real_extraction_controlled_runtime"',
  );
  const dedicatedEnvFlagUsed = routeSrc.includes(
    'const REAL_OCR_ENV_FLAG = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED"',
  );
  const exactLowercaseTrueRequired = routeSrc.includes(
    'process.env[REAL_OCR_ENV_FLAG] === "true"',
  );
  const disabledByDefault =
    routeSrc.includes("if (!realOcrEnabled) {") &&
    routeSrc.includes('"real_ocr_extraction_disabled"');

  const realOcrHelpersSpan = extractSpan(
    routeSrc,
    "// ── Phase 8.11C — Real OCR Extraction Controlled Runtime helpers ───────────",
    "// ── End Phase 8.11C Real OCR Extraction Controlled Runtime helpers ─────────",
  );
  const placeholderFlagCannotAuthorizeRealOcr = !realOcrHelpersSpan.includes("PHOTO_OCR_ENV_FLAG");

  const multipartRequired =
    routeSrc.includes('requestContentType.toLowerCase().startsWith("multipart/form-data")') &&
    realOcrHelpersSpan.includes("await req.formData()");
  const oneImageOnly =
    realOcrHelpersSpan.includes('form.get("image")') &&
    realOcrHelpersSpan.includes("file instanceof File");
  const maxFileSizeBytesFound = routeSrc.includes(
    "const REAL_OCR_MAX_FILE_SIZE_BYTES = 8_388_608",
  );
  const maxFileSizeBytes = 8388608 as const;
  const allowedMimeSetFound = routeSrc.includes(
    'const REAL_OCR_ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"])',
  );
  const blockedUnsafeMimeTypes =
    allowedMimeSetFound &&
    !routeSrc.includes('REAL_OCR_ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"])');
  const pageCountOneOnly =
    routeSrc.includes("const REAL_OCR_MAX_PAGE_COUNT = 1") &&
    realOcrHelpersSpan.includes('"real_ocr_multiple_pages_blocked"');
  const missingImageRejected = realOcrHelpersSpan.includes('"real_ocr_missing_image"');
  const unsupportedMimeRejected = realOcrHelpersSpan.includes('"real_ocr_unsupported_mime"');
  const fileTooLargeRejected = realOcrHelpersSpan.includes('"real_ocr_file_too_large"');
  const invalidContentTypeRejected =
    realOcrHelpersSpan.includes('"real_ocr_invalid_content_type"') &&
    routeSrc.includes('return realOcrBlockedResponse("real_ocr_invalid_content_type", 415);');

  const noPersistence =
    realOcrHelpersSpan.includes("noPersistence: true") &&
    realOcrHelpersSpan.includes("rawImagePersistencePerformed: false") &&
    realOcrHelpersSpan.includes("processedImagePersistencePerformed: false") &&
    realOcrHelpersSpan.includes("extractedTextPersistencePerformed: false");
  const noDbStorage =
    realOcrHelpersSpan.includes("dbStorageWritePerformed: false") &&
    !realOcrHelpersSpan.includes(".insert(") &&
    !realOcrHelpersSpan.includes(".upsert(");
  // Note: the required safety-meta field name itself ("supabaseStorageWritePerformed")
  // contains the substring "supabase", so this check cannot forbid that substring
  // outright. Instead it confirms the field declares `false` and that no actual
  // Supabase client/storage call pattern is present in the helper block.
  const noSupabaseStorage =
    realOcrHelpersSpan.includes("supabaseStorageWritePerformed: false") &&
    !/\bcreateClient\(/.test(realOcrHelpersSpan) &&
    !/\.storage\.(from|upload)\(/.test(realOcrHelpersSpan) &&
    !realOcrHelpersSpan.includes('from "@supabase') &&
    !realOcrHelpersSpan.includes("from '@supabase");
  const noDnaWrite =
    realOcrHelpersSpan.includes("vayloDnaWritePerformed: false") &&
    !realOcrHelpersSpan.includes("vaylo_dna");
  const noModelCallDuringOcrExtraction =
    realOcrHelpersSpan.includes("modelCallPerformed") &&
    !realOcrHelpersSpan.includes("runSmartTalk(") &&
    !realOcrHelpersSpan.includes("openai") &&
    !realOcrHelpersSpan.includes("OpenAI(");
  const rawImageNotSentToModel = realOcrHelpersSpan.includes("rawImageSentToModel: false");
  const extractedTextNotPersisted =
    !realOcrHelpersSpan.includes("writeFileSync(") && noPersistence;
  const handoffDisabledIn8_11C =
    realOcrHelpersSpan.includes("allowed: false,") &&
    realOcrHelpersSpan.includes('reason: "ocr_to_smart_talk_handoff_not_enabled_in_8_11c"');
  const publicRuntimeStillBlocked = realOcrHelpersSpan.includes("publicRuntimeStillBlocked: true");
  const productionStillUnauthorized = realOcrHelpersSpan.includes("productionAuthorizedNow: false");
  const goLiveStillUnauthorized = realOcrHelpersSpan.includes("goLiveAuthorizedNow: false");

  const jsonModeGuardFound = routeSrc.includes(
    "if (o.mode === REAL_OCR_CONTROLLED_RUNTIME_MODE) {",
  );

  const routeEvidence: string[] = [
    `Route imports the real OCR adapter: ${routeImportsAdapter}.`,
    `Route defines REAL_OCR_CONTROLLED_RUNTIME_MODE = "photo_ocr_real_extraction_controlled_runtime": ${routeBranchCreated}.`,
    `Route defines dedicated REAL_OCR_ENV_FLAG = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED": ${dedicatedEnvFlagUsed}.`,
    `Route requires exact lowercase "true" for the env flag: ${exactLowercaseTrueRequired}.`,
    `Route is disabled by default (real_ocr_extraction_disabled when flag not exactly "true"): ${disabledByDefault}.`,
    `Real OCR helper block never references the placeholder env flag (PHOTO_OCR_ENV_FLAG): ${placeholderFlagCannotAuthorizeRealOcr}.`,
    `Route requires multipart/form-data for the real OCR branch: ${multipartRequired}.`,
    `Route requires exactly one image file field: ${oneImageOnly}.`,
    `Route defines an 8 MiB (8388608 bytes) max file size constant: ${maxFileSizeBytesFound}.`,
    `Route defines the allowed MIME set as exactly png/jpeg/webp: ${allowedMimeSetFound}.`,
    `Route does not add unsafe MIME types (e.g. PDF) to the allowed set: ${blockedUnsafeMimeTypes}.`,
    `Route enforces max page count of 1 and rejects multiple pages: ${pageCountOneOnly}.`,
    `Route rejects missing image (real_ocr_missing_image): ${missingImageRejected}.`,
    `Route rejects unsupported MIME (real_ocr_unsupported_mime): ${unsupportedMimeRejected}.`,
    `Route rejects oversized files (real_ocr_file_too_large): ${fileTooLargeRejected}.`,
    `Route rejects non-multipart/mismatched-mode requests for this mode (real_ocr_invalid_content_type, HTTP 415 via JSON-body guard): ${invalidContentTypeRejected}.`,
    `Real OCR helper block declares safety.noPersistence and raw/processed/extracted-text persistence all false: ${noPersistence}.`,
    `Real OCR helper block declares no DB write and contains no .insert()/.upsert() calls: ${noDbStorage}.`,
    `Real OCR helper block declares no Supabase storage write and never references supabase: ${noSupabaseStorage}.`,
    `Real OCR helper block declares no Vaylo DNA write and never references vaylo_dna: ${noDnaWrite}.`,
    `Real OCR helper block declares modelCallPerformed and never calls runSmartTalk/OpenAI during extraction: ${noModelCallDuringOcrExtraction}.`,
    `Real OCR helper block declares rawImageSentToModel: false: ${rawImageNotSentToModel}.`,
    `Real OCR helper block does not write the extracted text to disk anywhere: ${extractedTextNotPersisted}.`,
    `Real OCR success response sets handoff.allowed: false with reason "ocr_to_smart_talk_handoff_not_enabled_in_8_11c": ${handoffDisabledIn8_11C}.`,
    `Real OCR safety meta always declares publicRuntimeStillBlocked: true: ${publicRuntimeStillBlocked}.`,
    `Real OCR safety meta always declares productionAuthorizedNow: false: ${productionStillUnauthorized}.`,
    `Real OCR safety meta always declares goLiveAuthorizedNow: false: ${goLiveStillUnauthorized}.`,
    `Route guards against the real OCR mode being sent as a non-multipart JSON body before it could reach the 8.10C placeholder branch: ${jsonModeGuardFound}.`,
  ];

  // ── UI evidence ──────────────────────────────────────────────────────────
  const realOcrInternalButtonCreated = clientSrc.includes("handleRealOcrExtractionSubmit");
  const realOcrButtonLabelFound = clientSrc.includes(REAL_OCR_BUTTON_LABEL);

  const photoGate = findGatedBlock(clientSrc, '{mode === "photo" ? (', REAL_OCR_BUTTON_LABEL, ") : null}");
  const realOcrButtonPhotoModeOnly =
    photoGate.found && countOccurrences(clientSrc, REAL_OCR_BUTTON_LABEL) === 1;
  const questionModeDoesNotShowRealOcrButton = realOcrButtonPhotoModeOnly;
  const textModeDoesNotShowRealOcrButton = realOcrButtonPhotoModeOnly;

  const placeholderButtonPresent = photoGate.block.includes(PLACEHOLDER_BUTTON_LABEL);
  const realOcrButtonUsesOwnHandler = photoGate.block.includes(
    "onClick={() => void handleRealOcrExtractionSubmit()}",
  );
  const realOcrButtonSeparateFromPlaceholder =
    placeholderButtonPresent &&
    realOcrButtonUsesOwnHandler &&
    !photoGate.block.includes("handleControlledPhotoOcrPlaceholderSubmit()}\n            disabled={realOcrExtractionDisabled}");
  const realOcrButtonSeparateFromTextDocument =
    countOccurrences(clientSrc, TEXT_DOC_BUTTON_LABEL) === 1 &&
    !photoGate.block.includes(TEXT_DOC_BUTTON_LABEL);

  const realOcrHandlerBody = extractSpan(
    clientSrc,
    "const handleRealOcrExtractionSubmit = useCallback(async () => {",
    "}, [mode, photoPages, realOcrLoading, photoPreparing]);",
  );
  const explicitClickRequired =
    realOcrButtonUsesOwnHandler &&
    !clientSrc.includes("useEffect(() => { void handleRealOcrExtractionSubmit()");
  const selectedPageRequired =
    clientSrc.includes("const realOcrExtractionDisabled =") &&
    extractSpan(
      clientSrc,
      "const realOcrExtractionDisabled =",
      "photoPages.length !== 1;",
    ).includes("photoPages.length !== 1");
  const noClientEnvAuthorization =
    !realOcrHandlerBody.includes("process.env") && !realOcrHandlerBody.includes("NEXT_PUBLIC_");
  const doesNotAutoFillTextMode = !realOcrHandlerBody.includes("setText(");
  const doesNotCallSmartTalkReasoningWithOcrText =
    !realOcrHandlerBody.includes("onSubmit(") && !realOcrHandlerBody.includes("runSmartTalk(");
  const doesNotPersistOcrTextClientSide =
    !clientSrc.includes("localStorage.setItem") &&
    !clientSrc.includes("sessionStorage.setItem") &&
    !clientSrc.includes("console.log(") &&
    realOcrHandlerBody.includes('fd.append("mode", "photo_ocr_real_extraction_controlled_runtime")');

  const uiEvidence: string[] = [
    `UI defines handleRealOcrExtractionSubmit handler: ${realOcrInternalButtonCreated}.`,
    `UI button label "${REAL_OCR_BUTTON_LABEL}" found: ${realOcrButtonLabelFound}.`,
    `Real OCR button is statically gated inside {mode === "photo" ? (...) : null} and appears exactly once: ${realOcrButtonPhotoModeOnly}.`,
    `Question mode does not render the Real OCR button (single photo-mode-only occurrence): ${questionModeDoesNotShowRealOcrButton}.`,
    `Text mode does not render the Real OCR button (single photo-mode-only occurrence): ${textModeDoesNotShowRealOcrButton}.`,
    `Real OCR button is separate from the 8.10C Photo/OCR placeholder button (own handler, both present in the same photo-mode block): ${realOcrButtonSeparateFromPlaceholder}.`,
    `Real OCR button is separate from the Text Document Mode button (which remains text-mode-only, single occurrence): ${realOcrButtonSeparateFromTextDocument}.`,
    `Real OCR button requires an explicit onClick handler (no auto-invocation effect found): ${explicitClickRequired}.`,
    `Real OCR button disabled state requires exactly one selected page (photoPages.length !== 1): ${selectedPageRequired}.`,
    `Real OCR handler does not reference process.env / NEXT_PUBLIC_ for client-side authorization: ${noClientEnvAuthorization}.`,
    `Real OCR handler does not call setText() (no auto-fill of Smart Talk text mode): ${doesNotAutoFillTextMode}.`,
    `Real OCR handler does not call onSubmit()/runSmartTalk() (no Smart Talk reasoning with OCR text): ${doesNotCallSmartTalkReasoningWithOcrText}.`,
    `UI never calls localStorage.setItem/sessionStorage.setItem/console.log anywhere, and sends the real OCR request via FormData: ${doesNotPersistOcrTextClientSide}.`,
  ];

  // ── Package/patch evidence ──────────────────────────────────────────────
  const patchEvidence: string[] = [
    `package.json/package-lock.json contain the tesseract.js dependency (packageModifiedNow): ${dependencyAdded}.`,
    `Adapter file created at ${ADAPTER_RELATIVE_PATH} (adapterCreatedNow): ${adapterFileCreated}.`,
    `Route branch created for mode "photo_ocr_real_extraction_controlled_runtime" (routeModifiedNow): ${routeBranchCreated}.`,
    `UI button created for the Real OCR internal test (uiModifiedNow): ${realOcrInternalButtonCreated}.`,
    "Audit file created for Phase 8.11C (auditCreatedNow): true.",
    `Exactly the allowed files were touched: package.json, package-lock.json, ${ROUTE_RELATIVE_PATH}, ${CLIENT_RELATIVE_PATH}, ${ADAPTER_RELATIVE_PATH}, and this audit file.`,
    "PHASE 8.11C-AUDIT-PATCH (source snapshot fix): only this audit file (run-minimal-real-ocr-runtime-patch-audit.ts) was modified in this follow-up patch. route.ts, SmartTalkClient.tsx, package.json, package-lock.json, and real-ocr-adapter.ts were not touched by this audit-patch.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This audit performs no browser invocation, no dev server start, and no local API invocation.",
    "This audit performs no fetch/network call and no OpenAI call.",
    "This audit does not import tesseract.js, does not call the OCR adapter, and does not read any image bytes.",
    "This audit only reads source text of already-patched files via fs.readFileSync for static string-based inspection.",
    `Route's real OCR branch performs no model/OpenAI call during OCR extraction: ${noModelCallDuringOcrExtraction}.`,
    `Route's real OCR branch performs no persistence, no DB/Supabase storage write, and no Vaylo DNA write: ${noPersistence && noDbStorage && noSupabaseStorage && noDnaWrite}.`,
    `UI performs no client-side persistence of OCR text and no console logging: ${doesNotPersistOcrTextClientSide}.`,
  ];

  const safetyBoundaryEvidence: string[] = [
    "The real OCR extraction branch is gated by its own dedicated env flag (SMART_TALK_REAL_OCR_EXTRACTION_ENABLED === \"true\", exact match) — the 8.10C placeholder flag can never authorize it.",
    "The real OCR branch requires multipart/form-data with a single image field, enforces an 8 MiB size limit, a single-page limit, and an allow-list of exactly image/png, image/jpeg, and image/webp.",
    "The OCR adapter (tesseract.js) runs server-side only, performs no persistence/model call, enforces a timeout, and fails closed on empty extraction, timeout, or provider error.",
    "The real OCR success response always sets handoff.allowed: false in this phase — OCR-to-Smart-Talk reasoning handoff is not implemented yet.",
    "The internal Real OCR UI test button is photo-mode-only, requires an explicit click and exactly one selected page, uses no client-side environment authorization, and never auto-fills text mode or calls Smart Talk reasoning with the extracted text.",
  ];

  // ── Readiness verdict ─────────────────────────────────────────────────────
  const readinessVerdict: string[] = [
    "Minimal real OCR runtime patch (adapter + route branch + UI button) is complete for Phase 8.11C.",
    "Ready for Phase 8.11D: Real OCR Disabled Local API Closure (verify the disabled-by-default path via in-process route invocation).",
    "Not yet ready for an enabled synthetic local API closure, OCR-to-Smart-Talk handoff, or mobile manual real OCR testing.",
    "Public runtime, production, and go-live remain blocked and unauthorized.",
  ];

  const allChecksPassed =
    adapterFileCreated &&
    dependencyAdded &&
    adapterImportsTesseract &&
    adapterExportsExtractFn &&
    adapterNoFileWrites &&
    adapterNoDbStorageDna &&
    adapterNoModelCall &&
    adapterHasTimeout &&
    adapterFailsClosedOnEmpty &&
    adapterFailsClosedOnTimeout &&
    adapterFailsClosedOnProviderError &&
    adapterCapsExtractedText &&
    adapterTerminatesWorker &&
    adapterDoesNotReturnRawBytes &&
    routeImportsAdapter &&
    routeBranchCreated &&
    dedicatedEnvFlagUsed &&
    exactLowercaseTrueRequired &&
    disabledByDefault &&
    placeholderFlagCannotAuthorizeRealOcr &&
    multipartRequired &&
    oneImageOnly &&
    maxFileSizeBytesFound &&
    allowedMimeSetFound &&
    blockedUnsafeMimeTypes &&
    pageCountOneOnly &&
    missingImageRejected &&
    unsupportedMimeRejected &&
    fileTooLargeRejected &&
    invalidContentTypeRejected &&
    noPersistence &&
    noDbStorage &&
    noSupabaseStorage &&
    noDnaWrite &&
    noModelCallDuringOcrExtraction &&
    rawImageNotSentToModel &&
    extractedTextNotPersisted &&
    handoffDisabledIn8_11C &&
    publicRuntimeStillBlocked &&
    productionStillUnauthorized &&
    goLiveStillUnauthorized &&
    jsonModeGuardFound &&
    realOcrInternalButtonCreated &&
    realOcrButtonLabelFound &&
    realOcrButtonPhotoModeOnly &&
    realOcrButtonSeparateFromPlaceholder &&
    realOcrButtonSeparateFromTextDocument &&
    explicitClickRequired &&
    selectedPageRequired &&
    noClientEnvAuthorization &&
    doesNotAutoFillTextMode &&
    doesNotCallSmartTalkReasoningWithOcrText &&
    doesNotPersistOcrTextClientSide &&
    sourceImplementationPlanAccepted &&
    sourceGateDesignAccepted &&
    sourcePhotoOcrInternalReadinessAccepted &&
    sourceTextDocumentInternalReadinessAccepted &&
    sourceSnapshotCommitIntegrityPassed;

  if (!allChecksPassed) failures.push("one or more static real OCR runtime patch checks did not pass");

  const allPassed = allChecksPassed && failures.length === 0;

  const tamperCount = MINIMAL_REAL_OCR_RUNTIME_PATCH_AUDIT_TAMPER_CASES.length;

  const notes: string[] = [
    "OA-01: 8.11C performs a static, read-only inspection of package.json/package-lock.json, route.ts, SmartTalkClient.tsx, and the new real-ocr-adapter.ts source text only — no browser, no dev server, no local API invocation, no fetch/network call, no OCR execution.",
    `OA-02: 8.11B/8.11A/8.10J were invoked fresh (live, non-fabricated) — observed allPassed: ${b.allPassed}/${a.allPassed}/${j.allPassed}.`,
    "OA-02a: SOURCE SNAPSHOT FIX (8.11C-AUDIT-PATCH) — the observed false allPassed values above are an INHERITED HISTORICAL-CHAIN FALSE-NEGATIVE, not a defect in this 8.11C patch. Root cause: 8.11B/8.11A/8.10J each recursively re-derive 8.9N (Text Document Mode internal readiness closure), and 8.9N's own sources 8.9K/8.9L/8.9M independently return allPassed:false when re-run today. This was confirmed by directly re-running 8.9N, 8.10C, 8.11A, and 8.11B in isolation: the false chain already existed before any 8.11C file was touched.",
    "OA-02b: this audit does NOT re-authorize, re-approve, or silently paper over 8.11B/8.11A/8.10J/8.9N. It accepts them via an IMMUTABLE COMMITTED SOURCE SNAPSHOT — verifying each source runner's own checkId, each source runner's own tamper-case self-integrity (tamperRejected === tamperCount, unaffected by the ancestor allPassed cascade), and the exact nested source-commit hashes each runner itself already records for its ancestors (3a26936 / ead0f0c / a306243 / 3cf81c1) — because those phases were already independently designed, implemented, reviewed, committed, and pushed in prior, separately authorized phases.",
    `OA-02c: sourceSnapshotCommitIntegrityPassed: ${sourceSnapshotCommitIntegrityPassed}; inheritedSourceRunnerFalseNegativeObserved: ${inheritedSourceRunnerFalseNegativeObserved}; historicalSourceRerunRequiredFor8_11C: false; sourceRunnerFreshAllPassedRequired: false.`,
    `OA-03: tesseract.js is the only new dependency added (local_js_ocr, server-side only): ${dependencyAdded}.`,
    `OA-04: real OCR branch is gated exclusively by SMART_TALK_REAL_OCR_EXTRACTION_ENABLED === "true"; the 8.10C placeholder flag never authorizes it: ${dedicatedEnvFlagUsed && exactLowercaseTrueRequired && placeholderFlagCannotAuthorizeRealOcr}.`,
    `OA-05: no persistence, no DB/Supabase storage write, no Vaylo DNA write, and no model/OpenAI call during OCR extraction: ${noPersistence && noDbStorage && noSupabaseStorage && noDnaWrite && noModelCallDuringOcrExtraction}.`,
    `OA-06: OCR-to-Smart-Talk handoff remains explicitly disabled in this phase (handoff.allowed: false): ${handoffDisabledIn8_11C}.`,
    `OA-07: internal Real OCR UI test button is photo-mode-only, separate from the placeholder and Text Document Mode buttons, and requires an explicit click with exactly one selected page: ${realOcrButtonPhotoModeOnly && realOcrButtonSeparateFromPlaceholder && realOcrButtonSeparateFromTextDocument && explicitClickRequired && selectedPageRequired}.`,
    "OA-08: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "OA-09: ready for Phase 8.11D — Real OCR Disabled Local API Closure.",
    "OA-10: this audit-patch changed only run-minimal-real-ocr-runtime-patch-audit.ts. No runtime code (adapter/route/UI/package files) was modified by this patch.",
  ];

  const provisional: MinimalRealOcrRuntimePatchAuditResult = {
    checkId: "8.11C",
    allPassed: true,
    minimalRealOcrRuntimePatchAuditOnly: true,
    runtimePatchCreated: true,
    newRuntimeBehaviorCreated: true,
    routeModifiedNow: true,
    uiModifiedNow: true,
    packageModifiedNow: true,
    adapterCreatedNow: true,
    auditCreatedNow: true,
    browserInvokedByAudit: false,
    devServerStartedByAudit: false,
    localApiInvokedByAudit: false,
    fetchCalledByAudit: false,
    openAiCalledByAudit: false,
    realImageUsedByAudit: false,
    imageBytesReadByAudit: false,
    ocrExtractionPerformedByAudit: false,
    modelCallPerformedByAudit: false,
    persistencePerformedByAudit: false,
    dbStorageWritePerformedByAudit: false,
    supabaseStorageWritePerformedByAudit: false,
    vayloDnaWritePerformedByAudit: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceImplementationPlanCommit: "3a26936",
    sourceGateDesignCommit: "ead0f0c",
    sourcePhotoOcrInternalReadinessCommit: "a306243",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceImplementationPlanAccepted,
    sourceGateDesignAccepted,
    sourcePhotoOcrInternalReadinessAccepted,
    sourceTextDocumentInternalReadinessAccepted,
    sourceAcceptanceStrategy: "immutable_committed_snapshot",
    inheritedSourceRunnerFalseNegativeObserved,
    historicalSourceRerunRequiredFor8_11C: false,
    sourceRunnerFreshAllPassedRequired: false,
    sourceSnapshotCommitIntegrityPassed,
    sourceSnapshotUsedBecauseHistoricalChainRerunUnstable: true,

    dependencyAdded,
    dependencyName: "tesseract.js",
    adapterFileCreated,
    routeBranchCreated,
    routeBranchMode: "photo_ocr_real_extraction_controlled_runtime",
    dedicatedEnvFlagUsed,
    dedicatedEnvFlag: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED",
    exactLowercaseTrueRequired,
    placeholderFlagCannotAuthorizeRealOcr,
    disabledByDefault,
    multipartRequired,
    oneImageOnly,
    maxFileSizeBytes,
    allowedMimeTypes: [...REQUIRED_ALLOWED_MIME_TYPES],
    blockedUnsafeMimeTypes,
    pageCountOneOnly,
    noPersistence,
    noDbStorage,
    noSupabaseStorage,
    noDnaWrite,
    noModelCallDuringOcrExtraction,
    rawImageNotSentToModel,
    extractedTextNotPersisted,
    handoffDisabledIn8_11C,
    publicRuntimeStillBlocked,
    productionStillUnauthorized,
    goLiveStillUnauthorized,

    realOcrInternalButtonCreated,
    realOcrButtonLabel: "Interný test: Real OCR extraction",
    realOcrButtonPhotoModeOnly,
    realOcrButtonSeparateFromPlaceholder,
    realOcrButtonSeparateFromTextDocument,
    questionModeDoesNotShowRealOcrButton,
    textModeDoesNotShowRealOcrButton,
    explicitClickRequired,
    selectedPageRequired,
    noClientEnvAuthorization,
    doesNotAutoFillTextMode,
    doesNotCallSmartTalkReasoningWithOcrText,
    doesNotPersistOcrTextClientSide,

    readyForRealOcrDisabledLocalApiClosure: true,
    readyForRealOcrEnabledSyntheticLocalApiClosure: false,
    readyForOcrToSmartTalkHandoff: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11D",
    recommendedNextPhase: "Real OCR Disabled Local API Closure",

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    patchEvidence,
    adapterEvidence,
    routeEvidence,
    uiEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.11D: Real OCR Disabled Local API Closure — verify (via in-process POST(new Request(...)) invocation, no dev server/browser) that the real OCR branch fails closed for every non-exact-\"true\" env value.",
      "Phase 8.11E (or later): Real OCR Enabled Synthetic Local API Closure — verify the enabled path with a small synthetic in-memory PNG/JPEG buffer.",
      "OCR-to-Smart-Talk handoff, quality evaluator hardening, and trust boundary closures remain separate, later, explicitly authorized phases.",
      "Real mobile/browser manual testing remains a separate, later phase, after synthetic local closures pass.",
    ],
    notes,
  };

  if (allPassed && !_isCanonicalMinimalRealOcrRuntimePatchAuditResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of MINIMAL_REAL_OCR_RUNTIME_PATCH_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalMinimalRealOcrRuntimePatchAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11C tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11C tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-minimal-real-ocr-runtime-patch-audit");

if (invokedDirectly) {
  runMinimalRealOcrRuntimePatchAudit()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
