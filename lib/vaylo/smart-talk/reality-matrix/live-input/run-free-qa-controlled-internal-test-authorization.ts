/**
 * PHASE 8.8F — Controlled Internal Test Authorization for Free Smart Talk Q&A
 *
 * Authorization-decision-only phase. This phase authorizes ONLY the
 * controlled internal test authorization decision for Free Smart Talk Q&A
 * (anonymous, non-document questions). It confirms readiness for the Vaylo
 * team to design the NEXT implementation phase for an internal Free Q&A
 * test. It does not activate runtime, the route, or the seam.
 *
 * This phase MUST NOT:
 * - Activate runtime, the route, or the Evidence Gates seam
 * - Change EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED
 * - Modify or import/execute runSmartTalk
 * - Modify route files
 * - Add runtime product functionality
 * - Call models or build prompts
 * - Process real user input or real documents
 *
 * Authorization decision:
 * - authorizationTarget: "free_smart_talk_qa_controlled_internal_test_only"
 * - controlledInternalTestAuthorizationStatus: "authorized_for_controlled_internal_test_phase_only"
 * - controlledInternalTestAuthorized: true
 * - All runtime/public/document activation flags remain false.
 *
 * Controlled internal test authorization means the Vaylo team MAY proceed to
 * design the next implementation phase for an internal Free Q&A test. It does
 * NOT mean the route is live, the seam is enabled, public users can use it,
 * documents can be processed, or production/go-live has occurred.
 */

import { runFreeQaPostActivationReadinessAudit } from "./run-free-qa-post-activation-readiness-audit";

// ─── Literal types ────────────────────────────────────────────────────────────

type ActivationTargetE = "free_smart_talk_qa_only";
type ReadinessAuditStatusE = "ready_for_controlled_internal_test_authorization_phase_only";
type AuthorizationTarget88F = "free_smart_talk_qa_controlled_internal_test_only";
type ControlledInternalTestAuthorizationStatus88F = "authorized_for_controlled_internal_test_phase_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaControlledInternalTestAuthorizationResult {
  checkId: "8.8F";
  allPassed: boolean;
  controlledInternalTestAuthorizationOnly: true;
  freeQaControlledInternalTestAuthorizationFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaPostActivationReadinessAuditFileModified: false;
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
  importedOnlyFreeQaPostActivationReadinessAuditRunner: true;
  noOtherImportsUsed: true;
  freeQaPostActivationReadinessAuditRunnerCalled: true;
  freeQaPostActivationReadinessAuditCheckId: "8.8E";
  freeQaPostActivationReadinessAuditAllPassed: true;
  freeQaPostActivationReadinessAuditReadyForAuthorization: true;
  freeQaActivationTargetConfirmed: ActivationTargetE;
  readinessAuditStatusConfirmed: ReadinessAuditStatusE;
  authorizationTarget: AuthorizationTarget88F;
  controlledInternalTestAuthorizationStatus: ControlledInternalTestAuthorizationStatus88F;
  controlledInternalTestAuthorizationCreatedForFreeQaOnly: true;
  controlledInternalTestAuthorized: true;
  controlledInternalTestScopeConfirmed: true;
  controlledInternalTestDoesNotAuthorizeRuntimeActivation: true;
  controlledInternalTestDoesNotAuthorizePublicRuntime: true;
  controlledInternalTestDoesNotAuthorizePilot: true;
  controlledInternalTestDoesNotAuthorizeProduction: true;
  controlledInternalTestDoesNotAuthorizeGoLive: true;
  controlledInternalTestDoesNotAuthorizeDocuments: true;
  controlledInternalTestDoesNotAuthorizePhotoOcr: true;
  controlledInternalTestDoesNotAuthorizeScanner: true;
  controlledInternalTestDoesNotAuthorizePaidMode: true;
  controlledInternalTestDoesNotAuthorizeVayloDna: true;
  controlledInternalTestDoesNotAuthorizeExactLegalDeadlineCalculation: true;
  controlledInternalTestDoesNotAuthorizeTrustedModelOutput: true;
  allowedSyntheticCaseCount: number;
  allowedSyntheticCasesPassed: number;
  forbiddenSyntheticCaseCount: number;
  forbiddenSyntheticCasesBlocked: number;
  unsafeUnknownSyntheticCaseCount: number;
  unsafeUnknownSyntheticCasesFailedClosed: number;
  syntheticDryRunMatrixConfirmedPassing: true;
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
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  readyForFreeQaInternalTestImplementationPlan: true;
  readyForRuntimeActivation: false;
  readyForControlledInternalTestRuntimeExecution: false;
  readyForRealDocumentInput: false;
  readyForUserVisibleDocumentOutput: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPublicRuntime: false;
  readyForPilot: false;
  readyForProduction: false;
  readyForGoLive: false;
  futureRuntimePatchRequired: true;
  futureSeamEnablementRequiresSeparateAuthorization: true;
  futurePostActivationAuditRequired: true;
  futureControlledInternalRuntimeExecutionAuthorizationRequired: true;
  claimRuleOrSemanticsDebtPreserved: true;
  evidenceRuleResolutionDebtPreserved: true;
  proximityManualOnlyDebtPreserved: true;
  trapKindTypingDebtPreserved: true;
  enforcementTrapHeuristicDebtPreserved: true;
  trapDispositionStateSeparationDebtPreserved: true;
  severityCandidateDerivationSeparationDebtPreserved: true;
  mapperDiagnosticTaxonomyDebtPreserved: true;
  td004ClosureDoesNotAuthorizeWiringDebtPreserved: true;
  freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8E: true;
  freeQaPostActivationReadinessAuditTamperCaseCount: number;
  freeQaPostActivationReadinessAuditTamperCasesRejected: number;
  freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8E: true;
  freeQaSyntheticRuntimeActivationDryRunTamperCaseCount: number;
  freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: number;
  freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8E: true;
  freeQaControlledRuntimeActivationContractTamperCaseCount: number;
  freeQaControlledRuntimeActivationContractTamperCasesRejected: number;
  freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8E: true;
  freeQaControlledRuntimeActivationPlanTamperCaseCount: number;
  freeQaControlledRuntimeActivationPlanTamperCasesRejected: number;
  governanceKernelConsolidationTamperConfirmedFrom8x8E: true;
  governanceKernelConsolidationTamperCaseCount: number;
  governanceKernelConsolidationTamperCasesRejected: number;
  evidenceGatesClosureDecisionTamperConfirmedFrom8x8E: true;
  evidenceGatesClosureDecisionTamperCaseCount: number;
  evidenceGatesClosureDecisionTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperConfirmedFrom8x8E: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x8E: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x8E: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x8E: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x8E: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x8E: true;
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
  authorizationDecision: string[];
  controlledInternalTestScope: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  authorizationNotes: string[];
  freeQaControlledInternalTestAuthorizationTamperCaseCount: number;
  freeQaControlledInternalTestAuthorizationTamperCasesRejected: number;
  freeQaControlledInternalTestAuthorizationTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const ACTIVATION_TARGET_E: ActivationTargetE = "free_smart_talk_qa_only";
const READINESS_AUDIT_STATUS_E: ReadinessAuditStatusE = "ready_for_controlled_internal_test_authorization_phase_only";
const AUTHORIZATION_TARGET: AuthorizationTarget88F = "free_smart_talk_qa_controlled_internal_test_only";
const AUTHORIZATION_STATUS: ControlledInternalTestAuthorizationStatus88F = "authorized_for_controlled_internal_test_phase_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_AUTHORIZED_STATUS = "authorized_for_controlled_internal_test_phase_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_NO_RUNTIME_ACTIVATION = "no runtime activation";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_INTERNAL_TEST_IMPL_PLAN = "internal test implementation plan";
const SENTINEL_RUNTIME_ACTIVATION_BLOCKER = "runtime-activation-unauthorized-global-blocker";
const SENTINEL_DOCUMENT_MODE_BLOCKER = "document-mode-unauthorized-global-blocker";
const SENTINEL_PHOTO_OCR_BLOCKER = "photo-ocr-runtime-unauthorized-global-blocker";
const SENTINEL_SCANNER_BLOCKER = "scanner-upload-unauthorized-global-blocker";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaControlledInternalTestAuthorizationResult(
  r: FreeQaControlledInternalTestAuthorizationResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8F") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledInternalTestAuthorizationOnly !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaPostActivationReadinessAuditFileModified !== false) return false;
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
  // Import/runner flags and 8.8E confirmations
  if (r.importedOnlyFreeQaPostActivationReadinessAuditRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaPostActivationReadinessAuditRunnerCalled !== true) return false;
  if (r.freeQaPostActivationReadinessAuditCheckId !== "8.8E") return false;
  if (r.freeQaPostActivationReadinessAuditAllPassed !== true) return false;
  if (r.freeQaPostActivationReadinessAuditReadyForAuthorization !== true) return false;
  if (r.freeQaActivationTargetConfirmed !== ACTIVATION_TARGET_E) return false;
  if (r.readinessAuditStatusConfirmed !== READINESS_AUDIT_STATUS_E) return false;
  // Authorization decision
  if (r.authorizationTarget !== AUTHORIZATION_TARGET) return false;
  if (r.controlledInternalTestAuthorizationStatus !== AUTHORIZATION_STATUS) return false;
  if (r.controlledInternalTestAuthorizationCreatedForFreeQaOnly !== true) return false;
  if (r.controlledInternalTestAuthorized !== true) return false;
  if (r.controlledInternalTestScopeConfirmed !== true) return false;
  // Does-not-authorize flags
  if (r.controlledInternalTestDoesNotAuthorizeRuntimeActivation !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizePilot !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeProduction !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeGoLive !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeDocuments !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizePhotoOcr !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeScanner !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizePaidMode !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeVayloDna !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeExactLegalDeadlineCalculation !== true) return false;
  if (r.controlledInternalTestDoesNotAuthorizeTrustedModelOutput !== true) return false;
  // Inherited synthetic counts
  if (r.allowedSyntheticCasesPassed !== r.allowedSyntheticCaseCount) return false;
  if (r.forbiddenSyntheticCasesBlocked !== r.forbiddenSyntheticCaseCount) return false;
  if (r.unsafeUnknownSyntheticCasesFailedClosed !== r.unsafeUnknownSyntheticCaseCount) return false;
  // Readiness block confirmations
  if (r.syntheticDryRunMatrixConfirmedPassing !== true) return false;
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
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Readiness for next steps
  if (r.readyForFreeQaInternalTestImplementationPlan !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForControlledInternalTestRuntimeExecution !== false) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleDocumentOutput !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForPilot !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  // Future required phase flags
  if (r.futureRuntimePatchRequired !== true) return false;
  if (r.futureSeamEnablementRequiresSeparateAuthorization !== true) return false;
  if (r.futurePostActivationAuditRequired !== true) return false;
  if (r.futureControlledInternalRuntimeExecutionAuthorizationRequired !== true) return false;
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
  // Inherited 8.8E tamper/count confirmations
  if (r.freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8E !== true) return false;
  if (r.freeQaPostActivationReadinessAuditTamperCasesRejected !== r.freeQaPostActivationReadinessAuditTamperCaseCount) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8E !== true) return false;
  if (r.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected !== r.freeQaSyntheticRuntimeActivationDryRunTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8E !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractTamperCasesRejected !== r.freeQaControlledRuntimeActivationContractTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8E !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperCasesRejected !== r.freeQaControlledRuntimeActivationPlanTamperCaseCount) return false;
  if (r.governanceKernelConsolidationTamperConfirmedFrom8x8E !== true) return false;
  if (r.governanceKernelConsolidationTamperCasesRejected !== r.governanceKernelConsolidationTamperCaseCount) return false;
  if (r.evidenceGatesClosureDecisionTamperConfirmedFrom8x8E !== true) return false;
  if (r.evidenceGatesClosureDecisionTamperCasesRejected !== r.evidenceGatesClosureDecisionTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x8E !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x8E !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x8E !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x8E !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x8E !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x8E !== true) return false;
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
  if (!r.authorizationDecision || r.authorizationDecision.length === 0) return false;
  if (!r.controlledInternalTestScope || r.controlledInternalTestScope.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.authorizationNotes || r.authorizationNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.authorizationDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_AUTHORIZED_STATUS)) return false;
  const scopeJ = r.controlledInternalTestScope.join(" ");
  if (!scopeJ.includes(SENTINEL_FREE_QA_SCOPE)) return false;
  const boundariesJ = r.nonAuthorizationBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_NO_RUNTIME_ACTIVATION)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_INTERNAL_TEST_IMPL_PLAN)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_ACTIVATION_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKER)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Own tamper coverage
  if (r.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== r.freeQaControlledInternalTestAuthorizationTamperCaseCount) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88FMutation = (
  r: FreeQaControlledInternalTestAuthorizationResult,
) => FreeQaControlledInternalTestAuthorizationResult;
interface Tamper88FCase { label: string; mutate: Tamper88FMutation; }

const FREE_QA_AUTHORIZATION_TAMPER_CASES: Tamper88FCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8E" as "8.8F" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "controlledInternalTestAuthorizationOnly false", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationOnly: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationFileCreated false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaPostActivationReadinessAuditFileModified true", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditFileModified: true as false }) },
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
  // Import/runner flags and 8.8E confirmations
  { label: "importedOnlyFreeQaPostActivationReadinessAuditRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaPostActivationReadinessAuditRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaPostActivationReadinessAuditRunnerCalled false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditRunnerCalled: false as true }) },
  { label: "freeQaPostActivationReadinessAuditCheckId wrong", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditCheckId: "8.8D" as "8.8E" }) },
  { label: "freeQaPostActivationReadinessAuditAllPassed false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditAllPassed: false as true }) },
  { label: "freeQaPostActivationReadinessAuditReadyForAuthorization false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditReadyForAuthorization: false as true }) },
  { label: "freeQaActivationTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaActivationTargetConfirmed: "text_document_mode" as ActivationTargetE }) },
  { label: "readinessAuditStatusConfirmed wrong", mutate: (r) => ({ ...r, readinessAuditStatusConfirmed: "unauthorized" as ReadinessAuditStatusE }) },
  // Authorization decision
  { label: "authorizationTarget wrong", mutate: (r) => ({ ...r, authorizationTarget: "public_runtime" as AuthorizationTarget88F }) },
  { label: "controlledInternalTestAuthorizationStatus wrong", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationStatus: "unauthorized" as ControlledInternalTestAuthorizationStatus88F }) },
  { label: "controlledInternalTestAuthorizationCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationCreatedForFreeQaOnly: false as true }) },
  { label: "controlledInternalTestAuthorized false", mutate: (r) => ({ ...r, controlledInternalTestAuthorized: false as true }) },
  { label: "controlledInternalTestScopeConfirmed false", mutate: (r) => ({ ...r, controlledInternalTestScopeConfirmed: false as true }) },
  // Does-not-authorize flags
  { label: "controlledInternalTestDoesNotAuthorizeRuntimeActivation false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeRuntimeActivation: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizePilot false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizePilot: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeProduction false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeProduction: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeGoLive: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeDocuments false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeDocuments: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizePhotoOcr false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizePhotoOcr: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeScanner false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeScanner: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizePaidMode false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizePaidMode: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeVayloDna false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeVayloDna: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeExactLegalDeadlineCalculation false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeExactLegalDeadlineCalculation: false as true }) },
  { label: "controlledInternalTestDoesNotAuthorizeTrustedModelOutput false", mutate: (r) => ({ ...r, controlledInternalTestDoesNotAuthorizeTrustedModelOutput: false as true }) },
  // Inherited synthetic counts
  { label: "allowedSyntheticCasesPassed not equal allowedSyntheticCaseCount", mutate: (r) => ({ ...r, allowedSyntheticCasesPassed: r.allowedSyntheticCasesPassed - 1 }) },
  { label: "forbiddenSyntheticCasesBlocked not equal forbiddenSyntheticCaseCount", mutate: (r) => ({ ...r, forbiddenSyntheticCasesBlocked: r.forbiddenSyntheticCasesBlocked - 1 }) },
  { label: "unsafeUnknownSyntheticCasesFailedClosed not equal unsafeUnknownSyntheticCaseCount", mutate: (r) => ({ ...r, unsafeUnknownSyntheticCasesFailedClosed: r.unsafeUnknownSyntheticCasesFailedClosed - 1 }) },
  // Readiness block confirmations
  { label: "syntheticDryRunMatrixConfirmedPassing false", mutate: (r) => ({ ...r, syntheticDryRunMatrixConfirmedPassing: false as true }) },
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
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Readiness for next steps
  { label: "readyForFreeQaInternalTestImplementationPlan false", mutate: (r) => ({ ...r, readyForFreeQaInternalTestImplementationPlan: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForControlledInternalTestRuntimeExecution true", mutate: (r) => ({ ...r, readyForControlledInternalTestRuntimeExecution: true as false }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleDocumentOutput true", mutate: (r) => ({ ...r, readyForUserVisibleDocumentOutput: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForPilot true", mutate: (r) => ({ ...r, readyForPilot: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  // Future required phase flags
  { label: "futureRuntimePatchRequired false", mutate: (r) => ({ ...r, futureRuntimePatchRequired: false as true }) },
  { label: "futureSeamEnablementRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureSeamEnablementRequiresSeparateAuthorization: false as true }) },
  { label: "futurePostActivationAuditRequired false", mutate: (r) => ({ ...r, futurePostActivationAuditRequired: false as true }) },
  { label: "futureControlledInternalRuntimeExecutionAuthorizationRequired false", mutate: (r) => ({ ...r, futureControlledInternalRuntimeExecutionAuthorizationRequired: false as true }) },
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
  // Inherited 8.8E confirmation booleans
  { label: "freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8E: false as true }) },
  { label: "freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8E: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8E: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8E: false as true }) },
  { label: "governanceKernelConsolidationTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperConfirmedFrom8x8E: false as true }) },
  { label: "evidenceGatesClosureDecisionTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperConfirmedFrom8x8E: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x8E: false as true }) },
  { label: "postWiringAuditTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x8E: false as true }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x8E false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x8E: false as true }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x8E false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x8E: false as true }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x8E false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x8E: false as true }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x8E false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x8E: false as true }) },
  // Inherited count mismatches
  { label: "freeQaPostActivationReadinessAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperCasesRejected: r.freeQaPostActivationReadinessAuditTamperCasesRejected - 1 }) },
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
  { label: "authorizationDecision empty", mutate: (r) => ({ ...r, authorizationDecision: [] }) },
  { label: "controlledInternalTestScope empty", mutate: (r) => ({ ...r, controlledInternalTestScope: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "authorizationNotes empty", mutate: (r) => ({ ...r, authorizationNotes: [] }) },
  // Array sentinel checks
  { label: "authorizationDecision missing authorized_for_controlled_internal_test_phase_only sentinel", mutate: (r) => ({ ...r, authorizationDecision: r.authorizationDecision.map((s) => s.split(SENTINEL_AUTHORIZED_STATUS).join("omitted")) }) },
  { label: "controlledInternalTestScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, controlledInternalTestScope: r.controlledInternalTestScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime activation sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_ACTIVATION).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing internal test implementation plan sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_INTERNAL_TEST_IMPL_PLAN).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime activation blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_ACTIVATION_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKER).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Own tamper coverage self-checks
  { label: "freeQaControlledInternalTestAuthorizationTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCoveragePassing: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCasesRejected: r.freeQaControlledInternalTestAuthorizationTamperCasesRejected - 1 }) },
];

// ─── Exported authorization runner ────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Controlled Internal Test Authorization runner for 8.8F.
 *
 * Calls the 8.8E Post-Activation Readiness Audit runner as source of truth.
 * Issues the controlled internal test authorization decision for the Free
 * Smart Talk Q&A path only. Confirms the Vaylo team may proceed to design the
 * next implementation phase for an internal Free Q&A test. Does NOT activate
 * runtime, the route, or the Evidence Gates seam.
 */
export function runFreeQaControlledInternalTestAuthorization(): FreeQaControlledInternalTestAuthorizationResult {
  const authorizationFailures: string[] = [];

  // ── Call 8.8E Readiness Audit runner as source of truth ───────────────
  const e = runFreeQaPostActivationReadinessAudit();

  if (e.checkId !== "8.8E") authorizationFailures.push(`8.8E checkId mismatch: expected "8.8E", got "${e.checkId}"`);
  if (e.allPassed !== true) authorizationFailures.push("8.8E allPassed is not true");
  if (e.readinessAuditTarget !== ACTIVATION_TARGET_E) authorizationFailures.push(`8.8E readinessAuditTarget mismatch: expected "${ACTIVATION_TARGET_E}", got "${e.readinessAuditTarget}"`);
  if (e.readinessAuditStatus !== READINESS_AUDIT_STATUS_E) authorizationFailures.push(`8.8E readinessAuditStatus mismatch: expected "${READINESS_AUDIT_STATUS_E}", got "${e.readinessAuditStatus}"`);
  if (e.readyFor8x8FControlledInternalTestAuthorization !== true) authorizationFailures.push("8.8E readyFor8x8FControlledInternalTestAuthorization is not true");
  if (e.readinessAuditDoesNotAuthorizeRuntime !== true) authorizationFailures.push("8.8E readinessAuditDoesNotAuthorizeRuntime is not true");
  if (e.readinessAuditDoesNotAuthorizeInternalTest !== true) authorizationFailures.push("8.8E readinessAuditDoesNotAuthorizeInternalTest is not true");
  if (e.runtimeActivationPerformed !== false) authorizationFailures.push("8.8E runtimeActivationPerformed is not false");
  if (e.seamActivationPerformed !== false) authorizationFailures.push("8.8E seamActivationPerformed is not false");
  if (e.documentRuntimeActivationPerformed !== false) authorizationFailures.push("8.8E documentRuntimeActivationPerformed is not false");
  if (e.photoOcrRuntimeActivationPerformed !== false) authorizationFailures.push("8.8E photoOcrRuntimeActivationPerformed is not false");
  if (e.scannerRuntimeActivationPerformed !== false) authorizationFailures.push("8.8E scannerRuntimeActivationPerformed is not false");
  if (e.paidDocumentModeRuntimeActivationPerformed !== false) authorizationFailures.push("8.8E paidDocumentModeRuntimeActivationPerformed is not false");
  if (e.vayloDnaRuntimeActivationPerformed !== false) authorizationFailures.push("8.8E vayloDnaRuntimeActivationPerformed is not false");
  if (e.allowedSyntheticCasesPassed !== e.allowedSyntheticCaseCount) authorizationFailures.push(`8.8E allowed cases: ${e.allowedSyntheticCasesPassed}/${e.allowedSyntheticCaseCount}`);
  if (e.forbiddenSyntheticCasesBlocked !== e.forbiddenSyntheticCaseCount) authorizationFailures.push(`8.8E forbidden cases: ${e.forbiddenSyntheticCasesBlocked}/${e.forbiddenSyntheticCaseCount}`);
  if (e.unsafeUnknownSyntheticCasesFailedClosed !== e.unsafeUnknownSyntheticCaseCount) authorizationFailures.push(`8.8E unsafe/unknown cases: ${e.unsafeUnknownSyntheticCasesFailedClosed}/${e.unsafeUnknownSyntheticCaseCount}`);
  if (e.realDocumentInputAuthorizedNow !== false) authorizationFailures.push("8.8E realDocumentInputAuthorizedNow is not false");
  if (e.userVisibleOutputAuthorizedNow !== false) authorizationFailures.push("8.8E userVisibleOutputAuthorizedNow is not false");
  if (e.publicRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E publicRuntimeAuthorizedNow is not false");
  if (e.modelFacingUseAuthorizedNow !== false) authorizationFailures.push("8.8E modelFacingUseAuthorizedNow is not false");
  if (e.evidenceGateExecutionAuthorizedNow !== false) authorizationFailures.push("8.8E evidenceGateExecutionAuthorizedNow is not false");
  if (e.claimAuthorizationAuthorizedNow !== false) authorizationFailures.push("8.8E claimAuthorizationAuthorizedNow is not false");
  if (e.exactDeadlineCalculationAuthorized !== false) authorizationFailures.push("8.8E exactDeadlineCalculationAuthorized is not false");
  if (e.paymentRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E paymentRuntimeAuthorizedNow is not false");
  if (e.entitlementRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E entitlementRuntimeAuthorizedNow is not false");
  if (e.checkoutRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E checkoutRuntimeAuthorizedNow is not false");
  if (e.pilotAuthorizationGranted !== false) authorizationFailures.push("8.8E pilotAuthorizationGranted is not false");
  if (e.productionAuthorizationGranted !== false) authorizationFailures.push("8.8E productionAuthorizationGranted is not false");
  if (e.goLiveAuthorizationGranted !== false) authorizationFailures.push("8.8E goLiveAuthorizationGranted is not false");
  if (e.seamActivationAuthorizedNow !== false) authorizationFailures.push("8.8E seamActivationAuthorizedNow is not false");
  if (e.controlledRuntimeActivationAuthorizedNow !== false) authorizationFailures.push("8.8E controlledRuntimeActivationAuthorizedNow is not false");
  if (e.documentRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E documentRuntimeAuthorizedNow is not false");
  if (e.photoOcrRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E photoOcrRuntimeAuthorizedNow is not false");
  if (e.scannerUploadAuthorizedNow !== false) authorizationFailures.push("8.8E scannerUploadAuthorizedNow is not false");
  if (e.vayloDnaRuntimeAuthorizedNow !== false) authorizationFailures.push("8.8E vayloDnaRuntimeAuthorizedNow is not false");
  if (e.freeQaPostActivationReadinessAuditTamperCasesRejected !== e.freeQaPostActivationReadinessAuditTamperCaseCount) authorizationFailures.push("8.8E readiness-audit tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const authorizationDecision: string[] = [
    `AD-01 [${SENTINEL_AUTHORIZED_STATUS}]: authorized_for_controlled_internal_test_phase_only — Free Smart Talk Q&A anonymous non-document question path is authorized for the controlled internal test authorization phase only.`,
    "AD-02: This decision authorizes the Vaylo team to design the NEXT implementation phase for an internal Free Q&A test.",
    "AD-03: This decision does NOT authorize runtime activation, route activation, or seam activation.",
    "AD-04: This decision does NOT mean the route is live, public users can use it, or documents can be processed.",
    "AD-05: A separate controlled internal runtime execution authorization is still required before any live execution.",
  ];

  const controlledInternalTestScope: string[] = [
    `CS-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A anonymous non-document questions only — no real documents, photos, scans, or uploads.`,
    "CS-02: Scope is limited to internal test design only; no runtime execution is authorized by this scope.",
    "CS-03: Scope excludes Paid Document Mode, Vaylo DNA runtime, entitlement runtime, and payment runtime.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_ACTIVATION}]: no runtime activation — this phase does not activate runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document, photo, OCR, and scanner input remain unauthorized.`,
    `NB-03 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this decision.`,
    "NB-04: no pilot, no production, no go-live authorization is granted by this decision.",
    "NB-05: no Paid Document Mode, no Vaylo DNA runtime authorization is granted by this decision.",
    "NB-06: no Evidence Gates seam activation is granted by this decision.",
    "NB-07: no exact legal deadline calculation and no trusted model output authorization is granted by this decision.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_INTERNAL_TEST_IMPL_PLAN}]: free-qa-internal-test-implementation-plan-required — the Vaylo team may now design the next implementation phase for an internal Free Q&A test.`,
    "FP-02: A future scoped runtime patch must be separately authorized before any live execution.",
    "FP-03: Any Evidence Gates seam enablement requires separate authorization.",
    "FP-04: A future post-activation audit is required after any runtime patch.",
    "FP-05: A future controlled internal runtime execution authorization is required before internal testers can execute the route.",
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01 [${SENTINEL_RUNTIME_ACTIVATION_BLOCKER}]: runtime-activation-unauthorized-global-blocker — controlled runtime execution remains unauthorized pending a future authorization phase.`,
    `GB-02 [${SENTINEL_DOCUMENT_MODE_BLOCKER}]: document-mode-unauthorized-global-blocker — text document mode runtime remains unauthorized globally.`,
    `GB-03 [${SENTINEL_PHOTO_OCR_BLOCKER}]: photo-ocr-runtime-unauthorized-global-blocker — photo and OCR runtime remains unauthorized globally.`,
    `GB-04 [${SENTINEL_SCANNER_BLOCKER}]: scanner-upload-unauthorized-global-blocker — scanner upload runtime remains unauthorized globally.`,
    "GB-05: paid-dna-runtime-unauthorized-global-blocker — Paid Document Mode and Vaylo DNA runtime remain unauthorized globally.",
    "GB-06: public-runtime-unauthorized-global-blocker — public runtime remains unauthorized globally.",
    "GB-07: production-go-live-unauthorized-global-blocker — production and go-live remain unauthorized globally.",
    "GB-08: seam-activation-unauthorized-global-blocker — Evidence Gates seam activation remains unauthorized.",
    "GB-09: payment-entitlement-runtime-unauthorized-global-blocker — payment and entitlement runtime remain unauthorized globally.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8F.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8F.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8F.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8F.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8F.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8F.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8F.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8F.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8F.)",
  ];

  const authorizationNotes: string[] = [
    "AN-01: 8.8F controlled internal test authorization decision issued for Free Smart Talk Q&A only.",
    `AN-02: 8.8E confirmed — checkId=${e.checkId}, allPassed=${e.allPassed}, readinessAuditStatus=${e.readinessAuditStatus}.`,
    `AN-03: Synthetic matrix inherited from 8.8E: ${e.allowedSyntheticCasesPassed}/${e.allowedSyntheticCaseCount} allowed, ${e.forbiddenSyntheticCasesBlocked}/${e.forbiddenSyntheticCaseCount} forbidden blocked, ${e.unsafeUnknownSyntheticCasesFailedClosed}/${e.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "AN-04: This is an authorization-decision-only phase; no runtime, route, or seam files were touched.",
    "AN-05: All runtime/public/document activation flags remain false after this decision.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_AUTHORIZATION_TAMPER_CASES.length;

  const provisional: FreeQaControlledInternalTestAuthorizationResult = {
    checkId: "8.8F",
    allPassed: true,
    controlledInternalTestAuthorizationOnly: true,
    freeQaControlledInternalTestAuthorizationFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaPostActivationReadinessAuditFileModified: false,
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
    importedOnlyFreeQaPostActivationReadinessAuditRunner: true,
    noOtherImportsUsed: true,
    freeQaPostActivationReadinessAuditRunnerCalled: true,
    freeQaPostActivationReadinessAuditCheckId: "8.8E",
    freeQaPostActivationReadinessAuditAllPassed: true,
    freeQaPostActivationReadinessAuditReadyForAuthorization: true,
    freeQaActivationTargetConfirmed: ACTIVATION_TARGET_E,
    readinessAuditStatusConfirmed: READINESS_AUDIT_STATUS_E,
    authorizationTarget: AUTHORIZATION_TARGET,
    controlledInternalTestAuthorizationStatus: AUTHORIZATION_STATUS,
    controlledInternalTestAuthorizationCreatedForFreeQaOnly: true,
    controlledInternalTestAuthorized: true,
    controlledInternalTestScopeConfirmed: true,
    controlledInternalTestDoesNotAuthorizeRuntimeActivation: true,
    controlledInternalTestDoesNotAuthorizePublicRuntime: true,
    controlledInternalTestDoesNotAuthorizePilot: true,
    controlledInternalTestDoesNotAuthorizeProduction: true,
    controlledInternalTestDoesNotAuthorizeGoLive: true,
    controlledInternalTestDoesNotAuthorizeDocuments: true,
    controlledInternalTestDoesNotAuthorizePhotoOcr: true,
    controlledInternalTestDoesNotAuthorizeScanner: true,
    controlledInternalTestDoesNotAuthorizePaidMode: true,
    controlledInternalTestDoesNotAuthorizeVayloDna: true,
    controlledInternalTestDoesNotAuthorizeExactLegalDeadlineCalculation: true,
    controlledInternalTestDoesNotAuthorizeTrustedModelOutput: true,
    allowedSyntheticCaseCount: e.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: e.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: e.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: e.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: e.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: e.unsafeUnknownSyntheticCasesFailedClosed,
    syntheticDryRunMatrixConfirmedPassing: true,
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
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    readyForFreeQaInternalTestImplementationPlan: true,
    readyForRuntimeActivation: false,
    readyForControlledInternalTestRuntimeExecution: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleDocumentOutput: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPublicRuntime: false,
    readyForPilot: false,
    readyForProduction: false,
    readyForGoLive: false,
    futureRuntimePatchRequired: true,
    futureSeamEnablementRequiresSeparateAuthorization: true,
    futurePostActivationAuditRequired: true,
    futureControlledInternalRuntimeExecutionAuthorizationRequired: true,
    claimRuleOrSemanticsDebtPreserved: true,
    evidenceRuleResolutionDebtPreserved: true,
    proximityManualOnlyDebtPreserved: true,
    trapKindTypingDebtPreserved: true,
    enforcementTrapHeuristicDebtPreserved: true,
    trapDispositionStateSeparationDebtPreserved: true,
    severityCandidateDerivationSeparationDebtPreserved: true,
    mapperDiagnosticTaxonomyDebtPreserved: true,
    td004ClosureDoesNotAuthorizeWiringDebtPreserved: true,
    freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8E: true,
    freeQaPostActivationReadinessAuditTamperCaseCount: e.freeQaPostActivationReadinessAuditTamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: e.freeQaPostActivationReadinessAuditTamperCasesRejected,
    freeQaSyntheticRuntimeActivationDryRunTamperConfirmedFrom8x8E: true,
    freeQaSyntheticRuntimeActivationDryRunTamperCaseCount: e.freeQaSyntheticRuntimeActivationDryRunTamperCaseCount,
    freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected: e.freeQaSyntheticRuntimeActivationDryRunTamperCasesRejected,
    freeQaControlledRuntimeActivationContractTamperConfirmedFrom8x8E: true,
    freeQaControlledRuntimeActivationContractTamperCaseCount: e.freeQaControlledRuntimeActivationContractTamperCaseCount,
    freeQaControlledRuntimeActivationContractTamperCasesRejected: e.freeQaControlledRuntimeActivationContractTamperCasesRejected,
    freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8E: true,
    freeQaControlledRuntimeActivationPlanTamperCaseCount: e.freeQaControlledRuntimeActivationPlanTamperCaseCount,
    freeQaControlledRuntimeActivationPlanTamperCasesRejected: e.freeQaControlledRuntimeActivationPlanTamperCasesRejected,
    governanceKernelConsolidationTamperConfirmedFrom8x8E: true,
    governanceKernelConsolidationTamperCaseCount: e.governanceKernelConsolidationTamperCaseCount,
    governanceKernelConsolidationTamperCasesRejected: e.governanceKernelConsolidationTamperCasesRejected,
    evidenceGatesClosureDecisionTamperConfirmedFrom8x8E: true,
    evidenceGatesClosureDecisionTamperCaseCount: e.evidenceGatesClosureDecisionTamperCaseCount,
    evidenceGatesClosureDecisionTamperCasesRejected: e.evidenceGatesClosureDecisionTamperCasesRejected,
    scopedWiringContainmentPatchTamperConfirmedFrom8x8E: true,
    scopedWiringContainmentPatchTamperCaseCount: e.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: e.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x8E: true,
    postWiringAuditTamperCaseCount: e.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: e.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x8E: true,
    dryRunSyntheticValidationCaseCount: e.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: e.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x8E: true,
    dryRunLeakageValidationCaseCount: e.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: e.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x8E: true,
    dryRunTamperCaseCount: e.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: e.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x8E: true,
    wiringExecutionContractTamperCaseCount: e.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: e.wiringExecutionContractTamperCasesRejected,
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
    authorizationDecision,
    controlledInternalTestScope,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    authorizationNotes,
    freeQaControlledInternalTestAuthorizationTamperCaseCount: tamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected: tamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaControlledInternalTestAuthorizationResult(provisional)) {
    authorizationFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8F tamper cases ─────────────────────────────────────────────
  let freeQaControlledInternalTestAuthorizationTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_AUTHORIZATION_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_AUTHORIZATION_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaControlledInternalTestAuthorizationResult(tc.mutate(provisional))) {
      freeQaControlledInternalTestAuthorizationTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8F tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) authorizationFailures.push(...tamperFailures);

  const allPassed =
    authorizationFailures.length === 0 &&
    freeQaControlledInternalTestAuthorizationTamperCasesRejected === tamperCaseCount;

  const finalAuthorizationNotes: string[] = [
    ...authorizationNotes,
    `8.8F tamper cases: ${freeQaControlledInternalTestAuthorizationTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(authorizationFailures.length > 0 ? [`FAILURES (${authorizationFailures.length}):`, ...authorizationFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected,
    authorizationNotes: finalAuthorizationNotes,
  };
}
