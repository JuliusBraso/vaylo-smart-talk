/**
 * PHASE 8.8B — Controlled Runtime Activation Plan for Free Smart Talk Q&A
 *
 * Planning-only phase. This phase creates a controlled runtime activation plan
 * for Free Smart Talk Q&A only.
 *
 * TD status (inherited from 8.8A):
 * TD-001: closed_document_bypass_guard
 * TD-002: closed_for_scoped_disabled_by_default_containment_seam_only
 * TD-003: closed_photo_ocr_route_containment
 * TD-004: closed_isolated_pre_model_pii_redaction_utility_only
 * TD-005: closed_paid_document_mode_boundary_containment
 *
 * This phase MUST NOT:
 * - Activate runtime
 * - Enable the Evidence Gates seam
 * - Change EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED
 * - Modify runSmartTalk
 * - Import or execute runSmartTalk
 * - Modify route files
 * - Add runtime product functionality
 * - Call models, process real user input, or enable real document input
 *
 * Strategic activation order:
 * 1. Free Smart Talk Q&A only (this phase — planning only)
 * 2. Text document mode (future)
 * 3. Photo/OCR document mode (future)
 * 4. Scanner/upload of scanned documents (deferred to Vaylo DNA)
 *
 * Future required phases before any activation:
 * - 8.8C: Controlled Runtime Activation Contract for Free Q&A
 * - 8.8D: Synthetic Runtime Activation Dry-Run for Free Q&A
 * - 8.8E: Post-Activation Readiness Audit for Free Q&A
 * - 8.8F: Controlled Internal Test Authorization for Free Q&A
 *
 * This phase itself does NOT authorize activation.
 */

import { runSmartTalkGovernanceKernelConsolidationAudit } from "./run-smart-talk-governance-kernel-consolidation-audit";

// ─── TD status literal types ──────────────────────────────────────────────────

type Td001StatusConfirmed = "closed_document_bypass_guard";
type Td002StatusConfirmed = "closed_for_scoped_disabled_by_default_containment_seam_only";
type Td003StatusConfirmed = "closed_photo_ocr_route_containment";
type Td004StatusConfirmed = "closed_isolated_pre_model_pii_redaction_utility_only";
type Td005StatusConfirmed = "closed_paid_document_mode_boundary_containment";
type ActivationTarget88B = "free_smart_talk_qa_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaActivationPlanResult {
  checkId: "8.8B";
  allPassed: boolean;
  controlledRuntimeActivationPlanOnly: true;
  freeQaControlledRuntimeActivationPlanFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  governanceKernelConsolidationAuditFileModified: false;
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
  documentRuntimeActivationPerformed: false;
  photoOcrRuntimeActivationPerformed: false;
  scannerRuntimeActivationPerformed: false;
  paidDocumentModeRuntimeActivationPerformed: false;
  vayloDnaRuntimeActivationPerformed: false;
  importedOnlyGovernanceKernelConsolidationAuditRunner: true;
  noOtherImportsUsed: true;
  governanceKernelConsolidationAuditRunnerCalled: true;
  governanceKernelConsolidationAuditCheckId: "8.8A";
  governanceKernelConsolidationAuditAllPassed: true;
  governanceKernelReadyForControlledRuntimeActivationPlan: true;
  governanceKernelArchitecturallyPreparedConfirmed: true;
  governanceKernelRuntimeAuthorizedConfirmedFalse: true;
  td001StatusConfirmed: Td001StatusConfirmed;
  td002StatusConfirmed: Td002StatusConfirmed;
  td003StatusConfirmed: Td003StatusConfirmed;
  td004StatusConfirmed: Td004StatusConfirmed;
  td005StatusConfirmed: Td005StatusConfirmed;
  activationTarget: ActivationTarget88B;
  activationPlanCreatedForFreeQaOnly: true;
  activationPlanDoesNotAuthorizeActivation: true;
  activationPlanDoesNotAuthorizeRuntimeExecution: true;
  activationPlanDoesNotAuthorizePublicRuntime: true;
  activationPlanDoesNotAuthorizePilotRuntime: true;
  activationPlanDoesNotAuthorizeProductionRuntime: true;
  activationPlanDoesNotAuthorizeGoLive: true;
  freeQaQuestionModeInScope: true;
  anonymousQuestionInputInScope: true;
  nonDocumentQuestionInputInScope: true;
  generalQaAnswerOutputInScope: true;
  textDocumentModeOutOfScope: true;
  officialDocumentTextOutOfScope: true;
  pastedOfficialLetterOutOfScope: true;
  documentUploadOutOfScope: true;
  pdfUploadOutOfScope: true;
  imageUploadOutOfScope: true;
  photoInputOutOfScope: true;
  ocrInputOutOfScope: true;
  scannerUploadOutOfScope: true;
  scannedDocumentOutOfScope: true;
  paidDocumentModeOutOfScope: true;
  entitlementRuntimeOutOfScope: true;
  paymentRuntimeOutOfScope: true;
  vayloDnaDocumentStorageOutOfScope: true;
  realDocumentInputOutOfScope: true;
  userVisibleDocumentOutputOutOfScope: true;
  exactLegalDeadlineCalculationOutOfScope: true;
  evidenceGatesSeamExistsButDisabledByDefault: true;
  evidenceGatesSeamRemainsInert: true;
  evidenceGatesDryRunAdapterNotCalledWhileDisabled: true;
  evidenceGatesDryRunAdapterOutputNotUserVisible: true;
  evidenceGatesDryRunAdapterOutputNotPersisted: true;
  evidenceGatesSeamActivationUnauthorized: true;
  documentLikeTextGuardMustRemainActive: true;
  photoOcrRouteContainmentMustRemainActive: true;
  preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired: true;
  modelOutputRemainsUntrusted: true;
  claimAuthorizationSeparateFromRealityAuthorization: true;
  highRiskClaimsBlockedUnlessClaimAuthorized: true;
  documentDerivedClaimsBlockedUnlessRealityAuthorized: true;
  trapActivationStructuredMetadataOnly: true;
  unsafeUnknownStatesFailClosed: true;
  evidenceGatesUserVisibleOutputBlockedByDefault: true;
  exactLegalDeadlineCalculationUnauthorized: true;
  auditMetadataNonPersistentByDefault: true;
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
  documentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  scannerUploadAuthorizedNow: false;
  vayloDnaRuntimeAuthorizedNow: false;
  controlledRuntimeActivationContractRequired: true;
  controlledRuntimeActivationSyntheticDryRunRequired: true;
  controlledRuntimeActivationReadinessAuditRequired: true;
  controlledRuntimeActivationClosureDecisionRequired: true;
  controlledInternalTestAuthorizationRequired: true;
  claimRuleOrSemanticsDebtPreserved: true;
  evidenceRuleResolutionDebtPreserved: true;
  proximityManualOnlyDebtPreserved: true;
  trapKindTypingDebtPreserved: true;
  enforcementTrapHeuristicDebtPreserved: true;
  trapDispositionStateSeparationDebtPreserved: true;
  severityCandidateDerivationSeparationDebtPreserved: true;
  mapperDiagnosticTaxonomyDebtPreserved: true;
  td004ClosureDoesNotAuthorizeWiringDebtPreserved: true;
  governanceKernelConsolidationTamperConfirmedFrom8x8A: true;
  governanceKernelConsolidationTamperCaseCount: number;
  governanceKernelConsolidationTamperCasesRejected: number;
  evidenceGatesClosureDecisionTamperConfirmedFrom8x8A: true;
  evidenceGatesClosureDecisionTamperCaseCount: number;
  evidenceGatesClosureDecisionTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperConfirmedFrom8x8A: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x8A: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x8A: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x8A: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x8A: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x8A: true;
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
  readyFor8x8CControlledRuntimeActivationContract: true;
  readyForRuntimeActivation: false;
  readyForRealDocumentInput: false;
  readyForUserVisibleDocumentOutput: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  freeQaActivationPlan: string[];
  forbiddenInputClasses: string[];
  safetyRequirements: string[];
  futureRequiredPhases: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  planningNotes: string[];
  freeQaControlledRuntimeActivationPlanTamperCaseCount: number;
  freeQaControlledRuntimeActivationPlanTamperCasesRejected: number;
  freeQaControlledRuntimeActivationPlanTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const TD001_CONFIRMED: Td001StatusConfirmed = "closed_document_bypass_guard";
const TD002_CONFIRMED: Td002StatusConfirmed = "closed_for_scoped_disabled_by_default_containment_seam_only";
const TD003_CONFIRMED: Td003StatusConfirmed = "closed_photo_ocr_route_containment";
const TD004_CONFIRMED: Td004StatusConfirmed = "closed_isolated_pre_model_pii_redaction_utility_only";
const TD005_CONFIRMED: Td005StatusConfirmed = "closed_paid_document_mode_boundary_containment";
const ACTIVATION_TARGET: ActivationTarget88B = "free_smart_talk_qa_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_FREE_QA = "Free Smart Talk Q&A";
const SENTINEL_OFFICIAL_DOC = "official document text";
const SENTINEL_OCR_PHOTO = "OCR/photo";
const SENTINEL_SCANNER_UPLOAD = "scanner upload";
const SENTINEL_DOC_LIKE_GUARD = "document-like text guard";
const SENTINEL_MODEL_UNTRUSTED = "model output remains untrusted";
const SENTINEL_8X8C_CONTRACT = "8.8C-controlled-runtime-activation-contract-for-free-qa";
const SENTINEL_RUNTIME_ACTIVATION_BLOCKER = "runtime-activation-unauthorized-global-blocker";
const SENTINEL_DOCUMENT_MODE_BLOCKER = "document-mode-unauthorized-global-blocker";
const SENTINEL_PHOTO_OCR_BLOCKER = "photo-ocr-runtime-unauthorized-global-blocker";
const SENTINEL_SCANNER_BLOCKER = "scanner-upload-unauthorized-global-blocker";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaActivationPlanResult(r: FreeQaActivationPlanResult): boolean {
  // Phase identity
  if (r.checkId !== "8.8B") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledRuntimeActivationPlanOnly !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.governanceKernelConsolidationAuditFileModified !== false) return false;
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
  if (r.documentRuntimeActivationPerformed !== false) return false;
  if (r.photoOcrRuntimeActivationPerformed !== false) return false;
  if (r.scannerRuntimeActivationPerformed !== false) return false;
  if (r.paidDocumentModeRuntimeActivationPerformed !== false) return false;
  if (r.vayloDnaRuntimeActivationPerformed !== false) return false;
  // Import/runner flags
  if (r.importedOnlyGovernanceKernelConsolidationAuditRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.governanceKernelConsolidationAuditRunnerCalled !== true) return false;
  if (r.governanceKernelConsolidationAuditCheckId !== "8.8A") return false;
  if (r.governanceKernelConsolidationAuditAllPassed !== true) return false;
  if (r.governanceKernelReadyForControlledRuntimeActivationPlan !== true) return false;
  if (r.governanceKernelArchitecturallyPreparedConfirmed !== true) return false;
  if (r.governanceKernelRuntimeAuthorizedConfirmedFalse !== true) return false;
  // TD status confirmations
  if (r.td001StatusConfirmed !== TD001_CONFIRMED) return false;
  if (r.td002StatusConfirmed !== TD002_CONFIRMED) return false;
  if (r.td003StatusConfirmed !== TD003_CONFIRMED) return false;
  if (r.td004StatusConfirmed !== TD004_CONFIRMED) return false;
  if (r.td005StatusConfirmed !== TD005_CONFIRMED) return false;
  // Activation plan flags
  if (r.activationTarget !== ACTIVATION_TARGET) return false;
  if (r.activationPlanCreatedForFreeQaOnly !== true) return false;
  if (r.activationPlanDoesNotAuthorizeActivation !== true) return false;
  if (r.activationPlanDoesNotAuthorizeRuntimeExecution !== true) return false;
  if (r.activationPlanDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.activationPlanDoesNotAuthorizePilotRuntime !== true) return false;
  if (r.activationPlanDoesNotAuthorizeProductionRuntime !== true) return false;
  if (r.activationPlanDoesNotAuthorizeGoLive !== true) return false;
  // In-scope flags
  if (r.freeQaQuestionModeInScope !== true) return false;
  if (r.anonymousQuestionInputInScope !== true) return false;
  if (r.nonDocumentQuestionInputInScope !== true) return false;
  if (r.generalQaAnswerOutputInScope !== true) return false;
  // Out-of-scope flags
  if (r.textDocumentModeOutOfScope !== true) return false;
  if (r.officialDocumentTextOutOfScope !== true) return false;
  if (r.pastedOfficialLetterOutOfScope !== true) return false;
  if (r.documentUploadOutOfScope !== true) return false;
  if (r.pdfUploadOutOfScope !== true) return false;
  if (r.imageUploadOutOfScope !== true) return false;
  if (r.photoInputOutOfScope !== true) return false;
  if (r.ocrInputOutOfScope !== true) return false;
  if (r.scannerUploadOutOfScope !== true) return false;
  if (r.scannedDocumentOutOfScope !== true) return false;
  if (r.paidDocumentModeOutOfScope !== true) return false;
  if (r.entitlementRuntimeOutOfScope !== true) return false;
  if (r.paymentRuntimeOutOfScope !== true) return false;
  if (r.vayloDnaDocumentStorageOutOfScope !== true) return false;
  if (r.realDocumentInputOutOfScope !== true) return false;
  if (r.userVisibleDocumentOutputOutOfScope !== true) return false;
  if (r.exactLegalDeadlineCalculationOutOfScope !== true) return false;
  // Evidence Gates seam/adapter flags
  if (r.evidenceGatesSeamExistsButDisabledByDefault !== true) return false;
  if (r.evidenceGatesSeamRemainsInert !== true) return false;
  if (r.evidenceGatesDryRunAdapterNotCalledWhileDisabled !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotUserVisible !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotPersisted !== true) return false;
  if (r.evidenceGatesSeamActivationUnauthorized !== true) return false;
  // Safety flags
  if (r.documentLikeTextGuardMustRemainActive !== true) return false;
  if (r.photoOcrRouteContainmentMustRemainActive !== true) return false;
  if (r.preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired !== true) return false;
  if (r.modelOutputRemainsUntrusted !== true) return false;
  if (r.claimAuthorizationSeparateFromRealityAuthorization !== true) return false;
  if (r.highRiskClaimsBlockedUnlessClaimAuthorized !== true) return false;
  if (r.documentDerivedClaimsBlockedUnlessRealityAuthorized !== true) return false;
  if (r.trapActivationStructuredMetadataOnly !== true) return false;
  if (r.unsafeUnknownStatesFailClosed !== true) return false;
  if (r.evidenceGatesUserVisibleOutputBlockedByDefault !== true) return false;
  if (r.exactLegalDeadlineCalculationUnauthorized !== true) return false;
  if (r.auditMetadataNonPersistentByDefault !== true) return false;
  // Authorization false-boundary
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
  if (r.documentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.scannerUploadAuthorizedNow !== false) return false;
  if (r.vayloDnaRuntimeAuthorizedNow !== false) return false;
  // Future required phase flags
  if (r.controlledRuntimeActivationContractRequired !== true) return false;
  if (r.controlledRuntimeActivationSyntheticDryRunRequired !== true) return false;
  if (r.controlledRuntimeActivationReadinessAuditRequired !== true) return false;
  if (r.controlledRuntimeActivationClosureDecisionRequired !== true) return false;
  if (r.controlledInternalTestAuthorizationRequired !== true) return false;
  // Preserved governance debts
  if (r.claimRuleOrSemanticsDebtPreserved !== true) return false;
  if (r.evidenceRuleResolutionDebtPreserved !== true) return false;
  if (r.proximityManualOnlyDebtPreserved !== true) return false;
  if (r.trapKindTypingDebtPreserved !== true) return false;
  if (r.enforcementTrapHeuristicDebtPreserved !== true) return false;
  if (r.trapDispositionStateSeparationDebtPreserved !== true) return false;
  if (r.severityCandidateDerivationSeparationDebtPreserved !== true) return false;
  if (r.mapperDiagnosticTaxonomyDebtPreserved !== true) return false;
  if (r.td004ClosureDoesNotAuthorizeWiringDebtPreserved !== true) return false;
  // Inherited 8.8A count confirmations
  if (r.governanceKernelConsolidationTamperConfirmedFrom8x8A !== true) return false;
  if (r.governanceKernelConsolidationTamperCasesRejected !== r.governanceKernelConsolidationTamperCaseCount) return false;
  if (r.evidenceGatesClosureDecisionTamperConfirmedFrom8x8A !== true) return false;
  if (r.evidenceGatesClosureDecisionTamperCasesRejected !== r.evidenceGatesClosureDecisionTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x8A !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x8A !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x8A !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x8A !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x8A !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x8A !== true) return false;
  if (r.wiringExecutionContractTamperCasesRejected !== r.wiringExecutionContractTamperCaseCount) return false;
  // No* side-effect flags
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
  // Readiness flags
  if (r.readyFor8x8CControlledRuntimeActivationContract !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleDocumentOutput !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  // Arrays non-empty
  if (!r.freeQaActivationPlan || r.freeQaActivationPlan.length === 0) return false;
  if (!r.forbiddenInputClasses || r.forbiddenInputClasses.length === 0) return false;
  if (!r.safetyRequirements || r.safetyRequirements.length === 0) return false;
  if (!r.futureRequiredPhases || r.futureRequiredPhases.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.planningNotes || r.planningNotes.length === 0) return false;
  // Sentinel checks
  const planJ = r.freeQaActivationPlan.join(" ");
  if (!planJ.includes(SENTINEL_FREE_QA)) return false;
  const forbidJ = r.forbiddenInputClasses.join(" ");
  if (!forbidJ.includes(SENTINEL_OFFICIAL_DOC)) return false;
  if (!forbidJ.includes(SENTINEL_OCR_PHOTO)) return false;
  if (!forbidJ.includes(SENTINEL_SCANNER_UPLOAD)) return false;
  const safetyJ = r.safetyRequirements.join(" ");
  if (!safetyJ.includes(SENTINEL_DOC_LIKE_GUARD)) return false;
  if (!safetyJ.includes(SENTINEL_MODEL_UNTRUSTED)) return false;
  const futureJ = r.futureRequiredPhases.join(" ");
  if (!futureJ.includes(SENTINEL_8X8C_CONTRACT)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_ACTIVATION_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKER)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Tamper coverage
  if (r.freeQaControlledRuntimeActivationPlanTamperCasesRejected !== r.freeQaControlledRuntimeActivationPlanTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type FreeQaTamperMutation = (r: FreeQaActivationPlanResult) => FreeQaActivationPlanResult;
interface FreeQaTamperCase { label: string; mutate: FreeQaTamperMutation; }

const FREE_QA_TAMPER_CASES: FreeQaTamperCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8A" as "8.8B" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "controlledRuntimeActivationPlanOnly false", mutate: (r) => ({ ...r, controlledRuntimeActivationPlanOnly: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanFileCreated false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "governanceKernelConsolidationAuditFileModified true", mutate: (r) => ({ ...r, governanceKernelConsolidationAuditFileModified: true as false }) },
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
  { label: "documentRuntimeActivationPerformed true", mutate: (r) => ({ ...r, documentRuntimeActivationPerformed: true as false }) },
  { label: "photoOcrRuntimeActivationPerformed true", mutate: (r) => ({ ...r, photoOcrRuntimeActivationPerformed: true as false }) },
  { label: "scannerRuntimeActivationPerformed true", mutate: (r) => ({ ...r, scannerRuntimeActivationPerformed: true as false }) },
  { label: "paidDocumentModeRuntimeActivationPerformed true", mutate: (r) => ({ ...r, paidDocumentModeRuntimeActivationPerformed: true as false }) },
  { label: "vayloDnaRuntimeActivationPerformed true", mutate: (r) => ({ ...r, vayloDnaRuntimeActivationPerformed: true as false }) },
  // Import/runner flags
  { label: "importedOnlyGovernanceKernelConsolidationAuditRunner false", mutate: (r) => ({ ...r, importedOnlyGovernanceKernelConsolidationAuditRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "governanceKernelConsolidationAuditRunnerCalled false", mutate: (r) => ({ ...r, governanceKernelConsolidationAuditRunnerCalled: false as true }) },
  { label: "governanceKernelConsolidationAuditCheckId wrong", mutate: (r) => ({ ...r, governanceKernelConsolidationAuditCheckId: "8.7J" as "8.8A" }) },
  { label: "governanceKernelConsolidationAuditAllPassed false", mutate: (r) => ({ ...r, governanceKernelConsolidationAuditAllPassed: false as true }) },
  { label: "governanceKernelReadyForControlledRuntimeActivationPlan false", mutate: (r) => ({ ...r, governanceKernelReadyForControlledRuntimeActivationPlan: false as true }) },
  { label: "governanceKernelArchitecturallyPreparedConfirmed false", mutate: (r) => ({ ...r, governanceKernelArchitecturallyPreparedConfirmed: false as true }) },
  { label: "governanceKernelRuntimeAuthorizedConfirmedFalse false", mutate: (r) => ({ ...r, governanceKernelRuntimeAuthorizedConfirmedFalse: false as true }) },
  // TD status confirmations
  { label: "td001StatusConfirmed wrong", mutate: (r) => ({ ...r, td001StatusConfirmed: "open" as Td001StatusConfirmed }) },
  { label: "td002StatusConfirmed wrong", mutate: (r) => ({ ...r, td002StatusConfirmed: "closed_for_production" as Td002StatusConfirmed }) },
  { label: "td003StatusConfirmed wrong", mutate: (r) => ({ ...r, td003StatusConfirmed: "open" as Td003StatusConfirmed }) },
  { label: "td004StatusConfirmed wrong", mutate: (r) => ({ ...r, td004StatusConfirmed: "open" as Td004StatusConfirmed }) },
  { label: "td005StatusConfirmed wrong", mutate: (r) => ({ ...r, td005StatusConfirmed: "open" as Td005StatusConfirmed }) },
  // Activation plan flags
  { label: "activationTarget wrong", mutate: (r) => ({ ...r, activationTarget: "text_document_mode" as ActivationTarget88B }) },
  { label: "activationPlanCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, activationPlanCreatedForFreeQaOnly: false as true }) },
  { label: "activationPlanDoesNotAuthorizeActivation false", mutate: (r) => ({ ...r, activationPlanDoesNotAuthorizeActivation: false as true }) },
  { label: "activationPlanDoesNotAuthorizeRuntimeExecution false", mutate: (r) => ({ ...r, activationPlanDoesNotAuthorizeRuntimeExecution: false as true }) },
  { label: "activationPlanDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, activationPlanDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "activationPlanDoesNotAuthorizePilotRuntime false", mutate: (r) => ({ ...r, activationPlanDoesNotAuthorizePilotRuntime: false as true }) },
  { label: "activationPlanDoesNotAuthorizeProductionRuntime false", mutate: (r) => ({ ...r, activationPlanDoesNotAuthorizeProductionRuntime: false as true }) },
  { label: "activationPlanDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, activationPlanDoesNotAuthorizeGoLive: false as true }) },
  // In-scope flags
  { label: "freeQaQuestionModeInScope false", mutate: (r) => ({ ...r, freeQaQuestionModeInScope: false as true }) },
  { label: "anonymousQuestionInputInScope false", mutate: (r) => ({ ...r, anonymousQuestionInputInScope: false as true }) },
  { label: "nonDocumentQuestionInputInScope false", mutate: (r) => ({ ...r, nonDocumentQuestionInputInScope: false as true }) },
  { label: "generalQaAnswerOutputInScope false", mutate: (r) => ({ ...r, generalQaAnswerOutputInScope: false as true }) },
  // Out-of-scope flags
  { label: "textDocumentModeOutOfScope false", mutate: (r) => ({ ...r, textDocumentModeOutOfScope: false as true }) },
  { label: "officialDocumentTextOutOfScope false", mutate: (r) => ({ ...r, officialDocumentTextOutOfScope: false as true }) },
  { label: "pastedOfficialLetterOutOfScope false", mutate: (r) => ({ ...r, pastedOfficialLetterOutOfScope: false as true }) },
  { label: "documentUploadOutOfScope false", mutate: (r) => ({ ...r, documentUploadOutOfScope: false as true }) },
  { label: "pdfUploadOutOfScope false", mutate: (r) => ({ ...r, pdfUploadOutOfScope: false as true }) },
  { label: "imageUploadOutOfScope false", mutate: (r) => ({ ...r, imageUploadOutOfScope: false as true }) },
  { label: "photoInputOutOfScope false", mutate: (r) => ({ ...r, photoInputOutOfScope: false as true }) },
  { label: "ocrInputOutOfScope false", mutate: (r) => ({ ...r, ocrInputOutOfScope: false as true }) },
  { label: "scannerUploadOutOfScope false", mutate: (r) => ({ ...r, scannerUploadOutOfScope: false as true }) },
  { label: "scannedDocumentOutOfScope false", mutate: (r) => ({ ...r, scannedDocumentOutOfScope: false as true }) },
  { label: "paidDocumentModeOutOfScope false", mutate: (r) => ({ ...r, paidDocumentModeOutOfScope: false as true }) },
  { label: "entitlementRuntimeOutOfScope false", mutate: (r) => ({ ...r, entitlementRuntimeOutOfScope: false as true }) },
  { label: "paymentRuntimeOutOfScope false", mutate: (r) => ({ ...r, paymentRuntimeOutOfScope: false as true }) },
  { label: "vayloDnaDocumentStorageOutOfScope false", mutate: (r) => ({ ...r, vayloDnaDocumentStorageOutOfScope: false as true }) },
  { label: "realDocumentInputOutOfScope false", mutate: (r) => ({ ...r, realDocumentInputOutOfScope: false as true }) },
  { label: "userVisibleDocumentOutputOutOfScope false", mutate: (r) => ({ ...r, userVisibleDocumentOutputOutOfScope: false as true }) },
  { label: "exactLegalDeadlineCalculationOutOfScope false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationOutOfScope: false as true }) },
  // Evidence Gates seam/adapter flags
  { label: "evidenceGatesSeamExistsButDisabledByDefault false", mutate: (r) => ({ ...r, evidenceGatesSeamExistsButDisabledByDefault: false as true }) },
  { label: "evidenceGatesSeamRemainsInert false", mutate: (r) => ({ ...r, evidenceGatesSeamRemainsInert: false as true }) },
  { label: "evidenceGatesDryRunAdapterNotCalledWhileDisabled false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterNotCalledWhileDisabled: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotUserVisible false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotUserVisible: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotPersisted false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotPersisted: false as true }) },
  { label: "evidenceGatesSeamActivationUnauthorized false", mutate: (r) => ({ ...r, evidenceGatesSeamActivationUnauthorized: false as true }) },
  // Safety flags
  { label: "documentLikeTextGuardMustRemainActive false", mutate: (r) => ({ ...r, documentLikeTextGuardMustRemainActive: false as true }) },
  { label: "photoOcrRouteContainmentMustRemainActive false", mutate: (r) => ({ ...r, photoOcrRouteContainmentMustRemainActive: false as true }) },
  { label: "preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired false", mutate: (r) => ({ ...r, preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired: false as true }) },
  { label: "modelOutputRemainsUntrusted false", mutate: (r) => ({ ...r, modelOutputRemainsUntrusted: false as true }) },
  { label: "claimAuthorizationSeparateFromRealityAuthorization false", mutate: (r) => ({ ...r, claimAuthorizationSeparateFromRealityAuthorization: false as true }) },
  { label: "highRiskClaimsBlockedUnlessClaimAuthorized false", mutate: (r) => ({ ...r, highRiskClaimsBlockedUnlessClaimAuthorized: false as true }) },
  { label: "documentDerivedClaimsBlockedUnlessRealityAuthorized false", mutate: (r) => ({ ...r, documentDerivedClaimsBlockedUnlessRealityAuthorized: false as true }) },
  { label: "trapActivationStructuredMetadataOnly false", mutate: (r) => ({ ...r, trapActivationStructuredMetadataOnly: false as true }) },
  { label: "unsafeUnknownStatesFailClosed false", mutate: (r) => ({ ...r, unsafeUnknownStatesFailClosed: false as true }) },
  { label: "evidenceGatesUserVisibleOutputBlockedByDefault false", mutate: (r) => ({ ...r, evidenceGatesUserVisibleOutputBlockedByDefault: false as true }) },
  { label: "exactLegalDeadlineCalculationUnauthorized false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationUnauthorized: false as true }) },
  { label: "auditMetadataNonPersistentByDefault false", mutate: (r) => ({ ...r, auditMetadataNonPersistentByDefault: false as true }) },
  // Authorization false-boundary flipped true
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
  { label: "documentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, documentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "scannerUploadAuthorizedNow true", mutate: (r) => ({ ...r, scannerUploadAuthorizedNow: true as false }) },
  { label: "vayloDnaRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, vayloDnaRuntimeAuthorizedNow: true as false }) },
  // Future required phase flags
  { label: "controlledRuntimeActivationContractRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationContractRequired: false as true }) },
  { label: "controlledRuntimeActivationSyntheticDryRunRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationSyntheticDryRunRequired: false as true }) },
  { label: "controlledRuntimeActivationReadinessAuditRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationReadinessAuditRequired: false as true }) },
  { label: "controlledRuntimeActivationClosureDecisionRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationClosureDecisionRequired: false as true }) },
  { label: "controlledInternalTestAuthorizationRequired false", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationRequired: false as true }) },
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
  // Inherited 8.8A count confirmation booleans
  { label: "governanceKernelConsolidationTamperConfirmedFrom8x8A false", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperConfirmedFrom8x8A: false as true }) },
  { label: "evidenceGatesClosureDecisionTamperConfirmedFrom8x8A false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperConfirmedFrom8x8A: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x8A false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x8A: false as true }) },
  { label: "postWiringAuditTamperConfirmedFrom8x8A false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x8A: false as true }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x8A false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x8A: false as true }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x8A false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x8A: false as true }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x8A false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x8A: false as true }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x8A false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x8A: false as true }) },
  // Inherited count mismatches
  { label: "governanceKernelConsolidationTamperCasesRejected mismatch", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperCasesRejected: r.governanceKernelConsolidationTamperCasesRejected - 1 }) },
  { label: "evidenceGatesClosureDecisionTamperCasesRejected mismatch", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperCasesRejected: r.evidenceGatesClosureDecisionTamperCasesRejected - 1 }) },
  { label: "scopedWiringContainmentPatchTamperCasesRejected mismatch", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperCasesRejected: r.scopedWiringContainmentPatchTamperCasesRejected - 1 }) },
  { label: "postWiringAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, postWiringAuditTamperCasesRejected: r.postWiringAuditTamperCasesRejected - 1 }) },
  { label: "dryRunSyntheticValidationCasesPassed mismatch", mutate: (r) => ({ ...r, dryRunSyntheticValidationCasesPassed: r.dryRunSyntheticValidationCasesPassed - 1 }) },
  { label: "dryRunLeakageValidationCasesPassed mismatch", mutate: (r) => ({ ...r, dryRunLeakageValidationCasesPassed: r.dryRunLeakageValidationCasesPassed - 1 }) },
  { label: "dryRunTamperCasesRejected mismatch", mutate: (r) => ({ ...r, dryRunTamperCasesRejected: r.dryRunTamperCasesRejected - 1 }) },
  { label: "wiringExecutionContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, wiringExecutionContractTamperCasesRejected: r.wiringExecutionContractTamperCasesRejected - 1 }) },
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
  { label: "readyFor8x8CControlledRuntimeActivationContract false", mutate: (r) => ({ ...r, readyFor8x8CControlledRuntimeActivationContract: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleDocumentOutput true", mutate: (r) => ({ ...r, readyForUserVisibleDocumentOutput: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  // Array empty
  { label: "freeQaActivationPlan empty", mutate: (r) => ({ ...r, freeQaActivationPlan: [] }) },
  { label: "forbiddenInputClasses empty", mutate: (r) => ({ ...r, forbiddenInputClasses: [] }) },
  { label: "safetyRequirements empty", mutate: (r) => ({ ...r, safetyRequirements: [] }) },
  { label: "futureRequiredPhases empty", mutate: (r) => ({ ...r, futureRequiredPhases: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "planningNotes empty", mutate: (r) => ({ ...r, planningNotes: [] }) },
  // Array sentinel checks
  { label: "freeQaActivationPlan missing Free Smart Talk Q&A sentinel", mutate: (r) => ({ ...r, freeQaActivationPlan: r.freeQaActivationPlan.map((s) => s.split(SENTINEL_FREE_QA).join("omitted")) }) },
  { label: "forbiddenInputClasses missing official document sentinel", mutate: (r) => ({ ...r, forbiddenInputClasses: r.forbiddenInputClasses.map((s) => s.split(SENTINEL_OFFICIAL_DOC).join("omitted")) }) },
  { label: "forbiddenInputClasses missing OCR/photo sentinel", mutate: (r) => ({ ...r, forbiddenInputClasses: r.forbiddenInputClasses.map((s) => s.split(SENTINEL_OCR_PHOTO).join("omitted")) }) },
  { label: "forbiddenInputClasses missing scanner upload sentinel", mutate: (r) => ({ ...r, forbiddenInputClasses: r.forbiddenInputClasses.map((s) => s.split(SENTINEL_SCANNER_UPLOAD).join("omitted")) }) },
  { label: "safetyRequirements missing document-like guard sentinel", mutate: (r) => ({ ...r, safetyRequirements: r.safetyRequirements.map((s) => s.split(SENTINEL_DOC_LIKE_GUARD).join("omitted")) }) },
  { label: "safetyRequirements missing model output untrusted sentinel", mutate: (r) => ({ ...r, safetyRequirements: r.safetyRequirements.map((s) => s.split(SENTINEL_MODEL_UNTRUSTED).join("omitted")) }) },
  { label: "futureRequiredPhases missing 8.8C contract sentinel", mutate: (r) => ({ ...r, futureRequiredPhases: r.futureRequiredPhases.map((s) => s.split(SENTINEL_8X8C_CONTRACT).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime activation blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_ACTIVATION_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKER).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Tamper coverage self-checks
  { label: "freeQaControlledRuntimeActivationPlanTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperCoveragePassing: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperCasesRejected: r.freeQaControlledRuntimeActivationPlanTamperCasesRejected - 1 }) },
];

// ─── Exported plan runner ─────────────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Controlled Runtime Activation Plan runner for 8.8B.
 *
 * Calls the 8.8A Governance Kernel Consolidation Audit runner as source of truth.
 * Confirms the governance kernel is architecturally prepared but NOT runtime-authorized.
 * Creates a planning-only activation plan for Free Smart Talk Q&A only.
 * This phase itself does NOT authorize activation.
 */
export function runFreeQaControlledRuntimeActivationPlan(): FreeQaActivationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.8A Governance Kernel Consolidation Audit runner as source of truth ──
  const a = runSmartTalkGovernanceKernelConsolidationAudit();

  if (a.checkId !== "8.8A") planFailures.push(`8.8A checkId mismatch: expected "8.8A", got "${a.checkId}"`);
  if (a.allPassed !== true) planFailures.push("8.8A allPassed is not true");
  if (a.readyFor8x8BControlledRuntimeActivationPlan !== true) planFailures.push("8.8A readyFor8x8BControlledRuntimeActivationPlan is not true");
  if (a.governanceKernelArchitecturallyPrepared !== true) planFailures.push("8.8A governanceKernelArchitecturallyPrepared is not true");
  if (a.governanceKernelRuntimeAuthorized !== false) planFailures.push("8.8A governanceKernelRuntimeAuthorized is not false — runtime authorization check failed");
  if (a.td001Status !== TD001_CONFIRMED) planFailures.push(`8.8A TD-001 status mismatch: expected "${TD001_CONFIRMED}", got "${a.td001Status}"`);
  if (a.td002Status !== TD002_CONFIRMED) planFailures.push(`8.8A TD-002 status mismatch: expected "${TD002_CONFIRMED}", got "${a.td002Status}"`);
  if (a.td003Status !== TD003_CONFIRMED) planFailures.push(`8.8A TD-003 status mismatch: expected "${TD003_CONFIRMED}", got "${a.td003Status}"`);
  if (a.td004Status !== TD004_CONFIRMED) planFailures.push(`8.8A TD-004 status mismatch: expected "${TD004_CONFIRMED}", got "${a.td004Status}"`);
  if (a.td005Status !== TD005_CONFIRMED) planFailures.push(`8.8A TD-005 status mismatch: expected "${TD005_CONFIRMED}", got "${a.td005Status}"`);
  if (a.evidenceGatesSeamExistsButDisabledByDefault !== true) planFailures.push("8.8A evidenceGatesSeamExistsButDisabledByDefault is not true");
  if (a.evidenceGatesSeamRemainsInert !== true) planFailures.push("8.8A evidenceGatesSeamRemainsInert is not true");
  if (a.evidenceGatesDryRunAdapterNotCalledWhileDisabled !== true) planFailures.push("8.8A evidenceGatesDryRunAdapterNotCalledWhileDisabled is not true");
  if (a.evidenceGatesDryRunAdapterOutputNotUserVisible !== true) planFailures.push("8.8A evidenceGatesDryRunAdapterOutputNotUserVisible is not true");
  if (a.evidenceGatesDryRunAdapterOutputNotPersisted !== true) planFailures.push("8.8A evidenceGatesDryRunAdapterOutputNotPersisted is not true");
  if (a.governanceKernelConsolidationTamperCasesRejected !== a.governanceKernelConsolidationTamperCaseCount) planFailures.push("8.8A governanceKernelConsolidation tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const freeQaActivationPlan: string[] = [
    `AP-01 [${SENTINEL_FREE_QA}]: activationTarget=free_smart_talk_qa_only — Free Smart Talk Q&A anonymous non-document question mode.`,
    "AP-02: runtimeActivationMode=future controlled internal test only, disabled now.",
    "AP-03: allowedInputClass=anonymous non-document user question.",
    "AP-04: userVisibleOutputScope=general Q&A answer only, no document-derived claims, no exact legal deadline calculation, no legal advice claim.",
    "AP-05: This plan does NOT authorize runtime activation. Activation requires 8.8C contract, 8.8D dry-run, 8.8E audit, and 8.8F authorization.",
  ];

  const forbiddenInputClasses: string[] = [
    `FI-01 [${SENTINEL_OFFICIAL_DOC}]: official document text — pasted official letters, regulations, notices, and similar document-like text are forbidden.`,
    `FI-02 [${SENTINEL_OCR_PHOTO}]: OCR/photo input — photo capture, image-derived text, and any OCR pipeline input are forbidden.`,
    `FI-03 [${SENTINEL_SCANNER_UPLOAD}]: scanner upload — scanned document uploads and scanner-derived inputs are forbidden.`,
    "FI-04: PDF/image upload — document file uploads of any format are forbidden.",
    "FI-05: Vaylo DNA stored document — identity-linked or DNA-stored document inputs are forbidden.",
    "FI-06: payment/entitlement-gated document mode — any document mode requiring payment or entitlement check is forbidden.",
    "FI-07: pasted official letter — pasted text that resembles an official letter or legal document is forbidden.",
    "FI-08: scanned document — any scanned or scanner-captured document image or text is forbidden.",
  ];

  const safetyRequirements: string[] = [
    `SR-01 [${SENTINEL_DOC_LIKE_GUARD}]: document-like text guard remains active — the document bypass guard (TD-001) must remain enforced.`,
    `SR-02 [${SENTINEL_MODEL_UNTRUSTED}]: model output remains untrusted — no model output may be treated as authoritative or user-visible without explicit authorization.`,
    "SR-03: photo/OCR route remains contained — TD-003 photo/OCR route containment must remain enforced.",
    "SR-04: pre-model PII redaction remains isolated unless separately wired — TD-004 utility closure does not authorize route wiring.",
    "SR-05: claim/reality authorization separation remains preserved — high-risk claims blocked unless claim-authorized, document-derived claims blocked unless reality-authorized.",
    "SR-06: unsafe/unknown states fail closed — any unrecognized or unsafe runtime state must block execution.",
    "SR-07: Evidence Gates seam remains disabled until future authorization — EVIDENCE_GATES_SCOPED_DRY_RUN_CONTAINMENT_ENABLED must remain false.",
    "SR-08: audit metadata remains non-persistent by default — no governance decision or audit output may be persisted without explicit authorization.",
  ];

  const futureRequiredPhases: string[] = [
    `FP-01 [${SENTINEL_8X8C_CONTRACT}]: 8.8C-controlled-runtime-activation-contract-for-free-qa — Phase 8.8C must define the activation contract before any runtime execution.`,
    "FP-02: 8.8D-synthetic-runtime-activation-dry-run-for-free-qa — Phase 8.8D must validate the activation path synthetically before real input.",
    "FP-03: 8.8E-post-activation-readiness-audit-for-free-qa — Phase 8.8E must audit readiness after dry-run validation.",
    "FP-04: 8.8F-controlled-internal-test-authorization-for-free-qa — Phase 8.8F must explicitly authorize controlled internal testing before any live execution.",
    "FP-05: All of 8.8C, 8.8D, 8.8E, and 8.8F must complete before any controlled runtime activation is attempted.",
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01 [${SENTINEL_RUNTIME_ACTIVATION_BLOCKER}]: runtime-activation-unauthorized-global-blocker — controlled runtime activation is not yet authorized; requires 8.8C contract minimum.`,
    `GB-02 [${SENTINEL_DOCUMENT_MODE_BLOCKER}]: document-mode-unauthorized-global-blocker — text document mode runtime remains unauthorized globally.`,
    `GB-03 [${SENTINEL_PHOTO_OCR_BLOCKER}]: photo-ocr-runtime-unauthorized-global-blocker — photo and OCR runtime remains unauthorized globally.`,
    `GB-04 [${SENTINEL_SCANNER_BLOCKER}]: scanner-upload-unauthorized-global-blocker — scanner upload runtime remains unauthorized globally.`,
    "GB-05: public-runtime-unauthorized-global-blocker — public runtime remains unauthorized globally.",
    "GB-06: production-go-live-unauthorized-global-blocker — production and go-live remain unauthorized globally.",
    "GB-07: pilot-runtime-unauthorized-global-blocker — pilot runtime remains unauthorized globally.",
    "GB-08: seam-activation-unauthorized-global-blocker — Evidence Gates seam activation remains unauthorized.",
    "GB-09: vaylo-dna-runtime-unauthorized-global-blocker — Vaylo DNA document storage runtime remains unauthorized globally.",
    "GB-10: payment-entitlement-runtime-unauthorized-global-blocker — payment and entitlement runtime remain unauthorized globally.",
    "GB-11: exact-legal-deadline-calculation-unauthorized-global-blocker — exact legal deadline calculation remains unauthorized globally.",
    "GB-12: user-visible-document-output-unauthorized-global-blocker — user-visible document-derived output remains unauthorized globally.",
  ];

  const preservedGovernanceDebts: string[] = [
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8B.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8B.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8B.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8B.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8B.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8B.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8B.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8B.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8B.)",
  ];

  const planningNotes: string[] = [
    "8.8B planning: Controlled runtime activation plan for Free Smart Talk Q&A created.",
    "8.8B planning: This plan is planning-only. It does NOT authorize activation.",
    "8.8B planning: All document/photo/OCR/scanner/paid/DNA modes remain out of scope.",
    "8.8B planning: Evidence Gates seam (run-smart-talk.ts) remains disabled by default and inert.",
    "8.8B planning: Governance kernel is architecturally prepared but NOT runtime-authorized.",
    `8.8B planning: 8.8A confirmed — checkId=${a.checkId}, allPassed=${a.allPassed}, governanceKernelArchitecturallyPrepared=${a.governanceKernelArchitecturallyPrepared}, governanceKernelRuntimeAuthorized=${a.governanceKernelRuntimeAuthorized}`,
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_TAMPER_CASES.length;

  const provisional: FreeQaActivationPlanResult = {
    checkId: "8.8B",
    allPassed: true,
    controlledRuntimeActivationPlanOnly: true,
    freeQaControlledRuntimeActivationPlanFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    governanceKernelConsolidationAuditFileModified: false,
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
    documentRuntimeActivationPerformed: false,
    photoOcrRuntimeActivationPerformed: false,
    scannerRuntimeActivationPerformed: false,
    paidDocumentModeRuntimeActivationPerformed: false,
    vayloDnaRuntimeActivationPerformed: false,
    importedOnlyGovernanceKernelConsolidationAuditRunner: true,
    noOtherImportsUsed: true,
    governanceKernelConsolidationAuditRunnerCalled: true,
    governanceKernelConsolidationAuditCheckId: "8.8A",
    governanceKernelConsolidationAuditAllPassed: true,
    governanceKernelReadyForControlledRuntimeActivationPlan: true,
    governanceKernelArchitecturallyPreparedConfirmed: true,
    governanceKernelRuntimeAuthorizedConfirmedFalse: true,
    td001StatusConfirmed: TD001_CONFIRMED,
    td002StatusConfirmed: TD002_CONFIRMED,
    td003StatusConfirmed: TD003_CONFIRMED,
    td004StatusConfirmed: TD004_CONFIRMED,
    td005StatusConfirmed: TD005_CONFIRMED,
    activationTarget: ACTIVATION_TARGET,
    activationPlanCreatedForFreeQaOnly: true,
    activationPlanDoesNotAuthorizeActivation: true,
    activationPlanDoesNotAuthorizeRuntimeExecution: true,
    activationPlanDoesNotAuthorizePublicRuntime: true,
    activationPlanDoesNotAuthorizePilotRuntime: true,
    activationPlanDoesNotAuthorizeProductionRuntime: true,
    activationPlanDoesNotAuthorizeGoLive: true,
    freeQaQuestionModeInScope: true,
    anonymousQuestionInputInScope: true,
    nonDocumentQuestionInputInScope: true,
    generalQaAnswerOutputInScope: true,
    textDocumentModeOutOfScope: true,
    officialDocumentTextOutOfScope: true,
    pastedOfficialLetterOutOfScope: true,
    documentUploadOutOfScope: true,
    pdfUploadOutOfScope: true,
    imageUploadOutOfScope: true,
    photoInputOutOfScope: true,
    ocrInputOutOfScope: true,
    scannerUploadOutOfScope: true,
    scannedDocumentOutOfScope: true,
    paidDocumentModeOutOfScope: true,
    entitlementRuntimeOutOfScope: true,
    paymentRuntimeOutOfScope: true,
    vayloDnaDocumentStorageOutOfScope: true,
    realDocumentInputOutOfScope: true,
    userVisibleDocumentOutputOutOfScope: true,
    exactLegalDeadlineCalculationOutOfScope: true,
    evidenceGatesSeamExistsButDisabledByDefault: true,
    evidenceGatesSeamRemainsInert: true,
    evidenceGatesDryRunAdapterNotCalledWhileDisabled: true,
    evidenceGatesDryRunAdapterOutputNotUserVisible: true,
    evidenceGatesDryRunAdapterOutputNotPersisted: true,
    evidenceGatesSeamActivationUnauthorized: true,
    documentLikeTextGuardMustRemainActive: true,
    photoOcrRouteContainmentMustRemainActive: true,
    preModelPiiRedactionRemainsIsolatedUnlessSeparatelyWired: true,
    modelOutputRemainsUntrusted: true,
    claimAuthorizationSeparateFromRealityAuthorization: true,
    highRiskClaimsBlockedUnlessClaimAuthorized: true,
    documentDerivedClaimsBlockedUnlessRealityAuthorized: true,
    trapActivationStructuredMetadataOnly: true,
    unsafeUnknownStatesFailClosed: true,
    evidenceGatesUserVisibleOutputBlockedByDefault: true,
    exactLegalDeadlineCalculationUnauthorized: true,
    auditMetadataNonPersistentByDefault: true,
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
    documentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    scannerUploadAuthorizedNow: false,
    vayloDnaRuntimeAuthorizedNow: false,
    controlledRuntimeActivationContractRequired: true,
    controlledRuntimeActivationSyntheticDryRunRequired: true,
    controlledRuntimeActivationReadinessAuditRequired: true,
    controlledRuntimeActivationClosureDecisionRequired: true,
    controlledInternalTestAuthorizationRequired: true,
    claimRuleOrSemanticsDebtPreserved: true,
    evidenceRuleResolutionDebtPreserved: true,
    proximityManualOnlyDebtPreserved: true,
    trapKindTypingDebtPreserved: true,
    enforcementTrapHeuristicDebtPreserved: true,
    trapDispositionStateSeparationDebtPreserved: true,
    severityCandidateDerivationSeparationDebtPreserved: true,
    mapperDiagnosticTaxonomyDebtPreserved: true,
    td004ClosureDoesNotAuthorizeWiringDebtPreserved: true,
    governanceKernelConsolidationTamperConfirmedFrom8x8A: true,
    governanceKernelConsolidationTamperCaseCount: a.governanceKernelConsolidationTamperCaseCount,
    governanceKernelConsolidationTamperCasesRejected: a.governanceKernelConsolidationTamperCasesRejected,
    evidenceGatesClosureDecisionTamperConfirmedFrom8x8A: true,
    evidenceGatesClosureDecisionTamperCaseCount: a.evidenceGatesClosureDecisionTamperCaseCount,
    evidenceGatesClosureDecisionTamperCasesRejected: a.evidenceGatesClosureDecisionTamperCasesRejected,
    scopedWiringContainmentPatchTamperConfirmedFrom8x8A: true,
    scopedWiringContainmentPatchTamperCaseCount: a.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: a.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x8A: true,
    postWiringAuditTamperCaseCount: a.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: a.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x8A: true,
    dryRunSyntheticValidationCaseCount: a.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: a.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x8A: true,
    dryRunLeakageValidationCaseCount: a.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: a.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x8A: true,
    dryRunTamperCaseCount: a.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: a.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x8A: true,
    wiringExecutionContractTamperCaseCount: a.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: a.wiringExecutionContractTamperCasesRejected,
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
    readyFor8x8CControlledRuntimeActivationContract: true,
    readyForRuntimeActivation: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleDocumentOutput: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    freeQaActivationPlan,
    forbiddenInputClasses,
    safetyRequirements,
    futureRequiredPhases,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    planningNotes,
    freeQaControlledRuntimeActivationPlanTamperCaseCount: tamperCaseCount,
    freeQaControlledRuntimeActivationPlanTamperCasesRejected: tamperCaseCount,
    freeQaControlledRuntimeActivationPlanTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaActivationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8B tamper cases ─────────────────────────────────────────────
  let freeQaControlledRuntimeActivationPlanTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaActivationPlanResult(tc.mutate(provisional))) {
      freeQaControlledRuntimeActivationPlanTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8B tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed =
    planFailures.length === 0 &&
    freeQaControlledRuntimeActivationPlanTamperCasesRejected === tamperCaseCount;

  const finalPlanningNotes: string[] = [
    ...planningNotes,
    `8.8B tamper cases: ${freeQaControlledRuntimeActivationPlanTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaControlledRuntimeActivationPlanTamperCasesRejected,
    planningNotes: finalPlanningNotes,
  };
}
