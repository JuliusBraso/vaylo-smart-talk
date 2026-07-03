/**
 * PHASE 8.8K — Free Q&A Scoped Runtime Patch Implementation Plan
 *
 * Implementation-plan-only phase. This phase defines the CONCRETE plan for
 * a future scoped minimal runtime patch for Free Smart Talk Q&A (anonymous,
 * non-document questions, controlled internal test only). It does NOT
 * implement the patch, patch or wire routes, enable runtime, or enable the
 * Evidence Gates seam.
 *
 * This phase MUST NOT:
 * - Implement the patch, patch routes, or wire routes
 * - Enable runtime or the Evidence Gates seam
 * - Execute controlled internal runtime
 * - Modify, import, or execute runSmartTalk
 * - Process real user input or documents
 * - Call models
 *
 * Implementation plan decision:
 * - implementationPlanTarget: "free_smart_talk_qa_scoped_runtime_patch_implementation_plan_only"
 * - implementationPlanStatus: "planned_for_future_scoped_runtime_patch_authorization_only"
 * - scopedRuntimePatchImplementationPlanCreated: true
 *
 * This plan may describe the future patch shape (a disabled-by-default
 * internal flag, a future isolated Free Q&A execution path, a future strict
 * non-document input classifier, a future route guard for internal-only
 * execution, a future post-wiring audit requirement, a future first
 * internal test run authorization requirement) but must NOT implement any
 * of it, and must not authorize route patching, route wiring, seam
 * enablement, public runtime, pilot, production, go-live, documents,
 * OCR/photo/scanner, paid mode, Vaylo DNA, exact legal deadline
 * calculation, or trusted model output now.
 */

import { runFreeQaMinimalRuntimePatchExecutionContract } from "./run-free-qa-minimal-runtime-patch-execution-contract";

// ─── Literal types ────────────────────────────────────────────────────────────

type ExecutionContractTargetJ = "free_smart_talk_qa_minimal_runtime_patch_execution_contract_only";
type ExecutionContractStatusJ = "contract_ready_for_future_scoped_runtime_patch_implementation_plan_only";
type ImplementationPlanTarget88K = "free_smart_talk_qa_scoped_runtime_patch_implementation_plan_only";
type ImplementationPlanStatus88K = "planned_for_future_scoped_runtime_patch_authorization_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaScopedRuntimePatchImplementationPlanResult {
  checkId: "8.8K";
  allPassed: boolean;
  scopedRuntimePatchImplementationPlanOnly: true;
  freeQaScopedRuntimePatchImplementationPlanFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaMinimalRuntimePatchExecutionContractFileModified: false;
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
  scopedRuntimePatchImplemented: false;
  productionActivationPerformed: false;
  publicRuntimeActivationPerformed: false;
  seamActivationPerformed: false;
  documentRuntimeActivationPerformed: false;
  photoOcrRuntimeActivationPerformed: false;
  scannerRuntimeActivationPerformed: false;
  paidDocumentModeRuntimeActivationPerformed: false;
  vayloDnaRuntimeActivationPerformed: false;
  importedOnlyFreeQaMinimalRuntimePatchExecutionContractRunner: true;
  noOtherImportsUsed: true;
  freeQaMinimalRuntimePatchExecutionContractRunnerCalled: true;
  freeQaMinimalRuntimePatchExecutionContractCheckId: "8.8J";
  freeQaMinimalRuntimePatchExecutionContractAllPassed: true;
  freeQaMinimalRuntimePatchExecutionContractConfirmed: true;
  freeQaMinimalRuntimePatchExecutionContractTargetConfirmed: ExecutionContractTargetJ;
  freeQaMinimalRuntimePatchExecutionContractStatusConfirmed: ExecutionContractStatusJ;
  implementationPlanTarget: ImplementationPlanTarget88K;
  implementationPlanStatus: ImplementationPlanStatus88K;
  scopedRuntimePatchImplementationPlanCreated: true;
  scopedRuntimePatchImplementationPlanCreatedForFreeQaOnly: true;
  plannedPatchScopeConfirmed: true;
  plannedPatchAnonymousNonDocumentQuestionOnly: true;
  plannedPatchControlledInternalOnly: true;
  plannedPatchNoPublicUsers: true;
  plannedPatchInternalFlagDisabledByDefault: true;
  plannedPatchStrictNonDocumentClassifierRequired: true;
  plannedPatchInternalOnlyRouteGuardRequired: true;
  plannedPatchPostWiringAuditRequired: true;
  plannedPatchFirstInternalTestRunRequiresSeparateAuthorization: true;
  plannedPatchDocumentInputBlocked: true;
  plannedPatchDocumentLikeTextBlocked: true;
  plannedPatchPhotoOcrBlocked: true;
  plannedPatchScannerBlocked: true;
  plannedPatchUploadBlocked: true;
  plannedPatchPaidModeBlocked: true;
  plannedPatchVayloDnaBlocked: true;
  plannedPatchPersistenceBlocked: true;
  plannedPatchExactLegalDeadlineCalculationBlocked: true;
  plannedPatchTrustedModelOutputBlocked: true;
  plannedPatchProductionEvidenceGatesEnforcementBlocked: true;
  plannedPatchUserVisibleDocumentInterpretationBlocked: true;
  implementationPlanDoesNotAuthorizeRuntimeExecutionNow: true;
  implementationPlanDoesNotAuthorizeRoutePatchingNow: true;
  implementationPlanDoesNotAuthorizeRouteWiringNow: true;
  implementationPlanDoesNotAuthorizeSeamEnablementNow: true;
  implementationPlanDoesNotAuthorizePublicRuntime: true;
  implementationPlanDoesNotAuthorizePilot: true;
  implementationPlanDoesNotAuthorizeProduction: true;
  implementationPlanDoesNotAuthorizeGoLive: true;
  implementationPlanDoesNotAuthorizeDocuments: true;
  implementationPlanDoesNotAuthorizePhotoOcr: true;
  implementationPlanDoesNotAuthorizeScanner: true;
  implementationPlanDoesNotAuthorizePaidMode: true;
  implementationPlanDoesNotAuthorizeVayloDna: true;
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
  scopedRuntimePatchAuthorizedNow: false;
  routePatchingAuthorizedNow: false;
  routeWiringAuthorizedNow: false;
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  readyForFreeQaScopedRuntimePatchAuthorizationDecision: true;
  readyForRuntimeActivation: false;
  readyForControlledInternalTestRuntimeExecution: false;
  readyForMinimalRuntimePatchExecution: false;
  readyForScopedRuntimePatchExecution: false;
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
  futureScopedRuntimePatchAuthorizationDecisionRequired: true;
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
  freeQaMinimalRuntimePatchExecutionContractTamperConfirmedFrom8x8J: true;
  freeQaMinimalRuntimePatchExecutionContractTamperCaseCount: number;
  freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected: number;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8J: true;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount: number;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: number;
  freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8J: true;
  freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: number;
  freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: number;
  freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8J: true;
  freeQaInternalTestImplementationPlanTamperCaseCount: number;
  freeQaInternalTestImplementationPlanTamperCasesRejected: number;
  freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8J: true;
  freeQaControlledInternalTestAuthorizationTamperCaseCount: number;
  freeQaControlledInternalTestAuthorizationTamperCasesRejected: number;
  freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8J: true;
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
  plannedPatchScope: string[];
  plannedPatchComponents: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  implementationPlanNotes: string[];
  freeQaScopedRuntimePatchImplementationPlanTamperCaseCount: number;
  freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected: number;
  freeQaScopedRuntimePatchImplementationPlanTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const EXECUTION_CONTRACT_TARGET_J: ExecutionContractTargetJ = "free_smart_talk_qa_minimal_runtime_patch_execution_contract_only";
const EXECUTION_CONTRACT_STATUS_J: ExecutionContractStatusJ = "contract_ready_for_future_scoped_runtime_patch_implementation_plan_only";
const IMPLEMENTATION_PLAN_TARGET: ImplementationPlanTarget88K = "free_smart_talk_qa_scoped_runtime_patch_implementation_plan_only";
const IMPLEMENTATION_PLAN_STATUS: ImplementationPlanStatus88K = "planned_for_future_scoped_runtime_patch_authorization_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_IMPL_PLAN_STATUS = "planned_for_future_scoped_runtime_patch_authorization_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_ANON_NON_DOC = "anonymous non-document questions only";
const SENTINEL_CONTROLLED_INTERNAL_ONLY = "controlled internal test only";
const SENTINEL_DISABLED_FLAG = "disabled-by-default internal flag";
const SENTINEL_STRICT_CLASSIFIER = "strict non-document classifier";
const SENTINEL_ROUTE_GUARD = "internal-only route guard";
const SENTINEL_POST_WIRING_AUDIT_REQUIRED = "post-wiring audit required";
const SENTINEL_NO_RUNTIME_EXEC_NOW = "no runtime execution now";
const SENTINEL_NO_ROUTE_PATCHING_NOW = "no route patching now";
const SENTINEL_NO_ROUTE_WIRING_NOW = "no route wiring now";
const SENTINEL_NO_SEAM_ENABLEMENT_NOW = "no seam enablement now";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_SCOPED_PATCH_AUTH_DECISION = "scoped runtime patch authorization decision";
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

function _isCanonicalFreeQaScopedRuntimePatchImplementationPlanResult(
  r: FreeQaScopedRuntimePatchImplementationPlanResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8K") return false;
  if (r.allPassed !== true) return false;
  if (r.scopedRuntimePatchImplementationPlanOnly !== true) return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractFileModified !== false) return false;
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
  if (r.scopedRuntimePatchImplemented !== false) return false;
  if (r.productionActivationPerformed !== false) return false;
  if (r.publicRuntimeActivationPerformed !== false) return false;
  if (r.seamActivationPerformed !== false) return false;
  if (r.documentRuntimeActivationPerformed !== false) return false;
  if (r.photoOcrRuntimeActivationPerformed !== false) return false;
  if (r.scannerRuntimeActivationPerformed !== false) return false;
  if (r.paidDocumentModeRuntimeActivationPerformed !== false) return false;
  if (r.vayloDnaRuntimeActivationPerformed !== false) return false;
  // Import/runner flags and 8.8J confirmations
  if (r.importedOnlyFreeQaMinimalRuntimePatchExecutionContractRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractRunnerCalled !== true) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractCheckId !== "8.8J") return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractAllPassed !== true) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractConfirmed !== true) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractTargetConfirmed !== EXECUTION_CONTRACT_TARGET_J) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractStatusConfirmed !== EXECUTION_CONTRACT_STATUS_J) return false;
  // Implementation plan decision
  if (r.implementationPlanTarget !== IMPLEMENTATION_PLAN_TARGET) return false;
  if (r.implementationPlanStatus !== IMPLEMENTATION_PLAN_STATUS) return false;
  if (r.scopedRuntimePatchImplementationPlanCreated !== true) return false;
  if (r.scopedRuntimePatchImplementationPlanCreatedForFreeQaOnly !== true) return false;
  // Planned patch scope flags
  if (r.plannedPatchScopeConfirmed !== true) return false;
  if (r.plannedPatchAnonymousNonDocumentQuestionOnly !== true) return false;
  if (r.plannedPatchControlledInternalOnly !== true) return false;
  if (r.plannedPatchNoPublicUsers !== true) return false;
  if (r.plannedPatchInternalFlagDisabledByDefault !== true) return false;
  if (r.plannedPatchStrictNonDocumentClassifierRequired !== true) return false;
  if (r.plannedPatchInternalOnlyRouteGuardRequired !== true) return false;
  if (r.plannedPatchPostWiringAuditRequired !== true) return false;
  if (r.plannedPatchFirstInternalTestRunRequiresSeparateAuthorization !== true) return false;
  if (r.plannedPatchDocumentInputBlocked !== true) return false;
  if (r.plannedPatchDocumentLikeTextBlocked !== true) return false;
  if (r.plannedPatchPhotoOcrBlocked !== true) return false;
  if (r.plannedPatchScannerBlocked !== true) return false;
  if (r.plannedPatchUploadBlocked !== true) return false;
  if (r.plannedPatchPaidModeBlocked !== true) return false;
  if (r.plannedPatchVayloDnaBlocked !== true) return false;
  if (r.plannedPatchPersistenceBlocked !== true) return false;
  if (r.plannedPatchExactLegalDeadlineCalculationBlocked !== true) return false;
  if (r.plannedPatchTrustedModelOutputBlocked !== true) return false;
  if (r.plannedPatchProductionEvidenceGatesEnforcementBlocked !== true) return false;
  if (r.plannedPatchUserVisibleDocumentInterpretationBlocked !== true) return false;
  // implementationPlanDoesNotAuthorize* flags
  if (r.implementationPlanDoesNotAuthorizeRuntimeExecutionNow !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeRoutePatchingNow !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeRouteWiringNow !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeSeamEnablementNow !== true) return false;
  if (r.implementationPlanDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.implementationPlanDoesNotAuthorizePilot !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeProduction !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeGoLive !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeDocuments !== true) return false;
  if (r.implementationPlanDoesNotAuthorizePhotoOcr !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeScanner !== true) return false;
  if (r.implementationPlanDoesNotAuthorizePaidMode !== true) return false;
  if (r.implementationPlanDoesNotAuthorizeVayloDna !== true) return false;
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
  if (r.scopedRuntimePatchAuthorizedNow !== false) return false;
  if (r.routePatchingAuthorizedNow !== false) return false;
  if (r.routeWiringAuthorizedNow !== false) return false;
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Readiness for next steps
  if (r.readyForFreeQaScopedRuntimePatchAuthorizationDecision !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForControlledInternalTestRuntimeExecution !== false) return false;
  if (r.readyForMinimalRuntimePatchExecution !== false) return false;
  if (r.readyForScopedRuntimePatchExecution !== false) return false;
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
  if (r.futureScopedRuntimePatchAuthorizationDecisionRequired !== true) return false;
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
  // Inherited 8.8J/8.8I/8.8H/8.8G/8.8F/8.8E tamper confirmations
  if (r.freeQaMinimalRuntimePatchExecutionContractTamperConfirmedFrom8x8J !== true) return false;
  if (r.freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected !== r.freeQaMinimalRuntimePatchExecutionContractTamperCaseCount) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8J !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected !== r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8J !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== r.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) return false;
  if (r.freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8J !== true) return false;
  if (r.freeQaInternalTestImplementationPlanTamperCasesRejected !== r.freeQaInternalTestImplementationPlanTamperCaseCount) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8J !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== r.freeQaControlledInternalTestAuthorizationTamperCaseCount) return false;
  if (r.freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8J !== true) return false;
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
  if (!r.plannedPatchScope || r.plannedPatchScope.length === 0) return false;
  if (!r.plannedPatchComponents || r.plannedPatchComponents.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.implementationPlanNotes || r.implementationPlanNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.implementationPlanDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_IMPL_PLAN_STATUS)) return false;
  const scopeJ = r.plannedPatchScope.join(" ");
  if (!scopeJ.includes(SENTINEL_FREE_QA_SCOPE)) return false;
  if (!scopeJ.includes(SENTINEL_ANON_NON_DOC)) return false;
  if (!scopeJ.includes(SENTINEL_CONTROLLED_INTERNAL_ONLY)) return false;
  const componentsJ = r.plannedPatchComponents.join(" ");
  if (!componentsJ.includes(SENTINEL_DISABLED_FLAG)) return false;
  if (!componentsJ.includes(SENTINEL_STRICT_CLASSIFIER)) return false;
  if (!componentsJ.includes(SENTINEL_ROUTE_GUARD)) return false;
  if (!componentsJ.includes(SENTINEL_POST_WIRING_AUDIT_REQUIRED)) return false;
  const boundariesJ = r.nonAuthorizationBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_NO_RUNTIME_EXEC_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_PATCHING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_WIRING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_SEAM_ENABLEMENT_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_SCOPED_PATCH_AUTH_DECISION)) return false;
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
  if (r.freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected !== r.freeQaScopedRuntimePatchImplementationPlanTamperCaseCount) return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88KMutation = (
  r: FreeQaScopedRuntimePatchImplementationPlanResult,
) => FreeQaScopedRuntimePatchImplementationPlanResult;
interface Tamper88KCase { label: string; mutate: Tamper88KMutation; }

const FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES: Tamper88KCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8J" as "8.8K" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "scopedRuntimePatchImplementationPlanOnly false", mutate: (r) => ({ ...r, scopedRuntimePatchImplementationPlanOnly: false as true }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanFileCreated false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractFileModified true", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractFileModified: true as false }) },
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
  { label: "scopedRuntimePatchImplemented true", mutate: (r) => ({ ...r, scopedRuntimePatchImplemented: true as false }) },
  { label: "productionActivationPerformed true", mutate: (r) => ({ ...r, productionActivationPerformed: true as false }) },
  { label: "publicRuntimeActivationPerformed true", mutate: (r) => ({ ...r, publicRuntimeActivationPerformed: true as false }) },
  { label: "seamActivationPerformed true", mutate: (r) => ({ ...r, seamActivationPerformed: true as false }) },
  { label: "documentRuntimeActivationPerformed true", mutate: (r) => ({ ...r, documentRuntimeActivationPerformed: true as false }) },
  { label: "photoOcrRuntimeActivationPerformed true", mutate: (r) => ({ ...r, photoOcrRuntimeActivationPerformed: true as false }) },
  { label: "scannerRuntimeActivationPerformed true", mutate: (r) => ({ ...r, scannerRuntimeActivationPerformed: true as false }) },
  { label: "paidDocumentModeRuntimeActivationPerformed true", mutate: (r) => ({ ...r, paidDocumentModeRuntimeActivationPerformed: true as false }) },
  { label: "vayloDnaRuntimeActivationPerformed true", mutate: (r) => ({ ...r, vayloDnaRuntimeActivationPerformed: true as false }) },
  // Import/runner flags and 8.8J confirmations
  { label: "importedOnlyFreeQaMinimalRuntimePatchExecutionContractRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaMinimalRuntimePatchExecutionContractRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractRunnerCalled false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractRunnerCalled: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractCheckId wrong", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractCheckId: "8.8I" as "8.8J" }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractAllPassed false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractAllPassed: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractConfirmed false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractConfirmed: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractTargetConfirmed: "public_runtime_contract" as ExecutionContractTargetJ }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractStatusConfirmed wrong", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractStatusConfirmed: "unauthorized" as ExecutionContractStatusJ }) },
  // Implementation plan decision
  { label: "implementationPlanTarget wrong", mutate: (r) => ({ ...r, implementationPlanTarget: "public_runtime_plan" as ImplementationPlanTarget88K }) },
  { label: "implementationPlanStatus wrong", mutate: (r) => ({ ...r, implementationPlanStatus: "unauthorized" as ImplementationPlanStatus88K }) },
  { label: "scopedRuntimePatchImplementationPlanCreated false", mutate: (r) => ({ ...r, scopedRuntimePatchImplementationPlanCreated: false as true }) },
  { label: "scopedRuntimePatchImplementationPlanCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, scopedRuntimePatchImplementationPlanCreatedForFreeQaOnly: false as true }) },
  // Planned patch scope flags
  { label: "plannedPatchScopeConfirmed false", mutate: (r) => ({ ...r, plannedPatchScopeConfirmed: false as true }) },
  { label: "plannedPatchAnonymousNonDocumentQuestionOnly false", mutate: (r) => ({ ...r, plannedPatchAnonymousNonDocumentQuestionOnly: false as true }) },
  { label: "plannedPatchControlledInternalOnly false", mutate: (r) => ({ ...r, plannedPatchControlledInternalOnly: false as true }) },
  { label: "plannedPatchNoPublicUsers false", mutate: (r) => ({ ...r, plannedPatchNoPublicUsers: false as true }) },
  { label: "plannedPatchInternalFlagDisabledByDefault false", mutate: (r) => ({ ...r, plannedPatchInternalFlagDisabledByDefault: false as true }) },
  { label: "plannedPatchStrictNonDocumentClassifierRequired false", mutate: (r) => ({ ...r, plannedPatchStrictNonDocumentClassifierRequired: false as true }) },
  { label: "plannedPatchInternalOnlyRouteGuardRequired false", mutate: (r) => ({ ...r, plannedPatchInternalOnlyRouteGuardRequired: false as true }) },
  { label: "plannedPatchPostWiringAuditRequired false", mutate: (r) => ({ ...r, plannedPatchPostWiringAuditRequired: false as true }) },
  { label: "plannedPatchFirstInternalTestRunRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, plannedPatchFirstInternalTestRunRequiresSeparateAuthorization: false as true }) },
  { label: "plannedPatchDocumentInputBlocked false", mutate: (r) => ({ ...r, plannedPatchDocumentInputBlocked: false as true }) },
  { label: "plannedPatchDocumentLikeTextBlocked false", mutate: (r) => ({ ...r, plannedPatchDocumentLikeTextBlocked: false as true }) },
  { label: "plannedPatchPhotoOcrBlocked false", mutate: (r) => ({ ...r, plannedPatchPhotoOcrBlocked: false as true }) },
  { label: "plannedPatchScannerBlocked false", mutate: (r) => ({ ...r, plannedPatchScannerBlocked: false as true }) },
  { label: "plannedPatchUploadBlocked false", mutate: (r) => ({ ...r, plannedPatchUploadBlocked: false as true }) },
  { label: "plannedPatchPaidModeBlocked false", mutate: (r) => ({ ...r, plannedPatchPaidModeBlocked: false as true }) },
  { label: "plannedPatchVayloDnaBlocked false", mutate: (r) => ({ ...r, plannedPatchVayloDnaBlocked: false as true }) },
  { label: "plannedPatchPersistenceBlocked false", mutate: (r) => ({ ...r, plannedPatchPersistenceBlocked: false as true }) },
  { label: "plannedPatchExactLegalDeadlineCalculationBlocked false", mutate: (r) => ({ ...r, plannedPatchExactLegalDeadlineCalculationBlocked: false as true }) },
  { label: "plannedPatchTrustedModelOutputBlocked false", mutate: (r) => ({ ...r, plannedPatchTrustedModelOutputBlocked: false as true }) },
  { label: "plannedPatchProductionEvidenceGatesEnforcementBlocked false", mutate: (r) => ({ ...r, plannedPatchProductionEvidenceGatesEnforcementBlocked: false as true }) },
  { label: "plannedPatchUserVisibleDocumentInterpretationBlocked false", mutate: (r) => ({ ...r, plannedPatchUserVisibleDocumentInterpretationBlocked: false as true }) },
  // implementationPlanDoesNotAuthorize* flags
  { label: "implementationPlanDoesNotAuthorizeRuntimeExecutionNow false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeRuntimeExecutionNow: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeRoutePatchingNow false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeRoutePatchingNow: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeRouteWiringNow false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeRouteWiringNow: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeSeamEnablementNow false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeSeamEnablementNow: false as true }) },
  { label: "implementationPlanDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "implementationPlanDoesNotAuthorizePilot false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizePilot: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeProduction false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeProduction: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeGoLive: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeDocuments false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeDocuments: false as true }) },
  { label: "implementationPlanDoesNotAuthorizePhotoOcr false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizePhotoOcr: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeScanner false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeScanner: false as true }) },
  { label: "implementationPlanDoesNotAuthorizePaidMode false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizePaidMode: false as true }) },
  { label: "implementationPlanDoesNotAuthorizeVayloDna false", mutate: (r) => ({ ...r, implementationPlanDoesNotAuthorizeVayloDna: false as true }) },
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
  { label: "scopedRuntimePatchAuthorizedNow true", mutate: (r) => ({ ...r, scopedRuntimePatchAuthorizedNow: true as false }) },
  { label: "routePatchingAuthorizedNow true", mutate: (r) => ({ ...r, routePatchingAuthorizedNow: true as false }) },
  { label: "routeWiringAuthorizedNow true", mutate: (r) => ({ ...r, routeWiringAuthorizedNow: true as false }) },
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Readiness for next steps
  { label: "readyForFreeQaScopedRuntimePatchAuthorizationDecision false", mutate: (r) => ({ ...r, readyForFreeQaScopedRuntimePatchAuthorizationDecision: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForControlledInternalTestRuntimeExecution true", mutate: (r) => ({ ...r, readyForControlledInternalTestRuntimeExecution: true as false }) },
  { label: "readyForMinimalRuntimePatchExecution true", mutate: (r) => ({ ...r, readyForMinimalRuntimePatchExecution: true as false }) },
  { label: "readyForScopedRuntimePatchExecution true", mutate: (r) => ({ ...r, readyForScopedRuntimePatchExecution: true as false }) },
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
  { label: "futureScopedRuntimePatchAuthorizationDecisionRequired false", mutate: (r) => ({ ...r, futureScopedRuntimePatchAuthorizationDecisionRequired: false as true }) },
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
  // Inherited 8.8J/8.8I/8.8H/8.8G/8.8F/8.8E tamper confirmations
  { label: "freeQaMinimalRuntimePatchExecutionContractTamperConfirmedFrom8x8J false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractTamperConfirmedFrom8x8J: false as true }) },
  { label: "freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected: r.freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected - 1 }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8J false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8J: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected - 1 }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8J false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8J: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected - 1 }) },
  { label: "freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8J false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8J: false as true }) },
  { label: "freeQaInternalTestImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperCasesRejected: r.freeQaInternalTestImplementationPlanTamperCasesRejected - 1 }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8J false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8J: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCasesRejected: r.freeQaControlledInternalTestAuthorizationTamperCasesRejected - 1 }) },
  { label: "freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8J false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8J: false as true }) },
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
  { label: "plannedPatchScope empty", mutate: (r) => ({ ...r, plannedPatchScope: [] }) },
  { label: "plannedPatchComponents empty", mutate: (r) => ({ ...r, plannedPatchComponents: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "implementationPlanNotes empty", mutate: (r) => ({ ...r, implementationPlanNotes: [] }) },
  // Array sentinel checks
  { label: "implementationPlanDecision missing planned_for_future_scoped_runtime_patch_authorization_only sentinel", mutate: (r) => ({ ...r, implementationPlanDecision: r.implementationPlanDecision.map((s) => s.split(SENTINEL_IMPL_PLAN_STATUS).join("omitted")) }) },
  { label: "plannedPatchScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, plannedPatchScope: r.plannedPatchScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "plannedPatchScope missing anonymous non-document questions only sentinel", mutate: (r) => ({ ...r, plannedPatchScope: r.plannedPatchScope.map((s) => s.split(SENTINEL_ANON_NON_DOC).join("omitted")) }) },
  { label: "plannedPatchScope missing controlled internal test only sentinel", mutate: (r) => ({ ...r, plannedPatchScope: r.plannedPatchScope.map((s) => s.split(SENTINEL_CONTROLLED_INTERNAL_ONLY).join("omitted")) }) },
  { label: "plannedPatchComponents missing disabled-by-default internal flag sentinel", mutate: (r) => ({ ...r, plannedPatchComponents: r.plannedPatchComponents.map((s) => s.split(SENTINEL_DISABLED_FLAG).join("omitted")) }) },
  { label: "plannedPatchComponents missing strict non-document classifier sentinel", mutate: (r) => ({ ...r, plannedPatchComponents: r.plannedPatchComponents.map((s) => s.split(SENTINEL_STRICT_CLASSIFIER).join("omitted")) }) },
  { label: "plannedPatchComponents missing internal-only route guard sentinel", mutate: (r) => ({ ...r, plannedPatchComponents: r.plannedPatchComponents.map((s) => s.split(SENTINEL_ROUTE_GUARD).join("omitted")) }) },
  { label: "plannedPatchComponents missing post-wiring audit required sentinel", mutate: (r) => ({ ...r, plannedPatchComponents: r.plannedPatchComponents.map((s) => s.split(SENTINEL_POST_WIRING_AUDIT_REQUIRED).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime execution now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_EXEC_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route patching now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_PATCHING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route wiring now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_WIRING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no seam enablement now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_SEAM_ENABLEMENT_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing scoped runtime patch authorization decision sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_SCOPED_PATCH_AUTH_DECISION).join("omitted")) }) },
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
  { label: "freeQaScopedRuntimePatchImplementationPlanTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanTamperCoveragePassing: false as true }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected: r.freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected - 1 }) },
];

// ─── Exported implementation-plan runner ──────────────────────────────────────

/**
 * Free Smart Talk Q&A Scoped Runtime Patch Implementation Plan runner for
 * 8.8K.
 *
 * Calls the 8.8J Minimal Runtime Patch Execution Contract runner as source
 * of truth. Defines the CONCRETE plan for a FUTURE scoped minimal runtime
 * patch for Free Smart Talk Q&A (anonymous, non-document questions,
 * controlled internal test only). Does NOT implement the patch, patch/wire
 * routes, enable runtime, or enable the Evidence Gates seam.
 */
export function runFreeQaScopedRuntimePatchImplementationPlan(): FreeQaScopedRuntimePatchImplementationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.8J Execution Contract runner as source of truth ───────────
  const j = runFreeQaMinimalRuntimePatchExecutionContract();

  if (j.checkId !== "8.8J") planFailures.push(`8.8J checkId mismatch: expected "8.8J", got "${j.checkId}"`);
  if (j.allPassed !== true) planFailures.push("8.8J allPassed is not true");
  if (j.executionContractTarget !== EXECUTION_CONTRACT_TARGET_J) planFailures.push(`8.8J executionContractTarget mismatch: expected "${EXECUTION_CONTRACT_TARGET_J}", got "${j.executionContractTarget}"`);
  if (j.executionContractStatus !== EXECUTION_CONTRACT_STATUS_J) planFailures.push(`8.8J executionContractStatus mismatch: expected "${EXECUTION_CONTRACT_STATUS_J}", got "${j.executionContractStatus}"`);
  if (j.readyForFreeQaScopedRuntimePatchImplementationPlan !== true) planFailures.push("8.8J readyForFreeQaScopedRuntimePatchImplementationPlan is not true");
  if (j.readyForRuntimeActivation !== false) planFailures.push("8.8J readyForRuntimeActivation is not false");
  if (j.readyForControlledInternalTestRuntimeExecution !== false) planFailures.push("8.8J readyForControlledInternalTestRuntimeExecution is not false");
  if (j.readyForMinimalRuntimePatchExecution !== false) planFailures.push("8.8J readyForMinimalRuntimePatchExecution is not false");
  if (j.readyForRoutePatching !== false) planFailures.push("8.8J readyForRoutePatching is not false");
  if (j.readyForRouteWiring !== false) planFailures.push("8.8J readyForRouteWiring is not false");
  if (j.allowedSyntheticCasesPassed !== j.allowedSyntheticCaseCount) planFailures.push(`8.8J allowed cases: ${j.allowedSyntheticCasesPassed}/${j.allowedSyntheticCaseCount}`);
  if (j.forbiddenSyntheticCasesBlocked !== j.forbiddenSyntheticCaseCount) planFailures.push(`8.8J forbidden cases: ${j.forbiddenSyntheticCasesBlocked}/${j.forbiddenSyntheticCaseCount}`);
  if (j.unsafeUnknownSyntheticCasesFailedClosed !== j.unsafeUnknownSyntheticCaseCount) planFailures.push(`8.8J unsafe/unknown cases: ${j.unsafeUnknownSyntheticCasesFailedClosed}/${j.unsafeUnknownSyntheticCaseCount}`);
  if (j.runtimeActivationPerformed !== false) planFailures.push("8.8J runtimeActivationPerformed is not false");
  if (j.controlledInternalRuntimeExecutionPerformed !== false) planFailures.push("8.8J controlledInternalRuntimeExecutionPerformed is not false");
  if (j.minimalRuntimePatchPerformed !== false) planFailures.push("8.8J minimalRuntimePatchPerformed is not false");
  if (j.seamActivationPerformed !== false) planFailures.push("8.8J seamActivationPerformed is not false");
  if (j.documentRuntimeActivationPerformed !== false) planFailures.push("8.8J documentRuntimeActivationPerformed is not false");
  if (j.photoOcrRuntimeActivationPerformed !== false) planFailures.push("8.8J photoOcrRuntimeActivationPerformed is not false");
  if (j.scannerRuntimeActivationPerformed !== false) planFailures.push("8.8J scannerRuntimeActivationPerformed is not false");
  if (j.paidDocumentModeRuntimeActivationPerformed !== false) planFailures.push("8.8J paidDocumentModeRuntimeActivationPerformed is not false");
  if (j.vayloDnaRuntimeActivationPerformed !== false) planFailures.push("8.8J vayloDnaRuntimeActivationPerformed is not false");
  if (j.routePatchPerformed !== false) planFailures.push("8.8J routePatchPerformed is not false");
  if (j.routeWiringPerformed !== false) planFailures.push("8.8J routeWiringPerformed is not false");
  if (j.realDocumentInputAuthorizedNow !== false) planFailures.push("8.8J realDocumentInputAuthorizedNow is not false");
  if (j.userVisibleOutputAuthorizedNow !== false) planFailures.push("8.8J userVisibleOutputAuthorizedNow is not false");
  if (j.publicRuntimeAuthorizedNow !== false) planFailures.push("8.8J publicRuntimeAuthorizedNow is not false");
  if (j.modelFacingUseAuthorizedNow !== false) planFailures.push("8.8J modelFacingUseAuthorizedNow is not false");
  if (j.evidenceGateExecutionAuthorizedNow !== false) planFailures.push("8.8J evidenceGateExecutionAuthorizedNow is not false");
  if (j.claimAuthorizationAuthorizedNow !== false) planFailures.push("8.8J claimAuthorizationAuthorizedNow is not false");
  if (j.exactDeadlineCalculationAuthorized !== false) planFailures.push("8.8J exactDeadlineCalculationAuthorized is not false");
  if (j.paymentRuntimeAuthorizedNow !== false) planFailures.push("8.8J paymentRuntimeAuthorizedNow is not false");
  if (j.entitlementRuntimeAuthorizedNow !== false) planFailures.push("8.8J entitlementRuntimeAuthorizedNow is not false");
  if (j.checkoutRuntimeAuthorizedNow !== false) planFailures.push("8.8J checkoutRuntimeAuthorizedNow is not false");
  if (j.pilotAuthorizationGranted !== false) planFailures.push("8.8J pilotAuthorizationGranted is not false");
  if (j.productionAuthorizationGranted !== false) planFailures.push("8.8J productionAuthorizationGranted is not false");
  if (j.goLiveAuthorizationGranted !== false) planFailures.push("8.8J goLiveAuthorizationGranted is not false");
  if (j.seamActivationAuthorizedNow !== false) planFailures.push("8.8J seamActivationAuthorizedNow is not false");
  if (j.controlledRuntimeActivationAuthorizedNow !== false) planFailures.push("8.8J controlledRuntimeActivationAuthorizedNow is not false");
  if (j.controlledInternalRuntimeExecutionAuthorizedNow !== false) planFailures.push("8.8J controlledInternalRuntimeExecutionAuthorizedNow is not false");
  if (j.minimalRuntimePatchAuthorizedNow !== false) planFailures.push("8.8J minimalRuntimePatchAuthorizedNow is not false");
  if (j.routePatchingAuthorizedNow !== false) planFailures.push("8.8J routePatchingAuthorizedNow is not false");
  if (j.routeWiringAuthorizedNow !== false) planFailures.push("8.8J routeWiringAuthorizedNow is not false");
  if (j.documentRuntimeAuthorizedNow !== false) planFailures.push("8.8J documentRuntimeAuthorizedNow is not false");
  if (j.photoOcrRuntimeAuthorizedNow !== false) planFailures.push("8.8J photoOcrRuntimeAuthorizedNow is not false");
  if (j.scannerUploadAuthorizedNow !== false) planFailures.push("8.8J scannerUploadAuthorizedNow is not false");
  if (j.vayloDnaRuntimeAuthorizedNow !== false) planFailures.push("8.8J vayloDnaRuntimeAuthorizedNow is not false");
  if (j.freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected !== j.freeQaMinimalRuntimePatchExecutionContractTamperCaseCount) planFailures.push("8.8J own tamper count mismatch");
  if (j.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected !== j.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount) planFailures.push("8.8J inherited 8.8I tamper count mismatch");
  if (j.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== j.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) planFailures.push("8.8J inherited 8.8H tamper count mismatch");
  if (j.freeQaInternalTestImplementationPlanTamperCasesRejected !== j.freeQaInternalTestImplementationPlanTamperCaseCount) planFailures.push("8.8J inherited 8.8G tamper count mismatch");
  if (j.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== j.freeQaControlledInternalTestAuthorizationTamperCaseCount) planFailures.push("8.8J inherited 8.8F tamper count mismatch");
  if (j.freeQaPostActivationReadinessAuditTamperCasesRejected !== j.freeQaPostActivationReadinessAuditTamperCaseCount) planFailures.push("8.8J inherited 8.8E tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const implementationPlanDecision: string[] = [
    `ID-01 [${SENTINEL_IMPL_PLAN_STATUS}]: planned_for_future_scoped_runtime_patch_authorization_only — a future scoped minimal runtime patch is now planned for Free Smart Talk Q&A at the implementation-plan level only.`,
    "ID-02: This plan allows the NEXT phase to create a scoped runtime patch authorization decision.",
    "ID-03: This plan does NOT implement the patch or authorize route patching, route wiring, or seam enablement now.",
    "ID-04: A separate authorization is required before any minimal runtime patch execution, route wiring, or first internal test run.",
  ];

  const plannedPatchScope: string[] = [
    `PS-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A — ${SENTINEL_ANON_NON_DOC} — ${SENTINEL_CONTROLLED_INTERNAL_ONLY} — the planned patch scope is limited accordingly.`,
    "PS-02: Planned patch scope excludes public users, document-like text, OCR/photo/scanner/upload, Paid Document Mode, and Vaylo DNA.",
    "PS-03: Planned patch scope excludes persistence, trusted model output, exact legal deadline calculation, production Evidence Gates enforcement, and user-visible document interpretation.",
  ];

  const plannedPatchComponents: string[] = [
    `PC-01 [${SENTINEL_DISABLED_FLAG}]: disabled-by-default internal flag — the future patch may describe a disabled-by-default internal flag that must remain off unless separately authorized.`,
    "PC-02: The future patch may describe a future isolated Free Q&A execution path, kept separate from all other runtime paths.",
    `PC-03 [${SENTINEL_STRICT_CLASSIFIER}]: strict non-document classifier — the future patch may describe a future strict non-document input classifier to enforce the anonymous non-document scope.`,
    `PC-04 [${SENTINEL_ROUTE_GUARD}]: internal-only route guard — the future patch may describe a future route guard limiting execution to internal-only test contexts.`,
    `PC-05 [${SENTINEL_POST_WIRING_AUDIT_REQUIRED}]: post-wiring audit required — the future patch may describe a future post-wiring audit requirement before any wider use.`,
    "PC-06: The future patch may describe a future first internal test run authorization requirement, separate from this plan.",
    "PC-07: None of the above components are implemented by this phase; they are described only as a plan for a future, separately authorized patch.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_EXEC_NOW}]: no runtime execution now — this plan does not execute runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_ROUTE_PATCHING_NOW}]: no route patching now — this plan does not patch any route file now.`,
    `NB-03 [${SENTINEL_NO_ROUTE_WIRING_NOW}]: no route wiring now — this plan does not wire any route file now.`,
    `NB-04 [${SENTINEL_NO_SEAM_ENABLEMENT_NOW}]: no seam enablement now — this plan does not enable the Evidence Gates seam now.`,
    `NB-05 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document, photo, OCR, and scanner input remain unauthorized by this plan.`,
    `NB-06 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this plan.`,
    "NB-07: no pilot, no production, no go-live authorization is granted by this plan.",
    "NB-08: no exact legal deadline calculation, no trusted model output, no production Evidence Gates enforcement, and no user-visible document interpretation authorization is granted by this plan.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_SCOPED_PATCH_AUTH_DECISION}]: scoped runtime patch authorization decision — the next phase may create a scoped runtime patch authorization decision.`,
    `FP-02 [${SENTINEL_MIN_PATCH_SEP_AUTH}]: minimal runtime patch requires separate authorization — any minimal route/runtime patch execution needs its own authorization.`,
    `FP-03 [${SENTINEL_ROUTE_WIRING_SEP_AUTH}]: route wiring requires separate authorization before any route file is touched.`,
    "FP-04: future Evidence Gates seam enablement requires separate authorization.",
    `FP-05 [${SENTINEL_POST_WIRING_AUDIT}]: post-wiring audit — a post-wiring audit is required after any future runtime patch.`,
    `FP-06 [${SENTINEL_FIRST_TEST_RUN_SEP_AUTH}]: first internal test run requires separate authorization — the first actual internal test execution needs its own authorization.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01: ${SENTINEL_RUNTIME_EXEC_BLOCKED} — controlled runtime execution remains globally blocked pending a future scoped runtime patch authorization decision.`,
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
    `GD-01: ${SENTINEL_CLAIM_RULE_OR} — ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8K.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8K.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8K.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8K.)",
    `GD-05: ${SENTINEL_TRAP_HEURISTIC} — enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8K.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8K.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8K.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8K.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8K.)",
  ];

  const implementationPlanNotes: string[] = [
    "IN-01: 8.8K scoped runtime patch implementation plan created for Free Smart Talk Q&A only.",
    `IN-02: 8.8J confirmed — checkId=${j.checkId}, allPassed=${j.allPassed}, executionContractTarget=${j.executionContractTarget}.`,
    `IN-03: Synthetic matrix inherited via 8.8J: ${j.allowedSyntheticCasesPassed}/${j.allowedSyntheticCaseCount} allowed, ${j.forbiddenSyntheticCasesBlocked}/${j.forbiddenSyntheticCaseCount} forbidden blocked, ${j.unsafeUnknownSyntheticCasesFailedClosed}/${j.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "IN-04: This is an implementation-plan-only phase; no runtime, route, or seam files were touched.",
    "IN-05: All runtime/public/document activation flags remain false after this plan.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES.length;

  const provisional: FreeQaScopedRuntimePatchImplementationPlanResult = {
    checkId: "8.8K",
    allPassed: true,
    scopedRuntimePatchImplementationPlanOnly: true,
    freeQaScopedRuntimePatchImplementationPlanFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaMinimalRuntimePatchExecutionContractFileModified: false,
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
    scopedRuntimePatchImplemented: false,
    productionActivationPerformed: false,
    publicRuntimeActivationPerformed: false,
    seamActivationPerformed: false,
    documentRuntimeActivationPerformed: false,
    photoOcrRuntimeActivationPerformed: false,
    scannerRuntimeActivationPerformed: false,
    paidDocumentModeRuntimeActivationPerformed: false,
    vayloDnaRuntimeActivationPerformed: false,
    importedOnlyFreeQaMinimalRuntimePatchExecutionContractRunner: true,
    noOtherImportsUsed: true,
    freeQaMinimalRuntimePatchExecutionContractRunnerCalled: true,
    freeQaMinimalRuntimePatchExecutionContractCheckId: "8.8J",
    freeQaMinimalRuntimePatchExecutionContractAllPassed: true,
    freeQaMinimalRuntimePatchExecutionContractConfirmed: true,
    freeQaMinimalRuntimePatchExecutionContractTargetConfirmed: EXECUTION_CONTRACT_TARGET_J,
    freeQaMinimalRuntimePatchExecutionContractStatusConfirmed: EXECUTION_CONTRACT_STATUS_J,
    implementationPlanTarget: IMPLEMENTATION_PLAN_TARGET,
    implementationPlanStatus: IMPLEMENTATION_PLAN_STATUS,
    scopedRuntimePatchImplementationPlanCreated: true,
    scopedRuntimePatchImplementationPlanCreatedForFreeQaOnly: true,
    plannedPatchScopeConfirmed: true,
    plannedPatchAnonymousNonDocumentQuestionOnly: true,
    plannedPatchControlledInternalOnly: true,
    plannedPatchNoPublicUsers: true,
    plannedPatchInternalFlagDisabledByDefault: true,
    plannedPatchStrictNonDocumentClassifierRequired: true,
    plannedPatchInternalOnlyRouteGuardRequired: true,
    plannedPatchPostWiringAuditRequired: true,
    plannedPatchFirstInternalTestRunRequiresSeparateAuthorization: true,
    plannedPatchDocumentInputBlocked: true,
    plannedPatchDocumentLikeTextBlocked: true,
    plannedPatchPhotoOcrBlocked: true,
    plannedPatchScannerBlocked: true,
    plannedPatchUploadBlocked: true,
    plannedPatchPaidModeBlocked: true,
    plannedPatchVayloDnaBlocked: true,
    plannedPatchPersistenceBlocked: true,
    plannedPatchExactLegalDeadlineCalculationBlocked: true,
    plannedPatchTrustedModelOutputBlocked: true,
    plannedPatchProductionEvidenceGatesEnforcementBlocked: true,
    plannedPatchUserVisibleDocumentInterpretationBlocked: true,
    implementationPlanDoesNotAuthorizeRuntimeExecutionNow: true,
    implementationPlanDoesNotAuthorizeRoutePatchingNow: true,
    implementationPlanDoesNotAuthorizeRouteWiringNow: true,
    implementationPlanDoesNotAuthorizeSeamEnablementNow: true,
    implementationPlanDoesNotAuthorizePublicRuntime: true,
    implementationPlanDoesNotAuthorizePilot: true,
    implementationPlanDoesNotAuthorizeProduction: true,
    implementationPlanDoesNotAuthorizeGoLive: true,
    implementationPlanDoesNotAuthorizeDocuments: true,
    implementationPlanDoesNotAuthorizePhotoOcr: true,
    implementationPlanDoesNotAuthorizeScanner: true,
    implementationPlanDoesNotAuthorizePaidMode: true,
    implementationPlanDoesNotAuthorizeVayloDna: true,
    allowedSyntheticCaseCount: j.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: j.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: j.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: j.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: j.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: j.unsafeUnknownSyntheticCasesFailedClosed,
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
    scopedRuntimePatchAuthorizedNow: false,
    routePatchingAuthorizedNow: false,
    routeWiringAuthorizedNow: false,
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    readyForFreeQaScopedRuntimePatchAuthorizationDecision: true,
    readyForRuntimeActivation: false,
    readyForControlledInternalTestRuntimeExecution: false,
    readyForMinimalRuntimePatchExecution: false,
    readyForScopedRuntimePatchExecution: false,
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
    futureScopedRuntimePatchAuthorizationDecisionRequired: true,
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
    freeQaMinimalRuntimePatchExecutionContractTamperConfirmedFrom8x8J: true,
    freeQaMinimalRuntimePatchExecutionContractTamperCaseCount: j.freeQaMinimalRuntimePatchExecutionContractTamperCaseCount,
    freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected: j.freeQaMinimalRuntimePatchExecutionContractTamperCasesRejected,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperConfirmedFrom8x8J: true,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount: j.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: j.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected,
    freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8J: true,
    freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: j.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount,
    freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: j.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected,
    freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8J: true,
    freeQaInternalTestImplementationPlanTamperCaseCount: j.freeQaInternalTestImplementationPlanTamperCaseCount,
    freeQaInternalTestImplementationPlanTamperCasesRejected: j.freeQaInternalTestImplementationPlanTamperCasesRejected,
    freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8J: true,
    freeQaControlledInternalTestAuthorizationTamperCaseCount: j.freeQaControlledInternalTestAuthorizationTamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected: j.freeQaControlledInternalTestAuthorizationTamperCasesRejected,
    freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8J: true,
    freeQaPostActivationReadinessAuditTamperCaseCount: j.freeQaPostActivationReadinessAuditTamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: j.freeQaPostActivationReadinessAuditTamperCasesRejected,
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
    plannedPatchScope,
    plannedPatchComponents,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    implementationPlanNotes,
    freeQaScopedRuntimePatchImplementationPlanTamperCaseCount: tamperCaseCount,
    freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected: tamperCaseCount,
    freeQaScopedRuntimePatchImplementationPlanTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaScopedRuntimePatchImplementationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8K tamper cases ─────────────────────────────────────────────
  let freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_IMPLEMENTATION_PLAN_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaScopedRuntimePatchImplementationPlanResult(tc.mutate(provisional))) {
      freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8K tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed =
    planFailures.length === 0 &&
    freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected === tamperCaseCount;

  const finalImplementationPlanNotes: string[] = [
    ...implementationPlanNotes,
    `8.8K tamper cases: ${freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected,
    implementationPlanNotes: finalImplementationPlanNotes,
  };
}
