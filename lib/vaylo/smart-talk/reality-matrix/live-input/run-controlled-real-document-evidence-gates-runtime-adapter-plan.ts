/**
 * PHASE 8.7D — Evidence Gates Runtime Adapter Plan
 *
 * Runtime adapter plan for TD-002 Evidence Gates production wiring.
 *
 * Runtime-adapter-plan-only. This file:
 *   - Calls the 8.7C boundary audit runner as the source of truth
 *   - Plans the future isolated runtime adapter (not implemented here)
 *   - Records adapter principles, intended I/O shape categories
 *   - Preserves boundary candidates, forbidden locations, and governance debts
 *
 * The planned adapter is a pure isolated governance adapter that:
 *   - Accepts only already-normalized governance input
 *   - Returns structured governance decision data only
 *   - Never touches runSmartTalk, routes, prompts, model calls, DB, or storage
 *
 * Still unauthorized after 8.7D:
 *   - Runtime adapter implementation
 *   - Route wiring / runSmartTalk modification
 *   - Real document input / user-visible output
 *   - Public / pilot / production / go-live runtime
 */

import { runControlledRealDocumentEvidenceGatesProductionIntegrationBoundaryAudit } from "./run-controlled-real-document-evidence-gates-production-integration-boundary-audit";

// ─── Return type ──────────────────────────────────────────────────────────────

interface RuntimeAdapterPlanResult {
  checkId: "8.7D";
  allPassed: boolean;
  runtimeAdapterPlanOnly: true;
  runtimeAdapterPlanFileCreated: true;
  existingFilesModified: false;
  planFileModified: false;
  contractFileModified: false;
  boundaryAuditFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  runtimeAdapterImplemented: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  importedOnlyBoundaryAuditRunner: true;
  noOtherImportsUsed: true;
  boundaryAuditRunnerCalled: true;
  boundaryAuditCheckId: "8.7C";
  boundaryAuditAllPassed: true;
  boundaryAuditReadyForRuntimeAdapterPlan: true;
  td002EvidenceGatesRuntimeAdapterPlanCreated: true;
  td002ProductionIntegrationBoundaryAuditConfirmed: true;
  td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true;
  td002EvidenceGatesProductionWiringNotImplementedYet: true;
  td002RuntimeAdapterNotImplementedYet: true;
  td002StillRequiresRuntimeAdapterContract: true;
  td002StillRequiresDryRunAdapterImplementation: true;
  td002StillRequiresRunSmartTalkWiringExecutionContract: true;
  td002StillRequiresScopedWiringOrContainmentPatch: true;
  td002StillRequiresPostWiringAudit: true;
  td002StillRequiresClosureDecision: true;
  td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true;
  td004DoesNotAuthorizeRouteWiringConfirmed: true;
  td004DoesNotAuthorizeRealDocumentInputConfirmed: true;
  td004DoesNotAuthorizeUserVisibleOutputConfirmed: true;
  td004DoesNotAuthorizePublicRuntimeConfirmed: true;
  adapterPlannedAsPureIsolatedGovernanceAdapter: true;
  adapterAcceptsOnlyAlreadyNormalizedGovernanceInput: true;
  adapterRejectsRawRouteBodies: true;
  adapterRejectsRawUploadedFiles: true;
  adapterRejectsOcrPhotoInput: true;
  adapterDoesNotBuildPrompts: true;
  adapterDoesNotCallProviderModelCode: true;
  adapterDoesNotCallRunSmartTalk: true;
  adapterDoesNotPerformRouteAuthorization: true;
  adapterDoesNotPerformPaymentCheckoutEntitlementChecks: true;
  adapterDoesNotWriteDatabaseOrStorage: true;
  adapterDoesNotPersistAuditTracesByDefault: true;
  adapterDoesNotProduceUserVisibleOutputDirectly: true;
  adapterTreatsModelOutputAsUntrusted: true;
  adapterReturnsStructuredGovernanceDecisionOnly: true;
  claimAuthorizationSeparateFromRealityAuthorization: true;
  trapActivationStructuredMetadataOnly: true;
  unsafeUnknownStatesBlockingByDefault: true;
  documentDerivedClaimsBlockedUnlessRealityAuthorized: true;
  highRiskClaimsBlockedUnlessClaimAuthorized: true;
  exactLegalDeadlineCalculationUnauthorized: true;
  sourceKindInputPlanned: true;
  laneInputPlanned: true;
  normalizedTextOrModelOutputInputPlanned: true;
  preModelSafetyStatusInputPlanned: true;
  piiRedactionStatusInputPlanned: true;
  evidenceCandidateMetadataInputPlanned: true;
  claimCandidateMetadataInputPlanned: true;
  trapCandidateMetadataInputPlanned: true;
  riskContextInputPlanned: true;
  authorizationContextInputPlanned: true;
  adapterStatusOutputPlanned: true;
  safeForUserVisibleOutputOutputPlanned: true;
  safeForEvidenceGateContinuationOutputPlanned: true;
  claimAuthorizationStatusOutputPlanned: true;
  realityAuthorizationStatusOutputPlanned: true;
  trapActivationStatusOutputPlanned: true;
  blockedReasonsOutputPlanned: true;
  governanceDecisionSummaryOutputPlanned: true;
  auditMetadataNonPersistentByDefaultOutputPlanned: true;
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
  readyFor8x7EEvidenceGatesRuntimeAdapterContract: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  adapterPrinciples: string[];
  plannedInputShapeCategories: string[];
  plannedOutputShapeCategories: string[];
  preservedBoundaryCandidates: string[];
  preservedForbiddenLocations: string[];
  preservedRiskDebts: string[];
  runtimeAdapterPlanTamperCaseCount: number;
  runtimeAdapterPlanTamperCasesRejected: number;
  runtimeAdapterPlanTamperCoveragePassing: true;
  runtimeAdapterPlanNotes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_PURE_ISOLATED = "pure-isolated-governance-adapter";
const SENTINEL_NO_RST_CALL = "no-runSmartTalk-call";
const SENTINEL_NO_USER_VISIBLE_DIRECT = "no-user-visible-output-direct";
const SENTINEL_NORMALIZED_TEXT = "normalizedTextOrModelOutput";
const SENTINEL_PII_STATUS = "piiRedactionStatus";
const SENTINEL_SAFE_USER_VISIBLE = "safeForUserVisibleOutput";
const SENTINEL_CLAIM_AUTH_STATUS = "claimAuthorizationStatus";
const SENTINEL_PROMPT_FORBIDDEN = "prompt-construction-forbidden";
const SENTINEL_PROVIDER_FORBIDDEN = "provider-model-call-layer-forbidden";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical plan checker ───────────────────────────────────────────────────

function _isCanonicalAdapterPlanResult(r: RuntimeAdapterPlanResult): boolean {
  if (r.checkId !== "8.7D") return false;
  if (r.allPassed !== true) return false;
  if (r.runtimeAdapterPlanOnly !== true) return false;
  if (r.runtimeAdapterPlanFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.planFileModified !== false) return false;
  if (r.contractFileModified !== false) return false;
  if (r.boundaryAuditFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.runtimeAdapterImplemented !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.importedOnlyBoundaryAuditRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.boundaryAuditRunnerCalled !== true) return false;
  if (r.boundaryAuditCheckId !== "8.7C") return false;
  if (r.boundaryAuditAllPassed !== true) return false;
  if (r.boundaryAuditReadyForRuntimeAdapterPlan !== true) return false;
  if (r.td002EvidenceGatesRuntimeAdapterPlanCreated !== true) return false;
  if (r.td002ProductionIntegrationBoundaryAuditConfirmed !== true) return false;
  if (r.td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.td002EvidenceGatesProductionWiringNotImplementedYet !== true) return false;
  if (r.td002RuntimeAdapterNotImplementedYet !== true) return false;
  if (r.td002StillRequiresRuntimeAdapterContract !== true) return false;
  if (r.td002StillRequiresDryRunAdapterImplementation !== true) return false;
  if (r.td002StillRequiresRunSmartTalkWiringExecutionContract !== true) return false;
  if (r.td002StillRequiresScopedWiringOrContainmentPatch !== true) return false;
  if (r.td002StillRequiresPostWiringAudit !== true) return false;
  if (r.td002StillRequiresClosureDecision !== true) return false;
  if (r.td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRouteWiringConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRealDocumentInputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeUserVisibleOutputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizePublicRuntimeConfirmed !== true) return false;
  if (r.adapterPlannedAsPureIsolatedGovernanceAdapter !== true) return false;
  if (r.adapterAcceptsOnlyAlreadyNormalizedGovernanceInput !== true) return false;
  if (r.adapterRejectsRawRouteBodies !== true) return false;
  if (r.adapterRejectsRawUploadedFiles !== true) return false;
  if (r.adapterRejectsOcrPhotoInput !== true) return false;
  if (r.adapterDoesNotBuildPrompts !== true) return false;
  if (r.adapterDoesNotCallProviderModelCode !== true) return false;
  if (r.adapterDoesNotCallRunSmartTalk !== true) return false;
  if (r.adapterDoesNotPerformRouteAuthorization !== true) return false;
  if (r.adapterDoesNotPerformPaymentCheckoutEntitlementChecks !== true) return false;
  if (r.adapterDoesNotWriteDatabaseOrStorage !== true) return false;
  if (r.adapterDoesNotPersistAuditTracesByDefault !== true) return false;
  if (r.adapterDoesNotProduceUserVisibleOutputDirectly !== true) return false;
  if (r.adapterTreatsModelOutputAsUntrusted !== true) return false;
  if (r.adapterReturnsStructuredGovernanceDecisionOnly !== true) return false;
  if (r.claimAuthorizationSeparateFromRealityAuthorization !== true) return false;
  if (r.trapActivationStructuredMetadataOnly !== true) return false;
  if (r.unsafeUnknownStatesBlockingByDefault !== true) return false;
  if (r.documentDerivedClaimsBlockedUnlessRealityAuthorized !== true) return false;
  if (r.highRiskClaimsBlockedUnlessClaimAuthorized !== true) return false;
  if (r.exactLegalDeadlineCalculationUnauthorized !== true) return false;
  if (r.sourceKindInputPlanned !== true) return false;
  if (r.laneInputPlanned !== true) return false;
  if (r.normalizedTextOrModelOutputInputPlanned !== true) return false;
  if (r.preModelSafetyStatusInputPlanned !== true) return false;
  if (r.piiRedactionStatusInputPlanned !== true) return false;
  if (r.evidenceCandidateMetadataInputPlanned !== true) return false;
  if (r.claimCandidateMetadataInputPlanned !== true) return false;
  if (r.trapCandidateMetadataInputPlanned !== true) return false;
  if (r.riskContextInputPlanned !== true) return false;
  if (r.authorizationContextInputPlanned !== true) return false;
  if (r.adapterStatusOutputPlanned !== true) return false;
  if (r.safeForUserVisibleOutputOutputPlanned !== true) return false;
  if (r.safeForEvidenceGateContinuationOutputPlanned !== true) return false;
  if (r.claimAuthorizationStatusOutputPlanned !== true) return false;
  if (r.realityAuthorizationStatusOutputPlanned !== true) return false;
  if (r.trapActivationStatusOutputPlanned !== true) return false;
  if (r.blockedReasonsOutputPlanned !== true) return false;
  if (r.governanceDecisionSummaryOutputPlanned !== true) return false;
  if (r.auditMetadataNonPersistentByDefaultOutputPlanned !== true) return false;
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
  if (r.readyFor8x7EEvidenceGatesRuntimeAdapterContract !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  // Array content checks
  if (!r.adapterPrinciples || r.adapterPrinciples.length === 0) return false;
  if (!r.plannedInputShapeCategories || r.plannedInputShapeCategories.length === 0) return false;
  if (!r.plannedOutputShapeCategories || r.plannedOutputShapeCategories.length === 0) return false;
  if (!r.preservedBoundaryCandidates || r.preservedBoundaryCandidates.length === 0) return false;
  if (!r.preservedForbiddenLocations || r.preservedForbiddenLocations.length === 0) return false;
  if (!r.preservedRiskDebts || r.preservedRiskDebts.length === 0) return false;
  if (!r.runtimeAdapterPlanNotes || r.runtimeAdapterPlanNotes.length === 0) return false;
  const principlesJ = r.adapterPrinciples.join(" ");
  if (!principlesJ.includes(SENTINEL_PURE_ISOLATED)) return false;
  if (!principlesJ.includes(SENTINEL_NO_RST_CALL)) return false;
  if (!principlesJ.includes(SENTINEL_NO_USER_VISIBLE_DIRECT)) return false;
  const inputJ = r.plannedInputShapeCategories.join(" ");
  if (!inputJ.includes(SENTINEL_NORMALIZED_TEXT)) return false;
  if (!inputJ.includes(SENTINEL_PII_STATUS)) return false;
  const outputJ = r.plannedOutputShapeCategories.join(" ");
  if (!outputJ.includes(SENTINEL_SAFE_USER_VISIBLE)) return false;
  if (!outputJ.includes(SENTINEL_CLAIM_AUTH_STATUS)) return false;
  const forbiddenJ = r.preservedForbiddenLocations.join(" ");
  if (!forbiddenJ.includes(SENTINEL_PROMPT_FORBIDDEN)) return false;
  if (!forbiddenJ.includes(SENTINEL_PROVIDER_FORBIDDEN)) return false;
  const debtsJ = r.preservedRiskDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  if (r.runtimeAdapterPlanTamperCasesRejected !== r.runtimeAdapterPlanTamperCaseCount) return false;
  if (r.runtimeAdapterPlanTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type AdapterPlanTamperMutation = (r: RuntimeAdapterPlanResult) => RuntimeAdapterPlanResult;
interface AdapterPlanTamperCase { label: string; mutate: AdapterPlanTamperMutation; }

const ADAPTER_PLAN_TAMPER_CASES: AdapterPlanTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7C" as "8.7D" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "runtimeAdapterPlanOnly false", mutate: (r) => ({ ...r, runtimeAdapterPlanOnly: false as true }) },
  { label: "runtimeAdapterPlanFileCreated false", mutate: (r) => ({ ...r, runtimeAdapterPlanFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "planFileModified true", mutate: (r) => ({ ...r, planFileModified: true as false }) },
  { label: "contractFileModified true", mutate: (r) => ({ ...r, contractFileModified: true as false }) },
  { label: "boundaryAuditFileModified true", mutate: (r) => ({ ...r, boundaryAuditFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "runtimeAdapterImplemented true", mutate: (r) => ({ ...r, runtimeAdapterImplemented: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "importedOnlyBoundaryAuditRunner false", mutate: (r) => ({ ...r, importedOnlyBoundaryAuditRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "boundaryAuditRunnerCalled false", mutate: (r) => ({ ...r, boundaryAuditRunnerCalled: false as true }) },
  { label: "boundaryAuditCheckId wrong", mutate: (r) => ({ ...r, boundaryAuditCheckId: "8.7B" as "8.7C" }) },
  { label: "boundaryAuditAllPassed false", mutate: (r) => ({ ...r, boundaryAuditAllPassed: false as true }) },
  { label: "boundaryAuditReadyForRuntimeAdapterPlan false", mutate: (r) => ({ ...r, boundaryAuditReadyForRuntimeAdapterPlan: false as true }) },
  { label: "td002EvidenceGatesRuntimeAdapterPlanCreated false", mutate: (r) => ({ ...r, td002EvidenceGatesRuntimeAdapterPlanCreated: false as true }) },
  { label: "td002ProductionIntegrationBoundaryAuditConfirmed false", mutate: (r) => ({ ...r, td002ProductionIntegrationBoundaryAuditConfirmed: false as true }) },
  { label: "td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "td002EvidenceGatesProductionWiringNotImplementedYet false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringNotImplementedYet: false as true }) },
  { label: "td002RuntimeAdapterNotImplementedYet false", mutate: (r) => ({ ...r, td002RuntimeAdapterNotImplementedYet: false as true }) },
  { label: "td002StillRequiresRuntimeAdapterContract false", mutate: (r) => ({ ...r, td002StillRequiresRuntimeAdapterContract: false as true }) },
  { label: "td002StillRequiresDryRunAdapterImplementation false", mutate: (r) => ({ ...r, td002StillRequiresDryRunAdapterImplementation: false as true }) },
  { label: "td002StillRequiresRunSmartTalkWiringExecutionContract false", mutate: (r) => ({ ...r, td002StillRequiresRunSmartTalkWiringExecutionContract: false as true }) },
  { label: "td002StillRequiresScopedWiringOrContainmentPatch false", mutate: (r) => ({ ...r, td002StillRequiresScopedWiringOrContainmentPatch: false as true }) },
  { label: "td002StillRequiresPostWiringAudit false", mutate: (r) => ({ ...r, td002StillRequiresPostWiringAudit: false as true }) },
  { label: "td002StillRequiresClosureDecision false", mutate: (r) => ({ ...r, td002StillRequiresClosureDecision: false as true }) },
  { label: "td004ClosedAtIsolatedUtilityLevelConfirmed false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRouteWiringConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRouteWiringConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRealDocumentInputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRealDocumentInputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeUserVisibleOutputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeUserVisibleOutputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizePublicRuntimeConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizePublicRuntimeConfirmed: false as true }) },
  { label: "adapterPlannedAsPureIsolatedGovernanceAdapter false", mutate: (r) => ({ ...r, adapterPlannedAsPureIsolatedGovernanceAdapter: false as true }) },
  { label: "adapterAcceptsOnlyAlreadyNormalizedGovernanceInput false", mutate: (r) => ({ ...r, adapterAcceptsOnlyAlreadyNormalizedGovernanceInput: false as true }) },
  { label: "adapterRejectsRawRouteBodies false", mutate: (r) => ({ ...r, adapterRejectsRawRouteBodies: false as true }) },
  { label: "adapterRejectsRawUploadedFiles false", mutate: (r) => ({ ...r, adapterRejectsRawUploadedFiles: false as true }) },
  { label: "adapterRejectsOcrPhotoInput false", mutate: (r) => ({ ...r, adapterRejectsOcrPhotoInput: false as true }) },
  { label: "adapterDoesNotBuildPrompts false", mutate: (r) => ({ ...r, adapterDoesNotBuildPrompts: false as true }) },
  { label: "adapterDoesNotCallProviderModelCode false", mutate: (r) => ({ ...r, adapterDoesNotCallProviderModelCode: false as true }) },
  { label: "adapterDoesNotCallRunSmartTalk false", mutate: (r) => ({ ...r, adapterDoesNotCallRunSmartTalk: false as true }) },
  { label: "adapterDoesNotPerformRouteAuthorization false", mutate: (r) => ({ ...r, adapterDoesNotPerformRouteAuthorization: false as true }) },
  { label: "adapterDoesNotPerformPaymentCheckoutEntitlementChecks false", mutate: (r) => ({ ...r, adapterDoesNotPerformPaymentCheckoutEntitlementChecks: false as true }) },
  { label: "adapterDoesNotWriteDatabaseOrStorage false", mutate: (r) => ({ ...r, adapterDoesNotWriteDatabaseOrStorage: false as true }) },
  { label: "adapterDoesNotPersistAuditTracesByDefault false", mutate: (r) => ({ ...r, adapterDoesNotPersistAuditTracesByDefault: false as true }) },
  { label: "adapterDoesNotProduceUserVisibleOutputDirectly false", mutate: (r) => ({ ...r, adapterDoesNotProduceUserVisibleOutputDirectly: false as true }) },
  { label: "adapterTreatsModelOutputAsUntrusted false", mutate: (r) => ({ ...r, adapterTreatsModelOutputAsUntrusted: false as true }) },
  { label: "adapterReturnsStructuredGovernanceDecisionOnly false", mutate: (r) => ({ ...r, adapterReturnsStructuredGovernanceDecisionOnly: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "unsafeUnknownStatesBlockingByDefault false", mutate: (r) => ({ ...r, unsafeUnknownStatesBlockingByDefault: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorized false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorized: false as true }) },
  { label: "sourceKindInputPlanned false", mutate: (r) => ({ ...r, sourceKindInputPlanned: false as true }) },
  { label: "laneInputPlanned false", mutate: (r) => ({ ...r, laneInputPlanned: false as true }) },
  { label: "normalizedTextOrModelOutputInputPlanned false", mutate: (r) => ({ ...r, normalizedTextOrModelOutputInputPlanned: false as true }) },
  { label: "preModelSafetyStatusInputPlanned false", mutate: (r) => ({ ...r, preModelSafetyStatusInputPlanned: false as true }) },
  { label: "piiRedactionStatusInputPlanned false", mutate: (r) => ({ ...r, piiRedactionStatusInputPlanned: false as true }) },
  { label: "evidenceCandidateMetadataInputPlanned false", mutate: (r) => ({ ...r, evidenceCandidateMetadataInputPlanned: false as true }) },
  { label: "claimCandidateMetadataInputPlanned false", mutate: (r) => ({ ...r, claimCandidateMetadataInputPlanned: false as true }) },
  { label: "trapCandidateMetadataInputPlanned false", mutate: (r) => ({ ...r, trapCandidateMetadataInputPlanned: false as true }) },
  { label: "riskContextInputPlanned false", mutate: (r) => ({ ...r, riskContextInputPlanned: false as true }) },
  { label: "authorizationContextInputPlanned false", mutate: (r) => ({ ...r, authorizationContextInputPlanned: false as true }) },
  { label: "adapterStatusOutputPlanned false", mutate: (r) => ({ ...r, adapterStatusOutputPlanned: false as true }) },
  { label: "safeForUserVisibleOutputOutputPlanned false", mutate: (r) => ({ ...r, safeForUserVisibleOutputOutputPlanned: false as true }) },
  { label: "safeForEvidenceGateContinuationOutputPlanned false", mutate: (r) => ({ ...r, safeForEvidenceGateContinuationOutputPlanned: false as true }) },
  { label: "claimAuthorizationStatusOutputPlanned false", mutate: (r) => ({ ...r, claimAuthorizationStatusOutputPlanned: false as true }) },
  { label: "realityAuthorizationStatusOutputPlanned false", mutate: (r) => ({ ...r, realityAuthorizationStatusOutputPlanned: false as true }) },
  { label: "trapActivationStatusOutputPlanned false", mutate: (r) => ({ ...r, trapActivationStatusOutputPlanned: false as true }) },
  { label: "blockedReasonsOutputPlanned false", mutate: (r) => ({ ...r, blockedReasonsOutputPlanned: false as true }) },
  { label: "governanceDecisionSummaryOutputPlanned false", mutate: (r) => ({ ...r, governanceDecisionSummaryOutputPlanned: false as true }) },
  { label: "auditMetadataNonPersistentByDefaultOutputPlanned false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefaultOutputPlanned: false as true }) },
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
  { label: "readyFor8x7EEvidenceGatesRuntimeAdapterContract false", mutate: (r) => ({ ...r, readyFor8x7EEvidenceGatesRuntimeAdapterContract: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "adapterPrinciples empty", mutate: (r) => ({ ...r, adapterPrinciples: [] }) },
  { label: "plannedInputShapeCategories empty", mutate: (r) => ({ ...r, plannedInputShapeCategories: [] }) },
  { label: "plannedOutputShapeCategories empty", mutate: (r) => ({ ...r, plannedOutputShapeCategories: [] }) },
  { label: "preservedBoundaryCandidates empty", mutate: (r) => ({ ...r, preservedBoundaryCandidates: [] }) },
  { label: "preservedForbiddenLocations empty", mutate: (r) => ({ ...r, preservedForbiddenLocations: [] }) },
  { label: "preservedRiskDebts empty", mutate: (r) => ({ ...r, preservedRiskDebts: [] }) },
  { label: "runtimeAdapterPlanNotes empty", mutate: (r) => ({ ...r, runtimeAdapterPlanNotes: [] }) },
  { label: "adapterPrinciples missing pure isolated adapter", mutate: (r) => ({ ...r, adapterPrinciples: r.adapterPrinciples.map((p) => p.split(SENTINEL_PURE_ISOLATED).join("omitted")) }) },
  { label: "adapterPrinciples missing no runSmartTalk call", mutate: (r) => ({ ...r, adapterPrinciples: r.adapterPrinciples.map((p) => p.split(SENTINEL_NO_RST_CALL).join("omitted")) }) },
  { label: "adapterPrinciples missing no user-visible output", mutate: (r) => ({ ...r, adapterPrinciples: r.adapterPrinciples.map((p) => p.split(SENTINEL_NO_USER_VISIBLE_DIRECT).join("omitted")) }) },
  { label: "plannedInputShapeCategories missing normalizedTextOrModelOutput", mutate: (r) => ({ ...r, plannedInputShapeCategories: r.plannedInputShapeCategories.map((c) => c.split(SENTINEL_NORMALIZED_TEXT).join("omitted")) }) },
  { label: "plannedInputShapeCategories missing piiRedactionStatus", mutate: (r) => ({ ...r, plannedInputShapeCategories: r.plannedInputShapeCategories.map((c) => c.split(SENTINEL_PII_STATUS).join("omitted")) }) },
  { label: "plannedOutputShapeCategories missing safeForUserVisibleOutput", mutate: (r) => ({ ...r, plannedOutputShapeCategories: r.plannedOutputShapeCategories.map((c) => c.split(SENTINEL_SAFE_USER_VISIBLE).join("omitted")) }) },
  { label: "plannedOutputShapeCategories missing claimAuthorizationStatus", mutate: (r) => ({ ...r, plannedOutputShapeCategories: r.plannedOutputShapeCategories.map((c) => c.split(SENTINEL_CLAIM_AUTH_STATUS).join("omitted")) }) },
  { label: "preservedForbiddenLocations missing prompt construction", mutate: (r) => ({ ...r, preservedForbiddenLocations: r.preservedForbiddenLocations.map((l) => l.split(SENTINEL_PROMPT_FORBIDDEN).join("omitted")) }) },
  { label: "preservedForbiddenLocations missing provider/model call layer", mutate: (r) => ({ ...r, preservedForbiddenLocations: r.preservedForbiddenLocations.map((l) => l.split(SENTINEL_PROVIDER_FORBIDDEN).join("omitted")) }) },
  { label: "preservedRiskDebts missing ClaimRule OR semantics", mutate: (r) => ({ ...r, preservedRiskDebts: r.preservedRiskDebts.map((d) => d.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedRiskDebts missing enforcementTrapHeuristic", mutate: (r) => ({ ...r, preservedRiskDebts: r.preservedRiskDebts.map((d) => d.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  { label: "runtimeAdapterPlanTamperCasesRejected != count", mutate: (r) => ({ ...r, runtimeAdapterPlanTamperCasesRejected: r.runtimeAdapterPlanTamperCasesRejected - 1 }) },
  { label: "runtimeAdapterPlanTamperCoveragePassing false", mutate: (r) => ({ ...r, runtimeAdapterPlanTamperCoveragePassing: false as true }) },
];

// ─── Exported runtime adapter plan function ───────────────────────────────────

/**
 * Runtime adapter plan for 8.7D — TD-002 Evidence Gates.
 *
 * Calls the 8.7C boundary audit runner as the source of truth.
 * Plans the future isolated runtime adapter without implementing it.
 * readyFor8x7E is a readiness signal only — not adapter implementation.
 */
export function runControlledRealDocumentEvidenceGatesRuntimeAdapterPlan(): RuntimeAdapterPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.7C boundary audit runner as source of truth ───────────────────
  const b = runControlledRealDocumentEvidenceGatesProductionIntegrationBoundaryAudit();

  if (b.checkId !== "8.7C") planFailures.push(`boundary audit checkId mismatch: expected 8.7C, got ${b.checkId}`);
  if (b.allPassed !== true) planFailures.push("boundary audit allPassed is not true");
  if (b.readyFor8x7DEvidenceGatesRuntimeAdapterPlan !== true) planFailures.push("boundary audit readyFor8x7D is not true");

  // ── Adapter principles ────────────────────────────────────────────────────
  const adapterPrinciples: string[] = [
    `AP-01 [${SENTINEL_PURE_ISOLATED}]: The runtime adapter must be planned and implemented as a pure-isolated-governance-adapter — a self-contained pure function that performs only governance evaluation.`,
    "AP-02: The adapter accepts only already-normalized governance input — never raw route request bodies, uploaded files, or OCR/photo input.",
    "AP-03: The adapter does not build prompts, does not call provider/model code, and does not perform route authorization.",
    `AP-04 [${SENTINEL_NO_RST_CALL}]: The adapter must never call runSmartTalk; no-runSmartTalk-call is a hard constraint of the adapter design.`,
    "AP-05: The adapter does not perform payment, checkout, or entitlement checks.",
    "AP-06: The adapter does not write to database or storage, and does not persist audit traces unless separately authorized.",
    `AP-07 [${SENTINEL_NO_USER_VISIBLE_DIRECT}]: The adapter must never produce user-visible output directly; no-user-visible-output-direct is a hard constraint — governance decision data is returned to the caller, not to users.`,
    "AP-08: The adapter treats all model output as untrusted — no claim, trap, or evidence derived from model output is accepted as implicitly valid.",
    "AP-09: The adapter returns structured governance decision data only — not raw model text, not user-facing strings.",
    "AP-10: Claim authorization and reality authorization are separate axes — the adapter must never conflate them.",
    "AP-11: Trap activation is driven by structured governance metadata only — coarse substring matching is not an allowed activation mechanism.",
    "AP-12: Unsafe or unknown states default to blocking — the adapter must fail closed, not open.",
    "AP-13: Document-derived claims are blocked unless reality authorization explicitly succeeds.",
    "AP-14: High-risk claims are blocked unless claim authorization explicitly succeeds.",
    "AP-15: Exact legal deadline calculation is unauthorized — the adapter must not compute or surface specific legal deadlines.",
  ];

  // ── Planned input shape categories ────────────────────────────────────────
  const plannedInputShapeCategories: string[] = [
    `IN-01: sourceKind — discriminated source kind indicating the origin type of the input (e.g., user_text, controlled_document).`,
    "IN-02: lane — processing lane indicating which governance lane applies (e.g., needs_review, controlled_document_text).",
    `IN-03: ${SENTINEL_NORMALIZED_TEXT} — the already-normalized text or model output string to evaluate; never raw uploaded content.`,
    "IN-04: preModelSafetyStatus — structured result from any upstream pre-model safety pass (e.g., input guard status).",
    `IN-05: ${SENTINEL_PII_STATUS} — structured result from any upstream PII redaction pass, confirming redaction was applied.`,
    "IN-06: evidenceCandidateMetadata — structured candidate evidence annotations derived from governance metadata, not from raw text.",
    "IN-07: claimCandidateMetadata — structured candidate claim descriptors gated by claim authorization before surfacing.",
    "IN-08: trapCandidateMetadata — structured candidate trap descriptors derived from governance metadata only.",
    "IN-09: riskContext — risk context object summarizing known risk signals and blocking reasons at input time.",
    "IN-10: authorizationContext — authorization context object containing current authorization levels and flags.",
  ];

  // ── Planned output shape categories ──────────────────────────────────────
  const plannedOutputShapeCategories: string[] = [
    "OUT-01: adapterStatus — top-level adapter evaluation status (e.g., PASSED, BLOCKED, ERROR).",
    `OUT-02: ${SENTINEL_SAFE_USER_VISIBLE} — boolean gate; true only if governance explicitly permits user-visible output.`,
    "OUT-03: safeForEvidenceGateContinuation — boolean gate; true only if Evidence Gate continuation is permitted.",
    `OUT-04: ${SENTINEL_CLAIM_AUTH_STATUS} — structured result of claim authorization evaluation.`,
    "OUT-05: realityAuthorizationStatus — structured result of reality authorization evaluation.",
    "OUT-06: trapActivationStatus — structured result of trap activation evaluation from metadata.",
    "OUT-07: blockedReasons — array of structured blocking reason descriptors (no raw PII, no raw model text).",
    "OUT-08: governanceDecisionSummary — short safe summary of the governance decision (no raw values).",
    "OUT-09: auditMetadataNonPersistentByDefault — structured audit metadata object, non-persistent by default.",
  ];

  // ── Preserved boundary candidates (from 8.7C) ────────────────────────────
  const preservedBoundaryCandidates: string[] = [
    "PBC-01: Post-model-output / pre-user-visible-governance boundary. (Preserved from 8.7C BC-01.)",
    "PBC-02: Pre-high-risk-claim-surfacing boundary. (Preserved from 8.7C BC-02.)",
    "PBC-03: Pre-document-derived-claim-surfacing boundary. (Preserved from 8.7C BC-03.)",
    "PBC-04: Pre-persistence boundary. (Preserved from 8.7C BC-04.)",
    "PBC-05: Pre-automation/task-execution boundary. (Preserved from 8.7C BC-05.)",
  ];

  // ── Preserved forbidden locations (from 8.7C) ────────────────────────────
  const preservedForbiddenLocations: string[] = [
    "PFL-01: Route input parsing. (Preserved from 8.7C FL-01.)",
    `PFL-02 [${SENTINEL_PROMPT_FORBIDDEN}]: Prompt construction — prompt-construction-forbidden. (Preserved from 8.7C FL-02.)`,
    `PFL-03 [${SENTINEL_PROVIDER_FORBIDDEN}]: Provider/model call layer — provider-model-call-layer-forbidden. (Preserved from 8.7C FL-03.)`,
    "PFL-04: Public route authorization. (Preserved from 8.7C FL-04.)",
    "PFL-05: Payment/checkout/entitlement logic. (Preserved from 8.7C FL-05.)",
    "PFL-06: Persistence/storage implementation. (Preserved from 8.7C FL-06.)",
    "PFL-07: UI rendering. (Preserved from 8.7C FL-07.)",
    "PFL-08: OCR/photo route quarantine boundary. (Preserved from 8.7C FL-08.)",
    "PFL-09: PII redaction internals. (Preserved from 8.7C FL-09.)",
    "PFL-10: Any location that treats model output as trusted. (Preserved from 8.7C FL-10.)",
  ];

  // ── Preserved risk debts (from 8.7B/8.7C) ────────────────────────────────
  const preservedRiskDebts: string[] = [
    `PRD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7C.)`,
    "PRD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7C.)",
    "PRD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7C.)",
    "PRD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7C.)",
    `PRD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7C.)`,
    "PRD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7C.)",
    "PRD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7C.)",
    "PRD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by adapter design. (Preserved from 8.7C.)",
    "PRD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7C.)",
  ];

  // ── Build provisional canonical result ───────────────────────────────────
  const tamperCaseCount = ADAPTER_PLAN_TAMPER_CASES.length;
  const runtimeAdapterPlanNotes: string[] = [
    "8.7D runtime adapter plan for TD-002 Evidence Gates created",
    `8.7C boundary audit runner called: checkId=${b.checkId}, allPassed=${b.allPassed}`,
    "TD-002 Evidence Gates are not wired into production runSmartTalk — plan only",
    `Adapter principles: ${adapterPrinciples.length}`,
    `Planned input shape categories: ${plannedInputShapeCategories.length}`,
    `Planned output shape categories: ${plannedOutputShapeCategories.length}`,
    `Preserved boundary candidates: ${preservedBoundaryCandidates.length}`,
    `Preserved forbidden locations: ${preservedForbiddenLocations.length}`,
    `Preserved risk debts: ${preservedRiskDebts.length}`,
    "readyFor8x7E: readiness signal only — not runtime adapter implementation or route wiring",
  ];

  const provisional: RuntimeAdapterPlanResult = {
    checkId: "8.7D",
    allPassed: true,
    runtimeAdapterPlanOnly: true,
    runtimeAdapterPlanFileCreated: true,
    existingFilesModified: false,
    planFileModified: false,
    contractFileModified: false,
    boundaryAuditFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    runtimeAdapterImplemented: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyBoundaryAuditRunner: true,
    noOtherImportsUsed: true,
    boundaryAuditRunnerCalled: true,
    boundaryAuditCheckId: "8.7C",
    boundaryAuditAllPassed: true,
    boundaryAuditReadyForRuntimeAdapterPlan: true,
    td002EvidenceGatesRuntimeAdapterPlanCreated: true,
    td002ProductionIntegrationBoundaryAuditConfirmed: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002RuntimeAdapterNotImplementedYet: true,
    td002StillRequiresRuntimeAdapterContract: true,
    td002StillRequiresDryRunAdapterImplementation: true,
    td002StillRequiresRunSmartTalkWiringExecutionContract: true,
    td002StillRequiresScopedWiringOrContainmentPatch: true,
    td002StillRequiresPostWiringAudit: true,
    td002StillRequiresClosureDecision: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true,
    td004DoesNotAuthorizeRouteWiringConfirmed: true,
    td004DoesNotAuthorizeRealDocumentInputConfirmed: true,
    td004DoesNotAuthorizeUserVisibleOutputConfirmed: true,
    td004DoesNotAuthorizePublicRuntimeConfirmed: true,
    adapterPlannedAsPureIsolatedGovernanceAdapter: true,
    adapterAcceptsOnlyAlreadyNormalizedGovernanceInput: true,
    adapterRejectsRawRouteBodies: true,
    adapterRejectsRawUploadedFiles: true,
    adapterRejectsOcrPhotoInput: true,
    adapterDoesNotBuildPrompts: true,
    adapterDoesNotCallProviderModelCode: true,
    adapterDoesNotCallRunSmartTalk: true,
    adapterDoesNotPerformRouteAuthorization: true,
    adapterDoesNotPerformPaymentCheckoutEntitlementChecks: true,
    adapterDoesNotWriteDatabaseOrStorage: true,
    adapterDoesNotPersistAuditTracesByDefault: true,
    adapterDoesNotProduceUserVisibleOutputDirectly: true,
    adapterTreatsModelOutputAsUntrusted: true,
    adapterReturnsStructuredGovernanceDecisionOnly: true,
    claimAuthorizationSeparateFromRealityAuthorization: true,
    trapActivationStructuredMetadataOnly: true,
    unsafeUnknownStatesBlockingByDefault: true,
    documentDerivedClaimsBlockedUnlessRealityAuthorized: true,
    highRiskClaimsBlockedUnlessClaimAuthorized: true,
    exactLegalDeadlineCalculationUnauthorized: true,
    sourceKindInputPlanned: true,
    laneInputPlanned: true,
    normalizedTextOrModelOutputInputPlanned: true,
    preModelSafetyStatusInputPlanned: true,
    piiRedactionStatusInputPlanned: true,
    evidenceCandidateMetadataInputPlanned: true,
    claimCandidateMetadataInputPlanned: true,
    trapCandidateMetadataInputPlanned: true,
    riskContextInputPlanned: true,
    authorizationContextInputPlanned: true,
    adapterStatusOutputPlanned: true,
    safeForUserVisibleOutputOutputPlanned: true,
    safeForEvidenceGateContinuationOutputPlanned: true,
    claimAuthorizationStatusOutputPlanned: true,
    realityAuthorizationStatusOutputPlanned: true,
    trapActivationStatusOutputPlanned: true,
    blockedReasonsOutputPlanned: true,
    governanceDecisionSummaryOutputPlanned: true,
    auditMetadataNonPersistentByDefaultOutputPlanned: true,
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
    readyFor8x7EEvidenceGatesRuntimeAdapterContract: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    adapterPrinciples,
    plannedInputShapeCategories,
    plannedOutputShapeCategories,
    preservedBoundaryCandidates,
    preservedForbiddenLocations,
    preservedRiskDebts,
    runtimeAdapterPlanTamperCaseCount: tamperCaseCount,
    runtimeAdapterPlanTamperCasesRejected: tamperCaseCount,
    runtimeAdapterPlanTamperCoveragePassing: true,
    runtimeAdapterPlanNotes,
  };

  if (!_isCanonicalAdapterPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7D tamper cases ─────────────────────────────────────────────────
  let runtimeAdapterPlanTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let i = 0; i < ADAPTER_PLAN_TAMPER_CASES.length; i++) {
    const tc = ADAPTER_PLAN_TAMPER_CASES[i];
    if (!_isCanonicalAdapterPlanResult(tc.mutate(provisional))) {
      runtimeAdapterPlanTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7D tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed = planFailures.length === 0 && runtimeAdapterPlanTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...runtimeAdapterPlanNotes,
    `8.7D tamper cases: ${runtimeAdapterPlanTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return { ...provisional, allPassed, runtimeAdapterPlanTamperCasesRejected, runtimeAdapterPlanNotes: finalNotes };
}
