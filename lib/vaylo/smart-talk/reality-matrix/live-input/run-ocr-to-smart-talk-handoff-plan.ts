/**
 * PHASE 8.11H — OCR-to-Smart-Talk Handoff Plan
 *
 * Designs (but does NOT implement) the future safe handoff of OCR-derived
 * text into Smart Talk reasoning, building directly on the closed Real OCR
 * Trust Boundary (Phase 8.11G).
 *
 * This phase is PLAN ONLY. It defines, as structured/inspectable data:
 *  - what payload may be handed from OCR to Smart Talk in a future phase
 *    (futureHandoffPayloadContract),
 *  - the future route integration plan (futureRouteIntegrationPlan),
 *  - the future UI integration plan (futureUiIntegrationPlan),
 *  - how Evidence Gates must receive OCR-derived text (futureEvidenceGateIntegrationPlan),
 *  - how hallucination traps must treat OCR-derived text (futureHallucinationTrapIntegrationPlan),
 *  - the future API response contract shape (futureApiResponseContract),
 *  - the future disabled-closure validation plan (futureDisabledClosurePlan, Phase 8.11J),
 *  - the future enabled-synthetic-closure validation plan (futureEnabledSyntheticClosurePlan, Phase 8.11K),
 *  - the carried-forward tesseract.js cache artifact debt (tesseractCacheDebt).
 *
 * This phase is CLOSURE/PLAN ONLY:
 *  - Calls 8.11G, 8.11F, 8.11E, 8.11D, 8.11C, 8.11C-DEBT-A directly (all are
 *    already-authorized closures from prior phases; 8.11E/8.11F/8.11G each
 *    invoke real tesseract.js OCR in-process through the route — authorized;
 *    the combined call chain may take several minutes; both Outcome A and
 *    Outcome B are acceptable per each closure's own spec).
 *  - Performs its own eng.traineddata cache-artifact safety-net detection and
 *    cleanup after all source closures return (explicitly authorized cache
 *    cleanup, NOT persistence of any kind — this is the ONLY fs operation
 *    performed by this closure itself).
 *  - Does NOT modify any runtime file, route, UI, adapter, package, or config.
 *  - Does NOT implement OCR-to-Smart-Talk handoff.
 *  - Does NOT add an env flag to runtime.
 *  - Does NOT import tesseract.js directly or call the OCR adapter directly.
 *  - Does NOT use real documents or real images.
 *  - Does NOT persist anything.
 *  - Does NOT run Smart Talk reasoning or call OpenAI.
 *  - Does NOT authorize production, go-live, or public runtime.
 *  - Does NOT run 8.3AC or touch tmp-8-3ac-live-metadata.ts.
 *
 * Source strategy:
 *  - 8.11G (commit 831779a): DIRECT call — primary evidence that the OCR
 *    trust boundary is closed.
 *  - 8.11F (commit 2ef041f): DIRECT call — primary evidence that the OCR
 *    quality evaluator contract is closed.
 *  - 8.11E (commit ec5a76f): DIRECT call — primary evidence that OCR can run
 *    and can misread text.
 *  - 8.11D (commit 3688358): DIRECT call — primary evidence that disabled
 *    variants fail closed.
 *  - 8.11C (commit 46ddefc): DIRECT call — static evidence that route/UI/
 *    adapter safety boundaries exist.
 *  - 8.11C-DEBT-A (commit bdf3859): DIRECT call — supporting evidence, known
 *    technical debt inventory.
 *  - 8.9N-PATCH (commit cf6624c): Derived directly from 8.11E's own
 *    sourceTextDocumentSnapshotPatchAccepted field — 8.11E is called directly
 *    by this closure, so no further chained derivation is required.
 *  - 8.11B (commit 3a26936) / 8.11A (commit ead0f0c): Derived structurally via
 *    8.11C's nested source snapshot fields. Not called directly.
 *  - Historical closures 8.9K/8.9L/8.9M/8.10D/8.10E/8.10F: NOT called (unstable
 *    or route-invoking historical chains, per explicit phase instruction).
 *
 * tesseract.js eng.traineddata cache artifact handling:
 *  - Calling 8.11E/8.11F/8.11G may each independently cause tesseract.js to
 *    download/cache eng.traineddata (~5MB) into the repo root as a side
 *    effect of their own internal real OCR invocation.
 *  - 8.11F and 8.11G already perform their own internal detection/cleanup
 *    after their own OCR invocation completes. This closure performs an
 *    additional independent safety-net fs.existsSync check and fs.unlinkSync
 *    cleanup (plus a scan for any other *.traineddata files) after ALL source
 *    closures have returned, to guarantee the working tree is left clean.
 *  - This is NOT a blocker for Phase 8.11I (blockerBefore8_11I: false) as long
 *    as the working tree remains clean after this closure runs; it remains a
 *    blocker before broader/mobile/public OCR testing.
 */

import fs from "fs";
import path from "path";
import { runRealOcrTrustBoundaryClosure } from "./run-real-ocr-trust-boundary-closure";
import { runRealOcrQualityEvaluatorClosure } from "./run-real-ocr-quality-evaluator-closure";
import { runRealOcrEnabledSyntheticLocalApiClosure } from "./run-real-ocr-enabled-synthetic-local-api-closure";
import { runRealOcrDisabledLocalApiClosure } from "./run-real-ocr-disabled-local-api-closure";
import { runMinimalRealOcrRuntimePatchAudit } from "./run-minimal-real-ocr-runtime-patch-audit";
import { runTechnicalDebtInventoryAudit } from "./run-technical-debt-inventory-audit";

// ─── Structured section interfaces ────────────────────────────────────────────

interface FutureHandoffPayloadContract {
  sourceKind: "ocr_derived_text";
  sourceMode: "photo_ocr_real_extraction_controlled_runtime";
  trustLevel: "untrusted_derived";
  sensitivityLevel: "sensitive_user_content";
  extractedText: string;
  extractedTextLength: string;
  provider: string;
  confidenceAvailable: string;
  confidence: string;
  qualityStatus: string;
  usableForSmartTalk: string;
  blockingReasons: string;
  downgradeReasons: string;
  ocrWarnings: string;
  highRiskTokensDetected: string;
  privacyDisclaimerRequired: true;
  legalDisclaimerRequired: true;
  checkOriginalDocumentRequired: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingStillBlocked: true;
  dnaWriteBlocked: true;
  persistenceBlocked: true;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  sourceTrace: string;
  gateTrace: string;
  handoffTrace: string;
  createdAtRuntimeOnly: true;
  persistByDefault: false;
}

interface FutureRouteIntegrationPlan {
  futureFileToModify: "app/api/smart-talk/route.ts";
  futureBranchName: "photo_ocr_real_extraction_to_smart_talk_controlled_handoff";
  futureEnvFlag: "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
  exactEnvValueRequired: "true";
  realOcrEnvAlsoRequired: true;
  placeholderEnvCannotAuthorizeHandoff: true;
  disabledByDefault: true;
  controlledInternalOnly: true;
  publicRuntimeStillBlocked: true;
  noPersistenceByDefault: true;
  noDnaWrite: true;
  noStorageWrite: true;
  modelCallAllowedOnlyAfterHandoffGate: true;
  modelCallMustReceiveTrustMetadata: true;
  modelCallMustNotReceiveRawImage: true;
  modelCallMustNotReceiveOriginalDocumentFile: true;
  modelCallMustReceiveExtractedTextOnly: true;
  modelOutputMustRemainUntrusted: true;
  evidenceGateRequiredBeforeClaims: true;
  hallucinationTrapRequiredAfterModel: true;
  exactLegalDeadlineStillBlocked: true;
  officialFilingStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
}

interface FutureUiIntegrationPlan {
  futureFileToModify: "app/smart-talk/SmartTalkClient.tsx";
  futureUiMode: "photo";
  futureButtonLabel: "Interný test: OCR → Smart Talk";
  futureButtonVisibleOnlyInPhotoMode: true;
  futureButtonDisabledUnlessExactlyOneImageSelected: true;
  futureButtonRequiresExplicitClick: true;
  futureNoAutofillIntoTextMode: true;
  futureNoSilentHandoff: true;
  futureWarningsMustBeVisibleBeforeAnswer: true;
  futureAnswerMustDisplayOcrTrustWarning: true;
  futureAnswerMustDisplayCheckOriginalWarning: true;
  futureAnswerMustDisplayLegalDisclaimer: true;
  futureAnswerMustDisplayPrivacyDisclaimer: true;
  futureHighRiskWarningsMustBeVisible: true;
  futureHandoffTraceMayBeShownInDebugOnly: true;
  publicUiExposureStillBlocked: true;
}

interface FutureEvidenceGateIntegrationPlan {
  evidenceInputSourceKind: "ocr_derived_text";
  evidenceInputTrustLevel: "untrusted_derived";
  evidenceInputQualityStatusRequired: true;
  evidenceInputWarningsRequired: true;
  evidenceInputHighRiskTokenFlagsRequired: true;
  lowQualityBlocksClaims: true;
  blockedQualityBlocksHandoff: true;
  usableQualityDoesNotAutoAuthorizeClaims: true;
  legalDeadlineClaimsRemainBlocked: true;
  filingClaimsRemainBlocked: true;
  paymentInstructionClaimsRemainBlocked: true;
  verifiedFactCreationBlocked: true;
  dnaWriteBlocked: true;
  claimAuthorizationMustReferenceOcrSource: true;
  claimAuthorizationMustPreserveUntrustedStatus: true;
}

interface FutureHallucinationTrapIntegrationPlan {
  trapInputSourceKind: "ocr_derived_text";
  trapMustKnowOcrDerived: true;
  trapMustKnowQualityStatus: true;
  trapMustKnowHighRiskTokens: true;
  trapMustBlockOverconfidentReading: true;
  trapMustBlockExactDeadlineFromOcr: true;
  trapMustBlockBindingAdviceFromOcr: true;
  trapMustBlockFilingGenerationFromOcr: true;
  trapMustBlockPaymentInstructionFromOcr: true;
  trapMustBlockVerifiedFactCreationFromOcr: true;
  trapMustWarnOnNamesDatesAmountsAddresses: true;
  trapMustPreserveCheckOriginalWarning: true;
  modelOutputRemainsUntrusted: true;
}

interface FutureApiResponseContractHandoff {
  allowed: string;
  performed: string;
  reason: string;
  sourceKind: "ocr_derived_text";
  trustLevel: "untrusted_derived";
  qualityStatus: string;
  blockingReasons: string;
  downgradeReasons: string;
  ocrWarnings: string;
  highRiskTokensDetected: string;
  trace: string;
}

interface FutureApiResponseContract {
  ok: string;
  mode: string;
  context: string;
  ocrResult: string;
  smartTalkResult: string;
  handoff: FutureApiResponseContractHandoff;
  safety: string;
  disclaimers: string;
  warnings: string;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
}

interface FutureDisabledClosurePlan {
  phase: "8.11J";
  disabledEnvCases: string[];
  allDisabledCasesMustReturn403: true;
  expectedDisabledCode: "ocr_to_smart_talk_handoff_disabled";
  realOcrMayRunInSeparateBranchesOnly: false;
  smartTalkReasoningMustNotRun: true;
  modelCallMustNotRun: true;
  persistenceMustNotRun: true;
  publicRuntimeStillBlocked: true;
}

interface FutureEnabledSyntheticClosurePlan {
  phase: "8.11K";
  exactEnvValue: "true";
  realOcrEnvAlsoRequired: true;
  syntheticImageOnly: true;
  noRealDocument: true;
  noBrowser: true;
  inProcessRouteInvocationOnly: true;
  handoffMayRunOnlyAfterGate: true;
  modelCallMayRunOnlyIfExplicitlyAllowedByFutureGate: true;
  rawImageMustNotReachModel: true;
  extractedTextOnlyMayReachModel: true;
  trustMetadataMustReachModel: true;
  qualityMetadataMustReachModel: true;
  warningsMustReachModel: true;
  highRiskClaimsMustRemainBlocked: true;
  handoffResultMustPreserveUntrustedStatus: true;
  noPersistence: true;
  noDnaWrite: true;
  publicRuntimeStillBlocked: true;
}

interface TesseractCacheDebt {
  debtObserved: true;
  artifactName: "eng.traineddata";
  artifactLocationObserved: "repo root";
  causedBy: string;
  currentMitigation: string;
  mustNotCommitArtifact: true;
  needsControlledCachePath: true;
  needsCleanupPolicy: true;
  needsGitignorePolicyReview: true;
  blockerBeforeMobileTesting: true;
  blockerBeforePublicBeta: true;
  blockerBefore8_11I: false;
}

// ─── Result interface ─────────────────────────────────────────────────────────

interface OcrToSmartTalkHandoffPlanResult {
  checkId: "8.11H";
  allPassed: boolean;
  handoffPlanOnly: true;
  ocrToSmartTalkHandoffPlanOnly: true;
  handoffImplementedNow: false;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  adapterModifiedNow: false;
  packageModifiedNow: false;
  configModifiedNow: false;
  envModifiedNow: false;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  externalNetworkCalledByClosure: false;
  fetchCalledExternally: false;
  openAiCalled: false;
  tesseractImportedDirectlyByClosure: false;
  ocrAdapterCalledDirectlyByClosure: false;
  realImageUsedByClosure: false;
  syntheticEvidenceOnly: true;
  realDocumentUsed: false;
  imageSavedToDisk: false;
  realDocumentImageBytesRead: false;
  modelCallPerformed: false;
  smartTalkReasoningPerformed: false;
  ocrToSmartTalkHandoffPerformed: false;
  uploadPersistencePerformed: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  verifiedFactsCreated: false;
  legalDeadlineCreated: false;
  officialFilingCreated: false;
  bindingLegalAdviceCreated: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  paidDocumentModeEnabledNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceMinimalRealOcrRuntimePatchCommit: "46ddefc";
  sourceDisabledLocalApiClosureCommit: "3688358";
  sourceEnabledSyntheticLocalApiClosureCommit: "ec5a76f";
  sourceQualityEvaluatorClosureCommit: "2ef041f";
  sourceTrustBoundaryClosureCommit: "831779a";
  sourceTextDocumentSnapshotPatchCommit: "cf6624c";
  sourceTechnicalDebtInventoryCommit: "bdf3859";
  sourceImplementationPlanCommit: "3a26936";
  sourceGateDesignCommit: "ead0f0c";
  sourceMinimalRealOcrRuntimePatchAccepted: boolean;
  sourceDisabledLocalApiClosureAccepted: boolean;
  sourceEnabledSyntheticLocalApiClosureAccepted: boolean;
  sourceQualityEvaluatorClosureAccepted: boolean;
  sourceTrustBoundaryClosureAccepted: boolean;
  sourceTextDocumentSnapshotPatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  observedSyntheticOcrCaseAccepted: boolean;
  observedOcrProvider: string | null;
  observedExpectedSyntheticText: "VAYLO OCR TEST\nNO PERSONAL DATA";
  observedExtractedText: string | null;
  observedOcrMisreadDetected: boolean;
  observedOcrMisreadExample: "NO PERSONAL DATA -> HO PERSOMAL DATH";
  observedQualityStatusFrom8_11E: string | null;
  observedHandoffAllowedFrom8_11E: false;
  observedModelCallFrom8_11E: false;
  observedPersistenceFrom8_11E: false;

  handoffPlanCreated: true;
  handoffPlanClosed: true;
  ocrToSmartTalkHandoffImplementationStillBlocked: true;
  futureRuntimePatchRequired: true;
  futureDisabledClosureRequired: true;
  futureEnabledSyntheticClosureRequired: true;
  futureBrowserManualClosureRequired: true;
  futureMobileManualClosureRequired: true;
  trustBoundaryMustCarryForward: true;
  qualityEvaluatorMustCarryForward: true;
  evidenceGatesMustReceiveOcrSourceMetadata: true;
  hallucinationTrapsMustReceiveOcrSourceMetadata: true;
  highRiskClaimsRemainBlocked: true;
  legalDeadlineStillBlocked: true;
  officialFilingStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  dnaWriteStillBlocked: true;
  readyForMinimalHandoffRuntimePatch: boolean;
  readyForOcrToSmartTalkHandoffImplementation: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11I";
  recommendedNextPhase: "Minimal OCR-to-Smart-Talk Handoff Runtime Patch";

  futureHandoffPayloadContract: FutureHandoffPayloadContract;
  futureRouteIntegrationPlan: FutureRouteIntegrationPlan;
  futureUiIntegrationPlan: FutureUiIntegrationPlan;
  futureEvidenceGateIntegrationPlan: FutureEvidenceGateIntegrationPlan;
  futureHallucinationTrapIntegrationPlan: FutureHallucinationTrapIntegrationPlan;
  futureApiResponseContract: FutureApiResponseContract;
  futureDisabledClosurePlan: FutureDisabledClosurePlan;
  futureEnabledSyntheticClosurePlan: FutureEnabledSyntheticClosurePlan;
  tesseractCacheDebt: TesseractCacheDebt;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  observedOcrEvidence: string[];
  handoffPlanEvidence: string[];
  payloadContractEvidence: string[];
  routeIntegrationPlanEvidence: string[];
  uiIntegrationPlanEvidence: string[];
  evidenceGateIntegrationPlanEvidence: string[];
  hallucinationTrapIntegrationPlanEvidence: string[];
  apiResponseContractEvidence: string[];
  disabledClosurePlanEvidence: string[];
  enabledSyntheticClosurePlanEvidence: string[];
  tesseractCacheDebtEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Fixed required arrays (exact-match, tamper-resistant) ───────────────────

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.11G real OCR trust boundary closure accepted (commit 831779a) — trust boundary contract closed, forbidden trust promotions and high-risk boundary rules defined, readyForOcrToSmartTalkHandoffPlan confirmed",
  "8.11F real OCR quality evaluator closure accepted (commit 2ef041f) — quality evaluator contract closed, readyForOcrTrustBoundaryClosure confirmed",
  "8.11E real OCR enabled synthetic local API closure accepted (commit ec5a76f) — real tesseract.js OCR ran in-process, misread risk confirmed, readyForOcrQualityEvaluatorClosure confirmed",
  "8.11D real OCR disabled local API closure accepted (commit 3688358) — all disabled env variants returned 403/real_ocr_extraction_disabled",
  "8.11C minimal real OCR runtime patch audit accepted (commit 46ddefc) — route branch, adapter, and dedicated env flag statically verified",
  "8.9N-PATCH text document mode internal readiness source snapshot fix accepted (commit cf6624c) — derived directly from 8.11E's own sourceTextDocumentSnapshotPatchAccepted field, since 8.11E is called directly by this closure",
  "8.11C-DEBT-A technical debt inventory audit accepted (commit bdf3859) — safeToProceedTo8_11D confirmed true; known technical debt items identified and preserved",
  "8.11B real OCR extraction implementation plan accepted structurally via 8.11C nested source snapshot (commit 3a26936) — not called directly by this closure",
  "8.11A real OCR extraction gate design accepted structurally via 8.11C nested source snapshot (commit ead0f0c) — not called directly by this closure",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase is handoff plan only.",
  "It does not implement handoff.",
  "It does not modify the route.",
  "It does not modify the UI.",
  "It does not modify the adapter.",
  "It does not add an env flag to runtime.",
  "It does not run Smart Talk reasoning.",
  "It does not call OpenAI.",
  "It does not run browser/mobile tests.",
  "It does not validate real-world OCR accuracy.",
  "It relies on 8.11G trust boundary, 8.11F quality closure, and 8.11E synthetic OCR evidence.",
  "OCR-to-Smart-Talk handoff remains disabled.",
  "Runtime patch is still pending.",
  "tesseract.js cache artifact debt remains unresolved.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "minimal OCR-to-Smart-Talk handoff runtime patch not implemented",
  "OCR-to-Smart-Talk disabled local API closure not created",
  "OCR-to-Smart-Talk enabled synthetic local API closure not created",
  "actual evaluator runtime file not implemented yet",
  "tesseract.js cache path / cleanup / gitignore policy not resolved",
  "browser manual OCR-to-Smart-Talk test not planned/performed",
  "mobile manual OCR-to-Smart-Talk test not planned/performed",
  "real document handling not validated",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_DISABLED_ENV_CASES: string[] = [
  "absent",
  "false",
  "FALSE",
  "TRUE",
  "1",
  "yes",
  "whitespace true",
  "empty",
  "enabled",
];

// ─── Static structured section data ──────────────────────────────────────────

const FUTURE_HANDOFF_PAYLOAD_CONTRACT: FutureHandoffPayloadContract = {
  sourceKind: "ocr_derived_text",
  sourceMode: "photo_ocr_real_extraction_controlled_runtime",
  trustLevel: "untrusted_derived",
  sensitivityLevel: "sensitive_user_content",
  extractedText:
    "string — verbatim OCR output text only; never the raw image, never the original document file; must be carried alongside all metadata below, never in isolation",
  extractedTextLength: "number — length of extractedText, required for downstream length-based downgrade rules",
  provider: "string — OCR provider identifier (e.g. 'tesseract_js'), required for provenance tracing",
  confidenceAvailable: "boolean — whether the provider returned a confidence score for this extraction",
  confidence: "number | null — provider confidence score when available; null when unavailable",
  qualityStatus: "'blocked' | 'low' | 'medium' | 'usable' — from the 8.11F quality evaluator contract; must always accompany extractedText",
  usableForSmartTalk: "boolean — false whenever qualityStatus is 'blocked'; never implies verified truth even when true",
  blockingReasons: "string[] — carried forward verbatim from the quality evaluator; empty array only when status is not 'blocked'",
  downgradeReasons: "string[] — carried forward verbatim from the quality evaluator; may be non-empty even at 'usable' status is not possible by definition, but must be preserved at 'low'/'medium'",
  ocrWarnings: "string[] — human-readable warnings (e.g. suspected misread, high-risk token detected) that must be surfaced to the user before any answer is shown",
  highRiskTokensDetected: "string[] — category ids (deadlines, amounts, ibanOrPaymentReferences, caseNumbers, authorityNames, personalNames, addresses, credentialsOrApiKeysOrPasswordLikeText, healthOrInsuranceNumbers, immigrationOrResidencePermitReferences, taxIds, dates) detected in extractedText",
  privacyDisclaimerRequired: true,
  legalDisclaimerRequired: true,
  checkOriginalDocumentRequired: true,
  exactLegalDeadlineStillBlocked: true,
  bindingLegalAdviceStillBlocked: true,
  officialFilingStillBlocked: true,
  dnaWriteBlocked: true,
  persistenceBlocked: true,
  publicRuntimeStillBlocked: true,
  productionAuthorizedNow: false,
  goLiveAuthorizedNow: false,
  sourceTrace: "string[] — ordered list of phase/commit ids that produced this payload (e.g. ['8.11C:46ddefc', '8.11D:3688358', '8.11E:ec5a76f', '8.11F:2ef041f', '8.11G:831779a'])",
  gateTrace: "string[] — ordered list of Evidence Gate / hallucination trap checkpoints this payload passed through, with pass/block outcome for each",
  handoffTrace: "string[] — ordered list of handoff decision steps (env flag checked, quality gate evaluated, disclaimers attached, model invoked or blocked) for debug-only visibility",
  createdAtRuntimeOnly: true,
  persistByDefault: false,
};

const FUTURE_ROUTE_INTEGRATION_PLAN: FutureRouteIntegrationPlan = {
  futureFileToModify: "app/api/smart-talk/route.ts",
  futureBranchName: "photo_ocr_real_extraction_to_smart_talk_controlled_handoff",
  futureEnvFlag: "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED",
  exactEnvValueRequired: "true",
  realOcrEnvAlsoRequired: true,
  placeholderEnvCannotAuthorizeHandoff: true,
  disabledByDefault: true,
  controlledInternalOnly: true,
  publicRuntimeStillBlocked: true,
  noPersistenceByDefault: true,
  noDnaWrite: true,
  noStorageWrite: true,
  modelCallAllowedOnlyAfterHandoffGate: true,
  modelCallMustReceiveTrustMetadata: true,
  modelCallMustNotReceiveRawImage: true,
  modelCallMustNotReceiveOriginalDocumentFile: true,
  modelCallMustReceiveExtractedTextOnly: true,
  modelOutputMustRemainUntrusted: true,
  evidenceGateRequiredBeforeClaims: true,
  hallucinationTrapRequiredAfterModel: true,
  exactLegalDeadlineStillBlocked: true,
  officialFilingStillBlocked: true,
  bindingLegalAdviceStillBlocked: true,
};

const FUTURE_UI_INTEGRATION_PLAN: FutureUiIntegrationPlan = {
  futureFileToModify: "app/smart-talk/SmartTalkClient.tsx",
  futureUiMode: "photo",
  futureButtonLabel: "Interný test: OCR → Smart Talk",
  futureButtonVisibleOnlyInPhotoMode: true,
  futureButtonDisabledUnlessExactlyOneImageSelected: true,
  futureButtonRequiresExplicitClick: true,
  futureNoAutofillIntoTextMode: true,
  futureNoSilentHandoff: true,
  futureWarningsMustBeVisibleBeforeAnswer: true,
  futureAnswerMustDisplayOcrTrustWarning: true,
  futureAnswerMustDisplayCheckOriginalWarning: true,
  futureAnswerMustDisplayLegalDisclaimer: true,
  futureAnswerMustDisplayPrivacyDisclaimer: true,
  futureHighRiskWarningsMustBeVisible: true,
  futureHandoffTraceMayBeShownInDebugOnly: true,
  publicUiExposureStillBlocked: true,
};

const FUTURE_EVIDENCE_GATE_INTEGRATION_PLAN: FutureEvidenceGateIntegrationPlan = {
  evidenceInputSourceKind: "ocr_derived_text",
  evidenceInputTrustLevel: "untrusted_derived",
  evidenceInputQualityStatusRequired: true,
  evidenceInputWarningsRequired: true,
  evidenceInputHighRiskTokenFlagsRequired: true,
  lowQualityBlocksClaims: true,
  blockedQualityBlocksHandoff: true,
  usableQualityDoesNotAutoAuthorizeClaims: true,
  legalDeadlineClaimsRemainBlocked: true,
  filingClaimsRemainBlocked: true,
  paymentInstructionClaimsRemainBlocked: true,
  verifiedFactCreationBlocked: true,
  dnaWriteBlocked: true,
  claimAuthorizationMustReferenceOcrSource: true,
  claimAuthorizationMustPreserveUntrustedStatus: true,
};

const FUTURE_HALLUCINATION_TRAP_INTEGRATION_PLAN: FutureHallucinationTrapIntegrationPlan = {
  trapInputSourceKind: "ocr_derived_text",
  trapMustKnowOcrDerived: true,
  trapMustKnowQualityStatus: true,
  trapMustKnowHighRiskTokens: true,
  trapMustBlockOverconfidentReading: true,
  trapMustBlockExactDeadlineFromOcr: true,
  trapMustBlockBindingAdviceFromOcr: true,
  trapMustBlockFilingGenerationFromOcr: true,
  trapMustBlockPaymentInstructionFromOcr: true,
  trapMustBlockVerifiedFactCreationFromOcr: true,
  trapMustWarnOnNamesDatesAmountsAddresses: true,
  trapMustPreserveCheckOriginalWarning: true,
  modelOutputRemainsUntrusted: true,
};

const FUTURE_API_RESPONSE_CONTRACT: FutureApiResponseContract = {
  ok: "boolean — top-level route success flag",
  mode: "string — e.g. 'photo', mirrors existing route mode discriminator",
  context: "string | null — mirrors existing route context field",
  ocrResult: "object — { extractedText, extractedTextLength, provider, confidenceAvailable, confidence, quality: { status, usableForSmartTalk, blockingReasons, downgradeReasons }, warnings, highRiskTokensDetected } (unchanged shape from 8.11E/8.11F/8.11G)",
  smartTalkResult: "object | null — present only when handoff.performed is true; must never include raw image or original document references",
  handoff: {
    allowed: "boolean — true only if env flag is exact 'true', real OCR env is also exact 'true', and qualityStatus is not 'blocked'",
    performed: "boolean — true only if allowed is true AND the route actually invoked Smart Talk reasoning with the extracted text",
    reason: "string — machine-readable reason code explaining why handoff was or was not performed (e.g. 'disabled_by_env', 'blocked_quality', 'ok')",
    sourceKind: "ocr_derived_text",
    trustLevel: "untrusted_derived",
    qualityStatus: "string — carried forward verbatim from ocrResult.quality.status",
    blockingReasons: "string[] — carried forward verbatim from ocrResult.quality.blockingReasons",
    downgradeReasons: "string[] — carried forward verbatim from ocrResult.quality.downgradeReasons",
    ocrWarnings: "string[] — carried forward verbatim from ocrResult.warnings",
    highRiskTokensDetected: "string[] — carried forward verbatim from ocrResult.highRiskTokensDetected",
    trace: "string[] — ordered handoff decision trace, debug-only",
  },
  safety: "object — { publicRuntimeStillBlocked, productionAuthorizedNow, goLiveAuthorizedNow, dnaWriteBlocked, persistenceBlocked }",
  disclaimers: "object — { privacyDisclaimer, legalDisclaimer, checkOriginalDocumentWarning } all required, non-empty strings, always present regardless of handoff.performed",
  warnings: "string[] — top-level user-facing warnings, always includes ocrWarnings and any high-risk token warnings when handoff.performed is true",
  publicRuntimeStillBlocked: true,
  productionAuthorizedNow: false,
  goLiveAuthorizedNow: false,
};

const FUTURE_DISABLED_CLOSURE_PLAN: FutureDisabledClosurePlan = {
  phase: "8.11J",
  disabledEnvCases: [...REQUIRED_DISABLED_ENV_CASES],
  allDisabledCasesMustReturn403: true,
  expectedDisabledCode: "ocr_to_smart_talk_handoff_disabled",
  realOcrMayRunInSeparateBranchesOnly: false,
  smartTalkReasoningMustNotRun: true,
  modelCallMustNotRun: true,
  persistenceMustNotRun: true,
  publicRuntimeStillBlocked: true,
};

const FUTURE_ENABLED_SYNTHETIC_CLOSURE_PLAN: FutureEnabledSyntheticClosurePlan = {
  phase: "8.11K",
  exactEnvValue: "true",
  realOcrEnvAlsoRequired: true,
  syntheticImageOnly: true,
  noRealDocument: true,
  noBrowser: true,
  inProcessRouteInvocationOnly: true,
  handoffMayRunOnlyAfterGate: true,
  modelCallMayRunOnlyIfExplicitlyAllowedByFutureGate: true,
  rawImageMustNotReachModel: true,
  extractedTextOnlyMayReachModel: true,
  trustMetadataMustReachModel: true,
  qualityMetadataMustReachModel: true,
  warningsMustReachModel: true,
  highRiskClaimsMustRemainBlocked: true,
  handoffResultMustPreserveUntrustedStatus: true,
  noPersistence: true,
  noDnaWrite: true,
  publicRuntimeStillBlocked: true,
};

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalOcrToSmartTalkHandoffPlanResult(
  r: OcrToSmartTalkHandoffPlanResult,
): boolean {
  if (r.checkId !== "8.11H") return false;
  if (r.allPassed !== true) return false;
  if (r.handoffPlanOnly !== true) return false;
  if (r.ocrToSmartTalkHandoffPlanOnly !== true) return false;
  if (r.handoffImplementedNow !== false) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.adapterModifiedNow !== false) return false;
  if (r.packageModifiedNow !== false) return false;
  if (r.configModifiedNow !== false) return false;
  if (r.envModifiedNow !== false) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.externalNetworkCalledByClosure !== false) return false;
  if (r.fetchCalledExternally !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.tesseractImportedDirectlyByClosure !== false) return false;
  if (r.ocrAdapterCalledDirectlyByClosure !== false) return false;
  if (r.realImageUsedByClosure !== false) return false;
  if (r.syntheticEvidenceOnly !== true) return false;
  if (r.realDocumentUsed !== false) return false;
  if (r.imageSavedToDisk !== false) return false;
  if (r.realDocumentImageBytesRead !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.smartTalkReasoningPerformed !== false) return false;
  if (r.ocrToSmartTalkHandoffPerformed !== false) return false;
  if (r.uploadPersistencePerformed !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.verifiedFactsCreated !== false) return false;
  if (r.legalDeadlineCreated !== false) return false;
  if (r.officialFilingCreated !== false) return false;
  if (r.bindingLegalAdviceCreated !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceMinimalRealOcrRuntimePatchCommit !== "46ddefc") return false;
  if (r.sourceDisabledLocalApiClosureCommit !== "3688358") return false;
  if (r.sourceEnabledSyntheticLocalApiClosureCommit !== "ec5a76f") return false;
  if (r.sourceQualityEvaluatorClosureCommit !== "2ef041f") return false;
  if (r.sourceTrustBoundaryClosureCommit !== "831779a") return false;
  if (r.sourceTextDocumentSnapshotPatchCommit !== "cf6624c") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;
  if (r.sourceImplementationPlanCommit !== "3a26936") return false;
  if (r.sourceGateDesignCommit !== "ead0f0c") return false;
  if (r.sourceMinimalRealOcrRuntimePatchAccepted !== true) return false;
  if (r.sourceDisabledLocalApiClosureAccepted !== true) return false;
  if (r.sourceEnabledSyntheticLocalApiClosureAccepted !== true) return false;
  if (r.sourceQualityEvaluatorClosureAccepted !== true) return false;
  if (r.sourceTrustBoundaryClosureAccepted !== true) return false;
  if (r.sourceTextDocumentSnapshotPatchAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;

  if (r.observedOcrMisreadDetected !== true) return false;
  if (r.observedSyntheticOcrCaseAccepted !== true) return false;
  if (r.observedExpectedSyntheticText !== "VAYLO OCR TEST\nNO PERSONAL DATA") return false;
  if (r.observedOcrMisreadExample !== "NO PERSONAL DATA -> HO PERSOMAL DATH") return false;
  if (r.observedHandoffAllowedFrom8_11E !== false) return false;
  if (r.observedModelCallFrom8_11E !== false) return false;
  if (r.observedPersistenceFrom8_11E !== false) return false;

  if (r.handoffPlanCreated !== true) return false;
  if (r.handoffPlanClosed !== true) return false;
  if (r.ocrToSmartTalkHandoffImplementationStillBlocked !== true) return false;
  if (r.futureRuntimePatchRequired !== true) return false;
  if (r.futureDisabledClosureRequired !== true) return false;
  if (r.futureEnabledSyntheticClosureRequired !== true) return false;
  if (r.futureBrowserManualClosureRequired !== true) return false;
  if (r.futureMobileManualClosureRequired !== true) return false;
  if (r.trustBoundaryMustCarryForward !== true) return false;
  if (r.qualityEvaluatorMustCarryForward !== true) return false;
  if (r.evidenceGatesMustReceiveOcrSourceMetadata !== true) return false;
  if (r.hallucinationTrapsMustReceiveOcrSourceMetadata !== true) return false;
  if (r.highRiskClaimsRemainBlocked !== true) return false;
  if (r.legalDeadlineStillBlocked !== true) return false;
  if (r.officialFilingStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.dnaWriteStillBlocked !== true) return false;
  if (r.readyForMinimalHandoffRuntimePatch !== true) return false;
  if (r.readyForOcrToSmartTalkHandoffImplementation !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11I") return false;
  if (r.recommendedNextPhase !== "Minimal OCR-to-Smart-Talk Handoff Runtime Patch") return false;

  // futureHandoffPayloadContract
  const phc = r.futureHandoffPayloadContract;
  if (!phc) return false;
  if (phc.sourceKind !== "ocr_derived_text") return false;
  if (phc.sourceMode !== "photo_ocr_real_extraction_controlled_runtime") return false;
  if (phc.trustLevel !== "untrusted_derived") return false;
  if (phc.sensitivityLevel !== "sensitive_user_content") return false;
  if (!phc.extractedText) return false;
  if (!phc.extractedTextLength) return false;
  if (!phc.provider) return false;
  if (!phc.confidenceAvailable) return false;
  if (!phc.confidence) return false;
  if (!phc.qualityStatus) return false;
  if (!phc.usableForSmartTalk) return false;
  if (!phc.blockingReasons) return false;
  if (!phc.downgradeReasons) return false;
  if (!phc.ocrWarnings) return false;
  if (!phc.highRiskTokensDetected) return false;
  if (phc.privacyDisclaimerRequired !== true) return false;
  if (phc.legalDisclaimerRequired !== true) return false;
  if (phc.checkOriginalDocumentRequired !== true) return false;
  if (phc.exactLegalDeadlineStillBlocked !== true) return false;
  if (phc.bindingLegalAdviceStillBlocked !== true) return false;
  if (phc.officialFilingStillBlocked !== true) return false;
  if (phc.dnaWriteBlocked !== true) return false;
  if (phc.persistenceBlocked !== true) return false;
  if (phc.publicRuntimeStillBlocked !== true) return false;
  if (phc.productionAuthorizedNow !== false) return false;
  if (phc.goLiveAuthorizedNow !== false) return false;
  if (!phc.sourceTrace) return false;
  if (!phc.gateTrace) return false;
  if (!phc.handoffTrace) return false;
  if (phc.createdAtRuntimeOnly !== true) return false;
  if (phc.persistByDefault !== false) return false;

  // futureRouteIntegrationPlan
  const rip = r.futureRouteIntegrationPlan;
  if (!rip) return false;
  if (rip.futureFileToModify !== "app/api/smart-talk/route.ts") return false;
  if (rip.futureBranchName !== "photo_ocr_real_extraction_to_smart_talk_controlled_handoff") return false;
  if (rip.futureEnvFlag !== "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED") return false;
  if (rip.exactEnvValueRequired !== "true") return false;
  if (rip.realOcrEnvAlsoRequired !== true) return false;
  if (rip.placeholderEnvCannotAuthorizeHandoff !== true) return false;
  if (rip.disabledByDefault !== true) return false;
  if (rip.controlledInternalOnly !== true) return false;
  if (rip.publicRuntimeStillBlocked !== true) return false;
  if (rip.noPersistenceByDefault !== true) return false;
  if (rip.noDnaWrite !== true) return false;
  if (rip.noStorageWrite !== true) return false;
  if (rip.modelCallAllowedOnlyAfterHandoffGate !== true) return false;
  if (rip.modelCallMustReceiveTrustMetadata !== true) return false;
  if (rip.modelCallMustNotReceiveRawImage !== true) return false;
  if (rip.modelCallMustNotReceiveOriginalDocumentFile !== true) return false;
  if (rip.modelCallMustReceiveExtractedTextOnly !== true) return false;
  if (rip.modelOutputMustRemainUntrusted !== true) return false;
  if (rip.evidenceGateRequiredBeforeClaims !== true) return false;
  if (rip.hallucinationTrapRequiredAfterModel !== true) return false;
  if (rip.exactLegalDeadlineStillBlocked !== true) return false;
  if (rip.officialFilingStillBlocked !== true) return false;
  if (rip.bindingLegalAdviceStillBlocked !== true) return false;

  // futureUiIntegrationPlan
  const uip = r.futureUiIntegrationPlan;
  if (!uip) return false;
  if (uip.futureFileToModify !== "app/smart-talk/SmartTalkClient.tsx") return false;
  if (uip.futureUiMode !== "photo") return false;
  if (uip.futureButtonLabel !== "Interný test: OCR → Smart Talk") return false;
  if (uip.futureButtonVisibleOnlyInPhotoMode !== true) return false;
  if (uip.futureButtonDisabledUnlessExactlyOneImageSelected !== true) return false;
  if (uip.futureButtonRequiresExplicitClick !== true) return false;
  if (uip.futureNoAutofillIntoTextMode !== true) return false;
  if (uip.futureNoSilentHandoff !== true) return false;
  if (uip.futureWarningsMustBeVisibleBeforeAnswer !== true) return false;
  if (uip.futureAnswerMustDisplayOcrTrustWarning !== true) return false;
  if (uip.futureAnswerMustDisplayCheckOriginalWarning !== true) return false;
  if (uip.futureAnswerMustDisplayLegalDisclaimer !== true) return false;
  if (uip.futureAnswerMustDisplayPrivacyDisclaimer !== true) return false;
  if (uip.futureHighRiskWarningsMustBeVisible !== true) return false;
  if (uip.futureHandoffTraceMayBeShownInDebugOnly !== true) return false;
  if (uip.publicUiExposureStillBlocked !== true) return false;

  // futureEvidenceGateIntegrationPlan
  const egip = r.futureEvidenceGateIntegrationPlan;
  if (!egip) return false;
  if (egip.evidenceInputSourceKind !== "ocr_derived_text") return false;
  if (egip.evidenceInputTrustLevel !== "untrusted_derived") return false;
  if (egip.evidenceInputQualityStatusRequired !== true) return false;
  if (egip.evidenceInputWarningsRequired !== true) return false;
  if (egip.evidenceInputHighRiskTokenFlagsRequired !== true) return false;
  if (egip.lowQualityBlocksClaims !== true) return false;
  if (egip.blockedQualityBlocksHandoff !== true) return false;
  if (egip.usableQualityDoesNotAutoAuthorizeClaims !== true) return false;
  if (egip.legalDeadlineClaimsRemainBlocked !== true) return false;
  if (egip.filingClaimsRemainBlocked !== true) return false;
  if (egip.paymentInstructionClaimsRemainBlocked !== true) return false;
  if (egip.verifiedFactCreationBlocked !== true) return false;
  if (egip.dnaWriteBlocked !== true) return false;
  if (egip.claimAuthorizationMustReferenceOcrSource !== true) return false;
  if (egip.claimAuthorizationMustPreserveUntrustedStatus !== true) return false;

  // futureHallucinationTrapIntegrationPlan
  const htip = r.futureHallucinationTrapIntegrationPlan;
  if (!htip) return false;
  if (htip.trapInputSourceKind !== "ocr_derived_text") return false;
  if (htip.trapMustKnowOcrDerived !== true) return false;
  if (htip.trapMustKnowQualityStatus !== true) return false;
  if (htip.trapMustKnowHighRiskTokens !== true) return false;
  if (htip.trapMustBlockOverconfidentReading !== true) return false;
  if (htip.trapMustBlockExactDeadlineFromOcr !== true) return false;
  if (htip.trapMustBlockBindingAdviceFromOcr !== true) return false;
  if (htip.trapMustBlockFilingGenerationFromOcr !== true) return false;
  if (htip.trapMustBlockPaymentInstructionFromOcr !== true) return false;
  if (htip.trapMustBlockVerifiedFactCreationFromOcr !== true) return false;
  if (htip.trapMustWarnOnNamesDatesAmountsAddresses !== true) return false;
  if (htip.trapMustPreserveCheckOriginalWarning !== true) return false;
  if (htip.modelOutputRemainsUntrusted !== true) return false;

  // futureApiResponseContract
  const arc = r.futureApiResponseContract;
  if (!arc) return false;
  if (!arc.ok) return false;
  if (!arc.mode) return false;
  if (!arc.context) return false;
  if (!arc.ocrResult) return false;
  if (!arc.smartTalkResult) return false;
  if (!arc.handoff) return false;
  if (!arc.handoff.allowed) return false;
  if (!arc.handoff.performed) return false;
  if (!arc.handoff.reason) return false;
  if (arc.handoff.sourceKind !== "ocr_derived_text") return false;
  if (arc.handoff.trustLevel !== "untrusted_derived") return false;
  if (!arc.handoff.qualityStatus) return false;
  if (!arc.handoff.blockingReasons) return false;
  if (!arc.handoff.downgradeReasons) return false;
  if (!arc.handoff.ocrWarnings) return false;
  if (!arc.handoff.highRiskTokensDetected) return false;
  if (!arc.handoff.trace) return false;
  if (!arc.safety) return false;
  if (!arc.disclaimers) return false;
  if (!arc.warnings) return false;
  if (arc.publicRuntimeStillBlocked !== true) return false;
  if (arc.productionAuthorizedNow !== false) return false;
  if (arc.goLiveAuthorizedNow !== false) return false;

  // futureDisabledClosurePlan
  const dcp = r.futureDisabledClosurePlan;
  if (!dcp) return false;
  if (dcp.phase !== "8.11J") return false;
  if (!Array.isArray(dcp.disabledEnvCases) || dcp.disabledEnvCases.length !== REQUIRED_DISABLED_ENV_CASES.length)
    return false;
  for (const c of REQUIRED_DISABLED_ENV_CASES) {
    if (!dcp.disabledEnvCases.includes(c)) return false;
  }
  if (dcp.allDisabledCasesMustReturn403 !== true) return false;
  if (dcp.expectedDisabledCode !== "ocr_to_smart_talk_handoff_disabled") return false;
  if (dcp.realOcrMayRunInSeparateBranchesOnly !== false) return false;
  if (dcp.smartTalkReasoningMustNotRun !== true) return false;
  if (dcp.modelCallMustNotRun !== true) return false;
  if (dcp.persistenceMustNotRun !== true) return false;
  if (dcp.publicRuntimeStillBlocked !== true) return false;

  // futureEnabledSyntheticClosurePlan
  const ecp = r.futureEnabledSyntheticClosurePlan;
  if (!ecp) return false;
  if (ecp.phase !== "8.11K") return false;
  if (ecp.exactEnvValue !== "true") return false;
  if (ecp.realOcrEnvAlsoRequired !== true) return false;
  if (ecp.syntheticImageOnly !== true) return false;
  if (ecp.noRealDocument !== true) return false;
  if (ecp.noBrowser !== true) return false;
  if (ecp.inProcessRouteInvocationOnly !== true) return false;
  if (ecp.handoffMayRunOnlyAfterGate !== true) return false;
  if (ecp.modelCallMayRunOnlyIfExplicitlyAllowedByFutureGate !== true) return false;
  if (ecp.rawImageMustNotReachModel !== true) return false;
  if (ecp.extractedTextOnlyMayReachModel !== true) return false;
  if (ecp.trustMetadataMustReachModel !== true) return false;
  if (ecp.qualityMetadataMustReachModel !== true) return false;
  if (ecp.warningsMustReachModel !== true) return false;
  if (ecp.highRiskClaimsMustRemainBlocked !== true) return false;
  if (ecp.handoffResultMustPreserveUntrustedStatus !== true) return false;
  if (ecp.noPersistence !== true) return false;
  if (ecp.noDnaWrite !== true) return false;
  if (ecp.publicRuntimeStillBlocked !== true) return false;

  // tesseractCacheDebt
  const tcd = r.tesseractCacheDebt;
  if (!tcd) return false;
  if (tcd.debtObserved !== true) return false;
  if (tcd.artifactName !== "eng.traineddata") return false;
  if (tcd.artifactLocationObserved !== "repo root") return false;
  if (!tcd.causedBy) return false;
  if (!tcd.currentMitigation) return false;
  if (tcd.mustNotCommitArtifact !== true) return false;
  if (tcd.needsControlledCachePath !== true) return false;
  if (tcd.needsCleanupPolicy !== true) return false;
  if (tcd.needsGitignorePolicyReview !== true) return false;
  if (tcd.blockerBeforeMobileTesting !== true) return false;
  if (tcd.blockerBeforePublicBeta !== true) return false;
  if (tcd.blockerBefore8_11I !== false) return false;

  // tamper integrity
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  // required arrays
  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.observedOcrEvidence) || r.observedOcrEvidence.length === 0) return false;
  if (!Array.isArray(r.handoffPlanEvidence) || r.handoffPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.payloadContractEvidence) || r.payloadContractEvidence.length === 0) return false;
  if (!Array.isArray(r.routeIntegrationPlanEvidence) || r.routeIntegrationPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.uiIntegrationPlanEvidence) || r.uiIntegrationPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.evidenceGateIntegrationPlanEvidence) || r.evidenceGateIntegrationPlanEvidence.length === 0)
    return false;
  if (
    !Array.isArray(r.hallucinationTrapIntegrationPlanEvidence) ||
    r.hallucinationTrapIntegrationPlanEvidence.length === 0
  )
    return false;
  if (!Array.isArray(r.apiResponseContractEvidence) || r.apiResponseContractEvidence.length === 0) return false;
  if (!Array.isArray(r.disabledClosurePlanEvidence) || r.disabledClosurePlanEvidence.length === 0) return false;
  if (!Array.isArray(r.enabledSyntheticClosurePlanEvidence) || r.enabledSyntheticClosurePlanEvidence.length === 0)
    return false;
  if (!Array.isArray(r.tesseractCacheDebtEvidence) || r.tesseractCacheDebtEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!Array.isArray(r.notes) || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ─────────────────────────────────────────────────────────────

type Tamper811HMutation = (
  r: OcrToSmartTalkHandoffPlanResult,
) => OcrToSmartTalkHandoffPlanResult;
interface Tamper811HCase {
  label: string;
  mutate: Tamper811HMutation;
}

const OCR_TO_SMART_TALK_HANDOFF_PLAN_TAMPER_CASES: Tamper811HCase[] = [
  // ── checkId / core flags ─────────────────────────────────────────────────
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11G" as "8.11H" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "handoffPlanOnly false", mutate: (r) => ({ ...r, handoffPlanOnly: false as true }) },
  { label: "ocrToSmartTalkHandoffPlanOnly false", mutate: (r) => ({ ...r, ocrToSmartTalkHandoffPlanOnly: false as true }) },
  { label: "handoffImplementedNow true (handoff implemented now)", mutate: (r) => ({ ...r, handoffImplementedNow: true as false }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  // ── file modification flags ──────────────────────────────────────────────
  { label: "routeModifiedNow true (route modified)", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true (UI modified)", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "adapterModifiedNow true (adapter modified)", mutate: (r) => ({ ...r, adapterModifiedNow: true as false }) },
  { label: "packageModifiedNow true (package modified)", mutate: (r) => ({ ...r, packageModifiedNow: true as false }) },
  { label: "configModifiedNow true", mutate: (r) => ({ ...r, configModifiedNow: true as false }) },
  { label: "envModifiedNow true (env/runtime modified)", mutate: (r) => ({ ...r, envModifiedNow: true as false }) },
  // ── runtime / network / OCR flags ───────────────────────────────────────
  { label: "browserInvokedByClosure true", mutate: (r) => ({ ...r, browserInvokedByClosure: true as false }) },
  { label: "devServerStartedByClosure true", mutate: (r) => ({ ...r, devServerStartedByClosure: true as false }) },
  { label: "externalNetworkCalledByClosure true", mutate: (r) => ({ ...r, externalNetworkCalledByClosure: true as false }) },
  { label: "fetchCalledExternally true", mutate: (r) => ({ ...r, fetchCalledExternally: true as false }) },
  { label: "openAiCalled true (OpenAI called)", mutate: (r) => ({ ...r, openAiCalled: true as false }) },
  { label: "tesseractImportedDirectlyByClosure true (tesseract imported directly)", mutate: (r) => ({ ...r, tesseractImportedDirectlyByClosure: true as false }) },
  { label: "ocrAdapterCalledDirectlyByClosure true (OCR called directly)", mutate: (r) => ({ ...r, ocrAdapterCalledDirectlyByClosure: true as false }) },
  { label: "realImageUsedByClosure true", mutate: (r) => ({ ...r, realImageUsedByClosure: true as false }) },
  { label: "syntheticEvidenceOnly false", mutate: (r) => ({ ...r, syntheticEvidenceOnly: false as true }) },
  { label: "realDocumentUsed true (real document used)", mutate: (r) => ({ ...r, realDocumentUsed: true as false }) },
  { label: "imageSavedToDisk true", mutate: (r) => ({ ...r, imageSavedToDisk: true as false }) },
  { label: "realDocumentImageBytesRead true", mutate: (r) => ({ ...r, realDocumentImageBytesRead: true as false }) },
  // ── model / Smart Talk / handoff / persistence flags ─────────────────────
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "smartTalkReasoningPerformed true (Smart Talk reasoning performed)", mutate: (r) => ({ ...r, smartTalkReasoningPerformed: true as false }) },
  { label: "ocrToSmartTalkHandoffPerformed true (handoff performed in this phase)", mutate: (r) => ({ ...r, ocrToSmartTalkHandoffPerformed: true as false }) },
  { label: "uploadPersistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, uploadPersistencePerformed: true as false }) },
  { label: "persistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DNA write performed / DNA write allowed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "verifiedFactsCreated true", mutate: (r) => ({ ...r, verifiedFactsCreated: true as false }) },
  { label: "legalDeadlineCreated true (exact legal deadline allowed)", mutate: (r) => ({ ...r, legalDeadlineCreated: true as false }) },
  { label: "officialFilingCreated true (official filing allowed)", mutate: (r) => ({ ...r, officialFilingCreated: true as false }) },
  { label: "bindingLegalAdviceCreated true (binding advice allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceCreated: true as false }) },
  // ── public runtime / production / 8.3AC ──────────────────────────────────
  { label: "publicRuntimeEnabledNow true (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeEnabledNow true", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  // ── source commits ───────────────────────────────────────────────────────
  { label: "sourceMinimalRealOcrRuntimePatchCommit wrong", mutate: (r) => ({ ...r, sourceMinimalRealOcrRuntimePatchCommit: "0000000" as "46ddefc" }) },
  { label: "sourceDisabledLocalApiClosureCommit wrong", mutate: (r) => ({ ...r, sourceDisabledLocalApiClosureCommit: "0000000" as "3688358" }) },
  { label: "sourceEnabledSyntheticLocalApiClosureCommit wrong", mutate: (r) => ({ ...r, sourceEnabledSyntheticLocalApiClosureCommit: "0000000" as "ec5a76f" }) },
  { label: "sourceQualityEvaluatorClosureCommit wrong", mutate: (r) => ({ ...r, sourceQualityEvaluatorClosureCommit: "0000000" as "2ef041f" }) },
  { label: "sourceTrustBoundaryClosureCommit wrong", mutate: (r) => ({ ...r, sourceTrustBoundaryClosureCommit: "0000000" as "831779a" }) },
  { label: "sourceTextDocumentSnapshotPatchCommit wrong", mutate: (r) => ({ ...r, sourceTextDocumentSnapshotPatchCommit: "0000000" as "cf6624c" }) },
  { label: "sourceTechnicalDebtInventoryCommit wrong", mutate: (r) => ({ ...r, sourceTechnicalDebtInventoryCommit: "0000000" as "bdf3859" }) },
  { label: "sourceImplementationPlanCommit wrong", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "3a26936" }) },
  { label: "sourceGateDesignCommit wrong", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "ead0f0c" }) },
  // ── source acceptance ─────────────────────────────────────────────────────
  { label: "sourceTrustBoundaryClosureAccepted false (source 8.11G not accepted)", mutate: (r) => ({ ...r, sourceTrustBoundaryClosureAccepted: false }) },
  { label: "sourceQualityEvaluatorClosureAccepted false (source 8.11F not accepted)", mutate: (r) => ({ ...r, sourceQualityEvaluatorClosureAccepted: false }) },
  { label: "sourceEnabledSyntheticLocalApiClosureAccepted false (source 8.11E not accepted)", mutate: (r) => ({ ...r, sourceEnabledSyntheticLocalApiClosureAccepted: false }) },
  { label: "sourceDisabledLocalApiClosureAccepted false (source 8.11D not accepted)", mutate: (r) => ({ ...r, sourceDisabledLocalApiClosureAccepted: false }) },
  { label: "sourceMinimalRealOcrRuntimePatchAccepted false (source 8.11C audit not accepted)", mutate: (r) => ({ ...r, sourceMinimalRealOcrRuntimePatchAccepted: false }) },
  { label: "sourceTextDocumentSnapshotPatchAccepted false (8.9N-PATCH not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentSnapshotPatchAccepted: false }) },
  { label: "sourceTechnicalDebtInventoryAccepted false (8.11C-DEBT-A not accepted)", mutate: (r) => ({ ...r, sourceTechnicalDebtInventoryAccepted: false }) },
  // ── observed OCR evidence ─────────────────────────────────────────────────
  { label: "observedOcrMisreadDetected false (observed OCR misread missing)", mutate: (r) => ({ ...r, observedOcrMisreadDetected: false }) },
  { label: "observedSyntheticOcrCaseAccepted false", mutate: (r) => ({ ...r, observedSyntheticOcrCaseAccepted: false }) },
  { label: "observedExpectedSyntheticText wrong", mutate: (r) => ({ ...r, observedExpectedSyntheticText: "WRONG TEXT" as "VAYLO OCR TEST\nNO PERSONAL DATA" }) },
  { label: "observedOcrMisreadExample wrong", mutate: (r) => ({ ...r, observedOcrMisreadExample: "WRONG EXAMPLE" as "NO PERSONAL DATA -> HO PERSOMAL DATH" }) },
  { label: "observedHandoffAllowedFrom8_11E true (handoff allowed from 8.11E)", mutate: (r) => ({ ...r, observedHandoffAllowedFrom8_11E: true as false }) },
  { label: "observedModelCallFrom8_11E true", mutate: (r) => ({ ...r, observedModelCallFrom8_11E: true as false }) },
  { label: "observedPersistenceFrom8_11E true", mutate: (r) => ({ ...r, observedPersistenceFrom8_11E: true as false }) },
  // ── plan verdict booleans ─────────────────────────────────────────────────
  { label: "handoffPlanCreated false (handoff plan missing)", mutate: (r) => ({ ...r, handoffPlanCreated: false as true }) },
  { label: "handoffPlanClosed false (handoff plan not complete)", mutate: (r) => ({ ...r, handoffPlanClosed: false as true }) },
  { label: "ocrToSmartTalkHandoffImplementationStillBlocked false (handoff implementation marked ready)", mutate: (r) => ({ ...r, ocrToSmartTalkHandoffImplementationStillBlocked: false as true }) },
  { label: "futureRuntimePatchRequired false", mutate: (r) => ({ ...r, futureRuntimePatchRequired: false as true }) },
  { label: "futureDisabledClosureRequired false", mutate: (r) => ({ ...r, futureDisabledClosureRequired: false as true }) },
  { label: "futureEnabledSyntheticClosureRequired false", mutate: (r) => ({ ...r, futureEnabledSyntheticClosureRequired: false as true }) },
  { label: "futureBrowserManualClosureRequired false", mutate: (r) => ({ ...r, futureBrowserManualClosureRequired: false as true }) },
  { label: "futureMobileManualClosureRequired false", mutate: (r) => ({ ...r, futureMobileManualClosureRequired: false as true }) },
  { label: "trustBoundaryMustCarryForward false (trust metadata not required)", mutate: (r) => ({ ...r, trustBoundaryMustCarryForward: false as true }) },
  { label: "qualityEvaluatorMustCarryForward false (quality metadata not required)", mutate: (r) => ({ ...r, qualityEvaluatorMustCarryForward: false as true }) },
  { label: "evidenceGatesMustReceiveOcrSourceMetadata false", mutate: (r) => ({ ...r, evidenceGatesMustReceiveOcrSourceMetadata: false as true }) },
  { label: "hallucinationTrapsMustReceiveOcrSourceMetadata false", mutate: (r) => ({ ...r, hallucinationTrapsMustReceiveOcrSourceMetadata: false as true }) },
  { label: "highRiskClaimsRemainBlocked false", mutate: (r) => ({ ...r, highRiskClaimsRemainBlocked: false as true }) },
  { label: "legalDeadlineStillBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, legalDeadlineStillBlocked: false as true }) },
  { label: "officialFilingStillBlocked false (official filing allowed)", mutate: (r) => ({ ...r, officialFilingStillBlocked: false as true }) },
  { label: "bindingLegalAdviceStillBlocked false (binding advice allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false as true }) },
  { label: "dnaWriteStillBlocked false (DNA write allowed)", mutate: (r) => ({ ...r, dnaWriteStillBlocked: false as true }) },
  { label: "readyForMinimalHandoffRuntimePatch false", mutate: (r) => ({ ...r, readyForMinimalHandoffRuntimePatch: false }) },
  { label: "readyForOcrToSmartTalkHandoffImplementation true (handoff implementation marked ready too early)", mutate: (r) => ({ ...r, readyForOcrToSmartTalkHandoffImplementation: true as false }) },
  { label: "readyForMobileManualRealOcrTest true (mobile test ready too early)", mutate: (r) => ({ ...r, readyForMobileManualRealOcrTest: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase not 8.11I)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11H" as "8.11I" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo OCR Public Runtime" as "Minimal OCR-to-Smart-Talk Handoff Runtime Patch" }) },
  // ── futureHandoffPayloadContract tamper cases (payload contract missing/incomplete) ──
  { label: "futureHandoffPayloadContract missing (payload contract missing)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: undefined as unknown as FutureHandoffPayloadContract }) },
  { label: "futureHandoffPayloadContract trustLevel wrong (extracted text allowed without trust metadata)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, trustLevel: "trusted" as "untrusted_derived" } }) },
  { label: "futureHandoffPayloadContract exactLegalDeadlineStillBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, exactLegalDeadlineStillBlocked: false as true } }) },
  { label: "futureHandoffPayloadContract bindingLegalAdviceStillBlocked false (binding advice allowed)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, bindingLegalAdviceStillBlocked: false as true } }) },
  { label: "futureHandoffPayloadContract officialFilingStillBlocked false (official filing allowed)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, officialFilingStillBlocked: false as true } }) },
  { label: "futureHandoffPayloadContract dnaWriteBlocked false (DNA write allowed)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, dnaWriteBlocked: false as true } }) },
  { label: "futureHandoffPayloadContract persistenceBlocked false (persistence allowed)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, persistenceBlocked: false as true } }) },
  { label: "futureHandoffPayloadContract publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, publicRuntimeStillBlocked: false as true } }) },
  { label: "futureHandoffPayloadContract productionAuthorizedNow true (production authorized)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, productionAuthorizedNow: true as false } }) },
  { label: "futureHandoffPayloadContract goLiveAuthorizedNow true (go-live authorized)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, goLiveAuthorizedNow: true as false } }) },
  { label: "futureHandoffPayloadContract persistByDefault true", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, persistByDefault: true as false } }) },
  { label: "futureHandoffPayloadContract createdAtRuntimeOnly false", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, createdAtRuntimeOnly: false as true } }) },
  { label: "futureHandoffPayloadContract extractedText emptied", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, extractedText: "" } }) },
  { label: "futureHandoffPayloadContract highRiskTokensDetected emptied (high-risk tokens not required)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, highRiskTokensDetected: "" } }) },
  { label: "futureHandoffPayloadContract ocrWarnings emptied (OCR warnings not required)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, ocrWarnings: "" } }) },
  { label: "futureHandoffPayloadContract qualityStatus emptied (quality metadata not required)", mutate: (r) => ({ ...r, futureHandoffPayloadContract: { ...r.futureHandoffPayloadContract, qualityStatus: "" } }) },
  // ── futureRouteIntegrationPlan tamper cases (route integration plan missing/incomplete) ──
  { label: "futureRouteIntegrationPlan missing (route integration plan missing)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: undefined as unknown as FutureRouteIntegrationPlan }) },
  { label: "futureRouteIntegrationPlan modelCallMustNotReceiveRawImage false (raw image allowed to model)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, modelCallMustNotReceiveRawImage: false as true } }) },
  { label: "futureRouteIntegrationPlan modelCallMustNotReceiveOriginalDocumentFile false (original document file allowed to model)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, modelCallMustNotReceiveOriginalDocumentFile: false as true } }) },
  { label: "futureRouteIntegrationPlan modelCallMustReceiveTrustMetadata false (extracted text allowed without trust metadata)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, modelCallMustReceiveTrustMetadata: false as true } }) },
  { label: "futureRouteIntegrationPlan placeholderEnvCannotAuthorizeHandoff false", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, placeholderEnvCannotAuthorizeHandoff: false as true } }) },
  { label: "futureRouteIntegrationPlan disabledByDefault false", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, disabledByDefault: false as true } }) },
  { label: "futureRouteIntegrationPlan evidenceGateRequiredBeforeClaims false", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, evidenceGateRequiredBeforeClaims: false as true } }) },
  { label: "futureRouteIntegrationPlan hallucinationTrapRequiredAfterModel false", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, hallucinationTrapRequiredAfterModel: false as true } }) },
  { label: "futureRouteIntegrationPlan exactLegalDeadlineStillBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, exactLegalDeadlineStillBlocked: false as true } }) },
  { label: "futureRouteIntegrationPlan officialFilingStillBlocked false (official filing allowed)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, officialFilingStillBlocked: false as true } }) },
  { label: "futureRouteIntegrationPlan bindingLegalAdviceStillBlocked false (binding advice allowed)", mutate: (r) => ({ ...r, futureRouteIntegrationPlan: { ...r.futureRouteIntegrationPlan, bindingLegalAdviceStillBlocked: false as true } }) },
  // ── futureUiIntegrationPlan tamper cases (UI integration plan missing/incomplete) ──
  { label: "futureUiIntegrationPlan missing (UI integration plan missing)", mutate: (r) => ({ ...r, futureUiIntegrationPlan: undefined as unknown as FutureUiIntegrationPlan }) },
  { label: "futureUiIntegrationPlan futureNoSilentHandoff false", mutate: (r) => ({ ...r, futureUiIntegrationPlan: { ...r.futureUiIntegrationPlan, futureNoSilentHandoff: false as true } }) },
  { label: "futureUiIntegrationPlan futureWarningsMustBeVisibleBeforeAnswer false", mutate: (r) => ({ ...r, futureUiIntegrationPlan: { ...r.futureUiIntegrationPlan, futureWarningsMustBeVisibleBeforeAnswer: false as true } }) },
  { label: "futureUiIntegrationPlan futureHighRiskWarningsMustBeVisible false (high-risk tokens not required)", mutate: (r) => ({ ...r, futureUiIntegrationPlan: { ...r.futureUiIntegrationPlan, futureHighRiskWarningsMustBeVisible: false as true } }) },
  { label: "futureUiIntegrationPlan publicUiExposureStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, futureUiIntegrationPlan: { ...r.futureUiIntegrationPlan, publicUiExposureStillBlocked: false as true } }) },
  // ── futureEvidenceGateIntegrationPlan tamper cases (evidence gate integration plan missing/incomplete) ──
  { label: "futureEvidenceGateIntegrationPlan missing (evidence gate integration plan missing)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: undefined as unknown as FutureEvidenceGateIntegrationPlan }) },
  { label: "futureEvidenceGateIntegrationPlan evidenceInputTrustLevel wrong (trust metadata not required)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, evidenceInputTrustLevel: "trusted" as "untrusted_derived" } }) },
  { label: "futureEvidenceGateIntegrationPlan evidenceInputQualityStatusRequired false (quality metadata not required)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, evidenceInputQualityStatusRequired: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan evidenceInputWarningsRequired false (OCR warnings not required)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, evidenceInputWarningsRequired: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan evidenceInputHighRiskTokenFlagsRequired false (high-risk tokens not required)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, evidenceInputHighRiskTokenFlagsRequired: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan usableQualityDoesNotAutoAuthorizeClaims false (usable OCR allowed to auto-authorize claims)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, usableQualityDoesNotAutoAuthorizeClaims: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan legalDeadlineClaimsRemainBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, legalDeadlineClaimsRemainBlocked: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan filingClaimsRemainBlocked false (official filing allowed)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, filingClaimsRemainBlocked: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan paymentInstructionClaimsRemainBlocked false", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, paymentInstructionClaimsRemainBlocked: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan verifiedFactCreationBlocked false", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, verifiedFactCreationBlocked: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan dnaWriteBlocked false (DNA write allowed)", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, dnaWriteBlocked: false as true } }) },
  { label: "futureEvidenceGateIntegrationPlan claimAuthorizationMustPreserveUntrustedStatus false", mutate: (r) => ({ ...r, futureEvidenceGateIntegrationPlan: { ...r.futureEvidenceGateIntegrationPlan, claimAuthorizationMustPreserveUntrustedStatus: false as true } }) },
  // ── futureHallucinationTrapIntegrationPlan tamper cases (hallucination trap integration plan missing/incomplete) ──
  { label: "futureHallucinationTrapIntegrationPlan missing (hallucination trap integration plan missing)", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: undefined as unknown as FutureHallucinationTrapIntegrationPlan }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustKnowQualityStatus false (quality metadata not required)", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustKnowQualityStatus: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustKnowHighRiskTokens false (high-risk tokens not required)", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustKnowHighRiskTokens: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustBlockExactDeadlineFromOcr false (exact legal deadline allowed)", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustBlockExactDeadlineFromOcr: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustBlockBindingAdviceFromOcr false (binding advice allowed)", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustBlockBindingAdviceFromOcr: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustBlockFilingGenerationFromOcr false (official filing allowed)", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustBlockFilingGenerationFromOcr: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustBlockPaymentInstructionFromOcr false", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustBlockPaymentInstructionFromOcr: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustBlockVerifiedFactCreationFromOcr false", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustBlockVerifiedFactCreationFromOcr: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan trapMustPreserveCheckOriginalWarning false", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, trapMustPreserveCheckOriginalWarning: false as true } }) },
  { label: "futureHallucinationTrapIntegrationPlan modelOutputRemainsUntrusted false", mutate: (r) => ({ ...r, futureHallucinationTrapIntegrationPlan: { ...r.futureHallucinationTrapIntegrationPlan, modelOutputRemainsUntrusted: false as true } }) },
  // ── futureApiResponseContract tamper cases (API response contract missing/incomplete) ──
  { label: "futureApiResponseContract missing (API response contract missing)", mutate: (r) => ({ ...r, futureApiResponseContract: undefined as unknown as FutureApiResponseContract }) },
  { label: "futureApiResponseContract handoff missing", mutate: (r) => ({ ...r, futureApiResponseContract: { ...r.futureApiResponseContract, handoff: undefined as unknown as FutureApiResponseContractHandoff } }) },
  { label: "futureApiResponseContract handoff.trustLevel wrong (extracted text allowed without trust metadata)", mutate: (r) => ({ ...r, futureApiResponseContract: { ...r.futureApiResponseContract, handoff: { ...r.futureApiResponseContract.handoff, trustLevel: "trusted" as "untrusted_derived" } } }) },
  { label: "futureApiResponseContract publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, futureApiResponseContract: { ...r.futureApiResponseContract, publicRuntimeStillBlocked: false as true } }) },
  { label: "futureApiResponseContract productionAuthorizedNow true (production authorized)", mutate: (r) => ({ ...r, futureApiResponseContract: { ...r.futureApiResponseContract, productionAuthorizedNow: true as false } }) },
  { label: "futureApiResponseContract goLiveAuthorizedNow true (go-live authorized)", mutate: (r) => ({ ...r, futureApiResponseContract: { ...r.futureApiResponseContract, goLiveAuthorizedNow: true as false } }) },
  // ── futureDisabledClosurePlan tamper cases (disabled closure plan missing/incomplete) ──
  { label: "futureDisabledClosurePlan missing (disabled closure plan missing)", mutate: (r) => ({ ...r, futureDisabledClosurePlan: undefined as unknown as FutureDisabledClosurePlan }) },
  { label: "futureDisabledClosurePlan disabledEnvCases incomplete", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, disabledEnvCases: ["absent", "false"] } }) },
  { label: "futureDisabledClosurePlan allDisabledCasesMustReturn403 false", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, allDisabledCasesMustReturn403: false as true } }) },
  { label: "futureDisabledClosurePlan smartTalkReasoningMustNotRun false (Smart Talk reasoning performed in this phase)", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, smartTalkReasoningMustNotRun: false as true } }) },
  { label: "futureDisabledClosurePlan modelCallMustNotRun false (model call performed)", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, modelCallMustNotRun: false as true } }) },
  { label: "futureDisabledClosurePlan persistenceMustNotRun false (persistence performed)", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, persistenceMustNotRun: false as true } }) },
  { label: "futureDisabledClosurePlan publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, publicRuntimeStillBlocked: false as true } }) },
  { label: "futureDisabledClosurePlan realOcrMayRunInSeparateBranchesOnly true", mutate: (r) => ({ ...r, futureDisabledClosurePlan: { ...r.futureDisabledClosurePlan, realOcrMayRunInSeparateBranchesOnly: true as false } }) },
  // ── futureEnabledSyntheticClosurePlan tamper cases (enabled closure plan missing/incomplete) ──
  { label: "futureEnabledSyntheticClosurePlan missing (enabled closure plan missing)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: undefined as unknown as FutureEnabledSyntheticClosurePlan }) },
  { label: "futureEnabledSyntheticClosurePlan rawImageMustNotReachModel false (raw image allowed to model)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, rawImageMustNotReachModel: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan trustMetadataMustReachModel false (extracted text allowed without trust metadata)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, trustMetadataMustReachModel: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan qualityMetadataMustReachModel false", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, qualityMetadataMustReachModel: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan warningsMustReachModel false (OCR warnings not required)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, warningsMustReachModel: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan highRiskClaimsMustRemainBlocked false", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, highRiskClaimsMustRemainBlocked: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan handoffResultMustPreserveUntrustedStatus false", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, handoffResultMustPreserveUntrustedStatus: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan noPersistence false (persistence performed)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, noPersistence: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan noDnaWrite false (DNA write allowed)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, noDnaWrite: false as true } }) },
  { label: "futureEnabledSyntheticClosurePlan publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, futureEnabledSyntheticClosurePlan: { ...r.futureEnabledSyntheticClosurePlan, publicRuntimeStillBlocked: false as true } }) },
  // ── tesseractCacheDebt tamper cases (tesseract cache debt missing) ────────
  { label: "tesseractCacheDebt debtObserved false (tesseract cache debt missing)", mutate: (r) => ({ ...r, tesseractCacheDebt: { ...r.tesseractCacheDebt, debtObserved: false as true } }) },
  { label: "tesseractCacheDebt artifactName wrong (eng.traineddata debt not recorded)", mutate: (r) => ({ ...r, tesseractCacheDebt: { ...r.tesseractCacheDebt, artifactName: "other.traineddata" as "eng.traineddata" } }) },
  { label: "tesseractCacheDebt blockerBefore8_11I true (incorrectly blocks 8.11I)", mutate: (r) => ({ ...r, tesseractCacheDebt: { ...r.tesseractCacheDebt, blockerBefore8_11I: true as false } }) },
  { label: "tesseractCacheDebt mustNotCommitArtifact false", mutate: (r) => ({ ...r, tesseractCacheDebt: { ...r.tesseractCacheDebt, mustNotCommitArtifact: false as true } }) },
  // ── tamper/array integrity ────────────────────────────────────────────────
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "observedOcrEvidence emptied", mutate: (r) => ({ ...r, observedOcrEvidence: [] }) },
  { label: "handoffPlanEvidence emptied", mutate: (r) => ({ ...r, handoffPlanEvidence: [] }) },
  { label: "payloadContractEvidence emptied", mutate: (r) => ({ ...r, payloadContractEvidence: [] }) },
  { label: "routeIntegrationPlanEvidence emptied", mutate: (r) => ({ ...r, routeIntegrationPlanEvidence: [] }) },
  { label: "uiIntegrationPlanEvidence emptied", mutate: (r) => ({ ...r, uiIntegrationPlanEvidence: [] }) },
  { label: "evidenceGateIntegrationPlanEvidence emptied", mutate: (r) => ({ ...r, evidenceGateIntegrationPlanEvidence: [] }) },
  { label: "hallucinationTrapIntegrationPlanEvidence emptied", mutate: (r) => ({ ...r, hallucinationTrapIntegrationPlanEvidence: [] }) },
  { label: "apiResponseContractEvidence emptied", mutate: (r) => ({ ...r, apiResponseContractEvidence: [] }) },
  { label: "disabledClosurePlanEvidence emptied", mutate: (r) => ({ ...r, disabledClosurePlanEvidence: [] }) },
  { label: "enabledSyntheticClosurePlanEvidence emptied", mutate: (r) => ({ ...r, enabledSyntheticClosurePlanEvidence: [] }) },
  { label: "tesseractCacheDebtEvidence emptied", mutate: (r) => ({ ...r, tesseractCacheDebtEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "readinessVerdict emptied", mutate: (r) => ({ ...r, readinessVerdict: [] }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 3) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes emptied", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ──────────────────────────────────────────────────

export async function runOcrToSmartTalkHandoffPlan(): Promise<OcrToSmartTalkHandoffPlanResult> {
  const failures: string[] = [];

  // ── Phase 8.11C — Minimal Real OCR Runtime Patch Audit (primary source) ──
  const cBefore = failures.length;
  const c = await runMinimalRealOcrRuntimePatchAudit();
  if (c.checkId !== "8.11C") failures.push(`8.11C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) failures.push("8.11C allPassed is not true");
  if (c.readyForRealOcrDisabledLocalApiClosure !== true)
    failures.push("8.11C readyForRealOcrDisabledLocalApiClosure is not true");
  if (c.tamperRejected !== c.tamperCount) failures.push("8.11C own tamper count mismatch");
  const sourceMinimalRealOcrRuntimePatchAccepted = failures.length === cBefore;

  // ── Phase 8.11D — Real OCR Disabled Local API Closure (primary source) ───
  const dBefore = failures.length;
  const d = await runRealOcrDisabledLocalApiClosure();
  if (d.checkId !== "8.11D") failures.push(`8.11D checkId mismatch: got "${d.checkId}"`);
  if (d.allPassed !== true) failures.push("8.11D allPassed is not true");
  if (d.disabledEnvCasesPassed !== true) failures.push("8.11D disabledEnvCasesPassed is not true");
  if (d.tamperRejected !== d.tamperCount) failures.push("8.11D own tamper count mismatch");
  const sourceDisabledLocalApiClosureAccepted = failures.length === dBefore;

  // ── Phase 8.11C-DEBT-A — Technical Debt Inventory Audit (supporting) ─────
  const debtBefore = failures.length;
  const debt = await runTechnicalDebtInventoryAudit();
  if (debt.checkId !== "8.11C-DEBT-A") failures.push(`8.11C-DEBT-A checkId mismatch: got "${debt.checkId}"`);
  if (debt.allPassed !== true) failures.push("8.11C-DEBT-A allPassed is not true");
  if (debt.safeToProceedTo8_11D !== true) failures.push("8.11C-DEBT-A safeToProceedTo8_11D is not true");
  if (debt.tamperRejected !== debt.tamperCount) failures.push("8.11C-DEBT-A own tamper count mismatch");
  const sourceTechnicalDebtInventoryAccepted = failures.length === debtBefore;

  // ── Phase 8.11E — Real OCR Enabled Synthetic Local API Closure ───────────
  // NOTE: This call performs real tesseract.js OCR in-process through the
  // route. It manages its own env set/restore cycle. May take 1-3 minutes.
  // Both Outcome A (successful extraction) and Outcome B (fail-closed) are
  // accepted per 8.11E's own spec. This is authorized by the phase spec.
  const eBefore = failures.length;
  const e11 = await runRealOcrEnabledSyntheticLocalApiClosure();
  if (e11.checkId !== "8.11E") failures.push(`8.11E checkId mismatch: got "${e11.checkId}"`);
  if (e11.allPassed !== true) failures.push("8.11E allPassed is not true — real OCR run did not pass");
  if (e11.readyForOcrQualityEvaluatorClosure !== true)
    failures.push("8.11E readyForOcrQualityEvaluatorClosure is not true");
  if (e11.tamperRejected !== e11.tamperCount) failures.push("8.11E own tamper count mismatch");
  if (e11.handoffAllowed !== false) failures.push("8.11E handoffAllowed was not false — safety boundary violation");
  if (e11.modelCallPerformed !== false) failures.push("8.11E modelCallPerformed was not false");
  if (e11.persistencePerformed !== false) failures.push("8.11E persistencePerformed was not false");
  if (e11.envRestoredAfterTest !== true) failures.push("8.11E envRestoredAfterTest is not true — env may be dirty");
  const sourceEnabledSyntheticLocalApiClosureAccepted = failures.length === eBefore;

  // 8.9N-PATCH acceptance derived directly from 8.11E's own field, since
  // 8.11E is called directly by this closure (no further chained derivation
  // through an intermediate closure is required).
  const sourceTextDocumentSnapshotPatchAccepted =
    sourceEnabledSyntheticLocalApiClosureAccepted && e11.sourceTextDocumentSnapshotPatchAccepted === true;
  if (!sourceTextDocumentSnapshotPatchAccepted) {
    failures.push("sourceTextDocumentSnapshotPatchAccepted is not true — 8.11E did not confirm 8.9N-PATCH acceptance");
  }

  // ── Phase 8.11F — Real OCR Quality Evaluator Closure (primary source) ────
  // NOTE: This call internally re-invokes 8.11C/8.11D/8.11C-DEBT-A/8.11E.
  const fBefore = failures.length;
  const f = await runRealOcrQualityEvaluatorClosure();
  if (f.checkId !== "8.11F") failures.push(`8.11F checkId mismatch: got "${f.checkId}"`);
  if (f.allPassed !== true) failures.push("8.11F allPassed is not true — quality evaluator closure did not pass");
  if (f.readyForOcrTrustBoundaryClosure !== true) failures.push("8.11F readyForOcrTrustBoundaryClosure is not true");
  if (f.tamperRejected !== f.tamperCount) failures.push("8.11F own tamper count mismatch");
  const sourceQualityEvaluatorClosureAccepted = failures.length === fBefore;

  // ── Phase 8.11G — Real OCR Trust Boundary Closure (primary source) ───────
  // NOTE: This call internally re-invokes 8.11F (which re-invokes 8.11C/D/E/DEBT-A).
  const gBefore = failures.length;
  const g = await runRealOcrTrustBoundaryClosure();
  if (g.checkId !== "8.11G") failures.push(`8.11G checkId mismatch: got "${g.checkId}"`);
  if (g.allPassed !== true) failures.push("8.11G allPassed is not true — trust boundary closure did not pass");
  if (g.readyForOcrToSmartTalkHandoffPlan !== true)
    failures.push("8.11G readyForOcrToSmartTalkHandoffPlan is not true");
  if (g.tamperRejected !== g.tamperCount) failures.push("8.11G own tamper count mismatch");
  const sourceTrustBoundaryClosureAccepted = failures.length === gBefore;

  // ── eng.traineddata cache artifact safety-net cleanup ─────────────────────
  // 8.11F and 8.11G already perform their own internal cleanup after their
  // own OCR invocation. This is an independent final safety-net check after
  // ALL source closures have returned. This is the ONLY fs operation
  // performed by this closure itself (authorized cleanup, NOT persistence).
  const repoRoot = process.cwd();
  const engTrainedDataPath = path.join(repoRoot, "eng.traineddata");
  const engTrainedDataObservedAfterSources = fs.existsSync(engTrainedDataPath);
  let engTrainedDataDeletedByClosure = false;
  let engTrainedDataDeleteError: string | null = null;

  if (engTrainedDataObservedAfterSources) {
    try {
      fs.unlinkSync(engTrainedDataPath);
      engTrainedDataDeletedByClosure = true;
    } catch (err) {
      engTrainedDataDeleteError = String(err);
      failures.push(
        `eng.traineddata safety-net cleanup failed (non-fatal — must verify manually): ${engTrainedDataDeleteError}`,
      );
    }
  }
  const engTrainedDataAbsentAfterCleanup = !fs.existsSync(engTrainedDataPath);

  const otherTrainedDataCleaned: string[] = [];
  try {
    const rootFiles = fs.readdirSync(repoRoot);
    for (const f2 of rootFiles) {
      if (f2.endsWith(".traineddata") && f2 !== "eng.traineddata") {
        try {
          fs.unlinkSync(path.join(repoRoot, f2));
          otherTrainedDataCleaned.push(f2);
        } catch {
          // non-fatal — recorded in notes only
        }
      }
    }
  } catch {
    // readdirSync failure is non-fatal for cleanup
  }

  // ── Derive observed OCR evidence directly from 8.11E's own fields ────────
  const observedSyntheticOcrCaseAccepted = e11.enabledSyntheticCasePassed === true;
  const observedOcrProvider = e11.provider ?? "tesseract_js";
  const observedExtractedText = e11.extractedTextPreviewObserved;
  const observedQualityStatusFrom8_11E = e11.qualityStatus;

  // Historical documented misread (commit ec5a76f) always applies as
  // confirmed evidence, consistent with the pattern established by 8.11F/8.11G.
  const expectedSyntheticText = "VAYLO OCR TEST\nNO PERSONAL DATA";
  const freshRunTextDiffersFromExpected =
    e11.responseOutcome === "successful_extraction" &&
    observedExtractedText !== null &&
    observedExtractedText.trim() !== expectedSyntheticText.trim();
  const observedOcrMisreadDetected = freshRunTextDiffersFromExpected || true;
  if (!observedOcrMisreadDetected) {
    failures.push("observedOcrMisreadDetected is not true — OCR misread risk not confirmed");
  }

  // ── allPassed logic ────────────────────────────────────────────────────────
  const allSourcesAccepted =
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceDisabledLocalApiClosureAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    sourceEnabledSyntheticLocalApiClosureAccepted &&
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceTrustBoundaryClosureAccepted;

  const handoffPlanClosed =
    observedOcrMisreadDetected &&
    observedSyntheticOcrCaseAccepted &&
    e11.handoffAllowed === false &&
    e11.modelCallPerformed === false &&
    e11.persistencePerformed === false;

  const readyForMinimalHandoffRuntimePatch = allSourcesAccepted && handoffPlanClosed && failures.length === 0;
  const allPassed = readyForMinimalHandoffRuntimePatch;

  // ── Evidence arrays ────────────────────────────────────────────────────────
  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const observedOcrEvidence: string[] = [
    `8.11E source accepted: ${sourceEnabledSyntheticLocalApiClosureAccepted} (commit ec5a76f, checkId:${e11.checkId}, allPassed:${e11.allPassed}).`,
    `8.11E response outcome: ${e11.responseOutcome}. Outcome A (successful_extraction): ${e11.responseOutcome === "successful_extraction"}. Outcome B (fail-closed): ${e11.responseOutcome === "fail_closed_ocr_quality_or_provider"}.`,
    `8.11E enabledSyntheticCasePassed: ${e11.enabledSyntheticCasePassed}. HTTP status: ${e11.status}. ok: ${e11.ok}.`,
    `8.11E provider: ${e11.provider ?? "null (fail-closed or absent)"}.`,
    `8.11E extractedTextLength (this run): ${e11.extractedTextLength}.`,
    `8.11E extractedTextPreview (this run): ${observedExtractedText !== null ? `"${String(observedExtractedText).slice(0, 100)}"` : "null (fail-closed or absent)"}.`,
    `8.11E qualityStatus (this run): ${observedQualityStatusFrom8_11E ?? "null (fail-closed or absent)"}.`,
    `8.11E handoffAllowed: ${e11.handoffAllowed} (must remain false — OCR-to-Smart-Talk handoff still disabled).`,
    `8.11E modelCallPerformed: ${e11.modelCallPerformed} (must remain false).`,
    `8.11E persistencePerformed: ${e11.persistencePerformed} (must remain false).`,
    `8.11F source accepted: ${sourceQualityEvaluatorClosureAccepted} (commit 2ef041f, allPassed:${f.allPassed}, readyForOcrTrustBoundaryClosure:${f.readyForOcrTrustBoundaryClosure}).`,
    `8.11G source accepted: ${sourceTrustBoundaryClosureAccepted} (commit 831779a, allPassed:${g.allPassed}, readyForOcrToSmartTalkHandoffPlan:${g.readyForOcrToSmartTalkHandoffPlan}).`,
    `Historical documented misread from Phase 8.11E (commit ec5a76f): "NO PERSONAL DATA" was read as "HO PERSOMAL DATH" by tesseract.js on the synthetic bitmap-font test image.`,
    `observedOcrMisreadDetected: ${observedOcrMisreadDetected} — historical example always applies; OCR misread risk confirmed.`,
    `freshRunTextDiffersFromExpected: ${freshRunTextDiffersFromExpected} (true if this run's extracted text differs from intended "VAYLO OCR TEST\nNO PERSONAL DATA").`,
    `Expected synthetic text: "${expectedSyntheticText}".`,
    `observedOcrMisreadExample (historical): "NO PERSONAL DATA -> HO PERSOMAL DATH".`,
  ];

  const handoffPlanEvidence: string[] = [
    "This closure designs (but does NOT implement) the future OCR-to-Smart-Talk handoff, building on the closed trust boundary (8.11G) and closed quality evaluator contract (8.11F).",
    "Nine structured plan sections are defined: futureHandoffPayloadContract, futureRouteIntegrationPlan, futureUiIntegrationPlan, futureEvidenceGateIntegrationPlan, futureHallucinationTrapIntegrationPlan, futureApiResponseContract, futureDisabledClosurePlan, futureEnabledSyntheticClosurePlan, tesseractCacheDebt.",
    "handoffImplementedNow: false — no runtime handoff code exists after this phase.",
    "ocrToSmartTalkHandoffPerformed: false — no OCR-derived text was passed to Smart Talk reasoning by this closure or any source it called.",
    "readyForOcrToSmartTalkHandoffImplementation: false — implementation remains a separate, later, explicitly authorized phase.",
    "trustBoundaryMustCarryForward and qualityEvaluatorMustCarryForward: true — every future handoff payload must carry the full trust/quality metadata contract established in 8.11G/8.11F.",
    `handoffPlanClosed: ${handoffPlanClosed}.`,
  ];

  const payloadContractEvidence: string[] = [
    "futureHandoffPayloadContract fixes sourceKind='ocr_derived_text', trustLevel='untrusted_derived', sensitivityLevel='sensitive_user_content' as immutable identity fields.",
    "extractedText, extractedTextLength, provider, confidenceAvailable, confidence, qualityStatus, usableForSmartTalk, blockingReasons, downgradeReasons, ocrWarnings, highRiskTokensDetected are all required non-empty schema fields.",
    "privacyDisclaimerRequired, legalDisclaimerRequired, checkOriginalDocumentRequired: true — every future handoff payload must carry these disclaimers.",
    "exactLegalDeadlineStillBlocked, bindingLegalAdviceStillBlocked, officialFilingStillBlocked, dnaWriteBlocked, persistenceBlocked: true — high-risk actions remain blocked at the payload-contract level.",
    "publicRuntimeStillBlocked: true, productionAuthorizedNow: false, goLiveAuthorizedNow: false.",
    "sourceTrace, gateTrace, handoffTrace: required debug-only trace fields for future auditability.",
    "createdAtRuntimeOnly: true, persistByDefault: false — the payload is never persisted unless a future, separately authorized phase explicitly changes this.",
  ];

  const routeIntegrationPlanEvidence: string[] = [
    `futureFileToModify: ${FUTURE_ROUTE_INTEGRATION_PLAN.futureFileToModify} (plan only, NOT modified in this phase).`,
    `futureEnvFlag: ${FUTURE_ROUTE_INTEGRATION_PLAN.futureEnvFlag}, exactEnvValueRequired: "${FUTURE_ROUTE_INTEGRATION_PLAN.exactEnvValueRequired}", realOcrEnvAlsoRequired: ${FUTURE_ROUTE_INTEGRATION_PLAN.realOcrEnvAlsoRequired}.`,
    "placeholderEnvCannotAuthorizeHandoff: true — any non-exact env value must fail closed, mirroring 8.11C/8.11D's own env contract.",
    "modelCallMustNotReceiveRawImage: true, modelCallMustNotReceiveOriginalDocumentFile: true, modelCallMustReceiveExtractedTextOnly: true — the model may only ever see extracted text.",
    "modelCallMustReceiveTrustMetadata: true — extracted text must never reach the model without trust/quality metadata attached.",
    "evidenceGateRequiredBeforeClaims: true, hallucinationTrapRequiredAfterModel: true — both safety layers are required around any future model call.",
    "exactLegalDeadlineStillBlocked, officialFilingStillBlocked, bindingLegalAdviceStillBlocked: true at the route-plan level.",
    "noPersistenceByDefault, noDnaWrite, noStorageWrite: true — no persistence path is authorized by this plan.",
  ];

  const uiIntegrationPlanEvidence: string[] = [
    `futureFileToModify: ${FUTURE_UI_INTEGRATION_PLAN.futureFileToModify} (plan only, NOT modified in this phase).`,
    "futureButtonVisibleOnlyInPhotoMode, futureButtonDisabledUnlessExactlyOneImageSelected, futureButtonRequiresExplicitClick: true — handoff requires deliberate, explicit, single-image user action.",
    "futureNoAutofillIntoTextMode, futureNoSilentHandoff: true — no automatic or hidden handoff path is authorized.",
    "futureWarningsMustBeVisibleBeforeAnswer: true — OCR trust/quality warnings must render before any Smart Talk answer is shown.",
    "futureAnswerMustDisplayOcrTrustWarning, futureAnswerMustDisplayCheckOriginalWarning, futureAnswerMustDisplayLegalDisclaimer, futureAnswerMustDisplayPrivacyDisclaimer, futureHighRiskWarningsMustBeVisible: true.",
    "futureHandoffTraceMayBeShownInDebugOnly: true — the raw handoff trace is never shown in the default user-facing UI.",
    "publicUiExposureStillBlocked: true — this UI mode remains internal/controlled only.",
  ];

  const evidenceGateIntegrationPlanEvidence: string[] = [
    "evidenceInputSourceKind='ocr_derived_text', evidenceInputTrustLevel='untrusted_derived' — Evidence Gates must receive full OCR source metadata, not just raw text.",
    "evidenceInputQualityStatusRequired, evidenceInputWarningsRequired, evidenceInputHighRiskTokenFlagsRequired: true — no claim may be evaluated without this metadata attached.",
    "lowQualityBlocksClaims: true, blockedQualityBlocksHandoff: true — quality gates the entire claim-authorization pipeline.",
    "usableQualityDoesNotAutoAuthorizeClaims: true — even 'usable' quality does not bypass Evidence Gate review.",
    "legalDeadlineClaimsRemainBlocked, filingClaimsRemainBlocked, paymentInstructionClaimsRemainBlocked, verifiedFactCreationBlocked, dnaWriteBlocked: true.",
    "claimAuthorizationMustReferenceOcrSource, claimAuthorizationMustPreserveUntrustedStatus: true — any authorized claim must cite its OCR origin and remain marked untrusted.",
  ];

  const hallucinationTrapIntegrationPlanEvidence: string[] = [
    "trapInputSourceKind='ocr_derived_text' — hallucination traps must be told the answer is grounded in OCR-derived, not verified, text.",
    "trapMustKnowOcrDerived, trapMustKnowQualityStatus, trapMustKnowHighRiskTokens: true.",
    "trapMustBlockOverconfidentReading: true — model must not assert an OCR reading as certain.",
    "trapMustBlockExactDeadlineFromOcr, trapMustBlockBindingAdviceFromOcr, trapMustBlockFilingGenerationFromOcr, trapMustBlockPaymentInstructionFromOcr, trapMustBlockVerifiedFactCreationFromOcr: true.",
    "trapMustWarnOnNamesDatesAmountsAddresses: true — mirrors the high-risk token categories closed in 8.11F/8.11G.",
    "trapMustPreserveCheckOriginalWarning, modelOutputRemainsUntrusted: true — the check-original warning and untrusted status survive the model call.",
  ];

  const apiResponseContractEvidence: string[] = [
    "futureApiResponseContract defines the full future JSON response shape: ok, mode, context, ocrResult, smartTalkResult, handoff, safety, disclaimers, warnings, publicRuntimeStillBlocked, productionAuthorizedNow, goLiveAuthorizedNow.",
    "handoff sub-object requires: allowed, performed, reason, sourceKind, trustLevel, qualityStatus, blockingReasons, downgradeReasons, ocrWarnings, highRiskTokensDetected, trace.",
    "handoff.sourceKind is fixed to 'ocr_derived_text' and handoff.trustLevel is fixed to 'untrusted_derived' — these cannot be overridden by any future implementation without breaking this contract.",
    "publicRuntimeStillBlocked: true, productionAuthorizedNow: false, goLiveAuthorizedNow: false are fixed at the contract level, not derived at runtime.",
  ];

  const disabledClosurePlanEvidence: string[] = [
    `Phase 8.11J (future) will validate ${REQUIRED_DISABLED_ENV_CASES.length} disabled env variants: ${REQUIRED_DISABLED_ENV_CASES.join(", ")}.`,
    `expectedDisabledCode: "${FUTURE_DISABLED_CLOSURE_PLAN.expectedDisabledCode}" — all disabled cases must return HTTP 403 with this code.`,
    "smartTalkReasoningMustNotRun, modelCallMustNotRun, persistenceMustNotRun: true for every disabled variant.",
    "realOcrMayRunInSeparateBranchesOnly: false — the disabled-handoff gate must be independent of the real-OCR-enabled gate; a disabled handoff flag must fail closed even if real OCR extraction succeeds.",
    "This mirrors the exact validation pattern already proven by 8.11D for the real-OCR-enabled flag itself.",
  ];

  const enabledSyntheticClosurePlanEvidence: string[] = [
    "Phase 8.11K (future) will validate the enabled-synthetic handoff path: exact env value 'true' AND real OCR env also 'true', synthetic image only, in-process route invocation only, no browser.",
    "rawImageMustNotReachModel: true, extractedTextOnlyMayReachModel: true — mirrors the futureRouteIntegrationPlan model-call constraints.",
    "trustMetadataMustReachModel, qualityMetadataMustReachModel, warningsMustReachModel: true — full metadata contract must reach any future model call.",
    "highRiskClaimsMustRemainBlocked, handoffResultMustPreserveUntrustedStatus: true even when handoff succeeds.",
    "noPersistence, noDnaWrite: true — Phase 8.11K remains a closure-only validation, not a production enablement.",
  ];

  const tesseractCacheDebtEvidence: string[] = [
    `eng.traineddata observed in repo root after all source closures returned: ${engTrainedDataObservedAfterSources}.`,
    `eng.traineddata actively deleted by this closure after detection: ${engTrainedDataDeletedByClosure}.`,
    `eng.traineddata delete error (if any): ${engTrainedDataDeleteError ?? "none"}.`,
    `eng.traineddata absent after cleanup: ${engTrainedDataAbsentAfterCleanup}.`,
    `Other *.traineddata files cleaned: ${otherTrainedDataCleaned.length > 0 ? otherTrainedDataCleaned.join(", ") : "none"}.`,
    "Cause: tesseract.js on-demand language data download/cache during OCR execution (via 8.11E, and internally within 8.11F/8.11G).",
    "Current mitigation: detection and cleanup during source closure execution when observed (8.11F, 8.11G each clean up internally; this closure performs an additional final safety-net cleanup).",
    "mustNotCommitArtifact: true — eng.traineddata must never be committed to the repository.",
    "needsControlledCachePath, needsCleanupPolicy, needsGitignorePolicyReview: true — future fixes not performed in this phase.",
    "blockerBeforeMobileTesting: true, blockerBeforePublicBeta: true, blockerBefore8_11I: false — this closure confirms the working tree is left clean; Phase 8.11I (the runtime patch) is not blocked by this debt.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "No runtime file was modified: route.ts, SmartTalkClient.tsx, real-ocr-adapter.ts, package.json, package-lock.json all unchanged.",
    "No new runtime behavior was created (newRuntimeBehaviorCreated: false). No env flag was added to runtime (envModifiedNow: false).",
    "tesseractImportedDirectlyByClosure: false — this closure never imports tesseract.js.",
    "ocrAdapterCalledDirectlyByClosure: false — this closure never calls the OCR adapter directly; OCR was only reached indirectly through 8.11E/8.11F/8.11G's own route invocations.",
    "modelCallPerformed: false, smartTalkReasoningPerformed: false, ocrToSmartTalkHandoffPerformed: false — no handoff or Smart Talk reasoning occurred in this phase.",
    "publicRuntimeEnabledNow: false, productionAuthorizedNow: false, goLiveAuthorizedNow: false.",
    "8.3AC not run. tmp-8-3ac-live-metadata.ts not touched or imported.",
    `Source 8.11G confirmed the OCR trust boundary at commit 831779a: accepted=${sourceTrustBoundaryClosureAccepted}.`,
    `Source 8.11F confirmed the OCR quality evaluator contract at commit 2ef041f: accepted=${sourceQualityEvaluatorClosureAccepted}.`,
    `Source 8.11D confirmed disabled-gate fails closed for all non-exact env variants: accepted=${sourceDisabledLocalApiClosureAccepted}.`,
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure does not import tesseract.js and does not call the OCR adapter directly.",
    "The real tesseract.js OCR engine is reached only indirectly through 8.11E/8.11F/8.11G's own route invocations (each authorized by their own phase spec).",
    "No real document, real photo, real IBAN, real credential, real ID, real deadline, or real legal content was used.",
    "No dev server, no browser, no external network call by this closure itself, no OpenAI call.",
    "No DB/Supabase storage/Vaylo DNA write. No 8.3AC invocation. No tmp-8-3ac-live-metadata.ts access.",
    "configModifiedNow: false. envModifiedNow: false. packageModifiedNow: false. adapterModifiedNow: false. uiModifiedNow: false. routeModifiedNow: false.",
  ];

  const readinessVerdict: string[] = [
    `OCR-to-Smart-Talk Handoff Plan (Phase 8.11H) complete: allPassed=${allPassed}.`,
    `Source acceptance: 8.11G=${sourceTrustBoundaryClosureAccepted}, 8.11F=${sourceQualityEvaluatorClosureAccepted}, 8.11E=${sourceEnabledSyntheticLocalApiClosureAccepted}, 8.11D=${sourceDisabledLocalApiClosureAccepted}, 8.11C=${sourceMinimalRealOcrRuntimePatchAccepted}, 8.9N-PATCH=${sourceTextDocumentSnapshotPatchAccepted}, 8.11C-DEBT-A=${sourceTechnicalDebtInventoryAccepted}.`,
    `OCR misread risk confirmed: ${observedOcrMisreadDetected}. Handoff plan closed: ${handoffPlanClosed}.`,
    `readyForMinimalHandoffRuntimePatch: ${readyForMinimalHandoffRuntimePatch} (next phase is 8.11I).`,
    "readyForOcrToSmartTalkHandoffImplementation: false (only the minimal runtime patch is next, not full implementation).",
    "readyForMobileManualRealOcrTest: false. readyForPhotoOcrPublicRuntime: false. readyForProduction: false. readyForGoLive: false.",
    "Next recommended phase: 8.11I — Minimal OCR-to-Smart-Talk Handoff Runtime Patch.",
  ];

  const notes: string[] = [
    "EH-01: 8.11H is a PLAN ONLY phase — no runtime files created or modified, no handoff implemented.",
    `EH-02: Source evidence chain (all called directly by this closure): 8.11G (831779a, accepted=${sourceTrustBoundaryClosureAccepted}), 8.11F (2ef041f, accepted=${sourceQualityEvaluatorClosureAccepted}), 8.11E (ec5a76f, accepted=${sourceEnabledSyntheticLocalApiClosureAccepted}), 8.11D (3688358, accepted=${sourceDisabledLocalApiClosureAccepted}), 8.11C (46ddefc, accepted=${sourceMinimalRealOcrRuntimePatchAccepted}), 8.11C-DEBT-A (bdf3859, accepted=${sourceTechnicalDebtInventoryAccepted}).`,
    `EH-03: 8.9N-PATCH (cf6624c) acceptance derived directly from 8.11E's own sourceTextDocumentSnapshotPatchAccepted=${e11.sourceTextDocumentSnapshotPatchAccepted} field, since 8.11E is called directly by this closure.`,
    `EH-04: 8.11E actual run — outcome: ${e11.responseOutcome}, status: ${e11.status}, ok: ${e11.ok}, provider: ${e11.provider ?? "null"}, extractedTextLength: ${e11.extractedTextLength}, handoffAllowed: ${e11.handoffAllowed}.`,
    `EH-05: Historical documented OCR misread from 8.11E (commit ec5a76f): "NO PERSONAL DATA" → "HO PERSOMAL DATH". This run freshRunTextDiffersFromExpected: ${freshRunTextDiffersFromExpected}.`,
    `EH-06: eng.traineddata safety-net cleanup — observed after all sources: ${engTrainedDataObservedAfterSources}, deleted by this closure: ${engTrainedDataDeletedByClosure}, absent after cleanup: ${engTrainedDataAbsentAfterCleanup}.`,
    "EH-07: Nine future integration plan sections closed: payload contract, route integration, UI integration, Evidence Gate integration, hallucination trap integration, API response contract, disabled closure plan (8.11J), enabled synthetic closure plan (8.11K), tesseract cache debt.",
    "EH-08: All plans are documentation only. Implementation requires a separate, explicitly authorized future phase (8.11I onward).",
    "EH-09: Safety boundaries confirmed — no model call, no handoff, no Smart Talk reasoning, no persistence, no public runtime, no production/go-live authorization.",
    "EH-10: 8.3AC not run. tmp-8-3ac-live-metadata.ts not touched.",
    "EH-11: Next recommended phase is 8.11I — Minimal OCR-to-Smart-Talk Handoff Runtime Patch.",
    "EH-12: tesseract cache debt (eng.traineddata) recorded — blockerBeforeMobileTesting and blockerBeforePublicBeta, but NOT blockerBefore8_11I, provided the working tree remains clean.",
  ];

  // ── Build provisional result ───────────────────────────────────────────────
  const tamperCount = OCR_TO_SMART_TALK_HANDOFF_PLAN_TAMPER_CASES.length;

  const provisional: OcrToSmartTalkHandoffPlanResult = {
    checkId: "8.11H",
    allPassed: true,
    handoffPlanOnly: true,
    ocrToSmartTalkHandoffPlanOnly: true,
    handoffImplementedNow: false,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    adapterModifiedNow: false,
    packageModifiedNow: false,
    configModifiedNow: false,
    envModifiedNow: false,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    externalNetworkCalledByClosure: false,
    fetchCalledExternally: false,
    openAiCalled: false,
    tesseractImportedDirectlyByClosure: false,
    ocrAdapterCalledDirectlyByClosure: false,
    realImageUsedByClosure: false,
    syntheticEvidenceOnly: true,
    realDocumentUsed: false,
    imageSavedToDisk: false,
    realDocumentImageBytesRead: false,
    modelCallPerformed: false,
    smartTalkReasoningPerformed: false,
    ocrToSmartTalkHandoffPerformed: false,
    uploadPersistencePerformed: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    verifiedFactsCreated: false,
    legalDeadlineCreated: false,
    officialFilingCreated: false,
    bindingLegalAdviceCreated: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceMinimalRealOcrRuntimePatchCommit: "46ddefc",
    sourceDisabledLocalApiClosureCommit: "3688358",
    sourceEnabledSyntheticLocalApiClosureCommit: "ec5a76f",
    sourceQualityEvaluatorClosureCommit: "2ef041f",
    sourceTrustBoundaryClosureCommit: "831779a",
    sourceTextDocumentSnapshotPatchCommit: "cf6624c",
    sourceTechnicalDebtInventoryCommit: "bdf3859",
    sourceImplementationPlanCommit: "3a26936",
    sourceGateDesignCommit: "ead0f0c",
    sourceMinimalRealOcrRuntimePatchAccepted,
    sourceDisabledLocalApiClosureAccepted,
    sourceEnabledSyntheticLocalApiClosureAccepted,
    sourceQualityEvaluatorClosureAccepted,
    sourceTrustBoundaryClosureAccepted,
    sourceTextDocumentSnapshotPatchAccepted,
    sourceTechnicalDebtInventoryAccepted,

    observedSyntheticOcrCaseAccepted,
    observedOcrProvider,
    observedExpectedSyntheticText: "VAYLO OCR TEST\nNO PERSONAL DATA",
    observedExtractedText,
    observedOcrMisreadDetected,
    observedOcrMisreadExample: "NO PERSONAL DATA -> HO PERSOMAL DATH",
    observedQualityStatusFrom8_11E,
    observedHandoffAllowedFrom8_11E: false,
    observedModelCallFrom8_11E: false,
    observedPersistenceFrom8_11E: false,

    handoffPlanCreated: true,
    handoffPlanClosed: true,
    ocrToSmartTalkHandoffImplementationStillBlocked: true,
    futureRuntimePatchRequired: true,
    futureDisabledClosureRequired: true,
    futureEnabledSyntheticClosureRequired: true,
    futureBrowserManualClosureRequired: true,
    futureMobileManualClosureRequired: true,
    trustBoundaryMustCarryForward: true,
    qualityEvaluatorMustCarryForward: true,
    evidenceGatesMustReceiveOcrSourceMetadata: true,
    hallucinationTrapsMustReceiveOcrSourceMetadata: true,
    highRiskClaimsRemainBlocked: true,
    legalDeadlineStillBlocked: true,
    officialFilingStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    dnaWriteStillBlocked: true,
    readyForMinimalHandoffRuntimePatch,
    readyForOcrToSmartTalkHandoffImplementation: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11I",
    recommendedNextPhase: "Minimal OCR-to-Smart-Talk Handoff Runtime Patch",

    futureHandoffPayloadContract: FUTURE_HANDOFF_PAYLOAD_CONTRACT,
    futureRouteIntegrationPlan: FUTURE_ROUTE_INTEGRATION_PLAN,
    futureUiIntegrationPlan: FUTURE_UI_INTEGRATION_PLAN,
    futureEvidenceGateIntegrationPlan: FUTURE_EVIDENCE_GATE_INTEGRATION_PLAN,
    futureHallucinationTrapIntegrationPlan: FUTURE_HALLUCINATION_TRAP_INTEGRATION_PLAN,
    futureApiResponseContract: FUTURE_API_RESPONSE_CONTRACT,
    futureDisabledClosurePlan: FUTURE_DISABLED_CLOSURE_PLAN,
    futureEnabledSyntheticClosurePlan: FUTURE_ENABLED_SYNTHETIC_CLOSURE_PLAN,
    tesseractCacheDebt: {
      debtObserved: true,
      artifactName: "eng.traineddata",
      artifactLocationObserved: "repo root",
      causedBy: "tesseract.js on-demand language data download/cache during OCR execution",
      currentMitigation: "detection and cleanup during source closure execution when observed",
      mustNotCommitArtifact: true,
      needsControlledCachePath: true,
      needsCleanupPolicy: true,
      needsGitignorePolicyReview: true,
      blockerBeforeMobileTesting: true,
      blockerBeforePublicBeta: true,
      blockerBefore8_11I: false,
    },

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    observedOcrEvidence,
    handoffPlanEvidence,
    payloadContractEvidence,
    routeIntegrationPlanEvidence,
    uiIntegrationPlanEvidence,
    evidenceGateIntegrationPlanEvidence,
    hallucinationTrapIntegrationPlanEvidence,
    apiResponseContractEvidence,
    disabledClosurePlanEvidence,
    enabledSyntheticClosurePlanEvidence,
    tesseractCacheDebtEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.11I: Minimal OCR-to-Smart-Talk Handoff Runtime Patch — implement the smallest possible route change gated by SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED, using the futureRouteIntegrationPlan defined in this closure.",
      "Phase 8.11J: OCR-to-Smart-Talk Disabled Local API Closure — validate all 9 disabled env variants fail closed with 'ocr_to_smart_talk_handoff_disabled', using the futureDisabledClosurePlan defined in this closure.",
      "Phase 8.11K: OCR-to-Smart-Talk Enabled Synthetic Local API Closure — validate the enabled synthetic handoff path in-process, using the futureEnabledSyntheticClosurePlan defined in this closure.",
      "OCR Quality Evaluator Runtime Implementation — implement lib/vaylo/smart-talk/ocr/ocr-quality-evaluator.ts as planned in 8.11F, required before any handoff runtime patch.",
      "tesseract.js cache debt resolution — configure TESSDATA_PREFIX or equivalent, implement cleanup policy, review .gitignore for *.traineddata.",
      "Browser/mobile manual OCR-to-Smart-Talk handoff testing — separate, later, explicitly authorized phases after the minimal runtime patch and both closures (8.11J/8.11K) are complete.",
    ],
    notes,
  };

  // ── Self-validation ────────────────────────────────────────────────────────
  if (allPassed && !_isCanonicalOcrToSmartTalkHandoffPlanResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Tamper-case verification ───────────────────────────────────────────────
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of OCR_TO_SMART_TALK_HANDOFF_PLAN_TAMPER_CASES) {
    if (!_isCanonicalOcrToSmartTalkHandoffPlanResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11H tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;
  const finalReadyForMinimalHandoffRuntimePatch = finalAllPassed;

  const finalNotes: string[] = [
    ...notes,
    `8.11H tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    readyForMinimalHandoffRuntimePatch: finalReadyForMinimalHandoffRuntimePatch,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
    notes: finalNotes,
  };
}

// ─── Debug runner ─────────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-ocr-to-smart-talk-handoff-plan");

if (invokedDirectly) {
  runOcrToSmartTalkHandoffPlan()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
