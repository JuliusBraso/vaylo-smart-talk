/**
 * PHASE 8.8E — Post-Activation Readiness Audit for Free Smart Talk Q&A
 *
 * Readiness-audit-only phase. This phase performs a post-dry-run readiness
 * audit for Free Smart Talk Q&A controlled runtime activation path.
 *
 * This phase MUST NOT:
 * - Activate runtime
 * - Enable the Evidence Gates seam
 * - Change EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED
 * - Modify runSmartTalk
 * - Import or execute runSmartTalk
 * - Modify route files
 * - Add runtime product functionality
 * - Call models or build prompts
 * - Process real user input or real documents
 *
 * Readiness audit decision:
 * - readinessAuditTarget: "free_smart_talk_qa_only"
 * - readinessAuditStatus: "ready_for_controlled_internal_test_authorization_phase_only"
 * - This phase does NOT authorize controlled internal testing.
 * - 8.8F is still required before any live execution.
 *
 * This phase itself does NOT authorize activation.
 */

import { runFreeQaSyntheticRuntimeActivationDryRun } from "./run-free-qa-synthetic-runtime-activation-dry-run";

// ─── Literal types ────────────────────────────────────────────────────────────

type ActivationTarget88E = "free_smart_talk_qa_only";
type ReadinessAuditStatus88E = "ready_for_controlled_internal_test_authorization_phase_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaReadinessAuditResult {
  checkId: "8.8E";
  allPassed: boolean;
  postActivationReadinessAuditOnly: true;
  freeQaPostActivationReadinessAuditFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaSyntheticRuntimeActivationDryRunFileModified: false;
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
  importedOnlyFreeQaSyntheticRuntimeActivationDryRunRunner: true;
  noOtherImportsUsed: true;
  freeQaSyntheticRuntimeActivationDryRunRunnerCalled: true;
  freeQaSyntheticRuntimeActivationDryRunCheckId: "8.8D";
  freeQaSyntheticRuntimeActivationDryRunAllPassed: true;
  freeQaSyntheticRuntimeActivationDryRunReadyForReadinessAudit: true;
  freeQaActivationTargetConfirmed: ActivationTarget88E;
  readinessAuditTarget: ActivationTarget88E;
  readinessAuditStatus: ReadinessAuditStatus88E;
  readinessAuditCreatedForFreeQaOnly: true;
  readinessAuditDoesNotAuthorizeRuntime: true;
  readinessAuditDoesNotAuthorizeInternalTest: true;
  readinessAuditDoesNotAuthorizePublicRuntime: true;
  readinessAuditDoesNotAuthorizePilotRuntime: true;
  readinessAuditDoesNotAuthorizeProductionRuntime: true;
  readinessAuditDoesNotAuthorizeGoLive: true;
  readinessAuditRequires8x8F: true;
  syntheticDryRunMatrixConfirmedPassing: true;
  allowedSyntheticCaseCount: number;
  allowedSyntheticCasesPassed: number;
  forbiddenSyntheticCaseCount: number;
  forbiddenSyntheticCasesBlocked: number;
  unsafeUnknownSyntheticCaseCount: number;
  unsafeUnknownSyntheticCasesFailedClosed: number;
  allowedSyntheticReadinessConfirmed: true;
  forbiddenDocumentReadinessBlocksConfirmed: true;
  forbiddenPhotoOcrReadinessBlocksConfirmed: true;
  forbiddenScannerReadinessBlocksConfirmed: true;
  forbiddenPaidDnaReadinessBlocksConfirmed: true;
  exactLegalDeadlineReadinessBlocksConfirmed: true;
  trustedLegalAdviceReadinessBlocksConfirmed: true;
  unsafeUnknownReadinessFailClosedConfirmed: true;
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
  controlledInternalTestAuthorizedNow: false;
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  controlledRuntimeActivationClosureDecisionRequired: true;
  controlledInternalTestAuthorizationRequired: true;
  futureRuntimePatchRequired: true;
  futureSeamEnablementRequiresSeparateAuthorization: true;
  futurePostActivationAuditRequired: true;
  readyFor8x8FControlledInternalTestAuthorization: true;
  readyForRuntimeActivation: false;
  readyForControlledInternalTest: false;
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
  freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8D: true;
  freeQaSyntheticRuntimeActivationDryRunTamperCaseCount: number;
  freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: number;
  freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8D: true;
  freeQaControlledRuntimeActivationContractTamperCaseCount: number;
  freeQaControlledRuntimeActivationContractTamperCasesRejected: number;
  freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8D: true;
  freeQaControlledRuntimeActivationPlanTamperCaseCount: number;
  freeQaControlledRuntimeActivationPlanTamperCasesRejected: number;
  governanceKernelConsolidationTamperConfirmedFrom8x8D: true;
  governanceKernelConsolidationTamperCaseCount: number;
  governanceKernelConsolidationTamperCasesRejected: number;
  evidenceGatesClosureDecisionTamperConfirmedFrom8x8D: true;
  evidenceGatesClosureDecisionTamperCaseCount: number;
  evidenceGatesClosureDecisionTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperConfirmedFrom8x8D: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x8D: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x8D: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x8D: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x8D: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x8D: true;
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
  readinessAuditDecision: string[];
  readinessAuditNotes: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  freeQaPostActivationReadinessAuditTamperCaseCount: number;
  freeQaPostActivationReadinessAuditTamperCasesRejected: number;
  freeQaPostActivationReadinessAuditTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const ACTIVATION_TARGET: ActivationTarget88E = "free_smart_talk_qa_only";
const READINESS_AUDIT_STATUS: ReadinessAuditStatus88E = "ready_for_controlled_internal_test_authorization_phase_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_READY_FOR_CIT = "ready_for_controlled_internal_test_authorization_phase_only";
const SENTINEL_DOES_NOT_AUTH_RUNTIME = "does not authorize runtime";
const SENTINEL_8X8F_AUTH = "8.8F-controlled-internal-test-authorization-for-free-qa";
const SENTINEL_RUNTIME_ACTIVATION_BLOCKER = "runtime-activation-unauthorized-global-blocker";
const SENTINEL_DOCUMENT_MODE_BLOCKER = "document-mode-unauthorized-global-blocker";
const SENTINEL_PHOTO_OCR_BLOCKER = "photo-ocr-runtime-unauthorized-global-blocker";
const SENTINEL_SCANNER_BLOCKER = "scanner-upload-unauthorized-global-blocker";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaReadinessAuditResult(r: FreeQaReadinessAuditResult): boolean {
  // Phase identity
  if (r.checkId !== "8.8E") return false;
  if (r.allPassed !== true) return false;
  if (r.postActivationReadinessAuditOnly !== true) return false;
  if (r.freeQaPostActivationReadinessAuditFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunFileModified !== false) return false;
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
  // Import/runner flags and 8.8D confirmations
  if (r.importedOnlyFreeQaSyntheticRuntimeActivationDryRunRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunRunnerCalled !== true) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunCheckId !== "8.8D") return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunAllPassed !== true) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunReadyForReadinessAudit !== true) return false;
  if (r.freeQaActivationTargetConfirmed !== ACTIVATION_TARGET) return false;
  // Readiness audit flags
  if (r.readinessAuditTarget !== ACTIVATION_TARGET) return false;
  if (r.readinessAuditStatus !== READINESS_AUDIT_STATUS) return false;
  if (r.readinessAuditCreatedForFreeQaOnly !== true) return false;
  if (r.readinessAuditDoesNotAuthorizeRuntime !== true) return false;
  if (r.readinessAuditDoesNotAuthorizeInternalTest !== true) return false;
  if (r.readinessAuditDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.readinessAuditDoesNotAuthorizePilotRuntime !== true) return false;
  if (r.readinessAuditDoesNotAuthorizeProductionRuntime !== true) return false;
  if (r.readinessAuditDoesNotAuthorizeGoLive !== true) return false;
  if (r.readinessAuditRequires8x8F !== true) return false;
  // Dry-run matrix confirmation
  if (r.syntheticDryRunMatrixConfirmedPassing !== true) return false;
  if (r.allowedSyntheticCasesPassed !== r.allowedSyntheticCaseCount) return false;
  if (r.forbiddenSyntheticCasesBlocked !== r.forbiddenSyntheticCaseCount) return false;
  if (r.unsafeUnknownSyntheticCasesFailedClosed !== r.unsafeUnknownSyntheticCaseCount) return false;
  // Readiness block confirmations
  if (r.allowedSyntheticReadinessConfirmed !== true) return false;
  if (r.forbiddenDocumentReadinessBlocksConfirmed !== true) return false;
  if (r.forbiddenPhotoOcrReadinessBlocksConfirmed !== true) return false;
  if (r.forbiddenScannerReadinessBlocksConfirmed !== true) return false;
  if (r.forbiddenPaidDnaReadinessBlocksConfirmed !== true) return false;
  if (r.exactLegalDeadlineReadinessBlocksConfirmed !== true) return false;
  if (r.trustedLegalAdviceReadinessBlocksConfirmed !== true) return false;
  if (r.unsafeUnknownReadinessFailClosedConfirmed !== true) return false;
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
  if (r.controlledInternalTestAuthorizedNow !== false) return false;
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Future required phase flags
  if (r.controlledRuntimeActivationClosureDecisionRequired !== true) return false;
  if (r.controlledInternalTestAuthorizationRequired !== true) return false;
  if (r.futureRuntimePatchRequired !== true) return false;
  if (r.futureSeamEnablementRequiresSeparateAuthorization !== true) return false;
  if (r.futurePostActivationAuditRequired !== true) return false;
  // Readiness flags
  if (r.readyFor8x8FControlledInternalTestAuthorization !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForControlledInternalTest !== false) return false;
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
  // Inherited 8.8D count confirmations
  if (r.freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8D !== true) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected !== r.freeQaSyntheticRuntimeActivationDryRunTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8D !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractTamperCasesRejected !== r.freeQaControlledRuntimeActivationContractTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8D !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperCasesRejected !== r.freeQaControlledRuntimeActivationPlanTamperCaseCount) return false;
  if (r.governanceKernelConsolidationTamperConfirmedFrom8x8D !== true) return false;
  if (r.governanceKernelConsolidationTamperCasesRejected !== r.governanceKernelConsolidationTamperCaseCount) return false;
  if (r.evidenceGatesClosureDecisionTamperConfirmedFrom8x8D !== true) return false;
  if (r.evidenceGatesClosureDecisionTamperCasesRejected !== r.evidenceGatesClosureDecisionTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x8D !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x8D !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x8D !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x8D !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x8D !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x8D !== true) return false;
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
  if (!r.readinessAuditDecision || r.readinessAuditDecision.length === 0) return false;
  if (!r.readinessAuditNotes || r.readinessAuditNotes.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.readinessAuditDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_READY_FOR_CIT)) return false;
  const notesJ = r.readinessAuditNotes.join(" ");
  if (!notesJ.includes(SENTINEL_DOES_NOT_AUTH_RUNTIME)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_8X8F_AUTH)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_ACTIVATION_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKER)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Tamper coverage
  if (r.freeQaPostActivationReadinessAuditTamperCasesRejected !== r.freeQaPostActivationReadinessAuditTamperCaseCount) return false;
  if (r.freeQaPostActivationReadinessAuditTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type FreeQaAuditTamperMutation = (r: FreeQaReadinessAuditResult) => FreeQaReadinessAuditResult;
interface FreeQaAuditTamperCase { label: string; mutate: FreeQaAuditTamperMutation; }

const FREE_QA_AUDIT_TAMPER_CASES: FreeQaAuditTamperCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8D" as "8.8E" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "postActivationReadinessAuditOnly false", mutate: (r) => ({ ...r, postActivationReadinessAuditOnly: false as true }) },
  { label: "freeQaPostActivationReadinessAuditFileCreated false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunFileModified true", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunFileModified: true as false }) },
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
  // Import/runner flags and 8.8D confirmations
  { label: "importedOnlyFreeQaSyntheticRuntimeActivationDryRunRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaSyntheticRuntimeActivationDryRunRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunRunnerCalled false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunRunnerCalled: false as true }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunCheckId wrong", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunCheckId: "8.8C" as "8.8D" }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunAllPassed false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunAllPassed: false as true }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunReadyForReadinessAudit false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunReadyForReadinessAudit: false as true }) },
  { label: "freeQaActivationTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaActivationTargetConfirmed: "text_document_mode" as ActivationTarget88E }) },
  // Readiness audit flags
  { label: "readinessAuditTarget wrong", mutate: (r) => ({ ...r, readinessAuditTarget: "text_document_mode" as ActivationTarget88E }) },
  { label: "readinessAuditStatus wrong", mutate: (r) => ({ ...r, readinessAuditStatus: "unauthorized" as ReadinessAuditStatus88E }) },
  { label: "readinessAuditCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, readinessAuditCreatedForFreeQaOnly: false as true }) },
  { label: "readinessAuditDoesNotAuthorizeRuntime false", mutate: (r) => ({ ...r, readinessAuditDoesNotAuthorizeRuntime: false as true }) },
  { label: "readinessAuditDoesNotAuthorizeInternalTest false", mutate: (r) => ({ ...r, readinessAuditDoesNotAuthorizeInternalTest: false as true }) },
  { label: "readinessAuditDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, readinessAuditDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "readinessAuditDoesNotAuthorizePilotRuntime false", mutate: (r) => ({ ...r, readinessAuditDoesNotAuthorizePilotRuntime: false as true }) },
  { label: "readinessAuditDoesNotAuthorizeProductionRuntime false", mutate: (r) => ({ ...r, readinessAuditDoesNotAuthorizeProductionRuntime: false as true }) },
  { label: "readinessAuditDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, readinessAuditDoesNotAuthorizeGoLive: false as true }) },
  { label: "readinessAuditRequires8x8F false", mutate: (r) => ({ ...r, readinessAuditRequires8x8F: false as true }) },
  // Dry-run matrix confirmation
  { label: "syntheticDryRunMatrixConfirmedPassing false", mutate: (r) => ({ ...r, syntheticDryRunMatrixConfirmedPassing: false as true }) },
  { label: "allowedSyntheticCasesPassed not equal allowedSyntheticCaseCount", mutate: (r) => ({ ...r, allowedSyntheticCasesPassed: r.allowedSyntheticCasesPassed - 1 }) },
  { label: "forbiddenSyntheticCasesBlocked not equal forbiddenSyntheticCaseCount", mutate: (r) => ({ ...r, forbiddenSyntheticCasesBlocked: r.forbiddenSyntheticCasesBlocked - 1 }) },
  { label: "unsafeUnknownSyntheticCasesFailedClosed not equal unsafeUnknownSyntheticCaseCount", mutate: (r) => ({ ...r, unsafeUnknownSyntheticCasesFailedClosed: r.unsafeUnknownSyntheticCasesFailedClosed - 1 }) },
  // Readiness block confirmations
  { label: "allowedSyntheticReadinessConfirmed false", mutate: (r) => ({ ...r, allowedSyntheticReadinessConfirmed: false as true }) },
  { label: "forbiddenDocumentReadinessBlocksConfirmed false", mutate: (r) => ({ ...r, forbiddenDocumentReadinessBlocksConfirmed: false as true }) },
  { label: "forbiddenPhotoOcrReadinessBlocksConfirmed false", mutate: (r) => ({ ...r, forbiddenPhotoOcrReadinessBlocksConfirmed: false as true }) },
  { label: "forbiddenScannerReadinessBlocksConfirmed false", mutate: (r) => ({ ...r, forbiddenScannerReadinessBlocksConfirmed: false as true }) },
  { label: "forbiddenPaidDnaReadinessBlocksConfirmed false", mutate: (r) => ({ ...r, forbiddenPaidDnaReadinessBlocksConfirmed: false as true }) },
  { label: "exactLegalDeadlineReadinessBlocksConfirmed false", mutate: (r) => ({ ...r, exactLegalDeadlineReadinessBlocksConfirmed: false as true }) },
  { label: "trustedLegalAdviceReadinessBlocksConfirmed false", mutate: (r) => ({ ...r, trustedLegalAdviceReadinessBlocksConfirmed: false as true }) },
  { label: "unsafeUnknownReadinessFailClosedConfirmed false", mutate: (r) => ({ ...r, unsafeUnknownReadinessFailClosedConfirmed: false as true }) },
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
  { label: "controlledInternalTestAuthorizedNow true", mutate: (r) => ({ ...r, controlledInternalTestAuthorizedNow: true as false }) },
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Future required phase flags
  { label: "controlledRuntimeActivationClosureDecisionRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationClosureDecisionRequired: false as true }) },
  { label: "controlledInternalTestAuthorizationRequired false", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationRequired: false as true }) },
  { label: "futureRuntimePatchRequired false", mutate: (r) => ({ ...r, futureRuntimePatchRequired: false as true }) },
  { label: "futureSeamEnablementRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureSeamEnablementRequiresSeparateAuthorization: false as true }) },
  { label: "futurePostActivationAuditRequired false", mutate: (r) => ({ ...r, futurePostActivationAuditRequired: false as true }) },
  // Readiness flags
  { label: "readyFor8x8FControlledInternalTestAuthorization false", mutate: (r) => ({ ...r, readyFor8x8FControlledInternalTestAuthorization: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForControlledInternalTest true", mutate: (r) => ({ ...r, readyForControlledInternalTest: true as false }) },
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
  // Inherited 8.8D count confirmation booleans
  { label: "freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8D: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8D: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8D: false as true }) },
  { label: "governanceKernelConsolidationTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperConfirmedFrom8x8D: false as true }) },
  { label: "evidenceGatesClosureDecisionTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperConfirmedFrom8x8D: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x8D: false as true }) },
  { label: "postWiringAuditTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x8D: false as true }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x8D false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x8D: false as true }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x8D false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x8D: false as true }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x8D false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x8D: false as true }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x8D false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x8D: false as true }) },
  // Inherited count mismatches
  { label: "freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: r.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected - 1 }) },
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
  { label: "readinessAuditDecision empty", mutate: (r) => ({ ...r, readinessAuditDecision: [] }) },
  { label: "readinessAuditNotes empty", mutate: (r) => ({ ...r, readinessAuditNotes: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  // Array sentinel checks
  { label: "readinessAuditDecision missing ready_for_controlled_internal_test_authorization_phase_only sentinel", mutate: (r) => ({ ...r, readinessAuditDecision: r.readinessAuditDecision.map((s) => s.split(SENTINEL_READY_FOR_CIT).join("omitted")) }) },
  { label: "readinessAuditNotes missing does not authorize runtime sentinel", mutate: (r) => ({ ...r, readinessAuditNotes: r.readinessAuditNotes.map((s) => s.split(SENTINEL_DOES_NOT_AUTH_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing 8.8F authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_8X8F_AUTH).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime activation blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_ACTIVATION_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKER).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Tamper coverage self-checks
  { label: "freeQaPostActivationReadinessAuditTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperCoveragePassing: false as true }) },
  { label: "freeQaPostActivationReadinessAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperCasesRejected: r.freeQaPostActivationReadinessAuditTamperCasesRejected - 1 }) },
];

// ─── Exported audit runner ────────────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Post-Activation Readiness Audit runner for 8.8E.
 *
 * Calls the 8.8D Synthetic Runtime Activation Dry-Run runner as source of truth.
 * Audits the readiness of the Free Smart Talk Q&A path for a future controlled
 * internal test authorization phase.
 * This phase itself does NOT authorize controlled internal testing or activation.
 */
export function runFreeQaPostActivationReadinessAudit(): FreeQaReadinessAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.8D Dry-Run runner as source of truth ───────────────────────
  const d = runFreeQaSyntheticRuntimeActivationDryRun();

  if (d.checkId !== "8.8D") auditFailures.push(`8.8D checkId mismatch: expected "8.8D", got "${d.checkId}"`);
  if (d.allPassed !== true) auditFailures.push("8.8D allPassed is not true");
  if (d.readyFor8x8EPostActivationReadinessAudit !== true) auditFailures.push("8.8D readyFor8x8EPostActivationReadinessAudit is not true");
  if (d.activationTarget !== ACTIVATION_TARGET) auditFailures.push(`8.8D activationTarget mismatch: expected "${ACTIVATION_TARGET}", got "${d.activationTarget}"`);
  if (d.syntheticDryRunMatrixPassing !== true) auditFailures.push("8.8D syntheticDryRunMatrixPassing is not true");
  if (d.allowedSyntheticCasesPassed !== d.allowedSyntheticCaseCount) auditFailures.push(`8.8D allowed cases: ${d.allowedSyntheticCasesPassed}/${d.allowedSyntheticCaseCount}`);
  if (d.forbiddenSyntheticCasesBlocked !== d.forbiddenSyntheticCaseCount) auditFailures.push(`8.8D forbidden cases: ${d.forbiddenSyntheticCasesBlocked}/${d.forbiddenSyntheticCaseCount}`);
  if (d.unsafeUnknownSyntheticCasesFailedClosed !== d.unsafeUnknownSyntheticCaseCount) auditFailures.push(`8.8D unsafe/unknown cases: ${d.unsafeUnknownSyntheticCasesFailedClosed}/${d.unsafeUnknownSyntheticCaseCount}`);
  if (d.dryRunDoesNotAuthorizeActivation !== true) auditFailures.push("8.8D dryRunDoesNotAuthorizeActivation is not true");
  if (d.runtimeActivationPerformed !== false) auditFailures.push("8.8D runtimeActivationPerformed is not false");
  if (d.seamActivationPerformed !== false) auditFailures.push("8.8D seamActivationPerformed is not false");
  if (d.documentRuntimeActivationPerformed !== false) auditFailures.push("8.8D documentRuntimeActivationPerformed is not false");
  if (d.photoOcrRuntimeActivationPerformed !== false) auditFailures.push("8.8D photoOcrRuntimeActivationPerformed is not false");
  if (d.scannerRuntimeActivationPerformed !== false) auditFailures.push("8.8D scannerRuntimeActivationPerformed is not false");
  if (d.paidDocumentModeRuntimeActivationPerformed !== false) auditFailures.push("8.8D paidDocumentModeRuntimeActivationPerformed is not false");
  if (d.vayloDnaRuntimeActivationPerformed !== false) auditFailures.push("8.8D vayloDnaRuntimeActivationPerformed is not false");
  if (d.controlledRuntimeActivationAuthorizedNow !== false) auditFailures.push("8.8D controlledRuntimeActivationAuthorizedNow is not false");
  if (d.evidenceGatesSeamExistsButDisabledByDefault !== true) auditFailures.push("8.8D evidenceGatesSeamExistsButDisabledByDefault is not true");
  if (d.evidenceGatesSeamRemainsInert !== true) auditFailures.push("8.8D evidenceGatesSeamRemainsInert is not true");
  if (d.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected !== d.freeQaSyntheticRuntimeActivationDryRunTamperCaseCount) auditFailures.push("8.8D dry-run tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const readinessAuditDecision: string[] = [
    `RD-01 [${SENTINEL_READY_FOR_CIT}]: ready_for_controlled_internal_test_authorization_phase_only — Free Q&A path has passed the synthetic dry-run and is ready for 8.8F controlled internal test authorization only.`,
    "RD-02: This decision does NOT authorize runtime activation, controlled internal testing, or public runtime.",
    "RD-03: 8.8F Controlled Internal Test Authorization is still required before any live execution.",
    "RD-04: Any runtime patch or seam enablement still requires separate authorization.",
    "RD-05: Document/photo/OCR/scanner/paid/DNA modes remain unauthorized and blocked by contract.",
  ];

  const readinessAuditNotes: string[] = [
    `RN-01: 8.8E readiness audit: Free Smart Talk Q&A path reviewed post-dry-run.`,
    `RN-02: This phase does not authorize runtime — ${SENTINEL_DOES_NOT_AUTH_RUNTIME} activation, internal test, or go-live.`,
    `RN-03: 8.8D confirmed — checkId=${d.checkId}, allPassed=${d.allPassed}, syntheticDryRunMatrixPassing=${d.syntheticDryRunMatrixPassing}.`,
    `RN-04: Dry-run matrix: ${d.allowedSyntheticCasesPassed}/${d.allowedSyntheticCaseCount} allowed, ${d.forbiddenSyntheticCasesBlocked}/${d.forbiddenSyntheticCaseCount} forbidden blocked, ${d.unsafeUnknownSyntheticCasesFailedClosed}/${d.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "RN-05: All governance debts, seam containment, and authorization boundaries remain preserved.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_8X8F_AUTH}]: 8.8F-controlled-internal-test-authorization-for-free-qa — Phase 8.8F must explicitly authorize controlled internal testing before any live execution.`,
    "FP-02: A future scoped runtime patch must be separately authorized before any live execution.",
    "FP-03: Any seam enablement must have a post-activation audit.",
    "FP-04: Public runtime, pilot, production, and go-live remain unauthorized until all preconditions are met.",
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01 [${SENTINEL_RUNTIME_ACTIVATION_BLOCKER}]: runtime-activation-unauthorized-global-blocker — controlled runtime activation is not yet authorized; 8.8F minimum required.`,
    `GB-02 [${SENTINEL_DOCUMENT_MODE_BLOCKER}]: document-mode-unauthorized-global-blocker — text document mode runtime remains unauthorized globally.`,
    `GB-03 [${SENTINEL_PHOTO_OCR_BLOCKER}]: photo-ocr-runtime-unauthorized-global-blocker — photo and OCR runtime remains unauthorized globally.`,
    `GB-04 [${SENTINEL_SCANNER_BLOCKER}]: scanner-upload-unauthorized-global-blocker — scanner upload runtime remains unauthorized globally.`,
    "GB-05: public-runtime-unauthorized-global-blocker — public runtime remains unauthorized globally.",
    "GB-06: production-go-live-unauthorized-global-blocker — production and go-live remain unauthorized globally.",
    "GB-07: controlled-internal-test-unauthorized-global-blocker — controlled internal test remains unauthorized; 8.8F required.",
    "GB-08: seam-activation-unauthorized-global-blocker — Evidence Gates seam activation remains unauthorized.",
    "GB-09: payment-entitlement-runtime-unauthorized-global-blocker — payment and entitlement runtime remain unauthorized globally.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8E.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8E.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8E.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8E.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8E.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8E.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8E.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8E.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8E.)",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_AUDIT_TAMPER_CASES.length;

  const provisional: FreeQaReadinessAuditResult = {
    checkId: "8.8E",
    allPassed: true,
    postActivationReadinessAuditOnly: true,
    freeQaPostActivationReadinessAuditFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaSyntheticRuntimeActivationDryRunFileModified: false,
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
    importedOnlyFreeQaSyntheticRuntimeActivationDryRunRunner: true,
    noOtherImportsUsed: true,
    freeQaSyntheticRuntimeActivationDryRunRunnerCalled: true,
    freeQaSyntheticRuntimeActivationDryRunCheckId: "8.8D",
    freeQaSyntheticRuntimeActivationDryRunAllPassed: true,
    freeQaSyntheticRuntimeActivationDryRunReadyForReadinessAudit: true,
    freeQaActivationTargetConfirmed: ACTIVATION_TARGET,
    readinessAuditTarget: ACTIVATION_TARGET,
    readinessAuditStatus: READINESS_AUDIT_STATUS,
    readinessAuditCreatedForFreeQaOnly: true,
    readinessAuditDoesNotAuthorizeRuntime: true,
    readinessAuditDoesNotAuthorizeInternalTest: true,
    readinessAuditDoesNotAuthorizePublicRuntime: true,
    readinessAuditDoesNotAuthorizePilotRuntime: true,
    readinessAuditDoesNotAuthorizeProductionRuntime: true,
    readinessAuditDoesNotAuthorizeGoLive: true,
    readinessAuditRequires8x8F: true,
    syntheticDryRunMatrixConfirmedPassing: true,
    allowedSyntheticCaseCount: d.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: d.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: d.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: d.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: d.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: d.unsafeUnknownSyntheticCasesFailedClosed,
    allowedSyntheticReadinessConfirmed: true,
    forbiddenDocumentReadinessBlocksConfirmed: true,
    forbiddenPhotoOcrReadinessBlocksConfirmed: true,
    forbiddenScannerReadinessBlocksConfirmed: true,
    forbiddenPaidDnaReadinessBlocksConfirmed: true,
    exactLegalDeadlineReadinessBlocksConfirmed: true,
    trustedLegalAdviceReadinessBlocksConfirmed: true,
    unsafeUnknownReadinessFailClosedConfirmed: true,
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
    controlledInternalTestAuthorizedNow: false,
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    controlledRuntimeActivationClosureDecisionRequired: true,
    controlledInternalTestAuthorizationRequired: true,
    futureRuntimePatchRequired: true,
    futureSeamEnablementRequiresSeparateAuthorization: true,
    futurePostActivationAuditRequired: true,
    readyFor8x8FControlledInternalTestAuthorization: true,
    readyForRuntimeActivation: false,
    readyForControlledInternalTest: false,
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
    freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8D: true,
    freeQaSyntheticRuntimeActivationDryRunTamperCaseCount: d.freeQaSyntheticRuntimeActivationDryRunTamperCaseCount,
    freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: d.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected,
    freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8D: true,
    freeQaControlledRuntimeActivationContractTamperCaseCount: d.freeQaControlledRuntimeActivationContractTamperCaseCount,
    freeQaControlledRuntimeActivationContractTamperCasesRejected: d.freeQaControlledRuntimeActivationContractTamperCasesRejected,
    freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8D: true,
    freeQaControlledRuntimeActivationPlanTamperCaseCount: d.freeQaControlledRuntimeActivationPlanTamperCaseCount,
    freeQaControlledRuntimeActivationPlanTamperCasesRejected: d.freeQaControlledRuntimeActivationPlanTamperCasesRejected,
    governanceKernelConsolidationTamperConfirmedFrom8x8D: true,
    governanceKernelConsolidationTamperCaseCount: d.governanceKernelConsolidationTamperCaseCount,
    governanceKernelConsolidationTamperCasesRejected: d.governanceKernelConsolidationTamperCasesRejected,
    evidenceGatesClosureDecisionTamperConfirmedFrom8x8D: true,
    evidenceGatesClosureDecisionTamperCaseCount: d.evidenceGatesClosureDecisionTamperCaseCount,
    evidenceGatesClosureDecisionTamperCasesRejected: d.evidenceGatesClosureDecisionTamperCasesRejected,
    scopedWiringContainmentPatchTamperConfirmedFrom8x8D: true,
    scopedWiringContainmentPatchTamperCaseCount: d.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: d.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x8D: true,
    postWiringAuditTamperCaseCount: d.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: d.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x8D: true,
    dryRunSyntheticValidationCaseCount: d.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: d.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x8D: true,
    dryRunLeakageValidationCaseCount: d.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: d.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x8D: true,
    dryRunTamperCaseCount: d.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: d.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x8D: true,
    wiringExecutionContractTamperCaseCount: d.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: d.wiringExecutionContractTamperCasesRejected,
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
    readinessAuditDecision,
    readinessAuditNotes,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    freeQaPostActivationReadinessAuditTamperCaseCount: tamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: tamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaReadinessAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8E tamper cases ─────────────────────────────────────────────
  let freeQaPostActivationReadinessAuditTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_AUDIT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_AUDIT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaReadinessAuditResult(tc.mutate(provisional))) {
      freeQaPostActivationReadinessAuditTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8E tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    freeQaPostActivationReadinessAuditTamperCasesRejected === tamperCaseCount;

  const finalReadinessAuditNotes: string[] = [
    ...readinessAuditNotes,
    `8.8E tamper cases: ${freeQaPostActivationReadinessAuditTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaPostActivationReadinessAuditTamperCasesRejected,
    readinessAuditNotes: finalReadinessAuditNotes,
  };
}
