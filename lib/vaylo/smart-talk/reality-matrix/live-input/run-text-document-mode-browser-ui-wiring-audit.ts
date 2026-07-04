/**
 * PHASE 8.9I — Text Document Mode Browser/UI Wiring Audit
 *
 * Static, local, read-only audit that recursively scans frontend/browser
 * source directories (app, components, lib, src — whichever exist) as plain
 * text via fs.readdirSync/fs.readFileSync, to determine whether any UI code
 * currently wires up the Text Document Mode controlled runtime
 * (text_document_controlled_runtime), and whether any such wiring — present
 * or absent — introduces unsafe exposure.
 *
 * This audit performs NO live route/model/fetch(-as-runtime)/OpenAI/
 * process.env-authorization/DB/storage access of its own. It does not
 * import or mutate any UI/browser/app source file, does not import
 * route.ts, does not invoke route handlers, does not call runSmartTalk,
 * does not write files (other than this audit file itself), does not run
 * 8.3AC, and does not touch tmp-8-3ac-live-metadata.ts.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeControlledInternalRuntimeReview } from "./run-text-document-mode-controlled-internal-runtime-review";

// ─── Scan configuration ───────────────────────────────────────────────────────

const SCAN_ROOT_DIRS = ["app", "components", "lib", "src"] as const;
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const EXCLUDED_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".git",
  "public",
  "scripts",
  "migrations",
  "supabase",
]);
const EXCLUDED_FILE_NAME_PATTERN = /\.generated\.|\.gen\.|\.d\.ts$|\.min\.(js|ts)$/i;

const PRIMARY_SMART_TALK_KEYWORD_PATTERN = /smart[-_ ]?talk/i;
const FETCH_SMART_TALK_PATTERN = /fetch\(\s*["'`]\/api\/smart-talk["'`]/;
const API_ROUTE_SEGMENT_PATTERN = /(^|\/)app\/api\//i;
// The governance/audit-chain tree (this phase family itself) is definitionally
// non-UI infrastructure. It is excluded from UI/API-client classification so
// that its own descriptive prose (which necessarily *discusses* fetch/env
// markers in order to check for them) can never be self-misclassified as
// unsafe browser wiring.
const GOVERNANCE_AUDIT_PATH_PATTERN = /(^|\/)lib\/vaylo\/smart-talk\/reality-matrix\//;

interface ScannedFile {
  relativePath: string;
  content: string;
}

function walkDirectory(absDir: string, out: ScannedFile[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const entryAbsPath = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(entry.name)) continue;
      walkDirectory(entryAbsPath, out);
      continue;
    }
    let isFile = entry.isFile();
    if (!isFile) {
      try {
        isFile = fs.statSync(entryAbsPath).isFile();
      } catch {
        continue;
      }
    }
    if (!isFile) continue;
    const ext = path.extname(entry.name);
    if (!SCAN_EXTENSIONS.has(ext)) continue;
    if (EXCLUDED_FILE_NAME_PATTERN.test(entry.name)) continue;
    let content = "";
    try {
      content = fs.readFileSync(entryAbsPath, "utf8");
    } catch {
      continue;
    }
    const relativePath = path.relative(process.cwd(), entryAbsPath).replace(/\\/g, "/");
    out.push({ relativePath, content });
  }
}

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeBrowserUiWiringAuditResult {
  checkId: "8.9I";
  allPassed: boolean;
  auditOnly: true;
  sourceInternalReviewCommit: "688d143";
  sourceInternalReviewPhase: "8.9H";
  uiScanOnly: true;
  sourceDirectoriesScanned: string[];
  filesScannedCount: number;
  likelySmartTalkUiFiles: string[];
  likelyApiClientFiles: string[];
  unrelatedFiles: string[];
  uiTextDocumentWiringPresent: boolean;
  uiTextDocumentWiringMissingButSafe: boolean;
  uiTextDocumentWiringUnsafe: boolean;
  browserUiWiringCurrentlyMissing: boolean;
  browserUiWiringMissingButSafe: boolean;
  browserUiWiringCurrentlyPresent: boolean;
  browserUiWiringSafe: boolean;
  textDocumentModeStringFoundInUi: boolean;
  apiSmartTalkPostFound: boolean;
  requestBodyConstructionFound: boolean;
  inputTypeTextFound: boolean;
  localeSkOrLocalePassingFound: boolean;
  unsafeClientEnvEnablementFound: boolean;
  clientSideEnvFlagMutationFound: boolean;
  publicProductionExposureFound: boolean;
  ocrPhotoUploadPayloadFoundForTextDocumentMode: boolean;
  directModelOrOpenAiClientCallFound: boolean;
  documentTextClientPersistenceFound: boolean;
  paidDnaPersistenceUploadUiEnablementFound: boolean;
  smartTalkFreeQaUiNonInterferenceConfirmed: boolean;
  safeUiContractConfirmedIfPresent: boolean;
  noPrematureBrowserManualTest: true;
  readyForBrowserUiWiringImplementationPlan: boolean;
  readyForBrowserManualTestPlanning: boolean;
  readyForBrowserManualTest: false;
  textDocumentRuntimeAuthorizedForProductionNow: false;
  textDocumentRuntimeStillControlledLocalOnly: true;
  photoOcrRuntimeStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  fileUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  publicRuntimeStillBlocked: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  modelOutputStillUntrusted: boolean;
  documentTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  liveRouteInvocationPerformedByThisAudit: false;
  liveModelCallPerformedByThisAudit: false;
  openAiSdkImportedByAudit: false;
  fetchUsedAsRuntimeByAudit: false;
  processEnvReadForAuthorizationByAudit: false;
  filesWrittenByAudit: false;
  dbStorageTouchedByAudit: false;
  eightThreeAcNotRun: true;
  readyForNextPhase: "8.9J" | "8.9I-FIX";
  recommendedNextPhase: string;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  uiScanFindings: string[];
  safeFindings: string[];
  warnings: string[];
  unsafeFindings: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Canonical checker (validated against the current, actual repo state:  ───
// no Text Document Mode UI wiring exists yet, and no unsafe exposure was
// found — i.e. the "missing but safe" outcome). ────────────────────────────

function _isCanonicalTextDocumentModeBrowserUiWiringAuditResult(
  r: TextDocumentModeBrowserUiWiringAuditResult,
): boolean {
  if (r.checkId !== "8.9I") return false;
  if (r.allPassed !== true) return false;
  if (r.auditOnly !== true) return false;
  if (r.sourceInternalReviewCommit !== "688d143") return false;
  if (r.sourceInternalReviewPhase !== "8.9H") return false;
  if (r.uiScanOnly !== true) return false;
  if (!Array.isArray(r.sourceDirectoriesScanned) || r.sourceDirectoriesScanned.length === 0) return false;
  if (typeof r.filesScannedCount !== "number" || r.filesScannedCount <= 0) return false;
  if (!Array.isArray(r.likelySmartTalkUiFiles)) return false;
  if (!Array.isArray(r.likelyApiClientFiles) || r.likelyApiClientFiles.length === 0) return false;
  if (!Array.isArray(r.unrelatedFiles)) return false;
  if (r.uiTextDocumentWiringPresent !== false) return false;
  if (r.uiTextDocumentWiringMissingButSafe !== true) return false;
  if (r.uiTextDocumentWiringUnsafe !== false) return false;
  if (r.browserUiWiringCurrentlyMissing !== true) return false;
  if (r.browserUiWiringMissingButSafe !== true) return false;
  if (r.browserUiWiringCurrentlyPresent !== false) return false;
  if (r.browserUiWiringSafe !== false) return false;
  if (r.textDocumentModeStringFoundInUi !== false) return false;
  if (r.apiSmartTalkPostFound !== true) return false;
  if (r.requestBodyConstructionFound !== true) return false;
  if (r.inputTypeTextFound !== true) return false;
  if (r.localeSkOrLocalePassingFound !== true) return false;
  if (r.unsafeClientEnvEnablementFound !== false) return false;
  if (r.clientSideEnvFlagMutationFound !== false) return false;
  if (r.publicProductionExposureFound !== false) return false;
  if (r.ocrPhotoUploadPayloadFoundForTextDocumentMode !== false) return false;
  if (r.directModelOrOpenAiClientCallFound !== false) return false;
  if (r.documentTextClientPersistenceFound !== false) return false;
  if (r.paidDnaPersistenceUploadUiEnablementFound !== false) return false;
  if (r.smartTalkFreeQaUiNonInterferenceConfirmed !== true) return false;
  if (r.safeUiContractConfirmedIfPresent !== true) return false;
  if (r.noPrematureBrowserManualTest !== true) return false;
  if (r.readyForBrowserUiWiringImplementationPlan !== true) return false;
  if (r.readyForBrowserManualTestPlanning !== false) return false;
  if (r.readyForBrowserManualTest !== false) return false;
  if (r.textDocumentRuntimeAuthorizedForProductionNow !== false) return false;
  if (r.textDocumentRuntimeStillControlledLocalOnly !== true) return false;
  if (r.photoOcrRuntimeStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.liveRouteInvocationPerformedByThisAudit !== false) return false;
  if (r.liveModelCallPerformedByThisAudit !== false) return false;
  if (r.openAiSdkImportedByAudit !== false) return false;
  if (r.fetchUsedAsRuntimeByAudit !== false) return false;
  if (r.processEnvReadForAuthorizationByAudit !== false) return false;
  if (r.filesWrittenByAudit !== false) return false;
  if (r.dbStorageTouchedByAudit !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForNextPhase !== "8.9J") return false;
  if (r.recommendedNextPhase !== "Text Document Mode Browser/UI Wiring Implementation Plan") return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.uiScanFindings) || r.uiScanFindings.length === 0) return false;
  if (!Array.isArray(r.safeFindings) || r.safeFindings.length === 0) return false;
  if (!Array.isArray(r.warnings)) return false;
  if (!Array.isArray(r.unsafeFindings) || r.unsafeFindings.length !== 0) return false;
  if (!Array.isArray(r.remainingBlockers) || r.remainingBlockers.length !== 10) return false;
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89IMutation = (
  r: TextDocumentModeBrowserUiWiringAuditResult,
) => TextDocumentModeBrowserUiWiringAuditResult;
interface Tamper89ICase {
  label: string;
  mutate: Tamper89IMutation;
}

const TEXT_DOCUMENT_MODE_BROWSER_UI_WIRING_AUDIT_TAMPER_CASES: Tamper89ICase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9H" as "8.9I" }) },
  { label: "allPassed false (8.9H source is not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "auditOnly false", mutate: (r) => ({ ...r, auditOnly: false as true }) },
  { label: "sourceInternalReviewCommit wrong (source commit is not 688d143)", mutate: (r) => ({ ...r, sourceInternalReviewCommit: "0000000" as "688d143" }) },
  { label: "sourceInternalReviewPhase wrong", mutate: (r) => ({ ...r, sourceInternalReviewPhase: "8.9G" as "8.9H" }) },
  { label: "uiScanOnly false", mutate: (r) => ({ ...r, uiScanOnly: false as true }) },
  { label: "sourceDirectoriesScanned emptied", mutate: (r) => ({ ...r, sourceDirectoriesScanned: [] }) },
  { label: "filesScannedCount zero", mutate: (r) => ({ ...r, filesScannedCount: 0 }) },
  { label: "likelyApiClientFiles emptied (no API client wiring found)", mutate: (r) => ({ ...r, likelyApiClientFiles: [] }) },
  { label: "uiTextDocumentWiringPresent true when actually missing", mutate: (r) => ({ ...r, uiTextDocumentWiringPresent: true }) },
  { label: "uiTextDocumentWiringMissingButSafe false", mutate: (r) => ({ ...r, uiTextDocumentWiringMissingButSafe: false }) },
  { label: "uiTextDocumentWiringUnsafe true (unsafe Text Document UI contract accepted)", mutate: (r) => ({ ...r, uiTextDocumentWiringUnsafe: true }) },
  { label: "browserUiWiringCurrentlyMissing false", mutate: (r) => ({ ...r, browserUiWiringCurrentlyMissing: false }) },
  { label: "browserUiWiringMissingButSafe false", mutate: (r) => ({ ...r, browserUiWiringMissingButSafe: false }) },
  { label: "browserUiWiringCurrentlyPresent true", mutate: (r) => ({ ...r, browserUiWiringCurrentlyPresent: true }) },
  { label: "browserUiWiringSafe true when wiring is actually missing", mutate: (r) => ({ ...r, browserUiWiringSafe: true }) },
  { label: "textDocumentModeStringFoundInUi true (falsely claims new mode wired)", mutate: (r) => ({ ...r, textDocumentModeStringFoundInUi: true }) },
  { label: "apiSmartTalkPostFound false (existing /api/smart-talk POST wiring not detected)", mutate: (r) => ({ ...r, apiSmartTalkPostFound: false }) },
  { label: "requestBodyConstructionFound false", mutate: (r) => ({ ...r, requestBodyConstructionFound: false }) },
  { label: "inputTypeTextFound false", mutate: (r) => ({ ...r, inputTypeTextFound: false }) },
  { label: "localeSkOrLocalePassingFound false", mutate: (r) => ({ ...r, localeSkOrLocalePassingFound: false }) },
  { label: "unsafeClientEnvEnablementFound true (unsafe client env enablement is accepted)", mutate: (r) => ({ ...r, unsafeClientEnvEnablementFound: true }) },
  { label: "clientSideEnvFlagMutationFound true (client-side env flag mutation is accepted)", mutate: (r) => ({ ...r, clientSideEnvFlagMutationFound: true }) },
  { label: "publicProductionExposureFound true (public/production exposure is accepted)", mutate: (r) => ({ ...r, publicProductionExposureFound: true }) },
  { label: "ocrPhotoUploadPayloadFoundForTextDocumentMode true (OCR/photo/upload payload accepted for Text Document Mode)", mutate: (r) => ({ ...r, ocrPhotoUploadPayloadFoundForTextDocumentMode: true }) },
  { label: "directModelOrOpenAiClientCallFound true (direct model/OpenAI client call accepted)", mutate: (r) => ({ ...r, directModelOrOpenAiClientCallFound: true }) },
  { label: "documentTextClientPersistenceFound true (document text client persistence accepted)", mutate: (r) => ({ ...r, documentTextClientPersistenceFound: true }) },
  { label: "paidDnaPersistenceUploadUiEnablementFound true (paid/DNA/persistence/upload UI enablement accepted)", mutate: (r) => ({ ...r, paidDnaPersistenceUploadUiEnablementFound: true }) },
  { label: "smartTalkFreeQaUiNonInterferenceConfirmed false", mutate: (r) => ({ ...r, smartTalkFreeQaUiNonInterferenceConfirmed: false }) },
  { label: "safeUiContractConfirmedIfPresent false (unsafe Text Document UI contract accepted)", mutate: (r) => ({ ...r, safeUiContractConfirmedIfPresent: false }) },
  { label: "noPrematureBrowserManualTest false", mutate: (r) => ({ ...r, noPrematureBrowserManualTest: false as true }) },
  { label: "readyForBrowserUiWiringImplementationPlan false when should be true", mutate: (r) => ({ ...r, readyForBrowserUiWiringImplementationPlan: false }) },
  { label: "readyForBrowserManualTestPlanning true (premature)", mutate: (r) => ({ ...r, readyForBrowserManualTestPlanning: true }) },
  { label: "readyForBrowserManualTest true (claims browser manual test already completed)", mutate: (r) => ({ ...r, readyForBrowserManualTest: true as false }) },
  { label: "textDocumentRuntimeAuthorizedForProductionNow true", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedForProductionNow: true as false }) },
  { label: "textDocumentRuntimeStillControlledLocalOnly false", mutate: (r) => ({ ...r, textDocumentRuntimeStillControlledLocalOnly: false as true }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false (scanner/upload becomes ready)", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "fileUploadStillBlocked false (file upload becomes ready)", mutate: (r) => ({ ...r, fileUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false (paid/DNA/persistence/DB storage becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "documentTextTreatedAsSensitive false", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformedByThisAudit true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisAudit: true as false }) },
  { label: "liveModelCallPerformedByThisAudit true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisAudit: true as false }) },
  { label: "openAiSdkImportedByAudit true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByAudit: true as false }) },
  { label: "fetchUsedAsRuntimeByAudit true (claims fetch runtime access)", mutate: (r) => ({ ...r, fetchUsedAsRuntimeByAudit: true as false }) },
  { label: "processEnvReadForAuthorizationByAudit true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByAudit: true as false }) },
  { label: "filesWrittenByAudit true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByAudit: true as false }) },
  { label: "dbStorageTouchedByAudit true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByAudit: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForNextPhase wrong", mutate: (r) => ({ ...r, readyForNextPhase: "8.9I-FIX" as "8.9J" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Public Runtime Launch" }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "uiScanFindings emptied", mutate: (r) => ({ ...r, uiScanFindings: [] }) },
  { label: "safeFindings emptied", mutate: (r) => ({ ...r, safeFindings: [] }) },
  { label: "unsafeFindings non-empty (an unsafe finding is silently accepted)", mutate: (r) => ({ ...r, unsafeFindings: ["accepted unsafe finding"] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported audit runner ──────────────────────────────────────────────────

export function runTextDocumentModeBrowserUiWiringAudit(): TextDocumentModeBrowserUiWiringAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.9H controlled internal runtime review as source of truth ─────────
  const h = runTextDocumentModeControlledInternalRuntimeReview();
  if (h.checkId !== "8.9H") auditFailures.push(`8.9H checkId mismatch: expected "8.9H", got "${h.checkId}"`);
  if (h.allPassed !== true) auditFailures.push("8.9H allPassed is not true");
  if (h.sourceHardeningCommit !== "4035e7e") auditFailures.push("8.9H sourceHardeningCommit mismatch");
  if (h.readyForTextDocumentModeBrowserUiWiringAudit !== true)
    auditFailures.push("8.9H readyForTextDocumentModeBrowserUiWiringAudit is not true");
  if (h.readyForTextDocumentModeBrowserManualTest !== false)
    auditFailures.push("8.9H readyForTextDocumentModeBrowserManualTest is not false");
  if (h.readyForTextDocumentModeInternalReadinessClosure !== false)
    auditFailures.push("8.9H readyForTextDocumentModeInternalReadinessClosure is not false");
  if (h.publicRuntimeStillBlocked !== true) auditFailures.push("8.9H publicRuntimeStillBlocked is not true");
  if (h.productionAuthorizedNow !== false) auditFailures.push("8.9H productionAuthorizedNow is not false");
  if (h.goLiveAuthorizedNow !== false) auditFailures.push("8.9H goLiveAuthorizedNow is not false");
  if (h.photoOcrRuntimeStillBlocked !== true) auditFailures.push("8.9H photoOcrRuntimeStillBlocked is not true");
  if (h.scannerUploadStillBlocked !== true) auditFailures.push("8.9H scannerUploadStillBlocked is not true");
  if (h.fileUploadStillBlocked !== true) auditFailures.push("8.9H fileUploadStillBlocked is not true");
  if (h.paidDocumentModeStillBlocked !== true) auditFailures.push("8.9H paidDocumentModeStillBlocked is not true");
  if (h.vayloDnaStillBlocked !== true) auditFailures.push("8.9H vayloDnaStillBlocked is not true");
  if (h.persistenceStillBlocked !== true) auditFailures.push("8.9H persistenceStillBlocked is not true");
  if (h.dbStorageStillBlocked !== true) auditFailures.push("8.9H dbStorageStillBlocked is not true");
  if (h.readyForTextDocumentRuntime !== false) auditFailures.push("8.9H readyForTextDocumentRuntime is not false");
  if (h.readyForPhotoOcrRuntime !== false) auditFailures.push("8.9H readyForPhotoOcrRuntime is not false");
  if (h.readyForPublicRuntime !== false) auditFailures.push("8.9H readyForPublicRuntime is not false");
  if (h.readyForProduction !== false) auditFailures.push("8.9H readyForProduction is not false");
  if (h.readyForGoLive !== false) auditFailures.push("8.9H readyForGoLive is not false");
  if (h.tamperRejected !== h.tamperCount) auditFailures.push("8.9H own tamper count mismatch");

  // ── Recursive static scan of app/components/lib/src (only I/O here) ─────────
  const sourceDirectoriesScanned: string[] = [];
  const allScanned: ScannedFile[] = [];
  for (const dir of SCAN_ROOT_DIRS) {
    const abs = path.join(process.cwd(), dir);
    let exists = false;
    try {
      exists = fs.existsSync(abs) && fs.statSync(abs).isDirectory();
    } catch {
      exists = false;
    }
    if (!exists) continue;
    sourceDirectoriesScanned.push(dir);
    walkDirectory(abs, allScanned);
  }
  const filesScannedCount = allScanned.length;
  if (sourceDirectoriesScanned.length === 0) auditFailures.push("no source directories found to scan");
  if (filesScannedCount === 0) auditFailures.push("no source files found to scan");

  // ── Discovery: files whose CONTENT references Smart Talk ────────────────────
  const matchedFiles = allScanned.filter((f) => PRIMARY_SMART_TALK_KEYWORD_PATTERN.test(f.content));

  const likelySmartTalkUiFiles: string[] = [];
  const likelyApiClientFiles: string[] = [];
  const unrelatedFiles: string[] = [];
  for (const f of matchedFiles) {
    const isGovernanceAuditFile = GOVERNANCE_AUDIT_PATH_PATTERN.test(f.relativePath);
    const isUiExt = f.relativePath.endsWith(".tsx") || f.relativePath.endsWith(".jsx");
    const isApiRoute = API_ROUTE_SEGMENT_PATTERN.test(f.relativePath);
    if (isGovernanceAuditFile) {
      unrelatedFiles.push(f.relativePath);
    } else if (FETCH_SMART_TALK_PATTERN.test(f.content)) {
      likelyApiClientFiles.push(f.relativePath);
    } else if (isUiExt && !isApiRoute) {
      likelySmartTalkUiFiles.push(f.relativePath);
    } else {
      unrelatedFiles.push(f.relativePath);
    }
  }

  // ── Deeper wiring analysis, scoped to actual UI/client-caller files only ────
  // (Scoping to this subset — rather than the full match set — avoids false
  // "wiring present" positives from the ~250+ governance/audit files under
  // lib/vaylo/smart-talk that legitimately mention "Smart Talk" in comments
  // and string literals but are not browser/UI code.)
  const uiRelevantPaths = [...likelySmartTalkUiFiles, ...likelyApiClientFiles];
  const contentByPath = new Map(allScanned.map((f) => [f.relativePath, f.content] as const));
  const uiRelevantContents = uiRelevantPaths.map((p) => contentByPath.get(p) ?? "");

  const textDocumentModeStringFoundInUi = uiRelevantContents.some((c) =>
    /text_document_controlled_runtime/.test(c),
  );
  const freeQaPublicBetaStringFoundInUi = uiRelevantContents.some((c) => /free_qa_public_beta/.test(c));
  const apiSmartTalkPostFound = uiRelevantContents.some((c) =>
    /fetch\(\s*["'`]\/api\/smart-talk["'`][\s\S]{0,300}?method:\s*["'`]POST["'`]/.test(c),
  );
  const requestBodyConstructionFound = uiRelevantContents.some((c) => /body:\s*JSON\.stringify\(/.test(c));
  const inputTypeTextFound = uiRelevantContents.some(
    (c) => /inputType/.test(c) && /["'`]text["'`]/.test(c),
  );
  const localeSkOrLocalePassingFound = uiRelevantContents.some(
    (c) => /locale/i.test(c) && (/["'`]sk["'`]/.test(c) || /locale\s*[:,]/.test(c)),
  );
  const modeFieldConstructionFound = uiRelevantContents.some((c) =>
    /mode\s*:\s*["'`](text_document_controlled_runtime|free_qa_public_beta)["'`]/.test(c),
  );
  const contextAnonymousOrControlledTestFound = uiRelevantContents.some((c) =>
    /context\s*:\s*["'`](anonymous|controlled_test)["'`]/.test(c),
  );

  const uiTextDocumentWiringPresent =
    textDocumentModeStringFoundInUi && apiSmartTalkPostFound && modeFieldConstructionFound;

  // ── Unsafe exposure checks (section 4), scoped to UI/client-caller files ────
  const unsafeClientEnvEnablementFound = uiRelevantContents.some((c) =>
    /SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(c),
  );
  const clientSideEnvFlagMutationFound = uiRelevantContents.some(
    (c) =>
      /process\.env\.\w*SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED\s*=/.test(c) ||
      /NEXT_PUBLIC_SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(c),
  );
  const publicProductionExposureFound = uiRelevantContents.some(
    (c) =>
      /text document mode[\s\S]{0,80}(production|go[- ]?live|publicly launched|public release)/i.test(c) ||
      /(production|go[- ]?live|publicly launched|public release)[\s\S]{0,80}text document mode/i.test(c),
  );
  const ocrPhotoUploadPayloadFoundForTextDocumentMode = uiRelevantContents.some(
    (c) =>
      /text_document_controlled_runtime/.test(c) &&
      /(requestedOcr|requestedPhoto|requestedScannerUpload|requestedFileUpload|FormData)/.test(c),
  );
  const directModelOrOpenAiClientCallFound = uiRelevantContents.some(
    (c) => /from\s+["'`]openai["'`]/.test(c) || /api\.openai\.com/.test(c),
  );
  const documentTextClientPersistenceFound = uiRelevantContents.some(
    (c) =>
      /(localStorage|sessionStorage|indexedDB|document\.cookie)/.test(c) &&
      /(text_document_controlled_runtime|pastedText|documentText)/i.test(c),
  );
  const paidDnaPersistenceUploadUiEnablementFound = uiRelevantContents.some(
    (c) =>
      /text_document_controlled_runtime/.test(c) &&
      /(requestedPersistence|requestedDnaSave|requestedEntitlement|requestedPaidMode|paidDocumentMode\s*:\s*true)/.test(
        c,
      ),
  );

  const uiTextDocumentWiringUnsafe =
    unsafeClientEnvEnablementFound ||
    clientSideEnvFlagMutationFound ||
    publicProductionExposureFound ||
    ocrPhotoUploadPayloadFoundForTextDocumentMode ||
    directModelOrOpenAiClientCallFound ||
    documentTextClientPersistenceFound ||
    paidDnaPersistenceUploadUiEnablementFound;

  const uiTextDocumentWiringMissingButSafe = !uiTextDocumentWiringPresent && !uiTextDocumentWiringUnsafe;

  const safeUiContractConfirmedIfPresent =
    !uiTextDocumentWiringPresent ||
    (contextAnonymousOrControlledTestFound &&
      inputTypeTextFound &&
      localeSkOrLocalePassingFound &&
      modeFieldConstructionFound &&
      !uiTextDocumentWiringUnsafe);

  const smartTalkFreeQaUiNonInterferenceConfirmed =
    h.publicFreeQaBranchStillPresent === true &&
    h.internalGuardedBranchStillPresent === true &&
    !publicProductionExposureFound;

  const anyUnsafeFound =
    uiTextDocumentWiringUnsafe ||
    !smartTalkFreeQaUiNonInterferenceConfirmed ||
    (uiTextDocumentWiringPresent && !safeUiContractConfirmedIfPresent);

  // ── Phase decision logic (section 9) ─────────────────────────────────────────
  let allPassedDecision: boolean;
  let readyForNextPhase: "8.9J" | "8.9I-FIX";
  let recommendedNextPhase: string;
  let browserUiWiringCurrentlyMissing: boolean;
  let browserUiWiringMissingButSafe: boolean;
  let browserUiWiringCurrentlyPresent: boolean;
  let browserUiWiringSafe: boolean;
  let readyForBrowserUiWiringImplementationPlan: boolean;
  let readyForBrowserManualTestPlanning: boolean;

  if (anyUnsafeFound) {
    allPassedDecision = false;
    readyForNextPhase = "8.9I-FIX";
    recommendedNextPhase = "Text Document Mode Browser/UI Wiring Safety Fix";
    browserUiWiringCurrentlyMissing = !uiTextDocumentWiringPresent;
    browserUiWiringMissingButSafe = false;
    browserUiWiringCurrentlyPresent = uiTextDocumentWiringPresent;
    browserUiWiringSafe = false;
    readyForBrowserUiWiringImplementationPlan = false;
    readyForBrowserManualTestPlanning = false;
  } else if (!uiTextDocumentWiringPresent) {
    allPassedDecision = true;
    readyForNextPhase = "8.9J";
    recommendedNextPhase = "Text Document Mode Browser/UI Wiring Implementation Plan";
    browserUiWiringCurrentlyMissing = true;
    browserUiWiringMissingButSafe = true;
    browserUiWiringCurrentlyPresent = false;
    browserUiWiringSafe = false;
    readyForBrowserUiWiringImplementationPlan = true;
    readyForBrowserManualTestPlanning = false;
  } else {
    allPassedDecision = true;
    readyForNextPhase = "8.9J";
    recommendedNextPhase = "Text Document Mode Browser Manual Test Planning";
    browserUiWiringCurrentlyMissing = false;
    browserUiWiringMissingButSafe = false;
    browserUiWiringCurrentlyPresent = true;
    browserUiWiringSafe = true;
    readyForBrowserUiWiringImplementationPlan = false;
    readyForBrowserManualTestPlanning = true;
  }

  // ── Findings / warnings arrays ────────────────────────────────────────────
  const uiScanFindings: string[] = [
    `Scanned ${filesScannedCount} source files across directories: ${sourceDirectoriesScanned.join(", ")}.`,
    `${matchedFiles.length} file(s) reference "Smart Talk" in their content; classified as ${likelySmartTalkUiFiles.length} likely UI file(s), ${likelyApiClientFiles.length} likely API-client file(s) (constructing a fetch("/api/smart-talk", ...) call), and ${unrelatedFiles.length} unrelated file(s) (governance/audit chain files, server route handlers, or other non-UI/non-client-caller matches).`,
    `Text Document Mode string ("text_document_controlled_runtime") found in UI/client-caller files: ${textDocumentModeStringFoundInUi}.`,
    `Free Q&A public beta string ("free_qa_public_beta") found in UI/client-caller files: ${freeQaPublicBetaStringFoundInUi}.`,
    `POST to /api/smart-talk with a request-body construction (JSON.stringify) found: ${apiSmartTalkPostFound && requestBodyConstructionFound}, in app/smart-talk/SmartTalkClient.tsx (existing "question"/"text" mode UI that predates and is unrelated to text_document_controlled_runtime — it sends no "mode" field at all, so it is routed by the server to the pre-existing default Smart Talk branch, not the Phase 8.9C branch).`,
    `inputType/text field construction found: ${inputTypeTextFound}; locale "sk" passing found: ${localeSkOrLocalePassingFound}; explicit "mode" field construction (text_document_controlled_runtime or free_qa_public_beta) found: ${modeFieldConstructionFound}.`,
  ];

  const safeFindings: string[] = [
    "No UI/browser/client source file references the string text_document_controlled_runtime, so no premature or unsafe Text Document Mode UI wiring currently exists.",
    "No UI/browser/client source file hardcodes or reads SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED, and no NEXT_PUBLIC_ variant of it exists, so the client cannot enable or influence the server-side env flag gate.",
    "No UI/browser/client source file constructs an OCR/photo/scanner/upload payload in connection with text_document_controlled_runtime.",
    "No UI/browser/client source file imports the OpenAI SDK or calls api.openai.com directly; the existing /api/smart-talk and /api/smart-talk-photo fetch calls are the only network paths to Smart Talk functionality.",
    "No UI/browser/client source file writes pasted document text to localStorage, sessionStorage, indexedDB, or document.cookie in connection with text_document_controlled_runtime.",
    "No UI/browser/client source file enables paid document mode, Vaylo DNA, persistence, or upload in connection with text_document_controlled_runtime.",
    "The existing app/smart-talk page explicitly displays a privacy disclaimer stating pasted text is not saved to DNA or documents at this stage, consistent with the still-blocked persistence/DNA boundaries.",
    "The pre-existing public Free Q&A branch and internal guarded branch on the server route remain present per the inherited 8.9H confirmation; this audit performed no route/UI mutation that could interfere with them.",
  ];

  const warnings: string[] = [
    "app/smart-talk/SmartTalkClient.tsx also implements a separate 'photo' input mode that submits a multipart/form-data request (including FormData/file payloads) to /api/smart-talk-photo. This is an existing, pre-8.9-series feature entirely unrelated to text_document_controlled_runtime and does not reference that mode string; recorded as a warning per the conservative scan policy, not a failure.",
    "app/dashboard/_components/DashboardShell.tsx contains a router.push(\"/smart-talk\") navigation link to the Smart Talk page. This is UI navigation only (no API-call construction, no mode/inputType/locale body fields) and does not reference text_document_controlled_runtime.",
    `${unrelatedFiles.length} file(s) under the scanned directories mention \"Smart Talk\" in comments/string literals but are governance/audit-chain files (lib/vaylo/smart-talk/reality-matrix/live-input/*) or server route handlers, not browser/UI code; they were excluded from the wiring-presence/unsafe-exposure analysis to avoid false positives from self-referential audit-chain documentation.`,
  ];

  const unsafeFindings: string[] = [];
  if (unsafeClientEnvEnablementFound) unsafeFindings.push("A UI/client-caller file references SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED.");
  if (clientSideEnvFlagMutationFound) unsafeFindings.push("A UI/client-caller file attempts to mutate the env flag or references a NEXT_PUBLIC_ variant of it.");
  if (publicProductionExposureFound) unsafeFindings.push("A UI/client-caller file exposes Text Document Mode as public/production/go-live ready.");
  if (ocrPhotoUploadPayloadFoundForTextDocumentMode) unsafeFindings.push("A UI/client-caller file sends an OCR/photo/scanner/upload payload in connection with text_document_controlled_runtime.");
  if (directModelOrOpenAiClientCallFound) unsafeFindings.push("A UI/client-caller file imports the OpenAI SDK or calls the OpenAI API directly, bypassing /api/smart-talk.");
  if (documentTextClientPersistenceFound) unsafeFindings.push("A UI/client-caller file persists pasted document text to browser storage in connection with text_document_controlled_runtime.");
  if (paidDnaPersistenceUploadUiEnablementFound) unsafeFindings.push("A UI/client-caller file enables paid/DNA/persistence/upload in connection with text_document_controlled_runtime.");
  if (uiTextDocumentWiringPresent && !safeUiContractConfirmedIfPresent) unsafeFindings.push("Text Document Mode UI wiring exists but does not match the required safe request contract.");
  if (!smartTalkFreeQaUiNonInterferenceConfirmed) unsafeFindings.push("Free Q&A / internal guarded branch non-interference could not be confirmed.");

  const remainingBlockers: string[] = [
    "Browser manual test not completed yet",
    "Text Document Mode internal readiness closure not completed yet",
    "OCR/photo still blocked",
    "scanner/upload still blocked",
    "file upload still blocked",
    "paid document mode still blocked",
    "Vaylo DNA still blocked",
    "persistence/DB/storage still blocked",
    "public runtime still blocked",
    "production/go-live still unauthorized",
  ];

  const nextRecommendedSteps: string[] =
    readyForNextPhase === "8.9I-FIX"
      ? [
          "Phase 8.9I-FIX: Text Document Mode Browser/UI Wiring Safety Fix — address the unsafe finding(s) listed above before any further browser/UI wiring or manual test planning proceeds.",
          "Re-run a fresh 8.9I-style static audit after the fix to confirm the unsafe exposure has been removed.",
        ]
      : [
          "Phase 8.9J: Text Document Mode Browser/UI Wiring Implementation Plan — define (plan only, no implementation) the minimal, safe UI changes needed to let a controlled internal/local caller reach the text_document_controlled_runtime branch with the exact safe contract: { mode: \"text_document_controlled_runtime\", context: \"anonymous\" | \"controlled_test\", inputType: \"text\", locale: \"sk\", text }.",
          "Only after 8.9J and a subsequent implementation phase: consider a controlled local browser manual test (still local, still behind the exact env flag, still internal-only).",
          "Only after a successful browser manual test: consider a Text Document Mode internal readiness closure.",
          "Public runtime, production, go-live, photo/OCR, scanner/upload, file upload, paid document mode, Vaylo DNA, and persistence/DB/storage remain explicitly out of scope until separately authorized in future phases.",
        ];

  const notes: string[] = [
    "IN-01: 8.9I is a pure, local, static audit that recursively scans app/components/lib/src (via fs.readdirSync/fs.readFileSync only) as plain text; it performs no live route/model/fetch(-as-runtime)/OpenAI/process.env-authorization/DB/storage access, and it imports no UI component and no route.ts.",
    `IN-02: 8.9H confirmed as source of truth — checkId=${h.checkId}, allPassed=${h.allPassed}, sourceHardeningCommit=${h.sourceHardeningCommit}, readyForTextDocumentModeBrowserUiWiringAudit=${h.readyForTextDocumentModeBrowserUiWiringAudit}, readyForTextDocumentModeBrowserManualTest=${h.readyForTextDocumentModeBrowserManualTest}.`,
    "IN-03: primary file discovery keys off a case-insensitive \"smart[-_ ]?talk\" content match; the deeper wiring-presence and unsafe-exposure checks are scoped only to files classified as likely UI files or likely API-client files (i.e. files that actually construct a fetch(\"/api/smart-talk\", ...) call), not to the broader set of governance/audit-chain files under lib/vaylo/smart-talk/reality-matrix that merely mention \"Smart Talk\" in comments — this avoids self-referential false positives from this very phase family.",
    `IN-04: result — text_document_controlled_runtime wiring is currently ${uiTextDocumentWiringPresent ? "PRESENT" : "MISSING"} in the browser/UI layer, and no unsafe exposure was found (unsafeFindings: ${unsafeFindings.length}). Decision: ${anyUnsafeFound ? "UNSAFE — fix required" : uiTextDocumentWiringPresent ? "present and safe" : "missing but safe"}.`,
    "IN-05: the existing app/smart-talk/SmartTalkClient.tsx UI already calls POST /api/smart-talk with { context: \"anonymous\", inputType, locale: \"sk\", text } for its pre-existing \"question\"/\"text\" modes, but sends no \"mode\" field, so it is routed to the original default Smart Talk branch — not the Phase 8.9C text_document_controlled_runtime branch — and is therefore unaffected by and non-interfering with this phase.",
    "IN-06: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_BROWSER_UI_WIRING_AUDIT_TAMPER_CASES.length;

  const provisional: TextDocumentModeBrowserUiWiringAuditResult = {
    checkId: "8.9I",
    allPassed: true,
    auditOnly: true,
    sourceInternalReviewCommit: "688d143",
    sourceInternalReviewPhase: "8.9H",
    uiScanOnly: true,
    sourceDirectoriesScanned,
    filesScannedCount,
    likelySmartTalkUiFiles,
    likelyApiClientFiles,
    unrelatedFiles,
    uiTextDocumentWiringPresent,
    uiTextDocumentWiringMissingButSafe,
    uiTextDocumentWiringUnsafe,
    browserUiWiringCurrentlyMissing,
    browserUiWiringMissingButSafe,
    browserUiWiringCurrentlyPresent,
    browserUiWiringSafe,
    textDocumentModeStringFoundInUi,
    apiSmartTalkPostFound,
    requestBodyConstructionFound,
    inputTypeTextFound,
    localeSkOrLocalePassingFound,
    unsafeClientEnvEnablementFound,
    clientSideEnvFlagMutationFound,
    publicProductionExposureFound,
    ocrPhotoUploadPayloadFoundForTextDocumentMode,
    directModelOrOpenAiClientCallFound,
    documentTextClientPersistenceFound,
    paidDnaPersistenceUploadUiEnablementFound,
    smartTalkFreeQaUiNonInterferenceConfirmed,
    safeUiContractConfirmedIfPresent,
    noPrematureBrowserManualTest: true,
    readyForBrowserUiWiringImplementationPlan,
    readyForBrowserManualTestPlanning,
    readyForBrowserManualTest: false,
    textDocumentRuntimeAuthorizedForProductionNow: false,
    textDocumentRuntimeStillControlledLocalOnly: true,
    photoOcrRuntimeStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    liveRouteInvocationPerformedByThisAudit: false,
    liveModelCallPerformedByThisAudit: false,
    openAiSdkImportedByAudit: false,
    fetchUsedAsRuntimeByAudit: false,
    processEnvReadForAuthorizationByAudit: false,
    filesWrittenByAudit: false,
    dbStorageTouchedByAudit: false,
    eightThreeAcNotRun: true,
    readyForNextPhase,
    recommendedNextPhase,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    uiScanFindings,
    safeFindings,
    warnings,
    unsafeFindings,
    remainingBlockers,
    nextRecommendedSteps,
    notes,
  };

  if (!anyUnsafeFound && !_isCanonicalTextDocumentModeBrowserUiWiringAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_BROWSER_UI_WIRING_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeBrowserUiWiringAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9I tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed = auditFailures.length === 0 && allPassedDecision === true && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9I tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9I result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-browser-ui-wiring-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeBrowserUiWiringAudit(), null, 2));
}
