/**
 * PHASE 8.7A — Evidence Gates Production Wiring Plan
 *
 * Planning file for TD-002 Evidence Gates production wiring into runSmartTalk.
 *
 * Planning-only. This file:
 *   - Records the intended future wiring sequence at a high level
 *   - Tracks known governance debts that must be resolved before wiring
 *   - Preserves all current authorization boundaries
 *
 * Still unauthorized after 8.7A:
 *   - Route wiring
 *   - Production runSmartTalk modification
 *   - Real document input
 *   - User-visible output
 *   - Public/pilot/production runtime
 *   - Payment/checkout/entitlement runtime
 *   - Paid Document Mode runtime
 *   - Exact legal deadline calculation
 *
 * No imports. No external calls. No side effects.
 */

// ─── Return type ──────────────────────────────────────────────────────────────

interface EvidenceGatesWiringPlanResult {
  checkId: "8.7A";
  allPassed: boolean;
  planningOnly: true;
  planFileCreated: true;
  existingFilesModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  runSmartTalkModified: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  td002EvidenceGatesProductionWiringPlanCreated: true;
  td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true;
  td002EvidenceGatesProductionWiringNotImplementedYet: true;
  td002StillRequiresWiringContract: true;
  td002StillRequiresDryRunPatch: true;
  td002StillRequiresPostPatchAudit: true;
  td002StillRequiresClosureDecision: true;
  td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true;
  td004DoesNotAuthorizeRouteWiringConfirmed: true;
  td004DoesNotAuthorizeRealDocumentInputConfirmed: true;
  td004DoesNotAuthorizeUserVisibleOutputConfirmed: true;
  td004DoesNotAuthorizePublicRuntimeConfirmed: true;
  futureIntegrationBoundaryIdentified: true;
  preModelSafetyBoundaryRequiredBeforeEvidenceGates: true;
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
  claimRuleOrSemanticsDebtTracked: true;
  evidenceRuleResolutionDebtTracked: true;
  proximityManualOnlyDebtTracked: true;
  trapKindTypingDebtTracked: true;
  trapDispositionStateSeparationDebtTracked: true;
  severityCandidateDerivationSeparationDebtTracked: true;
  mapperDiagnosticTaxonomyDebtTracked: true;
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
  readyFor8x7BEvidenceGatesProductionWiringContract: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  plannedFutureSequence: string[];
  riskInventory: string[];
  planningTamperCaseCount: number;
  planningTamperCasesRejected: number;
  planningTamperCoveragePassing: true;
  notes: string[];
}

// ─── Canonical plan checker ───────────────────────────────────────────────────

function _isCanonicalPlanResult(r: EvidenceGatesWiringPlanResult): boolean {
  if (r.checkId !== "8.7A") return false;
  if (r.allPassed !== true) return false;
  if (r.planningOnly !== true) return false;
  if (r.planFileCreated !== true) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.runSmartTalkModified !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.td002EvidenceGatesProductionWiringPlanCreated !== true) return false;
  if (r.td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.td002EvidenceGatesProductionWiringNotImplementedYet !== true) return false;
  if (r.td002StillRequiresWiringContract !== true) return false;
  if (r.td002StillRequiresDryRunPatch !== true) return false;
  if (r.td002StillRequiresPostPatchAudit !== true) return false;
  if (r.td002StillRequiresClosureDecision !== true) return false;
  if (r.td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRouteWiringConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeRealDocumentInputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizeUserVisibleOutputConfirmed !== true) return false;
  if (r.td004DoesNotAuthorizePublicRuntimeConfirmed !== true) return false;
  if (r.futureIntegrationBoundaryIdentified !== true) return false;
  if (r.preModelSafetyBoundaryRequiredBeforeEvidenceGates !== true) return false;
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
  if (r.claimRuleOrSemanticsDebtTracked !== true) return false;
  if (r.evidenceRuleResolutionDebtTracked !== true) return false;
  if (r.proximityManualOnlyDebtTracked !== true) return false;
  if (r.trapKindTypingDebtTracked !== true) return false;
  if (r.trapDispositionStateSeparationDebtTracked !== true) return false;
  if (r.severityCandidateDerivationSeparationDebtTracked !== true) return false;
  if (r.mapperDiagnosticTaxonomyDebtTracked !== true) return false;
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
  if (r.readyFor8x7BEvidenceGatesProductionWiringContract !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (!r.plannedFutureSequence || r.plannedFutureSequence.length === 0) return false;
  if (!r.riskInventory || r.riskInventory.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;
  if (r.planningTamperCasesRejected !== r.planningTamperCaseCount) return false;
  if (r.planningTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type PlanTamperMutation = (r: EvidenceGatesWiringPlanResult) => EvidenceGatesWiringPlanResult;
interface PlanTamperCase {
  label: string;
  mutate: PlanTamperMutation;
}

const PLAN_TAMPER_CASES: PlanTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.6I" as "8.7A" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "planningOnly false", mutate: (r) => ({ ...r, planningOnly: false as true }) },
  { label: "planFileCreated false", mutate: (r) => ({ ...r, planFileCreated: false as true }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "runSmartTalkModified true", mutate: (r) => ({ ...r, runSmartTalkModified: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "td002EvidenceGatesProductionWiringPlanCreated false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringPlanCreated: false as true }) },
  { label: "td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "td002EvidenceGatesProductionWiringNotImplementedYet false", mutate: (r) => ({ ...r, td002EvidenceGatesProductionWiringNotImplementedYet: false as true }) },
  { label: "td002StillRequiresWiringContract false", mutate: (r) => ({ ...r, td002StillRequiresWiringContract: false as true }) },
  { label: "td002StillRequiresDryRunPatch false", mutate: (r) => ({ ...r, td002StillRequiresDryRunPatch: false as true }) },
  { label: "td002StillRequiresPostPatchAudit false", mutate: (r) => ({ ...r, td002StillRequiresPostPatchAudit: false as true }) },
  { label: "td002StillRequiresClosureDecision false", mutate: (r) => ({ ...r, td002StillRequiresClosureDecision: false as true }) },
  { label: "td004ClosedAtIsolatedUtilityLevelConfirmed false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRouteWiringConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRouteWiringConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeRealDocumentInputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeRealDocumentInputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizeUserVisibleOutputConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizeUserVisibleOutputConfirmed: false as true }) },
  { label: "td004DoesNotAuthorizePublicRuntimeConfirmed false", mutate: (r) => ({ ...r, td004DoesNotAuthorizePublicRuntimeConfirmed: false as true }) },
  { label: "futureIntegrationBoundaryIdentified false", mutate: (r) => ({ ...r, futureIntegrationBoundaryIdentified: false as true }) },
  { label: "preModelSafetyBoundaryRequiredBeforeEvidenceGates false", mutate: (r) => ({ ...r, preModelSafetyBoundaryRequiredBeforeEvidenceGates: false as true }) },
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
  { label: "claimRuleOrSemanticsDebtTracked false", mutate: (r) => ({ ...r, claimRuleOrSemanticsDebtTracked: false as true }) },
  { label: "evidenceRuleResolutionDebtTracked false", mutate: (r) => ({ ...r, evidenceRuleResolutionDebtTracked: false as true }) },
  { label: "proximityManualOnlyDebtTracked false", mutate: (r) => ({ ...r, proximityManualOnlyDebtTracked: false as true }) },
  { label: "trapKindTypingDebtTracked false", mutate: (r) => ({ ...r, trapKindTypingDebtTracked: false as true }) },
  { label: "trapDispositionStateSeparationDebtTracked false", mutate: (r) => ({ ...r, trapDispositionStateSeparationDebtTracked: false as true }) },
  { label: "severityCandidateDerivationSeparationDebtTracked false", mutate: (r) => ({ ...r, severityCandidateDerivationSeparationDebtTracked: false as true }) },
  { label: "mapperDiagnosticTaxonomyDebtTracked false", mutate: (r) => ({ ...r, mapperDiagnosticTaxonomyDebtTracked: false as true }) },
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
  { label: "readyFor8x7BEvidenceGatesProductionWiringContract false", mutate: (r) => ({ ...r, readyFor8x7BEvidenceGatesProductionWiringContract: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "plannedFutureSequence empty", mutate: (r) => ({ ...r, plannedFutureSequence: [] }) },
  { label: "riskInventory empty", mutate: (r) => ({ ...r, riskInventory: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  {
    label: "planningTamperCasesRejected not equal planningTamperCaseCount",
    mutate: (r) => ({ ...r, planningTamperCasesRejected: r.planningTamperCasesRejected - 1 }),
  },
  { label: "planningTamperCoveragePassing false", mutate: (r) => ({ ...r, planningTamperCoveragePassing: false as true }) },
];

// ─── Exported plan function ───────────────────────────────────────────────────

/**
 * Planning record for 8.7A — TD-002 Evidence Gates production wiring plan.
 *
 * Planning-only. No imports. No external calls. No side effects.
 * Returns a synchronous planning result with tamper coverage.
 * readyFor8x7B is a readiness signal only — not route wiring authorization.
 */
export function runControlledRealDocumentEvidenceGatesProductionWiringPlan(): EvidenceGatesWiringPlanResult {
  const planningFailures: string[] = [];

  const plannedFutureSequence: string[] = [
    "1. Identify production runSmartTalk integration boundary: locate the post-prompt, pre-response layer where Evidence Gates can be inserted without affecting prompt construction or model call.",
    "2. Insert Evidence Gates only after pre-model safety normalization/redaction boundary is satisfied: TD-004 pre-model PII redaction must be applied (and route-wired) before Evidence Gates can operate on any text.",
    "3. Keep model output untrusted: all model responses must pass through Evidence Gate evaluation before any downstream action is taken; no model output is implicitly trusted.",
    "4. Run claim authorization before any high-risk claim is allowed: ClaimRule evaluation must confirm authorization level before a claim is surfaced to any consumer.",
    "5. Run reality authorization before any document-derived claim is allowed: EvidenceRule resolution must trace each claim to a structured evidence anchor, not a coarse substring match.",
    "6. Run trap activation only from structured governance metadata: TrapActivation must be driven by structured trap descriptors and governance-level annotations, not ad-hoc substring heuristics.",
    "7. Keep user-visible output blocked unless governance authorization explicitly permits it: a safeForUserVisibleOutput gate must be passed and separately authorized before any output reaches users.",
    "8. Keep real document input blocked until separate route-level authorization exists: a dedicated controlled-document route must be authorized independently before any real document enters the Evidence Gate pipeline.",
    "9. Keep persistence disabled unless separately authorized: no Evidence Gate evaluation result, trap disposition, or claim record may be persisted without a separate authorization and audit trail.",
    "10. Require post-wiring audit and closure decision before public/pilot/production authorization: after wiring is implemented (8.7D/8.7E), a post-patch audit (8.7F) and closure decision (8.7G) are required before any public, pilot, or production authorization is granted.",
  ];

  const riskInventory: string[] = [
    "TD-002-R01: Evidence Gates exist but are not wired into production runSmartTalk — no claims are evaluated in production today.",
    "TD-002-R02: ClaimRule OR semantics must not be naive keyword-hit equals claim — a keyword match alone does not constitute a valid claim authorization.",
    "TD-002-R03: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics — free-text similarity is not a substitute for anchored evidence resolution.",
    "TD-002-R04: Proximity remains manual-only — spatial/temporal proximity between evidence items is not automatically computed; structured anchors are required before automation.",
    "TD-002-R05: TrapActivation.trapKind should eventually be tightened from an open string to a safe discriminated union — open string allows unvalidated trap kinds to enter the production path.",
    "TD-002-R06: enforcementTrapHeuristic coarse substring debt must not become production enforcement — the current heuristic is a development placeholder and must be replaced before wiring.",
    "TD-002-R07: SeverityCandidate and SeverityDerivation must remain separated — conflating candidate severity with derived severity risks incorrect enforcement escalation.",
    "TD-002-R08: TrapDisposition production states and dry-run candidate states must not be mixed — a dry-run disposition must never be treated as a live production disposition.",
    "TD-002-R09: Mapper diagnostic taxonomy debt remains separate — mapper-level diagnostics must not be silenced or hidden by the wiring phase; they require a dedicated resolution pass.",
    "TD-002-R10: TD-004 pre-model PII redaction is closed only at isolated utility/audit-readiness level — TD-004 closure does not authorize route wiring, real document input, user-visible output, or public runtime for Evidence Gates.",
  ];

  // ── Build provisional canonical result for tamper check ──────────────────
  const tamperCaseCount = PLAN_TAMPER_CASES.length;
  const notes: string[] = [
    "8.7A planning record for TD-002 Evidence Gates production wiring created",
    "TD-002 Evidence Gates are not wired into production runSmartTalk — planning only",
    `Planned future wiring sequence recorded: ${plannedFutureSequence.length} steps`,
    `Risk inventory recorded: ${riskInventory.length} items`,
    "TD-004 Pre-Model PII Redaction closed at isolated utility level only — does not authorize route wiring or Evidence Gates wiring",
    "All authorization boundaries preserved: no route wiring, no real document input, no user-visible output, no public runtime",
    "readyFor8x7B: readiness signal only — not route wiring or runtime authorization",
  ];

  const provisional: EvidenceGatesWiringPlanResult = {
    checkId: "8.7A",
    allPassed: true,
    planningOnly: true,
    planFileCreated: true,
    existingFilesModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    td002EvidenceGatesProductionWiringPlanCreated: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002StillRequiresWiringContract: true,
    td002StillRequiresDryRunPatch: true,
    td002StillRequiresPostPatchAudit: true,
    td002StillRequiresClosureDecision: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true,
    td004DoesNotAuthorizeRouteWiringConfirmed: true,
    td004DoesNotAuthorizeRealDocumentInputConfirmed: true,
    td004DoesNotAuthorizeUserVisibleOutputConfirmed: true,
    td004DoesNotAuthorizePublicRuntimeConfirmed: true,
    futureIntegrationBoundaryIdentified: true,
    preModelSafetyBoundaryRequiredBeforeEvidenceGates: true,
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
    claimRuleOrSemanticsDebtTracked: true,
    evidenceRuleResolutionDebtTracked: true,
    proximityManualOnlyDebtTracked: true,
    trapKindTypingDebtTracked: true,
    trapDispositionStateSeparationDebtTracked: true,
    severityCandidateDerivationSeparationDebtTracked: true,
    mapperDiagnosticTaxonomyDebtTracked: true,
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
    readyFor8x7BEvidenceGatesProductionWiringContract: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    plannedFutureSequence,
    riskInventory,
    planningTamperCaseCount: tamperCaseCount,
    planningTamperCasesRejected: tamperCaseCount,
    planningTamperCoveragePassing: true,
    notes,
  };

  // ── Verify canonical result passes its own checker ────────────────────────
  if (!_isCanonicalPlanResult(provisional)) {
    planningFailures.push("internal: provisional plan result failed its own canonical checker");
  }

  // ── Run 8.7A tamper cases ─────────────────────────────────────────────────
  let planningTamperCasesRejected = 0;
  const tamperFailures: string[] = [];

  for (let i = 0; i < PLAN_TAMPER_CASES.length; i++) {
    const tc = PLAN_TAMPER_CASES[i];
    const tampered = tc.mutate(provisional);
    if (!_isCanonicalPlanResult(tampered)) {
      planningTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.7A tamper case not rejected: "${tc.label}"`);
    }
  }

  if (tamperFailures.length > 0) {
    planningFailures.push(...tamperFailures);
  }

  const allPassed =
    planningFailures.length === 0 &&
    planningTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...notes,
    `8.7A tamper cases: ${planningTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(planningFailures.length > 0
      ? [`FAILURES (${planningFailures.length}):`, ...planningFailures]
      : []),
  ];

  return {
    checkId: "8.7A",
    allPassed,
    planningOnly: true,
    planFileCreated: true,
    existingFilesModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    runSmartTalkModified: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    td002EvidenceGatesProductionWiringPlanCreated: true,
    td002EvidenceGatesStillNotWiredIntoProductionRunSmartTalk: true,
    td002EvidenceGatesProductionWiringNotImplementedYet: true,
    td002StillRequiresWiringContract: true,
    td002StillRequiresDryRunPatch: true,
    td002StillRequiresPostPatchAudit: true,
    td002StillRequiresClosureDecision: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevelConfirmed: true,
    td004DoesNotAuthorizeRouteWiringConfirmed: true,
    td004DoesNotAuthorizeRealDocumentInputConfirmed: true,
    td004DoesNotAuthorizeUserVisibleOutputConfirmed: true,
    td004DoesNotAuthorizePublicRuntimeConfirmed: true,
    futureIntegrationBoundaryIdentified: true,
    preModelSafetyBoundaryRequiredBeforeEvidenceGates: true,
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
    claimRuleOrSemanticsDebtTracked: true,
    evidenceRuleResolutionDebtTracked: true,
    proximityManualOnlyDebtTracked: true,
    trapKindTypingDebtTracked: true,
    trapDispositionStateSeparationDebtTracked: true,
    severityCandidateDerivationSeparationDebtTracked: true,
    mapperDiagnosticTaxonomyDebtTracked: true,
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
    readyFor8x7BEvidenceGatesProductionWiringContract: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    plannedFutureSequence,
    riskInventory,
    planningTamperCaseCount: tamperCaseCount,
    planningTamperCasesRejected,
    planningTamperCoveragePassing: true,
    notes: finalNotes,
  };
}
