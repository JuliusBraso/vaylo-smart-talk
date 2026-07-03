/**
 * PHASE 8.8H — Free Q&A Controlled Internal Runtime Execution Contract
 *
 * Contract-only phase. This phase defines the contract for a FUTURE
 * controlled internal runtime execution phase for Free Smart Talk Q&A
 * (anonymous, non-document questions). It does NOT implement or execute
 * runtime, patch routes, or enable any seam.
 *
 * This phase MUST NOT:
 * - Implement or execute runtime
 * - Patch routes
 * - Enable any seam
 * - Modify, import, or execute runSmartTalk
 * - Process real user input or documents
 * - Call models
 *
 * Contract decision:
 * - contractTarget: "free_smart_talk_qa_controlled_internal_runtime_execution_contract_only"
 * - contractStatus: "contract_ready_for_future_minimal_runtime_patch_authorization_only"
 * - controlledInternalRuntimeExecutionContractCreated: true
 *
 * This contract allows the NEXT phase to create a separately authorized
 * minimal runtime/route patch plan. It does not authorize actual runtime
 * execution, route patching, seam enablement, public runtime, pilot,
 * production, go-live, documents, OCR/photo/scanner, paid mode, Vaylo DNA,
 * exact legal deadline calculation, or trusted model output.
 */

import { runFreeQaInternalTestImplementationPlan } from "./run-free-qa-internal-test-implementation-plan";

// ─── Literal types ────────────────────────────────────────────────────────────

type ImplementationPlanTargetG = "free_smart_talk_qa_internal_test_implementation_plan_only";
type ImplementationPlanStatusG = "planned_for_future_controlled_internal_runtime_execution_contract_only";
type ContractTarget88H = "free_smart_talk_qa_controlled_internal_runtime_execution_contract_only";
type ContractStatus88H = "contract_ready_for_future_minimal_runtime_patch_authorization_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaControlledInternalRuntimeExecutionContractResult {
  checkId: "8.8H";
  allPassed: boolean;
  controlledInternalRuntimeExecutionContractOnly: true;
  freeQaControlledInternalRuntimeExecutionContractFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaInternalTestImplementationPlanFileModified: false;
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
  importedOnlyFreeQaInternalTestImplementationPlanRunner: true;
  noOtherImportsUsed: true;
  freeQaInternalTestImplementationPlanRunnerCalled: true;
  freeQaInternalTestImplementationPlanCheckId: "8.8G";
  freeQaInternalTestImplementationPlanAllPassed: true;
  freeQaInternalTestImplementationPlanConfirmed: true;
  freeQaInternalTestImplementationPlanTargetConfirmed: ImplementationPlanTargetG;
  freeQaInternalTestImplementationPlanStatusConfirmed: ImplementationPlanStatusG;
  contractTarget: ContractTarget88H;
  contractStatus: ContractStatus88H;
  controlledInternalRuntimeExecutionContractCreated: true;
  controlledInternalRuntimeExecutionContractCreatedForFreeQaOnly: true;
  contractScopeConfirmed: true;
  contractAnonymousNonDocumentQuestionOnly: true;
  contractAllowsOnlyFutureMinimalRuntimePatchAuthorization: true;
  contractDoesNotAuthorizeRuntimeExecutionNow: true;
  contractDoesNotAuthorizeRoutePatchingNow: true;
  contractDoesNotAuthorizeSeamEnablementNow: true;
  contractDocumentInputBlocked: true;
  contractPhotoOcrBlocked: true;
  contractScannerBlocked: true;
  contractPaidModeBlocked: true;
  contractVayloDnaBlocked: true;
  contractPublicRuntimeBlocked: true;
  contractPilotBlocked: true;
  contractProductionBlocked: true;
  contractGoLiveBlocked: true;
  contractExactLegalDeadlineCalculationBlocked: true;
  contractTrustedModelOutputBlocked: true;
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
  readyForFreeQaMinimalRuntimePatchAuthorizationPlan: true;
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
  futureMinimalRuntimePatchAuthorizationPlanRequired: true;
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
  freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8G: true;
  freeQaInternalTestImplementationPlanTamperCaseCount: number;
  freeQaInternalTestImplementationPlanTamperCasesRejected: number;
  freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8G: true;
  freeQaControlledInternalTestAuthorizationTamperCaseCount: number;
  freeQaControlledInternalTestAuthorizationTamperCasesRejected: number;
  freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8G: true;
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
  contractDecision: string[];
  contractScope: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  contractNotes: string[];
  freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: number;
  freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: number;
  freeQaControlledInternalRuntimeExecutionContractTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const IMPLEMENTATION_PLAN_TARGET_G: ImplementationPlanTargetG = "free_smart_talk_qa_internal_test_implementation_plan_only";
const IMPLEMENTATION_PLAN_STATUS_G: ImplementationPlanStatusG = "planned_for_future_controlled_internal_runtime_execution_contract_only";
const CONTRACT_TARGET: ContractTarget88H = "free_smart_talk_qa_controlled_internal_runtime_execution_contract_only";
const CONTRACT_STATUS: ContractStatus88H = "contract_ready_for_future_minimal_runtime_patch_authorization_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_CONTRACT_STATUS = "contract_ready_for_future_minimal_runtime_patch_authorization_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_ANON_NON_DOC = "anonymous non-document questions only";
const SENTINEL_NO_RUNTIME_EXEC_NOW = "no runtime execution now";
const SENTINEL_NO_ROUTE_PATCHING_NOW = "no route patching now";
const SENTINEL_NO_SEAM_ENABLEMENT_NOW = "no seam enablement now";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_MIN_PATCH_PLAN = "minimal runtime patch authorization plan";
const SENTINEL_MIN_PATCH_SEP_AUTH = "minimal runtime patch requires separate authorization";
const SENTINEL_ROUTE_WIRING_SEP_AUTH = "route wiring requires separate authorization";
const SENTINEL_POST_WIRING_AUDIT = "post-wiring audit";
const SENTINEL_FIRST_TEST_RUN_SEP_AUTH = "first internal test run requires separate authorization";
const SENTINEL_RUNTIME_EXEC_BLOCKED = "runtime execution blocked";
const SENTINEL_ROUTE_PATCHING_BLOCKED = "route patching blocked";
const SENTINEL_SEAM_ACTIVATION_BLOCKED = "seam activation blocked";
const SENTINEL_DOCUMENT_MODE_BLOCKED = "document mode blocked";
const SENTINEL_PHOTO_OCR_BLOCKED = "photo/OCR blocked";
const SENTINEL_SCANNER_BLOCKED = "scanner blocked";
const SENTINEL_PUBLIC_RUNTIME_BLOCKED = "public runtime blocked";
const SENTINEL_PRODUCTION_BLOCKED = "production blocked";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics debt";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic debt";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaControlledInternalRuntimeExecutionContractResult(
  r: FreeQaControlledInternalRuntimeExecutionContractResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8H") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledInternalRuntimeExecutionContractOnly !== true) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaInternalTestImplementationPlanFileModified !== false) return false;
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
  // Import/runner flags and 8.8G confirmations
  if (r.importedOnlyFreeQaInternalTestImplementationPlanRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaInternalTestImplementationPlanRunnerCalled !== true) return false;
  if (r.freeQaInternalTestImplementationPlanCheckId !== "8.8G") return false;
  if (r.freeQaInternalTestImplementationPlanAllPassed !== true) return false;
  if (r.freeQaInternalTestImplementationPlanConfirmed !== true) return false;
  if (r.freeQaInternalTestImplementationPlanTargetConfirmed !== IMPLEMENTATION_PLAN_TARGET_G) return false;
  if (r.freeQaInternalTestImplementationPlanStatusConfirmed !== IMPLEMENTATION_PLAN_STATUS_G) return false;
  // Contract decision
  if (r.contractTarget !== CONTRACT_TARGET) return false;
  if (r.contractStatus !== CONTRACT_STATUS) return false;
  if (r.controlledInternalRuntimeExecutionContractCreated !== true) return false;
  if (r.controlledInternalRuntimeExecutionContractCreatedForFreeQaOnly !== true) return false;
  // Contract blocked scope flags
  if (r.contractScopeConfirmed !== true) return false;
  if (r.contractAnonymousNonDocumentQuestionOnly !== true) return false;
  if (r.contractAllowsOnlyFutureMinimalRuntimePatchAuthorization !== true) return false;
  if (r.contractDoesNotAuthorizeRuntimeExecutionNow !== true) return false;
  if (r.contractDoesNotAuthorizeRoutePatchingNow !== true) return false;
  if (r.contractDoesNotAuthorizeSeamEnablementNow !== true) return false;
  if (r.contractDocumentInputBlocked !== true) return false;
  if (r.contractPhotoOcrBlocked !== true) return false;
  if (r.contractScannerBlocked !== true) return false;
  if (r.contractPaidModeBlocked !== true) return false;
  if (r.contractVayloDnaBlocked !== true) return false;
  if (r.contractPublicRuntimeBlocked !== true) return false;
  if (r.contractPilotBlocked !== true) return false;
  if (r.contractProductionBlocked !== true) return false;
  if (r.contractGoLiveBlocked !== true) return false;
  if (r.contractExactLegalDeadlineCalculationBlocked !== true) return false;
  if (r.contractTrustedModelOutputBlocked !== true) return false;
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
  if (r.readyForFreeQaMinimalRuntimePatchAuthorizationPlan !== true) return false;
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
  if (r.futureMinimalRuntimePatchAuthorizationPlanRequired !== true) return false;
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
  // Inherited 8.8G/8.8F/8.8E tamper confirmations
  if (r.freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8G !== true) return false;
  if (r.freeQaInternalTestImplementationPlanTamperCasesRejected !== r.freeQaInternalTestImplementationPlanTamperCaseCount) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8G !== true) return false;
  if (r.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== r.freeQaControlledInternalTestAuthorizationTamperCaseCount) return false;
  if (r.freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8G !== true) return false;
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
  if (!r.contractDecision || r.contractDecision.length === 0) return false;
  if (!r.contractScope || r.contractScope.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.contractNotes || r.contractNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.contractDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_CONTRACT_STATUS)) return false;
  const scopeJ = r.contractScope.join(" ");
  if (!scopeJ.includes(SENTINEL_FREE_QA_SCOPE)) return false;
  if (!scopeJ.includes(SENTINEL_ANON_NON_DOC)) return false;
  const boundariesJ = r.nonAuthorizationBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_NO_RUNTIME_EXEC_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_PATCHING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_SEAM_ENABLEMENT_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_MIN_PATCH_PLAN)) return false;
  if (!futureJ.includes(SENTINEL_MIN_PATCH_SEP_AUTH)) return false;
  if (!futureJ.includes(SENTINEL_ROUTE_WIRING_SEP_AUTH)) return false;
  if (!futureJ.includes(SENTINEL_POST_WIRING_AUDIT)) return false;
  if (!futureJ.includes(SENTINEL_FIRST_TEST_RUN_SEP_AUTH)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_EXEC_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_ROUTE_PATCHING_BLOCKED)) return false;
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
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected !== r.freeQaControlledInternalRuntimeExecutionContractTamperCaseCount) return false;
  if (r.freeQaControlledInternalRuntimeExecutionContractTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88HMutation = (
  r: FreeQaControlledInternalRuntimeExecutionContractResult,
) => FreeQaControlledInternalRuntimeExecutionContractResult;
interface Tamper88HCase { label: string; mutate: Tamper88HMutation; }

const FREE_QA_CONTRACT_TAMPER_CASES: Tamper88HCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8G" as "8.8H" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "controlledInternalRuntimeExecutionContractOnly false", mutate: (r) => ({ ...r, controlledInternalRuntimeExecutionContractOnly: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractFileCreated false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaInternalTestImplementationPlanFileModified true", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanFileModified: true as false }) },
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
  // Import/runner flags and 8.8G confirmations
  { label: "importedOnlyFreeQaInternalTestImplementationPlanRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaInternalTestImplementationPlanRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaInternalTestImplementationPlanRunnerCalled false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanRunnerCalled: false as true }) },
  { label: "freeQaInternalTestImplementationPlanCheckId wrong", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanCheckId: "8.8F" as "8.8G" }) },
  { label: "freeQaInternalTestImplementationPlanAllPassed false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanAllPassed: false as true }) },
  { label: "freeQaInternalTestImplementationPlanConfirmed false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanConfirmed: false as true }) },
  { label: "freeQaInternalTestImplementationPlanTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTargetConfirmed: "public_runtime_plan" as ImplementationPlanTargetG }) },
  { label: "freeQaInternalTestImplementationPlanStatusConfirmed wrong", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanStatusConfirmed: "unauthorized" as ImplementationPlanStatusG }) },
  // Contract decision
  { label: "contractTarget wrong", mutate: (r) => ({ ...r, contractTarget: "public_runtime_contract" as ContractTarget88H }) },
  { label: "contractStatus wrong", mutate: (r) => ({ ...r, contractStatus: "unauthorized" as ContractStatus88H }) },
  { label: "controlledInternalRuntimeExecutionContractCreated false", mutate: (r) => ({ ...r, controlledInternalRuntimeExecutionContractCreated: false as true }) },
  { label: "controlledInternalRuntimeExecutionContractCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, controlledInternalRuntimeExecutionContractCreatedForFreeQaOnly: false as true }) },
  // Contract blocked scope flags
  { label: "contractScopeConfirmed false", mutate: (r) => ({ ...r, contractScopeConfirmed: false as true }) },
  { label: "contractAnonymousNonDocumentQuestionOnly false", mutate: (r) => ({ ...r, contractAnonymousNonDocumentQuestionOnly: false as true }) },
  { label: "contractAllowsOnlyFutureMinimalRuntimePatchAuthorization false", mutate: (r) => ({ ...r, contractAllowsOnlyFutureMinimalRuntimePatchAuthorization: false as true }) },
  { label: "contractDoesNotAuthorizeRuntimeExecutionNow false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeRuntimeExecutionNow: false as true }) },
  { label: "contractDoesNotAuthorizeRoutePatchingNow false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeRoutePatchingNow: false as true }) },
  { label: "contractDoesNotAuthorizeSeamEnablementNow false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeSeamEnablementNow: false as true }) },
  { label: "contractDocumentInputBlocked false", mutate: (r) => ({ ...r, contractDocumentInputBlocked: false as true }) },
  { label: "contractPhotoOcrBlocked false", mutate: (r) => ({ ...r, contractPhotoOcrBlocked: false as true }) },
  { label: "contractScannerBlocked false", mutate: (r) => ({ ...r, contractScannerBlocked: false as true }) },
  { label: "contractPaidModeBlocked false", mutate: (r) => ({ ...r, contractPaidModeBlocked: false as true }) },
  { label: "contractVayloDnaBlocked false", mutate: (r) => ({ ...r, contractVayloDnaBlocked: false as true }) },
  { label: "contractPublicRuntimeBlocked false", mutate: (r) => ({ ...r, contractPublicRuntimeBlocked: false as true }) },
  { label: "contractPilotBlocked false", mutate: (r) => ({ ...r, contractPilotBlocked: false as true }) },
  { label: "contractProductionBlocked false", mutate: (r) => ({ ...r, contractProductionBlocked: false as true }) },
  { label: "contractGoLiveBlocked false", mutate: (r) => ({ ...r, contractGoLiveBlocked: false as true }) },
  { label: "contractExactLegalDeadlineCalculationBlocked false", mutate: (r) => ({ ...r, contractExactLegalDeadlineCalculationBlocked: false as true }) },
  { label: "contractTrustedModelOutputBlocked false", mutate: (r) => ({ ...r, contractTrustedModelOutputBlocked: false as true }) },
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
  { label: "readyForFreeQaMinimalRuntimePatchAuthorizationPlan false", mutate: (r) => ({ ...r, readyForFreeQaMinimalRuntimePatchAuthorizationPlan: false as true }) },
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
  { label: "futureMinimalRuntimePatchAuthorizationPlanRequired false", mutate: (r) => ({ ...r, futureMinimalRuntimePatchAuthorizationPlanRequired: false as true }) },
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
  // Inherited 8.8G/8.8F/8.8E tamper confirmations
  { label: "freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8G false", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8G: false as true }) },
  { label: "freeQaInternalTestImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaInternalTestImplementationPlanTamperCasesRejected: r.freeQaInternalTestImplementationPlanTamperCasesRejected - 1 }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8G false", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8G: false as true }) },
  { label: "freeQaControlledInternalTestAuthorizationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalTestAuthorizationTamperCasesRejected: r.freeQaControlledInternalTestAuthorizationTamperCasesRejected - 1 }) },
  { label: "freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8G false", mutate: (r) => ({ ...r, freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8G: false as true }) },
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
  { label: "contractDecision empty", mutate: (r) => ({ ...r, contractDecision: [] }) },
  { label: "contractScope empty", mutate: (r) => ({ ...r, contractScope: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "contractNotes empty", mutate: (r) => ({ ...r, contractNotes: [] }) },
  // Array sentinel checks
  { label: "contractDecision missing contract_ready_for_future_minimal_runtime_patch_authorization_only sentinel", mutate: (r) => ({ ...r, contractDecision: r.contractDecision.map((s) => s.split(SENTINEL_CONTRACT_STATUS).join("omitted")) }) },
  { label: "contractScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, contractScope: r.contractScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "contractScope missing anonymous non-document questions only sentinel", mutate: (r) => ({ ...r, contractScope: r.contractScope.map((s) => s.split(SENTINEL_ANON_NON_DOC).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime execution now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_EXEC_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route patching now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_PATCHING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no seam enablement now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_SEAM_ENABLEMENT_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "futureRequiredPhases missing minimal runtime patch authorization plan sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_MIN_PATCH_PLAN).join("omitted")) }) },
  { label: "futureRequiredPhases missing minimal runtime patch requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_MIN_PATCH_SEP_AUTH).join("omitted")) }) },
  { label: "futureRequiredPhases missing route wiring requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_ROUTE_WIRING_SEP_AUTH).join("omitted")) }) },
  { label: "futureRequiredPhases missing post-wiring audit sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_POST_WIRING_AUDIT).join("omitted")) }) },
  { label: "futureRequiredPhases missing first internal test run requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_FIRST_TEST_RUN_SEP_AUTH).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime execution blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_EXEC_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing route patching blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_ROUTE_PATCHING_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing seam activation blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SEAM_ACTIVATION_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing public runtime blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing production blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PRODUCTION_BLOCKED).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Own tamper coverage self-checks
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperCoveragePassing: false as true }) },
  { label: "freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: r.freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected - 1 }) },
];

// ─── Exported contract runner ──────────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Controlled Internal Runtime Execution Contract runner
 * for 8.8H.
 *
 * Calls the 8.8G Internal Test Implementation Plan runner as source of
 * truth. Defines the contract for a FUTURE controlled internal runtime
 * execution phase for Free Smart Talk Q&A (anonymous, non-document
 * questions). Does NOT implement or execute runtime, patch routes, or
 * enable any seam.
 */
export function runFreeQaControlledInternalRuntimeExecutionContract(): FreeQaControlledInternalRuntimeExecutionContractResult {
  const contractFailures: string[] = [];

  // ── Call 8.8G Internal Test Implementation Plan runner as source of truth ──
  const g = runFreeQaInternalTestImplementationPlan();

  if (g.checkId !== "8.8G") contractFailures.push(`8.8G checkId mismatch: expected "8.8G", got "${g.checkId}"`);
  if (g.allPassed !== true) contractFailures.push("8.8G allPassed is not true");
  if (g.implementationPlanTarget !== IMPLEMENTATION_PLAN_TARGET_G) contractFailures.push(`8.8G implementationPlanTarget mismatch: expected "${IMPLEMENTATION_PLAN_TARGET_G}", got "${g.implementationPlanTarget}"`);
  if (g.implementationPlanStatus !== IMPLEMENTATION_PLAN_STATUS_G) contractFailures.push(`8.8G implementationPlanStatus mismatch: expected "${IMPLEMENTATION_PLAN_STATUS_G}", got "${g.implementationPlanStatus}"`);
  if (g.readyForFreeQaControlledInternalRuntimeExecutionContract !== true) contractFailures.push("8.8G readyForFreeQaControlledInternalRuntimeExecutionContract is not true");
  if (g.readyForRuntimeActivation !== false) contractFailures.push("8.8G readyForRuntimeActivation is not false");
  if (g.readyForControlledInternalTestRuntimeExecution !== false) contractFailures.push("8.8G readyForControlledInternalTestRuntimeExecution is not false");
  if (g.allowedSyntheticCasesPassed !== g.allowedSyntheticCaseCount) contractFailures.push(`8.8G allowed cases: ${g.allowedSyntheticCasesPassed}/${g.allowedSyntheticCaseCount}`);
  if (g.forbiddenSyntheticCasesBlocked !== g.forbiddenSyntheticCaseCount) contractFailures.push(`8.8G forbidden cases: ${g.forbiddenSyntheticCasesBlocked}/${g.forbiddenSyntheticCaseCount}`);
  if (g.unsafeUnknownSyntheticCasesFailedClosed !== g.unsafeUnknownSyntheticCaseCount) contractFailures.push(`8.8G unsafe/unknown cases: ${g.unsafeUnknownSyntheticCasesFailedClosed}/${g.unsafeUnknownSyntheticCaseCount}`);
  if (g.runtimeActivationPerformed !== false) contractFailures.push("8.8G runtimeActivationPerformed is not false");
  if (g.controlledInternalRuntimeExecutionPerformed !== false) contractFailures.push("8.8G controlledInternalRuntimeExecutionPerformed is not false");
  if (g.seamActivationPerformed !== false) contractFailures.push("8.8G seamActivationPerformed is not false");
  if (g.documentRuntimeActivationPerformed !== false) contractFailures.push("8.8G documentRuntimeActivationPerformed is not false");
  if (g.photoOcrRuntimeActivationPerformed !== false) contractFailures.push("8.8G photoOcrRuntimeActivationPerformed is not false");
  if (g.scannerRuntimeActivationPerformed !== false) contractFailures.push("8.8G scannerRuntimeActivationPerformed is not false");
  if (g.paidDocumentModeRuntimeActivationPerformed !== false) contractFailures.push("8.8G paidDocumentModeRuntimeActivationPerformed is not false");
  if (g.vayloDnaRuntimeActivationPerformed !== false) contractFailures.push("8.8G vayloDnaRuntimeActivationPerformed is not false");
  if (g.routePatchPerformed !== false) contractFailures.push("8.8G routePatchPerformed is not false");
  if (g.routeWiringPerformed !== false) contractFailures.push("8.8G routeWiringPerformed is not false");
  if (g.realDocumentInputAuthorizedNow !== false) contractFailures.push("8.8G realDocumentInputAuthorizedNow is not false");
  if (g.userVisibleOutputAuthorizedNow !== false) contractFailures.push("8.8G userVisibleOutputAuthorizedNow is not false");
  if (g.publicRuntimeAuthorizedNow !== false) contractFailures.push("8.8G publicRuntimeAuthorizedNow is not false");
  if (g.modelFacingUseAuthorizedNow !== false) contractFailures.push("8.8G modelFacingUseAuthorizedNow is not false");
  if (g.evidenceGateExecutionAuthorizedNow !== false) contractFailures.push("8.8G evidenceGateExecutionAuthorizedNow is not false");
  if (g.claimAuthorizationAuthorizedNow !== false) contractFailures.push("8.8G claimAuthorizationAuthorizedNow is not false");
  if (g.exactDeadlineCalculationAuthorized !== false) contractFailures.push("8.8G exactDeadlineCalculationAuthorized is not false");
  if (g.paymentRuntimeAuthorizedNow !== false) contractFailures.push("8.8G paymentRuntimeAuthorizedNow is not false");
  if (g.entitlementRuntimeAuthorizedNow !== false) contractFailures.push("8.8G entitlementRuntimeAuthorizedNow is not false");
  if (g.checkoutRuntimeAuthorizedNow !== false) contractFailures.push("8.8G checkoutRuntimeAuthorizedNow is not false");
  if (g.pilotAuthorizationGranted !== false) contractFailures.push("8.8G pilotAuthorizationGranted is not false");
  if (g.productionAuthorizationGranted !== false) contractFailures.push("8.8G productionAuthorizationGranted is not false");
  if (g.goLiveAuthorizationGranted !== false) contractFailures.push("8.8G goLiveAuthorizationGranted is not false");
  if (g.seamActivationAuthorizedNow !== false) contractFailures.push("8.8G seamActivationAuthorizedNow is not false");
  if (g.controlledRuntimeActivationAuthorizedNow !== false) contractFailures.push("8.8G controlledRuntimeActivationAuthorizedNow is not false");
  if (g.controlledInternalRuntimeExecutionAuthorizedNow !== false) contractFailures.push("8.8G controlledInternalRuntimeExecutionAuthorizedNow is not false");
  if (g.documentRuntimeAuthorizedNow !== false) contractFailures.push("8.8G documentRuntimeAuthorizedNow is not false");
  if (g.photoOcrRuntimeAuthorizedNow !== false) contractFailures.push("8.8G photoOcrRuntimeAuthorizedNow is not false");
  if (g.scannerUploadAuthorizedNow !== false) contractFailures.push("8.8G scannerUploadAuthorizedNow is not false");
  if (g.vayloDnaRuntimeAuthorizedNow !== false) contractFailures.push("8.8G vayloDnaRuntimeAuthorizedNow is not false");
  if (g.freeQaInternalTestImplementationPlanTamperCasesRejected !== g.freeQaInternalTestImplementationPlanTamperCaseCount) contractFailures.push("8.8G own tamper count mismatch");
  if (g.freeQaControlledInternalTestAuthorizationTamperCasesRejected !== g.freeQaControlledInternalTestAuthorizationTamperCaseCount) contractFailures.push("8.8G inherited 8.8F tamper count mismatch");
  if (g.freeQaPostActivationReadinessAuditTamperCasesRejected !== g.freeQaPostActivationReadinessAuditTamperCaseCount) contractFailures.push("8.8G inherited 8.8E tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const contractDecision: string[] = [
    `CD-01 [${SENTINEL_CONTRACT_STATUS}]: contract_ready_for_future_minimal_runtime_patch_authorization_only — the controlled internal runtime execution contract for Free Smart Talk Q&A is defined at the contract level only.`,
    "CD-02: This contract allows the NEXT phase to create a separately authorized minimal runtime/route patch plan.",
    "CD-03: This contract does NOT authorize actual runtime execution, route patching, or seam enablement now.",
    "CD-04: A separate authorization is required before any minimal runtime patch, route wiring, or first internal test run.",
  ];

  const contractScope: string[] = [
    `CS-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A — ${SENTINEL_ANON_NON_DOC} — the contracted scope is limited to anonymous non-document questions only.`,
    "CS-02: Contracted scope excludes real documents, photos, scans, or uploads of any kind.",
    "CS-03: Contracted scope excludes Paid Document Mode, Vaylo DNA runtime, payment runtime, and entitlement runtime.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_EXEC_NOW}]: no runtime execution now — this contract does not execute runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_ROUTE_PATCHING_NOW}]: no route patching now — this contract does not patch or wire any route file now.`,
    `NB-03 [${SENTINEL_NO_SEAM_ENABLEMENT_NOW}]: no seam enablement now — this contract does not enable the Evidence Gates seam now.`,
    `NB-04 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document, photo, OCR, and scanner input remain unauthorized by this contract.`,
    `NB-05 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this contract.`,
    "NB-06: no pilot, no production, no go-live authorization is granted by this contract.",
    "NB-07: no exact legal deadline calculation and no trusted model output authorization is granted by this contract.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_MIN_PATCH_PLAN}]: minimal runtime patch authorization plan — the next phase may create a separately authorized minimal runtime patch authorization plan.`,
    `FP-02 [${SENTINEL_MIN_PATCH_SEP_AUTH}]: minimal runtime patch requires separate authorization — any minimal route/runtime patch for internal testing needs its own authorization.`,
    `FP-03 [${SENTINEL_ROUTE_WIRING_SEP_AUTH}]: route wiring requires separate authorization before any route file is touched.`,
    "FP-04: future Evidence Gates seam enablement requires separate authorization.",
    `FP-05 [${SENTINEL_POST_WIRING_AUDIT}]: post-wiring audit — a post-wiring audit is required after any future runtime patch.`,
    `FP-06 [${SENTINEL_FIRST_TEST_RUN_SEP_AUTH}]: first internal test run requires separate authorization — the first actual internal test execution needs its own authorization.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01: ${SENTINEL_RUNTIME_EXEC_BLOCKED} — controlled runtime execution remains globally blocked pending a future minimal runtime patch authorization.`,
    `GB-02: ${SENTINEL_ROUTE_PATCHING_BLOCKED} — route patching remains globally blocked pending separate authorization.`,
    `GB-03: ${SENTINEL_SEAM_ACTIVATION_BLOCKED} — Evidence Gates seam activation remains globally blocked.`,
    `GB-04: ${SENTINEL_DOCUMENT_MODE_BLOCKED} — text document mode runtime remains globally blocked.`,
    `GB-05: ${SENTINEL_PHOTO_OCR_BLOCKED} — photo and OCR runtime remains globally blocked.`,
    `GB-06: ${SENTINEL_SCANNER_BLOCKED} — scanner upload runtime remains globally blocked.`,
    `GB-07: ${SENTINEL_PUBLIC_RUNTIME_BLOCKED} — public runtime remains globally blocked.`,
    `GB-08: ${SENTINEL_PRODUCTION_BLOCKED} — production and go-live remain globally blocked.`,
    "GB-09: paid mode and Vaylo DNA runtime remain globally blocked.",
    "GB-10: payment and entitlement runtime remain globally blocked.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01: ${SENTINEL_CLAIM_RULE_OR} — ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8H.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8H.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8H.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8H.)",
    `GD-05: ${SENTINEL_TRAP_HEURISTIC} — enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8H.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8H.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8H.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8H.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8H.)",
  ];

  const contractNotes: string[] = [
    "IN-01: 8.8H controlled internal runtime execution contract created for Free Smart Talk Q&A only.",
    `IN-02: 8.8G confirmed — checkId=${g.checkId}, allPassed=${g.allPassed}, implementationPlanTarget=${g.implementationPlanTarget}.`,
    `IN-03: Synthetic matrix inherited via 8.8G: ${g.allowedSyntheticCasesPassed}/${g.allowedSyntheticCaseCount} allowed, ${g.forbiddenSyntheticCasesBlocked}/${g.forbiddenSyntheticCaseCount} forbidden blocked, ${g.unsafeUnknownSyntheticCasesFailedClosed}/${g.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "IN-04: This is a contract-only phase; no runtime, route, or seam files were touched.",
    "IN-05: All runtime/public/document activation flags remain false after this contract.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_CONTRACT_TAMPER_CASES.length;

  const provisional: FreeQaControlledInternalRuntimeExecutionContractResult = {
    checkId: "8.8H",
    allPassed: true,
    controlledInternalRuntimeExecutionContractOnly: true,
    freeQaControlledInternalRuntimeExecutionContractFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaInternalTestImplementationPlanFileModified: false,
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
    importedOnlyFreeQaInternalTestImplementationPlanRunner: true,
    noOtherImportsUsed: true,
    freeQaInternalTestImplementationPlanRunnerCalled: true,
    freeQaInternalTestImplementationPlanCheckId: "8.8G",
    freeQaInternalTestImplementationPlanAllPassed: true,
    freeQaInternalTestImplementationPlanConfirmed: true,
    freeQaInternalTestImplementationPlanTargetConfirmed: IMPLEMENTATION_PLAN_TARGET_G,
    freeQaInternalTestImplementationPlanStatusConfirmed: IMPLEMENTATION_PLAN_STATUS_G,
    contractTarget: CONTRACT_TARGET,
    contractStatus: CONTRACT_STATUS,
    controlledInternalRuntimeExecutionContractCreated: true,
    controlledInternalRuntimeExecutionContractCreatedForFreeQaOnly: true,
    contractScopeConfirmed: true,
    contractAnonymousNonDocumentQuestionOnly: true,
    contractAllowsOnlyFutureMinimalRuntimePatchAuthorization: true,
    contractDoesNotAuthorizeRuntimeExecutionNow: true,
    contractDoesNotAuthorizeRoutePatchingNow: true,
    contractDoesNotAuthorizeSeamEnablementNow: true,
    contractDocumentInputBlocked: true,
    contractPhotoOcrBlocked: true,
    contractScannerBlocked: true,
    contractPaidModeBlocked: true,
    contractVayloDnaBlocked: true,
    contractPublicRuntimeBlocked: true,
    contractPilotBlocked: true,
    contractProductionBlocked: true,
    contractGoLiveBlocked: true,
    contractExactLegalDeadlineCalculationBlocked: true,
    contractTrustedModelOutputBlocked: true,
    allowedSyntheticCaseCount: g.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: g.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: g.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: g.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: g.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: g.unsafeUnknownSyntheticCasesFailedClosed,
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
    readyForFreeQaMinimalRuntimePatchAuthorizationPlan: true,
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
    futureMinimalRuntimePatchAuthorizationPlanRequired: true,
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
    freeQaInternalTestImplementationPlanTamperConfirmedFrom8x8G: true,
    freeQaInternalTestImplementationPlanTamperCaseCount: g.freeQaInternalTestImplementationPlanTamperCaseCount,
    freeQaInternalTestImplementationPlanTamperCasesRejected: g.freeQaInternalTestImplementationPlanTamperCasesRejected,
    freeQaControlledInternalTestAuthorizationTamperConfirmedFrom8x8G: true,
    freeQaControlledInternalTestAuthorizationTamperCaseCount: g.freeQaControlledInternalTestAuthorizationTamperCaseCount,
    freeQaControlledInternalTestAuthorizationTamperCasesRejected: g.freeQaControlledInternalTestAuthorizationTamperCasesRejected,
    freeQaPostActivationReadinessAuditTamperConfirmedFrom8x8G: true,
    freeQaPostActivationReadinessAuditTamperCaseCount: g.freeQaPostActivationReadinessAuditTamperCaseCount,
    freeQaPostActivationReadinessAuditTamperCasesRejected: g.freeQaPostActivationReadinessAuditTamperCasesRejected,
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
    contractDecision,
    contractScope,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    contractNotes,
    freeQaControlledInternalRuntimeExecutionContractTamperCaseCount: tamperCaseCount,
    freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected: tamperCaseCount,
    freeQaControlledInternalRuntimeExecutionContractTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaControlledInternalRuntimeExecutionContractResult(provisional)) {
    contractFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8H tamper cases ─────────────────────────────────────────────
  let freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_CONTRACT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_CONTRACT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaControlledInternalRuntimeExecutionContractResult(tc.mutate(provisional))) {
      freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8H tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) contractFailures.push(...tamperFailures);

  const allPassed =
    contractFailures.length === 0 &&
    freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected === tamperCaseCount;

  const finalContractNotes: string[] = [
    ...contractNotes,
    `8.8H tamper cases: ${freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(contractFailures.length > 0 ? [`FAILURES (${contractFailures.length}):`, ...contractFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaControlledInternalRuntimeExecutionContractTamperCasesRejected,
    contractNotes: finalContractNotes,
  };
}
