/**
 * PHASE 8.8C — Controlled Runtime Activation Contract for Free Smart Talk Q&A
 *
 * Contract-only phase. This phase creates the controlled runtime activation
 * contract for Free Smart Talk Q&A only.
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
 * Contract scope:
 * - Free Smart Talk Q&A — anonymous non-document user question only
 * - General Q&A answer output only
 * - No document interpretation, photo/OCR, upload, scanner, payment,
 *   entitlement, Vaylo DNA, exact legal deadline, public/pilot/production runtime
 *
 * Future required phases before any activation:
 * - 8.8D: Synthetic Runtime Activation Dry-Run for Free Q&A
 * - 8.8E: Post-Activation Readiness Audit for Free Q&A
 * - 8.8F: Controlled Internal Test Authorization for Free Q&A
 *
 * This phase itself does NOT authorize activation.
 */

import { runFreeQaControlledRuntimeActivationPlan } from "./run-free-qa-controlled-runtime-activation-plan";

// ─── Activation target literal type ──────────────────────────────────────────

type ActivationTarget88C = "free_smart_talk_qa_only";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaActivationContractResult {
  checkId: "8.8C";
  allPassed: boolean;
  controlledRuntimeActivationContractOnly: true;
  freeQaControlledRuntimeActivationContractFileCreated: true;
  existingFilesModified: false;
  runSmartTalkFileModifiedInThisPhase: false;
  routeFilesModifiedInThisPhase: false;
  freeQaControlledRuntimeActivationPlanFileModified: false;
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
  importedOnlyFreeQaControlledRuntimeActivationPlanRunner: true;
  noOtherImportsUsed: true;
  freeQaControlledRuntimeActivationPlanRunnerCalled: true;
  freeQaControlledRuntimeActivationPlanCheckId: "8.8B";
  freeQaControlledRuntimeActivationPlanAllPassed: true;
  freeQaControlledRuntimeActivationPlanReadyForContract: true;
  freeQaActivationTargetConfirmed: ActivationTarget88C;
  freeQaPlanWasPlanningOnlyConfirmed: true;
  freeQaPlanDidNotAuthorizeActivationConfirmed: true;
  freeQaPlanRuntimeAuthorizationRemainedFalseConfirmed: true;
  activationTarget: ActivationTarget88C;
  contractCreatedForFreeQaOnly: true;
  contractDoesNotAuthorizeActivation: true;
  contractDoesNotAuthorizeRuntimeExecution: true;
  contractDoesNotAuthorizePublicRuntime: true;
  contractDoesNotAuthorizePilotRuntime: true;
  contractDoesNotAuthorizeProductionRuntime: true;
  contractDoesNotAuthorizeGoLive: true;
  controlledInternalTestOnly: true;
  runtimeDisabledNow: true;
  futureRuntimePatchRequired: true;
  futureSeamEnablementRequiresSeparateAuthorization: true;
  futurePostActivationAuditRequired: true;
  anonymousQuestionInputAllowed: true;
  nonDocumentQuestionInputAllowed: true;
  naturalLanguageQuestionInputAllowed: true;
  generalQaAnswerOutputAllowed: true;
  officialDocumentTextForbidden: true;
  pastedOfficialLetterForbidden: true;
  documentUploadForbidden: true;
  pdfUploadForbidden: true;
  imageUploadForbidden: true;
  photoInputForbidden: true;
  ocrInputForbidden: true;
  scannerUploadForbidden: true;
  scannedDocumentForbidden: true;
  paidDocumentModeInputForbidden: true;
  entitlementGatedDocumentModeForbidden: true;
  vayloDnaStoredDocumentForbidden: true;
  realDocumentInputForbidden: true;
  userVisibleDocumentOutputForbidden: true;
  exactLegalDeadlineCalculationForbidden: true;
  documentDerivedClaimsForbidden: true;
  legalAdviceClaimForbidden: true;
  trustedModelOutputForbidden: true;
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
  controlledRuntimeActivationSyntheticDryRunRequired: true;
  controlledRuntimeActivationReadinessAuditRequired: true;
  controlledRuntimeActivationClosureDecisionRequired: true;
  controlledInternalTestAuthorizationRequired: true;
  readyFor8x8DSyntheticRuntimeActivationDryRun: true;
  readyForRuntimeActivation: false;
  readyForRealDocumentInput: false;
  readyForUserVisibleDocumentOutput: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPublicRuntime: false;
  readyForPilot: false;
  readyForProduction: false;
  readyForGoLive: false;
  claimRuleOrSemanticsDebtPreserved: true;
  evidenceRuleResolutionDebtPreserved: true;
  proximityManualOnlyDebtPreserved: true;
  trapKindTypingDebtPreserved: true;
  enforcementTrapHeuristicDebtPreserved: true;
  trapDispositionStateSeparationDebtPreserved: true;
  severityCandidateDerivationSeparationDebtPreserved: true;
  mapperDiagnosticTaxonomyDebtPreserved: true;
  td004ClosureDoesNotAuthorizeWiringDebtPreserved: true;
  freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8B: true;
  freeQaControlledRuntimeActivationPlanTamperCaseCount: number;
  freeQaControlledRuntimeActivationPlanTamperCasesRejected: number;
  governanceKernelConsolidationTamperConfirmedFrom8x8B: true;
  governanceKernelConsolidationTamperCaseCount: number;
  governanceKernelConsolidationTamperCasesRejected: number;
  evidenceGatesClosureDecisionTamperConfirmedFrom8x8B: true;
  evidenceGatesClosureDecisionTamperCaseCount: number;
  evidenceGatesClosureDecisionTamperCasesRejected: number;
  scopedWiringContainmentPatchTamperConfirmedFrom8x8B: true;
  scopedWiringContainmentPatchTamperCaseCount: number;
  scopedWiringContainmentPatchTamperCasesRejected: number;
  postWiringAuditTamperConfirmedFrom8x8B: true;
  postWiringAuditTamperCaseCount: number;
  postWiringAuditTamperCasesRejected: number;
  dryRunSyntheticValidationConfirmedFrom8x8B: true;
  dryRunSyntheticValidationCaseCount: number;
  dryRunSyntheticValidationCasesPassed: number;
  dryRunLeakageValidationConfirmedFrom8x8B: true;
  dryRunLeakageValidationCaseCount: number;
  dryRunLeakageValidationCasesPassed: number;
  dryRunTamperCoverageConfirmedFrom8x8B: true;
  dryRunTamperCaseCount: number;
  dryRunTamperCasesRejected: number;
  wiringExecutionContractTamperConfirmedFrom8x8B: true;
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
  allowedInputContract: string[];
  forbiddenInputContract: string[];
  outputContract: string[];
  safetyGateContract: string[];
  futureActivationPreconditions: string[];
  globalAuthorizationBlockers: string[];
  preservedGovernanceDebts: string[];
  contractNotes: string[];
  freeQaControlledRuntimeActivationContractTamperCaseCount: number;
  freeQaControlledRuntimeActivationContractTamperCasesRejected: number;
  freeQaControlledRuntimeActivationContractTamperCoveragePassing: true;
}

// ─── Literal value constants ──────────────────────────────────────────────────

const ACTIVATION_TARGET: ActivationTarget88C = "free_smart_talk_qa_only";

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_ANON_NONDOC_Q = "anonymous non-document question";
const SENTINEL_OFFICIAL_DOC = "official document text";
const SENTINEL_OCR_PHOTO = "OCR/photo";
const SENTINEL_SCANNER_UPLOAD = "scanner upload";
const SENTINEL_GENERAL_QA = "general Q&A answer";
const SENTINEL_NO_DOC_CLAIMS = "no document-derived claims";
const SENTINEL_DOC_LIKE_GUARD = "document-like text guard";
const SENTINEL_MODEL_UNTRUSTED = "model output remains untrusted";
const SENTINEL_8X8D_DRY_RUN = "8.8D-synthetic-runtime-activation-dry-run-for-free-qa";
const SENTINEL_RUNTIME_ACTIVATION_BLOCKER = "runtime-activation-unauthorized-global-blocker";
const SENTINEL_DOCUMENT_MODE_BLOCKER = "document-mode-unauthorized-global-blocker";
const SENTINEL_PHOTO_OCR_BLOCKER = "photo-ocr-runtime-unauthorized-global-blocker";
const SENTINEL_SCANNER_BLOCKER = "scanner-upload-unauthorized-global-blocker";
const SENTINEL_CLAIM_RULE_OR = "ClaimRule OR semantics";
const SENTINEL_TRAP_HEURISTIC = "enforcementTrapHeuristic";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaActivationContractResult(r: FreeQaActivationContractResult): boolean {
  // Phase identity
  if (r.checkId !== "8.8C") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledRuntimeActivationContractOnly !== true) return false;
  if (r.freeQaControlledRuntimeActivationContractFileCreated !== true) return false;
  // File/route modification flags (false-boundary)
  if (r.existingFilesModified !== false) return false;
  if (r.runSmartTalkFileModifiedInThisPhase !== false) return false;
  if (r.routeFilesModifiedInThisPhase !== false) return false;
  if (r.freeQaControlledRuntimeActivationPlanFileModified !== false) return false;
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
  // Import/runner flags and 8.8B confirmations
  if (r.importedOnlyFreeQaControlledRuntimeActivationPlanRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanRunnerCalled !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanCheckId !== "8.8B") return false;
  if (r.freeQaControlledRuntimeActivationPlanAllPassed !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanReadyForContract !== true) return false;
  if (r.freeQaActivationTargetConfirmed !== ACTIVATION_TARGET) return false;
  if (r.freeQaPlanWasPlanningOnlyConfirmed !== true) return false;
  if (r.freeQaPlanDidNotAuthorizeActivationConfirmed !== true) return false;
  if (r.freeQaPlanRuntimeAuthorizationRemainedFalseConfirmed !== true) return false;
  // Contract flags
  if (r.activationTarget !== ACTIVATION_TARGET) return false;
  if (r.contractCreatedForFreeQaOnly !== true) return false;
  if (r.contractDoesNotAuthorizeActivation !== true) return false;
  if (r.contractDoesNotAuthorizeRuntimeExecution !== true) return false;
  if (r.contractDoesNotAuthorizePublicRuntime !== true) return false;
  if (r.contractDoesNotAuthorizePilotRuntime !== true) return false;
  if (r.contractDoesNotAuthorizeProductionRuntime !== true) return false;
  if (r.contractDoesNotAuthorizeGoLive !== true) return false;
  if (r.controlledInternalTestOnly !== true) return false;
  if (r.runtimeDisabledNow !== true) return false;
  if (r.futureRuntimePatchRequired !== true) return false;
  if (r.futureSeamEnablementRequiresSeparateAuthorization !== true) return false;
  if (r.futurePostActivationAuditRequired !== true) return false;
  // Allowed input contract flags
  if (r.anonymousQuestionInputAllowed !== true) return false;
  if (r.nonDocumentQuestionInputAllowed !== true) return false;
  if (r.naturalLanguageQuestionInputAllowed !== true) return false;
  if (r.generalQaAnswerOutputAllowed !== true) return false;
  // Forbidden input contract flags
  if (r.officialDocumentTextForbidden !== true) return false;
  if (r.pastedOfficialLetterForbidden !== true) return false;
  if (r.documentUploadForbidden !== true) return false;
  if (r.pdfUploadForbidden !== true) return false;
  if (r.imageUploadForbidden !== true) return false;
  if (r.photoInputForbidden !== true) return false;
  if (r.ocrInputForbidden !== true) return false;
  if (r.scannerUploadForbidden !== true) return false;
  if (r.scannedDocumentForbidden !== true) return false;
  if (r.paidDocumentModeInputForbidden !== true) return false;
  if (r.entitlementGatedDocumentModeForbidden !== true) return false;
  if (r.vayloDnaStoredDocumentForbidden !== true) return false;
  if (r.realDocumentInputForbidden !== true) return false;
  if (r.userVisibleDocumentOutputForbidden !== true) return false;
  if (r.exactLegalDeadlineCalculationForbidden !== true) return false;
  if (r.documentDerivedClaimsForbidden !== true) return false;
  if (r.legalAdviceClaimForbidden !== true) return false;
  if (r.trustedModelOutputForbidden !== true) return false;
  // Evidence Gates seam/adapter flags
  if (r.evidenceGatesSeamExistsButDisabledByDefault !== true) return false;
  if (r.evidenceGatesSeamRemainsInert !== true) return false;
  if (r.evidenceGatesDryRunAdapterNotCalledWhileDisabled !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotUserVisible !== true) return false;
  if (r.evidenceGatesDryRunAdapterOutputNotPersisted !== true) return false;
  if (r.evidenceGatesSeamActivationUnauthorized !== true) return false;
  // Safety/model/gate flags
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
  if (r.controlledRuntimeActivationSyntheticDryRunRequired !== true) return false;
  if (r.controlledRuntimeActivationReadinessAuditRequired !== true) return false;
  if (r.controlledRuntimeActivationClosureDecisionRequired !== true) return false;
  if (r.controlledInternalTestAuthorizationRequired !== true) return false;
  // Readiness flags
  if (r.readyFor8x8DSyntheticRuntimeActivationDryRun !== true) return false;
  if (r.readyForRuntimeActivation !== false) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleDocumentOutput !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForPilot !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
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
  // Inherited 8.8B count confirmations
  if (r.freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8B !== true) return false;
  if (r.freeQaControlledRuntimeActivationPlanTamperCasesRejected !== r.freeQaControlledRuntimeActivationPlanTamperCaseCount) return false;
  if (r.governanceKernelConsolidationTamperConfirmedFrom8x8B !== true) return false;
  if (r.governanceKernelConsolidationTamperCasesRejected !== r.governanceKernelConsolidationTamperCaseCount) return false;
  if (r.evidenceGatesClosureDecisionTamperConfirmedFrom8x8B !== true) return false;
  if (r.evidenceGatesClosureDecisionTamperCasesRejected !== r.evidenceGatesClosureDecisionTamperCaseCount) return false;
  if (r.scopedWiringContainmentPatchTamperConfirmedFrom8x8B !== true) return false;
  if (r.scopedWiringContainmentPatchTamperCasesRejected !== r.scopedWiringContainmentPatchTamperCaseCount) return false;
  if (r.postWiringAuditTamperConfirmedFrom8x8B !== true) return false;
  if (r.postWiringAuditTamperCasesRejected !== r.postWiringAuditTamperCaseCount) return false;
  if (r.dryRunSyntheticValidationConfirmedFrom8x8B !== true) return false;
  if (r.dryRunSyntheticValidationCasesPassed !== r.dryRunSyntheticValidationCaseCount) return false;
  if (r.dryRunLeakageValidationConfirmedFrom8x8B !== true) return false;
  if (r.dryRunLeakageValidationCasesPassed !== r.dryRunLeakageValidationCaseCount) return false;
  if (r.dryRunTamperCoverageConfirmedFrom8x8B !== true) return false;
  if (r.dryRunTamperCasesRejected !== r.dryRunTamperCaseCount) return false;
  if (r.wiringExecutionContractTamperConfirmedFrom8x8B !== true) return false;
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
  // Arrays non-empty
  if (!r.allowedInputContract || r.allowedInputContract.length === 0) return false;
  if (!r.forbiddenInputContract || r.forbiddenInputContract.length === 0) return false;
  if (!r.outputContract || r.outputContract.length === 0) return false;
  if (!r.safetyGateContract || r.safetyGateContract.length === 0) return false;
  if (!r.futureActivationPreconditions || r.futureActivationPreconditions.length === 0) return false;
  if (!r.globalAuthorizationBlockers || r.globalAuthorizationBlockers.length === 0) return false;
  if (!r.preservedGovernanceDebts || r.preservedGovernanceDebts.length === 0) return false;
  if (!r.contractNotes || r.contractNotes.length === 0) return false;
  // Sentinel checks
  const allowedJ = r.allowedInputContract.join(" ");
  if (!allowedJ.includes(SENTINEL_ANON_NONDOC_Q)) return false;
  const forbidJ = r.forbiddenInputContract.join(" ");
  if (!forbidJ.includes(SENTINEL_OFFICIAL_DOC)) return false;
  if (!forbidJ.includes(SENTINEL_OCR_PHOTO)) return false;
  if (!forbidJ.includes(SENTINEL_SCANNER_UPLOAD)) return false;
  const outputJ = r.outputContract.join(" ");
  if (!outputJ.includes(SENTINEL_GENERAL_QA)) return false;
  if (!outputJ.includes(SENTINEL_NO_DOC_CLAIMS)) return false;
  const safetyJ = r.safetyGateContract.join(" ");
  if (!safetyJ.includes(SENTINEL_DOC_LIKE_GUARD)) return false;
  if (!safetyJ.includes(SENTINEL_MODEL_UNTRUSTED)) return false;
  const futureJ = r.futureActivationPreconditions.join(" ");
  if (!futureJ.includes(SENTINEL_8X8D_DRY_RUN)) return false;
  const blockersJ = r.globalAuthorizationBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_RUNTIME_ACTIVATION_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENT_MODE_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_PHOTO_OCR_BLOCKER)) return false;
  if (!blockersJ.includes(SENTINEL_SCANNER_BLOCKER)) return false;
  const debtsJ = r.preservedGovernanceDebts.join(" ");
  if (!debtsJ.includes(SENTINEL_CLAIM_RULE_OR)) return false;
  if (!debtsJ.includes(SENTINEL_TRAP_HEURISTIC)) return false;
  // Tamper coverage
  if (r.freeQaControlledRuntimeActivationContractTamperCasesRejected !== r.freeQaControlledRuntimeActivationContractTamperCaseCount) return false;
  if (r.freeQaControlledRuntimeActivationContractTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type FreeQaContractTamperMutation = (r: FreeQaActivationContractResult) => FreeQaActivationContractResult;
interface FreeQaContractTamperCase { label: string; mutate: FreeQaContractTamperMutation; }

const FREE_QA_CONTRACT_TAMPER_CASES: FreeQaContractTamperCase[] = [
  // Phase identity
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8B" as "8.8C" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "controlledRuntimeActivationContractOnly false", mutate: (r) => ({ ...r, controlledRuntimeActivationContractOnly: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractFileCreated false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractFileCreated: false as true }) },
  // File/route modification flags
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "runSmartTalkFileModifiedInThisPhase true", mutate: (r) => ({ ...r, runSmartTalkFileModifiedInThisPhase: true as false }) },
  { label: "routeFilesModifiedInThisPhase true", mutate: (r) => ({ ...r, routeFilesModifiedInThisPhase: true as false }) },
  { label: "freeQaControlledRuntimeActivationPlanFileModified true", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanFileModified: true as false }) },
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
  // Import/runner flags and 8.8B confirmations
  { label: "importedOnlyFreeQaControlledRuntimeActivationPlanRunner false", mutate: (r) => ({ ...r, importedOnlyFreeQaControlledRuntimeActivationPlanRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanRunnerCalled false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanRunnerCalled: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanCheckId wrong", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanCheckId: "8.8A" as "8.8B" }) },
  { label: "freeQaControlledRuntimeActivationPlanAllPassed false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanAllPassed: false as true }) },
  { label: "freeQaControlledRuntimeActivationPlanReadyForContract false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanReadyForContract: false as true }) },
  { label: "freeQaActivationTargetConfirmed wrong", mutate: (r) => ({ ...r, freeQaActivationTargetConfirmed: "text_document_mode" as ActivationTarget88C }) },
  { label: "freeQaPlanWasPlanningOnlyConfirmed false", mutate: (r) => ({ ...r, freeQaPlanWasPlanningOnlyConfirmed: false as true }) },
  { label: "freeQaPlanDidNotAuthorizeActivationConfirmed false", mutate: (r) => ({ ...r, freeQaPlanDidNotAuthorizeActivationConfirmed: false as true }) },
  { label: "freeQaPlanRuntimeAuthorizationRemainedFalseConfirmed false", mutate: (r) => ({ ...r, freeQaPlanRuntimeAuthorizationRemainedFalseConfirmed: false as true }) },
  // Contract flags
  { label: "activationTarget wrong", mutate: (r) => ({ ...r, activationTarget: "text_document_mode" as ActivationTarget88C }) },
  { label: "contractCreatedForFreeQaOnly false", mutate: (r) => ({ ...r, contractCreatedForFreeQaOnly: false as true }) },
  { label: "contractDoesNotAuthorizeActivation false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeActivation: false as true }) },
  { label: "contractDoesNotAuthorizeRuntimeExecution false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeRuntimeExecution: false as true }) },
  { label: "contractDoesNotAuthorizePublicRuntime false", mutate: (r) => ({ ...r, contractDoesNotAuthorizePublicRuntime: false as true }) },
  { label: "contractDoesNotAuthorizePilotRuntime false", mutate: (r) => ({ ...r, contractDoesNotAuthorizePilotRuntime: false as true }) },
  { label: "contractDoesNotAuthorizeProductionRuntime false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeProductionRuntime: false as true }) },
  { label: "contractDoesNotAuthorizeGoLive false", mutate: (r) => ({ ...r, contractDoesNotAuthorizeGoLive: false as true }) },
  { label: "controlledInternalTestOnly false", mutate: (r) => ({ ...r, controlledInternalTestOnly: false as true }) },
  { label: "runtimeDisabledNow false", mutate: (r) => ({ ...r, runtimeDisabledNow: false as true }) },
  { label: "futureRuntimePatchRequired false", mutate: (r) => ({ ...r, futureRuntimePatchRequired: false as true }) },
  { label: "futureSeamEnablementRequiresSeparateAuthorization false", mutate: (r) => ({ ...r, futureSeamEnablementRequiresSeparateAuthorization: false as true }) },
  { label: "futurePostActivationAuditRequired false", mutate: (r) => ({ ...r, futurePostActivationAuditRequired: false as true }) },
  // Allowed input contract flags
  { label: "anonymousQuestionInputAllowed false", mutate: (r) => ({ ...r, anonymousQuestionInputAllowed: false as true }) },
  { label: "nonDocumentQuestionInputAllowed false", mutate: (r) => ({ ...r, nonDocumentQuestionInputAllowed: false as true }) },
  { label: "naturalLanguageQuestionInputAllowed false", mutate: (r) => ({ ...r, naturalLanguageQuestionInputAllowed: false as true }) },
  { label: "generalQaAnswerOutputAllowed false", mutate: (r) => ({ ...r, generalQaAnswerOutputAllowed: false as true }) },
  // Forbidden input contract flags
  { label: "officialDocumentTextForbidden false", mutate: (r) => ({ ...r, officialDocumentTextForbidden: false as true }) },
  { label: "pastedOfficialLetterForbidden false", mutate: (r) => ({ ...r, pastedOfficialLetterForbidden: false as true }) },
  { label: "documentUploadForbidden false", mutate: (r) => ({ ...r, documentUploadForbidden: false as true }) },
  { label: "pdfUploadForbidden false", mutate: (r) => ({ ...r, pdfUploadForbidden: false as true }) },
  { label: "imageUploadForbidden false", mutate: (r) => ({ ...r, imageUploadForbidden: false as true }) },
  { label: "photoInputForbidden false", mutate: (r) => ({ ...r, photoInputForbidden: false as true }) },
  { label: "ocrInputForbidden false", mutate: (r) => ({ ...r, ocrInputForbidden: false as true }) },
  { label: "scannerUploadForbidden false", mutate: (r) => ({ ...r, scannerUploadForbidden: false as true }) },
  { label: "scannedDocumentForbidden false", mutate: (r) => ({ ...r, scannedDocumentForbidden: false as true }) },
  { label: "paidDocumentModeInputForbidden false", mutate: (r) => ({ ...r, paidDocumentModeInputForbidden: false as true }) },
  { label: "entitlementGatedDocumentModeForbidden false", mutate: (r) => ({ ...r, entitlementGatedDocumentModeForbidden: false as true }) },
  { label: "vayloDnaStoredDocumentForbidden false", mutate: (r) => ({ ...r, vayloDnaStoredDocumentForbidden: false as true }) },
  { label: "realDocumentInputForbidden false", mutate: (r) => ({ ...r, realDocumentInputForbidden: false as true }) },
  { label: "userVisibleDocumentOutputForbidden false", mutate: (r) => ({ ...r, userVisibleDocumentOutputForbidden: false as true }) },
  { label: "exactLegalDeadlineCalculationForbidden false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationForbidden: false as true }) },
  { label: "documentDerivedClaimsForbidden false", mutate: (r) => ({ ...r, documentDerivedClaimsForbidden: false as true }) },
  { label: "legalAdviceClaimForbidden false", mutate: (r) => ({ ...r, legalAdviceClaimForbidden: false as true }) },
  { label: "trustedModelOutputForbidden false", mutate: (r) => ({ ...r, trustedModelOutputForbidden: false as true }) },
  // Evidence Gates seam/adapter flags
  { label: "evidenceGatesSeamExistsButDisabledByDefault false", mutate: (r) => ({ ...r, evidenceGatesSeamExistsButDisabledByDefault: false as true }) },
  { label: "evidenceGatesSeamRemainsInert false", mutate: (r) => ({ ...r, evidenceGatesSeamRemainsInert: false as true }) },
  { label: "evidenceGatesDryRunAdapterNotCalledWhileDisabled false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterNotCalledWhileDisabled: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotUserVisible false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotUserVisible: false as true }) },
  { label: "evidenceGatesDryRunAdapterOutputNotPersisted false", mutate: (r) => ({ ...r, evidenceGatesDryRunAdapterOutputNotPersisted: false as true }) },
  { label: "evidenceGatesSeamActivationUnauthorized false", mutate: (r) => ({ ...r, evidenceGatesSeamActivationUnauthorized: false as true }) },
  // Safety/model/gate flags
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
  { label: "controlledRuntimeActivationSyntheticDryRunRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationSyntheticDryRunRequired: false as true }) },
  { label: "controlledRuntimeActivationReadinessAuditRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationReadinessAuditRequired: false as true }) },
  { label: "controlledRuntimeActivationClosureDecisionRequired false", mutate: (r) => ({ ...r, controlledRuntimeActivationClosureDecisionRequired: false as true }) },
  { label: "controlledInternalTestAuthorizationRequired false", mutate: (r) => ({ ...r, controlledInternalTestAuthorizationRequired: false as true }) },
  // Readiness flags
  { label: "readyFor8x8DSyntheticRuntimeActivationDryRun false", mutate: (r) => ({ ...r, readyFor8x8DSyntheticRuntimeActivationDryRun: false as true }) },
  { label: "readyForRuntimeActivation true", mutate: (r) => ({ ...r, readyForRuntimeActivation: true as false }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleDocumentOutput true", mutate: (r) => ({ ...r, readyForUserVisibleDocumentOutput: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForPilot true", mutate: (r) => ({ ...r, readyForPilot: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
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
  // Inherited 8.8B count confirmation booleans
  { label: "freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8B false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8B: false as true }) },
  { label: "governanceKernelConsolidationTamperConfirmedFrom8x8B false", mutate: (r) => ({ ...r, governanceKernelConsolidationTamperConfirmedFrom8x8B: false as true }) },
  { label: "evidenceGatesClosureDecisionTamperConfirmedFrom8x8B false", mutate: (r) => ({ ...r, evidenceGatesClosureDecisionTamperConfirmedFrom8x8B: false as true }) },
  { label: "scopedWiringContainmentPatchTamperConfirmedFrom8x8B false", mutate: (r) => ({ ...r, scopedWiringContainmentPatchTamperConfirmedFrom8x8B: false as true }) },
  { label: "postWiringAuditTamperConfirmedFrom8x8B false", mutate: (r) => ({ ...r, postWiringAuditTamperConfirmedFrom8x8B: false as true }) },
  { label: "dryRunSyntheticValidationConfirmedFrom8x8B false", mutate: (r) => ({ ...r, dryRunSyntheticValidationConfirmedFrom8x8B: false as true }) },
  { label: "dryRunLeakageValidationConfirmedFrom8x8B false", mutate: (r) => ({ ...r, dryRunLeakageValidationConfirmedFrom8x8B: false as true }) },
  { label: "dryRunTamperCoverageConfirmedFrom8x8B false", mutate: (r) => ({ ...r, dryRunTamperCoverageConfirmedFrom8x8B: false as true }) },
  { label: "wiringExecutionContractTamperConfirmedFrom8x8B false", mutate: (r) => ({ ...r, wiringExecutionContractTamperConfirmedFrom8x8B: false as true }) },
  // Inherited count mismatches
  { label: "freeQaControlledRuntimeActivationPlanTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationPlanTamperCasesRejected: r.freeQaControlledRuntimeActivationPlanTamperCasesRejected - 1 }) },
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
  // Array empty
  { label: "allowedInputContract empty", mutate: (r) => ({ ...r, allowedInputContract: [] }) },
  { label: "forbiddenInputContract empty", mutate: (r) => ({ ...r, forbiddenInputContract: [] }) },
  { label: "outputContract empty", mutate: (r) => ({ ...r, outputContract: [] }) },
  { label: "safetyGateContract empty", mutate: (r) => ({ ...r, safetyGateContract: [] }) },
  { label: "futureActivationPreconditions empty", mutate: (r) => ({ ...r, futureActivationPreconditions: [] }) },
  { label: "globalAuthorizationBlockers empty", mutate: (r) => ({ ...r, globalAuthorizationBlockers: [] }) },
  { label: "preservedGovernanceDebts empty", mutate: (r) => ({ ...r, preservedGovernanceDebts: [] }) },
  { label: "contractNotes empty", mutate: (r) => ({ ...r, contractNotes: [] }) },
  // Array sentinel checks
  { label: "allowedInputContract missing anonymous non-document question sentinel", mutate: (r) => ({ ...r, allowedInputContract: r.allowedInputContract.map((s) => s.split(SENTINEL_ANON_NONDOC_Q).join("omitted")) }) },
  { label: "forbiddenInputContract missing official document sentinel", mutate: (r) => ({ ...r, forbiddenInputContract: r.forbiddenInputContract.map((s) => s.split(SENTINEL_OFFICIAL_DOC).join("omitted")) }) },
  { label: "forbiddenInputContract missing OCR/photo sentinel", mutate: (r) => ({ ...r, forbiddenInputContract: r.forbiddenInputContract.map((s) => s.split(SENTINEL_OCR_PHOTO).join("omitted")) }) },
  { label: "forbiddenInputContract missing scanner upload sentinel", mutate: (r) => ({ ...r, forbiddenInputContract: r.forbiddenInputContract.map((s) => s.split(SENTINEL_SCANNER_UPLOAD).join("omitted")) }) },
  { label: "outputContract missing general Q&A sentinel", mutate: (r) => ({ ...r, outputContract: r.outputContract.map((s) => s.split(SENTINEL_GENERAL_QA).join("omitted")) }) },
  { label: "outputContract missing no document-derived claims sentinel", mutate: (r) => ({ ...r, outputContract: r.outputContract.map((s) => s.split(SENTINEL_NO_DOC_CLAIMS).join("omitted")) }) },
  { label: "safetyGateContract missing document-like guard sentinel", mutate: (r) => ({ ...r, safetyGateContract: r.safetyGateContract.map((s) => s.split(SENTINEL_DOC_LIKE_GUARD).join("omitted")) }) },
  { label: "safetyGateContract missing model output untrusted sentinel", mutate: (r) => ({ ...r, safetyGateContract: r.safetyGateContract.map((s) => s.split(SENTINEL_MODEL_UNTRUSTED).join("omitted")) }) },
  { label: "futureActivationPreconditions missing 8.8D dry-run sentinel", mutate: (r) => ({ ...r, futureActivationPreconditions: r.futureActivationPreconditions.map((s) => s.split(SENTINEL_8X8D_DRY_RUN).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing runtime activation blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_RUNTIME_ACTIVATION_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing document mode blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_DOCUMENT_MODE_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing photo/OCR blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKER).join("omitted")) }) },
  { label: "globalAuthorizationBlockers missing scanner blocker", mutate: (r) => ({ ...r, globalAuthorizationBlockers: r.globalAuthorizationBlockers.map((s) => s.split(SENTINEL_SCANNER_BLOCKER).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing ClaimRule OR semantics debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_CLAIM_RULE_OR).join("omitted")) }) },
  { label: "preservedGovernanceDebts missing enforcementTrapHeuristic debt", mutate: (r) => ({ ...r, preservedGovernanceDebts: r.preservedGovernanceDebts.map((s) => s.split(SENTINEL_TRAP_HEURISTIC).join("omitted")) }) },
  // Tamper coverage self-checks
  { label: "freeQaControlledRuntimeActivationContractTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractTamperCoveragePassing: false as true }) },
  { label: "freeQaControlledRuntimeActivationContractTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledRuntimeActivationContractTamperCasesRejected: r.freeQaControlledRuntimeActivationContractTamperCasesRejected - 1 }) },
];

// ─── Exported contract runner ─────────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Controlled Runtime Activation Contract runner for 8.8C.
 *
 * Calls the 8.8B Controlled Runtime Activation Plan runner as source of truth.
 * Defines the strict contract for Free Smart Talk Q&A controlled runtime activation.
 * This phase itself does NOT authorize activation.
 */
export function runFreeQaControlledRuntimeActivationContract(): FreeQaActivationContractResult {
  const contractFailures: string[] = [];

  // ── Call 8.8B Plan runner as source of truth ──────────────────────────
  const b = runFreeQaControlledRuntimeActivationPlan();

  if (b.checkId !== "8.8B") contractFailures.push(`8.8B checkId mismatch: expected "8.8B", got "${b.checkId}"`);
  if (b.allPassed !== true) contractFailures.push("8.8B allPassed is not true");
  if (b.readyFor8x8CControlledRuntimeActivationContract !== true) contractFailures.push("8.8B readyFor8x8CControlledRuntimeActivationContract is not true");
  if (b.activationTarget !== ACTIVATION_TARGET) contractFailures.push(`8.8B activationTarget mismatch: expected "${ACTIVATION_TARGET}", got "${b.activationTarget}"`);
  if (b.controlledRuntimeActivationPlanOnly !== true) contractFailures.push("8.8B controlledRuntimeActivationPlanOnly is not true");
  if (b.activationPlanDoesNotAuthorizeActivation !== true) contractFailures.push("8.8B activationPlanDoesNotAuthorizeActivation is not true");
  if (b.controlledRuntimeActivationAuthorizedNow !== false) contractFailures.push("8.8B controlledRuntimeActivationAuthorizedNow is not false");
  if (b.runtimeActivationPerformed !== false) contractFailures.push("8.8B runtimeActivationPerformed is not false");
  if (b.seamActivationPerformed !== false) contractFailures.push("8.8B seamActivationPerformed is not false");
  if (b.documentRuntimeActivationPerformed !== false) contractFailures.push("8.8B documentRuntimeActivationPerformed is not false");
  if (b.photoOcrRuntimeActivationPerformed !== false) contractFailures.push("8.8B photoOcrRuntimeActivationPerformed is not false");
  if (b.scannerRuntimeActivationPerformed !== false) contractFailures.push("8.8B scannerRuntimeActivationPerformed is not false");
  if (b.paidDocumentModeRuntimeActivationPerformed !== false) contractFailures.push("8.8B paidDocumentModeRuntimeActivationPerformed is not false");
  if (b.vayloDnaRuntimeActivationPerformed !== false) contractFailures.push("8.8B vayloDnaRuntimeActivationPerformed is not false");
  if (b.evidenceGatesSeamExistsButDisabledByDefault !== true) contractFailures.push("8.8B evidenceGatesSeamExistsButDisabledByDefault is not true");
  if (b.evidenceGatesSeamRemainsInert !== true) contractFailures.push("8.8B evidenceGatesSeamRemainsInert is not true");
  if (b.evidenceGatesDryRunAdapterNotCalledWhileDisabled !== true) contractFailures.push("8.8B evidenceGatesDryRunAdapterNotCalledWhileDisabled is not true");
  if (b.evidenceGatesDryRunAdapterOutputNotUserVisible !== true) contractFailures.push("8.8B evidenceGatesDryRunAdapterOutputNotUserVisible is not true");
  if (b.evidenceGatesDryRunAdapterOutputNotPersisted !== true) contractFailures.push("8.8B evidenceGatesDryRunAdapterOutputNotPersisted is not true");
  if (b.freeQaControlledRuntimeActivationPlanTamperCasesRejected !== b.freeQaControlledRuntimeActivationPlanTamperCaseCount) contractFailures.push("8.8B freeQa tamper count mismatch");

  // ── Arrays ────────────────────────────────────────────────────────────

  const allowedInputContract: string[] = [
    `AI-01 [${SENTINEL_ANON_NONDOC_Q}]: anonymous non-document question — natural-language question from an anonymous user with no official document content.`,
    "AI-02: natural-language question — general free-form question without document-like structure.",
    "AI-03: non-document-gated question — question that does not require document upload or official letter input.",
    "AI-04: anonymous session context — no identity-linked document or Vaylo DNA storage required.",
  ];

  const forbiddenInputContract: string[] = [
    `FI-01 [${SENTINEL_OFFICIAL_DOC}]: official document text — pasted or submitted official document text is forbidden.`,
    `FI-02 [${SENTINEL_OCR_PHOTO}]: OCR/photo input — OCR-derived or photo-captured text is forbidden.`,
    `FI-03 [${SENTINEL_SCANNER_UPLOAD}]: scanner upload — scanner-derived document uploads are forbidden.`,
    "FI-04: pasted official letter — text that resembles an official letter or legal notice is forbidden.",
    "FI-05: scanned document — scanned document image or derived text is forbidden.",
    "FI-06: PDF/image upload — any file-based document upload is forbidden.",
    "FI-07: Vaylo DNA stored document — identity-linked document storage input is forbidden.",
    "FI-08: paid document mode input — any document input requiring payment or entitlement is forbidden.",
    "FI-09: entitlement-gated document mode — document mode input requiring entitlement check is forbidden.",
    "FI-10: real document input — any real official document in any format is forbidden.",
    "FI-11: exact legal deadline from document context — requesting exact deadlines based on document content is forbidden.",
  ];

  const outputContract: string[] = [
    `OC-01 [${SENTINEL_GENERAL_QA}]: general Q&A answer — output is restricted to general Q&A answer only.`,
    `OC-02 [${SENTINEL_NO_DOC_CLAIMS}]: no document-derived claims — output must not include claims derived from document interpretation.`,
    "OC-03: no exact legal deadline calculation — output must not calculate or assert exact legal deadlines.",
    "OC-04: no legal advice claim — output must not claim to provide legal advice.",
    "OC-05: preserve uncertainty — output must preserve uncertainty and not overstate confidence.",
    "OC-06: safe next-step style — output should include safe next-step guidance when relevant.",
    "OC-07: no document verification — output must not pretend to read or verify documents.",
    "OC-08: redirect document-like input — document-like input must be redirected to future document mode boundary.",
  ];

  const safetyGateContract: string[] = [
    `SG-01 [${SENTINEL_DOC_LIKE_GUARD}]: document-like text guard remains active — document bypass guard (TD-001) must remain enforced at all times.`,
    `SG-02 [${SENTINEL_MODEL_UNTRUSTED}]: model output remains untrusted — no model output is treated as authoritative without explicit authorization.`,
    "SG-03: photo/OCR route containment remains active — TD-003 photo/OCR route containment must remain enforced.",
    "SG-04: pre-model PII redaction remains isolated unless separately wired — TD-004 utility closure does not authorize route wiring.",
    "SG-05: claim/reality authorization separation remains preserved — claim and reality authorization must remain separate.",
    "SG-06: unsafe/unknown states fail closed — any unrecognized or unsafe state must block execution.",
    "SG-07: Evidence Gates seam remains disabled until future authorization.",
    "SG-08: audit metadata remains non-persistent by default.",
  ];

  const futureActivationPreconditions: string[] = [
    `FP-01 [${SENTINEL_8X8D_DRY_RUN}]: 8.8D-synthetic-runtime-activation-dry-run-for-free-qa — Phase 8.8D must validate the activation path synthetically before any real input.`,
    "FP-02: 8.8E-post-activation-readiness-audit-for-free-qa — Phase 8.8E must audit readiness after dry-run validation.",
    "FP-03: 8.8F-controlled-internal-test-authorization-for-free-qa — Phase 8.8F must explicitly authorize controlled internal testing.",
    "FP-04: A future scoped runtime patch must be separately authorized before any live execution.",
    "FP-05: Any seam enablement must have a post-activation audit.",
    "FP-06: Any live test must remain internal and controlled.",
    "FP-07: Public runtime, pilot, production, and go-live remain unauthorized until all preconditions are met.",
  ];

  const globalAuthorizationBlockers: string[] = [
    `GB-01 [${SENTINEL_RUNTIME_ACTIVATION_BLOCKER}]: runtime-activation-unauthorized-global-blocker — controlled runtime activation is not yet authorized; 8.8D minimum required.`,
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
    `GD-01 [${SENTINEL_CLAIM_RULE_OR}]: ClaimRule OR semantics must not degrade into keyword-hit equals claim. (Preserved from 8.7F–8.8C.)`,
    "GD-02: EvidenceRule/ClaimRule resolution must preserve structured evidence semantics. (Preserved from 8.7F–8.8C.)",
    "GD-03: Proximity remains manual-only unless structured anchors are implemented. (Preserved from 8.7F–8.8C.)",
    "GD-04: TrapActivation.trapKind must eventually be tightened from string to a safe discriminated union. (Preserved from 8.7F–8.8C.)",
    `GD-05 [${SENTINEL_TRAP_HEURISTIC}]: enforcementTrapHeuristic coarse substring debt must not become production enforcement. (Preserved from 8.7F–8.8C.)`,
    "GD-06: SeverityCandidate and SeverityDerivation must remain separated. (Preserved from 8.7F–8.8C.)",
    "GD-07: TrapDisposition production states and dry-run candidate states must remain separated. (Preserved from 8.7F–8.8C.)",
    "GD-08: Mapper diagnostic taxonomy debt remains separate and must not be hidden by wiring. (Preserved from 8.7F–8.8C.)",
    "GD-09: TD-004 isolated utility closure must not be treated as route wiring authorization. (Preserved from 8.7F–8.8C.)",
  ];

  const contractNotes: string[] = [
    "8.8C contract: Controlled runtime activation contract for Free Smart Talk Q&A created.",
    "8.8C contract: This contract is contract-only. It does NOT authorize activation.",
    "8.8C contract: activationTarget=free_smart_talk_qa_only, controlledInternalTestOnly=true, runtimeDisabledNow=true.",
    "8.8C contract: All document/photo/OCR/scanner/paid/DNA modes forbidden by contract.",
    "8.8C contract: Evidence Gates seam remains disabled by default and inert.",
    `8.8C contract: 8.8B confirmed — checkId=${b.checkId}, allPassed=${b.allPassed}, activationTarget=${b.activationTarget}, planOnly=${b.controlledRuntimeActivationPlanOnly}`,
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_CONTRACT_TAMPER_CASES.length;

  const provisional: FreeQaActivationContractResult = {
    checkId: "8.8C",
    allPassed: true,
    controlledRuntimeActivationContractOnly: true,
    freeQaControlledRuntimeActivationContractFileCreated: true,
    existingFilesModified: false,
    runSmartTalkFileModifiedInThisPhase: false,
    routeFilesModifiedInThisPhase: false,
    freeQaControlledRuntimeActivationPlanFileModified: false,
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
    importedOnlyFreeQaControlledRuntimeActivationPlanRunner: true,
    noOtherImportsUsed: true,
    freeQaControlledRuntimeActivationPlanRunnerCalled: true,
    freeQaControlledRuntimeActivationPlanCheckId: "8.8B",
    freeQaControlledRuntimeActivationPlanAllPassed: true,
    freeQaControlledRuntimeActivationPlanReadyForContract: true,
    freeQaActivationTargetConfirmed: ACTIVATION_TARGET,
    freeQaPlanWasPlanningOnlyConfirmed: true,
    freeQaPlanDidNotAuthorizeActivationConfirmed: true,
    freeQaPlanRuntimeAuthorizationRemainedFalseConfirmed: true,
    activationTarget: ACTIVATION_TARGET,
    contractCreatedForFreeQaOnly: true,
    contractDoesNotAuthorizeActivation: true,
    contractDoesNotAuthorizeRuntimeExecution: true,
    contractDoesNotAuthorizePublicRuntime: true,
    contractDoesNotAuthorizePilotRuntime: true,
    contractDoesNotAuthorizeProductionRuntime: true,
    contractDoesNotAuthorizeGoLive: true,
    controlledInternalTestOnly: true,
    runtimeDisabledNow: true,
    futureRuntimePatchRequired: true,
    futureSeamEnablementRequiresSeparateAuthorization: true,
    futurePostActivationAuditRequired: true,
    anonymousQuestionInputAllowed: true,
    nonDocumentQuestionInputAllowed: true,
    naturalLanguageQuestionInputAllowed: true,
    generalQaAnswerOutputAllowed: true,
    officialDocumentTextForbidden: true,
    pastedOfficialLetterForbidden: true,
    documentUploadForbidden: true,
    pdfUploadForbidden: true,
    imageUploadForbidden: true,
    photoInputForbidden: true,
    ocrInputForbidden: true,
    scannerUploadForbidden: true,
    scannedDocumentForbidden: true,
    paidDocumentModeInputForbidden: true,
    entitlementGatedDocumentModeForbidden: true,
    vayloDnaStoredDocumentForbidden: true,
    realDocumentInputForbidden: true,
    userVisibleDocumentOutputForbidden: true,
    exactLegalDeadlineCalculationForbidden: true,
    documentDerivedClaimsForbidden: true,
    legalAdviceClaimForbidden: true,
    trustedModelOutputForbidden: true,
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
    controlledRuntimeActivationSyntheticDryRunRequired: true,
    controlledRuntimeActivationReadinessAuditRequired: true,
    controlledRuntimeActivationClosureDecisionRequired: true,
    controlledInternalTestAuthorizationRequired: true,
    readyFor8x8DSyntheticRuntimeActivationDryRun: true,
    readyForRuntimeActivation: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleDocumentOutput: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPublicRuntime: false,
    readyForPilot: false,
    readyForProduction: false,
    readyForGoLive: false,
    claimRuleOrSemanticsDebtPreserved: true,
    evidenceRuleResolutionDebtPreserved: true,
    proximityManualOnlyDebtPreserved: true,
    trapKindTypingDebtPreserved: true,
    enforcementTrapHeuristicDebtPreserved: true,
    trapDispositionStateSeparationDebtPreserved: true,
    severityCandidateDerivationSeparationDebtPreserved: true,
    mapperDiagnosticTaxonomyDebtPreserved: true,
    td004ClosureDoesNotAuthorizeWiringDebtPreserved: true,
    freeQaControlledRuntimeActivationPlanTamperConfirmedFrom8x8B: true,
    freeQaControlledRuntimeActivationPlanTamperCaseCount: b.freeQaControlledRuntimeActivationPlanTamperCaseCount,
    freeQaControlledRuntimeActivationPlanTamperCasesRejected: b.freeQaControlledRuntimeActivationPlanTamperCasesRejected,
    governanceKernelConsolidationTamperConfirmedFrom8x8B: true,
    governanceKernelConsolidationTamperCaseCount: b.governanceKernelConsolidationTamperCaseCount,
    governanceKernelConsolidationTamperCasesRejected: b.governanceKernelConsolidationTamperCasesRejected,
    evidenceGatesClosureDecisionTamperConfirmedFrom8x8B: true,
    evidenceGatesClosureDecisionTamperCaseCount: b.evidenceGatesClosureDecisionTamperCaseCount,
    evidenceGatesClosureDecisionTamperCasesRejected: b.evidenceGatesClosureDecisionTamperCasesRejected,
    scopedWiringContainmentPatchTamperConfirmedFrom8x8B: true,
    scopedWiringContainmentPatchTamperCaseCount: b.scopedWiringContainmentPatchTamperCaseCount,
    scopedWiringContainmentPatchTamperCasesRejected: b.scopedWiringContainmentPatchTamperCasesRejected,
    postWiringAuditTamperConfirmedFrom8x8B: true,
    postWiringAuditTamperCaseCount: b.postWiringAuditTamperCaseCount,
    postWiringAuditTamperCasesRejected: b.postWiringAuditTamperCasesRejected,
    dryRunSyntheticValidationConfirmedFrom8x8B: true,
    dryRunSyntheticValidationCaseCount: b.dryRunSyntheticValidationCaseCount,
    dryRunSyntheticValidationCasesPassed: b.dryRunSyntheticValidationCasesPassed,
    dryRunLeakageValidationConfirmedFrom8x8B: true,
    dryRunLeakageValidationCaseCount: b.dryRunLeakageValidationCaseCount,
    dryRunLeakageValidationCasesPassed: b.dryRunLeakageValidationCasesPassed,
    dryRunTamperCoverageConfirmedFrom8x8B: true,
    dryRunTamperCaseCount: b.dryRunTamperCaseCount,
    dryRunTamperCasesRejected: b.dryRunTamperCasesRejected,
    wiringExecutionContractTamperConfirmedFrom8x8B: true,
    wiringExecutionContractTamperCaseCount: b.wiringExecutionContractTamperCaseCount,
    wiringExecutionContractTamperCasesRejected: b.wiringExecutionContractTamperCasesRejected,
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
    allowedInputContract,
    forbiddenInputContract,
    outputContract,
    safetyGateContract,
    futureActivationPreconditions,
    globalAuthorizationBlockers,
    preservedGovernanceDebts,
    contractNotes,
    freeQaControlledRuntimeActivationContractTamperCaseCount: tamperCaseCount,
    freeQaControlledRuntimeActivationContractTamperCasesRejected: tamperCaseCount,
    freeQaControlledRuntimeActivationContractTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaActivationContractResult(provisional)) {
    contractFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8C tamper cases ─────────────────────────────────────────────
  let freeQaControlledRuntimeActivationContractTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_CONTRACT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_CONTRACT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaActivationContractResult(tc.mutate(provisional))) {
      freeQaControlledRuntimeActivationContractTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8C tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) contractFailures.push(...tamperFailures);

  const allPassed =
    contractFailures.length === 0 &&
    freeQaControlledRuntimeActivationContractTamperCasesRejected === tamperCaseCount;

  const finalContractNotes: string[] = [
    ...contractNotes,
    `8.8C tamper cases: ${freeQaControlledRuntimeActivationContractTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(contractFailures.length > 0 ? [`FAILURES (${contractFailures.length}):`, ...contractFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaControlledRuntimeActivationContractTamperCasesRejected,
    contractNotes: finalContractNotes,
  };
}
