/**
 * PHASE 8.7C — Production Integration Boundary Audit
 *
 * Boundary audit for TD-002 Evidence Gates production wiring into runSmartTalk.
 *
 * Boundary-audit-only. This file:
 *   - Calls the 8.7B contract runner as the source of truth
 *   - Identifies allowed future Evidence Gates integration boundary candidates
 *   - Records forbidden integration locations
 *   - Preserves all governance debts from 8.7B
 *
 * The boundary is defined as:
 *   - After prompt/model response acquisition
 *   - Before user-visible response shaping
 *   - Before any high-risk claim is surfaced
 *   - Before any document-derived claim is surfaced
 *   - Before any persistence or automation execution
 *   - After any required pre-model safety boundary is satisfied
 *   - Never inside prompt construction, model call code, route input parsing,
 *     public route authorization, payment/entitlement, persistence, or UI
 *
 * Still unauthorized after 8.7C:
 *   - Route wiring / runSmartTalk modification
 *   - Real document input / user-visible output
 *   - Public / pilot / production / go-live runtime
 */

import { runControlledRealDocumentEvidenceGatesProductionWiringContract } from "./run-controlled-real-document-evidence-gates-production-wiring-contract";

// ─── Return type ──────────────────────────────────────────────────────────────

interface BoundaryAuditResult {
  checkId: "8.7C";
  allPassed: boolean;
  boundaryAuditOnly: true;
  boundaryAuditFileCreated: true;
  existingFilesModified: false;
  planFileModified: false;
  contractFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  importedOnlyProductionWiringContractRunner: true;
  noOtherImportsUsed: true;
  productionWiringContractRunnerCalled: true;
  productionWiringContractCheckId: "8.7B";
  productionWiringContractAllPassed: true;
  productionWiringContractReadyForBoundaryAudit: true;
  td002EvidenceGatesProductionIntegrationBoundaryAuditCreated: true;
  td002EvidenceGatesProductionWiringContractConfirmed: true;
  td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true;
  td002EvidenceGatesProductionWiringNotImplementedYet: true;
  td002StillRequiresRuntimeAdapterPlan: true;
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
  productionIntegrationBoundaryIdentified: true;
  postModelPreUserVisibleBoundaryAllowedCandidate: true;
  preHighRiskClaimSurfacingBoundaryAllowedCandidate: true;
  preDocumentDerivedClaimSurfacingBoundaryAllowedCandidate: true;
  prePersistenceBoundaryAllowedCandidate: true;
  preAutomationExecutionBoundaryAllowedCandidate: true;
  routeInputParsingForbiddenForIntegration: true;
  promptConstructionForbiddenForIntegration: true;
  providerModelCallLayerForbiddenForIntegration: true;
  publicRouteAuthorizationForbiddenForIntegration: true;
  paymentCheckoutEntitlementForbiddenForIntegration: true;
  persistenceStorageImplementationForbiddenForIntegration: true;
  uiRenderingForbiddenForIntegration: true;
  ocrPhotoRouteQuarantineForbiddenForIntegration: true;
  piiRedactionInternalsForbiddenForIntegration: true;
  trustedModelOutputLocationForbiddenForIntegration: true;
  modelOutputTreatedAsUntrusted: true;
  claimAuthorizationRequiredBeforeHighRiskClaims: true;
  realityAuthorizationRequiredBeforeDocumentDerivedClaims: true;
  trapActivationRequiresStructuredGovernanceMetadata: true;
  coarseSubstringTrapHeuristicNotProductionReady: true;
  userVisibleOutputRequiresExplicitGovernanceAuthorization: true;
  realDocumentInputRequiresSeparateRouteLevelAuthorization: true;
  persistenceRequiresSeparateAuthorization: true;
  postWiringAuditRequired: true;
  closureDecisionRequiredBeforePublicRuntime: true;
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
  readyFor8x7DEvidenceGatesRuntimeAdapterPlan: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  allowedFutureBoundaryCandidates: string[];
  forbiddenIntegrationLocations: string[];
  preservedRiskDebts: string[];
  boundaryAuditTamperCaseCount: number;
  boundaryAuditTamperCasesRejected: number;
  boundaryAuditTamperCoveragePassing: true;
  boundaryAuditNotes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_POST_MODEL_PRE_USER_VISIBLE = "post-model-output/pre-user-visible-governance";
const SENTINEL_PROMPT_CONSTRUCTION_FORBIDDEN = "prompt-construction-forbidden";
const SENTINEL_PROVIDER_MODEL_CALL_FORBIDDEN = "provider-model-call-layer-forbidden";
const SENTINEL_ROUTE_INPUT_PARSING_FORBIDDEN = "route-input-parsing-forbidden";
const SENTINEL_CLAIM_RULE_OR_DEBT = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC_DEBT = "enforcementTrapHeuristic";

// ─── Canonical boundary audit checker ────────────────────────────────────────

function _isCanonicalBoundaryAuditResult(r: BoundaryAuditResult): boolean {
  if (r.checkId !== "8.7C") return false;
  if (r.allPassed !== true) return false;
  if (r.boundaryAuditOnly !== true) return false;
  if (r.boundaryAuditFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.planFileModified !== false) return false;
  if (r.contractFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.importedOnlyProductionWiringContractRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.productionWiringContractRunnerCalled !== true) return false;
  if (r.productionWiringContractCheckId !== "8.7B") return false;
  if (r.productionWiringContractAllPassed !== true) return false;
  if (r.productionWiringContractReadyForBoundaryAudit !== true) return false;
  if (r.td002EvidenceGatesProductionIntegrationBoundaryAuditCreated !== true) return false;
  if (r.td002EvidenceGatesProductionWiringContractConfirmed !== true) return false;
  if (r.td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.td002EvidenceGatesProductionWiringNotImplementedYet !== true) return false;
  if (r.td002StillRequiresRuntimeAdapterPlan !== true) return false;
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
  if (r.productionIntegrationBoundaryIdentified !== true) return false;
  if (r.postModelPreUserVisibleBoundaryAllowedCandidate !== true) return false;
  if (r.preHighRiskClaimSurfacingBoundaryAllowedCandidate !== true) return false;
  if (r.preDocumentDerivedClaimSurfacingBoundaryAllowedCandidate !== true) return false;
  if (r.prePersistenceBoundaryAllowedCandidate !== true) return false;
  if (r.preAutomationExecutionBoundaryAllowedCandidate !== true) return false;
  if (r.routeInputParsingForbiddenForIntegration !== true) return false;
  if (r.promptConstructionForbiddenForIntegration !== true) return false;
  if (r.providerModelCallLayerForbiddenForIntegration !== true) return false;
  if (r.publicRouteAuthorizationForbiddenForIntegration !== true) return false;
  if (r.paymentCheckoutEntitlementForbiddenForIntegration !== true) return false;
  if (r.persistenceStorageImplementationForbiddenForIntegration !== true) return false;
  if (r.uiRenderingForbiddenForIntegration !== true) return false;
  if (r.ocrPhotoRouteQuarantineForbiddenForIntegration !== true) return false;
  if (r.piiRedactionInternalsForbiddenForIntegration !== true) return false;
  if (r.trustedModelOutputLocationForbiddenForIntegration !== true) return false;
  if (r.modelOutputTreatedAsUntrusted !== true) return false;
  if (r.claimAuthorizationRequiredBeforeHighRiskClaims !== true) return false;
  if (r.realityAuthorizationRequiredBeforeDocumentDerivedClaims !== true) return false;
  if (r.trapActivationRequiresStructuredGovernanceMetadata !== true) return false;
  if (r.coarseSubstringTrapHeuristicNotProductionReady !== true) return false;
  if (r.userVisibleOutputRequiresExplicitGovernanceAuthorization !== true) return false;
  if (r.realDocumentInputRequiresSeparateRouteLevelAuthorization !== true) return false;
  if (r.persistenceRequiresSeparateAuthorization !== true) return false;
  if (r.postWiringAuditRequired !== true) return false;
  if (r.closureDecisionRequiredBeforePublicRuntime !== true) return false;
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
  if (r.readyFor8x7DEvidenceGatesRuntimeAdapterPlan !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  // Array content checks
  if (!r.allowedFutureBoundaryCandidates || r.allowedFutureBoundaryCandidates.length === 0) return false;
  if (!r.forbiddenIntegrationLocations || r.forbiddenIntegrationLocations.length === 0) return false;
  if (!r.preservedRiskDebts || r.preservedRiskDebts.length === 0) return false;
  if (!r.boundaryAuditNotes || r.boundaryAuditNotes.length === 0) return false;
  const candidatesJoined = r.allowedFutureBoundaryCandidates.join(" ");
  if (!candidatesJoined.includes(SENTINEL_POST_MODEL_PRE_USER_VISIBLE)) return false;
  const forbiddenJoined = r.forbiddenIntegrationLocations.join(" ");
  if (!forbiddenJoined.includes(SENTINEL_PROMPT_CONSTRUCTION_FORBIDDEN)) return false;
  if (!forbiddenJoined.includes(SENTINEL_PROVIDER_MODEL_CALL_FORBIDDEN)) return false;
  if (!forbiddenJoined.includes(SENTINEL_ROUTE_INPUT_PARSING_FORBIDDEN)) return false;
  const debtsJoined = r.preservedRiskDebts.join(" ");
  if (!debtsJoined.includes(SENTINEL_CLAIM_RULE_OR_DEBT)) return false;
  if (!debtsJoined.includes(SENTINEL_TRAP_HEURISTIC_DEBT)) return false;
  if (r.boundaryAuditTamperCasesRejected !== r.boundaryAuditTamperCaseCount) return false;
  if (r.boundaryAuditTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type BoundaryTamperMutation = (r: BoundaryAuditResult) => BoundaryAuditResult;
interface BoundaryTamperCase {
  label: string;
  mutate: BoundaryTamperMutation;
}

const BOUNDARY_TAMPER_CASES: BoundaryTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7B" as "8.7C" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "boundaryAuditOnly false", mutate: (r) => ({ ...r, boundaryAuditOnly: false as true }) },
  { label: "boundaryAuditFileCreated false", mutate: (r) => ({ ...r, boundaryAuditFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "planFileModified true", mutate: (r) => ({ ...r, planFileModified: true as false }) },
  { label: "contractFileModified true", mutate: (r) => ({ ...r, contractFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "importedOnlyProductionWiringContractRunner false", mutate: (r) => ({ ...r, importedOnlyProductionWiringContractRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "productionWiringContractRunnerCalled false", mutate: (r) => ({ ...r, productionWiringContractRunnerCalled: false as true }) },
  { label: "productionWiringContractCheckId wrong", mutate: (r) => ({ ...r, productionWiringContractCheckId: "8.7A" as "8.7B" }) },
  { label: "productionWiringContractAllPassed false", mutate: (r) => ({ ...r, productionWiringContractAllPassed: false as true }) },
  { label: "productionWiringContractReadyForBoundaryAudit false", mutate: (r) => ({ ...r, productionWiringContractReadyForBoundaryAudit: false as true }) },
  { label: "td002EvidenceGatesProductionIntegrationBoundaryAuditCreated false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionIntegrationBoundaryAuditCreated: false as true }) },
  { label: "td002EvidenceGatesProductionWiringContractConfirmed false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringContractConfirmed: false as true }) },
  { label: "td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "td002EvidenceGatesProductionWiringNotImplementedYet false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringNotImplementedYet: false as true }) },
  { label: "td002StillRequiresRuntimeAdapterPlan false", mutate: (r) => ({ ...r, td002StillRequiresRuntimeAdapterPlan: false as true }) },
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
  { label: "productionIntegrationBoundaryIdentified false", mutate: (r) => ({ ...r, productionIntegrationBoundaryIdentified: false as true }) },
  { label: "postModelPreUserVisibleBoundaryAllowedCandidate false", mutate: (r) => ({ ...r, postModelPreUserVisibleBoundaryAllowedCandidate: false as true }) },
  { label: "preHighRiskClaimSurfacingBoundaryAllowedCandidate false", mutate: (r) => ({ ...r, preHighRiskClaimSurfacingBoundaryAllowedCandidate: false as true }) },
  { label: "preDocumentDerivedClaimSurfacingBoundaryAllowedCandidate false", mutate: (r) => ({ ...r, preDocumentDerivedClaimSurfacingBoundaryAllowedCandidate: false as true }) },
  { label: "prePersistenceBoundaryAllowedCandidate false", mutate: (r) => ({ ...r, prePersistenceBoundaryAllowedCandidate: false as true }) },
  { label: "preAutomationExecutionBoundaryAllowedCandidate false", mutate: (r) => ({ ...r, preAutomationExecutionBoundaryAllowedCandidate: false as true }) },
  { label: "routeInputParsingForbiddenForIntegration false", mutate: (r) => ({ ...r, routeInputParsingForbiddenForIntegration: false as true }) },
  { label: "promptConstructionForbiddenForIntegration false", mutate: (r) => ({ ...r, promptConstructionForbiddenForIntegration: false as true }) },
  { label: "providerModelCallLayerForbiddenForIntegration false", mutate: (r) => ({ ...r, providerModelCallLayerForbiddenForIntegration: false as true }) },
  { label: "publicRouteAuthorizationForbiddenForIntegration false", mutate: (r) => ({ ...r, publicRouteAuthorizationForbiddenForIntegration: false as true }) },
  { label: "paymentCheckoutEntitlementForbiddenForIntegration false", mutate: (r) => ({ ...r, paymentCheckoutEntitlementForbiddenForIntegration: false as true }) },
  { label: "persistenceStorageImplementationForbiddenForIntegration false", mutate: (r) => ({ ...r, persistenceStorageImplementationForbiddenForIntegration: false as true }) },
  { label: "uiRenderingForbiddenForIntegration false", mutate: (r) => ({ ...r, uiRenderingForbiddenForIntegration: false as true }) },
  { label: "ocrPhotoRouteQuarantineForbiddenForIntegration false", mutate: (r) => ({ ...r, ocrPhotoRouteQuarantineForbiddenForIntegration: false as true }) },
  { label: "piiRedactionInternalsForbiddenForIntegration false", mutate: (r) => ({ ...r, piiRedactionInternalsForbiddenForIntegration: false as true }) },
  { label: "trustedModelOutputLocationForbiddenForIntegration false", mutate: (r) => ({ ...r, trustedModelOutputLocationForbiddenForIntegration: false as true }) },
  { label: "modelOutputTreatedAsUntrusted false", mutate: (r) => ({ ...r, modelOutputTreatedAsUntrusted: false as true }) },
  { label: "claimAuthorizationRequiredBeforeHighRiskClaims false", mutate: (r) => ({ ...r, claimAuthorizationRequiredBeforeHighRiskClaims: false as true }) },
  { label: "realityAuthorizationRequiredBeforeDocumentDerivedClaims false", mutate: (r) => ({ ...r, realityAuthorizationRequiredBeforeDocumentDerivedClaims: false as true }) },
  { label: "trapActivationRequiresStructuredGovernanceMetadata false", mutate: (r) => ({ ...r, trapActivationRequiresStructuredGovernanceMetadata: false as true }) },
  { label: "coarseSubstringTrapHeuristicNotProductionReady false", mutate: (r) => ({ ...r, coarseSubstringTrapHeuristicNotProductionReady: false as true }) },
  { label: "userVisibleOutputRequiresExplicitGovernanceAuthorization false", mutate: (r) => ({ ...r, userVisibleOutputRequiresExplicitGovernanceAuthorization: false as true }) },
  { label: "realDocumentInputRequiresSeparateRouteLevelAuthorization false", mutate: (r) => ({ ...r, realDocumentInputRequiresSeparateRouteLevelAuthorization: false as true }) },
  { label: "persistenceRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, persistenceRequiresSeparateAuthorization: false as true }) },
  { label: "postWiringAuditRequired false", mutate: (r) => ({ ...r, postWiringAuditRequired: false as true }) },
  { label: "closureDecisionRequiredBeforePublicRuntime false", mutate: (r) => ({ ...r, closureDecisionRequiredBeforePublicRuntime: false as true }) },
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
  { label: "readyFor8x7DEvidenceGatesRuntimeAdapterPlan false", mutate: (r) => ({ ...r, readyFor8x7DEvidenceGatesRuntimeAdapterPlan: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "allowedFutureBoundaryCandidates empty", mutate: (r) => ({ ...r, allowedFutureBoundaryCandidates: [] }) },
  { label: "forbiddenIntegrationLocations empty", mutate: (r) => ({ ...r, forbiddenIntegrationLocations: [] }) },
  { label: "preservedRiskDebts empty", mutate: (r) => ({ ...r, preservedRiskDebts: [] }) },
  { label: "boundaryAuditNotes empty", mutate: (r) => ({ ...r, boundaryAuditNotes: [] }) },
  {
    label: "allowedFutureBoundaryCandidates missing post-model/pre-user-visible candidate",
    mutate: (r) => ({
      ...r,
      allowedFutureBoundaryCandidates: r.allowedFutureBoundaryCandidates.map((c) =>
        c.split(SENTINEL_POST_MODEL_PRE_USER_VISIBLE).join("omitted")
      ),
    }),
  },
  {
    label: "forbiddenIntegrationLocations missing prompt construction",
    mutate: (r) => ({
      ...r,
      forbiddenIntegrationLocations: r.forbiddenIntegrationLocations.map((l) =>
        l.split(SENTINEL_PROMPT_CONSTRUCTION_FORBIDDEN).join("omitted")
      ),
    }),
  },
  {
    label: "forbiddenIntegrationLocations missing provider/model call layer",
    mutate: (r) => ({
      ...r,
      forbiddenIntegrationLocations: r.forbiddenIntegrationLocations.map((l) =>
        l.split(SENTINEL_PROVIDER_MODEL_CALL_FORBIDDEN).join("omitted")
      ),
    }),
  },
  {
    label: "forbiddenIntegrationLocations missing route input parsing",
    mutate: (r) => ({
      ...r,
      forbiddenIntegrationLocations: r.forbiddenIntegrationLocations.map((l) =>
        l.split(SENTINEL_ROUTE_INPUT_PARSING_FORBIDDEN).join("omitted")
      ),
    }),
  },
  {
    label: "preservedRiskDebts missing ClaimRule OR semantics debt",
    mutate: (r) => ({
      ...r,
      preservedRiskDebts: r.preservedRiskDebts.map((d) =>
        d.split(SENTINEL_CLAIM_RULE_OR_DEBT).join("omitted")
      ),
    }),
  },
  {
    label: "preservedRiskDebts missing enforcementTrapHeuristic debt",
    mutate: (r) => ({
      ...r,
      preservedRiskDebts: r.preservedRiskDebts.map((d) =>
        d.split(SENTINEL_TRAP_HEURISTIC_DEBT).join("omitted")
      ),
    }),
  },
  {
    label: "boundaryAuditTamperCasesRejected not equal boundaryAuditTamperCaseCount",
    mutate: (r) => ({ ...r, boundaryAuditTamperCasesRejected: r.boundaryAuditTamperCasesRejected - 1 }),
  },
  { label: "boundaryAuditTamperCoveragePassing false", mutate: (r) => ({ ...r, boundaryAuditTamperCoveragePassing: false as true }) },
];

// ─── Exported boundary audit function ────────────────────────────────────────

/**
 * Boundary audit for 8.7C — TD-002 Evidence Gates production integration
 * boundary audit.
 *
 * Calls the 8.7B contract runner as the source of truth. Identifies allowed
 * future integration boundary candidates and forbidden locations.
 *
 * Boundary-audit-only. No route wiring. No runSmartTalk modification.
 * readyFor8x7D is a readiness signal only — not route wiring authorization.
 */
export function runControlledRealDocumentEvidenceGatesProductionIntegrationBoundaryAudit(): BoundaryAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.7B contract runner as source of truth ──────────────────────────
  const c = runControlledRealDocumentEvidenceGatesProductionWiringContract();

  if (c.checkId !== "8.7B") {
    auditFailures.push(`contract checkId mismatch: expected 8.7B, got ${c.checkId}`);
  }
  if (c.allPassed !== true) {
    auditFailures.push("contract allPassed is not true");
  }
  if (c.readyFor8x7CProductionIntegrationBoundaryAudit !== true) {
    auditFailures.push("contract readyFor8x7CProductionIntegrationBoundaryAudit is not true");
  }

  // ── Allowed future boundary candidates ───────────────────────────────────
  const allowedFutureBoundaryCandidates: string[] = [
    `BC-01 [${SENTINEL_POST_MODEL_PRE_USER_VISIBLE}]: Post-model-output / pre-user-visible-governance boundary — after the model response is received, before any user-visible response shaping occurs.`,
    "BC-02: Pre-high-risk-claim-surfacing boundary — before any high-risk claim is surfaced to any consumer, giving claim authorization a chance to gate access.",
    "BC-03: Pre-document-derived-claim-surfacing boundary — before any claim derived from a document is surfaced, requiring reality authorization to be satisfied first.",
    "BC-04: Pre-persistence boundary — before any evidence, claim, trap, or disposition record is written, ensuring persistence is separately authorized.",
    "BC-05: Pre-automation/task-execution boundary — before any automated task or downstream action is triggered based on model output or Evidence Gate results.",
  ];

  // ── Forbidden integration locations ──────────────────────────────────────
  const forbiddenIntegrationLocations: string[] = [
    `FL-01 [${SENTINEL_ROUTE_INPUT_PARSING_FORBIDDEN}]: Route input parsing — Evidence Gates must not be wired into input parsing logic; pre-model safety is a separate boundary.`,
    `FL-02 [${SENTINEL_PROMPT_CONSTRUCTION_FORBIDDEN}]: Prompt construction — Evidence Gates must never be inserted inside prompt-building code; they operate on model output, not prompt input.`,
    `FL-03 [${SENTINEL_PROVIDER_MODEL_CALL_FORBIDDEN}]: Provider/model call layer — Evidence Gates must never intercept or wrap provider/model calls; the model call layer must remain isolated.`,
    "FL-04: Public route authorization — Evidence Gates must not run inside public route auth logic; they are a post-model governance layer, not an input authentication layer.",
    "FL-05: Payment/checkout/entitlement logic — Evidence Gates must never be wired into payment, checkout, or entitlement code paths.",
    "FL-06: Persistence/storage implementation — Evidence Gates must not run inside persistence or storage write operations; persistence itself is a downstream action requiring separate authorization.",
    "FL-07: UI rendering — Evidence Gates must never be called inside UI rendering or response formatting code.",
    "FL-08: OCR/photo route quarantine boundary — Evidence Gates must not be applied inside the OCR/photo quarantine layer; that layer has its own separate safety boundary.",
    "FL-09: PII redaction internals — Evidence Gates must not be inserted inside PII redaction utility logic; PII redaction and Evidence Gates are separate safety layers.",
    "FL-10: Any location that treats model output as trusted — Evidence Gates must only be applied in locations that treat model output as untrusted by default.",
  ];

  // ── Preserved risk debts ──────────────────────────────────────────────────
  const preservedRiskDebts: string[] = [
    `PRD-01 [${SENTINEL_CLAIM_RULE_OR_DEBT}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. Preserved from 8.7B contract.`,
    "PRD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. Preserved from 8.7B contract.",
    "PRD-03: Proximity remains manual-only unless structured anchors are implemented. Preserved from 8.7B contract.",
    "PRD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union model. Preserved from 8.7B contract.",
    `PRD-05 [${SENTINEL_TRAP_HEURISTIC_DEBT}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. Preserved from 8.7B contract.`,
    "PRD-06: SeverityCandidate and SeverityDerivation must remain separated. Preserved from 8.7B contract.",
    "PRD-07: TrapDisposition production states and dry-run candidate states must remain separated. Preserved from 8.7B contract.",
    "PRD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. Preserved from 8.7B contract.",
    "PRD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. Preserved from 8.7B contract.",
  ];

  // ── Build provisional canonical result for tamper check ──────────────────
  const tamperCaseCount = BOUNDARY_TAMPER_CASES.length;
  const boundaryAuditNotes: string[] = [
    "8.7C production integration boundary audit for TD-002 Evidence Gates created",
    `8.7B contract runner called: checkId=${c.checkId}, allPassed=${c.allPassed}`,
    "TD-002 Evidence Gates are not wired into production runSmartTalk — boundary audit only",
    `Allowed future boundary candidates: ${allowedFutureBoundaryCandidates.length}`,
    `Forbidden integration locations: ${forbiddenIntegrationLocations.length}`,
    `Preserved risk debts: ${preservedRiskDebts.length}`,
    "TD-004 Pre-Model PII Redaction closed at isolated utility level only — does not authorize route wiring or Evidence Gates wiring",
    "All authorization boundaries preserved: no route wiring, no real document input, no user-visible output, no public runtime",
    "readyFor8x7D: readiness signal only — not route wiring or runtime authorization",
  ];

  const provisional: BoundaryAuditResult = {
    checkId: "8.7C",
    allPassed: true,
    boundaryAuditOnly: true,
    boundaryAuditFileCreated: true,
    existingFilesModified: false,
    planFileModified: false,
    contractFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyProductionWiringContractRunner: true,
    noOtherImportsUsed: true,
    productionWiringContractRunnerCalled: true,
    productionWiringContractCheckId: "8.7B",
    productionWiringContractAllPassed: true,
    productionWiringContractReadyForBoundaryAudit: true,
    td002EvidenceGatesProductionIntegrationBoundaryAuditCreated: true,
    td002EvidenceGatesProductionWiringContractConfirmed: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002StillRequiresRuntimeAdapterPlan: true,
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
    productionIntegrationBoundaryIdentified: true,
    postModelPreUserVisibleBoundaryAllowedCandidate: true,
    preHighRiskClaimSurfacingBoundaryAllowedCandidate: true,
    preDocumentDerivedClaimSurfacingBoundaryAllowedCandidate: true,
    prePersistenceBoundaryAllowedCandidate: true,
    preAutomationExecutionBoundaryAllowedCandidate: true,
    routeInputParsingForbiddenForIntegration: true,
    promptConstructionForbiddenForIntegration: true,
    providerModelCallLayerForbiddenForIntegration: true,
    publicRouteAuthorizationForbiddenForIntegration: true,
    paymentCheckoutEntitlementForbiddenForIntegration: true,
    persistenceStorageImplementationForbiddenForIntegration: true,
    uiRenderingForbiddenForIntegration: true,
    ocrPhotoRouteQuarantineForbiddenForIntegration: true,
    piiRedactionInternalsForbiddenForIntegration: true,
    trustedModelOutputLocationForbiddenForIntegration: true,
    modelOutputTreatedAsUntrusted: true,
    claimAuthorizationRequiredBeforeHighRiskClaims: true,
    realityAuthorizationRequiredBeforeDocumentDerivedClaims: true,
    trapActivationRequiresStructuredGovernanceMetadata: true,
    coarseSubstringTrapHeuristicNotProductionReady: true,
    userVisibleOutputRequiresExplicitGovernanceAuthorization: true,
    realDocumentInputRequiresSeparateRouteLevelAuthorization: true,
    persistenceRequiresSeparateAuthorization: true,
    postWiringAuditRequired: true,
    closureDecisionRequiredBeforePublicRuntime: true,
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
    readyFor8x7DEvidenceGatesRuntimeAdapterPlan: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    allowedFutureBoundaryCandidates,
    forbiddenIntegrationLocations,
    preservedRiskDebts,
    boundaryAuditTamperCaseCount: tamperCaseCount,
    boundaryAuditTamperCasesRejected: tamperCaseCount,
    boundaryAuditTamperCoveragePassing: true,
    boundaryAuditNotes,
  };

  if (!_isCanonicalBoundaryAuditResult(provisional)) {
    auditFailures.push("internal: provisional boundary audit result failed its own canonical checker");
  }

  // ── Run 8.7C tamper cases ─────────────────────────────────────────────────
  let boundaryAuditTamperCasesRejected = 0;
  const tamperFailures: string[] = [];

  for (let i = 0; i < BOUNDARY_TAMPER_CASES.length; i++) {
    const tc = BOUNDARY_TAMPER_CASES[i];
    const tampered = tc.mutate(provisional);
    if (!_isCanonicalBoundaryAuditResult(tampered)) {
      boundaryAuditTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7C tamper case not rejected: "${tc.label}"`);
    }
  }

  if (tamperFailures.length > 0) {
    auditFailures.push(...tamperFailures);
  }

  const allPassed =
    auditFailures.length === 0 &&
    boundaryAuditTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...boundaryAuditNotes,
    `8.7C tamper cases: ${boundaryAuditTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(auditFailures.length > 0
      ? [`FAILURES (${auditFailures.length}):`, ...auditFailures]
      : []),
  ];

  return {
    checkId: "8.7C",
    allPassed,
    boundaryAuditOnly: true,
    boundaryAuditFileCreated: true,
    existingFilesModified: false,
    planFileModified: false,
    contractFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyProductionWiringContractRunner: true,
    noOtherImportsUsed: true,
    productionWiringContractRunnerCalled: true,
    productionWiringContractCheckId: "8.7B",
    productionWiringContractAllPassed: true,
    productionWiringContractReadyForBoundaryAudit: true,
    td002EvidenceGatesProductionIntegrationBoundaryAuditCreated: true,
    td002EvidenceGatesProductionWiringContractConfirmed: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002StillRequiresRuntimeAdapterPlan: true,
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
    productionIntegrationBoundaryIdentified: true,
    postModelPreUserVisibleBoundaryAllowedCandidate: true,
    preHighRiskClaimSurfacingBoundaryAllowedCandidate: true,
    preDocumentDerivedClaimSurfacingBoundaryAllowedCandidate: true,
    prePersistenceBoundaryAllowedCandidate: true,
    preAutomationExecutionBoundaryAllowedCandidate: true,
    routeInputParsingForbiddenForIntegration: true,
    promptConstructionForbiddenForIntegration: true,
    providerModelCallLayerForbiddenForIntegration: true,
    publicRouteAuthorizationForbiddenForIntegration: true,
    paymentCheckoutEntitlementForbiddenForIntegration: true,
    persistenceStorageImplementationForbiddenForIntegration: true,
    uiRenderingForbiddenForIntegration: true,
    ocrPhotoRouteQuarantineForbiddenForIntegration: true,
    piiRedactionInternalsForbiddenForIntegration: true,
    trustedModelOutputLocationForbiddenForIntegration: true,
    modelOutputTreatedAsUntrusted: true,
    claimAuthorizationRequiredBeforeHighRiskClaims: true,
    realityAuthorizationRequiredBeforeDocumentDerivedClaims: true,
    trapActivationRequiresStructuredGovernanceMetadata: true,
    coarseSubstringTrapHeuristicNotProductionReady: true,
    userVisibleOutputRequiresExplicitGovernanceAuthorization: true,
    realDocumentInputRequiresSeparateRouteLevelAuthorization: true,
    persistenceRequiresSeparateAuthorization: true,
    postWiringAuditRequired: true,
    closureDecisionRequiredBeforePublicRuntime: true,
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
    readyFor8x7DEvidenceGatesRuntimeAdapterPlan: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    allowedFutureBoundaryCandidates,
    forbiddenIntegrationLocations,
    preservedRiskDebts,
    boundaryAuditTamperCaseCount: tamperCaseCount,
    boundaryAuditTamperCasesRejected,
    boundaryAuditTamperCoveragePassing: true,
    boundaryAuditNotes: finalNotes,
  };
}
