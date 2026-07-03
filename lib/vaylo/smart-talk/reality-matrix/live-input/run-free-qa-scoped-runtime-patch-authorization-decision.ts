/**
 * PHASE 8.8L — Free Q&A Scoped Runtime Patch Authorization Decision
 *
 * Decision-only phase. This phase renders the FINAL authorization decision
 * for the scoped minimal runtime patch described by 8.8K, for Free Smart
 * Talk Q&A (anonymous, non-document questions, controlled internal test
 * only). It authorizes only the NEXT phase to implement the actual minimal
 * scoped runtime patch. This phase itself must not perform the patch.
 *
 * Authorization decision:
 * - authorizationDecisionTarget: "free_smart_talk_qa_scoped_runtime_patch_authorization_decision_only"
 * - authorizationDecisionStatus: "authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only"
 * - scopedRuntimePatchAuthorizedForNextPhase: true
 *
 * This phase itself must not modify runSmartTalk or routes, patch runtime,
 * wire routes, execute runtime, enable public runtime, enable the Evidence
 * Gates seam, process documents, process OCR/photo/scanner/upload, enable
 * Paid Document Mode, enable Vaylo DNA, persist data, calculate exact legal
 * deadlines, or trust model output.
 */

import { runFreeQaScopedRuntimePatchImplementationPlan } from "./run-free-qa-scoped-runtime-patch-implementation-plan";

// ─── Literal types ────────────────────────────────────────────────────────────

type ImplementationPlanTargetK = "free_smart_talk_qa_scoped_runtime_patch_implementation_plan_only";
type ImplementationPlanStatusK = "planned_for_future_scoped_runtime_patch_authorization_only";
type AuthorizationDecisionTarget88L = "free_smart_talk_qa_scoped_runtime_patch_authorization_decision_only";
type AuthorizationDecisionStatus88L = "authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaScopedRuntimePatchAuthorizationDecisionResult {
  checkId: "8.8L";
  allPassed: boolean;
  scopedRuntimePatchAuthorizationDecisionOnly: true;
  freeQaScopedRuntimePatchAuthorizationDecisionFileCreated: true;
  existingFilesModified: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  routeFilesModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runtimeActivationPerformed: false;
  controlledInternalRuntimeExecutionPerformed: false;
  minimalRuntimePatchPerformed: false;
  scopedRuntimePatchImplemented: false;
  publicRuntimeActivationPerformed: false;
  seamActivationPerformed: false;
  documentRuntimeActivationPerformed: false;
  photoOcrRuntimeActivationPerformed: false;
  scannerRuntimeActivationPerformed: false;
  paidDocumentModeRuntimeActivationPerformed: false;
  vayloDnaRuntimeActivationPerformed: false;
  importedOnlyFreeQaScopedRuntimePatchImplementationPlanRunner: true;
  noOtherImportsUsed: true;
  freeQaScopedRuntimePatchImplementationPlanRunnerCalled: true;
  freeQaScopedRuntimePatchImplementationPlanCheckId: "8.8K";
  freeQaScopedRuntimePatchImplementationPlanAllPassed: true;
  freeQaScopedRuntimePatchImplementationPlanConfirmed: true;
  authorizationDecisionTarget: AuthorizationDecisionTarget88L;
  authorizationDecisionStatus: AuthorizationDecisionStatus88L;
  scopedRuntimePatchAuthorizedForNextPhase: true;
  authorizedNextPhase: "8.8M_actual_minimal_scoped_runtime_patch";
  authorizedPatchScopeFreeQaOnly: true;
  authorizedPatchScopeAnonymousNonDocumentQuestionOnly: true;
  authorizedPatchScopeControlledInternalOnly: true;
  authorizedPatchMustRemainDisabledByDefault: true;
  authorizedPatchMustUseInternalOnlyGuard: true;
  authorizedPatchMustBlockDocumentLikeText: true;
  authorizedPatchMustNotEnablePublicRuntime: true;
  authorizedPatchMustNotEnableDocuments: true;
  authorizedPatchMustNotEnablePhotoOcr: true;
  authorizedPatchMustNotEnableScanner: true;
  authorizedPatchMustNotEnablePaidMode: true;
  authorizedPatchMustNotEnableVayloDna: true;
  authorizedPatchMustNotPersistData: true;
  authorizedPatchMustNotCalculateExactLegalDeadlines: true;
  authorizedPatchMustTreatModelOutputAsUntrusted: true;
  allowedSyntheticCaseCount: number;
  allowedSyntheticCasesPassed: number;
  forbiddenSyntheticCaseCount: number;
  forbiddenSyntheticCasesBlocked: number;
  unsafeUnknownSyntheticCaseCount: number;
  unsafeUnknownSyntheticCasesFailedClosed: number;
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
  readyForActualMinimalScopedRuntimePatch: true;
  readyForRuntimeActivation: false;
  readyForControlledInternalTestRuntimeExecution: false;
  readyForMinimalRuntimePatchExecution: false;
  readyForScopedRuntimePatchExecution: false;
  readyForRoutePatching: false;
  readyForRouteWiring: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  futureActualMinimalScopedRuntimePatchRequired: true;
  futurePostPatchSafetyAuditRequired: true;
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
  freeQaScopedRuntimePatchImplementationPlanTamperConfirmedFrom8x8K: true;
  freeQaScopedRuntimePatchImplementationPlanTamperCaseCount: number;
  freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected: number;
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
  authorizedPatchScope: string[];
  nonAuthorizationBoundaries: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  authorizationDecisionNotes: string[];
  freeQaScopedRuntimePatchAuthorizationDecisionTamperCaseCount: number;
  freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected: number;
  freeQaScopedRuntimePatchAuthorizationDecisionTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const IMPLEMENTATION_PLAN_TARGET_K: ImplementationPlanTargetK = "free_smart_talk_qa_scoped_runtime_patch_implementation_plan_only";
const IMPLEMENTATION_PLAN_STATUS_K: ImplementationPlanStatusK = "planned_for_future_scoped_runtime_patch_authorization_only";
const AUTHORIZATION_DECISION_TARGET: AuthorizationDecisionTarget88L = "free_smart_talk_qa_scoped_runtime_patch_authorization_decision_only";
const AUTHORIZATION_DECISION_STATUS: AuthorizationDecisionStatus88L = "authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_AUTH_DECISION_STATUS = "authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only";
const SENTINEL_FREE_QA_SCOPE = "Free Smart Talk Q&A";
const SENTINEL_ANON_NON_DOC = "anonymous non-document questions only";
const SENTINEL_CONTROLLED_INTERNAL_ONLY = "controlled internal test only";
const SENTINEL_DISABLED_BY_DEFAULT = "disabled by default";
const SENTINEL_INTERNAL_ONLY_GUARD = "internal-only guard";
const SENTINEL_NO_RUNTIME_EXEC_NOW = "no runtime execution now";
const SENTINEL_NO_ROUTE_PATCHING_NOW = "no route patching now";
const SENTINEL_NO_ROUTE_WIRING_NOW = "no route wiring now";
const SENTINEL_NO_PUBLIC_RUNTIME = "no public runtime";
const SENTINEL_NO_DOCUMENTS = "no documents";
const SENTINEL_NO_OCR = "no OCR";
const SENTINEL_NO_SCANNER = "no scanner";
const SENTINEL_NO_PAID_MODE = "no paid mode";
const SENTINEL_NO_VAYLO_DNA = "no Vaylo DNA";
const SENTINEL_ACTUAL_MIN_SCOPED_PATCH = "actual minimal scoped runtime patch";
const SENTINEL_POST_PATCH_SAFETY_AUDIT = "post-patch safety audit";
const SENTINEL_FIRST_TEST_RUN_SEP_AUTH = "first internal test run requires separate authorization";
const SENTINEL_PUBLIC_RUNTIME_BLOCKED = "public runtime blocked";
const SENTINEL_DOCUMENT_MODE_BLOCKED = "document mode blocked";
const SENTINEL_PHOTO_OCR_BLOCKED = "photo/OCR blocked";
const SENTINEL_SCANNER_BLOCKED = "scanner blocked";
const SENTINEL_PAID_MODE_BLOCKED = "paid mode blocked";
const SENTINEL_VAYLO_DNA_BLOCKED = "Vaylo DNA blocked";
const SENTINEL_PRODUCTION_BLOCKED = "production blocked";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics debt";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic debt";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaScopedRuntimePatchAuthorizationDecisionResult(
  r: FreeQaScopedRuntimePatchAuthorizationDecisionResult,
): boolean {
  // Phase identity
  if (r.checkId !== "8.8L") return false;
  if (r.allPassed !== true) return false;
  if (r.scopedRuntimePatchAuthorizationDecisionOnly !== true) return false;
  if (r.freeQaScopedRuntimePatchAuthorizationDecisionFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.routeFilesModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runtimeActivationPerformed !== false) return false;
  if (r.controlledInternalRuntimeExecutionPerformed !== false) return false;
  if (r.minimalRuntimePatchPerformed !== false) return false;
  if (r.scopedRuntimePatchImplemented !== false) return false;
  if (r.publicRuntimeActivationPerformed !== false) return false;
  if (r.seamActivationPerformed !== false) return false;
  if (r.documentRuntimeActivationPerformed !== false) return false;
  if (r.photoOcrRuntimeActivationPerformed !== false) return false;
  if (r.scannerRuntimeActivationPerformed !== false) return false;
  if (r.paidDocumentModeRuntimeActivationPerformed !== false) return false;
  if (r.vayloDnaRuntimeActivationPerformed !== false) return false;
  // Import/runner flags and 8.8K confirmations
  if (r.importedOnlyFreeQaScopedRuntimePatchImplementationPlanRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanRunnerCalled !== true) return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanCheckId !== "8.8K") return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanAllPassed !== true) return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanConfirmed !== true) return false;
  // Authorization decision
  if (r.authorizationDecisionTarget !== AUTHORIZATION_DECISION_TARGET) return false;
  if (r.authorizationDecisionStatus !== AUTHORIZATION_DECISION_STATUS) return false;
  if (r.scopedRuntimePatchAuthorizedForNextPhase !== true) return false;
  if (r.authorizedNextPhase !== "8.8M_actual_minimal_scoped_runtime_patch") return false;
  if (r.authorizedPatchScopeFreeQaOnly !== true) return false;
  if (r.authorizedPatchScopeAnonymousNonDocumentQuestionOnly !== true) return false;
  if (r.authorizedPatchScopeControlledInternalOnly !== true) return false;
  if (r.authorizedPatchMustRemainDisabledByDefault !== true) return false;
  if (r.authorizedPatchMustUseInternalOnlyGuard !== true) return false;
  if (r.authorizedPatchMustBlockDocumentLikeText !== true) return false;
  if (r.authorizedPatchMustNotEnablePublicRuntime !== true) return false;
  if (r.authorizedPatchMustNotEnableDocuments !== true) return false;
  if (r.authorizedPatchMustNotEnablePhotoOcr !== true) return false;
  if (r.authorizedPatchMustNotEnableScanner !== true) return false;
  if (r.authorizedPatchMustNotEnablePaidMode !== true) return false;
  if (r.authorizedPatchMustNotEnableVayloDna !== true) return false;
  if (r.authorizedPatchMustNotPersistData !== true) return false;
  if (r.authorizedPatchMustNotCalculateExactLegalDeadlines !== true) return false;
  if (r.authorizedPatchMustTreatModelOutputAsUntrusted !== true) return false;
  // Inherited synthetic counts
  if (r.allowedSyntheticCasesPassed !== r.allowedSyntheticCaseCount) return false;
  if (r.forbiddenSyntheticCasesBlocked !== r.forbiddenSyntheticCaseCount) return false;
  if (r.unsafeUnknownSyntheticCasesFailedClosed !== r.unsafeUnknownSyntheticCaseCount) return false;
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
  if (r.readyForActualMinimalScopedRuntimePatch !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForControlledInternalTestRuntimeExecution !== false) return false;
  if (r.readyForMinimalRuntimePatchExecution !== false) return false;
  if (r.readyForScopedRuntimePatchExecution !== false) return false;
  if (r.readyForRoutePatching !== false) return false;
  if (r.readyForRouteWiring !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  // Future required phase flags
  if (r.futureActualMinimalScopedRuntimePatchRequired !== true) return false;
  if (r.futurePostPatchSafetyAuditRequired !== true) return false;
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
  // Inherited 8.8K tamper confirmation
  if (r.freeQaScopedRuntimePatchImplementationPlanTamperConfirmedFrom8x8K !== true) return false;
  if (r.freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected !== r.freeQaScopedRuntimePatchImplementationPlanTamperCaseCount) return false;
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
  if (!r.authorizedPatchScope || r.authorizedPatchScope.length === 0) return false;
  if (!r.nonAuthorizationBoundaries || r.nonAuthorizationBoundaries.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.authorizationDecisionNotes || r.authorizationDecisionNotes.length === 0) return false;
  // Sentinel checks
  const decisionJ = r.authorizationDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_AUTH_DECISION_STATUS)) return false;
  const scopeJ = r.authorizedPatchScope.join(" ");
  if (!scopeJ.includes(SENTINEL_FREE_QA_SCOPE)) return false;
  if (!scopeJ.includes(SENTINEL_ANON_NON_DOC)) return false;
  if (!scopeJ.includes(SENTINEL_CONTROLLED_INTERNAL_ONLY)) return false;
  if (!scopeJ.includes(SENTINEL_DISABLED_BY_DEFAULT)) return false;
  if (!scopeJ.includes(SENTINEL_INTERNAL_ONLY_GUARD)) return false;
  const boundariesJ = r.nonAuthorizationBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_NO_RUNTIME_EXEC_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_PATCHING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_ROUTE_WIRING_NOW)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_OCR)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_SCANNER)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_PAID_MODE)) return false;
  if (!boundariesJ.includes(SENTINEL_NO_VAYLO_DNA)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_ACTUAL_MIN_SCOPED_PATCH)) return false;
  if (!futureJ.includes(SENTINEL_POST_PATCH_SAFETY_AUDIT)) return false;
  if (!futureJ.includes(SENTINEL_FIRST_TEST_RUN_SEP_AUTH)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PAID_MODE_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_VAYLO_DNA_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_BLOCKED)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Own tamper coverage
  if (r.freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected !== r.freeQaScopedRuntimePatchAuthorizationDecisionTamperCaseCount) return false;
  if (r.freeQaScopedRuntimePatchAuthorizationDecisionTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88LMutation = (
  r: FreeQaScopedRuntimePatchAuthorizationDecisionResult,
) => FreeQaScopedRuntimePatchAuthorizationDecisionResult;
interface Tamper88LCase { label: string; mutate: Tamper88LMutation; }

const FREE_QA_AUTHORIZATION_DECISION_TAMPER_CASES: Tamper88LCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8K" as "8.8L" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "scopedRuntimePatchAuthorizationDecisionOnly false", mutate: (r) => ({ ...r, scopedRuntimePatchAuthorizationDecisionOnly: false as true }) },
  { label: "freeQaScopedRuntimePatchAuthorizationDecisionFileCreated false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchAuthorizationDecisionFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "routeFilesModified true", mutate: (r) => ({ ...r, routeFilesModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runtimeActivationPerformed true", mutate: (r) => ({ ...r, runtimeActivationPerformed: true as false }) },
  { label: "controlledInternalRuntimeExecutionPerformed true", mutate: (r) => ({ ...r, controlledInternalRuntimeExecutionPerformed: true as false }) },
  { label: "minimalRuntimePatchPerformed true", mutate: (r) => ({ ...r, minimalRuntimePatchPerformed: true as false }) },
  { label: "scopedRuntimePatchImplemented true", mutate: (r) => ({ ...r, scopedRuntimePatchImplemented: true as false }) },
  { label: "publicRuntimeActivationPerformed true", mutate: (r) => ({ ...r, publicRuntimeActivationPerformed: true as false }) },
  { label: "seamActivationPerformed true", mutate: (r) => ({ ...r, seamActivationPerformed: true as false }) },
  { label: "documentRuntimeActivationPerformed true", mutate: (r) => ({ ...r, documentRuntimeActivationPerformed: true as false }) },
  { label: "photoOcrRuntimeActivationPerformed true", mutate: (r) => ({ ...r, photoOcrRuntimeActivationPerformed: true as false }) },
  { label: "scannerRuntimeActivationPerformed true", mutate: (r) => ({ ...r, scannerRuntimeActivationPerformed: true as false }) },
  { label: "paidDocumentModeRuntimeActivationPerformed true", mutate: (r) => ({ ...r, paidDocumentModeRuntimeActivationPerformed: true as false }) },
  { label: "vayloDnaRuntimeActivationPerformed true", mutate: (r) => ({ ...r, vayloDnaRuntimeActivationPerformed: true as false }) },
  // Import/runner flags and 8.8K confirmations
  { label: "importedOnlyFreeQaScopedRuntimePatchImplementationPlanRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaScopedRuntimePatchImplementationPlanRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanRunnerCalled false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanRunnerCalled: false as true }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanCheckId wrong", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanCheckId: "8.8J" as "8.8K" }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanAllPassed false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanAllPassed: false as true }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanConfirmed false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanConfirmed: false as true }) },
  // Authorization decision
  { label: "authorizationDecisionTarget wrong", mutate: (r) => ({ ...r, authorizationDecisionTarget: "public_runtime_decision" as AuthorizationDecisionTarget88L }) },
  { label: "authorizationDecisionStatus wrong", mutate: (r) => ({ ...r, authorizationDecisionStatus: "unauthorized" as AuthorizationDecisionStatus88L }) },
  { label: "scopedRuntimePatchAuthorizedForNextPhase false", mutate: (r) => ({ ...r, scopedRuntimePatchAuthorizedForNextPhase: false as true }) },
  { label: "authorizedNextPhase wrong", mutate: (r) => ({ ...r, authorizedNextPhase: "public_runtime" as "8.8M_actual_minimal_scoped_runtime_patch" }) },
  { label: "authorizedPatchScopeFreeQaOnly false", mutate: (r) => ({ ...r, authorizedPatchScopeFreeQaOnly: false as true }) },
  { label: "authorizedPatchScopeAnonymousNonDocumentQuestionOnly false", mutate: (r) => ({ ...r, authorizedPatchScopeAnonymousNonDocumentQuestionOnly: false as true }) },
  { label: "authorizedPatchScopeControlledInternalOnly false", mutate: (r) => ({ ...r, authorizedPatchScopeControlledInternalOnly: false as true }) },
  { label: "authorizedPatchMustRemainDisabledByDefault false", mutate: (r) => ({ ...r, authorizedPatchMustRemainDisabledByDefault: false as true }) },
  { label: "authorizedPatchMustUseInternalOnlyGuard false", mutate: (r) => ({ ...r, authorizedPatchMustUseInternalOnlyGuard: false as true }) },
  { label: "authorizedPatchMustBlockDocumentLikeText false", mutate: (r) => ({ ...r, authorizedPatchMustBlockDocumentLikeText: false as true }) },
  { label: "authorizedPatchMustNotEnablePublicRuntime false", mutate: (r) => ({ ...r, authorizedPatchMustNotEnablePublicRuntime: false as true }) },
  { label: "authorizedPatchMustNotEnableDocuments false", mutate: (r) => ({ ...r, authorizedPatchMustNotEnableDocuments: false as true }) },
  { label: "authorizedPatchMustNotEnablePhotoOcr false", mutate: (r) => ({ ...r, authorizedPatchMustNotEnablePhotoOcr: false as true }) },
  { label: "authorizedPatchMustNotEnableScanner false", mutate: (r) => ({ ...r, authorizedPatchMustNotEnableScanner: false as true }) },
  { label: "authorizedPatchMustNotEnablePaidMode false", mutate: (r) => ({ ...r, authorizedPatchMustNotEnablePaidMode: false as true }) },
  { label: "authorizedPatchMustNotEnableVayloDna false", mutate: (r) => ({ ...r, authorizedPatchMustNotEnableVayloDna: false as true }) },
  { label: "authorizedPatchMustNotPersistData false", mutate: (r) => ({ ...r, authorizedPatchMustNotPersistData: false as true }) },
  { label: "authorizedPatchMustNotCalculateExactLegalDeadlines false", mutate: (r) => ({ ...r, authorizedPatchMustNotCalculateExactLegalDeadlines: false as true }) },
  { label: "authorizedPatchMustTreatModelOutputAsUntrusted false", mutate: (r) => ({ ...r, authorizedPatchMustTreatModelOutputAsUntrusted: false as true }) },
  // Inherited synthetic counts
  { label: "allowedSyntheticCasesPassed not equal allowedSyntheticCaseCount", mutate: (r) => ({ ...r, allowedSyntheticCasesPassed: r.allowedSyntheticCasesPassed - 1 }) },
  { label: "forbiddenSyntheticCasesBlocked not equal forbiddenSyntheticCaseCount", mutate: (r) => ({ ...r, forbiddenSyntheticCasesBlocked: r.forbiddenSyntheticCasesBlocked - 1 }) },
  { label: "unsafeUnknownSyntheticCasesFailedClosed not equal unsafeUnknownSyntheticCaseCount", mutate: (r) => ({ ...r, unsafeUnknownSyntheticCasesFailedClosed: r.unsafeUnknownSyntheticCasesFailedClosed - 1 }) },
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
  { label: "readyForActualMinimalScopedRuntimePatch false", mutate: (r) => ({ ...r, readyForActualMinimalScopedRuntimePatch: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForControlledInternalTestRuntimeExecution true", mutate: (r) => ({ ...r, readyForControlledInternalTestRuntimeExecution: true as false }) },
  { label: "readyForMinimalRuntimePatchExecution true", mutate: (r) => ({ ...r, readyForMinimalRuntimePatchExecution: true as false }) },
  { label: "readyForScopedRuntimePatchExecution true", mutate: (r) => ({ ...r, readyForScopedRuntimePatchExecution: true as false }) },
  { label: "readyForRoutePatching true", mutate: (r) => ({ ...r, readyForRoutePatching: true as false }) },
  { label: "readyForRouteWiring true", mutate: (r) => ({ ...r, readyForRouteWiring: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  // Future required phase flags
  { label: "futureActualMinimalScopedRuntimePatchRequired false", mutate: (r) => ({ ...r, futureActualMinimalScopedRuntimePatchRequired: false as true }) },
  { label: "futurePostPatchSafetyAuditRequired false", mutate: (r) => ({ ...r, futurePostPatchSafetyAuditRequired: false as true }) },
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
  // Inherited 8.8K tamper confirmation
  { label: "freeQaScopedRuntimePatchImplementationPlanTamperConfirmedFrom8x8K false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanTamperConfirmedFrom8x8K: false as true }) },
  { label: "freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected: r.freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected - 1 }) },
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
  { label: "authorizedPatchScope empty", mutate: (r) => ({ ...r, authorizedPatchScope: [] }) },
  { label: "nonAuthorizationBoundaries empty", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "authorizationDecisionNotes empty", mutate: (r) => ({ ...r, authorizationDecisionNotes: [] }) },
  // Array sentinel checks
  { label: "authorizationDecision missing authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only sentinel", mutate: (r) => ({ ...r, authorizationDecision: r.authorizationDecision.map((s) => s.split(SENTINEL_AUTH_DECISION_STATUS).join("omitted")) }) },
  { label: "authorizedPatchScope missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, authorizedPatchScope: r.authorizedPatchScope.map((s) => s.split(SENTINEL_FREE_QA_SCOPE).join("omitted")) }) },
  { label: "authorizedPatchScope missing anonymous non-document questions only sentinel", mutate: (r) => ({ ...r, authorizedPatchScope: r.authorizedPatchScope.map((s) => s.split(SENTINEL_ANON_NON_DOC).join("omitted")) }) },
  { label: "authorizedPatchScope missing controlled internal test only sentinel", mutate: (r) => ({ ...r, authorizedPatchScope: r.authorizedPatchScope.map((s) => s.split(SENTINEL_CONTROLLED_INTERNAL_ONLY).join("omitted")) }) },
  { label: "authorizedPatchScope missing disabled by default sentinel", mutate: (r) => ({ ...r, authorizedPatchScope: r.authorizedPatchScope.map((s) => s.split(SENTINEL_DISABLED_BY_DEFAULT).join("omitted")) }) },
  { label: "authorizedPatchScope missing internal-only guard sentinel", mutate: (r) => ({ ...r, authorizedPatchScope: r.authorizedPatchScope.map((s) => s.split(SENTINEL_INTERNAL_ONLY_GUARD).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no runtime execution now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_RUNTIME_EXEC_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route patching now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_PATCHING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no route wiring now sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_ROUTE_WIRING_NOW).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no public runtime sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no documents sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_DOCUMENTS).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no OCR sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_OCR).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no scanner sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_SCANNER).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no paid mode sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_PAID_MODE).join("omitted")) }) },
  { label: "nonAuthorizationBoundaries missing no Vaylo DNA sentinel", mutate: (r) => ({ ...r, nonAuthorizationBoundaries: r.nonAuthorizationBoundaries.map((s) => s.split(SENTINEL_NO_VAYLO_DNA).join("omitted")) }) },
  { label: "futureRequiredPhases missing actual minimal scoped runtime patch sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_ACTUAL_MIN_SCOPED_PATCH).join("omitted")) }) },
  { label: "futureRequiredPhases missing post-patch safety audit sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_POST_PATCH_SAFETY_AUDIT).join("omitted")) }) },
  { label: "futureRequiredPhases missing first internal test run requires separate authorization sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_FIRST_TEST_RUN_SEP_AUTH).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing public runtime blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing paid mode blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PAID_MODE_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing Vaylo DNA blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_VAYLO_DNA_BLOCKED).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing production blocked sentinel", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PRODUCTION_BLOCKED).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Own tamper coverage self-checks
  { label: "freeQaScopedRuntimePatchAuthorizationDecisionTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchAuthorizationDecisionTamperCoveragePassing: false as true }) },
  { label: "freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected: r.freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected - 1 }) },
];

// ─── Exported authorization-decision runner ───────────────────────────────────

/**
 * Free Smart Talk Q&A Scoped Runtime Patch Authorization Decision runner
 * for 8.8L.
 *
 * Calls the 8.8K Scoped Runtime Patch Implementation Plan runner as source
 * of truth. Renders the FINAL authorization decision for the scoped
 * minimal runtime patch described by 8.8K, authorizing only the NEXT phase
 * to implement the actual minimal scoped runtime patch. Does NOT perform
 * the patch itself.
 */
export function runFreeQaScopedRuntimePatchAuthorizationDecision(): FreeQaScopedRuntimePatchAuthorizationDecisionResult {
  const decisionFailures: string[] = [];

  // ── Call 8.8K Implementation Plan runner as source of truth ──────────
  const k = runFreeQaScopedRuntimePatchImplementationPlan();

  if (k.checkId !== "8.8K") decisionFailures.push(`8.8K checkId mismatch: expected "8.8K", got "${k.checkId}"`);
  if (k.allPassed !== true) decisionFailures.push("8.8K allPassed is not true");
  if (k.implementationPlanTarget !== IMPLEMENTATION_PLAN_TARGET_K) decisionFailures.push(`8.8K implementationPlanTarget mismatch: expected "${IMPLEMENTATION_PLAN_TARGET_K}", got "${k.implementationPlanTarget}"`);
  if (k.implementationPlanStatus !== IMPLEMENTATION_PLAN_STATUS_K) decisionFailures.push(`8.8K implementationPlanStatus mismatch: expected "${IMPLEMENTATION_PLAN_STATUS_K}", got "${k.implementationPlanStatus}"`);
  if (k.readyForFreeQaScopedRuntimePatchAuthorizationDecision !== true) decisionFailures.push("8.8K readyForFreeQaScopedRuntimePatchAuthorizationDecision is not true");
  if (k.readyForRuntimeActivation !== false) decisionFailures.push("8.8K readyForRuntimeActivation is not false");
  if (k.readyForControlledInternalTestRuntimeExecution !== false) decisionFailures.push("8.8K readyForControlledInternalTestRuntimeExecution is not false");
  if (k.readyForMinimalRuntimePatchExecution !== false) decisionFailures.push("8.8K readyForMinimalRuntimePatchExecution is not false");
  if (k.readyForScopedRuntimePatchExecution !== false) decisionFailures.push("8.8K readyForScopedRuntimePatchExecution is not false");
  if (k.readyForRoutePatching !== false) decisionFailures.push("8.8K readyForRoutePatching is not false");
  if (k.readyForRouteWiring !== false) decisionFailures.push("8.8K readyForRouteWiring is not false");
  if (k.allowedSyntheticCasesPassed !== k.allowedSyntheticCaseCount) decisionFailures.push(`8.8K allowed cases: ${k.allowedSyntheticCasesPassed}/${k.allowedSyntheticCaseCount}`);
  if (k.forbiddenSyntheticCasesBlocked !== k.forbiddenSyntheticCaseCount) decisionFailures.push(`8.8K forbidden cases: ${k.forbiddenSyntheticCasesBlocked}/${k.forbiddenSyntheticCaseCount}`);
  if (k.unsafeUnknownSyntheticCasesFailedClosed !== k.unsafeUnknownSyntheticCaseCount) decisionFailures.push(`8.8K unsafe/unknown cases: ${k.unsafeUnknownSyntheticCasesFailedClosed}/${k.unsafeUnknownSyntheticCaseCount}`);
  if (k.runtimeActivationPerformed !== false) decisionFailures.push("8.8K runtimeActivationPerformed is not false");
  if (k.controlledInternalRuntimeExecutionPerformed !== false) decisionFailures.push("8.8K controlledInternalRuntimeExecutionPerformed is not false");
  if (k.minimalRuntimePatchPerformed !== false) decisionFailures.push("8.8K minimalRuntimePatchPerformed is not false");
  if (k.scopedRuntimePatchImplemented !== false) decisionFailures.push("8.8K scopedRuntimePatchImplemented is not false");
  if (k.seamActivationPerformed !== false) decisionFailures.push("8.8K seamActivationPerformed is not false");
  if (k.documentRuntimeActivationPerformed !== false) decisionFailures.push("8.8K documentRuntimeActivationPerformed is not false");
  if (k.photoOcrRuntimeActivationPerformed !== false) decisionFailures.push("8.8K photoOcrRuntimeActivationPerformed is not false");
  if (k.scannerRuntimeActivationPerformed !== false) decisionFailures.push("8.8K scannerRuntimeActivationPerformed is not false");
  if (k.paidDocumentModeRuntimeActivationPerformed !== false) decisionFailures.push("8.8K paidDocumentModeRuntimeActivationPerformed is not false");
  if (k.vayloDnaRuntimeActivationPerformed !== false) decisionFailures.push("8.8K vayloDnaRuntimeActivationPerformed is not false");
  if (k.routePatchPerformed !== false) decisionFailures.push("8.8K routePatchPerformed is not false");
  if (k.routeWiringPerformed !== false) decisionFailures.push("8.8K routeWiringPerformed is not false");
  if (k.realDocumentInputAuthorizedNow !== false) decisionFailures.push("8.8K realDocumentInputAuthorizedNow is not false");
  if (k.userVisibleOutputAuthorizedNow !== false) decisionFailures.push("8.8K userVisibleOutputAuthorizedNow is not false");
  if (k.publicRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K publicRuntimeAuthorizedNow is not false");
  if (k.modelFacingUseAuthorizedNow !== false) decisionFailures.push("8.8K modelFacingUseAuthorizedNow is not false");
  if (k.evidenceGateExecutionAuthorizedNow !== false) decisionFailures.push("8.8K evidenceGateExecutionAuthorizedNow is not false");
  if (k.claimAuthorizationAuthorizedNow !== false) decisionFailures.push("8.8K claimAuthorizationAuthorizedNow is not false");
  if (k.exactDeadlineCalculationAuthorized !== false) decisionFailures.push("8.8K exactDeadlineCalculationAuthorized is not false");
  if (k.paymentRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K paymentRuntimeAuthorizedNow is not false");
  if (k.entitlementRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K entitlementRuntimeAuthorizedNow is not false");
  if (k.checkoutRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K checkoutRuntimeAuthorizedNow is not false");
  if (k.pilotAuthorizationGranted !== false) decisionFailures.push("8.8K pilotAuthorizationGranted is not false");
  if (k.productionAuthorizationGranted !== false) decisionFailures.push("8.8K productionAuthorizationGranted is not false");
  if (k.goLiveAuthorizationGranted !== false) decisionFailures.push("8.8K goLiveAuthorizationGranted is not false");
  if (k.seamActivationAuthorizedNow !== false) decisionFailures.push("8.8K seamActivationAuthorizedNow is not false");
  if (k.controlledRuntimeActivationAuthorizedNow !== false) decisionFailures.push("8.8K controlledRuntimeActivationAuthorizedNow is not false");
  if (k.controlledInternalRuntimeExecutionAuthorizedNow !== false) decisionFailures.push("8.8K controlledInternalRuntimeExecutionAuthorizedNow is not false");
  if (k.minimalRuntimePatchAuthorizedNow !== false) decisionFailures.push("8.8K minimalRuntimePatchAuthorizedNow is not false");
  if (k.scopedRuntimePatchAuthorizedNow !== false) decisionFailures.push("8.8K scopedRuntimePatchAuthorizedNow is not false");
  if (k.routePatchingAuthorizedNow !== false) decisionFailures.push("8.8K routePatchingAuthorizedNow is not false");
  if (k.routeWiringAuthorizedNow !== false) decisionFailures.push("8.8K routeWiringAuthorizedNow is not false");
  if (k.documentRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K documentRuntimeAuthorizedNow is not false");
  if (k.photoOcrRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K photoOcrRuntimeAuthorizedNow is not false");
  if (k.scannerUploadAuthorizedNow !== false) decisionFailures.push("8.8K scannerUploadAuthorizedNow is not false");
  if (k.vayloDnaRuntimeAuthorizedNow !== false) decisionFailures.push("8.8K vayloDnaRuntimeAuthorizedNow is not false");
  if (k.freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected !== k.freeQaScopedRuntimePatchImplementationPlanTamperCaseCount) decisionFailures.push("8.8K own tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const authorizationDecision: string[] = [
    `AD-01 [${SENTINEL_AUTH_DECISION_STATUS}]: authorized_for_next_phase_actual_minimal_scoped_runtime_patch_only — the NEXT phase (8.8M) is now authorized to implement the actual minimal scoped runtime patch for Free Smart Talk Q&A.`,
    "AD-02: This phase itself does NOT implement the patch, patch/wire routes, enable runtime, or enable the Evidence Gates seam.",
    "AD-03: The authorized future patch must remain disabled by default until an internal test flag is explicitly enabled.",
    "AD-04: A separate authorization is required before the first internal test run.",
  ];

  const authorizedPatchScope: string[] = [
    `PS-01 [${SENTINEL_FREE_QA_SCOPE}]: Free Smart Talk Q&A — ${SENTINEL_ANON_NON_DOC} — ${SENTINEL_CONTROLLED_INTERNAL_ONLY} — the authorized future patch scope is limited accordingly.`,
    `PS-02 [${SENTINEL_DISABLED_BY_DEFAULT}]: disabled by default — the authorized future patch must remain disabled by default unless an internal test flag is explicitly enabled in the future patch.`,
    `PS-03 [${SENTINEL_INTERNAL_ONLY_GUARD}]: internal-only guard — the authorized future patch must use an internal-only guard to prevent public exposure.`,
    "PS-04: Authorized patch scope excludes public users, documents, OCR/photo/scanner/upload, paid mode, and Vaylo DNA.",
    "PS-05: Authorized patch scope excludes persistence, exact legal deadline calculation, and trusted legal advice.",
  ];

  const nonAuthorizationBoundaries: string[] = [
    `NB-01 [${SENTINEL_NO_RUNTIME_EXEC_NOW}]: no runtime execution now — this decision does not execute runtime for Free Smart Talk Q&A.`,
    `NB-02 [${SENTINEL_NO_ROUTE_PATCHING_NOW}]: no route patching now — this decision does not patch any route file now.`,
    `NB-03 [${SENTINEL_NO_ROUTE_WIRING_NOW}]: no route wiring now — this decision does not wire any route file now.`,
    `NB-04 [${SENTINEL_NO_PUBLIC_RUNTIME}]: no public runtime — public users cannot use the route as a result of this decision.`,
    `NB-05 [${SENTINEL_NO_DOCUMENTS}]: no documents — real document input remains unauthorized by this decision.`,
    `NB-06 [${SENTINEL_NO_OCR}]: no OCR — OCR processing remains unauthorized by this decision.`,
    `NB-07 [${SENTINEL_NO_SCANNER}]: no scanner — scanner upload remains unauthorized by this decision.`,
    `NB-08 [${SENTINEL_NO_PAID_MODE}]: no paid mode — Paid Document Mode remains unauthorized by this decision.`,
    `NB-09 [${SENTINEL_NO_VAYLO_DNA}]: no Vaylo DNA — Vaylo DNA runtime remains unauthorized by this decision.`,
    "NB-10: no pilot, no production, no go-live authorization is granted by this decision.",
    "NB-11: no exact legal deadline calculation and no trusted model output authorization is granted by this decision.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_ACTUAL_MIN_SCOPED_PATCH}]: actual minimal scoped runtime patch — the next phase (8.8M) may implement the actual minimal scoped runtime patch.`,
    `FP-02 [${SENTINEL_POST_PATCH_SAFETY_AUDIT}]: post-patch safety audit — a post-patch safety audit is required after the actual minimal scoped runtime patch.`,
    `FP-03 [${SENTINEL_FIRST_TEST_RUN_SEP_AUTH}]: first internal test run requires separate authorization — the first actual internal test execution needs its own authorization.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01: ${SENTINEL_PUBLIC_RUNTIME_BLOCKED} — public runtime remains globally blocked.`,
    `GB-02: ${SENTINEL_DOCUMENT_MODE_BLOCKED} — text document mode runtime remains globally blocked.`,
    `GB-03: ${SENTINEL_PHOTO_OCR_BLOCKED} — photo and OCR runtime remains globally blocked.`,
    `GB-04: ${SENTINEL_SCANNER_BLOCKED} — scanner upload runtime remains globally blocked.`,
    `GB-05: ${SENTINEL_PAID_MODE_BLOCKED} — Paid Document Mode remains globally blocked.`,
    `GB-06: ${SENTINEL_VAYLO_DNA_BLOCKED} — Vaylo DNA runtime remains globally blocked.`,
    `GB-07: ${SENTINEL_PRODUCTION_BLOCKED} — production and go-live remain globally blocked.`,
    "GB-08: payment and entitlement runtime remain globally blocked.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01: ${SENTINEL_CLAIM_RULE_OR} — ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8L.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8L.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8L.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8L.)",
    `GD-05: ${SENTINEL_TRAP_HEURISTIC} — enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8L.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8L.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8L.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8L.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8L.)",
  ];

  const authorizationDecisionNotes: string[] = [
    "IN-01: 8.8L scoped runtime patch authorization decision rendered for Free Smart Talk Q&A only.",
    `IN-02: 8.8K confirmed — checkId=${k.checkId}, allPassed=${k.allPassed}, implementationPlanTarget=${k.implementationPlanTarget}.`,
    `IN-03: Synthetic matrix inherited via 8.8K: ${k.allowedSyntheticCasesPassed}/${k.allowedSyntheticCaseCount} allowed, ${k.forbiddenSyntheticCasesBlocked}/${k.forbiddenSyntheticCaseCount} forbidden blocked, ${k.unsafeUnknownSyntheticCasesFailedClosed}/${k.unsafeUnknownSyntheticCaseCount} unsafe fail-closed.`,
    "IN-04: This is a decision-only phase; only the NEXT phase (8.8M) is authorized to implement the actual minimal scoped runtime patch.",
    "IN-05: All runtime/public/document activation flags remain false after this decision.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_AUTHORIZATION_DECISION_TAMPER_CASES.length;

  const provisional: FreeQaScopedRuntimePatchAuthorizationDecisionResult = {
    checkId: "8.8L",
    allPassed: true,
    scopedRuntimePatchAuthorizationDecisionOnly: true,
    freeQaScopedRuntimePatchAuthorizationDecisionFileCreated: true,
    existingFilesModified: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    routeFilesModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runtimeActivationPerformed: false,
    controlledInternalRuntimeExecutionPerformed: false,
    minimalRuntimePatchPerformed: false,
    scopedRuntimePatchImplemented: false,
    publicRuntimeActivationPerformed: false,
    seamActivationPerformed: false,
    documentRuntimeActivationPerformed: false,
    photoOcrRuntimeActivationPerformed: false,
    scannerRuntimeActivationPerformed: false,
    paidDocumentModeRuntimeActivationPerformed: false,
    vayloDnaRuntimeActivationPerformed: false,
    importedOnlyFreeQaScopedRuntimePatchImplementationPlanRunner: true,
    noOtherImportsUsed: true,
    freeQaScopedRuntimePatchImplementationPlanRunnerCalled: true,
    freeQaScopedRuntimePatchImplementationPlanCheckId: "8.8K",
    freeQaScopedRuntimePatchImplementationPlanAllPassed: true,
    freeQaScopedRuntimePatchImplementationPlanConfirmed: true,
    authorizationDecisionTarget: AUTHORIZATION_DECISION_TARGET,
    authorizationDecisionStatus: AUTHORIZATION_DECISION_STATUS,
    scopedRuntimePatchAuthorizedForNextPhase: true,
    authorizedNextPhase: "8.8M_actual_minimal_scoped_runtime_patch",
    authorizedPatchScopeFreeQaOnly: true,
    authorizedPatchScopeAnonymousNonDocumentQuestionOnly: true,
    authorizedPatchScopeControlledInternalOnly: true,
    authorizedPatchMustRemainDisabledByDefault: true,
    authorizedPatchMustUseInternalOnlyGuard: true,
    authorizedPatchMustBlockDocumentLikeText: true,
    authorizedPatchMustNotEnablePublicRuntime: true,
    authorizedPatchMustNotEnableDocuments: true,
    authorizedPatchMustNotEnablePhotoOcr: true,
    authorizedPatchMustNotEnableScanner: true,
    authorizedPatchMustNotEnablePaidMode: true,
    authorizedPatchMustNotEnableVayloDna: true,
    authorizedPatchMustNotPersistData: true,
    authorizedPatchMustNotCalculateExactLegalDeadlines: true,
    authorizedPatchMustTreatModelOutputAsUntrusted: true,
    allowedSyntheticCaseCount: k.allowedSyntheticCaseCount,
    allowedSyntheticCasesPassed: k.allowedSyntheticCasesPassed,
    forbiddenSyntheticCaseCount: k.forbiddenSyntheticCaseCount,
    forbiddenSyntheticCasesBlocked: k.forbiddenSyntheticCasesBlocked,
    unsafeUnknownSyntheticCaseCount: k.unsafeUnknownSyntheticCaseCount,
    unsafeUnknownSyntheticCasesFailedClosed: k.unsafeUnknownSyntheticCasesFailedClosed,
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
    readyForActualMinimalScopedRuntimePatch: true,
    readyForRuntimeActivation: false,
    readyForControlledInternalTestRuntimeExecution: false,
    readyForMinimalRuntimePatchExecution: false,
    readyForScopedRuntimePatchExecution: false,
    readyForRoutePatching: false,
    readyForRouteWiring: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    futureActualMinimalScopedRuntimePatchRequired: true,
    futurePostPatchSafetyAuditRequired: true,
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
    freeQaScopedRuntimePatchImplementationPlanTamperConfirmedFrom8x8K: true,
    freeQaScopedRuntimePatchImplementationPlanTamperCaseCount: k.freeQaScopedRuntimePatchImplementationPlanTamperCaseCount,
    freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected: k.freeQaScopedRuntimePatchImplementationPlanTamperCasesRejected,
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
    authorizedPatchScope,
    nonAuthorizationBoundaries,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    authorizationDecisionNotes,
    freeQaScopedRuntimePatchAuthorizationDecisionTamperCaseCount: tamperCaseCount,
    freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected: tamperCaseCount,
    freeQaScopedRuntimePatchAuthorizationDecisionTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaScopedRuntimePatchAuthorizationDecisionResult(provisional)) {
    decisionFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8L tamper cases ─────────────────────────────────────────────
  let freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_AUTHORIZATION_DECISION_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_AUTHORIZATION_DECISION_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaScopedRuntimePatchAuthorizationDecisionResult(tc.mutate(provisional))) {
      freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8L tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) decisionFailures.push(...tamperFailures);

  const allPassed =
    decisionFailures.length === 0 &&
    freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected === tamperCaseCount;

  const finalAuthorizationDecisionNotes: string[] = [
    ...authorizationDecisionNotes,
    `8.8L tamper cases: ${freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(decisionFailures.length > 0 ? [`FAILURES (${decisionFailures.length}):`, ...decisionFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected,
    authorizationDecisionNotes: finalAuthorizationDecisionNotes,
  };
}
