/**
 * Phase 8.6C — Controlled Real Document Pre-Model PII Redaction Implementation Plan.
 *
 * IMPLEMENTATION-PLAN-ONLY — NO RUNTIME BEHAVIOR — DEPENDS ON 8.6B.
 *
 * Defines future implementation design for a deterministic pre-model PII redaction
 * boundary. Does NOT create any runtime utility, route patch, or PII processing.
 */

import { runControlledRealDocumentPreModelPiiRedactionContract } from "./run-controlled-real-document-pre-model-pii-redaction-contract";

// ── Shared arrays used in validator and tamper runner ────────────────────────

const PII_CLASSES = ["PersonNames","PostalAddresses","PhoneNumbers","EmailAddresses","DatesOfBirth","CustomerNumbers","InsuranceNumbers","HealthInsuranceIdentifiers","TaxIds","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumbers","Iban","BankAccountIdentifiers","LicensePlateNumbers","EmployerNamesInPersonalContext","Signatures","HandwrittenNames","GreetingsContainingPersonalNames","DocumentRecipientBlocks","SenderBlocks","RealContactDetails","RealAuthorityContactBlocksCopiedFromDocuments","MedicalHealthContextIdentifiers","ImmigrationResidencePermitIdentifiers","SocialBenefitIdentifiers","JobcenterBuergergeldIdentifiers","FamilienkasseKindergeldIdentifiers","AuslaenderbehoerdeIdentifiers","FinanzamtIdentifiers"] as const;

const REDACTION_REQS = ["DeterministicPlaceholders","StablePlaceholderMappingInsideOneRequest","NoRawPiiPersistenceByDefault","NoRawPiiInPrompt","NoRawPiiInLogs","NoRawPiiInAuditTraces","NoRawPiiInUserVisibleErrorMessages","NoRawPiiInTelemetry","NoRawPiiInModelMetadata","NoRawPiiInEvidenceGateTraces","NoRawPiiInDeadlineTraces","RawToPlaceholderMapLocalEphemeralByDefault","StructuredRedactionAuditWithoutRawValues","CoverageMetricsWithoutRawValues","ConservativeFallbackWhenConfidenceUncertain","BlockOrEscalateIfUnsafeToRedact"] as const;

const PLACEHOLDERS = ["Person","Address","Phone","Email","Dob","CustomerId","InsuranceId","TaxId","CaseRef","Iban","Authority","Employer","Signature","DocumentRecipient","DocumentSender"] as const;

const CONTRACT_SAFETY_KEYS = ["piiContractPreservesLegalSemanticStructureWherePossible","piiContractMustNotInventMissingFacts","piiContractMustNotAlterDatesIntoFalseDeadlines","piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion","piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity","piiContractMustNotInferRecipientIdentityFromPartialText","piiContractMustNotInferSenderIdentityFromPartialText","piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone","piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice","piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation","piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer","piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation"] as const;

const FAILURE_MODES = ["PiiRedactionRequired","PiiRedactionIncomplete","PiiRedactionConfidenceLow","PiiRedactionUnsafeForModel","BlockedHighRiskIdentifier","BlockedMedicalIdentifier","BlockedImmigrationIdentifier","BlockedFinancialIdentifier","BlockedUnknownDocumentIdentity"] as const;

const CONTRACT_DOWNSTREAM_KEYS = ["piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly","piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly","piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized","piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly","piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence","piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized","piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts"] as const;

const PIPELINE_FLAGS = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"] as const;

const RUNTIME_AUTH_FLAGS = ["preModelPiiRedactionRuntimeAuthorizedNow","realDocumentInputAuthorizedNow","realDocumentProcessingAuthorizedNow","realUserDocumentUploadAuthorizedNow","ocrRuntimeAuthorizedNow","photoInputAuthorizedNow","fileInputAuthorizedNow","documentStorageAuthorizedNow","persistenceAuthorizedNow","publicRuntimeAuthorizedNow","userVisibleLegalDeadlineOutputAuthorizedNow","liveLLMRuntimeAuthorizedNow","connectedAiRuntimeAuthorizedNow","pilotRuntimeAuthorizedNow","productionRuntimeAuthorizedNow","paidDocumentModeRuntimeAuthorizedNow","paymentRuntimeAuthorizedNow","entitlementRuntimeAuthorizedNow","checkoutRuntimeAuthorizedNow"] as const;

const CONTRACT_SIDE_EFFECTS = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"] as const;

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPreModelPiiRedactionImplementationPlanResult {
  readonly checkId: "8.6C";
  readonly allPassed: boolean;
  readonly preModelPiiRedactionContractReadyForImplementationPlan: true;
  readonly controlledRealDocumentPreModelPiiRedactionImplementationPlanAccepted: boolean;
  readonly preModelPiiRedactionImplementationPlanOnly: true;
  readonly preModelPiiRedactionImplementationPlanDefined: true;
  readonly preModelPiiRedactionRuntimeStillNotImplemented: true;
  readonly preModelPiiDetectorRuntimeStillNotImplemented: true;
  readonly preModelPiiMaskingRuntimeStillNotImplemented: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true;
  readonly preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true;
  readonly preModelPiiRedactionDoesNotAuthorizePromptBuild: true;
  readonly preModelPiiRedactionDoesNotAuthorizeModelCall: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true;
  readonly tamperCasesRejected: boolean;
  // Implementation layer confirmations
  readonly piiImplementationPlanDefinesInputBoundaryLayer: true;
  readonly piiImplementationPlanDefinesDetectionLayer: true;
  readonly piiImplementationPlanDefinesPlaceholderLayer: true;
  readonly piiImplementationPlanDefinesRedactedArtifactLayer: true;
  readonly piiImplementationPlanDefinesFailureHandlingLayer: true;
  readonly piiImplementationPlanDefinesDownstreamBoundaryLayer: true;
  readonly piiImplementationPlanDefinesTestStrategyLayer: true;
  // Input boundary layer
  readonly piiImplementationPlanInputRequiresControlledValidatedTextOnly: true;
  readonly piiImplementationPlanInputRejectsIfValidationMissing: true;
  readonly piiImplementationPlanInputRunsBeforePromptBuild: true;
  readonly piiImplementationPlanInputRunsBeforeModelCall: true;
  readonly piiImplementationPlanInputRunsBeforeRunSmartTalkDocumentLane: true;
  readonly piiImplementationPlanInputRunsBeforeEvidenceGateEvaluation: true;
  readonly piiImplementationPlanInputDoesNotCreateFreeQaDocumentBypass: true;
  // Detection layer
  readonly piiImplementationPlanDetectionUsesDeterministicPatterns: true;
  readonly piiImplementationPlanDetectionSupportsStructuredHits: true;
  readonly piiImplementationPlanDetectionIncludesCategorySpanConfidenceReason: true;
  readonly piiImplementationPlanDetectionDoesNotUseLlmBeforeModelFacingText: true;
  readonly piiImplementationPlanDetectionClassifiesConservatively: true;
  readonly piiImplementationPlanDetectionCoversGermanBureaucracyIdentifiers: true;
  readonly piiImplementationPlanDetectionCoversGermanDocumentContactBlocks: true;
  // Placeholder layer
  readonly piiImplementationPlanPlaceholderUsesDeterministicPlaceholders: true;
  readonly piiImplementationPlanPlaceholderMaintainsStableMappingInsideOneRequest: true;
  readonly piiImplementationPlanPlaceholderPreservesCategorySpecificTypes: true;
  readonly piiImplementationPlanPlaceholderDoesNotPersistRawMapByDefault: true;
  readonly piiImplementationPlanPlaceholderAvoidsIrreversibleSemanticDeletion: true;
  readonly piiImplementationPlanPlaceholderPreservesDocumentStructure: true;
  // Redacted artifact layer
  readonly piiImplementationPlanArtifactOutputsRedactedText: true;
  readonly piiImplementationPlanArtifactOutputsPlaceholderMetadataWithoutRawValues: true;
  readonly piiImplementationPlanArtifactOutputsCoverageMetricsWithoutRawValues: true;
  readonly piiImplementationPlanArtifactOutputsUnresolvedHighRiskFlagsWithoutRawValues: true;
  readonly piiImplementationPlanArtifactOutputsSafeStatus: true;
  readonly piiImplementationPlanArtifactNeverOutputsRawPiiToUnsafeSinks: true;
  // Failure handling
  readonly piiImplementationPlanFailureBlocksOrEscalatesLowConfidence: true;
  readonly piiImplementationPlanFailureBlocksOrEscalatesHighRiskUnsafeIdentifiers: true;
  readonly piiImplementationPlanFailureBlocksOrEscalatesMedicalImmigrationFinancialUnsafeIdentifiers: true;
  readonly piiImplementationPlanFailureBlocksUnknownDocumentIdentityIfUnsafe: true;
  readonly piiImplementationPlanFailureNeverSilentlyPassesUnredactedContent: true;
  // Downstream boundary
  readonly piiImplementationPlanDownstreamEvidenceGatesUseRedactedOrIsolatedContentOnly: true;
  readonly piiImplementationPlanDownstreamClaimAuthorizationUsesRedactedAnchorsOnly: true;
  readonly piiImplementationPlanDownstreamDeadlineLogicStillRequiresDeliveryDateEvidence: true;
  readonly piiImplementationPlanDownstreamUserVisibleOutputDoesNotRevealRawPiiUnlessSeparatelyAuthorized: true;
  readonly piiImplementationPlanDownstreamStoragePersistenceRemainBlocked: true;
  readonly piiImplementationPlanDownstreamPaidDocumentRuntimeRemainsBlockedUntilRequiredContracts: true;
  // Test strategy
  readonly piiImplementationPlanTestsSyntheticGermanBureaucracyLetters: true;
  readonly piiImplementationPlanTestsMultilingualUserTextAroundGermanDocuments: true;
  readonly piiImplementationPlanTestsMixedDocumentUserCommentary: true;
  readonly piiImplementationPlanTestsAllContractedIdentifierClasses: true;
  readonly piiImplementationPlanTestsFalsePositiveControls: true;
  readonly piiImplementationPlanTestsRedactionStability: true;
  readonly piiImplementationPlanTestsNoRawPiiInOutputAssertions: true;
  readonly piiImplementationPlanTestsNoRuntimeAuthorizationAssertions: true;
  // Architecture constraints
  readonly piiImplementationPlanRequiresPureUtilityOrIsolatedGovernanceHelperFirst: true;
  readonly piiImplementationPlanDoesNotPatchSmartTalkRouteNow: true;
  readonly piiImplementationPlanDoesNotPatchPhotoRouteNow: true;
  readonly piiImplementationPlanDoesNotAddPersistence: true;
  readonly piiImplementationPlanDoesNotAddModelCalls: true;
  readonly piiImplementationPlanDoesNotAddPromptBuilding: true;
  readonly piiImplementationPlanDoesNotAddEntitlementLogic: true;
  readonly piiImplementationPlanDoesNotAddPaymentLogic: true;
  readonly piiImplementationPlanDoesNotAddUserVisibleDocumentAnswerLogic: true;
  readonly piiImplementationPlanDoesNotEnablePublicRuntime: true;
  // Sequencing
  readonly piiImplementationPlanNextPhase8x6DIsRuntimeContract: true;
  readonly piiImplementationPlanThen8x6EIsDryRunImplementation: true;
  readonly piiImplementationPlanThen8x6FIsRuntimeExecutionContract: true;
  readonly piiImplementationPlanThen8x6GIsSurgicalUtilityPatch: true;
  readonly piiImplementationPlanThen8x6HIsPostPatchAudit: true;
  readonly piiImplementationPlanThen8x6IIsClosureDecision: true;
  readonly piiImplementationPlanDoesNotSkipToRuntimeImplementation: true;
  readonly piiImplementationPlanDoesNotCreateUtilityRuntimeFileNow: true;
  readonly piiImplementationPlanDoesNotModifyRuntimeRouteNow: true;
  // Actual flags
  readonly actualPiiRedactionImplementationPlanOnly: true;
  readonly actualPiiRedactionImplemented: false;
  readonly actualPiiDetectorRuntimeImplemented: false;
  readonly actualPiiMaskingRuntimeImplemented: false;
  readonly actualPiiTextRedacted: false;
  readonly actualRawPiiProcessed: false;
  readonly actualRawPiiPersisted: false;
  readonly actualRawPiiLogged: false;
  readonly actualPromptBuildPerformed: false;
  readonly actualModelCallPerformed: false;
  readonly actualRunSmartTalkCalled: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;
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
  // Side-effect confirmations
  readonly piiImplementationPlanConfirmsNoOpenAiCall: true;
  readonly piiImplementationPlanConfirmsNoFetchCall: true;
  readonly piiImplementationPlanConfirmsNoProcessEnvRead: true;
  readonly piiImplementationPlanConfirmsNoSdkUsage: true;
  readonly piiImplementationPlanConfirmsNo8x3AcRerun: true;
  readonly piiImplementationPlanConfirmsNoPaymentRuntimeCall: true;
  readonly piiImplementationPlanConfirmsNoStripeCall: true;
  readonly piiImplementationPlanConfirmsNoCheckoutCall: true;
  readonly piiImplementationPlanConfirmsNoEntitlementRuntimeCall: true;
  readonly piiImplementationPlanConfirmsNoServerEntitlementVerification: true;
  readonly piiImplementationPlanConfirmsNoOcrRuntimeCall: true;
  readonly piiImplementationPlanConfirmsNoStorageMutation: true;
  readonly piiImplementationPlanConfirmsNoDatabaseWrite: true;
  readonly piiImplementationPlanConfirmsNoAuditPersistence: true;
  readonly piiImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true;
  readonly piiImplementationPlanConfirmsNoEvidenceEvaluation: true;
  readonly piiImplementationPlanConfirmsNoClaimAuthorization: true;
  readonly piiImplementationPlanConfirmsNoDeadlineCalculation: true;
  readonly piiImplementationPlanConfirmsNoLegalCertainty: true;
  readonly piiImplementationPlanConfirmsNoPromptBuild: true;
  readonly piiImplementationPlanConfirmsNoModelCall: true;
  readonly piiImplementationPlanConfirmsNoRunSmartTalkCall: true;
  readonly piiImplementationPlanConfirmsNoRouteHandlerCall: true;
  readonly piiImplementationPlanConfirmsNoRouteImport: true;
  readonly piiImplementationPlanConfirmsNoFilesystemRead: true;
  readonly piiImplementationPlanConfirmsNoPhotoRouteModification: true;
  // Pipeline flags
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly piiPipelineActuallyExecuted: false;
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
  readonly td004PreModelPiiRedactionStillRequiresRuntimeContract: true;
  readonly td004PreModelPiiRedactionStillRequiresRuntimeImplementation: true;
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
  readonly readyFor8x6DPreModelPiiRedactionRuntimeContract: true;
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

function validateImplementationPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.6B prerequisite gate — core
  if (o["prereqCheckId"] !== "8.6B") reasons.push("prereq_check_id_must_be_8x6B");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["preModelPiiRedactionPlanReadyForContract"] !== true) reasons.push("prereq_plan_ready_for_contract_false");
  if (o["controlledRealDocumentPreModelPiiRedactionContractAccepted"] !== true) reasons.push("prereq_contract_not_accepted");
  if (o["preModelPiiRedactionContractOnly"] !== true) reasons.push("prereq_contract_only_false");
  if (o["preModelPiiRedactionContractDefined"] !== true) reasons.push("prereq_contract_defined_false");
  if (o["preModelPiiRedactionRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_redaction_runtime_still_not_implemented_false");
  if (o["preModelPiiDetectorRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_detector_runtime_still_not_implemented_false");
  if (o["preModelPiiMaskingRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_masking_runtime_still_not_implemented_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("prereq_pii_redaction_does_not_authorize_real_document_input_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("prereq_pii_redaction_does_not_authorize_user_visible_output_false");
  if (o["preModelPiiRedactionDoesNotAuthorizePromptBuild"] !== true) reasons.push("prereq_pii_redaction_does_not_authorize_prompt_build_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeModelCall"] !== true) reasons.push("prereq_pii_redaction_does_not_authorize_model_call_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRunSmartTalk"] !== true) reasons.push("prereq_pii_redaction_does_not_authorize_run_smart_talk_false");
  if (o["prereqTamperCasesRejected"] !== true) reasons.push("prereq_tamper_cases_rejected_false");

  // 8.6B contract boundary obligations (10)
  if (o["piiContractRequiresBoundaryBeforePromptBuild"] !== true) reasons.push("prereq_pii_contract_boundary_before_prompt_build_false");
  if (o["piiContractRequiresBoundaryBeforeModelCall"] !== true) reasons.push("prereq_pii_contract_boundary_before_model_call_false");
  if (o["piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane"] !== true) reasons.push("prereq_pii_contract_boundary_before_run_smart_talk_false");
  if (o["piiContractRequiresBoundaryAfterControlledInputValidation"] !== true) reasons.push("prereq_pii_contract_boundary_after_controlled_input_validation_false");
  if (o["piiContractRequiresBoundaryBeforeEvidenceGateEvaluation"] !== true) reasons.push("prereq_pii_contract_boundary_before_evidence_gate_false");
  if (o["piiContractDoesNotCreateFreeQaDocumentBypass"] !== true) reasons.push("prereq_pii_contract_no_free_qa_bypass_false");
  if (o["piiContractDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("prereq_pii_contract_no_real_doc_input_false");
  if (o["piiContractDoesNotAuthorizeUserVisibleDocumentOutput"] !== true) reasons.push("prereq_pii_contract_no_user_visible_doc_output_false");
  if (o["piiContractDoesNotAuthorizeExactDeadlineCalculation"] !== true) reasons.push("prereq_pii_contract_no_exact_deadline_false");
  if (o["piiContractDoesNotAuthorizePublicRuntime"] !== true) reasons.push("prereq_pii_contract_no_public_runtime_false");

  // 8.6B contract PII class coverage (32)
  for (const cls of PII_CLASSES) {
    if (o[`piiContractCovers${cls}`] !== true) reasons.push(`prereq_pii_contract_covers_${cls}_false`);
  }

  // 8.6B contract redaction/masking obligations (16)
  for (const req of REDACTION_REQS) {
    if (o[`piiContractRequires${req}`] !== true) reasons.push(`prereq_pii_contract_requires_${req}_false`);
  }

  // 8.6B contract placeholder obligations (15)
  for (const ph of PLACEHOLDERS) {
    if (o[`piiContractAllows${ph}Placeholder`] !== true) reasons.push(`prereq_pii_contract_allows_${ph}_placeholder_false`);
  }

  // 8.6B contract safety obligations (12)
  for (const k of CONTRACT_SAFETY_KEYS) {
    if (o[k] !== true) reasons.push(`prereq_${k}_false`);
  }

  // 8.6B contract failure mode obligations (9)
  for (const fm of FAILURE_MODES) {
    if (o[`piiContractDefinesFailure${fm}`] !== true) reasons.push(`prereq_pii_contract_defines_failure_${fm}_false`);
  }

  // 8.6B contract downstream obligations (7)
  for (const k of CONTRACT_DOWNSTREAM_KEYS) {
    if (o[k] !== true) reasons.push(`prereq_${k}_false`);
  }

  // 8.6B contract decision confirmations (9)
  if (o["piiContractAcceptsPlan"] !== true) reasons.push("prereq_pii_contract_accepts_plan_false");
  if (o["piiContractReadyForFutureImplementationPlan"] !== true) reasons.push("prereq_pii_contract_ready_for_future_implementation_plan_false");
  if (o["piiContractDoesNotAuthorizeRuntimeImplementationNow"] !== true) reasons.push("prereq_pii_contract_no_runtime_implementation_now_false");
  if (o["piiContractDoesNotAuthorizePiiProcessingNow"] !== true) reasons.push("prereq_pii_contract_no_pii_processing_now_false");
  if (o["piiContractDoesNotAuthorizeRawPiiHandlingNow"] !== true) reasons.push("prereq_pii_contract_no_raw_pii_handling_now_false");
  if (o["piiContractDoesNotAuthorizeDocumentProcessingNow"] !== true) reasons.push("prereq_pii_contract_no_document_processing_now_false");
  if (o["piiContractDoesNotAuthorizePromptBuildNow"] !== true) reasons.push("prereq_pii_contract_no_prompt_build_now_false");
  if (o["piiContractDoesNotAuthorizeModelCallNow"] !== true) reasons.push("prereq_pii_contract_no_model_call_now_false");
  if (o["piiContractDoesNotAuthorizeRunSmartTalkNow"] !== true) reasons.push("prereq_pii_contract_no_run_smart_talk_now_false");

  // 8.6B actual flags
  if (o["actualPiiRedactionContractOnly"] !== true) reasons.push("prereq_actual_pii_redaction_contract_only_must_be_true");
  if (o["actualPiiRedactionImplemented"] !== false) reasons.push("prereq_actual_pii_redaction_implemented_must_be_false");
  if (o["actualPiiDetectorRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_detector_runtime_must_be_false");
  if (o["actualPiiMaskingRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_masking_runtime_must_be_false");
  if (o["actualPiiTextRedacted"] !== false) reasons.push("prereq_actual_pii_text_redacted_must_be_false");
  if (o["actualRawPiiProcessed"] !== false) reasons.push("prereq_actual_raw_pii_processed_must_be_false");
  if (o["actualRawPiiPersisted"] !== false) reasons.push("prereq_actual_raw_pii_persisted_must_be_false");
  if (o["actualRawPiiLogged"] !== false) reasons.push("prereq_actual_raw_pii_logged_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false) reasons.push("prereq_actual_prompt_build_must_be_false");
  if (o["actualModelCallPerformed"] !== false) reasons.push("prereq_actual_model_call_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false) reasons.push("prereq_actual_run_smart_talk_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false) reasons.push("prereq_actual_evidence_gate_wiring_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false) reasons.push("prereq_actual_claim_authorization_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false) reasons.push("prereq_actual_deadline_calculation_must_be_false");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false) reasons.push("prereq_actual_live_route_mutation_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_photo_route_modified_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false) reasons.push("prereq_actual_paid_document_mode_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false) reasons.push("prereq_actual_payment_runtime_must_be_false");
  if (o["actualCheckoutImplemented"] !== false) reasons.push("prereq_actual_checkout_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false) reasons.push("prereq_actual_entitlement_runtime_must_be_false");
  if (o["actualServerEntitlementVerificationImplemented"] !== false) reasons.push("prereq_actual_server_entitlement_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false) reasons.push("prereq_actual_real_document_input_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false) reasons.push("prereq_actual_real_document_processing_must_be_false");
  if (o["actualOcrPerformed"] !== false) reasons.push("prereq_actual_ocr_must_be_false");
  if (o["actualPhotoInputProcessed"] !== false) reasons.push("prereq_actual_photo_input_must_be_false");
  if (o["actualFileInputProcessed"] !== false) reasons.push("prereq_actual_file_input_must_be_false");
  if (o["actualDocumentStoragePerformed"] !== false) reasons.push("prereq_actual_document_storage_must_be_false");
  if (o["actualDatabasePersistencePerformed"] !== false) reasons.push("prereq_actual_database_persistence_must_be_false");
  if (o["actualAuditPersistencePerformed"] !== false) reasons.push("prereq_actual_audit_persistence_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false) reasons.push("prereq_actual_user_visible_output_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false) reasons.push("prereq_actual_public_runtime_must_be_false");

  // 8.6B contract side-effect confirmations (26)
  for (const se of CONTRACT_SIDE_EFFECTS) {
    if (o[`piiContractConfirms${se}`] !== true) reasons.push(`prereq_pii_contract_confirms_${se}_false`);
  }

  // Pipeline flags (all false)
  for (const f of PIPELINE_FLAGS) {
    if (o[f] !== false) reasons.push(`prereq_${f}_must_be_false`);
  }

  // Runtime auth flags (all false)
  for (const f of RUNTIME_AUTH_FLAGS) {
    if (o[f] !== false) reasons.push(`prereq_${f}_must_be_false`);
  }

  // Auth grants
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("prereq_runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("prereq_pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("prereq_production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("prereq_final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("prereq_go_live_authorization_granted_must_be_false");

  // Legal safety
  if (o["exactDeadlineCalculationAuthorized"] !== false) reasons.push("prereq_exact_deadline_calculation_authorized_must_be_false");
  if (o["deliveryDateInventionAuthorized"] !== false) reasons.push("prereq_delivery_date_invention_authorized_must_be_false");
  if (o["finalDateInventionAuthorized"] !== false) reasons.push("prereq_final_date_invention_authorized_must_be_false");
  if (o["legalCertaintyAuthorized"] !== false) reasons.push("prereq_legal_certainty_authorized_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false) reasons.push("prereq_coercive_legal_instruction_authorized_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true) reasons.push("prereq_delivery_date_required_for_exact_deadline_false");

  // TD flags from 8.6B result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true) reasons.push("prereq_td001_false");
  if (o["td005PaidDocumentModeBoundaryContainmentClosed"] !== true) reasons.push("prereq_td005_boundary_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosed"] !== true) reasons.push("prereq_td005_client_flag_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] !== true) reasons.push("prereq_td005_deferred_false");
  if (o["td004PreModelPiiRedactionPlanned"] !== true) reasons.push("prereq_td004_planned_must_be_true");
  if (o["td004PreModelPiiRedactionContracted"] !== true) reasons.push("prereq_td004_contracted_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] !== true) reasons.push("prereq_td004_still_requires_runtime_implementation_must_be_true");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true) reasons.push("prereq_td004_still_missing_in_production_must_be_true");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true) reasons.push("prereq_td002_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true) reasons.push("prereq_td003_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true) reasons.push("prereq_td003_future_design_false");
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true) reasons.push("prereq_td006_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true) reasons.push("prereq_td007_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true) reasons.push("prereq_td008_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true) reasons.push("prereq_td010_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true) reasons.push("prereq_td009_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false) reasons.push("prereq_tmp_files_present_must_be_false");

  // 8.6B forward readiness gate
  if (o["readyFor8x6CPreModelPiiRedactionImplementationPlan"] !== true) reasons.push("prereq_ready_for_8x6c_implementation_plan_false");
  if (o["readyForEvidenceGatesProductionWiringPhase"] !== false) reasons.push("prereq_ready_for_evidence_gates_must_be_false");
  if (o["readyForServerEntitlementVerificationPhase"] !== false) reasons.push("prereq_ready_for_server_entitlement_must_be_false");
  if (o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] !== false) reasons.push("prereq_ready_for_paid_document_mode_must_be_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_separate_runtime_authorization_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_pilot_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_production_must_be_false");
  if (o["readyForRealDocumentInput"] !== false) reasons.push("prereq_ready_for_real_document_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false) reasons.push("prereq_ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false) reasons.push("prereq_public_runtime_enabled_must_be_false");
  if (o["persistenceUsed"] !== false) reasons.push("prereq_persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true) reasons.push("prereq_never_user_visible_must_be_true");

  // 8.6C core assertion flags
  if (o["preModelPiiRedactionContractReadyForImplementationPlan"] !== true) reasons.push("contract_ready_for_implementation_plan_false");
  if (o["preModelPiiRedactionImplementationPlanOnly"] !== true) reasons.push("pii_implementation_plan_only_false");
  if (o["preModelPiiRedactionImplementationPlanDefined"] !== true) reasons.push("pii_implementation_plan_defined_false");

  // Implementation layer confirmations (7)
  if (o["piiImplementationPlanDefinesInputBoundaryLayer"] !== true) reasons.push("pii_impl_plan_defines_input_boundary_layer_false");
  if (o["piiImplementationPlanDefinesDetectionLayer"] !== true) reasons.push("pii_impl_plan_defines_detection_layer_false");
  if (o["piiImplementationPlanDefinesPlaceholderLayer"] !== true) reasons.push("pii_impl_plan_defines_placeholder_layer_false");
  if (o["piiImplementationPlanDefinesRedactedArtifactLayer"] !== true) reasons.push("pii_impl_plan_defines_redacted_artifact_layer_false");
  if (o["piiImplementationPlanDefinesFailureHandlingLayer"] !== true) reasons.push("pii_impl_plan_defines_failure_handling_layer_false");
  if (o["piiImplementationPlanDefinesDownstreamBoundaryLayer"] !== true) reasons.push("pii_impl_plan_defines_downstream_boundary_layer_false");
  if (o["piiImplementationPlanDefinesTestStrategyLayer"] !== true) reasons.push("pii_impl_plan_defines_test_strategy_layer_false");

  // Input boundary layer (7)
  if (o["piiImplementationPlanInputRequiresControlledValidatedTextOnly"] !== true) reasons.push("pii_impl_input_requires_controlled_validated_text_false");
  if (o["piiImplementationPlanInputRejectsIfValidationMissing"] !== true) reasons.push("pii_impl_input_rejects_if_validation_missing_false");
  if (o["piiImplementationPlanInputRunsBeforePromptBuild"] !== true) reasons.push("pii_impl_input_runs_before_prompt_build_false");
  if (o["piiImplementationPlanInputRunsBeforeModelCall"] !== true) reasons.push("pii_impl_input_runs_before_model_call_false");
  if (o["piiImplementationPlanInputRunsBeforeRunSmartTalkDocumentLane"] !== true) reasons.push("pii_impl_input_runs_before_run_smart_talk_false");
  if (o["piiImplementationPlanInputRunsBeforeEvidenceGateEvaluation"] !== true) reasons.push("pii_impl_input_runs_before_evidence_gate_false");
  if (o["piiImplementationPlanInputDoesNotCreateFreeQaDocumentBypass"] !== true) reasons.push("pii_impl_input_no_free_qa_bypass_false");

  // Detection layer (7)
  if (o["piiImplementationPlanDetectionUsesDeterministicPatterns"] !== true) reasons.push("pii_impl_detection_uses_deterministic_patterns_false");
  if (o["piiImplementationPlanDetectionSupportsStructuredHits"] !== true) reasons.push("pii_impl_detection_supports_structured_hits_false");
  if (o["piiImplementationPlanDetectionIncludesCategorySpanConfidenceReason"] !== true) reasons.push("pii_impl_detection_includes_category_span_false");
  if (o["piiImplementationPlanDetectionDoesNotUseLlmBeforeModelFacingText"] !== true) reasons.push("pii_impl_detection_no_llm_false");
  if (o["piiImplementationPlanDetectionClassifiesConservatively"] !== true) reasons.push("pii_impl_detection_classifies_conservatively_false");
  if (o["piiImplementationPlanDetectionCoversGermanBureaucracyIdentifiers"] !== true) reasons.push("pii_impl_detection_covers_german_bureaucracy_false");
  if (o["piiImplementationPlanDetectionCoversGermanDocumentContactBlocks"] !== true) reasons.push("pii_impl_detection_covers_german_document_contact_false");

  // Placeholder layer (6)
  if (o["piiImplementationPlanPlaceholderUsesDeterministicPlaceholders"] !== true) reasons.push("pii_impl_placeholder_deterministic_false");
  if (o["piiImplementationPlanPlaceholderMaintainsStableMappingInsideOneRequest"] !== true) reasons.push("pii_impl_placeholder_stable_mapping_false");
  if (o["piiImplementationPlanPlaceholderPreservesCategorySpecificTypes"] !== true) reasons.push("pii_impl_placeholder_preserves_category_types_false");
  if (o["piiImplementationPlanPlaceholderDoesNotPersistRawMapByDefault"] !== true) reasons.push("pii_impl_placeholder_no_persist_raw_map_false");
  if (o["piiImplementationPlanPlaceholderAvoidsIrreversibleSemanticDeletion"] !== true) reasons.push("pii_impl_placeholder_avoids_irreversible_deletion_false");
  if (o["piiImplementationPlanPlaceholderPreservesDocumentStructure"] !== true) reasons.push("pii_impl_placeholder_preserves_document_structure_false");

  // Redacted artifact layer (6)
  if (o["piiImplementationPlanArtifactOutputsRedactedText"] !== true) reasons.push("pii_impl_artifact_outputs_redacted_text_false");
  if (o["piiImplementationPlanArtifactOutputsPlaceholderMetadataWithoutRawValues"] !== true) reasons.push("pii_impl_artifact_outputs_placeholder_metadata_false");
  if (o["piiImplementationPlanArtifactOutputsCoverageMetricsWithoutRawValues"] !== true) reasons.push("pii_impl_artifact_outputs_coverage_metrics_false");
  if (o["piiImplementationPlanArtifactOutputsUnresolvedHighRiskFlagsWithoutRawValues"] !== true) reasons.push("pii_impl_artifact_outputs_unresolved_flags_false");
  if (o["piiImplementationPlanArtifactOutputsSafeStatus"] !== true) reasons.push("pii_impl_artifact_outputs_safe_status_false");
  if (o["piiImplementationPlanArtifactNeverOutputsRawPiiToUnsafeSinks"] !== true) reasons.push("pii_impl_artifact_never_outputs_raw_pii_false");

  // Failure handling (5)
  if (o["piiImplementationPlanFailureBlocksOrEscalatesLowConfidence"] !== true) reasons.push("pii_impl_failure_blocks_low_confidence_false");
  if (o["piiImplementationPlanFailureBlocksOrEscalatesHighRiskUnsafeIdentifiers"] !== true) reasons.push("pii_impl_failure_blocks_high_risk_false");
  if (o["piiImplementationPlanFailureBlocksOrEscalatesMedicalImmigrationFinancialUnsafeIdentifiers"] !== true) reasons.push("pii_impl_failure_blocks_medical_immigration_financial_false");
  if (o["piiImplementationPlanFailureBlocksUnknownDocumentIdentityIfUnsafe"] !== true) reasons.push("pii_impl_failure_blocks_unknown_identity_false");
  if (o["piiImplementationPlanFailureNeverSilentlyPassesUnredactedContent"] !== true) reasons.push("pii_impl_failure_never_silently_passes_false");

  // Downstream boundary (6)
  if (o["piiImplementationPlanDownstreamEvidenceGatesUseRedactedOrIsolatedContentOnly"] !== true) reasons.push("pii_impl_downstream_evidence_gates_redacted_false");
  if (o["piiImplementationPlanDownstreamClaimAuthorizationUsesRedactedAnchorsOnly"] !== true) reasons.push("pii_impl_downstream_claim_authorization_redacted_false");
  if (o["piiImplementationPlanDownstreamDeadlineLogicStillRequiresDeliveryDateEvidence"] !== true) reasons.push("pii_impl_downstream_deadline_delivery_date_false");
  if (o["piiImplementationPlanDownstreamUserVisibleOutputDoesNotRevealRawPiiUnlessSeparatelyAuthorized"] !== true) reasons.push("pii_impl_downstream_user_visible_no_raw_pii_false");
  if (o["piiImplementationPlanDownstreamStoragePersistenceRemainBlocked"] !== true) reasons.push("pii_impl_downstream_storage_blocked_false");
  if (o["piiImplementationPlanDownstreamPaidDocumentRuntimeRemainsBlockedUntilRequiredContracts"] !== true) reasons.push("pii_impl_downstream_paid_doc_runtime_blocked_false");

  // Test strategy (8)
  if (o["piiImplementationPlanTestsSyntheticGermanBureaucracyLetters"] !== true) reasons.push("pii_impl_tests_synthetic_german_letters_false");
  if (o["piiImplementationPlanTestsMultilingualUserTextAroundGermanDocuments"] !== true) reasons.push("pii_impl_tests_multilingual_false");
  if (o["piiImplementationPlanTestsMixedDocumentUserCommentary"] !== true) reasons.push("pii_impl_tests_mixed_doc_user_commentary_false");
  if (o["piiImplementationPlanTestsAllContractedIdentifierClasses"] !== true) reasons.push("pii_impl_tests_all_contracted_identifiers_false");
  if (o["piiImplementationPlanTestsFalsePositiveControls"] !== true) reasons.push("pii_impl_tests_false_positive_controls_false");
  if (o["piiImplementationPlanTestsRedactionStability"] !== true) reasons.push("pii_impl_tests_redaction_stability_false");
  if (o["piiImplementationPlanTestsNoRawPiiInOutputAssertions"] !== true) reasons.push("pii_impl_tests_no_raw_pii_in_output_false");
  if (o["piiImplementationPlanTestsNoRuntimeAuthorizationAssertions"] !== true) reasons.push("pii_impl_tests_no_runtime_auth_false");

  // Architecture constraints (10)
  if (o["piiImplementationPlanRequiresPureUtilityOrIsolatedGovernanceHelperFirst"] !== true) reasons.push("pii_impl_arch_pure_utility_first_false");
  if (o["piiImplementationPlanDoesNotPatchSmartTalkRouteNow"] !== true) reasons.push("pii_impl_arch_no_smart_talk_patch_false");
  if (o["piiImplementationPlanDoesNotPatchPhotoRouteNow"] !== true) reasons.push("pii_impl_arch_no_photo_patch_false");
  if (o["piiImplementationPlanDoesNotAddPersistence"] !== true) reasons.push("pii_impl_arch_no_persistence_false");
  if (o["piiImplementationPlanDoesNotAddModelCalls"] !== true) reasons.push("pii_impl_arch_no_model_calls_false");
  if (o["piiImplementationPlanDoesNotAddPromptBuilding"] !== true) reasons.push("pii_impl_arch_no_prompt_building_false");
  if (o["piiImplementationPlanDoesNotAddEntitlementLogic"] !== true) reasons.push("pii_impl_arch_no_entitlement_logic_false");
  if (o["piiImplementationPlanDoesNotAddPaymentLogic"] !== true) reasons.push("pii_impl_arch_no_payment_logic_false");
  if (o["piiImplementationPlanDoesNotAddUserVisibleDocumentAnswerLogic"] !== true) reasons.push("pii_impl_arch_no_user_visible_doc_answer_false");
  if (o["piiImplementationPlanDoesNotEnablePublicRuntime"] !== true) reasons.push("pii_impl_arch_no_public_runtime_false");

  // Sequencing (9)
  if (o["piiImplementationPlanNextPhase8x6DIsRuntimeContract"] !== true) reasons.push("pii_impl_seq_8x6d_runtime_contract_false");
  if (o["piiImplementationPlanThen8x6EIsDryRunImplementation"] !== true) reasons.push("pii_impl_seq_8x6e_dry_run_false");
  if (o["piiImplementationPlanThen8x6FIsRuntimeExecutionContract"] !== true) reasons.push("pii_impl_seq_8x6f_runtime_execution_contract_false");
  if (o["piiImplementationPlanThen8x6GIsSurgicalUtilityPatch"] !== true) reasons.push("pii_impl_seq_8x6g_surgical_utility_patch_false");
  if (o["piiImplementationPlanThen8x6HIsPostPatchAudit"] !== true) reasons.push("pii_impl_seq_8x6h_post_patch_audit_false");
  if (o["piiImplementationPlanThen8x6IIsClosureDecision"] !== true) reasons.push("pii_impl_seq_8x6i_closure_decision_false");
  if (o["piiImplementationPlanDoesNotSkipToRuntimeImplementation"] !== true) reasons.push("pii_impl_seq_no_skip_to_runtime_false");
  if (o["piiImplementationPlanDoesNotCreateUtilityRuntimeFileNow"] !== true) reasons.push("pii_impl_seq_no_utility_runtime_file_now_false");
  if (o["piiImplementationPlanDoesNotModifyRuntimeRouteNow"] !== true) reasons.push("pii_impl_seq_no_modify_runtime_route_now_false");

  // 8.6C new actual flag
  if (o["actualPiiRedactionImplementationPlanOnly"] !== true) reasons.push("actual_pii_redaction_implementation_plan_only_must_be_true");

  // 8.6C side-effect confirmations (26)
  for (const se of CONTRACT_SIDE_EFFECTS) {
    if (o[`piiImplementationPlanConfirms${se}`] !== true) reasons.push(`pii_implementation_plan_confirms_${se}_false`);
  }

  // Pipeline executed flags (all false)
  for (const f of PIPELINE_FLAGS) {
    if (o[f] !== false) reasons.push(`${f}_must_be_false`);
  }

  // Runtime auth flags (all false)
  for (const f of RUNTIME_AUTH_FLAGS) {
    if (o[f] !== false) reasons.push(`${f}_must_be_false`);
  }

  // Auth grants
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_authorization_granted_must_be_false");

  // 8.6C TD result flags
  if (o["td004PreModelPiiRedactionImplementationPlanned"] !== true) reasons.push("td004_implementation_planned_false");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeContract"] !== true) reasons.push("td004_still_requires_runtime_contract_false");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] !== true) reasons.push("td004_still_requires_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true) reasons.push("td004_still_missing_in_production_false");

  // 8.6C forward readiness
  if (o["readyFor8x6DPreModelPiiRedactionRuntimeContract"] !== true) reasons.push("ready_for_8x6d_runtime_contract_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.6C input builder ──────────────────────────────────────────────

function buildCanonical8x6CInput(): Record<string, unknown> {
  const cr = runControlledRealDocumentPreModelPiiRedactionContract();
  return {
    // 8.6B prerequisite gate — core
    prereqCheckId: cr.checkId,
    prereqAllPassed: cr.allPassed,
    preModelPiiRedactionPlanReadyForContract: cr.preModelPiiRedactionPlanReadyForContract,
    controlledRealDocumentPreModelPiiRedactionContractAccepted: cr.controlledRealDocumentPreModelPiiRedactionContractAccepted,
    preModelPiiRedactionContractOnly: cr.preModelPiiRedactionContractOnly,
    preModelPiiRedactionContractDefined: cr.preModelPiiRedactionContractDefined,
    preModelPiiRedactionRuntimeStillNotImplemented: cr.preModelPiiRedactionRuntimeStillNotImplemented,
    preModelPiiDetectorRuntimeStillNotImplemented: cr.preModelPiiDetectorRuntimeStillNotImplemented,
    preModelPiiMaskingRuntimeStillNotImplemented: cr.preModelPiiMaskingRuntimeStillNotImplemented,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: cr.preModelPiiRedactionDoesNotAuthorizeRealDocumentInput,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: cr.preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: cr.preModelPiiRedactionDoesNotAuthorizePromptBuild,
    preModelPiiRedactionDoesNotAuthorizeModelCall: cr.preModelPiiRedactionDoesNotAuthorizeModelCall,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: cr.preModelPiiRedactionDoesNotAuthorizeRunSmartTalk,
    prereqTamperCasesRejected: cr.tamperCasesRejected,

    // 8.6B contract boundary obligations
    piiContractRequiresBoundaryBeforePromptBuild: cr.piiContractRequiresBoundaryBeforePromptBuild,
    piiContractRequiresBoundaryBeforeModelCall: cr.piiContractRequiresBoundaryBeforeModelCall,
    piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: cr.piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane,
    piiContractRequiresBoundaryAfterControlledInputValidation: cr.piiContractRequiresBoundaryAfterControlledInputValidation,
    piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: cr.piiContractRequiresBoundaryBeforeEvidenceGateEvaluation,
    piiContractDoesNotCreateFreeQaDocumentBypass: cr.piiContractDoesNotCreateFreeQaDocumentBypass,
    piiContractDoesNotAuthorizeRealDocumentInput: cr.piiContractDoesNotAuthorizeRealDocumentInput,
    piiContractDoesNotAuthorizeUserVisibleDocumentOutput: cr.piiContractDoesNotAuthorizeUserVisibleDocumentOutput,
    piiContractDoesNotAuthorizeExactDeadlineCalculation: cr.piiContractDoesNotAuthorizeExactDeadlineCalculation,
    piiContractDoesNotAuthorizePublicRuntime: cr.piiContractDoesNotAuthorizePublicRuntime,

    // 8.6B contract PII class coverage
    piiContractCoversPersonNames: cr.piiContractCoversPersonNames,
    piiContractCoversPostalAddresses: cr.piiContractCoversPostalAddresses,
    piiContractCoversPhoneNumbers: cr.piiContractCoversPhoneNumbers,
    piiContractCoversEmailAddresses: cr.piiContractCoversEmailAddresses,
    piiContractCoversDatesOfBirth: cr.piiContractCoversDatesOfBirth,
    piiContractCoversCustomerNumbers: cr.piiContractCoversCustomerNumbers,
    piiContractCoversInsuranceNumbers: cr.piiContractCoversInsuranceNumbers,
    piiContractCoversHealthInsuranceIdentifiers: cr.piiContractCoversHealthInsuranceIdentifiers,
    piiContractCoversTaxIds: cr.piiContractCoversTaxIds,
    piiContractCoversSteuerId: cr.piiContractCoversSteuerId,
    piiContractCoversSteuernummer: cr.piiContractCoversSteuernummer,
    piiContractCoversAktenzeichen: cr.piiContractCoversAktenzeichen,
    piiContractCoversVorgangsnummer: cr.piiContractCoversVorgangsnummer,
    piiContractCoversCaseReferenceNumbers: cr.piiContractCoversCaseReferenceNumbers,
    piiContractCoversIban: cr.piiContractCoversIban,
    piiContractCoversBankAccountIdentifiers: cr.piiContractCoversBankAccountIdentifiers,
    piiContractCoversLicensePlateNumbers: cr.piiContractCoversLicensePlateNumbers,
    piiContractCoversEmployerNamesInPersonalContext: cr.piiContractCoversEmployerNamesInPersonalContext,
    piiContractCoversSignatures: cr.piiContractCoversSignatures,
    piiContractCoversHandwrittenNames: cr.piiContractCoversHandwrittenNames,
    piiContractCoversGreetingsContainingPersonalNames: cr.piiContractCoversGreetingsContainingPersonalNames,
    piiContractCoversDocumentRecipientBlocks: cr.piiContractCoversDocumentRecipientBlocks,
    piiContractCoversSenderBlocks: cr.piiContractCoversSenderBlocks,
    piiContractCoversRealContactDetails: cr.piiContractCoversRealContactDetails,
    piiContractCoversRealAuthorityContactBlocksCopiedFromDocuments: cr.piiContractCoversRealAuthorityContactBlocksCopiedFromDocuments,
    piiContractCoversMedicalHealthContextIdentifiers: cr.piiContractCoversMedicalHealthContextIdentifiers,
    piiContractCoversImmigrationResidencePermitIdentifiers: cr.piiContractCoversImmigrationResidencePermitIdentifiers,
    piiContractCoversSocialBenefitIdentifiers: cr.piiContractCoversSocialBenefitIdentifiers,
    piiContractCoversJobcenterBuergergeldIdentifiers: cr.piiContractCoversJobcenterBuergergeldIdentifiers,
    piiContractCoversFamilienkasseKindergeldIdentifiers: cr.piiContractCoversFamilienkasseKindergeldIdentifiers,
    piiContractCoversAuslaenderbehoerdeIdentifiers: cr.piiContractCoversAuslaenderbehoerdeIdentifiers,
    piiContractCoversFinanzamtIdentifiers: cr.piiContractCoversFinanzamtIdentifiers,

    // 8.6B contract redaction/masking obligations
    piiContractRequiresDeterministicPlaceholders: cr.piiContractRequiresDeterministicPlaceholders,
    piiContractRequiresStablePlaceholderMappingInsideOneRequest: cr.piiContractRequiresStablePlaceholderMappingInsideOneRequest,
    piiContractRequiresNoRawPiiPersistenceByDefault: cr.piiContractRequiresNoRawPiiPersistenceByDefault,
    piiContractRequiresNoRawPiiInPrompt: cr.piiContractRequiresNoRawPiiInPrompt,
    piiContractRequiresNoRawPiiInLogs: cr.piiContractRequiresNoRawPiiInLogs,
    piiContractRequiresNoRawPiiInAuditTraces: cr.piiContractRequiresNoRawPiiInAuditTraces,
    piiContractRequiresNoRawPiiInUserVisibleErrorMessages: cr.piiContractRequiresNoRawPiiInUserVisibleErrorMessages,
    piiContractRequiresNoRawPiiInTelemetry: cr.piiContractRequiresNoRawPiiInTelemetry,
    piiContractRequiresNoRawPiiInModelMetadata: cr.piiContractRequiresNoRawPiiInModelMetadata,
    piiContractRequiresNoRawPiiInEvidenceGateTraces: cr.piiContractRequiresNoRawPiiInEvidenceGateTraces,
    piiContractRequiresNoRawPiiInDeadlineTraces: cr.piiContractRequiresNoRawPiiInDeadlineTraces,
    piiContractRequiresRawToPlaceholderMapLocalEphemeralByDefault: cr.piiContractRequiresRawToPlaceholderMapLocalEphemeralByDefault,
    piiContractRequiresStructuredRedactionAuditWithoutRawValues: cr.piiContractRequiresStructuredRedactionAuditWithoutRawValues,
    piiContractRequiresCoverageMetricsWithoutRawValues: cr.piiContractRequiresCoverageMetricsWithoutRawValues,
    piiContractRequiresConservativeFallbackWhenConfidenceUncertain: cr.piiContractRequiresConservativeFallbackWhenConfidenceUncertain,
    piiContractRequiresBlockOrEscalateIfUnsafeToRedact: cr.piiContractRequiresBlockOrEscalateIfUnsafeToRedact,

    // 8.6B contract placeholder obligations
    piiContractAllowsPersonPlaceholder: cr.piiContractAllowsPersonPlaceholder,
    piiContractAllowsAddressPlaceholder: cr.piiContractAllowsAddressPlaceholder,
    piiContractAllowsPhonePlaceholder: cr.piiContractAllowsPhonePlaceholder,
    piiContractAllowsEmailPlaceholder: cr.piiContractAllowsEmailPlaceholder,
    piiContractAllowsDobPlaceholder: cr.piiContractAllowsDobPlaceholder,
    piiContractAllowsCustomerIdPlaceholder: cr.piiContractAllowsCustomerIdPlaceholder,
    piiContractAllowsInsuranceIdPlaceholder: cr.piiContractAllowsInsuranceIdPlaceholder,
    piiContractAllowsTaxIdPlaceholder: cr.piiContractAllowsTaxIdPlaceholder,
    piiContractAllowsCaseRefPlaceholder: cr.piiContractAllowsCaseRefPlaceholder,
    piiContractAllowsIbanPlaceholder: cr.piiContractAllowsIbanPlaceholder,
    piiContractAllowsAuthorityPlaceholder: cr.piiContractAllowsAuthorityPlaceholder,
    piiContractAllowsEmployerPlaceholder: cr.piiContractAllowsEmployerPlaceholder,
    piiContractAllowsSignaturePlaceholder: cr.piiContractAllowsSignaturePlaceholder,
    piiContractAllowsDocumentRecipientPlaceholder: cr.piiContractAllowsDocumentRecipientPlaceholder,
    piiContractAllowsDocumentSenderPlaceholder: cr.piiContractAllowsDocumentSenderPlaceholder,

    // 8.6B contract safety obligations
    piiContractPreservesLegalSemanticStructureWherePossible: cr.piiContractPreservesLegalSemanticStructureWherePossible,
    piiContractMustNotInventMissingFacts: cr.piiContractMustNotInventMissingFacts,
    piiContractMustNotAlterDatesIntoFalseDeadlines: cr.piiContractMustNotAlterDatesIntoFalseDeadlines,
    piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion: cr.piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion,
    piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: cr.piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity,
    piiContractMustNotInferRecipientIdentityFromPartialText: cr.piiContractMustNotInferRecipientIdentityFromPartialText,
    piiContractMustNotInferSenderIdentityFromPartialText: cr.piiContractMustNotInferSenderIdentityFromPartialText,
    piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: cr.piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone,
    piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: cr.piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice,
    piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: cr.piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation,
    piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: cr.piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer,
    piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: cr.piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation,

    // 8.6B contract failure mode obligations
    piiContractDefinesFailurePiiRedactionRequired: cr.piiContractDefinesFailurePiiRedactionRequired,
    piiContractDefinesFailurePiiRedactionIncomplete: cr.piiContractDefinesFailurePiiRedactionIncomplete,
    piiContractDefinesFailurePiiRedactionConfidenceLow: cr.piiContractDefinesFailurePiiRedactionConfidenceLow,
    piiContractDefinesFailurePiiRedactionUnsafeForModel: cr.piiContractDefinesFailurePiiRedactionUnsafeForModel,
    piiContractDefinesFailureBlockedHighRiskIdentifier: cr.piiContractDefinesFailureBlockedHighRiskIdentifier,
    piiContractDefinesFailureBlockedMedicalIdentifier: cr.piiContractDefinesFailureBlockedMedicalIdentifier,
    piiContractDefinesFailureBlockedImmigrationIdentifier: cr.piiContractDefinesFailureBlockedImmigrationIdentifier,
    piiContractDefinesFailureBlockedFinancialIdentifier: cr.piiContractDefinesFailureBlockedFinancialIdentifier,
    piiContractDefinesFailureBlockedUnknownDocumentIdentity: cr.piiContractDefinesFailureBlockedUnknownDocumentIdentity,

    // 8.6B contract downstream obligations
    piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: cr.piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly,
    piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly: cr.piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly,
    piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: cr.piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized,
    piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly: cr.piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly,
    piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence: cr.piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence,
    piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: cr.piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized,
    piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: cr.piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts,

    // 8.6B contract decision confirmations
    piiContractAcceptsPlan: cr.piiContractAcceptsPlan,
    piiContractReadyForFutureImplementationPlan: cr.piiContractReadyForFutureImplementationPlan,
    piiContractDoesNotAuthorizeRuntimeImplementationNow: cr.piiContractDoesNotAuthorizeRuntimeImplementationNow,
    piiContractDoesNotAuthorizePiiProcessingNow: cr.piiContractDoesNotAuthorizePiiProcessingNow,
    piiContractDoesNotAuthorizeRawPiiHandlingNow: cr.piiContractDoesNotAuthorizeRawPiiHandlingNow,
    piiContractDoesNotAuthorizeDocumentProcessingNow: cr.piiContractDoesNotAuthorizeDocumentProcessingNow,
    piiContractDoesNotAuthorizePromptBuildNow: cr.piiContractDoesNotAuthorizePromptBuildNow,
    piiContractDoesNotAuthorizeModelCallNow: cr.piiContractDoesNotAuthorizeModelCallNow,
    piiContractDoesNotAuthorizeRunSmartTalkNow: cr.piiContractDoesNotAuthorizeRunSmartTalkNow,

    // 8.6B actual flags
    actualPiiRedactionContractOnly: cr.actualPiiRedactionContractOnly,
    actualPiiRedactionImplemented: cr.actualPiiRedactionImplemented,
    actualPiiDetectorRuntimeImplemented: cr.actualPiiDetectorRuntimeImplemented,
    actualPiiMaskingRuntimeImplemented: cr.actualPiiMaskingRuntimeImplemented,
    actualPiiTextRedacted: cr.actualPiiTextRedacted,
    actualRawPiiProcessed: cr.actualRawPiiProcessed,
    actualRawPiiPersisted: cr.actualRawPiiPersisted,
    actualRawPiiLogged: cr.actualRawPiiLogged,
    actualPromptBuildPerformed: cr.actualPromptBuildPerformed,
    actualModelCallPerformed: cr.actualModelCallPerformed,
    actualRunSmartTalkCalled: cr.actualRunSmartTalkCalled,
    actualEvidenceGateRuntimeWiringPerformed: cr.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: cr.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: cr.actualDeadlineCalculationPerformed,
    actualLiveRouteMutationPerformedInThisPhase: cr.actualLiveRouteMutationPerformedInThisPhase,
    actualSmartTalkRouteModifiedInThisPhase: cr.actualSmartTalkRouteModifiedInThisPhase,
    actualPhotoRouteModifiedInThisPhase: cr.actualPhotoRouteModifiedInThisPhase,
    actualPaidDocumentModeImplemented: cr.actualPaidDocumentModeImplemented,
    actualPaymentRuntimeImplemented: cr.actualPaymentRuntimeImplemented,
    actualCheckoutImplemented: cr.actualCheckoutImplemented,
    actualEntitlementRuntimeImplemented: cr.actualEntitlementRuntimeImplemented,
    actualServerEntitlementVerificationImplemented: cr.actualServerEntitlementVerificationImplemented,
    actualRealDocumentInputPerformed: cr.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: cr.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: cr.actualOcrPerformed,
    actualPhotoInputProcessed: cr.actualPhotoInputProcessed,
    actualFileInputProcessed: cr.actualFileInputProcessed,
    actualDocumentStoragePerformed: cr.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: cr.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: cr.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: cr.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: cr.actualPublicRuntimeEnabled,

    // 8.6B contract side-effect confirmations
    piiContractConfirmsNoOpenAiCall: cr.piiContractConfirmsNoOpenAiCall,
    piiContractConfirmsNoFetchCall: cr.piiContractConfirmsNoFetchCall,
    piiContractConfirmsNoProcessEnvRead: cr.piiContractConfirmsNoProcessEnvRead,
    piiContractConfirmsNoSdkUsage: cr.piiContractConfirmsNoSdkUsage,
    piiContractConfirmsNo8x3AcRerun: cr.piiContractConfirmsNo8x3AcRerun,
    piiContractConfirmsNoPaymentRuntimeCall: cr.piiContractConfirmsNoPaymentRuntimeCall,
    piiContractConfirmsNoStripeCall: cr.piiContractConfirmsNoStripeCall,
    piiContractConfirmsNoCheckoutCall: cr.piiContractConfirmsNoCheckoutCall,
    piiContractConfirmsNoEntitlementRuntimeCall: cr.piiContractConfirmsNoEntitlementRuntimeCall,
    piiContractConfirmsNoServerEntitlementVerification: cr.piiContractConfirmsNoServerEntitlementVerification,
    piiContractConfirmsNoOcrRuntimeCall: cr.piiContractConfirmsNoOcrRuntimeCall,
    piiContractConfirmsNoStorageMutation: cr.piiContractConfirmsNoStorageMutation,
    piiContractConfirmsNoDatabaseWrite: cr.piiContractConfirmsNoDatabaseWrite,
    piiContractConfirmsNoAuditPersistence: cr.piiContractConfirmsNoAuditPersistence,
    piiContractConfirmsNoUserVisibleDocumentExplanation: cr.piiContractConfirmsNoUserVisibleDocumentExplanation,
    piiContractConfirmsNoEvidenceEvaluation: cr.piiContractConfirmsNoEvidenceEvaluation,
    piiContractConfirmsNoClaimAuthorization: cr.piiContractConfirmsNoClaimAuthorization,
    piiContractConfirmsNoDeadlineCalculation: cr.piiContractConfirmsNoDeadlineCalculation,
    piiContractConfirmsNoLegalCertainty: cr.piiContractConfirmsNoLegalCertainty,
    piiContractConfirmsNoPromptBuild: cr.piiContractConfirmsNoPromptBuild,
    piiContractConfirmsNoModelCall: cr.piiContractConfirmsNoModelCall,
    piiContractConfirmsNoRunSmartTalkCall: cr.piiContractConfirmsNoRunSmartTalkCall,
    piiContractConfirmsNoRouteHandlerCall: cr.piiContractConfirmsNoRouteHandlerCall,
    piiContractConfirmsNoRouteImport: cr.piiContractConfirmsNoRouteImport,
    piiContractConfirmsNoFilesystemRead: cr.piiContractConfirmsNoFilesystemRead,
    piiContractConfirmsNoPhotoRouteModification: cr.piiContractConfirmsNoPhotoRouteModification,

    // Pipeline flags
    executionSequenceActuallyExecuted: cr.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: cr.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: cr.documentPipelineActuallyExecuted,
    piiPipelineActuallyExecuted: cr.piiPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: cr.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: cr.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: cr.checkoutPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: cr.ocrPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: cr.userVisiblePipelineActuallyExecuted,

    // Runtime auth flags
    preModelPiiRedactionRuntimeAuthorizedNow: cr.preModelPiiRedactionRuntimeAuthorizedNow,
    realDocumentInputAuthorizedNow: cr.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: cr.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: cr.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: cr.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: cr.photoInputAuthorizedNow,
    fileInputAuthorizedNow: cr.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: cr.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: cr.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: cr.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow: cr.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: cr.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: cr.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: cr.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: cr.productionRuntimeAuthorizedNow,
    paidDocumentModeRuntimeAuthorizedNow: cr.paidDocumentModeRuntimeAuthorizedNow,
    paymentRuntimeAuthorizedNow: cr.paymentRuntimeAuthorizedNow,
    entitlementRuntimeAuthorizedNow: cr.entitlementRuntimeAuthorizedNow,
    checkoutRuntimeAuthorizedNow: cr.checkoutRuntimeAuthorizedNow,

    // Auth grants
    runtimeAuthorizationGranted: cr.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: cr.pilotAuthorizationGranted,
    productionAuthorizationGranted: cr.productionAuthorizationGranted,
    finalAuthorizationGranted: cr.finalAuthorizationGranted,
    goLiveAuthorizationGranted: cr.goLiveAuthorizationGranted,

    // Legal safety
    exactDeadlineCalculationAuthorized: cr.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: cr.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: cr.finalDateInventionAuthorized,
    legalCertaintyAuthorized: cr.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: cr.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: cr.deliveryDateRequiredForExactDeadline,

    // TD flags from 8.6B result
    td001DocumentBypassGuardContainmentClosed: cr.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundaryContainmentClosed: cr.td005PaidDocumentModeBoundaryContainmentClosed,
    td005PaidDocumentModeClientFlagBypassClosed: cr.td005PaidDocumentModeClientFlagBypassClosed,
    td005PaidDocumentModeActualRuntimeImplementationDeferred: cr.td005PaidDocumentModeActualRuntimeImplementationDeferred,
    td004PreModelPiiRedactionPlanned: cr.td004PreModelPiiRedactionPlanned,
    td004PreModelPiiRedactionContracted: cr.td004PreModelPiiRedactionContracted,
    td004PreModelPiiRedactionStillRequiresRuntimeImplementation: cr.td004PreModelPiiRedactionStillRequiresRuntimeImplementation,
    td004PreModelPiiRedactionStillMissingInProduction: cr.td004PreModelPiiRedactionStillMissingInProduction,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: cr.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: cr.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: cr.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved: cr.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved: cr.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: cr.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: cr.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: cr.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: cr.tmpFilesPresentInWorkingTree,

    // 8.6B forward readiness gate
    readyFor8x6CPreModelPiiRedactionImplementationPlan: cr.readyFor8x6CPreModelPiiRedactionImplementationPlan,
    readyForEvidenceGatesProductionWiringPhase: cr.readyForEvidenceGatesProductionWiringPhase,
    readyForServerEntitlementVerificationPhase: cr.readyForServerEntitlementVerificationPhase,
    readyForPaidDocumentModeActualRuntimeImplementationPhase: cr.readyForPaidDocumentModeActualRuntimeImplementationPhase,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: cr.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase,
    readyForControlledRealDocumentPilotAuthorizationPhase: cr.readyForControlledRealDocumentPilotAuthorizationPhase,
    readyForControlledRealDocumentProductionAuthorizationPhase: cr.readyForControlledRealDocumentProductionAuthorizationPhase,
    readyForRealDocumentInput: cr.readyForRealDocumentInput,
    readyForUserVisibleOutput: cr.readyForUserVisibleOutput,
    publicRuntimeEnabled: cr.publicRuntimeEnabled,
    persistenceUsed: cr.persistenceUsed,
    neverUserVisible: cr.neverUserVisible,

    // 8.6C core assertion flags
    preModelPiiRedactionContractReadyForImplementationPlan: true,
    preModelPiiRedactionImplementationPlanOnly: true,
    preModelPiiRedactionImplementationPlanDefined: true,

    // Implementation layer confirmations
    piiImplementationPlanDefinesInputBoundaryLayer: true,
    piiImplementationPlanDefinesDetectionLayer: true,
    piiImplementationPlanDefinesPlaceholderLayer: true,
    piiImplementationPlanDefinesRedactedArtifactLayer: true,
    piiImplementationPlanDefinesFailureHandlingLayer: true,
    piiImplementationPlanDefinesDownstreamBoundaryLayer: true,
    piiImplementationPlanDefinesTestStrategyLayer: true,

    // Input boundary layer
    piiImplementationPlanInputRequiresControlledValidatedTextOnly: true,
    piiImplementationPlanInputRejectsIfValidationMissing: true,
    piiImplementationPlanInputRunsBeforePromptBuild: true,
    piiImplementationPlanInputRunsBeforeModelCall: true,
    piiImplementationPlanInputRunsBeforeRunSmartTalkDocumentLane: true,
    piiImplementationPlanInputRunsBeforeEvidenceGateEvaluation: true,
    piiImplementationPlanInputDoesNotCreateFreeQaDocumentBypass: true,

    // Detection layer
    piiImplementationPlanDetectionUsesDeterministicPatterns: true,
    piiImplementationPlanDetectionSupportsStructuredHits: true,
    piiImplementationPlanDetectionIncludesCategorySpanConfidenceReason: true,
    piiImplementationPlanDetectionDoesNotUseLlmBeforeModelFacingText: true,
    piiImplementationPlanDetectionClassifiesConservatively: true,
    piiImplementationPlanDetectionCoversGermanBureaucracyIdentifiers: true,
    piiImplementationPlanDetectionCoversGermanDocumentContactBlocks: true,

    // Placeholder layer
    piiImplementationPlanPlaceholderUsesDeterministicPlaceholders: true,
    piiImplementationPlanPlaceholderMaintainsStableMappingInsideOneRequest: true,
    piiImplementationPlanPlaceholderPreservesCategorySpecificTypes: true,
    piiImplementationPlanPlaceholderDoesNotPersistRawMapByDefault: true,
    piiImplementationPlanPlaceholderAvoidsIrreversibleSemanticDeletion: true,
    piiImplementationPlanPlaceholderPreservesDocumentStructure: true,

    // Redacted artifact layer
    piiImplementationPlanArtifactOutputsRedactedText: true,
    piiImplementationPlanArtifactOutputsPlaceholderMetadataWithoutRawValues: true,
    piiImplementationPlanArtifactOutputsCoverageMetricsWithoutRawValues: true,
    piiImplementationPlanArtifactOutputsUnresolvedHighRiskFlagsWithoutRawValues: true,
    piiImplementationPlanArtifactOutputsSafeStatus: true,
    piiImplementationPlanArtifactNeverOutputsRawPiiToUnsafeSinks: true,

    // Failure handling
    piiImplementationPlanFailureBlocksOrEscalatesLowConfidence: true,
    piiImplementationPlanFailureBlocksOrEscalatesHighRiskUnsafeIdentifiers: true,
    piiImplementationPlanFailureBlocksOrEscalatesMedicalImmigrationFinancialUnsafeIdentifiers: true,
    piiImplementationPlanFailureBlocksUnknownDocumentIdentityIfUnsafe: true,
    piiImplementationPlanFailureNeverSilentlyPassesUnredactedContent: true,

    // Downstream boundary
    piiImplementationPlanDownstreamEvidenceGatesUseRedactedOrIsolatedContentOnly: true,
    piiImplementationPlanDownstreamClaimAuthorizationUsesRedactedAnchorsOnly: true,
    piiImplementationPlanDownstreamDeadlineLogicStillRequiresDeliveryDateEvidence: true,
    piiImplementationPlanDownstreamUserVisibleOutputDoesNotRevealRawPiiUnlessSeparatelyAuthorized: true,
    piiImplementationPlanDownstreamStoragePersistenceRemainBlocked: true,
    piiImplementationPlanDownstreamPaidDocumentRuntimeRemainsBlockedUntilRequiredContracts: true,

    // Test strategy
    piiImplementationPlanTestsSyntheticGermanBureaucracyLetters: true,
    piiImplementationPlanTestsMultilingualUserTextAroundGermanDocuments: true,
    piiImplementationPlanTestsMixedDocumentUserCommentary: true,
    piiImplementationPlanTestsAllContractedIdentifierClasses: true,
    piiImplementationPlanTestsFalsePositiveControls: true,
    piiImplementationPlanTestsRedactionStability: true,
    piiImplementationPlanTestsNoRawPiiInOutputAssertions: true,
    piiImplementationPlanTestsNoRuntimeAuthorizationAssertions: true,

    // Architecture constraints
    piiImplementationPlanRequiresPureUtilityOrIsolatedGovernanceHelperFirst: true,
    piiImplementationPlanDoesNotPatchSmartTalkRouteNow: true,
    piiImplementationPlanDoesNotPatchPhotoRouteNow: true,
    piiImplementationPlanDoesNotAddPersistence: true,
    piiImplementationPlanDoesNotAddModelCalls: true,
    piiImplementationPlanDoesNotAddPromptBuilding: true,
    piiImplementationPlanDoesNotAddEntitlementLogic: true,
    piiImplementationPlanDoesNotAddPaymentLogic: true,
    piiImplementationPlanDoesNotAddUserVisibleDocumentAnswerLogic: true,
    piiImplementationPlanDoesNotEnablePublicRuntime: true,

    // Sequencing
    piiImplementationPlanNextPhase8x6DIsRuntimeContract: true,
    piiImplementationPlanThen8x6EIsDryRunImplementation: true,
    piiImplementationPlanThen8x6FIsRuntimeExecutionContract: true,
    piiImplementationPlanThen8x6GIsSurgicalUtilityPatch: true,
    piiImplementationPlanThen8x6HIsPostPatchAudit: true,
    piiImplementationPlanThen8x6IIsClosureDecision: true,
    piiImplementationPlanDoesNotSkipToRuntimeImplementation: true,
    piiImplementationPlanDoesNotCreateUtilityRuntimeFileNow: true,
    piiImplementationPlanDoesNotModifyRuntimeRouteNow: true,

    // 8.6C new actual flag
    actualPiiRedactionImplementationPlanOnly: true,

    // 8.6C side-effect confirmations
    piiImplementationPlanConfirmsNoOpenAiCall: true,
    piiImplementationPlanConfirmsNoFetchCall: true,
    piiImplementationPlanConfirmsNoProcessEnvRead: true,
    piiImplementationPlanConfirmsNoSdkUsage: true,
    piiImplementationPlanConfirmsNo8x3AcRerun: true,
    piiImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    piiImplementationPlanConfirmsNoStripeCall: true,
    piiImplementationPlanConfirmsNoCheckoutCall: true,
    piiImplementationPlanConfirmsNoEntitlementRuntimeCall: true,
    piiImplementationPlanConfirmsNoServerEntitlementVerification: true,
    piiImplementationPlanConfirmsNoOcrRuntimeCall: true,
    piiImplementationPlanConfirmsNoStorageMutation: true,
    piiImplementationPlanConfirmsNoDatabaseWrite: true,
    piiImplementationPlanConfirmsNoAuditPersistence: true,
    piiImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    piiImplementationPlanConfirmsNoEvidenceEvaluation: true,
    piiImplementationPlanConfirmsNoClaimAuthorization: true,
    piiImplementationPlanConfirmsNoDeadlineCalculation: true,
    piiImplementationPlanConfirmsNoLegalCertainty: true,
    piiImplementationPlanConfirmsNoPromptBuild: true,
    piiImplementationPlanConfirmsNoModelCall: true,
    piiImplementationPlanConfirmsNoRunSmartTalkCall: true,
    piiImplementationPlanConfirmsNoRouteHandlerCall: true,
    piiImplementationPlanConfirmsNoRouteImport: true,
    piiImplementationPlanConfirmsNoFilesystemRead: true,
    piiImplementationPlanConfirmsNoPhotoRouteModification: true,

    // 8.6C TD result flags
    td004PreModelPiiRedactionImplementationPlanned: true,
    td004PreModelPiiRedactionStillRequiresRuntimeContract: true,

    // 8.6C forward readiness
    readyFor8x6DPreModelPiiRedactionRuntimeContract: true,
  };
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x6CInput();
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Record<string, unknown>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateImplementationPlanInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.6B prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.6C" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("prereq_plan_ready_for_contract_false", { preModelPiiRedactionPlanReadyForContract: false });
  expect_rejected("prereq_contract_not_accepted", { controlledRealDocumentPreModelPiiRedactionContractAccepted: false });
  expect_rejected("prereq_contract_only_false", { preModelPiiRedactionContractOnly: false });
  expect_rejected("prereq_contract_defined_false", { preModelPiiRedactionContractDefined: false });
  expect_rejected("prereq_pii_redaction_runtime_still_not_implemented_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_detector_runtime_still_not_implemented_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_masking_runtime_still_not_implemented_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_real_document_input_false", { preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_user_visible_output_false", { preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_prompt_build_false", { preModelPiiRedactionDoesNotAuthorizePromptBuild: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_model_call_false", { preModelPiiRedactionDoesNotAuthorizeModelCall: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_run_smart_talk_false", { preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.6B contract boundary obligations
  expect_rejected("prereq_pii_contract_boundary_before_prompt_build_false", { piiContractRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("prereq_pii_contract_boundary_before_model_call_false", { piiContractRequiresBoundaryBeforeModelCall: false });
  expect_rejected("prereq_pii_contract_boundary_before_run_smart_talk_false", { piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: false });
  expect_rejected("prereq_pii_contract_boundary_after_controlled_input_validation_false", { piiContractRequiresBoundaryAfterControlledInputValidation: false });
  expect_rejected("prereq_pii_contract_boundary_before_evidence_gate_false", { piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: false });
  expect_rejected("prereq_pii_contract_no_free_qa_bypass_false", { piiContractDoesNotCreateFreeQaDocumentBypass: false });
  expect_rejected("prereq_pii_contract_no_real_doc_input_false", { piiContractDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_pii_contract_no_user_visible_doc_output_false", { piiContractDoesNotAuthorizeUserVisibleDocumentOutput: false });
  expect_rejected("prereq_pii_contract_no_exact_deadline_false", { piiContractDoesNotAuthorizeExactDeadlineCalculation: false });
  expect_rejected("prereq_pii_contract_no_public_runtime_false", { piiContractDoesNotAuthorizePublicRuntime: false });

  // 8.6B contract PII class coverage (32)
  for (const cls of PII_CLASSES) {
    expect_rejected(`prereq_pii_contract_covers_${cls}_false`, { [`piiContractCovers${cls}`]: false });
  }

  // 8.6B contract redaction/masking (16)
  for (const req of REDACTION_REQS) {
    expect_rejected(`prereq_pii_contract_requires_${req}_false`, { [`piiContractRequires${req}`]: false });
  }

  // 8.6B contract placeholder (15)
  for (const ph of PLACEHOLDERS) {
    expect_rejected(`prereq_pii_contract_allows_${ph}_placeholder_false`, { [`piiContractAllows${ph}Placeholder`]: false });
  }

  // 8.6B contract safety (12)
  for (const k of CONTRACT_SAFETY_KEYS) {
    expect_rejected(`prereq_${k}_false`, { [k]: false });
  }

  // 8.6B contract failure modes (9)
  for (const fm of FAILURE_MODES) {
    expect_rejected(`prereq_pii_contract_defines_failure_${fm}_false`, { [`piiContractDefinesFailure${fm}`]: false });
  }

  // 8.6B contract downstream (7)
  for (const k of CONTRACT_DOWNSTREAM_KEYS) {
    expect_rejected(`prereq_${k}_false`, { [k]: false });
  }

  // 8.6B contract decision confirmations (9)
  expect_rejected("prereq_pii_contract_accepts_plan_false", { piiContractAcceptsPlan: false });
  expect_rejected("prereq_pii_contract_ready_for_future_implementation_plan_false", { piiContractReadyForFutureImplementationPlan: false });
  expect_rejected("prereq_pii_contract_no_runtime_implementation_now_false", { piiContractDoesNotAuthorizeRuntimeImplementationNow: false });
  expect_rejected("prereq_pii_contract_no_pii_processing_now_false", { piiContractDoesNotAuthorizePiiProcessingNow: false });
  expect_rejected("prereq_pii_contract_no_raw_pii_handling_now_false", { piiContractDoesNotAuthorizeRawPiiHandlingNow: false });
  expect_rejected("prereq_pii_contract_no_document_processing_now_false", { piiContractDoesNotAuthorizeDocumentProcessingNow: false });
  expect_rejected("prereq_pii_contract_no_prompt_build_now_false", { piiContractDoesNotAuthorizePromptBuildNow: false });
  expect_rejected("prereq_pii_contract_no_model_call_now_false", { piiContractDoesNotAuthorizeModelCallNow: false });
  expect_rejected("prereq_pii_contract_no_run_smart_talk_now_false", { piiContractDoesNotAuthorizeRunSmartTalkNow: false });

  // 8.6B actual flags
  expect_rejected("prereq_actual_pii_redaction_contract_only_false", { actualPiiRedactionContractOnly: false });
  expect_rejected("prereq_actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("prereq_actual_pii_detector_runtime_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_masking_runtime_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_text_redacted_true", { actualPiiTextRedacted: true });
  expect_rejected("prereq_actual_raw_pii_processed_true", { actualRawPiiProcessed: true });
  expect_rejected("prereq_actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("prereq_actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("prereq_actual_prompt_build_true", { actualPromptBuildPerformed: true });
  expect_rejected("prereq_actual_model_call_true", { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_true", { actualRunSmartTalkCalled: true });
  expect_rejected("prereq_actual_evidence_gate_wiring_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("prereq_actual_claim_authorization_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("prereq_actual_deadline_calculation_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("prereq_actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_paid_document_mode_true", { actualPaidDocumentModeImplemented: true });
  expect_rejected("prereq_actual_payment_runtime_true", { actualPaymentRuntimeImplemented: true });
  expect_rejected("prereq_actual_checkout_true", { actualCheckoutImplemented: true });
  expect_rejected("prereq_actual_entitlement_runtime_true", { actualEntitlementRuntimeImplemented: true });
  expect_rejected("prereq_actual_server_entitlement_true", { actualServerEntitlementVerificationImplemented: true });
  expect_rejected("prereq_actual_real_document_input_true", { actualRealDocumentInputPerformed: true });
  expect_rejected("prereq_actual_real_document_processing_true", { actualRealDocumentProcessingPerformed: true });
  expect_rejected("prereq_actual_ocr_true", { actualOcrPerformed: true });
  expect_rejected("prereq_actual_photo_input_true", { actualPhotoInputProcessed: true });
  expect_rejected("prereq_actual_file_input_true", { actualFileInputProcessed: true });
  expect_rejected("prereq_actual_document_storage_true", { actualDocumentStoragePerformed: true });
  expect_rejected("prereq_actual_database_persistence_true", { actualDatabasePersistencePerformed: true });
  expect_rejected("prereq_actual_audit_persistence_true", { actualAuditPersistencePerformed: true });
  expect_rejected("prereq_actual_user_visible_output_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("prereq_actual_public_runtime_true", { actualPublicRuntimeEnabled: true });

  // 8.6B contract side-effect confirmations (26)
  for (const se of CONTRACT_SIDE_EFFECTS) {
    expect_rejected(`prereq_pii_contract_confirms_${se}_false`, { [`piiContractConfirms${se}`]: false });
  }

  // Pipeline flags
  for (const f of PIPELINE_FLAGS) { expect_rejected(`prereq_${f}_true`, { [f]: true }); }

  // Runtime auth flags
  for (const f of RUNTIME_AUTH_FLAGS) { expect_rejected(`prereq_${f}_true`, { [f]: true }); }

  // Auth grants
  expect_rejected("prereq_runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("prereq_pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("prereq_production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("prereq_final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("prereq_go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety
  expect_rejected("prereq_exact_deadline_calculation_authorized_true", { exactDeadlineCalculationAuthorized: true });
  expect_rejected("prereq_delivery_date_invention_authorized_true", { deliveryDateInventionAuthorized: true });
  expect_rejected("prereq_final_date_invention_authorized_true", { finalDateInventionAuthorized: true });
  expect_rejected("prereq_legal_certainty_authorized_true", { legalCertaintyAuthorized: true });
  expect_rejected("prereq_coercive_legal_instruction_authorized_true", { coerciveLegalInstructionAuthorized: true });
  expect_rejected("prereq_delivery_date_required_for_exact_deadline_false", { deliveryDateRequiredForExactDeadline: false });

  // TD flags
  expect_rejected("prereq_td001_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("prereq_td005_boundary_false", { td005PaidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("prereq_td005_client_flag_false", { td005PaidDocumentModeClientFlagBypassClosed: false });
  expect_rejected("prereq_td005_deferred_false", { td005PaidDocumentModeActualRuntimeImplementationDeferred: false });
  expect_rejected("prereq_td004_planned_false", { td004PreModelPiiRedactionPlanned: false });
  expect_rejected("prereq_td004_contracted_false", { td004PreModelPiiRedactionContracted: false });
  expect_rejected("prereq_td004_still_requires_runtime_implementation_false", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
  expect_rejected("prereq_td004_still_missing_in_production_false", { td004PreModelPiiRedactionStillMissingInProduction: false });
  expect_rejected("prereq_td002_false", { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("prereq_td003_contained_false", { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("prereq_td003_future_design_false", { td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: false });
  expect_rejected("prereq_td006_false", { td006EvidenceGateTodoAndOrSemanticsUnresolved: false });
  expect_rejected("prereq_td007_false", { td007TrapClaimDispositionNamespaceHardeningUnresolved: false });
  expect_rejected("prereq_td008_false", { td008InMemoryRateLimiterServerlessUnsafe: false });
  expect_rejected("prereq_td010_false", { td010GetUserStateDocumentTypeTodoOpen: false });
  expect_rejected("prereq_td009_false", { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("prereq_tmp_files_present_true", { tmpFilesPresentInWorkingTree: true });

  // 8.6B forward readiness gate
  expect_rejected("prereq_ready_for_8x6c_implementation_plan_false", { readyFor8x6CPreModelPiiRedactionImplementationPlan: false });
  expect_rejected("prereq_ready_for_evidence_gates_true", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("prereq_ready_for_server_entitlement_true", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("prereq_ready_for_paid_document_mode_true", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("prereq_ready_for_separate_runtime_authorization_true", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_pilot_true", { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_production_true", { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_real_document_input_true", { readyForRealDocumentInput: true });
  expect_rejected("prereq_ready_for_user_visible_output_true", { readyForUserVisibleOutput: true });
  expect_rejected("prereq_public_runtime_enabled_true", { publicRuntimeEnabled: true });
  expect_rejected("prereq_persistence_used_true", { persistenceUsed: true });
  expect_rejected("prereq_never_user_visible_false", { neverUserVisible: false });

  // 8.6C core assertion flags
  expect_rejected("contract_ready_for_implementation_plan_false", { preModelPiiRedactionContractReadyForImplementationPlan: false });
  expect_rejected("pii_implementation_plan_only_false", { preModelPiiRedactionImplementationPlanOnly: false });
  expect_rejected("pii_implementation_plan_defined_false", { preModelPiiRedactionImplementationPlanDefined: false });

  // Implementation layer confirmations (7)
  expect_rejected("pii_impl_plan_defines_input_boundary_layer_false", { piiImplementationPlanDefinesInputBoundaryLayer: false });
  expect_rejected("pii_impl_plan_defines_detection_layer_false", { piiImplementationPlanDefinesDetectionLayer: false });
  expect_rejected("pii_impl_plan_defines_placeholder_layer_false", { piiImplementationPlanDefinesPlaceholderLayer: false });
  expect_rejected("pii_impl_plan_defines_redacted_artifact_layer_false", { piiImplementationPlanDefinesRedactedArtifactLayer: false });
  expect_rejected("pii_impl_plan_defines_failure_handling_layer_false", { piiImplementationPlanDefinesFailureHandlingLayer: false });
  expect_rejected("pii_impl_plan_defines_downstream_boundary_layer_false", { piiImplementationPlanDefinesDownstreamBoundaryLayer: false });
  expect_rejected("pii_impl_plan_defines_test_strategy_layer_false", { piiImplementationPlanDefinesTestStrategyLayer: false });

  // Input boundary layer (7)
  expect_rejected("pii_impl_input_requires_controlled_validated_text_false", { piiImplementationPlanInputRequiresControlledValidatedTextOnly: false });
  expect_rejected("pii_impl_input_rejects_if_validation_missing_false", { piiImplementationPlanInputRejectsIfValidationMissing: false });
  expect_rejected("pii_impl_input_runs_before_prompt_build_false", { piiImplementationPlanInputRunsBeforePromptBuild: false });
  expect_rejected("pii_impl_input_runs_before_model_call_false", { piiImplementationPlanInputRunsBeforeModelCall: false });
  expect_rejected("pii_impl_input_runs_before_run_smart_talk_false", { piiImplementationPlanInputRunsBeforeRunSmartTalkDocumentLane: false });
  expect_rejected("pii_impl_input_runs_before_evidence_gate_false", { piiImplementationPlanInputRunsBeforeEvidenceGateEvaluation: false });
  expect_rejected("pii_impl_input_no_free_qa_bypass_false", { piiImplementationPlanInputDoesNotCreateFreeQaDocumentBypass: false });

  // Detection layer (7)
  expect_rejected("pii_impl_detection_uses_deterministic_patterns_false", { piiImplementationPlanDetectionUsesDeterministicPatterns: false });
  expect_rejected("pii_impl_detection_supports_structured_hits_false", { piiImplementationPlanDetectionSupportsStructuredHits: false });
  expect_rejected("pii_impl_detection_includes_category_span_false", { piiImplementationPlanDetectionIncludesCategorySpanConfidenceReason: false });
  expect_rejected("pii_impl_detection_no_llm_false", { piiImplementationPlanDetectionDoesNotUseLlmBeforeModelFacingText: false });
  expect_rejected("pii_impl_detection_classifies_conservatively_false", { piiImplementationPlanDetectionClassifiesConservatively: false });
  expect_rejected("pii_impl_detection_covers_german_bureaucracy_false", { piiImplementationPlanDetectionCoversGermanBureaucracyIdentifiers: false });
  expect_rejected("pii_impl_detection_covers_german_document_contact_false", { piiImplementationPlanDetectionCoversGermanDocumentContactBlocks: false });

  // Placeholder layer (6)
  expect_rejected("pii_impl_placeholder_deterministic_false", { piiImplementationPlanPlaceholderUsesDeterministicPlaceholders: false });
  expect_rejected("pii_impl_placeholder_stable_mapping_false", { piiImplementationPlanPlaceholderMaintainsStableMappingInsideOneRequest: false });
  expect_rejected("pii_impl_placeholder_preserves_category_types_false", { piiImplementationPlanPlaceholderPreservesCategorySpecificTypes: false });
  expect_rejected("pii_impl_placeholder_no_persist_raw_map_false", { piiImplementationPlanPlaceholderDoesNotPersistRawMapByDefault: false });
  expect_rejected("pii_impl_placeholder_avoids_irreversible_deletion_false", { piiImplementationPlanPlaceholderAvoidsIrreversibleSemanticDeletion: false });
  expect_rejected("pii_impl_placeholder_preserves_document_structure_false", { piiImplementationPlanPlaceholderPreservesDocumentStructure: false });

  // Redacted artifact layer (6)
  expect_rejected("pii_impl_artifact_outputs_redacted_text_false", { piiImplementationPlanArtifactOutputsRedactedText: false });
  expect_rejected("pii_impl_artifact_outputs_placeholder_metadata_false", { piiImplementationPlanArtifactOutputsPlaceholderMetadataWithoutRawValues: false });
  expect_rejected("pii_impl_artifact_outputs_coverage_metrics_false", { piiImplementationPlanArtifactOutputsCoverageMetricsWithoutRawValues: false });
  expect_rejected("pii_impl_artifact_outputs_unresolved_flags_false", { piiImplementationPlanArtifactOutputsUnresolvedHighRiskFlagsWithoutRawValues: false });
  expect_rejected("pii_impl_artifact_outputs_safe_status_false", { piiImplementationPlanArtifactOutputsSafeStatus: false });
  expect_rejected("pii_impl_artifact_never_outputs_raw_pii_false", { piiImplementationPlanArtifactNeverOutputsRawPiiToUnsafeSinks: false });

  // Failure handling (5)
  expect_rejected("pii_impl_failure_blocks_low_confidence_false", { piiImplementationPlanFailureBlocksOrEscalatesLowConfidence: false });
  expect_rejected("pii_impl_failure_blocks_high_risk_false", { piiImplementationPlanFailureBlocksOrEscalatesHighRiskUnsafeIdentifiers: false });
  expect_rejected("pii_impl_failure_blocks_medical_immigration_financial_false", { piiImplementationPlanFailureBlocksOrEscalatesMedicalImmigrationFinancialUnsafeIdentifiers: false });
  expect_rejected("pii_impl_failure_blocks_unknown_identity_false", { piiImplementationPlanFailureBlocksUnknownDocumentIdentityIfUnsafe: false });
  expect_rejected("pii_impl_failure_never_silently_passes_false", { piiImplementationPlanFailureNeverSilentlyPassesUnredactedContent: false });

  // Downstream boundary (6)
  expect_rejected("pii_impl_downstream_evidence_gates_redacted_false", { piiImplementationPlanDownstreamEvidenceGatesUseRedactedOrIsolatedContentOnly: false });
  expect_rejected("pii_impl_downstream_claim_authorization_redacted_false", { piiImplementationPlanDownstreamClaimAuthorizationUsesRedactedAnchorsOnly: false });
  expect_rejected("pii_impl_downstream_deadline_delivery_date_false", { piiImplementationPlanDownstreamDeadlineLogicStillRequiresDeliveryDateEvidence: false });
  expect_rejected("pii_impl_downstream_user_visible_no_raw_pii_false", { piiImplementationPlanDownstreamUserVisibleOutputDoesNotRevealRawPiiUnlessSeparatelyAuthorized: false });
  expect_rejected("pii_impl_downstream_storage_blocked_false", { piiImplementationPlanDownstreamStoragePersistenceRemainBlocked: false });
  expect_rejected("pii_impl_downstream_paid_doc_runtime_blocked_false", { piiImplementationPlanDownstreamPaidDocumentRuntimeRemainsBlockedUntilRequiredContracts: false });

  // Test strategy (8)
  expect_rejected("pii_impl_tests_synthetic_german_letters_false", { piiImplementationPlanTestsSyntheticGermanBureaucracyLetters: false });
  expect_rejected("pii_impl_tests_multilingual_false", { piiImplementationPlanTestsMultilingualUserTextAroundGermanDocuments: false });
  expect_rejected("pii_impl_tests_mixed_doc_user_commentary_false", { piiImplementationPlanTestsMixedDocumentUserCommentary: false });
  expect_rejected("pii_impl_tests_all_contracted_identifiers_false", { piiImplementationPlanTestsAllContractedIdentifierClasses: false });
  expect_rejected("pii_impl_tests_false_positive_controls_false", { piiImplementationPlanTestsFalsePositiveControls: false });
  expect_rejected("pii_impl_tests_redaction_stability_false", { piiImplementationPlanTestsRedactionStability: false });
  expect_rejected("pii_impl_tests_no_raw_pii_in_output_false", { piiImplementationPlanTestsNoRawPiiInOutputAssertions: false });
  expect_rejected("pii_impl_tests_no_runtime_auth_false", { piiImplementationPlanTestsNoRuntimeAuthorizationAssertions: false });

  // Architecture constraints (10)
  expect_rejected("pii_impl_arch_pure_utility_first_false", { piiImplementationPlanRequiresPureUtilityOrIsolatedGovernanceHelperFirst: false });
  expect_rejected("pii_impl_arch_no_smart_talk_patch_false", { piiImplementationPlanDoesNotPatchSmartTalkRouteNow: false });
  expect_rejected("pii_impl_arch_no_photo_patch_false", { piiImplementationPlanDoesNotPatchPhotoRouteNow: false });
  expect_rejected("pii_impl_arch_no_persistence_false", { piiImplementationPlanDoesNotAddPersistence: false });
  expect_rejected("pii_impl_arch_no_model_calls_false", { piiImplementationPlanDoesNotAddModelCalls: false });
  expect_rejected("pii_impl_arch_no_prompt_building_false", { piiImplementationPlanDoesNotAddPromptBuilding: false });
  expect_rejected("pii_impl_arch_no_entitlement_logic_false", { piiImplementationPlanDoesNotAddEntitlementLogic: false });
  expect_rejected("pii_impl_arch_no_payment_logic_false", { piiImplementationPlanDoesNotAddPaymentLogic: false });
  expect_rejected("pii_impl_arch_no_user_visible_doc_answer_false", { piiImplementationPlanDoesNotAddUserVisibleDocumentAnswerLogic: false });
  expect_rejected("pii_impl_arch_no_public_runtime_false", { piiImplementationPlanDoesNotEnablePublicRuntime: false });

  // Sequencing (9)
  expect_rejected("pii_impl_seq_8x6d_runtime_contract_false", { piiImplementationPlanNextPhase8x6DIsRuntimeContract: false });
  expect_rejected("pii_impl_seq_8x6e_dry_run_false", { piiImplementationPlanThen8x6EIsDryRunImplementation: false });
  expect_rejected("pii_impl_seq_8x6f_runtime_execution_contract_false", { piiImplementationPlanThen8x6FIsRuntimeExecutionContract: false });
  expect_rejected("pii_impl_seq_8x6g_surgical_utility_patch_false", { piiImplementationPlanThen8x6GIsSurgicalUtilityPatch: false });
  expect_rejected("pii_impl_seq_8x6h_post_patch_audit_false", { piiImplementationPlanThen8x6HIsPostPatchAudit: false });
  expect_rejected("pii_impl_seq_8x6i_closure_decision_false", { piiImplementationPlanThen8x6IIsClosureDecision: false });
  expect_rejected("pii_impl_seq_no_skip_to_runtime_false", { piiImplementationPlanDoesNotSkipToRuntimeImplementation: false });
  expect_rejected("pii_impl_seq_no_utility_runtime_file_now_false", { piiImplementationPlanDoesNotCreateUtilityRuntimeFileNow: false });
  expect_rejected("pii_impl_seq_no_modify_runtime_route_now_false", { piiImplementationPlanDoesNotModifyRuntimeRouteNow: false });

  // 8.6C new actual flag + shared actual violations
  expect_rejected("actual_pii_redaction_implementation_plan_only_false", { actualPiiRedactionImplementationPlanOnly: false });
  expect_rejected("actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("actual_pii_detector_runtime_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("actual_pii_masking_runtime_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("actual_pii_text_redacted_true", { actualPiiTextRedacted: true });
  expect_rejected("actual_raw_pii_processed_true", { actualRawPiiProcessed: true });
  expect_rejected("actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("actual_prompt_build_true", { actualPromptBuildPerformed: true });
  expect_rejected("actual_model_call_true", { actualModelCallPerformed: true });
  expect_rejected("actual_run_smart_talk_true", { actualRunSmartTalkCalled: true });
  expect_rejected("actual_evidence_gate_wiring_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("actual_claim_authorization_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calculation_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("actual_real_document_input_true", { actualRealDocumentInputPerformed: true });
  expect_rejected("actual_real_document_processing_true", { actualRealDocumentProcessingPerformed: true });
  expect_rejected("actual_user_visible_output_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("actual_public_runtime_true", { actualPublicRuntimeEnabled: true });

  // 8.6C side-effect confirmations (26)
  for (const se of CONTRACT_SIDE_EFFECTS) {
    expect_rejected(`pii_implementation_plan_confirms_${se}_false`, { [`piiImplementationPlanConfirms${se}`]: false });
  }

  // Pipeline violations
  for (const f of PIPELINE_FLAGS) { expect_rejected(`${f}_true_result`, { [f]: true }); }

  // Runtime auth violations
  for (const f of RUNTIME_AUTH_FLAGS) { expect_rejected(`${f}_true_result`, { [f]: true }); }

  // Auth grant violations
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety result violations
  expect_rejected("exact_deadline_calculation_authorized_true", { exactDeadlineCalculationAuthorized: true });

  // 8.6C TD result flags
  expect_rejected("td004_implementation_planned_false", { td004PreModelPiiRedactionImplementationPlanned: false });
  expect_rejected("td004_still_requires_runtime_contract_false", { td004PreModelPiiRedactionStillRequiresRuntimeContract: false });
  expect_rejected("td004_still_requires_runtime_implementation_false", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
  expect_rejected("td004_still_missing_in_production_false", { td004PreModelPiiRedactionStillMissingInProduction: false });

  // 8.6C forward readiness
  expect_rejected("ready_for_8x6d_runtime_contract_false", { readyFor8x6DPreModelPiiRedactionRuntimeContract: false });
  expect_rejected("ready_for_evidence_gates_true_result", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("ready_for_server_entitlement_true_result", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("ready_for_paid_document_mode_true_result", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("ready_for_separate_runtime_authorization_true_result", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true_result", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_result", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true_result", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_result", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_result", { neverUserVisible: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPreModelPiiRedactionImplementationPlan(): ControlledRealDocumentPreModelPiiRedactionImplementationPlanResult {
  const canonical = buildCanonical8x6CInput();
  const validation = validateImplementationPlanInput(canonical);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.6C",
    allPassed,
    preModelPiiRedactionContractReadyForImplementationPlan: true,
    controlledRealDocumentPreModelPiiRedactionImplementationPlanAccepted: allPassed,
    preModelPiiRedactionImplementationPlanOnly: true,
    preModelPiiRedactionImplementationPlanDefined: true,
    preModelPiiRedactionRuntimeStillNotImplemented: true,
    preModelPiiDetectorRuntimeStillNotImplemented: true,
    preModelPiiMaskingRuntimeStillNotImplemented: true,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: true,
    preModelPiiRedactionDoesNotAuthorizeModelCall: true,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true,
    tamperCasesRejected: tamperResult.allRejected,

    piiImplementationPlanDefinesInputBoundaryLayer: true,
    piiImplementationPlanDefinesDetectionLayer: true,
    piiImplementationPlanDefinesPlaceholderLayer: true,
    piiImplementationPlanDefinesRedactedArtifactLayer: true,
    piiImplementationPlanDefinesFailureHandlingLayer: true,
    piiImplementationPlanDefinesDownstreamBoundaryLayer: true,
    piiImplementationPlanDefinesTestStrategyLayer: true,

    piiImplementationPlanInputRequiresControlledValidatedTextOnly: true,
    piiImplementationPlanInputRejectsIfValidationMissing: true,
    piiImplementationPlanInputRunsBeforePromptBuild: true,
    piiImplementationPlanInputRunsBeforeModelCall: true,
    piiImplementationPlanInputRunsBeforeRunSmartTalkDocumentLane: true,
    piiImplementationPlanInputRunsBeforeEvidenceGateEvaluation: true,
    piiImplementationPlanInputDoesNotCreateFreeQaDocumentBypass: true,

    piiImplementationPlanDetectionUsesDeterministicPatterns: true,
    piiImplementationPlanDetectionSupportsStructuredHits: true,
    piiImplementationPlanDetectionIncludesCategorySpanConfidenceReason: true,
    piiImplementationPlanDetectionDoesNotUseLlmBeforeModelFacingText: true,
    piiImplementationPlanDetectionClassifiesConservatively: true,
    piiImplementationPlanDetectionCoversGermanBureaucracyIdentifiers: true,
    piiImplementationPlanDetectionCoversGermanDocumentContactBlocks: true,

    piiImplementationPlanPlaceholderUsesDeterministicPlaceholders: true,
    piiImplementationPlanPlaceholderMaintainsStableMappingInsideOneRequest: true,
    piiImplementationPlanPlaceholderPreservesCategorySpecificTypes: true,
    piiImplementationPlanPlaceholderDoesNotPersistRawMapByDefault: true,
    piiImplementationPlanPlaceholderAvoidsIrreversibleSemanticDeletion: true,
    piiImplementationPlanPlaceholderPreservesDocumentStructure: true,

    piiImplementationPlanArtifactOutputsRedactedText: true,
    piiImplementationPlanArtifactOutputsPlaceholderMetadataWithoutRawValues: true,
    piiImplementationPlanArtifactOutputsCoverageMetricsWithoutRawValues: true,
    piiImplementationPlanArtifactOutputsUnresolvedHighRiskFlagsWithoutRawValues: true,
    piiImplementationPlanArtifactOutputsSafeStatus: true,
    piiImplementationPlanArtifactNeverOutputsRawPiiToUnsafeSinks: true,

    piiImplementationPlanFailureBlocksOrEscalatesLowConfidence: true,
    piiImplementationPlanFailureBlocksOrEscalatesHighRiskUnsafeIdentifiers: true,
    piiImplementationPlanFailureBlocksOrEscalatesMedicalImmigrationFinancialUnsafeIdentifiers: true,
    piiImplementationPlanFailureBlocksUnknownDocumentIdentityIfUnsafe: true,
    piiImplementationPlanFailureNeverSilentlyPassesUnredactedContent: true,

    piiImplementationPlanDownstreamEvidenceGatesUseRedactedOrIsolatedContentOnly: true,
    piiImplementationPlanDownstreamClaimAuthorizationUsesRedactedAnchorsOnly: true,
    piiImplementationPlanDownstreamDeadlineLogicStillRequiresDeliveryDateEvidence: true,
    piiImplementationPlanDownstreamUserVisibleOutputDoesNotRevealRawPiiUnlessSeparatelyAuthorized: true,
    piiImplementationPlanDownstreamStoragePersistenceRemainBlocked: true,
    piiImplementationPlanDownstreamPaidDocumentRuntimeRemainsBlockedUntilRequiredContracts: true,

    piiImplementationPlanTestsSyntheticGermanBureaucracyLetters: true,
    piiImplementationPlanTestsMultilingualUserTextAroundGermanDocuments: true,
    piiImplementationPlanTestsMixedDocumentUserCommentary: true,
    piiImplementationPlanTestsAllContractedIdentifierClasses: true,
    piiImplementationPlanTestsFalsePositiveControls: true,
    piiImplementationPlanTestsRedactionStability: true,
    piiImplementationPlanTestsNoRawPiiInOutputAssertions: true,
    piiImplementationPlanTestsNoRuntimeAuthorizationAssertions: true,

    piiImplementationPlanRequiresPureUtilityOrIsolatedGovernanceHelperFirst: true,
    piiImplementationPlanDoesNotPatchSmartTalkRouteNow: true,
    piiImplementationPlanDoesNotPatchPhotoRouteNow: true,
    piiImplementationPlanDoesNotAddPersistence: true,
    piiImplementationPlanDoesNotAddModelCalls: true,
    piiImplementationPlanDoesNotAddPromptBuilding: true,
    piiImplementationPlanDoesNotAddEntitlementLogic: true,
    piiImplementationPlanDoesNotAddPaymentLogic: true,
    piiImplementationPlanDoesNotAddUserVisibleDocumentAnswerLogic: true,
    piiImplementationPlanDoesNotEnablePublicRuntime: true,

    piiImplementationPlanNextPhase8x6DIsRuntimeContract: true,
    piiImplementationPlanThen8x6EIsDryRunImplementation: true,
    piiImplementationPlanThen8x6FIsRuntimeExecutionContract: true,
    piiImplementationPlanThen8x6GIsSurgicalUtilityPatch: true,
    piiImplementationPlanThen8x6HIsPostPatchAudit: true,
    piiImplementationPlanThen8x6IIsClosureDecision: true,
    piiImplementationPlanDoesNotSkipToRuntimeImplementation: true,
    piiImplementationPlanDoesNotCreateUtilityRuntimeFileNow: true,
    piiImplementationPlanDoesNotModifyRuntimeRouteNow: true,

    actualPiiRedactionImplementationPlanOnly: true,
    actualPiiRedactionImplemented: false,
    actualPiiDetectorRuntimeImplemented: false,
    actualPiiMaskingRuntimeImplemented: false,
    actualPiiTextRedacted: false,
    actualRawPiiProcessed: false,
    actualRawPiiPersisted: false,
    actualRawPiiLogged: false,
    actualPromptBuildPerformed: false,
    actualModelCallPerformed: false,
    actualRunSmartTalkCalled: false,
    actualEvidenceGateRuntimeWiringPerformed: false,
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

    piiImplementationPlanConfirmsNoOpenAiCall: true,
    piiImplementationPlanConfirmsNoFetchCall: true,
    piiImplementationPlanConfirmsNoProcessEnvRead: true,
    piiImplementationPlanConfirmsNoSdkUsage: true,
    piiImplementationPlanConfirmsNo8x3AcRerun: true,
    piiImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    piiImplementationPlanConfirmsNoStripeCall: true,
    piiImplementationPlanConfirmsNoCheckoutCall: true,
    piiImplementationPlanConfirmsNoEntitlementRuntimeCall: true,
    piiImplementationPlanConfirmsNoServerEntitlementVerification: true,
    piiImplementationPlanConfirmsNoOcrRuntimeCall: true,
    piiImplementationPlanConfirmsNoStorageMutation: true,
    piiImplementationPlanConfirmsNoDatabaseWrite: true,
    piiImplementationPlanConfirmsNoAuditPersistence: true,
    piiImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    piiImplementationPlanConfirmsNoEvidenceEvaluation: true,
    piiImplementationPlanConfirmsNoClaimAuthorization: true,
    piiImplementationPlanConfirmsNoDeadlineCalculation: true,
    piiImplementationPlanConfirmsNoLegalCertainty: true,
    piiImplementationPlanConfirmsNoPromptBuild: true,
    piiImplementationPlanConfirmsNoModelCall: true,
    piiImplementationPlanConfirmsNoRunSmartTalkCall: true,
    piiImplementationPlanConfirmsNoRouteHandlerCall: true,
    piiImplementationPlanConfirmsNoRouteImport: true,
    piiImplementationPlanConfirmsNoFilesystemRead: true,
    piiImplementationPlanConfirmsNoPhotoRouteModification: true,

    executionSequenceActuallyExecuted: false,
    runtimePipelineActuallyExecuted: false,
    documentPipelineActuallyExecuted: false,
    piiPipelineActuallyExecuted: false,
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
    td004PreModelPiiRedactionStillRequiresRuntimeContract: true,
    td004PreModelPiiRedactionStillRequiresRuntimeImplementation: true,
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

    readyFor8x6DPreModelPiiRedactionRuntimeContract: true,
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
      "8.6C is a Pre-Model PII Redaction Implementation Plan.",
      "8.6C depends on completed 8.6B Pre-Model PII Redaction Contract.",
      "8.6C is implementation-plan-only and creates no runtime behavior.",
      "8.6C does not modify /api/smart-talk.",
      "8.6C does not modify /api/smart-talk-photo.",
      "8.6C defines future implementation layers for a deterministic pre-model PII redaction boundary.",
      "8.6C does not implement PII redaction runtime.",
      "8.6C does not implement PII detector runtime.",
      "8.6C does not implement PII masking runtime.",
      "8.6C does not create a utility runtime file.",
      "8.6C does not redact real text.",
      "8.6C does not process raw PII.",
      "8.6C does not authorize real document input.",
      "8.6C does not authorize user-visible output.",
      "8.6C does not authorize prompt build, model call, or runSmartTalk.",
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
      "TD-004 is now planned, contracted, and implementation-planned, but still missing in production.",
      "TD-004 still requires runtime contract and runtime implementation.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyFor8x6DPreModelPiiRedactionRuntimeContract is runtime-contract readiness only, not runtime authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
