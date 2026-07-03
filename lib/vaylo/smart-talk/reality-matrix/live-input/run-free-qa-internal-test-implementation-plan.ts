/**
 * PHASE 8.8G — Free Q&A Internal Test Implementation Plan
 *
 * Implementation-plan-only phase. This phase plans the first controlled
 * internal Free Smart Talk Q&A test (anonymous, non-document questions).
 * It does NOT implement runtime, patch routes, enable any seam, or
 * authorize any form of runtime execution.
 *
 * This phase MUST NOT:
 * - Implement runtime or patch routes
 * - Enable any seam
 * - Modify, import, or execute runSmartTalk
 * - Process real user input or documents
 * - Call models
 *
 * Implementation plan decision:
 * - implementationPlanTarget: "free_smart_talk_qa_internal_test_implementation_plan_only"
 * - implementationPlanStatus: "planned_for_future_controlled_internal_runtime_execution_contract_only"
 * - internalTestImplementationPlanCreated: true
 *
 * This plan allows the NEXT phase to create a controlled internal runtime
 * execution contract. It does not authorize runtime execution, route
 * patching, public runtime, pilot, production, go-live, documents,
 * OCR/photo/scanner, paid mode, Vaylo DNA, or seam enablement.
 */

import { runFreeQaControlledInternalTestAuthorization } from "./run-free-qa-controlled-internal-test-authorization";

// ─── Literal types ────────────────────────────────────────────────────────────

type AuthorizationTargetF = "free_smart_talk_qa_controlled_internal_test_only";
type AuthorizationStatusF = "authorized_for_controlled_internal_test_phase_only";
type ImplementationPlanTarget88G = "free_smart_talk_qa_internal_test_implementation_plan_only";
type ImplementationPlanStatus88G = "planned_for_future_controlled_internal_runtime_execution_contract_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaInternalTestImplementationPlanResult {
  checkId: "8.8G";
  allPassed: boolean;
  internalTestImplementationPlanOnly: true;
  freeQaInternalTestImplementationPlanFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaControlledInternalTestAuthorizationFileModified: false;
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
  controlledInternalRuntimeExecutionPerformed: false;
  productionActivationPerformed: false;
  publicRuntimeActivationPerformed: false;
  seamActivationPerformed: false;
  documentRuntimeActivationPerformed: false;
  photoOcrRuntimeActivationPerformed: false;
  scannerRuntimeActivationPerformed: false;
  paidDocumentModeRuntimeActivationPerformed: false;
  vayloDnaRuntimeActivationPerformed: false;
  importedOnlyFreeQaControlledInternalTestAuthorizationRunner: true;
  noOtherImportsUsed: true;
  freeQaControlledInternalTestAuthorizationRunnerCalled: true;
  freeQaControlledInternalTestAuthorizationCheckId: "8.8F";
  freeQaControlledInternalTestAuthorizationAllPassed: true;
  freeQaControlledInternalTestAuthorizationConfirmed: true;
  freeQaControlledInternalTestAuthorizationTargetConfirmed: AuthorizationTargetF;
  controlledInternalTestAuthorizationStatusConfirmed: AuthorizationStatusF;
  implementationPlanTarget: ImplementationPlanTarget88G;
  implementationPlanStatus: ImplementationPlanStatus88G;
  internalTestImplementationPlanCreated: true;
  internalTestImplementationPlanCreatedForFreeQaOnly: true;
  plannedInternalTestScopeConfirmed: true;
  plannedAnonymousNonDocumentQuestionOnly: true;
  plannedDocumentInputBlocked: true;
  plannedPhotoOcrBlocked: true;
  plannedScannerBlocked: true;
  plannedPaidModeBlocked: true;
  plannedVayloDnaBlocked: true;
  plannedPublicRuntimeBlocked: true;
  plannedPilotBlocked: true;
  plannedProductionBlocked: true;
  plannedGoLiveBlocked: true;
  plannedExactLegalDeadlineCalculationBlocked: true;
  plannedTrustedModelOutputBlocked: true;
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
  controlledInternalRuntimeExecutionAuthorizedNow: false;
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  readyForFreeQaControlledInternalRuntimeExecutionContract: true;
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
  futureControlledInternalRuntimeExecutionContractRequired: true;
  futureMinimalRuntimePatchRequiresSeparateAuthorization: true;
  futureRouteWiringRequiresSeparateAuthorization: true;
  futureSeamEnablementRequiresSeparateAuthorization: true;
  futurePostWiringAuditRequired: true;
  futureFirstInternalTestRunRequiresSeparateAuthorization: true;
  claimRuleOrSemanticsDebtPreserved: true;
  evidenceRuleResolutionDebtPreserved: true;
  proximityManualOnlyDebtPreserved: true;
  trapKindTypingDebtPreserved: true;
  enforcementTrapHeuristicDebtPreserved: true;
  trapDispositionStateSeparationDebtPreserved: true;
  severityCandidateDerivationSeparationDebtPreserved: true;
  mapperDiagnosticTaxonomyDebtPreserved: true;
  td004ClosureDoesNotAuthorizeWiringDebtPreserved: true;
  freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8F: true;
  freeQaControlledInternalTestAuthorizationTamperCaseCount: number;
  freeQaControlledInternalTestAuthorizationTamperCasesRejected: number;
  freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8F: true;
  freeQaPostActivationReadinessAuditTamperCaseCount: number;
  freeQaPostActivationReadinessAuditTamperCasesRejected: number;
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
  implementationPlanDecision: string[];
  plannedInternalTestScope: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  implementationPlanNotes: string[];
  freeQaInternalTestImplementationPlanTamperCaseCount: number;
  freeQaInternalTestImplementationPlanTamperCasesRejected: number;
  freeQaInternalTestImplementationPlanTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const AUTHORIZATION_TARGET_F: AuthorizationTargetF = "free_smart_talk_qa_controlled_internal_test_only";
const AUTHORIZATION_STATUS_F: AuthorizationStatusF = "authorized_for_controlled_internal_test_phase_only";
const IMPLEMENTATION_PLAN_TARGET: ImplementationPlanTarget88G = "free_smart_talk_qa_internal_test_implementation_plan_only";
const IMPLEMENTATION_PLAN_STATUS: ImplementationPlanStatus88G = "planned_for_future_controlled_internal_runtime_execution_contract_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_PLAN_STATUS = "planned_for_future_controlled_internal_runtime_execution_contract_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_ANON_NON_DOC = "anonymous non-document questions only";
const SENTINEL_NO_RUNTIME_ACTIVATION = "no runtime activation";
const SENTINEL_NO_ROUTE_PATCHING = "no route patching";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_CONTRACT = "controlled internal runtime execution contract";
const SENTINEL_MINIMAL_PATCH = "minimal runtime patch requires separate authorization";
const SENTINEL_POST_WIRING_AUDIT = "post-wiring audit";
const SENTINEL_FIRST_TEST_RUN = "first internal test run requires separate authorization";
const SENTINEL_RUNTIME_ACTIVATION_BLOCKED = "runtime activation blocked";
const SENTINEL_DOCUMENT_MODE_BLOCKED = "document mode blocked";
const SENTINEL_PHOTO_OCR_BLOCKED = "photo/OCR blocked";
const SENTINEL_SCANNER_BLOCKED = "scanner blocked";
const SENTINEL_PUBLIC_RUNTIME_BLOCKED = "public runtime blocked";
const SENTINEL_PRODUCTION_BLOCKED = "production blocked";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics debt";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic debt";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaInternalTestImplementationPlanResult(
  r: FreeQaInternalTestImplementationPlanResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8G") return false;
  if (r.allPassed !== true) return false;
  if (r.internalTestImplementationPlanOnly !== true) return false;
  if (r.freeQaInternalTestImplementationPlanFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaControlledInternalTestAuthorizationFileModified !== false) return false;
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
  if (r.controlledInternalRuntimeExecutionPerformed !== false) return false;
  if (r.productionActivationPerformed !== false) return false;
  if (r.publicRuntimeActivationPerformed !== false) return false;
  if (r.seamActivationPerformed !== false) return false;
  if (r.documentRuntimeActivationPerformed !== false) return false;
  if (r.photoOcrRuntimeActivationPerformed !== false) return false;
  if (r.scannerRuntimeActivationPerformed !== false) return false;
  if (r.paidDocumentModeRuntimeActivationPerformed !== false) return false;
  if (r.vayloDnaRuntimeActivationPerformed !== false) return false;
  // Import/runner flags and 8.8F confirmations
  if (r.importedOnlyFreeQaControlledInternalTestAuthorizationRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationRunnerCalled !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationCheckId !== "8.8F") return false;
  if (r.freeQaControlledInternalTestAuthorizationAllPassed !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationConfirmed !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationTargetConfirmed !== AUTHORIZATION_TARGET_F) return false;
  if (r.controlledInternalTestAuthorizationStatusConfirmed !== AUTHORIZATION_STATUS_F) return false;
  // Implementation plan decision
  if (r.implementationPlanTarget !== IMPLEMENTATION_PLAN_TARGET) return false;
  if (r.implementationPlanStatus !== IMPLEMENTATION_PLAN_STATUS) return false;
  if (r.internalTestImplementationPlanCreated !== true) return false;
  if (r.internalTestImplementationPlanCreatedForFreeQaOnly !== true) return false;
  // Planned blocked scope flags
  if (r.plannedInternalTestScopeConfirmed !== true) return false;
  if (r.plannedAnonymousNonDocumentQuestionOnly !== true) return false;
  if (r.plannedDocumentInputBlocked !== true) return false;
  if (r.plannedPhotoOcrBlocked !== true) return false;
  if (r.plannedScannerBlocked !== true) return false;
  if (r.plannedPaidModeBlocked !== true) return false;
  if (r.plannedVayloDnaBlocked !== true) return false;
  if (r.plannedPublicRuntimeBlocked !== true) return false;
  if (r.plannedPilotBlocked !== true) return false;
  if (r.plannedProductionBlocked !== true) return false;
  if (r.plannedGoLiveBlocked !== true) return false;
  if (r.plannedExactLegalDeadlineCalculationBlocked !== true) return false;
  if (r.plannedTrustedModelOutputBlocked !== true) return false;
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
  if (r.controlledInternalRuntimeExecutionAuthorizedNow !== false) return false;
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Readiness for next steps
  if (r.readyForFreeQaControlledInternalRuntimeExecutionContract !== true) return false;
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
  if (r.futureControlledInternalRuntimeExecutionContractRequired !== true) return false;
  if (r.futureMinimalRuntimePatchRequiresSeparateAuthorization !== true) return false;
  if (r.futureRouteWiringRequiresSeparateAuthorization !== true) return false;
  if (r.futureSeamEnablementRequiresSeparateAuthorization !== true) return false;
  if (r.futurePostWiringAuditRequired !== true) return false;
  if (r.futureFirstInternalTestRunRequiresSeparateAuthorization !== true) return false;
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
  // Inherited 8.8F/8.8E tamper confirmations
  if (r.freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8F !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== r.freeQaControlledInternalTestAuthorizationTamperCaseCount) return false;
  if (r.freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8F !== true) return false;
  if (r.freeQaPostActivationReadinessAuditTamperCasesRejected !== r.freeQaPostActivationReadinessAuditTamperCaseCount) return false;
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
  if (!r.implementationPlanDecision || r.implementationPlanDecision.length === 0) return false;
  if (!r.plannedInternalTestScope || r.plannedInternalTestScope.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.implementationPlanNotes || r.implementationPlanNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.implementationPlanDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_PLAN_STATUS)) return false;
  const scopeJ = r.plannedInternalTestScope.join(" ");
  if (!scopeJ.includes(SENTINEL_FREE_QA_SCOPE)) return false;
  if (!scopeJ.includes(SENTINEL_ANON_NON_DOC)) return false;
  const boundariesJ = r.nonAuthorizationBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_NO_RUNTIME_ACTIVATION)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_PATCHING)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_CONTRACT)) return false;
  if (!futureJ.includes(SENTINEL_MINIMAL_PATCH)) return false;
  if (!futureJ.includes(SENTINEL_POST_WIRING_AUDIT)) return false;
  if (!futureJ.includes(SENTINEL_FIRST_TEST_RUN)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_ACTIVATION_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_BLOCKED)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Own tamper coverage
  if (r.freeQaInternalTestImplementationPlanTamperCasesRejected !== r.freeQaInternalTestImplementationPlanTamperCaseCount) return false;
  if (r.freeQaInternalTestImplementationPlanTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88GMutation = (
  r: FreeQaInternalTestImplementationPlanResult,
) => FreeQaInternalTestImplementationPlanResult;
interface Tamper88GCase { label: string; mutate: Tamper88GMutation; }

const FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES: Tamper88GCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8F" as "8.8G" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "internalTestImplementationPlanOnly false", mutate: (r) => ({ ...r, internalTestImplementationPlanOnly: false as true }) },
  { label: "freeQaInternalTestImplementationPlanFileCreated false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaControlledInternalTestAuthorizationFileModified true", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationFileModified: true as false }) },
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
  { label: "controlledInternalRuntimeExecutionPerformed true", mutate: (r) => ({ ...r, controlledInternalRuntimeExecutionPerformed: true as false }) },
  { label: "productionActivationPerformed true", mutate: (r) => ({ ...r, productionActivationPerformed: true as false }) },
  { label: "publicRuntimeActivationPerformed true", mutate: (r) => ({ ...r, publicRuntimeActivationPerformed: true as false }) },
  { label: "seamActivationPerformed true", mutate: (r) => ({ ...r, seamActivationPerformed: true as false }) },
  { label: "documentRuntimeActivationPerformed true", mutate: (r) => ({ ...r, documentRuntimeActivationPerformed: true as false }) },
  { label: "photoOcrRuntimeActivationPerformed true", mutate: (r) => ({ ...r, photoOcrRuntimeActivationPerformed: true as false }) },
  { label: "scannerRuntimeActivationPerformed true", mutate: (r) => ({ ...r, scannerRuntimeActivationPerformed: true as false }) },
  { label: "paidDocumentModeRuntimeActivationPerformed true", mutate: (r) => ({ ...r, paidDocumentModeRuntimeActivationPerformed: true as false }) },
  { label: "vayloDnaRuntimeActivationPerformed true", mutate: (r) => ({ ...r, vayloDnaRuntimeActivationPerformed: true as false }) },
  // Import/runner flags and 8.8F confirmations
  { label: "importedOnlyFreeQaControlledInternalTestAuthorizationRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaControlledInternalTestAuthorizationRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationRunnerCalled false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationRunnerCalled: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationCheckId wrong", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationCheckId: "8.8E" as "8.8F" }) },
  { label: "freeQaControlledInternalTestAuthorizationAllPassed false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationAllPassed: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationConfirmed false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationConfirmed: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTargetConfirmed: "public_runtime" as AuthorizationTargetF }) },
  { label: "controlledInternalTestAuthorizationStatusConfirmed wrong", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationStatusConfirmed: "unauthorized" as AuthorizationStatusF }) },
  // Implementation plan decision
  { label: "implementationPlanTarget wrong", mutate: (r) => ({ ...r, implementationPlanTarget: "public_runtime_plan" as ImplementationPlanTarget88G }) },
  { label: "implementationPlanStatus wrong", mutate: (r) => ({ ...r, implementationPlanStatus: "unauthorized" as ImplementationPlanStatus88G }) },
  { label: "internalTestImplementationPlanCreated false", mutate: (r) => ({ ...r, internalTestImplementationPlanCreated: false as true }) },
  { label: "internalTestImplementationPlanCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, internalTestImplementationPlanCreatedForFreeQaOnly: false as true }) },
  // Planned blocked scope flags
  { label: "plannedInternalTestScopeConfirmed false", mutate: (r) => ({ ...r, plannedInternalTestScopeConfirmed: false as true }) },
  { label: "plannedAnonymousNonDocumentQuestionOnly false", mutate: (r) => ({ ...r, plannedAnonymousNonDocumentQuestionOnly: false as true }) },
  { label: "plannedDocumentInputBlocked false", mutate: (r) => ({ ...r, plannedDocumentInputBlocked: false as true }) },
  { label: "plannedPhotoOcrBlocked false", mutate: (r) => ({ ...r, plannedPhotoOcrBlocked: false as true }) },
  { label: "plannedScannerBlocked false", mutate: (r) => ({ ...r, plannedScannerBlocked: false as true }) },
  { label: "plannedPaidModeBlocked false", mutate: (r) => ({ ...r, plannedPaidModeBlocked: false as true }) },
  { label: "plannedVayloDnaBlocked false", mutate: (r) => ({ ...r, plannedVayloDnaBlocked: false as true }) },
  { label: "plannedPublicRuntimeBlocked false", mutate: (r) => ({ ...r, plannedPublicRuntimeBlocked: false as true }) },
  { label: "plannedPilotBlocked false", mutate: (r) => ({ ...r, plannedPilotBlocked: false as true }) },
  { label: "plannedProductionBlocked false", mutate: (r) => ({ ...r, plannedProductionBlocked: false as true }) },
  { label: "plannedGoLiveBlocked false", mutate: (r) => ({ ...r, plannedGoLiveBlocked: false as true }) },
  { label: "plannedExactLegalDeadlineCalculationBlocked false", mutate: (r) => ({ ...r, plannedExactLegalDeadlineCalculationBlocked: false as true }) },
  { label: "plannedTrustedModelOutputBlocked false", mutate: (r) => ({ ...r, plannedTrustedModelOutputBlocked: false as true }) },
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
  { label: "controlledInternalRuntimeExecutionAuthorizedNow true", mutate: (r) => ({ ...r, controlledInternalRuntimeExecutionAuthorizedNow: true as false }) },
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Readiness for next steps
  { label: "readyForFreeQaControlledInternalRuntimeExecutionContract false", mutate: (r) => ({ ...r, readyForFreeQaControlledInternalRuntimeExecutionContract: false as true }) },
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
  { label: "futureControlledInternalRuntimeExecutionContractRequired false", mutate: (r) => ({ ...r, futureControlledInternalRuntimeExecutionContractRequired: false as true }) },
  { label: "futureMinimalRuntimePatchRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureMinimalRuntimePatchRequiresSeparateAuthorization: false as true }) },
  { label: "futureRouteWiringRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureRouteWiringRequiresSeparateAuthorization: false as true }) },
  { label: "futureSeamEnablementRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureSeamEnablementRequiresSeparateAuthorization: false as true }) },
  { label: "futurePostWiringAuditRequired false", mutate: (r) => ({ ...r, futurePostWiringAuditRequired: false as true }) },
  { label: "futureFirstInternalTestRunRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureFirstInternalTestRunRequiresSeparateAuthorization: false as true }) },
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
  // Inherited 8.8F/8.8E tamper confirmations
  { label: "freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8F false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8F: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCasesRejected: r.freeQaControlledInternalTestAuthorizationTamperCasesRejected - 1 }) },
  { label: "freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8F false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8F: false as true }) },
  { label: "freeQaPostActivationReadinessAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperCasesRejected: r.freeQaPostActivationReadinessAuditTamperCasesRejected - 1 }) },
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
  { label: "implementationPlanDecision empty", mutate: (r) => ({ ...r, implementationPlanDecision: [] }) },
  { label: "plannedInternalTestScope empty", mutate: (r) => ({ ...r, plannedInternalTestScope: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "implementationPlanNotes empty", mutate: (r) => ({ ...r, implementationPlanNotes: [] }) },
  // Array sentinel checks
  { label: "implementationPlanDecision missing planned_for_future_controlled_internal_runtime_execution_contract_only sentinel", mutate: (r) => ({ ...r, implementationPlanDecision: r.implementationPlanDecision.map((s) => s.split(SENTINEL_PLAN_STATUS).join("omitted")) }) },
  { label: "plannedInternalTestScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, plannedInternalTestScope: r.plannedInternalTestScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "plannedInternalTestScope missing anonymous non-document questions only sentinel", mutate: (r) => ({ ...r, plannedInternalTestScope: r.plannedInternalTestScope.map((s) => s.split(SENTINEL_ANON_NON_DOC).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime activation sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_ACTIVATION).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route patching sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_PATCHING).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing controlled internal runtime execution contract sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_CONTRACT).join("omitted")) }) },
  { label: "futureRequiredPhases missing minimal runtime patch requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_MINIMAL_PATCH).join("omitted")) }) },
  { label: "futureRequiredPhases missing post-wiring audit sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_POST_WIRING_AUDIT).join("omitted")) }) },
  { label: "futureRequiredPhases missing first internal test run requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_FIRST_TEST_RUN).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime activation blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_ACTIVATION_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing public runtime blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing production blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PRODUCTION_BLOCKED).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Own tamper coverage self-checks
  { label: "freeQaInternalTestImplementationPlanTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperCoveragePassing: false as true }) },
  { label: "freeQaInternalTestImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperCasesRejected: r.freeQaInternalTestImplementationPlanTamperCasesRejected - 1 }) },
];

// ─── Exported implementation plan runner ──────────────────────────────────────

/**
 * Free Smart Talk Q&A Internal Test Implementation Plan runner for 8.8G.
 *
 * Calls the 8.8F Controlled Internal Test Authorization runner as source of
 * truth. Plans the first controlled internal Free Smart Talk Q&A test
 * (anonymous, non-document questions). Does NOT implement runtime, patch
 * routes, or enable any seam.
 */
export function runFreeQaInternalTestImplementationPlan(): FreeQaInternalTestImplementationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.8F Controlled Internal Test Authorization runner as source of truth ──
  const f = runFreeQaControlledInternalTestAuthorization();

  if (f.checkId !== "8.8F") planFailures.push(`8.8F checkId mismatch: expected "8.8F", got "${f.checkId}"`);
  if (f.allPassed !== true) planFailures.push("8.8F allPassed is not true");
  if (f.authorizationTarget !== AUTHORIZATION_TARGET_F) planFailures.push(`8.8F authorizationTarget mismatch: expected "${AUTHORIZATION_TARGET_F}", got "${f.authorizationTarget}"`);
  if (f.controlledInternalTestAuthorizationStatus !== AUTHORIZATION_STATUS_F) planFailures.push(`8.8F controlledInternalTestAuthorizationStatus mismatch: expected "${AUTHORIZATION_STATUS_F}", got "${f.controlledInternalTestAuthorizationStatus}"`);
  if (f.controlledInternalTestAuthorized !== true) planFailures.push("8.8F controlledInternalTestAuthorized is not true");
  if (f.readyForFreeQaInternalTestImplementationPlan !== true) planFailures.push("8.8F readyForFreeQaInternalTestImplementationPlan is not true");
  if (f.readyForRuntimeActivation !== false) planFailures.push("8.8F readyForRuntimeActivation is not false");
  if (f.readyForControlledInternalTestRuntimeExecution !== false) planFailures.push("8.8F readyForControlledInternalTestRuntimeExecution is not false");
  if (f.allowedSyntheticCasesPassed !== f.allowedSyntheticCaseCount) planFailures.push(`8.8F allowed cases: ${f.allowedSyntheticCasesPassed}/${f.allowedSyntheticCaseCount}`);
  if (f.forbiddenSyntheticCasesBlocked !== f.forbiddenSyntheticCaseCount) planFailures.push(`8.8F forbidden cases: ${f.forbiddenSyntheticCasesBlocked}/${f.forbiddenSyntheticCaseCount}`);
  if (f.unsafeUnknownSyntheticCasesFailedClosed !== f.unsafeUnknownSyntheticCaseCount) planFailures.push(`8.8F unsafe/unknown cases: ${f.unsafeUnknownSyntheticCasesFailedClosed}/${f.unsafeUnknownSyntheticCaseCount}`);
  if (f.runtimeActivationPerformed !== false) planFailures.push("8.8F runtimeActivationPerformed is not false");
  if (f.seamActivationPerformed !== false) planFailures.push("8.8F seamActivationPerformed is not false");
  if (f.documentRuntimeActivationPerformed !== false) planFailures.push("8.8F documentRuntimeActivationPerformed is not false");
  if (f.photoOcrRuntimeActivationPerformed !== false) planFailures.push("8.8F photoOcrRuntimeActivationPerformed is not false");
  if (f.scannerRuntimeActivationPerformed !== false) planFailures.push("8.8F scannerRuntimeActivationPerformed is not false");
  if (f.paidDocumentModeRuntimeActivationPerformed !== false) planFailures.push("8.8F paidDocumentModeRuntimeActivationPerformed is not false");
  if (f.vayloDnaRuntimeActivationPerformed !== false) planFailures.push("8.8F vayloDnaRuntimeActivationPerformed is not false");
  if (f.realDocumentInputAuthorizedNow !== false) planFailures.push("8.8F realDocumentInputAuthorizedNow is not false");
  if (f.userVisibleOutputAuthorizedNow !== false) planFailures.push("8.8F userVisibleOutputAuthorizedNow is not false");
  if (f.publicRuntimeAuthorizedNow !== false) planFailures.push("8.8F publicRuntimeAuthorizedNow is not false");
  if (f.modelFacingUseAuthorizedNow !== false) planFailures.push("8.8F modelFacingUseAuthorizedNow is not false");
  if (f.evidenceGateExecutionAuthorizedNow !== false) planFailures.push("8.8F evidenceGateExecutionAuthorizedNow is not false");
  if (f.claimAuthorizationAuthorizedNow !== false) planFailures.push("8.8F claimAuthorizationAuthorizedNow is not false");
  if (f.exactDeadlineCalculationAuthorized !== false) planFailures.push("8.8F exactDeadlineCalculationAuthorized is not false");
  if (f.paymentRuntimeAuthorizedNow !== false) planFailures.push("8.8F paymentRuntimeAuthorizedNow is not false");
  if (f.entitlementRuntimeAuthorizedNow !== false) planFailures.push("8.8F entitlementRuntimeAuthorizedNow is not false");
  if (f.checkoutRuntimeAuthorizedNow !== false) planFailures.push("8.8F checkoutRuntimeAuthorizedNow is not false");
  if (f.pilotAuthorizationGranted !== false) planFailures.push("8.8F pilotAuthorizationGranted is not false");
  if (f.productionAuthorizationGranted !== false) planFailures.push("8.8F productionAuthorizationGranted is not false");
  if (f.goLiveAuthorizationGranted !== false) planFailures.push("8.8F goLiveAuthorizationGranted is not false");
  if (f.seamActivationAuthorizedNow !== false) planFailures.push("8.8F seamActivationAuthorizedNow is not false");
  if (f.controlledRuntimeActivationAuthorizedNow !== false) planFailures.push("8.8F controlledRuntimeActivationAuthorizedNow is not false");
  if (f.documentRuntimeAuthorizedNow !== false) planFailures.push("8.8F documentRuntimeAuthorizedNow is not false");
  if (f.photoOcrRuntimeAuthorizedNow !== false) planFailures.push("8.8F photoOcrRuntimeAuthorizedNow is not false");
  if (f.scannerUploadAuthorizedNow !== false) planFailures.push("8.8F scannerUploadAuthorizedNow is not false");
  if (f.vayloDnaRuntimeAuthorizedNow !== false) planFailures.push("8.8F vayloDnaRuntimeAuthorizedNow is not false");
  if (f.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== f.freeQaControlledInternalTestAuthorizationTamperCaseCount) planFailures.push("8.8F own tamper count mismatch");
  if (f.freeQaPostActivationReadinessAuditTamperCasesRejected !== f.freeQaPostActivationReadinessAuditTamperCaseCount) planFailures.push("8.8F inherited 8.8E tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const implementationPlanDecision: string[] = [
    `PD-01 [${SENTINEL_PLAN_STATUS}]: planned_for_future_controlled_internal_runtime_execution_contract_only — the first controlled internal Free Smart Talk Q&A test is now planned at the implementation-plan level only.`,
    "PD-02: This plan allows the NEXT phase to create a controlled internal runtime execution contract.",
    "PD-03: This plan does NOT authorize runtime execution, route patching, or seam enablement.",
    "PD-04: A separate authorization is required before any minimal runtime patch, route wiring, or first internal test run.",
  ];

  const plannedInternalTestScope: string[] = [
    `PS-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A — ${SENTINEL_ANON_NON_DOC} — the planned internal test is limited to anonymous non-document questions only.`,
    "PS-02: Planned scope excludes real documents, photos, scans, or uploads of any kind.",
    "PS-03: Planned scope excludes Paid Document Mode, Vaylo DNA runtime, payment runtime, and entitlement runtime.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_ACTIVATION}]: no runtime activation — this plan does not activate runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_ROUTE_PATCHING}]: no route patching — this plan does not patch or wire any route file.`,
    `NB-03 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document, photo, OCR, and scanner input remain unauthorized by this plan.`,
    `NB-04 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this plan.`,
    "NB-05: no pilot, no production, no go-live authorization is granted by this plan.",
    "NB-06: no Evidence Gates seam enablement is granted by this plan.",
    "NB-07: no exact legal deadline calculation and no trusted model output authorization is granted by this plan.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_CONTRACT}]: free-qa-controlled-internal-runtime-execution-contract-required — the next phase may create a controlled internal runtime execution contract.`,
    `FP-02 [${SENTINEL_MINIMAL_PATCH}]: minimal runtime patch requires separate authorization — any minimal route/runtime patch for internal testing needs its own authorization.`,
    "FP-03: Future route wiring requires separate authorization before any route file is touched.",
    "FP-04: Future Evidence Gates seam enablement requires separate authorization.",
    `FP-05 [${SENTINEL_POST_WIRING_AUDIT}]: post-wiring audit — a post-wiring audit is required after any future runtime patch.`,
    `FP-06 [${SENTINEL_FIRST_TEST_RUN}]: first internal test run requires separate authorization — the first actual internal test execution needs its own authorization.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01: ${SENTINEL_RUNTIME_ACTIVATION_BLOCKED} — controlled runtime execution remains globally blocked pending a future authorization contract.`,
    `GB-02: ${SENTINEL_DOCUMENT_MODE_BLOCKED} — text document mode runtime remains globally blocked.`,
    `GB-03: ${SENTINEL_PHOTO_OCR_BLOCKED} — photo and OCR runtime remains globally blocked.`,
    `GB-04: ${SENTINEL_SCANNER_BLOCKED} — scanner upload runtime remains globally blocked.`,
    `GB-05: ${SENTINEL_PUBLIC_RUNTIME_BLOCKED} — public runtime remains globally blocked.`,
    `GB-06: ${SENTINEL_PRODUCTION_BLOCKED} — production and go-live remain globally blocked.`,
    "GB-07: paid mode and Vaylo DNA runtime remain globally blocked.",
    "GB-08: Evidence Gates seam activation remains globally blocked.",
    "GB-09: payment and entitlement runtime remain globally blocked.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01: ${SENTINEL_CLAIM_RULE_OR} — ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8G.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8G.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8G.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8G.)",
    `GD-05: ${SENTINEL_TRAP_HEURISTIC} — enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8G.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8G.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8G.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8G.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8G.)",
  ];

  const implementationPlanNotes: string[] = [
    "IN-01: 8.8G implementation plan created for Free Smart Talk Q&A internal test only.",
    `IN-02: 8.8F confirmed — checkId=${f.checkId}, allPassed=${f.allPassed}, authorizationTarget=${f.authorizationTarget}.`,
    `IN-03: Synthetic matrix inherited via 8.8F: ${f.allowedSyntheticCasesPassed}/${f.allowedSyntheticCaseCount} allowed, ${f.forbiddenSyntheticCasesBlocked}/${f.forbiddenSyntheticCaseCount} forbidden blocked, ${f.unsafeUnknownSyntheticCasesFailedClosed}/${f.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "IN-04: This is an implementation-plan-only phase; no runtime, route, or seam files were touched.",
    "IN-05: All runtime/public/document activation flags remain false after this plan.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES.length;

  const provisional: FreeQaInternalTestImplementationPlanResult = {
    checkId: "8.8G",
    allPassed: true,
    internalTestImplementationPlanOnly: true,
    freeQaInternalTestImplementationPlanFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaControlledInternalTestAuthorizationFileModified: false,
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
    controlledInternalRuntimeExecutionPerformed: false,
    productionActivationPerformed: false,
    publicRuntimeActivationPerformed: false,
    seamActivationPerformed: false,
    documentRuntimeActivationPerformed: false,
    photoOcrRuntimeActivationPerformed: false,
    scannerRuntimeActivationPerformed: false,
    paidDocumentModeRuntimeActivationPerformed: false,
    vayloDnaRuntimeActivationPerformed: false,
    importedOnlyFreeQaControlledInternalTestAuthorizationRunner: true,
    noOtherImportsUsed: true,
    freeQaControlledInternalTestAuthorizationRunnerCalled: true,
    freeQaControlledInternalTestAuthorizationCheckId: "8.8F",
    freeQaControlledInternalTestAuthorizationAllPassed: true,
    freeQaControlledInternalTestAuthorizationConfirmed: true,
    freeQaControlledInternalTestAuthorizationTargetConfirmed: AUTHORIZATION_TARGET_F,
    controlledInternalTestAuthorizationStatusConfirmed: AUTHORIZATION_STATUS_F,
    implementationPlanTarget: IMPLEMENTATION_PLAN_TARGET,
    implementationPlanStatus: IMPLEMENTATION_PLAN_STATUS,
    internalTestImplementationPlanCreated: true,
    internalTestImplementationPlanCreatedForFreeQaOnly: true,
    plannedInternalTestScopeConfirmed: true,
    plannedAnonymousNonDocumentQuestionOnly: true,
    plannedDocumentInputBlocked: true,
    plannedPhotoOcrBlocked: true,
    plannedScannerBlocked: true,
    plannedPaidModeBlocked: true,
    plannedVayloDnaBlocked: true,
    plannedPublicRuntimeBlocked: true,
    plannedPilotBlocked: true,
    plannedProductionBlocked: true,
    plannedGoLiveBlocked: true,
    plannedExactLegalDeadlineCalculationBlocked: true,
    plannedTrustedModelOutputBlocked: true,
    allowedSyntheticCaseCount: f.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: f.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: f.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: f.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: f.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: f.unsafeUnknownSyntheticCasesFailedClosed,
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
    controlledInternalRuntimeExecutionAuthorizedNow: false,
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    readyForFreeQaControlledInternalRuntimeExecutionContract: true,
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
    futureControlledInternalRuntimeExecutionContractRequired: true,
    futureMinimalRuntimePatchRequiresSeparateAuthorization: true,
    futureRouteWiringRequiresSeparateAuthorization: true,
    futureSeamEnablementRequiresSeparateAuthorization: true,
    futurePostWiringAuditRequired: true,
    futureFirstInternalTestRunRequiresSeparateAuthorization: true,
    claimRuleOrSemanticsDebtPreserved: true,
    evidenceRuleResolutionDebtPreserved: true,
    proximityManualOnlyDebtPreserved: true,
    trapKindTypingDebtPreserved: true,
    enforcementTrapHeuristicDebtPreserved: true,
    trapDispositionStateSeparationDebtPreserved: true,
    severityCandidateDerivationSeparationDebtPreserved: true,
    mapperDiagnosticTaxonomyDebtPreserved: true,
    td004ClosureDoesNotAuthorizeWiringDebtPreserved: true,
    freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8F: true,
    freeQaControlledInternalTestAuthorizationTamperCaseCount: f.freeQaControlledInternalTestAuthorizationTamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected: f.freeQaControlledInternalTestAuthorizationTamperCasesRejected,
    freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8F: true,
    freeQaPostActivationReadinessAuditTamperCaseCount: f.freeQaPostActivationReadinessAuditTamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: f.freeQaPostActivationReadinessAuditTamperCasesRejected,
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
    implementationPlanDecision,
    plannedInternalTestScope,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    implementationPlanNotes,
    freeQaInternalTestImplementationPlanTamperCaseCount: tamperCaseCount,
    freeQaInternalTestImplementationPlanTamperCasesRejected: tamperCaseCount,
    freeQaInternalTestImplementationPlanTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaInternalTestImplementationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8G tamper cases ─────────────────────────────────────────────
  let freeQaInternalTestImplementationPlanTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaInternalTestImplementationPlanResult(tc.mutate(provisional))) {
      freeQaInternalTestImplementationPlanTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8G tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed =
    planFailures.length === 0 &&
    freeQaInternalTestImplementationPlanTamperCasesRejected === tamperCaseCount;

  const finalImplementationPlanNotes: string[] = [
    ...implementationPlanNotes,
    `8.8G tamper cases: ${freeQaInternalTestImplementationPlanTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaInternalTestImplementationPlanTamperCasesRejected,
    implementationPlanNotes: finalImplementationPlanNotes,
  };
}
