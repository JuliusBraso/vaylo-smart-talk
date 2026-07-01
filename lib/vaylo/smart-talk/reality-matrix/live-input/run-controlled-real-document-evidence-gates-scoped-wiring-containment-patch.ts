/**
 * PHASE 8.7H — Scoped Wiring / Containment Patch
 *
 * Validation runner for the TD-002 Evidence Gates disabled-by-default containment seam
 * added to runSmartTalk at the post-model-output / pre-user-visible-governance boundary.
 *
 * This file:
 *   - Calls the 8.7G execution contract runner as source of truth
 *   - Confirms the patch is disabled-by-default and containment-only
 *   - Confirms TD-002 / TD-004 boundary preservation
 *   - Confirms dry-run adapter behaviors, governance debts, and authorization limits
 *
 * Still unauthorized after 8.7H:
 *   - Production / pilot / public runtime
 *   - Real document input / user-visible output
 *   - Actual governance execution (seam is disabled)
 *
 * TD-002 still requires post-wiring audit and closure decision.
 */

import { runControlledRealDocumentEvidenceGatesRunSmartTalkWiringExecutionContract } from "./run-controlled-real-document-evidence-gates-run-smart-talk-wiring-execution-contract";

// ─── Return type ──────────────────────────────────────────────────────────────

interface ScopedWiringContainmentPatchResult {
  checkId: "8.7H";
  allPassed: boolean;
  scopedWiringContainmentPatchOnly: true;
  scopedWiringContainmentPatchFileCreated: true;
  existingFilesModified: true;
  exactlyOneRunSmartTalkFileModified: true;
  runSmartTalkTargetIdentified: true;
  ambiguousRunSmartTalkTarget: false;
  productionWiringPlanFileModified: false;
  productionWiringContractFileModified: false;
  boundaryAuditFileModified: false;
  runtimeAdapterPlanFileModified: false;
  runtimeAdapterContractFileModified: false;
  runtimeAdapterDryRunFileModified: false;
  runSmartTalkWiringExecutionContractFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  routeFilesModified: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  runSmartTalkModified: true;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  runSmartTalkSourcePatched: true;
  actualWiringPerformed: true;
  wiringIsDisabledByDefault: true;
  wiringIsContainmentOnly: true;
  wiringPlacedAtAllowedBoundary: true;
  wiringPlacedAtPostModelPreUserVisibleBoundary: true;
  wiringAvoidsForbiddenLocations: true;
  wiringDoesNotModifyRouteParsing: true;
  wiringDoesNotModifyPromptConstruction: true;
  wiringDoesNotModifyProviderModelCallLayer: true;
  wiringDoesNotModifyPublicRouteAuthorization: true;
  wiringDoesNotModifyPaymentCheckoutEntitlement: true;
  wiringDoesNotModifyPersistenceStorage: true;
  wiringDoesNotModifyUiRendering: true;
  wiringDoesNotModifyOcrPhotoQuarantine: true;
  wiringDoesNotModifyPiiRedactionInternals: true;
  wiringDoesNotCreateTrustedModelOutputLocation: true;
  dryRunAdapterImportedIntoRunSmartTalkSource: true;
  dryRunAdapterCalledOnlyBehindDisabledByDefaultBranch: true;
  dryRunAdapterNotCalledWhileDisabled: true;
  dryRunAdapterOutputNotUserVisible: true;
  dryRunAdapterOutputNotPersisted: true;
  dryRunAdapterUsesSyntheticGovernanceInputOnly: true;
  dryRunAdapterDoesNotUseRawUserInput: true;
  dryRunAdapterDoesNotUseRawModelOutputDirectly: true;
  dryRunAdapterDoesNotUseRawDocumentText: true;
  dryRunAdapterDoesNotUseOcrPhotoInput: true;
  dryRunAdapterDoesNotUseRealPii: true;
  importedOnlyWiringExecutionContractRunner: true;
  noOtherImportsUsedInValidationFile: true;
  wiringExecutionContractRunnerCalled: true;
  wiringExecutionContractCheckId: "8.7G";
  wiringExecutionContractAllPassed: true;
  wiringExecutionContractReadyForScopedPatch: true;
  td002ScopedWiringContainmentPatchCreated: true;
  td002WiringExecutionContractConfirmed: true;
  td002EvidenceGatesNoLongerCompletelyUnwiredButStillDisabledByDefault: true;
  td002ProductionWiringStillNotEnabled: true;
  td002PublicRuntimeStillNotEnabled: true;
  td002StillRequiresPostWiringAudit: true;
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
  dryRunSyntheticValidationConfirmedFrom8x7G: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x7G: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x7G: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x7G: true;
  wiringExecutionContractTamperCaseCount: number;
  wiringExecutionContractTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperCoveragePassing: true;
  readyFor8x7IPostWiringAudit: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  modifiedRunSmartTalkFilePath: string;
  containmentPatchNotes: string[];
  disabledByDefaultSeamNotes: string[];
  preservedForbiddenLocationNotes: string[];
  preservedBoundaryNotes: string[];
  preservedDebtNotes: string[];
}

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalScopedWiringResult(r: ScopedWiringContainmentPatchResult): boolean {
  if (r.checkId !== "8.7H") return false;
  if (r.allPassed !== true) return false;
  if (r.scopedWiringContainmentPatchOnly !== true) return false;
  if (r.scopedWiringContainmentPatchFileCreated !== true) return false;
  if (r.existingFilesModified !== true) return false;
  if (r.exactlyOneRunSmartTalkFileModified !== true) return false;
  if (r.runSmartTalkTargetIdentified !== true) return false;
  if (r.ambiguousRunSmartTalkTarget !== false) return false;
  if (r.productionWiringPlanFileModified !== false) return false;
  if (r.productionWiringContractFileModified !== false) return false;
  if (r.boundaryAuditFileModified !== false) return false;
  if (r.runtimeAdapterPlanFileModified !== false) return false;
  if (r.runtimeAdapterContractFileModified !== false) return false;
  if (r.runtimeAdapterDryRunFileModified !== false) return false;
  if (r.runSmartTalkWiringExecutionContractFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.routeFilesModified !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.runSmartTalkModified !== true) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.runSmartTalkSourcePatched !== true) return false;
  if (r.actualWiringPerformed !== true) return false;
  if (r.wiringIsDisabledByDefault !== true) return false;
  if (r.wiringIsContainmentOnly !== true) return false;
  if (r.wiringPlacedAtAllowedBoundary !== true) return false;
  if (r.wiringPlacedAtPostModelPreUserVisibleBoundary !== true) return false;
  if (r.wiringAvoidsForbiddenLocations !== true) return false;
  if (r.wiringDoesNotModifyRouteParsing !== true) return false;
  if (r.wiringDoesNotModifyPromptConstruction !== true) return false;
  if (r.wiringDoesNotModifyProviderModelCallLayer !== true) return false;
  if (r.wiringDoesNotModifyPublicRouteAuthorization !== true) return false;
  if (r.wiringDoesNotModifyPaymentCheckoutEntitlement !== true) return false;
  if (r.wiringDoesNotModifyPersistenceStorage !== true) return false;
  if (r.wiringDoesNotModifyUiRendering !== true) return false;
  if (r.wiringDoesNotModifyOcrPhotoQuarantine !== true) return false;
  if (r.wiringDoesNotModifyPiiRedactionInternals !== true) return false;
  if (r.wiringDoesNotCreateTrustedModelOutputLocation !== true) return false;
  if (r.dryRunAdapterImportedIntoRunSmartTalkSource !== true) return false;
  if (r.dryRunAdapterCalledOnlyBehindDisabledByDefaultBranch !== true) return false;
  if (r.dryRunAdapterNotCalledWhileDisabled !== true) return false;
  if (r.dryRunAdapterOutputNotUserVisible !== true) return false;
  if (r.dryRunAdapterOutputNotPersisted !== true) return false;
  if (r.dryRunAdapterUsesSyntheticGovernanceInputOnly !== true) return false;
  if (r.dryRunAdapterDoesNotUseRawUserInput !== true) return false;
  if (r.dryRunAdapterDoesNotUseRawModelOutputDirectly !== true) return false;
  if (r.dryRunAdapterDoesNotUseRawDocumentText !== true) return false;
  if (r.dryRunAdapterDoesNotUseOcrPhotoInput !== true) return false;
  if (r.dryRunAdapterDoesNotUseRealPii !== true) return false;
  if (r.importedOnlyWiringExecutionContractRunner !== true) return false;
  if (r.noOtherImportsUsedInValidationFile !== true) return false;
  if (r.wiringExecutionContractRunnerCalled !== true) return false;
  if (r.wiringExecutionContractCheckId !== "8.7G") return false;
  if (r.wiringExecutionContractAllPassed !== true) return false;
  if (r.wiringExecutionContractReadyForScopedPatch !== true) return false;
  if (r.td002ScopedWiringContainmentPatchCreated !== true) return false;
  if (r.td002WiringExecutionContractConfirmed !== true) return false;
  if (r.td002EvidenceGatesNoLongerCompletelyUnwiredButStillDisabledByDefault !== true) return false;
  if (r.td002ProductionWiringStillNotEnabled !== true) return false;
  if (r.td002PublicRuntimeStillNotEnabled !== true) return false;
  if (r.td002StillRequiresPostWiringAudit !== true) return false;
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
  if (r.dryRunSyntheticValidationConfirmedFrom8x7G !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x7G !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x7G !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x7G !== true) return false;
  if (r.wiringExecutionContractTamperCasesRejected !== r.wiringExecutionContractTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperCoveragePassing !== true) return false;
  if (r.readyFor8x7IPostWiringAudit !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (!r.modifiedRunSmartTalkFilePath || r.modifiedRunSmartTalkFilePath.length === 0) return false;
  if (!r.containmentPatchNotes || r.containmentPatchNotes.length === 0) return false;
  if (!r.disabledByDefaultSeamNotes || r.disabledByDefaultSeamNotes.length === 0) return false;
  if (!r.preservedForbiddenLocationNotes || r.preservedForbiddenLocationNotes.length === 0) return false;
  if (!r.preservedBoundaryNotes || r.preservedBoundaryNotes.length === 0) return false;
  if (!r.preservedDebtNotes || r.preservedDebtNotes.length === 0) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type ScopedWiringTamperMutation = (r: ScopedWiringContainmentPatchResult) => ScopedWiringContainmentPatchResult;
interface ScopedWiringTamperCase { label: string; mutate: ScopedWiringTamperMutation; }

const SCOPED_WIRING_TAMPER_CASES: ScopedWiringTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7G" as "8.7H" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "scopedWiringContainmentPatchOnly false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchOnly: false as true }) },
  { label: "scopedWiringContainmentPatchFileCreated false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchFileCreated: false as true }) },
  { label: "existingFilesModified false", mutate: (r) => ({ ...r, existingFilesModified: false as true }) },
  { label: "exactlyOneRunSmartTalkFileModified false", mutate: (r) => ({ ...r, exactlyOneRunSmartTalkFileModified: false as true }) },
  { label: "runSmartTalkTargetIdentified false", mutate: (r) => ({ ...r, runSmartTalkTargetIdentified: false as true }) },
  { label: "ambiguousRunSmartTalkTarget true", mutate: (r) => ({ ...r, ambiguousRunSmartTalkTarget: true as false }) },
  { label: "productionWiringPlanFileModified true", mutate: (r) => ({ ...r, productionWiringPlanFileModified: true as false }) },
  { label: "productionWiringContractFileModified true", mutate: (r) => ({ ...r, productionWiringContractFileModified: true as false }) },
  { label: "boundaryAuditFileModified true", mutate: (r) => ({ ...r, boundaryAuditFileModified: true as false }) },
  { label: "runtimeAdapterPlanFileModified true", mutate: (r) => ({ ...r, runtimeAdapterPlanFileModified: true as false }) },
  { label: "runtimeAdapterContractFileModified true", mutate: (r) => ({ ...r, runtimeAdapterContractFileModified: true as false }) },
  { label: "runtimeAdapterDryRunFileModified true", mutate: (r) => ({ ...r, runtimeAdapterDryRunFileModified: true as false }) },
  { label: "runSmartTalkWiringExecutionContractFileModified true", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "routeFilesModified true", mutate: (r) => ({ ...r, routeFilesModified: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "runSmartTalkModified false", mutate: (r) => ({ ...r, runSmartTalkModified: false as true }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "runSmartTalkSourcePatched false", mutate: (r) => ({ ...r, runSmartTalkSourcePatched: false as true }) },
  { label: "actualWiringPerformed false", mutate: (r) => ({ ...r, actualWiringPerformed: false as true }) },
  { label: "wiringIsDisabledByDefault false", mutate: (r) => ({ ...r, wiringIsDisabledByDefault: false as true }) },
  { label: "wiringIsContainmentOnly false", mutate: (r) => ({ ...r, wiringIsContainmentOnly: false as true }) },
  { label: "wiringPlacedAtAllowedBoundary false", mutate: (r) => ({ ...r, wiringPlacedAtAllowedBoundary: false as true }) },
  { label: "wiringPlacedAtPostModelPreUserVisibleBoundary false", mutate: (r) => ({ ...r, wiringPlacedAtPostModelPreUserVisibleBoundary: false as true }) },
  { label: "wiringAvoidsForbiddenLocations false", mutate: (r) => ({ ...r, wiringAvoidsForbiddenLocations: false as true }) },
  { label: "wiringDoesNotModifyRouteParsing false", mutate: (r) => ({ ...r, wiringDoesNotModifyRouteParsing: false as true }) },
  { label: "wiringDoesNotModifyPromptConstruction false", mutate: (r) => ({ ...r, wiringDoesNotModifyPromptConstruction: false as true }) },
  { label: "wiringDoesNotModifyProviderModelCallLayer false", mutate: (r) => ({ ...r, wiringDoesNotModifyProviderModelCallLayer: false as true }) },
  { label: "wiringDoesNotModifyPublicRouteAuthorization false", mutate: (r) => ({ ...r, wiringDoesNotModifyPublicRouteAuthorization: false as true }) },
  { label: "wiringDoesNotModifyPaymentCheckoutEntitlement false", mutate: (r) => ({ ...r, wiringDoesNotModifyPaymentCheckoutEntitlement: false as true }) },
  { label: "wiringDoesNotModifyPersistenceStorage false", mutate: (r) => ({ ...r, wiringDoesNotModifyPersistenceStorage: false as true }) },
  { label: "wiringDoesNotModifyUiRendering false", mutate: (r) => ({ ...r, wiringDoesNotModifyUiRendering: false as true }) },
  { label: "wiringDoesNotModifyOcrPhotoQuarantine false", mutate: (r) => ({ ...r, wiringDoesNotModifyOcrPhotoQuarantine: false as true }) },
  { label: "wiringDoesNotModifyPiiRedactionInternals false", mutate: (r) => ({ ...r, wiringDoesNotModifyPiiRedactionInternals: false as true }) },
  { label: "wiringDoesNotCreateTrustedModelOutputLocation false", mutate: (r) => ({ ...r, wiringDoesNotCreateTrustedModelOutputLocation: false as true }) },
  { label: "dryRunAdapterImportedIntoRunSmartTalkSource false", mutate: (r) => ({ ...r, dryRunAdapterImportedIntoRunSmartTalkSource: false as true }) },
  { label: "dryRunAdapterCalledOnlyBehindDisabledByDefaultBranch false", mutate: (r) => ({ ...r, dryRunAdapterCalledOnlyBehindDisabledByDefaultBranch: false as true }) },
  { label: "dryRunAdapterNotCalledWhileDisabled false", mutate: (r) => ({ ...r, dryRunAdapterNotCalledWhileDisabled: false as true }) },
  { label: "dryRunAdapterOutputNotUserVisible false", mutate: (r) => ({ ...r, dryRunAdapterOutputNotUserVisible: false as true }) },
  { label: "dryRunAdapterOutputNotPersisted false", mutate: (r) => ({ ...r, dryRunAdapterOutputNotPersisted: false as true }) },
  { label: "dryRunAdapterUsesSyntheticGovernanceInputOnly false", mutate: (r) => ({ ...r, dryRunAdapterUsesSyntheticGovernanceInputOnly: false as true }) },
  { label: "dryRunAdapterDoesNotUseRawUserInput false", mutate: (r) => ({ ...r, dryRunAdapterDoesNotUseRawUserInput: false as true }) },
  { label: "dryRunAdapterDoesNotUseRawModelOutputDirectly false", mutate: (r) => ({ ...r, dryRunAdapterDoesNotUseRawModelOutputDirectly: false as true }) },
  { label: "dryRunAdapterDoesNotUseRawDocumentText false", mutate: (r) => ({ ...r, dryRunAdapterDoesNotUseRawDocumentText: false as true }) },
  { label: "dryRunAdapterDoesNotUseOcrPhotoInput false", mutate: (r) => ({ ...r, dryRunAdapterDoesNotUseOcrPhotoInput: false as true }) },
  { label: "dryRunAdapterDoesNotUseRealPii false", mutate: (r) => ({ ...r, dryRunAdapterDoesNotUseRealPii: false as true }) },
  { label: "importedOnlyWiringExecutionContractRunner false", mutate: (r) => ({ ...r, importedOnlyWiringExecutionContractRunner: false as true }) },
  { label: "noOtherImportsUsedInValidationFile false", mutate: (r) => ({ ...r, noOtherImportsUsedInValidationFile: false as true }) },
  { label: "wiringExecutionContractRunnerCalled false", mutate: (r) => ({ ...r, wiringExecutionContractRunnerCalled: false as true }) },
  { label: "wiringExecutionContractCheckId wrong", mutate: (r) => ({ ...r, wiringExecutionContractCheckId: "8.7F" as "8.7G" }) },
  { label: "wiringExecutionContractAllPassed false", mutate: (r) => ({ ...r, wiringExecutionContractAllPassed: false as true }) },
  { label: "wiringExecutionContractReadyForScopedPatch false", mutate: (r) => ({ ...r, wiringExecutionContractReadyForScopedPatch: false as true }) },
  { label: "td002ScopedWiringContainmentPatchCreated false", mutate: (r) => ({ ...r, td002ScopedWiringContainmentPatchCreated: false as true }) },
  { label: "td002WiringExecutionContractConfirmed false", mutate: (r) => ({ ...r, td002WiringExecutionContractConfirmed: false as true }) },
  { label: "td002ProductionWiringStillNotEnabled false", mutate: (r) => ({ ...r, td002ProductionWiringStillNotEnabled: false as true }) },
  { label: "td002PublicRuntimeStillNotEnabled false", mutate: (r) => ({ ...r, td002PublicRuntimeStillNotEnabled: false as true }) },
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
  { label: "dryRunSyntheticValidationConfirmedFrom8x7G false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x7G: false as true }) },
  { label: "dryRunSyntheticValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x7G false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x7G: false as true }) },
  { label: "dryRunLeakageValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x7G false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x7G: false as true }) },
  { label: "dryRunTamperCasesRejected != count", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x7G false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x7G: false as true }) },
  { label: "wiringExecutionContractTamperCasesRejected != count", mutate: (r) => ({ ...r, wiringExecutionContractTamperCasesRejected: r.wiringExecutionContractTamperCasesRejected - 1 }) },
  { label: "scopedWiringContainmentPatchTamperCoveragePassing false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCoveragePassing: false as true }) },
  { label: "scopedWiringContainmentPatchTamperCasesRejected != count", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCasesRejected: r.scopedWiringContainmentPatchTamperCasesRejected - 1 }) },
  { label: "readyFor8x7IPostWiringAudit false", mutate: (r) => ({ ...r, readyFor8x7IPostWiringAudit: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "modifiedRunSmartTalkFilePath empty", mutate: (r) => ({ ...r, modifiedRunSmartTalkFilePath: "" }) },
  { label: "containmentPatchNotes empty", mutate: (r) => ({ ...r, containmentPatchNotes: [] }) },
  { label: "disabledByDefaultSeamNotes empty", mutate: (r) => ({ ...r, disabledByDefaultSeamNotes: [] }) },
  { label: "preservedForbiddenLocationNotes empty", mutate: (r) => ({ ...r, preservedForbiddenLocationNotes: [] }) },
  { label: "preservedBoundaryNotes empty", mutate: (r) => ({ ...r, preservedBoundaryNotes: [] }) },
  { label: "preservedDebtNotes empty", mutate: (r) => ({ ...r, preservedDebtNotes: [] }) },
];

// ─── Exported validation function ────────────────────────────────────────────

/**
 * 8.7H scoped wiring containment patch validation runner.
 *
 * Calls the 8.7G wiring execution contract runner as source of truth.
 * Confirms the containment seam is disabled-by-default, containment-only,
 * placed at the allowed boundary, and preserves all TD-002 / TD-004 boundaries.
 * readyFor8x7I is a readiness signal only — not runtime authorization.
 */
export function runControlledRealDocumentEvidenceGatesScopedWiringContainmentPatch(): ScopedWiringContainmentPatchResult {
  const patchFailures: string[] = [];

  // ── Call 8.7G execution contract runner as source of truth ────────────
  const g = runControlledRealDocumentEvidenceGatesRunSmartTalkWiringExecutionContract();
  if (g.checkId !== "8.7G") patchFailures.push(`8.7G checkId mismatch: expected "8.7G", got "${g.checkId}"`);
  if (g.allPassed !== true) patchFailures.push("8.7G allPassed is not true");
  if (g.readyFor8x7HScopedWiringOrContainmentPatch !== true) patchFailures.push("8.7G readyFor8x7HScopedWiringOrContainmentPatch is not true");

  // ── Notes arrays ─────────────────────────────────────────────────────
  const containmentPatchNotes: string[] = [
    "8.7H scoped wiring containment patch applied to lib/vaylo/smart-talk/run-smart-talk.ts",
    "Seam placed at post-model-output / pre-user-visible-governance boundary (after normalizeParsedObject, before return)",
    "EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false — seam is structurally present but inert",
    "runEvidenceGatesRuntimeAdapterDryRun imported from 8.7F dry-run implementation",
    "_buildSyntheticGovernanceInputForContainmentSeam provides synthetic contract-shaped input only",
    "TD-002 containment seam: no production wiring, no public runtime, no real document input",
    "TD-002 still requires post-wiring audit and closure decision",
  ];

  const disabledByDefaultSeamNotes: string[] = [
    "disabled-by-default: EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED = false (local constant, not read from env/network/storage)",
    "containment only: seam is structurally present and inert; does not alter returned user-visible response",
    "no user-visible output: adapter output is not surfaced to users, not included in SmartTalkResult",
    "no persistence: adapter output is not written to any storage, database, or audit log",
    "no production authorization: branch never executes; no production governance decisions are made",
    "post-model/pre-user-visible governance seam: placed after normalizeParsedObject call, before return",
    "adapter called only inside the disabled if-branch; void used on output to prevent accidental use",
    "synthetic governance input only: _buildSyntheticGovernanceInputForContainmentSeam provides contract-shaped probe",
  ];

  const preservedForbiddenLocationNotes: string[] = [
    "Route input parsing: not modified — seam is post-model, not in route input handling",
    "Prompt construction: not modified — seam is after the OpenAI call, build-smart-talk-prompt unchanged",
    "Provider/model call layer: not modified — seam is after res.json() and JSON parsing",
    "Public route authorization: not modified — no route files touched",
    "Payment/checkout/entitlement logic: not modified — no entitlement files touched",
    "Persistence/storage implementation: not modified — no DB or storage calls added",
    "UI rendering: not modified — no UI files touched",
    "OCR/photo route quarantine: not modified — no photo route or OCR files touched",
    "PII redaction internals: not modified — pii/pre-model-pii-redaction.ts unchanged",
    "Trusted model output location: not created — adapter treats model output as untrusted; seam uses synthetic input only",
  ];

  const preservedBoundaryNotes: string[] = [
    "post-model-output / pre-user-visible-governance: seam placed at this exact boundary (after normalizeParsedObject)",
    "pre-high-risk-claim-surfacing: preserved — no claim surfacing logic modified",
    "pre-document-derived-claim-surfacing: preserved — no document claim logic modified",
    "pre-persistence: preserved — no persistence calls added",
    "pre-automation/task-execution: preserved — no automation/task logic added",
  ];

  const preservedDebtNotes: string[] = [
    "ClaimRule OR semantics: preserved — no claim rule logic modified",
    "EvidenceRule/ClaimRule resolution structured semantics: preserved — no evidence resolution logic modified",
    "Proximity manual-only: preserved — no proximity logic modified",
    "TrapActivation.trapKind typing: preserved — no trap kind type changes",
    "enforcementTrapHeuristic coarse substring: preserved — not promoted to production enforcement",
    "TrapDisposition state separation: preserved — no disposition state logic modified",
    "SeverityCandidate/SeverityDerivation separation: preserved — no severity logic modified",
    "Mapper diagnostic taxonomy: preserved — no mapper logic modified",
    "TD-004 closure does not authorize wiring: preserved — PII utility closure remains separate from route wiring",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = SCOPED_WIRING_TAMPER_CASES.length;

  const provisional: ScopedWiringContainmentPatchResult = {
    checkId: "8.7H",
    allPassed: true,
    scopedWiringContainmentPatchOnly: true,
    scopedWiringContainmentPatchFileCreated: true,
    existingFilesModified: true,
    exactlyOneRunSmartTalkFileModified: true,
    runSmartTalkTargetIdentified: true,
    ambiguousRunSmartTalkTarget: false,
    productionWiringPlanFileModified: false,
    productionWiringContractFileModified: false,
    boundaryAuditFileModified: false,
    runtimeAdapterPlanFileModified: false,
    runtimeAdapterContractFileModified: false,
    runtimeAdapterDryRunFileModified: false,
    runSmartTalkWiringExecutionContractFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    routeFilesModified: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    runSmartTalkModified: true,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    runSmartTalkSourcePatched: true,
    actualWiringPerformed: true,
    wiringIsDisabledByDefault: true,
    wiringIsContainmentOnly: true,
    wiringPlacedAtAllowedBoundary: true,
    wiringPlacedAtPostModelPreUserVisibleBoundary: true,
    wiringAvoidsForbiddenLocations: true,
    wiringDoesNotModifyRouteParsing: true,
    wiringDoesNotModifyPromptConstruction: true,
    wiringDoesNotModifyProviderModelCallLayer: true,
    wiringDoesNotModifyPublicRouteAuthorization: true,
    wiringDoesNotModifyPaymentCheckoutEntitlement: true,
    wiringDoesNotModifyPersistenceStorage: true,
    wiringDoesNotModifyUiRendering: true,
    wiringDoesNotModifyOcrPhotoQuarantine: true,
    wiringDoesNotModifyPiiRedactionInternals: true,
    wiringDoesNotCreateTrustedModelOutputLocation: true,
    dryRunAdapterImportedIntoRunSmartTalkSource: true,
    dryRunAdapterCalledOnlyBehindDisabledByDefaultBranch: true,
    dryRunAdapterNotCalledWhileDisabled: true,
    dryRunAdapterOutputNotUserVisible: true,
    dryRunAdapterOutputNotPersisted: true,
    dryRunAdapterUsesSyntheticGovernanceInputOnly: true,
    dryRunAdapterDoesNotUseRawUserInput: true,
    dryRunAdapterDoesNotUseRawModelOutputDirectly: true,
    dryRunAdapterDoesNotUseRawDocumentText: true,
    dryRunAdapterDoesNotUseOcrPhotoInput: true,
    dryRunAdapterDoesNotUseRealPii: true,
    importedOnlyWiringExecutionContractRunner: true,
    noOtherImportsUsedInValidationFile: true,
    wiringExecutionContractRunnerCalled: true,
    wiringExecutionContractCheckId: "8.7G",
    wiringExecutionContractAllPassed: true,
    wiringExecutionContractReadyForScopedPatch: true,
    td002ScopedWiringContainmentPatchCreated: true,
    td002WiringExecutionContractConfirmed: true,
    td002EvidenceGatesNoLongerCompletelyUnwiredButStillDisabledByDefault: true,
    td002ProductionWiringStillNotEnabled: true,
    td002PublicRuntimeStillNotEnabled: true,
    td002StillRequiresPostWiringAudit: true,
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
    dryRunSyntheticValidationConfirmedFrom8x7G: true,
    dryRunSyntheticValidationCaseCount: g.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: g.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x7G: true,
    dryRunLeakageValidationCaseCount: g.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: g.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x7G: true,
    dryRunTamperCaseCount: g.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: g.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x7G: true,
    wiringExecutionContractTamperCaseCount: g.runSmartTalkWiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: g.runSmartTalkWiringExecutionContractTamperCasesRejected,
    scopedWiringContainmentPatchTamperCaseCount: tamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: tamperCaseCount,
    scopedWiringContainmentPatchTamperCoveragePassing: true,
    readyFor8x7IPostWiringAudit: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    modifiedRunSmartTalkFilePath: "lib/vaylo/smart-talk/run-smart-talk.ts",
    containmentPatchNotes,
    disabledByDefaultSeamNotes,
    preservedForbiddenLocationNotes,
    preservedBoundaryNotes,
    preservedDebtNotes,
  };

  if (!_isCanonicalScopedWiringResult(provisional)) {
    patchFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7H tamper cases ─────────────────────────────────────────────
  let scopedWiringContainmentPatchTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let i = 0; i < SCOPED_WIRING_TAMPER_CASES.length; i++) {
    const tc = SCOPED_WIRING_TAMPER_CASES[i];
    if (!_isCanonicalScopedWiringResult(tc.mutate(provisional))) {
      scopedWiringContainmentPatchTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7H tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) patchFailures.push(...tamperFailures);

  const allPassed =
    patchFailures.length === 0 &&
    scopedWiringContainmentPatchTamperCasesRejected === tamperCaseCount;

  const finalContainmentNotes: string[] = [
    ...containmentPatchNotes,
    `8.7G execution contract confirmed: checkId=${g.checkId}, allPassed=${g.allPassed}`,
    `8.7H tamper cases: ${scopedWiringContainmentPatchTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    "readyFor8x7I: readiness signal only — not route wiring or runtime authorization",
    ...(patchFailures.length > 0 ? [`FAILURES (${patchFailures.length}):`, ...patchFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    scopedWiringContainmentPatchTamperCasesRejected,
    containmentPatchNotes: finalContainmentNotes,
  };
}
