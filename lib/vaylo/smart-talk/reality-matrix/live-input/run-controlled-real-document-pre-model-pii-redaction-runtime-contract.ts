/**
 * Phase 8.6D — Controlled Real Document Pre-Model PII Redaction Runtime Contract.
 *
 * RUNTIME-CONTRACT-ONLY — NO RUNTIME BEHAVIOR — DEPENDS ON 8.6C.
 *
 * Authorizes only the design of a future isolated deterministic PII redaction
 * utility. Does NOT implement the utility, create any runtime file, or wire
 * anything into /api/smart-talk.
 */

import { runControlledRealDocumentPreModelPiiRedactionImplementationPlan } from "./run-controlled-real-document-pre-model-pii-redaction-implementation-plan";

// ── Shared arrays ────────────────────────────────────────────────────────────

const IMPL_LAYER_SUFFIXES = ["DefinesInputBoundaryLayer","DefinesDetectionLayer","DefinesPlaceholderLayer","DefinesRedactedArtifactLayer","DefinesFailureHandlingLayer","DefinesDownstreamBoundaryLayer","DefinesTestStrategyLayer"] as const;

const IMPL_INPUT_SUFFIXES = ["InputRequiresControlledValidatedTextOnly","InputRejectsIfValidationMissing","InputRunsBeforePromptBuild","InputRunsBeforeModelCall","InputRunsBeforeRunSmartTalkDocumentLane","InputRunsBeforeEvidenceGateEvaluation","InputDoesNotCreateFreeQaDocumentBypass"] as const;

const IMPL_DETECTION_SUFFIXES = ["DetectionUsesDeterministicPatterns","DetectionSupportsStructuredHits","DetectionIncludesCategorySpanConfidenceReason","DetectionDoesNotUseLlmBeforeModelFacingText","DetectionClassifiesConservatively","DetectionCoversGermanBureaucracyIdentifiers","DetectionCoversGermanDocumentContactBlocks"] as const;

const IMPL_PLACEHOLDER_SUFFIXES = ["PlaceholderUsesDeterministicPlaceholders","PlaceholderMaintainsStableMappingInsideOneRequest","PlaceholderPreservesCategorySpecificTypes","PlaceholderDoesNotPersistRawMapByDefault","PlaceholderAvoidsIrreversibleSemanticDeletion","PlaceholderPreservesDocumentStructure"] as const;

const IMPL_ARTIFACT_SUFFIXES = ["ArtifactOutputsRedactedText","ArtifactOutputsPlaceholderMetadataWithoutRawValues","ArtifactOutputsCoverageMetricsWithoutRawValues","ArtifactOutputsUnresolvedHighRiskFlagsWithoutRawValues","ArtifactOutputsSafeStatus","ArtifactNeverOutputsRawPiiToUnsafeSinks"] as const;

const IMPL_FAILURE_SUFFIXES = ["FailureBlocksOrEscalatesLowConfidence","FailureBlocksOrEscalatesHighRiskUnsafeIdentifiers","FailureBlocksOrEscalatesMedicalImmigrationFinancialUnsafeIdentifiers","FailureBlocksUnknownDocumentIdentityIfUnsafe","FailureNeverSilentlyPassesUnredactedContent"] as const;

const IMPL_DOWNSTREAM_SUFFIXES = ["DownstreamEvidenceGatesUseRedactedOrIsolatedContentOnly","DownstreamClaimAuthorizationUsesRedactedAnchorsOnly","DownstreamDeadlineLogicStillRequiresDeliveryDateEvidence","DownstreamUserVisibleOutputDoesNotRevealRawPiiUnlessSeparatelyAuthorized","DownstreamStoragePersistenceRemainBlocked","DownstreamPaidDocumentRuntimeRemainsBlockedUntilRequiredContracts"] as const;

const IMPL_TEST_SUFFIXES = ["TestsSyntheticGermanBureaucracyLetters","TestsMultilingualUserTextAroundGermanDocuments","TestsMixedDocumentUserCommentary","TestsAllContractedIdentifierClasses","TestsFalsePositiveControls","TestsRedactionStability","TestsNoRawPiiInOutputAssertions","TestsNoRuntimeAuthorizationAssertions"] as const;

const IMPL_ARCH_SUFFIXES = ["RequiresPureUtilityOrIsolatedGovernanceHelperFirst","DoesNotPatchSmartTalkRouteNow","DoesNotPatchPhotoRouteNow","DoesNotAddPersistence","DoesNotAddModelCalls","DoesNotAddPromptBuilding","DoesNotAddEntitlementLogic","DoesNotAddPaymentLogic","DoesNotAddUserVisibleDocumentAnswerLogic","DoesNotEnablePublicRuntime"] as const;

const IMPL_SEQ_SUFFIXES = ["NextPhase8x6DIsRuntimeContract","Then8x6EIsDryRunImplementation","Then8x6FIsRuntimeExecutionContract","Then8x6GIsSurgicalUtilityPatch","Then8x6HIsPostPatchAudit","Then8x6IIsClosureDecision","DoesNotSkipToRuntimeImplementation","DoesNotCreateUtilityRuntimeFileNow","DoesNotModifyRuntimeRouteNow"] as const;

const PIPELINE_FLAGS = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"] as const;

const RUNTIME_AUTH_FLAGS = ["preModelPiiRedactionRuntimeAuthorizedNow","realDocumentInputAuthorizedNow","realDocumentProcessingAuthorizedNow","realUserDocumentUploadAuthorizedNow","ocrRuntimeAuthorizedNow","photoInputAuthorizedNow","fileInputAuthorizedNow","documentStorageAuthorizedNow","persistenceAuthorizedNow","publicRuntimeAuthorizedNow","userVisibleLegalDeadlineOutputAuthorizedNow","liveLLMRuntimeAuthorizedNow","connectedAiRuntimeAuthorizedNow","pilotRuntimeAuthorizedNow","productionRuntimeAuthorizedNow","paidDocumentModeRuntimeAuthorizedNow","paymentRuntimeAuthorizedNow","entitlementRuntimeAuthorizedNow","checkoutRuntimeAuthorizedNow"] as const;

const IMPL_PLAN_SIDE_EFFECTS = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"] as const;

const DETECTOR_COVERAGE = ["GermanSalutations","PostalAddresses","PhoneNumbers","EmailAddresses","DatesOfBirth","CustomerNumbers","InsuranceNumbers","HealthInsuranceIdentifiers","TaxIds","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumbers","Iban","BankAccountIdentifiers","LicensePlateNumbers","EmployerNamesInPersonalContext","Signatures","RecipientBlocks","SenderBlocks","AuthorityContactBlocks","MedicalHealthIdentifiers","ImmigrationResidenceIdentifiers","SocialBenefitIdentifiers","JobcenterBuergergeldIdentifiers","FamilienkasseKindergeldIdentifiers","AuslaenderbehoerdeIdentifiers","FinanzamtIdentifiers"] as const;

const TESTING_CASES = ["CleanNoPiiInput","SimplePersonName","GreetingWithPersonName","AddressBlock","PhoneNumber","EmailAddress","Dob","CustomerNumber","InsuranceNumber","HealthInsuranceIdentifier","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumber","Iban","LicensePlate","SenderBlock","RecipientBlock","AuthorityContactBlock","JobcenterBuergergeldIdentifier","FamilienkasseKindergeldIdentifier","AuslaenderbehoerdeIdentifier","FinanzamtIdentifier","MedicalIdentifier","ImmigrationIdentifier","MixedUserCommentaryAndDocumentText","FalsePositiveControl","RepeatedRawValueStablePlaceholder","DifferentValuesIncrementPlaceholders","UnsafeUnresolvedPiiBlocks","NoRawPiiInResultMetadata","NoRawPiiInUnsafeFields","NoRuntimeAuthorizationGranted"] as const;

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPreModelPiiRedactionRuntimeContractResult {
  readonly checkId: "8.6D";
  readonly allPassed: boolean;
  readonly preModelPiiRedactionImplementationPlanReadyForRuntimeContract: true;
  readonly controlledRealDocumentPreModelPiiRedactionRuntimeContractAccepted: boolean;
  readonly preModelPiiRedactionRuntimeContractOnly: true;
  readonly preModelPiiRedactionRuntimeContractDefined: true;
  readonly preModelPiiRedactionUtilityRuntimeStillNotImplemented: true;
  readonly preModelPiiRedactionRuntimeStillNotImplemented: true;
  readonly preModelPiiDetectorRuntimeStillNotImplemented: true;
  readonly preModelPiiMaskingRuntimeStillNotImplemented: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true;
  readonly preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true;
  readonly preModelPiiRedactionDoesNotAuthorizePromptBuild: true;
  readonly preModelPiiRedactionDoesNotAuthorizeModelCall: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true;
  readonly tamperCasesRejected: boolean;
  // Isolated utility contract
  readonly piiRuntimeContractRequiresPureLocalDeterministicHelper: true;
  readonly piiRuntimeContractRequiresNoRouteImports: true;
  readonly piiRuntimeContractRequiresNoOpenAiFetchEnvSdk: true;
  readonly piiRuntimeContractRequiresNoPersistence: true;
  readonly piiRuntimeContractRequiresNoStorage: true;
  readonly piiRuntimeContractRequiresNoDatabaseWrites: true;
  readonly piiRuntimeContractRequiresNoUserVisibleOutput: true;
  readonly piiRuntimeContractRequiresNoModelCalls: true;
  readonly piiRuntimeContractRequiresNoPromptBuilding: true;
  readonly piiRuntimeContractRequiresNoEvidenceGateExecution: true;
  readonly piiRuntimeContractRequiresNoClaimAuthorization: true;
  readonly piiRuntimeContractRequiresNoDeadlineCalculation: true;
  readonly piiRuntimeContractRequiresNoPaymentCheckoutEntitlementLogic: true;
  // Input contract
  readonly piiRuntimeContractInputAcceptsExplicitTextOnly: true;
  readonly piiRuntimeContractInputRequiresExplicitSourceLaneDescriptor: true;
  readonly piiRuntimeContractInputRejectsEmptyInput: true;
  readonly piiRuntimeContractInputRejectsAboveDocumentTextLimit: true;
  readonly piiRuntimeContractInputRejectsUnsupportedLanes: true;
  readonly piiRuntimeContractInputRequiresControlledDocumentLaneDescriptor: true;
  readonly piiRuntimeContractInputDoesNotAllowFreeQaDocumentBypass: true;
  readonly piiRuntimeContractInputDoesNotInferLaneFromClientFlags: true;
  readonly piiRuntimeContractInputDoesNotTrustClientEntitlement: true;
  // Output contract
  readonly piiRuntimeContractReturnsStructuredRedactionResult: true;
  readonly piiRuntimeContractOutputIncludesStatus: true;
  readonly piiRuntimeContractOutputIncludesRedactedText: true;
  readonly piiRuntimeContractOutputIncludesPlaceholderCounts: true;
  readonly piiRuntimeContractOutputIncludesPlaceholderCategories: true;
  readonly piiRuntimeContractOutputIncludesCoverageSummaryWithoutRawValues: true;
  readonly piiRuntimeContractOutputIncludesUnresolvedRiskFlagsWithoutRawValues: true;
  readonly piiRuntimeContractOutputIncludesBlockingReasonsWithoutRawValues: true;
  readonly piiRuntimeContractOutputIncludesDetectorSummaryWithoutRawValues: true;
  readonly piiRuntimeContractOutputIncludesSafeForModelBoolean: true;
  readonly piiRuntimeContractOutputIncludesSafeForEvidenceGatesBoolean: true;
  readonly piiRuntimeContractOutputIncludesSafeForUserVisibleOutputDefaultFalse: true;
  readonly piiRuntimeContractOutputDoesNotReturnRawMapByDefault: true;
  // Detector hit structure
  readonly piiRuntimeContractDetectorHitsStructured: true;
  readonly piiRuntimeContractDetectorHitsIncludeCategory: true;
  readonly piiRuntimeContractDetectorHitsIncludeStartOffset: true;
  readonly piiRuntimeContractDetectorHitsIncludeEndOffset: true;
  readonly piiRuntimeContractDetectorHitsIncludeConfidence: true;
  readonly piiRuntimeContractDetectorHitsIncludeReason: true;
  readonly piiRuntimeContractDetectorHitsIncludeReplacementPlaceholder: true;
  readonly piiRuntimeContractDetectorHitsDoNotExposeRawValuesInNormalMode: true;
  // Detector coverage (29)
  readonly piiRuntimeContractDetectorCoversGermanSalutations: true;
  readonly piiRuntimeContractDetectorCoversPostalAddresses: true;
  readonly piiRuntimeContractDetectorCoversPhoneNumbers: true;
  readonly piiRuntimeContractDetectorCoversEmailAddresses: true;
  readonly piiRuntimeContractDetectorCoversDatesOfBirth: true;
  readonly piiRuntimeContractDetectorCoversCustomerNumbers: true;
  readonly piiRuntimeContractDetectorCoversInsuranceNumbers: true;
  readonly piiRuntimeContractDetectorCoversHealthInsuranceIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversTaxIds: true;
  readonly piiRuntimeContractDetectorCoversSteuerId: true;
  readonly piiRuntimeContractDetectorCoversSteuernummer: true;
  readonly piiRuntimeContractDetectorCoversAktenzeichen: true;
  readonly piiRuntimeContractDetectorCoversVorgangsnummer: true;
  readonly piiRuntimeContractDetectorCoversCaseReferenceNumbers: true;
  readonly piiRuntimeContractDetectorCoversIban: true;
  readonly piiRuntimeContractDetectorCoversBankAccountIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversLicensePlateNumbers: true;
  readonly piiRuntimeContractDetectorCoversEmployerNamesInPersonalContext: true;
  readonly piiRuntimeContractDetectorCoversSignatures: true;
  readonly piiRuntimeContractDetectorCoversRecipientBlocks: true;
  readonly piiRuntimeContractDetectorCoversSenderBlocks: true;
  readonly piiRuntimeContractDetectorCoversAuthorityContactBlocks: true;
  readonly piiRuntimeContractDetectorCoversMedicalHealthIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversImmigrationResidenceIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversSocialBenefitIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversJobcenterBuergergeldIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversFamilienkasseKindergeldIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversAuslaenderbehoerdeIdentifiers: true;
  readonly piiRuntimeContractDetectorCoversFinanzamtIdentifiers: true;
  // Placeholder contract
  readonly piiRuntimeContractPlaceholdersDeterministicPerRequest: true;
  readonly piiRuntimeContractPlaceholdersCategorySpecific: true;
  readonly piiRuntimeContractPlaceholderNumberingStableWithinRequest: true;
  readonly piiRuntimeContractRepeatedRawValueGetsSamePlaceholder: true;
  readonly piiRuntimeContractDifferentRawValuesIncrementPlaceholders: true;
  readonly piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit: true;
  readonly piiRuntimeContractRawMapLocalEphemeralByDefault: true;
  // Safety contract
  readonly piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished: true;
  readonly piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable: true;
  readonly piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse: true;
  readonly piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk: true;
  readonly piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed: true;
  readonly piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers: true;
  readonly piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines: true;
  readonly piiRuntimeContractPreservesLegalSemanticStructureWherePossible: true;
  readonly piiRuntimeContractDoesNotInventMissingFacts: true;
  readonly piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient: true;
  // Testing contract (34)
  readonly piiRuntimeContractTestsCleanNoPiiInput: true;
  readonly piiRuntimeContractTestsSimplePersonName: true;
  readonly piiRuntimeContractTestsGreetingWithPersonName: true;
  readonly piiRuntimeContractTestsAddressBlock: true;
  readonly piiRuntimeContractTestsPhoneNumber: true;
  readonly piiRuntimeContractTestsEmailAddress: true;
  readonly piiRuntimeContractTestsDob: true;
  readonly piiRuntimeContractTestsCustomerNumber: true;
  readonly piiRuntimeContractTestsInsuranceNumber: true;
  readonly piiRuntimeContractTestsHealthInsuranceIdentifier: true;
  readonly piiRuntimeContractTestsSteuerId: true;
  readonly piiRuntimeContractTestsSteuernummer: true;
  readonly piiRuntimeContractTestsAktenzeichen: true;
  readonly piiRuntimeContractTestsVorgangsnummer: true;
  readonly piiRuntimeContractTestsCaseReferenceNumber: true;
  readonly piiRuntimeContractTestsIban: true;
  readonly piiRuntimeContractTestsLicensePlate: true;
  readonly piiRuntimeContractTestsSenderBlock: true;
  readonly piiRuntimeContractTestsRecipientBlock: true;
  readonly piiRuntimeContractTestsAuthorityContactBlock: true;
  readonly piiRuntimeContractTestsJobcenterBuergergeldIdentifier: true;
  readonly piiRuntimeContractTestsFamilienkasseKindergeldIdentifier: true;
  readonly piiRuntimeContractTestsAuslaenderbehoerdeIdentifier: true;
  readonly piiRuntimeContractTestsFinanzamtIdentifier: true;
  readonly piiRuntimeContractTestsMedicalIdentifier: true;
  readonly piiRuntimeContractTestsImmigrationIdentifier: true;
  readonly piiRuntimeContractTestsMixedUserCommentaryAndDocumentText: true;
  readonly piiRuntimeContractTestsFalsePositiveControl: true;
  readonly piiRuntimeContractTestsRepeatedRawValueStablePlaceholder: true;
  readonly piiRuntimeContractTestsDifferentValuesIncrementPlaceholders: true;
  readonly piiRuntimeContractTestsUnsafeUnresolvedPiiBlocks: true;
  readonly piiRuntimeContractTestsNoRawPiiInResultMetadata: true;
  readonly piiRuntimeContractTestsNoRawPiiInUnsafeFields: true;
  readonly piiRuntimeContractTestsNoRuntimeAuthorizationGranted: true;
  // Integration contract
  readonly piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst: true;
  readonly piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization: true;
  readonly piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt: true;
  readonly piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard: true;
  readonly piiRuntimeContractFutureRoutePatchPreservesPaidBoundary: true;
  readonly piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine: true;
  readonly piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput: true;
  readonly piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime: true;
  readonly piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation: true;
  // Runtime contract decision
  readonly piiRuntimeContractAcceptsImplementationPlan: true;
  readonly piiRuntimeContractMarksTd004RuntimeContractCompleted: true;
  readonly piiRuntimeContractKeepsRuntimeImplementationDisabled: true;
  readonly piiRuntimeContractKeepsProductionPiiRedactionMissing: true;
  readonly piiRuntimeContractReadyFor8x6EDryRunImplementation: true;
  // Actual flags
  readonly actualPiiRedactionRuntimeContractOnly: true;
  readonly actualPiiRedactionUtilityRuntimeImplemented: false;
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
  readonly actualUtilityRuntimeFileCreatedInThisPhase: false;
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
  readonly piiRuntimeContractConfirmsNoOpenAiCall: true;
  readonly piiRuntimeContractConfirmsNoFetchCall: true;
  readonly piiRuntimeContractConfirmsNoProcessEnvRead: true;
  readonly piiRuntimeContractConfirmsNoSdkUsage: true;
  readonly piiRuntimeContractConfirmsNo8x3AcRerun: true;
  readonly piiRuntimeContractConfirmsNoPaymentRuntimeCall: true;
  readonly piiRuntimeContractConfirmsNoStripeCall: true;
  readonly piiRuntimeContractConfirmsNoCheckoutCall: true;
  readonly piiRuntimeContractConfirmsNoEntitlementRuntimeCall: true;
  readonly piiRuntimeContractConfirmsNoServerEntitlementVerification: true;
  readonly piiRuntimeContractConfirmsNoOcrRuntimeCall: true;
  readonly piiRuntimeContractConfirmsNoStorageMutation: true;
  readonly piiRuntimeContractConfirmsNoDatabaseWrite: true;
  readonly piiRuntimeContractConfirmsNoAuditPersistence: true;
  readonly piiRuntimeContractConfirmsNoUserVisibleDocumentExplanation: true;
  readonly piiRuntimeContractConfirmsNoEvidenceEvaluation: true;
  readonly piiRuntimeContractConfirmsNoClaimAuthorization: true;
  readonly piiRuntimeContractConfirmsNoDeadlineCalculation: true;
  readonly piiRuntimeContractConfirmsNoLegalCertainty: true;
  readonly piiRuntimeContractConfirmsNoPromptBuild: true;
  readonly piiRuntimeContractConfirmsNoModelCall: true;
  readonly piiRuntimeContractConfirmsNoRunSmartTalkCall: true;
  readonly piiRuntimeContractConfirmsNoRouteHandlerCall: true;
  readonly piiRuntimeContractConfirmsNoRouteImport: true;
  readonly piiRuntimeContractConfirmsNoFilesystemRead: true;
  readonly piiRuntimeContractConfirmsNoPhotoRouteModification: true;
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
  readonly td004PreModelPiiRedactionRuntimeContracted: true;
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
  readonly readyFor8x6EPreModelPiiRedactionDryRunImplementation: true;
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

function validateRuntimeContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.6C prerequisite gate — core
  if (o["prereqCheckId"] !== "8.6C") reasons.push("prereq_check_id_must_be_8x6C");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["preModelPiiRedactionContractReadyForImplementationPlan"] !== true) reasons.push("prereq_contract_ready_for_impl_plan_false");
  if (o["controlledRealDocumentPreModelPiiRedactionImplementationPlanAccepted"] !== true) reasons.push("prereq_impl_plan_not_accepted");
  if (o["preModelPiiRedactionImplementationPlanOnly"] !== true) reasons.push("prereq_impl_plan_only_false");
  if (o["preModelPiiRedactionImplementationPlanDefined"] !== true) reasons.push("prereq_impl_plan_defined_false");
  if (o["preModelPiiRedactionRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_redaction_runtime_still_not_implemented_false");
  if (o["preModelPiiDetectorRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_detector_runtime_still_not_implemented_false");
  if (o["preModelPiiMaskingRuntimeStillNotImplemented"] !== true) reasons.push("prereq_pii_masking_runtime_still_not_implemented_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("prereq_pii_redaction_no_real_doc_input_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("prereq_pii_redaction_no_user_visible_output_false");
  if (o["preModelPiiRedactionDoesNotAuthorizePromptBuild"] !== true) reasons.push("prereq_pii_redaction_no_prompt_build_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeModelCall"] !== true) reasons.push("prereq_pii_redaction_no_model_call_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRunSmartTalk"] !== true) reasons.push("prereq_pii_redaction_no_run_smart_talk_false");
  if (o["prereqTamperCasesRejected"] !== true) reasons.push("prereq_tamper_cases_rejected_false");

  // 8.6C piiImplementationPlan* fields (all groups)
  for (const s of IMPL_LAYER_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_INPUT_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_DETECTION_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_PLACEHOLDER_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_ARTIFACT_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_FAILURE_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_DOWNSTREAM_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_TEST_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_ARCH_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }
  for (const s of IMPL_SEQ_SUFFIXES) {
    if (o[`piiImplementationPlan${s}`] !== true) reasons.push(`prereq_pii_impl_plan_${s}_false`);
  }

  // 8.6C actual flags
  if (o["actualPiiRedactionImplementationPlanOnly"] !== true) reasons.push("prereq_actual_pii_impl_plan_only_must_be_true");
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

  // 8.6C side-effect confirmations
  for (const se of IMPL_PLAN_SIDE_EFFECTS) {
    if (o[`piiImplementationPlanConfirms${se}`] !== true) reasons.push(`prereq_pii_impl_plan_confirms_${se}_false`);
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
  if (o["exactDeadlineCalculationAuthorized"] !== false) reasons.push("prereq_exact_deadline_authorized_must_be_false");
  if (o["deliveryDateInventionAuthorized"] !== false) reasons.push("prereq_delivery_date_invention_authorized_must_be_false");
  if (o["finalDateInventionAuthorized"] !== false) reasons.push("prereq_final_date_invention_authorized_must_be_false");
  if (o["legalCertaintyAuthorized"] !== false) reasons.push("prereq_legal_certainty_authorized_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false) reasons.push("prereq_coercive_legal_instruction_authorized_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true) reasons.push("prereq_delivery_date_required_for_exact_deadline_false");

  // TD flags from 8.6C result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true) reasons.push("prereq_td001_false");
  if (o["td005PaidDocumentModeBoundaryContainmentClosed"] !== true) reasons.push("prereq_td005_boundary_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosed"] !== true) reasons.push("prereq_td005_client_flag_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] !== true) reasons.push("prereq_td005_deferred_false");
  if (o["td004PreModelPiiRedactionPlanned"] !== true) reasons.push("prereq_td004_planned_must_be_true");
  if (o["td004PreModelPiiRedactionContracted"] !== true) reasons.push("prereq_td004_contracted_must_be_true");
  if (o["td004PreModelPiiRedactionImplementationPlanned"] !== true) reasons.push("prereq_td004_impl_planned_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeContract"] !== true) reasons.push("prereq_td004_still_requires_runtime_contract_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] !== true) reasons.push("prereq_td004_still_requires_runtime_impl_must_be_true");
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

  // 8.6C forward readiness gate
  if (o["readyFor8x6DPreModelPiiRedactionRuntimeContract"] !== true) reasons.push("prereq_ready_for_8x6d_runtime_contract_false");
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

  // 8.6D core assertion flags
  if (o["preModelPiiRedactionImplementationPlanReadyForRuntimeContract"] !== true) reasons.push("impl_plan_ready_for_runtime_contract_false");
  if (o["preModelPiiRedactionRuntimeContractOnly"] !== true) reasons.push("pii_runtime_contract_only_false");
  if (o["preModelPiiRedactionRuntimeContractDefined"] !== true) reasons.push("pii_runtime_contract_defined_false");
  if (o["preModelPiiRedactionUtilityRuntimeStillNotImplemented"] !== true) reasons.push("pii_utility_runtime_still_not_implemented_false");

  // Isolated utility contract (13)
  if (o["piiRuntimeContractRequiresPureLocalDeterministicHelper"] !== true) reasons.push("pii_runtime_contract_pure_local_deterministic_helper_false");
  if (o["piiRuntimeContractRequiresNoRouteImports"] !== true) reasons.push("pii_runtime_contract_no_route_imports_false");
  if (o["piiRuntimeContractRequiresNoOpenAiFetchEnvSdk"] !== true) reasons.push("pii_runtime_contract_no_openai_fetch_env_sdk_false");
  if (o["piiRuntimeContractRequiresNoPersistence"] !== true) reasons.push("pii_runtime_contract_no_persistence_false");
  if (o["piiRuntimeContractRequiresNoStorage"] !== true) reasons.push("pii_runtime_contract_no_storage_false");
  if (o["piiRuntimeContractRequiresNoDatabaseWrites"] !== true) reasons.push("pii_runtime_contract_no_database_writes_false");
  if (o["piiRuntimeContractRequiresNoUserVisibleOutput"] !== true) reasons.push("pii_runtime_contract_no_user_visible_output_false");
  if (o["piiRuntimeContractRequiresNoModelCalls"] !== true) reasons.push("pii_runtime_contract_no_model_calls_false");
  if (o["piiRuntimeContractRequiresNoPromptBuilding"] !== true) reasons.push("pii_runtime_contract_no_prompt_building_false");
  if (o["piiRuntimeContractRequiresNoEvidenceGateExecution"] !== true) reasons.push("pii_runtime_contract_no_evidence_gate_execution_false");
  if (o["piiRuntimeContractRequiresNoClaimAuthorization"] !== true) reasons.push("pii_runtime_contract_no_claim_authorization_false");
  if (o["piiRuntimeContractRequiresNoDeadlineCalculation"] !== true) reasons.push("pii_runtime_contract_no_deadline_calculation_false");
  if (o["piiRuntimeContractRequiresNoPaymentCheckoutEntitlementLogic"] !== true) reasons.push("pii_runtime_contract_no_payment_checkout_entitlement_false");

  // Input contract (9)
  if (o["piiRuntimeContractInputAcceptsExplicitTextOnly"] !== true) reasons.push("pii_runtime_contract_input_accepts_explicit_text_only_false");
  if (o["piiRuntimeContractInputRequiresExplicitSourceLaneDescriptor"] !== true) reasons.push("pii_runtime_contract_input_explicit_lane_false");
  if (o["piiRuntimeContractInputRejectsEmptyInput"] !== true) reasons.push("pii_runtime_contract_input_rejects_empty_false");
  if (o["piiRuntimeContractInputRejectsAboveDocumentTextLimit"] !== true) reasons.push("pii_runtime_contract_input_rejects_above_limit_false");
  if (o["piiRuntimeContractInputRejectsUnsupportedLanes"] !== true) reasons.push("pii_runtime_contract_input_rejects_unsupported_lanes_false");
  if (o["piiRuntimeContractInputRequiresControlledDocumentLaneDescriptor"] !== true) reasons.push("pii_runtime_contract_input_controlled_lane_false");
  if (o["piiRuntimeContractInputDoesNotAllowFreeQaDocumentBypass"] !== true) reasons.push("pii_runtime_contract_input_no_free_qa_bypass_false");
  if (o["piiRuntimeContractInputDoesNotInferLaneFromClientFlags"] !== true) reasons.push("pii_runtime_contract_input_no_infer_lane_from_client_false");
  if (o["piiRuntimeContractInputDoesNotTrustClientEntitlement"] !== true) reasons.push("pii_runtime_contract_input_no_trust_client_entitlement_false");

  // Output contract (13)
  if (o["piiRuntimeContractReturnsStructuredRedactionResult"] !== true) reasons.push("pii_runtime_contract_structured_result_false");
  if (o["piiRuntimeContractOutputIncludesStatus"] !== true) reasons.push("pii_runtime_contract_output_status_false");
  if (o["piiRuntimeContractOutputIncludesRedactedText"] !== true) reasons.push("pii_runtime_contract_output_redacted_text_false");
  if (o["piiRuntimeContractOutputIncludesPlaceholderCounts"] !== true) reasons.push("pii_runtime_contract_output_placeholder_counts_false");
  if (o["piiRuntimeContractOutputIncludesPlaceholderCategories"] !== true) reasons.push("pii_runtime_contract_output_placeholder_categories_false");
  if (o["piiRuntimeContractOutputIncludesCoverageSummaryWithoutRawValues"] !== true) reasons.push("pii_runtime_contract_output_coverage_summary_false");
  if (o["piiRuntimeContractOutputIncludesUnresolvedRiskFlagsWithoutRawValues"] !== true) reasons.push("pii_runtime_contract_output_unresolved_risk_flags_false");
  if (o["piiRuntimeContractOutputIncludesBlockingReasonsWithoutRawValues"] !== true) reasons.push("pii_runtime_contract_output_blocking_reasons_false");
  if (o["piiRuntimeContractOutputIncludesDetectorSummaryWithoutRawValues"] !== true) reasons.push("pii_runtime_contract_output_detector_summary_false");
  if (o["piiRuntimeContractOutputIncludesSafeForModelBoolean"] !== true) reasons.push("pii_runtime_contract_output_safe_for_model_false");
  if (o["piiRuntimeContractOutputIncludesSafeForEvidenceGatesBoolean"] !== true) reasons.push("pii_runtime_contract_output_safe_for_evidence_gates_false");
  if (o["piiRuntimeContractOutputIncludesSafeForUserVisibleOutputDefaultFalse"] !== true) reasons.push("pii_runtime_contract_output_safe_for_user_visible_default_false_false");
  if (o["piiRuntimeContractOutputDoesNotReturnRawMapByDefault"] !== true) reasons.push("pii_runtime_contract_output_no_raw_map_by_default_false");

  // Detector hit structure (8)
  if (o["piiRuntimeContractDetectorHitsStructured"] !== true) reasons.push("pii_runtime_contract_detector_hits_structured_false");
  if (o["piiRuntimeContractDetectorHitsIncludeCategory"] !== true) reasons.push("pii_runtime_contract_detector_hits_category_false");
  if (o["piiRuntimeContractDetectorHitsIncludeStartOffset"] !== true) reasons.push("pii_runtime_contract_detector_hits_start_offset_false");
  if (o["piiRuntimeContractDetectorHitsIncludeEndOffset"] !== true) reasons.push("pii_runtime_contract_detector_hits_end_offset_false");
  if (o["piiRuntimeContractDetectorHitsIncludeConfidence"] !== true) reasons.push("pii_runtime_contract_detector_hits_confidence_false");
  if (o["piiRuntimeContractDetectorHitsIncludeReason"] !== true) reasons.push("pii_runtime_contract_detector_hits_reason_false");
  if (o["piiRuntimeContractDetectorHitsIncludeReplacementPlaceholder"] !== true) reasons.push("pii_runtime_contract_detector_hits_replacement_placeholder_false");
  if (o["piiRuntimeContractDetectorHitsDoNotExposeRawValuesInNormalMode"] !== true) reasons.push("pii_runtime_contract_detector_hits_no_raw_values_false");

  // Detector coverage (29)
  for (const dc of DETECTOR_COVERAGE) {
    if (o[`piiRuntimeContractDetectorCovers${dc}`] !== true) reasons.push(`pii_runtime_contract_detector_covers_${dc}_false`);
  }

  // Placeholder contract (7)
  if (o["piiRuntimeContractPlaceholdersDeterministicPerRequest"] !== true) reasons.push("pii_runtime_contract_placeholders_deterministic_false");
  if (o["piiRuntimeContractPlaceholdersCategorySpecific"] !== true) reasons.push("pii_runtime_contract_placeholders_category_specific_false");
  if (o["piiRuntimeContractPlaceholderNumberingStableWithinRequest"] !== true) reasons.push("pii_runtime_contract_placeholder_numbering_stable_false");
  if (o["piiRuntimeContractRepeatedRawValueGetsSamePlaceholder"] !== true) reasons.push("pii_runtime_contract_repeated_raw_value_same_placeholder_false");
  if (o["piiRuntimeContractDifferentRawValuesIncrementPlaceholders"] !== true) reasons.push("pii_runtime_contract_different_raw_values_increment_false");
  if (o["piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit"] !== true) reasons.push("pii_runtime_contract_placeholder_categories_safe_false");
  if (o["piiRuntimeContractRawMapLocalEphemeralByDefault"] !== true) reasons.push("pii_runtime_contract_raw_map_local_ephemeral_false");

  // Safety contract (10)
  if (o["piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished"] !== true) reasons.push("pii_runtime_contract_blocks_if_safe_redaction_cannot_false");
  if (o["piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable"] !== true) reasons.push("pii_runtime_contract_needs_review_if_ambiguous_false");
  if (o["piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse"] !== true) reasons.push("pii_runtime_contract_safe_for_user_visible_defaults_false_false");
  if (o["piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk"] !== true) reasons.push("pii_runtime_contract_safe_for_model_defaults_false_false");
  if (o["piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed"] !== true) reasons.push("pii_runtime_contract_safe_for_evidence_gates_defaults_false_false");
  if (o["piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers"] !== true) reasons.push("pii_runtime_contract_no_silent_pass_high_risk_false");
  if (o["piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines"] !== true) reasons.push("pii_runtime_contract_no_alter_dates_false");
  if (o["piiRuntimeContractPreservesLegalSemanticStructureWherePossible"] !== true) reasons.push("pii_runtime_contract_preserves_legal_semantic_structure_false");
  if (o["piiRuntimeContractDoesNotInventMissingFacts"] !== true) reasons.push("pii_runtime_contract_no_invent_facts_false");
  if (o["piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient"] !== true) reasons.push("pii_runtime_contract_no_classify_legally_sufficient_false");

  // Testing contract (34)
  for (const tc of TESTING_CASES) {
    if (o[`piiRuntimeContractTests${tc}`] !== true) reasons.push(`pii_runtime_contract_tests_${tc}_false`);
  }

  // Integration contract (9)
  if (o["piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst"] !== true) reasons.push("pii_runtime_contract_utility_isolated_helper_first_false");
  if (o["piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization"] !== true) reasons.push("pii_runtime_contract_route_patch_separate_auth_false");
  if (o["piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt"] !== true) reasons.push("pii_runtime_contract_route_patch_after_validation_before_prompt_false");
  if (o["piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard"] !== true) reasons.push("pii_runtime_contract_route_patch_preserves_free_qa_guard_false");
  if (o["piiRuntimeContractFutureRoutePatchPreservesPaidBoundary"] !== true) reasons.push("pii_runtime_contract_route_patch_preserves_paid_boundary_false");
  if (o["piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine"] !== true) reasons.push("pii_runtime_contract_route_patch_preserves_photo_quarantine_false");
  if (o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput"] !== true) reasons.push("pii_runtime_contract_route_patch_no_user_visible_output_false");
  if (o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime"] !== true) reasons.push("pii_runtime_contract_route_patch_no_public_runtime_false");
  if (o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation"] !== true) reasons.push("pii_runtime_contract_route_patch_no_exact_deadline_false");

  // Runtime contract decision (5)
  if (o["piiRuntimeContractAcceptsImplementationPlan"] !== true) reasons.push("pii_runtime_contract_accepts_impl_plan_false");
  if (o["piiRuntimeContractMarksTd004RuntimeContractCompleted"] !== true) reasons.push("pii_runtime_contract_marks_td004_runtime_contract_completed_false");
  if (o["piiRuntimeContractKeepsRuntimeImplementationDisabled"] !== true) reasons.push("pii_runtime_contract_keeps_runtime_disabled_false");
  if (o["piiRuntimeContractKeepsProductionPiiRedactionMissing"] !== true) reasons.push("pii_runtime_contract_keeps_production_missing_false");
  if (o["piiRuntimeContractReadyFor8x6EDryRunImplementation"] !== true) reasons.push("pii_runtime_contract_ready_for_8x6e_false");

  // 8.6D new actual flags
  if (o["actualPiiRedactionRuntimeContractOnly"] !== true) reasons.push("actual_pii_runtime_contract_only_must_be_true");
  if (o["actualPiiRedactionUtilityRuntimeImplemented"] !== false) reasons.push("actual_pii_utility_runtime_implemented_must_be_false");
  if (o["actualUtilityRuntimeFileCreatedInThisPhase"] !== false) reasons.push("actual_utility_runtime_file_created_must_be_false");

  // 8.6D side-effect confirmations (26)
  for (const se of IMPL_PLAN_SIDE_EFFECTS) {
    if (o[`piiRuntimeContractConfirms${se}`] !== true) reasons.push(`pii_runtime_contract_confirms_${se}_false`);
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

  // 8.6D TD result flags
  if (o["td004PreModelPiiRedactionRuntimeContracted"] !== true) reasons.push("td004_runtime_contracted_false");
  if (o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] !== true) reasons.push("td004_still_requires_runtime_impl_false");
  if (o["td004PreModelPiiRedactionStillMissingInProduction"] !== true) reasons.push("td004_still_missing_in_production_false");

  // 8.6D forward readiness
  if (o["readyFor8x6EPreModelPiiRedactionDryRunImplementation"] !== true) reasons.push("ready_for_8x6e_dry_run_implementation_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.6D input builder ──────────────────────────────────────────────

function buildCanonical8x6DInput(): Record<string, unknown> {
  const ip = runControlledRealDocumentPreModelPiiRedactionImplementationPlan();
  const o: Record<string, unknown> = {
    // 8.6C prereq gate — core
    prereqCheckId: ip.checkId,
    prereqAllPassed: ip.allPassed,
    preModelPiiRedactionContractReadyForImplementationPlan: ip.preModelPiiRedactionContractReadyForImplementationPlan,
    controlledRealDocumentPreModelPiiRedactionImplementationPlanAccepted: ip.controlledRealDocumentPreModelPiiRedactionImplementationPlanAccepted,
    preModelPiiRedactionImplementationPlanOnly: ip.preModelPiiRedactionImplementationPlanOnly,
    preModelPiiRedactionImplementationPlanDefined: ip.preModelPiiRedactionImplementationPlanDefined,
    preModelPiiRedactionRuntimeStillNotImplemented: ip.preModelPiiRedactionRuntimeStillNotImplemented,
    preModelPiiDetectorRuntimeStillNotImplemented: ip.preModelPiiDetectorRuntimeStillNotImplemented,
    preModelPiiMaskingRuntimeStillNotImplemented: ip.preModelPiiMaskingRuntimeStillNotImplemented,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: ip.preModelPiiRedactionDoesNotAuthorizeRealDocumentInput,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: ip.preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: ip.preModelPiiRedactionDoesNotAuthorizePromptBuild,
    preModelPiiRedactionDoesNotAuthorizeModelCall: ip.preModelPiiRedactionDoesNotAuthorizeModelCall,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: ip.preModelPiiRedactionDoesNotAuthorizeRunSmartTalk,
    prereqTamperCasesRejected: ip.tamperCasesRejected,
  };

  // 8.6C piiImplementationPlan* fields (all groups)
  for (const s of IMPL_LAYER_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_INPUT_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_DETECTION_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_PLACEHOLDER_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_ARTIFACT_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_FAILURE_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_DOWNSTREAM_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_TEST_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_ARCH_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];
  for (const s of IMPL_SEQ_SUFFIXES) o[`piiImplementationPlan${s}`] = ip[`piiImplementationPlan${s}` as keyof typeof ip];

  // 8.6C actual flags
  o["actualPiiRedactionImplementationPlanOnly"] = ip.actualPiiRedactionImplementationPlanOnly;
  o["actualPiiRedactionImplemented"] = ip.actualPiiRedactionImplemented;
  o["actualPiiDetectorRuntimeImplemented"] = ip.actualPiiDetectorRuntimeImplemented;
  o["actualPiiMaskingRuntimeImplemented"] = ip.actualPiiMaskingRuntimeImplemented;
  o["actualPiiTextRedacted"] = ip.actualPiiTextRedacted;
  o["actualRawPiiProcessed"] = ip.actualRawPiiProcessed;
  o["actualRawPiiPersisted"] = ip.actualRawPiiPersisted;
  o["actualRawPiiLogged"] = ip.actualRawPiiLogged;
  o["actualPromptBuildPerformed"] = ip.actualPromptBuildPerformed;
  o["actualModelCallPerformed"] = ip.actualModelCallPerformed;
  o["actualRunSmartTalkCalled"] = ip.actualRunSmartTalkCalled;
  o["actualEvidenceGateRuntimeWiringPerformed"] = ip.actualEvidenceGateRuntimeWiringPerformed;
  o["actualClaimAuthorizationPerformed"] = ip.actualClaimAuthorizationPerformed;
  o["actualDeadlineCalculationPerformed"] = ip.actualDeadlineCalculationPerformed;
  o["actualLiveRouteMutationPerformedInThisPhase"] = ip.actualLiveRouteMutationPerformedInThisPhase;
  o["actualSmartTalkRouteModifiedInThisPhase"] = ip.actualSmartTalkRouteModifiedInThisPhase;
  o["actualPhotoRouteModifiedInThisPhase"] = ip.actualPhotoRouteModifiedInThisPhase;
  o["actualPaidDocumentModeImplemented"] = ip.actualPaidDocumentModeImplemented;
  o["actualPaymentRuntimeImplemented"] = ip.actualPaymentRuntimeImplemented;
  o["actualCheckoutImplemented"] = ip.actualCheckoutImplemented;
  o["actualEntitlementRuntimeImplemented"] = ip.actualEntitlementRuntimeImplemented;
  o["actualServerEntitlementVerificationImplemented"] = ip.actualServerEntitlementVerificationImplemented;
  o["actualRealDocumentInputPerformed"] = ip.actualRealDocumentInputPerformed;
  o["actualRealDocumentProcessingPerformed"] = ip.actualRealDocumentProcessingPerformed;
  o["actualOcrPerformed"] = ip.actualOcrPerformed;
  o["actualPhotoInputProcessed"] = ip.actualPhotoInputProcessed;
  o["actualFileInputProcessed"] = ip.actualFileInputProcessed;
  o["actualDocumentStoragePerformed"] = ip.actualDocumentStoragePerformed;
  o["actualDatabasePersistencePerformed"] = ip.actualDatabasePersistencePerformed;
  o["actualAuditPersistencePerformed"] = ip.actualAuditPersistencePerformed;
  o["actualUserVisibleOutputPerformed"] = ip.actualUserVisibleOutputPerformed;
  o["actualPublicRuntimeEnabled"] = ip.actualPublicRuntimeEnabled;

  // 8.6C side-effect confirmations
  for (const se of IMPL_PLAN_SIDE_EFFECTS) o[`piiImplementationPlanConfirms${se}`] = ip[`piiImplementationPlanConfirms${se}` as keyof typeof ip];

  // Pipeline flags
  for (const f of PIPELINE_FLAGS) o[f] = ip[f as keyof typeof ip];

  // Runtime auth flags
  for (const f of RUNTIME_AUTH_FLAGS) o[f] = ip[f as keyof typeof ip];

  // Auth grants + legal safety + shared fields
  o["runtimeAuthorizationGranted"] = ip.runtimeAuthorizationGranted;
  o["pilotAuthorizationGranted"] = ip.pilotAuthorizationGranted;
  o["productionAuthorizationGranted"] = ip.productionAuthorizationGranted;
  o["finalAuthorizationGranted"] = ip.finalAuthorizationGranted;
  o["goLiveAuthorizationGranted"] = ip.goLiveAuthorizationGranted;
  o["exactDeadlineCalculationAuthorized"] = ip.exactDeadlineCalculationAuthorized;
  o["deliveryDateInventionAuthorized"] = ip.deliveryDateInventionAuthorized;
  o["finalDateInventionAuthorized"] = ip.finalDateInventionAuthorized;
  o["legalCertaintyAuthorized"] = ip.legalCertaintyAuthorized;
  o["coerciveLegalInstructionAuthorized"] = ip.coerciveLegalInstructionAuthorized;
  o["deliveryDateRequiredForExactDeadline"] = ip.deliveryDateRequiredForExactDeadline;

  // TD flags from 8.6C result
  o["td001DocumentBypassGuardContainmentClosed"] = ip.td001DocumentBypassGuardContainmentClosed;
  o["td005PaidDocumentModeBoundaryContainmentClosed"] = ip.td005PaidDocumentModeBoundaryContainmentClosed;
  o["td005PaidDocumentModeClientFlagBypassClosed"] = ip.td005PaidDocumentModeClientFlagBypassClosed;
  o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] = ip.td005PaidDocumentModeActualRuntimeImplementationDeferred;
  o["td004PreModelPiiRedactionPlanned"] = ip.td004PreModelPiiRedactionPlanned;
  o["td004PreModelPiiRedactionContracted"] = ip.td004PreModelPiiRedactionContracted;
  o["td004PreModelPiiRedactionImplementationPlanned"] = ip.td004PreModelPiiRedactionImplementationPlanned;
  o["td004PreModelPiiRedactionStillRequiresRuntimeContract"] = ip.td004PreModelPiiRedactionStillRequiresRuntimeContract;
  o["td004PreModelPiiRedactionStillRequiresRuntimeImplementation"] = ip.td004PreModelPiiRedactionStillRequiresRuntimeImplementation;
  o["td004PreModelPiiRedactionStillMissingInProduction"] = ip.td004PreModelPiiRedactionStillMissingInProduction;
  o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] = ip.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk;
  o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] = ip.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained;
  o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] = ip.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign;
  o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] = ip.td006EvidenceGateTodoAndOrSemanticsUnresolved;
  o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] = ip.td007TrapClaimDispositionNamespaceHardeningUnresolved;
  o["td008InMemoryRateLimiterServerlessUnsafe"] = ip.td008InMemoryRateLimiterServerlessUnsafe;
  o["td010GetUserStateDocumentTypeTodoOpen"] = ip.td010GetUserStateDocumentTypeTodoOpen;
  o["td009TmpDebugRunnerDebtClosed"] = ip.td009TmpDebugRunnerDebtClosed;
  o["tmpFilesPresentInWorkingTree"] = ip.tmpFilesPresentInWorkingTree;

  // 8.6C forward readiness
  o["readyFor8x6DPreModelPiiRedactionRuntimeContract"] = ip.readyFor8x6DPreModelPiiRedactionRuntimeContract;
  o["readyForEvidenceGatesProductionWiringPhase"] = ip.readyForEvidenceGatesProductionWiringPhase;
  o["readyForServerEntitlementVerificationPhase"] = ip.readyForServerEntitlementVerificationPhase;
  o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] = ip.readyForPaidDocumentModeActualRuntimeImplementationPhase;
  o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] = ip.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase;
  o["readyForControlledRealDocumentPilotAuthorizationPhase"] = ip.readyForControlledRealDocumentPilotAuthorizationPhase;
  o["readyForControlledRealDocumentProductionAuthorizationPhase"] = ip.readyForControlledRealDocumentProductionAuthorizationPhase;
  o["readyForRealDocumentInput"] = ip.readyForRealDocumentInput;
  o["readyForUserVisibleOutput"] = ip.readyForUserVisibleOutput;
  o["publicRuntimeEnabled"] = ip.publicRuntimeEnabled;
  o["persistenceUsed"] = ip.persistenceUsed;
  o["neverUserVisible"] = ip.neverUserVisible;

  // 8.6D core assertion flags
  o["preModelPiiRedactionImplementationPlanReadyForRuntimeContract"] = true;
  o["preModelPiiRedactionRuntimeContractOnly"] = true;
  o["preModelPiiRedactionRuntimeContractDefined"] = true;
  o["preModelPiiRedactionUtilityRuntimeStillNotImplemented"] = true;

  // Isolated utility contract
  o["piiRuntimeContractRequiresPureLocalDeterministicHelper"] = true;
  o["piiRuntimeContractRequiresNoRouteImports"] = true;
  o["piiRuntimeContractRequiresNoOpenAiFetchEnvSdk"] = true;
  o["piiRuntimeContractRequiresNoPersistence"] = true;
  o["piiRuntimeContractRequiresNoStorage"] = true;
  o["piiRuntimeContractRequiresNoDatabaseWrites"] = true;
  o["piiRuntimeContractRequiresNoUserVisibleOutput"] = true;
  o["piiRuntimeContractRequiresNoModelCalls"] = true;
  o["piiRuntimeContractRequiresNoPromptBuilding"] = true;
  o["piiRuntimeContractRequiresNoEvidenceGateExecution"] = true;
  o["piiRuntimeContractRequiresNoClaimAuthorization"] = true;
  o["piiRuntimeContractRequiresNoDeadlineCalculation"] = true;
  o["piiRuntimeContractRequiresNoPaymentCheckoutEntitlementLogic"] = true;

  // Input contract
  o["piiRuntimeContractInputAcceptsExplicitTextOnly"] = true;
  o["piiRuntimeContractInputRequiresExplicitSourceLaneDescriptor"] = true;
  o["piiRuntimeContractInputRejectsEmptyInput"] = true;
  o["piiRuntimeContractInputRejectsAboveDocumentTextLimit"] = true;
  o["piiRuntimeContractInputRejectsUnsupportedLanes"] = true;
  o["piiRuntimeContractInputRequiresControlledDocumentLaneDescriptor"] = true;
  o["piiRuntimeContractInputDoesNotAllowFreeQaDocumentBypass"] = true;
  o["piiRuntimeContractInputDoesNotInferLaneFromClientFlags"] = true;
  o["piiRuntimeContractInputDoesNotTrustClientEntitlement"] = true;

  // Output contract
  o["piiRuntimeContractReturnsStructuredRedactionResult"] = true;
  o["piiRuntimeContractOutputIncludesStatus"] = true;
  o["piiRuntimeContractOutputIncludesRedactedText"] = true;
  o["piiRuntimeContractOutputIncludesPlaceholderCounts"] = true;
  o["piiRuntimeContractOutputIncludesPlaceholderCategories"] = true;
  o["piiRuntimeContractOutputIncludesCoverageSummaryWithoutRawValues"] = true;
  o["piiRuntimeContractOutputIncludesUnresolvedRiskFlagsWithoutRawValues"] = true;
  o["piiRuntimeContractOutputIncludesBlockingReasonsWithoutRawValues"] = true;
  o["piiRuntimeContractOutputIncludesDetectorSummaryWithoutRawValues"] = true;
  o["piiRuntimeContractOutputIncludesSafeForModelBoolean"] = true;
  o["piiRuntimeContractOutputIncludesSafeForEvidenceGatesBoolean"] = true;
  o["piiRuntimeContractOutputIncludesSafeForUserVisibleOutputDefaultFalse"] = true;
  o["piiRuntimeContractOutputDoesNotReturnRawMapByDefault"] = true;

  // Detector hit structure
  o["piiRuntimeContractDetectorHitsStructured"] = true;
  o["piiRuntimeContractDetectorHitsIncludeCategory"] = true;
  o["piiRuntimeContractDetectorHitsIncludeStartOffset"] = true;
  o["piiRuntimeContractDetectorHitsIncludeEndOffset"] = true;
  o["piiRuntimeContractDetectorHitsIncludeConfidence"] = true;
  o["piiRuntimeContractDetectorHitsIncludeReason"] = true;
  o["piiRuntimeContractDetectorHitsIncludeReplacementPlaceholder"] = true;
  o["piiRuntimeContractDetectorHitsDoNotExposeRawValuesInNormalMode"] = true;

  // Detector coverage (29)
  for (const dc of DETECTOR_COVERAGE) o[`piiRuntimeContractDetectorCovers${dc}`] = true;

  // Placeholder contract
  o["piiRuntimeContractPlaceholdersDeterministicPerRequest"] = true;
  o["piiRuntimeContractPlaceholdersCategorySpecific"] = true;
  o["piiRuntimeContractPlaceholderNumberingStableWithinRequest"] = true;
  o["piiRuntimeContractRepeatedRawValueGetsSamePlaceholder"] = true;
  o["piiRuntimeContractDifferentRawValuesIncrementPlaceholders"] = true;
  o["piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit"] = true;
  o["piiRuntimeContractRawMapLocalEphemeralByDefault"] = true;

  // Safety contract
  o["piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished"] = true;
  o["piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable"] = true;
  o["piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse"] = true;
  o["piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk"] = true;
  o["piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed"] = true;
  o["piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers"] = true;
  o["piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines"] = true;
  o["piiRuntimeContractPreservesLegalSemanticStructureWherePossible"] = true;
  o["piiRuntimeContractDoesNotInventMissingFacts"] = true;
  o["piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient"] = true;

  // Testing contract (34)
  for (const tc of TESTING_CASES) o[`piiRuntimeContractTests${tc}`] = true;

  // Integration contract
  o["piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst"] = true;
  o["piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization"] = true;
  o["piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt"] = true;
  o["piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard"] = true;
  o["piiRuntimeContractFutureRoutePatchPreservesPaidBoundary"] = true;
  o["piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine"] = true;
  o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput"] = true;
  o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime"] = true;
  o["piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation"] = true;

  // Runtime contract decision
  o["piiRuntimeContractAcceptsImplementationPlan"] = true;
  o["piiRuntimeContractMarksTd004RuntimeContractCompleted"] = true;
  o["piiRuntimeContractKeepsRuntimeImplementationDisabled"] = true;
  o["piiRuntimeContractKeepsProductionPiiRedactionMissing"] = true;
  o["piiRuntimeContractReadyFor8x6EDryRunImplementation"] = true;

  // 8.6D new actual flags
  o["actualPiiRedactionRuntimeContractOnly"] = true;
  o["actualPiiRedactionUtilityRuntimeImplemented"] = false;
  o["actualUtilityRuntimeFileCreatedInThisPhase"] = false;

  // 8.6D side-effect confirmations (26)
  for (const se of IMPL_PLAN_SIDE_EFFECTS) o[`piiRuntimeContractConfirms${se}`] = true;

  // 8.6D TD result flags
  o["td004PreModelPiiRedactionRuntimeContracted"] = true;

  // 8.6D forward readiness
  o["readyFor8x6EPreModelPiiRedactionDryRunImplementation"] = true;

  return o;
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x6DInput();
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Record<string, unknown>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateRuntimeContractInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.6C prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.6D" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("prereq_contract_ready_for_impl_plan_false", { preModelPiiRedactionContractReadyForImplementationPlan: false });
  expect_rejected("prereq_impl_plan_not_accepted", { controlledRealDocumentPreModelPiiRedactionImplementationPlanAccepted: false });
  expect_rejected("prereq_impl_plan_only_false", { preModelPiiRedactionImplementationPlanOnly: false });
  expect_rejected("prereq_impl_plan_defined_false", { preModelPiiRedactionImplementationPlanDefined: false });
  expect_rejected("prereq_pii_redaction_runtime_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_detector_runtime_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_masking_runtime_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });
  expect_rejected("prereq_no_real_doc_input_false", { preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_no_user_visible_output_false", { preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("prereq_no_prompt_build_false", { preModelPiiRedactionDoesNotAuthorizePromptBuild: false });
  expect_rejected("prereq_no_model_call_false", { preModelPiiRedactionDoesNotAuthorizeModelCall: false });
  expect_rejected("prereq_no_run_smart_talk_false", { preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.6C piiImplementationPlan* groups
  for (const s of IMPL_LAYER_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_INPUT_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_DETECTION_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_PLACEHOLDER_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_ARTIFACT_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_FAILURE_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_DOWNSTREAM_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_TEST_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_ARCH_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });
  for (const s of IMPL_SEQ_SUFFIXES) expect_rejected(`prereq_pii_impl_plan_${s}_false`, { [`piiImplementationPlan${s}`]: false });

  // 8.6C actual flags
  expect_rejected("prereq_actual_pii_impl_plan_only_false", { actualPiiRedactionImplementationPlanOnly: false });
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

  // 8.6C side-effect confirmations (26)
  for (const se of IMPL_PLAN_SIDE_EFFECTS) {
    expect_rejected(`prereq_pii_impl_plan_confirms_${se}_false`, { [`piiImplementationPlanConfirms${se}`]: false });
  }

  // Pipeline flags
  for (const f of PIPELINE_FLAGS) expect_rejected(`prereq_${f}_true`, { [f]: true });

  // Runtime auth flags
  for (const f of RUNTIME_AUTH_FLAGS) expect_rejected(`prereq_${f}_true`, { [f]: true });

  // Auth grants
  expect_rejected("prereq_runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("prereq_pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("prereq_production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("prereq_final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("prereq_go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety
  expect_rejected("prereq_exact_deadline_authorized_true", { exactDeadlineCalculationAuthorized: true });
  expect_rejected("prereq_delivery_date_invention_authorized_true", { deliveryDateInventionAuthorized: true });
  expect_rejected("prereq_final_date_invention_authorized_true", { finalDateInventionAuthorized: true });
  expect_rejected("prereq_legal_certainty_authorized_true", { legalCertaintyAuthorized: true });
  expect_rejected("prereq_coercive_legal_instruction_authorized_true", { coerciveLegalInstructionAuthorized: true });
  expect_rejected("prereq_delivery_date_required_false", { deliveryDateRequiredForExactDeadline: false });

  // TD flags
  expect_rejected("prereq_td001_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("prereq_td005_boundary_false", { td005PaidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("prereq_td005_client_flag_false", { td005PaidDocumentModeClientFlagBypassClosed: false });
  expect_rejected("prereq_td005_deferred_false", { td005PaidDocumentModeActualRuntimeImplementationDeferred: false });
  expect_rejected("prereq_td004_planned_false", { td004PreModelPiiRedactionPlanned: false });
  expect_rejected("prereq_td004_contracted_false", { td004PreModelPiiRedactionContracted: false });
  expect_rejected("prereq_td004_impl_planned_false", { td004PreModelPiiRedactionImplementationPlanned: false });
  expect_rejected("prereq_td004_still_requires_runtime_contract_false", { td004PreModelPiiRedactionStillRequiresRuntimeContract: false });
  expect_rejected("prereq_td004_still_requires_runtime_impl_false", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
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

  // 8.6C forward readiness gate
  expect_rejected("prereq_ready_for_8x6d_runtime_contract_false", { readyFor8x6DPreModelPiiRedactionRuntimeContract: false });
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

  // 8.6D core assertion flags
  expect_rejected("impl_plan_ready_for_runtime_contract_false", { preModelPiiRedactionImplementationPlanReadyForRuntimeContract: false });
  expect_rejected("pii_runtime_contract_only_false", { preModelPiiRedactionRuntimeContractOnly: false });
  expect_rejected("pii_runtime_contract_defined_false", { preModelPiiRedactionRuntimeContractDefined: false });
  expect_rejected("pii_utility_runtime_still_not_implemented_false", { preModelPiiRedactionUtilityRuntimeStillNotImplemented: false });

  // Isolated utility contract (13)
  expect_rejected("pii_rc_pure_local_false", { piiRuntimeContractRequiresPureLocalDeterministicHelper: false });
  expect_rejected("pii_rc_no_route_imports_false", { piiRuntimeContractRequiresNoRouteImports: false });
  expect_rejected("pii_rc_no_openai_fetch_env_sdk_false", { piiRuntimeContractRequiresNoOpenAiFetchEnvSdk: false });
  expect_rejected("pii_rc_no_persistence_false", { piiRuntimeContractRequiresNoPersistence: false });
  expect_rejected("pii_rc_no_storage_false", { piiRuntimeContractRequiresNoStorage: false });
  expect_rejected("pii_rc_no_database_writes_false", { piiRuntimeContractRequiresNoDatabaseWrites: false });
  expect_rejected("pii_rc_no_user_visible_output_false", { piiRuntimeContractRequiresNoUserVisibleOutput: false });
  expect_rejected("pii_rc_no_model_calls_false", { piiRuntimeContractRequiresNoModelCalls: false });
  expect_rejected("pii_rc_no_prompt_building_false", { piiRuntimeContractRequiresNoPromptBuilding: false });
  expect_rejected("pii_rc_no_evidence_gate_execution_false", { piiRuntimeContractRequiresNoEvidenceGateExecution: false });
  expect_rejected("pii_rc_no_claim_authorization_false", { piiRuntimeContractRequiresNoClaimAuthorization: false });
  expect_rejected("pii_rc_no_deadline_calculation_false", { piiRuntimeContractRequiresNoDeadlineCalculation: false });
  expect_rejected("pii_rc_no_payment_checkout_entitlement_false", { piiRuntimeContractRequiresNoPaymentCheckoutEntitlementLogic: false });

  // Input contract (9)
  expect_rejected("pii_rc_input_explicit_text_only_false", { piiRuntimeContractInputAcceptsExplicitTextOnly: false });
  expect_rejected("pii_rc_input_explicit_lane_false", { piiRuntimeContractInputRequiresExplicitSourceLaneDescriptor: false });
  expect_rejected("pii_rc_input_rejects_empty_false", { piiRuntimeContractInputRejectsEmptyInput: false });
  expect_rejected("pii_rc_input_rejects_above_limit_false", { piiRuntimeContractInputRejectsAboveDocumentTextLimit: false });
  expect_rejected("pii_rc_input_rejects_unsupported_lanes_false", { piiRuntimeContractInputRejectsUnsupportedLanes: false });
  expect_rejected("pii_rc_input_controlled_lane_false", { piiRuntimeContractInputRequiresControlledDocumentLaneDescriptor: false });
  expect_rejected("pii_rc_input_no_free_qa_bypass_false", { piiRuntimeContractInputDoesNotAllowFreeQaDocumentBypass: false });
  expect_rejected("pii_rc_input_no_infer_lane_from_client_false", { piiRuntimeContractInputDoesNotInferLaneFromClientFlags: false });
  expect_rejected("pii_rc_input_no_trust_client_entitlement_false", { piiRuntimeContractInputDoesNotTrustClientEntitlement: false });

  // Output contract (13)
  expect_rejected("pii_rc_structured_result_false", { piiRuntimeContractReturnsStructuredRedactionResult: false });
  expect_rejected("pii_rc_output_status_false", { piiRuntimeContractOutputIncludesStatus: false });
  expect_rejected("pii_rc_output_redacted_text_false", { piiRuntimeContractOutputIncludesRedactedText: false });
  expect_rejected("pii_rc_output_placeholder_counts_false", { piiRuntimeContractOutputIncludesPlaceholderCounts: false });
  expect_rejected("pii_rc_output_placeholder_categories_false", { piiRuntimeContractOutputIncludesPlaceholderCategories: false });
  expect_rejected("pii_rc_output_coverage_summary_false", { piiRuntimeContractOutputIncludesCoverageSummaryWithoutRawValues: false });
  expect_rejected("pii_rc_output_unresolved_risk_flags_false", { piiRuntimeContractOutputIncludesUnresolvedRiskFlagsWithoutRawValues: false });
  expect_rejected("pii_rc_output_blocking_reasons_false", { piiRuntimeContractOutputIncludesBlockingReasonsWithoutRawValues: false });
  expect_rejected("pii_rc_output_detector_summary_false", { piiRuntimeContractOutputIncludesDetectorSummaryWithoutRawValues: false });
  expect_rejected("pii_rc_output_safe_for_model_false", { piiRuntimeContractOutputIncludesSafeForModelBoolean: false });
  expect_rejected("pii_rc_output_safe_for_evidence_gates_false", { piiRuntimeContractOutputIncludesSafeForEvidenceGatesBoolean: false });
  expect_rejected("pii_rc_output_safe_for_user_visible_false", { piiRuntimeContractOutputIncludesSafeForUserVisibleOutputDefaultFalse: false });
  expect_rejected("pii_rc_output_no_raw_map_false", { piiRuntimeContractOutputDoesNotReturnRawMapByDefault: false });

  // Detector hit structure (8)
  expect_rejected("pii_rc_detector_hits_structured_false", { piiRuntimeContractDetectorHitsStructured: false });
  expect_rejected("pii_rc_detector_hits_category_false", { piiRuntimeContractDetectorHitsIncludeCategory: false });
  expect_rejected("pii_rc_detector_hits_start_offset_false", { piiRuntimeContractDetectorHitsIncludeStartOffset: false });
  expect_rejected("pii_rc_detector_hits_end_offset_false", { piiRuntimeContractDetectorHitsIncludeEndOffset: false });
  expect_rejected("pii_rc_detector_hits_confidence_false", { piiRuntimeContractDetectorHitsIncludeConfidence: false });
  expect_rejected("pii_rc_detector_hits_reason_false", { piiRuntimeContractDetectorHitsIncludeReason: false });
  expect_rejected("pii_rc_detector_hits_replacement_placeholder_false", { piiRuntimeContractDetectorHitsIncludeReplacementPlaceholder: false });
  expect_rejected("pii_rc_detector_hits_no_raw_values_false", { piiRuntimeContractDetectorHitsDoNotExposeRawValuesInNormalMode: false });

  // Detector coverage (29)
  for (const dc of DETECTOR_COVERAGE) {
    expect_rejected(`pii_rc_detector_covers_${dc}_false`, { [`piiRuntimeContractDetectorCovers${dc}`]: false });
  }

  // Placeholder contract (7)
  expect_rejected("pii_rc_placeholders_deterministic_false", { piiRuntimeContractPlaceholdersDeterministicPerRequest: false });
  expect_rejected("pii_rc_placeholders_category_specific_false", { piiRuntimeContractPlaceholdersCategorySpecific: false });
  expect_rejected("pii_rc_placeholder_numbering_stable_false", { piiRuntimeContractPlaceholderNumberingStableWithinRequest: false });
  expect_rejected("pii_rc_repeated_raw_value_same_placeholder_false", { piiRuntimeContractRepeatedRawValueGetsSamePlaceholder: false });
  expect_rejected("pii_rc_different_raw_values_increment_false", { piiRuntimeContractDifferentRawValuesIncrementPlaceholders: false });
  expect_rejected("pii_rc_placeholder_categories_safe_false", { piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit: false });
  expect_rejected("pii_rc_raw_map_local_ephemeral_false", { piiRuntimeContractRawMapLocalEphemeralByDefault: false });

  // Safety contract (10)
  expect_rejected("pii_rc_blocks_if_safe_redaction_cannot_false", { piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished: false });
  expect_rejected("pii_rc_needs_review_if_ambiguous_false", { piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable: false });
  expect_rejected("pii_rc_safe_for_user_visible_defaults_false_false", { piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse: false });
  expect_rejected("pii_rc_safe_for_model_defaults_false_false", { piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk: false });
  expect_rejected("pii_rc_safe_for_evidence_gates_defaults_false_false", { piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed: false });
  expect_rejected("pii_rc_no_silent_pass_high_risk_false", { piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers: false });
  expect_rejected("pii_rc_no_alter_dates_false", { piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines: false });
  expect_rejected("pii_rc_preserves_legal_semantic_structure_false", { piiRuntimeContractPreservesLegalSemanticStructureWherePossible: false });
  expect_rejected("pii_rc_no_invent_facts_false", { piiRuntimeContractDoesNotInventMissingFacts: false });
  expect_rejected("pii_rc_no_classify_legally_sufficient_false", { piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient: false });

  // Testing contract (34)
  for (const tc of TESTING_CASES) {
    expect_rejected(`pii_rc_tests_${tc}_false`, { [`piiRuntimeContractTests${tc}`]: false });
  }

  // Integration contract (9)
  expect_rejected("pii_rc_utility_isolated_helper_first_false", { piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst: false });
  expect_rejected("pii_rc_route_patch_separate_auth_false", { piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization: false });
  expect_rejected("pii_rc_route_patch_after_validation_before_prompt_false", { piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt: false });
  expect_rejected("pii_rc_route_patch_preserves_free_qa_guard_false", { piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard: false });
  expect_rejected("pii_rc_route_patch_preserves_paid_boundary_false", { piiRuntimeContractFutureRoutePatchPreservesPaidBoundary: false });
  expect_rejected("pii_rc_route_patch_preserves_photo_quarantine_false", { piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine: false });
  expect_rejected("pii_rc_route_patch_no_user_visible_output_false", { piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("pii_rc_route_patch_no_public_runtime_false", { piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime: false });
  expect_rejected("pii_rc_route_patch_no_exact_deadline_false", { piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation: false });

  // Runtime contract decision (5)
  expect_rejected("pii_rc_accepts_impl_plan_false", { piiRuntimeContractAcceptsImplementationPlan: false });
  expect_rejected("pii_rc_marks_td004_runtime_contract_completed_false", { piiRuntimeContractMarksTd004RuntimeContractCompleted: false });
  expect_rejected("pii_rc_keeps_runtime_disabled_false", { piiRuntimeContractKeepsRuntimeImplementationDisabled: false });
  expect_rejected("pii_rc_keeps_production_missing_false", { piiRuntimeContractKeepsProductionPiiRedactionMissing: false });
  expect_rejected("pii_rc_ready_for_8x6e_false", { piiRuntimeContractReadyFor8x6EDryRunImplementation: false });

  // 8.6D new actual flags
  expect_rejected("actual_pii_runtime_contract_only_false", { actualPiiRedactionRuntimeContractOnly: false });
  expect_rejected("actual_pii_utility_runtime_implemented_true", { actualPiiRedactionUtilityRuntimeImplemented: true });
  expect_rejected("actual_utility_runtime_file_created_true", { actualUtilityRuntimeFileCreatedInThisPhase: true });

  // Shared actual violations
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

  // 8.6D side-effect confirmations (26)
  for (const se of IMPL_PLAN_SIDE_EFFECTS) {
    expect_rejected(`pii_rc_confirms_${se}_false`, { [`piiRuntimeContractConfirms${se}`]: false });
  }

  // Pipeline violations
  for (const f of PIPELINE_FLAGS) expect_rejected(`${f}_true_result`, { [f]: true });

  // Runtime auth violations
  for (const f of RUNTIME_AUTH_FLAGS) expect_rejected(`${f}_true_result`, { [f]: true });

  // Auth grant violations
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety result violations
  expect_rejected("exact_deadline_calculation_authorized_true", { exactDeadlineCalculationAuthorized: true });

  // 8.6D TD result flags
  expect_rejected("td004_runtime_contracted_false", { td004PreModelPiiRedactionRuntimeContracted: false });
  expect_rejected("td004_still_requires_runtime_impl_false", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
  expect_rejected("td004_still_missing_in_production_false", { td004PreModelPiiRedactionStillMissingInProduction: false });

  // 8.6D forward readiness
  expect_rejected("ready_for_8x6e_dry_run_implementation_false", { readyFor8x6EPreModelPiiRedactionDryRunImplementation: false });
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

export function runControlledRealDocumentPreModelPiiRedactionRuntimeContract(): ControlledRealDocumentPreModelPiiRedactionRuntimeContractResult {
  const canonical = buildCanonical8x6DInput();
  const validation = validateRuntimeContractInput(canonical);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.6D",
    allPassed,
    preModelPiiRedactionImplementationPlanReadyForRuntimeContract: true,
    controlledRealDocumentPreModelPiiRedactionRuntimeContractAccepted: allPassed,
    preModelPiiRedactionRuntimeContractOnly: true,
    preModelPiiRedactionRuntimeContractDefined: true,
    preModelPiiRedactionUtilityRuntimeStillNotImplemented: true,
    preModelPiiRedactionRuntimeStillNotImplemented: true,
    preModelPiiDetectorRuntimeStillNotImplemented: true,
    preModelPiiMaskingRuntimeStillNotImplemented: true,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: true,
    preModelPiiRedactionDoesNotAuthorizeModelCall: true,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true,
    tamperCasesRejected: tamperResult.allRejected,
    piiRuntimeContractRequiresPureLocalDeterministicHelper: true,
    piiRuntimeContractRequiresNoRouteImports: true,
    piiRuntimeContractRequiresNoOpenAiFetchEnvSdk: true,
    piiRuntimeContractRequiresNoPersistence: true,
    piiRuntimeContractRequiresNoStorage: true,
    piiRuntimeContractRequiresNoDatabaseWrites: true,
    piiRuntimeContractRequiresNoUserVisibleOutput: true,
    piiRuntimeContractRequiresNoModelCalls: true,
    piiRuntimeContractRequiresNoPromptBuilding: true,
    piiRuntimeContractRequiresNoEvidenceGateExecution: true,
    piiRuntimeContractRequiresNoClaimAuthorization: true,
    piiRuntimeContractRequiresNoDeadlineCalculation: true,
    piiRuntimeContractRequiresNoPaymentCheckoutEntitlementLogic: true,
    piiRuntimeContractInputAcceptsExplicitTextOnly: true,
    piiRuntimeContractInputRequiresExplicitSourceLaneDescriptor: true,
    piiRuntimeContractInputRejectsEmptyInput: true,
    piiRuntimeContractInputRejectsAboveDocumentTextLimit: true,
    piiRuntimeContractInputRejectsUnsupportedLanes: true,
    piiRuntimeContractInputRequiresControlledDocumentLaneDescriptor: true,
    piiRuntimeContractInputDoesNotAllowFreeQaDocumentBypass: true,
    piiRuntimeContractInputDoesNotInferLaneFromClientFlags: true,
    piiRuntimeContractInputDoesNotTrustClientEntitlement: true,
    piiRuntimeContractReturnsStructuredRedactionResult: true,
    piiRuntimeContractOutputIncludesStatus: true,
    piiRuntimeContractOutputIncludesRedactedText: true,
    piiRuntimeContractOutputIncludesPlaceholderCounts: true,
    piiRuntimeContractOutputIncludesPlaceholderCategories: true,
    piiRuntimeContractOutputIncludesCoverageSummaryWithoutRawValues: true,
    piiRuntimeContractOutputIncludesUnresolvedRiskFlagsWithoutRawValues: true,
    piiRuntimeContractOutputIncludesBlockingReasonsWithoutRawValues: true,
    piiRuntimeContractOutputIncludesDetectorSummaryWithoutRawValues: true,
    piiRuntimeContractOutputIncludesSafeForModelBoolean: true,
    piiRuntimeContractOutputIncludesSafeForEvidenceGatesBoolean: true,
    piiRuntimeContractOutputIncludesSafeForUserVisibleOutputDefaultFalse: true,
    piiRuntimeContractOutputDoesNotReturnRawMapByDefault: true,
    piiRuntimeContractDetectorHitsStructured: true,
    piiRuntimeContractDetectorHitsIncludeCategory: true,
    piiRuntimeContractDetectorHitsIncludeStartOffset: true,
    piiRuntimeContractDetectorHitsIncludeEndOffset: true,
    piiRuntimeContractDetectorHitsIncludeConfidence: true,
    piiRuntimeContractDetectorHitsIncludeReason: true,
    piiRuntimeContractDetectorHitsIncludeReplacementPlaceholder: true,
    piiRuntimeContractDetectorHitsDoNotExposeRawValuesInNormalMode: true,
    piiRuntimeContractDetectorCoversGermanSalutations: true,
    piiRuntimeContractDetectorCoversPostalAddresses: true,
    piiRuntimeContractDetectorCoversPhoneNumbers: true,
    piiRuntimeContractDetectorCoversEmailAddresses: true,
    piiRuntimeContractDetectorCoversDatesOfBirth: true,
    piiRuntimeContractDetectorCoversCustomerNumbers: true,
    piiRuntimeContractDetectorCoversInsuranceNumbers: true,
    piiRuntimeContractDetectorCoversHealthInsuranceIdentifiers: true,
    piiRuntimeContractDetectorCoversTaxIds: true,
    piiRuntimeContractDetectorCoversSteuerId: true,
    piiRuntimeContractDetectorCoversSteuernummer: true,
    piiRuntimeContractDetectorCoversAktenzeichen: true,
    piiRuntimeContractDetectorCoversVorgangsnummer: true,
    piiRuntimeContractDetectorCoversCaseReferenceNumbers: true,
    piiRuntimeContractDetectorCoversIban: true,
    piiRuntimeContractDetectorCoversBankAccountIdentifiers: true,
    piiRuntimeContractDetectorCoversLicensePlateNumbers: true,
    piiRuntimeContractDetectorCoversEmployerNamesInPersonalContext: true,
    piiRuntimeContractDetectorCoversSignatures: true,
    piiRuntimeContractDetectorCoversRecipientBlocks: true,
    piiRuntimeContractDetectorCoversSenderBlocks: true,
    piiRuntimeContractDetectorCoversAuthorityContactBlocks: true,
    piiRuntimeContractDetectorCoversMedicalHealthIdentifiers: true,
    piiRuntimeContractDetectorCoversImmigrationResidenceIdentifiers: true,
    piiRuntimeContractDetectorCoversSocialBenefitIdentifiers: true,
    piiRuntimeContractDetectorCoversJobcenterBuergergeldIdentifiers: true,
    piiRuntimeContractDetectorCoversFamilienkasseKindergeldIdentifiers: true,
    piiRuntimeContractDetectorCoversAuslaenderbehoerdeIdentifiers: true,
    piiRuntimeContractDetectorCoversFinanzamtIdentifiers: true,
    piiRuntimeContractPlaceholdersDeterministicPerRequest: true,
    piiRuntimeContractPlaceholdersCategorySpecific: true,
    piiRuntimeContractPlaceholderNumberingStableWithinRequest: true,
    piiRuntimeContractRepeatedRawValueGetsSamePlaceholder: true,
    piiRuntimeContractDifferentRawValuesIncrementPlaceholders: true,
    piiRuntimeContractPlaceholderCategoriesSafeForPromptsAndAudit: true,
    piiRuntimeContractRawMapLocalEphemeralByDefault: true,
    piiRuntimeContractBlocksIfSafeRedactionCannotBeEstablished: true,
    piiRuntimeContractNeedsReviewIfAmbiguousButRecoverable: true,
    piiRuntimeContractSafeForUserVisibleOutputDefaultsFalse: true,
    piiRuntimeContractSafeForModelDefaultsFalseUnlessPassedAndNoHighRisk: true,
    piiRuntimeContractSafeForEvidenceGatesDefaultsFalseUnlessPassed: true,
    piiRuntimeContractDoesNotSilentlyPassHighRiskIdentifiers: true,
    piiRuntimeContractDoesNotAlterDatesIntoFalseDeadlines: true,
    piiRuntimeContractPreservesLegalSemanticStructureWherePossible: true,
    piiRuntimeContractDoesNotInventMissingFacts: true,
    piiRuntimeContractDoesNotClassifyDocumentAsLegallySufficient: true,
    piiRuntimeContractTestsCleanNoPiiInput: true,
    piiRuntimeContractTestsSimplePersonName: true,
    piiRuntimeContractTestsGreetingWithPersonName: true,
    piiRuntimeContractTestsAddressBlock: true,
    piiRuntimeContractTestsPhoneNumber: true,
    piiRuntimeContractTestsEmailAddress: true,
    piiRuntimeContractTestsDob: true,
    piiRuntimeContractTestsCustomerNumber: true,
    piiRuntimeContractTestsInsuranceNumber: true,
    piiRuntimeContractTestsHealthInsuranceIdentifier: true,
    piiRuntimeContractTestsSteuerId: true,
    piiRuntimeContractTestsSteuernummer: true,
    piiRuntimeContractTestsAktenzeichen: true,
    piiRuntimeContractTestsVorgangsnummer: true,
    piiRuntimeContractTestsCaseReferenceNumber: true,
    piiRuntimeContractTestsIban: true,
    piiRuntimeContractTestsLicensePlate: true,
    piiRuntimeContractTestsSenderBlock: true,
    piiRuntimeContractTestsRecipientBlock: true,
    piiRuntimeContractTestsAuthorityContactBlock: true,
    piiRuntimeContractTestsJobcenterBuergergeldIdentifier: true,
    piiRuntimeContractTestsFamilienkasseKindergeldIdentifier: true,
    piiRuntimeContractTestsAuslaenderbehoerdeIdentifier: true,
    piiRuntimeContractTestsFinanzamtIdentifier: true,
    piiRuntimeContractTestsMedicalIdentifier: true,
    piiRuntimeContractTestsImmigrationIdentifier: true,
    piiRuntimeContractTestsMixedUserCommentaryAndDocumentText: true,
    piiRuntimeContractTestsFalsePositiveControl: true,
    piiRuntimeContractTestsRepeatedRawValueStablePlaceholder: true,
    piiRuntimeContractTestsDifferentValuesIncrementPlaceholders: true,
    piiRuntimeContractTestsUnsafeUnresolvedPiiBlocks: true,
    piiRuntimeContractTestsNoRawPiiInResultMetadata: true,
    piiRuntimeContractTestsNoRawPiiInUnsafeFields: true,
    piiRuntimeContractTestsNoRuntimeAuthorizationGranted: true,
    piiRuntimeContractFutureUtilityCreatedAsIsolatedHelperFirst: true,
    piiRuntimeContractFutureRoutePatchRequiresSeparateAuthorization: true,
    piiRuntimeContractFutureRoutePatchAfterValidationBeforePrompt: true,
    piiRuntimeContractFutureRoutePatchPreservesFreeQaGuard: true,
    piiRuntimeContractFutureRoutePatchPreservesPaidBoundary: true,
    piiRuntimeContractFutureRoutePatchPreservesPhotoQuarantine: true,
    piiRuntimeContractFutureRoutePatchDoesNotAuthorizeUserVisibleOutput: true,
    piiRuntimeContractFutureRoutePatchDoesNotAuthorizePublicRuntime: true,
    piiRuntimeContractFutureRoutePatchDoesNotAuthorizeExactDeadlineCalculation: true,
    piiRuntimeContractAcceptsImplementationPlan: true,
    piiRuntimeContractMarksTd004RuntimeContractCompleted: true,
    piiRuntimeContractKeepsRuntimeImplementationDisabled: true,
    piiRuntimeContractKeepsProductionPiiRedactionMissing: true,
    piiRuntimeContractReadyFor8x6EDryRunImplementation: true,
    actualPiiRedactionRuntimeContractOnly: true,
    actualPiiRedactionUtilityRuntimeImplemented: false,
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
    actualUtilityRuntimeFileCreatedInThisPhase: false,
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
    piiRuntimeContractConfirmsNoOpenAiCall: true,
    piiRuntimeContractConfirmsNoFetchCall: true,
    piiRuntimeContractConfirmsNoProcessEnvRead: true,
    piiRuntimeContractConfirmsNoSdkUsage: true,
    piiRuntimeContractConfirmsNo8x3AcRerun: true,
    piiRuntimeContractConfirmsNoPaymentRuntimeCall: true,
    piiRuntimeContractConfirmsNoStripeCall: true,
    piiRuntimeContractConfirmsNoCheckoutCall: true,
    piiRuntimeContractConfirmsNoEntitlementRuntimeCall: true,
    piiRuntimeContractConfirmsNoServerEntitlementVerification: true,
    piiRuntimeContractConfirmsNoOcrRuntimeCall: true,
    piiRuntimeContractConfirmsNoStorageMutation: true,
    piiRuntimeContractConfirmsNoDatabaseWrite: true,
    piiRuntimeContractConfirmsNoAuditPersistence: true,
    piiRuntimeContractConfirmsNoUserVisibleDocumentExplanation: true,
    piiRuntimeContractConfirmsNoEvidenceEvaluation: true,
    piiRuntimeContractConfirmsNoClaimAuthorization: true,
    piiRuntimeContractConfirmsNoDeadlineCalculation: true,
    piiRuntimeContractConfirmsNoLegalCertainty: true,
    piiRuntimeContractConfirmsNoPromptBuild: true,
    piiRuntimeContractConfirmsNoModelCall: true,
    piiRuntimeContractConfirmsNoRunSmartTalkCall: true,
    piiRuntimeContractConfirmsNoRouteHandlerCall: true,
    piiRuntimeContractConfirmsNoRouteImport: true,
    piiRuntimeContractConfirmsNoFilesystemRead: true,
    piiRuntimeContractConfirmsNoPhotoRouteModification: true,
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
    td004PreModelPiiRedactionRuntimeContracted: true,
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
    readyFor8x6EPreModelPiiRedactionDryRunImplementation: true,
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
      "8.6D is a Pre-Model PII Redaction Runtime Contract.",
      "8.6D depends on completed 8.6C Pre-Model PII Redaction Implementation Plan.",
      "8.6D is runtime-contract-only and creates no runtime behavior.",
      "8.6D does not modify /api/smart-talk.",
      "8.6D does not modify /api/smart-talk-photo.",
      "8.6D defines the contract for a future isolated deterministic PII redaction utility.",
      "8.6D does not implement the PII redaction utility.",
      "8.6D does not create a utility runtime file.",
      "8.6D does not implement PII redaction runtime.",
      "8.6D does not implement PII detector runtime.",
      "8.6D does not implement PII masking runtime.",
      "8.6D does not redact real text.",
      "8.6D does not process raw PII.",
      "8.6D does not authorize real document input.",
      "8.6D does not authorize user-visible output.",
      "8.6D does not authorize prompt build, model call, or runSmartTalk.",
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
      "TD-004 is now planned, contracted, implementation-planned, and runtime-contracted, but still missing in production.",
      "TD-004 still requires runtime implementation.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyFor8x6EPreModelPiiRedactionDryRunImplementation is dry-run implementation readiness only, not real document/pilot/production authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
