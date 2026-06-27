/**
 * Phase 8.6F — Controlled Real Document Pre-Model PII Redaction Runtime Execution Contract.
 *
 * RUNTIME-EXECUTION-CONTRACT-ONLY — NO PRODUCTION RUNTIME — DEPENDS ON 8.6E.
 *
 * Defines exact constraints under which the next phase 8.6G may create the
 * isolated PII utility. Does NOT implement any production utility or runtime.
 */

import { runControlledRealDocumentPreModelPiiRedactionDryRunImplementation } from "./run-controlled-real-document-pre-model-pii-redaction-dry-run-implementation";

// ── Shared arrays for 8.6E prereq checking ───────────────────────────────────

const DRY_RUN_CASES = ["CleanNoPiiInput","SimplePersonName","GermanGreetingWithPersonName","PostalAddress","PhoneNumber","EmailAddress","DateOfBirth","CustomerNumber","InsuranceNumber","HealthInsuranceIdentifier","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumber","Iban","LicensePlate","SenderBlock","RecipientBlock","AuthorityContactBlock","JobcenterBuergergeldIdentifier","FamilienkasseKindergeldIdentifier","AuslaenderbehoerdeIdentifier","FinanzamtIdentifier","MedicalIdentifier","ImmigrationResidenceIdentifier","MixedUserCommentaryAndDocumentText","FalsePositiveControl","RepeatedRawValueStablePlaceholder","DifferentValuesIncrementPlaceholders","UnresolvedUnsafeIdentifierBlocks","NoRawPiiInResultMetadata","NoRawPiiInUnsafeOutputFields","NoRuntimeAuthorizationGranted"] as const;

const DRY_RUN_OUTPUT_SUPPORTS = ["StatusPassedBlockedNeedsReview","RedactedText","PlaceholderCounts","PlaceholderCategories","CoverageSummaryWithoutRawValues","UnresolvedRiskFlagsWithoutRawValues","BlockingReasonsWithoutRawValues","DetectorSummaryWithoutRawValues","SafeForModelBoolean","SafeForEvidenceGatesBoolean","SafeForUserVisibleOutputDefaultFalse"] as const;

const SIDE_EFFECTS = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"] as const;

const PIPELINE_FLAGS = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiProductionPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"] as const;

const RUNTIME_AUTH_FLAGS = ["preModelPiiRedactionRuntimeAuthorizedNow","realDocumentInputAuthorizedNow","realDocumentProcessingAuthorizedNow","realUserDocumentUploadAuthorizedNow","ocrRuntimeAuthorizedNow","photoInputAuthorizedNow","fileInputAuthorizedNow","documentStorageAuthorizedNow","persistenceAuthorizedNow","publicRuntimeAuthorizedNow","userVisibleLegalDeadlineOutputAuthorizedNow","liveLLMRuntimeAuthorizedNow","connectedAiRuntimeAuthorizedNow","pilotRuntimeAuthorizedNow","productionRuntimeAuthorizedNow","paidDocumentModeRuntimeAuthorizedNow","paymentRuntimeAuthorizedNow","entitlementRuntimeAuthorizedNow","checkoutRuntimeAuthorizedNow"] as const;

// ── Shared arrays for 8.6F result assertions ─────────────────────────────────

const FUTURE_UTILITY_SUFFIXES = ["IsolatedUnderSmartTalkTree","NoRouteImports","NoOpenAiFetchEnvSdk","NoPersistence","NoModelPromptRunSmartTalk","ExplicitTextAndLaneInput","RejectEmptyInput","RejectUnsupportedLanes","RejectDocumentTextWithoutControlledLane","NoClientFlagAuthorization","StructuredSafeResult","NoRawMapByDefault","NoRawPiiInMetadata","SafeForUserVisibleDefaultFalse","SafeForModelDefaultFalseUnlessPassed","SafeForEvidenceGatesDefaultFalseUnlessPassed","BlockOrReviewHighRisk","PreserveSemanticStructure","NoFactInvention","NoFalseDeadlineAlteration","NoLegalSufficiencyClassification","DeterministicPlaceholders","RawMapLocalEphemeral","SyntheticGovernanceValidationOnly"] as const;

const DETECTOR_CAT_SUFFIXES = ["PersonNamesGermanGreetings","PostalAddresses","PhoneNumbers","EmailAddresses","DateOfBirth","CustomerNumbers","InsuranceNumbers","HealthInsuranceIdentifiers","TaxIds","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumbers","Iban","LicensePlates","SenderBlocks","RecipientBlocks","AuthorityContactBlocks","MedicalHealthIdentifiers","ImmigrationResidenceIdentifiers","SocialBenefitIdentifiers","JobcenterBuergergeldIdentifiers","FamilienkasseKindergeldIdentifiers","AuslaenderbehoerdeIdentifiers","FinanzamtIdentifiers"] as const;

const RESULT_MODEL_SUFFIXES = ["Status","RedactedText","PlaceholderCounts","PlaceholderCategories","DetectorSummaryWithoutRawValues","CoverageSummaryWithoutRawValues","UnresolvedRiskFlagsWithoutRawValues","BlockingReasonsWithoutRawValues","SafeForModel","SafeForEvidenceGates","SafeForUserVisibleOutputDefaultFalse","RawMapReturnedFalseByDefault"] as const;

const HARD_STOP_SUFFIXES = ["NoRoutePatch","NoRealDocumentInput","NoModelCall","NoPromptBuild","NoRunSmartTalkCall","NoEvidenceGateExecution","NoClaimAuthorization","NoExactDeadlineCalculation","NoUserVisibleDocumentExplanation","NoPublicRuntime","NoPersistence","NoStorage","NoPaymentCheckoutEntitlementRuntime","NoRuntimePilotProductionGoLiveAuthorization"] as const;

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPreModelPiiRedactionRuntimeExecutionContractResult {
  readonly checkId: "8.6F";
  readonly allPassed: boolean;
  readonly preModelPiiRedactionDryRunReadyForRuntimeExecutionContract: true;
  readonly controlledRealDocumentPreModelPiiRedactionRuntimeExecutionContractAccepted: boolean;
  readonly preModelPiiRedactionRuntimeExecutionContractOnly: true;
  readonly preModelPiiRedactionRuntimeExecutionContractDefined: true;
  readonly preModelPiiRedactionProductionUtilityStillNotImplemented: true;
  readonly preModelPiiRedactionRuntimeStillNotImplemented: true;
  readonly preModelPiiDetectorRuntimeStillNotImplemented: true;
  readonly preModelPiiMaskingRuntimeStillNotImplemented: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true;
  readonly preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true;
  readonly preModelPiiRedactionDoesNotAuthorizePromptBuild: true;
  readonly preModelPiiRedactionDoesNotAuthorizeModelCall: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true;
  readonly tamperCasesRejected: boolean;
  // 8.6G authorization boundary (18)
  readonly piiExecutionContractAuthorizesOnlyOneIsolatedUtilityFileIn8x6G: true;
  readonly piiExecutionContractAuthorizesDeterministicHelperExportOnly: true;
  readonly piiExecutionContractAuthorizesLocalTypesOnly: true;
  readonly piiExecutionContractAuthorizesSyntheticTestableLogicOnly: true;
  readonly piiExecutionContractDoesNotAuthorizeRoutePatchIn8x6G: true;
  readonly piiExecutionContractDoesNotAuthorizeSmartTalkRouteModification: true;
  readonly piiExecutionContractDoesNotAuthorizePhotoRouteModification: true;
  readonly piiExecutionContractDoesNotAuthorizeRouteWiring: true;
  readonly piiExecutionContractDoesNotAuthorizeRealUserDocumentProcessing: true;
  readonly piiExecutionContractDoesNotAuthorizeModelFacingUse: true;
  readonly piiExecutionContractDoesNotAuthorizeEvidenceGateExecution: true;
  readonly piiExecutionContractDoesNotAuthorizeClaimAuthorization: true;
  readonly piiExecutionContractDoesNotAuthorizeDeadlineCalculation: true;
  readonly piiExecutionContractDoesNotAuthorizePersistence: true;
  readonly piiExecutionContractDoesNotAuthorizeStorage: true;
  readonly piiExecutionContractDoesNotAuthorizeUserVisibleOutput: true;
  readonly piiExecutionContractDoesNotAuthorizePublicRuntime: true;
  readonly piiExecutionContractDoesNotAuthorizePaymentCheckoutEntitlement: true;
  // Future utility boundary (24)
  readonly piiExecutionContractRequiresFutureUtilityIsolatedUnderSmartTalkTree: true;
  readonly piiExecutionContractRequiresFutureUtilityNoRouteImports: true;
  readonly piiExecutionContractRequiresFutureUtilityNoOpenAiFetchEnvSdk: true;
  readonly piiExecutionContractRequiresFutureUtilityNoPersistence: true;
  readonly piiExecutionContractRequiresFutureUtilityNoModelPromptRunSmartTalk: true;
  readonly piiExecutionContractRequiresFutureUtilityExplicitTextAndLaneInput: true;
  readonly piiExecutionContractRequiresFutureUtilityRejectEmptyInput: true;
  readonly piiExecutionContractRequiresFutureUtilityRejectUnsupportedLanes: true;
  readonly piiExecutionContractRequiresFutureUtilityRejectDocumentTextWithoutControlledLane: true;
  readonly piiExecutionContractRequiresFutureUtilityNoClientFlagAuthorization: true;
  readonly piiExecutionContractRequiresFutureUtilityStructuredSafeResult: true;
  readonly piiExecutionContractRequiresFutureUtilityNoRawMapByDefault: true;
  readonly piiExecutionContractRequiresFutureUtilityNoRawPiiInMetadata: true;
  readonly piiExecutionContractRequiresFutureUtilitySafeForUserVisibleDefaultFalse: true;
  readonly piiExecutionContractRequiresFutureUtilitySafeForModelDefaultFalseUnlessPassed: true;
  readonly piiExecutionContractRequiresFutureUtilitySafeForEvidenceGatesDefaultFalseUnlessPassed: true;
  readonly piiExecutionContractRequiresFutureUtilityBlockOrReviewHighRisk: true;
  readonly piiExecutionContractRequiresFutureUtilityPreserveSemanticStructure: true;
  readonly piiExecutionContractRequiresFutureUtilityNoFactInvention: true;
  readonly piiExecutionContractRequiresFutureUtilityNoFalseDeadlineAlteration: true;
  readonly piiExecutionContractRequiresFutureUtilityNoLegalSufficiencyClassification: true;
  readonly piiExecutionContractRequiresFutureUtilityDeterministicPlaceholders: true;
  readonly piiExecutionContractRequiresFutureUtilityRawMapLocalEphemeral: true;
  readonly piiExecutionContractRequiresFutureUtilitySyntheticGovernanceValidationOnly: true;
  // Detector categories (26)
  readonly piiExecutionContractRequiresDetectorPersonNamesGermanGreetings: true;
  readonly piiExecutionContractRequiresDetectorPostalAddresses: true;
  readonly piiExecutionContractRequiresDetectorPhoneNumbers: true;
  readonly piiExecutionContractRequiresDetectorEmailAddresses: true;
  readonly piiExecutionContractRequiresDetectorDateOfBirth: true;
  readonly piiExecutionContractRequiresDetectorCustomerNumbers: true;
  readonly piiExecutionContractRequiresDetectorInsuranceNumbers: true;
  readonly piiExecutionContractRequiresDetectorHealthInsuranceIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorTaxIds: true;
  readonly piiExecutionContractRequiresDetectorSteuerId: true;
  readonly piiExecutionContractRequiresDetectorSteuernummer: true;
  readonly piiExecutionContractRequiresDetectorAktenzeichen: true;
  readonly piiExecutionContractRequiresDetectorVorgangsnummer: true;
  readonly piiExecutionContractRequiresDetectorCaseReferenceNumbers: true;
  readonly piiExecutionContractRequiresDetectorIban: true;
  readonly piiExecutionContractRequiresDetectorLicensePlates: true;
  readonly piiExecutionContractRequiresDetectorSenderBlocks: true;
  readonly piiExecutionContractRequiresDetectorRecipientBlocks: true;
  readonly piiExecutionContractRequiresDetectorAuthorityContactBlocks: true;
  readonly piiExecutionContractRequiresDetectorMedicalHealthIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorImmigrationResidenceIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorSocialBenefitIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorJobcenterBuergergeldIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorFamilienkasseKindergeldIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorAuslaenderbehoerdeIdentifiers: true;
  readonly piiExecutionContractRequiresDetectorFinanzamtIdentifiers: true;
  // Result model (12)
  readonly piiExecutionContractRequiresResultStatus: true;
  readonly piiExecutionContractRequiresResultRedactedText: true;
  readonly piiExecutionContractRequiresResultPlaceholderCounts: true;
  readonly piiExecutionContractRequiresResultPlaceholderCategories: true;
  readonly piiExecutionContractRequiresResultDetectorSummaryWithoutRawValues: true;
  readonly piiExecutionContractRequiresResultCoverageSummaryWithoutRawValues: true;
  readonly piiExecutionContractRequiresResultUnresolvedRiskFlagsWithoutRawValues: true;
  readonly piiExecutionContractRequiresResultBlockingReasonsWithoutRawValues: true;
  readonly piiExecutionContractRequiresResultSafeForModel: true;
  readonly piiExecutionContractRequiresResultSafeForEvidenceGates: true;
  readonly piiExecutionContractRequiresResultSafeForUserVisibleOutputDefaultFalse: true;
  readonly piiExecutionContractRequiresResultRawMapReturnedFalseByDefault: true;
  // Hard stops (14)
  readonly piiExecutionContractHardStopNoRoutePatch: true;
  readonly piiExecutionContractHardStopNoRealDocumentInput: true;
  readonly piiExecutionContractHardStopNoModelCall: true;
  readonly piiExecutionContractHardStopNoPromptBuild: true;
  readonly piiExecutionContractHardStopNoRunSmartTalkCall: true;
  readonly piiExecutionContractHardStopNoEvidenceGateExecution: true;
  readonly piiExecutionContractHardStopNoClaimAuthorization: true;
  readonly piiExecutionContractHardStopNoExactDeadlineCalculation: true;
  readonly piiExecutionContractHardStopNoUserVisibleDocumentExplanation: true;
  readonly piiExecutionContractHardStopNoPublicRuntime: true;
  readonly piiExecutionContractHardStopNoPersistence: true;
  readonly piiExecutionContractHardStopNoStorage: true;
  readonly piiExecutionContractHardStopNoPaymentCheckoutEntitlementRuntime: true;
  readonly piiExecutionContractHardStopNoRuntimePilotProductionGoLiveAuthorization: true;
  // Exec decision (7)
  readonly piiExecutionContractAcceptsDryRunImplementation: true;
  readonly piiExecutionContractMarksTd004RuntimeExecutionContractCompleted: true;
  readonly piiExecutionContractKeepsSurgicalUtilityPatchRequired: true;
  readonly piiExecutionContractKeepsPostPatchAuditRequired: true;
  readonly piiExecutionContractKeepsClosureDecisionRequired: true;
  readonly piiExecutionContractKeepsProductionPiiRedactionMissing: true;
  readonly piiExecutionContractReadyFor8x6GSurgicalUtilityPatch: true;
  // Actual flags
  readonly actualPiiRedactionRuntimeExecutionContractOnly: true;
  readonly actualPiiRedactionProductionUtilityImplemented: false;
  readonly actualPiiRedactionUtilityRuntimeImplemented: false;
  readonly actualUtilityRuntimeFileCreatedInThisPhase: false;
  readonly actualPiiRedactionImplemented: false;
  readonly actualPiiDetectorRuntimeImplemented: false;
  readonly actualPiiMaskingRuntimeImplemented: false;
  readonly actualPiiTextRedactedFromRealInput: false;
  readonly actualRealRawPiiProcessed: false;
  readonly actualRawPiiPersisted: false;
  readonly actualRawPiiLogged: false;
  readonly actualPromptBuildPerformed: false;
  readonly actualModelCallPerformed: false;
  readonly actualRunSmartTalkCalled: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;
  readonly actualEvidenceGateEvaluationPerformed: false;
  readonly actualClaimAuthorizationPerformed: false;
  readonly actualDeadlineCalculationPerformed: false;
  readonly actualLiveRouteMutationPerformedInThisPhase: false;
  readonly actualSmartTalkRouteModifiedInThisPhase: false;
  readonly actualPhotoRouteModifiedInThisPhase: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPaymentRuntimeImplemented: false;
  readonly actualCheckoutImplemented: false;
  readonly actualEntitlementRuntimeImplemented: false;
  readonly actualServerEntitlementVerificationImplemented: false;
  readonly actualRealDocumentInputPerformed: false;
  readonly actualRealDocumentProcessingPerformed: false;
  readonly actualOcrPerformed: false;
  readonly actualPhotoInputProcessed: false;
  readonly actualFileInputProcessed: false;
  readonly actualDocumentStoragePerformed: false;
  readonly actualDatabasePersistencePerformed: false;
  readonly actualAuditPersistencePerformed: false;
  readonly actualUserVisibleOutputPerformed: false;
  readonly actualPublicRuntimeEnabled: false;
  // Side-effect confirmations (26)
  readonly piiExecutionContractConfirmsNoOpenAiCall: true;
  readonly piiExecutionContractConfirmsNoFetchCall: true;
  readonly piiExecutionContractConfirmsNoProcessEnvRead: true;
  readonly piiExecutionContractConfirmsNoSdkUsage: true;
  readonly piiExecutionContractConfirmsNo8x3AcRerun: true;
  readonly piiExecutionContractConfirmsNoPaymentRuntimeCall: true;
  readonly piiExecutionContractConfirmsNoStripeCall: true;
  readonly piiExecutionContractConfirmsNoCheckoutCall: true;
  readonly piiExecutionContractConfirmsNoEntitlementRuntimeCall: true;
  readonly piiExecutionContractConfirmsNoServerEntitlementVerification: true;
  readonly piiExecutionContractConfirmsNoOcrRuntimeCall: true;
  readonly piiExecutionContractConfirmsNoStorageMutation: true;
  readonly piiExecutionContractConfirmsNoDatabaseWrite: true;
  readonly piiExecutionContractConfirmsNoAuditPersistence: true;
  readonly piiExecutionContractConfirmsNoUserVisibleDocumentExplanation: true;
  readonly piiExecutionContractConfirmsNoEvidenceEvaluation: true;
  readonly piiExecutionContractConfirmsNoClaimAuthorization: true;
  readonly piiExecutionContractConfirmsNoDeadlineCalculation: true;
  readonly piiExecutionContractConfirmsNoLegalCertainty: true;
  readonly piiExecutionContractConfirmsNoPromptBuild: true;
  readonly piiExecutionContractConfirmsNoModelCall: true;
  readonly piiExecutionContractConfirmsNoRunSmartTalkCall: true;
  readonly piiExecutionContractConfirmsNoRouteHandlerCall: true;
  readonly piiExecutionContractConfirmsNoRouteImport: true;
  readonly piiExecutionContractConfirmsNoFilesystemRead: true;
  readonly piiExecutionContractConfirmsNoPhotoRouteModification: true;
  // Pipeline flags
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly piiProductionPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly entitlementPipelineActuallyExecuted: false;
  readonly checkoutPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;
  // Runtime auth flags
  readonly preModelPiiRedactionRuntimeAuthorizedNow: false;
  readonly realDocumentInputAuthorizedNow: false;
  readonly realDocumentProcessingAuthorizedNow: false;
  readonly realUserDocumentUploadAuthorizedNow: false;
  readonly ocrRuntimeAuthorizedNow: false;
  readonly photoInputAuthorizedNow: false;
  readonly fileInputAuthorizedNow: false;
  readonly documentStorageAuthorizedNow: false;
  readonly persistenceAuthorizedNow: false;
  readonly publicRuntimeAuthorizedNow: false;
  readonly userVisibleLegalDeadlineOutputAuthorizedNow: false;
  readonly liveLLMRuntimeAuthorizedNow: false;
  readonly connectedAiRuntimeAuthorizedNow: false;
  readonly pilotRuntimeAuthorizedNow: false;
  readonly productionRuntimeAuthorizedNow: false;
  readonly paidDocumentModeRuntimeAuthorizedNow: false;
  readonly paymentRuntimeAuthorizedNow: false;
  readonly entitlementRuntimeAuthorizedNow: false;
  readonly checkoutRuntimeAuthorizedNow: false;
  // Auth grants
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;
  // Legal safety
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;
  // Debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td005PaidDocumentModeBoundaryContainmentClosed: true;
  readonly td005PaidDocumentModeClientFlagBypassClosed: true;
  readonly td005PaidDocumentModeActualRuntimeImplementationDeferred: true;
  readonly td004PreModelPiiRedactionPlanned: true;
  readonly td004PreModelPiiRedactionContracted: true;
  readonly td004PreModelPiiRedactionImplementationPlanned: true;
  readonly td004PreModelPiiRedactionRuntimeContracted: true;
  readonly td004PreModelPiiRedactionDryRunImplemented: true;
  readonly td004PreModelPiiRedactionRuntimeExecutionContracted: true;
  readonly td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch: true;
  readonly td004PreModelPiiRedactionStillRequiresPostPatchAudit: true;
  readonly td004PreModelPiiRedactionStillRequiresClosureDecision: true;
  readonly td004PreModelPiiRedactionStillMissingInProduction: true;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: true;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: true;
  readonly td008InMemoryRateLimiterServerlessUnsafe: true;
  readonly td010GetUserStateDocumentTypeTodoOpen: true;
  readonly td009TmpDebugRunnerDebtClosed: true;
  readonly tmpFilesPresentInWorkingTree: false;
  // Forward readiness
  readonly readyFor8x6GPreModelPiiRedactionSurgicalUtilityPatch: true;
  readonly readyForEvidenceGatesProductionWiringPhase: false;
  readonly readyForServerEntitlementVerificationPhase: false;
  readonly readyForPaidDocumentModeActualRuntimeImplementationPhase: false;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: false;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Validator ─────────────────────────────────────────────────────────────────

function validateExecutionContractInput(o: Record<string, unknown>): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.6E prereq gate — core
  if (o["prereqCheckId"] !== "8.6E") reasons.push("prereq_check_id_must_be_8x6E");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["preModelPiiRedactionRuntimeContractReadyForDryRunImplementation"] !== true) reasons.push("prereq_rc_ready_for_dry_run_false");
  if (o["controlledRealDocumentPreModelPiiRedactionDryRunImplementationAccepted"] !== true) reasons.push("prereq_dry_run_not_accepted");
  if (o["preModelPiiRedactionDryRunImplementationOnly"] !== true) reasons.push("prereq_dry_run_implementation_only_false");
  if (o["preModelPiiRedactionDryRunImplemented"] !== true) reasons.push("prereq_dry_run_implemented_false");
  if (o["preModelPiiRedactionProductionUtilityStillNotImplemented"] !== true) reasons.push("prereq_production_utility_still_not_implemented_false");
  if (o["preModelPiiRedactionRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_redaction_runtime_false");
  if (o["preModelPiiDetectorRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_detector_runtime_false");
  if (o["preModelPiiMaskingRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_masking_runtime_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("prereq_no_real_doc_input_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("prereq_no_user_visible_output_false");
  if (o["preModelPiiRedactionDoesNotAuthorizePromptBuild"] !== true) reasons.push("prereq_no_prompt_build_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeModelCall"] !== true) reasons.push("prereq_no_model_call_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRunSmartTalk"] !== true) reasons.push("prereq_no_run_smart_talk_false");
  if (o["prereqTamperCasesRejected"] !== true) reasons.push("prereq_tamper_cases_rejected_false");

  // 8.6E dry-run case coverage (34)
  for (const dc of DRY_RUN_CASES) {
    if (o[`piiDryRunCovers${dc}`] !== true) reasons.push(`prereq_pii_dry_run_covers_${dc}_false`);
  }

  // 8.6E dry-run output model supports (11 + 1 standalone)
  for (const s of DRY_RUN_OUTPUT_SUPPORTS) {
    if (o[`piiDryRunSupports${s}`] !== true) reasons.push(`prereq_pii_dry_run_supports_${s}_false`);
  }
  if (o["piiDryRunDoesNotReturnRawToPlaceholderMapByDefault"] !== true) reasons.push("prereq_pii_dry_run_no_raw_map_false");

  // 8.6E dry-run behavior (11 individual)
  if (o["piiDryRunUsesSyntheticLocalExpectedValuesOnly"] !== true) reasons.push("prereq_pii_dry_run_synthetic_only_false");
  if (o["piiDryRunSyntheticPlaceholdersDeterministic"] !== true) reasons.push("prereq_pii_dry_run_placeholders_deterministic_false");
  if (o["piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder"] !== true) reasons.push("prereq_pii_dry_run_repeated_maps_same_false");
  if (o["piiDryRunDifferentSyntheticValuesIncrementPlaceholders"] !== true) reasons.push("prereq_pii_dry_run_different_increment_false");
  if (o["piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview"] !== true) reasons.push("prereq_pii_dry_run_unsafe_blocked_false");
  if (o["piiDryRunOutputMetadataContainsNoRawPii"] !== true) reasons.push("prereq_pii_dry_run_output_no_raw_pii_false");
  if (o["piiDryRunDidNotProcessRealText"] !== true) reasons.push("prereq_pii_dry_run_did_not_process_real_text_false");
  if (o["piiDryRunDidNotImplementProductionUtilityRuntime"] !== true) reasons.push("prereq_pii_dry_run_did_not_implement_production_false");
  if (o["piiDryRunDidNotAuthorizeModelFacingUse"] !== true) reasons.push("prereq_pii_dry_run_did_not_authorize_model_false");
  if (o["piiDryRunDidNotAuthorizeEvidenceGateExecution"] !== true) reasons.push("prereq_pii_dry_run_did_not_authorize_evidence_gate_false");
  if (o["piiDryRunDidNotAuthorizeUserVisibleOutput"] !== true) reasons.push("prereq_pii_dry_run_did_not_authorize_user_visible_false");

  // 8.6E synthetic dry-run summary
  const caseCount = o["syntheticDryRunCaseCount"];
  if (typeof caseCount !== "number" || caseCount < 34) reasons.push("prereq_synthetic_dry_run_case_count_must_be_gte_34");
  if (o["syntheticDryRunAllCasesPassed"] !== true) reasons.push("prereq_synthetic_dry_run_all_cases_passed_false");
  if (o["syntheticDryRunRawPiiLeakageDetected"] !== false) reasons.push("prereq_synthetic_dry_run_raw_pii_leakage_must_be_false");
  if (o["syntheticDryRunStablePlaceholderMappingConfirmed"] !== true) reasons.push("prereq_synthetic_dry_run_stable_placeholder_false");
  if (o["syntheticDryRunUnsafeCasesBlocked"] !== true) reasons.push("prereq_synthetic_dry_run_unsafe_cases_blocked_false");
  if (o["syntheticDryRunNoRuntimeAuthorizationConfirmed"] !== true) reasons.push("prereq_synthetic_dry_run_no_runtime_auth_false");

  // 8.6E actual flags
  if (o["actualPiiRedactionDryRunImplementationOnly"] !== true) reasons.push("prereq_actual_dry_run_impl_only_must_be_true");
  if (o["actualPiiRedactionProductionUtilityImplemented"] !== false) reasons.push("prereq_actual_production_utility_must_be_false");
  if (o["actualPiiRedactionUtilityRuntimeImplemented"] !== false) reasons.push("prereq_actual_utility_runtime_must_be_false");
  if (o["actualUtilityRuntimeFileCreatedInThisPhase"] !== false) reasons.push("prereq_actual_utility_file_created_must_be_false");
  if (o["actualPiiRedactionImplemented"] !== false) reasons.push("prereq_actual_pii_redaction_must_be_false");
  if (o["actualPiiDetectorRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_detector_must_be_false");
  if (o["actualPiiMaskingRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_masking_must_be_false");
  if (o["actualPiiTextRedactedFromRealInput"] !== false) reasons.push("prereq_actual_pii_text_redacted_from_real_must_be_false");
  if (o["actualRealRawPiiProcessed"] !== false) reasons.push("prereq_actual_real_raw_pii_processed_must_be_false");
  if (o["actualRawPiiPersisted"] !== false) reasons.push("prereq_actual_raw_pii_persisted_must_be_false");
  if (o["actualRawPiiLogged"] !== false) reasons.push("prereq_actual_raw_pii_logged_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false) reasons.push("prereq_actual_prompt_build_must_be_false");
  if (o["actualModelCallPerformed"] !== false) reasons.push("prereq_actual_model_call_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false) reasons.push("prereq_actual_run_smart_talk_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false) reasons.push("prereq_actual_evidence_gate_wiring_must_be_false");
  if (o["actualEvidenceGateEvaluationPerformed"] !== false) reasons.push("prereq_actual_evidence_gate_evaluation_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false) reasons.push("prereq_actual_claim_auth_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false) reasons.push("prereq_actual_deadline_calc_must_be_false");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false) reasons.push("prereq_actual_live_route_mutation_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_photo_route_modified_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false) reasons.push("prereq_actual_paid_doc_mode_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false) reasons.push("prereq_actual_payment_runtime_must_be_false");
  if (o["actualCheckoutImplemented"] !== false) reasons.push("prereq_actual_checkout_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false) reasons.push("prereq_actual_entitlement_must_be_false");
  if (o["actualServerEntitlementVerificationImplemented"] !== false) reasons.push("prereq_actual_server_entitlement_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false) reasons.push("prereq_actual_real_doc_input_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false) reasons.push("prereq_actual_real_doc_processing_must_be_false");
  if (o["actualOcrPerformed"] !== false) reasons.push("prereq_actual_ocr_must_be_false");
  if (o["actualPhotoInputProcessed"] !== false) reasons.push("prereq_actual_photo_input_must_be_false");
  if (o["actualFileInputProcessed"] !== false) reasons.push("prereq_actual_file_input_must_be_false");
  if (o["actualDocumentStoragePerformed"] !== false) reasons.push("prereq_actual_doc_storage_must_be_false");
  if (o["actualDatabasePersistencePerformed"] !== false) reasons.push("prereq_actual_db_persistence_must_be_false");
  if (o["actualAuditPersistencePerformed"] !== false) reasons.push("prereq_actual_audit_persistence_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false) reasons.push("prereq_actual_user_visible_output_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false) reasons.push("prereq_actual_public_runtime_must_be_false");

  // 8.6E side-effect confirmations
  for (const se of SIDE_EFFECTS) {
    if (o[`piiDryRunConfirms${se}`] !== true) reasons.push(`prereq_pii_dry_run_confirms_${se}_false`);
  }

  // Pipeline flags (8.6E names)
  for (const f of PIPELINE_FLAGS) {
    if (o[f] !== false) reasons.push(`prereq_${f}_must_be_false`);
  }

  // Runtime auth flags
  for (const f of RUNTIME_AUTH_FLAGS) {
    if (o[f] !== false) reasons.push(`prereq_${f}_must_be_false`);
  }

  // Auth grants
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("prereq_runtime_auth_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("prereq_pilot_auth_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("prereq_production_auth_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("prereq_final_auth_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("prereq_go_live_auth_granted_must_be_false");

  // Legal safety
  if (o["exactDeadlineCalculationAuthorized"] !== false) reasons.push("prereq_exact_deadline_must_be_false");
  if (o["deliveryDateInventionAuthorized"] !== false) reasons.push("prereq_delivery_date_invention_must_be_false");
  if (o["finalDateInventionAuthorized"] !== false) reasons.push("prereq_final_date_invention_must_be_false");
  if (o["legalCertaintyAuthorized"] !== false) reasons.push("prereq_legal_certainty_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false) reasons.push("prereq_coercive_legal_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true) reasons.push("prereq_delivery_date_required_false");

  // TD flags from 8.6E result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true) reasons.push("prereq_td001_false");
  if (o["td005PaidDocumentModeBoundaryContainmentClosed"] !== true) reasons.push("prereq_td005_boundary_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosed"] !== true) reasons.push("prereq_td005_client_flag_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] !== true) reasons.push("prereq_td005_deferred_false");
  if (o["td004PreModelPiiRedactionPlanned"] !== true) reasons.push("prereq_td004_planned_false");
  if (o["td004PreModelPiiRedactionContracted"] !== true) reasons.push("prereq_td004_contracted_false");
  if (o["td004PreModelPiiRedactionImplementationPlanned"] !== true) reasons.push("prereq_td004_impl_planned_false");
  if (o["td004PreModelPiiRedactionRuntimeContracted"] !== true) reasons.push("prereq_td004_runtime_contracted_false");
  if (o["td004PreModelPiiRedactionDryRunImplemented"] !== true) reasons.push("prereq_td004_dry_run_implemented_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract"] !== true) reasons.push("prereq_td004_still_requires_runtime_execution_contract_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch"] !== true) reasons.push("prereq_td004_still_requires_surgical_patch_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresPostPatchAudit"] !== true) reasons.push("prereq_td004_still_requires_post_patch_audit_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresClosureDecision"] !== true) reasons.push("prereq_td004_still_requires_closure_decision_must_be_true");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true) reasons.push("prereq_td004_still_missing_must_be_true");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true) reasons.push("prereq_td002_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true) reasons.push("prereq_td003_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true) reasons.push("prereq_td003_future_design_false");
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true) reasons.push("prereq_td006_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true) reasons.push("prereq_td007_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true) reasons.push("prereq_td008_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true) reasons.push("prereq_td010_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true) reasons.push("prereq_td009_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false) reasons.push("prereq_tmp_files_must_be_false");

  // 8.6E forward readiness gate
  if (o["readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract"] !== true) reasons.push("prereq_ready_for_8x6f_must_be_true");
  if (o["readyForEvidenceGatesProductionWiringPhase"] !== false) reasons.push("prereq_ready_evidence_gates_must_be_false");
  if (o["readyForServerEntitlementVerificationPhase"] !== false) reasons.push("prereq_ready_server_entitlement_must_be_false");
  if (o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] !== false) reasons.push("prereq_ready_paid_doc_mode_must_be_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false) reasons.push("prereq_ready_separate_runtime_auth_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false) reasons.push("prereq_ready_pilot_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false) reasons.push("prereq_ready_production_must_be_false");
  if (o["readyForRealDocumentInput"] !== false) reasons.push("prereq_ready_real_doc_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false) reasons.push("prereq_ready_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false) reasons.push("prereq_public_runtime_must_be_false");
  if (o["persistenceUsed"] !== false) reasons.push("prereq_persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true) reasons.push("prereq_never_user_visible_must_be_true");

  // 8.6F core assertion flags
  if (o["preModelPiiRedactionDryRunReadyForRuntimeExecutionContract"] !== true) reasons.push("dry_run_ready_for_exec_contract_false");
  if (o["preModelPiiRedactionRuntimeExecutionContractOnly"] !== true) reasons.push("exec_contract_only_false");
  if (o["preModelPiiRedactionRuntimeExecutionContractDefined"] !== true) reasons.push("exec_contract_defined_false");
  if (o["preModelPiiRedactionProductionUtilityStillNotImplemented"] !== true) reasons.push("production_utility_still_not_implemented_false");

  // 8.6G authorization boundary (18 individual)
  if (o["piiExecutionContractAuthorizesOnlyOneIsolatedUtilityFileIn8x6G"] !== true) reasons.push("pii_ec_authorizes_only_one_isolated_file_false");
  if (o["piiExecutionContractAuthorizesDeterministicHelperExportOnly"] !== true) reasons.push("pii_ec_authorizes_deterministic_helper_export_only_false");
  if (o["piiExecutionContractAuthorizesLocalTypesOnly"] !== true) reasons.push("pii_ec_authorizes_local_types_only_false");
  if (o["piiExecutionContractAuthorizesSyntheticTestableLogicOnly"] !== true) reasons.push("pii_ec_authorizes_synthetic_testable_logic_only_false");
  if (o["piiExecutionContractDoesNotAuthorizeRoutePatchIn8x6G"] !== true) reasons.push("pii_ec_no_route_patch_false");
  if (o["piiExecutionContractDoesNotAuthorizeSmartTalkRouteModification"] !== true) reasons.push("pii_ec_no_smart_talk_route_mod_false");
  if (o["piiExecutionContractDoesNotAuthorizePhotoRouteModification"] !== true) reasons.push("pii_ec_no_photo_route_mod_false");
  if (o["piiExecutionContractDoesNotAuthorizeRouteWiring"] !== true) reasons.push("pii_ec_no_route_wiring_false");
  if (o["piiExecutionContractDoesNotAuthorizeRealUserDocumentProcessing"] !== true) reasons.push("pii_ec_no_real_user_doc_processing_false");
  if (o["piiExecutionContractDoesNotAuthorizeModelFacingUse"] !== true) reasons.push("pii_ec_no_model_facing_use_false");
  if (o["piiExecutionContractDoesNotAuthorizeEvidenceGateExecution"] !== true) reasons.push("pii_ec_no_evidence_gate_execution_false");
  if (o["piiExecutionContractDoesNotAuthorizeClaimAuthorization"] !== true) reasons.push("pii_ec_no_claim_authorization_false");
  if (o["piiExecutionContractDoesNotAuthorizeDeadlineCalculation"] !== true) reasons.push("pii_ec_no_deadline_calculation_false");
  if (o["piiExecutionContractDoesNotAuthorizePersistence"] !== true) reasons.push("pii_ec_no_persistence_false");
  if (o["piiExecutionContractDoesNotAuthorizeStorage"] !== true) reasons.push("pii_ec_no_storage_false");
  if (o["piiExecutionContractDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("pii_ec_no_user_visible_output_false");
  if (o["piiExecutionContractDoesNotAuthorizePublicRuntime"] !== true) reasons.push("pii_ec_no_public_runtime_false");
  if (o["piiExecutionContractDoesNotAuthorizePaymentCheckoutEntitlement"] !== true) reasons.push("pii_ec_no_payment_checkout_entitlement_false");

  // Future utility boundary (24)
  for (const s of FUTURE_UTILITY_SUFFIXES) {
    if (o[`piiExecutionContractRequiresFutureUtility${s}`] !== true) reasons.push(`pii_ec_requires_future_utility_${s}_false`);
  }

  // Detector categories (26)
  for (const s of DETECTOR_CAT_SUFFIXES) {
    if (o[`piiExecutionContractRequiresDetector${s}`] !== true) reasons.push(`pii_ec_requires_detector_${s}_false`);
  }

  // Result model (12)
  for (const s of RESULT_MODEL_SUFFIXES) {
    if (o[`piiExecutionContractRequiresResult${s}`] !== true) reasons.push(`pii_ec_requires_result_${s}_false`);
  }

  // Hard stops (14)
  for (const s of HARD_STOP_SUFFIXES) {
    if (o[`piiExecutionContractHardStop${s}`] !== true) reasons.push(`pii_ec_hard_stop_${s}_false`);
  }

  // Exec decision (7 individual)
  if (o["piiExecutionContractAcceptsDryRunImplementation"] !== true) reasons.push("pii_ec_accepts_dry_run_false");
  if (o["piiExecutionContractMarksTd004RuntimeExecutionContractCompleted"] !== true) reasons.push("pii_ec_marks_td004_exec_contract_completed_false");
  if (o["piiExecutionContractKeepsSurgicalUtilityPatchRequired"] !== true) reasons.push("pii_ec_keeps_surgical_patch_required_false");
  if (o["piiExecutionContractKeepsPostPatchAuditRequired"] !== true) reasons.push("pii_ec_keeps_post_patch_audit_required_false");
  if (o["piiExecutionContractKeepsClosureDecisionRequired"] !== true) reasons.push("pii_ec_keeps_closure_decision_required_false");
  if (o["piiExecutionContractKeepsProductionPiiRedactionMissing"] !== true) reasons.push("pii_ec_keeps_production_missing_false");
  if (o["piiExecutionContractReadyFor8x6GSurgicalUtilityPatch"] !== true) reasons.push("pii_ec_ready_for_8x6g_false");

  // 8.6F new actual flags
  if (o["actualPiiRedactionRuntimeExecutionContractOnly"] !== true) reasons.push("actual_exec_contract_only_must_be_true");
  if (o["actualPiiRedactionProductionUtilityImplemented"] !== false) reasons.push("actual_production_utility_must_be_false");
  if (o["actualPiiRedactionUtilityRuntimeImplemented"] !== false) reasons.push("actual_utility_runtime_must_be_false");
  if (o["actualUtilityRuntimeFileCreatedInThisPhase"] !== false) reasons.push("actual_utility_file_created_must_be_false");
  if (o["actualPiiRedactionImplemented"] !== false) reasons.push("actual_pii_redaction_must_be_false");
  if (o["actualPiiDetectorRuntimeImplemented"] !== false) reasons.push("actual_pii_detector_must_be_false");
  if (o["actualPiiMaskingRuntimeImplemented"] !== false) reasons.push("actual_pii_masking_must_be_false");
  if (o["actualPiiTextRedactedFromRealInput"] !== false) reasons.push("actual_pii_text_redacted_from_real_must_be_false");
  if (o["actualRealRawPiiProcessed"] !== false) reasons.push("actual_real_raw_pii_processed_must_be_false");
  if (o["actualRawPiiPersisted"] !== false) reasons.push("actual_raw_pii_persisted_must_be_false");
  if (o["actualRawPiiLogged"] !== false) reasons.push("actual_raw_pii_logged_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false) reasons.push("actual_prompt_build_must_be_false");
  if (o["actualModelCallPerformed"] !== false) reasons.push("actual_model_call_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false) reasons.push("actual_run_smart_talk_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false) reasons.push("actual_evidence_gate_wiring_must_be_false");
  if (o["actualEvidenceGateEvaluationPerformed"] !== false) reasons.push("actual_evidence_gate_evaluation_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false) reasons.push("actual_claim_auth_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false) reasons.push("actual_deadline_calc_must_be_false");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false) reasons.push("actual_live_route_mutation_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false) reasons.push("actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false) reasons.push("actual_photo_route_modified_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false) reasons.push("actual_user_visible_output_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false) reasons.push("actual_public_runtime_must_be_false");

  // 8.6F side-effect confirmations
  for (const se of SIDE_EFFECTS) {
    if (o[`piiExecutionContractConfirms${se}`] !== true) reasons.push(`pii_ec_confirms_${se}_false`);
  }

  // Pipeline flags
  for (const f of PIPELINE_FLAGS) {
    if (o[f] !== false) reasons.push(`${f}_must_be_false`);
  }

  // Runtime auth flags
  for (const f of RUNTIME_AUTH_FLAGS) {
    if (o[f] !== false) reasons.push(`${f}_result_must_be_false`);
  }

  // Auth grants
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_auth_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_auth_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_auth_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_auth_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_auth_granted_must_be_false");

  // Legal safety
  if (o["exactDeadlineCalculationAuthorized"] !== false) reasons.push("exact_deadline_authorized_must_be_false");

  // 8.6F TD result flags
  if (o["td004PreModelPiiRedactionRuntimeExecutionContracted"] !== true) reasons.push("td004_runtime_execution_contracted_false");
  if (o["td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch"] !== true) reasons.push("td004_still_requires_surgical_patch_false");
  if (o["td004PreModelPiiRedactionStillRequiresPostPatchAudit"] !== true) reasons.push("td004_still_requires_post_patch_audit_false");
  if (o["td004PreModelPiiRedactionStillRequiresClosureDecision"] !== true) reasons.push("td004_still_requires_closure_decision_false");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true) reasons.push("td004_still_missing_in_production_false");

  // 8.6F forward readiness
  if (o["readyFor8x6GPreModelPiiRedactionSurgicalUtilityPatch"] !== true) reasons.push("ready_for_8x6g_surgical_utility_patch_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.6F input builder ──────────────────────────────────────────────

function buildCanonical8x6FInput(): Record<string, unknown> {
  const dr = runControlledRealDocumentPreModelPiiRedactionDryRunImplementation();
  const o: Record<string, unknown> = {
    // 8.6E prereq gate — core
    prereqCheckId: dr.checkId,
    prereqAllPassed: dr.allPassed,
    preModelPiiRedactionRuntimeContractReadyForDryRunImplementation: dr.preModelPiiRedactionRuntimeContractReadyForDryRunImplementation,
    controlledRealDocumentPreModelPiiRedactionDryRunImplementationAccepted: dr.controlledRealDocumentPreModelPiiRedactionDryRunImplementationAccepted,
    preModelPiiRedactionDryRunImplementationOnly: dr.preModelPiiRedactionDryRunImplementationOnly,
    preModelPiiRedactionDryRunImplemented: dr.preModelPiiRedactionDryRunImplemented,
    preModelPiiRedactionProductionUtilityStillNotImplemented: dr.preModelPiiRedactionProductionUtilityStillNotImplemented,
    preModelPiiRedactionRuntimeStillNotImplemented: dr.preModelPiiRedactionRuntimeStillNotImplemented,
    preModelPiiDetectorRuntimeStillNotImplemented: dr.preModelPiiDetectorRuntimeStillNotImplemented,
    preModelPiiMaskingRuntimeStillNotImplemented: dr.preModelPiiMaskingRuntimeStillNotImplemented,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: dr.preModelPiiRedactionDoesNotAuthorizeRealDocumentInput,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: dr.preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: dr.preModelPiiRedactionDoesNotAuthorizePromptBuild,
    preModelPiiRedactionDoesNotAuthorizeModelCall: dr.preModelPiiRedactionDoesNotAuthorizeModelCall,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: dr.preModelPiiRedactionDoesNotAuthorizeRunSmartTalk,
    prereqTamperCasesRejected: dr.tamperCasesRejected,
  };

  // 8.6E dry-run case coverage
  for (const dc of DRY_RUN_CASES) o[`piiDryRunCovers${dc}`] = dr[`piiDryRunCovers${dc}` as keyof typeof dr];

  // 8.6E dry-run output model
  for (const s of DRY_RUN_OUTPUT_SUPPORTS) o[`piiDryRunSupports${s}`] = dr[`piiDryRunSupports${s}` as keyof typeof dr];
  o["piiDryRunDoesNotReturnRawToPlaceholderMapByDefault"] = dr.piiDryRunDoesNotReturnRawToPlaceholderMapByDefault;

  // 8.6E dry-run behavior
  o["piiDryRunUsesSyntheticLocalExpectedValuesOnly"] = dr.piiDryRunUsesSyntheticLocalExpectedValuesOnly;
  o["piiDryRunSyntheticPlaceholdersDeterministic"] = dr.piiDryRunSyntheticPlaceholdersDeterministic;
  o["piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder"] = dr.piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder;
  o["piiDryRunDifferentSyntheticValuesIncrementPlaceholders"] = dr.piiDryRunDifferentSyntheticValuesIncrementPlaceholders;
  o["piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview"] = dr.piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview;
  o["piiDryRunOutputMetadataContainsNoRawPii"] = dr.piiDryRunOutputMetadataContainsNoRawPii;
  o["piiDryRunDidNotProcessRealText"] = dr.piiDryRunDidNotProcessRealText;
  o["piiDryRunDidNotImplementProductionUtilityRuntime"] = dr.piiDryRunDidNotImplementProductionUtilityRuntime;
  o["piiDryRunDidNotAuthorizeModelFacingUse"] = dr.piiDryRunDidNotAuthorizeModelFacingUse;
  o["piiDryRunDidNotAuthorizeEvidenceGateExecution"] = dr.piiDryRunDidNotAuthorizeEvidenceGateExecution;
  o["piiDryRunDidNotAuthorizeUserVisibleOutput"] = dr.piiDryRunDidNotAuthorizeUserVisibleOutput;

  // 8.6E synthetic dry-run summary
  o["syntheticDryRunCaseCount"] = dr.syntheticDryRunCaseCount;
  o["syntheticDryRunAllCasesPassed"] = dr.syntheticDryRunAllCasesPassed;
  o["syntheticDryRunRawPiiLeakageDetected"] = dr.syntheticDryRunRawPiiLeakageDetected;
  o["syntheticDryRunStablePlaceholderMappingConfirmed"] = dr.syntheticDryRunStablePlaceholderMappingConfirmed;
  o["syntheticDryRunUnsafeCasesBlocked"] = dr.syntheticDryRunUnsafeCasesBlocked;
  o["syntheticDryRunNoRuntimeAuthorizationConfirmed"] = dr.syntheticDryRunNoRuntimeAuthorizationConfirmed;

  // 8.6E actual flags
  o["actualPiiRedactionDryRunImplementationOnly"] = dr.actualPiiRedactionDryRunImplementationOnly;
  o["actualPiiRedactionProductionUtilityImplemented"] = dr.actualPiiRedactionProductionUtilityImplemented;
  o["actualPiiRedactionUtilityRuntimeImplemented"] = dr.actualPiiRedactionUtilityRuntimeImplemented;
  o["actualUtilityRuntimeFileCreatedInThisPhase"] = dr.actualUtilityRuntimeFileCreatedInThisPhase;
  o["actualPiiRedactionImplemented"] = dr.actualPiiRedactionImplemented;
  o["actualPiiDetectorRuntimeImplemented"] = dr.actualPiiDetectorRuntimeImplemented;
  o["actualPiiMaskingRuntimeImplemented"] = dr.actualPiiMaskingRuntimeImplemented;
  o["actualPiiTextRedactedFromRealInput"] = dr.actualPiiTextRedactedFromRealInput;
  o["actualRealRawPiiProcessed"] = dr.actualRealRawPiiProcessed;
  o["actualRawPiiPersisted"] = dr.actualRawPiiPersisted;
  o["actualRawPiiLogged"] = dr.actualRawPiiLogged;
  o["actualPromptBuildPerformed"] = dr.actualPromptBuildPerformed;
  o["actualModelCallPerformed"] = dr.actualModelCallPerformed;
  o["actualRunSmartTalkCalled"] = dr.actualRunSmartTalkCalled;
  o["actualEvidenceGateRuntimeWiringPerformed"] = dr.actualEvidenceGateRuntimeWiringPerformed;
  o["actualEvidenceGateEvaluationPerformed"] = dr.actualEvidenceGateEvaluationPerformed;
  o["actualClaimAuthorizationPerformed"] = dr.actualClaimAuthorizationPerformed;
  o["actualDeadlineCalculationPerformed"] = dr.actualDeadlineCalculationPerformed;
  o["actualLiveRouteMutationPerformedInThisPhase"] = dr.actualLiveRouteMutationPerformedInThisPhase;
  o["actualSmartTalkRouteModifiedInThisPhase"] = dr.actualSmartTalkRouteModifiedInThisPhase;
  o["actualPhotoRouteModifiedInThisPhase"] = dr.actualPhotoRouteModifiedInThisPhase;
  o["actualPaidDocumentModeImplemented"] = dr.actualPaidDocumentModeImplemented;
  o["actualPaymentRuntimeImplemented"] = dr.actualPaymentRuntimeImplemented;
  o["actualCheckoutImplemented"] = dr.actualCheckoutImplemented;
  o["actualEntitlementRuntimeImplemented"] = dr.actualEntitlementRuntimeImplemented;
  o["actualServerEntitlementVerificationImplemented"] = dr.actualServerEntitlementVerificationImplemented;
  o["actualRealDocumentInputPerformed"] = dr.actualRealDocumentInputPerformed;
  o["actualRealDocumentProcessingPerformed"] = dr.actualRealDocumentProcessingPerformed;
  o["actualOcrPerformed"] = dr.actualOcrPerformed;
  o["actualPhotoInputProcessed"] = dr.actualPhotoInputProcessed;
  o["actualFileInputProcessed"] = dr.actualFileInputProcessed;
  o["actualDocumentStoragePerformed"] = dr.actualDocumentStoragePerformed;
  o["actualDatabasePersistencePerformed"] = dr.actualDatabasePersistencePerformed;
  o["actualAuditPersistencePerformed"] = dr.actualAuditPersistencePerformed;
  o["actualUserVisibleOutputPerformed"] = dr.actualUserVisibleOutputPerformed;
  o["actualPublicRuntimeEnabled"] = dr.actualPublicRuntimeEnabled;

  // 8.6E side-effect confirmations
  for (const se of SIDE_EFFECTS) o[`piiDryRunConfirms${se}`] = dr[`piiDryRunConfirms${se}` as keyof typeof dr];

  // Pipeline flags + runtime auth + shared
  for (const f of PIPELINE_FLAGS) o[f] = dr[f as keyof typeof dr];
  for (const f of RUNTIME_AUTH_FLAGS) o[f] = dr[f as keyof typeof dr];
  o["runtimeAuthorizationGranted"] = dr.runtimeAuthorizationGranted;
  o["pilotAuthorizationGranted"] = dr.pilotAuthorizationGranted;
  o["productionAuthorizationGranted"] = dr.productionAuthorizationGranted;
  o["finalAuthorizationGranted"] = dr.finalAuthorizationGranted;
  o["goLiveAuthorizationGranted"] = dr.goLiveAuthorizationGranted;
  o["exactDeadlineCalculationAuthorized"] = dr.exactDeadlineCalculationAuthorized;
  o["deliveryDateInventionAuthorized"] = dr.deliveryDateInventionAuthorized;
  o["finalDateInventionAuthorized"] = dr.finalDateInventionAuthorized;
  o["legalCertaintyAuthorized"] = dr.legalCertaintyAuthorized;
  o["coerciveLegalInstructionAuthorized"] = dr.coerciveLegalInstructionAuthorized;
  o["deliveryDateRequiredForExactDeadline"] = dr.deliveryDateRequiredForExactDeadline;

  // TD flags from 8.6E result
  o["td001DocumentBypassGuardContainmentClosed"] = dr.td001DocumentBypassGuardContainmentClosed;
  o["td005PaidDocumentModeBoundaryContainmentClosed"] = dr.td005PaidDocumentModeBoundaryContainmentClosed;
  o["td005PaidDocumentModeClientFlagBypassClosed"] = dr.td005PaidDocumentModeClientFlagBypassClosed;
  o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] = dr.td005PaidDocumentModeActualRuntimeImplementationDeferred;
  o["td004PreModelPiiRedactionPlanned"] = dr.td004PreModelPiiRedactionPlanned;
  o["td004PreModelPiiRedactionContracted"] = dr.td004PreModelPiiRedactionContracted;
  o["td004PreModelPiiRedactionImplementationPlanned"] = dr.td004PreModelPiiRedactionImplementationPlanned;
  o["td004PreModelPiiRedactionRuntimeContracted"] = dr.td004PreModelPiiRedactionRuntimeContracted;
  o["td004PreModelPiiRedactionDryRunImplemented"] = dr.td004PreModelPiiRedactionDryRunImplemented;
  o["td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract"] = dr.td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract;
  o["td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch"] = dr.td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch;
  o["td004PreModelPiiRedactionStillRequiresPostPatchAudit"] = dr.td004PreModelPiiRedactionStillRequiresPostPatchAudit;
  o["td004PreModelPiiRedactionStillRequiresClosureDecision"] = dr.td004PreModelPiiRedactionStillRequiresClosureDecision;
  o["td004PreModelPiiRedactionStillMissingInProduction"] = dr.td004PreModelPiiRedactionStillMissingInProduction;
  o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] = dr.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk;
  o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] = dr.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained;
  o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] = dr.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign;
  o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] = dr.td006EvidenceGateTodoAndOrSemanticsUnresolved;
  o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] = dr.td007TrapClaimDispositionNamespaceHardeningUnresolved;
  o["td008InMemoryRateLimiterServerlessUnsafe"] = dr.td008InMemoryRateLimiterServerlessUnsafe;
  o["td010GetUserStateDocumentTypeTodoOpen"] = dr.td010GetUserStateDocumentTypeTodoOpen;
  o["td009TmpDebugRunnerDebtClosed"] = dr.td009TmpDebugRunnerDebtClosed;
  o["tmpFilesPresentInWorkingTree"] = dr.tmpFilesPresentInWorkingTree;

  // 8.6E forward readiness
  o["readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract"] = dr.readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract;
  o["readyForEvidenceGatesProductionWiringPhase"] = dr.readyForEvidenceGatesProductionWiringPhase;
  o["readyForServerEntitlementVerificationPhase"] = dr.readyForServerEntitlementVerificationPhase;
  o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] = dr.readyForPaidDocumentModeActualRuntimeImplementationPhase;
  o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] = dr.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase;
  o["readyForControlledRealDocumentPilotAuthorizationPhase"] = dr.readyForControlledRealDocumentPilotAuthorizationPhase;
  o["readyForControlledRealDocumentProductionAuthorizationPhase"] = dr.readyForControlledRealDocumentProductionAuthorizationPhase;
  o["readyForRealDocumentInput"] = dr.readyForRealDocumentInput;
  o["readyForUserVisibleOutput"] = dr.readyForUserVisibleOutput;
  o["publicRuntimeEnabled"] = dr.publicRuntimeEnabled;
  o["persistenceUsed"] = dr.persistenceUsed;
  o["neverUserVisible"] = dr.neverUserVisible;

  // 8.6F core assertion flags
  o["preModelPiiRedactionDryRunReadyForRuntimeExecutionContract"] = true;
  o["preModelPiiRedactionRuntimeExecutionContractOnly"] = true;
  o["preModelPiiRedactionRuntimeExecutionContractDefined"] = true;
  o["preModelPiiRedactionProductionUtilityStillNotImplemented"] = true;

  // 8.6G authorization boundary (18)
  o["piiExecutionContractAuthorizesOnlyOneIsolatedUtilityFileIn8x6G"] = true;
  o["piiExecutionContractAuthorizesDeterministicHelperExportOnly"] = true;
  o["piiExecutionContractAuthorizesLocalTypesOnly"] = true;
  o["piiExecutionContractAuthorizesSyntheticTestableLogicOnly"] = true;
  o["piiExecutionContractDoesNotAuthorizeRoutePatchIn8x6G"] = true;
  o["piiExecutionContractDoesNotAuthorizeSmartTalkRouteModification"] = true;
  o["piiExecutionContractDoesNotAuthorizePhotoRouteModification"] = true;
  o["piiExecutionContractDoesNotAuthorizeRouteWiring"] = true;
  o["piiExecutionContractDoesNotAuthorizeRealUserDocumentProcessing"] = true;
  o["piiExecutionContractDoesNotAuthorizeModelFacingUse"] = true;
  o["piiExecutionContractDoesNotAuthorizeEvidenceGateExecution"] = true;
  o["piiExecutionContractDoesNotAuthorizeClaimAuthorization"] = true;
  o["piiExecutionContractDoesNotAuthorizeDeadlineCalculation"] = true;
  o["piiExecutionContractDoesNotAuthorizePersistence"] = true;
  o["piiExecutionContractDoesNotAuthorizeStorage"] = true;
  o["piiExecutionContractDoesNotAuthorizeUserVisibleOutput"] = true;
  o["piiExecutionContractDoesNotAuthorizePublicRuntime"] = true;
  o["piiExecutionContractDoesNotAuthorizePaymentCheckoutEntitlement"] = true;

  // Future utility boundary (24)
  for (const s of FUTURE_UTILITY_SUFFIXES) o[`piiExecutionContractRequiresFutureUtility${s}`] = true;

  // Detector categories (26)
  for (const s of DETECTOR_CAT_SUFFIXES) o[`piiExecutionContractRequiresDetector${s}`] = true;

  // Result model (12)
  for (const s of RESULT_MODEL_SUFFIXES) o[`piiExecutionContractRequiresResult${s}`] = true;

  // Hard stops (14)
  for (const s of HARD_STOP_SUFFIXES) o[`piiExecutionContractHardStop${s}`] = true;

  // Exec decision (7)
  o["piiExecutionContractAcceptsDryRunImplementation"] = true;
  o["piiExecutionContractMarksTd004RuntimeExecutionContractCompleted"] = true;
  o["piiExecutionContractKeepsSurgicalUtilityPatchRequired"] = true;
  o["piiExecutionContractKeepsPostPatchAuditRequired"] = true;
  o["piiExecutionContractKeepsClosureDecisionRequired"] = true;
  o["piiExecutionContractKeepsProductionPiiRedactionMissing"] = true;
  o["piiExecutionContractReadyFor8x6GSurgicalUtilityPatch"] = true;

  // 8.6F actual flags
  o["actualPiiRedactionRuntimeExecutionContractOnly"] = true;
  o["actualPiiRedactionProductionUtilityImplemented"] = false;
  o["actualPiiRedactionUtilityRuntimeImplemented"] = false;
  o["actualUtilityRuntimeFileCreatedInThisPhase"] = false;
  o["actualPiiRedactionImplemented"] = false;
  o["actualPiiDetectorRuntimeImplemented"] = false;
  o["actualPiiMaskingRuntimeImplemented"] = false;
  o["actualPiiTextRedactedFromRealInput"] = false;
  o["actualRealRawPiiProcessed"] = false;
  o["actualRawPiiPersisted"] = false;
  o["actualRawPiiLogged"] = false;
  o["actualPromptBuildPerformed"] = false;
  o["actualModelCallPerformed"] = false;
  o["actualRunSmartTalkCalled"] = false;
  o["actualEvidenceGateRuntimeWiringPerformed"] = false;
  o["actualEvidenceGateEvaluationPerformed"] = false;
  o["actualClaimAuthorizationPerformed"] = false;
  o["actualDeadlineCalculationPerformed"] = false;
  o["actualLiveRouteMutationPerformedInThisPhase"] = false;
  o["actualSmartTalkRouteModifiedInThisPhase"] = false;
  o["actualPhotoRouteModifiedInThisPhase"] = false;
  o["actualUserVisibleOutputPerformed"] = false;
  o["actualPublicRuntimeEnabled"] = false;

  // 8.6F side-effect confirmations
  for (const se of SIDE_EFFECTS) o[`piiExecutionContractConfirms${se}`] = true;

  // 8.6F TD result flags
  o["td004PreModelPiiRedactionRuntimeExecutionContracted"] = true;
  o["td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch"] = true;
  o["td004PreModelPiiRedactionStillRequiresPostPatchAudit"] = true;
  o["td004PreModelPiiRedactionStillRequiresClosureDecision"] = true;
  o["td004PreModelPiiRedactionStillMissingInProduction"] = true;

  // 8.6F forward readiness
  o["readyFor8x6GPreModelPiiRedactionSurgicalUtilityPatch"] = true;

  return o;
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x6FInput();
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Record<string, unknown>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateExecutionContractInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.6E prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.6F" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("prereq_rc_ready_for_dry_run_false", { preModelPiiRedactionRuntimeContractReadyForDryRunImplementation: false });
  expect_rejected("prereq_dry_run_not_accepted", { controlledRealDocumentPreModelPiiRedactionDryRunImplementationAccepted: false });
  expect_rejected("prereq_dry_run_only_false", { preModelPiiRedactionDryRunImplementationOnly: false });
  expect_rejected("prereq_dry_run_implemented_false", { preModelPiiRedactionDryRunImplemented: false });
  expect_rejected("prereq_production_utility_still_not_implemented_false", { preModelPiiRedactionProductionUtilityStillNotImplemented: false });
  expect_rejected("prereq_pii_redaction_runtime_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_detector_runtime_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_masking_runtime_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });
  expect_rejected("prereq_no_real_doc_input_false", { preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_no_user_visible_output_false", { preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("prereq_no_prompt_build_false", { preModelPiiRedactionDoesNotAuthorizePromptBuild: false });
  expect_rejected("prereq_no_model_call_false", { preModelPiiRedactionDoesNotAuthorizeModelCall: false });
  expect_rejected("prereq_no_run_smart_talk_false", { preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.6E dry-run case coverage (34)
  for (const dc of DRY_RUN_CASES) expect_rejected(`prereq_pii_dry_run_covers_${dc}_false`, { [`piiDryRunCovers${dc}`]: false });

  // 8.6E dry-run output model (12)
  for (const s of DRY_RUN_OUTPUT_SUPPORTS) expect_rejected(`prereq_pii_dry_run_supports_${s}_false`, { [`piiDryRunSupports${s}`]: false });
  expect_rejected("prereq_pii_dry_run_no_raw_map_false", { piiDryRunDoesNotReturnRawToPlaceholderMapByDefault: false });

  // 8.6E dry-run behavior (11)
  expect_rejected("prereq_pii_dry_run_synthetic_only_false", { piiDryRunUsesSyntheticLocalExpectedValuesOnly: false });
  expect_rejected("prereq_pii_dry_run_placeholders_deterministic_false", { piiDryRunSyntheticPlaceholdersDeterministic: false });
  expect_rejected("prereq_pii_dry_run_repeated_maps_same_false", { piiDryRunRepeatedSyntheticRawValueMapsToSamePlaceholder: false });
  expect_rejected("prereq_pii_dry_run_different_increment_false", { piiDryRunDifferentSyntheticValuesIncrementPlaceholders: false });
  expect_rejected("prereq_pii_dry_run_unsafe_blocked_false", { piiDryRunUnsafeUnresolvedCasesBlockedOrNeedsReview: false });
  expect_rejected("prereq_pii_dry_run_output_no_raw_pii_false", { piiDryRunOutputMetadataContainsNoRawPii: false });
  expect_rejected("prereq_pii_dry_run_did_not_process_real_false", { piiDryRunDidNotProcessRealText: false });
  expect_rejected("prereq_pii_dry_run_did_not_implement_production_false", { piiDryRunDidNotImplementProductionUtilityRuntime: false });
  expect_rejected("prereq_pii_dry_run_did_not_authorize_model_false", { piiDryRunDidNotAuthorizeModelFacingUse: false });
  expect_rejected("prereq_pii_dry_run_did_not_authorize_evidence_gate_false", { piiDryRunDidNotAuthorizeEvidenceGateExecution: false });
  expect_rejected("prereq_pii_dry_run_did_not_authorize_user_visible_false", { piiDryRunDidNotAuthorizeUserVisibleOutput: false });

  // 8.6E synthetic dry-run summary
  expect_rejected("prereq_synthetic_case_count_too_low", { syntheticDryRunCaseCount: 33 });
  expect_rejected("prereq_synthetic_all_cases_passed_false", { syntheticDryRunAllCasesPassed: false });
  expect_rejected("prereq_synthetic_raw_pii_leakage_true", { syntheticDryRunRawPiiLeakageDetected: true });
  expect_rejected("prereq_synthetic_stable_placeholder_false", { syntheticDryRunStablePlaceholderMappingConfirmed: false });
  expect_rejected("prereq_synthetic_unsafe_cases_blocked_false", { syntheticDryRunUnsafeCasesBlocked: false });
  expect_rejected("prereq_synthetic_no_runtime_auth_false", { syntheticDryRunNoRuntimeAuthorizationConfirmed: false });

  // 8.6E actual flag violations
  expect_rejected("prereq_actual_dry_run_impl_only_false", { actualPiiRedactionDryRunImplementationOnly: false });
  expect_rejected("prereq_actual_production_utility_true", { actualPiiRedactionProductionUtilityImplemented: true });
  expect_rejected("prereq_actual_utility_runtime_true", { actualPiiRedactionUtilityRuntimeImplemented: true });
  expect_rejected("prereq_actual_utility_file_created_true", { actualUtilityRuntimeFileCreatedInThisPhase: true });
  expect_rejected("prereq_actual_pii_redaction_true", { actualPiiRedactionImplemented: true });
  expect_rejected("prereq_actual_pii_detector_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_masking_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_text_redacted_from_real_true", { actualPiiTextRedactedFromRealInput: true });
  expect_rejected("prereq_actual_real_raw_pii_processed_true", { actualRealRawPiiProcessed: true });
  expect_rejected("prereq_actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("prereq_actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("prereq_actual_prompt_build_true", { actualPromptBuildPerformed: true });
  expect_rejected("prereq_actual_model_call_true", { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_true", { actualRunSmartTalkCalled: true });
  expect_rejected("prereq_actual_evidence_gate_wiring_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("prereq_actual_evidence_gate_evaluation_true", { actualEvidenceGateEvaluationPerformed: true });
  expect_rejected("prereq_actual_claim_auth_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("prereq_actual_deadline_calc_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("prereq_actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_paid_doc_mode_true", { actualPaidDocumentModeImplemented: true });
  expect_rejected("prereq_actual_payment_runtime_true", { actualPaymentRuntimeImplemented: true });
  expect_rejected("prereq_actual_checkout_true", { actualCheckoutImplemented: true });
  expect_rejected("prereq_actual_entitlement_true", { actualEntitlementRuntimeImplemented: true });
  expect_rejected("prereq_actual_server_entitlement_true", { actualServerEntitlementVerificationImplemented: true });
  expect_rejected("prereq_actual_real_doc_input_true", { actualRealDocumentInputPerformed: true });
  expect_rejected("prereq_actual_real_doc_processing_true", { actualRealDocumentProcessingPerformed: true });
  expect_rejected("prereq_actual_ocr_true", { actualOcrPerformed: true });
  expect_rejected("prereq_actual_photo_input_true", { actualPhotoInputProcessed: true });
  expect_rejected("prereq_actual_file_input_true", { actualFileInputProcessed: true });
  expect_rejected("prereq_actual_doc_storage_true", { actualDocumentStoragePerformed: true });
  expect_rejected("prereq_actual_db_persistence_true", { actualDatabasePersistencePerformed: true });
  expect_rejected("prereq_actual_audit_persistence_true", { actualAuditPersistencePerformed: true });
  expect_rejected("prereq_actual_user_visible_output_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("prereq_actual_public_runtime_true", { actualPublicRuntimeEnabled: true });

  // 8.6E side-effect violations
  for (const se of SIDE_EFFECTS) expect_rejected(`prereq_pii_dry_run_confirms_${se}_false`, { [`piiDryRunConfirms${se}`]: false });

  // Pipeline violations
  for (const f of PIPELINE_FLAGS) expect_rejected(`prereq_${f}_true`, { [f]: true });

  // Runtime auth violations
  for (const f of RUNTIME_AUTH_FLAGS) expect_rejected(`prereq_${f}_true`, { [f]: true });

  // Auth grants
  expect_rejected("prereq_runtime_auth_true", { runtimeAuthorizationGranted: true });
  expect_rejected("prereq_pilot_auth_true", { pilotAuthorizationGranted: true });
  expect_rejected("prereq_production_auth_true", { productionAuthorizationGranted: true });
  expect_rejected("prereq_final_auth_true", { finalAuthorizationGranted: true });
  expect_rejected("prereq_go_live_auth_true", { goLiveAuthorizationGranted: true });

  // Legal safety
  expect_rejected("prereq_exact_deadline_true", { exactDeadlineCalculationAuthorized: true });
  expect_rejected("prereq_delivery_date_invention_true", { deliveryDateInventionAuthorized: true });
  expect_rejected("prereq_final_date_invention_true", { finalDateInventionAuthorized: true });
  expect_rejected("prereq_legal_certainty_true", { legalCertaintyAuthorized: true });
  expect_rejected("prereq_coercive_legal_true", { coerciveLegalInstructionAuthorized: true });
  expect_rejected("prereq_delivery_date_required_false", { deliveryDateRequiredForExactDeadline: false });

  // TD flags
  expect_rejected("prereq_td001_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("prereq_td005_boundary_false", { td005PaidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("prereq_td005_client_flag_false", { td005PaidDocumentModeClientFlagBypassClosed: false });
  expect_rejected("prereq_td005_deferred_false", { td005PaidDocumentModeActualRuntimeImplementationDeferred: false });
  expect_rejected("prereq_td004_planned_false", { td004PreModelPiiRedactionPlanned: false });
  expect_rejected("prereq_td004_contracted_false", { td004PreModelPiiRedactionContracted: false });
  expect_rejected("prereq_td004_impl_planned_false", { td004PreModelPiiRedactionImplementationPlanned: false });
  expect_rejected("prereq_td004_runtime_contracted_false", { td004PreModelPiiRedactionRuntimeContracted: false });
  expect_rejected("prereq_td004_dry_run_implemented_false", { td004PreModelPiiRedactionDryRunImplemented: false });
  expect_rejected("prereq_td004_still_requires_runtime_exec_contract_false", { td004PreModelPiiRedactionStillRequiresRuntimeExecutionContract: false });
  expect_rejected("prereq_td004_still_requires_surgical_patch_false", { td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch: false });
  expect_rejected("prereq_td004_still_requires_post_patch_audit_false", { td004PreModelPiiRedactionStillRequiresPostPatchAudit: false });
  expect_rejected("prereq_td004_still_requires_closure_decision_false", { td004PreModelPiiRedactionStillRequiresClosureDecision: false });
  expect_rejected("prereq_td004_still_missing_false", { td004PreModelPiiRedactionStillMissingInProduction: false });
  expect_rejected("prereq_td002_false", { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("prereq_td003_contained_false", { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("prereq_td003_future_design_false", { td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: false });
  expect_rejected("prereq_td006_false", { td006EvidenceGateTodoAndOrSemanticsUnresolved: false });
  expect_rejected("prereq_td007_false", { td007TrapClaimDispositionNamespaceHardeningUnresolved: false });
  expect_rejected("prereq_td008_false", { td008InMemoryRateLimiterServerlessUnsafe: false });
  expect_rejected("prereq_td010_false", { td010GetUserStateDocumentTypeTodoOpen: false });
  expect_rejected("prereq_td009_false", { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("prereq_tmp_files_true", { tmpFilesPresentInWorkingTree: true });

  // 8.6E forward readiness gate
  expect_rejected("prereq_ready_for_8x6f_false", { readyFor8x6FPreModelPiiRedactionRuntimeExecutionContract: false });
  expect_rejected("prereq_ready_evidence_gates_true", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("prereq_ready_server_entitlement_true", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("prereq_ready_paid_doc_mode_true", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("prereq_ready_separate_runtime_auth_true", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("prereq_ready_pilot_true", { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("prereq_ready_production_true", { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("prereq_ready_real_doc_input_true", { readyForRealDocumentInput: true });
  expect_rejected("prereq_ready_user_visible_output_true", { readyForUserVisibleOutput: true });
  expect_rejected("prereq_public_runtime_true", { publicRuntimeEnabled: true });
  expect_rejected("prereq_persistence_used_true", { persistenceUsed: true });
  expect_rejected("prereq_never_user_visible_false", { neverUserVisible: false });

  // 8.6F core assertion flags
  expect_rejected("dry_run_ready_for_exec_contract_false", { preModelPiiRedactionDryRunReadyForRuntimeExecutionContract: false });
  expect_rejected("exec_contract_only_false", { preModelPiiRedactionRuntimeExecutionContractOnly: false });
  expect_rejected("exec_contract_defined_false", { preModelPiiRedactionRuntimeExecutionContractDefined: false });
  expect_rejected("production_utility_still_not_implemented_false", { preModelPiiRedactionProductionUtilityStillNotImplemented: false });
  expect_rejected("pii_redaction_runtime_still_not_implemented_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("pii_detector_runtime_still_not_implemented_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("pii_masking_runtime_still_not_implemented_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });

  // 8.6G authorization boundary (18)
  expect_rejected("pii_ec_authorizes_only_one_isolated_file_false", { piiExecutionContractAuthorizesOnlyOneIsolatedUtilityFileIn8x6G: false });
  expect_rejected("pii_ec_authorizes_deterministic_helper_export_only_false", { piiExecutionContractAuthorizesDeterministicHelperExportOnly: false });
  expect_rejected("pii_ec_authorizes_local_types_only_false", { piiExecutionContractAuthorizesLocalTypesOnly: false });
  expect_rejected("pii_ec_authorizes_synthetic_testable_logic_only_false", { piiExecutionContractAuthorizesSyntheticTestableLogicOnly: false });
  expect_rejected("pii_ec_no_route_patch_false", { piiExecutionContractDoesNotAuthorizeRoutePatchIn8x6G: false });
  expect_rejected("pii_ec_no_smart_talk_route_mod_false", { piiExecutionContractDoesNotAuthorizeSmartTalkRouteModification: false });
  expect_rejected("pii_ec_no_photo_route_mod_false", { piiExecutionContractDoesNotAuthorizePhotoRouteModification: false });
  expect_rejected("pii_ec_no_route_wiring_false", { piiExecutionContractDoesNotAuthorizeRouteWiring: false });
  expect_rejected("pii_ec_no_real_user_doc_processing_false", { piiExecutionContractDoesNotAuthorizeRealUserDocumentProcessing: false });
  expect_rejected("pii_ec_no_model_facing_use_false", { piiExecutionContractDoesNotAuthorizeModelFacingUse: false });
  expect_rejected("pii_ec_no_evidence_gate_execution_false", { piiExecutionContractDoesNotAuthorizeEvidenceGateExecution: false });
  expect_rejected("pii_ec_no_claim_authorization_false", { piiExecutionContractDoesNotAuthorizeClaimAuthorization: false });
  expect_rejected("pii_ec_no_deadline_calculation_false", { piiExecutionContractDoesNotAuthorizeDeadlineCalculation: false });
  expect_rejected("pii_ec_no_persistence_false", { piiExecutionContractDoesNotAuthorizePersistence: false });
  expect_rejected("pii_ec_no_storage_false", { piiExecutionContractDoesNotAuthorizeStorage: false });
  expect_rejected("pii_ec_no_user_visible_output_false", { piiExecutionContractDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("pii_ec_no_public_runtime_false", { piiExecutionContractDoesNotAuthorizePublicRuntime: false });
  expect_rejected("pii_ec_no_payment_checkout_entitlement_false", { piiExecutionContractDoesNotAuthorizePaymentCheckoutEntitlement: false });

  // Future utility boundary (24)
  for (const s of FUTURE_UTILITY_SUFFIXES) {
    expect_rejected(`pii_ec_requires_future_utility_${s}_false`, { [`piiExecutionContractRequiresFutureUtility${s}`]: false });
  }

  // Detector categories (26)
  for (const s of DETECTOR_CAT_SUFFIXES) {
    expect_rejected(`pii_ec_requires_detector_${s}_false`, { [`piiExecutionContractRequiresDetector${s}`]: false });
  }

  // Result model (12)
  for (const s of RESULT_MODEL_SUFFIXES) {
    expect_rejected(`pii_ec_requires_result_${s}_false`, { [`piiExecutionContractRequiresResult${s}`]: false });
  }

  // Hard stops (14)
  for (const s of HARD_STOP_SUFFIXES) {
    expect_rejected(`pii_ec_hard_stop_${s}_false`, { [`piiExecutionContractHardStop${s}`]: false });
  }

  // Exec decision (7)
  expect_rejected("pii_ec_accepts_dry_run_false", { piiExecutionContractAcceptsDryRunImplementation: false });
  expect_rejected("pii_ec_marks_td004_exec_contract_completed_false", { piiExecutionContractMarksTd004RuntimeExecutionContractCompleted: false });
  expect_rejected("pii_ec_keeps_surgical_patch_required_false", { piiExecutionContractKeepsSurgicalUtilityPatchRequired: false });
  expect_rejected("pii_ec_keeps_post_patch_audit_required_false", { piiExecutionContractKeepsPostPatchAuditRequired: false });
  expect_rejected("pii_ec_keeps_closure_decision_required_false", { piiExecutionContractKeepsClosureDecisionRequired: false });
  expect_rejected("pii_ec_keeps_production_missing_false", { piiExecutionContractKeepsProductionPiiRedactionMissing: false });
  expect_rejected("pii_ec_ready_for_8x6g_false", { piiExecutionContractReadyFor8x6GSurgicalUtilityPatch: false });

  // 8.6F actual flag violations
  expect_rejected("actual_exec_contract_only_false", { actualPiiRedactionRuntimeExecutionContractOnly: false });
  expect_rejected("actual_production_utility_implemented_true", { actualPiiRedactionProductionUtilityImplemented: true });
  expect_rejected("actual_utility_runtime_true", { actualPiiRedactionUtilityRuntimeImplemented: true });
  expect_rejected("actual_utility_file_created_true", { actualUtilityRuntimeFileCreatedInThisPhase: true });
  expect_rejected("actual_pii_redaction_true", { actualPiiRedactionImplemented: true });
  expect_rejected("actual_pii_detector_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("actual_pii_masking_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("actual_pii_text_redacted_from_real_true", { actualPiiTextRedactedFromRealInput: true });
  expect_rejected("actual_real_raw_pii_processed_true", { actualRealRawPiiProcessed: true });
  expect_rejected("actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("actual_prompt_build_true", { actualPromptBuildPerformed: true });
  expect_rejected("actual_model_call_true", { actualModelCallPerformed: true });
  expect_rejected("actual_run_smart_talk_true", { actualRunSmartTalkCalled: true });
  expect_rejected("actual_evidence_gate_wiring_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("actual_evidence_gate_evaluation_true", { actualEvidenceGateEvaluationPerformed: true });
  expect_rejected("actual_claim_auth_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calc_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("actual_user_visible_output_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("actual_public_runtime_true", { actualPublicRuntimeEnabled: true });

  // 8.6F side-effect violations
  for (const se of SIDE_EFFECTS) expect_rejected(`pii_ec_confirms_${se}_false`, { [`piiExecutionContractConfirms${se}`]: false });

  // Pipeline violations
  for (const f of PIPELINE_FLAGS) expect_rejected(`${f}_true_result`, { [f]: true });

  // Runtime auth violations
  for (const f of RUNTIME_AUTH_FLAGS) expect_rejected(`${f}_true_result`, { [f]: true });

  // Auth grant violations
  expect_rejected("runtime_auth_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_auth_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_auth_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_auth_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_auth_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety violation
  expect_rejected("exact_deadline_authorized_true", { exactDeadlineCalculationAuthorized: true });

  // 8.6F TD result violations
  expect_rejected("td004_runtime_execution_contracted_false", { td004PreModelPiiRedactionRuntimeExecutionContracted: false });
  expect_rejected("td004_still_requires_surgical_patch_false", { td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch: false });
  expect_rejected("td004_still_requires_post_patch_audit_false", { td004PreModelPiiRedactionStillRequiresPostPatchAudit: false });
  expect_rejected("td004_still_requires_closure_decision_false", { td004PreModelPiiRedactionStillRequiresClosureDecision: false });
  expect_rejected("td004_still_missing_in_production_false", { td004PreModelPiiRedactionStillMissingInProduction: false });

  // 8.6F forward readiness violations
  expect_rejected("ready_for_8x6g_surgical_utility_patch_false", { readyFor8x6GPreModelPiiRedactionSurgicalUtilityPatch: false });
  expect_rejected("ready_for_evidence_gates_true_result", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("ready_for_server_entitlement_true_result", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("ready_for_paid_doc_mode_true_result", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("ready_for_separate_runtime_auth_true_result", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_doc_input_true_result", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_result", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_true_result", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_result", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_result", { neverUserVisible: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPreModelPiiRedactionRuntimeExecutionContract(): ControlledRealDocumentPreModelPiiRedactionRuntimeExecutionContractResult {
  const canonical = buildCanonical8x6FInput();
  const validation = validateExecutionContractInput(canonical);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.6F",
    allPassed,
    preModelPiiRedactionDryRunReadyForRuntimeExecutionContract: true,
    controlledRealDocumentPreModelPiiRedactionRuntimeExecutionContractAccepted: allPassed,
    preModelPiiRedactionRuntimeExecutionContractOnly: true,
    preModelPiiRedactionRuntimeExecutionContractDefined: true,
    preModelPiiRedactionProductionUtilityStillNotImplemented: true,
    preModelPiiRedactionRuntimeStillNotImplemented: true,
    preModelPiiDetectorRuntimeStillNotImplemented: true,
    preModelPiiMaskingRuntimeStillNotImplemented: true,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: true,
    preModelPiiRedactionDoesNotAuthorizeModelCall: true,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true,
    tamperCasesRejected: tamperResult.allRejected,
    piiExecutionContractAuthorizesOnlyOneIsolatedUtilityFileIn8x6G: true,
    piiExecutionContractAuthorizesDeterministicHelperExportOnly: true,
    piiExecutionContractAuthorizesLocalTypesOnly: true,
    piiExecutionContractAuthorizesSyntheticTestableLogicOnly: true,
    piiExecutionContractDoesNotAuthorizeRoutePatchIn8x6G: true,
    piiExecutionContractDoesNotAuthorizeSmartTalkRouteModification: true,
    piiExecutionContractDoesNotAuthorizePhotoRouteModification: true,
    piiExecutionContractDoesNotAuthorizeRouteWiring: true,
    piiExecutionContractDoesNotAuthorizeRealUserDocumentProcessing: true,
    piiExecutionContractDoesNotAuthorizeModelFacingUse: true,
    piiExecutionContractDoesNotAuthorizeEvidenceGateExecution: true,
    piiExecutionContractDoesNotAuthorizeClaimAuthorization: true,
    piiExecutionContractDoesNotAuthorizeDeadlineCalculation: true,
    piiExecutionContractDoesNotAuthorizePersistence: true,
    piiExecutionContractDoesNotAuthorizeStorage: true,
    piiExecutionContractDoesNotAuthorizeUserVisibleOutput: true,
    piiExecutionContractDoesNotAuthorizePublicRuntime: true,
    piiExecutionContractDoesNotAuthorizePaymentCheckoutEntitlement: true,
    piiExecutionContractRequiresFutureUtilityIsolatedUnderSmartTalkTree: true,
    piiExecutionContractRequiresFutureUtilityNoRouteImports: true,
    piiExecutionContractRequiresFutureUtilityNoOpenAiFetchEnvSdk: true,
    piiExecutionContractRequiresFutureUtilityNoPersistence: true,
    piiExecutionContractRequiresFutureUtilityNoModelPromptRunSmartTalk: true,
    piiExecutionContractRequiresFutureUtilityExplicitTextAndLaneInput: true,
    piiExecutionContractRequiresFutureUtilityRejectEmptyInput: true,
    piiExecutionContractRequiresFutureUtilityRejectUnsupportedLanes: true,
    piiExecutionContractRequiresFutureUtilityRejectDocumentTextWithoutControlledLane: true,
    piiExecutionContractRequiresFutureUtilityNoClientFlagAuthorization: true,
    piiExecutionContractRequiresFutureUtilityStructuredSafeResult: true,
    piiExecutionContractRequiresFutureUtilityNoRawMapByDefault: true,
    piiExecutionContractRequiresFutureUtilityNoRawPiiInMetadata: true,
    piiExecutionContractRequiresFutureUtilitySafeForUserVisibleDefaultFalse: true,
    piiExecutionContractRequiresFutureUtilitySafeForModelDefaultFalseUnlessPassed: true,
    piiExecutionContractRequiresFutureUtilitySafeForEvidenceGatesDefaultFalseUnlessPassed: true,
    piiExecutionContractRequiresFutureUtilityBlockOrReviewHighRisk: true,
    piiExecutionContractRequiresFutureUtilityPreserveSemanticStructure: true,
    piiExecutionContractRequiresFutureUtilityNoFactInvention: true,
    piiExecutionContractRequiresFutureUtilityNoFalseDeadlineAlteration: true,
    piiExecutionContractRequiresFutureUtilityNoLegalSufficiencyClassification: true,
    piiExecutionContractRequiresFutureUtilityDeterministicPlaceholders: true,
    piiExecutionContractRequiresFutureUtilityRawMapLocalEphemeral: true,
    piiExecutionContractRequiresFutureUtilitySyntheticGovernanceValidationOnly: true,
    piiExecutionContractRequiresDetectorPersonNamesGermanGreetings: true,
    piiExecutionContractRequiresDetectorPostalAddresses: true,
    piiExecutionContractRequiresDetectorPhoneNumbers: true,
    piiExecutionContractRequiresDetectorEmailAddresses: true,
    piiExecutionContractRequiresDetectorDateOfBirth: true,
    piiExecutionContractRequiresDetectorCustomerNumbers: true,
    piiExecutionContractRequiresDetectorInsuranceNumbers: true,
    piiExecutionContractRequiresDetectorHealthInsuranceIdentifiers: true,
    piiExecutionContractRequiresDetectorTaxIds: true,
    piiExecutionContractRequiresDetectorSteuerId: true,
    piiExecutionContractRequiresDetectorSteuernummer: true,
    piiExecutionContractRequiresDetectorAktenzeichen: true,
    piiExecutionContractRequiresDetectorVorgangsnummer: true,
    piiExecutionContractRequiresDetectorCaseReferenceNumbers: true,
    piiExecutionContractRequiresDetectorIban: true,
    piiExecutionContractRequiresDetectorLicensePlates: true,
    piiExecutionContractRequiresDetectorSenderBlocks: true,
    piiExecutionContractRequiresDetectorRecipientBlocks: true,
    piiExecutionContractRequiresDetectorAuthorityContactBlocks: true,
    piiExecutionContractRequiresDetectorMedicalHealthIdentifiers: true,
    piiExecutionContractRequiresDetectorImmigrationResidenceIdentifiers: true,
    piiExecutionContractRequiresDetectorSocialBenefitIdentifiers: true,
    piiExecutionContractRequiresDetectorJobcenterBuergergeldIdentifiers: true,
    piiExecutionContractRequiresDetectorFamilienkasseKindergeldIdentifiers: true,
    piiExecutionContractRequiresDetectorAuslaenderbehoerdeIdentifiers: true,
    piiExecutionContractRequiresDetectorFinanzamtIdentifiers: true,
    piiExecutionContractRequiresResultStatus: true,
    piiExecutionContractRequiresResultRedactedText: true,
    piiExecutionContractRequiresResultPlaceholderCounts: true,
    piiExecutionContractRequiresResultPlaceholderCategories: true,
    piiExecutionContractRequiresResultDetectorSummaryWithoutRawValues: true,
    piiExecutionContractRequiresResultCoverageSummaryWithoutRawValues: true,
    piiExecutionContractRequiresResultUnresolvedRiskFlagsWithoutRawValues: true,
    piiExecutionContractRequiresResultBlockingReasonsWithoutRawValues: true,
    piiExecutionContractRequiresResultSafeForModel: true,
    piiExecutionContractRequiresResultSafeForEvidenceGates: true,
    piiExecutionContractRequiresResultSafeForUserVisibleOutputDefaultFalse: true,
    piiExecutionContractRequiresResultRawMapReturnedFalseByDefault: true,
    piiExecutionContractHardStopNoRoutePatch: true,
    piiExecutionContractHardStopNoRealDocumentInput: true,
    piiExecutionContractHardStopNoModelCall: true,
    piiExecutionContractHardStopNoPromptBuild: true,
    piiExecutionContractHardStopNoRunSmartTalkCall: true,
    piiExecutionContractHardStopNoEvidenceGateExecution: true,
    piiExecutionContractHardStopNoClaimAuthorization: true,
    piiExecutionContractHardStopNoExactDeadlineCalculation: true,
    piiExecutionContractHardStopNoUserVisibleDocumentExplanation: true,
    piiExecutionContractHardStopNoPublicRuntime: true,
    piiExecutionContractHardStopNoPersistence: true,
    piiExecutionContractHardStopNoStorage: true,
    piiExecutionContractHardStopNoPaymentCheckoutEntitlementRuntime: true,
    piiExecutionContractHardStopNoRuntimePilotProductionGoLiveAuthorization: true,
    piiExecutionContractAcceptsDryRunImplementation: true,
    piiExecutionContractMarksTd004RuntimeExecutionContractCompleted: true,
    piiExecutionContractKeepsSurgicalUtilityPatchRequired: true,
    piiExecutionContractKeepsPostPatchAuditRequired: true,
    piiExecutionContractKeepsClosureDecisionRequired: true,
    piiExecutionContractKeepsProductionPiiRedactionMissing: true,
    piiExecutionContractReadyFor8x6GSurgicalUtilityPatch: true,
    actualPiiRedactionRuntimeExecutionContractOnly: true,
    actualPiiRedactionProductionUtilityImplemented: false,
    actualPiiRedactionUtilityRuntimeImplemented: false,
    actualUtilityRuntimeFileCreatedInThisPhase: false,
    actualPiiRedactionImplemented: false,
    actualPiiDetectorRuntimeImplemented: false,
    actualPiiMaskingRuntimeImplemented: false,
    actualPiiTextRedactedFromRealInput: false,
    actualRealRawPiiProcessed: false,
    actualRawPiiPersisted: false,
    actualRawPiiLogged: false,
    actualPromptBuildPerformed: false,
    actualModelCallPerformed: false,
    actualRunSmartTalkCalled: false,
    actualEvidenceGateRuntimeWiringPerformed: false,
    actualEvidenceGateEvaluationPerformed: false,
    actualClaimAuthorizationPerformed: false,
    actualDeadlineCalculationPerformed: false,
    actualLiveRouteMutationPerformedInThisPhase: false,
    actualSmartTalkRouteModifiedInThisPhase: false,
    actualPhotoRouteModifiedInThisPhase: false,
    actualPaidDocumentModeImplemented: false,
    actualPaymentRuntimeImplemented: false,
    actualCheckoutImplemented: false,
    actualEntitlementRuntimeImplemented: false,
    actualServerEntitlementVerificationImplemented: false,
    actualRealDocumentInputPerformed: false,
    actualRealDocumentProcessingPerformed: false,
    actualOcrPerformed: false,
    actualPhotoInputProcessed: false,
    actualFileInputProcessed: false,
    actualDocumentStoragePerformed: false,
    actualDatabasePersistencePerformed: false,
    actualAuditPersistencePerformed: false,
    actualUserVisibleOutputPerformed: false,
    actualPublicRuntimeEnabled: false,
    piiExecutionContractConfirmsNoOpenAiCall: true,
    piiExecutionContractConfirmsNoFetchCall: true,
    piiExecutionContractConfirmsNoProcessEnvRead: true,
    piiExecutionContractConfirmsNoSdkUsage: true,
    piiExecutionContractConfirmsNo8x3AcRerun: true,
    piiExecutionContractConfirmsNoPaymentRuntimeCall: true,
    piiExecutionContractConfirmsNoStripeCall: true,
    piiExecutionContractConfirmsNoCheckoutCall: true,
    piiExecutionContractConfirmsNoEntitlementRuntimeCall: true,
    piiExecutionContractConfirmsNoServerEntitlementVerification: true,
    piiExecutionContractConfirmsNoOcrRuntimeCall: true,
    piiExecutionContractConfirmsNoStorageMutation: true,
    piiExecutionContractConfirmsNoDatabaseWrite: true,
    piiExecutionContractConfirmsNoAuditPersistence: true,
    piiExecutionContractConfirmsNoUserVisibleDocumentExplanation: true,
    piiExecutionContractConfirmsNoEvidenceEvaluation: true,
    piiExecutionContractConfirmsNoClaimAuthorization: true,
    piiExecutionContractConfirmsNoDeadlineCalculation: true,
    piiExecutionContractConfirmsNoLegalCertainty: true,
    piiExecutionContractConfirmsNoPromptBuild: true,
    piiExecutionContractConfirmsNoModelCall: true,
    piiExecutionContractConfirmsNoRunSmartTalkCall: true,
    piiExecutionContractConfirmsNoRouteHandlerCall: true,
    piiExecutionContractConfirmsNoRouteImport: true,
    piiExecutionContractConfirmsNoFilesystemRead: true,
    piiExecutionContractConfirmsNoPhotoRouteModification: true,
    executionSequenceActuallyExecuted: false,
    runtimePipelineActuallyExecuted: false,
    documentPipelineActuallyExecuted: false,
    piiProductionPipelineActuallyExecuted: false,
    paymentPipelineActuallyExecuted: false,
    entitlementPipelineActuallyExecuted: false,
    checkoutPipelineActuallyExecuted: false,
    ocrPipelineActuallyExecuted: false,
    userVisiblePipelineActuallyExecuted: false,
    preModelPiiRedactionRuntimeAuthorizedNow: false,
    realDocumentInputAuthorizedNow: false,
    realDocumentProcessingAuthorizedNow: false,
    realUserDocumentUploadAuthorizedNow: false,
    ocrRuntimeAuthorizedNow: false,
    photoInputAuthorizedNow: false,
    fileInputAuthorizedNow: false,
    documentStorageAuthorizedNow: false,
    persistenceAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    userVisibleLegalDeadlineOutputAuthorizedNow: false,
    liveLLMRuntimeAuthorizedNow: false,
    connectedAiRuntimeAuthorizedNow: false,
    pilotRuntimeAuthorizedNow: false,
    productionRuntimeAuthorizedNow: false,
    paidDocumentModeRuntimeAuthorizedNow: false,
    paymentRuntimeAuthorizedNow: false,
    entitlementRuntimeAuthorizedNow: false,
    checkoutRuntimeAuthorizedNow: false,
    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,
    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,
    td001DocumentBypassGuardContainmentClosed: true,
    td005PaidDocumentModeBoundaryContainmentClosed: true,
    td005PaidDocumentModeClientFlagBypassClosed: true,
    td005PaidDocumentModeActualRuntimeImplementationDeferred: true,
    td004PreModelPiiRedactionPlanned: true,
    td004PreModelPiiRedactionContracted: true,
    td004PreModelPiiRedactionImplementationPlanned: true,
    td004PreModelPiiRedactionRuntimeContracted: true,
    td004PreModelPiiRedactionDryRunImplemented: true,
    td004PreModelPiiRedactionRuntimeExecutionContracted: true,
    td004PreModelPiiRedactionStillRequiresSurgicalUtilityPatch: true,
    td004PreModelPiiRedactionStillRequiresPostPatchAudit: true,
    td004PreModelPiiRedactionStillRequiresClosureDecision: true,
    td004PreModelPiiRedactionStillMissingInProduction: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true,
    td006EvidenceGateTodoAndOrSemanticsUnresolved: true,
    td007TrapClaimDispositionNamespaceHardeningUnresolved: true,
    td008InMemoryRateLimiterServerlessUnsafe: true,
    td010GetUserStateDocumentTypeTodoOpen: true,
    td009TmpDebugRunnerDebtClosed: true,
    tmpFilesPresentInWorkingTree: false,
    readyFor8x6GPreModelPiiRedactionSurgicalUtilityPatch: true,
    readyForEvidenceGatesProductionWiringPhase: false,
    readyForServerEntitlementVerificationPhase: false,
    readyForPaidDocumentModeActualRuntimeImplementationPhase: false,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes: [
      "8.6F is a Pre-Model PII Redaction Runtime Execution Contract.",
      "8.6F depends on completed 8.6E Pre-Model PII Redaction Dry-Run Implementation.",
      "8.6F is runtime-execution-contract-only and creates no production runtime behavior.",
      "8.6F does not modify /api/smart-talk.",
      "8.6F does not modify /api/smart-talk-photo.",
      "8.6F defines the execution contract for a future isolated deterministic PII redaction utility patch.",
      "8.6F does not implement the production PII redaction utility.",
      "8.6F does not create a utility runtime file.",
      "8.6F does not implement production PII redaction runtime.",
      "8.6F does not implement production PII detector runtime.",
      "8.6F does not implement production PII masking runtime.",
      "8.6F does not redact real text.",
      "8.6F does not process real raw PII.",
      "8.6F does not authorize real document input.",
      "8.6F does not authorize user-visible output.",
      "8.6F does not authorize prompt build, model call, or runSmartTalk.",
      "Payment, checkout, and entitlement runtime were not implemented.",
      "Server entitlement verification runtime was not implemented.",
      "Paid Document Mode runtime was not implemented.",
      "Document processing runtime was not implemented.",
      "No real document input or processing was performed.",
      "No OCR/photo/file/storage/persistence was performed.",
      "No prompt build, model call, or runSmartTalk call was performed by this validation.",
      "No user-visible document explanation was enabled.",
      "No public runtime was enabled.",
      "No runtime/pilot/production/final/go-live authorization was granted.",
      "TD-004 runtime execution contract is complete but production PII redaction remains missing.",
      "TD-004 still requires surgical utility patch, post-patch audit, and closure decision.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyFor8x6GPreModelPiiRedactionSurgicalUtilityPatch is surgical utility patch readiness only, not route wiring or real document/pilot/production authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
