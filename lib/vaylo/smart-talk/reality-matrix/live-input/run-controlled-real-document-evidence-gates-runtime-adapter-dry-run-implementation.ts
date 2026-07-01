/**
 * PHASE 8.7F — Evidence Gates Runtime Adapter Dry-Run Implementation
 *
 * Isolated pure dry-run adapter implementation for TD-002 Evidence Gates.
 * Synthetic-only validation. No real documents, no real users, no production wiring.
 *
 * Exports two functions:
 *   runEvidenceGatesRuntimeAdapterDryRun(input)   — the isolated dry-run adapter
 *   runControlledRealDocumentEvidenceGatesRuntimeAdapterDryRunImplementation() — phase validation runner
 *
 * Still unauthorized after 8.7F:
 *   - Production wiring / route wiring / runSmartTalk modification
 *   - Real document input / user-visible output
 *   - Public / pilot / production / go-live runtime
 */

import { runControlledRealDocumentEvidenceGatesRuntimeAdapterContract } from "./run-controlled-real-document-evidence-gates-runtime-adapter-contract";

// ─── Local types (non-exported) ───────────────────────────────────────────────

type SourceKind = "user_text_normalized" | "controlled_document_text" | "unknown";
type Lane = "standard_text" | "controlled_document" | "unknown";
type SafetyStatus = "safe" | "unsafe" | "unknown";
type PiiStatus = "applied" | "not_required" | "unsafe" | "unknown";
type ClaimAuthStatus = "allowed" | "denied" | "unknown" | "not_evaluated";
type RealityAuthStatus = "allowed" | "denied" | "unknown" | "not_evaluated";
type AdapterStatus = "PASSED" | "BLOCKED";
type RawInputMarker = "RAW_ROUTE_BODY" | "RAW_UPLOADED_FILE" | "OCR_PHOTO_INPUT" | "UNNORMALIZED_USER_TEXT";

interface EvidenceCandidateMetadata { hasStructuredEvidence: boolean; }
interface ClaimCandidateMetadata {
  hasHighRiskClaim: boolean;
  hasDocumentDerivedClaim: boolean;
  claimAuthorizationStatus: ClaimAuthStatus;
}
interface TrapCandidateMetadata {
  hasStructuredActiveTrap: boolean;
  structuredTrapKind?: string;
  coarseSubstringHeuristicOnly?: boolean;
}
interface RiskContext { hasKnownRiskSignals: boolean; }
interface AuthorizationContext {
  userVisibleOutputExplicitlyAuthorized: boolean;
  realityAuthorizationStatus: RealityAuthStatus;
  hasExactLegalDeadlineRequest?: boolean;
  hasPaymentCheckoutEntitlementMarker?: boolean;
  hasPilotProductionGoLiveMarker?: boolean;
  hasPublicRuntimeMarker?: boolean;
  hasRouteWiringMarker?: boolean;
  hasPersistenceRequest?: boolean;
}
interface AdapterInput {
  sourceKind: SourceKind;
  lane: Lane;
  normalizedTextOrModelOutput: string;
  preModelSafetyStatus: SafetyStatus | undefined;
  piiRedactionStatus: PiiStatus | undefined;
  evidenceCandidateMetadata: EvidenceCandidateMetadata;
  claimCandidateMetadata: ClaimCandidateMetadata;
  trapCandidateMetadata: TrapCandidateMetadata;
  riskContext: RiskContext;
  authorizationContext: AuthorizationContext;
  _rawInputMarker?: RawInputMarker;
  _syntheticModelOutputHasUnstructuredRiskyClaim?: boolean;
}
interface TrapActivationResult { activated: boolean; structuredTrapKind: string | null; }
interface AdapterOutput {
  adapterStatus: AdapterStatus;
  safeForUserVisibleOutput: boolean;
  safeForEvidenceGateContinuation: boolean;
  claimAuthorizationStatus: ClaimAuthStatus;
  realityAuthorizationStatus: RealityAuthStatus;
  trapActivationStatus: TrapActivationResult;
  blockedReasons: string[];
  governanceDecisionSummary: string;
  auditMetadataNonPersistentByDefault: { nonPersistent: true; dryRunOnly: true };
  exactLegalDeadlineCalculationAuthorized: false;
}

// ─── Synthetic base input helper (non-exported) ───────────────────────────────

function _makeSyntheticBaseInput(overrides: Partial<AdapterInput> = {}): AdapterInput {
  const base: AdapterInput = {
    sourceKind: "user_text_normalized",
    lane: "standard_text",
    normalizedTextOrModelOutput: "synthetic-normalized-governance-text-dry-run-only",
    preModelSafetyStatus: "safe",
    piiRedactionStatus: "applied",
    evidenceCandidateMetadata: { hasStructuredEvidence: false },
    claimCandidateMetadata: {
      hasHighRiskClaim: false,
      hasDocumentDerivedClaim: false,
      claimAuthorizationStatus: "not_evaluated",
    },
    trapCandidateMetadata: { hasStructuredActiveTrap: false },
    riskContext: { hasKnownRiskSignals: false },
    authorizationContext: {
      userVisibleOutputExplicitlyAuthorized: false,
      realityAuthorizationStatus: "not_evaluated",
    },
  };
  return { ...base, ...overrides } as AdapterInput;
}

// ─── Leak test sentinels (non-exported) ──────────────────────────────────────

const _SYNTH_PII_LEAK_SENTINEL = "SYNTH-PII-LEAK-TEST-A1B2C3";
const _SYNTH_MODEL_TEXT_LEAK_SENTINEL = "SYNTH-MODEL-LEAK-TEST-X9Y8Z7";
const _SYNTH_AUDIT_LEAK_SENTINEL = "SYNTH-AUDIT-PAYLOAD-LEAK-Q5W4";

// ─── Isolated dry-run adapter ─────────────────────────────────────────────────

/**
 * Isolated pure dry-run governance adapter.
 *
 * Accepts only contract-shaped synthetic governance input.
 * Returns structured governance decision output only.
 * Deterministic, fail-closed, no side effects.
 * Not connected to production routes, runSmartTalk, or real user data.
 */
export function runEvidenceGatesRuntimeAdapterDryRun(input: AdapterInput): AdapterOutput {
  const blockedReasons: string[] = [];

  // ── Raw input marker rejections ─────────────────────────────────────────
  if (input._rawInputMarker === "RAW_ROUTE_BODY") {
    blockedReasons.push("BLOCKED:raw-route-body-rejected");
  }
  if (input._rawInputMarker === "RAW_UPLOADED_FILE") {
    blockedReasons.push("BLOCKED:raw-uploaded-file-rejected");
  }
  if (input._rawInputMarker === "OCR_PHOTO_INPUT") {
    blockedReasons.push("BLOCKED:ocr-photo-input-rejected");
  }
  if (input._rawInputMarker === "UNNORMALIZED_USER_TEXT") {
    blockedReasons.push("BLOCKED:unnormalized-direct-user-text-rejected");
  }

  // ── Unsupported sourceKind ──────────────────────────────────────────────
  const SUPPORTED_SOURCE_KINDS: SourceKind[] = ["user_text_normalized", "controlled_document_text"];
  if (!SUPPORTED_SOURCE_KINDS.includes(input.sourceKind)) {
    blockedReasons.push("BLOCKED:unsupported-sourceKind");
  }

  // ── Unsupported lane ────────────────────────────────────────────────────
  const SUPPORTED_LANES: Lane[] = ["standard_text", "controlled_document"];
  if (!SUPPORTED_LANES.includes(input.lane)) {
    blockedReasons.push("BLOCKED:unsupported-lane");
  }

  // ── Empty / whitespace normalized text ─────────────────────────────────
  if (!input.normalizedTextOrModelOutput || input.normalizedTextOrModelOutput.trim().length === 0) {
    blockedReasons.push("BLOCKED:empty-normalized-text");
  }

  // ── Unstructured model output risky claim — untrusted ──────────────────
  if (input._syntheticModelOutputHasUnstructuredRiskyClaim === true) {
    blockedReasons.push("BLOCKED:unstructured-model-claim-untrusted-no-structured-metadata");
  }

  // ── preModelSafetyStatus required ──────────────────────────────────────
  if (input.preModelSafetyStatus === undefined) {
    blockedReasons.push("BLOCKED:missing-preModelSafetyStatus");
  } else if (input.preModelSafetyStatus !== "safe") {
    blockedReasons.push(`BLOCKED:preModelSafetyStatus-${input.preModelSafetyStatus}`);
  }

  // ── piiRedactionStatus required on supported lanes ──────────────────────
  const laneRequiresPii = SUPPORTED_LANES.includes(input.lane);
  if (laneRequiresPii) {
    if (input.piiRedactionStatus === undefined) {
      blockedReasons.push("BLOCKED:missing-piiRedactionStatus");
    } else if (input.piiRedactionStatus === "unsafe" || input.piiRedactionStatus === "unknown") {
      blockedReasons.push(`BLOCKED:piiRedactionStatus-${input.piiRedactionStatus}`);
    }
  }

  // ── Authorization markers ───────────────────────────────────────────────
  if (input.authorizationContext.hasExactLegalDeadlineRequest === true) {
    blockedReasons.push("BLOCKED:exact-legal-deadline-calculation-unauthorized");
  }
  if (input.authorizationContext.hasPaymentCheckoutEntitlementMarker === true) {
    blockedReasons.push("BLOCKED:payment-checkout-entitlement-unauthorized");
  }
  if (input.authorizationContext.hasPilotProductionGoLiveMarker === true) {
    blockedReasons.push("BLOCKED:pilot-production-go-live-unauthorized");
  }
  if (input.authorizationContext.hasPublicRuntimeMarker === true) {
    blockedReasons.push("BLOCKED:public-runtime-unauthorized");
  }
  if (input.authorizationContext.hasRouteWiringMarker === true) {
    blockedReasons.push("BLOCKED:route-wiring-unauthorized");
  }
  if (input.authorizationContext.hasPersistenceRequest === true) {
    blockedReasons.push("BLOCKED:persistence-request-non-persistent-by-default");
  }

  // ── Claim authorization ─────────────────────────────────────────────────
  let claimAuthorizationStatus: ClaimAuthStatus = "not_evaluated";
  if (input.claimCandidateMetadata.hasHighRiskClaim) {
    claimAuthorizationStatus = input.claimCandidateMetadata.claimAuthorizationStatus;
    if (claimAuthorizationStatus !== "allowed") {
      blockedReasons.push(`BLOCKED:high-risk-claim-claimAuth-${claimAuthorizationStatus}`);
    }
  }

  // ── Reality authorization ───────────────────────────────────────────────
  let realityAuthorizationStatus: RealityAuthStatus = "not_evaluated";
  if (input.claimCandidateMetadata.hasDocumentDerivedClaim) {
    realityAuthorizationStatus = input.authorizationContext.realityAuthorizationStatus;
    if (realityAuthorizationStatus !== "allowed") {
      blockedReasons.push(`BLOCKED:document-derived-claim-realityAuth-${realityAuthorizationStatus}`);
    }
  }

  // ── Trap activation: structured metadata only ───────────────────────────
  let trapActivationStatus: TrapActivationResult = { activated: false, structuredTrapKind: null };
  if (
    input.trapCandidateMetadata.hasStructuredActiveTrap === true &&
    input.trapCandidateMetadata.coarseSubstringHeuristicOnly !== true
  ) {
    trapActivationStatus = {
      activated: true,
      structuredTrapKind: input.trapCandidateMetadata.structuredTrapKind ?? "structured-trap-kind-unspecified",
    };
    blockedReasons.push("BLOCKED:structured-trap-activated");
  }

  // ── Derive output ───────────────────────────────────────────────────────
  const adapterStatus: AdapterStatus = blockedReasons.length > 0 ? "BLOCKED" : "PASSED";
  const safeForEvidenceGateContinuation = adapterStatus === "PASSED";
  const safeForUserVisibleOutput =
    adapterStatus === "PASSED" && input.authorizationContext.userVisibleOutputExplicitlyAuthorized === true;

  const governanceDecisionSummary =
    adapterStatus === "PASSED"
      ? "governance-decision:passed:dry-run-only:not-production"
      : `governance-decision:blocked:${blockedReasons.length}-reason(s):dry-run-only:not-production`;

  return {
    adapterStatus,
    safeForUserVisibleOutput,
    safeForEvidenceGateContinuation,
    claimAuthorizationStatus,
    realityAuthorizationStatus,
    trapActivationStatus,
    blockedReasons,
    governanceDecisionSummary,
    auditMetadataNonPersistentByDefault: { nonPersistent: true, dryRunOnly: true },
    exactLegalDeadlineCalculationAuthorized: false,
  };
}

// ─── Phase result type ────────────────────────────────────────────────────────

interface RuntimeAdapterDryRunResult {
  checkId: "8.7F";
  allPassed: boolean;
  runtimeAdapterDryRunImplementationOnly: true;
  dryRunImplementationFileCreated: true;
  existingFilesModified: false;
  productionWiringPlanFileModified: false;
  productionWiringContractFileModified: false;
  boundaryAuditFileModified: false;
  runtimeAdapterPlanFileModified: false;
  runtimeAdapterContractFileModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runSmartTalkModified: false;
  runSmartTalkImported: false;
  runSmartTalkExecuted: false;
  runtimeAdapterImplemented: true;
  runtimeAdapterIsDryRunOnly: true;
  runtimeAdapterProductionWiringImplemented: false;
  runtimeAdapterPublicRuntimeImplemented: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  importedOnlyRuntimeAdapterContractRunner: true;
  noOtherImportsUsed: true;
  runtimeAdapterContractRunnerCalled: true;
  runtimeAdapterContractCheckId: "8.7E";
  runtimeAdapterContractAllPassed: true;
  runtimeAdapterContractReadyForDryRunImplementation: true;
  td002EvidenceGatesRuntimeAdapterDryRunImplementationCreated: true;
  td002RuntimeAdapterContractConfirmed: true;
  td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true;
  td002EvidenceGatesProductionWiringNotImplementedYet: true;
  td002RuntimeAdapterImplementedAsDryRunOnly: true;
  td002RuntimeAdapterNotProductionWired: true;
  td002StillRequiresRunSmartTalkWiringExecutionContract: true;
  td002StillRequiresScopedWiringOrContainmentPatch: true;
  td002StillRequiresPostWiringAudit: true;
  td002StillRequiresClosureDecision: true;
  td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true;
  td004DoesNotAuthorizeRouteWiringConfirmed: true;
  td004DoesNotAuthorizeRealDocumentInputConfirmed: true;
  td004DoesNotAuthorizeUserVisibleOutputConfirmed: true;
  td004DoesNotAuthorizePublicRuntimeConfirmed: true;
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
  structuredBlockedReasonsReturned: true;
  auditMetadataNonPersistentByDefault: true;
  sourceKindInputImplemented: true;
  laneInputImplemented: true;
  normalizedTextOrModelOutputInputImplemented: true;
  preModelSafetyStatusInputImplemented: true;
  piiRedactionStatusInputImplemented: true;
  evidenceCandidateMetadataInputImplemented: true;
  claimCandidateMetadataInputImplemented: true;
  trapCandidateMetadataInputImplemented: true;
  riskContextInputImplemented: true;
  authorizationContextInputImplemented: true;
  adapterStatusOutputImplemented: true;
  safeForUserVisibleOutputOutputImplemented: true;
  safeForEvidenceGateContinuationOutputImplemented: true;
  claimAuthorizationStatusOutputImplemented: true;
  realityAuthorizationStatusOutputImplemented: true;
  trapActivationStatusOutputImplemented: true;
  blockedReasonsOutputImplemented: true;
  governanceDecisionSummaryOutputImplemented: true;
  auditMetadataNonPersistentByDefaultOutputImplemented: true;
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
  syntheticValidationCaseCount: number;
  syntheticValidationCasesPassed: number;
  syntheticValidationPassing: true;
  dryRunOutputLeakageCaseCount: number;
  dryRunOutputLeakageCasesPassed: number;
  dryRunOutputLeakagePassing: true;
  runtimeAdapterDryRunTamperCaseCount: number;
  runtimeAdapterDryRunTamperCasesRejected: number;
  runtimeAdapterDryRunTamperCoveragePassing: true;
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
  readyFor8x7GRunSmartTalkWiringExecutionContract: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  adapterDryRunNotes: string[];
}

// ─── Canonical result checker ─────────────────────────────────────────────────

function _isCanonicalDryRunResult(r: RuntimeAdapterDryRunResult): boolean {
  if (r.checkId !== "8.7F") return false;
  if (r.allPassed !== true) return false;
  if (r.runtimeAdapterDryRunImplementationOnly !== true) return false;
  if (r.dryRunImplementationFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.productionWiringPlanFileModified !== false) return false;
  if (r.productionWiringContractFileModified !== false) return false;
  if (r.boundaryAuditFileModified !== false) return false;
  if (r.runtimeAdapterPlanFileModified !== false) return false;
  if (r.runtimeAdapterContractFileModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.runSmartTalkImported !== false) return false;
  if (r.runSmartTalkExecuted !== false) return false;
  if (r.runtimeAdapterImplemented !== true) return false;
  if (r.runtimeAdapterIsDryRunOnly !== true) return false;
  if (r.runtimeAdapterProductionWiringImplemented !== false) return false;
  if (r.runtimeAdapterPublicRuntimeImplemented !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.importedOnlyRuntimeAdapterContractRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.runtimeAdapterContractRunnerCalled !== true) return false;
  if (r.runtimeAdapterContractCheckId !== "8.7E") return false;
  if (r.runtimeAdapterContractAllPassed !== true) return false;
  if (r.runtimeAdapterContractReadyForDryRunImplementation !== true) return false;
  if (r.td002EvidenceGatesRuntimeAdapterDryRunImplementationCreated !== true) return false;
  if (r.td002RuntimeAdapterContractConfirmed !== true) return false;
  if (r.td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.td002EvidenceGatesProductionWiringNotImplementedYet !== true) return false;
  if (r.td002RuntimeAdapterImplementedAsDryRunOnly !== true) return false;
  if (r.td002RuntimeAdapterNotProductionWired !== true) return false;
  if (r.td002StillRequiresRunSmartTalkWiringExecutionContract !== true) return false;
  if (r.td002StillRequiresScopedWiringOrContainmentPatch !== true) return false;
  if (r.td002StillRequiresPostWiringAudit !== true) return false;
  if (r.td002StillRequiresClosureDecision !== true) return false;
  if (r.td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRouteWiringConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRealDocumentInputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeUserVisibleOutputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizePublicRuntimeConfirmed !== true) return false;
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
  if (r.structuredBlockedReasonsReturned !== true) return false;
  if (r.auditMetadataNonPersistentByDefault !== true) return false;
  if (r.sourceKindInputImplemented !== true) return false;
  if (r.laneInputImplemented !== true) return false;
  if (r.normalizedTextOrModelOutputInputImplemented !== true) return false;
  if (r.preModelSafetyStatusInputImplemented !== true) return false;
  if (r.piiRedactionStatusInputImplemented !== true) return false;
  if (r.evidenceCandidateMetadataInputImplemented !== true) return false;
  if (r.claimCandidateMetadataInputImplemented !== true) return false;
  if (r.trapCandidateMetadataInputImplemented !== true) return false;
  if (r.riskContextInputImplemented !== true) return false;
  if (r.authorizationContextInputImplemented !== true) return false;
  if (r.adapterStatusOutputImplemented !== true) return false;
  if (r.safeForUserVisibleOutputOutputImplemented !== true) return false;
  if (r.safeForEvidenceGateContinuationOutputImplemented !== true) return false;
  if (r.claimAuthorizationStatusOutputImplemented !== true) return false;
  if (r.realityAuthorizationStatusOutputImplemented !== true) return false;
  if (r.trapActivationStatusOutputImplemented !== true) return false;
  if (r.blockedReasonsOutputImplemented !== true) return false;
  if (r.governanceDecisionSummaryOutputImplemented !== true) return false;
  if (r.auditMetadataNonPersistentByDefaultOutputImplemented !== true) return false;
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
  if (r.syntheticValidationCasesPassed !== r.syntheticValidationCaseCount) return false;
  if (r.syntheticValidationPassing !== true) return false;
  if (r.dryRunOutputLeakageCasesPassed !== r.dryRunOutputLeakageCaseCount) return false;
  if (r.dryRunOutputLeakagePassing !== true) return false;
  if (r.runtimeAdapterDryRunTamperCasesRejected !== r.runtimeAdapterDryRunTamperCaseCount) return false;
  if (r.runtimeAdapterDryRunTamperCoveragePassing !== true) return false;
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
  if (r.readyFor8x7GRunSmartTalkWiringExecutionContract !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (!r.adapterDryRunNotes || r.adapterDryRunNotes.length === 0) return false;
  return true;
}

// ─── Phase tamper cases ───────────────────────────────────────────────────────

type DryRunTamperMutation = (r: RuntimeAdapterDryRunResult) => RuntimeAdapterDryRunResult;
interface DryRunTamperCase { label: string; mutate: DryRunTamperMutation; }

const DRY_RUN_TAMPER_CASES: DryRunTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.7E" as "8.7F" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "runtimeAdapterDryRunImplementationOnly false", mutate: (r) => ({ ...r, runtimeAdapterDryRunImplementationOnly: false as true }) },
  { label: "dryRunImplementationFileCreated false", mutate: (r) => ({ ...r, dryRunImplementationFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "productionWiringPlanFileModified true", mutate: (r) => ({ ...r, productionWiringPlanFileModified: true as false }) },
  { label: "productionWiringContractFileModified true", mutate: (r) => ({ ...r, productionWiringContractFileModified: true as false }) },
  { label: "boundaryAuditFileModified true", mutate: (r) => ({ ...r, boundaryAuditFileModified: true as false }) },
  { label: "runtimeAdapterPlanFileModified true", mutate: (r) => ({ ...r, runtimeAdapterPlanFileModified: true as false }) },
  { label: "runtimeAdapterContractFileModified true", mutate: (r) => ({ ...r, runtimeAdapterContractFileModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "runSmartTalkImported true", mutate: (r) => ({ ...r, runSmartTalkImported: true as false }) },
  { label: "runSmartTalkExecuted true", mutate: (r) => ({ ...r, runSmartTalkExecuted: true as false }) },
  { label: "runtimeAdapterImplemented false", mutate: (r) => ({ ...r, runtimeAdapterImplemented: false as true }) },
  { label: "runtimeAdapterIsDryRunOnly false", mutate: (r) => ({ ...r, runtimeAdapterIsDryRunOnly: false as true }) },
  { label: "runtimeAdapterProductionWiringImplemented true", mutate: (r) => ({ ...r, runtimeAdapterProductionWiringImplemented: true as false }) },
  { label: "runtimeAdapterPublicRuntimeImplemented true", mutate: (r) => ({ ...r, runtimeAdapterPublicRuntimeImplemented: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "importedOnlyRuntimeAdapterContractRunner false", mutate: (r) => ({ ...r, importedOnlyRuntimeAdapterContractRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "runtimeAdapterContractRunnerCalled false", mutate: (r) => ({ ...r, runtimeAdapterContractRunnerCalled: false as true }) },
  { label: "runtimeAdapterContractCheckId wrong", mutate: (r) => ({ ...r, runtimeAdapterContractCheckId: "8.7D" as "8.7E" }) },
  { label: "runtimeAdapterContractAllPassed false", mutate: (r) => ({ ...r, runtimeAdapterContractAllPassed: false as true }) },
  { label: "runtimeAdapterContractReadyForDryRunImplementation false", mutate: (r) => ({ ...r, runtimeAdapterContractReadyForDryRunImplementation: false as true }) },
  { label: "td002EvidenceGatesRuntimeAdapterDryRunImplementationCreated false", mutate: (r) => ({ ...r, td002EvidenceGatesRuntimeAdapterDryRunImplementationCreated: false as true }) },
  { label: "td002RuntimeAdapterContractConfirmed false", mutate: (r) => ({ ...r, td002RuntimeAdapterContractConfirmed: false as true }) },
  { label: "td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "td002EvidenceGatesProductionWiringNotImplementedYet false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringNotImplementedYet: false as true }) },
  { label: "td002RuntimeAdapterImplementedAsDryRunOnly false", mutate: (r) => ({ ...r, td002RuntimeAdapterImplementedAsDryRunOnly: false as true }) },
  { label: "td002RuntimeAdapterNotProductionWired false", mutate: (r) => ({ ...r, td002RuntimeAdapterNotProductionWired: false as true }) },
  { label: "td002StillRequiresRunSmartTalkWiringExecutionContract false", mutate: (r) => ({ ...r, td002StillRequiresRunSmartTalkWiringExecutionContract: false as true }) },
  { label: "td002StillRequiresScopedWiringOrContainmentPatch false", mutate: (r) => ({ ...r, td002StillRequiresScopedWiringOrContainmentPatch: false as true }) },
  { label: "td002StillRequiresPostWiringAudit false", mutate: (r) => ({ ...r, td002StillRequiresPostWiringAudit: false as true }) },
  { label: "td002StillRequiresClosureDecision false", mutate: (r) => ({ ...r, td002StillRequiresClosureDecision: false as true }) },
  { label: "readyFor8x7GRunSmartTalkWiringExecutionContract false", mutate: (r) => ({ ...r, readyFor8x7GRunSmartTalkWiringExecutionContract: false as true }) },
  { label: "td004ClosedAtIsolatedUtilityLevelConfirmed false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRouteWiringConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRouteWiringConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRealDocumentInputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRealDocumentInputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeUserVisibleOutputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeUserVisibleOutputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizePublicRuntimeConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizePublicRuntimeConfirmed: false as true }) },
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
  { label: "structuredBlockedReasonsReturned false", mutate: (r) => ({ ...r, structuredBlockedReasonsReturned: false as true }) },
  { label: "auditMetadataNonPersistentByDefault false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefault: false as true }) },
  { label: "sourceKindInputImplemented false", mutate: (r) => ({ ...r, sourceKindInputImplemented: false as true }) },
  { label: "laneInputImplemented false", mutate: (r) => ({ ...r, laneInputImplemented: false as true }) },
  { label: "normalizedTextOrModelOutputInputImplemented false", mutate: (r) => ({ ...r, normalizedTextOrModelOutputInputImplemented: false as true }) },
  { label: "preModelSafetyStatusInputImplemented false", mutate: (r) => ({ ...r, preModelSafetyStatusInputImplemented: false as true }) },
  { label: "piiRedactionStatusInputImplemented false", mutate: (r) => ({ ...r, piiRedactionStatusInputImplemented: false as true }) },
  { label: "evidenceCandidateMetadataInputImplemented false", mutate: (r) => ({ ...r, evidenceCandidateMetadataInputImplemented: false as true }) },
  { label: "claimCandidateMetadataInputImplemented false", mutate: (r) => ({ ...r, claimCandidateMetadataInputImplemented: false as true }) },
  { label: "trapCandidateMetadataInputImplemented false", mutate: (r) => ({ ...r, trapCandidateMetadataInputImplemented: false as true }) },
  { label: "riskContextInputImplemented false", mutate: (r) => ({ ...r, riskContextInputImplemented: false as true }) },
  { label: "authorizationContextInputImplemented false", mutate: (r) => ({ ...r, authorizationContextInputImplemented: false as true }) },
  { label: "adapterStatusOutputImplemented false", mutate: (r) => ({ ...r, adapterStatusOutputImplemented: false as true }) },
  { label: "safeForUserVisibleOutputOutputImplemented false", mutate: (r) => ({ ...r, safeForUserVisibleOutputOutputImplemented: false as true }) },
  { label: "safeForEvidenceGateContinuationOutputImplemented false", mutate: (r) => ({ ...r, safeForEvidenceGateContinuationOutputImplemented: false as true }) },
  { label: "claimAuthorizationStatusOutputImplemented false", mutate: (r) => ({ ...r, claimAuthorizationStatusOutputImplemented: false as true }) },
  { label: "realityAuthorizationStatusOutputImplemented false", mutate: (r) => ({ ...r, realityAuthorizationStatusOutputImplemented: false as true }) },
  { label: "trapActivationStatusOutputImplemented false", mutate: (r) => ({ ...r, trapActivationStatusOutputImplemented: false as true }) },
  { label: "blockedReasonsOutputImplemented false", mutate: (r) => ({ ...r, blockedReasonsOutputImplemented: false as true }) },
  { label: "governanceDecisionSummaryOutputImplemented false", mutate: (r) => ({ ...r, governanceDecisionSummaryOutputImplemented: false as true }) },
  { label: "auditMetadataNonPersistentByDefaultOutputImplemented false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefaultOutputImplemented: false as true }) },
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
  { label: "syntheticValidationPassing false", mutate: (r) => ({ ...r, syntheticValidationPassing: false as true }) },
  { label: "syntheticValidationCasesPassed != count", mutate: (r) => ({ ...r, syntheticValidationCasesPassed: r.syntheticValidationCasesPassed - 1 }) },
  { label: "dryRunOutputLeakagePassing false", mutate: (r) => ({ ...r, dryRunOutputLeakagePassing: false as true }) },
  { label: "dryRunOutputLeakageCasesPassed != count", mutate: (r) => ({ ...r, dryRunOutputLeakageCasesPassed: r.dryRunOutputLeakageCasesPassed - 1 }) },
  { label: "runtimeAdapterDryRunTamperCoveragePassing false", mutate: (r) => ({ ...r, runtimeAdapterDryRunTamperCoveragePassing: false as true }) },
  { label: "runtimeAdapterDryRunTamperCasesRejected != count", mutate: (r) => ({ ...r, runtimeAdapterDryRunTamperCasesRejected: r.runtimeAdapterDryRunTamperCasesRejected - 1 }) },
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
  { label: "adapterDryRunNotes empty", mutate: (r) => ({ ...r, adapterDryRunNotes: [] }) },
];

// ─── Phase validation runner ──────────────────────────────────────────────────

/**
 * Phase validation runner for 8.7F.
 *
 * Calls the 8.7E runtime adapter contract runner as the source of truth.
 * Runs 35 synthetic validation cases and 3 leakage cases against the dry-run adapter.
 * Runs tamper coverage against the 8.7F phase result.
 * readyFor8x7G is a readiness signal only — not route wiring or runtime authorization.
 */
export function runControlledRealDocumentEvidenceGatesRuntimeAdapterDryRunImplementation(): RuntimeAdapterDryRunResult {
  const phaseFailures: string[] = [];

  // ── Call 8.7E contract runner as source of truth ──────────────────────
  const c = runControlledRealDocumentEvidenceGatesRuntimeAdapterContract();
  if (c.checkId !== "8.7E") phaseFailures.push(`contract checkId mismatch: expected 8.7E, got ${c.checkId}`);
  if (c.allPassed !== true) phaseFailures.push("contract allPassed is not true");
  if (c.readyFor8x7FEvidenceGatesRuntimeAdapterDryRunImplementation !== true) {
    phaseFailures.push("contract readyFor8x7F is not true");
  }

  // ── Synthetic validation cases ────────────────────────────────────────
  interface SynCase { label: string; input: AdapterInput; check: (o: AdapterOutput) => boolean; }
  const synCases: SynCase[] = [
    {
      label: "SC-01: valid low-risk, userVisibleAuth false → PASSED, safeForUserVisibleOutput false",
      input: _makeSyntheticBaseInput(),
      check: (o) => o.adapterStatus === "PASSED" && o.safeForUserVisibleOutput === false && o.safeForEvidenceGateContinuation === true,
    },
    {
      label: "SC-02: valid low-risk, userVisibleAuth true → PASSED, safeForUserVisibleOutput true",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: true, realityAuthorizationStatus: "not_evaluated" },
      }),
      check: (o) => o.adapterStatus === "PASSED" && o.safeForUserVisibleOutput === true,
    },
    {
      label: "SC-03: missing preModelSafetyStatus → BLOCKED",
      input: _makeSyntheticBaseInput({ preModelSafetyStatus: undefined }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("missing-preModelSafetyStatus")),
    },
    {
      label: "SC-04: unsafe preModelSafetyStatus → BLOCKED",
      input: _makeSyntheticBaseInput({ preModelSafetyStatus: "unsafe" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("preModelSafetyStatus-unsafe")),
    },
    {
      label: "SC-05: unknown preModelSafetyStatus → BLOCKED",
      input: _makeSyntheticBaseInput({ preModelSafetyStatus: "unknown" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("preModelSafetyStatus-unknown")),
    },
    {
      label: "SC-06: lane requires PII, missing piiRedactionStatus → BLOCKED",
      input: _makeSyntheticBaseInput({ piiRedactionStatus: undefined }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("missing-piiRedactionStatus")),
    },
    {
      label: "SC-07: lane requires PII, unsafe piiRedactionStatus → BLOCKED",
      input: _makeSyntheticBaseInput({ piiRedactionStatus: "unsafe" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("piiRedactionStatus-unsafe")),
    },
    {
      label: "SC-08: lane requires PII, unknown piiRedactionStatus → BLOCKED",
      input: _makeSyntheticBaseInput({ piiRedactionStatus: "unknown" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("piiRedactionStatus-unknown")),
    },
    {
      label: "SC-09: raw route body marker → BLOCKED",
      input: _makeSyntheticBaseInput({ _rawInputMarker: "RAW_ROUTE_BODY" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("raw-route-body-rejected")),
    },
    {
      label: "SC-10: raw uploaded file marker → BLOCKED",
      input: _makeSyntheticBaseInput({ _rawInputMarker: "RAW_UPLOADED_FILE" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("raw-uploaded-file-rejected")),
    },
    {
      label: "SC-11: OCR/photo input marker → BLOCKED",
      input: _makeSyntheticBaseInput({ _rawInputMarker: "OCR_PHOTO_INPUT" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("ocr-photo-input-rejected")),
    },
    {
      label: "SC-12: unnormalized user text marker → BLOCKED",
      input: _makeSyntheticBaseInput({ _rawInputMarker: "UNNORMALIZED_USER_TEXT" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("unnormalized-direct-user-text-rejected")),
    },
    {
      label: "SC-13: high-risk claim, claimAuth denied → BLOCKED",
      input: _makeSyntheticBaseInput({
        claimCandidateMetadata: { hasHighRiskClaim: true, hasDocumentDerivedClaim: false, claimAuthorizationStatus: "denied" },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("high-risk-claim")) && o.claimAuthorizationStatus === "denied",
    },
    {
      label: "SC-14: high-risk claim, claimAuth unknown → BLOCKED",
      input: _makeSyntheticBaseInput({
        claimCandidateMetadata: { hasHighRiskClaim: true, hasDocumentDerivedClaim: false, claimAuthorizationStatus: "unknown" },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("high-risk-claim")) && o.claimAuthorizationStatus === "unknown",
    },
    {
      label: "SC-15: high-risk claim, claimAuth allowed → not blocked by claim gate",
      input: _makeSyntheticBaseInput({
        claimCandidateMetadata: { hasHighRiskClaim: true, hasDocumentDerivedClaim: false, claimAuthorizationStatus: "allowed" },
      }),
      check: (o) => o.claimAuthorizationStatus === "allowed" && !o.blockedReasons.some((r) => r.includes("high-risk-claim")),
    },
    {
      label: "SC-16: document-derived claim, realityAuth denied → BLOCKED",
      input: _makeSyntheticBaseInput({
        claimCandidateMetadata: { hasHighRiskClaim: false, hasDocumentDerivedClaim: true, claimAuthorizationStatus: "not_evaluated" },
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "denied" },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("document-derived-claim")) && o.realityAuthorizationStatus === "denied",
    },
    {
      label: "SC-17: document-derived claim, realityAuth unknown → BLOCKED",
      input: _makeSyntheticBaseInput({
        claimCandidateMetadata: { hasHighRiskClaim: false, hasDocumentDerivedClaim: true, claimAuthorizationStatus: "not_evaluated" },
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "unknown" },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("document-derived-claim")) && o.realityAuthorizationStatus === "unknown",
    },
    {
      label: "SC-18: document-derived claim, realityAuth allowed → not blocked by reality gate",
      input: _makeSyntheticBaseInput({
        claimCandidateMetadata: { hasHighRiskClaim: false, hasDocumentDerivedClaim: true, claimAuthorizationStatus: "not_evaluated" },
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "allowed" },
      }),
      check: (o) => o.realityAuthorizationStatus === "allowed" && !o.blockedReasons.some((r) => r.includes("document-derived-claim")),
    },
    {
      label: "SC-19: structured active trap → BLOCKED with trap status",
      input: _makeSyntheticBaseInput({
        trapCandidateMetadata: { hasStructuredActiveTrap: true, structuredTrapKind: "synthetic-deadline-trap", coarseSubstringHeuristicOnly: false },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.trapActivationStatus.activated === true && o.trapActivationStatus.structuredTrapKind === "synthetic-deadline-trap",
    },
    {
      label: "SC-20: coarse substring heuristic only → must not activate production trap",
      input: _makeSyntheticBaseInput({
        trapCandidateMetadata: { hasStructuredActiveTrap: false, coarseSubstringHeuristicOnly: true },
      }),
      check: (o) => o.trapActivationStatus.activated === false && !o.blockedReasons.some((r) => r.includes("trap")),
    },
    {
      label: "SC-21: exact legal deadline request → BLOCKED",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "not_evaluated", hasExactLegalDeadlineRequest: true },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("exact-legal-deadline")),
    },
    {
      label: "SC-22: unsafe preModel + unknown piiRedaction → BLOCKED with multiple reasons",
      input: _makeSyntheticBaseInput({ preModelSafetyStatus: "unsafe", piiRedactionStatus: "unknown" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.length >= 2,
    },
    {
      label: "SC-23: unstructured model claim risky → BLOCKED untrusted",
      input: _makeSyntheticBaseInput({ _syntheticModelOutputHasUnstructuredRiskyClaim: true }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("unstructured-model-claim-untrusted")),
    },
    {
      label: "SC-24: persistence request → BLOCKED",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "not_evaluated", hasPersistenceRequest: true },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("persistence-request")),
    },
    {
      label: "SC-25: valid input → auditMetadata always nonPersistent true",
      input: _makeSyntheticBaseInput(),
      check: (o) => o.auditMetadataNonPersistentByDefault.nonPersistent === true && o.auditMetadataNonPersistentByDefault.dryRunOnly === true,
    },
    {
      label: "SC-26: raw PII-like value in normalizedText → output must not leak it",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: `synthetic-text-around-${_SYNTH_PII_LEAK_SENTINEL}-end` }),
      check: (o) =>
        !o.blockedReasons.join(" ").includes(_SYNTH_PII_LEAK_SENTINEL) &&
        !o.governanceDecisionSummary.includes(_SYNTH_PII_LEAK_SENTINEL),
    },
    {
      label: "SC-27: raw model text marker in normalizedText → output must not leak it",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: `synthetic-text-${_SYNTH_MODEL_TEXT_LEAK_SENTINEL}-end` }),
      check: (o) =>
        !o.blockedReasons.join(" ").includes(_SYNTH_MODEL_TEXT_LEAK_SENTINEL) &&
        !o.governanceDecisionSummary.includes(_SYNTH_MODEL_TEXT_LEAK_SENTINEL),
    },
    {
      label: "SC-28: empty normalizedTextOrModelOutput → BLOCKED",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: "" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("empty-normalized-text")),
    },
    {
      label: "SC-29: whitespace-only normalizedTextOrModelOutput → BLOCKED",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: "   " }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("empty-normalized-text")),
    },
    {
      label: "SC-30: unsupported sourceKind → BLOCKED",
      input: _makeSyntheticBaseInput({ sourceKind: "unknown" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("unsupported-sourceKind")),
    },
    {
      label: "SC-31: unsupported lane → BLOCKED",
      input: _makeSyntheticBaseInput({ lane: "unknown" }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("unsupported-lane")),
    },
    {
      label: "SC-32: payment/checkout/entitlement marker → BLOCKED",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "not_evaluated", hasPaymentCheckoutEntitlementMarker: true },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("payment-checkout-entitlement")),
    },
    {
      label: "SC-33: pilot/production/go-live marker → BLOCKED",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "not_evaluated", hasPilotProductionGoLiveMarker: true },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("pilot-production-go-live")),
    },
    {
      label: "SC-34: public runtime marker → BLOCKED",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "not_evaluated", hasPublicRuntimeMarker: true },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("public-runtime")),
    },
    {
      label: "SC-35: route wiring marker → BLOCKED",
      input: _makeSyntheticBaseInput({
        authorizationContext: { userVisibleOutputExplicitlyAuthorized: false, realityAuthorizationStatus: "not_evaluated", hasRouteWiringMarker: true },
      }),
      check: (o) => o.adapterStatus === "BLOCKED" && o.blockedReasons.some((r) => r.includes("route-wiring")),
    },
  ];

  const synTotalCount = synCases.length;
  let synPassedCount = 0;
  const synFailures: string[] = [];
  for (const sc of synCases) {
    const output = runEvidenceGatesRuntimeAdapterDryRun(sc.input);
    if (sc.check(output)) {
      synPassedCount++;
    } else {
      synFailures.push(`8.7F synthetic case failed: "${sc.label}"`);
    }
  }
  if (synFailures.length > 0) phaseFailures.push(...synFailures);

  // ── Leakage validation cases ──────────────────────────────────────────
  interface LeakCase { label: string; input: AdapterInput; check: (o: AdapterOutput) => boolean; }
  const leakCases: LeakCase[] = [
    {
      label: "LC-01: PII leak sentinel not present in blockedReasons",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: `safe-prefix-${_SYNTH_PII_LEAK_SENTINEL}-suffix` }),
      check: (o) => !o.blockedReasons.join(" ").includes(_SYNTH_PII_LEAK_SENTINEL) && !o.governanceDecisionSummary.includes(_SYNTH_PII_LEAK_SENTINEL),
    },
    {
      label: "LC-02: model text leak sentinel not present in governanceDecisionSummary",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: `prefix-${_SYNTH_MODEL_TEXT_LEAK_SENTINEL}-suffix` }),
      check: (o) => !o.governanceDecisionSummary.includes(_SYNTH_MODEL_TEXT_LEAK_SENTINEL) && !o.blockedReasons.join(" ").includes(_SYNTH_MODEL_TEXT_LEAK_SENTINEL),
    },
    {
      label: "LC-03: audit leak sentinel not present in any output field",
      input: _makeSyntheticBaseInput({ normalizedTextOrModelOutput: `${_SYNTH_AUDIT_LEAK_SENTINEL}-payload` }),
      check: (o) =>
        !o.governanceDecisionSummary.includes(_SYNTH_AUDIT_LEAK_SENTINEL) &&
        !o.blockedReasons.join(" ").includes(_SYNTH_AUDIT_LEAK_SENTINEL) &&
        o.auditMetadataNonPersistentByDefault.nonPersistent === true,
    },
  ];

  const leakTotalCount = leakCases.length;
  let leakPassedCount = 0;
  const leakFailures: string[] = [];
  for (const lc of leakCases) {
    const output = runEvidenceGatesRuntimeAdapterDryRun(lc.input);
    if (lc.check(output)) {
      leakPassedCount++;
    } else {
      leakFailures.push(`8.7F leakage case failed: "${lc.label}"`);
    }
  }
  if (leakFailures.length > 0) phaseFailures.push(...leakFailures);

  // ── Build provisional canonical phase result ──────────────────────────
  const tamperCaseCount = DRY_RUN_TAMPER_CASES.length;
  const adapterDryRunNotes: string[] = [
    "8.7F isolated dry-run adapter implementation for TD-002 Evidence Gates created",
    `8.7E runtime adapter contract runner called: checkId=${c.checkId}, allPassed=${c.allPassed}`,
    "TD-002 Evidence Gates are not wired into production runSmartTalk — dry-run only",
    `Synthetic validation cases: ${synTotalCount} total, ${synPassedCount} passed`,
    `Leakage validation cases: ${leakTotalCount} total, ${leakPassedCount} passed`,
    "Runtime adapter implemented as isolated dry-run only — no production wiring",
    "readyFor8x7G: readiness signal only — not route wiring or runtime authorization",
  ];

  const provisional: RuntimeAdapterDryRunResult = {
    checkId: "8.7F",
    allPassed: true,
    runtimeAdapterDryRunImplementationOnly: true,
    dryRunImplementationFileCreated: true,
    existingFilesModified: false,
    productionWiringPlanFileModified: false,
    productionWiringContractFileModified: false,
    boundaryAuditFileModified: false,
    runtimeAdapterPlanFileModified: false,
    runtimeAdapterContractFileModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    runSmartTalkImported: false,
    runSmartTalkExecuted: false,
    runtimeAdapterImplemented: true,
    runtimeAdapterIsDryRunOnly: true,
    runtimeAdapterProductionWiringImplemented: false,
    runtimeAdapterPublicRuntimeImplemented: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyRuntimeAdapterContractRunner: true,
    noOtherImportsUsed: true,
    runtimeAdapterContractRunnerCalled: true,
    runtimeAdapterContractCheckId: "8.7E",
    runtimeAdapterContractAllPassed: true,
    runtimeAdapterContractReadyForDryRunImplementation: true,
    td002EvidenceGatesRuntimeAdapterDryRunImplementationCreated: true,
    td002RuntimeAdapterContractConfirmed: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002RuntimeAdapterImplementedAsDryRunOnly: true,
    td002RuntimeAdapterNotProductionWired: true,
    td002StillRequiresRunSmartTalkWiringExecutionContract: true,
    td002StillRequiresScopedWiringOrContainmentPatch: true,
    td002StillRequiresPostWiringAudit: true,
    td002StillRequiresClosureDecision: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true,
    td004DoesNotAuthorizeRouteWiringConfirmed: true,
    td004DoesNotAuthorizeRealDocumentInputConfirmed: true,
    td004DoesNotAuthorizeUserVisibleOutputConfirmed: true,
    td004DoesNotAuthorizePublicRuntimeConfirmed: true,
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
    structuredBlockedReasonsReturned: true,
    auditMetadataNonPersistentByDefault: true,
    sourceKindInputImplemented: true,
    laneInputImplemented: true,
    normalizedTextOrModelOutputInputImplemented: true,
    preModelSafetyStatusInputImplemented: true,
    piiRedactionStatusInputImplemented: true,
    evidenceCandidateMetadataInputImplemented: true,
    claimCandidateMetadataInputImplemented: true,
    trapCandidateMetadataInputImplemented: true,
    riskContextInputImplemented: true,
    authorizationContextInputImplemented: true,
    adapterStatusOutputImplemented: true,
    safeForUserVisibleOutputOutputImplemented: true,
    safeForEvidenceGateContinuationOutputImplemented: true,
    claimAuthorizationStatusOutputImplemented: true,
    realityAuthorizationStatusOutputImplemented: true,
    trapActivationStatusOutputImplemented: true,
    blockedReasonsOutputImplemented: true,
    governanceDecisionSummaryOutputImplemented: true,
    auditMetadataNonPersistentByDefaultOutputImplemented: true,
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
    syntheticValidationCaseCount: synTotalCount,
    syntheticValidationCasesPassed: synPassedCount,
    syntheticValidationPassing: true,
    dryRunOutputLeakageCaseCount: leakTotalCount,
    dryRunOutputLeakageCasesPassed: leakPassedCount,
    dryRunOutputLeakagePassing: true,
    runtimeAdapterDryRunTamperCaseCount: tamperCaseCount,
    runtimeAdapterDryRunTamperCasesRejected: tamperCaseCount,
    runtimeAdapterDryRunTamperCoveragePassing: true,
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
    readyFor8x7GRunSmartTalkWiringExecutionContract: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    adapterDryRunNotes,
  };

  if (!_isCanonicalDryRunResult(provisional)) {
    phaseFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.7F tamper cases ─────────────────────────────────────────────
  let runtimeAdapterDryRunTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let i = 0; i < DRY_RUN_TAMPER_CASES.length; i++) {
    const tc = DRY_RUN_TAMPER_CASES[i];
    if (!_isCanonicalDryRunResult(tc.mutate(provisional))) {
      runtimeAdapterDryRunTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7F tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) phaseFailures.push(...tamperFailures);

  const allPassed =
    phaseFailures.length === 0 &&
    synPassedCount === synTotalCount &&
    leakPassedCount === leakTotalCount &&
    runtimeAdapterDryRunTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...adapterDryRunNotes,
    `8.7F tamper cases: ${runtimeAdapterDryRunTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(phaseFailures.length > 0 ? [`FAILURES (${phaseFailures.length}):`, ...phaseFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    syntheticValidationCasesPassed: synPassedCount,
    dryRunOutputLeakageCasesPassed: leakPassedCount,
    runtimeAdapterDryRunTamperCasesRejected,
    adapterDryRunNotes: finalNotes,
  };
}
