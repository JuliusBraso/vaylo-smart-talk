/**
 * PHASE 8.7E — Evidence Gates Runtime Adapter Contract
 *
 * Runtime adapter contract for TD-002 Evidence Gates production wiring.
 *
 * Runtime-adapter-contract-only. This file:
 *   - Calls the 8.7D runtime adapter plan runner as the source of truth
 *   - Locks the scope of the future 8.7F dry-run adapter implementation
 *   - Locks adapter behavior contract clauses and input/output shape contract
 *   - Preserves boundary candidates, forbidden locations, and governance debts
 *
 * 8.7F is authorized only to implement:
 *   - An isolated pure dry-run adapter
 *   - Synthetic-only validation
 *   - Structured governance decision output
 *   - Fail-closed behavior for unsafe/unknown states
 *   - Local tamper coverage
 *
 * Still unauthorized after 8.7E:
 *   - Runtime adapter implementation
 *   - Route wiring / runSmartTalk modification
 *   - Real document input / user-visible output
 *   - Public / pilot / production / go-live runtime
 */

import { runControlledRealDocumentEvidenceGatesRuntimeAdapterPlan } from "./run-controlled-real-document-evidence-gates-runtime-adapter-plan";

// ─── Return type ──────────────────────────────────────────────────────────────

interface RuntimeAdapterContractResult {
  checkId: "8.7E";
  allPassed: boolean;
  runtimeAdapterContractOnly: true;
  runtimeAdapterContractFileCreated: true;
  existingFilesModified: false;
  productionWiringPlanFileModified: false;
  productionWiringContractFileModified: false;
  boundaryAuditFileModified: false;
  runtimeAdapterPlanFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  runtimeAdapterImplemented: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  importedOnlyRuntimeAdapterPlanRunner: true;
  noOtherImportsUsed: true;
  runtimeAdapterPlanRunnerCalled: true;
  runtimeAdapterPlanCheckId: "8.7D";
  runtimeAdapterPlanAllPassed: true;
  runtimeAdapterPlanReadyForContract: true;
  td002EvidenceGatesRuntimeAdapterContractCreated: true;
  td002RuntimeAdapterPlanConfirmed: true;
  td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true;
  td002EvidenceGatesProductionWiringNotImplementedYet: true;
  td002RuntimeAdapterNotImplementedYet: true;
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
  future8x7FMayImplementOnlyIsolatedDryRunAdapter: true;
  future8x7FMayUseOnlySyntheticValidation: true;
  future8x7FMayUseOnlyStructuredGovernanceInput: true;
  future8x7FMayReturnOnlyStructuredGovernanceDecisionOutput: true;
  future8x7FMustFailClosedForUnsafeUnknownStates: true;
  future8x7FMustIncludeTamperCoverage: true;
  future8x7FMustNotWireRoutes: true;
  future8x7FMustNotModifyRunSmartTalk: true;
  future8x7FMustNotImportRunSmartTalk: true;
  future8x7FMustNotExecuteRunSmartTalk: true;
  future8x7FMustNotBuildPrompts: true;
  future8x7FMustNotCallProviderModel: true;
  future8x7FMustNotProcessRealDocuments: true;
  future8x7FMustNotProduceUserVisibleOutput: true;
  future8x7FMustNotEnablePublicRuntime: true;
  future8x7FMustNotPersist: true;
  future8x7FMustNotEnablePaymentCheckoutEntitlement: true;
  future8x7FMustNotAuthorizePilotProductionGoLive: true;
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
  adapterAllowsUserVisibleOutputOnlyWithExplicitGovernanceAuthorization: true;
  claimAuthorizationSeparateFromRealityAuthorization: true;
  highRiskClaimsBlockedUnlessClaimAuthorized: true;
  documentDerivedClaimsBlockedUnlessRealityAuthorized: true;
  trapActivationStructuredMetadataOnly: true;
  coarseSubstringTrapHeuristicNotProductionReady: true;
  exactLegalDeadlineCalculationUnauthorized: true;
  structuredBlockedReasonsRequired: true;
  auditMetadataNonPersistentByDefaultRequired: true;
  sourceKindInputContracted: true;
  laneInputContracted: true;
  normalizedTextOrModelOutputInputContracted: true;
  preModelSafetyStatusInputContracted: true;
  piiRedactionStatusInputContracted: true;
  evidenceCandidateMetadataInputContracted: true;
  claimCandidateMetadataInputContracted: true;
  trapCandidateMetadataInputContracted: true;
  riskContextInputContracted: true;
  authorizationContextInputContracted: true;
  adapterStatusOutputContracted: true;
  safeForUserVisibleOutputOutputContracted: true;
  safeForEvidenceGateContinuationOutputContracted: true;
  claimAuthorizationStatusOutputContracted: true;
  realityAuthorizationStatusOutputContracted: true;
  trapActivationStatusOutputContracted: true;
  blockedReasonsOutputContracted: true;
  governanceDecisionSummaryOutputContracted: true;
  auditMetadataNonPersistentByDefaultOutputContracted: true;
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
  readyFor8x7FEvidenceGatesRuntimeAdapterDryRunImplementation: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  contractClauses: string[];
  future8x7FLockedScope: string[];
  adapterBehaviorContract: string[];
  contractedInputShapeCategories: string[];
  contractedOutputShapeCategories: string[];
  preservedBoundaryCandidates: string[];
  preservedForbiddenLocations: string[];
  preservedRiskDebts: string[];
  runtimeAdapterContractTamperCaseCount: number;
  runtimeAdapterContractTamperCasesRejected: number;
  runtimeAdapterContractTamperCoveragePassing: true;
  runtimeAdapterContractNotes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_CONTRACT_ONLY = "contract-only-no-implementation";
const SENTINEL_ISOLATED_DRY_RUN = "isolated-dry-run-adapter";
const SENTINEL_NO_ROUTE_WIRING = "no-route-wiring-8x7F";
const SENTINEL_NO_RST = "no-runSmartTalk-8x7F";
const SENTINEL_REJECT_RAW_ROUTE = "reject-raw-route-bodies";
const SENTINEL_BLOCK_USER_VISIBLE = "block-user-visible-output-by-default";
const SENTINEL_STRUCTURED_TRAP = "structured-trapCandidateMetadata-only";
const SENTINEL_NORMALIZED_TEXT = "normalizedTextOrModelOutput";
const SENTINEL_PII_STATUS = "piiRedactionStatus";
const SENTINEL_SAFE_USER_VISIBLE = "safeForUserVisibleOutput";
const SENTINEL_CLAIM_AUTH = "claimAuthorizationStatus";
const SENTINEL_PROMPT_FORBIDDEN = "prompt-construction-forbidden";
const SENTINEL_PROVIDER_FORBIDDEN = "provider-model-call-layer-forbidden";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical contract checker ───────────────────────────────────────────────

function _isCanonicalAdapterContractResult(r: RuntimeAdapterContractResult): boolean {
  if (r.checkId !== "8.7E") return false;
  if (r.allPassed !== true) return false;
  if (r.runtimeAdapterContractOnly !== true) return false;
  if (r.runtimeAdapterContractFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.productionWiringPlanFileModified !== false) return false;
  if (r.productionWiringContractFileModified !== false) return false;
  if (r.boundaryAuditFileModified !== false) return false;
  if (r.runtimeAdapterPlanFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.runtimeAdapterImplemented !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.importedOnlyRuntimeAdapterPlanRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.runtimeAdapterPlanRunnerCalled !== true) return false;
  if (r.runtimeAdapterPlanCheckId !== "8.7D") return false;
  if (r.runtimeAdapterPlanAllPassed !== true) return false;
  if (r.runtimeAdapterPlanReadyForContract !== true) return false;
  if (r.td002EvidenceGatesRuntimeAdapterContractCreated !== true) return false;
  if (r.td002RuntimeAdapterPlanConfirmed !== true) return false;
  if (r.td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.td002EvidenceGatesProductionWiringNotImplementedYet !== true) return false;
  if (r.td002RuntimeAdapterNotImplementedYet !== true) return false;
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
  if (r.future8x7FMayImplementOnlyIsolatedDryRunAdapter !== true) return false;
  if (r.future8x7FMayUseOnlySyntheticValidation !== true) return false;
  if (r.future8x7FMayUseOnlyStructuredGovernanceInput !== true) return false;
  if (r.future8x7FMayReturnOnlyStructuredGovernanceDecisionOutput !== true) return false;
  if (r.future8x7FMustFailClosedForUnsafeUnknownStates !== true) return false;
  if (r.future8x7FMustIncludeTamperCoverage !== true) return false;
  if (r.future8x7FMustNotWireRoutes !== true) return false;
  if (r.future8x7FMustNotModifyRunSmartTalk !== true) return false;
  if (r.future8x7FMustNotImportRunSmartTalk !== true) return false;
  if (r.future8x7FMustNotExecuteRunSmartTalk !== true) return false;
  if (r.future8x7FMustNotBuildPrompts !== true) return false;
  if (r.future8x7FMustNotCallProviderModel !== true) return false;
  if (r.future8x7FMustNotProcessRealDocuments !== true) return false;
  if (r.future8x7FMustNotProduceUserVisibleOutput !== true) return false;
  if (r.future8x7FMustNotEnablePublicRuntime !== true) return false;
  if (r.future8x7FMustNotPersist !== true) return false;
  if (r.future8x7FMustNotEnablePaymentCheckoutEntitlement !== true) return false;
  if (r.future8x7FMustNotAuthorizePilotProductionGoLive !== true) return false;
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
  if (r.adapterAllowsUserVisibleOutputOnlyWithExplicitGovernanceAuthorization !== true) return false;
  if (r.claimAuthorizationSeparateFromRealityAuthorization !== true) return false;
  if (r.highRiskClaimsBlockedUnlessClaimAuthorized !== true) return false;
  if (r.documentDerivedClaimsBlockedUnlessRealityAuthorized !== true) return false;
  if (r.trapActivationStructuredMetadataOnly !== true) return false;
  if (r.coarseSubstringTrapHeuristicNotProductionReady !== true) return false;
  if (r.exactLegalDeadlineCalculationUnauthorized !== true) return false;
  if (r.structuredBlockedReasonsRequired !== true) return false;
  if (r.auditMetadataNonPersistentByDefaultRequired !== true) return false;
  if (r.sourceKindInputContracted !== true) return false;
  if (r.laneInputContracted !== true) return false;
  if (r.normalizedTextOrModelOutputInputContracted !== true) return false;
  if (r.preModelSafetyStatusInputContracted !== true) return false;
  if (r.piiRedactionStatusInputContracted !== true) return false;
  if (r.evidenceCandidateMetadataInputContracted !== true) return false;
  if (r.claimCandidateMetadataInputContracted !== true) return false;
  if (r.trapCandidateMetadataInputContracted !== true) return false;
  if (r.riskContextInputContracted !== true) return false;
  if (r.authorizationContextInputContracted !== true) return false;
  if (r.adapterStatusOutputContracted !== true) return false;
  if (r.safeForUserVisibleOutputOutputContracted !== true) return false;
  if (r.safeForEvidenceGateContinuationOutputContracted !== true) return false;
  if (r.claimAuthorizationStatusOutputContracted !== true) return false;
  if (r.realityAuthorizationStatusOutputContracted !== true) return false;
  if (r.trapActivationStatusOutputContracted !== true) return false;
  if (r.blockedReasonsOutputContracted !== true) return false;
  if (r.governanceDecisionSummaryOutputContracted !== true) return false;
  if (r.auditMetadataNonPersistentByDefaultOutputContracted !== true) return false;
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
  if (r.readyFor8x7FEvidenceGatesRuntimeAdapterDryRunImplementation !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  // Array content checks
  if (!r.contractClauses || r.contractClauses.length === 0) return false;
  if (!r.future8x7FLockedScope || r.future8x7FLockedScope.length === 0) return false;
  if (!r.adapterBehaviorContract || r.adapterBehaviorContract.length === 0) return false;
  if (!r.contractedInputShapeCategories || r.contractedInputShapeCategories.length === 0) return false;
  if (!r.contractedOutputShapeCategories || r.contractedOutputShapeCategories.length === 0) return false;
  if (!r.preservedBoundaryCandidates || r.preservedBoundaryCandidates.length === 0) return false;
  if (!r.preservedForbiddenLocations || r.preservedForbiddenLocations.length === 0) return false;
  if (!r.preservedRiskDebts || r.preservedRiskDebts.length === 0) return false;
  if (!r.runtimeAdapterContractNotes || r.runtimeAdapterContractNotes.length === 0) return false;
  const clausesJ = r.contractClauses.join(" ");
  if (!clausesJ.includes(SENTINEL_CONTRACT_ONLY)) return false;
  const scopeJ = r.future8x7FLockedScope.join(" ");
  if (!scopeJ.includes(SENTINEL_ISOLATED_DRY_RUN)) return false;
  if (!scopeJ.includes(SENTINEL_NO_ROUTE_WIRING)) return false;
  if (!scopeJ.includes(SENTINEL_NO_RST)) return false;
  const behaviorJ = r.adapterBehaviorContract.join(" ");
  if (!behaviorJ.includes(SENTINEL_REJECT_RAW_ROUTE)) return false;
  if (!behaviorJ.includes(SENTINEL_BLOCK_USER_VISIBLE)) return false;
  if (!behaviorJ.includes(SENTINEL_STRUCTURED_TRAP)) return false;
  const inputJ = r.contractedInputShapeCategories.join(" ");
  if (!inputJ.includes(SENTINEL_NORMALIZED_TEXT)) return false;
  if (!inputJ.includes(SENTINEL_PII_STATUS)) return false;
  const outputJ = r.contractedOutputShapeCategories.join(" ");
  if (!outputJ.includes(SENTINEL_SAFE_USER_VISIBLE)) return false;
  if (!outputJ.includes(SENTINEL_CLAIM_AUTH)) return false;
  const forbiddenJ = r.preservedForbiddenLocations.join(" ");
  if (!forbiddenJ.includes(SENTINEL_PROMPT_FORBIDDEN)) return false;
  if (!forbiddenJ.includes(SENTINEL_PROVIDER_FORBIDDEN)) return false;
  const debtsJ = r.preservedRiskDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  if (r.runtimeAdapterContractTamperCasesRejected !== r.runtimeAdapterContractTamperCaseCount) return false;
  if (r.runtimeAdapterContractTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type ContractTamperMutation = (r: RuntimeAdapterContractResult) => RuntimeAdapterContractResult;
interface ContractTamperCase { label: string; mutate: ContractTamperMutation; }

const ADAPTER_CONTRACT_TAMPER_CASES: ContractTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7D" as "8.7E" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "runtimeAdapterContractOnly false", mutate: (r) => ({ ...r, runtimeAdapterContractOnly: false as true }) },
  { label: "runtimeAdapterContractFileCreated false", mutate: (r) => ({ ...r, runtimeAdapterContractFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "productionWiringPlanFileModified true", mutate: (r) => ({ ...r, productionWiringPlanFileModified: true as false }) },
  { label: "productionWiringContractFileModified true", mutate: (r) => ({ ...r, productionWiringContractFileModified: true as false }) },
  { label: "boundaryAuditFileModified true", mutate: (r) => ({ ...r, boundaryAuditFileModified: true as false }) },
  { label: "runtimeAdapterPlanFileModified true", mutate: (r) => ({ ...r, runtimeAdapterPlanFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "runtimeAdapterImplemented true", mutate: (r) => ({ ...r, runtimeAdapterImplemented: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "importedOnlyRuntimeAdapterPlanRunner false", mutate: (r) => ({ ...r, importedOnlyRuntimeAdapterPlanRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "runtimeAdapterPlanRunnerCalled false", mutate: (r) => ({ ...r, runtimeAdapterPlanRunnerCalled: false as true }) },
  { label: "runtimeAdapterPlanCheckId wrong", mutate: (r) => ({ ...r, runtimeAdapterPlanCheckId: "8.7C" as "8.7D" }) },
  { label: "runtimeAdapterPlanAllPassed false", mutate: (r) => ({ ...r, runtimeAdapterPlanAllPassed: false as true }) },
  { label: "runtimeAdapterPlanReadyForContract false", mutate: (r) => ({ ...r, runtimeAdapterPlanReadyForContract: false as true }) },
  { label: "td002EvidenceGatesRuntimeAdapterContractCreated false", mutate: (r) => ({ ...r, td002EvidenceGatesRuntimeAdapterContractCreated: false as true }) },
  { label: "td002RuntimeAdapterPlanConfirmed false", mutate: (r) => ({ ...r, td002RuntimeAdapterPlanConfirmed: false as true }) },
  { label: "td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "td002EvidenceGatesProductionWiringNotImplementedYet false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringNotImplementedYet: false as true }) },
  { label: "td002RuntimeAdapterNotImplementedYet false", mutate: (r) => ({ ...r, td002RuntimeAdapterNotImplementedYet: false as true }) },
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
  { label: "future8x7FMayImplementOnlyIsolatedDryRunAdapter false", mutate: (r) => ({ ...r, future8x7FMayImplementOnlyIsolatedDryRunAdapter: false as true }) },
  { label: "future8x7FMayUseOnlySyntheticValidation false", mutate: (r) => ({ ...r, future8x7FMayUseOnlySyntheticValidation: false as true }) },
  { label: "future8x7FMayUseOnlyStructuredGovernanceInput false", mutate: (r) => ({ ...r, future8x7FMayUseOnlyStructuredGovernanceInput: false as true }) },
  { label: "future8x7FMayReturnOnlyStructuredGovernanceDecisionOutput false", mutate: (r) => ({ ...r, future8x7FMayReturnOnlyStructuredGovernanceDecisionOutput: false as true }) },
  { label: "future8x7FMustFailClosedForUnsafeUnknownStates false", mutate: (r) => ({ ...r, future8x7FMustFailClosedForUnsafeUnknownStates: false as true }) },
  { label: "future8x7FMustIncludeTamperCoverage false", mutate: (r) => ({ ...r, future8x7FMustIncludeTamperCoverage: false as true }) },
  { label: "future8x7FMustNotWireRoutes false", mutate: (r) => ({ ...r, future8x7FMustNotWireRoutes: false as true }) },
  { label: "future8x7FMustNotModifyRunSmartTalk false", mutate: (r) => ({ ...r, future8x7FMustNotModifyRunSmartTalk: false as true }) },
  { label: "future8x7FMustNotImportRunSmartTalk false", mutate: (r) => ({ ...r, future8x7FMustNotImportRunSmartTalk: false as true }) },
  { label: "future8x7FMustNotExecuteRunSmartTalk false", mutate: (r) => ({ ...r, future8x7FMustNotExecuteRunSmartTalk: false as true }) },
  { label: "future8x7FMustNotBuildPrompts false", mutate: (r) => ({ ...r, future8x7FMustNotBuildPrompts: false as true }) },
  { label: "future8x7FMustNotCallProviderModel false", mutate: (r) => ({ ...r, future8x7FMustNotCallProviderModel: false as true }) },
  { label: "future8x7FMustNotProcessRealDocuments false", mutate: (r) => ({ ...r, future8x7FMustNotProcessRealDocuments: false as true }) },
  { label: "future8x7FMustNotProduceUserVisibleOutput false", mutate: (r) => ({ ...r, future8x7FMustNotProduceUserVisibleOutput: false as true }) },
  { label: "future8x7FMustNotEnablePublicRuntime false", mutate: (r) => ({ ...r, future8x7FMustNotEnablePublicRuntime: false as true }) },
  { label: "future8x7FMustNotPersist false", mutate: (r) => ({ ...r, future8x7FMustNotPersist: false as true }) },
  { label: "future8x7FMustNotEnablePaymentCheckoutEntitlement false", mutate: (r) => ({ ...r, future8x7FMustNotEnablePaymentCheckoutEntitlement: false as true }) },
  { label: "future8x7FMustNotAuthorizePilotProductionGoLive false", mutate: (r) => ({ ...r, future8x7FMustNotAuthorizePilotProductionGoLive: false as true }) },
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
  { label: "adapterAllowsUserVisibleOutputOnlyWithExplicitGovernanceAuthorization false", mutate: (r) => ({ ...r, adapterAllowsUserVisibleOutputOnlyWithExplicitGovernanceAuthorization: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "coarseSubstringTrapHeuristicNotProductionReady false", mutate: (r) => ({ ...r, coarseSubstringTrapHeuristicNotProductionReady: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorized false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorized: false as true }) },
  { label: "structuredBlockedReasonsRequired false", mutate: (r) => ({ ...r, structuredBlockedReasonsRequired: false as true }) },
  { label: "auditMetadataNonPersistentByDefaultRequired false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefaultRequired: false as true }) },
  { label: "sourceKindInputContracted false", mutate: (r) => ({ ...r, sourceKindInputContracted: false as true }) },
  { label: "laneInputContracted false", mutate: (r) => ({ ...r, laneInputContracted: false as true }) },
  { label: "normalizedTextOrModelOutputInputContracted false", mutate: (r) => ({ ...r, normalizedTextOrModelOutputInputContracted: false as true }) },
  { label: "preModelSafetyStatusInputContracted false", mutate: (r) => ({ ...r, preModelSafetyStatusInputContracted: false as true }) },
  { label: "piiRedactionStatusInputContracted false", mutate: (r) => ({ ...r, piiRedactionStatusInputContracted: false as true }) },
  { label: "evidenceCandidateMetadataInputContracted false", mutate: (r) => ({ ...r, evidenceCandidateMetadataInputContracted: false as true }) },
  { label: "claimCandidateMetadataInputContracted false", mutate: (r) => ({ ...r, claimCandidateMetadataInputContracted: false as true }) },
  { label: "trapCandidateMetadataInputContracted false", mutate: (r) => ({ ...r, trapCandidateMetadataInputContracted: false as true }) },
  { label: "riskContextInputContracted false", mutate: (r) => ({ ...r, riskContextInputContracted: false as true }) },
  { label: "authorizationContextInputContracted false", mutate: (r) => ({ ...r, authorizationContextInputContracted: false as true }) },
  { label: "adapterStatusOutputContracted false", mutate: (r) => ({ ...r, adapterStatusOutputContracted: false as true }) },
  { label: "safeForUserVisibleOutputOutputContracted false", mutate: (r) => ({ ...r, safeForUserVisibleOutputOutputContracted: false as true }) },
  { label: "safeForEvidenceGateContinuationOutputContracted false", mutate: (r) => ({ ...r, safeForEvidenceGateContinuationOutputContracted: false as true }) },
  { label: "claimAuthorizationStatusOutputContracted false", mutate: (r) => ({ ...r, claimAuthorizationStatusOutputContracted: false as true }) },
  { label: "realityAuthorizationStatusOutputContracted false", mutate: (r) => ({ ...r, realityAuthorizationStatusOutputContracted: false as true }) },
  { label: "trapActivationStatusOutputContracted false", mutate: (r) => ({ ...r, trapActivationStatusOutputContracted: false as true }) },
  { label: "blockedReasonsOutputContracted false", mutate: (r) => ({ ...r, blockedReasonsOutputContracted: false as true }) },
  { label: "governanceDecisionSummaryOutputContracted false", mutate: (r) => ({ ...r, governanceDecisionSummaryOutputContracted: false as true }) },
  { label: "auditMetadataNonPersistentByDefaultOutputContracted false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefaultOutputContracted: false as true }) },
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
  { label: "readyFor8x7FEvidenceGatesRuntimeAdapterDryRunImplementation false", mutate: (r) => ({ ...r, readyFor8x7FEvidenceGatesRuntimeAdapterDryRunImplementation: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "contractClauses empty", mutate: (r) => ({ ...r, contractClauses: [] }) },
  { label: "future8x7FLockedScope empty", mutate: (r) => ({ ...r, future8x7FLockedScope: [] }) },
  { label: "adapterBehaviorContract empty", mutate: (r) => ({ ...r, adapterBehaviorContract: [] }) },
  { label: "contractedInputShapeCategories empty", mutate: (r) => ({ ...r, contractedInputShapeCategories: [] }) },
  { label: "contractedOutputShapeCategories empty", mutate: (r) => ({ ...r, contractedOutputShapeCategories: [] }) },
  { label: "preservedBoundaryCandidates empty", mutate: (r) => ({ ...r, preservedBoundaryCandidates: [] }) },
  { label: "preservedForbiddenLocations empty", mutate: (r) => ({ ...r, preservedForbiddenLocations: [] }) },
  { label: "preservedRiskDebts empty", mutate: (r) => ({ ...r, preservedRiskDebts: [] }) },
  { label: "runtimeAdapterContractNotes empty", mutate: (r) => ({ ...r, runtimeAdapterContractNotes: [] }) },
  { label: "contractClauses missing contract-only sentinel", mutate: (r) => ({ ...r, contractClauses: r.contractClauses.map((c) => c.split(SENTINEL_CONTRACT_ONLY).join("omitted")) }) },
  { label: "future8x7FLockedScope missing isolated dry-run adapter sentinel", mutate: (r) => ({ ...r, future8x7FLockedScope: r.future8x7FLockedScope.map((s) => s.split(SENTINEL_ISOLATED_DRY_RUN).join("omitted")) }) },
  { label: "future8x7FLockedScope missing no route wiring sentinel", mutate: (r) => ({ ...r, future8x7FLockedScope: r.future8x7FLockedScope.map((s) => s.split(SENTINEL_NO_ROUTE_WIRING).join("omitted")) }) },
  { label: "future8x7FLockedScope missing no runSmartTalk sentinel", mutate: (r) => ({ ...r, future8x7FLockedScope: r.future8x7FLockedScope.map((s) => s.split(SENTINEL_NO_RST).join("omitted")) }) },
  { label: "adapterBehaviorContract missing reject raw route bodies sentinel", mutate: (r) => ({ ...r, adapterBehaviorContract: r.adapterBehaviorContract.map((b) => b.split(SENTINEL_REJECT_RAW_ROUTE).join("omitted")) }) },
  { label: "adapterBehaviorContract missing block user-visible output by default sentinel", mutate: (r) => ({ ...r, adapterBehaviorContract: r.adapterBehaviorContract.map((b) => b.split(SENTINEL_BLOCK_USER_VISIBLE).join("omitted")) }) },
  { label: "adapterBehaviorContract missing structured trap metadata sentinel", mutate: (r) => ({ ...r, adapterBehaviorContract: r.adapterBehaviorContract.map((b) => b.split(SENTINEL_STRUCTURED_TRAP).join("omitted")) }) },
  { label: "contractedInputShapeCategories missing normalizedTextOrModelOutput", mutate: (r) => ({ ...r, contractedInputShapeCategories: r.contractedInputShapeCategories.map((c) => c.split(SENTINEL_NORMALIZED_TEXT).join("omitted")) }) },
  { label: "contractedInputShapeCategories missing piiRedactionStatus", mutate: (r) => ({ ...r, contractedInputShapeCategories: r.contractedInputShapeCategories.map((c) => c.split(SENTINEL_PII_STATUS).join("omitted")) }) },
  { label: "contractedOutputShapeCategories missing safeForUserVisibleOutput", mutate: (r) => ({ ...r, contractedOutputShapeCategories: r.contractedOutputShapeCategories.map((c) => c.split(SENTINEL_SAFE_USER_VISIBLE).join("omitted")) }) },
  { label: "contractedOutputShapeCategories missing claimAuthorizationStatus", mutate: (r) => ({ ...r, contractedOutputShapeCategories: r.contractedOutputShapeCategories.map((c) => c.split(SENTINEL_CLAIM_AUTH).join("omitted")) }) },
  { label: "preservedForbiddenLocations missing prompt construction", mutate: (r) => ({ ...r, preservedForbiddenLocations: r.preservedForbiddenLocations.map((l) => l.split(SENTINEL_PROMPT_FORBIDDEN).join("omitted")) }) },
  { label: "preservedForbiddenLocations missing provider/model call layer", mutate: (r) => ({ ...r, preservedForbiddenLocations: r.preservedForbiddenLocations.map((l) => l.split(SENTINEL_PROVIDER_FORBIDDEN).join("omitted")) }) },
  { label: "preservedRiskDebts missing ClaimRule OR semantics", mutate: (r) => ({ ...r, preservedRiskDebts: r.preservedRiskDebts.map((d) => d.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedRiskDebts missing enforcementTrapHeuristic", mutate: (r) => ({ ...r, preservedRiskDebts: r.preservedRiskDebts.map((d) => d.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  { label: "runtimeAdapterContractTamperCasesRejected != count", mutate: (r) => ({ ...r, runtimeAdapterContractTamperCasesRejected: r.runtimeAdapterContractTamperCasesRejected - 1 }) },
  { label: "runtimeAdapterContractTamperCoveragePassing false", mutate: (r) => ({ ...r, runtimeAdapterContractTamperCoveragePassing: false as true }) },
];

// ─── Exported runtime adapter contract function ───────────────────────────────

/**
 * Runtime adapter contract for 8.7E — TD-002 Evidence Gates.
 *
 * Calls the 8.7D runtime adapter plan runner as the source of truth.
 * Locks the scope and behavior contract for the future 8.7F dry-run adapter.
 * readyFor8x7F is a readiness signal only — not adapter implementation or route wiring.
 */
export function runControlledRealDocumentEvidenceGatesRuntimeAdapterContract(): RuntimeAdapterContractResult {
  const contractFailures: string[] = [];

  // ── Call 8.7D runtime adapter plan runner as source of truth ─────────────
  const p = runControlledRealDocumentEvidenceGatesRuntimeAdapterPlan();

  if (p.checkId !== "8.7D") contractFailures.push(`adapter plan checkId mismatch: expected 8.7D, got ${p.checkId}`);
  if (p.allPassed !== true) contractFailures.push("adapter plan allPassed is not true");
  if (p.readyFor8x7EEvidenceGatesRuntimeAdapterContract !== true) contractFailures.push("adapter plan readyFor8x7E is not true");

  // ── Contract clauses ──────────────────────────────────────────────────────
  const contractClauses: string[] = [
    `CC-01 [${SENTINEL_CONTRACT_ONLY}]: This file is contract-only-no-implementation. The 8.7E phase creates the adapter contract only; no adapter code is written here.`,
    "CC-02: The runtime adapter contract locks the scope, behavior, and boundaries for the future 8.7F dry-run adapter implementation.",
    "CC-03: 8.7F may only implement an isolated pure dry-run adapter with synthetic-only validation.",
    "CC-04: 8.7F must not wire routes, must not modify runSmartTalk, and must not produce user-visible output.",
    "CC-05: The adapter must accept only already-normalized governance input validated by upstream pipeline stages.",
    "CC-06: The adapter must treat all model output as untrusted and block user-visible output by default.",
    "CC-07: Claim authorization and reality authorization must be evaluated on separate independent axes.",
    "CC-08: Trap activation must be driven exclusively by structured trapCandidateMetadata — coarse heuristics are not production-ready.",
    "CC-09: The adapter must return structured governance decision data only — no raw model text, no user-facing strings.",
    "CC-10: All authorization boundaries established through 8.7A–8.7E remain locked until future phases explicitly revise them.",
  ];

  // ── Future 8.7F locked scope ──────────────────────────────────────────────
  const future8x7FLockedScope: string[] = [
    `LS-01 [${SENTINEL_ISOLATED_DRY_RUN}]: 8.7F may implement only an isolated-dry-run-adapter — a pure function with no side effects.`,
    "LS-02: 8.7F may use only synthetic-only validation — no real documents, no real user input, no live pipeline data.",
    "LS-03: 8.7F may use only structured governance input types or local contract-shaped objects matching the contracted input categories.",
    "LS-04: 8.7F may return only structured governance decision output matching the contracted output categories.",
    "LS-05: 8.7F must include fail-closed behavior for unsafe/unknown states — unknown states must default to BLOCKED.",
    "LS-06: 8.7F must include local tamper coverage validating all returned governance decision fields.",
    `LS-07 [${SENTINEL_NO_ROUTE_WIRING}]: 8.7F must enforce no-route-wiring-8x7F — no route files may be modified, created, or wired.`,
    `LS-08 [${SENTINEL_NO_RST}]: 8.7F must enforce no-runSmartTalk-8x7F — runSmartTalk must not be modified, imported, or executed.`,
    "LS-09: 8.7F must not build prompts, must not call provider/model code, and must not process real documents.",
    "LS-10: 8.7F must not enable persistence, payment/checkout/entitlement runtime, or pilot/production/go-live authorization.",
  ];

  // ── Adapter behavior contract ─────────────────────────────────────────────
  const adapterBehaviorContract: string[] = [
    `ABC-01 [${SENTINEL_REJECT_RAW_ROUTE}]: The adapter must reject-raw-route-bodies — raw NextRequest or similar route body objects are never accepted.`,
    "ABC-02: The adapter must reject raw uploaded files and OCR/photo input — only already-normalized governance input is accepted.",
    "ABC-03: The adapter must reject direct user text unless it is already normalized and explicitly marked as governance input.",
    "ABC-04: The adapter must reject missing preModelSafetyStatus — it is a required governance input field.",
    "ABC-05: The adapter must reject missing piiRedactionStatus where the processing lane requires PII redaction.",
    "ABC-06: The adapter must block unsafe or unknown preModelSafetyStatus — fail-closed, not fail-open.",
    "ABC-07: The adapter must block unsafe or unknown piiRedactionStatus — fail-closed, not fail-open.",
    "ABC-08: The adapter must treat all model output as untrusted — no downstream governance data may be implicitly promoted.",
    `ABC-09 [${SENTINEL_BLOCK_USER_VISIBLE}]: The adapter must enforce block-user-visible-output-by-default — safeForUserVisibleOutput is false unless explicitly authorized.`,
    "ABC-10: safeForUserVisibleOutput may only be set true if explicitly authorized by governance evaluation — not by default.",
    "ABC-11: claimAuthorizationStatus and realityAuthorizationStatus must be evaluated separately and independently.",
    "ABC-12: High-risk claims must be blocked unless claim authorization explicitly succeeds.",
    "ABC-13: Document-derived claims must be blocked unless reality authorization explicitly succeeds.",
    `ABC-14 [${SENTINEL_STRUCTURED_TRAP}]: Trap activation must use structured-trapCandidateMetadata-only — coarse substring heuristics are explicitly prohibited.`,
    "ABC-15: The adapter must never compute or surface exact legal deadlines — exactLegalDeadlineCalculationUnauthorized.",
    "ABC-16: blockedReasons must be returned as structured reason descriptors — no raw model text or raw PII.",
    "ABC-17: auditMetadata must be non-persistent by default — persistence requires separate explicit authorization.",
  ];

  // ── Contracted input shape categories ────────────────────────────────────
  const contractedInputShapeCategories: string[] = [
    `CIN-01: sourceKind — discriminated source kind (contracted from 8.7D IN-01).`,
    "CIN-02: lane — processing lane discriminator (contracted from 8.7D IN-02).",
    `CIN-03: ${SENTINEL_NORMALIZED_TEXT} — already-normalized text or model output (contracted from 8.7D IN-03).`,
    "CIN-04: preModelSafetyStatus — upstream pre-model safety pass result; required (contracted from 8.7D IN-04).",
    `CIN-05: ${SENTINEL_PII_STATUS} — upstream PII redaction pass result; required where lane mandates it (contracted from 8.7D IN-05).`,
    "CIN-06: evidenceCandidateMetadata — structured candidate evidence annotations (contracted from 8.7D IN-06).",
    "CIN-07: claimCandidateMetadata — structured candidate claim descriptors (contracted from 8.7D IN-07).",
    "CIN-08: trapCandidateMetadata — structured candidate trap descriptors from governance metadata only (contracted from 8.7D IN-08).",
    "CIN-09: riskContext — risk context object with known risk signals (contracted from 8.7D IN-09).",
    "CIN-10: authorizationContext — authorization context object with current authorization flags (contracted from 8.7D IN-10).",
  ];

  // ── Contracted output shape categories ────────────────────────────────────
  const contractedOutputShapeCategories: string[] = [
    "COUT-01: adapterStatus — top-level evaluation status: PASSED | BLOCKED | ERROR (contracted from 8.7D OUT-01).",
    `COUT-02: ${SENTINEL_SAFE_USER_VISIBLE} — boolean gate; false by default; true only with explicit governance authorization (contracted from 8.7D OUT-02).`,
    "COUT-03: safeForEvidenceGateContinuation — boolean gate for Evidence Gate continuation (contracted from 8.7D OUT-03).",
    `COUT-04: ${SENTINEL_CLAIM_AUTH} — structured claim authorization evaluation result (contracted from 8.7D OUT-04).`,
    "COUT-05: realityAuthorizationStatus — structured reality authorization evaluation result (contracted from 8.7D OUT-05).",
    "COUT-06: trapActivationStatus — structured trap activation result from governance metadata (contracted from 8.7D OUT-06).",
    "COUT-07: blockedReasons — array of structured blocking reason descriptors (contracted from 8.7D OUT-07).",
    "COUT-08: governanceDecisionSummary — short safe summary of governance decision; no raw values (contracted from 8.7D OUT-08).",
    "COUT-09: auditMetadataNonPersistentByDefault — non-persistent governance audit metadata (contracted from 8.7D OUT-09).",
  ];

  // ── Preserved boundary candidates (from 8.7C/8.7D) ───────────────────────
  const preservedBoundaryCandidates: string[] = [
    "PBC-01: Post-model-output / pre-user-visible-governance boundary. (Preserved from 8.7D PBC-01.)",
    "PBC-02: Pre-high-risk-claim-surfacing boundary. (Preserved from 8.7D PBC-02.)",
    "PBC-03: Pre-document-derived-claim-surfacing boundary. (Preserved from 8.7D PBC-03.)",
    "PBC-04: Pre-persistence boundary. (Preserved from 8.7D PBC-04.)",
    "PBC-05: Pre-automation/task-execution boundary. (Preserved from 8.7D PBC-05.)",
  ];

  // ── Preserved forbidden locations (from 8.7C/8.7D) ───────────────────────
  const preservedForbiddenLocations: string[] = [
    "PFL-01: Route input parsing. (Preserved from 8.7D PFL-01.)",
    `PFL-02 [${SENTINEL_PROMPT_FORBIDDEN}]: Prompt construction — prompt-construction-forbidden. (Preserved from 8.7D PFL-02.)`,
    `PFL-03 [${SENTINEL_PROVIDER_FORBIDDEN}]: Provider/model call layer — provider-model-call-layer-forbidden. (Preserved from 8.7D PFL-03.)`,
    "PFL-04: Public route authorization. (Preserved from 8.7D PFL-04.)",
    "PFL-05: Payment/checkout/entitlement logic. (Preserved from 8.7D PFL-05.)",
    "PFL-06: Persistence/storage implementation. (Preserved from 8.7D PFL-06.)",
    "PFL-07: UI rendering. (Preserved from 8.7D PFL-07.)",
    "PFL-08: OCR/photo route quarantine boundary. (Preserved from 8.7D PFL-08.)",
    "PFL-09: PII redaction internals. (Preserved from 8.7D PFL-09.)",
    "PFL-10: Any location that treats model output as trusted. (Preserved from 8.7D PFL-10.)",
  ];

  // ── Preserved risk debts (from 8.7B/8.7C/8.7D) ───────────────────────────
  const preservedRiskDebts: string[] = [
    `PRD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7D.)`,
    "PRD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7D.)",
    "PRD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7D.)",
    "PRD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7D.)",
    `PRD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7D.)`,
    "PRD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7D.)",
    "PRD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7D.)",
    "PRD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by adapter design. (Preserved from 8.7D.)",
    "PRD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7D.)",
  ];

  // ── Build provisional canonical result ───────────────────────────────────
  const tamperCaseCount = ADAPTER_CONTRACT_TAMPER_CASES.length;
  const runtimeAdapterContractNotes: string[] = [
    "8.7E runtime adapter contract for TD-002 Evidence Gates created",
    `8.7D runtime adapter plan runner called: checkId=${p.checkId}, allPassed=${p.allPassed}`,
    "TD-002 Evidence Gates are not wired into production runSmartTalk — contract only",
    `Contract clauses: ${contractClauses.length}`,
    `Future 8.7F locked scope: ${future8x7FLockedScope.length}`,
    `Adapter behavior contract: ${adapterBehaviorContract.length}`,
    `Contracted input categories: ${contractedInputShapeCategories.length}`,
    `Contracted output categories: ${contractedOutputShapeCategories.length}`,
    `Preserved boundary candidates: ${preservedBoundaryCandidates.length}`,
    `Preserved forbidden locations: ${preservedForbiddenLocations.length}`,
    `Preserved risk debts: ${preservedRiskDebts.length}`,
    "readyFor8x7F: readiness signal only — not runtime adapter implementation, route wiring, or runtime authorization",
  ];

  const provisional: RuntimeAdapterContractResult = {
    checkId: "8.7E",
    allPassed: true,
    runtimeAdapterContractOnly: true,
    runtimeAdapterContractFileCreated: true,
    existingFilesModified: false,
    productionWiringPlanFileModified: false,
    productionWiringContractFileModified: false,
    boundaryAuditFileModified: false,
    runtimeAdapterPlanFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    runtimeAdapterImplemented: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyRuntimeAdapterPlanRunner: true,
    noOtherImportsUsed: true,
    runtimeAdapterPlanRunnerCalled: true,
    runtimeAdapterPlanCheckId: "8.7D",
    runtimeAdapterPlanAllPassed: true,
    runtimeAdapterPlanReadyForContract: true,
    td002EvidenceGatesRuntimeAdapterContractCreated: true,
    td002RuntimeAdapterPlanConfirmed: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002RuntimeAdapterNotImplementedYet: true,
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
    future8x7FMayImplementOnlyIsolatedDryRunAdapter: true,
    future8x7FMayUseOnlySyntheticValidation: true,
    future8x7FMayUseOnlyStructuredGovernanceInput: true,
    future8x7FMayReturnOnlyStructuredGovernanceDecisionOutput: true,
    future8x7FMustFailClosedForUnsafeUnknownStates: true,
    future8x7FMustIncludeTamperCoverage: true,
    future8x7FMustNotWireRoutes: true,
    future8x7FMustNotModifyRunSmartTalk: true,
    future8x7FMustNotImportRunSmartTalk: true,
    future8x7FMustNotExecuteRunSmartTalk: true,
    future8x7FMustNotBuildPrompts: true,
    future8x7FMustNotCallProviderModel: true,
    future8x7FMustNotProcessRealDocuments: true,
    future8x7FMustNotProduceUserVisibleOutput: true,
    future8x7FMustNotEnablePublicRuntime: true,
    future8x7FMustNotPersist: true,
    future8x7FMustNotEnablePaymentCheckoutEntitlement: true,
    future8x7FMustNotAuthorizePilotProductionGoLive: true,
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
    adapterAllowsUserVisibleOutputOnlyWithExplicitGovernanceAuthorization: true,
    claimAuthorizationSeparateFromRealityAuthorization: true,
    highRiskClaimsBlockedUnlessClaimAuthorized: true,
    documentDerivedClaimsBlockedUnlessRealityAuthorized: true,
    trapActivationStructuredMetadataOnly: true,
    coarseSubstringTrapHeuristicNotProductionReady: true,
    exactLegalDeadlineCalculationUnauthorized: true,
    structuredBlockedReasonsRequired: true,
    auditMetadataNonPersistentByDefaultRequired: true,
    sourceKindInputContracted: true,
    laneInputContracted: true,
    normalizedTextOrModelOutputInputContracted: true,
    preModelSafetyStatusInputContracted: true,
    piiRedactionStatusInputContracted: true,
    evidenceCandidateMetadataInputContracted: true,
    claimCandidateMetadataInputContracted: true,
    trapCandidateMetadataInputContracted: true,
    riskContextInputContracted: true,
    authorizationContextInputContracted: true,
    adapterStatusOutputContracted: true,
    safeForUserVisibleOutputOutputContracted: true,
    safeForEvidenceGateContinuationOutputContracted: true,
    claimAuthorizationStatusOutputContracted: true,
    realityAuthorizationStatusOutputContracted: true,
    trapActivationStatusOutputContracted: true,
    blockedReasonsOutputContracted: true,
    governanceDecisionSummaryOutputContracted: true,
    auditMetadataNonPersistentByDefaultOutputContracted: true,
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
    readyFor8x7FEvidenceGatesRuntimeAdapterDryRunImplementation: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    contractClauses,
    future8x7FLockedScope,
    adapterBehaviorContract,
    contractedInputShapeCategories,
    contractedOutputShapeCategories,
    preservedBoundaryCandidates,
    preservedForbiddenLocations,
    preservedRiskDebts,
    runtimeAdapterContractTamperCaseCount: tamperCaseCount,
    runtimeAdapterContractTamperCasesRejected: tamperCaseCount,
    runtimeAdapterContractTamperCoveragePassing: true,
    runtimeAdapterContractNotes,
  };

  if (!_isCanonicalAdapterContractResult(provisional)) {
    contractFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7E tamper cases ─────────────────────────────────────────────────
  let runtimeAdapterContractTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let i = 0; i < ADAPTER_CONTRACT_TAMPER_CASES.length; i++) {
    const tc = ADAPTER_CONTRACT_TAMPER_CASES[i];
    if (!_isCanonicalAdapterContractResult(tc.mutate(provisional))) {
      runtimeAdapterContractTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7E tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) contractFailures.push(...tamperFailures);

  const allPassed = contractFailures.length === 0 && runtimeAdapterContractTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...runtimeAdapterContractNotes,
    `8.7E tamper cases: ${runtimeAdapterContractTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(contractFailures.length > 0 ? [`FAILURES (${contractFailures.length}):`, ...contractFailures] : []),
  ];

  return { ...provisional, allPassed, runtimeAdapterContractTamperCasesRejected, runtimeAdapterContractNotes: finalNotes };
}
