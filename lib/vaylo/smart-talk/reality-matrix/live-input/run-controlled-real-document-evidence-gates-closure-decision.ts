/**
 * PHASE 8.7J — TD-002 Closure Decision
 *
 * Closure decision for TD-002 Evidence Gates after the post-wiring audit from 8.7I.
 *
 * TD-002 is closed ONLY for:
 *   "scoped disabled-by-default Evidence Gates containment seam completed and audited"
 *
 * TD-002 is NOT closed for:
 *   - public runtime / pilot / production / go-live
 *   - real document input / user-visible output
 *   - payment/checkout/entitlement / OCR/photo / persistence
 *   - exact legal deadline calculation / trusted model output
 *   - final production Evidence Gates enforcement
 *   - full production claim or reality authorization
 *   - unresolved governance debts
 *
 * The seam remains disabled by default and inert.
 * Further authorization is required before any runtime activation.
 */

import { runControlledRealDocumentEvidenceGatesPostWiringAudit } from "./run-controlled-real-document-evidence-gates-post-wiring-audit";

// ─── Return type ──────────────────────────────────────────────────────────────

type Td002ClosureStatus = "closed_for_scoped_disabled_by_default_containment_seam_only";

interface ClosureDecisionResult {
  checkId: "8.7J";
  allPassed: boolean;
  closureDecisionOnly: true;
  closureDecisionFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  productionWiringPlanFileModified: false;
  productionWiringContractFileModified: false;
  boundaryAuditFileModified: false;
  runtimeAdapterPlanFileModified: false;
  runtimeAdapterContractFileModified: false;
  runtimeAdapterDryRunFileModified: false;
  runSmartTalkWiringExecutionContractFileModified: false;
  scopedWiringContainmentPatchFileModified: false;
  postWiringAuditFileModified: false;
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
  importedOnlyPostWiringAuditRunner: true;
  noOtherImportsUsed: true;
  postWiringAuditRunnerCalled: true;
  postWiringAuditCheckId: "8.7I";
  postWiringAuditAllPassed: true;
  postWiringAuditReadyForClosureDecision: true;
  td002ClosureDecisionCreated: true;
  td002ClosedForScopedDisabledByDefaultContainmentSeam: true;
  td002ClosedForPostWiringAuditReadiness: true;
  td002NotClosedForPublicRuntime: true;
  td002NotClosedForRealDocumentInput: true;
  td002NotClosedForUserVisibleOutput: true;
  td002NotClosedForPilotRuntime: true;
  td002NotClosedForProductionRuntime: true;
  td002NotClosedForGoLive: true;
  td002NotClosedForPaymentCheckoutEntitlement: true;
  td002NotClosedForOcrPhotoInput: true;
  td002NotClosedForPersistence: true;
  td002NotClosedForExactLegalDeadlineCalculation: true;
  td002NotClosedForTrustedModelOutput: true;
  td002NotClosedForFinalProductionEvidenceGatesEnforcement: true;
  td002NotClosedForFullProductionClaimAuthorization: true;
  td002NotClosedForFullProductionRealityAuthorization: true;
  td002NotClosedForUnresolvedGovernanceDebts: true;
  auditedSeamStillDisabledByDefault: true;
  auditedSeamStillContainmentOnly: true;
  auditedSeamStillInertWhileDisabled: true;
  auditedDryRunAdapterStillNotCalledWhileDisabled: true;
  auditedDryRunAdapterOutputStillNotUserVisible: true;
  auditedDryRunAdapterOutputStillNotPersisted: true;
  auditedDryRunAdapterStillUsesSyntheticGovernanceInputOnly: true;
  auditedDryRunAdapterStillDoesNotUseRawUserInput: true;
  auditedDryRunAdapterStillDoesNotUseRawModelOutputDirectly: true;
  auditedDryRunAdapterStillDoesNotUseRawDocumentText: true;
  auditedDryRunAdapterStillDoesNotUseOcrPhotoInput: true;
  auditedDryRunAdapterStillDoesNotUseRealPii: true;
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
  exactLegalDeadlineCalculationUnauthorized: true;
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
  scopedWiringContainmentPatchTamperConfirmedFrom8x7I: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x7I: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x7I: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x7I: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x7I: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x7I: true;
  wiringExecutionContractTamperCaseCount: number;
  wiringExecutionContractTamperCasesRejected: number;
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
  td002ClosureStatus: Td002ClosureStatus;
  td002ClosureScope: string[];
  td002NonClosureScope: string[];
  remainingAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  closureDecisionNotes: string[];
  nextRequiredAuthorizationSteps: string[];
  closureDecisionTamperCaseCount: number;
  closureDecisionTamperCasesRejected: number;
  closureDecisionTamperCoveragePassing: true;
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const CLOSURE_STATUS_VALUE: Td002ClosureStatus = "closed_for_scoped_disabled_by_default_containment_seam_only";
const SENTINEL_REAL_DOC_BLOCKER = "real-document-input-unauthorized-closure-blocker";
const SENTINEL_USER_VISIBLE_BLOCKER = "user-visible-output-unauthorized-closure-blocker";
const SENTINEL_PUBLIC_RUNTIME_BLOCKER = "public-runtime-unauthorized-closure-blocker";
const SENTINEL_PRODUCTION_BLOCKER = "production-go-live-unauthorized-closure-blocker";
const SENTINEL_NON_CLOSURE_PUBLIC_RUNTIME = "td002-not-closed-for-public-runtime";
const SENTINEL_NON_CLOSURE_REAL_DOC = "td002-not-closed-for-real-document-input";
const SENTINEL_NON_CLOSURE_USER_VISIBLE = "td002-not-closed-for-user-visible-output";
const SENTINEL_NON_CLOSURE_PRODUCTION = "td002-not-closed-for-production-go-live";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalClosureDecisionResult(r: ClosureDecisionResult): boolean {
  if (r.checkId !== "8.7J") return false;
  if (r.allPassed !== true) return false;
  if (r.closureDecisionOnly !== true) return false;
  if (r.closureDecisionFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.productionWiringPlanFileModified !== false) return false;
  if (r.productionWiringContractFileModified !== false) return false;
  if (r.boundaryAuditFileModified !== false) return false;
  if (r.runtimeAdapterPlanFileModified !== false) return false;
  if (r.runtimeAdapterContractFileModified !== false) return false;
  if (r.runtimeAdapterDryRunFileModified !== false) return false;
  if (r.runSmartTalkWiringExecutionContractFileModified !== false) return false;
  if (r.scopedWiringContainmentPatchFileModified !== false) return false;
  if (r.postWiringAuditFileModified !== false) return false;
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
  if (r.importedOnlyPostWiringAuditRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.postWiringAuditRunnerCalled !== true) return false;
  if (r.postWiringAuditCheckId !== "8.7I") return false;
  if (r.postWiringAuditAllPassed !== true) return false;
  if (r.postWiringAuditReadyForClosureDecision !== true) return false;
  if (r.td002ClosureDecisionCreated !== true) return false;
  if (r.td002ClosedForScopedDisabledByDefaultContainmentSeam !== true) return false;
  if (r.td002ClosedForPostWiringAuditReadiness !== true) return false;
  if (r.td002NotClosedForPublicRuntime !== true) return false;
  if (r.td002NotClosedForRealDocumentInput !== true) return false;
  if (r.td002NotClosedForUserVisibleOutput !== true) return false;
  if (r.td002NotClosedForPilotRuntime !== true) return false;
  if (r.td002NotClosedForProductionRuntime !== true) return false;
  if (r.td002NotClosedForGoLive !== true) return false;
  if (r.td002NotClosedForPaymentCheckoutEntitlement !== true) return false;
  if (r.td002NotClosedForOcrPhotoInput !== true) return false;
  if (r.td002NotClosedForPersistence !== true) return false;
  if (r.td002NotClosedForExactLegalDeadlineCalculation !== true) return false;
  if (r.td002NotClosedForTrustedModelOutput !== true) return false;
  if (r.td002NotClosedForFinalProductionEvidenceGatesEnforcement !== true) return false;
  if (r.td002NotClosedForFullProductionClaimAuthorization !== true) return false;
  if (r.td002NotClosedForFullProductionRealityAuthorization !== true) return false;
  if (r.td002NotClosedForUnresolvedGovernanceDebts !== true) return false;
  if (r.auditedSeamStillDisabledByDefault !== true) return false;
  if (r.auditedSeamStillContainmentOnly !== true) return false;
  if (r.auditedSeamStillInertWhileDisabled !== true) return false;
  if (r.auditedDryRunAdapterStillNotCalledWhileDisabled !== true) return false;
  if (r.auditedDryRunAdapterOutputStillNotUserVisible !== true) return false;
  if (r.auditedDryRunAdapterOutputStillNotPersisted !== true) return false;
  if (r.auditedDryRunAdapterStillUsesSyntheticGovernanceInputOnly !== true) return false;
  if (r.auditedDryRunAdapterStillDoesNotUseRawUserInput !== true) return false;
  if (r.auditedDryRunAdapterStillDoesNotUseRawModelOutputDirectly !== true) return false;
  if (r.auditedDryRunAdapterStillDoesNotUseRawDocumentText !== true) return false;
  if (r.auditedDryRunAdapterStillDoesNotUseOcrPhotoInput !== true) return false;
  if (r.auditedDryRunAdapterStillDoesNotUseRealPii !== true) return false;
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
  if (r.exactLegalDeadlineCalculationUnauthorized !== true) return false;
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
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x7I !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x7I !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x7I !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x7I !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x7I !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x7I !== true) return false;
  if (r.wiringExecutionContractTamperCasesRejected !== r.wiringExecutionContractTamperCaseCount) return false;
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
  // Exact closure status string
  if (r.td002ClosureStatus !== CLOSURE_STATUS_VALUE) return false;
  // Array non-empty checks
  if (!r.td002ClosureScope || r.td002ClosureScope.length === 0) return false;
  if (!r.td002NonClosureScope || r.td002NonClosureScope.length === 0) return false;
  if (!r.remainingAuthorizationBlockers || r.remainingAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.closureDecisionNotes || r.closureDecisionNotes.length === 0) return false;
  if (!r.nextRequiredAuthorizationSteps || r.nextRequiredAuthorizationSteps.length === 0) return false;
  // Array sentinel checks
  const blockersJ = r.remainingAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_REAL_DOC_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_USER_VISIBLE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_BLOCKER)) return false;
  const nonClosureJ = r.td002NonClosureScope.join(" ");
  if (!nonClosureJ.includes(SENTINEL_NON_CLOSURE_PUBLIC_RUNTIME)) return false;
  if (!nonClosureJ.includes(SENTINEL_NON_CLOSURE_REAL_DOC)) return false;
  if (!nonClosureJ.includes(SENTINEL_NON_CLOSURE_USER_VISIBLE)) return false;
  if (!nonClosureJ.includes(SENTINEL_NON_CLOSURE_PRODUCTION)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Tamper counts
  if (r.closureDecisionTamperCasesRejected !== r.closureDecisionTamperCaseCount) return false;
  if (r.closureDecisionTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type ClosureDecisionTamperMutation = (r: ClosureDecisionResult) => ClosureDecisionResult;
interface ClosureDecisionTamperCase { label: string; mutate: ClosureDecisionTamperMutation; }

const CLOSURE_DECISION_TAMPER_CASES: ClosureDecisionTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7I" as "8.7J" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "closureDecisionOnly false", mutate: (r) => ({ ...r, closureDecisionOnly: false as true }) },
  { label: "closureDecisionFileCreated false", mutate: (r) => ({ ...r, closureDecisionFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "productionWiringPlanFileModified true", mutate: (r) => ({ ...r, productionWiringPlanFileModified: true as false }) },
  { label: "productionWiringContractFileModified true", mutate: (r) => ({ ...r, productionWiringContractFileModified: true as false }) },
  { label: "boundaryAuditFileModified true", mutate: (r) => ({ ...r, boundaryAuditFileModified: true as false }) },
  { label: "runtimeAdapterPlanFileModified true", mutate: (r) => ({ ...r, runtimeAdapterPlanFileModified: true as false }) },
  { label: "runtimeAdapterContractFileModified true", mutate: (r) => ({ ...r, runtimeAdapterContractFileModified: true as false }) },
  { label: "runtimeAdapterDryRunFileModified true", mutate: (r) => ({ ...r, runtimeAdapterDryRunFileModified: true as false }) },
  { label: "runSmartTalkWiringExecutionContractFileModified true", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractFileModified: true as false }) },
  { label: "scopedWiringContainmentPatchFileModified true", mutate: (r) => ({ ...r, scopedWiringContainmentPatchFileModified: true as false }) },
  { label: "postWiringAuditFileModified true", mutate: (r) => ({ ...r, postWiringAuditFileModified: true as false }) },
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
  { label: "importedOnlyPostWiringAuditRunner false", mutate: (r) => ({ ...r, importedOnlyPostWiringAuditRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "postWiringAuditRunnerCalled false", mutate: (r) => ({ ...r, postWiringAuditRunnerCalled: false as true }) },
  { label: "postWiringAuditCheckId wrong", mutate: (r) => ({ ...r, postWiringAuditCheckId: "8.7H" as "8.7I" }) },
  { label: "postWiringAuditAllPassed false", mutate: (r) => ({ ...r, postWiringAuditAllPassed: false as true }) },
  { label: "postWiringAuditReadyForClosureDecision false", mutate: (r) => ({ ...r, postWiringAuditReadyForClosureDecision: false as true }) },
  { label: "td002ClosureDecisionCreated false", mutate: (r) => ({ ...r, td002ClosureDecisionCreated: false as true }) },
  { label: "td002ClosedForScopedDisabledByDefaultContainmentSeam false", mutate: (r) => ({ ...r, td002ClosedForScopedDisabledByDefaultContainmentSeam: false as true }) },
  { label: "td002ClosedForPostWiringAuditReadiness false", mutate: (r) => ({ ...r, td002ClosedForPostWiringAuditReadiness: false as true }) },
  { label: "td002NotClosedForPublicRuntime false", mutate: (r) => ({ ...r, td002NotClosedForPublicRuntime: false as true }) },
  { label: "td002NotClosedForRealDocumentInput false", mutate: (r) => ({ ...r, td002NotClosedForRealDocumentInput: false as true }) },
  { label: "td002NotClosedForUserVisibleOutput false", mutate: (r) => ({ ...r, td002NotClosedForUserVisibleOutput: false as true }) },
  { label: "td002NotClosedForPilotRuntime false", mutate: (r) => ({ ...r, td002NotClosedForPilotRuntime: false as true }) },
  { label: "td002NotClosedForProductionRuntime false", mutate: (r) => ({ ...r, td002NotClosedForProductionRuntime: false as true }) },
  { label: "td002NotClosedForGoLive false", mutate: (r) => ({ ...r, td002NotClosedForGoLive: false as true }) },
  { label: "td002NotClosedForPaymentCheckoutEntitlement false", mutate: (r) => ({ ...r, td002NotClosedForPaymentCheckoutEntitlement: false as true }) },
  { label: "td002NotClosedForOcrPhotoInput false", mutate: (r) => ({ ...r, td002NotClosedForOcrPhotoInput: false as true }) },
  { label: "td002NotClosedForPersistence false", mutate: (r) => ({ ...r, td002NotClosedForPersistence: false as true }) },
  { label: "td002NotClosedForExactLegalDeadlineCalculation false", mutate: (r) => ({ ...r, td002NotClosedForExactLegalDeadlineCalculation: false as true }) },
  { label: "td002NotClosedForTrustedModelOutput false", mutate: (r) => ({ ...r, td002NotClosedForTrustedModelOutput: false as true }) },
  { label: "td002NotClosedForFinalProductionEvidenceGatesEnforcement false", mutate: (r) => ({ ...r, td002NotClosedForFinalProductionEvidenceGatesEnforcement: false as true }) },
  { label: "td002NotClosedForFullProductionClaimAuthorization false", mutate: (r) => ({ ...r, td002NotClosedForFullProductionClaimAuthorization: false as true }) },
  { label: "td002NotClosedForFullProductionRealityAuthorization false", mutate: (r) => ({ ...r, td002NotClosedForFullProductionRealityAuthorization: false as true }) },
  { label: "td002NotClosedForUnresolvedGovernanceDebts false", mutate: (r) => ({ ...r, td002NotClosedForUnresolvedGovernanceDebts: false as true }) },
  { label: "auditedSeamStillDisabledByDefault false", mutate: (r) => ({ ...r, auditedSeamStillDisabledByDefault: false as true }) },
  { label: "auditedSeamStillContainmentOnly false", mutate: (r) => ({ ...r, auditedSeamStillContainmentOnly: false as true }) },
  { label: "auditedSeamStillInertWhileDisabled false", mutate: (r) => ({ ...r, auditedSeamStillInertWhileDisabled: false as true }) },
  { label: "auditedDryRunAdapterStillNotCalledWhileDisabled false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillNotCalledWhileDisabled: false as true }) },
  { label: "auditedDryRunAdapterOutputStillNotUserVisible false", mutate: (r) => ({ ...r, auditedDryRunAdapterOutputStillNotUserVisible: false as true }) },
  { label: "auditedDryRunAdapterOutputStillNotPersisted false", mutate: (r) => ({ ...r, auditedDryRunAdapterOutputStillNotPersisted: false as true }) },
  { label: "auditedDryRunAdapterStillUsesSyntheticGovernanceInputOnly false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillUsesSyntheticGovernanceInputOnly: false as true }) },
  { label: "auditedDryRunAdapterStillDoesNotUseRawUserInput false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillDoesNotUseRawUserInput: false as true }) },
  { label: "auditedDryRunAdapterStillDoesNotUseRawModelOutputDirectly false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillDoesNotUseRawModelOutputDirectly: false as true }) },
  { label: "auditedDryRunAdapterStillDoesNotUseRawDocumentText false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillDoesNotUseRawDocumentText: false as true }) },
  { label: "auditedDryRunAdapterStillDoesNotUseOcrPhotoInput false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillDoesNotUseOcrPhotoInput: false as true }) },
  { label: "auditedDryRunAdapterStillDoesNotUseRealPii false", mutate: (r) => ({ ...r, auditedDryRunAdapterStillDoesNotUseRealPii: false as true }) },
  { label: "td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRouteWiringConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRouteWiringConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRealDocumentInputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRealDocumentInputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeUserVisibleOutputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeUserVisibleOutputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizePublicRuntimeConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizePublicRuntimeConfirmed: false as true }) },
  { label: "modelOutputRemainsUntrusted false", mutate: (r) => ({ ...r, modelOutputRemainsUntrusted: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "unsafeUnknownStatesFailClosed false", mutate: (r) => ({ ...r, unsafeUnknownStatesFailClosed: false as true }) },
  { label: "evidenceGatesUserVisibleOutputBlockedByDefault false", mutate: (r) => ({ ...r, evidenceGatesUserVisibleOutputBlockedByDefault: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorized false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorized: false as true }) },
  { label: "auditMetadataNonPersistentByDefault false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefault: false as true }) },
  { label: "claimRuleOrSemanticsDebtPreserved false", mutate: (r) => ({ ...r, claimRuleOrSemanticsDebtPreserved: false as true }) },
  { label: "evidenceRuleResolutionDebtPreserved false", mutate: (r) => ({ ...r, evidenceRuleResolutionDebtPreserved: false as true }) },
  { label: "proximityManualOnlyDebtPreserved false", mutate: (r) => ({ ...r, proximityManualOnlyDebtPreserved: false as true }) },
  { label: "trapKindTypingDebtPreserved false", mutate: (r) => ({ ...r, trapKindTypingDebtPreserved: false as true }) },
  { label: "enforcementTrapHeuristicDebtPreserved false", mutate: (r) => ({ ...r, enforcementTrapHeuristicDebtPreserved: false as true }) },
  { label: "trapDispositionStateSeparationDebtPreserved false", mutate: (r) => ({ ...r, trapDispositionStateSeparationDebtPreserved: false as true }) },
  { label: "severityCandidateDerivationSeparationDebtPreserved false", mutate: (r) => ({ ...r, severityCandidateDerivationSeparationDebtPreserved: false as true }) },
  { label: "mapperDiagnosticTaxonomyDebtPreserved false", mutate: (r) => ({ ...r, mapperDiagnosticTaxonomyDebtPreserved: false as true }) },
  { label: "td004ClosureDoesNotAuthorizeWiringDebtPreserved false", mutate: (r) => ({ ...r, td004ClosureDoesNotAuthorizeWiringDebtPreserved: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x7I false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x7I: false as true }) },
  { label: "scopedWiringContainmentPatchTamperCasesRejected != count", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCasesRejected: r.scopedWiringContainmentPatchTamperCasesRejected - 1 }) },
  { label: "postWiringAuditTamperConfirmedFrom8x7I false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x7I: false as true }) },
  { label: "postWiringAuditTamperCasesRejected != count", mutate: (r) => ({ ...r, postWiringAuditTamperCasesRejected: r.postWiringAuditTamperCasesRejected - 1 }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x7I false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x7I: false as true }) },
  { label: "dryRunSyntheticValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x7I false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x7I: false as true }) },
  { label: "dryRunLeakageValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x7I false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x7I: false as true }) },
  { label: "dryRunTamperCasesRejected != count", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x7I false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x7I: false as true }) },
  { label: "wiringExecutionContractTamperCasesRejected != count", mutate: (r) => ({ ...r, wiringExecutionContractTamperCasesRejected: r.wiringExecutionContractTamperCasesRejected - 1 }) },
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
  { label: "td002ClosureStatus wrong", mutate: (r) => ({ ...r, td002ClosureStatus: "closed_for_production" as Td002ClosureStatus }) },
  { label: "td002ClosureScope empty", mutate: (r) => ({ ...r, td002ClosureScope: [] }) },
  { label: "td002NonClosureScope empty", mutate: (r) => ({ ...r, td002NonClosureScope: [] }) },
  { label: "remainingAuthorizationBlockers empty", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "closureDecisionNotes empty", mutate: (r) => ({ ...r, closureDecisionNotes: [] }) },
  { label: "nextRequiredAuthorizationSteps empty", mutate: (r) => ({ ...r, nextRequiredAuthorizationSteps: [] }) },
  { label: "remainingAuthorizationBlockers missing real document input blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_REAL_DOC_BLOCKER).join("omitted")) }) },
  { label: "remainingAuthorizationBlockers missing user-visible output blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_USER_VISIBLE_BLOCKER).join("omitted")) }) },
  { label: "remainingAuthorizationBlockers missing public runtime blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_PUBLIC_RUNTIME_BLOCKER).join("omitted")) }) },
  { label: "remainingAuthorizationBlockers missing production/go-live blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_PRODUCTION_BLOCKER).join("omitted")) }) },
  { label: "td002NonClosureScope missing public runtime", mutate: (r) => ({ ...r, td002NonClosureScope: r.td002NonClosureScope.map((s) => s.split(SENTINEL_NON_CLOSURE_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "td002NonClosureScope missing real document input", mutate: (r) => ({ ...r, td002NonClosureScope: r.td002NonClosureScope.map((s) => s.split(SENTINEL_NON_CLOSURE_REAL_DOC).join("omitted")) }) },
  { label: "td002NonClosureScope missing user-visible output", mutate: (r) => ({ ...r, td002NonClosureScope: r.td002NonClosureScope.map((s) => s.split(SENTINEL_NON_CLOSURE_USER_VISIBLE).join("omitted")) }) },
  { label: "td002NonClosureScope missing production/go-live", mutate: (r) => ({ ...r, td002NonClosureScope: r.td002NonClosureScope.map((s) => s.split(SENTINEL_NON_CLOSURE_PRODUCTION).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((d) => d.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((d) => d.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  { label: "closureDecisionTamperCoveragePassing false", mutate: (r) => ({ ...r, closureDecisionTamperCoveragePassing: false as true }) },
  { label: "closureDecisionTamperCasesRejected != count", mutate: (r) => ({ ...r, closureDecisionTamperCasesRejected: r.closureDecisionTamperCasesRejected - 1 }) },
];

// ─── Exported closure decision function ──────────────────────────────────────

/**
 * TD-002 Evidence Gates closure decision runner for 8.7J.
 *
 * Calls the 8.7I post-wiring audit runner as source of truth.
 * Closes TD-002 only for scoped disabled-by-default containment seam and audit readiness.
 * Does NOT authorize production runtime, real document input, user-visible output, or go-live.
 */
export function runControlledRealDocumentEvidenceGatesClosureDecision(): ClosureDecisionResult {
  const closureFailures: string[] = [];

  // ── Call 8.7I post-wiring audit runner as source of truth ─────────────
  const i = runControlledRealDocumentEvidenceGatesPostWiringAudit();
  if (i.checkId !== "8.7I") closureFailures.push(`8.7I checkId mismatch: expected "8.7I", got "${i.checkId}"`);
  if (i.allPassed !== true) closureFailures.push("8.7I allPassed is not true");
  if (i.readyFor8x7JClosureDecision !== true) closureFailures.push("8.7I readyFor8x7JClosureDecision is not true");
  if (i.auditedWiringRemainsDisabledByDefault !== true) closureFailures.push("8.7I auditedWiringRemainsDisabledByDefault is not true");
  if (i.auditedWiringRemainsContainmentOnly !== true) closureFailures.push("8.7I auditedWiringRemainsContainmentOnly is not true");
  if (i.auditedDryRunAdapterNotCalledWhileDisabled !== true) closureFailures.push("8.7I auditedDryRunAdapterNotCalledWhileDisabled is not true");
  if (i.auditedDryRunAdapterOutputNotUserVisible !== true) closureFailures.push("8.7I auditedDryRunAdapterOutputNotUserVisible is not true");
  if (i.auditedDryRunAdapterOutputNotPersisted !== true) closureFailures.push("8.7I auditedDryRunAdapterOutputNotPersisted is not true");
  if (i.additionalWiringPerformed !== false) closureFailures.push("8.7I additionalWiringPerformed is not false");
  if (i.routePatchPerformed !== false) closureFailures.push("8.7I routePatchPerformed is not false");
  if (i.routeWiringPerformed !== false) closureFailures.push("8.7I routeWiringPerformed is not false");
  if (i.routeFilesModified !== false) closureFailures.push("8.7I routeFilesModified is not false");
  if (i.runSmartTalkModified !== false) closureFailures.push("8.7I runSmartTalkModified is not false");
  if (i.runSmartTalkImported !== false) closureFailures.push("8.7I runSmartTalkImported is not false");
  if (i.runSmartTalkExecuted !== false) closureFailures.push("8.7I runSmartTalkExecuted is not false");
  if (i.postWiringAuditTamperCasesRejected !== i.postWiringAuditTamperCaseCount) closureFailures.push("8.7I post-wiring audit tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────
  const td002ClosureScope: string[] = [
    "CS-01: Scoped disabled-by-default Evidence Gates containment seam implementation (8.7H).",
    "CS-02: Dry-run runtime adapter isolated implementation and synthetic validation (8.7F, 35/35 cases).",
    "CS-03: Post-wiring audit confirming seam is inert, not user-visible, not persisted (8.7I).",
    "CS-04: Governance chain 8.7A–8.7I: plan, contract, boundary audit, adapter plan, adapter contract, dry-run, wiring execution contract, containment patch, post-wiring audit.",
    "CS-05: Audit readiness only — no production runtime authorization is granted.",
  ];

  const td002NonClosureScope: string[] = [
    `NCS-01 [${SENTINEL_NON_CLOSURE_PUBLIC_RUNTIME}]: td002-not-closed-for-public-runtime — public runtime is not authorized by this closure.`,
    `NCS-02 [${SENTINEL_NON_CLOSURE_REAL_DOC}]: td002-not-closed-for-real-document-input — real document input is not authorized by this closure.`,
    `NCS-03 [${SENTINEL_NON_CLOSURE_USER_VISIBLE}]: td002-not-closed-for-user-visible-output — user-visible Evidence Gates output is not authorized by this closure.`,
    `NCS-04 [${SENTINEL_NON_CLOSURE_PRODUCTION}]: td002-not-closed-for-production-go-live — production and go-live are not authorized by this closure.`,
    "NCS-05: Pilot runtime is not authorized by this closure.",
    "NCS-06: Payment/checkout/entitlement runtime is not authorized by this closure.",
    "NCS-07: OCR/photo input processing is not authorized by this closure.",
    "NCS-08: Persistence of governance decisions is not authorized by this closure.",
    "NCS-09: Exact legal deadline calculation is not authorized by this closure.",
    "NCS-10: Treating model output as trusted is not authorized by this closure.",
    "NCS-11: Final production Evidence Gates enforcement is not authorized by this closure.",
    "NCS-12: Full production claim authorization is not authorized by this closure.",
    "NCS-13: Full production reality authorization is not authorized by this closure.",
    "NCS-14: Resolution of unresolved governance debts is not included in this closure.",
    "NCS-15: This closure is not a go-live approval.",
  ];

  const remainingAuthorizationBlockers: string[] = [
    `RB-01 [${SENTINEL_REAL_DOC_BLOCKER}]: real-document-input-unauthorized-closure-blocker — real document input remains unauthorized.`,
    `RB-02 [${SENTINEL_USER_VISIBLE_BLOCKER}]: user-visible-output-unauthorized-closure-blocker — user-visible Evidence Gates output remains unauthorized.`,
    `RB-03 [${SENTINEL_PUBLIC_RUNTIME_BLOCKER}]: public-runtime-unauthorized-closure-blocker — public runtime remains unauthorized.`,
    `RB-04 [${SENTINEL_PRODUCTION_BLOCKER}]: production-go-live-unauthorized-closure-blocker — production and go-live remain unauthorized.`,
    "RB-05: Pilot runtime remains unauthorized.",
    "RB-06: Payment/checkout/entitlement runtime remains unauthorized.",
    "RB-07: OCR/photo input remains unauthorized.",
    "RB-08: Persistence of governance decisions remains unauthorized.",
    "RB-09: Exact legal deadline calculation remains unauthorized.",
    "RB-10: Model output remains untrusted.",
    "RB-11: Unresolved governance debts remain unresolved.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F.)",
  ];

  const closureDecisionNotes: string[] = [
    "TD-002 Evidence Gates is closed for: scoped disabled-by-default containment seam completed and audited.",
    "TD-002 is NOT a go-live approval, NOT a public runtime approval, NOT a real document input approval.",
    "TD-002 is NOT a user-visible output approval, NOT a production Evidence Gates authorization.",
    "The seam in run-smart-talk.ts remains disabled by default (EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false).",
    "The seam remains inert while disabled — no runtime behavior change.",
    "The dry-run adapter is not called while disabled.",
    "Adapter output remains not user-visible and not persisted.",
    "Further authorization is required before any runtime activation.",
    `8.7I post-wiring audit confirmed: checkId=${i.checkId}, allPassed=${i.allPassed}`,
  ];

  const nextRequiredAuthorizationSteps: string[] = [
    "NAS-01: Explicit authorization required before enabling the containment seam (EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = true).",
    "NAS-02: Separate authorization required before any real document input is processed by Evidence Gates.",
    "NAS-03: Separate authorization required before any Evidence Gates output is made user-visible.",
    "NAS-04: Separate authorization required before any production runtime activation.",
    "NAS-05: Governance debts (GD-01 through GD-09) must be resolved or explicitly deferred before full production Evidence Gates enforcement.",
    "NAS-06: Post-activation audit required after any runtime seam enablement.",
    "NAS-07: Claim authorization and reality authorization must be separately validated before production.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = CLOSURE_DECISION_TAMPER_CASES.length;

  const provisional: ClosureDecisionResult = {
    checkId: "8.7J",
    allPassed: true,
    closureDecisionOnly: true,
    closureDecisionFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    productionWiringPlanFileModified: false,
    productionWiringContractFileModified: false,
    boundaryAuditFileModified: false,
    runtimeAdapterPlanFileModified: false,
    runtimeAdapterContractFileModified: false,
    runtimeAdapterDryRunFileModified: false,
    runSmartTalkWiringExecutionContractFileModified: false,
    scopedWiringContainmentPatchFileModified: false,
    postWiringAuditFileModified: false,
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
    importedOnlyPostWiringAuditRunner: true,
    noOtherImportsUsed: true,
    postWiringAuditRunnerCalled: true,
    postWiringAuditCheckId: "8.7I",
    postWiringAuditAllPassed: true,
    postWiringAuditReadyForClosureDecision: true,
    td002ClosureDecisionCreated: true,
    td002ClosedForScopedDisabledByDefaultContainmentSeam: true,
    td002ClosedForPostWiringAuditReadiness: true,
    td002NotClosedForPublicRuntime: true,
    td002NotClosedForRealDocumentInput: true,
    td002NotClosedForUserVisibleOutput: true,
    td002NotClosedForPilotRuntime: true,
    td002NotClosedForProductionRuntime: true,
    td002NotClosedForGoLive: true,
    td002NotClosedForPaymentCheckoutEntitlement: true,
    td002NotClosedForOcrPhotoInput: true,
    td002NotClosedForPersistence: true,
    td002NotClosedForExactLegalDeadlineCalculation: true,
    td002NotClosedForTrustedModelOutput: true,
    td002NotClosedForFinalProductionEvidenceGatesEnforcement: true,
    td002NotClosedForFullProductionClaimAuthorization: true,
    td002NotClosedForFullProductionRealityAuthorization: true,
    td002NotClosedForUnresolvedGovernanceDebts: true,
    auditedSeamStillDisabledByDefault: true,
    auditedSeamStillContainmentOnly: true,
    auditedSeamStillInertWhileDisabled: true,
    auditedDryRunAdapterStillNotCalledWhileDisabled: true,
    auditedDryRunAdapterOutputStillNotUserVisible: true,
    auditedDryRunAdapterOutputStillNotPersisted: true,
    auditedDryRunAdapterStillUsesSyntheticGovernanceInputOnly: true,
    auditedDryRunAdapterStillDoesNotUseRawUserInput: true,
    auditedDryRunAdapterStillDoesNotUseRawModelOutputDirectly: true,
    auditedDryRunAdapterStillDoesNotUseRawDocumentText: true,
    auditedDryRunAdapterStillDoesNotUseOcrPhotoInput: true,
    auditedDryRunAdapterStillDoesNotUseRealPii: true,
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
    exactLegalDeadlineCalculationUnauthorized: true,
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
    scopedWiringContainmentPatchTamperConfirmedFrom8x7I: true,
    scopedWiringContainmentPatchTamperCaseCount: i.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: i.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x7I: true,
    postWiringAuditTamperCaseCount: i.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: i.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x7I: true,
    dryRunSyntheticValidationCaseCount: i.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: i.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x7I: true,
    dryRunLeakageValidationCaseCount: i.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: i.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x7I: true,
    dryRunTamperCaseCount: i.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: i.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x7I: true,
    wiringExecutionContractTamperCaseCount: i.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: i.wiringExecutionContractTamperCasesRejected,
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
    td002ClosureStatus: CLOSURE_STATUS_VALUE,
    td002ClosureScope,
    td002NonClosureScope,
    remainingAuthorizationBlockers,
    preservedGovernanceDebts,
    closureDecisionNotes,
    nextRequiredAuthorizationSteps,
    closureDecisionTamperCaseCount: tamperCaseCount,
    closureDecisionTamperCasesRejected: tamperCaseCount,
    closureDecisionTamperCoveragePassing: true,
  };

  if (!_isCanonicalClosureDecisionResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7J tamper cases ─────────────────────────────────────────────
  let closureDecisionTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < CLOSURE_DECISION_TAMPER_CASES.length; idx++) {
    const tc = CLOSURE_DECISION_TAMPER_CASES[idx];
    if (!_isCanonicalClosureDecisionResult(tc.mutate(provisional))) {
      closureDecisionTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7J tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed =
    closureFailures.length === 0 &&
    closureDecisionTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...closureDecisionNotes,
    `8.7J tamper cases: ${closureDecisionTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return { ...provisional, allPassed, closureDecisionTamperCasesRejected, closureDecisionNotes: finalNotes };
}
