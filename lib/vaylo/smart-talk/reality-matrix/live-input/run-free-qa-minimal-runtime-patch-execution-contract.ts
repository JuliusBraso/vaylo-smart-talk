/**
 * PHASE 8.8J — Free Q&A Minimal Runtime Patch Execution Contract
 *
 * Execution-contract-only phase. This phase defines the CONTRACT for a
 * future minimal runtime patch execution phase for Free Smart Talk Q&A
 * (anonymous, non-document questions, controlled internal test only). It
 * does NOT implement the patch, patch or wire routes, enable runtime, or
 * enable the Evidence Gates seam.
 *
 * This phase MUST NOT:
 * - Implement the patch, patch routes, or wire routes
 * - Enable runtime or the Evidence Gates seam
 * - Execute controlled internal runtime
 * - Modify, import, or execute runSmartTalk
 * - Process real user input or documents
 * - Call models
 *
 * Execution contract decision:
 * - executionContractTarget: "free_smart_talk_qa_minimal_runtime_patch_execution_contract_only"
 * - executionContractStatus: "contract_ready_for_future_scoped_runtime_patch_implementation_plan_only"
 * - minimalRuntimePatchExecutionContractCreated: true
 *
 * This contract allows the NEXT phase to create a scoped runtime patch
 * implementation plan. It does not implement the patch or authorize route
 * patching, route wiring, seam enablement, public runtime, pilot,
 * production, go-live, documents, OCR/photo/scanner, paid mode, Vaylo DNA,
 * exact legal deadline calculation, or trusted model output now.
 */

import { runFreeQaMinimalRuntimePatchAuthorizationPlan } from "./run-free-qa-minimal-runtime-patch-authorization-plan";

// ─── Literal types ────────────────────────────────────────────────────────────

type AuthorizationPlanTargetI = "free_smart_talk_qa_minimal_runtime_patch_authorization_plan_only";
type AuthorizationPlanStatusI = "planned_for_future_scoped_minimal_runtime_patch_only";
type ExecutionContractTarget88J = "free_smart_talk_qa_minimal_runtime_patch_execution_contract_only";
type ExecutionContractStatus88J = "contract_ready_for_future_scoped_runtime_patch_implementation_plan_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaMinimalRuntimePatchExecutionContractResult {
  checkId: "8.8J";
  allPassed: boolean;
  minimalRuntimePatchExecutionContractOnly: true;
  freeQaMinimalRuntimePatchExecutionContractFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaMinimalRuntimePatchAuthorizationPlanFileModified: false;
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
  minimalRuntimePatchPerformed: false;
  productionActivationPerformed: false;
  publicRuntimeActivationPerformed: false;
  seamActivationPerformed: false;
  documentRuntimeActivationPerformed: false;
  photoOcrRuntimeActivationPerformed: false;
  scannerRuntimeActivationPerformed: false;
  paidDocumentModeRuntimeActivationPerformed: false;
  vayloDnaRuntimeActivationPerformed: false;
  importedOnlyFreeQaMinimalRuntimePatchAuthorizationPlanRunner: true;
  noOtherImportsUsed: true;
  freeQaMinimalRuntimePatchAuthorizationPlanRunnerCalled: true;
  freeQaMinimalRuntimePatchAuthorizationPlanCheckId: "8.8I";
  freeQaMinimalRuntimePatchAuthorizationPlanAllPassed: true;
  freeQaMinimalRuntimePatchAuthorizationPlanConfirmed: true;
  freeQaMinimalRuntimePatchAuthorizationPlanTargetConfirmed: AuthorizationPlanTargetI;
  freeQaMinimalRuntimePatchAuthorizationPlanStatusConfirmed: AuthorizationPlanStatusI;
  executionContractTarget: ExecutionContractTarget88J;
  executionContractStatus: ExecutionContractStatus88J;
  minimalRuntimePatchExecutionContractCreated: true;
  minimalRuntimePatchExecutionContractCreatedForFreeQaOnly: true;
  executionContractScopeConfirmed: true;
  executionContractAnonymousNonDocumentQuestionOnly: true;
  executionContractControlledInternalOnly: true;
  executionContractNoPublicUsers: true;
  executionContractDoesNotAuthorizeRuntimeExecutionNow: true;
  executionContractDoesNotAuthorizeRoutePatchingNow: true;
  executionContractDoesNotAuthorizeRouteWiringNow: true;
  executionContractDoesNotAuthorizeSeamEnablementNow: true;
  executionContractDocumentInputBlocked: true;
  executionContractDocumentLikeTextBlocked: true;
  executionContractPhotoOcrBlocked: true;
  executionContractScannerBlocked: true;
  executionContractUploadBlocked: true;
  executionContractPaidModeBlocked: true;
  executionContractVayloDnaBlocked: true;
  executionContractPersistenceBlocked: true;
  executionContractExactLegalDeadlineCalculationBlocked: true;
  executionContractTrustedModelOutputBlocked: true;
  executionContractPublicRuntimeBlocked: true;
  executionContractPilotBlocked: true;
  executionContractProductionBlocked: true;
  executionContractGoLiveBlocked: true;
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
  minimalRuntimePatchAuthorizedNow: false;
  routePatchingAuthorizedNow: false;
  routeWiringAuthorizedNow: false;
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  readyForFreeQaScopedRuntimePatchImplementationPlan: true;
  readyForRuntimeActivation: false;
  readyForControlledInternalTestRuntimeExecution: false;
  readyForMinimalRuntimePatchExecution: false;
  readyForRoutePatching: false;
  readyForRouteWiring: false;
  readyForRealDocumentInput: false;
  readyForUserVisibleDocumentOutput: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPublicRuntime: false;
  readyForPilot: false;
  readyForProduction: false;
  readyForGoLive: false;
  futureScopedRuntimePatchImplementationPlanRequired: true;
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
  freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8I: true;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount: number;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: number;
  freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8I: true;
  freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: number;
  freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: number;
  freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8I: true;
  freeQaInternalTestImplementationPlanTamperCaseCount: number;
  freeQaInternalTestImplementationPlanTamperCasesRejected: number;
  freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8I: true;
  freeQaControlledInternalTestAuthorizationTamperCaseCount: number;
  freeQaControlledInternalTestAuthorizationTamperCasesRejected: number;
  freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8I: true;
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
  executionContractDecision: string[];
  executionContractScope: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  executionContractNotes: string[];
  freeQaMinimalRuntimePatchExecutionContractTamperCaseCount: number;
  freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected: number;
  freeQaMinimalRuntimePatchExecutionContractTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const AUTHORIZATION_PLAN_TARGET_I: AuthorizationPlanTargetI = "free_smart_talk_qa_minimal_runtime_patch_authorization_plan_only";
const AUTHORIZATION_PLAN_STATUS_I: AuthorizationPlanStatusI = "planned_for_future_scoped_minimal_runtime_patch_only";
const EXECUTION_CONTRACT_TARGET: ExecutionContractTarget88J = "free_smart_talk_qa_minimal_runtime_patch_execution_contract_only";
const EXECUTION_CONTRACT_STATUS: ExecutionContractStatus88J = "contract_ready_for_future_scoped_runtime_patch_implementation_plan_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_CONTRACT_STATUS = "contract_ready_for_future_scoped_runtime_patch_implementation_plan_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_ANON_NON_DOC = "anonymous non-document questions only";
const SENTINEL_CONTROLLED_INTERNAL_ONLY = "controlled internal test only";
const SENTINEL_NO_RUNTIME_EXEC_NOW = "no runtime execution now";
const SENTINEL_NO_ROUTE_PATCHING_NOW = "no route patching now";
const SENTINEL_NO_ROUTE_WIRING_NOW = "no route wiring now";
const SENTINEL_NO_SEAM_ENABLEMENT_NOW = "no seam enablement now";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_SCOPED_PATCH_IMPL_PLAN = "scoped runtime patch implementation plan";
const SENTINEL_MIN_PATCH_SEP_AUTH = "minimal runtime patch requires separate authorization";
const SENTINEL_ROUTE_WIRING_SEP_AUTH = "route wiring requires separate authorization";
const SENTINEL_POST_WIRING_AUDIT = "post-wiring audit";
const SENTINEL_FIRST_TEST_RUN_SEP_AUTH = "first internal test run requires separate authorization";
const SENTINEL_RUNTIME_EXEC_BLOCKED = "runtime execution blocked";
const SENTINEL_ROUTE_PATCHING_BLOCKED = "route patching blocked";
const SENTINEL_ROUTE_WIRING_BLOCKED = "route wiring blocked";
const SENTINEL_SEAM_ACTIVATION_BLOCKED = "seam activation blocked";
const SENTINEL_DOCUMENT_MODE_BLOCKED = "document mode blocked";
const SENTINEL_PHOTO_OCR_BLOCKED = "photo/OCR blocked";
const SENTINEL_SCANNER_BLOCKED = "scanner blocked";
const SENTINEL_PUBLIC_RUNTIME_BLOCKED = "public runtime blocked";
const SENTINEL_PRODUCTION_BLOCKED = "production blocked";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics debt";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic debt";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaMinimalRuntimePatchExecutionContractResult(
  r: FreeQaMinimalRuntimePatchExecutionContractResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8J") return false;
  if (r.allPassed !== true) return false;
  if (r.minimalRuntimePatchExecutionContractOnly !== true) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanFileModified !== false) return false;
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
  if (r.minimalRuntimePatchPerformed !== false) return false;
  if (r.productionActivationPerformed !== false) return false;
  if (r.publicRuntimeActivationPerformed !== false) return false;
  if (r.seamActivationPerformed !== false) return false;
  if (r.documentRuntimeActivationPerformed !== false) return false;
  if (r.photoOcrRuntimeActivationPerformed !== false) return false;
  if (r.scannerRuntimeActivationPerformed !== false) return false;
  if (r.paidDocumentModeRuntimeActivationPerformed !== false) return false;
  if (r.vayloDnaRuntimeActivationPerformed !== false) return false;
  // Import/runner flags and 8.8I confirmations
  if (r.importedOnlyFreeQaMinimalRuntimePatchAuthorizationPlanRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanRunnerCalled !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanCheckId !== "8.8I") return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanAllPassed !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanConfirmed !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTargetConfirmed !== AUTHORIZATION_PLAN_TARGET_I) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanStatusConfirmed !== AUTHORIZATION_PLAN_STATUS_I) return false;
  // Execution contract decision
  if (r.executionContractTarget !== EXECUTION_CONTRACT_TARGET) return false;
  if (r.executionContractStatus !== EXECUTION_CONTRACT_STATUS) return false;
  if (r.minimalRuntimePatchExecutionContractCreated !== true) return false;
  if (r.minimalRuntimePatchExecutionContractCreatedForFreeQaOnly !== true) return false;
  // Execution contract scope flags
  if (r.executionContractScopeConfirmed !== true) return false;
  if (r.executionContractAnonymousNonDocumentQuestionOnly !== true) return false;
  if (r.executionContractControlledInternalOnly !== true) return false;
  if (r.executionContractNoPublicUsers !== true) return false;
  if (r.executionContractDoesNotAuthorizeRuntimeExecutionNow !== true) return false;
  if (r.executionContractDoesNotAuthorizeRoutePatchingNow !== true) return false;
  if (r.executionContractDoesNotAuthorizeRouteWiringNow !== true) return false;
  if (r.executionContractDoesNotAuthorizeSeamEnablementNow !== true) return false;
  if (r.executionContractDocumentInputBlocked !== true) return false;
  if (r.executionContractDocumentLikeTextBlocked !== true) return false;
  if (r.executionContractPhotoOcrBlocked !== true) return false;
  if (r.executionContractScannerBlocked !== true) return false;
  if (r.executionContractUploadBlocked !== true) return false;
  if (r.executionContractPaidModeBlocked !== true) return false;
  if (r.executionContractVayloDnaBlocked !== true) return false;
  if (r.executionContractPersistenceBlocked !== true) return false;
  if (r.executionContractExactLegalDeadlineCalculationBlocked !== true) return false;
  if (r.executionContractTrustedModelOutputBlocked !== true) return false;
  if (r.executionContractPublicRuntimeBlocked !== true) return false;
  if (r.executionContractPilotBlocked !== true) return false;
  if (r.executionContractProductionBlocked !== true) return false;
  if (r.executionContractGoLiveBlocked !== true) return false;
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
  if (r.minimalRuntimePatchAuthorizedNow !== false) return false;
  if (r.routePatchingAuthorizedNow !== false) return false;
  if (r.routeWiringAuthorizedNow !== false) return false;
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Readiness for next steps
  if (r.readyForFreeQaScopedRuntimePatchImplementationPlan !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForControlledInternalTestRuntimeExecution !== false) return false;
  if (r.readyForMinimalRuntimePatchExecution !== false) return false;
  if (r.readyForRoutePatching !== false) return false;
  if (r.readyForRouteWiring !== false) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleDocumentOutput !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForPilot !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  // Future required phase flags
  if (r.futureScopedRuntimePatchImplementationPlanRequired !== true) return false;
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
  // Inherited 8.8I/8.8H/8.8G/8.8F/8.8E tamper confirmations
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8I !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected !== r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8I !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== r.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) return false;
  if (r.freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8I !== true) return false;
  if (r.freeQaInternalTestImplementationPlanTamperCasesRejected !== r.freeQaInternalTestImplementationPlanTamperCaseCount) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8I !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== r.freeQaControlledInternalTestAuthorizationTamperCaseCount) return false;
  if (r.freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8I !== true) return false;
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
  if (!r.executionContractDecision || r.executionContractDecision.length === 0) return false;
  if (!r.executionContractScope || r.executionContractScope.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.executionContractNotes || r.executionContractNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.executionContractDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_CONTRACT_STATUS)) return false;
  const scopeJ = r.executionContractScope.join(" ");
  if (!scopeJ.includes(SENTINEL_FREE_QA_SCOPE)) return false;
  if (!scopeJ.includes(SENTINEL_ANON_NON_DOC)) return false;
  if (!scopeJ.includes(SENTINEL_CONTROLLED_INTERNAL_ONLY)) return false;
  const boundariesJ = r.nonAuthorizationBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_NO_RUNTIME_EXEC_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_PATCHING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_WIRING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_SEAM_ENABLEMENT_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_SCOPED_PATCH_IMPL_PLAN)) return false;
  if (!futureJ.includes(SENTINEL_MIN_PATCH_SEP_AUTH)) return false;
  if (!futureJ.includes(SENTINEL_ROUTE_WIRING_SEP_AUTH)) return false;
  if (!futureJ.includes(SENTINEL_POST_WIRING_AUDIT)) return false;
  if (!futureJ.includes(SENTINEL_FIRST_TEST_RUN_SEP_AUTH)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_EXEC_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_ROUTE_PATCHING_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_ROUTE_WIRING_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_SEAM_ACTIVATION_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_BLOCKED)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Own tamper coverage
  if (r.freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected !== r.freeQaMinimalRuntimePatchExecutionContractTamperCaseCount) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88JMutation = (
  r: FreeQaMinimalRuntimePatchExecutionContractResult,
) => FreeQaMinimalRuntimePatchExecutionContractResult;
interface Tamper88JCase { label: string; mutate: Tamper88JMutation; }

const FREE_QA_EXECUTION_CONTRACT_TAMPER_CASES: Tamper88JCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8I" as "8.8J" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "minimalRuntimePatchExecutionContractOnly false", mutate: (r) => ({ ...r, minimalRuntimePatchExecutionContractOnly: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractFileCreated false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanFileModified true", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanFileModified: true as false }) },
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
  { label: "minimalRuntimePatchPerformed true", mutate: (r) => ({ ...r, minimalRuntimePatchPerformed: true as false }) },
  { label: "productionActivationPerformed true", mutate: (r) => ({ ...r, productionActivationPerformed: true as false }) },
  { label: "publicRuntimeActivationPerformed true", mutate: (r) => ({ ...r, publicRuntimeActivationPerformed: true as false }) },
  { label: "seamActivationPerformed true", mutate: (r) => ({ ...r, seamActivationPerformed: true as false }) },
  { label: "documentRuntimeActivationPerformed true", mutate: (r) => ({ ...r, documentRuntimeActivationPerformed: true as false }) },
  { label: "photoOcrRuntimeActivationPerformed true", mutate: (r) => ({ ...r, photoOcrRuntimeActivationPerformed: true as false }) },
  { label: "scannerRuntimeActivationPerformed true", mutate: (r) => ({ ...r, scannerRuntimeActivationPerformed: true as false }) },
  { label: "paidDocumentModeRuntimeActivationPerformed true", mutate: (r) => ({ ...r, paidDocumentModeRuntimeActivationPerformed: true as false }) },
  { label: "vayloDnaRuntimeActivationPerformed true", mutate: (r) => ({ ...r, vayloDnaRuntimeActivationPerformed: true as false }) },
  // Import/runner flags and 8.8I confirmations
  { label: "importedOnlyFreeQaMinimalRuntimePatchAuthorizationPlanRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaMinimalRuntimePatchAuthorizationPlanRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanRunnerCalled false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanRunnerCalled: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanCheckId wrong", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanCheckId: "8.8H" as "8.8I" }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanAllPassed false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanAllPassed: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanConfirmed false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanConfirmed: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTargetConfirmed: "public_runtime_plan" as AuthorizationPlanTargetI }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanStatusConfirmed wrong", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanStatusConfirmed: "unauthorized" as AuthorizationPlanStatusI }) },
  // Execution contract decision
  { label: "executionContractTarget wrong", mutate: (r) => ({ ...r, executionContractTarget: "public_runtime_contract" as ExecutionContractTarget88J }) },
  { label: "executionContractStatus wrong", mutate: (r) => ({ ...r, executionContractStatus: "unauthorized" as ExecutionContractStatus88J }) },
  { label: "minimalRuntimePatchExecutionContractCreated false", mutate: (r) => ({ ...r, minimalRuntimePatchExecutionContractCreated: false as true }) },
  { label: "minimalRuntimePatchExecutionContractCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, minimalRuntimePatchExecutionContractCreatedForFreeQaOnly: false as true }) },
  // Execution contract scope flags
  { label: "executionContractScopeConfirmed false", mutate: (r) => ({ ...r, executionContractScopeConfirmed: false as true }) },
  { label: "executionContractAnonymousNonDocumentQuestionOnly false", mutate: (r) => ({ ...r, executionContractAnonymousNonDocumentQuestionOnly: false as true }) },
  { label: "executionContractControlledInternalOnly false", mutate: (r) => ({ ...r, executionContractControlledInternalOnly: false as true }) },
  { label: "executionContractNoPublicUsers false", mutate: (r) => ({ ...r, executionContractNoPublicUsers: false as true }) },
  { label: "executionContractDoesNotAuthorizeRuntimeExecutionNow false", mutate: (r) => ({ ...r, executionContractDoesNotAuthorizeRuntimeExecutionNow: false as true }) },
  { label: "executionContractDoesNotAuthorizeRoutePatchingNow false", mutate: (r) => ({ ...r, executionContractDoesNotAuthorizeRoutePatchingNow: false as true }) },
  { label: "executionContractDoesNotAuthorizeRouteWiringNow false", mutate: (r) => ({ ...r, executionContractDoesNotAuthorizeRouteWiringNow: false as true }) },
  { label: "executionContractDoesNotAuthorizeSeamEnablementNow false", mutate: (r) => ({ ...r, executionContractDoesNotAuthorizeSeamEnablementNow: false as true }) },
  { label: "executionContractDocumentInputBlocked false", mutate: (r) => ({ ...r, executionContractDocumentInputBlocked: false as true }) },
  { label: "executionContractDocumentLikeTextBlocked false", mutate: (r) => ({ ...r, executionContractDocumentLikeTextBlocked: false as true }) },
  { label: "executionContractPhotoOcrBlocked false", mutate: (r) => ({ ...r, executionContractPhotoOcrBlocked: false as true }) },
  { label: "executionContractScannerBlocked false", mutate: (r) => ({ ...r, executionContractScannerBlocked: false as true }) },
  { label: "executionContractUploadBlocked false", mutate: (r) => ({ ...r, executionContractUploadBlocked: false as true }) },
  { label: "executionContractPaidModeBlocked false", mutate: (r) => ({ ...r, executionContractPaidModeBlocked: false as true }) },
  { label: "executionContractVayloDnaBlocked false", mutate: (r) => ({ ...r, executionContractVayloDnaBlocked: false as true }) },
  { label: "executionContractPersistenceBlocked false", mutate: (r) => ({ ...r, executionContractPersistenceBlocked: false as true }) },
  { label: "executionContractExactLegalDeadlineCalculationBlocked false", mutate: (r) => ({ ...r, executionContractExactLegalDeadlineCalculationBlocked: false as true }) },
  { label: "executionContractTrustedModelOutputBlocked false", mutate: (r) => ({ ...r, executionContractTrustedModelOutputBlocked: false as true }) },
  { label: "executionContractPublicRuntimeBlocked false", mutate: (r) => ({ ...r, executionContractPublicRuntimeBlocked: false as true }) },
  { label: "executionContractPilotBlocked false", mutate: (r) => ({ ...r, executionContractPilotBlocked: false as true }) },
  { label: "executionContractProductionBlocked false", mutate: (r) => ({ ...r, executionContractProductionBlocked: false as true }) },
  { label: "executionContractGoLiveBlocked false", mutate: (r) => ({ ...r, executionContractGoLiveBlocked: false as true }) },
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
  { label: "minimalRuntimePatchAuthorizedNow true", mutate: (r) => ({ ...r, minimalRuntimePatchAuthorizedNow: true as false }) },
  { label: "routePatchingAuthorizedNow true", mutate: (r) => ({ ...r, routePatchingAuthorizedNow: true as false }) },
  { label: "routeWiringAuthorizedNow true", mutate: (r) => ({ ...r, routeWiringAuthorizedNow: true as false }) },
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Readiness for next steps
  { label: "readyForFreeQaScopedRuntimePatchImplementationPlan false", mutate: (r) => ({ ...r, readyForFreeQaScopedRuntimePatchImplementationPlan: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForControlledInternalTestRuntimeExecution true", mutate: (r) => ({ ...r, readyForControlledInternalTestRuntimeExecution: true as false }) },
  { label: "readyForMinimalRuntimePatchExecution true", mutate: (r) => ({ ...r, readyForMinimalRuntimePatchExecution: true as false }) },
  { label: "readyForRoutePatching true", mutate: (r) => ({ ...r, readyForRoutePatching: true as false }) },
  { label: "readyForRouteWiring true", mutate: (r) => ({ ...r, readyForRouteWiring: true as false }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleDocumentOutput true", mutate: (r) => ({ ...r, readyForUserVisibleDocumentOutput: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForPilot true", mutate: (r) => ({ ...r, readyForPilot: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  // Future required phase flags
  { label: "futureScopedRuntimePatchImplementationPlanRequired false", mutate: (r) => ({ ...r, futureScopedRuntimePatchImplementationPlanRequired: false as true }) },
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
  // Inherited 8.8I/8.8H/8.8G/8.8F/8.8E tamper confirmations
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8I false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8I: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected - 1 }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8I false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8I: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected - 1 }) },
  { label: "freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8I false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8I: false as true }) },
  { label: "freeQaInternalTestImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperCasesRejected: r.freeQaInternalTestImplementationPlanTamperCasesRejected - 1 }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8I false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8I: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCasesRejected: r.freeQaControlledInternalTestAuthorizationTamperCasesRejected - 1 }) },
  { label: "freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8I false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8I: false as true }) },
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
  { label: "executionContractDecision empty", mutate: (r) => ({ ...r, executionContractDecision: [] }) },
  { label: "executionContractScope empty", mutate: (r) => ({ ...r, executionContractScope: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "executionContractNotes empty", mutate: (r) => ({ ...r, executionContractNotes: [] }) },
  // Array sentinel checks
  { label: "executionContractDecision missing contract_ready_for_future_scoped_runtime_patch_implementation_plan_only sentinel", mutate: (r) => ({ ...r, executionContractDecision: r.executionContractDecision.map((s) => s.split(SENTINEL_CONTRACT_STATUS).join("omitted")) }) },
  { label: "executionContractScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, executionContractScope: r.executionContractScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "executionContractScope missing anonymous non-document questions only sentinel", mutate: (r) => ({ ...r, executionContractScope: r.executionContractScope.map((s) => s.split(SENTINEL_ANON_NON_DOC).join("omitted")) }) },
  { label: "executionContractScope missing controlled internal test only sentinel", mutate: (r) => ({ ...r, executionContractScope: r.executionContractScope.map((s) => s.split(SENTINEL_CONTROLLED_INTERNAL_ONLY).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime execution now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_EXEC_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route patching now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_PATCHING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route wiring now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_WIRING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no seam enablement now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_SEAM_ENABLEMENT_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing scoped runtime patch implementation plan sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_SCOPED_PATCH_IMPL_PLAN).join("omitted")) }) },
  { label: "futureRequiredPhases missing minimal runtime patch requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_MIN_PATCH_SEP_AUTH).join("omitted")) }) },
  { label: "futureRequiredPhases missing route wiring requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_ROUTE_WIRING_SEP_AUTH).join("omitted")) }) },
  { label: "futureRequiredPhases missing post-wiring audit sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_POST_WIRING_AUDIT).join("omitted")) }) },
  { label: "futureRequiredPhases missing first internal test run requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_FIRST_TEST_RUN_SEP_AUTH).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime execution blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_EXEC_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing route patching blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_ROUTE_PATCHING_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing route wiring blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_ROUTE_WIRING_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing seam activation blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SEAM_ACTIVATION_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing public runtime blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing production blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PRODUCTION_BLOCKED).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Own tamper coverage self-checks
  { label: "freeQaMinimalRuntimePatchExecutionContractTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractTamperCoveragePassing: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected: r.freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected - 1 }) },
];

// ─── Exported execution-contract runner ───────────────────────────────────────

/**
 * Free Smart Talk Q&A Minimal Runtime Patch Execution Contract runner for
 * 8.8J.
 *
 * Calls the 8.8I Minimal Runtime Patch Authorization Plan runner as source
 * of truth. Defines the CONTRACT for a FUTURE minimal runtime patch
 * execution phase for Free Smart Talk Q&A (anonymous, non-document
 * questions, controlled internal test only). Does NOT implement the patch,
 * patch/wire routes, enable runtime, or enable the Evidence Gates seam.
 */
export function runFreeQaMinimalRuntimePatchExecutionContract(): FreeQaMinimalRuntimePatchExecutionContractResult {
  const contractFailures: string[] = [];

  // ── Call 8.8I Authorization Plan runner as source of truth ───────────
  const i = runFreeQaMinimalRuntimePatchAuthorizationPlan();

  if (i.checkId !== "8.8I") contractFailures.push(`8.8I checkId mismatch: expected "8.8I", got "${i.checkId}"`);
  if (i.allPassed !== true) contractFailures.push("8.8I allPassed is not true");
  if (i.authorizationPlanTarget !== AUTHORIZATION_PLAN_TARGET_I) contractFailures.push(`8.8I authorizationPlanTarget mismatch: expected "${AUTHORIZATION_PLAN_TARGET_I}", got "${i.authorizationPlanTarget}"`);
  if (i.authorizationPlanStatus !== AUTHORIZATION_PLAN_STATUS_I) contractFailures.push(`8.8I authorizationPlanStatus mismatch: expected "${AUTHORIZATION_PLAN_STATUS_I}", got "${i.authorizationPlanStatus}"`);
  if (i.readyForFreeQaMinimalRuntimePatchExecutionContract !== true) contractFailures.push("8.8I readyForFreeQaMinimalRuntimePatchExecutionContract is not true");
  if (i.readyForRuntimeActivation !== false) contractFailures.push("8.8I readyForRuntimeActivation is not false");
  if (i.readyForControlledInternalTestRuntimeExecution !== false) contractFailures.push("8.8I readyForControlledInternalTestRuntimeExecution is not false");
  if (i.readyForMinimalRuntimePatchExecution !== false) contractFailures.push("8.8I readyForMinimalRuntimePatchExecution is not false");
  if (i.readyForRoutePatching !== false) contractFailures.push("8.8I readyForRoutePatching is not false");
  if (i.readyForRouteWiring !== false) contractFailures.push("8.8I readyForRouteWiring is not false");
  if (i.allowedSyntheticCasesPassed !== i.allowedSyntheticCaseCount) contractFailures.push(`8.8I allowed cases: ${i.allowedSyntheticCasesPassed}/${i.allowedSyntheticCaseCount}`);
  if (i.forbiddenSyntheticCasesBlocked !== i.forbiddenSyntheticCaseCount) contractFailures.push(`8.8I forbidden cases: ${i.forbiddenSyntheticCasesBlocked}/${i.forbiddenSyntheticCaseCount}`);
  if (i.unsafeUnknownSyntheticCasesFailedClosed !== i.unsafeUnknownSyntheticCaseCount) contractFailures.push(`8.8I unsafe/unknown cases: ${i.unsafeUnknownSyntheticCasesFailedClosed}/${i.unsafeUnknownSyntheticCaseCount}`);
  if (i.runtimeActivationPerformed !== false) contractFailures.push("8.8I runtimeActivationPerformed is not false");
  if (i.controlledInternalRuntimeExecutionPerformed !== false) contractFailures.push("8.8I controlledInternalRuntimeExecutionPerformed is not false");
  if (i.minimalRuntimePatchPerformed !== false) contractFailures.push("8.8I minimalRuntimePatchPerformed is not false");
  if (i.seamActivationPerformed !== false) contractFailures.push("8.8I seamActivationPerformed is not false");
  if (i.documentRuntimeActivationPerformed !== false) contractFailures.push("8.8I documentRuntimeActivationPerformed is not false");
  if (i.photoOcrRuntimeActivationPerformed !== false) contractFailures.push("8.8I photoOcrRuntimeActivationPerformed is not false");
  if (i.scannerRuntimeActivationPerformed !== false) contractFailures.push("8.8I scannerRuntimeActivationPerformed is not false");
  if (i.paidDocumentModeRuntimeActivationPerformed !== false) contractFailures.push("8.8I paidDocumentModeRuntimeActivationPerformed is not false");
  if (i.vayloDnaRuntimeActivationPerformed !== false) contractFailures.push("8.8I vayloDnaRuntimeActivationPerformed is not false");
  if (i.routePatchPerformed !== false) contractFailures.push("8.8I routePatchPerformed is not false");
  if (i.routeWiringPerformed !== false) contractFailures.push("8.8I routeWiringPerformed is not false");
  if (i.realDocumentInputAuthorizedNow !== false) contractFailures.push("8.8I realDocumentInputAuthorizedNow is not false");
  if (i.userVisibleOutputAuthorizedNow !== false) contractFailures.push("8.8I userVisibleOutputAuthorizedNow is not false");
  if (i.publicRuntimeAuthorizedNow !== false) contractFailures.push("8.8I publicRuntimeAuthorizedNow is not false");
  if (i.modelFacingUseAuthorizedNow !== false) contractFailures.push("8.8I modelFacingUseAuthorizedNow is not false");
  if (i.evidenceGateExecutionAuthorizedNow !== false) contractFailures.push("8.8I evidenceGateExecutionAuthorizedNow is not false");
  if (i.claimAuthorizationAuthorizedNow !== false) contractFailures.push("8.8I claimAuthorizationAuthorizedNow is not false");
  if (i.exactDeadlineCalculationAuthorized !== false) contractFailures.push("8.8I exactDeadlineCalculationAuthorized is not false");
  if (i.paymentRuntimeAuthorizedNow !== false) contractFailures.push("8.8I paymentRuntimeAuthorizedNow is not false");
  if (i.entitlementRuntimeAuthorizedNow !== false) contractFailures.push("8.8I entitlementRuntimeAuthorizedNow is not false");
  if (i.checkoutRuntimeAuthorizedNow !== false) contractFailures.push("8.8I checkoutRuntimeAuthorizedNow is not false");
  if (i.pilotAuthorizationGranted !== false) contractFailures.push("8.8I pilotAuthorizationGranted is not false");
  if (i.productionAuthorizationGranted !== false) contractFailures.push("8.8I productionAuthorizationGranted is not false");
  if (i.goLiveAuthorizationGranted !== false) contractFailures.push("8.8I goLiveAuthorizationGranted is not false");
  if (i.seamActivationAuthorizedNow !== false) contractFailures.push("8.8I seamActivationAuthorizedNow is not false");
  if (i.controlledRuntimeActivationAuthorizedNow !== false) contractFailures.push("8.8I controlledRuntimeActivationAuthorizedNow is not false");
  if (i.controlledInternalRuntimeExecutionAuthorizedNow !== false) contractFailures.push("8.8I controlledInternalRuntimeExecutionAuthorizedNow is not false");
  if (i.minimalRuntimePatchAuthorizedNow !== false) contractFailures.push("8.8I minimalRuntimePatchAuthorizedNow is not false");
  if (i.routePatchingAuthorizedNow !== false) contractFailures.push("8.8I routePatchingAuthorizedNow is not false");
  if (i.routeWiringAuthorizedNow !== false) contractFailures.push("8.8I routeWiringAuthorizedNow is not false");
  if (i.documentRuntimeAuthorizedNow !== false) contractFailures.push("8.8I documentRuntimeAuthorizedNow is not false");
  if (i.photoOcrRuntimeAuthorizedNow !== false) contractFailures.push("8.8I photoOcrRuntimeAuthorizedNow is not false");
  if (i.scannerUploadAuthorizedNow !== false) contractFailures.push("8.8I scannerUploadAuthorizedNow is not false");
  if (i.vayloDnaRuntimeAuthorizedNow !== false) contractFailures.push("8.8I vayloDnaRuntimeAuthorizedNow is not false");
  if (i.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected !== i.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount) contractFailures.push("8.8I own tamper count mismatch");
  if (i.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== i.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) contractFailures.push("8.8I inherited 8.8H tamper count mismatch");
  if (i.freeQaInternalTestImplementationPlanTamperCasesRejected !== i.freeQaInternalTestImplementationPlanTamperCaseCount) contractFailures.push("8.8I inherited 8.8G tamper count mismatch");
  if (i.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== i.freeQaControlledInternalTestAuthorizationTamperCaseCount) contractFailures.push("8.8I inherited 8.8F tamper count mismatch");
  if (i.freeQaPostActivationReadinessAuditTamperCasesRejected !== i.freeQaPostActivationReadinessAuditTamperCaseCount) contractFailures.push("8.8I inherited 8.8E tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const executionContractDecision: string[] = [
    `ED-01 [${SENTINEL_CONTRACT_STATUS}]: contract_ready_for_future_scoped_runtime_patch_implementation_plan_only — a future minimal runtime patch execution contract is now defined for Free Smart Talk Q&A at the execution-contract level only.`,
    "ED-02: This contract allows the NEXT phase to create a scoped runtime patch implementation plan.",
    "ED-03: This contract does NOT implement the patch or authorize route patching, route wiring, or seam enablement now.",
    "ED-04: A separate authorization is required before any minimal runtime patch execution, route wiring, or first internal test run.",
  ];

  const executionContractScope: string[] = [
    `ES-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A — ${SENTINEL_ANON_NON_DOC} — ${SENTINEL_CONTROLLED_INTERNAL_ONLY} — the execution contract scope is limited accordingly.`,
    "ES-02: Execution contract scope excludes public users, document-like text, OCR/photo/scanner/upload, Paid Document Mode, and Vaylo DNA.",
    "ES-03: Execution contract scope excludes persistence, trusted model output, and exact legal deadline calculation.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_EXEC_NOW}]: no runtime execution now — this contract does not execute runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_ROUTE_PATCHING_NOW}]: no route patching now — this contract does not patch any route file now.`,
    `NB-03 [${SENTINEL_NO_ROUTE_WIRING_NOW}]: no route wiring now — this contract does not wire any route file now.`,
    `NB-04 [${SENTINEL_NO_SEAM_ENABLEMENT_NOW}]: no seam enablement now — this contract does not enable the Evidence Gates seam now.`,
    `NB-05 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document, photo, OCR, and scanner input remain unauthorized by this contract.`,
    `NB-06 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this contract.`,
    "NB-07: no pilot, no production, no go-live authorization is granted by this contract.",
    "NB-08: no exact legal deadline calculation and no trusted model output authorization is granted by this contract.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_SCOPED_PATCH_IMPL_PLAN}]: scoped runtime patch implementation plan — the next phase may create a scoped runtime patch implementation plan.`,
    `FP-02 [${SENTINEL_MIN_PATCH_SEP_AUTH}]: minimal runtime patch requires separate authorization — any minimal route/runtime patch execution needs its own authorization.`,
    `FP-03 [${SENTINEL_ROUTE_WIRING_SEP_AUTH}]: route wiring requires separate authorization before any route file is touched.`,
    "FP-04: future Evidence Gates seam enablement requires separate authorization.",
    `FP-05 [${SENTINEL_POST_WIRING_AUDIT}]: post-wiring audit — a post-wiring audit is required after any future runtime patch.`,
    `FP-06 [${SENTINEL_FIRST_TEST_RUN_SEP_AUTH}]: first internal test run requires separate authorization — the first actual internal test execution needs its own authorization.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01: ${SENTINEL_RUNTIME_EXEC_BLOCKED} — controlled runtime execution remains globally blocked pending a future scoped runtime patch implementation plan.`,
    `GB-02: ${SENTINEL_ROUTE_PATCHING_BLOCKED} — route patching remains globally blocked pending separate authorization.`,
    `GB-03: ${SENTINEL_ROUTE_WIRING_BLOCKED} — route wiring remains globally blocked pending separate authorization.`,
    `GB-04: ${SENTINEL_SEAM_ACTIVATION_BLOCKED} — Evidence Gates seam activation remains globally blocked.`,
    `GB-05: ${SENTINEL_DOCUMENT_MODE_BLOCKED} — text document mode runtime remains globally blocked.`,
    `GB-06: ${SENTINEL_PHOTO_OCR_BLOCKED} — photo and OCR runtime remains globally blocked.`,
    `GB-07: ${SENTINEL_SCANNER_BLOCKED} — scanner upload runtime remains globally blocked.`,
    `GB-08: ${SENTINEL_PUBLIC_RUNTIME_BLOCKED} — public runtime remains globally blocked.`,
    `GB-09: ${SENTINEL_PRODUCTION_BLOCKED} — production and go-live remain globally blocked.`,
    "GB-10: paid mode and Vaylo DNA runtime remain globally blocked.",
    "GB-11: payment and entitlement runtime remain globally blocked.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01: ${SENTINEL_CLAIM_RULE_OR} — ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8J.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8J.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8J.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8J.)",
    `GD-05: ${SENTINEL_TRAP_HEURISTIC} — enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8J.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8J.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8J.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8J.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8J.)",
  ];

  const executionContractNotes: string[] = [
    "IN-01: 8.8J minimal runtime patch execution contract created for Free Smart Talk Q&A only.",
    `IN-02: 8.8I confirmed — checkId=${i.checkId}, allPassed=${i.allPassed}, authorizationPlanTarget=${i.authorizationPlanTarget}.`,
    `IN-03: Synthetic matrix inherited via 8.8I: ${i.allowedSyntheticCasesPassed}/${i.allowedSyntheticCaseCount} allowed, ${i.forbiddenSyntheticCasesBlocked}/${i.forbiddenSyntheticCaseCount} forbidden blocked, ${i.unsafeUnknownSyntheticCasesFailedClosed}/${i.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "IN-04: This is an execution-contract-only phase; no runtime, route, or seam files were touched.",
    "IN-05: All runtime/public/document activation flags remain false after this contract.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_EXECUTION_CONTRACT_TAMPER_CASES.length;

  const provisional: FreeQaMinimalRuntimePatchExecutionContractResult = {
    checkId: "8.8J",
    allPassed: true,
    minimalRuntimePatchExecutionContractOnly: true,
    freeQaMinimalRuntimePatchExecutionContractFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaMinimalRuntimePatchAuthorizationPlanFileModified: false,
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
    minimalRuntimePatchPerformed: false,
    productionActivationPerformed: false,
    publicRuntimeActivationPerformed: false,
    seamActivationPerformed: false,
    documentRuntimeActivationPerformed: false,
    photoOcrRuntimeActivationPerformed: false,
    scannerRuntimeActivationPerformed: false,
    paidDocumentModeRuntimeActivationPerformed: false,
    vayloDnaRuntimeActivationPerformed: false,
    importedOnlyFreeQaMinimalRuntimePatchAuthorizationPlanRunner: true,
    noOtherImportsUsed: true,
    freeQaMinimalRuntimePatchAuthorizationPlanRunnerCalled: true,
    freeQaMinimalRuntimePatchAuthorizationPlanCheckId: "8.8I",
    freeQaMinimalRuntimePatchAuthorizationPlanAllPassed: true,
    freeQaMinimalRuntimePatchAuthorizationPlanConfirmed: true,
    freeQaMinimalRuntimePatchAuthorizationPlanTargetConfirmed: AUTHORIZATION_PLAN_TARGET_I,
    freeQaMinimalRuntimePatchAuthorizationPlanStatusConfirmed: AUTHORIZATION_PLAN_STATUS_I,
    executionContractTarget: EXECUTION_CONTRACT_TARGET,
    executionContractStatus: EXECUTION_CONTRACT_STATUS,
    minimalRuntimePatchExecutionContractCreated: true,
    minimalRuntimePatchExecutionContractCreatedForFreeQaOnly: true,
    executionContractScopeConfirmed: true,
    executionContractAnonymousNonDocumentQuestionOnly: true,
    executionContractControlledInternalOnly: true,
    executionContractNoPublicUsers: true,
    executionContractDoesNotAuthorizeRuntimeExecutionNow: true,
    executionContractDoesNotAuthorizeRoutePatchingNow: true,
    executionContractDoesNotAuthorizeRouteWiringNow: true,
    executionContractDoesNotAuthorizeSeamEnablementNow: true,
    executionContractDocumentInputBlocked: true,
    executionContractDocumentLikeTextBlocked: true,
    executionContractPhotoOcrBlocked: true,
    executionContractScannerBlocked: true,
    executionContractUploadBlocked: true,
    executionContractPaidModeBlocked: true,
    executionContractVayloDnaBlocked: true,
    executionContractPersistenceBlocked: true,
    executionContractExactLegalDeadlineCalculationBlocked: true,
    executionContractTrustedModelOutputBlocked: true,
    executionContractPublicRuntimeBlocked: true,
    executionContractPilotBlocked: true,
    executionContractProductionBlocked: true,
    executionContractGoLiveBlocked: true,
    allowedSyntheticCaseCount: i.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: i.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: i.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: i.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: i.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: i.unsafeUnknownSyntheticCasesFailedClosed,
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
    minimalRuntimePatchAuthorizedNow: false,
    routePatchingAuthorizedNow: false,
    routeWiringAuthorizedNow: false,
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    readyForFreeQaScopedRuntimePatchImplementationPlan: true,
    readyForRuntimeActivation: false,
    readyForControlledInternalTestRuntimeExecution: false,
    readyForMinimalRuntimePatchExecution: false,
    readyForRoutePatching: false,
    readyForRouteWiring: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleDocumentOutput: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPublicRuntime: false,
    readyForPilot: false,
    readyForProduction: false,
    readyForGoLive: false,
    futureScopedRuntimePatchImplementationPlanRequired: true,
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
    freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8I: true,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount: i.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: i.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected,
    freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8I: true,
    freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: i.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount,
    freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: i.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected,
    freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8I: true,
    freeQaInternalTestImplementationPlanTamperCaseCount: i.freeQaInternalTestImplementationPlanTamperCaseCount,
    freeQaInternalTestImplementationPlanTamperCasesRejected: i.freeQaInternalTestImplementationPlanTamperCasesRejected,
    freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8I: true,
    freeQaControlledInternalTestAuthorizationTamperCaseCount: i.freeQaControlledInternalTestAuthorizationTamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected: i.freeQaControlledInternalTestAuthorizationTamperCasesRejected,
    freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8I: true,
    freeQaPostActivationReadinessAuditTamperCaseCount: i.freeQaPostActivationReadinessAuditTamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: i.freeQaPostActivationReadinessAuditTamperCasesRejected,
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
    executionContractDecision,
    executionContractScope,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    executionContractNotes,
    freeQaMinimalRuntimePatchExecutionContractTamperCaseCount: tamperCaseCount,
    freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected: tamperCaseCount,
    freeQaMinimalRuntimePatchExecutionContractTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaMinimalRuntimePatchExecutionContractResult(provisional)) {
    contractFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8J tamper cases ─────────────────────────────────────────────
  let freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_EXECUTION_CONTRACT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_EXECUTION_CONTRACT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaMinimalRuntimePatchExecutionContractResult(tc.mutate(provisional))) {
      freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8J tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) contractFailures.push(...tamperFailures);

  const allPassed =
    contractFailures.length === 0 &&
    freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected === tamperCaseCount;

  const finalExecutionContractNotes: string[] = [
    ...executionContractNotes,
    `8.8J tamper cases: ${freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(contractFailures.length > 0 ? [`FAILURES (${contractFailures.length}):`, ...contractFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected,
    executionContractNotes: finalExecutionContractNotes,
  };
}
