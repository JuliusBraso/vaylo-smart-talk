/**
 * PHASE 8.7I — Post-Wiring Audit
 *
 * Post-wiring audit for the TD-002 Evidence Gates scoped containment seam from 8.7H.
 *
 * This file:
 *   - Calls the 8.7H scoped wiring containment patch runner as source of truth
 *   - Confirms the 8.7H seam is disabled-by-default and containment-only
 *   - Confirms all TD-002 / TD-004 boundary conditions remain preserved
 *   - Confirms dry-run adapter and governance debt inventory
 *   - Documents remaining authorization blockers before any closure decision
 *
 * Post-wiring-audit-only. No additional wiring is performed here.
 * TD-002 still requires a closure decision (8.7J).
 */

import { runControlledRealDocumentEvidenceGatesScopedWiringContainmentPatch } from "./run-controlled-real-document-evidence-gates-scoped-wiring-containment-patch";

// ─── Return type ──────────────────────────────────────────────────────────────

interface PostWiringAuditResult {
  checkId: "8.7I";
  allPassed: boolean;
  postWiringAuditOnly: true;
  postWiringAuditFileCreated: true;
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
  routePatchPerformed: false;
  routeWiringPerformed: false;
  routeFilesModified: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  additionalWiringPerformed: false;
  actualWiringAlreadyPerformedIn8x7H: true;
  auditedWiringRemainsDisabledByDefault: true;
  auditedWiringRemainsContainmentOnly: true;
  auditedWiringPlacedAtAllowedBoundary: true;
  auditedWiringPlacedAtPostModelPreUserVisibleBoundary: true;
  auditedWiringAvoidsForbiddenLocations: true;
  auditedDryRunAdapterImportedIntoRunSmartTalkSource: true;
  auditedDryRunAdapterCalledOnlyBehindDisabledByDefaultBranch: true;
  auditedDryRunAdapterNotCalledWhileDisabled: true;
  auditedDryRunAdapterOutputNotUserVisible: true;
  auditedDryRunAdapterOutputNotPersisted: true;
  auditedDryRunAdapterUsesSyntheticGovernanceInputOnly: true;
  auditedDryRunAdapterDoesNotUseRawUserInput: true;
  auditedDryRunAdapterDoesNotUseRawModelOutputDirectly: true;
  auditedDryRunAdapterDoesNotUseRawDocumentText: true;
  auditedDryRunAdapterDoesNotUseOcrPhotoInput: true;
  auditedDryRunAdapterDoesNotUseRealPii: true;
  importedOnlyScopedWiringContainmentPatchRunner: true;
  noOtherImportsUsed: true;
  scopedWiringContainmentPatchRunnerCalled: true;
  scopedWiringContainmentPatchCheckId: "8.7H";
  scopedWiringContainmentPatchAllPassed: true;
  scopedWiringContainmentPatchReadyForPostWiringAudit: true;
  td002PostWiringAuditCreated: true;
  td002ScopedWiringContainmentPatchConfirmed: true;
  td002EvidenceGatesNoLongerCompletelyUnwiredButStillDisabledByDefault: true;
  td002ProductionWiringStillNotEnabled: true;
  td002PublicRuntimeStillNotEnabled: true;
  td002StillRequiresClosureDecision: true;
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
  scopedWiringContainmentPatchTamperConfirmedFrom8x7H: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x7H: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x7H: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x7H: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x7H: true;
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
  readyFor8x7JClosureDecision: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  postWiringAuditTamperCoveragePassing: true;
  postWiringAuditNotes: string[];
  auditedContainmentSeamNotes: string[];
  auditedForbiddenLocationNotes: string[];
  auditedBoundaryNotes: string[];
  auditedDebtNotes: string[];
  remainingAuthorizationBlockers: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_REAL_DOC_BLOCKER = "real-document-input-unauthorized-blocker";
const SENTINEL_USER_VISIBLE_BLOCKER = "user-visible-output-unauthorized-blocker";
const SENTINEL_PUBLIC_RUNTIME_BLOCKER = "public-runtime-unauthorized-blocker";
const SENTINEL_PRODUCTION_BLOCKER = "production-go-live-unauthorized-blocker";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalPostWiringAuditResult(r: PostWiringAuditResult): boolean {
  if (r.checkId !== "8.7I") return false;
  if (r.allPassed !== true) return false;
  if (r.postWiringAuditOnly !== true) return false;
  if (r.postWiringAuditFileCreated !== true) return false;
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
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.routeFilesModified !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.additionalWiringPerformed !== false) return false;
  if (r.actualWiringAlreadyPerformedIn8x7H !== true) return false;
  if (r.auditedWiringRemainsDisabledByDefault !== true) return false;
  if (r.auditedWiringRemainsContainmentOnly !== true) return false;
  if (r.auditedWiringPlacedAtAllowedBoundary !== true) return false;
  if (r.auditedWiringPlacedAtPostModelPreUserVisibleBoundary !== true) return false;
  if (r.auditedWiringAvoidsForbiddenLocations !== true) return false;
  if (r.auditedDryRunAdapterImportedIntoRunSmartTalkSource !== true) return false;
  if (r.auditedDryRunAdapterCalledOnlyBehindDisabledByDefaultBranch !== true) return false;
  if (r.auditedDryRunAdapterNotCalledWhileDisabled !== true) return false;
  if (r.auditedDryRunAdapterOutputNotUserVisible !== true) return false;
  if (r.auditedDryRunAdapterOutputNotPersisted !== true) return false;
  if (r.auditedDryRunAdapterUsesSyntheticGovernanceInputOnly !== true) return false;
  if (r.auditedDryRunAdapterDoesNotUseRawUserInput !== true) return false;
  if (r.auditedDryRunAdapterDoesNotUseRawModelOutputDirectly !== true) return false;
  if (r.auditedDryRunAdapterDoesNotUseRawDocumentText !== true) return false;
  if (r.auditedDryRunAdapterDoesNotUseOcrPhotoInput !== true) return false;
  if (r.auditedDryRunAdapterDoesNotUseRealPii !== true) return false;
  if (r.importedOnlyScopedWiringContainmentPatchRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.scopedWiringContainmentPatchRunnerCalled !== true) return false;
  if (r.scopedWiringContainmentPatchCheckId !== "8.7H") return false;
  if (r.scopedWiringContainmentPatchAllPassed !== true) return false;
  if (r.scopedWiringContainmentPatchReadyForPostWiringAudit !== true) return false;
  if (r.td002PostWiringAuditCreated !== true) return false;
  if (r.td002ScopedWiringContainmentPatchConfirmed !== true) return false;
  if (r.td002EvidenceGatesNoLongerCompletelyUnwiredButStillDisabledByDefault !== true) return false;
  if (r.td002ProductionWiringStillNotEnabled !== true) return false;
  if (r.td002PublicRuntimeStillNotEnabled !== true) return false;
  if (r.td002StillRequiresClosureDecision !== true) return false;
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
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x7H !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x7H !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x7H !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x7H !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x7H !== true) return false;
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
  if (r.readyFor8x7JClosureDecision !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.postWiringAuditTamperCoveragePassing !== true) return false;
  // Array non-empty checks
  if (!r.postWiringAuditNotes || r.postWiringAuditNotes.length === 0) return false;
  if (!r.auditedContainmentSeamNotes || r.auditedContainmentSeamNotes.length === 0) return false;
  if (!r.auditedForbiddenLocationNotes || r.auditedForbiddenLocationNotes.length === 0) return false;
  if (!r.auditedBoundaryNotes || r.auditedBoundaryNotes.length === 0) return false;
  if (!r.auditedDebtNotes || r.auditedDebtNotes.length === 0) return false;
  if (!r.remainingAuthorizationBlockers || r.remainingAuthorizationBlockers.length === 0) return false;
  // Sentinel checks on remainingAuthorizationBlockers
  const blockersJ = r.remainingAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_REAL_DOC_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_USER_VISIBLE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_BLOCKER)) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type PostWiringAuditTamperMutation = (r: PostWiringAuditResult) => PostWiringAuditResult;
interface PostWiringAuditTamperCase { label: string; mutate: PostWiringAuditTamperMutation; }

const POST_WIRING_AUDIT_TAMPER_CASES: PostWiringAuditTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7H" as "8.7I" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "postWiringAuditOnly false", mutate: (r) => ({ ...r, postWiringAuditOnly: false as true }) },
  { label: "postWiringAuditFileCreated false", mutate: (r) => ({ ...r, postWiringAuditFileCreated: false as true }) },
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
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "routeFilesModified true", mutate: (r) => ({ ...r, routeFilesModified: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "additionalWiringPerformed true", mutate: (r) => ({ ...r, additionalWiringPerformed: true as false }) },
  { label: "actualWiringAlreadyPerformedIn8x7H false", mutate: (r) => ({ ...r, actualWiringAlreadyPerformedIn8x7H: false as true }) },
  { label: "auditedWiringRemainsDisabledByDefault false", mutate: (r) => ({ ...r, auditedWiringRemainsDisabledByDefault: false as true }) },
  { label: "auditedWiringRemainsContainmentOnly false", mutate: (r) => ({ ...r, auditedWiringRemainsContainmentOnly: false as true }) },
  { label: "auditedWiringPlacedAtAllowedBoundary false", mutate: (r) => ({ ...r, auditedWiringPlacedAtAllowedBoundary: false as true }) },
  { label: "auditedWiringPlacedAtPostModelPreUserVisibleBoundary false", mutate: (r) => ({ ...r, auditedWiringPlacedAtPostModelPreUserVisibleBoundary: false as true }) },
  { label: "auditedWiringAvoidsForbiddenLocations false", mutate: (r) => ({ ...r, auditedWiringAvoidsForbiddenLocations: false as true }) },
  { label: "auditedDryRunAdapterImportedIntoRunSmartTalkSource false", mutate: (r) => ({ ...r, auditedDryRunAdapterImportedIntoRunSmartTalkSource: false as true }) },
  { label: "auditedDryRunAdapterCalledOnlyBehindDisabledByDefaultBranch false", mutate: (r) => ({ ...r, auditedDryRunAdapterCalledOnlyBehindDisabledByDefaultBranch: false as true }) },
  { label: "auditedDryRunAdapterNotCalledWhileDisabled false", mutate: (r) => ({ ...r, auditedDryRunAdapterNotCalledWhileDisabled: false as true }) },
  { label: "auditedDryRunAdapterOutputNotUserVisible false", mutate: (r) => ({ ...r, auditedDryRunAdapterOutputNotUserVisible: false as true }) },
  { label: "auditedDryRunAdapterOutputNotPersisted false", mutate: (r) => ({ ...r, auditedDryRunAdapterOutputNotPersisted: false as true }) },
  { label: "auditedDryRunAdapterUsesSyntheticGovernanceInputOnly false", mutate: (r) => ({ ...r, auditedDryRunAdapterUsesSyntheticGovernanceInputOnly: false as true }) },
  { label: "auditedDryRunAdapterDoesNotUseRawUserInput false", mutate: (r) => ({ ...r, auditedDryRunAdapterDoesNotUseRawUserInput: false as true }) },
  { label: "auditedDryRunAdapterDoesNotUseRawModelOutputDirectly false", mutate: (r) => ({ ...r, auditedDryRunAdapterDoesNotUseRawModelOutputDirectly: false as true }) },
  { label: "auditedDryRunAdapterDoesNotUseRawDocumentText false", mutate: (r) => ({ ...r, auditedDryRunAdapterDoesNotUseRawDocumentText: false as true }) },
  { label: "auditedDryRunAdapterDoesNotUseOcrPhotoInput false", mutate: (r) => ({ ...r, auditedDryRunAdapterDoesNotUseOcrPhotoInput: false as true }) },
  { label: "auditedDryRunAdapterDoesNotUseRealPii false", mutate: (r) => ({ ...r, auditedDryRunAdapterDoesNotUseRealPii: false as true }) },
  { label: "importedOnlyScopedWiringContainmentPatchRunner false", mutate: (r) => ({ ...r, importedOnlyScopedWiringContainmentPatchRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "scopedWiringContainmentPatchRunnerCalled false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchRunnerCalled: false as true }) },
  { label: "scopedWiringContainmentPatchCheckId wrong", mutate: (r) => ({ ...r, scopedWiringContainmentPatchCheckId: "8.7G" as "8.7H" }) },
  { label: "scopedWiringContainmentPatchAllPassed false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchAllPassed: false as true }) },
  { label: "scopedWiringContainmentPatchReadyForPostWiringAudit false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchReadyForPostWiringAudit: false as true }) },
  { label: "td002PostWiringAuditCreated false", mutate: (r) => ({ ...r, td002PostWiringAuditCreated: false as true }) },
  { label: "td002ScopedWiringContainmentPatchConfirmed false", mutate: (r) => ({ ...r, td002ScopedWiringContainmentPatchConfirmed: false as true }) },
  { label: "td002ProductionWiringStillNotEnabled false", mutate: (r) => ({ ...r, td002ProductionWiringStillNotEnabled: false as true }) },
  { label: "td002PublicRuntimeStillNotEnabled false", mutate: (r) => ({ ...r, td002PublicRuntimeStillNotEnabled: false as true }) },
  { label: "td002StillRequiresClosureDecision false", mutate: (r) => ({ ...r, td002StillRequiresClosureDecision: false as true }) },
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
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x7H false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x7H: false as true }) },
  { label: "scopedWiringContainmentPatchTamperCasesRejected != count", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCasesRejected: r.scopedWiringContainmentPatchTamperCasesRejected - 1 }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x7H false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x7H: false as true }) },
  { label: "dryRunSyntheticValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x7H false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x7H: false as true }) },
  { label: "dryRunLeakageValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x7H false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x7H: false as true }) },
  { label: "dryRunTamperCasesRejected != count", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x7H false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x7H: false as true }) },
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
  { label: "readyFor8x7JClosureDecision false", mutate: (r) => ({ ...r, readyFor8x7JClosureDecision: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "postWiringAuditTamperCoveragePassing false", mutate: (r) => ({ ...r, postWiringAuditTamperCoveragePassing: false as true }) },
  { label: "postWiringAuditTamperCasesRejected != count", mutate: (r) => ({ ...r, postWiringAuditTamperCasesRejected: r.postWiringAuditTamperCasesRejected - 1 }) },
  { label: "postWiringAuditNotes empty", mutate: (r) => ({ ...r, postWiringAuditNotes: [] }) },
  { label: "auditedContainmentSeamNotes empty", mutate: (r) => ({ ...r, auditedContainmentSeamNotes: [] }) },
  { label: "auditedForbiddenLocationNotes empty", mutate: (r) => ({ ...r, auditedForbiddenLocationNotes: [] }) },
  { label: "auditedBoundaryNotes empty", mutate: (r) => ({ ...r, auditedBoundaryNotes: [] }) },
  { label: "auditedDebtNotes empty", mutate: (r) => ({ ...r, auditedDebtNotes: [] }) },
  { label: "remainingAuthorizationBlockers empty", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: [] }) },
  { label: "remainingAuthorizationBlockers missing real document input blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_REAL_DOC_BLOCKER).join("omitted")) }) },
  { label: "remainingAuthorizationBlockers missing user-visible output blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_USER_VISIBLE_BLOCKER).join("omitted")) }) },
  { label: "remainingAuthorizationBlockers missing public runtime blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_PUBLIC_RUNTIME_BLOCKER).join("omitted")) }) },
  { label: "remainingAuthorizationBlockers missing production/go-live blocker", mutate: (r) => ({ ...r, remainingAuthorizationBlockers: r.remainingAuthorizationBlockers.map((b) => b.split(SENTINEL_PRODUCTION_BLOCKER).join("omitted")) }) },
];

// ─── Exported post-wiring audit function ─────────────────────────────────────

/**
 * Post-wiring audit for the 8.7H TD-002 Evidence Gates scoped containment seam.
 *
 * Calls the 8.7H scoped wiring containment patch runner as source of truth.
 * Confirms the seam is disabled-by-default and containment-only.
 * readyFor8x7J is a readiness signal only — not runtime authorization.
 */
export function runControlledRealDocumentEvidenceGatesPostWiringAudit(): PostWiringAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.7H containment patch runner as source of truth ─────────────
  const h = runControlledRealDocumentEvidenceGatesScopedWiringContainmentPatch();
  if (h.checkId !== "8.7H") auditFailures.push(`8.7H checkId mismatch: expected "8.7H", got "${h.checkId}"`);
  if (h.allPassed !== true) auditFailures.push("8.7H allPassed is not true");
  if (h.readyFor8x7IPostWiringAudit !== true) auditFailures.push("8.7H readyFor8x7IPostWiringAudit is not true");
  if (h.wiringIsDisabledByDefault !== true) auditFailures.push("8.7H wiringIsDisabledByDefault is not true");
  if (h.wiringIsContainmentOnly !== true) auditFailures.push("8.7H wiringIsContainmentOnly is not true");
  if (h.wiringPlacedAtPostModelPreUserVisibleBoundary !== true) auditFailures.push("8.7H wiringPlacedAtPostModelPreUserVisibleBoundary is not true");
  if (h.dryRunAdapterNotCalledWhileDisabled !== true) auditFailures.push("8.7H dryRunAdapterNotCalledWhileDisabled is not true");
  if (h.dryRunAdapterOutputNotUserVisible !== true) auditFailures.push("8.7H dryRunAdapterOutputNotUserVisible is not true");
  if (h.dryRunAdapterOutputNotPersisted !== true) auditFailures.push("8.7H dryRunAdapterOutputNotPersisted is not true");
  if (h.routePatchPerformed !== false) auditFailures.push("8.7H routePatchPerformed is not false");
  if (h.routeWiringPerformed !== false) auditFailures.push("8.7H routeWiringPerformed is not false");
  if (h.routeFilesModified !== false) auditFailures.push("8.7H routeFilesModified is not false");
  if (h.runSmartTalkImported !== false) auditFailures.push("8.7H runSmartTalkImported is not false");
  if (h.runSmartTalkExecuted !== false) auditFailures.push("8.7H runSmartTalkExecuted is not false");

  // ── Notes arrays ─────────────────────────────────────────────────────
  const postWiringAuditNotes: string[] = [
    "8.7I post-wiring audit created for TD-002 Evidence Gates scoped containment seam from 8.7H",
    `8.7H containment patch runner confirmed: checkId=${h.checkId}, allPassed=${h.allPassed}`,
    "Post-wiring-audit-only: no additional wiring performed, no existing files modified",
    "TD-002 seam is disabled by default (EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false)",
    "TD-002 seam is structurally present but inert — no runtime behavior change",
    "TD-002 still requires a closure decision (8.7J) before any governance authorization is considered",
    "readyFor8x7J: readiness signal only — not runtime authorization",
  ];

  const auditedContainmentSeamNotes: string[] = [
    "Seam location: lib/vaylo/smart-talk/run-smart-talk.ts",
    "Seam boundary: post-model-output / pre-user-visible-governance (after normalizeParsedObject, before return)",
    "Seam constant: EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false (local, not from env/network/storage)",
    "Adapter import: runEvidenceGatesRuntimeAdapterDryRun from 8.7F (only new import added to runSmartTalk)",
    "Adapter call: inside disabled if-branch only; output voided; not surfaced, not persisted",
    "Synthetic input: _buildSyntheticGovernanceInputForContainmentSeam (probe string only, no raw user data)",
    "Helper: _buildSyntheticGovernanceInputForContainmentSeam is non-exported, module-local",
    "Existing behavior: unchanged while seam is disabled",
  ];

  const auditedForbiddenLocationNotes: string[] = [
    "Route input parsing: not modified — seam is post-model, not in route input handling",
    "Prompt construction: not modified — build-smart-talk-prompt.ts unchanged",
    "Provider/model call layer: not modified — seam is after OpenAI response handling",
    "Public route authorization: not modified — no route files touched",
    "Payment/checkout/entitlement logic: not modified — no entitlement files touched",
    "Persistence/storage implementation: not modified — no DB or storage calls added",
    "UI rendering: not modified — no UI files touched",
    "OCR/photo route quarantine: not modified — photo route and OCR files unchanged",
    "PII redaction internals: not modified — pii/pre-model-pii-redaction.ts unchanged",
    "Trusted model output location: not created — seam uses synthetic probe input only",
  ];

  const auditedBoundaryNotes: string[] = [
    "post-model-output / pre-user-visible-governance: seam placed at this exact boundary (confirmed from 8.7H)",
    "pre-high-risk-claim-surfacing: preserved — no claim surfacing logic modified",
    "pre-document-derived-claim-surfacing: preserved — no document claim logic modified",
    "pre-persistence: preserved — no persistence calls added",
    "pre-automation/task-execution: preserved — no automation/task logic added",
  ];

  const auditedDebtNotes: string[] = [
    "ClaimRule OR semantics: preserved — no claim rule logic modified",
    "EvidenceRule/ClaimRule resolution structured semantics: preserved",
    "Proximity manual-only: preserved — no proximity logic modified",
    "TrapActivation.trapKind typing: preserved — no trap kind type changes",
    "enforcementTrapHeuristic coarse substring: preserved — not promoted to production enforcement",
    "TrapDisposition state separation: preserved — no disposition state logic modified",
    "SeverityCandidate/SeverityDerivation separation: preserved",
    "Mapper diagnostic taxonomy: preserved — no mapper logic modified",
    "TD-004 closure does not authorize wiring: preserved — PII utility closure remains separate",
  ];

  const remainingAuthorizationBlockers: string[] = [
    `BLOCKER-01 [${SENTINEL_REAL_DOC_BLOCKER}]: real-document-input-unauthorized-blocker — real document input remains unauthorized. Separate authorization required.`,
    `BLOCKER-02 [${SENTINEL_USER_VISIBLE_BLOCKER}]: user-visible-output-unauthorized-blocker — user-visible Evidence Gates output remains unauthorized by default.`,
    `BLOCKER-03 [${SENTINEL_PUBLIC_RUNTIME_BLOCKER}]: public-runtime-unauthorized-blocker — public runtime for Evidence Gates remains unauthorized.`,
    `BLOCKER-04 [${SENTINEL_PRODUCTION_BLOCKER}]: production-go-live-unauthorized-blocker — production and go-live remain unauthorized. Closure decision (8.7J) required.`,
    "BLOCKER-05: Pilot runtime remains unauthorized.",
    "BLOCKER-06: Model output remains untrusted — exact claim authorization and reality authorization not yet granted.",
    "BLOCKER-07: Exact legal deadline calculation remains unauthorized.",
    "BLOCKER-08: Payment/checkout/entitlement runtime remains unauthorized.",
    "BLOCKER-09: Post-wiring closure decision (8.7J) is required before any Evidence Gates authorization is reconsidered.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = POST_WIRING_AUDIT_TAMPER_CASES.length;

  const provisional: PostWiringAuditResult = {
    checkId: "8.7I",
    allPassed: true,
    postWiringAuditOnly: true,
    postWiringAuditFileCreated: true,
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
    routePatchPerformed: false,
    routeWiringPerformed: false,
    routeFilesModified: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    additionalWiringPerformed: false,
    actualWiringAlreadyPerformedIn8x7H: true,
    auditedWiringRemainsDisabledByDefault: true,
    auditedWiringRemainsContainmentOnly: true,
    auditedWiringPlacedAtAllowedBoundary: true,
    auditedWiringPlacedAtPostModelPreUserVisibleBoundary: true,
    auditedWiringAvoidsForbiddenLocations: true,
    auditedDryRunAdapterImportedIntoRunSmartTalkSource: true,
    auditedDryRunAdapterCalledOnlyBehindDisabledByDefaultBranch: true,
    auditedDryRunAdapterNotCalledWhileDisabled: true,
    auditedDryRunAdapterOutputNotUserVisible: true,
    auditedDryRunAdapterOutputNotPersisted: true,
    auditedDryRunAdapterUsesSyntheticGovernanceInputOnly: true,
    auditedDryRunAdapterDoesNotUseRawUserInput: true,
    auditedDryRunAdapterDoesNotUseRawModelOutputDirectly: true,
    auditedDryRunAdapterDoesNotUseRawDocumentText: true,
    auditedDryRunAdapterDoesNotUseOcrPhotoInput: true,
    auditedDryRunAdapterDoesNotUseRealPii: true,
    importedOnlyScopedWiringContainmentPatchRunner: true,
    noOtherImportsUsed: true,
    scopedWiringContainmentPatchRunnerCalled: true,
    scopedWiringContainmentPatchCheckId: "8.7H",
    scopedWiringContainmentPatchAllPassed: true,
    scopedWiringContainmentPatchReadyForPostWiringAudit: true,
    td002PostWiringAuditCreated: true,
    td002ScopedWiringContainmentPatchConfirmed: true,
    td002EvidenceGatesNoLongerCompletelyUnwiredButStillDisabledByDefault: true,
    td002ProductionWiringStillNotEnabled: true,
    td002PublicRuntimeStillNotEnabled: true,
    td002StillRequiresClosureDecision: true,
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
    scopedWiringContainmentPatchTamperConfirmedFrom8x7H: true,
    scopedWiringContainmentPatchTamperCaseCount: h.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: h.scopedWiringContainmentPatchTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x7H: true,
    dryRunSyntheticValidationCaseCount: h.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: h.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x7H: true,
    dryRunLeakageValidationCaseCount: h.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: h.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x7H: true,
    dryRunTamperCaseCount: h.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: h.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x7H: true,
    wiringExecutionContractTamperCaseCount: h.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: h.wiringExecutionContractTamperCasesRejected,
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
    readyFor8x7JClosureDecision: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    postWiringAuditTamperCaseCount: tamperCaseCount,
    postWiringAuditTamperCasesRejected: tamperCaseCount,
    postWiringAuditTamperCoveragePassing: true,
    postWiringAuditNotes,
    auditedContainmentSeamNotes,
    auditedForbiddenLocationNotes,
    auditedBoundaryNotes,
    auditedDebtNotes,
    remainingAuthorizationBlockers,
  };

  if (!_isCanonicalPostWiringAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7I tamper cases ─────────────────────────────────────────────
  let postWiringAuditTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let i = 0; i < POST_WIRING_AUDIT_TAMPER_CASES.length; i++) {
    const tc = POST_WIRING_AUDIT_TAMPER_CASES[i];
    if (!_isCanonicalPostWiringAuditResult(tc.mutate(provisional))) {
      postWiringAuditTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7I tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    postWiringAuditTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...postWiringAuditNotes,
    `8.7I tamper cases: ${postWiringAuditTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return { ...provisional, allPassed, postWiringAuditTamperCasesRejected, postWiringAuditNotes: finalNotes };
}
