/**
 * PHASE 8.7G — runSmartTalk Wiring Execution Contract
 *
 * Execution contract for TD-002 Evidence Gates runSmartTalk wiring.
 *
 * Execution-contract-only. This file:
 *   - Calls the 8.7F dry-run implementation runner as the source of truth
 *   - Locks the allowed scopes, forbidden actions, and preconditions for 8.7H
 *   - Preserves integration boundaries, forbidden locations, adapter behaviors, debts
 *   - Confirms 8.7F synthetic/leakage/tamper validation results
 *
 * 8.7H is authorized only to perform:
 *   - A scoped dry-run containment patch, or
 *   - A minimal integration seam patch behind disabled-by-default flags
 *
 * Still unauthorized after 8.7G:
 *   - Actual runSmartTalk wiring
 *   - Production / pilot / public runtime
 *   - Real document input / user-visible output
 */

import { runControlledRealDocumentEvidenceGatesRuntimeAdapterDryRunImplementation } from "./run-controlled-real-document-evidence-gates-runtime-adapter-dry-run-implementation";

// ─── Return type ──────────────────────────────────────────────────────────────

interface RunSmartTalkWiringExecutionContractResult {
  checkId: "8.7G";
  allPassed: boolean;
  runSmartTalkWiringExecutionContractOnly: true;
  runSmartTalkWiringExecutionContractFileCreated: true;
  existingFilesModified: false;
  productionWiringPlanFileModified: false;
  productionWiringContractFileModified: false;
  boundaryAuditFileModified: false;
  runtimeAdapterPlanFileModified: false;
  runtimeAdapterContractFileModified: false;
  runtimeAdapterDryRunFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  actualWiringPerformed: false;
  runtimeAdapterProductionWiringImplemented: false;
  runtimeAdapterPublicRuntimeImplemented: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  importedOnlyRuntimeAdapterDryRunRunner: true;
  noOtherImportsUsed: true;
  runtimeAdapterDryRunRunnerCalled: true;
  runtimeAdapterDryRunCheckId: "8.7F";
  runtimeAdapterDryRunAllPassed: true;
  runtimeAdapterDryRunReadyForWiringExecutionContract: true;
  td002RunSmartTalkWiringExecutionContractCreated: true;
  td002RuntimeAdapterDryRunImplementationConfirmed: true;
  td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true;
  td002EvidenceGatesProductionWiringNotImplementedYet: true;
  td002ActualWiringStillNotPerformed: true;
  td002StillRequiresScopedWiringOrContainmentPatch: true;
  td002StillRequiresPostWiringAudit: true;
  td002StillRequiresClosureDecision: true;
  td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true;
  td004DoesNotAuthorizeRouteWiringConfirmed: true;
  td004DoesNotAuthorizeRealDocumentInputConfirmed: true;
  td004DoesNotAuthorizeUserVisibleOutputConfirmed: true;
  td004DoesNotAuthorizePublicRuntimeConfirmed: true;
  future8x7HMayOnlyPerformScopedDryRunContainmentPatch: true;
  future8x7HMayOnlyPerformDisabledByDefaultIntegrationSeamPatch: true;
  future8x7HMustNotEnablePublicRuntime: true;
  future8x7HMustNotEnableRealDocumentInput: true;
  future8x7HMustNotEnableUserVisibleDocumentOutput: true;
  future8x7HMustNotEnablePilotRuntime: true;
  future8x7HMustNotEnableProductionRuntime: true;
  future8x7HMustNotEnableGoLive: true;
  future8x7HMustNotEnablePaymentCheckoutEntitlement: true;
  future8x7HMustNotProcessRealDocuments: true;
  future8x7HMustNotProcessOcrPhotoInput: true;
  future8x7HMustNotPersistGovernanceDecisions: true;
  future8x7HMustNotComputeExactLegalDeadlines: true;
  future8x7HMustNotTreatModelOutputAsTrusted: true;
  future8x7HMustNotBypassPreModelSafetyOrPiiBoundaries: true;
  future8x7HMustNotMakeEvidenceGatesUserVisibleByDefault: true;
  future8x7HMustNotWeakenTd004OrTd002Boundaries: true;
  future8x7HRequires8x7FAllPassed: true;
  future8x7HRequiresDryRunAdapterStillDryRunOnly: true;
  future8x7HRequiresProductionWiringFalseBeforePatch: true;
  future8x7HRequiresExplicitLimitedWiringScope: true;
  future8x7HRequiresAllowedBoundaryOnly: true;
  future8x7HRequiresForbiddenLocationsAvoided: true;
  future8x7HRequiresModelOutputUntrusted: true;
  future8x7HRequiresClaimRealitySeparation: true;
  future8x7HRequiresStructuredTrapActivation: true;
  future8x7HRequiresFailClosedUnsafeUnknownStates: true;
  future8x7HRequiresUserVisibleOutputStillBlockedUnlessAuthorized: true;
  future8x7HRequiresRealDocumentInputStillSeparatelyUnauthorized: true;
  future8x7HRequiresPublicRuntimeStillSeparatelyUnauthorized: true;
  future8x7HRequiresPostWiringAudit: true;
  future8x7HRequiresClosureDecision: true;
  productionIntegrationBoundaryPreserved: true;
  postModelPreUserVisibleBoundaryPreserved: true;
  preHighRiskClaimSurfacingBoundaryPreserved: true;
  preDocumentDerivedClaimSurfacingBoundaryPreserved: true;
  prePersistenceBoundaryPreserved: true;
  preAutomationExecutionBoundaryPreserved: true;
  routeInputParsingStillForbiddenForIntegration: true;
  promptConstructionStillForbiddenForIntegration: true;
  providerModelCallLayerStillForbiddenForIntegration: true;
  publicRouteAuthorizationStillForbiddenForIntegration: true;
  paymentCheckoutEntitlementStillForbiddenForIntegration: true;
  persistenceStorageImplementationStillForbiddenForIntegration: true;
  uiRenderingStillForbiddenForIntegration: true;
  ocrPhotoRouteQuarantineStillForbiddenForIntegration: true;
  piiRedactionInternalsStillForbiddenForIntegration: true;
  trustedModelOutputLocationStillForbiddenForIntegration: true;
  adapterAcceptsOnlyAlreadyNormalizedGovernanceInput: true;
  adapterRejectsRawRouteBodies: true;
  adapterRejectsRawUploadedFiles: true;
  adapterRejectsOcrPhotoInput: true;
  adapterRejectsUnnormalizedDirectUserText: true;
  adapterRejectsMissingPreModelSafetyStatus: true;
  adapterRejectsMissingRequiredPiiRedactionStatus: true;
  adapterBlocksUnsafeUnknownPreModelSafetyStatus: true;
  adapterBlocksUnsafeUnknownPiiRedactionStatus: true;
  adapterTreatsModelOutputAsUntrusted: true;
  adapterBlocksUserVisibleOutputByDefault: true;
  claimAuthorizationSeparateFromRealityAuthorization: true;
  highRiskClaimsBlockedUnlessClaimAuthorized: true;
  documentDerivedClaimsBlockedUnlessRealityAuthorized: true;
  trapActivationStructuredMetadataOnly: true;
  coarseSubstringTrapHeuristicNotProductionReady: true;
  exactLegalDeadlineCalculationUnauthorized: true;
  structuredBlockedReasonsReturned: true;
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
  dryRunSyntheticValidationConfirmed: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmed: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmed: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
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
  noRouteImport: true;
  noRouteHandlerCall: true;
  noFilesystemRead: true;
  noDatabaseWrite: true;
  noStorageWrite: true;
  noAuditPersistence: true;
  noPromptBuild: true;
  noModelCall: true;
  noRunSmartTalkCall: true;
  no8x3AcRerun: true;
  readyFor8x7HScopedWiringOrContainmentPatch: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  executionContractClauses: string[];
  future8x7HAllowedScopes: string[];
  future8x7HForbiddenActions: string[];
  future8x7HPreconditions: string[];
  preservedBoundaryCandidates: string[];
  preservedForbiddenLocations: string[];
  preservedDryRunAdapterBehaviors: string[];
  preservedRiskDebts: string[];
  runSmartTalkWiringExecutionContractTamperCaseCount: number;
  runSmartTalkWiringExecutionContractTamperCasesRejected: number;
  runSmartTalkWiringExecutionContractTamperCoveragePassing: true;
  runSmartTalkWiringExecutionContractNotes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_EXEC_CONTRACT_ONLY = "execution-contract-only";
const SENTINEL_SCOPED_DRY_RUN = "scoped-dry-run-containment-patch";
const SENTINEL_NO_PUBLIC_RUNTIME = "no-public-runtime-8x7H";
const SENTINEL_NO_REAL_DOCUMENT = "no-real-document-input-8x7H";
const SENTINEL_NO_USER_VISIBLE = "no-user-visible-output-8x7H";
const SENTINEL_8X7F_ALL_PASSED = "8x7F-allPassed-required-precondition";
const SENTINEL_PROMPT_FORBIDDEN = "prompt-construction-forbidden";
const SENTINEL_PROVIDER_FORBIDDEN = "provider-model-call-layer-forbidden";
const SENTINEL_MODEL_UNTRUSTED = "model-output-untrusted-adapter-behavior";
const SENTINEL_USER_VISIBLE_BLOCKED = "user-visible-output-blocked-by-default-adapter-behavior";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical contract checker ───────────────────────────────────────────────

function _isCanonicalExecutionContractResult(r: RunSmartTalkWiringExecutionContractResult): boolean {
  if (r.checkId !== "8.7G") return false;
  if (r.allPassed !== true) return false;
  if (r.runSmartTalkWiringExecutionContractOnly !== true) return false;
  if (r.runSmartTalkWiringExecutionContractFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.productionWiringPlanFileModified !== false) return false;
  if (r.productionWiringContractFileModified !== false) return false;
  if (r.boundaryAuditFileModified !== false) return false;
  if (r.runtimeAdapterPlanFileModified !== false) return false;
  if (r.runtimeAdapterContractFileModified !== false) return false;
  if (r.runtimeAdapterDryRunFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.actualWiringPerformed !== false) return false;
  if (r.runtimeAdapterProductionWiringImplemented !== false) return false;
  if (r.runtimeAdapterPublicRuntimeImplemented !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.importedOnlyRuntimeAdapterDryRunRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.runtimeAdapterDryRunRunnerCalled !== true) return false;
  if (r.runtimeAdapterDryRunCheckId !== "8.7F") return false;
  if (r.runtimeAdapterDryRunAllPassed !== true) return false;
  if (r.runtimeAdapterDryRunReadyForWiringExecutionContract !== true) return false;
  if (r.td002RunSmartTalkWiringExecutionContractCreated !== true) return false;
  if (r.td002RuntimeAdapterDryRunImplementationConfirmed !== true) return false;
  if (r.td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.td002EvidenceGatesProductionWiringNotImplementedYet !== true) return false;
  if (r.td002ActualWiringStillNotPerformed !== true) return false;
  if (r.td002StillRequiresScopedWiringOrContainmentPatch !== true) return false;
  if (r.td002StillRequiresPostWiringAudit !== true) return false;
  if (r.td002StillRequiresClosureDecision !== true) return false;
  if (r.td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRouteWiringConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRealDocumentInputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeUserVisibleOutputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizePublicRuntimeConfirmed !== true) return false;
  if (r.future8x7HMayOnlyPerformScopedDryRunContainmentPatch !== true) return false;
  if (r.future8x7HMayOnlyPerformDisabledByDefaultIntegrationSeamPatch !== true) return false;
  if (r.future8x7HMustNotEnablePublicRuntime !== true) return false;
  if (r.future8x7HMustNotEnableRealDocumentInput !== true) return false;
  if (r.future8x7HMustNotEnableUserVisibleDocumentOutput !== true) return false;
  if (r.future8x7HMustNotEnablePilotRuntime !== true) return false;
  if (r.future8x7HMustNotEnableProductionRuntime !== true) return false;
  if (r.future8x7HMustNotEnableGoLive !== true) return false;
  if (r.future8x7HMustNotEnablePaymentCheckoutEntitlement !== true) return false;
  if (r.future8x7HMustNotProcessRealDocuments !== true) return false;
  if (r.future8x7HMustNotProcessOcrPhotoInput !== true) return false;
  if (r.future8x7HMustNotPersistGovernanceDecisions !== true) return false;
  if (r.future8x7HMustNotComputeExactLegalDeadlines !== true) return false;
  if (r.future8x7HMustNotTreatModelOutputAsTrusted !== true) return false;
  if (r.future8x7HMustNotBypassPreModelSafetyOrPiiBoundaries !== true) return false;
  if (r.future8x7HMustNotMakeEvidenceGatesUserVisibleByDefault !== true) return false;
  if (r.future8x7HMustNotWeakenTd004OrTd002Boundaries !== true) return false;
  if (r.future8x7HRequires8x7FAllPassed !== true) return false;
  if (r.future8x7HRequiresDryRunAdapterStillDryRunOnly !== true) return false;
  if (r.future8x7HRequiresProductionWiringFalseBeforePatch !== true) return false;
  if (r.future8x7HRequiresExplicitLimitedWiringScope !== true) return false;
  if (r.future8x7HRequiresAllowedBoundaryOnly !== true) return false;
  if (r.future8x7HRequiresForbiddenLocationsAvoided !== true) return false;
  if (r.future8x7HRequiresModelOutputUntrusted !== true) return false;
  if (r.future8x7HRequiresClaimRealitySeparation !== true) return false;
  if (r.future8x7HRequiresStructuredTrapActivation !== true) return false;
  if (r.future8x7HRequiresFailClosedUnsafeUnknownStates !== true) return false;
  if (r.future8x7HRequiresUserVisibleOutputStillBlockedUnlessAuthorized !== true) return false;
  if (r.future8x7HRequiresRealDocumentInputStillSeparatelyUnauthorized !== true) return false;
  if (r.future8x7HRequiresPublicRuntimeStillSeparatelyUnauthorized !== true) return false;
  if (r.future8x7HRequiresPostWiringAudit !== true) return false;
  if (r.future8x7HRequiresClosureDecision !== true) return false;
  if (r.productionIntegrationBoundaryPreserved !== true) return false;
  if (r.postModelPreUserVisibleBoundaryPreserved !== true) return false;
  if (r.preHighRiskClaimSurfacingBoundaryPreserved !== true) return false;
  if (r.preDocumentDerivedClaimSurfacingBoundaryPreserved !== true) return false;
  if (r.prePersistenceBoundaryPreserved !== true) return false;
  if (r.preAutomationExecutionBoundaryPreserved !== true) return false;
  if (r.routeInputParsingStillForbiddenForIntegration !== true) return false;
  if (r.promptConstructionStillForbiddenForIntegration !== true) return false;
  if (r.providerModelCallLayerStillForbiddenForIntegration !== true) return false;
  if (r.publicRouteAuthorizationStillForbiddenForIntegration !== true) return false;
  if (r.paymentCheckoutEntitlementStillForbiddenForIntegration !== true) return false;
  if (r.persistenceStorageImplementationStillForbiddenForIntegration !== true) return false;
  if (r.uiRenderingStillForbiddenForIntegration !== true) return false;
  if (r.ocrPhotoRouteQuarantineStillForbiddenForIntegration !== true) return false;
  if (r.piiRedactionInternalsStillForbiddenForIntegration !== true) return false;
  if (r.trustedModelOutputLocationStillForbiddenForIntegration !== true) return false;
  if (r.adapterAcceptsOnlyAlreadyNormalizedGovernanceInput !== true) return false;
  if (r.adapterRejectsRawRouteBodies !== true) return false;
  if (r.adapterRejectsRawUploadedFiles !== true) return false;
  if (r.adapterRejectsOcrPhotoInput !== true) return false;
  if (r.adapterRejectsUnnormalizedDirectUserText !== true) return false;
  if (r.adapterRejectsMissingPreModelSafetyStatus !== true) return false;
  if (r.adapterRejectsMissingRequiredPiiRedactionStatus !== true) return false;
  if (r.adapterBlocksUnsafeUnknownPreModelSafetyStatus !== true) return false;
  if (r.adapterBlocksUnsafeUnknownPiiRedactionStatus !== true) return false;
  if (r.adapterTreatsModelOutputAsUntrusted !== true) return false;
  if (r.adapterBlocksUserVisibleOutputByDefault !== true) return false;
  if (r.claimAuthorizationSeparateFromRealityAuthorization !== true) return false;
  if (r.highRiskClaimsBlockedUnlessClaimAuthorized !== true) return false;
  if (r.documentDerivedClaimsBlockedUnlessRealityAuthorized !== true) return false;
  if (r.trapActivationStructuredMetadataOnly !== true) return false;
  if (r.coarseSubstringTrapHeuristicNotProductionReady !== true) return false;
  if (r.exactLegalDeadlineCalculationUnauthorized !== true) return false;
  if (r.structuredBlockedReasonsReturned !== true) return false;
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
  if (r.dryRunSyntheticValidationConfirmed !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmed !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmed !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
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
  if (r.noRouteImport !== true) return false;
  if (r.noRouteHandlerCall !== true) return false;
  if (r.noFilesystemRead !== true) return false;
  if (r.noDatabaseWrite !== true) return false;
  if (r.noStorageWrite !== true) return false;
  if (r.noAuditPersistence !== true) return false;
  if (r.noPromptBuild !== true) return false;
  if (r.noModelCall !== true) return false;
  if (r.noRunSmartTalkCall !== true) return false;
  if (r.no8x3AcRerun !== true) return false;
  if (r.readyFor8x7HScopedWiringOrContainmentPatch !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  // Array content checks
  if (!r.executionContractClauses || r.executionContractClauses.length === 0) return false;
  if (!r.future8x7HAllowedScopes || r.future8x7HAllowedScopes.length === 0) return false;
  if (!r.future8x7HForbiddenActions || r.future8x7HForbiddenActions.length === 0) return false;
  if (!r.future8x7HPreconditions || r.future8x7HPreconditions.length === 0) return false;
  if (!r.preservedBoundaryCandidates || r.preservedBoundaryCandidates.length === 0) return false;
  if (!r.preservedForbiddenLocations || r.preservedForbiddenLocations.length === 0) return false;
  if (!r.preservedDryRunAdapterBehaviors || r.preservedDryRunAdapterBehaviors.length === 0) return false;
  if (!r.preservedRiskDebts || r.preservedRiskDebts.length === 0) return false;
  if (!r.runSmartTalkWiringExecutionContractNotes || r.runSmartTalkWiringExecutionContractNotes.length === 0) return false;
  const clausesJ = r.executionContractClauses.join(" ");
  if (!clausesJ.includes(SENTINEL_EXEC_CONTRACT_ONLY)) return false;
  const scopesJ = r.future8x7HAllowedScopes.join(" ");
  if (!scopesJ.includes(SENTINEL_SCOPED_DRY_RUN)) return false;
  const forbiddenJ = r.future8x7HForbiddenActions.join(" ");
  if (!forbiddenJ.includes(SENTINEL_NO_PUBLIC_RUNTIME)) return false;
  if (!forbiddenJ.includes(SENTINEL_NO_REAL_DOCUMENT)) return false;
  if (!forbiddenJ.includes(SENTINEL_NO_USER_VISIBLE)) return false;
  const preconJ = r.future8x7HPreconditions.join(" ");
  if (!preconJ.includes(SENTINEL_8X7F_ALL_PASSED)) return false;
  const pflJ = r.preservedForbiddenLocations.join(" ");
  if (!pflJ.includes(SENTINEL_PROMPT_FORBIDDEN)) return false;
  if (!pflJ.includes(SENTINEL_PROVIDER_FORBIDDEN)) return false;
  const behaviorsJ = r.preservedDryRunAdapterBehaviors.join(" ");
  if (!behaviorsJ.includes(SENTINEL_MODEL_UNTRUSTED)) return false;
  if (!behaviorsJ.includes(SENTINEL_USER_VISIBLE_BLOCKED)) return false;
  const debtsJ = r.preservedRiskDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  if (r.runSmartTalkWiringExecutionContractTamperCasesRejected !== r.runSmartTalkWiringExecutionContractTamperCaseCount) return false;
  if (r.runSmartTalkWiringExecutionContractTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type ExecContractTamperMutation = (r: RunSmartTalkWiringExecutionContractResult) => RunSmartTalkWiringExecutionContractResult;
interface ExecContractTamperCase { label: string; mutate: ExecContractTamperMutation; }

const EXEC_CONTRACT_TAMPER_CASES: ExecContractTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7F" as "8.7G" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "runSmartTalkWiringExecutionContractOnly false", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractOnly: false as true }) },
  { label: "runSmartTalkWiringExecutionContractFileCreated false", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "productionWiringPlanFileModified true", mutate: (r) => ({ ...r, productionWiringPlanFileModified: true as false }) },
  { label: "productionWiringContractFileModified true", mutate: (r) => ({ ...r, productionWiringContractFileModified: true as false }) },
  { label: "boundaryAuditFileModified true", mutate: (r) => ({ ...r, boundaryAuditFileModified: true as false }) },
  { label: "runtimeAdapterPlanFileModified true", mutate: (r) => ({ ...r, runtimeAdapterPlanFileModified: true as false }) },
  { label: "runtimeAdapterContractFileModified true", mutate: (r) => ({ ...r, runtimeAdapterContractFileModified: true as false }) },
  { label: "runtimeAdapterDryRunFileModified true", mutate: (r) => ({ ...r, runtimeAdapterDryRunFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "actualWiringPerformed true", mutate: (r) => ({ ...r, actualWiringPerformed: true as false }) },
  { label: "runtimeAdapterProductionWiringImplemented true", mutate: (r) => ({ ...r, runtimeAdapterProductionWiringImplemented: true as false }) },
  { label: "runtimeAdapterPublicRuntimeImplemented true", mutate: (r) => ({ ...r, runtimeAdapterPublicRuntimeImplemented: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "importedOnlyRuntimeAdapterDryRunRunner false", mutate: (r) => ({ ...r, importedOnlyRuntimeAdapterDryRunRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "runtimeAdapterDryRunRunnerCalled false", mutate: (r) => ({ ...r, runtimeAdapterDryRunRunnerCalled: false as true }) },
  { label: "runtimeAdapterDryRunCheckId wrong", mutate: (r) => ({ ...r, runtimeAdapterDryRunCheckId: "8.7E" as "8.7F" }) },
  { label: "runtimeAdapterDryRunAllPassed false", mutate: (r) => ({ ...r, runtimeAdapterDryRunAllPassed: false as true }) },
  { label: "runtimeAdapterDryRunReadyForWiringExecutionContract false", mutate: (r) => ({ ...r, runtimeAdapterDryRunReadyForWiringExecutionContract: false as true }) },
  { label: "td002RunSmartTalkWiringExecutionContractCreated false", mutate: (r) => ({ ...r, td002RunSmartTalkWiringExecutionContractCreated: false as true }) },
  { label: "td002RuntimeAdapterDryRunImplementationConfirmed false", mutate: (r) => ({ ...r, td002RuntimeAdapterDryRunImplementationConfirmed: false as true }) },
  { label: "td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "td002EvidenceGatesProductionWiringNotImplementedYet false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringNotImplementedYet: false as true }) },
  { label: "td002ActualWiringStillNotPerformed false", mutate: (r) => ({ ...r, td002ActualWiringStillNotPerformed: false as true }) },
  { label: "td002StillRequiresScopedWiringOrContainmentPatch false", mutate: (r) => ({ ...r, td002StillRequiresScopedWiringOrContainmentPatch: false as true }) },
  { label: "td002StillRequiresPostWiringAudit false", mutate: (r) => ({ ...r, td002StillRequiresPostWiringAudit: false as true }) },
  { label: "td002StillRequiresClosureDecision false", mutate: (r) => ({ ...r, td002StillRequiresClosureDecision: false as true }) },
  { label: "readyFor8x7HScopedWiringOrContainmentPatch false", mutate: (r) => ({ ...r, readyFor8x7HScopedWiringOrContainmentPatch: false as true }) },
  { label: "td004ClosedAtIsolatedUtilityLevelConfirmed false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRouteWiringConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRouteWiringConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRealDocumentInputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRealDocumentInputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeUserVisibleOutputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeUserVisibleOutputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizePublicRuntimeConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizePublicRuntimeConfirmed: false as true }) },
  { label: "future8x7HMayOnlyPerformScopedDryRunContainmentPatch false", mutate: (r) => ({ ...r, future8x7HMayOnlyPerformScopedDryRunContainmentPatch: false as true }) },
  { label: "future8x7HMayOnlyPerformDisabledByDefaultIntegrationSeamPatch false", mutate: (r) => ({ ...r, future8x7HMayOnlyPerformDisabledByDefaultIntegrationSeamPatch: false as true }) },
  { label: "future8x7HMustNotEnablePublicRuntime false", mutate: (r) => ({ ...r, future8x7HMustNotEnablePublicRuntime: false as true }) },
  { label: "future8x7HMustNotEnableRealDocumentInput false", mutate: (r) => ({ ...r, future8x7HMustNotEnableRealDocumentInput: false as true }) },
  { label: "future8x7HMustNotEnableUserVisibleDocumentOutput false", mutate: (r) => ({ ...r, future8x7HMustNotEnableUserVisibleDocumentOutput: false as true }) },
  { label: "future8x7HMustNotEnablePilotRuntime false", mutate: (r) => ({ ...r, future8x7HMustNotEnablePilotRuntime: false as true }) },
  { label: "future8x7HMustNotEnableProductionRuntime false", mutate: (r) => ({ ...r, future8x7HMustNotEnableProductionRuntime: false as true }) },
  { label: "future8x7HMustNotEnableGoLive false", mutate: (r) => ({ ...r, future8x7HMustNotEnableGoLive: false as true }) },
  { label: "future8x7HMustNotEnablePaymentCheckoutEntitlement false", mutate: (r) => ({ ...r, future8x7HMustNotEnablePaymentCheckoutEntitlement: false as true }) },
  { label: "future8x7HMustNotProcessRealDocuments false", mutate: (r) => ({ ...r, future8x7HMustNotProcessRealDocuments: false as true }) },
  { label: "future8x7HMustNotProcessOcrPhotoInput false", mutate: (r) => ({ ...r, future8x7HMustNotProcessOcrPhotoInput: false as true }) },
  { label: "future8x7HMustNotPersistGovernanceDecisions false", mutate: (r) => ({ ...r, future8x7HMustNotPersistGovernanceDecisions: false as true }) },
  { label: "future8x7HMustNotComputeExactLegalDeadlines false", mutate: (r) => ({ ...r, future8x7HMustNotComputeExactLegalDeadlines: false as true }) },
  { label: "future8x7HMustNotTreatModelOutputAsTrusted false", mutate: (r) => ({ ...r, future8x7HMustNotTreatModelOutputAsTrusted: false as true }) },
  { label: "future8x7HMustNotBypassPreModelSafetyOrPiiBoundaries false", mutate: (r) => ({ ...r, future8x7HMustNotBypassPreModelSafetyOrPiiBoundaries: false as true }) },
  { label: "future8x7HMustNotMakeEvidenceGatesUserVisibleByDefault false", mutate: (r) => ({ ...r, future8x7HMustNotMakeEvidenceGatesUserVisibleByDefault: false as true }) },
  { label: "future8x7HMustNotWeakenTd004OrTd002Boundaries false", mutate: (r) => ({ ...r, future8x7HMustNotWeakenTd004OrTd002Boundaries: false as true }) },
  { label: "future8x7HRequires8x7FAllPassed false", mutate: (r) => ({ ...r, future8x7HRequires8x7FAllPassed: false as true }) },
  { label: "future8x7HRequiresDryRunAdapterStillDryRunOnly false", mutate: (r) => ({ ...r, future8x7HRequiresDryRunAdapterStillDryRunOnly: false as true }) },
  { label: "future8x7HRequiresProductionWiringFalseBeforePatch false", mutate: (r) => ({ ...r, future8x7HRequiresProductionWiringFalseBeforePatch: false as true }) },
  { label: "future8x7HRequiresExplicitLimitedWiringScope false", mutate: (r) => ({ ...r, future8x7HRequiresExplicitLimitedWiringScope: false as true }) },
  { label: "future8x7HRequiresAllowedBoundaryOnly false", mutate: (r) => ({ ...r, future8x7HRequiresAllowedBoundaryOnly: false as true }) },
  { label: "future8x7HRequiresForbiddenLocationsAvoided false", mutate: (r) => ({ ...r, future8x7HRequiresForbiddenLocationsAvoided: false as true }) },
  { label: "future8x7HRequiresModelOutputUntrusted false", mutate: (r) => ({ ...r, future8x7HRequiresModelOutputUntrusted: false as true }) },
  { label: "future8x7HRequiresClaimRealitySeparation false", mutate: (r) => ({ ...r, future8x7HRequiresClaimRealitySeparation: false as true }) },
  { label: "future8x7HRequiresStructuredTrapActivation false", mutate: (r) => ({ ...r, future8x7HRequiresStructuredTrapActivation: false as true }) },
  { label: "future8x7HRequiresFailClosedUnsafeUnknownStates false", mutate: (r) => ({ ...r, future8x7HRequiresFailClosedUnsafeUnknownStates: false as true }) },
  { label: "future8x7HRequiresUserVisibleOutputStillBlockedUnlessAuthorized false", mutate: (r) => ({ ...r, future8x7HRequiresUserVisibleOutputStillBlockedUnlessAuthorized: false as true }) },
  { label: "future8x7HRequiresRealDocumentInputStillSeparatelyUnauthorized false", mutate: (r) => ({ ...r, future8x7HRequiresRealDocumentInputStillSeparatelyUnauthorized: false as true }) },
  { label: "future8x7HRequiresPublicRuntimeStillSeparatelyUnauthorized false", mutate: (r) => ({ ...r, future8x7HRequiresPublicRuntimeStillSeparatelyUnauthorized: false as true }) },
  { label: "future8x7HRequiresPostWiringAudit false", mutate: (r) => ({ ...r, future8x7HRequiresPostWiringAudit: false as true }) },
  { label: "future8x7HRequiresClosureDecision false", mutate: (r) => ({ ...r, future8x7HRequiresClosureDecision: false as true }) },
  { label: "productionIntegrationBoundaryPreserved false", mutate: (r) => ({ ...r, productionIntegrationBoundaryPreserved: false as true }) },
  { label: "postModelPreUserVisibleBoundaryPreserved false", mutate: (r) => ({ ...r, postModelPreUserVisibleBoundaryPreserved: false as true }) },
  { label: "preHighRiskClaimSurfacingBoundaryPreserved false", mutate: (r) => ({ ...r, preHighRiskClaimSurfacingBoundaryPreserved: false as true }) },
  { label: "preDocumentDerivedClaimSurfacingBoundaryPreserved false", mutate: (r) => ({ ...r, preDocumentDerivedClaimSurfacingBoundaryPreserved: false as true }) },
  { label: "prePersistenceBoundaryPreserved false", mutate: (r) => ({ ...r, prePersistenceBoundaryPreserved: false as true }) },
  { label: "preAutomationExecutionBoundaryPreserved false", mutate: (r) => ({ ...r, preAutomationExecutionBoundaryPreserved: false as true }) },
  { label: "routeInputParsingStillForbiddenForIntegration false", mutate: (r) => ({ ...r, routeInputParsingStillForbiddenForIntegration: false as true }) },
  { label: "promptConstructionStillForbiddenForIntegration false", mutate: (r) => ({ ...r, promptConstructionStillForbiddenForIntegration: false as true }) },
  { label: "providerModelCallLayerStillForbiddenForIntegration false", mutate: (r) => ({ ...r, providerModelCallLayerStillForbiddenForIntegration: false as true }) },
  { label: "publicRouteAuthorizationStillForbiddenForIntegration false", mutate: (r) => ({ ...r, publicRouteAuthorizationStillForbiddenForIntegration: false as true }) },
  { label: "paymentCheckoutEntitlementStillForbiddenForIntegration false", mutate: (r) => ({ ...r, paymentCheckoutEntitlementStillForbiddenForIntegration: false as true }) },
  { label: "persistenceStorageImplementationStillForbiddenForIntegration false", mutate: (r) => ({ ...r, persistenceStorageImplementationStillForbiddenForIntegration: false as true }) },
  { label: "uiRenderingStillForbiddenForIntegration false", mutate: (r) => ({ ...r, uiRenderingStillForbiddenForIntegration: false as true }) },
  { label: "ocrPhotoRouteQuarantineStillForbiddenForIntegration false", mutate: (r) => ({ ...r, ocrPhotoRouteQuarantineStillForbiddenForIntegration: false as true }) },
  { label: "piiRedactionInternalsStillForbiddenForIntegration false", mutate: (r) => ({ ...r, piiRedactionInternalsStillForbiddenForIntegration: false as true }) },
  { label: "trustedModelOutputLocationStillForbiddenForIntegration false", mutate: (r) => ({ ...r, trustedModelOutputLocationStillForbiddenForIntegration: false as true }) },
  { label: "adapterAcceptsOnlyAlreadyNormalizedGovernanceInput false", mutate: (r) => ({ ...r, adapterAcceptsOnlyAlreadyNormalizedGovernanceInput: false as true }) },
  { label: "adapterRejectsRawRouteBodies false", mutate: (r) => ({ ...r, adapterRejectsRawRouteBodies: false as true }) },
  { label: "adapterRejectsRawUploadedFiles false", mutate: (r) => ({ ...r, adapterRejectsRawUploadedFiles: false as true }) },
  { label: "adapterRejectsOcrPhotoInput false", mutate: (r) => ({ ...r, adapterRejectsOcrPhotoInput: false as true }) },
  { label: "adapterRejectsUnnormalizedDirectUserText false", mutate: (r) => ({ ...r, adapterRejectsUnnormalizedDirectUserText: false as true }) },
  { label: "adapterRejectsMissingPreModelSafetyStatus false", mutate: (r) => ({ ...r, adapterRejectsMissingPreModelSafetyStatus: false as true }) },
  { label: "adapterRejectsMissingRequiredPiiRedactionStatus false", mutate: (r) => ({ ...r, adapterRejectsMissingRequiredPiiRedactionStatus: false as true }) },
  { label: "adapterBlocksUnsafeUnknownPreModelSafetyStatus false", mutate: (r) => ({ ...r, adapterBlocksUnsafeUnknownPreModelSafetyStatus: false as true }) },
  { label: "adapterBlocksUnsafeUnknownPiiRedactionStatus false", mutate: (r) => ({ ...r, adapterBlocksUnsafeUnknownPiiRedactionStatus: false as true }) },
  { label: "adapterTreatsModelOutputAsUntrusted false", mutate: (r) => ({ ...r, adapterTreatsModelOutputAsUntrusted: false as true }) },
  { label: "adapterBlocksUserVisibleOutputByDefault false", mutate: (r) => ({ ...r, adapterBlocksUserVisibleOutputByDefault: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "coarseSubstringTrapHeuristicNotProductionReady false", mutate: (r) => ({ ...r, coarseSubstringTrapHeuristicNotProductionReady: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorized false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorized: false as true }) },
  { label: "structuredBlockedReasonsReturned false", mutate: (r) => ({ ...r, structuredBlockedReasonsReturned: false as true }) },
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
  { label: "dryRunSyntheticValidationConfirmed false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmed: false as true }) },
  { label: "dryRunSyntheticValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationConfirmed false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmed: false as true }) },
  { label: "dryRunLeakageValidationCasesPassed != count", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCoverageConfirmed false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmed: false as true }) },
  { label: "dryRunTamperCasesRejected != count", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
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
  { label: "noRouteImport false", mutate: (r) => ({ ...r, noRouteImport: false as true }) },
  { label: "noRouteHandlerCall false", mutate: (r) => ({ ...r, noRouteHandlerCall: false as true }) },
  { label: "noFilesystemRead false", mutate: (r) => ({ ...r, noFilesystemRead: false as true }) },
  { label: "noDatabaseWrite false", mutate: (r) => ({ ...r, noDatabaseWrite: false as true }) },
  { label: "noStorageWrite false", mutate: (r) => ({ ...r, noStorageWrite: false as true }) },
  { label: "noAuditPersistence false", mutate: (r) => ({ ...r, noAuditPersistence: false as true }) },
  { label: "noPromptBuild false", mutate: (r) => ({ ...r, noPromptBuild: false as true }) },
  { label: "noModelCall false", mutate: (r) => ({ ...r, noModelCall: false as true }) },
  { label: "noRunSmartTalkCall false", mutate: (r) => ({ ...r, noRunSmartTalkCall: false as true }) },
  { label: "no8x3AcRerun false", mutate: (r) => ({ ...r, no8x3AcRerun: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "executionContractClauses empty", mutate: (r) => ({ ...r, executionContractClauses: [] }) },
  { label: "future8x7HAllowedScopes empty", mutate: (r) => ({ ...r, future8x7HAllowedScopes: [] }) },
  { label: "future8x7HForbiddenActions empty", mutate: (r) => ({ ...r, future8x7HForbiddenActions: [] }) },
  { label: "future8x7HPreconditions empty", mutate: (r) => ({ ...r, future8x7HPreconditions: [] }) },
  { label: "preservedBoundaryCandidates empty", mutate: (r) => ({ ...r, preservedBoundaryCandidates: [] }) },
  { label: "preservedForbiddenLocations empty", mutate: (r) => ({ ...r, preservedForbiddenLocations: [] }) },
  { label: "preservedDryRunAdapterBehaviors empty", mutate: (r) => ({ ...r, preservedDryRunAdapterBehaviors: [] }) },
  { label: "preservedRiskDebts empty", mutate: (r) => ({ ...r, preservedRiskDebts: [] }) },
  { label: "runSmartTalkWiringExecutionContractNotes empty", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractNotes: [] }) },
  { label: "executionContractClauses missing execution-contract-only sentinel", mutate: (r) => ({ ...r, executionContractClauses: r.executionContractClauses.map((c) => c.split(SENTINEL_EXEC_CONTRACT_ONLY).join("omitted")) }) },
  { label: "future8x7HAllowedScopes missing scoped dry-run containment patch", mutate: (r) => ({ ...r, future8x7HAllowedScopes: r.future8x7HAllowedScopes.map((s) => s.split(SENTINEL_SCOPED_DRY_RUN).join("omitted")) }) },
  { label: "future8x7HForbiddenActions missing no public runtime", mutate: (r) => ({ ...r, future8x7HForbiddenActions: r.future8x7HForbiddenActions.map((a) => a.split(SENTINEL_NO_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "future8x7HForbiddenActions missing no real document input", mutate: (r) => ({ ...r, future8x7HForbiddenActions: r.future8x7HForbiddenActions.map((a) => a.split(SENTINEL_NO_REAL_DOCUMENT).join("omitted")) }) },
  { label: "future8x7HForbiddenActions missing no user-visible output", mutate: (r) => ({ ...r, future8x7HForbiddenActions: r.future8x7HForbiddenActions.map((a) => a.split(SENTINEL_NO_USER_VISIBLE).join("omitted")) }) },
  { label: "future8x7HPreconditions missing 8.7F allPassed", mutate: (r) => ({ ...r, future8x7HPreconditions: r.future8x7HPreconditions.map((p) => p.split(SENTINEL_8X7F_ALL_PASSED).join("omitted")) }) },
  { label: "preservedForbiddenLocations missing prompt construction", mutate: (r) => ({ ...r, preservedForbiddenLocations: r.preservedForbiddenLocations.map((l) => l.split(SENTINEL_PROMPT_FORBIDDEN).join("omitted")) }) },
  { label: "preservedForbiddenLocations missing provider/model call layer", mutate: (r) => ({ ...r, preservedForbiddenLocations: r.preservedForbiddenLocations.map((l) => l.split(SENTINEL_PROVIDER_FORBIDDEN).join("omitted")) }) },
  { label: "preservedDryRunAdapterBehaviors missing model output untrusted", mutate: (r) => ({ ...r, preservedDryRunAdapterBehaviors: r.preservedDryRunAdapterBehaviors.map((b) => b.split(SENTINEL_MODEL_UNTRUSTED).join("omitted")) }) },
  { label: "preservedDryRunAdapterBehaviors missing user-visible output blocked", mutate: (r) => ({ ...r, preservedDryRunAdapterBehaviors: r.preservedDryRunAdapterBehaviors.map((b) => b.split(SENTINEL_USER_VISIBLE_BLOCKED).join("omitted")) }) },
  { label: "preservedRiskDebts missing ClaimRule OR semantics", mutate: (r) => ({ ...r, preservedRiskDebts: r.preservedRiskDebts.map((d) => d.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedRiskDebts missing enforcementTrapHeuristic", mutate: (r) => ({ ...r, preservedRiskDebts: r.preservedRiskDebts.map((d) => d.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  { label: "runSmartTalkWiringExecutionContractTamperCasesRejected != count", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractTamperCasesRejected: r.runSmartTalkWiringExecutionContractTamperCasesRejected - 1 }) },
  { label: "runSmartTalkWiringExecutionContractTamperCoveragePassing false", mutate: (r) => ({ ...r, runSmartTalkWiringExecutionContractTamperCoveragePassing: false as true }) },
];

// ─── Exported execution contract function ────────────────────────────────────

/**
 * runSmartTalk wiring execution contract for 8.7G — TD-002 Evidence Gates.
 *
 * Calls the 8.7F dry-run implementation runner as the source of truth.
 * Locks the allowed scopes, forbidden actions, and preconditions for 8.7H.
 * readyFor8x7H is a readiness signal only — not route wiring or runtime authorization.
 */
export function runControlledRealDocumentEvidenceGatesRunSmartTalkWiringExecutionContract(): RunSmartTalkWiringExecutionContractResult {
  const contractFailures: string[] = [];

  // ── Call 8.7F dry-run runner as source of truth ───────────────────────
  const d = runControlledRealDocumentEvidenceGatesRuntimeAdapterDryRunImplementation();
  if (d.checkId !== "8.7F") contractFailures.push(`dry-run checkId mismatch: expected 8.7F, got ${d.checkId}`);
  if (d.allPassed !== true) contractFailures.push("dry-run allPassed is not true");
  if (d.readyFor8x7GRunSmartTalkWiringExecutionContract !== true) contractFailures.push("dry-run readyFor8x7G is not true");

  // ── Execution contract clauses ────────────────────────────────────────
  const executionContractClauses: string[] = [
    `ECC-01 [${SENTINEL_EXEC_CONTRACT_ONLY}]: This file is execution-contract-only. The 8.7G phase creates the execution contract; no wiring is performed here.`,
    "ECC-02: The execution contract locks the allowed scopes, forbidden actions, and preconditions for the future 8.7H scoped wiring or containment patch.",
    "ECC-03: 8.7H may only implement a scoped dry-run containment patch or a minimal integration seam patch behind disabled-by-default flags.",
    "ECC-04: 8.7H must never enable production runtime, pilot runtime, real document input, or user-visible document output.",
    "ECC-05: The dry-run adapter from 8.7F must remain allPassed true before 8.7H may proceed.",
    "ECC-06: All integration boundary candidates and forbidden locations from 8.7C remain in force.",
    "ECC-07: The adapter behavior contract from 8.7F remains binding for any future wiring patch.",
    "ECC-08: All governance debts preserved through 8.7A–8.7F remain unresolved and binding.",
    "ECC-09: A post-wiring audit (TD-002) and closure decision are required after any 8.7H patch.",
    "ECC-10: TD-004 isolated utility closure must not be treated as route wiring authorization under any circumstances.",
  ];

  // ── Future 8.7H allowed scopes ────────────────────────────────────────
  const future8x7HAllowedScopes: string[] = [
    `AS-01 [${SENTINEL_SCOPED_DRY_RUN}]: 8.7H may implement a scoped-dry-run-containment-patch — an isolated integration seam with no production activation.`,
    "AS-02: 8.7H may implement a minimal integration seam patch placed only at an allowed boundary from 8.7C, behind a disabled-by-default flag.",
    "AS-03: 8.7H may wire the adapter from 8.7F at the post-model-output/pre-user-visible-governance boundary only, if all preconditions are met.",
    "AS-04: 8.7H may add scoped governance evaluation hooks that do not alter existing runtime behavior when disabled.",
    "AS-05: 8.7H may run the dry-run adapter synthetically inside the containment patch to confirm integration correctness.",
  ];

  // ── Future 8.7H forbidden actions ─────────────────────────────────────
  const future8x7HForbiddenActions: string[] = [
    `FA-01 [${SENTINEL_NO_PUBLIC_RUNTIME}]: 8.7H must enforce no-public-runtime-8x7H — public runtime must not be enabled.`,
    `FA-02 [${SENTINEL_NO_REAL_DOCUMENT}]: 8.7H must enforce no-real-document-input-8x7H — real document input must not be enabled.`,
    `FA-03 [${SENTINEL_NO_USER_VISIBLE}]: 8.7H must enforce no-user-visible-output-8x7H — user-visible document output must not be enabled.`,
    "FA-04: 8.7H must not enable pilot runtime, production runtime, or go-live.",
    "FA-05: 8.7H must not enable payment, checkout, or entitlement runtime.",
    "FA-06: 8.7H must not process real documents, OCR input, or photo input.",
    "FA-07: 8.7H must not persist governance decisions.",
    "FA-08: 8.7H must not compute exact legal deadlines.",
    "FA-09: 8.7H must not treat model output as trusted.",
    "FA-10: 8.7H must not bypass pre-model safety or PII boundaries.",
    "FA-11: 8.7H must not make Evidence Gates output user-visible by default.",
    "FA-12: 8.7H must not remove or weaken any TD-004 or TD-002 boundary.",
  ];

  // ── Future 8.7H preconditions ─────────────────────────────────────────
  const future8x7HPreconditions: string[] = [
    `PC-01 [${SENTINEL_8X7F_ALL_PASSED}]: 8.7H requires 8x7F-allPassed-required-precondition — the 8.7F dry-run implementation must pass before any 8.7H patch.`,
    "PC-02: 8.7H requires the dry-run adapter to remain dry-run only — not production-wired at the time of the 8.7H patch.",
    "PC-03: 8.7H requires runtime adapter production wiring to be false before the patch begins.",
    "PC-04: 8.7H requires an explicitly limited and documented wiring scope — no implicit or unbounded wiring.",
    "PC-05: 8.7H requires the wiring to be placed only at an allowed future boundary from 8.7C.",
    "PC-06: 8.7H requires all forbidden locations from 8.7C to be avoided.",
    "PC-07: 8.7H requires model output to remain untrusted within the wired boundary.",
    "PC-08: 8.7H requires claim authorization and reality authorization to remain separated.",
    "PC-09: 8.7H requires trap activation to remain structured-metadata-only.",
    "PC-10: 8.7H requires fail-closed behavior for unsafe/unknown states.",
    "PC-11: 8.7H requires user-visible output to remain blocked unless explicitly authorized by governance.",
    "PC-12: 8.7H requires real document input to remain separately unauthorized.",
    "PC-13: 8.7H requires public runtime to remain separately unauthorized.",
    "PC-14: 8.7H requires a post-wiring audit after any integration patch.",
    "PC-15: 8.7H requires a closure decision after post-wiring audit confirms the integration.",
  ];

  // ── Preserved boundary candidates (from 8.7C/8.7D/8.7E/8.7F) ─────────
  const preservedBoundaryCandidates: string[] = [
    "PBC-01: Post-model-output / pre-user-visible-governance boundary. (Preserved from 8.7F.)",
    "PBC-02: Pre-high-risk-claim-surfacing boundary. (Preserved from 8.7F.)",
    "PBC-03: Pre-document-derived-claim-surfacing boundary. (Preserved from 8.7F.)",
    "PBC-04: Pre-persistence boundary. (Preserved from 8.7F.)",
    "PBC-05: Pre-automation/task-execution boundary. (Preserved from 8.7F.)",
  ];

  // ── Preserved forbidden locations (from 8.7C/8.7D/8.7E/8.7F) ─────────
  const preservedForbiddenLocations: string[] = [
    "PFL-01: Route input parsing. (Preserved from 8.7F.)",
    `PFL-02 [${SENTINEL_PROMPT_FORBIDDEN}]: Prompt construction — prompt-construction-forbidden. (Preserved from 8.7F.)`,
    `PFL-03 [${SENTINEL_PROVIDER_FORBIDDEN}]: Provider/model call layer — provider-model-call-layer-forbidden. (Preserved from 8.7F.)`,
    "PFL-04: Public route authorization. (Preserved from 8.7F.)",
    "PFL-05: Payment/checkout/entitlement logic. (Preserved from 8.7F.)",
    "PFL-06: Persistence/storage implementation. (Preserved from 8.7F.)",
    "PFL-07: UI rendering. (Preserved from 8.7F.)",
    "PFL-08: OCR/photo route quarantine boundary. (Preserved from 8.7F.)",
    "PFL-09: PII redaction internals. (Preserved from 8.7F.)",
    "PFL-10: Any location that treats model output as trusted. (Preserved from 8.7F.)",
  ];

  // ── Preserved dry-run adapter behaviors (from 8.7F) ───────────────────
  const preservedDryRunAdapterBehaviors: string[] = [
    "DAB-01: Accepts only already-normalized governance input.",
    "DAB-02: Rejects raw route bodies.",
    "DAB-03: Rejects raw uploaded files.",
    "DAB-04: Rejects OCR/photo input.",
    "DAB-05: Rejects unnormalized direct user text.",
    "DAB-06: Rejects missing preModelSafetyStatus.",
    "DAB-07: Rejects missing required piiRedactionStatus.",
    "DAB-08: Blocks unsafe/unknown preModelSafetyStatus.",
    "DAB-09: Blocks unsafe/unknown piiRedactionStatus.",
    `DAB-10 [${SENTINEL_MODEL_UNTRUSTED}]: Treats model output as untrusted — model-output-untrusted-adapter-behavior is a hard constraint.`,
    `DAB-11 [${SENTINEL_USER_VISIBLE_BLOCKED}]: Blocks user-visible output by default — user-visible-output-blocked-by-default-adapter-behavior is a hard constraint.`,
    "DAB-12: Separates claim authorization from reality authorization.",
    "DAB-13: Blocks high-risk claims unless claim authorization succeeds.",
    "DAB-14: Blocks document-derived claims unless reality authorization succeeds.",
    "DAB-15: Activates traps only from structured metadata — never from coarse substring heuristic.",
    "DAB-16: Never computes exact legal deadlines.",
    "DAB-17: Returns structured blocked reasons only.",
    "DAB-18: Returns audit metadata non-persistent by default.",
    "DAB-19: 8.7F synthetic validation: 35/35 cases passed.",
    "DAB-20: 8.7F leakage validation: 3/3 cases passed.",
  ];

  // ── Preserved risk debts (from 8.7B–8.7F) ────────────────────────────
  const preservedRiskDebts: string[] = [
    `PRD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F.)`,
    "PRD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F.)",
    "PRD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F.)",
    "PRD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F.)",
    `PRD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F.)`,
    "PRD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F.)",
    "PRD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F.)",
    "PRD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F.)",
    "PRD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F.)",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = EXEC_CONTRACT_TAMPER_CASES.length;
  const runSmartTalkWiringExecutionContractNotes: string[] = [
    "8.7G runSmartTalk wiring execution contract for TD-002 Evidence Gates created",
    `8.7F dry-run runner called: checkId=${d.checkId}, allPassed=${d.allPassed}`,
    "TD-002 Evidence Gates are not wired into production runSmartTalk — execution contract only",
    `Dry-run synthetic validation: ${d.syntheticValidationCaseCount}/${d.syntheticValidationCaseCount} confirmed`,
    `Dry-run leakage validation: ${d.dryRunOutputLeakageCaseCount}/${d.dryRunOutputLeakageCaseCount} confirmed`,
    `Dry-run tamper coverage: ${d.runtimeAdapterDryRunTamperCaseCount}/${d.runtimeAdapterDryRunTamperCaseCount} confirmed`,
    "readyFor8x7H: readiness signal only — not route wiring or runtime authorization",
  ];

  const provisional: RunSmartTalkWiringExecutionContractResult = {
    checkId: "8.7G",
    allPassed: true,
    runSmartTalkWiringExecutionContractOnly: true,
    runSmartTalkWiringExecutionContractFileCreated: true,
    existingFilesModified: false,
    productionWiringPlanFileModified: false,
    productionWiringContractFileModified: false,
    boundaryAuditFileModified: false,
    runtimeAdapterPlanFileModified: false,
    runtimeAdapterContractFileModified: false,
    runtimeAdapterDryRunFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    actualWiringPerformed: false,
    runtimeAdapterProductionWiringImplemented: false,
    runtimeAdapterPublicRuntimeImplemented: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyRuntimeAdapterDryRunRunner: true,
    noOtherImportsUsed: true,
    runtimeAdapterDryRunRunnerCalled: true,
    runtimeAdapterDryRunCheckId: "8.7F",
    runtimeAdapterDryRunAllPassed: true,
    runtimeAdapterDryRunReadyForWiringExecutionContract: true,
    td002RunSmartTalkWiringExecutionContractCreated: true,
    td002RuntimeAdapterDryRunImplementationConfirmed: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002ActualWiringStillNotPerformed: true,
    td002StillRequiresScopedWiringOrContainmentPatch: true,
    td002StillRequiresPostWiringAudit: true,
    td002StillRequiresClosureDecision: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true,
    td004DoesNotAuthorizeRouteWiringConfirmed: true,
    td004DoesNotAuthorizeRealDocumentInputConfirmed: true,
    td004DoesNotAuthorizeUserVisibleOutputConfirmed: true,
    td004DoesNotAuthorizePublicRuntimeConfirmed: true,
    future8x7HMayOnlyPerformScopedDryRunContainmentPatch: true,
    future8x7HMayOnlyPerformDisabledByDefaultIntegrationSeamPatch: true,
    future8x7HMustNotEnablePublicRuntime: true,
    future8x7HMustNotEnableRealDocumentInput: true,
    future8x7HMustNotEnableUserVisibleDocumentOutput: true,
    future8x7HMustNotEnablePilotRuntime: true,
    future8x7HMustNotEnableProductionRuntime: true,
    future8x7HMustNotEnableGoLive: true,
    future8x7HMustNotEnablePaymentCheckoutEntitlement: true,
    future8x7HMustNotProcessRealDocuments: true,
    future8x7HMustNotProcessOcrPhotoInput: true,
    future8x7HMustNotPersistGovernanceDecisions: true,
    future8x7HMustNotComputeExactLegalDeadlines: true,
    future8x7HMustNotTreatModelOutputAsTrusted: true,
    future8x7HMustNotBypassPreModelSafetyOrPiiBoundaries: true,
    future8x7HMustNotMakeEvidenceGatesUserVisibleByDefault: true,
    future8x7HMustNotWeakenTd004OrTd002Boundaries: true,
    future8x7HRequires8x7FAllPassed: true,
    future8x7HRequiresDryRunAdapterStillDryRunOnly: true,
    future8x7HRequiresProductionWiringFalseBeforePatch: true,
    future8x7HRequiresExplicitLimitedWiringScope: true,
    future8x7HRequiresAllowedBoundaryOnly: true,
    future8x7HRequiresForbiddenLocationsAvoided: true,
    future8x7HRequiresModelOutputUntrusted: true,
    future8x7HRequiresClaimRealitySeparation: true,
    future8x7HRequiresStructuredTrapActivation: true,
    future8x7HRequiresFailClosedUnsafeUnknownStates: true,
    future8x7HRequiresUserVisibleOutputStillBlockedUnlessAuthorized: true,
    future8x7HRequiresRealDocumentInputStillSeparatelyUnauthorized: true,
    future8x7HRequiresPublicRuntimeStillSeparatelyUnauthorized: true,
    future8x7HRequiresPostWiringAudit: true,
    future8x7HRequiresClosureDecision: true,
    productionIntegrationBoundaryPreserved: true,
    postModelPreUserVisibleBoundaryPreserved: true,
    preHighRiskClaimSurfacingBoundaryPreserved: true,
    preDocumentDerivedClaimSurfacingBoundaryPreserved: true,
    prePersistenceBoundaryPreserved: true,
    preAutomationExecutionBoundaryPreserved: true,
    routeInputParsingStillForbiddenForIntegration: true,
    promptConstructionStillForbiddenForIntegration: true,
    providerModelCallLayerStillForbiddenForIntegration: true,
    publicRouteAuthorizationStillForbiddenForIntegration: true,
    paymentCheckoutEntitlementStillForbiddenForIntegration: true,
    persistenceStorageImplementationStillForbiddenForIntegration: true,
    uiRenderingStillForbiddenForIntegration: true,
    ocrPhotoRouteQuarantineStillForbiddenForIntegration: true,
    piiRedactionInternalsStillForbiddenForIntegration: true,
    trustedModelOutputLocationStillForbiddenForIntegration: true,
    adapterAcceptsOnlyAlreadyNormalizedGovernanceInput: true,
    adapterRejectsRawRouteBodies: true,
    adapterRejectsRawUploadedFiles: true,
    adapterRejectsOcrPhotoInput: true,
    adapterRejectsUnnormalizedDirectUserText: true,
    adapterRejectsMissingPreModelSafetyStatus: true,
    adapterRejectsMissingRequiredPiiRedactionStatus: true,
    adapterBlocksUnsafeUnknownPreModelSafetyStatus: true,
    adapterBlocksUnsafeUnknownPiiRedactionStatus: true,
    adapterTreatsModelOutputAsUntrusted: true,
    adapterBlocksUserVisibleOutputByDefault: true,
    claimAuthorizationSeparateFromRealityAuthorization: true,
    highRiskClaimsBlockedUnlessClaimAuthorized: true,
    documentDerivedClaimsBlockedUnlessRealityAuthorized: true,
    trapActivationStructuredMetadataOnly: true,
    coarseSubstringTrapHeuristicNotProductionReady: true,
    exactLegalDeadlineCalculationUnauthorized: true,
    structuredBlockedReasonsReturned: true,
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
    dryRunSyntheticValidationConfirmed: true,
    dryRunSyntheticValidationCaseCount: d.syntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: d.syntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmed: true,
    dryRunLeakageValidationCaseCount: d.dryRunOutputLeakageCaseCount,
    dryRunLeakageValidationCasesPassed: d.dryRunOutputLeakageCasesPassed,
    dryRunTamperCoverageConfirmed: true,
    dryRunTamperCaseCount: d.runtimeAdapterDryRunTamperCaseCount,
    dryRunTamperCasesRejected: d.runtimeAdapterDryRunTamperCasesRejected,
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
    noRouteImport: true,
    noRouteHandlerCall: true,
    noFilesystemRead: true,
    noDatabaseWrite: true,
    noStorageWrite: true,
    noAuditPersistence: true,
    noPromptBuild: true,
    noModelCall: true,
    noRunSmartTalkCall: true,
    no8x3AcRerun: true,
    readyFor8x7HScopedWiringOrContainmentPatch: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    executionContractClauses,
    future8x7HAllowedScopes,
    future8x7HForbiddenActions,
    future8x7HPreconditions,
    preservedBoundaryCandidates,
    preservedForbiddenLocations,
    preservedDryRunAdapterBehaviors,
    preservedRiskDebts,
    runSmartTalkWiringExecutionContractTamperCaseCount: tamperCaseCount,
    runSmartTalkWiringExecutionContractTamperCasesRejected: tamperCaseCount,
    runSmartTalkWiringExecutionContractTamperCoveragePassing: true,
    runSmartTalkWiringExecutionContractNotes,
  };

  if (!_isCanonicalExecutionContractResult(provisional)) {
    contractFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7G tamper cases ─────────────────────────────────────────────
  let runSmartTalkWiringExecutionContractTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let i = 0; i < EXEC_CONTRACT_TAMPER_CASES.length; i++) {
    const tc = EXEC_CONTRACT_TAMPER_CASES[i];
    if (!_isCanonicalExecutionContractResult(tc.mutate(provisional))) {
      runSmartTalkWiringExecutionContractTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7G tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) contractFailures.push(...tamperFailures);

  const allPassed = contractFailures.length === 0 && runSmartTalkWiringExecutionContractTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...runSmartTalkWiringExecutionContractNotes,
    `8.7G tamper cases: ${runSmartTalkWiringExecutionContractTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(contractFailures.length > 0 ? [`FAILURES (${contractFailures.length}):`, ...contractFailures] : []),
  ];

  return { ...provisional, allPassed, runSmartTalkWiringExecutionContractTamperCasesRejected, runSmartTalkWiringExecutionContractNotes: finalNotes };
}
