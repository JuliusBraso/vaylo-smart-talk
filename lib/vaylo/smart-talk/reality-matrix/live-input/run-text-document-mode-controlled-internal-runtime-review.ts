/**
 * PHASE 8.9H — Text Document Mode Controlled Internal Runtime Review
 *
 * Pure, local, static review closure that aggregates the four prior Text
 * Document Mode evidence phases (8.9D-CLOSURE disabled path, 8.9E-CLOSURE
 * enabled path, 8.9F regression pack, 8.9G route hardening audit) into a
 * single controlled-internal-runtime-review decision.
 *
 * This phase performs NO live route/model/fetch/OpenAI/process.env-
 * authorization/DB/storage access of its own. It does not modify
 * app/api/smart-talk/route.ts, does not call /api/smart-talk, does not
 * start a dev server, does not run 8.3AC, and does not touch
 * tmp-8-3ac-live-metadata.ts.
 *
 * Decision: Text Document Mode is ready for a controlled internal runtime
 * review / browser-UI-wiring audit, but remains NOT ready for public
 * runtime, production, go-live, photo/OCR, scanner/upload, file upload,
 * paid document mode, Vaylo DNA, or persistence/DB/storage.
 */

import { runTextDocumentModeDisabledLocalApiTestClosure } from "./run-text-document-mode-disabled-local-api-test-closure";
import { runTextDocumentModeEnabledLocalApiTestClosure } from "./run-text-document-mode-enabled-local-api-test-closure";
import { runTextDocumentModeControlledLocalRegressionPack } from "./run-text-document-mode-controlled-local-regression-pack";
import { runTextDocumentModeRouteHardeningAudit } from "./run-text-document-mode-route-hardening-audit";

// ─── Result type ────────────────────────────────────────────────────────────

interface EvidenceChainEntry {
  step: number;
  phase: string;
  commit: string;
  label: string;
  accepted: boolean;
}

interface TextDocumentModeControlledInternalRuntimeReviewResult {
  checkId: "8.9H";
  allPassed: boolean;
  reviewOnly: true;
  sourceDisabledClosureCommit: "f1c5ef3";
  sourceEnabledClosureCommit: "9f231e2";
  sourceRegressionCommit: "3019ee6";
  sourceHardeningCommit: "4035e7e";
  sourceDisabledClosurePhase: "8.9D-CLOSURE";
  sourceEnabledClosurePhase: "8.9E-CLOSURE";
  sourceRegressionPhase: "8.9F";
  sourceHardeningPhase: "8.9G";
  disabledPathEvidenceAccepted: boolean;
  enabledPathEvidenceAccepted: boolean;
  falsePositiveFixEvidenceAccepted: boolean;
  regressionPackEvidenceAccepted: boolean;
  routeHardeningEvidenceAccepted: boolean;
  textDocumentModeBranchConfirmed: boolean;
  exactEnvFlagGateConfirmed: boolean;
  disabledPathFailClosedConfirmed: boolean;
  allowedDocumentTextConfirmed: boolean;
  blockedRiskInputsConfirmed: boolean;
  explicitPaidActivationStillBlocked: boolean;
  broadPaidFalsePositiveFixed: boolean;
  rateLimitObservedAndHandled: boolean;
  routeOrderingConfirmed: boolean;
  allRequiredPreModelBlocksConfirmed: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  textDocumentModeReadyForControlledInternalRuntimeReview: boolean;
  readyForTextDocumentModeBrowserUiWiringAudit: boolean;
  readyForTextDocumentModeBrowserManualTest: false;
  readyForTextDocumentModeInternalReadinessClosure: false;
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
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
  credentialFinancialIdentityStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  documentTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  liveRouteInvocationPerformedByThisReview: false;
  liveModelCallPerformedByThisReview: false;
  openAiSdkImported: false;
  fetchUsed: false;
  processEnvReadForAuthorization: false;
  filesWritten: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  readyForNextPhase: "8.9I";
  recommendedNextPhase: "Text Document Mode Browser/UI Wiring Audit";
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  evidenceChain: EvidenceChainEntry[];
  acceptedFindings: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeControlledInternalRuntimeReviewResult(
  r: TextDocumentModeControlledInternalRuntimeReviewResult,
): boolean {
  if (r.checkId !== "8.9H") return false;
  if (r.allPassed !== true) return false;
  if (r.reviewOnly !== true) return false;
  if (r.sourceDisabledClosureCommit !== "f1c5ef3") return false;
  if (r.sourceEnabledClosureCommit !== "9f231e2") return false;
  if (r.sourceRegressionCommit !== "3019ee6") return false;
  if (r.sourceHardeningCommit !== "4035e7e") return false;
  if (r.sourceDisabledClosurePhase !== "8.9D-CLOSURE") return false;
  if (r.sourceEnabledClosurePhase !== "8.9E-CLOSURE") return false;
  if (r.sourceRegressionPhase !== "8.9F") return false;
  if (r.sourceHardeningPhase !== "8.9G") return false;
  if (r.disabledPathEvidenceAccepted !== true) return false;
  if (r.enabledPathEvidenceAccepted !== true) return false;
  if (r.falsePositiveFixEvidenceAccepted !== true) return false;
  if (r.regressionPackEvidenceAccepted !== true) return false;
  if (r.routeHardeningEvidenceAccepted !== true) return false;
  if (r.textDocumentModeBranchConfirmed !== true) return false;
  if (r.exactEnvFlagGateConfirmed !== true) return false;
  if (r.disabledPathFailClosedConfirmed !== true) return false;
  if (r.allowedDocumentTextConfirmed !== true) return false;
  if (r.blockedRiskInputsConfirmed !== true) return false;
  if (r.explicitPaidActivationStillBlocked !== true) return false;
  if (r.broadPaidFalsePositiveFixed !== true) return false;
  if (r.rateLimitObservedAndHandled !== true) return false;
  if (r.routeOrderingConfirmed !== true) return false;
  if (r.allRequiredPreModelBlocksConfirmed !== true) return false;
  if (r.publicFreeQaBranchStillPresent !== true) return false;
  if (r.internalGuardedBranchStillPresent !== true) return false;
  if (r.textDocumentModeReadyForControlledInternalRuntimeReview !== true) return false;
  if (r.readyForTextDocumentModeBrowserUiWiringAudit !== true) return false;
  if (r.readyForTextDocumentModeBrowserManualTest !== false) return false;
  if (r.readyForTextDocumentModeInternalReadinessClosure !== false) return false;
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
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.credentialFinancialIdentityStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.liveRouteInvocationPerformedByThisReview !== false) return false;
  if (r.liveModelCallPerformedByThisReview !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.processEnvReadForAuthorization !== false) return false;
  if (r.filesWritten !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForNextPhase !== "8.9I") return false;
  if (r.recommendedNextPhase !== "Text Document Mode Browser/UI Wiring Audit") return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.evidenceChain) || r.evidenceChain.length !== 4) return false;
  if (r.evidenceChain.some((e) => e.accepted !== true)) return false;
  if (!Array.isArray(r.acceptedFindings) || r.acceptedFindings.length === 0) return false;
  if (!Array.isArray(r.remainingBlockers) || r.remainingBlockers.length !== 11) return false;
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89HMutation = (
  r: TextDocumentModeControlledInternalRuntimeReviewResult,
) => TextDocumentModeControlledInternalRuntimeReviewResult;
interface Tamper89HCase {
  label: string;
  mutate: Tamper89HMutation;
}

const TEXT_DOCUMENT_MODE_CONTROLLED_INTERNAL_RUNTIME_REVIEW_TAMPER_CASES: Tamper89HCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9G" as "8.9H" }) },
  { label: "allPassed false (a source phase is not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "reviewOnly false", mutate: (r) => ({ ...r, reviewOnly: false as true }) },
  { label: "sourceDisabledClosureCommit wrong (source commit changes)", mutate: (r) => ({ ...r, sourceDisabledClosureCommit: "0000000" as "f1c5ef3" }) },
  { label: "sourceEnabledClosureCommit wrong (source commit changes)", mutate: (r) => ({ ...r, sourceEnabledClosureCommit: "0000000" as "9f231e2" }) },
  { label: "sourceRegressionCommit wrong (source commit changes)", mutate: (r) => ({ ...r, sourceRegressionCommit: "0000000" as "3019ee6" }) },
  { label: "sourceHardeningCommit wrong (source commit changes)", mutate: (r) => ({ ...r, sourceHardeningCommit: "0000000" as "4035e7e" }) },
  { label: "sourceDisabledClosurePhase wrong", mutate: (r) => ({ ...r, sourceDisabledClosurePhase: "8.9C" as "8.9D-CLOSURE" }) },
  { label: "sourceEnabledClosurePhase wrong", mutate: (r) => ({ ...r, sourceEnabledClosurePhase: "8.9E-BLOCKER" as "8.9E-CLOSURE" }) },
  { label: "sourceRegressionPhase wrong", mutate: (r) => ({ ...r, sourceRegressionPhase: "8.9E-CLOSURE" as "8.9F" }) },
  { label: "sourceHardeningPhase wrong", mutate: (r) => ({ ...r, sourceHardeningPhase: "8.9F" as "8.9G" }) },
  { label: "disabledPathEvidenceAccepted false (disabled path evidence not accepted)", mutate: (r) => ({ ...r, disabledPathEvidenceAccepted: false }) },
  { label: "enabledPathEvidenceAccepted false (enabled path evidence not accepted)", mutate: (r) => ({ ...r, enabledPathEvidenceAccepted: false }) },
  { label: "falsePositiveFixEvidenceAccepted false (false-positive fix evidence not accepted)", mutate: (r) => ({ ...r, falsePositiveFixEvidenceAccepted: false }) },
  { label: "regressionPackEvidenceAccepted false (regression pack evidence not accepted)", mutate: (r) => ({ ...r, regressionPackEvidenceAccepted: false }) },
  { label: "routeHardeningEvidenceAccepted false (route hardening evidence not accepted)", mutate: (r) => ({ ...r, routeHardeningEvidenceAccepted: false }) },
  { label: "textDocumentModeBranchConfirmed false", mutate: (r) => ({ ...r, textDocumentModeBranchConfirmed: false }) },
  { label: "exactEnvFlagGateConfirmed false (exact env gate not confirmed)", mutate: (r) => ({ ...r, exactEnvFlagGateConfirmed: false }) },
  { label: "disabledPathFailClosedConfirmed false (disabled path fail-closed not confirmed)", mutate: (r) => ({ ...r, disabledPathFailClosedConfirmed: false }) },
  { label: "allowedDocumentTextConfirmed false (allowed document text not confirmed)", mutate: (r) => ({ ...r, allowedDocumentTextConfirmed: false }) },
  { label: "blockedRiskInputsConfirmed false (blocked risk inputs not confirmed)", mutate: (r) => ({ ...r, blockedRiskInputsConfirmed: false }) },
  { label: "explicitPaidActivationStillBlocked false (explicit paid activation becomes allowed)", mutate: (r) => ({ ...r, explicitPaidActivationStillBlocked: false }) },
  { label: "broadPaidFalsePositiveFixed false (broad paid false positive not fixed)", mutate: (r) => ({ ...r, broadPaidFalsePositiveFixed: false }) },
  { label: "routeOrderingConfirmed false (route ordering not confirmed)", mutate: (r) => ({ ...r, routeOrderingConfirmed: false }) },
  { label: "allRequiredPreModelBlocksConfirmed false (pre-model blocks not confirmed)", mutate: (r) => ({ ...r, allRequiredPreModelBlocksConfirmed: false }) },
  { label: "publicFreeQaBranchStillPresent false (public Free Q&A branch not present)", mutate: (r) => ({ ...r, publicFreeQaBranchStillPresent: false }) },
  { label: "internalGuardedBranchStillPresent false (internal guarded branch not present)", mutate: (r) => ({ ...r, internalGuardedBranchStillPresent: false }) },
  { label: "readyForTextDocumentModeBrowserUiWiringAudit false when should be true", mutate: (r) => ({ ...r, readyForTextDocumentModeBrowserUiWiringAudit: false }) },
  { label: "readyForTextDocumentModeBrowserManualTest true (browser manual test incorrectly marked complete)", mutate: (r) => ({ ...r, readyForTextDocumentModeBrowserManualTest: true as false }) },
  { label: "readyForTextDocumentModeInternalReadinessClosure true (internal readiness closure incorrectly marked complete)", mutate: (r) => ({ ...r, readyForTextDocumentModeInternalReadinessClosure: true as false }) },
  { label: "textDocumentRuntimeAuthorizedForProductionNow true (production runtime becomes authorized)", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedForProductionNow: true as false }) },
  { label: "textDocumentRuntimeStillControlledLocalOnly false", mutate: (r) => ({ ...r, textDocumentRuntimeStillControlledLocalOnly: false as true }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false (scanner/upload becomes ready)", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "fileUploadStillBlocked false (file upload becomes ready)", mutate: (r) => ({ ...r, fileUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false (paid mode becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false (Vaylo DNA becomes allowed)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false (persistence becomes allowed)", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false (DB storage becomes allowed)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionAuthorizedNow true (production becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "credentialFinancialIdentityStillBlocked false (credential/financial/identity protection becomes allowed)", mutate: (r) => ({ ...r, credentialFinancialIdentityStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "documentTextTreatedAsSensitive false", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformedByThisReview true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisReview: true as false }) },
  { label: "liveModelCallPerformedByThisReview true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisReview: true as false }) },
  { label: "openAiSdkImported true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "processEnvReadForAuthorization true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorization: true as false }) },
  { label: "filesWritten true (claims file writes)", mutate: (r) => ({ ...r, filesWritten: true as false }) },
  { label: "dbStorageTouched true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForNextPhase wrong", mutate: (r) => ({ ...r, readyForNextPhase: "8.9J" as "8.9I" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Public Runtime Launch" as "Text Document Mode Browser/UI Wiring Audit" }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "evidenceChain missing an entry", mutate: (r) => ({ ...r, evidenceChain: r.evidenceChain.slice(0, 3) }) },
  {
    label: "evidenceChain entry flipped to not accepted",
    mutate: (r) => ({
      ...r,
      evidenceChain: r.evidenceChain.map((e, i) => (i === 0 ? { ...e, accepted: false } : e)),
    }),
  },
  { label: "acceptedFindings empty", mutate: (r) => ({ ...r, acceptedFindings: [] }) },
  { label: "remainingBlockers missing entries", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 5) }) },
  { label: "nextRecommendedSteps empty", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported review runner ──────────────────────────────────────────────────

export function runTextDocumentModeControlledInternalRuntimeReview(): TextDocumentModeControlledInternalRuntimeReviewResult {
  const reviewFailures: string[] = [];

  // ── 8.9D-CLOSURE — disabled path evidence ───────────────────────────────────
  const d = runTextDocumentModeDisabledLocalApiTestClosure();
  if (d.checkId !== "8.9D-CLOSURE") reviewFailures.push(`8.9D-CLOSURE checkId mismatch: got "${d.checkId}"`);
  if (d.allPassed !== true) reviewFailures.push("8.9D-CLOSURE allPassed is not true");
  if (d.sourceRoutePatchCommit !== "483ed41") reviewFailures.push("8.9D-CLOSURE sourceRoutePatchCommit mismatch");
  if (d.exactEnvFlagGateConfirmed !== true) reviewFailures.push("8.9D-CLOSURE exactEnvFlagGateConfirmed is not true");
  if (d.disabledPathFailClosedConfirmed !== true) reviewFailures.push("8.9D-CLOSURE disabledPathFailClosedConfirmed is not true");
  if (d.disabledPathBeforeModelCallConfirmed !== true) reviewFailures.push("8.9D-CLOSURE disabledPathBeforeModelCallConfirmed is not true");
  if (d.readyForControlledLocalTextDocumentEnabledApiTestPlanning !== true)
    reviewFailures.push("8.9D-CLOSURE readyForControlledLocalTextDocumentEnabledApiTestPlanning is not true");
  if (d.readyForTextDocumentRuntime !== false) reviewFailures.push("8.9D-CLOSURE readyForTextDocumentRuntime is not false");
  if (d.readyForPhotoOcrRuntime !== false) reviewFailures.push("8.9D-CLOSURE readyForPhotoOcrRuntime is not false");
  if (d.readyForPublicRuntime !== false) reviewFailures.push("8.9D-CLOSURE readyForPublicRuntime is not false");
  if (d.readyForProduction !== false) reviewFailures.push("8.9D-CLOSURE readyForProduction is not false");
  if (d.readyForGoLive !== false) reviewFailures.push("8.9D-CLOSURE readyForGoLive is not false");
  if (d.tamperRejected !== d.tamperCount) reviewFailures.push("8.9D-CLOSURE own tamper count mismatch");

  // ── 8.9E-CLOSURE — enabled path + false-positive-fix retest evidence ────────
  const e = runTextDocumentModeEnabledLocalApiTestClosure();
  if (e.checkId !== "8.9E-CLOSURE") reviewFailures.push(`8.9E-CLOSURE checkId mismatch: got "${e.checkId}"`);
  if (e.allPassed !== true) reviewFailures.push("8.9E-CLOSURE allPassed is not true");
  if (e.sourceFalsePositiveFixCommit !== "f486ab6") reviewFailures.push("8.9E-CLOSURE sourceFalsePositiveFixCommit mismatch");
  if (e.allowedHealthInsuranceDocumentTextPassed !== true)
    reviewFailures.push("8.9E-CLOSURE allowedHealthInsuranceDocumentTextPassed is not true");
  if (e.ocrPhotoRequestSafelyBlocked !== true) reviewFailures.push("8.9E-CLOSURE ocrPhotoRequestSafelyBlocked is not true");
  if (e.exactLegalDeadlineBlocked !== true) reviewFailures.push("8.9E-CLOSURE exactLegalDeadlineBlocked is not true");
  if (e.credentialTextBlocked !== true) reviewFailures.push("8.9E-CLOSURE credentialTextBlocked is not true");
  if (e.ibanPaymentTextBlocked !== true) reviewFailures.push("8.9E-CLOSURE ibanPaymentTextBlocked is not true");
  if (e.nonDocumentGeneralQuestionBlocked !== true) reviewFailures.push("8.9E-CLOSURE nonDocumentGeneralQuestionBlocked is not true");
  if (e.explicitPaidActivationBlocked !== true) reviewFailures.push("8.9E-CLOSURE explicitPaidActivationBlocked is not true");
  if (e.falsePositiveFixedByManualRetest !== true) reviewFailures.push("8.9E-CLOSURE falsePositiveFixedByManualRetest is not true");
  if (e.rateLimitObservedAndHandled !== true) reviewFailures.push("8.9E-CLOSURE rateLimitObservedAndHandled is not true");
  if (e.readyForTextDocumentModeLocalRegressionPack !== true)
    reviewFailures.push("8.9E-CLOSURE readyForTextDocumentModeLocalRegressionPack is not true");
  if (e.readyForTextDocumentRuntime !== false) reviewFailures.push("8.9E-CLOSURE readyForTextDocumentRuntime is not false");
  if (e.readyForPhotoOcrRuntime !== false) reviewFailures.push("8.9E-CLOSURE readyForPhotoOcrRuntime is not false");
  if (e.readyForPublicRuntime !== false) reviewFailures.push("8.9E-CLOSURE readyForPublicRuntime is not false");
  if (e.readyForProduction !== false) reviewFailures.push("8.9E-CLOSURE readyForProduction is not false");
  if (e.readyForGoLive !== false) reviewFailures.push("8.9E-CLOSURE readyForGoLive is not false");
  if (e.tamperRejected !== e.tamperCount) reviewFailures.push("8.9E-CLOSURE own tamper count mismatch");

  // ── 8.9F — controlled local regression pack evidence ────────────────────────
  const f = runTextDocumentModeControlledLocalRegressionPack();
  if (f.checkId !== "8.9F") reviewFailures.push(`8.9F checkId mismatch: got "${f.checkId}"`);
  if (f.allPassed !== true) reviewFailures.push("8.9F allPassed is not true");
  if (f.sourceEnabledClosureCommit !== "9f231e2") reviewFailures.push("8.9F sourceEnabledClosureCommit mismatch");
  if (f.allowedRegressionCaseCount < 12) reviewFailures.push("8.9F allowedRegressionCaseCount below 12");
  if (f.blockedRegressionCaseCount < 28) reviewFailures.push("8.9F blockedRegressionCaseCount below 28");
  if (f.readyForTextDocumentModeRouteHardeningAudit !== true)
    reviewFailures.push("8.9F readyForTextDocumentModeRouteHardeningAudit is not true");
  if (f.readyForTextDocumentRuntime !== false) reviewFailures.push("8.9F readyForTextDocumentRuntime is not false");
  if (f.readyForPhotoOcrRuntime !== false) reviewFailures.push("8.9F readyForPhotoOcrRuntime is not false");
  if (f.readyForPublicRuntime !== false) reviewFailures.push("8.9F readyForPublicRuntime is not false");
  if (f.readyForProduction !== false) reviewFailures.push("8.9F readyForProduction is not false");
  if (f.readyForGoLive !== false) reviewFailures.push("8.9F readyForGoLive is not false");
  if (f.tamperRejected !== f.tamperCount) reviewFailures.push("8.9F own tamper count mismatch");

  // ── 8.9G — route hardening static audit evidence ────────────────────────────
  const g = runTextDocumentModeRouteHardeningAudit();
  if (g.checkId !== "8.9G") reviewFailures.push(`8.9G checkId mismatch: got "${g.checkId}"`);
  if (g.allPassed !== true) reviewFailures.push("8.9G allPassed is not true");
  if (g.sourceRegressionCommit !== "3019ee6") reviewFailures.push("8.9G sourceRegressionCommit mismatch");
  if (g.textDocumentBranchDetected !== true) reviewFailures.push("8.9G textDocumentBranchDetected is not true");
  if (g.exactEnvFlagOnlyDetected !== true) reviewFailures.push("8.9G exactEnvFlagOnlyDetected is not true");
  if (g.disabledPathFailClosedDetected !== true) reviewFailures.push("8.9G disabledPathFailClosedDetected is not true");
  if (g.disabledPathBeforeModelCallDetected !== true) reviewFailures.push("8.9G disabledPathBeforeModelCallDetected is not true");
  if (g.allRequiredBlockersBeforeModelCallDetected !== true)
    reviewFailures.push("8.9G allRequiredBlockersBeforeModelCallDetected is not true");
  if (g.narrowPaidActivationDetectorDetected !== true) reviewFailures.push("8.9G narrowPaidActivationDetectorDetected is not true");
  if (g.broadPaidDetectorNotUsedInTextDocumentBranch !== true)
    reviewFailures.push("8.9G broadPaidDetectorNotUsedInTextDocumentBranch is not true");
  if (g.explicitPaidActivationPhrasesDetected !== true) reviewFailures.push("8.9G explicitPaidActivationPhrasesDetected is not true");
  if (g.publicFreeQaBranchStillPresent !== true) reviewFailures.push("8.9G publicFreeQaBranchStillPresent is not true");
  if (g.internalGuardedBranchStillPresent !== true) reviewFailures.push("8.9G internalGuardedBranchStillPresent is not true");
  if (g.textDocumentRunSmartTalkAfterBlocksDetected !== true)
    reviewFailures.push("8.9G textDocumentRunSmartTalkAfterBlocksDetected is not true");
  if (g.textDocumentSuccessMetadataDetected !== true) reviewFailures.push("8.9G textDocumentSuccessMetadataDetected is not true");
  if (g.dbStorageWriteAdded !== false) reviewFailures.push("8.9G dbStorageWriteAdded is not false");
  if (g.ocrUploadHandlerAdded !== false) reviewFailures.push("8.9G ocrUploadHandlerAdded is not false");
  if (g.readyForTextDocumentModeControlledInternalRuntimeReview !== true)
    reviewFailures.push("8.9G readyForTextDocumentModeControlledInternalRuntimeReview is not true");
  if (g.readyForTextDocumentRuntime !== false) reviewFailures.push("8.9G readyForTextDocumentRuntime is not false");
  if (g.readyForPhotoOcrRuntime !== false) reviewFailures.push("8.9G readyForPhotoOcrRuntime is not false");
  if (g.readyForPublicRuntime !== false) reviewFailures.push("8.9G readyForPublicRuntime is not false");
  if (g.readyForProduction !== false) reviewFailures.push("8.9G readyForProduction is not false");
  if (g.readyForGoLive !== false) reviewFailures.push("8.9G readyForGoLive is not false");
  if (g.tamperRejected !== g.tamperCount) reviewFailures.push("8.9G own tamper count mismatch");

  // ── Derived review findings ──────────────────────────────────────────────────
  const disabledPathEvidenceAccepted =
    d.checkId === "8.9D-CLOSURE" &&
    d.allPassed === true &&
    d.readyForControlledLocalTextDocumentEnabledApiTestPlanning === true;

  const enabledPathEvidenceAccepted =
    e.checkId === "8.9E-CLOSURE" &&
    e.allPassed === true &&
    e.allowedHealthInsuranceDocumentTextPassed === true &&
    e.readyForTextDocumentModeLocalRegressionPack === true;

  const falsePositiveFixEvidenceAccepted =
    e.allowedHealthInsuranceDocumentTextPassed === true &&
    e.falsePositiveFixedByManualRetest === true &&
    e.explicitPaidActivationBlocked === true;

  const regressionPackEvidenceAccepted =
    f.checkId === "8.9F" &&
    f.allPassed === true &&
    f.allowedRegressionCaseCount >= 12 &&
    f.blockedRegressionCaseCount >= 28;

  const routeHardeningEvidenceAccepted = g.checkId === "8.9G" && g.allPassed === true;

  const textDocumentModeBranchConfirmed = g.textDocumentBranchDetected === true;
  const exactEnvFlagGateConfirmed = d.exactEnvFlagGateConfirmed === true && g.exactEnvFlagOnlyDetected === true;
  const disabledPathFailClosedConfirmed =
    d.disabledPathFailClosedConfirmed === true && g.disabledPathFailClosedDetected === true;
  const allowedDocumentTextConfirmed = e.allowedHealthInsuranceDocumentTextPassed === true;
  const blockedRiskInputsConfirmed =
    e.ocrPhotoRequestSafelyBlocked === true &&
    e.exactLegalDeadlineBlocked === true &&
    e.credentialTextBlocked === true &&
    e.ibanPaymentTextBlocked === true &&
    e.nonDocumentGeneralQuestionBlocked === true;
  const explicitPaidActivationStillBlocked =
    e.explicitPaidActivationBlocked === true && g.explicitPaidActivationPhrasesDetected === true;
  const broadPaidFalsePositiveFixed =
    e.falsePositiveFixedByManualRetest === true && g.broadPaidDetectorNotUsedInTextDocumentBranch === true;
  const rateLimitObservedAndHandled = e.rateLimitObservedAndHandled === true;
  const routeOrderingConfirmed =
    g.disabledPathBeforeModelCallDetected === true &&
    g.allRequiredBlockersBeforeModelCallDetected === true &&
    g.textDocumentRunSmartTalkAfterBlocksDetected === true;
  const allRequiredPreModelBlocksConfirmed = g.allRequiredBlockersBeforeModelCallDetected === true;
  const publicFreeQaBranchStillPresent = g.publicFreeQaBranchStillPresent === true;
  const internalGuardedBranchStillPresent = g.internalGuardedBranchStillPresent === true;

  const evidenceChain: EvidenceChainEntry[] = [
    {
      step: 1,
      phase: "8.9D-CLOSURE",
      commit: "f1c5ef3",
      label: "disabled path — absent/false/TRUE/1/yes all returned 403 text_document_mode_disabled; exact env flag gate confirmed",
      accepted: disabledPathEvidenceAccepted,
    },
    {
      step: 2,
      phase: "8.9E-CLOSURE",
      commit: "9f231e2",
      label:
        "enabled path — allowed health-insurance document text returned 200 ok=true; OCR/photo, exact legal deadline, credential/API key, IBAN/payment, non-document question, and explicit paid activation all correctly blocked",
      accepted: enabledPathEvidenceAccepted,
    },
    {
      step: 3,
      phase: "8.9F",
      commit: "3019ee6",
      label: "controlled local synthetic regression pack — 12 allowed cases accepted, 30 blocked cases rejected, 42/42 passed",
      accepted: regressionPackEvidenceAccepted,
    },
    {
      step: 4,
      phase: "8.9G",
      commit: "4035e7e",
      label:
        "route hardening static audit — branch identity/env gate/fail-closed disabled path confirmed, all pre-model blockers confirmed before runSmartTalk, narrow paid activation detector confirmed, public Free Q&A and internal guarded branches still present, no forbidden markers detected",
      accepted: routeHardeningEvidenceAccepted,
    },
  ];

  const acceptedFindings: string[] = [
    "Text Document Mode branch (text_document_controlled_runtime) is confirmed present in app/api/smart-talk/route.ts and gated by the exact env flag SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED === \"true\".",
    "Disabled path is fail-closed: any non-exact env flag value (absent, \"false\", \"TRUE\", \"1\", \"yes\") returns 403 text_document_mode_disabled before any model call.",
    "Enabled path allows normal pasted document text (e.g. health-insurance letters) and returns 200 with textDocumentMeta safety flags.",
    "The 8.9E-BLOCKER false-positive fix (narrow detectExplicitPaidDocumentModeActivationForTextDocumentMode text detector replacing the broad body-field detector) is confirmed both by manual retest (8.9E-CLOSURE) and by static route audit (8.9G): normal document words no longer trigger paid-mode blocking, while genuine explicit paid-activation phrases are still blocked.",
    "All required pre-model-call safety blockers (OCR/photo, scanner/upload, file upload, paid activation, Vaylo DNA, persistence/storage, credential, financial/IBAN, identity document number, exact legal deadline, binding legal advice, official filing generation, high-risk legal/medical/tax, non-document signal) are confirmed present and ordered before runSmartTalk() in the route source.",
    "The pre-existing public Free Q&A beta branch and the internal guarded Free Q&A branch (including its internal secret header and guard phrase) remain present and unmodified.",
    "A transient rate-limit response (429) observed during manual retesting was correctly identified as an unrelated rate-limiter effect, not a Text Document Mode safety decision, and the retest after reset confirmed correct blocking behavior.",
    "No DB/storage writes, OCR/upload handlers, paid entitlement activation, or Vaylo DNA access markers were found anywhere in the route source by the 8.9G static audit.",
  ];

  const remainingBlockers: string[] = [
    "Browser/UI wiring not audited yet",
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

  const nextRecommendedSteps: string[] = [
    "Phase 8.9I: Text Document Mode Browser/UI Wiring Audit — a static, read-only review of any frontend/browser code paths that would call the text_document_controlled_runtime mode, confirming no premature public exposure, no auto-enabling of the env flag, and no UI element that bypasses the existing safety gates.",
    "Only after 8.9I: consider a controlled local browser manual test (still local, still behind the exact env flag, still internal-only).",
    "Only after a successful browser manual test: consider a Text Document Mode internal readiness closure summarizing full internal validation.",
    "Public runtime, production, go-live, photo/OCR, scanner/upload, file upload, paid document mode, Vaylo DNA, and persistence/DB/storage remain explicitly out of scope until separately authorized in future phases.",
  ];

  const notes: string[] = [
    "IN-01: 8.9H is a pure, local, static review that aggregates four prior evidence phases (8.9D-CLOSURE, 8.9E-CLOSURE, 8.9F, 8.9G) into a single controlled-internal-runtime-review decision; it performs no live route/model/fetch/OpenAI/process.env-authorization/DB/storage access of its own.",
    `IN-02: 8.9D-CLOSURE confirmed — checkId=${d.checkId}, allPassed=${d.allPassed}, exactEnvFlagGateConfirmed=${d.exactEnvFlagGateConfirmed}, disabledPathFailClosedConfirmed=${d.disabledPathFailClosedConfirmed}.`,
    `IN-03: 8.9E-CLOSURE confirmed — checkId=${e.checkId}, allPassed=${e.allPassed}, allowedHealthInsuranceDocumentTextPassed=${e.allowedHealthInsuranceDocumentTextPassed}, explicitPaidActivationBlocked=${e.explicitPaidActivationBlocked}, rateLimitObservedAndHandled=${e.rateLimitObservedAndHandled}.`,
    `IN-04: 8.9F confirmed — checkId=${f.checkId}, allPassed=${f.allPassed}, allowedRegressionCaseCount=${f.allowedRegressionCaseCount}, blockedRegressionCaseCount=${f.blockedRegressionCaseCount}.`,
    `IN-05: 8.9G confirmed — checkId=${g.checkId}, allPassed=${g.allPassed}, allRequiredBlockersBeforeModelCallDetected=${g.allRequiredBlockersBeforeModelCallDetected}, broadPaidDetectorNotUsedInTextDocumentBranch=${g.broadPaidDetectorNotUsedInTextDocumentBranch}.`,
    "IN-06: this review's decision is that Text Document Mode is ready for a controlled internal runtime review / browser-UI-wiring audit (8.9I), but remains NOT ready for public runtime, production, go-live, photo/OCR, scanner/upload, file upload, paid document mode, Vaylo DNA, or persistence/DB/storage.",
    "IN-07: this review does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_CONTROLLED_INTERNAL_RUNTIME_REVIEW_TAMPER_CASES.length;

  const readyDecision =
    disabledPathEvidenceAccepted &&
    enabledPathEvidenceAccepted &&
    falsePositiveFixEvidenceAccepted &&
    regressionPackEvidenceAccepted &&
    routeHardeningEvidenceAccepted &&
    textDocumentModeBranchConfirmed &&
    exactEnvFlagGateConfirmed &&
    disabledPathFailClosedConfirmed &&
    allowedDocumentTextConfirmed &&
    blockedRiskInputsConfirmed &&
    explicitPaidActivationStillBlocked &&
    broadPaidFalsePositiveFixed &&
    rateLimitObservedAndHandled &&
    routeOrderingConfirmed &&
    allRequiredPreModelBlocksConfirmed &&
    publicFreeQaBranchStillPresent &&
    internalGuardedBranchStillPresent;

  const provisional: TextDocumentModeControlledInternalRuntimeReviewResult = {
    checkId: "8.9H",
    allPassed: true,
    reviewOnly: true,
    sourceDisabledClosureCommit: "f1c5ef3",
    sourceEnabledClosureCommit: "9f231e2",
    sourceRegressionCommit: "3019ee6",
    sourceHardeningCommit: "4035e7e",
    sourceDisabledClosurePhase: "8.9D-CLOSURE",
    sourceEnabledClosurePhase: "8.9E-CLOSURE",
    sourceRegressionPhase: "8.9F",
    sourceHardeningPhase: "8.9G",
    disabledPathEvidenceAccepted,
    enabledPathEvidenceAccepted,
    falsePositiveFixEvidenceAccepted,
    regressionPackEvidenceAccepted,
    routeHardeningEvidenceAccepted,
    textDocumentModeBranchConfirmed,
    exactEnvFlagGateConfirmed,
    disabledPathFailClosedConfirmed,
    allowedDocumentTextConfirmed,
    blockedRiskInputsConfirmed,
    explicitPaidActivationStillBlocked,
    broadPaidFalsePositiveFixed,
    rateLimitObservedAndHandled,
    routeOrderingConfirmed,
    allRequiredPreModelBlocksConfirmed,
    publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent,
    textDocumentModeReadyForControlledInternalRuntimeReview: readyDecision,
    readyForTextDocumentModeBrowserUiWiringAudit: readyDecision,
    readyForTextDocumentModeBrowserManualTest: false,
    readyForTextDocumentModeInternalReadinessClosure: false,
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
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    credentialFinancialIdentityStillBlocked: true,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    liveRouteInvocationPerformedByThisReview: false,
    liveModelCallPerformedByThisReview: false,
    openAiSdkImported: false,
    fetchUsed: false,
    processEnvReadForAuthorization: false,
    filesWritten: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    readyForNextPhase: "8.9I",
    recommendedNextPhase: "Text Document Mode Browser/UI Wiring Audit",
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    evidenceChain,
    acceptedFindings,
    remainingBlockers,
    nextRecommendedSteps,
    notes,
  };

  if (!_isCanonicalTextDocumentModeControlledInternalRuntimeReviewResult(provisional)) {
    reviewFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_CONTROLLED_INTERNAL_RUNTIME_REVIEW_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeControlledInternalRuntimeReviewResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9H tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) reviewFailures.push(...tamperFailures);

  const allPassed = reviewFailures.length === 0 && readyDecision === true && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9H tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    `8.9H evidence chain: ${evidenceChain.filter((e) => e.accepted).length}/${evidenceChain.length} entries accepted`,
    ...(reviewFailures.length > 0 ? [`FAILURES (${reviewFailures.length}):`, ...reviewFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    textDocumentModeReadyForControlledInternalRuntimeReview: allPassed,
    readyForTextDocumentModeBrowserUiWiringAudit: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9H result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-controlled-internal-runtime-review");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeControlledInternalRuntimeReview(), null, 2));
}
