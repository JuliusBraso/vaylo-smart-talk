/**
 * Phase 8.6B — Controlled Real Document Pre-Model PII Redaction Contract.
 *
 * CONTRACT-ONLY — NO RUNTIME BEHAVIOR — DEPENDS ON 8.6A.
 *
 * Converts the 8.6A plan into a strict future implementation contract.
 * Does NOT implement PII redaction, detector, masking, or any runtime.
 */

import { runControlledRealDocumentPreModelPiiRedactionPlan } from "./run-controlled-real-document-pre-model-pii-redaction-plan";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPreModelPiiRedactionContractInput {
  // 8.6A prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: boolean;
  readonly controlledRealDocumentPreModelPiiRedactionPlanAccepted: boolean;
  readonly preModelPiiRedactionPlanningOnly: boolean;
  readonly preModelPiiRedactionPlanDefined: boolean;
  readonly preModelPiiRedactionRuntimeStillNotImplemented: boolean;
  readonly preModelPiiDetectorRuntimeStillNotImplemented: boolean;
  readonly preModelPiiMaskingRuntimeStillNotImplemented: boolean;
  readonly preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: boolean;
  readonly preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: boolean;
  readonly preModelPiiRedactionDoesNotAuthorizePromptBuild: boolean;
  readonly preModelPiiRedactionDoesNotAuthorizeModelCall: boolean;
  readonly preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: boolean;
  readonly prereqTamperCasesRejected: boolean;

  // 8.6A planning confirmations
  readonly piiPlanRequiresBoundaryBeforePromptBuild: boolean;
  readonly piiPlanRequiresBoundaryBeforeModelCall: boolean;
  readonly piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: boolean;
  readonly piiPlanRequiresBoundaryAfterControlledInputValidation: boolean;
  readonly piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: boolean;
  readonly piiPlanDoesNotCreateFreeQaDocumentBypass: boolean;
  readonly piiPlanDoesNotAuthorizeRealDocumentInput: boolean;
  readonly piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: boolean;
  readonly piiPlanDoesNotAuthorizeExactDeadlineCalculation: boolean;
  readonly piiPlanDoesNotAuthorizePublicRuntime: boolean;

  // 8.6A PII class coverage
  readonly piiPlanCoversPersonNames: boolean;
  readonly piiPlanCoversPostalAddresses: boolean;
  readonly piiPlanCoversPhoneNumbers: boolean;
  readonly piiPlanCoversEmailAddresses: boolean;
  readonly piiPlanCoversDatesOfBirth: boolean;
  readonly piiPlanCoversCustomerNumbers: boolean;
  readonly piiPlanCoversInsuranceNumbers: boolean;
  readonly piiPlanCoversHealthInsuranceIdentifiers: boolean;
  readonly piiPlanCoversTaxIds: boolean;
  readonly piiPlanCoversSteuerId: boolean;
  readonly piiPlanCoversSteuernummer: boolean;
  readonly piiPlanCoversAktenzeichen: boolean;
  readonly piiPlanCoversVorgangsnummer: boolean;
  readonly piiPlanCoversCaseReferenceNumbers: boolean;
  readonly piiPlanCoversIban: boolean;
  readonly piiPlanCoversBankAccountIdentifiers: boolean;
  readonly piiPlanCoversLicensePlateNumbers: boolean;
  readonly piiPlanCoversEmployerNamesInPersonalContext: boolean;
  readonly piiPlanCoversSignatures: boolean;
  readonly piiPlanCoversHandwrittenNames: boolean;
  readonly piiPlanCoversGreetingsContainingPersonalNames: boolean;
  readonly piiPlanCoversDocumentRecipientBlocks: boolean;
  readonly piiPlanCoversSenderBlocks: boolean;
  readonly piiPlanCoversRealContactDetails: boolean;
  readonly piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments: boolean;
  readonly piiPlanCoversMedicalHealthContextIdentifiers: boolean;
  readonly piiPlanCoversImmigrationResidencePermitIdentifiers: boolean;
  readonly piiPlanCoversSocialBenefitIdentifiers: boolean;
  readonly piiPlanCoversJobcenterBuergergeldIdentifiers: boolean;
  readonly piiPlanCoversFamilienkasseKindergeldIdentifiers: boolean;
  readonly piiPlanCoversAuslaenderbehoerdeIdentifiers: boolean;
  readonly piiPlanCoversFinanzamtIdentifiers: boolean;

  // 8.6A redaction/masking requirements
  readonly piiPlanRequiresDeterministicPlaceholders: boolean;
  readonly piiPlanRequiresStablePlaceholderMappingInsideOneRequest: boolean;
  readonly piiPlanRequiresNoRawPiiPersistenceByDefault: boolean;
  readonly piiPlanRequiresNoRawPiiInPrompt: boolean;
  readonly piiPlanRequiresNoRawPiiInLogs: boolean;
  readonly piiPlanRequiresNoRawPiiInAuditTraces: boolean;
  readonly piiPlanRequiresNoRawPiiInUserVisibleErrorMessages: boolean;
  readonly piiPlanRequiresNoRawPiiInTelemetry: boolean;
  readonly piiPlanRequiresNoRawPiiInModelMetadata: boolean;
  readonly piiPlanRequiresNoRawPiiInEvidenceGateTraces: boolean;
  readonly piiPlanRequiresNoRawPiiInDeadlineTraces: boolean;
  readonly piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault: boolean;
  readonly piiPlanRequiresStructuredRedactionAuditWithoutRawValues: boolean;
  readonly piiPlanRequiresCoverageMetricsWithoutRawValues: boolean;
  readonly piiPlanRequiresConservativeFallbackWhenConfidenceUncertain: boolean;
  readonly piiPlanRequiresBlockOrEscalateIfUnsafeToRedact: boolean;

  // 8.6A placeholder confirmations
  readonly piiPlanAllowsPersonPlaceholder: boolean;
  readonly piiPlanAllowsAddressPlaceholder: boolean;
  readonly piiPlanAllowsPhonePlaceholder: boolean;
  readonly piiPlanAllowsEmailPlaceholder: boolean;
  readonly piiPlanAllowsDobPlaceholder: boolean;
  readonly piiPlanAllowsCustomerIdPlaceholder: boolean;
  readonly piiPlanAllowsInsuranceIdPlaceholder: boolean;
  readonly piiPlanAllowsTaxIdPlaceholder: boolean;
  readonly piiPlanAllowsCaseRefPlaceholder: boolean;
  readonly piiPlanAllowsIbanPlaceholder: boolean;
  readonly piiPlanAllowsAuthorityPlaceholder: boolean;
  readonly piiPlanAllowsEmployerPlaceholder: boolean;
  readonly piiPlanAllowsSignaturePlaceholder: boolean;
  readonly piiPlanAllowsDocumentRecipientPlaceholder: boolean;
  readonly piiPlanAllowsDocumentSenderPlaceholder: boolean;

  // 8.6A safety confirmations
  readonly piiPlanPreservesLegalSemanticStructureWherePossible: boolean;
  readonly piiPlanMustNotInventMissingFacts: boolean;
  readonly piiPlanMustNotAlterDatesIntoFalseDeadlines: boolean;
  readonly piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion: boolean;
  readonly piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: boolean;
  readonly piiPlanMustNotInferRecipientIdentityFromPartialText: boolean;
  readonly piiPlanMustNotInferSenderIdentityFromPartialText: boolean;
  readonly piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: boolean;
  readonly piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: boolean;
  readonly piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: boolean;
  readonly piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: boolean;
  readonly piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: boolean;

  // 8.6A failure mode confirmations
  readonly piiPlanDefinesFailurePiiRedactionRequired: boolean;
  readonly piiPlanDefinesFailurePiiRedactionIncomplete: boolean;
  readonly piiPlanDefinesFailurePiiRedactionConfidenceLow: boolean;
  readonly piiPlanDefinesFailurePiiRedactionUnsafeForModel: boolean;
  readonly piiPlanDefinesFailureBlockedHighRiskIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedMedicalIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedImmigrationIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedFinancialIdentifier: boolean;
  readonly piiPlanDefinesFailureBlockedUnknownDocumentIdentity: boolean;

  // 8.6A downstream confirmations
  readonly piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: boolean;
  readonly piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: boolean;
  readonly piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: boolean;
  readonly piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: boolean;
  readonly piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: boolean;
  readonly piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: boolean;
  readonly piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: boolean;

  // 8.6A actual flags (shared names with 8.6B result assertions)
  readonly actualPiiRedactionPlanOnly: boolean;
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualPiiDetectorRuntimeImplemented: boolean;
  readonly actualPiiMaskingRuntimeImplemented: boolean;
  readonly actualPiiTextRedacted: boolean;
  readonly actualRawPiiProcessed: boolean;
  readonly actualRawPiiPersisted: boolean;
  readonly actualRawPiiLogged: boolean;
  readonly actualPromptBuildPerformed: boolean;
  readonly actualModelCallPerformed: boolean;
  readonly actualRunSmartTalkCalled: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;
  readonly actualLiveRouteMutationPerformedInThisPhase: boolean;
  readonly actualSmartTalkRouteModifiedInThisPhase: boolean;
  readonly actualPhotoRouteModifiedInThisPhase: boolean;
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPaymentRuntimeImplemented: boolean;
  readonly actualCheckoutImplemented: boolean;
  readonly actualEntitlementRuntimeImplemented: boolean;
  readonly actualServerEntitlementVerificationImplemented: boolean;
  readonly actualRealDocumentInputPerformed: boolean;
  readonly actualRealDocumentProcessingPerformed: boolean;
  readonly actualOcrPerformed: boolean;
  readonly actualPhotoInputProcessed: boolean;
  readonly actualFileInputProcessed: boolean;
  readonly actualDocumentStoragePerformed: boolean;
  readonly actualDatabasePersistencePerformed: boolean;
  readonly actualAuditPersistencePerformed: boolean;
  readonly actualUserVisibleOutputPerformed: boolean;
  readonly actualPublicRuntimeEnabled: boolean;

  // 8.6A no-prohibited-side-effect confirmations
  readonly piiPlanConfirmsNoOpenAiCall: boolean;
  readonly piiPlanConfirmsNoFetchCall: boolean;
  readonly piiPlanConfirmsNoProcessEnvRead: boolean;
  readonly piiPlanConfirmsNoSdkUsage: boolean;
  readonly piiPlanConfirmsNo8x3AcRerun: boolean;
  readonly piiPlanConfirmsNoPaymentRuntimeCall: boolean;
  readonly piiPlanConfirmsNoStripeCall: boolean;
  readonly piiPlanConfirmsNoCheckoutCall: boolean;
  readonly piiPlanConfirmsNoEntitlementRuntimeCall: boolean;
  readonly piiPlanConfirmsNoServerEntitlementVerification: boolean;
  readonly piiPlanConfirmsNoOcrRuntimeCall: boolean;
  readonly piiPlanConfirmsNoStorageMutation: boolean;
  readonly piiPlanConfirmsNoDatabaseWrite: boolean;
  readonly piiPlanConfirmsNoAuditPersistence: boolean;
  readonly piiPlanConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly piiPlanConfirmsNoEvidenceEvaluation: boolean;
  readonly piiPlanConfirmsNoClaimAuthorization: boolean;
  readonly piiPlanConfirmsNoDeadlineCalculation: boolean;
  readonly piiPlanConfirmsNoLegalCertainty: boolean;
  readonly piiPlanConfirmsNoPromptBuild: boolean;
  readonly piiPlanConfirmsNoModelCall: boolean;
  readonly piiPlanConfirmsNoRunSmartTalkCall: boolean;
  readonly piiPlanConfirmsNoRouteHandlerCall: boolean;
  readonly piiPlanConfirmsNoRouteImport: boolean;
  readonly piiPlanConfirmsNoFilesystemRead: boolean;
  readonly piiPlanConfirmsNoPhotoRouteModification: boolean;

  // Pipeline executed flags
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly piiPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly entitlementPipelineActuallyExecuted: boolean;
  readonly checkoutPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // Runtime authorization flags
  readonly preModelPiiRedactionRuntimeAuthorizedNow: boolean;
  readonly realDocumentInputAuthorizedNow: boolean;
  readonly realDocumentProcessingAuthorizedNow: boolean;
  readonly realUserDocumentUploadAuthorizedNow: boolean;
  readonly ocrRuntimeAuthorizedNow: boolean;
  readonly photoInputAuthorizedNow: boolean;
  readonly fileInputAuthorizedNow: boolean;
  readonly documentStorageAuthorizedNow: boolean;
  readonly persistenceAuthorizedNow: boolean;
  readonly publicRuntimeAuthorizedNow: boolean;
  readonly userVisibleLegalDeadlineOutputAuthorizedNow: boolean;
  readonly liveLLMRuntimeAuthorizedNow: boolean;
  readonly connectedAiRuntimeAuthorizedNow: boolean;
  readonly pilotRuntimeAuthorizedNow: boolean;
  readonly productionRuntimeAuthorizedNow: boolean;
  readonly paidDocumentModeRuntimeAuthorizedNow: boolean;
  readonly paymentRuntimeAuthorizedNow: boolean;
  readonly entitlementRuntimeAuthorizedNow: boolean;
  readonly checkoutRuntimeAuthorizedNow: boolean;

  // Authorization grants
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // TD flags from 8.6A result
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundaryContainmentClosed: boolean;
  readonly td005PaidDocumentModeClientFlagBypassClosed: boolean;
  readonly td005PaidDocumentModeActualRuntimeImplementationDeferred: boolean;
  readonly td004PreModelPiiRedactionPlanned: boolean;
  readonly td004PreModelPiiRedactionStillRequiresContract: boolean;
  readonly td004PreModelPiiRedactionStillRequiresRuntimeImplementation: boolean;
  readonly td004PreModelPiiRedactionStillMissingInProduction: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // 8.6A forward readiness gate
  readonly readyFor8x6BPreModelPiiRedactionContract: boolean;
  readonly readyForEvidenceGatesProductionWiringPhase: boolean;
  readonly readyForServerEntitlementVerificationPhase: boolean;
  readonly readyForPaidDocumentModeActualRuntimeImplementationPhase: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.6B core assertion flags
  readonly preModelPiiRedactionPlanReadyForContract: boolean;
  readonly preModelPiiRedactionContractOnly: boolean;
  readonly preModelPiiRedactionContractDefined: boolean;

  // 8.6B contract boundary obligations
  readonly piiContractRequiresBoundaryBeforePromptBuild: boolean;
  readonly piiContractRequiresBoundaryBeforeModelCall: boolean;
  readonly piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: boolean;
  readonly piiContractRequiresBoundaryAfterControlledInputValidation: boolean;
  readonly piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: boolean;
  readonly piiContractDoesNotCreateFreeQaDocumentBypass: boolean;
  readonly piiContractDoesNotAuthorizeRealDocumentInput: boolean;
  readonly piiContractDoesNotAuthorizeUserVisibleDocumentOutput: boolean;
  readonly piiContractDoesNotAuthorizeExactDeadlineCalculation: boolean;
  readonly piiContractDoesNotAuthorizePublicRuntime: boolean;

  // 8.6B contract PII class coverage
  readonly piiContractCoversPersonNames: boolean;
  readonly piiContractCoversPostalAddresses: boolean;
  readonly piiContractCoversPhoneNumbers: boolean;
  readonly piiContractCoversEmailAddresses: boolean;
  readonly piiContractCoversDatesOfBirth: boolean;
  readonly piiContractCoversCustomerNumbers: boolean;
  readonly piiContractCoversInsuranceNumbers: boolean;
  readonly piiContractCoversHealthInsuranceIdentifiers: boolean;
  readonly piiContractCoversTaxIds: boolean;
  readonly piiContractCoversSteuerId: boolean;
  readonly piiContractCoversSteuernummer: boolean;
  readonly piiContractCoversAktenzeichen: boolean;
  readonly piiContractCoversVorgangsnummer: boolean;
  readonly piiContractCoversCaseReferenceNumbers: boolean;
  readonly piiContractCoversIban: boolean;
  readonly piiContractCoversBankAccountIdentifiers: boolean;
  readonly piiContractCoversLicensePlateNumbers: boolean;
  readonly piiContractCoversEmployerNamesInPersonalContext: boolean;
  readonly piiContractCoversSignatures: boolean;
  readonly piiContractCoversHandwrittenNames: boolean;
  readonly piiContractCoversGreetingsContainingPersonalNames: boolean;
  readonly piiContractCoversDocumentRecipientBlocks: boolean;
  readonly piiContractCoversSenderBlocks: boolean;
  readonly piiContractCoversRealContactDetails: boolean;
  readonly piiContractCoversRealAuthorityContactBlocksCopiedFromDocuments: boolean;
  readonly piiContractCoversMedicalHealthContextIdentifiers: boolean;
  readonly piiContractCoversImmigrationResidencePermitIdentifiers: boolean;
  readonly piiContractCoversSocialBenefitIdentifiers: boolean;
  readonly piiContractCoversJobcenterBuergergeldIdentifiers: boolean;
  readonly piiContractCoversFamilienkasseKindergeldIdentifiers: boolean;
  readonly piiContractCoversAuslaenderbehoerdeIdentifiers: boolean;
  readonly piiContractCoversFinanzamtIdentifiers: boolean;

  // 8.6B contract redaction/masking obligations
  readonly piiContractRequiresDeterministicPlaceholders: boolean;
  readonly piiContractRequiresStablePlaceholderMappingInsideOneRequest: boolean;
  readonly piiContractRequiresNoRawPiiPersistenceByDefault: boolean;
  readonly piiContractRequiresNoRawPiiInPrompt: boolean;
  readonly piiContractRequiresNoRawPiiInLogs: boolean;
  readonly piiContractRequiresNoRawPiiInAuditTraces: boolean;
  readonly piiContractRequiresNoRawPiiInUserVisibleErrorMessages: boolean;
  readonly piiContractRequiresNoRawPiiInTelemetry: boolean;
  readonly piiContractRequiresNoRawPiiInModelMetadata: boolean;
  readonly piiContractRequiresNoRawPiiInEvidenceGateTraces: boolean;
  readonly piiContractRequiresNoRawPiiInDeadlineTraces: boolean;
  readonly piiContractRequiresRawToPlaceholderMapLocalEphemeralByDefault: boolean;
  readonly piiContractRequiresStructuredRedactionAuditWithoutRawValues: boolean;
  readonly piiContractRequiresCoverageMetricsWithoutRawValues: boolean;
  readonly piiContractRequiresConservativeFallbackWhenConfidenceUncertain: boolean;
  readonly piiContractRequiresBlockOrEscalateIfUnsafeToRedact: boolean;

  // 8.6B contract placeholder obligations
  readonly piiContractAllowsPersonPlaceholder: boolean;
  readonly piiContractAllowsAddressPlaceholder: boolean;
  readonly piiContractAllowsPhonePlaceholder: boolean;
  readonly piiContractAllowsEmailPlaceholder: boolean;
  readonly piiContractAllowsDobPlaceholder: boolean;
  readonly piiContractAllowsCustomerIdPlaceholder: boolean;
  readonly piiContractAllowsInsuranceIdPlaceholder: boolean;
  readonly piiContractAllowsTaxIdPlaceholder: boolean;
  readonly piiContractAllowsCaseRefPlaceholder: boolean;
  readonly piiContractAllowsIbanPlaceholder: boolean;
  readonly piiContractAllowsAuthorityPlaceholder: boolean;
  readonly piiContractAllowsEmployerPlaceholder: boolean;
  readonly piiContractAllowsSignaturePlaceholder: boolean;
  readonly piiContractAllowsDocumentRecipientPlaceholder: boolean;
  readonly piiContractAllowsDocumentSenderPlaceholder: boolean;

  // 8.6B contract safety obligations
  readonly piiContractPreservesLegalSemanticStructureWherePossible: boolean;
  readonly piiContractMustNotInventMissingFacts: boolean;
  readonly piiContractMustNotAlterDatesIntoFalseDeadlines: boolean;
  readonly piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion: boolean;
  readonly piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: boolean;
  readonly piiContractMustNotInferRecipientIdentityFromPartialText: boolean;
  readonly piiContractMustNotInferSenderIdentityFromPartialText: boolean;
  readonly piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: boolean;
  readonly piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: boolean;
  readonly piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: boolean;
  readonly piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: boolean;
  readonly piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: boolean;

  // 8.6B contract failure mode obligations
  readonly piiContractDefinesFailurePiiRedactionRequired: boolean;
  readonly piiContractDefinesFailurePiiRedactionIncomplete: boolean;
  readonly piiContractDefinesFailurePiiRedactionConfidenceLow: boolean;
  readonly piiContractDefinesFailurePiiRedactionUnsafeForModel: boolean;
  readonly piiContractDefinesFailureBlockedHighRiskIdentifier: boolean;
  readonly piiContractDefinesFailureBlockedMedicalIdentifier: boolean;
  readonly piiContractDefinesFailureBlockedImmigrationIdentifier: boolean;
  readonly piiContractDefinesFailureBlockedFinancialIdentifier: boolean;
  readonly piiContractDefinesFailureBlockedUnknownDocumentIdentity: boolean;

  // 8.6B contract downstream obligations
  readonly piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: boolean;
  readonly piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly: boolean;
  readonly piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: boolean;
  readonly piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly: boolean;
  readonly piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence: boolean;
  readonly piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: boolean;
  readonly piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: boolean;

  // 8.6B contract decision confirmations
  readonly piiContractAcceptsPlan: boolean;
  readonly piiContractReadyForFutureImplementationPlan: boolean;
  readonly piiContractDoesNotAuthorizeRuntimeImplementationNow: boolean;
  readonly piiContractDoesNotAuthorizePiiProcessingNow: boolean;
  readonly piiContractDoesNotAuthorizeRawPiiHandlingNow: boolean;
  readonly piiContractDoesNotAuthorizeDocumentProcessingNow: boolean;
  readonly piiContractDoesNotAuthorizePromptBuildNow: boolean;
  readonly piiContractDoesNotAuthorizeModelCallNow: boolean;
  readonly piiContractDoesNotAuthorizeRunSmartTalkNow: boolean;

  // 8.6B new actual flag
  readonly actualPiiRedactionContractOnly: boolean;

  // 8.6B no-prohibited-side-effect confirmations
  readonly piiContractConfirmsNoOpenAiCall: boolean;
  readonly piiContractConfirmsNoFetchCall: boolean;
  readonly piiContractConfirmsNoProcessEnvRead: boolean;
  readonly piiContractConfirmsNoSdkUsage: boolean;
  readonly piiContractConfirmsNo8x3AcRerun: boolean;
  readonly piiContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly piiContractConfirmsNoStripeCall: boolean;
  readonly piiContractConfirmsNoCheckoutCall: boolean;
  readonly piiContractConfirmsNoEntitlementRuntimeCall: boolean;
  readonly piiContractConfirmsNoServerEntitlementVerification: boolean;
  readonly piiContractConfirmsNoOcrRuntimeCall: boolean;
  readonly piiContractConfirmsNoStorageMutation: boolean;
  readonly piiContractConfirmsNoDatabaseWrite: boolean;
  readonly piiContractConfirmsNoAuditPersistence: boolean;
  readonly piiContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly piiContractConfirmsNoEvidenceEvaluation: boolean;
  readonly piiContractConfirmsNoClaimAuthorization: boolean;
  readonly piiContractConfirmsNoDeadlineCalculation: boolean;
  readonly piiContractConfirmsNoLegalCertainty: boolean;
  readonly piiContractConfirmsNoPromptBuild: boolean;
  readonly piiContractConfirmsNoModelCall: boolean;
  readonly piiContractConfirmsNoRunSmartTalkCall: boolean;
  readonly piiContractConfirmsNoRouteHandlerCall: boolean;
  readonly piiContractConfirmsNoRouteImport: boolean;
  readonly piiContractConfirmsNoFilesystemRead: boolean;
  readonly piiContractConfirmsNoPhotoRouteModification: boolean;

  // 8.6B TD result flags
  readonly td004PreModelPiiRedactionContracted: boolean;

  // 8.6B forward readiness
  readonly readyFor8x6CPreModelPiiRedactionImplementationPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPreModelPiiRedactionContractResult {
  readonly checkId: "8.6B";
  readonly allPassed: boolean;
  readonly preModelPiiRedactionPlanReadyForContract: true;
  readonly controlledRealDocumentPreModelPiiRedactionContractAccepted: boolean;
  readonly preModelPiiRedactionContractOnly: true;
  readonly preModelPiiRedactionContractDefined: true;
  readonly preModelPiiRedactionRuntimeStillNotImplemented: true;
  readonly preModelPiiDetectorRuntimeStillNotImplemented: true;
  readonly preModelPiiMaskingRuntimeStillNotImplemented: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true;
  readonly preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true;
  readonly preModelPiiRedactionDoesNotAuthorizePromptBuild: true;
  readonly preModelPiiRedactionDoesNotAuthorizeModelCall: true;
  readonly preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true;
  readonly tamperCasesRejected: boolean;

  // Contract boundary obligations
  readonly piiContractRequiresBoundaryBeforePromptBuild: true;
  readonly piiContractRequiresBoundaryBeforeModelCall: true;
  readonly piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: true;
  readonly piiContractRequiresBoundaryAfterControlledInputValidation: true;
  readonly piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: true;
  readonly piiContractDoesNotCreateFreeQaDocumentBypass: true;
  readonly piiContractDoesNotAuthorizeRealDocumentInput: true;
  readonly piiContractDoesNotAuthorizeUserVisibleDocumentOutput: true;
  readonly piiContractDoesNotAuthorizeExactDeadlineCalculation: true;
  readonly piiContractDoesNotAuthorizePublicRuntime: true;

  // Contract PII class coverage
  readonly piiContractCoversPersonNames: true;
  readonly piiContractCoversPostalAddresses: true;
  readonly piiContractCoversPhoneNumbers: true;
  readonly piiContractCoversEmailAddresses: true;
  readonly piiContractCoversDatesOfBirth: true;
  readonly piiContractCoversCustomerNumbers: true;
  readonly piiContractCoversInsuranceNumbers: true;
  readonly piiContractCoversHealthInsuranceIdentifiers: true;
  readonly piiContractCoversTaxIds: true;
  readonly piiContractCoversSteuerId: true;
  readonly piiContractCoversSteuernummer: true;
  readonly piiContractCoversAktenzeichen: true;
  readonly piiContractCoversVorgangsnummer: true;
  readonly piiContractCoversCaseReferenceNumbers: true;
  readonly piiContractCoversIban: true;
  readonly piiContractCoversBankAccountIdentifiers: true;
  readonly piiContractCoversLicensePlateNumbers: true;
  readonly piiContractCoversEmployerNamesInPersonalContext: true;
  readonly piiContractCoversSignatures: true;
  readonly piiContractCoversHandwrittenNames: true;
  readonly piiContractCoversGreetingsContainingPersonalNames: true;
  readonly piiContractCoversDocumentRecipientBlocks: true;
  readonly piiContractCoversSenderBlocks: true;
  readonly piiContractCoversRealContactDetails: true;
  readonly piiContractCoversRealAuthorityContactBlocksCopiedFromDocuments: true;
  readonly piiContractCoversMedicalHealthContextIdentifiers: true;
  readonly piiContractCoversImmigrationResidencePermitIdentifiers: true;
  readonly piiContractCoversSocialBenefitIdentifiers: true;
  readonly piiContractCoversJobcenterBuergergeldIdentifiers: true;
  readonly piiContractCoversFamilienkasseKindergeldIdentifiers: true;
  readonly piiContractCoversAuslaenderbehoerdeIdentifiers: true;
  readonly piiContractCoversFinanzamtIdentifiers: true;

  // Contract redaction/masking obligations
  readonly piiContractRequiresDeterministicPlaceholders: true;
  readonly piiContractRequiresStablePlaceholderMappingInsideOneRequest: true;
  readonly piiContractRequiresNoRawPiiPersistenceByDefault: true;
  readonly piiContractRequiresNoRawPiiInPrompt: true;
  readonly piiContractRequiresNoRawPiiInLogs: true;
  readonly piiContractRequiresNoRawPiiInAuditTraces: true;
  readonly piiContractRequiresNoRawPiiInUserVisibleErrorMessages: true;
  readonly piiContractRequiresNoRawPiiInTelemetry: true;
  readonly piiContractRequiresNoRawPiiInModelMetadata: true;
  readonly piiContractRequiresNoRawPiiInEvidenceGateTraces: true;
  readonly piiContractRequiresNoRawPiiInDeadlineTraces: true;
  readonly piiContractRequiresRawToPlaceholderMapLocalEphemeralByDefault: true;
  readonly piiContractRequiresStructuredRedactionAuditWithoutRawValues: true;
  readonly piiContractRequiresCoverageMetricsWithoutRawValues: true;
  readonly piiContractRequiresConservativeFallbackWhenConfidenceUncertain: true;
  readonly piiContractRequiresBlockOrEscalateIfUnsafeToRedact: true;

  // Contract placeholder obligations
  readonly piiContractAllowsPersonPlaceholder: true;
  readonly piiContractAllowsAddressPlaceholder: true;
  readonly piiContractAllowsPhonePlaceholder: true;
  readonly piiContractAllowsEmailPlaceholder: true;
  readonly piiContractAllowsDobPlaceholder: true;
  readonly piiContractAllowsCustomerIdPlaceholder: true;
  readonly piiContractAllowsInsuranceIdPlaceholder: true;
  readonly piiContractAllowsTaxIdPlaceholder: true;
  readonly piiContractAllowsCaseRefPlaceholder: true;
  readonly piiContractAllowsIbanPlaceholder: true;
  readonly piiContractAllowsAuthorityPlaceholder: true;
  readonly piiContractAllowsEmployerPlaceholder: true;
  readonly piiContractAllowsSignaturePlaceholder: true;
  readonly piiContractAllowsDocumentRecipientPlaceholder: true;
  readonly piiContractAllowsDocumentSenderPlaceholder: true;

  // Contract safety obligations
  readonly piiContractPreservesLegalSemanticStructureWherePossible: true;
  readonly piiContractMustNotInventMissingFacts: true;
  readonly piiContractMustNotAlterDatesIntoFalseDeadlines: true;
  readonly piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion: true;
  readonly piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: true;
  readonly piiContractMustNotInferRecipientIdentityFromPartialText: true;
  readonly piiContractMustNotInferSenderIdentityFromPartialText: true;
  readonly piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: true;
  readonly piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: true;
  readonly piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: true;
  readonly piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: true;
  readonly piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: true;

  // Contract failure mode obligations
  readonly piiContractDefinesFailurePiiRedactionRequired: true;
  readonly piiContractDefinesFailurePiiRedactionIncomplete: true;
  readonly piiContractDefinesFailurePiiRedactionConfidenceLow: true;
  readonly piiContractDefinesFailurePiiRedactionUnsafeForModel: true;
  readonly piiContractDefinesFailureBlockedHighRiskIdentifier: true;
  readonly piiContractDefinesFailureBlockedMedicalIdentifier: true;
  readonly piiContractDefinesFailureBlockedImmigrationIdentifier: true;
  readonly piiContractDefinesFailureBlockedFinancialIdentifier: true;
  readonly piiContractDefinesFailureBlockedUnknownDocumentIdentity: true;

  // Contract downstream obligations
  readonly piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: true;
  readonly piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly: true;
  readonly piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: true;
  readonly piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly: true;
  readonly piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence: true;
  readonly piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: true;
  readonly piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: true;

  // Contract decision confirmations
  readonly piiContractAcceptsPlan: true;
  readonly piiContractReadyForFutureImplementationPlan: true;
  readonly piiContractDoesNotAuthorizeRuntimeImplementationNow: true;
  readonly piiContractDoesNotAuthorizePiiProcessingNow: true;
  readonly piiContractDoesNotAuthorizeRawPiiHandlingNow: true;
  readonly piiContractDoesNotAuthorizeDocumentProcessingNow: true;
  readonly piiContractDoesNotAuthorizePromptBuildNow: true;
  readonly piiContractDoesNotAuthorizeModelCallNow: true;
  readonly piiContractDoesNotAuthorizeRunSmartTalkNow: true;

  // Actual mutation/runtime flags
  readonly actualPiiRedactionContractOnly: true;
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

  // No-prohibited-side-effect confirmations
  readonly piiContractConfirmsNoOpenAiCall: true;
  readonly piiContractConfirmsNoFetchCall: true;
  readonly piiContractConfirmsNoProcessEnvRead: true;
  readonly piiContractConfirmsNoSdkUsage: true;
  readonly piiContractConfirmsNo8x3AcRerun: true;
  readonly piiContractConfirmsNoPaymentRuntimeCall: true;
  readonly piiContractConfirmsNoStripeCall: true;
  readonly piiContractConfirmsNoCheckoutCall: true;
  readonly piiContractConfirmsNoEntitlementRuntimeCall: true;
  readonly piiContractConfirmsNoServerEntitlementVerification: true;
  readonly piiContractConfirmsNoOcrRuntimeCall: true;
  readonly piiContractConfirmsNoStorageMutation: true;
  readonly piiContractConfirmsNoDatabaseWrite: true;
  readonly piiContractConfirmsNoAuditPersistence: true;
  readonly piiContractConfirmsNoUserVisibleDocumentExplanation: true;
  readonly piiContractConfirmsNoEvidenceEvaluation: true;
  readonly piiContractConfirmsNoClaimAuthorization: true;
  readonly piiContractConfirmsNoDeadlineCalculation: true;
  readonly piiContractConfirmsNoLegalCertainty: true;
  readonly piiContractConfirmsNoPromptBuild: true;
  readonly piiContractConfirmsNoModelCall: true;
  readonly piiContractConfirmsNoRunSmartTalkCall: true;
  readonly piiContractConfirmsNoRouteHandlerCall: true;
  readonly piiContractConfirmsNoRouteImport: true;
  readonly piiContractConfirmsNoFilesystemRead: true;
  readonly piiContractConfirmsNoPhotoRouteModification: true;

  // Pipeline executed flags
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly piiPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly entitlementPipelineActuallyExecuted: false;
  readonly checkoutPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

  // Runtime authorization flags
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

  // Authorization grants
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Legal safety flags
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
  readonly readyFor8x6CPreModelPiiRedactionImplementationPlan: true;
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

function validatePiiRedactionContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.6A prerequisite gate — core
  if (o["prereqCheckId"] !== "8.6A") reasons.push("prereq_check_id_must_be_8x6A");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning"] !== true)
    reasons.push("prereq_boundary_closure_ready_for_pii_redaction_planning_false");
  if (o["controlledRealDocumentPreModelPiiRedactionPlanAccepted"] !== true)
    reasons.push("prereq_pii_redaction_plan_not_accepted");
  if (o["preModelPiiRedactionPlanningOnly"] !== true)
    reasons.push("prereq_pii_redaction_planning_only_false");
  if (o["preModelPiiRedactionPlanDefined"] !== true)
    reasons.push("prereq_pii_redaction_plan_defined_false");
  if (o["preModelPiiRedactionRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_pii_redaction_runtime_still_not_implemented_false");
  if (o["preModelPiiDetectorRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_pii_detector_runtime_still_not_implemented_false");
  if (o["preModelPiiMaskingRuntimeStillNotImplemented"] !== true)
    reasons.push("prereq_pii_masking_runtime_still_not_implemented_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRealDocumentInput"] !== true)
    reasons.push("prereq_pii_redaction_does_not_authorize_real_document_input_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput"] !== true)
    reasons.push("prereq_pii_redaction_does_not_authorize_user_visible_output_false");
  if (o["preModelPiiRedactionDoesNotAuthorizePromptBuild"] !== true)
    reasons.push("prereq_pii_redaction_does_not_authorize_prompt_build_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeModelCall"] !== true)
    reasons.push("prereq_pii_redaction_does_not_authorize_model_call_false");
  if (o["preModelPiiRedactionDoesNotAuthorizeRunSmartTalk"] !== true)
    reasons.push("prereq_pii_redaction_does_not_authorize_run_smart_talk_false");
  if (o["prereqTamperCasesRejected"] !== true)
    reasons.push("prereq_tamper_cases_rejected_false");

  // 8.6A planning confirmations
  if (o["piiPlanRequiresBoundaryBeforePromptBuild"] !== true) reasons.push("prereq_pii_plan_boundary_before_prompt_build_false");
  if (o["piiPlanRequiresBoundaryBeforeModelCall"] !== true) reasons.push("prereq_pii_plan_boundary_before_model_call_false");
  if (o["piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane"] !== true) reasons.push("prereq_pii_plan_boundary_before_run_smart_talk_document_lane_false");
  if (o["piiPlanRequiresBoundaryAfterControlledInputValidation"] !== true) reasons.push("prereq_pii_plan_boundary_after_controlled_input_validation_false");
  if (o["piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation"] !== true) reasons.push("prereq_pii_plan_boundary_before_evidence_gate_evaluation_false");
  if (o["piiPlanDoesNotCreateFreeQaDocumentBypass"] !== true) reasons.push("prereq_pii_plan_does_not_create_free_qa_document_bypass_false");
  if (o["piiPlanDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("prereq_pii_plan_does_not_authorize_real_document_input_false");
  if (o["piiPlanDoesNotAuthorizeUserVisibleDocumentOutput"] !== true) reasons.push("prereq_pii_plan_does_not_authorize_user_visible_document_output_false");
  if (o["piiPlanDoesNotAuthorizeExactDeadlineCalculation"] !== true) reasons.push("prereq_pii_plan_does_not_authorize_exact_deadline_calculation_false");
  if (o["piiPlanDoesNotAuthorizePublicRuntime"] !== true) reasons.push("prereq_pii_plan_does_not_authorize_public_runtime_false");

  // 8.6A PII class coverage (32)
  const piiClasses = ["PersonNames","PostalAddresses","PhoneNumbers","EmailAddresses","DatesOfBirth","CustomerNumbers","InsuranceNumbers","HealthInsuranceIdentifiers","TaxIds","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumbers","Iban","BankAccountIdentifiers","LicensePlateNumbers","EmployerNamesInPersonalContext","Signatures","HandwrittenNames","GreetingsContainingPersonalNames","DocumentRecipientBlocks","SenderBlocks","RealContactDetails","RealAuthorityContactBlocksCopiedFromDocuments","MedicalHealthContextIdentifiers","ImmigrationResidencePermitIdentifiers","SocialBenefitIdentifiers","JobcenterBuergergeldIdentifiers","FamilienkasseKindergeldIdentifiers","AuslaenderbehoerdeIdentifiers","FinanzamtIdentifiers"];
  for (const cls of piiClasses) {
    const key = `piiPlanCovers${cls}`;
    if (o[key] !== true) reasons.push(`prereq_${key}_false`);
  }

  // 8.6A redaction/masking requirements (16)
  const redactionReqs = ["DeterministicPlaceholders","StablePlaceholderMappingInsideOneRequest","NoRawPiiPersistenceByDefault","NoRawPiiInPrompt","NoRawPiiInLogs","NoRawPiiInAuditTraces","NoRawPiiInUserVisibleErrorMessages","NoRawPiiInTelemetry","NoRawPiiInModelMetadata","NoRawPiiInEvidenceGateTraces","NoRawPiiInDeadlineTraces","RawToPlaceholderMapLocalEphemeralByDefault","StructuredRedactionAuditWithoutRawValues","CoverageMetricsWithoutRawValues","ConservativeFallbackWhenConfidenceUncertain","BlockOrEscalateIfUnsafeToRedact"];
  for (const req of redactionReqs) {
    const key = `piiPlanRequires${req}`;
    if (o[key] !== true) reasons.push(`prereq_${key}_false`);
  }

  // 8.6A placeholder confirmations (15)
  const placeholders = ["Person","Address","Phone","Email","Dob","CustomerId","InsuranceId","TaxId","CaseRef","Iban","Authority","Employer","Signature","DocumentRecipient","DocumentSender"];
  for (const ph of placeholders) {
    const key = `piiPlanAllows${ph}Placeholder`;
    if (o[key] !== true) reasons.push(`prereq_${key}_false`);
  }

  // 8.6A safety confirmations (12)
  const safetyKeys = ["piiPlanPreservesLegalSemanticStructureWherePossible","piiPlanMustNotInventMissingFacts","piiPlanMustNotAlterDatesIntoFalseDeadlines","piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion","piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity","piiPlanMustNotInferRecipientIdentityFromPartialText","piiPlanMustNotInferSenderIdentityFromPartialText","piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone","piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice","piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation","piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer","piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation"];
  for (const k of safetyKeys) {
    if (o[k] !== true) reasons.push(`prereq_${k}_false`);
  }

  // 8.6A failure mode confirmations (9)
  const failureModes = ["PiiRedactionRequired","PiiRedactionIncomplete","PiiRedactionConfidenceLow","PiiRedactionUnsafeForModel","BlockedHighRiskIdentifier","BlockedMedicalIdentifier","BlockedImmigrationIdentifier","BlockedFinancialIdentifier","BlockedUnknownDocumentIdentity"];
  for (const fm of failureModes) {
    const key = `piiPlanDefinesFailure${fm}`;
    if (o[key] !== true) reasons.push(`prereq_${key}_false`);
  }

  // 8.6A downstream confirmations (7)
  const downstreamKeys = ["piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly","piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly","piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized","piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly","piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence","piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized","piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts"];
  for (const k of downstreamKeys) {
    if (o[k] !== true) reasons.push(`prereq_${k}_false`);
  }

  // 8.6A actual flags
  if (o["actualPiiRedactionPlanOnly"] !== true) reasons.push("prereq_actual_pii_redaction_plan_only_must_be_true");
  if (o["actualPiiRedactionImplemented"] !== false) reasons.push("prereq_actual_pii_redaction_implemented_must_be_false");
  if (o["actualPiiDetectorRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_detector_runtime_implemented_must_be_false");
  if (o["actualPiiMaskingRuntimeImplemented"] !== false) reasons.push("prereq_actual_pii_masking_runtime_implemented_must_be_false");
  if (o["actualPiiTextRedacted"] !== false) reasons.push("prereq_actual_pii_text_redacted_must_be_false");
  if (o["actualRawPiiProcessed"] !== false) reasons.push("prereq_actual_raw_pii_processed_must_be_false");
  if (o["actualRawPiiPersisted"] !== false) reasons.push("prereq_actual_raw_pii_persisted_must_be_false");
  if (o["actualRawPiiLogged"] !== false) reasons.push("prereq_actual_raw_pii_logged_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false) reasons.push("prereq_actual_prompt_build_performed_must_be_false");
  if (o["actualModelCallPerformed"] !== false) reasons.push("prereq_actual_model_call_performed_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false) reasons.push("prereq_actual_run_smart_talk_called_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false) reasons.push("prereq_actual_evidence_gate_runtime_wiring_performed_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false) reasons.push("prereq_actual_claim_authorization_performed_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false) reasons.push("prereq_actual_deadline_calculation_performed_must_be_false");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false) reasons.push("prereq_actual_live_route_mutation_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false) reasons.push("prereq_actual_photo_route_modified_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false) reasons.push("prereq_actual_paid_document_mode_implemented_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false) reasons.push("prereq_actual_payment_runtime_implemented_must_be_false");
  if (o["actualCheckoutImplemented"] !== false) reasons.push("prereq_actual_checkout_implemented_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false) reasons.push("prereq_actual_entitlement_runtime_implemented_must_be_false");
  if (o["actualServerEntitlementVerificationImplemented"] !== false) reasons.push("prereq_actual_server_entitlement_verification_implemented_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false) reasons.push("prereq_actual_real_document_input_performed_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false) reasons.push("prereq_actual_real_document_processing_performed_must_be_false");
  if (o["actualOcrPerformed"] !== false) reasons.push("prereq_actual_ocr_performed_must_be_false");
  if (o["actualPhotoInputProcessed"] !== false) reasons.push("prereq_actual_photo_input_processed_must_be_false");
  if (o["actualFileInputProcessed"] !== false) reasons.push("prereq_actual_file_input_processed_must_be_false");
  if (o["actualDocumentStoragePerformed"] !== false) reasons.push("prereq_actual_document_storage_performed_must_be_false");
  if (o["actualDatabasePersistencePerformed"] !== false) reasons.push("prereq_actual_database_persistence_performed_must_be_false");
  if (o["actualAuditPersistencePerformed"] !== false) reasons.push("prereq_actual_audit_persistence_performed_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false) reasons.push("prereq_actual_user_visible_output_performed_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false) reasons.push("prereq_actual_public_runtime_enabled_must_be_false");

  // 8.6A no-prohibited-side-effect confirmations (26)
  const planSideEffects = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"];
  for (const se of planSideEffects) {
    const key = `piiPlanConfirms${se}`;
    if (o[key] !== true) reasons.push(`prereq_${key}_false`);
  }

  // Pipeline executed flags (all false)
  const pipelineFlags = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"];
  for (const f of pipelineFlags) {
    if (o[f] !== false) reasons.push(`prereq_${f}_must_be_false`);
  }

  // Runtime authorization flags (all false)
  const runtimeAuthFlags = ["preModelPiiRedactionRuntimeAuthorizedNow","realDocumentInputAuthorizedNow","realDocumentProcessingAuthorizedNow","realUserDocumentUploadAuthorizedNow","ocrRuntimeAuthorizedNow","photoInputAuthorizedNow","fileInputAuthorizedNow","documentStorageAuthorizedNow","persistenceAuthorizedNow","publicRuntimeAuthorizedNow","userVisibleLegalDeadlineOutputAuthorizedNow","liveLLMRuntimeAuthorizedNow","connectedAiRuntimeAuthorizedNow","pilotRuntimeAuthorizedNow","productionRuntimeAuthorizedNow","paidDocumentModeRuntimeAuthorizedNow","paymentRuntimeAuthorizedNow","entitlementRuntimeAuthorizedNow","checkoutRuntimeAuthorizedNow"];
  for (const f of runtimeAuthFlags) {
    if (o[f] !== false) reasons.push(`prereq_${f}_must_be_false`);
  }

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("prereq_runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("prereq_pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("prereq_production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("prereq_final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("prereq_go_live_authorization_granted_must_be_false");

  // Legal safety flags
  if (o["exactDeadlineCalculationAuthorized"] !== false) reasons.push("prereq_exact_deadline_calculation_authorized_must_be_false");
  if (o["deliveryDateInventionAuthorized"] !== false) reasons.push("prereq_delivery_date_invention_authorized_must_be_false");
  if (o["finalDateInventionAuthorized"] !== false) reasons.push("prereq_final_date_invention_authorized_must_be_false");
  if (o["legalCertaintyAuthorized"] !== false) reasons.push("prereq_legal_certainty_authorized_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false) reasons.push("prereq_coercive_legal_instruction_authorized_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true) reasons.push("prereq_delivery_date_required_for_exact_deadline_false");

  // TD flags
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true) reasons.push("prereq_td001_false");
  if (o["td005PaidDocumentModeBoundaryContainmentClosed"] !== true) reasons.push("prereq_td005_boundary_containment_closed_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosed"] !== true) reasons.push("prereq_td005_client_flag_bypass_closed_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferred"] !== true) reasons.push("prereq_td005_actual_runtime_implementation_deferred_false");
  if (o["td004PreModelPiiRedactionPlanned"] !== true) reasons.push("prereq_td004_pre_model_pii_redaction_planned_must_be_true");
  if (o["td004PreModelPiiRedactionStillRequiresContract"] !== true) reasons.push("prereq_td004_still_requires_contract_must_be_true");
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

  // 8.6A forward readiness gate
  if (o["readyFor8x6BPreModelPiiRedactionContract"] !== true) reasons.push("prereq_ready_for_8x6b_contract_false");
  if (o["readyForEvidenceGatesProductionWiringPhase"] !== false) reasons.push("prereq_ready_for_evidence_gates_must_be_false");
  if (o["readyForServerEntitlementVerificationPhase"] !== false) reasons.push("prereq_ready_for_server_entitlement_verification_must_be_false");
  if (o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] !== false) reasons.push("prereq_ready_for_paid_document_mode_actual_runtime_must_be_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_separate_runtime_authorization_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_pilot_authorization_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false) reasons.push("prereq_ready_for_production_authorization_must_be_false");
  if (o["readyForRealDocumentInput"] !== false) reasons.push("prereq_ready_for_real_document_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false) reasons.push("prereq_ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false) reasons.push("prereq_public_runtime_enabled_must_be_false");
  if (o["persistenceUsed"] !== false) reasons.push("prereq_persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true) reasons.push("prereq_never_user_visible_must_be_true");

  // 8.6B core assertion flags
  if (o["preModelPiiRedactionPlanReadyForContract"] !== true) reasons.push("pii_redaction_plan_ready_for_contract_false");
  if (o["preModelPiiRedactionContractOnly"] !== true) reasons.push("pii_redaction_contract_only_false");
  if (o["preModelPiiRedactionContractDefined"] !== true) reasons.push("pii_redaction_contract_defined_false");

  // 8.6B contract boundary obligations (10)
  if (o["piiContractRequiresBoundaryBeforePromptBuild"] !== true) reasons.push("pii_contract_boundary_before_prompt_build_false");
  if (o["piiContractRequiresBoundaryBeforeModelCall"] !== true) reasons.push("pii_contract_boundary_before_model_call_false");
  if (o["piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane"] !== true) reasons.push("pii_contract_boundary_before_run_smart_talk_document_lane_false");
  if (o["piiContractRequiresBoundaryAfterControlledInputValidation"] !== true) reasons.push("pii_contract_boundary_after_controlled_input_validation_false");
  if (o["piiContractRequiresBoundaryBeforeEvidenceGateEvaluation"] !== true) reasons.push("pii_contract_boundary_before_evidence_gate_evaluation_false");
  if (o["piiContractDoesNotCreateFreeQaDocumentBypass"] !== true) reasons.push("pii_contract_does_not_create_free_qa_document_bypass_false");
  if (o["piiContractDoesNotAuthorizeRealDocumentInput"] !== true) reasons.push("pii_contract_does_not_authorize_real_document_input_false");
  if (o["piiContractDoesNotAuthorizeUserVisibleDocumentOutput"] !== true) reasons.push("pii_contract_does_not_authorize_user_visible_document_output_false");
  if (o["piiContractDoesNotAuthorizeExactDeadlineCalculation"] !== true) reasons.push("pii_contract_does_not_authorize_exact_deadline_calculation_false");
  if (o["piiContractDoesNotAuthorizePublicRuntime"] !== true) reasons.push("pii_contract_does_not_authorize_public_runtime_false");

  // 8.6B contract PII class coverage (32)
  for (const cls of piiClasses) {
    const key = `piiContractCovers${cls}`;
    if (o[key] !== true) reasons.push(`${key}_false`);
  }

  // 8.6B contract redaction/masking obligations (16)
  for (const req of redactionReqs) {
    const key = `piiContractRequires${req}`;
    if (o[key] !== true) reasons.push(`${key}_false`);
  }

  // 8.6B contract placeholder obligations (15)
  for (const ph of placeholders) {
    const key = `piiContractAllows${ph}Placeholder`;
    if (o[key] !== true) reasons.push(`${key}_false`);
  }

  // 8.6B contract safety obligations (12)
  const contractSafetyKeys = ["piiContractPreservesLegalSemanticStructureWherePossible","piiContractMustNotInventMissingFacts","piiContractMustNotAlterDatesIntoFalseDeadlines","piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion","piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity","piiContractMustNotInferRecipientIdentityFromPartialText","piiContractMustNotInferSenderIdentityFromPartialText","piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone","piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice","piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation","piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer","piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation"];
  for (const k of contractSafetyKeys) {
    if (o[k] !== true) reasons.push(`${k}_false`);
  }

  // 8.6B contract failure mode obligations (9)
  for (const fm of failureModes) {
    const key = `piiContractDefinesFailure${fm}`;
    if (o[key] !== true) reasons.push(`${key}_false`);
  }

  // 8.6B contract downstream obligations (7)
  const contractDownstreamKeys = ["piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly","piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly","piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized","piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly","piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence","piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized","piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts"];
  for (const k of contractDownstreamKeys) {
    if (o[k] !== true) reasons.push(`${k}_false`);
  }

  // 8.6B contract decision confirmations (9)
  if (o["piiContractAcceptsPlan"] !== true) reasons.push("pii_contract_accepts_plan_false");
  if (o["piiContractReadyForFutureImplementationPlan"] !== true) reasons.push("pii_contract_ready_for_future_implementation_plan_false");
  if (o["piiContractDoesNotAuthorizeRuntimeImplementationNow"] !== true) reasons.push("pii_contract_does_not_authorize_runtime_implementation_now_false");
  if (o["piiContractDoesNotAuthorizePiiProcessingNow"] !== true) reasons.push("pii_contract_does_not_authorize_pii_processing_now_false");
  if (o["piiContractDoesNotAuthorizeRawPiiHandlingNow"] !== true) reasons.push("pii_contract_does_not_authorize_raw_pii_handling_now_false");
  if (o["piiContractDoesNotAuthorizeDocumentProcessingNow"] !== true) reasons.push("pii_contract_does_not_authorize_document_processing_now_false");
  if (o["piiContractDoesNotAuthorizePromptBuildNow"] !== true) reasons.push("pii_contract_does_not_authorize_prompt_build_now_false");
  if (o["piiContractDoesNotAuthorizeModelCallNow"] !== true) reasons.push("pii_contract_does_not_authorize_model_call_now_false");
  if (o["piiContractDoesNotAuthorizeRunSmartTalkNow"] !== true) reasons.push("pii_contract_does_not_authorize_run_smart_talk_now_false");

  // 8.6B new actual flag
  if (o["actualPiiRedactionContractOnly"] !== true) reasons.push("actual_pii_redaction_contract_only_must_be_true");

  // 8.6B no-prohibited-side-effect confirmations (26)
  const contractSideEffects = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"];
  for (const se of contractSideEffects) {
    const key = `piiContractConfirms${se}`;
    if (o[key] !== true) reasons.push(`${key}_false`);
  }

  // 8.6B TD result flags
  if (o["td004PreModelPiiRedactionContracted"] !== true) reasons.push("td004_pre_model_pii_redaction_contracted_false");

  // 8.6B forward readiness
  if (o["readyFor8x6CPreModelPiiRedactionImplementationPlan"] !== true) reasons.push("ready_for_8x6c_implementation_plan_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.6B input ──────────────────────────────────────────────────────

function buildCanonical8x6BInput(): ControlledRealDocumentPreModelPiiRedactionContractInput {
  const pr = runControlledRealDocumentPreModelPiiRedactionPlan();
  return {
    // 8.6A prerequisite gate — core
    prereqCheckId: pr.checkId,
    prereqAllPassed: pr.allPassed,
    paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: pr.paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning,
    controlledRealDocumentPreModelPiiRedactionPlanAccepted: pr.controlledRealDocumentPreModelPiiRedactionPlanAccepted,
    preModelPiiRedactionPlanningOnly: pr.preModelPiiRedactionPlanningOnly,
    preModelPiiRedactionPlanDefined: pr.preModelPiiRedactionPlanDefined,
    preModelPiiRedactionRuntimeStillNotImplemented: pr.preModelPiiRedactionRuntimeStillNotImplemented,
    preModelPiiDetectorRuntimeStillNotImplemented: pr.preModelPiiDetectorRuntimeStillNotImplemented,
    preModelPiiMaskingRuntimeStillNotImplemented: pr.preModelPiiMaskingRuntimeStillNotImplemented,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: pr.preModelPiiRedactionDoesNotAuthorizeRealDocumentInput,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: pr.preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: pr.preModelPiiRedactionDoesNotAuthorizePromptBuild,
    preModelPiiRedactionDoesNotAuthorizeModelCall: pr.preModelPiiRedactionDoesNotAuthorizeModelCall,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: pr.preModelPiiRedactionDoesNotAuthorizeRunSmartTalk,
    prereqTamperCasesRejected: pr.tamperCasesRejected,

    // 8.6A planning confirmations
    piiPlanRequiresBoundaryBeforePromptBuild: pr.piiPlanRequiresBoundaryBeforePromptBuild,
    piiPlanRequiresBoundaryBeforeModelCall: pr.piiPlanRequiresBoundaryBeforeModelCall,
    piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: pr.piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane,
    piiPlanRequiresBoundaryAfterControlledInputValidation: pr.piiPlanRequiresBoundaryAfterControlledInputValidation,
    piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: pr.piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation,
    piiPlanDoesNotCreateFreeQaDocumentBypass: pr.piiPlanDoesNotCreateFreeQaDocumentBypass,
    piiPlanDoesNotAuthorizeRealDocumentInput: pr.piiPlanDoesNotAuthorizeRealDocumentInput,
    piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: pr.piiPlanDoesNotAuthorizeUserVisibleDocumentOutput,
    piiPlanDoesNotAuthorizeExactDeadlineCalculation: pr.piiPlanDoesNotAuthorizeExactDeadlineCalculation,
    piiPlanDoesNotAuthorizePublicRuntime: pr.piiPlanDoesNotAuthorizePublicRuntime,

    // 8.6A PII class coverage
    piiPlanCoversPersonNames: pr.piiPlanCoversPersonNames,
    piiPlanCoversPostalAddresses: pr.piiPlanCoversPostalAddresses,
    piiPlanCoversPhoneNumbers: pr.piiPlanCoversPhoneNumbers,
    piiPlanCoversEmailAddresses: pr.piiPlanCoversEmailAddresses,
    piiPlanCoversDatesOfBirth: pr.piiPlanCoversDatesOfBirth,
    piiPlanCoversCustomerNumbers: pr.piiPlanCoversCustomerNumbers,
    piiPlanCoversInsuranceNumbers: pr.piiPlanCoversInsuranceNumbers,
    piiPlanCoversHealthInsuranceIdentifiers: pr.piiPlanCoversHealthInsuranceIdentifiers,
    piiPlanCoversTaxIds: pr.piiPlanCoversTaxIds,
    piiPlanCoversSteuerId: pr.piiPlanCoversSteuerId,
    piiPlanCoversSteuernummer: pr.piiPlanCoversSteuernummer,
    piiPlanCoversAktenzeichen: pr.piiPlanCoversAktenzeichen,
    piiPlanCoversVorgangsnummer: pr.piiPlanCoversVorgangsnummer,
    piiPlanCoversCaseReferenceNumbers: pr.piiPlanCoversCaseReferenceNumbers,
    piiPlanCoversIban: pr.piiPlanCoversIban,
    piiPlanCoversBankAccountIdentifiers: pr.piiPlanCoversBankAccountIdentifiers,
    piiPlanCoversLicensePlateNumbers: pr.piiPlanCoversLicensePlateNumbers,
    piiPlanCoversEmployerNamesInPersonalContext: pr.piiPlanCoversEmployerNamesInPersonalContext,
    piiPlanCoversSignatures: pr.piiPlanCoversSignatures,
    piiPlanCoversHandwrittenNames: pr.piiPlanCoversHandwrittenNames,
    piiPlanCoversGreetingsContainingPersonalNames: pr.piiPlanCoversGreetingsContainingPersonalNames,
    piiPlanCoversDocumentRecipientBlocks: pr.piiPlanCoversDocumentRecipientBlocks,
    piiPlanCoversSenderBlocks: pr.piiPlanCoversSenderBlocks,
    piiPlanCoversRealContactDetails: pr.piiPlanCoversRealContactDetails,
    piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments: pr.piiPlanCoversRealAuthorityContactBlocksCopiedFromDocuments,
    piiPlanCoversMedicalHealthContextIdentifiers: pr.piiPlanCoversMedicalHealthContextIdentifiers,
    piiPlanCoversImmigrationResidencePermitIdentifiers: pr.piiPlanCoversImmigrationResidencePermitIdentifiers,
    piiPlanCoversSocialBenefitIdentifiers: pr.piiPlanCoversSocialBenefitIdentifiers,
    piiPlanCoversJobcenterBuergergeldIdentifiers: pr.piiPlanCoversJobcenterBuergergeldIdentifiers,
    piiPlanCoversFamilienkasseKindergeldIdentifiers: pr.piiPlanCoversFamilienkasseKindergeldIdentifiers,
    piiPlanCoversAuslaenderbehoerdeIdentifiers: pr.piiPlanCoversAuslaenderbehoerdeIdentifiers,
    piiPlanCoversFinanzamtIdentifiers: pr.piiPlanCoversFinanzamtIdentifiers,

    // 8.6A redaction/masking requirements
    piiPlanRequiresDeterministicPlaceholders: pr.piiPlanRequiresDeterministicPlaceholders,
    piiPlanRequiresStablePlaceholderMappingInsideOneRequest: pr.piiPlanRequiresStablePlaceholderMappingInsideOneRequest,
    piiPlanRequiresNoRawPiiPersistenceByDefault: pr.piiPlanRequiresNoRawPiiPersistenceByDefault,
    piiPlanRequiresNoRawPiiInPrompt: pr.piiPlanRequiresNoRawPiiInPrompt,
    piiPlanRequiresNoRawPiiInLogs: pr.piiPlanRequiresNoRawPiiInLogs,
    piiPlanRequiresNoRawPiiInAuditTraces: pr.piiPlanRequiresNoRawPiiInAuditTraces,
    piiPlanRequiresNoRawPiiInUserVisibleErrorMessages: pr.piiPlanRequiresNoRawPiiInUserVisibleErrorMessages,
    piiPlanRequiresNoRawPiiInTelemetry: pr.piiPlanRequiresNoRawPiiInTelemetry,
    piiPlanRequiresNoRawPiiInModelMetadata: pr.piiPlanRequiresNoRawPiiInModelMetadata,
    piiPlanRequiresNoRawPiiInEvidenceGateTraces: pr.piiPlanRequiresNoRawPiiInEvidenceGateTraces,
    piiPlanRequiresNoRawPiiInDeadlineTraces: pr.piiPlanRequiresNoRawPiiInDeadlineTraces,
    piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault: pr.piiPlanRequiresRawToPlaceholderMapLocalEphemeralByDefault,
    piiPlanRequiresStructuredRedactionAuditWithoutRawValues: pr.piiPlanRequiresStructuredRedactionAuditWithoutRawValues,
    piiPlanRequiresCoverageMetricsWithoutRawValues: pr.piiPlanRequiresCoverageMetricsWithoutRawValues,
    piiPlanRequiresConservativeFallbackWhenConfidenceUncertain: pr.piiPlanRequiresConservativeFallbackWhenConfidenceUncertain,
    piiPlanRequiresBlockOrEscalateIfUnsafeToRedact: pr.piiPlanRequiresBlockOrEscalateIfUnsafeToRedact,

    // 8.6A placeholder confirmations
    piiPlanAllowsPersonPlaceholder: pr.piiPlanAllowsPersonPlaceholder,
    piiPlanAllowsAddressPlaceholder: pr.piiPlanAllowsAddressPlaceholder,
    piiPlanAllowsPhonePlaceholder: pr.piiPlanAllowsPhonePlaceholder,
    piiPlanAllowsEmailPlaceholder: pr.piiPlanAllowsEmailPlaceholder,
    piiPlanAllowsDobPlaceholder: pr.piiPlanAllowsDobPlaceholder,
    piiPlanAllowsCustomerIdPlaceholder: pr.piiPlanAllowsCustomerIdPlaceholder,
    piiPlanAllowsInsuranceIdPlaceholder: pr.piiPlanAllowsInsuranceIdPlaceholder,
    piiPlanAllowsTaxIdPlaceholder: pr.piiPlanAllowsTaxIdPlaceholder,
    piiPlanAllowsCaseRefPlaceholder: pr.piiPlanAllowsCaseRefPlaceholder,
    piiPlanAllowsIbanPlaceholder: pr.piiPlanAllowsIbanPlaceholder,
    piiPlanAllowsAuthorityPlaceholder: pr.piiPlanAllowsAuthorityPlaceholder,
    piiPlanAllowsEmployerPlaceholder: pr.piiPlanAllowsEmployerPlaceholder,
    piiPlanAllowsSignaturePlaceholder: pr.piiPlanAllowsSignaturePlaceholder,
    piiPlanAllowsDocumentRecipientPlaceholder: pr.piiPlanAllowsDocumentRecipientPlaceholder,
    piiPlanAllowsDocumentSenderPlaceholder: pr.piiPlanAllowsDocumentSenderPlaceholder,

    // 8.6A safety confirmations
    piiPlanPreservesLegalSemanticStructureWherePossible: pr.piiPlanPreservesLegalSemanticStructureWherePossible,
    piiPlanMustNotInventMissingFacts: pr.piiPlanMustNotInventMissingFacts,
    piiPlanMustNotAlterDatesIntoFalseDeadlines: pr.piiPlanMustNotAlterDatesIntoFalseDeadlines,
    piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion: pr.piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion,
    piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: pr.piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity,
    piiPlanMustNotInferRecipientIdentityFromPartialText: pr.piiPlanMustNotInferRecipientIdentityFromPartialText,
    piiPlanMustNotInferSenderIdentityFromPartialText: pr.piiPlanMustNotInferSenderIdentityFromPartialText,
    piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: pr.piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone,
    piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: pr.piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice,
    piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: pr.piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation,
    piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: pr.piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer,
    piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: pr.piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation,

    // 8.6A failure mode confirmations
    piiPlanDefinesFailurePiiRedactionRequired: pr.piiPlanDefinesFailurePiiRedactionRequired,
    piiPlanDefinesFailurePiiRedactionIncomplete: pr.piiPlanDefinesFailurePiiRedactionIncomplete,
    piiPlanDefinesFailurePiiRedactionConfidenceLow: pr.piiPlanDefinesFailurePiiRedactionConfidenceLow,
    piiPlanDefinesFailurePiiRedactionUnsafeForModel: pr.piiPlanDefinesFailurePiiRedactionUnsafeForModel,
    piiPlanDefinesFailureBlockedHighRiskIdentifier: pr.piiPlanDefinesFailureBlockedHighRiskIdentifier,
    piiPlanDefinesFailureBlockedMedicalIdentifier: pr.piiPlanDefinesFailureBlockedMedicalIdentifier,
    piiPlanDefinesFailureBlockedImmigrationIdentifier: pr.piiPlanDefinesFailureBlockedImmigrationIdentifier,
    piiPlanDefinesFailureBlockedFinancialIdentifier: pr.piiPlanDefinesFailureBlockedFinancialIdentifier,
    piiPlanDefinesFailureBlockedUnknownDocumentIdentity: pr.piiPlanDefinesFailureBlockedUnknownDocumentIdentity,

    // 8.6A downstream confirmations
    piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: pr.piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly,
    piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly: pr.piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly,
    piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: pr.piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized,
    piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly: pr.piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly,
    piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence: pr.piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence,
    piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: pr.piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized,
    piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: pr.piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts,

    // 8.6A actual flags
    actualPiiRedactionPlanOnly: pr.actualPiiRedactionPlanOnly,
    actualPiiRedactionImplemented: pr.actualPiiRedactionImplemented,
    actualPiiDetectorRuntimeImplemented: pr.actualPiiDetectorRuntimeImplemented,
    actualPiiMaskingRuntimeImplemented: pr.actualPiiMaskingRuntimeImplemented,
    actualPiiTextRedacted: pr.actualPiiTextRedacted,
    actualRawPiiProcessed: pr.actualRawPiiProcessed,
    actualRawPiiPersisted: pr.actualRawPiiPersisted,
    actualRawPiiLogged: pr.actualRawPiiLogged,
    actualPromptBuildPerformed: pr.actualPromptBuildPerformed,
    actualModelCallPerformed: pr.actualModelCallPerformed,
    actualRunSmartTalkCalled: pr.actualRunSmartTalkCalled,
    actualEvidenceGateRuntimeWiringPerformed: pr.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: pr.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: pr.actualDeadlineCalculationPerformed,
    actualLiveRouteMutationPerformedInThisPhase: pr.actualLiveRouteMutationPerformedInThisPhase,
    actualSmartTalkRouteModifiedInThisPhase: pr.actualSmartTalkRouteModifiedInThisPhase,
    actualPhotoRouteModifiedInThisPhase: pr.actualPhotoRouteModifiedInThisPhase,
    actualPaidDocumentModeImplemented: pr.actualPaidDocumentModeImplemented,
    actualPaymentRuntimeImplemented: pr.actualPaymentRuntimeImplemented,
    actualCheckoutImplemented: pr.actualCheckoutImplemented,
    actualEntitlementRuntimeImplemented: pr.actualEntitlementRuntimeImplemented,
    actualServerEntitlementVerificationImplemented: pr.actualServerEntitlementVerificationImplemented,
    actualRealDocumentInputPerformed: pr.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: pr.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: pr.actualOcrPerformed,
    actualPhotoInputProcessed: pr.actualPhotoInputProcessed,
    actualFileInputProcessed: pr.actualFileInputProcessed,
    actualDocumentStoragePerformed: pr.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: pr.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: pr.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: pr.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: pr.actualPublicRuntimeEnabled,

    // 8.6A no-prohibited-side-effect confirmations
    piiPlanConfirmsNoOpenAiCall: pr.piiPlanConfirmsNoOpenAiCall,
    piiPlanConfirmsNoFetchCall: pr.piiPlanConfirmsNoFetchCall,
    piiPlanConfirmsNoProcessEnvRead: pr.piiPlanConfirmsNoProcessEnvRead,
    piiPlanConfirmsNoSdkUsage: pr.piiPlanConfirmsNoSdkUsage,
    piiPlanConfirmsNo8x3AcRerun: pr.piiPlanConfirmsNo8x3AcRerun,
    piiPlanConfirmsNoPaymentRuntimeCall: pr.piiPlanConfirmsNoPaymentRuntimeCall,
    piiPlanConfirmsNoStripeCall: pr.piiPlanConfirmsNoStripeCall,
    piiPlanConfirmsNoCheckoutCall: pr.piiPlanConfirmsNoCheckoutCall,
    piiPlanConfirmsNoEntitlementRuntimeCall: pr.piiPlanConfirmsNoEntitlementRuntimeCall,
    piiPlanConfirmsNoServerEntitlementVerification: pr.piiPlanConfirmsNoServerEntitlementVerification,
    piiPlanConfirmsNoOcrRuntimeCall: pr.piiPlanConfirmsNoOcrRuntimeCall,
    piiPlanConfirmsNoStorageMutation: pr.piiPlanConfirmsNoStorageMutation,
    piiPlanConfirmsNoDatabaseWrite: pr.piiPlanConfirmsNoDatabaseWrite,
    piiPlanConfirmsNoAuditPersistence: pr.piiPlanConfirmsNoAuditPersistence,
    piiPlanConfirmsNoUserVisibleDocumentExplanation: pr.piiPlanConfirmsNoUserVisibleDocumentExplanation,
    piiPlanConfirmsNoEvidenceEvaluation: pr.piiPlanConfirmsNoEvidenceEvaluation,
    piiPlanConfirmsNoClaimAuthorization: pr.piiPlanConfirmsNoClaimAuthorization,
    piiPlanConfirmsNoDeadlineCalculation: pr.piiPlanConfirmsNoDeadlineCalculation,
    piiPlanConfirmsNoLegalCertainty: pr.piiPlanConfirmsNoLegalCertainty,
    piiPlanConfirmsNoPromptBuild: pr.piiPlanConfirmsNoPromptBuild,
    piiPlanConfirmsNoModelCall: pr.piiPlanConfirmsNoModelCall,
    piiPlanConfirmsNoRunSmartTalkCall: pr.piiPlanConfirmsNoRunSmartTalkCall,
    piiPlanConfirmsNoRouteHandlerCall: pr.piiPlanConfirmsNoRouteHandlerCall,
    piiPlanConfirmsNoRouteImport: pr.piiPlanConfirmsNoRouteImport,
    piiPlanConfirmsNoFilesystemRead: pr.piiPlanConfirmsNoFilesystemRead,
    piiPlanConfirmsNoPhotoRouteModification: pr.piiPlanConfirmsNoPhotoRouteModification,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: pr.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: pr.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: pr.documentPipelineActuallyExecuted,
    piiPipelineActuallyExecuted: pr.piiPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: pr.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: pr.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: pr.checkoutPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: pr.ocrPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: pr.userVisiblePipelineActuallyExecuted,

    // Runtime authorization flags
    preModelPiiRedactionRuntimeAuthorizedNow: pr.preModelPiiRedactionRuntimeAuthorizedNow,
    realDocumentInputAuthorizedNow: pr.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: pr.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: pr.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: pr.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: pr.photoInputAuthorizedNow,
    fileInputAuthorizedNow: pr.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: pr.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: pr.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: pr.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow: pr.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: pr.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: pr.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: pr.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: pr.productionRuntimeAuthorizedNow,
    paidDocumentModeRuntimeAuthorizedNow: pr.paidDocumentModeRuntimeAuthorizedNow,
    paymentRuntimeAuthorizedNow: pr.paymentRuntimeAuthorizedNow,
    entitlementRuntimeAuthorizedNow: pr.entitlementRuntimeAuthorizedNow,
    checkoutRuntimeAuthorizedNow: pr.checkoutRuntimeAuthorizedNow,

    // Authorization grants
    runtimeAuthorizationGranted: pr.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: pr.pilotAuthorizationGranted,
    productionAuthorizationGranted: pr.productionAuthorizationGranted,
    finalAuthorizationGranted: pr.finalAuthorizationGranted,
    goLiveAuthorizationGranted: pr.goLiveAuthorizationGranted,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: pr.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: pr.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: pr.finalDateInventionAuthorized,
    legalCertaintyAuthorized: pr.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: pr.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: pr.deliveryDateRequiredForExactDeadline,

    // TD flags from 8.6A result
    td001DocumentBypassGuardContainmentClosed: pr.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundaryContainmentClosed: pr.td005PaidDocumentModeBoundaryContainmentClosed,
    td005PaidDocumentModeClientFlagBypassClosed: pr.td005PaidDocumentModeClientFlagBypassClosed,
    td005PaidDocumentModeActualRuntimeImplementationDeferred: pr.td005PaidDocumentModeActualRuntimeImplementationDeferred,
    td004PreModelPiiRedactionPlanned: pr.td004PreModelPiiRedactionPlanned,
    td004PreModelPiiRedactionStillRequiresContract: pr.td004PreModelPiiRedactionStillRequiresContract,
    td004PreModelPiiRedactionStillRequiresRuntimeImplementation: pr.td004PreModelPiiRedactionStillRequiresRuntimeImplementation,
    td004PreModelPiiRedactionStillMissingInProduction: pr.td004PreModelPiiRedactionStillMissingInProduction,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: pr.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: pr.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: pr.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved: pr.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved: pr.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: pr.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: pr.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: pr.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: pr.tmpFilesPresentInWorkingTree,

    // 8.6A forward readiness gate
    readyFor8x6BPreModelPiiRedactionContract: pr.readyFor8x6BPreModelPiiRedactionContract,
    readyForEvidenceGatesProductionWiringPhase: pr.readyForEvidenceGatesProductionWiringPhase,
    readyForServerEntitlementVerificationPhase: pr.readyForServerEntitlementVerificationPhase,
    readyForPaidDocumentModeActualRuntimeImplementationPhase: pr.readyForPaidDocumentModeActualRuntimeImplementationPhase,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: pr.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase,
    readyForControlledRealDocumentPilotAuthorizationPhase: pr.readyForControlledRealDocumentPilotAuthorizationPhase,
    readyForControlledRealDocumentProductionAuthorizationPhase: pr.readyForControlledRealDocumentProductionAuthorizationPhase,
    readyForRealDocumentInput: pr.readyForRealDocumentInput,
    readyForUserVisibleOutput: pr.readyForUserVisibleOutput,
    publicRuntimeEnabled: pr.publicRuntimeEnabled,
    persistenceUsed: pr.persistenceUsed,
    neverUserVisible: pr.neverUserVisible,

    // 8.6B core assertion flags
    preModelPiiRedactionPlanReadyForContract: true,
    preModelPiiRedactionContractOnly: true,
    preModelPiiRedactionContractDefined: true,

    // 8.6B contract boundary obligations
    piiContractRequiresBoundaryBeforePromptBuild: true,
    piiContractRequiresBoundaryBeforeModelCall: true,
    piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: true,
    piiContractRequiresBoundaryAfterControlledInputValidation: true,
    piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: true,
    piiContractDoesNotCreateFreeQaDocumentBypass: true,
    piiContractDoesNotAuthorizeRealDocumentInput: true,
    piiContractDoesNotAuthorizeUserVisibleDocumentOutput: true,
    piiContractDoesNotAuthorizeExactDeadlineCalculation: true,
    piiContractDoesNotAuthorizePublicRuntime: true,

    // 8.6B contract PII class coverage
    piiContractCoversPersonNames: true,
    piiContractCoversPostalAddresses: true,
    piiContractCoversPhoneNumbers: true,
    piiContractCoversEmailAddresses: true,
    piiContractCoversDatesOfBirth: true,
    piiContractCoversCustomerNumbers: true,
    piiContractCoversInsuranceNumbers: true,
    piiContractCoversHealthInsuranceIdentifiers: true,
    piiContractCoversTaxIds: true,
    piiContractCoversSteuerId: true,
    piiContractCoversSteuernummer: true,
    piiContractCoversAktenzeichen: true,
    piiContractCoversVorgangsnummer: true,
    piiContractCoversCaseReferenceNumbers: true,
    piiContractCoversIban: true,
    piiContractCoversBankAccountIdentifiers: true,
    piiContractCoversLicensePlateNumbers: true,
    piiContractCoversEmployerNamesInPersonalContext: true,
    piiContractCoversSignatures: true,
    piiContractCoversHandwrittenNames: true,
    piiContractCoversGreetingsContainingPersonalNames: true,
    piiContractCoversDocumentRecipientBlocks: true,
    piiContractCoversSenderBlocks: true,
    piiContractCoversRealContactDetails: true,
    piiContractCoversRealAuthorityContactBlocksCopiedFromDocuments: true,
    piiContractCoversMedicalHealthContextIdentifiers: true,
    piiContractCoversImmigrationResidencePermitIdentifiers: true,
    piiContractCoversSocialBenefitIdentifiers: true,
    piiContractCoversJobcenterBuergergeldIdentifiers: true,
    piiContractCoversFamilienkasseKindergeldIdentifiers: true,
    piiContractCoversAuslaenderbehoerdeIdentifiers: true,
    piiContractCoversFinanzamtIdentifiers: true,

    // 8.6B contract redaction/masking obligations
    piiContractRequiresDeterministicPlaceholders: true,
    piiContractRequiresStablePlaceholderMappingInsideOneRequest: true,
    piiContractRequiresNoRawPiiPersistenceByDefault: true,
    piiContractRequiresNoRawPiiInPrompt: true,
    piiContractRequiresNoRawPiiInLogs: true,
    piiContractRequiresNoRawPiiInAuditTraces: true,
    piiContractRequiresNoRawPiiInUserVisibleErrorMessages: true,
    piiContractRequiresNoRawPiiInTelemetry: true,
    piiContractRequiresNoRawPiiInModelMetadata: true,
    piiContractRequiresNoRawPiiInEvidenceGateTraces: true,
    piiContractRequiresNoRawPiiInDeadlineTraces: true,
    piiContractRequiresRawToPlaceholderMapLocalEphemeralByDefault: true,
    piiContractRequiresStructuredRedactionAuditWithoutRawValues: true,
    piiContractRequiresCoverageMetricsWithoutRawValues: true,
    piiContractRequiresConservativeFallbackWhenConfidenceUncertain: true,
    piiContractRequiresBlockOrEscalateIfUnsafeToRedact: true,

    // 8.6B contract placeholder obligations
    piiContractAllowsPersonPlaceholder: true,
    piiContractAllowsAddressPlaceholder: true,
    piiContractAllowsPhonePlaceholder: true,
    piiContractAllowsEmailPlaceholder: true,
    piiContractAllowsDobPlaceholder: true,
    piiContractAllowsCustomerIdPlaceholder: true,
    piiContractAllowsInsuranceIdPlaceholder: true,
    piiContractAllowsTaxIdPlaceholder: true,
    piiContractAllowsCaseRefPlaceholder: true,
    piiContractAllowsIbanPlaceholder: true,
    piiContractAllowsAuthorityPlaceholder: true,
    piiContractAllowsEmployerPlaceholder: true,
    piiContractAllowsSignaturePlaceholder: true,
    piiContractAllowsDocumentRecipientPlaceholder: true,
    piiContractAllowsDocumentSenderPlaceholder: true,

    // 8.6B contract safety obligations
    piiContractPreservesLegalSemanticStructureWherePossible: true,
    piiContractMustNotInventMissingFacts: true,
    piiContractMustNotAlterDatesIntoFalseDeadlines: true,
    piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion: true,
    piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: true,
    piiContractMustNotInferRecipientIdentityFromPartialText: true,
    piiContractMustNotInferSenderIdentityFromPartialText: true,
    piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: true,
    piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: true,
    piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: true,
    piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: true,
    piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: true,

    // 8.6B contract failure mode obligations
    piiContractDefinesFailurePiiRedactionRequired: true,
    piiContractDefinesFailurePiiRedactionIncomplete: true,
    piiContractDefinesFailurePiiRedactionConfidenceLow: true,
    piiContractDefinesFailurePiiRedactionUnsafeForModel: true,
    piiContractDefinesFailureBlockedHighRiskIdentifier: true,
    piiContractDefinesFailureBlockedMedicalIdentifier: true,
    piiContractDefinesFailureBlockedImmigrationIdentifier: true,
    piiContractDefinesFailureBlockedFinancialIdentifier: true,
    piiContractDefinesFailureBlockedUnknownDocumentIdentity: true,

    // 8.6B contract downstream obligations
    piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: true,
    piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly: true,
    piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: true,
    piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly: true,
    piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence: true,
    piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: true,
    piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: true,

    // 8.6B contract decision confirmations
    piiContractAcceptsPlan: true,
    piiContractReadyForFutureImplementationPlan: true,
    piiContractDoesNotAuthorizeRuntimeImplementationNow: true,
    piiContractDoesNotAuthorizePiiProcessingNow: true,
    piiContractDoesNotAuthorizeRawPiiHandlingNow: true,
    piiContractDoesNotAuthorizeDocumentProcessingNow: true,
    piiContractDoesNotAuthorizePromptBuildNow: true,
    piiContractDoesNotAuthorizeModelCallNow: true,
    piiContractDoesNotAuthorizeRunSmartTalkNow: true,

    // 8.6B new actual flag
    actualPiiRedactionContractOnly: true,

    // 8.6B no-prohibited-side-effect confirmations
    piiContractConfirmsNoOpenAiCall: true,
    piiContractConfirmsNoFetchCall: true,
    piiContractConfirmsNoProcessEnvRead: true,
    piiContractConfirmsNoSdkUsage: true,
    piiContractConfirmsNo8x3AcRerun: true,
    piiContractConfirmsNoPaymentRuntimeCall: true,
    piiContractConfirmsNoStripeCall: true,
    piiContractConfirmsNoCheckoutCall: true,
    piiContractConfirmsNoEntitlementRuntimeCall: true,
    piiContractConfirmsNoServerEntitlementVerification: true,
    piiContractConfirmsNoOcrRuntimeCall: true,
    piiContractConfirmsNoStorageMutation: true,
    piiContractConfirmsNoDatabaseWrite: true,
    piiContractConfirmsNoAuditPersistence: true,
    piiContractConfirmsNoUserVisibleDocumentExplanation: true,
    piiContractConfirmsNoEvidenceEvaluation: true,
    piiContractConfirmsNoClaimAuthorization: true,
    piiContractConfirmsNoDeadlineCalculation: true,
    piiContractConfirmsNoLegalCertainty: true,
    piiContractConfirmsNoPromptBuild: true,
    piiContractConfirmsNoModelCall: true,
    piiContractConfirmsNoRunSmartTalkCall: true,
    piiContractConfirmsNoRouteHandlerCall: true,
    piiContractConfirmsNoRouteImport: true,
    piiContractConfirmsNoFilesystemRead: true,
    piiContractConfirmsNoPhotoRouteModification: true,

    // 8.6B TD result flags
    td004PreModelPiiRedactionContracted: true,

    // 8.6B forward readiness
    readyFor8x6CPreModelPiiRedactionImplementationPlan: true,
  };
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x6BInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validatePiiRedactionContractInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.6A prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.6B" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("prereq_boundary_closure_ready_for_pii_redaction_planning_false", { paidDocumentModeBoundaryClosureReadyForPiiRedactionPlanning: false });
  expect_rejected("prereq_pii_redaction_plan_not_accepted", { controlledRealDocumentPreModelPiiRedactionPlanAccepted: false });
  expect_rejected("prereq_pii_redaction_planning_only_false", { preModelPiiRedactionPlanningOnly: false });
  expect_rejected("prereq_pii_redaction_plan_defined_false", { preModelPiiRedactionPlanDefined: false });
  expect_rejected("prereq_pii_redaction_runtime_still_not_implemented_false", { preModelPiiRedactionRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_detector_runtime_still_not_implemented_false", { preModelPiiDetectorRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_masking_runtime_still_not_implemented_false", { preModelPiiMaskingRuntimeStillNotImplemented: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_real_document_input_false", { preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_user_visible_output_false", { preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_prompt_build_false", { preModelPiiRedactionDoesNotAuthorizePromptBuild: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_model_call_false", { preModelPiiRedactionDoesNotAuthorizeModelCall: false });
  expect_rejected("prereq_pii_redaction_does_not_authorize_run_smart_talk_false", { preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.6A planning confirmations
  expect_rejected("prereq_pii_plan_boundary_before_prompt_build_false", { piiPlanRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("prereq_pii_plan_boundary_before_model_call_false", { piiPlanRequiresBoundaryBeforeModelCall: false });
  expect_rejected("prereq_pii_plan_boundary_before_run_smart_talk_document_lane_false", { piiPlanRequiresBoundaryBeforeRunSmartTalkDocumentLane: false });
  expect_rejected("prereq_pii_plan_boundary_after_controlled_input_validation_false", { piiPlanRequiresBoundaryAfterControlledInputValidation: false });
  expect_rejected("prereq_pii_plan_boundary_before_evidence_gate_evaluation_false", { piiPlanRequiresBoundaryBeforeEvidenceGateEvaluation: false });
  expect_rejected("prereq_pii_plan_does_not_create_free_qa_document_bypass_false", { piiPlanDoesNotCreateFreeQaDocumentBypass: false });
  expect_rejected("prereq_pii_plan_does_not_authorize_real_document_input_false", { piiPlanDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("prereq_pii_plan_does_not_authorize_user_visible_document_output_false", { piiPlanDoesNotAuthorizeUserVisibleDocumentOutput: false });
  expect_rejected("prereq_pii_plan_does_not_authorize_exact_deadline_calculation_false", { piiPlanDoesNotAuthorizeExactDeadlineCalculation: false });
  expect_rejected("prereq_pii_plan_does_not_authorize_public_runtime_false", { piiPlanDoesNotAuthorizePublicRuntime: false });

  // 8.6A PII class coverage (one tamper per class)
  const piiClasses = ["PersonNames","PostalAddresses","PhoneNumbers","EmailAddresses","DatesOfBirth","CustomerNumbers","InsuranceNumbers","HealthInsuranceIdentifiers","TaxIds","SteuerId","Steuernummer","Aktenzeichen","Vorgangsnummer","CaseReferenceNumbers","Iban","BankAccountIdentifiers","LicensePlateNumbers","EmployerNamesInPersonalContext","Signatures","HandwrittenNames","GreetingsContainingPersonalNames","DocumentRecipientBlocks","SenderBlocks","RealContactDetails","RealAuthorityContactBlocksCopiedFromDocuments","MedicalHealthContextIdentifiers","ImmigrationResidencePermitIdentifiers","SocialBenefitIdentifiers","JobcenterBuergergeldIdentifiers","FamilienkasseKindergeldIdentifiers","AuslaenderbehoerdeIdentifiers","FinanzamtIdentifiers"];
  for (const cls of piiClasses) {
    expect_rejected(`prereq_pii_plan_covers_${cls}_false`, { [`piiPlanCovers${cls}`]: false });
  }

  // 8.6A redaction/masking requirements (one tamper per req)
  const redactionReqs = ["DeterministicPlaceholders","StablePlaceholderMappingInsideOneRequest","NoRawPiiPersistenceByDefault","NoRawPiiInPrompt","NoRawPiiInLogs","NoRawPiiInAuditTraces","NoRawPiiInUserVisibleErrorMessages","NoRawPiiInTelemetry","NoRawPiiInModelMetadata","NoRawPiiInEvidenceGateTraces","NoRawPiiInDeadlineTraces","RawToPlaceholderMapLocalEphemeralByDefault","StructuredRedactionAuditWithoutRawValues","CoverageMetricsWithoutRawValues","ConservativeFallbackWhenConfidenceUncertain","BlockOrEscalateIfUnsafeToRedact"];
  for (const req of redactionReqs) {
    expect_rejected(`prereq_pii_plan_requires_${req}_false`, { [`piiPlanRequires${req}`]: false });
  }

  // 8.6A placeholder confirmations
  const placeholders = ["Person","Address","Phone","Email","Dob","CustomerId","InsuranceId","TaxId","CaseRef","Iban","Authority","Employer","Signature","DocumentRecipient","DocumentSender"];
  for (const ph of placeholders) {
    expect_rejected(`prereq_pii_plan_allows_${ph}_placeholder_false`, { [`piiPlanAllows${ph}Placeholder`]: false });
  }

  // 8.6A safety confirmations
  const safetyKeys = ["piiPlanPreservesLegalSemanticStructureWherePossible","piiPlanMustNotInventMissingFacts","piiPlanMustNotAlterDatesIntoFalseDeadlines","piiPlanMarksProtectedIdentifiersInsteadOfSilentDeletion","piiPlanMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity","piiPlanMustNotInferRecipientIdentityFromPartialText","piiPlanMustNotInferSenderIdentityFromPartialText","piiPlanMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone","piiPlanRedactionSuccessDoesNotAuthorizeFinalLegalAdvice","piiPlanRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation","piiPlanRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer","piiPlanRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation"];
  for (const k of safetyKeys) { expect_rejected(`prereq_${k}_false`, { [k]: false }); }

  // 8.6A failure modes
  const failureModes = ["PiiRedactionRequired","PiiRedactionIncomplete","PiiRedactionConfidenceLow","PiiRedactionUnsafeForModel","BlockedHighRiskIdentifier","BlockedMedicalIdentifier","BlockedImmigrationIdentifier","BlockedFinancialIdentifier","BlockedUnknownDocumentIdentity"];
  for (const fm of failureModes) {
    expect_rejected(`prereq_pii_plan_defines_failure_${fm}_false`, { [`piiPlanDefinesFailure${fm}`]: false });
  }

  // 8.6A downstream confirmations
  const downstreamKeys = ["piiPlanRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly","piiPlanRequiresClaimAuthorizationUseRedactedAnchorsOnly","piiPlanRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized","piiPlanRequiresAuditTracesUsePlaceholderCategoriesOnly","piiPlanRequiresDeadlineLogicStillRequireDeliveryDateEvidence","piiPlanRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized","piiPlanRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts"];
  for (const k of downstreamKeys) { expect_rejected(`prereq_${k}_false`, { [k]: false }); }

  // 8.6A actual flags
  expect_rejected("prereq_actual_pii_redaction_plan_only_false", { actualPiiRedactionPlanOnly: false });
  expect_rejected("prereq_actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("prereq_actual_pii_detector_runtime_implemented_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_masking_runtime_implemented_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("prereq_actual_pii_text_redacted_true", { actualPiiTextRedacted: true });
  expect_rejected("prereq_actual_raw_pii_processed_true", { actualRawPiiProcessed: true });
  expect_rejected("prereq_actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("prereq_actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("prereq_actual_prompt_build_performed_true", { actualPromptBuildPerformed: true });
  expect_rejected("prereq_actual_model_call_performed_true", { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });
  expect_rejected("prereq_actual_evidence_gate_runtime_wiring_performed_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("prereq_actual_claim_authorization_performed_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("prereq_actual_deadline_calculation_performed_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("prereq_actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_paid_document_mode_implemented_true", { actualPaidDocumentModeImplemented: true });
  expect_rejected("prereq_actual_payment_runtime_implemented_true", { actualPaymentRuntimeImplemented: true });
  expect_rejected("prereq_actual_checkout_implemented_true", { actualCheckoutImplemented: true });
  expect_rejected("prereq_actual_entitlement_runtime_implemented_true", { actualEntitlementRuntimeImplemented: true });
  expect_rejected("prereq_actual_server_entitlement_verification_implemented_true", { actualServerEntitlementVerificationImplemented: true });
  expect_rejected("prereq_actual_real_document_input_performed_true", { actualRealDocumentInputPerformed: true });
  expect_rejected("prereq_actual_real_document_processing_performed_true", { actualRealDocumentProcessingPerformed: true });
  expect_rejected("prereq_actual_ocr_performed_true", { actualOcrPerformed: true });
  expect_rejected("prereq_actual_photo_input_processed_true", { actualPhotoInputProcessed: true });
  expect_rejected("prereq_actual_file_input_processed_true", { actualFileInputProcessed: true });
  expect_rejected("prereq_actual_document_storage_performed_true", { actualDocumentStoragePerformed: true });
  expect_rejected("prereq_actual_database_persistence_performed_true", { actualDatabasePersistencePerformed: true });
  expect_rejected("prereq_actual_audit_persistence_performed_true", { actualAuditPersistencePerformed: true });
  expect_rejected("prereq_actual_user_visible_output_performed_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("prereq_actual_public_runtime_enabled_true", { actualPublicRuntimeEnabled: true });

  // 8.6A no-prohibited-side-effect confirmations
  const planSideEffects = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"];
  for (const se of planSideEffects) {
    expect_rejected(`prereq_pii_plan_confirms_${se}_false`, { [`piiPlanConfirms${se}`]: false });
  }

  // Pipeline executed flags
  const pipelineFlags = ["executionSequenceActuallyExecuted","runtimePipelineActuallyExecuted","documentPipelineActuallyExecuted","piiPipelineActuallyExecuted","paymentPipelineActuallyExecuted","entitlementPipelineActuallyExecuted","checkoutPipelineActuallyExecuted","ocrPipelineActuallyExecuted","userVisiblePipelineActuallyExecuted"];
  for (const f of pipelineFlags) { expect_rejected(`prereq_${f}_true`, { [f]: true }); }

  // Runtime authorization flags
  const runtimeAuthFlags = ["preModelPiiRedactionRuntimeAuthorizedNow","realDocumentInputAuthorizedNow","realDocumentProcessingAuthorizedNow","realUserDocumentUploadAuthorizedNow","ocrRuntimeAuthorizedNow","photoInputAuthorizedNow","fileInputAuthorizedNow","documentStorageAuthorizedNow","persistenceAuthorizedNow","publicRuntimeAuthorizedNow","userVisibleLegalDeadlineOutputAuthorizedNow","liveLLMRuntimeAuthorizedNow","connectedAiRuntimeAuthorizedNow","pilotRuntimeAuthorizedNow","productionRuntimeAuthorizedNow","paidDocumentModeRuntimeAuthorizedNow","paymentRuntimeAuthorizedNow","entitlementRuntimeAuthorizedNow","checkoutRuntimeAuthorizedNow"];
  for (const f of runtimeAuthFlags) { expect_rejected(`prereq_${f}_true`, { [f]: true }); }

  // Authorization grants
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
  expect_rejected("prereq_td005_boundary_containment_closed_false", { td005PaidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("prereq_td005_client_flag_bypass_closed_false", { td005PaidDocumentModeClientFlagBypassClosed: false });
  expect_rejected("prereq_td005_actual_runtime_implementation_deferred_false", { td005PaidDocumentModeActualRuntimeImplementationDeferred: false });
  expect_rejected("prereq_td004_planned_false", { td004PreModelPiiRedactionPlanned: false });
  expect_rejected("prereq_td004_still_requires_contract_false", { td004PreModelPiiRedactionStillRequiresContract: false });
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

  // 8.6A forward readiness gate
  expect_rejected("prereq_ready_for_8x6b_contract_false", { readyFor8x6BPreModelPiiRedactionContract: false });
  expect_rejected("prereq_ready_for_evidence_gates_true", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("prereq_ready_for_server_entitlement_true", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("prereq_ready_for_paid_document_mode_actual_runtime_true", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("prereq_ready_for_separate_runtime_authorization_true", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_pilot_authorization_true", { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_production_authorization_true", { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("prereq_ready_for_real_document_input_true", { readyForRealDocumentInput: true });
  expect_rejected("prereq_ready_for_user_visible_output_true", { readyForUserVisibleOutput: true });
  expect_rejected("prereq_public_runtime_enabled_true", { publicRuntimeEnabled: true });
  expect_rejected("prereq_persistence_used_true", { persistenceUsed: true });
  expect_rejected("prereq_never_user_visible_false", { neverUserVisible: false });

  // 8.6B core assertion flags
  expect_rejected("pii_redaction_plan_ready_for_contract_false", { preModelPiiRedactionPlanReadyForContract: false });
  expect_rejected("pii_redaction_contract_only_false", { preModelPiiRedactionContractOnly: false });
  expect_rejected("pii_redaction_contract_defined_false", { preModelPiiRedactionContractDefined: false });

  // 8.6B contract boundary obligations (10)
  expect_rejected("pii_contract_boundary_before_prompt_build_false", { piiContractRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("pii_contract_boundary_before_model_call_false", { piiContractRequiresBoundaryBeforeModelCall: false });
  expect_rejected("pii_contract_boundary_before_run_smart_talk_document_lane_false", { piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: false });
  expect_rejected("pii_contract_boundary_after_controlled_input_validation_false", { piiContractRequiresBoundaryAfterControlledInputValidation: false });
  expect_rejected("pii_contract_boundary_before_evidence_gate_evaluation_false", { piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: false });
  expect_rejected("pii_contract_does_not_create_free_qa_document_bypass_false", { piiContractDoesNotCreateFreeQaDocumentBypass: false });
  expect_rejected("pii_contract_does_not_authorize_real_document_input_false", { piiContractDoesNotAuthorizeRealDocumentInput: false });
  expect_rejected("pii_contract_does_not_authorize_user_visible_document_output_false", { piiContractDoesNotAuthorizeUserVisibleDocumentOutput: false });
  expect_rejected("pii_contract_does_not_authorize_exact_deadline_calculation_false", { piiContractDoesNotAuthorizeExactDeadlineCalculation: false });
  expect_rejected("pii_contract_does_not_authorize_public_runtime_false", { piiContractDoesNotAuthorizePublicRuntime: false });

  // 8.6B contract PII class coverage (32)
  for (const cls of piiClasses) {
    expect_rejected(`pii_contract_covers_${cls}_false`, { [`piiContractCovers${cls}`]: false });
  }

  // 8.6B contract redaction/masking obligations (16)
  for (const req of redactionReqs) {
    expect_rejected(`pii_contract_requires_${req}_false`, { [`piiContractRequires${req}`]: false });
  }

  // 8.6B contract placeholder obligations (15)
  for (const ph of placeholders) {
    expect_rejected(`pii_contract_allows_${ph}_placeholder_false`, { [`piiContractAllows${ph}Placeholder`]: false });
  }

  // 8.6B contract safety obligations (12)
  const contractSafetyKeys = ["piiContractPreservesLegalSemanticStructureWherePossible","piiContractMustNotInventMissingFacts","piiContractMustNotAlterDatesIntoFalseDeadlines","piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion","piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity","piiContractMustNotInferRecipientIdentityFromPartialText","piiContractMustNotInferSenderIdentityFromPartialText","piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone","piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice","piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation","piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer","piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation"];
  for (const k of contractSafetyKeys) { expect_rejected(`${k}_false`, { [k]: false }); }

  // 8.6B contract failure mode obligations (9)
  for (const fm of failureModes) {
    expect_rejected(`pii_contract_defines_failure_${fm}_false`, { [`piiContractDefinesFailure${fm}`]: false });
  }

  // 8.6B contract downstream obligations (7)
  const contractDownstreamKeys = ["piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly","piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly","piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized","piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly","piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence","piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized","piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts"];
  for (const k of contractDownstreamKeys) { expect_rejected(`${k}_false`, { [k]: false }); }

  // 8.6B contract decision confirmations (9)
  expect_rejected("pii_contract_accepts_plan_false", { piiContractAcceptsPlan: false });
  expect_rejected("pii_contract_ready_for_future_implementation_plan_false", { piiContractReadyForFutureImplementationPlan: false });
  expect_rejected("pii_contract_does_not_authorize_runtime_implementation_now_false", { piiContractDoesNotAuthorizeRuntimeImplementationNow: false });
  expect_rejected("pii_contract_does_not_authorize_pii_processing_now_false", { piiContractDoesNotAuthorizePiiProcessingNow: false });
  expect_rejected("pii_contract_does_not_authorize_raw_pii_handling_now_false", { piiContractDoesNotAuthorizeRawPiiHandlingNow: false });
  expect_rejected("pii_contract_does_not_authorize_document_processing_now_false", { piiContractDoesNotAuthorizeDocumentProcessingNow: false });
  expect_rejected("pii_contract_does_not_authorize_prompt_build_now_false", { piiContractDoesNotAuthorizePromptBuildNow: false });
  expect_rejected("pii_contract_does_not_authorize_model_call_now_false", { piiContractDoesNotAuthorizeModelCallNow: false });
  expect_rejected("pii_contract_does_not_authorize_run_smart_talk_now_false", { piiContractDoesNotAuthorizeRunSmartTalkNow: false });

  // 8.6B new actual flag + violations on shared actual flags
  expect_rejected("actual_pii_redaction_contract_only_false", { actualPiiRedactionContractOnly: false });
  expect_rejected("actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("actual_pii_detector_runtime_implemented_true", { actualPiiDetectorRuntimeImplemented: true });
  expect_rejected("actual_pii_masking_runtime_implemented_true", { actualPiiMaskingRuntimeImplemented: true });
  expect_rejected("actual_pii_text_redacted_true", { actualPiiTextRedacted: true });
  expect_rejected("actual_raw_pii_processed_true", { actualRawPiiProcessed: true });
  expect_rejected("actual_raw_pii_persisted_true", { actualRawPiiPersisted: true });
  expect_rejected("actual_raw_pii_logged_true", { actualRawPiiLogged: true });
  expect_rejected("actual_prompt_build_performed_true", { actualPromptBuildPerformed: true });
  expect_rejected("actual_model_call_performed_true", { actualModelCallPerformed: true });
  expect_rejected("actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });
  expect_rejected("actual_evidence_gate_runtime_wiring_performed_true", { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("actual_claim_authorization_performed_true", { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calculation_performed_true", { actualDeadlineCalculationPerformed: true });
  expect_rejected("actual_live_route_mutation_true", { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("actual_smart_talk_route_modified_true", { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("actual_photo_route_modified_true", { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("actual_real_document_input_performed_true", { actualRealDocumentInputPerformed: true });
  expect_rejected("actual_real_document_processing_performed_true", { actualRealDocumentProcessingPerformed: true });
  expect_rejected("actual_user_visible_output_performed_true", { actualUserVisibleOutputPerformed: true });
  expect_rejected("actual_public_runtime_enabled_true", { actualPublicRuntimeEnabled: true });

  // 8.6B no-prohibited-side-effect confirmations (26)
  const contractSideEffects = ["NoOpenAiCall","NoFetchCall","NoProcessEnvRead","NoSdkUsage","No8x3AcRerun","NoPaymentRuntimeCall","NoStripeCall","NoCheckoutCall","NoEntitlementRuntimeCall","NoServerEntitlementVerification","NoOcrRuntimeCall","NoStorageMutation","NoDatabaseWrite","NoAuditPersistence","NoUserVisibleDocumentExplanation","NoEvidenceEvaluation","NoClaimAuthorization","NoDeadlineCalculation","NoLegalCertainty","NoPromptBuild","NoModelCall","NoRunSmartTalkCall","NoRouteHandlerCall","NoRouteImport","NoFilesystemRead","NoPhotoRouteModification"];
  for (const se of contractSideEffects) {
    expect_rejected(`pii_contract_confirms_${se}_false`, { [`piiContractConfirms${se}`]: false });
  }

  // 8.6B pipeline violations
  for (const f of pipelineFlags) { expect_rejected(`${f}_true_result`, { [f]: true }); }

  // 8.6B runtime auth violations
  for (const f of runtimeAuthFlags) { expect_rejected(`${f}_true_result`, { [f]: true }); }

  // 8.6B auth grant violations
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety result violations
  expect_rejected("exact_deadline_calculation_authorized_true", { exactDeadlineCalculationAuthorized: true });

  // 8.6B TD result flags
  expect_rejected("td004_pre_model_pii_redaction_contracted_false", { td004PreModelPiiRedactionContracted: false });
  expect_rejected("td004_still_requires_runtime_implementation_false_result", { td004PreModelPiiRedactionStillRequiresRuntimeImplementation: false });
  expect_rejected("td004_still_missing_in_production_false_result", { td004PreModelPiiRedactionStillMissingInProduction: false });

  // 8.6B forward readiness
  expect_rejected("ready_for_8x6c_implementation_plan_false", { readyFor8x6CPreModelPiiRedactionImplementationPlan: false });
  expect_rejected("ready_for_evidence_gates_true_result", { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("ready_for_server_entitlement_true_result", { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("ready_for_paid_document_mode_actual_runtime_true_result", { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("ready_for_separate_runtime_authorization_true_result", { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true_result", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_result", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true_result", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_result", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_result", { neverUserVisible: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPreModelPiiRedactionContract(): ControlledRealDocumentPreModelPiiRedactionContractResult {
  const canonical = buildCanonical8x6BInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validatePiiRedactionContractInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.6B",
    allPassed,
    preModelPiiRedactionPlanReadyForContract: true,
    controlledRealDocumentPreModelPiiRedactionContractAccepted: allPassed,
    preModelPiiRedactionContractOnly: true,
    preModelPiiRedactionContractDefined: true,
    preModelPiiRedactionRuntimeStillNotImplemented: true,
    preModelPiiDetectorRuntimeStillNotImplemented: true,
    preModelPiiMaskingRuntimeStillNotImplemented: true,
    preModelPiiRedactionDoesNotAuthorizeRealDocumentInput: true,
    preModelPiiRedactionDoesNotAuthorizeUserVisibleOutput: true,
    preModelPiiRedactionDoesNotAuthorizePromptBuild: true,
    preModelPiiRedactionDoesNotAuthorizeModelCall: true,
    preModelPiiRedactionDoesNotAuthorizeRunSmartTalk: true,
    tamperCasesRejected: tamperResult.allRejected,

    piiContractRequiresBoundaryBeforePromptBuild: true,
    piiContractRequiresBoundaryBeforeModelCall: true,
    piiContractRequiresBoundaryBeforeRunSmartTalkDocumentLane: true,
    piiContractRequiresBoundaryAfterControlledInputValidation: true,
    piiContractRequiresBoundaryBeforeEvidenceGateEvaluation: true,
    piiContractDoesNotCreateFreeQaDocumentBypass: true,
    piiContractDoesNotAuthorizeRealDocumentInput: true,
    piiContractDoesNotAuthorizeUserVisibleDocumentOutput: true,
    piiContractDoesNotAuthorizeExactDeadlineCalculation: true,
    piiContractDoesNotAuthorizePublicRuntime: true,

    piiContractCoversPersonNames: true,
    piiContractCoversPostalAddresses: true,
    piiContractCoversPhoneNumbers: true,
    piiContractCoversEmailAddresses: true,
    piiContractCoversDatesOfBirth: true,
    piiContractCoversCustomerNumbers: true,
    piiContractCoversInsuranceNumbers: true,
    piiContractCoversHealthInsuranceIdentifiers: true,
    piiContractCoversTaxIds: true,
    piiContractCoversSteuerId: true,
    piiContractCoversSteuernummer: true,
    piiContractCoversAktenzeichen: true,
    piiContractCoversVorgangsnummer: true,
    piiContractCoversCaseReferenceNumbers: true,
    piiContractCoversIban: true,
    piiContractCoversBankAccountIdentifiers: true,
    piiContractCoversLicensePlateNumbers: true,
    piiContractCoversEmployerNamesInPersonalContext: true,
    piiContractCoversSignatures: true,
    piiContractCoversHandwrittenNames: true,
    piiContractCoversGreetingsContainingPersonalNames: true,
    piiContractCoversDocumentRecipientBlocks: true,
    piiContractCoversSenderBlocks: true,
    piiContractCoversRealContactDetails: true,
    piiContractCoversRealAuthorityContactBlocksCopiedFromDocuments: true,
    piiContractCoversMedicalHealthContextIdentifiers: true,
    piiContractCoversImmigrationResidencePermitIdentifiers: true,
    piiContractCoversSocialBenefitIdentifiers: true,
    piiContractCoversJobcenterBuergergeldIdentifiers: true,
    piiContractCoversFamilienkasseKindergeldIdentifiers: true,
    piiContractCoversAuslaenderbehoerdeIdentifiers: true,
    piiContractCoversFinanzamtIdentifiers: true,

    piiContractRequiresDeterministicPlaceholders: true,
    piiContractRequiresStablePlaceholderMappingInsideOneRequest: true,
    piiContractRequiresNoRawPiiPersistenceByDefault: true,
    piiContractRequiresNoRawPiiInPrompt: true,
    piiContractRequiresNoRawPiiInLogs: true,
    piiContractRequiresNoRawPiiInAuditTraces: true,
    piiContractRequiresNoRawPiiInUserVisibleErrorMessages: true,
    piiContractRequiresNoRawPiiInTelemetry: true,
    piiContractRequiresNoRawPiiInModelMetadata: true,
    piiContractRequiresNoRawPiiInEvidenceGateTraces: true,
    piiContractRequiresNoRawPiiInDeadlineTraces: true,
    piiContractRequiresRawToPlaceholderMapLocalEphemeralByDefault: true,
    piiContractRequiresStructuredRedactionAuditWithoutRawValues: true,
    piiContractRequiresCoverageMetricsWithoutRawValues: true,
    piiContractRequiresConservativeFallbackWhenConfidenceUncertain: true,
    piiContractRequiresBlockOrEscalateIfUnsafeToRedact: true,

    piiContractAllowsPersonPlaceholder: true,
    piiContractAllowsAddressPlaceholder: true,
    piiContractAllowsPhonePlaceholder: true,
    piiContractAllowsEmailPlaceholder: true,
    piiContractAllowsDobPlaceholder: true,
    piiContractAllowsCustomerIdPlaceholder: true,
    piiContractAllowsInsuranceIdPlaceholder: true,
    piiContractAllowsTaxIdPlaceholder: true,
    piiContractAllowsCaseRefPlaceholder: true,
    piiContractAllowsIbanPlaceholder: true,
    piiContractAllowsAuthorityPlaceholder: true,
    piiContractAllowsEmployerPlaceholder: true,
    piiContractAllowsSignaturePlaceholder: true,
    piiContractAllowsDocumentRecipientPlaceholder: true,
    piiContractAllowsDocumentSenderPlaceholder: true,

    piiContractPreservesLegalSemanticStructureWherePossible: true,
    piiContractMustNotInventMissingFacts: true,
    piiContractMustNotAlterDatesIntoFalseDeadlines: true,
    piiContractMarksProtectedIdentifiersInsteadOfSilentDeletion: true,
    piiContractMustNotConvertUnknownAuthorityTextIntoVerifiedAuthorityIdentity: true,
    piiContractMustNotInferRecipientIdentityFromPartialText: true,
    piiContractMustNotInferSenderIdentityFromPartialText: true,
    piiContractMustNotClassifyDocumentAsLegallySufficientBasedOnRedactionAlone: true,
    piiContractRedactionSuccessDoesNotAuthorizeFinalLegalAdvice: true,
    piiContractRedactionSuccessDoesNotAuthorizeExactDeadlineCalculation: true,
    piiContractRedactionSuccessDoesNotAuthorizeUserVisibleDocumentAnswer: true,
    piiContractRedactionSuccessOnlyUnlocksPossibleLaterEvidenceGateEvaluation: true,

    piiContractDefinesFailurePiiRedactionRequired: true,
    piiContractDefinesFailurePiiRedactionIncomplete: true,
    piiContractDefinesFailurePiiRedactionConfidenceLow: true,
    piiContractDefinesFailurePiiRedactionUnsafeForModel: true,
    piiContractDefinesFailureBlockedHighRiskIdentifier: true,
    piiContractDefinesFailureBlockedMedicalIdentifier: true,
    piiContractDefinesFailureBlockedImmigrationIdentifier: true,
    piiContractDefinesFailureBlockedFinancialIdentifier: true,
    piiContractDefinesFailureBlockedUnknownDocumentIdentity: true,

    piiContractRequiresEvidenceGatesConsumeRedactedOrIsolatedContentOnly: true,
    piiContractRequiresClaimAuthorizationUseRedactedAnchorsOnly: true,
    piiContractRequiresUserVisibleOutputNotRevealRawPiiUnlessSeparatelyAuthorized: true,
    piiContractRequiresAuditTracesUsePlaceholderCategoriesOnly: true,
    piiContractRequiresDeadlineLogicStillRequireDeliveryDateEvidence: true,
    piiContractRequiresStoragePersistenceRemainBlockedUntilSeparatelyAuthorized: true,
    piiContractRequiresPaidDocumentRuntimeRemainBlockedUntilRedactionEvidenceEntitlementOutputContracts: true,

    piiContractAcceptsPlan: true,
    piiContractReadyForFutureImplementationPlan: true,
    piiContractDoesNotAuthorizeRuntimeImplementationNow: true,
    piiContractDoesNotAuthorizePiiProcessingNow: true,
    piiContractDoesNotAuthorizeRawPiiHandlingNow: true,
    piiContractDoesNotAuthorizeDocumentProcessingNow: true,
    piiContractDoesNotAuthorizePromptBuildNow: true,
    piiContractDoesNotAuthorizeModelCallNow: true,
    piiContractDoesNotAuthorizeRunSmartTalkNow: true,

    actualPiiRedactionContractOnly: true,
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

    piiContractConfirmsNoOpenAiCall: true,
    piiContractConfirmsNoFetchCall: true,
    piiContractConfirmsNoProcessEnvRead: true,
    piiContractConfirmsNoSdkUsage: true,
    piiContractConfirmsNo8x3AcRerun: true,
    piiContractConfirmsNoPaymentRuntimeCall: true,
    piiContractConfirmsNoStripeCall: true,
    piiContractConfirmsNoCheckoutCall: true,
    piiContractConfirmsNoEntitlementRuntimeCall: true,
    piiContractConfirmsNoServerEntitlementVerification: true,
    piiContractConfirmsNoOcrRuntimeCall: true,
    piiContractConfirmsNoStorageMutation: true,
    piiContractConfirmsNoDatabaseWrite: true,
    piiContractConfirmsNoAuditPersistence: true,
    piiContractConfirmsNoUserVisibleDocumentExplanation: true,
    piiContractConfirmsNoEvidenceEvaluation: true,
    piiContractConfirmsNoClaimAuthorization: true,
    piiContractConfirmsNoDeadlineCalculation: true,
    piiContractConfirmsNoLegalCertainty: true,
    piiContractConfirmsNoPromptBuild: true,
    piiContractConfirmsNoModelCall: true,
    piiContractConfirmsNoRunSmartTalkCall: true,
    piiContractConfirmsNoRouteHandlerCall: true,
    piiContractConfirmsNoRouteImport: true,
    piiContractConfirmsNoFilesystemRead: true,
    piiContractConfirmsNoPhotoRouteModification: true,

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

    readyFor8x6CPreModelPiiRedactionImplementationPlan: true,
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
      "8.6B is a Pre-Model PII Redaction Contract.",
      "8.6B depends on completed 8.6A Pre-Model PII Redaction Plan.",
      "8.6B is contract-only and creates no runtime behavior.",
      "8.6B does not modify /api/smart-talk.",
      "8.6B does not modify /api/smart-talk-photo.",
      "8.6B converts the 8.6A planning requirements into a strict future implementation contract.",
      "8.6B does not implement PII redaction runtime.",
      "8.6B does not implement PII detector runtime.",
      "8.6B does not implement PII masking runtime.",
      "8.6B does not redact real text.",
      "8.6B does not process raw PII.",
      "8.6B does not authorize real document input.",
      "8.6B does not authorize user-visible output.",
      "8.6B does not authorize prompt build, model call, or runSmartTalk.",
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
      "TD-004 is now contracted but still missing in production.",
      "TD-004 still requires runtime implementation.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyFor8x6CPreModelPiiRedactionImplementationPlan is implementation-plan readiness only, not runtime authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
