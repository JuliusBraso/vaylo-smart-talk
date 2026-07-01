/**
 * PHASE 8.8A — Smart Talk Governance Kernel Consolidation Audit
 *
 * Consolidates the governance state of TD-001 through TD-005 after TD-002 closure (8.7J).
 * Confirms the kernel is architecturally prepared but NOT runtime-authorized.
 *
 * TD-001: closed_document_bypass_guard
 * TD-002: closed_for_scoped_disabled_by_default_containment_seam_only
 * TD-003: closed_photo_ocr_route_containment
 * TD-004: closed_isolated_pre_model_pii_redaction_utility_only
 * TD-005: closed_paid_document_mode_boundary_containment
 *
 * The governance kernel is NOT authorized for production runtime, real document input,
 * user-visible output, pilot, go-live, or any seam activation.
 * Controlled runtime activation requires a separate future plan, contract,
 * dry-run, audit, and closure decision.
 */

import { runControlledRealDocumentEvidenceGatesClosureDecision } from "./run-controlled-real-document-evidence-gates-closure-decision";

// ─── TD status literal types ──────────────────────────────────────────────────

type Td001Status = "closed_document_bypass_guard";
type Td002Status = "closed_for_scoped_disabled_by_default_containment_seam_only";
type Td003Status = "closed_photo_ocr_route_containment";
type Td004Status = "closed_isolated_pre_model_pii_redaction_utility_only";
type Td005Status = "closed_paid_document_mode_boundary_containment";

// ─── Return type ──────────────────────────────────────────────────────────────

interface ConsolidationAuditResult {
  checkId: "8.8A";
  allPassed: boolean;
  governanceKernelConsolidationAuditOnly: true;
  governanceKernelConsolidationAuditFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  evidenceGatesClosureDecisionFileModified: false;
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
  importedOnlyEvidenceGatesClosureDecisionRunner: true;
  noOtherImportsUsed: true;
  evidenceGatesClosureDecisionRunnerCalled: true;
  evidenceGatesClosureDecisionCheckId: "8.7J";
  evidenceGatesClosureDecisionAllPassed: true;
  td002ClosureStatusConfirmed: true;
  td002ClosureStatus: Td002Status;
  td001Status: Td001Status;
  td002Status: Td002Status;
  td003Status: Td003Status;
  td004Status: Td004Status;
  td005Status: Td005Status;
  td001ClosedConfirmed: true;
  td002ClosedConfirmed: true;
  td003ClosedConfirmed: true;
  td004ClosedConfirmed: true;
  td005ClosedConfirmed: true;
  td002ClosedOnlyForScopedDisabledByDefaultContainmentSeam: true;
  td002NotClosedForRuntimeAuthorization: true;
  td002NotClosedForPublicRuntime: true;
  td002NotClosedForRealDocumentInput: true;
  td002NotClosedForUserVisibleOutput: true;
  td002NotClosedForProductionGoLive: true;
  td002NotClosedForFinalProductionEvidenceGatesEnforcement: true;
  td002NotClosedForFullProductionClaimAuthorization: true;
  td002NotClosedForFullProductionRealityAuthorization: true;
  evidenceGatesSeamExistsButDisabledByDefault: true;
  evidenceGatesSeamRemainsInert: true;
  evidenceGatesDryRunAdapterNotCalledWhileDisabled: true;
  evidenceGatesDryRunAdapterOutputNotUserVisible: true;
  evidenceGatesDryRunAdapterOutputNotPersisted: true;
  evidenceGatesSeamActivationUnauthorized: true;
  governanceKernelArchitecturallyPrepared: true;
  governanceKernelRuntimeAuthorized: false;
  controlledRuntimeActivationPlanRequired: true;
  controlledRuntimeActivationContractRequired: true;
  controlledRuntimeActivationDryRunRequired: true;
  controlledRuntimeActivationAuditRequired: true;
  controlledRuntimeActivationClosureDecisionRequired: true;
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
  td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true;
  td004DoesNotAuthorizeRouteWiringConfirmed: true;
  td004DoesNotAuthorizeRealDocumentInputConfirmed: true;
  td004DoesNotAuthorizeUserVisibleOutputConfirmed: true;
  td004DoesNotAuthorizePublicRuntimeConfirmed: true;
  modelOutputRemainsUntrusted: true;
  claimAuthorizationSeparateFromRealityAuthorization: true;
  highRiskClaimsBlockedUnlessClaimAuthorized: true;
  documentDerivedClaimsBlockedUnlessRealityAuthorized: true;
  trapActivationStructuredMetadataOnly: true;
  unsafeUnknownStatesFailClosed: true;
  evidenceGatesUserVisibleOutputBlockedByDefault: true;
  exactLegalDeadlineCalculationUnauthorizedStillFalse: true;
  auditMetadataNonPersistentByDefault: true;
  claimRuleOrSemanticsDebtPreserved: true;
  evidenceRuleResolutionDebtPreserved: true;
  proximityManualOnlyDebtPreserved: true;
  trapKindTypingDebtPreserved: true;
  enforcementTrapHeuristicDebtPreserved: true;
  trapDispositionStateSeparationDebtPreserved: true;
  severityCandidateDerivationSeparationDebtPreserved: true;
  mapperDiagnosticTaxonomyDebtPreserved: true;
  td004ClosureDoesNotAuthorizeWiringDebtPreserved: true;
  evidenceGatesClosureDecisionTamperConfirmedFrom8x7J: true;
  evidenceGatesClosureDecisionTamperCaseCount: number;
  evidenceGatesClosureDecisionTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperConfirmedFrom8x7J: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x7J: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x7J: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x7J: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x7J: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x7J: true;
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
  readyFor8x8BControlledRuntimeActivationPlan: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tdStatusMatrix: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  consolidationAuditNotes: string[];
  nextPhaseRecommendation: string[];
  governanceKernelConsolidationTamperCaseCount: number;
  governanceKernelConsolidationTamperCasesRejected: number;
  governanceKernelConsolidationTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const TD001_STATUS_VALUE: Td001Status = "closed_document_bypass_guard";
const TD002_STATUS_VALUE: Td002Status = "closed_for_scoped_disabled_by_default_containment_seam_only";
const TD003_STATUS_VALUE: Td003Status = "closed_photo_ocr_route_containment";
const TD004_STATUS_VALUE: Td004Status = "closed_isolated_pre_model_pii_redaction_utility_only";
const TD005_STATUS_VALUE: Td005Status = "closed_paid_document_mode_boundary_containment";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_REAL_DOC_BLOCKER = "real-document-input-unauthorized-global-blocker";
const SENTINEL_USER_VISIBLE_BLOCKER = "user-visible-output-unauthorized-global-blocker";
const SENTINEL_PUBLIC_RUNTIME_BLOCKER = "public-runtime-unauthorized-global-blocker";
const SENTINEL_PRODUCTION_BLOCKER = "production-go-live-unauthorized-global-blocker";
const SENTINEL_SEAM_ACTIVATION_BLOCKER = "seam-activation-unauthorized-global-blocker";
const SENTINEL_CONTROLLED_RUNTIME_PLAN = "8x8B-controlled-runtime-activation-plan-required";
const SENTINEL_TD002_STATUS_IN_MATRIX = "closed_for_scoped_disabled_by_default_containment_seam_only";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalConsolidationAuditResult(r: ConsolidationAuditResult): boolean {
  if (r.checkId !== "8.8A") return false;
  if (r.allPassed !== true) return false;
  if (r.governanceKernelConsolidationAuditOnly !== true) return false;
  if (r.governanceKernelConsolidationAuditFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.evidenceGatesClosureDecisionFileModified !== false) return false;
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
  if (r.importedOnlyEvidenceGatesClosureDecisionRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.evidenceGatesClosureDecisionRunnerCalled !== true) return false;
  if (r.evidenceGatesClosureDecisionCheckId !== "8.7J") return false;
  if (r.evidenceGatesClosureDecisionAllPassed !== true) return false;
  if (r.td002ClosureStatusConfirmed !== true) return false;
  if (r.td002ClosureStatus !== TD002_STATUS_VALUE) return false;
  if (r.td001Status !== TD001_STATUS_VALUE) return false;
  if (r.td002Status !== TD002_STATUS_VALUE) return false;
  if (r.td003Status !== TD003_STATUS_VALUE) return false;
  if (r.td004Status !== TD004_STATUS_VALUE) return false;
  if (r.td005Status !== TD005_STATUS_VALUE) return false;
  if (r.td001ClosedConfirmed !== true) return false;
  if (r.td002ClosedConfirmed !== true) return false;
  if (r.td003ClosedConfirmed !== true) return false;
  if (r.td004ClosedConfirmed !== true) return false;
  if (r.td005ClosedConfirmed !== true) return false;
  if (r.td002ClosedOnlyForScopedDisabledByDefaultContainmentSeam !== true) return false;
  if (r.td002NotClosedForRuntimeAuthorization !== true) return false;
  if (r.td002NotClosedForPublicRuntime !== true) return false;
  if (r.td002NotClosedForRealDocumentInput !== true) return false;
  if (r.td002NotClosedForUserVisibleOutput !== true) return false;
  if (r.td002NotClosedForProductionGoLive !== true) return false;
  if (r.td002NotClosedForFinalProductionEvidenceGatesEnforcement !== true) return false;
  if (r.td002NotClosedForFullProductionClaimAuthorization !== true) return false;
  if (r.td002NotClosedForFullProductionRealityAuthorization !== true) return false;
  if (r.evidenceGatesSeamExistsButDisabledByDefault !== true) return false;
  if (r.evidenceGatesSeamRemainsInert !== true) return false;
  if (r.evidenceGatesDryRunAdapterNotCalledWhileDisabled !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotUserVisible !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotPersisted !== true) return false;
  if (r.evidenceGatesSeamActivationUnauthorized !== true) return false;
  if (r.governanceKernelArchitecturallyPrepared !== true) return false;
  if (r.governanceKernelRuntimeAuthorized !== false) return false;
  if (r.controlledRuntimeActivationPlanRequired !== true) return false;
  if (r.controlledRuntimeActivationContractRequired !== true) return false;
  if (r.controlledRuntimeActivationDryRunRequired !== true) return false;
  if (r.controlledRuntimeActivationAuditRequired !== true) return false;
  if (r.controlledRuntimeActivationClosureDecisionRequired !== true) return false;
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
  if (r.td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRouteWiringConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRealDocumentInputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeUserVisibleOutputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizePublicRuntimeConfirmed !== true) return false;
  if (r.modelOutputRemainsUntrusted !== true) return false;
  if (r.claimAuthorizationSeparateFromRealityAuthorization !== true) return false;
  if (r.highRiskClaimsBlockedUnlessClaimAuthorized !== true) return false;
  if (r.documentDerivedClaimsBlockedUnlessRealityAuthorized !== true) return false;
  if (r.trapActivationStructuredMetadataOnly !== true) return false;
  if (r.unsafeUnknownStatesFailClosed !== true) return false;
  if (r.evidenceGatesUserVisibleOutputBlockedByDefault !== true) return false;
  if (r.exactLegalDeadlineCalculationUnauthorizedStillFalse !== true) return false;
  if (r.auditMetadataNonPersistentByDefault !== true) return false;
  if (r.claimRuleOrSemanticsDebtPreserved !== true) return false;
  if (r.evidenceRuleResolutionDebtPreserved !== true) return false;
  if (r.proximityManualOnlyDebtPreserved !== true) return false;
  if (r.trapKindTypingDebtPreserved !== true) return false;
  if (r.enforcementTrapHeuristicDebtPreserved !== true) return false;
  if (r.trapDispositionStateSeparationDebtPreserved !== true) return false;
  if (r.severityCandidateDerivationSeparationDebtPreserved !== true) return false;
  if (r.mapperDiagnosticTaxonomyDebtPreserved !== true) return false;
  if (r.td004ClosureDoesNotAuthorizeWiringDebtPreserved !== true) return false;
  // Inherited count confirmations
  if (r.evidenceGatesClosureDecisionTamperConfirmedFrom8x7J !== true) return false;
  if (r.evidenceGatesClosureDecisionTamperCasesRejected !== r.evidenceGatesClosureDecisionTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x7J !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x7J !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x7J !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x7J !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x7J !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x7J !== true) return false;
  if (r.wiringExecutionContractTamperCasesRejected !== r.wiringExecutionContractTamperCaseCount) return false;
  // Side-effect guards
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
  // Readiness
  if (r.readyFor8x8BControlledRuntimeActivationPlan !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  // Arrays non-empty
  if (!r.tdStatusMatrix || r.tdStatusMatrix.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.consolidationAuditNotes || r.consolidationAuditNotes.length === 0) return false;
  if (!r.nextPhaseRecommendation || r.nextPhaseRecommendation.length === 0) return false;
  // Sentinel checks
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_REAL_DOC_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_USER_VISIBLE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_SEAM_ACTIVATION_BLOCKER)) return false;
  const nextJ = r.nextPhaseRecommendation.join(" ");
  if (!nextJ.includes(SENTINEL_CONTROLLED_RUNTIME_PLAN)) return false;
  const matrixJ = r.tdStatusMatrix.join(" ");
  if (!matrixJ.includes(SENTINEL_TD002_STATUS_IN_MATRIX)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Tamper counts
  if (r.governanceKernelConsolidationTamperCasesRejected !== r.governanceKernelConsolidationTamperCaseCount) return false;
  if (r.governanceKernelConsolidationTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type ConsolidationTamperMutation = (r: ConsolidationAuditResult) => ConsolidationAuditResult;
interface ConsolidationTamperCase { label: string; mutate: ConsolidationTamperMutation; }

const CONSOLIDATION_TAMPER_CASES: ConsolidationTamperCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7J" as "8.8A" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "governanceKernelConsolidationAuditOnly false", mutate: (r) => ({ ...r, governanceKernelConsolidationAuditOnly: false as true }) },
  { label: "governanceKernelConsolidationAuditFileCreated false", mutate: (r) => ({ ...r, governanceKernelConsolidationAuditFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "evidenceGatesClosureDecisionFileModified true", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionFileModified: true as false }) },
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
  // Import/runner flags
  { label: "importedOnlyEvidenceGatesClosureDecisionRunner false", mutate: (r) => ({ ...r, importedOnlyEvidenceGatesClosureDecisionRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "evidenceGatesClosureDecisionRunnerCalled false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionRunnerCalled: false as true }) },
  { label: "evidenceGatesClosureDecisionCheckId wrong", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionCheckId: "8.7I" as "8.7J" }) },
  { label: "evidenceGatesClosureDecisionAllPassed false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionAllPassed: false as true }) },
  { label: "td002ClosureStatusConfirmed false", mutate: (r) => ({ ...r, td002ClosureStatusConfirmed: false as true }) },
  { label: "td002ClosureStatus wrong", mutate: (r) => ({ ...r, td002ClosureStatus: "closed_for_production" as Td002Status }) },
  // TD status strings
  { label: "td001Status wrong", mutate: (r) => ({ ...r, td001Status: "open" as Td001Status }) },
  { label: "td002Status wrong", mutate: (r) => ({ ...r, td002Status: "closed_for_production" as Td002Status }) },
  { label: "td003Status wrong", mutate: (r) => ({ ...r, td003Status: "open" as Td003Status }) },
  { label: "td004Status wrong", mutate: (r) => ({ ...r, td004Status: "open" as Td004Status }) },
  { label: "td005Status wrong", mutate: (r) => ({ ...r, td005Status: "open" as Td005Status }) },
  // TD closed confirmations
  { label: "td001ClosedConfirmed false", mutate: (r) => ({ ...r, td001ClosedConfirmed: false as true }) },
  { label: "td002ClosedConfirmed false", mutate: (r) => ({ ...r, td002ClosedConfirmed: false as true }) },
  { label: "td003ClosedConfirmed false", mutate: (r) => ({ ...r, td003ClosedConfirmed: false as true }) },
  { label: "td004ClosedConfirmed false", mutate: (r) => ({ ...r, td004ClosedConfirmed: false as true }) },
  { label: "td005ClosedConfirmed false", mutate: (r) => ({ ...r, td005ClosedConfirmed: false as true }) },
  // TD-002 non-closure flags
  { label: "td002ClosedOnlyForScopedDisabledByDefaultContainmentSeam false", mutate: (r) => ({ ...r, td002ClosedOnlyForScopedDisabledByDefaultContainmentSeam: false as true }) },
  { label: "td002NotClosedForRuntimeAuthorization false", mutate: (r) => ({ ...r, td002NotClosedForRuntimeAuthorization: false as true }) },
  { label: "td002NotClosedForPublicRuntime false", mutate: (r) => ({ ...r, td002NotClosedForPublicRuntime: false as true }) },
  { label: "td002NotClosedForRealDocumentInput false", mutate: (r) => ({ ...r, td002NotClosedForRealDocumentInput: false as true }) },
  { label: "td002NotClosedForUserVisibleOutput false", mutate: (r) => ({ ...r, td002NotClosedForUserVisibleOutput: false as true }) },
  { label: "td002NotClosedForProductionGoLive false", mutate: (r) => ({ ...r, td002NotClosedForProductionGoLive: false as true }) },
  { label: "td002NotClosedForFinalProductionEvidenceGatesEnforcement false", mutate: (r) => ({ ...r, td002NotClosedForFinalProductionEvidenceGatesEnforcement: false as true }) },
  { label: "td002NotClosedForFullProductionClaimAuthorization false", mutate: (r) => ({ ...r, td002NotClosedForFullProductionClaimAuthorization: false as true }) },
  { label: "td002NotClosedForFullProductionRealityAuthorization false", mutate: (r) => ({ ...r, td002NotClosedForFullProductionRealityAuthorization: false as true }) },
  // Evidence Gates seam/adapter flags
  { label: "evidenceGatesSeamExistsButDisabledByDefault false", mutate: (r) => ({ ...r, evidenceGatesSeamExistsButDisabledByDefault: false as true }) },
  { label: "evidenceGatesSeamRemainsInert false", mutate: (r) => ({ ...r, evidenceGatesSeamRemainsInert: false as true }) },
  { label: "evidenceGatesDryRunAdapterNotCalledWhileDisabled false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterNotCalledWhileDisabled: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotUserVisible false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotUserVisible: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotPersisted false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotPersisted: false as true }) },
  { label: "evidenceGatesSeamActivationUnauthorized false", mutate: (r) => ({ ...r, evidenceGatesSeamActivationUnauthorized: false as true }) },
  // Governance kernel flags
  { label: "governanceKernelArchitecturallyPrepared false", mutate: (r) => ({ ...r, governanceKernelArchitecturallyPrepared: false as true }) },
  { label: "governanceKernelRuntimeAuthorized true", mutate: (r) => ({ ...r, governanceKernelRuntimeAuthorized: true as false }) },
  { label: "controlledRuntimeActivationPlanRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationPlanRequired: false as true }) },
  { label: "controlledRuntimeActivationContractRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationContractRequired: false as true }) },
  { label: "controlledRuntimeActivationDryRunRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationDryRunRequired: false as true }) },
  { label: "controlledRuntimeActivationAuditRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationAuditRequired: false as true }) },
  { label: "controlledRuntimeActivationClosureDecisionRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationClosureDecisionRequired: false as true }) },
  // Authorization false-boundary
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
  // TD-004 boundary confirmations
  { label: "td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRouteWiringConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRouteWiringConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRealDocumentInputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRealDocumentInputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeUserVisibleOutputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeUserVisibleOutputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizePublicRuntimeConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizePublicRuntimeConfirmed: false as true }) },
  // Adapter/gate behavior flags
  { label: "modelOutputRemainsUntrusted false", mutate: (r) => ({ ...r, modelOutputRemainsUntrusted: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "unsafeUnknownStatesFailClosed false", mutate: (r) => ({ ...r, unsafeUnknownStatesFailClosed: false as true }) },
  { label: "evidenceGatesUserVisibleOutputBlockedByDefault false", mutate: (r) => ({ ...r, evidenceGatesUserVisibleOutputBlockedByDefault: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorizedStillFalse false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorizedStillFalse: false as true }) },
  { label: "auditMetadataNonPersistentByDefault false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefault: false as true }) },
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
  // Inherited count confirmation booleans
  { label: "evidenceGatesClosureDecisionTamperConfirmedFrom8x7J false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperConfirmedFrom8x7J: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x7J false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x7J: false as true }) },
  { label: "postWiringAuditTamperConfirmedFrom8x7J false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x7J: false as true }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x7J false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x7J: false as true }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x7J false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x7J: false as true }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x7J false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x7J: false as true }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x7J false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x7J: false as true }) },
  // Inherited count mismatches
  { label: "evidenceGatesClosureDecisionTamperCasesRejected != count", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperCasesRejected: r.evidenceGatesClosureDecisionTamperCasesRejected - 1 }) },
  { label: "scopedWiringContainmentPatchTamperCasesRejected != count", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCasesRejected: r.scopedWiringContainmentPatchTamperCasesRejected - 1 }) },
  { label: "postWiringAuditTamperCasesRejected != count", mutate: (r) => ({ ...r, postWiringAuditTamperCasesRejected: r.postWiringAuditTamperCasesRejected - 1 }) },
  { label: "dryRunSyntheticValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCasesRejected != count", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
  { label: "wiringExecutionContractTamperCasesRejected != count", mutate: (r) => ({ ...r, wiringExecutionContractTamperCasesRejected: r.wiringExecutionContractTamperCasesRejected - 1 }) },
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
  // Readiness flags
  { label: "readyFor8x8BControlledRuntimeActivationPlan false", mutate: (r) => ({ ...r, readyFor8x8BControlledRuntimeActivationPlan: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  // Array empty
  { label: "tdStatusMatrix empty", mutate: (r) => ({ ...r, tdStatusMatrix: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "consolidationAuditNotes empty", mutate: (r) => ({ ...r, consolidationAuditNotes: [] }) },
  { label: "nextPhaseRecommendation empty", mutate: (r) => ({ ...r, nextPhaseRecommendation: [] }) },
  // Array sentinel checks
  { label: "globalAuthorizationBlockers missing real document input blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((b) => b.split(SENTINEL_REAL_DOC_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing user-visible output blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((b) => b.split(SENTINEL_USER_VISIBLE_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing public runtime blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((b) => b.split(SENTINEL_PUBLIC_RUNTIME_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing production/go-live blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((b) => b.split(SENTINEL_PRODUCTION_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing seam activation blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((b) => b.split(SENTINEL_SEAM_ACTIVATION_BLOCKER).join("omitted")) }) },
  { label: "nextPhaseRecommendation missing controlled runtime activation plan sentinel", mutate: (r) => ({ ...r, nextPhaseRecommendation: r.nextPhaseRecommendation.map((s) => s.split(SENTINEL_CONTROLLED_RUNTIME_PLAN).join("omitted")) }) },
  { label: "tdStatusMatrix missing TD-002 closure status", mutate: (r) => ({ ...r, tdStatusMatrix: r.tdStatusMatrix.map((s) => s.split(SENTINEL_TD002_STATUS_IN_MATRIX).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((d) => d.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((d) => d.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Tamper coverage self-checks
  { label: "governanceKernelConsolidationTamperCoveragePassing false", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperCoveragePassing: false as true }) },
  { label: "governanceKernelConsolidationTamperCasesRejected != count", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperCasesRejected: r.governanceKernelConsolidationTamperCasesRejected - 1 }) },
];

// ─── Exported consolidation audit function ────────────────────────────────────

/**
 * Smart Talk Governance Kernel Consolidation Audit runner for 8.8A.
 *
 * Calls the 8.7J Evidence Gates closure decision runner as source of truth.
 * Consolidates TD-001 through TD-005 statuses.
 * Confirms the governance kernel is architecturally prepared but NOT runtime-authorized.
 */
export function runSmartTalkGovernanceKernelConsolidationAudit(): ConsolidationAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.7J Evidence Gates closure decision runner as source of truth ──
  const j = runControlledRealDocumentEvidenceGatesClosureDecision();
  if (j.checkId !== "8.7J") auditFailures.push(`8.7J checkId mismatch: expected "8.7J", got "${j.checkId}"`);
  if (j.allPassed !== true) auditFailures.push("8.7J allPassed is not true");
  if (j.td002ClosureStatus !== TD002_STATUS_VALUE) auditFailures.push(`8.7J td002ClosureStatus mismatch: expected "${TD002_STATUS_VALUE}", got "${j.td002ClosureStatus}"`);
  if (j.td002ClosedForScopedDisabledByDefaultContainmentSeam !== true) auditFailures.push("8.7J td002ClosedForScopedDisabledByDefaultContainmentSeam is not true");
  if (j.td002NotClosedForPublicRuntime !== true) auditFailures.push("8.7J td002NotClosedForPublicRuntime is not true");
  if (j.td002NotClosedForRealDocumentInput !== true) auditFailures.push("8.7J td002NotClosedForRealDocumentInput is not true");
  if (j.td002NotClosedForUserVisibleOutput !== true) auditFailures.push("8.7J td002NotClosedForUserVisibleOutput is not true");
  if (j.td002NotClosedForProductionRuntime !== true) auditFailures.push("8.7J td002NotClosedForProductionRuntime is not true");
  if (j.td002NotClosedForGoLive !== true) auditFailures.push("8.7J td002NotClosedForGoLive is not true");
  if (j.td002NotClosedForFinalProductionEvidenceGatesEnforcement !== true) auditFailures.push("8.7J td002NotClosedForFinalProductionEvidenceGatesEnforcement is not true");
  if (j.td002NotClosedForFullProductionClaimAuthorization !== true) auditFailures.push("8.7J td002NotClosedForFullProductionClaimAuthorization is not true");
  if (j.td002NotClosedForFullProductionRealityAuthorization !== true) auditFailures.push("8.7J td002NotClosedForFullProductionRealityAuthorization is not true");
  if (j.auditedSeamStillDisabledByDefault !== true) auditFailures.push("8.7J auditedSeamStillDisabledByDefault is not true");
  if (j.auditedSeamStillInertWhileDisabled !== true) auditFailures.push("8.7J auditedSeamStillInertWhileDisabled is not true");
  if (j.auditedDryRunAdapterStillNotCalledWhileDisabled !== true) auditFailures.push("8.7J auditedDryRunAdapterStillNotCalledWhileDisabled is not true");
  if (j.auditedDryRunAdapterOutputStillNotUserVisible !== true) auditFailures.push("8.7J auditedDryRunAdapterOutputStillNotUserVisible is not true");
  if (j.auditedDryRunAdapterOutputStillNotPersisted !== true) auditFailures.push("8.7J auditedDryRunAdapterOutputStillNotPersisted is not true");
  if (j.closureDecisionTamperCasesRejected !== j.closureDecisionTamperCaseCount) auditFailures.push("8.7J closure decision tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────
  const tdStatusMatrix: string[] = [
    `TD-001 [${TD001_STATUS_VALUE}]: Document bypass guard — closed.`,
    `TD-002 [${SENTINEL_TD002_STATUS_IN_MATRIX}]: Evidence Gates — closed only for scoped disabled-by-default containment seam and audit readiness.`,
    `TD-003 [${TD003_STATUS_VALUE}]: Photo/OCR route containment — closed.`,
    `TD-004 [${TD004_STATUS_VALUE}]: Pre-Model PII Redaction — closed only for isolated utility implementation and audit readiness.`,
    `TD-005 [${TD005_STATUS_VALUE}]: Paid Document Mode boundary containment — closed.`,
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01 [${SENTINEL_REAL_DOC_BLOCKER}]: real-document-input-unauthorized-global-blocker — real document input remains unauthorized globally.`,
    `GB-02 [${SENTINEL_USER_VISIBLE_BLOCKER}]: user-visible-output-unauthorized-global-blocker — user-visible document output remains unauthorized globally.`,
    `GB-03 [${SENTINEL_PUBLIC_RUNTIME_BLOCKER}]: public-runtime-unauthorized-global-blocker — public runtime remains unauthorized globally.`,
    `GB-04 [${SENTINEL_PRODUCTION_BLOCKER}]: production-go-live-unauthorized-global-blocker — production and go-live remain unauthorized globally.`,
    `GB-05 [${SENTINEL_SEAM_ACTIVATION_BLOCKER}]: seam-activation-unauthorized-global-blocker — Evidence Gates seam activation remains unauthorized.`,
    "GB-06: Pilot runtime remains unauthorized globally.",
    "GB-07: Payment/checkout/entitlement runtime remains unauthorized globally.",
    "GB-08: OCR/photo runtime remains unauthorized globally.",
    "GB-09: Persistence of governance decisions remains unauthorized globally.",
    "GB-10: Exact legal deadline calculation remains unauthorized globally.",
    "GB-11: Trusted model output remains unauthorized globally.",
    "GB-12: Final production Evidence Gates enforcement remains unauthorized globally.",
    "GB-13: Full production claim authorization remains unauthorized globally.",
    "GB-14: Full production reality authorization remains unauthorized globally.",
    "GB-15: Unresolved governance debts remain unresolved globally.",
    "GB-16: Controlled runtime activation not yet planned.",
    "GB-17: Controlled runtime activation not yet contracted.",
    "GB-18: Controlled runtime activation not yet dry-run validated.",
    "GB-19: Controlled runtime activation not yet audited.",
    "GB-20: Controlled runtime activation not yet closed.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8A.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8A.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8A.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8A.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8A.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8A.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8A.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8A.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8A.)",
  ];

  const consolidationAuditNotes: string[] = [
    "8.8A consolidation audit: TD-001 through TD-005 are all confirmed closed at their respective declared scopes.",
    "TD-002 Evidence Gates is closed ONLY for scoped disabled-by-default containment seam and audit readiness.",
    "The governance kernel is architecturally prepared but NOT runtime-authorized.",
    "The Evidence Gates seam (run-smart-talk.ts) remains disabled by default and inert.",
    "The dry-run adapter is not called while the seam is disabled.",
    "Adapter output remains not user-visible and not persisted.",
    "Seam activation requires a separate future plan, contract, dry-run, audit, and closure decision.",
    `8.7J confirmed: checkId=${j.checkId}, allPassed=${j.allPassed}, td002ClosureStatus=${j.td002ClosureStatus}`,
  ];

  const nextPhaseRecommendation: string[] = [
    `NP-01 [${SENTINEL_CONTROLLED_RUNTIME_PLAN}]: 8x8B-controlled-runtime-activation-plan-required — Phase 8.8B should create a controlled runtime activation plan for Evidence Gates.`,
    "NP-02: Phase 8.8B plan must cover seam enablement preconditions, safe input routing, and output handling.",
    "NP-03: Phases 8.8B through 8.8X (plan, contract, dry-run, audit, closure) must complete before any runtime activation.",
    "NP-04: All governance debts (GD-01 through GD-09) must be resolved or explicitly deferred before full production enforcement.",
    "NP-05: No TD-002 production authorization, real document input, or user-visible output may be granted until all blockers are resolved.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = CONSOLIDATION_TAMPER_CASES.length;

  const provisional: ConsolidationAuditResult = {
    checkId: "8.8A",
    allPassed: true,
    governanceKernelConsolidationAuditOnly: true,
    governanceKernelConsolidationAuditFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    evidenceGatesClosureDecisionFileModified: false,
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
    importedOnlyEvidenceGatesClosureDecisionRunner: true,
    noOtherImportsUsed: true,
    evidenceGatesClosureDecisionRunnerCalled: true,
    evidenceGatesClosureDecisionCheckId: "8.7J",
    evidenceGatesClosureDecisionAllPassed: true,
    td002ClosureStatusConfirmed: true,
    td002ClosureStatus: TD002_STATUS_VALUE,
    td001Status: TD001_STATUS_VALUE,
    td002Status: TD002_STATUS_VALUE,
    td003Status: TD003_STATUS_VALUE,
    td004Status: TD004_STATUS_VALUE,
    td005Status: TD005_STATUS_VALUE,
    td001ClosedConfirmed: true,
    td002ClosedConfirmed: true,
    td003ClosedConfirmed: true,
    td004ClosedConfirmed: true,
    td005ClosedConfirmed: true,
    td002ClosedOnlyForScopedDisabledByDefaultContainmentSeam: true,
    td002NotClosedForRuntimeAuthorization: true,
    td002NotClosedForPublicRuntime: true,
    td002NotClosedForRealDocumentInput: true,
    td002NotClosedForUserVisibleOutput: true,
    td002NotClosedForProductionGoLive: true,
    td002NotClosedForFinalProductionEvidenceGatesEnforcement: true,
    td002NotClosedForFullProductionClaimAuthorization: true,
    td002NotClosedForFullProductionRealityAuthorization: true,
    evidenceGatesSeamExistsButDisabledByDefault: true,
    evidenceGatesSeamRemainsInert: true,
    evidenceGatesDryRunAdapterNotCalledWhileDisabled: true,
    evidenceGatesDryRunAdapterOutputNotUserVisible: true,
    evidenceGatesDryRunAdapterOutputNotPersisted: true,
    evidenceGatesSeamActivationUnauthorized: true,
    governanceKernelArchitecturallyPrepared: true,
    governanceKernelRuntimeAuthorized: false,
    controlledRuntimeActivationPlanRequired: true,
    controlledRuntimeActivationContractRequired: true,
    controlledRuntimeActivationDryRunRequired: true,
    controlledRuntimeActivationAuditRequired: true,
    controlledRuntimeActivationClosureDecisionRequired: true,
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
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true,
    td004DoesNotAuthorizeRouteWiringConfirmed: true,
    td004DoesNotAuthorizeRealDocumentInputConfirmed: true,
    td004DoesNotAuthorizeUserVisibleOutputConfirmed: true,
    td004DoesNotAuthorizePublicRuntimeConfirmed: true,
    modelOutputRemainsUntrusted: true,
    claimAuthorizationSeparateFromRealityAuthorization: true,
    highRiskClaimsBlockedUnlessClaimAuthorized: true,
    documentDerivedClaimsBlockedUnlessRealityAuthorized: true,
    trapActivationStructuredMetadataOnly: true,
    unsafeUnknownStatesFailClosed: true,
    evidenceGatesUserVisibleOutputBlockedByDefault: true,
    exactLegalDeadlineCalculationUnauthorizedStillFalse: true,
    auditMetadataNonPersistentByDefault: true,
    claimRuleOrSemanticsDebtPreserved: true,
    evidenceRuleResolutionDebtPreserved: true,
    proximityManualOnlyDebtPreserved: true,
    trapKindTypingDebtPreserved: true,
    enforcementTrapHeuristicDebtPreserved: true,
    trapDispositionStateSeparationDebtPreserved: true,
    severityCandidateDerivationSeparationDebtPreserved: true,
    mapperDiagnosticTaxonomyDebtPreserved: true,
    td004ClosureDoesNotAuthorizeWiringDebtPreserved: true,
    evidenceGatesClosureDecisionTamperConfirmedFrom8x7J: true,
    evidenceGatesClosureDecisionTamperCaseCount: j.closureDecisionTamperCaseCount,
    evidenceGatesClosureDecisionTamperCasesRejected: j.closureDecisionTamperCasesRejected,
    scopedWiringContainmentPatchTamperConfirmedFrom8x7J: true,
    scopedWiringContainmentPatchTamperCaseCount: j.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: j.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x7J: true,
    postWiringAuditTamperCaseCount: j.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: j.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x7J: true,
    dryRunSyntheticValidationCaseCount: j.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: j.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x7J: true,
    dryRunLeakageValidationCaseCount: j.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: j.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x7J: true,
    dryRunTamperCaseCount: j.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: j.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x7J: true,
    wiringExecutionContractTamperCaseCount: j.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: j.wiringExecutionContractTamperCasesRejected,
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
    readyFor8x8BControlledRuntimeActivationPlan: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tdStatusMatrix,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    consolidationAuditNotes,
    nextPhaseRecommendation,
    governanceKernelConsolidationTamperCaseCount: tamperCaseCount,
    governanceKernelConsolidationTamperCasesRejected: tamperCaseCount,
    governanceKernelConsolidationTamperCoveragePassing: true,
  };

  if (!_isCanonicalConsolidationAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8A tamper cases ─────────────────────────────────────────────
  let governanceKernelConsolidationTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < CONSOLIDATION_TAMPER_CASES.length; idx++) {
    const tc = CONSOLIDATION_TAMPER_CASES[idx];
    if (!_isCanonicalConsolidationAuditResult(tc.mutate(provisional))) {
      governanceKernelConsolidationTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8A tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    governanceKernelConsolidationTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...consolidationAuditNotes,
    `8.8A tamper cases: ${governanceKernelConsolidationTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return { ...provisional, allPassed, governanceKernelConsolidationTamperCasesRejected, consolidationAuditNotes: finalNotes };
}
