/**
 * PHASE 8.8I — Free Q&A Minimal Runtime Patch Authorization Plan
 *
 * Authorization-plan-only phase. This phase plans a FUTURE minimal runtime
 * patch authorization for Free Smart Talk Q&A (anonymous, non-document
 * questions, controlled internal test only). It does NOT implement the
 * patch, patch or wire routes, enable runtime, or enable the Evidence Gates
 * seam.
 *
 * This phase MUST NOT:
 * - Implement the patch, patch routes, or wire routes
 * - Enable runtime or the Evidence Gates seam
 * - Execute controlled internal runtime
 * - Modify, import, or execute runSmartTalk
 * - Process real user input or documents
 * - Call models
 *
 * Authorization plan decision:
 * - authorizationPlanTarget: "free_smart_talk_qa_minimal_runtime_patch_authorization_plan_only"
 * - authorizationPlanStatus: "planned_for_future_scoped_minimal_runtime_patch_only"
 * - minimalRuntimePatchAuthorizationPlanCreated: true
 *
 * This plan allows the NEXT phase to create a separately authorized minimal
 * runtime patch execution contract. It does not implement the patch or
 * authorize route patching, route wiring, seam enablement, public runtime,
 * pilot, production, go-live, documents, OCR/photo/scanner, paid mode,
 * Vaylo DNA, exact legal deadline calculation, or trusted model output now.
 */

import { runFreeQaControlledInternalRuntimeExecutionContract } from "./run-free-qa-controlled-internal-runtime-execution-contract";

// ─── Literal types ────────────────────────────────────────────────────────────

type ContractTargetH = "free_smart_talk_qa_controlled_internal_runtime_execution_contract_only";
type ContractStatusH = "contract_ready_for_future_minimal_runtime_patch_authorization_only";
type AuthorizationPlanTarget88I = "free_smart_talk_qa_minimal_runtime_patch_authorization_plan_only";
type AuthorizationPlanStatus88I = "planned_for_future_scoped_minimal_runtime_patch_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaMinimalRuntimePatchAuthorizationPlanResult {
  checkId: "8.8I";
  allPassed: boolean;
  minimalRuntimePatchAuthorizationPlanOnly: true;
  freeQaMinimalRuntimePatchAuthorizationPlanFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaControlledInternalRuntimeExecutionContractFileModified: false;
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
  importedOnlyFreeQaControlledInternalRuntimeExecutionContractRunner: true;
  noOtherImportsUsed: true;
  freeQaControlledInternalRuntimeExecutionContractRunnerCalled: true;
  freeQaControlledInternalRuntimeExecutionContractCheckId: "8.8H";
  freeQaControlledInternalRuntimeExecutionContractAllPassed: true;
  freeQaControlledInternalRuntimeExecutionContractConfirmed: true;
  freeQaControlledInternalRuntimeExecutionContractTargetConfirmed: ContractTargetH;
  freeQaControlledInternalRuntimeExecutionContractStatusConfirmed: ContractStatusH;
  authorizationPlanTarget: AuthorizationPlanTarget88I;
  authorizationPlanStatus: AuthorizationPlanStatus88I;
  minimalRuntimePatchAuthorizationPlanCreated: true;
  minimalRuntimePatchAuthorizationPlanCreatedForFreeQaOnly: true;
  plannedPatchScopeConfirmed: true;
  plannedPatchAnonymousNonDocumentQuestionOnly: true;
  plannedPatchControlledInternalOnly: true;
  plannedPatchNoPublicUsers: true;
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
  authorizationPlanDoesNotAuthorizeRuntimeExecutionNow: true;
  authorizationPlanDoesNotAuthorizeRoutePatchingNow: true;
  authorizationPlanDoesNotAuthorizeRouteWiringNow: true;
  authorizationPlanDoesNotAuthorizeSeamEnablementNow: true;
  authorizationPlanDoesNotAuthorizePublicRuntime: true;
  authorizationPlanDoesNotAuthorizePilot: true;
  authorizationPlanDoesNotAuthorizeProduction: true;
  authorizationPlanDoesNotAuthorizeGoLive: true;
  authorizationPlanDoesNotAuthorizeDocuments: true;
  authorizationPlanDoesNotAuthorizePhotoOcr: true;
  authorizationPlanDoesNotAuthorizeScanner: true;
  authorizationPlanDoesNotAuthorizePaidMode: true;
  authorizationPlanDoesNotAuthorizeVayloDna: true;
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
  readyForFreeQaMinimalRuntimePatchExecutionContract: true;
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
  futureMinimalRuntimePatchExecutionContractRequired: true;
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
  freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8H: true;
  freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: number;
  freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: number;
  freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8H: true;
  freeQaInternalTestImplementationPlanTamperCaseCount: number;
  freeQaInternalTestImplementationPlanTamperCasesRejected: number;
  freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8H: true;
  freeQaControlledInternalTestAuthorizationTamperCaseCount: number;
  freeQaControlledInternalTestAuthorizationTamperCasesRejected: number;
  freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8H: true;
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
  authorizationPlanDecision: string[];
  plannedPatchScope: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  authorizationPlanNotes: string[];
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount: number;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: number;
  freeQaMinimalRuntimePatchAuthorizationPlanTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const CONTRACT_TARGET_H: ContractTargetH = "free_smart_talk_qa_controlled_internal_runtime_execution_contract_only";
const CONTRACT_STATUS_H: ContractStatusH = "contract_ready_for_future_minimal_runtime_patch_authorization_only";
const AUTHORIZATION_PLAN_TARGET: AuthorizationPlanTarget88I = "free_smart_talk_qa_minimal_runtime_patch_authorization_plan_only";
const AUTHORIZATION_PLAN_STATUS: AuthorizationPlanStatus88I = "planned_for_future_scoped_minimal_runtime_patch_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_PLAN_STATUS = "planned_for_future_scoped_minimal_runtime_patch_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_ANON_NON_DOC = "anonymous non-document questions only";
const SENTINEL_CONTROLLED_INTERNAL_ONLY = "controlled internal test only";
const SENTINEL_NO_RUNTIME_EXEC_NOW = "no runtime execution now";
const SENTINEL_NO_ROUTE_PATCHING_NOW = "no route patching now";
const SENTINEL_NO_ROUTE_WIRING_NOW = "no route wiring now";
const SENTINEL_NO_SEAM_ENABLEMENT_NOW = "no seam enablement now";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_PATCH_EXEC_CONTRACT = "minimal runtime patch execution contract";
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

function _isCanonicalFreeQaMinimalRuntimePatchAuthorizationPlanResult(
  r: FreeQaMinimalRuntimePatchAuthorizationPlanResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8I") return false;
  if (r.allPassed !== true) return false;
  if (r.minimalRuntimePatchAuthorizationPlanOnly !== true) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractFileModified !== false) return false;
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
  // Import/runner flags and 8.8H confirmations
  if (r.importedOnlyFreeQaControlledInternalRuntimeExecutionContractRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractRunnerCalled !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractCheckId !== "8.8H") return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractAllPassed !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractConfirmed !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTargetConfirmed !== CONTRACT_TARGET_H) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractStatusConfirmed !== CONTRACT_STATUS_H) return false;
  // Authorization plan decision
  if (r.authorizationPlanTarget !== AUTHORIZATION_PLAN_TARGET) return false;
  if (r.authorizationPlanStatus !== AUTHORIZATION_PLAN_STATUS) return false;
  if (r.minimalRuntimePatchAuthorizationPlanCreated !== true) return false;
  if (r.minimalRuntimePatchAuthorizationPlanCreatedForFreeQaOnly !== true) return false;
  // Planned patch scope flags
  if (r.plannedPatchScopeConfirmed !== true) return false;
  if (r.plannedPatchAnonymousNonDocumentQuestionOnly !== true) return false;
  if (r.plannedPatchControlledInternalOnly !== true) return false;
  if (r.plannedPatchNoPublicUsers !== true) return false;
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
  // authorizationPlanDoesNotAuthorize* flags
  if (r.authorizationPlanDoesNotAuthorizeRuntimeExecutionNow !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeRoutePatchingNow !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeRouteWiringNow !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeSeamEnablementNow !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizePilot !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeProduction !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeGoLive !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeDocuments !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizePhotoOcr !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeScanner !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizePaidMode !== true) return false;
  if (r.authorizationPlanDoesNotAuthorizeVayloDna !== true) return false;
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
  if (r.readyForFreeQaMinimalRuntimePatchExecutionContract !== true) return false;
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
  if (r.futureMinimalRuntimePatchExecutionContractRequired !== true) return false;
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
  // Inherited 8.8H/8.8G/8.8F/8.8E tamper confirmations
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8H !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== r.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) return false;
  if (r.freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8H !== true) return false;
  if (r.freeQaInternalTestImplementationPlanTamperCasesRejected !== r.freeQaInternalTestImplementationPlanTamperCaseCount) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8H !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== r.freeQaControlledInternalTestAuthorizationTamperCaseCount) return false;
  if (r.freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8H !== true) return false;
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
  if (!r.authorizationPlanDecision || r.authorizationPlanDecision.length === 0) return false;
  if (!r.plannedPatchScope || r.plannedPatchScope.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.authorizationPlanNotes || r.authorizationPlanNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.authorizationPlanDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_PLAN_STATUS)) return false;
  const scopeJ = r.plannedPatchScope.join(" ");
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
  if (!futureJ.includes(SENTINEL_PATCH_EXEC_CONTRACT)) return false;
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
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected !== r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount) return false;
  if (r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88IMutation = (
  r: FreeQaMinimalRuntimePatchAuthorizationPlanResult,
) => FreeQaMinimalRuntimePatchAuthorizationPlanResult;
interface Tamper88ICase { label: string; mutate: Tamper88IMutation; }

const FREE_QA_AUTHORIZATION_PLAN_TAMPER_CASES: Tamper88ICase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8H" as "8.8I" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "minimalRuntimePatchAuthorizationPlanOnly false", mutate: (r) => ({ ...r, minimalRuntimePatchAuthorizationPlanOnly: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanFileCreated false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractFileModified true", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractFileModified: true as false }) },
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
  // Import/runner flags and 8.8H confirmations
  { label: "importedOnlyFreeQaControlledInternalRuntimeExecutionContractRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaControlledInternalRuntimeExecutionContractRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractRunnerCalled false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractRunnerCalled: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractCheckId wrong", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractCheckId: "8.8G" as "8.8H" }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractAllPassed false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractAllPassed: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractConfirmed false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractConfirmed: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTargetConfirmed: "public_runtime_contract" as ContractTargetH }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractStatusConfirmed wrong", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractStatusConfirmed: "unauthorized" as ContractStatusH }) },
  // Authorization plan decision
  { label: "authorizationPlanTarget wrong", mutate: (r) => ({ ...r, authorizationPlanTarget: "public_runtime_plan" as AuthorizationPlanTarget88I }) },
  { label: "authorizationPlanStatus wrong", mutate: (r) => ({ ...r, authorizationPlanStatus: "unauthorized" as AuthorizationPlanStatus88I }) },
  { label: "minimalRuntimePatchAuthorizationPlanCreated false", mutate: (r) => ({ ...r, minimalRuntimePatchAuthorizationPlanCreated: false as true }) },
  { label: "minimalRuntimePatchAuthorizationPlanCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, minimalRuntimePatchAuthorizationPlanCreatedForFreeQaOnly: false as true }) },
  // Planned patch scope flags
  { label: "plannedPatchScopeConfirmed false", mutate: (r) => ({ ...r, plannedPatchScopeConfirmed: false as true }) },
  { label: "plannedPatchAnonymousNonDocumentQuestionOnly false", mutate: (r) => ({ ...r, plannedPatchAnonymousNonDocumentQuestionOnly: false as true }) },
  { label: "plannedPatchControlledInternalOnly false", mutate: (r) => ({ ...r, plannedPatchControlledInternalOnly: false as true }) },
  { label: "plannedPatchNoPublicUsers false", mutate: (r) => ({ ...r, plannedPatchNoPublicUsers: false as true }) },
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
  // authorizationPlanDoesNotAuthorize* flags
  { label: "authorizationPlanDoesNotAuthorizeRuntimeExecutionNow false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeRuntimeExecutionNow: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeRoutePatchingNow false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeRoutePatchingNow: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeRouteWiringNow false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeRouteWiringNow: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeSeamEnablementNow false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeSeamEnablementNow: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizePilot false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizePilot: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeProduction false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeProduction: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeGoLive: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeDocuments false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeDocuments: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizePhotoOcr false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizePhotoOcr: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeScanner false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeScanner: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizePaidMode false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizePaidMode: false as true }) },
  { label: "authorizationPlanDoesNotAuthorizeVayloDna false", mutate: (r) => ({ ...r, authorizationPlanDoesNotAuthorizeVayloDna: false as true }) },
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
  { label: "readyForFreeQaMinimalRuntimePatchExecutionContract false", mutate: (r) => ({ ...r, readyForFreeQaMinimalRuntimePatchExecutionContract: false as true }) },
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
  { label: "futureMinimalRuntimePatchExecutionContractRequired false", mutate: (r) => ({ ...r, futureMinimalRuntimePatchExecutionContractRequired: false as true }) },
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
  // Inherited 8.8H/8.8G/8.8F/8.8E tamper confirmations
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8H false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8H: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected - 1 }) },
  { label: "freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8H false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8H: false as true }) },
  { label: "freeQaInternalTestImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperCasesRejected: r.freeQaInternalTestImplementationPlanTamperCasesRejected - 1 }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8H false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8H: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCasesRejected: r.freeQaControlledInternalTestAuthorizationTamperCasesRejected - 1 }) },
  { label: "freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8H false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8H: false as true }) },
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
  { label: "authorizationPlanDecision empty", mutate: (r) => ({ ...r, authorizationPlanDecision: [] }) },
  { label: "plannedPatchScope empty", mutate: (r) => ({ ...r, plannedPatchScope: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "authorizationPlanNotes empty", mutate: (r) => ({ ...r, authorizationPlanNotes: [] }) },
  // Array sentinel checks
  { label: "authorizationPlanDecision missing planned_for_future_scoped_minimal_runtime_patch_only sentinel", mutate: (r) => ({ ...r, authorizationPlanDecision: r.authorizationPlanDecision.map((s) => s.split(SENTINEL_PLAN_STATUS).join("omitted")) }) },
  { label: "plannedPatchScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, plannedPatchScope: r.plannedPatchScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "plannedPatchScope missing anonymous non-document questions only sentinel", mutate: (r) => ({ ...r, plannedPatchScope: r.plannedPatchScope.map((s) => s.split(SENTINEL_ANON_NON_DOC).join("omitted")) }) },
  { label: "plannedPatchScope missing controlled internal test only sentinel", mutate: (r) => ({ ...r, plannedPatchScope: r.plannedPatchScope.map((s) => s.split(SENTINEL_CONTROLLED_INTERNAL_ONLY).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime execution now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_EXEC_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route patching now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_PATCHING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route wiring now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_WIRING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no seam enablement now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_SEAM_ENABLEMENT_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing minimal runtime patch execution contract sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_PATCH_EXEC_CONTRACT).join("omitted")) }) },
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
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTamperCoveragePassing: false as true }) },
  { label: "freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: r.freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected - 1 }) },
];

// ─── Exported authorization-plan runner ───────────────────────────────────────

/**
 * Free Smart Talk Q&A Minimal Runtime Patch Authorization Plan runner for
 * 8.8I.
 *
 * Calls the 8.8H Controlled Internal Runtime Execution Contract runner as
 * source of truth. Plans a FUTURE minimal runtime patch authorization for
 * Free Smart Talk Q&A (anonymous, non-document questions, controlled
 * internal test only). Does NOT implement the patch, patch/wire routes,
 * enable runtime, or enable the Evidence Gates seam.
 */
export function runFreeQaMinimalRuntimePatchAuthorizationPlan(): FreeQaMinimalRuntimePatchAuthorizationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.8H Contract runner as source of truth ──────────────────────
  const h = runFreeQaControlledInternalRuntimeExecutionContract();

  if (h.checkId !== "8.8H") planFailures.push(`8.8H checkId mismatch: expected "8.8H", got "${h.checkId}"`);
  if (h.allPassed !== true) planFailures.push("8.8H allPassed is not true");
  if (h.contractTarget !== CONTRACT_TARGET_H) planFailures.push(`8.8H contractTarget mismatch: expected "${CONTRACT_TARGET_H}", got "${h.contractTarget}"`);
  if (h.contractStatus !== CONTRACT_STATUS_H) planFailures.push(`8.8H contractStatus mismatch: expected "${CONTRACT_STATUS_H}", got "${h.contractStatus}"`);
  if (h.readyForFreeQaMinimalRuntimePatchAuthorizationPlan !== true) planFailures.push("8.8H readyForFreeQaMinimalRuntimePatchAuthorizationPlan is not true");
  if (h.readyForRuntimeActivation !== false) planFailures.push("8.8H readyForRuntimeActivation is not false");
  if (h.readyForControlledInternalTestRuntimeExecution !== false) planFailures.push("8.8H readyForControlledInternalTestRuntimeExecution is not false");
  if (h.allowedSyntheticCasesPassed !== h.allowedSyntheticCaseCount) planFailures.push(`8.8H allowed cases: ${h.allowedSyntheticCasesPassed}/${h.allowedSyntheticCaseCount}`);
  if (h.forbiddenSyntheticCasesBlocked !== h.forbiddenSyntheticCaseCount) planFailures.push(`8.8H forbidden cases: ${h.forbiddenSyntheticCasesBlocked}/${h.forbiddenSyntheticCaseCount}`);
  if (h.unsafeUnknownSyntheticCasesFailedClosed !== h.unsafeUnknownSyntheticCaseCount) planFailures.push(`8.8H unsafe/unknown cases: ${h.unsafeUnknownSyntheticCasesFailedClosed}/${h.unsafeUnknownSyntheticCaseCount}`);
  if (h.runtimeActivationPerformed !== false) planFailures.push("8.8H runtimeActivationPerformed is not false");
  if (h.controlledInternalRuntimeExecutionPerformed !== false) planFailures.push("8.8H controlledInternalRuntimeExecutionPerformed is not false");
  if (h.seamActivationPerformed !== false) planFailures.push("8.8H seamActivationPerformed is not false");
  if (h.documentRuntimeActivationPerformed !== false) planFailures.push("8.8H documentRuntimeActivationPerformed is not false");
  if (h.photoOcrRuntimeActivationPerformed !== false) planFailures.push("8.8H photoOcrRuntimeActivationPerformed is not false");
  if (h.scannerRuntimeActivationPerformed !== false) planFailures.push("8.8H scannerRuntimeActivationPerformed is not false");
  if (h.paidDocumentModeRuntimeActivationPerformed !== false) planFailures.push("8.8H paidDocumentModeRuntimeActivationPerformed is not false");
  if (h.vayloDnaRuntimeActivationPerformed !== false) planFailures.push("8.8H vayloDnaRuntimeActivationPerformed is not false");
  if (h.routePatchPerformed !== false) planFailures.push("8.8H routePatchPerformed is not false");
  if (h.routeWiringPerformed !== false) planFailures.push("8.8H routeWiringPerformed is not false");
  if (h.realDocumentInputAuthorizedNow !== false) planFailures.push("8.8H realDocumentInputAuthorizedNow is not false");
  if (h.userVisibleOutputAuthorizedNow !== false) planFailures.push("8.8H userVisibleOutputAuthorizedNow is not false");
  if (h.publicRuntimeAuthorizedNow !== false) planFailures.push("8.8H publicRuntimeAuthorizedNow is not false");
  if (h.modelFacingUseAuthorizedNow !== false) planFailures.push("8.8H modelFacingUseAuthorizedNow is not false");
  if (h.evidenceGateExecutionAuthorizedNow !== false) planFailures.push("8.8H evidenceGateExecutionAuthorizedNow is not false");
  if (h.claimAuthorizationAuthorizedNow !== false) planFailures.push("8.8H claimAuthorizationAuthorizedNow is not false");
  if (h.exactDeadlineCalculationAuthorized !== false) planFailures.push("8.8H exactDeadlineCalculationAuthorized is not false");
  if (h.paymentRuntimeAuthorizedNow !== false) planFailures.push("8.8H paymentRuntimeAuthorizedNow is not false");
  if (h.entitlementRuntimeAuthorizedNow !== false) planFailures.push("8.8H entitlementRuntimeAuthorizedNow is not false");
  if (h.checkoutRuntimeAuthorizedNow !== false) planFailures.push("8.8H checkoutRuntimeAuthorizedNow is not false");
  if (h.pilotAuthorizationGranted !== false) planFailures.push("8.8H pilotAuthorizationGranted is not false");
  if (h.productionAuthorizationGranted !== false) planFailures.push("8.8H productionAuthorizationGranted is not false");
  if (h.goLiveAuthorizationGranted !== false) planFailures.push("8.8H goLiveAuthorizationGranted is not false");
  if (h.seamActivationAuthorizedNow !== false) planFailures.push("8.8H seamActivationAuthorizedNow is not false");
  if (h.controlledRuntimeActivationAuthorizedNow !== false) planFailures.push("8.8H controlledRuntimeActivationAuthorizedNow is not false");
  if (h.controlledInternalRuntimeExecutionAuthorizedNow !== false) planFailures.push("8.8H controlledInternalRuntimeExecutionAuthorizedNow is not false");
  if (h.documentRuntimeAuthorizedNow !== false) planFailures.push("8.8H documentRuntimeAuthorizedNow is not false");
  if (h.photoOcrRuntimeAuthorizedNow !== false) planFailures.push("8.8H photoOcrRuntimeAuthorizedNow is not false");
  if (h.scannerUploadAuthorizedNow !== false) planFailures.push("8.8H scannerUploadAuthorizedNow is not false");
  if (h.vayloDnaRuntimeAuthorizedNow !== false) planFailures.push("8.8H vayloDnaRuntimeAuthorizedNow is not false");
  if (h.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== h.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) planFailures.push("8.8H own tamper count mismatch");
  if (h.freeQaInternalTestImplementationPlanTamperCasesRejected !== h.freeQaInternalTestImplementationPlanTamperCaseCount) planFailures.push("8.8H inherited 8.8G tamper count mismatch");
  if (h.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== h.freeQaControlledInternalTestAuthorizationTamperCaseCount) planFailures.push("8.8H inherited 8.8F tamper count mismatch");
  if (h.freeQaPostActivationReadinessAuditTamperCasesRejected !== h.freeQaPostActivationReadinessAuditTamperCaseCount) planFailures.push("8.8H inherited 8.8E tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const authorizationPlanDecision: string[] = [
    `AD-01 [${SENTINEL_PLAN_STATUS}]: planned_for_future_scoped_minimal_runtime_patch_only — a future minimal runtime patch authorization for Free Smart Talk Q&A is now planned at the authorization-plan level only.`,
    "AD-02: This plan allows the NEXT phase to create a separately authorized minimal runtime patch execution contract.",
    "AD-03: This plan does NOT implement the patch or authorize route patching, route wiring, or seam enablement now.",
    "AD-04: A separate authorization is required before any minimal runtime patch execution, route wiring, or first internal test run.",
  ];

  const plannedPatchScope: string[] = [
    `PS-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A — ${SENTINEL_ANON_NON_DOC} — ${SENTINEL_CONTROLLED_INTERNAL_ONLY} — the planned patch scope is limited accordingly.`,
    "PS-02: Planned patch scope excludes public users, document-like text, OCR/photo/scanner/upload, Paid Document Mode, and Vaylo DNA.",
    "PS-03: Planned patch scope excludes persistence, trusted model output, and exact legal deadline calculation.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_EXEC_NOW}]: no runtime execution now — this plan does not execute runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_ROUTE_PATCHING_NOW}]: no route patching now — this plan does not patch any route file now.`,
    `NB-03 [${SENTINEL_NO_ROUTE_WIRING_NOW}]: no route wiring now — this plan does not wire any route file now.`,
    `NB-04 [${SENTINEL_NO_SEAM_ENABLEMENT_NOW}]: no seam enablement now — this plan does not enable the Evidence Gates seam now.`,
    `NB-05 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document, photo, OCR, and scanner input remain unauthorized by this plan.`,
    `NB-06 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this plan.`,
    "NB-07: no pilot, no production, no go-live authorization is granted by this plan.",
    "NB-08: no exact legal deadline calculation and no trusted model output authorization is granted by this plan.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_PATCH_EXEC_CONTRACT}]: minimal runtime patch execution contract — the next phase may create a separately authorized minimal runtime patch execution contract.`,
    `FP-02 [${SENTINEL_MIN_PATCH_SEP_AUTH}]: minimal runtime patch requires separate authorization — any minimal route/runtime patch execution needs its own authorization.`,
    `FP-03 [${SENTINEL_ROUTE_WIRING_SEP_AUTH}]: route wiring requires separate authorization before any route file is touched.`,
    "FP-04: future Evidence Gates seam enablement requires separate authorization.",
    `FP-05 [${SENTINEL_POST_WIRING_AUDIT}]: post-wiring audit — a post-wiring audit is required after any future runtime patch.`,
    `FP-06 [${SENTINEL_FIRST_TEST_RUN_SEP_AUTH}]: first internal test run requires separate authorization — the first actual internal test execution needs its own authorization.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01: ${SENTINEL_RUNTIME_EXEC_BLOCKED} — controlled runtime execution remains globally blocked pending a future minimal runtime patch execution contract.`,
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
    `GD-01: ${SENTINEL_CLAIM_RULE_OR} — ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8I.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8I.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8I.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8I.)",
    `GD-05: ${SENTINEL_TRAP_HEURISTIC} — enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8I.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8I.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8I.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8I.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8I.)",
  ];

  const authorizationPlanNotes: string[] = [
    "IN-01: 8.8I minimal runtime patch authorization plan created for Free Smart Talk Q&A only.",
    `IN-02: 8.8H confirmed — checkId=${h.checkId}, allPassed=${h.allPassed}, contractTarget=${h.contractTarget}.`,
    `IN-03: Synthetic matrix inherited via 8.8H: ${h.allowedSyntheticCasesPassed}/${h.allowedSyntheticCaseCount} allowed, ${h.forbiddenSyntheticCasesBlocked}/${h.forbiddenSyntheticCaseCount} forbidden blocked, ${h.unsafeUnknownSyntheticCasesFailedClosed}/${h.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "IN-04: This is an authorization-plan-only phase; no runtime, route, or seam files were touched.",
    "IN-05: All runtime/public/document activation flags remain false after this plan.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_AUTHORIZATION_PLAN_TAMPER_CASES.length;

  const provisional: FreeQaMinimalRuntimePatchAuthorizationPlanResult = {
    checkId: "8.8I",
    allPassed: true,
    minimalRuntimePatchAuthorizationPlanOnly: true,
    freeQaMinimalRuntimePatchAuthorizationPlanFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaControlledInternalRuntimeExecutionContractFileModified: false,
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
    importedOnlyFreeQaControlledInternalRuntimeExecutionContractRunner: true,
    noOtherImportsUsed: true,
    freeQaControlledInternalRuntimeExecutionContractRunnerCalled: true,
    freeQaControlledInternalRuntimeExecutionContractCheckId: "8.8H",
    freeQaControlledInternalRuntimeExecutionContractAllPassed: true,
    freeQaControlledInternalRuntimeExecutionContractConfirmed: true,
    freeQaControlledInternalRuntimeExecutionContractTargetConfirmed: CONTRACT_TARGET_H,
    freeQaControlledInternalRuntimeExecutionContractStatusConfirmed: CONTRACT_STATUS_H,
    authorizationPlanTarget: AUTHORIZATION_PLAN_TARGET,
    authorizationPlanStatus: AUTHORIZATION_PLAN_STATUS,
    minimalRuntimePatchAuthorizationPlanCreated: true,
    minimalRuntimePatchAuthorizationPlanCreatedForFreeQaOnly: true,
    plannedPatchScopeConfirmed: true,
    plannedPatchAnonymousNonDocumentQuestionOnly: true,
    plannedPatchControlledInternalOnly: true,
    plannedPatchNoPublicUsers: true,
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
    authorizationPlanDoesNotAuthorizeRuntimeExecutionNow: true,
    authorizationPlanDoesNotAuthorizeRoutePatchingNow: true,
    authorizationPlanDoesNotAuthorizeRouteWiringNow: true,
    authorizationPlanDoesNotAuthorizeSeamEnablementNow: true,
    authorizationPlanDoesNotAuthorizePublicRuntime: true,
    authorizationPlanDoesNotAuthorizePilot: true,
    authorizationPlanDoesNotAuthorizeProduction: true,
    authorizationPlanDoesNotAuthorizeGoLive: true,
    authorizationPlanDoesNotAuthorizeDocuments: true,
    authorizationPlanDoesNotAuthorizePhotoOcr: true,
    authorizationPlanDoesNotAuthorizeScanner: true,
    authorizationPlanDoesNotAuthorizePaidMode: true,
    authorizationPlanDoesNotAuthorizeVayloDna: true,
    allowedSyntheticCaseCount: h.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: h.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: h.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: h.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: h.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: h.unsafeUnknownSyntheticCasesFailedClosed,
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
    readyForFreeQaMinimalRuntimePatchExecutionContract: true,
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
    futureMinimalRuntimePatchExecutionContractRequired: true,
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
    freeQaControlledInternalRuntimeExecutionContractTamperConfirmedFrom8x8H: true,
    freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: h.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount,
    freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: h.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected,
    freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8H: true,
    freeQaInternalTestImplementationPlanTamperCaseCount: h.freeQaInternalTestImplementationPlanTamperCaseCount,
    freeQaInternalTestImplementationPlanTamperCasesRejected: h.freeQaInternalTestImplementationPlanTamperCasesRejected,
    freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8H: true,
    freeQaControlledInternalTestAuthorizationTamperCaseCount: h.freeQaControlledInternalTestAuthorizationTamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected: h.freeQaControlledInternalTestAuthorizationTamperCasesRejected,
    freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8H: true,
    freeQaPostActivationReadinessAuditTamperCaseCount: h.freeQaPostActivationReadinessAuditTamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: h.freeQaPostActivationReadinessAuditTamperCasesRejected,
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
    authorizationPlanDecision,
    plannedPatchScope,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    authorizationPlanNotes,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCaseCount: tamperCaseCount,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected: tamperCaseCount,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaMinimalRuntimePatchAuthorizationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8I tamper cases ─────────────────────────────────────────────
  let freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_AUTHORIZATION_PLAN_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_AUTHORIZATION_PLAN_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaMinimalRuntimePatchAuthorizationPlanResult(tc.mutate(provisional))) {
      freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8I tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed =
    planFailures.length === 0 &&
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected === tamperCaseCount;

  const finalAuthorizationPlanNotes: string[] = [
    ...authorizationPlanNotes,
    `8.8I tamper cases: ${freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaMinimalRuntimePatchAuthorizationPlanTamperCasesRejected,
    authorizationPlanNotes: finalAuthorizationPlanNotes,
  };
}
