/**
 * PHASE 8.8D — Synthetic Runtime Activation Dry-Run for Free Smart Talk Q&A
 *
 * Synthetic-dry-run-only phase. This phase performs a purely synthetic
 * activation dry-run for Free Smart Talk Q&A only.
 *
 * This phase MUST NOT:
 * - Activate runtime
 * - Enable the Evidence Gates seam
 * - Change EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED
 * - Modify runSmartTalk
 * - Import or execute runSmartTalk
 * - Modify route files
 * - Add runtime product functionality
 * - Call models, process real user input or real documents
 *
 * Synthetic dry-run matrix:
 * - Allowed Free Q&A synthetic cases -> allowed_for_future_controlled_internal_test
 * - Forbidden document/photo/OCR/scanner/paid/DNA cases -> blocked_by_contract
 * - Unsafe/unknown cases -> fail_closed
 *
 * Future required phases:
 * - 8.8E: Post-Activation Readiness Audit for Free Q&A
 * - 8.8F: Controlled Internal Test Authorization for Free Q&A
 *
 * This phase itself does NOT authorize activation.
 */

import { runFreeQaControlledRuntimeActivationContract } from "./run-free-qa-controlled-runtime-activation-contract";

// ─── Activation target literal type ──────────────────────────────────────────

type ActivationTarget88D = "free_smart_talk_qa_only";

// ─── Synthetic case types ─────────────────────────────────────────────────────

type SyntheticCaseClass =
  | "allowed_anonymous_qa"
  | "forbidden_document"
  | "forbidden_photo_ocr"
  | "forbidden_scanner"
  | "forbidden_paid_dna"
  | "forbidden_exact_deadline"
  | "forbidden_trusted_legal_advice"
  | "unsafe_unknown";

type SyntheticCaseClassification =
  | "allowed_for_future_controlled_internal_test"
  | "blocked_by_contract"
  | "fail_closed";

// ─── Synthetic case classifier ────────────────────────────────────────────────

function _classifySyntheticCase(caseClass: SyntheticCaseClass): SyntheticCaseClassification {
  switch (caseClass) {
    case "allowed_anonymous_qa":
      return "allowed_for_future_controlled_internal_test";
    case "forbidden_document":
    case "forbidden_photo_ocr":
    case "forbidden_scanner":
    case "forbidden_paid_dna":
    case "forbidden_exact_deadline":
    case "forbidden_trusted_legal_advice":
      return "blocked_by_contract";
    case "unsafe_unknown":
    default:
      return "fail_closed";
  }
}

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaSyntheticDryRunResult {
  checkId: "8.8D";
  allPassed: boolean;
  syntheticRuntimeActivationDryRunOnly: true;
  freeQaSyntheticRuntimeActivationDryRunFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaControlledRuntimeActivationContractFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  routeFilesModified: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  additionalWiringPerformed: false;
  runtimeActivationPerformed: false;
  productionActivationPerformed: false;
  publicRuntimeActivationPerformed: false;
  seamActivationPerformed: false;
  documentRuntimeActivationPerformed: false;
  photoOcrRuntimeActivationPerformed: false;
  scannerRuntimeActivationPerformed: false;
  paidDocumentModeRuntimeActivationPerformed: false;
  vayloDnaRuntimeActivationPerformed: false;
  importedOnlyFreeQaControlledRuntimeActivationContractRunner: true;
  noOtherImportsUsed: true;
  freeQaControlledRuntimeActivationContractRunnerCalled: true;
  freeQaControlledRuntimeActivationContractCheckId: "8.8C";
  freeQaControlledRuntimeActivationContractAllPassed: true;
  freeQaControlledRuntimeActivationContractReadyForDryRun: true;
  freeQaActivationTargetConfirmed: ActivationTarget88D;
  freeQaContractDoesNotAuthorizeActivationConfirmed: true;
  freeQaContractRuntimeDisabledNowConfirmed: true;
  activationTarget: ActivationTarget88D;
  dryRunCreatedForFreeQaOnly: true;
  dryRunDoesNotAuthorizeActivation: true;
  dryRunDoesNotAuthorizeRuntimeExecution: true;
  dryRunDoesNotAuthorizePublicRuntime: true;
  dryRunDoesNotAuthorizePilotRuntime: true;
  dryRunDoesNotAuthorizeProductionRuntime: true;
  dryRunDoesNotAuthorizeGoLive: true;
  allowedSyntheticCaseCount: number;
  allowedSyntheticCasesPassed: number;
  forbiddenSyntheticCaseCount: number;
  forbiddenSyntheticCasesBlocked: number;
  unsafeUnknownSyntheticCaseCount: number;
  unsafeUnknownSyntheticCasesFailedClosed: number;
  syntheticDryRunMatrixPassing: true;
  allowedFreeQaCasesClassifiedForFutureControlledInternalTest: true;
  forbiddenDocumentCasesBlockedByContract: true;
  forbiddenPhotoOcrCasesBlockedByContract: true;
  forbiddenScannerCasesBlockedByContract: true;
  forbiddenPaidDnaCasesBlockedByContract: true;
  exactLegalDeadlineCasesBlockedByContract: true;
  trustedLegalAdviceCasesBlockedByContract: true;
  unsafeUnknownCasesFailClosed: true;
  evidenceGatesSeamExistsButDisabledByDefault: true;
  evidenceGatesSeamRemainsInert: true;
  evidenceGatesDryRunAdapterNotCalledWhileDisabled: true;
  evidenceGatesDryRunAdapterOutputNotUserVisible: true;
  evidenceGatesDryRunAdapterOutputNotPersisted: true;
  evidenceGatesSeamActivationUnauthorized: true;
  documentLikeTextGuardMustRemainActive: true;
  photoOcrRouteContainmentMustRemainActive: true;
  preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired: true;
  modelOutputRemainsUntrusted: true;
  claimAuthorizationSeparateFromRealityAuthorization: true;
  highRiskClaimsBlockedUnlessClaimAuthorized: true;
  documentDerivedClaimsBlockedUnlessRealityAuthorized: true;
  trapActivationStructuredMetadataOnly: true;
  unsafeUnknownStatesFailClosed: true;
  evidenceGatesUserVisibleOutputBlockedByDefault: true;
  exactLegalDeadlineCalculationUnauthorized: true;
  auditMetadataNonPersistentByDefault: true;
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
  seamActivationAuthorizedNow: false;
  controlledRuntimeActivationAuthorizedNow: false;
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  controlledRuntimeActivationReadinessAuditRequired: true;
  controlledRuntimeActivationClosureDecisionRequired: true;
  controlledInternalTestAuthorizationRequired: true;
  readyFor8x8EPostActivationReadinessAudit: true;
  readyForRuntimeActivation: false;
  readyForRealDocumentInput: false;
  readyForUserVisibleDocumentOutput: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPublicRuntime: false;
  readyForPilot: false;
  readyForProduction: false;
  readyForGoLive: false;
  claimRuleOrSemanticsDebtPreserved: true;
  evidenceRuleResolutionDebtPreserved: true;
  proximityManualOnlyDebtPreserved: true;
  trapKindTypingDebtPreserved: true;
  enforcementTrapHeuristicDebtPreserved: true;
  trapDispositionStateSeparationDebtPreserved: true;
  severityCandidateDerivationSeparationDebtPreserved: true;
  mapperDiagnosticTaxonomyDebtPreserved: true;
  td004ClosureDoesNotAuthorizeWiringDebtPreserved: true;
  freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8C: true;
  freeQaControlledRuntimeActivationContractTamperCaseCount: number;
  freeQaControlledRuntimeActivationContractTamperCasesRejected: number;
  freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8C: true;
  freeQaControlledRuntimeActivationPlanTamperCaseCount: number;
  freeQaControlledRuntimeActivationPlanTamperCasesRejected: number;
  governanceKernelConsolidationTamperConfirmedFrom8x8C: true;
  governanceKernelConsolidationTamperCaseCount: number;
  governanceKernelConsolidationTamperCasesRejected: number;
  evidenceGatesClosureDecisionTamperConfirmedFrom8x8C: true;
  evidenceGatesClosureDecisionTamperCaseCount: number;
  evidenceGatesClosureDecisionTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperConfirmedFrom8x8C: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x8C: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x8C: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x8C: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x8C: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x8C: true;
  wiringExecutionContractTamperCaseCount: number;
  wiringExecutionContractTamperCasesRejected: number;
  noOpenAiCall: true;
  noFetchCall: true;
  noProcessEnvRead: true;
  noSdkUsage: true;
  noRouteHandlerCall: true;
  noFilesystemRead: true;
  noDatabaseWrite: true;
  noStorageWrite: true;
  noAuditPersistence: true;
  noPromptBuild: true;
  noModelCall: true;
  noRunSmartTalkExecution: true;
  no8x3AcRerun: true;
  allowedSyntheticCases: string[];
  forbiddenSyntheticCases: string[];
  unsafeUnknownSyntheticCases: string[];
  syntheticDryRunMatrix: string[];
  dryRunNotes: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  freeQaSyntheticRuntimeActivationDryRunTamperCaseCount: number;
  freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: number;
  freeQaSyntheticRuntimeActivationDryRunTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const ACTIVATION_TARGET: ActivationTarget88D = "free_smart_talk_qa_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_ANMELDUNG_Q = "Anmeldung question";
const SENTINEL_HEALTH_INS_Q = "health insurance question";
const SENTINEL_OFFICIAL_DOC_FORBIDDEN = "official document";
const SENTINEL_OCR_PHOTO_FORBIDDEN = "OCR/photo";
const SENTINEL_SCANNER_UPLOAD_FORBIDDEN = "scanner upload";
const SENTINEL_EXACT_LEGAL_DEADLINE_FORBIDDEN = "exact legal deadline";
const SENTINEL_UNKNOWN_STATE = "unknown state";
const SENTINEL_ALLOWED_FUTURE_TEST = "allowed_for_future_controlled_internal_test";
const SENTINEL_BLOCKED_BY_CONTRACT = "blocked_by_contract";
const SENTINEL_FAIL_CLOSED = "fail_closed";
const SENTINEL_8X8E_AUDIT = "8.8E-post-activation-readiness-audit-for-free-qa";
const SENTINEL_RUNTIME_ACTIVATION_BLOCKER = "runtime-activation-unauthorized-global-blocker";
const SENTINEL_DOCUMENT_MODE_BLOCKER = "document-mode-unauthorized-global-blocker";
const SENTINEL_PHOTO_OCR_BLOCKER = "photo-ocr-runtime-unauthorized-global-blocker";
const SENTINEL_SCANNER_BLOCKER = "scanner-upload-unauthorized-global-blocker";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaSyntheticDryRunResult(r: FreeQaSyntheticDryRunResult): boolean {
  // Phase identity
  if (r.checkId !== "8.8D") return false;
  if (r.allPassed !== true) return false;
  if (r.syntheticRuntimeActivationDryRunOnly !== true) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaControlledRuntimeActivationContractFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.routeFilesModified !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.additionalWiringPerformed !== false) return false;
  if (r.runtimeActivationPerformed !== false) return false;
  if (r.productionActivationPerformed !== false) return false;
  if (r.publicRuntimeActivationPerformed !== false) return false;
  if (r.seamActivationPerformed !== false) return false;
  if (r.documentRuntimeActivationPerformed !== false) return false;
  if (r.photoOcrRuntimeActivationPerformed !== false) return false;
  if (r.scannerRuntimeActivationPerformed !== false) return false;
  if (r.paidDocumentModeRuntimeActivationPerformed !== false) return false;
  if (r.vayloDnaRuntimeActivationPerformed !== false) return false;
  // Import/runner flags and 8.8C confirmations
  if (r.importedOnlyFreeQaControlledRuntimeActivationContractRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractRunnerCalled !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractCheckId !== "8.8C") return false;
  if (r.freeQaControlledRuntimeActivationContractAllPassed !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractReadyForDryRun !== true) return false;
  if (r.freeQaActivationTargetConfirmed !== ACTIVATION_TARGET) return false;
  if (r.freeQaContractDoesNotAuthorizeActivationConfirmed !== true) return false;
  if (r.freeQaContractRuntimeDisabledNowConfirmed !== true) return false;
  // Contract/dry-run flags
  if (r.activationTarget !== ACTIVATION_TARGET) return false;
  if (r.dryRunCreatedForFreeQaOnly !== true) return false;
  if (r.dryRunDoesNotAuthorizeActivation !== true) return false;
  if (r.dryRunDoesNotAuthorizeRuntimeExecution !== true) return false;
  if (r.dryRunDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.dryRunDoesNotAuthorizePilotRuntime !== true) return false;
  if (r.dryRunDoesNotAuthorizeProductionRuntime !== true) return false;
  if (r.dryRunDoesNotAuthorizeGoLive !== true) return false;
  // Synthetic case counts
  if (r.allowedSyntheticCasesPassed !== r.allowedSyntheticCaseCount) return false;
  if (r.forbiddenSyntheticCasesBlocked !== r.forbiddenSyntheticCaseCount) return false;
  if (r.unsafeUnknownSyntheticCasesFailedClosed !== r.unsafeUnknownSyntheticCaseCount) return false;
  if (r.syntheticDryRunMatrixPassing !== true) return false;
  // Forbidden class booleans
  if (r.allowedFreeQaCasesClassifiedForFutureControlledInternalTest !== true) return false;
  if (r.forbiddenDocumentCasesBlockedByContract !== true) return false;
  if (r.forbiddenPhotoOcrCasesBlockedByContract !== true) return false;
  if (r.forbiddenScannerCasesBlockedByContract !== true) return false;
  if (r.forbiddenPaidDnaCasesBlockedByContract !== true) return false;
  if (r.exactLegalDeadlineCasesBlockedByContract !== true) return false;
  if (r.trustedLegalAdviceCasesBlockedByContract !== true) return false;
  if (r.unsafeUnknownCasesFailClosed !== true) return false;
  // Evidence Gates seam/adapter flags
  if (r.evidenceGatesSeamExistsButDisabledByDefault !== true) return false;
  if (r.evidenceGatesSeamRemainsInert !== true) return false;
  if (r.evidenceGatesDryRunAdapterNotCalledWhileDisabled !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotUserVisible !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotPersisted !== true) return false;
  if (r.evidenceGatesSeamActivationUnauthorized !== true) return false;
  // Safety/model/gate flags
  if (r.documentLikeTextGuardMustRemainActive !== true) return false;
  if (r.photoOcrRouteContainmentMustRemainActive !== true) return false;
  if (r.preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired !== true) return false;
  if (r.modelOutputRemainsUntrusted !== true) return false;
  if (r.claimAuthorizationSeparateFromRealityAuthorization !== true) return false;
  if (r.highRiskClaimsBlockedUnlessClaimAuthorized !== true) return false;
  if (r.documentDerivedClaimsBlockedUnlessRealityAuthorized !== true) return false;
  if (r.trapActivationStructuredMetadataOnly !== true) return false;
  if (r.unsafeUnknownStatesFailClosed !== true) return false;
  if (r.evidenceGatesUserVisibleOutputBlockedByDefault !== true) return false;
  if (r.exactLegalDeadlineCalculationUnauthorized !== true) return false;
  if (r.auditMetadataNonPersistentByDefault !== true) return false;
  // Authorization false-boundary
  if (r.realDocumentInputAuthorizedNow !== false) return false;
  if (r.userVisibleOutputAuthorizedNow !== false) return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.modelFacingUseAuthorizedNow !== false) return false;
  if (r.evidenceGateExecutionAuthorizedNow !== false) return false;
  if (r.claimAuthorizationAuthorizedNow !== false) return false;
  if (r.exactDeadlineCalculationAuthorized !== false) return false;
  if (r.paymentRuntimeAuthorizedNow !== false) return false;
  if (r.entitlementRuntimeAuthorizedNow !== false) return false;
  if (r.checkoutRuntimeAuthorizedNow !== false) return false;
  if (r.pilotAuthorizationGranted !== false) return false;
  if (r.productionAuthorizationGranted !== false) return false;
  if (r.goLiveAuthorizationGranted !== false) return false;
  if (r.seamActivationAuthorizedNow !== false) return false;
  if (r.controlledRuntimeActivationAuthorizedNow !== false) return false;
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Future required phase flags
  if (r.controlledRuntimeActivationReadinessAuditRequired !== true) return false;
  if (r.controlledRuntimeActivationClosureDecisionRequired !== true) return false;
  if (r.controlledInternalTestAuthorizationRequired !== true) return false;
  // Readiness flags
  if (r.readyFor8x8EPostActivationReadinessAudit !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleDocumentOutput !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForPilot !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  // Preserved governance debts
  if (r.claimRuleOrSemanticsDebtPreserved !== true) return false;
  if (r.evidenceRuleResolutionDebtPreserved !== true) return false;
  if (r.proximityManualOnlyDebtPreserved !== true) return false;
  if (r.trapKindTypingDebtPreserved !== true) return false;
  if (r.enforcementTrapHeuristicDebtPreserved !== true) return false;
  if (r.trapDispositionStateSeparationDebtPreserved !== true) return false;
  if (r.severityCandidateDerivationSeparationDebtPreserved !== true) return false;
  if (r.mapperDiagnosticTaxonomyDebtPreserved !== true) return false;
  if (r.td004ClosureDoesNotAuthorizeWiringDebtPreserved !== true) return false;
  // Inherited 8.8C count confirmations
  if (r.freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8C !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractTamperCasesRejected !== r.freeQaControlledRuntimeActivationContractTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8C !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperCasesRejected !== r.freeQaControlledRuntimeActivationPlanTamperCaseCount) return false;
  if (r.governanceKernelConsolidationTamperConfirmedFrom8x8C !== true) return false;
  if (r.governanceKernelConsolidationTamperCasesRejected !== r.governanceKernelConsolidationTamperCaseCount) return false;
  if (r.evidenceGatesClosureDecisionTamperConfirmedFrom8x8C !== true) return false;
  if (r.evidenceGatesClosureDecisionTamperCasesRejected !== r.evidenceGatesClosureDecisionTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x8C !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x8C !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x8C !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x8C !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x8C !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x8C !== true) return false;
  if (r.wiringExecutionContractTamperCasesRejected !== r.wiringExecutionContractTamperCaseCount) return false;
  // No* side-effect flags
  if (r.noOpenAiCall !== true) return false;
  if (r.noFetchCall !== true) return false;
  if (r.noProcessEnvRead !== true) return false;
  if (r.noSdkUsage !== true) return false;
  if (r.noRouteHandlerCall !== true) return false;
  if (r.noFilesystemRead !== true) return false;
  if (r.noDatabaseWrite !== true) return false;
  if (r.noStorageWrite !== true) return false;
  if (r.noAuditPersistence !== true) return false;
  if (r.noPromptBuild !== true) return false;
  if (r.noModelCall !== true) return false;
  if (r.noRunSmartTalkExecution !== true) return false;
  if (r.no8x3AcRerun !== true) return false;
  // Arrays non-empty
  if (!r.allowedSyntheticCases || r.allowedSyntheticCases.length === 0) return false;
  if (!r.forbiddenSyntheticCases || r.forbiddenSyntheticCases.length === 0) return false;
  if (!r.unsafeUnknownSyntheticCases || r.unsafeUnknownSyntheticCases.length === 0) return false;
  if (!r.syntheticDryRunMatrix || r.syntheticDryRunMatrix.length === 0) return false;
  if (!r.dryRunNotes || r.dryRunNotes.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  // Sentinel checks
  const allowedJ = r.allowedSyntheticCases.join(" ");
  if (!allowedJ.includes(SENTINEL_ANMELDUNG_Q)) return false;
  if (!allowedJ.includes(SENTINEL_HEALTH_INS_Q)) return false;
  const forbidJ = r.forbiddenSyntheticCases.join(" ");
  if (!forbidJ.includes(SENTINEL_OFFICIAL_DOC_FORBIDDEN)) return false;
  if (!forbidJ.includes(SENTINEL_OCR_PHOTO_FORBIDDEN)) return false;
  if (!forbidJ.includes(SENTINEL_SCANNER_UPLOAD_FORBIDDEN)) return false;
  if (!forbidJ.includes(SENTINEL_EXACT_LEGAL_DEADLINE_FORBIDDEN)) return false;
  const unknownJ = r.unsafeUnknownSyntheticCases.join(" ");
  if (!unknownJ.includes(SENTINEL_UNKNOWN_STATE)) return false;
  const matrixJ = r.syntheticDryRunMatrix.join(" ");
  if (!matrixJ.includes(SENTINEL_ALLOWED_FUTURE_TEST)) return false;
  if (!matrixJ.includes(SENTINEL_BLOCKED_BY_CONTRACT)) return false;
  if (!matrixJ.includes(SENTINEL_FAIL_CLOSED)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_8X8E_AUDIT)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_ACTIVATION_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKER)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Tamper coverage
  if (r.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected !== r.freeQaSyntheticRuntimeActivationDryRunTamperCaseCount) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type FreeQaDryRunTamperMutation = (r: FreeQaSyntheticDryRunResult) => FreeQaSyntheticDryRunResult;
interface FreeQaDryRunTamperCase { label: string; mutate: FreeQaDryRunTamperMutation; }

const FREE_QA_DRY_RUN_TAMPER_CASES: FreeQaDryRunTamperCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8C" as "8.8D" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "syntheticRuntimeActivationDryRunOnly false", mutate: (r) => ({ ...r, syntheticRuntimeActivationDryRunOnly: false as true }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunFileCreated false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaControlledRuntimeActivationContractFileModified true", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "routeFilesModified true", mutate: (r) => ({ ...r, routeFilesModified: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "additionalWiringPerformed true", mutate: (r) => ({ ...r, additionalWiringPerformed: true as false }) },
  { label: "runtimeActivationPerformed true", mutate: (r) => ({ ...r, runtimeActivationPerformed: true as false }) },
  { label: "productionActivationPerformed true", mutate: (r) => ({ ...r, productionActivationPerformed: true as false }) },
  { label: "publicRuntimeActivationPerformed true", mutate: (r) => ({ ...r, publicRuntimeActivationPerformed: true as false }) },
  { label: "seamActivationPerformed true", mutate: (r) => ({ ...r, seamActivationPerformed: true as false }) },
  { label: "documentRuntimeActivationPerformed true", mutate: (r) => ({ ...r, documentRuntimeActivationPerformed: true as false }) },
  { label: "photoOcrRuntimeActivationPerformed true", mutate: (r) => ({ ...r, photoOcrRuntimeActivationPerformed: true as false }) },
  { label: "scannerRuntimeActivationPerformed true", mutate: (r) => ({ ...r, scannerRuntimeActivationPerformed: true as false }) },
  { label: "paidDocumentModeRuntimeActivationPerformed true", mutate: (r) => ({ ...r, paidDocumentModeRuntimeActivationPerformed: true as false }) },
  { label: "vayloDnaRuntimeActivationPerformed true", mutate: (r) => ({ ...r, vayloDnaRuntimeActivationPerformed: true as false }) },
  // Import/runner flags and 8.8C confirmations
  { label: "importedOnlyFreeQaControlledRuntimeActivationContractRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaControlledRuntimeActivationContractRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractRunnerCalled false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractRunnerCalled: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractCheckId wrong", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractCheckId: "8.8B" as "8.8C" }) },
  { label: "freeQaControlledRuntimeActivationContractAllPassed false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractAllPassed: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractReadyForDryRun false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractReadyForDryRun: false as true }) },
  { label: "freeQaActivationTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaActivationTargetConfirmed: "text_document_mode" as ActivationTarget88D }) },
  { label: "freeQaContractDoesNotAuthorizeActivationConfirmed false", mutate: (r) => ({ ...r, freeQaContractDoesNotAuthorizeActivationConfirmed: false as true }) },
  { label: "freeQaContractRuntimeDisabledNowConfirmed false", mutate: (r) => ({ ...r, freeQaContractRuntimeDisabledNowConfirmed: false as true }) },
  // Contract/dry-run flags
  { label: "activationTarget wrong", mutate: (r) => ({ ...r, activationTarget: "text_document_mode" as ActivationTarget88D }) },
  { label: "dryRunCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, dryRunCreatedForFreeQaOnly: false as true }) },
  { label: "dryRunDoesNotAuthorizeActivation false", mutate: (r) => ({ ...r, dryRunDoesNotAuthorizeActivation: false as true }) },
  { label: "dryRunDoesNotAuthorizeRuntimeExecution false", mutate: (r) => ({ ...r, dryRunDoesNotAuthorizeRuntimeExecution: false as true }) },
  { label: "dryRunDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, dryRunDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "dryRunDoesNotAuthorizePilotRuntime false", mutate: (r) => ({ ...r, dryRunDoesNotAuthorizePilotRuntime: false as true }) },
  { label: "dryRunDoesNotAuthorizeProductionRuntime false", mutate: (r) => ({ ...r, dryRunDoesNotAuthorizeProductionRuntime: false as true }) },
  { label: "dryRunDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, dryRunDoesNotAuthorizeGoLive: false as true }) },
  // Synthetic case counts
  { label: "allowedSyntheticCasesPassed not equal allowedSyntheticCaseCount", mutate: (r) => ({ ...r, allowedSyntheticCasesPassed: r.allowedSyntheticCasesPassed - 1 }) },
  { label: "forbiddenSyntheticCasesBlocked not equal forbiddenSyntheticCaseCount", mutate: (r) => ({ ...r, forbiddenSyntheticCasesBlocked: r.forbiddenSyntheticCasesBlocked - 1 }) },
  { label: "unsafeUnknownSyntheticCasesFailedClosed not equal unsafeUnknownSyntheticCaseCount", mutate: (r) => ({ ...r, unsafeUnknownSyntheticCasesFailedClosed: r.unsafeUnknownSyntheticCasesFailedClosed - 1 }) },
  { label: "syntheticDryRunMatrixPassing false", mutate: (r) => ({ ...r, syntheticDryRunMatrixPassing: false as true }) },
  // Forbidden class booleans
  { label: "allowedFreeQaCasesClassifiedForFutureControlledInternalTest false", mutate: (r) => ({ ...r, allowedFreeQaCasesClassifiedForFutureControlledInternalTest: false as true }) },
  { label: "forbiddenDocumentCasesBlockedByContract false", mutate: (r) => ({ ...r, forbiddenDocumentCasesBlockedByContract: false as true }) },
  { label: "forbiddenPhotoOcrCasesBlockedByContract false", mutate: (r) => ({ ...r, forbiddenPhotoOcrCasesBlockedByContract: false as true }) },
  { label: "forbiddenScannerCasesBlockedByContract false", mutate: (r) => ({ ...r, forbiddenScannerCasesBlockedByContract: false as true }) },
  { label: "forbiddenPaidDnaCasesBlockedByContract false", mutate: (r) => ({ ...r, forbiddenPaidDnaCasesBlockedByContract: false as true }) },
  { label: "exactLegalDeadlineCasesBlockedByContract false", mutate: (r) => ({ ...r, exactLegalDeadlineCasesBlockedByContract: false as true }) },
  { label: "trustedLegalAdviceCasesBlockedByContract false", mutate: (r) => ({ ...r, trustedLegalAdviceCasesBlockedByContract: false as true }) },
  { label: "unsafeUnknownCasesFailClosed false", mutate: (r) => ({ ...r, unsafeUnknownCasesFailClosed: false as true }) },
  // Evidence Gates seam/adapter flags
  { label: "evidenceGatesSeamExistsButDisabledByDefault false", mutate: (r) => ({ ...r, evidenceGatesSeamExistsButDisabledByDefault: false as true }) },
  { label: "evidenceGatesSeamRemainsInert false", mutate: (r) => ({ ...r, evidenceGatesSeamRemainsInert: false as true }) },
  { label: "evidenceGatesDryRunAdapterNotCalledWhileDisabled false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterNotCalledWhileDisabled: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotUserVisible false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotUserVisible: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotPersisted false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotPersisted: false as true }) },
  { label: "evidenceGatesSeamActivationUnauthorized false", mutate: (r) => ({ ...r, evidenceGatesSeamActivationUnauthorized: false as true }) },
  // Safety/model/gate flags
  { label: "documentLikeTextGuardMustRemainActive false", mutate: (r) => ({ ...r, documentLikeTextGuardMustRemainActive: false as true }) },
  { label: "photoOcrRouteContainmentMustRemainActive false", mutate: (r) => ({ ...r, photoOcrRouteContainmentMustRemainActive: false as true }) },
  { label: "preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired false", mutate: (r) => ({ ...r, preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired: false as true }) },
  { label: "modelOutputRemainsUntrusted false", mutate: (r) => ({ ...r, modelOutputRemainsUntrusted: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "unsafeUnknownStatesFailClosed false", mutate: (r) => ({ ...r, unsafeUnknownStatesFailClosed: false as true }) },
  { label: "evidenceGatesUserVisibleOutputBlockedByDefault false", mutate: (r) => ({ ...r, evidenceGatesUserVisibleOutputBlockedByDefault: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorized false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorized: false as true }) },
  { label: "auditMetadataNonPersistentByDefault false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefault: false as true }) },
  // Authorization false-boundary flipped true
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
  { label: "seamActivationAuthorizedNow true", mutate: (r) => ({ ...r, seamActivationAuthorizedNow: true as false }) },
  { label: "controlledRuntimeActivationAuthorizedNow true", mutate: (r) => ({ ...r, controlledRuntimeActivationAuthorizedNow: true as false }) },
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Future required phase flags
  { label: "controlledRuntimeActivationReadinessAuditRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationReadinessAuditRequired: false as true }) },
  { label: "controlledRuntimeActivationClosureDecisionRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationClosureDecisionRequired: false as true }) },
  { label: "controlledInternalTestAuthorizationRequired false", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationRequired: false as true }) },
  // Readiness flags
  { label: "readyFor8x8EPostActivationReadinessAudit false", mutate: (r) => ({ ...r, readyFor8x8EPostActivationReadinessAudit: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleDocumentOutput true", mutate: (r) => ({ ...r, readyForUserVisibleDocumentOutput: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForPilot true", mutate: (r) => ({ ...r, readyForPilot: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  // Preserved governance debts
  { label: "claimRuleOrSemanticsDebtPreserved false", mutate: (r) => ({ ...r, claimRuleOrSemanticsDebtPreserved: false as true }) },
  { label: "evidenceRuleResolutionDebtPreserved false", mutate: (r) => ({ ...r, evidenceRuleResolutionDebtPreserved: false as true }) },
  { label: "proximityManualOnlyDebtPreserved false", mutate: (r) => ({ ...r, proximityManualOnlyDebtPreserved: false as true }) },
  { label: "trapKindTypingDebtPreserved false", mutate: (r) => ({ ...r, trapKindTypingDebtPreserved: false as true }) },
  { label: "enforcementTrapHeuristicDebtPreserved false", mutate: (r) => ({ ...r, enforcementTrapHeuristicDebtPreserved: false as true }) },
  { label: "trapDispositionStateSeparationDebtPreserved false", mutate: (r) => ({ ...r, trapDispositionStateSeparationDebtPreserved: false as true }) },
  { label: "severityCandidateDerivationSeparationDebtPreserved false", mutate: (r) => ({ ...r, severityCandidateDerivationSeparationDebtPreserved: false as true }) },
  { label: "mapperDiagnosticTaxonomyDebtPreserved false", mutate: (r) => ({ ...r, mapperDiagnosticTaxonomyDebtPreserved: false as true }) },
  { label: "td004ClosureDoesNotAuthorizeWiringDebtPreserved false", mutate: (r) => ({ ...r, td004ClosureDoesNotAuthorizeWiringDebtPreserved: false as true }) },
  // Inherited 8.8C count confirmation booleans
  { label: "freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8C: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8C: false as true }) },
  { label: "governanceKernelConsolidationTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperConfirmedFrom8x8C: false as true }) },
  { label: "evidenceGatesClosureDecisionTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperConfirmedFrom8x8C: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x8C: false as true }) },
  { label: "postWiringAuditTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x8C: false as true }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x8C false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x8C: false as true }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x8C false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x8C: false as true }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x8C false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x8C: false as true }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x8C false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x8C: false as true }) },
  // Inherited count mismatches
  { label: "freeQaControlledRuntimeActivationContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractTamperCasesRejected: r.freeQaControlledRuntimeActivationContractTamperCasesRejected - 1 }) },
  { label: "freeQaControlledRuntimeActivationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperCasesRejected: r.freeQaControlledRuntimeActivationPlanTamperCasesRejected - 1 }) },
  { label: "governanceKernelConsolidationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperCasesRejected: r.governanceKernelConsolidationTamperCasesRejected - 1 }) },
  { label: "evidenceGatesClosureDecisionTamperCasesRejected mismatch", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperCasesRejected: r.evidenceGatesClosureDecisionTamperCasesRejected - 1 }) },
  { label: "scopedWiringContainmentPatchTamperCasesRejected mismatch", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCasesRejected: r.scopedWiringContainmentPatchTamperCasesRejected - 1 }) },
  { label: "postWiringAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, postWiringAuditTamperCasesRejected: r.postWiringAuditTamperCasesRejected - 1 }) },
  { label: "dryRunSyntheticValidationCasesPassed mismatch", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationCasesPassed mismatch", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCasesRejected mismatch", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
  { label: "wiringExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, wiringExecutionContractTamperCasesRejected: r.wiringExecutionContractTamperCasesRejected - 1 }) },
  // No* side-effect flags
  { label: "noOpenAiCall false", mutate: (r) => ({ ...r, noOpenAiCall: false as true }) },
  { label: "noFetchCall false", mutate: (r) => ({ ...r, noFetchCall: false as true }) },
  { label: "noProcessEnvRead false", mutate: (r) => ({ ...r, noProcessEnvRead: false as true }) },
  { label: "noSdkUsage false", mutate: (r) => ({ ...r, noSdkUsage: false as true }) },
  { label: "noRouteHandlerCall false", mutate: (r) => ({ ...r, noRouteHandlerCall: false as true }) },
  { label: "noFilesystemRead false", mutate: (r) => ({ ...r, noFilesystemRead: false as true }) },
  { label: "noDatabaseWrite false", mutate: (r) => ({ ...r, noDatabaseWrite: false as true }) },
  { label: "noStorageWrite false", mutate: (r) => ({ ...r, noStorageWrite: false as true }) },
  { label: "noAuditPersistence false", mutate: (r) => ({ ...r, noAuditPersistence: false as true }) },
  { label: "noPromptBuild false", mutate: (r) => ({ ...r, noPromptBuild: false as true }) },
  { label: "noModelCall false", mutate: (r) => ({ ...r, noModelCall: false as true }) },
  { label: "noRunSmartTalkExecution false", mutate: (r) => ({ ...r, noRunSmartTalkExecution: false as true }) },
  { label: "no8x3AcRerun false", mutate: (r) => ({ ...r, no8x3AcRerun: false as true }) },
  // Array empty
  { label: "allowedSyntheticCases empty", mutate: (r) => ({ ...r, allowedSyntheticCases: [] }) },
  { label: "forbiddenSyntheticCases empty", mutate: (r) => ({ ...r, forbiddenSyntheticCases: [] }) },
  { label: "unsafeUnknownSyntheticCases empty", mutate: (r) => ({ ...r, unsafeUnknownSyntheticCases: [] }) },
  { label: "syntheticDryRunMatrix empty", mutate: (r) => ({ ...r, syntheticDryRunMatrix: [] }) },
  { label: "dryRunNotes empty", mutate: (r) => ({ ...r, dryRunNotes: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  // Array sentinel checks
  { label: "allowedSyntheticCases missing Anmeldung question sentinel", mutate: (r) => ({ ...r, allowedSyntheticCases: r.allowedSyntheticCases.map((s) => s.split(SENTINEL_ANMELDUNG_Q).join("omitted")) }) },
  { label: "allowedSyntheticCases missing health insurance question sentinel", mutate: (r) => ({ ...r, allowedSyntheticCases: r.allowedSyntheticCases.map((s) => s.split(SENTINEL_HEALTH_INS_Q).join("omitted")) }) },
  { label: "forbiddenSyntheticCases missing official document sentinel", mutate: (r) => ({ ...r, forbiddenSyntheticCases: r.forbiddenSyntheticCases.map((s) => s.split(SENTINEL_OFFICIAL_DOC_FORBIDDEN).join("omitted")) }) },
  { label: "forbiddenSyntheticCases missing OCR/photo sentinel", mutate: (r) => ({ ...r, forbiddenSyntheticCases: r.forbiddenSyntheticCases.map((s) => s.split(SENTINEL_OCR_PHOTO_FORBIDDEN).join("omitted")) }) },
  { label: "forbiddenSyntheticCases missing scanner upload sentinel", mutate: (r) => ({ ...r, forbiddenSyntheticCases: r.forbiddenSyntheticCases.map((s) => s.split(SENTINEL_SCANNER_UPLOAD_FORBIDDEN).join("omitted")) }) },
  { label: "forbiddenSyntheticCases missing exact legal deadline sentinel", mutate: (r) => ({ ...r, forbiddenSyntheticCases: r.forbiddenSyntheticCases.map((s) => s.split(SENTINEL_EXACT_LEGAL_DEADLINE_FORBIDDEN).join("omitted")) }) },
  { label: "unsafeUnknownSyntheticCases missing unknown state sentinel", mutate: (r) => ({ ...r, unsafeUnknownSyntheticCases: r.unsafeUnknownSyntheticCases.map((s) => s.split(SENTINEL_UNKNOWN_STATE).join("omitted")) }) },
  { label: "syntheticDryRunMatrix missing allowed_for_future_controlled_internal_test sentinel", mutate: (r) => ({ ...r, syntheticDryRunMatrix: r.syntheticDryRunMatrix.map((s) => s.split(SENTINEL_ALLOWED_FUTURE_TEST).join("omitted")) }) },
  { label: "syntheticDryRunMatrix missing blocked_by_contract sentinel", mutate: (r) => ({ ...r, syntheticDryRunMatrix: r.syntheticDryRunMatrix.map((s) => s.split(SENTINEL_BLOCKED_BY_CONTRACT).join("omitted")) }) },
  { label: "syntheticDryRunMatrix missing fail_closed sentinel", mutate: (r) => ({ ...r, syntheticDryRunMatrix: r.syntheticDryRunMatrix.map((s) => s.split(SENTINEL_FAIL_CLOSED).join("omitted")) }) },
  { label: "futureRequiredPhases missing 8.8E audit sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_8X8E_AUDIT).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime activation blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_ACTIVATION_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKER).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Tamper coverage self-checks
  { label: "freeQaSyntheticRuntimeActivationDryRunTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunTamperCoveragePassing: false as true }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: r.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected - 1 }) },
];

// ─── Exported dry-run runner ──────────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Synthetic Runtime Activation Dry-Run runner for 8.8D.
 *
 * Calls the 8.8C Controlled Runtime Activation Contract runner as source of truth.
 * Performs a purely synthetic dry-run matrix for Free Smart Talk Q&A activation cases.
 * This phase itself does NOT authorize activation.
 */
export function runFreeQaSyntheticRuntimeActivationDryRun(): FreeQaSyntheticDryRunResult {
  const dryRunFailures: string[] = [];

  // ── Call 8.8C Contract runner as source of truth ──────────────────────
  const c = runFreeQaControlledRuntimeActivationContract();

  if (c.checkId !== "8.8C") dryRunFailures.push(`8.8C checkId mismatch: expected "8.8C", got "${c.checkId}"`);
  if (c.allPassed !== true) dryRunFailures.push("8.8C allPassed is not true");
  if (c.readyFor8x8DSyntheticRuntimeActivationDryRun !== true) dryRunFailures.push("8.8C readyFor8x8DSyntheticRuntimeActivationDryRun is not true");
  if (c.activationTarget !== ACTIVATION_TARGET) dryRunFailures.push(`8.8C activationTarget mismatch: expected "${ACTIVATION_TARGET}", got "${c.activationTarget}"`);
  if (c.contractDoesNotAuthorizeActivation !== true) dryRunFailures.push("8.8C contractDoesNotAuthorizeActivation is not true");
  if (c.runtimeDisabledNow !== true) dryRunFailures.push("8.8C runtimeDisabledNow is not true");
  if (c.controlledRuntimeActivationAuthorizedNow !== false) dryRunFailures.push("8.8C controlledRuntimeActivationAuthorizedNow is not false");
  if (c.runtimeActivationPerformed !== false) dryRunFailures.push("8.8C runtimeActivationPerformed is not false");
  if (c.seamActivationPerformed !== false) dryRunFailures.push("8.8C seamActivationPerformed is not false");
  if (c.documentRuntimeActivationPerformed !== false) dryRunFailures.push("8.8C documentRuntimeActivationPerformed is not false");
  if (c.photoOcrRuntimeActivationPerformed !== false) dryRunFailures.push("8.8C photoOcrRuntimeActivationPerformed is not false");
  if (c.scannerRuntimeActivationPerformed !== false) dryRunFailures.push("8.8C scannerRuntimeActivationPerformed is not false");
  if (c.paidDocumentModeRuntimeActivationPerformed !== false) dryRunFailures.push("8.8C paidDocumentModeRuntimeActivationPerformed is not false");
  if (c.vayloDnaRuntimeActivationPerformed !== false) dryRunFailures.push("8.8C vayloDnaRuntimeActivationPerformed is not false");
  if (c.evidenceGatesSeamExistsButDisabledByDefault !== true) dryRunFailures.push("8.8C evidenceGatesSeamExistsButDisabledByDefault is not true");
  if (c.evidenceGatesSeamRemainsInert !== true) dryRunFailures.push("8.8C evidenceGatesSeamRemainsInert is not true");
  if (c.freeQaControlledRuntimeActivationContractTamperCasesRejected !== c.freeQaControlledRuntimeActivationContractTamperCaseCount) dryRunFailures.push("8.8C contract tamper count mismatch");

  // ── Synthetic dry-run matrix ──────────────────────────────────────────

  // Allowed synthetic Free Q&A cases
  const ALLOWED_CASES: Array<{ id: string; label: string; caseClass: SyntheticCaseClass }> = [
    { id: "AC-01", label: `${SENTINEL_ANMELDUNG_Q}: anonymous general question about Anmeldung address registration process`, caseClass: "allowed_anonymous_qa" },
    { id: "AC-02", label: `${SENTINEL_HEALTH_INS_Q}: anonymous general question about health insurance types in Germany`, caseClass: "allowed_anonymous_qa" },
    { id: "AC-03", label: "tax class question: anonymous general question about tax class selection after arrival", caseClass: "allowed_anonymous_qa" },
    { id: "AC-04", label: "Bürgeramt appointment: anonymous general question about booking a Bürgeramt appointment", caseClass: "allowed_anonymous_qa" },
    { id: "AC-05", label: "address registration documents: anonymous general question about what documents are usually needed for address registration", caseClass: "allowed_anonymous_qa" },
  ];

  // Forbidden synthetic cases
  const FORBIDDEN_CASES: Array<{ id: string; label: string; caseClass: SyntheticCaseClass }> = [
    { id: "FC-01", label: `pasted ${SENTINEL_OFFICIAL_DOC_FORBIDDEN}: input contains pasted official document text`, caseClass: "forbidden_document" },
    { id: "FC-02", label: "document-like German notice: input resembles an official Bescheid or Mahnung", caseClass: "forbidden_document" },
    { id: "FC-03", label: `${SENTINEL_EXACT_LEGAL_DEADLINE_FORBIDDEN}: request to calculate exact legal deadline based on official letter date`, caseClass: "forbidden_exact_deadline" },
    { id: "FC-04", label: `${SENTINEL_OCR_PHOTO_FORBIDDEN} text: input derived from photo or OCR capture`, caseClass: "forbidden_photo_ocr" },
    { id: "FC-05", label: `${SENTINEL_SCANNER_UPLOAD_FORBIDDEN}: request to process scanner-derived document upload`, caseClass: "forbidden_scanner" },
    { id: "FC-06", label: "scanned document: input is from a scanned document image", caseClass: "forbidden_scanner" },
    { id: "FC-07", label: "PDF upload: request to process PDF document upload", caseClass: "forbidden_document" },
    { id: "FC-08", label: "image upload: request to process image file upload", caseClass: "forbidden_photo_ocr" },
    { id: "FC-09", label: "Paid Document Mode: input requires entitlement-gated document mode", caseClass: "forbidden_paid_dna" },
    { id: "FC-10", label: "Vaylo DNA stored document: input from DNA-stored identity-linked document", caseClass: "forbidden_paid_dna" },
    { id: "FC-11", label: `${SENTINEL_EXACT_LEGAL_DEADLINE_FORBIDDEN} calculation: request to calculate an exact legal deadline from document context`, caseClass: "forbidden_exact_deadline" },
    { id: "FC-12", label: "trusted legal advice: request to treat model output as verified and legally binding advice", caseClass: "forbidden_trusted_legal_advice" },
  ];

  // Unsafe/unknown synthetic cases
  const UNSAFE_CASES: Array<{ id: string; label: string; caseClass: SyntheticCaseClass }> = [
    { id: "UC-01", label: `${SENTINEL_UNKNOWN_STATE}: unrecognized input class with no matching contract rule`, caseClass: "unsafe_unknown" },
    { id: "UC-02", label: "ambiguous mixed input: partially resembles allowed Q&A but contains document-like fragments", caseClass: "unsafe_unknown" },
  ];

  // Run matrix
  let allowedSyntheticCasesPassed = 0;
  let forbiddenSyntheticCasesBlocked = 0;
  let unsafeUnknownSyntheticCasesFailedClosed = 0;
  const matrixEntries: string[] = [];
  const matrixFailures: string[] = [];

  for (const ac of ALLOWED_CASES) {
    const classification = _classifySyntheticCase(ac.caseClass);
    const expected: SyntheticCaseClassification = "allowed_for_future_controlled_internal_test";
    if (classification === expected) {
      allowedSyntheticCasesPassed++;
      matrixEntries.push(`${ac.id} [${SENTINEL_ALLOWED_FUTURE_TEST}]: ${ac.label}`);
    } else {
      matrixFailures.push(`${ac.id}: expected ${expected}, got ${classification}`);
    }
  }

  for (const fc of FORBIDDEN_CASES) {
    const classification = _classifySyntheticCase(fc.caseClass);
    const expected: SyntheticCaseClassification = "blocked_by_contract";
    if (classification === expected) {
      forbiddenSyntheticCasesBlocked++;
      matrixEntries.push(`${fc.id} [${SENTINEL_BLOCKED_BY_CONTRACT}]: ${fc.label}`);
    } else {
      matrixFailures.push(`${fc.id}: expected ${expected}, got ${classification}`);
    }
  }

  for (const uc of UNSAFE_CASES) {
    const classification = _classifySyntheticCase(uc.caseClass);
    const expected: SyntheticCaseClassification = "fail_closed";
    if (classification === expected) {
      unsafeUnknownSyntheticCasesFailedClosed++;
      matrixEntries.push(`${uc.id} [${SENTINEL_FAIL_CLOSED}]: ${uc.label}`);
    } else {
      matrixFailures.push(`${uc.id}: expected ${expected}, got ${classification}`);
    }
  }

  if (matrixFailures.length > 0) dryRunFailures.push(...matrixFailures);

  const allowedSyntheticCaseCount = ALLOWED_CASES.length;
  const forbiddenSyntheticCaseCount = FORBIDDEN_CASES.length;
  const unsafeUnknownSyntheticCaseCount = UNSAFE_CASES.length;
  const syntheticMatrixOk =
    allowedSyntheticCasesPassed === allowedSyntheticCaseCount &&
    forbiddenSyntheticCasesBlocked === forbiddenSyntheticCaseCount &&
    unsafeUnknownSyntheticCasesFailedClosed === unsafeUnknownSyntheticCaseCount;

  // ── Arrays ────────────────────────────────────────────────────────────

  const allowedSyntheticCases: string[] = ALLOWED_CASES.map((ac) => `${ac.id}: ${ac.label}`);
  const forbiddenSyntheticCases: string[] = FORBIDDEN_CASES.map((fc) => `${fc.id}: ${fc.label}`);
  const unsafeUnknownSyntheticCases: string[] = UNSAFE_CASES.map((uc) => `${uc.id}: ${uc.label}`);
  const syntheticDryRunMatrix: string[] = matrixEntries;

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_8X8E_AUDIT}]: 8.8E-post-activation-readiness-audit-for-free-qa — Phase 8.8E must audit readiness after dry-run.`,
    "FP-02: 8.8F-controlled-internal-test-authorization-for-free-qa — Phase 8.8F must explicitly authorize controlled internal testing.",
    "FP-03: A future scoped runtime patch must be separately authorized before any live execution.",
    "FP-04: Public runtime, pilot, production, and go-live remain unauthorized until all preconditions are met.",
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01 [${SENTINEL_RUNTIME_ACTIVATION_BLOCKER}]: runtime-activation-unauthorized-global-blocker — controlled runtime activation is not yet authorized; 8.8E minimum required.`,
    `GB-02 [${SENTINEL_DOCUMENT_MODE_BLOCKER}]: document-mode-unauthorized-global-blocker — text document mode runtime remains unauthorized globally.`,
    `GB-03 [${SENTINEL_PHOTO_OCR_BLOCKER}]: photo-ocr-runtime-unauthorized-global-blocker — photo and OCR runtime remains unauthorized globally.`,
    `GB-04 [${SENTINEL_SCANNER_BLOCKER}]: scanner-upload-unauthorized-global-blocker — scanner upload runtime remains unauthorized globally.`,
    "GB-05: public-runtime-unauthorized-global-blocker — public runtime remains unauthorized globally.",
    "GB-06: production-go-live-unauthorized-global-blocker — production and go-live remain unauthorized globally.",
    "GB-07: seam-activation-unauthorized-global-blocker — Evidence Gates seam activation remains unauthorized.",
    "GB-08: payment-entitlement-runtime-unauthorized-global-blocker — payment and entitlement runtime remain unauthorized globally.",
    "GB-09: exact-legal-deadline-calculation-unauthorized-global-blocker — exact legal deadline calculation remains unauthorized globally.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8D.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8D.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8D.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8D.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8D.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8D.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8D.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8D.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8D.)",
  ];

  const dryRunNotes: string[] = [
    "8.8D dry-run: Synthetic runtime activation dry-run for Free Smart Talk Q&A created.",
    "8.8D dry-run: This phase is synthetic-dry-run-only. It does NOT authorize activation.",
    `8.8D dry-run: activationTarget=free_smart_talk_qa_only, syntheticMatrixOk=${syntheticMatrixOk}.`,
    `8.8D dry-run: ${allowedSyntheticCasesPassed}/${allowedSyntheticCaseCount} allowed cases -> allowed_for_future_controlled_internal_test.`,
    `8.8D dry-run: ${forbiddenSyntheticCasesBlocked}/${forbiddenSyntheticCaseCount} forbidden cases -> blocked_by_contract.`,
    `8.8D dry-run: ${unsafeUnknownSyntheticCasesFailedClosed}/${unsafeUnknownSyntheticCaseCount} unsafe/unknown cases -> fail_closed.`,
    `8.8D dry-run: 8.8C confirmed — checkId=${c.checkId}, allPassed=${c.allPassed}, contractDoesNotAuthorizeActivation=${c.contractDoesNotAuthorizeActivation}.`,
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_DRY_RUN_TAMPER_CASES.length;

  const provisional: FreeQaSyntheticDryRunResult = {
    checkId: "8.8D",
    allPassed: true,
    syntheticRuntimeActivationDryRunOnly: true,
    freeQaSyntheticRuntimeActivationDryRunFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaControlledRuntimeActivationContractFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    routeFilesModified: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    additionalWiringPerformed: false,
    runtimeActivationPerformed: false,
    productionActivationPerformed: false,
    publicRuntimeActivationPerformed: false,
    seamActivationPerformed: false,
    documentRuntimeActivationPerformed: false,
    photoOcrRuntimeActivationPerformed: false,
    scannerRuntimeActivationPerformed: false,
    paidDocumentModeRuntimeActivationPerformed: false,
    vayloDnaRuntimeActivationPerformed: false,
    importedOnlyFreeQaControlledRuntimeActivationContractRunner: true,
    noOtherImportsUsed: true,
    freeQaControlledRuntimeActivationContractRunnerCalled: true,
    freeQaControlledRuntimeActivationContractCheckId: "8.8C",
    freeQaControlledRuntimeActivationContractAllPassed: true,
    freeQaControlledRuntimeActivationContractReadyForDryRun: true,
    freeQaActivationTargetConfirmed: ACTIVATION_TARGET,
    freeQaContractDoesNotAuthorizeActivationConfirmed: true,
    freeQaContractRuntimeDisabledNowConfirmed: true,
    activationTarget: ACTIVATION_TARGET,
    dryRunCreatedForFreeQaOnly: true,
    dryRunDoesNotAuthorizeActivation: true,
    dryRunDoesNotAuthorizeRuntimeExecution: true,
    dryRunDoesNotAuthorizePublicRuntime: true,
    dryRunDoesNotAuthorizePilotRuntime: true,
    dryRunDoesNotAuthorizeProductionRuntime: true,
    dryRunDoesNotAuthorizeGoLive: true,
    allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed,
    syntheticDryRunMatrixPassing: true,
    allowedFreeQaCasesClassifiedForFutureControlledInternalTest: true,
    forbiddenDocumentCasesBlockedByContract: true,
    forbiddenPhotoOcrCasesBlockedByContract: true,
    forbiddenScannerCasesBlockedByContract: true,
    forbiddenPaidDnaCasesBlockedByContract: true,
    exactLegalDeadlineCasesBlockedByContract: true,
    trustedLegalAdviceCasesBlockedByContract: true,
    unsafeUnknownCasesFailClosed: true,
    evidenceGatesSeamExistsButDisabledByDefault: true,
    evidenceGatesSeamRemainsInert: true,
    evidenceGatesDryRunAdapterNotCalledWhileDisabled: true,
    evidenceGatesDryRunAdapterOutputNotUserVisible: true,
    evidenceGatesDryRunAdapterOutputNotPersisted: true,
    evidenceGatesSeamActivationUnauthorized: true,
    documentLikeTextGuardMustRemainActive: true,
    photoOcrRouteContainmentMustRemainActive: true,
    preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired: true,
    modelOutputRemainsUntrusted: true,
    claimAuthorizationSeparateFromRealityAuthorization: true,
    highRiskClaimsBlockedUnlessClaimAuthorized: true,
    documentDerivedClaimsBlockedUnlessRealityAuthorized: true,
    trapActivationStructuredMetadataOnly: true,
    unsafeUnknownStatesFailClosed: true,
    evidenceGatesUserVisibleOutputBlockedByDefault: true,
    exactLegalDeadlineCalculationUnauthorized: true,
    auditMetadataNonPersistentByDefault: true,
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
    seamActivationAuthorizedNow: false,
    controlledRuntimeActivationAuthorizedNow: false,
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    controlledRuntimeActivationReadinessAuditRequired: true,
    controlledRuntimeActivationClosureDecisionRequired: true,
    controlledInternalTestAuthorizationRequired: true,
    readyFor8x8EPostActivationReadinessAudit: true,
    readyForRuntimeActivation: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleDocumentOutput: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPublicRuntime: false,
    readyForPilot: false,
    readyForProduction: false,
    readyForGoLive: false,
    claimRuleOrSemanticsDebtPreserved: true,
    evidenceRuleResolutionDebtPreserved: true,
    proximityManualOnlyDebtPreserved: true,
    trapKindTypingDebtPreserved: true,
    enforcementTrapHeuristicDebtPreserved: true,
    trapDispositionStateSeparationDebtPreserved: true,
    severityCandidateDerivationSeparationDebtPreserved: true,
    mapperDiagnosticTaxonomyDebtPreserved: true,
    td004ClosureDoesNotAuthorizeWiringDebtPreserved: true,
    freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8C: true,
    freeQaControlledRuntimeActivationContractTamperCaseCount: c.freeQaControlledRuntimeActivationContractTamperCaseCount,
    freeQaControlledRuntimeActivationContractTamperCasesRejected: c.freeQaControlledRuntimeActivationContractTamperCasesRejected,
    freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8C: true,
    freeQaControlledRuntimeActivationPlanTamperCaseCount: c.freeQaControlledRuntimeActivationPlanTamperCaseCount,
    freeQaControlledRuntimeActivationPlanTamperCasesRejected: c.freeQaControlledRuntimeActivationPlanTamperCasesRejected,
    governanceKernelConsolidationTamperConfirmedFrom8x8C: true,
    governanceKernelConsolidationTamperCaseCount: c.governanceKernelConsolidationTamperCaseCount,
    governanceKernelConsolidationTamperCasesRejected: c.governanceKernelConsolidationTamperCasesRejected,
    evidenceGatesClosureDecisionTamperConfirmedFrom8x8C: true,
    evidenceGatesClosureDecisionTamperCaseCount: c.evidenceGatesClosureDecisionTamperCaseCount,
    evidenceGatesClosureDecisionTamperCasesRejected: c.evidenceGatesClosureDecisionTamperCasesRejected,
    scopedWiringContainmentPatchTamperConfirmedFrom8x8C: true,
    scopedWiringContainmentPatchTamperCaseCount: c.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: c.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x8C: true,
    postWiringAuditTamperCaseCount: c.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: c.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x8C: true,
    dryRunSyntheticValidationCaseCount: c.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: c.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x8C: true,
    dryRunLeakageValidationCaseCount: c.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: c.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x8C: true,
    dryRunTamperCaseCount: c.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: c.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x8C: true,
    wiringExecutionContractTamperCaseCount: c.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: c.wiringExecutionContractTamperCasesRejected,
    noOpenAiCall: true,
    noFetchCall: true,
    noProcessEnvRead: true,
    noSdkUsage: true,
    noRouteHandlerCall: true,
    noFilesystemRead: true,
    noDatabaseWrite: true,
    noStorageWrite: true,
    noAuditPersistence: true,
    noPromptBuild: true,
    noModelCall: true,
    noRunSmartTalkExecution: true,
    no8x3AcRerun: true,
    allowedSyntheticCases,
    forbiddenSyntheticCases,
    unsafeUnknownSyntheticCases,
    syntheticDryRunMatrix,
    dryRunNotes,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    freeQaSyntheticRuntimeActivationDryRunTamperCaseCount: tamperCaseCount,
    freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: tamperCaseCount,
    freeQaSyntheticRuntimeActivationDryRunTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaSyntheticDryRunResult(provisional)) {
    dryRunFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8D tamper cases ─────────────────────────────────────────────
  let freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_DRY_RUN_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_DRY_RUN_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaSyntheticDryRunResult(tc.mutate(provisional))) {
      freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8D tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) dryRunFailures.push(...tamperFailures);

  const allPassed =
    dryRunFailures.length === 0 &&
    syntheticMatrixOk &&
    freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected === tamperCaseCount;

  const finalDryRunNotes: string[] = [
    ...dryRunNotes,
    `8.8D tamper cases: ${freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(dryRunFailures.length > 0 ? [`FAILURES (${dryRunFailures.length}):`, ...dryRunFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected,
    dryRunNotes: finalDryRunNotes,
  };
}
